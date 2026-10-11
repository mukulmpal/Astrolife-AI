"use client";

import React, { useState } from "react";
import { AKVResult, AKVHouse } from "@/lib/astro-engine/ashtakavarga";
import { TransitPlanetResult } from "@/lib/astro-engine/transits";

const RASHI_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋"
};

interface AshtakavargaChakraInteractiveProps {
  akvResult: AKVResult;
  lagnaNum: number;
  transitPlanets?: TransitPlanetResult[];
}

export function AshtakavargaChakraInteractive({
  akvResult,
  lagnaNum,
  transitPlanets = [],
}: AshtakavargaChakraInteractiveProps) {
  const [selectedHouseIdx, setSelectedHouseIdx] = useState<number>(0);

  const cx = 260;
  const cy = 260;
  const outerR = 230;
  const innerR = 125;

  const houses = akvResult.houses;
  const selectedHouse: AKVHouse = houses[selectedHouseIdx] ?? houses[0];
  const selectedSignIdx = ((lagnaNum + selectedHouseIdx) % 12 + 12) % 12;

  // Transit planets in each house
  const transitInHouse: Record<number, string[]> = {};
  transitPlanets.forEach((p) => {
    const h = p.houseFromBase; // 1 to 12 from lagna
    if (h >= 1 && h <= 12) {
      if (!transitInHouse[h]) transitInHouse[h] = [];
      transitInHouse[h].push(p.planet);
    }
  });

  // Calculate SVG arc slices for 12 houses
  const slices = houses.map((h, i) => {
    // 12 houses starting from top (angle -90 deg) or top-right
    // Each slice is 30 degrees (pi / 6 radians)
    const startAngle = (i * 30 - 105) * (Math.PI / 180);
    const endAngle = ((i + 1) * 30 - 105) * (Math.PI / 180);

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);

    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const midAngle = (startAngle + endAngle) / 2;
    const textR = (outerR + innerR) / 2;
    const textX = cx + textR * Math.cos(midAngle);
    const textY = cy + textR * Math.sin(midAngle);

    const signIdx = ((lagnaNum + i) % 12 + 12) % 12;
    const bindus = h.score;

    // Heatmap color
    const isSelected = i === selectedHouseIdx;
    let fill = "rgba(200, 160, 48, 0.15)";
    let stroke = "rgba(200, 160, 48, 0.35)";

    if (bindus >= 32) {
      fill = isSelected ? "rgba(16, 185, 129, 0.45)" : "rgba(16, 185, 129, 0.22)";
      stroke = "#10b981";
    } else if (bindus >= 28) {
      fill = isSelected ? "rgba(34, 197, 94, 0.45)" : "rgba(34, 197, 94, 0.18)";
      stroke = "#22c55e";
    } else if (bindus >= 25) {
      fill = isSelected ? "rgba(245, 158, 11, 0.45)" : "rgba(245, 158, 11, 0.18)";
      stroke = "#f59e0b";
    } else {
      fill = isSelected ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.18)";
      stroke = "#ef4444";
    }

    const pathData = `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 0 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 0 0 ${x4} ${y4}
      Z
    `;

    return {
      house: h.house,
      index: i,
      pathData,
      fill,
      stroke,
      isSelected,
      textX,
      textY,
      bindus,
      signIdx,
      signSymbol: RASHI_SYMBOLS[signIdx],
      transits: transitInHouse[h.house] ?? [],
    };
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 520px) 1fr", gap: 24, alignItems: "center" }}>
      {/* Chakra SVG */}
      <div style={{ position: "relative", width: "100%", maxWidth: 520, margin: "0 auto" }}>
        <svg viewBox="0 0 520 520" style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.95" />
            </radialGradient>
          </defs>

          {/* Slices */}
          {slices.map((s) => (
            <g
              key={s.house}
              onClick={() => setSelectedHouseIdx(s.index)}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
            >
              <path
                d={s.pathData}
                fill={s.fill}
                stroke={s.isSelected ? "#1A1A1A" : s.stroke}
                strokeWidth={s.isSelected ? 3 : 1.2}
              />
              {/* House & Sign Text */}
              <text
                x={s.textX}
                y={s.textY - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#1A1A1A"
              >
                H{s.house} {s.signSymbol}
              </text>
              <text
                x={s.textX}
                y={s.textY + 6}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={s.bindus >= 28 ? "#15803d" : s.bindus >= 25 ? "#b45309" : "#b91c1c"}
                fontFamily="Cormorant Garamond, serif"
              >
                {s.bindus} pts
              </text>
              {/* Transit Graha tags if present */}
              {s.transits.length > 0 && (
                <text
                  x={s.textX}
                  y={s.textY + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#7E22CE"
                >
                  {s.transits.map((p) => PLANET_SYMBOLS[p] ?? p).join("")}
                </text>
              )}
            </g>
          ))}

          {/* Center Hub */}
          <circle cx={cx} cy={cy} r={innerR - 6} fill="url(#centerGlow)" stroke="rgba(184, 134, 11, 0.4)" strokeWidth="2" />
          <text x={cx} y={cy - 28} textAnchor="middle" fontSize="10" letterSpacing="1.5" textTransform="uppercase" fill="#C8A030" fontWeight="700">
            SARVASHTAKAVARGA
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="38" fontWeight="800" fill="#1A1A1A" fontFamily="Cormorant Garamond, serif">
            {akvResult.sarvaTotal}
          </text>
          <text x={cx} y={cy + 24} textAnchor="middle" fontSize="11" fill="#6B635B">
            Total Bindus (Std 337)
          </text>
          <text x={cx} y={cy + 40} textAnchor="middle" fontSize="10" fill={akvResult.sarvaTotal >= 337 ? "#16a34a" : "#dc2626"} fontWeight="600">
            {akvResult.sarvaTotal >= 337 ? "✦ Auspicious Cosmic Momentum" : "✦ Requires Focused Effort"}
          </text>
        </svg>
      </div>

      {/* Selected House Deep Dive Inspector */}
      <div style={{ background: "#FAF7F2", border: "1px solid rgba(184, 134, 11, 0.25)", borderRadius: 18, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#C8A030", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>
              HOUSE {selectedHouse.house} · {RASHI_NAMES[selectedSignIdx].toUpperCase()} {RASHI_SYMBOLS[selectedSignIdx]}
            </div>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, margin: "2px 0 0", color: "#1A1A1A" }}>
              {selectedHouse.name}
            </h3>
            <div style={{ fontSize: 12, color: "#6B635B", fontStyle: "italic", marginTop: 2 }}>{selectedHouse.theme}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 800, color: selectedHouse.color, lineHeight: 1 }}>
              {selectedHouse.score}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                backgroundColor: selectedHouse.grade === "Strong" ? "rgba(34,197,94,0.15)" : selectedHouse.grade === "Average" ? "rgba(200,160,48,0.2)" : "rgba(239,68,68,0.15)",
                color: selectedHouse.grade === "Strong" ? "#166534" : selectedHouse.grade === "Average" ? "#854d0e" : "#991b1b",
              }}
            >
              {selectedHouse.grade} Delivery
            </span>
          </div>
        </div>

        {/* Live Transits in this house */}
        <div style={{ background: "#FFF", borderRadius: 12, padding: 12, border: "1px solid rgba(184,134,11,0.2)", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7E22CE", textTransform: "uppercase", marginBottom: 4 }}>
            🪐 Current Live Transits in H{selectedHouse.house}
          </div>
          {(transitInHouse[selectedHouse.house] ?? []).length > 0 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {transitInHouse[selectedHouse.house].map((p) => (
                <span
                  key={p}
                  style={{
                    background: "rgba(168,85,247,0.1)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    color: "#6B21A8",
                    padding: "3px 10px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {PLANET_SYMBOLS[p] ?? ""} {p}
                </span>
              ))}
              <span style={{ fontSize: 11.5, color: "#6B635B" }}>
                {selectedHouse.score >= 28
                  ? "Transiting a fertile house: results materialize smoothly."
                  : "Transiting a depleted house: manifests friction, requires conscious remedies."}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#6B635B", margin: 0 }}>
              No major slow planet currently transiting this house.
            </p>
          )}
        </div>

        {/* Top Contributing Grahas */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B635B", textTransform: "uppercase", marginBottom: 6 }}>
            Top Graha Contributors to this House
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {selectedHouse.topPlanets.map((tp, idx) => (
              <span
                key={idx}
                style={{
                  background: "#FFF",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1A1A1A",
                }}
              >
                ✦ {tp}
              </span>
            ))}
          </div>
        </div>

        {/* Classical Interpretation */}
        <div style={{ background: "#FFF", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.15)" }}>
          <strong style={{ fontSize: 12, color: "#1A1A1A" }}>📖 Classical Result & Guidance:</strong>
          <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.7, margin: "6px 0 0" }}>
            {selectedHouse.interp}
          </p>
        </div>
      </div>
    </div>
  );
}
