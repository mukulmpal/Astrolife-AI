"use client";

import React, { useState } from "react";
import type {
  LifeProblemDomain,
  LifeProblemDossierReport,
} from "@/lib/astro-engine/navtara-problem-solver";
import {
  Sparkles,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  Droplets,
  Compass,
  ArrowRight,
  Star,
  Activity,
  Zap,
} from "lucide-react";

interface NavtaraProblemSolverDeckProps {
  report: LifeProblemDossierReport;
  tp: (n: string) => string;
}

export function NavtaraProblemSolverDeck({
  report,
  tp,
}: NavtaraProblemSolverDeckProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(
    report.problems[0]?.id ?? null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProblems =
    selectedCategory === "ALL"
      ? report.problems
      : report.problems.filter((p) => p.id === selectedCategory);

  const handleCopyRemedy = (problem: LifeProblemDomain) => {
    const text = `【AstroLife नवतारा उपाय · ${problem.titleHindi}】\n\n` +
      `कार्येश: ${problem.karyeshLord} (${problem.houseSign})\n` +
      `अतिमित्र नक्षत्र: ${problem.karyeshAtimitraStars.map((s) => s.name).join(", ")}\n` +
      `साझा ब्रिज स्टार: ${problem.dashaContext.bridgeStar.name} (${problem.dashaContext.bridgeStar.lord})\n` +
      `दशा स्थिति: ${problem.dashaContext.synergyTitleHindi}\n\n` +
      `सात्विक उपासना: ${problem.actionableRemedy.deityUpasana}\n` +
      `तत्व उपाय: ${problem.actionableRemedy.tattvaAction}\n` +
      `गोल्डन समय: ${problem.actionableRemedy.timingGuidance}\n` +
      `व्यावहारिक कदम: ${problem.actionableRemedy.practicalLifeStep}\n` +
      `निषेध/सावधानी: ${problem.actionableRemedy.prohibition}`;

    navigator.clipboard.writeText(text);
    setCopiedId(problem.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getToneStyle = (tone: LifeProblemDomain["statusTone"]) => {
    switch (tone) {
      case "green":
        return {
          badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
          cardBorder: "border-emerald-600/30",
          accentBg: "bg-emerald-50",
          accentText: "text-emerald-800",
        };
      case "gold":
        return {
          badgeBg: "bg-amber-500/10 text-amber-800 border-amber-500/30",
          cardBorder: "border-amber-600/30",
          accentBg: "bg-amber-50/70",
          accentText: "text-amber-900",
        };
      case "amber":
        return {
          badgeBg: "bg-orange-500/10 text-orange-800 border-orange-500/30",
          cardBorder: "border-orange-500/35",
          accentBg: "bg-orange-50/70",
          accentText: "text-orange-900",
        };
      case "rose":
      default:
        return {
          badgeBg: "bg-rose-500/10 text-rose-800 border-rose-500/30",
          cardBorder: "border-rose-500/35",
          accentBg: "bg-rose-50/70",
          accentText: "text-rose-900",
        };
    }
  };

  return (
    <section className="rounded-3xl border-2 border-amber-900/20 bg-gradient-to-b from-[#FFFDF8] to-[#FAF6EE] p-6 sm:p-8 shadow-md flex flex-col gap-6">
      {/* ── Header: Large & Prominent ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/15 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-widest font-black text-[#B8860B]">
              षट्-कार्य नवतारा इंटेलिजेंस · 6 Core Life Solvers
            </span>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-bold border border-amber-500/30">
              {report.summary.activeDashaLabel}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            जीवन की 6 मुख्य समस्याएं एवं अतिमित्र समाधान
          </h2>
          <p className="text-sm sm:text-base text-[#6B635B] mt-1.5 max-w-3xl leading-relaxed">
            प्रत्येक समस्या के कार्येश (Bhava Lord) की <strong>अतिमित्र तारा</strong> और वर्तमान महादशा-अंतर्दशा
            के तालमेल से जानिए सटीक भाग्योदय का समय और सात्विक उपचारात्मक कदम।
          </p>
        </div>

        {/* Quick Insight Pill */}
        <div className="flex items-center gap-3 bg-white/90 border border-amber-900/15 rounded-2xl p-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-700 shrink-0 font-bold text-lg">
            {report.summary.mostPromisingArea.icon}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#6B635B]">
              सर्वाधिक अनुकूल क्षेत्र
            </p>
            <p className="text-sm font-extrabold text-[#1A1A1A] line-clamp-1">
              {report.summary.mostPromisingArea.titleHindi}
            </p>
          </div>
        </div>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            selectedCategory === "ALL"
              ? "bg-[#B8860B] text-white shadow-sm"
              : "bg-white text-[#6B635B] hover:text-[#1A1A1A] border border-amber-900/10"
          }`}
        >
          समस्त 6 समस्याएं (All 6)
        </button>
        {report.problems.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedCategory(p.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === p.id
                ? "bg-[#B8860B] text-white shadow-sm"
                : "bg-white text-[#6B635B] hover:text-[#1A1A1A] border border-amber-900/10"
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.titleHindi.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* ── Cards Grid / Deck ── */}
      <div className="grid grid-cols-1 gap-5">
        {filteredProblems.map((problem) => {
          const isExpanded = expandedCardId === problem.id;
          const tone = getToneStyle(problem.statusTone);

          return (
            <div
              key={problem.id}
              className={`rounded-2xl border-2 transition-all bg-white shadow-sm hover:shadow-md ${
                isExpanded ? "border-[#B8860B] ring-2 ring-amber-500/15" : tone.cardBorder
              }`}
            >
              {/* Card Banner / Header Bar */}
              <div
                onClick={() =>
                  setExpandedCardId(isExpanded ? null : problem.id)
                }
                className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-amber-50/20 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-amber-50 border border-amber-900/10 shrink-0">
                    {problem.icon}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                        {problem.badge}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${tone.badgeBg}`}
                      >
                        {problem.dashaContext.synergyTitleHindi}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#1A1A1A] flex items-center gap-2">
                      <span>{problem.titleHindi}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B635B] mt-0.5">
                      {problem.subtitleHindi}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-900/10">
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-[#6B635B] font-bold">
                      दशा तालमेल
                    </p>
                    <p className="text-base sm:text-lg font-black text-[#1A1A1A]">
                      {problem.statusScore}%
                    </p>
                  </div>
                  <button
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isExpanded
                        ? "bg-[#B8860B] text-white"
                        : "bg-amber-100/70 text-amber-900 hover:bg-amber-200/70"
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Deep Intelligence Content */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-2 border-t border-amber-900/10 flex flex-col gap-6">
                  {/* Row 1: Karyesh & Dasha Context */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Karyesh Placement */}
                    <div className="rounded-2xl border border-amber-900/15 bg-[#FCFAF6] p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B] flex items-center gap-1.5">
                          <Compass className="w-4 h-4" /> कार्येश ग्रह स्थिति
                        </span>
                        <span className="text-xs font-bold text-[#1A1A1A] px-2 py-0.5 rounded bg-white border border-amber-900/15">
                          {tp(problem.karyeshLord)} ({problem.houseSign})
                        </span>
                      </div>
                      <p className="text-sm text-[#1A1A1A] font-semibold mt-1">
                        {problem.karyeshLord} {problem.karyeshPlacement.house}वें भाव में{" "}
                        <span className="text-[#B8860B]">
                          {problem.karyeshPlacement.nakshatra} नक्षत्र
                        </span>{" "}
                        (पद {problem.karyeshPlacement.pada}) में स्थित हैं।
                      </p>
                      <p className="text-xs text-[#6B635B]">
                        इस कार्य की सफलता की चाबी {problem.karyeshLord} के अतिमित्र नक्षत्रों में निहित है।
                      </p>
                    </div>

                    {/* Dasha Synergy Evaluation */}
                    <div className="rounded-2xl border border-amber-900/15 bg-[#FCFAF6] p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-bold text-[#B8860B] flex items-center gap-1.5">
                          <Activity className="w-4 h-4" /> अंतर्दशा तालमेल (Navtara Impact)
                        </span>
                        <span className="text-xs font-bold text-amber-900 px-2 py-0.5 rounded bg-amber-100/80">
                          {problem.dashaContext.activeAD} AD
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed mt-1">
                        {problem.dashaContext.synergyExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Karyesh Atimitra Stars (3 Paryayas) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#B8860B]" />
                        {problem.karyeshLord} के 3 अतिमित्र नक्षत्र (Atimitra Power Stars)
                      </h4>
                      <span className="text-xs text-[#6B635B]">
                        (9वीं, 18वीं एवं 27वीं तारा)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {problem.karyeshAtimitraStars.map((star, idx) => (
                        <div
                          key={star.id}
                          className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-white to-amber-50/40 p-4 flex flex-col gap-1.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-widest font-extrabold text-[#B8860B]">
                              {star.paryaya} पर्याय
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 font-bold">
                              #{star.id}
                            </span>
                          </div>
                          <p className="text-base font-extrabold text-[#1A1A1A]">
                            {star.name} नक्षत्र
                          </p>
                          <p className="text-xs text-[#6B635B]">
                            स्वामी: <strong>{star.lord}</strong> · देवता: {star.deity}
                          </p>
                          <p className="text-[11px] text-[#8C827A] mt-0.5 line-clamp-2">
                            {star.primaryQuality}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 3: Universal Bridge Star (Golden Highlight) */}
                  <div className="rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/15 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-3.5">
                      <span className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm mt-0.5 sm:mt-0">
                        <Zap className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-widest font-black text-amber-900">
                            यूनिवर्सल गोल्डन ब्रिज स्टार (Supreme Bridge)
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500 text-white font-extrabold">
                            {problem.dashaContext.bridgeStar.name} (#{problem.dashaContext.bridgeStar.id})
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#1A1A1A] mt-1">
                          {problem.dashaContext.bridgeStar.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Actionable Dynamic Remedies & Guidance */}
                  <div className="rounded-2xl border border-amber-900/15 bg-white p-5 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                      <h4 className="text-sm sm:text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#B8860B]" />
                        सात्विक नवतारा समाधान (Actionable Dynamic Steps)
                      </h4>
                      <button
                        onClick={() => handleCopyRemedy(problem)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-900/20 bg-amber-50/60 hover:bg-amber-100 text-amber-900 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedId === problem.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>कॉपी हो गया!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>उपाय कॉपी करें</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      {/* Left Column */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#B8860B] mt-2 shrink-0" />
                          <div>
                            <strong className="text-[#1A1A1A]">सात्विक उपासना: </strong>
                            <span className="text-[#4A443E]">
                              {problem.actionableRemedy.deityUpasana}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#B8860B] mt-2 shrink-0" />
                          <div>
                            <strong className="text-[#1A1A1A]">तत्व उपाय: </strong>
                            <span className="text-[#4A443E]">
                              {problem.actionableRemedy.tattvaAction}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#B8860B] mt-2 shrink-0" />
                          <div>
                            <strong className="text-[#1A1A1A]">गोल्डन समय: </strong>
                            <span className="text-[#4A443E]">
                              {problem.actionableRemedy.timingGuidance}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-emerald-900">व्यावहारिक कदम: </strong>
                            <span className="text-[#4A443E]">
                              {problem.actionableRemedy.practicalLifeStep}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200/60 rounded-xl p-3">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-rose-900">सावधानी व निषेध: </strong>
                            <span className="text-rose-800">
                              {problem.actionableRemedy.prohibition}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Golden Rule Footer Banner */}
                    <div className="rounded-xl bg-amber-50/70 border border-amber-900/10 p-3.5 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                      <Sparkles className="w-4 h-4 text-[#B8860B] shrink-0" />
                      <span>
                        <strong>गोल्डन रूल:</strong> {problem.goldenActionRule}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

