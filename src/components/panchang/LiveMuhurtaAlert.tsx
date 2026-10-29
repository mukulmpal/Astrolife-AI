"use client";

import { useEffect, useState } from "react";
import { calculatePanchang, type PanchangResult } from "@/lib/astro-engine/panchang";
import { useUserChart } from "@/lib/user-chart";

function timeToMinutes(t: string): number {
  if (!t) return -1;
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return -1;
  return h * 60 + m;
}

export function LiveMuhurtaAlert({ className = "" }: { className?: string }) {
  const { chart } = useUserChart();
  const [panchang, setPanchang] = useState<PanchangResult | null>(null);
  const [nowMinutes, setNowMinutes] = useState<number>(0);

  useEffect(() => {
    try {
      const now = new Date();
      const tz = typeof chart?.tz === "number" ? chart.tz : 5.5;
      const loc = chart ? { lat: chart.lat, lon: chart.lon } : { lat: 28.6139, lon: 77.209 };
      const p = calculatePanchang(now, tz, loc);
      setPanchang(p);

      const updateTime = () => {
        const d = new Date();
        setNowMinutes(d.getHours() * 60 + d.getMinutes());
      };
      updateTime();
      const timer = setInterval(updateTime, 30000); // Check every 30s
      return () => clearInterval(timer);
    } catch (err) {
      console.warn("LiveMuhurtaAlert calculation failed:", err);
    }
  }, [chart]);

  if (!panchang) return null;

  const rahuStart = timeToMinutes(panchang.rahuKaal?.start);
  const rahuEnd = timeToMinutes(panchang.rahuKaal?.end);
  const abhijitStart = timeToMinutes(panchang.abhijitMuhurta?.start);
  const abhijitEnd = timeToMinutes(panchang.abhijitMuhurta?.end);

  const isRahuActive = rahuStart >= 0 && rahuEnd >= 0 && nowMinutes >= rahuStart && nowMinutes <= rahuEnd;
  const isAbhijitActive = abhijitStart >= 0 && abhijitEnd >= 0 && nowMinutes >= abhijitStart && nowMinutes <= abhijitEnd;

  // If neither active, check if Rahu Kaal starts within next 30 minutes
  const isRahuApproaching = !isRahuActive && rahuStart >= 0 && nowMinutes < rahuStart && (rahuStart - nowMinutes) <= 30;

  if (!isRahuActive && !isAbhijitActive && !isRahuApproaching) {
    return null; // Stay clean and quiet when no special window is active
  }

  if (isRahuActive) {
    return (
      <div
        className={`flex items-center justify-between flex-wrap gap-2 px-3.5 py-2 rounded-xl border transition-all animate-fadeIn ${className}`}
        style={{
          background: "linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.12) 100%)",
          borderColor: "rgba(220, 38, 38, 0.35)",
          color: "#991B1B",
          boxShadow: "0 2px 10px rgba(220, 38, 38, 0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base animate-pulse">⚠️</span>
          <div className="text-xs">
            <strong className="font-bold text-[#DC2626]">राहु काल सक्रिय है ({panchang.rahuKaal.start} – {panchang.rahuKaal.end})</strong>
            <span className="text-[#7F1D1D] ml-1.5 hidden sm:inline">
              · इस समय नए अनुबंध, महत्वपूर्ण आर्थिक निर्णय व शुभ शुरुआत टालें।
            </span>
          </div>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(220, 38, 38, 0.18)",
            color: "#DC2626",
            border: "1px solid rgba(220, 38, 38, 0.3)",
          }}
        >
          वर्ज्य काल (Avoid Muhurat)
        </span>
      </div>
    );
  }

  if (isAbhijitActive) {
    return (
      <div
        className={`flex items-center justify-between flex-wrap gap-2 px-3.5 py-2 rounded-xl border transition-all animate-fadeIn ${className}`}
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)",
          borderColor: "rgba(16, 185, 129, 0.35)",
          color: "#065F46",
          boxShadow: "0 2px 10px rgba(16, 185, 129, 0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🌟</span>
          <div className="text-xs">
            <strong className="font-bold text-[#059669]">अभिजीत मुहूर्त सक्रिय है ({panchang.abhijitMuhurta.start} – {panchang.abhijitMuhurta.end})</strong>
            <span className="text-[#047857] ml-1.5 hidden sm:inline">
              · सर्वकार्य सिद्धि हेतु अत्यंत शुभ और विजयकारी समय।
            </span>
          </div>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(16, 185, 129, 0.18)",
            color: "#059669",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          अमृत काल (Golden Window)
        </span>
      </div>
    );
  }

  if (isRahuApproaching) {
    const minsLeft = rahuStart - nowMinutes;
    return (
      <div
        className={`flex items-center justify-between flex-wrap gap-2 px-3.5 py-1.5 rounded-xl border text-xs transition-all ${className}`}
        style={{
          background: "rgba(245, 158, 11, 0.08)",
          borderColor: "rgba(245, 158, 11, 0.3)",
          color: "#92400E",
        }}
      >
        <div className="flex items-center gap-2">
          <span>⏳</span>
          <span>
            <strong>राहु काल {minsLeft} मिनट में शुरू होगा</strong> ({panchang.rahuKaal.start} – {panchang.rahuKaal.end})
          </span>
        </div>
        <span className="text-[10px] text-[#B45309] font-medium">शुभ कार्य शीघ्र पूर्ण करें</span>
      </div>
    );
  }

  return null;
}

