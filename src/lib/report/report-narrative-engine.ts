import type {
  FusedPattern,
  ReportLifeArea,
  ReportNarrativeSection,
  ReportScoreBlock,
  UniversalInsight,
} from "./insight-schema";

type NarrativeCategory = Extract<ReportLifeArea, "career" | "wealth" | "relationship" | "foreign" | "spirituality" | "vitality">;

const CATEGORY_COPY: Record<
  NarrativeCategory,
  {
    title: string;
    scoreKey: keyof ReportScoreBlock;
    observation: string;
    meaning: string;
    whatThisMeansForYou: string;
    reflectionQuestion: string;
  }
> = {
  career: {
    title: "Career Intelligence",
    scoreKey: "career",
    observation: "The career pattern is connected with visibility, skill, responsibility and the ability to create useful structure.",
    meaning: "Work is unlikely to remain only a source of income. It gradually becomes a channel for identity, reputation and contribution.",
    whatThisMeansForYou: "The best career path is one where skill, communication and structured guidance become visible to a larger audience.",
    reflectionQuestion: "Are you building only income, or are you building authority?",
  },
  wealth: {
    title: "Wealth Intelligence",
    scoreKey: "wealth",
    observation: "The wealth pattern is strongest where knowledge, trust, systems and long-term discipline work together.",
    meaning: "Money is more likely to grow through repeatable value creation than through random luck or scattered experiments.",
    whatThisMeansForYou: "The strongest financial growth comes from building assets around skill, trust and repeatable delivery.",
    reflectionQuestion: "Are you depending only on effort, or are you building assets?",
  },
  relationship: {
    title: "Relationship Intelligence",
    scoreKey: "relationship",
    observation: "Relationship patterns become clearer through responsibility, boundaries and emotional steadiness.",
    meaning: "Commitment improves when maturity and practical compatibility are treated as seriously as attraction.",
    whatThisMeansForYou: "The right relationship requires maturity, reciprocity and shared responsibility rather than emotional rescue.",
    reflectionQuestion: "Are you choosing partnership, or are you trying to rescue someone?",
  },
  foreign: {
    title: "Foreign Connection Blueprint",
    scoreKey: "foreign",
    observation: "Foreign influence can express through relocation, travel, global users, foreign clients or digital reach.",
    meaning: "The chart can support expansion beyond local boundaries when skill is made portable and globally understandable.",
    whatThisMeansForYou: "Foreign growth may begin as digital reach or international opportunity before it becomes physical movement.",
    reflectionQuestion: "Can global reach be built before waiting for relocation?",
  },
  spirituality: {
    title: "Spiritual Intelligence",
    scoreKey: "spirituality",
    observation: "The spiritual pattern is practical: reflection, detachment, service and learning from repeating life themes.",
    meaning: "Spirituality becomes useful when it improves decisions, reduces fear and turns pressure into self-knowledge.",
    whatThisMeansForYou: "Spiritual growth here means living with more clarity, not escaping practical responsibility.",
    reflectionQuestion: "Which repeated lesson is asking for a calmer response?",
  },
  vitality: {
    title: "Vitality & Rhythm Intelligence",
    scoreKey: "vitality",
    observation: "Vitality should be read as rhythm management: rest, recovery, stress hygiene and sustainable pace.",
    meaning: "The chart performs better when the body and mind are not forced to run permanently on urgency.",
    whatThisMeansForYou: "Better rhythm improves every other life area because it protects judgment, patience and execution.",
    reflectionQuestion: "Which routine would immediately reduce unnecessary pressure?",
  },
};

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function categoryItems(insights: UniversalInsight[], patterns: FusedPattern[], category: ReportLifeArea) {
  const matchedInsights = insights.filter((insight) => insight.category === category);
  const matchedPatterns = patterns.filter((pattern) => pattern.category === category || pattern.lifeAreas.includes(category));
  return { matchedInsights, matchedPatterns };
}

function evidenceFor(insights: UniversalInsight[], patterns: FusedPattern[]) {
  const insightEvidence = insights.flatMap((insight) => insight.evidence.map((item) => `${item.label}: ${item.detail}`));
  const patternEvidence = patterns.map((pattern) => `${pattern.title}: ${pattern.strength}/100`);
  return unique([...insightEvidence, ...patternEvidence]).slice(0, 8);
}

function buildLongNarrative(input: {
  category: NarrativeCategory;
  title: string;
  observation: string;
  meaning: string;
  opportunities: string[];
  risks: string[];
  actions: string[];
}) {
  const opportunities = input.opportunities.slice(0, 4).join(", ") || "focused growth, better choices and clearer timing";
  const risks = input.risks.slice(0, 4).join(", ") || "scattered effort, emotional pressure and weak timing discipline";
  const actions = input.actions.slice(0, 4).join(", ") || "choose patiently, act consistently and review timing before major decisions";

  const templates: Record<NarrativeCategory, string> = {
    career: `Career is not being read here as a job title. It is the way skill becomes visible, trusted and monetized. ${input.observation} ${input.meaning}

In practical life, this points toward ${opportunities}. The native should treat career as an authority-building system: proof of work, repeatable frameworks, sharper positioning and public trust matter more than chasing every attractive option.

The watch-outs are ${risks}. The correction is not passivity; it is disciplined visibility. The best next moves are to ${actions}.`,
    wealth: `Wealth is being read as a capacity to create, preserve and compound value. ${input.observation} ${input.meaning}

The useful opportunity zone is ${opportunities}. This favors structured value: advisory work, packaged knowledge, assets, systems, trusted services and long-term financial hygiene.

The leakage points are ${risks}. The correction is to ${actions}. Wealth improves when effort becomes an asset instead of only daily labor.`,
    relationship: `Relationship intelligence is not about predicting one fixed outcome. It is about the emotional contract the chart repeatedly asks the person to mature into. ${input.observation} ${input.meaning}

The strongest possibilities are ${opportunities}. Partnership improves when attraction, duty, communication and practical compatibility are all respected.

The recurring risks are ${risks}. The healthier pattern is to ${actions}. This turns relationship from emotional pressure into shared responsibility.`,
    foreign: `Foreign connection is not limited to migration. It includes global audience, foreign clients, remote work, travel, cultural exchange and portable expertise. ${input.observation} ${input.meaning}

The best openings are ${opportunities}. The first move is often to make the skill globally understandable before making a physical move.

The risks are ${risks}. Work with this by choosing to ${actions}. Reach should be built before relocation is treated as a solution.`,
    spirituality: `Spiritual intelligence is practical in this report. It is the capacity to meet repeating life lessons with awareness instead of fear. ${input.observation} ${input.meaning}

The growth openings are ${opportunities}. These are not abstract ideals; they show where calmer choices, service and reflection can improve real decisions.

The caution points are ${risks}. The right practice is to ${actions}. Spirituality should sharpen responsibility, not replace it.`,
    vitality: `Vitality is read as rhythm, recovery and sustainable execution. ${input.observation} ${input.meaning}

The helpful openings are ${opportunities}. Better sleep, cleaner routines, steadier pacing and simpler food choices can improve every other domain because they protect judgment.

The pressure points are ${risks}. The practical correction is to ${actions}. This is wellness guidance only, not diagnosis or medical instruction.`,
  };

  return templates[input.category];
}

export function buildReportNarrativeSections(
  insights: UniversalInsight[],
  patterns: FusedPattern[],
  scores: ReportScoreBlock
): ReportNarrativeSection[] {
  return (Object.keys(CATEGORY_COPY) as NarrativeCategory[]).map((category) => {
    const copy = CATEGORY_COPY[category];
    const { matchedInsights, matchedPatterns } = categoryItems(insights, patterns, category);
    const opportunities = unique([...matchedInsights.flatMap((item) => item.opportunities), ...matchedPatterns.flatMap((item) => item.opportunities)]);
    const risks = unique([...matchedInsights.flatMap((item) => item.risks), ...matchedPatterns.flatMap((item) => item.risks)]);
    const actions = unique([...matchedInsights.flatMap((item) => item.actions), ...matchedPatterns.flatMap((item) => item.actions)]);
    const confidenceItems = [...matchedInsights.map((item) => item.confidence), ...matchedPatterns.map((item) => item.confidence)];

    return {
      id: `${category}_narrative`,
      title: copy.title,
      category,
      score: scores[copy.scoreKey],
      confidence: confidenceItems.length
        ? Math.round(confidenceItems.reduce((sum, value) => sum + value, 0) / confidenceItems.length)
        : 68,
      evidence: evidenceFor(matchedInsights, matchedPatterns),
      risks,
      opportunities,
      actions,
      reflectionQuestion: copy.reflectionQuestion,
      longNarrative: buildLongNarrative({
        category,
        title: copy.title,
        observation: copy.observation,
        meaning: copy.meaning,
        opportunities,
        risks,
        actions,
      }),
      whatThisMeansForYou: copy.whatThisMeansForYou,
    };
  });
}
