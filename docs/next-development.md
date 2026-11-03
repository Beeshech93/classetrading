# Next development increment

## Implemented in this increment
- Student payment proof upload to the private `payment-proofs` Supabase Storage bucket.
- Admin payment queue creates short-lived signed URLs for proof review.
- Admin can create courses, add lessons, and publish/unpublish both.
- Admin can schedule Zoom classes, add meeting and recording links, and publish/unpublish sessions.
- Admin student roster shows the latest membership state.
- Added `supabase/security-hardening.sql`: membership RLS checks evaluate only the signed-in user's own membership; helper execution is restricted to authenticated users.
- Added a global French/Spanish language selector with browser persistence.
- Added a shared translation provider and translated the public landing page, login, registration, student dashboard, and membership/payment submission screens.
- Membership form now validates the proof file size (5 MB) and allowed MIME types before upload.

## SQL prerequisite
Run `supabase/security-hardening.sql` after `schema.sql`, `admin-review.sql`, and `admin-profiles-policy.sql`; run `storage.sql` after those migrations.

## Current known limitations
- French and Spanish translation is an incremental implementation: admin management screens, course/lesson content authored by admins, Zoom class content, and legal pages are not yet translated dynamically.
- The language selector is global and remembers the selection in the browser; language is not stored in the user's Supabase profile and therefore does not synchronize across devices.
- Course video URLs and Zoom recording URLs are currently external links. For paid content, prefer private storage or a provider that supports signed playback.
- No live Zoom API integration is configured. Administrators paste Zoom meeting links manually.
- The application still needs an actual build and end-to-end tests using the user's Supabase project.
