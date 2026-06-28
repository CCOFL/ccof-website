import type { ReactNode } from "react";
import { Container, Eyebrow } from "./Section";

/** Consistent interior-page hero band so content starts in the first viewport. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-cream">
      <Container className="py-14 sm:py-16 lg:py-20">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1
          className="max-w-3xl font-serif font-semibold tracking-tight text-ink"
          style={{ fontSize: "var(--text-display)", lineHeight: 1.05 }}
        >
          {title}
        </h1>
        {intro && (
          <p className="measure mt-5 text-lg leading-relaxed text-muted">
            {intro}
          </p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  onDark = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  onDark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2
        className={`text-3xl font-semibold tracking-tight sm:text-4xl ${
          onDark ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            onDark ? "text-cream/80" : "text-muted"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
