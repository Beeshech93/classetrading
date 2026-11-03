# ClasseTrading — launch checklist

## Supabase setup
Run the SQL files in this order:
1. `supabase/schema.sql`
2. `supabase/admin-review.sql`
3. `supabase/admin-profiles-policy.sql`
4. `supabase/security-hardening.sql`
5. `supabase/storage.sql`
6. `supabase/payment-integrity-hardening.sql`
7. `supabase/pocket-option-curriculum.sql` (opcional; revisar el material antes de publicarlo)

Then create the first account at `/register` and run `supabase/bootstrap-admin.sql` after replacing the placeholder email with the exact admin email.

The security-hardening migration replaces the membership helper that accepted an arbitrary user ID with a current-user-only check. Run it after the initial policies exist. If you already ran the older setup, this migration is still intended to be applied once.

## Local environment
Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not add the service-role key to browser code. The current MVP does not require it for ordinary student flows.

## Run
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Admin operations
- Create courses at `/admin/courses`.
- Add lessons to each course and publish course/lessons.
- Schedule Zoom sessions at `/admin/classes`; add a meeting URL and publish.
- Review student payment submissions at `/admin/payments`.
- Verify funds externally before clicking Approve. Approval starts exactly 30 days of access.

## Required production checks
- Configure Supabase Auth email templates and allowed redirect URLs.
- Configure Vercel environment variables.
- Test signup, login, logout, storage upload, signed proof links, admin authorization, and payment approval/rejection.
- Confirm all paid media is hosted privately or behind signed playback URLs. Do not paste public video URLs if content must remain exclusive.
- Set a clear payment destination and exact transfer instructions for the student.
- Add privacy policy, terms, risk disclosure, and customer support contact.
- Verify Zoom links are only visible to authenticated active members.
- Add rate limits, monitoring, backups, and a restore test.
- Test that expired memberships cannot read paid course content.
- Test that student accounts cannot assign themselves admin privileges.

The repository is an MVP codebase; a successful CI build is not a substitute for runtime/security testing against the real Supabase project.
