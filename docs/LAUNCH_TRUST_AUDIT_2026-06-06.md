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
| Production deploy | Pass | Commit `9b7fa94` deployed as `dpl_B4EQxqJWpiLUAnwE9uhnXjWXjodj` and aliased to `https://astrolife-ai.vercel.app` |
| Unauthenticated production gates | Pass | `/api/payment/create-order` returns 401 login required; `/api/charts/save` returns 401 unauthorized; invalid elite PDF payload returns controlled 400 |
| Real disposable account API test | Blocked | Service-role user creation reached production, but `profiles.onboarding_completed` is missing from production schema cache and local Supabase anon key returns `Invalid API key`; Vercel production env pull was rejected without explicit approval |
| Production Supabase anon key | Fixed | Production and local anon key had an extra leading `t`; corrected key now has `eyJ` prefix and latest production deploy is `dpl_4DgDCUumDFvhp4ouXSEfmA8PgNGE` |
| Real account chart save/list | Pass with legacy storage | Disposable free, premium, and elite users authenticated; `/api/charts/save` and `/api/charts/list` pass using `legacy_user_charts` fallback because production lacks `public.charts` |
| Payment order creation | Blocked | Razorpay direct credential test returns `401 Authentication failed`; `/api/payment/create-order` returns 500 until the Razorpay key/secret pair is corrected |
| Real UI route smoke | Pass | Production routes `/`, `/auth/signup`, `/onboarding`, `/dashboard`, `/dashboard/history`, `/dashboard/kundli`, `/dashboard/transits`, `/dashboard/report`, `/dashboard/upgrade`, `/dashboard/palmistry`, and `/dashboard/marriage-timing` all returned 200 with no app-error marker |
| Production PDF generation | Pass | Disposable authenticated users generated Basic, Premium, and Elite PDFs through `/api/generate-pdf`: Basic 1.20 MB / 10.0s, Premium 4.93 MB / 15.9s, Elite 5.04 MB / 21.1s |

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

## Real User-Flow Status

| Flow | Status | Evidence / gap |
| --- | --- | --- |
| Free account API flow | Pass | Disposable free user authenticated; chart save/list passes through legacy storage; Basic PDF returns `application/pdf` |
| Premium account API flow | Pass except payment | Disposable premium user authenticated; Premium PDF returns `application/pdf`; payment order creation blocked by Razorpay credentials |
| Elite account API flow | Pass except palm-session attachment | Disposable elite user authenticated; Elite PDF returns `application/pdf`; palmistry-session-attached Elite PDF still needs a saved real palm session test |
| Production storage | Partial pass | Save/list persists through `legacy_user_charts`; new `charts` table path still waits on production schema migration |
| Browser click-through | Still required | HTTP route smoke passed, but full visual/click testing on phone/desktop still needs browser/manual QA |
| Payment safety | Blocked | Razorpay direct credential test returns `401 Authentication failed`; cannot verify paid upgrade until credentials are corrected |

## Launch Risks To Close Before Paid Public Launch

1. Replace in-memory rate limiting with durable Redis/Upstash. In-memory limits reset per serverless instance.
2. Reconcile Supabase migration ledger in production. Some schema work was applied directly earlier, so the DB can be correct while migration history is not clean; Docker is also required for deeper `supabase db dump` schema inspection.
3. Apply or manually add the Phase 0 SaaS tables in production: `charts`, `payments`, `subscriptions`, `usage_limits`, `reports`, and related RLS policies.
4. Replace invalid Razorpay credentials with a valid key/secret pair, then rerun payment create-order and verify flow.
5. Remove lint warnings from unused imports and hook dependency warnings. Not a runtime blocker, but it weakens release hygiene.
6. Run mobile visual QA on dense pages: Kundli, Transits, Palmistry, Marriage Timing, Vastu, Numerology, AstroSound, Reports.
7. Confirm PostHog/Sentry-style production monitoring keys are set. Code has PostHog hooks and server monitoring, but deployment env must be verified.
8. Consolidate legacy chart tables once confidence is high: `user_charts` and `charts` are bridged, but still represent historical storage drift.

## Recommendation

Launch order should be:

1. Closed beta/demo with founder-controlled accounts.
2. Verify free/premium/elite gating and PDFs live.
3. Fix migration ledger and durable rate limiting.
4. Run mobile QA and sample report QA.
5. Then public paid launch.
