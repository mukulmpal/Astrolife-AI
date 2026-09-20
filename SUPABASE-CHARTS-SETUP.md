# Supabase setup for AstroLife — profiles and saved_charts

This document contains:
- SQL migration to create `profiles`, `saved_charts`, and (optional) `charts` tables + RLS policies (see SUPABASE-CHARTS-SETUP.sql)
- Client and server code snippets (signup/login, saving charts) compatible with this repo
- Production checklist and verification steps

---

## 1) Run the SQL migration

Open your Supabase project → SQL Editor → run `SUPABASE-CHARTS-SETUP.sql` (or paste its contents).

This creates:
- public.profiles (linked to auth.users)
- public.saved_charts (user-owned chart library)
- public.charts (legacy table, optional)

It also enables Row Level Security and creates safe policies so users can only access their own data.

---

## 2) Signup / Login (client) — Google-only flow

This product is intentionally set to Google-only auth. The signup and login screens redirect users to Supabase Google OAuth, then send them to `/onboarding` or the requested safe route after sign-in.

```tsx
// src/app/auth/google/route.ts
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'select_account',
    },
  },
});
```

Notes:
- Phone OTP is intentionally disabled in the client and product copy.
- After the user is authenticated, `supabase.auth.getUser()` returns their id for saves.

---

## 3) Save generated chart (recommended server route)

Use the API route pattern (like `src/app/api/charts/route.ts`) that the repo already contains. This ensures input validation, rate-limiting, and central control.

Client-side call (after generation):

```ts
// Example: call the API route to save a chart
await fetch('/api/charts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: chart.name,
    birth_date: chart.dob,
    birth_time: chart.tob,
    birth_place: chart.city,
    latitude: chart.lat,
    longitude: chart.lon,
    timezone: String(chart.tz ?? ''),
    chart_payload: chart,
  }),
});
```

Server-side (example in repo): `src/app/api/charts/route.ts` — this:
- checks the session with `supabase.auth.getUser()`
- returns 401 if not logged in
- validates payload size
- inserts into `saved_charts` with `user_id: user.id`

Direct client-side insert (alternative — less recommended):

```ts
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('Not authenticated');

await supabase.from('saved_charts').insert({
  user_id: user.id,
  chart_type: 'self',
  name: chart.name,
  birth_date: chart.dob,
  birth_time: chart.tob,
  birth_place: chart.city,
  latitude: chart.lat,
  longitude: chart.lon,
  timezone: String(chart.tz ?? ''),
  chart_payload: chart,
});
```

Use the server API route when you want to centralize validation, opt-in telemetry, and business logic (e.g., block free-tier saves).

---

## 4) Loading saved charts

Server route example (repo): `GET /api/charts` reads saved_charts where `user_id = auth.uid()` and returns the list.

Client usage (already present in `src/app/dashboard/kundli/page.tsx`): call the API to get saved charts and display them in the chart library.

---

## 5) Recommended Row Level Security policies (already in SQL file)

- profiles: only `auth.uid() = id` may access the row
- saved_charts: only `auth.uid() = user_id` may access rows
- charts (legacy): same as saved_charts

Test RLS via the Supabase SQL Editor by running queries as `anon` and verifying you get 401/empty responses, then test as a logged-in user.

---

## 6) Production checklist (run these before going live)

1. Database & RLS
   - [ ] Run `SUPABASE-CHARTS-SETUP.sql` in Supabase SQL Editor
   - [ ] Verify RLS policies are enabled and allow only user-owned reads/writes
   - [ ] Confirm indexes/triggers were created

2. Auth & keys
   - [ ] Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel (Production) environment variables
   - [ ] Do NOT store `.env.local` in git. Add it to .gitignore.
   - [ ] Rotate any keys that have been exposed or are in the working tree

3. App behavior
   - [ ] Google-only signup flow works in production (test with a real Google account)
   - [ ] After login, `supabase.auth.getUser()` returns a valid user id
   - [ ] Creating a chart and calling `POST /api/charts` succeeds and returns 201
   - [ ] Saved chart appears in the library (`GET /api/charts`)

4. Security & privacy
   - [ ] Limit public endpoints that accept PII (e.g., /api/charts/track). Require explicit consent before storing PII.
   - [ ] Add data retention policy & deletion flow for saved charts if required by privacy law
   - [ ] Ensure Supabase service role key is never exposed to client or committed

5. Hardening
   - [ ] Add rate-limits to heavy endpoints (already present in many routes)
   - [ ] Add server-side entitlement checks for premium features (use `profiles.subscription_tier` or your plan table)
   - [ ] Add CI checks for accidental secret commits (git-secrets / pre-commit hooks)

6. Monitoring & testing
   - [ ] Create smoke tests: signup -> generate chart -> save chart -> list charts
   - [ ] Add logs/alerting for API errors and suspicious volumes

---

## 7) Rollout notes and migration

- If you already have `charts` table and legacy data, the `saved_charts` table can be introduced and you can migrate rows later with an ETL script that preserves `user_id`.
- Make sure to test the API with a real authenticated session and verify payload sizes (chart_payload can be large; your API already uses `maxBytes` protection).

---

## 8) Troubleshooting

- "401 Unauthorized" when saving charts:
  - ensure client has valid session cookie; the SSR server client should use the cookies forwarded to the server (see src/lib/supabase/middleware.ts implementation)
- "RLS blocked" while testing in SQL Editor:
  - queries in the SQL Editor run as the project owner; test RLS by using Row Level Security simulator in Supabase or by making requests through the client with an authenticated session
- "Chart not visible in library": ensure `user_id` used when saving is the same as the logged-in user

---

If you want, I can:
- Apply the SQL migration into your Supabase project via the dashboard (requires your access)
- Open a PR that adds these files into your repo and links to the migration steps
- Add a small integration test script (node + supabase client) that runs the smoke test flow

Which of these follow-ups would you like me to do next?