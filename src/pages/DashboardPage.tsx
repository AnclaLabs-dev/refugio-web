import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { QuotesPanel } from "../components/dashboard/QuotesPanel";
import { quotesMock } from "../mocks/quotesMock";

const mockBalances = [
  {
    currency: "ARS",
    name: "Peso argentino",
    amount: 250000,
    decimals: 2,
  },
  {
    currency: "USD",
    name: "Dólar estadounidense",
    amount: 500,
    decimals: 2,
  },
  {
    currency: "USDT",
    name: "Tether",
    amount: 200,
    decimals: 2,
  },
  {
    currency: "BTC",
    name: "Bitcoin",
    amount: 0.005,
    decimals: 8,
  },
] as const;

function formatBalance(amount: number, decimals: number) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-brand"
    >
      <path d="M20 8V5a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h14v11H6a3 3 0 0 1-3-3V6" />
      <path d="M20 12h-5v5h5" />
      <path d="M17 14.5h.01" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const userName = user?.displayName || user?.email || "Usuario";

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError(
        "No pudimos cerrar sesión. Intentá nuevamente."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AppLayout
      userName={userName}
      onLogout={() => {
        void handleLogout();
      }}
      loggingOut={loggingOut}
      logoutError={logoutError}
    >
      <div className="relative isolate mx-auto min-w-0 max-w-5xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
        >
          <div className="absolute -right-16 top-0 size-64 rounded-full bg-taupe/15 blur-3xl" />
          <div className="absolute -left-20 top-72 size-64 rounded-full bg-brand/5 blur-3xl" />
        </div>

        <header className="mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Tu dinero, con claridad.
          </h1>
        </header>

        <section
          aria-labelledby="wallet-summary-title"
          className="relative mb-4 overflow-hidden rounded-xl bg-[#95877D] px-4 py-5 text-white shadow-sm sm:px-5"
        >
          {/* Arco de Refugio como marca de agua */}
          <svg
            viewBox="0 0 100 120"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute right-3 -bottom-5 h-32 w-28 text-[#CFC3B8]/65 sm:right-5"
          >
            <path
              d="M16 120V52a34 34 0 0 1 68 0v68"
              stroke="currentColor"
              strokeWidth="16"
            />
          </svg>

          <div className="relative max-w-[75%]">
            <p className="mb-1.5 text-xs font-semibold">
              Billetera de práctica
            </p>

            <h2
              id="wallet-summary-title"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              Aprendé. Explorá. Simulá.
            </h2>

            <p className="mt-2 text-xs leading-relaxed">
              Tus monedas en un solo lugar, con saldos ficticios.
            </p>
          </div>
        </section>

        <section aria-labelledby="balances-title">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 id="balances-title" className="text-sm font-bold">
              Tus balances
            </h2>

            <span className="text-[11px] font-medium text-muted">
              Datos de ejemplo
            </span>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2 md:grid-cols-4">
            {mockBalances.map((balance) => (
              <div
                key={balance.currency}
                role="group"
                aria-label={balance.name}
                className="min-w-0 rounded-xl border border-line bg-surface/80 px-3 py-3"
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <WalletIcon />

                  <h3 className="text-xs font-bold">
                    {balance.currency}
                  </h3>
                </div>

                <p className="wrap-anywhere text-sm font-bold tracking-tight text-ink tabular-nums">
                  <span className="sr-only">
                    Saldo ficticio:
                  </span>

                  {formatBalance(
                    balance.amount,
                    balance.decimals
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        <QuotesPanel quotes={quotesMock} />
      </div>
    </AppLayout>
  );
}