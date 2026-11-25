import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Button } from "../ui/Button";
import { RefugioLogo } from "../ui/RefugioLogo";
import { UserAvatar } from "../ui/UserAvatar";
import { useAuth } from "../../context/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
  userName?: string;
  onLogout?: () => void;
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
  to: string;
  icon: NavigationIconName;
}

const desktopNavigationItems: NavigationItem[] = [
  { label: "Inicio", to: "/dashboard", icon: "home" },
  { label: "Comprar / Vender", to: "/trade", icon: "operate" },
  { label: "Intercambiar", to: "/swap", icon: "operate" },
  { label: "Movimientos", to: "/movements", icon: "movements" },
  { label: "Metas de ahorro", to: "/goals", icon: "goals" },
  { label: "Asistente", to: "/assistant", icon: "assistant" },
];

const mobileNavigationItems: NavigationItem[] = [
  { label: "Inicio", to: "/dashboard", icon: "home" },
  { label: "Operar", to: "/trade", icon: "operate" },
  { label: "Swap", to: "/swap", icon: "operate" },
  { label: "Movimientos", to: "/movements", icon: "movements" },
  { label: "Metas", to: "/goals", icon: "goals" },
  { label: "Asistente", to: "/assistant", icon: "assistant" },
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

function Brand() {
  return (
    <RefugioLogo to="/dashboard" size="sm" textClassName="text-2xl font-extrabold" />
  );
}

function DesktopNavigation() {
  return (
    <nav
      aria-label="Navegación principal"
      className="grid min-w-0 grid-cols-1 gap-1"
    >
      {desktopNavigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          className={({ isActive }) =>
            [
              "flex min-h-11 min-w-0 items-center gap-3 rounded-xl",
              "px-3 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-brand-soft text-brand font-bold"
                : "text-ink hover:bg-surface-soft",
            ].join(" ")
          }
        >
          <NavigationIcon name={item.icon} />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
        </NavLink>
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
      <div className="mx-auto grid max-w-lg grid-cols-6 gap-0.5 px-1 py-1.5">
        {mobileNavigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              [
                "relative flex min-h-13 min-w-0 flex-col items-center",
                "justify-center gap-1 rounded-lg px-0.5 py-1.5",
                "text-[10px] font-semibold transition-colors",
                isActive
                  ? "bg-brand-soft text-brand font-bold"
                  : "text-muted hover:bg-surface-soft",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <NavigationIcon name={item.icon} />
                <span className="truncate max-w-full text-center">{item.label}</span>

                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function AppLayout({
  children,
  userName: propUserName,
  onLogout: propOnLogout,
  loggingOut: propLoggingOut,
  logoutError: propLogoutError,
}: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [internalLoggingOut, setInternalLoggingOut] = useState(false);
  const [internalLogoutError, setInternalLogoutError] = useState("");

  const userName =
    propUserName ?? (user?.displayName || user?.email || "Usuario");
  const loggingOut = propLoggingOut ?? internalLoggingOut;
  const logoutError = propLogoutError ?? internalLogoutError;

  const handleLogout = async () => {
    if (propOnLogout) {
      propOnLogout();
      return;
    }

    if (internalLoggingOut) return;

    setInternalLoggingOut(true);
    setInternalLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setInternalLogoutError("No pudimos cerrar sesión. Intentá nuevamente.");
    } finally {
      setInternalLoggingOut(false);
    }
  };

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

              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <NavLink
                  to="/profile"
                  title="Ver mi perfil"
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-2 rounded-xl p-1 sm:px-2.5 sm:py-1.5 transition-colors",
                      isActive
                        ? "bg-brand-soft text-brand font-bold ring-1 ring-brand/30"
                        : "hover:bg-surface-soft text-ink",
                    ].join(" ")
                  }
                >
                  <UserAvatar
                    name={user?.displayName}
                    email={user?.email}
                    size="sm"
                  />
                  <span className="hidden min-w-0 max-w-44 truncate text-xs sm:text-sm font-semibold group-hover:text-brand transition-colors sm:inline-block">
                    Hola, {userName}
                  </span>
                </NavLink>

                <Button
                  variant="ghost"
                  onClick={() => {
                    void handleLogout();
                  }}
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
