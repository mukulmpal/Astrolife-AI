// src/app/dashboard/psychology/page.tsx
// ============================================================
// ASTROLIFE PSYCHOLOGY & COGNITIVE NEURO-ASTROLOGY PAGE
// Combines:
// 1. Antahkarana Chatushtaya (Manas, Buddhi, Ahamkara, Chitta)
// 2. Triguna Distribution (Sattva, Rajas, Tamas)
// 3. Big Five (OCEAN) Psychometrics
// 4. Cognitive Distortions & CBT / Shadow Work Reframing
// 5. Circadian Peak Timing
// 6. Deep Storytelling Prose
// ============================================================

"use client";
import { useState, useMemo } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import "@/app/dashboard/shared.css";
import { calculatePsychology } from "@/lib/astro-engine/psychology";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";
import { Brain, Sparkles, Clock, Compass, ShieldCheck, Activity } from "lucide-react";

// Radar SVG
function PsychRadar({ vals, colors }: { vals: number[]; colors: string[] }) {
  const S = 200, cx = 100, cy = 100, R = 75, n = vals.length;
  const labels = ["Anxiety", "Karma", "Bias", "Logic", "Wisdom", "Love"];
  const pts = vals.map((v, i) => ({
    x: cx + (v / 100) * R * Math.cos((i / n) * 2 * Math.PI - Math.PI / 2),
    y: cy + (v / 100) * R * Math.sin((i / n) * 2 * Math.PI - Math.PI / 2),
  }));
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth: 200, display: "block", margin: "0 auto" }}>
      <rect width={S} height={S} fill="#FAF7F2" rx="8" />
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          fill="none"
          stroke="#E5E0D8"
          strokeWidth="0.5"
          points={Array.from({ length: n }, (_, i) => `${cx + R * f * Math.cos((i / n) * 2 * Math.PI - Math.PI / 2)},${cy + R * f * Math.sin((i / n) * 2 * Math.PI - Math.PI / 2)}`).join(" ")}
        />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + R * Math.cos((i / n) * 2 * Math.PI - Math.PI / 2)}
          y2={cy + R * Math.sin((i / n) * 2 * Math.PI - Math.PI / 2)}
          stroke="#E5E0D8"
          strokeWidth="0.5"
        />
      ))}
      <polygon
        fill="rgba(236,72,153,0.15)"
        stroke="#ec4899"
        strokeWidth="1.5"
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
      />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI - Math.PI / 2;
        return (
          <text
            key={i}
            x={cx + (R + 16) * Math.cos(a)}
            y={cy + (R + 16) * Math.sin(a)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7.5"
            fill={colors[i]}
            fontFamily="Outfit"
            fontWeight="600"
          >
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}

export default function PsychPage() {
  const [activeTab, setActiveTab] = useState<"vedic_mind" | "pattern" | "planets" | "bigfive" | "guide">("vedic_mind");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { birth, chart } = useUserChart();
  const { t } = useLanguage();

  const result = useMemo(() => {
    if (!chart?.planets) return null;
    return calculatePsychology(chart.planets as never);
  }, [chart?.planets]);

  if (!birth.name || !result) {
    const intro = engineIntros["psychology"];
    return <EngineEmptyState engineName={intro.title} whatItAnalyzes={intro.whatItAnalyzes} />;
  }

  const P = result.pattern;
  const radarColors = ["#ef4444", "#a78bfa", "#f59e0b", "#22c55e", "#f59e0b", "#ec4899"];

  const strongCount = result.planets.filter((p) => p.status === "Strong").length;
  const weakCount = result.planets.filter((p) => p.status === "Weak/Blocked").length;

  return (
    <div className="page" style={{ maxWidth: 960, margin: "0 auto", paddingBottom: 110 }}>
      <div className="page-tag">🧠 Cognitive Neuro-Astrology</div>
      <h1 className="page-title serif">Psychology & Mental Architecture</h1>
      <p className="page-sub">
        अन्तःकरण चतुष्टय · त्रिगुण विश्लेषण · Big Five (OCEAN) · Cognitive Shadow Work · Circadian Focus
      </p>

      {(() => {
        const intro = engineIntros["psychology"];
        return <EngineIntro title={intro.title} subtitle={intro.subtitle} description={intro.description} safetyNote={intro.safetyNote} />;
      })()}

      <PremiumFeature feature="Psychology Engine">
        {/* HEADER */}
        <div className="header-card" style={{ marginBottom: 16 }}>
          <div className="header-orb" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#ec4899", marginBottom: 6, fontWeight: 700 }}>
              🧠 Cognitive Matrix
            </div>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 700, color: "#1A1A1A" }}>
              {birth.name}&apos;s Psychological Blueprint
            </div>
            <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
              प्रकृति: <strong>{result.trigunas.dominantGuna} प्रधान</strong> · पैटर्न: <strong>{P.name}</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <div className="hstat">
              <div className="hstat-n" style={{ color: "#22c55e" }}>{strongCount}</div>
              <div className="hstat-l">STRONG</div>
            </div>
            <div className="hstat">
              <div className="hstat-n" style={{ color: "#ef4444" }}>{weakCount}</div>
              <div className="hstat-l">BLOCKED</div>
            </div>
            <div className="hstat">
              <div className="hstat-n" style={{ color: "#ec4899", fontSize: 18 }}>{result.trigunas.sattva}%</div>
              <div className="hstat-l">SATTVA</div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="summary-strip" style={{ marginBottom: 16, lineHeight: 1.7 }}>
          🧠 <strong>मनोवैज्ञानिक सारांश:</strong> {result.summary}
        </div>

        {/* TABS */}
        <div className="tabs" style={{ marginBottom: 18 }}>
          {([
            ["vedic_mind", "🕉️ अन्तःकरण व त्रिगुण"],
            ["bigfive", "🔬 Big Five (OCEAN)"],
            ["pattern", "📊 Pattern & Indices"],
            ["planets", "🪐 9 Psychological Functions"],
            ["guide", "🛡️ Shadow Work & CBT"],
          ] as const).map(([tKey, l]) => (
            <button key={tKey} className={`tab ${activeTab === tKey ? "active" : ""}`} onClick={() => setActiveTab(tKey)}>
              {l}
            </button>
          ))}
        </div>

        {/* ── TAB 1: VEDIC MIND & ANTAHKARANA ── */}
        {activeTab === "vedic_mind" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* NOVELISTIC STORYTELLING PROSE */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184, 134, 11, 0.28)", borderRadius: 16, padding: "22px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>
                ✦ अंतर्मन की कथा — आपकी मानसिक कार्यप्रणाली
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15, color: "#2A241F", lineHeight: 1.8, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {result.storytellingProse.map((para, pIdx) => (
                  <p key={pIdx} style={{ margin: 0, textAlign: "justify" }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* ANTAHKARANA CHATUSHTAYA 4 LAYERS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184, 134, 11, 0.25)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                ✦ सांख्य दर्शन: अन्तःकरण चतुष्टय (The 4 Inner Faculties)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                {result.antahkarana.map((layer) => (
                  <div key={layer.name} style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.2)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{layer.hindiName}</div>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 8, background: layer.expressionStatus === "Harmonious" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)", color: layer.expressionStatus === "Harmonious" ? "#16A34A" : "#D97706" }}>
                        {layer.expressionStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#854D0E", fontWeight: 600, marginBottom: 4 }}>
                      संचालक ग्रह: {layer.governingPlanets.join(" + ")}
                    </div>
                    <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6, margin: "0 0 6px 0" }}>
                      {layer.functionDesc}
                    </p>
                    <div style={{ fontSize: 12, color: "#1A1A1A", fontWeight: 600, background: "rgba(184,134,11,0.06)", padding: "6px 8px", borderRadius: 6 }}>
                      ✦ {layer.insight}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRIGUNAS GAUGE */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184, 134, 11, 0.25)", borderRadius: 16, padding: "18px 22px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>
                ✦ त्रिगुण संतुलन (Triguna Blueprint)
              </div>
              <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ width: `${result.trigunas.sattva}%`, background: "#16A34A" }} title={`Sattva: ${result.trigunas.sattva}%`} />
                <div style={{ width: `${result.trigunas.rajas}%`, background: "#D97706" }} title={`Rajas: ${result.trigunas.rajas}%`} />
                <div style={{ width: `${result.trigunas.tamas}%`, background: "#6B7280" }} title={`Tamas: ${result.trigunas.tamas}%`} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", fontSize: 12, fontWeight: 700 }}>
                <span style={{ color: "#16A34A" }}>सत्व (Sattva): {result.trigunas.sattva}%</span>
                <span style={{ color: "#D97706" }}>रजस (Rajas): {result.trigunas.rajas}%</span>
                <span style={{ color: "#6B7280" }}>तमस (Tamas): {result.trigunas.tamas}%</span>
              </div>
              <div style={{ fontSize: 12.5, color: "#4A4238", marginTop: 8 }}>{result.trigunas.description}</div>
            </div>

            {/* CIRCADIAN FOCUS PEAK */}
            <div style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.25)", borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: "#B8860B", marginBottom: 4 }}>
                <Clock size={16} />
                <span>क्रोनोबायोलॉजी व दैनिक फोकस पीक (Circadian Peak Window)</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                सर्वोत्तम मानसिक उत्पादकता खिड़की: {result.circadianPeak.peakFocusWindow}
              </div>
              <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.6, margin: 0 }}>
                {result.circadianPeak.cognitiveInsight}
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 2: BIG FIVE (OCEAN) ── */}
        {activeTab === "bigfive" && (
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(184, 134, 11, 0.28)", borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>
              ✦ Empirical Psychometrics: Big Five (OCEAN) Scale
            </div>
            <p style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.6, margin: "0 0 18px 0" }}>
              आधुनिक व्यक्तित्व मनोविज्ञान के 5 प्रमुख आयाम, जिन्हें नवग्रहों के न्यूरोलॉजिकल व्यवहार से मैप किया गया है:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {result.bigFive.map((trait) => (
                <div key={trait.trait} style={{ background: "#FAF8F5", border: "1px solid rgba(184, 134, 11, 0.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{trait.label}</span>
                      <span style={{ fontSize: 11, color: "#854D0E", marginLeft: 8 }}>({trait.governingPlanets})</span>
                    </div>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 700, color: "#B8860B" }}>
                      {trait.score} / 100
                    </span>
                  </div>

                  <div style={{ height: 6, background: "#E5E0D8", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: `${trait.score}%`, height: "100%", background: "#B8860B", borderRadius: 3 }} />
                  </div>

                  <p style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.6, margin: 0 }}>
                    {trait.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: PATTERN ANALYSIS (EXISTING) ── */}
        {activeTab === "pattern" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="card-top">
                <div>
                  <div className="card-tag">✦ Core Psychological Pattern</div>
                  <div className="card-title serif">{P.name}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#4A4238", lineHeight: 1.8, marginBottom: 16 }}>{P.desc}</p>
              <div style={{ padding: "12px 14px", background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 10, fontSize: 12.5, color: "#ec4899", lineHeight: 1.7 }}>
                ✦ <strong>Shadow Pattern:</strong> {P.shadow}
              </div>
            </div>

            <div className="grid-3">
              {[
                { n: P.anxietyIdx, l: "Anxiety Index", c: "#ef4444", bg: "rgba(239,68,68,0.07)" },
                { n: P.karmaLoop, l: "Karma Loop", c: "#a78bfa", bg: "rgba(167,139,250,0.07)" },
                { n: P.behavBias, l: "Behavioral Bias", c: "#f59e0b", bg: "rgba(245,158,11,0.07)" },
              ].map((c) => (
                <div key={c.l} className="card" style={{ background: c.bg, textAlign: "center", padding: "16px" }}>
                  <div style={{ fontSize: 32, fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: c.c }}>{c.n}/100</div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#6B635B", marginTop: 4 }}>{c.l}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ textAlign: "center", padding: 20 }}>
              <div className="card-tag" style={{ marginBottom: 10 }}>Psychological Function Radar</div>
              <PsychRadar vals={P.radarVals} colors={radarColors} />
            </div>
          </div>
        )}

        {/* ── TAB 4: 9 FUNCTIONS ── */}
        {activeTab === "planets" && (
          <div className="grid-2">
            {result.planets.map((p) => (
              <div key={p.planet} className="card" onClick={() => setExpanded(expanded === p.planet ? null : p.planet)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22, color: p.color }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{p.planet}</div>
                      <div style={{ fontSize: 10.5, color: "#ec4899" }}>{p.func}</div>
                    </div>
                  </div>
                  <span className={`badge ${p.status === "Strong" ? "badge-green" : p.status === "Weak/Blocked" ? "badge-red" : "badge-gold"}`}>
                    {p.strength}% · {p.status}
                  </span>
                </div>
                <div className="bar-track" style={{ marginBottom: 8 }}>
                  <div className="bar-fill" style={{ width: `${p.strength}%`, background: p.statusColor }} />
                </div>
                <div style={{ fontSize: 11, color: "#6B635B", marginBottom: 6 }}>
                  {p.trait} · H{p.house} {p.sign}{p.retrograde ? " · (R)" : ""}
                </div>
                <div style={{ fontSize: 12, color: "#4A4238", lineHeight: 1.65 }}>
                  {p.status === "Strong" ? p.strong : p.status === "Weak/Blocked" ? p.weak : p.cog}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 5: SHADOW WORK & CBT ── */}
        {activeTab === "guide" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(184, 134, 11, 0.28)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#B8860B", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>
                ✦ Cognitive Distortions Bank & CBT Reframing
              </div>
              <p style={{ fontSize: 13, color: "#6B635B", lineHeight: 1.6, margin: "0 0 16px 0" }}>
                ज्योतिषीय ऊर्जा से उत्पन्न होने वाली अचेतन संज्ञानात्मक त्रुटियों (Cognitive Biases) को पहचानकर उन्हें व्यावहारिक मनोविज्ञान से हल करना:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {result.cognitiveDistortions.map((item, idx) => (
                  <div key={idx} style={{ padding: "14px 16px", background: "#FAF8F5", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{item.distortion}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", background: "rgba(220,38,38,0.08)", padding: "2px 8px", borderRadius: 8 }}>
                        ग्रह: {item.planet}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "#6B635B", marginBottom: 6 }}>
                      <strong>ट्रिगर स्थिति:</strong> {item.triggerContext}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#16A34A", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "8px 10px", lineHeight: 1.6 }}>
                      ✦ <strong>CBT रिफ्रेमिंग उपाय:</strong> {item.cbtReframe}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="card" style={{ borderColor: "rgba(34,197,94,0.25)" }}>
                <div className="card-tag">✦ Daily Stabilizers</div>
                <div className="card-title serif">तनाव-शमन नियम</div>
                {result.stabilizers.map((line, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.75, padding: "6px 0", borderBottom: i === result.stabilizers.length - 1 ? "none" : "1px solid #FAF8F5" }}>
                    • {line}
                  </div>
                ))}
              </div>
              <div className="card" style={{ borderColor: "rgba(236,72,153,0.25)" }}>
                <div className="card-tag">✦ Growth Action Plan</div>
                <div className="card-title serif">व्यक्तिगत विकास रोडमैप</div>
                {result.growthPlan.map((line, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: "#4A4238", lineHeight: 1.75, padding: "6px 0", borderBottom: i === result.growthPlan.length - 1 ? "none" : "1px solid #FAF8F5" }}>
                    • {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </PremiumFeature>
    </div>
  );
}
