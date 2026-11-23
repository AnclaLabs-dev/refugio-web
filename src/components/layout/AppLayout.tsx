import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { Button } from "../ui/Button";

interface AppLayoutProps {
  children: ReactNode;
  userName: string;
  onLogout: () => void;
  loggingOut?: boolean;
  logoutError?: string;
}

const upcomingSections = [
  "Comprar / Vender",
  "Intercambiar",
  "Movimientos",
  "Metas de ahorro",
  "Asistente",
];

function Brand() {
  return (
    <NavLink
      to="/dashboard"
      aria-label="Refugio, ir al inicio"
      className="inline-flex min-h-11 items-center gap-2 text-ink"
    >
      <svg
        viewBox="0 0 40 40"
        width="32"
        height="32"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-brand"
      >
        <path
          d="M7 34V20a13 13 0 0 1 26 0v14"
          stroke="currentColor"
          strokeWidth="6"
        />
      </svg>

      <span className="text-2xl font-extrabold tracking-tight">
        Refugio
      </span>
    </NavLink>
  );
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      aria-label="Navegación principal"
      className={
        mobile
          ? "flex min-w-0 gap-2 overflow-x-auto pb-1"
          : "grid min-w-0 grid-cols-1 gap-2"
      }
    >
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          [
            "inline-flex min-h-11 items-center rounded-xl",
            "px-3 py-2 text-sm font-semibold",
            mobile ? "shrink-0 whitespace-nowrap" : "min-w-0",
            isActive
              ? "bg-brand-soft text-brand"
              : "text-ink hover:bg-surface-soft",
          ].join(" ")
        }
      >
        Inicio
      </NavLink>

      {upcomingSections.map((section) => (
        <button
          key={section}
          type="button"
          disabled
          className={[
            "flex min-h-11 rounded-xl px-3 py-2",
            "text-left text-sm text-muted",
            mobile
              ? "shrink-0 items-center gap-2 whitespace-nowrap"
              : "min-w-0 flex-col items-start gap-1",
          ].join(" ")}
        >
          <span className={mobile ? "" : "wrap-break-word"}>
            {section}
          </span>

          <span className="shrink-0 rounded-md bg-surface-soft px-1.5 py-1 text-xs">
            Próximamente
          </span>
        </button>
      ))}
    </nav>
  );
}

export function AppLayout({
  children,
  userName,
  onLogout,
  loggingOut = false,
  logoutError,
}: AppLayoutProps) {
  return (
    <div className="min-h-svh bg-page text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-brand focus:p-3 focus:text-on-brand"
      >
        Saltar al contenido
      </a>

      {/* Navegación de escritorio */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto border-r border-line bg-surface p-5 lg:flex">
        <Brand />

        <div className="mt-8 min-w-0">
          <Navigation />
        </div>

        <p className="mt-auto mb-0 rounded-xl bg-surface-soft p-3 text-sm text-ink">
          Aprendé y explorá con saldos ficticios.
        </p>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="lg:hidden">
                <Brand />
              </div>

              <span className="rounded-lg bg-surface-soft px-3 py-2 text-xs font-semibold text-ink">
                Simulación · Sin dinero real
              </span>

              <div className="flex min-w-0 items-center gap-3">
                <span
                  title={userName}
                  className="min-w-0 max-w-36 truncate text-sm text-muted sm:max-w-52"
                >
                  Hola, {userName}
                </span>

                <Button
                  variant="ghost"
                  onClick={onLogout}
                  loading={loggingOut}
                  loadingText="Saliendo…"
                  className="shrink-0 text-sm"
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>

            {logoutError && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-danger-surface p-3 text-sm text-danger"
              >
                {logoutError}
              </p>
            )}
          </div>

          {/* Navegación de móvil y tablet */}
          <div className="min-w-0 border-t border-line px-4 py-2 sm:px-6 lg:hidden">
            <Navigation mobile />
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}