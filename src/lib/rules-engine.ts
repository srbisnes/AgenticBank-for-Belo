import type { Action, BankEvent } from "./types";

interface Rule {
  id: string;
  description: string;
  match: (event: BankEvent) => boolean;
  actions: (event: BankEvent) => Action[];
}

const rules: Rule[] = [
  {
    id: "income-20-20-60",
    description:
      "IF ingreso recibido THEN 20% ahorro, 20% impuestos, 60% saldo disponible",
    match: (e) =>
      e.type === "income_received" &&
      typeof e.amount === "number" &&
      e.amount > 0,
    actions: (e) => {
      const amount = e.amount!;
      return [
        {
          type: "allocate",
          rail: "BELO_VAULT_SWEEP",
          percentage: 20,
          amount: Math.round(amount * 0.2 * 100) / 100,
        },
        {
          type: "allocate",
          rail: "BELO_TAX_ISOLATION_ESCROW",
          percentage: 20,
          amount: Math.round(amount * 0.2 * 100) / 100,
        },
        {
          type: "allocate",
          rail: "AVAILABLE_BALANCE",
          percentage: 60,
          amount: Math.round(amount * 0.6 * 100) / 100,
        },
      ];
    },
  },
  {
    id: "ars-devaluation-shield",
    description:
      "IF ARS devalúa > 2,0% en 24h THEN convertir ARS líquido a USDT",
    match: (e) =>
      e.type === "fx_move" &&
      e.pair === "USD/ARS" &&
      typeof e.change24hPct === "number" &&
      e.change24hPct > 2.0,
    actions: () => [
      { type: "convert", from: "ARS", to: "USDT", rail: "BELO_FX_RAIL" },
    ],
  },
];

export function listRules() {
  return rules.map((r) => ({ id: r.id, description: r.description }));
}

export function evaluate(event: BankEvent): Action[] {
  const matched: Action[] = [];
  for (const rule of rules) {
    if (rule.match(event)) {
      matched.push(...rule.actions(event));
    }
  }
  return matched;
}

// Optimization: Single-pass allocation calculations avoiding intermediate array allocations from Object.values/Object.keys
export function applyAllocations(
  amount: number,
  actions: Action[]
): Record<string, number> {
  const result: Record<string, number> = {};
  let total = 0;
  let lastKey: string | null = null;

  for (const action of actions) {
    if (
      action.type === "allocate" &&
      action.rail &&
      typeof action.amount === "number"
    ) {
      const rounded = Math.round(action.amount * 100) / 100;
      if (action.rail in result) {
        total -= result[action.rail];
      }
      result[action.rail] = rounded;
      total += rounded;
      lastKey = action.rail;
    }
  }

  if (lastKey !== null && Math.abs(total - amount) > 0.01) {
    result[lastKey] =
      Math.round((result[lastKey] + (amount - total)) * 100) / 100;
  }
  return result;
}
