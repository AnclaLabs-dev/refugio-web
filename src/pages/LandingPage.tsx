import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getRates, type Rate } from "../services/rates";
import { RefugioLogo } from "../components/ui/RefugioLogo";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

type FeatureIconName = "wallet" | "shield" | "assistant" | "goal";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

const landingLinks = [
  { href: "#caracteristicas", label: "Características" },
  { href: "#como-funciona", label: "¿Cómo funciona?" },
  { href: "#cotizaciones", label: "Cotizaciones" },
  { href: "#metas-ahorro", label: "Metas de ahorro" },
];

const previewBalances = [
  { code: "ARS", amount: "250.000,00" },
  { code: "USD", amount: "500,00" },
  { code: "USDT", amount: "200,000000" },
  { code: "BTC", amount: "0,00500000" },
];

const features: {
  icon: FeatureIconName;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    icon: "wallet",
    title: "Billetera multimoneda",
    description:
      "Reuní ARS, USD, USDT y BTC en un solo lugar. Explorá tus balances y practicá operaciones con fondos de simulación.",
    detail: "Cuatro monedas, una misma billetera",
  },
  {
    icon: "shield",
    title: "Transparencia de tasas",
    description:
      "Revisá los importes y la cotización aplicada antes de confirmar cada operación. Entendé qué entregás y qué recibís.",
    detail: "Información clara antes de confirmar",
  },
  {
    icon: "assistant",
    title: "Asistente Refugio",
    description:
      "Un espacio de ayuda con inteligencia artificial para aprender conceptos y comprender tus movimientos. Información educativa, sin ejecutar operaciones por vos.",
    detail: "Aprendizaje y acompañamiento",
  },
  {
    icon: "goal",
    title: "Metas de ahorro en USD",
    description:
      "Organizá tus objetivos de ahorro y seguí tu progreso dentro de la billetera de práctica. Aprendé a planificar con una referencia en dólares.",
    detail: "Objetivos claros y progreso visible",
  },
];

const steps = [
  {
    title: "Creá tu cuenta",
    description:
      "Registrate para acceder a tu espacio personal y comenzar a explorar Refugio.",
  },
  {
    title: "Ingresá a tu billetera",
    description:
      "Consultá tus balances de simulación y conocé las monedas disponibles.",
  },
  {
    title: "Practicá y compará",
    description:
      "Explorá las cotizaciones y revisá las condiciones de cada operación antes de confirmar.",
  },
];

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
      <p className="text-xs font-extrabold tracking-widest text-brand uppercase sm:text-sm">
        {eyebrow}
      </p>

      <h2
        id={id}
        className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {description}
      </p>
    </header>
  );
}

function FeatureIcon({ name }: { name: FeatureIconName }) {
  const paths = {
    wallet: (
      <>
        <rect x="3" y="5" width="18" height="15" rx="3" />
        <path d="M3 9h18M16 13h5v4h-5z" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    assistant: (
      <>
        <path d="M21 11a8 8 0 0 1-8 8H8l-5 3 1-6a8 8 0 1 1 17-5Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </>
    ),
    goal: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  };

  return (
    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
      <svg
        viewBox="0 0 24 24"
        width="23"
        height="23"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths[name]}
      </svg>
    </span>
  );
}

function rateDate(value: string): string | null {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) return null;

  return date.toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getLandingRateLabel(base: string, quote: string): string {
  if (base === "USD" && quote === "ARS") {
    return "Dólar Oficial (USD/ARS)";
  }

  if (base === "BTC" && quote === "USD") {
    return "Bitcoin (BTC/USD)";
  }

  if (base === "USDT" && quote === "USD") {
    return "Tether (USDT/USD)";
  }

  return `${base}/${quote}`;
}

function formatLandingPrice(amount: string, quote: string): string {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(amount);

  if (!match) return amount;

  const [, integer, fraction = ""] = match;
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const prefix =
    quote === "ARS" ? "$" : quote === "USD" ? "US$" : `${quote} `;

  return `${prefix}${grouped},${fraction.padEnd(2, "0")}`;
}

export default function LandingPage() {
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);
  const [ratesStatus, setRatesStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [ratesAttempt, setRatesAttempt] = useState(0);

  useDocumentTitle("Refugio | Tu billetera digital contra la inflación");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRates() {
      setRatesStatus("loading");

      try {
        const response = await getRates(controller.signal);

        if (!controller.signal.aborted) {
          setRates(response.rates);
          setRatesStatus("success");
        }
      } catch {
        if (!controller.signal.aborted) {
          setRates([]);
          setRatesStatus("error");
        }
      }
    }

    void loadRates();

    return () => controller.abort();
  }, [ratesAttempt]);

  const refreshRates = () => {
    setRatesAttempt((value) => value + 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page font-sans text-ink selection:bg-brand selection:text-on-brand">
      {/* Navegación */}
      <header className="sticky top-0 z-50 border-b border-line/50 bg-page/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <RefugioLogo to="/" size="md" />

          <nav
            aria-label="Navegación de la landing"
            className="hidden items-center gap-6 text-sm font-semibold text-muted lg:flex"
          >
            {landingLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-brand"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-hover"
              >
                Ir a mi billetera
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-bold transition-colors hover:text-brand"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-hover"
                >
                  Crear cuenta gratis
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={
              mobileMenuOpen
                ? "Cerrar menú de navegación"
                : "Abrir menú de navegación"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-mobile-menu"
            className="flex size-11 items-center justify-center rounded-xl text-ink hover:bg-brand-soft hover:text-brand lg:hidden"
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
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="landing-mobile-menu"
            className="border-b border-line bg-surface px-6 py-6 lg:hidden"
          >
            <nav
              aria-label="Navegación móvil de la landing"
              className="flex flex-col gap-3 font-semibold"
            >
              {landingLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-brand"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="rounded-xl bg-brand py-3 text-center font-bold text-on-brand"
                >
                  Ir a mi billetera
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl border border-line py-3 text-center font-bold"
                  >
                    Iniciar sesión
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl bg-brand py-3 text-center font-bold text-on-brand"
                  >
                    Crear cuenta gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Presentación: composición anterior */}
        <section
          aria-labelledby="landing-title"
          className="relative isolate overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-20 right-0 -z-10 size-80 rounded-full bg-brand/5 blur-3xl"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-surface-soft px-3 py-1.5 text-xs font-semibold sm:text-sm">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full bg-brand"
                  />
                  Billetera de práctica · Sin dinero real
                </div>

                <h1
                  id="landing-title"
                  className="text-4xl leading-[1.08] font-black tracking-tight sm:text-5xl lg:text-6xl"
                >
                  Protegé el valor de tus pesos,{" "}
                  <span className="text-brand">
                    con total transparencia.
                  </span>
                </h1>

                <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
                  Practicá con dólares, USDT y Bitcoin utilizando
                  cotizaciones de referencia del mercado. Mirá la tasa
                  de cada operación y compará alternativas desde un
                  solo lugar.
                </p>

                <div className="flex flex-col items-center justify-center gap-3.5 pt-2 sm:flex-row lg:justify-start">
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand px-7 py-3.5 text-base font-bold text-on-brand shadow-md transition-colors hover:bg-brand-hover sm:w-auto"
                  >
                    {user ? "Ir a mi billetera" : "Crear cuenta gratis"}
                  </Link>

                  <a
                    href="#cotizaciones"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-line bg-surface px-6 py-3.5 text-base font-bold transition-colors hover:bg-surface-soft sm:w-auto"
                  >
                    Ver cotizaciones
                  </a>
                </div>

                <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs font-semibold text-muted sm:text-sm lg:justify-start">
                  {[
                    "Sin dinero real",
                    "Cotizaciones de referencia",
                    "Tasas transparentes",
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2">
                      <span aria-hidden="true" className="text-brand">
                        ✓
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Billetera ilustrativa */}
              <div className="relative mx-auto w-full min-w-0 max-w-md lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-xl sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <RefugioLogo to="/" size="sm" />

                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
                      Vista ilustrativa
                    </span>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl bg-[#95877D] p-4 text-white sm:p-5">
                    <svg
                      viewBox="0 0 100 120"
                      fill="none"
                      aria-hidden="true"
                      className="pointer-events-none absolute right-1 -bottom-6 h-32 w-28 text-white/20"
                    >
                      <path
                        d="M16 120V52a34 34 0 0 1 68 0v68"
                        stroke="currentColor"
                        strokeWidth="16"
                      />
                    </svg>

                    <div className="relative max-w-[80%]">
                      <p className="text-xs font-medium">
                        Tu billetera de práctica
                      </p>

                      <p className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                        Aprendé. Explorá. Simulá.
                      </p>

                      <p className="mt-2 text-xs leading-relaxed">
                        Un solo lugar para entender tus monedas.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {previewBalances.map((balance) => (
                      <div
                        key={balance.code}
                        className="min-w-0 rounded-xl border border-line/60 bg-page p-3"
                      >
                        <p className="text-xs font-bold text-brand">
                          {balance.code}
                        </p>

                        <p className="mt-1 wrap-anywhere text-sm font-bold tabular-nums">
                          {balance.amount}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-muted">
                    Saldos de ejemplo. Practicá sin dinero real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Características */}
        <section
          id="caracteristicas"
          aria-labelledby="landing-features-title"
          className="scroll-mt-24 border-t border-line/50 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="landing-features-title"
              eyebrow="Por qué elegir Refugio"
              title="Herramientas para aprender y decidir"
              description="Una interfaz clara para explorar monedas, entender operaciones y organizar tus objetivos."
            />

            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="flex h-full min-w-0 flex-col rounded-3xl border border-line/80 bg-surface p-6 shadow-sm sm:p-8"
                >
                  <FeatureIcon name={feature.icon} />

                  <h3 className="mt-5 text-xl font-extrabold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {feature.description}
                  </p>

                  <div className="mt-auto pt-6">
                    <p className="border-t border-line/50 pt-4 text-xs font-semibold text-muted">
                      {feature.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Cómo funciona */}
        <section
          id="como-funciona"
          aria-labelledby="landing-steps-title"
          className="scroll-mt-24 border-y border-line/50 bg-[#f4f0e8] py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="landing-steps-title"
              eyebrow="Simple y transparente"
              title="¿Cómo empezar a usar Refugio?"
              description="Tres pasos para conocer la billetera y comenzar a practicar tus decisiones."
            />

            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="h-full space-y-4 rounded-3xl border border-line/60 bg-surface p-6 sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full bg-brand text-sm font-black text-on-brand"
                  >
                    {index + 1}
                  </span>

                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Cotizaciones */}
        <section
          id="cotizaciones"
          aria-labelledby="landing-rates-title"
          aria-busy={ratesStatus === "loading"}
          className="scroll-mt-24 border-b border-line/60 bg-surface py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="landing-rates-title"
              eyebrow="Información del mercado"
              title="Cotizaciones para decidir con claridad"
              description="Consultá los precios de referencia, su fuente y la fecha de actualización antes de explorar tus operaciones."
            />

            {ratesStatus === "loading" && (
              <p
                role="status"
                className="rounded-xl border border-line bg-page p-5 text-center text-sm text-muted"
              >
                Consultando cotizaciones…
              </p>
            )}

            {ratesStatus === "error" && (
              <div className="rounded-xl border border-line bg-page p-5 text-center">
                <p role="alert" className="text-sm text-danger">
                  No pudimos obtener las cotizaciones. Intentá
                  nuevamente.
                </p>

                <button
                  type="button"
                  onClick={refreshRates}
                  className="mt-3 min-h-11 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-hover"
                >
                  Reintentar
                </button>
              </div>
            )}

            {ratesStatus === "success" &&
              (rates.length === 0 ? (
                <div className="rounded-xl border border-line bg-page p-5 text-center">
                  <p role="status" className="text-sm text-muted">
                    No hay cotizaciones disponibles en este momento.
                  </p>

                  <button
                    type="button"
                    onClick={refreshRates}
                    className="mt-3 min-h-11 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-brand"
                  >
                    Volver a consultar
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {rates.map((rate) => {
                      const fetchedDate = rateDate(rate.fetched_at);

                      return (
                        <article
                          key={`${rate.base}-${rate.quote}-${rate.rate_type}`}
                          className="flex min-w-0 flex-col rounded-3xl border border-line bg-page p-5 sm:p-6"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="text-sm font-bold sm:text-base">
                              {getLandingRateLabel(
                                rate.base,
                                rate.quote,
                              )}
                            </h3>

                            {rate.stale && (
                              <span className="rounded-md bg-warning-surface px-2 py-1 text-[11px] font-semibold text-warning">
                                Caché anterior
                              </span>
                            )}
                          </div>

                          <dl className="mt-5 grid grid-cols-2 gap-4">
                            <div className="min-w-0">
                              <dt className="text-[11px] font-semibold uppercase text-muted">
                                Compra
                              </dt>

                              <dd className="mt-2 wrap-anywhere text-base font-extrabold tracking-tight tabular-nums">
                                {formatLandingPrice(
                                  rate.buy,
                                  rate.quote,
                                )}
                              </dd>
                            </div>

                            <div className="min-w-0">
                              <dt className="text-[11px] font-semibold uppercase text-muted">
                                Venta
                              </dt>

                              <dd className="mt-2 wrap-anywhere text-base font-extrabold tracking-tight text-brand tabular-nums">
                                {formatLandingPrice(
                                  rate.sell,
                                  rate.quote,
                                )}
                              </dd>
                            </div>
                          </dl>

                          <div className="mt-auto pt-5">
                            <div className="space-y-1 border-t border-line/60 pt-3 text-[11px] text-muted">
                              <p className="wrap-anywhere">
                                Fuente: {rate.source}
                              </p>

                              <p>
                                {fetchedDate ? (
                                  <>
                                    Consultada:{" "}
                                    <time dateTime={rate.fetched_at}>
                                      {fetchedDate}
                                    </time>
                                  </>
                                ) : (
                                  "Fecha no disponible"
                                )}
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-4 text-center">
                    <p className="text-xs leading-relaxed text-muted">
                      Referencias sujetas a la actualización del
                      proveedor y la caché de la API. Revisá las
                      condiciones antes de confirmar una operación.
                    </p>

                    <button
                      type="button"
                      onClick={refreshRates}
                      className="min-h-11 rounded-xl border border-line px-4 py-2 text-xs font-semibold text-brand hover:bg-brand-soft"
                    >
                      Actualizar cotizaciones
                    </button>
                  </div>
                </>
              ))}
          </div>
        </section>

        {/* 4. Metas de ahorro */}
        <section
          id="metas-ahorro"
          aria-labelledby="landing-goals-title"
          className="scroll-mt-24 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="landing-goals-title"
              eyebrow="Metas de ahorro"
              title="Dale un propósito a tus ahorros"
              description="Un viaje, un proyecto o eso que querés alcanzar. Aprendé a organizar tus objetivos y seguir tu progreso."
            />

            <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-10 lg:grid-cols-2 lg:p-12">
              <div className="space-y-5">
                <FeatureIcon name="goal" />

                <h3 className="text-2xl font-extrabold tracking-tight">
                  Un objetivo claro, paso a paso.
                </h3>

                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  Organizá tus metas con una referencia en dólares y
                  practicá la planificación dentro de tu billetera.
                  Cada objetivo es una oportunidad para aprender a
                  ahorrar con intención.
                </p>

                <ul className="space-y-3 text-sm font-semibold">
                  {[
                    "Definí un objetivo de ahorro",
                    "Visualizá tu progreso hacia la meta",
                    "Practicá con fondos de simulación",
                  ].map((text) => (
                    <li
                      key={text}
                      className="flex items-start gap-2"
                    >
                      <span
                        aria-hidden="true"
                        className="text-brand"
                      >
                        ✓
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex min-w-0 flex-col items-center justify-center rounded-2xl border border-line/60 bg-[#f4f0e8] px-5 py-8 text-center sm:p-10">
                <svg
                  viewBox="0 0 200 180"
                  fill="none"
                  aria-hidden="true"
                  className="mb-5 w-40 max-w-full text-[#d8cebf] sm:w-48"
                >
                  <path
                    d="M40 158V82a60 60 0 0 1 120 0v76"
                    stroke="currentColor"
                    strokeWidth="28"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="text-xl font-extrabold tracking-tight">
                  Tus objetivos, cada vez más cerca.
                </p>

                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  Aprendé a ahorrar con intención, paso a paso
                  y sin dinero real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Invitación final */}
        <section
          aria-labelledby="landing-start-title"
          className="border-t border-line/50 bg-surface py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="landing-start-title"
              eyebrow="Tu próximo paso"
              title="Empezá a explorar Refugio"
              description="Conocé tus monedas, consultá referencias del mercado y practicá tus decisiones en un entorno de simulación."
            />

            <div className="flex justify-center">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand px-8 py-3 font-bold text-on-brand shadow-sm transition-colors hover:bg-brand-hover"
              >
                {user ? "Ir a mi billetera" : "Crear cuenta gratis"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Pie de página */}
      <footer className="mt-auto border-t border-line/60 bg-page pt-12 pb-10">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4 md:col-span-2">
              <RefugioLogo to="/" size="sm" />

              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Herramientas para aprender sobre monedas, cotizaciones
                y decisiones de ahorro en un entorno de práctica.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black tracking-wider text-brand uppercase">
                Plataforma
              </p>

              <ul className="space-y-2 text-sm font-medium text-muted">
                {landingLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-brand">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black tracking-wider text-brand uppercase">
                Acceso
              </p>

              <ul className="space-y-2 text-sm font-medium text-muted">
                <li>
                  <Link to="/login" className="hover:text-brand">
                    Iniciar sesión
                  </Link>
                </li>

                <li>
                  <Link to="/register" className="hover:text-brand">
                    Crear cuenta
                  </Link>
                </li>

                {user && (
                  <li>
                    <Link to="/dashboard" className="hover:text-brand">
                      Mi billetera
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-3 border-t border-line/40 pt-6 text-xs leading-relaxed text-muted">
            <p>
              <strong>Aviso institucional:</strong> Refugio opera con
              fondos de simulación. No está conectado a bancos ni a
              entidades financieras y no utiliza dinero real.
              Plataforma desarrollada por Ancla Labs. Las cotizaciones
              se muestran únicamente con fines informativos y educativos.
            </p>

            <p className="font-medium">
              © {new Date().getFullYear()} Refugio · Ancla Labs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}