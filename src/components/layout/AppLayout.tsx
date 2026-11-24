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

type NavigationIconName =
  | "home"
  | "operate"
  | "movements"
  | "goals"
  | "assistant";

interface NavigationItem {
  label: string;
  icon: NavigationIconName;
}

const upcomingSections: NavigationItem[] = [
  { label: "Comprar / Vender", icon: "operate" },
  { label: "Intercambiar", icon: "operate" },
  { label: "Movimientos", icon: "movements" },
  { label: "Metas de ahorro", icon: "goals" },
  { label: "Asistente", icon: "assistant" },
];

const mobileUpcomingSections: NavigationItem[] = [
  { label: "Operar", icon: "operate" },
  { label: "Movimientos", icon: "movements" },
  { label: "Asistente", icon: "assistant" },
];

function NavigationIcon({ name }: { name: NavigationIconName }) {
  const paths: Record<NavigationIconName, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9" />
        <path d="M9 21v-8h6v8" />
      </>
    ),
    operate: (
      <>
        <path d="M4 7h16m-4-4 4 4-4 4" />
        <path d="M20 17H4m4-4-4 4 4 4" />
      </>
    ),
    movements: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
    goals: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    assistant: (
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3a8.5 8.5 0 0 1 8.5 8.5Z" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {paths[name]}
    </svg>
  );
}

function DevelopmentIndicator() {
  return (
    <span aria-hidden="true" className="shrink-0 text-xs">
      🚧
    </span>
  );
}

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

function DesktopNavigation() {
  return (
    <nav
      aria-label="Navegación principal"
      className="grid min-w-0 grid-cols-1 gap-1"
    >
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          [
            "flex min-h-11 min-w-0 items-center gap-3 rounded-xl",
            "px-3 py-2 text-sm font-semibold",
            isActive
              ? "bg-brand-soft text-brand"
              : "text-ink hover:bg-surface-soft",
          ].join(" ")
        }
      >
        <NavigationIcon name="home" />
        <span>Inicio</span>
      </NavLink>

      {upcomingSections.map((section) => (
        <button
          key={section.label}
          type="button"
          disabled
          aria-label={`${section.label}, en desarrollo`}
          title={`${section.label}: en desarrollo`}
          className="flex min-h-11 min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-muted"
        >
          <NavigationIcon name={section.icon} />

          <span className="min-w-0 flex-1 wrap-break-word">
            {section.label}
          </span>

          <DevelopmentIndicator />
        </button>
      ))}
    </nav>
  );
}

function MobileNavigation() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            [
              "relative flex min-h-14 min-w-0 flex-col items-center",
              "justify-center gap-1 rounded-lg px-1 py-2",
              "text-[11px] font-semibold",
              isActive
                ? "bg-brand-soft text-brand"
                : "text-muted hover:bg-surface-soft",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <NavigationIcon name="home" />
              <span>Inicio</span>

              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand"
                />
              )}
            </>
          )}
        </NavLink>

        {mobileUpcomingSections.map((section) => (
          <button
            key={section.label}
            type="button"
            disabled
            aria-label={`${section.label}, en desarrollo`}
            title={`${section.label}: en desarrollo`}
            className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium text-muted"
          >
            <span className="relative inline-flex">
              <NavigationIcon name={section.icon} />

              <span
                aria-hidden="true"
                className="absolute -right-2 -top-1 text-[9px]"
              >
                🚧
              </span>
            </span>

            <span>{section.label}</span>
          </button>
        ))}
      </div>
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

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto border-r border-line bg-surface/80 p-5 backdrop-blur-md lg:flex">
        <Brand />

        <div className="mt-8 min-w-0">
          <DesktopNavigation />
        </div>

        <div className="mt-auto pt-8">
          <p className="rounded-xl border border-line bg-page p-3 text-xs leading-relaxed text-muted">
            Aprendé y explorá con saldos ficticios.
          </p>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="border-b border-line bg-surface/80">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="lg:hidden">
                <Brand />
              </div>

              <span className="inline-flex items-center gap-2 rounded-lg bg-surface-soft px-3 py-2 text-xs font-semibold text-ink">
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v6M12 7h.01" />
                </svg>

                Simulación · Sin dinero real
              </span>

              <div className="flex min-w-0 items-center gap-3">
                <span
                  title={userName}
                  className="hidden min-w-0 max-w-52 truncate text-sm text-muted sm:block"
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
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full min-w-0 max-w-7xl scroll-mb-24 px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 lg:scroll-mb-0 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}