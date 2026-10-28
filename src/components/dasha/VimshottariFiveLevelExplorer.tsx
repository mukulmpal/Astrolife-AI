"use client";

import { useMemo, useState, useEffect } from "react";
import type { ChartData } from "@/lib/astro-engine/calculations";
import {
  getMahadashas,
  getAntardashas,
  getPratyantardashas,
  getSookshmadashas,
  getPranadashas,
  getCurrentDashaHierarchy5Levels,
  getNakshatraFromLongitude,
  LORD_COLOR,
  LORD_ICON,
  LORD_YEARS_DESC,
  formatDashaDate,
  formatDaysRemaining,
  type DashaPeriod,
  type DashaLord,
} from "@/lib/astro-engine/dasha";

const LEVEL_NAMES: Record<number, { title: string; hindi: string; desc: string }> = {
  1: {
    title: "Mahadasha (महादशा)",
    hindi: "महादशा",
    desc: "120-वर्षीय जीवन के मुख्य अध्याय · 6 से 20 वर्ष की अवधि",
  },
  2: {
    title: "Antardasha / Bhukti (अंतर्दशा)",
    hindi: "अंतर्दशा",
    desc: "महादशा का उप-काल · मुख्य घटनाओं को सक्रिय करने वाला समय",
  },
  3: {
    title: "Pratyantardasha (प्रत्यंतर्दशा)",
    hindi: "प्रत्यंतर्दशा",
    desc: "महीनों और हफ़्तों का सूक्ष्म काल · कार्य सिद्धि व तात्कालिक निर्णय",
  },
  4: {
    title: "Sookshmadasha (सूक्ष्मदशा)",
    hindi: "सूक्ष्मदशा",
    desc: "दिनों और घंटों का अति-सूक्ष्म काल · दैनिक ऊर्जा व मानसिक स्थिति",
  },
  5: {
    title: "Pranadasha (प्राणदशा)",
    hindi: "प्राणदशा",
    desc: "घंटों और मिनटों का प्राण-काल · सटीक सूक्ष्म मुहूर्त व सूक्ष्म घटना चक्र",
  },
};

const LORD_HINDI: Record<DashaLord, string> = {
  Sun: "सूर्य",
  Moon: "चंद्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
};

function formatMicroDate(date: Date, level: number): string {
  if (level <= 2) {
    return formatDashaDate(date);
  }
  if (level === 3) {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDurationText(period: DashaPeriod, level: number): string {
  const days = period.durationDays;
  if (level === 1) {
    return LORD_YEARS_DESC[period.lord];
  }
  if (level === 2) {
    if (days >= 365) {
      return `${(days / 365).toFixed(1)} वर्ष (${Math.round(days)} दिन)`;
    }
    return `${(days / 30.4).toFixed(1)} माह (${Math.round(days)} दिन)`;
  }
  if (level === 3) {
    if (days >= 30) {
      return `${(days / 30.4).toFixed(1)} माह (${Math.round(days)} दिन)`;
    }
    return `${days.toFixed(1)} दिन (${Math.round(days * 24)} घंटे)`;
  }
  if (level === 4) {
    const hours = days * 24;
    if (hours >= 24) {
      return `${(hours / 24).toFixed(1)} दिन (${Math.round(hours)} घंटे)`;
    }
    return `${hours.toFixed(1)} घंटे`;
  }
  // Level 5: Prana
  const hours = days * 24;
  const mins = hours * 60;
  if (hours >= 1) {
    return `${hours.toFixed(1)} घंटे (${Math.round(mins)} मिनट)`;
  }
  return `${Math.round(mins)} मिनट`;
}

interface VimshottariFiveLevelExplorerProps {
  chart: ChartData;
  initialPeriod?: DashaPeriod | null;
  className?: string;
}

export function VimshottariFiveLevelExplorer({
  chart,
  initialPeriod,
  className = "",
}: VimshottariFiveLevelExplorerProps) {
  const { nak, birthDate, mahadashas, active5 } = useMemo(() => {
    const moonLon =
      (chart.planets?.Moon as { lon?: number; longitude?: number })?.lon ??
      (chart.planets?.Moon as { lon?: number; longitude?: number })?.longitude ??
      0;
    const nakInfo = getNakshatraFromLongitude(moonLon);
    const bDate = new Date(`${chart.dob}T${chart.tob}`);
    const mds = getMahadashas(bDate, nakInfo);
    const act5 = getCurrentDashaHierarchy5Levels(bDate, nakInfo, new Date());
    return { nak: nakInfo, birthDate: bDate, mahadashas: mds, active5: act5 };
  }, [chart]);

  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedMD, setSelectedMD] = useState<DashaPeriod>(active5.mahadasha);
  const [selectedAD, setSelectedAD] = useState<DashaPeriod | null>(active5.antardasha);
  const [selectedPD, setSelectedPD] = useState<DashaPeriod | null>(active5.pratyantardasha);
  const [selectedSD, setSelectedSD] = useState<DashaPeriod | null>(active5.sookshma);

  // Sync if initialPeriod is passed
  useEffect(() => {
    if (initialPeriod) {
      if (initialPeriod.level === "mahadasha") {
        setSelectedMD(initialPeriod);
        setLevel(2);
      } else if (initialPeriod.level === "antardasha") {
        const parentMD = mahadashas.find((m) => m.lord === initialPeriod.parent) ?? active5.mahadasha;
        setSelectedMD(parentMD);
        setSelectedAD(initialPeriod);
        setLevel(3);
      }
    }
  }, [initialPeriod, mahadashas, active5]);

  // Compute periods for current level
  const currentPeriods = useMemo(() => {
    if (level === 1) {
      return mahadashas;
    }
    if (level === 2 && selectedMD) {
      return getAntardashas(selectedMD);
    }
    if (level === 3 && selectedAD && selectedMD) {
      return getPratyantardashas(selectedAD, selectedMD);
    }
    if (level === 4 && selectedPD && selectedAD && selectedMD) {
      return getSookshmadashas(selectedPD, selectedAD, selectedMD);
    }
    if (level === 5 && selectedSD && selectedPD && selectedAD && selectedMD) {
      return getPranadashas(selectedSD, selectedPD, selectedAD, selectedMD);
    }
    return mahadashas;
  }, [level, selectedMD, selectedAD, selectedPD, selectedSD, mahadashas]);

  // Jump to Current Active Path
  const jumpToActive = () => {
    setSelectedMD(active5.mahadasha);
    setSelectedAD(active5.antardasha);
    setSelectedPD(active5.pratyantardasha);
    setSelectedSD(active5.sookshma);
    setLevel(5);
  };

  // Drill down from row click
  const handleRowClick = (period: DashaPeriod) => {
    if (level === 1) {
      setSelectedMD(period);
      setSelectedAD(null);
      setSelectedPD(null);
      setSelectedSD(null);
      setLevel(2);
    } else if (level === 2) {
      setSelectedAD(period);
      setSelectedPD(null);
      setSelectedSD(null);
      setLevel(3);
    } else if (level === 3) {
      setSelectedPD(period);
      setSelectedSD(null);
      setLevel(4);
    } else if (level === 4) {
      setSelectedSD(period);
      setLevel(5);
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 bg-white border border-[rgba(184,134,11,0.22)] shadow-sm ${className}`}
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
      }}
    >
      {/* ── Header & Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(184,134,11,0.18)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B8860B] bg-[rgba(184,134,11,0.12)] px-2.5 py-0.5 rounded-full border border-[rgba(184,134,11,0.25)]">
              Vimshottari 5-Tier Hierarchical Explorer
            </span>
            <span className="text-xs text-[#8C827A] font-semibold hidden md:inline">
              विंशोत्तरी सूक्ष्म-काल गणना
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] mt-1">
            {LEVEL_NAMES[level].title}
          </h3>
          <p className="text-xs text-[#6B635B] mt-0.5">
            {LEVEL_NAMES[level].desc}
          </p>
        </div>

        <button
          type="button"
          onClick={jumpToActive}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          style={{
            background: "linear-gradient(135deg, #B8860B, #996515)",
            color: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.4)",
          }}
        >
          <span>⚡ वर्तमान सक्रिय 5-स्तरीय दशा</span>
          <span className="text-[10px] opacity-90">(Jump to Active)</span>
        </button>
      </div>

      {/* ── Active Dasha Hierarchy Banner ── */}
      <div className="my-4 p-3.5 rounded-xl bg-white border border-[rgba(184,134,11,0.22)] shadow-xs">
        <div className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider mb-2">
          ⚡ आज की तिथि पर सक्रिय विंशोत्तरी श्रृंखला (Active Vimshottari Vector):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          {[
            { tag: "1. महादशा", p: active5.mahadasha, lvl: 1 },
            { tag: "2. अंतर्दशा", p: active5.antardasha, lvl: 2 },
            { tag: "3. प्रत्यंतर", p: active5.pratyantardasha, lvl: 3 },
            { tag: "4. सूक्ष्म", p: active5.sookshma, lvl: 4 },
            { tag: "5. प्राण", p: active5.prana, lvl: 5 },
          ].map(({ tag, p, lvl }) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSelectedMD(active5.mahadasha);
                if (lvl >= 2) setSelectedAD(active5.antardasha);
                if (lvl >= 3) setSelectedPD(active5.pratyantardasha);
                if (lvl >= 4) setSelectedSD(active5.sookshma);
                setLevel(lvl as 1 | 2 | 3 | 4 | 5);
              }}
              className="p-2 rounded-lg border transition-all text-left group"
              style={{
                background: level === lvl ? "rgba(184,134,11,0.12)" : "#FAF8F5",
                borderColor: level === lvl ? "#B8860B" : "rgba(184,134,11,0.2)",
              }}
            >
              <div className="text-[9.5px] font-bold text-[#6B635B] uppercase">{tag}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span style={{ color: LORD_COLOR[p.lord] }}>{LORD_ICON[p.lord]}</span>
                <span className="text-xs font-extrabold text-[#1A1A1A]">
                  {LORD_HINDI[p.lord]} ({p.lord})
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Breadcrumbs Navigation Bar ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 text-xs mb-3 text-[#6B635B]">
        <button
          type="button"
          onClick={() => setLevel(1)}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1 ${
            level === 1
              ? "bg-[#B8860B] text-white shadow-xs"
              : "bg-[#FAF8F5] text-[#4A4238] border border-[rgba(184,134,11,0.2)] hover:border-[#B8860B]"
          }`}
        >
          <span>👑 1. महादशा (MD)</span>
        </button>

        {level >= 2 && selectedMD && (
          <>
            <span className="text-[#B8860B] font-bold">›</span>
            <button
              type="button"
              onClick={() => setLevel(2)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1 ${
                level === 2
                  ? "bg-[#B8860B] text-white shadow-xs"
                  : "bg-[#FAF8F5] text-[#4A4238] border border-[rgba(184,134,11,0.2)] hover:border-[#B8860B]"
              }`}
            >
              <span>{LORD_ICON[selectedMD.lord]} 2. {selectedMD.lord} AD</span>
            </button>
          </>
        )}

        {level >= 3 && selectedAD && (
          <>
            <span className="text-[#B8860B] font-bold">›</span>
            <button
              type="button"
              onClick={() => setLevel(3)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1 ${
                level === 3
                  ? "bg-[#B8860B] text-white shadow-xs"
                  : "bg-[#FAF8F5] text-[#4A4238] border border-[rgba(184,134,11,0.2)] hover:border-[#B8860B]"
              }`}
            >
              <span>{LORD_ICON[selectedAD.lord]} 3. {selectedAD.lord} PD</span>
            </button>
          </>
        )}

        {level >= 4 && selectedPD && (
          <>
            <span className="text-[#B8860B] font-bold">›</span>
            <button
              type="button"
              onClick={() => setLevel(4)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1 ${
                level === 4
                  ? "bg-[#B8860B] text-white shadow-xs"
                  : "bg-[#FAF8F5] text-[#4A4238] border border-[rgba(184,134,11,0.2)] hover:border-[#B8860B]"
              }`}
            >
              <span>{LORD_ICON[selectedPD.lord]} 4. {selectedPD.lord} SD</span>
            </button>
          </>
        )}

        {level === 5 && selectedSD && (
          <>
            <span className="text-[#B8860B] font-bold">›</span>
            <span className="px-2.5 py-1 rounded-lg font-bold bg-[#B8860B] text-white shadow-xs shrink-0 flex items-center gap-1">
              <span>{LORD_ICON[selectedSD.lord]} 5. प्राणदशा (Prana)</span>
            </span>
          </>
        )}
      </div>

      {/* ── Periods List ── */}
      <div className="space-y-2.5 mt-2">
        {currentPeriods.map((period, index) => {
          const color = LORD_COLOR[period.lord];
          const isCurrentActive = period.isActive;
          const isPassed = period.endDate.getTime() < Date.now();

          return (
            <div
              key={`${period.lord}-${period.startDate.getTime()}-${index}`}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCurrentActive
                  ? "bg-white border-2 shadow-sm"
                  : isPassed
                  ? "bg-[#FAF8F5]/70 border-[rgba(184,134,11,0.15)] opacity-85 hover:opacity-100 hover:bg-white"
                  : "bg-[#FFFFFF] border-[rgba(184,134,11,0.2)] hover:border-[rgba(184,134,11,0.45)] hover:shadow-xs"
              }`}
              style={{
                borderColor: isCurrentActive ? color : undefined,
                boxShadow: isCurrentActive ? `0 2px 14px ${color}22` : undefined,
              }}
            >
              {/* Left Column: Icon + Name + Tags */}
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl w-8 text-center shrink-0"
                  style={{ color }}
                >
                  {LORD_ICON[period.lord]}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                      {LORD_HINDI[period.lord]} ({period.lord})
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                      style={{
                        background: isCurrentActive
                          ? `${color}20`
                          : isPassed
                          ? "rgba(0,0,0,0.06)"
                          : "rgba(184,134,11,0.12)",
                        color: isCurrentActive ? color : isPassed ? "#6B635B" : "#B8860B",
                        border: isCurrentActive ? `1px solid ${color}60` : undefined,
                      }}
                    >
                      {isCurrentActive ? "● Active Now (सक्रिय)" : isPassed ? "व्यतीत" : "आगामी"}
                    </span>
                    <span className="text-xs text-[#8C827A] font-medium">
                      · {formatDurationText(period, level)}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B635B] mt-1 font-mono">
                    {formatMicroDate(period.startDate, level)} → {formatMicroDate(period.endDate, level)}
                  </div>
                </div>
              </div>

              {/* Right Column: Progress & Drill Down Button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(184,134,11,0.12)]">
                {isCurrentActive && (
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold" style={{ color }}>
                      {period.progressPercent.toFixed(1)}% पूर्ण
                    </span>
                    <p className="text-[11px] text-[#6B635B]">
                      {formatDaysRemaining(period.daysRemaining)}
                    </p>
                  </div>
                )}

                {level < 5 ? (
                  <button
                    type="button"
                    onClick={() => handleRowClick(period)}
                    className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1"
                    style={{
                      background: isCurrentActive ? "rgba(184,134,11,0.1)" : "#FAF8F5",
                      borderColor: "rgba(184,134,11,0.3)",
                      color: "#B8860B",
                    }}
                  >
                    <span>उप-दशा देखें</span>
                    <span>→</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    सूक्ष्म प्राण-काल
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

