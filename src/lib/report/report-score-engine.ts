import {
  averageReportScore,
  type FusedPattern,
  type ReportLifeArea,
  type ReportScoreBlock,
  type UniversalInsight,
} from "./insight-schema";

type ScoredItem = {
  category: ReportLifeArea;
  score: number;
};

function insightScore(insight: UniversalInsight): ScoredItem {
  return { category: insight.category, score: insight.score };
}

function patternScore(pattern: FusedPattern): ScoredItem {
  return { category: pattern.category, score: pattern.strength };
}

function byCategory(items: ScoredItem[], category: ReportLifeArea) {
  return items.filter((item) => item.category === category).map((item) => item.score);
}

function byLifeArea(patterns: FusedPattern[], category: ReportLifeArea) {
  return patterns.filter((pattern) => pattern.lifeAreas.includes(category)).map((pattern) => pattern.strength);
}

export function calculateReportScores(insights: UniversalInsight[], patterns: FusedPattern[]): ReportScoreBlock {
  const items = [...insights.map(insightScore), ...patterns.map(patternScore)];

  return {
    career: averageReportScore([...byCategory(items, "career"), ...byLifeArea(patterns, "career"), 62]),
    wealth: averageReportScore([...byCategory(items, "wealth"), ...byLifeArea(patterns, "wealth"), 60]),
    relationship: averageReportScore([...byCategory(items, "relationship"), ...byLifeArea(patterns, "relationship"), 58]),
    foreign: averageReportScore([...byCategory(items, "foreign"), ...byLifeArea(patterns, "foreign"), 56]),
    leadership: averageReportScore([...byCategory(items, "leadership"), ...byLifeArea(patterns, "leadership"), ...byCategory(items, "career"), 62]),
    spirituality: averageReportScore([...byCategory(items, "spirituality"), ...byLifeArea(patterns, "spirituality"), ...byCategory(items, "karma"), 60]),
    emotionalResilience: averageReportScore([...byCategory(items, "emotional"), ...byLifeArea(patterns, "emotional"), ...byCategory(items, "vitality"), 60]),
    business: averageReportScore([...byCategory(items, "career"), ...byCategory(items, "wealth"), ...byLifeArea(patterns, "wealth"), 62]),
    vitality: averageReportScore([...byCategory(items, "vitality"), ...byLifeArea(patterns, "vitality"), 62]),
  };
}
