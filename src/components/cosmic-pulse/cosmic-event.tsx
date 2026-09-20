"use client";

import React from "react";
import type { CosmicForecastEvent } from "@/lib/astro-engine/cosmic-pulse/forecast/forecast-types";
import { formatForecastDate, formatForecastTime, formatRelativeDays, formatOrb, getSeverityStyle } from "./formatters";

interface CosmicEventProps {
  event: CosmicForecastEvent;
  onOpenDetails: (event: CosmicForecastEvent) => void;
}

export const CosmicEvent: React.FC<CosmicEventProps> = ({
  event,
  onOpenDetails,
}) => {
  const culminationDate = event.timing.exactAt || event.timing.peakAt || event.timing.contactAt;
  const relativeDays = formatRelativeDays(culminationDate);
  const orbStr = formatOrb(event.evidence.currentOrbDeg);
  const severityStyle = getSeverityStyle(event.severity);

  const isTransitHit = event.type === "transit_hit";
  const isDasha = event.type === "dasha_milestone";
  const isAspect = event.type === "planetary_aspect";

  return (
    <div className="relative group bg-[#0e0a29] hover:bg-[#130d36] transition-all duration-200 border border-[#201a4c] hover:border-[#c8a030]/40 rounded-xl p-4 sm:p-5">
      {/* Top Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Date Stamp */}
          <span className="text-xs font-mono font-bold text-[#c8a030] bg-[#c8a030]/10 border border-[#c8a030]/20 px-2.5 py-1 rounded">
            {formatForecastDate(culminationDate)}
          </span>
          <span className="text-[11px] text-[#a098c0]">
            {formatForecastTime(culminationDate)}
          </span>
          {relativeDays && (
            <span className="text-[11px] font-semibold text-[#8e88b8] bg-[#1a1444] px-2 py-0.5 rounded-full border border-[#282060]">
              {relativeDays}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {event.relevanceTier === "primary" && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#c8a030]/20 text-[#c8a030] border border-[#c8a030]/50">
              ✦ Primary
            </span>
          )}
          {/* Severity Badge */}
          <span
            className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: severityStyle.badgeBg,
              borderColor: severityStyle.badgeBorder,
              color: severityStyle.textColor,
            }}
          >
            {event.severity}
          </span>
        </div>
      </div>

      {/* Main Title & Aspect */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 mt-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#f0e8d0] group-hover:text-white transition-colors">
            {event.title}
          </h3>

          {/* Retrograde Multi-Pass Badge */}
          {event.retrogradeInfo && (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                event.retrogradeInfo.isRetrograde
                  ? "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/40"
                  : "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40"
              }`}
            >
              Pass {event.retrogradeInfo.passNumber}: {event.retrogradeInfo.isRetrograde ? "Vakri (Retrograde)" : "Direct"}
            </span>
          )}
        </div>

        {/* Orb or Culmination Type */}
        <div className="text-[11px] text-[#8e88b8] font-mono">
          {event.timing.exactAt ? (
            <span className="text-[#4ade80]">Exact 0°00' Peak</span>
          ) : (
            <span>Orb: {orbStr}</span>
          )}
        </div>
      </div>

      {/* Headline Narrative */}
      <p className="text-xs sm:text-sm text-[#c8c0a8] mt-1.5 leading-relaxed">
        {event.headline}
      </p>

      {/* Bottom Row: Life Areas + Evidence CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#1a1542]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[#605890]">Spheres:</span>
          {event.lifeAreas.map((area) => (
            <span
              key={area}
              className="text-[11px] text-[#b8b0d8] bg-[#16103c] border border-[#261e56] px-2 py-0.5 rounded"
            >
              {area.charAt(0).toUpperCase() + area.slice(1)}
            </span>
          ))}
          {event.natalHouse && (
            <span className="text-[11px] text-[#c8a030] bg-[#c8a030]/10 border border-[#c8a030]/20 px-2 py-0.5 rounded">
              House {event.natalHouse}
            </span>
          )}
        </div>

        {/* Kyu aur Kaise Drawer Opener */}
        <button
          onClick={() => onOpenDetails(event)}
          className="text-xs font-semibold text-[#c8a030] hover:text-[#e0c060] bg-[#1b1548] hover:bg-[#251d60] border border-[#c8a030]/30 hover:border-[#c8a030]/60 px-3 py-1 rounded-lg transition-all flex items-center gap-1.5"
        >
          <span>Evidence & Shastra</span>
          <span>✦</span>
        </button>
      </div>
    </div>
  );
};

