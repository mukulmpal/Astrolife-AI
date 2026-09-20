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
    <div className="pt-3 border-t" style={{ borderColor: "var(--app-border)" }}>
      <div className="flex items-center justify-between mb-2">
        <div
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--app-muted)" }}
        >
          Personal Modifiers · Nativity Filter
        </div>
        <div className="text-[10px] italic" style={{ color: "var(--app-muted)" }}>
          Filters macro transit through your birth Moon
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tara Bala */}
        <div
          className="rounded-xl p-3 border"
          style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: "var(--app-fg)" }}>
              {taraBala.name} Tara (T#{taraBala.number})
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                isTaraSupportive
                  ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/25"
                  : isTaraCaution
                  ? "text-amber-500 bg-amber-500/10 border border-amber-500/25"
                  : "text-sky-400 bg-sky-500/10 border border-sky-500/25"
              }`}
            >
              {isTaraSupportive ? "Supportive" : isTaraCaution ? "Cautionary" : "Neutral"}
            </span>
          </div>
          <div className="text-[11px] leading-snug" style={{ color: "var(--app-soft)" }}>
            {taraBala.guidance}
          </div>
          <div className="text-[10px] mt-1.5 font-mono" style={{ color: "var(--app-muted)" }}>
            {taraBala.birthNakshatra} (Birth) → {taraBala.transitNakshatra} (Transit)
          </div>
        </div>

        {/* Chandra Bala */}
        <div
          className="rounded-xl p-3 border"
          style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: "var(--app-fg)" }}>
              Chandra Bala ({chandraBala.houseFromNatalMoon}th House)
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                chandraBala.isAshtamaChandra
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/25"
                  : chandraBala.isSupportive
                  ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/25"
                  : "text-amber-500 bg-amber-500/10 border border-amber-500/25"
              }`}
            >
              {chandraBala.isAshtamaChandra
                ? "Ashtama Chandra (Rest)"
                : chandraBala.isSupportive
                ? "Supportive"
                : "Gentle Handling"}
            </span>
          </div>
          <div className="text-[11px] leading-snug" style={{ color: "var(--app-soft)" }}>
            {chandraBala.guidance}
          </div>
          <div className="text-[10px] mt-1.5 font-mono" style={{ color: "var(--app-muted)" }}>
            Moon in {chandraBala.transitMoonSign} from Natal {chandraBala.natalMoonSign}
          </div>
        </div>
      </div>
    </div>
  );
};

