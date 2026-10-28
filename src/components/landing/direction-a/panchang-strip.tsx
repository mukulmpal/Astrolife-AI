'use client';

import { useState } from 'react';
import { calculatePanchang, type PanchangResult } from '@/lib/astro-engine/panchang';

function PanchangItemSequence({ panchang }: { panchang: PanchangResult }) {
  return (
    <div className="flex items-center gap-4 pr-8 whitespace-nowrap">
      <span className="text-[#FAF7F2] font-semibold flex items-center gap-1.5">
        <span>📅</span> {panchang.weekday}, {panchang.paksha} {panchang.tithi}
        {panchang.tithiEnd && (
          <span className="text-[#A89F91] text-[10px] font-normal">(ends {panchang.tithiEnd})</span>
        )}
      </span>

      <span className="text-[#D4AF37]/50 font-bold">•</span>

      <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
        <span>🪐</span> {panchang.nakshatra} (Pada {panchang.nakshatraPada})
        <span className="text-[#A89F91] text-[10px] font-normal">· Lord: {panchang.nakshatraLord}</span>
      </span>

      <span className="text-[#D4AF37]/50 font-bold">•</span>

      <span className="text-[#E7E2D8] flex items-center gap-1.5">
        <span>⚡</span> Yoga: <strong>{panchang.yoga}</strong>
        <span className="text-[#A89F91] text-[10px]">· Karana: {panchang.karana}</span>
      </span>

      {panchang.abhijitMuhurta && (
        <>
          <span className="text-[#D4AF37]/50 font-bold">•</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
            <span>🟢</span> Abhijit: {panchang.abhijitMuhurta.start} – {panchang.abhijitMuhurta.end}
            <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold">Golden Window</span>
          </span>
        </>
      )}

      {panchang.rahuKaal && (
        <>
          <span className="text-[#D4AF37]/50 font-bold">•</span>
          <span className="text-rose-400 font-medium flex items-center gap-1.5 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
            <span>🔴</span> Rahu Kaal: {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
            <span className="text-[9px] uppercase tracking-wider text-rose-300 font-bold">Inauspicious</span>
          </span>
        </>
      )}

      <span className="text-[#D4AF37]/50 font-bold">•</span>

      <span className="text-[#A89F91] flex items-center gap-1.5">
        <span>🌅</span> Sunrise: {panchang.sunrise} · <span>🌇</span> Sunset: {panchang.sunset}
      </span>

      <span className="text-[#D4AF37]/50 font-bold">•</span>

      <span className="text-[#E7E2D8] flex items-center gap-1.5">
        <span>☽</span> Moon: {panchang.moonSign} · <span>☉</span> Sun: {panchang.sunSign}
      </span>

      <span className="text-[#D4AF37]/50 font-bold">•</span>

      <span className="text-[#D4AF37] text-[10px] uppercase tracking-wider flex items-center gap-1 font-semibold">
        <span>☸️</span> Lahiri Chitrapaksha Ephemeris (NASA Moshier Engine)
      </span>
    </div>
  );
}

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
        className="relative z-40 w-full border-b py-1.5 px-2.5 sm:px-4 text-xs font-mono transition-all overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #181512 0%, #25201A 50%, #181512 100%)',
          borderColor: 'rgba(184, 134, 11, 0.35)',
          color: '#FAF7F2',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 text-10px sm:text-11px">
          {/* Pinned Left Badge */}
          <div className="flex items-center gap-2 flex-shrink-0 z-10 pr-2.5 sm:pr-3.5 border-r border-[#B8860B]/30 bg-[#181512]">
            <span className="flex items-center gap-1.5 font-bold text-[#D4AF37] tracking-wider whitespace-nowrap text-9px sm:text-10px">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="hidden sm:inline">TODAY&rsquo;S VEDIC PANCHANG</span>
              <span className="sm:hidden">VEDIC PANCHANG</span>
            </span>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="px-2 py-0.5 rounded text-9px font-bold bg-[#2A241E] text-[#D4AF37] border border-[#B8860B]/40 hover:bg-[#3D3328] transition-colors cursor-pointer whitespace-nowrap"
              aria-label="Toggle Full Vedic Panchang Details"
            >
              {showDetails ? '▲ Close' : '▼ 5 Limbs'}
            </button>
          </div>

          {/* Continuous Left-Scrolling Marquee Ticker (Both Desktop and Mobile) */}
          <div
            className="relative flex-1 overflow-hidden whitespace-nowrap"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
            }}
          >
            <div className="panchang-ticker-track text-10px sm:text-11px tracking-wide">
              {/* Set 1 */}
              <PanchangItemSequence panchang={panchang} />
              {/* Set 2 (for seamless continuous infinite leftward scroll) */}
              <PanchangItemSequence panchang={panchang} />
            </div>
          </div>
        </div>
      </div>

      {/* EXPANDED 5-ANGA PANCHANG CARD (Works on all screens) */}
      {showDetails && (
        <div
          className="relative z-40 w-full border-b px-4 py-3.5 text-xs font-mono transition-all animate-fadeIn"
          style={{
            background: 'linear-gradient(180deg, #1F1A15 0%, #17130F 100%)',
            borderColor: 'rgba(184, 134, 11, 0.45)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#B8860B]/25">
              <span className="text-11px uppercase tracking-wider font-bold text-[#D4AF37] flex items-center gap-1.5">
                <span>✦</span> Daily Shastric Panchang (5 Limbs of Time)
              </span>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="text-10px text-[#A89F91] hover:text-[#FAF7F2] px-2.5 py-0.5 rounded bg-[#2A241E] border border-[#B8860B]/30 transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2.5 text-10px">
              <div className="rounded-lg p-2.5 bg-[#2A241E]/90 border border-[#B8860B]/20">
                <span className="text-[#A89F91] text-9px block">1. Tithi (Lunar Phase)</span>
                <span className="font-bold text-[#FAF7F2] text-11px mt-0.5 block">{panchang.paksha} {panchang.tithi}</span>
                <span className="text-[#A89F91] text-[9px]">Ends {panchang.tithiEnd}</span>
              </div>
              <div className="rounded-lg p-2.5 bg-[#2A241E]/90 border border-[#B8860B]/20">
                <span className="text-[#A89F91] text-9px block">2. Vara (Weekday)</span>
                <span className="font-bold text-[#FAF7F2] text-11px mt-0.5 block">{panchang.weekday}</span>
                <span className="text-[#A89F91] text-[9px]">Vara Lord: {panchang.weekday}</span>
              </div>
              <div className="rounded-lg p-2.5 bg-[#2A241E]/90 border border-[#B8860B]/20">
                <span className="text-[#A89F91] text-9px block">3. Nakshatra</span>
                <span className="font-bold text-[#D4AF37] text-11px mt-0.5 block">{panchang.nakshatra} (P{panchang.nakshatraPada})</span>
                <span className="text-[#A89F91] text-[9px]">Lord: {panchang.nakshatraLord}</span>
              </div>
              <div className="rounded-lg p-2.5 bg-[#2A241E]/90 border border-[#B8860B]/20">
                <span className="text-[#A89F91] text-9px block">4. Yoga</span>
                <span className="font-bold text-[#FAF7F2] text-11px mt-0.5 block">{panchang.yoga}</span>
                <span className="text-[#A89F91] text-[9px]">Sun + Moon Longitude</span>
              </div>
              <div className="rounded-lg p-2.5 bg-[#2A241E]/90 border border-[#B8860B]/20">
                <span className="text-[#A89F91] text-9px block">5. Karana (Half-Tithi)</span>
                <span className="font-bold text-[#FAF7F2] text-11px mt-0.5 block">{panchang.karana}</span>
                <span className="text-[#A89F91] text-[9px]">Active Karana</span>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-10px">
              {panchang.abhijitMuhurta && (
                <div className="rounded-lg p-2.5 bg-[#059669]/15 border border-[#059669]/35">
                  <span className="text-emerald-400 text-9px font-bold block flex items-center gap-1">
                    <span>🟢</span> Abhijit Muhurta (Sarvartha Siddhi)
                  </span>
                  <span className="font-bold text-[#FAF7F2] text-11px mt-0.5 block">
                    {panchang.abhijitMuhurta.start} – {panchang.abhijitMuhurta.end}
                  </span>
                </div>
              )}
              {panchang.rahuKaal && (
                <div className="rounded-lg p-2.5 bg-[#DC2626]/15 border border-[#DC2626]/35">
                  <span className="text-rose-400 text-9px font-bold block flex items-center gap-1">
                    <span>🔴</span> Rahu Kaal (Varjya Kaala)
                  </span>
                  <span className="font-bold text-[#FAF7F2] text-11px mt-0.5 block">
                    {panchang.rahuKaal.start} – {panchang.rahuKaal.end}
                  </span>
                </div>
              )}
              <div className="rounded-lg p-2.5 bg-[#2A241E]/90 border border-[#B8860B]/20 flex items-center justify-between">
                <div>
                  <span className="text-[#A89F91] text-9px block">Sun Window</span>
                  <span className="font-bold text-[#FAF7F2] text-10px">🌅 {panchang.sunrise} · 🌇 {panchang.sunset}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#A89F91] text-9px block">Rashi</span>
                  <span className="font-bold text-[#D4AF37] text-10px">☽ {panchang.moonSign}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
