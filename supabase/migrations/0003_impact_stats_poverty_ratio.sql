-- Impact stats — express the child-poverty figure as a ratio (~1 in 9) instead
-- of an absolute count (~3,000), so the homepage count-up agrees with the
-- About page, which already states "about 1 in 9 local children lives in
-- poverty" (brief task 1).
--
-- ~1 in 9 ≈ an 11% child-poverty rate — the same U.S. Census SAIPE source as
-- the prior figure, expressed as a rate. Idempotent: upserts by `key`.
--
-- Run in the Supabase SQL editor for project onvrcwpiwqhxaavgbeud (or via a
-- connector with write access to that project).

insert into public.impact_stats
  (key, value, prefix, suffix, label, source, reporting_period, display_order, as_of)
values
  ('children_poverty', 1, '~', ' in 9',
   'local children live in poverty',
   'U.S. Census Bureau (SAIPE)', 'CY2023', 2, '2026-06-29')
on conflict (key) do update set
  value = excluded.value,
  prefix = excluded.prefix,
  suffix = excluded.suffix,
  label = excluded.label,
  source = excluded.source,
  reporting_period = excluded.reporting_period,
  display_order = excluded.display_order,
  as_of = excluded.as_of,
  updated_at = now();
