import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { GivingCycle } from "@/components/GivingCycle";
import { Pillars } from "@/components/Pillars";
import { LinkButton } from "@/components/Button";
import { PARTNER_REQUESTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "You give, we steward, local programs get funded. See the transparent giving cycle behind The Children's Collective of Florida.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Generosity in. Stewardship in the middle. Funded programs out."
        intro="We keep the path from your donation to a child's hands short, transparent, and local."
      />

      <Section background="white">
        <GivingCycle />
      </Section>

      <Section background="cream">
        <SectionHeading
          eyebrow="The model"
          title="Four pillars, working together"
          intro="Three are live and one is in development — here's how each plays its part."
        />
        <div className="mt-12">
          <Pillars />
        </div>
      </Section>

      {/* Two paths from the same donated goods */}
      <Section background="white">
        <SectionHeading
          eyebrow="Two paths, one promise"
          title="Your donation reaches a child two ways"
          intro="The same community generosity flows through two channels — one funds local programs, the other puts goods straight into the hands of a child who needs them now."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="flex h-full flex-col rounded-2xl border border-line bg-cream p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              Path 1 · Funding
            </span>
            <h3 className="mt-2 text-xl font-bold">
              Resale that funds programs
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              Donated goods are inspected and resold affordably through
              Collective Kids Closet. The proceeds become grants to local
              501(c)(3) programs serving kids in foster care, kinship homes, and
              crisis.
            </p>
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-sage/30 bg-cream p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              Path 2 · Direct goods
            </span>
            <h3 className="mt-2 text-xl font-bold">
              {PARTNER_REQUESTS.card.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {PARTNER_REQUESTS.card.body}
            </p>
            <div className="mt-5">
              <LinkButton
                href={PARTNER_REQUESTS.cta.href}
                variant="secondary"
              >
                {PARTNER_REQUESTS.cta.label}
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Where your money goes */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Where your money goes"
          title="Every gift compounds"
          intro="During launch, your donation does double duty — it stocks the shelves and seeds the fund that supports our partner programs."
        />
        <ol className="measure mt-8 space-y-5 text-lg leading-relaxed text-ink/90">
          <li>
            <strong className="font-semibold">Goods are inspected.</strong>{" "}
            Donated items are cleaned, safety-checked, and priced affordably.
          </li>
          <li>
            <strong className="font-semibold">Sales fund the mission.</strong>{" "}
            {`Collective Kids Closet`} resale proceeds cover operations and
            create grant funding.
          </li>
          <li>
            <strong className="font-semibold">
              Partner programs receive grants.
            </strong>{" "}
            Local 501(c)(3) programs serving kids in care put those funds
            directly to work.
          </li>
        </ol>
        <p className="measure mt-6 text-sm text-muted">
          A detailed &ldquo;where your money goes&rdquo; breakdown will be
          published here once our first full cycle of data is available.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/donate">Donate</LinkButton>
          <LinkButton href="/partner" variant="secondary">
            Become a partner
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
