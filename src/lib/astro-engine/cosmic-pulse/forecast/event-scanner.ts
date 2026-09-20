import { computePlanets, type ChartData } from "../../calculations";
import type { PlanetName } from "../../transits";
import type { CosmicForecastEvent, ContactTiming } from "./forecast-types";
import {
  findExactAspectTime,
  findPeakOrbTime,
  findThresholdCrossing,
  normalizeSignedAngle,
} from "./numerical-refinement";
import { dateToJulianDay, computeEphemerisVelocity } from "../ephemeris-precision";
import { segmentPassesByDirection, buildRetrogradePassInfo } from "./retrograde-loop";
import type { LifeArea, TriggerSeverity } from "../types";

export interface CandidateScanPair {
  type: "transit_hit" | "planetary_aspect";
  planetA: PlanetName;
  planetB: PlanetName;
  targetAngle: number;
  orbMax: number;
  label: string;
  isNatalB: boolean;
  severity: TriggerSeverity;
  lifeAreas: LifeArea[];
}

const CANDIDATE_PAIRS: CandidateScanPair[] = [
  // Transit hits over natal points
  {
    type: "transit_hit",
    planetA: "Saturn",
    planetB: "Moon",
    targetAngle: 0,
    orbMax: 2.5,
    label: "Saturn Transit over Natal Moon (Shani Gochara · Emotional Endurance)",
    isNatalB: true,
    severity: "critical",
    lifeAreas: ["mindset", "health", "home"],
  },
  {
    type: "transit_hit",
    planetA: "Jupiter",
    planetB: "Sun",
    targetAngle: 0,
    orbMax: 2.5,
    label: "Jupiter Transit over Natal Sun (Surya-Guru Yoga · Purpose & Clarity)",
    isNatalB: true,
    severity: "opportunity",
    lifeAreas: ["career", "wealth", "spirituality"],
  },
  {
    type: "transit_hit",
    planetA: "Jupiter",
    planetB: "Moon",
    targetAngle: 0,
    orbMax: 2.0,
    label: "Jupiter Transit over Natal Moon (Gajakesari Resonance · Contentment)",
    isNatalB: true,
    severity: "opportunity",
    lifeAreas: ["wealth", "relationships", "mindset"],
  },
  {
    type: "transit_hit",
    planetA: "Mars",
    planetB: "Saturn",
    targetAngle: 0,
    orbMax: 2.5,
    label: "Mars Transit over Natal Saturn (Energy & Structural Discipline)",
    isNatalB: true,
    severity: "caution",
    lifeAreas: ["career", "health", "mindset"],
  },

  // Mutual Transit Aspects (Gochara Oppositions & Special Aspects)
  {
    type: "planetary_aspect",
    planetA: "Sun",
    planetB: "Saturn",
    targetAngle: 180,
    orbMax: 3.5,
    label: "Sun ☍ Saturn Mutual Opposition (Samasaptaka Axis · Ego & Duty)",
    isNatalB: false,
    severity: "critical",
    lifeAreas: ["career", "relationships", "health"],
  },
  {
    type: "planetary_aspect",
    planetA: "Mars",
    planetB: "Saturn",
    targetAngle: 180,
    orbMax: 3.5,
    label: "Mars ☍ Saturn Mutual Opposition (Samasaptaka Axis · Action & Patience)",
    isNatalB: false,
    severity: "critical",
    lifeAreas: ["career", "health", "mindset"],
  },
  {
    type: "planetary_aspect",
    planetA: "Mars",
    planetB: "Saturn",
    targetAngle: 90,
    orbMax: 3.0,
    label: "Mars 4th Special Aspect on Saturn (Chaturtha Drishti)",
    isNatalB: false,
    severity: "caution",
    lifeAreas: ["home", "career"],
  },
  {
    type: "planetary_aspect",
    planetA: "Saturn",
    planetB: "Sun",
    targetAngle: 60,
    orbMax: 3.0,
    label: "Saturn 3rd Special Aspect on Sun (Tritiya Drishti)",
    isNatalB: false,
    severity: "caution",
    lifeAreas: ["career", "education"],
  },
];

function buildEventHeadline(
  candidate: CandidateScanPair,
  exactDate: Date | undefined,
  peakDate: Date,
  minOrb: number,
  natalHouse?: number
): string {
  const dateStr = (exactDate || peakDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const precisionStr = exactDate ? `exact ${candidate.targetAngle}° culmination` : `peak alignment (${minOrb.toFixed(2)}° orb)`;
  const houseContext = natalHouse ? ` in House ${natalHouse}` : "";

  if (candidate.type === "transit_hit") {
    if (candidate.planetA === "Saturn" && candidate.planetB === "Moon") {
      return `Saturn reaches ${precisionStr} over natal Moon${houseContext} on ${dateStr}. In classical Gochara, this marks a reflective phase emphasizing emotional steadiness, endurance, and structured pacing.`;
    }
    if (candidate.planetA === "Jupiter" && candidate.planetB === "Sun") {
      return `Jupiter forms ${precisionStr} with natal Sun${houseContext} on ${dateStr}. Traditionally associated with expanding clarity, professional vitality, and purposeful initiatives.`;
    }
    if (candidate.planetA === "Jupiter" && candidate.planetB === "Moon") {
      return `Jupiter aligns in ${precisionStr} with natal Moon${houseContext} on ${dateStr}. Traditionally celebrated for mental contentment, harmonic relationships, and balanced intuition.`;
    }
    if (candidate.planetA === "Mars" && candidate.planetB === "Saturn") {
      return `Mars contacts natal Saturn${houseContext} with ${precisionStr} on ${dateStr}. Classically associated with balancing assertive action with methodical deliberation.`;
    }
    return `Transit ${candidate.planetA} reaches ${precisionStr} over natal ${candidate.planetB}${houseContext} on ${dateStr}, traditionally highlighting focused attention in ${candidate.lifeAreas.join(", ")}.`;
  }

  // Mutual Aspects
  if (candidate.targetAngle === 180) {
    return `${candidate.planetA} and ${candidate.planetB} reach ${precisionStr} across the sky on ${dateStr}. Classical Parashari framework interprets this 180° Samasaptaka axis as a call for conscious balance between personal drive and patient endurance.`;
  }

  return `${candidate.label} reaches ${precisionStr} on ${dateStr}, traditionally encouraging measured awareness in ${candidate.lifeAreas.join(", ")}.`;
}

function jdToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

export function scanPlanetaryEvents(
  chart: ChartData,
  startDate: Date,
  daysAhead: number,
  localTz = 5.5
): CosmicForecastEvent[] {
  const events: CosmicForecastEvent[] = [];
  const startJd = dateToJulianDay(startDate);
  const endJd = startJd + daysAhead;
  const coarseStep = 0.5; // 12-hour coarse scan

  for (const candidate of CANDIDATE_PAIRS) {
    // Check if natal planet exists for transit hits
    let natalLonB: number | null = null;
    let natalHouseB = 1;
    if (candidate.isNatalB) {
      const np = chart.planets?.[candidate.planetB] as unknown as Record<string, unknown> | undefined;
      if (!np) continue;
      natalLonB =
        typeof np.longitude === "number" ? np.longitude :
        typeof np.lon === "number" ? np.lon :
        typeof np.degree === "number" ? np.degree : 0;
      natalHouseB = typeof np.house === "number" ? np.house : 1;
    }

    // Function giving signed angle error at Julian Day
    const getAngleError = (jd: number): number => {
      const p = computePlanets(jd);
      const lonA = p[candidate.planetA] ?? 0;
      const lonB = candidate.isNatalB ? (natalLonB ?? 0) : (p[candidate.planetB] ?? 0);
      const diff = (lonB - lonA + 360) % 360;
      return normalizeSignedAngle(diff - candidate.targetAngle);
    };

    const getOrb = (jd: number): number => {
      return Math.abs(getAngleError(jd));
    };

    // Coarse scan to bracket orb entry and exit
    let inWindow = false;
    let windowStartJd = startJd;

    for (let t = startJd; t <= endJd; t += coarseStep) {
      const currentOrb = getOrb(t);

      if (currentOrb <= candidate.orbMax && !inWindow) {
        // Enters orb threshold
        inWindow = true;
        // Refine contact moment
        windowStartJd = findThresholdCrossing(t, Math.max(startJd, t - coarseStep), getOrb, candidate.orbMax);
      } else if (currentOrb > candidate.orbMax && inWindow) {
        // Exits orb threshold
        inWindow = false;
        const windowEndJd = findThresholdCrossing(t - coarseStep, t, getOrb, candidate.orbMax);

        // Process this active orb window with retrograde pass segmentation
        processOrbWindow({
          candidate,
          windowStartJd,
          windowEndJd,
          getAngleError,
          getOrb,
          localTz,
          daysAhead,
          natalHouse: natalHouseB,
          chart,
          events,
        });
      }
    }

    // Handle open window at end of search period
    if (inWindow) {
      processOrbWindow({
        candidate,
        windowStartJd,
        windowEndJd: endJd,
        getAngleError,
        getOrb,
        localTz,
        daysAhead,
        natalHouse: natalHouseB,
        chart,
        events,
      });
    }
  }

  return events;
}

interface ProcessWindowParams {
  candidate: CandidateScanPair;
  windowStartJd: number;
  windowEndJd: number;
  getAngleError: (jd: number) => number;
  getOrb: (jd: number) => number;
  localTz: number;
  daysAhead: number;
  natalHouse: number;
  chart: ChartData;
  events: CosmicForecastEvent[];
}

function processOrbWindow({
  candidate,
  windowStartJd,
  windowEndJd,
  getAngleError,
  getOrb,
  localTz,
  daysAhead,
  natalHouse,
  chart,
  events,
}: ProcessWindowParams): void {
  // Segment into direct vs retrograde passes
  const motionSegments = segmentPassesByDirection(
    candidate.planetA,
    windowStartJd,
    windowEndJd,
    0.5
  );

  const totalPasses = motionSegments.length;

  motionSegments.forEach((seg, passIdx) => {
    // 1. Refine exact moment (0°00' error) if zero crossing occurred in this segment
    const exactJd = findExactAspectTime(seg.jdStart, seg.jdEnd, getAngleError);

    // 2. Refine peak moment (minimum orb)
    const { jd: peakJd, minOrb } = findPeakOrbTime(seg.jdStart, seg.jdEnd, getOrb);

    // Only emit event if it reaches close to peak alignment
    if (minOrb <= candidate.orbMax) {
      const contactDate = jdToDate(seg.jdStart);
      const exactDate = exactJd !== null ? jdToDate(exactJd) : undefined;
      const peakDate = jdToDate(peakJd);
      const separationDate = jdToDate(seg.jdEnd);

      const passInfo = buildRetrogradePassInfo(seg.isRetrograde, passIdx, totalPasses);
      const passTitleSuffix = totalPasses > 1
        ? ` (${seg.isRetrograde ? "Pass 2: Retrograde" : passIdx === 0 ? "Pass 1: Direct" : "Pass 3: Final Direct"})`
        : "";

      const pAtPeak = computePlanets(peakJd);
      const lonA = pAtPeak[candidate.planetA] ?? 0;
      const lonB = candidate.isNatalB
        ? (typeof (chart.planets?.[candidate.planetB] as any)?.longitude === "number"
            ? (chart.planets?.[candidate.planetB] as any).longitude
            : (chart.planets?.[candidate.planetB] as any)?.lon ?? 0)
        : (pAtPeak[candidate.planetB] ?? 0);

      // Chronological integrity check
      const effContact = contactDate;
      const effPeak = exactDate || peakDate;
      const effSep = separationDate.getTime() <= effPeak.getTime()
        ? new Date(effPeak.getTime() + 43200000) // At least 12h separation window
        : separationDate;

      const timing: ContactTiming = {
        contactAt: effContact,
        exactAt: exactDate,
        peakAt: peakDate,
        separationAt: effSep,
      };

      const eventId = `forecast-${candidate.planetA}-${candidate.planetB}-${candidate.targetAngle}-${timing.peakAt.toISOString().slice(0, 10)}-p${passInfo.passNumber}`;
      const headline = buildEventHeadline(candidate, exactDate, peakDate, minOrb, natalHouse);
      const isExactOrNear = exactDate !== undefined || minOrb <= 1.0;
      const relevanceTier = (candidate.type === "transit_hit" && isExactOrNear) || (candidate.targetAngle === 180 && isExactOrNear)
        ? "primary"
        : "supporting";

      events.push({
        id: eventId,
        type: candidate.type,
        title: `${candidate.label}${passTitleSuffix}`,
        headline,
        planets: [candidate.planetA, candidate.planetB],
        aspectType: candidate.label,
        targetAngle: candidate.targetAngle,
        natalHouse,
        lifeAreas: candidate.lifeAreas,
        severity: candidate.severity,
        timing,
        retrogradeInfo: passInfo,
        relevanceTier,
        evidence: {
          aspectType: candidate.label,
          planetA: candidate.planetA,
          planetB: candidate.planetB,
          longitudeA: Number(lonA.toFixed(2)),
          longitudeB: Number(lonB.toFixed(2)),
          exactAspectDeg: candidate.targetAngle,
          currentOrbDeg: Number(minOrb.toFixed(2)),
          isApplying: !exactDate || contactDate < exactDate,
          shastraReference: candidate.type === "transit_hit"
            ? "Classical Vedic Gochara Framework (Planetary Transit Principle)"
            : "Classical Parashari Framework (Graha Drishti Siddhanta)",
        },
        provenance: {
          calculationBasis: [
            "Authoritative Moshier Ephemeris apparent longitude",
            "Central difference instantaneous daily velocity (dλ/dt)",
            "Numerical root-finding and Golden Section minimization",
            "Local chart timezone adjustment",
          ],
          searchIntervalDays: daysAhead,
          numericalRefinementMethod: "Secant Root-Finding & Golden Section Search (< 1e-4 day)",
          localTz,
        },
      });
    }
  });
}

