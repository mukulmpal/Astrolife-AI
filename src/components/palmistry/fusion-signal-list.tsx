"use client";

import type { FusionSignal } from "@/lib/palmistry/fusion/fusion-types";

const SOURCE_LABELS: Record<FusionSignal["source"], string> = {
  palmistry: "Palm",
  kundli: "Kundli",
  dasha: "Dasha",
  numerology: "Numerology",
  transit: "Transit",
};

export function FusionSignalList({ title, signals }: { title: string; signals: FusionSignal[] }) {
  if (signals.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <div className="mt-3 space-y-2">
        {signals.slice(0, 6).map((signal) => (
          <div key={signal.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/38">{SOURCE_LABELS[signal.source]}</div>
                <div className="mt-1 text-sm font-medium text-white/88">{signal.title}</div>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/55">
                {Math.round(signal.strength * 100)}%
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/52">{signal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
