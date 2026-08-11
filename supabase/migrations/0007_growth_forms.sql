-- The Children's Collective of Florida — growth forms intake (2026-08-11)
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Four new intake tables behind the dedicated forms:
--   bin_host_requests     — /host-a-bin  (businesses/schools/congregations)
--   pickup_requests       — /pickup      (donor pickup scheduling; bin QR target)
--   volunteer_signups     — /volunteer   (interest capture, 18+)
--   partner_applications  — /partner-apply (formal 501(c)(3) partnership vetting)
--
-- Same lockdown as the existing form tables: the public anon key can INSERT
-- but never SELECT. The signed-in admin (email-matched) can read via /admin.
-- Safe to run before the site ships: routes degrade gracefully (log/notify)
-- until each table exists.

-- ---------- 1. Bin host requests ----------
create table if not exists public.bin_host_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  org_name        text not null,
  contact_name    text not null,
  email           text not null,
  phone           text,
  org_type        text not null default 'business',  -- business|school|congregation|other
  location        text not null,                     -- city or address
  indoor_ok       boolean not null default false,    -- indoor placement available
  foot_traffic    text,                              -- free text estimate
  timing          text,                              -- preferred start timing
  message         text,
  status          text not null default 'new'        -- new → contacted → scheduled → placed | declined
);
alter table public.bin_host_requests enable row level security;
drop policy if exists "anon can insert bin host request" on public.bin_host_requests;
create policy "anon can insert bin host request"
  on public.bin_host_requests for insert to anon with check (true);
drop policy if exists "admin can read bin host requests" on public.bin_host_requests;
create policy "admin can read bin host requests"
  on public.bin_host_requests for select to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');

-- ---------- 2. Pickup requests ----------
create table if not exists public.pickup_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  phone           text,
  pickup_area     text not null,          -- city/neighborhood or address
  items           text not null,          -- what they're donating
  volume          text,                   -- carload/a few bags/furniture-scale etc.
  windows         text,                   -- preferred day/time windows
  message         text,
  status          text not null default 'new'  -- new → contacted → scheduled → collected | declined
);
alter table public.pickup_requests enable row level security;
drop policy if exists "anon can insert pickup request" on public.pickup_requests;
create policy "anon can insert pickup request"
  on public.pickup_requests for insert to anon with check (true);
drop policy if exists "admin can read pickup requests" on public.pickup_requests;
create policy "admin can read pickup requests"
  on public.pickup_requests for select to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');

-- ---------- 3. Volunteer signups ----------
create table if not exists public.volunteer_signups (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  phone           text,
  interests       text not null,          -- comma-joined selections
  availability    text not null default 'either',  -- weekdays|weekends|either
  adult           boolean not null default false,  -- 18+ attestation
  message         text,
  status          text not null default 'new'      -- new → contacted → onboarded | inactive
);
alter table public.volunteer_signups enable row level security;
drop policy if exists "anon can insert volunteer signup" on public.volunteer_signups;
create policy "anon can insert volunteer signup"
  on public.volunteer_signups for insert to anon with check (true);
drop policy if exists "admin can read volunteer signups" on public.volunteer_signups;
create policy "admin can read volunteer signups"
  on public.volunteer_signups for select to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');

-- ---------- 4. Partner applications (formal 501(c)(3) vetting intake) ----------
create table if not exists public.partner_applications (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  org_legal_name  text not null,
  ein             text not null,           -- XX-XXXXXXX (public identifier, not sensitive)
  fdacs_reg       text,                    -- FL charitable reg #, if soliciting
  website         text,
  mission         text not null,           -- mission & population served
  counties        text not null,           -- counties served
  contact_name    text not null,
  contact_title   text not null,
  email           text not null,
  phone           text,
  is_501c3        boolean not null default false,  -- attestation
  needs           text not null,           -- how goods would be used / typical needs
  volume_estimate text,                    -- est. children/families per month
  vetting_ack     boolean not null default false,  -- "CCOF verifies each partner" acknowledgment
  message         text,
  status          text not null default 'received' -- received → vetting → approved | declined
);
alter table public.partner_applications enable row level security;
drop policy if exists "anon can insert partner application" on public.partner_applications;
create policy "anon can insert partner application"
  on public.partner_applications for insert to anon with check (true);
drop policy if exists "admin can read partner applications" on public.partner_applications;
create policy "admin can read partner applications"
  on public.partner_applications for select to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');
