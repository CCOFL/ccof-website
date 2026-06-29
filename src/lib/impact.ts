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
