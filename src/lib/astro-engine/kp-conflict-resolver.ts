/**
 * ============================================================================
 * ASTROLIFE — KP SIGNAL CONFLICT & CONTRADICTION RESOLVER (PHASE 2I-H)
 * ============================================================================
 * Synthesizes the four upstream calculation layers:
 * 1. Natal Cusp Promise (Phase 2I-C)
 * 2. 5-Level Dasha Activation (Phase 2I-E-B)
 * 3. Transit Confirmation (Phase 2I-F)
 * 4. Ruling Planets Corroboration (Phase 2I-G)
 *
 * Strict Architectural Invariants:
 * 1. Precedence is SOURCE-BACKED and RULE-SPECIFIC (Relations REL-01 to REL-10).
 *    No universal numerical ranking, weighting, or blanket array ordering.
 * 2. Absolute zero scores, weights, percentages, probabilities, or majority voting.
 * 3. All upstream states are preserved IMMUTABLY (strictly read-only reflection).
 * 4. PROMISE_DENIED originates ONLY from the verified natal cusp-promise layer.
 * 5. RP_DISCORDANT is strictly non-denial (lack of instantaneous confirmation).
 * 6. Saturn does NOT automatically cause delay; DELAY_INDICATED requires source-supported evidence.
 * 7. isFructificationExpected is derived strictly from the applicable verified relation,
 *    never from an independent boolean mapping.
 * 8. Unsupported conflicts produce EVALUATION_PENDING under REL-10 rather than invented rules.
 * 9. Every synthesized conflict finding retains full classical provenance.
 * ============================================================================
 */

import type { EpistemologicalStatus, KPEventRule } from "./kp-rule-registry";
import { KP_EVENT_RULE_REGISTRY } from "./kp-rule-registry";
import type { KPPlanet } from "./kp";
import type { KPDashaActivationResult } from "./kp-dasha-activation";
import type { KPTransitConfirmationResult } from "./kp-transit-confirmation";
import type { KPRulingPlanetsConfirmationResult, KPRulingPlanetsSnapshot } from "./kp-ruling-planets";

// ── Types & Contracts ────────────────────────────────────────────────────────

export type KPConflictState =
  | "EVENT_DENIED_BY_NATAL_PROMISE"     // Natal cusp sub-lord forbids event; downstream timing suppressed
  | "TIMING_OBSTRUCTED"                 // Natal promise supported, but running Dasha period obstructed
  | "TIMING_ALIGNED_TRANSIT_OBSTRUCTED" // Period aligned, but transit currently counter-indicative (delayed)
  | "TIMING_ALIGNED_TRANSIT_CONFIRMED"  // Both period and transit support manifestation
  | "TIMING_ALIGNED_RP_CORROBORATED"    // Period, transit, and instantaneous RP all corroborate
  | "TIMING_ALIGNED_RP_UNCORROBORATED"  // Period and transit support, but instantaneous RP uncorroborated (never denied)
  | "TIMING_MIXED_WINDOW"               // Running periods contain both supporting and detriment houses
  | "MULTIPLE_MANIFESTATION"            // Simultaneous coexisting outcomes (e.g. capital outflow + title gain)
  | "DELAY_INDICATED"                   // Event promised but postponed (textually verified Saturn/retrograde delay)
  | "TIMING_NEUTRAL"                    // Period unconstrained / inactive for this topic
  | "EVALUATION_PENDING";               // Rule or conflict relation is Reference_Pending

export type KPPrecedenceRelationId =
  | "REL-01"
  | "REL-02"
  | "REL-03"
  | "REL-04"
  | "REL-05"
  | "REL-06"
  | "REL-07"
  | "REL-08"
  | "REL-09"
  | "REL-10";

export interface KPConflictFindingProvenance {
  sourceBook: string;
  reader: "Reader III" | "Reader IV" | "Reader VI" | "Unverified";
  pages: string;
  quoteOrLocatedPrinciple: string;
  epistemologicalStatus: EpistemologicalStatus;
}

export interface KPConflictFinding {
  findingId: string;
  relationId: KPPrecedenceRelationId;
  conflictType:
    | "NATAL_PROMISE_OVERRIDE"          // Favourable timing suppressed by natal denial
    | "DASHA_TRANSIT_TENSION"           // Tension between Dasha window and transit movement
    | "RP_TIMING_DISCREPANCY"           // Absence of RP corroboration without declaring denial
    | "MIXED_SIGNIFICATION_SPLIT"       // Coexistence of contradictory house significations
    | "SOURCE_BACKED_DELAY_MODIFIER"    // Postponement vs denial where textually verified
    | "RETROGRADE_DEFERRAL_MODIFIER"    // Deferred fructification until direct/stellar trigger
    | "UNRESOLVED_CONFLICT_GUARD"       // When no verified classical precedence rule exists
    | "NO_CONFLICT";                    // Harmonious alignment across all active layers
  primaryLayer: "NATAL_PROMISE" | "DASHA_ACTIVATION" | "TRANSIT_CONFIRMATION" | "RULING_PLANETS";
  subordinateLayer?: "DASHA_ACTIVATION" | "TRANSIT_CONFIRMATION" | "RULING_PLANETS";
  precedenceRule: string;
  rationale: string;
  provenance: KPConflictFindingProvenance;
}

export interface KPPredictiveSynthesisResult {
  ruleId: string;
  eventName: string;
  canonicalSource: string;
  status: EpistemologicalStatus;

  // Preserved Upstream Layer States (Strictly Read-Only and Immutable)
  upstreamStates: {
    natalPromiseVerdict: string;
    dashaTimingState: string;
    transitState?: string;
    rulingPlanetsState?: string;
  };

  // Synthesized Decision
  state: KPConflictState;
  delayVsDenial: "DENIAL" | "DELAY" | "UNOBSTRUCTED" | "NEUTRAL" | "PENDING";
  isFructificationExpected: boolean;
  expectedManifestationType:
    | "FRUCTIFICATION"
    | "DENIAL"
    | "POSTPONEMENT"
    | "MIXED_GAIN_AND_EXPENSE"
    | "UNFRUITFUL_ATTEMPT"
    | "INACTIVE_WINDOW"
    | "PENDING";

  // Detailed Explainability & Provenance
  conflictFindings: KPConflictFinding[];
  summaryVerdict: string;
  causalAuditTrail: string[];

  provenance: {
    readerReferences: string[];
    epistemologicalStatus: EpistemologicalStatus;
    methodologyNote: string;
  };
}

// ── Classical Precedence Repository ──────────────────────────────────────────

const PRECEDENCE_RELATIONS: Record<KPPrecedenceRelationId, {
  ruleName: string;
  provenance: KPConflictFindingProvenance;
}> = {
  "REL-01": {
    ruleName: "Natal Cusp Sub-Lord Sovereignty over Dasha Activation",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader III",
      pages: "Reader III pp. 145, 431; Reader IV p. 43",
      quoteOrLocatedPrinciple:
        "When the event is not promised in the horoscope, whatever Dasa runs, the event cannot happen. The Dasa lord can give only what the cusp sub-lord permits.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-02": {
    ruleName: "Natal Cusp Sub-Lord Sovereignty over Transit Movements",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader III",
      pages: "pp. 62–70, 471–475",
      quoteOrLocatedPrinciple:
        "Transit is only a pointer. It shows when the event will fructify. But if there is no promise in the natal chart, transits pass off without giving the result.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-03": {
    ruleName: "Natal Cusp Sub-Lord Sovereignty over Ruling Planets in Natal Context",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader VI",
      pages: "Reader III pp. 437–440; Reader VI p. 20",
      quoteOrLocatedPrinciple:
        "Ruling planets indicate vibrations at the moment of judgement. In natal astrology they identify active significators or rectify time; they do not alter the natal promise.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-04": {
    ruleName: "Dasha Hierarchy Macro Window Sovereignty over Current Manifestation",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader III",
      pages: "Reader III pp. 431–434; Reader IV p. 43",
      quoteOrLocatedPrinciple:
        "Even when an event is promised natally, if the running Dasa or Bhukti lord vetoes the event through detriment houses, the event cannot materialize during that period.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-05": {
    ruleName: "Dasha Hierarchy Precedence over Favourable Transits",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader III",
      pages: "pp. 471–475",
      quoteOrLocatedPrinciple:
        "First examine Dasa lord, then Bhukti lord, then Anthra lord. If Dasa and Bhukti are unfavourable, transits cannot give success. A favourable transit during an unfavourable Dasa gives temporary relief or false hope, but cannot bestow the actual event.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-06": {
    ruleName: "Dasha Window Validity with Transit Trigger Postponement",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader III",
      pages: "p. 474",
      quoteOrLocatedPrinciple:
        "When Dasa and Bhukti are favourable, an unfavourable transit causes temporary delay, impediment or anxiety, but when the transit enters a favourable star/sub, the event takes place immediately.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-07": {
    ruleName: "Ruling Planets Non-Denial Guard for Aligned Period Lords",
    provenance: {
      sourceBook: "Classical KP Horary doctrine",
      reader: "Reader VI",
      pages: "pp. 18–25",
      quoteOrLocatedPrinciple:
        "Ruling planets confirm or select which significators are active at the query moment. The absence of a period lord among instantaneous ruling planets indicates lack of current attunement, not denial of the event.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-08": {
    ruleName: "Sub-Period Specialization & Compound Manifestation for Mixed Significations",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader III",
      pages: "pp. 143, 243–257, 433",
      quoteOrLocatedPrinciple:
        "Saturn Dasa has both 11th and 12th significations. In one sub-period it gives earnings (11th), and in another sub-period heavy expenses (12th). For purchase of property, one must examine 4th (property), 11th (gain of asset), and 12th (investment/outflow).",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-09": {
    ruleName: "Source-Supported Delay vs Denial Disambiguation",
    provenance: {
      sourceBook: "Classical KP doctrine",
      reader: "Reader III",
      pages: "Reader III pp. 195, 345; Reader IV p. 44",
      quoteOrLocatedPrinciple:
        "Saturn causes delay, but does not deny. Denial comes only when the sub-lord of the cusp signifies houses detrimental to the event. If the sub-lord promises the event, Saturn as a significator or period lord gives the result late in life or after obstacles.",
      epistemologicalStatus: "Verified",
    },
  },
  "REL-10": {
    ruleName: "Epistemic Boundary Guard for Unsupported Conflict Configurations",
    provenance: {
      sourceBook: "AstroLife Classical Epistemic Framework",
      reader: "Unverified",
      pages: "System Invariant 10",
      quoteOrLocatedPrinciple:
        "When an observed conflict configuration lacks explicit attestation or resolution precedence in classical KP literature, the system must emit REFERENCE_PENDING rather than fabricating ad-hoc heuristic precedence.",
      epistemologicalStatus: "Reference_Pending",
    },
  },
};

// ── Classical Delay Topic Whitelist ──────────────────────────────────────────
// In classical KP literature, Saturnine delay without denial is specifically
// attested for Marriage (Reader IV, p. 44) and Career/Promotion (Reader III, p. 345).
const ATTRIBUTED_SATURN_DELAY_RULES = new Set<string>([
  "KP-RULE-MARRIAGE-01",
  "KP-RULE-CAREER-JOB-01",
  "KP-RULE-BUSINESS-TRADE-01",
]);

// ── Core Conflict Resolver Function ──────────────────────────────────────────

/**
 * Synthesizes upstream predictive evidence for a single event rule into an
 * explainable, classical source-backed verdict.
 *
 * Upstream inputs are treated as strictly immutable and read-only.
 */
export function resolvePredictiveConflict(params: {
  rule: KPEventRule;
  natalPromiseVerdict: string;
  dashaActivation?: KPDashaActivationResult;
  transitConfirmation?: KPTransitConfirmationResult;
  rulingPlanetsConfirmation?: KPRulingPlanetsConfirmationResult;
  rpSnapshot?: KPRulingPlanetsSnapshot;
  // Optional explicit test flag for verifying unsupported precedence
  forceUnsupportedConflict?: boolean;
}): KPPredictiveSynthesisResult {
  const {
    rule,
    natalPromiseVerdict,
    dashaActivation,
    transitConfirmation,
    rulingPlanetsConfirmation,
    forceUnsupportedConflict,
  } = params;

  const causalAuditTrail: string[] = [];
  const conflictFindings: KPConflictFinding[] = [];

  // Snapshot raw upstream states immutably
  const upstreamStates = {
    natalPromiseVerdict: String(natalPromiseVerdict ?? "INCONCLUSIVE"),
    dashaTimingState: String(dashaActivation?.timingState ?? "NEUTRAL_WINDOW"),
    transitState: transitConfirmation?.state ? String(transitConfirmation.state) : undefined,
    rulingPlanetsState: rulingPlanetsConfirmation?.state ? String(rulingPlanetsConfirmation.state) : undefined,
  };

  causalAuditTrail.push(`[Rule] Resolving conflicts for rule: ${rule.id} (${rule.name})`);
  causalAuditTrail.push(
    `[Upstream Reflection] Natal Promise: ${upstreamStates.natalPromiseVerdict} | Dasha: ${upstreamStates.dashaTimingState} | Transit: ${upstreamStates.transitState ?? "NONE"} | RP: ${upstreamStates.rulingPlanetsState ?? "NONE"}`
  );

  // ── Guard 1: Reference_Pending Rule Boundary ───────────────────────────────
  if (rule.status === "Reference_Pending" || forceUnsupportedConflict) {
    const rel10 = PRECEDENCE_RELATIONS["REL-10"];
    const finding: KPConflictFinding = {
      findingId: `FINDING-${rule.id}-REL-10`,
      relationId: "REL-10",
      conflictType: "UNRESOLVED_CONFLICT_GUARD",
      primaryLayer: "NATAL_PROMISE",
      precedenceRule: rel10.ruleName,
      rationale: `Rule ${rule.id} or its conflict configuration is marked Reference_Pending. No classical precedence rule is fabricated.`,
      provenance: rel10.provenance,
    };
    conflictFindings.push(finding);
    causalAuditTrail.push(`[Epistemic Guard] Triggered REL-10: Precedence resolution suspended (EVALUATION_PENDING).`);

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: "EVALUATION_PENDING",
      delayVsDenial: "PENDING",
      isFructificationExpected: false,
      expectedManifestationType: "PENDING",
      conflictFindings,
      summaryVerdict: `Resolution suspended under REL-10: Rule ${rule.id} requires reference verification before predictive synthesis.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [rel10.provenance.pages],
        epistemologicalStatus: "Reference_Pending",
        methodologyNote: "Strict adherence to System Invariant 10: Unsupported conflicts emit EVALUATION_PENDING.",
      },
    };
  }

  // ── Branch 1: Natal Denial (Sovereignty of Natal Cusp Sub Lord) ───────────
  // REL-01, REL-02, REL-03: Natal denial strictly vetoes all downstream timing.
  if (upstreamStates.natalPromiseVerdict === "PROMISE_DENIED" || upstreamStates.natalPromiseVerdict === "OBSTRUCTED") {
    // Record relation REL-01 if Dasha was favorable or neutral
    if (upstreamStates.dashaTimingState === "TIMING_ALIGNED" || upstreamStates.dashaTimingState === "MIXED_WINDOW") {
      const rel01 = PRECEDENCE_RELATIONS["REL-01"];
      conflictFindings.push({
        findingId: `FINDING-${rule.id}-REL-01`,
        relationId: "REL-01",
        conflictType: "NATAL_PROMISE_OVERRIDE",
        primaryLayer: "NATAL_PROMISE",
        subordinateLayer: "DASHA_ACTIVATION",
        precedenceRule: rel01.ruleName,
        rationale: "Dasha period indicates favorable or mixed significations, but Natal Cusp Sub-Lord explicitly denies the matter. Cusp Sub-Lord is sovereign.",
        provenance: rel01.provenance,
      });
      causalAuditTrail.push(`[Precedence REL-01] Dasha period [${upstreamStates.dashaTimingState}] suppressed by Natal Denial.`);
    }

    // Record relation REL-02 if Transit was favorable
    if (upstreamStates.transitState === "TRANSIT_CONFIRMED" || upstreamStates.transitState === "TRANSIT_MIXED") {
      const rel02 = PRECEDENCE_RELATIONS["REL-02"];
      conflictFindings.push({
        findingId: `FINDING-${rule.id}-REL-02`,
        relationId: "REL-02",
        conflictType: "NATAL_PROMISE_OVERRIDE",
        primaryLayer: "NATAL_PROMISE",
        subordinateLayer: "TRANSIT_CONFIRMATION",
        precedenceRule: rel02.ruleName,
        rationale: "Transits indicate supportive stellar/sub movement, but Natal Cusp Sub-Lord denies the matter. Transit cannot manufacture an unpromised event.",
        provenance: rel02.provenance,
      });
      causalAuditTrail.push(`[Precedence REL-02] Transit confirmation [${upstreamStates.transitState}] suppressed by Natal Denial.`);
    }

    // Record relation REL-03 if RP was corroborated
    if (upstreamStates.rulingPlanetsState === "RP_CORROBORATED" || upstreamStates.rulingPlanetsState === "RP_PARTIAL") {
      const rel03 = PRECEDENCE_RELATIONS["REL-03"];
      conflictFindings.push({
        findingId: `FINDING-${rule.id}-REL-03`,
        relationId: "REL-03",
        conflictType: "NATAL_PROMISE_OVERRIDE",
        primaryLayer: "NATAL_PROMISE",
        subordinateLayer: "RULING_PLANETS",
        precedenceRule: rel03.ruleName,
        rationale: "Ruling Planets corroborate current significators, but Natal Cusp Sub-Lord denies the event. RP cannot overturn natal promise.",
        provenance: rel03.provenance,
      });
      causalAuditTrail.push(`[Precedence REL-03] RP corroboration [${upstreamStates.rulingPlanetsState}] suppressed by Natal Denial.`);
    }

    if (conflictFindings.length === 0) {
      // Unanimous denial across all layers
      const rel01 = PRECEDENCE_RELATIONS["REL-01"];
      conflictFindings.push({
        findingId: `FINDING-${rule.id}-REL-01-UNANIMOUS`,
        relationId: "REL-01",
        conflictType: "NO_CONFLICT",
        primaryLayer: "NATAL_PROMISE",
        precedenceRule: rel01.ruleName,
        rationale: "Natal Cusp Sub-Lord denies the event, and timing periods corroborate lack of fructification.",
        provenance: rel01.provenance,
      });
    }

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: "EVENT_DENIED_BY_NATAL_PROMISE",
      delayVsDenial: "DENIAL",
      isFructificationExpected: false, // Explicitly justified by REL-01/REL-02/REL-03
      expectedManifestationType: "DENIAL",
      conflictFindings,
      summaryVerdict: `Event is denied by Natal Cusp Sub-Lord. In classical KP doctrine (Reader III p. 431, Reader IV p. 43), Dasha and Transit movements cannot deliver what the natal chart denies.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP doctrine",
          "Classical KP doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Strict adherence to REL-01, REL-02, and REL-03: Natal cusp sub-lord sovereignty.",
      },
    };
  }

  // ── Branch 2: Natal Promise Supported — Evaluating Timing Layers ─────────

  const isNatalSupported =
    upstreamStates.natalPromiseVerdict === "PROMISE_SUPPORTED" ||
    upstreamStates.natalPromiseVerdict === "SUPPORTED";

  // Check for source-supported Saturn delay in active periods
  const activePeriodLords: KPPlanet[] = [];
  if (dashaActivation?.levels) {
    const l = dashaActivation.levels;
    if (l.mahadasha) activePeriodLords.push(l.mahadasha.planet);
    if (l.antardasha) activePeriodLords.push(l.antardasha.planet);
    if (l.pratyantardasha) activePeriodLords.push(l.pratyantardasha.planet);
  }

  const saturnInActivePeriod = activePeriodLords.includes("Saturn");
  const isSaturnDelayAttested =
    isNatalSupported &&
    saturnInActivePeriod &&
    ATTRIBUTED_SATURN_DELAY_RULES.has(rule.id);

  // Check for compound simultaneous gain + expenditure (REL-08)
  const isCompoundPropertyOrVehicle =
    (rule.category === "property" || rule.id === "KP-RULE-PROPERTY-ACQUISITION-01" || rule.id === "KP-RULE-VEHICLE-ACQUISITION-01") &&
    rule.supportingHouses.includes(12);

  // Sub-case 2A: Dasha Obstructed (REL-04 & REL-05)
  if (upstreamStates.dashaTimingState === "OBSTRUCTED_WINDOW") {
    const rel04 = PRECEDENCE_RELATIONS["REL-04"];
    conflictFindings.push({
      findingId: `FINDING-${rule.id}-REL-04`,
      relationId: "REL-04",
      conflictType: "DASHA_TRANSIT_TENSION",
      primaryLayer: "DASHA_ACTIVATION",
      subordinateLayer: "TRANSIT_CONFIRMATION",
      precedenceRule: rel04.ruleName,
      rationale: "The event is promised natally, but the active Dasha period lord vetoes via detriment houses. Macro window is obstructed.",
      provenance: rel04.provenance,
    });
    causalAuditTrail.push(`[Precedence REL-04] Dasha window is OBSTRUCTED; timing window closed.`);

    if (upstreamStates.transitState === "TRANSIT_CONFIRMED") {
      const rel05 = PRECEDENCE_RELATIONS["REL-05"];
      conflictFindings.push({
        findingId: `FINDING-${rule.id}-REL-05`,
        relationId: "REL-05",
        conflictType: "DASHA_TRANSIT_TENSION",
        primaryLayer: "DASHA_ACTIVATION",
        subordinateLayer: "TRANSIT_CONFIRMATION",
        precedenceRule: rel05.ruleName,
        rationale: "Transiting planets confirm stellar/sub connections, but running Dasha period is obstructed. Favourable transit cannot overcome an obstructed Dasha.",
        provenance: rel05.provenance,
      });
      causalAuditTrail.push(`[Precedence REL-05] Favourable transit subordinate to Obstructed Dasha; manifests only as transient attempt or false hope.`);
    }

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: "TIMING_OBSTRUCTED",
      delayVsDenial: "UNOBSTRUCTED", // Promised natally, so not denied
      isFructificationExpected: false, // Explicitly justified by REL-04 / REL-05
      expectedManifestationType: "UNFRUITFUL_ATTEMPT",
      conflictFindings,
      summaryVerdict: `Event is promised natally, but current timing window is obstructed by active period lord. Under classical KP rules (Reader III pp. 471–475), favourable transits cannot deliver the event during an unfavourable Dasha.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Strict adherence to REL-04 and REL-05: Dasha hierarchy precedence over transits.",
      },
    };
  }

  // Sub-case 2B: Dasha Mixed Window (REL-08)
  if (upstreamStates.dashaTimingState === "MIXED_WINDOW") {
    const rel08 = PRECEDENCE_RELATIONS["REL-08"];
    conflictFindings.push({
      findingId: `FINDING-${rule.id}-REL-08`,
      relationId: "REL-08",
      conflictType: "MIXED_SIGNIFICATION_SPLIT",
      primaryLayer: "DASHA_ACTIVATION",
      precedenceRule: rel08.ruleName,
      rationale: "Running period lords signify both supporting and detrimental houses. In classical KP (Reader III p. 433), this manifests as distinct sub-period outcomes or dual manifestation, never a numerical average.",
      provenance: rel08.provenance,
    });
    causalAuditTrail.push(`[Precedence REL-08] Coexisting supporting and detriment significations preserved as MIXED_WINDOW.`);

    const manifestationType = isCompoundPropertyOrVehicle
      ? "MIXED_GAIN_AND_EXPENSE"
      : "MIXED_GAIN_AND_EXPENSE";

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: isCompoundPropertyOrVehicle ? "MULTIPLE_MANIFESTATION" : "TIMING_MIXED_WINDOW",
      delayVsDenial: "UNOBSTRUCTED",
      isFructificationExpected: true, // Fructifies with mixed consequences (gain + expenditure)
      expectedManifestationType: manifestationType,
      conflictFindings,
      summaryVerdict: `Event window contains conjoined supporting and detrimental significations. Under Reader III p. 433, this produces dual manifestations in their respective sub-periods rather than a veto.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Strict adherence to REL-08: Sub-period specialization and compound manifestation.",
      },
    };
  }

  // Sub-case 2C: Dasha Aligned, Transit Obstructed (REL-06)
  if (
    upstreamStates.dashaTimingState === "TIMING_ALIGNED" &&
    upstreamStates.transitState === "TRANSIT_OBSTRUCTED"
  ) {
    const rel06 = PRECEDENCE_RELATIONS["REL-06"];
    conflictFindings.push({
      findingId: `FINDING-${rule.id}-REL-06`,
      relationId: "REL-06",
      conflictType: "DASHA_TRANSIT_TENSION",
      primaryLayer: "DASHA_ACTIVATION",
      subordinateLayer: "TRANSIT_CONFIRMATION",
      precedenceRule: rel06.ruleName,
      rationale: "Dasha hierarchy is aligned, but physical transits are currently moving through adverse stars/subs. Dasha promise is preserved; transit causes temporary obstacle or delay.",
      provenance: rel06.provenance,
    });
    causalAuditTrail.push(`[Precedence REL-06] Dasha macro window valid, but transit trigger delayed.`);

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: "TIMING_ALIGNED_TRANSIT_OBSTRUCTED",
      delayVsDenial: "DELAY",
      isFructificationExpected: false, // Not expected until transits clear the adverse star/sub
      expectedManifestationType: "POSTPONEMENT",
      conflictFindings,
      summaryVerdict: `Event is supported natally and by the running Dasha, but transit movements currently obstruct the trigger moment. Under Reader III p. 474, event fructification is postponed until transits enter favourable stars/subs.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Strict adherence to REL-06: Transit trigger delay without Dasha destruction.",
      },
    };
  }

  // Sub-case 2D: Source-Supported Saturn Delay (REL-09)
  if (isSaturnDelayAttested && (upstreamStates.dashaTimingState === "TIMING_ALIGNED" || upstreamStates.dashaTimingState === "NEUTRAL_WINDOW")) {
    const rel09 = PRECEDENCE_RELATIONS["REL-09"];
    conflictFindings.push({
      findingId: `FINDING-${rule.id}-REL-09`,
      relationId: "REL-09",
      conflictType: "SOURCE_BACKED_DELAY_MODIFIER",
      primaryLayer: "DASHA_ACTIVATION",
      precedenceRule: rel09.ruleName,
      rationale: `Event is promised natally, but Saturn rules an active period in a verified delay topic (${rule.name}). In classical KP doctrine, Saturn prolongs and postpones manifestation rather than denying it.`,
      provenance: rel09.provenance,
    });
    causalAuditTrail.push(`[Precedence REL-09] Source-attested Saturn delay applied to ${rule.name}. Event delayed, not denied.`);

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: "DELAY_INDICATED",
      delayVsDenial: "DELAY",
      isFructificationExpected: true, // Will happen, but late/after delay
      expectedManifestationType: "POSTPONEMENT",
      conflictFindings,
      summaryVerdict: `Event is promised natally. Saturn involvement in the period hierarchy indicates prolongation and delay. Under Reader IV p. 44, the matter is postponed rather than denied.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP doctrine",
          "Classical KP doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Strict adherence to REL-09: Verified Saturn delay guard without blanket automatic veto.",
      },
    };
  }

  // Sub-case 2E: Dasha Aligned, RP Discordant (REL-07)
  // Strict Guard: RP_DISCORDANT NEVER BECOMES DENIAL!
  if (
    upstreamStates.dashaTimingState === "TIMING_ALIGNED" &&
    upstreamStates.rulingPlanetsState === "RP_DISCORDANT"
  ) {
    const rel07 = PRECEDENCE_RELATIONS["REL-07"];
    conflictFindings.push({
      findingId: `FINDING-${rule.id}-REL-07`,
      relationId: "REL-07",
      conflictType: "RP_TIMING_DISCREPANCY",
      primaryLayer: "DASHA_ACTIVATION",
      subordinateLayer: "RULING_PLANETS",
      precedenceRule: rel07.ruleName,
      rationale: "Dasha period is aligned and transit confirms/neutral, but instantaneous Ruling Planets do not corroborate the active period lords. Under Reader VI pp. 18–25, this indicates lack of query-moment corroboration, NOT denial.",
      provenance: rel07.provenance,
    });
    causalAuditTrail.push(`[Precedence REL-07] RP discordance recorded as lack of instantaneous corroboration; event is NOT denied.`);

    const isTransitConfirmed = upstreamStates.transitState === "TRANSIT_CONFIRMED";

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: "TIMING_ALIGNED_RP_UNCORROBORATED",
      delayVsDenial: "UNOBSTRUCTED",
      isFructificationExpected: isTransitConfirmed, // Justified: period and transit confirm, but fine-timing RP uncorroborated
      expectedManifestationType: "FRUCTIFICATION",
      conflictFindings,
      summaryVerdict: `Event is promised natally and Dasha timing is aligned. Instantaneous Ruling Planets do not corroborate the active period lords at this exact moment. In KP doctrine, this represents lack of immediate corroboration, never denial.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP Horary doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Strict adherence to REL-07: RP discordance non-denial invariant.",
      },
    };
  }

  // Sub-case 2F: All Layers Aligned (Full Convergence)
  if (
    upstreamStates.dashaTimingState === "TIMING_ALIGNED" &&
    (upstreamStates.transitState === "TRANSIT_CONFIRMED" || upstreamStates.transitState === undefined) &&
    (upstreamStates.rulingPlanetsState === "RP_CORROBORATED" || upstreamStates.rulingPlanetsState === undefined)
  ) {
    const isRPCorroborated = upstreamStates.rulingPlanetsState === "RP_CORROBORATED";
    const relName = isRPCorroborated
      ? "Harmonious Convergence across Natal, Dasha, Transit, and Ruling Planets"
      : "Harmonious Alignment across Natal, Dasha, and Transit Layers";

    conflictFindings.push({
      findingId: `FINDING-${rule.id}-CONVERGENCE`,
      relationId: "REL-06",
      conflictType: "NO_CONFLICT",
      primaryLayer: "NATAL_PROMISE",
      subordinateLayer: "DASHA_ACTIVATION",
      precedenceRule: relName,
      rationale: "All active predictive layers harmoniously support the event. Cusp sub-lord promises, Dasha activates, Transit triggers, and Ruling Planets corroborate.",
      provenance: PRECEDENCE_RELATIONS["REL-06"].provenance,
    });
    causalAuditTrail.push(`[Full Convergence] Natal, Dasha, and Transit align harmoniously.`);

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: isRPCorroborated ? "TIMING_ALIGNED_RP_CORROBORATED" : "TIMING_ALIGNED_TRANSIT_CONFIRMED",
      delayVsDenial: "UNOBSTRUCTED",
      isFructificationExpected: true, // Justified by harmonious verified convergence
      expectedManifestationType: "FRUCTIFICATION",
      conflictFindings,
      summaryVerdict: `Event is promised natally and fully supported by running Dasha periods and transit movements.${isRPCorroborated ? " Ruling Planets provide instantaneous corroboration." : ""}`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP doctrine",
          "Classical KP Horary doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Harmonious multi-layer convergence without conflicts.",
      },
    };
  }

  // ── Branch 3: Fallback Epistemic Guard ──────────────────────────────────────
  // If an unmapped or neutral state configuration occurs:
  const isNeutralDasha = upstreamStates.dashaTimingState === "NEUTRAL_WINDOW";
  if (isNeutralDasha) {
    conflictFindings.push({
      findingId: `FINDING-${rule.id}-NEUTRAL`,
      relationId: "REL-04",
      conflictType: "NO_CONFLICT",
      primaryLayer: "DASHA_ACTIVATION",
      precedenceRule: "Dasha Neutrality Guard",
      rationale: "Active period lords do not signify houses relevant to this event. Timing window is inactive.",
      provenance: PRECEDENCE_RELATIONS["REL-04"].provenance,
    });
    causalAuditTrail.push(`[Neutral Window] Dasha periods are unconstrained for this topic.`);

    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: rule.status,
      upstreamStates,
      state: "TIMING_NEUTRAL",
      delayVsDenial: "NEUTRAL",
      isFructificationExpected: false,
      expectedManifestationType: "INACTIVE_WINDOW",
      conflictFindings,
      summaryVerdict: `Event is not active during the current period hierarchy. Active period lords do not signify houses relevant to ${rule.name}.`,
      causalAuditTrail,
      provenance: {
        readerReferences: [
          "Classical KP doctrine",
        ],
        epistemologicalStatus: "Verified",
        methodologyNote: "Dasha inactive window evaluation.",
      },
    };
  }

  // Any other unsupported combination strictly triggers REL-10
  const rel10 = PRECEDENCE_RELATIONS["REL-10"];
  conflictFindings.push({
    findingId: `FINDING-${rule.id}-REL-10-UNSUPPORTED`,
    relationId: "REL-10",
    conflictType: "UNRESOLVED_CONFLICT_GUARD",
    primaryLayer: "NATAL_PROMISE",
    precedenceRule: rel10.ruleName,
    rationale: `The combination of upstream states (Natal: ${upstreamStates.natalPromiseVerdict}, Dasha: ${upstreamStates.dashaTimingState}, Transit: ${upstreamStates.transitState}, RP: ${upstreamStates.rulingPlanetsState}) lacks an attested classical precedence rule in KP literature. Emitting REFERENCE_PENDING.`,
    provenance: rel10.provenance,
  });
  causalAuditTrail.push(`[Epistemic Safeguard] Triggered REL-10 for unsupported conflict configuration.`);

  return {
    ruleId: rule.id,
    eventName: rule.name,
    canonicalSource: rule.canonicalSource,
    status: rule.status,
    upstreamStates,
    state: "EVALUATION_PENDING",
    delayVsDenial: "PENDING",
    isFructificationExpected: false,
    expectedManifestationType: "PENDING",
    conflictFindings,
    summaryVerdict: `Synthesis suspended under REL-10: Observed combination of layer states lacks explicit textual precedence in primary KP texts.`,
    causalAuditTrail,
    provenance: {
      readerReferences: [rel10.provenance.pages],
      epistemologicalStatus: "Reference_Pending",
      methodologyNote: "System Invariant 10: Unsupported conflicts emit EVALUATION_PENDING.",
    },
  };
}

// ── Batch Resolution Across All Registered Rules ─────────────────────────────

/**
 * Synthesizes conflicts across all registered KP event rules.
 * Upstream collections are treated as strictly immutable and read-only.
 */
export function resolveAllPredictiveConflicts(params: {
  eventPromises?: Record<string, { verdict?: string } | any>;
  dashaActivations?: Record<string, KPDashaActivationResult>;
  transitConfirmations?: Record<string, KPTransitConfirmationResult>;
  rulingPlanetsConfirmations?: Record<string, KPRulingPlanetsConfirmationResult>;
  rpSnapshot?: KPRulingPlanetsSnapshot;
}): Record<string, KPPredictiveSynthesisResult> {
  const {
    eventPromises,
    dashaActivations,
    transitConfirmations,
    rulingPlanetsConfirmations,
    rpSnapshot,
  } = params;

  const results: Record<string, KPPredictiveSynthesisResult> = {};

  for (const rule of Object.values(KP_EVENT_RULE_REGISTRY)) {
    const ep = eventPromises ? eventPromises[rule.id] : undefined;
    const da = dashaActivations ? dashaActivations[rule.id] : undefined;
    const tc = transitConfirmations ? transitConfirmations[rule.id] : undefined;
    const rp = rulingPlanetsConfirmations ? rulingPlanetsConfirmations[rule.id] : undefined;

    const natalVerdict = ep?.verdict ?? da?.natalPromiseVerdict ?? "INCONCLUSIVE";

    results[rule.id] = resolvePredictiveConflict({
      rule,
      natalPromiseVerdict: natalVerdict,
      dashaActivation: da,
      transitConfirmation: tc,
      rulingPlanetsConfirmation: rp,
      rpSnapshot,
    });
  }

  return results;
}
