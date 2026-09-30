import React from "react";
import type { TaraBalaModifier, ChandraBalaModifier } from "@/lib/astro-engine/cosmic-pulse/types";

interface PulseBalanceProps {
  taraBala: TaraBalaModifier;
  chandraBala: ChandraBalaModifier;
}

export const PulseBalance: React.FC<PulseBalanceProps> = ({
  taraBala,
  chandraBala,
}) => {
  const isTaraSupportive = taraBala.quality === "supportive";
  const isTaraCaution = taraBala.quality === "caution";

  return (
    <div className="pt-1">
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[10px] uppercase tracking-wider font-semibold font-mono"
          style={{ color: "var(--app-muted, #94a3b8)" }}
        >
          Personal Modifiers · Nativity Filter
        </div>
        <div className="text-[10px] italic" style={{ color: "var(--app-muted, #94a3b8)" }}>
          Filters macro transit through your birth Moon
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tara Bala */}
        <div
          className="rounded-xl p-4 border"
          style={{ background: "var(--app-card-alt, #09071a)", borderColor: "var(--app-border, #1c1840)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: "var(--app-fg, #ffffff)" }}>
              {taraBala.name} Tara <span className="text-xs font-mono font-normal" style={{ color: "var(--app-muted, #94a3b8)" }}>(T#{taraBala.number})</span>
            </span>
            <span
              className={`text-[10px] font-medium font-mono uppercase px-2.5 py-0.5 rounded-full ${
                isTaraSupportive
                  ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/35"
                  : isTaraCaution
                  ? "text-amber-400 bg-amber-500/15 border border-amber-500/35"
                  : "text-sky-400 bg-sky-500/15 border border-sky-500/35"
              }`}
            >
              {isTaraSupportive ? "Supportive" : isTaraCaution ? "Cautionary" : "Neutral"}
            </span>
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.6" }}>
            {taraBala.guidance}
          </div>
          <div className="text-[11px] mt-2.5 font-mono font-semibold" style={{ color: "var(--app-gold, #f5c842)" }}>
            ✦ {taraBala.birthNakshatra} (Birth) → {taraBala.transitNakshatra} (Transit)
          </div>
        </div>

        {/* Chandra Bala */}
        <div
          className="rounded-xl p-4 border"
          style={{ background: "var(--app-card-alt, #09071a)", borderColor: "var(--app-border, #1c1840)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: "var(--app-fg, #ffffff)" }}>
              Chandra Bala <span className="text-xs font-mono font-normal" style={{ color: "var(--app-muted, #94a3b8)" }}>({chandraBala.houseFromNatalMoon}th House)</span>
            </span>
            <span
              className={`text-[10px] font-medium font-mono uppercase px-2.5 py-0.5 rounded-full ${
                chandraBala.isAshtamaChandra
                  ? "text-rose-400 bg-rose-500/15 border border-rose-500/35"
                  : chandraBala.isSupportive
                  ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/35"
                  : "text-amber-400 bg-amber-500/15 border border-amber-500/35"
              }`}
            >
              {chandraBala.isAshtamaChandra
                ? "Ashtama (Rest)"
                : chandraBala.isSupportive
                ? "Supportive"
                : "Mindful"}
            </span>
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--app-soft, #cbd5e1)", lineHeight: "1.6" }}>
            {chandraBala.guidance}
          </div>
          <div className="text-[11px] mt-2.5 font-mono font-semibold" style={{ color: "var(--app-gold, #f5c842)" }}>
            ✦ Transit in {chandraBala.transitMoonSign} from Natal {chandraBala.natalMoonSign}
          </div>
        </div>
      </div>
    </div>
  );
};

