import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { PickupRequestForm } from "@/components/PickupRequestForm";
import { GoodsList } from "@/components/GoodsList";
import {
  GOODS_LEAD_INS,
  binDroppableGoods,
  controlledChannelGoods,
  declinedSentence,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Schedule a Goods Pickup",
  description:
    "Have kids' goods to donate? Request a pickup from The Children's Collective of Florida and we'll arrange a time that works.",
  alternates: { canonical: "/pickup" },
};

export default function PickupPage() {
  return (
    <>
      <PageHero
        eyebrow="Goods Pickup"
        title="Too much to carry? We'll come to you."
        intro="Tell us what you have and where you are, and we'll reply to arrange a pickup time. Every donated item goes toward supporting Florida children in foster care, kinship homes, and families navigating crisis."
      />
      {/* The authoritative accept/decline list. The printed bin decals
          (permanent vinyl) read "Scan the code above for our full list and to
          schedule a free pickup" and their QR points here, so this page is the
          one surface that must always carry the full, current list. It lives
          here, not in the decal art, so future policy changes are free instead
          of costing a reprint. Everything renders from ACCEPTED_GOODS in
          lib/site.ts. Two-part split, controlled group first: this page is the
          pickup request form, and the controlled group is what it exists for. */}
      <Section background="cream">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Our full list"
            title="What we accept"
            intro="Especially helpful for strollers, highchairs, and large baby gear. Quality kids' goods, ready for a second home with another child."
          />
          <GoodsList
            className="mt-8"
            leadIn={GOODS_LEAD_INS.pickup.controlled}
            group={controlledChannelGoods()}
            link={{ href: "#pickup-form", label: GOODS_LEAD_INS.controlledLink }}
          />
          <GoodsList
            className="mt-8"
            leadIn={GOODS_LEAD_INS.pickup.bin}
            group={binDroppableGoods()}
          />
          <p className="measure mt-6 text-sm leading-relaxed text-muted">
            {declinedSentence()}
          </p>
        </div>
      </Section>

      <Section background="white">
        <div className="mx-auto max-w-3xl">
          <div
            id="pickup-form"
            className="scroll-mt-24 rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8"
          >
            <PickupRequestForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Pickups run as volunteer capacity allows. For a few bags, our
            donation bins and drop-offs are often fastest.
          </p>
        </div>
      </Section>
    </>
  );
}
