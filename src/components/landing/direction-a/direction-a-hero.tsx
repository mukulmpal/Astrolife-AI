'use client';

import { useState } from 'react';
import { Aurora, StarField } from './celestial';
import { BirthDetailsForm } from './birth-form';

export function DirectionAHero() {
  const [activeMicroTab, setActiveMicroTab] = useState<'destiny' | 'medical' | 'vastu' | 'wearables' | 'kp_jaimini'>('destiny');

  return (
    <section
      className="dira-grain relative flex min-h-[100svh] items-center overflow-hidden px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-24 md:px-10 lg:pb-28"
      style={{ background: 'var(--al-bg)' }}
    >
      <StarField count={110} opacity={0.7} />
      <Aurora />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
          {/* LEFT COLUMN - Content */}
          <div className="space-y-6 sm:space-y-8">
            <p
              className="dira-reveal dira-reveal-1 in mb-4 sm:mb-8 font-serif text-base sm:text-lg italic md:text-xl"
              style={{ color: 'var(--al-ivory-dim)' }}
            >
              Stop Guessing with Generic Horoscopes.
            </p>

            <div className="dira-reveal dira-reveal-1 in mb-5 sm:mb-7 flex">
              <span className="dira-rule-label">✦ 38 Specialized Vedic & Scientific Engines · Zero AI Hallucination · Swiss Ephemeris 0.01°</span>
            </div>

            <h1 className="dira-display dira-reveal dira-reveal-2 in" style={{ color: 'var(--al-ivory)' }}>
              Mathematical Destiny
              <br />
              <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>
                Intelligence OS.
              </span>
            </h1>

            <p
              className="dira-reveal dira-reveal-3 in max-w-xl text-sm sm:text-base leading-relaxed md:text-lg"
              style={{ color: 'var(--al-ivory-dim)' }}
            >
              AstroLife AI is not a generic chatbot. It is a unified supercomputer of 38 specialized Vedic and
              scientific engines: 90-year destiny curves, KP Sub-Lords, Jaimini Chara Dasha, 16-Zone Astro-Vastu Hit Radar,
              Sacred Wrist Threads, Bio-Wearable Shields, Somatotopic Tattoos, and Biometric Dot Therapy.
            </p>

            {/* Visual Interactive Micro-Card Showcase */}
            <div className="dira-reveal dira-reveal-4 in mt-6 rounded-2xl p-4 sm:p-5 border transition-all"
                 style={{ background: '#FFFFFF', borderColor: 'rgba(184, 134, 11, 0.35)', boxShadow: '0 8px 30px -6px rgba(184, 134, 11, 0.15)' }}>
              
              {/* Tab Pills */}
              <div className="flex flex-wrap gap-1.5 pb-3 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                {[
                  { id: 'destiny', label: '📈 Destiny 0-90' },
                  { id: 'medical', label: '🩺 Medical & Sound' },
                  { id: 'vastu', label: '🏛️ 16-Zone Vastu' },
                  { id: 'wearables', label: '🛡️ Threads & Metal' },
                  { id: 'kp_jaimini', label: '◈ KP & Jaimini' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveMicroTab(tab.id as any)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-10px font-bold transition-all ${
                      activeMicroTab === tab.id
                        ? 'bg-[#FAF5EB] text-[#8C6508] border-2 border-[#B8860B] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#6B635B] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Canvas Body */}
              <div className="pt-3">
                {activeMicroTab === 'destiny' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                        90-Year Destiny Curve & Transit Ripple
                      </div>
                      <span className="font-mono text-9px uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF5EB] text-[#8C6508] border border-[rgba(184,134,11,0.25)]">
                        Continuous Scrubber
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C5248] leading-relaxed">
                      Mathematical life score trajectory calculating career golden windows & multi-house transit ripple shocks.
                    </p>
                    {/* Mini SVG Destiny Curve */}
                    <div className="relative mt-2.5 h-20 w-full overflow-hidden rounded-lg bg-[#FAF7F2] border p-1.5 flex items-center justify-center"
                         style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <svg className="w-full h-full" viewBox="0 0 300 70" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="heroDestinyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 10 55 Q 50 48, 80 40 T 140 22 T 200 12 T 260 30 T 290 20 L 290 68 L 10 68 Z"
                          fill="url(#heroDestinyGrad)"
                        />
                        <path
                          d="M 10 55 Q 50 48, 80 40 T 140 22 T 200 12 T 260 30 T 290 20"
                          fill="none"
                          stroke="#B8860B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Age 38 Pulse Marker */}
                        <circle cx="140" cy="22" r="4.5" fill="#059669" className="animate-ping" />
                        <circle cx="140" cy="22" r="4" fill="#059669" />
                        <text x="140" y="14" textAnchor="middle" fontSize="7.5" fill="#059669" fontWeight="bold">
                          Age 38: Score 86/100 (Golden Window)
                        </text>
                        {/* Peak at Age 52 */}
                        <circle cx="200" cy="12" r="3.5" fill="#B8860B" />
                        <text x="200" y="8" textAnchor="middle" fontSize="7" fill="#8C6508" fontWeight="bold">
                          Age 52: Peak Dhana
                        </text>
                      </svg>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-9px font-bold text-[#8C6508]">
                      <span>✦ 0–90 Life Horizon Algorithm</span>
                      <a href="/dashboard/destiny" className="hover:underline">Explore 90-Yr Trajectory →</a>
                    </div>
                  </div>
                )}

                {activeMicroTab === 'medical' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                        Medical Kundli & Dasha Sound Therapy
                      </div>
                      <span className="font-mono text-9px uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF5EB] text-[#8C6508] border border-[rgba(184,134,11,0.25)]">
                        Ayurveda + Raaga
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C5248] leading-relaxed">
                      Nakshatra organ mapping, Tridosha balance & Indian Classical Raagas for active dashas.
                    </p>
                    <div className="mt-2.5 rounded-lg bg-[#FAF7F2] border p-2.5 space-y-2" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div>
                        <div className="flex justify-between text-9px font-bold text-[#1A1A1A] mb-1">
                          <span>Tridosha Constitution:</span>
                          <span className="text-[#8C6508]">Pitta 48% (Dominant) · Vata 32% · Kapha 20%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-amber-100 overflow-hidden flex">
                          <div style={{ width: '48%' }} className="bg-amber-600 h-full"></div>
                          <div style={{ width: '32%' }} className="bg-sky-500 h-full"></div>
                          <div style={{ width: '20%' }} className="bg-emerald-500 h-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-9px pt-1 border-t border-[rgba(184,134,11,0.15)]">
                        <span className="font-bold text-[#1A1A1A]">🎵 Active Sound Therapy:</span>
                        <span className="font-mono font-bold text-[#059669]">Raag Bhairav · 432 Hz Morning Wave</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-9px font-bold text-[#8C6508]">
                      <span>✦ Nakshatra Organ Diagnostics</span>
                      <a href="/dashboard/medical" className="hover:underline">Explore Medical Kundli →</a>
                    </div>
                  </div>
                )}

                {activeMicroTab === 'vastu' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                        16-Zone Astro-Vastu Radar & Hit Detection
                      </div>
                      <span className="font-mono text-9px uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF5EB] text-[#8C6508] border border-[rgba(184,134,11,0.25)]">
                        45 Devatas · 180° Hits
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C5248] leading-relaxed">
                      45 Devatas, 32 Entrances, 180° Planetary Hits & zero-demolition 120° House Shifting.
                    </p>
                    <div className="mt-2.5 rounded-lg bg-[#FAF7F2] border p-2 flex items-center justify-between gap-3" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🧭</span>
                        <div>
                          <div className="text-9px font-bold text-[#DC2626]">⚠️ 180° Planetary Hit: Saturn-Mars Kitchen Clash</div>
                          <div className="text-8px text-[#5C5248]">Zone: South-East (Agni) affected by afflicted 8th Lord</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded px-2 py-0.5 text-8px font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ 120° Copper Shift Applied
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-9px font-bold text-[#8C6508]">
                      <span>✦ Zero Wall Demolition Upaya</span>
                      <a href="/dashboard/vastu" className="hover:underline">Explore 16-Zone Hit Radar →</a>
                    </div>
                  </div>
                )}

                {activeMicroTab === 'wearables' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                        Bio-Wearables, Wrist Threads & Dot Therapy
                      </div>
                      <span className="font-mono text-9px uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF5EB] text-[#8C6508] border border-[rgba(184,134,11,0.25)]">
                        EMF & Moli Trap
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C5248] leading-relaxed">
                      Smartwatch metal shielding, Moli Trap prevention, Somatotopic Skin Ink & 12-Rashi Bindi healing.
                    </p>
                    <div className="mt-2.5 rounded-lg bg-[#FAF7F2] border p-2 grid grid-cols-2 gap-2 text-9px" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div className="rounded bg-white p-1.5 border border-[rgba(184,134,11,0.15)]">
                        <div className="font-bold text-[#1A1A1A]">⌚ Smartwatch Audit:</div>
                        <div className="text-[#059669] font-medium">Switch to Right Wrist to neutralize Rahu EMF</div>
                      </div>
                      <div className="rounded bg-white p-1.5 border border-[rgba(184,134,11,0.15)]">
                        <div className="font-bold text-[#1A1A1A]">🧵 Moli Trap Rule:</div>
                        <div className="text-[#8C6508] font-medium">5 Turns · Raw Cotton · Shukla Sunrise</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-9px font-bold text-[#8C6508]">
                      <span>✦ 2-Inch Nabhi Desi Ghee Protocol Included</span>
                      <a href="/dashboard/vastu?tab=wearableAudit" className="hover:underline">Explore Threads & Wearables →</a>
                    </div>
                  </div>
                )}

                {activeMicroTab === 'kp_jaimini' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                        Multi-System Rigor (KP + Jaimini + Palmistry)
                      </div>
                      <span className="font-mono text-9px uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF5EB] text-[#8C6508] border border-[rgba(184,134,11,0.25)]">
                        0.01° Sub-Lords
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C5248] leading-relaxed">
                      Swiss Ephemeris 0.01° sub-lords, 7 Chara Karakas, and authentic Samudrika Shastra hand analysis.
                    </p>
                    <div className="mt-2.5 rounded-lg bg-[#FAF7F2] border p-2 space-y-1.5 text-9px" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B635B]">KP 1st Cusp Sub-Lord:</span>
                        <span className="font-mono font-bold text-[#1A1A1A]">Jupiter (249 Divisions · 0.01° Verified)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B635B]">Jaimini Atmakaraka (AK):</span>
                        <span className="font-bold text-[#8C6508]">Sun · Karakamsha: D9 Leo (Soul Purpose)</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-9px font-bold text-[#8C6508]">
                      <span>✦ Fused with Palmistry Fate Line Tracking</span>
                      <a href="/dashboard/kp" className="hover:underline">Explore KP & Jaimini →</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Engine Telemetry Badges */}
            <div className="dira-reveal dira-reveal-4 in mt-6 flex flex-wrap gap-2">
              <a
                href="/dashboard/vastu"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
                style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.35)' }}
              >
                <span>🏛️</span> Astro-Vastu Radar
              </a>
              <a
                href="/dashboard/vastu?tab=wearableAudit"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
                style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.35)' }}
              >
                <span>🧵</span> Threads & Wearables
              </a>
              <a
                href="/dashboard/vastu?tab=bodyTherapy"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
                style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.35)' }}
              >
                <span>🔴</span> Dot Therapy (बिंदु)
              </a>
              <a
                href="/dashboard/astro-tattoo"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
                style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.35)' }}
              >
                <span>🖋️</span> Astro Tattoo
              </a>
              <a
                href="/dashboard/palmistry"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
                style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.35)' }}
              >
                <span>✋</span> Samudrika Palmistry
              </a>
            </div>

            {/* Trust Strip */}
            <div
              className="dira-reveal dira-reveal-5 in mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-lg"
              style={{ border: '1px solid rgba(184, 134, 11, 0.3)', background: 'rgba(184, 134, 11, 0.2)' }}
            >
              {[
                { k: '38 Engines', v: 'Vedic · KP · Jaimini · Vastu' },
                { k: '0.01°', v: 'Swiss Ephemeris Precision' },
                { k: '100% Exact', v: 'Zero AI Hallucination' },
              ].map((s) => (
                <div
                  key={s.v}
                  className="px-2 py-2.5 sm:px-3.5 sm:py-3 text-center sm:text-left"
                  style={{ background: '#FFFFFF' }}
                >
                  <div className="font-serif text-base sm:text-lg font-bold" style={{ color: '#8C6508' }}>
                    {s.k}
                  </div>
                  <div
                    className="mt-0.5 text-8px sm:text-9px uppercase tracking-wider font-semibold"
                    style={{ color: '#6B635B' }}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Form */}
          <div
            className="dira-reveal dira-reveal-4 in rounded-2xl p-4 sm:p-7 md:p-8"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(184, 134, 11, 0.35)',
              boxShadow: '0 20px 60px -14px rgba(184, 134, 11, 0.25)',
            }}
          >
            <div className="mb-5">
              <div className="mb-1 text-10px font-bold uppercase tracking-widest" style={{ color: '#8C6508' }}>
                ✦ Get Started Free
              </div>
              <h3 className="font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                Cast Your Kundli
              </h3>
              <p className="mt-1 text-xs" style={{ color: '#6B635B' }}>
                Instant calculation • Zero account needed
              </p>
            </div>

            <BirthDetailsForm />
          </div>
        </div>
      </div>

      {/* scroll cue - cleanly positioned and hidden on smaller viewports to prevent overlap */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 xl:flex" aria-hidden>
        <div
          className="flex flex-col items-center gap-1 text-9px uppercase tracking-[0.3em] font-medium"
          style={{ color: '#8C6508' }}
        >
          Scroll
          <span
            className="block h-6 w-px dira-float"
            style={{ background: 'linear-gradient(#B8860B, transparent)' }}
          />
        </div>
      </div>
    </section>
  );
}
