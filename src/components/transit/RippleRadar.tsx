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
    bg: "rgba(124, 58, 237, 0.12)",
    badgeBg: "#7C3AED",
    badgeText: "#FFFFFF",
    border: "#7C3AED",
  },
  Jupiter: {
    abbr: "Ju",
    label: "Jupiter",
    icon: "🌟",
    color: "#B8860B",
    bg: "rgba(184, 134, 11, 0.15)",
    badgeBg: "#B8860B",
    badgeText: "#FFFFFF",
    border: "#B8860B",
  },
  Rahu: {
    abbr: "Ra",
    label: "Rahu",
    icon: "⚡",
    color: "#9333EA",
    bg: "rgba(147, 51, 234, 0.12)",
    badgeBg: "#9333EA",
    badgeText: "#FFFFFF",
    border: "#9333EA",
  },
  Ketu: {
    abbr: "Ke",
    label: "Ketu",
    icon: "🔥",
    color: "#D97706",
    bg: "rgba(217, 119, 6, 0.12)",
    badgeBg: "#D97706",
    badgeText: "#FFFFFF",
    border: "#D97706",
  },
  Mars: {
    abbr: "Ma",
    label: "Mars",
    icon: "🔴",
    color: "#DC2626",
    bg: "rgba(220, 38, 38, 0.12)",
    badgeBg: "#DC2626",
    badgeText: "#FFFFFF",
    border: "#DC2626",
  },
  Sun: {
    abbr: "Su",
    label: "Sun",
    icon: "☀️",
    color: "#EA580C",
    bg: "rgba(234, 88, 12, 0.12)",
    badgeBg: "#EA580C",
    badgeText: "#FFFFFF",
    border: "#EA580C",
  },
  Venus: {
    abbr: "Ve",
    label: "Venus",
    icon: "✨",
    color: "#059669",
    bg: "rgba(5, 150, 105, 0.12)",
    badgeBg: "#059669",
    badgeText: "#FFFFFF",
    border: "#059669",
  },
  Mercury: {
    abbr: "Me",
    label: "Mercury",
    icon: "🌿",
    color: "#0891B2",
    bg: "rgba(8, 145, 178, 0.12)",
    badgeBg: "#0891B2",
    badgeText: "#FFFFFF",
    border: "#0891B2",
  },
  Moon: {
    abbr: "Mo",
    label: "Moon",
    icon: "🌙",
    color: "#475569",
    bg: "rgba(71, 85, 105, 0.12)",
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

// Safe non-overlapping positions for Rashi numbers and House labels
// Placed along vertices or perimeters so planet badges never collide with them
const HOUSE_TAG_POSITIONS: Record<
  number,
  { rashi: { x: number; y: number }; label: { x: number; y: number } }
> = {
  1: { rashi: { x: 250, y: 44 }, label: { x: 250, y: 68 } },
  2: { rashi: { x: 62, y: 28 }, label: { x: 94, y: 28 } },
  3: { rashi: { x: 28, y: 65 }, label: { x: 28, y: 92 } },
  4: { rashi: { x: 44, y: 250 }, label: { x: 72, y: 250 } },
  5: { rashi: { x: 28, y: 435 }, label: { x: 28, y: 408 } },
  6: { rashi: { x: 62, y: 472 }, label: { x: 94, y: 472 } },
  7: { rashi: { x: 250, y: 456 }, label: { x: 250, y: 432 } },
  8: { rashi: { x: 438, y: 472 }, label: { x: 406, y: 472 } },
  9: { rashi: { x: 472, y: 435 }, label: { x: 472, y: 408 } },
  10: { rashi: { x: 456, y: 250 }, label: { x: 428, y: 250 } },
  11: { rashi: { x: 472, y: 65 }, label: { x: 472, y: 92 } },
  12: { rashi: { x: 438, y: 28 }, label: { x: 406, y: 28 } },
};

// Safe cluster centers for planet badges inside each house
const PLANET_CLUSTER_CENTERS: Record<
  number,
  { x: number; y: number; orientation: "horizontal" | "vertical" }
> = {
  1: { x: 250, y: 145, orientation: "horizontal" },
  2: { x: 125, y: 76, orientation: "horizontal" },
  3: { x: 72, y: 135, orientation: "vertical" },
  4: { x: 145, y: 250, orientation: "vertical" },
  5: { x: 72, y: 365, orientation: "vertical" },
  6: { x: 125, y: 424, orientation: "horizontal" },
  7: { x: 250, y: 355, orientation: "horizontal" },
  8: { x: 375, y: 424, orientation: "horizontal" },
  9: { x: 428, y: 365, orientation: "vertical" },
  10: { x: 355, y: 250, orientation: "vertical" },
  11: { x: 428, y: 135, orientation: "vertical" },
  12: { x: 375, y: 76, orientation: "horizontal" },
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
  const activeColor = PLANET_CONFIG[selectedPlanet]?.color || "#B8860B";

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

      // Arc curvature calculation: push control point outward
      const dx = mx - h;
      const dy = my - h;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      let cx = mx;
      let cy = my;

      if (distFromCenter < 35) {
        // Line passes close to center (opposite houses like 1->7 or 4->10)
        const perpX = -(toCenter.y - fromCenter.y) * 0.28;
        const perpY = (toCenter.x - fromCenter.x) * 0.28;
        cx = mx + perpX;
        cy = my + perpY;
      } else {
        // Curve outward generously
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
    <div
      className="w-full flex flex-col items-center rounded-2xl p-4 sm:p-6 transition-all"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(184, 134, 11, 0.28)",
        boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
      }}
    >
      <style>{`
        @keyframes pulseHaloLarge {
          0% { r: 18px; opacity: 0.85; stroke-width: 2px; }
          50% { r: 32px; opacity: 0.15; stroke-width: 1px; }
          100% { r: 18px; opacity: 0.85; stroke-width: 2px; }
        }
        @keyframes flowRaysBold {
          to { stroke-dashoffset: -30; }
        }
        .anim-pulse-halo-lg {
          animation: pulseHaloLarge 2.2s infinite ease-in-out;
        }
        .anim-flow-rays-bold {
          stroke-dasharray: 6 5;
          animation: flowRaysBold 1.2s linear infinite;
        }
      `}</style>

      {/* Header bar: Title & Hotspot Badge */}
      <div
        className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-3"
        style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🧭</span>
          <h3
            className="font-serif text-lg sm:text-xl font-bold tracking-tight"
            style={{ color: "#1A1A1A" }}
          >
            {language === "hinglish" ? "रिपल रडार कुंडली" : "Transit Ripple Radar"}
          </h3>
          <span
            className="font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full"
            style={{
              background: "#FAF5EB",
              color: "#8C6508",
              border: "1px solid rgba(184, 134, 11, 0.25)",
            }}
          >
            North Indian Chart
          </span>
        </div>

        {hotspotHouses.length > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-xs"
            style={{
              background: "#FFFDF5",
              color: "#8C6508",
              border: "1px solid rgba(184, 134, 11, 0.4)",
            }}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider">
              ⚡ Multi-Ray Hotspot:
            </span>
            {hotspotHouses.map((hNum) => (
              <span
                key={hNum}
                onClick={() => onSelectHouse(hNum)}
                className="cursor-pointer underline font-bold hover:text-[#B8860B]"
              >
                H{hNum} ({houseClusters[hNum]?.totalRays} Rays)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Planet Selector Bar (Clean AstroLife Manuscript Pills) */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-3 mb-3 scrollbar-thin">
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
                background: isSelected ? "#FFFDF5" : "#FAF5EB",
                borderColor: isSelected ? "#B8860B" : "rgba(184, 134, 11, 0.22)",
                boxShadow: isSelected
                  ? "0 2px 6px rgba(184, 134, 11, 0.18)"
                  : "none",
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                isSelected
                  ? "border-2 font-bold text-[#1A1A1A] scale-[1.02]"
                  : "text-[#5C5248] hover:text-[#1A1A1A] hover:border-[#B8860B]"
              }`}
            >
              <span className="text-sm">{cfg.icon}</span>
              <span className="font-semibold">{p}</span>
              <span
                className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded"
                style={{
                  background: isSelected
                    ? "rgba(184, 134, 11, 0.2)"
                    : "#FFFFFF",
                  color: "#8C6508",
                  border: "1px solid rgba(184, 134, 11, 0.2)",
                }}
              >
                H{pos?.house ?? "?"}
              </span>
            </button>
          );
        })}
      </div>

      {/* AstroLife Editorial North Indian SVG Radar Container */}
      <div
        className="relative w-full max-w-[520px] aspect-square select-none my-2 rounded-xl overflow-hidden"
        style={{
          boxShadow: "0 6px 24px -6px rgba(184, 134, 11, 0.2)",
          border: "1px solid rgba(184, 134, 11, 0.35)",
        }}
      >
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-full">
          <defs>
            {/* Golden Arrow Marker for Drishti Rays */}
            <marker
              id="goldArrowMarker"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#B8860B" />
            </marker>

            {/* Subtle glow filter */}
            <filter
              id="goldRayGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Kundli Base Parchment Background */}
          <rect x="0" y="0" width={S} height={S} fill="#FAF7F2" />

          {/* 2. 12 House Polygons with AstroLife Manuscript Fills */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
            const isEpicenter = houseNum === activeEpicenterHouse;
            const isSelected = houseNum === selectedHouse;
            const isAspectTarget = drishtiHitsForSelected.some(
              (hit) => hit.targetHouse === houseNum
            );
            const isHotspot = hotspotHouses.includes(houseNum);

            let fillColor = "#FFFFFF";
            if (isEpicenter) {
              fillColor = "rgba(184, 134, 11, 0.16)";
            } else if (isHotspot) {
              fillColor = "rgba(217, 119, 6, 0.14)";
            } else if (isAspectTarget) {
              fillColor = "rgba(184, 134, 11, 0.08)";
            } else if (isSelected) {
              fillColor = "rgba(184, 134, 11, 0.18)";
            }

            return (
              <polygon
                key={`house-poly-${houseNum}`}
                points={HOUSE_POLYGONS[houseNum]}
                fill={fillColor}
                stroke={
                  isEpicenter
                    ? "#B8860B"
                    : isHotspot
                    ? "#D97706"
                    : isSelected
                    ? "#B8860B"
                    : "rgba(184, 134, 11, 0.35)"
                }
                strokeWidth={
                  isEpicenter ? 2.5 : isHotspot ? 2.2 : isSelected ? 2.2 : 1.2
                }
                onClick={() => onSelectHouse(houseNum)}
                className="cursor-pointer transition-colors duration-200"
              />
            );
          })}

          {/* 3. North Indian Diamond & Diagonal Structural Haurlines */}
          {/* Main X Diagonals */}
          <line
            x1="0"
            y1="0"
            x2={S}
            y2={S}
            stroke="rgba(184, 134, 11, 0.35)"
            strokeWidth="1.4"
          />
          <line
            x1={S}
            y1="0"
            x2="0"
            y2={S}
            stroke="rgba(184, 134, 11, 0.35)"
            strokeWidth="1.4"
          />
          {/* Diamond Rhombus connecting midpoints */}
          <polygon
            points={`${h},0 0,${h} ${h},${S} ${S},${h}`}
            fill="none"
            stroke="rgba(184, 134, 11, 0.55)"
            strokeWidth="1.8"
          />

          {/* 4. Outer Boundary Frame */}
          <rect
            x="0"
            y="0"
            width={S}
            height={S}
            fill="none"
            stroke="#B8860B"
            strokeWidth="2.8"
          />

          {/* 5. Non-Overlapping Rashi & House Watermarks along outer vertices */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
            const rashiNum = ((lagnaSign + houseNum - 1) % 12) + 1;
            const tagPos = HOUSE_TAG_POSITIONS[houseNum];
            const cluster = houseClusters[houseNum];

            return (
              <g
                key={`house-tags-${houseNum}`}
                onClick={() => onSelectHouse(houseNum)}
                className="cursor-pointer"
              >
                {/* Rashi Circle Badge */}
                <circle
                  cx={tagPos.rashi.x}
                  cy={tagPos.rashi.y}
                  r="8"
                  fill="#FAF5EB"
                  stroke="rgba(184, 134, 11, 0.35)"
                  strokeWidth="1"
                />
                <text
                  x={tagPos.rashi.x}
                  y={tagPos.rashi.y + 3.2}
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  fill="#8C6508"
                  textAnchor="middle"
                >
                  {rashiNum}
                </text>

                {/* Subtle House Label Watermark */}
                <text
                  x={tagPos.label.x}
                  y={tagPos.label.y + 3}
                  fontSize="8.5"
                  fontWeight="600"
                  fontFamily="monospace"
                  fill="#8C8276"
                  textAnchor="middle"
                >
                  H{houseNum}
                </text>

                {/* Hotspot Ray Tag if 2+ rays */}
                {cluster && cluster.totalRays >= 2 && (
                  <g
                    transform={`translate(${
                      houseNum === 1
                        ? 250
                        : houseNum === 7
                        ? 250
                        : houseNum === 4
                        ? 180
                        : houseNum === 10
                        ? 320
                        : tagPos.label.x
                    }, ${
                      houseNum === 1
                        ? 195
                        : houseNum === 7
                        ? 305
                        : houseNum === 4
                        ? 250
                        : houseNum === 10
                        ? 250
                        : tagPos.label.y + (houseNum > 6 ? -16 : 16)
                    })`}
                  >
                    <rect
                      x="-18"
                      y="-7"
                      width="36"
                      height="14"
                      rx="4"
                      fill="#B8860B"
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fontSize="8"
                      fontWeight="bold"
                      fill="#FFFFFF"
                      textAnchor="middle"
                    >
                      ⚡{cluster.totalRays}R
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 6. Active Epicenter Radiant Halo Pulse */}
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
                  stroke="#B8860B"
                  strokeWidth="2"
                  className="anim-pulse-halo-lg"
                  filter="url(#goldRayGlow)"
                />
                <circle
                  cx={epiCenter.x}
                  cy={epiCenter.y}
                  r="6"
                  fill="#B8860B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            );
          })()}

          {/* 7. Curved Drishti Aspect Rays (Warm Golden Beams) */}
          {curvedRays.map((ray) => (
            <g key={ray.id}>
              {/* Underlying glowing ambient ray */}
              <path
                d={ray.path}
                fill="none"
                stroke="#B8860B"
                strokeWidth={ray.isHotspot ? "3.8" : "2.6"}
                strokeOpacity="0.45"
                filter="url(#goldRayGlow)"
              />
              {/* Animated flowing golden dash ray */}
              <path
                d={ray.path}
                fill="none"
                stroke={ray.isHotspot ? "#D97706" : "#B8860B"}
                strokeWidth={ray.isHotspot ? "2.6" : "1.8"}
                markerEnd="url(#goldArrowMarker)"
                className="anim-flow-rays-bold"
              />
              {/* Compact Floating Ray Capsule */}
              <g transform={`translate(${ray.labelX}, ${ray.labelY})`}>
                <rect
                  x="-25"
                  y="-8"
                  width="50"
                  height="16"
                  rx="4"
                  fill="#1A1A1A"
                  stroke="#B8860B"
                  strokeWidth="1"
                  opacity="0.92"
                />
                <text
                  x="0"
                  y="3.5"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#D4AF37"
                  textAnchor="middle"
                >
                  {ray.label}
                </text>
              </g>
            </g>
          ))}

          {/* 8. Planet Badges Clustered Safely inside House Cavities */}
          {Object.entries(planetsByHouse).map(([hStr, pList]) => {
            const houseNum = Number(hStr);
            const clusterMeta = PLANET_CLUSTER_CENTERS[houseNum];
            if (!clusterMeta || pList.length === 0) return null;

            const total = pList.length;

            return (
              <g key={`planets-in-h-${houseNum}`}>
                {pList.map((p, pIdx) => {
                  const cfg = PLANET_CONFIG[p];
                  const isSel = p === selectedPlanet;

                  // Clean stacking offsets so badges never exceed borders
                  let offsetX = 0;
                  let offsetY = 0;

                  if (clusterMeta.orientation === "horizontal") {
                    offsetX = (pIdx - (total - 1) / 2) * 27;
                    offsetY = total > 2 ? (pIdx % 2 === 0 ? -4 : 8) : 0;
                  } else {
                    offsetY = (pIdx - (total - 1) / 2) * 20;
                    offsetX = total > 2 ? (pIdx % 2 === 0 ? -4 : 8) : 0;
                  }

                  const posX = clusterMeta.x + offsetX;
                  const posY = clusterMeta.y + offsetY;

                  return (
                    <g
                      key={p}
                      transform={`translate(${posX}, ${posY})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlanet(p);
                        onSelectHouse(houseNum);
                      }}
                      className="cursor-pointer"
                    >
                      {/* Active Planet Pulsing Ring */}
                      {isSel && (
                        <circle
                          r="13"
                          fill="none"
                          stroke={cfg.border}
                          strokeWidth="1.8"
                          strokeDasharray="3 2"
                          className="animate-pulse"
                        />
                      )}

                      {/* Planet Badge Rect */}
                      <rect
                        x="-12"
                        y="-8.5"
                        width="24"
                        height="17"
                        rx="4"
                        fill="#FFFFFF"
                        stroke={cfg.border}
                        strokeWidth={isSel ? 2 : 1.2}
                        filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.15))"
                      />

                      {/* Planet Abbreviation */}
                      <text
                        x="0"
                        y="3.5"
                        fontSize="9"
                        fontWeight="bold"
                        fill={cfg.border}
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

      {/* Quick Footnote Legend */}
      <div
        className="w-full mt-3 flex flex-wrap items-center justify-between text-xs pt-3"
        style={{
          borderTop: "1px solid rgba(184, 134, 11, 0.2)",
          color: "#5C5248",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: activeColor }}
            />
            <strong className="text-[#1A1A1A]">{selectedPlanet}</strong>{" "}
            (Epicenter H{activeEpicenterHouse})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">⚡</span>
            <span>Hotspot (2+ Drishti Rays)</span>
          </span>
        </div>
        <div className="font-semibold text-[#8C6508]">
          {language === "hinglish"
            ? "✦ किसी भी ग्रह या भाव पर टैप करें"
            : "✦ Tap any planet or house to inspect"}
        </div>
      </div>
    </div>
  );
}
