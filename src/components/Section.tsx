import type { ReactNode } from "react";

type Background = "white" | "cream" | "cream-dark" | "sage" | "charcoal";

const backgrounds: Record<Background, string> = {
  // Warm-white / warm-tint alternation — never stark pure white (Brand v1.1).
  white: "bg-cream text-body",
  cream: "bg-cream-dark text-body",
  "cream-dark": "bg-cream-dark text-body",
  sage: "bg-sage text-cream",
  charcoal: "bg-charcoal text-cream",
};

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  background = "white",
  className = "",
  containerClassName = "",
  id,
}: {
  children: ReactNode;
  background?: Background;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${backgrounds[background]} py-16 sm:py-20 lg:py-24 ${className}`}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** Small eyebrow label above section headings. */
export function Eyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  // Eyebrow tags render in coral — the brand's ~10% accent (Brand Standards v1.1).
  return (
    <p
      className={`mb-3 text-sm font-semibold uppercase tracking-[0.14em] ${
        onDark ? "text-cream/85" : "text-coral-deep"
      }`}
    >
      {children}
    </p>
  );
}
