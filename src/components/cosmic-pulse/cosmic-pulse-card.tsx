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
  const [activeTab, setActiveTab] = useState<"alert" | "timing" | "balance" | "remedy">("alert");

  return (
    <div
      className="card mb-6 transition-all duration-300"
      style={{
        background: "var(--app-card, #FFFFFF)",
        border: "1px solid var(--app-border, rgba(184,134,11,0.2))",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="card-tag" style={{ color: "var(--app-gold, #c8a030)" }}>
            ✦ Cosmic Pulse Intelligence
          </div>
          <h2
            className="text-xl sm:text-2xl font-serif font-bold tracking-tight mt-0.5"
            style={{ color: "var(--app-fg, #1A1A1A)" }}
          >
            Personal Planetary Radar
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 border font-mono"
            style={{
              background: "var(--app-card-alt, #09071a)",
              borderColor: "var(--app-border, rgba(184,134,11,0.2))",
              color: "var(--app-soft, #4A4238)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Vedic Shastra Live</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-4">
        <PulseStatus
          dominantTrigger={pulse.dominantTrigger}
          dashaMilestone={pulse.dashaMilestone}
        />
      </div>

      {/* Clean Tabs (LalKitab / Yoga Engine Style) */}
      <div className="tabs" style={{ marginBottom: 18 }}>
        <button
          onClick={() => setActiveTab("alert")}
          className={`tab ${activeTab === "alert" ? "active" : ""}`}
        >
          ⚡ Dominant Aspect
        </button>
        <button
          onClick={() => setActiveTab("timing")}
          className={`tab ${activeTab === "timing" ? "active" : ""}`}
        >
          ⏱️ Shubh Timing
        </button>
        <button
          onClick={() => setActiveTab("balance")}
          className={`tab ${activeTab === "balance" ? "active" : ""}`}
        >
          🌙 Moon & Tara Bala
        </button>
        <button
          onClick={() => setActiveTab("remedy")}
          className={`tab ${activeTab === "remedy" ? "active" : ""}`}
        >
          🪔 Vedic Upaya
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-1">
        {activeTab === "alert" && (
          <PulseAlert
            trigger={pulse.dominantTrigger}
            onOpenEvidence={() => setIsEvidenceOpen((prev) => !prev)}
            isEvidenceOpen={isEvidenceOpen}
          />
        )}

        {activeTab === "timing" && (
          <PulseTiming timing={pulse.microTiming} />
        )}

        {activeTab === "balance" && (
          <PulseBalance
            taraBala={pulse.taraBala}
            chandraBala={pulse.chandraBala}
          />
        )}

        {activeTab === "remedy" && (
          <PulseRemedy
            behavioralReset={pulse.microRemedy.behavioralReset}
            traditionalUpaya={pulse.microRemedy.traditionalUpaya}
            durationMinutes={pulse.microRemedy.durationMinutes}
          />
        )}
      </div>

      {/* Collapsible Evidence & Vedic Learning Drawer */}
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

