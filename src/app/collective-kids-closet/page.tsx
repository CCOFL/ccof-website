import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { CollectMarquee } from "@/components/CollectMarquee";
import { EmailCapture } from "@/components/EmailCapture";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SustainabilityCallout } from "@/components/SustainabilityCallout";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collective Kids Closet",
  description: `${ORG.flagshipProgram} — an affordable community resale program for quality kids' goods, coming to ${ORG.flagshipCity} in ${ORG.flagshipLaunch}.`,
  alternates: { canonical: "/collective-kids-closet" },
};

export default function ClosetPage() {
  return (
    <>
      <PageHero
        eyebrow={`Coming to ${ORG.flagshipCity} · ${ORG.flagshipLaunch}`}
        title="Collective Kids Closet"
        intro="The flagship program of The Children's Collective of Florida — an affordable community resale program for quality kids' goods, open to all, with every purchase reinvested in local programs for children in care."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/donate" size="lg">
            Donate / Give Goods
          </LinkButton>
          <LinkButton href="#follow" variant="secondary" size="lg">
            Get launch updates
          </LinkButton>
        </div>
      </PageHero>

      <Section background="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="measure space-y-5 text-lg leading-relaxed text-ink/90">
            <p>
              Collective Kids Closet is where community generosity becomes
              everyday affordability. Families find quality strollers, cribs,
              clothing, books, and more, at prices that respect every budget.
            </p>
            <p>
              Nothing here is &ldquo;disposable surplus.&rdquo; Every item is
              inspected, cleaned, and chosen with care. Shopping the Closet
              isn&apos;t charity. It&apos;s a smart, dignified way to find
              quality clothes a growing kid is proud to wear, while funding
              programs that serve children in foster care, kinship homes, and
              crisis.
            </p>
          </div>
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-card">
              <Image
                src="/images/closet-goods.jpg"
                alt="Donated children's clothing, books, and toys sorted for the Collective Kids Closet"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section background="cream" className="overflow-hidden">
        <SectionHeading
          center
          eyebrow="What you'll find"
          title="Quality goods, ready for a second home"
        />
        <div className="mt-10">
          <CollectMarquee />
        </div>
        <SustainabilityCallout variant="shop" />
      </Section>

      <Section background="white" id="follow">
        <div className="rounded-3xl border border-line bg-cream p-8 sm:p-12">
          <SectionHeading
            eyebrow="Opening in Martin County"
            title="Be there on day one"
            intro={`We're coming to ${ORG.flagshipCity} in ${ORG.flagshipLaunch}. Leave your email and we'll tell you the moment the doors open.`}
          />
          <div className="mt-7">
            <EmailCapture />
          </div>
        </div>
      </Section>
    </>
  );
}
