export function SimulationBadge({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      aria-label="Aviso: Entorno de simulación sin dinero real"
      className={[
        "inline-flex items-center gap-1.5 self-start px-2.5 py-1",
        "rounded-lg bg-surface-soft/90 border border-line/40",
        "text-xs font-semibold text-muted tracking-tight select-none",
        className,
      ].join(" ")}
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="currentColor"
        aria-hidden="true"
        className="shrink-0 text-muted/80"
      >
        <path d="M8 1a7 7 0 1 0 7 7A7.008 7.008 0 0 0 8 1Zm0 12.5A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5ZM8 4.25a.875.875 0 1 0 .875.875A.875.875 0 0 0 8 4.25ZM7.25 7h1.5v4.5h-1.5Z" />
      </svg>
      <span>Simulación · Sin dinero real</span>
    </div>
  );
}
