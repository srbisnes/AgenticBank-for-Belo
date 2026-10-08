"use client";

import { useState } from "react";
import type { ExecuteResponse } from "@/lib/types";
import { useBankState } from "@/lib/state-context";

export function DemoRunner() {
  const { applyIncomeAllocation } = useBankState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(2500);
  const [show2FA, setShow2FA] = useState(false);
  const [code2FA, setCode2FA] = useState("");
  const [pendingAllocations, setPendingAllocations] = useState<Record<string, number> | null>(null);

  async function run(customAmount?: number) {
    const runAmount = customAmount ?? amount;
    setLoading(true);
    setError(null);
    setResult(null);
    setShow2FA(false);
    try {
      const res = await fetch("/api/belo/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "allocate_income",
          amount: runAmount,
          currency: "USD",
          rules: ["income-20-20-60"],
          agent: "Freelancer",
        }),
      });
      const data = (await res.json()) as ExecuteResponse;
      if (!res.ok) throw new Error((data as unknown as { error?: string }).error || "Error");

      setResult(data);

      if (data.status === "simulated_ok" && data.allocations) {
        applyIncomeAllocation(runAmount, data.allocations, data.audit);
      } else if (data.status === "requires_2fa") {
        // Calculate allocations locally if 2FA is needed so user can approve it
        const calculated = {
          BELO_VAULT_SWEEP: Math.round(runAmount * 0.2 * 100) / 100,
          BELO_TAX_ISOLATION_ESCROW: Math.round(runAmount * 0.2 * 100) / 100,
          AVAILABLE_BALANCE: Math.round(runAmount * 0.6 * 100) / 100,
        };
        setPendingAllocations(calculated);
        setShow2FA(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falló la simulación");
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm2FA() {
    if (!code2FA.trim()) return;
    if (pendingAllocations && result) {
      applyIncomeAllocation(amount, pendingAllocations, result.audit);
      setResult({
        ...result,
        status: "simulated_ok",
        allocations: pendingAllocations,
        message: "Aprobación 2FA confirmada con éxito. Fondos asignados.",
      });
    }
    setShow2FA(false);
    setCode2FA("");
    setPendingAllocations(null);
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-sora)] text-base font-semibold text-[var(--fg)]">
            Demo: cobro + regla 20/20/60
          </h2>
          <p className="text-sm text-[var(--muted)]">
            POST /api/belo/execute · actualiza saldos en tiempo real
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
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[#0F172A] disabled:opacity-50 hover:opacity-90 transition"
          >
            {loading ? "Ejecutando…" : "Simular cobro"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setAmount(2500);
              run(2500);
            }}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--fg)] hover:border-[var(--primary)] transition"
          >
            USD 2.500
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setAmount(5500);
              run(5500);
            }}
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-300 hover:border-amber-400 transition"
            title="Prueba flujo de 2FA por alto valor (> USD 5.000)"
          >
            USD 5.500 (2FA)
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Modal 2FA Interactivo */}
      {show2FA && (
        <div className="mb-4 rounded-xl border border-amber-500/50 bg-amber-950/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-amber-300">
              ⚠️ Verificación 2FA requerida (Monto {`>`} USD 3.000)
            </span>
            <span className="text-xs text-amber-400/80">Riesgo evaluado: Alto</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            El Risk Engine requiere confirmación manual para autorizar la asignación automática.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ingresá código 2FA (ej: 123456)"
              value={code2FA}
              onChange={(e) => setCode2FA(e.target.value)}
              className="rounded-lg border border-amber-500/40 bg-black/40 px-3 py-1.5 text-sm text-[var(--fg)] outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleConfirm2FA}
              className="rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-semibold text-black hover:bg-amber-300 transition"
            >
              Confirmar
            </button>
          </div>
        </div>
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
          {result.allocations && Object.keys(result.allocations).length > 0 && (
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(result.allocations).map(([rail, val]) => (
                <div
                  key={rail}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 p-3"
                >
                  <p className="font-[family-name:var(--font-sora)] text-xl text-[var(--primary)] font-bold">
                    + USD {val.toLocaleString("es-AR")}
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
