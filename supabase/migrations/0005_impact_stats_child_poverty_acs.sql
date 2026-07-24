-- The Children's Collective of Florida — child-poverty stat standardization
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- 2026-07: CCOF standardized on the U.S. Census Bureau American Community
-- Survey (ACS) child-specific figure of ~17% of children under 18, expressed
-- as "nearly 1 in 6". This retires the older SAIPE-based "~1 in 9" figure.
-- The homepage stat tile renders from this table (site.ts IMPACT_STATS is
-- only the fallback), so the live row must be updated to match the code.
--
-- Note: the homepage caches stats for 24h (revalidate = 86400). Run this
-- BEFORE merging the matching site PR so the deploy rebuild reads the new
-- row; otherwise allow the cache to refresh or trigger a redeploy.

update public.impact_stats
set prefix = 'nearly ',
    suffix = ' in 6',
    label  = 'local children (under 18) live in poverty'
where suffix = ' in 9'
   or label like '%children live in poverty%';
