"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import { buildChart, type BirthDetails } from "@/lib/user-chart";
import {
  runAstroVastuHitEngine,
  ASTRO_VASTU_SIGN_DIRECTIONS,
  SIGN_BODY_PART_MAPPINGS,
  getElementalBalancingGuide,
  type AstroVastuHitDossier,
  type EvaluatedHit,
  type TrafficPoliceBlockade,
  type ShiftingPrescription,
  type GenericVastuConflict,
  type DevataEntity,
  type NativeDevataMapping,
} from "@/lib/astro-engine/astro-vastu-hit-engine";
import { BioWearableAuditView } from "./BioWearableAuditView";

const DEMO_VASTU_FALLBACK: BirthDetails = {
  name: "मानक जन्म चक्र (Reference Chart)",
  dob: "1995-07-04",
  tob: "12:30",
  city: "Delhi",
  tz: 5.5,
};

interface AstroVastuHitRadarViewProps {
  chart?: ChartData | any;
}

export function AstroVastuHitRadarView({ chart }: AstroVastuHitRadarViewProps) {
  const [activeTab, setActiveTab] = useState<
    | "dossier"
    | "rxPrescription"
    | "radar"
    | "trafficPolice"
    | "hits"
    | "shifting"
    | "bodyTherapy"
    | "conflicts"
    | "lifestyle"
    | "wearableAudit"
    | "mandala"
    | "barChart"
  >("dossier");
  const [showCuspsTable, setShowCuspsTable] = useState(false);
  const [hitFilter, setHitFilter] = useState<"all" | 180 | 90 | 45 | 60 | 120>("all");
  const [selectedDirectionCode, setSelectedDirectionCode] = useState<string>("N");
  const [targetDateStr, setTargetDateStr] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // 45 Devatas & 32 Entrances interactive states
  const [selectedPadCode, setSelectedPadCode] = useState<string>("E3");
  const [activeQuadrant, setActiveQuadrant] = useState<"East" | "South" | "West" | "North">("East");
  const [devataLayerFilter, setDevataLayerFilter] = useState<"All" | "Brahmasthan" | "CardinalFaces" | "DiagonalCorners" | "OuterPerimeter">("OuterPerimeter");

  // Bar Chart 5-Elements Balancing state
  const [zoneConditions, setZoneConditions] = useState<Record<string, "Exhausted_Depleted" | "Extended_Bloated" | "Balanced">>({
    N: "Balanced",
    E: "Balanced",
    S: "Balanced",
    SW: "Balanced",
    W: "Balanced",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const targetDate = useMemo(() => {
    if (!targetDateStr) return new Date();
    const parsed = new Date(targetDateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [targetDateStr]);

  const resolvedChart = useMemo(() => {
    if (chart && chart.planets && Object.keys(chart.planets).length > 0) {
      return chart;
    }
    return buildChart(DEMO_VASTU_FALLBACK);
  }, [chart]);

  const dossier: AstroVastuHitDossier | null = useMemo(() => {
    try {
      const res = runAstroVastuHitEngine(resolvedChart, targetDate);
      if (res) return res;
      return runAstroVastuHitEngine(buildChart(DEMO_VASTU_FALLBACK), targetDate);
    } catch (e) {
      console.error("AstroVastu Hit Engine error:", e);
      try {
        return runAstroVastuHitEngine(buildChart(DEMO_VASTU_FALLBACK), targetDate);
      } catch {
        return null;
      }
    }
  }, [resolvedChart, targetDate]);

  if (!dossier) {
    return (
      <div className="card" style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "#6B635B", fontSize: 15 }}>
          कुंडली लोड नहीं हो सकी या डेटा अधूरा है। कृपया पहले अपनी जन्म कुंडली जनरेट करें।
        </p>
      </div>
    );
  }

  const {
    nativeName,
    lagnaSign,
    lagnaSignHindi,
    lagnaSignNum,
    lagnaCompoundDeg,
    activeDasha,
    planetCoordinates = [],
    cuspCoordinates = [],
    clusters = [],
    dashaLordHitsAnalysis = [],
    spatialFieldTest = [],
    trafficPoliceBlockades,
    killerHits180,
    dangerousHits90,
    badHits45,
    supportiveHits60 = [],
    protectiveShields120,
    allHits,
    shiftingPrescriptions,
    bodyPartRemedyRegistry = [],
    genericVastuConflicts,
    directionPlanetaryInventory,
    familyCrossHitIsolationRule,
    studyAndWorkDirection,
    marsDietaryLifestyleProtocol,
    wristThreadTrapAlert,
    mandalaDossier,
    astroPrescription,
  } = dossier;

  const dynamicBalancingGuides = useMemo(() => {
    return [
      getElementalBalancingGuide("N", "Water", zoneConditions.N || "Balanced"),
      getElementalBalancingGuide("E", "AirWood", zoneConditions.E || "Balanced"),
      getElementalBalancingGuide("S", "Fire", zoneConditions.S || "Balanced"),
      getElementalBalancingGuide("SW", "Earth", zoneConditions.SW || "Balanced"),
      getElementalBalancingGuide("W", "Space", zoneConditions.W || "Balanced"),
    ];
  }, [zoneConditions]);

  const filteredHits = useMemo(() => {
    if (hitFilter === "all") return allHits;
    return allHits.filter((h) => h.hitDef.angle === hitFilter);
  }, [allHits, hitFilter]);

  const selectedDirectionData = directionPlanetaryInventory[selectedDirectionCode];

  // Helper colors
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Killer":
        return { bg: "rgba(220, 38, 38, 0.15)", text: "#dc2626", border: "#f87171", label: "💀 किलर हिट (180°)" };
      case "Dangerous":
        return { bg: "rgba(234, 88, 12, 0.15)", text: "#ea580c", border: "#fb923c", label: "⚠️ खतरनाक हिट (90°)" };
      case "Bad":
        return { bg: "rgba(202, 138, 4, 0.15)", text: "#ca8a04", border: "#facc15", label: "⚡ खराब हिट (45°)" };
      case "Opportunity":
        return { bg: "rgba(3, 105, 161, 0.15)", text: "#0369a1", border: "#38bdf8", label: "🤝 सहायक कोण (60°)" };
      case "Shield":
        return { bg: "rgba(22, 163, 74, 0.15)", text: "#16a34a", border: "#4ade80", label: "🛡️ सुरक्षा ढाल (120°)" };
      default:
        return { bg: "rgba(107, 99, 91, 0.15)", text: "#6B635B", border: "#d6d3d1", label: severity };
    }
  };

  const renderDynamicBodyTherapyTable = () => {
    const hitsCount = bodyPartRemedyRegistry.filter((r) => r.activeHits && r.activeHits.length > 0).length;
    const dashaCount = bodyPartRemedyRegistry.filter((r) => r.planetsInSign && r.planetsInSign.some((p) => p.isDashaLord)).length;
    const harmfulThreadCount = bodyPartRemedyRegistry.filter((r) => r.isThreadHarmful).length;

    return (
      <div style={{ marginTop: 16 }}>
        {/* Table Header KPI Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 12,
            padding: "10px 14px",
            background: "#FAF8F5",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
          }}
        >
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
              📋 12 राशि मानव शरीर अंग, डॉट पदार्थ एवं धागा चिकित्सा तालिका (100% आपकी कुंडली आधारित):
            </h4>
            <p style={{ margin: "3px 0 0 0", fontSize: 12, color: "#6B635B" }}>
              प्रत्येक राशि का आपकी कुंडली में भाव (H1-H12), विद्यमान ग्रह, सक्रिय आघात (Hits) व व्यक्तिगत धागा चिकित्सा निर्देश
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(220, 38, 38, 0.1)",
                color: "#DC2626",
                padding: "3px 9px",
                borderRadius: 12,
                border: "1px solid rgba(220, 38, 38, 0.25)",
              }}
            >
              🚨 आघात प्रभावित: {hitsCount} अंग
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(217, 119, 6, 0.1)",
                color: "#B45309",
                padding: "3px 9px",
                borderRadius: 12,
                border: "1px solid rgba(217, 119, 6, 0.25)",
              }}
            >
              ⚡ दशा केंद्र: {dashaCount} अंग
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(107, 114, 128, 0.12)",
                color: "#374151",
                padding: "3px 9px",
                borderRadius: 12,
                border: "1px solid #D1D5DB",
              }}
            >
              ⚠️ धागा वर्जित दुस्थान: {harmfulThreadCount} अंग
            </span>
          </div>
        </div>

        {/* Dynamic Matrix Table */}
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #E5E7EB", background: "#FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left", minWidth: 980 }}>
            <thead>
              <tr style={{ background: "#FAF8F5", borderBottom: "2px solid #E5E7EB", color: "#4A4238" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: "17%" }}>राशि व देह अंग (Sign & Body)</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: "17%" }}>आपकी कुंडली में भाव (House)</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: "16%" }}>विद्यमान ग्रह (Occupants)</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: "18%" }}>आघात व ऊर्जा स्थिति (Hits & Status)</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: "18%" }}>बायो-मैग्नेटिक डॉट पदार्थ व विधि</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: "14%" }}>धागा चिकित्सा निर्देश (Verdict)</th>
              </tr>
            </thead>
            <tbody>
              {bodyPartRemedyRegistry.map((item, rIdx) => {
                const dirInfo = ASTRO_VASTU_SIGN_DIRECTIONS[item.signNum];
                const isCriticalRow = item.statusVerdict.statusType === "critical_hit";
                const isDangerousRow = item.statusVerdict.statusType === "dangerous_hit";
                const rowBg = isCriticalRow
                  ? "rgba(239, 68, 68, 0.05)"
                  : isDangerousRow
                  ? "rgba(249, 115, 22, 0.04)"
                  : item.isThreadHarmful
                  ? "rgba(245, 158, 11, 0.03)"
                  : rIdx % 2 === 0
                  ? "#FFFFFF"
                  : "#FAF9F6";

                return (
                  <tr
                    key={item.signNum}
                    style={{
                      borderBottom: "1px solid #F3F4F6",
                      background: rowBg,
                    }}
                  >
                    {/* 1. Sign, Body Part & Direction */}
                    <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: "#4A4238",
                            color: "#FFFFFF",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {item.signNum}
                        </span>
                        <strong style={{ fontSize: 13.5, color: "#1A1A1A" }}>
                          {item.signHindi}
                        </strong>
                        <span style={{ fontSize: 11, color: "#6B7280" }}>
                          ({item.signName})
                        </span>
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 700, color: "#8B5CF6", fontSize: 12 }}>
                        📍 {item.bodyPartHi}
                      </div>
                      <div style={{ fontSize: 10.5, color: "#6B7280", marginTop: 1 }}>
                        {item.bodyPartEn}
                      </div>
                      {dirInfo && (
                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 10.5,
                            fontWeight: 600,
                            color: "#4B5563",
                            background: "#F3F4F6",
                            display: "inline-block",
                            padding: "1px 6px",
                            borderRadius: 4,
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          दिशा: {dirInfo.code} ({dirInfo.directionHindi})
                        </div>
                      )}
                    </td>

                    {/* 2. Kundli House for this Seeker */}
                    <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 6,
                            background: [6, 8, 12].includes(item.houseNum)
                              ? "rgba(220, 38, 38, 0.12)"
                              : [1, 4, 7, 10].includes(item.houseNum)
                              ? "rgba(37, 99, 235, 0.12)"
                              : "rgba(16, 185, 129, 0.12)",
                            color: [6, 8, 12].includes(item.houseNum)
                              ? "#DC2626"
                              : [1, 4, 7, 10].includes(item.houseNum)
                              ? "#2563EB"
                              : "#059669",
                          }}
                        >
                          H{item.houseNum}
                        </span>
                        <strong style={{ fontSize: 12.5, color: "#1A1A1A" }}>
                          {item.houseNum}वां भाव
                        </strong>
                      </div>
                      <div style={{ marginTop: 4, fontSize: 11.5, color: "#4B5563", lineHeight: 1.4 }}>
                        {item.houseNameHi}
                      </div>
                      {[6, 8, 12].includes(item.houseNum) && (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: "#DC2626",
                            background: "rgba(220, 38, 38, 0.08)",
                            display: "inline-block",
                            padding: "1px 6px",
                            borderRadius: 4,
                          }}
                        >
                          ⚠️ दुस्थान / संवेदनशील भाव
                        </div>
                      )}
                    </td>

                    {/* 3. Occupying Planets */}
                    <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                      {item.planetsInSign && item.planetsInSign.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {item.planetsInSign.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 11.5,
                                background: p.isDashaLord
                                  ? "rgba(217, 119, 6, 0.12)"
                                  : "#F3F4F6",
                                padding: "2px 8px",
                                borderRadius: 6,
                                border: p.isDashaLord
                                  ? "1px solid #F59E0B"
                                  : "1px solid #E5E7EB",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: p.isDashaLord ? "#B45309" : "#1F2937",
                                }}
                              >
                                {p.hindi}
                              </span>
                              <span style={{ fontSize: 10.5, color: "#6B7280" }}>
                                {p.degreesFormatted}
                              </span>
                              {p.isDashaLord && (
                                <span
                                  style={{
                                    fontSize: 9.5,
                                    fontWeight: 800,
                                    color: "#B45309",
                                    background: "#FEF3C7",
                                    padding: "0 4px",
                                    borderRadius: 4,
                                  }}
                                >
                                  ★ दशानाथ
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "#9CA3AF", fontStyle: "italic" }}>
                          — रिक्त भाव
                        </span>
                      )}
                    </td>

                    {/* 4. Hits & Status */}
                    <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                      <div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 12,
                            background:
                              item.statusVerdict.statusType === "critical_hit"
                                ? "rgba(220, 38, 38, 0.15)"
                                : item.statusVerdict.statusType === "dangerous_hit"
                                ? "rgba(234, 88, 12, 0.15)"
                                : item.statusVerdict.statusType === "dasha_active"
                                ? "rgba(217, 119, 6, 0.15)"
                                : item.statusVerdict.statusType === "shielded"
                                ? "rgba(22, 163, 74, 0.15)"
                                : "rgba(107, 114, 128, 0.12)",
                            color: item.statusVerdict.badgeColor || "#374151",
                            border: `1px solid ${item.statusVerdict.badgeColor || "#D1D5DB"}`,
                            display: "inline-block",
                          }}
                        >
                          {item.statusVerdict.badgeText}
                        </span>
                      </div>

                      {item.activeHits && item.activeHits.length > 0 && (
                        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                          {item.activeHits.map((hit, hIdx) => (
                            <div
                              key={hIdx}
                              style={{
                                fontSize: 11,
                                color: hit.angle === 180 ? "#DC2626" : hit.angle === 90 ? "#EA580C" : "#4B5563",
                                fontWeight: hit.angle === 180 || hit.angle === 90 ? 700 : 500,
                              }}
                            >
                              • {hit.angle}° {hit.aspectName} ({hit.hittingPlanet} से, ±{hit.orbDeg.toFixed(2)}°)
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: 4, fontSize: 11, color: "#6B7280", lineHeight: 1.35 }}>
                        {item.statusVerdict.summaryText}
                      </div>
                    </td>

                    {/* 5. Bio-Magnetic Dot Substance & Method */}
                    <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "#B8860B", fontSize: 12.5 }}>
                        ✦ {item.dotSubstance}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 11.5, color: "#4B5563", lineHeight: 1.45 }}>
                        {item.dotApplicationRules}
                      </div>
                      {item.dotColor && (
                        <div style={{ marginTop: 4 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#4A4238",
                              background: "#F3F4F6",
                              padding: "1px 6px",
                              borderRadius: 4,
                            }}
                          >
                            वर्ण/रंग: {item.dotColor}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* 6. Thread Verdict */}
                    <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                      <div style={{ marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: item.isThreadHarmful ? "rgba(220, 38, 38, 0.12)" : "rgba(22, 163, 74, 0.12)",
                            color: item.isThreadHarmful ? "#DC2626" : "#16A34A",
                            border: item.isThreadHarmful ? "1px solid #FCA5A5" : "1px solid #86EFAC",
                            display: "inline-block",
                          }}
                        >
                          {item.isThreadHarmful ? "🚨 धागा निषेध" : "✅ धागा अनुकूल"}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11.5,
                          color: item.isThreadHarmful ? "#991B1B" : "#166534",
                          lineHeight: 1.45,
                          fontWeight: item.isThreadHarmful ? 600 : 400,
                        }}
                      >
                        {item.threadVerdict}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`
        .vastu-executive-banner,
        .vastu-mandala-banner,
        .vastu-barchart-banner {
          background: linear-gradient(135deg, #1C1917 0%, #0F0E0D 100%) !important;
          color: #FFFFFF !important;
          border: 2px solid rgba(212, 175, 55, 0.65) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25) !important;
        }
        .vastu-barchart-banner {
          background: linear-gradient(135deg, #042F2E 0%, #064E3B 100%) !important;
          border: 2px solid rgba(20, 184, 166, 0.65) !important;
        }
        .vastu-banner-title,
        .vastu-executive-banner .vastu-banner-title,
        .vastu-mandala-banner .vastu-banner-title,
        .vastu-barchart-banner .vastu-banner-title,
        html[data-theme-mode="light"] .vastu-banner-title,
        html[data-landing-theme="saffron"] .vastu-banner-title,
        html[data-theme-mode="light"] .vastu-executive-banner :is(h1, h2, h3, h4, .vastu-banner-title),
        html[data-theme-mode="light"] .vastu-mandala-banner :is(h1, h2, h3, h4, .vastu-banner-title),
        html[data-theme-mode="light"] .vastu-barchart-banner :is(h1, h2, h3, .vastu-banner-title) {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8) !important;
        }
      `}</style>
      {/* ── Top Dossier Hero Banner ── */}
      <div
        className="vastu-executive-banner"
        style={{
          background: "linear-gradient(135deg, #1C1917 0%, #0F0E0D 100%)",
          color: "#FFFFFF",
          border: "2px solid rgba(212, 175, 55, 0.65)",
          borderRadius: 18,
          padding: "20px 24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#78350F",
                  background: "#FEF08A",
                  padding: "4px 10px",
                  borderRadius: 14,
                  border: "1.5px solid #F59E0B",
                }}
              >
                Astro-Vastu Hit Radar · v1.0
              </span>
              <span style={{ fontSize: 12.5, color: "#F5F5F4", fontWeight: 600 }}>
                3-5-8 Orb Formula & Cosmic Friction Radar Engine
              </span>
            </div>
            <div
              role="heading"
              aria-level={2}
              className="vastu-banner-title"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              {nativeName ? `${nativeName} — ` : ""}एस्ट्रो-वास्तु हिट थ्योरी ऑडिट
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#F5F5F4", lineHeight: 1.5, fontWeight: 500 }}>
              लग्न: <strong style={{ color: "#FEF08A", fontWeight: 800 }}>{lagnaSign} ({lagnaSignHindi || lagnaSign})</strong> ({lagnaCompoundDeg.toFixed(2)}° Compound) · 
              सक्रिय दशा: <strong style={{ color: "#93C5FD", fontWeight: 800 }}>{activeDasha.mahadasha} MD</strong> / <strong style={{ color: "#7DD3FC", fontWeight: 800 }}>{activeDasha.antardasha} AD</strong>
            </div>
          </div>

          {/* Date Selector for Future Dasha Inspection */}
          <div style={{ background: "#0C0A09", padding: "10px 14px", borderRadius: 12, border: "1.5px solid rgba(212, 175, 55, 0.6)", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize: 11, color: "#FDE68A", fontWeight: 800, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
              दशा तिथि सिमुलेशन (Dasha Date)
            </div>
            <input
              type="date"
              value={isMounted ? (targetDateStr || new Date().toISOString().split("T")[0]) : "2026-10-20"}
              onChange={(e) => setTargetDateStr(e.target.value)}
              style={{
                background: "#1C1917",
                color: "#FFFFFF",
                fontWeight: 700,
                border: "1px solid rgba(212, 175, 55, 0.6)",
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Quick KPI Strip with BOLD CONTRAST & 60° SUPPORTIVE HIT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 10,
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* 1. Cosmic Friction Locks */}
          <div
            style={{
              background: trafficPoliceBlockades.length > 0 ? "#FEE2E2" : "#DCFCE7",
              border: `1px solid ${trafficPoliceBlockades.length > 0 ? "#F87171" : "#86EFAC"}`,
              borderRadius: 10,
              padding: "8px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: trafficPoliceBlockades.length > 0 ? "#991B1B" : "#166534", letterSpacing: 0.5 }}>
              कॉस्मिक फ्रिक्शन
            </div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 20,
                fontWeight: 700,
                color: trafficPoliceBlockades.length > 0 ? "#B91C1C" : "#15803D",
                marginTop: 2,
              }}
            >
              {trafficPoliceBlockades.length > 0 ? `⚡ ${trafficPoliceBlockades.length} लॉक` : "✅ क्लियर"}
            </div>
          </div>

          {/* 2. 180° Killer Hits */}
          <div
            style={{
              background: killerHits180.length > 0 ? "#FEE2E2" : "#F5F5F4",
              border: `1px solid ${killerHits180.length > 0 ? "#FCA5A5" : "#E7E5E4"}`,
              borderRadius: 10,
              padding: "8px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#991B1B", letterSpacing: 0.5 }}>
              180° किलर हिट्स
            </div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#B91C1C", marginTop: 2 }}>
              {killerHits180.length}
            </div>
          </div>

          {/* 3. 90° Dangerous Hits */}
          <div
            style={{
              background: dangerousHits90.length > 0 ? "#FFEDD5" : "#F5F5F4",
              border: `1px solid ${dangerousHits90.length > 0 ? "#FDBA74" : "#E7E5E4"}`,
              borderRadius: 10,
              padding: "8px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#9A3412", letterSpacing: 0.5 }}>
              90° घातक हिट्स
            </div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#C2410C", marginTop: 2 }}>
              {dangerousHits90.length}
            </div>
          </div>

          {/* 4. 60° Supportive Aspect (NEW) */}
          <div
            style={{
              background: supportiveHits60.length > 0 ? "#E0F2FE" : "#F5F5F4",
              border: `1px solid ${supportiveHits60.length > 0 ? "#7DD3FC" : "#E7E5E4"}`,
              borderRadius: 10,
              padding: "8px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#0369A1", letterSpacing: 0.5 }}>
              60° सहायक कोण
            </div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#0284C7", marginTop: 2 }}>
              {supportiveHits60.length}
            </div>
          </div>

          {/* 5. 120° Protector Shield */}
          <div
            style={{
              background: protectiveShields120.length > 0 ? "#DCFCE7" : "#F5F5F4",
              border: `1px solid ${protectiveShields120.length > 0 ? "#86EFAC" : "#E7E5E4"}`,
              borderRadius: 10,
              padding: "8px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#166534", letterSpacing: 0.5 }}>
              120° रक्षक ढाल
            </div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#15803D", marginTop: 2 }}>
              {protectiveShields120.length}
            </div>
          </div>

          {/* 6. Generic Vastu Conflicts */}
          <div
            style={{
              background: genericVastuConflicts.length > 0 ? "#FEF2F2" : "#F5F5F4",
              border: `1px solid ${genericVastuConflicts.length > 0 ? "#F87171" : "#E7E5E4"}`,
              borderRadius: 10,
              padding: "8px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: genericVastuConflicts.length > 0 ? "#991B1B" : "#4B5563", letterSpacing: 0.5 }}>
              जेनेरिक वास्तु द्वंद्व
            </div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 20,
                fontWeight: 700,
                color: genericVastuConflicts.length > 0 ? "#DC2626" : "#4B5563",
                marginTop: 2,
              }}
            >
              {genericVastuConflicts.length > 0 ? `🛑 ${genericVastuConflicts.length} अलर्ट` : "शून्य द्वंद्व"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="tabs" style={{ margin: "4px 0 12px 0", flexWrap: "wrap", gap: 6 }}>
        <button
          className={`tab ${activeTab === "dossier" ? "active" : ""}`}
          onClick={() => setActiveTab("dossier")}
          style={{
            fontWeight: 700,
            background: activeTab === "dossier" ? "#854D0E" : "rgba(212, 175, 55, 0.15)",
            color: activeTab === "dossier" ? "#FFFFFF" : "#B8860B",
            borderColor: activeTab === "dossier" ? "#B8860B" : "rgba(212, 175, 55, 0.4)",
            boxShadow: activeTab === "dossier" ? "0 2px 8px rgba(184, 134, 11, 0.25)" : "none",
          }}
        >
          📜 संपूर्ण फील्ड ऑडिट रिपोर्ट (Master Dossier)
        </button>
        <button
          className={`tab ${activeTab === "rxPrescription" ? "active" : ""}`}
          onClick={() => setActiveTab("rxPrescription")}
          style={{
            fontWeight: 700,
            background: activeTab === "rxPrescription" ? "#065F46" : "rgba(16, 185, 129, 0.15)",
            color: activeTab === "rxPrescription" ? "#FFFFFF" : "#047857",
            borderColor: activeTab === "rxPrescription" ? "#059669" : "rgba(16, 185, 129, 0.4)",
            boxShadow: activeTab === "rxPrescription" ? "0 2px 8px rgba(16, 185, 129, 0.25)" : "none",
          }}
        >
          💊 Rx त्रि-आयामी औषधि प्रिस्क्रिप्शन
        </button>
        <button
          className={`tab ${activeTab === "radar" ? "active" : ""}`}
          onClick={() => setActiveTab("radar")}
        >
          🧭 12-दिशा कम्पास रडार (Compass Radar)
        </button>
        <button
          className={`tab ${activeTab === "trafficPolice" ? "active" : ""}`}
          onClick={() => setActiveTab("trafficPolice")}
          style={trafficPoliceBlockades.length > 0 ? { color: "#dc2626", fontWeight: 700 } : {}}
        >
          ⚡ कॉस्मिक फ्रिक्शन रडार ({trafficPoliceBlockades.length})
        </button>
        <button
          className={`tab ${activeTab === "hits" ? "active" : ""}`}
          onClick={() => setActiveTab("hits")}
        >
          ⚡ सभी हिट्स ({allHits.length})
        </button>
        <button
          className={`tab ${activeTab === "shifting" ? "active" : ""}`}
          onClick={() => setActiveTab("shifting")}
        >
          🔄 120° शिफ्टिंग तकनीक ({shiftingPrescriptions.length})
        </button>
        <button
          className={`tab ${activeTab === "bodyTherapy" ? "active" : ""}`}
          onClick={() => setActiveTab("bodyTherapy")}
        >
          🧘 शरीर अंग डॉट/धागा चिकित्सा
        </button>
        <button
          className={`tab ${activeTab === "wearableAudit" ? "active" : ""}`}
          onClick={() => setActiveTab("wearableAudit")}
          style={{
            fontWeight: 700,
            background: activeTab === "wearableAudit" ? "#854D0E" : "rgba(245, 158, 11, 0.12)",
            color: activeTab === "wearableAudit" ? "#FFFFFF" : "#B45309",
            borderColor: activeTab === "wearableAudit" ? "#B8860B" : "rgba(245, 158, 11, 0.35)",
            boxShadow: activeTab === "wearableAudit" ? "0 2px 8px rgba(184, 134, 11, 0.25)" : "none",
          }}
        >
          📿 देह-आभूषण व धागा ऑडिटर (Wearable Audit)
        </button>
        <button
          className={`tab ${activeTab === "conflicts" ? "active" : ""}`}
          onClick={() => setActiveTab("conflicts")}
          style={genericVastuConflicts.length > 0 ? { color: "#b91c1c", fontWeight: 700 } : {}}
        >
          🛑 जेनेरिक वास्तु विरोध ({genericVastuConflicts.length})
        </button>
        <button
          className={`tab ${activeTab === "lifestyle" ? "active" : ""}`}
          onClick={() => setActiveTab("lifestyle")}
          style={{
            color: activeTab === "lifestyle" ? "#B8860B" : "#854D0E",
            fontWeight: 700,
            background: activeTab === "lifestyle" ? "#FAF5EB" : "rgba(217, 119, 6, 0.08)",
            border: "1px solid rgba(217, 119, 6, 0.3)",
          }}
        >
          🎯 विशेष रहस्य व दिशाएं (1, 2, 5, 6)
        </button>
        <button
          className={`tab ${activeTab === "mandala" ? "active" : ""}`}
          onClick={() => setActiveTab("mandala")}
          style={{
            fontWeight: 700,
            background: activeTab === "mandala" ? "#92400E" : "rgba(245, 158, 11, 0.15)",
            color: activeTab === "mandala" ? "#FFFFFF" : "#B45309",
            borderColor: activeTab === "mandala" ? "#B8860B" : "rgba(245, 158, 11, 0.4)",
            boxShadow: activeTab === "mandala" ? "0 2px 8px rgba(180, 83, 9, 0.25)" : "none",
          }}
        >
          🏛️ 45 देवता व 32 द्वार (Mandala & Entrances)
        </button>
        <button
          className={`tab ${activeTab === "barChart" ? "active" : ""}`}
          onClick={() => setActiveTab("barChart")}
          style={{
            fontWeight: 700,
            background: activeTab === "barChart" ? "#0F766E" : "rgba(20, 184, 166, 0.12)",
            color: activeTab === "barChart" ? "#FFFFFF" : "#0D9488",
            borderColor: activeTab === "barChart" ? "#0D9488" : "rgba(20, 184, 166, 0.4)",
            boxShadow: activeTab === "barChart" ? "0 2px 8px rgba(13, 148, 136, 0.25)" : "none",
          }}
        >
          ⚖️ बार चार्ट 5-तत्व व भोग (Bar Chart Balancer)
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 0: MASTER EXECUTIVE FIELD AUDIT DOSSIER (संपूर्ण फील्ड ऑडिट)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "dossier" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* ── SECTION 1: EXECUTIVE IDENTITY & VITAL BANNER ── */}
          <div
            className="vastu-executive-banner"
            style={{
              background: "linear-gradient(135deg, #1C1917 0%, #0F0E0D 100%)",
              color: "#FFFFFF",
              border: "2px solid rgba(212, 175, 55, 0.65)",
              borderRadius: 18,
              padding: "24px 26px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div style={{ flex: "1 1 540px", minWidth: 280 }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: "#78350F",
                    background: "#FEF08A",
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: "1.5px solid #F59E0B",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  अध्याय 1 · संपूर्ण जन्मकुंडली एवं एस्ट्रो-वास्तु ऑडिट
                </span>
                <div
                  role="heading"
                  aria-level={3}
                  className="vastu-banner-title"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 28,
                    fontWeight: 800,
                    margin: "10px 0 6px 0",
                    color: "#FFFFFF",
                    WebkitTextFillColor: "#FFFFFF",
                    textShadow: "0 2px 6px rgba(0,0,0,0.8)",
                    letterSpacing: 0.3,
                    lineHeight: 1.25,
                  }}
                >
                  {nativeName ? `${nativeName} जी का ` : ""}मास्टर फील्ड ऑडिट डॉसियर
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14.5,
                    color: "#F5F5F4",
                    lineHeight: 1.65,
                    fontWeight: 500,
                  }}
                >
                  एस्ट्रो-वास्तु का मुख्य सूत्र:{" "}
                  <strong
                    style={{
                      color: "#FEF08A",
                      background: "rgba(254, 240, 138, 0.2)",
                      padding: "2px 8px",
                      borderRadius: 6,
                      border: "1px solid rgba(254, 240, 138, 0.5)",
                      fontWeight: 800,
                    }}
                  >
                    "जिसका समय चल रहा है, उसी ग्रह को पकड़ना है!"
                  </strong>{" "}
                  यह रिपोर्ट आपकी कुंडली की स्पष्ट डिग्री, कम्पाउंड डिग्री और वर्तमान दशा चक्र पर 100% गतिशील रूप से तैयार की गई है।
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div
                  style={{
                    background: "#0C0A09",
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1.5px solid rgba(212, 175, 55, 0.6)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#FDE68A", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    लग्न (Lagna)
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#FFFFFF", marginTop: 3 }}>
                    {lagnaSign} ({lagnaSignHindi || lagnaSign}) · {lagnaCompoundDeg.toFixed(2)}°
                  </div>
                </div>
                <div
                  style={{
                    background: "#0C0A09",
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1.5px solid rgba(147, 197, 253, 0.6)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#93C5FD", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    सक्रिय महादशा / अंतर्दशा
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#FFFFFF", marginTop: 3 }}>
                    {activeDasha.mahadasha} / {activeDasha.antardasha}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: 📊 ग्रह स्थिति एवं कम्पाउंड डिग्रियां (Compound Degree Master Table) ── */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <span className="card-tag">Section 2 · Mathematical Foundation</span>
                <h3 className="card-title" style={{ margin: "4px 0 0 0", fontSize: 22 }}>
                  📊 ग्रह स्थिति एवं कम्पाउंड डिग्रियां (Compound Degree Master Table)
                </h3>
              </div>
              <div
                style={{
                  background: "#F5EFE3",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#854D0E",
                  border: "1px solid rgba(184, 134, 11, 0.3)",
                }}
              >
                सूत्र: <code style={{ fontFamily: "monospace", color: "#B8860B" }}>Compound Degree = राशि की प्रारंभिक डिग्री + राशि में स्पष्ट डिग्री</code>
              </div>
            </div>

            {/* Planets Table */}
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #E5E7EB" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#FAF8F5", borderBottom: "2px solid #E5E7EB", color: "#4A4238" }}>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>ग्रह (Planet)</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "center" }}>भाव</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>राशि (संख्या)</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>स्पष्ट डिग्री</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>प्रारंभिक डिग्री</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700, color: "#B8860B" }}>कम्पाउंड डिग्री</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>नक्षत्र (स्वामी)</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>एस्ट्रो-वास्तु दिशा</th>
                  </tr>
                </thead>
                <tbody>
                  {planetCoordinates.map((p, idx) => {
                    const isDashaLord = p.name === activeDasha.mahadasha || p.name === activeDasha.antardasha;
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid #F3F4F6",
                          background: isDashaLord ? "rgba(254, 240, 138, 0.15)" : idx % 2 === 0 ? "#FFFFFF" : "#FAF8F5",
                        }}
                      >
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#1A1A1A" }}>
                          {p.hindiName} ({p.name})
                          {isDashaLord && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 10,
                                background: "#B8860B",
                                color: "#FFFFFF",
                                padding: "2px 6px",
                                borderRadius: 10,
                              }}
                            >
                              दशानाथ
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600 }}>{p.house}</td>
                        <td style={{ padding: "12px 14px" }}>
                          {p.signHindi} ({p.signNum})
                        </td>
                        <td style={{ padding: "12px 14px", fontFamily: "monospace" }}>{p.degInSignFormatted}</td>
                        <td style={{ padding: "12px 14px", fontFamily: "monospace", color: "#6B635B" }}>{p.startDeg}°</td>
                        <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#B8860B" }}>
                          {p.compoundDegFormatted}
                        </td>
                        <td style={{ padding: "12px 14px", color: "#4A4238" }}>
                          {p.nakshatra} ({p.nakshatraLord})
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: 600, color: "#1E3A8A" }}>
                          {p.direction.code} ({p.direction.directionHindi})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Toggle Cusp Table */}
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowCuspsTable(!showCuspsTable)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#B8860B",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {showCuspsTable ? "▲ 12 भाव कस्प डिग्रियां छिपाएं" : "▼ 12 भाव कस्प डिग्रियां देखें (House Cusps Table)"}
              </button>
            </div>

            {showCuspsTable && cuspCoordinates.length > 0 && (
              <div style={{ marginTop: 12, overflowX: "auto", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#F5EFE3", borderBottom: "2px solid #E5E7EB", color: "#4A4238" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>भाव (House)</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>राशि</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>स्पष्ट डिग्री</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>प्रारंभिक डिग्री</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, color: "#B8860B" }}>कम्पाउंड डिग्री</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>एस्ट्रो-वास्तु दिशा</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuspCoordinates.map((c, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F3F4F6", background: idx % 2 === 0 ? "#FFFFFF" : "#FAF8F5" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700 }}>भाव {c.house}</td>
                        <td style={{ padding: "10px 12px" }}>{c.signHindi} ({c.signNum})</td>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace" }}>{c.degInSignFormatted}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#6B635B" }}>{c.startDeg}°</td>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, color: "#B8860B" }}>{c.compoundDegFormatted}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1E3A8A" }}>{c.direction.code} ({c.direction.directionHindi})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Clusters & Power Center Callout */}
            {clusters.length > 0 && (
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                {clusters.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: c.isPowerCenter ? "linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)" : "#F5EFE3",
                      border: `1px solid ${c.isPowerCenter ? "#F59E0B" : "rgba(184, 134, 11, 0.3)"}`,
                      borderRadius: 14,
                      padding: "16px 18px",
                      boxShadow: c.isPowerCenter ? "0 4px 14px rgba(245, 158, 11, 0.15)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{c.isPowerCenter ? "🌟" : "✦"}</span>
                      <strong style={{ fontSize: 15, color: c.isPowerCenter ? "#B45309" : "#78350F" }}>
                        {c.isPowerCenter ? `अद्भुत योग (${c.planets.length} ग्रहों का जमावड़ा - Power Center)` : `ग्रह संकुल (Planetary Cluster)`}
                      </strong>
                      <span style={{ fontSize: 12, background: "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: 8 }}>
                        दिशा: {c.direction.code} ({c.direction.directionHindi})
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#451A03", lineHeight: 1.6 }}>
                      {c.narrative}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── SECTION 3: ⏳ वर्तमान सक्रिय दशा ऑडिट (Current Dasha Audit) ── */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
              <div>
                <span className="card-tag">Section 3 · Time Activation</span>
                <h3 className="card-title" style={{ margin: "4px 0 0 0", fontSize: 22 }}>
                  ⏳ वर्तमान सक्रिय दशा ऑडिट (Current Dasha Audit)
                </h3>
              </div>
              <div style={{ fontStyle: "italic", fontSize: 13, color: "#854D0E" }}>
                "जिसका समय चल रहा है, उसी ग्रह को पकड़ना है!"
              </div>
            </div>

            <div className="grid-2" style={{ gap: 14 }}>
              <div style={{ background: "#FAF8F5", borderRadius: 14, padding: 18, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>महादशा (Mahadasha - MD)</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  {activeDasha.mahadasha}
                </div>
                <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
                  अवधि: {activeDasha.mahadashaStart || "आरंभ"} से {activeDasha.mahadashaEnd || "सक्रिय"}
                </div>
              </div>

              <div style={{ background: "#FAF8F5", borderRadius: 14, padding: 18, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>अंतर्दशा (Antardasha - AD)</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  {activeDasha.antardasha}
                </div>
                <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
                  अवधि: {activeDasha.antardashaStart || "आरंभ"} से {activeDasha.antardashaEnd || "सक्रिय"}
                </div>
              </div>
            </div>

            {/* Cosmic Friction Status Banner */}
            <div
              style={{
                marginTop: 16,
                borderRadius: 14,
                padding: 16,
                border: trafficPoliceBlockades.length > 0 ? "1px solid #DC2626" : "1px solid #16A34A",
                background: trafficPoliceBlockades.length > 0 ? "rgba(239, 68, 68, 0.06)" : "rgba(34, 197, 94, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{trafficPoliceBlockades.length > 0 ? "🚨" : "✅"}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: trafficPoliceBlockades.length > 0 ? "#DC2626" : "#15803D" }}>
                    कॉस्मिक फ्रिक्शन ऑडिट: {trafficPoliceBlockades.length > 0 ? `${trafficPoliceBlockades.length} गतिरोध सक्रिय (Cosmic Friction Lock)` : "ऊर्जा पथ पूर्णतः स्वच्छ व निर्बाध"}
                  </h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: 13.5, color: "#4A4238", lineHeight: 1.5 }}>
                    {trafficPoliceBlockades.length > 0
                      ? `दशा स्वामी ${activeDasha.mahadasha} को अन्य ग्रहों द्वारा कोणीय दबाव (90°/180°) मिल रहा है, जिससे दशा के शुभ फल घर के वास्तु दोषों के कारण रुक रहे हैं।`
                      : `वर्तमान दशा स्वामी पर किसी शत्रु अथवा पापी ग्रह का कोई कोणीय जाम नहीं है। दशा की ऊर्जा स्वतंत्र प्रवाहित हो रही है।`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4: 🚨 दशानाथ की हिट्स एवं वर्णनात्मक भविष्यफल (Hits & Predictive Impacts - Paragraph Style) ── */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <span className="card-tag">Section 4 · Predictive Analytics</span>
                <h3 className="card-title" style={{ margin: "4px 0 0 0", fontSize: 22 }}>
                  🚨 दशानाथ की हिट्स एवं वर्णनात्मक भविष्यफल (Hits of Dasha Lord & Real-Life Symptoms)
                </h3>
              </div>
              <div style={{ fontSize: 12, color: "#6B635B" }}>
                3-5-8 ऑर्ब नियम के अनुसार सटीक कोणीय गणना
              </div>
            </div>

            {dashaLordHitsAnalysis.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", background: "#FAF8F5", borderRadius: 12, color: "#6B635B" }}>
                वर्तमान दशा स्वामी अथवा प्रमुख केंद्र भावों पर कोई विध्वंसक हिट सक्रिय नहीं है।
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {dashaLordHitsAnalysis.map((hit, idx) => {
                  const is180 = hit.hitAngle === 180;
                  const is90 = hit.hitAngle === 90;
                  const badgeColor = is180 ? "#DC2626" : is90 ? "#EA580C" : "#CA8A04";
                  const borderColor = is180 ? "rgba(220, 38, 38, 0.4)" : is90 ? "rgba(234, 88, 12, 0.4)" : "rgba(202, 138, 4, 0.4)";
                  const bgLight = is180 ? "rgba(220, 38, 38, 0.03)" : is90 ? "rgba(234, 88, 12, 0.03)" : "rgba(202, 138, 4, 0.03)";

                  return (
                    <div
                      key={idx}
                      style={{
                        borderRadius: 16,
                        border: `1px solid ${borderColor}`,
                        borderLeft: `6px solid ${badgeColor}`,
                        background: bgLight,
                        padding: "20px 22px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                      }}
                    >
                      {/* Hit Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                        <div>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: badgeColor,
                              background: is180 ? "rgba(220, 38, 38, 0.12)" : is90 ? "rgba(234, 88, 12, 0.12)" : "rgba(202, 138, 4, 0.12)",
                              padding: "3px 10px",
                              borderRadius: 12,
                            }}
                          >
                            {is180 ? "💀 180° किलर हिट (Killer Hit)" : is90 ? "⚠️ 90° घातक हिट (Dangerous Hit)" : `${hit.hitAngle}° कोणीय हिट`}
                          </span>
                          <h4 style={{ margin: "8px 0 0 0", fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>
                            {hit.hitTitle}
                          </h4>
                        </div>
                        <div style={{ fontSize: 12, color: "#6B635B" }}>
                          Orb: <strong>{hit.orbDistance.toFixed(2)}°</strong> (सीमा: ±{hit.orbLimit}°)
                        </div>
                      </div>

                      {/* Exact Math Formula Box */}
                      <div
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          fontFamily: "monospace",
                          fontSize: 13,
                          color: "#1E293B",
                          marginBottom: 14,
                        }}
                      >
                        {hit.calculationFormula}
                      </div>

                      {/* Descriptive Narrative Paragraph */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#4A4238", textTransform: "uppercase", marginBottom: 6, letterSpacing: 0.5 }}>
                          📖 वर्णनात्मक फलकथन (Predictive Interpretation):
                        </div>
                        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#1F2937" }}>
                          {hit.predictiveNarrative}
                        </p>
                      </div>

                      {/* Real Life Symptoms Bullet Checklist */}
                      {hit.realLifeSymptoms.length > 0 && (
                        <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.06)" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: badgeColor, textTransform: "uppercase", marginBottom: 8 }}>
                            ✦ दैनिक जीवन में दिखने वाले प्रत्यक्ष लक्षण (Visible Symptoms):
                          </div>
                          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>
                            {hit.realLifeSymptoms.map((sym, sIdx) => (
                              <li key={sIdx} style={{ marginBottom: 4 }}>
                                {sym}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── SECTION 5: 🏠 घर के किस ज़ोन में क्या सामान पड़ा होगा? (Astro-Vastu Field Test) ── */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <span className="card-tag">Section 5 · Practical Field Test</span>
                <h3 className="card-title" style={{ margin: "4px 0 0 0", fontSize: 22 }}>
                  🏠 घर के किस ज़ोन में क्या सामान पड़ा होगा? (Astro-Vastu Field Test)
                </h3>
              </div>
              <div style={{ fontSize: 13, color: "#6B635B" }}>
                कुंडली के अनुसार जातक के वास्तविक घर की भौतिक वस्तुएं व वास्तु दोष
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {spatialFieldTest
                .filter((z) => z.planetsPresent.length > 0 || z.isDashaLordZone || z.mahaVastuWarningParagraph)
                .map((zone, zIdx) => (
                  <div
                    key={zIdx}
                    style={{
                      borderRadius: 14,
                      border: zone.mahaVastuWarningParagraph
                        ? "1.5px solid #EF4444"
                        : "1px solid rgba(184, 134, 11, 0.25)",
                      background: "#FFFFFF",
                      padding: "18px 20px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            background: "#F5EFE3",
                            color: "#854D0E",
                            padding: "3px 10px",
                            borderRadius: 8,
                          }}
                        >
                          {zone.zoneCode} ({zone.directionHindi})
                        </span>
                        <strong style={{ fontSize: 16, color: "#1A1A1A" }}>
                          {zone.signHindi} ({zone.signNum} नंबर राशि) · भाव {zone.houseNumbers.join(", ")}
                        </strong>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {zone.planetsPresent.map((p) => (
                          <span key={p} className="badge badge-gold" style={{ fontSize: 11, padding: "3px 8px" }}>
                            🪐 {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Predicted Objects */}
                    <p style={{ margin: "0 0 10px 0", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                      {zone.predictedItemsParagraph}
                    </p>

                    {/* MahaVastu Blunder Warning */}
                    {zone.mahaVastuWarningParagraph && (
                      <div
                        style={{
                          background: "rgba(239, 68, 68, 0.08)",
                          borderLeft: "4px solid #DC2626",
                          padding: "10px 14px",
                          borderRadius: 8,
                          fontSize: 13.5,
                          color: "#991B1B",
                          lineHeight: 1.6,
                          marginBottom: 10,
                        }}
                      >
                        <strong>⚠️ महावास्तु वालों की किताबी गलती से सावधान:</strong> {zone.mahaVastuWarningParagraph}
                      </div>
                    )}

                    {/* Corrective Action */}
                    <div style={{ fontSize: 13, color: "#065F46", background: "rgba(16, 185, 129, 0.08)", padding: "8px 12px", borderRadius: 8 }}>
                      <strong>✦ सुधारात्मक निर्देश:</strong> {zone.correctiveActionParagraph}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* ── SECTION 6: 🛡️ न्यूट्रलाइजेशन एवं 120° रक्षक ढाल (120° Protective Shield Shifting) ── */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
              <div>
                <span className="card-tag">Section 6 · Neutralization Protocol</span>
                <h3 className="card-title" style={{ margin: "4px 0 0 0", fontSize: 22 }}>
                  🛡️ न्यूट्रलाइजेशन एवं 120° रक्षक ढाल (120° Protective Shield Shifting)
                </h3>
              </div>
              <div style={{ fontSize: 13, color: "#6B635B" }}>
                180° किलर हिट को 120° मित्र त्रिकोण में मोड़कर सुरक्षित ढाल बनाना
              </div>
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: 14, color: "#4A4238", lineHeight: 1.6 }}>
              एस्ट्रो-वास्तु का प्रमुख नियम: <em>"हिट को तोड़ा नहीं जा सकता, परंतु ग्रह के भौतिक कारक सामान को उसके 120° त्रिकोण मित्र भाव में शिफ्ट करके उसकी मारक ऊर्जा को सुरक्षा कवच में रूपांतरित किया जा सकता है।"</em>
            </p>

            {shiftingPrescriptions.length === 0 ? (
              <div style={{ padding: 18, background: "#FAF8F5", borderRadius: 12, textAlign: "center", color: "#6B635B" }}>
                वर्तमान में किसी ग्रह के लिए 120° शिफ्टिंग की आवश्यकता नहीं है।
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {shiftingPrescriptions.map((shift, sIdx) => {
                  const sourceCoord = planetCoordinates.find((p) => p.name === shift.problematicPlanet);
                  const sourceDirStr = sourceCoord ? `${sourceCoord.direction.code} (${sourceCoord.direction.directionHindi})` : "वर्तमान ज़ोन";

                  return (
                    <div
                      key={sIdx}
                      style={{
                        borderRadius: 14,
                        border: "1px solid rgba(22, 163, 74, 0.4)",
                        background: "rgba(22, 163, 74, 0.03)",
                        padding: "18px 20px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                        <span className="badge badge-green" style={{ fontSize: 12 }}>
                          🛡️ 120° त्रिकोण शिफ्ट: {shift.problematicPlanet}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
                          {sourceDirStr} ➔ {shift.targetDirection} ({shift.targetSignName} - {shift.targetDirectionHindi})
                        </span>
                      </div>

                      <div style={{ fontSize: 12.5, color: "#6B635B", marginBottom: 6 }}>
                        <strong>उपचार लक्ष्य:</strong> {shift.afflictedTarget} पर {shift.currentHit}
                      </div>

                      <p style={{ margin: "6px 0 12px 0", fontSize: 14, color: "#1F2937", lineHeight: 1.6 }}>
                        {shift.shiftingMethod}
                      </p>

                      <div className="grid-2" style={{ gap: 12 }}>
                        <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 12, border: "1px solid rgba(220, 38, 38, 0.25)" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 6 }}>
                            🚫 {sourceDirStr} ज़ोन से तुरंत हटाएं:
                          </div>
                          <div style={{ fontSize: 13, color: "#4B5563" }}>
                            {shift.itemsToRemoveFromCurrentZone.join(", ")}
                          </div>
                        </div>

                        <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 12, border: "1px solid rgba(22, 163, 74, 0.3)" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginBottom: 6 }}>
                            ✅ {shift.targetDirection} ज़ोन में स्थापित करें:
                          </div>
                          <div style={{ fontSize: 13, color: "#4B5563" }}>
                            {shift.itemsToPlace.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Integrated Secret 1: Family Cross-Hit Protection Callout */}
            <div
              style={{
                marginTop: 18,
                background: "rgba(217, 119, 6, 0.08)",
                borderLeft: "4px solid #D97706",
                borderRadius: 10,
                padding: "14px 16px",
                fontSize: 13,
                color: "#78350F",
                lineHeight: 1.6,
              }}
            >
              <strong>💡 एस्ट्रो-वास्तु अनिवार्य गुप्त सूत्र 1 (Family Cross-Hit Protection):</strong>{" "}
              {familyCrossHitIsolationRule.rule}
            </div>
          </div>

          {/* ── SECTION 7: 🧘 शरीर के स्तर पर उपचार (Body Part & Dot/Thread Therapy) ── */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
              <div>
                <span className="card-tag">Section 7 · Micro-Somatic Healing</span>
                <h3 className="card-title" style={{ margin: "4px 0 0 0", fontSize: 20 }}>
                  🧘 शरीर के स्तर पर उपचार (Body Part & Dot/Thread Therapy)
                </h3>
              </div>
              <div style={{ fontSize: 13, color: "#854D0E", fontWeight: 600 }}>
                किराए के मकान या बिना तोड़-फोड़ के त्वरित देह-वास्तु समाधान
              </div>
            </div>

            <p style={{ margin: "0 0 14px 0", fontSize: 13.5, color: "#4A4238", lineHeight: 1.6 }}>
              यदि घर में तुरंत सामान बदलना या शिफ्ट करना संभव न हो, तो शरीर के संबंधित अंग (Sign-to-Body Part) पर विशेष प्राकृतिक तत्व (केसर, देशी घी, चंदन, काजल) या रंगीन बिंदी लगाकर मारक ऊर्जा को तत्काल सुरक्षा कवच में बदला जाता है।
            </p>

            {/* 3 Core Rule Cards */}
            <div className="grid-3" style={{ gap: 12, marginBottom: 16 }}>
              {/* Dot Therapy Card */}
              <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>
                  1. नाभि व 4th हाउस उपचार
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  नाभि के 2 इंच का क्षेत्र (Virgo)
                </div>
                <p style={{ margin: "6px 0 0 0", fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                  चतुर्थ भाव या बुध पर दबाव होने पर नाभि के 2 इंच के घेरे में प्रतिदिन सुबह <strong>2 बूंद शुद्ध गाय का देशी घी</strong> या सफेद चंदन लगाएं। यह घर की कलह, अनिद्रा व तनाव को तुरंत शांत करता है।
                </p>
              </div>

              {/* Knee Therapy Card */}
              <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(220, 38, 38, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>
                  2. घुटना डॉट चिकित्सा (Knee Dot)
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  पुरुष दायां घुटना / स्त्री बायां घुटना (मकर)
                </div>
                <p style={{ margin: "6px 0 0 0", fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                  दशम भाव या शनि की 180° किलर हिट होने पर संबंधित घुटने पर <strong>काजल या मार्कर से एक सूक्ष्म काली बिंदी (Dot)</strong> लगाएं। यह सीधे मारक ऊर्जा को 120° रक्षक कवच में रूपांतरित करता है।
                </p>
              </div>

              {/* Wrist Thread Alert Card */}
              <div
                style={{
                  background: wristThreadTrapAlert.severity === "CRITICAL" ? "rgba(220, 38, 38, 0.06)" : "#FAF8F5",
                  borderRadius: 12,
                  padding: 14,
                  border: wristThreadTrapAlert.severity === "CRITICAL" ? "1px solid #DC2626" : "1px solid rgba(184, 134, 11, 0.25)",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: wristThreadTrapAlert.severity === "CRITICAL" ? "#DC2626" : "#B8860B", textTransform: "uppercase" }}>
                  3. कलाई में धागा बांधने का जाल
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  {wristThreadTrapAlert.alertTitle}
                </div>
                <p style={{ margin: "6px 0 0 0", fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                  {wristThreadTrapAlert.explanation}
                </p>
              </div>
            </div>

            {/* Complete 12-Sign Prescriptive Matrix (100% Dynamic & Chart-Driven) */}
            {renderDynamicBodyTherapyTable()}
          </div>

          {/* ── SECTION 8: 🎯 एस्ट्रो-वास्तु के 4 विशेष गुप्त व्यावहारिक सूत्र (Secrets 1, 2, 5, 6) ── */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <span className="card-tag">Section 8 · Secret Practical Axioms</span>
                <h3 className="card-title" style={{ margin: "4px 0 0 0", fontSize: 22 }}>
                  🎯 एस्ट्रो-वास्तु के 4 विशेष गुप्त व्यावहारिक सूत्र (Secrets 1, 2, 5, 6)
                </h3>
              </div>
              <div style={{ fontSize: 13, color: "#854D0E", fontWeight: 600 }}>
                एस्ट्रो-वास्तु के सबसे गूढ़ नियम
              </div>
            </div>

            <div className="grid-2" style={{ gap: 14 }}>
              {/* Formula 1 */}
              <div style={{ background: "#FAF8F5", borderRadius: 14, padding: 18, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>
                  सूत्र 1 · नाभि एवं 4th कस्प संबंध
                </div>
                <h4 style={{ margin: "6px 0 4px 0", fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>
                  शरीर में नाभि = घर में 4था भाव (मानसिक शांति)
                </h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "#4A4238", lineHeight: 1.6 }}>
                  कन्या राशि नाभि की कारक है। यदि कुंडली में 4थे भाव पर कोई पापी हिट आ रही हो, तो घर के 4थे भाव के साथ-साथ जातक की नाभि के 2 इंच का क्षेत्र भी अशांत हो जाता है। इस पर चंदन या शुद्ध घी का प्रयोग घर के कलह को तुरंत शांत करता है।
                </p>
              </div>

              {/* Formula 2 */}
              <div style={{ background: "#FAF8F5", borderRadius: 14, padding: 18, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", textTransform: "uppercase" }}>
                  सूत्र 2 · 4th, 9th, 10th हाउस स्टडी व वर्क ज़ोन
                </div>
                <h4 style={{ margin: "6px 0 4px 0", fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>
                  शिक्षा {studyAndWorkDirection.recommendedStudyZone} में, ऑनलाइन कार्य {studyAndWorkDirection.recommendedOnlineWorkZone} में
                </h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "#4A4238", lineHeight: 1.6 }}>
                  अध्ययन के लिए 4थे भाव की दिशा ({studyAndWorkDirection.fourthHouseDirection} - {studyAndWorkDirection.fourthHouseHindi}) तथा उच्च विद्या के लिए 9वें भाव की दिशा ({studyAndWorkDirection.ninthHouseDirection}) का चयन करें। लैपटॉप और ऑनलाइन व्यापार के लिए 10वें भाव की दिशा ({studyAndWorkDirection.tenthHouseDirection}) सर्वोत्तम है।
                </p>
              </div>

              {/* Formula 5 */}
              <div style={{ background: "#FAF8F5", borderRadius: 14, padding: 18, border: "1px solid rgba(220, 38, 38, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>
                  सूत्र 5 · मंगल दोष: सौंफ/मिश्री, लाल कपड़ा त्याग व घुटना उपचार
                </div>
                <h4 style={{ margin: "6px 0 4px 0", fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>
                  अत्यधिक उग्र मंगल को शांत करने की दैनिक जीवनशैली
                </h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "#4A4238", lineHeight: 1.6 }}>
                  यदि मंगल की दशा हो या मंगल 4थे/10वें भाव पर किलर हिट मार रहा हो, तो भोजन के बाद सौंफ और धागे वाली मिश्री का सेवन अनिवार्य करें। लाल चादर, लाल तकिया और लाल कपड़े पहनना पूरी तरह बंद करें।
                </p>
              </div>

              {/* Formula 6 */}
              <div style={{ background: "#FAF8F5", borderRadius: 14, padding: 18, border: "1px solid rgba(147, 51, 234, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9333EA", textTransform: "uppercase" }}>
                  सूत्र 6 · कलाई में धागा/मौली बांधने का जाल
                </div>
                <h4 style={{ margin: "6px 0 4px 0", fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>
                  कलाई (मिथुन) का दुस्थान भावों से संबंध
                </h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "#4A4238", lineHeight: 1.6 }}>
                  कालपुरुष चक्र में मिथुन राशि (3) कलाई का प्रतिनिधित्व करती है। यदि आपकी कुंडली में मिथुन राशि 6ठे, 8वें या 12वें भाव में हो, तो कलाई में धागा बांधना सीधे रोग, दुर्घटना या अस्पताल के खर्चे को सक्रिय कर देता है। कलाई को सर्वथा मुक्त रखें।
                </p>
              </div>
            </div>
          </div>

          {/* ── Direct Deep Dive CTA Bar ── */}
          <div
            style={{
              background: "#F5EFE3",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              border: "1px solid rgba(184, 134, 11, 0.3)",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                विस्तृत इंटरैक्टिव टूल्स देखें (Interactive Tools)
              </div>
              <div style={{ fontSize: 13, color: "#6B635B" }}>
                12-दिशा चक्र, कॉस्मिक फ्रिक्शन रडार, अथवा 120° शिफ्टिंग सिमुलेटर का व्यक्तिगत उपयोग करें
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTab("radar")}
                className="btn btn-secondary"
                style={{ fontSize: 13, padding: "6px 14px" }}
              >
                🧭 कम्पास रडार
              </button>
              <button
                onClick={() => setActiveTab("trafficPolice")}
                className="btn btn-secondary"
                style={{ fontSize: 13, padding: "6px 14px" }}
              >
                ⚡ कॉस्मिक फ्रिक्शन
              </button>
              <button
                onClick={() => setActiveTab("shifting")}
                className="btn btn-secondary"
                style={{ fontSize: 13, padding: "6px 14px" }}
              >
                🔄 120° शिफ्टिंग
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: 12-DIRECTION COMPASS RADAR
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "radar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <span className="card-tag">Astro-Vastu Direction Grid</span>
                <h3 className="card-title" style={{ margin: 0 }}>
                  12 राशियों का एस्ट्रो-वास्तु दिशा चक्र (Direction Radar)
                </h3>
              </div>
              <span style={{ fontSize: 13, color: "#6B635B" }}>
                किसी भी दिशा पर क्लिक करके वहां के ग्रह व सामान देखें
              </span>
            </div>

            {/* Visual Direction Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 12,
                marginTop: 14,
              }}
            >
              {Object.entries(ASTRO_VASTU_SIGN_DIRECTIONS).map(([signNumStr, dirInfo]) => {
                const sNum = Number(signNumStr);
                const inv = directionPlanetaryInventory[dirInfo.code];
                const isSelected = selectedDirectionCode === dirInfo.code;
                const hasPlanets = inv && inv.planets.length > 0;

                // Check if this direction has an active cosmic friction lock source
                const hasBlockade = trafficPoliceBlockades.some(
                  (tp) => tp.physicalLocation.direction.includes(dirInfo.direction) || tp.physicalLocation.direction.includes(dirInfo.code)
                );

                return (
                  <div
                    key={dirInfo.code}
                    onClick={() => setSelectedDirectionCode(dirInfo.code)}
                    style={{
                      cursor: "pointer",
                      borderRadius: 14,
                      border: isSelected
                        ? "2px solid #B8860B"
                        : hasBlockade
                        ? "1px solid rgba(220, 38, 38, 0.5)"
                        : "1px solid rgba(184, 134, 11, 0.22)",
                      background: isSelected
                        ? "rgba(184, 134, 11, 0.08)"
                        : hasBlockade
                        ? "rgba(220, 38, 38, 0.04)"
                        : "#FFFFFF",
                      padding: "14px 16px",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected ? "0 4px 12px rgba(184, 134, 11, 0.15)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: isSelected ? "#B8860B" : "#1A1A1A",
                          background: isSelected ? "rgba(184, 134, 11, 0.15)" : "#F5EFE3",
                          padding: "2px 8px",
                          borderRadius: 8,
                        }}
                      >
                        {dirInfo.code} · {dirInfo.direction}
                      </span>
                      {hasBlockade && (
                        <span style={{ fontSize: 10, color: "#DC2626", fontWeight: 700, background: "rgba(220,38,38,0.1)", padding: "2px 6px", borderRadius: 6 }}>
                          🚨 ब्लॉक
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                      {dirInfo.signNum}. {dirInfo.signName} ({dirInfo.directionHindi})
                    </div>

                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {hasPlanets ? (
                        inv.planets.map((p) => (
                          <span
                            key={p}
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              background: isSelected ? "#FAF5EB" : "#FAF8F5",
                              border: "1px solid rgba(184, 134, 11, 0.3)",
                              padding: "2px 7px",
                              borderRadius: 12,
                              color: "#1A1A1A",
                            }}
                          >
                            🪐 {p}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: 11, color: "#A8A29E" }}>रिक्त राशि (खाली)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Direction Deep-Dive Card */}
          {selectedDirectionData && (
            <div
              className="card"
              style={{
                borderLeft: "5px solid #B8860B",
                background: "#FAF8F5",
                padding: 22,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span className="card-tag">चयनित दिशा विवरण (Zone Inspection)</span>
                  <h3 className="card-title" style={{ margin: "4px 0 0 0", color: "#1A1A1A" }}>
                    {selectedDirectionCode} — {selectedDirectionData.sign} (
                    {ASTRO_VASTU_SIGN_DIRECTIONS[selectedDirectionData.signNum]?.directionHindi})
                  </h3>
                </div>
                <div style={{ fontSize: 12, color: "#6B635B" }}>
                  {ASTRO_VASTU_SIGN_DIRECTIONS[selectedDirectionData.signNum]?.notes}
                </div>
              </div>

              <div className="grid-2" style={{ marginTop: 16 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.18)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#B8860B", textTransform: "uppercase", marginBottom: 6 }}>
                    विद्यमान ग्रह (Planets Residing in this Direction)
                  </div>
                  {selectedDirectionData.planets.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {selectedDirectionData.planets.map((p) => (
                        <span key={p} className="badge badge-gold" style={{ fontSize: 13, padding: "5px 12px" }}>
                          ✦ {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "#6B635B", margin: 0 }}>
                      इस दिशा में जन्म कुंडली का कोई ग्रह स्थित नहीं है।
                    </p>
                  )}
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.18)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#B8860B", textTransform: "uppercase", marginBottom: 6 }}>
                    प्राकृतिक कारक वस्तुएं (Physical Karaka Items in House)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedDirectionData.karakaObjects.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 12,
                          background: "#F5EFE3",
                          padding: "3px 9px",
                          borderRadius: 6,
                          color: "#4A4238",
                        }}
                      >
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB: ASTRO-PHARMACOLOGICAL PRESCRIPTION FORMULA
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "rxPrescription" && astroPrescription && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Prescription Master Header */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #064E3B 0%, #065F46 100%)",
              color: "#FFFFFF",
              padding: 24,
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(6, 78, 59, 0.25)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>💊</span>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 6 }}>
                    Rx MASTER PRESCRIPTION
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>
                  {astroPrescription.title} — {astroPrescription.nativeName}
                </h2>
                <p style={{ margin: "6px 0 0 0", fontSize: 13.5, color: "#A7F3D0" }}>
                  {astroPrescription.formulaSubtitle}
                </p>
              </div>
              <div
                style={{
                  background: "rgba(0,0,0,0.25)",
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontSize: 12,
                  color: "#E2E8F0",
                  maxWidth: 360,
                }}
              >
                <div style={{ fontWeight: 700, color: "#34D399", marginBottom: 2 }}>⚡ फ्रिक्शन डायग्नोसिस:</div>
                {astroPrescription.frictionDiagnosisSummary}
              </div>
            </div>
          </div>

          {/* Tri-Fold Formula Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {/* 1. Active Salt */}
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                borderTop: "5px solid #10B981",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge" style={{ background: "#ECFDF5", color: "#065F46", fontWeight: 700, fontSize: 12 }}>
                  {astroPrescription.activeSalt.badgeLabel}
                </span>
                <span style={{ fontSize: 22 }}>💊</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
                  1. सक्रिय घटक (Active Molecule)
                </h3>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#059669", marginTop: 4 }}>
                  {astroPrescription.activeSalt.elementOrAction}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                <strong>लक्ष्य:</strong> {astroPrescription.activeSalt.targetObjective}
              </p>
              <div style={{ background: "#F3F4F6", padding: "8px 12px", borderRadius: 8, fontSize: 11.5, color: "#374151" }}>
                <strong>शास्त्रीय आधार:</strong> {astroPrescription.activeSalt.scientificHitReason}
              </div>
            </div>

            {/* 2. PPI Antacid Shield */}
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                borderTop: "5px solid #3B82F6",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge" style={{ background: "#EFF6FF", color: "#1E40AF", fontWeight: 700, fontSize: 12 }}>
                  {astroPrescription.protonPumpInhibitor.badgeLabel}
                </span>
                <span style={{ fontSize: 22 }}>🛡️</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
                  2. सुरक्षा कवच (120° PPI Buffer Shield)
                </h3>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2563EB", marginTop: 4 }}>
                  {astroPrescription.protonPumpInhibitor.elementOrAction}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                <strong>सुरक्षा कार्य:</strong> {astroPrescription.protonPumpInhibitor.targetObjective}
              </p>
              <div style={{ background: "#F3F4F6", padding: "8px 12px", borderRadius: 8, fontSize: 11.5, color: "#374151" }}>
                <strong>शास्त्रीय आधार:</strong> {astroPrescription.protonPumpInhibitor.scientificHitReason}
              </div>
            </div>

            {/* 3. Nutritional Support */}
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                borderTop: "5px solid #8B5CF6",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge" style={{ background: "#F5F3FF", color: "#5B21B6", fontWeight: 700, fontSize: 12 }}>
                  ⚡ पोषण व क्रिस्टल सपोर्ट
                </span>
                <span style={{ fontSize: 22 }}>💎</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
                  3. सह-पोषक तत्व (Nutritional Co-Factor)
                </h3>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#7C3AED", marginTop: 4 }}>
                  {astroPrescription.crystals.wearableBracelet.map(c => c.crystalName).join(" + ")}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                <strong>पोषण लक्ष्य:</strong> नर्वस सिस्टम की थकान, अनिद्रा व स्क्रीन स्ट्रेस का शमन कर वित्तीय अवसरों का चुंबक बनना।
              </p>
              <div style={{ background: "#F3F4F6", padding: "8px 12px", borderRadius: 8, fontSize: 11.5, color: "#374151" }}>
                <strong>तारा बल:</strong> {astroPrescription.crystals.wearableBracelet.map(c => `${c.crystalName} (${c.taraName})`).join(", ")}
              </div>
            </div>
          </div>

          {/* Strict Contraindications Box */}
          {astroPrescription.contraindications.length > 0 && (
            <div
              className="card"
              style={{
                background: "#FEF2F2",
                border: "1.5px solid #F87171",
                borderLeft: "6px solid #DC2626",
                padding: 18,
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>🚫</span>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#991B1B" }}>
                  सख्त वर्जित घटक (Contraindications / Negative Side-Effects Warning)
                </h4>
              </div>
              <p style={{ margin: "0 0 10px 0", fontSize: 12.5, color: "#7F1D1D" }}>
                नवतारा चक्र (7वीं वध तारा) एवं अस्त ग्रहों के विश्लेषण से निम्नलिखित रत्न/रंग आपकी कुंडली के लिए जहर समान हैं। इन्हें कलाई या शरीर पर कभी धारण न करें:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {astroPrescription.contraindications.map((ci, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 12.5, color: "#B91C1C" }}>
                    <span style={{ fontWeight: 700 }}>• [{ci.badgeLabel}]</span>
                    <span>{ci.elementOrAction} — <em>{ci.scientificHitReason}</em></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compound Thread & Crystals Detailed Protocol */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            {/* Custom Compound Thread Card */}
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                border: "1px solid #E5E7EB",
                padding: 20,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>🧵</span>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  कस्टमाइज्ड संयुक्त रक्षा सूत्र (Shielded Compound Thread)
                </h4>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F3F4F6", padding: 12, borderRadius: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: astroPrescription.compoundThread.blendedHex,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "2px solid #FFFFFF",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                    {astroPrescription.compoundThread.blendedColorHindi}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#6B7280" }}>
                    हेक्स कोड: {astroPrescription.compoundThread.blendedHex} ({astroPrescription.compoundThread.blendedColorName})
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                {astroPrescription.compoundThread.whyBlended}
              </p>
              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 10, fontSize: 12, color: "#374151" }}>
                <div><strong>कलाई:</strong> {astroPrescription.compoundThread.wristHand}</div>
                <div style={{ marginTop: 4 }}><strong>मुहूर्त:</strong> {astroPrescription.compoundThread.wearingDayAndTiming}</div>
                <div style={{ marginTop: 4 }}><strong>विधि:</strong> {astroPrescription.compoundThread.ritualInstructions}</div>
              </div>
            </div>

            {/* Crystals & Wallet Protocol Card */}
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                border: "1px solid #E5E7EB",
                padding: 20,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>👛</span>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  क्रिस्टल व वॉलेट समृद्धि प्रोटोकॉल
                </h4>
              </div>
              <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.5 }}>
                <div><strong>क्रिस्टल ब्रेसलेट:</strong> {astroPrescription.crystals.wearableBracelet.map(c => c.crystalHindi).join(" + ")}</div>
                {astroPrescription.crystals.deskManifestationCrystal.length > 0 && (
                  <div style={{ marginTop: 6, color: "#B45309" }}>
                    <strong>वर्क-डेस्क एसेट:</strong> {astroPrescription.crystals.deskManifestationCrystal.map(d => `${d.crystalName} (${d.placementZone})`).join(", ")}
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <strong>वॉलेट के सर्वोत्तम रंग:</strong> {astroPrescription.wallet.recommendedColors.join(", ")}
                </div>
                <div style={{ marginTop: 4, color: "#DC2626" }}>
                  <strong>वॉलेट में वर्जित रंग:</strong> {astroPrescription.wallet.colorsToAvoid.join(", ")}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>वॉलेट का बीज तत्व:</strong> {astroPrescription.wallet.seedItemInside}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>बरकत नोट:</strong> {astroPrescription.wallet.recommendedCurrencyNote}
                </div>
              </div>
            </div>
          </div>

          {/* Degree-Based Chromatic Tone Modulation */}
          {astroPrescription.chromaticModulation && (
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🎨</span>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                    अंश-आधारित क्रोमेटिक टोन मॉड्युलेशन (Degree-Based Chromatic Tone Modulation)
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: "#EEF2FF",
                    color: "#4338CA",
                    border: "1px solid #C7D2FE",
                  }}
                >
                  {astroPrescription.chromaticModulation.avasthaHindi}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #E5E7EB" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      background: astroPrescription.chromaticModulation.hexCode,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                      border: "2px solid #FFFFFF",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                      {astroPrescription.chromaticModulation.toneDescription}
                    </div>
                    <div style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}>
                      ग्रह: <strong>{astroPrescription.chromaticModulation.planet} ({astroPrescription.chromaticModulation.degFormatted})</strong>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1, fontFamily: "monospace" }}>
                      HEX: {astroPrescription.chromaticModulation.hexCode} · {astroPrescription.chromaticModulation.hslString}
                    </div>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12.5, color: "#374151", lineHeight: 1.55 }}>
                  <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>
                    🔬 वैज्ञानिक एवं शास्त्रीय नियम (Baladi Avastha Tuning):
                  </div>
                  <div>{astroPrescription.chromaticModulation.scientificRule}</div>
                  <div style={{ marginTop: 6, fontSize: 11.5, color: "#6B7280" }}>
                    संतृप्ति (Saturation): <strong>{astroPrescription.chromaticModulation.saturationPercent}%</strong> | प्रकाश (Lightness): <strong>{astroPrescription.chromaticModulation.lightnessPercent}%</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Anatomical Body-Zone Astro-Targeting Matrix */}
          {astroPrescription.anatomicalProtocols && astroPrescription.anatomicalProtocols.length > 0 && (
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🏃</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                      देह-अंग खगोलीय लक्ष्यीकरण प्रोटोकॉल (Anatomical Body-Zone Targeting)
                    </h4>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                      कालपुरुष राशियां, अंग अधिष्ठान, एवं आपकी कुंडली के अनुसार धारण-स्थान अनुकूलता
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                {astroPrescription.anatomicalProtocols.map((proto, pIdx) => {
                  const isAllowed = proto.isAllowedForNative;
                  return (
                    <div
                      key={pIdx}
                      style={{
                        background: isAllowed ? "#FFFFFF" : "#FEF2F2",
                        border: `1.5px solid ${isAllowed ? "#E5E7EB" : "#FECACA"}`,
                        borderRadius: 12,
                        padding: 14,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: isAllowed ? "#111827" : "#991B1B" }}>
                            {proto.bodyZoneHi} ({proto.bodyZoneEn})
                          </div>
                          <div style={{ fontSize: 11.5, color: "#6B7280" }}>
                            {proto.correspondingSign} · <strong>भाव {proto.houseInNativeChart}</strong> · {proto.rulingPlanet}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 8,
                            background: isAllowed ? "rgba(220, 38, 38, 0.12)" : "rgba(22, 163, 74, 0.12)",
                            color: isAllowed ? "#16A34A" : "#DC2626",
                            border: `1px solid ${isAllowed ? "#86EFAC" : "#FCA5A5"}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isAllowed ? "✅ जातक अनुकूल" : "🚨 वर्जित"}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10, background: isAllowed ? "#F9FAFB" : "#FFF1F2", padding: "8px 10px", borderRadius: 8 }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: proto.toneAndHex.hexColor,
                            border: "1.5px solid #FFFFFF",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>
                          {proto.wearableForm}
                        </div>
                      </div>

                      <div style={{ fontSize: 11.5, color: "#4B5563", lineHeight: 1.45 }}>
                        <strong>उद्देश्य:</strong> {proto.purpose}
                      </div>

                      <div style={{ fontSize: 11.5, color: "#6B7280", lineHeight: 1.45 }}>
                        <strong>खगोलीय प्रभाव:</strong> {proto.planetaryMechanism}
                      </div>

                      {proto.cautionNotice && (
                        <div
                          style={{
                            marginTop: "auto",
                            fontSize: 11,
                            padding: "6px 8px",
                            borderRadius: 6,
                            background: isAllowed ? "#F0FDF4" : "#FEE2E2",
                            color: isAllowed ? "#166534" : "#991B1B",
                            border: `1px solid ${isAllowed ? "#BBF7D0" : "#FECACA"}`,
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                        >
                          {proto.cautionNotice}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily Modern Wearables & Tech Astro-Prescription */}
          {astroPrescription.accessories && (
            <div
              className="card"
              style={{
                background: "#FAF8F5",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>📱</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                      आधुनिक दैनिक वेशभूषा व गैजेट वास्तु (Modern Daily Wearable & Tech Prescription)
                    </h4>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                      फोन कवर, जूते, टोपी, बेल्ट व मास्क — 24 घंटे की आभा (Aura) को शील्ड करने वाले आधुनिक उपादान
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                {/* 1. Phone Cover */}
                <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
                      📱 {astroPrescription.accessories.phoneCover.title}
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: "#EFF6FF", color: "#1D4ED8", padding: "2px 6px", borderRadius: 6 }}>3rd House</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#374151" }}>
                    <strong>✅ सर्वोत्तम रंग:</strong> {astroPrescription.accessories.phoneCover.recommendedColors.join(", ")}
                  </div>
                  <div style={{ fontSize: 12, color: "#DC2626" }}>
                    <strong>🚫 सख्त वर्जित:</strong> {astroPrescription.accessories.phoneCover.colorsToAvoid.join(", ")}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#4B5563" }}>
                    <strong>मटेरियल:</strong> {astroPrescription.accessories.phoneCover.caseMaterial}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#059669" }}>
                    <strong>वॉलपेपर:</strong> {astroPrescription.accessories.phoneCover.idealWallpaperAffirmation}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.45, marginTop: 2 }}>
                    {astroPrescription.accessories.phoneCover.planetaryMechanism}
                  </div>
                  <div style={{ marginTop: "auto", fontSize: 11, background: "#FFFBEB", color: "#92400E", padding: "6px 8px", borderRadius: 6, border: "1px solid #FDE68A" }}>
                    ⚠️ {astroPrescription.accessories.phoneCover.cautionNotice}
                  </div>
                </div>

                {/* 2. Footwear / Shoes */}
                <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
                      👟 {astroPrescription.accessories.footwear.title}
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: "#F5F3FF", color: "#6D28D9", padding: "2px 6px", borderRadius: 6 }}>12th House</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#374151" }}>
                    <strong>✅ सर्वोत्तम रंग:</strong> {astroPrescription.accessories.footwear.recommendedColors.join(", ")}
                  </div>
                  <div style={{ fontSize: 12, color: "#DC2626" }}>
                    <strong>🚫 सख्त वर्जित:</strong> {astroPrescription.accessories.footwear.colorsToAvoid.join(", ")}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#4B5563" }}>
                    <strong>मटेरियल:</strong> {astroPrescription.accessories.footwear.materialType}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.45, marginTop: 2 }}>
                    {astroPrescription.accessories.footwear.planetaryMechanism}
                  </div>
                  <div style={{ marginTop: "auto", fontSize: 11, background: "#FEF2F2", color: "#991B1B", padding: "6px 8px", borderRadius: 6, border: "1px solid #FECACA" }}>
                    ⚠️ {astroPrescription.accessories.footwear.cautionNotice}
                  </div>
                </div>

                {/* 3. Cap / Headwear */}
                <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
                      🧢 {astroPrescription.accessories.headwearCap.title}
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: "#FEF3C7", color: "#B45309", padding: "2px 6px", borderRadius: 6 }}>1st & 10th</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#374151" }}>
                    <strong>✅ सर्वोत्तम रंग:</strong> {astroPrescription.accessories.headwearCap.recommendedColors.join(", ")}
                  </div>
                  <div style={{ fontSize: 12, color: "#DC2626" }}>
                    <strong>🚫 सख्त वर्जित:</strong> {astroPrescription.accessories.headwearCap.colorsToAvoid.join(", ")}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#4B5563" }}>
                    <strong>शैली:</strong> {astroPrescription.accessories.headwearCap.style}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.45, marginTop: 2 }}>
                    {astroPrescription.accessories.headwearCap.planetaryMechanism}
                  </div>
                  <div style={{ marginTop: "auto", fontSize: 11, background: "#FFFBEB", color: "#92400E", padding: "6px 8px", borderRadius: 6, border: "1px solid #FDE68A" }}>
                    ⚠️ {astroPrescription.accessories.headwearCap.cautionNotice}
                  </div>
                </div>

                {/* 4. Waist Belt */}
                <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
                      🥋 {astroPrescription.accessories.belt.title}
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: "#ECFDF5", color: "#047857", padding: "2px 6px", borderRadius: 6 }}>7th House</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#374151" }}>
                    <strong>✅ सर्वोत्तम रंग:</strong> {astroPrescription.accessories.belt.recommendedColors.join(", ")}
                  </div>
                  <div style={{ fontSize: 12, color: "#DC2626" }}>
                    <strong>🚫 सख्त वर्जित:</strong> {astroPrescription.accessories.belt.colorsToAvoid.join(", ")}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#4B5563" }}>
                    <strong>बकल धातु:</strong> {astroPrescription.accessories.belt.buckleMetal}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.45, marginTop: 2 }}>
                    {astroPrescription.accessories.belt.planetaryMechanism}
                  </div>
                  <div style={{ marginTop: "auto", fontSize: 11, background: "#FFFBEB", color: "#92400E", padding: "6px 8px", borderRadius: 6, border: "1px solid #FDE68A" }}>
                    ⚠️ {astroPrescription.accessories.belt.cautionNotice}
                  </div>
                </div>

                {/* 5. Face Mask */}
                <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
                      😷 {astroPrescription.accessories.faceMask.title}
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: "#E0F2FE", color: "#0369A1", padding: "2px 6px", borderRadius: 6 }}>2nd House</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#374151" }}>
                    <strong>✅ सर्वोत्तम रंग:</strong> {astroPrescription.accessories.faceMask.recommendedColors.join(", ")}
                  </div>
                  <div style={{ fontSize: 12, color: "#DC2626" }}>
                    <strong>🚫 सख्त वर्जित:</strong> {astroPrescription.accessories.faceMask.colorsToAvoid.join(", ")}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#4B5563" }}>
                    <strong>कपड़ा:</strong> {astroPrescription.accessories.faceMask.fabric}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.45, marginTop: 2 }}>
                    {astroPrescription.accessories.faceMask.planetaryMechanism}
                  </div>
                  <div style={{ marginTop: "auto", fontSize: 11, background: "#FFFBEB", color: "#92400E", padding: "6px 8px", borderRadius: 6, border: "1px solid #FDE68A" }}>
                    ⚠️ {astroPrescription.accessories.faceMask.cautionNotice}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: COSMIC FRICTION LOCKS / DYNAMIC RADAR
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "trafficPolice" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {trafficPoliceBlockades.length === 0 ? (
            <div
              className="card"
              style={{
                borderLeft: "6px solid #16a34a",
                background: "rgba(22, 163, 74, 0.05)",
                padding: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32 }}>✅</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#15803d", fontWeight: 700 }}>
                    कॉस्मिक फ्रिक्शन क्लियर: ऊर्जा पथ पूर्णतः निर्बाध
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#4A4238" }}>
                    वर्तमान दशा स्वामी ({activeDasha.mahadasha} / {activeDasha.antardasha}) पर किसी भी शत्रु ग्रह की 90° या 180° की गतिरोध हिट नहीं है। ऊर्जा का प्रवाह पूर्णतः स्वच्छ है।
                  </p>
                </div>
              </div>
            </div>
          ) : (
            trafficPoliceBlockades.map((tp, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  borderLeft: "6px solid #DC2626",
                  background: "#FAF8F5",
                  padding: 22,
                  boxShadow: "0 4px 16px rgba(220, 38, 38, 0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="badge badge-red" style={{ fontWeight: 700 }}>
                        ⚡ कॉस्मिक फ्रिक्शन लॉक: {tp.hitAngle}° {tp.hitSeverity} Hit
                      </span>
                      <span style={{ fontSize: 12, color: "#6B635B" }}>
                        Orb Distance: {tp.orbDistance.toFixed(2)}° (Exact Diff: {tp.exactDiff.toFixed(2)}°)
                      </span>
                    </div>
                    <h3 style={{ margin: "8px 0 4px 0", fontSize: 20, color: "#1A1A1A", fontWeight: 700 }}>
                      दशा स्वामी <span style={{ color: "#2563EB" }}>{tp.dashaLordName}</span> को अवरुद्ध कर रहा है ग्रह{" "}
                      <span style={{ color: "#DC2626" }}>{tp.blockingPlanet}</span>
                    </h3>
                  </div>
                  <div
                    style={{
                      background: "rgba(220, 38, 38, 0.1)",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      borderRadius: 10,
                      padding: "8px 14px",
                      textAlign: "right",
                    }}
                  >
                    <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 700, textTransform: "uppercase" }}>
                      भौतिक अवरोध दिशा
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                      {tp.physicalLocation.direction} ({tp.physicalLocation.directionHindi})
                    </div>
                  </div>
                </div>

                {/* Theme Explanation */}
                <div
                  style={{
                    background: "rgba(220, 38, 38, 0.05)",
                    border: "1px solid rgba(220, 38, 38, 0.2)",
                    borderRadius: 10,
                    padding: 12,
                    marginTop: 14,
                    fontSize: 13,
                    color: "#7F1D1D",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>प्रभाव:</strong> {tp.blockageTheme}
                </div>

                {/* Physical Items & Remedial Action */}
                <div className="grid-2" style={{ marginTop: 14 }}>
                  <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.2)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#B8860B", textTransform: "uppercase", marginBottom: 6 }}>
                      🔍 घर के इस कोने में तुरंत जांचें (Items to Inspect)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {tp.physicalLocation.itemsToInspect.map((item, i) => (
                        <li key={i} style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.2)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d", textTransform: "uppercase", marginBottom: 6 }}>
                      🛠️ गतिरोध निवारण उपाय (Friction Release Action)
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#4A4238", lineHeight: 1.6 }}>
                      {tp.physicalLocation.actionRequired}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: ALL HITS BREAKDOWN
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "hits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Hit Filter Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6B635B", textTransform: "uppercase" }}>फ़िल्टर:</span>
            {[
              { label: `सभी हिट्स (${allHits.length})`, val: "all" },
              { label: `180° किलर (${killerHits180.length})`, val: 180 },
              { label: `90° घातक (${dangerousHits90.length})`, val: 90 },
              { label: `45° खराब (${badHits45.length})`, val: 45 },
              { label: `60° सहायक (${supportiveHits60.length})`, val: 60 },
              { label: `120° रक्षक (${protectiveShields120.length})`, val: 120 },
            ].map((btn) => (
              <button
                key={String(btn.val)}
                onClick={() => setHitFilter(btn.val as any)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: hitFilter === btn.val ? "1px solid #B8860B" : "1px solid rgba(184, 134, 11, 0.2)",
                  background: hitFilter === btn.val ? "#B8860B" : "#FFFFFF",
                  color: hitFilter === btn.val ? "#FAF7F2" : "#6B635B",
                  transition: "all 0.15s ease",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Hits List */}
          {filteredHits.length === 0 ? (
            <div className="card" style={{ padding: 24, textAlign: "center", color: "#6B635B" }}>
              इस श्रेणी में कोई सक्रिय हिट नहीं पाई गई।
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredHits.map((hit, idx) => {
                const badge = getSeverityBadge(hit.hitDef.severity);
                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      borderLeft: `4px solid ${badge.text}`,
                      background: "#FFFFFF",
                      padding: 16,
                      borderRadius: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 14,
                            background: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {badge.label}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                          {hit.sourceName} (H{hit.sourceHouse} · {hit.sourceSign} · {hit.sourceDirection}) ➔{" "}
                          {hit.targetName} ({hit.targetSign} · {hit.targetDirection})
                        </span>
                      </div>

                      <div style={{ fontSize: 12, color: "#6B635B", background: "#F5EFE3", padding: "3px 8px", borderRadius: 8 }}>
                        कोण अंतर: <strong>{hit.exactDiff.toFixed(2)}°</strong> (Orb: {hit.orbDistance.toFixed(2)}° / ±{hit.hitDef.orb}°)
                      </div>
                    </div>

                    <div style={{ marginTop: 8, fontSize: 13, color: "#4A4238", lineHeight: 1.6 }}>
                      {hit.effectSummary}
                    </div>

                    {hit.isUntenantedAlert && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#B45309", fontWeight: 600 }}>
                        ✦ रिक्त भाव सतर्कता: यह भाव खाली है, इसलिए यह हिट सीधे इस भाव के संबंधित पारिवारिक सदस्यों व जीवन क्षेत्र पर आ रही है।
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: 120° SHIFTING TECHNIQUES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "shifting" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, #FDFBF7, #FAF5EB)" }}>
            <span className="card-tag">Astro-Vastu Shifting Formula</span>
            <h3 className="card-title" style={{ margin: "4px 0 8px 0" }}>
              180° किलर हिट को 120° रक्षक ढाल में बदलना (Protective 120° Shifting)
            </h3>
            <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.65, margin: 0 }}>
              एस्ट्रो-वास्तु का मूल सूत्र: <em>&quot;जब कोई ग्रह किसी भाव या लग्न को 180° से मार रहा हो, तो उसे मिटाने की बजाय 120° त्रिकोण स्थान पर शिफ्ट कर दें। जो ग्रह मार रहा था, वही सबसे बड़ा रक्षक और भाग्यवर्धक बन जाता है।&quot;</em>
            </p>
          </div>

          {/* 💡 Family Cross-Hit Protection Principle */}
          {familyCrossHitIsolationRule && (
            <div
              className="card"
              style={{
                borderLeft: "5px solid #D97706",
                background: "#FFFBEB",
                padding: 18,
                borderRadius: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E", textTransform: "uppercase" }}>
                  {familyCrossHitIsolationRule.title}
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#78350F", margin: "4px 0 8px 0", lineHeight: 1.6 }}>
                {familyCrossHitIsolationRule.rule}
              </p>
              <div style={{ fontSize: 12.5, color: "#B45309", background: "rgba(217, 119, 6, 0.1)", padding: "8px 12px", borderRadius: 8, lineHeight: 1.6 }}>
                ✦ <strong>व्यावहारिक सूत्र:</strong> {familyCrossHitIsolationRule.practicalAdvice}
              </div>
            </div>
          )}

          {shiftingPrescriptions.length === 0 ? (
            <div className="card" style={{ padding: 24, textAlign: "center", color: "#6B635B" }}>
              वर्तमान में कोई गंभीर 180° किलर हिट नहीं है जिसे शिफ्ट करने की आवश्यकता हो।
            </div>
          ) : (
            shiftingPrescriptions.map((sp, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  borderLeft: "5px solid #16a34a",
                  background: "#FFFFFF",
                  padding: 22,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <span className="badge badge-green" style={{ fontWeight: 700, marginBottom: 4 }}>
                      🛡️ 120° रक्षक सुरक्षा उपाय
                    </span>
                    <h3 style={{ margin: "4px 0", fontSize: 18, color: "#1A1A1A", fontWeight: 700 }}>
                      पीडित क्षेत्र: <span style={{ color: "#DC2626" }}>{sp.afflictedTarget}</span> ➔ शिफ्टिंग ग्रह:{" "}
                      <span style={{ color: "#2563EB" }}>{sp.problematicPlanet}</span>
                    </h3>
                    <div style={{ fontSize: 13, color: "#6B635B" }}>
                      वर्तमान आघात: <strong>{sp.currentHit}</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(22, 163, 74, 0.1)",
                      border: "1px solid rgba(22, 163, 74, 0.3)",
                      borderRadius: 10,
                      padding: "8px 14px",
                      textAlign: "right",
                    }}
                  >
                    <div style={{ fontSize: 11, color: "#15803d", fontWeight: 700, textTransform: "uppercase" }}>
                      लक्ष्य 120° रक्षक दिशा
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                      {sp.targetDirection} ({sp.targetDirectionHindi})
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14, fontSize: 13.5, color: "#1A1A1A", lineHeight: 1.6 }}>
                  <strong>शिफ्टिंग विधि:</strong> {sp.shiftingMethod}
                </div>

                <div className="grid-2" style={{ marginTop: 14 }}>
                  <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(34, 197, 94, 0.25)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d", textTransform: "uppercase", marginBottom: 6 }}>
                      ✅ 120° दिशा ({sp.targetDirection}) में स्थापित करें
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {sp.itemsToPlace.map((item, i) => (
                        <li key={i} style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", marginBottom: 6 }}>
                      ❌ पीड़ित जोन से तुरंत हटाएं
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {sp.itemsToRemoveFromCurrentZone.map((item, i) => (
                        <li key={i} style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Secret 1 Integration Callout */}
          <div
            className="card"
            style={{
              background: "rgba(217, 119, 6, 0.08)",
              borderLeft: "5px solid #D97706",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>
              💡 एस्ट्रो-वास्तु का अनिवार्य गुप्त सूत्र 1: Family Cross-Hit Protection (पारिवारिक क्रॉस-हिट निवारण)
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>
              {familyCrossHitIsolationRule.rule}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: BODY-PART DOT & THREAD THERAPY
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "bodyTherapy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, #FDFBF7, #FAF5EB)", border: "1px solid rgba(184, 134, 11, 0.25)" }}>
            <span className="card-tag" style={{ color: "#854D0E" }}>Somatic Astro-Vastu Bio-Magnetic Protocol</span>
            <h3 className="card-title" style={{ margin: "4px 0 8px 0", color: "#1A1A1A" }}>
              🧘 12 राशि मानव शरीर अंग एवं डॉट / धागा चिकित्सा (Body-Part Dot Therapy)
            </h3>
            <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.65, margin: 0 }}>
              कालपुरुष सिद्धांत के अनुसार, 12 राशियां सीधे हमारे शरीर के 12 प्रमुख अंगों को नियंत्रित करती हैं। जब किराए के मकान या फ्लैट में तुरंत सामान शिफ्ट करना संभव न हो, तो शरीर के संबंधित अंग पर विशेष प्राकृतिक द्रव्य (शुद्ध कुमकुम, केसर, सफेद चंदन, देशी घी, काजल) की बिंदी (Dot) या धागा बांधकर आंतरिक विद्युत-चुंबकीय प्रवाह को तत्काल सुरक्षा कवच में बदला जाता है।
            </p>
          </div>

          {/* 1. Kundali-Specific Active Prescriptions for Blockers / Hits */}
          {shiftingPrescriptions.filter((sp) => sp.bodyPartTherapy).length > 0 && (
            <div
              className="card"
              style={{
                borderLeft: "5px solid #2563EB",
                background: "#FFFFFF",
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div>
                  <span className="badge badge-blue" style={{ fontSize: 12 }}>
                    ✦ आपकी कुंडली अनुसार विशेष शरीर अंग उपचार
                  </span>
                  <h4 style={{ margin: "4px 0 0 0", fontSize: 17, color: "#1A1A1A", fontWeight: 700 }}>
                    सक्रिय दशा व आघातों के लिए देह-वास्तु निर्देश ({shiftingPrescriptions.filter((sp) => sp.bodyPartTherapy).length} ग्रह सक्रिय)
                  </h4>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {shiftingPrescriptions
                  .filter((sp) => sp.bodyPartTherapy)
                  .map((sp, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#FAF8F5",
                        borderRadius: 12,
                        padding: "14px 16px",
                        border: "1px solid rgba(37, 99, 235, 0.2)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              background: "#2563EB",
                              color: "#FFFFFF",
                              padding: "2px 8px",
                              borderRadius: 6,
                            }}
                          >
                            🪐 {sp.problematicPlanet}
                          </span>
                          <strong style={{ fontSize: 14.5, color: "#1A1A1A" }}>
                            उपचार अंग: {sp.bodyPartTherapy.targetBodyPart}
                          </strong>
                        </div>
                        <span style={{ fontSize: 12, color: "#4B5563" }}>
                          आघात: <strong>{sp.currentHit}</strong> (लक्ष्य: {sp.afflictedTarget})
                        </span>
                      </div>

                      <div style={{ marginTop: 8, fontSize: 13.5, color: "#1F2937", lineHeight: 1.6 }}>
                        <strong>सटीक विधि:</strong> {sp.bodyPartTherapy.instructions}
                      </div>

                      <div style={{ marginTop: 6, fontSize: 12, color: "#166534" }}>
                        🛡️ <strong>120° त्रिकोण दिशा:</strong> {sp.targetDirection} ({sp.targetDirectionHindi})
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 2. Three Core Axioms Cards */}
          <div className="grid-3" style={{ gap: 12 }}>
            <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>
                1. नाभि व 4th हाउस शांति
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                नाभि के 2 इंच का क्षेत्र (कन्या/सूर्य/बुध)
              </div>
              <p style={{ margin: "6px 0 0 0", fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                चतुर्थ भाव या बुध पर दबाव होने पर नाभि के 2 इंच के घेरे में प्रतिदिन सुबह <strong>2 बूंद शुद्ध गाय का देशी घी</strong> या सफेद चंदन लगाएं। यह घर की कलह व अनिद्रा को तुरंत शांत करता है।
              </p>
            </div>

            <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(220, 38, 38, 0.25)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>
                2. घुटना डॉट चिकित्सा (Knee Dot)
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                पुरुष दायां घुटना / स्त्री बायां घुटना (मकर/शनि)
              </div>
              <p style={{ margin: "6px 0 0 0", fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                शनि की 180° किलर हिट होने पर घुटने पर <strong>काजल से एक सूक्ष्म काली बिंदी</strong> लगाएं। यह मारक ऊर्जा को सीधे 120° रक्षक कवच में रूपांतरित करता है।
              </p>
            </div>

            <div
              style={{
                background: wristThreadTrapAlert.isDusthana ? "rgba(220, 38, 38, 0.06)" : "#FAF8F5",
                borderRadius: 12,
                padding: 14,
                border: wristThreadTrapAlert.isDusthana ? "1px solid #DC2626" : "1px solid rgba(184, 134, 11, 0.25)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: wristThreadTrapAlert.isDusthana ? "#DC2626" : "#B8860B", textTransform: "uppercase" }}>
                3. कलाई में धागा बांधने का चक्रव्यूह
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                {wristThreadTrapAlert.alertTitle}
              </div>
              <p style={{ margin: "6px 0 0 0", fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                {wristThreadTrapAlert.explanation}
              </p>
            </div>
          </div>

          {/* 3. Comprehensive 12-Sign Prescriptive Matrix Table (100% Dynamic & Chart-Driven) */}
          <div className="card" style={{ padding: 20 }}>
            {renderDynamicBodyTherapyTable()}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 6: PERSONAL VS GENERIC VASTU CONFLICTS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "conflicts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, #FEF2F2, #FFF7ED)" }}>
            <span className="card-tag" style={{ color: "#DC2626" }}>
              Critical Astro-Vastu Rule Alert
            </span>
            <h3 className="card-title" style={{ margin: "4px 0 8px 0", color: "#991B1B" }}>
              🛑 जेनेरिक महावास्तु विरुद्ध व्यक्तिगत कुंडली का टकराव
            </h3>
            <p style={{ fontSize: 13.5, color: "#7F1D1D", lineHeight: 1.65, margin: 0 }}>
              व्यावसायिक जेनेरिक वास्तु में कुछ दिशाओं (जैसे SSW / WNW) को केवल &quot;डिस्पोज़ल / टॉयलेट&quot; बता दिया जाता है। लेकिन यदि जातक की कुंडली में वही राशि लग्न (शरीर/स्वास्थ्य) या दशम भाव (आजीविका/करियर) बन रही हो, तो वहां टॉयलेट बनाने से जातक का जीवन और करियर बह (Disposal) जाता है!
            </p>
          </div>

          {genericVastuConflicts.length === 0 ? (
            <div
              className="card"
              style={{
                borderLeft: "6px solid #16a34a",
                background: "rgba(22, 163, 74, 0.05)",
                padding: 22,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 17, color: "#15803d", fontWeight: 700 }}>
                ✅ कोई गंभीर जेनेरिक वास्तु टकराव नहीं है
              </h3>
              <p style={{ margin: "6px 0 0 0", fontSize: 13, color: "#4A4238" }}>
                आपकी कुंडली के प्रमुख संवेदनशील बिंदु (लग्न या दशमेश) जेनेरिक डिस्पोज़ल जोन से सुरक्षित हैं।
              </p>
            </div>
          ) : (
            genericVastuConflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  borderLeft: "6px solid #DC2626",
                  background: "#FFFFFF",
                  padding: 22,
                  boxShadow: "0 4px 16px rgba(220, 38, 38, 0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <span className="badge badge-red" style={{ fontWeight: 700, marginBottom: 4 }}>
                      ⚠️ {conflict.dangerLevel} खतरा (DO NOT USE TOILET HERE)
                    </span>
                    <h3 style={{ margin: "4px 0", fontSize: 19, color: "#1A1A1A", fontWeight: 700 }}>
                      दिशा: {conflict.zoneCode} ({conflict.zoneName})
                    </h3>
                  </div>
                </div>

                <div className="grid-2" style={{ marginTop: 14 }}>
                  <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(220, 38, 38, 0.2)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", marginBottom: 6 }}>
                      किताबी / जेनेरिक वास्तु नियम
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#4A4238", lineHeight: 1.6 }}>
                      {conflict.genericRule}
                    </p>
                  </div>

                  <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.2)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#B8860B", textTransform: "uppercase", marginBottom: 6 }}>
                      आपकी व्यक्तिगत कुंडली की वास्तविकता
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#4A4238", lineHeight: 1.6 }}>
                      {conflict.personalAstroVastuReality}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    background: "rgba(220, 38, 38, 0.06)",
                    border: "1px solid rgba(220, 38, 38, 0.3)",
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 13.5,
                    color: "#991B1B",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>अनिवार्य निर्देश (Remedial Solution):</strong> {conflict.recommendation}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 7: SPECIAL NUANCES (1, 2, 5, 6)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "lifestyle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, #FEFCE8, #FFFBEB)", border: "1px solid rgba(217, 119, 6, 0.3)" }}>
            <span className="card-tag" style={{ color: "#B45309" }}>
              Integrated Astro-Vastu Architectural Axioms
            </span>
            <h3 className="card-title" style={{ margin: "4px 0 8px 0", color: "#78350F" }}>
              🎯 एस्ट्रो-वास्तु के 4 विशेष गुप्त व्यावहारिक सूत्र (Secrets 1, 2, 5, 6 का संपूर्ण समन्वय)
            </h3>
            <p style={{ fontSize: 13.5, color: "#92400E", lineHeight: 1.65, margin: 0 }}>
              ये 4 सूत्र किताबी वास्तु में कहीं नहीं मिलते। यह कोई अलग परिशिष्ट नहीं हैं, बल्कि आपकी कुंडली के प्रत्येक अनुभाग में पूरी तरह से गहराई से एकीकृत (Deeply Integrated) हैं:
            </p>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
              <div style={{ background: "#FFFFFF", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(217, 119, 6, 0.2)", fontSize: 12, color: "#78350F" }}>
                <strong>सूत्र 1</strong> ➔ 120° शिफ्टिंग (पारिवारिक क्रॉस-हिट से सुरक्षा)
              </div>
              <div style={{ background: "#FFFFFF", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(220, 38, 38, 0.2)", fontSize: 12, color: "#991B1B" }}>
                <strong>सूत्र 2</strong> ➔ कलाई धागा ट्रैप (मिथुन 6/8/12 दुस्थान नियम)
              </div>
              <div style={{ background: "#FFFFFF", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(234, 88, 12, 0.2)", fontSize: 12, color: "#C2410C" }}>
                <strong>सूत्र 5</strong> ➔ मंगल उग्रता, मसूर दाल त्याग व नाभि उपचार
              </div>
              <div style={{ background: "#FFFFFF", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(37, 99, 235, 0.2)", fontSize: 12, color: "#1D4ED8" }}>
                <strong>सूत्र 6</strong> ➔ 4th, 9th, 10th भाव स्टडी व वर्क दिशा
              </div>
            </div>
          </div>

          {/* 1. पारिवारिक क्रॉस-हिट निवारण नियम */}
          <div
            className="card"
            style={{
              borderLeft: "6px solid #D97706",
              background: "#FFFFFF",
              padding: 22,
              boxShadow: "0 4px 16px rgba(217, 119, 6, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <span className="badge badge-gold" style={{ fontWeight: 700 }}>
                  सूत्र 1 · Family Cross-Hit Protection
                </span>
                <h3 style={{ margin: "6px 0", fontSize: 18, color: "#1A1A1A", fontWeight: 700 }}>
                  💡 {familyCrossHitIsolationRule.title}
                </h3>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.65, margin: "8px 0" }}>
              {familyCrossHitIsolationRule.rule}
            </p>
            <div
              style={{
                background: "rgba(217, 119, 6, 0.08)",
                border: "1px solid rgba(217, 119, 6, 0.25)",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: "#78350F",
                lineHeight: 1.6,
                marginTop: 10,
              }}
            >
              ✦ <strong>सटीक उपाय:</strong> {familyCrossHitIsolationRule.practicalAdvice}
            </div>
          </div>

          {/* 2. कलाई पर धागे का चक्रव्यूह */}
          <div
            className="card"
            style={{
              borderLeft: wristThreadTrapAlert.isDusthana ? "6px solid #DC2626" : "6px solid #16a34a",
              background: "#FFFFFF",
              padding: 22,
              boxShadow: wristThreadTrapAlert.isDusthana ? "0 4px 16px rgba(220, 38, 38, 0.08)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <span
                  className={wristThreadTrapAlert.isDusthana ? "badge badge-red" : "badge badge-green"}
                  style={{ fontWeight: 700 }}
                >
                  सूत्र 2 · Wrist Thread Trap (Gemini / Sign 3)
                </span>
                <h3 style={{ margin: "6px 0", fontSize: 18, color: "#1A1A1A", fontWeight: 700 }}>
                  {wristThreadTrapAlert.alertTitle}
                </h3>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.65, margin: "8px 0" }}>
              {wristThreadTrapAlert.explanation}
            </p>
            <div
              style={{
                background: wristThreadTrapAlert.isDusthana ? "rgba(220, 38, 38, 0.06)" : "rgba(22, 163, 74, 0.06)",
                border: wristThreadTrapAlert.isDusthana ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid rgba(22, 163, 74, 0.25)",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: wristThreadTrapAlert.isDusthana ? "#991B1B" : "#15803d",
                lineHeight: 1.6,
                marginTop: 10,
              }}
            >
              ✦ <strong>सख्त निर्देश:</strong> {wristThreadTrapAlert.correctiveAction}
            </div>
          </div>

          {/* 5. मंगल किलर हिट: खान-पान व जीवनशैली निषेध */}
          <div
            className="card"
            style={{
              borderLeft: marsDietaryLifestyleProtocol.isMarsAfflicted ? "6px solid #EA580C" : "6px solid #16a34a",
              background: "#FFFFFF",
              padding: 22,
              boxShadow: marsDietaryLifestyleProtocol.isMarsAfflicted ? "0 4px 16px rgba(234, 88, 12, 0.08)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <span
                  className={marsDietaryLifestyleProtocol.isMarsAfflicted ? "badge badge-red" : "badge badge-green"}
                  style={{ fontWeight: 700 }}
                >
                  सूत्र 5 · Mars Dietary & Lifestyle Protocol
                </span>
                <h3 style={{ margin: "6px 0", fontSize: 18, color: "#1A1A1A", fontWeight: 700 }}>
                  🌶️ मंगल आघात: खान-पान व जीवनशैली निषेध
                </h3>
              </div>
              {marsDietaryLifestyleProtocol.afflictionType && (
                <span style={{ fontSize: 12, color: "#EA580C", fontWeight: 700, background: "rgba(234, 88, 12, 0.1)", padding: "4px 8px", borderRadius: 8 }}>
                  {marsDietaryLifestyleProtocol.afflictionType}
                </span>
              )}
            </div>

            <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.65, margin: "8px 0" }}>
              {marsDietaryLifestyleProtocol.directiveText}
            </p>

            <div className="grid-2" style={{ marginTop: 14 }}>
              <div style={{ background: "#FEF2F2", borderRadius: 12, padding: 14, border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", marginBottom: 6 }}>
                  ❌ तत्काल वर्जित खान-पान व वस्तुएं
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {marsDietaryLifestyleProtocol.prohibitedDiet.concat(marsDietaryLifestyleProtocol.prohibitedItems).map((item, i) => (
                    <li key={i} style={{ fontSize: 12.5, color: "#7F1D1D", lineHeight: 1.6 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 14, border: "1px solid rgba(34, 197, 94, 0.25)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d", textTransform: "uppercase", marginBottom: 6 }}>
                  ✅ अनुशंसित सकारात्मक जीवनशैली
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {marsDietaryLifestyleProtocol.recommendedReplacements.map((item, i) => (
                    <li key={i} style={{ fontSize: 12.5, color: "#14532D", lineHeight: 1.6 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 6. पढ़ाई और ऑनलाइन कार्य की सही दिशा */}
          <div
            className="card"
            style={{
              borderLeft: "6px solid #2563EB",
              background: "#FFFFFF",
              padding: 22,
              boxShadow: "0 4px 16px rgba(37, 99, 235, 0.08)",
            }}
          >
            <div>
              <span className="badge badge-blue" style={{ fontWeight: 700 }}>
                सूत्र 6 · Personal Study & Online Work Direction
              </span>
              <h3 style={{ margin: "6px 0", fontSize: 18, color: "#1A1A1A", fontWeight: 700 }}>
                📚 व्यक्तिगत पढ़ाई व ऑनलाइन कार्य दिशा कैलकुलेटर
              </h3>
            </div>

            <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.65, margin: "8px 0" }}>
              {studyAndWorkDirection.rationale}
            </p>

            <div className="grid-3" style={{ marginTop: 14 }}>
              <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>
                  4था भाव · शिक्षा व मानसिक शांति
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  {studyAndWorkDirection.fourthHouseSign}
                </div>
                <div style={{ fontSize: 13, color: "#B8860B", fontWeight: 600, marginTop: 2 }}>
                  {studyAndWorkDirection.fourthHouseDirection} ({studyAndWorkDirection.fourthHouseHindi})
                </div>
              </div>

              <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(184, 134, 11, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", textTransform: "uppercase" }}>
                  9वां भाव · उच्च ज्ञान व भाग्य
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  {studyAndWorkDirection.ninthHouseSign}
                </div>
                <div style={{ fontSize: 13, color: "#B8860B", fontWeight: 600, marginTop: 2 }}>
                  {studyAndWorkDirection.ninthHouseDirection} ({studyAndWorkDirection.ninthHouseHindi})
                </div>
              </div>

              <div style={{ background: "#FAF8F5", borderRadius: 12, padding: 14, border: "1px solid rgba(37, 99, 235, 0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", textTransform: "uppercase" }}>
                  10वां भाव · करियर व ऑनलाइन बिज़नेस
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                  {studyAndWorkDirection.tenthHouseSign}
                </div>
                <div style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, marginTop: 2 }}>
                  {studyAndWorkDirection.tenthHouseDirection} ({studyAndWorkDirection.tenthHouseHindi})
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                background: "rgba(37, 99, 235, 0.06)",
                border: "1px solid rgba(37, 99, 235, 0.25)",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: "#1E40AF",
                lineHeight: 1.6,
              }}
            >
              ✦ <strong>अध्ययन की सर्वोत्तम दिशा:</strong> {studyAndWorkDirection.recommendedStudyZone} ({studyAndWorkDirection.recommendedStudyZoneHindi}) में बैठकर पूर्व या उत्तर मुख करें।<br/>
              ✦ <strong>ऑनलाइन कार्य/लैपटॉप टेबल:</strong> {studyAndWorkDirection.recommendedOnlineWorkZone} ({studyAndWorkDirection.recommendedOnlineWorkZoneHindi}) क्षेत्र में बैठना सर्वाधिक लाभकारी है।
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 8: BIO-MAGNETIC WEARABLE, GEMSTONE & THREAD AUDITOR
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "wearableAudit" && (
        <BioWearableAuditView chart={resolvedChart} />
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 9: 45 DEVATAS & 32 ENTRANCE MANDALA (शक्ति चक्र व 32 द्वार)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "mandala" && mandalaDossier && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── BANNER ── */}
          <div
            className="vastu-mandala-banner"
            style={{
              padding: 24,
              background: "linear-gradient(135deg, #1C1917 0%, #171412 100%)",
              color: "#FFFFFF",
              border: "2px solid rgba(212, 175, 55, 0.65)",
              borderRadius: 18,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: "#78350F",
                    background: "#FEF08A",
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: "1.5px solid #F59E0B",
                  }}
                >
                  Authentic Brihat Samhita & Shilpa Shastra Engine
                </span>
                <div
                  role="heading"
                  aria-level={2}
                  className="vastu-banner-title"
                  style={{
                    margin: "10px 0 6px 0",
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    WebkitTextFillColor: "#FFFFFF",
                    textShadow: "0 2px 6px rgba(0,0,0,0.8)",
                  }}
                >
                  🏛️ 45 देवता वास्तु पुरुष मंडल एवं 32 मुख्य प्रवेश द्वार
                </div>
                <div style={{ fontSize: 14, color: "#F5F5F4", lineHeight: 1.6, fontWeight: 500 }}>
                  33 कोटि (प्रकार) के देवगण + 12 असुर शक्तियां · ब्रह्मस्थान (नाभि) से संपूर्ण ऊर्जा का संचार · जन्मकुंडली भाव संरेखण
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#78350F", border: "1.5px solid #D97706", color: "#FEF3C7", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                  45 कुल शक्तियां (33 देव + 12 असुर)
                </span>
                <span style={{ background: "#14532D", border: "1.5px solid #16A34A", color: "#DCFCE7", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                  32 मुख्य प्रवेश द्वार
                </span>
                <span style={{ background: "#1E3A8A", border: "1.5px solid #2563EB", color: "#DBEAFE", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                  लग्न: {lagnaSignHindi} ({lagnaSign})
                </span>
              </div>
            </div>
          </div>

          {/* ── CRITICAL WARNINGS & OCCULT DIAGNOSTICS ROW ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            {/* 1. NE Toilet Warning */}
            <div
              className="card"
              style={{
                borderLeft: "6px solid #DC2626",
                background: "#FEF2F2",
                padding: 18,
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>🚨</span>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#991B1B" }}>
                  ईशान कोण (NE) टॉयलेट आपातकालीन निर्देश
                </h4>
              </div>
              <div style={{ fontSize: 12.5, color: "#7F1D1D", lineHeight: 1.55 }}>
                {mandalaDossier.toiletNeEmergencyProtocol.strictWarning}
              </div>
              <div style={{ marginTop: 10, background: "#FFFFFF", padding: "8px 12px", borderRadius: 8, border: "1px solid #FECACA", fontSize: 12, color: "#991B1B" }}>
                <strong>शास्त्रीय उपचार:</strong> टॉयलेट सीट के चारों ओर 3-इंच हरे रंग का पेंट (Green Paint) या 3-इंच ग्रीन टेप लगाएं + भीतर 0-वाट का हरा बल्ब 24 घंटे जलाएं।
              </div>
            </div>

            {/* 2. Occult & Negative Energy Kundli Diagnostic */}
            <div
              className="card"
              style={{
                borderLeft: `6px solid ${mandalaDossier.occultDiagnostic.isAfflicted ? "#DC2626" : "#16A34A"}`,
                background: mandalaDossier.occultDiagnostic.isAfflicted ? "#FFF7ED" : "#F0FDF4",
                padding: 18,
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{mandalaDossier.occultDiagnostic.isAfflicted ? "🔮" : "🛡️"}</span>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: mandalaDossier.occultDiagnostic.isAfflicted ? "#9A3412" : "#166534" }}>
                  {mandalaDossier.occultDiagnostic.diagnosticTitle}
                </h4>
              </div>
              <div style={{ fontSize: 12.5, color: mandalaDossier.occultDiagnostic.isAfflicted ? "#7C2D12" : "#14532D", lineHeight: 1.55 }}>
                {mandalaDossier.occultDiagnostic.diagnosticExplanation}
              </div>
              <div style={{ marginTop: 10, background: "#FFFFFF", padding: "8px 12px", borderRadius: 8, border: `1px solid ${mandalaDossier.occultDiagnostic.isAfflicted ? "#FED7AA" : "#BBF7D0"}`, fontSize: 12, color: mandalaDossier.occultDiagnostic.isAfflicted ? "#9A3412" : "#166534" }}>
                <strong>उपाय:</strong> {mandalaDossier.occultDiagnostic.shastricRemedyGuidance}
              </div>
            </div>
          </div>

          {/* ── SECTION: INTERACTIVE 32-GATE KUNDLI GATEKEEPER ── */}
          <div className="card" style={{ padding: 22, background: "#FFFFFF", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
                  🚪 32 मुख्य प्रवेश द्वार परीक्षक (Personalized Kundli Gatekeeper)
                </h3>
                <div style={{ fontSize: 13, color: "#666" }}>
                  अपनी दिशा चुनें और प्रवेश द्वार के पैड (Pad) पर क्लिक करके देखें कि यह आपकी जन्मकुंडली के अनुसार अमृत है या त्रिक दोष:
                </div>
              </div>

              {/* Quadrant Selector */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(["East", "South", "West", "North"] as const).map((q) => {
                  const icons: Record<string, string> = { East: "🌅 पूर्व", South: "🔥 दक्षिण", West: "🌪️ पश्चिम", North: "🌊 उत्तर" };
                  const isAct = activeQuadrant === q;
                  return (
                    <button
                      key={q}
                      onClick={() => setActiveQuadrant(q)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        border: isAct ? "1px solid #B45309" : "1px solid #D6D3D1",
                        background: isAct ? "#FEF3C7" : "#F5F5F4",
                        color: isAct ? "#92400E" : "#44403C",
                        cursor: "pointer",
                      }}
                    >
                      {icons[q]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8 Pads Grid for Active Quadrant */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 18 }}>
              {mandalaDossier.nativeMappings
                .filter((m) => m.devata.layer === "OuterPerimeter" && m.devata.cardinalCompassDirection === activeQuadrant)
                .map((m) => {
                  const isSel = selectedPadCode === m.devata.padCode;
                  const isDusthana = m.isDusthanaBlocked;
                  const isSup = m.devata.auspiciousness === "Supreme";
                  const isDes = m.devata.auspiciousness === "Destructive";
                  const isCau = m.devata.auspiciousness === "Caution" || m.devata.auspiciousness === "Inauspicious";

                  let borderColor = isSel ? "#B45309" : "#E7E5E4";
                  let bg = isSel ? "#FFFBEB" : "#FAFAF9";
                  let badgeCol = isDusthana ? "#DC2626" : isSup ? "#16A34A" : isDes ? "#DC2626" : isCau ? "#D97706" : "#2563EB";

                  return (
                    <div
                      key={m.devata.id}
                      onClick={() => setSelectedPadCode(m.devata.padCode || "E3")}
                      style={{
                        border: `2px solid ${borderColor}`,
                        background: bg,
                        borderRadius: 10,
                        padding: "10px 8px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxShadow: isSel ? "0 4px 12px rgba(180, 83, 9, 0.15)" : "none",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: badgeCol }}>
                        {m.devata.padCode}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", margin: "2px 0" }}>
                        {m.devata.nameHi.split(" ")[0]}
                      </div>
                      <div style={{ fontSize: 10.5, color: isDusthana ? "#DC2626" : "#78716C", fontWeight: isDusthana ? 700 : 500 }}>
                        {isDusthana ? `🚨 भाव ${m.nativeHouseNum}` : `भाव ${m.nativeHouseNum}`}
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 9.5,
                          padding: "2px 4px",
                          borderRadius: 4,
                          background: isDusthana ? "rgba(220, 38, 38, 0.12)" : isSup ? "rgba(22, 163, 74, 0.12)" : "rgba(120, 113, 108, 0.12)",
                          color: isDusthana ? "#DC2626" : isSup ? "#15803D" : "#57534E",
                          fontWeight: 600,
                        }}
                      >
                        {isDusthana ? "वर्जित" : m.devata.auspiciousness}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Selected Pad Inspector Card */}
            {(() => {
              const sel = mandalaDossier.nativeMappings.find((m) => m.devata.padCode === selectedPadCode);
              if (!sel) return null;
              const d = sel.devata;
              const isDusthana = sel.isDusthanaBlocked;

              return (
                <div
                  style={{
                    background: isDusthana ? "#FEF2F2" : "#F8FAFC",
                    border: `1.5px solid ${isDusthana ? "#FECACA" : "#CBD5E1"}`,
                    borderRadius: 12,
                    padding: 18,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: isDusthana ? "#DC2626" : "#0F172A" }}>
                          [{d.padCode}] {d.nameHi}
                        </span>
                        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: isDusthana ? "#DC2626" : "#16A34A", color: "#FFFFFF", fontWeight: 700 }}>
                          {sel.shastricVerdictBadge}
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
                        दिशा: {d.directionHindi} · तत्व: {d.element} ({d.elementColor}) · धातु: {d.zoneMetal}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0369A1", background: "#E0F2FE", padding: "4px 10px", borderRadius: 8 }}>
                        कुंडली संरेखण: भाव {sel.nativeHouseNum}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 13.5, color: isDusthana ? "#991B1B" : "#1E293B", lineHeight: 1.6, marginBottom: 12, background: "#FFFFFF", padding: "10px 14px", borderRadius: 8, border: `1px solid ${isDusthana ? "#FCA5A5" : "#E2E8F0"}` }}>
                    <strong>शास्त्रीय निर्णय:</strong> {sel.verdictExplanation}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, fontSize: 12.5 }}>
                    <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                      <strong style={{ color: "#0F172A" }}>प्रत्यक्ष जीवन लक्षण (Symptoms):</strong>
                      <div style={{ color: "#475569", marginTop: 3 }}>{d.realLifeSymptom}</div>
                    </div>
                    <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                      <strong style={{ color: "#0F172A" }}>गुप्त शास्त्रीय सूत्र (Secret Axiom):</strong>
                      <div style={{ color: "#475569", marginTop: 3 }}>{d.secretShastricAxiom || "सामान्य स्वच्छता व संतुलन रखें।"}</div>
                    </div>
                    {d.sacredFoodOffering && (
                      <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                        <strong style={{ color: "#B45309" }}>देवता नैवेद्य / भोग (Bhog Offering):</strong>
                        <div style={{ color: "#92400E", marginTop: 3 }}>
                          🍲 {d.sacredFoodOffering} ({d.foodDurationGuide || "10-15 दिन रखें"})
                        </div>
                      </div>
                    )}
                    <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                      <strong style={{ color: "#15803D" }}>सक्रियकरण / ब्लॉक विधि:</strong>
                      <div style={{ color: "#334155", marginTop: 3 }}>
                        ✦ <strong>खोलने हेतु:</strong> {d.activationMethod}<br/>
                        ✦ <strong>बंद करने हेतु:</strong> {d.blockingMethod}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ── SECTION: BRAHMASTHAN & 4 CARDINAL FACES OF BRAHMA ── */}
          <div className="card" style={{ padding: 22, background: "#FFFFFF", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>☸️</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
                  ब्रह्मस्थान (नाभि) एवं ब्रह्मा जी के 4 मुख (4 फीट बाउंड्री पर सक्रिय)
                </h3>
                <div style={{ fontSize: 12.5, color: "#666" }}>
                  भवन का प्राण-केंद्र जहां से समस्त 45 देवताओं को ऊर्जा वितरित होती है (G.O.D. - Generator ब्रह्मा)
                </div>
              </div>
            </div>

            {/* Brahmasthan Consecration Recipe Card */}
            <div style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "1px solid #FCD34D", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: "#92400E", fontSize: 14, marginBottom: 4 }}>
                🥛 ब्रह्मस्थान अभिमंत्रित नैवेद्य (Consecration Formula):
              </div>
              <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>
                <strong>सामग्री:</strong> {mandalaDossier.brahmasthanProtocol.consecrationMixture.join(" + ")}<br/>
                ✦ <strong>नए निर्माण में:</strong> केंद्र की खुदाई करके लोटे में भरकर यह मिश्रण अर्पित करें।<br/>
                ✦ <strong>बने हुए मकान/फ्लैट में:</strong> प्रातः सफाई के बाद इसका छिड़काव करें। रात्रि में पात्र में रखकर सुबह पौधों में विसर्जित करें (टॉयलेट में कभी नहीं)।<br/>
                ✦ <strong>स्वास्थ्य संबंध:</strong> {mandalaDossier.brahmasthanProtocol.liverHealthConnection}
              </div>
            </div>

            {/* 4 Cardinal Faces Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {mandalaDossier.nativeMappings
                .filter((m) => m.devata.layer === "CardinalFaces")
                .map((m) => {
                  const d = m.devata;
                  return (
                    <div
                      key={d.id}
                      style={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 10,
                        padding: 12,
                        background: "#F9FAFB",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                          {d.nameHi}
                        </span>
                        <span style={{ fontSize: 11, background: "#E0E7FF", color: "#3730A3", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                          भाव {m.nativeHouseNum}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 6 }}>
                        {d.classicalSignificance}
                      </div>
                      <div style={{ fontSize: 12, background: "#FFFFFF", padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E7EB", color: "#B45309", fontWeight: 600 }}>
                        🍲 भोग: {d.sacredFoodOffering}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ── SECTION: 8 DIAGONAL CORNER DEITIES (8 फीट बाउंड्री पर सक्रिय) ── */}
          <div className="card" style={{ padding: 22, background: "#FFFFFF", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>📐</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
                  चारों कोनों के 8 देवता (8 फीट बाउंड्री वॉल पर सक्रिय)
                </h3>
                <div style={{ fontSize: 12.5, color: "#666" }}>
                  ईशान (NE), आग्नेय (SE), नैऋत्य (SW), एवं वायव्य (NW) संधि देवता
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {mandalaDossier.nativeMappings
                .filter((m) => m.devata.layer === "DiagonalCorners")
                .map((m) => {
                  const d = m.devata;
                  const isRaj = d.id === "RAJAYAKSHMA";
                  return (
                    <div
                      key={d.id}
                      style={{
                        border: `1px solid ${isRaj ? "#FECACA" : "#E2E8F0"}`,
                        background: isRaj ? "#FEF2F2" : "#FFFFFF",
                        borderRadius: 10,
                        padding: 12,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: isRaj ? "#991B1B" : "#0F172A" }}>
                          {d.nameHi}
                        </span>
                        <span style={{ fontSize: 11, background: isRaj ? "#FEE2E2" : "#F1F5F9", color: isRaj ? "#991B1B" : "#475569", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                          {d.directionZone} · भाव {m.nativeHouseNum}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: isRaj ? "#7F1D1D" : "#475569", lineHeight: 1.5, marginBottom: 6 }}>
                        {d.classicalSignificance}
                      </div>
                      {d.secretShastricAxiom && (
                        <div style={{ fontSize: 11.5, color: "#0369A1", background: "#F0F9FF", padding: "4px 8px", borderRadius: 6, marginBottom: 4 }}>
                          💡 {d.secretShastricAxiom}
                        </div>
                      )}
                      {d.sacredFoodOffering && (
                        <div style={{ fontSize: 11.5, color: "#B45309", background: "#FFFBEB", padding: "4px 8px", borderRadius: 6 }}>
                          🍲 {d.sacredFoodOffering}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 10: BAR CHART 5-ELEMENTS BALANCER & SACRED BHOG (पंचतत्व संतुलन)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "barChart" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── BANNER ── */}
          <div
            className="vastu-barchart-banner"
            style={{
              padding: 24,
              background: "linear-gradient(135deg, #042F2E 0%, #064E3B 100%)",
              color: "#FFFFFF",
              border: "2px solid rgba(20, 184, 166, 0.65)",
              borderRadius: 18,
              boxShadow: "0 10px 30px rgba(4, 47, 46, 0.35)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#042F2E",
                background: "#CCFBF1",
                padding: "4px 12px",
                borderRadius: 20,
                border: "1.5px solid #0D9488",
              }}
            >
              Shilpa Shastra Bar-Chart Harmonizer
            </span>
            <div
              role="heading"
              aria-level={2}
              className="vastu-banner-title"
              style={{
                margin: "10px 0 6px 0",
                fontSize: 26,
                fontWeight: 800,
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              ⚖️ बार चार्ट पंचतत्व संतुलन एवं 45 देवता भोग प्रिस्क्रिप्शन
            </div>
            <div style={{ fontSize: 14, color: "#F0FDFA", lineHeight: 1.6, fontWeight: 500 }}>
              <strong style={{ color: "#FEF08A" }}>शास्त्रीय सूत्र:</strong> यदि ज़ोन कम है ➔ <em style={{ color: "#A7F3D0", fontWeight: 700 }}>"पीछे वाला आगे लाएं"</em> (Parent feeds Child) | यदि ज़ोन बढ़ा है ➔ <em style={{ color: "#A7F3D0", fontWeight: 700 }}>"आगे वाला पीछे लाएं"</em> (Child exhausts Parent)
            </div>
          </div>

          {/* ── 5-ELEMENTS BALANCING CONTROLLERS ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {dynamicBalancingGuides.map((guide) => {
              const code = guide.zoneCode;
              const cond = zoneConditions[code] || "Balanced";

              return (
                <div
                  key={code}
                  className="card"
                  style={{
                    padding: 18,
                    background: "#FFFFFF",
                    borderRadius: 12,
                    border: `1.5px solid ${cond === "Exhausted_Depleted" ? "#F59E0B" : cond === "Extended_Bloated" ? "#DC2626" : "#E2E8F0"}`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                        {guide.zoneNameHi}
                      </h4>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                        तत्व: {guide.element} · वर्तमान स्थिति: <strong>{cond === "Exhausted_Depleted" ? "कम / कटा हुआ (Cut)" : cond === "Extended_Bloated" ? "बढ़ा हुआ (Extended)" : "संतुलित (Balanced)"}</strong>
                      </div>
                    </div>

                    {/* Condition Segmented Switch */}
                    <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 8, padding: 3, gap: 4 }}>
                      {(["Exhausted_Depleted", "Balanced", "Extended_Bloated"] as const).map((c) => {
                        const labels: Record<string, string> = {
                          Exhausted_Depleted: "📉 कम (Cut)",
                          Balanced: "⚖️ संतुलित",
                          Extended_Bloated: "📈 बढ़ा (Extended)",
                        };
                        const isAct = cond === c;
                        return (
                          <button
                            key={c}
                            onClick={() => setZoneConditions((prev) => ({ ...prev, [code]: c }))}
                            style={{
                              padding: "5px 12px",
                              fontSize: 12,
                              fontWeight: isAct ? 700 : 500,
                              border: "none",
                              borderRadius: 6,
                              cursor: "pointer",
                              background: isAct
                                ? c === "Exhausted_Depleted"
                                  ? "#F59E0B"
                                  : c === "Extended_Bloated"
                                  ? "#DC2626"
                                  : "#10B981"
                                : "transparent",
                              color: isAct ? "#FFFFFF" : "#475569",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {labels[c]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shastric Formula & Explanation */}
                  <div style={{ background: cond === "Balanced" ? "#F8FAFC" : cond === "Exhausted_Depleted" ? "#FFFBEB" : "#FEF2F2", padding: "10px 14px", borderRadius: 8, border: `1px solid ${cond === "Balanced" ? "#E2E8F0" : cond === "Exhausted_Depleted" ? "#FDE68A" : "#FECACA"}`, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: cond === "Exhausted_Depleted" ? "#B45309" : cond === "Extended_Bloated" ? "#991B1B" : "#059669", marginBottom: 3 }}>
                      ✦ {guide.actionFormula}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.55 }}>
                      {guide.actionExplanation}
                    </div>
                  </div>

                  {/* Treatments & Prohibitions Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, fontSize: 12 }}>
                    {guide.recommendedTreatments.length > 0 && (
                      <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "8px 12px" }}>
                        <strong style={{ color: "#166534" }}>✅ अनुशंसित उपचार (Recommended):</strong>
                        <div style={{ color: "#15803D", marginTop: 3 }}>
                          {guide.recommendedTreatments.join(" · ")}
                        </div>
                      </div>
                    )}
                    {guide.prohibitedItems.length > 0 && (
                      <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px" }}>
                        <strong style={{ color: "#991B1B" }}>❌ सख्त वर्जित (Prohibited):</strong>
                        <div style={{ color: "#B91C1C", marginTop: 3 }}>
                          {guide.prohibitedItems.join(" · ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── MIRROR (दर्पण) ELEMENTAL AXIOM CARD ── */}
          <div className="card" style={{ padding: 20, background: "#FFFFFF", borderRadius: 14, borderLeft: "6px solid #0284C7", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>🪞</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0C4A6E" }}>
                दर्पण (Looking Mirror) का वैज्ञानिक पंचतत्व नियम
              </h3>
            </div>
            <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.65 }}>
              ✦ <strong>तत्व:</strong> दर्पण वास्तु में <strong>जल तत्व (चंद्रमा व बुध)</strong> का प्रतिनिधित्व करता है, राहु का नहीं।<br/>
              ✦ <strong>शुभ दिशाएं:</strong> उत्तर, उत्तर-पूर्व, पूर्व, और पश्चिम के कटे हुए ज़ोन को बढ़ाने हेतु दर्पण लगाया जा सकता है।<br/>
              ✦ <strong>सख्त वर्जित दिशाएं:</strong> दक्षिण (South), दक्षिण-पूर्व (South-East) और दक्षिण-पश्चिम (South-West)।<br/>
              ✦ <strong>साउथ-वेस्ट में दर्पण का दुष्परिणाम:</strong> {mandalaDossier.mirrorElementalAxiom.consequencesOfSouthMirror}<br/>
              ✦ <strong>यदि SW वैनिटी में शीशा हटाना असंभव हो:</strong> {mandalaDossier.mirrorElementalAxiom.correctionMethod}
            </div>
          </div>

          {/* ── SACRED FOOD OFFERINGS & SPRINGS DIRECTIVES CARD ── */}
          <div className="card" style={{ padding: 20, background: "#FFFFFF", borderRadius: 14, borderLeft: "6px solid #B45309", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>🍲</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#78350F" }}>
                देवता भोग (Food Offerings) एवं स्प्रिंग स्थापन के 6 अचूक नियम
              </h3>
            </div>
            <div style={{ fontSize: 13, color: "#451A03", lineHeight: 1.65 }}>
              1. <strong>धातु के पात्र का नियम:</strong> {mandalaDossier.subtleShastricDirectives.foodPlacementSubtleRules.utensilBoxRule}<br/>
              2. <strong>एंटी-कलर निषेध:</strong> {mandalaDossier.subtleShastricDirectives.foodPlacementSubtleRules.antiColorWarning}<br/>
              3. <strong>फ्लैट्स हेतु 'चुटकी भर' मात्रा:</strong> {mandalaDossier.subtleShastricDirectives.foodPlacementSubtleRules.pinchQuantityRule}<br/>
              4. <strong>सक्रियकरण अवधि:</strong> {mandalaDossier.subtleShastricDirectives.foodPlacementSubtleRules.activationDuration}<br/>
              5. <strong>3-इंच ड्रिलिंग स्थायी समाधान:</strong> {mandalaDossier.subtleShastricDirectives.foodPlacementSubtleRules.floorDrillingPermanentRule}<br/>
              6. <strong>पवित्र विसर्जन:</strong> {mandalaDossier.brahmasthanProtocol.overnightVesselDisposalRule}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

