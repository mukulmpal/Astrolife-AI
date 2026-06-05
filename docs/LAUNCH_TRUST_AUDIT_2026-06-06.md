# AstroLife Launch Trust Audit - 2026-06-06

This file is the release checklist for the current launch-hardening batch. It separates what is verified by code/build from what still needs real account testing.

## Current Verification

| Area | Status | Evidence |
| --- | --- | --- |
| Production build | Pass | `npm run build` completed successfully on Next.js 16.2.6 |
| Lint errors | Pass | `npm run lint` exits 0 |
| Lint warnings | Needs cleanup | 57 non-blocking warnings remain, mostly unused imports in engine pages |
| PDF failure isolation | Pass | `report-html-generator` wraps report sections with `safe(...)` so one failed page does not blank the full PDF |
| API payload validation | Partial pass | Major risk routes now use request size limits and validation helpers |
| API rate limiting | Partial pass | High-cost routes now call `checkRateLimit`; current implementation is in-memory and should move to durable Redis/Upstash before scale |
| History save bridge | Pass by code | `user_charts` legacy saves mirror into `charts`; legacy selections promote into current chart storage |
| Transit navigation cleanup | Pass by code | top-level Transit Ripple nav removed; legacy ripple routes redirect into Transits |
| Moon-first transit direction | Pass by code | Transits and PDF label Moon as primary with Lagna as cross-check |
| Elite PDF uniqueness | Pass by code | Elite includes Palmistry Fusion, Elite Intelligence Score, and Real Astrologer Review |
| Medical wording | Pass by code | Dashboard shows Health & Vitality and avoids medical diagnosis framing |
| Supabase migration ledger | Not clean | Linked project `nzenettizeocqzpziuuq` shows six local migrations not recorded remote plus one remote-only version `20260531113728`; a local placeholder now preserves that remote baseline |
| Live public smoke | Pass | `https://astrolife-ai.vercel.app` returns 200, `/api/health` returns `ok:true`, `/dashboard/transits` returns 200 |
| Live API validation smoke | Pass | Invalid `/api/generate-pdf` payload returns controlled 400 `Chart must be an object.` |
| Supabase push dry-run | Blocked | `supabase db push --dry-run` fails with `SUPABASE_DB_PASSWORD` / pooler auth failure; no production migration push was applied |
| Local dev smoke | Blocked | `next dev` could not bind `0.0.0.0:3000` inside sandbox; escalated retry was blocked by the system usage gate |
| Production deploy after audit | Blocked | Vercel deploy connector was blocked by the system usage gate; latest local audit/fix changes are not deployed by this turn |

## Plan And Report Tier Matrix

| Tier | Product promise | Current code access |
| --- | --- | --- |
| Free | Basic chart experience and light AI | `basic_kundli`, `ai_chat`, `yogas`; 5 AI questions/month; 1 saved chart |
| Premium | Full self-serve astrology intelligence | destiny, psychology, ashtakavarga, numerology, divisional, vastu, kundali milan, lalkitab, shadbala, reports, transit ripple, marriage timing, palmistry, transit purchase, astro sound; 5 saved/family charts |
| Elite | Human-reviewed and fused intelligence | everything in Premium plus unlimited saved/family charts, Elite PDF synthesis, Palmistry Fusion in main PDF, Real Astrologer Review page |

## PDF Tier Audit

| Report type | Included by code |
| --- | --- |
| Basic | Chart, star map, dashboard, yogas, nakshatra, closing, engine ledger |
| Premium / Full | Per-planet, per-house, yogas, doshas, shadbala, divisional, dasha, antardasha, life areas, psychology, numerology, lalkitab, remedies, destiny, transit radar, jaimini, vastu, sarvatobhadra, KP, transit ripple, special lagnas, marriage intelligence, relationship intelligence, astro sound, gemstone |
| Elite | Premium plus Elite Palmistry Fusion, Elite Intelligence Score, Real Astrologer Review |

## Real User-Flow Tests Still Required

These cannot be honestly marked complete without test credentials for each tier.

1. Free account: signup, onboarding chart, `/dashboard/history`, free engine access, premium lock state, basic PDF.
2. Premium account: payment/upgrade, premium engines, premium PDF, palmistry upload, transit ripple, marriage timing partner fusion.
3. Elite account: elite PDF with palmistry session attached, family charts, Real Astrologer Review page, full report download.
4. Production storage: save chart, reload browser, login again, confirm chart persists.
5. Payment safety: Razorpay order creation, payment verification, profile tier update, duplicate payment handling.

## Launch Risks To Close Before Paid Public Launch

1. Replace in-memory rate limiting with durable Redis/Upstash. In-memory limits reset per serverless instance.
2. Reconcile Supabase migration ledger in production. Some schema work was applied directly earlier, so the DB can be correct while migration history is not clean; Docker is also required for deeper `supabase db dump` schema inspection.
3. Remove lint warnings from unused imports and hook dependency warnings. Not a runtime blocker, but it weakens release hygiene.
4. Run mobile visual QA on dense pages: Kundli, Transits, Palmistry, Marriage Timing, Vastu, Numerology, AstroSound, Reports.
5. Confirm PostHog/Sentry-style production monitoring keys are set. Code has PostHog hooks and server monitoring, but deployment env must be verified.
6. Consolidate legacy chart tables once confidence is high: `user_charts` and `charts` are bridged, but still represent historical storage drift.
7. Deploy this launch-trust batch after the system usage gate allows Vercel actions again.

## Recommendation

Launch order should be:

1. Closed beta/demo with founder-controlled accounts.
2. Verify free/premium/elite gating and PDFs live.
3. Fix migration ledger and durable rate limiting.
4. Run mobile QA and sample report QA.
5. Then public paid launch.
