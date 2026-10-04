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
    <div className="w-full flex flex-col gap-6 text-[#2D241E] dark:text-[#EAE5DC]">
      {/* 1. Header Banner & Language Toggle */}
      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF5EB] dark:from-[#181614] dark:to-[#131211] border border-[#B8860B]/30 rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8860B]/15 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#B8860B]">
              {language === "hinglish"
                ? "दैनिक गोचर एवं दशा-नवतारा कथा"
                : "Daily Transit, Dasha & Navatara Narrative"}
            </span>
          </div>

          {/* Hinglish / English Toggle */}
          <div className="flex items-center bg-[#EDE8DE] dark:bg-[#25221F] p-1 rounded-xl border border-[#B8860B]/20 text-xs font-medium">
            <button
              type="button"
              onClick={() => onLanguageChange("hinglish")}
              className={`px-3 py-1 rounded-lg transition-all ${
                language === "hinglish"
                  ? "bg-amber-600 text-white font-bold shadow-sm"
                  : "text-[#6B635B] dark:text-[#A8A29E] hover:text-[#2D241E]"
              }`}
            >
              Hinglish (सहज)
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("english")}
              className={`px-3 py-1 rounded-lg transition-all ${
                language === "english"
                  ? "bg-amber-600 text-white font-bold shadow-sm"
                  : "text-[#6B635B] dark:text-[#A8A29E] hover:text-[#2D241E]"
              }`}
            >
              English (Classic)
            </button>
          </div>
        </div>

        {/* Chapter Title */}
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D241E] dark:text-[#F7F2E8] leading-snug">
          {chapterTitle}
        </h2>

        {/* Active Dasha Chips */}
        <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B8860B]/12 text-[#996515] dark:text-[#F3D59B] border border-[#B8860B]/25">
            <span>👑 Mahadasha:</span>
            <strong>{activeMahadasha}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B8860B]/12 text-[#996515] dark:text-[#F3D59B] border border-[#B8860B]/25">
            <span>⏱️ Antardasha:</span>
            <strong>{activeAntardasha}</strong>
          </div>

          {isDashaLordActiveInTransit && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 animate-pulse">
              <span>
                🔥{" "}
                {language === "hinglish"
                  ? "सक्रिय दशा स्वामी (3x तीव्रता)"
                  : "Active Dasha Lord (3x Manifestation)"}
              </span>
            </div>
          )}
        </div>

        {/* Dasha x Gochar Fusion Story */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border-l-4 border-amber-500 text-sm sm:text-base leading-relaxed text-[#4A3E36] dark:text-[#D5CDBF]">
          {dashaGocharFusion}
        </div>
      </div>

      {/* 2. Enhanced Multi-Layer Navatara Intelligence (Mahadasha x Antardasha x Gochara) */}
      <div className="bg-[#FFFDFB] dark:bg-[#161413] border border-blue-500/25 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-500/15">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⭐</span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-200">
                {language === "hinglish"
                  ? "त्रि-स्तरीय नवतारा विश्लेषण (Dasha × Navatara Intelligence)"
                  : "Tri-Layer Dasha × Navatara Intelligence"}
              </h3>
              <p className="text-xs text-[#70645B] dark:text-[#9B9288]">
                {language === "hinglish"
                  ? `जन्म नक्षत्र (${dailyTransitMoon.birthNakshatra}) से महादशा, अंतर्दशा एवं दैनिक गोचर का समन्वय`
                  : `Tara evaluation from Birth Star (${dailyTransitMoon.birthNakshatra}) across MD, AD & Transit`}
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
            Classical 9-Tara Audit
          </span>
        </div>

        {/* 3-Pillar Cards: Mahadasha Lord, Antardasha Lord, Today's Transit Moon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Pillar 1: Mahadasha Tara */}
          <div className="p-3.5 rounded-xl border border-[#B8860B]/20 bg-amber-50/30 dark:bg-[#1B1917] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#8C827A] mb-1">
                <span>👑 महादशा तारा</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                    mahadashaTara.category === "favourable"
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : mahadashaTara.category === "caution"
                      ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                      : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {mahadashaTara.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#2D241E] dark:text-[#F3EDE2]">
                {mahadashaTara.lord} · {mahadashaTara.taraName}
              </h4>
              <p className="text-[11px] text-[#6B635B] dark:text-[#A8A29E] mt-0.5">
                नक्षत्र: {mahadashaTara.nakshatraName} (तारा #{mahadashaTara.taraNumber})
              </p>
            </div>
            <div className="mt-2 text-xs font-semibold text-[#996515] dark:text-[#E2C785] pt-1.5 border-t border-[#B8860B]/15">
              {mahadashaTara.statusTag}
            </div>
          </div>

          {/* Pillar 2: Antardasha Tara */}
          {antardashaTara && (
            <div className="p-3.5 rounded-xl border border-[#B8860B]/20 bg-amber-50/30 dark:bg-[#1B1917] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8C827A] mb-1">
                  <span>⏱️ अंतर्दशा तारा</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                      antardashaTara.category === "favourable"
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : antardashaTara.category === "caution"
                        ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                        : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {antardashaTara.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#2D241E] dark:text-[#F3EDE2]">
                  {antardashaTara.lord} · {antardashaTara.taraName}
                </h4>
                <p className="text-[11px] text-[#6B635B] dark:text-[#A8A29E] mt-0.5">
                  नक्षत्र: {antardashaTara.nakshatraName} (तारा #{antardashaTara.taraNumber})
                </p>
              </div>
              <div className="mt-2 text-xs font-semibold text-[#996515] dark:text-[#E2C785] pt-1.5 border-t border-[#B8860B]/15">
                {antardashaTara.statusTag}
              </div>
            </div>
          )}

          {/* Pillar 3: Daily Transit Moon Tara */}
          <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-50/30 dark:bg-[#13171F] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-blue-600/80 mb-1">
                <span>🌙 आज का गोचर तारा</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                    dailyTransitMoon.category === "favourable"
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : dailyTransitMoon.category === "caution"
                      ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                      : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {dailyTransitMoon.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                Moon in {dailyTransitMoon.taraName}
              </h4>
              <p className="text-[11px] text-[#6B635B] dark:text-[#A8A29E] mt-0.5">
                चंद्र नक्षत्र: {dailyTransitMoon.transitingMoonNakshatra}
              </p>
            </div>
            <div className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300 pt-1.5 border-t border-blue-500/15">
              Tara #{dailyTransitMoon.taraNumber} Frequency
            </div>
          </div>
        </div>

        {/* Triangulation Synthesis Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-500/25">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">🔮</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-100">
                {triangulation.headline}
              </h4>
              <p className="text-xs sm:text-sm mt-1 text-[#3B3A36] dark:text-[#C5BFB4] leading-relaxed">
                {triangulation.synthesisStory}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Focal Hotspot Highlight */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 dark:from-amber-950/40 dark:to-amber-900/30 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">⚡</span>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200">
              {language === "hinglish"
                ? `सर्वाधिक सक्रिय केंद्र: भाव ${focalHouseNumber} (${focalHouseName})`
                : `Primary Focal Hotspot: House ${focalHouseNumber} (${focalHouseName})`}
            </h4>
            <p className="text-xs sm:text-sm mt-1 text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
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
        <div className="bg-[#FFFDFB] dark:bg-[#161413] border border-rose-500/25 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-rose-500/15">
            <span className="text-lg">🛡️</span>
            <h3 className="text-sm sm:text-base font-bold text-rose-800 dark:text-rose-300">
              {language === "hinglish"
                ? "कहाँ संभलना है (Defensive Cautions)"
                : "Where to Exercise Caution"}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {defensiveCautions.map((caution, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-[#5A4D45] dark:text-[#C5BEB3]"
              >
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>{caution}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🚀 Offensive Opportunities */}
        <div className="bg-[#FFFDFB] dark:bg-[#161413] border border-emerald-500/25 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-emerald-500/15">
            <span className="text-lg">🚀</span>
            <h3 className="text-sm sm:text-base font-bold text-emerald-800 dark:text-emerald-300">
              {language === "hinglish"
                ? "कहाँ एक्शन लेना है (Action Opportunities)"
                : "Where to Take Decisive Action"}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {offensiveOpportunities.map((opp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-[#5A4D45] dark:text-[#C5BEB3]"
              >
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. House-by-House Impacts */}
      <div className="bg-[#FAF7F2] dark:bg-[#141312] border border-[#B8860B]/20 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#B8860B]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D241E] dark:text-[#F3EDE2]">
              {language === "hinglish"
                ? "प्रभावित भावों का विश्लेषण (House Impacts)"
                : "Activated Houses Breakdown"}
            </h3>
          </div>
          {selectedHouse && (
            <button
              type="button"
              onClick={() => onSelectHouse(null)}
              className="text-xs text-amber-700 dark:text-amber-400 font-medium underline"
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
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isTarget
                    ? "border-amber-500 bg-amber-500/10 shadow-sm"
                    : impact.isHotspot
                    ? "border-amber-400/40 bg-amber-500/5 hover:border-amber-500/70"
                    : "border-[#B8860B]/20 bg-white/70 dark:bg-[#1C1A18] hover:border-[#B8860B]/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#B8860B]/15 text-[#996515] dark:text-amber-300">
                    {impact.roleTag}
                  </span>
                  {impact.isHotspot && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      ⚡ Hotspot ({impact.hitsCount} Rays)
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-[#2D241E] dark:text-[#F3EDE2] mb-1.5">
                  {impact.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#5C4F46] dark:text-[#BDB6AA] leading-relaxed">
                  {impact.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Sattvic Upaya (Lifestyle Karma Alignment) */}
      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#F5EFE3] dark:from-[#181614] dark:to-[#131110] border border-[#B8860B]/30 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#B8860B]/15">
          <span className="text-lg">🧘</span>
          <h3 className="text-sm sm:text-base font-bold text-[#2D241E] dark:text-[#F3EDE2]">
            {language === "hinglish"
              ? "सात्विक जीवनशैली उपाय (Lifestyle Karma Alignment)"
              : "Sattvic Upaya & Daily Karma Alignment"}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sattvicUpaya.map((upaya, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/80 dark:bg-[#1E1C1A] border border-[#B8860B]/20 text-xs sm:text-sm text-[#4A3E36] dark:text-[#CBC4B6] leading-relaxed flex items-start gap-2"
            >
              <span className="text-[#B8860B] font-bold mt-0.5">✦</span>
              <span>{upaya}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

