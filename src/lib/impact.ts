import { getSupabase } from "./supabase";
import { IMPACT_STATS } from "./site";

export type ImpactStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

/**
 * Live impact figures from Supabase (table `impact_stats`, public read).
 * Falls back to the hardcoded IMPACT_STATS in site.ts whenever Supabase is not
 * configured, the table is empty, or the query fails — so the site always
 * renders, never breaks, and stays fast. Called from a server component with
 * ISR revalidation, so the data refreshes without a rebuild.
 */
export async function getImpactStats(): Promise<ImpactStat[]> {
  const supabase = getSupabase();
  if (!supabase) return IMPACT_STATS;
  try {
    const { data, error } = await supabase
      .from("impact_stats")
      .select("value, prefix, suffix, label, display_order")
      .eq("published", true)
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) return IMPACT_STATS;
    return data.map((d) => ({
      value: Number(d.value),
      prefix: d.prefix ?? undefined,
      suffix: d.suffix ?? undefined,
      label: d.label as string,
    }));
  } catch {
    return IMPACT_STATS;
  }
}

/* ------------------------------------------------------------------ */
/* Monthly community impact periods (founder-supplied figures).        */
/* ONE source of truth: the home "by the numbers" section and /impact  */
/* both render from this array. Monthly update = add a new period at   */
/* the TOP (newest first) + drop the PDF in public/reports/.           */
/* Every figure must trace to a weighed-pickup log or a signed partner */
/* transfer acknowledgment before it is added here (founder rule: no   */
/* unverifiable numbers on the site).                                  */
/* ------------------------------------------------------------------ */

export type ImpactTile = { value: string; unit: string; caption: string };
export type ImpactCategory = { name: string; quantity: string; pounds: number };
export type ImpactPeriod = {
  slug: string;
  label: string;
  periodText: string;
  /** Section heading, e.g. "September, by the numbers". */
  heading: string;
  /** One-paragraph intro under the heading (period-specific prose). */
  intro: string;
  tiles: ImpactTile[];
  categories: ImpactCategory[];
  totalPounds: number;
  /** "Where it goes next" paragraph (period-specific). */
  whereNext: string;
  /** "Why this matters" paragraph (period-specific). */
  whyMatters: string;
  methodNote: string;
  reportPdf: string;
};

export const impactPeriods: ImpactPeriod[] = [
  {
    slug: "2026-09",
    label: "September 2026",
    periodText: "September 1 to October 1, 2026",
    heading: "September, by the numbers",
    intro:
      "Our community donation drive went into action in September. Neighbors gave through the bins our local hosts placed, every pound was weighed and recorded, and what came in started reaching children the same month. Here is what that looked like.",
    tiles: [
      { value: "262.7", unit: "pounds", caption: "collected through community bin hosts, every pound weighed" },
      { value: "4", unit: "partner nonprofits", caption: "serving children in foster care, kinship care, or crisis, supplied directly" },
      { value: "433", unit: "items", caption: "contributed directly to partner nonprofits" },
    ],
    categories: [
      { name: "Clothing and shoes", quantity: "24 bags", pounds: 204.5 },
      { name: "Toys and games", quantity: "5 bags", pounds: 34.2 },
      { name: "Stuffed animals", quantity: "2 bags", pounds: 7.6 },
      { name: "Books", quantity: "1 bag", pounds: 7.3 },
      { name: "Baby gear", quantity: "1 item", pounds: 4.5 },
      { name: "School supplies", quantity: "1 bag", pounds: 2.8 },
      { name: "Hygiene products", quantity: "27 toothbrushes", pounds: 1.8 },
    ],
    totalPounds: 262.7,
    // Closet sentence follows the program-architecture rules (future tense,
    // Martin County + 2027 attached, approved access phrasing, approved
    // proceeds sentence), flagged to the founder as a delta from her draft.
    whereNext:
      "Goods are already reaching children and families. What remains is sorted for the next partner delivery and, once it opens in Martin County in 2027, The Collective Kids Closet, our nonprofit storefront program offering quality children's goods at affordable prices for all families throughout the community, with proceeds returning to the funding pool for those same 501(c)(3) partner organizations.",
    whyMatters:
      "A bag of outgrown clothes or a toy that is no longer played with can be exactly what another family needs this month. Reuse keeps goods out of the waste stream, and it keeps generosity close to home. This is a community supporting its own families.",
    methodNote:
      "Bin totals reflect weighed pickups from community bin hosts only. Items contributed to partners are counted by unit and include goods received from other sources, including new items provided by CCOF. Every delivery to a partner nonprofit is documented on a signed transfer acknowledgment.",
    reportPdf: "/reports/CCOF_Community_Impact_Report_2026-09.pdf",
  },
];

// Build-time integrity check: the category pounds must sum to totalPounds
// exactly (to one decimal). Pages import this module, so a mismatch fails
// `next build` before it can ship a wrong total.
for (const period of impactPeriods) {
  const sum =
    Math.round(period.categories.reduce((a, c) => a + c.pounds, 0) * 10) / 10;
  if (sum !== period.totalPounds) {
    throw new Error(
      `impactPeriods integrity: ${period.slug} categories sum to ${sum} lbs but totalPounds is ${period.totalPounds}`,
    );
  }
}
