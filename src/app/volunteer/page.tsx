import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { VolunteerForm } from "@/components/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Raise your hand to volunteer with The Children's Collective of Florida: sorting, drives, events, and outreach as Volunteer Service launches.",
  alternates: { canonical: "/volunteer" },
};

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Volunteer"
        title="Lend your hands. We'll bring the mission."
        intro="Volunteer Service is launching alongside the Collective Kids Closet. Add your name now and we'll reach out as opportunities open: sorting and closet prep, donation drives, events, and community outreach."
      />
      <Section background="white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <VolunteerForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            This is an interest list, not a commitment. We&apos;ll match
            opportunities to your availability when the time comes.
          </p>
        </div>
      </Section>
    </>
  );
}
