import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import {
  ORG,
  MISSION,
  BOARD,
  FOUNDER,
  WHY_THIS_MATTERS,
  IMPACT_SOURCES,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Children's Collective of Florida turns everyday community generosity into real resources for children in foster care, kinship homes, and families in crisis.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="About The Children's Collective of Florida"
        intro="Currently serving Martin County and the Treasure Coast — built here, building for Florida."
      />

      {/* Why This Matters Here — local need (scaling/What's-Next omitted) */}
      <Section background="white">
        <SectionHeading
          eyebrow="The local need"
          title="Why this matters here"
        />
        <p className="measure mt-6 text-lg leading-relaxed text-body">
          {WHY_THIS_MATTERS.intro}
        </p>
        <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-muted">
          {WHY_THIS_MATTERS.dataIntro}
        </p>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2">
          {WHY_THIS_MATTERS.data.map((d, i) => (
            <Reveal as="li" key={d.figure} delay={i * 70}>
              <div className="flex h-full gap-4 rounded-2xl border border-line bg-cream p-5">
                <span className="text-3xl font-bold leading-none text-sage-600">
                  {d.figure}
                </span>
                <span className="text-sm leading-relaxed text-body">
                  {d.label}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mt-4 text-xs italic text-muted">{IMPACT_SOURCES}</p>
        <p className="measure mt-8 text-lg leading-relaxed text-body">
          {WHY_THIS_MATTERS.closing}
        </p>
      </Section>

      {/* Our Mission — official extended statement */}
      <Section background="cream">
        <SectionHeading eyebrow="Our mission" title="Why we exist" />
        <p className="measure mt-6 text-lg leading-relaxed text-body">
          {MISSION}
        </p>
        <p className="measure mt-5 text-lg leading-relaxed text-body">
          Our flagship program,{" "}
          <strong className="font-semibold text-ink">
            {ORG.flagshipProgram}
          </strong>
          , is coming to {ORG.flagshipCity} in {ORG.flagshipLaunch} — an
          affordable community resale program for quality kids&apos; goods, open
          to everyone, with proceeds reinvested in local programs that serve
          children.
        </p>
      </Section>

      {/* Meet Our Founder — real bio + primary Founder's Promise */}
      <Section background="white">
        <SectionHeading eyebrow="Meet our founder" title={FOUNDER.name} />
        <div className="measure mt-8 space-y-5 text-lg leading-relaxed text-body">
          <p className="font-medium text-ink">{FOUNDER.intro}</p>
          {FOUNDER.bio.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        {/* The Founder's Promise — primary version */}
        <Reveal>
          <figure className="mx-auto mt-12 max-w-3xl rounded-3xl border border-line bg-cream-dark/60 p-8 sm:p-10">
            <span
              aria-hidden
              className="block font-serif text-6xl leading-none text-coral/50"
            >
              &ldquo;
            </span>
            <blockquote className="-mt-4 font-serif text-xl italic leading-relaxed text-charcoal">
              {FOUNDER.promisePrimary}
            </blockquote>
            <figcaption className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted">
              {FOUNDER.name}
              <span className="mx-2 text-line" aria-hidden>
                |
              </span>
              <span className="font-medium normal-case tracking-normal">
                {FOUNDER.title}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* Board / governance */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Governance"
          title="Our board of directors"
          intro="A volunteer board accountable to our mission and our community."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOARD.map((member, i) => (
            <Reveal as="li" key={member.name} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-cream/60 p-5">
                <p className="text-lg font-bold text-ink">{member.name}</p>
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
            { term: "FL Charitable Registration", desc: `No. ${ORG.flReg}` },
            {
              term: "IRS Determination",
              desc: "Letter dated May 12, 2026 (effective April 13, 2026)",
            },
          ].map((item) => (
            <div
              key={item.term}
              className="rounded-2xl border border-line bg-cream p-6 shadow-card"
            >
              <dt className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
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
