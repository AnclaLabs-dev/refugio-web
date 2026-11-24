import { useEffect, useState } from "react";

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

  if (minutes < 1) return "Hace menos de 1 min";
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);

  return `Hace ${days} ${days === 1 ? "día" : "días"}`;
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
      className="mt-5 min-w-0 rounded-xl border border-line bg-surface/80 p-3 sm:p-4"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="quotes-title" className="text-base font-bold">
          Cotizaciones de referencia
        </h2>

        <span className="rounded-md bg-brand-soft px-2 py-1 text-[10px] font-semibold text-brand">
          Ejemplo · ARS por USD
        </span>
      </div>

      <p className="sr-only">
        Compra es lo que el proveedor paga por tus dólares.
        Venta es lo que cobra al vendértelos.
      </p>

      {quotes.length === 0 ? (
        <p className="py-3 text-sm text-muted">
          No hay cotizaciones para mostrar.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-start gap-x-2 gap-y-2 py-3 first:pt-1 last:pb-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)]"
            >
              <h3 className="min-w-0 self-center text-xs font-bold">
                {quote.name}
              </h3>

              <dl className="min-w-0">
                <dt className="mb-1 text-[10px] text-muted">
                  Compra
                </dt>

                <dd className="wrap-anywhere text-xs font-semibold tabular-nums">
                  {priceFormatter.format(quote.buy)}
                </dd>
              </dl>

              <dl className="min-w-0">
                <dt className="mb-1 text-[10px] text-muted">
                  Venta
                </dt>

                <dd className="wrap-anywhere text-xs font-semibold text-brand tabular-nums">
                  {priceFormatter.format(quote.sell)}
                </dd>
              </dl>

              <dl className="col-span-3 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] text-muted sm:col-span-1 sm:block">
                <div className="min-w-0">
                  <dt className="sr-only">Fuente simulada</dt>
                  <dd className="wrap-break-word">
                    {quote.source}
                  </dd>
                </div>

                <div className="sm:mt-1">
                  <dt className="sr-only">Antigüedad</dt>
                  <dd>
                    <time dateTime={quote.updatedAt}>
                      {formatAge(quote.updatedAt, now)}
                    </time>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 border-t border-line pt-2 text-[10px] leading-relaxed text-muted">
        Precios y fechas ficticios. Compra y venta según el
        proveedor. Sin actualización de precios en vivo.
      </p>
    </section>
  );
}