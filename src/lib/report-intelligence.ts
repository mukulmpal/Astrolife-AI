import type { ChartData } from "./astro-engine/calculations";
import { calculateAshtakavarga } from "./astro-engine/ashtakavarga";
import { calculateDestiny } from "./astro-engine/destiny";
import { detectYogas } from "./astro-engine/yogas";
import { calculateLalKitab } from "./astro-engine/lalkitab";
import { calculatePsychology } from "./astro-engine/psychology";
import { calculateRemedies } from "./astro-engine/remedy";
import { calculateShadbala } from "./astro-engine/shadbala";
import { normalizeChartForTransit } from "./astro-engine/chart-normalize";
import { calculateEventRadarReport } from "./astro-engine/event-radar";
import { calculateTransitReport } from "./astro-engine/transits";
import { buildAISynthesis } from "./report/ai-synthesis-engine";
import { buildLifeChapters } from "./report/life-chapters-engine";
import { buildLifePatternDecoder } from "./report/life-pattern-decoder";
import { fuseInsightPatterns } from "./report/pattern-fusion-engine";
import { buildReportNarrativeSections } from "./report/report-narrative-engine";
import { calculateReportScores } from "./report/report-score-engine";
import { mapChartToInsights } from "./report/signal-mapper";
import type { AISynthesis, FusedPattern, LifeChapter, ReportNarrativeSection, ReportScoreBlock, UniversalInsight } from "./report/insight-schema";

type Tone = "excellent" | "strong" | "balanced" | "caution";

export interface IntelligenceScore {
  key: string;
  label: string;
  score: number;
  tone: Tone;
  evidence: string[];
  interpretation: string;
  action: string;
}

export interface NarrativeBlock {
  id: string;
  title: string;
  score?: number;
  paragraphs: string[];
  evidence: string[];
  action: string[];
}

export interface ReportIntelligence {
  scores: IntelligenceScore[];
  insights: UniversalInsight[];
  patterns: FusedPattern[];
  scoreBlock: ReportScoreBlock;
  narrativeSections: ReportNarrativeSection[];
  lifePatternDecoder: ReportNarrativeSection;
  lifeChapters: LifeChapter[];
  synthesis: AISynthesis;
  executiveSummary: string;
  lifeMission: NarrativeBlock;
  personality: NarrativeBlock;
  karmicBlueprint: NarrativeBlock;
  wealth: NarrativeBlock;
  career: NarrativeBlock;
  relationship: NarrativeBlock;
  foreign: NarrativeBlock;
  eventRadar: NarrativeBlock;
  remedyRanking: Array<{ label: string; score: number; reason: string }>;
  threeThings: string[];
  biggestOpportunity: string;
  biggestRisk: string;
  next12Months: string;
}

type ScoreArea = { name?: string; score?: number };
type TransitAreaScore = { area?: string; score?: number };
type EventRadarDay = { label?: string; overallScore?: number };
type ShadbalaScore = { score?: number; total?: number };
type PsychologySummary = { overallScore?: number };
type LalKitabSummary = { remedies?: unknown[] };

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function avg(values: number[]) {
  const clean = values.filter(Number.isFinite);
  if (!clean.length) return 50;
  return clampScore(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function tone(score: number): Tone {
  if (score >= 85) return "excellent";
  if (score >= 72) return "strong";
  if (score >= 55) return "balanced";
  return "caution";
}

function scoreToneText(score: number) {
  if (score >= 85) return "excellent";
  if (score >= 72) return "strong";
  if (score >= 55) return "developing";
  return "sensitive";
}

function planetHouse(chart: ChartData, planet: string) {
  return chart.planets[planet]?.house ?? 0;
}

function planetSign(chart: ChartData, planet: string) {
  return chart.planets[planet]?.sign ?? "unknown";
}

function hasHouse(chart: ChartData, houses: number[]) {
  return Object.values(chart.planets).some((planet) => houses.includes(Number(planet.house)));
}

function activePeriod(chart: ChartData) {
  const md = chart.dashas.find((d) => d.active) ?? chart.dashas[0];
  const ad = chart.antardasha.find((d) => d.active) ?? chart.antardasha[0];
  return { md, ad };
}

function areaScore(destiny: { areas?: ScoreArea[] }, name: string, fallback: number) {
  const found = (destiny.areas ?? []).find((area) => String(area.name ?? "").toLowerCase().includes(name));
  return clampScore(Number(found?.score ?? fallback));
}

function topTransitArea(chart: ChartData) {
  const norm = normalizeChartForTransit(chart);
  const transit = calculateTransitReport({ chart: norm, base: "moon", date: new Date() });
  const areaScores = (transit.areaScores ?? []) as TransitAreaScore[];
  const top = [...areaScores].sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0))[0];
  return {
    label: String(top?.area ?? "stability"),
    score: clampScore(Number(top?.score ?? 55)),
    summary: String(transit.summary ?? "Moon-first transit is used as the primary lived-timing lens."),
  };
}

function buildScore(key: string, label: string, score: number, evidence: string[], interpretation: string, action: string): IntelligenceScore {
  const finalScore = clampScore(score);
  return { key, label, score: finalScore, tone: tone(finalScore), evidence, interpretation, action };
}

function patternEvidence(patterns: FusedPattern[], category: string) {
  return patterns
    .filter((pattern) => pattern.category === category || pattern.lifeAreas.includes(category as FusedPattern["category"]))
    .slice(0, 2)
    .map((pattern) => `Fused pattern: ${pattern.title} ${pattern.strength}/100 confidence ${pattern.confidence}/100`);
}

export function buildReportIntelligence(chart: ChartData): ReportIntelligence {
  const { md, ad } = activePeriod(chart);
  const yogas = detectYogas(chart.planets as Parameters<typeof detectYogas>[0], chart.lagnaNum, "premium");
  const presentYogas = yogas.filter((item) => item.present);
  const shadbala = calculateShadbala(chart.planets as Parameters<typeof calculateShadbala>[0]);
  const shadbalaPlanets = (shadbala.planets ?? []) as ShadbalaScore[];
  const shadbalaAvg = avg(shadbalaPlanets.map((p) => Number(p.score ?? p.total ?? 50)));
  const destiny = calculateDestiny(chart.planets as Parameters<typeof calculateDestiny>[0], chart.dashas, chart.dob, chart.lagnaNum ?? 0);
  const ashtaka = calculateAshtakavarga(chart.planets as Parameters<typeof calculateAshtakavarga>[0], chart.lagnaNum);
  const ashtakaBinduAverage = avg((ashtaka.houses ?? []).map((house) => Number(house.score ?? 24)));
  const ashtakaScore = clampScore((ashtakaBinduAverage / 32) * 100);
  const psychology = calculatePsychology(chart.planets as Parameters<typeof calculatePsychology>[0]) as PsychologySummary;
  const lalKitab = calculateLalKitab(chart.planets, chart.dob, chart.lagnaNum ?? 0) as LalKitabSummary;
  const remedies = calculateRemedies(chart);
  const transitTop = topTransitArea(chart);
  const norm = normalizeChartForTransit(chart);
  const radar = calculateEventRadarReport({ chart: norm, startDate: new Date(), days: 30, base: "moon" });
  const radarDays = (radar.days ?? []) as EventRadarDay[];
  const bestRadarDay = [...radarDays].sort((a, b) => Number(b.overallScore ?? 0) - Number(a.overallScore ?? 0))[0];
  const insights = mapChartToInsights(chart, {
    activeMahadasha: md?.planet,
    activeAntardasha: ad?.planet,
    presentYogaCount: presentYogas.length,
    shadbalaScore: shadbalaAvg,
    ashtakavargaScore: ashtakaScore,
    destinyAreas: destiny.areas,
    psychologyScore: Number(psychology.overallScore ?? 65),
    transitTopArea: transitTop,
  });
  const patterns = fuseInsightPatterns(insights);
  const scoreBlock = calculateReportScores(insights, patterns);
  const narrativeSections = buildReportNarrativeSections(insights, patterns, scoreBlock);
  const lifePatternDecoder = buildLifePatternDecoder(insights, patterns);
  const lifeChapters = buildLifeChapters(chart, insights, patterns);
  const synthesis = buildAISynthesis(insights, patterns, [lifePatternDecoder, ...narrativeSections], scoreBlock);

  const careerBase = avg([
    areaScore(destiny, "career", 62),
    shadbalaAvg,
    ashtakaScore,
    planetHouse(chart, "Sun") === 10 ? 88 : 60,
    planetHouse(chart, "Mercury") === 10 || planetHouse(chart, "Mercury") === 11 ? 82 : 60,
  ]);
  const wealthBase = avg([
    areaScore(destiny, "wealth", 60),
    ashtakaScore,
    hasHouse(chart, [2, 11]) ? 82 : 58,
    planetHouse(chart, "Jupiter") === 2 || planetHouse(chart, "Venus") === 11 ? 84 : 60,
  ]);
  const relationshipBase = avg([
    areaScore(destiny, "relationship", 58),
    planetHouse(chart, "Venus") === 7 ? 82 : 60,
    planetHouse(chart, "Saturn") === 7 ? 54 : 66,
    hasHouse(chart, [7]) ? 68 : 58,
  ]);
  const foreignBase = avg([
    hasHouse(chart, [9, 12]) ? 82 : 55,
    planetHouse(chart, "Rahu") === 9 || planetHouse(chart, "Rahu") === 12 ? 88 : 60,
    planetHouse(chart, "Moon") === 12 ? 84 : 58,
    transitTop.label.toLowerCase().includes("travel") ? transitTop.score : 60,
  ]);
  const spiritualityBase = avg([
    hasHouse(chart, [9, 12]) ? 78 : 58,
    planetHouse(chart, "Ketu") === 9 || planetHouse(chart, "Ketu") === 12 ? 86 : 60,
    areaScore(destiny, "spiritual", 62),
  ]);
  const leadershipBase = avg([
    planetHouse(chart, "Sun") === 1 || planetHouse(chart, "Sun") === 10 ? 86 : 62,
    planetHouse(chart, "Mars") === 1 || planetHouse(chart, "Mars") === 10 ? 82 : 60,
    careerBase,
  ]);
  const vitalityBase = avg([
    areaScore(destiny, "health", 62),
    planetHouse(chart, "Mars") === 6 ? 58 : 68,
    shadbalaAvg,
  ]);
  const emotionalBase = avg([
    Number(psychology.overallScore ?? 65),
    planetHouse(chart, "Moon") === 8 || planetHouse(chart, "Moon") === 12 ? 58 : 72,
    relationshipBase,
  ]);

  const scores = [
    buildScore(
      "career",
      "Career",
      careerBase,
      [`${md?.planet ?? "Current"} Mahadasha`, `${presentYogas.length} active yogas`, `Shadbala ${shadbalaAvg}/100`],
      `Career is a ${scoreToneText(careerBase)} pillar of this chart. The strongest growth comes when knowledge, responsibility and visibility are converted into a clear professional identity.`,
      "Build authority through one focused skill, one clear offer and visible proof of work."
    ),
    buildScore(
      "wealth",
      "Wealth",
      wealthBase,
      [`House 2/11 emphasis: ${hasHouse(chart, [2, 11]) ? "active" : "moderate"}`, `Ashtakavarga support ${ashtakaScore}/100`],
      `Wealth appears more connected to accumulated skill, advisory value and long-term assets than random luck.`,
      "Avoid scattered income experiments. Package expertise into repeatable systems."
    ),
    buildScore(
      "relationship",
      "Relationship",
      relationshipBase,
      [`Venus in ${planetSign(chart, "Venus")}`, `Saturn relationship pressure: ${planetHouse(chart, "Saturn") === 7 ? "high" : "normal"}`],
      `Relationship growth is tied to emotional maturity, boundaries and choosing partnership over rescue patterns.`,
      "Do not over-give to prove loyalty. Choose consistency, reciprocity and calm communication."
    ),
    buildScore(
      "foreign",
      "Foreign",
      foreignBase,
      [`9th/12th house activation: ${hasHouse(chart, [9, 12]) ? "yes" : "limited"}`, `Rahu foreign axis: ${planetHouse(chart, "Rahu")}`],
      `Foreign influence may manifest through travel, remote work, international clients, global audience or settlement depending on dasha support.`,
      "Think globally before thinking relocation. Build reach beyond local circles."
    ),
    buildScore(
      "spirituality",
      "Spirituality",
      spiritualityBase,
      [`Ketu in H${planetHouse(chart, "Ketu")}`, `9th/12th house support`],
      `Spirituality here is practical: reflection, detachment, service and learning from repeating patterns.`,
      "Use daily grounding, mantra or contemplative practice as a discipline, not an escape."
    ),
    buildScore(
      "leadership",
      "Leadership",
      leadershipBase,
      [`Sun H${planetHouse(chart, "Sun")}`, `Mars H${planetHouse(chart, "Mars")}`],
      `Leadership grows through competence and credibility more than force. The chart favors authority earned over time.`,
      "Lead by building systems, standards and repeatable excellence."
    ),
    buildScore(
      "vitality",
      "Health & Vitality",
      vitalityBase,
      [`Vitality score ${vitalityBase}/100`, "Lifestyle reflection only"],
      `Vitality is best read as rhythm management. Stress, sleep and recovery habits decide how well the chart performs.`,
      "Keep regular sleep, simple food, hydration, movement and professional medical care when needed."
    ),
    buildScore(
      "emotional",
      "Emotional Resilience",
      emotionalBase,
      [`Moon H${planetHouse(chart, "Moon")}`, `Psychology score ${Number(psychology.overallScore ?? 65)}/100`],
      `The emotional pattern becomes stronger when sensitivity is turned into discernment instead of over-processing.`,
      "Name emotions early, decide slower, and avoid carrying other people's unfinished work."
    ),
  ];

  const topScores = [...scores].sort((a, b) => b.score - a.score);
  const weakestScore = [...scores].sort((a, b) => a.score - b.score)[0];
  const topOne = topScores[0];
  const topTwo = topScores[1];
  const leadPattern = patterns[0];
  const leadPatternText = leadPattern
    ? ` The strongest fused pattern is ${leadPattern.title}, where ${leadPattern.lifeAreas.join(", ")} signals converge at ${leadPattern.strength}/100.`
    : "";

  const executiveSummary =
    `This chart is strongest around ${topOne.label.toLowerCase()} and ${topTwo.label.toLowerCase()}.${leadPatternText} The current timing is shaped by ${md?.planet ?? "the active"} Mahadasha and ${ad?.planet ?? "the active"} Antardasha, so the practical strategy is to convert natural strengths into focused action rather than scattering energy. The main caution is ${weakestScore.label.toLowerCase()}, where maturity, pacing and better boundaries create the biggest improvement.`;

  const lifeMission: NarrativeBlock = {
    id: "life-mission",
    title: "Life Mission Engine",
    score: avg([careerBase, leadershipBase, spiritualityBase]),
    evidence: [`Lagna: ${chart.lagnaRashi}`, `Active MD: ${md?.planet ?? "unknown"}`, `Top score: ${topOne.label}`, ...patternEvidence(patterns, "career")],
    paragraphs: [
      `The life mission is not only about one profession or one relationship outcome. This chart repeatedly points toward the transformation of experience into guidance, structure and contribution. The native is meant to build credibility through lived learning and then turn that learning into something useful for others.`,
      `The highest potential opens when ${topOne.label.toLowerCase()} and ${topTwo.label.toLowerCase()} are not treated as separate areas, but as one operating system. The chart becomes more powerful when focus, discipline and service point in the same direction.`,
    ],
    action: [
      "Choose one scalable direction and commit long enough for mastery to compound.",
      "Convert personal lessons into systems, content, advisory work or practical service.",
      "Do not confuse many options with destiny. The chart rewards focused execution.",
    ],
  };

  const personality: NarrativeBlock = {
    id: "personality",
    title: "Personality Deep Dive",
    score: emotionalBase,
    evidence: [`Moon in ${planetSign(chart, "Moon")} H${planetHouse(chart, "Moon")}`, `Psychology engine active`, `Lal Kitab karmic lens active`],
    paragraphs: [
      `The personality pattern is layered: there is a practical side that wants results, and a reflective side that keeps searching for meaning behind events. This can make the native deeply observant, but also prone to carrying too much internal analysis when life becomes uncertain.`,
      `The strongest emotional upgrade is not becoming less sensitive. It is learning which signals deserve action and which signals only need awareness.`,
    ],
    action: [
      "Use written decision rules for major choices.",
      "Separate intuition from anxiety by giving decisions a cooling period.",
      "Communicate needs before frustration becomes withdrawal.",
    ],
  };

  const karmicBlueprint: NarrativeBlock = {
    id: "karmic-blueprint",
    title: "Karmic Blueprint",
    score: avg([spiritualityBase, emotionalBase, relationshipBase]),
    evidence: [`Rahu H${planetHouse(chart, "Rahu")}`, `Ketu H${planetHouse(chart, "Ketu")}`, `Lal Kitab remedies: ${lalKitab.remedies?.length ?? 0}`, ...patternEvidence(patterns, "karma")],
    paragraphs: [
      `Rahu and Ketu show the repeating lesson pattern. Rahu in house ${planetHouse(chart, "Rahu")} pulls life toward unfamiliar territory, while Ketu in house ${planetHouse(chart, "Ketu")} shows where old instincts can become either wisdom or avoidance.`,
      `The karmic lesson is to stop repeating inherited reactions. The chart improves when responsibility is handled consciously instead of automatically.`,
    ],
    action: [
      "Watch repeated patterns around commitment, money and emotional responsibility.",
      "Use remedies as behavioral correction first, ritual second.",
      "Do not convert fear into prediction. Convert patterns into better choices.",
    ],
  };

  const wealth: NarrativeBlock = {
    id: "wealth",
    title: "Wealth Intelligence Report",
    score: wealthBase,
    evidence: [...(scores.find((s) => s.key === "wealth")?.evidence ?? []), ...patternEvidence(patterns, "wealth")],
    paragraphs: [
      `Wealth in this chart is more likely to grow through expertise, positioning and repeated value creation than through sudden luck. The chart favors building assets from knowledge, networks, advisory ability or scalable systems.`,
      `The biggest financial risk is scattered effort. When too many unrelated directions run at once, the wealth signal gets diluted. The better strategy is to deepen one income engine and then add extensions around it.`,
    ],
    action: [
      "Prioritize expertise-led income: consulting, digital products, teaching, advisory or systems.",
      "Build proof, audience and trust before chasing expansion.",
      "Keep speculation moderate unless supported by clear timing and risk limits.",
    ],
  };

  const career: NarrativeBlock = {
    id: "career",
    title: "Career Intelligence Report",
    score: careerBase,
    evidence: [...(scores.find((s) => s.key === "career")?.evidence ?? []), ...patternEvidence(patterns, "career")],
    paragraphs: [
      `Career is one of the strongest pillars because the chart asks for visible contribution. Work should not remain only a salary source; over time it becomes a channel for identity, reputation and influence.`,
      `The chart performs best in roles where communication, systems, strategy, knowledge or leadership are central. Repetitive environments may feel limiting once competence has matured.`,
    ],
    action: [
      "Build a public proof-of-work trail.",
      "Choose work where expertise and visibility can compound.",
      "Avoid roles that reward obedience but suppress judgment.",
    ],
  };

  const relationship: NarrativeBlock = {
    id: "relationship",
    title: "Relationship Intelligence",
    score: relationshipBase,
    evidence: [...(scores.find((s) => s.key === "relationship")?.evidence ?? []), ...patternEvidence(patterns, "relationship")],
    paragraphs: [
      `Relationship patterns show growth through emotional maturity rather than simple timing claims. The chart asks for partnership that is loyal, stable and respectful of boundaries.`,
      `The recurring risk is over-functioning: becoming the stabilizer, fixer or emotional manager. Love improves when care is mutual and responsibilities are clearly shared.`,
    ],
    action: [
      "Choose consistency over chemistry alone.",
      "Discuss responsibility, money and family expectations early.",
      "Avoid rescue-based bonds where effort is one-sided.",
    ],
  };

  const foreign: NarrativeBlock = {
    id: "foreign",
    title: "Foreign Connection Report",
    score: foreignBase,
    evidence: [...(scores.find((s) => s.key === "foreign")?.evidence ?? []), ...patternEvidence(patterns, "foreign")],
    paragraphs: [
      `Foreign influence is not limited to permanent settlement. For this chart, the same signature can appear as foreign clients, remote work, international audience, travel, exportable knowledge or culturally mixed networks.`,
      `The strongest manifestation comes when local skill is made globally accessible. This means the first move is often building reach, not physically moving.`,
    ],
    action: [
      "Create globally understandable offers, content or services.",
      "Use digital distribution before relocation decisions.",
      "Treat travel and foreign links as opportunity channels, not escape routes.",
    ],
  };

  const eventRadar: NarrativeBlock = {
    id: "event-radar",
    title: "Event Radar Strategy",
    score: transitTop.score,
    evidence: [`Moon-first top area: ${transitTop.label} ${transitTop.score}/100`, bestRadarDay ? `Best near-term day: ${bestRadarDay.label}` : "30-day radar active"],
    paragraphs: [
      `The near-term radar highlights ${transitTop.label.toLowerCase()} as the most active live theme. This does not mean every event is guaranteed; it means decisions in this area deserve more attention because timing pressure is stronger.`,
      bestRadarDay
        ? `The strongest upcoming window currently appears around ${bestRadarDay.label}, where the radar score rises to ${bestRadarDay.overallScore}. Use stronger windows for launch, negotiation, planning or important conversations.`
        : `Use this radar as a monthly review system. It is designed to bring users back because timing changes as transits move.`,
    ],
    action: [
      "Plan important actions during stronger windows instead of random dates.",
      "Use caution windows for repair, review and preparation.",
      "Review the radar every month, especially during active dasha periods.",
    ],
  };

  const remedyRanking = remedies.cards.slice(0, 5).map((card, index) => {
    const score = clampScore(96 - index * 8 - (card.priority === "optional" ? 12 : 0));
    return {
      label: card.practice || `${card.planet} discipline`,
      score,
      reason: `${card.planet} ${card.priority} support during ${remedies.dashaActive}/${remedies.antardashaActive}.`,
    };
  });

  const biggestOpportunity = synthesis.biggestOpportunity;
  const biggestRisk = synthesis.biggestRisk;
  const next12Months = `For the next 12 months, use ${md?.planet ?? "current"}-${ad?.planet ?? "active"} timing with Moon-first transit checks. Build during supportive windows and repair during caution windows.`;

  const threeThings = synthesis.topThreeActions.length >= 3 ? synthesis.topThreeActions : [
    `Double down on ${topOne.label.toLowerCase()} through one focused direction.`,
    `Protect ${weakestScore.label.toLowerCase()} with better routines, boundaries and timing discipline.`,
    `Review Event Radar monthly and act where dasha, transit and practical readiness agree.`,
  ];

  return {
    scores,
    insights,
    patterns,
    scoreBlock,
    narrativeSections,
    lifePatternDecoder,
    lifeChapters,
    synthesis,
    executiveSummary,
    lifeMission,
    personality,
    karmicBlueprint,
    wealth,
    career,
    relationship,
    foreign,
    eventRadar,
    remedyRanking,
    threeThings,
    biggestOpportunity,
    biggestRisk,
    next12Months,
  };
}
