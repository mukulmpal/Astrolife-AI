import React, { useState } from "react";
import type { CosmicPulseResult } from "@/lib/astro-engine/cosmic-pulse/types";
import { PulseStatus } from "./pulse-status";
import { PulseAlert } from "./pulse-alert";
import { PulseTiming } from "./pulse-timing";
import { PulseBalance } from "./pulse-balance";
import { PulseRemedy } from "./pulse-remedy";
import { PulseEvidenceDrawer } from "./pulse-evidence-drawer";

interface CosmicPulseCardProps {
  pulse: CosmicPulseResult;
}

export const CosmicPulseCard: React.FC<CosmicPulseCardProps> = ({ pulse }) => {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border shadow-xl p-5 sm:p-6 mb-6 transition-colors duration-300"
      style={{
        background: "linear-gradient(135deg, var(--app-card), var(--app-card-alt))",
        borderColor: "var(--app-border-strong)",
      }}
    >
      {/* Background Subtle Radial Orb for Luxury Vedic Feel */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-15 blur-3xl -mr-20 -mt-20"
        style={{ background: "radial-gradient(circle, var(--app-gold) 0%, var(--al-violet, #7c3aed) 50%, transparent 80%)" }}
      />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <div
            className="text-[10px] tracking-[2px] uppercase font-bold flex items-center gap-1.5"
            style={{ color: "var(--app-gold)" }}
          >
            <span>✦</span> Cosmic Pulse Intelligence
          </div>
          <h2
            className="text-xl sm:text-2xl font-serif font-bold tracking-tight mt-0.5"
            style={{ color: "var(--app-fg)" }}
          >
            Personal Planetary Radar
          </h2>
        </div>
        <div
          className="text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 border"
          style={{
            background: "var(--app-card-alt)",
            borderColor: "var(--app-border)",
            color: "var(--app-soft)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Vedic Shastra Live</span>
        </div>
      </div>

      {/* Status Badges */}
      <PulseStatus
        dominantTrigger={pulse.dominantTrigger}
        dashaMilestone={pulse.dashaMilestone}
      />

      {/* Dominant Alert Section */}
      <PulseAlert
        trigger={pulse.dominantTrigger}
        onOpenEvidence={() => setIsEvidenceOpen((prev) => !prev)}
        isEvidenceOpen={isEvidenceOpen}
      />

      {/* Micro-Timing Row (Action vs Avoidance Windows) */}
      <PulseTiming timing={pulse.microTiming} />

      {/* Personal Modifiers (Tara Bala & Chandra Bala) */}
      <PulseBalance
        taraBala={pulse.taraBala}
        chandraBala={pulse.chandraBala}
      />

      {/* Practical Alignment & Upaya */}
      <PulseRemedy
        behavioralReset={pulse.microRemedy.behavioralReset}
        traditionalUpaya={pulse.microRemedy.traditionalUpaya}
        durationMinutes={pulse.microRemedy.durationMinutes}
      />

      {/* Collapsible Evidence & Vedic Learning Drawer ("Kyu aur Kaise") */}
      <PulseEvidenceDrawer
        trigger={pulse.dominantTrigger}
        taraBala={pulse.taraBala}
        chandraBala={pulse.chandraBala}
        timing={pulse.microTiming}
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
      />
    </div>
  );
};

