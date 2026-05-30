"use client";

import { useState } from "react";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { DEFAULT_MANUAL_FEATURES, PalmFeatureForm } from "./palm-feature-form";
import { PalmistryFeedback } from "./palmistry-feedback";
import { PalmistryFusionButton } from "./palmistry-fusion-button";
import { PalmistryReportView } from "./palmistry-report";
import { PalmistrySaveButton } from "./palmistry-save-button";
import { PalmistryStyleToggle } from "./palmistry-style-toggle";
import { PalmistryUpload } from "./palmistry-upload";
import type { DominantHand, HandSide, PalmAnalyzeInput, PalmReportStyle, PalmRuleReport, PalmVisionResult } from "@/lib/palmistry/types";

export function ManualPalmistryWorkbench() {
  const [style, setStyle] = useState<PalmReportStyle>("luxury");
  const [handSide, setHandSide] = useState<HandSide>("right");
  const [dominantHand, setDominantHand] = useState<DominantHand>("right");
  const [features, setFeatures] = useState<PalmAnalyzeInput["features"]>(DEFAULT_MANUAL_FEATURES);
  const [report, setReport] = useState<PalmRuleReport | null>(null);
  const [reportInput, setReportInput] = useState<PalmAnalyzeInput | null>(null);
  const [reportRevision, setReportRevision] = useState(0);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [vision, setVision] = useState<PalmVisionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const applyVision = (result: PalmVisionResult) => {
    setVision(result);
    setFeatures(result.features);
    if (result.detectedHand.handSide !== "unknown") setHandSide(result.detectedHand.handSide);
  };

  const generate = async () => {
    setLoading(true);
    try {
      const input: PalmAnalyzeInput = {
        handSide,
        dominantHand,
        reportStyle: style,
        tier: "elite",
        imageQuality: vision?.imageQuality ?? { score: 0.86, canAnalyze: true, canAnalyzeFingerprints: false, issues: [] },
        features,
      };
      const res = await fetch("/api/palmistry/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Manual palmistry analysis failed");
      setReportInput(input);
      setReport(json.result);
      setReportRevision((value) => value + 1);
      setSavedSessionId(null);
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
        <div className="space-y-4">
          <PalmistryUpload onPreview={() => undefined} onExtracted={applyVision} />
          {vision && <VisionConfidenceCard vision={vision} />}
        </div>
        <PalmFeatureForm
          handSide={handSide}
          dominantHand={dominantHand}
          features={features}
          featureConfidence={vision?.featureConfidence}
          onHandSide={setHandSide}
          onDominantHand={setDominantHand}
          onFeatures={setFeatures}
        />
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

      {report && reportInput && (
        <div className="space-y-5">
          <PalmistryReportView report={report} style={style} />
          <PalmistryFusionButton
            palmResult={report}
            reportStyle={style}
            userTier="elite"
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <PalmistrySaveButton
              key={`save-${reportRevision}`}
              input={reportInput}
              result={report}
              imageUrl={null}
              onSaved={setSavedSessionId}
            />
            <PalmistryFeedback
              sessionId={savedSessionId}
              result={report}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function VisionConfidenceCard({ vision }: { vision: PalmVisionResult }) {
  return (
    <div className="rounded-2xl border border-[#c8a030]/20 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-[#e6c869]/75">AI Vision Confidence</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-lg font-semibold text-white">{Math.round(vision.imageQuality.score * 100)}%</div>
          <div className="text-[10px] text-white/45">Quality</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-lg font-semibold text-white">{vision.imageQuality.canAnalyze ? "Yes" : "No"}</div>
          <div className="text-[10px] text-white/45">Analyze</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-lg font-semibold text-white">{vision.imageQuality.canAnalyzeFingerprints ? "Yes" : "No"}</div>
          <div className="text-[10px] text-white/45">Prints</div>
        </div>
      </div>
      {[...vision.imageQuality.issues, ...vision.warnings].length > 0 && (
        <div className="mt-3 space-y-1">
          {[...vision.imageQuality.issues, ...vision.warnings].slice(0, 4).map((item) => (
            <p key={item} className="rounded-lg bg-[#c8a030]/10 px-3 py-2 text-xs text-white/60">{item}</p>
          ))}
        </div>
      )}
      {vision.uncertainFeatures.length > 0 && (
        <p className="mt-3 text-xs text-white/45">Uncertain: {vision.uncertainFeatures.slice(0, 6).join(", ")}</p>
      )}
    </div>
  );
}
