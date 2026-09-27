# AstroLife 360° Frontend UI Architecture & Component Mapping Audit

**Audit Date:** September 2026  
**Auditor:** Explorer Survey 2 (Frontend UI Routes & Component Mapping Specialist)  
**Scope:** Dashboard Routes (`src/app/dashboard/`), Astrological UI Components (`src/components/`), State Management & Hooks (`src/hooks/`, `src/lib/user-chart.ts`), API Endpoints (`src/app/api/`), and Engine-UI Synchronization.

---

## 1. Executive Summary

A comprehensive 360° technical audit was conducted on AstroLife's frontend architecture, dashboard routes, astrological visualization components, state propagation, and API contracts.

### Core Verdict
AstroLife possesses an exceptionally deep, mathematically sophisticated suite of backend computational engines (KP Placidus/Predictive/Ruling Planets, Vimshottari/Chara Dasha, Shodashavarga D1–D60, Shadbala 6-fold strength, Ashtakavarga, Sarvatobhadra, Cosmic Pulse, and classical explainability frameworks). However, **the frontend application suffers from deep architectural fragmentation, severe engine-UI disconnects, duplicate state reconciliation, and critical unhandled boundary states.**

### Key Findings Summary
1. **Route Inventory:** The dashboard comprises **41 distinct route surfaces** across `src/app/dashboard/`. While coverage of astrological domains is vast, navigation and presentation standards are inconsistent.
2. **Engine Disconnects:**
   - **KP Ruling Planets:** Tested and production-ready in `src/lib/astro-engine/kp-ruling-planets.ts`, but completely absent from the UI.
   - **KP Transit Confirmation & Precedence:** Coded in `kp-transit-confirmation.ts` and `kp-conflict-resolver.ts`, but hidden within an isolated static evidence JSON view on `/dashboard/kp`, never connected to interactive event cards.
   - **Dasha Evidence Graphs:** Rich dasha-activation and evidence algorithms in `src/lib/astro-engine/kp-dasha-evidence.ts` are completely disconnected from `/dashboard/dasha`, which only displays basic CSS progress bars.
   - **Shadbala Calculation Flaw:** `/dashboard/shadbala/page.tsx:78` calls `calculateShadbala(chart.planets as never)` without passing `birthHourLocal`, defaulting to 12:00 PM (noon) for all charts and systematically invalidating diurnal/nocturnal *Kala Bala* for night births.
   - **Shodashavarga Truncation:** `/dashboard/kundli` only renders D9 and discards D2–D60. Furthermore, multiple pages hardcode `birthTimeConfidence = 86` without user input, presenting highly volatile high-harmonic charts (e.g. D60, which shifts every 2 minutes) without time-sensitivity boundary warnings.
   - **AI Astrologer Blindness:** `/dashboard/chat` and `/api/chat` only feed the LLM a 1-line string from `formatChartContext(chart)` alongside basic transit text. The AI cannot inspect KP significators, ruling planets, sub-lords, Shadbala ratings, Ashtakavarga bindus, or Mangal Dosha calculations, causing generic textbook responses instead of evidence-backed chart provenance.
3. **Architectural & State Bottlenecks:**
   - **Zero Shared State Layer:** `useUserChart()` in `src/lib/user-chart.ts` is an isolated hook rather than a React Context or store. Every component or page calling it independently executes Supabase auth requests and database queries.
   - **Database Schema Triplication:** Charts are fragmented across three legacy and modern Supabase tables: `charts`, `saved_charts`, and `user_charts`, requiring awkward prefix hacks (`legacy:`, `saved:`) and recursive synchronization.
   - **Main Thread Hitching:** Heavy ephemeris and divisional computations (e.g., 16 divisional charts, 90-day Cosmic Radar horizons, Placidus cusps) execute synchronously inside React render cycles without Web Workers.
   - **Double-Mounting & Double-Redirect Bugs:**
     - Duplicate Navigation: `<MobileBottomNav />` is rendered globally in `src/app/dashboard/layout.tsx:41` AND re-rendered locally in 11+ dashboard pages.
     - Double Redirect: Sidebar link `/dashboard/transit-ripple` redirects to `/dashboard/transits/ripple`, which immediately redirects to `/dashboard/transits`.
     - Double Boundary Display: `/dashboard/kp/page.tsx:421` renders `<BoundaryPresentation />` directly below `<EvidenceDrawer />`, which already renders it internally on line 259.
   - **Error Boundaries & Loading Missing:** Out of 41 dashboard routes, only **1 route** (`/dashboard/gemstone/error.tsx`) has an error boundary. There are **zero `loading.tsx` files** across the entire application.
   - **TypeScript Degradation:** `tsc --noEmit` reveals **518 TypeScript errors across 117 files**, primarily in `report-html-generator.ts`, `user-chart.ts`, `kundli/page.tsx`, and `chat/page.tsx`.

---

## 2. Complete Dashboard Route Catalog (41 Routes)

| # | Route | File Path | Primary Purpose | Engines / APIs Invoked | State & Hook Dependencies | Access Tier |
|---|-------|-----------|-----------------|------------------------|---------------------------|-------------|
| 1 | `/dashboard` | `src/app/dashboard/page.tsx` | Main Command Center | `calculateChart`, `calculateDestiny`, `calculatePsychology`, `calculatePanchang`, `calculateEventRadarReport`, `calculateTransitReport`, `calculateDivisional`, `calculateCosmicPulse`, `buildRadarHorizons` | `useUserChart`, `useState(createClient)`, `checkSupabaseHealth`, `getAccountAiUsageStatus` | Free / All |
| 2 | `/dashboard/admin` | `src/app/dashboard/admin/page.tsx` | Admin Operations & User Metrics | `/api/admin/users`, `/api/admin/stats` | `createClient`, Supabase Auth | Admin only (`isAdminUser`) |
| 3 | `/dashboard/ashtakavarga` | `src/app/dashboard/ashtakavarga/page.tsx` | 8-Fold Planetary Delivery Strengths | `calculateAshtakavarga` | `useUserChart`, `useLanguage` | Premium (`PremiumFeature`) |
| 4 | `/dashboard/astro-sound` | `src/app/dashboard/astro-sound/page.tsx` | Vedic Raga & Sonic Frequency Therapy | `calculateAstroSound`, `astro-sound-chat-context` | `useUserChart`, `useLanguage` | Free / Premium |
| 5 | `/dashboard/chat` | `src/app/dashboard/chat/page.tsx` | Multi-Agent AI Astrologer | `/api/chat`, `calculateTransitReport`, `calculateEventRadarReport`, `calculatePanchang` | `useUserChart`, `ensureConversation`, `listConversations`, `getAccountAiUsageStatus` | Free (limited) / Elite (unlimited) |
| 6 | `/dashboard/dasha` | `src/app/dashboard/dasha/page.tsx` | Vimshottari Dasha Hierarchy | `buildDashaTreeFromChart`, `calculatePanchang`, `getNavtara`, `getAntardashas` | `useUserChart`, `useLanguage` | Free / All |
| 7 | `/dashboard/destiny` | `src/app/dashboard/destiny/page.tsx` | Lifetime Destiny Score & AD Flow | `calculateDestiny`, `calculateADDestiny` | `useUserChart`, `useLanguage` | Premium (`PremiumFeature`) |
| 8 | `/dashboard/divisional` | `src/app/dashboard/divisional/page.tsx` | Shodashavarga (D1–D60) System | `calculateDivisional`, `getChartAnalysis`, `getSpecialFindings`, `analyzeUniversalShodashaVarga` | `useUserChart`, `useLanguage` | Premium (`PremiumFeature`) |
| 9 | `/dashboard/event-radar` | `src/app/dashboard/event-radar/page.tsx` | 7-Day Planetary Timing Scanner | `calculateEventRadarReport`, `runKPEngine`, `calculateDivisional`, `buildMarriageEventRadar`, `buildMarriageKPIntelligence` | `useUserChart` | Free / All |
| 10 | `/dashboard/family-synastry` | `src/app/dashboard/family-synastry/page.tsx` | Multi-Generational Family Karma | `calculateFamilySynastry`, `calculateChart` | `useUserChart`, `listSavedCharts` | Premium (`PremiumFeature`) |
| 11 | `/dashboard/gemstone` | `src/app/dashboard/gemstone/page.tsx` | Prescription Gemstones & Cautions | `calculateGemstoneRecommendation` | `useUserChart`, `useLanguage` | Free / All (Has `error.tsx`) |
| 12 | `/dashboard/history` | `src/app/dashboard/history/page.tsx` | Consultation & Reading Log | Supabase reading logs | `useUserChart`, `createClient` | Free / All |
| 13 | `/dashboard/jaimini` | `src/app/dashboard/jaimini/page.tsx` | Jaimini Chara Dasha & Karakas | `buildJaiminiChart` | `useUserChart`, `useLanguage` | Free / All |
| 14 | `/dashboard/kp` | `src/app/dashboard/kp/page.tsx` | KP Placidus Timing & Evidence | `runKPEngine`, `buildEvidenceFirstReport`, `buildMarriageKPIntelligence`, `calculateDivisional`, `analyzeUniversalShodashaVarga`, `downloadReportAsPDF` | `useUserChart`, `useLanguage` | Free / All |
| 15 | `/dashboard/kundali-milan` | `src/app/dashboard/kundali-milan/page.tsx` | 36-Guna Ashta Koota Compatibility | `calculateMilan`, `calculateMangalDosha`, `calculateChart` | `useUserChart`, `listSavedCharts` | Free / All |
| 16 | `/dashboard/kundli` | `src/app/dashboard/kundli/page.tsx` | Natal Birth Chart & Planet Placements | `calculateChart`, `detectYogas`, `calculateYogaScore`, `calculateDivisional`, `/api/charts`, `/api/charts/track` | `useUserChart`, `listSavedCharts`, `saveChartToAccount`, `selectSavedChart` | Free / All |
| 17 | `/dashboard/lalkitab` | `src/app/dashboard/lalkitab/page.tsx` | Lal Kitab Karmic Debts & Remedies | `calculateLalKitabReport`, `analyzeLalKitabPlanets` | `useUserChart`, `useLanguage` | Free / All |
| 18 | `/dashboard/marriage-timing` | `src/app/dashboard/marriage-timing/page.tsx` | K.N. Rao 8-Factor Marriage Timing | `MarriageTimingAnalyzer`, `/api/astro/marriage-timing` | `useUserChart`, `listSavedCharts` | Premium (`PremiumFeature`) |
| 19 | `/dashboard/medical` | `src/app/dashboard/medical/page.tsx` | Vedic Medical & Vitality Anatomy | `calculateMedicalAstrology`, `calculateGemstoneMedicalMaster` | `useUserChart` | Free / All |
| 20 | `/dashboard/numerology` | `src/app/dashboard/numerology/page.tsx` | Cheiro & Pythagorean Numerology | `calculateNumerology` | `useUserChart` | Free / All |
| 21 | `/dashboard/palmistry` | `src/app/dashboard/palmistry/page.tsx` | AI Palm Scanner & Manual Workbench | `PalmistryAnalyzer`, `ManualPalmistryWorkbench`, `/api/palmistry/analyze` | MediaPipe Vision, Supabase Auth | Premium (`PremiumFeature`) |
| 22 | `/dashboard/palmistry/[sessionId]` | `src/app/dashboard/palmistry/[sessionId]/page.tsx` | Single Palm Scan Detail & Fusion | `PalmistrySessionDetail`, `/api/palmistry/session/[sessionId]` | Supabase Client | Premium |
| 23 | `/dashboard/palmistry/admin` | `src/app/dashboard/palmistry/admin/page.tsx` | Palmistry AI Model Health | `/api/palmistry/admin/tuning` | Admin check | Admin |
| 24 | `/dashboard/palmistry/admin/tuning` | `src/app/dashboard/palmistry/admin/tuning/page.tsx` | Computer Vision Confidence Tuning | `/api/palmistry/admin/tuning/status` | Admin check | Admin |
| 25 | `/dashboard/palmistry/history` | `src/app/dashboard/palmistry/history/page.tsx` | User Palm Scan Library | `/api/palmistry/history` | Supabase Auth | Free / Premium |
| 26 | `/dashboard/panchang` | `src/app/dashboard/panchang/page.tsx` | Daily Real-Time Vedic Almanac | `calculatePanchang`, `buildDashaTreeFromChart`, `getNavtara` | `useUserChart` | Free / All |
| 27 | `/dashboard/prashna` | `src/app/dashboard/prashna/page.tsx` | Horary Prashna Kundli (Time/Query) | `calculatePrashna`, `/api/locations/search` | Local form state | Free / All |
| 28 | `/dashboard/psychology` | `src/app/dashboard/psychology/page.tsx` | Cognitive & Emotional Archetypes | `calculatePsychology` | `useUserChart` | Free / All |
| 29 | `/dashboard/remedy` | `src/app/dashboard/remedy/page.tsx` | Unified Vedic & Lal Kitab Remedies | `complete-remedy-intelligence-engine`, `practical-remedy-narrative-engine` | `useUserChart` | Free / All |
| 30 | `/dashboard/report` | `src/app/dashboard/report/page.tsx` | Comprehensive PDF Report Generator | `downloadReportAsPDF` (basic, premium, elite, full, evidence-first) | `useUserChart`, `createClient`, `normalizeTier` | Free (Basic) / Paid Tiers |
| 31 | `/dashboard/sarvatobhadra` | `src/app/dashboard/sarvatobhadra/page.tsx` | 81-Square Nakshatra Vedha Grid | `calculateSarvatobhadra` | `useUserChart` | Free / All |
| 32 | `/dashboard/saved-charts` | `src/app/dashboard/saved-charts/page.tsx` | User Chart Library & Switcher | `listSavedCharts`, `selectSavedChart`, `saveChartToAccount` | Supabase Client | Free / All |
| 33 | `/dashboard/shadbala` | `src/app/dashboard/shadbala/page.tsx` | 6-Fold Planetary Strength Analysis | `calculateShadbala`, `getShadbalaRadar` | `useUserChart`, `useLanguage` | Premium (`PremiumFeature`) |
| 34 | `/dashboard/special-lagnas` | `src/app/dashboard/special-lagnas/page.tsx` | Arudha, Hora, Ghati, Sree Lagnas | `calculateSpecialLagnas` | `useUserChart` | Free / All |
| 35 | `/dashboard/transit-purchase` | `src/app/dashboard/transit-purchase/page.tsx` | Personalized Transit Guidance Add-on | `/api/transit/purchase-guidance`, `/api/payment/create-order` | `useUserChart` | Commercial Addon |
| 36 | `/dashboard/transit-ripple` | `src/app/dashboard/transit-ripple/page.tsx` | Legacy Transit Ripple Route | Redirects to `/dashboard/transits/ripple` | Next Navigation | Free / All |
| 37 | `/dashboard/transits` | `src/app/dashboard/transits/page.tsx` | Daily Gochar & Planetary Transits | `calculateTransitReport`, `normalizeChartForTransit`, `TransitRipplePanelV2` | `useUserChart`, `useLanguage` | Free / All |
| 38 | `/dashboard/transits/ripple` | `src/app/dashboard/transits/ripple/page.tsx` | Intermediate Transit Ripple Route | Redirects to `/dashboard/transits` | Next Navigation | Free / All |
| 39 | `/dashboard/upgrade` | `src/app/dashboard/upgrade/page.tsx` | Subscription Tiers & Checkout | `/api/payment/create-order`, `/api/payment/verify` | Supabase Auth, Razorpay SDK | Free / Commercial |
| 40 | `/dashboard/vastu` | `src/app/dashboard/vastu/page.tsx` | 16-Zone Astro-Vastu Diagnostic | `calculateVastuReport`, `/api/vastu/analyze` | `useUserChart` | Free / All |
| 41 | `/dashboard/yogas` | `src/app/dashboard/yogas/page.tsx` | 100+ Classical Yoga & Dosha Engine | `detectYogas`, `calculateYogaScore` | `useUserChart`, `createClient`, `normalizeTier` | Free / Premium / Elite |

---

## 3. Astrological UI Component Inventory

### 3.1 Chart Visualizers
1. **`NorthIndianChart` (`src/components/north-indian-chart.tsx`)**:
   - **Contract:** Accepts `lagnaNum: number`, `planets: Record<string, PlanetData>`, `size?: number`.
   - **Architecture:** Custom SVG rendering the classical North Indian diamond structure (House 1 top diamond, Houses 4, 7, 10 inner diamonds, Houses 2, 3, 5, 6, 8, 9, 11, 12 corner triangles).
   - **Strengths:** Lightweight, responsive slot positioning (`planetSlots` dynamically computes coordinates for 1–9 occupants per house), no external chart font dependencies.
   - **Flaws & Disconnects:**
     - Pure North Indian only. Completely lacks a **South Indian box chart** visualizer, alienating South Indian practitioners and users.
     - Does not support transit overlay (Gochar over Natal dual-ring visualizer).
     - Does not display degree text or nakshatra labels inside the cells.
2. **Embedded SVG Chart (`src/app/dashboard/page.tsx:201-262`)**:
   - Redundant inline duplication of `NorthIndianChart` logic inside `DashboardContent`, bypassing the reusable component.
3. **Mini Divisional Chart (`src/app/dashboard/divisional/page.tsx:93-140`)**:
   - Static 220px SVG renderer for divisional charts. Hardcodes house coordinates without dynamic occupant spacing.
4. **Antardasha Flow Canvas (`src/app/dashboard/destiny/page.tsx:29-100`)**:
   - Custom HTML5 `<canvas>` with raw 2D pixel calculations. Non-declarative, non-responsive to high-DPI retina displays, and unaligned with the rest of the application's SVG/CSS stack.

### 3.2 KP Components
1. **`EvidenceDrawer` (`src/components/report/EvidenceDrawer.tsx`)**:
   - **Contract:** Accepts `viewModel: EvidenceDrawerViewModel`, `defaultLevel?: "casual" | "curious" | "technical"`.
   - **Architecture:** 3-tier progressive disclosure drawer (Casual plain-English, Curious astrological mechanism, Technical audit trail with cryptographic SHA-256 hashes, REL-01–REL-10 rule citations, and precedence chains).
   - **Integration:** Only utilized on `/dashboard/kp/page.tsx`. Completely absent from `/dashboard/dasha`, `/dashboard/chat`, and `/dashboard/report`.
2. **`BoundaryPresentation` (`src/components/report/BoundaryPresentation.tsx`)**:
   - **Contract:** Accepts `boundaries: BoundaryPresentationModel`.
   - **Architecture:** Clear epistemic demarcations: "What the engine supports", "What remains uncertain", "What the engine does NOT claim".
   - **Bug:** Rendered twice on `/dashboard/kp` (internally within `EvidenceDrawer` line 259, and re-rendered explicitly on `kp/page.tsx:421`).
3. **`EvidenceChainNavigator` (`src/components/report/EvidenceChainNavigator.tsx`)**:
   - Interactive tree navigator through the astrological logic chain (Input -> Star Lord -> Sub Lord -> Cusp -> Dasha Activation -> Verdict).
4. **`KPTableRow` & `HouseLordGrid` (`src/app/dashboard/kp/page.tsx:39-91`)**:
   - Dense tabular representations of Placidus bhava shifts, star lords, sub-lords, and sub-sub lords. Lacks progressive disclosure on mobile screens.

### 3.3 Dasha Components
1. **`ActiveCard`, `TimelineRow`, `AntarRow` (`src/app/dashboard/dasha/page.tsx:32-139`)**:
   - Visualizes Mahadasha, Antardasha, and Pratyantardasha periods using color-coded progress bars and date intervals.
   - **Defect:** Purely linear date displays. Fails to visualize **Dasha Evidence Trees**, **KP Sub-Lord Dasha Triggers**, or **Life Domain Activation Scores**.

### 3.4 Transit & Timing Components
1. **`TransitRipplePanelV2` (`src/components/transit/TransitRipplePanelV2.tsx`)**:
   - 963 lines of complex interactive transit mapping across planetary timelines, peak windows, and house activation scores.
2. **`TransitRipplePanel` (`src/components/transit/TransitRipplePanel.tsx`)**:
   - **Dead Code:** 400-line legacy V1 component. Completely orphaned and unreferenced in production.
3. **`CosmicPulseCard` & `CosmicRadar` (`src/components/cosmic-pulse/`)**:
   - Rich predictive widgets for 7-day and 90-day transit horizons, Tara Bala, and Chandra Bala.
   - **Defect:** Rendered solely on the main dashboard (`/dashboard`), leaving the dedicated `/dashboard/event-radar` and `/dashboard/transits` routes disconnected from the Cosmic Pulse forecast engine.

### 3.5 Palmistry & Multimodal Fusion Components
1. **`PalmistryAnalyzer` & `ManualPalmistryWorkbench` (`src/components/palmistry/`)**:
   - Dual-mode palmistry diagnostic using MediaPipe vision landmarks or manual feature entry.
2. **`PalmistryFusionButton` & `PalmistryFusionReport` (`src/components/palmistry/fusion/`)**:
   - Fuses palmistry features with Kundli and Dasha patterns into unified confidence ratings (`AstroPalmFusionOutput`).

### 3.6 Shell & Layout Components
1. **`EngineShell`, `EngineHeader`, `EngineTrustPanel`, `EngineGuidanceGrid` (`src/components/engine/EngineShell.tsx`)**:
   - Standardized presentation wrappers establishing trust, data inputs, caveats, and plain-English usage instructions.
   - Used in `dasha`, `shadbala`, `ashtakavarga`, `yogas`.
   - **Inconsistency:** Not used in `kp`, `page.tsx`, `kundli`, `report`, `prashna`, creating visual and architectural disharmony.
2. **`DashboardSidebar` (`src/components/dashboard-sidebar.tsx`)**:
   - Sticky navigation sidebar organizing 27+ links into 6 logical categories: Core, Relationships, Prediction & Timing, Chart Intelligence, Wellness & Remedies, Personal Tools.
3. **`MobileBottomNav` (`src/components/mobile-bottom-nav.tsx`)**:
   - Fixed mobile navigation bar for viewport widths < 768px.

---

## 4. Deep Engine-UI Disconnect Analysis (Evidence-Backed)

### 4.1 KP Engine: Missing Ruling Planets & Duplicate Boundaries
- **Omission of Ruling Planets:**
  - `src/lib/astro-engine/kp-ruling-planets.ts` contains a fully tested, mathematically rigorous ruling planets confirmation system (`calculateRulingPlanetsSnapshot`, `calculateKPRulingPlanetsConfirmation`).
  - It resolves Ascendant Lord, Moon Sign Lord, Moon Star Lord, Day Lord, and Cusp Sub Lord.
  - **Evidence:** Grep search shows `kp-ruling-planets` is imported only in tests, `kp.ts`, and `kp-conflict-resolver.ts`. It is **completely omitted from `src/app/dashboard/kp/page.tsx` and all other UI components**. In classical KP astrology, Ruling Planets are the indispensable master key for real-time verification; omitting them from the UI severely weakens the application's clinical credibility.
- **Double Boundary Presentation Bug:**
  - `src/app/dashboard/kp/page.tsx:417` renders `<EvidenceDrawer viewModel={drawerViewModel} />`.
  - Inside `src/components/report/EvidenceDrawer.tsx:259`, `<BoundaryPresentation boundaries={viewModel.boundaries} />` is already rendered.
  - `src/app/dashboard/kp/page.tsx:421` then explicitly renders `<BoundaryPresentation boundaries={buildBoundaryPresentation(sec)} />` a second time directly underneath the drawer.
  - **Result:** Users see identical boundary disclosures duplicated back-to-back.

### 4.2 Dasha Engine: Missing Evidence Graph & Cross-System Synthesis
- **Zero Evidence Graph Visualization:**
  - `src/lib/astro-engine/kp-dasha-evidence.ts` and `src/lib/astro-engine/kp-dasha-activation.ts` define multi-tiered evidence graphs linking Mahadasha, Antardasha, and Pratyantardasha lords to house significations, sub-lord approvals, and obstruction houses.
  - `/dashboard/dasha/page.tsx` renders none of this data. It provides only rudimentary progress bars showing elapsed days.
- **Missing Chara & Yogini Dasha Integration:**
  - Jaimini Chara Dasha is isolated on `/dashboard/jaimini/page.tsx:66-100`.
  - Yogini Dasha is missing from the entire frontend.
  - There is no unified multi-dasha comparative timeline enabling users to cross-verify Vimshottari vs. Chara Dasha activation windows.

### 4.3 Shadbala Engine: Nocturnal Strength Calculation Bug & Kundli Disconnect
- **Systematic Kala Bala Invalidation:**
  - `src/lib/astro-engine/shadbala.ts:95-98` defines:
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
  - **Defect:** `birthHourLocal` is omitted, causing the engine to fall back to `12` (noon) for every single chart in the application. In Vedic astrology, diurnal planets (Sun, Jupiter, Venus) gain strength by day, while nocturnal planets (Moon, Mars, Saturn) gain strength by night. For a user born at 02:00 AM, the UI calculates daytime strength, completely invalidating their Kala Bala rankings.
- **Omission Across Primary Screens:**
  - Despite Shadbala being the foundational measure of a planet's actual capacity to deliver results (*Rupa* strength), `/dashboard/kundli` and `/dashboard` omit Shadbala entirely from their planetary tables.

### 4.4 Ashtakavarga Engine: Disconnected from Transit Gochar
- In classical Parashari astrology, transits (*Gochar*) must be filtered through Ashtakavarga *Bindus* (specifically the 8 Kakshyas per sign). A transit of Saturn or Jupiter through a house with < 25 bindus produces delays, while > 30 bindus produces breakthroughs.
- **Disconnect:** `/dashboard/transits/page.tsx` calculates transits purely based on house-from-Moon or house-from-Lagna. It does **not pass Ashtakavarga bindu weights** into the transit scoring algorithm.

### 4.5 Shodashavarga (Divisional Charts): Truncation & Arbitrary Confidence
- **Kundli Page Truncation:**
  - `src/app/dashboard/kundli/page.tsx:134` executes `calculateDivisional(data.planets as never, data.lagnaNum, data.lagnaLon)`, computing all 16 divisional charts (D1 through D60).
  - On line 532, it extracts `d9` and discards all other 15 divisional charts (D2 Hora, D3 Drekkana, D4 Chaturthamsha, D7 Saptamsha, D10 Dashamsha, D12 Dwadashamsha, D16, D20, D24, D27, D30, D40, D45, D60).
- **Hardcoded Confidence Factor:**
  - Multiple pages (`divisional/page.tsx:155`, `event-radar/page.tsx:51`, `kp/page.tsx:129`) pass a static, hardcoded parameter:
    ```typescript
    birthTimeConfidence: 86
    ```
  - There is zero UI affordance for the user to indicate whether their birth time is from a hospital certificate (confidence 95%+), an approximate memory (confidence 60%), or rectified.
- **Missing High-Harmonic Boundary Alerts:**
  - D60 (Shashtiamsha) shifts lagna every **2 minutes**. In `/dashboard/divisional/page.tsx`, D60 is displayed alongside D1 with identical visual weight and without a prominent boundary alert warning that an error of ±2 minutes completely inverts the chart.

### 4.6 AI Chat Engine: Severe Context Starvation
- **Underlying Engine Capability:**
  - `src/lib/ai-chat/astrolife-unified-context.ts` defines `buildUnifiedAstroLifeChatPrompt`, supporting structured contextual blocks for Kundli, Dasha, Transits, Numerology, and Palmistry.
- **Frontend Disconnect in `/dashboard/chat/page.tsx:379`:**
  - When submitting a prompt to `/api/chat`, the payload sent is:
    ```typescript
    chartContext: formatChartContext(chart),
    transitContext: transitContext,
    dailyFeedContext,
    languageMode,
    palmSessionId,
    ```
  - `formatChartContext(chart)` (`src/lib/user-chart.ts:595-612`) produces only a single plain-text string:
    `"Name: ..., DOB: ..., TOB: ..., City: ..., Ascendant: Virgo, Sun: Aries H8, ... Active Dasha: Moon Mahadasha"`
  - **Result:** The AI has **zero visibility** into:
    1. KP significators, house cusps, and sub-lords
    2. Ruling planets
    3. Shadbala numerical ratings
    4. Ashtakavarga bindu distribution
    5. Shodashavarga placements (D9/D10)
    6. Cosmic Pulse real-time flags
  - When a user asks: *"Why is my career delayed?"*, the AI cannot cite the 10th cusp sub-lord or Saturn's Cheshta Bala. It resorts to generic astrological generalities.

### 4.7 PDF Report vs. Interactive UI Disconnect
- Advanced synthesis modules developed in `src/lib/report/`:
  - `life-chapters-engine.ts`
  - `life-pattern-decoder.ts`
  - `pattern-fusion-engine.ts`
  - `ai-narrative-integration.ts`
- **Disconnect:** These engines are executed exclusively during server-side static PDF generation in `src/lib/report-html-generator.ts`. **Not a single interactive dashboard route exposes Life Chapters or Pattern Fusion.** A web user must purchase and download a 91-page PDF to access insights already computable in memory.

---

## 5. State Management & Architectural Bottlenecks

### 5.1 Duplicate State & Auth Execution (`useUserChart`)
- In `src/lib/user-chart.ts:614-709`, `useUserChart()` is implemented as a standalone React hook with internal `useState` and `useEffect`.
- **Architectural Violation:** It is **NOT** wrapped in a React Context or global store.
- **Impact:** Over **30 components and pages** invoke `useUserChart()`. Every time a user navigates between `/dashboard`, `/dashboard/kp`, and `/dashboard/dasha`, or when the sidebar renders alongside the page:
  1. `supabase.auth.getUser()` is fired repeatedly.
  2. Supabase `from("charts")` or `from("profiles")` queries are triggered redundantly.
  3. `calculateChart(PLACEHOLDER_BIRTH)` is executed on initial state setup before asynchronous user data settles.
  4. Redundant re-renders cascade through layout, sidebar, and page components.

### 5.2 Three-Way Database Schema Fragmentation
The codebase maintains historical backwards compatibility by simultaneously querying and synchronizing across three distinct Supabase tables:
1. `charts`: Modern table storing `chart_json` (JSONB) and `is_primary` (boolean).
2. `saved_charts`: Alternate table storing `chart_payload`, `birth_date`, `birth_time`, `birth_place`.
3. `user_charts`: Legacy table storing `chart_data`, `is_default`.

To reconcile these, `src/lib/user-chart.ts` and `src/app/api/charts/list/route.ts` execute multi-table joins, synthetic ID prefixing (`legacy:uuid`, `saved:uuid`), and complex fallback cascades. This generates unnecessary network roundtrips and synchronization bugs when saving or switching primary charts.

### 5.3 UI Thread Blocking & Calculation Latency
- Astrological coordinate transformations, Placidus iterative cusp approximations, and Shodashavarga harmonic division are CPU-intensive.
- In `src/app/dashboard/page.tsx:420-472` and `src/app/dashboard/kp/page.tsx:101-135`:
  - `calculateChart`, `calculateDestiny`, `calculatePsychology`, `calculateTransitReport`, `calculateEventRadarReport`, `calculatePanchang`, `calculateCosmicPulse`, `buildRadarHorizons`, and `calculateDivisional` are called synchronously inside `useMemo`.
  - While navigating to `/dashboard`, the main JavaScript thread locks up for ~300–600ms, causing dropped animation frames in Framer Motion transitions (`AnimatePresence` in `src/app/dashboard/layout.tsx:28`).
  - No Web Worker architecture exists to offload ephemeris math to background threads.

### 5.4 Redundant Mobile Bottom Navigation
- `src/app/dashboard/layout.tsx:41` renders `<MobileBottomNav />` globally for all dashboard routes.
- However, `<MobileBottomNav />` is explicitly re-imported and rendered inside **11 individual dashboard pages**:
  1. `transit-purchase/page.tsx:91, 364`
  2. `report/page.tsx:232, 246, 530`
  3. `numerology/page.tsx:695`
  4. `sarvatobhadra/page.tsx:37, 503`
  5. `medical/page.tsx:28, 311`
  6. `prashna/page.tsx:374`
  7. `transits/page.tsx:104, 350`
  8. `dasha/page.tsx:339`
  9. `special-lagnas/page.tsx:47, 117`
  10. `panchang/page.tsx:453`
  11. `event-radar/page.tsx:71, 254`
  12. `remedy/page.tsx:96, 412`
  13. `history/page.tsx:202`
- **Result:** Two identical `<nav className="mob-nav">` fixed bars are mounted simultaneously in the DOM, creating z-index conflicts, tap listener collisions, and layout displacement.

### 5.5 Broken Sidebar Navigation & Double Redirect
- In `src/components/dashboard-sidebar.tsx:54`:
  ```typescript
  { label: "Transit Ripple", href: "/dashboard/transit-ripple", Icon: Activity }
  ```
- In `src/app/dashboard/transit-ripple/page.tsx:4`:
  ```typescript
  export default function LegacyTransitRippleRedirect() {
    redirect("/dashboard/transits/ripple");
  }
  ```
- In `src/app/dashboard/transits/ripple/page.tsx:4`:
  ```typescript
  export default function TransitsRippleRedirectPage() {
    redirect("/dashboard/transits");
  }
  ```
- **Result:** Clicking "Transit Ripple" in the sidebar triggers **two consecutive HTTP 307 redirects** (`/dashboard/transit-ripple` -> `/dashboard/transits/ripple` -> `/dashboard/transits`), finally landing on the Transits page with the `overview` tab active rather than the `ripple` tab.

### 5.6 Unhandled Error & Boundary States
- **Total Error Boundaries:** Exactly **1** (`src/app/dashboard/gemstone/error.tsx`).
- **Missing Error Boundaries:** 40 routes lack an `error.tsx`. If an unexpected ephemeris exception occurs (e.g. extreme polar latitude or dates outside 1800–2100), the entire route crashes to Next.js's global unhandled error screen.
- **Missing Streaming Loading:** Exactly **0** `loading.tsx` files exist in `src/app/dashboard/`. Fast navigation transitions rely on manual component-level `if (loading)` conditions, causing layout shifts.

### 5.7 Embedded Inline Styles & CSS Contamination
- Instead of using Tailwind CSS v4 utility classes or CSS modules, major pages (`dashboard/page.tsx:476`, `kp/page.tsx:26`, `shadbala/page.tsx:82`, `event-radar/page.tsx:93`, `sarvatobhadra/page.tsx:47`) inject massive raw CSS strings via `<style>{`...`}</style>` tags directly inside React JSX.
- `dashboard/page.tsx` includes global resets (`*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}`) and external `@import url('https://fonts.googleapis.com/...')` inside the component body, violating Next.js font optimization guidelines and triggering render-blocking stylesheet downloads.

---

## 6. Target UI/UX Architecture & Modern Design Patterns

### 6.1 Three-Tier Progressive Disclosure Model

Astrological data ranges from intuitive life guidance to dense mathematical matrices. To prevent cognitive fatigue while preserving scientific rigor, every dashboard page must adopt the 3-tier progressive disclosure model pioneered in `src/components/report/EvidenceDrawer.tsx`:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1: CASUAL SEEKER                                                 │
│ • Intuitive headline & high-level energy status (e.g. "Career Surge")  │
│ • Clear color-coded impact badge (Gold = Peak, Green = Growth, Red)    │
│ • 2-sentence actionable guidance in plain English / Hinglish           │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                           [ "How It Works" ]
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 2: CURIOUS PRACTITIONER                                          │
│ • Planetary actors involved (e.g. Sun MD, Jupiter transit to 10th)     │
│ • Classical strength metrics (Shadbala Rupa, Ashtakavarga Bindus)      │
│ • Active house activation breakdown & timing window timeline           │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                      [ "Inspect Evidence & Rules" ]
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 3: ASTROLOGICAL AUDITOR                                          │
│ • Full KP Placidus Star Lord, Sub Lord & Cusp Promise matrix           │
│ • Classical rule precedence hierarchy (REL-01 through REL-10)          │
│ • SHA-256 audit hash & provenance citation (KP Reader Vol I-VI)        │
│ • Explicit Epistemic Boundary presentation (Supports / Uncertain)      │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Dual-Chart Visualizer (North & South Indian Layouts)
AstroLife must introduce a global chart presentation preference (`north_indian` vs. `south_indian` vs. `western_wheel`) saved in user preferences:
- **North Indian (Diamond / Bhava-oriented):** Houses are fixed; signs rotate based on Lagna.
- **South Indian (Box / Rashi-oriented):** Signs are permanently fixed (Aries top-second-left clockwise to Pisces); Lagna and houses rotate.
- Add an interactive toggle component `<ChartStyleToggle />` to `NorthIndianChart` and expose it across Kundli, Transits, Prashna, and Divisional pages.

### 6.3 Standardized Global State Store (`ChartContext` / `useChartStore`)
Replace the fragmented `useUserChart()` hook with a centralized React Context or lightweight Zustand store initialized at `src/app/dashboard/layout.tsx`:
- **Single Source of Truth:** `ChartProvider` mounts once in the layout.
- **In-Memory Cache:** Avoids repeated Supabase queries across route transitions.
- **Reactive Mutations:** Switching a chart in `/dashboard/saved-charts` instantly updates the chart in memory across all active tabs without page refreshes.

### 6.4 Web Worker Computation Architecture
Offload heavy astrological calculation pipelines to a dedicated Web Worker (`astro-calc.worker.ts`):
```typescript
// Background computation pattern
const worker = new Worker(new URL('@/workers/astro-calc.worker.ts', import.meta.url));
worker.postMessage({ type: 'CALCULATE_FULL_SUITE', birthDetails });
worker.onmessage = (event) => {
  setCalculatedSuite(event.data);
};
```
Computations offloaded to the worker:
1. Shodashavarga (16 divisional charts)
2. 90-day Cosmic Radar horizons and transit hits
3. 120-year Vimshottari & Chara Dasha hierarchies
4. Ashtakavarga Sodhya Pinda reductions

---

## 7. Component-by-Component Synchronization Matrix

| Target Engine | Current UI Component | Proposed Enhanced Component | Data Binding & State Flow | Interactive Presentation Mode |
|---------------|----------------------|-----------------------------|---------------------------|--------------------------------|
| **KP Ruling Planets** (`kp-ruling-planets.ts`) | *Omitted (0 UI components)* | `<KPRulingPlanetsCard />` | Bound to `runKPEngine().rulingPlanets` via `useChartStore` | Real-time card with Ascendant/Moon lords and corroboration strength badge |
| **KP Dasha Activation** (`kp-dasha-evidence.ts`) | Rudimentary progress bar in `dasha/page.tsx` | `<KPDashaEvidenceTree />` | Bound to `buildKPDashaEvidenceGraph(chart)` | Interactive node graph linking Mahadasha/Antardasha to KP event promises |
| **KP Conflict Resolver** (`kp-conflict-resolver.ts`) | Buried in static JSON report | `<KPPrecedenceMatrix />` | Bound to `KPPredictiveEvidenceContract` | Interactive collapsible table showing conflicting rules and active precedence |
| **Shadbala 6-Fold Strength** (`shadbala.ts`) | Isolated in `shadbala/page.tsx` | `<ShadbalaRadarBadge />` & `<BalaBreakdownDrawer />` | Bound to `calculateShadbala(planets, birthHourLocal)` | Radial radar chart in Kundli & planet drawers showing Sthana, Dig, Kala, Cheshta, Naisargika, Drik |
| **Ashtakavarga Transit Weighting** (`ashtakavarga.ts`) | Isolated in `ashtakavarga/page.tsx` | `<TransitKakshyaOverlay />` | Bound to `calculateTransitReport` + `calculateAshtakavarga` | Color-coded bindu badges on transiting planet rows in `/dashboard/transits` |
| **Shodashavarga (D1–D60)** (`divisional.ts`) | Single chart picker in `divisional/page.tsx` | `<VargaHarmonicNavigator />` | Bound to `calculateDivisional` with user-selected `birthTimeConfidence` | Tabbed grid with time-sensitivity badges (e.g. "⚠️ D60 sensitive to ±2min") |
| **Unified AI Astrologer Context** (`astrolife-unified-context.ts`) | Basic 1-line string in `chat/page.tsx` | `<AIEngineInspectorPanel />` | Full engine payload passed to `/api/chat` with dynamic citation chips | Chat messages display interactive reference tags (e.g. `[Cite: KP H7 Sub-Lord]`) |
| **Cosmic Pulse Forecast** (`cosmic-pulse/`) | Two static cards on `/dashboard/page.tsx` | `<CosmicPulseCenter />` | Bound to `calculateCosmicPulse` across `/dashboard/transits` and `/dashboard/event-radar` | Real-time drawer with Tara Bala, Chandra Bala, and one-click micro-remedies |
| **Dual Chart Layout** (`north-indian-chart.tsx`) | North Indian SVG only | `<UnifiedAstrologicalChart />` | Bound to `chart.planets`, `chart.lagnaNum`, and `userPreferences.chartStyle` | Seamless SVG toggle between North Indian Diamond and South Indian Box |

---

## 8. Prioritized Execution & Remediation Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ P0: IMMEDIATE / CRITICAL DEFECTS (Week 1)                                   │
│ • Remove duplicate <MobileBottomNav /> from 11+ dashboard pages             │
│ • Fix double <BoundaryPresentation /> rendering bug on /dashboard/kp       │
│ • Pass birthHourLocal into calculateShadbala on /dashboard/shadbala         │
│ • Eliminate double redirect loop on /dashboard/transit-ripple               │
│ • Add root dashboard error.tsx and loading.tsx                              │
│ • Resolve 518 TypeScript compile errors across src/                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ P1: CORE ENGINE-UI SYNCHRONIZATION (Weeks 2–3)                              │
│ • Implement global ChartContext / ChartProvider to replace duplicate fetches│
│ • Surface KP Ruling Planets in /dashboard/kp                                │
│ • Surface KP Dasha Evidence Graph in /dashboard/dasha                       │
│ • Inject deep engine context (KP, Shadbala, Ashtakavarga) into /api/chat    │
│ • Consolidate database chart schema (charts, saved_charts, user_charts)     │
│ • Build South Indian box chart visualizer                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ P2: DIFFERENTIATORS, POLISH & PERFORMANCE (Weeks 4–5)                       │
│ • Offload ephemeris & 90-day radar calculations to Web Workers              │
│ • Deploy interactive Life Chapters & Pattern Fusion explorer to dashboard   │
│ • User-configurable birth time confidence slider with D60 boundary alerts   │
│ • Replace legacy HTML5 <canvas> in Destiny with unified Recharts/SVG        │
│ • Extract inline <style> tags into CSS modules / Tailwind v4 classes        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Task Specifications

#### Phase P0: Immediate / Critical (Fix Breakages & Bugs)
1. **Task P0.1: Remove Duplicate `<MobileBottomNav />` Calls**
   - **Files to Modify:** `src/app/dashboard/dasha/page.tsx:339`, `transits/page.tsx:104, 350`, `report/page.tsx:232, 246, 530`, `event-radar/page.tsx:71, 254`, `special-lagnas/page.tsx:47, 117`, `sarvatobhadra/page.tsx:37, 503`, `remedy/page.tsx:96, 412`, `medical/page.tsx:28, 311`, `prashna/page.tsx:374`, `numerology/page.tsx:695`, `history/page.tsx:202`, `transit-purchase/page.tsx:91, 364`.
   - **Action:** Delete local `<MobileBottomNav />` tags; rely exclusively on `src/app/dashboard/layout.tsx:41`.
   - **Acceptance Test:** Inspect DOM on mobile viewport (`390px`); verify exactly one `<nav className="mob-nav">` exists.
2. **Task P0.2: Fix Double Boundary Presentation on KP Page**
   - **Files to Modify:** `src/app/dashboard/kp/page.tsx:420-425`.
   - **Action:** Remove redundant `<BoundaryPresentation />` block directly following `<EvidenceDrawer />`.
   - **Acceptance Test:** On `/dashboard/kp` under Evidence tab, verify "Explicit Boundaries" section appears exactly once.
3. **Task P0.3: Fix Shadbala Diurnal/Nocturnal Birth Hour Parameter**
   - **Files to Modify:** `src/app/dashboard/shadbala/page.tsx:78`.
   - **Action:** Parse birth hour from `birth.tob` (e.g. `parseInt(birth.tob.split(":")[0], 10)`) and pass as second argument: `calculateShadbala(chart.planets as never, birthHour)`.
   - **Acceptance Test:** Test chart born at 02:00 AM; verify Moon/Saturn gain nocturnal Kala Bala over Sun/Jupiter.
4. **Task P0.4: Fix Transit Ripple Double Redirect**
   - **Files to Modify:** `src/components/dashboard-sidebar.tsx:54`, `src/app/dashboard/transit-ripple/page.tsx`, `src/app/dashboard/transits/ripple/page.tsx`.
   - **Action:** Point sidebar directly to `/dashboard/transits?tab=ripple`. In `transits/page.tsx`, initialize `pageTab` from query parameter. Delete intermediate redirect files.
   - **Acceptance Test:** Click "Transit Ripple" in sidebar; verify browser URL updates in a single hop to `/dashboard/transits?tab=ripple` and renders the ripple view.
5. **Task P0.5: Add Route-Level Error Boundaries and Loading States**
   - **Files to Modify:** Create `src/app/dashboard/error.tsx` and `src/app/dashboard/loading.tsx`.
   - **Action:** Implement resilient fallback UI with retry button and loading skeleton.
   - **Acceptance Test:** Simulate an unhandled exception in `kp/page.tsx`; verify graceful fallback renders without crashing whole app.
6. **Task P0.6: TypeScript Compilation Remediation**
   - **Files to Modify:** `src/lib/user-chart.ts`, `src/lib/report-html-generator.ts`, `src/app/dashboard/kundli/page.tsx`, `src/app/dashboard/page.tsx`.
   - **Action:** Resolve implicit `any` annotations and missing property types until `npx tsc --noEmit` exits with code 0.

#### Phase P1: Core UI/UX Synchronization
1. **Task P1.1: Standardized `ChartProvider` & Global State Store**
   - **Files to Modify:** Create `src/context/ChartContext.tsx`, wrap in `src/app/dashboard/layout.tsx`, refactor `src/lib/user-chart.ts`.
   - **Action:** Centralize chart loading, caching, and active selection into a single provider. All pages consume `useChart()`.
   - **Acceptance Test:** Navigate across 5 dashboard routes; verify Supabase auth and chart queries fire exactly once on initial load.
2. **Task P1.2: Surface KP Ruling Planets Card**
   - **Files to Modify:** `src/app/dashboard/kp/page.tsx`, create `src/components/kp/KPRulingPlanetsCard.tsx`.
   - **Action:** Import `calculateKPRulingPlanetsConfirmation` from `kp.ts`, render Ruling Planets hero card displaying Ascendant Lord, Moon Lord, Star Lord, and Day Lord.
   - **Acceptance Test:** On `/dashboard/kp`, verify Ruling Planets card reflects chart's birth moment and highlights matching significators.
3. **Task P1.3: Connect Dasha Evidence Graph to `/dashboard/dasha`**
   - **Files to Modify:** `src/app/dashboard/dasha/page.tsx`, create `src/components/dasha/DashaEvidenceGraph.tsx`.
   - **Action:** Invoke `buildKPDashaEvidenceGraph` and visualize which life houses are unlocked by the active Mahadasha and Antardasha lords.
   - **Acceptance Test:** View active Venus Mahadasha; verify linked houses (e.g. H2, H7, H11) and sub-lord approvals are visually traced.
4. **Task P1.4: Deep Engine Grounding for AI Chat**
   - **Files to Modify:** `src/app/dashboard/chat/page.tsx`, `src/app/api/chat/route.ts`, `src/lib/ai-chat/astrolife-unified-context.ts`.
   - **Action:** Pass full KP significators, Shadbala top/bottom planets, and Ashtakavarga bindus into the `/api/chat` payload. Set `includeRawEngineContext: true`.
   - **Acceptance Test:** Ask AI *"Why is my Saturn period difficult?"*; verify AI response cites Saturn's exact house lordship, Shadbala Cheshta score, and Ashtakavarga house bindus.
5. **Task P1.5: Dual Chart Visualizer (South Indian Box Chart)**
   - **Files to Modify:** `src/components/north-indian-chart.tsx`, create `src/components/south-indian-chart.tsx`, create `src/components/UnifiedAstrologicalChart.tsx`.
   - **Action:** Implement South Indian fixed-zodiac box SVG. Provide instant toggle switch across Kundli and Transits.
   - **Acceptance Test:** Switch to South Indian style; verify Aries is fixed at top-left-inner box and planets populate correctly clockwise.

#### Phase P2: Differentiators, Polish & Performance
1. **Task P2.1: Web Worker Ephemeris Math Offloading**
   - **Files to Modify:** Create `src/workers/astro-calc.worker.ts`, update `useChartStore`.
   - **Action:** Move divisional chart generation, 90-day radar scanning, and transit hit detection to Web Worker.
   - **Acceptance Test:** Profile page load in Chrome DevTools; verify main thread CPU blocking during route transition drops below 50ms.
2. **Task P2.2: Interactive Life Chapters & Pattern Fusion Dashboard**
   - **Files to Modify:** Create `src/app/dashboard/life-chapters/page.tsx`, import `life-chapters-engine.ts` and `pattern-fusion-engine.ts`.
   - **Action:** Expose the 7-chapter life narrative and karmic blueprint directly in an interactive reader view.
   - **Acceptance Test:** Verify users can browse their life chapters interactively without generating a PDF.
3. **Task P2.3: Birth Time Confidence Slider & High-Harmonic Alerts**
   - **Files to Modify:** `src/app/dashboard/divisional/page.tsx`, `src/components/location/CityAutocomplete.tsx`.
   - **Action:** Allow users to set birth time confidence (Exact, ±5min, ±15min, Approximate). On D60, display prominent banner if confidence is < 90%.
   - **Acceptance Test:** Set confidence to ±15min; verify D60 card displays "⚠️ Low confidence: D60 lagna changes every 2 minutes".
4. **Task P2.4: CSS & Styling Modernization**
   - **Files to Modify:** `dashboard/page.tsx`, `kp/page.tsx`, `shadbala/page.tsx`, `event-radar/page.tsx`.
   - **Action:** Extract inline `<style>` JSX tags into scoped Tailwind v4 classes or CSS modules. Move Google Fonts import to `src/app/layout.tsx`.
   - **Acceptance Test:** Verify zero `<style>` tags embedded inside component render output; verify CSP headers function without `unsafe-inline`.

---

## 9. Conclusion
AstroLife's astrological calculations are among the most thorough and mathematically sound in modern computational astrology. However, the disconnect between its backend engines and its React frontend creates significant friction, misleading calculation parameters (e.g. noon-defaulted Shadbala), redundant network/render cycles, and missed opportunities for user engagement.

By executing the prioritized P0–P2 roadmap outlined above, AstroLife will achieve full engine-to-UI synchronization, eliminate rendering bottlenecks, provide progressive disclosure for users of all skill levels, and establish itself as the premier evidence-grounded Vedic astrology platform.
