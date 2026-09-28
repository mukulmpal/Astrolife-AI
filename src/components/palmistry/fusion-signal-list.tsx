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
    <div className="rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] p-4">
      <h4 className="text-sm font-semibold text-[#1A1A1A]">{title}</h4>
      <div className="mt-3 space-y-2">
        {signals.slice(0, 6).map((signal) => (
          <div key={signal.id} className="rounded-xl border border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#8C827A]">{SOURCE_LABELS[signal.source]}</div>
                <div className="mt-1 text-sm font-medium text-[#1A1A1A]">{signal.title}</div>
              </div>
              <span className="rounded-full border border-[rgba(184,134,11,0.18)] px-2 py-1 text-[10px] text-[#6B635B]">
                {Math.round(signal.strength * 100)}%
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#6B635B]">{signal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
