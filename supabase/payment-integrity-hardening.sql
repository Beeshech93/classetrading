-- Additional payment request integrity rules.
-- Run after schema.sql, admin-review.sql, and admin-profiles-policy.sql.

-- Students may submit only a proof path inside their own UUID folder.
-- Keep this as an INSERT policy so existing admin review policies are unchanged.
drop policy if exists "students create own payment requests" on public.payment_requests;
create policy "students create own payment requests"
on public.payment_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and amount_cents = 20000
  and currency = 'USD'
  and reviewed_by is null
  and reviewed_at is null
  and length(trim(payment_method)) between 1 and 80
  and (payment_reference is null or length(payment_reference) <= 200)
  and (
    proof_path is null
    or (
      length(proof_path) <= 500
      and (storage.foldername(proof_path))[1] = auth.uid()::text
    )
  )
);

-- Prevent anonymous users from invoking administrative review functions.
revoke all on function public.admin_approve_payment_request(uuid) from public;
revoke all on function public.admin_approve_payment_request(uuid) from anon;
revoke all on function public.admin_reject_payment_request(uuid,text) from public;
revoke all on function public.admin_reject_payment_request(uuid,text) from anon;
grant execute on function public.admin_approve_payment_request(uuid) to authenticated;
grant execute on function public.admin_reject_payment_request(uuid,text) to authenticated;
