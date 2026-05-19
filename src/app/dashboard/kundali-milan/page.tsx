"use client";
import { useState, useMemo } from "react";
import "@/app/dashboard/shared.css";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";
import {
  calculateMilan, NAKSHATRAS_27, RASHIS_12,
  type MilanResult, type KootScore,
} from "@/lib/astro-engine/kundali-milan";
import {
  analyzeRelationshipIntelligence,
  type RelationshipInput, type RelationshipResult,
  type PlanetPlacement, type HouseInfo, type Planet,
} from "@/lib/astro-engine/relationship-intelligence";

// ── HOUSE LORDS (Aries=Mars ... Pisces=Jupiter) ──────────────
const SIGN_LORDS: Record<string, Planet> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

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

function MiniRing({ score, max, color, size = 52 }: { score: number; max: number; color: string; size?: number }) {
  const r = size * 0.38, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1c1840" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / max)}
          strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontFamily: "Cormorant Garamond,serif",
        fontSize: size * 0.26, fontWeight: 700, color,
      }}>{score}</div>
    </div>
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
        <MiniRing score={k.points} max={k.maxPoints} color={k.color} />
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

// ── Layer Score Card ─────────────────────────────────────────
function LayerCard({ title, icon, score, paragraph, color }: {
  title: string; icon: string; score: number; paragraph: string; color: string;
}) {
  return (
    <div className="card" style={{ borderColor: `${color}33` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <MiniRing score={score} max={100} color={color} size={56} />
        <div>
          <div style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#605890", marginBottom: 2 }}>{icon} {title}</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color }}>
            {score >= 76 ? "Supportive" : score >= 58 ? "Mixed Supportive" : score >= 40 ? "Needs Patience" : "Needs Careful Handling"}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.9 }}>{paragraph}</div>
    </div>
  );
}

// ── Map ChartData → RelationshipInput ────────────────────────
function chartToRelInput(chart: { planets: Record<string, { house: number; sign: string; nakshatra: string; retrograde: boolean; dignity: string; navamsha: string }>; houseCusps: { house: number; sign: string }[]; dashas: { planet: string; active?: boolean }[]; antardasha: { planet: string; active?: boolean }[] }): RelationshipInput {
  const PLANETS_LIST: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  const planets: PlanetPlacement[] = PLANETS_LIST.map(p => {
    const d = chart.planets[p];
    if (!d) return { planet: p, house: 1 };
    const isAfflicted = d.dignity === "Debilitated" || d.dignity === "Enemy";
    return {
      planet: p,
      house: d.house,
      sign: d.sign,
      nakshatra: d.nakshatra,
      isRetrograde: d.retrograde,
      isAfflicted,
      strength: d.dignity === "Exalted" ? 90 : d.dignity === "Own" ? 75 : d.dignity === "Friend" ? 65 : d.dignity === "Neutral" ? 50 : d.dignity === "Enemy" ? 35 : d.dignity === "Debilitated" ? 20 : 50,
    };
  });

  const houses: HouseInfo[] = (chart.houseCusps || []).map(hc => ({
    house: hc.house,
    sign: hc.sign,
    lord: SIGN_LORDS[hc.sign] || "Mars",
  }));

  // Ensure 12 houses
  for (let i = houses.length; i < 12; i++) {
    houses.push({ house: i + 1 });
  }

  // Dasha
  const activeMD = chart.dashas?.find(d => d.active);
  const activeAD = chart.antardasha?.find(d => d.active);
  const dasha = activeMD ? {
    mahadasha: activeMD.planet as Planet,
    antardasha: activeAD?.planet as Planet | undefined,
  } : undefined;

  return { planets, houses, dasha, language: "hinglish" };
}

// ── Main Page ─────────────────────────────────────────────────
type TabKey = "marriage" | "koots" | "psychology" | "children" | "kp" | "timing" | "doshas";

export default function KundaliMilanPage() {
  const { chart } = useUserChart();
  const { t, lang } = useLanguage();

  // Ashtakoot inputs
  const [p1, setP1] = useState<PersonInput>({ name: "Mukul", nakIdx: 3, rashiIdx: 3 });
  const [p2, setP2] = useState<PersonInput>({ name: "Priya", nakIdx: 10, rashiIdx: 4 });
  const [milanResult, setMilanResult] = useState<MilanResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("marriage");

  // Relationship Intelligence from native chart
  const relResult: RelationshipResult | null = useMemo(() => {
    if (!chart) return null;
    try {
      const input = chartToRelInput(chart as Parameters<typeof chartToRelInput>[0]);
      input.language = lang;
      // If ashtakoot calculated, feed it in
      if (milanResult) {
        input.ashtakoot = {
          totalScore: milanResult.totalScore,
          hasNadiDosha: milanResult.koots.some(k => k.name === "Nadi" && k.hasDosha),
          hasBhakootDosha: milanResult.koots.some(k => k.name === "Bhakut" && k.hasDosha),
          hasGanaIssue: milanResult.koots.some(k => k.name === "Gana" && k.hasDosha),
        };
      }
      return analyzeRelationshipIntelligence(input);
    } catch { return null; }
  }, [chart, milanResult, lang]);

  function calculate() {
    const r = calculateMilan(
      p1.name || "Person 1", p1.nakIdx, p1.rashiIdx,
      p2.name || "Person 2", p2.nakIdx, p2.rashiIdx,
    );
    setMilanResult(r);
    setActiveTab("koots");
  }

  const colorForLabel = (label: string) =>
    label === "supportive" ? "#22c55e" : label === "mixed_supportive" ? "#c8a030" : label === "needs_patience" ? "#f97316" : "#ef4444";

  const TABS: [TabKey, string][] = [
    ["marriage", t("milan.tab_marriage")],
    ["koots", t("milan.tab_koots")],
    ["psychology", t("milan.tab_psychology")],
    ["children", t("milan.tab_children")],
    ["kp", t("milan.tab_kp")],
    ["timing", t("milan.tab_timing")],
    ["doshas", t("milan.tab_doshas")],
  ];

  return (
    <div className="page">
      <div className="page-tag">{t("milan.page_tag")}</div>
      <h1 className="page-title serif">{t("milan.page_title")}</h1>
      <p className="page-sub">{t("milan.page_sub")}</p>
      <PremiumFeature feature="Kundali Milan">

      {/* ── MARRIAGE INTELLIGENCE HEADER ── */}
      {relResult && (
        <div className="header-card" style={{ marginBottom: 16 }}>
          <div className="header-orb" />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
              <ScoreRing score={relResult.marriageScore} max={100} color={colorForLabel(relResult.marriageLabel)} />
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 700, color: colorForLabel(relResult.marriageLabel), lineHeight: 1 }}>{relResult.marriageScore}</div>
                <div style={{ fontSize: 9, color: "#605890" }}>/ 100</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 4 }}>{t("milan.marriage_score")}</div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "#f0e8d0", marginBottom: 6 }}>
                {chart?.name || "Your"} Relationship Profile
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: `${colorForLabel(relResult.marriageLabel)}18`,
                border: `1px solid ${colorForLabel(relResult.marriageLabel)}44`,
                borderRadius: 8, padding: "4px 12px",
              }}>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 700, color: colorForLabel(relResult.marriageLabel) }}>
                  {relResult.marriageLabel === "supportive" ? "✦ Supportive" : relResult.marriageLabel === "mixed_supportive" ? "◐ Mixed Supportive" : relResult.marriageLabel === "needs_patience" ? "◑ Needs Patience" : "◌ Needs Careful Handling"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div className="hstat">
                <div className="hstat-n" style={{ color: colorForLabel(relResult.layers.childrenAwareness.label) }}>{relResult.childrenScore}</div>
                <div className="hstat-l">CHILDREN</div>
              </div>
              <div className="hstat">
                <div className="hstat-n" style={{ color: colorForLabel(relResult.layers.kpMarriageValidation.label) }}>{relResult.layers.kpMarriageValidation.score}</div>
                <div className="hstat-l">KP</div>
              </div>
              <div className="hstat">
                <div className="hstat-n" style={{ color: colorForLabel(relResult.layers.marriageTimingSupport.label) }}>{relResult.layers.marriageTimingSupport.score}</div>
                <div className="hstat-l">TIMING</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NARRATIVE STRIP ── */}
      {relResult && (
        <div className="summary-strip" style={{ marginBottom: 16, color: "#c8c0a8" }}>
          {relResult.marriageNarrative}
        </div>
      )}

      {/* ── ASHTAKOOT INPUT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <PersonForm label={t("milan.groom_label")} color="#c8a030" value={p1} onChange={setP1} />
        <PersonForm label={t("milan.bride_label")} color="#e879f9" value={p2} onChange={setP2} />
      </div>

      <button
        onClick={calculate}
        style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#c8a030,#a06820)", color: "#08051a",
          fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 700,
          letterSpacing: "1px", marginBottom: 24,
        }}
      >
        {t("milan.calculate_btn")}
      </button>

      {/* ── TABS ── */}
      <div className="tabs" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {TABS.map(([t, l]) => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{l}</button>
        ))}
      </div>

      {/* ══════════════════════ MARRIAGE TAB ══════════════════════ */}
      {activeTab === "marriage" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="Marriage Promise"
            icon="💍"
            score={relResult.layers.marriagePromise.score}
            paragraph={relResult.layers.marriagePromise.paragraph}
            color={colorForLabel(relResult.layers.marriagePromise.label)}
          />
          <LayerCard
            title="Manglik Balance"
            icon="Ma"
            score={relResult.layers.manglikBalance.score}
            paragraph={relResult.layers.manglikBalance.paragraph}
            color={colorForLabel(relResult.layers.manglikBalance.label)}
          />
          {milanResult && (
            <LayerCard
              title="Ashtakoot Integration"
              icon="🔗"
              score={relResult.layers.ashtakootCompatibility.score}
              paragraph={relResult.layers.ashtakootCompatibility.paragraph}
              color={colorForLabel(relResult.layers.ashtakootCompatibility.label)}
            />
          )}
          <div className="card" style={{ borderColor: "rgba(200,160,48,0.2)" }}>
            <div className="card-tag">💊 Remedies & Guidance</div>
            <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.9 }}>{relResult.safeRelationshipRemedies}</div>
          </div>
          <div style={{ fontSize: 11, color: "#3a3060", textAlign: "center", padding: "8px 16px", background: "rgba(200,160,48,0.04)", borderRadius: 8, border: "1px solid #1c1840" }}>
            {relResult.safetyBoundary}
          </div>
        </div>
      )}
      {activeTab === "marriage" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💍</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#f0e8d0", marginBottom: 8 }}>Generate Your Chart First</div>
          <div style={{ fontSize: 12, color: "#605890" }}>Marriage Intelligence requires your birth chart. Complete onboarding to see your relationship profile.</div>
        </div>
      )}

      {/* ══════════════════════ 8 KOOTS TAB ══════════════════════ */}
      {activeTab === "koots" && milanResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Big score */}
          <div className="header-card" style={{ marginBottom: 8 }}>
            <div className="header-orb" />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
                <ScoreRing score={milanResult.totalScore} max={36} color={milanResult.verdictColor} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 700, color: milanResult.verdictColor, lineHeight: 1 }}>{milanResult.totalScore}</div>
                  <div style={{ fontSize: 9, color: "#605890" }}>out of 36</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 4 }}>Ashtakoot Result</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "#f0e8d0", marginBottom: 6 }}>
                  {milanResult.person1Name} <span style={{ color: "#e879f9" }}>💑</span> {milanResult.person2Name}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${milanResult.verdictColor}18`, border: `1px solid ${milanResult.verdictColor}44`, borderRadius: 8, padding: "4px 12px" }}>
                  <span style={{ fontSize: 14 }}>{milanResult.verdictIcon}</span>
                  <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 700, color: milanResult.verdictColor }}>{milanResult.verdict}</span>
                  <span style={{ fontSize: 11, color: "#605890" }}>· {milanResult.percentage}%</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="hstat"><div className="hstat-n" style={{ color: milanResult.verdictColor }}>{milanResult.totalScore}/36</div><div className="hstat-l">GUN</div></div>
                <div className="hstat"><div className="hstat-n" style={{ color: milanResult.doshas.length === 0 ? "#22c55e" : "#ef4444" }}>{milanResult.doshas.length}</div><div className="hstat-l">DOSHAS</div></div>
              </div>
            </div>
          </div>
          <div className="summary-strip" style={{ marginBottom: 8, borderColor: `${milanResult.verdictColor}44`, color: "#c8c0a8" }}>
            {milanResult.verdictIcon} {milanResult.recommendation}
          </div>
          {/* Score bar */}
          <div className="card" style={{ marginBottom: 4 }}>
            <div className="card-tag">✦ 8 Koot Analysis</div>
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {milanResult.koots.map(k => (
                <div key={k.name} style={{ flex: k.maxPoints, height: 6, background: k.color, borderRadius: 3, opacity: k.points === 0 ? 0.2 : 0.85 }} title={`${k.name}: ${k.points}/${k.maxPoints}`} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#3a3060", marginTop: 4 }}>
              <span>Varna</span><span>Vashya</span><span>Tara</span><span>Yoni</span><span>Maitri</span><span>Gana</span><span>Bhakut</span><span>Nadi</span>
            </div>
          </div>
          {milanResult.koots.map(k => <KootCard key={k.name} k={k} />)}
        </div>
      )}
      {activeTab === "koots" && !milanResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💑</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#f0e8d0", marginBottom: 8 }}>Enter Partner Details Above</div>
          <div style={{ fontSize: 12, color: "#605890" }}>Fill both Nakshatra &amp; Rashi forms and click &quot;Milan Karein&quot; to calculate 36-point compatibility.</div>
        </div>
      )}

      {/* ══════════════════════ PSYCHOLOGY TAB ══════════════════════ */}
      {activeTab === "psychology" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="Relationship Psychology"
            icon="🧠"
            score={relResult.layers.relationshipPsychology.score}
            paragraph={relResult.layers.relationshipPsychology.paragraph}
            color={colorForLabel(relResult.layers.relationshipPsychology.label)}
          />
          {milanResult && (
            <div className="card">
              <div className="card-tag">✦ Psychological Compatibility</div>
              <div className="card-title serif">Scientific Meaning of Ashtakoot</div>
              <div style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.9, marginBottom: 16 }}>
                {milanResult.psychologicalInsight}
              </div>
              <div style={{ borderTop: "1px solid #1c1840", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { koot:"Varna", psych:"Value System & Spiritual Hierarchy", desc:"Compatibility of life values, ambitions, and spiritual orientation." },
                  { koot:"Vashya", psych:"Control Dynamics", desc:"Natural attraction and dominance balance in daily life." },
                  { koot:"Tara", psych:"Luck Harmony", desc:"Whether partners bring out good luck or create karmic friction." },
                  { koot:"Yoni", psych:"Instinct & Physical Bond", desc:"Animal archetype — deep instinctual and physical attraction." },
                  { koot:"Graha Maitri", psych:"Mental Friendship", desc:"Intellectual alignment and mutual thought-pattern support." },
                  { koot:"Gana", psych:"Temperament Type", desc:"Deva, Manushya, Rakshasa — day-to-day friction or harmony." },
                  { koot:"Bhakut", psych:"Emotional Direction", desc:"Emotional energy flow toward or away from each other." },
                  { koot:"Nadi", psych:"Biological Compatibility", desc:"DNA-level compatibility, health factors in offspring." },
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
          )}
        </div>
      )}
      {activeTab === "psychology" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#f0e8d0", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#605890" }}>Complete onboarding to see your relationship psychology analysis based on Moon, Venus, Mars, and Saturn placements.</div>
        </div>
      )}

      {/* ══════════════════════ CHILDREN TAB ══════════════════════ */}
      {activeTab === "children" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="header-card" style={{ marginBottom: 8 }}>
            <div className="header-orb" />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 20 }}>
              <MiniRing score={relResult.childrenScore} max={100} color={colorForLabel(relResult.layers.childrenAwareness.label)} size={64} />
              <div>
                <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#605890", marginBottom: 4 }}>Children Awareness Score</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 700, color: colorForLabel(relResult.layers.childrenAwareness.label) }}>
                  {relResult.childrenScore >= 76 ? "Supportive Indications" : relResult.childrenScore >= 58 ? "Mixed Support" : "Needs Patience & Faith"}
                </div>
              </div>
            </div>
          </div>
          <LayerCard
            title="Children Awareness (5H + Jupiter)"
            icon="👶"
            score={relResult.layers.childrenAwareness.score}
            paragraph={relResult.layers.childrenAwareness.paragraph}
            color={colorForLabel(relResult.layers.childrenAwareness.label)}
          />
          <LayerCard
            title="KP Children Validation (2-5-11)"
            icon="🔬"
            score={relResult.layers.kpChildrenValidation.score}
            paragraph={relResult.layers.kpChildrenValidation.paragraph}
            color={colorForLabel(relResult.layers.kpChildrenValidation.label)}
          />
          <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.9, padding: "12px 16px", background: "#0d0b24", borderRadius: 10, border: "1px solid #1c1840" }}>
            {relResult.childrenNarrative}
          </div>
        </div>
      )}
      {activeTab === "children" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👶</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#f0e8d0", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#605890" }}>Complete onboarding to see children awareness based on 5th house, Jupiter, and KP significators.</div>
        </div>
      )}

      {/* ══════════════════════ KP TAB ══════════════════════ */}
      {activeTab === "kp" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="KP Marriage Validation (2-7-11)"
            icon="🔬"
            score={relResult.layers.kpMarriageValidation.score}
            paragraph={relResult.layers.kpMarriageValidation.paragraph}
            color={colorForLabel(relResult.layers.kpMarriageValidation.label)}
          />
          <LayerCard
            title="KP Children Validation (2-5-11)"
            icon="🧬"
            score={relResult.layers.kpChildrenValidation.score}
            paragraph={relResult.layers.kpChildrenValidation.paragraph}
            color={colorForLabel(relResult.layers.kpChildrenValidation.label)}
          />
          <div className="card">
            <div className="card-tag">ℹ️ About KP System</div>
            <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.9 }}>
              Krishnamurti Paddhati (KP) validates events by checking if relevant house significators (planets ruling, occupying, or sub-lord of cusps) support the event. For marriage, houses 2-7-11 must be connected. For children, houses 2-5-11 are checked. This provides a scientific cross-validation layer beyond traditional Parashari analysis.
            </div>
          </div>
        </div>
      )}
      {activeTab === "kp" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#f0e8d0", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#605890" }}>KP Validation requires your birth chart data.</div>
        </div>
      )}

      {/* ══════════════════════ TIMING TAB ══════════════════════ */}
      {activeTab === "timing" && relResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LayerCard
            title="Marriage Timing Support"
            icon="⏱️"
            score={relResult.layers.marriageTimingSupport.score}
            paragraph={relResult.layers.marriageTimingSupport.paragraph}
            color={colorForLabel(relResult.layers.marriageTimingSupport.label)}
          />
          <div className="card">
            <div className="card-tag">📅 Dasha Context</div>
            <div className="card-title serif">Current Mahadasha & Marriage Windows</div>
            <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.9 }}>
              Marriage events typically manifest during the dashas of planets connected to houses 2, 7, and 11 — especially Venus, Jupiter, Rahu (for unconventional), and the 7th lord. The current dasha period influences your relationship readiness, timing of proposals, and marriage manifestation windows.
            </div>
            {chart && (
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {chart.dashas?.filter((d: { active?: boolean }) => d.active).map((d: { planet: string }, i: number) => (
                  <div key={i} style={{ background: "rgba(200,160,48,0.08)", border: "1px solid rgba(200,160,48,0.25)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#c8a030" }}>
                    MD: {d.planet}
                  </div>
                ))}
                {chart.antardasha?.filter((d: { active?: boolean }) => d.active).map((d: { planet: string }, i: number) => (
                  <div key={i} style={{ background: "rgba(232,121,249,0.08)", border: "1px solid rgba(232,121,249,0.25)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#e879f9" }}>
                    AD: {d.planet}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === "timing" && !relResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏱️</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#f0e8d0", marginBottom: 8 }}>Chart Required</div>
          <div style={{ fontSize: 12, color: "#605890" }}>Timing analysis requires your birth chart and active dasha data.</div>
        </div>
      )}

      {/* ══════════════════════ DOSHAS TAB ══════════════════════ */}
      {activeTab === "doshas" && milanResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {milanResult.doshas.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 32, borderColor: "rgba(34,197,94,0.3)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>No Doshas Detected</div>
              <div style={{ fontSize: 13, color: "#605890" }}>All 8 koots are free of major doshas. A rare and auspicious result.</div>
            </div>
          ) : (
            <>
              <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                <div className="card-tag" style={{ color: "#ef4444" }}>⚠️ Doshas Detected</div>
                <div className="card-title serif">{milanResult.doshas.length} Dosha{milanResult.doshas.length > 1 ? "s" : ""} Found</div>
                <div style={{ fontSize: 12, color: "#605890", lineHeight: 1.8, marginBottom: 14 }}>
                  Doshas are compatibility stresses — not curses. Every dosha has traditional remedies. Consult a qualified jyotishi for personalized guidance.
                </div>
                {milanResult.koots.filter(k => k.hasDosha).map(k => (
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
                {milanResult.koots.filter(k => k.hasDosha).map(k => (
                  <div key={k.name} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #1c1840" }}>
                    <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 14, fontWeight: 600, color: "#c8a030", marginBottom: 6 }}>{k.name} Dosha Remedy</div>
                    <div style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.8 }}>
                      {k.name === "Nadi" && "Perform Nadi Dosha Nivarana Puja at a Shiva temple. Mahamrityunjaya Jaap (1,25,000 times). Donate dakshina on behalf of both families."}
                      {k.name === "Bhakut" && "Bhakut Dosha is cancelled if both rashi lords are friends. Perform Rudrabhishek together. Consult jyotishi for graha shanti."}
                      {k.name === "Gana" && "Gana Dosha is reduced if Nadi scores full 8 points. Kashi Vishwanath darshan and Shiva-Parvati worship helps harmonize temperament."}
                      {k.name === "Tara" && "Perform Nakshatra Shanti puja for birth nakshatras. Worship the nakshatra devata."}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {activeTab === "doshas" && !milanResult && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#f0e8d0", marginBottom: 8 }}>Calculate Ashtakoot First</div>
          <div style={{ fontSize: 12, color: "#605890" }}>Enter partner details and run Milan to see dosha analysis.</div>
        </div>
      )}

      </PremiumFeature>
    </div>
  );
}
