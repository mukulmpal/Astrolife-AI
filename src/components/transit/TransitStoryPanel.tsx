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
    <div className="w-full flex flex-col gap-6 text-[#1A140F] dark:text-[#FAF5EB]">
      {/* 1. Header Banner & Language Toggle */}
      <div className="bg-[#FFFDF9] dark:bg-[#141210] border-2 border-[#B8860B]/40 rounded-3xl p-5 sm:p-7 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#B8860B]/20 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <span className="text-xs font-black tracking-wider uppercase text-[#B8860B]">
              {language === "hinglish"
                ? "दैनिक गोचर एवं दशा-नवतारा कथा"
                : "Daily Transit, Dasha & Navatara Narrative"}
            </span>
          </div>

          {/* Hinglish / English Toggle */}
          <div className="flex items-center bg-[#EDE8DE] dark:bg-[#25221F] p-1 rounded-2xl border border-[#B8860B]/30 text-xs font-bold">
            <button
              type="button"
              onClick={() => onLanguageChange("hinglish")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                language === "hinglish"
                  ? "bg-amber-600 text-white font-black shadow-sm"
                  : "text-[#4A3E36] dark:text-[#CBC4B6] hover:text-[#1A140F]"
              }`}
            >
              Hinglish (सहज)
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("english")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                language === "english"
                  ? "bg-amber-600 text-white font-black shadow-sm"
                  : "text-[#4A3E36] dark:text-[#CBC4B6] hover:text-[#1A140F]"
              }`}
            >
              English (Classic)
            </button>
          </div>
        </div>

        {/* Chapter Title */}
        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A140F] dark:text-[#FAF5EB] leading-snug">
          {chapterTitle}
        </h2>

        {/* Active Dasha Chips */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#B8860B]/15 text-[#854D0E] dark:text-[#FDE68A] border-2 border-[#B8860B]/30">
            <span>👑 Mahadasha:</span>
            <strong>{activeMahadasha}</strong>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#B8860B]/15 text-[#854D0E] dark:text-[#FDE68A] border-2 border-[#B8860B]/30">
            <span>⏱️ Antardasha:</span>
            <strong>{activeAntardasha}</strong>
          </div>

          {isDashaLordActiveInTransit && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/25 text-amber-900 dark:text-amber-200 border-2 border-amber-500/50 animate-pulse">
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
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-[#1E1B17] border-l-4 border-amber-500 text-sm sm:text-base leading-relaxed text-[#2D241E] dark:text-[#F0EAE1] font-medium shadow-xs">
          {dashaGocharFusion}
        </div>
      </div>

      {/* 2. Enhanced Multi-Layer Navatara Intelligence (Mahadasha x Antardasha x Gochara) */}
      <div className="bg-[#FFFDFB] dark:bg-[#151311] border-2 border-blue-500/35 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-blue-500/20">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⭐</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950 dark:text-blue-100">
                {language === "hinglish"
                  ? "त्रि-स्तरीय नवतारा विश्लेषण (Dasha × Navatara Intelligence)"
                  : "Tri-Layer Dasha × Navatara Intelligence"}
              </h3>
              <p className="text-xs text-[#5C4F46] dark:text-[#C5BEB3] font-medium mt-0.5">
                {language === "hinglish"
                  ? `जन्म नक्षत्र (${dailyTransitMoon.birthNakshatra}) से महादशा, अंतर्दशा एवं दैनिक गोचर का समन्वय`
                  : `Tara evaluation from Birth Star (${dailyTransitMoon.birthNakshatra}) across MD, AD & Transit`}
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-black bg-blue-500/15 text-blue-800 dark:text-blue-200 border border-blue-500/30">
            Classical 9-Tara Audit
          </span>
        </div>

        {/* 3-Pillar Cards: Mahadasha Lord, Antardasha Lord, Today's Transit Moon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Pillar 1: Mahadasha Tara */}
          <div className="p-4 rounded-2xl border-2 border-[#B8860B]/30 bg-amber-50/50 dark:bg-[#1E1B18] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs text-[#70645B] dark:text-[#BDB6AA] font-bold mb-1.5">
                <span>👑 महादशा तारा</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-black uppercase text-[10px] ${
                    mahadashaTara.category === "favourable"
                      ? "bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40"
                      : mahadashaTara.category === "caution"
                      ? "bg-rose-500/25 text-rose-800 dark:text-rose-200 border border-rose-500/40"
                      : "bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-500/40"
                  }`}
                >
                  {mahadashaTara.category}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-[#1F1914] dark:text-[#FAF5EB]">
                {mahadashaTara.lord} · {mahadashaTara.taraName}
              </h4>
              <p className="text-xs text-[#4A3E36] dark:text-[#D5CDBF] font-medium mt-1">
                नक्षत्र: {mahadashaTara.nakshatraName} (तारा #{mahadashaTara.taraNumber})
              </p>
            </div>
            <div className="mt-3 text-xs font-black text-[#92400E] dark:text-[#FDE68A] pt-2 border-t border-[#B8860B]/20">
              {mahadashaTara.statusTag}
            </div>
          </div>

          {/* Pillar 2: Antardasha Tara */}
          {antardashaTara && (
            <div className="p-4 rounded-2xl border-2 border-[#B8860B]/30 bg-amber-50/50 dark:bg-[#1E1B18] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between text-xs text-[#70645B] dark:text-[#BDB6AA] font-bold mb-1.5">
                  <span>⏱️ अंतर्दशा तारा</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-black uppercase text-[10px] ${
                      antardashaTara.category === "favourable"
                        ? "bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40"
                        : antardashaTara.category === "caution"
                        ? "bg-rose-500/25 text-rose-800 dark:text-rose-200 border border-rose-500/40"
                        : "bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-500/40"
                    }`}
                  >
                    {antardashaTara.category}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-[#1F1914] dark:text-[#FAF5EB]">
                  {antardashaTara.lord} · {antardashaTara.taraName}
                </h4>
                <p className="text-xs text-[#4A3E36] dark:text-[#D5CDBF] font-medium mt-1">
                  नक्षत्र: {antardashaTara.nakshatraName} (तारा #{antardashaTara.taraNumber})
                </p>
              </div>
              <div className="mt-3 text-xs font-black text-[#92400E] dark:text-[#FDE68A] pt-2 border-t border-[#B8860B]/20">
                {antardashaTara.statusTag}
              </div>
            </div>
          )}

          {/* Pillar 3: Daily Transit Moon Tara */}
          <div className="p-4 rounded-2xl border-2 border-blue-500/30 bg-blue-50/50 dark:bg-[#12161E] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 font-bold mb-1.5">
                <span>🌙 आज का गोचर तारा</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-black uppercase text-[10px] ${
                    dailyTransitMoon.category === "favourable"
                      ? "bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40"
                      : dailyTransitMoon.category === "caution"
                      ? "bg-rose-500/25 text-rose-800 dark:text-rose-200 border border-rose-500/40"
                      : "bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-500/40"
                  }`}
                >
                  {dailyTransitMoon.category}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-blue-950 dark:text-blue-100">
                Moon in {dailyTransitMoon.taraName}
              </h4>
              <p className="text-xs text-[#4A3E36] dark:text-[#D5CDBF] font-medium mt-1">
                चंद्र नक्षत्र: {dailyTransitMoon.transitingMoonNakshatra}
              </p>
            </div>
            <div className="mt-3 text-xs font-black text-blue-800 dark:text-blue-300 pt-2 border-t border-blue-500/20">
              Tara #{dailyTransitMoon.taraNumber} Frequency
            </div>
          </div>
        </div>

        {/* Triangulation Synthesis Banner - High Contrast */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-blue-500/15 dark:from-blue-950/60 dark:to-indigo-950/50 border-2 border-blue-500/35 shadow-xs">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🔮</span>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-blue-950 dark:text-blue-100">
                {triangulation.headline}
              </h4>
              <p className="text-xs sm:text-sm mt-1.5 text-[#241E19] dark:text-[#EAE5DC] leading-relaxed font-medium">
                {triangulation.synthesisStory}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Focal Hotspot Highlight */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 dark:from-amber-950/50 dark:to-amber-900/40 border-2 border-amber-500/40 rounded-3xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <span className="text-3xl mt-0.5">⚡</span>
          <div>
            <h4 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-200">
              {language === "hinglish"
                ? `सर्वाधिक सक्रिय केंद्र: भाव ${focalHouseNumber} (${focalHouseName})`
                : `Primary Focal Hotspot: House ${focalHouseNumber} (${focalHouseName})`}
            </h4>
            <p className="text-xs sm:text-sm mt-1.5 text-amber-950/90 dark:text-amber-200/90 leading-relaxed font-medium">
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
        <div className="bg-[#FFFDFB] dark:bg-[#161413] border-2 border-rose-500/35 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-rose-500/20">
            <span className="text-xl">🛡️</span>
            <h3 className="text-base font-extrabold text-rose-900 dark:text-rose-200">
              {language === "hinglish"
                ? "कहाँ संभलना है (Defensive Cautions)"
                : "Where to Exercise Caution"}
            </h3>
          </div>
          <ul className="space-y-3">
            {defensiveCautions.map((caution, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-[#2B231D] dark:text-[#E8E2D6] font-medium"
              >
                <span className="text-rose-600 dark:text-rose-400 font-black text-base leading-none mt-0.5">•</span>
                <span>{caution}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🚀 Offensive Opportunities */}
        <div className="bg-[#FFFDFB] dark:bg-[#161413] border-2 border-emerald-500/35 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-emerald-500/20">
            <span className="text-xl">🚀</span>
            <h3 className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">
              {language === "hinglish"
                ? "कहाँ एक्शन लेना है (Action Opportunities)"
                : "Where to Take Decisive Action"}
            </h3>
          </div>
          <ul className="space-y-3">
            {offensiveOpportunities.map((opp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-[#2B231D] dark:text-[#E8E2D6] font-medium"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-base leading-none mt-0.5">•</span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. House-by-House Impacts */}
      <div className="bg-[#FAF7F2] dark:bg-[#141210] border-2 border-[#B8860B]/30 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b-2 border-[#B8860B]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏛️</span>
            <h3 className="text-base sm:text-lg font-serif font-black text-[#1F1914] dark:text-[#FAF5EB]">
              {language === "hinglish"
                ? "प्रभावित भावों का विश्लेषण (House Impacts)"
                : "Activated Houses Breakdown"}
            </h3>
          </div>
          {selectedHouse && (
            <button
              type="button"
              onClick={() => onSelectHouse(null)}
              className="text-xs text-amber-800 dark:text-amber-300 font-extrabold underline hover:text-amber-600"
            >
              {language === "hinglish"
                ? "सभी भाव देखें (Show All Houses)"
                : "Show All Houses"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedImpacts.map((impact) => {
            const isTarget = selectedHouse === impact.house;
            return (
              <div
                key={`${impact.planet}-${impact.house}-${impact.roleTag}`}
                onClick={() => onSelectHouse(impact.house)}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                  isTarget
                    ? "border-amber-500 bg-amber-500/15 shadow-md scale-[1.01]"
                    : impact.isHotspot
                    ? "border-amber-500/50 bg-amber-500/10 hover:border-amber-500"
                    : "border-[#B8860B]/25 bg-white dark:bg-[#1C1A18] hover:border-[#B8860B]/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#B8860B]/20 text-[#854D0E] dark:text-amber-200">
                    {impact.roleTag}
                  </span>
                  {impact.isHotspot && (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/40">
                      ⚡ Hotspot ({impact.hitsCount} Rays)
                    </span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#1F1914] dark:text-[#FAF5EB] mb-1.5">
                  {impact.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#382F28] dark:text-[#DDD6CC] leading-relaxed font-medium">
                  {impact.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Sattvic Upaya (Lifestyle Karma Alignment) */}
      <div className="bg-[#FFFDF9] dark:bg-[#151311] border-2 border-[#B8860B]/40 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-[#B8860B]/20">
          <span className="text-2xl">🧘</span>
          <h3 className="text-base sm:text-lg font-bold text-[#1F1914] dark:text-[#FAF5EB]">
            {language === "hinglish"
              ? "सात्विक जीवनशैली उपाय (Lifestyle Karma Alignment)"
              : "Sattvic Upaya & Daily Karma Alignment"}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {sattvicUpaya.map((upaya, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1C1A] border-2 border-[#B8860B]/25 text-xs sm:text-sm text-[#2D241E] dark:text-[#DDD6CB] leading-relaxed font-medium flex items-start gap-2.5 shadow-xs"
            >
              <span className="text-amber-600 dark:text-amber-400 font-black mt-0.5">✦</span>
              <span>{upaya}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
