-- 0014: request_type on bin_host_requests (2026-10-06).
-- 'bin' = standing bin host; 'drive' = one-time drive (e.g. Fill a Duffel).
-- The site degrades gracefully until this runs (inserts retry without the
-- column), so run order is flexible. Run in the Supabase SQL editor.
alter table public.bin_host_requests
  add column if not exists request_type text not null default 'bin'
  check (request_type in ('bin', 'drive'));
