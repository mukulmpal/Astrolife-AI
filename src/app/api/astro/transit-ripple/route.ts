import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import { createRequestId, monitor } from "@/lib/server-monitoring";
import { getServerFeatureAccess, premiumBlockedResponse } from "@/lib/server-feature-access";
import { buildRichMeaning, PLANET_KNOWLEDGE, HOUSE_KNOWLEDGE } from "@/lib/astro-engine/transit-knowledge-base";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

const HOUSE_AREAS: Record<number, string> = {
  1: "Self, body, identity and confidence",
  2: "Money, speech, family and food habits",
  3: "Courage, skills, siblings and communication",
  4: "Home, mother, property and emotional peace",
  5: "Education, children, creativity and intelligence",
  6: "Health routine, competition, debts and service",
  7: "Marriage, partnership, clients and public dealings",
  8: "Transformation, hidden matters, research and vulnerability",
  9: "Luck, dharma, father, mentors and higher learning",
  10: "Career, karma, authority and public status",
  11: "Income, gains, network and long-term desires",
  12: "Sleep, expenses, isolation, foreign links and moksha",
};

const HOUSE_ACTIONS: Record<number, string[]> = {
  1: ["Stabilize sleep, food and body routine.", "Do not make identity decisions from temporary pressure."],
  2: ["Audit cash flow, speech and family commitments.", "Avoid harsh words and impulsive purchases."],
  3: ["Build one skill with repetition.", "Keep sibling and team communication factual."],
  4: ["Protect emotional peace and property documents.", "Do not carry work stress into home life."],
  5: ["Choose disciplined study over speculation.", "Support children and creative work with structure."],
  6: ["Prioritize health routines and debt discipline.", "Handle competition with patience, not panic."],
  7: ["Clarify expectations in marriage and partnerships.", "Keep client promises realistic and documented."],
  8: ["Avoid secrecy in shared money and sensitive decisions.", "Use research, therapy or sadhana constructively."],
  9: ["Respect mentors, law and dharma.", "Plan travel and education commitments carefully."],
  10: ["Show consistency in career and public duties.", "Avoid shortcuts with authority figures."],
  11: ["Clean up networks and long-term goals.", "Separate real gains from wishful thinking."],
  12: ["Track sleep, expenses and foreign links.", "Use solitude for recovery, not escapism."],
};

const PLANET_ASPECTS: Record<string, number[]> = {
  Saturn: [3, 7, 10],
  Jupiter: [5, 7, 9],
  Mars: [4, 7, 8],
  Rahu: [5, 7, 9],
  Ketu: [5, 7, 9],
};

type TransitRippleRequest = {
  nativeName?: string;
  ascendant: string;
  moonSign?: string;
  transitPlanet: string;
  transitSign: string;
  transitNakshatra: string;
  transitSpeed?: "direct" | "retrograde";
  currentMahadasha?: string;
  currentAntardasha?: string;
  periodLabel?: string;
  includeMoonSignReading?: boolean;
};

type MonthlyTransitRipplePoint = {
  date: string;
  planet: string;
  sign: string;
  nakshatra: string;
  speed?: "direct" | "retrograde";
  longitude?: number;
  houseFromAscendant: number;
  houseFromMoon: number;
};

type MonthlyTransitNatalPoint = {
  name: string;
  kind: "planet" | "cusp";
  longitude: number;
  sign: string;
  house: number;
  nakshatra?: string;
};

type MonthlyTransitRippleRequest = {
  mode: "monthly";
  nativeName?: string;
  ascendant: string;
  moonSign?: string;
  currentMahadasha?: string;
  currentAntardasha?: string;
  startDate: string;
  endDate: string;
  periodLabel?: string;
  transitPoints: MonthlyTransitRipplePoint[];
  natalPoints?: MonthlyTransitNatalPoint[];
};

function toCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(toCamelCase);
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter: string) =>
        letter.toUpperCase(),
      );
      output[camelKey] = toCamelCase(val);
    }

    return output;
  }

  return value;
}

function runPythonTransitEngine(input: unknown): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "transit_ripple_cli.py",
    );

    const child = spawn("python3", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    let stdoutBytes = 0;
    const maxBufferBytes = 1024 * 1024 * 20;

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk: string) => {
      stdoutBytes += Buffer.byteLength(chunk, "utf8");

      if (stdoutBytes > maxBufferBytes && !settled) {
        settled = true;
        child.kill();
        reject(new Error("Python transit engine output exceeded 20MB"));
        return;
      }

      stdout += chunk;
    });

    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      if (!settled) {
        settled = true;
        reject(error);
      }
    });

    child.on("close", (code) => {
      if (settled) return;

      settled = true;

      if (code !== 0) {
        reject(
          new Error(
            stderr.trim() ||
              `Python transit engine exited with code ${String(code)}`,
          ),
        );
        return;
      }

      resolve(stdout);
    });

    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}

function signIndex(sign: string) {
  return SIGNS.findIndex((item) => item.toLowerCase() === String(sign).toLowerCase());
}

function houseFromAscendant(ascendant: string, transitSign: string) {
  const asc = signIndex(ascendant);
  const transit = signIndex(transitSign);
  if (asc < 0 || transit < 0) return 1;
  return ((transit - asc + 12) % 12) + 1;
}

function wrapHouse(house: number) {
  return ((house - 1) % 12) + 1;
}

function ordinal(value: number) {
  const suffix =
    value % 100 >= 11 && value % 100 <= 13
      ? "th"
      : value % 10 === 1
        ? "st"
        : value % 10 === 2
          ? "nd"
          : value % 10 === 3
            ? "rd"
            : "th";

  return `${value}${suffix}`;
}

function intensityBand(score: number) {
  if (score >= 88) return "Peak";
  if (score >= 72) return "Strong";
  if (score >= 55) return "Moderate";
  return "Background";
}

function buildTsTransitRippleReport(input: TransitRippleRequest) {
  const nativeName = input.nativeName || "AstroLife Native";
  const transitName = `${input.transitPlanet} in ${input.transitSign} / ${input.transitNakshatra}`;
  const periodLabel = input.periodLabel || "Current transit activation period";
  const directHouse = houseFromAscendant(input.ascendant, input.transitSign);
  const moonHouse =
    input.moonSign && signIndex(input.moonSign) >= 0
      ? houseFromAscendant(input.moonSign, input.transitSign)
      : null;
  const aspectOffsets = PLANET_ASPECTS[input.transitPlanet] ?? [7];
  const aspectHits = aspectOffsets.map((offset) => {
    const targetHouse = wrapHouse(directHouse + offset - 1);
    return {
      targetHouse,
      label: `${input.transitPlanet} ${ordinal(offset)} aspect to House ${targetHouse}`,
      strength: offset === 7 ? 82 : 74,
      meaning: `${input.transitPlanet} extends a ${intensityBand(offset === 7 ? 82 : 74).toLowerCase()} ripple into ${HOUSE_AREAS[targetHouse]}. Treat this as an activation zone for planning, maturity and conscious correction.`,
    };
  });
  const aspectHouseSet = new Set(aspectHits.map((hit) => hit.targetHouse));

  const rippleLayers = Array.from({ length: 12 }, (_, index) => {
    const house = index + 1;
    const isDirect = house === directHouse;
    const isAspect = aspectHouseSet.has(house);
    const intensityScore = isDirect ? 92 : isAspect ? 76 : 48;
    const impactType = isDirect ? "direct" : isAspect ? "aspect" : "background";
    const tone = isDirect ? "High activation" : isAspect ? "Noticeable ripple" : "Subtle background";
    const houseName = HOUSE_AREAS[house];
    const actions = HOUSE_ACTIONS[house];

    return {
      house,
      houseName,
      impactType,
      intensityScore,
      tone,
      detailedNarrative: `${input.transitPlanet} moving through ${input.transitSign} and ${input.transitNakshatra} ${isDirect ? "directly activates" : isAspect ? "aspects" : "lightly ripples into"} House ${house}. This house governs ${houseName}. During ${input.currentMahadasha || "the current"}-${input.currentAntardasha || "active"} dasha, this becomes a ${intensityBand(intensityScore).toLowerCase()} planning signal: act with timing, discipline and clean intent instead of fear.`,
      remedies: [
        actions[0],
        actions[1],
        `Use a simple ${input.transitPlanet} remedy with consistency, not excess.`,
      ],
      cautions: [
        `Do not overreact to temporary pressure in House ${house}.`,
        "Use astrology as planning guidance, not fixed destiny.",
      ],
      summary: `${tone}: ${houseName}.`,
    };
  });

  const twelveHouseRippleTable = rippleLayers.map((layer) => ({
    house: layer.house,
    area: layer.houseName,
    impactType: layer.impactType,
    score: layer.intensityScore,
    tone: layer.tone,
    summary: layer.summary,
  }));
  const directLayer = rippleLayers[directHouse - 1];

  return {
    title: "AstroLife Transit Ripple Engine Report",
    nativeName,
    transitName,
    periodLabel,
    directHouse,
    moonTransitHouse: moonHouse,
    aspectHits,
    twelveHouseRippleTable,
    rippleLayers,
    dashaBridge: {
      title: "Dasha-Transit Bridge",
      body: `${input.currentMahadasha || "Current"} mahadasha and ${input.currentAntardasha || "active"} antardasha decide how strongly the transit result becomes visible. Read the direct house first, then the aspect houses, then the Moon-sign house for mental experience.`,
      currentMahadasha: input.currentMahadasha || "Current",
      currentAntardasha: input.currentAntardasha || "Active",
    },
    moonSignReading: moonHouse
      ? {
          title: "Moon-Sign Experience",
          moonSign: input.moonSign,
          houseFromMoon: moonHouse,
          body: `From Moon sign ${input.moonSign}, this transit activates House ${moonHouse}: ${HOUSE_AREAS[moonHouse]}. This shows the emotional and mental experience of the same transit.`,
        }
      : null,
    remedySection: {
      title: `${input.transitPlanet} Transit Remedy Protocol`,
      subtitle: `${input.transitNakshatra} tone with dasha awareness`,
      body: `The main activation is House ${directHouse}: ${directLayer.houseName}. Keep the remedy practical, repeatable and non-fearful.`,
      bullets: [
        "Keep a disciplined daily routine during this transit.",
        "Avoid major decisions from anxiety or pressure.",
        "Use charity, service, mantra or silence according to your faith.",
        "Review the directly activated house and aspect houses first.",
      ],
    },
    finalBookStyleConclusion: `${nativeName}, ${transitName} activates House ${directHouse}, with ripples into ${aspectHits.map((hit) => `House ${hit.targetHouse}`).join(", ")}. The strongest lesson is to bring maturity, structure and clean action into ${directLayer.houseName.toLowerCase()}. This reading is generated from your base chart payload and is intended as guidance for timing, awareness and practical correction.`,
    pdfSections: [
      {
        title: "Main Transit Field",
        subtitle: transitName,
        body: `${input.transitPlanet} in ${input.transitSign} through ${input.transitNakshatra} activates House ${directHouse}.`,
      },
      {
        title: "Dasha Bridge",
        body: `${input.currentMahadasha || "Current"}-${input.currentAntardasha || "active"} dasha filters the visible result of this transit. Prioritize direct activation and aspect houses before background ripples.`,
      },
      {
        title: "12-House Ripple Map",
        body: twelveHouseRippleTable.map((row) => `House ${row.house}: ${row.tone} - ${row.area}`).join("\n"),
      },
      {
        title: "Conclusion",
        body: `${input.currentMahadasha || "Current"}-${input.currentAntardasha || "active"} dasha should be read with this transit for timing clarity.`,
      },
    ],
  };
}

function planetNature(planet: string) {
  return PLANET_KNOWLEDGE[planet] ?? {
    nature: "transit movement",
    role: "transit movement",
    action: "observe the activation with patience",
    weight: 60,
    highExpression: "conscious awareness",
    shadowExpression: "unconscious reaction",
    careerEffect: "Career may shift focus.",
    moneyEffect: "Money matters may require attention.",
    relationshipEffect: "Relationships may feel effects.",
    healthEffect: "Health needs basic monitoring.",
    remedies: ["Stay calm", "Observe rather than react"],
  };
}

function summarizeWindow(points: MonthlyTransitRipplePoint[]) {
  const first = points[0];
  const last = points[points.length - 1] ?? first;
  return {
    startDate: first.date,
    endDate: last.date,
    days: points.length,
    planet: first.planet,
    sign: first.sign,
    nakshatra: first.nakshatra,
    speed: first.speed ?? "direct",
    houseFromAscendant: first.houseFromAscendant,
    houseFromMoon: first.houseFromMoon,
  };
}

function angularDistance(a: number, b: number) {
  const diff = Math.abs((((a - b) % 360) + 540) % 360 - 180);
  return Math.min(diff, 360 - diff);
}

const EVENT_RULES: Record<string, string[]> = {
  career: ["Sun", "Saturn", "Mars", "Mercury", "Jupiter", "House 10 cusp", "House 6 cusp", "House 11 cusp"],
  relationship: ["Venus", "Jupiter", "Moon", "Mars", "Rahu", "House 7 cusp", "House 2 cusp"],
  money: ["Jupiter", "Venus", "Mercury", "Rahu", "House 2 cusp", "House 11 cusp", "House 8 cusp"],
  healthRoutine: ["Moon", "Mars", "Saturn", "Sun", "Ketu", "House 1 cusp", "House 6 cusp", "House 8 cusp"],
  propertyHome: ["Moon", "Mars", "Venus", "Saturn", "House 4 cusp"],
  education: ["Jupiter", "Mercury", "Sun", "House 5 cusp", "House 9 cusp"],
  travelForeign: ["Rahu", "Ketu", "Jupiter", "Mercury", "House 9 cusp", "House 12 cusp", "House 3 cusp"],
  spirituality: ["Ketu", "Jupiter", "Saturn", "Moon", "House 8 cusp", "House 9 cusp", "House 12 cusp"],
  family: ["Moon", "Sun", "Jupiter", "Venus", "House 2 cusp", "House 4 cusp"],
  legalConflict: ["Mars", "Saturn", "Rahu", "Sun", "House 6 cusp", "House 8 cusp"],
};

const EVENT_LABELS: Record<string, string> = {
  career: "Career & Status",
  relationship: "Relationship & Marriage",
  money: "Money & Gains",
  healthRoutine: "Health Routine",
  propertyHome: "Property & Home",
  education: "Education & Skill",
  travelForeign: "Travel & Foreign",
  spirituality: "Spiritual Growth",
  family: "Family & Emotional Life",
  legalConflict: "Legal / Conflict",
};

function hitEventCategories(hit: { transitPlanet: string; natalName: string; natalHouse: number }) {
  const houseCusp = `House ${hit.natalHouse} cusp`;
  return Object.entries(EVENT_RULES)
    .filter(([, rules]) => rules.includes(hit.transitPlanet) || rules.includes(hit.natalName) || rules.includes(houseCusp))
    .map(([key]) => key);
}

function aspectHitsForPoint(point: MonthlyTransitRipplePoint, natal: MonthlyTransitNatalPoint) {
  const transitLongitude = point.longitude;
  const natalLongitude = natal.longitude;
  if (!Number.isFinite(transitLongitude) || !Number.isFinite(natalLongitude)) {
    return [];
  }

  const aspects = [
    { name: "conjunction", exact: 0, strength: 1 },
    { name: "opposition", exact: 180, strength: 0.82 },
  ];
  if (point.planet === "Saturn") aspects.push({ name: "Saturn 3rd aspect", exact: 60, strength: 0.72 }, { name: "Saturn 10th aspect", exact: 270, strength: 0.72 });
  if (point.planet === "Jupiter") aspects.push({ name: "Jupiter 5th aspect", exact: 120, strength: 0.78 }, { name: "Jupiter 9th aspect", exact: 240, strength: 0.78 });
  if (point.planet === "Mars") aspects.push({ name: "Mars 4th aspect", exact: 90, strength: 0.72 }, { name: "Mars 8th aspect", exact: 210, strength: 0.72 });
  if (point.planet === "Rahu" || point.planet === "Ketu") aspects.push({ name: `${point.planet} 5th aspect`, exact: 120, strength: 0.7 }, { name: `${point.planet} 9th aspect`, exact: 240, strength: 0.7 });

  return aspects
    .map((aspect) => {
      const actual = angularDistance(transitLongitude as number, ((natalLongitude as number) + aspect.exact) % 360);
      const orb = Math.round(actual * 100) / 100;
      if (orb > 5) return null;
      const closeness = Math.max(0, 1 - orb / 5);
      const nature = planetNature(point.planet);
      const baseScore = nature.weight * aspect.strength;
      const cuspBonus = natal.kind === "cusp" ? 4 : 0;
      const score = Math.min(88, Math.round(baseScore + closeness * 14 + cuspBonus));
      return {
        date: point.date,
        transitPlanet: point.planet,
        natalName: natal.name,
        natalKind: natal.kind,
        natalHouse: natal.house,
        aspect: aspect.name,
        orb,
        score,
        houseFromAscendant: point.houseFromAscendant,
        houseFromMoon: point.houseFromMoon,
        categories: hitEventCategories({ transitPlanet: point.planet, natalName: natal.name, natalHouse: natal.house }),
        meaning: buildRichMeaning(point.planet, point.nakshatra, natal.house, orb),
      };
    })
    .filter(Boolean) as Array<{
      date: string;
      transitPlanet: string;
      natalName: string;
      natalKind: "planet" | "cusp";
      natalHouse: number;
      aspect: string;
      orb: number;
      score: number;
      houseFromAscendant: number;
      houseFromMoon: number;
      categories: string[];
      meaning: string;
    }>;
}

function buildMonthlyTransitRippleReport(input: MonthlyTransitRippleRequest) {
  const nativeName = input.nativeName || "AstroLife Native";
  const points = [...(input.transitPoints ?? [])].sort((a, b) =>
    a.date.localeCompare(b.date) || a.planet.localeCompare(b.planet),
  );
  const byPlanet = new Map<string, MonthlyTransitRipplePoint[]>();
  const houseScores = new Map<number, number>();
  const natalPoints = input.natalPoints ?? [];

  // === WORLD-CLASS FIX #1: De-duplicate Closest Natal Hits by (transitPlanet, natalName, aspect) ===
  // Instead of showing Saturn→H7 cusp 9 times, show each unique combination once (best orb)
  const transitHitsByKey = new Map<string, Array<{
    date: string;
    transitPlanet: string;
    natalName: string;
    natalKind: "planet" | "cusp";
    natalHouse: number;
    aspect: string;
    orb: number;
    score: number;
    houseFromAscendant: number;
    houseFromMoon: number;
    categories: string[];
    meaning: string;
  }>>();

  points.flatMap((point) =>
    natalPoints.flatMap((natal) => aspectHitsForPoint(point, natal)),
  ).forEach((hit) => {
    const key = `${hit.transitPlanet}|${hit.natalName}|${hit.aspect}`;
    const existing = transitHitsByKey.get(key) ?? [];
    existing.push(hit);
    transitHitsByKey.set(key, existing);
  });

  // Keep best orb for each unique combination, then sort by score
  const transitHits = Array.from(transitHitsByKey.values())
    .map((hits) => hits.sort((a, b) => a.orb - b.orb)[0])
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  const strongestHits = transitHits.slice(0, 24);

  for (const point of points) {
    const list = byPlanet.get(point.planet) ?? [];
    list.push(point);
    byPlanet.set(point.planet, list);

    const nature = planetNature(point.planet);
    const dashaBonus =
      point.planet === input.currentMahadasha || point.planet === input.currentAntardasha
        ? 18
        : 0;
    houseScores.set(
      point.houseFromAscendant,
      (houseScores.get(point.houseFromAscendant) ?? 0) + nature.weight + dashaBonus,
    );
  }

  const planetTimelines = Array.from(byPlanet.entries()).map(([planet, planetPoints]) => {
    const windows: Array<ReturnType<typeof summarizeWindow>> = [];
    let current: MonthlyTransitRipplePoint[] = [];

    for (const point of planetPoints) {
      const previous = current[current.length - 1];
      const sameWindow =
        previous &&
        previous.sign === point.sign &&
        previous.nakshatra === point.nakshatra &&
        previous.speed === point.speed &&
        previous.houseFromAscendant === point.houseFromAscendant;

      if (!previous || sameWindow) {
        current.push(point);
      } else {
        windows.push(summarizeWindow(current));
        current = [point];
      }
    }
    if (current.length) windows.push(summarizeWindow(current));

    const first = planetPoints[0];
    const last = planetPoints[planetPoints.length - 1] ?? first;
    const signChanged = first.sign !== last.sign;
    const nakshatraChanged = first.nakshatra !== last.nakshatra;
    const nature = planetNature(planet);
    const dashaActive = planet === input.currentMahadasha || planet === input.currentAntardasha;
    const score = Math.min(88, nature.weight + (dashaActive ? 8 : 0) + (signChanged ? 3 : 0) + (nakshatraChanged ? 2 : 0));

    return {
      planet,
      score,
      dashaActive,
      role: nature.role,
      action: nature.action,
      current: `${first.sign} / ${first.nakshatra}`,
      ending: `${last.sign} / ${last.nakshatra}`,
      signChanged,
      nakshatraChanged,
      windows,
      narrative: `${planet} (${nature.role}) activates House ${first.houseFromAscendant} from the ascendant (${HOUSE_AREAS[first.houseFromAscendant]}) and House ${first.houseFromMoon} from the Moon (${HOUSE_AREAS[first.houseFromMoon]}). Its one-month role is ${nature.highExpression}. ${dashaActive ? "Because this planet is tied to the active dasha, its transit is LOUDER and more visible. Watch for concrete results." : "It should be read as a supporting transit unless it touches a promised natal area."} Best response: ${nature.action}`,
    };
  }).sort((a, b) => b.score - a.score);

  const topHouses = Array.from(houseScores.entries())
    .map(([house, score]) => ({ house, score, area: HOUSE_AREAS[house] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // === WORLD-CLASS FIX #2: Differentiate Life Areas by Relevant Transits ===
  // Each life area now scores based on hits MOST relevant to it, not all hits
  // Career scores HIGH if Sun/Saturn/Mercury hits H10/H6/H11, LOW if only Moon hits H7
  const eventScores = Object.keys(EVENT_RULES).map((key) => {
    const allHits = transitHits.filter((hit) => hit.categories.includes(key));

    // Primary hits: transits that are MAIN drivers for this life area
    const primaryRules = EVENT_RULES[key];
    const primaryHits = allHits.filter((hit) => {
      const isPrimaryPlanet = primaryRules.slice(0, 4).some(rule => rule === hit.transitPlanet);
      const isPrimaryCusp = primaryRules.some(rule => rule === `House ${hit.natalHouse} cusp`);
      return isPrimaryPlanet || isPrimaryCusp;
    });

    // Score calculation: primary hits weighted higher
    const primaryScore = primaryHits.slice(0, 6).reduce((sum, hit) => sum + hit.score, 0) / Math.max(1, primaryHits.length);
    const secondaryScore = allHits.slice(primaryHits.length, primaryHits.length + 3).reduce((sum, hit) => sum + hit.score * 0.7, 0) / Math.max(1, 3);
    const score = Math.min(88, Math.round((primaryScore * 0.75 + secondaryScore * 0.25) + (primaryHits.length > 0 ? 5 : 0)));

    const topHit = primaryHits[0] ?? allHits[0];
    return {
      key,
      label: EVENT_LABELS[key],
      score,
      status: score >= 80 ? "Major trigger" : score >= 62 ? "Strong visible period" : score >= 40 ? "Supportive background" : "Quiet",
      reason: topHit
        ? `${topHit.transitPlanet} ${topHit.aspect} ${topHit.natalName} on ${topHit.date} is the strongest proof.`
        : "No close natal hit found in the next month.",
      hits: primaryHits.slice(0, 4),
    };
  }).sort((a, b) => b.score - a.score);

  const peakWindows = eventScores
    .filter((event) => event.hits.length > 0)
    .slice(0, 8)
    .map((event) => {
      const peak = event.hits[0];
      const planetKB = PLANET_KNOWLEDGE[peak.transitPlanet];
      const houseKB = HOUSE_KNOWLEDGE[peak.natalHouse];
      return {
        category: event.label,
        startDate: event.hits[event.hits.length - 1]?.date ?? peak.date,
        peakDate: peak.date,
        endDate: event.hits[0]?.date ?? peak.date,
        score: event.score,
        reason: `${peak.transitPlanet} ${peak.aspect} ${peak.natalName} within ${peak.orb}° on ${peak.date}.`,
        prediction: `${event.label} is ${event.status.toLowerCase()} because ${peak.transitPlanet} (${planetKB?.role || "active transit"}) touches ${houseKB?.name || `House ${peak.natalHouse}`}. ${planetKB?.highExpression ? `Respond with: ${planetKB.highExpression}` : "Use the window for clean action."}`,
      };
    });

  const calendarDays = Array.from(new Set(points.map((point) => point.date))).map((date) => {
    const dayHits = transitHits.filter((hit) => hit.date === date);
    const score = Math.min(88, Math.round(dayHits.slice(0, 5).reduce((sum, hit) => sum + hit.score, 0) / 3));
    return {
      date,
      score,
      tone: score >= 80 ? "Peak" : score >= 60 ? "Active" : score >= 35 ? "Mixed" : "Background",
      highlights: dayHits.slice(0, 3).map((hit) => `${hit.transitPlanet} ${hit.aspect} ${hit.natalName}`),
    };
  });

  const dashaHits = transitHits.filter((hit) =>
    hit.transitPlanet === input.currentMahadasha ||
    hit.transitPlanet === input.currentAntardasha ||
    hit.natalName === input.currentMahadasha ||
    hit.natalName === input.currentAntardasha
  );
  const dashaTriggerLevel =
    dashaHits.length >= 6 ? "Major event trigger" :
      dashaHits.length >= 3 ? "Strong visible period" :
        dashaHits.length >= 1 ? "Supportive background" :
          "Weak/no major dasha trigger";

  const dailyHighlights = points
    .filter((point, index, arr) => {
      const prev = arr.find((candidate) => candidate.planet === point.planet && candidate.date < point.date);
      return !prev || prev.sign !== point.sign || prev.nakshatra !== point.nakshatra;
    })
    .slice(0, 18)
    .map((point) => ({
      date: point.date,
      planet: point.planet,
      title: `${point.planet} in ${point.sign} / ${point.nakshatra}`,
      house: point.houseFromAscendant,
      meaning: `${point.planet} highlights House ${point.houseFromAscendant}: ${HOUSE_AREAS[point.houseFromAscendant]}. Best action: ${planetNature(point.planet).action}.`,
    }));

  return {
    title: "AstroLife Monthly Transit Ripple Engine Report",
    nativeName,
    transitName: "All major transits for the next one month",
    periodLabel: input.periodLabel || `${input.startDate} to ${input.endDate}`,
    startDate: input.startDate,
    endDate: input.endDate,
    planetsScanned: planetTimelines.length,
    totalTransitPoints: points.length,
    topActivationHouses: topHouses,
    dashaTriggerLevel,
    transitHits: strongestHits,
    eventScores,
    peakWindows,
    calendarDays,
    planetTimelines,
    dailyHighlights,
    dashaBridge: {
      title: "Dasha-Transit Bridge",
      body: `${input.currentMahadasha || "Current"} mahadasha and ${input.currentAntardasha || "active"} antardasha decide which monthly transits become visible. Dasha-linked planets receive priority over generic movement.`,
      currentMahadasha: input.currentMahadasha || "Current",
      currentAntardasha: input.currentAntardasha || "Active",
    },
    remedySection: {
      title: "One-Month Transit Remedy Protocol",
      subtitle: "All planets, dasha-aware, action-first",
      body: `The strongest houses for this month are ${topHouses.map((item) => `House ${item.house}`).join(", ")}. Keep remedies practical and matched to the planet that is actually active.`,
      bullets: [
        ...topHouses.slice(0, 3).flatMap((house) => HOUSE_ACTIONS[house.house]),
        "Give extra attention to planets connected with current Mahadasha or Antardasha.",
        "Do not treat every daily Moon movement as a life-changing prediction; use it for mood and routine timing.",
      ],
    },
    personalForecast: eventScores.slice(0, 3).map((event) => {
      const hit = event.hits[0];
      if (!hit) return `${event.label}: quiet background this month. Do not force major decisions from transit alone.`;
      return `${event.label}: ${event.status}. ${hit.meaning} Prediction: this area can become visible around ${hit.date}. Best response is ${planetNature(hit.transitPlanet).action}.`;
    }),
    finalBookStyleConclusion: `${nativeName}, the next one month is not a single Saturn story. AstroLife scanned ${planetTimelines.length} transit planets across ${points.length} daily transit points from ${input.startDate} to ${input.endDate}, then checked close natal hits by degree. Dasha trigger level: ${dashaTriggerLevel}. The loudest activation zones are ${topHouses.map((item) => `House ${item.house} (${item.area})`).join("; ")}. Strongest event themes are ${eventScores.slice(0, 3).map((item) => `${item.label} ${item.score}/100`).join(", ")}. Use peak dates for planning and caution, not fear.`,
    pdfSections: [
      {
        title: "Monthly Transit Field",
        subtitle: `${input.startDate} to ${input.endDate}`,
        body: planetTimelines.map((item) => `${item.planet}: ${item.current} -> ${item.ending}; score ${item.score}/100`).join("\n"),
      },
      {
        title: "Top Activated Houses & Events",
        body: [
          ...topHouses.map((item) => `House ${item.house}: ${item.area}`),
          ...eventScores.slice(0, 5).map((item) => `${item.label}: ${item.score}/100 - ${item.status}`),
        ].join("\n"),
      },
      {
        title: "Peak Windows",
        body: peakWindows.map((item) => `${item.category}: peak ${item.peakDate}; ${item.reason}`).join("\n"),
      },
      {
        title: "Dasha Bridge",
        body: `${input.currentMahadasha || "Current"}-${input.currentAntardasha || "active"} dasha filters the transit results. Dasha-linked transits are interpreted as stronger.`,
      },
      {
        title: "Conclusion",
        body: "Use this one-month map for planning, not fear. Strong windows need clean action; pressure windows need discipline and patience.",
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  const requestId = createRequestId("transit");
  const startedAt = Date.now();

  try {
    const access = await getServerFeatureAccess("transit_ripple");
    if (!access.allowed) {
      monitor.warn("premium.blocked", {
        requestId,
        feature: access.feature,
        reason: access.reason,
        tier: access.tier,
      });

      return NextResponse.json(
        { ...premiumBlockedResponse(access), requestId },
        { status: access.authenticated ? 402 : 401 },
      );
    }

    const body = await req.json();

    if (body.mode === "monthly") {
      if (!body.ascendant || !body.startDate || !body.endDate || !Array.isArray(body.transitPoints)) {
        return NextResponse.json(
          {
            success: false,
            requestId,
            error: "Missing required monthly fields: ascendant, startDate, endDate, transitPoints",
          },
          { status: 400 },
        );
      }

      const report = buildMonthlyTransitRippleReport(body as MonthlyTransitRippleRequest);
      monitor.info("transit_ripple.monthly_generated", {
        requestId,
        engine: "typescript",
        tier: access.tier,
        transitPoints: body.transitPoints.length,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json({
        success: true,
        requestId,
        report: toCamelCase(report),
      });
    }

    if (
      !body.ascendant ||
      !body.transitPlanet ||
      !body.transitSign ||
      !body.transitNakshatra
    ) {
      return NextResponse.json(
        {
          success: false,
          requestId,
          error:
            "Missing required fields: ascendant, transitPlanet, transitSign, transitNakshatra",
        },
        { status: 400 },
      );
    }

    let parsed: unknown;

    try {
      const stdout = await runPythonTransitEngine(body);
      parsed = JSON.parse(stdout);
      monitor.info("transit_ripple.generated", {
        requestId,
        engine: "python",
        tier: access.tier,
        transitPlanet: body.transitPlanet,
        transitSign: body.transitSign,
        durationMs: Date.now() - startedAt,
      });
    } catch (engineError) {
      const message = engineError instanceof Error ? engineError.message : "";
      if (!message.includes("ENOENT") && !message.includes("python3")) {
        throw engineError;
      }

      parsed = buildTsTransitRippleReport(body as TransitRippleRequest);
      monitor.warn("transit_ripple.python_unavailable_fallback_used", {
        requestId,
        tier: access.tier,
        transitPlanet: body.transitPlanet,
        transitSign: body.transitSign,
        durationMs: Date.now() - startedAt,
      });
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "success" in parsed &&
      (parsed as { success?: unknown }).success === false
    ) {
      return NextResponse.json(
        {
          success: false,
          requestId,
          error:
            String((parsed as { error?: unknown }).error || "") ||
            "Transit engine failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      requestId,
      report: toCamelCase(parsed),
    });
  } catch (error) {
    monitor.error("transit_ripple.failed", error, {
      requestId,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(
      {
        success: false,
        requestId,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate transit ripple report",
      },
      { status: 500 },
    );
  }
}
