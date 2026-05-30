"use client";

import { useState } from "react";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { DEFAULT_MANUAL_FEATURES, PalmFeatureForm } from "./palm-feature-form";
import { PalmistryReportView } from "./palmistry-report";
import { PalmistryStyleToggle } from "./palmistry-style-toggle";
import { PalmistryUpload } from "./palmistry-upload";
import type { DominantHand, HandSide, PalmAnalyzeInput, PalmReportStyle, PalmRuleReport } from "@/lib/palmistry/types";

export function ManualPalmistryWorkbench() {
  const [style, setStyle] = useState<PalmReportStyle>("luxury");
  const [handSide, setHandSide] = useState<HandSide>("right");
  const [dominantHand, setDominantHand] = useState<DominantHand>("right");
  const [features, setFeatures] = useState<PalmAnalyzeInput["features"]>(DEFAULT_MANUAL_FEATURES);
  const [report, setReport] = useState<PalmRuleReport | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/palmistry/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handSide,
          dominantHand,
          reportStyle: style,
          imageQuality: { score: 0.86, canAnalyze: true, canAnalyzeFingerprints: false, issues: [] },
          features,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Manual palmistry analysis failed");
      setReport(json.result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8 space-y-5 rounded-3xl border border-[#c8a030]/20 bg-[radial-gradient(circle_at_70%_0%,rgba(200,160,48,0.12),transparent_34%),rgba(0,0,0,0.28)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a030]/25 bg-[#c8a030]/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#e6c869]">
            <BookOpen size={13} /> Phase 0 + 1 Rule Engine
          </div>
          <h2 className="mt-3 font-serif text-3xl text-white">Manual Feature Confirmation Report</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/55">
            Hybrid book-backed palmistry: structured features, multi-sign matching, confidence scoring, source IDs and safety guardrails.
          </p>
        </div>
        <PalmistryStyleToggle value={style} onChange={setStyle} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <PalmistryUpload onPreview={() => undefined} />
        <PalmFeatureForm handSide={handSide} dominantHand={dominantHand} features={features} onHandSide={setHandSide} onDominantHand={setDominantHand} onFeatures={setFeatures} />
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-[#c8a030]/40 bg-[#c8a030]/15 px-5 py-3 text-sm font-semibold text-[#e6c869] disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        Generate Book-backed Report
      </button>

      {report && <PalmistryReportView report={report} style={style} />}
    </section>
  );
}
