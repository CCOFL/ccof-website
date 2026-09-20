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
    "Kids' goods to donate anywhere in Martin County? Let us come to you. Outside Martin County? Write to us and we'll make arrangements whenever we can.",
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
          {/* Founder-authored pickup copy (Fix-7 ruling, 2026-09-20).
              Verbatim-protected: keep the question format (it makes readers
              check themselves against the list), keep "Let us come to you",
              and keep the two sentences separate. The town list is
              illustrative; the COUNTY is the boundary, so never add "and
              surrounding areas"/"neighboring communities" here (that elastic
              phrasing lives in the identity line only). The second line is an
              invitation, not a commitment: never harden "whenever we can"
              into a guarantee or soften it into a refusal. */}
          <p className="measure mx-auto mb-3 text-center text-base leading-relaxed text-body">
            Are you in Palm City, Port Salerno, Jensen Beach, Hobe Sound,
            Stuart, Indiantown, or anywhere else in Martin County? Let us come
            to you.
          </p>
          <p className="measure mx-auto mb-6 text-center text-base leading-relaxed text-body">
            Outside Martin County? Write to us and we&apos;ll make arrangements
            whenever we can.
          </p>
          <div
            id="pickup-form"
            className="scroll-mt-24 rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8"
          >
            <PickupRequestForm />
          </div>
          {/* PERMANENT (founder ruling 2026-09-20): bins are NOT public
              drop-off points. Each sits inside a host's private community and
              is promoted at the host's discretion; publishing locations would
              change the deal made with each host. Never add bin locations, a
              bin map, a bin count, or a "drop at one of our bins" invitation
              anywhere on the site. The only public intake channel is pickup;
              drop-off routing happens privately, per conversation. */}
          <p className="mt-6 text-center text-sm text-muted">
            Pickups run as volunteer capacity allows.
          </p>
        </div>
      </Section>
    </>
  );
}
