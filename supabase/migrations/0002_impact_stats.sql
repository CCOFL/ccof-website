-- Impact statistics — the live "database" behind the homepage count-up stats.
-- Refreshed quarterly by the CCOF data-refresh agent (upsert by `key`).
-- Public READ only (published rows); writes happen via the connector/service role.

create table if not exists public.impact_stats (
  id               uuid primary key default gen_random_uuid(),
  key              text not null unique,   -- stable id, e.g. 'maltreatment_reports'
  value            numeric not null,
  prefix           text,
  suffix           text,
  label            text not null,
  source           text,                   -- e.g. 'Fostering Court Improvement'
  reporting_period text,                   -- e.g. 'FFY2022'
  display_order    int not null default 0,
  published        boolean not null default true,
  as_of            date,                   -- when last verified against the source
  updated_at       timestamptz not null default now()
);

alter table public.impact_stats enable row level security;

-- Anyone can read published rows (the website renders them); no public writes.
drop policy if exists "public can read published impact stats" on public.impact_stats;
create policy "public can read published impact stats"
  on public.impact_stats
  for select
  to anon, authenticated
  using (published = true);

-- Seed / refresh the four homepage figures (matches the verified Martin County
-- baselines in the ccof-data-refresh-martin skill). Idempotent: re-running this
-- (or the quarterly agent) upserts by key.
insert into public.impact_stats
  (key, value, prefix, suffix, label, source, reporting_period, display_order, as_of)
values
  ('maltreatment_reports', 1319, null, null,
   'child-maltreatment reports in Martin County last year',
   'Fostering Court Improvement / FL DCF', 'FFY2022', 1, '2026-06-04'),
  ('children_poverty', 3000, '~', null,
   'local children living in poverty',
   'U.S. Census Bureau (SAIPE)', 'CY2023', 2, '2026-06-04'),
  ('kinship_share', 6, null, ' in 10',
   'removed children placed with relatives — kinship caregivers, the least-funded in the system',
   'Federal AFCARS', 'FFY2022', 3, '2026-06-04'),
  ('foster_care_served', 115, null, null,
   'children served in foster care',
   'Fostering Court Improvement', 'FFY2022', 4, '2026-06-04')
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
