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
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  Saturn: {
    label: "Saturn",
    icon: "🪐",
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.12)",
    border: "#8B5CF6",
  },
  Jupiter: {
    label: "Jupiter",
    icon: "🌟",
    color: "#EAB308",
    bg: "rgba(234, 179, 8, 0.12)",
    border: "#EAB308",
  },
  Rahu: {
    label: "Rahu",
    icon: "⚡",
    color: "#A855F7",
    bg: "rgba(168, 85, 247, 0.12)",
    border: "#A855F7",
  },
  Ketu: {
    label: "Ketu",
    icon: "🔥",
    color: "#EC4899",
    bg: "rgba(236, 72, 153, 0.12)",
    border: "#EC4899",
  },
  Mars: {
    label: "Mars",
    icon: "🔴",
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "#EF4444",
  },
  Sun: {
    label: "Sun",
    icon: "☀️",
    color: "#F97316",
    bg: "rgba(249, 115, 22, 0.12)",
    border: "#F97316",
  },
  Venus: {
    label: "Venus",
    icon: "✨",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "#10B981",
  },
  Mercury: {
    label: "Mercury",
    icon: "🌿",
    color: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.12)",
    border: "#06B6D4",
  },
  Moon: {
    label: "Moon",
    icon: "🌙",
    color: "#64748B",
    bg: "rgba(100, 116, 139, 0.12)",
    border: "#64748B",
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

const S = 400;
const h = S / 2; // 200
const q = S / 4; // 100
const tq = (3 * S) / 4; // 300
const e = S / 8; // 50
const se = (7 * S) / 8; // 350

// Precise house centroid points for North Indian Kundli
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

// Geometric boundary polygons for all 12 houses
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

      if (distFromCenter < 25) {
        // Line passes close to center (opposite houses like 1->7 or 4->10)
        // Add perpendicular bulge to avoid colliding with center lines
        const perpX = -(toCenter.y - fromCenter.y) * 0.22;
        const perpY = (toCenter.x - fromCenter.x) * 0.22;
        cx = mx + perpX;
        cy = my + perpY;
      } else {
        // Curve outward slightly
        cx = mx + dx * 0.35;
        cy = my + dy * 0.35;
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
    <div className="w-full flex flex-col items-center bg-[#FAF7F2] dark:bg-[#121110] border border-[#B8860B]/25 rounded-2xl p-4 sm:p-6 shadow-sm">
      <style>{`
        @keyframes pulseHalo {
          0% { r: 16px; opacity: 0.85; }
          50% { r: 28px; opacity: 0.25; }
          100% { r: 16px; opacity: 0.85; }
        }
        @keyframes flowRays {
          to { stroke-dashoffset: -32; }
        }
        .anim-pulse-halo {
          animation: pulseHalo 2.4s infinite ease-in-out;
        }
        .anim-flow-rays {
          stroke-dasharray: 6 5;
          animation: flowRays 1.2s linear infinite;
        }
      `}</style>

      {/* Header bar: Title & Hotspot Badge */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#B8860B]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D241E] dark:text-[#F3EDE2] tracking-wide">
            {language === "hinglish" ? "🧭 रिपल रडार (Ripple Radar)" : "🧭 Transit Ripple Radar"}
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/30">
            North Indian Kundli
          </span>
        </div>

        {hotspotHouses.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span>⚡ Multi-Ray Hotspot:</span>
            {hotspotHouses.map((hNum) => (
              <span
                key={hNum}
                onClick={() => onSelectHouse(hNum)}
                className="cursor-pointer underline font-bold"
              >
                H{hNum} ({houseClusters[hNum]?.totalRays} Rays)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Planet Selector Bar (Pill Buttons) */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
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
                borderColor: isSelected ? cfg.color : "rgba(184, 134, 11, 0.2)",
                backgroundColor: isSelected ? cfg.bg : "transparent",
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 ${
                isSelected
                  ? "shadow-sm scale-105 font-bold"
                  : "opacity-80 hover:opacity-100 hover:bg-[#B8860B]/5"
              }`}
            >
              <span>{cfg.icon}</span>
              <span className="text-[#2D241E] dark:text-[#E8E2D6]">{p}</span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.2 rounded"
                style={{
                  backgroundColor: isSelected ? cfg.color : "rgba(184,134,11,0.15)",
                  color: isSelected ? "#FFFFFF" : "#6B635B",
                }}
              >
                H{pos?.house ?? "?"}
              </span>
            </button>
          );
        })}
      </div>

      {/* The Interactive North Indian SVG Radar */}
      <div className="relative w-full max-w-[420px] aspect-square select-none">
        <svg
          viewBox={`0 0 ${S} ${S}`}
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Arrow Marker for Drishti Rays */}
            <marker
              id="goldArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill={activeColor} />
            </marker>

            {/* Glowing filter */}
            <filter id="radarGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
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

            // Fill color logic
            let fillColor = "#FAF7F2";
            if (isEpicenter) {
              fillColor = PLANET_CONFIG[selectedPlanet]?.bg || "rgba(234, 179, 8, 0.18)";
            } else if (isHotspot) {
              fillColor = "rgba(245, 158, 11, 0.14)";
            } else if (isAspectTarget) {
              fillColor = "rgba(234, 179, 8, 0.08)";
            } else if (isSelected) {
              fillColor = "rgba(184, 134, 11, 0.1)";
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
                      ? "#F59E0B"
                      : isSelected
                      ? "#B8860B"
                      : "rgba(184, 134, 11, 0.38)"
                  }
                  strokeWidth={isEpicenter || isHotspot ? 2.2 : 1.2}
                />

                {/* House & Rashi watermark numbers */}
                {(() => {
                  const pt = HOUSE_CENTROIDS[houseNum];
                  return (
                    <>
                      {/* Rashi Number in subtle corner */}
                      <text
                        x={pt.x - 18}
                        y={pt.y - 12}
                        fontSize="9"
                        fontWeight="700"
                        fill="rgba(184, 134, 11, 0.6)"
                        textAnchor="middle"
                      >
                        {rashiNum}
                      </text>

                      {/* Small House Label tag */}
                      <text
                        x={pt.x + 18}
                        y={pt.y - 12}
                        fontSize="8.5"
                        fontWeight="600"
                        fill="#8C827A"
                        textAnchor="middle"
                      >
                        H{houseNum}
                      </text>

                      {/* Hotspot ray count badge if >= 2 */}
                      {cluster && cluster.totalRays >= 2 && (
                        <g>
                          <rect
                            x={pt.x - 14}
                            y={pt.y + 14}
                            width="28"
                            height="13"
                            rx="6.5"
                            fill="#F59E0B"
                          />
                          <text
                            x={pt.x}
                            y={pt.y + 23.5}
                            fontSize="8"
                            fontWeight="800"
                            fill="#FFFFFF"
                            textAnchor="middle"
                          >
                            ⚡{cluster.totalRays}R
                          </text>
                        </g>
                      )}
                    </>
                  );
                })()}
              </g>
            );
          })}

          {/* North Indian Main Kundli Outer Borders and Diagonals */}
          <rect
            x="0"
            y="0"
            width={S}
            height={S}
            fill="none"
            stroke="rgba(184, 134, 11, 0.55)"
            strokeWidth="2.5"
          />
          {/* Main X diagonals */}
          <line
            x1="0"
            y1="0"
            x2={S}
            y2={S}
            stroke="rgba(184, 134, 11, 0.4)"
            strokeWidth="1.4"
          />
          <line
            x1={S}
            y1="0"
            x2="0"
            y2={S}
            stroke="rgba(184, 134, 11, 0.4)"
            strokeWidth="1.4"
          />
          {/* Diamond Rhombus connecting midpoints */}
          <polygon
            points={`${h},0 0,${h} ${h},${S} ${S},${h}`}
            fill="none"
            stroke="rgba(184, 134, 11, 0.45)"
            strokeWidth="1.6"
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
                  r="24"
                  fill="none"
                  stroke={activeColor}
                  strokeWidth="2"
                  className="anim-pulse-halo"
                  filter="url(#radarGlow)"
                />
                <circle
                  cx={epiCenter.x}
                  cy={epiCenter.y}
                  r="7"
                  fill={activeColor}
                />
              </g>
            );
          })()}

          {/* Animated Curved Drishti Rays */}
          {curvedRays.map((ray) => (
            <g key={ray.id}>
              {/* Underlying glow path */}
              <path
                d={ray.path}
                fill="none"
                stroke={activeColor}
                strokeWidth={ray.isHotspot ? "3.2" : "2.2"}
                strokeOpacity="0.45"
              />
              {/* Moving flowing dashed beam */}
              <path
                d={ray.path}
                fill="none"
                stroke={activeColor}
                strokeWidth={ray.isHotspot ? "2.6" : "1.8"}
                markerEnd="url(#goldArrow)"
                className="anim-flow-rays"
              />
              {/* Ray Name Tag at control apex */}
              <g transform={`translate(${ray.labelX}, ${ray.labelY})`}>
                <rect
                  x="-22"
                  y="-8"
                  width="44"
                  height="16"
                  rx="8"
                  fill="#2D241E"
                  stroke={activeColor}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3.5"
                  fontSize="7.5"
                  fontWeight="700"
                  fill="#F3EDE2"
                  textAnchor="middle"
                >
                  {ray.label}
                </text>
              </g>
            </g>
          ))}

          {/* Render Planet Icons inside each House */}
          {Object.entries(planetsByHouse).map(([hStr, pList]) => {
            const houseNum = Number(hStr);
            const pt = HOUSE_CENTROIDS[houseNum];
            if (!pt || pList.length === 0) return null;

            return (
              <g key={`planets-in-h-${houseNum}`}>
                {pList.map((p, pIdx) => {
                  const cfg = PLANET_CONFIG[p];
                  const isSel = p === selectedPlanet;

                  // Simple horizontal/vertical layout if multiple planets
                  const total = pList.length;
                  const offsetX = (pIdx - (total - 1) / 2) * 16;
                  const offsetY = total > 3 ? (pIdx % 2 === 0 ? -4 : 6) : 0;

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
                      {isSel && (
                        <circle
                          r="11"
                          fill={cfg.color}
                          fillOpacity="0.3"
                          stroke={cfg.color}
                          strokeWidth="1.5"
                        />
                      )}
                      <text
                        x="0"
                        y="4"
                        fontSize={isSel ? "12" : "10"}
                        textAnchor="middle"
                        filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.3))"
                      >
                        {cfg.icon}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick Footnote Legend */}
      <div className="w-full mt-4 flex flex-wrap items-center justify-between text-[11px] text-[#6B635B] dark:text-[#A8A29E] pt-3 border-t border-[#B8860B]/15">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor }} />
            <strong>{selectedPlanet}</strong> (Epicenter H{activeEpicenterHouse})
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-500 font-bold">⚡</span>
            Hotspot (Multi-Ray Overlap)
          </span>
        </div>
        <div>
          {language === "hinglish"
            ? "👆 Kisi bhi Planet ya Ghar par tap karein"
            : "👆 Tap any Planet or House to inspect"}
        </div>
      </div>
    </div>
  );
}

