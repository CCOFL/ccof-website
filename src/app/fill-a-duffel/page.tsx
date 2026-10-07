import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { GoodsList } from "@/components/GoodsList";
import { binDroppableGoods, declinedSentence } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fill a Duffel",
  description:
    "Run a Fill a Duffel drive with The Children's Collective of Florida: your office, school, or congregation fills duffel bags for local children arriving somewhere new. We hand you the list and collect every bag.",
  alternates: { canonical: "/fill-a-duffel" },
};

/**
 * The signature one-time drive (founder, 2026-10-06). The packing list
 * renders from ACCEPTED_GOODS via the shared helpers, never retyped, so the
 * drive list and the site's accept list can never disagree. Controlled-
 * channel items (formula, infant medical) are excluded by construction:
 * binDroppableGoods() already omits them.
 */
export default function FillADuffelPage() {
  return (
    <>
      <PageHero
        eyebrow="Run a drive"
        title="Fill a Duffel"
        intro="Somewhere near us, a child is arriving somewhere new with very little to call their own. A Fill a Duffel drive is one bag, packed with care by your office, school, team, or congregation, so what they carry is theirs."
      />

      <Section background="white">
        <SectionHeading
          eyebrow="How it works"
          title="One weekend. One bag per child. We do the rest."
        />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Tell us your week",
              body: "Pick a week that suits your group and send the form below. We confirm the details, hand you the packing list, and answer anything.",
            },
            {
              title: "Fill the duffels",
              body: "Each bag is packed for one child: pick an age range, follow the list, and use a duffel bag in new or excellent condition, because the bag is part of the gift.",
            },
            {
              title: "We collect every bag",
              body: "When your drive wraps, we come pick it all up. Invite us to the event itself and we will do our best to be there.",
            },
          ].map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-line bg-cream p-7 shadow-card"
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                Step {i + 1}
              </span>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section background="cream">
        <SectionHeading
          eyebrow="The packing list"
          title="What goes in the bag"
          intro="Pack to one child: choose an age range, then fill the bag from this list. Every item is held to one standard, whether it reaches a partner organization or, once it opens in Martin County in 2027, the Collective Kids Closet."
        />
        <div className="mt-10 max-w-3xl">
          <GoodsList leadIn="Pack from this list:" group={binDroppableGoods()} />
          <p className="measure mt-6 text-sm leading-relaxed text-muted">
            The duffel bag itself should be new or in excellent condition.
            Please give used items that are clean, complete, and in good
            condition. {declinedSentence()}
          </p>
        </div>
      </Section>

      <Section background="white">
        <SectionHeading
          eyebrow="Ready?"
          title="Pick your week and we'll take it from there"
          intro="The same community generosity, one duffel bag at a time. Goods from your drive are contributed directly to the partner organizations caring for local children."
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/host-a-bin?intent=drive#bin-form" size="lg">
            Plan my drive
          </LinkButton>
          <Link
            href="/host-a-bin"
            className="self-center text-sm font-semibold text-sage-600 underline-offset-4 hover:underline"
          >
            Or host a standing bin →
          </Link>
        </div>
      </Section>
    </>
  );
}
