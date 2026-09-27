"use client";

import { useState, useEffect, useMemo } from "react";
import { calculatePanchang, type PanchangResult } from "@/lib/astro-engine/panchang";
import { useUserChart } from "@/lib/user-chart";

export interface DailyPanchangWidgetProps {
  compact?: boolean;
  className?: string;
}

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const NAVTARA_NAMES = [
  "Janma (Birth/Self)",
  "Sampat (Wealth/Prosperity)",
  "Vipat (Obstacle/Caution)",
  "Kshema (Well-being/Security)",
  "Pratyak (Friction/Careful)",
  "Sadhana (Success/Achievement)",
  "Naidhana (Danger/Strict Avoid)",
  "Mitra (Friendly/Supportive)",
  "Ati-Mitra (Best Friend/Extremely Auspicious)",
];

function isTimeBetween(nowStr: string, startStr: string, endStr: string): boolean {
  if (!startStr || !endStr) return false;
  return nowStr >= startStr && nowStr <= endStr;
}

export function DailyPanchangWidget({ compact = false, className = "" }: DailyPanchangWidgetProps) {
  const { chart } = useUserChart();
  const [panchang, setPanchang] = useState<PanchangResult | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [showDetails, setShowDetails] = useState(!compact);

  useEffect(() => {
    try {
      const now = new Date();
      const tz = 5.5; // Default Indian Standard Time or chart tz
      const location = chart ? { lat: chart.lat, lon: chart.lon } : { lat: 28.6139, lon: 77.209 };
      const res = calculatePanchang(now, tz, location);
      setPanchang(res);

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTimeStr(`${hours}:${minutes}`);
    } catch (err) {
      console.warn("Daily Panchang calculation failed:", err);
    }
  }, [chart]);

  // Compute Navtara if user chart has Moon nakshatra
  const navtaraInsight = useMemo(() => {
    if (!chart?.planets?.Moon?.nakshatra || !panchang?.nakshatra) return null;
    const birthIdx = NAKSHATRAS.findIndex(
      (n) => n.toLowerCase() === chart.planets.Moon.nakshatra.toLowerCase()
    );
    const todayIdx = NAKSHATRAS.findIndex(
      (n) => n.toLowerCase() === panchang.nakshatra.toLowerCase()
    );
    if (birthIdx === -1 || todayIdx === -1) return null;

    const diff = (todayIdx - birthIdx + 27) % 9;
    const taraName = NAVTARA_NAMES[diff];
    const isFavorable = [1, 3, 5, 7, 8].includes(diff);

    return {
      taraName,
      isFavorable,
      birthNakshatra: chart.planets.Moon.nakshatra,
      todayNakshatra: panchang.nakshatra,
    };
  }, [chart, panchang]);

  if (!panchang) {
    return (
      <div className={`p-4 rounded-2xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] text-xs text-[#6B635B] ${className}`}>
        Calculating today&apos;s celestial panchang...
      </div>
    );
  }

  const isRahuKaalActive = isTimeBetween(currentTimeStr, panchang.rahuKaal.start, panchang.rahuKaal.end);
  const isAbhijitActive = isTimeBetween(currentTimeStr, panchang.abhijitMuhurta.start, panchang.abhijitMuhurta.end);

  return (
    <div
      className={`rounded-2xl border border-[rgba(184,134,11,0.22)] bg-gradient-to-r from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] p-4 text-[#1A1A1A] shadow-sm ${className}`}
    >
      {/* Top Banner Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[rgba(184,134,11,0.18)]">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">☀️</span>
          <div>
            <div className="text-[10px] tracking-wider uppercase text-[#B8860B] font-bold">
              Live Vedic Panchang
            </div>
            <div className="text-sm font-bold text-[#1A1A1A]">
              {panchang.weekday} · {panchang.paksha} {panchang.tithi}
            </div>
          </div>
        </div>

        {/* Live Critical Muhurta Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Rahu Kaal Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
              isRahuKaalActive
                ? "bg-[rgba(220,38,38,0.12)] text-[#DC2626] border border-[#dc2626] animate-pulse font-bold"
                : "bg-[#FAF8F5] text-[#6B635B] border border-[rgba(184,134,11,0.2)] font-semibold"
            }`}
          >
            <span>⚠️</span>
            <span>Rahu Kaal: {panchang.rahuKaal.start}–{panchang.rahuKaal.end}</span>
            {isRahuKaalActive && <span className="text-[10px] uppercase font-bold text-[#dc2626]">Active Now</span>}
          </div>

          {/* Abhijit Muhurta Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
              isAbhijitActive
                ? "bg-[rgba(184,134,11,0.18)] text-[#B8860B] border border-[#B8860B] font-bold shadow-sm"
                : "bg-[#FAF8F5] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-semibold"
            }`}
          >
            <span>🌟</span>
            <span>Abhijit: {panchang.abhijitMuhurta.start}–{panchang.abhijitMuhurta.end}</span>
            {isAbhijitActive && <span className="text-[10px] uppercase font-bold text-[#1E7E34]">Golden Window</span>}
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-[#B8860B] hover:text-[#1A1A1A] transition-colors ml-1 px-2.5 py-1 rounded bg-[#FAF8F5] border border-[rgba(184,134,11,0.2)] font-semibold"
          >
            {showDetails ? "▲ Summary" : "▼ 5 Limbs"}
          </button>
        </div>
      </div>

      {/* 5 Limbs Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.18)]">
          <div className="text-[10px] text-[#6B635B] uppercase tracking-wider font-bold">Tithi</div>
          <div className="text-xs font-bold text-[#1A1A1A] mt-0.5">{panchang.tithi}</div>
          <div className="text-[10px] text-[#6B635B]">Ends {panchang.tithiEnd}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.18)]">
          <div className="text-[10px] text-[#6B635B] uppercase tracking-wider font-bold">Nakshatra</div>
          <div className="text-xs font-bold text-[#B8860B] mt-0.5">
            {panchang.nakshatra} (P{panchang.nakshatraPada})
          </div>
          <div className="text-[10px] text-[#6B635B]">Lord: {panchang.nakshatraLord}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.18)]">
          <div className="text-[10px] text-[#6B635B] uppercase tracking-wider font-bold">Yoga & Karana</div>
          <div className="text-xs font-bold text-[#1A1A1A] mt-0.5">{panchang.yoga}</div>
          <div className="text-[10px] text-[#6B635B]">Karana: {panchang.karana}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.18)]">
          <div className="text-[10px] text-[#6B635B] uppercase tracking-wider font-bold">Sun & Moon Rashi</div>
          <div className="text-xs font-bold text-[#1A1A1A] mt-0.5">
            ☽ {panchang.moonSign} · ☉ {panchang.sunSign}
          </div>
          <div className="text-[10px] text-[#6B635B]">Sunrise: {panchang.sunrise}</div>
        </div>
      </div>

      {/* Personalized Navtara Harmony (If Natal Moon Available) */}
      {navtaraInsight && (
        <div className="mt-3 p-2.5 rounded-xl bg-[rgba(184,134,11,0.06)] border border-[rgba(184,134,11,0.2)] flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>🌙</span>
            <span>
              <strong>Personal Navtara:</strong> Today is <strong>{navtaraInsight.taraName}</strong> for your birth Moon ({navtaraInsight.birthNakshatra}).
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              navtaraInsight.isFavorable
                ? "bg-[rgba(34,139,34,0.12)] text-[#1E7E34] border border-[rgba(34,139,34,0.25)]"
                : "bg-[rgba(220,38,38,0.12)] text-[#DC2626] border border-[rgba(220,38,38,0.25)]"
            }`}
          >
            {navtaraInsight.isFavorable ? "✦ Auspicious Day" : "⚠️ Proceed with Mindfulness"}
          </span>
        </div>
      )}

      {/* Expanded Guidance (Good For / Avoid) */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-[rgba(184,134,11,0.18)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.18)]">
            <div className="text-[10px] uppercase font-bold text-[#1E7E34] mb-1">
              ✦ Recommended Actions Today
            </div>
            <div className="text-[#3D3834] leading-relaxed">
              {panchang.tithiGuidance.goodFor.slice(0, 3).join(", ") || "General auspicious activities, planning, creative work."}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.18)]">
            <div className="text-[10px] uppercase font-bold text-[#DC2626] mb-1">
              ⚠️ Activities to Avoid
            </div>
            <div className="text-[#3D3834] leading-relaxed">
              {panchang.tithiGuidance.avoid.slice(0, 3).join(", ") || "High-risk conflict, impulsive debt commitments."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyPanchangWidget;
