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
          {/* Restatement disclosure (founder ruling 2026-11-01): the one
              place a period's original, superseded figures may appear. */}
          {period.restatementNote && (
            <p className="measure mt-2 text-xs italic leading-relaxed text-muted">
              {period.restatementNote}
            </p>
          )}

          {/* Behind the numbers (founder brief 2026-11-02): short stories
              from the data file, generalized per the standing rulings.
              Periods without stories render no block. */}
          {period.stories && period.stories.length > 0 && (
            <>
              <h3 className="mt-12 text-xl font-bold">Behind the numbers</h3>
              <ul className="measure mt-4 space-y-3">
                {period.stories.map((story) => (
                  <li
                    key={story.slice(0, 40)}
                    className="flex gap-3 text-base leading-relaxed text-body"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-deep"
                    />
                    {story}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3 className="mt-12 text-xl font-bold">Where it goes next</h3>
          <p className="measure mt-3 text-base leading-relaxed text-body">
            {period.whereNext}
          </p>

          <h3 className="mt-10 text-xl font-bold">Why this matters</h3>
          <p className="measure mt-3 text-base leading-relaxed text-body">
            {period.whyMatters}
          </p>

          {/* Category detail and the full monthly report are provided on
              request, not published (founder ruling 2026-10-06), unless the
              period has a published public report (founder brief 2026-11-02):
              then reportPdf is set and the download link renders instead.
              The label derives from the period label ("October 2026" →
              "October"), so future months publish with no code change. */}
          {period.reportPdf ? (
            <p className="measure mt-10 text-base leading-relaxed text-body">
              <a
                href={period.reportPdf}
                target="_blank"
                rel="noopener"
                className="font-semibold text-sage-600 underline underline-offset-4"
              >
                Download the {period.label.replace(/ \d{4}$/, "")} report (PDF)
              </a>
            </p>
          ) : (
            <p className="measure mt-10 text-base leading-relaxed text-body">
              Contact{" "}
              <a
                href="mailto:info@ChildrensCollectiveFL.org"
                className="font-semibold text-sage-600 underline underline-offset-4"
              >
                info@ChildrensCollectiveFL.org
              </a>{" "}
              to request the full impact report or the details of what has been
              collected.
            </p>
          )}
          <p className="measure mt-4 text-base leading-relaxed text-body">
            The story behind these numbers lives in{" "}
            <a
              href="/newsletter"
              className="font-semibold text-sage-600 underline-offset-4 hover:underline"
            >
              our monthly letter →
            </a>
          </p>
        </Section>
      ))}
    </>
  );
}
