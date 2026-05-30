"use client";

import type { DominantHand, HandSide, PalmAnalyzeInput } from "@/lib/palmistry/types";

export const DEFAULT_MANUAL_FEATURES: PalmAnalyzeInput["features"] = {
  palm: { shape: "rectangular", texture: "supple", lineDensity: "many" },
  thumb: { length: "long", angle: "balanced", firstPhalange: "long", secondPhalange: "medium" },
  fingers: { length: "long", tips: "conic", setting: "balanced" },
  mounts: {
    jupiter: { prominence: "strong" },
    saturn: { prominence: "balanced" },
    sun: { prominence: "strong" },
    mercury: { prominence: "balanced" },
    venus: { prominence: "strong" },
    moon: { prominence: "strong" },
    mars: { prominence: "balanced" },
  },
  lines: {
    life: { visible: true, depth: "deep", clarity: "clear", endFork: true, forkDirection: "moon" },
    head: { visible: true, clarity: "clear", direction: "moon" },
    heart: { visible: true, clarity: "clear", ending: "jupiter" },
    saturn: { visible: true, clarity: "clear" },
    sun: { visible: true, clarity: "clear" },
    mercury: { visible: true, clarity: "clear" },
    travel: { visible: true },
    intuition: { visible: false },
  },
  signs: { island: false, cross: false, square: false, star: false, triangle: true, grille: false, fork: true, branch: true, break: false },
};

function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (value: T) => void }) {
  return (
    <label className="grid gap-1 text-xs text-white/55">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function PalmFeatureForm({
  handSide,
  dominantHand,
  features,
  onHandSide,
  onDominantHand,
  onFeatures,
}: {
  handSide: HandSide;
  dominantHand: DominantHand;
  features: PalmAnalyzeInput["features"];
  onHandSide: (value: HandSide) => void;
  onDominantHand: (value: DominantHand) => void;
  onFeatures: (value: PalmAnalyzeInput["features"]) => void;
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-[#c8a030]/20 bg-black/30 p-4 md:grid-cols-2">
      <SelectField label="Hand side" value={handSide} options={["right", "left", "both", "unknown"]} onChange={onHandSide} />
      <SelectField label="Dominant hand" value={dominantHand} options={["right", "left", "unknown"]} onChange={onDominantHand} />
      <SelectField label="Palm shape" value={features.palm.shape} options={["rectangular", "square", "conic", "spatulate", "mixed", "unknown"]} onChange={(shape) => onFeatures({ ...features, palm: { ...features.palm, shape } })} />
      <SelectField label="Line density" value={features.palm.lineDensity} options={["many", "balanced", "few", "unknown"]} onChange={(lineDensity) => onFeatures({ ...features, palm: { ...features.palm, lineDensity } })} />
      <SelectField label="Thumb length" value={features.thumb.length} options={["long", "medium", "short", "unknown"]} onChange={(length) => onFeatures({ ...features, thumb: { ...features.thumb, length } })} />
      <SelectField label="Thumb angle" value={features.thumb.angle} options={["balanced", "wide", "closed", "unknown"]} onChange={(angle) => onFeatures({ ...features, thumb: { ...features.thumb, angle } })} />
      <SelectField label="Finger length" value={features.fingers.length} options={["long", "medium", "short", "unknown"]} onChange={(length) => onFeatures({ ...features, fingers: { ...features.fingers, length } })} />
      <SelectField label="Finger tips" value={features.fingers.tips} options={["conic", "square", "spatulate", "mixed", "unknown"]} onChange={(tips) => onFeatures({ ...features, fingers: { ...features.fingers, tips } })} />
      <SelectField label="Jupiter mount" value={features.mounts.jupiter.prominence} options={["strong", "balanced", "weak", "unknown"]} onChange={(prominence) => onFeatures({ ...features, mounts: { ...features.mounts, jupiter: { prominence } } })} />
      <SelectField label="Moon mount" value={features.mounts.moon.prominence} options={["strong", "balanced", "weak", "unknown"]} onChange={(prominence) => onFeatures({ ...features, mounts: { ...features.mounts, moon: { prominence } } })} />
      <SelectField label="Life line clarity" value={features.lines.life.clarity ?? "clear"} options={["clear", "broken", "chained"]} onChange={(clarity) => onFeatures({ ...features, lines: { ...features.lines, life: { ...features.lines.life, clarity } } })} />
      <SelectField label="Heart line ending" value={features.lines.heart.ending ?? "jupiter"} options={["jupiter", "saturn", "between", "unknown"]} onChange={(ending) => onFeatures({ ...features, lines: { ...features.lines, heart: { ...features.lines.heart, ending } } })} />
    </div>
  );
}
