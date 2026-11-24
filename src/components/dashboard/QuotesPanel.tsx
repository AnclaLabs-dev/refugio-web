import { useEffect, useState } from "react";

import { Card } from "../ui/Card";
import type { Quote } from "../../mocks/quotesMock";

interface QuotesPanelProps {
  quotes: readonly Quote[];
}

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatAge(updatedAt: string, now: number): string {
  const timestamp = Date.parse(updatedAt);

  if (!Number.isFinite(timestamp) || timestamp > now) {
    return "Fecha no disponible";
  }

  const minutes = Math.floor((now - timestamp) / 60_000);

  if (minutes < 1) return "Hace menos de un minuto";
  if (minutes === 1) return "Hace 1 minuto";
  if (minutes < 60) return `Hace ${minutes} minutos`;

  const hours = Math.floor(minutes / 60);

  if (hours === 1) return "Hace 1 hora";
  if (hours < 24) return `Hace ${hours} horas`;

  const days = Math.floor(hours / 24);

  return days === 1 ? "Hace 1 día" : `Hace ${days} días`;
}

export function QuotesPanel({ quotes }: QuotesPanelProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      aria-labelledby="quotes-title"
      className="mt-10 min-w-0"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-brand">
            Referencias del mercado
          </p>

          <h2 id="quotes-title">
            Panel de cotizaciones
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-muted">
            Valores expresados en pesos argentinos por
            dólar estadounidense.
          </p>
        </div>

        <span className="rounded-full border border-brand/20 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand">
          Cotizaciones de ejemplo
        </span>
      </div>

      <p className="mb-4 max-w-3xl text-sm text-muted">
        Compra y venta se muestran desde la perspectiva del
        proveedor: compra es lo que paga por tus dólares;
        venta es lo que cobra al vendértelos.
      </p>

      {quotes.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            No hay cotizaciones para mostrar.
          </p>
        </Card>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="relative overflow-hidden shadow-sm transition-shadow hover:shadow-md motion-reduce:transition-none"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-brand/60"
              />

              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">
                  {quote.name}
                </h3>

                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand/10 bg-brand-soft text-lg font-bold text-brand"
                >
                  $
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-xl border border-line bg-page p-3">
                  <dt className="text-xs font-semibold text-muted">
                    Compra
                  </dt>

                  <dd className="mt-2 wrap-break-word text-lg font-extrabold tracking-tight text-ink tabular-nums">
                    {priceFormatter.format(quote.buy)}
                  </dd>
                </div>

                <div className="min-w-0 rounded-xl border border-brand/15 bg-brand-soft p-3">
                  <dt className="text-xs font-semibold text-brand">
                    Venta
                  </dt>

                  <dd className="mt-2 wrap-break-word text-lg font-extrabold tracking-tight text-ink tabular-nums">
                    {priceFormatter.format(quote.sell)}
                  </dd>
                </div>
              </dl>

              <dl className="mt-5 space-y-2 border-t border-line pt-4 text-xs">
                <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
                  <dt className="text-muted">Fuente simulada</dt>
                  <dd className="font-medium text-ink">
                    {quote.source}
                  </dd>
                </div>

                <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
                  <dt className="text-muted">Antigüedad</dt>
                  <dd className="font-medium text-ink">
                    <time
                      dateTime={quote.updatedAt}
                      title={new Date(
                        quote.updatedAt
                      ).toLocaleString("es-AR")}
                    >
                      {formatAge(quote.updatedAt, now)}
                    </time>
                  </dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">
        Maqueta con precios y fechas ficticios. La antigüedad
        avanza con el tiempo, pero las cotizaciones no se
        actualizan ni se consultan a un proveedor.
      </p>
    </section>
  );
}