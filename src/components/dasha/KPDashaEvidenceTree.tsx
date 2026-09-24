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

  const { hierarchy, eventEvidence } = evidence;
  const levels = [
    { label: "Mahadasha (Primary)", data: hierarchy.mahadasha, tag: "Level 1" },
    { label: "Antardasha (Operating)", data: hierarchy.antardasha, tag: "Level 2" },
    { label: "Pratyantardasha (Trigger)", data: hierarchy.pratyantardasha, tag: "Level 3" },
    { label: "Sookshmadasha (Sub-Trigger)", data: hierarchy.sookshma, tag: "Level 4" },
    { label: "Pranadasha (Micro-Pulse)", data: hierarchy.prana, tag: "Level 5" },
  ];

  const categoryEvents = eventEvidence.slice(0, 8); // Top active event combinations

  return (
    <div
      style={{
        background: "radial-gradient(ellipse at top right, rgba(96, 165, 250, 0.08), transparent 60%), #0c0922",
        border: "1px solid rgba(96, 165, 250, 0.25)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
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
            background: "rgba(96, 165, 250, 0.12)",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#60a5fa",
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
            color: "#f5eedd",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Dasha House Signification & Event Unlocking
        </h2>
        <p
          style={{
            color: "#998fb3",
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
          const color = KP_PLANET_COLORS[data.planet] ?? "#f5eedd";
          return (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
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
                    color: "#83799f",
                    fontWeight: 600,
                  }}
                >
                  <span>{label}</span>
                  <span style={{ color: "#60a5fa" }}>{tag}</span>
                </div>

                <div style={{ margin: "8px 0 4px" }}>
                  <span style={{ fontSize: "20px", fontWeight: 700, color }}>
                    {tp(data.planet)}
                  </span>
                </div>

                <div style={{ fontSize: "11px", color: "#b8b0d0", marginBottom: "8px" }}>
                  Signifies Houses:{" "}
                  <strong style={{ color: "#f5a623" }}>
                    {data.signifiedHouses.length > 0
                      ? data.signifiedHouses.map((h) => `H${h}`).join(", ")
                      : "None"}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Strength:</span>
                <span style={{ color: "#4ade80", fontWeight: 600 }}>{data.significationStrength}</span>
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
              color: "#e2daf0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            <Layers size={14} color="#f5a623" />
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
              const hasSupporting = ev.supportingHousesMatched.length > 0;
              const hasDetriment = ev.detrimentHousesMatched.length > 0;

              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
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
                    <strong style={{ fontSize: "12.5px", color: "#f5eedd" }}>{ev.ruleName}</strong>
                    {isExpanded ? <ChevronUp size={14} color="#8a81a3" /> : <ChevronDown size={14} color="#8a81a3" />}
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", fontSize: "10.5px" }}>
                    {hasSupporting && (
                      <span
                        style={{
                          background: "rgba(74, 222, 128, 0.1)",
                          color: "#4ade80",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <CheckCircle2 size={10} /> Supports: {ev.supportingHousesMatched.map((h) => `H${h}`).join(", ")}
                      </span>
                    )}

                    {hasDetriment && (
                      <span
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#f87171",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <ShieldAlert size={10} /> Detriment: {ev.detrimentHousesMatched.map((h) => `H${h}`).join(", ")}
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                        fontSize: "11px",
                        color: "#9890b0",
                        lineHeight: 1.5,
                      }}
                    >
                      <div>
                        <strong>Lord:</strong> {tp(ev.planet)} ({ev.dashaLevel})
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <strong>Signified Houses:</strong> {ev.signifiedHouses.map((h) => `H${h}`).join(", ")}
                      </div>
                      <div style={{ marginTop: "4px", color: "#787190", fontSize: "10px" }}>
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
