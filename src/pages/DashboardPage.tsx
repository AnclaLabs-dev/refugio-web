import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { QuotesPanel } from "../components/dashboard/QuotesPanel";
import { quotesMock } from "../mocks/quotesMock";
import { apiFetch } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

interface ApiBalance {
  currency_code: string;
  name: string;
  type: "fiat" | "crypto";
  decimals: number;
  amount: string;
  updated_at?: string;
}

interface WalletResponse {
  wallet: {
    id: string;
    balances: ApiBalance[];
  };
}

const fallbackBalances: ApiBalance[] = [
  {
    currency_code: "ARS",
    name: "Peso argentino",
    type: "fiat",
    amount: "250000.00",
    decimals: 2,
  },
  {
    currency_code: "USD",
    name: "Dólar estadounidense",
    type: "fiat",
    amount: "500.00",
    decimals: 2,
  },
  {
    currency_code: "USDT",
    name: "Tether",
    type: "crypto",
    amount: "200.00",
    decimals: 2,
  },
  {
    currency_code: "BTC",
    name: "Bitcoin",
    type: "crypto",
    amount: "0.00500000",
    decimals: 8,
  },
];

function formatBalance(amountStr: string, decimals: number) {
  const num = parseFloat(amountStr);
  if (isNaN(num)) return "0,00";
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
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
  useDocumentTitle("Mi Billetera | Refugio");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const [balances, setBalances] = useState<ApiBalance[]>(fallbackBalances);
  const [loadingBalances, setLoadingBalances] = useState(true);

  // Modal de Recarga Simulada
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [reloadCurrency, setReloadCurrency] = useState("ARS");
  const [reloadAmount, setReloadAmount] = useState("100000");
  const [reloading, setReloading] = useState(false);
  const [reloadNotice, setReloadNotice] = useState<string | null>(null);

  const userName = user?.displayName || user?.email || "Usuario";

  useEffect(() => {
    let ignore = false;

    apiFetch<WalletResponse>("/wallet")
      .then((res) => {
        if (
          !ignore &&
          res?.wallet?.balances &&
          res.wallet.balances.length > 0
        ) {
          setBalances(res.wallet.balances);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn(
            "No se pudo obtener la billetera desde el backend, usando saldos locales:",
            err,
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingBalances(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const refreshWallet = useCallback(async () => {
    try {
      const res = await apiFetch<WalletResponse>("/wallet");
      if (res?.wallet?.balances && res.wallet.balances.length > 0) {
        setBalances(res.wallet.balances);
      }
    } catch (err) {
      console.warn("Error al refrescar billetera:", err);
    }
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("No pudimos cerrar sesión. Intentá nuevamente.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleReloadSimulated = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(reloadAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setReloading(true);
    setReloadNotice(null);

    try {
      // Intentar enviar al backend si ya implementó el endpoint
      await apiFetch("/wallet/deposit", {
        method: "POST",
        body: JSON.stringify({
          currency_code: reloadCurrency,
          amount: amountNum,
        }),
      });

      // Refrescar desde backend
      await refreshWallet();
      setReloadNotice(
        `¡Recargaste $${amountNum.toLocaleString("es-AR")} ${reloadCurrency} con éxito!`,
      );
    } catch {
      // Actualización optimista en Front si el backend aún no tiene el endpoint
      setBalances((prev) =>
        prev.map((b) => {
          if (b.currency_code === reloadCurrency) {
            const current = parseFloat(b.amount) || 0;
            return {
              ...b,
              amount: (current + amountNum).toFixed(b.decimals),
            };
          }
          return b;
        }),
      );
      setReloadNotice(
        `¡Saldo simulado acreditado! Se sumaron ${amountNum.toLocaleString("es-AR")} ${reloadCurrency} de práctica a tu billetera.`,
      );
    } finally {
      setReloading(false);
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

        {/* Encabezado con acción de recarga */}
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-ink">
              Tu dinero simulado, con claridad.
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Panel interactivo de práctica · 100% fondos ficticios
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            className="!py-2 !px-4 text-xs sm:text-sm font-bold rounded-xl shadow-xs"
            onClick={() => {
              setShowReloadModal(true);
              setReloadNotice(null);
            }}
          >
            <span>+ Recargar saldo simulado</span>
          </Button>
        </header>

        {/* Banner Hero de Simulación */}
        <section
          aria-labelledby="wallet-summary-title"
          className="relative mb-5 overflow-hidden rounded-2xl bg-[#95877D] px-5 py-6 text-white shadow-sm sm:px-6"
        >
          {/* Arco de Refugio como marca de agua */}
          <svg
            viewBox="0 0 100 120"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute right-3 -bottom-5 h-36 w-32 text-[#CFC3B8]/60 sm:right-6"
          >
            <path
              d="M16 120V52a34 34 0 0 1 68 0v68"
              stroke="currentColor"
              strokeWidth="16"
            />
          </svg>

          <div className="relative max-w-[80%] space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Billetera de práctica activa
            </span>

            <h2
              id="wallet-summary-title"
              className="text-xl sm:text-2xl font-black tracking-tight pt-1"
            >
              Aprendé. Explorá. Simulá.
            </h2>

            <p className="text-xs sm:text-sm leading-relaxed text-white/90 pt-0.5">
              Todas tus monedas en un solo lugar con cotizaciones en vivo y
              saldos de entrenamiento.
            </p>
          </div>
        </section>

        {/* Sección de Balances */}
        <section aria-labelledby="balances-title" className="mb-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id="balances-title" className="text-sm font-bold text-ink">
              Tus balances
            </h2>
          </div>

          {loadingBalances ? (
            <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-line bg-surface/60 p-4 space-y-3"
                >
                  <div className="h-4 w-12 bg-surface-soft rounded" />
                  <div className="h-6 w-24 bg-surface-soft rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-4">
              {balances.map((balance) => (
                <div
                  key={balance.currency_code}
                  role="group"
                  aria-label={balance.name}
                  className="min-w-0 rounded-xl border border-line bg-surface p-4 shadow-2xs hover:border-brand/40 transition-colors"
                >
                  <div className="mb-2 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <WalletIcon />
                      <h3 className="text-xs font-bold text-ink">
                        {balance.currency_code}
                      </h3>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-muted">
                      {balance.type}
                    </span>
                  </div>

                  <p className="wrap-anywhere text-base sm:text-lg font-black tracking-tight text-ink tabular-nums">
                    <span className="sr-only">Saldo ficticio:</span>
                    {formatBalance(balance.amount, balance.decimals)}
                  </p>

                  <p className="text-[11px] text-muted truncate mt-0.5">
                    {balance.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Panel de Cotizaciones de Referencia */}
        <QuotesPanel quotes={quotesMock} />

        {/* Modal para Recarga de Dinero Simulado */}
        {showReloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-surface rounded-2xl border border-line p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink">
                    Recargar saldo simulado
                  </h3>
                  <p className="text-xs text-muted">
                    Acreditá fondos ficticios para practicar
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReloadModal(false)}
                  className="text-muted hover:text-ink text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {reloadNotice ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-success-surface border border-success/30 text-success text-sm font-medium leading-relaxed">
                    {reloadNotice}
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full !py-2.5 font-bold"
                    onClick={() => setShowReloadModal(false)}
                  >
                    Entendido
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleReloadSimulated} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-ink">
                      Moneda a recargar
                    </label>
                    <select
                      value={reloadCurrency}
                      onChange={(e) => {
                        setReloadCurrency(e.target.value);
                        if (e.target.value === "ARS") setReloadAmount("100000");
                        if (e.target.value === "USD") setReloadAmount("500");
                        if (e.target.value === "USDT") setReloadAmount("200");
                        if (e.target.value === "BTC") setReloadAmount("0.005");
                      }}
                      className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="ARS">ARS · Peso argentino</option>
                      <option value="USD">USD · Dólar estadounidense</option>
                      <option value="USDT">USDT · Tether</option>
                      <option value="BTC">BTC · Bitcoin</option>
                    </select>
                  </div>

                  <Input
                    label="Monto ficticio"
                    type="number"
                    step="any"
                    min="1"
                    value={reloadAmount}
                    onChange={(e) => setReloadAmount(e.target.value)}
                    required
                  />

                  {/* Atajos de montos sugeridos */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {reloadCurrency === "ARS" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setReloadAmount("50000")}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-soft text-ink hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                        >
                          + $50.000
                        </button>
                        <button
                          type="button"
                          onClick={() => setReloadAmount("100000")}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-soft text-ink hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                        >
                          + $100.000
                        </button>
                        <button
                          type="button"
                          onClick={() => setReloadAmount("500000")}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-soft text-ink hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                        >
                          + $500.000
                        </button>
                      </>
                    )}
                    {reloadCurrency === "USD" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setReloadAmount("100")}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-soft text-ink hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                        >
                          + $100
                        </button>
                        <button
                          type="button"
                          onClick={() => setReloadAmount("500")}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-soft text-ink hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                        >
                          + $500
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end pt-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowReloadModal(false)}
                      disabled={reloading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={reloading}
                      loadingText="Acreditando…"
                      className="font-bold"
                    >
                      Confirmar recarga
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
