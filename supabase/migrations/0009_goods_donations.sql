-- The Children's Collective of Florida — goods donation intake + receipts (2026-08-19)
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Backs the /donated page: bin donors record what they gave, receive an
-- automatic in-kind receipt (NO dollar values, donor determines FMV), and
-- optionally join the email list. bin_slug ties each donation to a host site
-- for per-bin performance reporting.

-- ---------- Goods donations ----------
create table if not exists public.goods_donations (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  first_name        text not null,
  last_name         text,
  email             text not null,
  categories        text[] not null,        -- checkbox selections
  other_description text,
  quantity_band     text,                   -- few-items | one-bag | two-three-bags | more
  bin_slug          text,                   -- from ?bin=, null when unknown
  zip               text,
  email_opt_in      boolean not null default true,
  receipt_sent_at   timestamptz,            -- null until the receipt email succeeds
  receipt_number    text not null unique    -- CCOF-YYYY-NNNNN
);
alter table public.goods_donations enable row level security;
drop policy if exists "anon can insert goods donation" on public.goods_donations;
create policy "anon can insert goods donation"
  on public.goods_donations for insert to anon with check (true);
drop policy if exists "admin can read goods donations" on public.goods_donations;
create policy "admin can read goods donations"
  on public.goods_donations for select to authenticated
  using ((auth.jwt() ->> 'email') = 'haskins1207@gmail.com');

-- ---------- Sequential receipt numbers (CCOF-YYYY-NNNNN) ----------
-- Atomic per-year counter behind a SECURITY DEFINER function so the public
-- anon key can obtain the next number without any table access.
create table if not exists public.receipt_counters (
  year   int primary key,
  last_n int not null default 0
);
alter table public.receipt_counters enable row level security;
-- No policies: the table is reachable only through the function below.

create or replace function public.next_receipt_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  y int := extract(year from now())::int;
  n int;
begin
  insert into receipt_counters (year, last_n) values (y, 1)
  on conflict (year) do update set last_n = receipt_counters.last_n + 1
  returning last_n into n;
  return 'CCOF-' || y || '-' || lpad(n::text, 5, '0');
end;
$$;

revoke all on function public.next_receipt_number() from public;
grant execute on function public.next_receipt_number() to anon;
grant execute on function public.next_receipt_number() to authenticated;
