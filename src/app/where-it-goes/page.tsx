import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { WHERE_IT_GOES, FL_DISCLOSURE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Where It Goes",
  description:
    "Our transparency commitment. Every donation honored, local dollars kept local, and a public account of what we collect and where proceeds go — starting with our first season.",
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
          intro="Three commitments you can hold us to — in writing, from day one."
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

      {/* What we'll report */}
      <Section background="cream">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Accountability"
            title={WHERE_IT_GOES.reportTitle}
            intro="Pre-launch, this is our credibility. The moment we open, it becomes our impact report."
          />
          <ul className="space-y-4">
            {WHERE_IT_GOES.reportItems.map((item, i) => (
              <Reveal as="li" key={item.slice(0, 24)} delay={i * 70}>
                <div className="flex gap-3 rounded-xl border border-line bg-white p-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="mt-0.5 shrink-0 text-sage"
                  >
                    <path
                      d="M5 12.5l4 4 10-10"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-base leading-relaxed text-body">
                    {item}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

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
        <p className="mx-auto max-w-3xl text-xs leading-relaxed text-muted">
          {FL_DISCLOSURE}
        </p>
      </Section>
    </>
  );
}
