// src/components/remedies/CorePlanetRemediesDossier.tsx
// AstroLife — Authentic Core Planet Remedies, Saturn Growth Radar & Property Timing Dossier
// Derived verbatim from the Master Oral Lecture Transcript.
// Renders human storytelling narrative ("aamne-saamne baithkar samjhana") with real dosage formulas.

"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  MASTER_PLANET_REGISTRY,
  evaluateCorePlanetRemedy,
  getMoonSharingGuide,
  evaluateConjunctionInHouse,
  resolveContextualRemedies,
  type PlanetId,
  type EvaluatedCorePlanetRemedy,
  type MoonSharingGuidance,
  type ContextualRemedyResponse
} from "@/lib/astro-engine/core-planet-remedies";
import {
  buildMasterTransitRadarDossier,
  type MasterTransitRadarReport
} from "@/lib/astro-engine/property-transit-predictor";
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Home,
  Compass,
  HeartHandshake,
  TrendingUp,
  Flame,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Gift,
  Heart,
  Briefcase,
  Activity,
  Zap
} from "lucide-react";

interface CorePlanetRemediesDossierProps {
  chart: ChartData | null | undefined;
  compact?: boolean;
}

function ContextualDomainCard({ response }: { response: ContextualRemedyResponse | null }) {
  if (!response) return null;
  return (
    <div>
      {/* Primary Narrative & Rationale Banner */}
      <div
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #FFFDF8 0%, #FDF8EE 100%)",
          border: "1px solid rgba(200, 160, 48, 0.4)",
          padding: 22,
          marginBottom: 20,
          boxShadow: "0 4px 18px rgba(184, 134, 11, 0.06)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1F2937", fontFamily: "serif" }}>
            {response.titleHinglish}
          </h3>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "rgba(200, 160, 48, 0.15)", color: "#875C06", border: "1px solid rgba(200, 160, 48, 0.3)" }}>
            {response.subtitleHinglish}
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, margin: 0 }}>
          {response.primaryRationaleHinglish}
        </p>
      </div>

      {/* Activated Planets Section */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: "#875C06", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          ✦ Activated Planets &amp; Bhava Sthiti ({response.activatedPlanets.length} Grah Sakriya)
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {response.activatedPlanets.map((item) => (
            <div
              key={item.planet}
              style={{
                borderRadius: 14,
                background: "#FFFFFF",
                border: item.isFavorable ? "1px solid rgba(34, 197, 94, 0.35)" : "1px solid rgba(239, 68, 68, 0.35)",
                padding: 16,
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ fontSize: 15, color: "#111827" }}>
                  {item.planet} · <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{item.roleHinglish}</span>
                </strong>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: item.isFavorable ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: item.isFavorable ? "#059669" : "#DC2626"
                  }}
                >
                  {item.isFavorable ? "✦ Shubh (Power-Up)" : "⚠️ Peedit (Mitigate)"}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "#4B5563", marginBottom: 8, lineHeight: 1.5 }}>
                {item.placementSummary}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: item.isFavorable ? "#065F46" : "#991B1B",
                  background: item.isFavorable ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
                  padding: "6px 10px",
                  borderRadius: 6
                }}
              >
                {item.isFavorable
                  ? `✓ Ratna: ${item.evaluation.gemstoneAdvice.stoneDetails?.name || "Supportive Stone"}`
                  : `⛔ ${item.evaluation.gemstoneAdvice.strictWarning}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Classical Secret Formulas Grid */}
      {response.specialFormulas.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: "#1F2937", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Flame size={16} color="#DC2626" />
            <span>Transcript Classical Secret Formulas &amp; Micro-Totke</span>
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            {response.specialFormulas.map((f, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 14,
                  background: "#FFFFFF",
                  border: "1px solid rgba(200, 160, 48, 0.35)",
                  padding: 18,
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h5 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#111827" }}>{f.title}</h5>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: "rgba(200, 160, 48, 0.15)", color: "#875C06" }}>
                    {f.badge}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, marginBottom: 10 }}>
                  {f.esotericSecretHinglish}
                </p>
                <div style={{ background: "rgba(200, 160, 48, 0.06)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#374151", marginBottom: 8, lineHeight: 1.5 }}>
                  <div><strong>Samagri (Items):</strong> {f.itemsRequired.join(", ")}</div>
                  <div><strong>Nirdharit Matra:</strong> {f.exactDosage}</div>
                  <div><strong>Samay / Muhurat:</strong> {f.timing}</div>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#059669" }}>
                  ✦ Anubhoot Parinam: {f.expectedResultHinglish}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings & Safe Practices */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {response.strictWarnings.length > 0 && (
          <div style={{ borderRadius: 12, background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#DC2626", fontWeight: 700, fontSize: 12 }}>
              <AlertTriangle size={15} />
              <span>STRICT WARNINGS (Kya Nahi Karna)</span>
            </div>
            {response.strictWarnings.map((w, i) => (
              <div key={i} style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.5, marginBottom: 4 }}>
                • {w}
              </div>
            ))}
          </div>
        )}

        {response.safePractices.length > 0 && (
          <div style={{ borderRadius: 12, background: "rgba(34, 197, 94, 0.06)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#059669", fontWeight: 700, fontSize: 12 }}>
              <CheckCircle2 size={15} />
              <span>SAFE PRACTICES (Shubh Karmic Upay)</span>
            </div>
            {response.safePractices.map((p, i) => (
              <div key={i} style={{ fontSize: 12, color: "#065F46", lineHeight: 1.5, marginBottom: 4 }}>
                • {p}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CorePlanetRemediesDossier({
  chart,
  compact = false
}: CorePlanetRemediesDossierProps) {
  const [activeTab, setActiveTab] = useState<
    | "core_dasha"
    | "property_domain"
    | "marriage_domain"
    | "career_domain"
    | "health_domain"
    | "emergency_domain"
    | "saturn_growth"
    | "property_radar"
    | "moon_sanctuary"
    | "bnn_conjunctions"
    | "all_9_planets"
  >("core_dasha");
  const [expanded, setExpanded] = useState(!compact);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId>("Sun");

  // 1. Identify Active Dasha & Antardasha Lord
  const activeMD = chart?.dashas?.find((d) => d.active) ?? chart?.dashas?.[0];
  const activeAD = chart?.antardasha?.find((a) => a.active);
  const dashaLordName = (activeMD?.planet || "Jupiter") as PlanetId;
  const antardashaLordName = activeAD?.planet || "Saturn";

  // 2. Evaluated Core Planet Remedy for Active Dasha
  const evaluatedActivePlanet: EvaluatedCorePlanetRemedy | null = useMemo(() => {
    return evaluateCorePlanetRemedy(dashaLordName, chart);
  }, [dashaLordName, chart]);

  // 3. Evaluated Core Planet Remedy for Selected Planet
  const evaluatedSelectedPlanet: EvaluatedCorePlanetRemedy | null = useMemo(() => {
    return evaluateCorePlanetRemedy(selectedPlanet, chart);
  }, [selectedPlanet, chart]);

  // 4. Contextual Life-Domain Remedy Resolutions
  const contextualProperty = useMemo(() => resolveContextualRemedies("property", chart), [chart]);
  const contextualMarriage = useMemo(() => resolveContextualRemedies("marriage", chart), [chart]);
  const contextualCareer = useMemo(() => resolveContextualRemedies("career", chart), [chart]);
  const contextualHealth = useMemo(() => resolveContextualRemedies("health", chart), [chart]);
  const contextualEmergency = useMemo(() => resolveContextualRemedies("emergency", chart), [chart]);

  // 5. Moon Sharing Guidance
  const moonHouse = chart?.planets?.Moon?.house || 4;
  const moonSign = chart?.planets?.Moon?.sign || "Cancer";
  const moonGuide: MoonSharingGuidance = useMemo(() => {
    return getMoonSharingGuide(moonHouse, moonSign);
  }, [moonHouse, moonSign]);

  // 6. Master Transit Radar Report
  const transitRadar: MasterTransitRadarReport | null = useMemo(() => {
    return buildMasterTransitRadarDossier(chart);
  }, [chart]);

  if (!chart || !chart.planets) return null;

  return (
    <div
      style={{
        borderRadius: 20,
        background: "linear-gradient(145deg, #FAF7F2 0%, #F5EFEB 100%)",
        border: "1px solid rgba(200, 160, 48, 0.4)",
        boxShadow: "0 16px 40px rgba(44, 34, 20, 0.08)",
        overflow: "hidden",
        marginBottom: 28,
        position: "relative"
      }}
    >
      {/* ── Top Header Ribbon ─────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #1C1917 0%, #292524 100%)",
          color: "#FAF7F2",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c8a030, #e5c158)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1A1A1A",
              fontWeight: 800,
              fontSize: 20
            }}
          >
            ✦
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#e5c158",
                fontWeight: 700
              }}
            >
              Master Oral Lecture Engine ✦ Shaktikaran, Daan &amp; Gochar
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                fontFamily: "serif",
                color: "#FFFFFF"
              }}
            >
              {dashaLordName} Mahadasha · {antardashaLordName} Antardasha
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {evaluatedActivePlanet && (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: evaluatedActivePlanet.isFavorable
                  ? "rgba(34, 197, 94, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
                border: evaluatedActivePlanet.isFavorable
                  ? "1px solid rgba(34, 197, 94, 0.5)"
                  : "1px solid rgba(239, 68, 68, 0.5)",
                color: evaluatedActivePlanet.isFavorable ? "#86efac" : "#fca5a5",
                fontSize: 12,
                fontWeight: 700
              }}
            >
              {evaluatedActivePlanet.isFavorable
                ? "✦ Favorable (Power-Up / Gemstone)"
                : "⚠️ Afflicted (Mitigate / Never Stone)"}
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
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
              gap: 4
            }}
          >
            {expanded ? "Chhota Karein" : "Poora Padhein"}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(200, 160, 48, 0.25)",
          background: "rgba(200, 160, 48, 0.06)",
          padding: "6px 20px 0 20px",
          gap: 12,
          overflowX: "auto"
        }}
      >
        <button
          onClick={() => setActiveTab("core_dasha")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "core_dasha" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "core_dasha" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Award size={15} color={activeTab === "core_dasha" ? "#875C06" : "#6B635B"} />
          <span>1. Active Dasha &amp; Antardasha</span>
        </button>

        <button
          onClick={() => setActiveTab("property_domain")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "property_domain" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "property_domain" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Home size={15} color={activeTab === "property_domain" ? "#875C06" : "#6B635B"} />
          <span>2. Property &amp; Land</span>
        </button>

        <button
          onClick={() => setActiveTab("marriage_domain")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "marriage_domain" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "marriage_domain" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Heart size={15} color={activeTab === "marriage_domain" ? "#875C06" : "#6B635B"} />
          <span>3. Marriage &amp; Love</span>
        </button>

        <button
          onClick={() => setActiveTab("career_domain")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "career_domain" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "career_domain" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Briefcase size={15} color={activeTab === "career_domain" ? "#875C06" : "#6B635B"} />
          <span>4. Career &amp; Karma</span>
        </button>

        <button
          onClick={() => setActiveTab("health_domain")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "health_domain" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "health_domain" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Activity size={15} color={activeTab === "health_domain" ? "#875C06" : "#6B635B"} />
          <span>5. Health &amp; Crisis</span>
        </button>

        <button
          onClick={() => setActiveTab("emergency_domain")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "emergency_domain" ? "#DC2626" : "#6B635B",
            borderBottom: activeTab === "emergency_domain" ? "3px solid #DC2626" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Zap size={15} color={activeTab === "emergency_domain" ? "#DC2626" : "#6B635B"} />
          <span>6. Karmic Repair (Peedit)</span>
        </button>

        <button
          onClick={() => setActiveTab("saturn_growth")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "saturn_growth" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "saturn_growth" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <TrendingUp size={15} color={activeTab === "saturn_growth" ? "#875C06" : "#6B635B"} />
          <span>7. Shani 7th Bhav Radar</span>
        </button>

        <button
          onClick={() => setActiveTab("property_radar")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "property_radar" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "property_radar" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Compass size={15} color={activeTab === "property_radar" ? "#875C06" : "#6B635B"} />
          <span>8. Property Timing 4-11-12</span>
        </button>

        <button
          onClick={() => setActiveTab("moon_sanctuary")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "moon_sanctuary" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "moon_sanctuary" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <HeartHandshake size={15} color={activeTab === "moon_sanctuary" ? "#875C06" : "#6B635B"} />
          <span>9. Chandra Sanctuary</span>
        </button>

        <button
          onClick={() => setActiveTab("bnn_conjunctions")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "bnn_conjunctions" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "bnn_conjunctions" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <Sparkles size={15} color={activeTab === "bnn_conjunctions" ? "#875C06" : "#6B635B"} />
          <span>10. Conjunctions</span>
        </button>

        <button
          onClick={() => setActiveTab("all_9_planets")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "all_9_planets" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "all_9_planets" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
          }}
        >
          <BookOpen size={15} color={activeTab === "all_9_planets" ? "#875C06" : "#6B635B"} />
          <span>11. All 9 Planets Registry</span>
        </button>
      </div>

      {/* ── Main Tab Content ────────────────────────────────────── */}
      {expanded && (
        <div style={{ padding: 24 }}>
          {/* TAB 1: CORE DASHA REMEDY */}
          {activeTab === "core_dasha" && evaluatedActivePlanet && (
            <div>
              {/* Primary Narrative Card */}
              <div
                style={{
                  background: evaluatedActivePlanet.isFavorable
                    ? "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
                    : "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
                  border: evaluatedActivePlanet.isFavorable
                    ? "1px solid #10B981"
                    : "1px solid #EF4444",
                  borderRadius: 16,
                  padding: "20px 22px",
                  marginBottom: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {evaluatedActivePlanet.isFavorable ? (
                    <ShieldCheck size={24} color="#059669" />
                  ) : (
                    <ShieldAlert size={24} color="#DC2626" />
                  )}
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: evaluatedActivePlanet.isFavorable ? "#065F46" : "#991B1B"
                    }}
                  >
                    {evaluatedActivePlanet.primaryHeadline}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: evaluatedActivePlanet.isFavorable ? "#047857" : "#7F1D1D",
                    margin: "0 0 12px 0"
                  }}
                >
                  {evaluatedActivePlanet.descriptiveNarrativeHinglish}
                </p>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    background: "rgba(255, 255, 255, 0.75)",
                    padding: "8px 14px",
                    borderRadius: 8,
                    display: "inline-block"
                  }}
                >
                  📍 Kundli Sthiti: {evaluatedActivePlanet.placementSummary}
                </div>
              </div>

              {/* Gemstone vs Donation Matrix */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 18,
                  marginBottom: 20
                }}
              >
                {/* Gemstone Card */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid rgba(200, 160, 48, 0.3)",
                    padding: 18,
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Sparkles size={18} color="#875C06" />
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                      Ratna (Gemstone) Niyam
                    </h4>
                  </div>
                  {evaluatedActivePlanet.gemstoneAdvice.canWearStone &&
                  evaluatedActivePlanet.gemstoneAdvice.stoneDetails ? (
                    <div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#059669",
                          marginBottom: 8
                        }}
                      >
                        ✓ {evaluatedActivePlanet.gemstoneAdvice.stoneDetails.name}
                      </div>
                      <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>
                        <div>
                          <strong>Dhaatu (Metal):</strong>{" "}
                          {evaluatedActivePlanet.gemstoneAdvice.stoneDetails.metal}
                        </div>
                        <div>
                          <strong>Ungli (Finger):</strong>{" "}
                          {evaluatedActivePlanet.gemstoneAdvice.stoneDetails.finger}
                        </div>
                        <div>
                          <strong>Dharan Divas:</strong>{" "}
                          {evaluatedActivePlanet.gemstoneAdvice.stoneDetails.dayToWear}
                        </div>
                        <div>
                          <strong>Shubh Muhurat:</strong>{" "}
                          {evaluatedActivePlanet.gemstoneAdvice.stoneDetails.muhurat}
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 12px",
                          background: "#ECFDF5",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "#065F46"
                        }}
                      >
                        {evaluatedActivePlanet.gemstoneAdvice.strictWarning}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#DC2626",
                          marginBottom: 8
                        }}
                      >
                        ✕ Bhulkar Bhi Ratna Na Pehnein!
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: "#991B1B",
                          background: "#FEF2F2",
                          padding: "10px 12px",
                          borderRadius: 8
                        }}
                      >
                        {evaluatedActivePlanet.gemstoneAdvice.strictWarning}
                      </div>
                    </div>
                  )}
                </div>

                {/* Elemental Disposal Vehicle Card */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid rgba(200, 160, 48, 0.3)",
                    padding: 18,
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Flame size={18} color="#D97706" />
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                      Tattva Madhyam: {evaluatedActivePlanet.elementalDisposalRule.actionTitleHinglish}
                    </h4>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#875C06",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 6
                    }}
                  >
                    {evaluatedActivePlanet.elementalDisposalRule.trikonaName}
                  </div>
                  <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, margin: "0 0 8px 0" }}>
                    {evaluatedActivePlanet.elementalDisposalRule.actionExplanationHinglish}
                  </p>
                  <div
                    style={{
                      background: "#FFFBEB",
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#92400E",
                      lineHeight: 1.5
                    }}
                  >
                    <strong>Vidhi:</strong> {evaluatedActivePlanet.elementalDisposalRule.procedureNarrativeHinglish}
                  </div>
                </div>
              </div>

              {/* Exact Physical Charity Formulas (if afflicted) */}
              {!evaluatedActivePlanet.isFavorable &&
                evaluatedActivePlanet.charityFormulas.length > 0 && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      padding: 20,
                      marginBottom: 20
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <Gift size={20} color="#DC2626" />
                      <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1F2937" }}>
                        Classical Shodhan Daan Formulae (Nirdharit Matra)
                      </h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {evaluatedActivePlanet.charityFormulas.map((c, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "#FFF5F5",
                            borderRadius: 10,
                            padding: "12px 16px",
                            borderLeft: "4px solid #EF4444"
                          }}
                        >
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#991B1B",
                              marginBottom: 4
                            }}
                          >
                            ✦ {c.item}
                          </div>
                          <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>
                            <div>
                              <strong>Matra (Quantity):</strong> {c.quantity}
                            </div>
                            <div>
                              <strong>Divas v Samay:</strong> {c.day} ({c.timing})
                            </div>
                            <div>
                              <strong>Kisko Dein (Recipient):</strong> {c.targetRecipient}
                            </div>
                            <div>
                              <strong>Sthan (Place):</strong> {c.place}
                            </div>
                            <div style={{ marginTop: 4, color: "#7F1D1D", fontStyle: "italic" }}>
                              <strong>Rahasya:</strong> {c.esotericReason}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Behavioral Conduct & Dietary Adjustments */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 18
                }}
              >
                {/* Do's */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    padding: 18
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 700, color: "#065F46" }}>
                    ✓ Kya Apnayein (Favorable Habits &amp; Diet)
                  </h4>
                  {evaluatedActivePlanet.foodsToAdopt.length > 0 && (
                    <div style={{ marginBottom: 10, fontSize: 13, color: "#374151" }}>
                      <strong>Bhojan:</strong> {evaluatedActivePlanet.foodsToAdopt.join(", ")}
                    </div>
                  )}
                  {evaluatedActivePlanet.coloursToWear.length > 0 && (
                    <div style={{ marginBottom: 10, fontSize: 13, color: "#374151" }}>
                      <strong>Shubh Rang:</strong> {evaluatedActivePlanet.coloursToWear.join(", ")}
                    </div>
                  )}
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>
                    {evaluatedActivePlanet.habitsToAdoptHinglish.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    padding: 18
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 700, color: "#991B1B" }}>
                    ✕ Kisse Bachein (Avoid Strict Warnings)
                  </h4>
                  {evaluatedActivePlanet.coloursToAvoid.length > 0 && (
                    <div style={{ marginBottom: 10, fontSize: 13, color: "#991B1B" }}>
                      <strong>Varjit Rang:</strong> {evaluatedActivePlanet.coloursToAvoid.join(", ")}
                    </div>
                  )}
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#7F1D1D", lineHeight: 1.6 }}>
                    {evaluatedActivePlanet.habitsToAvoidHinglish.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROPERTY DOMAIN */}
          {activeTab === "property_domain" && (
            <ContextualDomainCard response={contextualProperty} />
          )}

          {/* TAB: MARRIAGE DOMAIN */}
          {activeTab === "marriage_domain" && (
            <ContextualDomainCard response={contextualMarriage} />
          )}

          {/* TAB: CAREER DOMAIN */}
          {activeTab === "career_domain" && (
            <ContextualDomainCard response={contextualCareer} />
          )}

          {/* TAB: HEALTH DOMAIN */}
          {activeTab === "health_domain" && (
            <ContextualDomainCard response={contextualHealth} />
          )}

          {/* TAB: EMERGENCY KARMIC REPAIR */}
          {activeTab === "emergency_domain" && (
            <ContextualDomainCard response={contextualEmergency} />
          )}

          {/* TAB 2: SATURN 7TH HOUSE GROWTH RADAR */}
          {activeTab === "saturn_growth" && transitRadar && (
            <div>
              <div
                style={{
                  background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                  border: "1px solid #3B82F6",
                  borderRadius: 16,
                  padding: "18px 22px",
                  marginBottom: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <TrendingUp size={24} color="#1D4Ref" />
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1E40AF" }}>
                    Shani Ka 7th Bhav Vistar Rahasya (Saturn 7th House Growth Radar)
                  </h3>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#1E3A8A", margin: 0 }}>
                  Transcript Master Formula: &quot;Shani jahan transit karta hai, uske 7th house ki growth honi shuru ho jaati hai, uska status badhna shuru ho jaata hai!&quot; Shani apne karmik dhar se saamne wale bhav ko amrit v vistar pradan karta hai.
                </p>
              </div>

              {/* 3-Cycle Timeline Grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Past Cycle */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid rgba(156, 163, 175, 0.4)",
                    padding: 18,
                    borderLeft: "6px solid #6B7280"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>
                      {transitRadar.pastCycle.periodLabel}
                    </div>
                    <span style={{ fontSize: 12, background: "#F3F4F6", padding: "3px 8px", borderRadius: 6 }}>
                      Shani in H{transitRadar.pastCycle.saturnTransitHouse} → Elevated H{transitRadar.pastCycle.elevatedGrowthHouse}
                    </span>
                  </div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                    {transitRadar.pastCycle.growthThemeHinglish}
                  </h4>
                  <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, margin: "0 0 10px 0" }}>
                    {transitRadar.pastCycle.narrativeStoryHinglish}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {transitRadar.pastCycle.practicalIndicators.map((ind, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          background: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                          padding: "3px 8px",
                          borderRadius: 6,
                          color: "#374151"
                        }}
                      >
                        ✓ {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current Active Cycle */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid #3B82F6",
                    padding: 18,
                    borderLeft: "6px solid #2563EB",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.08)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
                      ★ {transitRadar.currentCycle.periodLabel} (CURRENTLY ACTIVE)
                    </div>
                    <span style={{ fontSize: 12, background: "#EFF6FF", color: "#1D4ED8", fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                      Shani in H{transitRadar.currentCycle.saturnTransitHouse} → Elevated H{transitRadar.currentCycle.elevatedGrowthHouse}
                    </span>
                  </div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 17, fontWeight: 800, color: "#1E3A8A" }}>
                    {transitRadar.currentCycle.growthThemeHinglish}
                  </h4>
                  <p style={{ fontSize: 14, color: "#1F2937", lineHeight: 1.7, margin: "0 0 10px 0" }}>
                    {transitRadar.currentCycle.narrativeStoryHinglish}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {transitRadar.currentCycle.practicalIndicators.map((ind, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          background: "#DBEAFE",
                          padding: "4px 10px",
                          borderRadius: 6,
                          color: "#1E40AF",
                          fontWeight: 600
                        }}
                      >
                        ★ {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Future Upcoming Cycle */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid rgba(147, 51, 234, 0.4)",
                    padding: 18,
                    borderLeft: "6px solid #9333EA"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#9333EA", textTransform: "uppercase" }}>
                      {transitRadar.futureCycle.periodLabel}
                    </div>
                    <span style={{ fontSize: 12, background: "#FAF5FF", color: "#7E22CE", padding: "3px 8px", borderRadius: 6 }}>
                      Shani in H{transitRadar.futureCycle.saturnTransitHouse} → Elevated H{transitRadar.futureCycle.elevatedGrowthHouse}
                    </span>
                  </div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 700, color: "#581C87" }}>
                    {transitRadar.futureCycle.growthThemeHinglish}
                  </h4>
                  <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, margin: "0 0 10px 0" }}>
                    {transitRadar.futureCycle.narrativeStoryHinglish}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {transitRadar.futureCycle.practicalIndicators.map((ind, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          background: "#F3E8FF",
                          padding: "3px 8px",
                          borderRadius: 6,
                          color: "#6B21A8"
                        }}
                      >
                        ✦ {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTY TIMING */}
          {activeTab === "property_radar" && transitRadar && (
            <div>
              <div
                style={{
                  background:
                    transitRadar.propertyForecast.timingStatus === "Highly_Favorable_Acquisition"
                      ? "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
                      : transitRadar.propertyForecast.timingStatus === "Active_Sale_Window"
                      ? "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)"
                      : "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
                  border:
                    transitRadar.propertyForecast.timingStatus === "Highly_Favorable_Acquisition"
                      ? "1px solid #10B981"
                      : transitRadar.propertyForecast.timingStatus === "Active_Sale_Window"
                      ? "1px solid #F59E0B"
                      : "1px solid #9CA3AF",
                  borderRadius: 16,
                  padding: "20px 22px",
                  marginBottom: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Home
                    size={24}
                    color={
                      transitRadar.propertyForecast.timingStatus === "Highly_Favorable_Acquisition"
                        ? "#059669"
                        : "#D97706"
                    }
                  />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color:
                        transitRadar.propertyForecast.timingStatus === "Highly_Favorable_Acquisition"
                          ? "#065F46"
                          : "#92400E"
                    }}
                  >
                    {transitRadar.propertyForecast.headlineHinglish}
                  </h3>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#1F2937", margin: "0 0 12px 0" }}>
                  {transitRadar.propertyForecast.verbatimRationaleHinglish}
                </p>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#4B5563" }}>
                  Active Bhav Significations:{" "}
                  {transitRadar.propertyForecast.signifiedHouses.map((h) => `H${h}`).join(", ")}
                </div>
              </div>

              {/* Classical KP Derived House Property Matrix */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  border: "1px solid rgba(200, 160, 48, 0.3)",
                  padding: 20,
                  marginBottom: 20
                }}
              >
                <h4 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 800, color: "#1F2937" }}>
                  Oral Lecture Derived Formula: Kharid vs Bikri Bhavat Bhavam
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 16
                  }}
                >
                  <div style={{ background: "#ECFDF5", padding: 14, borderRadius: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#065F46", marginBottom: 6 }}>
                      🏠 Makaan Khareedna (4 + 11 + 12)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#047857", lineHeight: 1.6 }}>
                      <li><strong>4th House:</strong> Physical building, landed property &amp; roof</li>
                      <li><strong>11th House:</strong> Desire fulfillment &amp; gaining ownership</li>
                      <li><strong>12th House:</strong> Investment outlay (&quot;Jab tak kharch nahi hoga, investment active nahi hogi&quot;)</li>
                    </ul>
                  </div>

                  <div style={{ background: "#FFFBEB", padding: 14, borderRadius: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>
                      🤝 Makaan Bechna (3 + 7 + 10 + 5)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#78350F", lineHeight: 1.6 }}>
                      <li><strong>3rd House:</strong> 12th from 4th (Apni zameen chhodna/negate karna)</li>
                      <li><strong>7th House:</strong> Client / Buyer jo makaan lene aayega</li>
                      <li><strong>10th House:</strong> 4th from 7th (Buyer ka makaan banne ka yog)</li>
                      <li><strong>5th House:</strong> 11th from 7th (Buyer ki iccha poorti ka yog)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actionable Property Guidance */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  border: "1px solid rgba(200, 160, 48, 0.3)",
                  padding: 18
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", fontSize: 15, fontWeight: 700, color: "#1F2937" }}>
                  Karyavahi &amp; Shubh Upay (Actionable Recommendations)
                </h4>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>
                  {transitRadar.propertyForecast.recommendationsHinglish.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: MOON EMOTIONAL SANCTUARY */}
          {activeTab === "moon_sanctuary" && (
            <div>
              <div
                style={{
                  background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                  border: "1px solid #22C55E",
                  borderRadius: 16,
                  padding: "18px 22px",
                  marginBottom: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <HeartHandshake size={24} color="#15803D" />
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#166534" }}>
                    Chandra Manovigyan: Dil Ki Baat Kisse Kahein?
                  </h3>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#14532D", margin: 0 }}>
                  Aapka Chandra <strong>{moonGuide.moonHouse}th bhav</strong> ({moonGuide.sign}) me virajman hai. Dil ki baat galat jagah kholne se depression aur apmaan milta hai; sahi vyakti ke aage kholne se man nirmal kundan ban jaata hai.
                </p>
              </div>

              {/* Primary Confidant Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  border: "1px solid rgba(200, 160, 48, 0.3)",
                  padding: 20,
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#875C06",
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    marginBottom: 6
                  }}
                >
                  Aapka Saccha Bhavnatmak Aashray (Confidant Anchor)
                </div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: 18, fontWeight: 800, color: "#1F2937" }}>
                  {moonGuide.confidantTitleHinglish}
                </h4>
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, margin: "0 0 14px 0" }}>
                  {moonGuide.narrativeHinglish}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 14
                  }}
                >
                  <div style={{ background: "#F0FDF4", padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 6 }}>
                      ✓ Shubh Aacharan (Safe Practices)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#14532D", lineHeight: 1.5 }}>
                      {moonGuide.safePracticesHinglish.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: "#FEF2F2", padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>
                      ✕ Sakht Savdhani (Emotional Trap)
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#7F1D1D", lineHeight: 1.5 }}>
                      {moonGuide.warningHinglish}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BNN TRANSIT CONJUNCTIONS */}
          {activeTab === "bnn_conjunctions" && transitRadar && (
            <div>
              <div
                style={{
                  background: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)",
                  border: "1px solid #A855F7",
                  borderRadius: 16,
                  padding: "18px 22px",
                  marginBottom: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Sparkles size={24} color="#7E22CE" />
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#6B21A8" }}>
                    BNN Gochar Conjunctions (Transit Shani in Aquarius)
                  </h3>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#581C87", margin: 0 }}>
                  Jab Gochar ka Shani aapke janm-kaaleen grahon ke upar se nikalta hai, to us grah ke kaaryakshetra me aparaadhit shakti aur status unlock hota hai!
                </p>
              </div>

              {transitRadar.bnnTransitConjunctions.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {transitRadar.bnnTransitConjunctions.map((hit, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#FFFFFF",
                        borderRadius: 12,
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        padding: 16,
                        borderLeft: "6px solid #A855F7"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1F2937" }}>
                          Shani Meets Natal {hit.natalPlanet} in {hit.transitSignName} (House {hit.houseNumber})
                        </h4>
                        <span style={{ fontSize: 12, background: "#F3E8FF", color: "#6B21A8", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
                          Active BNN Trigger
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, margin: "0 0 8px 0" }}>
                        {hit.esotericMeaningHinglish}
                      </p>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#7E22CE",
                          fontStyle: "italic",
                          background: "#FAF5FF",
                          padding: "6px 10px",
                          borderRadius: 6
                        }}
                      >
                        {hit.verbatimTranscriptQuote}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid rgba(200, 160, 48, 0.3)",
                    padding: 24,
                    textAlign: "center",
                    color: "#6B7280"
                  }}
                >
                  Filhal aapke janm-kaaleen Aquarius (Kumbh rashi) me koi pratyaksha grah sthit nahi hai. Shani ka 7th drishti prabhav seedha aapke saamne wale bhav par chal raha hai.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SAMPURNA 9 GRAH PUSTIKA */}
          {activeTab === "all_9_planets" && (
            <div>
              {/* Planet Selector Bar */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  paddingBottom: 12,
                  marginBottom: 16
                }}
              >
                {(Object.keys(MASTER_PLANET_REGISTRY) as PlanetId[]).map((pId) => {
                  const pDef = MASTER_PLANET_REGISTRY[pId];
                  const isSelected = selectedPlanet === pId;
                  return (
                    <button
                      key={pId}
                      onClick={() => setSelectedPlanet(pId)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 10,
                        border: isSelected ? "2px solid #875C06" : "1px solid #D1D5DB",
                        background: isSelected ? "#FEF3C7" : "#FFFFFF",
                        color: isSelected ? "#875C06" : "#374151",
                        fontWeight: isSelected ? 800 : 500,
                        fontSize: 13,
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {pDef.hindiName} ({pId})
                    </button>
                  );
                })}
              </div>

              {/* Selected Planet Details */}
              {evaluatedSelectedPlanet && (
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 16,
                    border: "1px solid rgba(200, 160, 48, 0.35)",
                    padding: 20
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1F2937" }}>
                      {MASTER_PLANET_REGISTRY[selectedPlanet].hindiName} ({selectedPlanet}) — Shaktikaran v Daan
                    </h3>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 12,
                        background: evaluatedSelectedPlanet.isFavorable ? "#ECFDF5" : "#FEF2F2",
                        color: evaluatedSelectedPlanet.isFavorable ? "#065F46" : "#991B1B",
                        fontWeight: 700
                      }}
                    >
                      {evaluatedSelectedPlanet.isFavorable ? "✦ Shubh (Favorable)" : "⚠️ Peedit (Afflicted)"}
                    </span>
                  </div>

                  <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                    {evaluatedSelectedPlanet.descriptiveNarrativeHinglish}
                  </p>

                  {/* Gemstone vs Daan */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 16 }}>
                    <div style={{ background: "#F9FAFB", padding: 14, borderRadius: 10, border: "1px solid #E5E7EB" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>
                        Ratna (Stone) Guidance
                      </div>
                      <div style={{ fontSize: 13, color: evaluatedSelectedPlanet.gemstoneAdvice.canWearStone ? "#059669" : "#DC2626", fontWeight: 600 }}>
                        {evaluatedSelectedPlanet.gemstoneAdvice.canWearStone
                          ? `✓ ${evaluatedSelectedPlanet.gemstoneAdvice.stoneDetails?.name} pehan sakte hain.`
                          : "✕ Bhulkar bhi ratna na pehnein!"}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                        {evaluatedSelectedPlanet.gemstoneAdvice.strictWarning}
                      </div>
                    </div>

                    <div style={{ background: "#F9FAFB", padding: 14, borderRadius: 10, border: "1px solid #E5E7EB" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>
                        Tattva Upay Madhyam
                      </div>
                      <div style={{ fontSize: 13, color: "#875C06", fontWeight: 600 }}>
                        {evaluatedSelectedPlanet.elementalDisposalRule.actionTitleHinglish}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                        {evaluatedSelectedPlanet.elementalDisposalRule.actionExplanationHinglish}
                      </div>
                    </div>
                  </div>

                  {/* Charity formulas if afflicted */}
                  {evaluatedSelectedPlanet.charityFormulas.length > 0 && (
                    <div style={{ background: "#FFF5F5", padding: 14, borderRadius: 10, border: "1px solid #FCA5A5" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 8 }}>
                        Daan Vidhi (Exact Dosages)
                      </div>
                      {evaluatedSelectedPlanet.charityFormulas.map((c, i) => (
                        <div key={i} style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}>
                          <strong>{c.item}:</strong> {c.quantity} · {c.targetRecipient} ({c.day})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CorePlanetRemediesDossier;
