import Image from "next/image";
import { Section } from "./Section";
import { SectionHeading } from "./PageHero";
import {
  approvedPartners,
  SERVED_PARTNERS_AS_OF,
  SERVED_PARTNERS_COPY,
} from "@/lib/partners";

/**
 * Partner recognition grid. Renders nothing until src/lib/partners.ts holds
 * at least one partner with a written yes on file. Logos sit in a fixed box
 * and scale to fit, never stretched or recolored.
 */
export function PartnersServed() {
  const partners = approvedPartners();
  if (partners.length === 0) return null;

  return (
    <Section background="white" id="partners" className="scroll-mt-24">
      <SectionHeading
        eyebrow={SERVED_PARTNERS_COPY.eyebrow}
        title={SERVED_PARTNERS_COPY.title}
        intro={SERVED_PARTNERS_COPY.intro}
      />
      {/* Organization cards sit three across on desktop; the two CHS
          program cards each take half the row beneath, so the pair match
          each other's height and width (founder 2026-11-20). */}
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {partners.map((p) => {
          const inner = (
            <>
              {/* Fixed-height box whether or not a logo exists, so names sit
                  on one line across a row that mixes logo and name-only
                  cards. */}
              <span className="relative block h-20 w-full">
                {p.logo && (
                  <Image
                    src={p.logo.src}
                    alt={p.logo.alt}
                    unoptimized={p.logo.src.endsWith(".svg")}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                    className="object-contain"
                  />
                )}
              </span>
              <span className="mt-4 block text-lg font-bold text-sage-600">{p.name}</span>
              {p.parentOrg && (
                <span className="mt-1 block text-sm text-body">{p.parentOrg}</span>
              )}
              {p.programs && p.programs.length > 0 && (
                <span className="mt-1 block text-sm text-body">{p.programs.join(" · ")}</span>
              )}
            </>
          );
          return (
            <li
              key={p.name}
              className={`flex flex-col rounded-2xl border border-line bg-cream p-6 shadow-card ${
                p.parentOrg ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {inner}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                inner
              )}
              {p.description && (
                <p className="mt-2 text-sm leading-relaxed text-body">{p.description}</p>
              )}
            </li>
          );
        })}
      </ul>
      {SERVED_PARTNERS_AS_OF && (
        <p className="mt-6 text-sm text-muted">As of {SERVED_PARTNERS_AS_OF}</p>
      )}
    </Section>
  );
}
