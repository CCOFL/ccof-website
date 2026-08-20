import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { PickupRequestForm } from "@/components/PickupRequestForm";
import { COLLECT_CHIPS, PICKUP_DECLINED_LINE } from "@/lib/site";

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
          of costing a reprint. See PICKUP_DECLINED_LINE in lib/site.ts. */}
      <Section background="cream">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Our full list"
            title="What we accept"
            intro="Especially helpful for strollers, highchairs, and large baby gear. Quality kids' goods, ready for a second home with another child."
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
            {PICKUP_DECLINED_LINE} Please give items that are clean, complete,
            and in good, gently-used condition.
          </p>
        </div>
      </Section>

      <Section background="white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
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
