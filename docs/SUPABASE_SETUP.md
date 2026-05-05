# Supabase Setup

Use this checklist after Phase 1 code changes so account-level charts, AI usage, and chat history work for real users.

## 1. Apply Schema

1. Open the Supabase project used by `.env.local`.
2. Go to SQL Editor.
3. Open [schema.sql](/Users/mukulpal/Desktop/astrolife/web/supabase/schema.sql).
4. Run the full SQL file once.
5. If a policy already exists, Supabase may complain about duplicate policy names. In that case, keep the existing policy if it matches the same rule, or drop/recreate that policy manually.

## 2. Verify Tables

Confirm these tables exist in `public`:

- `profiles`
- `charts`
- `subscriptions`
- `payments`
- `usage_limits`
- `ai_conversations`
- `ai_messages`
- `ai_memory`
- `reports`

## 3. Verify RLS

Confirm RLS is enabled for all public AstroLife tables.

Expected user-owned behavior:

- A logged-in user can read/update only their own `profiles` row.
- A logged-in user can create/read/update/delete only their own `charts`.
- A logged-in user can read/update only their own `usage_limits`.
- A logged-in user can create/read/update/delete only their own `ai_conversations`.
- A logged-in user can create/read only their own `ai_messages`.

## 4. Smoke Test

1. Login to the app.
2. Complete onboarding.
3. Generate a Kundli from `/dashboard/kundli`.
4. Refresh the page and confirm the chart appears in Chart Library.
5. Open `/dashboard/chat`.
6. Send one AI message.
7. Refresh and confirm Recent Chats shows the conversation.
8. Open `/dashboard` and confirm no database setup warning appears.

## 5. Current Fallback Rules

Until the schema is applied, AstroLife keeps working in testing mode:

- Current chart falls back to `localStorage`.
- AI usage falls back to local monthly counters.
- Chat history does not persist across devices.
- Dashboard shows a database setup warning.

## 6. Launch Note

Before strict billing launch:

- Set `NEXT_PUBLIC_BILLING_ENFORCED=true`.
- Verify payment writes update `profiles.subscription_tier`.
- Add server-side access checks for premium APIs.
- Confirm free usage limits use `usage_limits`, not only local counters.
