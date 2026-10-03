/**
 * Rules Engine — AgenticBank for Belo (prototipo)
 * Eventos y acciones tipados. Reglas: income-20-20-60 y ars-devaluation-shield.
 */

export type EventType = "income_received" | "fx_move";

export interface Event {
  type: EventType;
  amount?: number;
  currency?: string;
  pair?: string;
  change24hPct?: number;
  timestamp?: string;
}

export type ActionType = "allocate" | "convert";

export interface Action {
  type: ActionType;
  rail?: string;
  amount?: number;
  from?: string;
  to?: string;
  percentage?: number;
}

export interface Rule {
  id: string;
  description: string;
  match: (event: Event) => boolean;
  actions: (event: Event) => Action[];
}

const rules: Rule[] = [
  {
    id: "income-20-20-60",
    description: "IF ingreso recibido THEN 20% ahorro, 20% impuestos, 60% saldo disponible",
    match: (e) => e.type === "income_received" && typeof e.amount === "number" && e.amount > 0,
    actions: (e) => {
      const amount = e.amount!;
      return [
        { type: "allocate", rail: "BELO_VAULT_SWEEP", percentage: 20, amount: Math.round(amount * 0.2 * 100) / 100 },
        { type: "allocate", rail: "BELO_TAX_ISOLATION_ESCROW", percentage: 20, amount: Math.round(amount * 0.2 * 100) / 100 },
        { type: "allocate", rail: "AVAILABLE_BALANCE", percentage: 60, amount: Math.round(amount * 0.6 * 100) / 100 },
      ];
    },
  },
  {
    id: "ars-devaluation-shield",
    description: "IF ARS devalúa > 2,0% en 24h THEN convertir ARS líquido a USDT",
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

export function evaluate(event: Event): Action[] {
  const matched: Action[] = [];
  for (const rule of rules) {
    if (rule.match(event)) {
      matched.push(...rule.actions(event));
    }
  }
  return matched;
}

export function applyAllocations(amount: number, actions: Action[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const action of actions) {
    if (action.type === "allocate" && action.rail && typeof action.amount === "number") {
      result[action.rail] = Math.round(action.amount * 100) / 100;
    }
  }
  const total = Object.values(result).reduce((s, v) => s + v, 0);
  if (Math.abs(total - amount) > 0.01 && Object.keys(result).length > 0) {
    const lastKey = Object.keys(result).pop()!;
    result[lastKey] = Math.round((result[lastKey] + (amount - total)) * 100) / 100;
  }
  return result;
}
