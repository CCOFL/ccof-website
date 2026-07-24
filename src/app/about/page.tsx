import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import {
  ORG,
  MISSION,
  BOARD,
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
        intro="Currently serving Martin County and the Treasure Coast. Built here, building for Florida."
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
          , is coming to {ORG.flagshipCity} in {ORG.flagshipLaunch}, an
          affordable community resale program for quality kids&apos; goods, open
          to everyone, with proceeds reinvested in local programs that serve
          children.
        </p>
      </Section>

      {/* Our team — the founder leads the grid as one equally-weighted member,
          not a full-width hero. Her personal-promise quote now lives on the
          homepage, so it is intentionally not duplicated here. */}
      <Section background="white">
        <SectionHeading
          eyebrow="Our Founding Board"
          title="Board of Directors"
          intro="Every member here helped found The Children's Collective of Florida. Together, they're a volunteer board accountable to our mission and our community, sharing the work of turning everyday generosity into real support for kids."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BOARD.map((member, i) => (
            <Reveal as="li" key={member.name} delay={i * 70}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-cream p-6 shadow-card">
                <h3 className="text-lg font-bold text-ink">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-coral-deep">
                  {member.role}
                </p>
                {member.bio ? (
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-body">
                    {member.bio.map((para) => (
                      <p key={para.slice(0, 24)}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm italic leading-relaxed text-muted">
                    Bio coming soon — provided by {ORG.name}.
                  </p>
                )}
              </article>
            </Reveal>
          ))}
          {/* Sixth tile: expression-of-interest invitation (fills the 3x2 grid).
              Compliance: invites interest ONLY, promises nothing. Board seats
              are filled per Bylaws Art. III (3-9 directors, currently 5;
              annual-meeting election / majority vote on vacancies); committees
              per Art. VI (established by the Board); service is unpaid per
              Art. VIII. Not a solicitation of contributions, so it does not
              trigger the FL 496.411 disclosure (footer carries it sitewide). */}
          <Reveal as="li" delay={BOARD.length * 70}>
            {/* Coral dashed border + chip mirror the Volunteer Service pillar's
                "in development" treatment (Pillars.tsx) — future-tense signal. */}
            <article className="flex h-full flex-col rounded-2xl border-2 border-dashed border-coral bg-cream p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-ink">An Open Seat</h3>
                <span className="shrink-0 rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-coral-deep">
                  Growing Soon
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-coral-deep">
                Could this be you?
              </p>
              <div className="mt-3 flex-1 space-y-3 text-sm leading-relaxed text-body">
                <p>
                  Everything we build for local kids is powered by people who
                  said yes. As we grow, we will welcome future board members
                  with a heart for governance, committee members in areas like
                  finance, fundraising, and partnership building, and
                  hands-on volunteers for launch season.
                </p>
                <p>
                  Board and committee service is volunteer, guided by our
                  bylaws, and it starts with a simple hello. If our mission
                  speaks to you, we would love to meet you.
                </p>
              </div>
              <div className="mt-4">
                <LinkButton href="/contact?intent=volunteer" variant="secondary">
                  Start the conversation
                </LinkButton>
              </div>
            </article>
          </Reveal>
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
