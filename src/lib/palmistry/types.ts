export type HandSide = "left" | "right" | "both" | "unknown";
export type DominantHand = "left" | "right" | "unknown";
export type PalmReportStyle = "classical" | "scientific" | "luxury";
export type PalmTradition = "indian" | "western" | "hybrid";
export type PalmCategory =
  | "hand_shape"
  | "thumb"
  | "fingers"
  | "mounts"
  | "major_lines"
  | "relationship"
  | "career"
  | "vitality"
  | "travel"
  | "remedies";

export type PalmSeverity = "supportive" | "watch" | "growth" | "strong";

export interface PalmImageQuality {
  score: number;
  canAnalyze: boolean;
  canAnalyzeFingerprints: boolean;
  issues: string[];
}

export interface PalmFeatures {
  handSide: HandSide;
  dominantHand: DominantHand;
  palm: {
    shape: "square" | "rectangular" | "conic" | "spatulate" | "mixed" | "unknown";
    texture: "soft" | "supple" | "firm" | "coarse" | "unknown";
    lineDensity: "few" | "balanced" | "many" | "unknown";
  };
  thumb: {
    length: "short" | "medium" | "long" | "unknown";
    angle: "closed" | "balanced" | "wide" | "unknown";
    firstPhalange: "short" | "medium" | "long" | "unknown";
    secondPhalange: "short" | "medium" | "long" | "unknown";
  };
  fingers: {
    length: "short" | "medium" | "long" | "unknown";
    tips: "square" | "conic" | "spatulate" | "mixed" | "unknown";
    setting: "low" | "balanced" | "uneven" | "unknown";
  };
  mounts: Record<"jupiter" | "saturn" | "sun" | "mercury" | "venus" | "moon" | "mars", { prominence: "weak" | "balanced" | "strong" | "unknown" }>;
  lines: Record<"life" | "head" | "heart" | "saturn" | "sun" | "mercury" | "travel" | "intuition", {
    visible: boolean;
    depth?: "faint" | "medium" | "deep";
    clarity?: "chained" | "broken" | "clear";
    direction?: "straight" | "moon" | "jupiter" | "unknown";
    ending?: "jupiter" | "saturn" | "between" | "unknown";
    endFork?: boolean;
    forkDirection?: "moon" | "jupiter" | "upward" | "downward" | "unknown";
  }>;
  signs: Record<"island" | "cross" | "square" | "star" | "triangle" | "grille" | "fork" | "branch" | "break", boolean>;
}

export interface PalmCondition {
  path: string;
  equals?: unknown;
  exists?: boolean;
}

export interface PalmRule {
  id: string;
  title: string;
  sourceIds: string[];
  tradition: PalmTradition;
  category: PalmCategory;
  required: PalmCondition[];
  supporting: PalmCondition[];
  contradicting: PalmCondition[];
  interpretation: Record<PalmReportStyle, string>;
  confidenceBase: number;
  severity: PalmSeverity;
  guardrail?: "no_death" | "no_diagnosis" | "no_guarantee";
}

export interface PalmRuleHit {
  rule: PalmRule;
  confidence: number;
  sourceIds: string[];
  matchedSupport: number;
  contradicted: number;
}

export interface PalmReportSection {
  id: PalmCategory;
  title: string;
  summary: string;
  confidence: number;
  hits: PalmRuleHit[];
}

export interface PalmRuleReport {
  engineVersion: string;
  summary: string;
  hits: PalmRuleHit[];
  sections: PalmReportSection[];
  disclaimers: string[];
}

export interface PalmAnalyzeInput {
  handSide: HandSide;
  dominantHand: DominantHand;
  reportStyle: PalmReportStyle;
  imageQuality: PalmImageQuality;
  features: Omit<PalmFeatures, "handSide" | "dominantHand">;
}

export interface PalmVisionResult {
  imageQuality: PalmImageQuality;
  detectedHand: {
    handSide: HandSide;
    orientation: "upright" | "rotated" | "unknown";
  };
  features: PalmAnalyzeInput["features"];
  featureConfidence: Record<string, number>;
  uncertainFeatures: string[];
  warnings: string[];
}
