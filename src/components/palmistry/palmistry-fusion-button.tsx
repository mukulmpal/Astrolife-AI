"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { PalmistryFusionReport } from "./palmistry-fusion-report";
import type { AstroLifeFusionContext, AstroPalmFusionOutput } from "@/lib/palmistry/fusion/fusion-types";
import type { PremiumPalmReport } from "@/lib/palmistry/report/premium-report-builder";
import type { PalmReportStyle, PalmRuleReport, PalmRuleTier } from "@/lib/palmistry/types";

type FusionResponse = {
  ok: boolean;
  fusion?: AstroPalmFusionOutput;
  report?: PremiumPalmReport;
  error?: string;
};

export function PalmistryFusionButton({
  palmResult,
  reportStyle,
  userTier = "elite",
  astroContext,
  raw,
  birthData,
  rawAstroContext,
}: {
  palmResult: PalmRuleReport;
  reportStyle: PalmReportStyle;
  userTier?: PalmRuleTier;
  astroContext?: AstroLifeFusionContext;
  raw?: unknown;
  birthData?: unknown;
  rawAstroContext?: unknown;
}) {
  const [loading, setLoading] = useState(false);
  const [fusion, setFusion] = useState<AstroPalmFusionOutput | null>(null);
  const [report, setReport] = useState<PremiumPalmReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generateFusion() {
    try {
      setLoading(true);
      setError(null);

      const contextResponse = await fetch("/api/palmistry/build-fusion-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: rawAstroContext ?? raw ?? { birthData } }),
      });
      const contextJson = await contextResponse.json();
      if (!contextResponse.ok || !contextJson.ok) {
        throw new Error(contextJson.error ?? "Could not build fusion context.");
      }

      const premiumResponse = await fetch("/api/palmistry/premium-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          palmResult,
          astroContext: astroContext ?? contextJson.context as AstroLifeFusionContext,
          raw: rawAstroContext ?? raw,
          birthData,
          reportStyle,
          userTier,
        }),
      });
      const premiumJson = await premiumResponse.json() as FusionResponse;
      if (!premiumResponse.ok || !premiumJson.ok || !premiumJson.fusion || !premiumJson.report) {
        throw new Error(premiumJson.error ?? "Could not generate fusion report.");
      }

      setFusion(premiumJson.fusion);
      setReport(premiumJson.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fusion report failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
        <button
          type="button"
          onClick={generateFusion}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-300/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {fusion ? "Refresh AstroLife Fusion" : "Generate AstroLife Fusion"}
        </button>
        {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}
      </div>

      {fusion && report ? <PalmistryFusionReport fusion={fusion} report={report} /> : null}
    </div>
  );
}
