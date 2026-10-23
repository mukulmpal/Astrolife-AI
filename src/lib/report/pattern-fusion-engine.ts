import {
  averageReportScore,
  toneFromScore,
  type FusedPattern,
  type ReportLifeArea,
  type UniversalInsight,
} from "./insight-schema";

interface PatternRecipe {
  id: string;
  title: string;
  category: ReportLifeArea;
  insightIds: string[];
  lifeAreas: ReportLifeArea[];
  bonus?: number;
  reason: string[];
  opportunities: string[];
  risks: string[];
  actions: string[];
  narrativeSeed: FusedPattern["narrativeSeed"];
}

const RECIPES: PatternRecipe[] = [
  {
    id: "knowledge_entrepreneur_pattern",
    title: "Knowledge Entrepreneur Pattern",
    category: "career",
    insightIds: ["career_visibility_signal", "wealth_support_signal", "dasha_activation_signal"],
    lifeAreas: ["career", "wealth", "decision"],
    bonus: 4,
    reason: [
      "Career visibility, wealth support and active timing are converging.",
      "This pattern favors building a productized skill, advisory system, teaching channel or expertise-led offer.",
    ],
    opportunities: ["Build a clear offer around one proven skill.", "Use the current timing to create visible proof and trust."],
    risks: ["Too many services or directions can blur the market signal.", "Waiting for perfect clarity may waste supportive timing."],
    actions: ["Define one audience, one offer and one proof metric.", "Ship a visible asset every week for 90 days."],
    narrativeSeed: {
      observation: "The chart behaves like an expertise-to-income engine when focus is protected.",
      realLife: "The native may do best in consulting, education, content, advisory, systems, research or strategy-led work.",
      psychology: "Confidence grows when competence becomes visible instead of staying private.",
      opportunity: "Authority can compound into wealth if knowledge is packaged clearly.",
      warning: "Scattered experiments are the main leak.",
      advice: "Choose one strong commercial lane and build durable proof around it.",
    },
  },
  {
    id: "global_builder_pattern",
    title: "Global Builder Pattern",
    category: "foreign",
    insightIds: ["foreign_digital_signal", "career_visibility_signal", "wealth_support_signal"],
    lifeAreas: ["foreign", "career", "wealth"],
    bonus: 3,
    reason: [
      "Foreign reach, career visibility and wealth signals support a wider-than-local life path.",
      "This can manifest through clients, distribution, audience, remote work or settlement.",
    ],
    opportunities: ["Create globally understandable services or content.", "Treat foreign connections as reach, not only relocation."],
    risks: ["Moving without a strong offer may not solve the business or career problem.", "Foreign opportunity requires preparation, not fantasy."],
    actions: ["Localize the skill globally: English profile, clear proof, international-friendly positioning.", "Track foreign leads, remote opportunities and travel windows."],
    narrativeSeed: {
      observation: "The life field expands when work is made portable.",
      realLife: "Foreign clients, online audience, relocation, travel or cross-cultural networks can become growth channels.",
      psychology: "The native may feel restless when confined to one local identity.",
      opportunity: "Global reach can multiply existing skill.",
      warning: "Escape-based decisions reduce the quality of foreign outcomes.",
      advice: "Build the bridge first, then cross it.",
    },
  },
  {
    id: "relationship_responsibility_pattern",
    title: "Relationship Maturity Pattern",
    category: "relationship",
    insightIds: ["relationship_responsibility_signal", "emotional_depth_signal", "karmic_axis_signal"],
    lifeAreas: ["relationship", "emotional", "karma"],
    bonus: 2,
    reason: [
      "Relationship, emotional and karmic signals point to maturity through boundaries.",
      "The main upgrade is choosing steadiness over rescue or intensity.",
    ],
    opportunities: ["Create loyal partnership through clear responsibility.", "Use emotional depth for care without losing self-respect."],
    risks: ["Over-functioning can create one-sided bonds.", "Old family or karmic scripts may repeat under stress."],
    actions: ["Discuss expectations early.", "Do not ignore reciprocity signals."],
    narrativeSeed: {
      observation: "Love improves when responsibility is shared instead of silently carried.",
      realLife: "Partnership may need clarity around money, family, time and emotional labor.",
      psychology: "The native may sense others deeply and then over-adjust.",
      opportunity: "A stable bond can become a major support system.",
      warning: "Chemistry alone is not enough.",
      advice: "Choose the person whose actions are as calm as their words.",
    },
  },
  {
    id: "wealth_through_knowledge_pattern",
    title: "Wealth Through Knowledge Pattern",
    category: "wealth",
    insightIds: ["wealth_support_signal", "career_visibility_signal", "leadership_authority_signal"],
    lifeAreas: ["wealth", "career", "leadership"],
    bonus: 4,
    reason: [
      "Wealth, career and leadership signals suggest income through earned trust.",
      "The chart is stronger when expertise is structured into assets.",
    ],
    opportunities: ["Create intellectual property, courses, advisory systems or repeatable frameworks.", "Turn trust into recurring value."],
    risks: ["Undervaluing expertise can cap earning potential.", "Random speculation can distract from the stronger path."],
    actions: ["Document frameworks and convert them into sellable formats.", "Raise pricing only with proof, structure and delivery quality."],
    narrativeSeed: {
      observation: "Money grows where knowledge becomes organized and trusted.",
      realLife: "The native can profit from teaching, advising, analysis, operations, writing or strategic services.",
      psychology: "Self-worth must catch up with competence.",
      opportunity: "A knowledge asset can compound beyond direct labor.",
      warning: "Short-term money chasing can interrupt long-term wealth.",
      advice: "Build the asset, then build the audience.",
    },
  },
  {
    id: "hidden_stress_to_mastery_pattern",
    title: "Hidden Stress To Mastery Pattern",
    category: "vitality",
    insightIds: ["emotional_depth_signal", "vitality_rhythm_signal", "karmic_axis_signal"],
    lifeAreas: ["emotional", "vitality", "karma"],
    bonus: 1,
    reason: [
      "Emotional depth, vitality rhythm and karmic axis signals show stress can become discipline.",
      "The pattern is not medical; it is about recovery, boundaries and self-management.",
    ],
    opportunities: ["Turn sensitivity into wisdom and measured action.", "Use rhythm as a performance system."],
    risks: ["Stress can distort decisions if recovery is weak.", "Old emotional patterns can return during pressure."],
    actions: ["Protect sleep, recovery and decision cooling periods.", "Use simple practices instead of dramatic remedies."],
    narrativeSeed: {
      observation: "The same sensitivity that creates stress can become refined judgment.",
      realLife: "Performance improves when the native stops running life on urgency.",
      psychology: "The nervous system needs predictability before big decisions.",
      opportunity: "Rhythm can unlock stronger career and relationship choices.",
      warning: "Ignoring recovery makes strong periods feel weak.",
      advice: "Stabilize the body before trying to solve every life question.",
    },
  },
  {
    id: "gradual_authority_pattern",
    title: "Gradual Authority Pattern",
    category: "leadership",
    insightIds: ["leadership_authority_signal", "career_visibility_signal", "dasha_activation_signal"],
    lifeAreas: ["leadership", "career", "decision"],
    bonus: 3,
    reason: [
      "Leadership, career and timing signals point to authority that compounds gradually.",
      "Recognition grows through consistency and proof, not one dramatic event.",
    ],
    opportunities: ["Become known for standards, systems and judgment.", "Use active timing to assume more responsibility."],
    risks: ["Impatience can create unnecessary conflict.", "Avoiding leadership can delay recognition."],
    actions: ["Take ownership of one domain.", "Create repeatable systems and visible decisions."],
    narrativeSeed: {
      observation: "Authority arrives through repeated credibility.",
      realLife: "The native may become a manager, founder, advisor, operator, teacher or trusted decision-maker.",
      psychology: "Leadership feels safer once standards are clear.",
      opportunity: "Reputation can become a life asset.",
      warning: "Trying to force respect is weaker than earning trust.",
      advice: "Be consistent long enough that people can rely on your judgment.",
    },
  },
];

function byId(insights: UniversalInsight[], id: string) {
  return insights.find((insight) => insight.id === id);
}

function buildPattern(recipe: PatternRecipe, insights: UniversalInsight[]): FusedPattern | null {
  const sourceInsights = recipe.insightIds.map((id) => byId(insights, id)).filter((item): item is UniversalInsight => Boolean(item));
  if (sourceInsights.length < recipe.insightIds.length) return null;

  const strength = averageReportScore(sourceInsights.map((insight) => insight.score + Number(recipe.bonus ?? 0)));
  const confidence = averageReportScore(sourceInsights.map((insight) => insight.confidence));

  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    strength,
    confidence,
    tone: toneFromScore(strength),
    lifeAreas: recipe.lifeAreas,
    sourceInsightIds: sourceInsights.map((insight) => insight.id),
    reason: recipe.reason,
    opportunities: recipe.opportunities,
    risks: recipe.risks,
    actions: recipe.actions,
    narrativeSeed: recipe.narrativeSeed,
  };
}

export function fuseInsightPatterns(insights: UniversalInsight[]): FusedPattern[] {
  return RECIPES
    .map((recipe) => buildPattern(recipe, insights))
    .filter((pattern): pattern is FusedPattern => Boolean(pattern))
    .sort((a, b) => b.strength - a.strength || b.confidence - a.confidence);
}
