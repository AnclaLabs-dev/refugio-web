import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";

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

  const userName =
    user?.displayName || user?.email || "Usuario";

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
      <header className="mb-6">
        <p className="mb-2 text-sm font-semibold text-brand">
          Tu billetera
        </p>

        <h1 className="mb-3">
          Tu dinero, con claridad.
        </h1>

        <p className="max-w-2xl text-base text-muted">
          Consultá tus balances por moneda desde un solo lugar.
        </p>
      </header>

      <section aria-labelledby="balances-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="balances-title">Tus balances</h2>

          <span className="rounded-lg bg-brand-soft px-3 py-2 text-xs font-semibold text-brand">
            Datos de ejemplo
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mockBalances.map((balance) => (
            <Card key={balance.currency}>
              <div className="mb-4 flex items-start justify-between gap-3">
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
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-xs font-bold text-brand"
                >
                  {balance.currency}
                </span>
              </div>

              <p className="text-xs font-medium text-muted">
                Saldo ilustrativo
              </p>

              <p className="mt-1 wrap-break-word text-2xl font-extrabold tracking-tight text-ink tabular-nums">
                {formatBalance(
                  balance.amount,
                  balance.decimals
                )}
              </p>

              <p className="mt-1 text-xs text-muted">
                {balance.currency}
              </p>
            </Card>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-sm text-muted">
          Estos balances son ejemplos para revisar el diseño.
          No corresponden a tu cuenta ni se consultan al servidor.
        </p>
      </section>
    </AppLayout>
  );
}