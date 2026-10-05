import { NextRequest, NextResponse } from "next/server";
import { listRules } from "@/lib/rules-engine";
import { adf, targets } from "@/lib/adf";
import { initialBalances, initialGoals } from "@/lib/mock-data";

export const runtime = "nodejs";

function fallbackReply(message: string): string {
  const q = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

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
  return `Entendí: «${message}». En este prototipo respondo con datos simulados de Belo. Probá: «¿cuánto ahorré?», «mostrá reglas», «ADF», «metas» o «simular cobro».`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;

    // Se tiver chave da Groq configurada, usa Llama 3.3 70B
    if (groqKey) {
      try {
        const systemPrompt = `Sos el Financial Copilot inteligente de AgenticBank for Belo.
Respondés de forma ejecutiva, concisa y empática a usuarios freelancers, nómades y pymes en América Latina.
Contexto financiero actual de Belo:
- Saldos: Disponible USD ${initialBalances.available}, Vault USD ${initialBalances.vault}, Impuestos USD ${initialBalances.taxEscrow}.
- Regla 20/20/60: 20% vault ahorro, 20% impuestos, 60% disponible.
- ADF actual: 25% (decisiones autónomas de IA ejecutadas).
- Rieles soportados: USD, USDT/USDC, ARS, BRL (PIX), MXN (SPEI), Belo Mastercard.
Pautas:
- Respondé en el mismo idioma que pregunte el usuario (español o portugués).
- Sé directo, numérico y orientado a metas financieras.`;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return NextResponse.json({
              role: "assistant",
              content,
              mode: "groq-llama-3.3-70b",
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Groq API error, falling back to local engine:", err);
      }
    }

    // Fallback nativo
    return NextResponse.json({
      role: "assistant",
      content: fallbackReply(message),
      mode: "simulated",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
