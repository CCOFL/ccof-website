import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { ImpactPeriodTiles } from "@/components/ImpactPeriodTiles";
import { impactPeriods } from "@/lib/impact";
import { THIRTY_DAYS } from "@/lib/site";

export const metadata: Metadata = {
  title: "30 Days of Giving",
  description:
    "Host one small indoor bin for 30, 60, or 90 days and invite your own community to give quality kids' goods.",
  // Linked + unindexed (founder, 2026-10-27): reachable from the
  // /host-a-bin callout and the one-pager's QR; kept out of nav, the
  // sitemap, and search results.
  robots: { index: false, follow: true },
};

/**
 * The 30 Days of Giving campaign page. Content is the public-facing screen
 * of the host one-pager v14 (see THIRTY_DAYS in lib/site.ts for what was
 * kept, rephrased, and omitted, and why). The stats band derives from
 * impactPeriods' launch-to-date period, so this page, the homepage, /impact,
 * and the printed one-pager can never disagree on a number.
 */
export default function ThirtyDaysOfGivingPage() {
  const launch =
    impactPeriods.find((p) => p.slug === "launch-to-2026-10") ??
    impactPeriods[0];
  // The one-pager's four-stat band: the two monthly figures live in the
  // launch period's categories (they also feed the build-time sum check).
  const band = [
    {
      value: String(launch.categories[0].pounds),
      unit: "pounds",
      caption: `weighed, ${launch.categories[0].name}`,
    },
    {
      value: String(launch.categories[1].pounds),
      unit: "pounds",
      caption: `weighed, ${launch.categories[1].name}`,
    },
    {
      value: String(launch.totalPounds),
      unit: "pounds",
      caption: launch.tiles[0].caption,
    },
    launch.tiles[2],
  ];

  return (
    <>
      <PageHero
        eyebrow={THIRTY_DAYS.eyebrow}
        title={THIRTY_DAYS.title}
        intro={THIRTY_DAYS.intro}
      />

      <Section background="white">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={THIRTY_DAYS.eyebrow}
              title={THIRTY_DAYS.invitationHeading}
            />
            <p className="measure mt-6 text-base leading-relaxed text-body">
              {THIRTY_DAYS.invitation}
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-cream p-7 shadow-card sm:p-8">
            <h3 className="text-xl font-bold text-sage-600">
              {THIRTY_DAYS.involvesHeading}
            </h3>
            <ul className="mt-4 space-y-3">
              {THIRTY_DAYS.involves.map((item) => (
                <li
                  key={item.slice(0, 40)}
                  className="flex gap-3 text-sm leading-relaxed text-body"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-deep"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section background="cream">
        <SectionHeading
          eyebrow="By the numbers"
          title="Since our launch, by the numbers"
        />
        <div className="mt-10">
          <ImpactPeriodTiles tiles={band} cardBg="bg-white" />
        </div>
        <p className="measure mt-6 text-xs leading-relaxed text-muted">
          {launch.methodNote}
        </p>
      </Section>

      <Section background="white">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading center title={THIRTY_DAYS.ctaHeading} />
          <p className="measure mx-auto mt-4 text-base leading-relaxed text-body">
            {THIRTY_DAYS.ctaBody}
          </p>
          <div className="mt-7">
            <LinkButton href={THIRTY_DAYS.cta.href} size="lg">
              {THIRTY_DAYS.cta.label}
            </LinkButton>
          </div>
          <p className="measure mx-auto mt-10 border-t border-line pt-6 text-sm leading-relaxed text-muted">
            {THIRTY_DAYS.privacyLine}
          </p>
          <p className="measure mx-auto mt-3 text-sm leading-relaxed text-muted">
            {THIRTY_DAYS.acceptLine}
          </p>
        </div>
      </Section>
    </>
  );
}
