import { type ReactNode } from "react";
import { Link } from "react-router-dom";

export type LogoVariant = "full" | "isotype";
export type LogoSize = "sm" | "md" | "lg" | "xl";

interface RefugioLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  asLink?: boolean;
  to?: string;
  isotypeClassName?: string;
  textClassName?: string;
}

const sizeConfig: Record<LogoSize, { iconSize: number; strokeWidth: number; textSize: string; gap: string }> = {
  sm: { iconSize: 26, strokeWidth: 5, textSize: "text-lg", gap: "gap-2" },
  md: { iconSize: 34, strokeWidth: 6, textSize: "text-2xl", gap: "gap-2.5" },
  lg: { iconSize: 40, strokeWidth: 6.5, textSize: "text-3xl", gap: "gap-3" },
  xl: { iconSize: 52, strokeWidth: 7, textSize: "text-4xl", gap: "gap-3.5" },
};

export function RefugioLogo({
  variant = "full",
  size = "md",
  className = "",
  asLink = true,
  to = "/",
  isotypeClassName = "text-brand",
  textClassName = "text-ink",
}: RefugioLogoProps) {
  const config = sizeConfig[size];

  const content: ReactNode = (
    <>
      <svg
        viewBox="0 0 40 40"
        width={config.iconSize}
        height={config.iconSize}
        fill="none"
        aria-hidden="true"
        className={`shrink-0 ${isotypeClassName}`}
      >
        <path
          d="M7 34V20a13 13 0 0 1 26 0v14"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />
      </svg>

      {variant === "full" && (
        <span className={`font-black tracking-tight ${config.textSize} ${textClassName}`}>
          Refugio
        </span>
      )}
    </>
  );

  if (asLink) {
    return (
      <Link
        to={to}
        aria-label="Refugio, ir al inicio"
        className={`inline-flex items-center ${config.gap} transition-opacity hover:opacity-90 ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center ${config.gap} ${className}`}>
      {content}
    </div>
  );
}
