"use client";

import { useMemo, useState } from "react";
import { EngineShell, EngineHeader } from "@/components/engine/EngineShell";
import { EngineStateCard } from "@/components/engine-state-card";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart, buildChart, type BirthDetails } from "@/lib/user-chart";
import {
  generateAstroTattooAudit,
  GOAL_DEFINITIONS,
  MASTER_PLANET_TATTOO_PALETTE,
  ANATOMICAL_SIGNS,
  type BiologicalGender,
  type LifeGoal,
} from "@/lib/astro-engine/astro-tattoo-engine";
import "@/app/dashboard/shared.css";

const DEMO_BIRTH_DETAILS: BirthDetails = {
  name: "Seeker (Sample Chart)",
  dob: "1995-07-04",
  tob: "12:30",
  city: "Delhi",
  tz: 5.5,
};

const GOAL_OPTIONS: Array<{ key: LifeGoal; icon: string; label: string; labelHindi: string }> = [
  { key: "marriage", icon: "💍", label: "Marriage / Spouse", labelHindi: "शीघ्र विवाह" },
  { key: "health", icon: "🌿", label: "Health / Healing", labelHindi: "आरोग्य व रोगमुक्ति" },
  { key: "wealth", icon: "💰", label: "Liquid Wealth / Cash", labelHindi: "धन लाभ व आवक" },
  { key: "career", icon: "🎯", label: "Career / Status", labelHindi: "करियर व पदोन्नति" },
  { key: "property_buy", icon: "🏡", label: "Buy Property", labelHindi: "मकान/जमीन खरीद" },
  { key: "property_sell", icon: "🤝", label: "Sell Property", labelHindi: "प्रॉपर्टी बिक्री" },
  { key: "education", icon: "🎓", label: "Child Education", labelHindi: "संतान विद्या" },
  { key: "foreign_travel", icon: "✈️", label: "Foreign Settlement", labelHindi: "विदेश सेटलमेंट" },
  { key: "client_attraction", icon: "🧲", label: "Client Magnetism", labelHindi: "क्लाइंट व ब्रांड आकर्षण" },
];

export default function AstroTattooPage() {
  const { chart, birth, loading } = useUserChart();

  // If user chart not available, generate deterministic chart from demo
  const effectiveChart = useMemo(() => {
    if (chart && chart.planets && chart.planets.length > 0) return chart;
    return buildChart(birth && birth.dob ? birth : DEMO_BIRTH_DETAILS);
  }, [chart, birth]);

  // Gender state with auto-detection
  const [gender, setGender] = useState<BiologicalGender>(
    birth?.gender?.toLowerCase() === "female" ? "female" : "male"
  );

  // Active goal
  const [activeGoal, setActiveGoal] = useState<LifeGoal>("marriage");

  // Selected planet override (null = auto from Dasha / Untenanted)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  // Active tab in view: "prescription" | "bodymap" | "reference"
  const [activeTab, setActiveTab] = useState<"prescription" | "bodymap" | "reference">("prescription");

  // Run calculation
  const auditResult = useMemo(() => {
    return generateAstroTattooAudit(effectiveChart, {
      gender,
      activeGoal,
      selectedPlanet: selectedPlanet || undefined,
    });
  }, [effectiveChart, gender, activeGoal, selectedPlanet]);

  if (loading) {
    return (
      <EngineShell>
        <EngineStateCard
          title="AstroLife Astro-Tattoo & Biometric Dot Activation"
          loading
          loadingText="Loading birth chart and calculating KP somatotopic coordinates…"
        />
      </EngineShell>
    );
  }

  const { prescription, currentDasha, chartLagna } = auditResult;
  const activatingColor = prescription.activatingPlanet.color;

  return (
    <EngineShell>
      <EngineHeader
        eyebrow="Astro-Biometrics & Somatotopic Activation"
        title="AstroLife Astro-Tattoo Intelligence"
        subtitle="Individual somatotopic activation through gender-lateralized planetary alignment, untenanted priority, and classical KP house negation/multiplication."
        icon="✨"
        metrics={[
          { label: "Lagna", value: chartLagna.signName, tone: "gold" },
          { label: "Lateralization", value: gender === "female" ? "Left (वाम)" : "Right (दक्षिण)", tone: "blue" },
          { label: "Active Driver", value: prescription.activatingPlanet.name, tone: "green" },
          { label: "Untenanted", value: prescription.activatingPlanet.isUntenanted ? "Yes (100% Direct)" : "Via Star Lord", tone: prescription.activatingPlanet.isUntenanted ? "gold" : "neutral" },
        ]}
      />

      <PremiumFeature feature="Astro-Tattoo & Biometric Activation" enforceLock>
        {/* Interactive Master Controller */}
        <div className="card" style={{ marginBottom: 20, padding: "20px 24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            {/* Gender Toggle */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#B8860B", marginBottom: 8 }}>
                1. Gender Lateralization (स्त्री/पुरुष पार्श्व नियम)
              </div>
              <div style={{ display: "inline-flex", background: "rgba(0,0,0,0.06)", padding: 4, borderRadius: 12, border: "1px solid rgba(184,134,11,0.2)" }}>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    background: gender === "male" ? "linear-gradient(135deg, #B8860B, #8A6008)" : "transparent",
                    color: gender === "male" ? "#FAF7F2" : "#6B635B",
                    transition: "all 0.2s ease",
                  }}
                >
                  👨 Male — Right Side (दायां अंग)
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    background: gender === "female" ? "linear-gradient(135deg, #B8860B, #8A6008)" : "transparent",
                    color: gender === "female" ? "#FAF7F2" : "#6B635B",
                    transition: "all 0.2s ease",
                  }}
                >
                  👩 Female — Left Side (बायां अंग)
                </button>
              </div>
            </div>

            {/* Planet Driver Switcher */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#B8860B", marginBottom: 8 }}>
                2. Activating Planet Driver (सक्रिय ग्रह)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setSelectedPlanet(null)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: selectedPlanet === null ? "#B8860B" : "rgba(184,134,11,0.25)",
                    background: selectedPlanet === null ? "rgba(184,134,11,0.15)" : "#FFFFFF",
                    color: selectedPlanet === null ? "#8A6008" : "#4A4238",
                  }}
                >
                  ✦ Auto ({currentDasha.activePlanet}{currentDasha.isUntenanted ? " · Untenanted" : ""})
                </button>
                {Object.keys(MASTER_PLANET_TATTOO_PALETTE).map(pKey => {
                  const pMeta = MASTER_PLANET_TATTOO_PALETTE[pKey];
                  const isSelected = selectedPlanet === pKey;
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => setSelectedPlanet(pKey)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: isSelected ? pMeta.hexColor : "rgba(0,0,0,0.1)",
                        background: isSelected ? pMeta.hexColor : "#FFFFFF",
                        color: isSelected ? (pKey === "Moon" ? "#0F172A" : "#FFFFFF") : "#4A4238",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span>{pMeta.symbol}</span>
                      <span>{pMeta.nameHindi}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Goal Selector Horizontal Bar */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#B8860B", marginBottom: 10 }}>
              3. Select Desired Manifestation Goal (आप किस कार्य के लिए एक्टिवेशन चाहते हैं?)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {GOAL_OPTIONS.map(opt => {
                const isActive = activeGoal === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setActiveGoal(opt.key)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1.5px solid",
                      borderColor: isActive ? "#B8860B" : "rgba(0,0,0,0.08)",
                      background: isActive ? "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(184,134,11,0.08))" : "#FFFFFF",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: isActive ? "0 4px 14px rgba(184,134,11,0.18)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 20 }}>{opt.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? "#8A6008" : "#1A1A1A" }}>{opt.labelHindi}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6B635B", paddingLeft: 28 }}>{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="tabs" style={{ marginBottom: 20 }}>
          <button
            className={`tab ${activeTab === "prescription" ? "active" : ""}`}
            onClick={() => setActiveTab("prescription")}
          >
            📋 Tattoo Prescription (सटीक परामर्श कार्ड)
          </button>
          <button
            className={`tab ${activeTab === "bodymap" ? "active" : ""}`}
            onClick={() => setActiveTab("bodymap")}
          >
            🧍 Interactive Somatotopic Map (मानव शरीर चक्र)
          </button>
          <button
            className={`tab ${activeTab === "reference" ? "active" : ""}`}
            onClick={() => setActiveTab("reference")}
          >
            📜 12 Signs & 9 Planets Master Table
          </button>
        </div>

        {/* ── TAB 1: PRESCRIPTION CARD ── */}
        {activeTab === "prescription" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {/* Primary Action Card */}
            <div
              className="card"
              style={{
                border: "2px solid rgba(212,175,55,0.45)",
                background: "linear-gradient(135deg, #FFFFFF, rgba(254, 243, 199, 0.25))",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: activatingColor.hexColor,
                  opacity: 0.12,
                  pointerEvents: "none",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                <div>
                  <span className="card-tag">Astro-Biometric Prescription</span>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                    {prescription.goalTitleHindi}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B635B" }}>{prescription.goalTitle}</div>
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: activatingColor.hexColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: activatingColor.planet === "Moon" ? "#0F172A" : "#FFFFFF",
                    fontSize: 26,
                    fontWeight: 700,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  }}
                  title={activatingColor.planet}
                >
                  {activatingColor.symbol}
                </div>
              </div>

              {/* Exact Coordinate Box */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid rgba(184,134,11,0.3)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#B8860B", marginBottom: 6 }}>
                  🎯 Exact Body Location (सटीक शारीरिक स्थान)
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                  {prescription.anatomicalLocation.detailedPlacement}
                </div>
                <div style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.6 }}>
                  राशि: <strong>{prescription.primarySignName} ({prescription.primarySignNumber})</strong> · संबंधित भाव: <strong>{prescription.targetHouseResolved}वां भाव</strong> · अंग पार्श्व: <strong>{prescription.anatomicalLocation.sideHindi}</strong>
                </div>
              </div>

              {/* Ink & Color Specifications */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#6B635B", marginBottom: 4 }}>
                    रंग (Planetary Color)
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: activatingColor.hexColor, border: "1px solid rgba(0,0,0,0.2)" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{activatingColor.colorNameHindi}</span>
                  </div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#6B635B", marginBottom: 4 }}>
                    आकार एवं प्रकार (Size & Type)
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>
                    {prescription.tattooSpecs.size}
                  </div>
                </div>
              </div>

              {/* Special Ritual / Application Instructions */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.03))",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8A6008", marginBottom: 4 }}>
                  ✨ सक्रियण विधि (Activation Medium & Ritual)
                </div>
                <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.6, margin: 0 }}>
                  {prescription.tattooSpecs.specialRitual}
                </p>
                <div style={{ fontSize: 12, color: "#6B635B", marginTop: 6 }}>
                  माध्यम: <strong>{activatingColor.medium}</strong>
                </div>
              </div>

              {/* Untenanted Planet & KP Logic */}
              <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.6, background: "#FFFFFF", padding: 12, borderRadius: 10, border: "1px dashed rgba(0,0,0,0.15)" }}>
                <strong>KP Astrological Logic:</strong> {prescription.activatingPlanet.reasoning} {prescription.houseSignificatorsExplanation}
              </div>
            </div>

            {/* Zero Collateral Impact & Shastric Insights */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Family Safety Box */}
              <div
                className="card"
                style={{
                  background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))",
                  border: "1.5px solid rgba(34,197,94,0.35)",
                  padding: "20px 22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>🛡️</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#166534" }}>
                    Zero Collateral Family Impact (पारिवारिक सुरक्षा)
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#14532D", lineHeight: 1.65, margin: 0 }}>
                  {prescription.noCollateralImpactAssurance} जब हम घर के वास्तु में वस्तु रखते हैं या दिशा बदलते हैं, तो पूरे परिवार पर उसका असर होता है। लेकिन शारीरिक टैटू केवल आपकी अपनी ऊर्जा पर असर करता है—घर के बच्चों, माता-पिता या जीवनसाथी पर इसका कोई प्रतिकूल प्रभाव नहीं पड़ता।
                </p>
              </div>

              {/* Temporary vs Permanent Advice */}
              <div className="card" style={{ padding: "20px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>
                  ⏱️ स्थायी टैटू बनाम अस्थायी डॉट (Which one to use?)
                </div>
                <ul style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
                  <li>
                    <strong>अस्थायी डॉट (Temporary Marker/Paste)</strong>: त्वरित परिणाम (Immediate Action) हेतु। किसी भी स्किन-फ्रेंडली मार्कर पेन से बनाएं और प्रतिदिन स्नान के बाद उसे दोबारा डार्क कर लें। जब कार्य सिद्ध हो जाए, तो इसे लगाना बंद कर दें।
                  </li>
                  <li>
                    <strong>स्थायी टैटू (Permanent Ink)</strong>: केवल तब बनवाएं जब संबंधित ग्रह की लंबी महादशा चल रही हो (जैसे शुक्र की 20 वर्ष, राहु की 18 वर्ष, या शनि की 19 वर्ष)।
                  </li>
                </ul>
              </div>

              {/* Special Precaution for Foreign Travel if applicable */}
              {activeGoal === "foreign_travel" && (
                <div
                  className="card"
                  style={{
                    background: "rgba(239,68,68,0.06)",
                    border: "1.5px solid rgba(239,68,68,0.3)",
                    padding: "16px 20px",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>
                    ⚠️ विदेश सेटलमेंट हेतु विशेष चेतावनी:
                  </div>
                  <p style={{ fontSize: 12.5, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>
                    विदेश में स्थायी निवास (PR/Settlement) के लिए केवल 3, 9 और 12वें भाव को सक्रिय करें। <strong>11वें भाव को कदापि सक्रिय न करें</strong>, क्योंकि 11वां भाव 12वें भाव का व्यय (Negation) करके आपको वापस स्वदेश लौटा देगा!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: INTERACTIVE BODY MAP ── */}
        {activeTab === "bodymap" && (
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
                  मानव शरीर चक्र एवं 12 राशियों का कायिक वितरण (Somatotopic Silhouette)
                </div>
                <div style={{ fontSize: 13, color: "#6B635B" }}>
                  सक्रिय पार्श्व: <strong>{gender === "female" ? "बायां भाग (Left Side)" : "दायां भाग (Right Side)"}</strong> · लक्ष्य अंग: <strong>{prescription.anatomicalLocation.bodyPartHindi} ({prescription.primarySignName})</strong>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#6B635B" }}>सक्रिय रंग:</span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: activatingColor.hexColor,
                    color: activatingColor.planet === "Moon" ? "#0F172A" : "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {activatingColor.nameHindi} ({activatingColor.colorNameHindi})
                </span>
              </div>
            </div>

            {/* Stylized Anatomical Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
              {ANATOMICAL_SIGNS.map(sign => {
                const isTargetSign = sign.signNumber === prescription.primarySignNumber;
                return (
                  <div
                    key={sign.signNumber}
                    style={{
                      border: "1.5px solid",
                      borderColor: isTargetSign ? activatingColor.hexColor : "rgba(0,0,0,0.08)",
                      background: isTargetSign ? "linear-gradient(135deg, rgba(212,175,55,0.22), #FFFFFF)" : "#FFFFFF",
                      borderRadius: 14,
                      padding: "16px",
                      position: "relative",
                      boxShadow: isTargetSign ? `0 6px 20px ${activatingColor.hexColor}40` : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isTargetSign && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: activatingColor.hexColor,
                          color: activatingColor.planet === "Moon" ? "#0F172A" : "#FFFFFF",
                        }}
                      >
                        Active Dot Target 🎯
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: isTargetSign ? activatingColor.hexColor : "rgba(0,0,0,0.06)",
                          color: isTargetSign ? (activatingColor.planet === "Moon" ? "#0F172A" : "#FFFFFF") : "#4A4238",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {sign.signNumber}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>
                        {sign.signNameHindi} ({sign.signName})
                      </span>
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 600, color: isTargetSign ? "#8A6008" : "#1A1A1A", marginBottom: 4 }}>
                      {sign.primaryBodyPartHindi}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#6B635B", lineHeight: 1.5 }}>
                      {sign.primaryBodyPart}
                    </div>
                    <div style={{ fontSize: 11, color: "#8A6008", marginTop: 8, fontStyle: "italic" }}>
                      📍 {sign.exactPlacementHint}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: COMPLETE REFERENCE ── */}
        {activeTab === "reference" && (
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>
              नवग्रह रंग, माध्यम एवं शास्त्रीय नियम तालिका (Planetary Inks & Sacred Mediums)
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(184,134,11,0.08)", borderBottom: "1.5px solid rgba(184,134,11,0.25)", textAlign: "left" }}>
                    <th style={{ padding: "12px 14px", color: "#8A6008" }}>ग्रह (Planet)</th>
                    <th style={{ padding: "12px 14px", color: "#8A6008" }}>रंग (Color)</th>
                    <th style={{ padding: "12px 14px", color: "#8A6008" }}>प्रतीक (Sigil)</th>
                    <th style={{ padding: "12px 14px", color: "#8A6008" }}>उपयुक्त माध्यम (Medium)</th>
                    <th style={{ padding: "12px 14px", color: "#8A6008" }}>विशेष शास्त्रीय निर्देश (Special Ritual)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(MASTER_PLANET_TATTOO_PALETTE).map((pKey, i) => {
                    const p = MASTER_PLANET_TATTOO_PALETTE[pKey];
                    return (
                      <tr key={pKey} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "#FFFFFF" : "rgba(0,0,0,0.01)" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#1A1A1A" }}>
                          {p.nameHindi} ({p.planet})
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: p.hexColor, border: "1px solid rgba(0,0,0,0.2)" }} />
                            <span>{p.colorNameHindi}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: 18, fontWeight: 700 }}>
                          {p.symbol}
                        </td>
                        <td style={{ padding: "12px 14px", color: "#4A4238" }}>
                          {p.medium}
                        </td>
                        <td style={{ padding: "12px 14px", color: "#6B635B", lineHeight: 1.5 }}>
                          {p.specialApplicationRitual}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PremiumFeature>
    </EngineShell>
  );
}

