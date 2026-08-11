import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { BinHostForm } from "@/components/BinHostForm";

export const metadata: Metadata = {
  title: "Host a Donation Bin",
  description:
    "Host a Children's Collective of Florida donation bin at your business, school, or congregation and turn your foot traffic into support for local kids.",
  alternates: { canonical: "/host-a-bin" },
};

export default function HostABinPage() {
  return (
    <>
      <PageHero
        eyebrow="Host a Bin"
        title="Put your foot traffic to work for local kids."
        intro="Our indoor donation bins let your customers, students, or congregation give quality kids' goods right where they already are. We handle the bin, the pickups, and the thank-yous — you provide the spot."
      />
      <Section background="white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <BinHostForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Bins are indoor units (about 2&times;2 feet) so donations stay
            clean and dry. We&apos;ll schedule a quick conversation before any
            placement.
          </p>
        </div>
      </Section>
    </>
  );
}
