"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  evaluateNakshatraRemedyDossier,
  type NakshatraHumanReport,
} from "@/lib/astro-engine/nakshatra-remedy-engine";
import {
  Sparkles,
  HeartHandshake,
  AlertTriangle,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BookOpen,
  Sprout,
  Apple,
  HandCoins,
  ShieldAlert,
} from "lucide-react";

interface NakshatraRemedyDossierCardProps {
  chart: ChartData | null | undefined;
  compact?: boolean;
}

export function NakshatraRemedyDossierCard({
  chart,
  compact = false,
}: NakshatraRemedyDossierCardProps) {
  const [activeTab, setActiveTab] = useState<"transit_shivling" | "social_personality" | "houses_6_8_12">("transit_shivling");
  const [expanded, setExpanded] = useState(!compact);

  const report: NakshatraHumanReport | null = useMemo(() => {
    return evaluateNakshatraRemedyDossier(chart);
  }, [chart]);

  if (!report) return null;
  const tr = report.transitRemedy;

  return (
    <div
      style={{
        borderRadius: 20,
        background: "linear-gradient(145deg, #FAF7F2 0%, #F5EFEB 100%)",
        border: "1px solid rgba(200, 160, 48, 0.35)",
        boxShadow: "0 12px 36px rgba(44, 34, 20, 0.08)",
        overflow: "hidden",
        marginBottom: 28,
        position: "relative",
      }}
    >
      {/* ── Top Header Ribbon ─────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #1C1917 0%, #292524 100%)",
          color: "#FAF7F2",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c8a030, #e5c158)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1A1A1A",
              fontWeight: 800,
              fontSize: 18,
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
                fontWeight: 700,
              }}
            >
              Dasha-Transit Gochar &amp; Shivling Rahasya
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "serif",
                color: "#FFFFFF",
              }}
            >
              {report.activeDashaPlanet} Dasha ✦ Gochar in {tr?.transitNakshatra || report.activeNakshatraName}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {tr && (
            <span
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                background:
                  tr.taraRelationType.includes("Hazard") || tr.taraRelationType.includes("Enemy")
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(34, 197, 94, 0.2)",
                border:
                  tr.taraRelationType.includes("Hazard") || tr.taraRelationType.includes("Enemy")
                    ? "1px solid rgba(239, 68, 68, 0.4)"
                    : "1px solid rgba(34, 197, 94, 0.4)",
                color:
                  tr.taraRelationType.includes("Hazard") || tr.taraRelationType.includes("Enemy")
                    ? "#fca5a5"
                    : "#86efac",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Tara #{tr.taraNumber}: {tr.taraName} ({tr.taraRelationType})
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 8,
              color: "#FFFFFF",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
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
          overflowX: "auto",
        }}
      >
        <button
          onClick={() => setActiveTab("transit_shivling")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "transit_shivling" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "transit_shivling" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={14} color={activeTab === "transit_shivling" ? "#875C06" : "#6B635B"} />
          <span>1. Transit Nakshatra &amp; Shivling Upay</span>
        </button>

        <button
          onClick={() => setActiveTab("social_personality")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "social_personality" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "social_personality" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <BookOpen size={14} color={activeTab === "social_personality" ? "#875C06" : "#6B635B"} />
          <span>2. Swabhav &amp; Samajik Upay</span>
        </button>

        <button
          onClick={() => setActiveTab("houses_6_8_12")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: activeTab === "houses_6_8_12" ? "#875C06" : "#6B635B",
            borderBottom: activeTab === "houses_6_8_12" ? "3px solid #875C06" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sprout size={14} color={activeTab === "houses_6_8_12" ? "#875C06" : "#6B635B"} />
          <span>3. 6th, 8th &amp; 12th House Special Upay</span>
        </button>
      </div>

      {/* ── TAB 1: Transit Nakshatra & 27 Shivling Upachara ────── */}
      {activeTab === "transit_shivling" && tr && (
        <div style={{ padding: "24px" }}>
          {/* Real-time Transit Banner */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(200, 160, 48, 0.3)",
              borderRadius: 14,
              padding: "16px 20px",
              marginBottom: 20,
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: 13, color: "#875C06", fontWeight: 700, marginBottom: 4 }}>
              ✦ VARTAMAAN GOCHAR (CURRENT TRANSIT STATE)
            </div>
            <div style={{ fontSize: 15, color: "#2C2214", lineHeight: 1.6 }}>
              Aapke Dasha Lord <strong>{tr.activeDashaLord}</strong> is samay aakash me{" "}
              <strong>{tr.transitSign}</strong> rashi ke andar{" "}
              <strong style={{ color: "#875C06" }}>&ldquo;{tr.transitNakshatra} Nakshatra&rdquo; (#{tr.transitNakshatraNumber})</strong> me transit kar rahe hain ({tr.transitDegree}° par).
            </div>
            <div style={{ marginTop: 8, fontSize: 13.5, color: "#4A3E2C" }}>
              Aapke Janma Nakshatra (<strong>{tr.natalMoonNakshatra}</strong>) se count karne par ye{" "}
              <strong>Tara #{tr.taraNumber} ({tr.taraName})</strong> banta hai:{" "}
              <em>{tr.taraExplanationHinglish}</em>
            </div>
          </div>

          {/* 6/8 Tak Yog Warning if Active */}
          {tr.distanceAnalysis?.isTakYog && (
            <div
              style={{
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                borderRadius: 14,
                padding: "14px 18px",
                marginBottom: 20,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <ShieldAlert size={20} color="#DC2626" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>
                  Shadashtaka Alert: Mahadasha &amp; Antardasha 6/8 Tak Yog
                </div>
                <div style={{ fontSize: 13, color: "#7F1D1D", marginTop: 4, lineHeight: 1.6 }}>
                  {tr.distanceAnalysis.impactDescriptionHinglish}
                </div>
                {tr.distanceAnalysis.takYogRemedyHinglish && (
                  <div style={{ fontSize: 12.5, color: "#991B1B", marginTop: 6, fontWeight: 600 }}>
                    Upay: {tr.distanceAnalysis.takYogRemedyHinglish}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Primary 27-Shivling Upachara Remedy Box (Mahadasha) */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(200, 160, 48, 0.12), rgba(200, 160, 48, 0.22))",
              border: "1px solid rgba(200, 160, 48, 0.4)",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 700,
                color: "#684803",
                marginBottom: 8,
              }}
            >
              <HeartHandshake size={18} color="#875C06" />
              <span>
                Mahadasha Shivling Upachara #{tr.transitNakshatraNumber}: {tr.shivlingRemedy.upacharaName} ({tr.shivlingRemedy.hindiTitle})
              </span>
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "#2C2214",
                margin: "0 0 12px 0",
              }}
            >
              {tr.shivlingRemedy.procedureNarrativeHinglish}
            </p>

            {tr.shivlingRemedy.transcriptExample && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderLeft: "4px solid #875C06",
                  padding: "10px 14px",
                  borderRadius: "0 8px 8px 0",
                  fontSize: 13,
                  color: "#4A3E2C",
                  lineHeight: 1.5,
                }}
              >
                <strong>📌 Transcript Udaharan:</strong> {tr.shivlingRemedy.transcriptExample}
              </div>
            )}
          </div>

          {/* Antardasha 27-Shivling Upachara Remedy Box */}
          {tr.antardashaShivlingRemedy && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.16))",
                border: "1px solid rgba(59, 130, 246, 0.35)",
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1E40AF",
                  marginBottom: 8,
                }}
              >
                <Sparkles size={18} color="#2563EB" />
                <span>
                  Antardasha Lord ({tr.activeAntardashaLord} in {tr.antardashaTransitNakshatra}) Shivling Upachara #{tr.antardashaTransitNakshatraNumber}: {tr.antardashaShivlingRemedy.upacharaName} ({tr.antardashaShivlingRemedy.hindiTitle})
                </span>
              </div>
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.75,
                  color: "#1E293B",
                  margin: "0 0 10px 0",
                }}
              >
                {tr.antardashaShivlingRemedy.procedureNarrativeHinglish}
              </p>
              <div
                style={{
                  fontSize: 12.5,
                  color: "#334155",
                  lineHeight: 1.5,
                }}
              >
                <strong>Dainik Prabhav:</strong> Antardasha nath ka upachara aapke daily routine aur immediate rukaavaton ko door karne ke liye hota hai.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: Social & Personality Narrative (From Transcript 1) ── */}
      {activeTab === "social_personality" && (
        <div style={{ padding: "24px" }}>
          {/* Golden Rule Bar */}
          <div
            style={{
              background: "rgba(200, 160, 48, 0.12)",
              border: "1px solid rgba(200, 160, 48, 0.25)",
              borderRadius: 12,
              padding: "12px 20px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 18 }}>👑</span>
            <div style={{ fontSize: 13.5, color: "#4A3E2C" }}>
              <strong style={{ color: "#875C06" }}>Jeevan Ka Paka Niyam:</strong> &ldquo;{report.goldenRule}&rdquo;
            </div>
          </div>

          {/* Section 1 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#2C2214", marginBottom: 6 }}>
              <Sparkles size={16} color="#c8a030" />
              <span>1. Aap Is Waqt Kaisi Energy Me Hain? (Aapka Swabhav)</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#3D352E", margin: 0, paddingLeft: 24 }}>
              {report.section1_InnerStateAndPersonality}
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#2C2214", marginBottom: 6 }}>
              <BookOpen size={16} color="#875C06" />
              <span>2. Sansarik &amp; Pauranik Kahani (Aapka Svaroop)</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#3D352E", margin: 0, paddingLeft: 24, fontStyle: "italic" }}>
              {report.section2_LivingArchetypeStory}
            </p>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: 20, background: "rgba(220, 38, 38, 0.05)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>
              <AlertTriangle size={16} color="#DC2626" />
              <span>3. Dhyan Rakhein: Kahan Badi Chuk Hoti Hai? (Karmic Trap)</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#7F1D1D", margin: 0 }}>
              {report.section3_KarmicTrapAndAngerWarning}
            </p>
          </div>

          {/* Section 4 */}
          {expanded && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#2C2214", marginBottom: 6 }}>
                <ShieldCheck size={16} color="#2563EB" />
                <span>4. Ghar-Parivaar Aur Dainik Vyavhar (Niyam)</span>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#3D352E", margin: 0, paddingLeft: 24 }}>
                {report.section4_BehavioralConductInDailyLife}
              </p>
            </div>
          )}

          {/* Section 5 */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(200, 160, 48, 0.3)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "#684803", marginBottom: 8 }}>
              <HeartHandshake size={18} color="#875C06" />
              <span>5. Pashu Seva &amp; Samajik Upay</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#3D352E", margin: 0 }}>
              {report.section5_ActionableRemedyAndSevaPlan}
            </p>
          </div>
        </div>
      )}

      {/* ── TAB 3: 6th, 8th & 12th House Special Remedies ─────── */}
      {activeTab === "houses_6_8_12" && tr && (
        <div style={{ padding: "24px" }}>
          {/* Belief Rule Banner */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: 14,
                padding: "16px",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={16} />
                <span>6th House: Blind Faith &amp; Super Success</span>
              </div>
              <div style={{ fontSize: 13, color: "#14532D", lineHeight: 1.6 }}>
                {tr.beliefGuidanceHinglish.house6MessageHinglish}
              </div>
            </div>

            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 14,
                padding: "16px",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={16} />
                <span>12th House: Never Believe, Donate (Let Go)</span>
              </div>
              <div style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6 }}>
                {tr.beliefGuidanceHinglish.house12MessageHinglish}
              </div>
            </div>
          </div>

          {/* 6th House Plants */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2214", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Sprout size={16} color="#16A34A" />
              <span>6th House Rog/Rin Mukti — Paudhe Lagana (Earth Debt Relief):</span>
            </div>
            {tr.house6PlantRemedies.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {tr.house6PlantRemedies.map((p, idx) => (
                  <div key={idx} style={{ background: "#FFFFFF", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }}>
                    <strong>{p.planet} ke liye:</strong> {p.plantName} {p.alternative ? `(ya ${p.alternative})` : ""} — {p.careInstructionsHinglish}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#6B635B", fontStyle: "italic" }}>
                Aapke 6th house me koi pratyaksh grah nahi hai. Sadharanta Shami, Peepal ya Aak lagana shubh rehta hai.
              </div>
            )}
          </div>

          {/* 8th House Fruits */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2214", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Apple size={16} color="#EA580C" />
              <span>8th House Sankat Mukti — Phal Daan (Fruit Donation):</span>
            </div>
            {tr.house8FruitRemedies.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {tr.house8FruitRemedies.map((f, idx) => (
                  <div key={idx} style={{ background: "#FFFFFF", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }}>
                    <strong>{f.planet} ke liye:</strong> {f.fruitName} — {f.donationGuidanceHinglish}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#6B635B", fontStyle: "italic" }}>
                Aapke 8th house me koi pratyaksh grah nahi hai. Mausami phal mandir me bhent karna anukul hai.
              </div>
            )}
          </div>

          {/* 12th House Donations */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2214", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <HandCoins size={16} color="#2563EB" />
              <span>12th House Loss/Hospital Mukti — Nishkaam Daan (Letting Go):</span>
            </div>
            {tr.house12DonationRemedies.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {tr.house12DonationRemedies.map((d, idx) => (
                  <div key={idx} style={{ background: "#FFFFFF", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }}>
                    <strong>{d.planet} ({d.targetCategory}):</strong> {d.donationTypeHinglish} <em>({d.spiritualMeaningHinglish})</em>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#6B635B", fontStyle: "italic" }}>
                Aapke 12th house me koi pratyaksh grah nahi hai. Zarooratmand logon ki nishkaam sahayata karein.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default NakshatraRemedyDossierCard;
