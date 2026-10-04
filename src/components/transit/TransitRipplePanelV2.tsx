"use client";

import React, { useMemo, useState } from "react";
import { useUserChart, type ChartData } from "@/lib/user-chart";
import { generateTransitRippleReport } from "@/lib/astro-engine/transit-ripple";
import type {
  NatalInput,
  TransitPlanet,
  TransitRippleResult,
} from "@/lib/astro-engine/transit-ripple/types";
import { RippleRadar } from "./RippleRadar";
import { TransitStoryPanel } from "./TransitStoryPanel";

const DEFAULT_NATAL_INPUT: NatalInput = {
  birthDate: "1990-08-15",
  birthTime: "14:30",
  timezone: "+05:30",
  latitude: 28.6139,
  longitude: 77.209,
  lagnaSign: 7, // Scorpio (Vrishchika)
  lagnaSignName: "Scorpio",
  moonLongitude: 220.4,
  moonNakshatra: 16, // Anuradha
  activeMahadasha: "Jupiter",
  activeAntardasha: "Saturn",
};

function formatIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function chartToNatal(chart: ChartData | null): NatalInput {
  if (!chart || !chart.planets?.Moon) {
    return DEFAULT_NATAL_INPUT;
  }

  const lagnaSign = typeof chart.lagnaNum === "number" ? chart.lagnaNum : 0;
  const moonLon = chart.planets.Moon.lon ?? 0;
  const nakIdx = Math.floor(moonLon / (360 / 27)) % 27;

  const nowMs = Date.now();
  let activeMD = "Jupiter";
  if (Array.isArray(chart.dashas)) {
    const md = chart.dashas.find((d) => {
      const s = new Date(d.start).getTime();
      const e = new Date(d.end).getTime();
      return nowMs >= s && nowMs <= e;
    });
    if (md) activeMD = md.planet;
  }

  let activeAD = "Saturn";
  if (Array.isArray(chart.antardasha)) {
    const ad = chart.antardasha.find((a) => {
      const s = new Date(a.start).getTime();
      const e = new Date(a.end).getTime();
      return nowMs >= s && nowMs <= e;
    });
    if (ad) activeAD = ad.planet;
  }

  return {
    birthDate: chart.dob || "1990-08-15",
    birthTime: chart.tob || "14:30",
    timezone:
      typeof chart.tz === "number"
        ? chart.tz >= 0
          ? `+${chart.tz}`
          : `${chart.tz}`
        : "+05:30",
    latitude: chart.lat || 28.6139,
    longitude: chart.lon || 77.209,
    lagnaSign,
    lagnaSignName: chart.lagnaRashi || undefined,
    moonLongitude: moonLon,
    moonNakshatra: nakIdx,
    activeMahadasha: activeMD,
    activeAntardasha: activeAD,
  };
}

export function TransitRipplePanelV2() {
  const { chart, hasUserChart, loading: chartLoading } = useUserChart();

  // Navigation & selection state
  const [activeTab, setActiveTab] = useState<"radar" | "story" | "timeline">("radar");
  const [selectedPlanet, setSelectedPlanet] = useState<TransitPlanet>("Saturn");
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [language, setLanguage] = useState<"hinglish" | "english">("hinglish");
  const [scanDate, setScanDate] = useState<string>(() => formatIsoDate(new Date()));

  // Convert chart to natal input
  const natalInput = useMemo<NatalInput>(() => {
    return chartToNatal(chart);
  }, [chart]);

  // Instant zero-waiting-time Transit Ripple calculation
  const report = useMemo<TransitRippleResult>(() => {
    return generateTransitRippleReport(
      natalInput,
      scanDate,
      language,
      selectedPlanet,
      "5_7_9"
    );
  }, [natalInput, scanDate, language, selectedPlanet]);

  // Quick date jump helpers
  const handleJumpDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setScanDate(formatIsoDate(d));
  };

  const isToday = scanDate === formatIsoDate(new Date());

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 font-sans">
      {/* 1. Page Header & Live Status */}
      <header className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE3] dark:from-[#181614] dark:via-[#141211] dark:to-[#0F0E0D] border border-[#B8860B]/30 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8860B]/15 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌟</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#2D241E] dark:text-[#F7F2E8] tracking-tight">
                  Interactive Transit Ripple
                </h1>
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  v2.0 Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#70645B] dark:text-[#ABA396] mt-0.5">
                {language === "hinglish"
                  ? "पाराशरी दृष्टि ओवरलैप × विंशोत्तरी दशा का मौसम × आज का नवतारा"
                  : "Parashari Aspect Resonance × Mahadasha × Antardasha × Daily Navatara"}
              </p>
            </div>
          </div>

          {/* Quick Date Jumper & Date Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleJumpDays(0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isToday
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-white/80 dark:bg-[#201D1A] text-[#6B635B] dark:text-[#A8A29E] border-[#B8860B]/20 hover:border-[#B8860B]/40"
              }`}
            >
              Today (आज)
            </button>
            <button
              type="button"
              onClick={() => handleJumpDays(7)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-[#201D1A] text-[#6B635B] dark:text-[#A8A29E] border border-[#B8860B]/20 hover:border-[#B8860B]/40 transition-all"
            >
              +7 Days
            </button>
            <button
              type="button"
              onClick={() => handleJumpDays(30)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-[#201D1A] text-[#6B635B] dark:text-[#A8A29E] border border-[#B8860B]/20 hover:border-[#B8860B]/40 transition-all"
            >
              +30 Days
            </button>
            <input
              type="date"
              value={scanDate}
              onChange={(e) => e.target.value && setScanDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/90 dark:bg-[#201D1A] text-[#2D241E] dark:text-[#F3EDE2] border border-[#B8860B]/30 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Chart Context Pill Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C4F46] dark:text-[#BDB6AA]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] dark:bg-[#1E1C1A] px-3 py-1 rounded-xl border border-[#B8860B]/20">
              <span className="text-amber-600 font-bold">👤 Chart:</span>
              <strong className="text-[#2D241E] dark:text-[#F3EDE2]">
                {chart?.name || (hasUserChart ? "User Birth Chart" : "Demo Chart (Delhi)")}
              </strong>
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] dark:bg-[#1E1C1A] px-3 py-1 rounded-xl border border-[#B8860B]/20">
              <span className="text-amber-600 font-bold">🏛️ Lagna:</span>
              <strong>{natalInput.lagnaSignName || `Sign ${natalInput.lagnaSign}`}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] dark:bg-[#1E1C1A] px-3 py-1 rounded-xl border border-[#B8860B]/20">
              <span className="text-amber-600 font-bold">⭐ Janma Tara:</span>
              <strong>Nakshatra #{natalInput.moonNakshatra + 1}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              Instant Auto-Calculated (0ms wait)
            </span>
          </div>
        </div>
      </header>

      {/* 2. Mobile-Friendly 3-Tab Navigator */}
      <div className="flex items-center justify-center sm:justify-start gap-2 bg-[#F3ECE0] dark:bg-[#1A1816] p-1.5 rounded-2xl border border-[#B8860B]/25">
        <button
          type="button"
          onClick={() => setActiveTab("radar")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "radar"
              ? "bg-amber-600 text-white shadow-md"
              : "text-[#6B635B] dark:text-[#A8A29E] hover:text-[#2D241E] hover:bg-white/40"
          }`}
        >
          <span>🧭</span>
          <span>{language === "hinglish" ? "रडार (Kundli Radar)" : "Ripple Radar"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("story")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "story"
              ? "bg-amber-600 text-white shadow-md"
              : "text-[#6B635B] dark:text-[#A8A29E] hover:text-[#2D241E] hover:bg-white/40"
          }`}
        >
          <span>📜</span>
          <span>{language === "hinglish" ? "कथा व मार्गदर्शन (Story & Guidance)" : "Story & Guidance"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "timeline"
              ? "bg-amber-600 text-white shadow-md"
              : "text-[#6B635B] dark:text-[#A8A29E] hover:text-[#2D241E] hover:bg-white/40"
          }`}
        >
          <span>📅</span>
          <span>30d Timeline</span>
        </button>
      </div>

      {/* 3. Main Views */}
      {/* Mode A: Radar Tab (Desktop shows Radar + Story in responsive grid, Mobile shows pure Radar) */}
      {activeTab === "radar" && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 w-full flex flex-col gap-4">
            <RippleRadar
              lagnaSign={natalInput.lagnaSign}
              lagnaSignName={natalInput.lagnaSignName}
              transitPositions={report.transitPositions}
              selectedPlanet={selectedPlanet}
              onSelectPlanet={(p) => setSelectedPlanet(p)}
              selectedHouse={selectedHouse}
              onSelectHouse={(h) => setSelectedHouse(h)}
              houseClusters={report.houseClusters}
              hotspotHouses={report.hotspotHouses}
              drishtiHitsForSelected={report.selectedPlanetRipples.drishtiHits}
              language={language}
            />

            {/* Quick Summary card underneath Radar */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-[#5C4F46] dark:text-[#D5CDBF] leading-relaxed">
              <strong className="text-amber-900 dark:text-amber-300">
                {language === "hinglish" ? "💡 रडार टिप:" : "💡 Radar Tip:"}
              </strong>{" "}
              {language === "hinglish"
                ? `ऊपर किसी भी ग्रह (जैसे शनि 🪐 या गुरु 🌟) पर क्लिक करके उसकी दृष्टि रेखाएं (Drishti Rays) देखें। रेखाएं जिस भाव पर आपस में टकराती हैं, वह भाव '⚡ हॉटस्पॉट' बन जाता है।`
                : `Tap any planet button above to inspect its cosmic aspect rays. Houses where 2 or more rays intersect turn into active '⚡ Hotspots' requiring focused awareness.`}
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            <TransitStoryPanel
              narrative={report.narrative}
              language={language}
              onLanguageChange={(l) => setLanguage(l)}
              selectedHouse={selectedHouse}
              onSelectHouse={(h) => setSelectedHouse(h)}
            />
          </div>
        </div>
      )}

      {/* Mode B: Full Story Panel Tab */}
      {activeTab === "story" && (
        <div className="w-full max-w-4xl mx-auto">
          <TransitStoryPanel
            narrative={report.narrative}
            language={language}
            onLanguageChange={(l) => setLanguage(l)}
            selectedHouse={selectedHouse}
            onSelectHouse={(h) => setSelectedHouse(h)}
          />
        </div>
      )}

      {/* Mode C: 30-Day Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="w-full bg-[#FAF7F2] dark:bg-[#141211] border border-[#B8860B]/25 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#B8860B]/15 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#2D241E] dark:text-[#F3EDE2]">
                {language === "hinglish"
                  ? "मासिक गोचर प्रवाह एवं दृष्टियां"
                  : "30-Day Planetary Transit Windows"}
              </h3>
              <p className="text-xs text-[#70645B] dark:text-[#A8A29E] mt-0.5">
                Current planetary signs, speeds, and direct Parashari target houses for {scanDate}
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              Swiss Ephemeris Sidereal Lahiri
            </div>
          </div>

          {/* Planetary Position Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#B8860B]/20 text-[#8C827A] dark:text-[#9B9288] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Planet</th>
                  <th className="py-2.5 px-3">Sign</th>
                  <th className="py-2.5 px-3">House (from Lagna)</th>
                  <th className="py-2.5 px-3">Longitude</th>
                  <th className="py-2.5 px-3">Drishti Target Houses</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8860B]/10 text-[#3D332C] dark:text-[#DDD6CB]">
                {Object.values(report.transitPositions).map((pos) => {
                  const hits = report.allDrishtiHits.filter(
                    (h) => h.planet === pos.planet
                  );
                  const isSel = pos.planet === selectedPlanet;
                  return (
                    <tr
                      key={pos.planet}
                      onClick={() => {
                        setSelectedPlanet(pos.planet);
                        setActiveTab("radar");
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSel
                          ? "bg-amber-500/15 font-bold"
                          : "hover:bg-[#B8860B]/5"
                      }`}
                    >
                      <td className="py-3 px-3 flex items-center gap-2">
                        <span>{pos.planet === "Saturn" ? "🪐" : pos.planet === "Jupiter" ? "🌟" : pos.planet === "Rahu" ? "⚡" : pos.planet === "Ketu" ? "🔥" : pos.planet === "Mars" ? "🔴" : pos.planet === "Sun" ? "☀️" : pos.planet === "Venus" ? "✨" : pos.planet === "Mercury" ? "🌿" : "🌙"}</span>
                        <span>{pos.planet}</span>
                        {pos.isRetrograde && (
                          <span className="text-[10px] text-rose-500 font-bold">
                            [Rx]
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">{pos.signName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#B8860B]/15 text-[#996515] dark:text-amber-300 font-bold">
                          House {pos.house}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {pos.longitude.toFixed(2)}°
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {hits.map((hit) => (
                            <span
                              key={hit.targetHouse}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-200"
                            >
                              H{hit.targetHouse} ({hit.aspectRule.name})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlanet(pos.planet);
                            setActiveTab("radar");
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs bg-amber-600 text-white font-medium hover:bg-amber-700"
                        >
                          View Radar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
