import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { PARTNER_REQUESTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "You give, we steward, and donated goods reach the 501(c)(3) partner organizations caring for local children. See the transparent giving cycle behind The Children's Collective of Florida.",
  alternates: { canonical: "/how-it-works" },
};

/*
 * Architecture pass 2026-09-19 (ccof-program-architecture; full record in
 * CCOF_ALIGNED_Framing_Program_Budget_2026-09-04.md): this page renders
 * PAGE-LOCAL copy instead of the shared GIVING_CYCLE / PILLARS constants.
 * Program 3 (Children's Collective Grants) is internal only and must not
 * appear in public copy; the Closet is always future tense with Martin
 * County and 2027 attached. The shared constants still carry the old
 * language and still render on / and /about; they are second-pass backlog,
 * deliberately not edited here so unaudited pages don't change silently.
 */

const STEPS: {
  title: string;
  body: string;
  paths?: { title: string; body: string }[];
}[] = [
  {
    title: "You give",
    body: "Donate quality kids' goods or funds through a transparent local channel.",
  },
  {
    title: "We steward",
    body: "Everything you give is held to one standard. Then one of two things happens.",
    paths: [
      {
        title: "Straight to a partner.",
        body: "When one of our 501(c)(3) partners has a child who needs something now, the goods are contributed directly to them.",
      },
      {
        title: "Set aside for the Closet.",
        body: "Everything else is set aside for The Collective Kids Closet, our storefront program opening in Martin County in 2027.",
      },
    ],
  },
  {
    title: "Proceeds return",
    body: "When The Collective Kids Closet opens in Martin County in 2027, proceeds return to the funding pool for those same 501(c)(3) partner organizations.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Generosity in. Stewardship in the middle. Supply out."
        intro="We keep the path from your donation to the partner organizations caring for local children short, transparent, and local."
      />

      {/* WHY block: founder's words, approved 2026-09-20 (hers-then-mine;
          "pantry" kept by founder ruling: it describes the need's breadth,
          not a service CCOF offers). Do not edit without her. */}
      <Section background="cream">
        <div className="measure mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
            Why we exist
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/90">
            A few miles from here, a child is arriving somewhere new with very
            little to call their own. In our own backyard, many more children
            have a heart full of love but a closet or pantry that is not. The
            gap is resources, not care, and that is the gap The
            Children&apos;s Collective of Florida exists to close. We move
            goods through vetted 501(c)(3) partner organizations because they
            already know each child and family, which means we never receive a
            single identifying detail about a child. That is a deliberate
            design decision, and it is genuinely rare. And resale is a
            conviction rather than a convenience: a community sustaining its
            own children, with proceeds returning to the partner organizations
            caring for them.
          </p>
        </div>
      </Section>

      <Section background="white">
        <ol className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-line bg-cream p-7 shadow-card">
              <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                Step {i + 1}
              </span>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              {step.paths && (
                <ul className="mt-4 space-y-3">
                  {step.paths.map((path) => (
                    <li key={path.title} className="rounded-xl bg-white/70 p-4">
                      <p className="text-sm font-semibold">{path.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {path.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section background="cream">
        <SectionHeading
          eyebrow="The programs"
          title="One organization, two public programs"
          intro="One is operating today. The other opens in 2027."
        />
        {/* Both program blocks are the approved copy from the aligned record,
            verbatim. Do not paraphrase them. */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="flex h-full flex-col rounded-2xl border border-sage/30 bg-white p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-sage-600">
              Operating now
            </span>
            <h3 className="mt-2 text-xl font-bold">
              Children&apos;s Collective Supply
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              Community members donate children&apos;s clothing, shoes, books,
              toys, and gear through our collection bins and community drives.
              We collect and sort, and our 501(c)(3) partner organizations tell
              us what they need. They call, we supply. Goods are contributed
              directly to the partner organization already caring for those
              children and families.
            </p>
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              Opening in Martin County in 2027
            </span>
            <h3 className="mt-2 text-xl font-bold">The Collective Kids Closet</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              Our storefront program, opening in Martin County in 2027. It will
              resell quality children&apos;s clothing and goods at affordable,
              sustainable prices for all families throughout the community,
              keeping usable goods in circulation. Proceeds return to the
              funding pool for those same 501(c)(3) partner organizations.
            </p>
          </div>
        </div>
        <p className="measure mt-8 text-base text-muted">
          Children&apos;s Collective Supply serves Martin, St. Lucie, and Palm
          Beach counties.
        </p>
        <p className="measure mt-3 text-base text-muted">
          Prefer to give time? Volunteering is a way to take part in both
          programs.{" "}
          <a href="/volunteer" className="font-semibold text-sage-600 underline">
            Learn about volunteering
          </a>
        </p>
      </Section>

      {/* Two paths from the same donated goods */}
      <Section background="white">
        <SectionHeading
          eyebrow="Two paths, one promise"
          title="Your donation reaches a child two ways"
          intro="The same community generosity flows through two channels. One contributes goods directly to our partner nonprofits for a child who needs them now. The other will stock The Collective Kids Closet when it opens in Martin County in 2027."
        />
        {/* Partners-first ordering (founder ruling 9/3): the direct-goods
            partner path is Path 1, resale is Path 2. */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="flex h-full flex-col rounded-2xl border border-sage/30 bg-cream p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              Path 1 · Direct goods
            </span>
            <h3 className="mt-2 text-xl font-bold">
              Partner Requests: goods, directly
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              When a partner is serving a child in a crisis placement who needs
              clothing, shoes, or essentials now, the goods are contributed
              directly to the partner, never resold.
            </p>
            <div className="mt-5">
              <LinkButton href={PARTNER_REQUESTS.cta.href} variant="secondary">
                {PARTNER_REQUESTS.cta.label}
              </LinkButton>
            </div>
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-line bg-cream p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              Path 2 · The Closet
            </span>
            <h3 className="mt-2 text-xl font-bold">
              Resale that sustains the mission
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              The Collective Kids Closet is our storefront program, opening in
              Martin County in 2027. It will resell quality children&apos;s
              clothing and goods at affordable, sustainable prices for all
              families throughout the community, and proceeds return to the
              funding pool for those same 501(c)(3) partner organizations.
            </p>
          </div>
        </div>
      </Section>

      {/* Where your money goes */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Where your money goes"
          title="Every gift compounds"
          intro="It funds the supply operation: bins, storage, insurance, sorting equipment, and the goods we deliver to our partner organizations. We have no paid staff and no salaries, so your gift builds the program rather than payroll."
        />
        <ol className="measure mt-8 space-y-5 text-lg leading-relaxed text-ink/90">
          <li>
            {/* Founder-locked standard line (9/4). One verb tense-shifted to
                future per the architecture's Closet rule; flagged to the
                founder for her ruling in the 9/19 pass. */}
            <strong className="font-semibold">Goods are held to our standard.</strong>{" "}
            Every item earns its place the same way, whether that place is with
            a partner or on a hanger in the Closet. If we wouldn&apos;t pass it
            along, it earns neither. What hangs will be priced affordably.
          </li>
          <li>
            <strong className="font-semibold">Sales will sustain the mission.</strong>{" "}
            When The Collective Kids Closet opens in Martin County in 2027,
            proceeds return to the funding pool for those same 501(c)(3)
            partner organizations.
          </li>
          <li>
            <strong className="font-semibold">
              Partner organizations stay supplied.
            </strong>{" "}
            The 501(c)(3) partner organizations we supply today are the same
            ones the funding pool exists for.
          </li>
        </ol>
        <p className="measure mt-6 text-sm text-muted">
          A detailed &ldquo;where your money goes&rdquo; breakdown will be
          published here once our first full cycle of data is available.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/donate">Donate</LinkButton>
          <LinkButton href="/partner" variant="secondary">
            Become a Partner Nonprofit
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
