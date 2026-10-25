"use client";

import { useState, useMemo } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  runGPSAstroVastuEngine,
  MASTER_GPS_CODES,
  type GPSAstroVastuDossier,
  type QueryHouseGPSAnalysis,
  type GPSPlanetaryCode,
} from "@/lib/astro-engine/gps-astro-vastu-engine";
import {
  MASTER_CLINICAL_PROBLEM_DIAGNOSTICS,
  TOILET_BLOCKING_MATRIX,
  resolveDominantZoneMetal,
  ENERGY_SPRING_DIRECTIVES,
  E1_ENTRANCE_NAZAR_DEFENSE,
  PLANET_TO_45_DEVATAS,
  type ClinicalProblemDiagnostic,
} from "@/lib/astro-engine/vastu-purusha-mandala-engine";
import {
  calculateQueryGPSAnalysis,
  MASTER_CORE_QUERIES,
  type CoreQueryCategory,
} from "@/lib/astro-engine/gps-query-engine";
import {
  getTrikaBhavaRemedyAnalysis,
  MASTER_6TH_HOUSE_PLANTS,
  MASTER_8TH_HOUSE_FRUITS,
  MASTER_12TH_HOUSE_VOLUNTARY_TITHES,
} from "@/lib/astro-engine/trika-remedies-engine";

interface GPSAstroVastuViewProps {
  chart: ChartData | any;
}

export function GPSAstroVastuView({ chart }: GPSAstroVastuViewProps) {
  const [activeNavigatorMode, setActiveNavigatorMode] = useState<"CORE_QUERIES" | "ALL_12_HOUSES">("CORE_QUERIES");
  const [selectedCoreQuery, setSelectedCoreQuery] = useState<CoreQueryCategory>("career_stagnation");
  const [selectedHouse, setSelectedHouse] = useState<number>(4);
  const [selectedHybridZones, setSelectedHybridZones] = useState<string[]>(["ESE", "SE"]);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "HEALTH" | "CAREER" | "FAMILY">("ALL");
  const [trikaMediumTab, setTrikaMediumTab] = useState<"plants_6" | "fruits_8" | "tithes_12">("plants_6");

  const gpsDossier = useMemo(() => {
    return runGPSAstroVastuEngine(chart);
  }, [chart]);

  const lagnaNum = gpsDossier?.lagnaSignNum || 1;

  const coreQueryResult = useMemo(() => {
    return calculateQueryGPSAnalysis(selectedCoreQuery, lagnaNum);
  }, [selectedCoreQuery, lagnaNum]);

  const trikaAnalysis = useMemo(() => {
    return getTrikaBhavaRemedyAnalysis();
  }, []);

  const activeQueryAnalysis = useMemo(() => {
    if (!gpsDossier) return null;
    return (
      gpsDossier.queryAnalyses?.[selectedHouse] ||
      gpsDossier.queryAnalyses?.[4] ||
      (gpsDossier.queryAnalyses ? Object.values(gpsDossier.queryAnalyses)[0] : null)
    );
  }, [gpsDossier, selectedHouse]);

  const hybridMetalResult = useMemo(() => {
    return resolveDominantZoneMetal(selectedHybridZones);
  }, [selectedHybridZones]);

  if (!gpsDossier) {
    return (
      <div
        style={{
          padding: 32,
          textAlign: "center",
          background: "#F8FAFC",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          color: "#64748B",
          fontSize: 14,
        }}
      >
        कुंडली डेटा लोड हो रहा है या अनुपलब्ध है। कृपया कुंडली विवरण जांचें।
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── 1. BANNER & PHILOSOPHY ────────────────────────────────── */}
      <div
        style={{
          padding: 24,
          background: "linear-gradient(135deg, #0C4A6E 0%, #0369A1 50%, #075985 100%)",
          color: "#FFFFFF",
          border: "2px solid rgba(56, 189, 248, 0.6)",
          borderRadius: 18,
          boxShadow: "0 10px 30px rgba(12, 74, 110, 0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <span
              style={{
                display: "inline-block",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "rgba(255, 255, 255, 0.2)",
                padding: "4px 12px",
                borderRadius: 20,
                marginBottom: 8,
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              🛰️ SHASTRIC GPS ASTRO-VASTU & CLINICAL DIAGNOSTICS
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "4px 0 8px 0" }}>
              जीपीएस एस्ट्रो-वास्तु, 9 ग्रह कोड्स एवं 4-सेकंड रिवर्स काउंटिंग
            </h2>
            <p style={{ fontSize: 13.5, color: "#E0F2FE", margin: 0, maxWidth: 820, lineHeight: 1.6 }}>
              {gpsDossier.nativeName} ({gpsDossier.lagnaSignHindi} लग्न, संकेत सं. {gpsDossier.lagnaSignNum}): किसी भी भाव के फल को गति देने के लिए 4-सेकंड पीछे रिवर्स काउंटिंग द्वारा ट्रिगर भाव को सक्रिय किया जाता है। साथ ही 45 देवताओं का 9 ग्रहों से संबंध एवं ₹0 लो-कॉस्ट शास्त्रीय उपचार।
            </p>
          </div>

          <div
            style={{
              padding: "10px 16px",
              background: "rgba(15, 23, 42, 0.45)",
              border: "1px solid rgba(56, 189, 248, 0.5)",
              borderRadius: 12,
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 11, color: "#7DD3FC", fontWeight: 700 }}>शास्त्रीय मूल्य सिद्धांत</div>
            <div style={{ fontSize: 14, color: "#38BDF8", fontWeight: 800 }}>{gpsDossier.shastricPricingPhilosophy.coreRule}</div>
            <div style={{ fontSize: 10.5, color: "#BAE6FD" }}>बिना तोड़-फोड़ एवं शून्य/अल्प लागत उपचार</div>
          </div>
        </div>
      </div>

      {/* ── 2. 4-SECOND REVERSE COUNTING INTERACTIVE TOOL ──────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
              ⏱️ 4-सेकंड रिवर्स काउंटिंग व 6 मुख्य जीवन प्रश्न टूल
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
              जिस भाव का फल चाहिए, उससे घड़ी की उल्टी दिशा (वामावर्त) 4 भाव पीछे चलकर ट्रिगर दिशा को सक्रिय करें।
            </p>
          </div>
        </div>

        {/* Navigator Mode Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, borderBottom: "1px solid #E2E8F0", paddingBottom: 12 }}>
          <button
            onClick={() => setActiveNavigatorMode("CORE_QUERIES")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: activeNavigatorMode === "CORE_QUERIES" ? "2px solid #0284C7" : "1px solid #CBD5E1",
              background: activeNavigatorMode === "CORE_QUERIES" ? "#0284C7" : "#F8FAFC",
              color: activeNavigatorMode === "CORE_QUERIES" ? "#FFFFFF" : "#334155",
              fontWeight: activeNavigatorMode === "CORE_QUERIES" ? 800 : 600,
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            🧭 6 मुख्य जीवन प्रश्न (Career, Health, Wealth, Peace)
          </button>
          <button
            onClick={() => setActiveNavigatorMode("ALL_12_HOUSES")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: activeNavigatorMode === "ALL_12_HOUSES" ? "2px solid #0284C7" : "1px solid #CBD5E1",
              background: activeNavigatorMode === "ALL_12_HOUSES" ? "#0284C7" : "#F8FAFC",
              color: activeNavigatorMode === "ALL_12_HOUSES" ? "#FFFFFF" : "#334155",
              fontWeight: activeNavigatorMode === "ALL_12_HOUSES" ? 800 : 600,
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            🔢 सभी 12 भावों का 4-सेकंड चक्र (Custom House 1-12)
          </button>
        </div>

        {/* ── MODE 1: CORE LIFE QUERIES ── */}
        {activeNavigatorMode === "CORE_QUERIES" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginBottom: 18 }}>
              {[
                { id: "career_stagnation" as CoreQueryCategory, label: "💼 कैरियर ठहराव (भाव 10)" },
                { id: "peeda_chronic" as CoreQueryCategory, label: "⚡ असाध्य पीड़ा/संकट (भाव 8)" },
                { id: "dhana_liquidity" as CoreQueryCategory, label: "💰 नकदी की कमी (भाव 2)" },
                { id: "roga_health" as CoreQueryCategory, label: "🩺 रोग व सर्वाइकल (भाव 6)" },
                { id: "sukh_domestic" as CoreQueryCategory, label: "🏡 घरेलू क्लेश (भाव 4)" },
                { id: "vyaya_drainage" as CoreQueryCategory, label: "💸 धन बर्बादी/व्यय (भाव 12)" },
              ].map((q) => {
                const isSel = selectedCoreQuery === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedCoreQuery(q.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: isSel ? "2px solid #0284C7" : "1px solid #CBD5E1",
                      background: isSel ? "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)" : "#F8FAFC",
                      color: isSel ? "#FFFFFF" : "#334155",
                      fontWeight: isSel ? 800 : 600,
                      fontSize: 12,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>

            {/* Core Query Card */}
            {coreQueryResult && (
              <div
                style={{
                  background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
                  border: "1.5px solid #7DD3FC",
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                  <div style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #BAE6FD" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0369A1" }}>🎯 अभीष्ट प्रश्न भाव (Query Target)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>
                      भाव {coreQueryResult.targetHouse}: {coreQueryResult.titleHi}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                      राशि: {coreQueryResult.houseSignName} | स्वामी: {coreQueryResult.houseLord} (GPS कोड: {coreQueryResult.gpsCode})
                    </div>
                  </div>

                  <div style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #BAE6FD" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309" }}>⚡ 4-सेकंड ट्रिगर भाव (वामावर्त 4 भाव पीछे)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#92400E", marginTop: 4 }}>
                      भाव {coreQueryResult.triggerHouse}: {coreQueryResult.triggerSignName} राशि
                    </div>
                    <div style={{ fontSize: 12, color: "#B45309", marginTop: 4 }}>
                      दिशा: {coreQueryResult.triggerDirectionHindi} ({coreQueryResult.triggerDirectionCode})
                    </div>
                  </div>

                  <div style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #BAE6FD" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#15803D" }}>🧭 मूल कारण ओरिजिन भाव (GPS Tracing)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#166534", marginTop: 4 }}>
                      भाव {coreQueryResult.originHouse}: {coreQueryResult.originSignName} राशि
                    </div>
                    <div style={{ fontSize: 12, color: "#15803D", marginTop: 4 }}>
                      दिशा: {coreQueryResult.originDirectionHindi} ({coreQueryResult.originDirectionCode})
                    </div>
                  </div>
                </div>

                {/* Mathematical Proof */}
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(2, 132, 199, 0.08)", borderRadius: 8, border: "1px dashed #0284C7", fontSize: 12, color: "#0369A1" }}>
                  <strong>गणितीय प्रमाण:</strong> {coreQueryResult.mathematicalProofHi}
                </div>

                <div style={{ marginTop: 16, background: "#FFFFFF", padding: 16, borderRadius: 12, border: "1px solid #BAE6FD" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#0369A1", marginBottom: 6 }}>
                    🩺 क्लीनिकल लक्षण व निदान:
                  </div>
                  <p style={{ fontSize: 13, color: "#334155", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                    {coreQueryResult.diagnosticSymptomHi}
                  </p>

                  {coreQueryResult.clutterItemsToInspectHi.length > 0 && (
                    <div style={{ marginBottom: 12, padding: 10, background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#B45309", marginBottom: 4 }}>
                        ⚠️ इस दिशा से हटाने योग्य संभावित कबाड़/एंटी-एलिमेंट्स:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
                        {coreQueryResult.clutterItemsToInspectHi.map((clt, i) => (
                          <li key={i}>{clt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ fontSize: 12, fontWeight: 800, color: "#15803D", marginBottom: 6 }}>
                    💡 ₹0-₹20 लो-कॉस्ट सक्रियता उपचार (Low Cost Actionable Remedy):
                  </div>
                  <p style={{ fontSize: 13, color: "#14532D", margin: "0 0 8px 0", fontWeight: 600, lineHeight: 1.5 }}>
                    {coreQueryResult.lowCostActivatingRemedyHi}
                  </p>

                  <div style={{ marginTop: 10, padding: 10, background: "#F0FDF4", borderRadius: 8, border: "1px solid #86EFAC" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#166534", marginBottom: 2 }}>
                      उपयोग नियम (Utilization Protocol):
                    </div>
                    <div style={{ fontSize: 12, color: "#14532D" }}>
                      {coreQueryResult.utilizationProtocolHi}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MODE 2: ALL 12 HOUSES ── */}
        {activeNavigatorMode === "ALL_12_HOUSES" && (
          <div>
            {/* House Buttons 1 to 12 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                const isSelected = selectedHouse === h;
                return (
                  <button
                    key={h}
                    onClick={() => setSelectedHouse(h)}
                    style={{
                      flex: "1 1 calc(8.33% - 8px)",
                      minWidth: 70,
                      padding: "10px 8px",
                      borderRadius: 10,
                      border: isSelected ? "2px solid #0284C7" : "1px solid #CBD5E1",
                      background: isSelected ? "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)" : "#F8FAFC",
                      color: isSelected ? "#FFFFFF" : "#334155",
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 12.5,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      textAlign: "center",
                    }}
                  >
                    <div>भाव {h}</div>
                    <div style={{ fontSize: 10, opacity: isSelected ? 0.9 : 0.7 }}>
                      {h === 1 ? "लग्न" : h === 4 ? "मकान" : h === 7 ? "विवाह" : h === 10 ? "कर्म" : h === 11 ? "लाभ" : ""}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Analysis Card */}
            {activeQueryAnalysis && (
              <div
                style={{
                  background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
                  border: "1.5px solid #7DD3FC",
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                  <div style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #BAE6FD" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0369A1" }}>🎯 अभीष्ट भाव (Query Target)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>
                      भाव {activeQueryAnalysis.queryHouse}: {activeQueryAnalysis.queryThemeHindi}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                      राशि: {activeQueryAnalysis.houseSign} ({activeQueryAnalysis.houseSignNum}) | स्वामी: {activeQueryAnalysis.houseLordHindi} ({activeQueryAnalysis.houseLord})
                    </div>
                  </div>

                  <div style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #BAE6FD" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309" }}>⚡ 4-सेकंड ट्रिगर भाव (GPS Target House)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#92400E", marginTop: 4 }}>
                      भाव {activeQueryAnalysis.targetHouse}: {activeQueryAnalysis.targetSign} ({activeQueryAnalysis.targetSignNum})
                    </div>
                    <div style={{ fontSize: 12, color: "#B45309", marginTop: 4 }}>
                      स्वामी स्थित: भाव {activeQueryAnalysis.placedHouse} (जीपीएस कोड: {activeQueryAnalysis.gpsCode})
                    </div>
                  </div>

                  <div style={{ background: "#FFFFFF", padding: 14, borderRadius: 10, border: "1px solid #BAE6FD" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#15803D" }}>🧭 सक्रिय करने योग्य दिशा (Actionable Vastu Zone)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#166534", marginTop: 4 }}>
                      {activeQueryAnalysis.targetDirectionHindi} ({activeQueryAnalysis.targetDirection} - {activeQueryAnalysis.targetDirectionCode})
                    </div>
                    <div style={{ fontSize: 12, color: "#15803D", marginTop: 4 }}>
                      तत्व दिशा कोड: {activeQueryAnalysis.targetDirectionCode}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16, background: "#FFFFFF", padding: 16, borderRadius: 12, border: "1px solid #BAE6FD" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#0369A1", marginBottom: 6 }}>
                    📜 शास्त्रीय क्रियाविधि व तत्काल शुद्धि (Action Required):
                  </div>
                  <p style={{ fontSize: 13.5, color: "#334155", margin: "0 0 12px 0", lineHeight: 1.6 }}>
                    {activeQueryAnalysis.actionRequired}
                  </p>

                  {activeQueryAnalysis.clutterToInspect && activeQueryAnalysis.clutterToInspect.length > 0 && (
                    <div style={{ marginBottom: 12, padding: 10, background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#B45309", marginBottom: 4 }}>
                        ⚠️ इस दिशा से हटाने योग्य संभावित कबाड़/एंटी-एलिमेंट्स:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {activeQueryAnalysis.clutterToInspect.map((clt, i) => (
                          <span key={i} style={{ fontSize: 11, padding: "2px 8px", background: "#FEF3C7", color: "#92400E", borderRadius: 6, fontWeight: 600 }}>
                            {clt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: 12, fontWeight: 800, color: "#15803D", marginBottom: 6 }}>
                    💡 ₹0 लो-कॉस्ट सक्रियता उपचार (Practical Activating Remedy):
                  </div>
                  <p style={{ fontSize: 13.5, color: "#14532D", margin: "0 0 8px 0", fontWeight: 600, lineHeight: 1.6 }}>
                    {activeQueryAnalysis.activatingRemedy}
                  </p>

                  {activeQueryAnalysis.utilizationProtocol && (
                    <div style={{ marginTop: 10, padding: 10, background: "#F0FDF4", borderRadius: 8, border: "1px solid #86EFAC" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#166534", marginBottom: 2 }}>
                        उपयोग नियम (Utilization Protocol):
                      </div>
                      <div style={{ fontSize: 12.5, color: "#14532D" }}>
                        {activeQueryAnalysis.utilizationProtocol}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. 9 PLANETARY GPS CODES & 45 DEVATAS ─────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            🔢 9 ग्रहों के GPS कोड्स एवं 45 देवताओं का शास्त्रीय आवंटन
          </h3>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
            प्रत्येक ग्रह का एक अद्वितीय GPS कोड होता है जो वास्तु मंडल के संबंधित देवताओं और दिशाओं को संचालित करता है।
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {Object.entries(MASTER_GPS_CODES).map(([plKey, codeDef]) => {
            const devatas = PLANET_TO_45_DEVATAS[plKey] || [];
            return (
              <div
                key={plKey}
                style={{
                  background: "#F8FAFC",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 14,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#1E293B" }}>{codeDef.hindiName}</span>
                    <span
                      style={{
                        padding: "3px 10px",
                        background: "#0284C7",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 900,
                        borderRadius: 8,
                      }}
                    >
                      GPS कोड: {codeDef.code}
                    </span>
                  </div>

                  <div style={{ fontSize: 11.5, color: "#64748B", marginBottom: 6 }}>
                    <strong>आधार:</strong> {codeDef.shastricBasis}
                  </div>
                  <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, marginBottom: 10 }}>
                    {codeDef.description}
                  </div>
                </div>

                <div style={{ borderTop: "1px dashed #CBD5E1", paddingTop: 8, marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                    🏛️ इस ग्रह के 45 देवता ({devatas.length}):
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {devatas.map((dev, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 10.5,
                          padding: "2px 6px",
                          background: "#E2E8F0",
                          color: "#1E293B",
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        {dev}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. CLINICAL PROBLEM-TO-DEITY DIAGNOSTIC MAP ───────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            🩺 विशिष्ट जीवन समस्याओं से देवता का क्लीनिकल डायग्नोस्टिक
          </h3>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
            सीधे जातक की समस्या से संबंधित देवता के पद की पहचान कर सटीक शास्त्रीय उपचार करें।
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.map((prob) => {
            const isBlock = prob.actionProtocol === "BLOCK_DEACTIVATE";
            const isActivate = prob.actionProtocol === "ACTIVATE";
            return (
              <div
                key={prob.id}
                style={{
                  background: isBlock ? "#FFF5F5" : isActivate ? "#F0FDF4" : "#FFFBEB",
                  border: `1.5px solid ${isBlock ? "#FECACA" : isActivate ? "#BBF7D0" : "#FDE68A"}`,
                  borderRadius: 14,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                      {prob.problemTitleHi}
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: isBlock ? "#DC2626" : isActivate ? "#16A34A" : "#D97706",
                        color: "#FFFFFF",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isBlock ? "ब्लॉक/दबाएं" : isActivate ? "सक्रिय करें" : "शुद्धि/अर्घ्य"}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
                    <strong>लक्षित देवता:</strong> {prob.targetDevataName} ({prob.zone}) | <strong>ग्रह:</strong> {prob.governingPlanet}
                  </div>

                  <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.5, margin: "6px 0 10px 0" }}>
                    {prob.shastricDiagnosis}
                  </p>
                </div>

                <div
                  style={{
                    background: "#FFFFFF",
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${isBlock ? "#FCA5A5" : isActivate ? "#86EFAC" : "#FCD34D"}`,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: isBlock ? "#DC2626" : isActivate ? "#16A34A" : "#B45309", marginBottom: 4 }}>
                    उपाय निर्देश:
                  </div>
                  <div style={{ fontSize: 12, color: "#0F172A", fontWeight: 600, lineHeight: 1.4 }}>
                    {prob.physicalRemedyHi}
                  </div>
                  {prob.offeringDetails && (
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                      ⏱️ {prob.offeringDetails}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. KETU CUT-ZONE & RAHU EXTENDED-ZONE ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Ketu Cut Zone */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #FCD34D",
            borderRadius: 16,
            padding: 22,
            boxShadow: "0 4px 15px rgba(245, 158, 11, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: "#92400E", margin: 0 }}>
              ✂️ केतु कट-ज़ोन (कटा हुआ कोना)
            </h4>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", background: "#FEF3C7", color: "#92400E", borderRadius: 6 }}>
              ₹0-₹20 लो-कॉस्ट
            </span>
          </div>

          <div style={{ fontSize: 13, color: "#78350F", marginBottom: 10 }}>
            <strong>कट दिशा:</strong> {gpsDossier.ketuCutZone?.cutDirectionHindi || gpsDossier.ketuCutZone?.cutDirection} ({gpsDossier.ketuCutZone?.cutDirectionCode}) | भाव {gpsDossier.ketuCutZone?.ketuHouse} ({gpsDossier.ketuCutZone?.ketuSignName} राशि)
          </div>

          <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6, marginBottom: 14 }}>
            {gpsDossier.ketuCutZone?.defectDescription}
          </p>

          <div style={{ background: "#FFFBEB", padding: 14, borderRadius: 10, border: "1px solid #FDE68A", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#B45309" }}>शास्त्रीय ऊर्जा-पूरक उपचार (Energy Fill-up):</div>
            <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
              💡 <strong>24 घंटे पीला बल्ब:</strong> {gpsDossier.ketuCutZone?.correctiveRemedies?.yellowBulb24Hr}
            </div>
            <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
              🚩 <strong>छत पर धर्म ध्वज:</strong> {gpsDossier.ketuCutZone?.correctiveRemedies?.roofCornerFlag}
            </div>
            <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
              🧦 <strong>देह-वास्तु उपाय:</strong> पीले मोज़े (Yellow Socks) अथवा चेक मोज़े पहनें व पैरों के तलवों पर हल्दी का तिलक लगाएं।
            </div>
            <div style={{ fontSize: 11.5, color: "#92400E", fontStyle: "italic", borderTop: "1px dashed #FDE68A", paddingTop: 6 }}>
              {gpsDossier.ketuCutZone?.correctiveRemedies?.cleanlinessProtocol}
            </div>
          </div>
        </div>

        {/* Rahu Extended Zone */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #93C5FD",
            borderRadius: 16,
            padding: 22,
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: "#1E40AF", margin: 0 }}>
              📐 राहु एक्सटेंडेड-ज़ोन (बढ़ा हुआ कोना)
            </h4>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", background: "#DBEAFE", color: "#1E40AF", borderRadius: 6 }}>
              ₹0-₹20 लो-कॉस्ट
            </span>
          </div>

          <div style={{ fontSize: 13, color: "#1E40AF", marginBottom: 10 }}>
            <strong>विस्तार दिशा:</strong> {gpsDossier.rahuExtendedZone?.extendedDirectionHindi || gpsDossier.rahuExtendedZone?.extendedDirection} ({gpsDossier.rahuExtendedZone?.extendedDirectionCode}) | भाव {gpsDossier.rahuExtendedZone?.rahuHouse} ({gpsDossier.rahuExtendedZone?.rahuSignName} राशि)
          </div>

          <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6, marginBottom: 14 }}>
            {gpsDossier.rahuExtendedZone?.defectDescription}
          </p>

          <div style={{ background: "#EFF6FF", padding: 14, borderRadius: 10, border: "1px solid #BFDBFE", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#1D4ED8" }}>शास्त्रीय हारमोनाइजेशन व ग्राउंडिंग (Grounding Balance):</div>
            <div style={{ fontSize: 12, color: "#1E40AF", lineHeight: 1.5 }}>
              ⚡ <strong>ऊर्जा ग्राउंडिंग (Earthing):</strong> {gpsDossier.rahuExtendedZone?.correctiveRemedies?.groundingCure}
            </div>
            <div style={{ fontSize: 12, color: "#1E40AF", lineHeight: 1.5 }}>
              🔌 <strong>इलेक्ट्रिकल शुद्धि:</strong> {gpsDossier.rahuExtendedZone?.correctiveRemedies?.electricalNeutralization}
            </div>
            <div style={{ fontSize: 12, color: "#1E40AF", lineHeight: 1.5 }}>
              🔔 <strong>धातु/ध्वनि संतुलन:</strong> इस बढ़े कोने में 5 या 6 रॉड्स वाली मेटल विंड चाइम लगाएं अथवा ब्रास/कॉपर पिरामिड स्ट्रिप से ऊर्जा को ग्राउंड करें।
            </div>
          </div>
        </div>
      </div>

      {/* ── 5B. NEGATIVE HOUSES UTILIZATION PROTOCOL (6, 8, 12) & AUTHENTIC MEDIUMS ───── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                🛡️ त्रिक भाव (6, 8, 12) उपयोग सूत्र एवं प्रामाणिक शास्त्रीय माध्यम
              </h3>
              <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
                शास्त्रीय नियम: 6ठे भाव का माध्यम 'मिट्टी के गमले में जीवित पौधा', 8वें का 'संपूर्ण फल दान/शारीरिक सेवा', व 12वें का 'स्वेच्छा से व्यय' है।
              </p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", background: "#FEF3C7", color: "#92400E", borderRadius: 8 }}>
              प्रामाणिक माध्यम भेद
            </span>
          </div>
        </div>

        {/* Trika Medium Sub-Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {[
            { id: "plants_6" as const, label: "🌿 6ठा भाव: मिट्टी के गमले में जीवित पौधे", badge: "रोग/कर्ज मुक्ति" },
            { id: "fruits_8" as const, label: "🍎 8वां भाव: संपूर्ण फल व भोजन दान / सेवा", badge: "असाध्य पीड़ा शमन" },
            { id: "tithes_12" as const, label: "💳 12वां भाव: KP स्वैच्छिक व्यय व दान", badge: "अस्पताल/चालान रक्षा" },
          ].map((t) => {
            const isSel = trikaMediumTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTrikaMediumTab(t.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: isSel ? "2px solid #0284C7" : "1px solid #CBD5E1",
                  background: isSel ? "#0284C7" : "#F8FAFC",
                  color: isSel ? "#FFFFFF" : "#334155",
                  fontWeight: isSel ? 800 : 600,
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <span>{t.label}</span>
                <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.85 }}>({t.badge})</span>
              </button>
            );
          })}
        </div>

        {/* 6th House Living Plants View */}
        {trikaMediumTab === "plants_6" && (
          <div>
            <div style={{ marginBottom: 12, padding: "10px 14px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, fontSize: 12.5, color: "#166534" }}>
              <strong>🌱 शास्त्रीय माध्यम नियम:</strong> 6ठे भाव (रोग, ऋण, शत्रु) की शांति के लिए पौधे हमेशा <strong>प्राकृतिक मिट्टी के गमले (Earthen Mud Pot)</strong> में लगाए जाते हैं। प्लास्टिक के गमले में पौधा लगाना वर्जित है।
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {trikaAnalysis.house6PlantRemedies.map((p) => (
                <div
                  key={p.planet}
                  style={{
                    background: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{p.planetHi} ({p.planet})</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", background: "#DCFCE7", color: "#15803D", borderRadius: 6 }}>
                        {p.plantNameEn}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 4 }}>
                      🪴 {p.plantNameHi}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748B", marginBottom: 6 }}>
                      <strong>गमला माध्यम:</strong> {p.mediumSpecificationHi}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#0369A1", marginBottom: 6 }}>
                      💧 <strong>सिंचन नियम:</strong> {p.wateringProtocolHi}
                    </div>
                    <p style={{ fontSize: 12, color: "#334155", margin: "4px 0 8px 0", lineHeight: 1.4 }}>
                      <strong>लक्ष्य:</strong> {p.targetAilmentDebtHi}
                    </p>
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", background: "#FFFFFF", padding: 8, borderRadius: 6, border: "1px solid #E2E8F0", fontStyle: "italic" }}>
                    {p.shastricRationaleHi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8th House Whole Fruits View */}
        {trikaMediumTab === "fruits_8" && (
          <div>
            <div style={{ marginBottom: 12, padding: "10px 14px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, fontSize: 12.5, color: "#92400E" }}>
              <strong>🍎 शास्त्रीय माध्यम नियम:</strong> 8वें भाव (आकस्मिक संकट, आयु पीड़ा, सर्जरी) की शांति के लिए <strong>संपूर्ण साबुत फल (Whole Fruits) का दान</strong> अथवा तीर्थ/मंदिर में <strong>शारीरिक सेवा (जूता-चप्पल सफाई)</strong> की जाती है।
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {trikaAnalysis.house8FruitRemedies.map((f) => (
                <div
                  key={f.planet}
                  style={{
                    background: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{f.planetHi} ({f.planet})</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", background: "#FEF3C7", color: "#92400E", borderRadius: 6 }}>
                        {f.timingDayHi}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#B45309", marginBottom: 4 }}>
                      🎁 {f.fruitOrFoodHi}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748B", marginBottom: 4 }}>
                      <strong>मात्रा:</strong> {f.quantityHi} | <strong>स्थान:</strong> {f.donationVenueHi}
                    </div>
                    <p style={{ fontSize: 12, color: "#334155", margin: "4px 0 8px 0", lineHeight: 1.4 }}>
                      <strong>निवारण:</strong> {f.targetPeedaHi}
                    </p>
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", background: "#FFFFFF", padding: 8, borderRadius: 6, border: "1px solid #E2E8F0", fontStyle: "italic" }}>
                    {f.shastricRationaleHi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12th House KP Voluntary Tithes View */}
        {trikaMediumTab === "tithes_12" && (
          <div>
            <div style={{ marginBottom: 12, padding: "10px 14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, fontSize: 12.5, color: "#1E40AF" }}>
              <strong>💳 KP स्वैच्छिक व्यय का सार्वभौमिक सिद्धांत:</strong> 12वां भाव व्यय का है। जो ग्रह 12वें भाव में बैठा है या उसका स्वामी है, वह आपसे धन अवश्य खर्च कराएगा। यदि आप उसके कारक अनुसार <strong>स्वेच्छा से दान या खर्च नहीं करेंगे</strong>, तो वह अस्पताल के आईसीयू बिल, पुलिस चालान, कोर्ट फीस या दवाइयों के रूप में <strong>बाध्यकारी खर्च</strong> कराएगा!
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {trikaAnalysis.house12VoluntaryTithes.map((tithe) => (
                <div
                  key={tithe.planet}
                  style={{
                    background: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{tithe.planetHi} ({tithe.planet})</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", background: "#DBEAFE", color: "#1D4ED8", borderRadius: 6 }}>
                        स्वैच्छिक व्यय
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1E40AF", marginBottom: 4 }}>
                      🛍️ {tithe.voluntaryActionHi}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#DC2626", margin: "6px 0", background: "#FEF2F2", padding: "6px 8px", borderRadius: 6, border: "1px solid #FECACA" }}>
                      🛑 <strong>रोकने योग्य बाध्यकारी नुकसान:</strong> {tithe.preventedInvoluntaryDrainHi}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#475569", marginBottom: 4 }}>
                      <strong>पात्र:</strong> {tithe.targetRecipientHi} | <strong>सुझाव:</strong> {tithe.recommendedBudgetOrItemHi}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", background: "#FFFFFF", padding: 8, borderRadius: 6, border: "1px solid #E2E8F0", fontStyle: "italic", marginTop: 6 }}>
                    {tithe.kpPrincipleHi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing General Advice List */}
        {gpsDossier.houseUtilizationAdvices && gpsDossier.houseUtilizationAdvices.length > 0 && (
          <div style={{ marginTop: 20, borderTop: "1px dashed #CBD5E1", paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 10 }}>
              संक्षिप्त कर्म संरेखण (Short Karmic Alignment):
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              {gpsDossier.houseUtilizationAdvices.map((adv) => (
                <div key={adv.houseNumber} style={{ background: "#F1F5F9", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#334155" }}>
                  <strong>भाव {adv.houseNumber} ({adv.houseTheme}):</strong> {adv.practicalAction}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 6. TOILET BLOCKING & DOMINANT-WORD RULE ────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            🚽 टॉयलेट ब्लॉकिंग का दिशा-तत्व-धातु सिद्धांत एवं हाइब्रिड संधि नियम
          </h3>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
            टॉयलेट कहीं भी हो, उसे उसी दिशा के सेल्फ-कलर और सेल्फ-मेटल की 1 इंच ग्रूव स्ट्रिप से काटा जाता है।
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
          {Object.entries(TOILET_BLOCKING_MATRIX).map(([quad, p]) => (
            <div
              key={quad}
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #CBD5E1",
                borderTop: `4px solid ${p.metalColor}`,
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                {quad === "East" ? "पूर्व (East)" : quad === "South" ? "दक्षिण (South)" : quad === "West" ? "पश्चिम (West)" : "उत्तर (North)"}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.metalColor, marginTop: 4 }}>
                {p.metalStrip}
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 6, lineHeight: 1.4 }}>
                {p.floorGrooveMethod}
              </div>
            </div>
          ))}
        </div>

        {/* Hybrid Dominant Word Calculator */}
        <div
          style={{
            background: "#F1F5F9",
            borderRadius: 12,
            padding: 16,
            border: "1px dashed #94A3B8",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1E293B", marginBottom: 6 }}>
            🔀 हाइब्रिड संधि विवाद समाधान (Dominant Word Invariant):
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 10 }}>
            यदि टॉयलेट दो ज़ोनों की संधि पर आ रहा हो (जैसे ESE और SE):
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {[
              ["ESE", "SE"],
              ["SSW", "SW"],
              ["WSW", "W"],
              ["NNW", "NW"],
              ["NNE", "NE"],
            ].map((combo, idx) => {
              const isSelected = selectedHybridZones.join("-") === combo.join("-");
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedHybridZones(combo)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    border: isSelected ? "2px solid #0284C7" : "1px solid #CBD5E1",
                    background: isSelected ? "#0284C7" : "#FFFFFF",
                    color: isSelected ? "#FFFFFF" : "#334155",
                    cursor: "pointer",
                  }}
                >
                  {combo.join(" + ")}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 12.5, color: "#0F172A", fontWeight: 600 }}>
            {hybridMetalResult.explanation}
          </div>
        </div>

        {/* E1 Nazar Defense Notice */}
        <div
          style={{
            marginTop: 18,
            padding: 14,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>🧿</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#991B1B" }}>
              E1 (शिखी / पर्जन्य संधि) प्रवेश द्वार एवं तीव्र नज़र दोष रक्षा:
            </div>
            <div style={{ fontSize: 12, color: "#7F1D1D", marginTop: 2 }}>
              {E1_ENTRANCE_NAZAR_DEFENSE.classicalRemedyHi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

