import React from "react";
import type { PulseTrigger, DashaMilestone } from "@/lib/astro-engine/cosmic-pulse/types";
import { getSeverityStyle, getLifecycleDetails } from "./formatters";

interface PulseStatusProps {
  dominantTrigger: PulseTrigger | null;
  dashaMilestone: DashaMilestone | null;
}

export const PulseStatus: React.FC<PulseStatusProps> = ({
  dominantTrigger,
  dashaMilestone,
}) => {
  const severityStyle = dominantTrigger
    ? getSeverityStyle(dominantTrigger.severity)
    : {
        badgeBg: "rgba(34, 197, 94, 0.15)",
        badgeBorder: "rgba(34, 197, 94, 0.4)",
        textColor: "#4ade80",
        label: "HARMONIC FLOW",
        glow: "rgba(34, 197, 94, 0.25)",
      };

  const lifecycle = dominantTrigger
    ? getLifecycleDetails(dominantTrigger.lifecycle, dominantTrigger.evidence.currentOrbDeg)
    : null;

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b"
      style={{ borderColor: "var(--app-border)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border"
          style={{
            background: severityStyle.badgeBg,
            borderColor: severityStyle.badgeBorder,
            color: severityStyle.textColor,
            boxShadow: `0 0 12px ${severityStyle.glow}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ background: severityStyle.textColor }} />
          {severityStyle.label}
        </span>

        {lifecycle && (
          <span
            className="text-[12px] font-medium px-2.5 py-1 rounded-full border"
            style={{
              background: "var(--app-card-alt)",
              borderColor: "var(--app-border)",
              color: "var(--app-soft)",
            }}
          >
            {lifecycle.badge}
          </span>
        )}
      </div>

      {dashaMilestone && (
        <div
          className="text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
          style={{
            background: "color-mix(in srgb, var(--app-gold) 12%, transparent)",
            borderColor: "color-mix(in srgb, var(--app-gold) 30%, transparent)",
            color: "var(--app-gold)",
          }}
        >
          <span>⏳</span>
          <span className="font-medium">{dashaMilestone.headline}</span>
          <span style={{ color: "var(--app-muted)" }}>·</span>
          <span style={{ color: "var(--app-soft)" }}>{dashaMilestone.daysRemaining} days left</span>
        </div>
      )}
    </div>
  );
};

