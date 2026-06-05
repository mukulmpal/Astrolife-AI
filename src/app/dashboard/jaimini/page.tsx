"use client";

import { useMemo, useState } from "react";
import { EngineIntro, EngineEmptyState } from "@/components/engine/engine-intro";
import { engineIntros } from "@/data/engine-intros";
import { useUserChart } from "@/lib/user-chart";
import {
  buildJaiminiChart,
  RASHI_ICONS,
  SIGN_COLOR,
  KARAKA_ICONS,
  formatCharaDate,
  formatCharaDaysRemaining,
  type Karaka,
  type ArudhaPada,
  type CharaDashaPeriod,
} from "@/lib/astro-engine/jaimini";
import { useLanguage } from "@/lib/language-context";
import "@/app/dashboard/shared.css";

// ── Sub-components ────────────────────────────────────────────────────────────

function KarakaCard({ k }: { k: Karaka }) {
  const color = SIGN_COLOR[k.signNum] ?? "#94a3b8";
  const isAK = k.role === "AK";
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: color + (isAK ? "22" : "10"),
        border: `1px solid ${color}${isAK ? "66" : "33"}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: color + "25", color }}>
          {k.role}
        </span>
        <span className="text-xl">{KARAKA_ICONS[k.role]}</span>
      </div>
      <p className="text-xl font-bold text-white mt-1">{k.planet}</p>
      <p className="text-xs text-white/50">{k.sign} · {k.degreeInSign.toFixed(1)}°</p>
      <p className="text-xs text-white/40 leading-relaxed mt-1">{k.meaning}</p>
    </div>
  );
}

function ArudhaRow({ a }: { a: ArudhaPada }) {
  const color = SIGN_COLOR[a.signNum] ?? "#94a3b8";
  const isKey = [1, 7, 10, 12].includes(a.house);
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
      style={{
        background: isKey ? color + "14" : "transparent",
        border: `1px solid ${isKey ? color + "40" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <span className="text-xs font-bold w-7 text-center shrink-0" style={{ color }}>{a.shortName}</span>
      <span className="text-lg w-6 text-center shrink-0">{RASHI_ICONS[a.signNum]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90">{a.name}</p>
        <p className="text-xs text-white/40">{a.sign} · {a.meaning}</p>
      </div>
    </div>
  );
}

function CharaRow({ period, selected, onClick }: { period: CharaDashaPeriod; selected: boolean; onClick: () => void }) {
  const color = SIGN_COLOR[period.signNum] ?? "#94a3b8";
  const now = new Date();
  const isPast = period.endDate < now;
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all"
      style={{
        background: selected ? color + "22" : isPast ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${selected ? color + "66" : "rgba(255,255,255,0.08)"}`,
        opacity: isPast ? 0.5 : 1,
      }}
    >
      <span className="text-xl w-7 text-center shrink-0">{RASHI_ICONS[period.signNum]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">{period.sign} Dasha</span>
          <span className="text-white/40 text-xs">({period.years} yrs)</span>
          {period.isActive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: color + "33", color }}>ACTIVE</span>
          )}
        </div>
        <p className="text-xs text-white/40 mt-0.5">
          {formatCharaDate(period.startDate)} — {formatCharaDate(period.endDate)}
        </p>
      </div>
      {period.isActive && (
        <div className="text-right shrink-0">
          <p className="text-xs font-bold" style={{ color }}>{period.progressPercent}%</p>
          <p className="text-[10px] text-white/40">{formatCharaDaysRemaining(period.daysRemaining)}</p>
        </div>
      )}
    </button>
  );
}

// ── Aspect Grid ───────────────────────────────────────────────────────────────

const ASPECT_MAP: Record<number, number[]> = {
  0: [4,7,10], 1: [0,6,9], 2: [5,8,11], 3: [1,7,10], 4: [0,3,9], 5: [2,8,11],
  6: [1,4,10], 7: [0,3,6], 8: [2,5,11], 9: [1,4,7], 10: [3,6,9], 11: [2,5,8],
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function JaiminiPage() {
  const { birth, chart, loading, hasUserChart } = useUserChart();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"karakas" | "arudhas" | "dasha" | "aspects">("karakas");

  const jaimini = useMemo(() => {
    if (!chart || !hasUserChart) return null;
    try { return buildJaiminiChart(chart); } catch { return null; }
  }, [chart, hasUserChart]);

  if (loading) {
    return (
      <div className="page" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
        <p style={{color:"#605890"}}>Loading Jaimini...</p>
      </div>
    );
  }

  if (!chart || !jaimini) {
    return (
      <div className="page" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
        <p style={{color:"#605890"}}>Birth chart required for Jaimini analysis.</p>
      </div>
    );
  }

  const tabs = [
    { key: "karakas", label: "Chara Karakas" },
    { key: "arudhas", label: "Arudha Padas" },
    { key: "dasha",   label: "Chara Dasha" },
    { key: "aspects", label: "Rashi Drishti" },
  ] as const;

  const ak = jaimini.karakas.find((k) => k.role === "AK");

  return (
    <div className="page">
      <div className="flex flex-col gap-6">
        <div className="page-tag">{t("jaimini.page_tag")}</div>
        <h1 className="page-title serif">{t("jaimini.page_title")}</h1>
        <p className="page-sub">
          Jaimini uses sign-based karakas and Chara Dasha — a different lens from Parashari timing.
        </p>

        <div className="header-card">
          <div className="header-orb" />
          <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a030", marginBottom: 6 }}>
              Executive summary
            </div>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 600, color: "#f0e8d0" }}>
              {birth.name || chart.name}
            </div>
            <div style={{ fontSize: 13, color: "#605890", marginTop: 4 }}>
              Lagna {chart.lagnaRashi}
              {ak ? ` · Atmakaraka ${ak.planet} in ${ak.sign}` : ""}
              {jaimini.currentDasha ? ` · Chara Dasha ${jaimini.currentDasha.sign}` : ""}
            </div>
          </div>
        </div>

        <div className="summary-strip" style={{ lineHeight: 1.8 }}>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#c8c0a8" }}>
            <li>Chara Karakas rank planets by degree — the Atmakaraka shows soul-level purpose.</li>
            <li>Arudha Padas reveal how others perceive your career, marriage, and status houses.</li>
            <li>Chara Dasha times events by sign periods; pair with D1 transits for dating windows.</li>
          </ul>
        </div>

        <section className="card">
          <div className="card-tag">Plain-English Guidance</div>
          <div className="card-title serif">How To Use This Jaimini Reading</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            <div style={{ border: "1px solid #1c1840", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.025)" }}>
              <div style={{ fontSize: 11, color: "#c8a030", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Soul Role</div>
              <p style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.7, margin: 0 }}>
                {ak ? `${ak.planet} as Atmakaraka shows the central life lesson: ${ak.meaning}` : "Atmakaraka shows the soul lesson once chart data is available."}
              </p>
            </div>
            <div style={{ border: "1px solid #1c1840", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.025)" }}>
              <div style={{ fontSize: 11, color: "#c8a030", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Current Phase</div>
              <p style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.7, margin: 0 }}>
                {jaimini.currentDasha
                  ? `${jaimini.currentDasha.sign} Chara Dasha is active. Watch decisions, public visibility, relationship themes and career movement connected to this sign.`
                  : "Current Chara Dasha shows which sign is steering life events right now."}
              </p>
            </div>
            <div style={{ border: "1px solid #1c1840", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.025)" }}>
              <div style={{ fontSize: 11, color: "#c8a030", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>What To Do</div>
              <p style={{ fontSize: 13, color: "#c8c0a8", lineHeight: 1.7, margin: 0 }}>
                Use Jaimini for identity, visibility, marriage image and life-direction timing. Confirm exact outcomes with D1, D9, Dasha and transits before acting.
              </p>
            </div>
          </div>
        </section>

        {/* Current Chara Dasha summary */}
        {jaimini.currentDasha && (() => {
          const cd = jaimini.currentDasha;
          const color = SIGN_COLOR[cd.signNum] ?? "#94a3b8";
          return (
            <section className="rounded-2xl p-5" style={{ background: color + "16", border: `1px solid ${color}44` }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color }}>Active Chara Dasha</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{RASHI_ICONS[cd.signNum]}</span>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white">{cd.sign} Dasha · {cd.years} Years</p>
                  <p className="text-sm text-white/50 mt-0.5">{formatCharaDate(cd.startDate)} — {formatCharaDate(cd.endDate)}</p>
                  <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cd.progressPercent}%`, background: color }} />
                  </div>
                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>{cd.progressPercent}% complete</span>
                    <span style={{ color }}>{formatCharaDaysRemaining(cd.daysRemaining)}</span>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Special Findings */}
        {jaimini.specialFindings.length > 0 && (
          <section className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4">
            <p className="text-xs uppercase tracking-widest text-amber-300 mb-3">Special Jaimini Findings</p>
            <div className="flex flex-col gap-2">
              {jaimini.specialFindings.map((f, i) => (
                <div key={i} className="flex gap-2 text-sm text-white/75">
                  <span className="text-amber-400 mt-0.5 shrink-0">✦</span>
                  <span>{f}</span>
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
                background: activeTab === tab.key ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${activeTab === tab.key ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.1)"}`,
                color: activeTab === tab.key ? "#c4b5fd" : "rgba(255,255,255,0.5)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chara Karakas */}
        {activeTab === "karakas" && (
          <section>
            <p className="text-xs uppercase tracking-widest text-white/35 mb-3">7 Chara Karakas — Planet hierarchy by degree in sign</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {jaimini.karakas.map(k => <KarakaCard key={k.role} k={k} />)}
            </div>
            <div className="mt-4 rounded-2xl border border-white/08 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">How Chara Karakas Work</p>
              <p className="text-sm text-white/50 leading-relaxed">
                In Jaimini system, planets are ranked by their degree within the sign (highest = AK, lowest = DK).
                The Atmakaraka (AK) is the most important — it represents the soul&apos;s core desire and spiritual lesson.
                The Amatyakaraka (AmK) shows career and key advisers. Darakaraka (DK) reveals relationship patterns.
              </p>
            </div>
          </section>
        )}

        {/* Arudha Padas */}
        {activeTab === "arudhas" && (
          <section>
            <p className="text-xs uppercase tracking-widest text-white/35 mb-3">12 Arudha Padas — Reflection points of each house</p>
            <div className="flex flex-col gap-1.5">
              {jaimini.arudhas.map(a => <ArudhaRow key={a.house} a={a} />)}
            </div>
            <div className="mt-4 rounded-2xl border border-white/08 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">How Arudha Padas Work</p>
              <p className="text-sm text-white/50 leading-relaxed">
                An Arudha Pada is the <em>illusion</em> or <em>manifest reality</em> of a house — how it appears to the world.
                The Arudha Lagna (AL) shows your public image. A10 (Rajya Pada) shows your career perception.
                Upapada Lagna (UL) reveals the quality of your marriage and spiritual liberation.
              </p>
            </div>
          </section>
        )}

        {/* Chara Dasha */}
        {activeTab === "dasha" && (
          <section>
            <p className="text-xs uppercase tracking-widest text-white/35 mb-3">Chara Dasha — 12-sign lifetime cycle from Lagna</p>
            <div className="flex flex-col gap-2">
              {jaimini.charaDasha.map((d, i) => (
                <CharaRow
                  key={i}
                  period={d}
                  selected={false}
                  onClick={() => {}}
                />
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/08 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">How Chara Dasha Works</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Chara Dasha assigns each sign a period of 1–12 years based on the distance of its lord from the sign.
                The sequence begins from the Lagna sign and proceeds forward (odd Lagna) or backward (even Lagna).
                Each sign&apos;s dasha activates the themes of that sign and its natural significances.
              </p>
            </div>
          </section>
        )}

        {/* Rashi Drishti (Aspects) */}
        {activeTab === "aspects" && (
          <section>
            <p className="text-xs uppercase tracking-widest text-white/35 mb-3">Jaimini Rashi Drishti — Sign-based aspects</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(ASPECT_MAP).map(([from, toArr]) => {
                const fromNum = Number(from);
                const color = SIGN_COLOR[fromNum] ?? "#94a3b8";
                return (
                  <div key={from} className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                    style={{ background: color + "10", border: `1px solid ${color}30` }}>
                    <span className="text-xl w-7 text-center shrink-0">{RASHI_ICONS[fromNum]}</span>
                    <span className="text-sm font-medium text-white/70 w-20 shrink-0">{["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][fromNum]}</span>
                    <span className="text-white/30 text-sm shrink-0">aspects →</span>
                    <div className="flex gap-2">
                      {toArr.map(t => (
                        <span key={t} className="text-lg">{RASHI_ICONS[t]}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-2xl border border-white/08 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Jaimini Aspect Rules</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Unlike Parashari aspects (planet-based), Jaimini aspects are sign-based.
                Movable signs (Aries, Cancer, Libra, Capricorn) aspect Fixed signs except the adjacent one.
                Fixed signs aspect Movable signs except the adjacent one.
                Dual signs (Gemini, Virgo, Sagittarius, Pisces) mutually aspect all other Dual signs.
              </p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
