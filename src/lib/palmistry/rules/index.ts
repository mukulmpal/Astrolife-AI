import { CAREER_RULES } from "./career-rules";
import { PHASE3A_BATCH1_RULES } from "./atomic/batch1-rules";
import { PHASE3A_BATCH2_MOUNT_RULES } from "./atomic/mount-batch2-rules";
import { PHASE3A_BATCH3_MAJOR_LINE_RULES } from "./atomic/major-line-batch3-rules";
import { FINGER_RULES } from "./finger-rules";
import { HAND_SHAPE_RULES } from "./hand-shape-rules";
import { MAJOR_LINE_RULES } from "./major-line-rules";
import { MOUNT_RULES } from "./mount-rules";
import { PHASE3_RULE_BANK } from "./phase3-rule-bank";
import { RELATIONSHIP_RULES } from "./relationship-rules";
import { REMEDIES_RULES } from "./remedies-rules";
import { THUMB_RULES } from "./thumb-rules";
import type { PalmRule } from "../types";

export const ALL_PALM_RULES: PalmRule[] = [
  ...HAND_SHAPE_RULES,
  ...THUMB_RULES,
  ...FINGER_RULES,
  ...MOUNT_RULES,
  ...MAJOR_LINE_RULES,
  ...RELATIONSHIP_RULES,
  ...CAREER_RULES,
  ...REMEDIES_RULES,
  ...PHASE3_RULE_BANK,
  ...PHASE3A_BATCH1_RULES,
  ...PHASE3A_BATCH2_MOUNT_RULES,
  ...PHASE3A_BATCH3_MAJOR_LINE_RULES,
];

export const ALL_PALMISTRY_RULES = ALL_PALM_RULES;
