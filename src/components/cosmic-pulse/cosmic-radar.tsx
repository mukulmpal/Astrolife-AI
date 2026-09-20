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
  const [activeHorizon, setActiveHorizon] = useState<HorizonTab>(
    horizons.now.length > 0 ? "now" : "next30"
  );
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
    <div
      className="relative overflow-hidden rounded-2xl border shadow-xl p-5 sm:p-6 mb-6 transition-colors duration-300"
      style={{
        background: "linear-gradient(135deg, var(--app-card), var(--app-card-alt))",
        borderColor: "var(--app-border-strong)",
      }}
    >
      {/* Background Subtle Radial Glow */}
      <div
        className="absolute top-0 left-1/3 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--al-violet, #38bdf8) 0%, var(--app-gold) 50%, transparent 80%)" }}
      />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div
            className="text-[10px] tracking-[2px] uppercase font-bold flex items-center gap-1.5 font-mono"
            style={{ color: "var(--app-gold)" }}
          >
            <span>✦</span> Cosmic Radar · Multi-Horizon Forecasting
          </div>
          <h2
            className="text-xl sm:text-2xl font-serif font-bold tracking-tight mt-0.5"
            style={{ color: "var(--app-fg)" }}
          >
            Predictive Planetary & Dasha Horizon
          </h2>
          <p className="text-xs mt-1 max-w-xl" style={{ color: "var(--app-muted)" }}>
            Continuous root-finding ephemeris scan identifying exact planetary culminations, retrograde passes, and dasha transitions.
          </p>
        </div>

        {/* Shastra Live Badge */}
        <div
          className="text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 font-mono border"
          style={{
            background: "color-mix(in srgb, var(--app-gold) 12%, transparent)",
            borderColor: "color-mix(in srgb, var(--app-gold) 30%, transparent)",
            color: "var(--app-gold)",
          }}
        >
          <span>Lahiri Sidereal Precision</span>
        </div>
      </div>

      {/* 3 Horizon Tabs (NOW, NEXT 30 DAYS, NEXT 90 DAYS) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-4" style={{ borderColor: "var(--app-border)" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveHorizon("now")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border"
            style={{
              background: activeHorizon === "now" ? "var(--app-gold)" : "var(--app-card)",
              color: activeHorizon === "now" ? "var(--al-primary-on, #060410)" : "var(--app-muted)",
              borderColor: activeHorizon === "now" ? "var(--app-gold)" : "var(--app-border)",
            }}
          >
            <span>NOW (Live)</span>
            <span
              className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold"
              style={{
                background: activeHorizon === "now" ? "rgba(0,0,0,0.2)" : "var(--app-card-alt)",
                color: activeHorizon === "now" ? "inherit" : "var(--app-gold)",
              }}
            >
              {nowCount}
            </span>
          </button>

          <button
            onClick={() => setActiveHorizon("next30")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border"
            style={{
              background: activeHorizon === "next30" ? "var(--app-gold)" : "var(--app-card)",
              color: activeHorizon === "next30" ? "var(--al-primary-on, #060410)" : "var(--app-muted)",
              borderColor: activeHorizon === "next30" ? "var(--app-gold)" : "var(--app-border)",
            }}
          >
            <span>NEXT 30 DAYS</span>
            <span
              className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold"
              style={{
                background: activeHorizon === "next30" ? "rgba(0,0,0,0.2)" : "var(--app-card-alt)",
                color: activeHorizon === "next30" ? "inherit" : "var(--app-gold)",
              }}
            >
              {next30Count}
            </span>
          </button>

          <button
            onClick={() => setActiveHorizon("next90")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border"
            style={{
              background: activeHorizon === "next90" ? "var(--app-gold)" : "var(--app-card)",
              color: activeHorizon === "next90" ? "var(--al-primary-on, #060410)" : "var(--app-muted)",
              borderColor: activeHorizon === "next90" ? "var(--app-gold)" : "var(--app-border)",
            }}
          >
            <span>NEXT 90 DAYS</span>
            <span
              className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold"
              style={{
                background: activeHorizon === "next90" ? "rgba(0,0,0,0.2)" : "var(--app-card-alt)",
                color: activeHorizon === "next90" ? "inherit" : "var(--app-gold)",
              }}
            >
              {next90Count}
            </span>
          </button>
        </div>

        {/* Filter Chips (Visible for 30 and 90 Day Horizons) */}
        {activeHorizon !== "now" && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Priority Tiers */}
            <div
              className="flex items-center gap-1 p-1 rounded-lg border"
              style={{ background: "var(--app-card)", borderColor: "var(--app-border)" }}
            >
              <button
                onClick={() => setActiveRelevance("all")}
                className="px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors"
                style={{
                  background: activeRelevance === "all" ? "color-mix(in srgb, var(--app-gold) 20%, var(--app-card))" : "transparent",
                  color: activeRelevance === "all" ? "var(--app-fg)" : "var(--app-muted)",
                }}
              >
                All
              </button>
              <button
                onClick={() => setActiveRelevance("primary")}
                className="px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                style={{
                  background: activeRelevance === "primary" ? "color-mix(in srgb, var(--app-gold) 25%, transparent)" : "transparent",
                  color: activeRelevance === "primary" ? "var(--app-gold)" : "var(--app-muted)",
                  fontWeight: activeRelevance === "primary" ? 700 : 500,
                }}
              >
                <span>✦</span>
                <span>Primary</span>
              </button>
              <button
                onClick={() => setActiveRelevance("supporting")}
                className="px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors"
                style={{
                  background: activeRelevance === "supporting" ? "color-mix(in srgb, var(--app-gold) 20%, var(--app-card))" : "transparent",
                  color: activeRelevance === "supporting" ? "var(--app-fg)" : "var(--app-muted)",
                }}
              >
                Supporting
              </button>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1">
              {[
                { id: "all", label: "All Types" },
                { id: "transit_hit", label: "Natal Hits" },
                { id: "planetary_aspect", label: "Aspects" },
                { id: "dasha_milestone", label: "Dasha Shifts" },
              ].map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as FilterCategory)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium transition-colors border"
                    style={{
                      background: isSelected ? "color-mix(in srgb, var(--app-gold) 16%, var(--app-card))" : "var(--app-card)",
                      borderColor: isSelected ? "var(--app-gold)" : "var(--app-border)",
                      color: isSelected ? "var(--app-gold)" : "var(--app-muted)",
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* HORIZON CONTENT */}
      {activeHorizon === "now" ? (
        <div className="space-y-4">
          {horizons.now.length === 0 ? (
            <div
              className="py-10 text-center text-xs rounded-xl border"
              style={{
                background: "var(--app-card)",
                borderColor: "var(--app-border)",
                color: "var(--app-muted)",
              }}
            >
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
                    className="rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border"
                    style={{
                      background: "var(--app-card)",
                      borderColor: "var(--app-border)",
                    }}
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
                        <span className="text-sm font-serif font-bold" style={{ color: "var(--app-fg)" }}>
                          {trigger.primaryPlanets.join(" ↔ ")}
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: "var(--app-gold)" }}>
                          {trigger.evidence.aspectType}
                        </span>
                      </div>
                      <div className="text-xs max-w-xl" style={{ color: "var(--app-soft)" }}>
                        {trigger.headline}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-mono" style={{ color: "var(--app-muted)" }}>Current Orb</div>
                        <div className="text-xs font-mono font-bold" style={{ color: "var(--app-fg)" }}>{orbStr}</div>
                      </div>
                      {onOpenLiveEvidence && (
                        <button
                          onClick={onOpenLiveEvidence}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border"
                          style={{
                            background: "color-mix(in srgb, var(--app-gold) 12%, transparent)",
                            borderColor: "color-mix(in srgb, var(--app-gold) 30%, transparent)",
                            color: "var(--app-gold)",
                          }}
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

