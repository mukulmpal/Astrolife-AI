"use client";

import { useState, useCallback } from "react";
import { calculateNumerology, analyzeNumber, suggestATMPins, type NumerologyNumber, type PinnacleNumber, type ChallengeNumber, type IntensityEntry, type DigitAnalysis, type CompatScore } from "@/lib/astro-engine/numerology";
import { useUserChart } from "@/lib/user-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "@/app/dashboard/shared.css";

// ── Helpers ───────────────────────────────────────────────────────────────────

function qualityColor(n: NumerologyNumber) { return n.color; }

// ── Sub-components ────────────────────────────────────────────────────────────

function NumCard({ n, expanded, onToggle }: { n: NumerologyNumber; expanded: boolean; onToggle: () => void }) {
  const c = n.color;
  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-all"
      style={{ background: c + "0e", border: `1px solid ${expanded ? c + "55" : c + "22"}` }}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold shrink-0" style={{ fontFamily: "Cormorant Garamond, serif", color: c, lineHeight: 1 }}>
            {n.value}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/35 mb-1">{n.label}</p>
            <p className="text-lg font-semibold text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>{n.archetype}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-sm" style={{ color: c }}>{n.planetIcon}</span>
              <span className="text-xs text-white/40">{n.planet}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: c + "20", color: c }}>{n.keyword}</span>
              {n.isMaster && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">MASTER</span>}
            </div>
          </div>
        </div>
        <span className="text-white/20 text-sm shrink-0 mt-1">{expanded ? "▲" : "▼"}</span>
      </div>

      <p className="text-sm text-white/55 mt-3 leading-relaxed">{n.theme}</p>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/08 flex flex-col gap-4">
          <p className="text-sm text-white/70 leading-[1.85]">{n.desc}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Strengths</p>
              {n.strengths.map(s => <p key={s} className="text-xs text-white/65 mb-1.5">✦ {s}</p>)}
            </div>
            <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">Challenges</p>
              {n.challenges.map(ch => <p key={ch} className="text-xs text-white/65 mb-1.5">⚠ {ch}</p>)}
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap text-xs text-white/40">
            <span>Lucky: <span style={{ color: c }}>{n.luckyDays}</span></span>
            <span>Compatible: {n.compatibleWith.map(x => (
              <span key={x} className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ml-1" style={{ background: c + "20", color: c }}>{x}</span>
            ))}</span>
            <div className="flex gap-1.5 ml-auto">
              {n.luckyColors.map(col => <div key={col} className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: col }} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PinnacleCard({ p }: { p: PinnacleNumber }) {
  const colors = ["#f97316", "#22c55e", "#6366f1", "#eab308"];
  const idx = ["1st", "2nd", "3rd", "4th"].indexOf(p.label.split(" ")[0]);
  const c = colors[idx] ?? "#94a3b8";
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: p.isActive ? c + "18" : c + "08", border: `1px solid ${p.isActive ? c + "55" : c + "22"}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c }}>{p.label}</span>
        {p.isActive && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: c + "25", color: c }}>ACTIVE NOW</span>}
        {p.isMaster && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-300">MASTER</span>}
      </div>
      <p className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: c }}>{p.number}</p>
      <p className="text-sm font-semibold text-white">{p.theme}</p>
      <p className="text-xs text-white/50 leading-relaxed">{p.guidance}</p>
      <p className="text-xs text-white/30 mt-1">Age {p.ageFrom} – {p.ageTo ?? "∞"}</p>
    </div>
  );
}

function ChallengeCard({ c: ch }: { c: ChallengeNumber }) {
  const isLifelong = ch.label.includes("Life");
  const color = isLifelong ? "#f59e0b" : "#ef4444";
  return (
    <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: ch.isActive ? color + "12" : color + "06", border: `1px solid ${ch.isActive ? color + "45" : color + "20"}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{ch.label}</span>
        {ch.isActive && !isLifelong && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: color + "20", color }}>ACTIVE</span>}
        {isLifelong && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">WHOLE LIFE</span>}
      </div>
      <p className="text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color }}>{ch.number}</p>
      <p className="text-xs text-white/55 leading-relaxed">{ch.meaning}</p>
      {!isLifelong && <p className="text-xs text-white/30">Age {ch.ageFrom} – {ch.ageTo ?? "∞"}</p>}
    </div>
  );
}

function IntensityBar({ entry }: { entry: IntensityEntry }) {
  const max = 5;
  const pct = Math.min(100, (entry.count / max) * 100);
  const color = entry.missing ? "#ef4444" : entry.count >= 4 ? "#f59e0b" : "#22c55e";
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: color + "20", color }}>
        {entry.digit}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/50">{entry.missing ? "Missing" : `×${entry.count}`}</span>
          <span className="text-[10px]" style={{ color }}>{entry.missing ? "Karmic Lesson" : entry.count >= 4 ? "Intensified" : "Present"}</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
        </div>
        <p className="text-[11px] text-white/35 mt-1 leading-snug">{entry.meaning}</p>
      </div>
    </div>
  );
}

// ── Number Checker Components ─────────────────────────────────────────────────

const COMPAT_META: Record<CompatScore, { color: string; bg: string; label: string; icon: string }> = {
  excellent:   { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  label: "Excellent",   icon: "✅" },
  good:        { color: "#eab308", bg: "rgba(234,179,8,0.12)",  label: "Good",        icon: "🟡" },
  neutral:     { color: "#60a5fa", bg: "rgba(96,165,250,0.10)", label: "Neutral",     icon: "⚡" },
  challenging: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  label: "Challenging", icon: "❌" },
};

function NumberResult({ analysis, context }: { analysis: DigitAnalysis; context: string }) {
  const fc = COMPAT_META[analysis.compatScore];
  const lc = COMPAT_META[analysis.last4CompatScore];
  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* 3-stat header */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center" style={{ background: fc.bg, border: `1px solid ${fc.color}44` }}>
          <p className="text-[10px] text-white/35 mb-1">Total Root</p>
          <p className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: fc.color }}>{analysis.root}</p>
          <p className="text-[10px] font-semibold mt-1" style={{ color: fc.color }}>{fc.icon} {fc.label}</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: lc.bg, border: `1px solid ${lc.color}44` }}>
          <p className="text-[10px] text-white/35 mb-1">Last 4 Root ({analysis.last4})</p>
          <p className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: lc.color }}>{analysis.last4root}</p>
          <p className="text-[10px] font-semibold mt-1" style={{ color: lc.color }}>{lc.icon} {lc.label}</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(200,160,48,0.08)", border: "1px solid rgba(200,160,48,0.25)" }}>
          <p className="text-[10px] text-white/35 mb-1">Sum</p>
          <p className="text-3xl font-bold text-amber-300" style={{ fontFamily: "Cormorant Garamond, serif" }}>{analysis.sum}</p>
          <p className="text-[10px] text-white/40 mt-1">→ {analysis.root}</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="rounded-xl p-4" style={{ background: fc.bg, border: `1px solid ${fc.color}33` }}>
        <p className="text-xs font-semibold mb-2" style={{ color: fc.color }}>Numerological Reading — {context}</p>
        <p className="text-sm text-white/65 leading-relaxed">{analysis.narrative}</p>
      </div>

      {/* Ideal roots */}
      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/08">
        <p className="text-xs text-white/35 mb-2">Your friendly roots: <span className="text-sky-300 font-semibold">{analysis.idealRoots.join(" · ")}</span></p>
        <p className="text-xs text-white/35">Digits breakdown: <span className="text-white/60 tracking-widest font-mono">{analysis.digits}</span> → Sum {analysis.sum} → Root <strong style={{ color: fc.color }}>{analysis.root}</strong></p>
      </div>

      {/* Correction suggestions if needed */}
      {(analysis.compatScore === "challenging" || analysis.last4CompatScore === "challenging") && analysis.suggestedLastDigits.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <p className="text-xs font-semibold text-red-400 mb-2">⚠ Suggested correction — change last digit to:</p>
          <p className="text-xs text-white/40 mb-3">Current last digit: <strong className="text-red-300">{analysis.lastDigit}</strong>. Change only this digit to shift the total root into compatible territory.</p>
          <div className="flex flex-wrap gap-2">
            {analysis.suggestedLastDigits.map(s => {
              const sm = COMPAT_META[s.score];
              return (
                <div key={s.digit} className="rounded-lg p-2.5 text-center min-w-[60px]" style={{ background: sm.bg, border: `1px solid ${sm.color}44` }}>
                  <p className="text-xs text-white/40">End in</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: sm.color }}>{s.digit}</p>
                  <p className="text-[10px]" style={{ color: sm.color }}>Root {s.root}</p>
                  <p className="text-[10px]" style={{ color: sm.color }}>{sm.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compatible confirmation */}
      {analysis.compatScore !== "challenging" && analysis.last4CompatScore !== "challenging" && (
        <div className="rounded-xl p-3" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.20)" }}>
          <p className="text-sm text-emerald-400 font-semibold">✅ This {context} is compatible — use it confidently.</p>
          {analysis.idealRoots.includes(analysis.root) && (
            <p className="text-xs text-white/50 mt-1">Root {analysis.root} is in your friendly set. Excellent alignment.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function NumerologyPage() {
  const [activeTab, setActiveTab] = useState<"core" | "name" | "pinnacles" | "year" | "checker">("core");
  const [expandedCard, setExpandedCard] = useState<string | null>("Life Path");
  const [mobileInput, setMobileInput] = useState("");
  const [vehicleInput, setVehicleInput] = useState("");
  const [mobileResult, setMobileResult] = useState<DigitAnalysis | null>(null);
  const [vehicleResult, setVehicleResult] = useState<DigitAnalysis | null>(null);
  const [mobileError, setMobileError] = useState("");
  const [vehicleError, setVehicleError] = useState("");
  const { birth } = useUserChart();

  const result = calculateNumerology(birth.name, birth.dob);
  const {
    lifePath, destiny, soulUrge, personality, birthday, maturity, personalYear,
    pinnacles, challenges, activePinnacle, activeChallenge,
    karmicDebts, hiddenPassion, bridgeNumber, personalDay, intensityMap,
    nameBreakdown, monthForecast, summary, currentAge,
  } = result;

  const coreNumbers: NumerologyNumber[] = [lifePath, destiny, soulUrge, personality, birthday, maturity, personalYear];
  const currentYear = new Date().getFullYear();
  const atmPins = suggestATMPins(lifePath.value, destiny.value);

  const checkMobile = useCallback(() => {
    const digits = mobileInput.replace(/\D/g, "");
    if (digits.length < 5) { setMobileError("Valid mobile number enter karein (min 5 digits)"); return; }
    setMobileError("");
    setMobileResult(analyzeNumber(mobileInput, lifePath.value, destiny.value));
  }, [mobileInput, lifePath.value, destiny.value]);

  const checkVehicle = useCallback(() => {
    if (!vehicleInput.trim()) { setVehicleError("Vehicle number enter karein (e.g. DL3CAB1234)"); return; }
    setVehicleError("");
    setVehicleResult(analyzeNumber(vehicleInput, lifePath.value, destiny.value));
  }, [vehicleInput, lifePath.value, destiny.value]);

  const tabs = [
    { key: "core",      label: "Core Numbers" },
    { key: "name",      label: "Name Analysis" },
    { key: "pinnacles", label: "Pinnacles & Challenges" },
    { key: "year",      label: `${currentYear} Forecast` },
    { key: "checker",   label: "Number Checker" },
  ] as const;

  return (
    <main
      className="min-h-screen text-white"
      style={{
        padding: "32px 24px 110px",
        background:
          "radial-gradient(circle at top left, rgba(200,160,48,0.10), transparent 35%), radial-gradient(circle at bottom right, rgba(99,102,241,0.08), transparent 30%), #05020f",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto", width: "100%" }} className="flex flex-col gap-6">

        {/* Header */}
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Pythagorean Numerology</p>
          <h1 className="text-3xl font-bold mt-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>Your Numbers, <em>Decoded</em></h1>
          <p className="text-white/50 text-sm mt-1">Pythagorean system · 7 core + Pinnacles + Challenges · Master numbers · Karmic debt · {currentYear} forecast</p>
        </section>

        {/* Profile summary bar */}
        <section className="rounded-2xl p-5" style={{ background: "rgba(200,160,48,0.07)", border: "1px solid rgba(200,160,48,0.25)" }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Numerology Profile</p>
              <p className="text-2xl font-semibold text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>{birth.name}</p>
              <p className="text-sm text-white/40 mt-0.5">Age {currentAge} · Personal Day: <span className="font-bold text-amber-300">{personalDay}</span></p>
            </div>
            <div className="flex gap-4 flex-wrap">
              {[
                { n: lifePath.value,     l: "Life Path",    c: lifePath.color },
                { n: destiny.value,      l: "Destiny",      c: destiny.color },
                { n: personalYear.value, l: "Personal Year", c: personalYear.color },
                { n: personalDay,        l: "Personal Day", c: "#94a3b8" },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-3xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: s.c }}>{s.n}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/35 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/55 mt-3 leading-relaxed border-t border-white/08 pt-3">{summary}</p>
        </section>

        {/* Active Pinnacle + Challenge quick view */}
        {(activePinnacle || activeChallenge) && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activePinnacle && (
              <div className="rounded-2xl p-4" style={{ background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.35)" }}>
                <p className="text-xs uppercase tracking-widest text-indigo-300 mb-2">Active Pinnacle</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-indigo-300" style={{ fontFamily: "Cormorant Garamond, serif" }}>{activePinnacle.number}</span>
                  <div>
                    <p className="font-semibold text-white">{activePinnacle.theme}</p>
                    <p className="text-xs text-white/50 mt-0.5">Ages {activePinnacle.ageFrom}–{activePinnacle.ageTo ?? "∞"}</p>
                  </div>
                </div>
              </div>
            )}
            {activeChallenge && (
              <div className="rounded-2xl p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.30)" }}>
                <p className="text-xs uppercase tracking-widest text-red-300 mb-2">Active Challenge</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-red-300" style={{ fontFamily: "Cormorant Garamond, serif" }}>{activeChallenge.number}</span>
                  <p className="text-sm text-white/65 leading-relaxed">{activeChallenge.meaning.split("—")[0]?.trim()}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Karmic Debt alert */}
        {karmicDebts.length > 0 && (
          <section className="rounded-2xl p-4" style={{ background: "rgba(245,158,11,0.09)", border: "1px solid rgba(245,158,11,0.35)" }}>
            <p className="text-xs uppercase tracking-widest text-amber-300 mb-3">⚠ Karmic Debt Detected</p>
            <div className="flex flex-col gap-4">
              {karmicDebts.map(debt => (
                <div key={debt.number} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-amber-300" style={{ fontFamily: "Cormorant Garamond, serif" }}>{debt.number}/{debt.reducedTo}</span>
                    <span className="text-xs text-white/40">from {debt.source}</span>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{debt.meaning}</p>
                  <p className="text-xs text-amber-300/80 italic">Remedy: {debt.remedy}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? "rgba(200,160,48,0.20)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${activeTab === tab.key ? "rgba(200,160,48,0.55)" : "rgba(255,255,255,0.10)"}`,
                color: activeTab === tab.key ? "#fbbf24" : "rgba(255,255,255,0.45)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CORE NUMBERS ── */}
        {activeTab === "core" && (
          <section className="flex flex-col gap-4">
            {/* Bridge + Hidden Passion quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl p-3 border border-white/08 bg-white/[0.03]">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Bridge Number</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>{bridgeNumber}</p>
                <p className="text-[11px] text-white/40 mt-0.5">Gap between life path & destiny</p>
              </div>
              <div className="rounded-xl p-3 border border-white/08 bg-white/[0.03]">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Hidden Passion</p>
                <p className="text-2xl font-bold text-amber-300" style={{ fontFamily: "Cormorant Garamond, serif" }}>{hiddenPassion.join(", ")}</p>
                <p className="text-[11px] text-white/40 mt-0.5">Most frequent digit in name</p>
              </div>
              <div className="rounded-xl p-3 border border-white/08 bg-white/[0.03]">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Birthday Number</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "Cormorant Garamond, serif", color: birthday.color }}>{birthday.value}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{birthday.archetype}</p>
              </div>
              <div className="rounded-xl p-3 border border-white/08 bg-white/[0.03]">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Maturity Number</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "Cormorant Garamond, serif", color: maturity.color }}>{maturity.value}</p>
                <p className="text-[11px] text-white/40 mt-0.5">Your 40+ destiny</p>
              </div>
            </div>
            {coreNumbers.map(n => (
              <NumCard key={n.label} n={n} expanded={expandedCard === n.label} onToggle={() => setExpandedCard(expandedCard === n.label ? null : n.label)} />
            ))}
          </section>
        )}

        {/* ── NAME ANALYSIS ── */}
        {activeTab === "name" && (
          <section className="flex flex-col gap-4">
            {/* Letter grid */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-widest text-white/35 mb-1">Pythagorean Name Chart</p>
              <p className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>{birth.name}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {nameBreakdown.map((l, i) =>
                  l.letter === " " ? (
                    <div key={i} className="w-4" />
                  ) : (
                    <div key={i} className="flex flex-col items-center gap-1 rounded-lg px-2.5 py-2 min-w-[32px]"
                      style={{
                        background: l.isVowel ? "rgba(236,72,153,0.10)" : "rgba(96,165,250,0.10)",
                        border: `1px solid ${l.isVowel ? "rgba(236,72,153,0.30)" : "rgba(96,165,250,0.30)"}`,
                      }}>
                      <span className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: l.isVowel ? "#ec4899" : "#60a5fa" }}>{l.letter}</span>
                      <span className="text-xs font-bold" style={{ color: l.isVowel ? "#ec4899" : "#60a5fa" }}>{l.value}</span>
                    </div>
                  )
                )}
              </div>
              <div className="flex gap-4 text-xs text-white/40">
                <span><span className="text-pink-400">■</span> Vowels → Soul Urge ({soulUrge.value})</span>
                <span><span className="text-blue-400">■</span> Consonants → Personality ({personality.value})</span>
              </div>
            </div>

            {/* Three name numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[destiny, soulUrge, personality].map(n => (
                <div key={n.label} className="rounded-2xl p-4 text-center" style={{ background: n.color + "0e", border: `1px solid ${n.color}30` }}>
                  <p className="text-xs uppercase tracking-widest text-white/35 mb-2">{n.label}</p>
                  <p className="text-5xl font-bold mb-2" style={{ fontFamily: "Cormorant Garamond, serif", color: n.color }}>{n.value}</p>
                  <p className="text-base font-semibold text-white">{n.archetype}</p>
                  <p className="text-xs text-white/40 mt-1">{n.planetIcon} {n.planet}</p>
                  <p className="text-xs text-white/50 leading-relaxed mt-2">{n.theme}</p>
                </div>
              ))}
            </div>

            {/* Intensity Map */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-widest text-white/35 mb-1">Intensity Map</p>
              <p className="text-sm text-white/40 mb-4">Frequency of each number in your name — missing = karmic lesson, excess = intensified trait</p>
              <div className="flex flex-col gap-4">
                {intensityMap.map(entry => <IntensityBar key={entry.digit} entry={entry} />)}
              </div>
            </div>

            {/* Hidden Passion */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.30)" }}>
              <p className="text-xs uppercase tracking-widest text-amber-300 mb-2">Hidden Passion Number · {hiddenPassion.join(", ")}</p>
              <p className="text-sm text-white/65 leading-relaxed">
                Your Hidden Passion is the most frequently appearing number in your name. It reveals an innate talent or deep inner drive that operates quietly but powerfully beneath the surface — a strength you may take for granted because it comes so naturally.
              </p>
            </div>
          </section>
        )}

        {/* ── PINNACLES & CHALLENGES ── */}
        {activeTab === "pinnacles" && (
          <section className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/35 mb-3">4 Pinnacle Numbers — Major life phases and their energy</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {pinnacles.map(p => <PinnacleCard key={p.label} p={p} />)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/08 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">About Pinnacle Numbers</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Pinnacles represent the major chapters of your life — the prevailing energy governing each phase of your journey.
                Your Life Path number determines when each pinnacle begins and ends. The active pinnacle is the energy you are currently living through,
                shaping the opportunities and lessons available to you right now.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white/35 mb-3">4 Challenge Numbers — Obstacles and karmic lessons</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {challenges.map(c => <ChallengeCard key={c.label} c={c} />)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/08 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">About Challenge Numbers</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Challenge numbers reveal the specific lessons and obstacles you must overcome in each life phase.
                The Major Challenge (Challenge 3) operates across your entire life. A Challenge of 0 is rare and
                indicates karmic freedom — but demands conscious self-direction. These are not punishments but doorways
                to your most significant growth.
              </p>
            </div>
          </section>
        )}

        {/* ── YEAR FORECAST ── */}
        {activeTab === "year" && (
          <section className="flex flex-col gap-4">
            {/* Personal Year big card */}
            <div className="rounded-2xl p-5" style={{ background: personalYear.color + "12", border: `1px solid ${personalYear.color}40` }}>
              <div className="flex items-start gap-6 flex-wrap">
                <div className="text-center min-w-[90px]">
                  <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Personal Year</p>
                  <p className="text-7xl font-bold leading-none" style={{ fontFamily: "Cormorant Garamond, serif", color: personalYear.color }}>{personalYear.value}</p>
                  <p className="text-sm font-semibold text-white mt-2">{personalYear.archetype}</p>
                  {personalYear.isMaster && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 mt-1 inline-block">MASTER</span>}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: personalYear.color }}>{personalYear.keyword} · {currentYear}</p>
                  <p className="text-xl font-semibold text-white leading-snug mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>{personalYear.theme}</p>
                  <p className="text-sm text-white/65 leading-[1.85] mb-4">{personalYear.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.20)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Focus On</p>
                      {personalYear.strengths.map(s => <p key={s} className="text-xs text-white/60 mb-1.5">✦ {s}</p>)}
                    </div>
                    <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.20)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">Watch For</p>
                      {personalYear.challenges.map(c => <p key={c} className="text-xs text-white/60 mb-1.5">⚠ {c}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 9-year cycle */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-widest text-white/35 mb-3">Your 9-Year Cycle · You are in Year {personalYear.value}</p>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 9 }, (_, i) => {
                  const yr = currentYear - (personalYear.value - 1) + i;
                  const py = i + 1;
                  const isCurr = yr === currentYear;
                  return (
                    <div key={i} className="flex-1 min-w-[60px] text-center rounded-xl p-3"
                      style={{ background: isCurr ? "rgba(200,160,48,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${isCurr ? "rgba(200,160,48,0.40)" : "rgba(255,255,255,0.07)"}` }}>
                      <p className="text-xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: isCurr ? "#fbbf24" : "rgba(255,255,255,0.20)" }}>{py}</p>
                      <p className="text-[10px]" style={{ color: isCurr ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.20)" }}>{yr}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-white/45 mt-4 leading-relaxed">
                {personalYear.value <= 3
                  ? "Early phase — plant seeds, build momentum, and initiate new directions."
                  : personalYear.value <= 6
                  ? "Active phase — harvest what you've built, expand relationships and commitments."
                  : "Completion phase — release what no longer serves and prepare for the next cycle."}
              </p>
            </div>

            {/* Monthly forecast */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-widest text-white/35 mb-3">{currentYear} Month-by-Month Energy Guide</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {monthForecast.map(m => (
                  <div key={m.month} className="rounded-xl p-3 relative"
                    style={{ background: m.isCurrent ? "rgba(200,160,48,0.09)" : "rgba(255,255,255,0.02)", border: `1px solid ${m.isCurrent ? "rgba(200,160,48,0.40)" : "rgba(255,255,255,0.06)"}` }}>
                    {m.isCurrent && (
                      <span className="absolute -top-2.5 left-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black uppercase tracking-wider">NOW</span>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color: m.isCurrent ? "#fbbf24" : "rgba(255,255,255,0.60)" }}>{m.monthName}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{m.icon}</span>
                        <span className="text-lg font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: m.isMaster ? "#fbbf24" : "rgba(255,255,255,0.35)" }}>{m.energy}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-white/40 leading-snug">{m.theme}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── NUMBER CHECKER ── */}
        {activeTab === "checker" && (
          <section className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/08 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-1">SP Bhagat Principle</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Every number you carry daily — phone, vehicle, ATM PIN — creates a vibrational field. When that field aligns with your Life Path ({lifePath.value}) and Destiny ({destiny.value}), it subtly amplifies your energy. When it conflicts, it creates friction. Small changes in the last digit can shift the entire vibration.
              </p>
            </div>

            {/* Mobile Number */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-widest text-sky-300 mb-3">📱 Mobile Number Checker</p>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={mobileInput}
                  onChange={e => setMobileInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && checkMobile()}
                  placeholder="e.g. 9876543210"
                  className="flex-1 rounded-xl px-4 py-3 text-sm text-white bg-white/[0.06] border border-white/15 outline-none focus:border-sky-500/50 placeholder:text-white/25 tracking-widest font-mono"
                />
                <button
                  onClick={checkMobile}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-sky-300 transition-all"
                  style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.35)" }}
                >
                  Analyse
                </button>
              </div>
              {mobileError && <p className="text-xs text-red-400 mt-2">{mobileError}</p>}
              {mobileResult && <NumberResult analysis={mobileResult} context="Mobile Number" />}
            </div>

            {/* Vehicle Number */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-widest text-emerald-300 mb-3">🚗 Vehicle Number Checker</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vehicleInput}
                  onChange={e => setVehicleInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && checkVehicle()}
                  placeholder="e.g. DL3CAB1234 or MH01AB1234"
                  className="flex-1 rounded-xl px-4 py-3 text-sm text-white bg-white/[0.06] border border-white/15 outline-none focus:border-emerald-500/50 placeholder:text-white/25 tracking-widest font-mono uppercase"
                />
                <button
                  onClick={checkVehicle}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-emerald-300 transition-all"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)" }}
                >
                  Analyse
                </button>
              </div>
              <p className="text-xs text-white/30 mt-1.5">Only digits are extracted — letters are ignored in calculation</p>
              {vehicleError && <p className="text-xs text-red-400 mt-2">{vehicleError}</p>}
              {vehicleResult && <NumberResult analysis={vehicleResult} context="Vehicle Number" />}
            </div>

            {/* ATM PIN Suggestions */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
              <p className="text-xs uppercase tracking-widest text-amber-300 mb-1">🔐 Lucky ATM PIN Suggestions</p>
              <p className="text-sm text-white/45 mb-4">4-digit PINs whose digit sum is compatible with your Life Path ({lifePath.value}) and Destiny ({destiny.value}). No sequential (1234) or repeated (1111) patterns.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {atmPins.map(p => {
                  const m = COMPAT_META[p.score];
                  return (
                    <div key={p.pin} className="rounded-xl p-3 text-center" style={{ background: m.bg, border: `1px solid ${m.color}44` }}>
                      <p className="text-2xl font-bold tracking-widest font-mono" style={{ color: m.color }}>{p.pin}</p>
                      <p className="text-[10px] mt-1" style={{ color: m.color }}>Root {p.root} · {m.label}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-white/30 mt-3">⚠ These are numerological suggestions only — use your own judgment for PIN security.</p>
            </div>
          </section>
        )}

      </div>
      <MobileBottomNav />
    </main>
  );
}
