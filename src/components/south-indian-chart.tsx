"use client";

import React from "react";

const PLS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const PABBR = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];
const PCOL = ["#f97316", "#c084fc", "#ef4444", "#22c55e", "#f59e0b", "#ec4899", "#60a5fa", "#a78bfa", "#fb7185"];

const RASHIS_SHORT = [
  "Mesha (Ari)", "Vrish (Tau)", "Mith (Gem)", "Karka (Can)",
  "Simha (Leo)", "Kanya (Vir)", "Tula (Lib)", "Vrisch (Sco)",
  "Dhanu (Sag)", "Makara (Cap)", "Kumbha (Aqu)", "Meena (Pis)",
];

interface PlanetData {
  house: number;
  signNum?: number;
  rashi?: number;
  rashiIndex?: number;
  signIndex?: number;
  retrograde: boolean;
}

interface SouthIndianChartProps {
  lagnaNum: number;
  planets: Record<string, PlanetData>;
  size?: number;
  centerTitle?: string;
  centerSubtitle?: string;
}

// 4x4 Grid coordinates for the 12 fixed South Indian zodiac signs
// Clockwise from top-second:
// Row 0: Pisces(11), Aries(0), Taurus(1), Gemini(2)
// Row 1: Aquarius(10), [CENTER], [CENTER], Cancer(3)
// Row 2: Capricorn(9),  [CENTER], [CENTER], Leo(4)
// Row 3: Sagittarius(8), Scorpio(7), Libra(6), Virgo(5)
const SOUTH_INDIAN_BOXES: Record<number, { row: number; col: number }> = {
  11: { row: 0, col: 0 }, // Pisces
  0:  { row: 0, col: 1 }, // Aries
  1:  { row: 0, col: 2 }, // Taurus
  2:  { row: 0, col: 3 }, // Gemini
  3:  { row: 1, col: 3 }, // Cancer
  4:  { row: 2, col: 3 }, // Leo
  5:  { row: 3, col: 3 }, // Virgo
  6:  { row: 3, col: 2 }, // Libra
  7:  { row: 3, col: 1 }, // Scorpio
  8:  { row: 3, col: 0 }, // Sagittarius
  9:  { row: 2, col: 0 }, // Capricorn
  10: { row: 1, col: 0 }, // Aquarius
};

export default function SouthIndianChart({
  lagnaNum,
  planets,
  size = 320,
  centerTitle = "Lagna Chart",
  centerSubtitle = "South Indian",
}: SouthIndianChartProps) {
  const cellSize = size / 4;

  // Group planets by sign index (0 to 11)
  const planetsBySign: Record<number, Array<{ name: string; abbr: string; color: string; retro: boolean }>> = {};
  for (let i = 0; i < 12; i++) {
    planetsBySign[i] = [];
  }

  PLS.forEach((pName, pIdx) => {
    const pd = planets[pName];
    if (!pd) return;

    // Resolve sign index: signIndex -> signNum -> rashi -> derived from house
    let sIdx = pd.signIndex ?? pd.signNum ?? pd.rashi ?? pd.rashiIndex;
    if (sIdx === undefined) {
      sIdx = ((lagnaNum + (pd.house - 1)) % 12 + 12) % 12;
    }
    sIdx = ((sIdx % 12) + 12) % 12;

    if (planetsBySign[sIdx]) {
      planetsBySign[sIdx].push({
        name: pName,
        abbr: PABBR[pIdx],
        color: PCOL[pIdx],
        retro: Boolean(pd.retrograde),
      });
    }
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        background: "#FFFFFF",
        border: "1.5px solid rgba(184, 134, 11, 0.35)",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* 4x4 Grid */}
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* Outer boundary */}
        <rect x={0} y={0} width={size} height={size} fill="none" stroke="#B8860B" strokeWidth="2" />

        {/* Grid lines */}
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <line
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={size}
              stroke="rgba(184, 134, 11, 0.25)"
              strokeWidth="1"
            />
            <line
              x1={0}
              y1={i * cellSize}
              x2={size}
              y2={i * cellSize}
              stroke="rgba(184, 134, 11, 0.25)"
              strokeWidth="1"
            />
          </React.Fragment>
        ))}

        {/* Center Box Cover */}
        <rect
          x={cellSize}
          y={cellSize}
          width={cellSize * 2}
          height={cellSize * 2}
          fill="#FAF7F2"
          stroke="#B8860B"
          strokeWidth="1.5"
        />

        {/* Center Text */}
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          fill="#1A1A1A"
          fontSize={size > 300 ? 14 : 12}
          fontWeight="700"
          fontFamily="'Cormorant Garamond', Georgia, serif"
        >
          {centerTitle}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          fill="#B8860B"
          fontSize={size > 300 ? 10.5 : 9}
          letterSpacing="1px"
          style={{ textTransform: "uppercase" }}
        >
          {centerSubtitle}
        </text>
      </svg>

      {/* Render 12 Sign Boxes */}
      {Object.entries(SOUTH_INDIAN_BOXES).map(([signStr, { row, col }]) => {
        const signIdx = Number(signStr);
        const isLagna = signIdx === lagnaNum;
        const houseNum = ((signIdx - lagnaNum + 12) % 12) + 1;
        const boxPlanets = planetsBySign[signIdx] || [];

        return (
          <div
            key={signIdx}
            style={{
              position: "absolute",
              top: row * cellSize,
              left: col * cellSize,
              width: cellSize,
              height: cellSize,
              padding: "4px 6px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              background: isLagna ? "rgba(184, 134, 11, 0.1)" : "transparent",
            }}
          >
            {/* Box Header: Sign Name & House Badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: size > 300 ? "9.5px" : "8.5px",
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  color: isLagna ? "#B8860B" : "#6B635B",
                  fontWeight: isLagna ? 700 : 500,
                  fontSize: "8.5px",
                }}
              >
                {RASHIS_SHORT[signIdx].split(" ")[0]}
              </span>

              <span
                style={{
                  fontSize: "8.5px",
                  color: isLagna ? "#B8860B" : "#8C827A",
                  fontWeight: 600,
                }}
              >
                H{houseNum}
              </span>
            </div>

            {/* Lagna / Ascendant Tag */}
            {isLagna && (
              <div
                style={{
                  alignSelf: "flex-start",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#B8860B",
                  padding: "1px 4px",
                  borderRadius: "3px",
                  letterSpacing: "0.5px",
                  lineHeight: 1.1,
                  margin: "2px 0",
                }}
              >
                ASC
              </div>
            )}

            {/* Planets in Box */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "3px 5px",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              {boxPlanets.map((p) => (
                <span
                  key={p.name}
                  style={{
                    fontSize: size > 300 ? "11px" : "9.5px",
                    fontWeight: 700,
                    color: p.color,
                    display: "inline-flex",
                    alignItems: "center",
                    lineHeight: 1,
                  }}
                >
                  {p.abbr}
                  {p.retro && (
                    <span
                      style={{
                        fontSize: "8px",
                        color: "#ef4444",
                        marginLeft: "1px",
                      }}
                    >
                      (R)
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

