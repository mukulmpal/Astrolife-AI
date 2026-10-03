'use client';

import { useEffect, useState } from 'react';
import { calculatePanchang, type PanchangResult } from '@/lib/astro-engine/panchang';

export function PanchangStrip() {
  const [panchang] = useState<PanchangResult | null>(() => {
    try {
      const now = new Date();
      // Default coordinates: New Delhi 28.6139° N, 77.2090° E, TZ +5.5
      return calculatePanchang(now, 5.5, { lat: 28.6139, lon: 77.209 });
    } catch (err) {
      console.error('Failed to compute daily panchang:', err);
      return null;
    }
  });

  if (!panchang) return null;

  return (
    <div
      className="relative z-40 w-full border-b py-1 px-4 text-xs font-mono transition-all overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #1C1917 0%, #2A241E 50%, #1C1917 100%)',
        borderColor: 'rgba(184, 134, 11, 0.35)',
        color: '#FAF7F2',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 text-10px tracking-wider">
        {/* Left: Tithi & Nakshatra */}
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex items-center gap-1 font-bold text-[#D4AF37]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            TODAY&rsquo;S DRIK PANCHANG:
          </span>
          <span className="text-[#E7E2D8]">
            {panchang.weekday}, {panchang.paksha} {panchang.tithi}
          </span>
          <span className="text-[#8C6508]">•</span>
          <span className="text-[#D4AF37]">
            {panchang.nakshatra} (Pada {panchang.nakshatraPada})
          </span>
        </div>

        {/* Right: Auspicious & Inauspicious Muhurtas */}
        <div className="hidden sm:flex items-center gap-3 whitespace-nowrap text-10px">
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
        </div>
      </div>
    </div>
  );
}

