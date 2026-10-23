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
    <div
      className="relative group transition-all duration-200 border rounded-xl p-4 sm:p-5"
      style={{
        background: "var(--app-card)",
        borderColor: "var(--app-border)",
      }}
    >
      {/* Top Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Date Stamp */}
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded border"
            style={{
              background: "color-mix(in srgb, var(--app-gold) 12%, transparent)",
              borderColor: "color-mix(in srgb, var(--app-gold) 25%, transparent)",
              color: "var(--app-gold)",
            }}
          >
            {formatForecastDate(culminationDate)}
          </span>
          <span className="text-[11px]" style={{ color: "var(--app-muted)" }}>
            {formatForecastTime(culminationDate)}
          </span>
          {relativeDays && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
              style={{
                background: "var(--app-card-alt)",
                borderColor: "var(--app-border)",
                color: "var(--app-soft)",
              }}
            >
              {relativeDays}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {event.relevanceTier === "primary" && (
            <span
              className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border"
              style={{
                background: "color-mix(in srgb, var(--app-gold) 20%, transparent)",
                borderColor: "color-mix(in srgb, var(--app-gold) 50%, transparent)",
                color: "var(--app-gold)",
              }}
            >
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
          <h3
            className="text-base sm:text-lg font-serif font-bold transition-colors"
            style={{ color: "var(--app-fg)" }}
          >
            {event.title}
          </h3>

          {/* Retrograde Multi-Pass Badge */}
          {event.retrogradeInfo && (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                event.retrogradeInfo.isRetrograde
                  ? "bg-amber-500/15 text-amber-500 border-amber-500/40"
                  : "bg-sky-500/15 text-sky-400 border-sky-500/40"
              }`}
            >
              Pass {event.retrogradeInfo.passNumber}: {event.retrogradeInfo.isRetrograde ? "Vakri (Retrograde)" : "Direct"}
            </span>
          )}
        </div>

        {/* Orb or Culmination Type */}
        <div className="text-[11px] font-mono" style={{ color: "var(--app-muted)" }}>
          {event.timing.exactAt ? (
            <span className="text-emerald-500 font-bold">Exact 0°00&apos; Peak</span>
          ) : (
            <span>Orb: {orbStr}</span>
          )}
        </div>
      </div>

      {/* Headline Narrative */}
      <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: "var(--app-soft)" }}>
        {event.headline}
      </p>

      {/* Bottom Row: Life Areas + Evidence CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t" style={{ borderColor: "var(--app-border)" }}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--app-muted)" }}>Spheres:</span>
          {event.lifeAreas.map((area) => (
            <span
              key={area}
              className="text-[11px] px-2 py-0.5 rounded border"
              style={{
                background: "var(--app-card-alt)",
                borderColor: "var(--app-border)",
                color: "var(--app-soft)",
              }}
            >
              {area.charAt(0).toUpperCase() + area.slice(1)}
            </span>
          ))}
          {event.natalHouse && (
            <span
              className="text-[11px] px-2 py-0.5 rounded border"
              style={{
                background: "color-mix(in srgb, var(--app-gold) 12%, transparent)",
                borderColor: "color-mix(in srgb, var(--app-gold) 25%, transparent)",
                color: "var(--app-gold)",
              }}
            >
              House {event.natalHouse}
            </span>
          )}
        </div>

        {/* Kyu aur Kaise Drawer Opener */}
        <button
          onClick={() => onOpenDetails(event)}
          className="text-xs font-semibold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 border"
          style={{
            background: "color-mix(in srgb, var(--app-gold) 12%, transparent)",
            borderColor: "color-mix(in srgb, var(--app-gold) 28%, transparent)",
            color: "var(--app-gold)",
          }}
        >
          <span>Evidence & Shastra</span>
          <span>✦</span>
        </button>
      </div>
    </div>
  );
};

