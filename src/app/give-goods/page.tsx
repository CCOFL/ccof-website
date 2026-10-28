import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SustainabilityCallout } from "@/components/SustainabilityCallout";
import { GoodsList } from "@/components/GoodsList";
import {
  GIVE_GOODS,
  FDACS_DISCLOSURE,
  GOODS_LEAD_INS,
  NEEDED_NOW,
  binDroppableGoods,
  controlledChannelGoods,
  declinedSentence,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Give Goods",
  description:
    "Donate quality kids' goods to The Children's Collective of Florida. Schedule a Martin County pickup, host a donation bin, or run a drive. Your items fund local programs or reach a child in crisis through a partner.",
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
          <LinkButton href="/pickup" size="lg">
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

      {/* NEED NOW (founder + Cowork list, 2026-10-27): the current-needs
          list. /needs (next.config.ts) is its stable QR address; updating
          it = NEEDED_NOW in site.ts (items + updated date). The master
          decline sentence renders in What we collect just below, so it is
          not repeated here; the "What we collect" link lands on it. */}
      <Section background="cream" id="need-now" className="scroll-mt-24">
        <SectionHeading eyebrow={NEEDED_NOW.updated} title={NEEDED_NOW.heading} />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {NEEDED_NOW.items.map((item) => (
            <li
              key={item.slice(0, 40)}
              className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-base leading-relaxed text-body"
            >
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-deep"
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-base text-body">
          {NEEDED_NOW.fundsLine}{" "}
          <Link
            href="/donate"
            className="font-semibold text-sage-600 underline-offset-4 hover:underline"
          >
            Give funds →
          </Link>
        </p>
        <p className="mt-3 text-base text-body">
          {NEEDED_NOW.elseLine}{" "}
          <Link
            href="#collect"
            className="font-semibold text-sage-600 underline-offset-4 hover:underline"
          >
            What we collect →
          </Link>
        </p>
      </Section>

      {/* What we collect */}
      <Section background="white" id="collect" className="scroll-mt-24">
        <SectionHeading
          eyebrow="What we collect"
          title="Quality kids' goods, ready for a second home"
          intro="If your children have outgrown it, another child can grow into it. We welcome the quality kids' items your family is ready to pass on and treat each one as a gift entrusted to our care."
        />
        {/* Channel-aware lists from ACCEPTED_GOODS: bin-droppable first (the
            most common donations), then the handed-in-person group. */}
        <GoodsList
          className="mt-8"
          leadIn={GOODS_LEAD_INS.giveGoods.bin}
          group={binDroppableGoods()}
        />
        <GoodsList
          className="mt-8"
          leadIn={GOODS_LEAD_INS.giveGoods.controlled}
          group={controlledChannelGoods()}
          link={{ href: "/pickup", label: GOODS_LEAD_INS.controlledLink }}
        />
        <p className="measure mt-6 text-sm leading-relaxed text-muted">
          {declinedSentence()}
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
        <SustainabilityCallout variant="give" />
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
        {/* Required FL solicitation disclosure: this page solicits goods. */}
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">
          {FDACS_DISCLOSURE}
        </p>
      </Section>
    </>
  );
}
