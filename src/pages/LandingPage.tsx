import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRates, type Rate } from "../services/rates";
import { RefugioLogo } from "../components/ui/RefugioLogo";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const DEFAULT_RATES: Rate[] = [
  { pair: "USD/ARS", base: "USD", quote: "ARS", rate_type: "oficial", buy: "1180.00", sell: "1220.00", source: "dolarapi.com", fetched_at: new Date().toISOString(), stale: false },
  { pair: "BTC/USD", base: "BTC", quote: "USD", rate_type: "spot", buy: "96500.00", sell: "96500.00", source: "coingecko.com", fetched_at: new Date().toISOString(), stale: false },
  { pair: "USDT/USD", base: "USDT", quote: "USD", rate_type: "spot", buy: "1.00", sell: "1.00", source: "coingecko.com", fetched_at: new Date().toISOString(), stale: false },
];

function getLandingRateLabel(base: string, quote: string): string {
  if (base === "USD" && quote === "ARS") return "Dólar Oficial (USD/ARS)";
  if (base === "BTC" && quote === "USD") return "Bitcoin (BTC/USD)";
  if (base === "USDT" && quote === "USD") return "Tether (USDT/USD)";
  return `${base}/${quote}`;
}

function formatLandingPrice(amount: string, quote: string): string {
  const val = Number(amount);
  if (isNaN(val)) return amount;
  if (quote === "ARS") {
    return `$${val.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `US$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rates, setRates] = useState<Rate[]>(DEFAULT_RATES);

  useDocumentTitle("Refugio | Tu billetera digital contra la inflación");

  useEffect(() => {
    const controller = new AbortController();
    getRates(controller.signal)
      .then((res) => {
        if (!controller.signal.aborted && res.rates.length > 0) {
          setRates(res.rates);
        }
      })
      .catch(() => {
        // Fallback a DEFAULT_RATES en caso de error o sin conexión
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-page text-ink selection:bg-brand selection:text-on-brand flex flex-col font-sans">
      {/* ──────────────────────────────────────────────────────────
          1. NAVBAR / HEADER
          ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-page/90 border-b border-line/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <RefugioLogo to="/" size="md" />

          {/* Enlaces de Navegación (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted">
            <a
              href="#caracteristicas"
              className="hover:text-ink transition-colors"
            >
              Características
            </a>
            <a
              href="#como-funciona"
              className="hover:text-ink transition-colors"
            >
              ¿Cómo funciona?
            </a>
            <a href="#cotizaciones" className="hover:text-ink transition-colors">
              Cotizaciones
            </a>
            <a href="#comparador" className="hover:text-ink transition-colors">
              Comparador
            </a>
          </nav>

          {/* Acciones de Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm bg-brand text-on-brand hover:bg-brand-hover transition-colors shadow-sm"
              >
                Ir a mi Billetera →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-bold text-ink hover:text-brand transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm bg-brand text-on-brand hover:bg-brand-hover transition-colors shadow-sm"
                >
                  Crear cuenta gratis
                </Link>
              </>
            )}
          </div>

          {/* Botón de Menú Mobile */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:text-brand focus:outline-none cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Desplegable Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-b border-line px-6 py-6 space-y-4">
            <nav className="flex flex-col gap-3 font-semibold text-base text-ink">
              <a
                href="#caracteristicas"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-brand"
              >
                Características
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-brand"
              >
                ¿Cómo funciona?
              </a>
              <a
                href="#cotizaciones"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-brand"
              >
                Cotizaciones
              </a>
              <a
                href="#comparador"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-brand"
              >
                Comparador
              </a>
            </nav>
            <div className="pt-4 border-t border-line flex flex-col gap-2.5">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-3 rounded-xl font-bold bg-brand text-on-brand shadow-sm"
                >
                  Ir a mi Billetera
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl font-bold border border-line text-ink bg-surface-soft"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-3 rounded-xl font-bold bg-brand text-on-brand shadow-sm"
                  >
                    Crear cuenta gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────────
          2. HERO SECTION
          ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Gráfico decorativo de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-soft/40 rounded-full blur-3xl -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Texto y CTAs de impacto */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-soft border border-line/60 text-xs sm:text-sm font-semibold text-ink shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Billetera digital · Transparencia cambiaria en tiempo real</span>
              </div>

              {/* Titular */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight leading-[1.08]">
                Protegé el valor de tus pesos,{" "}
                <span className="text-brand">con total transparencia.</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Pasá tus ahorros a dólares, USDT y Bitcoin con cotizaciones en
                tiempo real. Mirá la tasa exacta de cada operación y compará
                alternativas lado a lado sin costos ocultos.
              </p>

              {/* Botones de acción principal */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-brand text-on-brand hover:bg-brand-hover font-bold text-base shadow-md transition-all hover:scale-[1.01]"
                >
                  <span>Crear cuenta gratis</span>
                  <svg
                    viewBox="0 0 20 20"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                <a
                  href="#cotizaciones"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-surface border border-line hover:bg-surface-soft font-bold text-base text-ink transition-colors"
                >
                  Ver cotizaciones en vivo
                </a>
              </div>

              {/* Micro-Social Proof / Puntos de confianza */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-semibold text-muted">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Sin costos de apertura</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Cotizaciones en tiempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Cálculos y tasas transparentes</span>
                </div>
              </div>
            </div>

            {/* Mockup visual de la Billetera (Hero Interactive Card) */}
            <div className="lg:col-span-5 relative">
              {/* Tarjeta flotante de la app */}
              <div className="relative mx-auto max-w-sm sm:max-w-md bg-surface rounded-[32px] p-6 sm:p-7 border border-line/80 shadow-2xl space-y-6">
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between pb-4 border-b border-line/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand text-on-brand flex items-center justify-center font-black text-sm">
                      R
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted">Billetera de</p>
                      <p className="text-sm font-bold text-ink">Tu Refugio</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    En vivo
                  </span>
                </div>

                {/* Saldo Total */}
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-bold text-muted">
                    Saldo total estimado
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                    $ 1.250.000,00{" "}
                    <span className="text-sm font-semibold text-muted">ARS</span>
                  </p>
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-1">
                    <span>↑ +4,8% esta semana</span>
                    <span className="text-muted font-normal">
                      · Rendimiento estimado
                    </span>
                  </p>
                </div>

                {/* Acciones Rápidas */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-surface-soft border border-line/60 text-center hover:border-brand/40 transition-colors">
                    <span className="block text-base">↓</span>
                    <span className="text-xs font-bold text-ink">Comprar</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-soft border border-line/60 text-center hover:border-brand/40 transition-colors">
                    <span className="block text-base">↑</span>
                    <span className="text-xs font-bold text-ink">Vender</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-soft border border-line/60 text-center hover:border-brand/40 transition-colors">
                    <span className="block text-base">⇄</span>
                    <span className="text-xs font-bold text-ink">Cambiar</span>
                  </div>
                </div>

                {/* Desglose de Monedas */}
                <div className="space-y-2.5 pt-1">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">
                    Tus monedas duras
                  </p>

                  <div className="p-3 rounded-xl bg-page/70 border border-line/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#f7931a]/15 text-[#f7931a] flex items-center justify-center font-bold text-xs">
                        ₿
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">Bitcoin</p>
                        <p className="text-[11px] text-muted">0.005 BTC</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-ink">$ 485.000 ARS</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">+2.1%</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-page/70 border border-line/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        ₮
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">Tether USD</p>
                        <p className="text-[11px] text-muted">200 USDT</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-ink">$ 250.000 ARS</p>
                      <p className="text-[11px] text-muted font-semibold">$1.250 / u</p>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="p-2.5 rounded-xl bg-brand-soft border border-brand/20 flex items-center gap-2 text-xs font-medium text-ink">
                  <span className="text-brand text-sm font-bold">ℹ</span>
                  <span>Cotizaciones sincronizadas en tiempo real desde el mercado.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. TICKER DE COTIZACIONES EN VIVO
          ────────────────────────────────────────────────────────── */}
      <section
        id="cotizaciones"
        className="py-10 bg-surface border-y border-line/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                Cotizaciones del mercado en tiempo real
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-0.5">
                Precios de referencia sincronizados para que decidas con números al día.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-soft border border-line text-muted">
              Actualizado hace instantes
            </span>
          </div>

          {/* Grid de Cotizaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rates.map((rate) => (
              <div
                key={`${rate.base}-${rate.quote}-${rate.rate_type}`}
                className="p-4 rounded-2xl bg-page border border-line hover:border-brand/40 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink truncate mr-2">
                    {getLandingRateLabel(rate.base, rate.quote)}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="En vivo" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted">
                      Compra
                    </span>
                    <span className="text-base sm:text-lg font-black text-ink">
                      {formatLandingPrice(rate.buy, rate.quote)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-muted">
                      Venta
                    </span>
                    <span className="text-base sm:text-lg font-black text-brand">
                      {formatLandingPrice(rate.sell, rate.quote)}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-muted">
                  <span>Fuente: {rate.source}</span>
                  {rate.stale && <span className="text-amber-600 font-semibold">Caché previa</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. BENTO GRID DE CARACTERÍSTICAS
          ────────────────────────────────────────────────────────── */}
      <section id="caracteristicas" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-black text-brand">
              Por qué elegir Refugio
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-ink tracking-tight mt-2">
              Todo lo que necesitás para cuidar tu poder de compra
            </p>
            <p className="text-sm sm:text-base text-muted mt-3">
              Herramientas claras, interfaz intuitiva y tasas transparentes en cada operación.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1 (Span 2) */}
            <div className="md:col-span-2 p-8 sm:p-10 rounded-[28px] bg-surface border border-line/80 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-brand/50 transition-all">
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center text-xl font-black">
                  ⇄
                </div>
                <h3 className="text-2xl font-black text-ink tracking-tight">
                  Billetera multimoneda
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                  Operá con Pesos (ARS), Dólares (USD) y Criptomonedas (BTC, USDT) en
                  un solo lugar. Gestioná tus fondos en monedas duras y protegé el
                  valor de tu dinero frente a la inflación.
                </p>
              </div>

              {/* Mini gráfico/elemento visual */}
              <div className="mt-8 pt-6 border-t border-line/40 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-page border border-line/50 text-center">
                  <span className="block text-xs font-semibold text-muted">Pesos</span>
                  <span className="font-bold text-sm text-ink">$ ARS</span>
                </div>
                <div className="p-3 rounded-xl bg-page border border-line/50 text-center">
                  <span className="block text-xs font-semibold text-muted">Dólares</span>
                  <span className="font-bold text-sm text-ink">USD MEP</span>
                </div>
                <div className="p-3 rounded-xl bg-page border border-line/50 text-center">
                  <span className="block text-xs font-semibold text-muted">Cripto</span>
                  <span className="font-bold text-sm text-ink">BTC / USDT</span>
                </div>
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="p-8 rounded-[28px] bg-surface border border-line/80 shadow-sm flex flex-col justify-between hover:border-brand/50 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">
                  🛡️
                </div>
                <h3 className="text-xl font-black text-ink tracking-tight">
                  Transparencia de tasas
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Antes de confirmar cualquier compra o intercambio, ves la tasa aplicada,
                  la fuente de la cotización y el spread exacto. Sin sorpresas ni comisiones ocultas.
                </p>
              </div>
              <div className="mt-6 p-3 rounded-xl bg-surface-soft border border-line text-xs font-bold text-muted">
                Cálculo exacto antes de confirmar
              </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="p-8 rounded-[28px] bg-surface border border-line/80 shadow-sm flex flex-col justify-between hover:border-brand/50 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-brand flex items-center justify-center text-xl font-bold">
                  📊
                </div>
                <h3 className="text-xl font-black text-ink tracking-tight">
                  Panel multi-dólar en vivo
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Seguí el valor del Dólar Oficial, MEP, Blue y Dólar Cripto en simultáneo.
                  Entendé la brecha cambiaria y las puntas de compra y venta en tiempo real.
                </p>
              </div>
              <div className="mt-6 p-3 rounded-xl bg-surface-soft border border-line text-xs font-bold text-muted">
                Dólar oficial, MEP, blue y cripto
              </div>
            </div>

            {/* Tarjeta 4 (Span 2) */}
            <div className="md:col-span-2 p-8 sm:p-10 rounded-[28px] bg-surface border border-line/80 shadow-sm flex flex-col justify-between hover:border-brand/50 transition-all">
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold">
                  🎯
                </div>
                <h3 className="text-2xl font-black text-ink tracking-tight">
                  Metas de ahorro en USD
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                  Fijá un objetivo de ahorro en moneda dura. Refugio unifica el
                  valor en dólares de tus USD, USDT y BTC a la cotización vigente
                  para que monitorees tu progreso real.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-line/40 flex items-center justify-between text-xs font-semibold text-muted">
                <span>✓ Control total de tu progreso</span>
                <span>✓ Métricas transparentes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. CÓMO FUNCIONA (PASO A PASO)
          ────────────────────────────────────────────────────────── */}
      <section
        id="como-funciona"
        className="py-20 lg:py-28 bg-[#f4f0e8] border-y border-line/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-black text-brand">
              Simple y transparente
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-ink tracking-tight mt-2">
              ¿Cómo empezar a usar Refugio?
            </p>
            <p className="text-sm sm:text-base text-muted mt-2">
              Tres pasos sencillos para empezar a cuidar tu dinero hoy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div className="p-8 rounded-[24px] bg-surface border border-line/60 shadow-xs space-y-4">
              <span className="w-10 h-10 rounded-full bg-brand text-on-brand flex items-center justify-center font-black text-sm">
                1
              </span>
              <h3 className="text-xl font-black text-ink">Creá tu cuenta</h3>
              <p className="text-muted text-sm leading-relaxed">
                Solo necesitás un correo electrónico y una contraseña en menos de un minuto.
                Sin burocracia ni trámites bancarios.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="p-8 rounded-[24px] bg-surface border border-line/60 shadow-xs space-y-4">
              <span className="w-10 h-10 rounded-full bg-brand text-on-brand flex items-center justify-center font-black text-sm">
                2
              </span>
              <h3 className="text-xl font-black text-ink">
                Ingresá a tu billetera
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Tu cuenta se inicializa con saldo en pesos para que puedas
                empezar a operar, comparar cotizaciones y dolarizarte al instante.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="p-8 rounded-[24px] bg-surface border border-line/60 shadow-xs space-y-4">
              <span className="w-10 h-10 rounded-full bg-brand text-on-brand flex items-center justify-center font-black text-sm">
                3
              </span>
              <h3 className="text-xl font-black text-ink">Comprá, intercambiá y compará</h3>
              <p className="text-muted text-sm leading-relaxed">
                Pasá pesos a cripto, cambiá divisas y usá el comparador histórico
                para entender cómo proteger mejor tus ahorros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. COMPARADOR HISTÓRICO (QUÉ HUBIERA PASADO)
          ────────────────────────────────────────────────────────── */}
      <section id="comparador" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 lg:p-16 rounded-[32px] bg-surface border border-line shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft border border-brand/20 text-xs font-bold text-brand">
                Comparador "¿Qué hubiera pasado?"
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                Medí el impacto real de tus decisiones de ahorro
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed">
                La inflación erosiona tus ingresos mes a mes y elegir dónde guardar tu plata
                suele ser confuso. Refugio te permite comparar qué hubiera pasado con tu dinero
                si te quedabas en pesos o pasabas a dólar oficial, MEP, blue, USDT o Bitcoin
                en 30, 90 o 180 días.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 font-bold text-lg">✓</span>
                  <span className="text-sm font-semibold text-ink">
                    Métricas históricas basadas en cotizaciones reales de mercado
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 font-bold text-lg">✓</span>
                  <span className="text-sm font-semibold text-ink">
                    Comparación lado a lado de monedas duras y tipos de cambio
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 font-bold text-lg">✓</span>
                  <span className="text-sm font-semibold text-ink">
                    Claridad absoluta en spreads y tasas aplicadas
                  </span>
                </div>
              </div>
            </div>

            {/* Bloque visual de Arco de Refugio */}
            <div className="flex flex-col items-center justify-center p-8 bg-[#f4f0e8] rounded-2xl border border-line/60 text-center">
              <svg
                viewBox="0 0 200 130"
                fill="none"
                className="w-48 text-[#d8cebf] mb-4"
                aria-hidden="true"
              >
                <path
                  d="M36 130 V72 C36 36.65 64.65 8 100 8 C135.35 8 164 36.65 164 72 V130"
                  stroke="currentColor"
                  strokeWidth="32"
                />
              </svg>
              <p className="text-xl font-black text-ink tracking-tight">
                Protegé. Dolarizá. Crecé.
              </p>
              <p className="text-xs text-muted mt-1 max-w-xs">
                Tu billetera digital para cuidar el poder de compra de tus pesos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. CTA FINAL BANNER
          ────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 lg:p-16 rounded-[32px] bg-brand text-on-brand text-center relative overflow-hidden shadow-xl">
            {/* Brillo decorativo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Empezá a cuidar tu dinero hoy mismo.
              </h2>
              <p className="text-base sm:text-lg opacity-90 max-w-lg mx-auto">
                Creá tu cuenta gratis en menos de un minuto, compará cotizaciones
                en tiempo real y elegí la mejor forma de proteger tus ahorros.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-surface text-brand font-black text-base shadow-lg hover:bg-page transition-transform hover:scale-105"
                >
                  Crear cuenta gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. FOOTER
          ────────────────────────────────────────────────────────── */}
      <footer className="mt-auto bg-surface border-t border-line/60 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Columna Marca */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 40 40"
                  width="28"
                  height="28"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-brand"
                >
                  <path
                    d="M7 34V20a13 13 0 0 1 26 0v14"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xl font-black tracking-tight">Refugio</span>
              </div>
              <p className="text-sm text-muted max-w-sm leading-relaxed">
                Herramientas financieras simples y transparentes que ayudan a las
                personas de Latinoamérica a proteger el valor de su dinero.
              </p>
            </div>

            {/* Enlaces de Plataforma */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-ink">
                Plataforma
              </p>
              <ul className="space-y-2 text-sm text-muted font-medium">
                <li>
                  <a href="#caracteristicas" className="hover:text-ink">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-ink">
                    ¿Cómo funciona?
                  </a>
                </li>
                <li>
                  <a href="#cotizaciones" className="hover:text-ink">
                    Cotizaciones en vivo
                  </a>
                </li>
                <li>
                  <a href="#comparador" className="hover:text-ink">
                    Comparador
                  </a>
                </li>
              </ul>
            </div>

            {/* Enlaces de Cuenta */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-ink">
                Acceso
              </p>
              <ul className="space-y-2 text-sm text-muted font-medium">
                <li>
                  <Link to="/login" className="hover:text-ink">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-ink">
                    Crear cuenta
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link to="/dashboard" className="hover:text-ink">
                      Mi Billetera
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Aviso Legal Único y de Demostración */}
          <div className="pt-8 border-t border-line/40 text-xs text-muted/80 space-y-2 leading-relaxed">
            <p>
              <strong>Aviso institucional:</strong> Refugio opera con saldo de
              demostración: no está conectado a bancos ni a entidades financieras,
              por lo que los fondos no son dinero real. Plataforma desarrollada
              por Ancla Labs. Las cotizaciones son provistas por DolarAPI y
              CoinGecko únicamente con fines informativos.
            </p>
            <p className="pt-2 font-medium">
              © {new Date().getFullYear()} Refugio. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
