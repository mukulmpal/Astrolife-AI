"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import { buildChart, type BirthDetails } from "@/lib/user-chart";
import {
  runAstroVastuHitEngine,
  ASTRO_VASTU_SIGN_DIRECTIONS,
  SIGN_BODY_PART_MAPPINGS,
  type AstroVastuHitDossier,
  type EvaluatedHit,
  type TrafficPoliceBlockade,
  type ShiftingPrescription,
  type GenericVastuConflict,
} from "@/lib/astro-engine/astro-vastu-hit-engine";

const DEMO_VASTU_FALLBACK: BirthDetails = {
  name: "Mukul Ji (Demo Chart)",
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
    "radar" | "trafficPolice" | "hits" | "shifting" | "bodyTherapy" | "conflicts" | "lifestyle"
  >("radar");
  const [hitFilter, setHitFilter] = useState<"all" | 180 | 90 | 45 | 120>("all");
  const [selectedDirectionCode, setSelectedDirectionCode] = useState<string>("N");
  const [targetDateStr, setTargetDateStr] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

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
    lagnaSignNum,
    lagnaCompoundDeg,
    activeDasha,
    trafficPoliceBlockades,
    killerHits180,
    dangerousHits90,
    badHits45,
    protectiveShields120,
    allHits,
    shiftingPrescriptions,
    genericVastuConflicts,
    directionPlanetaryInventory,
    familyCrossHitIsolationRule,
    studyAndWorkDirection,
    marsDietaryLifestyleProtocol,
    wristThreadTrapAlert,
  } = dossier;

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
      case "Shield":
        return { bg: "rgba(22, 163, 74, 0.15)", text: "#16a34a", border: "#4ade80", label: "🛡️ सुरक्षा ढाल (120°)" };
      default:
        return { bg: "rgba(107, 99, 91, 0.15)", text: "#6B635B", border: "#d6d3d1", label: severity };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Top Dossier Hero Banner ── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #1A1A1A 0%, #2A241E 50%, #1A1A1A 100%)",
          color: "#FAF7F2",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          borderRadius: 20,
          padding: "24px 28px",
          position: "relative",
          overflow: "hidden",
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#D4AF37",
                  background: "rgba(212, 175, 55, 0.12)",
                  padding: "4px 10px",
                  borderRadius: 20,
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                }}
              >
                Astro-Vastu Hit Radar · v1.0
              </span>
              <span style={{ fontSize: 13, color: "#A8A29E" }}>
                3-5-8 Orb Formula & Traffic Police Engine
              </span>
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, margin: 0, color: "#FAF7F2" }}>
              {nativeName ? `${nativeName} — ` : ""}एस्ट्रो-वास्तु हिट थ्योरी ऑडिट
            </h2>
            <div style={{ marginTop: 8, fontSize: 14, color: "#D6D3D1", lineHeight: 1.6 }}>
              लग्न: <strong style={{ color: "#FDE047" }}>{lagnaSign}</strong> ({lagnaCompoundDeg.toFixed(2)}° Compound) · 
              सक्रिय दशा: <strong style={{ color: "#60A5FA" }}>{activeDasha.mahadasha} MD</strong> / <strong style={{ color: "#38BDF8" }}>{activeDasha.antardasha} AD</strong>
            </div>
          </div>

          {/* Date Selector for Future Dasha Inspection */}
          <div style={{ background: "rgba(255,255,255,0.06)", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontSize: 11, color: "#D4AF37", fontWeight: 600, marginBottom: 4, letterSpacing: 0.5 }}>
              दशा तिथि सिमुलेशन (Dasha Date)
            </div>
            <input
              type="date"
              value={isMounted ? (targetDateStr || new Date().toISOString().split("T")[0]) : "2026-10-20"}
              onChange={(e) => setTargetDateStr(e.target.value)}
              style={{
                background: "#1A1A1A",
                color: "#FAF7F2",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              background: trafficPoliceBlockades.length > 0 ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.15)",
              border: `1px solid ${trafficPoliceBlockades.length > 0 ? "rgba(239, 68, 68, 0.4)" : "rgba(34, 197, 94, 0.3)"}`,
              borderRadius: 12,
              padding: "10px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#E7E5E4", letterSpacing: 1 }}>ट्रैफिक पुलिस</div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 22,
                fontWeight: 700,
                color: trafficPoliceBlockades.length > 0 ? "#F87171" : "#4ADE80",
                marginTop: 2,
              }}
            >
              {trafficPoliceBlockades.length > 0 ? `🚨 ${trafficPoliceBlockades.length} जाम` : "✅ क्लियर"}
            </div>
          </div>

          <div
            style={{
              background: killerHits180.length > 0 ? "rgba(220, 38, 38, 0.18)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(220, 38, 38, 0.35)",
              borderRadius: 12,
              padding: "10px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#E7E5E4", letterSpacing: 1 }}>180° किलर हिट्स</div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#F87171", marginTop: 2 }}>
              {killerHits180.length}
            </div>
          </div>

          <div
            style={{
              background: dangerousHits90.length > 0 ? "rgba(234, 88, 12, 0.18)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(234, 88, 12, 0.35)",
              borderRadius: 12,
              padding: "10px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#E7E5E4", letterSpacing: 1 }}>90° घातक हिट्स</div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#FB923C", marginTop: 2 }}>
              {dangerousHits90.length}
            </div>
          </div>

          <div
            style={{
              background: "rgba(22, 163, 74, 0.15)",
              border: "1px solid rgba(22, 163, 74, 0.35)",
              borderRadius: 12,
              padding: "10px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#E7E5E4", letterSpacing: 1 }}>120° रक्षक ढाल</div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#4ADE80", marginTop: 2 }}>
              {protectiveShields120.length}
            </div>
          </div>

          <div
            style={{
              background: genericVastuConflicts.length > 0 ? "rgba(239, 68, 68, 0.25)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${genericVastuConflicts.length > 0 ? "#DC2626" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 12,
              padding: "10px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#E7E5E4", letterSpacing: 1 }}>जेनेरिक वास्तु द्वंद्व</div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 22,
                fontWeight: 700,
                color: genericVastuConflicts.length > 0 ? "#EF4444" : "#A8A29E",
                marginTop: 2,
              }}
            >
              {genericVastuConflicts.length > 0 ? `🛑 ${genericVastuConflicts.length} अलर्ट` : "शून्य द्वंद्व"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="tabs" style={{ margin: "4px 0 12px 0" }}>
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
          🚨 ट्रैफिक पुलिस ब्लॉक ({trafficPoliceBlockades.length})
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
      </div>

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

                // Check if this direction has an active traffic police blockade source
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
          TAB 2: TRAFFIC POLICE BLOCKADES
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
                    ट्रैफिक पुलिस क्लियर: कोई ग्रह दशा स्वामी को नहीं रोक रहा
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#4A4238" }}>
                    वर्तमान दशा स्वामी ({activeDasha.mahadasha} / {activeDasha.antardasha}) पर किसी भी शत्रु या पापी ग्रह की 90° या 180° की हिट नहीं है। दशा के पूर्ण फल निर्बाध रूप से प्राप्त होंगे।
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
                        🚨 ट्रैफिक पुलिस लॉकअप: {tp.hitAngle}° {tp.hitSeverity} Hit
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
                      🛠️ ट्रैफिक पुलिस रिहाई उपाय (Remedial Action)
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

          {/* 💡 Family Cross-Hit Protection Principle from Lecture */}
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
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: BODY-PART DOT & THREAD THERAPY
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "bodyTherapy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, #FDFBF7, #FAF5EB)" }}>
            <span className="card-tag">Astro-Vastu Body-Part Mapping</span>
            <h3 className="card-title" style={{ margin: "4px 0 8px 0" }}>
              12 राशि मानव शरीर अंग एवं डॉट / धागा चिकित्सा (Body-Part Dot Therapy)
            </h3>
            <p style={{ fontSize: 13.5, color: "#4A4238", lineHeight: 1.65, margin: 0 }}>
              कालपुरुष के सिद्धांत अनुसार, 12 राशियां सीधे हमारे शरीर के 12 प्रमुख अंगों को नियंत्रित करती हैं। जब किसी ग्रह की हिट घर में स्थान परिवर्तन से ठीक न हो पाए या तुरंत राहत चाहिए हो, तो शरीर के संबंधित अंग पर विशेष रंग का डॉट या धागा बांधकर आंतरिक बायो-मैग्नेटिक फ्रीक्वेंसी को तत्काल संतुलित किया जाता है।
            </p>
          </div>

          {/* Active Prescriptions from Shifting */}
          {shiftingPrescriptions.some((sp) => sp.bodyPartTherapy) && (
            <div
              className="card"
              style={{
                borderLeft: "5px solid #2563EB",
                background: "#FAF8F5",
                padding: 18,
              }}
            >
              <div className="card-tag" style={{ color: "#2563EB" }}>
                कुंडली अनुसार विशेष शरीर अंग उपचार (Personalized Body Action)
              </div>
              {shiftingPrescriptions.map((sp, i) => (
                <div key={i} style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
                    अंग: {sp.bodyPartTherapy.targetBodyPart}
                  </div>
                  <div style={{ fontSize: 13, color: "#4A4238", marginTop: 4, lineHeight: 1.6 }}>
                    {sp.bodyPartTherapy.instructions}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 12 Sign Body Mapping Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {Object.entries(SIGN_BODY_PART_MAPPINGS).map(([sNumStr, map]) => {
              const sNum = Number(sNumStr);
              const isLagna = sNum === lagnaSignNum;

              return (
                <div
                  key={sNum}
                  className="card"
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    border: isLagna ? "2px solid #B8860B" : "1px solid rgba(184, 134, 11, 0.2)",
                    background: isLagna ? "rgba(184, 134, 11, 0.05)" : "#FFFFFF",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#B8860B" }}>
                      राशि {map.signNum} · {map.signName}
                    </span>
                    {isLagna && (
                      <span className="badge badge-gold" style={{ fontSize: 10 }}>
                        ✦ आपका लग्न
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>
                    {map.bodyPartHi} ({map.bodyPartEn})
                  </div>

                  <div style={{ fontSize: 12.5, color: "#6B635B", marginTop: 8, lineHeight: 1.5 }}>
                    <strong>चिकित्सा सूत्र:</strong> {map.therapyNotes}
                  </div>
                </div>
              );
            })}
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
              Authentic Astro-Vastu Lecture Secrets (1, 2, 5, 6)
            </span>
            <h3 className="card-title" style={{ margin: "4px 0 8px 0", color: "#78350F" }}>
              🎯 एस्ट्रो-वास्तु के 4 विशेष गुप्त व्यावहारिक सूत्र
            </h3>
            <p style={{ fontSize: 13.5, color: "#92400E", lineHeight: 1.65, margin: 0 }}>
              ये 4 सूत्र किताबी वास्तु में कहीं नहीं मिलते। यह जातक की व्यक्तिगत कुंडली, पारिवारिक सुरक्षा, शारीरिक अंग सक्रियता, और जीवनशैली से सीधे जुड़े हैं।
            </p>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "gap 10" }}>
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
    </div>
  );
}

