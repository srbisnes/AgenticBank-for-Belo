export default function PitchPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Inversores
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl font-semibold">
          Pitch & documentos
        </h1>
      </header>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
        <p className="text-sm text-[var(--muted)]">
          Presentación interactiva y briefs viven en el repositorio original
          bajo <code className="text-[var(--primary)]">docs/investors/</code>.
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              className="text-[var(--primary)] hover:underline"
              href="https://github.com/srbisnes/AgenticBank-for-Belo/blob/main/docs/investors/index.html"
              target="_blank"
              rel="noreferrer"
            >
              Presentación HTML (repo)
            </a>
          </li>
          <li>
            <a
              className="text-[var(--primary)] hover:underline"
              href="https://github.com/srbisnes/AgenticBank-for-Belo/blob/main/docs/investors/INVESTOR_BRIEF.md"
              target="_blank"
              rel="noreferrer"
            >
              Investor brief (ES)
            </a>
          </li>
          <li>
            <a
              className="text-[var(--primary)] hover:underline"
              href="https://github.com/srbisnes/AgenticBank-for-Belo/blob/main/docs/ARCHITECTURE.md"
              target="_blank"
              rel="noreferrer"
            >
              Arquitectura
            </a>
          </li>
        </ul>
        <p className="border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
          Prototipo independiente · No es producto oficial de Belo · Cifras =
          hipótesis de planificación · Sin fondos reales
        </p>
      </div>
    </div>
  );
}
