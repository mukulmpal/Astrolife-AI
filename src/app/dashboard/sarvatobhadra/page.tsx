"use client";
import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import { calculateSarvatobhadra } from "@/lib/astro-engine/sarvatobhadra";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EngineStateCard } from "@/components/engine-state-card";

const PLANET_EMOJI: Record<string, string> = {
  Sun:"☀️", Moon:"🌙", Mars:"♂️", Mercury:"☿", Jupiter:"♃", Venus:"♀️", Saturn:"♄", Rahu:"☊", Ketu:"☋"
};
const PLANET_COLOR: Record<string, string> = {
  Sun:"#f97316", Moon:"#c084fc", Mars:"#ef4444", Mercury:"#22c55e",
  Jupiter:"#f59e0b", Venus:"#ec4899", Saturn:"#60a5fa", Rahu:"#a78bfa", Ketu:"#fb7185",
};
const NATURE_COLOR = { malefic: "#ef4444", benefic: "#22c55e", neutral: "#f59e0b" };
const PERIOD_CONFIG = {
  Auspicious:  { color: "#22c55e", bg: "rgba(34,197,94,0.08)",    border: "rgba(34,197,94,0.3)",   icon: "✨" },
  Mixed:       { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",   border: "rgba(245,158,11,0.3)",  icon: "⚖️" },
  Challenging: { color: "#f97316", bg: "rgba(249,115,22,0.08)",   border: "rgba(249,115,22,0.3)",  icon: "⚠️" },
  Severe:      { color: "#ef4444", bg: "rgba(239,68,68,0.1)",     border: "rgba(239,68,68,0.4)",   icon: "🔴" },
};
const INTENSITY_COLOR = { EXTREME: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b" };

type Tab = "alerts" | "profile" | "natal" | "grid" | "guide";

export default function SarvatobhadraPage() {
  const { chart, loading } = useUserChart();
  const result = useMemo(() => (chart ? calculateSarvatobhadra(chart) : null), [chart]);
  const [activeTab, setActiveTab] = useState<Tab>("alerts");
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

  if (loading || !result) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <EngineStateCard title="🔯 Sarvatobhadra Chakra" loading={loading} loadingText="Mapping nakshatra grid..." emptyText="Complete onboarding to view chakra." />
        <MobileBottomNav />
      </main>
    );
  }

  const period = PERIOD_CONFIG[result.currentPeriodAssessment];
  const nak = result.birthNakshatraData;

  return (
    <main style={{ minHeight: "100vh", background: "#060410", padding: "24px 18px 110px", color: "#f0e8d0" }}>
      <style>{`
        .svb-card { background: #0d0a22; border: 1px solid #1c1840; border-radius: 14px; margin-bottom: 12px; overflow: hidden; }
        .svb-row { font-size: 12px; color: #b8b0d8; margin-bottom: 6px; display: flex; gap: 8px; line-height: 1.55; }
        .svb-row strong { color: #f0e8d0; min-width: 80px; flex-shrink: 0; }
        .tab-btn { padding: 7px 13px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid #1c1840; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .tab-btn.active { background: rgba(6,182,212,0.15); border-color: rgba(6,182,212,0.4); color: #06b6d4; }
        .tab-btn:not(.active) { background: transparent; color: #8880a8; }
        .planet-tag { display: inline-flex; align-items: center; gap: 3px; padding: 2px 7px; border-radius: 10px; font-size: 10px; margin: 1px; border: 1px solid; }
        .alert-header { padding: 14px 16px; cursor: pointer; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .alert-body { padding: 0 16px 16px; border-top: 1px solid #1c1840; padding-top: 14px; }
        .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; opacity: 0.7; }
        .zone-cell { padding: 6px 8px; border-radius: 6px; font-size: 10px; }
        .knowledge-box { background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.15); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; font-size: 12px; color: #b8b0d8; line-height: 1.7; }
        .remedy-box { background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.18); border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #86efac; line-height: 1.7; }
        .caution-box { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.18); border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #fca5a5; line-height: 1.7; margin-bottom: 8px; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700 }}>🔯 Sarvatobhadra Chakra</div>
          <div style={{ fontSize: "13px", color: "#8880a8", marginTop: "4px" }}>
            Ancient Vedic Nakshatra Grid · Vedha Transit System · Live Analysis · {result.transitDate.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
          </div>
        </div>

        {/* Current Period Assessment Banner */}
        <div style={{ background: period.bg, border: `2px solid ${period.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "22px" }}>{period.icon}</span>
            <div>
              <span style={{ fontWeight: 700, fontSize: "14px", color: period.color }}>Current Period: {result.currentPeriodAssessment}</span>
              <div style={{ fontSize: "10px", color: "#8880a8", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                {result.beneficVedhaCount} benefic · {result.maleficVedhaCount} malefic alerts active
              </div>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.7" }}>{result.currentPeriodReason}</div>
        </div>

        {/* Summary grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "16px" }}>
          {[
            { label: "Birth Nakshatra", value: result.birthNakshatra, sub: `#${result.janmaIndex + 1} of 27`, color: "#c8a030" },
            { label: "Active Vedha Alerts", value: String(result.vedhaAlerts.length), sub: result.vedhaAlerts.length === 0 ? "All clear" : "Transit impacts", color: result.vedhaAlerts.length > 0 ? "#ef4444" : "#22c55e" },
            { label: "Natal in Sensitive", value: String(result.natalInSensitive.length), sub: "permanent activations", color: "#60a5fa" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: "10px", padding: "12px 14px" }}>
              <div style={{ fontSize: "10px", color: "#8880a8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: "10px", color: "#8880a8" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "18px", overflowX: "auto", paddingBottom: "2px" }}>
          {([
            ["alerts",  "⚡ Transit Alerts"],
            ["profile", "⭐ Birth Nakshatra"],
            ["natal",   "🪐 Natal Zones"],
            ["grid",    "🔯 Full Grid"],
            ["guide",   "📖 How to Read"],
          ] as [Tab, string][]).map(([t, label]) => (
            <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── ALERTS TAB ── */}
        {activeTab === "alerts" && (
          <>
            {result.vedhaAlerts.length === 0 ? (
              <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#22c55e", marginBottom: "8px" }}>No Active Vedha Today</div>
                <div style={{ fontSize: "12px", color: "#86efac", lineHeight: "1.7" }}>
                  All transit planets are currently in neutral nakshatra positions relative to your birth nakshatra. This is a stable, undisturbed period — ideal for steady, focused work. Check back daily as the Moon moves one nakshatra per day.
                </div>
              </div>
            ) : (
              result.vedhaAlerts.map((alert, i) => {
                const isNeg = alert.planetNature === "malefic";
                const isPos = alert.planetNature === "benefic";
                const alertColor = isPos ? "#22c55e" : isNeg ? NATURE_COLOR.malefic : NATURE_COLOR.neutral;
                const isOpen = expandedAlert === i;
                const isJanma = alert.type === "janma_vedha";
                return (
                  <div key={i} className="svb-card" style={{ borderLeft: `4px solid ${alertColor}` }}>
                    <div className="alert-header" onClick={() => setExpandedAlert(isOpen ? null : i)}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1 }}>
                        <span style={{ fontSize: "22px", flexShrink: 0 }}>{PLANET_EMOJI[alert.planet]}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
                            <span style={{ fontWeight: 700, fontSize: "14px", color: alertColor }}>{alert.planet}</span>
                            <span style={{ color: "#8880a8", fontSize: "12px" }}>transiting {alert.nakshatra}</span>
                            {isJanma && (
                              <span style={{ background: "rgba(200,160,48,0.15)", border: "1px solid rgba(200,160,48,0.4)", borderRadius: "10px", padding: "1px 8px", fontSize: "10px", color: "#c8a030", fontWeight: 700 }}>
                                ⭐ Janma Vedha — STRONGEST
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ background: `${alertColor}15`, border: `1px solid ${alertColor}35`, borderRadius: "10px", padding: "1px 8px", fontSize: "10px", color: alertColor, fontWeight: 600 }}>
                              {alert.zoneName} Zone
                            </span>
                            <span style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "1px 8px", fontSize: "10px", color: "#8880a8" }}>
                              {alert.vedhaInterp.duration.split('—')[0].trim()}
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#8880a8", marginTop: "5px" }}>{alert.vedhaInterp.area}</div>
                        </div>
                      </div>
                      <span style={{ color: "#8880a8", fontSize: "16px", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>

                    {isOpen && (
                      <div className="alert-body">
                        {/* Zone context */}
                        <div className="knowledge-box" style={{ marginBottom: "12px" }}>
                          <strong style={{ color: "#06b6d4" }}>🔯 {alert.zoneName} Zone:</strong>
                          <span style={{ marginLeft: "6px" }}>{alert.zoneDesc}</span>
                        </div>

                        {/* Prediction */}
                        <div style={{ marginBottom: "12px" }}>
                          <div className="section-title" style={{ color: alertColor }}>
                            {isPos ? "✨ What This Means For You" : "⚠️ What This Means For You"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.75", background: `${alertColor}06`, border: `1px solid ${alertColor}18`, borderRadius: "8px", padding: "10px 12px" }}>
                            {alert.vedhaInterp.prediction}
                          </div>
                        </div>

                        {/* Caution */}
                        {!isPos && (
                          <div className="caution-box">
                            <strong>⚡ Caution:</strong> {alert.vedhaInterp.caution}
                          </div>
                        )}

                        {/* Remedy */}
                        <div className="remedy-box" style={{ marginBottom: "10px" }}>
                          <strong style={{ color: "#22c55e" }}>🙏 Remedy:</strong> {alert.vedhaInterp.remedy}
                        </div>

                        {/* Duration and intensity note */}
                        <div style={{ fontSize: "11px", color: "#8880a8", lineHeight: "1.6" }}>
                          <span style={{ color: "#60a5fa" }}>⏱ Duration:</span> {alert.vedhaInterp.duration}
                          <br />
                          <span style={{ color: "#60a5fa" }}>💡 Intensity Note:</span> {alert.vedhaInterp.intensityNote}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Tip about Moon */}
            <div style={{ background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: "8px", padding: "10px 14px", marginTop: "8px", fontSize: "11px", color: "#c4b5fd", lineHeight: "1.6" }}>
              💡 <strong>Daily Tip:</strong> The Moon transits one nakshatra every ~24 hours. Come back daily to check if the Moon is creating a vedha on your sensitive zones — even a 1-day Moon vedha can shift the emotional weather significantly.
            </div>
          </>
        )}

        {/* ── BIRTH NAKSHATRA PROFILE TAB ── */}
        {activeTab === "profile" && nak && (
          <>
            {/* Big nakshatra card */}
            <div style={{ background: "linear-gradient(135deg, rgba(200,160,48,0.1), rgba(200,160,48,0.03))", border: "1px solid rgba(200,160,48,0.3)", borderRadius: "14px", padding: "20px", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ background: "rgba(200,160,48,0.15)", borderRadius: "12px", padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#8880a8", marginBottom: "2px" }}>Birth</div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#c8a030" }}>{result.birthNakshatra}</div>
                  <div style={{ fontSize: "10px", color: "#8880a8" }}>Nakshatra #{result.janmaIndex + 1}</div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "#c8a030", fontWeight: 700, marginBottom: "4px" }}>{nak.trait}</div>
                  <div style={{ fontSize: "11px", color: "#8880a8", lineHeight: "1.6" }}>
                    Ruling Lord: <strong style={{ color: "#f0e8d0" }}>{nak.lord}</strong> &nbsp;·&nbsp;
                    Devata: <strong style={{ color: "#f0e8d0" }}>{nak.devata}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  ["Nature", nak.nature, nak.nature === "Deva" ? "#22c55e" : nak.nature === "Manava" ? "#f59e0b" : "#ef4444"],
                  ["Quality", nak.quality, "#60a5fa"],
                  ["Symbol", nak.symbol, "#c4b5fd"],
                  ["Body Zone", nak.body, "#f97316"],
                ].map(([k, v, c]) => (
                  <div key={String(k)} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "8px 10px" }}>
                    <div style={{ fontSize: "10px", color: "#8880a8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{k}</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: String(c) }}>{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain */}
            <div className="svb-card" style={{ padding: "16px" }}>
              <div className="section-title" style={{ color: "#c8a030" }}>Life Domain</div>
              <div style={{ fontSize: "13px", color: "#f0e8d0", marginBottom: "10px" }}>{nak.domain}</div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.75", background: "rgba(200,160,48,0.05)", border: "1px solid rgba(200,160,48,0.1)", borderRadius: "8px", padding: "10px 12px" }}>
                {nak.trait}. Your birth nakshatra is the cosmic frequency you were born into — it colors everything: your emotional responses, your deepest desires, your instinctive reactions, and the themes that recur throughout your life. Any planet transiting this nakshatra directly activates your core programming.
              </div>
            </div>

            {/* Health note */}
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "14px 16px", marginBottom: "12px" }}>
              <div style={{ fontWeight: 700, fontSize: "12px", color: "#fca5a5", marginBottom: "6px" }}>🏥 Health Pattern — {result.birthNakshatra}</div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.7" }}>{nak.healthNote} When malefic planets transit your janma nakshatra, these body areas and health patterns are at higher risk.</div>
            </div>

            {/* Sensitive zone ring */}
            <div className="svb-card" style={{ padding: "16px" }}>
              <div className="section-title" style={{ color: "#06b6d4" }}>Your 9 Sensitive Nakshatra Zones</div>
              <div style={{ fontSize: "11px", color: "#8880a8", marginBottom: "12px", lineHeight: "1.6" }}>
                These are the 9 positions that form your personal sensitive ring in the Sarvatobhadra Chakra. Any planet transiting these nakshatras creates an influence on your life — the zone name indicates what type of influence.
              </div>
              {[0,1,2,3,4,5,6,7,8].map(d => {
                const nakIdx = (result.janmaIndex + d) % 27;
                const nakName = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"][nakIdx];
                const zone = { 0: { name:"Janma", color:"#c8a030", intensity:"EXTREME" }, 1:{ name:"Sampat", color:"#22c55e", intensity:"HIGH" }, 2:{ name:"Vipat", color:"#ef4444", intensity:"HIGH" }, 3:{ name:"Kshema", color:"#22c55e", intensity:"MEDIUM" }, 4:{ name:"Pratyak", color:"#f97316", intensity:"HIGH" }, 5:{ name:"Sadhana", color:"#22c55e", intensity:"MEDIUM" }, 6:{ name:"Naidhana", color:"#ef4444", intensity:"HIGH" }, 7:{ name:"Mitra", color:"#22c55e", intensity:"MEDIUM" }, 8:{ name:"Parama Mitra", color:"#22c55e", intensity:"MEDIUM" } }[d] || { name:"Zone", color:"#8880a8", intensity:"MEDIUM" };
                return (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ minWidth: "22px", height: "22px", borderRadius: "50%", background: `${zone.color}22`, border: `1px solid ${zone.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: zone.color, fontWeight: 700 }}>{d}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, color: zone.color, fontSize: "12px" }}>{zone.name}</span>
                      <span style={{ color: "#8880a8", fontSize: "11px", marginLeft: "6px" }}>{nakName}</span>
                    </div>
                    <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "8px", background: `${INTENSITY_COLOR[zone.intensity as keyof typeof INTENSITY_COLOR]}15`, color: INTENSITY_COLOR[zone.intensity as keyof typeof INTENSITY_COLOR], fontWeight: 700 }}>
                      {zone.intensity}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── NATAL ZONES TAB ── */}
        {activeTab === "natal" && (
          <>
            <div className="knowledge-box">
              <strong style={{ color: "#06b6d4" }}>🪐 What Are Natal Sensitive Zones?</strong>
              <div style={{ marginTop: "6px" }}>
                When a natal planet in your birth chart permanently occupies one of your sensitive nakshatra zones, it means that planet&apos;s themes are continuously activated throughout your life. This creates a permanent &quot;background frequency&quot; of that zone&apos;s energy. Transit planets that additionally move through the same nakshatra amplify this natal signature — sometimes dramatically.
              </div>
            </div>

            {result.natalInSensitive.length === 0 ? (
              <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px", textAlign: "center", fontSize: "13px", color: "#86efac" }}>
                ✓ No natal planets occupy your sensitive nakshatra zones. Your sensitive ring is relatively unaffected by natal positions — transit effects remain temporary and situational.
              </div>
            ) : (
              result.natalInSensitive.map((n, i) => (
                <div key={i} className="svb-card" style={{ padding: "16px", borderLeft: `4px solid ${PLANET_COLOR[n.planet] || "#8880a8"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "20px" }}>{PLANET_EMOJI[n.planet]}</span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "13px", color: PLANET_COLOR[n.planet] }}>{n.planet}</span>
                      <span style={{ color: "#8880a8", fontSize: "12px", marginLeft: "6px" }}>in {n.nakshatra}</span>
                      <span style={{ marginLeft: "6px", background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.3)", borderRadius: "10px", padding: "1px 7px", fontSize: "10px", color: "#c8a030" }}>
                        {n.zoneName} Zone
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#8880a8", marginBottom: "8px" }}>{n.zoneDesc}</div>
                  <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.7", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "7px", padding: "9px 11px" }}>
                    {n.meaning}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── FULL GRID TAB ── */}
        {activeTab === "grid" && (
          <>
            <div style={{ fontSize: "12px", color: "#8880a8", marginBottom: "12px", lineHeight: "1.6" }}>
              All 27 nakshatras mapped with your sensitive zones highlighted. Gold = Janma (birth nakshatra) · Red = Vedha zone · Emoji = natal planet · Emoji↑ = transit planet today.
            </div>
            <div className="svb-card">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0a0820" }}>
                      {["#", "Nakshatra", "Zone", "Lord", "Nature", "Natal", "Transit Today"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#8880a8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1c1840" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map(row => {
                      const isJanma = row.type === "janma";
                      const isVedha = row.type === "vedha";
                      const nak27data = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
                      const nk = row.nakName;
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const _ = nak27data;
                      const nkData = (typeof nk === 'string') ? (result.birthNakshatraData && row.index === result.janmaIndex ? result.birthNakshatraData : null) : null;
                      void nkData;
                      return (
                        <tr key={row.index} style={{ background: isJanma ? "rgba(200,160,48,0.07)" : isVedha ? "rgba(239,68,68,0.04)" : "transparent", borderBottom: "1px solid #1c1840" }}>
                          <td style={{ padding: "7px 10px", fontSize: "11px", color: "#8880a8" }}>{row.index + 1}</td>
                          <td style={{ padding: "7px 10px", fontSize: "12px", fontWeight: isJanma ? 700 : isVedha ? 600 : 400, color: isJanma ? "#c8a030" : isVedha ? "#ef4444" : "#f0e8d0" }}>
                            {isJanma ? "⭐ " : isVedha ? "⚠️ " : ""}{row.nakName}
                          </td>
                          <td style={{ padding: "7px 10px", fontSize: "10px", color: isJanma ? "#c8a030" : isVedha ? "#f97316" : "#4a4870" }}>
                            {row.vedZoneName || "—"}
                          </td>
                          <td style={{ padding: "7px 10px", fontSize: "11px", color: "#8880a8" }}>
                            {/* lord would need nakshatra data lookup */}—
                          </td>
                          <td style={{ padding: "7px 10px", fontSize: "10px" }}>
                            {isJanma ? <span style={{ color: "#c8a030" }}>Janma</span> : isVedha ? <span style={{ color: "#ef4444" }}>Vedha</span> : <span style={{ color: "#4a4870" }}>Neutral</span>}
                          </td>
                          <td style={{ padding: "7px 10px" }}>
                            {row.natalPlanets.map(p => (
                              <span key={p} className="planet-tag" style={{ background: `${PLANET_COLOR[p]}11`, borderColor: `${PLANET_COLOR[p]}33`, color: PLANET_COLOR[p] }}>
                                {PLANET_EMOJI[p]} {p}
                              </span>
                            ))}
                          </td>
                          <td style={{ padding: "7px 10px" }}>
                            {row.transitPlanets.map(p => (
                              <span key={p} className="planet-tag" style={{ background: `${PLANET_COLOR[p]}18`, borderColor: `${PLANET_COLOR[p]}44`, color: PLANET_COLOR[p] }}>
                                {PLANET_EMOJI[p]} {p}↑
                              </span>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── HOW TO READ TAB ── */}
        {activeTab === "guide" && (
          <>
            <div className="svb-card" style={{ padding: "18px" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#06b6d4", marginBottom: "12px", fontFamily: "'Cormorant Garamond', serif" }}>
                What is the Sarvatobhadra Chakra?
              </div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.85" }}>
                <p style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "#f0e8d0" }}>Sarvatobhadra Chakra</strong> (SBC) is one of the most sophisticated transit analysis systems in classical Vedic astrology, described in ancient Muhurta texts including Muhurta Chintamani and Muhurta Ganapati. The word itself means <em style={{ color: "#c8a030" }}>&quot;auspicious in all directions&quot;</em> — and the chakra maps cosmic influences across all 27 nakshatras.
                </p>
                <p style={{ marginBottom: "10px" }}>
                  Unlike Western transit analysis which tracks planets through zodiac signs, SBC works at the nakshatra level — the 27 lunar mansions that divide the sky into equal 13°20&apos; segments. Each nakshatra carries a specific divine frequency, ruling planet, and life domain.
                </p>
                <p style={{ marginBottom: "10px" }}>
                  The system identifies your <strong style={{ color: "#c8a030" }}>Janma Nakshatra</strong> (birth Moon nakshatra) as the most sensitive point in the chart. Around it, 8 additional positions called <strong style={{ color: "#c8a030" }}>Tara Chakra zones</strong> form a protective and reactive ring. When any planet transits these 9 zones, it creates a <strong style={{ color: "#ef4444" }}>Vedha</strong> (obstruction or activation) — the type of effect depends entirely on which planet and which zone.
                </p>
              </div>
            </div>

            <div className="svb-card" style={{ padding: "18px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#c8a030", marginBottom: "12px" }}>The 9 Tara Chakra Zones</div>
              {[
                { name:"Janma", pos:"0 (birth position)", color:"#c8a030", meaning:"Most intense. Any planet here directly activates your core life frequency. Malefics = serious events. Benefics = major opportunities." },
                { name:"Sampat", pos:"1 ahead", color:"#22c55e", meaning:"Wealth and resources zone. Benefic transits = financial gains. Malefic = financial stress or drain." },
                { name:"Vipat", pos:"2 ahead", color:"#ef4444", meaning:"Danger zone. Malefic transits = obstacles, health risks, accidents. Avoid major undertakings." },
                { name:"Kshema", pos:"3 ahead", color:"#22c55e", meaning:"Wellbeing zone. Generally supportive for health, home, domestic peace." },
                { name:"Pratyak", pos:"4 ahead", color:"#f97316", meaning:"Obstruction zone. Plans face reversals and blockages. Patience required." },
                { name:"Sadhana", pos:"5 ahead", color:"#22c55e", meaning:"Achievement zone. Supports effort, career progress and accomplishment." },
                { name:"Naidhana", pos:"6 ahead", color:"#ef4444", meaning:"Destruction zone — most feared. Serious malefic transits here require immediate remedies." },
                { name:"Mitra", pos:"7 ahead", color:"#22c55e", meaning:"Friend zone. Brings helpful people, alliances and social support." },
                { name:"Parama Mitra", pos:"8 ahead", color:"#22c55e", meaning:"Best friend zone. Highest benefic potential — grace, profound support and divine assistance." },
              ].map(z => (
                <div key={z.name} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ minWidth: "90px" }}>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: z.color }}>{z.name}</div>
                    <div style={{ fontSize: "10px", color: "#8880a8" }}>{z.pos}</div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#b8b0d8", lineHeight: "1.6" }}>{z.meaning}</div>
                </div>
              ))}
            </div>

            <div className="svb-card" style={{ padding: "18px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#a855f7", marginBottom: "12px" }}>How to Use This Page Daily</div>
              <div style={{ fontSize: "12px", color: "#b8b0d8", lineHeight: "1.85" }}>
                {[
                  ["Check alerts daily", "The Moon moves one nakshatra per day — your emotional weather changes daily based on whether the Moon is in your sensitive zones."],
                  ["Watch for Saturn + Rahu janma vedha", "These are the most serious transits in Vedic astrology. When either planet directly transits your janma nakshatra, engage remedies proactively."],
                  ["Jupiter janma vedha is a gift", "When Jupiter transits your janma nakshatra, this is among the most auspicious periods of the year. Use it — start new ventures, seek blessings, make important life decisions."],
                  ["Natal planets in sensitive zones", "These create a permanent background activation — check the Natal Zones tab to understand your life's recurring themes."],
                  ["Remedies are proportional", "Use the severity and duration of each alert to calibrate your remedy intensity. A 2-day Moon vedha needs light practice. A 40-day Saturn janma vedha requires consistent daily remedies."],
                ].map(([title, desc]) => (
                  <div key={String(title)} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "#f0e8d0" }}>• {title}:</strong>
                    <span style={{ color: "#b8b0d8", marginLeft: "6px" }}>{String(desc)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      <MobileBottomNav />
    </main>
  );
}
