"use client";
import { useMemo, useState } from "react";
import { EngineIntro } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { calculateMedical, NAKSHATRA_DISEASE_BOOK, SIGN_DISEASE } from "@/lib/astro-engine/medical";
import { EngineStateCard } from "@/components/engine-state-card";

const DOSHA_COLOR: Record<string, string> = { Pitta: "#DC2626", Kapha: "#15803D", Vata: "#1D4ED8" };
const FUNC_COLOR = { benefic: "#15803D", malefic: "#DC2626", neutral: "#6B635B" };
const PLANET_EMOJI: Record<string, string> = {
  Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa", Rahu:"Ra", Ketu:"Ke"
};

type Tab = "overview" | "planets" | "combos" | "nakshatra" | "signs";

export default function MedicalPage() {
  const { chart, loading, hasUserChart } = useUserChart();
  const result = useMemo(() => (chart && hasUserChart ? calculateMedical(chart) : null), [chart, hasUserChart]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#FAF7F2", padding: "30px 22px 110px", color: "#1A1A1A" }}>
        <EngineStateCard title="Health & Vitality" loading={loading} loadingText="Analyzing vitality patterns..." emptyText="Complete onboarding to view analysis." />
      </main>
    );
  }

  const scoreEntries = Object.entries(result.healthScores).sort((a, b) => b[1] - a[1]);

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F2", padding: "24px 18px 110px", color: "#1A1A1A" }}>
      <style>{`
        .med-card { background: #FFFFFF; border: 1px solid rgba(184, 134, 11, 0.22); border-radius: 14px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .med-card-header { padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
        .med-card-body { padding: 0 16px 16px; border-top: 1px solid rgba(184, 134, 11, 0.12); padding-top: 14px; }
        .med-section { margin-bottom: 14px; }
        .med-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; opacity: 0.85; }
        .med-row { font-size: 12px; color: #4A4238; margin-bottom: 6px; line-height: 1.55; display: flex; gap: 8px; }
        .med-row strong { color: #1A1A1A; min-width: 80px; flex-shrink: 0; font-weight: 700; }
        .tab-btn { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(184, 134, 11, 0.22); cursor: pointer; transition: all 0.15s; }
        .tab-btn.active { background: rgba(184, 134, 11, 0.14); border-color: rgba(184, 134, 11, 0.35); color: #B8860B; font-weight: 700; }
        .tab-btn:not(.active) { background: #FFFFFF; color: #6B635B; }
        .tab-btn:not(.active):hover { color: #1A1A1A; background: rgba(184, 134, 11, 0.08); }
        .score-bar-bg { background: rgba(184, 134, 11, 0.15); border-radius: 4px; height: 8px; overflow: hidden; margin-top: 3px; }
        .score-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
        .combo-box { background: rgba(220, 38, 38, 0.04); border: 1px solid rgba(220, 38, 38, 0.22); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; margin-right: 4px; }
        .nak-row { display: grid; grid-template-columns: 120px 1fr 80px; gap: 8px; font-size: 11px; padding: 6px 0; border-bottom: 1px solid rgba(184, 134, 11, 0.12); align-items: start; }
        .nak-row:last-child { border-bottom: none; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700, color: "#1A1A1A" }}>Health & Vitality</div>
          <div style={{ fontSize: "13px", color: "#6B635B", marginTop: "4px" }}>Wellness awareness · {result.planetCards.length} planets analyzed · Natal chart</div>
        </div>

        {(() => {
          const intro = engineIntros['medical'];
          return <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} />;
        })()}

        {/* Disclaimer banner */}
        <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.22)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", fontSize: "12px", lineHeight: "1.6" }}>
          <span style={{ color: "#DC2626", fontWeight: 700 }}>Wellness Disclaimer:</span>
          <span style={{ color: "#4A4238", marginLeft: "8px" }}>This is a pattern-detection awareness tool based on classical Vedic texts. It does <strong style={{ color: "#1A1A1A" }}>NOT</strong> constitute medical diagnosis, treatment, or advice. Always consult a qualified registered medical doctor for any health concerns.</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "wrap" }}>
          {([
            ["overview", "Overview"],
            ["planets", "Planet Cards"],
            ["combos", "Classical Combos"],
            ["nakshatra", "Nakshatra Table"],
            ["signs", "Sign Disease"],
          ] as [Tab, string][]).map(([t, label]) => (
            <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Overall sensitivity */}
            <div style={{ background: result.riskLevel === "high" ? "rgba(220,38,38,0.06)" : result.riskLevel === "moderate" ? "rgba(180,83,9,0.06)" : "rgba(21,128,61,0.06)", border: `1px solid ${result.riskLevel === "high" ? "rgba(220,38,38,0.25)" : result.riskLevel === "moderate" ? "rgba(180,83,9,0.25)" : "rgba(21,128,61,0.25)"}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: result.riskLevel === "high" ? "#DC2626" : result.riskLevel === "moderate" ? "#B45309" : "#15803D", marginBottom: "8px" }}>🩺 Overall Sensitivity — {result.riskLevel.toUpperCase()}</div>
              <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.7" }}>
                This combines health scores, accident sensitivity, active dashas and classical combinations. Use it as a prevention priority, not a diagnosis.
              </div>
            </div>

            {/* Prakriti card */}
            <div style={{ background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#0F766E", marginBottom: "8px" }}>🧬 Prakriti Constitution — {result.lagnaSign} Lagna</div>
              <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.7" }}>{result.prakriti}</div>
              <div style={{ fontSize: "11px", color: "#0F766E", marginTop: "8px", fontWeight: 600 }}>Body zone: {result.lagnaBodyZone}</div>
            </div>

            {/* Birth nakshatra */}
            {result.birthNakshatraData && (
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#B8860B", marginBottom: "8px" }}>⭐ Birth Nakshatra — {result.birthNakshatra}</div>
                <div className="med-row"><strong>Tendency:</strong> {result.birthNakshatraData.disease}</div>
                <div className="med-row"><strong>Body zone:</strong> {result.birthNakshatraData.body}</div>
                <div className="med-row"><strong>Note:</strong> {result.birthNakshatraData.note}</div>
                <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "8px", borderTop: "1px solid rgba(184,134,11,0.12)", paddingTop: "8px" }}>
                  🙏 Upay: {result.birthNakshatraUpay}
                </div>
              </div>
            )}

            {/* Moon sign */}
            {result.moonSignDisease && (
              <div style={{ background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "12px" }}>
                <span style={{ color: "#1D4ED8", fontWeight: 700 }}>🌙 Moon Sign ({result.moonSign}):</span>
                <span style={{ color: "#4A4238", marginLeft: "8px" }}>{result.moonSignDisease}</span>
              </div>
            )}

            {/* Timing alerts */}
            {result.timingAlerts.length > 0 && (
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#B8860B", marginBottom: "12px" }}>⏳ Active Dasha Health Timing</div>
                {result.timingAlerts.map(alert => (
                  <div key={`${alert.level}-${alert.planet}`} style={{ padding: "9px 0", borderBottom: "1px solid rgba(184,134,11,0.12)" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px", color: "#1A1A1A" }}>{alert.level} {alert.planet}</span>
                      <span className="tag" style={{ background: alert.severity === "high" ? "rgba(220,38,38,0.1)" : alert.severity === "medium" ? "rgba(180,83,9,0.1)" : "rgba(21,128,61,0.1)", border: `1px solid ${alert.severity === "high" ? "rgba(220,38,38,0.3)" : alert.severity === "medium" ? "rgba(180,83,9,0.3)" : "rgba(21,128,61,0.3)"}`, color: alert.severity === "high" ? "#DC2626" : alert.severity === "medium" ? "#B45309" : "#15803D" }}>{alert.severity}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B635B", lineHeight: "1.6", marginBottom: "3px" }}>{alert.concern}</div>
                    <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65" }}>{alert.message}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Health scores */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "16px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#B8860B", marginBottom: "14px" }}>📊 Health Sensitivity Scores</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                {scoreEntries.map(([cat, score]) => {
                  const barColor = score >= 40 ? "#DC2626" : score >= 20 ? "#B45309" : "#15803D";
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "2px" }}>
                        <span style={{ color: "#1A1A1A" }}>{cat}</span>
                        <span style={{ color: barColor, fontWeight: 700 }}>{score > 0 ? score : "—"}</span>
                      </div>
                      <div className="score-bar-bg">
                        <div className="score-bar-fill" style={{ width: `${score}%`, background: barColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accident score */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A1A" }}>⚡ Accident / Surgery Sensitivity</div>
                <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "3px" }}>Mars, Rahu, Saturn afflictions + H8 planets</div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: result.accidentScore >= 40 ? "#DC2626" : result.accidentScore >= 20 ? "#B45309" : "#15803D" }}>
                {result.accidentScore}
              </div>
            </div>

            {/* Top concerns */}
            {result.topConcerns.length > 0 && (
              <div style={{ background: "rgba(194,65,12,0.06)", border: "1px solid rgba(194,65,12,0.22)", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#C2410C", marginBottom: "8px" }}>🎯 Priority Watch Areas</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {result.topConcerns.map(c => (
                    <span key={c} style={{ background: "rgba(194,65,12,0.1)", border: "1px solid rgba(194,65,12,0.28)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, color: "#C2410C" }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: "rgba(21,128,61,0.06)", border: "1px solid rgba(21,128,61,0.22)", borderRadius: "10px", padding: "12px 16px", marginTop: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#15803D", marginBottom: "8px" }}>✅ Preventive Routine</div>
              {result.preventiveRoutine.map((line, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65", padding: "5px 0", borderBottom: i === result.preventiveRoutine.length - 1 ? "none" : "1px solid rgba(21,128,61,0.12)" }}>{line}</div>
              ))}
            </div>
          </>
        )}

        {/* ── PLANETS TAB ── */}
        {activeTab === "planets" && result.planetCards.map(card => {
          const isOpen = expanded === card.planet;
          const doshaColor = DOSHA_COLOR[card.tridosha] || "#6B635B";
          return (
            <div key={card.planet} className="med-card" style={{ borderLeft: `4px solid ${card.inDusthana ? "#DC2626" : "rgba(184,134,11,0.3)"}` }}>
              <div className="med-card-header" onClick={() => setExpanded(isOpen ? null : card.planet)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{PLANET_EMOJI[card.planet]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}>
                      {card.planet} — H{card.house}
                      {card.retrograde && <span style={{ color: "#C2410C", marginLeft: "6px", fontSize: "11px", fontWeight: 600 }}>(R)</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B635B" }}>{card.sign} · {card.nakshatra} P{card.pada}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {card.inDusthana && <span className="tag" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.28)", color: "#DC2626" }}>Dusthana</span>}
                  <span className="tag" style={{ background: `${doshaColor}15`, border: `1px solid ${doshaColor}44`, color: doshaColor }}>{card.tridosha}</span>
                  <span className="tag" style={{ background: `${FUNC_COLOR[card.funcNature]}15`, border: `1px solid ${FUNC_COLOR[card.funcNature]}44`, color: FUNC_COLOR[card.funcNature] }}>{card.funcNature}</span>
                  <span style={{ color: "#6B635B", fontSize: "16px" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div className="med-card-body">
                  <div className="med-section">
                    <div className="med-section-title" style={{ color: "#DC2626" }}>H{card.house} Health Note</div>
                    <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.65", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: "7px", padding: "9px 11px" }}>
                      {card.houseNote}
                    </div>
                  </div>
                  <div className="med-section">
                    <div className="med-section-title" style={{ color: "#8A6008" }}>Nakshatra Pattern</div>
                    <div className="med-row"><strong>Tendency:</strong> {card.nakshatraDisease}</div>
                    <div className="med-row"><strong>Body zone:</strong> {card.nakshatraBody}</div>
                    <div className="med-row"><strong>Boil zone:</strong> {card.boilZone}</div>
                  </div>
                  {card.nakUpay && (
                    <div style={{ fontSize: "11px", color: "#6B635B", background: "#FAF7F2", border: "1px solid rgba(184,134,11,0.18)", borderRadius: "6px", padding: "8px 10px", lineHeight: "1.6" }}>
                      🙏 {card.nakUpay}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* ── COMBOS TAB ── */}
        {activeTab === "combos" && (
          <>
            <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.22)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "12px", color: "#4A4238", lineHeight: "1.6" }}>
              ⚕️ <strong style={{ color: "#DC2626" }}>Important:</strong> These are classical astrological pattern flags from Dr. S. Krishna Kumar&apos;s medical astrology text. They indicate <em>tendencies</em>, not certainties. Consult a qualified doctor for any medical concern.
            </div>

            {result.triggeredCombos.length === 0 ? (
              <div style={{ background: "rgba(21,128,61,0.06)", border: "1px solid rgba(21,128,61,0.22)", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#15803D", textAlign: "center", fontWeight: 600 }}>
                ✓ No classical disease combinations triggered in your chart.
              </div>
            ) : (
              result.triggeredCombos.map((combo, i) => (
                <div key={i} className="combo-box">
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#DC2626", marginBottom: "5px" }}>⚠️ {combo.disease}</div>
                  <div style={{ fontSize: "11px", color: "#6B635B", lineHeight: "1.6" }}>{combo.note}</div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── NAKSHATRA TABLE TAB ── */}
        {activeTab === "nakshatra" && (
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#8A6008", marginBottom: "14px" }}>📚 All 27 Nakshatras — Disease Reference (Book pg 28-30)</div>
            <div className="nak-row" style={{ fontWeight: 700, color: "#6B635B", borderBottom: "1px solid rgba(184,134,11,0.18)", paddingBottom: "8px", marginBottom: "4px" }}>
              <div>Nakshatra</div><div>Disease Tendency</div><div>Body Zone</div>
            </div>
            {Object.entries(NAKSHATRA_DISEASE_BOOK).map(([nak, data]) => (
              <div key={nak} className="nak-row" style={{ color: nak === result.birthNakshatra ? "#1A1A1A" : "#4A4238", background: nak === result.birthNakshatra ? "rgba(124,58,237,0.07)" : "transparent", borderRadius: "4px" }}>
                <div style={{ fontWeight: nak === result.birthNakshatra ? 700 : 500, color: nak === result.birthNakshatra ? "#7C3AED" : "#1A1A1A" }}>
                  {nak === result.birthNakshatra ? "⭐ " : ""}{nak}
                </div>
                <div>{data.disease}</div>
                <div style={{ color: "#6B635B" }}>{data.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── SIGNS TAB ── */}
        {activeTab === "signs" && (
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184,134,11,0.22)", borderRadius: "12px", padding: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#8A6008", marginBottom: "14px" }}>♈ Sign Disease Reference (Book pg 58-59)</div>
            {Object.entries(SIGN_DISEASE).map(([sign, disease]) => (
              <div key={sign} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(184,134,11,0.12)", background: sign === result.lagnaSign || sign === result.moonSign ? "rgba(184,134,11,0.06)" : "transparent", borderRadius: "4px" }}>
                <div style={{ minWidth: "90px", fontWeight: 700, fontSize: "12px", color: sign === result.lagnaSign ? "#8A6008" : sign === result.moonSign ? "#1D4ED8" : "#1A1A1A" }}>
                  {sign === result.lagnaSign ? "⬆ " : sign === result.moonSign ? "🌙 " : ""}{sign}
                </div>
                <div style={{ fontSize: "12px", color: "#4A4238", lineHeight: "1.55" }}>{disease}</div>
              </div>
            ))}
            <div style={{ fontSize: "11px", color: "#6B635B", marginTop: "12px" }}>⬆ = Your lagna sign &nbsp;·&nbsp; 🌙 = Your moon sign</div>
          </div>
        )}

        {/* Footer disclaimer */}
        <div style={{ marginTop: "28px", padding: "12px 14px", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: "8px", fontSize: "11px", color: "#6B635B", lineHeight: "1.6" }}>
          ⚕️ This analysis is based on Dr. S. Krishna Kumar&apos;s Medical Astrology (classical Vedic text). All scores and patterns are awareness indicators only. No content here should replace professional medical evaluation, diagnosis, or treatment. The authors disclaim all medical liability.
        </div>
      </div>
    </main>
  );
}
