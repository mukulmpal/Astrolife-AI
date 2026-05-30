"use client";

import type { FusionInsight } from "@/lib/palmistry/fusion/fusion-types";

const AGREEMENT_LABELS: Record<FusionInsight["agreement"], string> = {
  strong_alignment: "Strong Alignment",
  partial_alignment: "Partial Alignment",
  mixed: "Mixed",
  contradictory: "Contradictory",
  palm_only: "Palm Only",
  astro_only: "Astro Only",
};

export function FusionConfidenceCard({ insight }: { insight: FusionInsight }) {
  const confidence = Math.round(insight.confidence * 100);

  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">{AGREEMENT_LABELS[insight.agreement]}</div>
          <h4 className="mt-1 font-serif text-xl text-white">{insight.title}</h4>
        </div>
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-cyan-200/30 bg-black/40 text-lg font-semibold text-cyan-100">
          {confidence}%
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cyan-300" style={{ width: `${confidence}%` }} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/62">{insight.summary}</p>
    </div>
  );
}
