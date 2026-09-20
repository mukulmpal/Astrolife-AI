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
    <div className="py-4 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-serif font-bold tracking-wide" style={{ color: "var(--app-fg)" }}>
            {planetPair}
          </span>
          <span
            className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded border"
            style={{
              background: "color-mix(in srgb, var(--app-gold) 12%, transparent)",
              borderColor: "color-mix(in srgb, var(--app-gold) 25%, transparent)",
              color: "var(--app-gold)",
            }}
          >
            {trigger.evidence.aspectType.replace(/Pratikool/gi, "Pattern")}
          </span>
        </div>
        <div className="text-xs" style={{ color: "var(--app-muted)" }}>
          Orb distance: <span className="font-mono font-bold" style={{ color: "var(--app-fg)" }}>{orbStr}</span>
        </div>
      </div>

      <div className="text-base font-medium leading-relaxed" style={{ color: "var(--app-fg)" }}>
        {trigger.headline}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {trigger.activatedHouses && trigger.activatedHouses.length > 0 && (
          <div>
            <span style={{ color: "var(--app-muted)" }}>Activated Houses:</span>{" "}
            <span className="font-mono" style={{ color: "var(--app-soft)" }}>
              {trigger.activatedHouses.map((h) => `H${h}`).join(" ↔ ")}
            </span>
          </div>
        )}
        {trigger.lifeAreas.length > 0 && (
          <div>
            <span style={{ color: "var(--app-muted)" }}>Focus Domain:</span>{" "}
            <span style={{ color: "var(--app-gold)" }}>{lifeAreasFormatted}</span>
          </div>
        )}
      </div>

      {trigger.supportingSignals && trigger.supportingSignals.length > 0 && (
        <div
          className="rounded-xl p-2.5 border"
          style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            style={{ color: "var(--app-muted)" }}
          >
            <span>✦</span> Supporting Signals (Trigger Fusion):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trigger.supportingSignals.map((signal, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md border"
                style={{
                  background: "color-mix(in srgb, var(--app-border) 40%, transparent)",
                  borderColor: "var(--app-border)",
                  color: "var(--app-soft)",
                }}
              >
                • {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div
          className="rounded-xl p-3 text-xs leading-relaxed border"
          style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
        >
          <div className="flex items-center gap-1.5 text-emerald-500 font-semibold mb-1">
            <span>✓</span> Action Strategy
          </div>
          <div style={{ color: "var(--app-soft)" }}>{trigger.action}</div>
        </div>

        {trigger.precaution && (
          <div
            className="rounded-xl p-3 text-xs leading-relaxed border"
            style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
          >
            <div className="flex items-center gap-1.5 text-amber-500 font-semibold mb-1">
              <span>⚠</span> Conscious Precaution
            </div>
            <div style={{ color: "var(--app-soft)" }}>{trigger.precaution}</div>
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onOpenEvidence}
          className="group inline-flex items-center gap-2 text-xs font-semibold transition-all py-1.5 px-3 rounded-lg border"
          style={{
            background: "color-mix(in srgb, var(--app-gold) 10%, transparent)",
            borderColor: "color-mix(in srgb, var(--app-gold) 28%, transparent)",
            color: "var(--app-gold)",
          }}
        >
          <span>{isEvidenceOpen ? "▲ Close Evidence & Shastra" : "▼ Why is this active? (Astronomical & Shastra Evidence)"}</span>
        </button>
      </div>
    </div>
  );
};

