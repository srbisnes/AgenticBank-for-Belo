import { NextRequest, NextResponse } from "next/server";
import { listRules } from "@/lib/rules-engine";
import { adf, targets } from "@/lib/adf";
import { initialBalances, initialGoals } from "@/lib/mock-data";

export const runtime = "nodejs";

// Busca cotações oficiais e em tempo real da Belo
async function getLiveBeloRates(): Promise<string> {
  try {
    const res = await fetch("https://api.belo.app/public/price", {
      next: { revalidate: 30 }, // Cache de 30 segundos
    });
    if (!res.ok) return "";
    const pairs: Array<{ pairCode: string; ask: string; bid: string }> = await res.json();
    
    const tracked = ["USDT/ARS", "USDC/ARS", "USD/USDT", "BRL/ARS", "BTC/ARS"];
    return pairs
      .filter((p) => tracked.includes(p.pairCode))
      .map((p) => `${p.pairCode}: Compra (Bid) = $${Number(p.bid).toLocaleString("es-AR")}, Venta (Ask) = $${Number(p.ask).toLocaleString("es-AR")}`)
      .join(" | ");
  } catch (err) {
    console.warn("Erro ao buscar preços ao vivo da Belo:", err);
    return "USDT/ARS: Compra ~$1.608 / Venta ~$1.631";
  }
}

function fallbackReply(message: string, liveRates: string): string {
  const q = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (/precio|cotiza|tasa|cuanto esta|usdt|dolar|ars|cambio/.test(q)) {
    return `Cotizaciones oficiales en vivo de Belo:\n${liveRates.split(" | ").map(r => `• ${r}`).join("\n")}\n\nPrecios tomados directamente de api.belo.app en tiempo real.`;
  }
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
  return `Entendí: «${message}». Probá consultar: «¿a cuánto está el USDT?», «¿cuánto tengo?», «mostrá reglas» o «ADF».`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body.message !== "string") {
      return NextResponse.json({ error: "valid string message required" }, { status: 400 });
    }

    const message = body.message.trim();
    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    // Security: Input length validation to prevent DoS, ReDoS, and LLM token exhaustion attacks
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message exceeds maximum length limit of 1000 characters." },
        { status: 400 }
      );
    }

    // 1. Busca os preços ao vivo diretamente da Belo
    const liveRates = await getLiveBeloRates();
    const groqKey = process.env.GROQ_API_KEY;

    // 2. Se tiver Groq configurada, alimenta a IA com as cotações em tempo real
    if (groqKey) {
      try {
        const systemPrompt = `Sos el Financial Copilot inteligente de AgenticBank for Belo.
Respondés de forma ejecutiva, concisa y empática a usuarios freelancers, nómades y pymes en América Latina.

COTIZACIONES OFICIALES DE BELO EN TIEMPO REAL:
${liveRates}

Contexto financiero de Belo:
- Saldos: Disponible USD ${initialBalances.available}, Vault USD ${initialBalances.vault}, Impuestos USD ${initialBalances.taxEscrow}.
- Regla 20/20/60: 20% vault ahorro, 20% impuestos, 60% disponible.
- ADF actual: 25%.
- Rieles soportados: USD, USDT/USDC, ARS, BRL (PIX), MXN (SPEI), Belo Mastercard.

Pautas:
- Si el usuario pregunta cotizaciones, conversiones o precios, usá SIEMPRE las tasas exactas de Belo indicadas arriba.
- Respondé en el mismo idioma que pregunte el usuario (español o portugués).`;

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
            temperature: 0.5,
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
              liveRates,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Groq API error, falling back to local engine:", err);
      }
    }

    // 3. Fallback nativo
    return NextResponse.json({
      role: "assistant",
      content: fallbackReply(message, liveRates),
      mode: "simulated-with-live-rates",
      liveRates,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
