import type { ChartData } from "../astro-engine/calculations";
import {
  averageReportScore,
  clampReportScore,
  confidenceFromEvidence,
  toneFromScore,
  type InsightEvidence,
  type ReportLifeArea,
  type UniversalInsight,
} from "./insight-schema";

export interface SignalMapperContext {
  activeMahadasha?: string;
  activeAntardasha?: string;
  presentYogaCount?: number;
  shadbalaScore?: number;
  ashtakavargaScore?: number;
  destinyAreas?: Array<{ name?: string; score?: number }>;
  psychologyScore?: number;
  transitTopArea?: { label: string; score: number };
}

const CAREER_HOUSES = [1, 6, 10, 11];
const WEALTH_HOUSES = [2, 5, 9, 11];
const FOREIGN_HOUSES = [9, 12];
const RELATIONSHIP_HOUSES = [5, 7];
const SPIRITUAL_HOUSES = [8, 9, 12];

function planetHouse(chart: ChartData, planet: string) {
  return Number(chart.planets[planet]?.house ?? 0);
}

function planetSign(chart: ChartData, planet: string) {
  return chart.planets[planet]?.sign ?? "unknown";
}

function hasPlanetInHouse(chart: ChartData, planets: string[], houses: number[]) {
  return planets.some((planet) => houses.includes(planetHouse(chart, planet)));
}

function hasAnyHouse(chart: ChartData, houses: number[]) {
  return Object.values(chart.planets).some((planet) => houses.includes(Number(planet.house)));
}

function destinyAreaScore(context: SignalMapperContext, needle: string, fallback: number) {
  const found = (context.destinyAreas ?? []).find((area) =>
    String(area.name ?? "").toLowerCase().includes(needle.toLowerCase())
  );
  return clampReportScore(Number(found?.score ?? fallback));
}

function periodMentions(context: SignalMapperContext, planets: string[]) {
  const active = [context.activeMahadasha, context.activeAntardasha].filter(Boolean);
  return planets.some((planet) => active.includes(planet));
}

function buildInsight(params: {
  id: string;
  category: ReportLifeArea;
  score: number;
  observation: string;
  themes: string[];
  opportunities: string[];
  risks: string[];
  actions: string[];
  evidence: InsightEvidence[];
}): UniversalInsight {
  const score = clampReportScore(params.score);
  return {
    ...params,
    score,
    confidence: confidenceFromEvidence(params.evidence),
    tone: toneFromScore(score),
  };
}

export function mapChartToInsights(chart: ChartData, context: SignalMapperContext = {}): UniversalInsight[] {
  const careerScore = averageReportScore([
    destinyAreaScore(context, "career", 62),
    Number(context.shadbalaScore ?? 60),
    Number(context.ashtakavargaScore ?? 60),
    hasPlanetInHouse(chart, ["Sun", "Mercury", "Mars", "Saturn"], CAREER_HOUSES) ? 84 : 58,
    periodMentions(context, ["Sun", "Mercury", "Saturn", "Mars"]) ? 78 : 60,
  ]);

  const wealthScore = averageReportScore([
    destinyAreaScore(context, "wealth", 60),
    Number(context.ashtakavargaScore ?? 58),
    hasPlanetInHouse(chart, ["Jupiter", "Venus", "Mercury"], WEALTH_HOUSES) ? 84 : 58,
    hasAnyHouse(chart, [2, 11]) ? 78 : 56,
  ]);

  const foreignScore = averageReportScore([
    hasPlanetInHouse(chart, ["Rahu", "Moon", "Saturn", "Mercury"], FOREIGN_HOUSES) ? 86 : 55,
    hasAnyHouse(chart, FOREIGN_HOUSES) ? 76 : 55,
    String(context.transitTopArea?.label ?? "").toLowerCase().includes("travel") ? Number(context.transitTopArea?.score ?? 70) : 58,
  ]);

  const relationshipScore = averageReportScore([
    destinyAreaScore(context, "relationship", 58),
    hasPlanetInHouse(chart, ["Venus", "Moon", "Jupiter"], RELATIONSHIP_HOUSES) ? 80 : 60,
    planetHouse(chart, "Saturn") === 7 ? 55 : 68,
  ]);

  const spiritualityScore = averageReportScore([
    destinyAreaScore(context, "spiritual", 62),
    hasPlanetInHouse(chart, ["Ketu", "Jupiter", "Moon"], SPIRITUAL_HOUSES) ? 84 : 58,
    periodMentions(context, ["Ketu", "Jupiter"]) ? 76 : 60,
  ]);

  const emotionalScore = averageReportScore([
    Number(context.psychologyScore ?? 65),
    planetHouse(chart, "Moon") === 8 || planetHouse(chart, "Moon") === 12 ? 58 : 72,
    relationshipScore,
  ]);

  const leadershipScore = averageReportScore([
    hasPlanetInHouse(chart, ["Sun", "Mars", "Saturn"], [1, 10, 11]) ? 84 : 62,
    careerScore,
    Number(context.presentYogaCount ?? 0) >= 3 ? 78 : 62,
  ]);

  const vitalityScore = averageReportScore([
    destinyAreaScore(context, "health", 62),
    Number(context.shadbalaScore ?? 60),
    planetHouse(chart, "Mars") === 6 || planetHouse(chart, "Moon") === 12 ? 58 : 68,
  ]);

  return [
    buildInsight({
      id: "career_visibility_signal",
      category: "career",
      score: careerScore,
      observation: "Career strength improves when skill becomes visible, structured and trusted by others.",
      themes: ["career", "visibility", "authority", "execution"],
      opportunities: ["Build a public proof-of-work trail.", "Turn one skill into a recognized professional identity."],
      risks: ["Scattered effort can weaken the career signal.", "Authority may be delayed if visibility is avoided."],
      actions: ["Pick one professional direction for the next quarter.", "Publish or document measurable work every week."],
      evidence: [
        { source: "kundli", label: "Career houses", detail: `Sun H${planetHouse(chart, "Sun")}, Mercury H${planetHouse(chart, "Mercury")}, Saturn H${planetHouse(chart, "Saturn")}`, weight: 9 },
        { source: "dasha", label: "Current timing", detail: `${context.activeMahadasha ?? "Current"} MD / ${context.activeAntardasha ?? "active"} AD`, weight: periodMentions(context, ["Sun", "Mercury", "Saturn", "Mars"]) ? 8 : 4 },
        { source: "shadbala", label: "Planet strength", detail: `Average support ${clampReportScore(Number(context.shadbalaScore ?? 60))}/100`, weight: 6 },
      ],
    }),
    buildInsight({
      id: "wealth_support_signal",
      category: "wealth",
      score: wealthScore,
      observation: "Money potential is strongest through knowledge, trust, repeatable value and long-range asset building.",
      themes: ["wealth", "assets", "trust", "compounding"],
      opportunities: ["Package expertise into repeatable income.", "Use networks and credibility before risky expansion."],
      risks: ["Speculation without structure may dilute wealth.", "Too many income experiments can reduce compounding."],
      actions: ["Build one primary income engine first.", "Track savings, risk and recurring revenue monthly."],
      evidence: [
        { source: "kundli", label: "Wealth houses", detail: `Jupiter H${planetHouse(chart, "Jupiter")}, Venus H${planetHouse(chart, "Venus")}`, weight: 8 },
        { source: "ashtakavarga", label: "House support", detail: `Ashtakavarga ${clampReportScore(Number(context.ashtakavargaScore ?? 58))}/100`, weight: 6 },
        { source: "destiny", label: "Destiny wealth area", detail: `${destinyAreaScore(context, "wealth", 60)}/100`, weight: 5 },
      ],
    }),
    buildInsight({
      id: "foreign_digital_signal",
      category: "foreign",
      score: foreignScore,
      observation: "Foreign influence can appear through travel, settlement, remote work, digital reach or global clients.",
      themes: ["foreign", "remote work", "travel", "global reach"],
      opportunities: ["Make local expertise globally understandable.", "Use digital distribution before relocation decisions."],
      risks: ["Relocation as escape may not solve the core pattern.", "Foreign opportunities need timing and practical readiness."],
      actions: ["Create globally readable offers and profiles.", "Review foreign moves through dasha and transit together."],
      evidence: [
        { source: "kundli", label: "Foreign houses", detail: `Rahu H${planetHouse(chart, "Rahu")}, Moon H${planetHouse(chart, "Moon")}`, weight: 8 },
        { source: "transit", label: "Live timing", detail: `${context.transitTopArea?.label ?? "Moon-first timing"} ${clampReportScore(Number(context.transitTopArea?.score ?? 58))}/100`, weight: 5 },
      ],
    }),
    buildInsight({
      id: "relationship_responsibility_signal",
      category: "relationship",
      score: relationshipScore,
      observation: "Relationship quality grows through emotional maturity, shared responsibility and calm boundaries.",
      themes: ["relationship", "commitment", "responsibility", "boundaries"],
      opportunities: ["Choose steady partnership patterns over intensity alone.", "Discuss family, money and responsibility early."],
      risks: ["Over-giving can become an invisible contract.", "Delayed commitment clarity can create avoidable stress."],
      actions: ["Make expectations explicit.", "Watch reciprocity, not only attraction."],
      evidence: [
        { source: "kundli", label: "Relationship houses", detail: `Venus in ${planetSign(chart, "Venus")} H${planetHouse(chart, "Venus")}`, weight: 8 },
        { source: "psychology", label: "Emotional pattern", detail: `Psychology ${clampReportScore(Number(context.psychologyScore ?? 65))}/100`, weight: 5 },
      ],
    }),
    buildInsight({
      id: "karmic_axis_signal",
      category: "karma",
      score: averageReportScore([spiritualityScore, emotionalScore, relationshipScore]),
      observation: "Rahu-Ketu shows the repeating growth pattern: unfamiliar hunger on one side and old instinct on the other.",
      themes: ["karma", "growth", "Rahu", "Ketu"],
      opportunities: ["Turn repeating life patterns into conscious choices.", "Use remedies as behavioral correction, not fear."],
      risks: ["Old reactions may be mistaken for destiny.", "Fear-based remedies can distract from practical change."],
      actions: ["Name the repeating pattern before reacting.", "Keep one simple correction discipline for 40 days."],
      evidence: [
        { source: "kundli", label: "Rahu-Ketu axis", detail: `Rahu H${planetHouse(chart, "Rahu")} / Ketu H${planetHouse(chart, "Ketu")}`, weight: 10 },
        { source: "lal_kitab", label: "Karmic correction", detail: "Behavior-first remedy layer available", weight: 5 },
      ],
    }),
    buildInsight({
      id: "emotional_depth_signal",
      category: "emotional",
      score: emotionalScore,
      observation: "Emotional intelligence becomes a strength when sensitivity is filtered through timing, language and boundaries.",
      themes: ["emotion", "mind", "intuition", "boundaries"],
      opportunities: ["Use observation skill for guidance and strategy.", "Create calmer decision rules."],
      risks: ["Over-analysis can delay action.", "Absorbing others' stress can blur judgment."],
      actions: ["Write decisions before acting on emotional spikes.", "Separate intuition from anxiety with a cooling period."],
      evidence: [
        { source: "psychology", label: "Psychology engine", detail: `${clampReportScore(Number(context.psychologyScore ?? 65))}/100`, weight: 8 },
        { source: "kundli", label: "Moon placement", detail: `Moon in ${planetSign(chart, "Moon")} H${planetHouse(chart, "Moon")}`, weight: 7 },
      ],
    }),
    buildInsight({
      id: "leadership_authority_signal",
      category: "leadership",
      score: leadershipScore,
      observation: "Leadership develops through earned authority, consistency and the courage to be visible.",
      themes: ["leadership", "authority", "systems", "standards"],
      opportunities: ["Lead through systems and standards.", "Build authority by teaching or guiding others."],
      risks: ["Forceful control can replace real leadership.", "Avoiding visibility can delay recognition."],
      actions: ["Own one clear domain.", "Create standards other people can follow."],
      evidence: [
        { source: "kundli", label: "Authority planets", detail: `Sun H${planetHouse(chart, "Sun")}, Mars H${planetHouse(chart, "Mars")}`, weight: 8 },
        { source: "yoga", label: "Yoga support", detail: `${context.presentYogaCount ?? 0} active yogas`, weight: Number(context.presentYogaCount ?? 0) >= 3 ? 8 : 4 },
      ],
    }),
    buildInsight({
      id: "vitality_rhythm_signal",
      category: "vitality",
      score: vitalityScore,
      observation: "Vitality should be read as rhythm management: sleep, recovery, pace and stress hygiene.",
      themes: ["vitality", "recovery", "stress", "rhythm"],
      opportunities: ["Better routine improves every other life area.", "Recovery discipline can unlock performance."],
      risks: ["Ignoring rest can make strong periods feel weak.", "Stress may distort relationship and career decisions."],
      actions: ["Keep a simple sleep and movement baseline.", "Use professional healthcare for medical concerns."],
      evidence: [
        { source: "destiny", label: "Health area", detail: `${destinyAreaScore(context, "health", 62)}/100`, weight: 5 },
        { source: "shadbala", label: "Energy support", detail: `${clampReportScore(Number(context.shadbalaScore ?? 60))}/100`, weight: 6 },
      ],
    }),
    buildInsight({
      id: "dasha_activation_signal",
      category: "decision",
      score: averageReportScore([careerScore, wealthScore, Number(context.transitTopArea?.score ?? 58)]),
      observation: "Dasha and transit should be used as timing filters: act when readiness and period support agree.",
      themes: ["timing", "decision", "dasha", "transit"],
      opportunities: ["Use active periods for launches, negotiation and skill compounding.", "Turn timing into planning, not passive waiting."],
      risks: ["Acting only by date without readiness can weaken results.", "Daily prediction noise can reduce trust."],
      actions: ["Check dasha, Moon-first transit and practical readiness before major decisions.", "Use caution periods for repair and preparation."],
      evidence: [
        { source: "dasha", label: "Active period", detail: `${context.activeMahadasha ?? "Current"} MD / ${context.activeAntardasha ?? "active"} AD`, weight: 8 },
        { source: "transit", label: "Moon-first transit", detail: `${context.transitTopArea?.label ?? "active timing"} ${clampReportScore(Number(context.transitTopArea?.score ?? 58))}/100`, weight: 6 },
      ],
    }),
  ];
}
