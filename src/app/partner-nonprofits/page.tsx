import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { PartnerRequestForm } from "@/components/PartnerRequestForm";
import { PARTNER_REQUESTS, ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "For Partner Nonprofits",
  description:
    "Partner 501(c)(3)s serving children in foster care, kinship care, or crisis can request clothing, shoes, and essentials for a child in need — provided directly, at no cost.",
  alternates: { canonical: "/partner-nonprofits" },
};

export default function PartnerNonprofitsPage() {
  return (
    <>
      <PageHero
        eyebrow={PARTNER_REQUESTS.eyebrow}
        title={PARTNER_REQUESTS.title}
        intro={PARTNER_REQUESTS.intro}
      />

      {/* How the channel works */}
      <Section background="white">
        <SectionHeading
          eyebrow="How it works"
          title="From a partner's request to a child's hands"
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {PARTNER_REQUESTS.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-cream p-6 shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-600 text-base font-extrabold text-cream">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
        <p className="measure mt-8 text-base leading-relaxed text-ink/90">
          {PARTNER_REQUESTS.stewardship}
        </p>
      </Section>

      {/* Request form */}
      <Section background="cream">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Make a request"
              title="Tell us what a child needs"
            />

            {/* Interim urgent-needs channel (direct line + phone are Phase 2) */}
            <div className="mt-6 rounded-2xl border border-coral/30 bg-coral/5 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                Urgent need?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/90">
                {PARTNER_REQUESTS.urgentIntro}{" "}
                <a
                  href={`mailto:${ORG.email}`}
                  className="font-semibold text-coral-deep underline-offset-4 hover:underline"
                >
                  {ORG.email}
                </a>
              </p>
            </div>

            <p className="measure mt-6 text-base leading-relaxed text-muted">
              {PARTNER_REQUESTS.eligibility}
            </p>
            <p className="measure mt-4 text-base leading-relaxed text-muted">
              {PARTNER_REQUESTS.expectation}
            </p>
            <p className="mt-6 text-sm text-muted">
              Please don&apos;t include a child&apos;s name or identifying
              details — ages and sizes are all we need.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <PartnerRequestForm />
          </div>
        </div>
      </Section>
    </>
  );
}
