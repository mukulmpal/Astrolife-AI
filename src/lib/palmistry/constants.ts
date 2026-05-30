import type { PalmCategory } from "./types";

export const PALMISTRY_ENGINE_VERSION = "astrolife-palm-rule-engine-v1.0";

export const PALMISTRY_DISCLAIMERS = [
  "Palmistry is used here as pattern recognition and self-reflection, not deterministic fate.",
  "The report never predicts death age, diagnoses disease, or guarantees marriage, divorce, childbirth, wealth, legal, or medical outcomes.",
  "Health language refers only to vitality, stress, routine, and lifestyle balance.",
];

export const CATEGORY_TITLES: Record<PalmCategory, string> = {
  hand_shape: "Hand Shape Architecture",
  thumb: "Thumb & Willpower Intelligence",
  fingers: "Finger Intelligence",
  mounts: "Planetary Mount Strengths",
  major_lines: "Major Line Synthesis",
  relationship: "Relationship Pattern Indicators",
  career: "Career & Wealth Indicators",
  vitality: "Vitality & Lifestyle Balance",
  travel: "Travel & Movement Indicators",
  remedies: "AI Growth & Remedy Protocol",
};
