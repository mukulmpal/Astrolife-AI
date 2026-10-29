"use client";

import React, { useState } from "react";
import {
  OuterPlanetKey,
  OuterPlanetEvaluationResult,
  OUTER_PLANETS_CONFIG,
} from "@/lib/astro-engine/outer-planets-engine";

interface Props {
  evaluations: OuterPlanetEvaluationResult[];
  activePlanetKeys: OuterPlanetKey[];
  onTogglePlanet?: (key: OuterPlanetKey) => void;
}

export default function OuterPlanetsDossierCard({
  evaluations,
  activePlanetKeys,
  onTogglePlanet,
}: Props) {
  const [selectedKey, setSelectedKey] = useState<OuterPlanetKey>(
    activePlanetKeys.length > 0 ? activePlanetKeys[0] : "URANUS"
  );

  // If active planets change, ensure selectedKey is valid
  const currentKey = activePlanetKeys.includes(selectedKey)
    ? selectedKey
    : activePlanetKeys.length > 0
    ? activePlanetKeys[0]
    : "URANUS";

  const activeEval = evaluations.find((e) => e.planet === currentKey);
  const config = OUTER_PLANETS_CONFIG[currentKey];

  if (!activeEval || !config) return null;

  const planetThemes: Record<OuterPlanetKey, { themeColor: string; bgSoft: string; icon: string; border: string }> = {
    URANUS: {
      themeColor: "#0891b2",
      bgSoft: "rgba(6, 182, 212, 0.08)",
      icon: "⚡",
      border: "rgba(6, 182, 212, 0.35)",
    },
    NEPTUNE: {
      themeColor: "#7c3aed",
      bgSoft: "rgba(124, 58, 237, 0.08)",
      icon: "🌊",
      border: "rgba(124, 58, 237, 0.35)",
    },
    PLUTO: {
      themeColor: "#b91c1c",
      bgSoft: "rgba(185, 28, 28, 0.08)",
      icon: "🌋",
      border: "rgba(185, 28, 28, 0.35)",
    },
  };

  const theme = planetThemes[currentKey];

  return (
    <div
      style={{
        marginTop: 16,
        padding: "16px 18px",
        background: "#FAF7F2",
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
      }}
    >
      {/* Top Header & Planet Switcher Pills */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          borderBottom: "1px solid rgba(184, 134, 11, 0.2)",
          paddingBottom: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{theme.icon}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8A6008", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Modern Graha Knowledge &amp; Predictions
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>
              {activeEval.hindiName} ({config.name}) · {activeEval.devanagariName}
            </div>
          </div>
        </div>

        {/* Planet Tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {evaluations.map((ev) => {
            const isSelected = ev.planet === currentKey;
            const t = planetThemes[ev.planet];
            return (
              <button
                key={ev.planet}
                type="button"
                onClick={() => {
                  setSelectedKey(ev.planet);
                  if (onTogglePlanet && !activePlanetKeys.includes(ev.planet)) {
                    onTogglePlanet(ev.planet);
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? t.themeColor : "rgba(184, 134, 11, 0.25)"}`,
                  background: isSelected ? t.themeColor : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#4B443B",
                  fontSize: 11.5,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{t.icon}</span>
                <span>{ev.hindiName}</span>
                <span style={{ fontSize: 10, opacity: isSelected ? 0.9 : 0.6 }}>H{ev.house}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Status Bar: House, Sign, Dignity, Strength */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div style={{ padding: "8px 10px", background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(184,134,11,0.15)" }}>
          <div style={{ fontSize: 9.5, color: "#8C8278", textTransform: "uppercase", fontWeight: 700 }}>Position</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1A1A1A" }}>
            {activeEval.rashiName} ({activeEval.degreeInRashi}°) · {activeEval.house}th House
          </div>
        </div>

        <div style={{ padding: "8px 10px", background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(184,134,11,0.15)" }}>
          <div style={{ fontSize: 9.5, color: "#8C8278", textTransform: "uppercase", fontWeight: 700 }}>Motion State</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: activeEval.motionState === "RETROGRADE" ? "#D97706" : "#059669" }}>
            {activeEval.motionState} {activeEval.motionState === "RETROGRADE" ? "(Vakri)" : "(Margi)"}
          </div>
        </div>

        <div style={{ padding: "8px 10px", background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(184,134,11,0.15)" }}>
          <div style={{ fontSize: 9.5, color: "#8C8278", textTransform: "uppercase", fontWeight: 700 }}>Strength Score</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: activeEval.strengthScore >= 3.0 ? "#059669" : "#DC2626" }}>
            {activeEval.strengthScore} / 5.0 · {activeEval.isAfflicted ? "Afflicted (Friction)" : "Harmonious"}
          </div>
        </div>

        <div style={{ padding: "8px 10px", background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(184,134,11,0.15)" }}>
          <div style={{ fontSize: 9.5, color: "#8C8278", textTransform: "uppercase", fontWeight: 700 }}>Decanate / Boost</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: activeEval.hasSepharialVibrationBoost ? "#0891b2" : "#1A1A1A" }}>
            Decanate {activeEval.decanate} {activeEval.hasSepharialVibrationBoost ? "⚡ Sepharial Boost" : ""}
          </div>
        </div>
      </div>

      {/* Core Prediction Box (Table A + Table B Synthesis) */}
      <div
        style={{
          padding: "12px 14px",
          background: theme.bgSoft,
          border: `1px solid ${theme.border}`,
          borderRadius: 10,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 13 }}>📜</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: theme.themeColor, textTransform: "uppercase" }}>
            Natal Prediction &amp; Synthesis
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: "#1F2937", fontWeight: 500 }}>
          {activeEval.synthesis}
        </p>
      </div>

      {/* Esoteric & Clinical Knowledge Base Attributes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {/* Knowledge & Esoterics */}
        <div
          style={{
            padding: "10px 12px",
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.18)",
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8A6008", textTransform: "uppercase", marginBottom: 6 }}>
            💎 Esoteric &amp; Planetary Significations
          </div>
          <div style={{ fontSize: 11.5, color: "#374151", display: "flex", flexDirection: "column", gap: 5 }}>
            <div>
              <strong>Higher Octave: </strong>
              <span style={{ color: "#4B5563" }}>{activeEval.higherOctaveOf}</span>
            </div>
            <div>
              <strong>Chakra Center: </strong>
              <span style={{ color: "#4B5563" }}>{activeEval.chakra}</span>
            </div>
            <div>
              <strong>Power Colors: </strong>
              <span style={{ color: "#4B5563" }}>{activeEval.powerColors.join(", ")}</span>
            </div>
            <div>
              <strong>Zodiac Cycle: </strong>
              <span style={{ color: "#4B5563" }}>{config.cycleYears} years (~{Math.round(config.cycleYears / 12)} yrs per sign)</span>
            </div>
          </div>
        </div>

        {/* Gift vs Shadow Dynamics */}
        <div
          style={{
            padding: "10px 12px",
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.18)",
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8A6008", textTransform: "uppercase", marginBottom: 6 }}>
            ⚖️ Psychological &amp; Karmic Dynamics
          </div>
          <div style={{ fontSize: 11.5, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ color: "#059669", fontWeight: 700 }}>✦ Gift:</span>
              <span style={{ color: "#374151" }}>
                {activeEval.planet === "URANUS" && "Intuitive flashes, inventive genius, freedom from dogmas, scientific breakthroughs."}
                {activeEval.planet === "NEPTUNE" && "Universal compassion, mystical empathy, exquisite artistic and transcendental inspiration."}
                {activeEval.planet === "PLUTO" && "Phoenix-like self-resurrection, deep research stamina, mastery over crisis, magnetic will."}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ color: "#DC2626", fontWeight: 700 }}>✦ Shadow:</span>
              <span style={{ color: "#374151" }}>
                {activeEval.planet === "URANUS" && "Erratic rebellion, sudden alienation from family/superiors, nervous system strain."}
                {activeEval.planet === "NEPTUNE" && "Vulnerability to deception, escapism, foggy boundaries, susceptibility to illusions."}
                {activeEval.planet === "PLUTO" && "Obsessive control struggles, unyielding resentment, vindictive power games."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

