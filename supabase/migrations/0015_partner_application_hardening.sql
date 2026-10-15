-- 0015: partner application hardening (2026-10-15 form brief).
-- Run ONCE in the Supabase SQL editor (Dashboard -> SQL -> New query)
-- for project ref: onvrcwpiwqhxaavgbeud. Safe to run twice: every column
-- uses IF NOT EXISTS and the constraint is drop-then-add.
--
-- This migration only ADDS nullable columns. It does not alter, drop, or
-- rewrite any existing column or row. The site degrades gracefully until it
-- runs (the insert retries without these columns and the notification email
-- always carries every field), so run order is flexible.
--
-- RLS is unchanged and needs no change: partner_applications already has
-- row level security enabled with anon INSERT-only (no select policy) and
-- a SELECT policy restricted to the signed-in admin email (migration 0007).
-- New columns are part of the same rows, so they inherit that protection.

alter table public.partner_applications
  -- How the applicant stands with Florida charitable registration:
  -- 'registered' (they gave a CH number) or 'exempt' (they claim an exemption).
  add column if not exists fdacs_status          text,
  -- Their stated basis for the exemption, free text (only when exempt).
  add column if not exists fdacs_exemption_basis text,
  -- Florida Sunbiz document number, optional (speeds up verification).
  add column if not exists sunbiz_doc            text,
  -- Organization street address (physical or registered).
  add column if not exists street_address        text,
  -- Address city.
  add column if not exists city                  text,
  -- Address state.
  add column if not exists state                 text,
  -- Address ZIP code.
  add column if not exists zip                   text,
  -- How children are identified and referred to them; agencies they work with.
  add column if not exists referral_sources      text,
  -- Checkbox: goods go to the children and families they serve,
  -- never sold, traded, or exchanged.
  add column if not exists goods_direct_ack      boolean,
  -- Checkbox: they will not share a child's name or identifying details;
  -- ages and sizes only.
  add column if not exists child_privacy_ack     boolean,
  -- Related-party answer: true means they reported a relationship or
  -- financial connection with a CCOF officer, director, or staff member.
  add column if not exists related_party         boolean,
  -- Their description of that relationship (only when related_party is true).
  add column if not exists related_party_detail  text,
  -- Shared link to their IRS determination letter.
  add column if not exists irs_letter_url        text,
  -- Typed signature: the authorized signer's full name.
  add column if not exists signer_name           text,
  -- Typed signature: the signer's title.
  add column if not exists signer_title          text,
  -- Typed signature: the date they signed.
  add column if not exists signer_date           date;

-- Guard the fdacs_status values without affecting legacy NULL rows.
alter table public.partner_applications
  drop constraint if exists partner_applications_fdacs_status_check;
alter table public.partner_applications
  add constraint partner_applications_fdacs_status_check
  check (fdacs_status is null or fdacs_status in ('registered', 'exempt'));

-- Rollback, if ever needed (NOTE: dropping a column deletes the values
-- stored in it; do not run casually):
--   alter table public.partner_applications
--     drop constraint if exists partner_applications_fdacs_status_check;
--   alter table public.partner_applications
--     drop column if exists fdacs_status,
--     drop column if exists fdacs_exemption_basis,
--     drop column if exists sunbiz_doc,
--     drop column if exists street_address,
--     drop column if exists city,
--     drop column if exists state,
--     drop column if exists zip,
--     drop column if exists referral_sources,
--     drop column if exists goods_direct_ack,
--     drop column if exists child_privacy_ack,
--     drop column if exists related_party,
--     drop column if exists related_party_detail,
--     drop column if exists irs_letter_url,
--     drop column if exists signer_name,
--     drop column if exists signer_title,
--     drop column if exists signer_date;
