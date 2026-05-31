"use client";
import { useMemo, useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { calculateMedical, NAKSHATRA_DISEASE_BOOK, SIGN_DISEASE } from "@/lib/astro-engine/medical";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";

const DOSHA_COLOR: Record<string, string> = { Pitta: "#ef4444", Kapha: "#22c55e", Vata: "#60a5fa" };
const FUNC_COLOR = { benefic: "#22c55e", malefic: "#ef4444", neutral: "#8880a8" };
const PLANET_EMOJI: Record<string, string> = {
  Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa", Rahu:"Ra", Ketu:"Ke"
};

type Tab = "overview" | "planets" | "combos" | "nakshatra" | "signs";

export default function MedicalPage() {
  const { chart, loading } = useUserChart();
  const result = useMemo(() => (chart ? calculateMedical(chart) : null), [chart]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <EngineStateCard title="🏥 Medical Astrology" loading={loading} loadingText="Analyzing health patterns..." emptyText="Complete onboarding to view analysis." />
        <MobileBottomNav />
      </main>
    );
  }

  const scoreEntries = Object.entries(result.healthScores).sort((a, b) => b[1] - a[1]);

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "24px 18px 110px", color: "#f0e8d0" }}>
      <style>{`
        .med-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 14px; margin-bottom: 12px; overflow: hidden; }
        .med-card-header { padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
        .med-card-body { padding: 0 16px 16px; border-top: 1px solid #1c1840; padding-top: 14px; }
        .med-section { margin-bottom: 14px; }
        .med-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; opacity: 0.7; }
        .med-row { font-size: 12px; color: #b8b0d8; margin-bottom: 6px; line-height: 1.55; display: flex; gap: 8px; }
        .med-row strong { color: #f0e8d0; min-width: 80px; flex-shrink: 0; }
        .tab-btn { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid #1c1840; cursor: pointer; transition: all 0.15s; }
        .tab-btn.active { background: rgba(20,184,166,0.15); border-color: rgba(20,184,166,0.4); color: #2dd4bf; }
        .tab-btn:not(.active) { background: transparent; color: #8880a8; }
        .score-bar-bg { background: rgba(255,255,255,0.06); border-radius: 4px; height: 8px; overflow: hidden; margin-top: 3px; }
        .score-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
        .combo-box { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.25); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; margin-right: 4px; }
        .nak-row { display: grid; grid-template-columns: 120px 1fr 80px; gap: 8px; font-size: 11px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: start; }
        .nak-row:last-child { border-bottom: none; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700 }}>🏥 Medical Astrology</div>
          <div style={{ fontSize: "13px", color: "#8880a8", marginTop: "4px" }}>Dr. S. Krishna Kumar Method · {result.planetCards.length} planets analyzed · Natal chart</div>
        </div>

        {(() => {
          const intro = engineIntros['medical'];
          return <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} />;
        })()}

        {/* Disclaimer banner */}
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", fontSize: "12px", lineHeight: "1.6" }}>
          <span style={{ color: "#fca5a5", fontWeight: 700 }}>⚕️ Medical Disclaimer:</span>
          <span style={{ color: "#b8b0d8", marginLeft: "8px" }}>This is a pattern-detection awareness tool based on classical Vedic texts. It does <strong style={{ color: "#f0e8d0" }}>NOT</strong> constitute medical diagnosis, treatment, or advice. Always consult a qualified registered medical doctor for any health concerns.</span>
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
            <div style={{ background: result.riskLevel === "high" ? "rgba(239,68,68,0.08)" : result.riskLevel === "moderate" ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.07)", border: `1px solid ${result.riskLevel === "high" ? "rgba(239,68,68,0.28)" : result.riskLevel === "moderate" ? "rgba(245,158,11,0.28)" : "rgba(34,197,94,0.24)"}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: result.riskLevel === "high" ? "#fca5a5" : result.riskLevel === "moderate" ? "#fbbf24" : "#86efac", marginBottom: "8px" }}>🩺 Overall Sensitivity — {result.riskLevel.toUpperCase()}</div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.7" }}>
                This combines health scores, accident sensitivity, active dashas and classical combinations. Use it as a prevention priority, not a diagnosis.
              </div>
            </div>

            {/* Prakriti card */}
            <div style={{ background: "rgba(20,184,166,0.07)", border: "1px solid rgba(20,184,166,0.25)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#2dd4bf", marginBottom: "8px" }}>🧬 Prakriti Constitution — {result.lagnaSign} Lagna</div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.7" }}>{result.prakriti}</div>
              <div style={{ fontSize: "11px", color: "#5eead4", marginTop: "8px" }}>Body zone: {result.lagnaBodyZone}</div>
            </div>

            {/* Birth nakshatra */}
            {result.birthNakshatraData && (
              <div style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#c4b5fd", marginBottom: "8px" }}>⭐ Birth Nakshatra — {result.birthNakshatra}</div>
                <div className="med-row"><strong>Tendency:</strong> {result.birthNakshatraData.disease}</div>
                <div className="med-row"><strong>Body zone:</strong> {result.birthNakshatraData.body}</div>
                <div className="med-row"><strong>Note:</strong> {result.birthNakshatraData.note}</div>
                <div style={{ fontSize: "11px", color: "#8880a8", marginTop: "8px", borderTop: "1px solid rgba(139,92,246,0.15)", paddingTop: "8px" }}>
                  🙏 Upay: {result.birthNakshatraUpay}
                </div>
              </div>
            )}

            {/* Moon sign */}
            {result.moonSignDisease && (
              <div style={{ background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "12px" }}>
                <span style={{ color: "#93c5fd", fontWeight: 700 }}>🌙 Moon Sign ({result.moonSign}):</span>
                <span style={{ color: "#b8b0d8", marginLeft: "8px" }}>{result.moonSignDisease}</span>
              </div>
            )}

            {/* Timing alerts */}
            {result.timingAlerts.length > 0 && (
              <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#c8a030", marginBottom: "12px" }}>⏳ Active Dasha Health Timing</div>
                {result.timingAlerts.map(alert => (
                  <div key={`${alert.level}-${alert.planet}`} style={{ padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px", color: "#f0e8d0" }}>{alert.level} {alert.planet}</span>
                      <span className="tag" style={{ background: alert.severity === "high" ? "rgba(239,68,68,0.12)" : alert.severity === "medium" ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)", border: `1px solid ${alert.severity === "high" ? "rgba(239,68,68,0.3)" : alert.severity === "medium" ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`, color: alert.severity === "high" ? "#fca5a5" : alert.severity === "medium" ? "#fbbf24" : "#86efac" }}>{alert.severity}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#8880a8", lineHeight: "1.6", marginBottom: "3px" }}>{alert.concern}</div>
                    <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.65" }}>{alert.message}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Health scores */}
            <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#c8a030", marginBottom: "14px" }}>📊 Health Sensitivity Scores</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                {scoreEntries.map(([cat, score]) => {
                  const barColor = score >= 40 ? "#ef4444" : score >= 20 ? "#f59e0b" : "#22c55e";
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "2px" }}>
                        <span style={{ color: "#f0e8d0" }}>{cat}</span>
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
            <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#f0e8d0" }}>⚡ Accident / Surgery Sensitivity</div>
                <div style={{ fontSize: "11px", color: "#8880a8", marginTop: "3px" }}>Mars, Rahu, Saturn afflictions + H8 planets</div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: result.accidentScore >= 40 ? "#ef4444" : result.accidentScore >= 20 ? "#f59e0b" : "#22c55e" }}>
                {result.accidentScore}
              </div>
            </div>

            {/* Top concerns */}
            {result.topConcerns.length > 0 && (
              <div style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#fb923c", marginBottom: "8px" }}>🎯 Priority Watch Areas</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {result.topConcerns.map(c => (
                    <span key={c} style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, color: "#fdba74" }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "12px 16px", marginTop: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#86efac", marginBottom: "8px" }}>✅ Preventive Routine</div>
              {result.preventiveRoutine.map((line, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.65", padding: "5px 0", borderBottom: i === result.preventiveRoutine.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>{line}</div>
              ))}
            </div>
          </>
        )}

        {/* ── PLANETS TAB ── */}
        {activeTab === "planets" && result.planetCards.map(card => {
          const isOpen = expanded === card.planet;
          const doshaColor = DOSHA_COLOR[card.tridosha] || "#8880a8";
          return (
            <div key={card.planet} className="med-card" style={{ borderLeft: `4px solid ${card.inDusthana ? "#ef4444" : "#1c1840"}` }}>
              <div className="med-card-header" onClick={() => setExpanded(isOpen ? null : card.planet)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{PLANET_EMOJI[card.planet]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>
                      {card.planet} — H{card.house}
                      {card.retrograde && <span style={{ color: "#f97316", marginLeft: "6px", fontSize: "11px", fontWeight: 600 }}>(R)</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#8880a8" }}>{card.sign} · {card.nakshatra} P{card.pada}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {card.inDusthana && <span className="tag" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>Dusthana</span>}
                  <span className="tag" style={{ background: `${doshaColor}18`, border: `1px solid ${doshaColor}44`, color: doshaColor }}>{card.tridosha}</span>
                  <span className="tag" style={{ background: `${FUNC_COLOR[card.funcNature]}18`, border: `1px solid ${FUNC_COLOR[card.funcNature]}44`, color: FUNC_COLOR[card.funcNature] }}>{card.funcNature}</span>
                  <span style={{ color: "#8880a8", fontSize: "16px" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div className="med-card-body">
                  <div className="med-section">
                    <div className="med-section-title" style={{ color: "#ef4444" }}>H{card.house} Health Note</div>
                    <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.65", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "7px", padding: "9px 11px" }}>
                      {card.houseNote}
                    </div>
                  </div>
                  <div className="med-section">
                    <div className="med-section-title" style={{ color: "#c4b5fd" }}>Nakshatra Pattern</div>
                    <div className="med-row"><strong>Tendency:</strong> {card.nakshatraDisease}</div>
                    <div className="med-row"><strong>Body zone:</strong> {card.nakshatraBody}</div>
                    <div className="med-row"><strong>Boil zone:</strong> {card.boilZone}</div>
                  </div>
                  {card.nakUpay && (
                    <div style={{ fontSize: "11px", color: "#8880a8", background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "8px 10px", lineHeight: "1.6" }}>
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
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "12px", color: "#fca5a5", lineHeight: "1.6" }}>
              ⚕️ <strong>Important:</strong> These are classical astrological pattern flags from Dr. S. Krishna Kumar&apos;s medical astrology text. They indicate <em>tendencies</em>, not certainties. Consult a qualified doctor for any medical concern.
            </div>

            {result.triggeredCombos.length === 0 ? (
              <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#86efac", textAlign: "center" }}>
                ✓ No classical disease combinations triggered in your chart.
              </div>
            ) : (
              result.triggeredCombos.map((combo, i) => (
                <div key={i} className="combo-box">
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#fca5a5", marginBottom: "5px" }}>⚠️ {combo.disease}</div>
                  <div style={{ fontSize: "11px", color: "#8880a8", lineHeight: "1.6" }}>{combo.note}</div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── NAKSHATRA TABLE TAB ── */}
        {activeTab === "nakshatra" && (
          <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: "12px", padding: "14px" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#c8a030", marginBottom: "14px" }}>📚 All 27 Nakshatras — Disease Reference (Book pg 28-30)</div>
            <div className="nak-row" style={{ fontWeight: 700, color: "#8880a8", borderBottom: "1px solid #1c1840", paddingBottom: "8px", marginBottom: "4px" }}>
              <div>Nakshatra</div><div>Disease Tendency</div><div>Body Zone</div>
            </div>
            {Object.entries(NAKSHATRA_DISEASE_BOOK).map(([nak, data]) => (
              <div key={nak} className="nak-row" style={{ color: nak === result.birthNakshatra ? "#f0e8d0" : "#b8b0d8", background: nak === result.birthNakshatra ? "rgba(139,92,246,0.07)" : "transparent", borderRadius: "4px" }}>
                <div style={{ fontWeight: nak === result.birthNakshatra ? 700 : 400, color: nak === result.birthNakshatra ? "#c4b5fd" : "#f0e8d0" }}>
                  {nak === result.birthNakshatra ? "⭐ " : ""}{nak}
                </div>
                <div>{data.disease}</div>
                <div style={{ color: "#8880a8" }}>{data.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── SIGNS TAB ── */}
        {activeTab === "signs" && (
          <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: "12px", padding: "14px" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#c8a030", marginBottom: "14px" }}>♈ Sign Disease Reference (Book pg 58-59)</div>
            {Object.entries(SIGN_DISEASE).map(([sign, disease]) => (
              <div key={sign} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", background: sign === result.lagnaSign || sign === result.moonSign ? "rgba(200,160,48,0.05)" : "transparent", borderRadius: "4px" }}>
                <div style={{ minWidth: "90px", fontWeight: 600, fontSize: "12px", color: sign === result.lagnaSign ? "#c8a030" : sign === result.moonSign ? "#93c5fd" : "#f0e8d0" }}>
                  {sign === result.lagnaSign ? "⬆ " : sign === result.moonSign ? "🌙 " : ""}{sign}
                </div>
                <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.55" }}>{disease}</div>
              </div>
            ))}
            <div style={{ fontSize: "10px", color: "#4a4870", marginTop: "12px" }}>⬆ = Your lagna sign &nbsp;·&nbsp; 🌙 = Your moon sign</div>
          </div>
        )}

        {/* Footer disclaimer */}
        <div style={{ marginTop: "28px", padding: "12px 14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px", fontSize: "11px", color: "#8880a8", lineHeight: "1.6" }}>
          ⚕️ This analysis is based on Dr. S. Krishna Kumar&apos;s Medical Astrology (classical Vedic text). All scores and patterns are awareness indicators only. No content here should replace professional medical evaluation, diagnosis, or treatment. The authors disclaim all medical liability.
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
