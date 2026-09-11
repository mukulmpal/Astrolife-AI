export type ReportLifeArea =
  | "career"
  | "wealth"
  | "relationship"
  | "foreign"
  | "spirituality"
  | "leadership"
  | "vitality"
  | "emotional"
  | "personality"
  | "family"
  | "karma"
  | "decision";

export type InsightSource =
  | "kundli"
  | "dasha"
  | "yoga"
  | "lal_kitab"
  | "psychology"
  | "destiny"
  | "shadbala"
  | "ashtakavarga"
  | "transit"
  | "derived";

export type InsightTone = "support" | "mixed" | "caution";

export interface InsightEvidence {
  source: InsightSource;
  label: string;
  detail: string;
  weight: number;
}

export interface UniversalInsight {
  id: string;
  category: ReportLifeArea;
  score: number;
  confidence: number;
  tone: InsightTone;
  observation: string;
  themes: string[];
  opportunities: string[];
  risks: string[];
  actions: string[];
  evidence: InsightEvidence[];
}

export interface FusedPattern {
  id: string;
  title: string;
  category: ReportLifeArea;
  strength: number;
  confidence: number;
  tone: InsightTone;
  lifeAreas: ReportLifeArea[];
  sourceInsightIds: string[];
  reason: string[];
  opportunities: string[];
  risks: string[];
  actions: string[];
  narrativeSeed: {
    observation: string;
    realLife: string;
    psychology: string;
    opportunity: string;
    warning: string;
    advice: string;
  };
}

export interface InsightGraph {
  insights: UniversalInsight[];
  patterns: FusedPattern[];
}

export interface ReportScoreBlock {
  career: number;
  wealth: number;
  relationship: number;
  foreign: number;
  leadership: number;
  spirituality: number;
  emotionalResilience: number;
  business: number;
  vitality: number;
}

export interface ReportNarrativeSection {
  id: string;
  title: string;
  category: ReportLifeArea;
  score?: number;
  confidence: number;
  longNarrative: string;
  whatThisMeansForYou: string;
  risks: string[];
  opportunities: string[];
  actions: string[];
  reflectionQuestion?: string;
  evidence: string[];
}

export interface LifeChapter {
  title: string;
  period: string;
  theme: string;
  narrative: string;
  lessons: string[];
  avoid: string[];
  successLooksLike: string;
}

export interface AISynthesis {
  lifeStory: string;
  biggestStrength: string;
  biggestRisk: string;
  biggestOpportunity: string;
  topThreeActions: string[];
  finalGuidance: string;
}

export function clampReportScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function averageReportScore(values: number[]) {
  const clean = values.filter(Number.isFinite);
  if (!clean.length) return 50;
  return clampReportScore(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

export function confidenceFromEvidence(evidence: InsightEvidence[], base = 62) {
  const weighted = evidence.reduce((sum, item) => sum + item.weight, base);
  return clampReportScore(Math.min(96, weighted));
}

export function toneFromScore(score: number): InsightTone {
  if (score >= 72) return "support";
  if (score >= 55) return "mixed";
  return "caution";
}
