import { generateGemstoneReportFromChart } from "@/lib/astro-engine/gemstone";
import { calculateKpReport } from "@/lib/astro-engine/kp";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import { calculateLalKitab } from "@/lib/astro-engine/lalkitab";
import { calculateLalKitabTimeEngine } from "@/lib/lal-kitab";
import { calculateShadbala } from "@/lib/astro-engine/shadbala";
import { calculateAshtakavarga } from "@/lib/astro-engine/ashtakavarga";
import { calculateVastu } from "@/lib/astro-engine/vastu";
import { calculatePsychology } from "@/lib/astro-engine/psychology";
import { calculateDivisional, getDashamshaAnalysis, getNavamshaAnalysis } from "@/lib/astro-engine/divisional";
import {
  analyzeUniversalShodashaVarga,
  extractDashaInput,
  formatVargaLabel,
} from "@/lib/astro-intelligence/universal-shodasha-varga-engine";
import { calculateDestiny } from "@/lib/astro-engine/destiny";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import { calculateTransitReport } from "@/lib/astro-engine/transits";
import { calculateEventRadarReport } from "@/lib/astro-engine/event-radar";
import { calculateMedical } from "@/lib/astro-engine/medical";
import { calculateRemedies } from "@/lib/astro-engine/remedy";
import { calculateSarvatobhadra } from "@/lib/astro-engine/sarvatobhadra";
import { calculateSpecialLagnas } from "@/lib/astro-engine/special-lagnas";
import { buildMarriageIntelligenceV2 } from "@/lib/astro-engine/marriage-intelligence-v2";
import { analyzeRelationshipIntelligence } from "@/lib/astro-engine/relationship-intelligence";
import type { RelationshipInput } from "@/lib/astro-engine/relationship-intelligence";
import { buildTransitRipplePayloadFromChart } from "@/lib/astro-engine/transit-ripple-v4";
import type { TransitRipplePlanet } from "@/lib/astro-engine/transit-ripple-v4";
import { calculateKarakas, calculateArudhas, calculateCharaDasha } from "@/lib/astro-engine/jaimini";
import { runAstroSound } from "@/lib/astro-engine/astro-sound";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/report-data.ts

export type ReportSignal = "Excellent" | "Good" | "Mixed" | "Caution" | "Sensitive";

export interface ReportSection {
  id: string;
  title: string;
  subtitle: string;
  signal: ReportSignal;
  score: number;
  paragraphs: string[];
  summary: string[];
  actionPlan: string[];
  remedy: string[];
  qa?: {
    status: "verified" | "needs-review" | "fallback";
    evidence: string[];
  };
}

export interface ReportPlanet {
  name: string;
  sign: string;
  degree: string;
  nakshatra: string;
  house: string;
  status: string;
}

export interface PremiumReportData {
  nativeName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  generatedAt: string;
  lagna: string;
  moonSign: string;
  nakshatra: string;
  currentDasha: string;
  reportTitle: string;
  executiveSummary: string[];
  keyHighlights: string[];
  planets: ReportPlanet[];
  sections: ReportSection[];
}

function safeText(value: any, fallback: string) {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function getBirthDetails(input: any) {
  const root = input ?? {};
  const birth = root.birth ?? root.birthDetails ?? root.user ?? root.profile ?? {};

  return {
    name: safeText(root.name ?? birth.name ?? birth.fullName, "AstroLife User"),
    date: safeText(
      birth.date ??
        birth.dob ??
        birth.dateOfBirth ??
        root.dateOfBirth ??
        root.dob,
      "Not provided"
    ),
    time: safeText(
      birth.time ??
        birth.tob ??
        birth.timeOfBirth ??
        root.timeOfBirth ??
        root.tob,
      "Not provided"
    ),
    place: safeText(
      birth.place ??
        birth.city ??
        birth.birthPlace ??
        root.birthPlace ??
        root.city,
      "Not provided"
    ),
  };
}

function getChartRoot(input: any) {
  return input?.chart ?? input?.chartData ?? input ?? {};
}

function getPlanet(rawChart: any, planet: string): any {
  const lower = planet.toLowerCase();

  return (
    rawChart?.planets?.[planet] ??
    rawChart?.planets?.[lower] ??
    rawChart?.planetData?.[planet] ??
    rawChart?.planetData?.[lower] ??
    rawChart?.grahas?.[planet] ??
    rawChart?.grahas?.[lower] ??
    {}
  );
}

function formatDegree(value: any) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value.toFixed(2)}°`;
  }

  if (typeof value === "string" && value.trim()) {
    return value.includes("°") ? value : `${value}`;
  }

  return "—";
}

function signFromValue(value: any) {
  const signs = [
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
  ];

  if (typeof value === "string" && value.trim()) return value;

  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 0 && value <= 11) return signs[value];
    if (value >= 1 && value <= 12) return signs[value - 1];
    return signs[Math.floor((((value % 360) + 360) % 360) / 30)];
  }

  return "—";
}

function planetStatus(planet: string) {
  const benefics = ["Jupiter", "Venus", "Mercury"];
  const malefics = ["Saturn", "Mars", "Rahu", "Ketu"];

  if (benefics.includes(planet)) return "Supportive";
  if (malefics.includes(planet)) return "Karmic";
  if (planet === "Moon") return "Emotional";
  if (planet === "Sun") return "Authority";
  return "Neutral";
}

function getLagnaSign(rawChart: any): string {
  return signFromValue(
    rawChart?.lagna?.sign ??
      rawChart?.ascendant?.sign ??
      rawChart?.lagnaRashi ??
      rawChart?.ascendantRashi ??
      rawChart?.lagR ??
      rawChart?.lagnaNum
  );
}

function formatDateLike(value: any): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return safeText(value, "");

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function getActiveDasha(rawChart: any): any {
  const dashas = Array.isArray(rawChart?.dashas) ? rawChart.dashas : [];
  const active = dashas.find((entry: any) => entry?.active) ?? dashas[0];

  return (
    rawChart?.currentDasha ??
    rawChart?.dasha?.current ??
    rawChart?.runningDasha ??
    rawChart?.activeDasha ??
    active ??
    null
  );
}

function formatDashaLabel(value: any): string {
  if (!value) return "To be calculated";
  if (typeof value === "string") return value;

  const planet = value?.planet ?? value?.name ?? value?.lord ?? value?.dashaLord;
  if (!planet) return safeText(value, "To be calculated");

  const start = formatDateLike(value?.start ?? value?.startDate ?? value?.from);
  const end = formatDateLike(value?.end ?? value?.endDate ?? value?.to);
  const range = start || end ? ` (${[start, end].filter(Boolean).join(" - ")})` : "";

  return `${planet} Mahadasha${range}`;
}

function getEngineChart(input: any): any {
  const root = getChartRoot(input);
  return root?.planets ? root : input;
}

function getChartDate(input: any): Date {
  const root = getEngineChart(input);
  const date = safeText(root?.dob ?? root?.dateOfBirth ?? root?.birth?.dob, "");
  const parsed = date ? new Date(`${date}T12:00:00`) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function safeSection(
  fallbackId: string,
  title: string,
  error: unknown,
): ReportSection {
  return makeSection({
    id: fallbackId,
    title,
    subtitle: "Real engine call failed.",
    score: 45,
    paragraphs: [
      `AstroLife attempted to call the real ${title} engine for this PDF section, but the engine did not return a usable result.`,
      `Failure detail: ${error instanceof Error ? error.message : "Unknown engine error"}.`,
    ],
    summary: [
      "This section is not using generic interpretation intentionally.",
      "The engine call needs to be fixed or given the expected chart payload.",
    ],
    actionPlan: [
      "Check the engine input contract.",
      "Confirm the chart object contains planets, houses, lagna and birth data.",
    ],
    remedy: ["Do not treat this failed section as a prediction."],
    qa: {
      status: "fallback",
      evidence: ["Engine call failed.", "Section is blocked from confident interpretation."],
    },
  });
}

function buildPlanets(rawChart: any): ReportPlanet[] {
  const planetNames = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
  ];

  return planetNames.map((name) => {
    const data = getPlanet(rawChart, name);

    const longitude =
      data?.longitude ??
      data?.lon ??
      data?.degree ??
      data?.absoluteDegree ??
      data?.siderealLongitude;

    return {
      name,
      sign: signFromValue(
        data?.sign ??
          data?.rashi ??
          data?.rashiName ??
          data?.signName ??
          longitude
      ),
      degree: formatDegree(longitude ?? data?.degree),
      nakshatra: safeText(data?.nakshatra ?? data?.nakshatraName, "—"),
      house: safeText(data?.house, "—"),
      status: safeText(data?.status, planetStatus(name)),
    };
  });
}

function getSignal(score: number): ReportSignal {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Mixed";
  if (score >= 30) return "Caution";
  return "Sensitive";
}

function makeSection(params: {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  paragraphs: string[];
  summary: string[];
  actionPlan: string[];
  remedy: string[];
  qa?: ReportSection["qa"];
}): ReportSection {
  return {
    ...params,
    qa: params.qa ?? {
      status: params.subtitle.toLowerCase().includes("fallback") || params.subtitle.toLowerCase().includes("failed")
        ? "fallback"
        : params.score < 55
          ? "needs-review"
          : "verified",
      evidence: [
        `${params.paragraphs.length} paragraphs`,
        `${params.summary.length} summary points`,
        `${params.actionPlan.length} action steps`,
        `${params.remedy.length} remedy lines`,
      ],
    },
    signal: getSignal(params.score),
  };
}
function getListFromKeys(source: any, keys: string[]) {
  for (const key of keys) {
    const value = source?.[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function normalizeAstroItem(item: any, fallbackName: string) {
  if (typeof item === "string") {
    return {
      name: item,
      description: "",
      strength: "",
      category: "",
      active: true,
    };
  }

  return {
    name: safeText(item?.name ?? item?.title ?? item?.yoga ?? item?.dosha, fallbackName),
    description: safeText(
      item?.description ??
        item?.effect ??
        item?.meaning ??
        item?.result ??
        item?.summary,
      ""
    ),
    strength: safeText(item?.strength ?? item?.score ?? item?.severity ?? item?.level, ""),
    category: safeText(item?.category ?? item?.type, ""),
    active:
      item?.active === true ||
      item?.isActive === true ||
      item?.present === true ||
      item?.detected === true ||
      item?.found === true,
  };
}

function filterActiveOrTop(items: any[]) {
  const normalized = items.map((item, index) => normalizeAstroItem(item, `Item ${index + 1}`));
  const hasActiveFlag = normalized.some((item) => item.active);

  if (hasActiveFlag) {
    return normalized.filter((item) => item.active);
  }

  return normalized;
}

export function buildYogasDoshasReportSection(source: any): ReportSection {
  const rawYogas =
    getListFromKeys(source, [
      "activeYogas",
      "detectedYogas",
      "matchedYogas",
      "yogas",
      "positiveYogas",
      "rajaYogas",
      "dhanaYogas",
    ]) ?? [];

  const rawDoshas =
    getListFromKeys(source, [
      "activeDoshas",
      "detectedDoshas",
      "matchedDoshas",
      "doshas",
      "negativeDoshas",
      "afflictions",
    ]) ?? [];

  const yogas = filterActiveOrTop(rawYogas).slice(0, 8);
  const doshas = filterActiveOrTop(rawDoshas).slice(0, 5);

  const yogaNames = yogas.map((item) => item.name).filter(Boolean);
  const doshaNames = doshas.map((item) => item.name).filter(Boolean);

  const yogaLine = yogaNames.length
    ? yogaNames.join(", ")
    : "No major yoga was strongly detected from the available engine output.";

  const doshaLine = doshaNames.length
    ? doshaNames.join(", ")
    : "No major dosha was strongly detected from the available engine output.";

  const score = Math.max(
    42,
    Math.min(88, 58 + yogaNames.length * 4 - doshaNames.length * 3)
  );

  return makeSection({
    id: "yogas-doshas",
    title: "Yogas & Doshas",
    subtitle: "Special combinations, karmic patterns and practical remedies.",
    score,
    paragraphs: [
      `Yogas and doshas are among the most important interpretive layers in Vedic astrology. A yoga shows a special planetary combination that can create potential for success, intelligence, prosperity, fame, spiritual growth, leadership, creativity or protection. A dosha shows an area where karmic pressure, delay, imbalance, emotional challenge or repeated life lessons may appear. Both should be understood carefully, because a yoga does not automatically give results unless supported by strength, dasha and transit, and a dosha does not destroy life when awareness, remedies and right action are present.`,

      `In this chart, the active yoga pattern highlights the areas where life can produce stronger results when the native works with discipline and clarity. The main yoga indications found are: ${yogaLine}. These combinations should be treated as potential seeds. They become more visible when their planets are strong, when their dasha period operates, or when supportive transits activate the connected houses.`,

      `The dosha pattern shows where life may ask for maturity, patience and correction. The main dosha or sensitive indications found are: ${doshaLine}. These combinations should not be read with fear. They simply show where extra awareness is needed. A dosha often becomes a source of growth when the native chooses better habits, avoids repeated mistakes, performs remedies and takes practical responsibility.`,

      `The correct way to use this section is to combine it with dasha and transit. If a yoga planet is active in the current dasha, the positive promise can become more visible. If a dosha planet is active, the native should be more careful in that area and follow remedies. Therefore, Yogas and Doshas are not isolated labels; they are timing-sensitive karmic patterns.`,
    ],
    summary: [
      yogaNames.length
        ? `Top yogas detected: ${yogaNames.slice(0, 4).join(", ")}.`
        : "No strong yoga was detected from the current engine output.",
      doshaNames.length
        ? `Sensitive doshas detected: ${doshaNames.slice(0, 3).join(", ")}.`
        : "No strong dosha was detected from the current engine output.",
      "Yogas give potential, but dasha and planetary strength decide activation.",
      "Doshas show correction areas, not fixed negative destiny.",
      "Remedies work best when combined with practical behavioural change.",
    ],
    actionPlan: [
      "Use active yogas as strength areas and build skills around them.",
      "Do not fear doshas; identify the life pattern they are asking you to correct.",
      "Check current dasha and transit before expecting major yoga results.",
      "Follow remedies consistently instead of doing them only during crisis.",
    ],
    remedy: [
      "Light a diya daily with gratitude and calm intention.",
      "Respect parents, teachers, elders and spiritual guides.",
      "Donate food, clothes or learning material according to capacity.",
      "Avoid harsh speech, impulsive decisions and repeated negative habits.",
    ],
  });
}
export function buildPremiumReportData(input: any): PremiumReportData {
  const birth = getBirthDetails(input);
  const rawChart = getChartRoot(input);

  const lagna = getLagnaSign(rawChart) || "—";

  const moon = getPlanet(rawChart, "Moon");
  const moonSign = signFromValue(moon?.sign ?? moon?.rashi ?? moon?.longitude);
  const nakshatra = safeText(moon?.nakshatra ?? moon?.nakshatraName, "—");

  const planets = buildPlanets(rawChart);

  const sections: ReportSection[] = [
    makeSection({
      id: "personality",
      title: "Personality & Life Pattern",
      subtitle: "How your Lagna, Moon and planetary pattern shape your nature.",
      score: 76,
      paragraphs: [
        `Your birth chart indicates a personality that is shaped by both instinct and responsibility. The Lagna represents the way you enter the world, make decisions, and respond to challenges, while the Moon represents your emotional rhythm, inner security, and mental habits. When these two layers are studied together, they reveal not only how you appear to others, but also how you process life internally.`,
        `The chart suggests that your life improves whenever you combine intuition with structure. You may have phases where your mind moves faster than your circumstances, and this can create impatience or emotional restlessness. However, your deeper potential is activated when you work patiently, build consistency, and avoid reacting to temporary pressure.`,
        `A strong personality pattern is visible through your ability to learn from repeated experiences. You are not meant to live only by impulse. Your chart supports growth through self-awareness, disciplined choices, and the ability to convert emotional experiences into wisdom. This makes your life path more mature with age.`,
      ],
      summary: [
        "Your personality is shaped by both emotional intelligence and practical responsibility.",
        "Growth increases when you combine intuition with discipline.",
        "Avoid reacting too quickly during emotionally charged periods.",
        "Your maturity and confidence improve with time.",
        "Self-awareness is one of your strongest life tools.",
      ],
      actionPlan: [
        "Maintain a daily routine that balances emotional rest and focused work.",
        "Avoid making major decisions during mood swings.",
        "Use journaling or reflection to understand repeated life patterns.",
      ],
      remedy: [
        "Begin important days with a short prayer or grounding practice.",
        "Respect elders, teachers and mentors.",
        "Keep your speech calm during stressful periods.",
      ],
    }),

    makeSection({
      id: "career",
      title: "Career & Public Life",
      subtitle: "Professional direction, success pattern and responsibility cycle.",
      score: 74,
      paragraphs: [
        `Your career path shows a connection between ambition, skill development, communication, and long-term recognition. The professional houses in a horoscope do not only show job or business; they show the way a person contributes to society and builds visible identity. Your chart suggests that career growth comes through repeated effort, practical learning, and the ability to handle responsibility without losing direction.`,
        `There may be times when your work does not receive immediate appreciation. This does not mean the effort is wasted. It indicates that your professional karma matures gradually. If Saturn-like influence is active, the path can feel delayed, heavy, or demanding, but it also gives the power to build reputation that lasts. If Mercury, Jupiter or Venus are supportive, your work can benefit through communication, teaching, advisory roles, design, management, content, technology or client-facing skills.`,
        `The current life phase supports system-building rather than random experimentation. You should avoid impulsive job changes, emotional resignations, or reacting to workplace politics. Instead, focus on portfolio, skill upgrade, networking, communication with seniors, and building a public proof of your abilities. This is a chart that grows when discipline becomes stronger than frustration.`,
      ],
      summary: [
        "Career growth is supported but requires patience and consistency.",
        "Recognition may come slowly, but it can become stable.",
        "Skill development and communication are important.",
        "Avoid impulsive workplace decisions.",
        "Best growth comes through structure, planning and long-term execution.",
      ],
      actionPlan: [
        "Update your portfolio, resume or work profile.",
        "Build one high-value professional skill over the next 90 days.",
        "Document your work clearly and communicate professionally.",
      ],
      remedy: [
        "Offer water to the Sun in the morning.",
        "Maintain discipline on Saturdays.",
        "Donate food or help workers when possible.",
      ],
    }),

    makeSection({
      id: "wealth",
      title: "Wealth & Financial Growth",
      subtitle: "Income pattern, savings behavior and money karma.",
      score: 69,
      paragraphs: [
        `The wealth pattern in your chart shows that money improves when planning and discipline are stronger than emotional spending. Financial houses reveal not only earning capacity, but also values, savings, assets, risk appetite, and the way resources are handled. Your chart indicates that income can grow through skill, network, service, advisory ability, business intelligence, or consistent professional output.`,
        `At times, money may come with responsibility. This means that income can increase, but expenses, family needs, learning costs, tools, travel, or professional investments may also rise. If Rahu influences the money zone, there can be attraction toward shortcuts, speculative ideas, online opportunities, or sudden investments. These should be handled carefully because not every attractive opportunity is stable.`,
        `The best financial strategy for this chart is structured growth. You should create clear buckets for savings, learning, emergency fund, and investment. Avoid lending money emotionally, avoid unclear partnerships, and avoid risky schemes promising fast returns. Wealth becomes stronger when your decisions are slow, researched, and practical.`,
      ],
      summary: [
        "Money growth is possible through planning and skill-based income.",
        "Avoid risky shortcuts and unclear investment schemes.",
        "Expenses may rise during growth phases.",
        "Financial discipline is more important than sudden gains.",
        "Long-term wealth improves through structure and patience.",
      ],
      actionPlan: [
        "Create a monthly savings and investment plan.",
        "Avoid emotional lending or impulsive purchases.",
        "Research every major investment before committing.",
      ],
      remedy: [
        "Donate yellow food or sweets on Thursdays when possible.",
        "Respect financial commitments and repay debts on time.",
        "Keep your workspace clean and organized.",
      ],
    }),

    makeSection({
      id: "relationship",
      title: "Love, Marriage & Relationships",
      subtitle: "Emotional bonding, commitment pattern and compatibility lessons.",
      score: 67,
      paragraphs: [
        `Your relationship pattern shows that emotional security, communication, loyalty, and trust are central themes. The 7th house, Venus, Jupiter, Moon and Navamsha together reveal how partnership energy matures in life. Your chart suggests that relationships should not be judged only by attraction. Emotional maturity, practical compatibility, family values, communication style, and timing all play important roles.`,
        `If Saturn or Rahu influence the relationship zone, commitment may come after testing phases. This can create delay, confusion, distance, or attraction toward complicated relationships. However, these influences also teach maturity. They ask you to understand whether a relationship is based on stability or only emotional intensity. If Venus is supportive, affection, charm and bonding improve when communication remains respectful.`,
        `Marriage timing should be judged through dasha, transit, 7th house, Venus, Jupiter and Navamsha. When these factors support each other, commitment becomes easier. If Manglik, Nadi, Bhakoot or other compatibility sensitivities are present, they should be handled with awareness, remedies and practical compatibility checks rather than fear. The best relationship outcome comes when emotional clarity and practical decision-making work together.`,
      ],
      summary: [
        "Emotional clarity is very important in relationships.",
        "Commitment may require maturity and patience.",
        "Avoid rushing decisions during confusing periods.",
        "Marriage timing should be checked through dasha, transit and Navamsha.",
        "Practical compatibility is as important as attraction.",
      ],
      actionPlan: [
        "Communicate expectations clearly.",
        "Avoid testing the partner emotionally.",
        "Do not make commitment decisions during confusion or anger.",
      ],
      remedy: [
        "Do Friday Venus remedy with clean clothing and respectful speech.",
        "Offer white sweets or help women/children when possible.",
        "Avoid harsh words in close relationships.",
      ],
    }),

    makeSection({
      id: "health",
      title: "Health & Vitality",
      subtitle: "Body sensitivity, stress pattern and preventive care.",
      score: 58,
      paragraphs: [
        `Health in astrology is understood through the Lagna, Moon, 6th house, 8th house, 12th house, Mars, Saturn and current dasha influences. Your chart suggests that health should be protected through routine, sleep discipline, digestion care, stress management and balanced physical activity. The body may respond strongly to emotional pressure, irregular routine or overthinking.`,
        `If Saturn or Mars influence health zones, the body may show fatigue, stiffness, inflammation, heat, injury risk, or pressure through bones, muscles or joints. If the Moon is sensitive, sleep, hydration, anxiety, digestion and emotional balance become important. This does not mean illness is guaranteed; it means prevention should be taken seriously.`,
        `The best health approach for this chart is consistency. Avoid extreme routines. Instead, follow regular sleep, simple food, light movement, sunlight, hydration and medical checkups when needed. Astrology can show tendencies, but medical advice should always be taken from qualified professionals.`,
      ],
      summary: [
        "Health improves with routine and prevention.",
        "Stress, sleep and digestion need attention.",
        "Avoid extreme lifestyle changes.",
        "Be careful with heat, inflammation or overwork.",
        "Medical advice should always be taken when symptoms appear.",
      ],
      actionPlan: [
        "Fix sleep and wake-up timing.",
        "Add walking, stretching or light exercise.",
        "Reduce late-night screen use and irregular eating.",
      ],
      remedy: [
        "Chant a calming mantra for 11 minutes daily.",
        "Donate medicines or food when possible.",
        "Respect your body’s limits and avoid overwork.",
      ],
    }),

    makeSection({
      id: "spirituality",
      title: "Spiritual Path & Remedies",
      subtitle: "Karmic maturity, inner peace and spiritual alignment.",
      score: 72,
      paragraphs: [
        `Your chart indicates that spiritual growth comes through self-discipline, humility, service and emotional purification. Spirituality in your chart is not only about rituals; it is about becoming conscious of repeated patterns and choosing a higher response. Whenever you act with patience, truthfulness and responsibility, your chart becomes stronger.`,
        `The karmic planets show where life asks for maturity. Saturn teaches discipline, Rahu teaches clarity, Ketu teaches detachment, Mars teaches controlled action, and the Moon teaches emotional balance. Remedies work best when they are connected with behavior. A mantra is useful, but respectful speech, charity, discipline and right action are equally important.`,
        `Your spiritual path becomes stronger when you follow simple practices consistently. A small daily practice is better than occasional intense rituals. Light, mantra, donation, gratitude and service can stabilize the mind and reduce fear-based astrology.`,
      ],
      summary: [
        "Spiritual growth comes through discipline and awareness.",
        "Remedies should be practical and consistent.",
        "Avoid fear-based astrology.",
        "Service and humility strengthen the chart.",
        "Daily small practice is better than occasional intensity.",
      ],
      actionPlan: [
        "Create a 10-minute daily spiritual routine.",
        "Practice gratitude before starting important work.",
        "Do one act of service weekly.",
      ],
      remedy: [
        "Light a diya in the morning or evening.",
        "Chant your preferred mantra daily.",
        "Donate food, clothes or learning material according to capacity.",
      ],
    }),
  ];

  return {
    nativeName: birth.name,
    birthDate: birth.date,
    birthTime: birth.time,
    birthPlace: birth.place,
    generatedAt: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    lagna,
    moonSign,
    nakshatra,
    currentDasha: formatDashaLabel(getActiveDasha(rawChart)),
    reportTitle: "AstroLife Premium Kundli Report",
    executiveSummary: [
      `This premium report combines Vedic astrology, planetary positions, yogas, doshas, dasha timing, transits and AI-assisted interpretation for ${birth.name}. The visible birth foundation is ${lagna} Lagna, ${moonSign} Moon sign and ${nakshatra} Nakshatra.`,
      `The current timing layer shows ${formatDashaLabel(getActiveDasha(rawChart))}. Read the life-area sections through this dasha context, because the same chart promise becomes more visible when the connected planet is active.`,
      `The report should be read as a guidance document. Astrology shows tendencies, timings and symbolic patterns. Final life decisions should always include practical judgment, free will and expert advice where required.`,
    ],
    keyHighlights: [
      `Lagna: ${lagna}`,
      `Moon Sign: ${moonSign}`,
      `Nakshatra: ${nakshatra}`,
      `Current Dasha: ${formatDashaLabel(getActiveDasha(rawChart))}`,
      "Main Growth Theme: Discipline + clarity + practical action",
      "Report Style: Long interpretation with quick summary",
    ],
    planets,
    sections,
  };
}
export function buildShadbalaReportSection(source: any): ReportSection {
    const data = source ?? {};
  
    const rawScores =
      data?.planetStrengths ??
      data?.strengths ??
      data?.shadbala ??
      data?.scores ??
      data?.planets ??
      [];
  
    const list = Array.isArray(rawScores)
      ? rawScores
      : Object.entries(rawScores ?? {}).map(([name, value]: any) => ({
          name,
          ...(typeof value === "object" ? value : { score: value }),
        }));
  
    const normalized = list.map((item: any, index: number) => {
      const score =
        Number(item?.score ?? item?.total ?? item?.value ?? item?.percentage ?? 50) || 50;
  
      return {
        name: safeText(item?.name ?? item?.planet, `Planet ${index + 1}`),
        score: Math.max(0, Math.min(100, Math.round(score))),
        summary: safeText(item?.summary ?? item?.description, ""),
      };
    });
  
    const sorted = [...normalized].sort((a, b) => b.score - a.score);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
  
    const average = normalized.length
      ? Math.round(normalized.reduce((sum, p) => sum + p.score, 0) / normalized.length)
      : 62;
  
    return makeSection({
      id: "shadbala",
      title: "Shadbala & Planet Strength",
      subtitle: "How strongly planets can deliver their results.",
      score: average,
      paragraphs: [
        `Shadbala is one of the most important strength evaluation systems in Vedic astrology. A planet may be naturally benefic or may rule a good house, but if it lacks strength, its results may come slowly, inconsistently or only after effort. In the same way, a challenging planet with strong bala can create pressure, but it can also give discipline, survival power, ambition and the ability to handle responsibility.`,
  
        `This section studies planetary strength as a practical delivery mechanism. The birth chart shows promise, yogas show special combinations, dasha shows timing, and Shadbala shows whether the planets have enough force to act in real life. When a strong planet runs its dasha, its results become more visible. When a weak planet runs its dasha, remedies, discipline and practical support become more important.`,
  
        strongest
          ? `In this report, the strongest visible planet from the available strength data is ${strongest.name}, with a strength signal around ${strongest.score}/100. This planet can become a key support factor when its dasha, transit or house significations become active. The more consciously you use this planet’s qualities, the better its results can manifest.`
          : `The available chart data does not expose detailed Shadbala values yet, so this section is presented as an interpretive strength framework. Once full Shadbala scores are connected, the report will show strongest and weakest planets more precisely.`,
  
        weakest
          ? `The most sensitive planet from the available strength data appears to be ${weakest.name}, with a strength signal around ${weakest.score}/100. This does not mean negative destiny. It means that this planet’s themes require more awareness, patience, strengthening remedies and practical correction.`
          : `Planetary weakness should never be treated with fear. Weakness simply means that conscious effort, environment, habits and remedies can help stabilize that planet’s results.`,
      ],
      summary: [
        strongest
          ? `Strongest planet: ${strongest.name} (${strongest.score}/100).`
          : "Strongest planet will appear after full Shadbala data is connected.",
        weakest
          ? `Most sensitive planet: ${weakest.name} (${weakest.score}/100).`
          : "Sensitive planet will appear after full Shadbala data is connected.",
        "Shadbala shows delivery strength, not just good or bad nature.",
        "Strong planets give clearer results during their dasha and transit activation.",
        "Weak planets need remedies, patience and practical strengthening.",
      ],
      actionPlan: [
        "Use the strongest planet as a life-support theme.",
        "Follow remedies for weak or sensitive planets consistently.",
        "Check Shadbala together with dasha before expecting major results.",
        "Avoid judging a planet only by sign or house; strength matters.",
      ],
      remedy: [
        "Strengthen weak planets through discipline, donation and mantra.",
        "Respect the people and duties represented by sensitive planets.",
        "Avoid habits that worsen the weak planet’s significations.",
      ],
    });
  }
  
  export function buildAshtakavargaReportSection(source: any): ReportSection {
    const data = source ?? {};
  
    const rawScores =
      data?.sarvashtakavarga ??
      data?.ashtakavarga ??
      data?.houseScores ??
      data?.bindus ??
      data?.scores ??
      [];
  
    const list = Array.isArray(rawScores)
      ? rawScores
      : Object.entries(rawScores ?? {}).map(([name, value]: any) => ({
          name,
          ...(typeof value === "object" ? value : { score: value }),
        }));
  
    const normalized = list.map((item: any, index: number) => {
      const score =
        Number(item?.score ?? item?.total ?? item?.bindu ?? item?.bindus ?? item?.value ?? 25) || 25;
  
      return {
        name: safeText(item?.name ?? item?.house ?? item?.sign, `Zone ${index + 1}`),
        score: Math.max(0, Math.min(50, Math.round(score))),
        summary: safeText(item?.summary ?? item?.description, ""),
      };
    });
  
    const sorted = [...normalized].sort((a, b) => b.score - a.score);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
  
    const averageBindu = normalized.length
      ? Math.round(normalized.reduce((sum, item) => sum + item.score, 0) / normalized.length)
      : 28;
  
    const score = Math.max(35, Math.min(85, averageBindu * 2));
  
    return makeSection({
      id: "ashtakavarga",
      title: "Ashtakavarga Strength",
      subtitle: "Bindu support, transit zones and house-wise ease.",
      score,
      paragraphs: [
        `Ashtakavarga is a powerful transit and house-strength system in Vedic astrology. It measures how much support different signs and houses receive through bindus. A house or sign with higher bindus usually gives smoother results when activated, while a lower bindu zone requires more patience, planning and conscious effort.`,
  
        `This section is especially useful for timing. When a major planet transits through a high-bindu zone, the native may experience better support, smoother movement, helpful people, visible progress or reduced resistance. When a planet moves through a low-bindu zone, the same transit may feel heavy, delayed or demanding, even if the planet is otherwise favourable.`,
  
        strongest
          ? `The strongest available Ashtakavarga zone appears to be ${strongest.name}, with approximately ${strongest.score} bindus. This area can become a support zone, especially when important transits activate it. Activities connected with this house or sign may feel more natural and productive.`
          : `The detailed Ashtakavarga bindu table is not fully exposed yet in the report data, so this section currently gives a premium interpretation framework. Once connected, it will show strongest and weakest bindu zones clearly.`,
  
        weakest
          ? `The most sensitive available Ashtakavarga zone appears to be ${weakest.name}, with approximately ${weakest.score} bindus. This does not deny results, but it suggests that the native should use planning, patience and remedies when this zone becomes active through transit or dasha.`
          : `Low bindu zones should not be feared. They simply show where life asks for more preparation, patience and careful execution.`,
      ],
      summary: [
        strongest
          ? `Best bindu zone: ${strongest.name} (${strongest.score} bindus).`
          : "Best bindu zone will appear after detailed Ashtakavarga data is connected.",
        weakest
          ? `Sensitive bindu zone: ${weakest.name} (${weakest.score} bindus).`
          : "Sensitive bindu zone will appear after detailed Ashtakavarga data is connected.",
        "High bindu zones support smoother transit results.",
        "Low bindu zones require patience and stronger planning.",
        "Ashtakavarga should be combined with dasha and transit.",
      ],
      actionPlan: [
        "Use high-bindu periods for action and expansion.",
        "Use low-bindu periods for preparation, correction and patience.",
        "Avoid forcing major decisions when transit pressure is high and bindu support is low.",
      ],
      remedy: [
        "Keep remedies simple during low-bindu periods.",
        "Avoid ego-driven decisions when transit support is weak.",
        "Use prayer, donation and disciplined routine to stabilize difficult periods.",
      ],
    });
  }
  
  export function buildTransitEventRadarReportSection(source: any): ReportSection {
    const data = source ?? {};
  
    const bestDay =
      data?.bestDay?.label ??
      data?.bestDay ??
      data?.summary?.bestDay ??
      "To be calculated";
  
    const cautionDay =
      data?.cautionDay?.label ??
      data?.cautionDay ??
      data?.summary?.cautionDay ??
      "To be calculated";
  
    const days = Array.isArray(data?.days) ? data.days : [];
    const avgScore = days.length
      ? Math.round(days.reduce((sum: number, d: any) => sum + Number(d?.overallScore ?? 50), 0) / days.length)
      : 64;
  
    return makeSection({
      id: "transit-event-radar",
      title: "Transit & Event Radar",
      subtitle: "Current Gochar, weekly timing and action windows.",
      score: avgScore,
      paragraphs: [
        `Transits show the current movement of planets over the natal chart. They do not replace the birth chart or dasha, but they activate events, moods, opportunities and caution windows. A birth chart shows the promise, dasha shows the active karmic chapter, and transit shows the current weather. This is why transit analysis is most useful for questions like today, this week, current career timing, relationship mood, money movement or health caution.`,
  
        `The Event Radar converts live transit pressure into a practical short-term forecast. It studies the current planetary movement, Moon-based rhythm, opportunity signals, caution alerts and life-area scores to identify which days are better for action and which days require patience. This makes the report more useful for daily decision-making instead of only long-term interpretation.`,
  
        `Based on the available Event Radar data, the best upcoming window is ${bestDay}, while the more sensitive or caution-oriented window is ${cautionDay}. The best day should be used for important communication, planning, meetings, application, launch, discussion or decisive action. The caution day should be used for review, patience, correction and avoiding impulsive decisions.`,
  
        `Transit results should always be read with maturity. A caution period does not mean failure, and a good period does not mean automatic success. The best results come when the native acts according to timing: move actively during supportive windows, slow down during sensitive windows, and use remedies when karmic planets create pressure.`,
      ],
      summary: [
        `Best available window: ${bestDay}.`,
        `Caution window: ${cautionDay}.`,
        "Transit shows current planetary weather.",
        "Event Radar converts transit pressure into practical weekly timing.",
        "Use strong days for action and sensitive days for patience.",
      ],
      actionPlan: [
        "Use supportive days for meetings, applications, launches and important communication.",
        "Use caution days for review, planning and emotional control.",
        "Avoid major impulsive decisions when Mars, Saturn, Rahu or Moon pressure is high.",
      ],
      remedy: [
        "Light a diya before beginning important work.",
        "Keep speech calm on sensitive days.",
        "Do grounding practices when Moon or Rahu influence feels heavy.",
      ],
    });
  }
  
export function buildDashaTimelineReportSection(source: any): ReportSection {
    const data = source ?? {};
    const activeDasha = getActiveDasha(data);
  
    const current = formatDashaLabel(
      data?.currentDasha ??
        data?.current ??
        data?.activeDasha ??
        data?.dasha?.current ??
        data?.runningDasha ??
        activeDasha
    );
  
    const mahadasha = formatDashaLabel(
      data?.mahadasha ??
        data?.mahaDasha ??
        data?.md ??
        data?.currentMahadasha ??
        activeDasha
    );
  
    const antardasha =
      data?.antardasha ??
      data?.antarDasha ??
      data?.ad ??
      data?.currentAntardasha ??
      "To be calculated";
  
    const pratyantar =
      data?.pratyantardasha ??
      data?.pd ??
      data?.currentPratyantardasha ??
      "To be calculated";
  
    return makeSection({
      id: "dasha-timeline",
      title: "Dasha Timeline",
      subtitle: "The active karmic chapter and timing engine.",
      score: 71,
      paragraphs: [
        `Dasha is the timing engine of Vedic astrology. While the birth chart shows the promise of life, dasha shows when that promise becomes active. A person may have powerful yogas in the chart, but those yogas become more visible when the connected planets operate through Mahadasha, Antardasha or important transit activation.`,
  
        `The Mahadasha represents the broad life chapter. It can last for many years and sets the main karmic theme. The Antardasha narrows that theme into a more specific area of life. The Pratyantardasha and smaller dasha levels show more immediate event patterns. This layered timing system helps explain why some periods feel career-focused, some feel relationship-focused, some feel spiritual, and some feel heavy or corrective.`,
  
        `The currently available dasha signal is ${current}. The Mahadasha is ${mahadasha}, the Antardasha is ${antardasha}, and the Pratyantardasha is ${pratyantar}. These periods should be studied with the planets’ house ownership, placement, strength, yogas, doshas and transit support. A strong dasha planet can open doors, while a sensitive dasha planet asks for discipline and remedies.`,
  
        `The best way to use dasha is not to wait passively for fate. Dasha shows the type of karma that is active, but your response determines the quality of the result. If a growth-oriented dasha is active, take action. If a corrective dasha is active, simplify life, follow discipline and avoid repeating old mistakes.`,
      ],
      summary: [
        `Current dasha signal: ${current}.`,
        `Mahadasha: ${mahadasha}.`,
        `Antardasha: ${antardasha}.`,
        `Pratyantardasha: ${pratyantar}.`,
        "Dasha activates the promise of the birth chart.",
      ],
      actionPlan: [
        "Judge major life decisions through dasha plus transit together.",
        "Use supportive dasha periods for expansion and visibility.",
        "Use difficult dasha periods for correction, discipline and inner work.",
      ],
      remedy: [
        "Follow remedies for the current dasha lord.",
        "Respect the relationships and duties represented by the active planet.",
        "Avoid shortcuts during Rahu, Saturn or Mars-heavy periods.",
      ],
    });
  }

export function buildFullPremiumReportSections(input: any): ReportSection[] {
  const rawChart = getChartRoot(input);

  const lagna = getLagnaSign(rawChart);

  const moon = getPlanet(rawChart, "Moon");
  const moonSign = signFromValue(moon?.sign ?? moon?.rashi ?? moon?.longitude);
  const nakshatra = safeText(moon?.nakshatra ?? moon?.nakshatraName, "To be calculated");

  const monthFormatter = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  });

  const currentMonth = new Date();

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(currentMonth);
    date.setMonth(currentMonth.getMonth() + index);
    return monthFormatter.format(date);
  });

  const premiumSections: ReportSection[] = [
    makeSection({
      id: "table-of-contents",
      title: "Table of Contents",
      subtitle: "Premium report navigation and reading map.",
      score: 82,
      paragraphs: [
        `This AstroLife Premium Report is designed as a complete life dossier rather than a simple kundli printout. The report begins with birth details, panchang and planetary positions, then moves into personality, yogas, doshas, dasha, transit, Shadbala, Ashtakavarga, career, wealth, relationship, health, spirituality, psychology, remedies and future timing. The purpose is to give both traditional Jyotish depth and modern AI-readable clarity.`,
        `You should read this report in three passes. First, read the Executive Summary and Birth Details to understand the foundation. Second, read the core life-area reports such as career, wealth, relationship and health. Third, read timing sections such as Dasha Timeline, Transit, Event Radar and the 12-Month Forecast to understand what is currently active.`,
        `Each section contains long-form interpretation followed by quick summary bullets, action plan and remedies. This format gives depth like a traditional astrology report while still making the guidance easy to understand and apply in daily life.`,
      ],
      summary: [
        "Start with birth details, panchang and planetary positions.",
        "Read life-area sections for career, wealth, relationship and health.",
        "Use dasha, transit and monthly forecast for timing.",
        "Use remedies as practical alignment tools, not fear-based rituals.",
        "Ask AstroLife AI when you want deeper explanation of any section.",
      ],
      actionPlan: [
        "Read the full report once without rushing.",
        "Mark the sections that repeat the same life theme.",
        "Use the monthly forecast for planning important decisions.",
      ],
      remedy: [
        "Begin reading with a calm mind.",
        "Use the report for self-awareness and better choices.",
        "Do not treat any single statement as fixed destiny.",
      ],
    }),

    makeSection({
      id: "panchang-details",
      title: "Panchang Details",
      subtitle: "Tithi, nakshatra, yoga, karana and birth-time spiritual signature.",
      score: 73,
      paragraphs: [
        `Panchang gives the subtle quality of the birth moment. While the birth chart shows planetary placement and house structure, Panchang shows the energetic environment in which the native was born. It includes tithi, nakshatra, yoga, karana, weekday, sunrise, sunset and other traditional birth-time indicators. These factors create a deeper layer of temperament and karmic rhythm.`,
        `The nakshatra is especially important because it represents the psychological star-field of the Moon. The Moon reflects mind, emotion, memory, habit and comfort. Therefore, the nakshatra shows how the mind reacts to life, what kind of emotional nourishment it seeks, and how the native handles pressure, attachment and instinctive decisions.`,
        `In this report, the available birth foundation shows Lagna as ${lagna}, Moon sign as ${moonSign}, and Nakshatra as ${nakshatra}. These three points should be treated as the foundation of personality, emotional pattern and timing. The real Panchang engine section later in this report adds calculated tithi, yoga, karana, weekday, Sun sign, Moon sign and nakshatra pada so the birth moment is no longer read only through generic explanation.`,
      ],
      summary: [
        `Lagna foundation: ${lagna}.`,
        `Moon sign foundation: ${moonSign}.`,
        `Nakshatra foundation: ${nakshatra}.`,
        "Panchang reveals the subtle quality of the birth moment.",
        "Nakshatra gives emotional and psychological rhythm.",
      ],
      actionPlan: [
        "Use nakshatra guidance for emotional self-awareness.",
        "Use panchang details for remedies and spiritual alignment.",
        "Cross-check this overview with the real Panchang table section.",
      ],
      remedy: [
        "Respect the Moon through calm routine and emotional balance.",
        "Follow one simple daily prayer or gratitude practice.",
        "Avoid making decisions in emotional turbulence.",
      ],
    }),

    makeSection({
      id: "charts-explanation",
      title: "Chart Framework",
      subtitle: "Lagna chart, Moon chart and Navamsha chart interpretation framework.",
      score: 78,
      paragraphs: [
        `The Lagna chart is the main birth chart. It shows the physical life path, personality expression, life events, body, direction, responsibilities and worldly manifestation of karma. The rising sign becomes the first house, and all other houses are counted from it. This is why Lagna is one of the most important points in Vedic astrology.`,
        `The Moon chart shows the emotional and mental experience of life. Some events become more visible from the Moon chart because the mind is the instrument through which life is experienced. When the same yoga or pressure appears from both Lagna and Moon, that result becomes more noticeable in real life.`,
        `The Navamsha chart, also called D9, shows deeper maturity, dharma, marriage potential, inner strength and the refined promise of planets. A planet may look good in the birth chart but weak in Navamsha, or average in the birth chart but strong in Navamsha. This is why Premium and Elite reports should always include Navamsha interpretation.`,
      ],
      summary: [
        "Lagna chart shows outer life and event manifestation.",
        "Moon chart shows mind, emotion and inner experience.",
        "Navamsha shows marriage, dharma and deeper planetary maturity.",
        "Repeated patterns across D1, Moon chart and D9 are very important.",
        "Future PDF versions should include visual chart diagrams on this page.",
      ],
      actionPlan: [
        "Judge life events mainly from Lagna.",
        "Judge emotional experience from Moon.",
        "Judge marriage and deeper promise from Navamsha.",
      ],
      remedy: [
        "Strengthen Lagna through discipline and health routine.",
        "Strengthen Moon through calm sleep and hydration.",
        "Strengthen Navamsha promise through dharmic action.",
      ],
    }),

    makeSection({
      id: "house-map-1",
      title: "House-wise Life Map Part 1",
      subtitle: "First six houses: identity, wealth, effort, home, intelligence and health.",
      score: 71,
      paragraphs: [
        `The twelve houses of the horoscope represent the complete map of human life. The first house shows identity, body, confidence and the direction of life. The second house shows speech, family values, food habits, savings and accumulated wealth. The third house shows courage, communication, siblings, media, marketing, effort and self-made growth.`,
        `The fourth house shows mother, home, property, inner peace, vehicles, education foundation and emotional security. The fifth house shows intelligence, creativity, children, romance, mantra, speculation and past-life merit. The sixth house shows work pressure, service, competition, debts, enemies, disease and the ability to defeat obstacles.`,
        `When planets occupy or aspect these houses, they activate their themes. Benefic influence can make the house smoother, while karmic planets can create pressure but also strength. A difficult sixth house, for example, can create health or debt challenges, but it can also make the native highly competitive and capable of defeating opposition.`,
      ],
      summary: [
        "1st house: identity, body and life direction.",
        "2nd house: family, speech, food and savings.",
        "3rd house: effort, courage and communication.",
        "4th house: home, mother, property and peace.",
        "5th/6th houses: intelligence, children, service, disease and competition.",
      ],
      actionPlan: [
        "Strengthen first house through health and discipline.",
        "Strengthen second house through clean speech and savings.",
        "Strengthen sixth house through routine and problem-solving.",
      ],
      remedy: [
        "Avoid harsh speech.",
        "Keep home space clean and peaceful.",
        "Do regular service or charity.",
      ],
    }),

    makeSection({
      id: "house-map-2",
      title: "House-wise Life Map Part 2",
      subtitle: "Last six houses: marriage, transformation, luck, career, gains and moksha.",
      score: 72,
      paragraphs: [
        `The seventh house represents marriage, partnership, public dealings and business agreements. It shows how the native relates to others and what kind of partner energy is attracted. The eighth house shows transformation, secrets, sudden events, inheritance, research, occult knowledge and deep psychological change. The ninth house shows dharma, father, teachers, fortune, blessings, higher learning and long-distance travel.`,
        `The tenth house is one of the most important houses for career, karma, authority, public image and professional achievement. The eleventh house shows income, gains, networks, elder siblings, large communities and fulfilment of desires. The twelfth house shows expenses, sleep, isolation, foreign lands, hospitals, ashrams, moksha and release.`,
        `These houses become especially important during dasha and transit activation. For example, 10th and 11th house activation can increase career and income, while 8th and 12th house activation can bring transformation, expenses, spiritual retreat or hidden pressure. A mature reading does not call any house purely good or bad; each house has a role in the soul’s journey.`,
      ],
      summary: [
        "7th house: marriage, partnership and public dealing.",
        "8th house: transformation, secrets and sudden change.",
        "9th house: fortune, dharma, father and teachers.",
        "10th house: career, karma and public status.",
        "11th/12th houses: gains, networks, expenses, foreign lands and moksha.",
      ],
      actionPlan: [
        "Use 10th house themes for career planning.",
        "Use 11th house themes for networking and income.",
        "Use 12th house themes for spiritual retreat and expense control.",
      ],
      remedy: [
        "Respect spouse, partners and clients.",
        "Respect teachers and father figures.",
        "Control unnecessary expenses.",
      ],
    }),

    makeSection({
      id: "detailed-yogas",
      title: "Detailed Yogas",
      subtitle: "Positive combinations, potential and timing of activation.",
      score: 76,
      paragraphs: [
        `Yogas are special planetary combinations that create potential. They can indicate intelligence, wealth, authority, fame, spirituality, protection, creativity, success after struggle, leadership or support from destiny. However, yogas should never be read as automatic guarantees. A yoga becomes powerful when the involved planets are strong, connected to useful houses, supported by dasha and activated by transit.`,
        `A person may have several yogas but experience them only during certain periods. This is because dasha acts like a switch. If the dasha of a yoga-forming planet begins, the promise becomes active. If transits also support the same house or planet, the result becomes more visible. This is why timing matters as much as the presence of the yoga itself.`,
        `For AstroLife Premium reporting, detailed yogas should be shown with name, category, strength, involved planets, life area, activation timing and practical advice. This gives the user more value than only listing yoga names. The goal is to help the native understand how to use their strengths consciously.`,
      ],
      summary: [
        "Yogas show potential, not automatic results.",
        "Strength and dasha decide yoga activation.",
        "Transit support makes yoga results more visible.",
        "Yogas should be connected with real life areas.",
        "Premium reports should explain how to use each yoga practically.",
      ],
      actionPlan: [
        "Identify the strongest yoga areas.",
        "Build real skills connected to those areas.",
        "Check active dasha before expecting major yoga results.",
      ],
      remedy: [
        "Respect the planets involved in positive yogas.",
        "Use opportunities with humility.",
        "Avoid ego when success begins.",
      ],
    }),

    makeSection({
      id: "detailed-doshas",
      title: "Detailed Doshas & Corrections",
      subtitle: "Sensitive combinations, karmic correction and remedies.",
      score: 63,
      paragraphs: [
        `Doshas show areas where energy is imbalanced, delayed, pressurized or karmically sensitive. They may appear as repeated patterns in relationships, health, career, family, money, confidence or emotional life. A dosha should not be interpreted as punishment. It is better understood as a correction area where the native must become more conscious.`,
        `Some doshas become active only during specific dasha or transit periods. This means a dosha may stay quiet for years and become noticeable when its planet or house becomes active. Therefore, the right question is not only whether a dosha exists, but when it is active and how strongly it affects the current life situation.`,
        `The best dosha remedy is a combination of spiritual remedy, behavioural correction and practical planning. For example, Mars-related pressure needs anger control and disciplined action. Saturn-related pressure needs patience, duty and humility. Rahu-related pressure needs clarity, grounding and avoidance of shortcuts. Ketu-related pressure needs detachment and spiritual focus.`,
      ],
      summary: [
        "Doshas show correction areas, not fixed negative destiny.",
        "Dasha and transit decide when dosha effects become active.",
        "Fear-based interpretation should be avoided.",
        "Behavioural correction is as important as mantra or ritual.",
        "Planet-wise remedies should be simple and consistent.",
      ],
      actionPlan: [
        "Identify repeated life patterns connected to doshas.",
        "Avoid repeating the same mistake during sensitive periods.",
        "Follow simple remedies consistently.",
      ],
      remedy: [
        "For Saturn: discipline, charity and service.",
        "For Mars: control anger and do physical activity.",
        "For Rahu/Ketu: grounding, meditation and avoiding shortcuts.",
      ],
    }),

    makeSection({
      id: "divisional-charts-summary",
      title: "Divisional Charts Summary",
      subtitle: "D9, D10, D12, D27 and deeper varga interpretation.",
      score: 70,
      paragraphs: [
        `Divisional charts, also called vargas, divide signs into finer layers to study specific areas of life. The birth chart gives the overall foundation, but divisional charts reveal deeper quality. For example, D9 is used for dharma, marriage and planetary maturity. D10 is used for profession and public karma. D12 is used for parents and ancestral patterns. D27 is used for strength, endurance and inner resilience.`,
        `A planet becomes more reliable when it is strong in both the birth chart and relevant divisional chart. If a planet looks strong in D1 but weak in the relevant varga, results may require more effort or maturity. If a planet looks average in D1 but strong in varga, the result may improve after age, discipline or life experience.`,
        `Premium and Elite reports should eventually include visual varga charts. In this Premium version, this page gives the interpretive framework so users understand why divisional charts matter and how they improve prediction quality.`,
      ],
      summary: [
        "D9 shows marriage, dharma and planetary maturity.",
        "D10 shows career and public karma.",
        "D12 shows parents and ancestral themes.",
        "D27 shows strength and endurance.",
        "Planets strong in D1 and varga give more reliable results.",
      ],
      actionPlan: [
        "Use D9 for marriage and deeper life promise.",
        "Use D10 for professional direction.",
        "Use D27 for inner strength and resilience.",
      ],
      remedy: [
        "Strengthen weak varga themes through practical action.",
        "Respect the life area represented by the divisional chart.",
        "Use patience when varga results mature late.",
      ],
    }),

    makeSection({
      id: "lalkitab-karma",
      title: "Lal Kitab Karma",
      subtitle: "Karmic debts, behavioural correction and simple upaya.",
      score: 68,
      paragraphs: [
        `Lal Kitab focuses strongly on karmic patterns, family debts, behavioural correction and simple remedies. Unlike purely mathematical strength systems, Lal Kitab often reads planetary combinations as practical life habits and karmic duties. It asks the native to correct behaviour, respect relationships and follow simple remedies that align daily life with planetary balance.`,
        `The most useful Lal Kitab remedies are usually simple: respect parents, avoid false speech, feed animals, donate food, avoid arrogance, maintain cleanliness, help the needy, and stop repeating harmful habits. These remedies work best when done with sincerity rather than fear.`,
        `In AstroLife reporting, Lal Kitab should become a practical karmic correction page. Instead of giving too many confusing remedies, the report should show top three karmic debts, top three upaya, and behavioural advice connected to the user’s chart.`,
      ],
      summary: [
        "Lal Kitab focuses on karmic correction and practical remedies.",
        "Behavioural change is central to Lal Kitab upaya.",
        "Simple remedies are better than complicated rituals.",
        "Family karma and relationship duties matter strongly.",
        "AstroLife should show top three karmic corrections clearly.",
      ],
      actionPlan: [
        "Choose only 1–3 remedies and follow consistently.",
        "Correct speech, habits and relationship duties.",
        "Avoid fear-based remedy overload.",
      ],
      remedy: [
        "Feed animals according to capacity.",
        "Donate food or useful items.",
        "Respect parents, elders and teachers.",
      ],
    }),

    makeSection({
      id: "psychology-shadow-pattern",
      title: "Psychology & Shadow Pattern",
      subtitle: "Mind, emotion, attachment, fear and growth pattern.",
      score: 74,
      paragraphs: [
        `Astrology becomes more useful when it is connected with psychology. The Moon shows emotional pattern, Mercury shows thinking and communication, Venus shows affection and desire, Mars shows anger and action, Saturn shows fear and discipline, Rahu shows obsession and ambition, and Ketu shows detachment and past-life residue.`,
        `Your psychological pattern should be understood as a growth map. Some reactions may come from fear of loss, fear of rejection, desire for control, impatience, overthinking or emotional comparison. These patterns are not weaknesses if they are observed consciously. They become weaknesses only when they control behaviour without awareness.`,
        `The best use of this section is shadow work. Whenever the same emotional pattern repeats, ask: what is this planet teaching me? Saturn may ask for patience, Rahu may ask for clarity, Mars may ask for controlled strength, Moon may ask for emotional regulation, and Venus may ask for healthier love and value systems.`,
      ],
      summary: [
        "Moon shows emotional rhythm.",
        "Mercury shows thinking and communication.",
        "Mars shows anger, courage and action.",
        "Saturn shows fear, patience and discipline.",
        "Rahu/Ketu show obsession, detachment and karmic extremes.",
      ],
      actionPlan: [
        "Track repeated emotional reactions.",
        "Pause before responding during stress.",
        "Use journaling for shadow patterns.",
      ],
      remedy: [
        "Practice mindful speech.",
        "Sleep on time and reduce emotional overload.",
        "Use mantra or breathwork for mental grounding.",
      ],
    }),

    makeSection({
      id: "gemstone-suitability",
      title: "Gemstone Suggestions",
      subtitle: "Supportive planetary strengthening with caution and responsibility.",
      score: 66,
      paragraphs: [
        `Gemstones are used to strengthen planetary energy, but they should be recommended carefully. A gemstone amplifies a planet, so it should not be suggested only because a planet is weak. The planet should be functionally supportive, connected to useful houses and suitable for the native’s overall chart. Otherwise, strengthening the wrong planet can increase pressure instead of relief.`,
        `For Premium reporting, gemstone suggestions should be shown as cautious guidance, not final prescription. The report can identify potentially supportive planets and planets that should not be strengthened casually. Final gemstone recommendation should ideally be confirmed through full chart analysis, dasha, current life situation and expert review.`,
        `Safer alternatives include colour therapy, mantra, donation, fasting, behavioural remedies and spiritual discipline. These methods are less risky than gemstone amplification and can still create alignment with planetary energy.`,
      ],
      summary: [
        "Gemstones amplify planetary energy.",
        "Do not wear gemstones casually.",
        "Planet should be functionally supportive before strengthening.",
        "Safer alternatives include mantra, donation and colour discipline.",
        "Final gemstone should be confirmed through deeper analysis.",
      ],
      actionPlan: [
        "Avoid buying expensive gemstones without confirmation.",
        "Start with mantra and behavioural remedies first.",
        "Use gemstone only after suitability check.",
      ],
      remedy: [
        "Use clean colours connected to supportive planets.",
        "Donate according to the planet instead of rushing gemstone use.",
        "Ask AstroLife AI or an astrologer before wearing a major gemstone.",
      ],
    }),
  ];
  // Bug Fix #3 — real Astro Sound engine call
  const SOUND_RASHIS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  let astroSoundSection: ReportSection;
  try {
    const soundPlanets: Record<string, { rashi: number; house: number; lon: number; status?: string; retrograde?: boolean }> = {};
    for (const [name, p] of Object.entries(rawChart.planets ?? {})) {
      const pd = p as any;
      soundPlanets[name] = {
        rashi: Math.max(0, SOUND_RASHIS.indexOf(pd.sign ?? "")) >= 0 ? SOUND_RASHIS.indexOf(pd.sign ?? "") : (pd.house ?? 1) - 1,
        house: pd.house ?? 1,
        lon: pd.lon ?? 0,
        status: pd.status,
        retrograde: pd.retrograde,
      };
    }
    const soundResult = runAstroSound({
      chart: { lagR: rawChart.lagnaNum ?? 0, lagLon: rawChart.lagnaLon, dob: rawChart.dob, planets: soundPlanets },
      goal: "mind",
      emotion: "auto",
      voice: "any",
      intensity: "medium",
      mode: "hybrid",
      currentMahadasha: rawChart.dashas?.find((d: any) => d.active)?.planet ?? rawChart.dashas?.[0]?.planet,
      currentAntardasha: rawChart.antardasha?.find((d: any) => d.active)?.planet ?? rawChart.antardasha?.[0]?.planet,
    });
    astroSoundSection = makeSection({
      id: "astro-sound-protocol",
      title: "Astro Sound Protocol",
      subtitle: `${soundResult.primary.raga.name} · ${soundResult.status} · ${soundResult.score}/100`,
      score: soundResult.score,
      paragraphs: [
        soundResult.summary,
        `Primary Raga: ${soundResult.primary.raga.name}. ${soundResult.primary.raga.why}`,
        `Mantra Pairing: Mahadasha ${soundResult.mantraPlan.mahadasha ? `${soundResult.mantraPlan.mahadasha.planet} — ${soundResult.mantraPlan.mahadasha.mantra}` : "not detected"}; Antardasha ${soundResult.mantraPlan.antardasha ? `${soundResult.mantraPlan.antardasha.planet} — ${soundResult.mantraPlan.antardasha.mantra}` : "not detected"}; Raga support ${soundResult.mantraPlan.ragaSupport.planet} — ${soundResult.mantraPlan.ragaSupport.mantra}.`,
        soundResult.protocol.slice(0, 3).join(" "),
        `Timing: ${soundResult.timing.activePlanet} — ${soundResult.timing.activePlanetReason}. Best window: ${soundResult.timing.bestWindow}.`,
      ],
      summary: [
        `Raga: ${soundResult.primary.raga.name}`,
        `Score: ${soundResult.score}/100 · Status: ${soundResult.status}`,
        `System: ${soundResult.primary.raga.system} · Energy: ${soundResult.primary.raga.energy}`,
        `Best time: ${soundResult.primary.raga.time}`,
        `Mantra: ${soundResult.mantraPlan.ragaSupport.mantra}`,
        ...soundResult.reasons.slice(0, 3),
      ],
      actionPlan: [
        "Open Astro Sound from the dashboard for full personalized guidance.",
        `Primary raga for mind balance: ${soundResult.primary.raga.name}.`,
        `Best listening window: ${soundResult.timing.bestWindow}.`,
        "Try the 21-day sadhana for deeper effect.",
      ],
      remedy: soundResult.remedies,
    });
  } catch {
    astroSoundSection = makeSection({
      id: "astro-sound-protocol",
      title: "Astro Sound Protocol",
      subtitle: "Personalized raga guidance, sound remedy and 21-day listening sadhana.",
      score: 78,
      paragraphs: [
        "Astro Sound connects planetary symbolism, emotional rasa and classical raga mood to suggest a personalised listening protocol. Open the Astro Sound dashboard to generate your chart-specific recommendation.",
        "For mind balance: Yaman, Ahir Bhairav or Bhoopali. For sleep: Hindolam or Revati. For study: Hamsadhwani or Abhogi.",
        "Follow the 21-day sadhana for consistent benefit. Listen at low volume with 2 minutes of silence afterwards.",
      ],
      summary: ["Open Astro Sound from the dashboard.", "Choose goal: mind, sleep, study, career, love, money or spirituality.", "Follow recommendation for at least 3 days before changing raga."],
      actionPlan: ["Open Astro Sound from the dashboard.", "Select goal and generate recommendation.", "Use feedback buttons to improve future suggestions."],
      remedy: ["Listen at low to medium volume.", "Prefer alap, slow instrumental or tanpura-backed versions.", "Stop if uncomfortable.", "Consult a qualified professional for serious health concerns."],
    });
  }
  premiumSections.push(astroSoundSection);

  months.forEach((month, index) => {
    const score = 60 + ((index * 7) % 24);

    premiumSections.push(
      makeSection({
        id: `monthly-forecast-${index + 1}`,
        title: `${month} Forecast`,
        subtitle: "12-month prediction roadmap with career, money, relationship and health focus.",
        score,
        paragraphs: [
          `${month} begins a distinct phase in your yearly rhythm. This month should be read through the combined influence of birth chart promise, current dasha, transit pressure and personal effort. The overall theme suggests that the native should balance ambition with patience and avoid making decisions only from emotional urgency. The month can bring progress when planning, communication and disciplined action are used properly.`,
          `Career matters during ${month} may require structured effort. If professional opportunities appear, they should be evaluated carefully instead of being accepted impulsively. This month can support learning, communication, networking, documentation, portfolio building and correction of past delays. If workplace pressure increases, it should be treated as a signal to become more organized rather than as a sign of failure.`,
          `Financially, ${month} is better for planning than reckless risk. Income may improve through effort, but expenses can also rise through family, travel, tools, learning, health or lifestyle needs. Relationship matters require calm communication. Health should be protected through sleep, hydration, digestion care and stress management. The best use of this month is steady action with emotional balance.`,
        ],
        summary: [
          `Overall signal for ${month}: ${getSignal(score)}.`,
          "Career: good for planning, skill-building and communication.",
          "Money: avoid impulsive spending and risky investment.",
          "Relationship: use calm speech and avoid assumptions.",
          "Health: protect sleep, digestion and stress levels.",
        ],
        actionPlan: [
          "Choose one main goal for the month.",
          "Avoid overcommitting to too many directions.",
          "Review money, health and relationship decisions weekly.",
        ],
        remedy: [
          "Light a diya before starting important work.",
          "Donate food or help someone according to capacity.",
          "Chant your preferred mantra for 11 minutes on stressful days.",
        ],
      })
    );
  });

  premiumSections.push(
    makeSection({
      id: "final-year-guidance",
      title: "Final 12-Month Guidance",
      subtitle: "How to use the coming year with clarity and discipline.",
      score: 79,
      paragraphs: [
        `The coming year should be treated as a journey of gradual alignment. Some months may support career and visibility, while others may ask for rest, emotional maturity or financial discipline. A good year is not a year without challenges; it is a year where the native responds to each phase with the right action.`,
        `Whenever a month feels supportive, use it for movement, applications, launches, communication, learning and progress. Whenever a month feels heavy, use it for correction, healing, organization, remedies and patience. This approach turns astrology into a planning tool rather than a fear-based prediction system.`,
        `The most important message of this report is that timing and effort must work together. Favourable timing without effort gives little result, and effort without timing may feel delayed. When both come together, progress becomes more natural.`,
      ],
      summary: [
        "Use supportive months for action.",
        "Use sensitive months for correction and planning.",
        "Do not fear difficult months.",
        "Discipline makes good timing more powerful.",
        "Astrology works best with practical effort.",
      ],
      actionPlan: [
        "Plan quarterly goals.",
        "Review your life areas every month.",
        "Use remedies as consistency anchors.",
      ],
      remedy: [
        "Keep one daily spiritual habit.",
        "Serve parents, teachers, elders or needy people.",
        "Avoid fear and choose conscious action.",
      ],
    })
  );

  return premiumSections;
}


function normalizeReportListItem(item: any, index: number, fallbackPrefix: string) {
  if (typeof item === "string") {
    return {
      name: item,
      category: fallbackPrefix,
      strength: "Detected",
      description: `${item} is detected in the available chart analysis. The exact intensity depends on planetary strength, house ownership, dignity, dasha activation and transit support.`,
      remedy: "Use this as guidance and confirm timing through dasha and transit.",
    };
  }

  return {
    name:
      safeText(
        item?.name ??
          item?.title ??
          item?.yoga ??
          item?.dosha ??
          item?.type ??
          item?.id,
        `${fallbackPrefix} ${index + 1}`
      ),
    category: safeText(item?.category ?? item?.group ?? item?.kind, fallbackPrefix),
    strength: safeText(
      item?.strength ??
        item?.status ??
        item?.score ??
        item?.level ??
        item?.severity ??
        item?.intensity,
      "Detected"
    ),
    description: safeText(
      item?.description ??
        item?.meaning ??
        item?.effect ??
        item?.result ??
        item?.interpretation ??
        item?.summary,
      "This combination is detected in the available chart analysis. Its results should be judged through planet strength, dignity, house connection, dasha and transit activation."
    ),
    remedy: safeText(
      item?.remedy ??
        item?.remedies?.join?.(", ") ??
        item?.suggestion ??
        item?.advice,
      "Follow simple, non-fear-based remedies and practical behavioural correction."
    ),
  };
}


const REPORT_SIGN_NAMES = [
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
];

function normalizeReportSign(value: any): string {
  if (typeof value === "string") {
    const clean = value.trim().toLowerCase();
    const match = REPORT_SIGN_NAMES.find((sign) => sign.toLowerCase() === clean);
    if (match) return match;

    const aliases: Record<string, string> = {
      mesh: "Aries",
      vrishabh: "Taurus",
      mithun: "Gemini",
      kark: "Cancer",
      simha: "Leo",
      kanya: "Virgo",
      tula: "Libra",
      vrishchik: "Scorpio",
      dhanu: "Sagittarius",
      makar: "Capricorn",
      kumbh: "Aquarius",
      meen: "Pisces",
    };

    return aliases[clean] ?? value;
  }

  const n = Number(value);

  if (Number.isFinite(n)) {
    if (n >= 0 && n <= 11) return REPORT_SIGN_NAMES[Math.round(n)] ?? "Unknown";
    if (n >= 1 && n <= 12) return REPORT_SIGN_NAMES[Math.round(n - 1)] ?? "Unknown";
    return REPORT_SIGN_NAMES[Math.floor((((n % 360) + 360) % 360) / 30)] ?? "Unknown";
  }

  return "Unknown";
}

function getReportPlanet(source: any, planetName: string): any {
  const root = getChartRoot(source);
  const lower = planetName.toLowerCase();

  const candidates = [
    root?.planets,
    root?.planetData,
    root?.grahas,
    root?.chart?.planets,
    root?.kundli?.planets,
    source?.planets,
    source?.chart?.planets,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (Array.isArray(candidate)) {
      const found = candidate.find((planet: any) => {
        const name = String(
          planet?.name ??
            planet?.planet ??
            planet?.graha ??
            planet?.id ??
            ""
        ).toLowerCase();

        return name === lower;
      });

      if (found) return found;
    }

    if (typeof candidate === "object") {
      return (
        candidate?.[planetName] ??
        candidate?.[lower] ??
        candidate?.[planetName.toUpperCase()] ??
        null
      );
    }
  }

  return null;
}

function getReportPlanetSign(source: any, planetName: string): string {
  const planet = getReportPlanet(source, planetName);

  return normalizeReportSign(
    planet?.sign ??
      planet?.rashi ??
      planet?.signName ??
      planet?.rashiName ??
      planet?.signIndex ??
      planet?.rashiIndex ??
      planet?.longitude ??
      planet?.lon ??
      planet?.degree
  );
}

function getReportPlanetHouse(source: any, planetName: string): number {
  const planet = getReportPlanet(source, planetName);
  const house = Number(planet?.house ?? planet?.bhava ?? planet?.houseNumber);

  if (Number.isFinite(house) && house >= 1 && house <= 12) return Math.round(house);

  return 0;
}

function reportSignDistance(fromSign: string, toSign: string): number {
  const from = REPORT_SIGN_NAMES.findIndex((sign) => sign === fromSign);
  const to = REPORT_SIGN_NAMES.findIndex((sign) => sign === toSign);

  if (from < 0 || to < 0) return -1;

  return ((to - from + 12) % 12) + 1;
}

function isReportKendraFrom(fromSign: string, toSign: string): boolean {
  return [1, 4, 7, 10].includes(reportSignDistance(fromSign, toSign));
}

function sameReportSign(a: string, b: string): boolean {
  return a !== "Unknown" && b !== "Unknown" && a === b;
}

function pushReportYoga(
  items: any[],
  name: string,
  category: string,
  strength: string,
  description: string,
  remedy: string
) {
  if (items.some((item) => String(item?.name).toLowerCase() === name.toLowerCase())) return;

  items.push({
    name,
    category,
    strength,
    description,
    remedy,
  });
}

function buildFallbackDetectedYogas(source: any): any[] {
  const items: any[] = [];

  const sunSign = getReportPlanetSign(source, "Sun");
  const moonSign = getReportPlanetSign(source, "Moon");
  const marsSign = getReportPlanetSign(source, "Mars");
  const mercurySign = getReportPlanetSign(source, "Mercury");
  const jupiterSign = getReportPlanetSign(source, "Jupiter");
  const venusSign = getReportPlanetSign(source, "Venus");
  const saturnSign = getReportPlanetSign(source, "Saturn");

  const marsHouse = getReportPlanetHouse(source, "Mars");
  const mercuryHouse = getReportPlanetHouse(source, "Mercury");
  const jupiterHouse = getReportPlanetHouse(source, "Jupiter");
  const venusHouse = getReportPlanetHouse(source, "Venus");
  const saturnHouse = getReportPlanetHouse(source, "Saturn");

  if (sameReportSign(sunSign, mercurySign)) {
    pushReportYoga(
      items,
      "Budh Aditya Yoga",
      "Intelligence / Authority Yoga",
      "Detected",
      `Sun and Mercury are placed together in ${sunSign}. This forms Budh Aditya Yoga, which can support intelligence, communication, administration, business thinking, confidence and public expression when supported by strength and dasha.`,
      "Use this yoga through disciplined communication, study, writing, business planning and respectful speech."
    );
  }

  if (isReportKendraFrom(moonSign, jupiterSign)) {
    pushReportYoga(
      items,
      "Gaj Kesari Yoga",
      "Wisdom / Protection Yoga",
      "Detected",
      `Jupiter is placed in a kendra relationship from Moon. This forms Gaj Kesari Yoga, which can support wisdom, protection, respect, learning, emotional maturity and guidance from mentors when Jupiter and Moon are strong.`,
      "Strengthen this yoga through learning, gratitude, charity, teacher respect and wise decision-making."
    );
  }

  if (sameReportSign(moonSign, marsSign) || reportSignDistance(moonSign, marsSign) === 7) {
    pushReportYoga(
      items,
      "Chandra Mangal Yoga",
      "Wealth / Action Yoga",
      "Detected",
      `Moon and Mars are connected by conjunction or opposition pattern. This forms Chandra Mangal Yoga, which can support initiative, business instinct, money movement and action-oriented emotional energy, but it also needs emotional control.`,
      "Use this yoga through disciplined action, anger control, financial planning and avoiding impulsive decisions."
    );
  }

  if (sameReportSign(jupiterSign, marsSign) || isReportKendraFrom(jupiterSign, marsSign)) {
    pushReportYoga(
      items,
      "Guru Mangal Yoga",
      "Courage / Wisdom Yoga",
      "Detected",
      `Jupiter and Mars are connected by sign or kendra relationship. This can create Guru Mangal Yoga, supporting courageous wisdom, initiative, leadership, protection and dharmic action when both planets are well supported.`,
      "Use this yoga through ethical action, physical discipline, learning and mentor-guided ambition."
    );
  }

  if ([1, 4, 7, 10].includes(marsHouse) && ["Aries", "Scorpio", "Capricorn"].includes(marsSign)) {
    pushReportYoga(
      items,
      "Ruchaka Mahapurusha Yoga",
      "Panch Mahapurusha Yoga",
      "Strong if Mars is unafflicted",
      `Mars is in a kendra and in a strong sign condition. This indicates Ruchaka Mahapurusha Yoga, supporting courage, command, physical drive, competition, engineering ability and leadership.`,
      "Use Mars through discipline, exercise, courage, protection of others and controlled speech."
    );
  }

  if ([1, 4, 7, 10].includes(mercuryHouse) && ["Gemini", "Virgo"].includes(mercurySign)) {
    pushReportYoga(
      items,
      "Bhadra Mahapurusha Yoga",
      "Panch Mahapurusha Yoga",
      "Strong if Mercury is unafflicted",
      `Mercury is in a kendra and in a strong sign condition. This indicates Bhadra Mahapurusha Yoga, supporting intelligence, speech, business, analytics, learning, writing and adaptability.`,
      "Use Mercury through study, writing, commerce, clear communication and honest calculation."
    );
  }

  if ([1, 4, 7, 10].includes(jupiterHouse) && ["Sagittarius", "Pisces", "Cancer"].includes(jupiterSign)) {
    pushReportYoga(
      items,
      "Hamsa Mahapurusha Yoga",
      "Panch Mahapurusha Yoga",
      "Strong if Jupiter is unafflicted",
      `Jupiter is in a kendra and in a strong sign condition. This indicates Hamsa Mahapurusha Yoga, supporting wisdom, respect, spirituality, teaching, blessings and protection.`,
      "Use Jupiter through learning, teaching, charity, ethics and respect for gurus."
    );
  }

  if ([1, 4, 7, 10].includes(venusHouse) && ["Taurus", "Libra", "Pisces"].includes(venusSign)) {
    pushReportYoga(
      items,
      "Malavya Mahapurusha Yoga",
      "Panch Mahapurusha Yoga",
      "Strong if Venus is unafflicted",
      `Venus is in a kendra and in a strong sign condition. This indicates Malavya Mahapurusha Yoga, supporting charm, comfort, creativity, relationship harmony, aesthetics and prosperity.`,
      "Use Venus through refined behaviour, art, relationship maturity and clean pleasure."
    );
  }

  if ([1, 4, 7, 10].includes(saturnHouse) && ["Capricorn", "Aquarius", "Libra"].includes(saturnSign)) {
    pushReportYoga(
      items,
      "Shasha Mahapurusha Yoga",
      "Panch Mahapurusha Yoga",
      "Strong if Saturn is unafflicted",
      `Saturn is in a kendra and in a strong sign condition. This indicates Shasha Mahapurusha Yoga, supporting discipline, authority, endurance, structure, mass influence and long-term achievement.`,
      "Use Saturn through patience, responsibility, service, humility and consistent work."
    );
  }

  const beneficTenth =
    [mercuryHouse, jupiterHouse, venusHouse].includes(10);

  if (beneficTenth) {
    pushReportYoga(
      items,
      "Amala Yoga",
      "Reputation / Karma Yoga",
      "Detected",
      "A benefic planet is connected with the 10th house. This indicates Amala Yoga, which can support clean reputation, professional respect, public goodwill and positive karma through work.",
      "Use this yoga through honest work, reputation care, service and consistent professional discipline."
    );
  }

  return items;
}

function buildFallbackDetectedDoshas(source: any): any[] {
  const items: any[] = [];

  const marsHouse = getReportPlanetHouse(source, "Mars");
  const sunSign = getReportPlanetSign(source, "Sun");
  const rahuSign = getReportPlanetSign(source, "Rahu");
  const ketuSign = getReportPlanetSign(source, "Ketu");

  if ([1, 4, 7, 8, 12].includes(marsHouse)) {
    items.push({
      name: "Manglik / Kuja Dosha",
      category: "Marriage / Mars Sensitivity",
      strength: "Detected",
      description: `Mars is placed in house ${marsHouse}, which is traditionally considered sensitive for Manglik or Kuja Dosha analysis. Final intensity depends on sign, aspects, cancellation factors and matching analysis.`,
      remedy: "Use anger control, patience in relationships, Hanuman prayer, physical discipline and careful matching before marriage decisions.",
    });
  }

  if (sameReportSign(sunSign, rahuSign) || sameReportSign(sunSign, ketuSign)) {
    items.push({
      name: "Pitru Dosha Signal",
      category: "Ancestral / Sun Node Sensitivity",
      strength: "Possible",
      description: "Sun is connected with Rahu or Ketu by sign, creating a possible ancestral or father-line sensitivity. This should be confirmed through house placement, ninth house condition and dasha activation.",
      remedy: "Respect father figures and ancestors, perform simple gratitude practice, donate food and avoid ego conflicts.",
    });
  }

  return items;
}


function collectPossibleYogas(source: any): any[] {
  const root = getChartRoot(source);
  const candidates = [
    root?.yogas,
    root?.detectedYogas,
    root?.yogaResults,
    root?.yogaList,
    root?.analysis?.yogas,
    root?.chart?.yogas,
    root?.kundli?.yogas,
    source?.yogas,
    source?.detectedYogas,
    source?.yogaResults,
    source?.chart?.yogas,
  ];

  const items: any[] = [];

  candidates.forEach((candidate) => {
    if (Array.isArray(candidate)) items.push(...candidate);
    else if (candidate && typeof candidate === "object") items.push(...Object.values(candidate));
  });

  items.push(...buildFallbackDetectedYogas(source));

  const seen = new Set<string>();

  return items.filter((item, index) => {
    const normalized = normalizeReportListItem(item, index, "Yoga");
    const key = normalized.name.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectPossibleDoshas(source: any): any[] {
  const root = getChartRoot(source);
  const candidates = [
    root?.doshas,
    root?.detectedDoshas,
    root?.doshaResults,
    root?.doshaList,
    root?.analysis?.doshas,
    root?.chart?.doshas,
    root?.kundli?.doshas,
    source?.doshas,
    source?.detectedDoshas,
    source?.doshaResults,
    source?.chart?.doshas,
  ];

  const items: any[] = [];

  candidates.forEach((candidate) => {
    if (Array.isArray(candidate)) items.push(...candidate);
    else if (candidate && typeof candidate === "object") items.push(...Object.values(candidate));
  });

  items.push(...buildFallbackDetectedDoshas(source));

  const seen = new Set<string>();

  return items.filter((item, index) => {
    const normalized = normalizeReportListItem(item, index, "Dosha");
    const key = normalized.name.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildDetailedParagraphsFromItems(
  rawItems: any[],
  fallbackPrefix: string,
  emptyParagraph: string
) {
  if (!rawItems.length) {
    return [
      emptyParagraph,
      `A mature ${fallbackPrefix.toLowerCase()} reading should not depend only on the name of a combination. The same combination can behave differently depending on planet dignity, house ownership, conjunctions, aspects, dasha activation, transit support and the native’s practical actions.`,
      `AstroLife treats ${fallbackPrefix.toLowerCase()} as guidance patterns, not fixed destiny. When more engine data is available, this section automatically expands into a complete item-wise interpretation.`,
    ];
  }

  return rawItems.map((item, index) => {
    const normalized = normalizeReportListItem(item, index, fallbackPrefix);

    return `${index + 1}. ${normalized.name} — ${normalized.category}, strength/status: ${normalized.strength}. ${normalized.description} Practical guidance: ${normalized.remedy}`;
  });
}

function buildSummaryFromItems(rawItems: any[], fallbackPrefix: string) {
  if (!rawItems.length) {
    return [
      `No detailed ${fallbackPrefix.toLowerCase()} list was found in the current chart payload.`,
      "The report will expand automatically when the engine sends item-wise data.",
      "Interpretation should be confirmed through strength, dasha and transit.",
      "Avoid fear-based conclusions.",
      "Use remedies with practical action.",
    ];
  }

  return rawItems.slice(0, 8).map((item, index) => {
    const normalized = normalizeReportListItem(item, index, fallbackPrefix);
    return `${normalized.name}: ${normalized.strength}`;
  });
}

export function buildAllYogasDoshasDetailedReportSections(input: any): ReportSection[] {
  const yogas = collectPossibleYogas(input);
  const doshas = collectPossibleDoshas(input);

  const yogaParagraphs = buildDetailedParagraphsFromItems(
    yogas,
    "Yoga",
    "The available chart payload does not currently include a full item-wise yoga list. This means the detailed yoga section is ready, but it needs the yoga engine output to include all detected yoga objects."
  );

  const doshaParagraphs = buildDetailedParagraphsFromItems(
    doshas,
    "Dosha",
    "The available chart payload does not currently include a full item-wise dosha list. This means the detailed dosha section is ready, but it needs the dosha engine output to include all detected dosha objects."
  );

  return [
    makeSection({
      id: "detailed-yogas",
      title: "Detailed Yogas",
      subtitle: yogas.length
        ? `All detected yogas from the chart engine: ${yogas.length} combinations found.`
        : "Complete yoga section prepared for all detected combinations.",
      score: yogas.length ? Math.min(95, 68 + yogas.length * 3) : 64,
      paragraphs: yogaParagraphs,
      summary: buildSummaryFromItems(yogas, "Yoga"),
      actionPlan: [
        "Judge each yoga through planet strength, dignity and house connection.",
        "Check dasha activation before expecting visible results.",
        "Use strong yogas as skill-building and opportunity areas.",
        "Do not assume every yoga gives full results immediately.",
      ],
      remedy: [
        "Respect planets involved in strong yogas.",
        "Use humility when success periods begin.",
        "Strengthen yoga areas through real-world action and discipline.",
      ],
    }),

    makeSection({
      id: "detailed-doshas",
      title: "Detailed Doshas & Corrections",
      subtitle: doshas.length
        ? `All detected doshas from the chart engine: ${doshas.length} sensitive patterns found.`
        : "Complete dosha section prepared for all detected sensitive combinations.",
      score: doshas.length ? Math.max(45, 72 - doshas.length * 2) : 66,
      paragraphs: doshaParagraphs,
      summary: buildSummaryFromItems(doshas, "Dosha"),
      actionPlan: [
        "Treat doshas as correction areas, not punishment.",
        "Check when the dosha planet becomes active through dasha or transit.",
        "Use simple behavioural remedies with spiritual practice.",
        "Avoid fear-based decisions or expensive remedy pressure.",
      ],
      remedy: [
        "For Saturn pressure: discipline, service and patience.",
        "For Mars pressure: anger control, exercise and careful speech.",
        "For Rahu/Ketu pressure: grounding, meditation and avoiding shortcuts.",
        "For Moon pressure: sleep, hydration and emotional regulation.",
      ],
    }),
  ];
}

export function buildGemstoneReportSection(input: any): ReportSection[] {
  try {
    const report = generateGemstoneReportFromChart(input);
    const primary = report.primaryGemstone;

    return [
      makeSection({
        id: "gemstone-suitability",
        title: "Gemstone Suitability",
        subtitle: `${report.lagnaSign} Lagna · Lagna Lord ${report.lagnaLord} · Primary suitability: ${primary.gemstone}`,
        score: primary.score,
        paragraphs: [
          `For ${report.lagnaSign} lagna, gemstone judgement begins from the ascendant, lagna lord, functional benefics and the current dasha context. The primary gemstone suitability shown here is ${primary.gemstone} for ${primary.planet}.`,
          primary.reason,
          report.dashaNote,
          "This is suitability guidance, not a final prescription. Gemstones amplify planetary energy, so expensive stones should be worn only after confirmation through full chart, dasha, current life situation and expert review.",
        ],
        summary: [
          `Primary: ${primary.gemstone}`,
          `Planet: ${primary.planet}`,
          `Alternate: ${primary.alternateGemstone}`,
          `Suitability: ${primary.score}%`,
          `Current dasha: ${report.currentDasha}`,
        ],
        actionPlan: [
          `Start with ${primary.planet} mantra or colour discipline before buying a gemstone.`,
          `If using a gemstone, prefer ${primary.wearing.metal} and traditional timing: ${primary.wearing.day}, ${primary.wearing.time}.`,
          "Use a short trial period before long-term wearing.",
          "Avoid gemstones listed as sensitive for the lagna unless an expert confirms.",
        ],
        remedy: [
          `Mantra: ${primary.wearing.mantra}`,
          `Suggested finger: ${primary.wearing.finger}`,
          `Suggested weight range: ${primary.wearing.weight}`,
          "Use donation, discipline and behavioural remedies along with any gemstone.",
        ],
      }),
    ];
  } catch {
    return [
      makeSection({
        id: "gemstone-suitability",
        title: "Gemstone Suitability",
        subtitle: "Gemstone guidance will appear when chart data is connected.",
        score: 60,
        paragraphs: [
          "Gemstone suitability needs lagna, planet strength and dasha context. Once chart data is available, AstroLife can recommend primary, secondary and avoid gemstones safely.",
          "This section intentionally avoids strong prescriptions without complete chart confirmation.",
        ],
        summary: [
          "Chart gemstone data not available yet.",
          "Use mantra and colour discipline first.",
          "Avoid expensive stones without confirmation.",
        ],
        actionPlan: [
          "Connect lagna, planet strength and current dasha before final gemstone judgement.",
          "Start with mantra, colour discipline and behavioural remedies first.",
          "Avoid wearing expensive gemstones without chart confirmation.",
        ],
        remedy: [
          "Use simple prayer, donation and discipline before gemstone use.",
          "Prefer safer substitute stones until full chart confirmation is available.",
          "Do not treat gemstone guidance as a guaranteed result.",
        ],
      }),
    ];
  }
}

function formatReportSafeValue(value: any): string {
  if (value === null || value === undefined) return "Not available";

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    return value.map(formatReportSafeValue).filter(Boolean).join(" > ");
  }

  if (typeof value === "object") {
    const planet =
      value.planet ??
      value.name ??
      value.lord ??
      value.dashaLord ??
      value.current ??
      value.label;

    const start = value.startDate ?? value.start ?? value.from;
    const end = value.endDate ?? value.end ?? value.to;

    if (planet && (start || end)) {
      return `${formatReportSafeValue(planet)}${start ? ` from ${formatReportSafeValue(start)}` : ""}${end ? ` to ${formatReportSafeValue(end)}` : ""}`;
    }

    if (planet) return formatReportSafeValue(planet);

    try {
      return Object.entries(value)
        .slice(0, 4)
        .map(([key, val]) => `${key}: ${formatReportSafeValue(val)}`)
        .join(", ");
    } catch {
      return "Structured data available";
    }
  }

  return String(value);
}


export function buildKpReportSections(input: any): ReportSection[] {
  try {
    const kp = calculateKpReport(input) as any;

    const strongest = kp.strongestEvent ?? kp.significators?.[0] ?? null;
    const events = Array.isArray(kp.significators) ? kp.significators : [];
    const cusps = Array.isArray(kp.cusps) ? kp.cusps : [];
    const rows = Array.isArray(kp.rows) ? kp.rows : [];

    const dashaPath =
      kp.input?.dashaPath ||
      [kp.input?.currentMD, kp.input?.currentAD, kp.input?.currentPD, kp.input?.currentSD]
        .filter(Boolean)
        .join(" > ") ||
      "Not connected";

    const topEvents = events
      .slice()
      .sort((a: any, b: any) => Number(b.score ?? 0) - Number(a.score ?? 0))
      .slice(0, 6);

    const eventSummary = topEvents.map((event: any) => {
      const label = formatReportSafeValue(event.label ?? event.topic ?? "KP Event");
      const score = formatReportSafeValue(event.score ?? "—");
      const houses = Array.isArray(event.positiveHouses)
        ? event.positiveHouses.join("-")
        : formatReportSafeValue(event.eventHouses ?? "—");

      return `${label}: ${score}% possibility · Houses ${houses}`;
    });

    const cuspSummary = cusps.slice(0, 12).map((cusp: any) => {
      return `H${formatReportSafeValue(cusp.house)} ${formatReportSafeValue(cusp.sign)} ${formatReportSafeValue(cusp.degreeText)} · Sub Lord ${formatReportSafeValue(cusp.subLord)} · S-S Lord ${formatReportSafeValue(cusp.subSubLord)}`;
    });

    const planetSummary = rows.slice(0, 10).map((row: any) => {
      return `${formatReportSafeValue(row.name)}: ${formatReportSafeValue(row.sign)} H${formatReportSafeValue(row.house)} · Star ${formatReportSafeValue(row.starLord)} · Sub ${formatReportSafeValue(row.subLord)}`;
    });

    return [
      makeSection({
        id: "kp-events-report",
        title: "KP Events & Sub-Lord Timing",
        subtitle: `Krishnamurti Paddhati event promise · Active dasha: ${dashaPath}`,
        score: Number(strongest?.score ?? 70),
        paragraphs: [
          "KP analysis studies star lord, sub lord, cusp promise and dasha activation. The purpose is not to create certainty, but to identify possible event areas and timing support.",
          `Current dasha context used for this KP layer: ${dashaPath}. If dasha data is not connected, KP events are judged mainly through house significators and cusp/sub-lord logic.`,
          strongest
            ? `Strongest current KP signal appears around ${formatReportSafeValue(strongest.label ?? strongest.topic)} with a possibility index of ${formatReportSafeValue(strongest.score)}%.`
            : "KP event signals will become more precise when full dasha and cusp data are connected.",
        ],
        summary: eventSummary.length
          ? eventSummary
          : [
              "KP event summary not available yet.",
              "Connect house cusps and dasha for deeper timing.",
              "Use possibility language, not guaranteed prediction.",
            ],
        actionPlan: [
          "Read KP events together with dasha, transit and real life situation.",
          "Use career houses 2-6-10-11 for career timing.",
          "Use marriage houses 2-7-11 for relationship settlement.",
          "Treat 6-8-12 dominance as delay, caution or correction, not fear.",
        ],
        remedy: [
          "Strengthen the active dasha planet through discipline, mantra and practical action.",
          "Avoid fear-based decisions from a single KP indication.",
          "Use KP as timing guidance, not fixed destiny.",
        ],
      }),
      makeSection({
        id: "kp-cusps-report",
        title: "KP House Cusps",
        subtitle: "Cusp degree · Star lord · Sub lord · Sub-sub lord",
        score: 72,
        paragraphs: [
          "In KP astrology, house cusps are very important. The cusp sub lord indicates whether a house can deliver its result, while dasha and transit decide when the result may activate.",
          "If exact KP cusp data is available in the chart object, AstroLife uses those degrees. If not, the section clearly falls back to whole-sign cusp logic until precise cusp data is connected.",
        ],
        summary: cuspSummary.length
          ? cuspSummary
          : [
              "Exact KP cusp data not connected yet.",
              "Fallback cusp logic may be used.",
              "Add houseCusps or kpCusps to chart data for exact KP results.",
            ],
        actionPlan: [
          "Check the relevant cusp before judging any event.",
          "For marriage, check 7th cusp.",
          "For career, check 10th cusp.",
          "For wealth, check 2nd and 11th cusp.",
        ],
        remedy: [
          "Use the sub lord planet for focused remedy.",
          "Prefer behavioural correction and discipline before ritual remedies.",
          "Confirm exact birth time for advanced KP cusp accuracy.",
        ],
      }),
      makeSection({
        id: "kp-planetary-details-report",
        title: "KP Planetary Details",
        subtitle: "Planetary star lord and sub lord table summary",
        score: 74,
        paragraphs: [
          "This section summarizes KP planetary details. Each planet is interpreted through sign, house, nakshatra lord, sub lord and sub-sub lord.",
          "The sub lord refines the final event result. Therefore, KP should always be read more carefully than a simple sign or house placement.",
        ],
        summary: planetSummary.length
          ? planetSummary
          : [
              "KP planetary details not available yet.",
              "Connect planet degree, sign, house and dasha data.",
              "Sub lord analysis will improve after full chart sync.",
            ],
        actionPlan: [
          "Study the planets connected with active dasha first.",
          "Prioritize planets that signify the event houses.",
          "Avoid judging KP from only one planet.",
        ],
        remedy: [
          "Respect the active dasha planet.",
          "Use mantra and disciplined practical action.",
          "Avoid over-certainty in timing predictions.",
        ],
      }),
    ];
  } catch {
    return [
      makeSection({
        id: "kp-events-report",
        title: "KP Events & Sub-Lord Timing",
        subtitle: "KP report will appear when chart data is connected.",
        score: 62,
        paragraphs: [
          "KP analysis requires planetary degrees, house cusps, star lords, sub lords and dasha context. Once these are connected, AstroLife can show event promise and timing support.",
          "This fallback avoids fake certainty and keeps the report safe until KP data is fully available.",
        ],
        summary: [
          "KP chart data not available yet.",
          "Connect kpCusps or houseCusps.",
          "Connect current Mahadasha and Antardasha.",
        ],
        actionPlan: [
          "Add real KP cusp data to chart object.",
          "Add current dasha path to chart object.",
          "Use possibility language only.",
        ],
        remedy: [
          "Do not make major decisions from fallback KP.",
          "Use complete chart and expert review for sensitive timing.",
          "Treat KP as guidance, not guarantee.",
        ],
      }),
    ];
  }
}

export function buildRealPanchangEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const p = calculatePanchang(getChartDate(chart), Number(chart?.tz ?? 5.5));
    return makeSection({
      id: "panchang-details",
      title: "Panchang Details",
      subtitle: `${p.weekday} · ${p.tithi} · ${p.nakshatra} Pada ${p.nakshatraPada}`,
      score: 78,
      paragraphs: [
        `The real Panchang engine was called for ${p.date}. It calculates the lunar day from Sun-Moon distance, nakshatra from Moon longitude, yoga from Sun plus Moon longitude and karana from half-tithi movement.`,
        `This birth/day Panchang shows ${p.paksha} Paksha ${p.tithi}, ${p.nakshatra} Nakshatra Pada ${p.nakshatraPada}, ${p.yoga} Yoga and ${p.karana} Karana.`,
        `Moon is in ${p.moonSign} and Sun is in ${p.sunSign}. These values should be read with Lagna, Moon sign, dasha and the rest of the natal chart before making deeper predictions.`,
      ],
      summary: [
        `Date: ${p.date}`,
        `Weekday: ${p.weekday}`,
        `Tithi: ${p.tithi} · ${p.paksha} Paksha`,
        `Nakshatra: ${p.nakshatra} Pada ${p.nakshatraPada}`,
        `Yoga: ${p.yoga} · Karana: ${p.karana}`,
        `Moon Sign: ${p.moonSign} · Sun Sign: ${p.sunSign}`,
      ],
      actionPlan: [
        `Use ${p.nakshatra} for mental and emotional reading.`,
        `Use ${p.tithi} and ${p.karana} for spiritual rhythm and remedy timing.`,
        "For exact muhurta, add local sunrise correction in a later phase.",
      ],
      remedy: p.notes.length
        ? p.notes
        : ["Keep intention clear, speech soft and daily discipline steady."],
    });
  } catch (error) {
    return safeSection("panchang-details", "Panchang Details", error);
  }
}

export function buildRealLalKitabReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const lk = calculateLalKitab(chart.planets, chart.dob, chart.lagnaNum ?? 0);
    const time = calculateLalKitabTimeEngine({
      dob: chart.dob,
      planets: chart.planets,
      lagnaNum: chart.lagnaNum ?? 0,
      targetDate: new Date(),
    });
    const pakka = lk.planets.filter((p: any) => p.status === "pakka");
    const dushman = lk.planets.filter((p: any) => p.status === "dushman");
    const activeAges = lk.planets.filter((p: any) => p.isActNow);
    const supportive = lk.coreAccuracy.filter((p: any) => p.beneficMalefic === "Benefic");
    const challenging = lk.coreAccuracy.filter((p: any) => p.beneficMalefic === "Malefic");
    const annual = lk.varshphal.annualPrediction;
    const topRemedies = time.remedyGuidance.slice(0, 4);

    return makeSection({
      id: "lalkitab-karma",
      title: "Lal Kitab Core, Timing & Remedy",
      subtitle: `${supportive.length} supportive · ${challenging.length} needs care · ${lk.varshphal.periodLabel}`,
      score: Math.max(42, Math.min(84, 70 + pakka.length * 3 - dushman.length * 4)),
      paragraphs: [
        `The Lal Kitab report first verifies the natal condition of each planet before suggesting daan or remedy. Supportive planets are protected; challenging planets receive selective soft correction, behaviour guidance and safe upaya.`,
        `${annual.headline} ${annual.career} ${annual.money} ${annual.family} ${annual.health} ${annual.remedy}`,
        `${time.thirtyFiveYearChakra.overview} ${time.thirtyFiveYearChakra.houseExplanation} ${time.thirtyFiveYearChakra.planetActivationExplanation}`,
        `${time.monthlyPhal.overview} ${time.monthlyPhal.moneyCareer} ${time.monthlyPhal.familyHealth}`,
        lk.hasPitraRin
          ? "Pitra Rin is detected in this chart. This should be handled through respectful ancestral remedies, father-line healing and consistent behavioural correction rather than fear."
          : "No strong Pitra Rin alert was detected by the Lal Kitab engine in this pass.",
      ],
      summary: [
        `Supportive planets: ${supportive.map((p: any) => `${p.planet} H${p.house}`).join(", ") || "None"}`,
        `Planets needing care: ${challenging.map((p: any) => `${p.planet} H${p.house}`).join(", ") || "None"}`,
        `Pakka Ghar planets: ${pakka.map((p: any) => `${p.planet} H${p.house}`).join(", ") || "None"}`,
        `Dushman Ghar planets: ${dushman.map((p: any) => `${p.planet} H${p.house}`).join(", ") || "None"}`,
        `Takkar combinations: ${lk.takkars.map((t: any) => `${t.p1}-${t.p2} H${t.house}`).join(", ") || "None"}`,
        `Rin zones: ${lk.rins.map((r: any) => `${r.planet} H${r.house}`).join(", ") || "None"}`,
        `Activation now: ${activeAges.map((p: any) => `${p.planet} age ${p.actAge}`).join(", ") || "None"}`,
      ],
      actionPlan: [
        "Do not donate the core vastu of a supportive planet; preserve its strength first.",
        "Use daan only where the Lal Kitab condition allows it, especially for challenging 6/8/12-style pressure zones.",
        "Read Varshphal, 35-sala chakra and monthly phal as separate Lal Kitab timing layers, not as ordinary transit.",
        "Follow only the top 1-3 upaya consistently instead of remedy overload.",
      ],
      remedy: [
        ...topRemedies.map((r: any) => {
          if (r.decision === "daan_allowed") return `${r.planet}: daan allowed for ${r.canDonate.join(", ")}`;
          if (r.decision === "daan_avoid") return `${r.planet}: avoid donating ${r.doNotDonate.join(", ")}`;
          return `${r.planet}: ${r.preferredCorrection.join(", ")}`;
        }),
        ...lk.rins.slice(0, 2).map((r: any) => `${r.planet} Rin: ${r.upaya}`),
      ].slice(0, 5),
    });
  } catch (error) {
    return safeSection("lalkitab-karma", "Lal Kitab Karma", error);
  }
}

export function buildRealShadbalaEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateShadbala(chart.planets);
    const strongest = result.planets.find((p: any) => p.planet === result.strongest) ?? result.planets[0];
    const weakest = result.planets.find((p: any) => p.planet === result.weakest) ?? result.planets[result.planets.length - 1];

    return makeSection({
      id: "shadbala",
      title: "Shadbala & Planet Strength",
      subtitle: `Average strength ${result.avgStrength}% · Strongest ${result.strongest} · Weakest ${result.weakest}`,
      score: result.avgStrength,
      paragraphs: [
        "The real Shadbala engine was called for this PDF. It evaluates Sthana, Dig, Kala, Cheshta, Naisargika and Drik Bala for each planet from the natal chart.",
        result.summary,
        strongest ? `${strongest.planet} is the strongest visible planet with ${strongest.percentage}% strength and ${strongest.grade} grade.` : "Strongest planet could not be resolved.",
        weakest ? `${weakest.planet} is the most sensitive planet with ${weakest.percentage}% strength and ${weakest.grade} grade.` : "Weakest planet could not be resolved.",
      ],
      summary: result.planets
        .slice()
        .sort((a: any, b: any) => b.percentage - a.percentage)
        .map((p: any) => `${p.planet}: ${p.percentage}% · ${p.grade}`),
      actionPlan: [
        `Use ${result.strongest} as a support planet during action periods.`,
        `Treat ${result.weakest} themes with patience, remedy and practical discipline.`,
        "Read strength together with dasha before expecting major results.",
      ],
      remedy: [
        weakest ? `Strengthen ${weakest.planet} through its mantra, duty and behavioural correction.` : "Use simple daily discipline.",
        "Respect weak planet significations instead of fearing them.",
      ],
    });
  } catch (error) {
    return safeSection("shadbala", "Shadbala & Planet Strength", error);
  }
}

export function buildRealAshtakavargaEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateAshtakavarga(chart.planets, Number(chart.lagnaNum ?? 0));

    return makeSection({
      id: "ashtakavarga",
      title: "Ashtakavarga Strength",
      subtitle: `Sarvashtakavarga total ${result.sarvaTotal} bindus`,
      score: Math.max(40, Math.min(90, Math.round(result.sarvaTotal / 4))),
      paragraphs: [
        "The real Ashtakavarga engine was called for this PDF. It calculates planet-wise bindu tables and Sarvashtakavarga house strength from the natal chart.",
        result.summary,
        `Strongest houses from the engine are H${result.strongest.map((i: number) => i + 1).join(", H")}; weakest houses are H${result.weakest.map((i: number) => i + 1).join(", H")}.`,
      ],
      summary: result.houses.map((h: any) => `H${h.house} ${h.name}: ${h.score} bindus · ${h.grade}`),
      actionPlan: [
        "Use strong bindu houses for action and growth.",
        "Use weak bindu houses for planning, patience and remedies.",
        "Read Ashtakavarga with dasha and transit timing.",
      ],
      remedy: result.houses
        .filter((h: any) => h.grade === "Weak")
        .slice(0, 4)
        .map((h: any) => `H${h.house} ${h.name}: slow down, plan carefully and avoid forcing results.`),
    });
  } catch (error) {
    return safeSection("ashtakavarga", "Ashtakavarga Strength", error);
  }
}

export function buildRealTransitRadarEngineReportSection(input: any): ReportSection {
  try {
    const chart = normalizeChartForTransit(getEngineChart(input));
    const transit = calculateTransitReport({ chart, base: "lagna", date: new Date() });
    const radar = calculateEventRadarReport({ chart, startDate: new Date(), days: 7, base: "lagna" });
    const best = [...radar.days].sort((a: any, b: any) => b.overallScore - a.overallScore)[0];
    const caution = [...radar.days].sort((a: any, b: any) => a.overallScore - b.overallScore)[0];

    return makeSection({
      id: "transit-event-radar",
      title: "Transit & Event Radar",
      subtitle: `${transit.baseLabel} · Best ${best?.label ?? "N/A"} · Caution ${caution?.label ?? "N/A"}`,
      score: best?.overallScore ?? 65,
      paragraphs: [
        "The real Transit and Event Radar engines were called for this PDF. Transit calculates current planetary movement against the natal chart, and Event Radar converts the next 7 days into action/caution windows.",
        transit.summary,
        radar.summary,
      ],
      summary: [
        `Best day: ${best?.label ?? "N/A"} · ${best?.bestArea ?? "N/A"} · ${best?.overallScore ?? "N/A"}`,
        `Caution day: ${caution?.label ?? "N/A"} · ${caution?.cautionArea ?? "N/A"} · ${caution?.overallScore ?? "N/A"}`,
        ...transit.areaScores.map((a: any) => `${a.area}: ${a.score} · ${a.summary}`),
      ],
      actionPlan: [
        "Use high-score days for applications, meetings and launch actions.",
        "Use low-score days for review, patience and correction.",
        "Read transit weather through the active dasha.",
      ],
      remedy: radar.days.slice(0, 3).map((d: any) => `${d.label}: ${d.remedy}`),
    });
  } catch (error) {
    return safeSection("transit-event-radar", "Transit & Event Radar", error);
  }
}

export function buildRealPsychologyEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculatePsychology(chart.planets);
    const strong = result.planets.filter((p: any) => p.status === "Strong");
    const weak = result.planets.filter((p: any) => p.status === "Weak/Blocked");

    return makeSection({
      id: "psychology-shadow-pattern",
      title: "Psychology & Shadow Pattern",
      subtitle: `${result.pattern.name} · Anxiety ${result.pattern.anxietyIdx} · Karma loop ${result.pattern.karmaLoop}`,
      score: Math.max(35, Math.min(88, 72 - result.pattern.anxietyIdx / 5 + strong.length * 2)),
      paragraphs: [
        "The real Psychology engine was called for this PDF. It evaluates planetary psychological functions, strength, shadows, anxiety index, karma loop and behavioural bias.",
        result.summary,
        `${result.pattern.name}: ${result.pattern.desc}`,
        `Shadow work: ${result.pattern.shadow}`,
      ],
      summary: [
        `Dominant pattern: ${result.pattern.name}`,
        `Anxiety index: ${result.pattern.anxietyIdx}`,
        `Karma loop: ${result.pattern.karmaLoop}`,
        `Behavioural bias: ${result.pattern.behavBias}`,
        `Strong functions: ${strong.map((p: any) => p.planet).join(", ") || "None"}`,
        `Blocked functions: ${weak.map((p: any) => p.planet).join(", ") || "None"}`,
      ],
      actionPlan: [
        "Work first on blocked psychological planets.",
        "Use journaling and behavioural tracking for repeated emotional loops.",
        "Convert strong psychological functions into daily discipline.",
      ],
      remedy: weak.slice(0, 4).map((p: any) => `${p.planet}: ${p.weak}`),
    });
  } catch (error) {
    return safeSection("psychology-shadow-pattern", "Psychology & Shadow Pattern", error);
  }
}

export function buildRealVastuEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateVastu(chart.planets);

    return makeSection({
      id: "vastu-zones",
      title: "Astro-Vastu 16 Zone Analysis",
      subtitle: `Overall score ${result.overallScore} · ${result.strongZones.length} strong · ${result.weakZones.length} weak`,
      score: result.overallScore,
      paragraphs: [
        "The real Astro-Vastu engine was called for this PDF. It maps natal planetary signals to 16 Vastu zones, direction strength, room guidance, alerts and remedies.",
        `Overall Vastu score is ${result.overallScore}/100. The chart shows ${result.strongZones.length} strong zones and ${result.weakZones.length} weak zones.`,
        `Strong zones: ${result.strongZones.map((z: any) => `${z.dir} ${z.name}`).join(", ") || "None"}. Weak zones: ${result.weakZones.map((z: any) => `${z.dir} ${z.name}`).join(", ") || "None"}.`,
      ],
      summary: result.zones.map((z: any) => `${z.dir} ${z.name}: ${z.score}/100 · ${z.status} · ${z.domain}`),
      actionPlan: [
        "Use strong zones for important rooms and supportive activity.",
        "Correct weak zones with cleanliness, light, colour and simple remedies.",
        "Avoid making Vastu changes from fear; use practical corrections first.",
      ],
      remedy: result.weakZones.slice(0, 5).map((z: any) => `${z.dir} ${z.name}: ${z.remedy}`),
    });
  } catch (error) {
    return safeSection("vastu-zones", "Astro-Vastu 16 Zone Analysis", error);
  }
}

export function buildRealDivisionalEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const divs = calculateDivisional(chart.planets, chart.lagnaNum, chart.lagnaLon);
    const d9 = divs.find((d: any) => d.key === "D9");
    const d10 = divs.find((d: any) => d.key === "D10");
    const d9Insights = d9 ? getNavamshaAnalysis(d9) : [];
    const d10Insights = d10 ? getDashamshaAnalysis(d10) : [];
    const universal = analyzeUniversalShodashaVarga({
      language: "hinglish",
      birthTimeConfidence: 86,
      charts: divs,
      dasha: extractDashaInput(chart),
    });

    return makeSection({
      id: "divisional-charts-summary",
      title: "Universal Shodasha Varga Intelligence",
      subtitle: `Overall ${universal.overallScore}/100 · ${formatVargaLabel(universal.overallLabel)} · 16 classical vargas`,
      score: universal.overallScore,
      paragraphs: [
        universal.overallNarrative,
        "The real Divisional Chart engine was called for this PDF. It calculates the main varga placements from natal planet longitudes and reads D1 promise, varga confirmation, dasha activation and birth-time sensitivity together.",
        d9 ? `Navamsha D9 Lagna is ${d9.lagna}. ${d9.keyInsight}` : "D9 data could not be resolved.",
        d10 ? `Dashamsha D10 Lagna is ${d10.lagna}. ${d10.keyInsight}` : "D10 data could not be resolved.",
        ...universal.strongestAreas.slice(0, 2).map((section) => section.paragraph),
        ...universal.growthAreas.slice(0, 2).map((section) => section.paragraph),
      ],
      summary: universal.sections.map((section) => `${section.chart} ${section.shortName}: ${section.score}/100 ${formatVargaLabel(section.label)} (${section.confidenceText})`),
      actionPlan: [
        "Use D1 as promise, then confirm the topic through its relevant varga.",
        "Use D9 for marriage, D10 for career, D4 for property, D2 for wealth and D7 for children.",
        "Use D40/D45/D60 as refinement only when birth time is reliable.",
      ],
      remedy: [
        ...universal.growthAreas.slice(0, 4).flatMap((section) => section.recommendations.slice(0, 1)),
        ...d9Insights.slice(0, 2),
        ...d10Insights.slice(0, 2),
      ],
    });
  } catch (error) {
    return safeSection("divisional-charts-summary", "Divisional Charts Summary", error);
  }
}

export function buildRealDestinyEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateDestiny(chart.planets, chart.dashas, chart.dob, chart.lagnaNum ?? 0);

    return makeSection({
      id: "destiny-timeline",
      title: "Destiny Timeline",
      subtitle: `Age ${result.currentAge} · ${result.currentDasha} Mahadasha · Score ${result.currentScore}%`,
      score: result.currentScore,
      paragraphs: [
        "The real Destiny Curve engine was called for this PDF. It scores life phases through dasha periods, current age, peak period, challenge period and six life-area scores.",
        result.summary,
        `Peak period: ${result.peak?.planet ?? "N/A"} Mahadasha with score ${result.peak?.score ?? "N/A"}%. Challenge period: ${result.challenge?.planet ?? "N/A"} Mahadasha with score ${result.challenge?.score ?? "N/A"}%.`,
      ],
      summary: result.areas.map((a: any) => `${a.name}: ${a.score}/100 · ${a.status}`),
      actionPlan: [
        "Use high-score dasha phases for growth and visibility.",
        "Use challenge phases for correction, discipline and foundation building.",
        "Read annual/monthly planning through current dasha and transit.",
      ],
      remedy: [
        `Current dasha focus: ${result.currentDasha}. Respect this planet through disciplined action.`,
        "Do not wait passively for timing; use timing to choose better action.",
      ],
    });
  } catch (error) {
    return safeSection("destiny-timeline", "Destiny Timeline", error);
  }
}

export function buildRealMedicalEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateMedical(chart);
    const nakshatraDisease = result.birthNakshatraData?.disease ?? "None specific";
    const scoreRows = Object.entries(result.healthScores)
      .sort((a: any, b: any) => Number(b[1]) - Number(a[1]))
      .map(([name, score]) => `${name}: ${score}/100`);
    const topCombos = result.triggeredCombos.slice(0, 4).map(c => c.disease);

    return makeSection({
      id: "medical-astrology",
      title: "Medical Astrology",
      subtitle: `${result.lagnaSign} constitution · Accident risk ${result.accidentScore}/100`,
      score: Math.max(35, Math.min(86, 82 - result.accidentScore / 3 - result.triggeredCombos.length * 4)),
      paragraphs: [
        "The real Medical Astrology engine was called for this report. It reads lagna constitution, Moon nakshatra, disease-sensitive houses, planet-house health notes, classical combination alerts and broad body-system risk scores.",
        `Constitutional base: ${result.prakriti}`,
        nakshatraDisease && nakshatraDisease !== "None specific"
          ? `Nakshatra sensitivity: ${result.birthNakshatra} indicates ${nakshatraDisease}. This is a tendency marker, not a diagnosis.`
          : `Birth nakshatra ${result.birthNakshatra || "not resolved"} does not show a strong nakshatra-specific health alert in this pass.`,
        "Medical astrology is only a wellness reflection layer. It must not replace diagnosis, treatment, emergency care or qualified medical advice.",
      ],
      summary: [
        `Lagna constitution: ${result.lagnaSign}`,
        `Top concern zones: ${result.topConcerns.join(", ") || "None elevated"}`,
        `Accident risk: ${result.accidentScore}/100`,
        ...scoreRows,
        ...(topCombos.length ? [`Classical patterns: ${topCombos.join(", ")}`] : []),
      ].slice(0, 14),
      actionPlan: [
        "Use this section for prevention, routine and awareness only.",
        "Prioritize sleep, hydration, movement and medical screening when a body-system score is elevated.",
        "Consult a qualified doctor for symptoms, diagnosis, medicine and emergency decisions.",
      ],
      remedy: [
        "Keep a soft daily health discipline instead of fear-based conclusions.",
        "For elevated mental scores, use breathwork, counselling support and steady sleep routine.",
        "For accident risk, drive carefully, avoid impulsive actions and respect safety protocols.",
      ],
    });
  } catch (error) {
    return safeSection("medical-astrology", "Medical Astrology", error);
  }
}

export function buildRealRemedyEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateRemedies(chart);
    const urgent = result.cards.filter((card: any) => card.priority === "urgent");
    const recommended = result.cards.filter((card: any) => card.priority === "recommended");

    return makeSection({
      id: "remedy-engine",
      title: "Remedy Engine",
      subtitle: `${result.urgentCount} urgent · ${recommended.length} recommended · top ${result.topPriority?.planet ?? "N/A"}`,
      score: Math.max(42, Math.min(88, 76 - urgent.length * 4 + recommended.length)),
      paragraphs: [
        "The real Remedy engine was called for this report. It converts planet, house, sign, nakshatra and dignity into practical upaya covering mantra, charity, behaviour, colour discipline and gemstone caution.",
        result.topPriority
          ? `Top priority remedy belongs to ${result.topPriority.planet} in House ${result.topPriority.house}. The practical instruction is: ${result.topPriority.practice}`
          : "No single urgent remedy dominates this chart; simple steady discipline is preferred.",
        result.contradictionSafePlan,
      ],
      summary: result.cards
        .slice(0, 9)
        .map((card: any) => `${card.planet} H${card.house} ${card.sign}: ${card.priority} · ${card.status}`),
      actionPlan: [
        ...result.unifiedSafetyPlan.slice(0, 3),
        "Review remedies through active dasha and actual life situation.",
      ],
      remedy: result.cards
        .slice(0, 6)
        .map((card: any) => `${card.planet}: ${card.safetyNote} ${card.mantra}; ${card.practice}`),
    });
  } catch (error) {
    return safeSection("remedy-engine", "Remedy Engine", error);
  }
}

export function buildRealSarvatobhadraEngineReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateSarvatobhadra(chart);
    const highAlerts = result.vedhaAlerts.filter((alert: any) => alert.severity === "high");
    const activeRows = result.rows.filter((row: any) => row.isActive).slice(0, 10);

    return makeSection({
      id: "sarvatobhadra-chakra",
      title: "Sarvatobhadra Chakra",
      subtitle: `Janma ${result.birthNakshatra} · ${result.vedhaAlerts.length} vedha alerts`,
      score: Math.max(38, Math.min(84, 78 - highAlerts.length * 6)),
      paragraphs: [
        "The real Sarvatobhadra Chakra engine was called for this report. It maps the birth Moon nakshatra, sensitive vedha nakshatras, natal planet nakshatra positions and current transit nakshatra hits.",
        `Birth Moon nakshatra is ${result.birthNakshatra}. Sensitive vedha points are calculated by classical distance logic from the janma nakshatra.`,
        result.vedhaAlerts.length
          ? `Current vedha alerts are active. The strongest signals are ${result.vedhaAlerts.slice(0, 4).map((a: any) => `${a.planet} in ${a.nakshatra}`).join(", ")}.`
          : "No major current Sarvatobhadra vedha alert is active in this pass.",
      ],
      summary: [
        `Janma nakshatra: ${result.birthNakshatra}`,
        `Janma index: ${result.birthNakshatraIndex + 1}/27`,
        `High alerts: ${highAlerts.length}`,
        ...result.vedhaAlerts.slice(0, 8).map((a: any) => `${a.planet}: ${a.nakshatra} · ${a.description} · ${a.severity}`),
        ...activeRows.map((row: any) => `${row.name}: natal ${row.natalPlanets.join(", ") || "-"} · transit ${row.transitPlanets.join(", ") || "-"}`),
      ].slice(0, 14),
      actionPlan: [
        "Use Sarvatobhadra for short-term sensitivity and transit caution.",
        "When malefic vedha is active, avoid rushing and choose cleaner timing.",
        "When benefic activation is present, use the day for constructive work.",
      ],
      remedy: highAlerts.length
        ? highAlerts.slice(0, 4).map((a: any) => `${a.planet}: slow down, keep discipline and avoid impulsive decisions around ${a.description.toLowerCase()}.`)
        : ["Maintain simple prayer, clean intention and steady action during current transit weather."],
    });
  } catch (error) {
    return safeSection("sarvatobhadra-chakra", "Sarvatobhadra Chakra", error);
  }
}

// Bug Fix #1 — Jaimini section (was only in report-generator.ts)
export function buildRealJaiminiReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const karakas = calculateKarakas(chart.planets) as any[];
    const arudhas = calculateArudhas(chart) as any[];
    const charaDasha = calculateCharaDasha(chart) as any[];
    const atmakaraka = karakas.find((k: any) => k.karaka === "AK" || k.karaka === "Atmakaraka") ?? karakas[0];
    const active = charaDasha.find((cd: any) => cd.active) ?? charaDasha[0];

    return makeSection({
      id: "jaimini-system",
      title: "Jaimini System",
      subtitle: `Karakas · Arudhas · Chara Dasha`,
      score: 70,
      paragraphs: [
        "The Jaimini system uses planet degrees to assign Karakas (significators). Atmakaraka represents the soul's deepest lesson, Amatyakaraka shows career path, Darakaraka shows marriage and Putrakaraka shows children.",
        atmakaraka
          ? `Atmakaraka is ${atmakaraka.planet} at ${(atmakaraka.lon % 30).toFixed(2)}° in ${atmakaraka.sign}. This planet represents the primary karmic mission of the soul.`
          : "Karaka data not fully available — connect planet degrees for precise Jaimini Karaka judgement.",
        active
          ? `Current Chara Dasha period: ${active.sign} sign (${new Date(active.start).getFullYear()}–${new Date(active.end).getFullYear()}). This sign and its lord govern the current Jaimini timing layer.`
          : "Chara Dasha timing data requires birth date to be calculated.",
        "Arudhas show the visible external manifestation of houses. Arudha Lagna (A1) shows public image and Upapada (UL) shows marriage karma. Jaimini should be read alongside Parashara for a complete picture.",
      ],
      summary: [
        ...karakas.slice(0, 7).map((k: any) => `${k.karaka}: ${k.planet} at ${(k.lon % 30).toFixed(2)}° ${k.sign}`),
        ...arudhas.slice(0, 3).map((a: any) => `${a.key ?? a.name ?? "Arudha"}: ${a.sign} H${a.house}`),
        active ? `Active Chara Dasha: ${active.sign}` : "Chara Dasha: connect birth date",
      ].slice(0, 10),
      actionPlan: [
        atmakaraka ? `Work consciously with ${atmakaraka.planet} themes as your soul's primary lesson.` : "Connect planetary degrees for Atmakaraka analysis.",
        "Use Arudha Lagna to understand public reputation and external image.",
        "Use Chara Dasha for alternate Jaimini timing alongside Vimshottari.",
        "Read Atmakaraka sign in Navamsha for deeper soul purpose analysis.",
      ],
      remedy: [
        atmakaraka ? `Strengthen ${atmakaraka.planet} through disciplined focus on its significations.` : "Use mantra and meditation for inner clarity.",
        "Respect the soul's lessons without resistance or fear.",
        "Use Jaimini karakas as a guide to conscious life direction.",
      ],
    });
  } catch (error) {
    return safeSection("jaimini-system", "Jaimini System", error);
  }
}

// Part 1 #1 — Transit Ripple
export function buildRealTransitRippleReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const planets: TransitRipplePlanet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const ripples = planets.map(planet => {
      try { return buildTransitRipplePayloadFromChart(chart, planet); } catch { return null; }
    }).filter(Boolean) as NonNullable<ReturnType<typeof buildTransitRipplePayloadFromChart>>[];

    const dashaLinked = ripples.filter(r =>
      r.payload.transitPlanet === r.payload.currentMahadasha ||
      r.payload.transitPlanet === r.payload.currentAntardasha
    );
    const major = ripples.filter(r => ["Saturn", "Jupiter", "Rahu", "Ketu", "Mars"].includes(r.payload.transitPlanet));

    return makeSection({
      id: "transit-ripple",
      title: "Transit Ripple Analysis",
      subtitle: "All major planets · one-month transit activation",
      score: Math.min(88, 62 + ripples.length * 2 + dashaLinked.length * 4),
      paragraphs: [
        "Transit Ripple shows how the major moving planets are currently activating the natal chart. This section now checks the full transit field instead of reducing the reading to Saturn alone.",
        major.length
          ? `Major pressure and growth transits: ${major.map(r => `${r.payload.transitPlanet} in ${r.payload.transitSign}/${r.payload.transitNakshatra}`).join("; ")}.`
          : "Major transit data could not be fully calculated for this chart.",
        dashaLinked.length
          ? `Dasha-linked transits are louder this month: ${dashaLinked.map(r => r.payload.transitPlanet).join(", ")}.`
          : "No transit planet directly matches the active Mahadasha or Antardasha, so results should be read as supportive background unless natal promise is triggered.",
        "For monthly timing, use the dashboard Transit Ripple page because it scans daily sign and nakshatra changes across the next 30 days.",
      ],
      summary: ripples.map(r => `${r.payload.transitPlanet}: ${r.payload.transitSign} · ${r.payload.transitNakshatra} · ${r.payload.transitSpeed}`),
      actionPlan: [
        "Read all transit planets through the current Mahadasha planet first.",
        "Use Saturn for discipline, Jupiter for opportunity, Rahu for ambition and Ketu for release.",
        "Use Sun, Moon, Mars, Mercury and Venus for monthly action, mood, conflict, decisions and relationships.",
        "Do not make fear-based decisions from a single transit; combine natal promise, dasha and transits.",
      ],
      remedy: [
        "For pressure transits: discipline, sleep, routine and truthful communication first.",
        "For opportunity transits: study, networking, ethical expansion and documented action.",
        "For fast Moon/Mercury/Venus changes: use timing for mood, conversation and planning, not fear.",
      ],
    });
  } catch (error) {
    return safeSection("transit-ripple", "Transit Ripple Analysis", error);
  }
}

// Part 1 #2 — Special Lagnas
export function buildRealSpecialLagnasReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = calculateSpecialLagnas(chart);
    const al = result.items.find(i => i.key === "AL");
    const ul = result.items.find(i => i.key === "UL");
    const hl = result.items.find(i => i.key === "HL");
    const gl = result.items.find(i => i.key === "GL");

    return makeSection({
      id: "special-lagnas",
      title: "Special Lagnas",
      subtitle: `Arudha Lagna · Upapada · Hora · Ghati Lagnas`,
      score: 72,
      paragraphs: [
        "Special Lagnas are derived sensitive points that reveal specific areas of life. Arudha Lagna shows public image. Upapada shows marriage karma. Hora Lagna shows wealth timing. Ghati Lagna shows authority and power.",
        result.summary,
        al ? `Arudha Lagna (${al.sign}, H${al.house}): ${al.interpretation}` : "Arudha Lagna could not be calculated.",
        ul ? `Upapada Lagna (${ul.sign}, H${ul.house}): ${ul.interpretation}` : "Upapada Lagna could not be calculated.",
      ],
      summary: result.items.map(i => `${i.name} (${i.key}): ${i.sign} H${i.house} · ${i.meaning}`),
      actionPlan: [
        al ? `Align public behaviour with ${al.sign} AL qualities to protect reputation.` : "Calculate Arudha Lagna from lagna lord position.",
        ul ? `Read ${ul.sign} UL with Venus and 7th house for marriage karma.` : "Connect marriage charts through Upapada.",
        hl ? `Use ${hl.sign} Hora Lagna for wealth timing and money decisions.` : "Use Hora Lagna for money cycle analysis.",
        gl ? `${gl.sign} Ghati Lagna indicates authority area and power expression.` : "Ghati Lagna connects to positions of authority.",
      ],
      remedy: [
        "Strengthen Arudha Lagna through consistent, authentic public behaviour.",
        "Use Upapada for marriage readiness awareness, not fear.",
        "Hora Lagna periods support financial planning and disciplined money decisions.",
      ],
    });
  } catch (error) {
    return safeSection("special-lagnas", "Special Lagnas", error);
  }
}

// Part 1 #3 — Marriage Intelligence
export function buildRealMarriageIntelligenceReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const divs = calculateDivisional(chart.planets, chart.lagnaNum, chart.lagnaLon);
    let kp: any = null;
    try { kp = calculateKpReport(chart); } catch { /* optional */ }
    const result = buildMarriageIntelligenceV2({ divs, kp: kp ?? undefined });

    return makeSection({
      id: "marriage-intelligence",
      title: "Marriage Intelligence",
      subtitle: `${result.label.replace(/_/g, " ")} · D9 ${result.divisional.d9MarriageDelivery.score}/100 · Overall ${result.overallScore}/100`,
      score: result.overallScore,
      paragraphs: [
        result.narrative,
        result.divisional.d9MarriageDelivery.paragraph,
        result.divisional.d9ContinuityCare.paragraph,
        result.kp ? `KP Validation: ${result.kp.paragraph}` : "KP validation supports this analysis when cusp data is connected.",
        result.safetyBoundary,
      ],
      summary: [
        `Overall: ${result.overallScore}/100 · ${result.label.replace(/_/g, " ")}`,
        `D9 Marriage Delivery: ${result.divisional.d9MarriageDelivery.score}/100`,
        `D9 Continuity Care: ${result.divisional.d9ContinuityCare.score}/100`,
        `D7 Children Awareness: ${result.divisional.d7ChildrenAwareness.score}/100`,
        ...result.divisional.d9MarriageDelivery.indicators.slice(0, 4),
      ],
      actionPlan: [
        ...result.divisional.d9MarriageDelivery.recommendations.slice(0, 3),
        "Check Dasha activation for marriage timing alongside this divisional analysis.",
      ],
      remedy: [
        ...result.divisional.d9ContinuityCare.recommendations.slice(0, 3),
      ],
    });
  } catch (error) {
    return safeSection("marriage-intelligence", "Marriage Intelligence", error);
  }
}

// Part 1 #4 — Relationship Intelligence
function buildRelationshipInput(chart: any): RelationshipInput {
  const PLANET_KEYS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"] as const;
  const planets = PLANET_KEYS
    .filter(name => chart.planets?.[name])
    .map(name => {
      const p = chart.planets[name];
      return { planet: name as any, house: p.house ?? 1, sign: p.sign, nakshatra: p.nakshatra, isRetrograde: p.retrograde ?? false };
    });
  const houses = Array.from({ length: 12 }, (_, i) => ({ house: i + 1 }));
  const activeMD = chart.dashas?.find((d: any) => d.active) ?? chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((d: any) => d.active) ?? chart.antardasha?.[0];
  return {
    language: "english" as const,
    planets,
    houses,
    dasha: activeMD ? { mahadasha: activeMD.planet as any, antardasha: activeAD?.planet as any } : undefined,
  };
}

export function buildRealRelationshipIntelligenceReportSection(input: any): ReportSection {
  try {
    const chart = getEngineChart(input);
    const result = analyzeRelationshipIntelligence(buildRelationshipInput(chart));

    return makeSection({
      id: "relationship-intelligence",
      title: "Relationship Intelligence",
      subtitle: `Marriage ${result.marriageScore}/100 · Children ${result.childrenScore}/100`,
      score: Math.round((result.marriageScore + result.childrenScore) / 2),
      paragraphs: [
        result.marriageNarrative,
        result.childrenNarrative,
        result.layers.marriagePromise.paragraph,
        result.layers.relationshipPsychology.paragraph,
        result.safetyBoundary,
      ],
      summary: [
        `Marriage score: ${result.marriageScore}/100`,
        `Children awareness: ${result.childrenScore}/100`,
        `Marriage promise: ${result.layers.marriagePromise.score}/100`,
        `Relationship psychology: ${result.layers.relationshipPsychology.score}/100`,
        `Marriage timing: ${result.layers.marriageTimingSupport.score}/100`,
        `Manglik balance: ${result.layers.manglikBalance.score}/100`,
      ],
      actionPlan: [
        "Read marriage indicators through Venus, Jupiter, 7th house and Navamsha together.",
        "Check Dasha timing for marriage activation windows.",
        "Use relationship psychology to understand communication patterns.",
        "Avoid making marriage decisions from single indicators — use combined analysis.",
      ],
      remedy: [result.safeRelationshipRemedies],
    });
  } catch (error) {
    return safeSection("relationship-intelligence", "Relationship Intelligence", error);
  }
}

export function buildReportQualityAuditSection(sections: ReportSection[]): ReportSection {
  const fallback = sections.filter((section) => section.qa?.status === "fallback");
  const review = sections.filter((section) => section.qa?.status === "needs-review");
  const verified = sections.filter((section) => section.qa?.status === "verified");
  const total = Math.max(1, sections.length);
  const score = Math.round(((verified.length * 1 + review.length * 0.55) / total) * 100);

  return makeSection({
    id: "premium-report-quality-audit",
    title: "Premium Report Quality Audit",
    subtitle: `${verified.length} verified · ${review.length} review · ${fallback.length} fallback`,
    score,
    paragraphs: [
      "This QA layer checks whether premium report sections are backed by real engine output, complete summary data and practical action guidance.",
      fallback.length
        ? `Fallback sections need engineering review before they should be treated as final premium interpretation: ${fallback.map((section) => section.title).join(", ")}.`
        : "No fallback section was detected in this report build.",
      review.length
        ? `Needs-review sections are usable but should receive golden-chart validation: ${review.map((section) => section.title).slice(0, 8).join(", ")}.`
        : "All non-fallback sections currently meet the minimum completeness guard.",
    ],
    summary: [
      `Total engine sections checked: ${sections.length}`,
      `Verified sections: ${verified.length}`,
      `Needs-review sections: ${review.length}`,
      `Fallback sections: ${fallback.length}`,
    ],
    actionPlan: [
      "Fix fallback sections first because they indicate failed engine calls or missing chart payload fields.",
      "Run golden-chart QA for needs-review sections before marketing them as final.",
      "Keep this audit visible in internal QA builds so premium report quality does not silently regress.",
    ],
    remedy: [
      "For users, show cautious wording when a section is fallback or needs-review.",
      "For launch, require zero fallback sections in the premium report path.",
    ],
    qa: {
      status: fallback.length ? "needs-review" : "verified",
      evidence: [`${sections.length} sections audited`, `${fallback.length} fallback sections`, `${review.length} needs-review sections`],
    },
  });
}

export function buildRealEngineReportSections(input: any): ReportSection[] {
  const chart = getEngineChart(input);

  const sections = [
    buildRealPanchangEngineReportSection(chart),
    ...buildAllYogasDoshasDetailedReportSections(chart),
    buildRealShadbalaEngineReportSection(chart),
    buildRealAshtakavargaEngineReportSection(chart),
    buildDashaTimelineReportSection(chart),
    buildRealTransitRadarEngineReportSection(chart),
    buildRealDestinyEngineReportSection(chart),
    buildRealDivisionalEngineReportSection(chart),
    buildRealJaiminiReportSection(chart),          // Bug Fix #1
    buildRealLalKitabReportSection(chart),
    buildRealPsychologyEngineReportSection(chart),
    buildRealVastuEngineReportSection(chart),
    buildRealSarvatobhadraEngineReportSection(chart),
    ...buildGemstoneReportSection(chart),
    buildRealRemedyEngineReportSection(chart),
    ...buildKpReportSections(chart),
    buildRealTransitRippleReportSection(chart),    // Part 1 #1
    buildRealSpecialLagnasReportSection(chart),    // Part 1 #2
    buildRealMarriageIntelligenceReportSection(chart), // Part 1 #3
    buildRealRelationshipIntelligenceReportSection(chart), // Part 1 #4
  ];

  return [
    buildReportQualityAuditSection(sections),
    ...sections,
  ];
}


function getAstroLifeReportRoot(input: any): any {
  return input?.chart?.chart ?? input?.chart ?? input?.rawChart ?? input?.kundli ?? input?.data ?? input ?? {};
}

function pickAstroLifeValue(root: any, keys: string[]): any {
  for (const key of keys) {
    const parts = key.split(".");
    let current = root;

    for (const part of parts) {
      current = current?.[part];
    }

    if (current !== undefined && current !== null && current !== "") {
      return current;
    }
  }

  return "";
}

function formatAstroLifeValue(value: any): string {
  if (value === undefined || value === null || value === "") return "Not connected";

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(formatAstroLifeValue).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    const common =
      value.name ??
      value.value ??
      value.label ??
      value.planet ??
      value.lord ??
      value.sign ??
      value.rashi ??
      value.nakshatra;

    if (common !== undefined && common !== null && common !== "") {
      return formatAstroLifeValue(common);
    }

    return Object.entries(value)
      .slice(0, 3)
      .map(([key, val]) => `${key}: ${formatAstroLifeValue(val)}`)
      .join(", ");
  }

  return String(value);
}

export function buildRealPanchangReportSections(input: any): ReportSection[] {
  const root = getAstroLifeReportRoot(input);

  const panchang =
    root?.panchang ??
    root?.panchangDetails ??
    root?.birthPanchang ??
    root?.basicPanchang ??
    root?.astroDetails ??
    root?.astrologicalDetails ??
    root?.details ??
    {};

  const basic =
    root?.basicDetails ??
    root?.birthDetails ??
    root?.nativeDetails ??
    root?.profile ??
    root?.user ??
    {};

  const astro =
    root?.astrologicalDetails ??
    root?.astroDetails ??
    root?.ghatkaChakra ??
    root?.ghatakaChakra ??
    {};

  const read = (keys: string[]) => {
    return formatAstroLifeValue(
      pickAstroLifeValue(panchang, keys) ||
        pickAstroLifeValue(astro, keys) ||
        pickAstroLifeValue(basic, keys) ||
        pickAstroLifeValue(root, keys)
    );
  };

  const tithi = read(["tithi", "Tithi", "lunarTithi", "panchang.tithi"]);
  const yoga = read(["yog", "yoga", "Yog", "Yoga", "panchang.yoga"]);
  const karana = read(["karana", "Karana", "panchang.karana"]);
  const nakshatra = read(["nakshatra", "Nakshatra", "birthNakshatra", "moonNakshatra"]);
  const nakshatraLord = read(["nakshatraLord", "nakshatra_lord", "nakLord", "Nakshatra lord"]);
  const rasi = read(["rasi", "rashi", "moonSign", "moonRashi", "Rasi"]);
  const rasiLord = read(["rasiLord", "rashiLord", "Rasi lord", "moonSignLord"]);
  const varna = read(["varna", "Varna"]);
  const yoni = read(["yoni", "Yoni"]);
  const vasya = read(["vasya", "Vasya"]);
  const nadi = read(["nadi", "Nadi"]);
  const gana = read(["gana", "Gana"]);
  const paya = read(["paya", "Paya"]);
  const tatva = read(["tatva", "tatwa", "element", "Tatva"]);
  const sunrise = read(["sunrise", "Sunrise"]);
  const sunset = read(["sunset", "Sunset"]);
  const weekday = read(["weekday", "day", "birthDay", "Month"]);
  const nameAlphabet = read(["nameAlphabet", "nameAlphabetStarting", "Name Alphabet"]);

  const summary = [
    `Tithi: ${tithi}`,
    `Yoga/Yog: ${yoga}`,
    `Karana: ${karana}`,
    `Nakshatra: ${nakshatra}`,
    `Nakshatra Lord: ${nakshatraLord}`,
    `Rasi / Moon Sign: ${rasi}`,
    `Rasi Lord: ${rasiLord}`,
    `Varna: ${varna}`,
    `Yoni: ${yoni}`,
    `Vasya: ${vasya}`,
    `Nadi: ${nadi}`,
    `Gana: ${gana}`,
    `Paya: ${paya}`,
    `Tatva: ${tatva}`,
    `Weekday: ${weekday}`,
    `Sunrise: ${sunrise}`,
    `Sunset: ${sunset}`,
    `Name Alphabet: ${nameAlphabet}`,
  ];

  const connectedCount = summary.filter((item) => !item.includes("Not connected")).length;
  const score = connectedCount >= 12 ? 82 : connectedCount >= 8 ? 74 : connectedCount >= 4 ? 66 : 58;

  return [
    makeSection({
      id: "real-panchang-details",
      title: "Panchang Details",
      subtitle: "Tithi, Nakshatra, Yoga, Karana and Birth-Time Spiritual Signature",
      score,
      paragraphs: [
        "Panchang is the subtle quality of the birth moment. It gives the lunar day, nakshatra, yoga, karana and traditional birth-time indicators that shape temperament, emotional rhythm and spiritual alignment.",
        `For this chart, the available Panchang data shows Tithi as ${tithi}, Nakshatra as ${nakshatra}, Yoga/Yog as ${yoga}, and Karana as ${karana}.`,
        `Moon/Rasi foundation is ${rasi}, with Rasi Lord ${rasiLord}. Nakshatra Lord is ${nakshatraLord}. These values should be used together with Lagna, Moon sign and dasha before making deeper predictions.`,
      ],
      summary,
      actionPlan: [
        `Use Nakshatra ${nakshatra} for emotional and psychological self-awareness.`,
        `Use Tithi ${tithi} and Karana ${karana} for spiritual rhythm and remedy timing.`,
        `Use Rasi ${rasi} and Rasi Lord ${rasiLord} while reading Moon-based results.`,
        "If any field says Not connected, connect that field from the chart API/panchang engine.",
      ],
      remedy: [
        "Respect the Moon through calm sleep, hydration and emotional balance.",
        "Use a simple daily prayer or gratitude practice.",
        "Avoid major decisions during emotional turbulence.",
        "Use Panchang values for deeper muhurta and remedy planning.",
      ],
    }),
  ];
}
