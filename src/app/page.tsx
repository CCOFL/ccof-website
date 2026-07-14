import Image from "next/image";
import Link from "next/link";
import heroChildren from "../../public/images/hero-children.jpg";
import { Section, Eyebrow } from "@/components/Section";
import { LinkButton } from "@/components/Button";
import { FounderQuote } from "@/components/FounderQuote";
import { ImpactStats } from "@/components/ImpactStats";
import { GivingCycle } from "@/components/GivingCycle";
import { CollectMarquee } from "@/components/CollectMarquee";
import { WhereItGoesTeaser } from "@/components/WhereItGoesTeaser";
import { EmailCapture } from "@/components/EmailCapture";
import { SectionHeading } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ORG, MISSION_LEAD } from "@/lib/site";
import { getImpactStats } from "@/lib/impact";

// Re-fetch the impact figures from Supabase daily (data changes quarterly).
export const revalidate = 86400;

export default async function Home() {
  const impactStats = await getImpactStats();
  return (
    <>
      {/* HERO — content starts in the first viewport; one primary + one secondary CTA (brief #4/#5) */}
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Eyebrow>Built in Martin County. Building for Florida.</Eyebrow>
              <h1
                className="font-extrabold tracking-tight text-sage-600"
                style={{ fontSize: "var(--text-display)", lineHeight: 1.04 }}
              >
                Powered by Community.{" "}
                <span className="text-sage">Supporting Kids.</span>
              </h1>
              <p className="measure mt-6 text-lg leading-relaxed text-muted">
                {MISSION_LEAD}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <LinkButton href="/give-goods" size="lg">
                  Donate Goods
                </LinkButton>
                <LinkButton href="/donate" variant="secondary" size="lg">
                  Give Funds
                </LinkButton>
              </div>
              <p className="mt-4 text-sm">
                <Link
                  href="/how-it-works"
                  className="font-semibold text-sage-600 underline-offset-4 hover:underline"
                >
                  Or see how it works →
                </Link>
              </p>
              <p className="mt-6 text-sm text-muted">
                Flagship program{" "}
                <strong className="font-semibold text-ink">
                  {ORG.flagshipProgram}
                </strong>{" "}
                is coming to {ORG.flagshipCity} in {ORG.flagshipLaunch}. The
                goods you give now are what will fill its shelves.
              </p>
            </div>

            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-card">
                <Image
                  src={heroChildren}
                  alt="Children playing together outdoors on the Treasure Coast"
                  fill
                  priority
                  placeholder="blur"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="hero-fade object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* IMPACT — count-up stats (brief §6) */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Why it matters"
          title="The need is local, and it is real"
          intro="Behind every number is a child on the Treasure Coast who needs the basics handled with care."
        />
        <div className="mt-12">
          <ImpactStats stats={impactStats} />
        </div>
      </Section>

      {/* THE GIVING CYCLE — closed self-sustaining loop (You give → We steward →
          Programs get funded → back to the community) */}
      <Section background="white">
        <SectionHeading
          eyebrow="The model"
          title="The giving cycle"
          intro="Our community's generosity funds local programs, and the proceeds cycle right back to the neighbors who gave."
        />
        <div className="mt-12">
          <GivingCycle />
        </div>
      </Section>

      {/* WHERE IT GOES teaser — surfaces the transparency page in the body (brief task 5) */}
      <Section background="sage">
        <WhereItGoesTeaser />
      </Section>

      {/* WHAT WE COLLECT — marquee (brief §6) */}
      <Section background="white" className="overflow-hidden">
        <SectionHeading
          center
          eyebrow="Trusted Giving"
          title="What we collect"
          intro="Quality kids' goods, inspected, cleaned, and ready for a second home."
        />
        <div className="mt-10">
          <CollectMarquee />
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/give-goods">
            Donate these goods
          </LinkButton>
        </div>
      </Section>

      {/* FOUNDING PARTNERS — invite the early community builders/supporters
          who help launch CCOF (businesses, congregations, schools, bin hosts).
          The "programs we fund" invitation lives on the Partner page. */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Founding Partners"
          title="Help us build the foundation"
          intro="Every lasting effort starts with people who believe early. Founding partners are the businesses, schools, congregations, and neighbors helping launch The Children's Collective, and there's room for you."
        />
        <div className="mt-10">
          <Reveal>
            {/* Warm invitation in place of empty logo boxes. */}
            <div className="group mx-auto max-w-2xl rounded-3xl border border-line bg-cream p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-sage-light/60 hover:shadow-card-hover sm:p-10">
              <h3 className="text-2xl font-bold text-sage-600">
                Want to help?
              </h3>
              <p className="measure mx-auto mt-3 text-base leading-relaxed text-muted">
                This is powered by neighbors, businesses, schools, and
                congregations choosing to show up for local kids, collectively.
                Host a donation bin, run a goods drive, sponsor our first season,
                or simply spread the word. There&apos;s a place for you in the
                collective.
              </p>
              <div className="mt-6">
                <LinkButton href="/partner">
                  Become a founding partner
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FOUNDER'S PROMISE — a personal guarantee at the decision point, just
          above the closing CTA (brief task 6: lead with why, reinforce with the
          founder's voice lower down). */}
      <Section background="white">
        <FounderQuote />
      </Section>

      {/* FOLLOW OUR LAUNCH (brief §5) + closing donate CTA */}
      <Section background="charcoal">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              onDark
              eyebrow="Stay close"
              title="Follow our launch."
              intro="Be the first to know when Collective Kids Closet opens its doors in Martin County."
            />
            <div className="mt-7">
              <EmailCapture onDark />
            </div>
            <p className="mt-4 text-sm text-cream/70">
              Volunteer service is in development. Follow our launch to hear
              when it opens.
            </p>
          </div>
          <div className="rounded-3xl bg-sage/15 p-8 ring-1 ring-sage/25 lg:p-10">
            <p className="text-2xl font-bold leading-snug text-cream">
              Right now, the fastest way to help is to fill our shelves. Donate
              the quality kids&apos; items your family has outgrown.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <LinkButton href="/give-goods" size="lg" variant="inverse">
                Donate goods
              </LinkButton>
              <Link
                href="/donate"
                className="text-sm font-semibold text-cream/80 underline-offset-4 hover:text-cream hover:underline"
              >
                or give funds →
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
