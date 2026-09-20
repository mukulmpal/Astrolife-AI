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
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1c1840]/60">
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
          <span className="text-[12px] text-[#a098c0] font-medium bg-[#0a0720]/80 border border-[#1c1840] px-2.5 py-1 rounded-full">
            {lifecycle.badge}
          </span>
        )}
      </div>

      {dashaMilestone && (
        <div className="text-[11px] text-[#e0b040] flex items-center gap-1.5 bg-[#c8a030]/10 border border-[#c8a030]/25 px-2.5 py-1 rounded-full">
          <span>⏳</span>
          <span className="font-medium">{dashaMilestone.headline}</span>
          <span className="text-[#8e88b8]">·</span>
          <span className="text-[#c8c0a8]">{dashaMilestone.daysRemaining} days left</span>
        </div>
      )}
    </div>
  );
};

