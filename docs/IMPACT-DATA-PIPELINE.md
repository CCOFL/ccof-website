# Impact-data pipeline

How the homepage impact statistics stay accurate and current.

## Overview

The four figures in the homepage "Why it matters" section are served from a
Supabase table (`impact_stats`) — not hardcoded — so they can be refreshed
without a code change. The site reads them at build/ISR time with a safe
fallback, and a quarterly check keeps the source figures current.

```
authoritative sources ──(quarterly check)──▶ Supabase: impact_stats ──(public read, ISR)──▶ website
```

## The table

`supabase/migrations/0002_impact_stats.sql` defines `public.impact_stats`:
keyed rows (`maltreatment_reports`, `children_poverty`, `kinship_share`,
`foster_care_served`) with `value`, `prefix`, `suffix`, `label`, `source`,
`reporting_period`, `display_order`, `published`, and `as_of`.

- **Row Level Security:** public **read** of `published = true` rows only; no public writes.
- **Idempotent:** the seed/refresh upserts by `key`, so re-running it updates in place.

## How the site reads it

- `src/lib/impact.ts` → `getImpactStats()` reads the published rows with the
  publishable (anon) key, **falling back to the hardcoded `IMPACT_STATS` in
  `src/lib/site.ts`** if Supabase is unset, empty, or erroring — so the site
  never breaks.
- The homepage is a server component with `export const revalidate = 86400`
  (daily ISR), so a change in the table appears on the site within a day with no
  rebuild. Editing the rows in the Supabase Table Editor is enough to update the
  live site.

## Quarterly refresh

The figures are verified against four authoritative sources (Florida's 19th
Judicial Circuit / Martin County) — see the `ccof-data-refresh-martin` skill:

1. **Fostering Court Improvement** — Martin County (foster-care population, removals) — https://fosteringcourtimprovement.org/fl/County/Martin/
2. **Florida Health CHARTS** — verified maltreatment by county (DCF / Florida Safe Families Network)
3. **Florida DCF Office of Child & Family Well-Being dashboard**
4. **Communities Connected for Kids (CCKids)** — annual report / circuit context

**Current baselines (FFY2022 / latest published; verified 2026-06-04):**
1,319 maltreatment reports · ~3,000 children in poverty · ~6 in 10 placed with
kinship caregivers · 115 children served in foster care. No newer reporting
period had been published as of the last check.

**Planned automation:** a quarterly cloud agent runs the data-refresh check and,
when a source publishes a newer reporting period, upserts the new figure into
`impact_stats` (by `key`) — so the number updates itself in Supabase and on the
site. This requires Supabase **write** access for the agent (Supabase connector
authorized for the CCOF project's org, or a service key). Until then, figures can
be updated by hand in the Supabase Table Editor.
