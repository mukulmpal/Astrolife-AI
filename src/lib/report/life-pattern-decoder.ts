import type { FusedPattern, ReportNarrativeSection, UniversalInsight } from "./insight-schema";

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

export function buildLifePatternDecoder(insights: UniversalInsight[], patterns: FusedPattern[]): ReportNarrativeSection {
  const topPattern = patterns[0];
  const topInsights = insights.slice(0, 5);
  const risks = unique([
    ...(topPattern?.risks ?? []),
    ...topInsights.flatMap((insight) => insight.risks),
    "Scattered focus",
    "Over-responsibility",
  ]).slice(0, 6);
  const opportunities = unique([
    ...(topPattern?.opportunities ?? []),
    ...topInsights.flatMap((insight) => insight.opportunities),
    "Self-mastery",
    "Converting experience into wisdom",
  ]).slice(0, 6);
  const actions = unique([
    ...(topPattern?.actions ?? []),
    ...topInsights.flatMap((insight) => insight.actions),
    "Choose one flagship direction",
    "Build boundaries before burnout",
  ]).slice(0, 6);

  return {
    id: "life_pattern_decoder",
    title: "Life Pattern Decoder",
    category: "personality",
    score: topPattern?.strength ?? 78,
    confidence: topPattern?.confidence ?? 76,
    evidence: unique([
      ...(topPattern ? [`Fused pattern: ${topPattern.title}`] : []),
      ...topInsights.map((insight) => `${insight.id}: ${insight.score}/100`),
    ]),
    risks,
    opportunities,
    actions,
    reflectionQuestion: "Which responsibility, desire or fear keeps repeating until it is handled consciously?",
    longNarrative: `One of the strongest repeating patterns in this report is the movement from pressure into conscious structure. The chart reads like a training path: certain themes repeat until the native learns how to respond with clarity instead of habit.

The central lesson is the difference between responsibility and burden. Responsibility strengthens character when it is chosen consciously. Burden drains energy when it is carried silently, especially when the native becomes the stabilizer, fixer or decision-maker for too many situations at once.

The upgrade is not detachment from life. The upgrade is conscious participation. The native must choose commitments carefully, define limits clearly and build systems instead of personally carrying every moving part. When this is understood, the same pressure that once created fatigue can become the foundation for leadership, wisdom and long-term influence.`,
    whatThisMeansForYou:
      "Life improves when repeating pressure is converted into systems, boundaries and one focused direction.",
  };
}
