import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/PageHero";
import { PageHero } from "@/components/PageHero";
import { FounderQuote } from "@/components/FounderQuote";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { ORG, MISSION, BOARD } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Children's Collective of Florida channels community generosity into practical support for children and families across the Treasure Coast.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A mother's promise, organized into a mission"
        intro={MISSION}
      />

      <Section background="white">
        <div className="measure space-y-5 text-lg leading-relaxed text-ink/90">
          <p>
            {ORG.legalName} ({ORG.abbr}) was built in Martin County, Florida and
            is building for Florida. We exist to turn everyday community
            generosity into real, practical help for children — especially those
            in foster care, kinship homes, and crisis.
          </p>
          <p>
            Our flagship program,{" "}
            <strong className="font-semibold">{ORG.flagshipProgram}</strong>,
            launches {ORG.flagshipLaunch} in {ORG.flagshipCity}. It&apos;s an
            affordable community resale program for quality kids&apos; goods —
            open to everyone, with proceeds funding local programs that serve
            children.
          </p>
        </div>
      </Section>

      <Section background="cream">
        <FounderQuote />
      </Section>

      {/* Board / governance — transparency (brief §5) */}
      <Section background="white">
        <SectionHeading
          eyebrow="Governance"
          title="Our board of directors"
          intro="A volunteer board accountable to our mission and our community."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOARD.map((member, i) => (
            <Reveal as="li" key={member.name} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-cream/50 p-5">
                <p className="font-serif text-lg font-semibold text-ink">
                  {member.name}
                </p>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Trust block */}
      <Section background="cream-dark">
        <SectionHeading
          eyebrow="Transparency"
          title="A registered 501(c)(3) public charity"
        />
        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { term: "Federal EIN", desc: ORG.ein },
            {
              term: "FL Charitable Registration",
              desc: `No. ${ORG.flReg}`,
            },
            {
              term: "IRS Determination",
              desc: "Letter dated May 12, 2026 (effective April 13, 2026)",
            },
          ].map((item) => (
            <div
              key={item.term}
              className="rounded-2xl border border-line bg-cream p-6 shadow-card"
            >
              <dt className="text-sm font-semibold uppercase tracking-wider text-coral">
                {item.term}
              </dt>
              <dd className="mt-2 text-ink">{item.desc}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10">
          <LinkButton href="/donate">Support our mission</LinkButton>
        </div>
      </Section>
    </>
  );
}
