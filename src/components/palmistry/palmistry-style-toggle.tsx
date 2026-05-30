"use client";

import type { PalmReportStyle } from "@/lib/palmistry/types";

const STYLES: Array<{ id: PalmReportStyle; label: string }> = [
  { id: "classical", label: "Classical Samudrik" },
  { id: "scientific", label: "Scientific Psychological" },
  { id: "luxury", label: "Luxury AstroLife" },
];

export function PalmistryStyleToggle({ value, onChange }: { value: PalmReportStyle; onChange: (style: PalmReportStyle) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STYLES.map((style) => (
        <button
          key={style.id}
          type="button"
          onClick={() => onChange(style.id)}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            value === style.id ? "border-[#c8a030]/60 bg-[#c8a030]/15 text-[#e6c869]" : "border-white/10 bg-white/[0.03] text-white/55 hover:text-white"
          }`}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}
