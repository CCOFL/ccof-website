-- The Children's Collective of Florida: donor designation on money gifts (2026-09-03)
-- Run ONCE in the Supabase SQL editor (Dashboard -> SQL -> New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- HOLD: run this only when the gift-designation PR is approved to ship
-- (Megan/CPA sign-off on restricted-fund treatment gates the ship).
--
-- 'partner_need' rows are DONOR-RESTRICTED funds: they must be spent on
-- partner-requested essentials and tracked as restricted in the books.
-- Existing rows (including Unal Eskiyapan's designated $495) default to
-- 'general'; correct any known designated gift by hand afterward:
--   update public.money_donations set designation = 'partner_need'
--   where receipt_number = 'CCOF-M-2026-00002';

alter table public.money_donations
  add column if not exists designation text not null default 'general'
  check (designation in ('general', 'partner_need'));
