"use client";

import React, { useState } from "react";
import type { KPDashaHierarchyEvidence } from "@/lib/astro-engine/kp-dasha-evidence";
import { KP_PLANET_COLORS } from "@/lib/astro-engine/kp";
import { GitBranch, Layers, ShieldAlert, Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

interface KPDashaEvidenceTreeProps {
  evidence: KPDashaHierarchyEvidence;
  tp?: (name: string) => string;
}

export function KPDashaEvidenceTree({ evidence, tp = (n) => n }: KPDashaEvidenceTreeProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const { hierarchy, eventEvidenceByRule } = evidence;
  const levels = [
    { label: "Mahadasha (Primary)", data: hierarchy?.mahadasha, tag: "Level 1" },
    { label: "Antardasha (Operating)", data: hierarchy?.antardasha, tag: "Level 2" },
    { label: "Pratyantardasha (Trigger)", data: hierarchy?.pratyantardasha, tag: "Level 3" },
    { label: "Sookshmadasha (Sub-Trigger)", data: hierarchy?.sookshma, tag: "Level 4" },
    { label: "Pranadasha (Micro-Pulse)", data: hierarchy?.prana, tag: "Level 5" },
  ].filter((lvl) => Boolean(lvl.data));

  const categoryEvents = Object.values(eventEvidenceByRule || {})
    .map((r) => r.levels?.antardasha ?? r.levels?.mahadasha)
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(184, 134, 11, 0.2)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            background: "rgba(184, 134, 11, 0.12)",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#B8860B",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}
        >
          <GitBranch size={13} />
          <span>KP EVIDENCE ENGINE · 5-TIER TIMING ACTIVATION</span>
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "24px",
            color: "#1A1A1A",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Dasha House Signification & Event Unlocking
        </h2>
        <p
          style={{
            color: "#6B635B",
            fontSize: "12.5px",
            marginTop: "4px",
            lineHeight: 1.5,
          }}
        >
          Classical KP timing bridges Vimshottari periods to exact house significations. Below is the
          evidence tree showing which houses your active lords signify and which life domains they unlock.
        </p>
      </div>

      {/* 5-Level Active Lords Signification Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {levels.map(({ label, data, tag }, idx) => {
          const color = KP_PLANET_COLORS[data.planet] ?? "#B8860B";
          return (
            <div
              key={idx}
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.15)",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "10.5px",
                    color: "#6B635B",
                    fontWeight: 600,
                  }}
                >
                  <span>{label}</span>
                  <span style={{ color: "#B8860B" }}>{tag}</span>
                </div>

                <div style={{ margin: "8px 0 4px" }}>
                  <span style={{ fontSize: "20px", fontWeight: 700, color }}>
                    {tp(data.planet)}
                  </span>
                </div>

                <div style={{ fontSize: "11px", color: "#6B635B", marginBottom: "8px" }}>
                  Signifies Houses:{" "}
                  <strong style={{ color: "#B8860B" }}>
                    {data.signifiedHouses.length > 0
                      ? data.signifiedHouses.map((h) => `H${h}`).join(", ")
                      : "None"}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#6B635B",
                  borderTop: "1px solid rgba(184, 134, 11, 0.12)",
                  paddingTop: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Strength:</span>
                <span style={{ color: "#15803d", fontWeight: 600 }}>{data.significationStrength}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unlocked Life Domains & Event Evidence */}
      {categoryEvents.length > 0 && (
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            <Layers size={14} color="#B8860B" />
            <span>Active Life Event Signification Matches</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "10px",
            }}
          >
            {categoryEvents.map((ev, i) => {
              const isExpanded = expandedEvent === ev.ruleId;
              const supporting = ev.supportingHousesMatched || [];
              const detriment = ev.detrimentHousesMatched || [];
              const signified = ev.signifiedHouses || [];
              const hasSupporting = supporting.length > 0;
              const hasDetriment = detriment.length > 0;

              return (
                <div
                  key={i}
                  style={{
                    background: "#FAF7F2",
                    border: "1px solid rgba(184, 134, 11, 0.15)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onClick={() => setExpandedEvent(isExpanded ? null : ev.ruleId)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <strong style={{ fontSize: "12.5px", color: "#1A1A1A" }}>{ev.ruleName}</strong>
                    {isExpanded ? <ChevronUp size={14} color="#8C827A" /> : <ChevronDown size={14} color="#8C827A" />}
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", fontSize: "10.5px" }}>
                    {hasSupporting && (
                      <span
                        style={{
                          background: "rgba(34, 197, 94, 0.12)",
                          color: "#15803d",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontWeight: 500,
                        }}
                      >
                        <CheckCircle2 size={10} /> Supports: {supporting.map((h) => `H${h}`).join(", ")}
                      </span>
                    )}

                    {hasDetriment && (
                      <span
                        style={{
                          background: "rgba(239, 68, 68, 0.12)",
                          color: "#b91c1c",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontWeight: 500,
                        }}
                      >
                        <ShieldAlert size={10} /> Detriment: {detriment.map((h) => `H${h}`).join(", ")}
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid rgba(184, 134, 11, 0.12)",
                        fontSize: "11px",
                        color: "#6B635B",
                        lineHeight: 1.5,
                      }}
                    >
                      <div>
                        <strong style={{ color: "#1A1A1A" }}>Lord:</strong> {tp(ev.planet)} ({ev.dashaLevel})
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <strong style={{ color: "#1A1A1A" }}>Signified Houses:</strong> {signified.length > 0 ? signified.map((h) => `H${h}`).join(", ") : "None"}
                      </div>
                      <div style={{ marginTop: "4px", color: "#8C827A", fontSize: "10px" }}>
                        Canonical Source: {ev.canonicalSource}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
