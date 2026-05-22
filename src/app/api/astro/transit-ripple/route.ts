import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import { createRequestId, monitor } from "@/lib/server-monitoring";

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

export async function POST(req: NextRequest) {
  const requestId = createRequestId("transit");
  const startedAt = Date.now();

  try {
    const body = await req.json();

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
