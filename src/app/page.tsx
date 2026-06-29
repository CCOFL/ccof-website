import Image from "next/image";
import { Section, Eyebrow } from "@/components/Section";
import { LinkButton } from "@/components/Button";
import { FounderQuote } from "@/components/FounderQuote";
import { ImpactStats } from "@/components/ImpactStats";
import { Flywheel } from "@/components/Flywheel";
import { Pillars } from "@/components/Pillars";
import { CollectMarquee } from "@/components/CollectMarquee";
import { EmailCapture } from "@/components/EmailCapture";
import { SectionHeading } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ORG, MISSION_LEAD } from "@/lib/site";

export default function Home() {
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
                <LinkButton href="/donate" size="lg">
                  Donate
                </LinkButton>
                <LinkButton href="/how-it-works" variant="secondary" size="lg">
                  See how it works
                </LinkButton>
              </div>
              <p className="mt-6 text-sm text-muted">
                Flagship program{" "}
                <strong className="font-semibold text-ink">
                  {ORG.flagshipProgram}
                </strong>{" "}
                is coming to {ORG.flagshipCity} in {ORG.flagshipLaunch} — your
                gift now helps fund the opening.
              </p>
            </div>

            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-card">
                <Image
                  src="/images/hero-children.jpg"
                  alt="Children playing together outdoors on the Treasure Coast"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOUNDER PULL-QUOTE — promoted near the top (brief §5) */}
      <Section background="white">
        <FounderQuote />
      </Section>

      {/* IMPACT — count-up stats (brief §6) */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Why it matters"
          title="The need is local, and it is real"
          intro="Behind every number is a child on the Treasure Coast who needs the basics handled with care."
        />
        <div className="mt-12">
          <ImpactStats />
        </div>
      </Section>

      {/* FLYWHEEL — You give → We steward → Programs get funded (brief §5) */}
      <Section background="white">
        <SectionHeading
          eyebrow="The model"
          title="A simple, transparent giving flywheel"
          intro="Generosity in, stewardship in the middle, funded local programs out."
        />
        <div className="mt-12">
          <Flywheel />
        </div>
      </Section>

      {/* PILLARS */}
      <Section background="cream-dark">
        <SectionHeading
          eyebrow="How we work"
          title="Three pillars — and a fourth on the way"
          intro="Trusted Giving, Affordable Access, and Partner Programs work together. Volunteer Service is in development."
        />
        <div className="mt-12">
          <Pillars />
        </div>
      </Section>

      {/* WHAT WE COLLECT — marquee (brief §6) */}
      <Section background="white" className="overflow-hidden">
        <SectionHeading
          center
          eyebrow="Trusted Giving"
          title="What we collect"
          intro="Quality kids' goods — inspected, cleaned, and ready for a second home."
        />
        <div className="mt-10">
          <CollectMarquee />
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/donate" variant="secondary">
            Donate / Give Goods
          </LinkButton>
        </div>
      </Section>

      {/* PARTNER PROGRAMS placeholder (brief §5) */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Partner Programs"
          title="Founding partners — announcing soon"
          intro="Resale proceeds fund local 501(c)(3) programs serving kids in foster care, kinship homes, and crisis. We're finalizing our founding partner programs now."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 80}>
              <div className="grid h-28 place-items-center rounded-2xl border border-dashed border-line bg-cream text-sm text-muted">
                Partner logo — announcing soon
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <LinkButton href="/partner" variant="secondary">
            Partner with us
          </LinkButton>
        </div>
      </Section>

      {/* FOLLOW OUR LAUNCH (brief §5) + closing donate CTA */}
      <Section background="charcoal">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              onDark
              eyebrow="Stay close"
              title="Not ready to give? Follow our launch."
              intro="Be the first to know when Collective Kids Closet opens its doors in Martin County."
            />
            <div className="mt-7">
              <EmailCapture onDark />
            </div>
          </div>
          <div className="rounded-3xl bg-sage/15 p-8 ring-1 ring-sage/25 lg:p-10">
            <p className="text-2xl font-bold leading-snug text-cream">
              Right now, your gift goes toward opening day — helping stock
              shelves, secure a space, and fund our first partner programs.
            </p>
            <div className="mt-6">
              <LinkButton href="/donate" size="lg" variant="inverse">
                Fund the launch
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
