// src/lib/astro-engine/future-transit-timeline.ts
// ============================================================
// ASTROLIFE PRE-COMPUTED MAJOR TRANSIT TIMELINE (2025–2030)
// Lightning-fast (<0.1ms) deterministic transit house mapper.
// Prevents AI hallucinations on future Saturn, Jupiter, Rahu/Ketu transits.
// ============================================================

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

type ZodiacSign = typeof SIGNS[number];

const SIGN_HINDI: Record<ZodiacSign, string> = {
  Aries: "मेष",
  Taurus: "वृषभ",
  Gemini: "मिथुन",
  Cancer: "कर्क",
  Leo: "सिंह",
  Virgo: "कन्या",
  Libra: "तुला",
  Scorpio: "वृश्चिक",
  Sagittarius: "धनु",
  Capricorn: "मकर",
  Aquarius: "कुंभ",
  Pisces: "मीन",
};

interface TransitSpan {
  planet: "Saturn" | "Jupiter" | "Rahu" | "Ketu";
  hindiName: string;
  sign: ZodiacSign;
  period: string;
  dignityNote?: string;
}

// Canonical Sidereal (Chitrapaksha / Lahiri) Ingress Windows 2025–2030
const MAJOR_TRANSIT_SPANS: TransitSpan[] = [
  // ── SATURN (SHANI) — ~2.5 Years per Sign ──
  {
    planet: "Saturn",
    hindiName: "शनि",
    sign: "Pisces",
    period: "Mar 2025 – Jun 2027 (and retro Oct 2027 – Feb 2028)",
    dignityNote: "Water sign / Guru kshetra",
  },
  {
    planet: "Saturn",
    hindiName: "शनि",
    sign: "Aries",
    period: "Jun 2027 – Oct 2027, and Feb 2028 – Aug 2029",
    dignityNote: "Debilitated (Neecha) — requires patience & hard discipline",
  },
  {
    planet: "Saturn",
    hindiName: "शनि",
    sign: "Taurus",
    period: "Aug 2029 – Oct 2031",
    dignityNote: "Friendly Venus sign — stabilization & career consolidation",
  },

  // ── JUPITER (GURU) — ~1 Year per Sign ──
  {
    planet: "Jupiter",
    hindiName: "बृहस्पति",
    sign: "Taurus",
    period: "May 2024 – May 2025",
    dignityNote: "Wealth & resource expansion",
  },
  {
    planet: "Jupiter",
    hindiName: "बृहस्पति",
    sign: "Gemini",
    period: "May 2025 – Oct 2025 & Dec 2025 – Jun 2026",
    dignityNote: "Intellectual communication & networking",
  },
  {
    planet: "Jupiter",
    hindiName: "बृहस्पति",
    sign: "Cancer",
    period: "Jun 2026 – Oct 2026 & Jan 2027 – Jun 2027",
    dignityNote: "Exalted (Uccha) — maximum spiritual, domestic & prosperity grace",
  },
  {
    planet: "Jupiter",
    hindiName: "बृहस्पति",
    sign: "Leo",
    period: "Oct 2026 – Jan 2027, Jun 2027 – Nov 2027 & Feb 2028 – Jul 2028",
    dignityNote: "Friendly royal sign — leadership & recognition",
  },
  {
    planet: "Jupiter",
    hindiName: "बृहस्पति",
    sign: "Virgo",
    period: "Nov 2027 – Feb 2028 & Jul 2028 – Dec 2028",
    dignityNote: "Analytical discernment & workplace problem solving",
  },
  {
    planet: "Jupiter",
    hindiName: "बृहस्पति",
    sign: "Libra",
    period: "Dec 2028 – Mar 2029 & Aug 2029 – Jan 2030",
    dignityNote: "Partnership, harmony & trade expansion",
  },

  // ── RAHU & KETU — ~1.5 Years per Sign ──
  {
    planet: "Rahu",
    hindiName: "राहु",
    sign: "Aquarius",
    period: "May 2025 – Dec 2026",
    dignityNote: "Moolatrikona / Co-lord — tech breakthroughs & unconventional gains",
  },
  {
    planet: "Ketu",
    hindiName: "केतु",
    sign: "Leo",
    period: "May 2025 – Dec 2026",
    dignityNote: "Ego detachment & spiritual authority",
  },
  {
    planet: "Rahu",
    hindiName: "राहु",
    sign: "Capricorn",
    period: "Dec 2026 – Jul 2028",
    dignityNote: "Ambition & status restructuring",
  },
  {
    planet: "Ketu",
    hindiName: "केतु",
    sign: "Cancer",
    period: "Dec 2026 – Jul 2028",
    dignityNote: "Emotional detachment & inner peace",
  },
  {
    planet: "Rahu",
    hindiName: "राहु",
    sign: "Sagittarius",
    period: "Jul 2028 – Feb 2030",
    dignityNote: "Philosophical reorientation",
  },
  {
    planet: "Ketu",
    hindiName: "केतु",
    sign: "Gemini",
    period: "Jul 2028 – Feb 2030",
    dignityNote: "Intuitive mastery over communication",
  },
];

function normalizeSignName(sign: string): ZodiacSign | null {
  if (!sign) return null;
  const clean = sign.trim().toLowerCase();
  for (const s of SIGNS) {
    if (clean === s.toLowerCase() || clean.startsWith(s.toLowerCase())) {
      return s;
    }
  }
  return null;
}

export function houseFrom(baseSign: string, targetSign: string): number {
  const b = SIGNS.indexOf(baseSign as ZodiacSign);
  const t = SIGNS.indexOf(targetSign as ZodiacSign);
  if (b < 0 || t < 0) return 1;
  return ((t - b + 12) % 12) + 1;
}

export interface TransitTimelineItem {
  planet: string;
  hindiName: string;
  sign: string;
  signHindi: string;
  period: string;
  houseFromLagna: number;
  houseFromMoon: number;
  dignityNote?: string;
}

export function buildFutureTransitTimeline(
  lagnaSignRaw: string,
  moonSignRaw: string
): {
  items: TransitTimelineItem[];
  promptBlock: string;
} {
  const lagna = normalizeSignName(lagnaSignRaw) || "Aries";
  const moon = normalizeSignName(moonSignRaw) || "Aries";

  const items: TransitTimelineItem[] = MAJOR_TRANSIT_SPANS.map((span) => {
    const hLagna = houseFrom(lagna, span.sign);
    const hMoon = houseFrom(moon, span.sign);
    return {
      planet: span.planet,
      hindiName: span.hindiName,
      sign: span.sign,
      signHindi: SIGN_HINDI[span.sign],
      period: span.period,
      houseFromLagna: hLagna,
      houseFromMoon: hMoon,
      dignityNote: span.dignityNote,
    };
  });

  const saturnLines = items
    .filter((i) => i.planet === "Saturn")
    .map(
      (i) =>
        `  ✦ ${i.period}: ${i.sign} (${i.signHindi}) → H${i.houseFromLagna} from Lagna | H${i.houseFromMoon} from Moon [${i.dignityNote || ""}]`
    )
    .join("\n");

  const jupiterLines = items
    .filter((i) => i.planet === "Jupiter")
    .map(
      (i) =>
        `  ✦ ${i.period}: ${i.sign} (${i.signHindi}) → H${i.houseFromLagna} from Lagna | H${i.houseFromMoon} from Moon [${i.dignityNote || ""}]`
    )
    .join("\n");

  const nodalLines = items
    .filter((i) => i.planet === "Rahu" || i.planet === "Ketu")
    .map(
      (i) =>
        `  ✦ ${i.planet} in ${i.sign} (${i.period}): H${i.houseFromLagna} from Lagna | H${i.houseFromMoon} from Moon`
    )
    .join("\n");

  const promptBlock = `### PRE-COMPUTED MAJOR TRANSIT TIMELINE (2025–2030)
[STRICT SHASTRIC DIRECTIVE: Always use this exact pre-calculated table for any future timing (job, marriage, wealth). DO NOT guess or hallucinate transit houses.]
Native Lagna (Ascendant): ${lagna} (${SIGN_HINDI[lagna]}) | Moon Sign (Chandra Lagna): ${moon} (${SIGN_HINDI[moon]})

1. SHANI (SATURN) TRANSIT TIMELINE:
${saturnLines}

2. GURU (JUPITER) TRANSIT TIMELINE:
${jupiterLines}

3. RAHU & KETU NODAL AXIS TIMELINE:
${nodalLines}`;

  return { items, promptBlock };
}
