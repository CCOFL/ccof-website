import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { GIVE_GOODS, COLLECT_CHIPS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Give Goods",
  description:
    "Donate quality kids' goods to The Children's Collective of Florida. Schedule a Martin County pickup, host a donation bin, or run a drive. Your items fund local programs or go directly to a child in crisis.",
  alternates: { canonical: "/give-goods" },
};

export default function GiveGoodsPage() {
  return (
    <>
      <PageHero
        eyebrow={GIVE_GOODS.eyebrow}
        title={GIVE_GOODS.title}
        intro={GIVE_GOODS.intro}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <LinkButton href="/contact?intent=pickup" size="lg">
            Schedule a pickup
          </LinkButton>
          <Link
            href="/donate"
            className="text-sm font-semibold text-sage-600 underline-offset-4 hover:underline"
          >
            Prefer to give funds? →
          </Link>
        </div>
      </PageHero>

      {/* What we collect */}
      <Section background="white">
        <SectionHeading
          eyebrow="What we collect"
          title="Quality kids' goods, ready for a second home"
          intro="If your children have outgrown it and it's clean and complete, chances are we'd love it."
        />
        <ul className="mt-8 flex flex-wrap gap-3">
          {COLLECT_CHIPS.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-sage/30 bg-sage/5 px-4 py-2 text-sm font-medium text-ink"
            >
              {chip}
            </li>
          ))}
        </ul>
        <p className="measure mt-6 text-sm leading-relaxed text-muted">
          {GIVE_GOODS.notAccepted}
        </p>
      </Section>

      {/* Two ways every donation helps */}
      <Section background="cream">
        <SectionHeading
          eyebrow="Where it goes"
          title="Two ways every donation reaches a child"
          intro="Whatever you give does one of two things, and both reach a child who needs it."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {GIVE_GOODS.impact.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-cream p-7 shadow-card">
                <h3 className="text-xl font-bold text-sage-600">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm text-body">
          <Link
            href="/how-it-works"
            className="font-semibold text-sage-600 underline-offset-4 hover:underline"
          >
            See how the whole model works →
          </Link>
        </p>
      </Section>

      {/* Three ways to give */}
      <Section background="white">
        <SectionHeading
          eyebrow="How to give"
          title="Three easy ways to donate goods"
          intro="Start with a pickup (we come to you in Martin County), or bring your whole community in."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {GIVE_GOODS.ways.map((way, i) => {
            const featured = (way as { featured?: boolean }).featured ?? false;
            return (
              <Reveal key={way.title} delay={i * 80}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                    featured
                      ? "border-sage-600 bg-sage/5"
                      : "border-line bg-cream hover:border-sage-light/60"
                  }`}
                >
                  {featured && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-sage-600 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-cream">
                      Available now
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{way.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {way.body}
                  </p>
                  <div className="mt-5">
                    <LinkButton
                      href={way.cta.href}
                      variant={featured ? "primary" : "secondary"}
                    >
                      {way.cta.label}
                    </LinkButton>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="measure mt-8 text-sm leading-relaxed text-muted">
          {GIVE_GOODS.taxNote}
        </p>
      </Section>
    </>
  );
}
