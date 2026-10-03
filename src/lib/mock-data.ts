import type { AgentInfo, BalanceSnapshot, Goal } from "./types";

export const initialBalances: BalanceSnapshot = {
  available: 4250.0,
  vault: 1800.0,
  taxEscrow: 920.0,
  currency: "USD",
};

export const initialGoals: Goal[] = [
  {
    id: "g1",
    title: "Fondo de emergencia",
    targetAmount: 10000,
    currentAmount: 3200,
    currency: "USD",
    deadline: "2026-12-31",
    status: "active",
    agent: "Freelancer",
  },
  {
    id: "g2",
    title: "Viaje a México Q3",
    targetAmount: 2500,
    currentAmount: 890,
    currency: "USD",
    deadline: "2026-09-15",
    status: "active",
    agent: "Travel",
  },
  {
    id: "g3",
    title: "Remesa familiar mensual",
    targetAmount: 400,
    currentAmount: 400,
    currency: "USD",
    deadline: "2026-10-05",
    status: "completed",
    agent: "Family Remittance",
  },
];

export const agents: AgentInfo[] = [
  {
    id: "freelancer",
    name: "Freelancer",
    role: "Ingresos & ahorro",
    description:
      "Aplica reglas 20/20/60 a cobros, separa impuestos y alimenta el vault.",
    status: "active",
    lastAction: "Asignó ingreso USD 2.500",
  },
  {
    id: "travel",
    name: "Travel",
    role: "Viajes & FX",
    description:
      "Planifica presupuestos de viaje, alertas de tipo de cambio y reservas.",
    status: "idle",
    lastAction: "Sin actividad reciente",
  },
  {
    id: "family",
    name: "Family Remittance",
    role: "Remesas",
    description:
      "Automatiza envíos familiares dentro de límites y ventanas horarias.",
    status: "waiting_approval",
    lastAction: "Pendiente 2FA · USD 180",
  },
  {
    id: "treasury",
    name: "Treasury",
    role: "Tesorería 30–90d",
    description:
      "Proyecta cash flow, lotes de pago y cobertura FX.",
    status: "active",
    lastAction: "Proyección 60 días actualizada",
  },
  {
    id: "investment",
    name: "Investment & Yield",
    role: "Rendimientos",
    description:
      "Sugiere yield en vault y rebalanceos (solo simulado en prototipo).",
    status: "idle",
    lastAction: "Sugerencia: +0.4% APY vault",
  },
];

export const cashFlowSeries = [
  { month: "May", income: 4200, expense: 3100 },
  { month: "Jun", income: 5100, expense: 3400 },
  { month: "Jul", income: 4800, expense: 3600 },
  { month: "Ago", income: 6200, expense: 3900 },
  { month: "Sep", income: 5500, expense: 3700 },
  { month: "Oct", income: 5800, expense: 3500 },
];

export const demoIncomeEvent = {
  type: "income_received" as const,
  amount: 2500,
  currency: "USD",
  timestamp: new Date().toISOString(),
};
