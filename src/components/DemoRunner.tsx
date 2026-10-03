"use client";

import { useState } from "react";
import type { ExecuteResponse } from "@/lib/types";

export function DemoRunner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(2500);

  async function run(customAmount?: number) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/belo/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "allocate_income",
          amount: customAmount ?? amount,
          currency: "USD",
          rules: ["income-20-20-60"],
          agent: "Freelancer",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setResult(data as ExecuteResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falló la simulación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-sora)] text-base font-semibold text-[var(--fg)]">
            Demo: cobro + regla 20/20/60
          </h2>
          <p className="text-sm text-[var(--muted)]">
            POST /api/belo/execute · sin fondos reales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--muted)]">
            USD
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="ml-2 w-24 rounded-md border border-[var(--border)] bg-transparent px-2 py-1 text-sm text-[var(--fg)]"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={() => run()}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[#0F172A] disabled:opacity-50"
          >
            {loading ? "Ejecutando…" : "Simular cobro"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => run(2500)}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--fg)] hover:border-[var(--primary)]"
          >
            USD 2.500
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <span
              className={`rounded-full px-3 py-0.5 ${
                result.status === "simulated_ok"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : result.status === "requires_2fa"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-red-500/20 text-red-300"
              }`}
            >
              {result.status}
            </span>
            <span className="text-[var(--muted)]">
              risk {result.risk_score}/100
            </span>
          </div>
          <p className="text-sm text-[var(--fg)]">{result.message}</p>
          {Object.keys(result.allocations).length > 0 && (
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(result.allocations).map(([rail, val]) => (
                <div
                  key={rail}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 p-3"
                >
                  <p className="font-[family-name:var(--font-sora)] text-xl text-[var(--primary)]">
                    {val.toLocaleString("es-AR")}
                  </p>
                  <p className="mt-1 break-all text-xs text-[var(--muted)]">
                    {rail}
                  </p>
                </div>
              ))}
            </div>
          )}
          {result.audit_hash && (
            <p className="font-mono text-[11px] text-[var(--muted)]">
              audit · sha256:{result.audit_hash.slice(0, 16)}…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
