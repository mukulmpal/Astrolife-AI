'use client';

import { useState } from 'react';
import { calculatePanchang, type PanchangResult } from '@/lib/astro-engine/panchang';

export function PanchangStrip() {
  const [panchang] = useState<PanchangResult | null>(() => {
    try {
      const now = new Date();
      // Coordinates: New Delhi 28.6139° N, 77.2090° E, TZ +5.5
      return calculatePanchang(now, 5.5, { lat: 28.6139, lon: 77.209 });
    } catch (err) {
      console.error('Failed to compute daily panchang:', err);
      return null;
    }
  });

  const [showDetails, setShowDetails] = useState(false);

  if (!panchang) return null;

  return (
    <>
      <div
        className="relative z-40 w-full border-b py-1 px-3 sm:px-4 text-xs font-mono transition-all overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #1C1917 0%, #2A241E 50%, #1C1917 100%)',
          borderColor: 'rgba(184, 134, 11, 0.35)',
          color: '#FAF7F2',
        }}
      >
        {/* DESKTOP VIEW (md: and up) */}
        <div className="hidden md:flex mx-auto max-w-6xl items-center justify-between gap-3 text-10px tracking-wider">
          {/* Left: Tithi & Nakshatra */}
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-bold text-[#D4AF37]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              TODAY&rsquo;S VEDIC PANCHANG:
            </span>
            <span className="text-[#E7E2D8]">
              {panchang.weekday}, {panchang.paksha} {panchang.tithi}
            </span>
            <span className="text-[#8C6508]">•</span>
            <span className="text-[#D4AF37]">
              {panchang.nakshatra} (Pada {panchang.nakshatraPada})
            </span>
            <span className="text-[#8C6508]">•</span>
            <span className="text-[#C5BBAF]">
              Yoga: {panchang.yoga}
            </span>
          </div>

          {/* Right: Auspicious & Inauspicious Muhurtas */}
          <div className="flex items-center gap-3 whitespace-nowrap text-10px">
            {panchang.abhijitMuhurta && (
              <span className="flex items-center gap-1 text-[#10b981]">
                <span className="font-semibold text-emerald-400">Abhijit:</span>{' '}
                {panchang.abhijitMuhurta.start} – {panchang.abhijitMuhurta.end}
              </span>
            )}
            {panchang.rahuKaal && (
              <span className="flex items-center gap-1 text-[#f87171]">
                <span className="font-semibold text-rose-400">Rahu Kaal:</span>{' '}
                {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
              </span>
            )}
            <span className="text-[#8C6508]">•</span>
            <span className="text-[#A89F91]">
              🌅 {panchang.sunrise}
            </span>
          </div>
        </div>

        {/* MOBILE VIEW (< md) - Silky smooth marquee ticker + pinned badge */}
        <div className="flex md:hidden items-center gap-2 text-10px">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 font-bold text-[#D4AF37] flex-shrink-0 bg-[#2A241E] px-2 py-0.5 rounded border border-[#B8860B]/40 text-9px cursor-pointer"
            aria-label="Toggle Full Vedic Panchang Details"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>VEDIC PANCHANG</span>
            <span className="text-8px text-[#D4AF37]/90 font-mono">
              {showDetails ? '▲ Close' : '▼ View'}
            </span>
          </button>

          {/* Continuous Infinite Marquee Ticker */}
          <div className="relative flex-1 overflow-hidden whitespace-nowrap mask-edges">
            <div className="panchang-ticker-track text-9px tracking-wide">
              {/* Set 1 */}
              <div className="flex items-center gap-3 pr-6">
                <span className="text-[#E7E2D8]">
                  📅 {panchang.weekday}, {panchang.paksha} {panchang.tithi}
                </span>
                <span className="text-[#8C6508]">•</span>
                <span className="text-[#D4AF37]">
                  🪐 {panchang.nakshatra} (Pada {panchang.nakshatraPada})
                </span>
                <span className="text-[#8C6508]">•</span>
                <span className="text-[#C5BBAF]">
                  ⚡ Yoga: {panchang.yoga}
                </span>
                {panchang.abhijitMuhurta && (
                  <>
                    <span className="text-[#8C6508]">•</span>
                    <span className="text-emerald-400">
                      🟢 Abhijit: {panchang.abhijitMuhurta.start} – {panchang.abhijitMuhurta.end}
                    </span>
                  </>
                )}
                {panchang.rahuKaal && (
                  <>
                    <span className="text-[#8C6508]">•</span>
                    <span className="text-rose-400">
                      🔴 Rahu Kaal: {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
                    </span>
                  </>
                )}
                <span className="text-[#8C6508]">•</span>
                <span className="text-[#A89F91]">
                  🌅 Sunrise: {panchang.sunrise}
                </span>
              </div>

              {/* Set 2 (for infinite loop) */}
              <div className="flex items-center gap-3 pr-6">
                <span className="text-[#E7E2D8]">
                  📅 {panchang.weekday}, {panchang.paksha} {panchang.tithi}
                </span>
                <span className="text-[#8C6508]">•</span>
                <span className="text-[#D4AF37]">
                  🪐 {panchang.nakshatra} (Pada {panchang.nakshatraPada})
                </span>
                <span className="text-[#8C6508]">•</span>
                <span className="text-[#C5BBAF]">
                  ⚡ Yoga: {panchang.yoga}
                </span>
                {panchang.abhijitMuhurta && (
                  <>
                    <span className="text-[#8C6508]">•</span>
                    <span className="text-emerald-400">
                      🟢 Abhijit: {panchang.abhijitMuhurta.start} – {panchang.abhijitMuhurta.end}
                    </span>
                  </>
                )}
                {panchang.rahuKaal && (
                  <>
                    <span className="text-[#8C6508]">•</span>
                    <span className="text-rose-400">
                      🔴 Rahu Kaal: {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
                    </span>
                  </>
                )}
                <span className="text-[#8C6508]">•</span>
                <span className="text-[#A89F91]">
                  🌅 Sunrise: {panchang.sunrise}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDED 5-ANGA PANCHANG CARD */}
      {showDetails && (
        <div
          className="md:hidden relative z-40 w-full border-b px-4 py-3 text-xs font-mono transition-all animate-fadeIn"
          style={{
            background: '#1F1A15',
            borderColor: 'rgba(184, 134, 11, 0.4)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#B8860B]/20">
            <span className="text-10px uppercase tracking-wider font-bold text-[#D4AF37] flex items-center gap-1.5">
              <span>✦</span> Daily Panchang (5 Limbs of Time)
            </span>
            <button
              type="button"
              onClick={() => setShowDetails(false)}
              className="text-10px text-[#A89F91] hover:text-[#FAF7F2] px-2 py-0.5 rounded bg-[#2A241E] border border-[#B8860B]/20"
            >
              ✕ Close
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-10px">
            <div className="rounded p-2 bg-[#2A241E]/80 border border-[#B8860B]/15">
              <span className="text-[#A89F91] text-9px block">1. Tithi (Lunar Phase)</span>
              <span className="font-bold text-[#FAF7F2]">{panchang.paksha} {panchang.tithi}</span>
            </div>
            <div className="rounded p-2 bg-[#2A241E]/80 border border-[#B8860B]/15">
              <span className="text-[#A89F91] text-9px block">2. Vara (Weekday)</span>
              <span className="font-bold text-[#FAF7F2]">{panchang.weekday}</span>
            </div>
            <div className="rounded p-2 bg-[#2A241E]/80 border border-[#B8860B]/15">
              <span className="text-[#A89F91] text-9px block">3. Nakshatra</span>
              <span className="font-bold text-[#D4AF37]">{panchang.nakshatra} (Pada {panchang.nakshatraPada})</span>
            </div>
            <div className="rounded p-2 bg-[#2A241E]/80 border border-[#B8860B]/15">
              <span className="text-[#A89F91] text-9px block">4. Yoga & 5. Karana</span>
              <span className="font-bold text-[#FAF7F2]">{panchang.yoga} · {panchang.karana}</span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-10px">
            {panchang.abhijitMuhurta && (
              <div className="rounded p-2 bg-[#059669]/10 border border-[#059669]/30">
                <span className="text-emerald-400 text-9px font-bold block">🟢 Abhijit Muhurta (Shubh)</span>
                <span className="font-bold text-[#FAF7F2]">{panchang.abhijitMuhurta.start} – {panchang.abhijitMuhurta.end}</span>
              </div>
            )}
            {panchang.rahuKaal && (
              <div className="rounded p-2 bg-[#DC2626]/10 border border-[#DC2626]/30">
                <span className="text-rose-400 text-9px font-bold block">🔴 Rahu Kaal (Varjya)</span>
                <span className="font-bold text-[#FAF7F2]">{panchang.rahuKaal.start} – {panchang.rahuKaal.end}</span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[#B8860B]/15 flex items-center justify-between text-9px text-[#A89F91]">
            <span>🌅 Rise: {panchang.sunrise} · 🌇 Set: {panchang.sunset}</span>
            <span className="text-[#D4AF37]">Lahiri Ephemeris</span>
          </div>
        </div>
      )}
    </>
  );
}
