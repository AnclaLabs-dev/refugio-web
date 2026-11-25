import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  rightElement?: ReactNode;
  hideRequiredIndicator?: boolean;
}

export function Input({
  label,
  hint,
  error,
  id,
  className = "",
  rightElement,
  hideRequiredIndicator = false,
  "aria-describedby": externalDescription,
  "aria-invalid": externalInvalid,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    externalDescription,
    hint ? hintId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="grid min-w-0 gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-ink"
      >
        {label}
        {props.required && !hideRequiredIndicator && (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        )}
      </label>

      <div className="relative flex items-center min-w-0 w-full">
        <input
          {...props}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : externalInvalid}
          className={[
            "min-h-11 w-full min-w-0 rounded-xl border",
            "bg-surface px-3.5 py-2.5 text-base text-ink",
            "placeholder:text-muted/60 transition-colors",
            "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
            "disabled:cursor-not-allowed disabled:bg-surface-soft",
            error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-line",
            rightElement ? "pr-11" : "",
            className,
          ].join(" ")}
        />
        {rightElement && (
          <div className="absolute right-2.5 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {hint && (
        <p id={hintId} className="m-0 text-sm text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          aria-live="polite"
          className="m-0 text-sm text-danger font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}