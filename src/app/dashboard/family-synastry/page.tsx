"use client";
import { useState, useCallback } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import CityAutocomplete, { type CitySearchResult } from "@/components/location/CityAutocomplete";
import {
  analyzeFamilySynastry, chartToFamilyMember,
  type FamilyMemberChart, type FamilyRole, type FamilyPatternResult, type KaalSarpResult,
} from "@/lib/astro-engine/family-synastry";
import "@/app/dashboard/shared.css";

// ── helpers ──────────────────────────────────────────────────────────────────

function memberLabel(m: FamilyMemberChart) { return m.name || m.role; }

function ianaToUtcOffset(timezone: string, dob: string, tob: string): number {
  try {
    const dt = new Date(`${dob}T${tob || "12:00"}`);
    const parts = new Intl.DateTimeFormat("en", { timeZone: timezone, timeZoneName: "shortOffset" }).formatToParts(dt);
    const tzStr = parts.find(p => p.type === "timeZoneName")?.value ?? "GMT+5:30";
    const m = tzStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!m) return 5.5;
    return (m[1] === "+" ? 1 : -1) * (parseInt(m[2], 10) + parseInt(m[3] ?? "0", 10) / 60);
  } catch { return 5.5; }
}

// ── constants ────────────────────────────────────────────────────────────────

const ROLES: FamilyRole[] = ["father", "mother", "spouse", "child", "sibling", "grandparent", "other"];
const ROLE_ICONS: Record<FamilyRole | "self", string> = {
  self: "☀️", father: "👨", mother: "👩", spouse: "💞",
  child: "🧒", sibling: "🤝", grandparent: "🌿", other: "⭐",
};
const PLANET_LIST = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PLANET_SYM: Record<string, string> = { Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa", Rahu:"Ra", Ketu:"Ke" };
const PLANET_COL: Record<string, string> = {
  Sun:"#f97316", Moon:"#c084fc", Mars:"#ef4444", Mercury:"#22c55e",
  Jupiter:"#f59e0b", Venus:"#ec4899", Saturn:"#60a5fa", Rahu:"#a78bfa", Ketu:"#fb7185",
};
const AREA_COLORS: Record<string, string> = {
  marriage_delay:"#a855f7", children_awareness:"#f97316",
  ancestral_pattern:"#c8a030", court_litigation:"#ef4444",
  property_dispute:"#60a5fa", sudden_home_sale:"#f43f5e",
  parent_karma:"#fb923c", sibling_dynamic:"#34d399",
  family_health_awareness:"#22c55e", wealth_inheritance:"#eab308",
  kaal_sarp_family:"#8b5cf6",
};

// ── sub-components ────────────────────────────────────────────────────────────

function HarmonyRing({ score }: { score: number }) {
  const r = 54, circ = 2 * Math.PI * r;
  const color = score >= 70 ? "#22c55e" : score >= 50 ? "#c8a030" : "#ef4444";
  return (
    <div style={{ position: "relative", width: 128, height: 128 }}>
      <svg width={128} height={128} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={64} cy={64} r={r} fill="none" stroke="#1c1840" strokeWidth={8} />
        <circle cx={64} cy={64} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 34, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 10, color: "#605890", marginTop: 2 }}>Harmony</span>
      </div>
    </div>
  );
}

function D1Grid({ chart, label, color }: { chart: ChartData; label: string; color: string }) {
  // group planets by house
  const byHouse: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  PLANET_LIST.forEach(p => {
    const pd = chart.planets[p];
    if (pd) byHouse[pd.house]?.push(p);
  });

  return (
    <div style={{ background: "#0d0a22", border: `1px solid ${color}33`, borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontWeight: 600, color: "#f0e8d0" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#605890" }}>Lagna: {chart.lagnaRashi}</span>
      </div>
      {/* 3×4 house grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
          <div key={h} style={{
            background: "#08061a", border: `1px solid ${byHouse[h].length ? color + "44" : "#1c1840"}`,
            borderRadius: 8, padding: "8px 10px", minHeight: 64,
          }}>
            <div style={{ fontSize: 9, color: "#3a3060", fontWeight: 600, marginBottom: 4 }}>H{h}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {byHouse[h].map(p => (
                <span key={p} title={p} style={{
                  fontSize: 11, color: PLANET_COL[p], fontWeight: 600,
                  background: PLANET_COL[p] + "18", borderRadius: 4, padding: "1px 5px",
                }}>
                  {PLANET_SYM[p]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Planet legend */}
      <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {PLANET_LIST.map(p => {
          const pd = chart.planets[p];
          if (!pd) return null;
          return (
            <div key={p} style={{ fontSize: 11, color: PLANET_COL[p], background: PLANET_COL[p] + "14", border: `1px solid ${PLANET_COL[p]}33`, borderRadius: 20, padding: "2px 8px" }}>
              {PLANET_SYM[p]} {p} · H{pd.house} · {pd.sign}
              {pd.retrograde ? " (R)" : ""}{pd.dignity === "Debilitated" ? " (Deb)" : pd.dignity?.startsWith("Exalted") ? " (Exa)" : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PatternCard({ p, expanded, onToggle }: { p: FamilyPatternResult; expanded: boolean; onToggle: () => void }) {
  const color = AREA_COLORS[p.area] || "#c8a030";
  const riskCfg: Record<string, { bg: string; color: string }> = {
    low:       { bg: "rgba(34,197,94,0.1)",  color: "#22c55e" },
    moderate:  { bg: "rgba(234,179,8,0.1)",  color: "#eab308" },
    high:      { bg: "rgba(239,68,68,0.1)",  color: "#ef4444" },
    sensitive: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  };
  const rc = riskCfg[p.riskLevel] || riskCfg.low;

  return (
    <div onClick={onToggle} style={{
      background: "#0d0a22", border: `1px solid ${expanded ? color + "55" : "#1c1840"}`,
      borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, fontWeight: 600, color: "#f0e8d0" }}>{p.title}</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: rc.bg, color: rc.color, border: `1px solid ${rc.color}40` }}>
              {p.riskLevel.toUpperCase()}
            </span>
          </div>
          <div style={{ height: 4, background: "#1c1840", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${p.score}%`, background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: "#605890", marginTop: 5 }}>Pattern strength: {p.score}/100</div>
        </div>
        <span style={{ color: "#605890", fontSize: 14, flexShrink: 0, marginTop: 4 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, borderTop: "1px solid #1c1840", paddingTop: 16, animation: "fadeUp 0.2s ease" }}>
          <p style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.75, marginBottom: 12 }}>{p.paragraph}</p>
          {p.indicators.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Key Indicators</div>
              {p.indicators.map((ind, i) => (
                <div key={i} style={{ fontSize: 12, color: "#c8c0a8", padding: "3px 0", display: "flex", gap: 6 }}>
                  <span style={{ color, flexShrink: 0 }}>◆</span>{ind}
                </div>
              ))}
            </div>
          )}
          {p.safeRemedies.length > 0 && (
            <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#f97316", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Safe Remedies</div>
              {p.safeRemedies.map((r, i) => (
                <div key={i} style={{ fontSize: 12, color: "#c8c0a8", padding: "2px 0" }}>› {r}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function KsdCard({ name, result }: { name: string; result: KaalSarpResult }) {
  const [open, setOpen] = useState(false);
  if (!result.present) return null;
  const color = result.severity === "full" ? "#8b5cf6" : "#a78bfa";
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      background: "#0d0a22", border: `1px solid ${open ? "#8b5cf655" : "#1c1840"}`,
      borderRadius: 12, padding: "14px 16px", cursor: "pointer",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🐍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e8d0", fontFamily: "Cormorant Garamond,serif" }}>{name}</div>
          <div style={{ fontSize: 12, color }}>
            {result.type} Kaal Sarp Yoga — {result.severity === "full" ? "Purna" : "Ardh"} · Rahu H{result.rahuHouse} / Ketu H{result.ketuHouse}
          </div>
        </div>
        <span style={{ color: "#605890" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ marginTop: 12, borderTop: "1px solid #1c1840", paddingTop: 12 }}>
          <p style={{ fontSize: 12, color: "#c8c0a8", lineHeight: 1.7, marginBottom: 10 }}>{result.description}</p>
          {result.familyImpact && <p style={{ fontSize: 12, color: "#a78bfa", marginBottom: 10 }}>{result.familyImpact}</p>}
          {result.planetsOutside && (
            <div style={{ fontSize: 11, color: "#605890", marginBottom: 8 }}>
              Planets outside arc: {result.planetsOutside.map(p => PLANET_SYM[p] || p).join(", ")}
            </div>
          )}
          {result.remedies.length > 0 && (
            <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 600, marginBottom: 5, letterSpacing: 1 }}>REMEDIES</div>
              {result.remedies.map((r, i) => (
                <div key={i} style={{ fontSize: 12, color: "#c8c0a8", padding: "2px 0" }}>› {r}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── types ─────────────────────────────────────────────────────────────────────

interface MemberForm {
  name: string;
  role: FamilyRole;
  dob: string;
  tob: string;
  cityResult: CitySearchResult | null;
}

const BLANK_FORM: MemberForm = { name: "", role: "father", dob: "", tob: "12:00", cityResult: null };

interface AnalysisResult {
  members: Array<{ member: FamilyMemberChart; chart: ChartData; color: string }>;
  analysis: ReturnType<typeof analyzeFamilySynastry>;
}

const MEMBER_COLORS = ["#c8a030", "#a855f7", "#22c55e", "#60a5fa", "#f97316"];

// ── main page ─────────────────────────────────────────────────────────────────

export default function FamilySynastryPage() {
  const { chart: selfChart } = useUserChart();
  const [memberForms, setMemberForms] = useState<MemberForm[]>([{ ...BLANK_FORM }]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"charts" | "overview" | "patterns" | "ksd">("charts");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = useCallback(() => {
    setError("");
    setLoading(true);
    setResult(null);

    // slight defer so UI updates first
    setTimeout(() => {
      try {
        const selfMember = chartToFamilyMember(selfChart, "self", "self");
        const members: AnalysisResult["members"] = [
          { member: selfMember, chart: selfChart, color: "#c8a030" },
        ];

        for (let i = 0; i < memberForms.length; i++) {
          const f = memberForms[i];
          if (!f.dob || !f.tob || !f.cityResult) continue;
          const tz = f.cityResult.timezone
            ? ianaToUtcOffset(f.cityResult.timezone, f.dob, f.tob)
            : 5.5;
          const c = calculateChart(
            f.name || f.role,
            f.dob, f.tob,
            f.cityResult.displayName,
            f.cityResult.latitude,
            f.cityResult.longitude,
            tz,
          );
          members.push({
            member: chartToFamilyMember(c, f.role, `m${i}`, f.name || f.role),
            chart: c,
            color: MEMBER_COLORS[(i + 1) % MEMBER_COLORS.length],
          });
        }

        if (members.length < 2) {
          setError("Please add at least one family member with complete birth details (DOB, TOB, and select a city from the dropdown).");
          setLoading(false);
          return;
        }

        const analysis = analyzeFamilySynastry({ members: members.map(m => m.member) });
        setResult({ members, analysis });
        setActiveTab("charts");
      } catch (e) {
        setError("Analysis failed. Please check birth details and try again.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 50);
  }, [selfChart, memberForms]);

  function updateForm(i: number, patch: Partial<MemberForm>) {
    setMemberForms(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
    setResult(null);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#08061a", border: "1px solid #1c1840", borderRadius: 8,
    padding: "8px 12px", color: "#f0e8d0", fontSize: 13, fontFamily: "Outfit,sans-serif", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, color: "#605890", letterSpacing: 1, textTransform: "uppercase" as const,
    marginBottom: 4, display: "block",
  };

  const ksdAffected = result?.analysis.kaalSarpAnalysis.filter(r => r.result.present) ?? [];

  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        input:focus,select:focus{border-color:rgba(200,160,48,0.4)!important;outline:none}
        /* override CityAutocomplete to match dark theme */
        .city-wrap input{background:#08061a!important;border:1px solid #1c1840!important;border-radius:8px!important;padding:8px 12px!important;color:#f0e8d0!important;font-size:13px!important;font-family:Outfit,sans-serif!important;outline:none!important;width:100%!important}
        .city-wrap label{font-size:10px;color:#605890;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;display:block}
        .city-wrap>div>label{display:none}
      `}</style>

      <div className="page" style={{ maxWidth: 980 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div className="page-tag">Family Karma Grid</div>
          <h1 className="page-title">Family <em>Synastry</em></h1>
          <p className="page-sub">Multi-chart Jyotish analysis — ancestral patterns, Kaal Sarp Dosha & family karma</p>
        </div>

        {/* Self (auto-loaded) */}
        <div style={{ background: "rgba(200,160,48,0.06)", border: "1px solid rgba(200,160,48,0.2)", borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>☀️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f0e8d0" }}>
              {selfChart.name}
              <span style={{ fontSize: 11, color: "#c8a030", fontWeight: 400, marginLeft: 8 }}>(Self — auto-loaded)</span>
            </div>
            <div style={{ fontSize: 11, color: "#605890" }}>
              {selfChart.dob} · {selfChart.tob} · {selfChart.city} · Lagna: {selfChart.lagnaRashi}
            </div>
          </div>
        </div>

        {/* Member forms */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#c8a030", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Add Family Members
            </div>
            {memberForms.length < 5 && (
              <button
                onClick={() => setMemberForms(p => [...p, { ...BLANK_FORM }])}
                style={{ fontSize: 12, color: "#c8a030", background: "rgba(200,160,48,0.08)", border: "1px solid rgba(200,160,48,0.2)", borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontFamily: "Outfit,sans-serif" }}
              >
                + Add Member
              </button>
            )}
          </div>

          {memberForms.map((f, i) => (
            <div key={i} style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: 14, padding: "18px 20px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>{ROLE_ICONS[f.role] || "⭐"}</span>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, color: "#f0e8d0" }}>
                  Member {i + 1}
                </span>
                {f.cityResult && (
                  <span style={{ fontSize: 11, color: "#22c55e", marginLeft: 4 }}>✓ City selected</span>
                )}
                {memberForms.length > 1 && (
                  <button
                    onClick={() => setMemberForms(p => p.filter((_, idx) => idx !== i))}
                    style={{ marginLeft: "auto", fontSize: 11, color: "#605890", background: "none", border: "none", cursor: "pointer" }}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Name (optional)</label>
                  <input style={inputStyle} value={f.name} placeholder="e.g. Priya" onChange={e => updateForm(i, { name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Relationship</label>
                  <select style={inputStyle} value={f.role} onChange={e => updateForm(i, { role: e.target.value as FamilyRole })}>
                    {ROLES.map(r => <option key={r} value={r}>{ROLE_ICONS[r]} {r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <input type="date" style={inputStyle} value={f.dob} onChange={e => updateForm(i, { dob: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Time of Birth</label>
                  <input type="time" style={inputStyle} value={f.tob} onChange={e => updateForm(i, { tob: e.target.value })} />
                </div>
              </div>

              {/* City autocomplete — full row */}
              <div className="city-wrap">
                <label style={labelStyle}>Place of Birth</label>
                <CityAutocomplete
                  label=""
                  value={f.cityResult}
                  onChange={city => updateForm(i, { cityResult: city })}
                  placeholder="Search city — e.g. Delhi, Mumbai, Jaipur…"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading ? "#0d0a22" : "linear-gradient(135deg,#1a1040,#2a1860)",
            border: "1px solid rgba(200,160,48,0.3)", borderRadius: 12,
            color: "#c8a030", fontFamily: "Cormorant Garamond,serif", fontSize: 18,
            fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 28, letterSpacing: 0.5, transition: "all 0.2s",
          }}
        >
          {loading ? "Calculating Charts…" : "✦ Analyze Family Karma Grid"}
        </button>

        {error && (
          <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 20, padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
            {error}
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && !loading && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {/* Harmony header */}
            <div className="header-card" style={{ marginBottom: 24 }}>
              <div className="header-orb" />
              <div style={{ flex: 1 }}>
                <div className="page-tag">Family Harmony Score</div>
                <p style={{ fontSize: 13, color: "#605890", maxWidth: 500, lineHeight: 1.65, marginTop: 6 }}>
                  {result.analysis.narrative}
                </p>
                {/* Member chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  {result.members.map(({ member, chart, color }) => (
                    <div key={member.id} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: color + "18", border: `1px solid ${color}44`, color }}>
                      {ROLE_ICONS[member.role as keyof typeof ROLE_ICONS]} {member.name || member.role} · {chart.lagnaRashi} Lagna
                    </div>
                  ))}
                </div>
              </div>
              <HarmonyRing score={result.analysis.harmonyScore} />
            </div>

            {/* KSD strip */}
            {ksdAffected.length > 0 && (
              <div style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22 }}>🐍</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", marginBottom: 2 }}>Kaal Sarp Dosha Detected</div>
                  <div style={{ fontSize: 12, color: "#605890" }}>
                    {ksdAffected.map(r => `${memberLabel(r.member)}: ${r.result.type} (${r.result.severity})`).join(" · ")}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 24 }}>
              {([
                ["charts",   `D1 Charts (${result.members.length})`],
                ["overview", "Top Patterns"],
                ["patterns", `All (${result.analysis.allPatterns.length})`],
                ["ksd",      `Kaal Sarp (${ksdAffected.length})`],
              ] as const).map(([tab, label]) => (
                <button key={tab} className={`tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {label}
                </button>
              ))}
            </div>

            {/* D1 Charts tab */}
            {activeTab === "charts" && (
              <div style={{ display: "grid", gap: 20 }}>
                {result.members.map(({ member, chart, color }) => (
                  <D1Grid
                    key={member.id}
                    chart={chart}
                    label={`${ROLE_ICONS[member.role as keyof typeof ROLE_ICONS]} ${member.name || member.role} — D1 Chart`}
                    color={color}
                  />
                ))}
                {/* Quick comparison strip */}
                <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ fontSize: 11, color: "#605890", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Planet-wise House Comparison</div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", color: "#605890", padding: "6px 10px", borderBottom: "1px solid #1c1840" }}>Planet</th>
                          {result.members.map(({ member, color }) => (
                            <th key={member.id} style={{ color, padding: "6px 10px", borderBottom: "1px solid #1c1840", fontWeight: 600 }}>
                              {member.name || member.role}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {PLANET_LIST.map(p => (
                          <tr key={p} style={{ borderBottom: "1px solid #1c1840" }}>
                            <td style={{ padding: "6px 10px", color: PLANET_COL[p], fontWeight: 600 }}>
                              {PLANET_SYM[p]} {p}
                            </td>
                            {result.members.map(({ member, chart, color }) => {
                              const pd = chart.planets[p];
                              return (
                                <td key={member.id} style={{ padding: "6px 10px", color: "#c8c0a8", textAlign: "center" }}>
                                  <span style={{ color }}>H{pd?.house ?? "?"}</span>
                                  <span style={{ color: "#605890", marginLeft: 4, fontSize: 11 }}>{pd?.sign?.slice(0,3) ?? ""}</span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gap: 14 }}>
                {result.analysis.topPatterns.map(p => (
                  <PatternCard key={p.id} p={p} expanded={expanded === p.id} onToggle={() => setExpanded(expanded === p.id ? null : p.id)} />
                ))}
              </div>
            )}

            {/* All patterns tab */}
            {activeTab === "patterns" && (
              <div style={{ display: "grid", gap: 12 }}>
                {result.analysis.allPatterns.map(p => (
                  <PatternCard key={p.id} p={p} expanded={expanded === p.id} onToggle={() => setExpanded(expanded === p.id ? null : p.id)} />
                ))}
              </div>
            )}

            {/* Kaal Sarp tab */}
            {activeTab === "ksd" && (
              <div>
                {ksdAffected.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🌿</div>
                    <div className="empty-text">No Kaal Sarp Dosha</div>
                    <p style={{ fontSize: 13, color: "#605890" }}>None of the family members&apos; charts show Kaal Sarp Yoga.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, fontSize: 13, color: "#c8c0a8", lineHeight: 1.7 }}>
                      Kaal Sarp Yoga ka arth failure nahi hai — bahut mahaan log iske saath paida hue hain (Sachin Tendulkar, Jawaharlal Nehru). Iska arth hai Rahu-Ketu axis par karmic lesson extra intense hai. Fear se nahi, awareness se isko samjhein.
                    </div>
                    <div style={{ display: "grid", gap: 12 }}>
                      {result.analysis.kaalSarpAnalysis.map(({ member, result: ksd }) => (
                        <KsdCard key={member.id} name={`${ROLE_ICONS[member.role as keyof typeof ROLE_ICONS]} ${memberLabel(member)} (${member.role})`} result={ksd} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Safety boundary */}
            <div style={{ marginTop: 32, padding: "14px 18px", background: "rgba(200,160,48,0.04)", border: "1px solid rgba(200,160,48,0.1)", borderRadius: 10, fontSize: 12, color: "#605890", lineHeight: 1.7 }}>
              ⚠️ Ye analysis symbolic aur awareness-based hai. Isko fixed destiny, medical/legal verdict, ya fear prediction ki tarah use nahi karna chahiye. Real concerns me qualified professional ki advice zaroor lein.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
