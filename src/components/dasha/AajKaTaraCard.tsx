"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { ChartData } from "@/lib/astro-engine/calculations";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import {
  CLASSICAL_TARAS,
  calculateCountedPosition,
  calculateTaraNumber,
  getParyayaByPosition,
  getPlanetLon,
} from "@/lib/astro-engine/navtara-engine";
import { resolveNakshatraCoordinate } from "@/lib/astro-engine/ayanamsa-config";
import { getNakshatraByName } from "@/lib/astro-engine/nakshatra-data";
import { Sparkles, Compass, Share2, Check, ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";

interface AajKaTaraCardProps {
  chart?: ChartData | null;
  compact?: boolean;
}

export function AajKaTaraCard({ chart, compact = false }: AajKaTaraCardProps) {
  const [copied, setCopied] = useState(false);

  const dailyTaraInfo = useMemo(() => {
    if (!chart || !chart.planets?.Moon) return null;

    const tz = typeof chart.tz === "number" ? chart.tz : 5.5;
    const now = new Date();
    const panchang = calculatePanchang(now, tz, { lat: chart.lat, lon: chart.lon });

    // 1. Native's Janma Star from Natal Moon
    const moonLon = getPlanetLon(chart.planets.Moon);
    const birthCoord = resolveNakshatraCoordinate(moonLon, chart.jd, "Lahiri_Chitrapaksha");
    const birthNak = birthCoord.nakshatra;

    // 2. Today's Moon Nakshatra from Panchang
    const todayNak = getNakshatraByName(panchang.nakshatra) ?? birthNak;

    // 3. Counted Position & Tara Number
    const countedPos = calculateCountedPosition(birthNak.id, todayNak.id);
    const taraNum = calculateTaraNumber(birthNak.id, todayNak.id);
    const tara = CLASSICAL_TARAS[taraNum];
    const { paryaya, paryayaIntensity } = getParyayaByPosition(countedPos);

    const isConcern = [3, 5, 7].includes(taraNum);
    const isBirth = countedPos === 1;
    const isSupport27 = countedPos === 27;

    return {
      panchang,
      birthNak,
      todayNak,
      countedPos,
      taraNum,
      tara,
      paryaya,
      paryayaIntensity,
      isConcern,
      isBirth,
      isSupport27,
    };
  }, [chart]);

  if (!dailyTaraInfo) return null;

  const {
    panchang,
    birthNak,
    todayNak,
    countedPos,
    taraNum,
    tara,
    paryaya,
    paryayaIntensity,
    isConcern,
    isBirth,
    isSupport27,
  } = dailyTaraInfo;

  // Best For and Avoid bullets based on classical Tara
  const taraActionMap: Record<number, { bestFor: string; avoid: string }> = {
    1: {
      bestFor: "Self-care, personal rejuvenation, routine health work, grounded planning.",
      avoid: "Exhausting physical strain, over-extending commitments, heavy travel.",
    },
    2: {
      bestFor: "Financial investments, deal signatures, capital purchases, wealth growth.",
      avoid: "Hesitation on lucrative opportunities, giving loans carelessly.",
    },
    3: {
      bestFor: "Contemplative research, internal preparation, quiet spiritual meditation.",
      avoid: "Risky adventures, irreversible agreements, major travel, high-friction debates.",
    },
    4: {
      bestFor: "Consolidating foundations, home harmony, settling disputes, restorative wellness.",
      avoid: "Rushing timelines, hasty disruptions of steady routines.",
    },
    5: {
      bestFor: "Diplomatic tact, boundary enforcement, defensive posture, inner patience.",
      avoid: "Direct confrontation, legal aggression, ego battles, signing contentious contracts.",
    },
    6: {
      bestFor: "Important execution, milestone work, presentations, exams, closing key objectives.",
      avoid: "Procrastination, trivial social distractions during peak productive windows.",
    },
    7: {
      bestFor: "Spiritual introspection, completing closures, defensive grounding, remedial prayers.",
      avoid: "New long-term starts, speculation, aggressive travel, major surgery/risk if avoidable.",
    },
    8: {
      bestFor: "Collaborative meetings, seeking mentorship, forging alliances, social goodwill.",
      avoid: "Isolation, holding grudges, breaking promises to companions.",
    },
    9: {
      bestFor: "Sacred milestones, launching crowning initiatives, high-stakes breakthroughs.",
      avoid: "Wasting this highly auspicious peak frequency window.",
    },
  };

  const actions = taraActionMap[taraNum] ?? {
    bestFor: tara.signification,
    avoid: "Impulsive reactions without contemplation.",
  };

  const shareText = `✦ AstroLife Aaj Ka Tara ✦
Daily Moon: ${todayNak.name} (${panchang.nakshatraLord})
My Birth Star: ${birthNak.name}
Today's Navtara: ${tara.name} (Tara #${taraNum})
Nature: ${isConcern ? "Caution & Defensive Pacing" : "Auspicious & Supportive"}
Cycle: ${paryaya} Paryaya (Position #${countedPos})
Best For: ${actions.bestFor}
Avoid: ${actions.avoid}
Check your chart at https://astrolife-ai.vercel.app/dashboard/dasha`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div
      className={`rounded-3xl border transition-all p-5 shadow-sm relative overflow-hidden ${
        isConcern
          ? "bg-gradient-to-br from-red-50/50 via-white to-amber-50/30 border-red-500/25"
          : isBirth
          ? "bg-gradient-to-br from-amber-50/60 via-white to-yellow-50/30 border-amber-500/30"
          : "bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/30 border-emerald-500/25"
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{tara.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">
                Daily Astro Hook · Aaj Ka Tara
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isConcern
                    ? "bg-red-500/15 text-red-700"
                    : isBirth
                    ? "bg-amber-500/15 text-amber-700"
                    : "bg-emerald-500/15 text-emerald-700"
                }`}
              >
                {tara.category.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mt-0.5 flex items-center gap-2">
              <span>{tara.name} Tara #{taraNum}</span>
              <span className="text-xs font-semibold text-[#6B635B]">
                ({tara.sanskritName})
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-amber-900/15 text-[#4A4238] hover:text-[#1A1A1A] hover:bg-white transition-all shadow-sm"
            title="Share via WhatsApp or copy advice"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Share</span>
              </>
            )}
          </button>

          <Link
            href="/dashboard/dasha"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#B8860B] text-white hover:bg-[#996D09] transition-all shadow-sm"
          >
            <span>Full Chakra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Daily Alignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
        {/* Transit Moon Star vs Birth Star */}
        <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-amber-900/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#6B635B]">Today&apos;s Alignment</span>
          <div className="my-1">
            <p className="text-xs text-[#6B635B]">
              Today&apos;s Star: <strong className="text-[#1A1A1A]">{todayNak.name}</strong> ({todayNak.lord})
            </p>
            <p className="text-xs text-[#6B635B] mt-0.5">
              Your Janma: <strong className="text-[#1A1A1A]">{birthNak.name}</strong> ({birthNak.lord})
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#B8860B]">
            Pos #{countedPos} of 27 · {paryaya} ({paryayaIntensity})
          </span>
        </div>

        {/* Best For */}
        <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] uppercase font-bold tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Best For Today</span>
          </div>
          <p className="text-xs text-[#064E3B] font-medium leading-relaxed my-1">
            {actions.bestFor}
          </p>
          <span className="text-[10px] text-emerald-700 italic">
            Maximize fruitful flow
          </span>
        </div>

        {/* Avoid / Caution */}
        <div
          className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isConcern
              ? "bg-red-500/10 border-red-500/25"
              : "bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider ${
              isConcern ? "text-red-800" : "text-amber-800"
            }`}
          >
            <ShieldAlert
              className={`w-3.5 h-3.5 ${isConcern ? "text-red-600" : "text-amber-600"}`}
            />
            <span>Exercise Caution</span>
          </div>
          <p
            className={`text-xs font-medium leading-relaxed my-1 ${
              isConcern ? "text-red-950 font-semibold" : "text-amber-950"
            }`}
          >
            {actions.avoid}
          </p>
          <span className="text-[10px] text-[#6B635B] italic">
            Guard against friction
          </span>
        </div>
      </div>

      {/* Practical Advice Bottom */}
      <p className="text-xs text-[#6B635B] italic">
        ✦ <strong>Classical Rule:</strong> {tara.practicalAdvice}
      </p>
    </div>
  );
}
