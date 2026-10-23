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
            value === style.id ? "border-[#c8a030]/60 bg-[#c8a030]/15 text-[#e6c869]" : "border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] text-[#6B635B] hover:text-[#1A1A1A]"
          }`}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}
