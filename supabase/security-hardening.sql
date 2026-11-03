-- ClasseTrading security hardening.
-- Run AFTER schema.sql, admin-review.sql and admin-profiles-policy.sql.
-- This removes the SECURITY DEFINER membership helper's arbitrary-user argument.
-- Students can now ask only whether THEIR authenticated account has access.

drop policy if exists "published courses visible" on public.courses;
drop policy if exists "published lessons visible to members" on public.lessons;
drop policy if exists "published live classes visible to members" on public.live_classes;

drop function if exists public.has_active_membership(uuid);

create or replace function public.has_active_membership()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = auth.uid()
      and m.status = 'active'
      and m.starts_at <= now()
      and m.ends_at > now()
  );
$$;

revoke all on function public.has_active_membership() from public;
revoke all on function public.has_active_membership() from anon;
grant execute on function public.has_active_membership() to authenticated;

-- is_admin() is intentionally callable only by signed-in users. It returns
-- only the role status of the current auth.uid(), never another user's role.
revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

create policy "published courses visible" on public.courses
  for select to authenticated
  using (is_published = true and public.has_active_membership());

create policy "published lessons visible to members" on public.lessons
  for select to authenticated
  using (
    is_published = true
    and public.has_active_membership()
    and exists (
      select 1 from public.courses c
      where c.id = lessons.course_id and c.is_published = true
    )
  );

create policy "published live classes visible to members" on public.live_classes
  for select to authenticated
  using (is_published = true and public.has_active_membership());

-- Explicitly keep payment-review RPCs unavailable to anonymous/public roles.
revoke all on function public.admin_approve_payment_request(uuid) from public;
revoke all on function public.admin_approve_payment_request(uuid) from anon;
revoke all on function public.admin_reject_payment_request(uuid,text) from public;
revoke all on function public.admin_reject_payment_request(uuid,text) from anon;
grant execute on function public.admin_approve_payment_request(uuid) to authenticated;
grant execute on function public.admin_reject_payment_request(uuid,text) to authenticated;
