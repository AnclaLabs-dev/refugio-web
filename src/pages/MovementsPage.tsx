import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { UnderConstructionTemplate } from "../components/layout/UnderConstructionTemplate";

export default function MovementsPage() {
  useDocumentTitle("Movimientos | Refugio");

  const mockMovements = [
    {
      id: "tx-1",
      title: "Recarga de saldo simulado",
      type: "Ingreso",
      date: "Hoy, 14:32",
      amount: "+ $100.000 ARS",
      status: "Completado",
      isPositive: true,
    },
    {
      id: "tx-2",
      title: "Compra simulada de USDT",
      type: "Operación",
      date: "Ayer, 18:20",
      amount: "- $50.000 ARS",
      status: "Completado",
      isPositive: false,
    },
    {
      id: "tx-3",
      title: "Swap USDT por BTC",
      type: "Conversión",
      date: "22 Nov, 11:15",
      amount: "+ 0.0012 BTC",
      status: "Completado",
      isPositive: true,
    },
    {
      id: "tx-4",
      title: "Depósito inicial de bienvenida",
      type: "Acreditación",
      date: "20 Nov, 09:00",
      amount: "+ $500.000 ARS",
      status: "Completado",
      isPositive: true,
    },
    {
      id: "tx-5",
      title: "Asignación a Meta de Ahorro",
      type: "Ahorro",
      date: "19 Nov, 16:45",
      amount: "- $25.000 ARS",
      status: "Completado",
      isPositive: false,
    },
  ];

  return (
    <UnderConstructionTemplate
      title="Historial de Movimientos"
      subtitle="Registro completo y transparente de todas tus operaciones"
      description="Esta sección te permitirá auditar cada transacción, descargar comprobantes en PDF y aplicar filtros avanzados por fecha, tipo de activo y moneda."
    >
      <div className="space-y-5">
        {/* Filtros de movimientos */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-surface-soft p-1">
            <button
              type="button"
              className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink shadow-2xs"
            >
              Todos
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink"
            >
              Ingresos
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink"
            >
              Egresos
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink"
            >
              Conversiones
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted">Período:</span>
            <div className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-bold text-ink">
              Últimos 30 días ▾
            </div>
          </div>
        </div>

        {/* Lista de movimientos */}
        <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-xs divide-y divide-line">
          {mockMovements.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 hover:bg-surface-soft/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl text-base font-bold ${
                    tx.isPositive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-surface-soft text-ink"
                  }`}
                >
                  {tx.isPositive ? "↓" : "↑"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">{tx.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.type}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-sm font-bold tabular-nums ${
                    tx.isPositive ? "text-emerald-600" : "text-ink"
                  }`}
                >
                  {tx.amount}
                </p>
                <span className="inline-block mt-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted px-1">
          <span>Mostrando 5 de 5 movimientos</span>
          <span>Página 1 de 1</span>
        </div>
      </div>
    </UnderConstructionTemplate>
  );
}
