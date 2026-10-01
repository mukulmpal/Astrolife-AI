import { NextRequest, NextResponse } from "next/server";
import { computePlanets } from "@/lib/astro-engine/calculations";
import { resolveNakshatraCoordinate } from "@/lib/astro-engine/ayanamsa-config";
import {
  CLASSICAL_TARAS,
  calculateCountedPosition,
  calculateTaraNumber,
  getParyayaByPosition,
} from "@/lib/astro-engine/navtara-engine";
import { NAKSHATRA_DATA } from "@/lib/astro-engine/nakshatra-data";

export const runtime = "nodejs";

const TARA_ACTION_GUIDE: Record<
  number,
  {
    bestFor: string[];
    avoid: string[];
    microRemedy?: string;
  }
> = {
  1: {
    bestFor: ["Self-care & physical grounding", "Routine wellness & health checks", "Internal planning & meditation"],
    avoid: ["High-friction arguments", "Over-exhausting physical tasks", "Starting heavy debt"],
    microRemedy: "Om Som Somaya Namah (11x) chant with a glass of pure water.",
  },
  2: {
    bestFor: ["Financial investments & asset purchases", "Signing contracts & partnerships", "Commerce & commercial launches"],
    avoid: ["Hesitation on good deals", "Careless lending of capital"],
  },
  3: {
    bestFor: ["Quiet research & internal study", "Solitary spiritual reflection", "Auditing accounts & reviewing documents"],
    avoid: ["Major travel & driving at high speed", "Starting new legal disputes", "Irreversible commitments"],
    microRemedy: "Light a ghee lamp in the evening or offer water to the Sun (Surya Gayatri).",
  },
  4: {
    bestFor: ["Domestic harmony & family discussions", "Property stabilization & home buying", "Health recovery & settling debts"],
    avoid: ["Hasty disruptions of steady routines", "Aggressive confrontation"],
  },
  5: {
    bestFor: ["Competitive strategy & market analysis", "Dismantling old obstacles", "Physical workout & disciplined focus"],
    avoid: ["Emotional confrontations with partners", "Lending money to peers", "Impulsive purchases"],
    microRemedy: "Hanuman Chalisa or Gayatri Mantra recital for energetic protection.",
  },
  6: {
    bestFor: ["Goal accomplishment & major milestones", "Meeting influential mentors/bosses", "Spiritual sadhana & rituals"],
    avoid: ["Procrastination on critical duties", "Arrogance or dismissive talk"],
  },
  7: {
    bestFor: ["Introspection, detachment & quiet meditation", "Discarding obsolete belongings", "Healing & medical rest"],
    avoid: ["Starting marriage talks or ceremonies", "Signing binding long-term contracts", "Confrontations"],
    microRemedy: "Feed a stray dog or cow, and chant Mahamrityunjaya Mantra (11x).",
  },
  8: {
    bestFor: ["Social alliances, networking & client pitches", "Creative arts, music & celebrations", "Repairing strained friendships"],
    avoid: ["Pessimism or isolating yourself"],
  },
  9: {
    bestFor: ["High-level negotiations & closing grand deals", "Pilgrimage & charitable donations", "Deep long-term life plans"],
    avoid: ["Over-promising beyond your capacity"],
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nakshatraParam = searchParams.get("nakshatra") || searchParams.get("star") || "Rohini";
    const result = evaluateDailyTaraDigest(nakshatraParam);
    return NextResponse.json({ ok: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Daily Tara calculation failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const nakshatraParam =
      body.nakshatra ||
      body.birthNakshatra ||
      body.star ||
      body.chart?.planets?.Moon?.nakshatra ||
      "Rohini";

    const result = evaluateDailyTaraDigest(nakshatraParam);
    return NextResponse.json({ ok: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Daily Tara calculation failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

function evaluateDailyTaraDigest(birthNakInput: string | number) {
  // 1. Resolve Native Janma Star
  const clean = String(birthNakInput).trim().toLowerCase();
  const birthNak = typeof birthNakInput === "number"
    ? NAKSHATRA_DATA.find((n) => n.id === birthNakInput)
    : NAKSHATRA_DATA.find((n) => n.name.toLowerCase() === clean);

  if (!birthNak) {
    throw new Error(`Unrecognized Nakshatra: "${birthNakInput}". Valid names: Ashwini, Bharani, Krittika, Rohini, ...`);
  }

  // 2. Compute Today's Gochar Moon Nakshatra
  const now = new Date();
  const jd = 2440587.5 + now.getTime() / 86400000;
  const transitLons = computePlanets(jd);
  const moonLon = transitLons.Moon ?? 0;
  const todayCoord = resolveNakshatraCoordinate(moonLon, jd, "Lahiri_Chitrapaksha");
  const todayNak = todayCoord.nakshatra;

  // 3. Counted Position & Tara Number
  const countedPos = calculateCountedPosition(birthNak.id, todayNak.id);
  const taraNum = calculateTaraNumber(birthNak.id, todayNak.id);
  const tara = CLASSICAL_TARAS[taraNum];
  const { paryaya, paryayaIntensity } = getParyayaByPosition(countedPos);

  const isAfflicted = [3, 5, 7].includes(taraNum);
  const isJanmaTara = taraNum === 1;

  let nature: "AUSPICIOUS" | "JANMA" | "CAUTION" = "AUSPICIOUS";
  let statusColor = "#22C55E"; // Green
  let statusEmoji = "🟢";

  if (isAfflicted) {
    nature = "CAUTION";
    statusColor = "#EF4444"; // Red
    statusEmoji = "🔴";
  } else if (isJanmaTara) {
    nature = "JANMA";
    statusColor = "#F97316"; // Orange
    statusEmoji = "🟠";
  }

  const guide = TARA_ACTION_GUIDE[taraNum] ?? {
    bestFor: ["Routine tasks and mindful focus"],
    avoid: ["Impulsive disruptions"],
  };

  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 4. Pre-formatted Notification Digest Payload
  const notificationDigest = `${statusEmoji} Aaj Ka Tara: ${tara.name} (Tara #${taraNum})
🗓️ ${formattedDate}
✨ Today's Moon: ${todayNak.name} (Pada ${todayCoord.pada})
🧘 Your Birth Star: ${birthNak.name} (Chakra Pos #${countedPos})
Status: ${nature === "AUSPICIOUS" ? "Auspicious Momentum" : nature === "JANMA" ? "Sensitive Self-Alignment" : "Cautionary Remedial Focus"}

✦ Best For Today:
${guide.bestFor.map((b) => `• ${b}`).join("\n")}

✦ Avoid Today:
${guide.avoid.map((a) => `• ${a}`).join("\n")}
${guide.microRemedy ? `\n🛡️ 1-Minute Micro-Upay:\n${guide.microRemedy}` : ""}`;

  return {
    date: formattedDate,
    timestamp: now.toISOString(),
    birthNakshatra: {
      id: birthNak.id,
      name: birthNak.name,
      lord: birthNak.lord,
    },
    transitMoon: {
      nakshatra: todayNak.name,
      pada: todayCoord.pada,
      longitude: Number(moonLon.toFixed(2)),
    },
    tara: {
      number: taraNum,
      name: tara.name,
      category: tara.category,
      icon: tara.icon,
      countedPosition: countedPos,
      paryaya,
      paryayaIntensity,
      nature,
      statusColor,
      statusEmoji,
      signification: tara.signification,
      practicalAdvice: tara.practicalAdvice,
    },
    actionGuide: {
      primeActivities: guide.bestFor,
      activitiesToAvoid: guide.avoid,
      microRemedy: guide.microRemedy ?? null,
    },
    notificationPayload: {
      title: `${statusEmoji} Aaj Ka Tara: ${tara.name} (#${taraNum})`,
      body: `${nature === "AUSPICIOUS" ? "🟢 Auspicious Day" : nature === "JANMA" ? "🟠 Sensitive Day" : "🔴 Caution Day"}: ${guide.bestFor[0]}`,
      fullDigest: notificationDigest,
    },
  };
}
