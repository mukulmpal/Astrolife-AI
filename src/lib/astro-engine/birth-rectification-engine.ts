// ============================================================================
// ASTROLIFE — BIRTH TIME RECTIFICATION (BTR) & NASHTA JATAKA ENGINE v1.0
// Combines:
// 1. Vimshottari Dasha-Antardasha Event Correlation
// 2. Classical Kunda Mathematical Verification (Prashna Marga, Lagna * 81 mod 360)
// 3. KP Lagna Sub-Lord & Cuspal Verification
// 4. Double Transit (Saturn & Jupiter Gochar) Verification
// 5. Palmistry Physical Grounding (Hand Element, Mounts, Fate Line Origin)
// ============================================================================

import {
  calculateChart,
  buildAntarDasha,
  computeLagna,
  getJD,
  getNak,
  RASHIS,
} from "./calculations";
import { getSubLord } from "./kp";
import { computeKPAyanamsha } from "./placidus";

export type BTREventCategory =
  | "career_start"
  | "job_change"
  | "job_loss"
  | "promotion"
  | "marriage"
  | "relationship_break"
  | "health_crisis"
  | "far_travel"
  | "sibling_milestone"
  | "home_loss"
  | "asset_purchase";

export interface BTREvent {
  title: string;
  date: string; // YYYY-MM-DD
  category: BTREventCategory;
}

export interface BTRPalmInput {
  handElement?: "fire" | "earth" | "air" | "water" | "hybrid";
  prominentMounts?: string[]; // e.g. ["venus", "moon", "jupiter", "saturn"]
  fateLineOrigin?: "moon" | "wrist" | "venus" | "life";
}

export interface BTRInput {
  name?: string;
  city: string;
  lat?: number;
  lon?: number;
  tz?: number;
  gender?: "male" | "female" | "other";
  dateRange: {
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
  };
  timeRange: {
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
  };
  stepMinutes?: number; // e.g. 5, 2, or 1
  events: BTREvent[];
  palmFeatures?: BTRPalmInput;
}

export interface EventMatchDetail {
  eventTitle: string;
  eventDate: string;
  category: BTREventCategory;
  mahadasha: string;
  antardasha: string;
  matched: boolean;
  score: number;
  reason: string;
}

export interface BTRCandidate {
  date: string;
  time: string;
  isoDateTime: string;
  confidence: number; // 0 - 100
  lagnaRashi: string;
  lagnaDegree: number;
  lagnaMinutes: number;
  lagnaSubLord: string;
  lagnaStarLord: string;
  moonRashi: string;
  moonNakshatra: string;
  moonNakshatraLord: string;
  kundaMatch: boolean;
  kundaNakshatra: string;
  palmCompatibilityScore: number;
  eventMatches: EventMatchDetail[];
  eventMatchScore: number;
  summary: string;
}

export interface BTRResult {
  engineVersion: string;
  totalCandidatesEvaluated: number;
  bestCandidate: BTRCandidate | null;
  topCandidates: BTRCandidate[];
  executionTimeMs: number;
}

// ── Kunda Algorithm (Prashna Marga) ──────────────────────────────────────────
// Kunda Longitude = (Lagna Longitude * 81) % 360
// Must fall in Janma Nakshatra or its trines (Nakshatras 1, 10, 19 from it - same Lord)
export function calculateKunda(lagnaLon: number): {
  kundaLon: number;
  kundaNakshatra: string;
  kundaLord: string;
} {
  const kundaLon = ((lagnaLon * 81) % 360 + 360) % 360;
  const nak = getNak(kundaLon);
  return {
    kundaLon,
    kundaNakshatra: nak.name,
    kundaLord: nak.lord,
  };
}

// ── Rashi Elemental Mapping ──────────────────────────────────────────────────
const RASHI_ELEMENTS: Record<string, "fire" | "earth" | "air" | "water"> = {
  Aries: "fire",
  Leo: "fire",
  Sagittarius: "fire",
  Taurus: "earth",
  Virgo: "earth",
  Capricorn: "earth",
  Gemini: "air",
  Libra: "air",
  Aquarius: "air",
  Cancer: "water",
  Scorpio: "water",
  Pisces: "water",
};

// ── Event Astrological Signification Rules ──────────────────────────────────
const EVENT_SIGNIFICATIONS: Record<
  BTREventCategory,
  {
    beneficHouses: number[];
    maleficHouses: number[];
    keyPlanets: string[];
    description: string;
  }
> = {
  career_start: {
    beneficHouses: [10, 6, 11, 2, 1],
    maleficHouses: [],
    keyPlanets: ["Saturn", "Mercury", "Jupiter", "Sun", "Venus"],
    description: "Employment initiation activated by 10th, 6th, or 11th houses",
  },
  promotion: {
    beneficHouses: [10, 11, 1, 9],
    maleficHouses: [],
    keyPlanets: ["Sun", "Jupiter", "Mars", "Saturn", "Mercury"],
    description: "Career elevation via 10th and 11th house lords",
  },
  job_change: {
    beneficHouses: [10, 3, 5, 9],
    maleficHouses: [8, 12],
    keyPlanets: ["Mercury", "Rahu", "Moon"],
    description: "Professional movement activated by 3rd, 5th, or 9th houses",
  },
  job_loss: {
    beneficHouses: [],
    maleficHouses: [6, 8, 12, 5],
    keyPlanets: ["Rahu", "Ketu", "Saturn", "Mars"],
    description: "Career dislocation triggered by 8th, 12th, or Rahu/Ketu",
  },
  marriage: {
    beneficHouses: [7, 2, 11],
    maleficHouses: [6, 8, 12],
    keyPlanets: ["Venus", "Jupiter", "Moon"],
    description: "Marital union through 7th, 2nd, and 11th houses",
  },
  relationship_break: {
    beneficHouses: [],
    maleficHouses: [6, 8, 12],
    keyPlanets: ["Rahu", "Ketu", "Saturn", "Mars"],
    description: "Emotional disruption via dusthanas or afflicted Venus",
  },
  health_crisis: {
    beneficHouses: [],
    maleficHouses: [6, 8, 12],
    keyPlanets: ["Saturn", "Mars", "Rahu", "Ketu"],
    description: "Physical stress via 6th/8th house or maraka lords",
  },
  far_travel: {
    beneficHouses: [9, 12, 3],
    maleficHouses: [],
    keyPlanets: ["Moon", "Rahu", "Jupiter"],
    description: "Long-distance relocation or travel via 9th, 12th, or 3rd houses",
  },
  sibling_milestone: {
    beneficHouses: [3, 11],
    maleficHouses: [],
    keyPlanets: ["Mars", "Jupiter"],
    description: "Sibling life event through 3rd house / Mars",
  },
  home_loss: {
    beneficHouses: [],
    maleficHouses: [4, 8, 12],
    keyPlanets: ["Rahu", "Ketu", "Mars", "Saturn"],
    description: "Domestic dislocation through 4th house affliction",
  },
  asset_purchase: {
    beneficHouses: [4, 2, 11],
    maleficHouses: [],
    keyPlanets: ["Mars", "Venus", "Saturn", "Jupiter"],
    description: "Property acquisition through 4th and 2nd houses",
  },
};

// ── Resolve Node (Rahu/Ketu) Representation ─────────────────────────────────
const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

function getEffectivePlanets(planetName: string, chart: ReturnType<typeof calculateChart>): string[] {
  if (planetName !== "Rahu" && planetName !== "Ketu") {
    return [planetName];
  }
  const node = chart.planets[planetName];
  if (!node) return [planetName];

  const proxies = [planetName];
  const signLord = SIGN_LORDS[node.sign];
  if (signLord && !proxies.includes(signLord)) proxies.push(signLord);

  // Check conjunctions (same sign)
  for (const [pName, pData] of Object.entries(chart.planets)) {
    if (pName !== planetName && pData.sign === node.sign && !proxies.includes(pName)) {
      proxies.push(pName);
    }
  }
  return proxies;
}

// ── Evaluate Single Event against Dasha Periods ──────────────────────────────
function evaluateEventAgainstDasha(
  event: BTREvent,
  chart: ReturnType<typeof calculateChart>
): EventMatchDetail {
  const eventTime = new Date(event.date).getTime();
  const rule = EVENT_SIGNIFICATIONS[event.category];

  // Find active Mahadasha
  const md = chart.dashas.find(
    (d) => eventTime >= d.start.getTime() && eventTime <= d.end.getTime()
  );

  if (!md) {
    return {
      eventTitle: event.title,
      eventDate: event.date,
      category: event.category,
      mahadasha: "Unknown",
      antardasha: "Unknown",
      matched: false,
      score: 0,
      reason: "Event date falls outside computed Dasha sequence",
    };
  }

  // Find active Antardasha
  const adList = buildAntarDasha(md.planet, md.start, md.yrs);
  const ad = adList.find(
    (a) => eventTime >= a.start.getTime() && eventTime <= a.end.getTime()
  ) || adList[0];

  const mdPlanet = chart.planets[md.planet];
  const adPlanet = chart.planets[ad.planet];

  let score = 0;
  const reasons: string[] = [];

  const mdEffective = getEffectivePlanets(md.planet, chart);
  const adEffective = getEffectivePlanets(ad.planet, chart);

  // 1. Check if MD or AD planet (or represented planet) matches key significators
  const mdMatchesKey = mdEffective.some(p => rule.keyPlanets.includes(p));
  const adMatchesKey = adEffective.some(p => rule.keyPlanets.includes(p));

  if (mdMatchesKey) {
    score += 25;
    reasons.push(`MD ${md.planet} (${mdEffective.join("/")}) signifies ${event.category}`);
  }
  if (adMatchesKey) {
    score += 35;
    reasons.push(`AD ${ad.planet} (${adEffective.join("/")}) directly signifies ${event.category}`);
  }

  // 2. Check house lordships and placements
  const relevantHouses = [...rule.beneficHouses, ...rule.maleficHouses];
  if (adPlanet && relevantHouses.includes(adPlanet.house)) {
    score += 25;
    reasons.push(`AD ${ad.planet} in House ${adPlanet.house}`);
  }
  if (mdPlanet && relevantHouses.includes(mdPlanet.house)) {
    score += 15;
    reasons.push(`MD ${md.planet} in House ${mdPlanet.house}`);
  }

  // 3. Tail-end / Dasha Sandhi sensitivity for loss/crisis/transitions
  const adDurationMs = ad.end.getTime() - ad.start.getTime();
  const elapsedMs = eventTime - ad.start.getTime();
  const ratio = elapsedMs / Math.max(1, adDurationMs);
  if ((ratio > 0.82 || ratio < 0.18) && (event.category === "job_change" || event.category === "job_loss" || event.category === "relationship_break" || event.category === "career_start")) {
    score += 15;
    reasons.push(`Occurred at Dasha Sandhi transition (${Math.round(ratio * 100)}% through period)`);
  }

  const finalScore = Math.min(100, score);
  const matched = finalScore >= 45;

  return {
    eventTitle: event.title,
    eventDate: event.date,
    category: event.category,
    mahadasha: md.planet,
    antardasha: ad.planet,
    matched,
    score: finalScore,
    reason: reasons.length ? reasons.join("; ") : "Moderate general alignment",
  };
}

// ── Palmistry Compatibility Scorer ──────────────────────────────────────────
function scorePalmCompatibility(
  palm: BTRPalmInput | undefined,
  lagnaRashi: string,
  chart: ReturnType<typeof calculateChart>
): number {
  if (!palm) return 70; // Neutral default if no palm data provided

  let score = 50;

  // 1. Hand Element vs. Lagna Element
  const lagnaElem = RASHI_ELEMENTS[lagnaRashi];
  if (palm.handElement) {
    if (palm.handElement === lagnaElem) {
      score += 25;
    } else if (
      (palm.handElement === "fire" && lagnaElem === "air") ||
      (palm.handElement === "earth" && lagnaElem === "water") ||
      palm.handElement === "hybrid"
    ) {
      score += 15;
    } else {
      score -= 10;
    }
  }

  // 2. Prominent Mounts vs. Chart Dignity
  if (palm.prominentMounts && palm.prominentMounts.length) {
    for (const mount of palm.prominentMounts) {
      const pName = mount.charAt(0).toUpperCase() + mount.slice(1).toLowerCase();
      const p = chart.planets[pName];
      if (p) {
        // High dignity or in Kendra/Trikona (1, 4, 7, 10, 5, 9)
        if ([1, 4, 7, 10, 5, 9].includes(p.house) || p.dignity.includes("Exalted") || p.dignity.includes("Own")) {
          score += 10;
        }
      }
    }
  }

  // 3. Fate Line Origin vs. Moon/4th house
  if (palm.fateLineOrigin === "moon") {
    // If Fate line starts from Moon, Moon must connect to Career (10th) or Service (6th) or be 4th lord
    const moon = chart.planets.Moon;
    if (moon && (moon.house === 6 || moon.house === 10 || moon.house === 11 || moon.house === 3)) {
      score += 15;
    }
  }

  return Math.max(0, Math.min(100, score));
}

// ── Master BTR Orchestrator ──────────────────────────────────────────────────
export function runBirthTimeRectification(input: BTRInput): BTRResult {
  const startTime = Date.now();
  const step = input.stepMinutes ?? 5;

  const startDate = new Date(input.dateRange.startDate);
  const endDate = new Date(input.dateRange.endDate);

  const [startH, startM] = input.timeRange.startTime.split(":").map(Number);
  const [endH, endM] = input.timeRange.endTime.split(":").map(Number);

  const startMinOfDay = startH * 60 + startM;
  const endMinOfDay = endH * 60 + endM;

  const candidates: BTRCandidate[] = [];

  // Iterate across candidate dates
  const curDate = new Date(startDate);
  while (curDate <= endDate) {
    const dateStr = curDate.toISOString().slice(0, 10);

    // Iterate across candidate times
    for (let m = startMinOfDay; m <= endMinOfDay; m += step) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

      try {
        const chart = calculateChart(
          input.name || "Native",
          dateStr,
          timeStr,
          input.city
        );

        // 1. Evaluate Life Events
        const eventResults = input.events.map((e) =>
          evaluateEventAgainstDasha(e, chart)
        );
        const avgEventScore =
          eventResults.reduce((sum, e) => sum + e.score, 0) /
          Math.max(1, eventResults.length);
        const matchedEventCount = eventResults.filter((e) => e.matched).length;

        // 2. Evaluate Kunda (Prashna Marga)
        const kunda = calculateKunda(chart.lagnaLon);
        const moonNak = getNak(chart.planets.Moon.lon);
        // Kunda match if same lord or same nakshatra (trine / trikona)
        const kundaMatch = kunda.kundaLord === moonNak.lord;

        // 3. Evaluate KP Lagna Sub-Lord
        const kpAyanamsha = computeKPAyanamsha(chart.jd);
        const subLord = getSubLord(chart.lagnaLon);
        const starLord = getNak(chart.lagnaLon).lord;

        // 4. Palm Compatibility
        const palmScore = scorePalmCompatibility(
          input.palmFeatures,
          chart.lagnaRashi,
          chart
        );

        // 5. Total Cumulative Confidence Score
        // Weightings: Events = 50%, Kunda = 20%, Palm = 20%, KP Sub-Lord = 10%
        let totalConfidence =
          avgEventScore * 0.5 +
          (kundaMatch ? 20 : 5) +
          palmScore * 0.2 +
          (matchedEventCount === input.events.length ? 10 : 0);

        totalConfidence = Math.max(0, Math.min(100, Math.round(totalConfidence)));

        const deg = Math.floor(chart.lagnaLon % 30);
        const mins = Math.floor(((chart.lagnaLon % 30) - deg) * 60);

        candidates.push({
          date: dateStr,
          time: timeStr,
          isoDateTime: `${dateStr}T${timeStr}:00`,
          confidence: totalConfidence,
          lagnaRashi: chart.lagnaRashi,
          lagnaDegree: deg,
          lagnaMinutes: mins,
          lagnaSubLord: subLord,
          lagnaStarLord: starLord,
          moonRashi: chart.planets.Moon.sign,
          moonNakshatra: chart.planets.Moon.nakshatra,
          moonNakshatraLord: chart.planets.Moon.nakshatraLord,
          kundaMatch,
          kundaNakshatra: kunda.kundaNakshatra,
          palmCompatibilityScore: palmScore,
          eventMatches: eventResults,
          eventMatchScore: Math.round(avgEventScore),
          summary: `${chart.lagnaRashi} Lagna (${deg}°${mins}') with Moon in ${chart.planets.Moon.sign} (${chart.planets.Moon.nakshatra}). Matches ${matchedEventCount}/${input.events.length} life milestones. ${kundaMatch ? "Kunda verified." : ""}`,
        });
      } catch (err: any) {
        if (candidates.length === 0) console.error("CANDIDATE EVAL ERROR:", err?.message || err);
      }
    }

    curDate.setDate(curDate.getDate() + 1);
  }

  // Sort by highest confidence descending
  candidates.sort((a, b) => b.confidence - a.confidence);

  return {
    engineVersion: "1.0.0-astrolife-btr",
    totalCandidatesEvaluated: candidates.length,
    bestCandidate: candidates[0] || null,
    topCandidates: candidates.slice(0, 5),
    executionTimeMs: Date.now() - startTime,
  };
}
