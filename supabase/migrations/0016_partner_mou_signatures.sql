-- 0016: partner MOU signatures (founder brief 2026-11-19).
-- Run ONCE in the Supabase SQL editor (Dashboard -> SQL -> New query)
-- for project ref: onvrcwpiwqhxaavgbeud. Safe to run twice.
--
-- Backs /partner-agreement/sign. The flow stays switched off
-- (PARTNER_MOU_LIVE = false) until attorney review and board adoption, so
-- this can run any time; until it does, the route degrades to the email
-- notification, which always carries every field.
--
-- Same lockdown as every form table: the public anon key can INSERT but
-- never SELECT; the signed-in admin (email-matched) can read. Export from
-- Table Editor -> partner_mou_signatures -> Export -> CSV.

create table if not exists public.partner_mou_signatures (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  -- Which text was signed, e.g. "DRAFT v1, November 19, 2026".
  mou_version        text not null,
  org_legal_name     text not null,
  ein                text not null,
  -- Typed electronic signature: the signer's full name and title.
  signer_name        text not null,
  signer_title       text not null,
  email              text not null,
  signed_date        date not null,
  -- MOU Section 8 choices. Each is an explicit yes (true) or no (false).
  recognize_name     boolean not null,
  recognize_logo     boolean not null,
  recognize_wording  boolean not null,
  website            text,
  -- The signer checked "typing my name is my electronic signature".
  signature_intent   boolean not null,
  -- new -> countersigned -> filed | declined (set by hand).
  status             text not null default 'new'
);
alter table public.partner_mou_signatures enable row level security;
drop policy if exists "anon can insert partner mou signature" on public.partner_mou_signatures;
create policy "anon can insert partner mou signature"
  on public.partner_mou_signatures for insert to anon with check (true);
drop policy if exists "admin can read partner mou signatures" on public.partner_mou_signatures;
create policy "admin can read partner mou signatures"
  on public.partner_mou_signatures for select to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');
