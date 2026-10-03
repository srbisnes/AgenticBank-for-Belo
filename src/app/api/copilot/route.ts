import { NextRequest, NextResponse } from "next/server";
import { listRules } from "@/lib/rules-engine";
import { adf, targets } from "@/lib/adf";
import { initialBalances, initialGoals } from "@/lib/mock-data";

export const runtime = "nodejs";

function reply(message: string): string {
  const q = message.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

  if (/ahorr|vault|fondo/.test(q)) {
    const g = initialGoals[0];
    return `Tenés USD ${initialBalances.vault.toLocaleString("es-AR")} en BELO_VAULT_SWEEP. Tu meta «${g.title}» va ${Math.round((g.currentAmount / g.targetAmount) * 100)}% (USD ${g.currentAmount.toLocaleString("es-AR")} / ${g.targetAmount.toLocaleString("es-AR")}). Con la regla 20/20/60, cada cobro suma automáticamente al vault.`;
  }

  if (/saldo|balance|disponible|cuanto tengo/.test(q)) {
    const total =
      initialBalances.available +
      initialBalances.vault +
      initialBalances.taxEscrow;
    return `Saldos simulados: disponible USD ${initialBalances.available.toLocaleString("es-AR")}, vault ${initialBalances.vault.toLocaleString("es-AR")}, impuestos ${initialBalances.taxEscrow.toLocaleString("es-AR")}. Net worth ~ USD ${total.toLocaleString("es-AR")}.`;
  }

  if (/regla|rule|20/.test(q)) {
    const rules = listRules()
      .map((r) => `• ${r.id}: ${r.description}`)
      .join("\n");
    return `Reglas activas del Rules Engine:\n${rules}`;
  }

  if (/adf|autonom/.test(q)) {
    const current = adf(12, 48);
    return `ADF actual (simulado): ${current}%. Hipótesis de roadmap: Año 1 → ${targets.year1}% · Año 2 → ${targets.year2}% · Año 3 → ${targets.year3}%. ADF = decisiones de IA ejecutadas / decisiones financieras totales.`;
  }

  if (/meta|goal|ahorrar/.test(q)) {
    const lines = initialGoals
      .map(
        (g) =>
          `• ${g.title}: ${g.currentAmount}/${g.targetAmount} ${g.currency} (${g.status}) — agente ${g.agent}`
      )
      .join("\n");
    return `Metas del Goal Engine:\n${lines}`;
  }

  if (/agente|agent/.test(q)) {
    return `Agentes activos: Freelancer (ingresos), Travel (viajes/FX), Family Remittance (remesas), Treasury (cash flow), Investment & Yield. Cada uno opera solo dentro de límites que vos aprobás.`;
  }

  if (/demo|2500|cobro|ejecut/.test(q)) {
    return `Para correr el demo de cobro USD 2.500 con regla 20/20/60, usá el botón «Simular cobro USD 2.500» en el Dashboard. Genera asignaciones + recibo SHA-256 sin mover dinero real.`;
  }

  if (/hola|buenas|hey|hello/.test(q)) {
    return `Hola. Soy el Financial Copilot de AgenticBank (prototipo). Podés preguntarme por saldos, ahorro, reglas, ADF, metas o agentes. Todo es simulado — sin fondos reales.`;
  }

  return `Entendí: «${message}». En este prototipo respondo con datos simulados. Probá: «¿cuánto ahorré?», «mostrá reglas», «ADF», «metas» o «simular cobro».`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }
    return NextResponse.json({
      role: "assistant",
      content: reply(message),
      mode: "simulated",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
