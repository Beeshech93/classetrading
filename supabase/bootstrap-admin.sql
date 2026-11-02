-- One-time administrator setup.
-- 1) First register your own account through /register.
-- 2) In Supabase SQL Editor, replace the email below with your account email.
-- 3) Run this as project owner. Never expose service-role credentials.
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
);
-- Confirm exactly one row was updated:
select id, full_name, role from public.profiles
where role = 'admin';
