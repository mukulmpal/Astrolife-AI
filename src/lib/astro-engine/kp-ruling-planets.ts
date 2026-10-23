/**
 * ============================================================================
 * ASTROLIFE — KP RULING PLANETS ENGINE (PHASE 2I-G)
 * ============================================================================
 * Implements the extraction, node representation, and evidentiary corroboration
 * of classical Ruling Planets (RP) strictly adhering to Krishnamurti Paddhati principles.
 *
 * Mandatory Engine Principles:
 * 1. Pipeline Sovereignty & Filtering:
 *    Natal Promise → Dasha Hierarchy → Transit Confirmation → RP Corroboration.
 *    Ruling Planets serve strictly as an active period corroborator/filter;
 *    they NEVER manufacture an event or override natal PROMISE_DENIED.
 *    RP cannot generate PROMISE_DENIED; that state belongs to Cusp Promise.
 * 2. 5 Classical Pillars + Secondary Sub-Lords:
 *    Core Ruling Planets:
 *    - Ascendant Star Lord
 *    - Ascendant Sign Lord
 *    - Moon Star Lord
 *    - Moon Sign Lord
 *    - Day Lord (Vara Lord calculated strictly from astronomical sunrise)
 *    Secondary Evidence:
 *    - Ascendant Sub Lord
 *    - Moon Sub Lord
 * 3. Node Representation Chain (Rahu & Ketu):
 *    Nodes do not automatically become RPs. The engine models an explicit
 *    chain: node -> representation (sign, conjunction, aspect) -> represented RPs.
 * 4. No Universal Retrograde Deferral:
 *    Motion status ("DIRECT" | "RETROGRADE") and timing status ("ACTIVE" | "DEFERRED")
 *    are distinct. RPs are only deferred where classical rules explicitly demand it.
 * 5. Deterministic Non-Numeric State:
 *    - RP_CORROBORATED: Relevant active period/transit lords match RP evidence.
 *    - RP_PARTIAL: Partial overlap.
 *    - RP_DISCORDANT: Active period/transit lords absent from RP set.
 *    - RP_NEUTRAL: Unconstrained context.
 *    - EVALUATION_PENDING: Rule is REFERENCE_PENDING.
 *    Zero arbitrary scores, weights, percentages, or majority voting.
 * 6. Explicit Context:
 *    "NATAL" vs "PRASHNA" with explicit calculation moment.
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
  computeLagna,
  convertLongitudeBetweenAyanamshas,
} from "./calculations";
import {
  calculateDeltaT,
  jdToGregorian,
  utcToTT,
} from "./time-scales";
import { calculateSunWindow } from "./panchang";
import type {
  KPPredictiveEvidence,
} from "./kp-evidence-types";
import {
  KPEventRule,
  KP_EVENT_RULE_REGISTRY,
  EpistemologicalStatus,
} from "./kp-rule-registry";
import type { KPDashaActivationResult } from "./kp-dasha-activation";
import type { KPTransitConfirmationResult } from "./kp-transit-confirmation";

// ── Types & Contracts ────────────────────────────────────────────────────────

export type RulingPlanetContext = "NATAL" | "PRASHNA";

export type RPMotionStatus = "DIRECT" | "RETROGRADE";
export type RPTimingStatus = "ACTIVE" | "DEFERRED" | "REFERENCE_PENDING";

export type RulingPlanetCorroborationState =
  | "RP_CORROBORATED"      // One or more relevant period/transit significators match the RP evidence set
  | "RP_PARTIAL"           // Partial overlap between active period/transit lords and RP evidence
  | "RP_DISCORDANT"        // Active period/transit significators absent from RP evidence set
  | "RP_NEUTRAL"           // Evaluation context unconstrained or no relevant period lord specified
  | "EVALUATION_PENDING";  // Upstream event rule is REFERENCE_PENDING

export interface NodeRepresentationChain {
  node: "Rahu" | "Ketu";
  motionStatus: RPMotionStatus;
  signLord: KPPlanet;
  conjoinedPlanets: KPPlanet[];
  aspectedByPlanets: KPPlanet[];
  representedCoreRPs: KPPlanet[];
  representedSecondaryRPs: KPPlanet[];
}

export interface DayLordProvenance {
  dayLord: KPPlanet;
  weekdayName: string;
  astronomicalSunriseLocal: string;
  astronomicalSunsetLocal: string;
  isBeforeSunrise: boolean;
  effectiveDate: string;
  location: {
    lat: number;
    lon: number;
  };
  timezone: number;
  calculationMethod: "ASTRONOMICAL_SUNRISE_ALGORITHM";
  provenance: {
    source: string;
    note: string;
  };
}

export interface CoreRulingPlanets {
  ascendantSignLord: KPPlanet;
  ascendantStarLord: KPPlanet;
  moonSignLord: KPPlanet;
  moonStarLord: KPPlanet;
  dayLord: KPPlanet;
}

export interface SecondaryRulingPlanets {
  ascendantSubLord: KPPlanet;
  moonSubLord: KPPlanet;
  ascendantSubSubLord?: KPPlanet;
  moonSubSubLord?: KPPlanet;
}

export interface KPRulingPlanetsSnapshot {
  context: RulingPlanetContext;
  calculationMoment: {
    dob: string;
    tob: string;
    lat: number;
    lon: number;
    tz: number;
    jdUTC: number;
    jdTT: number;
  };
  coordinateFrame: {
    ayanamshaName: "KP_NEWCOMB";
    value: number;
  };
  ascendant: {
    lon: number;
    sign: string;
    signLord: KPPlanet;
    nakshatra: string;
    starLord: KPPlanet;
    subLord: KPPlanet;
    subSubLord?: KPPlanet;
  };
  moon: {
    lon: number;
    sign: string;
    signLord: KPPlanet;
    nakshatra: string;
    starLord: KPPlanet;
    subLord: KPPlanet;
    subSubLord?: KPPlanet;
  };
  dayLordInfo: DayLordProvenance;
  coreRulingPlanets: CoreRulingPlanets;
  secondaryRulingPlanets: SecondaryRulingPlanets;
  nodeRepresentations: NodeRepresentationChain[];
  activeRulingPlanetsSet: KPPlanet[]; // Unique set of planets representing core + secondary + nodes
  motionDetails: Record<KPPlanet, { motionStatus: RPMotionStatus; timingStatus: RPTimingStatus }>;
  provenance: {
    readerReferences: string[];
    epistemologicalStatus: EpistemologicalStatus;
  };
}

export interface KPRulingPlanetsConfirmationResult {
  ruleId: string;
  eventName: string;
  canonicalSource: string;
  status: EpistemologicalStatus;

  // Upstream reflections (unmodified)
  natalPromiseStatus: string;
  dashaActivationState: string;
  transitConfirmationState?: string;

  // RP Corroboration Verdict
  state: RulingPlanetCorroborationState;
  matchedCoreLords: KPPlanet[];
  matchedSecondaryLords: KPPlanet[];
  matchedNodeAgents: KPPlanet[];
  dashaLordsInRP: {
    maha: boolean;
    bhukti: boolean;
    antara: boolean;
    sookshma: boolean;
  };
  transitLordsInRP: KPPlanet[];

  causalAuditTrail: string[];
}

// ── Constants & Helpers ──────────────────────────────────────────────────────

const RASHIS_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORD_MAP: Record<number, KPPlanet> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const DAY_LORD_MAP: Record<number, KPPlanet> = {
  0: "Sun",     // Sunday
  1: "Moon",    // Monday
  2: "Mars",    // Tuesday
  3: "Mercury", // Wednesday
  4: "Jupiter", // Thursday
  5: "Venus",   // Friday
  6: "Saturn",  // Saturday
};

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

function normalizeLon(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function getSignIndex(lon: number): number {
  return Math.floor(normalizeLon(lon) / 30);
}

function getSignName(lon: number): string {
  return RASHIS_EN[getSignIndex(lon)];
}

function getSignLord(lon: number): KPPlanet {
  return SIGN_LORD_MAP[getSignIndex(lon)];
}

function parseDecimalHours(timeStr: string): number {
  const parts = timeStr.split(":");
  const h = Number.parseInt(parts[0] ?? "0", 10);
  const m = Number.parseInt(parts[1] ?? "0", 10);
  const s = parts[2] ? Number.parseFloat(parts[2]) : 0;
  return h + m / 60 + s / 3600;
}

/**
 * Calculates Day Lord (Vara Lord) from astronomical sunrise.
 * If current local time is before astronomical sunrise, the astrological day
 * belongs to the preceding calendar day.
 */
export function calculateAstronomicalDayLord(
  dob: string,
  tob: string,
  tz: number,
  lat: number,
  lon: number
): DayLordProvenance {
  // Parse calendar date
  const [yStr, mStr, dStr] = dob.split("-");
  const year = Number.parseInt(yStr ?? "2000", 10);
  const month = Number.parseInt(mStr ?? "1", 10) - 1;
  const day = Number.parseInt(dStr ?? "1", 10);

  // Local calendar date instance
  const calendarDate = new Date(Date.UTC(year, month, day, 12, 0, 0));

  // Compute astronomical sunrise/sunset for this day via panchang engine
  const sunWindow = calculateSunWindow(calendarDate, lat, lon, tz);
  const sunriseDec = parseDecimalHours(sunWindow.sunrise);
  const tobDec = parseDecimalHours(tob);

  const isBeforeSunrise = tobDec < sunriseDec;

  let effectiveDate = calendarDate;
  if (isBeforeSunrise) {
    // Prior day
    effectiveDate = new Date(calendarDate.getTime() - 24 * 60 * 60 * 1000);
  }

  const dayOfWeek = effectiveDate.getUTCDay();
  const dayLord = DAY_LORD_MAP[dayOfWeek] ?? "Sun";
  const weekdayName = WEEKDAY_NAMES[dayOfWeek] ?? "Sunday";

  const effYear = effectiveDate.getUTCFullYear();
  const effMonth = String(effectiveDate.getUTCMonth() + 1).padStart(2, "0");
  const effDay = String(effectiveDate.getUTCDate()).padStart(2, "0");
  const effectiveDateStr = `${effYear}-${effMonth}-${effDay}`;

  return {
    dayLord,
    weekdayName,
    astronomicalSunriseLocal: sunWindow.sunrise,
    astronomicalSunsetLocal: sunWindow.sunset,
    isBeforeSunrise,
    effectiveDate: effectiveDateStr,
    location: { lat, lon },
    timezone: tz,
    calculationMethod: "ASTRONOMICAL_SUNRISE_ALGORITHM",
    provenance: {
      source: "panchang.ts calculateSunWindow (classical KP rule)",
      note: isBeforeSunrise
        ? `Born at ${tob} prior to sunrise ${sunWindow.sunrise}. Day assigned to preceding day (${weekdayName} ruled by ${dayLord}).`
        : `Born at ${tob} after sunrise ${sunWindow.sunrise}. Day is ${weekdayName} ruled by ${dayLord}.`,
    },
  };
}

/**
 * Checks planetary aspects in classical Vedic/KP tradition:
 * All planets aspect 7th house (opposition, ~180°).
 * Mars aspects 4th, 7th, 8th (~90°, ~180°, ~210°).
 * Jupiter aspects 5th, 7th, 9th (~120°, ~180°, ~240°).
 * Saturn aspects 3rd, 7th, 10th (~60°, ~180°, ~270°).
 * Rahu/Ketu aspect 5th, 7th, 9th (~120°, ~180°, ~240°).
 */
function isPlanetaryAspect(fromLon: number, toLon: number, planet: KPPlanet): boolean {
  const diff = normalizeLon(toLon - fromLon);
  // Full house aspect spans (roughly 30-degree sign boundaries, checked within orb +/- 8°)
  const orb = 8.0;

  // 7th house opposition for all planets
  if (Math.abs(diff - 180) <= orb) return true;

  if (planet === "Mars") {
    if (Math.abs(diff - 90) <= orb || Math.abs(diff - 210) <= orb) return true;
  } else if (planet === "Jupiter" || planet === "Rahu" || planet === "Ketu") {
    if (Math.abs(diff - 120) <= orb || Math.abs(diff - 240) <= orb) return true;
  } else if (planet === "Saturn") {
    if (Math.abs(diff - 60) <= orb || Math.abs(diff - 270) <= orb) return true;
  }

  return false;
}

/**
 * Computes the complete, deterministic Ruling Planets snapshot for a given moment.
 */
export function calculateRulingPlanets(params: {
  context: RulingPlanetContext;
  dob: string;
  tob: string;
  tz: number;
  lat: number;
  lon: number;
}): KPRulingPlanetsSnapshot {
  const { context, dob, tob, tz, lat, lon } = params;

  const jdUTC = getJD(dob, tob, tz);
  const { year, month } = jdToGregorian(jdUTC);
  const { deltaTSec } = calculateDeltaT(year, month);
  const jdTT = utcToTT(jdUTC, deltaTSec);

  // Raw longitudes in Lahiri from Moshier ephemeris
  const rawPositions = computePlanets(jdUTC, jdTT);
  const rawRetro = computeRetro(jdUTC);

  // Ascendant in Lahiri
  const rawLagna = computeLagna(jdUTC, lat, lon);

  // Convert to KP Unified Frame (KP_NEWCOMB)
  const kpLagna = convertLongitudeBetweenAyanamshas(
    rawLagna,
    "Lahiri_Chitrapaksha",
    "KP_Krishnamurti",
    jdUTC
  );

  const kpPositions: Record<KPPlanet, number> = {
    Sun: convertLongitudeBetweenAyanamshas(rawPositions.Sun ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Moon: convertLongitudeBetweenAyanamshas(rawPositions.Moon ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Mars: convertLongitudeBetweenAyanamshas(rawPositions.Mars ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Mercury: convertLongitudeBetweenAyanamshas(rawPositions.Mercury ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Jupiter: convertLongitudeBetweenAyanamshas(rawPositions.Jupiter ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Venus: convertLongitudeBetweenAyanamshas(rawPositions.Venus ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Saturn: convertLongitudeBetweenAyanamshas(rawPositions.Saturn ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Rahu: convertLongitudeBetweenAyanamshas(rawPositions.Rahu ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
    Ketu: convertLongitudeBetweenAyanamshas(rawPositions.Ketu ?? 0, "Lahiri_Chitrapaksha", "KP_Krishnamurti", jdUTC),
  };

  // Motion details
  const motionDetails: Record<KPPlanet, { motionStatus: RPMotionStatus; timingStatus: RPTimingStatus }> = {
    Sun: { motionStatus: "DIRECT", timingStatus: "ACTIVE" },
    Moon: { motionStatus: "DIRECT", timingStatus: "ACTIVE" },
    Mars: { motionStatus: rawRetro.Mars ? "RETROGRADE" : "DIRECT", timingStatus: "ACTIVE" },
    Mercury: { motionStatus: rawRetro.Mercury ? "RETROGRADE" : "DIRECT", timingStatus: "ACTIVE" },
    Jupiter: { motionStatus: rawRetro.Jupiter ? "RETROGRADE" : "DIRECT", timingStatus: "ACTIVE" },
    Venus: { motionStatus: rawRetro.Venus ? "RETROGRADE" : "DIRECT", timingStatus: "ACTIVE" },
    Saturn: { motionStatus: rawRetro.Saturn ? "RETROGRADE" : "DIRECT", timingStatus: "ACTIVE" },
    Rahu: { motionStatus: "RETROGRADE", timingStatus: "ACTIVE" }, // Mean node standard motion
    Ketu: { motionStatus: "RETROGRADE", timingStatus: "ACTIVE" },
  };

  // Ascendant lords
  const ascSign = getSignName(kpLagna);
  const ascSignLord = getSignLord(kpLagna);
  const ascNak = getNakshatra(kpLagna);
  const ascStarLord = getStarLord(kpLagna);
  const ascSubLord = getSubLord(kpLagna);
  const ascSubSubLord = getSubSubLord(kpLagna);

  // Moon lords
  const moonLon = kpPositions.Moon;
  const moonSign = getSignName(moonLon);
  const moonSignLord = getSignLord(moonLon);
  const moonNak = getNakshatra(moonLon);
  const moonStarLord = getStarLord(moonLon);
  const moonSubLord = getSubLord(moonLon);
  const moonSubSubLord = getSubSubLord(moonLon);

  // Day Lord via astronomical sunrise
  const dayLordInfo = calculateAstronomicalDayLord(dob, tob, tz, lat, lon);
  const dayLord = dayLordInfo.dayLord;

  // Classical 5 Core Pillars
  const coreRulingPlanets: CoreRulingPlanets = {
    ascendantStarLord: ascStarLord,
    ascendantSignLord: ascSignLord,
    moonStarLord: moonStarLord,
    moonSignLord: moonSignLord,
    dayLord: dayLord,
  };

  // Secondary Sub-Lords
  const secondaryRulingPlanets: SecondaryRulingPlanets = {
    ascendantSubLord: ascSubLord,
    moonSubLord: moonSubLord,
    ascendantSubSubLord: ascSubSubLord,
    moonSubSubLord: moonSubSubLord,
  };

  // Node Representation Chains (Rahu & Ketu)
  const allPlanets: KPPlanet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const nodes: ("Rahu" | "Ketu")[] = ["Rahu", "Ketu"];

  const coreRPList: KPPlanet[] = [
    ascStarLord,
    ascSignLord,
    moonStarLord,
    moonSignLord,
    dayLord,
  ];

  const secondaryRPList: KPPlanet[] = [
    ascSubLord,
    moonSubLord,
  ];

  const nodeRepresentations: NodeRepresentationChain[] = nodes.map((node) => {
    const nodeLon = kpPositions[node];
    const nodeSignLord = getSignLord(nodeLon);

    // Conjunctions within orb (3.33 degrees)
    const conjoinedPlanets: KPPlanet[] = allPlanets.filter((p) => {
      const pLon = kpPositions[p];
      const diff = Math.abs(normalizeLon(nodeLon - pLon));
      return Math.min(diff, 360 - diff) <= 3.3333;
    });

    // Aspects
    const aspectedByPlanets: KPPlanet[] = allPlanets.filter((p) => {
      const pLon = kpPositions[p];
      return isPlanetaryAspect(pLon, nodeLon, p);
    });

    // Planets represented by this node
    const representedPlanets = new Set<KPPlanet>([
      nodeSignLord,
      ...conjoinedPlanets,
      ...aspectedByPlanets,
    ]);

    const representedCoreRPs = coreRPList.filter((rp) => representedPlanets.has(rp));
    const representedSecondaryRPs = secondaryRPList.filter((rp) => representedPlanets.has(rp));

    return {
      node,
      motionStatus: "RETROGRADE",
      signLord: nodeSignLord,
      conjoinedPlanets,
      aspectedByPlanets,
      representedCoreRPs,
      representedSecondaryRPs,
    };
  });

  // Active Ruling Planet set (unique set of core + secondary + nodes if representing RPs)
  const activeSet = new Set<KPPlanet>(coreRPList);
  secondaryRPList.forEach((p) => activeSet.add(p));

  // Add nodes to active set ONLY if they represent a core or secondary RP
  nodeRepresentations.forEach((nr) => {
    if (nr.representedCoreRPs.length > 0 || nr.representedSecondaryRPs.length > 0) {
      activeSet.add(nr.node);
    }
  });

  return {
    context,
    calculationMoment: {
      dob,
      tob,
      lat,
      lon,
      tz,
      jdUTC,
      jdTT,
    },
    coordinateFrame: {
      ayanamshaName: "KP_NEWCOMB",
      value: 0,
    },
    ascendant: {
      lon: kpLagna,
      sign: ascSign,
      signLord: ascSignLord,
      nakshatra: ascNak,
      starLord: ascStarLord,
      subLord: ascSubLord,
      subSubLord: ascSubSubLord,
    },
    moon: {
      lon: moonLon,
      sign: moonSign,
      signLord: moonSignLord,
      nakshatra: moonNak,
      starLord: moonStarLord,
      subLord: moonSubLord,
      subSubLord: moonSubSubLord,
    },
    dayLordInfo,
    coreRulingPlanets,
    secondaryRulingPlanets,
    nodeRepresentations,
    activeRulingPlanetsSet: Array.from(activeSet),
    motionDetails,
    provenance: {
      readerReferences: [
        "Classical KP Ruling Planets doctrine",
        "Classical KP Horary doctrine",
        "Classical KP Rahu/Ketu representation doctrine",
      ],
      epistemologicalStatus: "Verified",
    },
  };
}

/**
 * Evaluates Ruling Planets corroboration against a specific registered event rule,
 * reflecting upstream Dasha and Transit evidence without modifying or overriding them.
 */
export function evaluateRulingPlanetsConfirmation(params: {
  rule: KPEventRule;
  rpSnapshot: KPRulingPlanetsSnapshot;
  dashaActivation?: KPDashaActivationResult;
  transitConfirmation?: KPTransitConfirmationResult;
}): KPRulingPlanetsConfirmationResult {
  const { rule, rpSnapshot, dashaActivation, transitConfirmation } = params;

  const causalAuditTrail: string[] = [];
  causalAuditTrail.push(`[Rule] Evaluated rule: ${rule.id} (${rule.name})`);

  // Upstream state reflection
  const natalPromiseStatus =
    dashaActivation?.natalPromiseVerdict ??
    (dashaActivation as any)?.natalPromiseStatus ??
    "PROMISE_NOT_EVALUATED";
  const dashaActivationState = dashaActivation?.timingState ?? "NEUTRAL_WINDOW";
  const transitConfirmationState = transitConfirmation?.state;

  causalAuditTrail.push(`[Upstream] Natal Promise: ${natalPromiseStatus}, Dasha Activation: ${dashaActivationState}`);
  if (transitConfirmationState) {
    causalAuditTrail.push(`[Upstream] Transit Confirmation: ${transitConfirmationState}`);
  }

  // Reference guard
  if (rule.status === "Reference_Pending") {
    causalAuditTrail.push("[Reference Guard] Rule is marked Reference_Pending; corroboration verdict suppressed.");
    return {
      ruleId: rule.id,
      eventName: rule.name,
      canonicalSource: rule.canonicalSource,
      status: "Reference_Pending",
      natalPromiseStatus,
      dashaActivationState,
      transitConfirmationState,
      state: "EVALUATION_PENDING",
      matchedCoreLords: [],
      matchedSecondaryLords: [],
      matchedNodeAgents: [],
      dashaLordsInRP: { maha: false, bhukti: false, antara: false, sookshma: false },
      transitLordsInRP: [],
      causalAuditTrail,
    };
  }

  // Collect active period lords from Dasha activation
  const dashaLords: { planet: KPPlanet; level: string }[] = [];
  const hierarchy = (dashaActivation as any)?.activeHierarchy ?? dashaActivation?.levels;
  if (hierarchy) {
    if (hierarchy.mahadasha) dashaLords.push({ planet: hierarchy.mahadasha.planet, level: "maha" });
    if (hierarchy.antardasha) dashaLords.push({ planet: hierarchy.antardasha.planet, level: "bhukti" });
    if (hierarchy.pratyantardasha) dashaLords.push({ planet: hierarchy.pratyantardasha.planet, level: "antara" });
    if (hierarchy.sookshma) dashaLords.push({ planet: hierarchy.sookshma.planet, level: "sookshma" });
  }

  // Collect relevant transiting significators
  const transitLords: KPPlanet[] = [];
  if (transitConfirmation?.primaryActivePoints) {
    transitConfirmation.primaryActivePoints.forEach((tp) => {
      if (tp.isRelevant) transitLords.push(tp.transitPlanet);
    });
  }

  const coreRPSet = new Set<KPPlanet>([
    rpSnapshot.coreRulingPlanets.ascendantStarLord,
    rpSnapshot.coreRulingPlanets.ascendantSignLord,
    rpSnapshot.coreRulingPlanets.moonStarLord,
    rpSnapshot.coreRulingPlanets.moonSignLord,
    rpSnapshot.coreRulingPlanets.dayLord,
  ]);

  const secondaryRPSet = new Set<KPPlanet>([
    rpSnapshot.secondaryRulingPlanets.ascendantSubLord,
    rpSnapshot.secondaryRulingPlanets.moonSubLord,
  ]);

  // Identify node agents in the active RP set
  const nodeAgentSet = new Set<KPPlanet>();
  rpSnapshot.nodeRepresentations.forEach((nr) => {
    if (nr.representedCoreRPs.length > 0 || nr.representedSecondaryRPs.length > 0) {
      nodeAgentSet.add(nr.node);
    }
  });

  const activeRPSet = new Set<KPPlanet>(rpSnapshot.activeRulingPlanetsSet);

  // Check matching across Dasha lords
  const dashaLordsInRP = {
    maha: dashaLords.some((l) => l.level === "maha" && activeRPSet.has(l.planet)),
    bhukti: dashaLords.some((l) => l.level === "bhukti" && activeRPSet.has(l.planet)),
    antara: dashaLords.some((l) => l.level === "antara" && activeRPSet.has(l.planet)),
    sookshma: dashaLords.some((l) => l.level === "sookshma" && activeRPSet.has(l.planet)),
  };

  const matchedCoreLords: KPPlanet[] = [];
  const matchedSecondaryLords: KPPlanet[] = [];
  const matchedNodeAgents: KPPlanet[] = [];

  const allActiveLords = new Set<KPPlanet>([
    ...dashaLords.map((l) => l.planet),
    ...transitLords,
  ]);

  allActiveLords.forEach((planet) => {
    if (coreRPSet.has(planet)) matchedCoreLords.push(planet);
    if (secondaryRPSet.has(planet)) matchedSecondaryLords.push(planet);
    if (nodeAgentSet.has(planet)) matchedNodeAgents.push(planet);
  });

  const transitLordsInRP = transitLords.filter((p) => activeRPSet.has(p));

  // Determine state
  let state: RulingPlanetCorroborationState = "RP_NEUTRAL";

  if (allActiveLords.size === 0) {
    state = "RP_NEUTRAL";
    causalAuditTrail.push("[RP Analysis] No active period or transit lords provided; context is unconstrained (RP_NEUTRAL).");
  } else {
    const hasCoreMatch = matchedCoreLords.length > 0;
    const hasSecondaryMatch = matchedSecondaryLords.length > 0;
    const hasNodeMatch = matchedNodeAgents.length > 0;
    const hasAnyMatch = hasCoreMatch || hasSecondaryMatch || hasNodeMatch;

    // Classical Krishnamurti criterion:
    // Ruling planets corroborate when active timing lords (especially Bhukti/Antara)
    // belong to the ruling set.
    const keyDashaMatched = dashaLordsInRP.bhukti || dashaLordsInRP.maha;

    if (keyDashaMatched && hasCoreMatch) {
      state = "RP_CORROBORATED";
      causalAuditTrail.push(`[RP Corroboration] Core ruling planet(s) [${matchedCoreLords.join(", ")}] match active primary period lords. Classical timing corroborated.`);
    } else if (hasAnyMatch) {
      state = "RP_PARTIAL";
      causalAuditTrail.push(`[RP Partial] Active lords partially overlap ruling planets: Core [${matchedCoreLords.join(", ")}], Secondary [${matchedSecondaryLords.join(", ")}], Nodes [${matchedNodeAgents.join(", ")}].`);
    } else {
      state = "RP_DISCORDANT";
      causalAuditTrail.push(`[RP Discordant] None of the active lords [${Array.from(allActiveLords).join(", ")}] are present in the active ruling planets set.`);
    }
  }

  // Audit trail details on nodes
  rpSnapshot.nodeRepresentations.forEach((nr) => {
    if (nr.representedCoreRPs.length > 0 || nr.representedSecondaryRPs.length > 0) {
      causalAuditTrail.push(`[Node Representation] ${nr.node} represents Core RPs [${nr.representedCoreRPs.join(", ")}] and Secondary RPs [${nr.representedSecondaryRPs.join(", ")}] via sign lord ${nr.signLord}.`);
    }
  });

  return {
    ruleId: rule.id,
    eventName: rule.name,
    canonicalSource: rule.canonicalSource,
    status: rule.status,
    natalPromiseStatus,
    dashaActivationState,
    transitConfirmationState,
    state,
    matchedCoreLords,
    matchedSecondaryLords,
    matchedNodeAgents,
    dashaLordsInRP,
    transitLordsInRP,
    causalAuditTrail,
  };
}

/**
 * Batch evaluates all registered event rules against a Ruling Planets snapshot.
 */
export function evaluateAllRulingPlanetsConfirmations(params: {
  rpSnapshot: KPRulingPlanetsSnapshot;
  dashaActivations?: Record<string, KPDashaActivationResult>;
  transitConfirmations?: Record<string, KPTransitConfirmationResult>;
}): Record<string, KPRulingPlanetsConfirmationResult> {
  const { rpSnapshot, dashaActivations, transitConfirmations } = params;
  const results: Record<string, KPRulingPlanetsConfirmationResult> = {};

  for (const rule of Object.values(KP_EVENT_RULE_REGISTRY)) {
    const dashaActivation = dashaActivations ? dashaActivations[rule.id] : undefined;
    const transitConfirmation = transitConfirmations ? transitConfirmations[rule.id] : undefined;

    results[rule.id] = evaluateRulingPlanetsConfirmation({
      rule,
      rpSnapshot,
      dashaActivation,
      transitConfirmation,
    });
  }

  return results;
}

// ══════════════════════════════════════════════════════════════════════════════
// KP THREE-LEVEL LINKAGE & RULE OF ORIGIN ENGINES (FOR BTR & PRASHNA)
// ══════════════════════════════════════════════════════════════════════════════

export interface KPLinkageContext {
  planetPositions?: Record<
    string,
    {
      sign?: string;
      signLord?: string;
      starLord?: string;
      subLord?: string;
    }
  >;
}

export interface KPLinkageResult {
  linked: boolean;
  linkType: "EXACT" | "MUTUAL_SUB" | "MUTUAL_STAR" | "MUTUAL_SIGN" | "THIRD_PLANET" | "NONE";
  detail: string;
}

/**
 * Evaluates whether two planets have an established astrological linkage
 * in Krishnamurti Paddhati (Identity, Mutual Sub, Mutual Star, Mutual Sign, or Third Planet).
 */
export function hasKPLinkage(
  a: string,
  b: string,
  context?: KPLinkageContext
): KPLinkageResult {
  if (!a || !b) {
    return { linked: false, linkType: "NONE", detail: "Invalid planet inputs" };
  }

  if (a.toLowerCase() === b.toLowerCase()) {
    return {
      linked: true,
      linkType: "EXACT",
      detail: `${a} is identical to ${b}`,
    };
  }

  if (context?.planetPositions) {
    const pA = context.planetPositions[a];
    const pB = context.planetPositions[b];

    // 1. Mutual Sub
    if ((pA?.subLord && pA.subLord.toLowerCase() === b.toLowerCase()) ||
        (pB?.subLord && pB.subLord.toLowerCase() === a.toLowerCase())) {
      return {
        linked: true,
        linkType: "MUTUAL_SUB",
        detail: `${a} and ${b} share Sub-Lord linkage (${pA?.subLord || pB?.subLord})`,
      };
    }

    // 2. Mutual Star (Constellation)
    if ((pA?.starLord && pA.starLord.toLowerCase() === b.toLowerCase()) ||
        (pB?.starLord && pB.starLord.toLowerCase() === a.toLowerCase())) {
      return {
        linked: true,
        linkType: "MUTUAL_STAR",
        detail: `${a} and ${b} share Star-Lord linkage (${pA?.starLord || pB?.starLord})`,
      };
    }

    // 3. Mutual Sign Lord
    if ((pA?.signLord && pA.signLord.toLowerCase() === b.toLowerCase()) ||
        (pB?.signLord && pB.signLord.toLowerCase() === a.toLowerCase())) {
      return {
        linked: true,
        linkType: "MUTUAL_SIGN",
        detail: `${a} and ${b} share Sign-Lord linkage (${pA?.signLord || pB?.signLord})`,
      };
    }

    // 4. Connected through a third planet (common Star or Sub lord)
    if (pA && pB) {
      if (pA.starLord && pB.starLord && pA.starLord.toLowerCase() === pB.starLord.toLowerCase()) {
        return {
          linked: true,
          linkType: "THIRD_PLANET",
          detail: `${a} and ${b} both deposit in Star of ${pA.starLord}`,
        };
      }
      if (pA.subLord && pB.subLord && pA.subLord.toLowerCase() === pB.subLord.toLowerCase()) {
        return {
          linked: true,
          linkType: "THIRD_PLANET",
          detail: `${a} and ${b} both deposit in Sub of ${pA.subLord}`,
        };
      }
    }
  }

  return {
    linked: false,
    linkType: "NONE",
    detail: `No direct KP linkage found between ${a} and ${b}`,
  };
}

export interface RuleOfOriginResult {
  originValidated: boolean;
  ruleO1: boolean;
  ruleO2: boolean;
  ruleO3: boolean;
  score: number; // 0 - 20 points
  lagnaStarLord: string;
  lagnaSubLord: string;
  cusp9StarLord: string;
  cusp9SubLord: string;
  auditTrail: string[];
}

/**
 * Evaluates the classical KP Rule of Origin (Rules O1, O2, O3)
 * connecting the 1st Cusp (Lagna) with the 9th Cusp (Dharma / Father / Descent).
 */
export function evaluateRuleOfOrigin(
  cusp1: { starLord: string; subLord: string; signLord?: string },
  cusp9: { starLord: string; subLord: string; signLord?: string },
  context?: KPLinkageContext
): RuleOfOriginResult {
  const audit: string[] = [];

  const lStar = cusp1.starLord;
  const lSub = cusp1.subLord;
  const c9Star = cusp9.starLord;
  const c9Sub = cusp9.subLord;

  // Rule O1: Lagna Star Lord == 9th Star Lord OR 9th Sub Lord
  const ruleO1 =
    lStar.toLowerCase() === c9Star.toLowerCase() ||
    lStar.toLowerCase() === c9Sub.toLowerCase();
  if (ruleO1) {
    audit.push(`Rule O1 Passed: Lagna Star Lord (${lStar}) connects to 9th Cusp (${c9Star}/${c9Sub})`);
  }

  // Rule O2: Lagna Sub Lord == 9th Star Lord OR 9th Sub Lord
  const ruleO2 =
    lSub.toLowerCase() === c9Star.toLowerCase() ||
    lSub.toLowerCase() === c9Sub.toLowerCase();
  if (ruleO2) {
    audit.push(`Rule O2 Passed: Lagna Sub Lord (${lSub}) connects to 9th Cusp (${c9Star}/${c9Sub})`);
  }

  // Rule O3: Third-planet linkage between Lagna lords and 9th cusp lords
  const linkStar = hasKPLinkage(lStar, c9Sub, context);
  const linkSub = hasKPLinkage(lSub, c9Sub, context);
  const ruleO3 = linkStar.linked || linkSub.linked;
  if (ruleO3) {
    audit.push(`Rule O3 Passed: Inter-cuspal linkage (${linkStar.linked ? linkStar.detail : linkSub.detail})`);
  }

  let score = 0;
  if (ruleO1) score += 10;
  if (ruleO2) score += 8;
  if (ruleO3 && !ruleO1 && !ruleO2) score += 5;

  const originValidated = ruleO1 || ruleO2 || ruleO3;

  return {
    originValidated,
    ruleO1,
    ruleO2,
    ruleO3,
    score: Math.min(20, score),
    lagnaStarLord: lStar,
    lagnaSubLord: lSub,
    cusp9StarLord: c9Star,
    cusp9SubLord: c9Sub,
    auditTrail: audit,
  };
}

export interface KPThreeLevelLinkageResult {
  supported: boolean;
  score: number; // 0 to 30 points
  level1Match: boolean;
  level2Match: boolean;
  level3Match: boolean;
  levelMatches: {
    level1: { candidate: string; rp: string[]; matched: boolean };
    level2: { candidate: string; rp: string[]; matched: boolean };
    level3: { candidate: string; rp: string[]; matched: boolean };
  };
  auditTrail: string[];
}

/**
 * Evaluates KP 3-Level Linkage between Candidate Lagna (Sign, Star, Sub)
 * and active Ruling Planets (RP).
 */
export function evaluateKPThreeLevelLinkage(
  candidateLagna: { signLord: string; starLord: string; subLord: string },
  rulingPlanets: {
    signLords: string[];
    starLords: string[];
    subLords: string[];
  },
  context?: KPLinkageContext
): KPThreeLevelLinkageResult {
  const audit: string[] = [];

  // Level 1: Sign Lord
  const l1Matches = rulingPlanets.signLords.some(
    (rp) => hasKPLinkage(candidateLagna.signLord, rp, context).linked
  );
  if (l1Matches) {
    audit.push(`Level 1 (Sign) Linked: Lagna Sign Lord ${candidateLagna.signLord} connects to RPs [${rulingPlanets.signLords.join(", ")}]`);
  }

  // Level 2: Star Lord
  const l2Matches = rulingPlanets.starLords.some(
    (rp) => hasKPLinkage(candidateLagna.starLord, rp, context).linked
  );
  if (l2Matches) {
    audit.push(`Level 2 (Star) Linked: Lagna Star Lord ${candidateLagna.starLord} connects to RPs [${rulingPlanets.starLords.join(", ")}]`);
  }

  // Level 3: Sub Lord (High precision indicator)
  const l3Matches = rulingPlanets.subLords.some(
    (rp) => hasKPLinkage(candidateLagna.subLord, rp, context).linked
  );
  if (l3Matches) {
    audit.push(`Level 3 (Sub) Linked: Lagna Sub Lord ${candidateLagna.subLord} connects to RPs [${rulingPlanets.subLords.join(", ")}]`);
  }

  let score = 0;
  if (l1Matches) score += 8;
  if (l2Matches) score += 10;
  if (l3Matches) score += 12;

  const supported = (l1Matches && l2Matches) || (l2Matches && l3Matches) || (l1Matches && l3Matches);

  return {
    supported,
    score,
    level1Match: l1Matches,
    level2Match: l2Matches,
    level3Match: l3Matches,
    levelMatches: {
      level1: { candidate: candidateLagna.signLord, rp: rulingPlanets.signLords, matched: l1Matches },
      level2: { candidate: candidateLagna.starLord, rp: rulingPlanets.starLords, matched: l2Matches },
      level3: { candidate: candidateLagna.subLord, rp: rulingPlanets.subLords, matched: l3Matches },
    },
    auditTrail: audit,
  };
}

