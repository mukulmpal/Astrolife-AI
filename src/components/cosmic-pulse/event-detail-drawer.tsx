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
      <div className="relative w-full max-w-2xl bg-[#0a0720] border-l border-[#c8a030]/30 h-full overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col justify-between text-[#f0e8d0] z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#1c1840] pb-5">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-[#c8a030] uppercase mb-1 flex items-center gap-2">
                <span>✦</span> Cosmic Radar · Event Precision
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f0e8d0] tracking-wide">
                {event.title}
              </h2>
              <div className="text-xs text-[#a098c0] mt-1 flex items-center gap-2">
                <span>{event.aspectType}</span>
                <span>•</span>
                <span className="text-[#c8a030]">{relativeText}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#a098c0] hover:text-[#f0e8d0] bg-[#141038] hover:bg-[#1c1848] rounded-lg transition-colors border border-[#282258]"
              title="Close drawer"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#1c1840] gap-2 mt-4 text-xs">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 ${
                activeTab === "timeline"
                  ? "border-[#c8a030] text-[#c8a030]"
                  : "border-transparent text-[#7e78a8] hover:text-[#c8c0e8]"
              }`}
            >
              Timing & Passes
            </button>
            <button
              onClick={() => setActiveTab("geometry")}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 ${
                activeTab === "geometry"
                  ? "border-[#c8a030] text-[#c8a030]"
                  : "border-transparent text-[#7e78a8] hover:text-[#c8c0e8]"
              }`}
            >
              Astrometric Evidence
            </button>
            <button
              onClick={() => setActiveTab("provenance")}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 ${
                activeTab === "provenance"
                  ? "border-[#c8a030] text-[#c8a030]"
                  : "border-transparent text-[#7e78a8] hover:text-[#c8c0e8]"
              }`}
            >
              Math Provenance
            </button>
            <button
              onClick={() => setActiveTab("shastra")}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 ${
                activeTab === "shastra"
                  ? "border-[#c8a030] text-[#c8a030]"
                  : "border-transparent text-[#7e78a8] hover:text-[#c8c0e8]"
              }`}
            >
              Kyu & Kaise (Shastra)
            </button>
          </div>

          {/* TAB 1: TIMING & RETROGRADE PASSES */}
          {activeTab === "timeline" && (
            <div className="mt-6 space-y-6">
              <div className="bg-[#0f0b2e] border border-[#241c58] rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-[#a098c0] font-semibold mb-3">
                  Four-Point Contact Sequence
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#14103c] p-3 rounded-lg border border-[#221a52]">
                    <div className="text-[#8e88b8] text-[10px] uppercase font-mono">Contact (Orb Entry)</div>
                    <div className="text-[#f0e8d0] font-bold mt-1">
                      {formatForecastDate(event.timing.contactAt)}
                    </div>
                    <div className="text-[#a098c0] text-[11px]">
                      {formatForecastTime(event.timing.contactAt)}
                    </div>
                  </div>
                  <div className="bg-[#1a144c] p-3 rounded-lg border border-[#c8a030]/40">
                    <div className="text-[#c8a030] text-[10px] uppercase font-mono font-bold">
                      {event.timing.exactAt ? "Exact Culmination (0°00')" : "Peak Alignment"}
                    </div>
                    <div className="text-[#f0e8d0] font-bold mt-1">
                      {formatForecastDate(exactDate)}
                    </div>
                    <div className="text-[#c8a030] text-[11px] font-semibold">
                      {formatForecastTime(exactDate)}
                    </div>
                  </div>
                  <div className="bg-[#14103c] p-3 rounded-lg border border-[#221a52]">
                    <div className="text-[#8e88b8] text-[10px] uppercase font-mono">Separation (Orb Exit)</div>
                    <div className="text-[#f0e8d0] font-bold mt-1">
                      {formatForecastDate(event.timing.separationAt)}
                    </div>
                    <div className="text-[#a098c0] text-[11px]">
                      {formatForecastTime(event.timing.separationAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Retrograde Multi-Pass Architecture */}
              {event.retrogradeInfo && (
                <div className="bg-[#120d36] border border-[#f59e0b]/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚡</span> Multi-Pass Retrograde Transit
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40">
                      Pass {event.retrogradeInfo.passNumber} of {event.retrogradeInfo.totalPassesEstimated ?? 3}
                    </span>
                  </div>
                  <p className="text-xs text-[#d8d0c0] leading-relaxed">
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
                <div className="bg-[#0f0b2e] border border-[#1c1848] rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-[#a098c0] font-semibold mb-2">
                    Active Dasha Environment
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-[#605890]">Mahadasha:</span>{" "}
                      <span className="text-[#f0e8d0] font-semibold">{event.dashaContext.mahadasha}</span>
                    </div>
                    {event.dashaContext.antardasha && (
                      <div>
                        <span className="text-[#605890]">Antardasha:</span>{" "}
                        <span className="text-[#f0e8d0] font-semibold">{event.dashaContext.antardasha}</span>
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
                <div className="bg-[#0f0b2e] border border-[#241c58] rounded-xl p-4">
                  <div className="text-xs text-[#c8a030] font-mono uppercase tracking-wider mb-2">
                    Primary Transiting Body · {event.evidence.planetA}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8e88b8]">Sidereal Longitude:</span>
                      <span className="text-[#f0e8d0] font-mono">{p1Dms.formatted}</span>
                    </div>
                    {event.transitHouse && (
                      <div className="flex justify-between">
                        <span className="text-[#8e88b8]">Transit House:</span>
                        <span className="text-[#f0e8d0] font-mono">House {event.transitHouse}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Planet B Box */}
                <div className="bg-[#0f0b2e] border border-[#241c58] rounded-xl p-4">
                  <div className="text-xs text-[#c8a030] font-mono uppercase tracking-wider mb-2">
                    Aspect Target / Natal Point · {event.evidence.planetB}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8e88b8]">Sidereal Longitude:</span>
                      <span className="text-[#f0e8d0] font-mono">{p2Dms.formatted}</span>
                    </div>
                    {event.natalHouse && (
                      <div className="flex justify-between">
                        <span className="text-[#8e88b8]">Natal House:</span>
                        <span className="text-[#f0e8d0] font-mono">House {event.natalHouse}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Geometry Summary */}
              <div className="bg-[#0f0b2e] border border-[#241c58] rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-[#a098c0] font-semibold mb-3">
                  Geometric Alignment Metrics
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-[#8e88b8] text-[10px]">Target Aspect Angle</div>
                    <div className="text-[#f0e8d0] font-mono font-bold mt-0.5">{event.targetAngle}°</div>
                  </div>
                  <div>
                    <div className="text-[#8e88b8] text-[10px]">Reference Aspect</div>
                    <div className="text-[#f0e8d0] font-mono font-bold mt-0.5">
                      {event.evidence.exactAspectDeg}°
                    </div>
                  </div>
                  <div>
                    <div className="text-[#8e88b8] text-[10px]">Current Orb</div>
                    <div className="text-[#f0e8d0] font-mono font-bold mt-0.5">{orbStr}</div>
                  </div>
                  <div>
                    <div className="text-[#8e88b8] text-[10px]">Kinematic State</div>
                    <div className="text-[#c8a030] font-bold mt-0.5">
                      {event.evidence.isApplying ? "Approaching Peak" : "Separating Phase"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Life Areas */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#8e88b8]">Activated Life Spheres:</span>
                {event.lifeAreas.map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 rounded bg-[#1c1642] text-[#e0d8c0] border border-[#2d2466] font-medium"
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
              <div className="bg-[#0f0b2e] border border-[#241c58] rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-[#c8a030] font-semibold mb-3">
                  Verification Checklist & Ephemeris Provenance
                </div>
                <ul className="space-y-2.5">
                  {event.provenance.calculationBasis.map((basis, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[#d8d0c0]">
                      <span className="text-[#4ade80] font-bold">✓</span>
                      <span>{basis}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5 text-[#d8d0c0]">
                    <span className="text-[#4ade80] font-bold">✓</span>
                    <span>
                      Root Refinement: <strong>{event.provenance.numericalRefinementMethod}</strong> (bisection down to minute-level convergence)
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#d8d0c0]">
                    <span className="text-[#4ade80] font-bold">✓</span>
                    <span>
                      Scan Resolution: <strong>{event.provenance.searchIntervalDays} day</strong> coarse bracketing with stationary point splitting
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#d8d0c0]">
                    <span className="text-[#4ade80] font-bold">✓</span>
                    <span>
                      Timezone Reference: <strong>UTC+{event.provenance.localTz}</strong> standard civil epoch
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#4ade80]">
                    <span className="text-[#4ade80] font-bold">✓</span>
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
              <div className="bg-[#0f0b2e] border border-[#241c58] rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-[#c8a030] font-semibold mb-2">
                  Classical Shastra Foundation (Kyu aur Kaise)
                </div>
                <div className="text-sm font-serif font-bold text-[#f0e8d0] mb-2">
                  {event.aspectType} · {event.planets.join(" ↔ ")}
                </div>
                <div className="space-y-3 text-[#d0c8b0] leading-relaxed">
                  <p>
                    <strong className="text-[#c8a030]">Classical Reference:</strong>{" "}
                    {event.evidence.shastraReference}
                  </p>
                  <p>
                    <strong className="text-[#c8a030]">Astronomical Geometry:</strong>{" "}
                    {event.aspectType} forms an angular tension at {event.targetAngle}°. In Vedic Gochara, transiting bodies act as active activators of karmic patterns when crossing natal sensitive zones.
                  </p>
                  <p>
                    <strong className="text-[#c8a030]">Practical Application:</strong>{" "}
                    During this window, align your decisions with the natural significations of the interacting bodies. Do not rush commitments at the exact peak moment; maintain steady poise and review all terms carefully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#1c1840] flex items-center justify-between text-xs text-[#7e78a8]">
          <span>AstroLife Ephemeris Engine · Classical Parashari</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#c8a030] text-[#060410] font-semibold hover:bg-[#d8b040] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

