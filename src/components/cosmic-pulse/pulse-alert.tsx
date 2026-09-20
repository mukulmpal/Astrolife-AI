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
        <div className="text-xl serif text-[#f0e8d0] font-semibold">
          Quiet Celestial Current · Balanced Alignment
        </div>
        <div className="text-sm text-[#c8c0a8] mt-2 leading-relaxed max-w-2xl">
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
          <span className="text-2xl font-serif font-bold text-[#f0e8d0] tracking-wide">
            {planetPair}
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#c8a030] bg-[#c8a030]/10 border border-[#c8a030]/20 px-2.5 py-0.5 rounded">
            {trigger.evidence.aspectType.replace(/Pratikool/gi, "Pattern")}
          </span>
        </div>
        <div className="text-xs text-[#a098c0]">
          Orb distance: <span className="text-[#f0e8d0] font-mono">{orbStr}</span>
        </div>
      </div>

      <div className="text-base text-[#e2d8c0] font-medium leading-relaxed">
        {trigger.headline}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8e88b8]">
        {trigger.activatedHouses && trigger.activatedHouses.length > 0 && (
          <div>
            <span className="text-[#605890]">Activated Houses:</span>{" "}
            <span className="text-[#c8c0a8] font-mono">
              {trigger.activatedHouses.map((h) => `H${h}`).join(" ↔ ")}
            </span>
          </div>
        )}
        {trigger.lifeAreas.length > 0 && (
          <div>
            <span className="text-[#605890]">Focus Domain:</span>{" "}
            <span className="text-[#c8a030]">{lifeAreasFormatted}</span>
          </div>
        )}
      </div>

      {trigger.supportingSignals && trigger.supportingSignals.length > 0 && (
        <div className="bg-[#0a0720]/80 border border-[#1c1840] rounded-xl p-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#a098c0] mb-1.5 flex items-center gap-1.5">
            <span>✦</span> Supporting Signals (Trigger Fusion):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trigger.supportingSignals.map((signal, idx) => (
              <span
                key={idx}
                className="text-[11px] text-[#c8c0a8] bg-[#1c1840]/60 border border-[#1c1840] px-2 py-0.5 rounded-md"
              >
                • {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="bg-[#0a0720]/70 border border-[#1c1840] rounded-xl p-3 text-xs leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#4ade80] font-semibold mb-1">
            <span>✓</span> Action Strategy
          </div>
          <div className="text-[#c8c0a8]">{trigger.action}</div>
        </div>

        {trigger.precaution && (
          <div className="bg-[#0a0720]/70 border border-[#1c1840] rounded-xl p-3 text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#fbbf24] font-semibold mb-1">
              <span>⚠</span> Conscious Precaution
            </div>
            <div className="text-[#c8c0a8]">{trigger.precaution}</div>
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onOpenEvidence}
          className="group inline-flex items-center gap-2 text-xs font-semibold text-[#c8a030] hover:text-[#ffd700] transition-colors py-1.5 px-3 rounded-lg bg-[#c8a030]/10 hover:bg-[#c8a030]/15 border border-[#c8a030]/25"
        >
          <span>{isEvidenceOpen ? "▲ Close Evidence & Shastra" : "▼ Why is this active? (Astronomical & Shastra Evidence)"}</span>
        </button>
      </div>
    </div>
  );
};

