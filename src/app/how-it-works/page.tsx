import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { Flywheel } from "@/components/Flywheel";
import { Pillars } from "@/components/Pillars";
import { LinkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "You give, we steward, local programs get funded. See the transparent giving flywheel behind The Children's Collective of Florida.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Generosity in. Stewardship in the middle. Funded programs out."
        intro="We keep the path from your donation to a child's bedroom short, transparent, and local."
      />

      <Section background="white">
        <Flywheel />
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

      {/* Where your money goes */}
      <Section background="white">
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
