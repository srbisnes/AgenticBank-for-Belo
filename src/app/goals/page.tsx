"use client";

import { useState } from "react";
import { useBankState } from "@/lib/state-context";

export default function GoalsPage() {
  const { goals, addGoal } = useBankState();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState(1000);
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("2026-12-31");
  const [agent, setAgent] = useState("Freelancer");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || targetAmount <= 0) return;

    addGoal({
      title,
      targetAmount,
      currentAmount: 0,
      currency,
      deadline,
      status: "active",
      agent,
    });

    setTitle("");
    setTargetAmount(1000);
    setShowModal(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Goal Engine
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-2xl font-semibold">
            Metas
          </h1>
          <p className="text-sm text-[var(--muted)]">
            El usuario define la meta; los agentes proponen el plan multi-paso.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[#0F172A] hover:opacity-90 transition"
        >
          + Nueva Meta
        </button>
      </header>

      {/* Modal para crear meta */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-sora)]">
              Crear nueva meta
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-[var(--muted)]">Título de la meta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Comprar laptop M3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[var(--muted)]">Monto Objetivo</label>
                  <input
                    type="number"
                    min={1}
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Moneda</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)]"
                  >
                    <option value="USD">USD</option>
                    <option value="USDT">USDT</option>
                    <option value="BRL">BRL</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[var(--muted)]">Fecha límite</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Agente asignado</label>
                  <select
                    value={agent}
                    onChange={(e) => setAgent(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)]"
                  >
                    <option value="Freelancer">Freelancer</option>
                    <option value="Travel">Travel</option>
                    <option value="Family Remittance">Family Remittance</option>
                    <option value="Treasury">Treasury</option>
                    <option value="Investment & Yield">Investment & Yield</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[#0F172A]"
                >
                  Guardar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {goals.map((g) => {
          const pct = Math.min(
            100,
            Math.round((g.currentAmount / g.targetAmount) * 100)
          );
          return (
            <article
              key={g.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all"
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
                <span className="text-[var(--primary)] font-bold">
                  {g.currency} {g.currentAmount.toLocaleString("es-AR")}
                </span>
                <span className="text-[var(--muted)]">
                  {" "}
                  / {g.targetAmount.toLocaleString("es-AR")}
                </span>
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
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
