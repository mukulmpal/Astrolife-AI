"use client";

import React from "react";
import type { ChapterNarrative } from "@/lib/astro-engine/transit-ripple/types";

export interface TransitStoryPanelProps {
  narrative: ChapterNarrative;
  language: "hinglish" | "english";
  onLanguageChange: (lang: "hinglish" | "english") => void;
  selectedHouse: number | null;
  onSelectHouse: (house: number | null) => void;
}

export function TransitStoryPanel({
  narrative,
  language,
  onLanguageChange,
  selectedHouse,
  onSelectHouse,
}: TransitStoryPanelProps) {
  const {
    chapterTitle,
    dashaGocharFusion,
    activeMahadasha,
    activeAntardasha,
    isDashaLordActiveInTransit,
    focalHouseNumber,
    focalHouseName,
    houseImpacts,
    defensiveCautions,
    offensiveOpportunities,
    navataraIntelligence,
    sattvicUpaya,
  } = narrative;

  const {
    dailyTransitMoon,
    mahadashaTara,
    antardashaTara,
    triangulation,
  } = navataraIntelligence;

  // Filter house impacts if user clicked a specific house
  const displayedImpacts = selectedHouse
    ? houseImpacts.filter((imp) => imp.house === selectedHouse)
    : houseImpacts;

  return (
    <div className="w-full flex flex-col gap-6 text-[#1A1A1A] font-sans">
      {/* 1. Header Banner & Language Toggle */}
      <div
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
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <span
              className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider"
              style={{ color: "#8C6508" }}
            >
              {language === "hinglish"
                ? "दैनिक गोचर एवं दशा-नवतारा कथा"
                : "Daily Transit, Dasha & Navatara Chapter"}
            </span>
          </div>

          {/* Hinglish / English Toggle */}
          <div
            className="flex items-center p-1 rounded-xl text-xs"
            style={{
              background: "#FAF5EB",
              border: "1px solid rgba(184, 134, 11, 0.25)",
            }}
          >
            <button
              type="button"
              onClick={() => onLanguageChange("hinglish")}
              className={`px-3 py-1 rounded-lg transition-all ${
                language === "hinglish"
                  ? "bg-[#FFFFFF] text-[#8C6508] font-bold shadow-xs border border-[#B8860B]"
                  : "text-[#6B635B] hover:text-[#1A1A1A]"
              }`}
            >
              Hinglish (सहज)
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("english")}
              className={`px-3 py-1 rounded-lg transition-all ${
                language === "english"
                  ? "bg-[#FFFFFF] text-[#8C6508] font-bold shadow-xs border border-[#B8860B]"
                  : "text-[#6B635B] hover:text-[#1A1A1A]"
              }`}
            >
              English (Classic)
            </button>
          </div>
        </div>

        {/* Chapter Title */}
        <h2
          className="font-serif text-xl sm:text-2xl font-bold leading-snug"
          style={{ color: "#1A1A1A" }}
        >
          {chapterTitle}
        </h2>

        {/* Active Dasha Chips */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "#FAF5EB",
              color: "#8C6508",
              border: "1px solid rgba(184, 134, 11, 0.25)",
            }}
          >
            <span>👑 Mahadasha:</span>
            <strong className="text-[#1A1A1A]">{activeMahadasha}</strong>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "#FAF5EB",
              color: "#8C6508",
              border: "1px solid rgba(184, 134, 11, 0.25)",
            }}
          >
            <span>⏱️ Antardasha:</span>
            <strong className="text-[#1A1A1A]">{activeAntardasha}</strong>
          </div>

          {isDashaLordActiveInTransit && (
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-xs"
              style={{
                background: "#FFFDF5",
                color: "#B8860B",
                border: "1px solid #B8860B",
              }}
            >
              <span>
                🔥{" "}
                {language === "hinglish"
                  ? "सक्रिय दशा स्वामी (3x तीव्रता)"
                  : "Active Dasha Lord (3x Manifestation Volume)"}
              </span>
            </div>
          )}
        </div>

        {/* Dasha x Gochar Fusion Story */}
        <div
          className="mt-4 p-4 sm:p-5 rounded-xl text-xs sm:text-sm leading-relaxed"
          style={{
            background: "#FFFDF5",
            border: "1px solid rgba(184, 134, 11, 0.22)",
            borderLeft: "4px solid #B8860B",
            color: "#3D3834",
          }}
        >
          <div className="font-semibold text-[#1A1A1A] mb-1">
            {language === "hinglish" ? "✦ मुख्य पारगमन तालमेल" : "✦ Primary Cosmic Rhythm"}
          </div>
          {dashaGocharFusion}
        </div>
      </div>

      {/* 2. Tri-Layer Navatara Intelligence (Mahadasha x Antardasha x Gochara) */}
      <div
        className="rounded-2xl p-5 sm:p-6 flex flex-col gap-5 transition-all"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(184, 134, 11, 0.28)",
          boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 pb-3"
          style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⭐</span>
            <div>
              <h3
                className="font-serif text-base sm:text-lg font-bold"
                style={{ color: "#1A1A1A" }}
              >
                {language === "hinglish"
                  ? "त्रि-स्तरीय नवतारा विश्लेषण (Tri-Layer Navatara)"
                  : "Tri-Layer Dasha × Navatara Intelligence"}
              </h3>
              <p className="text-xs text-[#6B635B] mt-0.5">
                {language === "hinglish"
                  ? `जन्म नक्षत्र (${dailyTransitMoon.birthNakshatra}) से महादशा, अंतर्दशा एवं दैनिक गोचर का समन्वय`
                  : `Tara evaluation from Birth Star (${dailyTransitMoon.birthNakshatra}) across MD, AD & Transit`}
              </p>
            </div>
          </div>
          <span
            className="font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full"
            style={{
              background: "#FAF5EB",
              color: "#8C6508",
              border: "1px solid rgba(184, 134, 11, 0.25)",
            }}
          >
            Classical 9-Tara Audit
          </span>
        </div>

        {/* 3-Pillar Cards: Mahadasha Lord, Antardasha Lord, Today's Transit Moon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Pillar 1: Mahadasha Tara */}
          <div
            className="p-4 rounded-xl flex flex-col justify-between"
            style={{
              background: "#FAF7F2",
              border: "1px solid rgba(184, 134, 11, 0.22)",
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-[#6B635B]">
                <span>👑 महादशा तारा</span>
                <span
                  className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                  style={{
                    background:
                      mahadashaTara.category === "favourable"
                        ? "rgba(15, 107, 54, 0.12)"
                        : mahadashaTara.category === "caution"
                        ? "rgba(201, 85, 95, 0.12)"
                        : "rgba(184, 134, 11, 0.12)",
                    color:
                      mahadashaTara.category === "favourable"
                        ? "#0F6B36"
                        : mahadashaTara.category === "caution"
                        ? "#9E2A36"
                        : "#8C6508",
                    border: `1px solid ${
                      mahadashaTara.category === "favourable"
                        ? "rgba(15, 107, 54, 0.25)"
                        : mahadashaTara.category === "caution"
                        ? "rgba(201, 85, 95, 0.25)"
                        : "rgba(184, 134, 11, 0.25)"
                    }`,
                  }}
                >
                  {mahadashaTara.category}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                {mahadashaTara.lord} · {mahadashaTara.taraName}
              </h4>
              <p className="text-xs text-[#5C5248] mt-1">
                नक्षत्र: {mahadashaTara.nakshatraName} (तारा #{mahadashaTara.taraNumber})
              </p>
            </div>
            <div
              className="mt-3 text-xs font-bold pt-2 text-[#8C6508]"
              style={{ borderTop: "1px solid rgba(184, 134, 11, 0.15)" }}
            >
              {mahadashaTara.statusTag}
            </div>
          </div>

          {/* Pillar 2: Antardasha Tara */}
          {antardashaTara && (
            <div
              className="p-4 rounded-xl flex flex-col justify-between"
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.22)",
              }}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-[#6B635B]">
                  <span>⏱️ अंतर्दशा तारा</span>
                  <span
                    className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                    style={{
                      background:
                        antardashaTara.category === "favourable"
                          ? "rgba(15, 107, 54, 0.12)"
                          : antardashaTara.category === "caution"
                          ? "rgba(201, 85, 95, 0.12)"
                          : "rgba(184, 134, 11, 0.12)",
                      color:
                        antardashaTara.category === "favourable"
                          ? "#0F6B36"
                          : antardashaTara.category === "caution"
                          ? "#9E2A36"
                          : "#8C6508",
                      border: `1px solid ${
                        antardashaTara.category === "favourable"
                          ? "rgba(15, 107, 54, 0.25)"
                          : antardashaTara.category === "caution"
                          ? "rgba(201, 85, 95, 0.25)"
                          : "rgba(184, 134, 11, 0.25)"
                      }`,
                    }}
                  >
                    {antardashaTara.category}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  {antardashaTara.lord} · {antardashaTara.taraName}
                </h4>
                <p className="text-xs text-[#5C5248] mt-1">
                  नक्षत्र: {antardashaTara.nakshatraName} (तारा #{antardashaTara.taraNumber})
                </p>
              </div>
              <div
                className="mt-3 text-xs font-bold pt-2 text-[#8C6508]"
                style={{ borderTop: "1px solid rgba(184, 134, 11, 0.15)" }}
              >
                {antardashaTara.statusTag}
              </div>
            </div>
          )}

          {/* Pillar 3: Daily Transit Moon Tara */}
          <div
            className="p-4 rounded-xl flex flex-col justify-between"
            style={{
              background: "#FAF5EB",
              border: "1px solid rgba(184, 134, 11, 0.22)",
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-[#6B635B]">
                <span>🌙 आज का गोचर तारा</span>
                <span
                  className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                  style={{
                    background:
                      dailyTransitMoon.category === "favourable"
                        ? "rgba(15, 107, 54, 0.12)"
                        : dailyTransitMoon.category === "caution"
                        ? "rgba(201, 85, 95, 0.12)"
                        : "rgba(184, 134, 11, 0.12)",
                    color:
                      dailyTransitMoon.category === "favourable"
                        ? "#0F6B36"
                        : dailyTransitMoon.category === "caution"
                        ? "#9E2A36"
                        : "#8C6508",
                    border: `1px solid ${
                      dailyTransitMoon.category === "favourable"
                        ? "rgba(15, 107, 54, 0.25)"
                        : dailyTransitMoon.category === "caution"
                        ? "rgba(201, 85, 95, 0.25)"
                        : "rgba(184, 134, 11, 0.25)"
                    }`,
                  }}
                >
                  {dailyTransitMoon.category}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                Moon in {dailyTransitMoon.taraName}
              </h4>
              <p className="text-xs text-[#5C5248] mt-1">
                चंद्र नक्षत्र: {dailyTransitMoon.transitingMoonNakshatra}
              </p>
            </div>
            <div
              className="mt-3 text-xs font-bold pt-2 text-[#8C6508]"
              style={{ borderTop: "1px solid rgba(184, 134, 11, 0.15)" }}
            >
              Tara #{dailyTransitMoon.taraNumber} Frequency
            </div>
          </div>
        </div>

        {/* Triangulation Synthesis Banner */}
        <div
          className="p-4 sm:p-5 rounded-xl shadow-xs"
          style={{
            background: "#FFFDF5",
            border: "1px solid rgba(184, 134, 11, 0.3)",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">🔮</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                {triangulation.headline}
              </h4>
              <p className="text-xs sm:text-sm mt-1 text-[#3D3834] leading-relaxed">
                {triangulation.synthesisStory}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Focal Hotspot Highlight */}
      <div
        className="rounded-2xl p-4 sm:p-5 shadow-xs transition-all"
        style={{
          background: "#FFFDF5",
          border: "1px solid rgba(184, 134, 11, 0.35)",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">⚡</span>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
              {language === "hinglish"
                ? `सर्वाधिक सक्रिय केंद्र: भाव ${focalHouseNumber} (${focalHouseName})`
                : `Primary Focal Hotspot: House ${focalHouseNumber} (${focalHouseName})`}
            </h4>
            <p className="text-xs sm:text-sm mt-1 text-[#3D3834] leading-relaxed">
              {language === "hinglish"
                ? `इस भाव पर ग्रहों की दृष्टियों और गोचर का सर्वाधिक दबाव है। जीवन के इस क्षेत्र में आज व इस सप्ताह अप्रत्याशित निर्णय, वार्ताएं या महत्वपूर्ण घटनाक्रम सामने आ सकते हैं।`
                : `This house is receiving heavy planetary aspects and transit intersection. Decisions, negotiations, and shifts connected to this domain will carry disproportionate weight.`}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Strategic Guidance: 🛡️ Cautions vs 🚀 Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 🛡️ Defensive Cautions */}
        <div
          className="rounded-2xl p-5 sm:p-6 transition-all"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(201, 85, 95, 0.35)",
            boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.08)",
          }}
        >
          <div
            className="flex items-center gap-2.5 mb-3.5 pb-2.5"
            style={{ borderBottom: "1px solid rgba(201, 85, 95, 0.2)" }}
          >
            <span className="text-xl">🛡️</span>
            <h3 className="font-serif text-base font-bold" style={{ color: "#9E2A36" }}>
              {language === "hinglish"
                ? "कहाँ संभलना है (Defensive Cautions)"
                : "Where to Exercise Caution"}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {defensiveCautions.map((caution, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-[#3D3834]"
              >
                <span className="font-bold text-base leading-none mt-0.5" style={{ color: "#9E2A36" }}>
                  •
                </span>
                <span>{caution}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🚀 Offensive Opportunities */}
        <div
          className="rounded-2xl p-5 sm:p-6 transition-all"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(15, 107, 54, 0.35)",
            boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.08)",
          }}
        >
          <div
            className="flex items-center gap-2.5 mb-3.5 pb-2.5"
            style={{ borderBottom: "1px solid rgba(15, 107, 54, 0.2)" }}
          >
            <span className="text-xl">🚀</span>
            <h3 className="font-serif text-base font-bold" style={{ color: "#0F6B36" }}>
              {language === "hinglish"
                ? "कहाँ एक्शन लेना है (Action Opportunities)"
                : "Where to Take Decisive Action"}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {offensiveOpportunities.map((opp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-[#3D3834]"
              >
                <span className="font-bold text-base leading-none mt-0.5" style={{ color: "#0F6B36" }}>
                  •
                </span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. House-by-House Impacts */}
      <div
        className="rounded-2xl p-5 sm:p-6 transition-all"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(184, 134, 11, 0.28)",
          boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3"
          style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏛️</span>
            <h3
              className="font-serif text-base sm:text-lg font-bold"
              style={{ color: "#1A1A1A" }}
            >
              {language === "hinglish"
                ? "प्रभावित भावों का विश्लेषण (House Impacts)"
                : "Activated Houses Breakdown"}
            </h3>
          </div>
          {selectedHouse && (
            <button
              type="button"
              onClick={() => onSelectHouse(null)}
              className="text-xs font-bold underline hover:text-[#B8860B]"
              style={{ color: "#8C6508" }}
            >
              {language === "hinglish"
                ? "सभी भाव देखें (Show All Houses)"
                : "Show All Houses"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedImpacts.map((impact) => {
            const isTarget = selectedHouse === impact.house;
            return (
              <div
                key={`${impact.planet}-${impact.house}-${impact.roleTag}`}
                onClick={() => onSelectHouse(impact.house)}
                className="cursor-pointer p-4 rounded-xl transition-all"
                style={{
                  background: isTarget ? "#FFFDF5" : "#FAF7F2",
                  border: isTarget
                    ? "2px solid #B8860B"
                    : impact.isHotspot
                    ? "1px solid rgba(217, 119, 6, 0.4)"
                    : "1px solid rgba(184, 134, 11, 0.22)",
                  boxShadow: isTarget ? "0 2px 8px rgba(184, 134, 11, 0.15)" : "none",
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                    style={{
                      background: "#FAF5EB",
                      color: "#8C6508",
                      border: "1px solid rgba(184, 134, 11, 0.25)",
                    }}
                  >
                    {impact.roleTag}
                  </span>
                  {impact.isHotspot && (
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                      style={{
                        background: "#FFFDF5",
                        color: "#D97706",
                        border: "1px solid rgba(217, 119, 6, 0.35)",
                      }}
                    >
                      ⚡ Hotspot ({impact.hitsCount} Rays)
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] mb-1">
                  {impact.title}
                </h4>
                <p className="text-xs text-[#3D3834] leading-relaxed">
                  {impact.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Sattvic Upaya (Lifestyle Karma Alignment) */}
      <div
        className="rounded-2xl p-5 sm:p-6 transition-all"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(184, 134, 11, 0.28)",
          boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
        }}
      >
        <div
          className="flex items-center gap-2.5 mb-3.5 pb-2.5"
          style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
        >
          <span className="text-xl">🧘</span>
          <h3
            className="font-serif text-base sm:text-lg font-bold"
            style={{ color: "#1A1A1A" }}
          >
            {language === "hinglish"
              ? "सात्विक जीवनशैली उपाय (Lifestyle Karma Alignment)"
              : "Sattvic Upaya & Daily Karma Alignment"}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sattvicUpaya.map((upaya, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl text-xs sm:text-sm text-[#3D3834] leading-relaxed flex items-start gap-2.5"
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(184, 134, 11, 0.2)",
              }}
            >
              <span className="font-bold mt-0.5 text-[#B8860B]">✦</span>
              <span>{upaya}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
