-- Private storage for student payment proofs.
-- Run after schema.sql and admin-review.sql in the Supabase SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Students can upload only into their own UUID-prefixed folder.
drop policy if exists "students upload own payment proofs" on storage.objects;
create policy "students upload own payment proofs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Students may inspect only their own uploaded proofs.
drop policy if exists "students read own payment proofs" on storage.objects;
create policy "students read own payment proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Administrators may read proofs to review submitted payments and create
-- short-lived signed URLs. The public.is_admin() function is defined in
-- supabase/admin-review.sql.
drop policy if exists "admins read payment proofs" on storage.objects;
create policy "admins read payment proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_admin()
);

-- Submitted proof files are immutable. In particular, students cannot
-- delete a file after attaching it to a payment request. Failed submissions
-- can leave an orphaned upload; cleanup should be an administrator-only task.
drop policy if exists "students delete own payment proofs" on storage.objects;
drop policy if exists "students update own payment proofs" on storage.objects;
