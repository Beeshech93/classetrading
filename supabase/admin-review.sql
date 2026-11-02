-- Admin authorization and manual payment review RPCs.
-- Run AFTER the initial schema.sql in Supabase SQL Editor.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

drop policy if exists "admins read all payment requests" on public.payment_requests;
create policy "admins read all payment requests" on public.payment_requests
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update payment requests" on public.payment_requests;
create policy "admins update payment requests" on public.payment_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read all memberships" on public.memberships;
create policy "admins read all memberships" on public.memberships
  for select to authenticated using (public.is_admin());

drop policy if exists "admins manage courses" on public.courses;
create policy "admins manage courses" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage lessons" on public.lessons;
create policy "admins manage lessons" on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage live classes" on public.live_classes;
create policy "admins manage live classes" on public.live_classes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.admin_approve_payment_request(p_payment_request_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.payment_requests%rowtype;
  v_membership_id uuid;
  v_start timestamptz := now();
begin
  if not public.is_admin() then
    raise exception 'Forbidden: administrator role required';
  end if;

  select * into v_request
  from public.payment_requests
  where id = p_payment_request_id
  for update;

  if not found then raise exception 'Payment request not found'; end if;
  if v_request.status <> 'pending' then raise exception 'Payment request is not pending'; end if;

  update public.payment_requests
  set status = 'approved', reviewed_by = auth.uid(), reviewed_at = v_start
  where id = p_payment_request_id;

  insert into public.memberships(user_id,payment_request_id,starts_at,ends_at,status)
  values(v_request.user_id,p_payment_request_id,v_start,v_start + interval '30 days','active')
  returning id into v_membership_id;

  return v_membership_id;
end;
$$;

create or replace function public.admin_reject_payment_request(p_payment_request_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  if not public.is_admin() then
    raise exception 'Forbidden: administrator role required';
  end if;

  select status into v_status
  from public.payment_requests
  where id = p_payment_request_id
  for update;

  if not found then raise exception 'Payment request not found'; end if;
  if v_status <> 'pending' then raise exception 'Payment request is not pending'; end if;

  update public.payment_requests
  set status = 'rejected',
      admin_note = left(coalesce(p_reason,''),1000),
      reviewed_by = auth.uid(),
      reviewed_at = now()
  where id = p_payment_request_id;
end;
$$;

revoke all on function public.admin_approve_payment_request(uuid) from public;
revoke all on function public.admin_reject_payment_request(uuid,text) from public;
grant execute on function public.admin_approve_payment_request(uuid) to authenticated;
grant execute on function public.admin_reject_payment_request(uuid,text) to authenticated;
