# Task Assignment for Worker Sync 1 (ENGINE_UI_SYNC_SPECIFICATION.md)

You are Worker Sync 1 (Type: teamwork_preview_worker).
Your working directory is: /Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/worker_sync_1
Parent Orchestrator directory: /Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/orchestrator_1
You MUST read the authoritative user request at: /Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/ORIGINAL_REQUEST.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objective
Author the definitive, world-class UI/UX Synchronization Blueprint deliverable at:
`/Users/mukulpal/Desktop/astrolife/web/ENGINE_UI_SYNC_SPECIFICATION.md`

## Input Reports & Sources of Truth
1. Explorer 2 UI Mapping Report: `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_2/ui_mapping_report.md`
2. Explorer 1 Engine Audit Report: `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_1/engine_audit_report.md`
3. Explorer 3 Benchmark & SWOT Report: `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_3/benchmark_audit_report.md`

## Required Content & Structure for ENGINE_UI_SYNC_SPECIFICATION.md
1. **Executive Summary & Synchronization Framework**
   - High-level overview of the UI/UX architecture bridging computational astrology engines to the Next.js frontend
2. **Comprehensive Dashboard Route-to-Engine Inventory**
   - Full mapping of all 41 dashboard routes (`src/app/dashboard/`, `/kp`, `/dasha`, `/chat`, `/kundli`, `/shadbala`, `/ashtakavarga`, etc.)
   - For every route: target engine functions, data structures consumed, current UI components, and state layer
3. **Deep Engine-UI Disconnect Analysis**
   - Omitted/hidden/unlinked engine data with exact code references:
     - KP Ruling Planets completely missing from UI (`kp-ruling-planets.ts`)
     - Double Boundary Presentation bug on `/dashboard/kp` (`kp/page.tsx:421`)
     - Shadbala calculation flaw omitting `birthHourLocal` (`shadbala/page.tsx:78`), invalidating night births
     - KP Dasha Evidence trees and activation nodes missing from `/dashboard/dasha`
     - Ashtakavarga bindu weights omitted from Gochar transit calculations in `/dashboard/transits`
     - Shodashavarga D2–D60 discarded on `/dashboard/kundli`, hardcoded confidence (86) without D60 boundary warnings
     - AI Chat context starvation: 1-line string in `/api/chat`, omitting significators and planetary strength
     - Absence of South Indian box chart layout in `src/components/`
     - State fragmentation: 30+ uncached `useUserChart()` calls, triplicated chart DB schema
     - Redundant `<MobileBottomNav />` in 11+ routes, double redirect on transit ripple
     - 518 TypeScript compile errors across 117 files
4. **Component-by-Component Synchronization Matrix**
   - Detailed matrix: Target Engine -> UI Component -> Data Binding & State Management -> Interactive Visual Presentation (cards, graphs, drawers, tables)
   - Specific implementation designs for KP Placidus, Dasha, Shadbala, Kundli, Transit, and Chat
5. **Concrete React Component Architecture & State Flow Specifications**
   - Global `ChartProvider` / `useChartStore` design with unified caching and optimistic state
   - Async Web Worker integration (`astronomy.worker.ts`) for offloading CPU-intensive calculations
   - Standardized custom hooks (`useKPChart`, `useDashaTree`, `useShadbalaSummary`, `useAIAstrologyContext`)
   - Schema consolidation plan for Supabase (`charts` vs `saved_charts` vs `user_charts`)
6. **Wireframe & Structural Layout Specifications**
   - Progressive disclosure cards (Level 1: Consumer Glance, Level 2: Astrological Summary, Level 3: Deep Technical Proof Drawer)
   - Visual hierarchy, typography, dark/light theme harmony
   - Mobile responsiveness blueprints (resolving double nav, drawer gestures, responsive grid)
7. **Prioritized 3-Phase Execution & Remediation Roadmap**
   - **P0 (Immediate / Critical):** Broken bindings, UI rendering bottlenecks, duplicate navs, noon-default bug, double redirect, TypeScript errors. Complexity estimates, exact files to modify, acceptance test criteria.
   - **P1 (Core UI/UX Sync):** Shared ChartContext, KP Ruling Planets UI, Dasha activation tree, enriched AI Chat context, South Indian chart. Complexity estimates, exact files, acceptance test criteria.
   - **P2 (Differentiators & Polish):** Web Worker offloading, D60 birth time confidence selector, Life Chapters interactive visualizer, inline `<style>` elimination. Complexity estimates, exact files, acceptance test criteria.

## Completion Criteria
- Write the complete file to `/Users/mukulpal/Desktop/astrolife/web/ENGINE_UI_SYNC_SPECIFICATION.md`
- Verify formatting, line citations, and completeness
- Write handoff report to `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/worker_sync_1/handoff.md`
- Send completion message to parent orchestrator

## 2026-09-24T05:08:24Z
You are Worker Sync 1.
Your working directory is: /Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/worker_sync_1
Your task assignment is in: /Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/worker_sync_1/DISPATCH.md
You MUST read the authoritative user request at: /Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/ORIGINAL_REQUEST.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission is to generate the comprehensive master deliverable:
`/Users/mukulpal/Desktop/astrolife/web/ENGINE_UI_SYNC_SPECIFICATION.md`

Synthesize findings from:
- `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_2/ui_mapping_report.md`
- `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_1/engine_audit_report.md`
- `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_3/benchmark_audit_report.md`

Ensure full coverage of:
1. Complete mapping of all 41 dashboard routes (`src/app/dashboard/`, `/kp`, `/dasha`, `/chat`, etc.) to underlying backend engine functions.
2. Disconnect analysis with exact code references (omitted KP Ruling Planets, double boundary bug, Shadbala noon default bug, missing Dasha evidence trees, Ashtakavarga transit weights omission, Shodashavarga D2-D60 discard, AI Chat context starvation, missing South Indian chart layout, state fragmentation, duplicate MobileBottomNav, double redirect, 518 TypeScript errors).
3. Component-by-component synchronization matrix (Target Engine -> UI Component -> Data Binding & State Management -> Interactive Visual Presentation).
4. Concrete React component architecture and state flow recommendations (global ChartProvider / useChartStore, async astronomy Web Worker, custom hooks, caching, Supabase 3-table consolidation).
5. Wireframe/structural layout descriptions for progressive disclosure cards (Levels 1-3), visual hierarchy, and mobile responsiveness.
6. Prioritized 3-phase remediation backlog (P0, P1, P2) with complexity estimates, files to modify, and acceptance tests.

Write the complete file to `/Users/mukulpal/Desktop/astrolife/web/ENGINE_UI_SYNC_SPECIFICATION.md`.
Write your handoff summary to `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/worker_sync_1/handoff.md`.
Update progress.md in your directory and send a completion message to the parent orchestrator via send_message.

