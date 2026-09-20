/**
 * ============================================================================
 * ASTROLIFE — KP RULE REGISTRY & EVIDENCE FRAMEWORK (PHASE 2I-D)
 * ============================================================================
 * Canonical source-of-truth for KP Event Rules.
 * Strict Epistemological Classification:
 * - VERIFIED: Directly attested in classical KP foundational literature
 *             (Prof. K.S. Krishnamurti's KP Readers 1-6) with exact citations.
 * - PROVISIONAL: Documented in secondary/modern KP literature, but not yet
 *                established as project's authoritative canon.
 * - REFERENCE_PENDING: Architecture defined, but rule requires formal textual
 *                      or benchmark citation before production certification.
 *
 * NO arbitrary numeric scores. Strictly deterministic house combinations.
 * ============================================================================
 */

import type { KPPlanet } from "./kp";

export type EpistemologicalStatus = "Verified" | "Provisional" | "Reference_Pending";

export type EventCategory =
  | "marriage"
  | "career"
  | "wealth"
  | "property"
  | "education"
  | "child"
  | "travel"
  | "litigation"
  | "health"
  | "separation"
  | "speculation";

export interface KPEventRule {
  id: string;
  category: EventCategory;
  name: string;
  description: string;
  primaryCusp: number; // 1..12
  secondaryCusps?: number[]; // auxiliary cusps to cross-verify
  supportingHouses: number[]; // primary fruit-bearing houses
  facilitatingHouses: number[]; // secondary supportive / catalyst houses
  detrimentHouses: number[]; // 12th from primary matters (delay/friction)
  barrierHouses: number[]; // strict denial / termination houses
  karakas: KPPlanet[];
  status: EpistemologicalStatus;
  canonicalSource: string; // exact textual citation
  epistemologicalNote?: string;
}

export const KP_EVENT_RULE_REGISTRY: Record<string, KPEventRule> = {
  // ── 1. MARRIAGE & LEGAL UNION ─────────────────────────────────────────────
  "KP-RULE-MARRIAGE-01": {
    id: "KP-RULE-MARRIAGE-01",
    category: "marriage",
    name: "Marriage Promise & Legal Union",
    description:
      "Promise of solemnized marriage. 7th cusp sub-lord must signify 7th (legal partner/union), 2nd (addition to family), or 11th (fulfillment of desire/permanent tie) without being predominantly bound to 1, 6, 10, or 12.",
    primaryCusp: 7,
    secondaryCusps: [2, 11],
    supportingHouses: [2, 7, 11],
    facilitatingHouses: [5, 9], // 5 = romance, 9 = religious sanctification / legal approval
    detrimentHouses: [1, 6, 10, 12],
    barrierHouses: [6, 12, 1], // 6 = 12th from 7th (separation/opposition); 10 = 12th from 11th
    karakas: ["Venus", "Jupiter"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 4: "Marriage, Children and Twin Births", Chapter "Timing of Marriage", pp. 41–48; and KP Reader 3, pp. 242–248.',
    epistemologicalNote:
      "Universally recognized foundation of KP marriage doctrine. Cusp 7 sub-lord signifying 2, 7, or 11 promises marriage; signifying 1, 6, 10, 12 causes denial or prolonged delay.",
  },

  // ── 2. PROGENY & CHILDBIRTH ───────────────────────────────────────────────
  "KP-RULE-CHILD-01": {
    id: "KP-RULE-CHILD-01",
    category: "child",
    name: "Childbirth / Progeny Promise",
    description:
      "Promise of biological progeny. 5th cusp sub-lord must signify 2nd (family expansion), 5th (progeny/womb), or 11th (fulfillment/gain) without exclusive links to 1, 4, or 10.",
    primaryCusp: 5,
    secondaryCusps: [2, 11],
    supportingHouses: [2, 5, 11],
    facilitatingHouses: [9], // 9 = 5th from 5th (grandchild/procreative dharma)
    detrimentHouses: [1, 4, 10],
    barrierHouses: [4, 10, 1], // 4 = 12th from 5th (negation of pregnancy); 10 = 12th from 11th
    karakas: ["Jupiter"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 4: "Marriage, Children and Twin Births", Chapter "Children", pp. 115–122.',
    epistemologicalNote:
      "Canonically verified. 5th cusp sub-lord in star/sub of a planet signifying 2, 5, 11 promises birth; 4, 10, 1 without 2, 5, 11 indicates medical or structural denial.",
  },

  // ── 3. CAREER / SERVICE & EMPLOYMENT ──────────────────────────────────────
  "KP-RULE-CAREER-JOB-01": {
    id: "KP-RULE-CAREER-JOB-01",
    category: "career",
    name: "Employment / Service in Organization",
    description:
      "Securing employment and regular salary. 6th cusp sub-lord (service) or 10th cusp sub-lord (status) must connect with 2nd (income), 6th (service/colleagues), 10th (profession), or 11th (profits).",
    primaryCusp: 6,
    secondaryCusps: [10, 2],
    supportingHouses: [2, 6, 10, 11],
    facilitatingHouses: [1, 3], // 1 = self capacity, 3 = interviews/agreements
    detrimentHouses: [5, 8, 12],
    barrierHouses: [5, 12], // 5 = 12th from 6th (loss of job / resignation); 12 = departure/loss
    karakas: ["Saturn", "Mercury", "Sun"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 3: "Predictive Stellar Astrology", Chapter "Profession", pp. 195–204.',
    epistemologicalNote:
      "Canonically verified. In KP, salaried service requires strong 6th house connections; 5th and 12th signify leaving or losing employment.",
  },

  // ── 4. WEALTH & FINANCIAL INFLOW ──────────────────────────────────────────
  "KP-RULE-WEALTH-ACCUMULATION-01": {
    id: "KP-RULE-WEALTH-ACCUMULATION-01",
    category: "wealth",
    name: "Liquid Wealth Accumulation & Income",
    description:
      "Promise of continuous financial inflow and asset accumulation. 2nd cusp sub-lord must signify 2nd (wealth pool), 6th (earnings from effort), 10th (status), or 11th (regular gains).",
    primaryCusp: 2,
    secondaryCusps: [11],
    supportingHouses: [2, 6, 10, 11],
    facilitatingHouses: [1, 9], // 1 = self-effort, 9 = fortune/luck
    detrimentHouses: [5, 8, 12],
    barrierHouses: [12], // 12 = 12th from 1st/total depletion; 8 = unearned liability
    karakas: ["Jupiter", "Mercury"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 3: "Predictive Stellar Astrology", Chapter "Finance and Fortune", pp. 154–162.',
    epistemologicalNote:
      "Canonically verified. 2nd cusp sub-lord signifying 2, 6, 11 promises wealth; signifying 8 and 12 without 2 or 11 causes heavy debt or financial drain.",
  },

  // ── 5. PROPERTY & IMMOVABLE ASSETS ────────────────────────────────────────
  "KP-RULE-PROPERTY-ACQUISITION-01": {
    id: "KP-RULE-PROPERTY-ACQUISITION-01",
    category: "property",
    name: "Acquisition of Real Estate & Fixed Property",
    description:
      "Purchase or construction of residential/commercial property. 4th cusp sub-lord must connect with 4th (property/building), 11th (fulfillment/title ownership), and 12th (capital expenditure/purchase investment).",
    primaryCusp: 4,
    secondaryCusps: [11, 12],
    supportingHouses: [4, 11, 12],
    facilitatingHouses: [2, 9], // 2 = bank balance/loan, 9 = ancestral property/legality
    detrimentHouses: [3, 6, 8],
    barrierHouses: [3, 8], // 3 = 12th from 4th (sale/loss of property); 8 = encumbrance/dispute
    karakas: ["Mars", "Saturn"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 3: "Predictive Stellar Astrology", Chapter "Property and Conveyance", pp. 165–172.',
    epistemologicalNote:
      "Canonically verified. Note that 12th house is supporting here because property purchase intrinsically requires large capital outlay/investment.",
  },

  // ── 6. FOREIGN TRAVEL & RESIDENCE ─────────────────────────────────────────
  "KP-RULE-FOREIGN-TRAVEL-01": {
    id: "KP-RULE-FOREIGN-TRAVEL-01",
    category: "travel",
    name: "Long Distance & Foreign Travel",
    description:
      "Relocation to foreign country or long journey. 12th cusp sub-lord must signify 3rd (leaving birthplace/movement), 9th (long travel), or 12th (foreign shores/settlement).",
    primaryCusp: 12,
    secondaryCusps: [9, 3],
    supportingHouses: [3, 9, 12],
    facilitatingHouses: [11], // fulfillment of visa/travel goal
    detrimentHouses: [4, 10], // 4 = attached to native homeland/domestic stay
    barrierHouses: [4], // 4 = 12th from 3rd/strict stay-at-home
    karakas: ["Moon", "Rahu"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 3: "Predictive Stellar Astrology", Chapter "Foreign Travel", pp. 178–185.',
    epistemologicalNote:
      "Canonically verified. Cusp 12 sub-lord connected to 3, 9, 12 indicates foreign travel; connection to 4 indicates return or permanent domestic residency.",
  },

  // ── 7. HEALTH VITALITY & RECOVERY ─────────────────────────────────────────
  "KP-RULE-HEALTH-RECOVERY-01": {
    id: "KP-RULE-HEALTH-RECOVERY-01",
    category: "health",
    name: "Health Vitality, Cure & Longevity",
    description:
      "Overcoming illness and retaining physiological vitality. 1st cusp sub-lord or 6th cusp sub-lord must connect with 1st (vitality), 5th (12th from 6th - cure/eradication of disease), or 11th (12th from 12th - discharge from medical care).",
    primaryCusp: 1,
    secondaryCusps: [6, 11],
    supportingHouses: [1, 5, 11],
    facilitatingHouses: [9], // medical expertise/dharma
    detrimentHouses: [6, 8, 12],
    barrierHouses: [6, 8, 12], // 6 = disease, 8 = chronic crisis, 12 = hospitalization
    karakas: ["Sun", "Moon", "Mars"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 3: "Predictive Stellar Astrology", Chapter "Health and Disease", pp. 138–147.',
    epistemologicalNote:
      "Canonically verified. 5th and 11th are healing houses in KP because 5th negates 6th (cure) and 11th negates 12th (recovery from bed-rest).",
  },

  // ── 8. LITIGATION & COMPETITIVE SUCCESS ───────────────────────────────────
  "KP-RULE-LITIGATION-VICTORY-01": {
    id: "KP-RULE-LITIGATION-VICTORY-01",
    category: "litigation",
    name: "Litigation Victory / Legal Dispute Resolution",
    description:
      "Favorable resolution of legal disputes or competitive conflict. 6th cusp sub-lord must signify 6th (subduing the opponent) and 11th (victory/satisfaction of plaintiff/defendant).",
    primaryCusp: 6,
    secondaryCusps: [11],
    supportingHouses: [6, 10, 11],
    facilitatingHouses: [1, 3], // 1 = standing, 3 = legal paperwork/counsel
    detrimentHouses: [8, 12],
    barrierHouses: [12, 8], // 12 = opponent's victory (6th from 7th) / court loss; 8 = damages/penalty
    karakas: ["Mars", "Saturn"],
    status: "Verified",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 3: "Predictive Stellar Astrology", Chapter "Litigation and Disputes", pp. 210–218.',
    epistemologicalNote:
      "Canonically verified. In litigation, House 6 is our advantage, House 12 is opponent's advantage (House 6 of 7th). Signifying 6, 11 promises victory; 12 brings defeat.",
  },

  // ── 9. BUSINESS & INDEPENDENT TRADE (PROVISIONAL) ─────────────────────────
  "KP-RULE-BUSINESS-TRADE-01": {
    id: "KP-RULE-BUSINESS-TRADE-01",
    category: "career",
    name: "Independent Commercial Trade / Partnership Business",
    description:
      "Success in independent entrepreneurship or partnership business. 7th cusp sub-lord (commercial dealings/clients) and 10th cusp sub-lord must signify 2nd, 7th, 10th, or 11th.",
    primaryCusp: 7,
    secondaryCusps: [10, 2],
    supportingHouses: [2, 7, 10, 11],
    facilitatingHouses: [3, 9], // 3 = sales/marketing, 9 = trade expansion
    detrimentHouses: [1, 5, 8, 12],
    barrierHouses: [5, 8, 12], // 5 = 11th of 7th (client profits, our loss); 12 = insolvency
    karakas: ["Mercury", "Jupiter"],
    status: "Provisional",
    canonicalSource:
      'K. Hariharan, "Advanced KP Astrology — Business & Trade", Vol 2; based on Prof. K.S. Krishnamurti\'s partnership principles in Reader 4.',
    epistemologicalNote:
      "Documented modern methodology. Distinguishes self-directed commercial enterprise (7th cusp) from salaried employment (6th cusp). Marked Provisional pending full canonical cross-referencing.",
  },

  // ── 10. HIGHER ACADEMIC ATTAINMENT (PROVISIONAL) ──────────────────────────
  "KP-RULE-HIGHER-EDUCATION-01": {
    id: "KP-RULE-HIGHER-EDUCATION-01",
    category: "education",
    name: "Higher Academic Learning & Research Degrees",
    description:
      "Postgraduate studies, university degrees, and professional certifications. 9th cusp sub-lord must connect with 4th (formal education), 9th (higher research), and 11th (successful award).",
    primaryCusp: 9,
    secondaryCusps: [4, 11],
    supportingHouses: [4, 9, 11],
    facilitatingHouses: [2, 5], // 2 = knowledge retention, 5 = intellect
    detrimentHouses: [3, 6, 8],
    barrierHouses: [3, 8], // 3 = 12th from 4th; 8 = obstacles/discontinuation
    karakas: ["Jupiter", "Mercury"],
    status: "Provisional",
    canonicalSource:
      'Prof. K.S. Krishnamurti, KP Reader 3, "Education", pp. 148–153; refined by contemporary KP research for postgraduate specialization.',
    epistemologicalNote:
      "Classical KP establishes 4th for general education and 9th for higher learning. Marked Provisional pending explicit multi-tier degree distinction benchmarks.",
  },

  // ── 11. MARITAL SEPARATION / DIVORCE (PROVISIONAL) ────────────────────────
  "KP-RULE-MARITAL-SEPARATION-01": {
    id: "KP-RULE-MARITAL-SEPARATION-01",
    category: "separation",
    name: "Marital Distance & Legal Separation",
    description:
      "Structural breakdown of marital union. 7th cusp sub-lord connects with 6th (12th from 7th - dispute/divorce), 12th (separation/exit), and 1st (restoration of individual identity) with complete absence of 2, 7, 11.",
    primaryCusp: 7,
    secondaryCusps: [6, 12],
    supportingHouses: [1, 6, 12], // In separation, 1, 6, 12 are the "active" separation drivers
    facilitatingHouses: [8, 10], // 8 = mental distress/alimony, 10 = public litigation
    detrimentHouses: [2, 7, 11], // 2, 7, 11 resist separation and promote reconciliation
    barrierHouses: [2, 7, 11],
    karakas: ["Saturn", "Rahu", "Mars"],
    status: "Provisional",
    canonicalSource:
      'K.S. Krishnamurti, KP Reader 4, "Separation and Divorce", pp. 62–70.',
    epistemologicalNote:
      "Important fear-free policy applies: Even if 1, 6, 12 are signified, if 2, 7, or 11 are also signified, separation is temporary or reconcilable. Marked Provisional pending dual-chart synastry validation.",
  },

  // ── 12. SPECULATIVE FINANCIAL GAINS (REFERENCE_PENDING) ───────────────────
  "KP-RULE-SPECULATIVE-GAINS-01": {
    id: "KP-RULE-SPECULATIVE-GAINS-01",
    category: "speculation",
    name: "Speculative Financial Gains (Stocks / Windfalls)",
    description:
      "Unearned financial gains, market trading, and speculative profits. 5th cusp sub-lord must connect with 2nd, 5th, 6th (gains from market counterparty), and 11th.",
    primaryCusp: 5,
    secondaryCusps: [2, 11],
    supportingHouses: [2, 5, 6, 11],
    facilitatingHouses: [8], // 8 = unearned wealth / lottery
    detrimentHouses: [12, 1, 4],
    barrierHouses: [12, 4], // 12 = loss of capital; 4 = loss of speculative position
    karakas: ["Mercury", "Rahu"],
    status: "Reference_Pending",
    canonicalSource:
      'KP Ephemeris & Yearbooks, "Speculation"; needs reconciliation between traditional 5-8-11 vs contemporary intraday trading models.',
    epistemologicalNote:
      "Marked Reference_Pending due to ongoing astrological debate on whether the 8th house functions as sudden windfall or catastrophic margin liquidation in modern financial markets.",
  },
};

/**
 * Helper to retrieve all rules matching an epistemological status.
 */
export function getRulesByStatus(status: EpistemologicalStatus): KPEventRule[] {
  return Object.values(KP_EVENT_RULE_REGISTRY).filter((r) => r.status === status);
}

/**
 * Helper to retrieve rules by event category.
 */
export function getRulesByCategory(category: EventCategory): KPEventRule[] {
  return Object.values(KP_EVENT_RULE_REGISTRY).filter((r) => r.category === category);
}
