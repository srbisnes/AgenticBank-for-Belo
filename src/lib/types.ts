export type EventType = "income_received" | "fx_move";

export interface BankEvent {
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

export interface AuditRecord {
  index: number;
  agent: string;
  decision: string;
  timestamp: string;
  prevHash: string;
  hash: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: string;
  status: "active" | "completed" | "paused";
  agent: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  description: string;
  status: "idle" | "active" | "waiting_approval";
  lastAction?: string;
}

export interface BalanceSnapshot {
  available: number;
  vault: number;
  taxEscrow: number;
  currency: string;
}

export interface ExecuteRequest {
  intent: string;
  amount: number;
  currency: string;
  rules: string[];
  agent: string;
}

export interface ExecuteResponse {
  status: "simulated_ok" | "requires_2fa" | "rejected";
  allocations: Record<string, number>;
  audit_hash: string;
  risk_score: number;
  message: string;
  audit: AuditRecord[];
}
