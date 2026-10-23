import type { PalmFeatures } from "../types";

export type PalmVisionFeatureSchema = PalmFeatures;

export const PALM_VISION_FEATURE_KEYS = [
  "handSide",
  "dominantHand",
  "palm.shape",
  "palm.texture",
  "palm.lineDensity",
  "thumb.length",
  "thumb.angle",
  "fingers.length",
  "fingers.tips",
  "mounts.jupiter.prominence",
  "lines.life.clarity",
  "lines.head.direction",
  "lines.heart.ending",
  "signs.triangle",
] as const;
