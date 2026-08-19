import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { GoodsDonationForm } from "@/components/GoodsDonationForm";

export const metadata: Metadata = {
  title: "Get Your Donation Receipt",
  description:
    "Just donated goods to The Children's Collective of Florida? Tell us what you gave and we'll email your in-kind donation receipt in moments.",
  alternates: { canonical: "/donated" },
};

// Next.js 16: searchParams is async. ?bin=<slug> arrives from host-specific
// QR decals; sanitized again server-side before storage.
export default async function DonatedPage({
  searchParams,
}: {
  searchParams: Promise<{ bin?: string }>;
}) {
  const { bin } = await searchParams;
  const initialBin =
    bin && /^[a-z0-9][a-z0-9-]{0,63}$/.test(bin.toLowerCase())
      ? bin.toLowerCase()
      : undefined;

  return (
    <>
      <PageHero
        eyebrow="Thank You"
        title="You gave. Let's get you your receipt."
        intro="Tell us what you donated and we'll email your in-kind receipt right away. It takes about twenty seconds."
      />
      <Section background="white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <GoodsDonationForm initialBin={initialBin} />
          </div>
        </div>
      </Section>
    </>
  );
}
