import { PALM_VISION_PROMPT } from "./palm-vision-prompt";
import { normalizePalmImageQuality } from "./quality-check";
import type { PalmAnalyzeInput, PalmImageQuality, PalmVisionResult } from "../types";

const MOUNT_KEYS = ["jupiter", "saturn", "sun", "mercury", "venus", "moon", "mars"] as const;
const SIGN_KEYS = ["island", "cross", "square", "star", "triangle", "grille", "fork", "branch", "break"] as const;
const HAND_SIDE_VALUES = ["left", "right", "both", "unknown"] as const;
const ORIENTATION_VALUES = ["upright", "rotated", "unknown"] as const;
const PROMINENCE_VALUES = ["weak", "balanced", "strong", "unknown"] as const;
const PALM_SHAPE_VALUES = ["square", "rectangular", "conic", "spatulate", "mixed", "unknown"] as const;
const TEXTURE_VALUES = ["soft", "supple", "firm", "coarse", "unknown"] as const;
const LINE_DENSITY_VALUES = ["few", "balanced", "many", "unknown"] as const;
const LENGTH_VALUES = ["short", "medium", "long", "unknown"] as const;
const THUMB_ANGLE_VALUES = ["closed", "balanced", "wide", "unknown"] as const;
const FINGER_TIP_VALUES = ["square", "conic", "spatulate", "mixed", "unknown"] as const;
const FINGER_SETTING_VALUES = ["low", "balanced", "uneven", "unknown"] as const;
const DEPTH_VALUES = ["faint", "medium", "deep"] as const;
const CLARITY_VALUES = ["chained", "broken", "clear"] as const;
const FORK_DIRECTION_VALUES = ["moon", "jupiter", "upward", "downward", "unknown"] as const;
const HEAD_DIRECTION_VALUES = ["straight", "moon", "jupiter", "unknown"] as const;
const HEART_ENDING_VALUES = ["jupiter", "saturn", "between", "unknown"] as const;
type LineKey = keyof PalmAnalyzeInput["features"]["lines"];

const UNKNOWN_FEATURES: PalmAnalyzeInput["features"] = {
  palm: { shape: "unknown", texture: "unknown", lineDensity: "unknown" },
  thumb: { length: "unknown", angle: "unknown", firstPhalange: "unknown", secondPhalange: "unknown" },
  fingers: { length: "unknown", tips: "unknown", setting: "unknown" },
  mounts: {
    jupiter: { prominence: "unknown" },
    saturn: { prominence: "unknown" },
    sun: { prominence: "unknown" },
    mercury: { prominence: "unknown" },
    venus: { prominence: "unknown" },
    moon: { prominence: "unknown" },
    mars: { prominence: "unknown" },
  },
  lines: {
    life: { visible: false, depth: "faint", clarity: "broken", forkDirection: "unknown", endFork: false },
    head: { visible: false, clarity: "broken", direction: "unknown" },
    heart: { visible: false, clarity: "broken", ending: "unknown" },
    saturn: { visible: false },
    sun: { visible: false },
    mercury: { visible: false },
    travel: { visible: false },
    intuition: { visible: false },
  },
  signs: {
    island: false,
    cross: false,
    square: false,
    star: false,
    triangle: false,
    grille: false,
    fork: false,
    branch: false,
    break: false,
  },
};

export function fallbackPalmVisionResult(warning = "AI vision provider is not configured"): PalmVisionResult {
  return {
    imageQuality: normalizePalmImageQuality({ score: 0, canAnalyze: false, canAnalyzeFingerprints: false, issues: [warning] }),
    detectedHand: { handSide: "unknown", orientation: "unknown" },
    features: UNKNOWN_FEATURES,
    featureConfidence: {},
    uncertainFeatures: ["all"],
    warnings: [warning],
  };
}

function extractJson(text: string) {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const candidate = fenced?.[1] ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object found in vision response");
  return candidate.slice(start, end + 1);
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

function mapValue(value: unknown, aliases: Record<string, string>) {
  return typeof value === "string" ? aliases[value] ?? value : value;
}

function bool(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function num01(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 20) : [];
}

function normalizeFeatureConfidence(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key.length < 80)
      .map(([key, confidence]) => [key, num01(confidence)]),
  );
}

export function sanitizePalmVisionResult(raw: unknown): PalmVisionResult {
  const input = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const rawFeatures = input.features && typeof input.features === "object" ? input.features as Record<string, unknown> : {};
  const palm = rawFeatures.palm && typeof rawFeatures.palm === "object" ? rawFeatures.palm as Record<string, unknown> : {};
  const thumb = rawFeatures.thumb && typeof rawFeatures.thumb === "object" ? rawFeatures.thumb as Record<string, unknown> : {};
  const fingers = rawFeatures.fingers && typeof rawFeatures.fingers === "object" ? rawFeatures.fingers as Record<string, unknown> : {};
  const mounts = rawFeatures.mounts && typeof rawFeatures.mounts === "object" ? rawFeatures.mounts as Record<string, unknown> : {};
  const lines = rawFeatures.lines && typeof rawFeatures.lines === "object" ? rawFeatures.lines as Record<string, unknown> : {};
  const signs = rawFeatures.signs && typeof rawFeatures.signs === "object" ? rawFeatures.signs as Record<string, unknown> : {};

  const normalizedMounts = Object.fromEntries(MOUNT_KEYS.map((key) => {
    const mount = mounts[key] && typeof mounts[key] === "object" ? mounts[key] as Record<string, unknown> : {};
    return [key, { prominence: pick(mount.prominence, PROMINENCE_VALUES, "unknown") }];
  })) as PalmAnalyzeInput["features"]["mounts"];

  const lineObject = (key: LineKey) => lines[key] && typeof lines[key] === "object" ? lines[key] as Record<string, unknown> : {};
  const normalizedSigns = Object.fromEntries(SIGN_KEYS.map((key) => [key, bool(signs[key])])) as PalmAnalyzeInput["features"]["signs"];
  const quality = input.imageQuality && typeof input.imageQuality === "object" ? input.imageQuality as Partial<PalmImageQuality> : {};
  const detectedHand = input.detectedHand && typeof input.detectedHand === "object" ? input.detectedHand as Record<string, unknown> : {};

  return {
    imageQuality: normalizePalmImageQuality({
      score: num01(quality.score),
      canAnalyze: typeof quality.canAnalyze === "boolean" ? quality.canAnalyze : num01(quality.score) >= 0.35,
      canAnalyzeFingerprints: Boolean(quality.canAnalyzeFingerprints) && num01(quality.score) >= 0.9,
      issues: stringArray(quality.issues),
    }),
    detectedHand: {
      handSide: pick(detectedHand.handSide, HAND_SIDE_VALUES, "unknown"),
      orientation: pick(detectedHand.orientation, ORIENTATION_VALUES, "unknown"),
    },
    features: {
      palm: {
        shape: pick(mapValue(palm.shape, { long: "rectangular", broad: "square" }), PALM_SHAPE_VALUES, "unknown"),
        texture: pick(mapValue(palm.texture, { hard: "firm" }), TEXTURE_VALUES, "unknown"),
        lineDensity: pick(palm.lineDensity, LINE_DENSITY_VALUES, "unknown"),
      },
      thumb: {
        length: pick(thumb.length, LENGTH_VALUES, "unknown"),
        angle: pick(thumb.angle, THUMB_ANGLE_VALUES, "unknown"),
        firstPhalange: pick(thumb.firstPhalange, LENGTH_VALUES, "unknown"),
        secondPhalange: pick(thumb.secondPhalange, LENGTH_VALUES, "unknown"),
      },
      fingers: {
        length: pick(fingers.length, LENGTH_VALUES, "unknown"),
        tips: pick(mapValue(fingers.tips, { pointed: "conic" }), FINGER_TIP_VALUES, "unknown"),
        setting: pick(mapValue(fingers.setting, { high: "balanced" }), FINGER_SETTING_VALUES, "unknown"),
      },
      mounts: normalizedMounts,
      lines: {
        life: {
          visible: bool(lineObject("life").visible),
          depth: pick(lineObject("life").depth, DEPTH_VALUES, "faint"),
          clarity: pick(lineObject("life").clarity, CLARITY_VALUES, "broken"),
          forkDirection: pick(mapValue(lineObject("life").forkDirection, { venus: "downward", center: "upward" }), FORK_DIRECTION_VALUES, "unknown"),
          endFork: bool(lineObject("life").endFork),
        },
        head: {
          visible: bool(lineObject("head").visible),
          clarity: pick(lineObject("head").clarity, CLARITY_VALUES, "broken"),
          direction: pick(mapValue(lineObject("head").direction, { mars: "straight" }), HEAD_DIRECTION_VALUES, "unknown"),
        },
        heart: {
          visible: bool(lineObject("heart").visible),
          clarity: pick(lineObject("heart").clarity, CLARITY_VALUES, "broken"),
          ending: pick(mapValue(lineObject("heart").ending, { between_jupiter_saturn: "between", mercury: "unknown" }), HEART_ENDING_VALUES, "unknown"),
        },
        saturn: { visible: bool(lineObject("saturn").visible) },
        sun: { visible: bool(lineObject("sun").visible) },
        mercury: { visible: bool(lineObject("mercury").visible) },
        travel: { visible: bool(lineObject("travel").visible) },
        intuition: { visible: bool(lineObject("intuition").visible) },
      },
      signs: normalizedSigns,
    },
    featureConfidence: normalizeFeatureConfidence(input.featureConfidence),
    uncertainFeatures: stringArray(input.uncertainFeatures),
    warnings: stringArray(input.warnings),
  };
}

export async function extractPalmFeaturesWithGemini(base64: string, mime: string): Promise<PalmVisionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallbackPalmVisionResult();

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [
          { text: PALM_VISION_PROMPT },
          { inline_data: { mime_type: mime === "image/jpg" ? "image/jpeg" : mime, data: base64 } },
        ],
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Gemini palm vision error");
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") throw new Error("Empty palm vision response");

  try {
    return sanitizePalmVisionResult(JSON.parse(extractJson(text)));
  } catch {
    return fallbackPalmVisionResult("AI vision returned malformed feature JSON");
  }
}
