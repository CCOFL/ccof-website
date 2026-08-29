-- The Children's Collective of Florida: money donation records + receipts (2026-08-29)
-- Run ONCE in the Supabase SQL editor (Dashboard -> SQL -> New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Backs the Stripe webhook (card gifts recorded + branded receipt on payment)
-- and the /admin "Record an offline gift" form (cash/check gifts entered by
-- the admin). Receipt series CCOF-M-YYYY-NNNNN is deliberately separate from
-- the goods series: monetary receipts state the amount, goods receipts never
-- do, and the two must stay visually distinct.

-- ---------- Money donations ----------
create table if not exists public.money_donations (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  received_at           timestamptz not null default now(),  -- when the gift happened (backdatable for offline entry)
  donor_name            text,
  donor_email           text not null,
  amount_cents          integer not null check (amount_cents > 0),
  currency              text not null default 'usd',
  method                text not null default 'card'
                        check (method in ('card', 'cash', 'check', 'other')),
  frequency             text not null default 'one-time'
                        check (frequency in ('one-time', 'monthly')),
  stripe_session_id     text unique,                         -- null for offline gifts
  stripe_payment_intent text,
  stripe_invoice_id     text unique,                         -- recurring-cycle receipts
  receipt_number        text not null unique,                -- CCOF-M-YYYY-NNNNN
  receipt_sent_at       timestamptz                          -- null until the receipt email succeeds
);
alter table public.money_donations enable row level security;

drop policy if exists "anon can insert money donation" on public.money_donations;
create policy "anon can insert money donation"
  on public.money_donations for insert to anon with check (true);

drop policy if exists "admin can read money donations" on public.money_donations;
create policy "admin can read money donations"
  on public.money_donations for select to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');

-- Receipt backfill: the admin "Send receipt" button stamps receipt_sent_at
-- after a successful resend (mirrors migration 0011 for goods).
drop policy if exists "admin can update money donations" on public.money_donations;
create policy "admin can update money donations"
  on public.money_donations for update to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');

-- ---------- Sequential receipt numbers (CCOF-M-YYYY-NNNNN) ----------
-- Atomic per-year counter behind a SECURITY DEFINER function so the public
-- anon key can obtain the next number without any table access. Separate
-- counter from the goods series on purpose.
create table if not exists public.money_receipt_counters (
  year   int primary key,
  last_n int not null default 0
);
alter table public.money_receipt_counters enable row level security;
-- No policies: the table is reachable only through the function below.

create or replace function public.next_money_receipt_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  y int := extract(year from now())::int;
  n int;
begin
  insert into public.money_receipt_counters as c (year, last_n)
  values (y, 1)
  on conflict (year) do update set last_n = c.last_n + 1
  returning last_n into n;
  return 'CCOF-M-' || y || '-' || lpad(n::text, 5, '0');
end;
$$;

-- ---------- Webhook idempotency probe ----------
-- Stripe retries webhook deliveries; this lets the (insert-only) anon role
-- ask "was this payment already recorded?" before sending a receipt email,
-- without any read access to the rows themselves.
create or replace function public.money_donation_exists(
  p_session_id text,
  p_invoice_id text
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.money_donations
    where (p_session_id is not null and stripe_session_id = p_session_id)
       or (p_invoice_id is not null and stripe_invoice_id = p_invoice_id)
  );
$$;
