import type { DivChart } from "./divisional";
import type { EventRadarReport } from "./event-radar";
import type { KPEngineResult, SignificatorSet } from "./kp";
import { analyzeMarriageTimingKNRao, type MarriageTimingInput, type MarriageTimingResult } from "./marriage-timing-kn-rao";

type MarriageLabel = "strong_support" | "supportive" | "mixed" | "needs_patience" | "needs_careful_handling";

export interface MarriageV2Section {
  title: string;
  score: number;
  label: MarriageLabel;
  paragraph: string;
  indicators: string[];
  recommendations: string[];
}

export interface MarriageEventWindow {
  date: string;
  label: string;
  weekday: string;
  score: number;
  reason: string;
  action: string;
}

export interface MarriageEventRadarV2 {
  title: string;
  score: number;
  label: MarriageLabel;
  paragraph: string;
  windows: MarriageEventWindow[];
  cautions: string[];
}

export interface MarriageV2Result {
  title: string;
  overallScore: number;
  label: MarriageLabel;
  narrative: string;

  // === K.N. RAO TIMING ENGINE (NEW) ===
  knRaoTiming: MarriageTimingResult | null;

  divisional: {
    d9MarriageDelivery: MarriageV2Section;
    d9ContinuityCare: MarriageV2Section;
    d7ChildrenAwareness: MarriageV2Section;
  };
  shodashvargaWisdom: ShodashvargaMarriageWisdom[];
  kp: MarriageV2Section | null;
  eventRadar: MarriageEventRadarV2 | null;
  safetyBoundary: string;
}

export interface ShodashvargaMarriageWisdom {
  key: string;
  title: string;
  domain: string;
  score: number;
  label: MarriageLabel;
  paragraph: string;
  indicators: string[];
}

const BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
const PRESSURE_PLANETS = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function labelFromScore(score: number): MarriageLabel {
  if (score >= 82) return "strong_support";
  if (score >= 68) return "supportive";
  if (score >= 50) return "mixed";
  if (score >= 35) return "needs_patience";
  return "needs_careful_handling";
}

function labelText(label: MarriageLabel) {
  if (label === "strong_support") return "strong support";
  if (label === "supportive") return "supportive";
  if (label === "mixed") return "mixed";
  if (label === "needs_patience") return "needs patience";
  return "needs careful handling";
}

function chartByKey(divs: DivChart[], key: string) {
  return divs.find((chart) => chart.key === key) ?? null;
}

function planetsInHouse(chart: DivChart | null, house: number) {
  return chart?.planets.filter((planet) => planet.house === house) ?? [];
}

function planet(chart: DivChart | null, name: string) {
  return chart?.planets.find((item) => item.planet === name) ?? null;
}

function dignityBoost(dignity: string) {
  if (dignity === "Exalted") return 14;
  if (dignity === "Own") return 10;
  if (dignity === "Debilitated") return -14;
  return 0;
}

function chartQuality(chart: DivChart | null, focusHouses: number[]) {
  if (!chart) return { score: 50, indicators: ["Chart data is not available for this varga."] };

  let score = 50;
  const indicators: string[] = [`${chart.key} Lagna is ${chart.lagna}.`];
  const focusPlanets = chart.planets.filter((item) => focusHouses.includes(item.house));
  const strongPlanets = chart.planets.filter((item) => item.dignity === "Exalted" || item.dignity === "Own");
  const weakPlanets = chart.planets.filter((item) => item.dignity === "Debilitated");

  score += strongPlanets.length * 4;
  score -= weakPlanets.length * 5;

  const beneficFocus = focusPlanets.filter((item) => BENEFICS.includes(item.planet));
  const pressureFocus = focusPlanets.filter((item) => PRESSURE_PLANETS.includes(item.planet));

  if (beneficFocus.length) {
    score += 10;
    indicators.push(`${chart.key} focus houses receive benefic support through ${beneficFocus.map((item) => item.planet).join(", ")}.`);
  }

  if (pressureFocus.length) {
    score -= 8;
    indicators.push(`${chart.key} focus houses have pressure through ${pressureFocus.map((item) => item.planet).join(", ")}.`);
  }

  if (strongPlanets.length) indicators.push(`Strong planets: ${strongPlanets.map((item) => item.planet).join(", ")}.`);
  if (weakPlanets.length) indicators.push(`Debilitated planets needing care: ${weakPlanets.map((item) => item.planet).join(", ")}.`);

  return { score: clamp(score), indicators };
}

function section(title: string, score: number, paragraph: string, indicators: string[], recommendations: string[]): MarriageV2Section {
  const cleanScore = clamp(Math.round(score));
  return {
    title,
    score: cleanScore,
    label: labelFromScore(cleanScore),
    paragraph,
    indicators: [...new Set(indicators)],
    recommendations: [...new Set(recommendations)],
  };
}

const SHODASHVARGA_MARRIAGE_RULES: Array<{
  key: string;
  title: string;
  domain: string;
  focusHouses: number[];
  paragraph: string;
}> = [
  { key: "D1", title: "D1 Marriage Promise", domain: "Birth promise, 7th house, Venus/Jupiter base", focusHouses: [1, 5, 7, 9, 11], paragraph: "D1 is the promise layer. It tells whether relationship life has basic support, what kind of partner dynamics repeat, and whether marriage themes are naturally visible in the birth chart." },
  { key: "D2", title: "D2 Wealth After Marriage", domain: "Resources, savings, family value system", focusHouses: [2, 7, 11], paragraph: "D2 adds the finance layer. In marriage reading it shows whether money flow, family resources, savings habits and value systems become supportive after commitment." },
  { key: "D3", title: "D3 Effort & Communication", domain: "Courage, siblings, effort, communication style", focusHouses: [3, 6, 7, 11], paragraph: "D3 shows relationship effort, sibling or family interference, courage to communicate and the ability to repair before distance grows." },
  { key: "D4", title: "D4 Home Peace", domain: "Home, property, domestic settlement", focusHouses: [4, 7, 11], paragraph: "D4 tells whether marriage finds a stable home base. Property, mother/home blessings, living arrangement and domestic comfort are read here." },
  { key: "D5", title: "D5 Purva Punya & Romance", domain: "Past merit, love, intelligence, grace", focusHouses: [5, 7, 9], paragraph: "D5 adds the grace and romance layer. It shows love intelligence, blessings, past merit and whether affection converts into wise choices." },
  { key: "D6", title: "D6 Conflict Repair", domain: "Disputes, debt, disease, service, correction", focusHouses: [6, 7, 8, 12], paragraph: "D6 does not deny marriage; it shows quarrel patterns, service burden, health stress and the repair work needed for daily stability." },
  { key: "D7", title: "D7 Children Awareness", domain: "Children, lineage, creative legacy", focusHouses: [2, 5, 9, 11], paragraph: "D7 is children and lineage awareness. Use it gently with D1, Jupiter, dasha and KP; never as medical or fertility certainty." },
  { key: "D8", title: "D8 Sudden Change & In-law Karmas", domain: "Sudden turns, inheritance, hidden transformation", focusHouses: [7, 8, 12], paragraph: "D8 shows sudden turns, hidden fears, inheritance or in-law karmas. Sensitive signals must be explained as continuity care, not fear." },
  { key: "D9", title: "D9 Marriage Fulfilment", domain: "Spouse, dharma, fulfilment, continuity", focusHouses: [1, 2, 4, 7, 8, 9], paragraph: "D9 is the central marriage delivery chart. Lagna shows readiness, Lagnesh delivery, 7th spouse/marriage, 8th continuity care, and 10th spouse-family authority influence." },
  { key: "D10", title: "D10 Status After Marriage", domain: "Career, authority, public role", focusHouses: [7, 10, 11], paragraph: "D10 shows how marriage interacts with work, reputation and responsibility. It can show career growth after marriage or work dominating relationship time." },
  { key: "D11", title: "D11 Gains & Fulfilment", domain: "Income streams, networks, desire fulfilment", focusHouses: [2, 7, 11], paragraph: "D11 refines fulfilment: alliance, networks, family settlement, shared ambitions and gains through relationship life." },
  { key: "D12", title: "D12 Family & Ancestors", domain: "Parents, ancestors, inherited patterns", focusHouses: [2, 4, 7, 9, 12], paragraph: "D12 shows parental and ancestral patterns carried into marriage: conditioning, blessings and repeating emotional scripts." },
  { key: "D16", title: "D16 Comforts & Vehicles", domain: "Comfort, vehicles, domestic happiness", focusHouses: [4, 7, 12], paragraph: "D16 adds comfort: vehicles, bed comfort, living quality and whether material comfort supports or distracts relationship peace." },
  { key: "D20", title: "D20 Spiritual Alignment", domain: "Worship, inner values, spiritual practice", focusHouses: [5, 7, 9, 12], paragraph: "D20 shows shared faith, spiritual habits and values. Difference in belief is manageable when respect is strong." },
  { key: "D24", title: "D24 Education & Counsel", domain: "Learning, education, advice, maturity", focusHouses: [4, 5, 7, 9], paragraph: "D24 shows whether the native can learn, listen, take counsel and improve patterns instead of repeating mistakes." },
  { key: "D27", title: "D27 Inner Strengths", domain: "Soul talents, resilience, innate capacity", focusHouses: [1, 3, 7, 11], paragraph: "D27 shows the personal strengths that sustain marriage: resilience, patience, emotional stamina, courage and adaptability." },
  { key: "D30", title: "D30 Caution & Shadow Work", domain: "Obstacles, suffering, hidden weakness", focusHouses: [6, 7, 8, 12], paragraph: "D30 is a caution chart. It should never scare users; it shows shadow work, conflict triggers and where safe remedies or counselling may help." },
  { key: "D40", title: "D40 Auspicious Support", domain: "General auspicious and inauspicious karmic effects", focusHouses: [1, 7, 9, 11], paragraph: "D40 shows broad auspicious support from family, karma and overall life flow." },
  { key: "D45", title: "D45 Character & Values", domain: "Character, ethics, quality of life", focusHouses: [1, 4, 7, 9], paragraph: "D45 is character and values. Marriage survives better when values, loyalty and conduct are strong, even if compatibility is mixed." },
  { key: "D60", title: "D60 Deep Karmic Root", domain: "Past-life karma and repeating patterns", focusHouses: [1, 7, 8, 9, 12], paragraph: "D60 is the deepest karmic layer and must be used with humility. It explains old, heavy or fated patterns without fatalistic claims." },
];

export function buildShodashvargaMarriageWisdom(divs: DivChart[]): ShodashvargaMarriageWisdom[] {
  return SHODASHVARGA_MARRIAGE_RULES.map((rule) => {
    const quality = chartQuality(chartByKey(divs, rule.key), rule.focusHouses);
    return {
      key: rule.key,
      title: rule.title,
      domain: rule.domain,
      score: quality.score,
      label: labelFromScore(quality.score),
      paragraph: `${rule.paragraph} Current ${rule.key} signal is ${labelText(labelFromScore(quality.score))}.`,
      indicators: quality.indicators,
    };
  });
}

export function buildMarriageDivisionalIntelligence(divs: DivChart[]) {
  const d9 = chartByKey(divs, "D9");
  const d7 = chartByKey(divs, "D7");

  const d9Seventh = planetsInHouse(d9, 7);
  const d9Eighth = planetsInHouse(d9, 8);
  const d9Fourth = planetsInHouse(d9, 4);
  const d9Second = planetsInHouse(d9, 2);
  const venus = planet(d9, "Venus");
  const jupiter = planet(d9, "Jupiter");

  let deliveryScore = 56;
  const deliveryIndicators: string[] = [];
  if (d9) deliveryIndicators.push(`D9 Lagna is ${d9.lagna}; Navamsha is the main marriage fulfilment layer.`);
  if (d9Seventh.some((item) => BENEFICS.includes(item.planet))) {
    deliveryScore += 14;
    deliveryIndicators.push("D9 7th house receives benefic support, which helps visible marriage harmony.");
  }
  if (d9Seventh.some((item) => PRESSURE_PLANETS.includes(item.planet))) {
    deliveryScore -= 9;
    deliveryIndicators.push("D9 7th house has pressure planets; this asks for maturity and clear expectations.");
  }
  deliveryScore += dignityBoost(venus?.dignity ?? "");
  deliveryScore += dignityBoost(jupiter?.dignity ?? "");
  if (venus) deliveryIndicators.push(`Venus in D9 is in H${venus.house}${venus.dignity !== "—" ? ` (${venus.dignity})` : ""}.`);
  if (jupiter) deliveryIndicators.push(`Jupiter in D9 is in H${jupiter.house}${jupiter.dignity !== "—" ? ` (${jupiter.dignity})` : ""}.`);

  let continuityScore = 58;
  const continuityIndicators: string[] = [];
  if (d9Second.length) continuityIndicators.push(`D9 2nd house shows first post-marriage adjustment through ${d9Second.map((p) => p.planet).join(", ")}.`);
  if (d9Fourth.some((item) => BENEFICS.includes(item.planet))) {
    continuityScore += 8;
    continuityIndicators.push("D9 4th has comfort support, useful for domestic happiness.");
  }
  if (d9Eighth.length) {
    continuityScore -= d9Eighth.some((item) => PRESSURE_PLANETS.includes(item.planet)) ? 12 : 5;
    continuityIndicators.push(`D9 8th continuity layer is active through ${d9Eighth.map((p) => p.planet).join(", ")}; read this as relationship repair and emotional security, not fear.`);
  }
  if (d9Fourth.some((item) => PRESSURE_PLANETS.includes(item.planet))) {
    continuityScore -= 6;
    continuityIndicators.push("D9 4th has adjustment pressure, so home peace needs conscious care.");
  }

  const d7Fifth = planetsInHouse(d7, 5);
  const d7Jupiter = planet(d7, "Jupiter");
  let childrenScore = 52;
  const childrenIndicators: string[] = [];
  if (d7) childrenIndicators.push(`D7 Lagna is ${d7.lagna}; Saptamsha is used only as awareness, not medical prediction.`);
  if (d7Fifth.some((item) => BENEFICS.includes(item.planet))) {
    childrenScore += 12;
    childrenIndicators.push("D7 5th house has supportive child/lineage indicators.");
  }
  if (d7Fifth.some((item) => PRESSURE_PLANETS.includes(item.planet))) {
    childrenScore -= 9;
    childrenIndicators.push("D7 5th house asks for patience and practical care around children-related matters.");
  }
  childrenScore += dignityBoost(d7Jupiter?.dignity ?? "");
  if (d7Jupiter) childrenIndicators.push(`Jupiter in D7 is in H${d7Jupiter.house}${d7Jupiter.dignity !== "—" ? ` (${d7Jupiter.dignity})` : ""}.`);

  return {
    d9MarriageDelivery: section(
      "D9 Marriage Delivery",
      deliveryScore,
      `Navamsha shows how the marriage promise matures after commitment. This layer is ${labelText(labelFromScore(deliveryScore))}: the 7th house, Venus and Jupiter decide whether relationship support becomes lived harmony or needs conscious work.`,
      deliveryIndicators,
      ["Judge D9 after D1 promise; do not use one placement for final verdict.", "Use D9 7th, Venus and Jupiter for fulfilment quality."],
    ),
    d9ContinuityCare: section(
      "D9 Continuity & Adjustment",
      continuityScore,
      `This layer reads the sensitive D9 2nd, 4th and 8th houses as adjustment, home peace and continuity care. A difficult score does not mean separation certainty; it means repair habits, boundaries and emotional safety must be taken seriously.`,
      continuityIndicators,
      ["Explain 8th-house themes softly as restructuring and continuity care.", "Recommend communication, family boundaries and a peaceful bedroom/home zone."],
    ),
    d7ChildrenAwareness: section(
      "D7 Children Awareness",
      childrenScore,
      `D7 is a children and lineage awareness layer. It must never be used as a medical or fertility verdict. The goal is to show timing sensitivity, patience and practical support where needed.`,
      childrenIndicators,
      ["Use D7 with D1 5th, Jupiter, dasha and KP 2-5-11.", "Avoid infertility certainty or fear-based language."],
    ),
  };
}

function topic(result: KPEngineResult, id: string): SignificatorSet | null {
  return result.significators.find((item) => item.topic === id) ?? null;
}

export function buildMarriageKPIntelligence(result: KPEngineResult): MarriageV2Section {
  const marriage = topic(result, "marriage");
  const child = topic(result, "child");
  const foreign = topic(result, "travel") ?? topic(result, "foreign");
  const score = marriage?.score ?? 50;
  const indicators = [
    marriage ? `Marriage KP score ${marriage.score}/100; cusp sub lord ${marriage.cuspSubLord}.` : "Marriage KP significator is not available.",
    marriage ? `Positive houses: ${marriage.positiveHouses.join("-")}; caution houses: ${marriage.negativeHouses.join("-")}.` : "",
    child ? `Children KP score ${child.score}/100 using 2-5-11 validation.` : "",
    foreign ? `Foreign/distance link score ${foreign.score}/100 can modify marriage background or relocation themes.` : "",
  ].filter(Boolean);

  return section(
    "KP Marriage Validation",
    score,
    `KP is the event-validation layer. For marriage, 2-7-11 shows family formation, partnership and fulfilment; 6-8-12 asks for patience, repair, distance handling or better timing. This layer is ${labelText(labelFromScore(score))}.`,
    indicators,
    ["Use KP after D1/D9 promise, not as a standalone verdict.", "For timing, check active dasha planets and 7th cusp sub lord before final claim."],
  );
}

function loveScore(day: EventRadarReport["days"][number]) {
  return day.areaScores.find((area) => area.area === "love")?.score ?? (day.bestArea === "love" ? day.overallScore : 50);
}

export function buildMarriageEventRadar(report: EventRadarReport, kp?: MarriageV2Section | null): MarriageEventRadarV2 {
  const kpBoost = kp ? Math.round((kp.score - 50) * 0.18) : 0;
  const windows = report.days
    .map((day) => {
      const score = clamp(loveScore(day) + kpBoost - (day.cautionArea === "love" ? 8 : 0));
      return {
        date: day.date,
        label: day.label,
        weekday: day.weekday,
        score,
        reason: `Love/relationship radar ${loveScore(day)}/100${kp ? ` with KP adjustment from ${kp.score}/100` : ""}.`,
        action: score >= 68
          ? "Good for proposal discussion, matchmaking, relationship repair or commitment clarity."
          : score >= 50
            ? "Good for gentle conversation, not pressure."
            : "Avoid forcing relationship decisions; keep communication calm.",
      };
    })
    .filter((day) => day.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const average = windows.length
    ? Math.round(windows.reduce((sum, day) => sum + day.score, 0) / windows.length)
    : 45;

  return {
    title: "Marriage Trigger Windows",
    score: average,
    label: labelFromScore(average),
    paragraph:
      `Event Radar should be used as the final trigger layer only. Promise comes from D1/D9, event validation from KP, and these daily windows show when conversation, proposal, repair or family discussion can move with less friction.`,
    windows,
    cautions: [
      "Do not finalize marriage timing from transit alone.",
      "If love area is weak or caution area is love, avoid ultimatums and harsh speech.",
      "Use supportive days for clarity, not emotional pressure.",
    ],
  };
}

export function buildMarriageIntelligenceV2(params: {
  divs?: DivChart[];
  kp?: KPEngineResult;
  radar?: EventRadarReport;
  knRaoTiming?: MarriageTimingInput;
}): MarriageV2Result {
  const divisional = buildMarriageDivisionalIntelligence(params.divs ?? []);
  const shodashvargaWisdom = buildShodashvargaMarriageWisdom(params.divs ?? []);
  const kp = params.kp ? buildMarriageKPIntelligence(params.kp) : null;
  const eventRadar = params.radar ? buildMarriageEventRadar(params.radar, kp) : null;

  // === K.N. RAO TIMING ENGINE ===
  const knRaoTiming = params.knRaoTiming ? analyzeMarriageTimingKNRao(params.knRaoTiming) : null;

  const scores = [
    divisional.d9MarriageDelivery.score,
    divisional.d9ContinuityCare.score,
    divisional.d7ChildrenAwareness.score,
    kp?.score,
    eventRadar?.score,
    knRaoTiming?.timingScore,
  ].filter((score): score is number => typeof score === "number");

  const overallScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 50;

  return {
    title: "Marriage Trigger Engine – K.N. Rao Timing + Divisional + KP",
    overallScore,
    label: labelFromScore(overallScore),
    narrative: `Marriage Trigger Engine separates judgement into K.N. Rao timing parameters, divisional delivery, KP validation and event windows. This prevents one method from becoming confusing final verdict. ${knRaoTiming ? `K.N. Rao timing shows ${knRaoTiming.strengthLabel} with ${knRaoTiming.activeParameterCount}/8 parameters active. ` : ""}The current combined signal is ${labelText(labelFromScore(overallScore))}.`,

    // === K.N. RAO TIMING (NEW SECTION) ===
    knRaoTiming,

    divisional,
    shodashvargaWisdom,
    kp,
    eventRadar,
    safetyBoundary:
      "No death, widowhood, infertility, divorce certainty or guaranteed negative event prediction. Sensitive rules must be explained as relationship care, continuity planning, emotional maturity and practical support.",
  };
}
