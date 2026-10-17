"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  evaluateFunctionalDebilityGemstoneGuard,
  evaluateNadiDebilityPeak
} from "@/lib/astro-engine/functional-debility-guard";
import { evaluateCareerSpecifier } from "@/lib/astro-engine/career-specifier";
import { evaluateMoonDispositorHealthTiming } from "@/lib/astro-engine/transit-health-timing";
import { evaluateTwelfthHouseIntelligence } from "@/lib/astro-engine/twelfth-house-intelligence";
import { evaluateTradingRisk } from "@/lib/astro-engine/trading-risk-guardrail";
import { calculateDivisional } from "@/lib/astro-engine/divisional";
import { SIGN_RULERS, type ZodiacSign } from "@/lib/astro-engine/gemstone";
import {
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Compass,
  Activity,
  Flame,
  Zap,
  Lock,
  Clock,
  AlertTriangle,
  HeartPulse,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  Crosshair
} from "lucide-react";

interface ClinicalPredictiveDossierProps {
  chart: ChartData | null | undefined;
  defaultSection?: "all" | "debility" | "career" | "health" | "twelfth" | "trading";
}

export function ClinicalPredictiveDossier({
  chart,
  defaultSection = "all"
}: ClinicalPredictiveDossierProps) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "debility" | "career" | "health" | "twelfth" | "trading"
  >(defaultSection);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    debility: true,
    career: true,
    health: true,
    twelfth: true,
    trading: true
  });

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── 1. Calculate All 5 Deep Clinical Engines ─────────────────────────────────
  const clinicalData = useMemo(() => {
    if (!chart || !chart.planets) return null;

    try {
      const pls = chart.planets || {};
      const lagnaSign = chart.lagnaRashi || "Scorpio";
      const lagnaNum = typeof chart.lagnaNum === "number" ? chart.lagnaNum : 7;
      const lagnaLon = typeof chart.lagnaLon === "number" ? chart.lagnaLon : lagnaNum * 30 + 15;
      const activeMD = chart.dashas?.find((d) => d.active)?.planet || "Jupiter";

      // 1. Functional Debility & Nadi Zenith
      const nadiDebility = evaluateNadiDebilityPeak(chart);
      const debilityGuards = Object.entries(pls)
        .map(([pName, pData]) => {
          if (!pData?.sign) return null;
          const guard = evaluateFunctionalDebilityGemstoneGuard(pName, pData.sign);
          return { pName, pData, guard };
        })
        .filter((item): item is { pName: string; pData: any; guard: any } => Boolean(item && item.guard.hasFunctionalDebility));

      // 2. D10 Career Specifier
      const allDiv = calculateDivisional(pls as never, lagnaNum, lagnaLon);
      const d10 = allDiv.find((c) => c.key === "D10");
      const d10LagnaNum = typeof d10?.lagnaNum === "number" ? d10.lagnaNum : lagnaNum;

      const signNames: ZodiacSign[] = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
      ];

      const d10SixthSignNum = (d10LagnaNum + 5) % 12;
      const sixthSignName = signNames[d10SixthSignNum] || "Aries";
      const sixthLordPlanet = SIGN_RULERS[sixthSignName] || "Mars";

      const d10PlanetsList = Array.isArray(d10?.planets) ? d10.planets : [];
      const sixthLordInD10 = d10PlanetsList.find((p) => p.planet === sixthLordPlanet);
      const d10SixthLordInLagna = Boolean(sixthLordInD10 && sixthLordInD10.house === 1);

      const rahuInD10 = d10PlanetsList.find((p) => p.planet === "Rahu");
      const saturnInD10 = d10PlanetsList.find((p) => p.planet === "Saturn");
      const ketuInD10 = d10PlanetsList.find((p) => p.planet === "Ketu");

      const d10TenthLordWithRahu = Boolean(rahuInD10 && saturnInD10 && rahuInD10.house === 10 && saturnInD10.house === 10);
      const mercuryKetuConjunction = Boolean(pls.Mercury && pls.Ketu && pls.Mercury.house === pls.Ketu.house);

      const careerSpec = evaluateCareerSpecifier({
        d10SixthLordInLagna,
        d10TenthLordWithRahu,
        d10FourthLordDashaActive: false,
        d10LagnaHasKetu: Boolean(ketuInD10 && ketuInD10.house === 1),
        mercuryKetuConjunction,
        risingNakshatra: pls.Sun?.nakshatra,
        moonNakshatra: pls.Moon?.nakshatra
      });

      // 3. Moon Dispositor Solar Health Timing
      const moonSign = (pls.Moon?.sign || "Taurus") as ZodiacSign;
      const moonDispositorPlanet = SIGN_RULERS[moonSign] || "Venus";
      const dispositorData = pls[moonDispositorPlanet];
      const healthTiming = evaluateMoonDispositorHealthTiming(
        moonSign,
        dispositorData?.sign,
        dispositorData?.degree,
        false,
        Boolean(pls.Mercury?.house === 6 || pls.Saturn?.house === 6),
        Boolean(pls.Mercury?.house === 3),
        Boolean(pls.Mercury?.house === 2 || pls.Saturn?.house === 2)
      );

      // 4. 12th House Sacred Currency (Sampada)
      const fourthHouseSignNum = (lagnaNum + 3) % 12;
      const fourthSignName = signNames[fourthHouseSignNum] || "Aquarius";
      const fourthLordPlanet = SIGN_RULERS[fourthSignName] || "Saturn";
      const twelfthH = evaluateTwelfthHouseIntelligence(
        lagnaSign,
        pls[fourthLordPlanet]?.house || 4,
        activeMD,
        pls.Jupiter?.house || 1,
        6,
        8,
        12
      );

      // 5. Speculative Trading & F&O Circuit Breaker
      const fifthLordAfflicted = Boolean(pls.Rahu?.house === 5 || pls.Saturn?.house === 5);
      const rahuInRiskHouse = Boolean([5, 8, 12].includes(pls.Rahu?.house || 0));
      const moonAfflicted = Boolean(
        [pls.Saturn?.house, pls.Mars?.house, pls.Rahu?.house].includes(pls.Moon?.house)
      );
      const tradingAudit = evaluateTradingRisk({
        fifthLordAfflicted,
        rahuInFifthEighthOrTwelfth: rahuInRiskHouse,
        moonAfflictedBySaturnMarsRahu: moonAfflicted,
        activeDashaEighthOrTwelfth: Boolean(activeMD === "Saturn" || activeMD === "Rahu"),
        hasSubstantialLossesOrDebt: false
      });

      return {
        nadiDebility,
        debilityGuards,
        careerSpec,
        healthTiming,
        twelfthH,
        tradingAudit,
        lagnaSign,
        activeMD
      };
    } catch (err) {
      console.warn("[ClinicalPredictiveDossier] Calculation error caught safely:", err);
      return null;
    }
  }, [chart]);

  if (!chart || !clinicalData) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--app-muted, #78716C)" }}>
        कृपया अपनी जन्म कुंडली लोड करें ताकि पांचों डीप नाड़ी प्रेडिक्टिव इंजन आपकी कुंडली का विश्लेषण कर सकें।
      </div>
    );
  }

  const {
    nadiDebility,
    debilityGuards,
    careerSpec,
    healthTiming,
    twelfthH,
    tradingAudit,
    lagnaSign
  } = clinicalData;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
      {/* ── Filter Pills ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          borderBottom: "1px solid rgba(184, 134, 11, 0.15)"
        }}
      >
        {[
          { id: "all", label: "✨ All 5 Clinical Engines" },
          { id: "debility", label: "👑 Debility Zenith (नीच पीक)" },
          { id: "career", label: "💼 D10 Niche Specifier" },
          { id: "health", label: "🌿 Solar Health Timing" },
          { id: "twelfth", label: "🗝️ 12H Sacred Currency" },
          { id: "trading", label: "🛑 Trading Circuit Breaker" }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveFilter(btn.id as any)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: activeFilter === btn.id ? "1px solid #B8860B" : "1px solid rgba(184, 134, 11, 0.2)",
              background: activeFilter === btn.id ? "linear-gradient(135deg, #FFF9ED 0%, #F5E6CC 100%)" : "#FFFFFF",
              color: activeFilter === btn.id ? "#78350F" : "#57534E",
              whiteSpace: "nowrap",
              boxShadow: activeFilter === btn.id ? "0 2px 8px rgba(184, 134, 11, 0.15)" : "none",
              transition: "all 0.2s"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ENGINE 1: FUNCTIONAL DEBILITY & NADI ZENITH PEAK
      ══════════════════════════════════════════════════════════════ */}
      {(activeFilter === "all" || activeFilter === "debility") && (
        <section
          style={{
            borderRadius: 18,
            background: "linear-gradient(145deg, #FCFBF7 0%, #F6F1EA 100%)",
            border: "1px solid rgba(184, 134, 11, 0.35)",
            boxShadow: "0 8px 24px rgba(44, 34, 20, 0.06)",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            onClick={() => toggleCard("debility")}
            style={{
              padding: "16px 22px",
              background: "linear-gradient(90deg, #78350F 0%, #92400E 100%)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Award size={20} color="#FDE68A" />
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "0.2px" }}>
                  1. Functional Debility Superpower & Nadi Peak Windows (नीच ग्रह का जेनित काल)
                </h3>
                <span style={{ fontSize: 12, opacity: 0.85 }}>
                  The Inversion Law: संघर्ष से निर्मित वास्तविक सामर्थ्य और घातक रत्नों पर रोक
                </span>
              </div>
            </div>
            {expandedCards.debility ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedCards.debility && (
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Human Narrative Paragraph */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderLeft: "4px solid #B8860B",
                  padding: "14px 18px",
                  borderRadius: "0 12px 12px 0",
                  fontSize: 13.5,
                  lineHeight: 1.68,
                  color: "#44403C"
                }}
              >
                <p style={{ margin: 0, marginBottom: 8 }}>
                  <strong>शास्त्रीय दर्शन एवं नाड़ी सत्य:</strong> सामान्य ज्योतिष में नीच ग्रह को देखते ही लोग भयभीत होकर उसका रत्न पहनाने की भूल करते हैं। किंतु परंपरा का सत्य यह है कि उच्च का ग्रह व्यक्ति को बिना प्रयास सुविधा देकर अहंकारी या आलसी बना सकता है, जबकि <strong>नीच ग्रह व्यक्ति के झूठे अहंकार को तोड़कर उसे जमीन से लड़ना सिखाता है</strong>। यही संघर्ष जातक के भीतर एक ऐसी अद्वितीय व्यावहारिक दक्षता (Functional Superpower) पैदा करता है, जो किताबी विद्वानों के पास कभी नहीं होती।
                </p>
                <p style={{ margin: 0 }}>
                  नाड़ी ज्योतिष का नियम है कि नीच ग्रह जीवन भर कष्ट नहीं देता। 36 से 42 वर्ष की आयु के बीच (विशेषकर गुरु के लिए) यह ग्रह 180° उलटकर अपने जीवन का <strong>सर्वोच्च गौरव (Zenith Peak Window)</strong> प्रदान करता है। इस दौरान पारंपरिक रत्न पहनकर इसके रचनात्मक घर्षण को शांत करना सबसे बड़ा दोष बन जाता है।
                </p>
              </div>

              {/* Native's Specific Calculation Cards */}
              {nadiDebility.hasDebilitatedPlanet ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
                  {nadiDebility.evaluatedPlanets.map((ep, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#FFFDF9",
                        border: "1px solid rgba(184, 134, 11, 0.25)",
                        borderRadius: 14,
                        padding: "16px 18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#92400E" }}>
                          ✦ {ep.planet} in {ep.sign} ({ep.degree.toFixed(2)}°)
                        </span>
                        <span
                          style={{
                            padding: "3px 10px",
                            background: "#FEF3C7",
                            color: "#92400E",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          Peak Window: {ep.profile.overallPeakAgeRange}
                        </span>
                      </div>

                      <div style={{ fontSize: 13, color: "#57534E", lineHeight: 1.55 }}>
                        <strong>Exact Sub-Window:</strong> Age {ep.matchedSubWindow} ({ep.subPhaseDetail})
                      </div>

                      {/* Fatal Gemstone Guard */}
                      {(ep.profile?.fatalGemstone || ep.debilityProfile?.fatalGemstone) && (
                        <div
                          style={{
                            background: "#FEF2F2",
                            border: "1px solid #FECACA",
                            borderRadius: 8,
                            padding: "10px 12px",
                            fontSize: 12.5,
                            color: "#991B1B"
                          }}
                        >
                          <strong>🛑 Fatal Gemstone Guard:</strong> DO NOT wear{" "}
                          {ep.profile?.fatalGemstone || ep.debilityProfile?.fatalGemstone} (
                          {ep.profile?.whyGemstoneIsFatalHinglish || ep.debilityProfile?.whyGemstoneIsFatalHinglish || "नीच ग्रह के स्वाभाविक घर्षण को शांत न करें"}
                          )
                        </div>
                      )}

                      {(ep.profile?.safeAlternativeRemedies || ep.debilityProfile?.safeAlternativeRemedies) && (
                        <div style={{ fontSize: 12.5, color: "#166534", background: "#F0FDF4", padding: "8px 12px", borderRadius: 8 }}>
                          <strong>Safe Remedy:</strong>{" "}
                          {ep.profile?.safeAlternativeRemedies?.stoneOrMetal || ep.debilityProfile?.safeAlternativeRemedies?.stoneOrMetal || "Natural substitute metals"} —{" "}
                          {ep.profile?.safeAlternativeRemedies?.actionPractice || ep.debilityProfile?.safeAlternativeRemedies?.actionPractice || "Lifestyle alignment"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#334155",
                    fontSize: 13.5
                  }}
                >
                  <CheckCircle2 size={20} color="#059669" />
                  <div>
                    <strong>संतुलित ग्रह डिग्निटी:</strong> आपकी कुंडली में कोई भी प्रमुख ग्रह पारंपरिक नीच राशि में नहीं है जो रत्न विरोधाभास पैदा करे। आपके ग्रह स्वाभाविक रूप से अपनी ऊर्जा प्रवाहित कर रहे हैं।
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ENGINE 2: D10 CAREER SPECIFIER & CIRCUIT INTELLIGENCE
      ══════════════════════════════════════════════════════════════ */}
      {(activeFilter === "all" || activeFilter === "career") && (
        <section
          style={{
            borderRadius: 18,
            background: "linear-gradient(145deg, #FCFBF7 0%, #F6F1EA 100%)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            boxShadow: "0 8px 24px rgba(30, 58, 138, 0.05)",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            onClick={() => toggleCard("career")}
            style={{
              padding: "16px 22px",
              background: "linear-gradient(90deg, #1E3A8A 0%, #2563EB 100%)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Cpu size={20} color="#BFDBFE" />
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "0.2px" }}>
                  2. D10 Micro-Niche Career Specifier (दशांश ग्रह-सर्किट आर्किटेक्चर)
                </h3>
                <span style={{ fontSize: 12, opacity: 0.85 }}>
                  The Operational Signature: सामान्य करियर प्रेडिक्शन से परे वास्तविक कार्यक्षेत्र की पहचान
                </span>
              </div>
            </div>
            {expandedCards.career ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedCards.career && (
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Human Narrative */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderLeft: "4px solid #2563EB",
                  padding: "14px 18px",
                  borderRadius: "0 12px 12px 0",
                  fontSize: 13.5,
                  lineHeight: 1.68,
                  color: "#334155"
                }}
              >
                <p style={{ margin: 0, marginBottom: 8 }}>
                  <strong>शास्त्रीय दर्शन एवं सूक्ष्म कर्म:</strong> केवल "आप आईटी में जाओगे या व्यापार करोगे" कहना आज के युग में व्यर्थ है। दशांश (D10) चार्ट आत्मा के वास्तविक ऑपरेशनल रोल को निर्धारित करता है। उदाहरण के लिए, जब <strong>6ठे भाव का स्वामी D10 लग्न में</strong> आता है, तो जातक शांत या सुरक्षित 9-टू-5 डेस्क जॉब नहीं कर सकता—उसकी आत्मा तब जागती है जब संकट, बग्स, या इमरजेंसी ऑपरेशन को ठीक करना हो।
                </p>
                <p style={{ margin: 0 }}>
                  इसी प्रकार, <strong>बुध-केतु की युति</strong> सतही बातों से नफरत करती है; वह व्यक्ति को डीप-टेक, कोर आर्किटेक्चर, कंपाइलर, कंपलेक्स डेटा मॉडल्स या गुप्त गणनाओं का मास्टर बनाती है। और राहु का संबंध अंतरराष्ट्रीय सीमाओं को पार कराता है।
                </p>
              </div>

              {/* Aligned Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#64748B", fontWeight: 700, marginBottom: 4 }}>
                    Operational Archetype
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1E3A8A" }}>
                    {careerSpec.primaryTitleHinglish}
                  </div>
                  <div style={{ fontSize: 13, color: "#475569", marginTop: 6, lineHeight: 1.5 }}>
                    {careerSpec.subDomainNicheHinglish}
                  </div>
                </div>

                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#64748B", fontWeight: 700, marginBottom: 4 }}>
                    Workplace Mobility & Location
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginTop: 4, lineHeight: 1.5 }}>
                    {careerSpec.officeMobilityStatusHinglish}
                  </div>
                  {careerSpec.leadershipArchetypeHinglish && (
                    <div style={{ fontSize: 12.5, color: "#2563EB", marginTop: 8 }}>
                      ✦ <strong>Leadership:</strong> {careerSpec.leadershipArchetypeHinglish}
                    </div>
                  )}
                </div>

                {careerSpec.deepTechSignature && (
                  <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 16, gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8", display: "flex", alignItems: "center", gap: 6 }}>
                      <Crosshair size={16} /> Deep-Tech & Backend Architecture Signature
                    </div>
                    <div style={{ fontSize: 13, color: "#1E40AF", marginTop: 4, lineHeight: 1.55 }}>
                      {careerSpec.deepTechSignature}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ENGINE 3: SOLAR TRANSIT HEALTH TIMING (MOON DISPOSITOR)
      ══════════════════════════════════════════════════════════════ */}
      {(activeFilter === "all" || activeFilter === "health") && (
        <section
          style={{
            borderRadius: 18,
            background: "linear-gradient(145deg, #FCFBF7 0%, #F6F1EA 100%)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            boxShadow: "0 8px 24px rgba(6, 95, 70, 0.05)",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            onClick={() => toggleCard("health")}
            style={{
              padding: "16px 22px",
              background: "linear-gradient(90deg, #065F46 0%, #059669 100%)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <HeartPulse size={20} color="#A7F3D0" />
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "0.2px" }}>
                  3. Solar Transit Health Timing (चंद्रमा के डिस्पोजिटर से आरोग्य तिथि)
                </h3>
                <span style={{ fontSize: 12, opacity: 0.85 }}>
                  The Cellular Reboot Law: सूर्य का डिस्पोजिटर-डिग्री गोचर और सटीक रिकवरी की गणना
                </span>
              </div>
            </div>
            {expandedCards.health ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedCards.health && (
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Human Narrative */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderLeft: "4px solid #059669",
                  padding: "14px 18px",
                  borderRadius: "0 12px 12px 0",
                  fontSize: 13.5,
                  lineHeight: 1.68,
                  color: "#1F2937"
                }}
              >
                <p style={{ margin: 0, marginBottom: 8 }}>
                  <strong>शास्त्रीय दर्शन एवं जैविक सत्य:</strong> अक्सर जब कोई बीमारी या ऊर्जा का पतन होता है, तो दवाइयों के बावजूद शरीर ठीक नहीं होता और फिर अचानक एक दिन व्यक्ति पूर्ण स्वस्थ महसूस करता है। इसका कारण यह है कि शरीर का तरल और प्रतिरक्षा तंत्र चंद्रमा के अधीन है, और चंद्रमा का स्वामी (डिस्पोजिटर) उस ऊर्जा का नियंत्रक है।
                </p>
                <p style={{ margin: 0 }}>
                  जब प्राण-दाता <strong>सूर्य गोचर में आपके जन्मकालीन चंद्रमा के डिस्पोजिटर की सटीक डिग्री</strong> पर पहुँचता है, तब कोशिकाओं में प्राण अग्नि पुनः प्रज्वलित होती है और रोग से वास्तविक मुक्ति मिलती है। साथ ही, तीसरे भाव में बुध/शनि के कारण नर्वस बर्नआउट होने पर तांबे का कड़ा और घर के ईशान कोण (North-East) से पुरानी रद्दी हटाना चमत्कारिक राहत देता है।
                </p>
              </div>

              {/* Aligned Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#166534", fontWeight: 700, marginBottom: 4 }}>
                    Natal Moon Dispositor
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#065F46" }}>
                    {healthTiming.dispositorPlanet}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#15803D", marginTop: 4 }}>
                    Governing your lymphatic rhythm & cellular immunity
                  </div>
                </div>

                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#166534", fontWeight: 700, marginBottom: 4 }}>
                    Exact Solar Recovery Window
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#166534", marginTop: 4, lineHeight: 1.5 }}>
                    {healthTiming.exactDegreeRecoveryWindowHinglish}
                  </div>
                </div>

                {healthTiming.nerveBurnoutTalismanHinglish && (
                  <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, gridColumn: "1 / -1", fontSize: 13, color: "#92400E" }}>
                    <strong>🌿 3rd House & Nerve Protection:</strong> {healthTiming.nerveBurnoutTalismanHinglish}
                  </div>
                )}

                {healthTiming.environmentalClutterRemedyHinglish && (
                  <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, gridColumn: "1 / -1", fontSize: 13, color: "#475569" }}>
                    <strong>🧹 Environmental Vastu Alignment:</strong> {healthTiming.environmentalClutterRemedyHinglish}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ENGINE 4: 12TH HOUSE SACRED CURRENCY & INCUBATION PROTOCOL
      ══════════════════════════════════════════════════════════════ */}
      {(activeFilter === "all" || activeFilter === "twelfth") && (
        <section
          style={{
            borderRadius: 18,
            background: "linear-gradient(145deg, #FCFBF7 0%, #F6F1EA 100%)",
            border: "1px solid rgba(147, 51, 234, 0.25)",
            boxShadow: "0 8px 24px rgba(88, 28, 135, 0.05)",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            onClick={() => toggleCard("twelfth")}
            style={{
              padding: "16px 22px",
              background: "linear-gradient(90deg, #581C87 0%, #7E22CE 100%)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={20} color="#E9D5FF" />
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "0.2px" }}>
                  4. 12th House Sacred Currency (12वें भाव की गुप्त संपदा व इनक्यूबेशन)
                </h3>
                <span style={{ fontSize: 12, opacity: 0.85 }}>
                  The Incubation Protocol: 12वें भाव की महा-संपत्ति और ऊर्जा को गोपनीय रखने का नियम
                </span>
              </div>
            </div>
            {expandedCards.twelfth ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedCards.twelfth && (
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Human Narrative */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderLeft: "4px solid #7E22CE",
                  padding: "14px 18px",
                  borderRadius: "0 12px 12px 0",
                  fontSize: 13.5,
                  lineHeight: 1.68,
                  color: "#3B0764"
                }}
              >
                <p style={{ margin: 0, marginBottom: 8 }}>
                  <strong>शास्त्रीय दर्शन एवं गर्भ-गृह का रहस्य:</strong> अधिकांश ज्योतिषी 12वें भाव को केवल "खर्च, हानि, अस्पताल और जेल" का भाव मानकर डरते हैं। किंतु वास्तव में 12वां भाव ब्रह्मांड का <strong>गर्भ-गृह (The Cosmic Womb)</strong> है। कोई भी बड़ी रचना, नई तकनीकी क्रांति, पुस्तक, या महान विचार पहले 12वें भाव के घने अंधेरे में इनक्यूबेट होता है, तभी वह 1ले भाव में जीवित जन्म ले सकता है।
                </p>
                <p style={{ margin: 0 }}>
                  <strong>इनक्यूबेशन नियम (The Sacred Preservation Rule):</strong> जब तक आपकी योजना, सॉफ्टवेयर या शोध पूर्ण न हो जाए, उसे किसी मित्र या सोशल मीडिया पर कभी प्रकट न करें। जो व्यक्ति 12वें भाव की परियोजना को समय से पहले ढिंढोरा पीटता है, उसका कार्य गर्भ में ही नष्ट हो जाता है। शांत रहकर एकांत में निर्माण करना ही इस भाव की परम सिद्धि है।
                </p>
              </div>

              {/* Aligned Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                <div style={{ background: "#FAF5FF", border: "1px solid #E9D5FF", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#6B21A8", fontWeight: 700, marginBottom: 4 }}>
                    Lagna ({lagnaSign}) ➔ 12th House ({twelfthH.sampadaProfile.twelfthSign}) Archetype
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#581C87" }}>
                    {twelfthH.sampadaProfile.archetypeTitleHinglish}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B21A8", marginTop: 6, lineHeight: 1.5 }}>
                    <strong>Hidden Currency:</strong> {twelfthH.sampadaProfile.hiddenCurrencyHinglish}
                  </div>
                </div>

                <div style={{ background: "#FAF5FF", border: "1px solid #E9D5FF", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#6B21A8", fontWeight: 700, marginBottom: 4 }}>
                    The Incubation Directive
                  </div>
                  <div style={{ fontSize: 13, color: "#581C87", lineHeight: 1.55 }}>
                    {twelfthH.sampadaProfile.sacredPreservationGuidanceHinglish}
                  </div>
                </div>

                {twelfthH.fourthLordAlienationInsight && (
                  <div style={{ background: "#FFFFFF", border: "1px solid #DDD6FE", borderRadius: 12, padding: 14, gridColumn: "1 / -1", fontSize: 13, color: "#4C1D95" }}>
                    ✦ <strong>4th Lord in 12th Insight:</strong> {twelfthH.fourthLordAlienationInsight}
                  </div>
                )}

                {twelfthH.viparitaRajaYoga.hasVRY && (
                  <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 12, padding: 14, gridColumn: "1 / -1", fontSize: 13, color: "#92400E" }}>
                    ⚡ <strong>Viparita Raja Yoga Active ({twelfthH.viparitaRajaYoga.type}):</strong> {twelfthH.viparitaRajaYoga.groundZeroWillpowerHinglish}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ENGINE 5: SPECULATIVE TRADING & F&O CIRCUIT BREAKER
      ══════════════════════════════════════════════════════════════ */}
      {(activeFilter === "all" || activeFilter === "trading") && (
        <section
          style={{
            borderRadius: 18,
            background: "linear-gradient(145deg, #FCFBF7 0%, #F6F1EA 100%)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            boxShadow: "0 8px 24px rgba(153, 27, 27, 0.06)",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            onClick={() => toggleCard("trading")}
            style={{
              padding: "16px 22px",
              background: "linear-gradient(90deg, #991B1B 0%, #DC2626 100%)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldAlert size={20} color="#FECACA" />
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "0.2px" }}>
                  5. Speculative Trading & F&O Circuit Breaker (सट्टेबाजी रिस्क सर्किट ब्रेकर)
                </h3>
                <span style={{ fontSize: 12, opacity: 0.85 }}>
                  The Revenge Trading Trap: 5वें-8वें-6ठे भाव का मनोविज्ञान और वित्तीय सुरक्षा
                </span>
              </div>
            </div>
            {expandedCards.trading ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedCards.trading && (
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Human Narrative */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderLeft: "4px solid #DC2626",
                  padding: "14px 18px",
                  borderRadius: "0 12px 12px 0",
                  fontSize: 13.5,
                  lineHeight: 1.68,
                  color: "#450A0A"
                }}
              >
                <p style={{ margin: 0, marginBottom: 8 }}>
                  <strong>शास्त्रीय दर्शन एवं वित्तीय मनोविज्ञान:</strong> आज के समय में लाखों युवा सट्टेबाजी, ऑप्शन ट्रेडिंग (F&O) और इंट्रा-डे में अपनी वर्षों की कमाई गँवा बैठते हैं। ज्योतिष में 5वां भाव सट्टा बुद्धि का है, लेकिन 8वां भाव अचानक बिना मेहनत के धन की लालसा के साथ-साथ अचानक विनाश का है, और 6ठा भाव कर्ज (Margin Debt) का है।
                </p>
                <p style={{ margin: 0 }}>
                  जब राहु 5वें या 8वें में हो और चंद्रमा पापी ग्रहों से पीड़ित हो, तो व्यक्ति विवेक से ट्रेड नहीं करता। वह <strong>"Revenge Trading"</strong> के जाल में फँस जाता है—अर्थात् एक नुकसान होने पर घबराहट में उसे तुरंत रिकवर करने के लिए 5 गुना बड़ा रिस्क लेता है और शून्य हो जाता है। यह इंजन जातक को जुए से रोककर स्थिर, दीर्घकालिक संपदा निर्माण की ओर मोड़ता है।
                </p>
              </div>

              {/* Aligned Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                <div
                  style={{
                    background: tradingAudit.speculativeRuinRisk === "EXTREME_RISK" ? "#FEF2F2" : "#FFFBEB",
                    border: `1px solid ${tradingAudit.speculativeRuinRisk === "EXTREME_RISK" ? "#FECACA" : "#FDE68A"}`,
                    borderRadius: 12,
                    padding: 16
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#991B1B", fontWeight: 700 }}>
                      F&O Speculation Risk Tier
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        background: tradingAudit.speculativeRuinRisk === "EXTREME_RISK" ? "#EF4444" : "#F59E0B",
                        color: "#FFF",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700
                      }}
                    >
                      {tradingAudit.speculativeRuinRisk}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#7F1D1D", marginTop: 8 }}>
                    Revenge Trading Loop: {tradingAudit.isRevengeTradingActive ? "⚠️ HIGHLY ACTIVE" : "🛡️ CONTROLLED"}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#991B1B", marginTop: 6, lineHeight: 1.5 }}>
                    {tradingAudit.psychologicalDiagnosisHinglish}
                  </div>
                </div>

                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#991B1B", fontWeight: 700, marginBottom: 4 }}>
                    Mandatory Action Directive
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#B91C1C", marginTop: 4 }}>
                    {tradingAudit.circuitBreakerAction}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#7F1D1D", marginTop: 6, lineHeight: 1.5 }}>
                    {tradingAudit.mandatoryFinancialGuardrailHinglish}
                  </div>
                </div>

                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 14, gridColumn: "1 / -1", fontSize: 13, color: "#166534" }}>
                  <strong>🎯 Constructive Career Pivot:</strong> {tradingAudit.careerPivotDirectiveHinglish}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

