# Next development increment

## Pocket Option classroom experience
- Student live-class page is positioned as practical Pocket Option training delivered through Zoom.
- Students are instructed to use their own Pocket Option accounts while following the instructor's screen share in Zoom.
- Upcoming sessions and available recordings are separated into distinct sections.
- Student-facing risk and account-security reminders are displayed.
- Admin class management now captures session objectives, Zoom meeting links, schedule, and optional replay URL with a clearer publishing workflow.
- Zoom links are validated to require HTTPS before saving.

## Existing product capabilities
- One-time USD 200 membership for 30 days, activated after manual payment approval.
- Supabase-backed student accounts, membership checks, payment requests, courses, lessons, and live classes.
- French/Spanish language selector currently applies to selected student-facing screens; class content and admin screens are still authored in French.
- Zoom meeting and replay links are manually entered by an administrator; no Zoom API integration is configured.

## Important boundaries
- Pocket Option is the platform used for practical demonstrations; students access it using their own accounts.
- Never collect student Pocket Option passwords or account credentials.
- Training is educational. Do not promise profits or present classroom examples as individualized financial advice.
- Trading and binary options can result in loss of capital. Students should understand platform, jurisdictional, and product risks before participating.
- The app still requires a real build and end-to-end tests against the user's Supabase project.
