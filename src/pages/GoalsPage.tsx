import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { UnderConstructionTemplate } from "../components/layout/UnderConstructionTemplate";

export default function GoalsPage() {
  useDocumentTitle("Metas de ahorro | Refugio");

  const mockGoals = [
    {
      id: "goal-1",
      title: "Fondo de emergencia",
      current: "$130.000",
      target: "$200.000 ARS",
      percentage: 65,
      color: "bg-brand",
      category: "Seguridad",
    },
    {
      id: "goal-2",
      title: "Vacaciones de verano",
      current: "450 USDT",
      target: "1.000 USDT",
      percentage: 45,
      color: "bg-emerald-500",
      category: "Viajes",
    },
    {
      id: "goal-3",
      title: "Notebook para programar",
      current: "$680 USD",
      target: "$800 USD",
      percentage: 85,
      color: "bg-blue-500",
      category: "Educación y Trabajo",
    },
  ];

  return (
    <UnderConstructionTemplate
      title="Metas de ahorro"
      subtitle="Definí objetivos financieros y monitoreá tu progreso paso a paso"
      description="Podrás crear alcancías virtuales dedicadas, apartar saldo automáticamente de tus balances y recibir proyecciones de ahorro a mediano y largo plazo."
    >
      <div className="space-y-6">
        {/* Banner de resumen global */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-soft p-5 border border-line">
          <div>
            <span className="text-xs font-semibold text-muted">Total acumulado en metas</span>
            <p className="text-2xl font-black text-ink mt-0.5">$385.000 ARS eq.</p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-on-brand shadow-xs"
          >
            + Nueva meta de ahorro
          </button>
        </div>

        {/* Grid de metas activas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockGoals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted bg-surface-soft px-2.5 py-1 rounded-md">
                  {goal.category}
                </span>
                <span className="text-xs font-bold text-brand">{goal.percentage}%</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-ink">{goal.title}</h4>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-sm font-black text-ink">{goal.current}</span>
                  <span className="text-xs text-muted">meta: {goal.target}</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="h-2 w-full rounded-full bg-surface-soft overflow-hidden">
                <div
                  className={`h-full rounded-full ${goal.color}`}
                  style={{ width: `${goal.percentage}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-muted">
                <span>Aporte mensual sugerido</span>
                <span className="font-semibold text-ink">$15.000 / mes</span>
              </div>
            </div>
          ))}

          {/* Tarjeta para crear meta */}
          <div className="rounded-2xl border-2 border-dashed border-line bg-page/40 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
            <div className="size-10 rounded-full bg-surface border border-line flex items-center justify-center text-lg font-bold text-muted shadow-2xs">
              +
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Crear otro objetivo</p>
              <p className="text-xs text-muted mt-0.5">Apartá dinero sin tocar tu saldo del día a día</p>
            </div>
          </div>
        </div>
      </div>
    </UnderConstructionTemplate>
  );
}
