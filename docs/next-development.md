# Next development increment

## Implemented in this increment
- Student payment proof upload to the private `payment-proofs` Supabase Storage bucket.
- Admin payment queue creates short-lived signed URLs for proof review.
- Admin can create courses, add lessons, and publish/unpublish both.
- Admin can schedule Zoom classes, add meeting and recording links, and publish/unpublish sessions.
- Admin student roster shows the latest membership state.
- Admin dashboard links to course and Zoom management.

## SQL prerequisite
Run `supabase/storage.sql` after the existing schema and admin policy scripts.

## Current known limitations
- The language preference UI and complete Spanish/French translation catalog are not implemented yet.
- Course video URLs and Zoom recording URLs are currently external links. For paid content, prefer private storage or a provider that supports signed playback.
- No live Zoom API integration is configured. Administrators paste Zoom meeting links manually.
- The application still needs an actual build and end-to-end tests using the user's Supabase project.
