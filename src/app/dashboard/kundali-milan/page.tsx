"use client";
import { useState } from "react";
import "@/app/dashboard/shared.css";
import {
  calculateMilan, NAKSHATRAS_27, RASHIS_12,
  type MilanResult, type KootScore,
} from "@/lib/astro-engine/kundali-milan";

// ── Helpers ───────────────────────────────────────────────────
function ScoreRing({ score, max, color }: { score: number; max: number; color: string }) {
  const pct = score / max;
  const r = 36, circ = 2 * Math.PI * r;
  return (
    <svg width={88} height={88} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={44} cy={44} r={r} fill="none" stroke="#1c1840" strokeWidth={7} />
      <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

function KootCard({ k }: { k: KootScore }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      background: "#0d0b24", border: `1px solid ${open ? k.color + "55" : "#1c1840"}`,
      borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Mini ring */}
        <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={26} cy={26} r={20} fill="none" stroke="#1c1840" strokeWidth={5} />
            <circle cx={26} cy={26} r={20} fill="none" stroke={k.color} strokeWidth={5}
              strokeDasharray={2 * Math.PI * 20}
              strokeDashoffset={2 * Math.PI * 20 * (1 - k.percentage / 100)}
              strokeLinecap="round" />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center",
            justifyContent: "center", fontFamily: "Cormorant Garamond,serif",
            fontSize: 14, fontWeight: 700, color: k.color,
          }}>{k.points}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 600, color: "#f0e8d0" }}>{k.name}</span>
            <span style={{ fontSize: 11, color: "#605890" }}>{k.hindiName}</span>
            {k.hasDosha && (
              <span style={{ fontSize: 9, fontWeight: 700, background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, padding: "1px 6px" }}>DOSHA</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "#605890" }}>{k.meaning}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#3a3060", fontWeight: 600 }}>{k.points}/{k.maxPoints}</div>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
            background: k.status === "Excellent" ? "rgba(34,197,94,0.12)" : k.status === "Good" ? "rgba(200,160,48,0.12)" : k.status === "Average" ? "rgba(249,115,22,0.12)" : "rgba(239,68,68,0.12)",
            color: k.color, border: `1px solid ${k.color}33`,
          }}>{k.status}</span>
        </div>
        <span style={{ fontSize: 10, color: "#3a3060", marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1c1840" }}>
          <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.8, marginBottom: k.hasDosha ? 10 : 0 }}>{k.detail}</div>
          {k.hasDosha && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#ef4444" }}>
              ⚠️ {k.doshaText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Input Form ────────────────────────────────────────────────
interface PersonInput { name: string; nakIdx: number; rashiIdx: number; }

function PersonForm({
  label, color, value, onChange,
}: { label: string; color: string; value: PersonInput; onChange: (v: PersonInput) => void }) {
  return (
    <div style={{ background: "#0d0b24", border: `1px solid ${color}33`, borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color, marginBottom: 12 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="Full name"
          value={value.name}
          onChange={e => onChange({ ...value, name: e.target.value })}
          style={{
            background: "#08051a", border: "1px solid #1c1840", borderRadius: 8, padding: "10px 14px",
            color: "#f0e8d0", fontSize: 13, outline: "none", width: "100%", fontFamily: "Outfit,sans-serif",
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: "#605890", marginBottom: 4, letterSpacing: "1px" }}>JANMA NAKSHATRA</div>
            <select
              value={value.nakIdx}
              onChange={e => onChange({ ...value, nakIdx: Number(e.target.value) })}
              style={{
                background: "#08051a", border: "1px solid #1c1840", borderRadius: 8, padding: "10px 12px",
                color: "#f0e8d0", fontSize: 12, width: "100%", outline: "none", fontFamily: "Outfit,sans-serif",
              }}
            >
              {NAKSHATRAS_27.map((n, i) => <option key={i} value={i}>{n}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#605890", marginBottom: 4, letterSpacing: "1px" }}>JANMA RASHI</div>
            <select
              value={value.rashiIdx}
              onChange={e => onChange({ ...value, rashiIdx: Number(e.target.value) })}
              style={{
                background: "#08051a", border: "1px solid #1c1840", borderRadius: 8, padding: "10px 12px",
                color: "#f0e8d0", fontSize: 12, width: "100%", outline: "none", fontFamily: "Outfit,sans-serif",
              }}
            >
              {RASHIS_12.map((r, i) => <option key={i} value={i}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function KundaliMilanPage() {
  const [p1, setP1] = useState<PersonInput>({ name: "Mukul", nakIdx: 3, rashiIdx: 3 });
  const [p2, setP2] = useState<PersonInput>({ name: "Priya", nakIdx: 10, rashiIdx: 4 });
  const [result, setResult] = useState<MilanResult | null>(null);
  const [activeTab, setActiveTab] = useState<"koots" | "insight" | "doshas">("koots");

  function calculate() {
    const r = calculateMilan(
      p1.name || "Person 1", p1.nakIdx, p1.rashiIdx,
      p2.name || "Person 2", p2.nakIdx, p2.rashiIdx,
    );
    setResult(r);
    setActiveTab("koots");
  }

  return (
    <div className="page">
      <div className="page-tag">💑 Kundali Milan</div>
      <h1 className="page-title serif">Ashtakoot <em>Compatibility</em></h1>
      <p className="page-sub">36-Point Gun Milan · 8 Koots · Dosha Analysis · Psychological Insight</p>

      {/* INPUT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <PersonForm label="👨 Ladke ki Janam Patrika" color="#c8a030" value={p1} onChange={setP1} />
        <PersonForm label="👩 Ladki ki Janam Patrika" color="#e879f9" value={p2} onChange={setP2} />
      </div>

      {/* CALCULATE BUTTON */}
      <button
        onClick={calculate}
        style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#c8a030,#a06820)", color: "#08051a",
          fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 700,
          letterSpacing: "1px", marginBottom: 24,
        }}
      >
        💑 Milan Karein — Ashtakoot Calculate
      </button>

      {/* RESULT */}
      {result && (
        <>
          {/* BIG SCORE HEADER */}
          <div className="header-card" style={{ marginBottom: 16 }}>
            <div className="header-orb" />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              {/* Ring */}
              <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
                <ScoreRing score={result.totalScore} max={36} color={result.verdictColor} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 700, color: result.verdictColor, lineHeight: 1 }}>{result.totalScore}</div>
                  <div style={{ fontSize: 9, color: "#605890" }}>out of 36</div>
                </div>
              </div>
              {/* Names + verdict */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 4 }}>Compatibility Result</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "#f0e8d0", marginBottom: 6 }}>
                  {result.person1Name} <span style={{ color: "#e879f9" }}>💑</span> {result.person2Name}
                </div>
                <div style={{ fontSize: 12, color: "#605890", marginBottom: 8 }}>
                  {result.person1Nak} ({result.person1Rashi}) × {result.person2Nak} ({result.person2Rashi})
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6, background: `${result.verdictColor}18`,
                  border: `1px solid ${result.verdictColor}44`, borderRadius: 8, padding: "4px 12px",
                }}>
                  <span style={{ fontSize: 14 }}>{result.verdictIcon}</span>
                  <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 700, color: result.verdictColor }}>{result.verdict}</span>
                  <span style={{ fontSize: 11, color: "#605890" }}>· {result.percentage}%</span>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="hstat">
                  <div className="hstat-n" style={{ color: result.verdictColor }}>{result.totalScore}/36</div>
                  <div className="hstat-l">GUN SCORE</div>
                </div>
                <div className="hstat">
                  <div className="hstat-n" style={{ color: result.doshas.length === 0 ? "#22c55e" : "#ef4444" }}>{result.doshas.length}</div>
                  <div className="hstat-l">DOSHAS</div>
                </div>
                <div className="hstat">
                  <div className="hstat-n">{result.percentage}%</div>
                  <div className="hstat-l">MATCH</div>
                </div>
              </div>
            </div>
          </div>

          {/* RECOMMENDATION STRIP */}
          <div className="summary-strip" style={{ marginBottom: 16, borderColor: `${result.verdictColor}44`, color: "#c8c0a8" }}>
            {result.verdictIcon} {result.recommendation}
          </div>

          {/* TABS */}
          <div className="tabs" style={{ marginBottom: 16 }}>
            {([["koots","8 Koots"],["insight","Psychology"],["doshas","Doshas"]] as const).map(([t, l]) => (
              <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{l}</button>
            ))}
          </div>

          {/* ── KOOTS TAB ── */}
          {activeTab === "koots" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="card" style={{ marginBottom: 4 }}>
                <div className="card-tag">✦ 8 Koot Analysis</div>
                <div className="card-title serif">Ashtakoot Breakdown — Tap any koot for detail</div>
                {/* Score bar overview */}
                <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                  {result.koots.map(k => (
                    <div key={k.name} style={{ flex: k.maxPoints, height: 6, background: k.color, borderRadius: 3, opacity: k.points === 0 ? 0.2 : 0.85 }} title={`${k.name}: ${k.points}/${k.maxPoints}`} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#3a3060", marginTop: 4 }}>
                  <span>Varna</span><span>Vashya</span><span>Tara</span><span>Yoni</span><span>Maitri</span><span>Gana</span><span>Bhakut</span><span>Nadi</span>
                </div>
              </div>
              {result.koots.map(k => <KootCard key={k.name} k={k} />)}
            </div>
          )}

          {/* ── INSIGHT TAB ── */}
          {activeTab === "insight" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="card">
                <div className="card-tag">✦ Psychological Compatibility</div>
                <div className="card-title serif">Scientific Meaning of Ashtakoot</div>
                <div style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.9, marginBottom: 16 }}>
                  {result.psychologicalInsight}
                </div>
                <div style={{ borderTop: "1px solid #1c1840", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { koot:"Varna", psych:"Value System & Spiritual Hierarchy", desc:"Compatibility of life values, ambitions, and spiritual orientation. When aligned, partners move in the same direction." },
                    { koot:"Vashya", psych:"Control Dynamics", desc:"Natural attraction and dominance balance. Determines who leads and who follows in daily life without conflict." },
                    { koot:"Tara", psych:"Luck Harmony", desc:"Whether partners bring out good luck in each other or create recurring karmic friction in life events." },
                    { koot:"Yoni", psych:"Instinct & Physical Bond", desc:"Animal archetype compatibility — the deep instinctual and physical layer of attraction and intimacy." },
                    { koot:"Graha Maitri", psych:"Mental Friendship", desc:"Intellectual alignment. Whether the mind naturally understands and supports the other's thought patterns." },
                    { koot:"Gana", psych:"Temperament Type", desc:"Deva (spiritual/gentle), Manushya (practical), Rakshasa (intense/passionate). Temperament clash is the most visible day-to-day friction." },
                    { koot:"Bhakut", psych:"Emotional Direction", desc:"Whether emotional energy flows toward or away from each other. Misalignment creates financial and health strain." },
                    { koot:"Nadi", psych:"Biological Compatibility", desc:"DNA-level compatibility. Same nadi indicates potential health challenges in offspring. Highest weighted koot." },
                  ].map(item => (
                    <div key={item.koot} style={{ display: "flex", gap: 12, paddingBottom: 10, borderBottom: "1px solid #1c1840" }}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 13, fontWeight: 600, color: "#c8a030", minWidth: 90 }}>{item.koot}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#f0e8d0", marginBottom: 2 }}>{item.psych}</div>
                        <div style={{ fontSize: 11, color: "#605890", lineHeight: 1.7 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DOSHAS TAB ── */}
          {activeTab === "doshas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {result.doshas.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: 32, borderColor: "rgba(34,197,94,0.3)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>No Doshas Detected</div>
                  <div style={{ fontSize: 13, color: "#605890" }}>This is a clean compatibility profile. All 8 koots are free of major doshas. A rare and auspicious result.</div>
                </div>
              ) : (
                <>
                  <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                    <div className="card-tag" style={{ color: "#ef4444" }}>⚠️ Doshas Detected</div>
                    <div className="card-title serif">{result.doshas.length} Dosha{result.doshas.length > 1 ? "s" : ""} Found</div>
                    <div style={{ fontSize: 12, color: "#605890", lineHeight: 1.8, marginBottom: 14 }}>
                      Doshas are compatibility stresses — not curses. Every dosha has traditional remedies. Consult a qualified jyotishi for personalized guidance.
                    </div>
                    {result.koots.filter(k => k.hasDosha).map(k => (
                      <div key={k.name} style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                        <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 600, color: "#ef4444", marginBottom: 4 }}>{k.name} Dosha</div>
                        <div style={{ fontSize: 12, color: "#c8c0a8", marginBottom: 8 }}>{k.doshaText}</div>
                        <div style={{ fontSize: 11, color: "#605890" }}>{k.detail}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-tag">💊 Dosha Remedies</div>
                    <div className="card-title serif">Traditional Remedies</div>
                    {result.koots.filter(k => k.hasDosha).map(k => (
                      <div key={k.name} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #1c1840" }}>
                        <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 14, fontWeight: 600, color: "#c8a030", marginBottom: 6 }}>{k.name} Dosha Remedy</div>
                        <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.8 }}>
                          {k.name === "Nadi" && "Perform Nadi Dosha Nivarana Puja at a Shiva temple. Mahamrityunjaya Jaap (1,25,000 times). Donate dakshina on behalf of both families. Some shastra allow Nadi Dosha cancellation if both nakshatras have different padas."}
                          {k.name === "Bhakut" && "Bhakut Dosha is cancelled if both rashi lords are friends or the same. Perform Rudrabhishek together. Consult jyotishi for specific graha shanti."}
                          {k.name === "Gana" && "Gana Dosha is reduced if Nadi scores full 8 points. Kashi Vishwanath darshan and Shiva-Parvati worship helps harmonize temperament. Open communication is the real remedy."}
                          {k.name === "Tara" && "Perform Nakshatra Shanti puja for the birth nakshatras of both individuals. Worship the nakshatra devata. Graha shanti based on nakshatra lord."}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* EDUCATIONAL SECTION — always visible */}
      {!result && (
        <div className="card">
          <div className="card-tag">✦ About Ashtakoot Milan</div>
          <div className="card-title serif">The Science of Vedic Compatibility</div>
          <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.9, marginBottom: 16 }}>
            Ashtakoot Milan is the traditional Vedic system for analyzing compatibility between two individuals based on their Moon Nakshatra and Rashi. The 36-point system evaluates 8 dimensions (koots) of compatibility — from biological to spiritual.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { k:"Varna (1pt)", d:"Value & spiritual hierarchy" },
              { k:"Vashya (2pt)", d:"Mutual attraction & control" },
              { k:"Tara (3pt)", d:"Luck & destiny harmony" },
              { k:"Yoni (4pt)", d:"Instinct & physical bond" },
              { k:"Graha Maitri (5pt)", d:"Mental friendship" },
              { k:"Gana (6pt)", d:"Temperament compatibility" },
              { k:"Bhakut (7pt)", d:"Emotional direction & flow" },
              { k:"Nadi (8pt)", d:"Biological & health compatibility" },
            ].map(item => (
              <div key={item.k} style={{ background: "#08051a", borderRadius: 8, padding: "10px 12px", border: "1px solid #1c1840" }}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 13, fontWeight: 600, color: "#c8a030", marginBottom: 2 }}>{item.k}</div>
                <div style={{ fontSize: 11, color: "#605890" }}>{item.d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(200,160,48,0.06)", borderRadius: 8, border: "1px solid rgba(200,160,48,0.15)", fontSize: 12, color: "#c8c0a8", lineHeight: 1.8 }}>
            <strong style={{ color: "#c8a030" }}>Scoring Guide:</strong> 28–36 = Excellent · 21–27 = Good · 18–20 = Average · Below 18 = Careful needed. Note: Score alone doesn't decide compatibility — dosha analysis and full chart comparison matter equally.
          </div>
        </div>
      )}
    </div>
  );
}
