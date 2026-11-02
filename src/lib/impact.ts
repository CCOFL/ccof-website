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
  /**
   * Optional small italic line under the method note on /impact: a
   * restatement disclosure when a period's published figures were later
   * restated (founder ruling 2026-11-01). The original figures may appear
   * only inside this line.
   */
  restatementNote?: string;
  /**
   * Optional short stories behind the period's numbers, rendered as the
   * "Behind the numbers" list on /impact (founder brief 2026-11-02).
   * Generalized per the standing rulings: describe, never name a partner,
   * host, or person. Periods without stories render no block.
   */
  stories?: string[];
  /** Optional: only when a report is published publicly. */
  reportPdf?: string;
};

export const impactPeriods: ImpactPeriod[] = [
  {
    // Launch-to-date totals from the CCOF Public Facts Sheet, sections 7
    // and 12 (October close, approved by the founder 2026-11-01). Founder
    // ruling 2026-10-27 stands: this cumulative period leads the homepage
    // and /impact; the monthly periods below stay as the published records.
    // Items display as "900+", never an exact count (her rule). The
    // categories hold the monthly pounds breakdown (not rendered anywhere,
    // per the skip-the-breakdown call): they exist so the build-time sum
    // check guards the 787.9 headline.
    slug: "launch-to-2026-10",
    label: "Launch to date",
    periodText: "September 1 through October 31, 2026",
    heading: "Since our launch, by the numbers",
    intro:
      "Our community donation drive went into action in September. Every pound was weighed and recorded, and what came in started reaching children the same month.",
    tiles: [
      // Three equal tiles since the founder ruling of 2026-11-02 (addendum
      // 4): no partner-count tile or figure anywhere on the public site.
      // Captions unchanged; "caring for children" is the founder's wording
      // of 2026-10-27 (goods reach children through partners).
      { value: "787.9", unit: "pounds", caption: "weighed and recorded, September 1 through October 31, 2026" },
      { value: "900+", unit: "items", caption: "delivered to partner nonprofits caring for children, September 1 through October 31, 2026" },
      // Children tile added at the October close (facts sheet section 7).
      { value: "23", unit: "children", caption: "received individual packages" },
    ],
    categories: [
      { name: "September", quantity: "monthly total", pounds: 193.9 },
      { name: "October", quantity: "monthly total", pounds: 594.0 },
    ],
    totalPounds: 787.9,
    // Reused verbatim from the September period (founder-approved 2026-10-27:
    // numbers and labels only, no new prose).
    whereNext:
      "Goods are already reaching children and families. What remains is sorted for the next partner delivery and, once it opens in Martin County in 2027, The Collective Kids Closet, our nonprofit storefront program offering quality children's goods at affordable prices for all families throughout the community, with proceeds returning to the funding pool for those same 501(c)(3) partner organizations.",
    whyMatters:
      "A bag of outgrown clothes or a toy that is no longer played with can be exactly what another family needs this month. Reuse keeps goods out of the waste stream, and it keeps generosity close to home. This is a community supporting its own families.",
    // The founder's footnotes, verbatim (briefs of 2026-10-27 and 2026-11-01,
    // addendum 2). Renders in the small-type method-note slot on /impact,
    // under the homepage tiles, and on /30-days-of-giving. "CCOF's item rule"
    // is an explicit founder override of the no-bare-acronym rule, ruled
    // 2026-11-01 with the conflict flagged (addendum 2, item 4).
    methodNote:
      "Pounds are weighed community donations, not including individual donors or home pickups. Items include donated and purchased goods. Items counted per CCOF's item rule.",
  },
  {
    // October monthly record from the CCOF Public Facts Sheet, section 12
    // (October close, approved by the founder 2026-11-01). Tile copy and the
    // intro are the founder's exact wording (addendum 2 of 2026-11-01):
    // three tiles in the order pounds, items, children; partner counts
    // appear nowhere on the site (founder ruling 2026-11-02). whereNext and
    // whyMatters reuse the approved paragraphs verbatim.
    slug: "2026-10",
    label: "October 2026",
    periodText: "October 2026",
    heading: "October, by the numbers",
    intro:
      "Every pound was weighed and recorded, and much of it reached children within weeks.",
    tiles: [
      { value: "594.0", unit: "pounds", caption: "weighed and recorded, Month of October" },
      { value: "499", unit: "items", caption: "delivered to partner nonprofits, many packed in a duffel bag for one child, Month of October" },
      { value: "16", unit: "children", caption: "received individual packages, Month of October" },
    ],
    // Category detail lives in the downloadable report only (founder ruling
    // 2026-10-06); the single monthly-total row keeps the build-time sum
    // check guarding the 594.0 headline.
    categories: [
      { name: "October", quantity: "monthly total", pounds: 594.0 },
    ],
    totalPounds: 594.0,
    whereNext:
      "Goods are already reaching children and families. What remains is sorted for the next partner delivery and, once it opens in Martin County in 2027, The Collective Kids Closet, our nonprofit storefront program offering quality children's goods at affordable prices for all families throughout the community, with proceeds returning to the funding pool for those same 501(c)(3) partner organizations.",
    whyMatters:
      "A bag of outgrown clothes or a toy that is no longer played with can be exactly what another family needs this month. Reuse keeps goods out of the waste stream, and it keeps generosity close to home. This is a community supporting its own families.",
    methodNote:
      "Pounds are weighed community donations, not including individual donors or home pickups. Items include donated and purchased goods. Items counted per CCOF's item rule.",
    // "Behind the numbers" stories, verbatim from the founder brief of
    // 2026-11-02: generalized throughout (no partner, host, or person
    // names; no children's names or case details).
    stories: [
      "A welcome bag. A young child arrived at a youth shelter with very little in the bag that came with them. Within days, they had a welcome bag of their own.",
      "Seven bags in one morning. Seven children at a children's shelter each received a duffel bag packed to their sizes.",
      "Two families, four children. A partner that serves families asked on a Wednesday. By Friday, all four children had a bag packed in their own sizes.",
      "Warmth for teens. As the nights turned cool, teens at a youth shelter received hoodies, new pillows and warm socks.",
      "Room to play. Puzzles, card games and books went to a family shelter, because a shelter should still be a place where kids get to play.",
    ],
    // The October public report (founder brief 2026-11-02): the first
    // period published as a PDF; /impact swaps the request-by-email line
    // for a download link whenever reportPdf is set.
    reportPdf: "/reports/CCOF_Community_Impact_Report_2026-10.pdf",
  },
  {
    // September restated at the October close (founder ruling 2026-11-01,
    // team-review R1): calendar-month figures under the one counting rule,
    // mirroring the October block exactly (three tiles, same caption forms,
    // same footnote). The original bins-only first report (262.7 lbs / 433
    // items, September 1 to October 1) survives only in restatementNote
    // below. 470 items = 969 since launch minus 499 October (founder
    // figure; facts sheet row added at the close). Children: 7 = 23 since
    // launch minus 16 October.
    slug: "2026-09",
    label: "September 2026",
    periodText: "September 2026",
    heading: "September, by the numbers",
    intro:
      "Our first month. Every pound was weighed and recorded, and the first bags went to children within days.",
    tiles: [
      { value: "193.9", unit: "pounds", caption: "weighed and recorded, Month of September" },
      { value: "470", unit: "items", caption: "delivered to partner nonprofits, many packed in a duffel bag for one child, Month of September" },
      { value: "7", unit: "children", caption: "received individual packages, Month of September" },
    ],
    // Category detail lives in the downloadable report only (founder ruling
    // 2026-10-06); the single monthly-total row keeps the build-time sum
    // check guarding the 193.9 headline, which must tie to the launch
    // period's September row above (193.9 + 594.0 = 787.9).
    categories: [
      { name: "September", quantity: "monthly total", pounds: 193.9 },
    ],
    totalPounds: 193.9,
    // Closet sentence follows the program-architecture rules (future tense,
    // Martin County + 2027 attached, approved access phrasing, approved
    // proceeds sentence), flagged to the founder as a delta from her draft.
    whereNext:
      "Goods are already reaching children and families. What remains is sorted for the next partner delivery and, once it opens in Martin County in 2027, The Collective Kids Closet, our nonprofit storefront program offering quality children's goods at affordable prices for all families throughout the community, with proceeds returning to the funding pool for those same 501(c)(3) partner organizations.",
    whyMatters:
      "A bag of outgrown clothes or a toy that is no longer played with can be exactly what another family needs this month. Reuse keeps goods out of the waste stream, and it keeps generosity close to home. This is a community supporting its own families.",
    methodNote:
      "Pounds are weighed community donations, not including individual donors or home pickups. Items include donated and purchased goods. Items counted per CCOF's item rule.",
    // The founder's restatement disclosure, verbatim (ruling 2026-11-01).
    restatementNote:
      "Restated November 1, 2026 to calendar months and one counting rule. Our first report covered September 1 to October 1 and showed 262.7 lbs and 433 items.",
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
