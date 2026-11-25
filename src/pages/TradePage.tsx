import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { UnderConstructionTemplate } from "../components/layout/UnderConstructionTemplate";

export default function TradePage() {
  useDocumentTitle("Comprar y Vender | Refugio");

  return (
    <UnderConstructionTemplate
      title="Comprar y Vender"
      subtitle="Operá con moneda local y criptomonedas de forma simulada"
      description="Estamos preparando el módulo de operaciones directas para que puedas comprar y vender divisas al instante con saldos de práctica."
    >
      <div className="space-y-6">
        {/* Toggle superior Comprar / Vender */}
        <div className="flex max-w-sm rounded-xl bg-surface-soft p-1">
          <button
            type="button"
            className="flex-1 rounded-lg bg-surface py-2 text-sm font-bold text-ink shadow-2xs"
          >
            Comprar
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg py-2 text-sm font-medium text-muted hover:text-ink"
          >
            Vender
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Formulario de orden simulado */}
          <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs lg:col-span-2">
            <h3 className="text-base font-bold text-ink">Ingresá los montos</h3>

            <div className="space-y-3">
              <div className="rounded-xl border border-line bg-page/50 p-4">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>Pagarás con</span>
                  <span>Saldo disponible: $250.000 ARS</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-2xl font-black text-ink">100.000</span>
                  <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 border border-line shadow-2xs font-bold text-sm">
                    <span className="size-2 rounded-full bg-blue-500" />
                    ARS
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <div className="size-8 rounded-full bg-surface-soft border border-line flex items-center justify-center text-muted">
                  ↓
                </div>
              </div>

              <div className="rounded-xl border border-line bg-page/50 p-4">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>Recibirás aproximadamente</span>
                  <span>Tasa estimada: 1 USDT = $1.150 ARS</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-2xl font-black text-brand">86.95</span>
                  <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 border border-line shadow-2xs font-bold text-sm">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    USDT
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de costos */}
            <div className="space-y-2 rounded-xl bg-surface-soft/60 p-4 text-xs">
              <div className="flex justify-between text-muted">
                <span>Comisión de red</span>
                <span className="font-semibold text-emerald-600">$0 (Bonificada)</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Tiempo estimado de acreditación</span>
                <span className="font-semibold text-ink">Inmediato</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-on-brand shadow-sm"
            >
              Confirmar orden simulada
            </button>
          </div>

          {/* Panel lateral de información */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-ink">Cotización de referencia</h4>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted">USDT / ARS</span>
                <span className="text-lg font-black text-ink">$1.150,00</span>
              </div>
              <div className="h-20 w-full rounded-xl bg-brand-soft/40 flex items-center justify-center text-xs text-brand font-semibold">
                Gráfico de cotización en tiempo real
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-ink">¿Cómo funciona?</h4>
              <p className="text-[11px] leading-relaxed text-muted">
                Todas las operaciones se procesan con fondos ficticios para que aprendas la dinámica del mercado sin riesgo financiero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UnderConstructionTemplate>
  );
}
