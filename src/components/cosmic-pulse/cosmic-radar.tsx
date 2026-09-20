"use client";

import React, { useState, useMemo } from "react";
import type { RadarHorizon, CosmicForecastEvent } from "@/lib/astro-engine/cosmic-pulse/forecast/forecast-types";
import type { PulseTrigger } from "@/lib/astro-engine/cosmic-pulse/types";
import { CosmicTimeline } from "./cosmic-timeline";
import { EventDetailDrawer } from "./event-detail-drawer";
import { formatOrb, getSeverityStyle } from "./formatters";

interface CosmicRadarProps {
  horizons: RadarHorizon;
  onOpenLiveEvidence?: () => void;
}

type HorizonTab = "now" | "next30" | "next90";
type FilterCategory = "all" | "transit_hit" | "planetary_aspect" | "dasha_milestone";
type RelevanceFilter = "all" | "primary" | "supporting";

export const CosmicRadar: React.FC<CosmicRadarProps> = ({
  horizons,
  onOpenLiveEvidence,
}) => {
  const [activeHorizon, setActiveHorizon] = useState<HorizonTab>("next30");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [activeRelevance, setActiveRelevance] = useState<RelevanceFilter>("all");
  const [selectedEvent, setSelectedEvent] = useState<CosmicForecastEvent | null>(null);

  // Filter events based on active horizon, category, and relevance tier
  const activeEvents = useMemo(() => {
    let list = activeHorizon === "next30" ? horizons.next30Days : horizons.next90Days;
    if (activeCategory !== "all") list = list.filter((ev) => ev.type === activeCategory);
    if (activeRelevance !== "all") list = list.filter((ev) => ev.relevanceTier === activeRelevance);
    return list;
  }, [activeHorizon, activeCategory, activeRelevance, horizons]);

  const nowCount = horizons.now.length;
  const next30Count = horizons.next30Days.length;
  const next90Count = horizons.next90Days.length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0720] via-[#0d0928] to-[#070518] border border-[#c8a030]/25 shadow-xl p-5 sm:p-6 mb-6">
      {/* Background Subtle Radial Glow */}
      <div
        className="absolute top-0 left-1/3 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #38bdf8 0%, #c8a030 50%, transparent 80%)" }}
      />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="text-[10px] tracking-[2px] uppercase font-bold text-[#c8a030] flex items-center gap-1.5 font-mono">
            <span>✦</span> Cosmic Radar · Multi-Horizon Forecasting
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f0e8d0] tracking-tight mt-0.5">
            Predictive Planetary & Dasha Horizon
          </h2>
          <p className="text-xs text-[#8e88b8] mt-1 max-w-xl">
            Continuous root-finding ephemeris scan identifying exact planetary culminations, retrograde passes, and dasha transitions.
          </p>
        </div>

        {/* Shastra Live Badge */}
        <div className="text-[11px] text-[#c8a030] bg-[#c8a030]/10 border border-[#c8a030]/25 px-3 py-1 rounded-full flex items-center gap-1.5 font-mono">
          <span>Lahiri Sidereal Precision</span>
        </div>
      </div>

      {/* 3 Horizon Tabs (NOW, NEXT 30 DAYS, NEXT 90 DAYS) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c1642] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveHorizon("now")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeHorizon === "now"
                ? "bg-[#c8a030] text-[#060410] shadow-md shadow-[#c8a030]/20"
                : "bg-[#140f38] text-[#8e88b8] hover:text-[#f0e8d0] border border-[#201a52]"
            }`}
          >
            <span>NOW (Live)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeHorizon === "now" ? "bg-[#060410]/20 text-[#060410]" : "bg-[#201a52] text-[#c8a030]"
              }`}
            >
              {nowCount}
            </span>
          </button>

          <button
            onClick={() => setActiveHorizon("next30")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeHorizon === "next30"
                ? "bg-[#c8a030] text-[#060410] shadow-md shadow-[#c8a030]/20"
                : "bg-[#140f38] text-[#8e88b8] hover:text-[#f0e8d0] border border-[#201a52]"
            }`}
          >
            <span>NEXT 30 DAYS</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeHorizon === "next30" ? "bg-[#060410]/20 text-[#060410]" : "bg-[#201a52] text-[#c8a030]"
              }`}
            >
              {next30Count}
            </span>
          </button>

          <button
            onClick={() => setActiveHorizon("next90")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeHorizon === "next90"
                ? "bg-[#c8a030] text-[#060410] shadow-md shadow-[#c8a030]/20"
                : "bg-[#140f38] text-[#8e88b8] hover:text-[#f0e8d0] border border-[#201a52]"
            }`}
          >
            <span>NEXT 90 DAYS</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeHorizon === "next90" ? "bg-[#060410]/20 text-[#060410]" : "bg-[#201a52] text-[#c8a030]"
              }`}
            >
              {next90Count}
            </span>
          </button>
        </div>

        {/* Filter Chips (Visible for 30 and 90 Day Horizons) */}
        {activeHorizon !== "now" && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Priority Tiers */}
            <div className="flex items-center gap-1 bg-[#0b0825] p-1 rounded-lg border border-[#1e174c]">
              <button
                onClick={() => setActiveRelevance("all")}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeRelevance === "all"
                    ? "bg-[#282060] text-[#f0e8d0]"
                    : "text-[#706898] hover:text-[#c8c0e8]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveRelevance("primary")}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  activeRelevance === "primary"
                    ? "bg-[#c8a030]/25 text-[#c8a030] font-bold"
                    : "text-[#706898] hover:text-[#c8c0e8]"
                }`}
              >
                <span>✦</span>
                <span>Primary</span>
              </button>
              <button
                onClick={() => setActiveRelevance("supporting")}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeRelevance === "supporting"
                    ? "bg-[#282060] text-[#a098c8]"
                    : "text-[#706898] hover:text-[#c8c0e8]"
                }`}
              >
                Supporting
              </button>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeCategory === "all"
                    ? "bg-[#261f5a] text-[#c8a030] border border-[#c8a030]/40"
                    : "text-[#706898] hover:text-[#c8c0e8]"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setActiveCategory("transit_hit")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeCategory === "transit_hit"
                    ? "bg-[#261f5a] text-[#c8a030] border border-[#c8a030]/40"
                    : "text-[#706898] hover:text-[#c8c0e8]"
                }`}
              >
                Natal Hits
              </button>
              <button
                onClick={() => setActiveCategory("planetary_aspect")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeCategory === "planetary_aspect"
                    ? "bg-[#261f5a] text-[#c8a030] border border-[#c8a030]/40"
                    : "text-[#706898] hover:text-[#c8c0e8]"
                }`}
              >
                Aspects
              </button>
              <button
                onClick={() => setActiveCategory("dasha_milestone")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeCategory === "dasha_milestone"
                    ? "bg-[#261f5a] text-[#c8a030] border border-[#c8a030]/40"
                    : "text-[#706898] hover:text-[#c8c0e8]"
                }`}
              >
                Dasha Shifts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* HORIZON CONTENT */}
      {activeHorizon === "now" ? (
        <div className="space-y-4">
          {horizons.now.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#8e88b8]">
              No active tension signals right now. Celestial balance is calm.
            </div>
          ) : (
            <div className="space-y-3">
              {horizons.now.map((trigger, idx) => {
                const orbStr = formatOrb(trigger.evidence.currentOrbDeg);
                const sev = getSeverityStyle(trigger.severity);
                return (
                  <div
                    key={idx}
                    className="bg-[#0f0b2e] border border-[#201a4e] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: sev.badgeBg,
                            borderColor: sev.badgeBorder,
                            color: sev.textColor,
                          }}
                        >
                          {trigger.severity}
                        </span>
                        <span className="text-sm font-serif font-bold text-[#f0e8d0]">
                          {trigger.primaryPlanets.join(" ↔ ")}
                        </span>
                        <span className="text-[11px] text-[#c8a030] font-mono">
                          {trigger.evidence.aspectType}
                        </span>
                      </div>
                      <div className="text-xs text-[#c8c0a8] max-w-xl">
                        {trigger.headline}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-[#605890] uppercase font-mono">Current Orb</div>
                        <div className="text-xs font-mono font-bold text-[#f0e8d0]">{orbStr}</div>
                      </div>
                      {onOpenLiveEvidence && (
                        <button
                          onClick={onOpenLiveEvidence}
                          className="text-xs font-semibold text-[#c8a030] bg-[#1a1444] hover:bg-[#241c5a] border border-[#c8a030]/30 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View Shastra ✦
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <CosmicTimeline
          events={activeEvents}
          onOpenDetails={(ev) => setSelectedEvent(ev)}
        />
      )}

      {/* Modal Drawer for Detailed Event Inspection */}
      <EventDetailDrawer
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

