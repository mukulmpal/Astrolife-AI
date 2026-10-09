"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  evaluateTransitNakshatraRemedy,
  type TransitNakshatraEvaluationResult,
} from "@/lib/astro-engine/transit-nakshatra-remedies";
import {
  Sparkles,
  HeartHandshake,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sprout,
  Apple,
  HandCoins,
  ShieldAlert,
  Compass,
} from "lucide-react";

interface TransitShivlingStoryCardProps {
  chart: ChartData | null | undefined;
  targetDate?: Date;
}

export function TransitShivlingStoryCard({
  chart,
  targetDate,
}: TransitShivlingStoryCardProps) {
  const [expandedStory, setExpandedStory] = useState<boolean>(true);

  const data: TransitNakshatraEvaluationResult | null = useMemo(() => {
    return evaluateTransitNakshatraRemedy(chart, targetDate);
  }, [chart, targetDate]);

  if (!data) return null;

  const mdRemedy = data.shivlingRemedy;
  const adRemedy = data.antardashaShivlingRemedy;
  const dist = data.distanceAnalysis;

  return (
    <div
      style={{
        borderRadius: 22,
        background: "linear-gradient(150deg, #FBF8F3 0%, #F5EDE4 100%)",
        border: "1px solid rgba(184, 134, 11, 0.35)",
        boxShadow: "0 14px 40px rgba(44, 34, 20, 0.09)",
        overflow: "hidden",
        marginBottom: 28,
        color: "#2C2214",
      }}
    >
      {/* ── Top Ribbon (Mentor Salutation) ───────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #1C1917 0%, #2E2823 100%)",
          color: "#FAF7F2",
          padding: "18px 26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #D4AF37, #B8860B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1A1A1A",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            🕉️
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: "#E5C158",
                fontWeight: 700,
              }}
            >
              Shiva Purana &amp; Classical Tantrik Discourse
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                fontFamily: "serif",
                color: "#FFFFFF",
              }}
            >
              महादशा-अंतर्दशा गोचर व शिवलिंग के २७ दिव्य उपचार
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              background: "rgba(229, 193, 88, 0.18)",
              border: "1px solid rgba(229, 193, 88, 0.4)",
              color: "#E5C158",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            तारा #{data.taraNumber}: {data.taraName}
          </span>
          <button
            onClick={() => setExpandedStory(!expandedStory)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 8,
              color: "#FFFFFF",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {expandedStory ? "कथा संक्षेप" : "पूरी कथा पढ़ें"}
            {expandedStory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ── Main Body ───────────────────────────────────────────── */}
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* Paragraph 1: Aamne Saamne Baithne Wali Baat */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: "rgba(255, 255, 255, 0.75)",
            border: "1px solid rgba(184, 134, 11, 0.2)",
            lineHeight: 1.8,
            fontSize: 14.5,
            color: "#382D20",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#875C06", fontWeight: 700, fontSize: 13 }}>
            <Sparkles size={16} />
            <span>सामने बैठकर समझने वाली बात (The Living Philosophy)</span>
          </div>
          <p style={{ margin: 0 }}>
            आप आराम से बैठिए। ज्योतिष केवल ग्रहों की चाल नहीं, बल्कि कुदरत का मौसम है। आपकी कुंडली में इस समय मुख्य अध्याय के स्वामी (महादशा नाथ) <strong>{data.activeDashaLord}</strong> हैं, और उनके साथ आंतरिक गति को संभालने वाले (अंतर्दशा नाथ) <strong>{data.activeAntardashaLord}</strong> हैं। आज के दिन आकाश में महादशा नाथ <strong>{data.transitSign}</strong> राशि में <strong>{data.transitNakshatra}</strong> नक्षत्र (क्रम #{data.transitNakshatraNumber}) से गुज़र रहे हैं। जब आप सामान्य ग्रह का उपाय करते हैं तो असर धीमा हो सकता है, लेकिन जब आप उस नक्षत्र के अनुसार शिवलिंग का उपचार करते हैं, तो कुदरत का वह बंद दरवाज़ा कुछ ही घंटों में खुल जाता है।
          </p>
        </div>

        {/* ── DUAL SHIVLING CARDS: MAHADASHA + ANTARDASHA ──────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
          
          {/* Card A: Mahadasha Lord Shivling Upachara */}
          <div
            style={{
              padding: 22,
              borderRadius: 18,
              background: "linear-gradient(145deg, #FFFFFF 0%, #FFFDF8 100%)",
              border: "2px solid rgba(184, 134, 11, 0.35)",
              boxShadow: "0 6px 20px rgba(184, 134, 11, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    color: "#875C06",
                    fontWeight: 800,
                  }}
                >
                  १. महादशा नाथ का मुख्य गोचर उपचार (Primary Key)
                </span>
                <h4 style={{ margin: "4px 0 0 0", fontSize: 18, fontFamily: "serif", color: "#1C1917" }}>
                  {data.activeDashaLord} in {data.transitNakshatra}
                </h4>
              </div>
              <span
                style={{
                  background: "#FAF5EB",
                  color: "#875C06",
                  border: "1px solid rgba(184, 134, 11, 0.3)",
                  borderRadius: 12,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                उपचार #{mdRemedy.upacharaNumber} of 27
              </span>
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#875C06",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>🕉️ {mdRemedy.hindiTitle}</span>
            </div>

            <div style={{ fontSize: 13, color: "#5C4F40", lineHeight: 1.6 }}>
              <strong>सामग्री / विधि:</strong> {mdRemedy.itemOrOffering}
            </div>

            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#382D20" }}>
              {mdRemedy.procedureNarrativeHinglish}
            </p>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.18)",
                fontSize: 12,
                color: "#6B5A47",
                lineHeight: 1.5,
              }}
            >
              <strong>फल व मर्म:</strong> {mdRemedy.significanceHinglish}
            </div>
          </div>

          {/* Card B: Antardasha Lord Shivling Upachara */}
          {adRemedy && (
            <div
              style={{
                padding: 22,
                borderRadius: 18,
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                      color: "#1E40AF",
                      fontWeight: 800,
                    }}
                  >
                    २. अंतर्दशा नाथ का सूक्ष्म गोचर उपचार (Sub-Period Focus)
                  </span>
                  <h4 style={{ margin: "4px 0 0 0", fontSize: 18, fontFamily: "serif", color: "#1C1917" }}>
                    {data.activeAntardashaLord} in {data.antardashaTransitNakshatra}
                  </h4>
                </div>
                <span
                  style={{
                    background: "#EFF6FF",
                    color: "#1E40AF",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: 12,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  उपचार #{adRemedy.upacharaNumber} of 27
                </span>
              </div>

              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1E40AF",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>✨ {adRemedy.hindiTitle}</span>
              </div>

              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                <strong>सामग्री / विधि:</strong> {adRemedy.itemOrOffering}
              </div>

              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#1E293B" }}>
                {adRemedy.procedureNarrativeHinglish}
              </p>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#F8FAFC",
                  border: "1px solid rgba(59, 130, 246, 0.15)",
                  fontSize: 12,
                  color: "#334155",
                  lineHeight: 1.5,
                }}
              >
                <strong>दैनिक प्रभाव:</strong> महादशा आपके जीवन का बड़ा ढांचा तय करती है, लेकिन दैनिक जीवन की अड़चनों को सुलझाने की चाबी अंतर्दशा के नक्षत्र उपचार में होती है।
              </div>
            </div>
          )}
        </div>

        {/* ── Tak Yog Alert (6/8 MD-AD Distance) ─────────────────── */}
        {dist && (
          <div
            style={{
              padding: 18,
              borderRadius: 14,
              background: dist.isTakYog ? "rgba(239, 68, 68, 0.08)" : "rgba(34, 197, 94, 0.08)",
              border: dist.isTakYog ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            {dist.isTakYog ? (
              <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
            ) : (
              <CheckCircle2 size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
            )}
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: dist.isTakYog ? "#991B1B" : "#166534",
                  marginBottom: 4,
                }}
              >
                {dist.isTakYog ? "⚠️ महादशा और अंतर्दशा का 'टक योग' (६/८ फासला)" : "✦ महादशा और अंतर्दशा की अनुकूलता"}
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: dist.isTakYog ? "#7F1D1D" : "#14532D" }}>
                {dist.impactDescriptionHinglish}
              </p>
              {dist.takYogRemedyHinglish && (
                <div style={{ marginTop: 6, fontSize: 12.5, fontWeight: 600, color: "#991B1B" }}>
                  💡 निवारक उपाय: {dist.takYogRemedyHinglish}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Sachi Kahani: Mithun Lagna Case Study (#25 Mantra Pushpam) ─ */}
        {expandedStory && (
          <div
            style={{
              padding: 20,
              borderRadius: 16,
              background: "linear-gradient(135deg, #FAF5EB 0%, #F5EFEB 100%)",
              border: "1px solid rgba(184, 134, 11, 0.3)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#875C06", fontWeight: 700, fontSize: 14 }}>
              <span>📜 व्याख्यान की सच्ची घटना: चार मंजिला इमारत और २५वां उपचार (Mantra Pushpam)</span>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: "#382D20" }}>
              {data.geminiCaseStudyHinglish}
            </p>
            <div
              style={{
                fontSize: 12.5,
                color: "#6B5A47",
                borderLeft: "3px solid #875C06",
                paddingLeft: 12,
                marginTop: 4,
              }}
            >
              <strong>सीख:</strong> जब आप बिना किसी शंका के नक्षत्र के सटीक उपचार पर विश्वास करके कदम उठाते हैं, तो वर्षो से फंसी रुकावटें भी तुरंत मार्ग दे देती हैं।
            </div>
          </div>
        )}

        {/* ── 6th vs 12th House Belief Principle ──────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {/* 6th House Card */}
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: "#FFFFFF",
              border: "1px solid rgba(34, 197, 94, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#15803D", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
              <Sprout size={16} />
              <span>६ठे भाव का नियम: अंधा विश्वास व पौधे</span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: "#374151" }}>
              {data.beliefGuidanceHinglish.house6MessageHinglish}
            </p>
            {data.house6PlantRemedies.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#15803D", fontWeight: 600 }}>
                आपके लिए पौधा: {data.house6PlantRemedies.map((p) => `${p.planet} (${p.plantName})`).join(", ")}
              </div>
            )}
          </div>

          {/* 12th House Card */}
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: "#FFFFFF",
              border: "1px solid rgba(239, 68, 68, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#B91C1C", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
              <ShieldAlert size={16} />
              <span>१२वें भाव का नियम: कभी भरोसा मत करो, दान करो</span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: "#374151" }}>
              {data.beliefGuidanceHinglish.house12MessageHinglish}
            </p>
            {data.house12DonationRemedies.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#B91C1C", fontWeight: 600 }}>
                आपके लिए दान: {data.house12DonationRemedies.map((d) => `${d.planet} (${d.targetCategory})`).join(", ")}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

