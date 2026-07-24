-- The Children's Collective of Florida — admin portal read access
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query)
-- for project ref: onvrcwpiwqhxaavgbeud
--
-- Grants SELECT on the form tables to the signed-in ADMIN ONLY (matched by
-- auth email), so the /admin portal can list submissions. The public anon key
-- remains insert-only: anonymous visitors still cannot read anything back.
-- Even a stranger who somehow created an auth account would match none of
-- these policies (email check), and signups should also be disabled in
-- Dashboard → Authentication → Sign In / Up → Email → disable new sign ups.

create policy "admin can read contact submissions"
  on public.contact_submissions
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'stephanie@childrenscollectivefl.org');

create policy "admin can read launch signups"
  on public.launch_signups
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'stephanie@childrenscollectivefl.org');

create policy "admin can read partner requests"
  on public.partner_requests
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'stephanie@childrenscollectivefl.org');
