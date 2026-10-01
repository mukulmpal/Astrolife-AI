"use client";

import React, { useState, useMemo } from "react";
import { useUserChart } from "@/lib/user-chart";
import { computePlanets } from "@/lib/astro-engine/calculations";
import {
  runNavtaraIntelligence,
  calculateCountedPosition,
  calculateTaraNumber,
  CLASSICAL_TARAS,
  type TaraDefinition,
} from "@/lib/astro-engine/navtara-engine";
import { resolveNakshatraCoordinate } from "@/lib/astro-engine/ayanamsa-config";
import type { NakshatraData } from "@/lib/astro-engine/nakshatra-data";
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export interface PersonalTaraDay {
  date: Date;
  dateStr: string;
  dayName: string;
  formattedDate: string;
  moonNakshatra: NakshatraData;
  pada: number;
  countedPosition: number;
  taraNum: number;
  tara: TaraDefinition;
  isAfflicted: boolean;
  isJanma: boolean;
  isSupportive: boolean;
  recommendationTag: string;
  bestFor: string[];
  avoidFor: string[];
}

export function PersonalTaraCalendar() {
  const { chart } = useUserChart();
  const [filterMode, setFilterMode] = useState<"ALL" | "AUSPICIOUS" | "CAUTION">("ALL");
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  // Compute 30 Days of Moon Tara-Bala from User's Janma Star
  const calendarDays: PersonalTaraDay[] = useMemo(() => {
    if (!chart?.planets?.Moon) return [];

    try {
      const intel = runNavtaraIntelligence(chart);
      const birthId = intel.birthNakshatra.id;
      const days: PersonalTaraDay[] = [];

      const today = new Date();
      today.setHours(12, 0, 0, 0);

      for (let offset = 0; offset < 30; offset++) {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);

        const jd = 2440587.5 + d.getTime() / 86400000;
        const planets = computePlanets(jd);
        const moonLon = planets.Moon;
        const coord = resolveNakshatraCoordinate(moonLon, jd, intel.selectedAyanamsa);
        const moonNak = coord.nakshatra;
        const countedPos = calculateCountedPosition(birthId, moonNak.id);
        const taraNum = calculateTaraNumber(birthId, moonNak.id);
        const tara = CLASSICAL_TARAS[taraNum];

        const isAfflicted = [3, 5, 7].includes(taraNum);
        const isJanma = taraNum === 1;
        const isSupportive = [2, 4, 6, 8, 9].includes(taraNum);

        let recommendationTag = "Auspicious Action Day";
        let bestFor: string[] = [];
        let avoidFor: string[] = [];

        if (taraNum === 2) {
          recommendationTag = "Wealth & Lucrative Investments";
          bestFor = ["Financial deals", "New business agreements", "Purchasing assets", "Opening accounts"];
          avoidFor = ["Unchecked expenditure", "Loan commitments without audit"];
        } else if (taraNum === 3) {
          recommendationTag = "High Caution (Vipat / Impediments)";
          bestFor = ["Internal research", "Routine maintenance", "Spiritual sadhana", "Rest & recovery"];
          avoidFor = ["High-stakes negotiations", "Signing legal documents", "Risky travel", "Aggressive pitches"];
        } else if (taraNum === 4) {
          recommendationTag = "Security & Long-Term Foundations";
          bestFor = ["Domestic harmony", "Health treatments", "Family gatherings", "Consolidation"];
          avoidFor = ["Drastic impulsive pivots", "Hazardous sports"];
        } else if (taraNum === 5) {
          recommendationTag = "Adversarial Pressure (Pratyari)";
          bestFor = ["Independent solitary work", "Auditing errors", "Defensive prep"];
          avoidFor = ["Ego confrontations", "Starting lawsuits", "Lending money to peers", "Major debates"];
        } else if (taraNum === 6) {
          recommendationTag = "Peak Accomplishment (Sadhaka)";
          bestFor = ["Launching products", "Job interviews", "Exam submissions", "Important meetings"];
          avoidFor = ["Procrastination", "Missing deadlines"];
        } else if (taraNum === 7) {
          recommendationTag = "Vulnerability / Ending (Vadha)";
          bestFor = ["Meditation", "Charity / Danam", "Quiet study", "Spiritual grounding"];
          avoidFor = ["New partnerships", "Marriage proposals", "Surgery (unless emergency)", "Large speculative bets"];
        } else if (taraNum === 8) {
          recommendationTag = "Alliances & Cooperative Growth (Mitra)";
          bestFor = ["Networking", "Forming partnerships", "Friendly negotiations", "Creative arts"];
          avoidFor = ["Unilateral solitary moves without consultation"];
        } else if (taraNum === 9) {
          recommendationTag = "Supreme Breakthrough (Parama Mitra)";
          bestFor = ["Sacred ceremonies", "Milestone launches", "Meeting mentors", "Signing master contracts"];
          avoidFor = ["Trivial time-wasting"];
        } else {
          // Tara #1 Janma
          recommendationTag = "Personal Foundation & Health (Janma)";
          bestFor = ["Self-care", "Dietary discipline", "Strategic planning", "Temple visits"];
          avoidFor = ["Heavy physical over-exhaustion", "Ego-driven initiatives"];
        }

        const dateStr = d.toISOString().split("T")[0];
        const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
        const formattedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

        days.push({
          date: d,
          dateStr,
          dayName,
          formattedDate,
          moonNakshatra: moonNak,
          pada: coord.pada,
          countedPosition: countedPos,
          taraNum,
          tara,
          isAfflicted,
          isJanma,
          isSupportive,
          recommendationTag,
          bestFor,
          avoidFor,
        });
      }

      return days;
    } catch (err) {
      console.error("[PersonalTaraCalendar] Failed to compute 30 days:", err);
      return [];
    }
  }, [chart]);

  const filteredDays = useMemo(() => {
    if (filterMode === "AUSPICIOUS") {
      return calendarDays.filter((d) => d.isSupportive);
    }
    if (filterMode === "CAUTION") {
      return calendarDays.filter((d) => d.isAfflicted);
    }
    return calendarDays;
  }, [calendarDays, filterMode]);

  const activeDay = useMemo(() => {
    if (selectedDayKey) {
      return calendarDays.find((d) => d.dateStr === selectedDayKey) ?? calendarDays[0];
    }
    return calendarDays[0] ?? null;
  }, [calendarDays, selectedDayKey]);

  if (!chart?.planets?.Moon) {
    return (
      <div className="bg-[#FAF7F2] rounded-2xl p-6 text-center border border-amber-900/10">
        <p className="text-sm text-[#6B635B]">
          Please ensure your birth chart is loaded to generate your personalized 30-day Navtara Muhurat calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Header & Stats ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-amber-900/15 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B]">
              Personalized Moon Tara-Bala Heatmap
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mt-1">
            Next 30-Day Decision &amp; Action Calendar
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5">
            Based on your Birth Star: <strong className="text-[#1A1A1A]">{chart.planets.Moon.nakshatra}</strong>.
            Unlike generic panchang, every day here is calculated specifically against your personal Moon coordinate.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-2xl border border-amber-900/10 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "ALL"
                ? "bg-[#B8860B] text-white shadow-sm"
                : "text-[#6B635B] hover:text-[#1A1A1A]"
            }`}
          >
            All 30 Days
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("AUSPICIOUS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterMode === "AUSPICIOUS"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-700 hover:text-emerald-900"
            }`}
          >
            <span>🟢</span>
            <span>Auspicious Only</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("CAUTION")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterMode === "CAUTION"
                ? "bg-red-600 text-white shadow-sm"
                : "text-red-700 hover:text-red-900"
            }`}
          >
            <span>🔴</span>
            <span>Caution Days</span>
          </button>
        </div>
      </div>

      {/* ── 30-Day Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filteredDays.map((day) => {
          const isSelected = activeDay?.dateStr === day.dateStr;
          const isToday =
            new Date().toISOString().split("T")[0] === day.dateStr;

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => setSelectedDayKey(day.dateStr)}
              className="text-left rounded-2xl p-3.5 border transition-all flex flex-col justify-between gap-2 shadow-sm hover:scale-[1.02]"
              style={{
                background: isSelected
                  ? day.isAfflicted
                    ? "#FEE2E2"
                    : day.isJanma
                    ? "#FFEDD5"
                    : "#DCFCE7"
                  : day.isAfflicted
                  ? "rgba(239, 68, 68, 0.05)"
                  : day.isJanma
                  ? "rgba(249, 115, 22, 0.05)"
                  : "#FFFFFF",
                borderColor: isSelected
                  ? day.isAfflicted
                    ? "#DC2626"
                    : day.isJanma
                    ? "#EA580C"
                    : "#16A34A"
                  : day.isAfflicted
                  ? "rgba(239, 68, 68, 0.3)"
                  : day.isJanma
                  ? "rgba(249, 115, 22, 0.3)"
                  : "rgba(34, 197, 94, 0.25)",
                borderWidth: isSelected ? "2px" : "1px",
              }}
            >
              {/* Header with Date and Today Tag */}
              <div className="flex items-center justify-between gap-1 w-full">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#6B635B]">
                    {day.dayName}
                  </span>
                  <p className="text-sm font-bold text-[#1A1A1A] leading-tight">
                    {day.formattedDate}
                  </p>
                </div>
                {isToday && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                    TODAY
                  </span>
                )}
              </div>

              {/* Tara Indicator Badge */}
              <div
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center justify-between ${
                  day.isAfflicted
                    ? "bg-red-500/15 text-red-700"
                    : day.isJanma
                    ? "bg-orange-500/15 text-orange-700"
                    : "bg-emerald-500/15 text-emerald-700"
                }`}
              >
                <span>{day.isAfflicted ? "🔴" : day.isJanma ? "🟠" : "🟢"}</span>
                <span>T{day.taraNum} {day.tara.name}</span>
              </div>

              {/* Moon Star */}
              <div className="border-t border-amber-900/10 pt-1.5 mt-0.5 text-[11px] text-[#6B635B]">
                <span className="truncate block font-medium">☽ {day.moonNakshatra.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active Day Detail Spotlight ── */}
      {activeDay && (
        <div
          className="rounded-3xl p-6 border flex flex-col gap-4 shadow-sm"
          style={{
            background: activeDay.isAfflicted
              ? "rgba(239, 68, 68, 0.03)"
              : activeDay.isJanma
              ? "rgba(249, 115, 22, 0.03)"
              : "#FFFFFF",
            borderColor: activeDay.isAfflicted
              ? "rgba(239, 68, 68, 0.3)"
              : activeDay.isJanma
              ? "rgba(249, 115, 22, 0.3)"
              : "rgba(34, 197, 94, 0.3)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-900/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B]">
                  Date Spotlight · {activeDay.dayName}, {activeDay.formattedDate}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeDay.isAfflicted
                      ? "bg-red-500/15 text-red-700"
                      : activeDay.isJanma
                      ? "bg-orange-500/15 text-orange-700"
                      : "bg-emerald-500/15 text-emerald-700"
                  }`}
                >
                  {activeDay.recommendationTag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-1 flex items-center gap-2">
                <span>{activeDay.tara.icon} {activeDay.tara.name} Tara (#{activeDay.taraNum})</span>
                <span className="text-base font-normal text-[#6B635B]">
                  · Moon in {activeDay.moonNakshatra.name} (Pada {activeDay.pada})
                </span>
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#6B635B] block">Spoke Distance</span>
              <span className="text-sm font-bold text-[#1A1A1A]">
                #{activeDay.countedPosition} from {chart.planets.Moon.nakshatra}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#5C3D00] leading-relaxed">
            <strong>Practical Strategy:</strong> {activeDay.tara.practicalAdvice}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recommended Activities */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prime Activities for this Day</span>
              </p>
              <ul className="space-y-1 text-xs text-emerald-950">
                {activeDay.bestFor.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Caution Guidance */}
            <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200">
              <p className="text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Activities to Avoid / Postpone</span>
              </p>
              <ul className="space-y-1 text-xs text-red-950">
                {activeDay.avoidFor.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
