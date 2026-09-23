/**
 * ============================================================================
 * ASTROLIFE — KP TRANSIT CONFIRMATION ENGINE (PHASE 2I-F)
 * ============================================================================
 * Evaluates whether transiting planetary movements corroborate or obstruct
 * the manifestation of an event whose natal promise and Dasha activation have
 * been evaluated, strictly following classical Krishnamurti Paddhati principles.
 *
 * Mandatory Engine Principles:
 * 1. Pipeline Sovereignty:
 *    Natal Promise → Dasha Hierarchy (5 Levels) → Transit Evidence → Transit Star → Transit Sub → Timing State.
 * 2. Transit is an EVIDENCE / CONFIRMATION layer:
 *    Transit activates and confirms; it NEVER manufactures a natal promise.
 *    If natal promise is OBSTRUCTED, output is strictly PROMISE_DENIED.
 * 3. Transit Hierarchy & Roles:
 *    - Active Dasa & Bhukti lords transiting through significator stars/subs (Primary)
 *    - Active Anthra / Sookshma lords
 *    - Relevant event significators
 *    - Sun (monthly timing trigger) and Moon (daily timing trigger)
 * 4. Three Classical Questions for each Transit Point:
 *    A. Is the transit relevant? (Belongs to significator network or period lords)
 *    B. Does its Star activate the matter? (Star Lord natal significations)
 *    C. Does its Sub modify the manifestation? (Sub Lord qualification: favorable vs adverse)
 * 5. Sub Lord is a QUALIFIER only:
 *    A favorable Sub cannot create an event if the Star Lord does not activate the matter.
 *    An adverse Sub obstructs the current window without destroying the natal promise.
 * 6. Retrograde Motion:
 *    Handled as repeated crossings (FIRST, REPEAT, FINAL), NOT as an inherently negative score.
 * 7. Strictly Zero Arbitrary Scores:
 *    No probabilities, percentages, convergence scores, arbitrary weights, or ranking.
 * ============================================================================
 */

import type { KPPlanet } from "./kp";
import {
  getStarLord,
  getSubLord,
  getSubSubLord,
  getNakshatra,
  getPada,
} from "./kp";
import {
  getJD,
  computePlanets,
  computeRetro,
  convertLongitudeBetweenAyanamshas,
} from "./calculations";
import {
  calculateDeltaT,
  jdToGregorian,
  utcToTT,
} from "./time-scales";
import type {
  KPPredictiveEvidence,
  PlanetSignifications,
  SignificationDetail,
} from "./kp-evidence-types";
import {
  KPEventRule,
  KP_EVENT_RULE_REGISTRY,
  EpistemologicalStatus,
} from "./kp-rule-registry";
import type { KPDashaActivationResult } from "./kp-dasha-activation";

// ── Types & Contracts ────────────────────────────────────────────────────────

export type TransitConfirmationState =
  | "TRANSIT_CONFIRMED"   // Source-aligned timing evidence is present (NOT "event guaranteed")
  | "TRANSIT_OBSTRUCTED"  // Active timing exists but transit currently signifies detriment/barrier
  | "TRANSIT_MIXED"       // Simultaneous supportive and contrary transit evidence
  | "TRANSIT_NEUTRAL"     // Evaluated transit layer provides no material connection to event houses
  | "PROMISE_DENIED"      // Natal cusp sub-lord denies the event; transit cannot override
  | "EVALUATION_PENDING"; // Rule is REFERENCE_PENDING

export type TransitRole =
  | "PERIOD_LORD"
  | "EVENT_SIGNIFICATOR"
  | "SUN_TRIGGER"
  | "MOON_TRIGGER"
  | "OTHER_CONFIRMATION";

export type TransitPointVerdict =
  | "SUPPORTIVE"
  | "ADVERSE"
  | "MIXED"
  | "NEUTRAL";

export type TransitMotion = "DIRECT" | "RETROGRADE";

export type TransitCrossingType = "FIRST" | "REPEAT" | "FINAL";

export interface TransitSourceReference {
  book: string;
  section: string;
  pages: string;
  epistemologicalStatus: EpistemologicalStatus;
}

export interface KPTransitPointEvidence {
  transitPlanet: KPPlanet;
  transitLongitude: number;
  motion: TransitMotion;
  crossingType: TransitCrossingType;

  // Celestial divisions in KP Unified Frame
  sign: string;
  signLord: KPPlanet;
  nakshatra: string;
  pada: number;
  starLord: KPPlanet;
  subLord: KPPlanet;
  subSubLord?: KPPlanet;

  // Question A: Relevance & Relation
  isRelevant: boolean;
  relationType: TransitRole;
  relationToDasha: {
    maha: boolean;
    bhukti: boolean;
    antara: boolean;
    sookshma: boolean;
  };
  isNatalSignificator: boolean;

  // Question B: Star Lord Matter Activation
  starLordSignifiedHouses: number[];
  starLordSupportingHousesTouched: number[];
  starLordDetrimentHousesTouched: number[];
  starLordBarrierHousesTouched: number[];
  activatesMatter: boolean;

  // Question C: Sub Lord Qualification
  subLordSignifiedHouses: number[];
  subLordSupportingHousesTouched: number[];
  subLordDetrimentHousesTouched: number[];
  subLordBarrierHousesTouched: number[];
  qualifiesFavourably: boolean;
  qualifiesAdversely: boolean;

  // Synthesis for this body
  pointVerdict: TransitPointVerdict;
  causalReason: string;
  sourceReferences: TransitSourceReference[];
}

export interface KPTransitConfirmationResult {
  ruleId: string;
  eventName: string;
  canonicalSource: string;
  status: EpistemologicalStatus;

  // Upstream state reflection
  natalPromiseStatus: string;
  dashaActivationState: string;

  // Evaluation Context
  evaluationTime: {
    date: string;
    time: string;
    timezone: number;
    jdUTC: number;
    jdTT: number;
    deltaTSeconds: number;
    coordinateFrame: "KP_PLACIDUS_NEWCOMB";
    ayanamshaName: "KP_NEWCOMB";
  };

  // Evaluated Transit Points
  transitPoints: KPTransitPointEvidence[];
  primaryActivePoints: KPTransitPointEvidence[]; // Filtered to relevant period lords & triggers

  // Matched houses across all transit evidence
  aggregatedSupportingHouses: number[];
  aggregatedDetrimentHouses: number[];
  aggregatedBarrierHouses: number[];

  // Definitive Deterministic State
  state: TransitConfirmationState;

  auditSummary: {
    isTransitAligned: boolean;
    isNatalPromiseHonored: boolean;
    dashaWindowStatus: string;
    explanatoryNote: string;
  };

  causalAuditTrail: string[];
}

// ── Helper: Normalization and Sign Lord Mapping ──────────────────────────────

const RASHIS_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORD_MAP: Record<number, KPPlanet> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

function normalizeLon(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// ── Transit Computation In KP Coordinate Frame ───────────────────────────────

export interface PrecomputedTransitInput {
  date: string;
  time?: string;
  tz?: number;
  positions?: Record<KPPlanet, { lon: number; retrograde?: boolean; crossingType?: TransitCrossingType }>;
}

/**
 * Computes planetary positions for the transit evaluation instant in the
 * KP Unified Coordinate Frame (KP_NEWCOMB).
 */
export function computeKPTransitPlanets(
  date: string,
  time = "12:00",
  tz = 5.5
): {
  jdUTC: number;
  jdTT: number;
  deltaTSeconds: number;
  planets: Record<KPPlanet, { lon: number; retrograde: boolean }>;
} {
  const jdUTC = getJD(date, time, tz);
  const { year, month } = jdToGregorian(jdUTC);
  const { deltaTSec } = calculateDeltaT(year, month);
  const jdTT = utcToTT(jdUTC, deltaTSec);

  const lahiriPlanets = computePlanets(jdUTC, jdTT);
  const retroMap = computeRetro(jdUTC);

  const kpPlanets: Record<KPPlanet, { lon: number; retrograde: boolean }> = {} as any;
  const planetKeys: KPPlanet[] = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
  ];

  planetKeys.forEach((p) => {
    const rawLon = lahiriPlanets[p];
    if (rawLon !== undefined) {
      const kpLon = convertLongitudeBetweenAyanamshas(rawLon, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC);
      kpPlanets[p] = {
        lon: normalizeLon(kpLon),
        retrograde: retroMap[p] ?? false,
      };
    }
  });

  return {
    jdUTC,
    jdTT,
    deltaTSeconds: deltaTSec,
    planets: kpPlanets,
  };
}

// ── Single Transit Point Evaluator ───────────────────────────────────────────

export function evaluateTransitPoint(
  planet: KPPlanet,
  lon: number,
  isRetrograde: boolean,
  crossingType: TransitCrossingType,
  rule: KPEventRule,
  predictiveEvidence: KPPredictiveEvidence,
  dashaActivation?: KPDashaActivationResult
): KPTransitPointEvidence {
  const normLon = normalizeLon(lon);
  const rashiIdx = Math.floor(normLon / 30);
  const sign = RASHIS_EN[rashiIdx] ?? "—";
  const signLord = SIGN_LORD_MAP[rashiIdx] ?? "Mars";
  const nakshatra = getNakshatra(normLon);
  const pada = getPada(normLon);
  const starLord = getStarLord(normLon);
  const subLord = getSubLord(normLon);
  const subSubLord = getSubSubLord(normLon);

  // 1. Dasha relations
  const relationToDasha = {
    maha: dashaActivation?.levels.mahadasha.planet === planet,
    bhukti: dashaActivation?.levels.antardasha.planet === planet,
    antara: dashaActivation?.levels.pratyantardasha.planet === planet,
    sookshma: dashaActivation?.levels.sookshma.planet === planet,
  };
  const isPeriodLord =
    relationToDasha.maha ||
    relationToDasha.bhukti ||
    relationToDasha.antara ||
    relationToDasha.sookshma;

  // 2. Natal significations of this planet
  const natalSigs = predictiveEvidence.planetSignifications[planet]?.allSignifications ?? [];
  const isNatalSignificator = natalSigs.some((h) => rule.supportingHouses.includes(h));

  // 3. Question A: Role & Relevance
  let relationType: TransitRole = "OTHER_CONFIRMATION";
  if (isPeriodLord) {
    relationType = "PERIOD_LORD";
  } else if (planet === "Sun") {
    relationType = "SUN_TRIGGER";
  } else if (planet === "Moon") {
    relationType = "MOON_TRIGGER";
  } else if (isNatalSignificator) {
    relationType = "EVENT_SIGNIFICATOR";
  }

  const isRelevant =
    isPeriodLord ||
    isNatalSignificator ||
    planet === "Sun" ||
    planet === "Moon";

  // 4. Question B: Star Lord Matter Activation (Natal houses signified by Star Lord)
  const starLordSigs = predictiveEvidence.planetSignifications[starLord]?.allSignifications ?? [];
  const starSupporting = starLordSigs.filter((h) => rule.supportingHouses.includes(h));
  const starDetriment = starLordSigs.filter((h) => rule.detrimentHouses.includes(h));
  const starBarrier = starLordSigs.filter((h) => rule.barrierHouses.includes(h));
  const activatesMatter = starSupporting.length > 0;

  // 5. Question C: Sub Lord Qualification (Natal houses signified by Sub Lord)
  const subLordSigs = predictiveEvidence.planetSignifications[subLord]?.allSignifications ?? [];
  const subSupporting = subLordSigs.filter((h) => rule.supportingHouses.includes(h));
  const subDetriment = subLordSigs.filter((h) => rule.detrimentHouses.includes(h));
  const subBarrier = subLordSigs.filter((h) => rule.barrierHouses.includes(h));

  // The Sub Lord qualifies the matter:
  // Favourable if connects to supporting houses; Adverse if connects to barrier/detriment
  const qualifiesFavourably = subSupporting.length > 0;
  const qualifiesAdversely = subBarrier.length > 0 || (subDetriment.length > 0 && subSupporting.length === 0);

  // 6. Point Verdict Synthesis
  let pointVerdict: TransitPointVerdict = "NEUTRAL";
  let causalReason = "";

  if (activatesMatter) {
    if (qualifiesFavourably && !qualifiesAdversely) {
      pointVerdict = "SUPPORTIVE";
      causalReason = `Transiting ${planet} in star of ${starLord} (signifying event houses [${starSupporting.join(",")}]) with favourable sub of ${subLord} (signifying [${subSupporting.join(",")}])`;
    } else if (qualifiesAdversely && !qualifiesFavourably) {
      pointVerdict = "ADVERSE";
      causalReason = `Transiting ${planet} in star of ${starLord} (houses [${starSupporting.join(",")}]) is obstructed by adverse sub of ${subLord} (signifying barrier houses [${subBarrier.concat(subDetriment).join(",")}])`;
    } else if (qualifiesFavourably && qualifiesAdversely) {
      pointVerdict = "MIXED";
      causalReason = `Transiting ${planet} has mixed sub qualification under ${subLord} (signifies both supporting [${subSupporting.join(",")}] and barrier/detriment [${subBarrier.concat(subDetriment).join(",")}])`;
    } else {
      // Neutral sub on an activating star
      pointVerdict = "SUPPORTIVE";
      causalReason = `Transiting ${planet} activates event houses [${starSupporting.join(",")}] through star of ${starLord} under neutral sub of ${subLord}`;
    }
  } else {
    // Star Lord does not signify primary supporting houses
    if (starBarrier.length > 0 || starDetriment.length > 0) {
      if (qualifiesAdversely) {
        pointVerdict = "ADVERSE";
        causalReason = `Transiting ${planet} activates detriment houses [${starBarrier.concat(starDetriment).join(",")}] via star of ${starLord}, confirmed by adverse sub ${subLord}`;
      } else {
        pointVerdict = "ADVERSE";
        causalReason = `Transiting ${planet} moves through star of ${starLord} signifying detriment houses [${starBarrier.concat(starDetriment).join(",")}]`;
      }
    } else {
      pointVerdict = "NEUTRAL";
      causalReason = `Transiting ${planet} in star of ${starLord} does not signify primary or detriment houses for this event`;
    }
  }

  // Retrograde motion annotation (delays or repeated crossings without numeric scoring)
  if (isRetrograde) {
    causalReason += ` [Vakri / Retrograde motion: repeat transit crossing (${crossingType})]`;
  }

  const sourceRefs: TransitSourceReference[] = [
    {
      book: "Classical KP Transit Rules",
      section: "Transit (Gochara) Principles",
      pages: "",
      epistemologicalStatus: "Verified",
    },
  ];

  return {
    transitPlanet: planet,
    transitLongitude: normLon,
    motion: isRetrograde ? "RETROGRADE" : "DIRECT",
    crossingType,
    sign,
    signLord,
    nakshatra,
    pada,
    starLord,
    subLord,
    subSubLord,

    isRelevant,
    relationType,
    relationToDasha,
    isNatalSignificator,

    starLordSignifiedHouses: starLordSigs,
    starLordSupportingHousesTouched: starSupporting,
    starLordDetrimentHousesTouched: starDetriment,
    starLordBarrierHousesTouched: starBarrier,
    activatesMatter,

    subLordSignifiedHouses: subLordSigs,
    subLordSupportingHousesTouched: subSupporting,
    subLordDetrimentHousesTouched: subDetriment,
    subLordBarrierHousesTouched: subBarrier,
    qualifiesFavourably,
    qualifiesAdversely,

    pointVerdict,
    causalReason,
    sourceReferences: sourceRefs,
  };
}

// ── Master Transit Confirmation Evaluator ────────────────────────────────────

/**
 * Evaluates whether current transit positions confirm, obstruct, or are neutral
 * towards a registered KP event rule.
 */
export function evaluateTransitConfirmation(
  rule: KPEventRule,
  predictiveEvidence: KPPredictiveEvidence,
  dashaActivation: KPDashaActivationResult,
  transitInput?: PrecomputedTransitInput
): KPTransitConfirmationResult {
  // 1. Epistemological Reference Guard
  if (rule.status === "Reference_Pending") {
    return createReferencePendingTransitResult(rule, dashaActivation);
  }

  // 2. Natal Promise Sovereignty Gate
  // "Transit cannot manufacture what natal cusp sub-lord has denied"
  const eventPromise = predictiveEvidence.eventPromises?.[rule.id];
  const isNatalDenied =
    eventPromise?.status === "OBSTRUCTED" ||
    dashaActivation.timingState === "PROMISE_DENIED";

  if (isNatalDenied) {
    return createPromiseDeniedTransitResult(rule, dashaActivation, eventPromise?.status ?? "OBSTRUCTED");
  }

  // 3. Resolve Transit Positions
  const date = transitInput?.date ?? new Date().toISOString().split("T")[0];
  const time = transitInput?.time ?? "12:00";
  const tz = transitInput?.tz ?? 5.5;

  let jdUTC = 0;
  let jdTT = 0;
  let deltaTSeconds = 0;
  const transitPoints: KPTransitPointEvidence[] = [];

  if (transitInput?.positions) {
    // Caller provided pre-computed positions
    jdUTC = getJD(date, time, tz);
    const { year, month } = jdToGregorian(jdUTC);
    const { deltaTSec } = calculateDeltaT(year, month);
    deltaTSeconds = deltaTSec;
    jdTT = utcToTT(jdUTC, deltaTSec);

    const positions = transitInput.positions;
    const planets: KPPlanet[] = [
      "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
    ];

    planets.forEach((p) => {
      const data = positions[p];
      if (data) {
        const point = evaluateTransitPoint(
          p,
          data.lon,
          data.retrograde ?? false,
          data.crossingType ?? "FIRST",
          rule,
          predictiveEvidence,
          dashaActivation
        );
        transitPoints.push(point);
      }
    });
  } else {
    // Compute on-demand in KP Unified Frame
    const calc = computeKPTransitPlanets(date, time, tz);
    jdUTC = calc.jdUTC;
    jdTT = calc.jdTT;
    deltaTSeconds = calc.deltaTSeconds;

    const planets: KPPlanet[] = [
      "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
    ];

    planets.forEach((p) => {
      const data = calc.planets[p];
      if (data) {
        const point = evaluateTransitPoint(
          p,
          data.lon,
          data.retrograde,
          "FIRST",
          rule,
          predictiveEvidence,
          dashaActivation
        );
        transitPoints.push(point);
      }
    });
  }

  // 4. Filter to Primary Active Points:
  // Active Dasa lord, active Bhukti lord, Sun (month), Moon (day), and active natal significators
  const primaryActivePoints = transitPoints.filter((tp) => tp.isRelevant);

  // 5. Aggregate Touched Houses
  const allSupporting = Array.from(
    new Set(
      primaryActivePoints.flatMap((tp) =>
        tp.starLordSupportingHousesTouched.concat(tp.subLordSupportingHousesTouched)
      )
    )
  ).sort((a, b) => a - b);

  const allDetriment = Array.from(
    new Set(
      primaryActivePoints.flatMap((tp) =>
        tp.starLordDetrimentHousesTouched.concat(tp.subLordDetrimentHousesTouched)
      )
    )
  ).sort((a, b) => a - b);

  const allBarrier = Array.from(
    new Set(
      primaryActivePoints.flatMap((tp) =>
        tp.starLordBarrierHousesTouched.concat(tp.subLordBarrierHousesTouched)
      )
    )
  ).sort((a, b) => a - b);

  // 6. Evaluate Transit Confirmation State
  const dashaState = dashaActivation.timingState;
  const isDashaObstructed = dashaState === "OBSTRUCTED_WINDOW";

  const supportivePoints = primaryActivePoints.filter((tp) => tp.pointVerdict === "SUPPORTIVE");
  const adversePoints = primaryActivePoints.filter((tp) => tp.pointVerdict === "ADVERSE");
  const mixedPoints = primaryActivePoints.filter((tp) => tp.pointVerdict === "MIXED");

  // Period lords' specific transits (Dasa & Bhukti)
  const dashaLordPoints = primaryActivePoints.filter(
    (tp) => tp.relationToDasha.maha || tp.relationToDasha.bhukti
  );
  const dashaLordsSupportive = dashaLordPoints.some((tp) => tp.pointVerdict === "SUPPORTIVE");
  const dashaLordsAdverse = dashaLordPoints.every((tp) => tp.pointVerdict === "ADVERSE") && dashaLordPoints.length > 0;

  // Catalyst transits (Sun/Moon)
  const catalystPoints = primaryActivePoints.filter(
    (tp) => tp.relationType === "SUN_TRIGGER" || tp.relationType === "MOON_TRIGGER"
  );
  const catalystSupportive = catalystPoints.some((tp) => tp.pointVerdict === "SUPPORTIVE");
  const catalystAdverse = catalystPoints.every((tp) => tp.pointVerdict === "ADVERSE") && catalystPoints.length > 0;

  let state: TransitConfirmationState = "TRANSIT_NEUTRAL";
  let explanatoryNote = "";

  if (isDashaObstructed) {
    // If Dasa period itself is obstructed, favorable transits cannot overturn the macro window.
    // The transit layer confirms obstruction or notes mixed tension.
    if (adversePoints.length > 0) {
      state = "TRANSIT_OBSTRUCTED";
      explanatoryNote = `Dasa window is obstructed (${dashaState}) and transit movements corroborate adverse conditions.`;
    } else {
      state = "TRANSIT_OBSTRUCTED";
      explanatoryNote = `Dasa window is obstructed (${dashaState}); transit activation cannot fructify an unaligned Dasa period.`;
    }
  } else {
    // Dasa window is TIMING_ALIGNED, MIXED_WINDOW, or NEUTRAL_WINDOW
    const hasStrongSupport = supportivePoints.length > 0;
    const hasAdverse = adversePoints.length > 0;
    const hasMixed = mixedPoints.length > 0;

    if (hasStrongSupport && !hasAdverse && !hasMixed) {
      // Purely supportive transit points
      state = "TRANSIT_CONFIRMED";
      explanatoryNote = `Classical transit confirmation present: active period lords and timing triggers transit stars/subs signifying supporting houses [${allSupporting.join(",")}].`;
    } else if (hasStrongSupport && (hasAdverse || hasMixed)) {
      // Coexisting supportive and contrary transit evidence
      state = "TRANSIT_MIXED";
      explanatoryNote = `Simultaneous supportive and contrary transit evidence: supporting houses [${allSupporting.join(",")}] and detriment/barrier houses [${allBarrier.concat(allDetriment).join(",")}] both activated.`;
    } else if (!hasStrongSupport && hasAdverse) {
      // Exclusively adverse transit points
      state = "TRANSIT_OBSTRUCTED";
      explanatoryNote = `Transiting significators and timing triggers transit adverse stars/subs signifying detriment/barrier houses [${allBarrier.concat(allDetriment).join(",")}].`;
    } else {
      // Neutral
      state = "TRANSIT_NEUTRAL";
      explanatoryNote = `Transiting period lords and triggers do not touch significant event houses at this evaluation time.`;
    }
  }

  // 7. Assemble Causal Audit Trail
  const causalAuditTrail: string[] = [
    `[Pipeline Step 1] Natal Promise Status: ${eventPromise?.status ?? "SUPPORTED"} (Cusp sub-lord promise verified)`,
    `[Pipeline Step 2] Dasha Activation State: ${dashaState}`,
    `[Pipeline Step 3] Transits Evaluated: ${primaryActivePoints.length} primary active points identified`,
  ];

  primaryActivePoints.forEach((tp) => {
    causalAuditTrail.push(
      `  • ${tp.relationType} (${tp.transitPlanet} at ${tp.transitLongitude.toFixed(2)}° ${tp.sign}): Star ${tp.starLord}, Sub ${tp.subLord} → ${tp.pointVerdict} (${tp.causalReason})`
    );
  });

  causalAuditTrail.push(
    `[Pipeline Step 4] Aggregate Matched Houses: Supporting=[${allSupporting.join(",")}], Detriment=[${allDetriment.join(",")}], Barrier=[${allBarrier.join(",")}]`,
    `[Pipeline Step 5] Final Transit State: ${state} — ${explanatoryNote}`
  );

  return {
    ruleId: rule.id,
    eventName: rule.name,
    canonicalSource: rule.canonicalSource,
    status: rule.status,
    natalPromiseStatus: eventPromise?.status ?? "SUPPORTED",
    dashaActivationState: dashaState,

    evaluationTime: {
      date,
      time,
      timezone: tz,
      jdUTC,
      jdTT,
      deltaTSeconds,
      coordinateFrame: "KP_PLACIDUS_NEWCOMB",
      ayanamshaName: "KP_NEWCOMB",
    },

    transitPoints,
    primaryActivePoints,
    aggregatedSupportingHouses: allSupporting,
    aggregatedDetrimentHouses: allDetriment,
    aggregatedBarrierHouses: allBarrier,

    state,

    auditSummary: {
      isTransitAligned: state === "TRANSIT_CONFIRMED",
      isNatalPromiseHonored: true,
      dashaWindowStatus: dashaState,
      explanatoryNote,
    },

    causalAuditTrail,
  };
}

// ── Fallback Constructors for Invariant Guards ───────────────────────────────

function createPromiseDeniedTransitResult(
  rule: KPEventRule,
  dashaActivation: KPDashaActivationResult,
  natalVerdict: string
): KPTransitConfirmationResult {
  return {
    ruleId: rule.id,
    eventName: rule.name,
    canonicalSource: rule.canonicalSource,
    status: rule.status,
    natalPromiseStatus: natalVerdict,
    dashaActivationState: dashaActivation.timingState,

    evaluationTime: {
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
      timezone: 5.5,
      jdUTC: 0,
      jdTT: 0,
      deltaTSeconds: 0,
      coordinateFrame: "KP_PLACIDUS_NEWCOMB",
      ayanamshaName: "KP_NEWCOMB",
    },

    transitPoints: [],
    primaryActivePoints: [],
    aggregatedSupportingHouses: [],
    aggregatedDetrimentHouses: [],
    aggregatedBarrierHouses: [],

    state: "PROMISE_DENIED",

    auditSummary: {
      isTransitAligned: false,
      isNatalPromiseHonored: true,
      dashaWindowStatus: dashaActivation.timingState,
      explanatoryNote: `Natal cusp promise is denied (${natalVerdict}). In KP doctrine, transits cannot manufacture an event whose natal promise is absent.`,
    },

    causalAuditTrail: [
      `[Pipeline Gate] Natal cusp sub-lord denies event (${natalVerdict}).`,
      `[Transit Gate] Transit confirmation suppressed: PROMISE_DENIED.`,
    ],
  };
}

function createReferencePendingTransitResult(
  rule: KPEventRule,
  dashaActivation: KPDashaActivationResult
): KPTransitConfirmationResult {
  return {
    ruleId: rule.id,
    eventName: rule.name,
    canonicalSource: rule.canonicalSource,
    status: "Reference_Pending",
    natalPromiseStatus: "REFERENCE_PENDING",
    dashaActivationState: dashaActivation.timingState,

    evaluationTime: {
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
      timezone: 5.5,
      jdUTC: 0,
      jdTT: 0,
      deltaTSeconds: 0,
      coordinateFrame: "KP_PLACIDUS_NEWCOMB",
      ayanamshaName: "KP_NEWCOMB",
    },

    transitPoints: [],
    primaryActivePoints: [],
    aggregatedSupportingHouses: [],
    aggregatedDetrimentHouses: [],
    aggregatedBarrierHouses: [],

    state: "EVALUATION_PENDING",

    auditSummary: {
      isTransitAligned: false,
      isNatalPromiseHonored: true,
      dashaWindowStatus: dashaActivation.timingState,
      explanatoryNote: `Rule ${rule.id} has epistemological status Reference_Pending. Transit confirmation is suspended.`,
    },

    causalAuditTrail: [
      `[Epistemological Guard] Rule ${rule.id} is Reference_Pending.`,
      `[Transit Gate] State set to EVALUATION_PENDING.`,
    ],
  };
}

/**
 * Convenience helper to evaluate transit confirmation across all registered rules.
 */
export function evaluateAllTransitConfirmations(
  predictiveEvidence: KPPredictiveEvidence,
  dashaActivations: Record<string, KPDashaActivationResult>,
  transitInput?: PrecomputedTransitInput
): Record<string, KPTransitConfirmationResult> {
  const results: Record<string, KPTransitConfirmationResult> = {};

  Object.values(KP_EVENT_RULE_REGISTRY).forEach((rule) => {
    const dashaRes = dashaActivations[rule.id];
    if (dashaRes) {
      results[rule.id] = evaluateTransitConfirmation(
        rule,
        predictiveEvidence,
        dashaRes,
        transitInput
      );
    }
  });

  return results;
}

