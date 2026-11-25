import type { ReactNode } from "react";
import { RefugioLogo } from "../ui/RefugioLogo";

export function RefugioBrand({ className = "" }: { className?: string }) {
  return <RefugioLogo className={className} />;
}

export function BrandArchGraphic({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none flex justify-center w-full ${className}`}
    >
      <svg
        viewBox="0 0 200 160"
        fill="none"
        className="w-40 sm:w-44 lg:w-48 text-[#d8cebf]"
      >
        <path
          d="M40 145 V78 a60 60 0 0 1 120 0 v67"
          stroke="currentColor"
          strokeWidth="26"
          strokeLinecap="round"
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
          <div className="mt-auto pt-6 flex justify-center">
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
