import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { UnderConstructionTemplate } from "../components/layout/UnderConstructionTemplate";

export default function AssistantPage() {
  useDocumentTitle("Asistente Refugio | Refugio");

  const promptSuggestions = [
    "¿Cómo organizo mis ahorros entre pesos y dólares?",
    "¿Qué significa hacer un swap de criptomonedas?",
    "Consejos para crear un fondo de emergencia",
    "¿Cómo impacta la inflación en mis ahorros?",
  ];

  return (
    <UnderConstructionTemplate
      title="Asistente Refugio"
      subtitle="Tu asesor financiero inteligente con respuestas claras y personalizadas"
      description="El asistente con IA te ayudará a entender opciones de ahorro, resolver dudas sobre tipos de cambio y optimizar tus metas financieras en lenguaje sencillo."
    >
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Caja de chat */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-4 min-h-[420px] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Mensaje Asistente */}
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                AI
              </div>
              <div className="rounded-2xl rounded-tl-xs bg-surface-soft p-4 max-w-[85%] text-xs sm:text-sm text-ink leading-relaxed">
                ¡Hola! Soy tu asistente financiero en <strong>Refugio</strong>. Estoy para ayudarte a
                entender tus finanzas, planificar tus ahorros y aprender sobre cotizaciones sin complicaciones.
              </div>
            </div>

            {/* Mensaje Usuario Mock */}
            <div className="flex items-start justify-end gap-3">
              <div className="rounded-2xl rounded-tr-xs bg-brand text-on-brand p-4 max-w-[85%] text-xs sm:text-sm leading-relaxed">
                ¿Qué porcentaje de mis ingresos conviene destinar a una meta de ahorro?
              </div>
              <div className="size-9 rounded-xl bg-taupe/30 text-ink flex items-center justify-center font-bold text-xs shrink-0">
                Tú
              </div>
            </div>

            {/* Respuesta Asistente */}
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                AI
              </div>
              <div className="rounded-2xl rounded-tl-xs bg-surface-soft p-4 max-w-[85%] text-xs sm:text-sm text-ink leading-relaxed space-y-2">
                <p>
                  Una de las reglas más recomendadas es la <strong>regla 50/30/20</strong>:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-muted">
                  <li><strong>50%</strong> para gastos esenciales (vivienda, servicios, comida).</li>
                  <li><strong>30%</strong> para consumos personales o entretenimiento.</li>
                  <li><strong>20%</strong> directo a tus metas de ahorro e inversión.</li>
                </ul>
                <p className="pt-1">
                  En Refugio podés crear una meta de ahorro dedicada para automatizar ese 20% mes a mes.
                </p>
              </div>
            </div>
          </div>

          {/* Preguntas sugeridas */}
          <div className="space-y-2 pt-2 border-t border-line/60">
            <span className="text-[11px] font-semibold text-muted">Preguntas frecuentes sugeridas:</span>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-lg bg-surface-soft px-3 py-1.5 text-xs text-ink font-medium border border-line hover:border-brand/40"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input de chat */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              readOnly
              value="Escribe tu consulta financiera..."
              className="flex-1 rounded-xl border border-line bg-page px-4 py-2.5 text-xs sm:text-sm text-muted focus:outline-none"
            />
            <button
              type="button"
              className="rounded-xl bg-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-on-brand"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </UnderConstructionTemplate>
  );
}
