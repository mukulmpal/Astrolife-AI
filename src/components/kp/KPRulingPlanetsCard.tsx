"use client";

import React, { useState } from "react";
import type { KPRulingPlanetsSnapshot } from "@/lib/astro-engine/kp-ruling-planets";
import { KP_PLANET_COLORS } from "@/lib/astro-engine/kp";
import { Sparkles, Sun, Moon, Compass, ShieldCheck, ChevronDown, ChevronUp, Info } from "lucide-react";

interface KPRulingPlanetsCardProps {
  snapshot: KPRulingPlanetsSnapshot;
  tp?: (name: string) => string;
}

export function KPRulingPlanetsCard({ snapshot, tp = (n) => n }: KPRulingPlanetsCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!snapshot) return null;

  const core = snapshot.coreRulingPlanets;
  const secondary = snapshot.secondaryRulingPlanets;
  const nodeRepresentations = snapshot.nodeRepresentations || [];
  const dayLordInfo = snapshot.dayLordInfo;
  const ascendant = snapshot.ascendant;
  const moon = snapshot.moon;

  if (!core || !ascendant || !moon) return null;

  const coreList = [
    {
      role: "Ascendant Star Lord",
      planet: core.ascendantStarLord,
      symbol: "✦",
      desc: `${tp(ascendant.sign)} ${ascendant.nakshatra}`,
      level: "Primary Anchor",
    },
    {
      role: "Ascendant Sign Lord",
      planet: core.ascendantSignLord,
      symbol: "⟁",
      desc: `${tp(ascendant.sign)} Sign Lord`,
      level: "Chakra Base",
    },
    {
      role: "Moon Star Lord",
      planet: core.moonStarLord,
      symbol: "☾",
      desc: `${tp(moon.sign)} ${moon.nakshatra}`,
      level: "Temporal Mind",
    },
    {
      role: "Moon Sign Lord",
      planet: core.moonSignLord,
      symbol: "○",
      desc: `${tp(moon.sign)} Sign Lord`,
      level: "Lunar Vessel",
    },
    {
      role: "Day Lord (Vara)",
      planet: core.dayLord,
      symbol: "☼",
      desc: `${dayLordInfo?.weekdayName ?? ""} (Sunrise)`,
      level: "Solar Chronos",
    },
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(184, 134, 11, 0.22)",
        borderRadius: "18px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: "rgba(212, 175, 55, 0.12)",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#B8860B",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            <Sparkles size={13} />
            <span>KRISHNAMURTI PADDHATI · MASTER CORROBORATION</span>
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "26px",
              color: "#1A1A1A",
              fontWeight: 700,
              margin: 0,
            }}
          >
            KP Ruling Planets Snapshot
          </h2>
          <p
            style={{
              color: "#6B635B",
              fontSize: "12.5px",
              marginTop: "4px",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            The 5 classical cosmic pillars governing the moment of calculation. Used in classical KP for
            birth-time verification, active transit timing, and corroborating Dasha significators.
          </p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "10px",
            background: "#FAF7F2",
            border: "1px solid rgba(184, 134, 11, 0.2)",
            color: "#1A1A1A",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {showDetails ? (
            <>
              Hide Node Proxies <ChevronUp size={14} />
            </>
          ) : (
            <>
              View Proxies & Sub-Lords <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>

      {/* 5 Core Pillars Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        {coreList.map((item, idx) => {
          const color = KP_PLANET_COLORS[item.planet] ?? "#1A1A1A";
          return (
            <div
              key={idx}
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.16)",
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "11px",
                  color: "#6B635B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <span>{item.role}</span>
                <span style={{ opacity: 0.6 }}>{item.symbol}</span>
              </div>

              <div style={{ margin: "10px 0 6px" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color,
                    letterSpacing: "0.2px",
                  }}
                >
                  {tp(item.planet)}
                </div>
                <div style={{ fontSize: "11.5px", color: "#6B635B", marginTop: "2px" }}>
                  {item.desc}
                </div>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#B8860B",
                  background: "rgba(184, 134, 11, 0.1)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  alignSelf: "flex-start",
                }}
              >
                {item.level}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Details: Secondary Sub-Lords & Node Representation Chains */}
      {showDetails && (
        <div
          style={{
            marginTop: "18px",
            paddingTop: "18px",
            borderTop: "1px solid rgba(184, 134, 11, 0.15)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Secondary Sub-Lords */}
          <div
            style={{
              background: "#FAF7F2",
              border: "1px solid rgba(184, 134, 11, 0.16)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              <Compass size={14} color="#0284c7" />
              <span>Secondary Cuspal Sub-Lords (High Precision)</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 134, 11, 0.1)",
                }}
              >
                <span style={{ color: "#6B635B" }}>Ascendant Sub-Lord:</span>
                <strong style={{ color: KP_PLANET_COLORS[secondary?.ascendantSubLord ?? ""] ?? "#1A1A1A" }}>
                  {tp(secondary?.ascendantSubLord ?? "")}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 134, 11, 0.1)",
                }}
              >
                <span style={{ color: "#6B635B" }}>Moon Sub-Lord:</span>
                <strong style={{ color: KP_PLANET_COLORS[secondary?.moonSubLord ?? ""] ?? "#1A1A1A" }}>
                  {tp(secondary?.moonSubLord ?? "")}
                </strong>
              </div>
            </div>
          </div>

          {/* Node Representation Chains (Rahu / Ketu) */}
          <div
            style={{
              background: "#FAF7F2",
              border: "1px solid rgba(184, 134, 11, 0.16)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              <ShieldCheck size={14} color="#16a34a" />
              <span>Lunar Node Proxy Chains (Rahu / Ketu)</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
              {(["Rahu", "Ketu"] as const).map((node) => {
                const chain = nodeRepresentations.find((r) => r.node === node);
                if (!chain) return null;
                const nodeColor = KP_PLANET_COLORS[node] ?? "#1A1A1A";
                const representedCore = chain.representedCoreRPs || [];
                const isRepresenting = representedCore.length > 0;
                const conjoined = chain.conjoinedPlanets || [];

                return (
                  <div
                    key={node}
                    style={{
                      padding: "8px 10px",
                      background: "#FFFFFF",
                      borderRadius: "8px",
                      border: "1px solid rgba(184, 134, 11, 0.1)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong style={{ color: nodeColor }}>{node}</strong>
                      <span
                        style={{
                          fontSize: "10px",
                          color: isRepresenting ? "#16a34a" : "#6B635B",
                          fontWeight: 600,
                        }}
                      >
                        {isRepresenting
                          ? `Represents: ${representedCore.map((p) => tp(p)).join(", ")}`
                          : "Sign Lord: " + tp(chain.signLord)}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B635B" }}>
                      Sign: {tp(chain.signLord)} · Conjoined:{" "}
                      {conjoined.length > 0
                        ? conjoined.map((p) => tp(p)).join(", ")
                        : "None"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Provenance Footer */}
      <div
        style={{
          marginTop: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "11px",
          color: "#8C827A",
        }}
      >
        <Info size={12} />
        <span>
          Astronomical Sunrise: {dayLordInfo?.astronomicalSunriseLocal ?? "N/A"} · Day Lord calculated strictly from sunrise-to-sunrise (Non-Veto Corroborator).
        </span>
      </div>
    </div>
  );
}

