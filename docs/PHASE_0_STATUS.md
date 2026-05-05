# AstroLife Phase 0 Status

Status: Complete
Date: 2026-05-05

## Goal

Stabilize AstroLife as a modern Next.js SaaS foundation before deeper astrology engine migration, database persistence, AI memory, payments hardening, and production launch work.

## Completed

- Next.js 16 build baseline is stable with `next build --webpack`.
- `npm run lint` passes.
- `npm run build` passes.
- Central chart loader exists in `src/lib/user-chart.ts`.
- Onboarding and Kundli generation save the current chart locally for shared use.
- Dashboard, AI chat, and major engine pages now read the shared chart instead of fixed demo data.
- AI chat uses real chart context through `formatChartContext()`.
- Free AI usage tracking exists for testing with monthly local counters.
- Billing enforcement is environment driven through `NEXT_PUBLIC_BILLING_ENFORCED`.
- Premium soft-gates exist across the premium engine pages.
- Shared access source of truth exists in `src/lib/access.ts`.
- Supabase SaaS schema blueprint exists in `supabase/schema.sql`.

## Phase 0 Access Rules

- Free users keep access to basic Kundli, AI chat, and Yogas.
- Premium users unlock the advanced engines.
- Elite users are reserved for family charts, WhatsApp AI, deeper reports, and future high-touch features.
- While `NEXT_PUBLIC_BILLING_ENFORCED=false`, premium pages stay open with testing-mode messaging.
- When `NEXT_PUBLIC_BILLING_ENFORCED=true`, premium pages show locked previews for free users.

## Known Leftovers

These were audited but not deleted because they are untracked or may be user-generated:

- `-rf`
- `src/lib/supabase/Untitled`
- `src/lib/astro-engine/Untitled`
- `src/app/dashboard/shadbala/Untitled`

These should be reviewed with the owner before removal.

## Moved Into Phase 1

- Apply `supabase/schema.sql` in Supabase after final review.
- Replace local chart persistence with account-level `charts` table persistence. First code slice is now implemented with local fallback.
- Replace local AI usage tracking with `usage_limits`. First code slice is now implemented with local fallback.
- Store AI conversations and messages in Supabase.
- Add server-side enforcement to API routes once testing mode is no longer needed.
- Add production-safe admin or service-role flows for payment verification writes.

## Entry Criteria For Phase 1

- App builds and lints cleanly.
- Shared chart flow is working.
- Access rules are centralized.
- Schema blueprint exists.
- Known cleanup risks are documented.

Phase 1 can now focus on account-level persistence and real SaaS data flow.
