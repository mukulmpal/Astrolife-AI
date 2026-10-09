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
import { TransitShivlingStoryCard } from "./TransitShivlingStoryCard";

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
  const { chart, hasUserChart } = useUserChart();

  // Navigation & selection state
  const [activeTab, setActiveTab] = useState<"radar" | "story" | "timeline" | "shivling">("radar");
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
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 1. Page Header & Live Status */}
      <header
        className="rounded-2xl p-5 sm:p-7 transition-all"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(184, 134, 11, 0.28)",
          boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4"
          style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌟</span>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="font-serif text-xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: "#1A1A1A" }}
                >
                  Interactive Transit Ripple
                </h1>
                <span
                  className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: "#FAF5EB",
                    color: "#8C6508",
                    border: "1px solid rgba(184, 134, 11, 0.25)",
                  }}
                >
                  v2.0 Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5C5248] mt-0.5">
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
              style={{
                background: isToday ? "#FFFFFF" : "#FAF5EB",
                borderColor: isToday ? "#B8860B" : "rgba(184, 134, 11, 0.22)",
                color: isToday ? "#8C6508" : "#5C5248",
                boxShadow: isToday ? "0 2px 6px rgba(184, 134, 11, 0.18)" : "none",
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
            >
              Today (आज)
            </button>
            <button
              type="button"
              onClick={() => handleJumpDays(7)}
              style={{
                background: "#FAF5EB",
                borderColor: "rgba(184, 134, 11, 0.22)",
                color: "#5C5248",
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border hover:border-[#B8860B] transition-all"
            >
              +7 Days
            </button>
            <button
              type="button"
              onClick={() => handleJumpDays(30)}
              style={{
                background: "#FAF5EB",
                borderColor: "rgba(184, 134, 11, 0.22)",
                color: "#5C5248",
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border hover:border-[#B8860B] transition-all"
            >
              +30 Days
            </button>
            <input
              type="date"
              value={scanDate}
              onChange={(e) => e.target.value && setScanDate(e.target.value)}
              style={{
                background: "#FAF7F2",
                borderColor: "rgba(184, 134, 11, 0.3)",
                color: "#1A1A1A",
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-1 focus:ring-[#B8860B]"
            />
          </div>
        </div>

        {/* Chart Context Pill Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C5248]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl"
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.2)",
              }}
            >
              <span className="text-[#8C6508] font-bold">👤 Chart:</span>
              <strong className="text-[#1A1A1A]">
                {chart?.name || (hasUserChart ? "User Birth Chart" : "Demo Chart (Delhi)")}
              </strong>
            </span>
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl"
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.2)",
              }}
            >
              <span className="text-[#8C6508] font-bold">🏛️ Lagna:</span>
              <strong className="text-[#1A1A1A]">
                {natalInput.lagnaSignName || `Sign ${natalInput.lagnaSign}`}
              </strong>
            </span>
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl"
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.2)",
              }}
            >
              <span className="text-[#8C6508] font-bold">⭐ Janma Star:</span>
              <strong className="text-[#1A1A1A]">
                Nakshatra #{natalInput.moonNakshatra + 1}
              </strong>
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1 rounded-xl"
            style={{
              background: "#FFFDF5",
              border: "1px solid rgba(15, 107, 54, 0.25)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#0F6B36] animate-pulse" />
            <span className="font-semibold text-[#0F6B36]">
              Instant Auto-Calculated (0ms wait)
            </span>
          </div>
        </div>
      </header>

      {/* 2. Mobile-Friendly 3-Tab Navigator */}
      <div
        className="flex items-center justify-center sm:justify-start gap-1.5 p-1 rounded-xl"
        style={{
          background: "#FAF5EB",
          border: "1px solid rgba(184, 134, 11, 0.25)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("radar")}
          style={{
            background: activeTab === "radar" ? "#FFFFFF" : "transparent",
            borderColor: activeTab === "radar" ? "#B8860B" : "transparent",
            color: activeTab === "radar" ? "#8C6508" : "#5C5248",
            boxShadow:
              activeTab === "radar" ? "0 2px 6px rgba(184, 134, 11, 0.18)" : "none",
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all"
        >
          <span>🧭</span>
          <span>{language === "hinglish" ? "रडार (Kundli Radar)" : "Ripple Radar"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("story")}
          style={{
            background: activeTab === "story" ? "#FFFFFF" : "transparent",
            borderColor: activeTab === "story" ? "#B8860B" : "transparent",
            color: activeTab === "story" ? "#8C6508" : "#5C5248",
            boxShadow:
              activeTab === "story" ? "0 2px 6px rgba(184, 134, 11, 0.18)" : "none",
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all"
        >
          <span>📜</span>
          <span>
            {language === "hinglish"
              ? "कथा व मार्गदर्शन (Story & Guidance)"
              : "Story & Guidance"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          style={{
            background: activeTab === "timeline" ? "#FFFFFF" : "transparent",
            borderColor: activeTab === "timeline" ? "#B8860B" : "transparent",
            color: activeTab === "timeline" ? "#8C6508" : "#5C5248",
            boxShadow:
              activeTab === "timeline"
                ? "0 2px 6px rgba(184, 134, 11, 0.18)"
                : "none",
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all"
        >
          <span>📅</span>
          <span>30d Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shivling")}
          style={{
            background: activeTab === "shivling" ? "#FFFFFF" : "transparent",
            borderColor: activeTab === "shivling" ? "#B8860B" : "transparent",
            color: activeTab === "shivling" ? "#8C6508" : "#5C5248",
            boxShadow:
              activeTab === "shivling"
                ? "0 2px 6px rgba(184, 134, 11, 0.18)"
                : "none",
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all"
        >
          <span>🕉️</span>
          <span>
            {language === "hinglish"
              ? "शिवलिंग गोचर उपाय (Shivling Upay)"
              : "Shivling Transit Upay"}
          </span>
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
            <div
              className="p-4 rounded-xl text-xs text-[#5C5248] leading-relaxed"
              style={{
                background: "#FFFDF5",
                border: "1px solid rgba(184, 134, 11, 0.25)",
              }}
            >
              <strong className="text-[#8C6508]">
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
        <div
          className="w-full rounded-2xl p-6 flex flex-col gap-6"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(184, 134, 11, 0.28)",
            boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
          }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-3 pb-4"
            style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
          >
            <div>
              <h3
                className="font-serif text-lg font-bold"
                style={{ color: "#1A1A1A" }}
              >
                {language === "hinglish"
                  ? "मासिक गोचर प्रवाह एवं दृष्टियां"
                  : "30-Day Planetary Transit Windows"}
              </h3>
              <p className="text-xs text-[#6B635B] mt-0.5">
                Current planetary signs, speeds, and direct Parashari target houses for{" "}
                {scanDate}
              </p>
            </div>
            <div
              className="text-xs font-mono font-bold px-3 py-1 rounded-xl"
              style={{
                background: "#FAF5EB",
                color: "#8C6508",
                border: "1px solid rgba(184, 134, 11, 0.25)",
              }}
            >
              Swiss Ephemeris Sidereal Lahiri
            </div>
          </div>

          {/* Planetary Position Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr
                  className="font-mono text-[10px] uppercase tracking-wider text-[#8C6508]"
                  style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
                >
                  <th className="py-2.5 px-3">Planet</th>
                  <th className="py-2.5 px-3">Sign</th>
                  <th className="py-2.5 px-3">House (from Lagna)</th>
                  <th className="py-2.5 px-3">Longitude</th>
                  <th className="py-2.5 px-3">Drishti Target Houses</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8860B]/10 text-[#3D3834]">
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
                        isSel ? "bg-[#FFFDF5] font-bold" : "hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <td className="py-3 px-3 flex items-center gap-2">
                        <span>
                          {pos.planet === "Saturn"
                            ? "🪐"
                            : pos.planet === "Jupiter"
                            ? "🌟"
                            : pos.planet === "Rahu"
                            ? "⚡"
                            : pos.planet === "Ketu"
                            ? "🔥"
                            : pos.planet === "Mars"
                            ? "🔴"
                            : pos.planet === "Sun"
                            ? "☀️"
                            : pos.planet === "Venus"
                            ? "✨"
                            : pos.planet === "Mercury"
                            ? "🌿"
                            : "🌙"}
                        </span>
                        <span className="text-[#1A1A1A]">{pos.planet}</span>
                        {pos.isRetrograde && (
                          <span className="text-[10px] text-[#C9555F] font-bold font-mono">
                            [Rx]
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">{pos.signName}</td>
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-0.5 rounded font-bold"
                          style={{
                            background: "#FAF5EB",
                            color: "#8C6508",
                            border: "1px solid rgba(184, 134, 11, 0.2)",
                          }}
                        >
                          House {pos.house}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#5C5248]">
                        {pos.longitude.toFixed(2)}°
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {hits.map((hit) => (
                            <span
                              key={hit.targetHouse}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background: "#FAF5EB",
                                color: "#8C6508",
                                border: "1px solid rgba(184, 134, 11, 0.2)",
                              }}
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
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{
                            background: "linear-gradient(180deg, #D4AF37, #B8860B)",
                            color: "#FFFFFF",
                          }}
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

      {/* Mode D: Shivling Gochar Upachara Tab */}
      {activeTab === "shivling" && (
        <div className="w-full max-w-4xl mx-auto">
          <TransitShivlingStoryCard
            chart={chart}
            targetDate={new Date(scanDate + "T12:00:00")}
          />
        </div>
      )}
    </div>
  );
}
