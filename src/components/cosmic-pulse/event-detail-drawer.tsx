"use client";

import React, { useState } from "react";
import type { CosmicForecastEvent } from "@/lib/astro-engine/cosmic-pulse/forecast/forecast-types";
import { formatLongitudeToDms, formatOrb, formatForecastDate, formatForecastTime, formatRelativeDays } from "./formatters";

interface EventDetailDrawerProps {
  event: CosmicForecastEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"timeline" | "geometry" | "provenance" | "shastra">("timeline");

  if (!isOpen || !event) return null;

  const p1Dms = formatLongitudeToDms(event.evidence.longitudeA);
  const p2Dms = formatLongitudeToDms(event.evidence.longitudeB);
  const orbStr = formatOrb(event.evidence.currentOrbDeg);

  const exactDate = event.timing.exactAt || event.timing.peakAt;
  const relativeText = formatRelativeDays(exactDate);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-2xl border-l h-full overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300"
        style={{
          background: "var(--app-card)",
          borderColor: "var(--app-border-strong)",
          color: "var(--app-fg)",
        }}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--app-border)" }}>
            <div>
              <div
                className="text-[11px] font-mono tracking-widest uppercase mb-1 flex items-center gap-2"
                style={{ color: "var(--app-gold)" }}
              >
                <span>✦</span> Cosmic Radar · Event Precision
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide" style={{ color: "var(--app-fg)" }}>
                {event.title}
              </h2>
              <div className="text-xs mt-1 flex items-center gap-2" style={{ color: "var(--app-muted)" }}>
                <span>{event.aspectType}</span>
                <span>•</span>
                <span style={{ color: "var(--app-gold)" }}>{relativeText}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors border"
              style={{
                background: "var(--app-card-alt)",
                borderColor: "var(--app-border)",
                color: "var(--app-muted)",
              }}
              title="Close drawer"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b gap-2 mt-4 text-xs" style={{ borderColor: "var(--app-border)" }}>
            <button
              onClick={() => setActiveTab("timeline")}
              className="pb-2.5 px-3 font-semibold transition-all border-b-2"
              style={{
                borderColor: activeTab === "timeline" ? "var(--app-gold)" : "transparent",
                color: activeTab === "timeline" ? "var(--app-gold)" : "var(--app-muted)",
              }}
            >
              Timing & Passes
            </button>
            <button
              onClick={() => setActiveTab("geometry")}
              className="pb-2.5 px-3 font-semibold transition-all border-b-2"
              style={{
                borderColor: activeTab === "geometry" ? "var(--app-gold)" : "transparent",
                color: activeTab === "geometry" ? "var(--app-gold)" : "var(--app-muted)",
              }}
            >
              Astrometric Evidence
            </button>
            <button
              onClick={() => setActiveTab("provenance")}
              className="pb-2.5 px-3 font-semibold transition-all border-b-2"
              style={{
                borderColor: activeTab === "provenance" ? "var(--app-gold)" : "transparent",
                color: activeTab === "provenance" ? "var(--app-gold)" : "var(--app-muted)",
              }}
            >
              Math Provenance
            </button>
            <button
              onClick={() => setActiveTab("shastra")}
              className="pb-2.5 px-3 font-semibold transition-all border-b-2"
              style={{
                borderColor: activeTab === "shastra" ? "var(--app-gold)" : "transparent",
                color: activeTab === "shastra" ? "var(--app-gold)" : "var(--app-muted)",
              }}
            >
              Kyu & Kaise (Shastra)
            </button>
          </div>

          {/* TAB 1: TIMING & RETROGRADE PASSES */}
          {activeTab === "timeline" && (
            <div className="mt-6 space-y-6">
              <div
                className="rounded-xl p-4 border"
                style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
              >
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3"
                  style={{ color: "var(--app-muted)" }}
                >
                  Four-Point Contact Sequence
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div
                    className="p-3 rounded-lg border"
                    style={{ background: "var(--app-card)", borderColor: "var(--app-border)" }}
                  >
                    <div className="text-[10px] uppercase font-mono" style={{ color: "var(--app-muted)" }}>Contact (Orb Entry)</div>
                    <div className="font-bold mt-1" style={{ color: "var(--app-fg)" }}>
                      {formatForecastDate(event.timing.contactAt)}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--app-soft)" }}>
                      {formatForecastTime(event.timing.contactAt)}
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-lg border"
                    style={{
                      background: "color-mix(in srgb, var(--app-gold) 10%, var(--app-card))",
                      borderColor: "color-mix(in srgb, var(--app-gold) 40%, var(--app-border))",
                    }}
                  >
                    <div className="text-[10px] uppercase font-mono font-bold" style={{ color: "var(--app-gold)" }}>
                      {event.timing.exactAt ? "Exact Culmination (0°00')" : "Peak Alignment"}
                    </div>
                    <div className="font-bold mt-1" style={{ color: "var(--app-fg)" }}>
                      {formatForecastDate(exactDate)}
                    </div>
                    <div className="text-[11px] font-semibold" style={{ color: "var(--app-gold)" }}>
                      {formatForecastTime(exactDate)}
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-lg border"
                    style={{ background: "var(--app-card)", borderColor: "var(--app-border)" }}
                  >
                    <div className="text-[10px] uppercase font-mono" style={{ color: "var(--app-muted)" }}>Separation (Orb Exit)</div>
                    <div className="font-bold mt-1" style={{ color: "var(--app-fg)" }}>
                      {formatForecastDate(event.timing.separationAt)}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--app-soft)" }}>
                      {formatForecastTime(event.timing.separationAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Retrograde Multi-Pass Architecture */}
              {event.retrogradeInfo && (
                <div
                  className="border rounded-xl p-4"
                  style={{
                    background: "var(--app-card-alt)",
                    borderColor: "color-mix(in srgb, #f59e0b 35%, var(--app-border))",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚡</span> Multi-Pass Retrograde Transit
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      Pass {event.retrogradeInfo.passNumber} of {event.retrogradeInfo.totalPassesEstimated ?? 3}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--app-soft)" }}>
                    {event.retrogradeInfo.passNumber === 1 && (
                      <>
                        <strong>Pass 1 (Direct Motion):</strong> Initial trigger. The planet crosses this degree moving direct, initiating new karma and revealing the core theme of this cycle.
                      </>
                    )}
                    {event.retrogradeInfo.passNumber === 2 && (
                      <>
                        <strong>Pass 2 (Retrograde Motion · Vakri):</strong> Internal revision. The planet stations and traverses backwards across this degree. Old assumptions are scrutinized, requiring reassessment and patience.
                      </>
                    )}
                    {event.retrogradeInfo.passNumber === 3 && (
                      <>
                        <strong>Pass 3 (Final Direct Motion):</strong> Culmination and resolution. The planet turns direct and makes its final crossing, cementing lessons and completing the karmic transit.
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Dasha Context */}
              {event.dashaContext && (
                <div
                  className="rounded-xl p-4 border"
                  style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
                >
                  <div
                    className="text-xs uppercase tracking-wider font-semibold mb-2"
                    style={{ color: "var(--app-muted)" }}
                  >
                    Active Dasha Environment
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span style={{ color: "var(--app-muted)" }}>Mahadasha:</span>{" "}
                      <span className="font-semibold" style={{ color: "var(--app-fg)" }}>{event.dashaContext.mahadasha}</span>
                    </div>
                    {event.dashaContext.antardasha && (
                      <div>
                        <span style={{ color: "var(--app-muted)" }}>Antardasha:</span>{" "}
                        <span className="font-semibold" style={{ color: "var(--app-fg)" }}>{event.dashaContext.antardasha}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ASTROMETRIC EVIDENCE */}
          {activeTab === "geometry" && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Planet A Box */}
                <div
                  className="rounded-xl p-4 border"
                  style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
                >
                  <div
                    className="text-xs font-mono uppercase tracking-wider mb-2"
                    style={{ color: "var(--app-gold)" }}
                  >
                    Primary Transiting Body · {event.evidence.planetA}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--app-muted)" }}>Sidereal Longitude:</span>
                      <span className="font-mono" style={{ color: "var(--app-fg)" }}>{p1Dms.formatted}</span>
                    </div>
                    {event.transitHouse && (
                      <div className="flex justify-between">
                        <span style={{ color: "var(--app-muted)" }}>Transit House:</span>
                        <span className="font-mono" style={{ color: "var(--app-fg)" }}>House {event.transitHouse}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Planet B Box */}
                <div
                  className="rounded-xl p-4 border"
                  style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
                >
                  <div
                    className="text-xs font-mono uppercase tracking-wider mb-2"
                    style={{ color: "var(--app-gold)" }}
                  >
                    Aspect Target / Natal Point · {event.evidence.planetB}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--app-muted)" }}>Sidereal Longitude:</span>
                      <span className="font-mono" style={{ color: "var(--app-fg)" }}>{p2Dms.formatted}</span>
                    </div>
                    {event.natalHouse && (
                      <div className="flex justify-between">
                        <span style={{ color: "var(--app-muted)" }}>Natal House:</span>
                        <span className="font-mono" style={{ color: "var(--app-fg)" }}>House {event.natalHouse}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Geometry Summary */}
              <div
                className="rounded-xl p-4 border"
                style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
              >
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3"
                  style={{ color: "var(--app-muted)" }}
                >
                  Geometric Alignment Metrics
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--app-muted)" }}>Target Aspect Angle</div>
                    <div className="font-mono font-bold mt-0.5" style={{ color: "var(--app-fg)" }}>{event.targetAngle}°</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--app-muted)" }}>Reference Aspect</div>
                    <div className="font-mono font-bold mt-0.5" style={{ color: "var(--app-fg)" }}>
                      {event.evidence.exactAspectDeg}°
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--app-muted)" }}>Current Orb</div>
                    <div className="font-mono font-bold mt-0.5" style={{ color: "var(--app-fg)" }}>{orbStr}</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--app-muted)" }}>Kinematic State</div>
                    <div className="font-bold mt-0.5" style={{ color: "var(--app-gold)" }}>
                      {event.evidence.isApplying ? "Approaching Peak" : "Separating Phase"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Life Areas */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span style={{ color: "var(--app-muted)" }}>Activated Life Spheres:</span>
                {event.lifeAreas.map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 rounded border font-medium"
                    style={{
                      background: "var(--app-card-alt)",
                      borderColor: "var(--app-border)",
                      color: "var(--app-soft)",
                    }}
                  >
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MATHEMATICAL PROVENANCE */}
          {activeTab === "provenance" && (
            <div className="mt-6 space-y-4 text-xs">
              <div
                className="rounded-xl p-4 border"
                style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
              >
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3"
                  style={{ color: "var(--app-gold)" }}
                >
                  Verification Checklist & Ephemeris Provenance
                </div>
                <ul className="space-y-2.5">
                  {event.provenance.calculationBasis.map((basis, idx) => (
                    <li key={idx} className="flex items-start gap-2.5" style={{ color: "var(--app-soft)" }}>
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{basis}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5" style={{ color: "var(--app-soft)" }}>
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>
                      Root Refinement: <strong>{event.provenance.numericalRefinementMethod}</strong> (bisection down to minute-level convergence)
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5" style={{ color: "var(--app-soft)" }}>
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>
                      Scan Resolution: <strong>{event.provenance.searchIntervalDays} day</strong> coarse bracketing with stationary point splitting
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5" style={{ color: "var(--app-soft)" }}>
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>
                      Timezone Reference: <strong>UTC+{event.provenance.localTz}</strong> standard civil epoch
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-emerald-500">
                    <span className="font-bold">✓</span>
                    <span>
                      Strict Zero-Score Contract: Purely deterministic astronomical timing without arbitrary percentage/numerical ratings
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: KYU & KAISE (SHASTRA) */}
          {activeTab === "shastra" && (
            <div className="mt-6 space-y-4 text-xs">
              <div
                className="rounded-xl p-4 border"
                style={{ background: "var(--app-card-alt)", borderColor: "var(--app-border)" }}
              >
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: "var(--app-gold)" }}
                >
                  Classical Shastra Foundation (Kyu aur Kaise)
                </div>
                <div className="text-sm font-serif font-bold mb-2" style={{ color: "var(--app-fg)" }}>
                  {event.aspectType} · {event.planets.join(" ↔ ")}
                </div>
                <div className="space-y-3 leading-relaxed" style={{ color: "var(--app-soft)" }}>
                  <p>
                    <strong style={{ color: "var(--app-gold)" }}>Classical Reference:</strong>{" "}
                    {event.evidence.shastraReference}
                  </p>
                  <p>
                    <strong style={{ color: "var(--app-gold)" }}>Astronomical Geometry:</strong>{" "}
                    {event.aspectType} forms an angular tension at {event.targetAngle}°. In Vedic Gochara, transiting bodies act as active activators of karmic patterns when crossing natal sensitive zones.
                  </p>
                  <p>
                    <strong style={{ color: "var(--app-gold)" }}>Practical Application:</strong>{" "}
                    During this window, align your decisions with the natural significations of the interacting bodies. Do not rush commitments at the exact peak moment; maintain steady poise and review all terms carefully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--app-border)", color: "var(--app-muted)" }}>
          <span>AstroLife Ephemeris Engine · Classical Parashari</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold transition-colors"
            style={{
              background: "var(--app-gold)",
              color: "var(--al-primary-on, #060410)",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

