import type {
  PalmCategory,
  PalmRuleHit,
  PalmRuleReport,
  PalmRuleTier,
} from "../types";

export type FusionSignalSource =
  | "palmistry"
  | "kundli"
  | "dasha"
  | "numerology"
  | "transit";

export type FusionPolarity = "support" | "challenge" | "neutral";

export type FusionTheme =
  | "personality"
  | "career"
  | "wealth"
  | "relationship"
  | "health_vitality"
  | "travel"
  | "spirituality"
  | "education"
  | "family"
  | "fame";

export type FusionAgreement =
  | "strong_alignment"
  | "partial_alignment"
  | "mixed"
  | "contradictory"
  | "palm_only"
  | "astro_only";

export type AstroFusionChartContext = {
  ascendant?: string;
  moonSign?: string;
  sunSign?: string;
  strongPlanets?: string[];
  weakPlanets?: string[];
  activeHouses?: number[];
  yogas?: string[];
  careerIndicators?: string[];
  wealthIndicators?: string[];
  relationshipIndicators?: string[];
  travelIndicators?: string[];
  spiritualIndicators?: string[];
  vitalityIndicators?: string[];
  fameIndicators?: string[];
  educationIndicators?: string[];
  raw?: unknown;
};

export type AstroFusionDashaContext = {
  currentMD?: string;
  currentAD?: string;
  currentPD?: string;
  activePlanets?: string[];
  startDate?: string;
  endDate?: string;
  themes?: string[];
  raw?: unknown;
};

export type AstroFusionNumerologyContext = {
  lifePathNumber?: number;
  destinyNumber?: number;
  personalYearNumber?: number;
  favorableNumbers?: number[];
  themes?: string[];
  raw?: unknown;
};

export type AstroLifeFusionContext = {
  chart?: AstroFusionChartContext;
  dasha?: AstroFusionDashaContext;
  numerology?: AstroFusionNumerologyContext;
};

export type FusionSignal = {
  id: string;
  source: FusionSignalSource;
  theme: FusionTheme;
  polarity: FusionPolarity;
  strength: number;
  title: string;
  description: string;
  evidence?: string[];
  guardrail?: string;
};

export type FusionInsight = {
  id: string;
  theme: FusionTheme;
  title: string;
  summary: string;
  confidence: number;
  agreement: FusionAgreement;
  palmSignals: FusionSignal[];
  astroSignals: FusionSignal[];
  timingSignals: FusionSignal[];
  numerologySignals: FusionSignal[];
  guidance: string[];
  guardrails: string[];
  tier: PalmRuleTier;
};

export type AstroPalmFusionInput = {
  palmResult: PalmRuleReport;
  astroContext?: AstroLifeFusionContext;
  userTier?: PalmRuleTier;
};

export type AstroPalmFusionOutput = {
  fusionVersion: string;
  overallSummary: string;
  insights: FusionInsight[];
  signals: FusionSignal[];
  strongestThemes: FusionTheme[];
  missingContext: string[];
  disclaimers: string[];
};

export type PalmHitThemeMap = Partial<Record<PalmCategory, FusionTheme>>;
export type PalmHitWithFusion = PalmRuleHit & {
  reportPriority?: number;
};
