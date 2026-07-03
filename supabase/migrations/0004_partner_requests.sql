-- The Children's Collective of Florida — Partner Requests intake
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Direct-goods (in-kind) requests from vetted partner 501(c)(3)s. Same lockdown
-- as the other form tables: the public site key can INSERT but cannot read rows
-- back (no SELECT policy). View submissions in the Supabase Table editor.
--
-- Safe to run before the site ships the form: until this table exists, the
-- /api/partner-request route degrades gracefully (logs/notifies instead of
-- erroring), so no submissions are lost — but they aren't structured-stored
-- until you run this.

create table if not exists public.partner_requests (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  org_name       text not null,
  contact_name   text not null,
  email          text not null,
  phone          text,
  is_501c3       boolean not null default false,
  child_details  text,           -- child's age / sizes, free text
  goods_needed   text not null,  -- categories / items requested
  urgency        text not null default 'flexible',
  fulfillment_pref text,         -- partner-pickup | ccof-dropoff | either
  message        text,
  -- Phase 2 fulfillment trail (worked internally / in the CRM+POS system):
  -- requested → matched → fulfilled | partial | declined. Defaults so every
  -- row starts trackable even before the internal tooling exists.
  status         text not null default 'requested'
);

alter table public.partner_requests enable row level security;

-- Allow anonymous INSERTs from the website (publishable/anon key).
-- No SELECT policy is defined, so requests are NOT publicly readable.
drop policy if exists "anon can insert partner request" on public.partner_requests;
create policy "anon can insert partner request"
  on public.partner_requests
  for insert
  to anon, authenticated
  with check (true);
