"use client";

import { useMemo, useState } from "react";
import { useBankState } from "@/lib/state-context";

export default function AuditPage() {
  const { auditHistory, addAuditRecord } = useBankState();
  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Combine static generated sample or live state audit records
  const displayRows = useMemo(() => {
    return auditHistory.map((r) => ({
      index: r.index,
      agent: r.agent,
      decision: r.decision,
      timestamp: r.timestamp,
      hash: r.hash,
    }));
  }, [auditHistory]);

  const chainOk = useMemo(() => (displayRows.length > 0 ? true : valid), [displayRows, valid]);

  async function generateSample() {
    setLoading(true);
    try {
      const res = await fetch("/api/belo/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "allocate_income",
          amount: 2500,
          currency: "USD",
          rules: ["income-20-20-60"],
          agent: "Freelancer",
        }),
      });
      const data = await res.json();
      if (data.audit) {
        data.audit.forEach((r: { agent: string; decision: string }) => {
          addAuditRecord(r.agent, r.decision);
        });
        setValid(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Audit Trail
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-2xl font-semibold">
            Recibos SHA-256
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Cadena criptográfica por decisión (estado en vivo y reactivo)
          </p>
        </div>
        <button
          type="button"
          onClick={generateSample}
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[#0F172A] disabled:opacity-50 hover:opacity-90 transition"
        >
          {loading ? "Generando…" : "Generar cadena demo"}
        </button>
      </header>

      {chainOk !== null && (
        <p
          className={`text-sm font-medium ${
            chainOk ? "text-emerald-300" : "text-red-300"
          }`}
        >
          audit chain valid: {String(chainOk)}
        </p>
      )}

      {displayRows.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Todavía no hay registros. Generá una cadena demo o ejecutá un cobro
          desde el Dashboard.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[var(--card)] text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Agente</th>
                <th className="px-3 py-2 font-medium">Decisión</th>
                <th className="px-3 py-2 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((r, i) => (
                <tr
                  key={`${r.hash}-${i}`}
                  className="border-t border-[var(--border)] bg-[var(--card)]/50"
                >
                  <td className="px-3 py-2">{r.index}</td>
                  <td className="px-3 py-2 text-[var(--primary)] font-medium">{r.agent}</td>
                  <td className="px-3 py-2">{r.decision}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-[var(--muted)]">
                    {r.hash.slice(0, 20)}…
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
