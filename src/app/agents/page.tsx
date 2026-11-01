import { agents } from "@/lib/mock-data";
import { listRules } from "@/lib/rules-engine";

export default function AgentsPage() {
  const rules = listRules();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Multi-Agent Orchestrator
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl font-semibold">
          Agentes
        </h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {agents.map((a) => (
          <article
            key={a.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-sora)] font-semibold">
                {a.name}
              </h2>
              <span
                className={`text-xs ${
                  a.status === "active"
                    ? "text-[var(--primary)]"
                    : a.status === "waiting_approval"
                      ? "text-amber-300"
                      : "text-[var(--muted)]"
                }`}
              >
                {a.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--primary)]">{a.role}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{a.description}</p>
            {a.lastAction && (
              <p className="mt-3 border-t border-[var(--border)] pt-2 text-xs text-[var(--fg)]">
                Última: {a.lastAction}
              </p>
            )}
          </article>
        ))}
      </div>

      <section className="rounded-xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Ecosistema Cross-Chain
            </p>
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-[var(--fg)]">
              Stellar Agent Layer Integration
            </h2>
          </div>
          <a
            href="https://github.com/srbisnes/stellar-agent-layer"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-purple-500/50 bg-purple-500/10 dark:bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-800 dark:text-purple-300 hover:bg-purple-500/20 dark:hover:bg-purple-500/30"
          >
            Ver Repositorio ↗
          </a>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Capa de ejecución agéntica en Stellar Testnet con Intent Engine, off-ramp de USDC a ARS/fiat, compuerta de seguridad Human-in-the-Loop y soporte para Friendbot y Freighter.
        </p>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="mb-3 font-[family-name:var(--font-sora)] text-sm font-semibold">
          Rules Engine
        </h2>
        <ul className="space-y-2">
          {rules.map((r) => (
            <li key={r.id} className="text-sm">
              <code className="text-[var(--primary)]">{r.id}</code>
              <span className="text-[var(--muted)]"> — {r.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
