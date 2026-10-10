"use client";

import { useMemo, useState } from "react";
import { useUserChart } from "@/lib/user-chart";
import {
  buildJaiminiChart,
  calculateCharaDashaAD,
  calculateDashaLagna,
  RASHI_ICONS,
  RASHIS,
  SIGN_COLOR,
  KARAKA_ICONS,
  formatCharaDate,
  formatCharaDaysRemaining,
  GEMSTONE_WARNING_FOR_GK,
  FLOWING_WATER_REMEDY_FOR_MOON,
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
  type DashaLagnaAnalysis,
  type BkSubconsciousAnalysis,
  type MkEducationAnalysis,
  type PkPurvaPunyaAnalysis,
  type LoveMarriageAnalysis,
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

const TABS = [
  { key: "karakas",     label: "👑 Karakas & Karakamsha" },
  { key: "dasha_lagna", label: "🎯 Dasha Lagna (5th Pillar)" },
  { key: "rajayoga",    label: "👑 AK-AmK & Life Focus" },
  { key: "gk_radar",    label: "⚡ GK Problem Radar" },
  { key: "dk_marriage", label: "💍 DK Marriage & Spouse" },
  { key: "bk_mk_pk",    label: "🧠 BK/MK/PK Life Pillars" },
  { key: "dasha",       label: "⏳ Chara Dasha (Exact)" },
  { key: "retro",       label: "🔥 Retrograde Activation" },
  { key: "aspects",     label: "👁️ Rashi Drishti" },
  { key: "arudhas",     label: "🏛️ Arudha Padas" },
] as const;

type JaiminiTabKey = (typeof TABS)[number]["key"];

// ── Main Page Component ───────────────────────────────────────────────────────

export default function JaiminiPage() {
  const { birth, chart, loading, hasUserChart } = useUserChart();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<JaiminiTabKey>("karakas");
  const [selectedDashaIndex, setSelectedDashaIndex] = useState<number | null>(null);
  const [selectedDashaLagnaSign, setSelectedDashaLagnaSign] = useState<number | null>(null);

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

  const ak = jaimini ? jaimini.karakas.find((k) => k.role === "AK") : undefined;
  const amk = jaimini ? jaimini.karakas.find((k) => k.role === "AmK") : undefined;
  const gk = jaimini?.gkAnalysis;
  const bk = jaimini?.bkAnalysis;
  const bkSub = jaimini?.bkSubconscious;
  const mk = jaimini?.mkEducation;
  const pk = jaimini?.pkPurvaPunya;
  const lm = jaimini?.loveMarriageAnalysis;
  const dk = jaimini?.dkAnalysis;
  const akAmk = jaimini?.akAmkAnalysis;
  const kk = jaimini?.karakamsha;
  const retro = jaimini?.retrogradeActivation ?? [];

  const currentDashaSignNum = jaimini?.currentDasha?.signNum ?? 0;
  const activeDashaLagnaSign = selectedDashaLagnaSign !== null ? selectedDashaLagnaSign : currentDashaSignNum;
  const activeDashaLagna = useMemo(() => {
    if (!jaimini || !chart) return null;
    return (
      jaimini.allDashaLagnas.find((dl) => dl.dashaSignNum === activeDashaLagnaSign) ??
      calculateDashaLagna(activeDashaLagnaSign, chart, jaimini.karakas)
    );
  }, [jaimini, chart, activeDashaLagnaSign]);

  if (loading) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <p className="text-[#6B635B]">Loading Jaimini Engine...</p>
      </div>
    );
  }

  if (!chart || !jaimini || !gk || !bk || !bkSub || !mk || !pk || !lm || !dk || !akAmk || !kk) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <p className="text-[#6B635B]">Birth chart required for Jaimini analysis.</p>
      </div>
    );
  }

  const tabs = TABS;

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

        {/* ── TAB: Dasha Lagna Explorer (5th Pillar) ───────────────────────── */}
        {activeTab === "dasha_lagna" && activeDashaLagna && (
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FAF7F2] p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  🎯 दशा लग्न तकनीक · Jaimini 5th Pillar
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                  Active Dasha Sign as Lagna
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mt-1">
                Dynamic Dasha Lagna Explorer: {activeDashaLagna.dashaSign} Lagna
              </h3>
              <p className="text-sm text-[#6B635B] mt-1 leading-relaxed">
                Transcript Secret: In Jaimini, whenever a sign runs in Chara Dasha, rotate that sign to House 1 (Lagna).
                Where your AK, AmK, GK, and DK fall from this temporary throne tells the absolute truth of that chapter:
                peak status vs fall, wealth surge vs career agony, and exact testing grounds.
              </p>

              {/* Sign Selector Bar */}
              <div className="mt-4 pt-3 border-t border-[rgba(184,134,11,0.18)]">
                <p className="text-xs uppercase tracking-wider font-bold text-[#8C827A] mb-2.5">
                  Select Any Dasha Sign to Rotate Lagna:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {RASHIS.map((rName, rIdx) => {
                    const isSelected = activeDashaLagnaSign === rIdx;
                    const isCurrentDasha = jaimini.currentDasha?.signNum === rIdx;
                    return (
                      <button
                        key={rIdx}
                        onClick={() => setSelectedDashaLagnaSign(rIdx)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#B8860B] to-[#996515] text-white border-[#B8860B] shadow-sm"
                            : "bg-white text-[#4A4238] border-[rgba(184,134,11,0.2)] hover:border-[#B8860B]"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{RASHI_ICONS[rIdx]}</span>
                          <span className="truncate">{rName}</span>
                        </span>
                        {isCurrentDasha && (
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-extrabold ${
                              isSelected ? "bg-white/30 text-white" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            NOW
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4 Primary Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pillar 1: AK Status */}
              <div
                className="rounded-2xl p-5 border flex flex-col justify-between"
                style={{
                  background:
                    activeDashaLagna.akAnalysis.status.includes("Peak")
                      ? "#F0FDF4"
                      : activeDashaLagna.akAnalysis.status.includes("Downfall")
                      ? "#FEF2F2"
                      : "#FFFFFF",
                  borderColor:
                    activeDashaLagna.akAnalysis.status.includes("Peak")
                      ? "#BBF7D0"
                      : activeDashaLagna.akAnalysis.status.includes("Downfall")
                      ? "#FECACA"
                      : "rgba(184, 134, 11, 0.25)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                      👑 Atmakaraka ({ak?.planet}) from Dasha Lagna
                    </span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                      style={{
                        background: activeDashaLagna.akAnalysis.status.includes("Peak")
                          ? "#DCFCE7"
                          : activeDashaLagna.akAnalysis.status.includes("Downfall")
                          ? "#FEE2E2"
                          : "#FAF5EB",
                        color: activeDashaLagna.akAnalysis.status.includes("Peak")
                          ? "#166534"
                          : activeDashaLagna.akAnalysis.status.includes("Downfall")
                          ? "#991B1B"
                          : "#B8860B",
                      }}
                    >
                      House {activeDashaLagna.akAnalysis.house} · {activeDashaLagna.akAnalysis.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1A1A1A] mt-1">
                    {activeDashaLagna.akAnalysis.status.includes("Peak")
                      ? "Supreme Elevation & Royal Status Chapter"
                      : activeDashaLagna.akAnalysis.status.includes("Downfall")
                      ? "Karmic Vulnerability & Caution Chapter"
                      : "Steady Character Foundation Chapter"}
                  </h4>
                  <p className="text-xs text-[#4A4238] mt-2 leading-relaxed">
                    {activeDashaLagna.akAnalysis.verdict}
                  </p>
                </div>
              </div>

              {/* Pillar 2: AmK Wealth Surge */}
              <div
                className="rounded-2xl p-5 border flex flex-col justify-between"
                style={{
                  background:
                    activeDashaLagna.amkAnalysis.status.includes("Surge")
                      ? "#F0FDF4"
                      : activeDashaLagna.amkAnalysis.status.includes("Agony")
                      ? "#FFFBEB"
                      : "#FFFFFF",
                  borderColor:
                    activeDashaLagna.amkAnalysis.status.includes("Surge")
                      ? "#BBF7D0"
                      : activeDashaLagna.amkAnalysis.status.includes("Agony")
                      ? "#FDE68A"
                      : "rgba(184, 134, 11, 0.25)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                      💼 Amatyakaraka ({amk?.planet}) from Dasha Lagna
                    </span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                      style={{
                        background: activeDashaLagna.amkAnalysis.status.includes("Surge")
                          ? "#DCFCE7"
                          : activeDashaLagna.amkAnalysis.status.includes("Agony")
                          ? "#FEF3C7"
                          : "#FAF5EB",
                        color: activeDashaLagna.amkAnalysis.status.includes("Surge")
                          ? "#166534"
                          : activeDashaLagna.amkAnalysis.status.includes("Agony")
                          ? "#92400E"
                          : "#B8860B",
                      }}
                    >
                      House {activeDashaLagna.amkAnalysis.house} · {activeDashaLagna.amkAnalysis.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1A1A1A] mt-1">
                    {activeDashaLagna.amkAnalysis.status.includes("Surge")
                      ? "Golden Wealth Vortex & Lucrative Expansion"
                      : activeDashaLagna.amkAnalysis.status.includes("Agony")
                      ? "Vocational Stagnation & Hard Toil"
                      : "Systematic Career Progression"}
                  </h4>
                  <p className="text-xs text-[#4A4238] mt-2 leading-relaxed">
                    {activeDashaLagna.amkAnalysis.verdict}
                  </p>
                </div>
              </div>

              {/* Pillar 3: GK Trouble Battlefield */}
              <div className="rounded-2xl p-5 border border-red-200 bg-red-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-red-800">
                      ⚡ Gnatikaraka ({gk.gkPlanet}) Trouble Zone
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-100 text-red-800">
                      House {activeDashaLagna.gkAnalysis.house} from Dasha Lagna
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-red-950 mt-1">
                    Friction Target: {activeDashaLagna.gkAnalysis.targetArea}
                  </h4>
                  <p className="text-xs text-red-900 mt-2 leading-relaxed">
                    {activeDashaLagna.gkAnalysis.warning}
                  </p>
                </div>
              </div>

              {/* Pillar 4: DK Marriage Window */}
              <div className="rounded-2xl p-5 border border-pink-200 bg-pink-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-pink-800">
                      💍 Darakaraka ({dk.dkPlanet}) Marriage Axis
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-100 text-pink-800">
                      House {activeDashaLagna.dkAnalysis.house} from Dasha Lagna
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-pink-950 mt-1">
                    {activeDashaLagna.dkAnalysis.isMarriageWindow
                      ? "✓ High-Probability Marriage Window Active"
                      : "Relationship Status Quo"}
                  </h4>
                  <p className="text-xs text-pink-900 mt-2 leading-relaxed">
                    {activeDashaLagna.dkAnalysis.verdict}
                  </p>
                </div>
              </div>
            </div>

            {/* 12 House Grid from Selected Dasha Lagna */}
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest font-semibold text-[#8C827A]">
                  12 Houses from Dasha Lagna ({activeDashaLagna.dashaSign})
                </p>
                <span className="text-xs text-[#6B635B]">
                  Natal planets mapped onto rotated Dasha coordinates
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {activeDashaLagna.houses.map((h) => {
                  const hasPlanets = h.planets.length > 0;
                  const hasKarakas = h.karakas.length > 0;
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
                      <div className="mt-2 pt-1 border-t border-[rgba(184,134,11,0.12)]">
                        {hasPlanets ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[#1A1A1A]">{h.planets.join(", ")}</span>
                            {hasKarakas && (
                              <span className="text-[10px] text-[#B8860B] font-semibold">
                                {h.karakas.join(", ")}
                              </span>
                            )}
                          </div>
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

            {/* Absolute Gemstone Prohibition Alert */}
            <section className="rounded-2xl border-2 border-red-500 bg-red-100/90 p-4.5 shadow-sm">
              <div className="flex items-center gap-2.5 text-red-900 font-extrabold text-sm uppercase tracking-wide">
                <span className="text-xl">⛔</span>
                <span>ABSOLUTE PROHIBITION: NEVER WEAR GK GEMSTONE!</span>
              </div>
              <p className="text-xs text-red-950 mt-1.5 leading-relaxed font-medium">
                {GEMSTONE_WARNING_FOR_GK}
              </p>
              <div className="mt-2.5 p-2.5 rounded-xl bg-red-200/60 text-xs text-red-900">
                <strong>Transcript Mandate:</strong> Wearing the stone of {gk.gkPlanet} directly empowers disease, litigation, debts, and enemies. For {gk.gkPlanet}, strictly perform charity, selfless service, and physical canalization — NEVER wear its stone.
              </div>
            </section>

            {/* Moon Natural Flowing Water Remedy if Moon is AK or AmK */}
            {(ak?.planet === "Moon" || amk?.planet === "Moon") && (
              <section className="rounded-2xl border-2 border-cyan-400 bg-cyan-50/80 p-4.5 shadow-sm">
                <div className="flex items-center gap-2.5 text-cyan-950 font-bold text-sm">
                  <span className="text-xl">🌊</span>
                  <span>NATURAL FLOWING WATER VORTEX (TRANSCRIPT SECRET)</span>
                </div>
                <p className="text-xs text-cyan-900 mt-1.5 leading-relaxed">
                  {FLOWING_WATER_REMEDY_FOR_MOON}
                </p>
                <div className="mt-2 p-2 rounded-lg bg-cyan-100/80 text-[11px] text-cyan-950 font-medium">
                  Sit quietly for 2-3 hours near running natural river water, waterfalls, or springs. It recharges Chandra&apos;s wealth frequency and opens financial floodgates for the next 6 months!
                </div>
              </section>
            )}

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

            {/* Love Marriage Indicator (Bhavat Bhavam: 5th from 7th = 11th) */}
            <section className="rounded-2xl border border-pink-300 bg-gradient-to-r from-pink-50/70 via-rose-50/50 to-pink-50/70 p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-pink-100 text-pink-900 border border-pink-300">
                  ❤️ Love Marriage Indicator · Bhavat Bhavam (5th from 7th = 11th)
                </span>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: lm.isLoveMarriageIndicated ? "#DCFCE7" : "#FAF5EB",
                    color: lm.isLoveMarriageIndicated ? "#166534" : "#6B635B",
                  }}
                >
                  {lm.isLoveMarriageIndicated ? "✓ Love / Chosen Marriage Indicated" : "Traditional Family Alignment"}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#1A1A1A] mt-1">
                {lm.verdict}
              </h4>
              <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                {lm.bhavatBhavamRule}
              </p>
              {lm.evidence.length > 0 && (
                <div className="mt-3 pt-3 border-t border-pink-200/80 flex flex-col gap-1.5">
                  <p className="text-xs font-bold text-pink-950">Active Astrological Evidence:</p>
                  {lm.evidence.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-pink-900">
                      <span className="text-pink-600 font-bold shrink-0">✦</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── TAB: BK / MK / PK Life Pillars ──────────────────────────────── */}
        {activeTab === "bk_mk_pk" && (
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FAF7F2] p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  🧠 BK, MK &amp; PK Life Pillars · Transcript Teachings
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                  Subconscious Mind · Education · Purva Punya
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mt-1">
                Subconscious Skill Mastery, Academic Streams &amp; Past Karma Blessings
              </h3>
              <p className="text-sm text-[#6B635B] mt-1 leading-relaxed">
                As detailed in the 2-day workshop: BK unlocks the subconscious mind and the area where repeated trials forge supreme worldly mastery; MK reveals your natural academic stream and parental sanctuary; PK radiates your past-life good karma (purva punya), intellectual style, and progeny blessings.
              </p>
            </section>

            {/* 3 Main Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: BK Subconscious Mind */}
              <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                      🛡️ Bhratrikaraka ({bkSub.bkPlanet})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                      House {bkSub.bkHouseFromLagna} · {bkSub.bkSign}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1A1A1A]">
                    Subconscious Drive &amp; Repeated Failure to Mastery
                  </h4>
                  <div className="my-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                    <strong>Transcript Law:</strong> &ldquo;{bkSub.transcriptRule}&rdquo;
                  </div>
                  <div className="flex flex-col gap-2 mt-3 text-xs">
                    <div>
                      <strong className="text-[#8C827A] uppercase text-[10px] tracking-wider block">Internal Fixation / Drive:</strong>
                      <p className="text-[#1A1A1A] mt-0.5">{bkSub.subconsciousDrive}</p>
                    </div>
                    <div>
                      <strong className="text-red-700 uppercase text-[10px] tracking-wider block">Initial Failure Testing Zone:</strong>
                      <p className="text-[#4A4238] mt-0.5">{bkSub.failureTestZone}</p>
                    </div>
                    <div>
                      <strong className="text-emerald-700 uppercase text-[10px] tracking-wider block">Forged Superpower / Mastery Skill:</strong>
                      <p className="text-[#1A1A1A] font-semibold mt-0.5">{bkSub.masterySkill}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: MK Education Stream & Parental Heritage */}
              <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                      🏡 Matrikaraka ({mk.mkPlanet})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                      House {mk.mkHouseFromLagna} · {mk.mkSign}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1A1A1A]">
                    Education Stream &amp; Domestic Roots
                  </h4>
                  <div className="my-2.5 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 leading-relaxed">
                    <strong>Transcript Law:</strong> &ldquo;{mk.transcriptRule}&rdquo;
                  </div>
                  <div className="flex flex-col gap-2 mt-3 text-xs">
                    <div>
                      <strong className="text-[#8C827A] uppercase text-[10px] tracking-wider block">Natural Academic Stream:</strong>
                      <p className="text-[#1A1A1A] font-semibold mt-0.5">{mk.educationStream}</p>
                    </div>
                    <div>
                      <strong className="text-[#8C827A] uppercase text-[10px] tracking-wider block">Parents&apos; Demeanor &amp; Heritage:</strong>
                      <p className="text-[#4A4238] mt-0.5">{mk.parentalNature}</p>
                    </div>
                    <div>
                      <strong className="text-emerald-700 uppercase text-[10px] tracking-wider block">Source of Deep Mental Peace:</strong>
                      <p className="text-[#1A1A1A] mt-0.5">{mk.mentalPeaceSource}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: PK Purva Punya & Progeny Blessing */}
              <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                      💡 Putrakaraka ({pk.pkPlanet})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                      House {pk.pkHouseFromLagna} · {pk.pkSign}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1A1A1A]">
                    Purva Punya, Intellect &amp; Progeny
                  </h4>
                  <div className="my-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                    <strong>Transcript Law:</strong> &ldquo;{pk.transcriptRule}&rdquo;
                  </div>
                  <div className="flex flex-col gap-2 mt-3 text-xs">
                    <div>
                      <strong className="text-emerald-700 uppercase text-[10px] tracking-wider block">Past Life Good Karma (Purva Punya):</strong>
                      <p className="text-[#1A1A1A] font-semibold mt-0.5">{pk.purvaPunyaStatus}</p>
                    </div>
                    <div>
                      <strong className="text-[#8C827A] uppercase text-[10px] tracking-wider block">Intellectual Style &amp; Cognition:</strong>
                      <p className="text-[#4A4238] mt-0.5">{pk.intellectQuality}</p>
                    </div>
                    <div>
                      <strong className="text-[#8C827A] uppercase text-[10px] tracking-wider block">Progeny Nature &amp; Blessing:</strong>
                      <p className="text-[#1A1A1A] mt-0.5">{pk.progenyBlessing}</p>
                      <p className="text-[11px] text-[#B8860B] font-medium mt-1">
                        Timing Signs: {pk.progenyTimingSigns.join(", ")} Chara Dashas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: AK-AmK & Life Focus (Transcript Core Rules) ─────────────── */}
        {activeTab === "rajayoga" && (
          <div className="flex flex-col gap-6">
            {/* Header / Intro */}
            <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FAF7F2] p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  👑 Atmakaraka & 💼 Amatyakaraka Architecture
                </span>
                {akAmk.isSupremeTeacherYoga ? (
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-sm">
                    🏆 Supreme Guru / Saraswati Yoga
                  </span>
                ) : akAmk.isRajayoga ? (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{
                      background: akAmk.rajayogaTier === "Pinnacle Unblemished" ? "#DCFCE7" : "#FEF3C7",
                      color: akAmk.rajayogaTier === "Pinnacle Unblemished" ? "#166534" : "#92400E",
                    }}
                  >
                    {akAmk.rajayogaTier} Rajayoga
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[#E8E2D8] text-[#4A4238]">
                    Independent Karaka Influences
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mt-1">
                Life Horizon, Wealth Channels & Pinnacle Rajayogas
              </h3>
              <p className="text-sm text-[#6B635B] mt-1 leading-relaxed">
                As revealed in classical Jaimini transcripts: AK sets the non-negotiable boundaries of where your soul must evolve (&quot;us house ke bahar life nahi ja sakti&quot;), while AmK governs the exact house gateway through which wealth, assets, and authority materialize.
              </p>
            </section>

            {/* Supreme Teacher Yoga Banner if active */}
            {akAmk.isSupremeTeacherYoga && (
              <section className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 p-5 shadow-md">
                <div className="flex items-center gap-2.5 text-amber-950 font-bold text-base">
                  <span className="text-2xl">🎓</span>
                  <span>SUPREME TEACHER / SARASWATI RAJAYOGA DETECTED</span>
                </div>
                <p className="text-xs text-amber-900 mt-2 font-medium leading-relaxed">
                  {akAmk.rajayogaDescription}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-200/70 text-amber-950 font-semibold">
                    AK in Dual Sign ({akAmk.akSign}) &amp; Retrograde
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-200/70 text-amber-950 font-semibold">
                    AmK in Dual Sign ({akAmk.amkSign}) &amp; Retrograde
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                    Shielded from GK Aspect
                  </span>
                </div>
              </section>
            )}

            {/* Normal Rajayoga Description if active and not Supreme */}
            {akAmk.isRajayoga && !akAmk.isSupremeTeacherYoga && (
              <section className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                    👑 Jaimini Raja Yoga Manifestation
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                    {akAmk.rajayogaTier}
                  </span>
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed">
                  {akAmk.rajayogaDescription}
                </p>
              </section>
            )}

            {/* Two Main Cards: AK Life Sphere & AmK Wealth Channel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: AK Life Sphere */}
              <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                      👑 Atmakaraka ({akAmk.akPlanet}) · House {akAmk.akHouseFromLagna}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                      {akAmk.akStatus}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1A1A1A]">
                    {akAmk.akLifeSphere.title}
                  </h4>

                  {/* Transcript quote highlight */}
                  <div className="my-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                    <strong>Transcript Law:</strong> &ldquo;{akAmk.akLifeSphere.transcriptRule}&rdquo;
                  </div>

                  <p className="text-sm text-[#4A4238] leading-relaxed mb-3">
                    {akAmk.akLifeSphere.focus}
                  </p>

                  <div className="text-xs text-[#6B635B] pt-2 border-t border-[rgba(184,134,11,0.15)]">
                    <strong>Soul Evolution Area:</strong> {akAmk.akLifeSphere.evolutionArea}
                  </div>
                </div>

                {/* AK Physical & Mental Personality Clues */}
                {akAmk.akPhysicalMentalTraits.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[rgba(184,134,11,0.15)]">
                    <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B] mb-2">
                      Practical Traits &amp; Personality Clues ({akAmk.akPlanet}):
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {akAmk.akPhysicalMentalTraits.map((trait, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                          <span className="text-[#B8860B] font-bold">✦</span>
                          <span>{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: AmK Wealth Channel */}
              <div className="rounded-2xl border border-[rgba(184,134,11,0.25)] bg-[#FFFFFF] p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B]">
                      💼 Amatyakaraka ({akAmk.amkPlanet}) · House {akAmk.amkHouseFromLagna}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30">
                      {akAmk.amkStatus}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1A1A1A]">
                    Wealth Gateway: {akAmk.amkWealthChannel.source}
                  </h4>

                  {/* Transcript quote highlight */}
                  <div className="my-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                    <strong>Transcript Law:</strong> &ldquo;AmK jis house me baitha hai, bhagwan ne aapki ajeevika aur wealth generation ka switch wahan jod diya hai.&rdquo;
                  </div>

                  <p className="text-sm text-[#4A4238] leading-relaxed mb-3">
                    {akAmk.amkWealthChannel.channel}
                  </p>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.15)] text-xs text-[#1A1A1A]">
                    <strong className="text-[#B8860B]">High-Yield Professional Fields:</strong>
                    <p className="mt-1">{akAmk.amkWealthChannel.practicalField}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(184,134,11,0.15)]">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#B8860B] mb-2">
                    Wealth Surge Timing Windows (Chara Dasha):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {akAmk.amkGrowthTimingSigns.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF5EB] text-[#B8860B] border border-[#B8860B]/30"
                      >
                        {s} Dasha
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
