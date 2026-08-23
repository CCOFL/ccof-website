-- The Children's Collective of Florida — homepage impact stat label (2026-08-23)
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- The 1,319 child-maltreatment figure is a single-year count whose cited
-- source is NCANDS / FLHealthCHARTS FFY2022 (stated beneath the tiles and on
-- /sources). The tile label said "last year", which contradicted the year
-- printed directly under it. "In a single year" matches the About page and
-- the Sources page, is true, and makes no currency claim. A separate data
-- refresh (re-sourcing current figures from primary sources) is tracked in
-- Cowork; this migration only corrects the label.
--
-- The homepage reads this table at build time and caches for 24h
-- (revalidate = 86400). Run this BEFORE merging the matching site PR so the
-- deploy rebuild reads the new row; otherwise allow the cache to refresh.

update public.impact_stats
set label = 'child-maltreatment reports in Martin County in a single year'
where label like '%child-maltreatment reports%last year%';
