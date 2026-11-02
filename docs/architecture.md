# ClasseTrading — architecture and MVP scope

## Product rules
- One product: 30-day membership for exactly USD 200.
- Payment is manual. A student submits payment method, transaction reference, and optional proof.
- A submission is pending and grants no access.
- An authorized administrator checks the funds outside the app, then approves or rejects the request.
- Approval creates a membership beginning at the approval timestamp and ending exactly 30 days later.
- No automatic billing, recurring charge, or auto-renewal.
- Renewal is a new payment request. Do not extend access until that new payment is approved.

## Roles
- Student: own profile, payment submissions, membership status, and course content only while membership is active.
- Admin: review payment submissions, manage courses/lessons/live sessions, and inspect student access. Admin authorization must be enforced on the server, not by hiding UI.

## Payment state machine
```
pending -> approved -> membership active -> expired
pending -> rejected
active -> revoked (admin action, if needed)
```
A payment request may be reviewed only once. Approval must be transactional/idempotent: create one membership per payment_request_id. Store timestamps in UTC (timestamptz); display in the student's local timezone.

## Main routes
- / — public landing page and membership offer
- /register, /login — authentication
- /dashboard — student overview
- /membership — status, payment instructions, and new payment request
- /courses, /courses/[slug] — protected course library
- /classes — protected live-class calendar and recordings
- /admin — administrator dashboard
- /admin/payments — payment queue and review
- /admin/courses — course and lesson management
- /admin/classes — live-class management

## Backend boundaries
- Browser: Supabase anon key only; rely on RLS for user-scoped reads and inserts.
- Server routes/actions: verify the Supabase session and check the user's admin role from the database before privileged operations.
- Service-role key: server-only environment variable; never sent to the client.
- File proofs: private Storage bucket. Generate short-lived signed URLs for admin review; validate file size/type and use opaque object paths.
- Course videos and attachments: private bucket or a video provider with signed playback. Do not expose permanent public URLs for paid lessons.

## Approval transaction
Implement approval as a database RPC or transaction:
1. Lock payment request row.
2. Verify status is pending.
3. Set status approved, reviewer, reviewed_at.
4. Insert membership with starts_at = approval time and ends_at = starts_at + interval '30 days'.
5. Enforce unique payment_request_id so retries cannot create duplicate memberships.
Reject action records reviewer, timestamp, and reason, without creating membership.

## Security and operational requirements
- RLS enabled on every user-facing table.
- Admin role cannot be self-assigned by a student.
- Server-side role check for every admin endpoint.
- Rate-limit auth and payment submission endpoints.
- Validate and sanitize all user inputs; never trust amount, currency, status, reviewer, or membership dates supplied by the browser.
- Audit log for admin approvals/rejections and course changes.
- Backups, error monitoring, and tested account recovery before launch.
- Educational content only: no guaranteed returns, and clear trading-risk disclosure.

## MVP acceptance tests
1. New student cannot see any paid course or lesson.
2. Student submission appears as pending and does not unlock content.
3. Student cannot approve, reject, or edit a payment request.
4. Non-admin cannot call admin review endpoints, even with a crafted request.
5. Admin approval creates exactly one 30-day membership.
6. Repeated approval request does not create a second membership.
7. Rejected payment creates no membership.
8. Access is denied at or after ends_at.
9. Expired member must submit a new payment; no automatic charge occurs.
10. Student A cannot read Student B's profile, payment, or membership records.
