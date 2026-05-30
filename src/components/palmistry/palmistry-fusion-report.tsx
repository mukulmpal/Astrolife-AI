"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { FusionConfidenceCard } from "./fusion-confidence-card";
import { FusionSignalList } from "./fusion-signal-list";
import type { AstroPalmFusionOutput, FusionTheme } from "@/lib/palmistry/fusion/fusion-types";
import type { PremiumPalmReport } from "@/lib/palmistry/report/premium-report-builder";

const THEME_LABELS: Record<FusionTheme, string> = {
  personality: "Personality",
  career: "Career",
  wealth: "Wealth",
  relationship: "Relationship",
  health_vitality: "Vitality",
  travel: "Travel",
  spirituality: "Spirituality",
  education: "Education",
  family: "Family",
  fame: "Fame",
};

const PRIORITY_THEMES: FusionTheme[] = ["career", "relationship", "travel", "wealth", "health_vitality"];

export function PalmistryFusionReport({
  fusion,
  report,
}: {
  fusion: AstroPalmFusionOutput;
  report: PremiumPalmReport;
}) {
  const priorityInsights = PRIORITY_THEMES
    .map((theme) => fusion.insights.find((insight) => insight.theme === theme))
    .filter((insight) => insight !== undefined);

  return (
    <section className="space-y-5 rounded-3xl border border-cyan-300/20 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.14),transparent_34%),rgba(0,0,0,0.3)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan-100">
            <Sparkles size={13} /> AstroLife Fusion
          </div>
          <h3 className="mt-3 font-serif text-3xl text-white">{report.title}</h3>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-white/62">{report.executiveSummary}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/62 lg:max-w-sm">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/70">Fusion Summary</div>
          <p className="mt-2 leading-relaxed">{fusion.overallSummary}</p>
        </div>
      </div>

      {fusion.missingContext.length > 0 ? (
        <div className="flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100/78">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-amber-100">Missing context</div>
            <p className="mt-1">Connect {fusion.missingContext.join(", ")} to unlock stronger Palm + Kundli + Dasha + Numerology alignment.</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {fusion.strongestThemes.map((theme) => (
          <span key={theme} className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
            {THEME_LABELS[theme]}
          </span>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {(priorityInsights.length > 0 ? priorityInsights : fusion.insights.slice(0, 5)).map((insight) => (
          <FusionConfidenceCard key={insight.id} insight={insight} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {fusion.insights.slice(0, 4).map((insight) => (
          <FusionSignalList
            key={`${insight.id}-signals`}
            title={`${THEME_LABELS[insight.theme]} Signal Stack`}
            signals={[
              ...insight.palmSignals,
              ...insight.astroSignals,
              ...insight.timingSignals,
              ...insight.numerologySignals,
            ]}
          />
        ))}
      </div>
    </section>
  );
}
