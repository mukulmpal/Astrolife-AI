"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  resolvePilgrimagePrescription,
  type PilgrimageEvaluation,
  type JyotirlingaProfile
} from "@/lib/astro-engine/pilgrimage-engine";
import {
  Compass,
  MapPin,
  Sparkles,
  ShieldCheck,
  Flame,
  Clock,
  Heart,
  ChevronDown,
  ChevronUp,
  Activity,
  Music,
  ExternalLink,
  Info
} from "lucide-react";

interface PilgrimageDossierCardProps {
  chart: ChartData | null | undefined;
  compact?: boolean;
}

export function PilgrimageDossierCard({ chart }: PilgrimageDossierCardProps) {
  const [selectedJyotirlinga, setSelectedJyotirlinga] = useState<JyotirlingaProfile | null>(null);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const evaluation: PilgrimageEvaluation = useMemo(() => {
    return resolvePilgrimagePrescription(chart || null);
  }, [chart]);

  const primary = evaluation.primaryJyotirlinga;
  const activeProfile = selectedJyotirlinga || primary;

  return (
    <div
      style={{
        borderRadius: 20,
        background: "linear-gradient(145deg, #FCFBF7 0%, #F6F1EA 100%)",
        border: "1px solid rgba(212, 175, 55, 0.4)",
        boxShadow: "0 12px 36px rgba(44, 34, 20, 0.08)",
        overflow: "hidden",
        marginBottom: 28,
        position: "relative",
      }}
    >
      {/* ── Top Header Ribbon ─────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #8B3A1C 0%, #B85D19 50%, #C97D28 100%)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#FFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            🔱
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", opacity: 0.9 }}>
              ASTROLIFE PILGRIMAGE & DEVASTHANA SANCTUARY
            </div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              द्वादश ज्योतिर्लिंग एवं तीर्थ-यात्रा महा-उपाय
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            background: "rgba(255,255,255,0.15)",
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          40-Day Energy Reset
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* ── 1. Primary Highlight Banner ──────────────────────── */}
        <div
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254, 249, 240, 0.9) 100%)",
            border: "1px solid rgba(200, 150, 40, 0.3)",
            padding: 22,
            marginBottom: 24,
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#9A3412",
                  background: "rgba(234, 88, 12, 0.1)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              >
                <Sparkles size={14} /> आपकी जन्मकुंडली अनुसार सर्वोच्च संस्तुत पावन तीर्थ
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1C1917", margin: "4px 0" }}>
                {primary.hindiTitle}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#78716C", fontSize: 13 }}>
                <MapPin size={15} color="#EA580C" />
                <span>{primary.location}</span>
                <span>•</span>
                <Compass size={15} color="#B45309" />
                <span>{primary.rashiName} · भाव {primary.naturalHouse}</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#78716C", fontWeight: 600 }}>संबंधी ग्रह</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#8B3A1C" }}>
                {primary.governingPlanets.join(" + ")}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: "rgba(255, 237, 213, 0.5)",
              borderLeft: "4px solid #EA580C",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#431407",
              fontWeight: 500,
            }}
          >
            <strong>कुंडली का मुख्य ट्रिगर:</strong> {evaluation.primaryMatchReasonHinglish}
          </div>
        </div>

        {/* ── 2. Deep Dive Dossier on Active Jyotirlinga ───────── */}
        <div
          style={{
            borderRadius: 16,
            background: "#FFF",
            border: "1px solid rgba(220, 210, 190, 0.6)",
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Flame size={20} color="#B85D19" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#292524", margin: 0 }}>
              {activeProfile.hindiTitle} — रहस्य, दर्शन विधि व कर्म मुक्ति
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            {/* Box A: Life Crisis Solved */}
            <div style={{ padding: 14, borderRadius: 12, background: "#FFFBF5", border: "1px solid #FED7AA" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={14} /> किस संकट में जाना है?
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#292524" }}>
                {activeProfile.lifeCrisisTrigger}
              </div>
            </div>

            {/* Box B: Physical Pathology */}
            <div style={{ padding: 14, borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Activity size={14} /> शारीरिक अंग व व्याधि
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#292524" }}>
                {activeProfile.anatomicalPathology}
              </div>
            </div>

            {/* Box C: Sacred Offering */}
            <div style={{ padding: 14, borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Heart size={14} /> क्या सामग्री अर्पित करें?
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#292524" }}>
                {activeProfile.sacredOffering}
              </div>
            </div>

            {/* Box D: Sound & Mantra */}
            <div style={{ padding: 14, borderRadius: 12, background: "#FAF5FF", border: "1px solid #E9D5FF" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6B21A8", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Music size={14} /> बीज मंत्र व ध्वनि आवृत्ति
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#581C87", marginBottom: 4 }}>
                {activeProfile.beejMantra}
              </div>
              <div style={{ fontSize: 12, color: "#6B21A8" }}>
                आवृत्ति: {activeProfile.healingFrequencyHz} Hz • राग: {activeProfile.ragaResonance.join(", ")}
              </div>
            </div>
          </div>

          {/* Deep Lore & Philosophy */}
          <div style={{ padding: 16, borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              📜 तीर्थ का आध्यात्मिक रहस्य (The Karmic Knot Unlocked)
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#475569" }}>
              {activeProfile.karmicKnotDissolved}
            </div>
          </div>
        </div>

        {/* ── 3. The 40-Day Energy Assimilation Rule ──────────── */}
        <div
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
            border: "1px solid rgba(217, 119, 6, 0.35)",
            padding: 20,
            marginBottom: 24,
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              flexShrink: 0,
            }}
          >
            <Info size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: "#78350F", margin: "0 0 6px 0" }}>
              तीर्थ यात्रा के बाद 40-दिवसीय ऊर्जा आत्मसात नियम (The 40-Day Digestion Window)
            </h4>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: "#92400E" }}>
              {evaluation.energyAssimilationRuleHinglish}
            </div>
          </div>
        </div>

        {/* ── 4. Secondary Sanctuaries ────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: "#292524", marginBottom: 12 }}>
            अन्य सहायक पावन तीर्थ (Secondary Pilgrimage Options)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {evaluation.secondaryJyotirlingas.map((sec, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedJyotirlinga(sec.profile)}
                style={{
                  borderRadius: 12,
                  background: activeProfile.id === sec.profile.id ? "#FEF3C7" : "#FFF",
                  border: activeProfile.id === sec.profile.id ? "2px solid #D97706" : "1px solid #E7E5E4",
                  padding: 14,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}>
                    {sec.profile.hindiTitle}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#EA580C", background: "rgba(234, 88, 12, 0.1)", padding: "2px 8px", borderRadius: 4 }}>
                    {sec.profile.rashiName}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "#57534E" }}>
                  {sec.reasonHinglish}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Full 12 Jyotirlinga Explorer (Toggle) ────────── */}
        <div>
          <button
            onClick={() => setShowAllGrid(!showAllGrid)}
            style={{
              width: "100%",
              padding: "12px 18px",
              borderRadius: 10,
              background: "#F5F5F4",
              border: "1px solid #D6D3D1",
              fontSize: 14,
              fontWeight: 700,
              color: "#292524",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <span>द्वादश (12) ज्योतिर्लिंग सम्पूर्ण दर्शन निर्देशिका देखें</span>
            {showAllGrid ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showAllGrid && (
            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 10,
              }}
            >
              {evaluation.allJyotirlingas.map((j) => (
                <div
                  key={j.id}
                  onClick={() => setSelectedJyotirlinga(j)}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: activeProfile.id === j.id ? "#FEF3C7" : "#FFF",
                    border: activeProfile.id === j.id ? "2px solid #D97706" : "1px solid #E7E5E4",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#1C1917" }}>{j.hindiTitle}</div>
                  <div style={{ fontSize: 11, color: "#78716C", marginTop: 2 }}>
                    {j.rashiName} • {j.governingPlanets.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

