-- ClasseTrading initial schema
-- Run in Supabase SQL Editor. Admin-only mutations should use trusted server code
-- with the service-role key; never expose that key in the browser.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_cents integer not null default 20000 check (amount_cents = 20000),
  currency text not null default 'USD' check (currency = 'USD'),
  payment_method text not null,
  payment_reference text,
  proof_path text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_note text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  payment_request_id uuid not null unique references public.payment_requests(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'active' check (status in ('active','expired','revoked')),
  created_at timestamptz not null default now(),
  constraint membership_dates_valid check (ends_at > starts_at)
);

create index if not exists payment_requests_user_created_idx
  on public.payment_requests(user_id, created_at desc);
create index if not exists payment_requests_status_created_idx
  on public.payment_requests(status, created_at desc);
create index if not exists memberships_user_end_idx
  on public.memberships(user_id, ends_at desc);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_path text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  content text,
  attachment_path text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lessons_course_sort_idx on public.lessons(course_id, sort_order);

create table if not exists public.live_classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  meeting_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  recording_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.has_active_membership(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = p_user_id
      and m.status = 'active'
      and m.starts_at <= now()
      and m.ends_at > now()
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Prevent a user from changing their own role through profile updates.
create or replace function public.prevent_role_self_change()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and new.role is distinct from old.role then
    raise exception 'Profile role cannot be changed by the account owner';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute procedure public.prevent_role_self_change();

alter table public.profiles enable row level security;
alter table public.payment_requests enable row level security;
alter table public.memberships enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.live_classes enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "students read own payment requests" on public.payment_requests;
create policy "students read own payment requests" on public.payment_requests
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "students create own payment requests" on public.payment_requests;
create policy "students create own payment requests" on public.payment_requests
  for insert to authenticated with check (
    user_id = auth.uid()
    and status = 'pending'
    and amount_cents = 20000
    and currency = 'USD'
    and reviewed_by is null
    and reviewed_at is null
  );

drop policy if exists "students read own memberships" on public.memberships;
create policy "students read own memberships" on public.memberships
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "published courses visible" on public.courses;
create policy "published courses visible" on public.courses
  for select to authenticated using (is_published = true and public.has_active_membership());

drop policy if exists "published lessons visible to members" on public.lessons;
create policy "published lessons visible to members" on public.lessons
  for select to authenticated using (
    is_published = true
    and public.has_active_membership()
    and exists (
      select 1 from public.courses c
      where c.id = lessons.course_id and c.is_published = true
    )
  );

drop policy if exists "published live classes visible to members" on public.live_classes;
create policy "published live classes visible to members" on public.live_classes
  for select to authenticated using (is_published = true and public.has_active_membership());

-- No student UPDATE/DELETE policies are intentionally provided for payment requests
-- or memberships. Admin review and membership activation must be performed by a
-- trusted server route using the Supabase service-role key after authorization.
