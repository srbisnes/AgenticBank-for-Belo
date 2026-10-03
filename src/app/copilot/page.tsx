"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function CopilotPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Financial Copilot listo (modo simulado). Preguntá por saldos, ahorro, reglas, ADF, metas o agentes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.content || data.error || "Sin respuesta",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error de red al contactar al copilot." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const chips = [
    "¿Cuánto ahorré?",
    "Mostrá reglas",
    "ADF actual",
    "Metas",
    "Simular cobro",
  ];

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          AI Layer
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl font-semibold">
          Financial Copilot
        </h1>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "ml-auto bg-[var(--primary)]/20 text-[var(--fg)]"
                  : "bg-white/5 text-[var(--fg)]"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <p className="text-xs text-[var(--muted)]">Pensando…</p>
          )}
        </div>
        <div className="border-t border-[var(--border)] p-3">
          <div className="mb-2 flex flex-wrap gap-1">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => send(c)}
                className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí en lenguaje natural…"
              className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[#0F172A] disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
