import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { PickupRequestForm } from "@/components/PickupRequestForm";

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
      <Section background="white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <PickupRequestForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Pickups run as volunteer capacity allows — for a few bags, our
            donation bins and drop-offs are often fastest.
          </p>
        </div>
      </Section>
    </>
  );
}
