"use client";

export function ConfidenceBadge({ value }: { value: number }) {
  const tone = value >= 75 ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : value >= 55 ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : "border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] text-[#6B635B]";
  return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${tone}`}>{value}% confidence</span>;
}
