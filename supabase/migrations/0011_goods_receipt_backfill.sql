-- The Children's Collective of Florida — goods receipt backfill (2026-08-25)
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Backs the /admin "Send receipt" button: during the pre-cutover interim,
-- Resend could deliver only to the account owner, so receipts to real donors
-- were declined and their rows carry receipt_sent_at = null. The button
-- rebuilds and sends the receipt (dated to the original donation date) and
-- records the send. That update needs an RLS policy: the table previously
-- allowed anon INSERT and admin SELECT only.

drop policy if exists "admin can update goods donations" on public.goods_donations;
create policy "admin can update goods donations"
  on public.goods_donations for update to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');
