import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { UnderConstructionTemplate } from "../components/layout/UnderConstructionTemplate";

export default function SwapPage() {
  useDocumentTitle("Intercambiar | Refugio");

  return (
    <UnderConstructionTemplate
      title="Intercambiar divisas"
      subtitle="Conversión directa e instantánea entre cualquier par de monedas"
      description="El conversor automático de divisas te permitirá cambiar entre criptomonedas y saldo local con el mejor precio disponible y cero comisiones ocultas."
    >
      <div className="mx-auto max-w-xl space-y-6">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink">Swap instantáneo</h3>
            <span className="rounded-lg bg-surface-soft px-2.5 py-1 text-xs font-semibold text-muted">
              Tasa fija garantizada
            </span>
          </div>

          <div className="space-y-3">
            {/* Moneda origen */}
            <div className="rounded-xl border border-line bg-page/60 p-4">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Convertir de</span>
                <span>Disponible: 500.00 USDT</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-black text-ink">150.00</span>
                <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-1.5 border border-line font-bold text-sm shadow-2xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  USDT
                </div>
              </div>
            </div>

            {/* Botón central de Swap */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                className="size-10 rounded-full bg-brand text-on-brand shadow-md flex items-center justify-center font-bold text-sm"
              >
                ⇅
              </button>
            </div>

            {/* Moneda destino */}
            <div className="rounded-xl border border-line bg-page/60 p-4">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Recibes en tu billetera</span>
                <span>Tasa: 1 BTC ≈ 95.500 USDT</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-black text-brand">0.00157</span>
                <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-1.5 border border-line font-bold text-sm shadow-2xs">
                  <span className="size-2 rounded-full bg-amber-500" />
                  BTC
                </div>
              </div>
            </div>
          </div>

          {/* Detalles técnicos */}
          <div className="rounded-xl bg-surface-soft/60 p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted">
              <span>Impacto estimado en el precio</span>
              <span className="font-semibold text-emerald-600">&lt; 0.01%</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Tolerancia de deslizamiento (Slippage)</span>
              <span className="font-semibold text-ink">0.5% automático</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-on-brand shadow-sm"
          >
            Intercambiar divisas
          </button>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 text-center">
          <p className="text-xs text-muted">
            Los intercambios en Refugio son inmediatos y se debitan directamente de tus balances simulados.
          </p>
        </div>
      </div>
    </UnderConstructionTemplate>
  );
}
