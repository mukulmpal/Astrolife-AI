# Handoff Report — Explorer Survey 2: Frontend UI & Route Survey

**Handoff Type:** Hard (Task complete)  
**Agent:** Explorer Survey 2 (Type: teamwork_preview_explorer)  
**Date:** 2026-09-24T05:12:00Z  
**Primary Deliverable:** `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_2/ui_mapping_report.md`

---

## 1. Observation

Direct code-level findings and tool observations across the AstroLife frontend codebase:

1. **Dashboard Route Scope:**
   - `find_by_name` across `src/app/dashboard/` located exactly **41 page.tsx route files** (including main dashboard, admin, ashtakavarga, astro-sound, chat, dasha, destiny, divisional, event-radar, family-synastry, gemstone, history, jaimini, kp, kundali-milan, kundli, lalkitab, marriage-timing, medical, numerology, palmistry [with subroutes], panchang, prashna, psychology, remedy, report, sarvatobhadra, saved-charts, shadbala, special-lagnas, transit-purchase, transit-ripple, transits, upgrade, vastu, yogas).
2. **KP Ruling Planets Omission:**
   - `src/lib/astro-engine/kp-ruling-planets.ts` contains `calculateRulingPlanetsSnapshot` and `calculateKPRulingPlanetsConfirmation`.
   - `grep_search` for `kp-ruling-planets` across `src/` yielded matches only in `src/lib/astro-engine/kp-production-contract.ts:36`, `src/lib/astro-engine/kp.ts:30`, `src/lib/astro-engine/kp-conflict-resolver.ts:31`, and unit test files.
   - Exact observation: **0 UI components or dashboard pages import or display KP Ruling Planets.**
3. **Double Boundary Presentation Bug on KP Page:**
   - In `src/app/dashboard/kp/page.tsx:417`: `<EvidenceDrawer viewModel={drawerViewModel} defaultLevel="casual" />`.
   - In `src/components/report/EvidenceDrawer.tsx:259`: `{showBoundaries && <BoundaryPresentation boundaries={viewModel.boundaries} />}`.
   - In `src/app/dashboard/kp/page.tsx:421-424`: `<BoundaryPresentation boundaries={buildBoundaryPresentation(sec)} />` is rendered immediately after `<EvidenceDrawer />`.
   - Exact observation: Boundary disclosures are rendered twice consecutively on `/dashboard/kp`.
4. **Shadbala Calculation Flaw:**
   - In `src/lib/astro-engine/shadbala.ts:95-98`:
     ```typescript
     export function calculateShadbala(
       planets: Record<string, PD>,
       birthHourLocal: number = 12
     ): ShadbalaResult
     ```
   - In `src/app/dashboard/shadbala/page.tsx:78`:
     ```typescript
     const result = calculateShadbala(chart.planets as never);
     ```
   - Exact observation: `birthHourLocal` is omitted by the caller, forcing the engine to fall back to `12` (noon) regardless of actual birth time, corrupting diurnal/nocturnal *Kala Bala* for all night births.
5. **Dasha Engine Evidence Disconnect:**
   - `src/lib/astro-engine/kp-dasha-evidence.ts` and `kp-dasha-activation.ts` define rich dasha activation nodes and evidence graphs.
   - In `src/app/dashboard/dasha/page.tsx:32-139`, the UI only renders linear progress bars (`ActiveCard`, `TimelineRow`, `AntarRow`).
   - Exact observation: Neither `kp-dasha-evidence` nor any graphical dasha activation trees are imported or visualized on `/dashboard/dasha`.
6. **AI Chat Context Starvation:**
   - In `src/app/dashboard/chat/page.tsx:379`:
     ```typescript
     chartContext: formatChartContext(chart),
     transitContext: transitContext,
     dailyFeedContext,
     languageMode,
     palmSessionId,
     ```
   - In `src/lib/user-chart.ts:595-612`, `formatChartContext(chart)` returns a single string of basic planet sign/house coordinates.
   - In `src/lib/ai-chat/astrolife-unified-context.ts:59`, `includeRawEngineContext` defaults to `false`.
   - Exact observation: The AI Chat endpoint `/api/chat` receives zero KP significator data, zero ruling planets, zero sub-lord logic, zero Shadbala ratings, and zero Ashtakavarga bindus.
7. **Duplicate `<MobileBottomNav />` Mounting:**
   - In `src/app/dashboard/layout.tsx:41`: `<MobileBottomNav />` is rendered globally.
   - Grep search revealed `<MobileBottomNav />` is re-rendered inside 11+ individual pages: `transit-purchase/page.tsx:91,364`, `report/page.tsx:232,246,530`, `numerology/page.tsx:695`, `sarvatobhadra/page.tsx:37,503`, `medical/page.tsx:28,311`, `prashna/page.tsx:374`, `transits/page.tsx:104,350`, `dasha/page.tsx:339`, `special-lagnas/page.tsx:47,117`, `panchang/page.tsx:453`, `event-radar/page.tsx:71,254`, `remedy/page.tsx:96,412`, `history/page.tsx:202`.
   - Exact observation: Two bottom navigation bars are simultaneously active in the mobile DOM.
8. **Double Redirect on Transit Ripple Route:**
   - `src/components/dashboard-sidebar.tsx:54` links to `/dashboard/transit-ripple`.
   - `src/app/dashboard/transit-ripple/page.tsx:4` redirects to `/dashboard/transits/ripple`.
   - `src/app/dashboard/transits/ripple/page.tsx:4` redirects to `/dashboard/transits`.
   - Exact observation: A user clicking the primary sidebar link experiences two consecutive client redirects.
9. **Missing Error Boundaries & Loading States:**
   - `find_by_name` for `error.tsx` found only **1 file**: `src/app/dashboard/gemstone/error.tsx`.
   - `find_by_name` for `loading.tsx` found **0 files**.
10. **State Fragmentation & Uncached Supabase Calls:**
    - `src/lib/user-chart.ts:614-709` exports `useUserChart()` containing internal `useState` and `useEffect` with calls to `supabase.auth.getUser()` and `supabase.from("charts")`.
    - Grep search shows `useUserChart()` is called across 30+ components and pages, with each instance initiating independent asynchronous network roundtrips.
11. **TypeScript Compile Errors:**
    - Running `npx tsc --noEmit` produced: `Found 518 errors in 117 files`, including 119 errors in `src/lib/report-html-generator.ts` and 13 errors in `src/lib/user-chart.ts`.

---

## 2. Logic Chain

1. **Premise:** High-fidelity computational engines in `src/lib/` require accurate data binding and complete visual presentation to deliver their intended value to users.
2. **Step 1 (Omissions):** Because `kp-ruling-planets.ts` is never imported in `src/app/dashboard/` (Observation 2), users navigating to the KP dashboard are deprived of the fundamental classical verification layer that the backend is fully capable of calculating.
3. **Step 2 (Calculation Invalidation):** Because `calculateShadbala` requires `birthHourLocal` to distinguish day from night strength and `src/app/dashboard/shadbala/page.tsx:78` omits it (Observation 4), the engine defaults to noon. Therefore, every nocturnal birth calculation in the UI is mathematically corrupted.
4. **Step 3 (Context Starvation):** Because `formatChartContext` produces only a 1-line string and `astrolife-unified-context.ts` defaults `includeRawEngineContext` to false (Observation 6), the AI model in `/api/chat` cannot inspect computed KP sub-lords or planetary balas. Consequently, user inquiries receive generic LLM text rather than evidence-grounded calculations.
5. **Step 4 (Rendering & DOM Inefficiencies):** Because `<MobileBottomNav />` is rendered both in `layout.tsx` and in 11 distinct route files (Observation 7), the browser builds redundant DOM trees and attaches duplicate touch handlers on mobile viewports.
6. **Step 5 (Resilience Deficit):** Because 40 of 41 dashboard routes lack `error.tsx` boundaries (Observation 9), any edge-case astronomical calculation error or undefined property will trigger an unhandled Next.js error boundary, crashing the entire dashboard session.
7. **Step 6 (State & Network Inefficiency):** Because `useUserChart` is a standalone hook without a shared React Context (Observation 10), every page transition re-triggers independent Supabase auth and chart queries, multiplying network latency and triggering layout shifts.

---

## 3. Caveats

- **Network Mode:** Investigation was conducted locally within the workspace repository. Live Supabase database tables could not be directly queried for production row counts, but client code, queries, and schema migration files were fully inspected.
- **Node Test Sandbox Permissions:** Direct execution of `npm run test` encountered `EPERM` sandbox restrictions when worker threads attempted to spawn without sandbox bypass. The underlying unit test files and benchmark reports were directly inspected via `view_file`.
- **Styling Variations:** Legacy pages use mixed styling conventions (some Tailwind v4 classes, some inline `<style>` JSX tags, some CSS files). Refactoring will require careful visual QA to avoid style regression.

---

## 4. Conclusion

AstroLife's backend computational architecture is robust, classical, and feature-rich. However, the frontend presentation layer requires immediate architectural remediation across three distinct horizons:

1. **P0 (Immediate Fixes):** Clean up duplicate bottom navs, fix the KP double boundary display, pass `birthHourLocal` into `calculateShadbala`, eliminate the double redirect chain on `/dashboard/transit-ripple`, add `error.tsx` and `loading.tsx` fallbacks, and resolve the 518 TypeScript compile errors.
2. **P1 (Core UI/UX Synchronization):** Unify state under a global `ChartProvider` / `useChartStore`, surface KP Ruling Planets, visualize KP Dasha Evidence trees, feed deep engine context to AI chat, consolidate the 3-table chart database schema, and implement a South Indian chart layout.
3. **P2 (Differentiators & Polish):** Offload astronomical calculations to Web Workers, expose interactive Life Chapters in the dashboard, provide user-selectable birth time confidence ratings with D60 boundary alerts, and eliminate embedded `<style>` tags.

Full detailed technical specifications, component inventory, and execution roadmaps are documented in `ui_mapping_report.md`.

---

## 5. Verification Method

To independently verify these findings, perform the following checks:

1. **Verify KP Ruling Planets Omission:**
   ```bash
   grep -rn "kp-ruling-planets" src/
   ```
   *Expected Result:* Zero matches under `src/app/` or `src/components/`.
2. **Verify Shadbala Noon Default Bug:**
   Inspect `src/app/dashboard/shadbala/page.tsx:78`:
   ```typescript
   const result = calculateShadbala(chart.planets as never);
   ```
   Compare with function signature in `src/lib/astro-engine/shadbala.ts:95-98`.
3. **Verify Duplicate MobileBottomNav Calls:**
   ```bash
   grep -rn "<MobileBottomNav" src/app/dashboard/
   ```
   *Expected Result:* 24 occurrences across `layout.tsx` and 11 distinct route files.
4. **Verify Double Redirect:**
   Inspect `src/app/dashboard/transit-ripple/page.tsx:4` (redirects to `/dashboard/transits/ripple`) and `src/app/dashboard/transits/ripple/page.tsx:4` (redirects to `/dashboard/transits`).
5. **Verify Error Boundary Absence:**
   ```bash
   find src/app/dashboard -name "error.tsx"
   ```
   *Expected Result:* Only `src/app/dashboard/gemstone/error.tsx`.
6. **Verify TypeScript Compile Errors:**
   ```bash
   npx tsc --noEmit
   ```
   *Expected Result:* Exits with code 2 and reports 518 errors across 117 files.
