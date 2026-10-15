-- 0015: partner application hardening (2026-10-15 form brief).
-- Run ONCE in the Supabase SQL editor (Dashboard -> SQL -> New query)
-- for project ref: onvrcwpiwqhxaavgbeud.
--
-- All columns NULLABLE so existing rows are unaffected. The site degrades
-- gracefully until this runs (the insert retries without these columns and
-- the notification email always carries every field), so run order is
-- flexible. RLS is unchanged: the anon INSERT policy covers new columns.

alter table public.partner_applications
  add column if not exists fdacs_status          text,     -- registered | exempt
  add column if not exists fdacs_exemption_basis text,
  add column if not exists sunbiz_doc            text,
  add column if not exists street_address        text,
  add column if not exists city                  text,
  add column if not exists state                 text,
  add column if not exists zip                   text,
  add column if not exists referral_sources      text,
  add column if not exists goods_direct_ack      boolean,
  add column if not exists child_privacy_ack     boolean,
  add column if not exists related_party         boolean,
  add column if not exists related_party_detail  text,
  add column if not exists irs_letter_url        text,
  add column if not exists signer_name           text,
  add column if not exists signer_title          text,
  add column if not exists signer_date           date;

alter table public.partner_applications
  drop constraint if exists partner_applications_fdacs_status_check;
alter table public.partner_applications
  add constraint partner_applications_fdacs_status_check
  check (fdacs_status is null or fdacs_status in ('registered', 'exempt'));
