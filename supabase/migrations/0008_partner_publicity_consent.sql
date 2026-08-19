-- The Children's Collective of Florida — partner publicity/media consent (2026-08-18)
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Adds recorded consent to partner_applications: whether CCOF may name the
-- partner publicly, whether their logo may be used, and who approves media.
-- Context: partners shelter abused/abandoned/neglected children; several are
-- legally or contractually barred from photos of children in care. See
-- CCOF_Partner_Publicity_Consent_Addendum_2026-08-18.md.
--
-- All columns NULLABLE so existing rows are unaffected; NULL renders as
-- "Not specified" in /admin (distinct from an explicit false/no).

alter table public.partner_applications
  add column if not exists publicity_preference text,        -- may_name | may_name_with_review | do_not_name
  add column if not exists logo_use_permitted   boolean,     -- null = unanswered (legacy rows)
  add column if not exists media_contact_name   text,
  add column if not exists media_contact_email  text;

-- Guard the allowed values without breaking legacy NULLs.
alter table public.partner_applications
  drop constraint if exists partner_applications_publicity_preference_check;
alter table public.partner_applications
  add constraint partner_applications_publicity_preference_check
  check (
    publicity_preference is null
    or publicity_preference in ('may_name', 'may_name_with_review', 'do_not_name')
  );

-- RLS policies are unchanged: anon INSERT policy already covers new columns;
-- the admin SELECT policy already grants row access.
