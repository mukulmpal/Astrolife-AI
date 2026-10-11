// src/components/charts/SarvatobhadraChakraInteractive.tsx
// ============================================================================
// LUXURY INTERACTIVE 9x9 (81-SQUARE) SARVATOBHADRA CHAKRA SVG VISUALIZER
// With real-time laser Vedha rays, cell inspector, sensitive target shields,
// and high-stakes risk evaluation.
// ============================================================================

"use client";

import React, { useState } from "react";
import type {
  SarvatobhadraGridResult,
  SbCell,
  VedhaRay,
} from "@/lib/astro-engine/sarvatobhadra-grid";
import { ShieldAlert, Sparkles, Eye, Info, Check, AlertTriangle } from "lucide-react";

interface SarvatobhadraProps {
  data: SarvatobhadraGridResult;
}

export default function SarvatobhadraChakraInteractive({ data }: SarvatobhadraProps) {
  const [selectedCell, setSelectedCell] = useState<SbCell | null>(null);
  const [activeRayFilter, setActiveRayFilter] = useState<string>("all"); // "all", "Saturn", "Jupiter", "Mars", "none"

  const {
    grid,
    scanDate,
    birthNakshatra,
    sensitiveTargets,
    vedhaRays,
    executiveAssessment,
    headline,
    detailedInsight,
    actionDirectives,
  } = data;

  const PLANET_COLORS: Record<string, string> = {
    Sun: "#F97316",
    Moon: "#C084FC",
    Mars: "#EF4444",
    Mercury: "#22C55E",
    Jupiter: "#F59E0B",
    Venus: "#EC4899",
    Saturn: "#3B82F6",
    Rahu: "#8B5CF6",
    Ketu: "#FB7185",
  };

  const filteredRays =
    activeRayFilter === "none"
      ? []
      : activeRayFilter === "all"
      ? vedhaRays
      : vedhaRays.filter((r) => r.planet === activeRayFilter);

  // SVG dimensions
  const cellSize = 62;
  const padding = 20;
  const svgWidth = cellSize * 9 + padding * 2;
  const svgHeight = cellSize * 9 + padding * 2;

  const getCellCenter = (r: number, c: number) => {
    return {
      x: padding + c * cellSize + cellSize / 2,
      y: padding + r * cellSize + cellSize / 2,
    };
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(184, 134, 11, 0.28)",
        borderRadius: 16,
        padding: "24px 26px",
        boxShadow: "0 4px 24px rgba(184, 134, 11, 0.06)",
      }}
    >
      {/* ── HEADER & ASSESSMENT ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          paddingBottom: 18,
          borderBottom: "1px solid rgba(184, 134, 11, 0.18)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#B8860B",
              marginBottom: 4,
            }}
          >
            🔯 Classical 81-Square Vedic Yantra · {scanDate}
          </div>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            सर्वतोभद्र चक्र (Sarvatobhadra 9x9 Vedha Chakra)
          </h2>
          <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
            जन्म नक्षत्र: <strong>{birthNakshatra}</strong> · 28 नक्षत्र परिधि, 12 राशियां, 16 स्वर, 20 वर्ण एवं 4 शास्त्रीय वेध
          </div>
        </div>

        {/* STATUS BADGE */}
        <div
          style={{
            padding: "8px 16px",
            borderRadius: 12,
            background:
              executiveAssessment === "Auspicious"
                ? "rgba(34, 197, 94, 0.1)"
                : executiveAssessment === "Challenging"
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(245, 158, 11, 0.1)",
            border: `1px solid ${
              executiveAssessment === "Auspicious"
                ? "rgba(34, 197, 94, 0.3)"
                : executiveAssessment === "Challenging"
                ? "rgba(239, 68, 68, 0.3)"
                : "rgba(245, 158, 11, 0.3)"
            }`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {executiveAssessment === "Challenging" ? (
            <AlertTriangle size={18} color="#EF4444" />
          ) : (
            <Sparkles size={18} color="#B8860B" />
          )}
          <div>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                fontWeight: 800,
                color: "#6B635B",
              }}
            >
              तात्कालिक वेध स्थिति
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color:
                  executiveAssessment === "Auspicious"
                    ? "#16A34A"
                    : executiveAssessment === "Challenging"
                    ? "#DC2626"
                    : "#D97706",
              }}
            >
              {executiveAssessment} Zone
            </div>
          </div>
        </div>
      </div>

      {/* ── HEADLINE & INSIGHT BANNER ── */}
      <div
        style={{
          marginTop: 18,
          marginBottom: 20,
          padding: "14px 18px",
          background: "linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(250, 248, 245, 0.9) 100%)",
          borderLeft: "4px solid #B8860B",
          borderRadius: "0 12px 12px 0",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
          {headline}
        </div>
        <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.6, margin: 0 }}>
          {detailedInsight}
        </p>
      </div>

      {/* ── RAY FILTER CHIPS ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#6B635B" }}>वेध किरणें (Filter Rays):</span>
        {["all", "Saturn", "Jupiter", "Mars", "none"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveRayFilter(f)}
            style={{
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 16,
              border: `1px solid ${
                activeRayFilter === f ? "rgba(184, 134, 11, 0.8)" : "rgba(184, 134, 11, 0.25)"
              }`,
              background: activeRayFilter === f ? "rgba(184, 134, 11, 0.15)" : "#FAF8F5",
              color: activeRayFilter === f ? "#B8860B" : "#4A4238",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {f === "all"
              ? "✦ सभी किरणें"
              : f === "none"
              ? "✕ किरणें छिपाएं"
              : `🪐 ${f} Ray`}
          </button>
        ))}
      </div>

      {/* ── 9x9 INTERACTIVE CHAKRA SVG ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "auto",
          padding: "10px 0",
        }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          style={{ maxWidth: 640, height: "auto", display: "block" }}
        >
          <defs>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#B8860B" floodOpacity="0.6" />
            </filter>
            <filter id="maleficGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#DC2626" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Grid Box */}
          <rect
            x={padding}
            y={padding}
            width={cellSize * 9}
            height={cellSize * 9}
            fill="#FAF8F5"
            stroke="rgba(184, 134, 11, 0.4)"
            strokeWidth="2"
            rx="8"
          />

          {/* Render All 81 Cells */}
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const x = padding + c * cellSize;
              const y = padding + r * cellSize;
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;

              // Color styling based on cell type
              let fill = "#FFFFFF";
              let stroke = "rgba(184, 134, 11, 0.22)";
              if (cell.type === "nakshatra") fill = "#FFFDF9";
              if (cell.type === "rashi") fill = "rgba(184, 134, 11, 0.05)";
              if (cell.type === "swara") fill = "rgba(59, 130, 246, 0.04)";
              if (cell.type === "tithi" || cell.type === "vara") fill = "rgba(245, 158, 11, 0.06)";
              if (r === 4 && c === 4) fill = "rgba(184, 134, 11, 0.18)"; // Brahma Sthana

              // Sensitive cell highlights
              if (cell.isJanma) {
                fill = "rgba(184, 134, 11, 0.25)";
                stroke = "#B8860B";
              } else if (cell.isVinaasha) {
                fill = "rgba(239, 68, 68, 0.15)";
                stroke = "#EF4444";
              } else if (cell.isKarma) {
                fill = "rgba(59, 130, 246, 0.15)";
                stroke = "#3B82F6";
              }

              return (
                <g
                  key={`${r}-${c}`}
                  onClick={() => setSelectedCell(cell)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={x + 1}
                    y={y + 1}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    fill={fill}
                    stroke={isSelected ? "#B8860B" : stroke}
                    strokeWidth={isSelected ? "2.5" : "1"}
                    rx="4"
                  />

                  {/* Hindi Label */}
                  <text
                    x={x + cellSize / 2}
                    y={y + (cell.transitPlanets.length > 0 ? 18 : cellSize / 2)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={cell.type === "nakshatra" ? 9.5 : 10.5}
                    fontWeight={cell.isJanma || cell.type === "corner" ? 800 : 700}
                    fill={cell.isJanma ? "#B8860B" : cell.isVinaasha ? "#DC2626" : "#1A1A1A"}
                    fontFamily="Outfit, sans-serif"
                  >
                    {cell.hindiLabel || cell.label}
                  </text>

                  {/* Sensitive Badge Indicator */}
                  {cell.isJanma && (
                    <text
                      x={x + cellSize / 2}
                      y={y + 32}
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="800"
                      fill="#B8860B"
                    >
                      ★ जन्म
                    </text>
                  )}

                  {/* Transiting Planet Badges */}
                  {cell.transitPlanets.length > 0 && (
                    <g transform={`translate(${x + cellSize / 2}, ${y + 44})`}>
                      {cell.transitPlanets.map((tp, idx) => (
                        <circle
                          key={tp}
                          cx={(idx - (cell.transitPlanets.length - 1) / 2) * 12}
                          cy="0"
                          r="5.5"
                          fill={PLANET_COLORS[tp] || "#B8860B"}
                          filter="url(#goldGlow)"
                        />
                      ))}
                      <text
                        x="0"
                        y="1.5"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="6"
                        fontWeight="800"
                        fill="#FFFFFF"
                      >
                        {cell.transitPlanets[0].substring(0, 2)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })
          )}

          {/* Render Active Vedha Laser Rays */}
          {filteredRays.map((ray, rIdx) => {
            const start = getCellCenter(ray.fromRow, ray.fromCol);
            const end = getCellCenter(ray.toRow, ray.toCol);
            const isMalefic = ray.planetNature === "malefic";
            const strokeColor = isMalefic ? "rgba(220, 38, 38, 0.75)" : "rgba(34, 197, 94, 0.75)";

            return (
              <line
                key={rIdx}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={strokeColor}
                strokeWidth={isMalefic ? "2" : "1.5"}
                strokeDasharray={ray.rayType === "vama" || ray.rayType === "dakshina" ? "4,3" : undefined}
                pointerEvents="none"
              />
            );
          })}
        </svg>
      </div>

      {/* ── CELL INSPECTOR MODAL / DRAWER ── */}
      {selectedCell && (
        <div
          style={{
            marginTop: 18,
            padding: "16px 18px",
            background: "#FAF8F5",
            border: "1px solid rgba(184, 134, 11, 0.3)",
            borderRadius: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>
              ✦ चयनित कोष्ठक (Cell Inspector) · Row {selectedCell.row}, Col {selectedCell.col}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginTop: 2 }}>
              {selectedCell.hindiLabel} ({selectedCell.label}) — {selectedCell.type.toUpperCase()}
            </div>
            <div style={{ fontSize: 12.5, color: "#4A4238", marginTop: 4 }}>
              {selectedCell.isJanma && "★ यह आपका जन्म नक्षत्र है (Self, Vitality & Core Identity)."}
              {selectedCell.isKarma && "★ यह आपका कर्म नक्षत्र है (Profession, Authority & Public Status)."}
              {selectedCell.isVinaasha && "⚠️ यह आपका वैनाशिक नक्षत्र है (Accidents, Legal Risk & Critical Caution)."}
              {selectedCell.transitPlanets.length > 0 &&
                `🪐 वर्तमान गोचररत ग्रह: ${selectedCell.transitPlanets.join(", ")}`}
            </div>
          </div>

          <button
            onClick={() => setSelectedCell(null)}
            style={{
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 700,
              background: "transparent",
              border: "1px solid rgba(184, 134, 11, 0.3)",
              borderRadius: 6,
              color: "#B8860B",
              cursor: "pointer",
            }}
          >
            ✕ बंद करें
          </button>
        </div>
      )}

      {/* ── SENSITIVE TARGETS GRID (JANMA, KARMA, VINAASHA, MANASA) ── */}
      <div style={{ marginTop: 24 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#B8860B",
            marginBottom: 10,
          }}
        >
          ✦ 8 संवेदनशील आकाशीय मर्म-बिंदु (Sensitive Karmic Targets)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {sensitiveTargets.map((target, idx) => {
            const hasMaleficStrike = target.activeStrikes.some((s) => s.nature === "malefic");
            return (
              <div
                key={idx}
                style={{
                  padding: "12px 14px",
                  background: hasMaleficStrike ? "rgba(239, 68, 68, 0.04)" : "#FAF8F5",
                  border: `1px solid ${
                    hasMaleficStrike ? "rgba(239, 68, 68, 0.3)" : "rgba(184, 134, 11, 0.2)"
                  }`,
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>
                    {target.name}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: 8,
                      background: hasMaleficStrike ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
                      color: hasMaleficStrike ? "#DC2626" : "#16A34A",
                    }}
                  >
                    {target.vedhaCount} Vedhas
                  </span>
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, color: "#B8860B", marginTop: 2 }}>
                  नक्षत्र: {target.nakshatra}
                </div>

                <div style={{ fontSize: 11.5, color: "#6B635B", marginTop: 4 }}>
                  {target.shastricSignificance}
                </div>

                {target.activeStrikes.length > 0 && (
                  <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: hasMaleficStrike ? "#DC2626" : "#16A34A" }}>
                    स्ट्राइक: {target.activeStrikes.map((s) => `${s.planet} (${s.rayType})`).join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ACTION DIRECTIVES ── */}
      {actionDirectives.length > 0 && (
        <div
          style={{
            marginTop: 22,
            padding: "16px 18px",
            background: "rgba(184, 134, 11, 0.06)",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: "#B8860B", marginBottom: 6 }}>
            ✦ सर्वतोभद्र चक्र सुरक्षा व क्रियान्वयन निर्देश
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              fontSize: 13,
              color: "#3D3834",
              lineHeight: 1.65,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {actionDirectives.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
