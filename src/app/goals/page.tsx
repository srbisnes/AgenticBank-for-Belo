import { initialGoals } from "@/lib/mock-data";

export default function GoalsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Goal Engine
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl font-semibold">
          Metas
        </h1>
        <p className="text-sm text-[var(--muted)]">
          El usuario define la meta; los agentes proponen el plan multi-paso.
        </p>
      </header>

      <div className="space-y-4">
        {initialGoals.map((g) => {
          const pct = Math.min(
            100,
            Math.round((g.currentAmount / g.targetAmount) * 100)
          );
          return (
            <article
              key={g.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-semibold">
                    {g.title}
                  </h2>
                  <p className="text-sm text-[var(--muted)]">
                    Agente {g.agent} · deadline {g.deadline}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    g.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : g.status === "paused"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-[var(--primary)]/20 text-[var(--primary)]"
                  }`}
                >
                  {g.status}
                </span>
              </div>
              <p className="mt-3 text-sm">
                <span className="text-[var(--primary)]">
                  {g.currency} {g.currentAmount.toLocaleString("es-AR")}
                </span>
                <span className="text-[var(--muted)]">
                  {" "}
                  / {g.targetAmount.toLocaleString("es-AR")}
                </span>
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--primary)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
