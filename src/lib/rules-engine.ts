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

// Bolt ⚡ Optimization: Calculates total allocations and tracks last rail key
// in a single pass O(N) to avoid Object.values(), Object.keys(), and array/closure allocations.
export function applyAllocations(
  amount: number,
  actions: Action[]
): Record<string, number> {
  const result: Record<string, number> = {};
  let total = 0;
  let lastKey = "";

  for (const action of actions) {
    if (
      action.type === "allocate" &&
      action.rail &&
      typeof action.amount === "number"
    ) {
      const roundedVal = Math.round(action.amount * 100) / 100;
      if (result[action.rail] !== undefined) {
        total -= result[action.rail];
      }
      result[action.rail] = roundedVal;
      total += roundedVal;
      lastKey = action.rail;
    }
  }

  // Adjust for floating point rounding discrepancies if needed
  if (Math.abs(total - amount) > 0.01 && lastKey !== "") {
    result[lastKey] =
      Math.round((result[lastKey] + (amount - total)) * 100) / 100;
  }
  return result;
}
