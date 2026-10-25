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

interface GPSAstroVastuViewProps {
  chart: ChartData | any;
}

export function GPSAstroVastuView({ chart }: GPSAstroVastuViewProps) {
  const [selectedHouse, setSelectedHouse] = useState<number>(4);
  const [selectedHybridZones, setSelectedHybridZones] = useState<string[]>(["ESE", "SE"]);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "HEALTH" | "CAREER" | "FAMILY">("ALL");

  const gpsDossier = useMemo(() => {
    return runGPSAstroVastuEngine(chart);
  }, [chart]);

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
              ⏱️ 4-सेकंड रिवर्स काउंटिंग टूल (Actionable Trigger House)
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
              जिस भाव का फल चाहिए, उससे घड़ी की उल्टी दिशा (वामावर्त) 4 भाव पीछे चलकर ट्रिगर दिशा को सक्रिय करें।
            </p>
          </div>
        </div>

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

      {/* ── 5B. NEGATIVE HOUSES UTILIZATION PROTOCOL (6, 8, 12) ───── */}
      {gpsDossier.houseUtilizationAdvices && gpsDossier.houseUtilizationAdvices.length > 0 && (
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
              🛡️ त्रिक भाव उपयोग सूत्र (Negative House Utilization Formulas)
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0 0" }}>
              6ठे, 8वें और 12वें भाव को कष्ट देने से रोकने के लिए उनका सकारात्मक उपयोग (Utilization) अनिवार्य है।
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {gpsDossier.houseUtilizationAdvices.map((adv) => (
              <div
                key={adv.houseNumber}
                style={{
                  background: "#F8FAFC",
                  border: "1.5px solid #CBD5E1",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                    {adv.houseTheme}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8, fontStyle: "italic" }}>
                    &quot;{adv.philosophicalConcept}&quot;
                  </div>
                </div>
                <div style={{ background: "#FFFFFF", padding: 10, borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, color: "#1E293B", lineHeight: 1.4 }}>
                  <strong>शास्त्रीय कर्म:</strong> {adv.practicalAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

