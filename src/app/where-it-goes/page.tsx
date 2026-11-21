import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { PartnersServed } from "@/components/PartnersServed";
import { WHERE_IT_GOES, FDACS_DISCLOSURE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Where It Goes",
  description:
    "Our transparency commitment. What you give is honored, local dollars kept local, and the vetted nonprofit partners we currently serve.",
  alternates: { canonical: "/where-it-goes" },
};

export default function WhereItGoesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our promise of transparency"
        title="Where It Goes"
        intro={WHERE_IT_GOES.intro}
      />

      {/* Three pledges */}
      <Section background="white">
        <SectionHeading
          eyebrow="Our pledges"
          title="What we promise you"
          intro="Three commitments you can hold us to, in writing, from day one."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {WHERE_IT_GOES.pledges.map((pledge, i) => (
            <Reveal key={pledge.title} delay={i * 90}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-cream p-6 shadow-card">
                <span
                  aria-hidden
                  className="grid h-11 w-11 place-items-center rounded-full bg-sage-600 text-base font-extrabold text-cream"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold">{pledge.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {pledge.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* "What we'll report" section removed 2026-11-20 (founder): returns as
          the real impact report once there is a season of data. Copy kept in
          WHERE_IT_GOES.reportTitle/reportItems. */}

      {/* Partner recognition: renders only when a partner has given a
          written yes (src/lib/partners.ts). Empty list, no section. */}
      <PartnersServed />

      {/* Closing commitment + CTA */}
      <Section background="sage">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow onDark>Our commitment</Eyebrow>
          <p className="font-serif text-2xl leading-snug text-cream sm:text-[1.75rem]">
            {WHERE_IT_GOES.closing}
          </p>
          <div className="mt-8">
            <LinkButton href="/donate" size="lg" variant="inverse">
              Give with confidence
            </LinkButton>
          </div>
        </div>
      </Section>

      {/* Required FL solicitation disclosure */}
      <Section background="cream-dark" className="py-10">
        <div className="mx-auto max-w-3xl space-y-2 text-xs leading-relaxed text-muted">
          <p>{FDACS_DISCLOSURE}</p>
        </div>
      </Section>
    </>
  );
}
