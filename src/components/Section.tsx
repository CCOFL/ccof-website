import type { ReactNode } from "react";

type Background = "white" | "cream" | "cream-dark" | "sage";

const backgrounds: Record<Background, string> = {
  white: "bg-white text-ink",
  cream: "bg-cream text-ink",
  "cream-dark": "bg-cream-dark text-ink",
  sage: "bg-sage text-cream",
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
  return (
    <p
      className={`mb-3 text-sm font-semibold uppercase tracking-[0.14em] ${
        onDark ? "text-cream/80" : "text-sage-light"
      }`}
    >
      {children}
    </p>
  );
}
