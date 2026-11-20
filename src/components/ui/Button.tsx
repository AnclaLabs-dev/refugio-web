import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-brand text-on-brand " +
    "enabled:hover:bg-brand-hover",

  secondary:
    "border-brand bg-surface text-brand " +
    "enabled:hover:bg-brand-soft",

  ghost:
    "border-transparent bg-transparent text-brand " +
    "enabled:hover:bg-brand-soft",
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  loadingText = "Procesando…",
  disabled = false,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2",
        "rounded-xl border px-4 py-2",
        "text-base font-semibold",
        "transition-colors motion-reduce:transition-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        className,
      ].join(" ")}
    >
      {loading && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.25"
          />
          <path
            d="M12 3a9 9 0 0 1 9 9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}

      {loading ? loadingText : children}
    </button>
  );
}