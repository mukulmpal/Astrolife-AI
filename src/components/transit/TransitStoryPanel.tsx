"use client";

import React, { useState } from "react";
import type { ChapterNarrative } from "@/lib/astro-engine/transit-ripple/types";
import type { RichChapterNarrative } from "@/lib/astro-engine/transit-ripple/adapter";

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
  const [showShastraProof, setShowShastraProof] = useState<boolean>(false);

  // Cast safely to access rich fields
  const rich = narrative as unknown as RichChapterNarrative;

  const {
    chapterTitle,
    dashaGocharFusion,
    activeMahadasha,
    activeAntardasha,
    isDashaLordActiveInTransit,
    focalHouseNumber,
    houseImpacts,
    defensiveCautions,
    offensiveOpportunities,
    navataraIntelligence,
    sattvicUpaya,
  } = narrative;

  const todayPulse = rich.todayPulse;
  const focalHotspotStory = rich.focalHotspotStory;
  const domainCautions = rich.domainCautions;
  const domainActions = rich.domainActions;
  const shastraProof = rich.shastraProof;

  const { dailyTransitMoon } = navataraIntelligence;

  // Filter house impacts if user clicked a specific house
  const displayedImpacts = selectedHouse
    ? houseImpacts.filter((imp) => imp.house === selectedHouse)
    : houseImpacts;

  // Split narrative into paragraphs for clean editorial rendering
  const storyParagraphs = (dashaGocharFusion || "")
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="w-full flex flex-col gap-6 text-[#1A1A1A] font-sans">
      {/* 1. Header Banner, Today's Pulse & Language Toggle */}
      <div
        className="rounded-2xl p-5 sm:p-7 transition-all flex flex-col gap-4"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(184, 134, 11, 0.28)",
          boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
        }}
      >
        {/* Top Bar with Language Switcher */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 pb-3"
          style={{ borderBottom: "1px solid rgba(184, 134, 11, 0.2)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <span
              className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider"
              style={{ color: "#8C6508" }}
            >
              {language === "hinglish"
                ? "दैनिक गोचर एवं जीवन मार्गदर्शन"
                : "Daily Transit & Life Counsel"}
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

        {/* Triple Clock Visual Indicator Ribbon: Today's Pulse */}
        {todayPulse && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl shadow-xs"
            style={{
              background: "#FFFDF5",
              border: "1px solid rgba(184, 134, 11, 0.3)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌅</span>
              <div>
                <div className="text-xs font-bold text-[#1A1A1A]">
                  {todayPulse.scanDate} · {todayPulse.taraName} Tara (🌙 {todayPulse.moonNakshatra})
                </div>
                <div className="text-[11px] text-[#8C6508] font-semibold mt-0.5">
                  {todayPulse.headline}
                </div>
              </div>
            </div>
            <span
              className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded"
              style={{
                background: "#FAF5EB",
                color: "#8C6508",
                border: "1px solid rgba(184, 134, 11, 0.25)",
              }}
            >
              {todayPulse.seasonTag}
            </span>
          </div>
        )}

        {/* Chapter Title */}
        <h2
          className="font-serif text-xl sm:text-2xl font-bold leading-snug"
          style={{ color: "#1A1A1A" }}
        >
          {chapterTitle}
        </h2>

        {/* Active Dasha Chips */}
        <div className="flex flex-wrap items-center gap-2.5">
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

        {/* Dasha x Gochar Fusion Story in Descriptive Paragraphs */}
        <div
          className="p-4 sm:p-5 rounded-xl text-xs sm:text-sm leading-relaxed space-y-3"
          style={{
            background: "#FFFDF5",
            border: "1px solid rgba(184, 134, 11, 0.22)",
            borderLeft: "4px solid #B8860B",
            color: "#3D3834",
          }}
        >
          <div className="font-semibold text-[#1A1A1A]">
            {language === "hinglish"
              ? "✦ आपका वर्तमान अध्याय (Life Phase Counsel)"
              : "✦ Your Current Life Chapter"}
          </div>
          {storyParagraphs.map((para, pIdx) => (
            <p key={pIdx} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* 2. Primary Focal Hotspot (Dynamic & Deeply Explaining the House) */}
      <div
        className="rounded-2xl p-5 sm:p-6 transition-all"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(184, 134, 11, 0.32)",
          boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.12)",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">⚡</span>
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                {focalHotspotStory?.title || `Focal Hotspot: House ${focalHouseNumber}`}
              </h4>
              <span
                className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                style={{
                  background: "#FAF5EB",
                  color: "#8C6508",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                }}
              >
                House #{focalHouseNumber}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3D3834] leading-relaxed">
              {focalHotspotStory?.paragraph}
            </p>
            {focalHotspotStory?.whyItMatters && (
              <div
                className="mt-2.5 pt-2 text-[11px] sm:text-xs font-medium text-[#8C6508]"
                style={{ borderTop: "1px solid rgba(184, 134, 11, 0.15)" }}
              >
                <strong>✦ {language === "hinglish" ? "यह क्यों महत्वपूर्ण है:" : "Why this matters:"}</strong>{" "}
                {focalHotspotStory.whyItMatters}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. 5-Domain Strategic Guidance: 🛡️ Cautions vs 🚀 Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 🛡️ Defensive Cautions (Domain-Specific Paragraphs) */}
        <div
          className="rounded-2xl p-5 sm:p-6 transition-all flex flex-col gap-3.5"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(201, 85, 95, 0.35)",
            boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.08)",
          }}
        >
          <div
            className="flex items-center gap-2.5 pb-2.5"
            style={{ borderBottom: "1px solid rgba(201, 85, 95, 0.2)" }}
          >
            <span className="text-xl">🛡️</span>
            <h3 className="font-serif text-base font-bold" style={{ color: "#9E2A36" }}>
              {language === "hinglish"
                ? "कहाँ संभलना है (Where to Exercise Caution)"
                : "Where to Exercise Caution"}
            </h3>
          </div>

          <div className="space-y-3">
            {domainCautions && domainCautions.length > 0
              ? domainCautions.map((dc) => (
                  <div
                    key={dc.domain}
                    className="p-3 rounded-xl text-xs sm:text-sm leading-relaxed"
                    style={{
                      background: "#FAF7F2",
                      border: "1px solid rgba(201, 85, 95, 0.2)",
                    }}
                  >
                    <div className="font-bold text-[#9E2A36] mb-1 flex items-center gap-1.5">
                      <span>{dc.icon}</span>
                      <span>{dc.domainName}</span>
                    </div>
                    <p className="text-[#3D3834]">{dc.paragraph}</p>
                  </div>
                ))
              : defensiveCautions.map((caution, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl text-xs sm:text-sm leading-relaxed"
                    style={{
                      background: "#FAF7F2",
                      border: "1px solid rgba(201, 85, 95, 0.2)",
                    }}
                  >
                    <p className="text-[#3D3834]">{caution}</p>
                  </div>
                ))}
          </div>
        </div>

        {/* 🚀 Offensive Opportunities (Domain-Specific Action Steps) */}
        <div
          className="rounded-2xl p-5 sm:p-6 transition-all flex flex-col gap-3.5"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(15, 107, 54, 0.35)",
            boxShadow: "0 4px 20px -4px rgba(184, 134, 11, 0.08)",
          }}
        >
          <div
            className="flex items-center gap-2.5 pb-2.5"
            style={{ borderBottom: "1px solid rgba(15, 107, 54, 0.2)" }}
          >
            <span className="text-xl">🚀</span>
            <h3 className="font-serif text-base font-bold" style={{ color: "#0F6B36" }}>
              {language === "hinglish"
                ? "कहाँ एक्शन लेना है (Action Opportunities)"
                : "Where to Take Decisive Action"}
            </h3>
          </div>

          <div className="space-y-3">
            {domainActions && domainActions.length > 0
              ? domainActions.map((da) => (
                  <div
                    key={da.domain}
                    className="p-3 rounded-xl text-xs sm:text-sm leading-relaxed"
                    style={{
                      background: "#FAF7F2",
                      border: "1px solid rgba(15, 107, 54, 0.2)",
                    }}
                  >
                    <div className="font-bold text-[#0F6B36] mb-1 flex items-center gap-1.5">
                      <span>{da.icon}</span>
                      <span>{da.domainName}</span>
                    </div>
                    <p className="text-[#3D3834]">{da.paragraph}</p>
                  </div>
                ))
              : offensiveOpportunities.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl text-xs sm:text-sm leading-relaxed"
                    style={{
                      background: "#FAF7F2",
                      border: "1px solid rgba(15, 107, 54, 0.2)",
                    }}
                  >
                    <p className="text-[#3D3834]">{opp}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* 4. House-by-House Impacts */}
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
                ? "प्रभावित भावों का विश्लेषण (Activated Houses)"
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

      {/* 5. Planet × House Specific Sattvic Upaya */}
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

      {/* 6. Technical Transparency: Shastra Proof Accordion (Behind the Scenes Calculations) */}
      {shastraProof && (
        <div
          className="rounded-2xl p-4 sm:p-5 transition-all"
          style={{
            background: "#FAF7F2",
            border: "1px solid rgba(184, 134, 11, 0.25)",
          }}
        >
          <button
            type="button"
            onClick={() => setShowShastraProof(!showShastraProof)}
            className="w-full flex items-center justify-between text-xs font-bold transition-all text-[#8C6508]"
          >
            <span className="flex items-center gap-2">
              <span>👁️</span>
              <span>
                {language === "hinglish"
                  ? "शास्त्रीय गणना एवं प्रामाणिकता (Shastra Proof & Calculation)"
                  : "Vedic Mathematical Proof & Calculation Trail"}
              </span>
            </span>
            <span className="text-sm font-mono">{showShastraProof ? "▲ Hide" : "▼ Expand"}</span>
          </button>

          {showShastraProof && (
            <div
              className="mt-3.5 pt-3 space-y-2 text-xs font-mono text-[#5C5248]"
              style={{ borderTop: "1px solid rgba(184, 134, 11, 0.15)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span>Direct Epicenter:</span>
                <span className="font-bold text-[#1A1A1A]">
                  {shastraProof.epicenter.planet} in House {shastraProof.epicenter.house} (
                  {shastraProof.epicenter.signName} at {shastraProof.epicenter.degrees.toFixed(2)}°)
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span>Active Dasha Cycle:</span>
                <span className="font-bold text-[#1A1A1A]">
                  Mahadasha {shastraProof.activeMahadasha} × Antardasha {shastraProof.activeAntardasha}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span>Aspect Target Vectors:</span>
                <span className="font-bold text-[#1A1A1A]">
                  {shastraProof.aspectRays.map((r) => `H${r.targetHouse} (${r.rule})`).join(", ")}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span>Navatara Vector:</span>
                <span className="font-bold text-[#1A1A1A]">
                  {shastraProof.navataraCalculation}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Responsible Life Guidance Disclaimer */}
      <div
        className="rounded-xl p-3.5 text-[11px] text-[#6B635B] leading-relaxed text-center"
        style={{
          background: "#FAF5EB",
          border: "1px solid rgba(184, 134, 11, 0.2)",
        }}
      >
        ✦{" "}
        {language === "hinglish"
          ? "यह विश्लेषण आपकी जन्म कुंडली और वर्तमान ग्रह-स्थितियों पर आधारित मानसिक और आचरण-संबंधी मार्गदर्शन है। यह कोई निश्चित भविष्यवाणी नहीं है। जीवन के अहम फैसले हमेशा अपने विवेक और वास्तविक परिस्थितियों के अनुसार लें।"
          : "This briefing provides reflective behavioral and strategic guidance based on your natal chart and planetary positions. It is not deterministic fortune-telling. Exercise grounded personal discernment in all major life decisions."}
      </div>
    </div>
  );
}
