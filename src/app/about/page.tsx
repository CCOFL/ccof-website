import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { ORG, MISSION, BOARD, FOUNDER } from "@/lib/site";

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

      {/* Our Mission — official extended statement */}
      <Section background="white">
        <SectionHeading eyebrow="Our mission" title="Why we exist" />
        <p className="measure mt-6 text-lg leading-relaxed text-body">
          {MISSION}
        </p>
        <p className="measure mt-5 text-lg leading-relaxed text-body">
          Our flagship program,{" "}
          <strong className="font-semibold text-ink">
            {ORG.flagshipProgram}
          </strong>
          , launches {ORG.flagshipLaunch} in {ORG.flagshipCity} — an affordable
          community resale program for quality kids&apos; goods, open to everyone,
          with proceeds funding local programs that serve children.
        </p>
      </Section>

      {/* Meet Our Founder — real bio + primary Founder's Promise */}
      <Section background="cream">
        <SectionHeading eyebrow="Meet our founder" title={FOUNDER.name} />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          {/* Founder photo placeholder */}
          <Reveal>
            <div
              className="grid aspect-[4/5] place-items-center rounded-3xl border border-line bg-cream-dark p-8 text-center shadow-card"
              role="img"
              aria-label="Photograph placeholder: Stephanie Haskins, Founder & President"
            >
              <div>
                <span className="font-serif text-xl text-sage">
                  Founder photo
                </span>
                <p className="mt-2 text-sm text-muted">
                  Stephanie Haskins, Founder &amp; President
                </p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-5 text-lg leading-relaxed text-body">
            <p className="font-medium text-ink">{FOUNDER.intro}</p>
            {FOUNDER.bio.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
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
      <Section background="white">
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
