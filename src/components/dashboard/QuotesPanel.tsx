import { useEffect, useState, useCallback } from "react";
import { getRates, type Rate } from "../../services/rates";

interface QuotesPanelProps {
  initialRates?: readonly Rate[];
  autoRefresh?: boolean;
}

function formatRatePrice(amountStr: string, quoteCurrency: string): string {
  const num = Number(amountStr);
  if (!Number.isFinite(num)) {
    return amountStr;
  }

  if (quoteCurrency === "ARS") {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: num < 10 ? 2 : 2,
    maximumFractionDigits: num < 1 ? 4 : 2,
  }).format(num);
}

function getPairLabel(base: string, quote: string, rateType: string): { name: string; subtitle: string } {
  if (base === "USD" && quote === "ARS") {
    return { name: "Dólar Oficial", subtitle: "USD / ARS · Oficial" };
  }
  if (base === "BTC" && quote === "USD") {
    return { name: "Bitcoin", subtitle: "BTC / USD · Spot" };
  }
  if (base === "USDT" && quote === "USD") {
    return { name: "Tether", subtitle: "USDT / USD · Spot" };
  }
  return { name: `${base} / ${quote}`, subtitle: `${rateType.toUpperCase()}` };
}

function formatAge(updatedAt: string, now: number): string {
  const timestamp = Date.parse(updatedAt);

  if (!Number.isFinite(timestamp) || timestamp > now) {
    return "Reciente";
  }

  const minutes = Math.floor((now - timestamp) / 60_000);

  if (minutes < 1) return "Hace menos de 1 min";
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  return `Hace ${days} ${days === 1 ? "día" : "días"}`;
}

export function QuotesPanel({ initialRates, autoRefresh = true }: QuotesPanelProps) {
  const [rates, setRates] = useState<Rate[]>(() => (initialRates ? [...initialRates] : []));
  const [loading, setLoading] = useState<boolean>(() => !initialRates || initialRates.length === 0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const handleManualRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const response = await getRates();
      setRates(response.rates);
      setNow(Date.now());
    } catch {
      setError("No pudimos actualizar las cotizaciones. Mostrando datos disponibles.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (initialRates && initialRates.length > 0) return;

    const controller = new AbortController();
    getRates(controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) {
          setRates(res.rates);
          setError(null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("No pudimos actualizar las cotizaciones. Mostrando datos disponibles.");
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [initialRates]);

  useEffect(() => {
    const ageInterval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(ageInterval);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    // Refrescar cada 5 minutos alineado al TTL del backend
    const refreshInterval = window.setInterval(() => {
      void getRates()
        .then((res) => {
          setRates(res.rates);
          setError(null);
          setNow(Date.now());
        })
        .catch(() => {
          // Silencioso en segundo plano si falla el polling
        });
    }, 5 * 60_000);

    return () => window.clearInterval(refreshInterval);
  }, [autoRefresh]);

  return (
    <section
      aria-labelledby="quotes-title"
      className="mt-5 min-w-0 rounded-2xl border border-line bg-surface/90 p-4 sm:p-5 shadow-xs transition-all"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="quotes-title" className="text-base font-extrabold text-ink">
              Cotizaciones de referencia
            </h2>
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" title="Sincronizado con API" />
          </div>
          <p className="text-xs text-muted mt-0.5">
            Precios en vivo tomados de DolarApi y CoinGecko con caché en base de datos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleManualRefresh()}
            disabled={refreshing || loading}
            aria-label="Actualizar cotizaciones"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-page px-2.5 py-1 text-xs font-semibold text-muted hover:text-ink hover:border-brand/40 transition-colors cursor-pointer disabled:opacity-50"
            title="Refrescar cotizaciones desde el servidor"
          >
            <span className={`inline-block text-xs ${refreshing ? "animate-spin" : ""}`}>
              ↻
            </span>
            <span>{refreshing ? "Actualizando…" : "Actualizar"}</span>
          </button>
        </div>
      </div>

      <p className="sr-only">
        Compra es lo que el proveedor paga por tus divisas. Venta es lo que cobra al vendértelas.
      </p>

      {loading ? (
        <div className="space-y-3 py-2" aria-busy="true">
          {[1, 2, 3].map((skeleton) => (
            <div
              key={skeleton}
              className="grid grid-cols-3 gap-3 rounded-xl border border-line/40 bg-page/50 p-3 animate-pulse"
            >
              <div className="h-4 w-24 bg-line/60 rounded" />
              <div className="h-4 w-20 bg-line/60 rounded justify-self-center" />
              <div className="h-4 w-20 bg-line/60 rounded justify-self-end" />
            </div>
          ))}
        </div>
      ) : error && rates.length === 0 ? (
        <div className="py-6 text-center space-y-3">
          <p className="text-xs font-medium text-danger">{error}</p>
          <button
            type="button"
            onClick={() => void handleManualRefresh()}
            className="text-xs font-bold text-brand hover:underline cursor-pointer"
          >
            Reintentar conectar con la API
          </button>
        </div>
      ) : rates.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted">
          No hay cotizaciones disponibles en este momento.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <ul className="divide-y divide-line min-w-[340px]">
            {rates.map((rate) => {
              const { name, subtitle } = getPairLabel(rate.base, rate.quote, rate.rate_type);
              const formattedBuy = formatRatePrice(rate.buy, rate.quote);
              const formattedSell = formatRatePrice(rate.sell, rate.quote);

              return (
                <li
                  key={`${rate.base}-${rate.quote}-${rate.rate_type}`}
                  className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-2 py-3.5 first:pt-1 last:pb-1"
                >
                  {/* Moneda y subtítulo */}
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-ink truncate">
                        {name}
                      </h3>
                      {rate.stale && (
                        <span
                          title="Cotización temporalmente desactualizada"
                          className="rounded bg-amber-50 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 border border-amber-200 shrink-0"
                        >
                          Caché previa
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] font-medium text-muted truncate">
                      {subtitle}
                    </span>
                  </div>

                  {/* Compra */}
                  <dl className="min-w-0 text-left sm:text-center">
                    <dt className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                      Compra
                    </dt>
                    <dd className="wrap-anywhere text-xs sm:text-sm font-bold text-ink tabular-nums">
                      {formattedBuy}
                    </dd>
                  </dl>

                  {/* Venta */}
                  <dl className="min-w-0 text-left sm:text-center">
                    <dt className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                      Venta
                    </dt>
                    <dd className="wrap-anywhere text-xs sm:text-sm font-bold text-brand tabular-nums">
                      {formattedSell}
                    </dd>
                  </dl>

                  {/* Fuente y Antigüedad */}
                  <dl className="min-w-0 text-right text-[11px] text-muted">
                    <dt className="sr-only">Fuente</dt>
                    <dd className="truncate font-medium text-ink/70">
                      {rate.source}
                    </dd>
                    <dt className="sr-only">Antigüedad</dt>
                    <dd className="text-[10px] text-muted">
                      <time dateTime={rate.fetched_at}>
                        {formatAge(rate.fetched_at, now)}
                      </time>
                    </dd>
                  </dl>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[11px] text-muted">
        <span>Precios de referencia oficiales y spot para operaciones simuladas.</span>
        <span>Sin comisiones añadidas</span>
      </footer>
    </section>
  );
}
