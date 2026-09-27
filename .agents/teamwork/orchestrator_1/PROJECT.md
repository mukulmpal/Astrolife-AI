# Project: AstroLife 360° Technical & Architectural Audit and UI/UX Synchronization Blueprint

## Architecture
- Computational Core: `src/lib/astro-engine/`, `src/lib/astro-intelligence/`, `src/lib/report/` (Moshier analytical ephemeris, Placidus cusps, Krishnamurti Placidus KP, Vimshottari Dasha, Shodashavarga D1-D60, Shadbala, Ashtakavarga, Cosmic Pulse, Panchang, Mangal Dosha, Jaimini, Sarvatobhadra, Explainability & Evidence-First PDF).
- Frontend Application: Next.js App Router (`src/app/dashboard/` across 41 routes, `src/components/`, `src/hooks/`, `src/lib/user-chart.ts`).
- Verification & Benchmarks: 27 test files (~170+ assertions, 302/302 tests passing natively), `BENCHMARK_GAP_ANALYSIS.md`, `DIFFERENCE_REPORT.md` (53/53 metrics pass against Swiss Ephemeris v2.10.03 / NASA JPL DE441).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Complete Engine Registry | Full catalog of files in astro-engine, astro-intelligence, and report with I/O types, accuracy, and dependencies | M1 (Audit & SWOT) | Explorer 1 |
| 2 | Benchmark Citation & Verification | Direct citation of DIFFERENCE_REPORT.md, BENCHMARK_GAP_ANALYSIS.md, IMPLEMENTATION_SUMMARY.md | M1 (Audit & SWOT) | Explorer 3 |
| 3 | Formal Evidence-Based SWOT | ≥5 concrete, code-referenced points per quadrant (Strengths, Weaknesses, Opportunities, Threats) | M1 (Audit & SWOT) | Explorer 3 |
| 4 | Architectural Patterns & Debt Analysis | Ephemeris divergence in transit.ts, 4.38MB all-cities.ts, client-side thread blocking in ai-engine-context.ts, PDF generators | M1 (Audit & SWOT) | Explorer 1 |
| 5 | Dashboard Route & Engine Mapping | Complete mapping of 41 dashboard routes (/kp, /dasha, /chat, etc.) to underlying backend functions | M2 (Sync Spec) | Explorer 2 |
| 6 | Engine-UI Disconnect Analysis | Deep gap analysis for KP Ruling Planets, Dasha Evidence trees, Shadbala noon bug, Ashtakavarga weights, AI Chat context starvation | M2 (Sync Spec) | Explorer 2 |
| 7 | Component Synchronization Matrix | Target Engine -> UI Component -> Data Binding & State Management -> Interactive Presentation | M2 (Sync Spec) | Explorer 2 |
| 8 | React Architecture & State Flow | Global ChartProvider, custom hooks, caching, async Web Workers, elimination of duplicate useUserChart() | M2 (Sync Spec) | Explorer 2 |
| 9 | Progressive Disclosure & Wireframes | Structured visual hierarchy, progressive disclosure cards, mobile drawer layouts, elimination of duplicate MobileBottomNav | M2 (Sync Spec) | Explorer 2 |
| 10 | Prioritized Remediation Backlog | 3-phase roadmap (P0, P1, P2) with complexity estimates, files to modify, and acceptance tests | M2 (Sync Spec) | Explorer 1, 2, 3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Survey & Exploration | Parallel exploration of engines, UI routes, and benchmarks | none | DONE |
| M1 | Master Audit & SWOT Generation | Author ASTROLIFE_AUDIT_AND_SWOT.md in project root | M0 | DONE |
| M2 | UI/UX Sync Specification Generation | Author ENGINE_UI_SYNC_SPECIFICATION.md in project root | M0 | DONE |
| M3 | Multi-Agent Review & Challenge | Independent review by 2 Reviewers and 2 Challengers | M1, M2 | DONE |
| M4 | Forensic Audit Verification | Integrity check by Forensic Auditor (zero cheating/facades) | M3 | DONE |
| M5 | Final Gate Sign-Off & Delivery | Verify zero test regression and report victory to parent | M4 | DONE |

## Code Layout & Write Boundaries
- `worker_audit_1`: Exclusively owns `/Users/mukulpal/Desktop/astrolife/web/ASTROLIFE_AUDIT_AND_SWOT.md`.
- `worker_sync_1`: Exclusively owns `/Users/mukulpal/Desktop/astrolife/web/ENGINE_UI_SYNC_SPECIFICATION.md`.
- No worker writes to source code (`src/`), ensuring zero code degradation.
