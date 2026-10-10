"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/copilot", label: "Copilot", icon: "✦" },
  { href: "/goals", label: "Metas", icon: "◎" },
  { href: "/agents", label: "Agentes", icon: "⬡" },
  { href: "/audit", label: "Auditoría", icon: "☰" },
  { href: "/pitch", label: "Pitch", icon: "◆" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] px-3 py-5">
      <div className="mb-8 px-2">
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Prototipo
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-[var(--fg)]">
          AgenticBank
        </h1>
        <p className="text-xs text-[var(--primary)]">for Belo · simulado</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                  : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--fg)]"
              }`}
            >
              <span className="w-4 text-center opacity-80">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 border-t border-[var(--border)] pt-3 px-2">
        <a
          href="https://github.com/srbisnes/stellar-agent-layer"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-md p-1.5 text-[11px] text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--fg)]"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[var(--primary)]">★</span> Stellar Agent Layer
          </span>
          <span className="text-[9px] text-[var(--muted)] opacity-70 group-hover:opacity-100">↗</span>
        </a>
        <p className="mt-2 text-[10px] leading-relaxed text-[var(--muted)]">
          No es producto oficial de Belo. No mueve dinero real. APIs simuladas.
        </p>
      </div>
    </aside>
  );
}
