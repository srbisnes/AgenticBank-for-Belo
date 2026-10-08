"use client";

import { DemoRunner } from "@/components/DemoRunner";
import { adf, targets } from "@/lib/adf";
import { cashFlowSeries } from "@/lib/mock-data";
import { useBankState } from "@/lib/state-context";

export default function DashboardPage() {
  const { balances, goals, aiDecisionsCount, totalDecisionsCount } = useBankState();

  const netWorth =
    balances.available + balances.vault + balances.taxEscrow;
  const currentAdf = adf(aiDecisionsCount, totalDecisionsCount);
  const maxCash = Math.max(
    ...cashFlowSeries.flatMap((c) => [c.income, c.expense])
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Panel Principal
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl font-semibold text-[var(--fg)]">
          Patrimonio Neto y Flujo de Fondos
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Estado reactivo en vivo · prototipo de prueba sin fondos reales
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Net Worth",
            value: `USD ${netWorth.toLocaleString("es-AR")}`,
          },
          {
            label: "Disponible",
            value: `USD ${balances.available.toLocaleString("es-AR")}`,
          },
          {
            label: "Vault",
            value: `USD ${balances.vault.toLocaleString("es-AR")}`,
          },
          {
            label: "ADF",
            value: `${currentAdf}%`,
            sub: `meta Y1 ${targets.year1}%`,
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all"
          >
            <p className="text-xs text-[var(--muted)]">{c.label}</p>
            <p className="mt-1 font-[family-name:var(--font-sora)] text-xl text-[var(--primary)] font-bold">
              {c.value}
            </p>
            {"sub" in c && c.sub && (
              <p className="text-xs text-[var(--muted)]">{c.sub}</p>
            )}
          </div>
        ))}
      </div>

      <DemoRunner />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 font-[family-name:var(--font-sora)] text-sm font-semibold text-[var(--fg)]">
            Cash flow (6 meses)
          </h2>
          <div className="flex h-40 items-end gap-2">
            {cashFlowSeries.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-32 w-full items-end justify-center gap-0.5">
                  <div
                    className="w-2 rounded-t bg-[var(--primary)]/80"
                    style={{ height: `${(m.income / maxCash) * 100}%` }}
                    title={`Ingreso ${m.income}`}
                  />
                  <div
                    className="w-2 rounded-t bg-[var(--muted)]/40"
                    style={{ height: `${(m.expense / maxCash) * 100}%` }}
                    title={`Gasto ${m.expense}`}
                  />
                </div>
                <span className="text-[10px] text-[var(--muted)]">{m.month}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[var(--muted)]">
            Verde = ingreso · gris = gasto (simulado)
          </p>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 font-[family-name:var(--font-sora)] text-sm font-semibold text-[var(--fg)]">
            Metas activas ({goals.length})
          </h2>
          <ul className="space-y-3">
            {goals.map((g) => {
              const pct = Math.min(
                100,
                Math.round((g.currentAmount / g.targetAmount) * 100)
              );
              return (
                <li key={g.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-[var(--fg)]">{g.title}</span>
                    <span className="text-[var(--muted)]">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
