import { NextRequest, NextResponse } from "next/server";
import { applyAllocations, evaluate } from "@/lib/rules-engine";
import { AuditTrail } from "@/lib/audit";
import type { BankEvent, ExecuteRequest, ExecuteResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ExecuteRequest>;
    const amount = Number(body.amount);
    const currency = typeof body.currency === "string" ? body.currency.trim() : "USD";
    const agent = typeof body.agent === "string" ? body.agent.trim() : "Freelancer";
    const intent = typeof body.intent === "string" ? body.intent.trim() : "allocate_income";

    if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
      return NextResponse.json(
        { error: "amount must be a positive number less than or equal to 1,000,000,000" },
        { status: 400 }
      );
    }

    // Input sanitization and length limits to mitigate DoS and log injection/audit pollution
    if (currency.length > 10 || agent.length > 50 || intent.length > 50) {
      return NextResponse.json(
        { error: "input field lengths exceed maximum allowed limits" },
        { status: 400 }
      );
    }

    const event: BankEvent = {
      type: "income_received",
      amount,
      currency,
      timestamp: new Date().toISOString(),
    };

    const actions = evaluate(event);
    const allocations = applyAllocations(amount, actions);

    const risk_score =
      amount >= 5000 ? 72 : amount >= 3000 ? 85 : 98;
    const requires2fa = risk_score < 80;

    const trail = new AuditTrail();
    trail.record("RulesEngine", `Evaluó income-20-20-60 sobre ${currency} ${amount}`);
    trail.record(
      "RiskEngine",
      `Riesgo simulado ${risk_score}/100 — ${requires2fa ? "requiere 2FA" : "dentro de umbral"}`
    );

    if (requires2fa) {
      trail.record("RiskEngine", "Bloqueo preventivo — esperando aprobación humana");
      const response: ExecuteResponse = {
        status: "requires_2fa",
        allocations: {},
        audit_hash: trail.lastHash(),
        risk_score,
        message:
          "Monto supera umbral de autonomía. Confirmá con 2FA para continuar (simulado).",
        audit: trail.all(),
      };
      return NextResponse.json(response);
    }

    trail.record(
      "ExecutionLayer",
      `Intent ${intent} · agente ${agent} · rieles Belo simulados`
    );
    trail.record("AuditTrail", "Recibo SHA-256 generado");

    const response: ExecuteResponse = {
      status: "simulated_ok",
      allocations,
      audit_hash: trail.lastHash(),
      risk_score,
      message: "Ejecución simulada OK. No se movió dinero real.",
      audit: trail.all(),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "AgenticBank Belo Integration Layer",
    mode: "simulated",
    endpoints: ["POST /api/belo/execute"],
    disclaimer: "Prototipo. No mueve fondos reales. APIs de Belo simuladas.",
  });
}
