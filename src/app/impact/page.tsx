import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { ImpactPeriodTiles } from "@/components/ImpactPeriodTiles";
import { impactPeriods } from "@/lib/impact";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "What our community's generosity collected and delivered for local children, by the numbers, every month.",
  alternates: { canonical: "/impact" },
};

/**
 * Monthly impact reports, rendered entirely from impactPeriods (newest
 * first). Adding a period to lib/impact.ts renders a new block here with no
 * code change. Standing rules: no partner or host names, no bin locations or
 * counts, figures only from the data file, "directly" attaches to the
 * partner organization.
 */
export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Our impact"
        title="Impact"
        intro="What our community's generosity collected and delivered for local children, by the numbers, every month."
      />

      {impactPeriods.map((period, i) => (
        <Section key={period.slug} background={i % 2 === 0 ? "white" : "cream"}>
          <SectionHeading
            eyebrow={period.label}
            title={period.heading}
            intro={period.intro}
          />
          <div className="mt-12">
            <ImpactPeriodTiles
              tiles={period.tiles}
              cardBg={i % 2 === 0 ? "bg-cream" : "bg-white"}
            />
          </div>

          {/* Category-level detail lives in the downloadable report only
              (founder ruling 2026-10-06: bag counts are warehouse data, not
              impact). The method note stays: it defines what the pound and
              item figures count. The categories stay in the data file so the
              build-time sum check keeps guarding the headline total. */}
          <p className="measure mt-6 text-xs leading-relaxed text-muted">
            {period.methodNote}
          </p>

          <h3 className="mt-12 text-xl font-bold">Where it goes next</h3>
          <p className="measure mt-3 text-base leading-relaxed text-body">
            {period.whereNext}
          </p>

          <h3 className="mt-10 text-xl font-bold">Why this matters</h3>
          <p className="measure mt-3 text-base leading-relaxed text-body">
            {period.whyMatters}
          </p>

          <p className="mt-10">
            <a
              href={period.reportPdf}
              className="inline-block rounded-full border border-sage bg-sage px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-sage-600"
            >
              Download the {period.label.split(" ")[0]} report (PDF)
            </a>
          </p>
        </Section>
      ))}
    </>
  );
}
