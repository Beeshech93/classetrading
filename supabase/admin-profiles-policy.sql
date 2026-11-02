-- Allow administrator dashboard to read student display names and counts.
-- Requires supabase/admin-review.sql to have been executed first.
drop policy if exists "admins read all profiles" on public.profiles;
create policy "admins read all profiles" on public.profiles
  for select to authenticated using (public.is_admin());
