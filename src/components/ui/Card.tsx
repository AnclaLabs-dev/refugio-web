import type { HTMLAttributes } from "react";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={[
        "min-w-0 rounded-2xl border border-line",
        "bg-surface p-4 text-ink sm:p-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}