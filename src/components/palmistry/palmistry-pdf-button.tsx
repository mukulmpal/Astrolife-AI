"use client";

type PalmistryPdfButtonProps = {
  label?: string;
};

export function PalmistryPdfButton({ label = "Export / Save as PDF" }: PalmistryPdfButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl border border-amber-400/30 bg-amber-300 px-4 py-3 text-sm font-bold text-black transition hover:bg-amber-200 print:hidden"
    >
      {label}
    </button>
  );
}
