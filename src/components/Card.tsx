import type { ReactNode } from "react";

/**
 * Flat panel with soft shadow (replaces torn-paper edges, brief §5) and a
 * hover-lift interaction with accent border (brief §6).
 */
export function Card({
  children,
  className = "",
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-cream p-6 shadow-card transition-all duration-300 ${
        interactive
          ? "hover:-translate-y-1 hover:border-sage-light/60 hover:shadow-card-hover"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
