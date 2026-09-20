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
    <div className="pt-3 border-t border-[#1c1840]/60">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8e88b8]">
          Personal Modifiers · Nativity Filter
        </div>
        <div className="text-[10px] text-[#605890] italic">
          Filters macro transit through your birth Moon
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tara Bala */}
        <div className="bg-[#0a0720]/60 border border-[#1c1840] rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#f0e8d0]">
              {taraBala.name} Tara (T#{taraBala.number})
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                isTaraSupportive
                  ? "text-[#4ade80] bg-[#22c55e]/10 border border-[#22c55e]/25"
                  : isTaraCaution
                  ? "text-[#fbbf24] bg-[#f59e0b]/10 border border-[#f59e0b]/25"
                  : "text-[#93c5fd] bg-[#3b82f6]/10 border border-[#3b82f6]/25"
              }`}
            >
              {isTaraSupportive ? "Supportive" : isTaraCaution ? "Cautionary" : "Neutral"}
            </span>
          </div>
          <div className="text-[11px] text-[#a098c0] leading-snug">
            {taraBala.guidance}
          </div>
          <div className="text-[10px] text-[#605890] mt-1.5 font-mono">
            {taraBala.birthNakshatra} (Birth) → {taraBala.transitNakshatra} (Transit)
          </div>
        </div>

        {/* Chandra Bala */}
        <div className="bg-[#0a0720]/60 border border-[#1c1840] rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#f0e8d0]">
              Chandra Bala ({chandraBala.houseFromNatalMoon}th House)
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                chandraBala.isAshtamaChandra
                  ? "text-[#f87171] bg-[#ef4444]/10 border border-[#ef4444]/25"
                  : chandraBala.isSupportive
                  ? "text-[#4ade80] bg-[#22c55e]/10 border border-[#22c55e]/25"
                  : "text-[#fbbf24] bg-[#f59e0b]/10 border border-[#f59e0b]/25"
              }`}
            >
              {chandraBala.isAshtamaChandra
                ? "Ashtama Chandra (Rest)"
                : chandraBala.isSupportive
                ? "Supportive"
                : "Gentle Handling"}
            </span>
          </div>
          <div className="text-[11px] text-[#a098c0] leading-snug">
            {chandraBala.guidance}
          </div>
          <div className="text-[10px] text-[#605890] mt-1.5 font-mono">
            Moon in {chandraBala.transitMoonSign} from Natal {chandraBala.natalMoonSign}
          </div>
        </div>
      </div>
    </div>
  );
};

