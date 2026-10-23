import React from "react";
import type { PulseTrigger } from "@/lib/astro-engine/cosmic-pulse/types";
import { formatOrb } from "./formatters";

interface PulseAlertProps {
  trigger: PulseTrigger | null;
  onOpenEvidence: () => void;
  isEvidenceOpen: boolean;
}

export const PulseAlert: React.FC<PulseAlertProps> = ({
  trigger,
  onOpenEvidence,
  isEvidenceOpen,
}) => {
  if (!trigger) {
    return (
      <div className="py-4">
        <div className="text-xl serif font-semibold" style={{ color: "var(--app-fg)" }}>
          Quiet Celestial Current · Balanced Alignment
        </div>
        <div className="text-sm mt-2 leading-relaxed max-w-2xl" style={{ color: "var(--app-soft)" }}>
          No harsh planetary oppositions or conflicting special aspects are dominating your chart right now. 
          Use this window for steady momentum, constructive discipline, and foundational progress.
        </div>
      </div>
    );
  }

  const orbStr = formatOrb(trigger.evidence.currentOrbDeg);
  const planetPair = trigger.primaryPlanets.join(" ↔ ");
  const lifeAreasFormatted = trigger.lifeAreas
    .map((a) => a.charAt(0).toUpperCase() + a.slice(1))
    .join(" · ");

  return (
    <div className="py-2 space-y-4">
      {/* Top Main Planet Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border"
        style={{ background: "var(--app-card-alt, #09071a)", borderColor: "var(--app-border, #FFFFFF)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-serif font-semibold tracking-wide" style={{ color: "var(--app-fg, #ffffff)" }}>
            {planetPair}
          </span>
          <span
            className="text-[13px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border font-mono"
            style={{
              background: "rgba(245,200,66,0.15)",
              borderColor: "rgba(245,200,66,0.35)",
              color: "var(--app-gold, #f5c842)",
            }}
          >
            {trigger.evidence.aspectType.replace(/Pratikool/gi, "Pattern")}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span style={{ color: "var(--app-muted, #94a3b8)" }}>
            Orb: <strong className="font-mono" style={{ color: "var(--app-fg, #ffffff)" }}>{orbStr}</strong>
          </span>
          {trigger.lifeAreas.length > 0 && (
            <span className="px-2.5 py-0.5 rounded border text-[13px] font-semibold"
              style={{ background: "rgba(245,200,66,0.1)", borderColor: "rgba(245,200,66,0.3)", color: "var(--app-gold, #f5c842)" }}
            >
              {lifeAreasFormatted}
            </span>
          )}
        </div>
      </div>

      {/* Main Core Headline - Lal Kitab / Yoga style highlight callout */}
      <div
        className="p-4 rounded-xl border text-[13px] leading-relaxed"
        style={{
          background: "linear-gradient(135deg, rgba(245,200,66,0.08), transparent)",
          borderColor: "rgba(245,200,66,0.25)",
          color: "var(--app-fg, #ffffff)",
        }}
      >
        <div className="text-[12px] uppercase font-mono tracking-wider font-semibold mb-1" style={{ color: "var(--app-gold, #f5c842)" }}>
          ✦ Celestial Impact
        </div>
        <div className="text-[13px] font-medium" style={{ color: "var(--app-fg, #ffffff)", lineHeight: "1.6" }}>
          {trigger.headline}
        </div>
      </div>

      {/* 2-Column Action vs Precaution Cards (Like Yoga remedies / impact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div
          className="rounded-xl p-4 text-xs leading-relaxed border"
          style={{ background: "var(--app-card-alt, #09071a)", borderColor: "rgba(34,197,94,0.3)" }}
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1.5 text-xs font-mono uppercase tracking-wider">
            <span>✓</span> Action Strategy
          </div>
          <div style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.6" }}>{trigger.action}</div>
        </div>

        {trigger.precaution && (
          <div
            className="rounded-xl p-4 text-xs leading-relaxed border"
            style={{ background: "var(--app-card-alt, #09071a)", borderColor: "rgba(245,158,11,0.3)" }}
          >
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1.5 text-xs font-mono uppercase tracking-wider">
              <span>⚠</span> Conscious Precaution
            </div>
            <div style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.6" }}>{trigger.precaution}</div>
          </div>
        )}
      </div>

      {/* Collapsible Evidence Trigger Button */}
      <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
        {trigger.activatedHouses && trigger.activatedHouses.length > 0 && (
          <div className="text-xs" style={{ color: "var(--app-muted, #94a3b8)" }}>
            Activated Houses: <span className="font-mono text-[#ffffff] font-semibold">{trigger.activatedHouses.map((h) => `H${h}`).join(" ↔ ")}</span>
          </div>
        )}
        <button
          type="button"
          onClick={onOpenEvidence}
          className="inline-flex items-center gap-2 text-xs font-semibold py-1.5 px-3.5 rounded-lg border transition-all"
          style={{
            background: "rgba(245,200,66,0.12)",
            borderColor: "rgba(245,200,66,0.3)",
            color: "var(--app-gold, #f5c842)",
          }}
        >
          <span>{isEvidenceOpen ? "▲ Hide Shastric Proofs" : "▼ Shastric Proof & Evidence"}</span>
        </button>
      </div>
    </div>
  );
};

