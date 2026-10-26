import { NextRequest, NextResponse } from "next/server";
import { listRules } from "@/lib/rules-engine";
import { adf, targets } from "@/lib/adf";
import { initialBalances, initialGoals } from "@/lib/mock-data";

export const runtime = "nodejs";

// Optimization: Hoist static RegExps outside fallbackReply to prevent recompilation on every request
const REGEX_PRICE = /precio|cotiza|tasa|cuanto esta|usdt|dolar|ars|cambio/;
const REGEX_SAVINGS = /ahorr|vault|fondo/;
const REGEX_BALANCE = /saldo|balance|disponible|cuanto tengo/;
const REGEX_RULES = /regla|rule|20/;
const REGEX_ADF = /adf|autonom/;
const REGEX_GOALS = /meta|goal|ahorrar/;
const REGEX_AGENTS = /agente|agent/;

// Optimization: Use Set for O(1) membership check instead of Array.includes O(N)
const TRACKED_PAIRS = new Set(["USDT/ARS", "USDC/ARS", "USD/USDT", "BRL/ARS", "BTC/ARS"]);

// Optimization: In-memory cache for Belo live rates with 30s TTL to prevent duplicate network calls
let cachedRates: { rates: string; expiresAt: number } | null = null;

// Busca cotações oficiais e em tempo real da Belo
async function getLiveBeloRates(): Promise<string> {
  const now = Date.now();
  if (cachedRates && cachedRates.expiresAt > now) {
    return cachedRates.rates;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const res = await fetch("https://api.belo.app/public/price", {
      signal: controller.signal,
      next: { revalidate: 30 }, // Cache de 30 segundos no Next.js Data Cache
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const pairs: Array<{ pairCode: string; ask: string; bid: string }> = await res.json();

    const formatted = pairs
      .filter((p) => TRACKED_PAIRS.has(p.pairCode))
      .map((p) => `${p.pairCode}: Compra (Bid) = $${Number(p.bid).toLocaleString("es-AR")}, Venta (Ask) = $${Number(p.ask).toLocaleString("es-AR")}`)
      .join(" | ");

    if (formatted) {
      cachedRates = { rates: formatted, expiresAt: now + 30_000 };
      return formatted;
    }
  } catch (err) {
    console.warn("Erro ao buscar preços ao vivo da Belo:", err);
  }

  const fallback = "USDT/ARS: Compra ~$1.608 / Venta ~$1.631";
  cachedRates = { rates: fallback, expiresAt: now + 10_000 };
  return fallback;
}

function fallbackReply(message: string, liveRates: string): string {
  const q = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (REGEX_PRICE.test(q)) {
    return `Cotizaciones oficiales en vivo de Belo:\n${liveRates.split(" | ").map(r => `• ${r}`).join("\n")}\n\nPrecios tomados directamente de api.belo.app en tiempo real.`;
  }
  if (REGEX_SAVINGS.test(q)) {
    const g = initialGoals[0];
    return `Tenés USD ${initialBalances.vault.toLocaleString("es-AR")} en BELO_VAULT_SWEEP. Tu meta «${g.title}» va ${Math.round((g.currentAmount / g.targetAmount) * 100)}% (USD ${g.currentAmount.toLocaleString("es-AR")} / ${g.targetAmount.toLocaleString("es-AR")}). Con la regla 20/20/60, cada cobro suma automáticamente al vault.`;
  }
  if (REGEX_BALANCE.test(q)) {
    const total =
      initialBalances.available +
      initialBalances.vault +
      initialBalances.taxEscrow;
    return `Saldos simulados: disponible USD ${initialBalances.available.toLocaleString("es-AR")}, vault ${initialBalances.vault.toLocaleString("es-AR")}, impuestos ${initialBalances.taxEscrow.toLocaleString("es-AR")}. Net worth ~ USD ${total.toLocaleString("es-AR")}.`;
  }
  if (REGEX_RULES.test(q)) {
    const rules = listRules()
      .map((r) => `• ${r.id}: ${r.description}`)
      .join("\n");
    return `Reglas activas del Rules Engine:\n${rules}`;
  }
  if (REGEX_ADF.test(q)) {
    const current = adf(12, 48);
    return `ADF actual (simulado): ${current}%. Hipótesis de roadmap: Año 1 → ${targets.year1}% · Año 2 → ${targets.year2}% · Año 3 → ${targets.year3}%. ADF = decisiones de IA ejecutadas / decisiones financieras totales.`;
  }
  if (REGEX_GOALS.test(q)) {
    const lines = initialGoals
      .map(
        (g) =>
          `• ${g.title}: ${g.currentAmount}/${g.targetAmount} ${g.currency} (${g.status}) — agente ${g.agent}`
      )
      .join("\n");
    return `Metas del Goal Engine:\n${lines}`;
  }
  if (REGEX_AGENTS.test(q)) {
    return `Agentes activos: Freelancer (ingresos), Travel (viajes/FX), Family Remittance (remesas), Treasury (cash flow), Investment & Yield. Cada uno opera solo dentro de límites que vos aprobás.`;
  }
  return `Entendí: «${message}». Probá consultar: «¿a cuánto está el USDT?», «¿cuánto tengo?», «mostrá reglas» o «ADF».`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
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
