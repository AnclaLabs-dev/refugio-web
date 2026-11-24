import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function RefugioBrand({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Refugio, volver al inicio"
      className={`inline-flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90 ${className}`}
    >
      <svg
        viewBox="0 0 40 40"
        width="34"
        height="34"
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

      <span className="text-2xl font-black tracking-tight text-ink">
        Refugio
      </span>
    </Link>
  );
}

export function BrandArchGraphic() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none flex justify-center w-full overflow-hidden"
    >
      <svg
        viewBox="0 0 200 130"
        fill="none"
        className="w-48 text-[#d8cebf]"
      >
        <path
          d="M36 130 V72 C36 36.65 64.65 8 100 8 C135.35 8 164 36.65 164 72 V130"
          stroke="currentColor"
          strokeWidth="32"
        />
      </svg>
    </div>
  );
}

interface AuthLayoutProps {
  children: ReactNode;
  heroHeadline?: ReactNode;
  heroSubtitle?: string;
}

export function AuthLayout({
  children,
  heroHeadline = (
    <>
      Aprendé.<br />
      Explorá.<br />
      Simulá.
    </>
  ),
  heroSubtitle = "Una billetera para aprender, sin dinero real.",
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-page flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Contenedor principal estilo Mockup con esquinas redondeadas generosas y sombra */}
      <div className="w-full max-w-[880px] bg-surface rounded-[24px] sm:rounded-[28px] border border-line/60 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Columna Izquierda: Branding Hero (Visible en Desktop md+) */}
        <div className="hidden md:flex flex-col justify-between bg-[#f4f0e8] p-8 lg:p-10 border-r border-line/40 relative">
          {/* Top: Logo */}
          <div className="flex items-center">
            <RefugioBrand />
          </div>

          {/* Middle: Titular y bajada */}
          <div className="my-8">
            <h1 className="text-3xl lg:text-[2.5rem] font-black text-ink tracking-tight leading-[1.12]">
              {heroHeadline}
            </h1>
            <p className="text-muted text-sm lg:text-base mt-4 leading-relaxed max-w-xs font-normal">
              {heroSubtitle}
            </p>
          </div>

          {/* Bottom: Gráfica del arco */}
          <div className="-mb-8 lg:-mb-10 flex justify-center">
            <BrandArchGraphic />
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          {/* Cabecera para Mobile (< md): Logo visible */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <RefugioBrand />
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
