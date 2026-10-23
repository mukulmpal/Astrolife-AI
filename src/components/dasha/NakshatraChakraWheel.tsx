"use client";

import React, { useState, useMemo } from "react";
import type { NavtaraMatrixItem, FullNavtaraIntelligence } from "@/lib/astro-engine/navtara-engine";
import {
  getPlanetLon,
  calculateCountedPosition,
  calculateTaraNumber,
} from "@/lib/astro-engine/navtara-engine";
import { resolveNakshatraCoordinate } from "@/lib/astro-engine/ayanamsa-config";
import { computePlanets, type ChartData } from "@/lib/astro-engine/calculations";
import {
  evaluateTransitGrahaTaraBala,
  type TransitGrahaTaraBala,
} from "@/lib/astro-engine/transit-trigger";
import type { DashaLord } from "@/lib/astro-engine/dasha";
import {
  Shield,
  Sparkles,
  Feather,
  AlertCircle,
  CheckCircle,
  Info,
  Radio,
  Compass,
  Layers,
} from "lucide-react";

export type ChakraWheelMode = "NATAL" | "NATAL_GOCHAR" | "GOCHAR";

interface NakshatraChakraWheelProps {
  intel: FullNavtaraIntelligence;
  activeMD?: DashaLord;
  activeAD?: DashaLord;
  tp: (name: string) => string;
  chart?: ChartData;
  initialMode?: ChakraWheelMode;
  transitDate?: Date;
}

const PLANET_SYMBOLS: Record<string, { glyph: string; short: string; color: string }> = {
  Sun: { glyph: "☉", short: "Su", color: "#D97706" },
  Moon: { glyph: "☽", short: "Mo", color: "#2563EB" },
  Mars: { glyph: "♂", short: "Ma", color: "#DC2626" },
  Mercury: { glyph: "☿", short: "Me", color: "#059669" },
  Jupiter: { glyph: "♃", short: "Ju", color: "#D97706" },
  Venus: { glyph: "♀", short: "Ve", color: "#DB2777" },
  Saturn: { glyph: "♄", short: "Sa", color: "#4B5563" },
  Rahu: { glyph: "☊", short: "Ra", color: "#7C3AED" },
  Ketu: { glyph: "☋", short: "Ke", color: "#9333EA" },
};

export function NakshatraChakraWheel({
  intel,
  activeMD,
  activeAD,
  tp,
  chart,
  initialMode = "NATAL",
  transitDate,
}: NakshatraChakraWheelProps) {
  const [wheelMode, setWheelMode] = useState<ChakraWheelMode>(initialMode);
  const [selectedPos, setSelectedPos] = useState<number>(1); // Default to Janma Star (pos 1)
  const [hoveredPos, setHoveredPos] = useState<number | null>(null);

  const activePos = hoveredPos ?? selectedPos;

  // Map of counted position -> item
  const itemByPos = useMemo(() => {
    const map = new Map<number, NavtaraMatrixItem>();
    intel.chakra27.forEach((item) => {
      map.set(item.countedPosition, item);
    });
    return map;
  }, [intel.chakra27]);

  // Identify positions of Active MD and AD Nakshatras if available
  const mdNakId = intel.dashaAudit?.layers.find((l) => l.level === "MD_PLANET")?.nakshatra.id;
  const adNakId = intel.dashaAudit?.layers.find((l) => l.level === "AD_PLANET")?.nakshatra.id;

  const mdPos = useMemo(() => {
    if (!mdNakId) return null;
    return intel.chakra27.find((item) => item.targetNakshatra.id === mdNakId)?.countedPosition ?? null;
  }, [intel.chakra27, mdNakId]);

  const adPos = useMemo(() => {
    if (!adNakId) return null;
    return intel.chakra27.find((item) => item.targetNakshatra.id === adNakId)?.countedPosition ?? null;
  }, [intel.chakra27, adNakId]);

  // ── Natal Planets Mapped to Counted Positions (1..27) ─────────────────────
  const natalByPos = useMemo(() => {
    const map = new Map<number, Array<{ planet: string; isMD: boolean; isAD: boolean }>>();
    if (!chart?.planets) return map;

    for (const [pName, pData] of Object.entries(chart.planets)) {
      if (!PLANET_SYMBOLS[pName]) continue;
      const lon = getPlanetLon(pData);
      const coord = resolveNakshatraCoordinate(lon, chart.jd, intel.selectedAyanamsa);
      const pos = calculateCountedPosition(intel.birthNakshatra.id, coord.nakshatra.id);
      const list = map.get(pos) ?? [];
      list.push({
        planet: pName,
        isMD: pName === activeMD,
        isAD: pName === activeAD,
      });
      map.set(pos, list);
    }
    return map;
  }, [chart, intel.birthNakshatra.id, intel.selectedAyanamsa, activeMD, activeAD]);

  // ── Live Gochar Transit Planets Mapped to Counted Positions (1..27) ───────
  const transitByPos = useMemo(() => {
    const map = new Map<number, Array<TransitGrahaTaraBala>>();
    try {
      const d = transitDate ?? new Date();
      const tJD = 2440587.5 + d.getTime() / 86400000;
      const tPositions = computePlanets(tJD);

      for (const [pName, lon] of Object.entries(tPositions)) {
        if (!PLANET_SYMBOLS[pName]) continue;
        const bala = evaluateTransitGrahaTaraBala(
          pName,
          lon,
          intel.birthNakshatra.id,
          tJD,
          intel.selectedAyanamsa
        );
        const list = map.get(bala.countedPosition) ?? [];
        list.push(bala);
        map.set(bala.countedPosition, list);
      }
    } catch (err) {
      console.warn("[NakshatraChakraWheel] Failed to compute live transits:", err);
    }
    return map;
  }, [transitDate, intel.birthNakshatra.id, intel.selectedAyanamsa]);

  const currentDisplayItem = itemByPos.get(activePos) ?? intel.chakra27[0];
  const activeNatalGrahas = natalByPos.get(activePos) ?? [];
  const activeTransitGrahas = transitByPos.get(activePos) ?? [];

  // SVG Geometry constants
  const size = 660;
  const center = size / 2;
  const hubRadius = 100;
  const rInner = 148; // Ring 3: Live Gochar Transits boundary
  const rMiddle = 208; // Ring 2: Natal Planets boundary
  const rOuter = 296; // Ring 1: 27 Nakshatras boundary
  const rParyayaOuter = 308; // Outer Paryaya Rim boundary

  const totalSlices = 27;
  const sliceAngle = 360 / totalSlices; // 13.333333°

  // Helper to calculate polar coordinates (clockwise from top 12 o'clock)
  const getCoordinates = (radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: center + radius * Math.cos(angleInRadians),
      y: center + radius * Math.sin(angleInRadians),
    };
  };

  // Build SVG path for an annular sector between r1 and r2
  const describeWedge = (r1: number, r2: number, startAngle: number, endAngle: number) => {
    const p1 = getCoordinates(r2, startAngle);
    const p2 = getCoordinates(r2, endAngle);
    const p3 = getCoordinates(r1, endAngle);
    const p4 = getCoordinates(r1, startAngle);

    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    return `
      M ${p1.x} ${p1.y}
      A ${r2} ${r2} 0 ${largeArc} 1 ${p2.x} ${p2.y}
      L ${p3.x} ${p3.y}
      A ${r1} ${r1} 0 ${largeArc} 0 ${p4.x} ${p4.y}
      Z
    `;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Mode Toggle Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F2] p-2.5 rounded-2xl border border-amber-900/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#B8860B]" />
          <span className="text-xs font-bold text-[#1A1A1A]">Chakra View Mode:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setWheelMode("NATAL")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              wheelMode === "NATAL"
                ? "bg-[#B8860B] text-white shadow-sm"
                : "bg-white text-[#6B635B] hover:text-[#1A1A1A] border border-amber-900/10"
            }`}
          >
            <span>✦</span>
            <span>Natal Planets</span>
          </button>

          <button
            type="button"
            onClick={() => setWheelMode("GOCHAR")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              wheelMode === "GOCHAR"
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-white text-[#6B635B] hover:text-[#1A1A1A] border border-amber-900/10"
            }`}
          >
            <span>🪐</span>
            <span>Live Gochar Transits</span>
          </button>

          <button
            type="button"
            onClick={() => setWheelMode("NATAL_GOCHAR")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              wheelMode === "NATAL_GOCHAR"
                ? "bg-gradient-to-r from-[#B8860B] to-[#2563EB] text-white shadow-sm"
                : "bg-white text-[#6B635B] hover:text-[#1A1A1A] border border-amber-900/10"
            }`}
          >
            <span>⚡</span>
            <span>Dual Overlay</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 py-2">
        {/* ── 27-Spoke Radial SVG Wheel ── */}
        <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center select-none">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full drop-shadow-md overflow-visible"
          >
            <defs>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.25" />
              </filter>
              <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="85%" stopColor="#FAF7F2" />
                <stop offset="100%" stopColor="#EFE8DD" />
              </radialGradient>
            </defs>

            {/* Background Outer Ring Guide */}
            <circle
              cx={center}
              cy={center}
              r={rOuter + 3}
              fill="none"
              stroke="rgba(184, 134, 11, 0.2)"
              strokeWidth="1.5"
            />

            {/* ── 3 Paryaya Concentric Outer Rim Arcs ── */}
            {/* P1: Prathama (Spokes 1-9: 0° to 120°) */}
            <path
              d={describeWedge(rOuter + 4, rParyayaOuter, 0, 9 * sliceAngle)}
              fill="rgba(184, 134, 11, 0.15)"
              stroke="#B8860B"
              strokeWidth="1"
            />
            {/* P2: Dvitiya (Spokes 10-18: 120° to 240°) */}
            <path
              d={describeWedge(rOuter + 4, rParyayaOuter, 9 * sliceAngle, 18 * sliceAngle)}
              fill="rgba(59, 130, 246, 0.12)"
              stroke="#3B82F6"
              strokeWidth="1"
            />
            {/* P3: Tritiya (Spokes 19-27: 240° to 360°) */}
            <path
              d={describeWedge(rOuter + 4, rParyayaOuter, 18 * sliceAngle, 27 * sliceAngle)}
              fill="rgba(168, 85, 247, 0.12)"
              stroke="#A855F7"
              strokeWidth="1"
            />

            {/* Render 27 Radial Slices */}
            {Array.from({ length: totalSlices }).map((_, idx) => {
              const pos = idx + 1; // 1 to 27
              const item = itemByPos.get(pos);
              if (!item) return null;

              const startAngle = idx * sliceAngle;
              const endAngle = (idx + 1) * sliceAngle;
              const midAngle = startAngle + sliceAngle / 2;

              const isJanmaStar = pos === 1;
              const is27th = pos === 27;
              const isMD = pos === mdPos;
              const isAD = pos === adPos;
              const isSelected = pos === activePos;

              // ── STRICT COLOR RULES PER USER SPECIFICATION ────────────────
              // Red: Vadha (7), Vipat (3), Pratyari (5)
              // Orange: Janma (1, 10, 19)
              // Green: Baki sab (Sampat 2, Kshema 4, Sadhaka 6, Mitra 8, Parama Mitra 9)
              const isAfflicted = [3, 5, 7].includes(item.taraNum);
              const isJanmaTara = item.taraNum === 1;

              let dotColor = "#22C55E"; // Green by default
              let fillColor = isSelected ? "#DCFCE7" : "rgba(34, 197, 94, 0.10)";
              let strokeColor = isSelected ? "#16A34A" : "rgba(34, 197, 94, 0.35)";
              let strokeWidth = isSelected ? "2.5" : "1";
              let taraColor = "#15803D";

              if (isAfflicted) {
                dotColor = "#EF4444"; // Red
                fillColor = isSelected ? "#FEE2E2" : "rgba(239, 68, 68, 0.10)";
                strokeColor = isSelected ? "#DC2626" : "rgba(239, 68, 68, 0.35)";
                taraColor = "#DC2626";
              } else if (isJanmaTara) {
                dotColor = "#F97316"; // Orange
                fillColor = isSelected ? "#FFEDD5" : "rgba(249, 115, 22, 0.12)";
                strokeColor = isSelected ? "#EA580C" : "rgba(249, 115, 22, 0.40)";
                taraColor = "#EA580C";
              }

              // Special highlight enhancements for Birth Star & 27th Star
              if (isJanmaStar && !isSelected) {
                strokeColor = "#D97706";
                strokeWidth = "2";
              } else if (is27th && !isSelected) {
                strokeColor = "#059669";
                strokeWidth = "2";
              }

              // Radial coordinates for text labels & indicators
              const dotCoord = getCoordinates(rOuter - 9, midAngle);
              const outerLabelCoord = getCoordinates(252, midAngle);
              const taraLabelCoord = getCoordinates(224, midAngle);
              const posBadgeCoord = getCoordinates(196, midAngle);
              const natalCoord = getCoordinates(176, midAngle);
              const transitCoord = getCoordinates(124, midAngle);

              // Angle for text rotation (so text stays readable along radius)
              let rotAngle = midAngle - 90;
              if (midAngle > 90 && midAngle < 270) {
                rotAngle += 180;
              }

              // Natal & Transit grahas sitting on this spoke
              const natalGrahas = natalByPos.get(pos) ?? [];
              const transitGrahas = transitByPos.get(pos) ?? [];

              return (
                <g
                  key={pos}
                  className="cursor-pointer transition-all duration-150"
                  onClick={() => setSelectedPos(pos)}
                  onMouseEnter={() => setHoveredPos(pos)}
                  onMouseLeave={() => setHoveredPos(null)}
                >
                  {/* Full Sector Wedge */}
                  <path
                    d={describeWedge(hubRadius, rOuter, startAngle, endAngle)}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={isJanmaStar ? "url(#goldGlow)" : is27th ? "url(#shieldGlow)" : undefined}
                  />

                  {/* Concentric boundary between Ring 1 (Nakshatra) and Ring 2 (Natal) */}
                  <path
                    d={describeWedge(rMiddle, rMiddle + 0.5, startAngle, endAngle)}
                    fill="none"
                    stroke="rgba(184, 134, 11, 0.20)"
                    strokeWidth="1"
                  />

                  {/* Concentric boundary between Ring 2 (Natal) and Ring 3 (Transit) */}
                  <path
                    d={describeWedge(rInner, rInner + 0.5, startAngle, endAngle)}
                    fill="none"
                    stroke="rgba(184, 134, 11, 0.15)"
                    strokeWidth="1"
                  />

                  {/* ── 1. PROMINENT COLOR IDENTIFICATION DOT (Instant Nature Identification) ── */}
                  <circle
                    cx={dotCoord.x}
                    cy={dotCoord.y}
                    r={isJanmaStar || is27th ? 5.5 : 4.5}
                    fill={dotColor}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    filter="url(#shadowFilter)"
                  />
                  {isJanmaStar && (
                    <circle
                      cx={dotCoord.x}
                      cy={dotCoord.y}
                      r="7.5"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="1.2"
                    />
                  )}
                  {is27th && (
                    <circle
                      cx={dotCoord.x}
                      cy={dotCoord.y}
                      r="7.5"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="1.2"
                    />
                  )}

                  {/* ── 2. OUTER NAKSHATRA NAME (High Contrast, Bold, Readable) ── */}
                  <text
                    x={outerLabelCoord.x}
                    y={outerLabelCoord.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9.5"
                    fontWeight={isSelected || isJanmaStar || is27th ? "bold" : "600"}
                    fill="#1A1A1A"
                    transform={`rotate(${rotAngle}, ${outerLabelCoord.x}, ${outerLabelCoord.y})`}
                  >
                    {item.targetNakshatra.name.length > 9
                      ? `${item.targetNakshatra.name.slice(0, 8)}.`
                      : item.targetNakshatra.name}
                  </text>

                  {/* ── 3. TARA NUMBER & ICON ── */}
                  <text
                    x={taraLabelCoord.x}
                    y={taraLabelCoord.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill={taraColor}
                    transform={`rotate(${rotAngle}, ${taraLabelCoord.x}, ${taraLabelCoord.y})`}
                  >
                    {item.tara.icon} T{item.taraNum}
                  </text>

                  {/* ── 4. COUNTED POSITION BADGE (1-27) ── */}
                  <text
                    x={posBadgeCoord.x}
                    y={posBadgeCoord.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8.5"
                    fontWeight={isSelected ? "bold" : "600"}
                    fill="#6B635B"
                  >
                    #{pos}
                  </text>

                  {/* ── 5. RING 2: NATAL GRAHAS (When Mode is NATAL or DUAL) ── */}
                  {(wheelMode === "NATAL" || wheelMode === "NATAL_GOCHAR") &&
                    natalGrahas.length > 0 && (
                      <g>
                        {natalGrahas.map((ng, gIdx) => {
                          const pInfo = PLANET_SYMBOLS[ng.planet] ?? {
                            glyph: "•",
                            short: ng.planet.slice(0, 2),
                            color: "#B8860B",
                          };
                          // Offset if multiple planets in same nakshatra
                          const radOffset = (gIdx - (natalGrahas.length - 1) / 2) * 11;
                          const gCoord = getCoordinates(176 + radOffset, midAngle);

                          return (
                            <g key={gIdx} className="filter drop-shadow-sm">
                              <circle
                                cx={gCoord.x}
                                cy={gCoord.y}
                                r="8.5"
                                fill={ng.isMD ? "#FEF3C7" : "#FFFFFF"}
                                stroke={ng.isMD ? "#D97706" : "rgba(184, 134, 11, 0.4)"}
                                strokeWidth={ng.isMD ? "2" : "1.2"}
                              />
                              <text
                                x={gCoord.x}
                                y={gCoord.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="8"
                                fontWeight="bold"
                                fill={ng.isMD ? "#B45309" : "#1A1A1A"}
                              >
                                {pInfo.glyph}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}

                  {/* ── 6. RING 3: LIVE GOCHAR TRANSIT GRAHAS (When Mode is GOCHAR or DUAL) ── */}
                  {(wheelMode === "GOCHAR" || wheelMode === "NATAL_GOCHAR") &&
                    transitGrahas.length > 0 && (
                      <g>
                        {transitGrahas.map((tg, tIdx) => {
                          const pInfo = PLANET_SYMBOLS[tg.planet] ?? {
                            glyph: "🪐",
                            short: tg.planet.slice(0, 2),
                            color: "#2563EB",
                          };
                          const radOffset = (tIdx - (transitGrahas.length - 1) / 2) * 11;
                          const tCoord = getCoordinates(124 + radOffset, midAngle);

                          return (
                            <g key={tIdx} className="filter drop-shadow-sm">
                              {/* Pulsing ring for live transit */}
                              <circle
                                cx={tCoord.x}
                                cy={tCoord.y}
                                r="10"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="1"
                                opacity="0.6"
                                className="animate-pulse"
                              />
                              <circle
                                cx={tCoord.x}
                                cy={tCoord.y}
                                r="8.5"
                                fill="#EFF6FF"
                                stroke="#2563EB"
                                strokeWidth="1.5"
                              />
                              <text
                                x={tCoord.x}
                                y={tCoord.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="7.5"
                                fontWeight="bold"
                                fill="#1D4ED8"
                              >
                                {pInfo.short}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}
                </g>
              );
            })}

            {/* ── Central Hub Medallion ── */}
            <circle
              cx={center}
              cy={center}
              r={hubRadius}
              fill="url(#hubGradient)"
              stroke="#B8860B"
              strokeWidth="2.5"
              className="filter drop-shadow-md"
            />

            {/* Central Hub Content */}
            <g className="pointer-events-none text-center">
              {/* Crown Tag */}
              <text
                x={center}
                y={center - 54}
                textAnchor="middle"
                fontSize="9"
                letterSpacing="1.2"
                fontWeight="bold"
                fill="#B8860B"
              >
                {currentDisplayItem.isBirthStar
                  ? "★ JANMA NAKSHATRA ★"
                  : currentDisplayItem.isSupportStar
                  ? "🛡️ 27TH SHIELD STAR"
                  : `POS #${currentDisplayItem.countedPosition} · ${currentDisplayItem.paryaya.toUpperCase()}`}
              </text>

              {/* Star Name */}
              <text
                x={center}
                y={center - 24}
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#1A1A1A"
              >
                {currentDisplayItem.targetNakshatra.name}
              </text>

              {/* Star Lord & ID */}
              <text
                x={center}
                y={center - 4}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="600"
                fill="#6B635B"
              >
                Lord: {tp(currentDisplayItem.targetNakshatra.lord)} · #{currentDisplayItem.targetNakshatra.id}
              </text>

              {/* Tara Badge */}
              <text
                x={center}
                y={center + 18}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="bold"
                fill={
                  [3, 5, 7].includes(currentDisplayItem.taraNum)
                    ? "#DC2626"
                    : currentDisplayItem.taraNum === 1
                    ? "#EA580C"
                    : "#15803D"
                }
              >
                {currentDisplayItem.tara.icon} {currentDisplayItem.tara.name} (T{currentDisplayItem.taraNum})
              </text>

              {/* Transit / Natal Alert in Hub */}
              <text
                x={center}
                y={center + 38}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="600"
                fill={
                  activeTransitGrahas.length > 0
                    ? "#1D4ED8"
                    : activeNatalGrahas.length > 0
                    ? "#B45309"
                    : "#6B635B"
                }
              >
                {activeTransitGrahas.length > 0
                  ? `🪐 Transit: ${activeTransitGrahas.map((t) => t.planet).join(", ")}`
                  : activeNatalGrahas.length > 0
                  ? `☉ Natal: ${activeNatalGrahas.map((n) => n.planet).join(", ")}`
                  : `Devta: ${currentDisplayItem.targetNakshatra.devta}`}
              </text>

              <text
                x={center}
                y={center + 56}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="600"
                fill="#B8860B"
              >
                Intensity: {currentDisplayItem.paryayaIntensity} Cycle
              </text>
            </g>
          </svg>

          {/* Active MD / AD Pill indicator */}
          {mdPos && (
            <div
              className="absolute pointer-events-none text-[10px] font-bold text-amber-700 bg-amber-100/95 border border-amber-500/80 px-2.5 py-0.5 rounded-full shadow-sm"
              style={{ bottom: 8 }}
            >
              ⚡ Active MD: {tp(activeMD ?? "Planet")} (Spoke #{mdPos})
            </div>
          )}
        </div>

        {/* ── Side Details Drawer for Clicked / Hovered Star ── */}
        <div className="w-full xl:max-w-md flex flex-col gap-4">
          {/* Active Star Spotlight Card */}
          <div
            className="rounded-3xl p-5 border flex flex-col gap-3.5 transition-all shadow-sm"
            style={{
              background: [3, 5, 7].includes(currentDisplayItem.taraNum)
                ? "rgba(239, 68, 68, 0.03)"
                : currentDisplayItem.taraNum === 1
                ? "rgba(249, 115, 22, 0.03)"
                : "#FFFFFF",
              borderColor: [3, 5, 7].includes(currentDisplayItem.taraNum)
                ? "rgba(239, 68, 68, 0.3)"
                : currentDisplayItem.taraNum === 1
                ? "rgba(249, 115, 22, 0.3)"
                : "rgba(34, 197, 94, 0.25)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-amber-900/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B]">
                    Spoke #{currentDisplayItem.countedPosition} of 27
                  </span>
                  {currentDisplayItem.isBirthStar && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#B8860B]">
                      JANMA STAR
                    </span>
                  )}
                  {currentDisplayItem.isSupportStar && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800">
                      27TH SHIELD
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mt-0.5 flex items-center gap-2">
                  <span>{currentDisplayItem.targetNakshatra.name}</span>
                  <span className="text-sm font-normal text-[#6B635B]">
                    ({currentDisplayItem.targetNakshatra.rashiSpan})
                  </span>
                </h3>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                  [3, 5, 7].includes(currentDisplayItem.taraNum)
                    ? "bg-red-500/15 text-red-700 border border-red-500/30"
                    : currentDisplayItem.taraNum === 1
                    ? "bg-orange-500/15 text-orange-700 border border-orange-500/30"
                    : "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                }`}
              >
                <span>{currentDisplayItem.tara.icon}</span>
                <span>
                  {currentDisplayItem.tara.name} (T{currentDisplayItem.taraNum})
                </span>
              </div>
            </div>

            {/* Navtara Nature Alert Banner */}
            <div
              className={`rounded-2xl p-3 border flex items-start gap-2.5 text-xs ${
                [3, 5, 7].includes(currentDisplayItem.taraNum)
                  ? "bg-red-50/80 border-red-200 text-red-900"
                  : currentDisplayItem.taraNum === 1
                  ? "bg-orange-50/80 border-orange-200 text-orange-950"
                  : "bg-emerald-50/80 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {[3, 5, 7].includes(currentDisplayItem.taraNum) ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
                ) : currentDisplayItem.taraNum === 1 ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 block" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                )}
              </div>
              <div>
                <p className="font-bold">
                  {[3, 5, 7].includes(currentDisplayItem.taraNum)
                    ? "🔴 Afflicted Navtara (Friction & Obstacles)"
                    : currentDisplayItem.taraNum === 1
                    ? "🟠 Janma / Self Category (Physical Body & Grounding)"
                    : "🟢 Auspicious & Supportive Navtara (Expansion & Success)"}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                  {currentDisplayItem.tara.signification}
                </p>
              </div>
            </div>

            {/* Live Gochar Transits on this Star (if any) */}
            {activeTransitGrahas.length > 0 && (
              <div className="rounded-2xl p-3.5 bg-blue-50/70 border border-blue-200 flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span>Live Gochar Transits Active on this Star ({activeTransitGrahas.length})</span>
                </div>
                {activeTransitGrahas.map((tg, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <span>🪐 {tg.planet}</span>
                        <span className="text-[11px] text-[#6B635B]">at {tg.transitLongitude.toFixed(1)}°</span>
                      </p>
                      <p className="text-[10px] text-[#6B635B] mt-0.5">
                        Pada {tg.pada} · Activity: <strong>{tg.activityContext}</strong>
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        [3, 5, 7].includes(tg.taraNum)
                          ? "bg-red-500/15 text-red-700"
                          : tg.taraNum === 1
                          ? "bg-orange-500/15 text-orange-700"
                          : "bg-emerald-500/15 text-emerald-700"
                      }`}
                    >
                      T{tg.taraNum} {tg.tara.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Natal Planets on this Star (if any) */}
            {activeNatalGrahas.length > 0 && (
              <div className="rounded-2xl p-3 bg-amber-50/70 border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <p>
                  <strong>Natal Presence:</strong>{" "}
                  {activeNatalGrahas
                    .map((ng) => `${ng.planet}${ng.isMD ? " (Active MD)" : ""}`)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Practical Guidance */}
            <div className="rounded-2xl p-3 bg-[#FAF7F2] border border-amber-900/10 text-xs">
              <p className="text-[#5C3D00] leading-relaxed">
                <strong>Practical Guidance:</strong> {currentDisplayItem.tara.practicalAdvice}
              </p>
            </div>

            {/* 6 Astrological Anchors Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold text-[#6B635B]">Devta</span>
                <p className="font-bold text-[#1A1A1A] mt-0.5">
                  {currentDisplayItem.targetNakshatra.devta}
                </p>
                <p className="text-[10px] text-[#6B635B] mt-0.5 line-clamp-1">
                  {currentDisplayItem.targetNakshatra.devtaDescription}
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold text-[#6B635B]">Star Lord</span>
                <p className="font-bold text-[#1A1A1A] mt-0.5">
                  {tp(currentDisplayItem.targetNakshatra.lord)}
                </p>
                <p className="text-[10px] text-[#6B635B] mt-0.5">
                  Star #{currentDisplayItem.targetNakshatra.id}
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Flora</span>
                <p className="font-bold text-[#1A1A1A] mt-0.5 line-clamp-1">
                  {currentDisplayItem.targetNakshatra.tree}
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold text-[#6B635B]">Sacred Fauna</span>
                <p className="font-bold text-[#1A1A1A] mt-0.5 line-clamp-1">
                  {currentDisplayItem.targetNakshatra.animal} / {currentDisplayItem.targetNakshatra.bird}
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold text-[#6B635B]">Symbol</span>
                <p className="font-bold text-[#1A1A1A] mt-0.5 line-clamp-1">
                  {currentDisplayItem.targetNakshatra.symbol}
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10">
                <span className="text-[10px] uppercase font-bold text-[#6B635B]">Tattva &amp; Cycle</span>
                <p className="font-bold text-[#1A1A1A] mt-0.5">
                  {currentDisplayItem.targetNakshatra.tattva} · {currentDisplayItem.paryaya}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Legend Guide */}
          <div className="rounded-2xl border border-amber-900/10 bg-[#FAF7F2] p-3.5 flex flex-col gap-2 text-xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#6B635B]">
              Interactive Chakra Color Signs &amp; Indicators
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4A453F]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-white shrink-0" />
                <span>🔴 Red: Vadha (7), Vipat (3), Pratyari (5)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F97316] border border-white shrink-0" />
                <span>🟠 Orange: Janma (1, 10, 19)</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <span className="w-3 h-3 rounded-full bg-[#22C55E] border border-white shrink-0" />
                <span>🟢 Green: Sampat (2), Kshema (4), Sadhaka (6), Mitra (8), Parama Mitra (9)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span>🛡️ 27th Shield Star (Pos 27)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>⚡ Active Dasha Star</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
