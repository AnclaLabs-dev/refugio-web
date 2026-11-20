import {
  useId,
  type InputHTMLAttributes,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Input({
  label,
  hint,
  error,
  id,
  className = "",
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
        {props.required && (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        )}
      </label>

      <input
        {...props}
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : externalInvalid}
        className={[
          "min-h-11 w-full min-w-0 rounded-xl border",
          "bg-surface px-3 py-2 text-base text-ink",
          "placeholder:text-muted",
          "disabled:cursor-not-allowed disabled:bg-surface-soft",
          error ? "border-danger" : "border-line",
          className,
        ].join(" ")}
      />

      {hint && (
        <p id={hintId} className="m-0 text-sm text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          aria-live="polite"
          className="m-0 text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}