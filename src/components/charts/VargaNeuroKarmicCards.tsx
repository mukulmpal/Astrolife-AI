// src/components/charts/VargaNeuroKarmicCards.tsx
// ============================================================================
// ASTROLIFE SHODASHAVARGA SHASTRIC NARRATIVE & NEURO-KARMIC CARDS
// Editorial, human storytelling prose matching PillarNarrativeCard standards:
// - Pure Devnagari Hindi storytelling prose in 3-4 line paragraphs
// - Warm ivory (#FAF8F5) inner story containers with golden border
// - Golden callout highlights (✦ मुख्य संकेत:)
// - High-contrast typography with generous padding (never sticking to borders)
// ============================================================================

"use client";

import React from "react";
import type { VargaNeuroKarmicProfile } from "@/lib/astro-intelligence/varga-neuro-remedies-engine";

interface VargaNeuroKarmicCardsProps {
  profile: VargaNeuroKarmicProfile;
  className?: string;
}

export function VargaNeuroKarmicCards({ profile, className = "" }: VargaNeuroKarmicCardsProps) {
  const isD3 = profile.vargaKey === "D3";
  const isD9 = profile.vargaKey === "D9";
  const kharesh = profile.latentPoints?.kharesh22ndDrekkana;
  const sixtyFourth = profile.latentPoints?.sixtyFourthNavamsha;
  const pushkars = profile.latentPoints?.pushkarNavamshas;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── CARD 1: NATAL D1 INTEGRATED SHASTRIC NARRATIVE ── */}
      <div
        className="bg-[#FFFFFF] border border-[rgba(184,134,11,0.28)] rounded-2xl shadow-[0_4px_24px_rgba(184,134,11,0.06)] transition-all"
        style={{ padding: "20px 24px" }}
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.3)]">
              ✦ षोडशवर्ग महा-विश्लेषण · Shodashavarga Shastric Synthesis
            </span>
            {profile.deityArchetype && (
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#FAF5EB] text-[#8C6D1F] border border-[rgba(184,134,11,0.25)] font-semibold flex items-center gap-1.5">
                <span>⚡ अधिदेवता:</span>
                <strong>{profile.deityArchetype.name}</strong>
              </span>
            )}
          </div>
          <span className="text-xs px-3.5 py-1 rounded-full bg-[#FAF7F2] text-[#4A4238] border border-[rgba(184,134,11,0.2)] font-semibold">
            {profile.vargaKey} लग्न: {profile.vargaLagna}
          </span>
        </div>

        {/* TITLE & NATAL RELATION */}
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1.5 leading-tight">
          {profile.deepExplanation.title}
        </h2>

        <div className="text-xs sm:text-[13px] text-[#8C6D1F] font-semibold mb-3 tracking-wide flex items-center gap-1.5">
          <span>🏛️</span>
          <span>{profile.natalLagnaRelation}</span>
        </div>

        {/* ── INNER STORY CONTAINER (MATCHING PILLAR NARRATIVE CARD) ── */}
        <article
          style={{
            background: "#FAF8F5",
            border: "1px solid rgba(184, 134, 11, 0.2)",
            borderRadius: 12,
            padding: "16px 20px",
            position: "relative",
          }}
        >
          {/* KEY HIGHLIGHT CALLOUT BAR */}
          {profile.deepExplanation.primaryHighlight && (
            <div
              style={{
                marginBottom: 12,
                padding: "10px 14px",
                background: "rgba(184, 134, 11, 0.08)",
                borderLeft: "4px solid #B8860B",
                borderRadius: "0 8px 8px 0",
                fontSize: 13,
                fontWeight: 600,
                color: "#854D0E",
                lineHeight: 1.55,
              }}
            >
              ✦ <strong>मुख्य संकेत:</strong> {profile.deepExplanation.primaryHighlight}
            </div>
          )}

          {/* PARAGRAPHS IN NOVELISTIC DEVNAGARI PROSE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontSize: 14.5,
              lineHeight: 1.7,
              color: "#2A241F",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            {profile.deepExplanation.paragraphs.map((p, idx) => (
              <p key={idx} style={{ margin: 0, textAlign: "justify" }}>
                {p}
              </p>
            ))}
          </div>
        </article>

        {/* Pushkar Navamshas Banner (if any) */}
        {pushkars && pushkars.length > 0 && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderLeft: "4px solid #059669",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ color: "#059669", fontSize: 16, lineHeight: 1, marginTop: 2 }}>✨</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#065F46", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>
                पुष्कर नवांश का अमृत आशीर्वाद (Pushkar Navamsha Regenerative Grace)
              </div>
              <div style={{ fontSize: "13.5px", color: "#047857", lineHeight: 1.65, fontWeight: 500 }}>
                {pushkars.map((pk) => `${pk.planet} in ${pk.navamshaSign}`).join(" · ")} — यह योग घोर विपत्तियों और अप्रत्याशित संकटों के पश्चात भी जीवन को पुनः नव-ऊर्जा और अभूतपूर्व सफलता से भर देने का वरदान देता है।
              </div>
            </div>
          </div>
        )}

        {/* Key Signatures Chips */}
        {profile.deepExplanation.keyHighlights.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-[rgba(184,134,11,0.18)]">
            <span className="text-[11px] uppercase tracking-wider text-[#B8860B] font-bold mr-1">
              मुख्य शास्त्रीय सूत्र:
            </span>
            {profile.deepExplanation.keyHighlights.map((kh, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-md bg-[#FAF5EB] text-[#1A1A1A] border border-[rgba(184,134,11,0.25)] font-semibold"
              >
                {kh}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── CARD 2: VARGA KARMIC WEAKNESS & SUBCONSCIOUS BOTTLENECK ── */}
      <div
        className={`bg-[#FFFFFF] rounded-2xl shadow-[0_4px_24px_rgba(184,134,11,0.06)] border transition-all ${
          profile.karmicWeakness.hasAffliction
            ? "border-[rgba(220,38,38,0.28)]"
            : "border-[rgba(184,134,11,0.28)]"
        }`}
        style={{ padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span
            className={`text-[11px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full border ${
              profile.karmicWeakness.hasAffliction
                ? "bg-[rgba(220,38,38,0.1)] text-[#DC2626] border-[rgba(220,38,38,0.3)]"
                : "bg-[rgba(184,134,11,0.1)] text-[#B8860B] border-[rgba(184,134,11,0.3)]"
            }`}
          >
            ⚠️ कार्मिक अवरोध एवं अवचेतन चुनौतियाँ · Karmic Friction &amp; Bottleneck
          </span>
          {profile.karmicWeakness.afflictedPlanets.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-[rgba(220,38,38,0.08)] text-[#DC2626] font-bold border border-[rgba(220,38,38,0.2)]">
              संवेदनशील ग्रह: {profile.karmicWeakness.afflictedPlanets.join(", ")}
            </span>
          )}
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2 leading-tight">
          {profile.karmicWeakness.psychologicalBottleneckTitle}
        </h3>

        {/* Friction Dynamics Callout */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "rgba(220, 38, 38, 0.04)",
            border: "1px solid rgba(220, 38, 38, 0.22)",
            borderLeft: "4px solid #DC2626",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 11.5, textTransform: "uppercase", fontWeight: 800, color: "#DC2626", letterSpacing: "0.8px", marginBottom: 6 }}>
            ✦ घर्षण व संकोच का शास्त्रीय विश्लेषण (Friction Dynamics)
          </div>
          <div style={{ fontSize: "14px", color: "#991B1B", fontWeight: 500, lineHeight: 1.65 }}>
            {profile.karmicWeakness.frictionSummary}
          </div>
        </div>

        {/* Subconscious Bottleneck Narrative in #FAF8F5 Story Box */}
        <article
          style={{
            background: "#FAF8F5",
            border: "1px solid rgba(184, 134, 11, 0.2)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 14.5,
              lineHeight: 1.7,
              color: "#2A241F",
            }}
          >
            <p style={{ margin: 0, textAlign: "justify" }}>
              {profile.karmicWeakness.psychologicalBottleneckDesc}
            </p>
          </div>
        </article>

        {/* Specialized Critical Karmic Points (Kharesh in D3, 64th Navamsha in D9) */}
        {isD3 && kharesh && (
          <div
            style={{
              marginBottom: 12,
              padding: "14px 18px",
              borderRadius: 12,
              background: "#FAF8F5",
              border: "1px solid rgba(217, 119, 6, 0.25)",
              borderLeft: "4px solid #D97706",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "#92400E", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span>🛡️</span>
              <span>२२वाँ द्रेष्काण (ख्रेश बिंदु) — आनुवंशिक व जैविक संवेदनशीलता</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#4A4238", lineHeight: 1.7, marginBottom: 10, fontWeight: 500 }}>
              अधिपति: <strong>{kharesh.planet}</strong> ({kharesh.sign} राशि, अष्टम भाव)।
              संवेदनशील शारीरिक तंत्र: <strong>{kharesh.organSystem}</strong>।
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FFFFFF", border: "1px solid rgba(217, 119, 6, 0.2)", fontSize: "13.5px", color: "#92400E", lineHeight: 1.65, fontWeight: 500 }}>
              <strong>दैनिक निवारक सुरक्षा विधान:</strong> {kharesh.somaticProtocol}
            </div>
          </div>
        )}

        {isD9 && sixtyFourth && (
          <div
            style={{
              marginBottom: 12,
              padding: "14px 18px",
              borderRadius: 12,
              background: "rgba(225, 29, 72, 0.05)",
              border: "1px solid rgba(225, 29, 72, 0.25)",
              borderLeft: "4px solid #E11D48",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "#9F1239", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚡</span>
              <span>६४वाँ नवांश (संवेदनशील गोचर सुरक्षा ढाल)</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#4A4238", lineHeight: 1.7, marginBottom: 10, fontWeight: 500 }}>
              चंद्र नवांश से चतुर्थ भाव: <strong>{sixtyFourth.sign}</strong>, स्वामी: <strong>{sixtyFourth.planet}</strong> देव।
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FFFFFF", border: "1px solid rgba(225, 29, 72, 0.2)", fontSize: "13.5px", color: "#9F1239", lineHeight: 1.65, fontWeight: 500 }}>
              <strong>संज्ञानात्मक सुरक्षा कवच:</strong> {sixtyFourth.cognitiveShield}
            </div>
          </div>
        )}

        {/* Ancestral DNA Kula Karma Imprint */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            background: "#FAF8F5",
            border: "1px solid rgba(184, 134, 11, 0.25)",
            borderLeft: "4px solid #B8860B",
          }}
        >
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "#B8860B", fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🧬</span>
            <span>पूर्वज कर्म-बीज व कुल परंपरा · Ancestral DNA &amp; Kula Karma Pattern</span>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#2A241F", lineHeight: 1.7, margin: 0, fontWeight: 500, textAlign: "justify" }}>
            {profile.karmicWeakness.ancestralLineagePattern}
          </p>
        </div>
      </div>

      {/* ── CARD 3: SCIENTIFIC & DNA-BASED NEURO-REMEDY PROTOCOL ── */}
      <div
        className="bg-[#FFFFFF] border border-[rgba(34,197,94,0.3)] rounded-2xl shadow-[0_4px_24px_rgba(184,134,11,0.06)] transition-all"
        style={{ padding: "20px 24px" }}
      >
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-[11px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(34,197,94,0.12)] text-[#16A34A] border border-[rgba(34,197,94,0.3)]">
            🧬 वैज्ञानिक एवं डीएनए-आधारित न्यूरो-उपाय · Scientific Neuro-Remedies
          </span>
          <span className="text-xs px-3.5 py-1 rounded-full bg-[#FAF5EB] text-[#8C6D1F] border border-[rgba(184,134,11,0.2)] font-semibold">
            दैनिक व्यवहार पुनर्गठन · Daily Reset
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-3 leading-tight">
          तंत्रिका-तंत्र व पूर्वज लूप विखंडन · Neuro-Somatic Reset ({profile.vargaKey} {profile.vargaName})
        </h3>

        <div className="space-y-3 mb-2">
          {/* Step 1: Ancestral Interruption */}
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: "#FAF8F5",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              borderLeft: "4px solid #B8860B",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 800, color: "#B8860B" }}>
                १. पूर्वज लूप विखंडन · Step 1: Ancestral Loop Interruption
              </span>
              <span style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 20, background: "#FFFFFF", color: "#8C6D1F", border: "1px solid rgba(184, 134, 11, 0.25)", fontWeight: 700 }}>
                Generational Reset
              </span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16.5, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
              पारिवारिक संस्कार विखंडन एवं चेतन शुद्धि (Epigenetic Cleansing)
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#2A241F", lineHeight: 1.7, margin: 0, fontWeight: 500, textAlign: "justify" }}>
              {profile.neuroRemedy.ancestralLoopInterruption}
            </p>
          </div>

          {/* Step 2: Cognitive Re-Wiring */}
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: "#FAF8F5",
              border: "1px solid rgba(37, 99, 235, 0.22)",
              borderLeft: "4px solid #2563EB",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 800, color: "#2563EB" }}>
                २. मानसिक पुनर्गठन · Step 2: Cognitive Re-Wiring
              </span>
              <span style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 20, background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", fontWeight: 700 }}>
                लक्षित अवरोध: {profile.neuroRemedy.cognitiveRewiring.distortionLabel}
              </span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16.5, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
              {profile.neuroRemedy.cognitiveRewiring.techniqueName}
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#2A241F", lineHeight: 1.7, margin: 0, fontWeight: 500, textAlign: "justify" }}>
              {profile.neuroRemedy.cognitiveRewiring.mindsetProtocol}
            </p>
          </div>

          {/* Step 3: Somatic Behavioral Habit */}
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: "#FAF8F5",
              border: "1px solid rgba(22, 163, 74, 0.22)",
              borderLeft: "4px solid #16A34A",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 800, color: "#16A34A" }}>
                ३. देह-व्यवहार क्रिया · Step 3: Somatic Behavioral Protocol
              </span>
              <span style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 20, background: "#ECFDF5", color: "#16A34A", border: "1px solid #A7F3D0", fontWeight: 700 }}>
                तंत्रिका तंत्र प्रभाव
              </span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16.5, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
              {profile.neuroRemedy.somaticBehavioralHabit.habitName}
            </div>
            <div style={{ fontSize: 12.5, color: "#047857", marginBottom: 6, fontWeight: 600 }}>
              {profile.neuroRemedy.somaticBehavioralHabit.neuroMechanism}
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#2A241F", lineHeight: 1.7, margin: 0, fontWeight: 500, textAlign: "justify" }}>
              {profile.neuroRemedy.somaticBehavioralHabit.dailyProtocol}
            </p>
          </div>

          {/* Step 4: Adhidevata Archetype Priming */}
          {profile.neuroRemedy.archetypeAlignment && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                background: "#FAF8F5",
                border: "1px solid rgba(168, 85, 247, 0.25)",
                borderLeft: "4px solid #A855F7",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 800, color: "#9333EA", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>⚡ ४. अधिदेवता संरेखण · Step 4: Adhidevata Archetypal Priming</span>
                  <span>({profile.neuroRemedy.archetypeAlignment.name})</span>
                </div>
                <span style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 20, background: "#FAF5FF", color: "#9333EA", fontWeight: 700, border: "1px solid #E9D5FF" }}>
                  Daily Executive Mode
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#1A1A1A", fontWeight: 500, lineHeight: 1.65 }}>
                  <strong style={{ color: "#9333EA" }}>कार्य निष्पादन मुद्रा:</strong> {profile.neuroRemedy.archetypeAlignment.executiveProtocol}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14.5px", color: "#4A4238", lineHeight: 1.65 }}>
                  <strong style={{ color: "#8C6D1F" }}>चेतन संरेखण:</strong> {profile.neuroRemedy.archetypeAlignment.cognitiveRefocus}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
