"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  buildJaiminiChart,
  calculateCharaDashaAD,
  RASHI_ICONS,
  SIGN_COLOR,
  KARAKA_ICONS,
  formatCharaDate,
  formatCharaDaysRemaining,
  type Karaka,
  type ArudhaPada,
  type CharaDashaPeriod,
  type CharaDashaAD,
  type KarakamshaKundali,
  type GkAnalysis,
  type BkAnalysis,
  type DkAnalysis,
  type AkAmkAnalysis,
  type RetrogradePlanetInfo,
} from "@/lib/astro-engine/jaimini";
import { useLanguage } from "@/lib/language-context";
import "@/app/dashboard/shared.css";

// ── Karaka Card ───────────────────────────────────────────────────────────────

function KarakaCard({ k }: { k: Karaka }) {
  const color = SIGN_COLOR[k.signNum] ?? "#B8860B";
  const isAK = k.role === "AK";
  const isGK = k.role === "GK";
  const isDK = k.role === "DK";
  const isBK = k.role === "BK";

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 transition-all"
      style={{
        background: isAK
          ? "rgba(184, 134, 11, 0.08)"
          : isGK
          ? "rgba(220, 38, 38, 0.05)"
          : isDK
          ? "rgba(236, 72, 153, 0.05)"
          : isBK
          ? "rgba(99, 102, 241, 0.05)"
          : "#FFFFFF",
        border: `1px solid ${
          isAK
            ? "rgba(184, 134, 11, 0.45)"
            : isGK
            ? "rgba(220, 38, 38, 0.35)"
            : isDK
            ? "rgba(236, 72, 153, 0.35)"
            : isBK
            ? "rgba(99, 102, 241, 0.3)"
            : "rgba(184, 134, 11, 0.18)"
        }`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
          style={{ background: color + "20", color }}
        >
          {k.role}
        </span>
        <span className="text-xl">{KARAKA_ICONS[k.role]}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-[#1A1A1A] mt-1">{k.planet}</p>
        <p className="text-xs font-medium" style={{ color }}>
          {k.sign} · {k.degreeInSign.toFixed(2)}°
        </p>
      </div>
      <p className="text-xs font-medium text-[#1A1A1A] leading-snug mt-1">{k.meaning}</p>
      <p className="text-[11px] text-[#6B635B] leading-relaxed">{k.signifies}</p>
      {k.notes && (
        <p className="text-[10px] italic text-[#B8860B] mt-auto pt-1 border-t border-[rgba(184,134,11,0.15)]">
          {k.notes}
        </p>
      )}
    </div>
  );
}

// ── Arudha Row ────────────────────────────────────────────────────────────────

function ArudhaRow({ a }: { a: ArudhaPada }) {
  const color = SIGN_COLOR[a.signNum] ?? "#B8860B";
  const isKey = [1, 7, 10, 12].includes(a.house);
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
      style={{
        background: isKey ? "rgba(184, 134, 11, 0.08)" : "#FFFFFF",
        border: `1px solid ${isKey ? "rgba(184, 134, 11, 0.35)" : "rgba(184, 134, 11, 0.15)"}`,
      }}
    >
      <span className="text-xs font-bold w-8 text-center shrink-0" style={{ color }}>{a.shortName}</span>
      <span className="text-lg w-6 text-center shrink-0">{RASHI_ICONS[a.signNum]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1A1A1A]">{a.name}</p>
        <p className="text-xs text-[#6B635B]">{a.sign} · {a.meaning}</p>
      </div>
    </div>
  );
}

// ── Chara Dasha Row with Antardasha Drawer ────────────────────────────────────

function CharaRow({
  period,
  selected,
  onClick,
  adList,
}: {
  period: CharaDashaPeriod;
  selected: boolean;
  onClick: () => void;
  adList?: CharaDashaAD[];
}) {
  const color = SIGN_COLOR[period.signNum] ?? "#B8860B";
  const now = new Date();
  const isPast = period.endDate < now;

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={onClick}
        className="w-full text-left rounded-xl p-3.5 flex items-center gap-3.5 transition-all"
        style={{
          background: selected
            ? "rgba(184, 134, 11, 0.14)"
            : period.isActive
            ? "rgba(184, 134, 11, 0.08)"
            : isPast
            ? "#FAF7F2"
            : "#FFFFFF",
          border: `1px solid ${
            selected
              ? "rgba(184, 134, 11, 0.55)"
              : period.isActive
              ? "rgba(184, 134, 11, 0.4)"
              : "rgba(184, 134, 11, 0.18)"
          }`,
          opacity: isPast ? 0.7 : 1,
        }}
      >
        <span className="text-2xl w-8 text-center shrink-0">{RASHI_ICONS[period.signNum]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#1A1A1A] text-sm">{period.sign} Dasha</span>
            <span className="text-[#6B635B] text-xs font-medium">({period.years} yrs)</span>
            {period.isActive && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#B8860B] text-white">
                ACTIVE
              </span>
            )}
            {period.isGkSign && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700">
                GK SIGN ⚡
              </span>
            )}
            {period.isDkSign && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-pink-100 text-pink-700">
                DK SIGN 💍
              </span>
            )}
            {period.isAkSign && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                AK FAME 👑
              </span>
            )}
            {period.isAmkSign && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
                AmK CAREER 💼
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B635B] mt-1">
            {formatCharaDate(period.startDate)} — {formatCharaDate(period.endDate)}
          </p>
        </div>

        {period.isActive ? (
          <div className="text-right shrink-0">
            <p className="text-xs font-bold" style={{ color: "#B8860B" }}>{period.progressPercent}%</p>
            <p className="text-[10px] text-[#6B635B]">{formatCharaDaysRemaining(period.daysRemaining)}</p>
          </div>
        ) : (
          <span className="text-xs text-[#8C827A] shrink-0">{selected ? "▲" : "▼"}</span>
        )}
      </button>

      {/* Expanded Antardashas */}
      {selected && adList && adList.length > 0 && (
        <div className="ml-4 pl-3 border-l-2 border-[#B8860B]/30 my-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {adList.map((ad, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg text-xs"
              style={{
                background: ad.isActive ? "rgba(184, 134, 11, 0.15)" : "#FAF7F2",
                border: `1px solid ${ad.isActive ? "#B8860B" : "rgba(184,134,11,0.15)"}`,
              }}
            >
              <div className="flex items-center justify-between font-semibold text-[#1A1A1A]">
                <span>{RASHI_ICONS[ad.adSignNum]} {ad.adSign}</span>
                {ad.isActive && <span className="text-[9px] px-1 bg-[#B8860B] text-white rounded">NOW</span>}
              </div>
              <p className="text-[10px] text-[#6B635B] mt-0.5">
                {formatCharaDate(ad.startDate)} - {formatCharaDate(ad.endDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Aspect Map Constant ───────────────────────────────────────────────────────

const ASPECT_MAP: Record<number, number[]> = {
  0:  [4, 7, 10], 1:  [3, 6, 9],  2:  [5, 8, 11], 3:  [1, 7, 10],
  4:  [0, 6, 9],  5:  [2, 8, 11], 6:  [1, 4, 10], 7:  [0, 3, 9],
  8:  [2, 5, 11], 9:  [1, 4, 7],  10: [0, 3, 6],  11: [2, 5, 8],
};

// ── Main Page Component ───────────────────────────────────────────────────────

export default function JaiminiPage() {
  const { birth, chart, loading, hasUserChart } = useUserChart();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"karakas" | "gk_radar" | "dk_marriage" | "dasha" | "retro" | "aspects" | "arudhas">("karakas");
  const [selectedDashaIndex, setSelectedDashaIndex] = useState<number | null>(null);

  const jaimini = useMemo(() => {
    if (!chart || !hasUserChart) return null;
    try {
      return buildJaiminiChart(chart);
    } catch {
      return null;
    }
  }, [chart, hasUserChart]);

  const selectedDashaAds = useMemo(() => {
    if (!chart || !jaimini || selectedDashaIndex === null) return null;
    const period = jaimini.charaDasha[selectedDashaIndex];
    if (!period) return null;
    return calculateCharaDashaAD(period, chart);
  }, [chart, jaimini, selectedDashaIndex]);

  if (loading) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <p className="text-[#6B635B]">Loading Jaimini Engine...</p>
      </div>
    );
  }

  if (!chart || !jaimini) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <p className="text-[#6B635B]">Birth chart required for Jaimini analysis.</p>
      </div>
    );
  }

  const tabs = [
    { key: "karakas",     label: "👑 Karakas & Karakamsha" },
    { key: "gk_radar",    label: "⚡ GK Problem Radar" },
    { key: "dk_marriage", label: "💍 DK Marriage & Spouse" },
    { key: "dasha",       label: "⏳ Chara Dasha (Exact)" },
    { key: "retro",       label: "🔥 Retrograde Activation" },
    { key: "aspects",     label: "👁️ Rashi Drishti" },
    { key: "arudhas",     label: "🏛️ Arudha Padas" },
  ] as const;

  const ak = jaimini.karakas.find((k) => k.role === "AK");
  const gk = jaimini.gkAnalysis;
  const bk = jaimini.bkAnalysis;
  const dk = jaimini.dkAnalysis;
  const akAmk = jaimini.akAmkAnalysis;
  const kk = jaimini.karakamsha;
  const retro = jaimini.retrogradeActivation;

  return (
    <div className="page">
      <div className="flex flex-col gap-6">
        <div className="page-tag">{t("jaimini.page_tag")}</div>
        <h1 className="page-title serif">{t("jaimini.page_title")}</h1>
        <p className="page-sub">
          Jaimini Sutras — Karakamsha Kundali (D9 Base), GK Problem Radar, DK Marriage Timing, and Exact Chara Dasha.
        </p>

        {/* Executive Summary Card */}
        <div className="header-card">
          <div className="header-orb" />
          <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a030", marginBottom: 6 }}>
              Executive Summary · Layer 4 Jaimini System (Standalone Verification)
            </div>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 600, color: "#1A1A1A" }}>
              {birth.name || chart.name}
            </div>
            <div style={{ fontSize: 13, color: "#6B635B", marginTop: 4 }}>
              Lagna {chart.lagnaRashi} ({jaimini.direction} Sequence)
              {ak ? ` · Atmakaraka ${ak.planet} in ${ak.sign}` : ""}
              {` · Karakamsha Lagna ${kk.karakamshaLagna} (via D9 ${kk.d9Sign})`}
              {jaimini.currentDasha ? ` · Current Chara Dasha ${jaimini.currentDasha.sign}` : ""}
            </div>
          </div>
        </div>

        {/* Don't Mix Systems Advisory Banner */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 flex items-center gap-3 text-xs text-amber-950">
          <span className="text-base shrink-0">⚖️</span>
          <p className="leading-relaxed">
            <strong>System Purity Rule:</strong> Do not mix Jaimini formulas directly with Vedic/KP/Navtara. Jaimini evaluates soul karmas, Karakamsha, and sign periods as an independent verification layer.
          </p>
        </div>

        {/* Active Chara Dasha Banner */}
        {jaimini.currentDasha && (() => {
          const cd = jaimini.currentDasha;
          const color = SIGN_COLOR[cd.signNum] ?? "#B8860B";
          return (
            <section
              className="rounded-2xl p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(184, 134, 11, 0.25)",
                boxShadow: "0 2px 14px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#B8860B" }}>
                  Active Chara Dasha · {jaimini.direction} Direction
                </p>
                {cd.isGkSign && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-100 text-red-700">
                    ⚡ GK Testing Period
                  </span>
                )}
                {cd.isDkSign && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-100 text-pink-700">
                    💍 Marriage Manifestation Window
                  </span>
                )}
                {cd.isAkSign && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                    👑 Name & Status Peak
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-5xl">{RASHI_ICONS[cd.signNum]}</span>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    {cd.sign} Dasha · {cd.years} Years
                  </p>
                  <p className="text-sm text-[#6B635B] mt-0.5">
                    {formatCharaDate(cd.startDate)} — {formatCharaDate(cd.endDate)}
                    {jaimini.activeAD && ` · Current Antardasha: ${jaimini.activeAD.adSign}`}
                  </p>
                  <div className="w-full h-2 rounded-full bg-[#E8E2D8] mt-3 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cd.progressPercent}%`, background: color }} />
                  </div>
                  <div className="flex justify-between text-xs text-[#6B635B] mt-1.5 font-medium">
                    <span>{cd.progressPercent}% completed</span>
                    <span style={{ color: "#B8860B", fontWeight: 700 }}>
                      {formatCharaDaysRemaining(cd.daysRemaining)}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* High-Priority GK Alert if Active Dasha is Afflicted */}
        {gk.isCurrentDashaAfflicted && (
          <section className="rounded-2xl border border-red-300 bg-red-50 p-4.5 flex gap-3.5 items-start">
            <span className="text-2xl mt-0.5">⚡</span>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-red-800">
                GK Alert: Active Chara Dasha Activates Gnatikaraka ({gk.gkPlanet})
              </p>
              <p className="text-sm text-red-950 mt-1 leading-relaxed">
                {gk.activeDashaWarning}
              </p>
              <p className="text-xs text-red-800 mt-2 font-semibold">
                Priority Upay: {gk.remedies[0]}
              </p>
            </div>
          </section>
        )}

        {/* BK Affliction Warning if Active */}
        {bk.isBkProblemActive && (
          <section className="rounded-2xl border border-indigo-300 bg-indigo-50/70 p-4 flex gap-3 items-start">
            <span className="text-2xl mt-0.5">🛡️</span>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-indigo-900">
                Bhratrikaraka (BK) Alert
              </p>
              <p className="text-sm text-indigo-950 mt-0.5 leading-relaxed">
                {bk.warning}
              </p>
            </div>
          </section>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background:
                  activeTab === tab.key
                    ? "linear-gradient(135deg, #B8860B, #996515)"
                    : "#FFFFFF",
                border: `1px solid ${
                  activeTab === tab.key ? "#B8860B" : "rgba(184, 134, 11, 0.22)"
                }`,
                color: activeTab === tab.key ? "#FFFFFF" : "#6B635B",
                boxShadow:
                  activeTab === tab.key ? "0 2px 10px rgba(184, 134, 11, 0.25)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: Karakas & Karakamsha Kundali ───────────────────────────── */}
        {activeTab === "karakas" && (
          <div className="flex flex-col gap-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-[#8C827A] font-semibold">
                  7 Chara Karakas — Strictly Degree-Wise (Rahu/Ketu Excluded)
                </p>
                <span className="text-xs text-[#B8860B] font-medium">Ranked from highest to lowest degree</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {jaimini.karakas.map((k) => (
                  <KarakaCard key={k.role} k={k} />
                ))}
              </div>
            </section>

            {/* Karakamsha Kundali Section (D9 Navamsha Base) */}
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">
                      Correct Classical Method
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#B8860B]/15 text-[#B8860B]">
                      D9 Navamsha Base
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mt-1">
                    Karakamsha Kundali (Lagna: {kk.karakamshaLagna} · AK {kk.akPlanet} in D9 {kk.d9Sign})
                  </h3>
                </div>
                <span className="text-3xl">{RASHI_ICONS[kk.karakamshaLagnaNum]}</span>
              </div>

              {/* Clarification Box: D1 Planets As-Is */}
              <div className="mb-4 rounded-xl border border-[rgba(184,134,11,0.2)] bg-[#FAF7F2] p-3 text-xs text-[#4A4238] leading-relaxed">
                <strong>Transcript Principle:</strong> Atmakaraka ({kk.akPlanet}) Navamsha (D9) chart me jis rashi ({kk.d9Sign}) me baitha hai, wahi <strong>Karakamsha Lagna</strong> banta hai. D1 birth chart ke planets apni natal rashi me as-is rehte hain — sirf unke bhav Karakamsha Lagna se count hote hain.
              </div>

              {/* Static Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 rounded-xl border border-[rgba(184,134,11,0.2)] bg-[#FAF7F2]">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                    👑 Soul Core & Swabhava (House 1)
                  </p>
                  <p className="text-sm text-[#1A1A1A] mt-1 leading-relaxed">
                    {kk.staticAnalysis.soulPurpose}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[rgba(184,134,11,0.2)] bg-[#FAF7F2]">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                    💰 Wealth Generation Source (House 2)
                  </p>
                  <p className="text-sm text-[#1A1A1A] mt-1 leading-relaxed">
                    {kk.staticAnalysis.wealthSource}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[rgba(184,134,11,0.2)] bg-[#FAF7F2]">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                    💼 Worldly Authority & Career Destiny (House 10)
                  </p>
                  <p className="text-sm text-[#1A1A1A] mt-1 leading-relaxed">
                    {kk.staticAnalysis.careerDestiny}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[rgba(184,134,11,0.2)] bg-[#FAF7F2]">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                    🏡 Family Foundation & Inner Peace (House 4)
                  </p>
                  <p className="text-sm text-[#1A1A1A] mt-1 leading-relaxed">
                    {kk.staticAnalysis.familyNature}
                  </p>
                </div>
              </div>

              {/* 12 House Grid from Karakamsha */}
              <p className="text-xs uppercase tracking-widest font-semibold text-[#8C827A] mb-2.5">
                12 Houses from Karakamsha Lagna ({kk.karakamshaLagna})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {kk.houses.map((h) => {
                  const hasPlanets = h.planets.length > 0;
                  return (
                    <div
                      key={h.house}
                      className="p-3 rounded-xl border text-xs flex flex-col justify-between"
                      style={{
                        background: hasPlanets ? "rgba(184, 134, 11, 0.06)" : "#FAF7F2",
                        borderColor: hasPlanets ? "rgba(184, 134, 11, 0.35)" : "rgba(184, 134, 11, 0.15)",
                      }}
                    >
                      <div className="flex items-center justify-between font-bold text-[#1A1A1A]">
                        <span>H{h.house} · {h.sign}</span>
                        <span>{RASHI_ICONS[h.signNum]}</span>
                      </div>
                      <p className="text-[11px] text-[#6B635B] mt-1 font-medium">{h.theme}</p>
                      <div className="mt-2 pt-1 border-t border-[rgba(184,134,11,0.12)]">
                        {hasPlanets ? (
                          <span className="font-bold text-[#B8860B]">{h.planets.join(", ")}</span>
                        ) : (
                          <span className="text-[10px] text-[#8C827A]">Vacant</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: GK Problem Radar ──────────────────────────────────────── */}
        {activeTab === "gk_radar" && (
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl border-2 border-red-300 bg-red-50/50 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                  ⚡ Gnatikaraka (GK) — Sabse Important Jaimini Radar
                </span>
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-red-950 mt-1">
                GK Planet: {gk.gkPlanet} in {gk.gkSign} (House {gk.gkHouseFromLagna} from Lagna)
              </h3>
              <p className="text-sm text-red-900 mt-1 leading-relaxed">
                As emphasized in the Jaimini teachings, the Gnatikaraka (GK) is the second lowest degree planet.
                It points directly to where karmic friction, diseases (rog), debts (karz), and opposition (shatru) manifest.
              </p>
            </section>

            {/* RULE C: GK = Lagna Lord Alert */}
            {gk.isGkLagnaLord && (
              <section className="rounded-2xl border-2 border-red-500 bg-red-100/80 p-4.5">
                <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                  <span>🚨</span>
                  <span>CRITICAL RULE: GK IS THE LAGNA LORD</span>
                </div>
                <p className="text-xs text-red-950 mt-1.5 leading-relaxed">
                  {gk.gkLagnaLordDiagnosis}
                </p>
              </section>
            )}

            {/* House Impact & Diseases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] bg-[#FFFFFF] p-5">
                <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B] mb-2">
                  House {gk.gkHouseFromLagna} Karmic Testing Area
                </p>
                <p className="text-base font-bold text-[#1A1A1A] leading-snug">
                  {gk.houseProblem}
                </p>
                <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                  Whenever GK&apos;s sign or signs aspecting it run in Chara Dasha, this specific life department
                  demands extra patience, ethical integrity, and protection.
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] bg-[#FFFFFF] p-5">
                <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B] mb-2">
                  GK Health & Disease Vulnerability Map
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {gk.diseases.map((d, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-800 border border-red-200"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#6B635B] leading-relaxed">
                  These physical and psychosomatic tendencies are tied to {gk.gkPlanet}&apos;s elemental attributes.
                </p>
              </div>
            </div>

            {/* RULE B & I: GK Aspect Impact on Planets & Adjacent Sign Rule */}
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5">
              <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B] mb-1">
                GK Drishti Impact on Planets & Adjacent Sign Protection
              </p>
              <p className="text-xs text-[#6B635B] mb-3">
                In Jaimini, GK casts Rashi Drishti on planets and houses. Adjacent signs are strictly protected:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {gk.afflictedPlanets.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border text-xs"
                    style={{
                      background: p.isAdjacentProtected ? "#F0FDF4" : "#FEF2F2",
                      borderColor: p.isAdjacentProtected ? "#BBF7D0" : "#FECACA",
                    }}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span style={{ color: p.isAdjacentProtected ? "#166534" : "#991B1B" }}>
                        {p.planet} in {p.sign} (H{p.houseFromLagna})
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{
                          background: p.isAdjacentProtected ? "#DCFCE7" : "#FEE2E2",
                          color: p.isAdjacentProtected ? "#15803D" : "#B91C1C",
                        }}
                      >
                        {p.isAdjacentProtected ? "🛡️ ADJACENT PROTECTED" : "⚡ GK ASPECTED"}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1" style={{ color: p.isAdjacentProtected ? "#166534" : "#7F1D1D" }}>
                      {p.effect}
                    </p>
                  </div>
                ))}
              </div>

              {gk.afflictedHouses.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[rgba(184,134,11,0.15)]">
                  <p className="text-xs font-bold text-[#1A1A1A] mb-2">Houses Aspected by GK:</p>
                  <div className="flex flex-wrap gap-2">
                    {gk.afflictedHouses.map((h, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-red-50 text-red-900 border border-red-200">
                        House {h.house} ({h.sign}): {h.effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Prescribed Remedies from Transcript */}
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FAF7F2] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌿</span>
                <h4 className="text-base font-bold text-[#1A1A1A]">
                  Prescribed Jaimini Upay (Remedies) for GK {gk.gkPlanet}
                </h4>
              </div>
              <div className="flex flex-col gap-2.5">
                {gk.remedies.map((rem, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#FFFFFF] p-3 rounded-xl border border-[rgba(184,134,11,0.18)]">
                    <span className="font-bold text-[#B8860B] text-sm shrink-0">✦ Step {i + 1}:</span>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">{rem}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 3: DK Marriage & Spouse ──────────────────────────────────── */}
        {activeTab === "dk_marriage" && (
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl border border-pink-200 bg-pink-50/40 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-pink-100 text-pink-800">
                  💍 Darakaraka (DK) — Life Partner & Marriage Timing
                </span>
                <span className="text-2xl">💍</span>
              </div>
              <h3 className="text-xl font-bold text-pink-950 mt-1">
                DK Planet: {dk.dkPlanet} in {dk.dkSign} ({dk.degreeInSign.toFixed(2)}°)
              </h3>
              <p className="text-sm text-pink-900 mt-1 leading-relaxed">
                The lowest degree planet is the Darakaraka (DK). It represents the soul archetype of your spouse,
                their core traits, and the exact Chara Dasha windows when marriage manifests.
              </p>
            </section>

            {/* RULE K: DK Obstacle Caution */}
            {dk.hasDkObstacle && (
              <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <span>⚠️</span>
                  <span>DK Placement Caution</span>
                </div>
                <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                  {dk.dkObstacleWarning}
                </p>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] bg-[#FFFFFF] p-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B] mb-2">
                    Spouse Archetype ({dk.dkPlanet})
                  </p>
                  <p className="text-base font-bold text-[#1A1A1A] leading-snug">
                    {dk.spousePersona}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {dk.spouseTraits.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-pink-50 text-pink-900 border border-pink-200"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#6B635B] mt-4 pt-3 border-t border-[rgba(184,134,11,0.15)]">
                  7th house from Karakamsha: {kk.houses[6].sign} with {kk.houses[6].planets.length ? kk.houses[6].planets.join(", ") : "no malefic aspects"}.
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] bg-[#FFFFFF] p-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B] mb-2">
                    Marriage Timing Windows (Chara Dasha)
                  </p>
                  <p className="text-sm text-[#1A1A1A] leading-relaxed mb-3">
                    {dk.marriageTimingNote}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dk.marriageTimingSigns.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30"
                      >
                        {s} Dasha
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] text-xs text-[#4A4238]">
                  <strong>Focus on Antardasha:</strong> Mahadasha opens the window; the specific Antardasha of DK&apos;s sign or 7th lord pinpoints the exact wedding timing.
                </div>
              </div>
            </div>

            {/* RULE D: AK + AmK Pinnacle Rajayoga Card */}
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                  👑 Atmakaraka & 💼 Amatyakaraka Rajayoga Analysis
                </p>
                {akAmk.isRajayoga && (
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                    style={{
                      background: akAmk.rajayogaTier === "Pinnacle Unblemished" ? "#DCFCE7" : "#FEF3C7",
                      color: akAmk.rajayogaTier === "Pinnacle Unblemished" ? "#166534" : "#92400E",
                    }}
                  >
                    {akAmk.rajayogaTier} Rajayoga
                  </span>
                )}
              </div>

              <p className="text-sm text-[#1A1A1A] leading-relaxed">
                {akAmk.rajayogaDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)]">
                  <p className="text-xs font-bold text-[#1A1A1A]">
                    AK: {akAmk.akPlanet} in House {akAmk.akHouseFromLagna} ({akAmk.akSign})
                  </p>
                  <p className="text-xs text-[#6B635B] mt-0.5">Status: <strong className="text-[#B8860B]">{akAmk.akStatus}</strong></p>
                  <p className="text-xs text-[#4A4238] mt-1">Name & Fame peak in: {akAmk.akFameTimingSigns.join(", ")} Chara Dashas.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)]">
                  <p className="text-xs font-bold text-[#1A1A1A]">
                    AmK: {akAmk.amkPlanet} in House {akAmk.amkHouseFromLagna} ({akAmk.amkSign})
                  </p>
                  <p className="text-xs text-[#6B635B] mt-0.5">Status: <strong className="text-[#B8860B]">{akAmk.amkStatus}</strong></p>
                  <p className="text-xs text-[#4A4238] mt-1">Career Field: {akAmk.amkCareerField}</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 4: Chara Dasha (Exact Duration) ──────────────────────────── */}
        {activeTab === "dasha" && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8C827A] font-semibold">
                  12-Sign Lifetime Chara Dasha (Exact Count - 1 Rule)
                </p>
                <p className="text-xs text-[#B8860B] mt-0.5 font-medium">
                  {jaimini.directionReason}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#B8860B]/15 text-[#B8860B] border border-[#B8860B]/30">
                {jaimini.direction} Sequence ({jaimini.direction === "Savya" ? "Clockwise" : "Anti-clockwise"})
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {jaimini.charaDasha.map((d, i) => (
                <CharaRow
                  key={i}
                  period={d}
                  selected={selectedDashaIndex === i}
                  onClick={() => setSelectedDashaIndex(selectedDashaIndex === i ? null : i)}
                  adList={selectedDashaIndex === i ? (selectedDashaAds ?? undefined) : undefined}
                />
              ))}
            </div>

            <div className="mt-2 rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF5EB] p-4 text-xs text-[#4A4238] leading-relaxed">
              <strong>Transcript Duration Rule:</strong> Rashi se uske lord ki position tak count karein aur 1 minus karein (Max: 12 saal, Min: 1 saal; own sign lord = 12 years). Tap any dasha to reveal all 12 Antardashas for precise event timing.
            </div>
          </section>
        )}

        {/* ── TAB 5: Retrograde Planet Activation ──────────────────────────── */}
        {activeTab === "retro" && (
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl border border-amber-300 bg-amber-50/50 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  🔥 Retrograde Planet Activation — Hanuman-ji Principle
                </span>
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold text-amber-950 mt-1">
                Latent High-Level Powers in Your Chart
              </h3>
              <p className="text-sm text-amber-900 mt-1 leading-relaxed">
                As taught in the transcript: Retrograde planets possess immense hidden power, but like Hanuman-ji before his memory was awakened, their potential lies dormant until consciously activated through targeted actions.
              </p>
            </section>

            {retro.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {retro.map((r, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[rgba(184,134,11,0.25)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-[#1A1A1A]">
                          {r.planet} (House {r.houseFromLagna} · {r.sign})
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                          RETROGRADE
                        </span>
                      </div>
                      <p className="text-sm text-[#4A4238] leading-relaxed mt-2">
                        {r.guidance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF7F2] p-6 text-center text-sm text-[#6B635B]">
                All seven classical planets are in direct motion in this chart. Planetary energies flow naturally without needing dormant reactivation.
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: Rashi Drishti (Aspects) ────────────────────────────────── */}
        {activeTab === "aspects" && (
          <section className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-[#8C827A] font-semibold">
              Jaimini Rashi Drishti — Sign-Based Aspects (Adjacent Signs Excluded)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(ASPECT_MAP).map(([from, toArr]) => {
                const fromNum = Number(from);
                const color = SIGN_COLOR[fromNum] ?? "#B8860B";
                return (
                  <div
                    key={from}
                    className="rounded-xl px-3.5 py-2.5 flex items-center gap-3"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(184, 134, 11, 0.18)" }}
                  >
                    <span className="text-xl w-7 text-center shrink-0">{RASHI_ICONS[fromNum]}</span>
                    <span className="text-sm font-semibold text-[#1A1A1A] w-24 shrink-0" style={{ color }}>
                      {RASHIS[fromNum]}
                    </span>
                    <span className="text-[#8C827A] text-xs shrink-0">aspects →</span>
                    <div className="flex gap-2">
                      {toArr.map((t) => (
                        <span key={t} className="text-base" title={RASHIS[t]}>
                          {RASHI_ICONS[t]} {RASHIS[t]}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF5EB] p-4 text-xs text-[#4A4238] leading-relaxed">
              <strong>Classical Sign Aspect Rules:</strong> Movable signs (Aries, Cancer, Libra, Capricorn) aspect Fixed signs
              except the adjacent one. Fixed signs aspect Movable signs except the adjacent one. Dual signs (Gemini, Virgo,
              Sagittarius, Pisces) aspect all other Dual signs.
            </div>
          </section>
        )}

        {/* ── TAB 7: Arudha Padas ───────────────────────────────────────────── */}
        {activeTab === "arudhas" && (
          <section className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-[#8C827A] font-semibold">
              12 Arudha Padas — Manifest Worldly Reflections
            </p>
            <div className="flex flex-col gap-2">
              {jaimini.arudhas.map((a) => (
                <ArudhaRow key={a.house} a={a} />
              ))}
            </div>

            <div className="mt-2 rounded-2xl border border-[rgba(184,134,11,0.18)] bg-[#FAF5EB] p-4 text-xs text-[#4A4238] leading-relaxed">
              <strong>Arudha Lagna (AL):</strong> Represents your public reputation and societal stature.
              <strong> Upapada Lagna (UL):</strong> Reveals the true quality, durability, and spiritual merit of marriage.
              <strong> Rajya Pada (A10):</strong> Shows perceived career power and administrative influence.
            </div>
          </section>
        )}

        {/* Special Findings Card */}
        {jaimini.specialFindings.length > 0 && (
          <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FAF5EB] p-4.5">
            <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-3">
              ✦ Special Jaimini Sutra Findings
            </p>
            <div className="flex flex-col gap-2">
              {jaimini.specialFindings.map((f, i) => (
                <div key={i} className="flex gap-2.5 text-sm text-[#1A1A1A] leading-relaxed">
                  <span className="text-[#B8860B] mt-0.5 shrink-0">✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
