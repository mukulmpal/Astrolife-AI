// src/components/vastu/GoalHouseActivationView.tsx
"use client";

import React, { useState, useMemo } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  evaluateGoalHouseActivation,
  evaluateLagnaMandatoryShield,
  evaluatePartnershipRiskAudit,
  evaluatePlanetToHouseHits,
  evaluateTransitDashaConcurrency,
  getDevataFloorHardwareProtocols,
  getVirtualDoorProtocol,
  MASTER_LECTURE_CASE_STUDIES,
  type GoalActivationId,
  type GoalActivationResult,
  type LectureCaseStudy,
} from "@/lib/astro-engine/goal-house-activation-engine";

interface GoalHouseActivationViewProps {
  chart: ChartData | null | undefined;
}

const GOAL_OPTIONS: { id: GoalActivationId; label: string; icon: string; category: string }[] = [
  { id: "foreign_travel", label: "विदेश यात्रा व सैटलमेंट (3, 9, 12)", icon: "✈️", category: "यात्रा व प्रवास" },
  { id: "property_purchase", label: "मकान/संपत्ति क्रय (4, 11)", icon: "🏠", category: "अचल संपत्ति" },
  { id: "property_sale", label: "संपत्ति विक्रय व निस्तारण (3, 10)", icon: "🏷️", category: "अचल संपत्ति" },
  { id: "addiction_relief", label: "नशा व व्यसन मुक्ति (W8 सुपारी)", icon: "🚭", category: "स्वास्थ्य व आचरण" },
  { id: "high_bp_anger_calm", label: "क्रोध, बीपी व कलह शांति (25g कड़ा)", icon: "🧘", category: "स्वास्थ्य व आचरण" },
  { id: "partnership_risk_audit", label: "पार्टनरशिप जोखिम ऑडिट (याचिका सूत्र)", icon: "🤝", category: "व्यापार व साझीदारी" },
  { id: "coma_critical_vitality", label: "कोमा/प्राण-तत्व एक्टिवेशन (0.5'' डॉट)", icon: "⚡", category: "गंभीर चिकित्सा" },
  { id: "devata_floor_hardware", label: "45 देवता 4'' जमीनी विनिर्देश", icon: "🏛️", category: "वास्तु हार्डवेयर" },
  { id: "virtual_door_protocol", label: "वर्चुअल द्वार (6 फीट नियम)", icon: "🚪", category: "वास्तु हार्डवेयर" },
  { id: "lagna_mandatory_shield", label: "लग्न अनिवार्य सुरक्षा शील्ड", icon: "🛡️", category: "व्यक्तिगत सुरक्षा" },
];

export function GoalHouseActivationView({ chart }: GoalHouseActivationViewProps) {
  const [selectedGoal, setSelectedGoal] = useState<GoalActivationId>("foreign_travel");

  const lagnaShield = useMemo(() => evaluateLagnaMandatoryShield(chart), [chart]);
  const goalResult = useMemo(
    () => evaluateGoalHouseActivation(chart, selectedGoal),
    [chart, selectedGoal]
  );
  const partnershipAudit = useMemo(() => evaluatePartnershipRiskAudit(chart), [chart]);
  const floorProtocols = useMemo(() => getDevataFloorHardwareProtocols(), []);
  const virtualDoor = useMemo(() => getVirtualDoorProtocol(), []);
  const cuspHits = useMemo(() => evaluatePlanetToHouseHits(chart), [chart]);
  const transitConcurrency = useMemo(() => evaluateTransitDashaConcurrency(chart), [chart]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case_chirag");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── TOP: LAGNA MANDATORY SHIELD ALERT BANNER ── */}
      <div
        style={{
          borderRadius: "14px",
          padding: "16px 20px",
          border: lagnaShield.isLagnaUnderHit
            ? "2px solid #EF4444"
            : "1px solid rgba(16, 185, 129, 0.4)",
          background: lagnaShield.isLagnaUnderHit
            ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
          boxShadow: lagnaShield.isLagnaUnderHit
            ? "0 4px 14px rgba(239, 68, 68, 0.2)"
            : "0 2px 8px rgba(16, 185, 129, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "26px" }}>{lagnaShield.isLagnaUnderHit ? "🚨" : "🛡️"}</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 800, color: lagnaShield.isLagnaUnderHit ? "#991B1B" : "#065F46" }}>
                {lagnaShield.isLagnaUnderHit ? "उच्च-प्राथमिकता लग्न सुरक्षा शील्ड (Lagna Hit Alert)" : "लग्न सुरक्षा शील्ड (Lagna Guard Secure)"}
              </div>
              <div style={{ fontSize: "13px", color: lagnaShield.isLagnaUnderHit ? "#B91C1C" : "#047857", marginTop: "2px" }}>
                लग्न बिंदु: <strong>{lagnaShield.lagnaSignHi} ({lagnaShield.lagnaSign}) {lagnaShield.lagnaCompoundDeg}°</strong>
              </div>
            </div>
          </div>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              background: lagnaShield.isLagnaUnderHit ? "#DC2626" : "#059669",
              color: "#FFFFFF",
            }}
          >
            {lagnaShield.isLagnaUnderHit ? "तत्काल निवारण अनिवार्य" : "सुरक्षित"}
          </span>
        </div>

        <p style={{ margin: "10px 0 0 0", fontSize: "14px", lineHeight: "1.6", color: lagnaShield.isLagnaUnderHit ? "#7F1D1D" : "#064E3B" }}>
          {lagnaShield.shieldBannerHi}
        </p>

        {lagnaShield.remediationDirectivesHi.length > 0 && (
          <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(255, 255, 255, 0.7)", borderRadius: "8px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#991B1B", marginBottom: "4px" }}>
              शील्ड निवारण निर्देश (Relocation Directives):
            </div>
            {lagnaShield.remediationDirectivesHi.map((dir, idx) => (
              <div key={idx} style={{ fontSize: "12.5px", color: "#374151", margin: "3px 0" }}>
                {dir}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── GOAL SELECTOR BAR ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          borderRadius: "14px",
          padding: "18px 20px",
          border: "1px solid rgba(217, 119, 6, 0.3)",
          boxShadow: "0 2px 10px rgba(180, 83, 9, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#78350F" }}>
              🎯 लक्ष्य-आधारित भाव व वास्तु सक्रियण इंजन (Goal-Based House Activation)
            </div>
            <div style={{ fontSize: "13px", color: "#92400E", marginTop: "2px" }}>
              अपनी मनोकामना अथवा जीवन लक्ष्य चुनें — यह इंजन आपकी जन्म कुंडली के भावों से सटीक दिशाएं, अंग एवं वस्तुएं स्वतः निकालेगा।
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {GOAL_OPTIONS.map((opt) => {
            const isSelected = selectedGoal === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedGoal(opt.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 15px",
                  borderRadius: "10px",
                  border: isSelected ? "2px solid #D97706" : "1px solid rgba(217, 119, 6, 0.3)",
                  background: isSelected
                    ? "linear-gradient(135deg, #78350F 0%, #92400E 100%)"
                    : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#78350F",
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 3px 10px rgba(120, 53, 15, 0.25)" : "none",
                }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SELECTED GOAL CARD ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "24px",
          border: "1px solid rgba(229, 231, 235, 1)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#1F2937", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>{GOAL_OPTIONS.find((o) => o.id === selectedGoal)?.icon}</span>
              <span>{goalResult.goalNameHi}</span>
            </div>
            <div style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
              {goalResult.descriptionHi}
            </div>
          </div>
          {goalResult.primaryHouses.length > 0 && (
            <div style={{ display: "flex", gap: "6px" }}>
              {goalResult.primaryHouses.map((h) => (
                <span
                  key={h}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "rgba(217, 119, 6, 0.12)",
                    color: "#92400E",
                    fontWeight: 700,
                    fontSize: "12px",
                    border: "1px solid rgba(217, 119, 6, 0.3)",
                  }}
                >
                  भाव {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* NEGATION HOUSE CRITICAL ALERT (E.g. Foreign Travel 11th House) */}
        {goalResult.negationHouseWarning && (
          <div
            style={{
              borderRadius: "10px",
              padding: "14px 18px",
              marginBottom: "20px",
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.06) 100%)",
              border: "1.5px solid #EF4444",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#991B1B", marginBottom: "4px" }}>
              {goalResult.negationHouseWarning.warningHi}
            </div>
            <div style={{ fontSize: "13.5px", color: "#7F1D1D", lineHeight: "1.5" }}>
              {goalResult.negationHouseWarning.reasonHi}
            </div>
          </div>
        )}

        {/* PARTNERSHIP RISK AUDIT DETAILED CALLOUT (If goal is partnership) */}
        {selectedGoal === "partnership_risk_audit" && (
          <div
            style={{
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "20px",
              background: partnershipAudit.isSeventhLordInFifth
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(185, 28, 28, 0.05) 100%)"
                : "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
              border: partnershipAudit.isSeventhLordInFifth ? "1.5px solid #EF4444" : "1.5px solid #10B981",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: partnershipAudit.isSeventhLordInFifth ? "#991B1B" : "#065F46",
                marginBottom: "6px",
              }}
            >
              {partnershipAudit.verdictHi}
            </div>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {partnershipAudit.reasoningChainHi.map((step, idx) => (
                <div key={idx} style={{ fontSize: "13px", color: "#374151" }}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DYNAMIC HOUSE CARDS */}
        {goalResult.houseDetails.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {goalResult.houseDetails.map((h) => (
              <div
                key={h.house}
                style={{
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(209, 213, 219, 0.8)",
                  background: "linear-gradient(135deg, #FAFAFA 0%, #F3F4F6 100%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      background: "#1F2937",
                      color: "#FFFFFF",
                      padding: "3px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    भाव {h.house} ({h.houseSignHi})
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#D97706",
                      background: "rgba(217, 119, 6, 0.12)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    दिशा: {h.directionHi} ({h.directionCode})
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "#4B5563" }}>
                  कस्प डिग्री: <strong>{h.cuspDegreeFormatted}</strong> (कम्पाउंड: {h.cuspCompoundDeg}°)
                </div>

                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>
                  📌 भूमिका: {h.activationObjectiveHi}
                </div>

                <div style={{ fontSize: "12.5px", color: "#374151" }}>
                  👤 शरीर का अंग (डॉट थेरेपी): <strong>{h.anatomicalPartHi}</strong> ({h.anatomicalPartEn})
                </div>

                <div style={{ fontSize: "12px", color: "#065F46", background: "rgba(16, 185, 129, 0.1)", padding: "8px 10px", borderRadius: "6px" }}>
                  ✅ <strong>रखने योग्य वस्तुएं:</strong> {h.recommendedObjectsHi.join(", ")}
                </div>

                <div style={{ fontSize: "12px", color: "#991B1B", background: "rgba(239, 68, 68, 0.08)", padding: "8px 10px", borderRadius: "6px" }}>
                  ❌ <strong>हटाने योग्य वस्तुएं:</strong> {h.objectsToAvoidHi.join(", ")}
                </div>

                <div style={{ fontSize: "12px", color: "#4B5563", fontStyle: "italic" }}>
                  🎯 <strong>बायो-डॉट निर्देश:</strong> {h.biometricDotInstructionHi}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SPECIFIC HARDWARE REMEDY (E.g. W8 Betel Nut, 25g Silver Kada, Devta 4" Cut, Virtual Door) */}
        {goalResult.specificHardwareRemedy && (
          <div
            style={{
              borderRadius: "12px",
              padding: "18px 20px",
              background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
              border: "1px solid rgba(217, 119, 6, 0.4)",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#78350F", marginBottom: "8px" }}>
              🛠️ {goalResult.specificHardwareRemedy.titleHi}
            </div>

            <div style={{ fontSize: "13px", color: "#92400E", marginBottom: "8px" }}>
              <strong>आवश्यक सामग्री (Hardware/Materials):</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                {goalResult.specificHardwareRemedy.materialsHi.map((m, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#FFFFFF",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      border: "1px solid rgba(217, 119, 6, 0.3)",
                      fontSize: "12px",
                      color: "#78350F",
                    }}
                  >
                    • {m}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#78350F" }}>
              <strong>चरणबद्ध विधि (Procedure Steps):</strong>
              <ol style={{ margin: "6px 0 0 18px", padding: 0 }}>
                {goalResult.specificHardwareRemedy.procedureStepsHi.map((step, idx) => (
                  <li key={idx} style={{ margin: "4px 0", fontSize: "12.5px", lineHeight: "1.5" }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {goalResult.specificHardwareRemedy.precautionHi && (
              <div style={{ marginTop: "10px", fontSize: "12px", color: "#B45309", fontWeight: 700 }}>
                ⚠️ सावधानी: {goalResult.specificHardwareRemedy.precautionHi}
              </div>
            )}
          </div>
        )}

        {/* SHASTRA VERDICT SUMMARY */}
        <div
          style={{
            padding: "12px 16px",
            background: "#F9FAFB",
            borderRadius: "8px",
            borderLeft: "4px solid #D97706",
            fontSize: "13px",
            color: "#374151",
            lineHeight: "1.6",
          }}
        >
          <strong>शास्त्रीय निष्कर्ष (Verdict):</strong> {goalResult.shastricVerdictHi}
        </div>
      </div>

      {/* ── PLANET TO HOUSE CUSP HIT AUDIT TABLE ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "20px 24px",
          border: "1px solid rgba(229, 231, 235, 1)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ fontSize: "17px", fontWeight: 800, color: "#1F2937", marginBottom: "4px" }}>
          📡 ग्रह-से-भाव कस्प हिट्स ऑडिट (Planet-to-House Cusp Hits)
        </div>
        <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "14px" }}>
          जब कोई ग्रह किसी भाव के कस्प बिंदु पर 180° या 90° का हिट मारता है, तो वह उस भाव के फल को नष्ट करता है (जैसे मंजुला केस में राहु 176° पर 6ठे भाव के कस्प पर हिट देकर कोर्ट केस दे रहा था)।
        </div>

        {cuspHits.length === 0 ? (
          <div style={{ padding: "16px", background: "#F3F4F6", borderRadius: "8px", fontSize: "13px", color: "#6B7280" }}>
            वर्तमान में भाव कस्प बिंदुओं पर कोई पापी हिट नहीं पाया गया।
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB", textAlign: "left" }}>
                  <th style={{ padding: "10px" }}>प्रहारक ग्रह</th>
                  <th style={{ padding: "10px" }}>लक्षित भाव (Cusp)</th>
                  <th style={{ padding: "10px" }}>हिट कोण (Orb)</th>
                  <th style={{ padding: "10px" }}>तीव्रता (Severity)</th>
                  <th style={{ padding: "10px" }}>प्रभावित क्षेत्र (Impact)</th>
                  <th style={{ padding: "10px" }}>निवारक वास्तु क्रिया</th>
                </tr>
              </thead>
              <tbody>
                {cuspHits.map((hit, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: "#1F2937" }}>
                      {hit.planetName} ({hit.planetSign} {hit.planetCompoundDeg}°)
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700, color: "#4B5563" }}>
                      भाव {hit.house} ({hit.cuspSign} {hit.cuspCompoundDeg}°)
                    </td>
                    <td style={{ padding: "10px", color: "#D97706", fontWeight: 700 }}>
                      {hit.angleType}° (अंतर: {hit.exactDiff}°)
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          background:
                            hit.severity === "CRITICAL_KILLER"
                              ? "#FEE2E2"
                              : hit.severity === "HIGH_DANGER"
                              ? "#FEF3C7"
                              : "#E0E7FF",
                          color:
                            hit.severity === "CRITICAL_KILLER"
                              ? "#991B1B"
                              : hit.severity === "HIGH_DANGER"
                              ? "#92400E"
                              : "#3730A3",
                        }}
                      >
                        {hit.severity === "CRITICAL_KILLER"
                          ? "180° किलर"
                          : hit.severity === "HIGH_DANGER"
                          ? "90° डेंजर"
                          : `${hit.angleType}°`}
                      </span>
                    </td>
                    <td style={{ padding: "10px", color: "#374151" }}>{hit.impactCategoryHi}</td>
                    <td style={{ padding: "10px", color: "#065F46", fontSize: "12px" }}>
                      {hit.remedyActionHi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── SECTION C: TRANSIT + DASHA CONCURRENCY FILTER ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "20px 24px",
          border: "1px solid rgba(229, 231, 235, 1)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: "#1F2937" }}>
              🌀 सूत्र C: गोचर + दशा समवर्ती फ़िल्टर (Transit-Dasha Concurrency Rule)
            </div>
            <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>
              शास्त्रीय नियम: गोचर में संचरित ग्रह किसी दिशा में अपनी भौतिक वस्तुओं को ज़बरदस्ती तभी खींचता है जब वह जातक की सक्रिय महादशा अथवा अंतर्दशा में सक्रिय हो।
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "12px", background: "rgba(217, 119, 6, 0.12)", color: "#78350F", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
              सक्रिय महादशा: {transitConcurrency.activeMahadasha}
            </span>
            <span style={{ fontSize: "12px", background: "rgba(59, 130, 246, 0.12)", color: "#1D4ED8", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
              सक्रिय अंतर्दशा: {transitConcurrency.activeAntardasha}
            </span>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "#374151", margin: "10px 0 16px 0", fontStyle: "italic" }}>
          {transitConcurrency.summaryHi}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" }}>
          {transitConcurrency.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: "10px",
                padding: "14px 16px",
                border: item.isActiveInDasha ? "1.5px solid #EF4444" : "1px solid #E5E7EB",
                background: item.isActiveInDasha
                  ? "linear-gradient(135deg, rgba(254, 242, 242, 1) 0%, rgba(254, 226, 226, 0.5) 100%)"
                  : "#F9FAFB",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "14px", color: "#1F2937" }}>
                  {item.planet} in {item.transitSign}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: item.isActiveInDasha ? "#DC2626" : "#E5E7EB",
                    color: item.isActiveInDasha ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  {item.isActiveInDasha ? `सक्रिय (${item.dashaRole})` : "सुप्त (Dormant)"}
                </span>
              </div>

              <div style={{ fontSize: "12px", color: "#4B5563" }}>
                📍 प्रभावित दिशा: <strong>{item.directionHi} ({item.directionCode})</strong>
              </div>

              <div style={{ fontSize: "12px", color: "#78350F" }}>
                📦 भौतिक वस्तु आकर्षण: {item.physicalObjectPullHi}
              </div>

              <div style={{ fontSize: "12px", color: item.isActiveInDasha ? "#991B1B" : "#4B5563", marginTop: "2px", lineHeight: "1.4" }}>
                {item.directionalGuidanceHi}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION D: AUTHENTIC LECTURE CASE STUDIES & CLASSICAL Q&A ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "20px 24px",
          border: "1px solid rgba(229, 231, 235, 1)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: 800, color: "#1F2937", marginBottom: "4px" }}>
          📚 विस्तृत केस-स्टडीज और शास्त्रीय प्रश्नोत्तर (Lecture Case Studies & Clinical Q&A)
        </div>
        <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>
          क्लास व्याख्यान में गुरुजी द्वारा हल किए गए वास्तविक क्लाइंट केसेस, उनकी शास्त्रीय डिग्री गणना, भौतिक वस्तु दोष और अचूक परिणाम।
        </div>

        {/* Case Selector Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {MASTER_LECTURE_CASE_STUDIES.map((c) => {
            const isSelected = selectedCaseId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                style={{
                  padding: "7px 13px",
                  borderRadius: "8px",
                  border: isSelected ? "2px solid #78350F" : "1px solid #D1D5DB",
                  background: isSelected ? "#78350F" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#374151",
                  fontSize: "12.5px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {c.nativeName}
              </button>
            );
          })}
        </div>

        {/* Selected Case Study Full Breakdown */}
        {(() => {
          const activeCase =
            MASTER_LECTURE_CASE_STUDIES.find((c) => c.id === selectedCaseId) ||
            MASTER_LECTURE_CASE_STUDIES[0];
          return (
            <div
              style={{
                borderRadius: "12px",
                padding: "20px",
                background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 60%, #FDE68A 100%)",
                border: "1.5px solid rgba(217, 119, 6, 0.4)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#78350F" }}>
                  {activeCase.nativeName}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: "#78350F", color: "#FFFFFF" }}>
                  {activeCase.queryCategoryHi}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginTop: "12px" }}>
                <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "8px", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", marginBottom: "4px" }}>
                    🔴 जातक की समस्या (Problem Statement):
                  </div>
                  <div style={{ fontSize: "13px", color: "#1F2937", lineHeight: "1.5" }}>
                    {activeCase.problemStatementHi}
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "8px", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", marginBottom: "4px" }}>
                    📐 ज्योतिषीय व ज्यामितीय सूत्र (Hit Mechanism):
                  </div>
                  <div style={{ fontSize: "13px", color: "#1F2937", lineHeight: "1.5" }}>
                    {activeCase.astrologicalMechanismHi}
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "12px", color: "#B45309", fontWeight: 700 }}>
                    प्रहार ज्यामिति: {activeCase.hitGeometry.planetOrCusp1} ↔ {activeCase.hitGeometry.planetOrCusp2} ({activeCase.hitGeometry.compoundDegDiff} - {activeCase.hitGeometry.angleType})
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "8px", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", marginBottom: "4px" }}>
                    🏠 घर में भौतिक वास्तु दोष (Physical Vastu Fault):
                  </div>
                  <div style={{ fontSize: "13px", color: "#7F1D1D", lineHeight: "1.5" }}>
                    {activeCase.physicalVastuFaultHi}
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "8px", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#065F46", marginBottom: "4px" }}>
                    ✅ गुरुजी द्वारा दी गई अचूक रेमेडी (Shastric Remedy):
                  </div>
                  <div style={{ fontSize: "13px", color: "#064E3B", lineHeight: "1.5", fontWeight: 600 }}>
                    {activeCase.shastricRemedyHi}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "14px",
                  padding: "10px 14px",
                  background: "#ECFDF5",
                  borderRadius: "8px",
                  borderLeft: "4px solid #10B981",
                  fontSize: "13px",
                  color: "#065F46",
                  fontWeight: 700,
                }}
              >
                🏆 परिणाम (Result Outcome): {activeCase.resultOutcomeHi}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

