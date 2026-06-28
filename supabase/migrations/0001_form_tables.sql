-- The Children's Collective of Florida — form storage
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Creates two tables for site form data and locks them down with RLS so the
-- public site key can INSERT but cannot read submissions back. View rows in the
-- Supabase Table editor (or with the service role).

-- ---- Contact / volunteer / partner submissions ----
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  intent      text not null default 'general',
  message     text not null
);

-- ---- "Follow our launch" email signups ----
create table if not exists public.launch_signups (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique
);

-- Enable Row Level Security on both tables.
alter table public.contact_submissions enable row level security;
alter table public.launch_signups enable row level security;

-- Allow anonymous INSERTs from the website (publishable/anon key).
-- No SELECT policy is defined, so submissions are NOT publicly readable.
drop policy if exists "anon can insert contact" on public.contact_submissions;
create policy "anon can insert contact"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anon can insert signup" on public.launch_signups;
create policy "anon can insert signup"
  on public.launch_signups
  for insert
  to anon, authenticated
  with check (true);
