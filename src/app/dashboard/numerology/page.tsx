"use client";
import { useState } from "react";
import "@/app/dashboard/shared.css";
import { calculateNumerology, type NumerologyNumber } from "@/lib/astro-engine/numerology";

const DEMO = { name: "Mukul Pal", dob: "1995-07-04" };

// ── Number Card ───────────────────────────────────────────────
function NumCard({ n, expanded, onToggle }: { n: NumerologyNumber; expanded: boolean; onToggle: () => void }) {
  return (
    <div
      className="card"
      style={{ cursor: "pointer", borderColor: expanded ? `${n.color}55` : "#1c1840", transition: "border-color 0.2s" }}
      onClick={onToggle}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            fontFamily: "Cormorant Garamond,serif", fontSize: 52, fontWeight: 700,
            color: n.color, lineHeight: 1, minWidth: 52, textAlign: "center",
          }}>
            {n.value}
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 4 }}>{n.label}</div>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: "#f0e8d0" }}>{n.archetype}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 14, color: n.color }}>{n.planetIcon}</span>
              <span style={{ fontSize: 11, color: "#605890" }}>{n.planet}</span>
              <span className="badge badge-gold" style={{ fontSize: 9 }}>{n.keyword}</span>
              {n.isMaster && <span className="badge" style={{ fontSize: 9, background: "rgba(200,160,48,0.15)", color: "#f0d898", border: "1px solid rgba(200,160,48,0.3)" }}>MASTER</span>}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11, color: "#3a3060", marginTop: 4 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.7, marginBottom: expanded ? 16 : 0 }}>{n.theme}</div>

      {expanded && (
        <div style={{ borderTop: "1px solid #1c1840", paddingTop: 16, marginTop: 4 }}>
          <p style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.85, marginBottom: 16 }}>{n.desc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, color: "#22c55e", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Strengths</div>
              {n.strengths.map(s => (
                <div key={s} style={{ fontSize: 12, color: "#c8c0a8", marginBottom: 4 }}>✦ {s}</div>
              ))}
            </div>
            <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, color: "#ef4444", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Challenges</div>
              {n.challenges.map(c => (
                <div key={c} style={{ fontSize: 12, color: "#c8c0a8", marginBottom: 4 }}>⚠ {c}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#605890" }}>Lucky days: <span style={{ color: "#c8a030" }}>{n.luckyDays}</span></span>
            <span style={{ fontSize: 11, color: "#605890" }}>Compatible: {n.compatibleWith.map(x => (
              <span key={x} style={{ display: "inline-block", width: 22, height: 22, lineHeight: "22px", textAlign: "center", borderRadius: "50%", background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.2)", fontSize: 11, color: "#c8a030", marginLeft: 4 }}>{x}</span>
            ))}</span>
            <div style={{ display: "flex", gap: 5, marginLeft: "auto" }}>
              {n.luckyColors.map(c => (
                <div key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function NumerologyPage() {
  const [activeTab, setActiveTab] = useState<"numbers" | "name" | "year">("numbers");
  const [expanded, setExpanded]   = useState<string | null>("Life Path");

  const result = calculateNumerology(DEMO.name, DEMO.dob);
  const { lifePath, destiny, soulUrge, personality, birthday, maturity, personalYear, nameBreakdown, monthForecast } = result;

  const numbers: NumerologyNumber[] = [lifePath, destiny, soulUrge, personality, birthday, maturity, personalYear];

  const currentYear = new Date().getFullYear();

  return (
    <div className="page">
      <div className="page-tag">🔢 Numerology Engine</div>
      <h1 className="page-title serif">Your Numbers, <em>Decoded</em></h1>
      <p className="page-sub">Pythagorean system · 7 core numbers · Vedic planet mapping · {currentYear} forecast</p>

      {/* HEADER CARD */}
      <div className="header-card">
        <div className="header-orb" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a030", marginBottom: 6 }}>🔢 Numerology Profile</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 600, color: "#f0e8d0" }}>{DEMO.name}</div>
          <div style={{ fontSize: 13, color: "#605890", marginTop: 4 }}>
            {new Date(DEMO.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          {[
            { n: lifePath.value,    l: "LIFE PATH",    c: lifePath.color },
            { n: destiny.value,     l: "DESTINY",      c: destiny.color },
            { n: personalYear.value,l: "PERSONAL YEAR",c: personalYear.color },
          ].map(s => (
            <div key={s.l} className="hstat">
              <div className="hstat-n" style={{ color: s.c }}>{s.n}</div>
              <div className="hstat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="summary-strip">🔢 {result.summary}</div>

      {/* TABS */}
      <div className="tabs">
        {([["numbers", "Core Numbers"], ["name", "Name Analysis"], ["year", `${currentYear} Forecast`]] as const).map(([t, l]) => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{l}</button>
        ))}
      </div>

      {/* ── NUMBERS TAB ── */}
      {activeTab === "numbers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {numbers.map(n => (
            <NumCard
              key={n.label}
              n={n}
              expanded={expanded === n.label}
              onToggle={() => setExpanded(expanded === n.label ? null : n.label)}
            />
          ))}
        </div>
      )}

      {/* ── NAME TAB ── */}
      {activeTab === "name" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Letter grid */}
          <div className="card">
            <div className="card-tag">✦ Pythagorean Name Chart</div>
            <div className="card-title serif">{DEMO.name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {nameBreakdown.map((l, i) =>
                l.letter === " " ? (
                  <div key={i} style={{ width: 12 }} />
                ) : (
                  <div key={i} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    background: l.isVowel ? "rgba(236,72,153,0.08)" : "rgba(96,165,250,0.08)",
                    border: `1px solid ${l.isVowel ? "rgba(236,72,153,0.25)" : "rgba(96,165,250,0.25)"}`,
                    borderRadius: 8, padding: "8px 10px", minWidth: 36,
                  }}>
                    <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: l.isVowel ? "#ec4899" : "#60a5fa" }}>{l.letter}</span>
                    <span style={{ fontSize: 11, color: l.isVowel ? "#ec4899" : "#60a5fa", fontWeight: 600 }}>{l.value}</span>
                  </div>
                )
              )}
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#605890" }}>
              <span><span style={{ color: "#ec4899" }}>■</span> Vowels (Soul Urge)</span>
              <span><span style={{ color: "#60a5fa" }}>■</span> Consonants (Personality)</span>
            </div>
          </div>

          {/* Three name numbers */}
          <div className="grid-3">
            {[destiny, soulUrge, personality].map(n => (
              <div key={n.label} className="card" style={{ textAlign: "center", borderColor: `${n.color}22` }}>
                <div style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 8 }}>{n.label}</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 48, fontWeight: 700, color: n.color, lineHeight: 1, marginBottom: 8 }}>{n.value}</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, color: "#f0e8d0", marginBottom: 6 }}>{n.archetype}</div>
                <div style={{ fontSize: 11, color: "#605890", marginBottom: 8 }}>{n.planetIcon} {n.planet}</div>
                <div style={{ fontSize: 11, color: "#c8c0a8", lineHeight: 1.6 }}>{n.theme}</div>
              </div>
            ))}
          </div>

          {/* What each name number means */}
          <div className="card">
            <div className="card-tag">✦ What Your Name Numbers Mean</div>
            {[
              { num: destiny,     role: "All letters", meaning: "Your outer purpose — what you are meant to accomplish and how the world sees your potential." },
              { num: soulUrge,    role: "Vowels only", meaning: "Your inner motivation — the deepest desire of your soul that drives every decision from within." },
              { num: personality, role: "Consonants",  meaning: "Your outer mask — how you present yourself to the world before people know you deeply." },
            ].map(({ num, role, meaning }) => (
              <div key={num.label} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid #1c1840" }}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 700, color: num.color, minWidth: 36, textAlign: "center" }}>{num.value}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f0e8d0", marginBottom: 2 }}>{num.label} <span style={{ fontSize: 10, color: "#605890", fontWeight: 400 }}>({role})</span></div>
                  <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.65 }}>{meaning}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── YEAR TAB ── */}
      {activeTab === "year" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Personal Year big card */}
          <div className="card" style={{ borderColor: `${personalYear.color}33` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", minWidth: 100 }}>
                <div style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 8 }}>Personal Year</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 80, fontWeight: 700, color: personalYear.color, lineHeight: 1 }}>{personalYear.value}</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, color: "#f0e8d0", marginTop: 8 }}>{personalYear.archetype}</div>
                {personalYear.isMaster && (
                  <span className="badge" style={{ marginTop: 8, fontSize: 9, background: "rgba(200,160,48,0.15)", color: "#f0d898", border: "1px solid rgba(200,160,48,0.3)" }}>MASTER NUMBER</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: personalYear.color, marginBottom: 8 }}>{personalYear.keyword} · {currentYear}</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 600, color: "#f0e8d0", marginBottom: 12, lineHeight: 1.3 }}>
                  {personalYear.theme}
                </div>
                <p style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.85, marginBottom: 16 }}>{personalYear.desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, color: "#22c55e", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Focus On</div>
                    {personalYear.strengths.map(s => (
                      <div key={s} style={{ fontSize: 11, color: "#c8c0a8", marginBottom: 3 }}>✦ {s}</div>
                    ))}
                  </div>
                  <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, color: "#ef4444", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Watch For</div>
                    {personalYear.challenges.map(c => (
                      <div key={c} style={{ fontSize: 11, color: "#c8c0a8", marginBottom: 3 }}>⚠ {c}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly forecast grid */}
          <div className="card">
            <div className="card-tag">✦ Month-by-Month Energy</div>
            <div className="card-title serif">{currentYear} Monthly Guide</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {monthForecast.map(m => (
                <div key={m.month} style={{
                  background: m.isCurrent ? "rgba(200,160,48,0.06)" : "rgba(0,0,0,0.2)",
                  border: `1px solid ${m.isCurrent ? "rgba(200,160,48,0.35)" : "#1c1840"}`,
                  borderRadius: 12, padding: "14px 14px",
                  position: "relative",
                }}>
                  {m.isCurrent && (
                    <div style={{ position: "absolute", top: -10, left: 12, background: "#c8a030", color: "#060410", fontSize: 8, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: "1px", textTransform: "uppercase" }}>NOW</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: m.isCurrent ? "#c8a030" : "#c8c0a8" }}>{m.monthName}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 13 }}>{m.icon}</span>
                      <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 700, color: m.isMaster ? "#c8a030" : "#605890" }}>{m.energy}</span>
                      {m.isMaster && <span style={{ fontSize: 8, color: "#c8a030" }}>★</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#605890", lineHeight: 1.5 }}>{m.theme}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 9-year cycle */}
          <div className="card">
            <div className="card-tag">✦ Your 9-Year Cycle</div>
            <div className="card-title serif">Where You Are in the Journey</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Array.from({ length: 9 }, (_, i) => {
                const yr = currentYear - (personalYear.value - 1) + i;
                const py = i + 1;
                const isCurr = yr === currentYear;
                return (
                  <div key={i} style={{
                    flex: 1, minWidth: 64, textAlign: "center",
                    padding: "12px 8px", borderRadius: 10,
                    background: isCurr ? "rgba(200,160,48,0.1)" : "rgba(0,0,0,0.2)",
                    border: `1px solid ${isCurr ? "rgba(200,160,48,0.35)" : "#1c1840"}`,
                  }}>
                    <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 700, color: isCurr ? "#c8a030" : "#3a3060" }}>{py}</div>
                    <div style={{ fontSize: 10, color: isCurr ? "#c8c0a8" : "#3a3060", marginTop: 2 }}>{yr}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: "#605890", lineHeight: 1.7 }}>
              You are in Year <strong style={{ color: "#c8a030" }}>{personalYear.value}</strong> of your 9-year cycle.
              {personalYear.value <= 3
                ? " The cycle is in its early phase — plant seeds and build momentum."
                : personalYear.value <= 6
                ? " The cycle is in its active phase — harvest what you've built and expand."
                : " The cycle is in its completion phase — release what no longer serves and prepare for renewal."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
