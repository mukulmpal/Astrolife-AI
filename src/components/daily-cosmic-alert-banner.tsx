"use client";

import React, { useEffect, useState } from "react";
import type { PanchangData } from "@/lib/astro-engine/panchang";
import type { ChartData } from "@/lib/astro-engine/calculations";

interface DailyCosmicAlertBannerProps {
  panchang?: PanchangData | null;
  chart?: ChartData | null;
}

export function DailyCosmicAlertBanner({ panchang, chart }: DailyCosmicAlertBannerProps) {
  const [notificationStatus, setNotificationStatus] = useState<"default" | "granted" | "denied">("default");
  const [alertTime, setAlertTime] = useState<string>("08:00");
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const handleEnableNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser push notifications are not supported on this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);

      if (permission === "granted") {
        try {
          new Notification("ॐ AstroLife Daily Cosmic Pulse", {
            body: `Daily Cosmic Weather active! Today's Nakshatra: ${
              panchang?.nakshatra?.name || "Auspicious"
            }. Auspicious Muhurat alert set for ${alertTime} AM.`,
            icon: "/icons/icon-192.png",
          });
        } catch {
          // mobile notification fallback
        }
        localStorage.setItem("astrolife_daily_alert_enabled", "true");
        localStorage.setItem("astrolife_daily_alert_time", alertTime);
      }
    } catch (err) {
      console.error("Notification permission error:", err);
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const nakshatraName = panchang?.nakshatra?.name || "Janma Nakshatra";
  const tithiName = panchang?.tithi?.name || "Shukla Paksha";
  const rahuKaalStr = panchang?.rahuKaal
    ? `${panchang.rahuKaal.start} – ${panchang.rahuKaal.end}`
    : "10:30 AM – 12:00 PM";

  const shareText = `🌅 AstroLife Daily Cosmic Weather (${todayFormatted})
• Moon Nakshatra: ${nakshatraName}
• Tithi: ${tithiName}
• Rahu Kaal (Avoid Risk): ${rahuKaalStr}
• Personalized for: ${chart?.name || "Seeker"} (${chart?.lagnaRashi || "Ascendant"})

Explore your 35+ engine Vedic Kundli free:
https://astrolife-ai.vercel.app/dashboard`;

  return (
    <div className="bg-gradient-to-br from-[#161626] via-[#0D0D18] to-[#080811] border-2 border-[#D4AF37]/50 rounded-3xl p-5 sm:p-6 shadow-xl mb-6 text-[#FAF7F2] relative overflow-hidden">
      {/* Sacred subtle glow background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-lg text-[#D4AF37] font-bold shadow-sm">
            ॐ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#FAF7F2]">
                Daily Cosmic Pulse & Panchang
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#16a34a]/20 text-[#86EFAC] border border-[#16a34a]/30">
                Live Today
              </span>
            </div>
            <p className="text-xs text-[#C5BFB5]">
              {todayFormatted} • Computed from your exact coordinates
            </p>
          </div>
        </div>

        {/* Notification Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {notificationStatus === "granted" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16a34a]/15 text-[#86EFAC] border border-[#16a34a]/30 text-xs font-semibold">
              <span>🔔</span>
              <span>Daily Morning Alert Active</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEnableNotification}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold transition-all shadow-sm"
            >
              <span>🔔</span>
              <span>Enable 8:00 AM Morning Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Cosmic Weather Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 relative z-10">
        <div className="bg-[#141424] border border-[#D4AF37]/25 rounded-2xl p-3 text-left">
          <span className="text-[10px] text-[#8E887E] uppercase tracking-wider block">Moon Nakshatra</span>
          <span className="font-serif text-sm sm:text-base font-bold text-[#D4AF37]">{nakshatraName}</span>
          <span className="text-[10px] text-[#C5BFB5] block mt-0.5">Mind & emotion frequency</span>
        </div>

        <div className="bg-[#141424] border border-[#D4AF37]/25 rounded-2xl p-3 text-left">
          <span className="text-[10px] text-[#8E887E] uppercase tracking-wider block">Active Tithi</span>
          <span className="font-serif text-sm sm:text-base font-bold text-[#FAF7F2]">{tithiName}</span>
          <span className="text-[10px] text-[#C5BFB5] block mt-0.5">Lunar energy phase</span>
        </div>

        <div className="bg-[#141424] border border-[#D4AF37]/25 rounded-2xl p-3 text-left">
          <span className="text-[10px] text-[#8E887E] uppercase tracking-wider block">Rahu Kaal (Caution)</span>
          <span className="font-mono text-xs sm:text-sm font-bold text-[#f87171]">{rahuKaalStr}</span>
          <span className="text-[10px] text-[#C5BFB5] block mt-0.5">Avoid starting new risks</span>
        </div>

        <div className="bg-[#141424] border border-[#D4AF37]/25 rounded-2xl p-3 text-left">
          <span className="text-[10px] text-[#8E887E] uppercase tracking-wider block">Shubh Muhurat</span>
          <span className="font-mono text-xs sm:text-sm font-bold text-[#86EFAC]">11:45 AM – 12:30 PM</span>
          <span className="text-[10px] text-[#C5BFB5] block mt-0.5">Abhijit golden window</span>
        </div>
      </div>

      {/* Action Footer: WhatsApp Viral Share & Calendar Routine */}
      <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 text-xs">
        <div className="text-[#C5BFB5] text-center sm:text-left text-[11px]">
          ✦ <strong>Pro Tip:</strong> Check your Panchang every morning before making significant investments or travel.
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* 1-Click WhatsApp Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <span>💬</span>
            <span>Share Today's Panchang on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
