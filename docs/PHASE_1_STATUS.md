# AstroLife Phase 1 Status

Status: In Progress
Started: 2026-05-05

## Goal

Move AstroLife from device-local testing state toward account-level SaaS persistence.

## Completed In First Slice

- Primary chart save now attempts Supabase `charts` persistence through `saveChartToAccount()`.
- Chart loading now checks the logged-in user's primary Supabase chart before falling back to local storage and profile birth data.
- Chart JSON loading now revives Dasha `Date` fields so dashboard and engine pages can safely call date methods after JSON round-trips.
- Onboarding and Kundli generation now save charts through the account persistence helper.
- AI monthly usage now attempts Supabase `usage_limits` persistence.
- Dashboard and chat usage counters now attempt account-level usage reads before falling back to local counters.
- Onboarding profile field now matches the schema blueprint: `onboarding_completed`.
- Kundli page now has a saved chart library panel.
- Saved chart list loads from Supabase `charts` when available.
- Users can switch the primary chart from the Kundli page.
- New Kundli generations create a new primary saved chart instead of only overwriting local storage.
- AI conversations now attempt Supabase persistence through `ai_conversations`.
- AI user/assistant messages now attempt Supabase persistence through `ai_messages`.
- Chat page now shows recent saved conversations and can reload a previous conversation when tables are available.
- Supabase setup checklist now exists in `docs/SUPABASE_SETUP.md`.
- Dashboard now checks whether key persistence tables are reachable and shows a setup warning when fallback mode is active.
- Chat API now performs server-side free usage checks before calling the AI provider.
- Chat API now increments `usage_limits` server-side when the table is available.
- Chat client avoids double-counting by using server usage metadata when present.
- Payment order creation now uses server-authenticated user identity instead of trusting client `userId`.
- Payment verification now validates Razorpay signature, order notes, amount, currency, and logged-in user before upgrading the profile.
- Payment verification now writes to `payments` and `subscriptions` when those tables are available.

## Fallback Behavior

If `charts` or `usage_limits` tables have not been applied in Supabase yet, the app continues using local fallback storage and logs a non-blocking warning. This keeps product testing open while the database is being prepared.

## Next Slice

- Apply and verify `supabase/schema.sql` in Supabase.
- Add conversation delete/rename controls.
- Move premium engine feature checks to server/API routes after billing enforcement is ready.
