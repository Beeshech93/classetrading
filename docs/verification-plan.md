# ClasseTrading — verification plan

Run these checks in a dedicated Supabase test project before enabling real payments.

## Authentication
- Register a new student and confirm the profile trigger creates a `student` profile.
- Sign in and sign out; verify a signed-out visitor cannot load dashboard, courses, or classes.
- Request a password reset, follow the email link, set a new password, and sign in with it.
- Confirm Supabase Auth Site URL and Redirect URLs include the production origin and `/reset-password`.

## Payment requests and proof storage
- Submit a request without a file and confirm it appears as pending (if proof is optional in the business process).
- Upload a JPEG, PNG, WebP, and PDF below 5 MB to `payment-proofs/{auth.uid()}/...`.
- Confirm files over 5 MB and unsupported MIME types are rejected by the UI and Storage.
- Attempt to upload into another user's UUID folder; it must be denied.
- Attempt to read another user's object; it must be denied.
- Attempt to delete or overwrite an uploaded proof as a student; it must be denied.
- Confirm an administrator can create a short-lived signed URL and inspect the proof.
- Confirm a student cannot set status to approved, change amount/currency, set reviewed fields, or submit another user's proof path.

## Administrator authorization and review
- Promote the first administrator only through the SQL bootstrap script in the Supabase SQL Editor.
- Confirm a normal student cannot access any `/admin` page or invoke review RPCs.
- Confirm an administrator can see all pending payment requests.
- Approve one pending request and verify exactly one membership is created with a 30-day period.
- Try to approve the same request again; the RPC must reject it without creating a second membership.
- Reject a pending request and verify the reason and review metadata are recorded.

## Membership and content access
- Confirm a pending or rejected payment grants no access to courses or Zoom details.
- Confirm a future membership does not grant early access.
- Confirm an active membership grants access only until `ends_at`.
- Confirm expired/revoked memberships cannot read course, lesson, or live-class rows through direct Supabase queries, not only through page redirects.
- Confirm a member cannot read unpublished courses or lessons.

## Release
- Verify the GitHub Actions runner starts and completes dependency installation, lint, and production build.
- Verify the Vercel preview deployment succeeds with the intended Supabase URL and anon key.
- Run the checks above against preview, using test accounts and non-production payment details.
- Add the operator's legal identity, support contact, privacy/terms review, and payment instructions before accepting payments.
- Do not merge this pull request until automated checks and the Supabase security checks pass.
