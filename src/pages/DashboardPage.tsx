import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
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
      <div className="relative isolate min-w-0">
        {/* Halos decorativos detrás del contenido */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
        >
          <div className="absolute -right-16 -top-12 size-72 rounded-full bg-brand/15 blur-3xl sm:size-96" />
          <div className="absolute -left-24 top-80 size-80 rounded-full bg-taupe/20 blur-3xl" />
        </div>

        <header className="relative mb-8 overflow-hidden rounded-3xl border border-brand/15 bg-surface/80 p-5 shadow-sm backdrop-blur-md sm:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-y-6 left-0 w-1 rounded-r-full bg-brand"
          />

          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-brand">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-brand"
            />
            Tu billetera
          </p>

          <h1 className="mb-3">Tu dinero, con claridad.</h1>

          <p className="max-w-2xl text-base text-muted">
            Consultá tus balances por moneda y explorá las
            cotizaciones desde un solo lugar.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted">
              4 monedas
            </span>

            <span className="rounded-full border border-brand/15 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
              Entorno de simulación
            </span>
          </div>
        </header>

        <section aria-labelledby="balances-title">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="balances-title">Tus balances</h2>

            <span className="rounded-full border border-brand/20 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand">
              Datos de ejemplo
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {mockBalances.map((balance) => (
              <Card
                key={balance.currency}
                className="relative overflow-hidden shadow-sm transition-shadow hover:shadow-md motion-reduce:transition-none"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-brand/40"
                />

                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold">
                      {balance.currency}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      {balance.name}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand/10 bg-brand-soft text-xs font-bold text-brand"
                  >
                    {balance.currency}
                  </span>
                </div>

                <p className="text-xs font-medium text-muted">
                  Saldo ilustrativo
                </p>

                <p className="mt-2 wrap-break-word text-2xl font-extrabold tracking-tight text-ink tabular-nums">
                  {formatBalance(
                    balance.amount,
                    balance.decimals
                  )}
                </p>

                <div className="mt-4 border-t border-line pt-3">
                  <p className="text-xs font-medium text-muted">
                    {balance.currency}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-4 max-w-2xl text-sm text-muted">
            Estos balances son ejemplos para revisar el diseño.
            No corresponden a tu cuenta ni se consultan al servidor.
          </p>
        </section>

        <QuotesPanel quotes={quotesMock} />
      </div>
    </AppLayout>
  );
}