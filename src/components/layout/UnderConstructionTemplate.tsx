import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { Button } from "../ui/Button";

interface UnderConstructionTemplateProps {
  title: string;
  subtitle: string;
  badgeLabel?: string;
  description?: string;
  children: ReactNode;
}

export function UnderConstructionTemplate({
  title,
  subtitle,
  badgeLabel = "Próximamente",
  description = "Estamos construyendo esta funcionalidad para que puedas operar de forma sencilla y segura en Refugio.",
  children,
}: UnderConstructionTemplateProps) {
  return (
    <AppLayout>
      <div className="relative mx-auto min-w-0 max-w-5xl">
        {/* Encabezado visible de la sección */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-ink">
                {title}
              </h1>
              <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand border border-brand/20">
                {badgeLabel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted mt-1">{subtitle}</p>
          </div>

          <Link to="/dashboard">
            <Button
              type="button"
              variant="secondary"
              className="!py-2 !px-4 text-xs sm:text-sm font-semibold rounded-xl"
            >
              ← Volver al inicio
            </Button>
          </Link>
        </header>

        {/* Contenedor relativo con Overlay centrado */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 shadow-xs">
          {/* Tarjeta flotante de aviso */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-line/80 bg-surface/95 p-6 sm:p-7 text-center shadow-2xl backdrop-blur-md">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-2xs">
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1 text-xs font-bold text-muted border border-line mb-3">
                <span className="size-1.5 rounded-full bg-brand animate-pulse" />
                Sección en desarrollo
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight mb-2">
                {title} estará disponible muy pronto
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-muted mb-6">
                {description} Podrás probar toda la experiencia interactiva con saldos
                simulados en la próxima actualización.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full !py-2.5 !px-5 font-bold text-xs sm:text-sm"
                  >
                    Ir a mi Billetera
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Contenido mock / skeleton blureado */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none filter blur-[3.5px] opacity-55 p-4 sm:p-6"
          >
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
