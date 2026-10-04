"use client";

import React, { useMemo } from "react";
import type {
  TransitPlanet,
  TransitPlanetPosition,
  DrishtiHit,
  HouseClusterAnalysis,
} from "@/lib/astro-engine/transit-ripple/types";

export interface RippleRadarProps {
  lagnaSign: number; // 0 to 11
  lagnaSignName?: string;
  transitPositions: Record<TransitPlanet, TransitPlanetPosition>;
  selectedPlanet: TransitPlanet;
  onSelectPlanet: (planet: TransitPlanet) => void;
  selectedHouse: number | null;
  onSelectHouse: (house: number | null) => void;
  houseClusters: Record<number, HouseClusterAnalysis>;
  hotspotHouses: number[];
  drishtiHitsForSelected: DrishtiHit[];
  language?: "hinglish" | "english";
}

const PLANET_CONFIG: Record<
  TransitPlanet,
  {
    abbr: string;
    label: string;
    icon: string;
    color: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    border: string;
  }
> = {
  Saturn: {
    abbr: "Sa",
    label: "Saturn",
    icon: "🪐",
    color: "#7C3AED",
    bg: "rgba(124, 58, 237, 0.16)",
    badgeBg: "#7C3AED",
    badgeText: "#FFFFFF",
    border: "#7C3AED",
  },
  Jupiter: {
    abbr: "Ju",
    label: "Jupiter",
    icon: "🌟",
    color: "#D97706",
    bg: "rgba(217, 119, 6, 0.16)",
    badgeBg: "#D97706",
    badgeText: "#FFFFFF",
    border: "#D97706",
  },
  Rahu: {
    abbr: "Ra",
    label: "Rahu",
    icon: "⚡",
    color: "#9333EA",
    bg: "rgba(147, 51, 234, 0.16)",
    badgeBg: "#9333EA",
    badgeText: "#FFFFFF",
    border: "#9333EA",
  },
  Ketu: {
    abbr: "Ke",
    label: "Ketu",
    icon: "🔥",
    color: "#E11D48",
    bg: "rgba(225, 29, 72, 0.16)",
    badgeBg: "#E11D48",
    badgeText: "#FFFFFF",
    border: "#E11D48",
  },
  Mars: {
    abbr: "Ma",
    label: "Mars",
    icon: "🔴",
    color: "#DC2626",
    bg: "rgba(220, 38, 38, 0.16)",
    badgeBg: "#DC2626",
    badgeText: "#FFFFFF",
    border: "#DC2626",
  },
  Sun: {
    abbr: "Su",
    label: "Sun",
    icon: "☀️",
    color: "#EA580C",
    bg: "rgba(234, 88, 12, 0.16)",
    badgeBg: "#EA580C",
    badgeText: "#FFFFFF",
    border: "#EA580C",
  },
  Venus: {
    abbr: "Ve",
    label: "Venus",
    icon: "✨",
    color: "#059669",
    bg: "rgba(5, 150, 105, 0.16)",
    badgeBg: "#059669",
    badgeText: "#FFFFFF",
    border: "#059669",
  },
  Mercury: {
    abbr: "Me",
    label: "Mercury",
    icon: "🌿",
    color: "#0891B2",
    bg: "rgba(8, 145, 178, 0.16)",
    badgeBg: "#0891B2",
    badgeText: "#FFFFFF",
    border: "#0891B2",
  },
  Moon: {
    abbr: "Mo",
    label: "Moon",
    icon: "🌙",
    color: "#475569",
    bg: "rgba(71, 85, 105, 0.16)",
    badgeBg: "#475569",
    badgeText: "#FFFFFF",
    border: "#475569",
  },
};

const PLANET_LIST: TransitPlanet[] = [
  "Saturn",
  "Jupiter",
  "Rahu",
  "Ketu",
  "Mars",
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
];

const S = 500;
const h = S / 2; // 250
const q = S / 4; // 125
const tq = (3 * S) / 4; // 375
const e = S / 8; // 62.5
const se = (7 * S) / 8; // 437.5

// Precise house centroid points for North Indian Kundli (S = 500)
const HOUSE_CENTROIDS: Record<number, { x: number; y: number }> = {
  1: { x: h, y: q },
  2: { x: q, y: e },
  3: { x: e, y: q },
  4: { x: q, y: h },
  5: { x: e, y: tq },
  6: { x: q, y: se },
  7: { x: h, y: tq },
  8: { x: tq, y: se },
  9: { x: se, y: tq },
  10: { x: tq, y: h },
  11: { x: se, y: q },
  12: { x: tq, y: e },
};

// Geometric boundary polygons for all 12 houses (S = 500)
const HOUSE_POLYGONS: Record<number, string> = {
  1: `${h},0 ${q},${q} ${h},${h} ${tq},${q}`,
  2: `0,0 ${h},0 ${q},${q}`,
  3: `0,0 ${q},${q} 0,${h}`,
  4: `0,${h} ${q},${q} ${h},${h} ${q},${tq}`,
  5: `0,${h} ${q},${tq} 0,${S}`,
  6: `0,${S} ${q},${tq} ${h},${S}`,
  7: `${h},${S} ${q},${tq} ${h},${h} ${tq},${tq}`,
  8: `${h},${S} ${tq},${tq} ${S},${S}`,
  9: `${S},${S} ${tq},${tq} ${S},${h}`,
  10: `${S},${h} ${tq},${tq} ${h},${h} ${tq},${q}`,
  11: `${S},${h} ${tq},${q} ${S},0`,
  12: `${S},0 ${tq},${q} ${h},0`,
};

export function RippleRadar({
  lagnaSign,
  lagnaSignName,
  transitPositions,
  selectedPlanet,
  onSelectPlanet,
  selectedHouse,
  onSelectHouse,
  houseClusters,
  hotspotHouses,
  drishtiHitsForSelected,
  language = "hinglish",
}: RippleRadarProps) {
  // Map planets to their transit houses
  const planetsByHouse = useMemo(() => {
    const map: Record<number, TransitPlanet[]> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    for (const [pName, pPos] of Object.entries(transitPositions)) {
      if (pPos && pPos.house >= 1 && pPos.house <= 12) {
        map[pPos.house].push(pName as TransitPlanet);
      }
    }
    return map;
  }, [transitPositions]);

  const activeEpicenterHouse = transitPositions[selectedPlanet]?.house || 1;
  const activeColor = PLANET_CONFIG[selectedPlanet]?.color || "#F59E0B";

  // Build curved rays for aspects of the selected planet
  const curvedRays = useMemo(() => {
    const rays: Array<{
      id: string;
      path: string;
      label: string;
      targetHouse: number;
      labelX: number;
      labelY: number;
      isHotspot: boolean;
    }> = [];

    const fromCenter = HOUSE_CENTROIDS[activeEpicenterHouse];
    if (!fromCenter) return rays;

    for (const hit of drishtiHitsForSelected) {
      const toCenter = HOUSE_CENTROIDS[hit.targetHouse];
      if (!toCenter) continue;

      const mx = (fromCenter.x + toCenter.x) / 2;
      const my = (fromCenter.y + toCenter.y) / 2;

      // Arc curvature calculation: push control point outward or tangential
      const dx = mx - h;
      const dy = my - h;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      let cx = mx;
      let cy = my;

      if (distFromCenter < 30) {
        // Line passes close to center (opposite houses like 1->7 or 4->10)
        // Add perpendicular bulge to avoid colliding with center lines
        const perpX = -(toCenter.y - fromCenter.y) * 0.25;
        const perpY = (toCenter.x - fromCenter.x) * 0.25;
        cx = mx + perpX;
        cy = my + perpY;
      } else {
        // Curve outward generously
        cx = mx + dx * 0.38;
        cy = my + dy * 0.38;
      }

      // Bezier curve path
      const path = `M ${fromCenter.x},${fromCenter.y} Q ${cx},${cy} ${toCenter.x},${toCenter.y}`;
      const isHotspot = hotspotHouses.includes(hit.targetHouse);

      rays.push({
        id: `${selectedPlanet}-${hit.targetHouse}-${hit.aspectRule.name}`,
        path,
        label: hit.aspectRule.name,
        targetHouse: hit.targetHouse,
        labelX: cx,
        labelY: cy,
        isHotspot,
      });
    }

    return rays;
  }, [activeEpicenterHouse, drishtiHitsForSelected, selectedPlanet, hotspotHouses]);

  return (
    <div className="w-full flex flex-col items-center bg-[#FFFDF9] dark:bg-[#141210] border-2 border-[#B8860B]/40 rounded-3xl p-4 sm:p-6 shadow-md">
      <style>{`
        @keyframes pulseHaloLarge {
          0% { r: 24px; opacity: 0.9; stroke-width: 3px; }
          50% { r: 44px; opacity: 0.2; stroke-width: 1.5px; }
          100% { r: 24px; opacity: 0.9; stroke-width: 3px; }
        }
        @keyframes flowRaysBold {
          to { stroke-dashoffset: -40; }
        }
        .anim-pulse-halo-lg {
          animation: pulseHaloLarge 2.2s infinite ease-in-out;
        }
        .anim-flow-rays-bold {
          stroke-dasharray: 8 6;
          animation: flowRaysBold 1.1s linear infinite;
        }
      `}</style>

      {/* Header bar: Title & Hotspot Badge */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 border-b-2 border-[#B8860B]/20 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
          <h3 className="text-lg sm:text-xl font-serif font-extrabold text-[#1F1914] dark:text-[#FAF5EB] tracking-wide">
            {language === "hinglish" ? "🧭 रिपल रडार (Ripple Radar)" : "🧭 Transit Ripple Radar"}
          </h3>
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#B8860B]/15 text-[#92400E] dark:text-[#F3D59B] border border-[#B8860B]/40">
            North Indian Kundli
          </span>
        </div>

        {hotspotHouses.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/25 to-amber-600/25 text-amber-900 dark:text-amber-200 border-2 border-amber-500/50 shadow-sm">
            <span>⚡ Multi-Ray Hotspot:</span>
            {hotspotHouses.map((hNum) => (
              <span
                key={hNum}
                onClick={() => onSelectHouse(hNum)}
                className="cursor-pointer underline text-amber-800 dark:text-amber-300 font-black hover:text-amber-600"
              >
                H{hNum} ({houseClusters[hNum]?.totalRays} Rays)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Planet Selector Bar (Pill Buttons with high contrast) */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
        {PLANET_LIST.map((p) => {
          const cfg = PLANET_CONFIG[p];
          const pos = transitPositions[p];
          const isSelected = p === selectedPlanet;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                onSelectPlanet(p);
                if (pos?.house) onSelectHouse(pos.house);
              }}
              style={{
                borderColor: isSelected ? cfg.color : "rgba(184, 134, 11, 0.35)",
                backgroundColor: isSelected ? cfg.bg : "transparent",
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 text-xs sm:text-sm transition-all duration-150 ${
                isSelected
                  ? "shadow-md scale-105 font-black text-[#1F1914] dark:text-white"
                  : "font-semibold text-[#4A3E36] dark:text-[#D5CDBF] hover:bg-[#B8860B]/10 hover:border-[#B8860B]/60"
              }`}
            >
              <span className="text-base">{cfg.icon}</span>
              <span className="font-bold">{p}</span>
              <span
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg shadow-xs"
                style={{
                  backgroundColor: isSelected ? cfg.badgeBg : "rgba(184,134,11,0.2)",
                  color: isSelected ? "#FFFFFF" : "#4A3E36",
                }}
              >
                H{pos?.house ?? "?"}
              </span>
            </button>
          );
        })}
      </div>

      {/* High-Visibility North Indian SVG Radar Container */}
      <div className="relative w-full max-w-[540px] aspect-square select-none my-2 drop-shadow-xl">
        <svg
          viewBox={`0 0 ${S} ${S}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Bold Arrow Marker for Drishti Rays */}
            <marker
              id="goldArrowBold"
              viewBox="0 0 12 12"
              refX="8"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 11 6 L 0 11 z" fill={activeColor} />
            </marker>

            {/* Glowing filter for high visibility */}
            <filter id="radarGlowHigh" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 12 House Polygons */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
            const isEpicenter = houseNum === activeEpicenterHouse;
            const isSelected = houseNum === selectedHouse;
            const isAspectTarget = drishtiHitsForSelected.some(
              (hit) => hit.targetHouse === houseNum
            );
            const isHotspot = hotspotHouses.includes(houseNum);
            const cluster = houseClusters[houseNum];

            // Calculate Rashi Number for this house: (lagnaSign + houseNum - 1) % 12 + 1
            const rashiNum = ((lagnaSign + houseNum - 1) % 12) + 1;

            // Fill color logic with high contrast
            let fillColor = "#FFFDF9";
            if (isEpicenter) {
              fillColor = PLANET_CONFIG[selectedPlanet]?.bg || "rgba(234, 179, 8, 0.22)";
            } else if (isHotspot) {
              fillColor = "rgba(245, 158, 11, 0.18)";
            } else if (isAspectTarget) {
              fillColor = "rgba(234, 179, 8, 0.12)";
            } else if (isSelected) {
              fillColor = "rgba(184, 134, 11, 0.15)";
            }

            return (
              <g
                key={`house-polygon-${houseNum}`}
                onClick={() => onSelectHouse(houseNum)}
                className="cursor-pointer transition-colors duration-200"
              >
                <polygon
                  points={HOUSE_POLYGONS[houseNum]}
                  fill={fillColor}
                  stroke={
                    isEpicenter
                      ? activeColor
                      : isHotspot
                      ? "#D97706"
                      : isSelected
                      ? "#B8860B"
                      : "#B8860B"
                  }
                  strokeWidth={isEpicenter ? 3.5 : isHotspot ? 3 : isSelected ? 2.8 : 1.8}
                  strokeOpacity={isEpicenter || isHotspot || isSelected ? 1 : 0.65}
                />

                {/* House & Rashi watermark numbers */}
                {(() => {
                  const pt = HOUSE_CENTROIDS[houseNum];
                  return (
                    <>
                      {/* Rashi Number in classical top corner - BOLD & CLEAR */}
                      <g transform={`translate(${pt.x - 26}, ${pt.y - 18})`}>
                        <circle r="9" fill="#B8860B" fillOpacity="0.15" />
                        <text
                          x="0"
                          y="4"
                          fontSize="11"
                          fontWeight="900"
                          fill="#92400E"
                          textAnchor="middle"
                        >
                          {rashiNum}
                        </text>
                      </g>

                      {/* House Label tag - BOLD & DISTINCT */}
                      <g transform={`translate(${pt.x + 26}, ${pt.y - 18})`}>
                        <rect
                          x="-14"
                          y="-8"
                          width="28"
                          height="16"
                          rx="5"
                          fill="#4A3E36"
                          fillOpacity="0.85"
                        />
                        <text
                          x="0"
                          y="3.5"
                          fontSize="10"
                          fontWeight="800"
                          fill="#FFFFFF"
                          textAnchor="middle"
                        >
                          H{houseNum}
                        </text>
                      </g>

                      {/* Hotspot ray count badge if >= 2 */}
                      {cluster && cluster.totalRays >= 2 && (
                        <g transform={`translate(${pt.x}, ${pt.y + 28})`}>
                          <rect
                            x="-24"
                            y="-9"
                            width="48"
                            height="18"
                            rx="9"
                            fill="#D97706"
                            stroke="#FFFFFF"
                            strokeWidth="1.2"
                            filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.25))"
                          />
                          <text
                            x="0"
                            y="4"
                            fontSize="10"
                            fontWeight="900"
                            fill="#FFFFFF"
                            textAnchor="middle"
                          >
                            ⚡{cluster.totalRays} RAYS
                          </text>
                        </g>
                      )}
                    </>
                  );
                })()}
              </g>
            );
          })}

          {/* North Indian Main Kundli Outer Borders and Diagonals - HIGH VISIBILITY */}
          <rect
            x="0"
            y="0"
            width={S}
            height={S}
            fill="none"
            stroke="#92400E"
            strokeWidth="3.5"
          />
          {/* Main X diagonals */}
          <line
            x1="0"
            y1="0"
            x2={S}
            y2={S}
            stroke="#B8860B"
            strokeWidth="2.2"
            strokeOpacity="0.85"
          />
          <line
            x1={S}
            y1="0"
            x2="0"
            y2={S}
            stroke="#B8860B"
            strokeWidth="2.2"
            strokeOpacity="0.85"
          />
          {/* Diamond Rhombus connecting midpoints */}
          <polygon
            points={`${h},0 0,${h} ${h},${S} ${S},${h}`}
            fill="none"
            stroke="#B8860B"
            strokeWidth="2.5"
            strokeOpacity="0.9"
          />

          {/* Active Epicenter Radiant Halo Circle */}
          {(() => {
            const epiCenter = HOUSE_CENTROIDS[activeEpicenterHouse];
            if (!epiCenter) return null;
            return (
              <g>
                <circle
                  cx={epiCenter.x}
                  cy={epiCenter.y}
                  r="34"
                  fill="none"
                  stroke={activeColor}
                  strokeWidth="2.5"
                  className="anim-pulse-halo-lg"
                  filter="url(#radarGlowHigh)"
                />
                <circle
                  cx={epiCenter.x}
                  cy={epiCenter.y}
                  r="10"
                  fill={activeColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            );
          })()}

          {/* Animated Curved Drishti Rays - THICK, LUMINOUS & VIBRANT */}
          {curvedRays.map((ray) => (
            <g key={ray.id}>
              {/* Underlying glowing background path */}
              <path
                d={ray.path}
                fill="none"
                stroke={activeColor}
                strokeWidth={ray.isHotspot ? "5" : "3.8"}
                strokeOpacity="0.55"
                filter="url(#radarGlowHigh)"
              />
              {/* Moving flowing dashed beam with high contrast */}
              <path
                d={ray.path}
                fill="none"
                stroke={activeColor}
                strokeWidth={ray.isHotspot ? "3.6" : "2.6"}
                markerEnd="url(#goldArrowBold)"
                className="anim-flow-rays-bold"
              />
              {/* Floating Ray Name Tag at control apex */}
              <g transform={`translate(${ray.labelX}, ${ray.labelY})`}>
                <rect
                  x="-28"
                  y="-10"
                  width="56"
                  height="20"
                  rx="10"
                  fill="#1F1914"
                  stroke={activeColor}
                  strokeWidth="1.8"
                  filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                />
                <text
                  x="0"
                  y="4"
                  fontSize="9.5"
                  fontWeight="900"
                  fill="#FFFFFF"
                  textAnchor="middle"
                >
                  {ray.label}
                </text>
              </g>
            </g>
          ))}

          {/* Render High-Visibility Planet Badges inside each House */}
          {Object.entries(planetsByHouse).map(([hStr, pList]) => {
            const houseNum = Number(hStr);
            const pt = HOUSE_CENTROIDS[houseNum];
            if (!pt || pList.length === 0) return null;

            return (
              <g key={`planets-in-h-${houseNum}`}>
                {pList.map((p, pIdx) => {
                  const cfg = PLANET_CONFIG[p];
                  const isSel = p === selectedPlanet;

                  // High-visibility badge layout
                  const total = pList.length;
                  const offsetX = (pIdx - (total - 1) / 2) * 32;
                  const offsetY = total > 2 ? (pIdx % 2 === 0 ? -6 : 10) : 2;

                  return (
                    <g
                      key={p}
                      transform={`translate(${pt.x + offsetX}, ${pt.y + offsetY})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlanet(p);
                        onSelectHouse(houseNum);
                      }}
                      className="cursor-pointer"
                    >
                      {/* Selected Planet Pulsing Ring */}
                      {isSel && (
                        <circle
                          r="16"
                          fill={cfg.color}
                          fillOpacity="0.35"
                          stroke={cfg.color}
                          strokeWidth="2.5"
                          className="animate-pulse"
                        />
                      )}

                      {/* Planet Pill Badge */}
                      <rect
                        x="-14"
                        y="-10"
                        width="28"
                        height="20"
                        rx="6"
                        fill={cfg.badgeBg}
                        stroke="#FFFFFF"
                        strokeWidth={isSel ? 2 : 1.2}
                        filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.28))"
                      />

                      {/* Planet Abbreviation & Emoji */}
                      <text
                        x="0"
                        y="4"
                        fontSize="11"
                        fontWeight="900"
                        fill="#FFFFFF"
                        textAnchor="middle"
                      >
                        {cfg.abbr}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick Footnote Legend - High Contrast */}
      <div className="w-full mt-4 flex flex-wrap items-center justify-between text-xs text-[#4A3E36] dark:text-[#E2C785] pt-3.5 border-t-2 border-[#B8860B]/20 font-semibold">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm"
              style={{ backgroundColor: activeColor }}
            />
            <strong className="text-sm">{selectedPlanet}</strong> (Epicenter H{activeEpicenterHouse})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-600 dark:text-amber-400 font-extrabold text-sm">⚡</span>
            <span>Hotspot (2+ Drishti Rays)</span>
          </span>
        </div>
        <div className="text-amber-800 dark:text-amber-300 font-bold">
          {language === "hinglish"
            ? "👆 किसी भी ग्रह या भाव पर टैप करें"
            : "👆 Tap any Planet or House to inspect"}
        </div>
      </div>
    </div>
  );
}
