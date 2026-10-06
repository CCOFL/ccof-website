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

          <h3 className="mt-14 text-xl font-bold">
            What the community bins collected
          </h3>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full max-w-2xl border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Quantity
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Pounds
                  </th>
                </tr>
              </thead>
              <tbody>
                {period.categories.map((cat) => (
                  <tr key={cat.name} className="border-b border-line/60">
                    <th scope="row" className="py-2.5 pr-4 font-medium text-ink">
                      {cat.name}
                    </th>
                    <td className="py-2.5 pr-4 text-muted">{cat.quantity}</td>
                    <td className="py-2.5 text-right text-ink">
                      {cat.pounds.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={2} className="py-3 pr-4 font-bold">
                    Total
                  </th>
                  <td className="py-3 text-right font-bold">
                    {period.totalPounds.toFixed(1)} lbs
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="measure mt-4 text-xs leading-relaxed text-muted">
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
