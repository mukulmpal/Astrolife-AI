'use client';

import { useState } from 'react';
import { CelestialInstrument, FolioMarker, OrnamentDivider, StarField, useReveal } from './celestial';

const TINT = (pct: number) =>
  `color-mix(in srgb, var(--al-surface) ${pct}%, transparent)`;
const GOLD_TINT = (pct: number) =>
  `color-mix(in srgb, var(--al-gold) ${pct}%, transparent)`;

function useAudioPreview() {
  const [playing, setPlaying] = useState(false);

  const playTone = () => {
    if (typeof window === 'undefined' || playing) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Meditative acoustic Tanpura drone: Sa (C#3: 138.59 Hz), Pa (G#3: 207.65 Hz), Sa octave (C#4: 277.18 Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(138.59, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(207.65, ctx.currentTime);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(277.18, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.8);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();
      setPlaying(true);

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          osc3.stop();
          ctx.close();
        } catch (_) {}
        setPlaying(false);
      }, 5000);
    } catch (e) {
      console.error(e);
      setPlaying(false);
    }
  };

  return { playing, playTone };
}

/* ============================ I · PROBLEM ============================ */
export function DirectionAProblem() {
  const ref = useReveal();
  const items = [
    { g: '☉', t: 'Sun-sign horoscopes', d: 'One of twelve scripts, handed to a billion people. Comfort, not truth.' },
    { g: '☄', t: 'Fear as a business model', d: '“Saturn will ruin you.” Dread sells subscriptions; it does not prepare you.' },
    { g: '☷', t: 'Reports no one reads', d: 'Forty-eight pages of Sanskrit jargon, and not one thing you can act on by Monday.' },
  ];
  return (
    <section ref={ref} className="dira-reveal relative px-6 py-24 md:px-10" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-5xl">
        <FolioMarker numeral="I" label="The Problem" />
        <h2 className="dira-display-sm max-w-2xl" style={{ color: 'var(--al-ivory)' }}>
          Astrology has been{' '}
          <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>
            flattering
          </span>{' '}
          you, not reading you.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl md:grid-cols-3"
          style={{ border: '1px solid var(--al-line)', background: 'var(--al-line)' }}>
          {items.map((it) => (
            <div key={it.t} className="p-7" style={{ background: 'var(--al-bg)' }}>
              <div className="mb-4 text-3xl" style={{ color: 'var(--al-gold)' }}>{it.g}</div>
              <div className="mb-2 font-serif text-xl" style={{ color: 'var(--al-ivory)' }}>{it.t}</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================== II · COMPLETE SYSTEM ===================== */
export function DirectionAFeatures() {
  const ref = useReveal();
  const { playing, playTone } = useAudioPreview();

  // Interactive Destiny Curve selected milestone
  const [destinyEra, setDestinyEra] = useState<'pivot' | 'zenith' | 'wealth'>('zenith');

  // Interactive AI Palmistry Scanner line selection & scan animation state
  const [palmLine, setPalmLine] = useState<'heart' | 'head' | 'life' | 'fate'>('fate');
  const [isScanningPalm, setIsScanningPalm] = useState(false);

  const triggerPalmScan = () => {
    setIsScanningPalm(true);
    setTimeout(() => {
      setIsScanningPalm(false);
    }, 1200);
  };

  // Interactive Card Active Tabs for Tier 2 (keyed by card id)
  const [tier2Tabs, setTier2Tabs] = useState<Record<string, number>>({
    marriage: 0,
    yogas: 0,
    numerology: 0,
    muhurat: 0,
    vastu: 0,
    jung: 0,
  });

  const setCardTab = (cardId: string, tabIndex: number) => {
    setTier2Tabs((prev) => ({ ...prev, [cardId]: tabIndex }));
  };

  return (
    <section id="features" ref={ref} className="dira-reveal relative overflow-hidden px-6 py-28 md:px-10"
      style={{ background: 'var(--al-bg)' }}>
      <StarField count={50} opacity={0.4} />
      <div className="relative mx-auto max-w-6xl space-y-20">
        
        {/* SECTION HEADER */}
        <div>
          <FolioMarker numeral="II" label="The Complete Vedic Ecosystem" />
          <h2 className="dira-display-sm mb-4" style={{ color: '#1A1A1A' }}>
            25+ specialized engines.
            <span className="italic" style={{ color: '#8C6508' }}> One Unified OS.</span>
          </h2>
          <p className="max-w-3xl text-sm md:text-base leading-relaxed" style={{ color: '#3D3834' }}>
            Beyond simple sun signs and fear-based predictions. AstroLife unifies ancient astronomical shastras,
            Ayurvedic medicine, and Indian classical sound theory with sub-arcsecond Swiss Ephemeris precision.
          </p>
        </div>

        {/* TIER 1: THE 5 HERO / VIRAL WOW ENGINES */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.4)' }}>
              Tier 1 · Flagship Breakthroughs
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#6B635B' }}>
              Core Predictive & Therapeutic Engines
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* 1. DESTINY CURVE */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">📈</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    0–90 Yrs Life Curve
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  Interactive Destiny Curve
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  Never wonder when your golden phase begins. The Destiny Engine plots a continuous 90-year score curve
                  across career, wealth, and life momentum — tracking your exact peak windows, antardasha shifts, and seasons for cautious patience.
                </p>
              </div>

              {/* Real SVG Graph Snap */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                {/* Milestone Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <span className="font-mono text-9px uppercase tracking-wider font-bold" style={{ color: '#8C6508' }}>
                    Select Life Milestone Snap:
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDestinyEra('pivot')}
                      className={`cursor-pointer rounded px-2.5 py-1 text-10px font-medium transition-colors ${
                        destinyEra === 'pivot'
                          ? 'bg-[#B8860B]/15 text-[#785404] border border-[#B8860B] font-bold'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      Age 28 Pivot
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestinyEra('zenith')}
                      className={`cursor-pointer rounded px-2.5 py-1 text-10px font-medium transition-colors ${
                        destinyEra === 'zenith'
                          ? 'bg-[#B8860B]/20 text-[#785404] border border-[#B8860B] font-bold shadow-sm'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      ★ Age 38 Zenith
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestinyEra('wealth')}
                      className={`cursor-pointer rounded px-2.5 py-1 text-10px font-medium transition-colors ${
                        destinyEra === 'wealth'
                          ? 'bg-[#059669]/15 text-[#065f46] border border-[#059669] font-bold'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      Age 58 Wealth
                    </button>
                  </div>
                </div>

                {/* SVG Graph Canvas */}
                <div className="relative mt-3 h-36 w-full overflow-hidden">
                  <svg className="h-full w-full" viewBox="0 0 540 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="destinyArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B8860B" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#B8860B" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="curveLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#64748b" />
                        <stop offset="35%" stopColor="#d97706" />
                        <stop offset="55%" stopColor="#B8860B" />
                        <stop offset="85%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#64748b" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Score Gridlines */}
                    <line x1="30" y1="20" x2="520" y2="20" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />
                    <line x1="30" y1="55" x2="520" y2="55" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />
                    <line x1="30" y1="90" x2="520" y2="90" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />
                    <line x1="30" y1="125" x2="520" y2="125" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />

                    {/* Y-Axis Score Labels */}
                    <text x="5" y="24" fill="#8C6508" fontSize="10" fontFamily="monospace" fontWeight="bold">100</text>
                    <text x="10" y="59" fill="#6B635B" fontSize="9" fontFamily="monospace">75</text>
                    <text x="10" y="94" fill="#6B635B" fontSize="9" fontFamily="monospace">50</text>
                    <text x="10" y="129" fill="#6B635B" fontSize="9" fontFamily="monospace">25</text>

                    {/* Gradient Area Fill */}
                    <path
                      d="M 30 115 C 75 105, 110 80, 150 68 C 175 60, 195 110, 215 116 C 245 124, 260 26, 290 22 C 325 18, 350 82, 380 78 C 410 74, 430 38, 455 42 C 485 46, 505 70, 520 74 L 520 145 L 30 145 Z"
                      fill="url(#destinyArea)"
                    />

                    {/* Continuous Destiny Curve */}
                    <path
                      d="M 30 115 C 75 105, 110 80, 150 68 C 175 60, 195 110, 215 116 C 245 124, 260 26, 290 22 C 325 18, 350 82, 380 78 C 410 74, 430 38, 455 42 C 485 46, 505 70, 520 74"
                      fill="none"
                      stroke="url(#curveLine)"
                      strokeWidth="3.2"
                    />

                    {/* Milestone 1: Age 28 Pivot */}
                    <circle cx="215" cy="116" r={destinyEra === 'pivot' ? 6 : 4} fill="#d97706" stroke="#FFFFFF" strokeWidth="1.5" />
                    {destinyEra === 'pivot' && (
                      <circle cx="215" cy="116" r="10" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 2" className="animate-pulse" />
                    )}

                    {/* Milestone 2: Age 38 Zenith Peak */}
                    <circle cx="290" cy="22" r={destinyEra === 'zenith' ? 7 : 5} fill="#B8860B" stroke="#FFFFFF" strokeWidth="2" />
                    {destinyEra === 'zenith' && (
                      <circle cx="290" cy="22" r="12" fill="none" stroke="#B8860B" strokeWidth="1.8" strokeDasharray="3 3" className="animate-spin" />
                    )}

                    {/* Milestone 3: Age 58 Wealth */}
                    <circle cx="455" cy="42" r={destinyEra === 'wealth' ? 6 : 4} fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />
                    {destinyEra === 'wealth' && (
                      <circle cx="455" cy="42" r="10" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="2 2" className="animate-pulse" />
                    )}

                    {/* X-Axis Baseline and Age Markers */}
                    <line x1="30" y1="145" x2="520" y2="145" stroke="rgba(184, 134, 11, 0.35)" strokeWidth="1" />
                    <text x="30" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 0</text>
                    <text x="135" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 18</text>
                    <text x="205" y="156" fill="#d97706" fontSize="9" fontFamily="monospace" fontWeight="bold">Age 28</text>
                    <text x="278" y="156" fill="#8C6508" fontSize="9" fontFamily="monospace" fontWeight="bold">★ Age 38</text>
                    <text x="368" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 48</text>
                    <text x="445" y="156" fill="#059669" fontSize="9" fontFamily="monospace" fontWeight="bold">Age 58</text>
                    <text x="505" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 90</text>
                  </svg>
                </div>

                {/* Milestone Detail Banner */}
                <div className="mt-3 rounded-lg p-3 text-xs transition-all" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  {destinyEra === 'pivot' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[#92400e]">
                      <span className="font-bold">⚡ Age 28 (Score 54 · Saturn Return):</span>
                      <span className="text-11px text-[#3D3834]">Dismantling fragile ventures, karmic testing, structuring long-term discipline.</span>
                    </div>
                  )}
                  {destinyEra === 'zenith' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[#785404]">
                      <span className="font-bold">★ Age 38 (Score 94 · Zenith Peak):</span>
                      <span className="text-11px text-[#3D3834]">Jupiter Mahadasha + Sun Antardasha in 10th house. Peak career elevation & recognition.</span>
                    </div>
                  )}
                  {destinyEra === 'wealth' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[#065f46]">
                      <span className="font-bold">💎 Age 58 (Score 88 · Dhana Expansion):</span>
                      <span className="text-11px text-[#3D3834]">2nd & 11th house synergy. Major asset compounding, legacy stability & peace.</span>
                    </div>
                  )}
                </div>

                {/* Mahadasha Track Ribbon */}
                <div className="mt-2.5 grid grid-cols-5 text-center text-9px uppercase font-mono tracking-wider text-[#3D3834] gap-1">
                  <div className="rounded py-1 bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)]">0–16 Mars</div>
                  <div className="rounded py-1 bg-[#B8860B]/15 border border-[#B8860B]/40 text-[#785404] font-bold">16–34 Jupiter</div>
                  <div className="rounded py-1 bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)]">34–53 Saturn</div>
                  <div className="rounded py-1 bg-[#059669]/15 border border-[#059669]/30 text-[#065f46] font-semibold">53–70 Mercury</div>
                  <div className="rounded py-1 bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)]">70–90 Ketu</div>
                </div>
              </div>
            </div>

            {/* 2. MEDICAL ASTROLOGY */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🩺</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Charaka & Parashari Shastra
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  Medical Kundli & Astro-Chikitsa
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  Preventive lifestyle intelligence rooted in classical Ayurveda. Cross-verifies your 6th house (Roga), 8th house (Ayushya),
                  and Nakshatra organ rulers with planetary affiliations to compute your Tridosha constitution and detect transit medical vulnerabilities before symptoms arise.
                </p>
              </div>

              {/* Explicit Legal & Medical Disclaimer Callout */}
              <div className="mt-5 rounded-xl p-3.5 border text-xs" style={{ borderColor: 'rgba(184, 134, 11, 0.45)', background: '#FFFDF5' }}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <div className="space-y-0.5">
                    <span className="font-mono text-10px uppercase tracking-wider font-bold block" style={{ color: '#8C6508' }}>
                      Spiritual & Informational Wellness Notice
                    </span>
                    <p className="text-11px leading-relaxed" style={{ color: '#3D3834' }}>
                      For informational and spiritual purposes only. Not a substitute for professional medical advice, clinical diagnosis, or medical treatment.
                      Tridosha and Nakshatra organ mapping are classical Ayurvedic and astrological concepts, not clinical proof. Always consult a licensed medical physician.
                    </p>
                  </div>
                </div>
              </div>

              {/* Constitutional Tridosha Breakdown */}
              <div className="mt-4 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: '#1A1A1A' }}>
                  <span>Constitutional Tridosha Breakdown</span>
                  <span className="text-9px font-semibold px-2 py-0.5 rounded" style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Vata-Pitta Dominant
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-10px font-medium" style={{ color: '#1A1A1A' }}>
                      <span>Vata (Air / Nervous System)</span>
                      <span className="font-bold">46%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#E5DEC9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '46%', background: '#2563EB' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-10px font-medium" style={{ color: '#1A1A1A' }}>
                      <span>Pitta (Fire / Metabolic Agni)</span>
                      <span className="font-bold">36%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#E5DEC9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '36%', background: '#D97706' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-10px font-medium" style={{ color: '#1A1A1A' }}>
                      <span>Kapha (Earth / Fluid Lubrication)</span>
                      <span className="font-bold">18%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#E5DEC9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '18%', background: '#059669' }} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-9px uppercase tracking-wider flex items-center gap-1.5 font-medium" style={{ color: '#8C6508' }}>
                  <span className="font-bold">✦ Early Advisory:</span>
                  <span style={{ color: '#3D3834' }}>Saturn transit activating 6th lord · Astrological advisory: prioritize lumbar spine ergonomics & nervous recovery</span>
                </div>
              </div>
            </div>

            {/* 3. ASTROSOUND THERAPY */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🎵</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Raagas & Circadian Prahar
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  AstroSound & Circadian Raaga Therapy
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  In Indian classical shastra, melody scales (Raagas) are attuned to the 8 diurnal Prahar cycles and the 9 emotional Rasas. AstroLife correlates your active Vimshottari Mahadasha and Antardasha with authentic Raagas to cultivate emotional balance, cognitive focus, and restorative sleep.
                </p>
              </div>

              {/* Curated Classical Engine Raagas with Real Links */}
              <div className="mt-6 rounded-xl p-4 border space-y-3" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: '#1A1A1A' }}>
                  <span>Classical Raagas Mapped from Engine</span>
                  <span className="text-9px font-mono text-[#8C6508]">Prahar & Mood Attunement</span>
                </div>

                <div className="grid gap-2 text-xs">
                  {/* Raag 1 */}
                  <div className="rounded-lg p-3 flex items-center justify-between shadow-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                    <div>
                      <div className="font-bold text-11px" style={{ color: '#1A1A1A' }}>Raag Yaman (Sandhya Prahar)</div>
                      <div className="text-9px text-[#5C5248]">Twilight calmness, emotional warmth & Venus-Jupiter harmony</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href="https://open.spotify.com/search/Raag%20Yaman"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded px-2.5 py-1 text-9px font-bold bg-[#1DB954]/12 text-[#15803d] border border-[#1DB954]/30 hover:bg-[#1DB954]/25 transition-colors"
                      >
                        Spotify ↗
                      </a>
                      <a
                        href="https://www.youtube.com/results?search_query=Raag+Yaman+Indian+Classical"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded px-2.5 py-1 text-9px font-bold bg-[#FF0000]/12 text-[#b91c1c] border border-[#FF0000]/30 hover:bg-[#FF0000]/25 transition-colors"
                      >
                        YouTube ↗
                      </a>
                    </div>
                  </div>

                  {/* Raag 2 */}
                  <div className="rounded-lg p-3 flex items-center justify-between shadow-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                    <div>
                      <div className="font-bold text-11px" style={{ color: '#1A1A1A' }}>Raag Bhairav (Pratham Prahar)</div>
                      <div className="text-9px text-[#5C5248]">Dawn awakening, mental clarity & Surya solar vitality</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href="https://open.spotify.com/search/Raag%20Bhairav"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded px-2.5 py-1 text-9px font-bold bg-[#1DB954]/12 text-[#15803d] border border-[#1DB954]/30 hover:bg-[#1DB954]/25 transition-colors"
                      >
                        Spotify ↗
                      </a>
                      <a
                        href="https://www.youtube.com/results?search_query=Raag+Bhairav+Indian+Classical"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded px-2.5 py-1 text-9px font-bold bg-[#FF0000]/12 text-[#b91c1c] border border-[#FF0000]/30 hover:bg-[#FF0000]/25 transition-colors"
                      >
                        YouTube ↗
                      </a>
                    </div>
                  </div>

                  {/* Raag 3 */}
                  <div className="rounded-lg p-3 flex items-center justify-between shadow-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                    <div>
                      <div className="font-bold text-11px" style={{ color: '#1A1A1A' }}>Raag Darbari Kanada (Nishitha Prahar)</div>
                      <div className="text-9px text-[#5C5248]">Midnight stillness, deep restorative sleep & Saturn grounding</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href="https://open.spotify.com/search/Raag%20Darbari%20Kanada"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded px-2.5 py-1 text-9px font-bold bg-[#1DB954]/12 text-[#15803d] border border-[#1DB954]/30 hover:bg-[#1DB954]/25 transition-colors"
                      >
                        Spotify ↗
                      </a>
                      <a
                        href="https://www.youtube.com/results?search_query=Raag+Darbari+Kanada+Classical"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded px-2.5 py-1 text-9px font-bold bg-[#FF0000]/12 text-[#b91c1c] border border-[#FF0000]/30 hover:bg-[#FF0000]/25 transition-colors"
                      >
                        YouTube ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* Acoustic Tanpura Drone Test */}
                <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <div>
                    <div className="text-11px font-bold" style={{ color: '#1A1A1A' }}>
                      Acoustic Tanpura Harmonic Drone
                    </div>
                    <div className="text-9px text-[#5C5248]">
                      Sa-Pa Meditative Tuning (C#3 / G#3 Natural Harmonics)
                    </div>
                  </div>
                  <button
                    onClick={playTone}
                    disabled={playing}
                    className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-75 flex-shrink-0 shadow-sm"
                    style={{
                      background: 'linear-gradient(180deg, #D4AF37, #B8860B)',
                      color: '#FFFFFF',
                    }}
                  >
                    {playing ? 'Playing Tanpura (5s)...' : '▶ Listen (Tanpura Drone)'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. AI PALMISTRY VISION SCANNER - WITH INTERACTIVE HAND SVG & SPECIMEN REPORT */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">✋</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Experimental Research Feature
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  AI Palmistry Vision Scanner
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  Snap a photo of your palm. Our computer-vision neural pipeline traces key anatomical landmarks and contour line vectors (Heart, Head, Life, and Fate lines). Fuses physical line signatures with your natal chart for experimental cross-verification with birth chart indications (exploratory research, not deterministic fortune prediction).
                </p>
              </div>

              {/* Interactive Palm Diagram & Live Specimen Box */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                {/* Line Selector Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pb-3 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { key: 'heart', label: '❤️ Heart Line', color: '#DC2626' },
                      { key: 'head', label: '🧠 Head Line', color: '#2563EB' },
                      { key: 'life', label: '🌿 Life Line', color: '#059669' },
                      { key: 'fate', label: '⚡ Fate Line', color: '#B8860B' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setPalmLine(item.key as any)}
                        className={`cursor-pointer rounded px-2 py-1 text-9px font-bold transition-all ${
                          palmLine === item.key
                            ? 'bg-[#FFFFFF] border-2 shadow-xs'
                            : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                        }`}
                        style={{
                          borderColor: palmLine === item.key ? item.color : undefined,
                          color: palmLine === item.key ? item.color : undefined,
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={triggerPalmScan}
                    className="cursor-pointer rounded-full px-2.5 py-1 text-9px font-bold transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: isScanningPalm ? '#059669' : 'linear-gradient(180deg, #D4AF37, #B8860B)',
                      color: '#FFFFFF',
                    }}
                  >
                    {isScanningPalm ? 'Scanning...' : '▶ Simulate Scan'}
                  </button>
                </div>

                {/* Hand Palm SVG Illustration */}
                <div className="relative mt-3 h-44 w-full flex items-center justify-center overflow-hidden rounded-lg bg-[#FAF5EB] border" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <svg className="h-full max-w-[280px]" viewBox="0 0 320 220" fill="none">
                    {/* Hand Palm Silhouette */}
                    <path
                      d="M 60 190 C 50 160, 52 110, 65 95 C 68 85, 78 40, 85 45 C 92 50, 95 85, 105 85 C 112 55, 120 20, 130 22 C 140 25, 142 80, 150 80 C 158 50, 170 15, 182 18 C 192 20, 190 80, 200 85 C 208 55, 220 35, 230 40 C 238 45, 230 95, 235 110 C 248 135, 255 170, 240 195 C 220 215, 100 215, 60 190 Z"
                      fill="#FFFFFF"
                      stroke="rgba(184, 134, 11, 0.45)"
                      strokeWidth="2"
                    />

                    {/* MediaPipe 21 Landmark Keypoints */}
                    {[
                      [65, 190], [150, 205], [240, 195], // wrist
                      [70, 135], [78, 90], [85, 45], // thumb
                      [105, 110], [112, 75], [120, 45], [130, 22], // index
                      [150, 110], [158, 70], [170, 40], [182, 18], // middle
                      [190, 115], [198, 75], [208, 50], [220, 35], // ring
                      [225, 125], [232, 95], [238, 70], // pinky
                    ].map(([cx, cy], idx) => (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r={isScanningPalm ? 3.5 : 2}
                        fill="#B8860B"
                        opacity={isScanningPalm ? 0.9 : 0.4}
                        className={isScanningPalm ? 'animate-ping' : ''}
                      />
                    ))}

                    {/* 1. Heart Line */}
                    <path
                      d="M 85 92 C 120 88, 175 92, 225 65"
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth={palmLine === 'heart' ? 4 : 1.8}
                      strokeOpacity={palmLine === 'heart' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* 2. Head Line */}
                    <path
                      d="M 95 115 C 140 118, 185 130, 230 148"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth={palmLine === 'head' ? 4 : 1.8}
                      strokeOpacity={palmLine === 'head' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* 3. Life Line */}
                    <path
                      d="M 95 115 C 115 140, 125 175, 115 198"
                      fill="none"
                      stroke="#059669"
                      strokeWidth={palmLine === 'life' ? 4 : 1.8}
                      strokeOpacity={palmLine === 'life' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* 4. Fate Line */}
                    <path
                      d="M 152 200 C 154 155, 158 110, 155 70"
                      fill="none"
                      stroke="#B8860B"
                      strokeWidth={palmLine === 'fate' ? 4.5 : 2}
                      strokeOpacity={palmLine === 'fate' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* Active Line Indicator Ring */}
                    {palmLine === 'heart' && <circle cx="155" cy="89" r="6" fill="none" stroke="#DC2626" strokeWidth="2" className="animate-pulse" />}
                    {palmLine === 'head' && <circle cx="165" cy="124" r="6" fill="none" stroke="#2563EB" strokeWidth="2" className="animate-pulse" />}
                    {palmLine === 'life' && <circle cx="118" cy="155" r="6" fill="none" stroke="#059669" strokeWidth="2" className="animate-pulse" />}
                    {palmLine === 'fate' && <circle cx="156" cy="135" r="7" fill="none" stroke="#B8860B" strokeWidth="2.5" className="animate-pulse" />}

                    {/* Scanning Beam Animation */}
                    {isScanningPalm && (
                      <line x1="40" y1="20" x2="280" y2="20" stroke="#059669" strokeWidth="3" opacity="0.8">
                        <animate attributeName="y1" values="20;200;20" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="y2" values="20;200;20" dur="1.2s" repeatCount="indefinite" />
                      </line>
                    )}
                  </svg>
                </div>

                {/* Live Specimen Report Card */}
                <div className="mt-3 rounded-lg p-3 text-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span style={{
                      color: palmLine === 'heart' ? '#DC2626' : palmLine === 'head' ? '#2563EB' : palmLine === 'life' ? '#059669' : '#8C6508'
                    }}>
                      ✦ Live Analysis: {palmLine === 'heart' ? 'Heart Line (Emotional Depth)' : palmLine === 'head' ? 'Head Line (Intellect & Focus)' : palmLine === 'life' ? 'Life Line (Vitality Arch)' : 'Fate Line (Saturn Karma Track)'}
                    </span>
                    <span className="font-mono text-9px text-[#059669]">21 Landmark Nodes</span>
                  </div>

                  <p className="text-11px leading-relaxed text-[#3D3834]">
                    {palmLine === 'heart' && 'Deep curved contour terminating near Jupiter mount — indicates high emotional discernment, loyalty in long-term relationships, and heart chakra alignment.'}
                    {palmLine === 'head' && 'Long unbroken path inclining toward upper Moon mount — confirms exceptional analytical clarity, strategic architecture capabilities, and creative problem-solving.'}
                    {palmLine === 'life' && 'Broad continuous arc encircling robust Venus mount — reflects sturdy constitutional stamina, rapid physiological recuperation, and steady immune resistance.'}
                    {palmLine === 'fate' && 'Sharp vertical ascent originating at Age 28 (wrist to Saturn mount) — confirms career autonomy milestone in late 20s, accelerating into prime leadership during Saturn Antardasha.'}
                  </p>

                  <div className="mt-2 pt-2 border-t flex flex-wrap items-center justify-between text-9px uppercase tracking-wider font-semibold" style={{ borderColor: 'rgba(184, 134, 11, 0.15)' }}>
                    <span style={{ color: '#8C6508' }}>
                      {palmLine === 'heart' && 'Fused with 4th House Chandra & Venusian balance'}
                      {palmLine === 'head' && 'Fused with 10th House Budhaditya Yoga'}
                      {palmLine === 'life' && 'Fused with Lagna Lord strength & 8th House'}
                      {palmLine === 'fate' && 'Fused with 10th Lord Saturn Dasha timing'}
                    </span>
                    <span className="text-[#059669] font-mono">🔒 Zero Biometric Retention</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. TRANSIT RIPPLE ENGINE (Full-width card) */}
            <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🌊</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Multi-House Shockwave Engine
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  Planetary Transit Ripple Engine
                </h3>
                <p className="mt-2 text-sm leading-relaxed max-w-4xl" style={{ color: '#3D3834' }}>
                  Major planetary transits never act in isolation. When slow-moving cosmic giants (Saturn, Jupiter, Rahu, Ketu) enter a new rashi,
                  their drishti (aspects) and resonance trigger 4 interconnected houses simultaneously. The Transit Ripple Engine computes these simultaneous ripples across career, wealth, partnerships, and inner mental peace.
                </p>
              </div>

              {/* Ripple Diagram */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                <div className="text-xs font-bold mb-3" style={{ color: '#8C6508' }}>
                  Live Transit Propagation Example (Saturn in Pisces):
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div className="rounded-lg p-3.5 shadow-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    <div className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Epicenter (House 1)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: '#3D3834' }}>Saturn in Pisces conjunct Lagna: Redefining personal identity, discipline & physical stamina.</div>
                  </div>
                  <div className="rounded-lg p-3.5 shadow-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    <div className="font-bold text-sm" style={{ color: '#8C6508' }}>Ripple A (House 3)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: '#3D3834' }}>3rd Drishti on Taurus: Courage, business initiative, communication & contractual shifts.</div>
                  </div>
                  <div className="rounded-lg p-3.5 shadow-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    <div className="font-bold text-sm" style={{ color: '#8C6508' }}>Ripple B (House 7)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: '#3D3834' }}>7th Drishti on Virgo: Serious marriage tests, long-term business partnerships & legal pacts.</div>
                  </div>
                  <div className="rounded-lg p-3.5 shadow-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    <div className="font-bold text-sm" style={{ color: '#8C6508' }}>Ripple C (House 10)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: '#3D3834' }}>10th Drishti on Sagittarius: Culmination of professional karma, promotion or status change.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TIER 2: DECISION & LIFE INTELLIGENCE SUITE (6 Interactive Cards) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.4)' }}>
              Tier 2 · Practical Life Solutions
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#6B635B' }}>
              6 Interactive Decision Engines
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 'marriage',
                icon: '💍',
                title: 'K.N. Rao Marriage Window Scanner',
                badge: 'Double-Transit Sutra',
                desc: 'Identifies the precise 12-month marriage timing window through Jupiter and Saturn mutual aspects on the 7th house and lagna, combined with 36-point Ashtakoota & Nadi Dosha cancellation.',
                tabs: ['Double-Transit Sutra', '36-Point Ashtakoota'],
                previews: [
                  'Both Saturn & Jupiter must aspect 7th house or 7th lord simultaneously for marriage manifestation.',
                  'Ashtakoota 36 Guna Milan with automatic cancellation rules for Nadi Dosha & Bhakoot.',
                ],
              },
              {
                id: 'yogas',
                icon: '⚡',
                title: '300+ Vedic Yogas & 6-Fold Shadbala',
                badge: 'Algorithmic Shastra',
                desc: 'Automatic detection of Raja, Dhana, Gajakesari, and Viparita yogas with Sthana, Dik, Kaala, and Chesta mathematical Shadbala scores to compute genuine planetary strength.',
                tabs: ['Yoga Detector', '6-Fold Shadbala'],
                previews: [
                  'Scans 300+ classical yogas: Gajakesari, Pancha Mahapurusha, Neechbhanga Raja Yoga & Viparita.',
                  'Computes Sthana (positional), Dik (directional), Kaala (temporal), & Chesta (motional) bala.',
                ],
              },
              {
                id: 'numerology',
                icon: '🔢',
                title: 'Vedic & Pythagorean Numerology Matrix',
                badge: 'Name Vibration',
                desc: 'Life Path, Soul Urge, and Destiny Number calculations with Lo-Shu Grid analysis. Optimizes personal and business name spellings for harmonic frequency alignment with your planetary chart.',
                tabs: ['Lo-Shu 3x3 Grid', 'Name Harmonic Tuning'],
                previews: [
                  'Identifies missing numbers and energetic arrows of will, intellect, and prosperity in the 3x3 Lo-Shu grid.',
                  'Compound name vibration tuning to eliminate anti-planetary friction with Lagna & Dasha lords.',
                ],
              },
              {
                id: 'muhurat',
                icon: '⏱️',
                title: '30-Day Precision Shubh Muhurat Scanner',
                badge: 'Auspicious Timing',
                desc: 'Automated 30-day shastra scanner for Vivah, Griha Pravesh, Startup Registration, and Major Investments — pre-calculating Chaughadia, Abhijit, Hora, and eliminating Rahu Kaal pitfalls.',
                tabs: ['Shubh Chaughadia', 'Rahu Kaal Filter'],
                previews: [
                  'Ranks Amrit, Shubh, and Labh Chaughadia windows with Abhijit Muhurat overlap down to the minute.',
                  'Strict negative filtering: eliminates Rahu Kaal, Gulika, Yamaganda, and Bhadra Vishti Karana.',
                ],
              },
              {
                id: 'vastu',
                icon: '🏛️',
                title: '16-Zone Astro-Vastu Directional Engine',
                badge: 'Spatial Alignment',
                desc: 'Maps the 16 Vastu directions of your home or workplace to your planetary strengths. Detects directional blockages without costly architectural demolition, providing subtle element remedies.',
                tabs: ['16-Zone Compass', 'Zero-Demolition Upaya'],
                previews: [
                  'Maps North-East (Ishanya/Jupiter) to South-West (Nairutya/Rahu) to balance personal energy flow.',
                  'Zero-demolition elemental remedies using metals, elemental colors, yantras, and lighting.',
                ],
              },
              {
                id: 'jung',
                icon: '🧠',
                title: 'Jungian Astro-Psychology & Shadow Work',
                badge: 'Subconscious Archetypes',
                desc: 'Bridges Swiss psychoanalyst Carl Jung with ancient Jyotish. Analyzes elemental temperament, shadow archetypes, and subconscious karmic blind spots for authentic psychological growth.',
                tabs: ['Shadow Archetypes', 'Karmic Blind Spots'],
                previews: [
                  'Unveils Rahu-Ketu axis subconscious fixation: unconscious obsessions and repressed potential.',
                  'Actionable shadow integration prompts to turn astrological conflict into psychological maturity.',
                ],
              },
            ].map((card) => {
              const activeIdx = tier2Tabs[card.id] || 0;
              return (
                <div key={card.id} className="flex flex-col justify-between rounded-xl p-6 transition-all duration-300 hover:border-[#B8860B]"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)', boxShadow: '0 4px 16px -2px rgba(184, 134, 11, 0.1)' }}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{card.icon}</span>
                      <span className="font-mono text-9px uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold"
                        style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                        {card.badge}
                      </span>
                    </div>
                    <h4 className="mt-4 font-serif text-lg font-bold" style={{ color: '#1A1A1A' }}>
                      {card.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: '#3D3834' }}>
                      {card.desc}
                    </p>
                  </div>

                  {/* Interactive Tab Chips & Live Preview Box */}
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                    <div className="flex gap-1.5 mb-2">
                      {card.tabs.map((tab, idx) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setCardTab(card.id, idx)}
                          className={`cursor-pointer rounded px-2.5 py-1 text-9px font-mono transition-colors ${
                            activeIdx === idx
                              ? 'bg-[#B8860B]/16 text-[#785404] border border-[#B8860B] font-bold'
                              : 'text-[#6B635B] bg-[#FAF5EB] hover:text-[#1A1A1A] border border-[rgba(184,134,11,0.2)]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="rounded p-2.5 text-10px leading-relaxed border" style={{ background: '#FAF7F2', borderColor: 'rgba(184, 134, 11, 0.2)', color: '#2A2623' }}>
                      <span className="text-[#8C6508] font-mono text-9px font-bold block mb-0.5">✦ Live Engine Logic:</span>
                      {card.previews[activeIdx]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIER 3: THE CLASSICAL VEDIC SUPERCOMPUTER (6 Core Systems) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.4)' }}>
              Tier 3 · Classical Shastra Supercomputer
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#6B635B' }}>
              Deep Mathematical & Epistemological Architecture
            </span>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-3"
            style={{ border: '1px solid rgba(184, 134, 11, 0.3)', background: 'rgba(184, 134, 11, 0.2)' }}>
            {[
              {
                num: '01',
                title: '5-Tier Vimshottari Dasha Hierarchy',
                desc: 'Mahadasha, Antardasha, Pratyantardasha, Sookshma, and Pranadasha computed down to exact hours and minutes for micro-timing life events.'
              },
              {
                num: '02',
                title: 'Daily Panchang & Microsecond Boundaries',
                desc: 'High-precision Drik Siddhanta calculations for Tithi, Vara, Nakshatra, Yoga, and Karana, with exact sunrise, sunset, and twilight transitions.'
              },
              {
                num: '03',
                title: 'Krishnamurti Paddhati (KP System)',
                desc: 'Placidus cusp calculations, 249 sub-lord divisions, 4-step ruling planets, and significators for precise event confirmation.'
              },
              {
                num: '04',
                title: 'Lal Kitab Farman & Practical Upaya',
                desc: 'Identifies sleeping houses, blind planets, ancestral debts (Pitra Rin), and zero-cost, non-commercial household remedies.'
              },
              {
                num: '05',
                title: 'Jaimini Sutras & Chara Karakas',
                desc: 'Atmakaraka soul purpose, Arudha Lagna public illusion, Upapada relationship karma, and Karakamsha spiritual path.'
              },
              {
                num: '06',
                title: '81-Square Sarvatobhadra Chakra & AstroBank',
                desc: 'Classical Sarvatobhadra Nakshatra Vedha matrix alongside our research archive of 4,000+ verified historical charts.'
              },
            ].map((sys) => (
              <div key={sys.title} className="p-6" style={{ background: '#FFFFFF' }}>
                <span className="font-mono text-xs font-bold" style={{ color: '#8C6508' }}>{sys.num}</span>
                <div className="mt-1 font-serif text-base font-bold" style={{ color: '#1A1A1A' }}>{sys.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: '#3D3834' }}>{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ====================== III · A SPECIMEN READING ==================== */
export function DirectionAInsights() {
  const ref = useReveal();
  const msgs = [
    { who: 'you', t: 'Should I take the offer in Berlin?' },
    { who: 'ai', t: 'You are in Jupiter mahādaśā, Saturn antardaśā — a season that rewards patience over speed. The move is sound, but its fruit ripens in 18–24 months. If you can hold steady, go. If you need fast returns, wait for Mercury in April.' },
    { who: 'you', t: 'When does Venus reach my seventh house?' },
    { who: 'ai', t: 'October 19, 14:22 IST. Watch the following three days — someone returns to your life unbidden.' },
  ];
  return (
    <section ref={ref} className="dira-reveal relative px-6 py-24 md:px-10" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-3xl">
        <FolioMarker numeral="III" label="A Specimen Reading" />
        <h2 className="dira-display-sm mb-10" style={{ color: 'var(--al-ivory)' }}>
          It answers from <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>your</span> chart.
        </h2>
        <div className="overflow-hidden rounded-2xl"
          style={{ border: '1px solid var(--al-line-strong)', background: TINT(60), boxShadow: 'var(--al-shadow-lg)' }}>
          <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--al-line)' }}>
            <span className="h-8 w-8 rounded-full"
              style={{ background: 'radial-gradient(circle at 32% 30%, var(--al-gold-bright), var(--al-gold))' }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--al-ivory)' }}>AstroLife</div>
              <div className="text-9px uppercase tracking-widest" style={{ color: 'var(--al-accent)' }}>
                ● reading your chart
              </div>
            </div>
          </div>
          <div className="space-y-3 p-5">
            {msgs.map((m, i) => (
              <div key={i} className="flex" style={{ justifyContent: m.who === 'you' ? 'flex-end' : 'flex-start' }}>
                <div className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: m.who === 'you' ? GOLD_TINT(14) : 'var(--al-surface)',
                    border: `1px solid ${m.who === 'you' ? 'var(--al-line-strong)' : 'var(--al-line)'}`,
                    color: m.who === 'you' ? 'var(--al-gold-bright)' : 'var(--al-ivory-dim)',
                  }}>
                  {m.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================== IV · HOW IT WORKS ======================= */
export function DirectionAHowItWorks() {
  const ref = useReveal();
  const steps = [
    { t: 'Give your birth', d: 'Date, time and place. Thirty seconds, no account.' },
    { t: 'Receive your kundli', d: 'D-1, D-9 and current daśā — yours to keep, forever, no card.' },
    { t: 'Ask anything', d: 'Career, marriage, money, timing. The AI reasons aloud from your chart.' },
    { t: 'Go deeper when ready', d: 'Premium opens KP, Lāl Kitāb, family karma and the printed Blueprint.' },
  ];
  return (
    <section id="how" ref={ref} className="dira-reveal relative px-6 py-24 md:px-10" style={{ background: TINT(35) }}>
      <div className="mx-auto max-w-4xl">
        <FolioMarker numeral="IV" label="The Passage" />
        <h2 className="dira-display-sm mb-12" style={{ color: 'var(--al-ivory)' }}>
          Four steps from birth to <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>clarity.</span>
        </h2>
        <ol className="relative ml-3 border-l" style={{ borderColor: 'var(--al-line-strong)' }}>
          {steps.map((s, i) => (
            <li key={s.t} className="relative pl-10 pb-10 last:pb-0">
              <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full font-mono text-10px"
                style={{ background: 'var(--al-bg)', border: '1px solid var(--al-gold)', color: 'var(--al-gold)' }}>
                {i + 1}
              </span>
              <div className="font-serif text-xl" style={{ color: 'var(--al-ivory)' }}>{s.t}</div>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ============================== V · PRICING ========================= */
export function DirectionAPricing() {
  const ref = useReveal();
  const plans = [
    { tier: 'Free', price: '₹0', note: 'Begin here', primary: false,
      bullets: ['Full Vedic chart (D-1, D-9)', '10 AI questions / month', 'Today’s daśā teaser', 'Daily one-line forecast'],
      cta: 'Cast my free kundli' },
    { tier: 'Premium', price: '₹499', note: 'Most chosen', primary: true,
      bullets: ['Everything in Free', 'Unlimited AI conversations', 'Full daśā · antardaśā · pratyantar', 'KP · Lāl Kitāb · Nāḍī · Vāstu', 'Compatibility & matching', 'Printed Cosmic Blueprint (PDF)'],
      cta: 'Begin Premium' },
    { tier: 'Elite', price: '₹1,999', note: 'For the seekers', primary: false,
      bullets: ['Everything in Premium', 'A named, personalized AI astrologer', 'Family-karma chart linking', 'Annual Varṣaphala forecast', 'Priority WhatsApp line', 'Quarterly human review'],
      cta: 'Go Elite' },
  ];
  return (
    <section id="pricing" ref={ref} className="dira-reveal relative px-6 py-24 md:px-10" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <FolioMarker numeral="V" label="The Subscription" />
        </div>
        <h2 className="dira-display-sm mb-14 text-center" style={{ color: 'var(--al-ivory)' }}>
          Pay only for the <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>depth</span> you want.
        </h2>
        <div className="grid gap-6 md:grid-cols-3 md:items-start">
          {plans.map((p) => (
            <div key={p.tier}
              className="relative flex flex-col rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: p.primary ? TINT(85) : TINT(45),
                border: `1px solid ${p.primary ? 'var(--al-line-strong)' : 'var(--al-line)'}`,
                boxShadow: p.primary ? 'var(--al-shadow-lg)' : 'none',
                transform: p.primary ? 'scale(1.03)' : undefined,
              }}>
              {p.primary && (
                <span className="absolute right-6 top-6 rounded-full px-3 py-1 text-8px font-semibold uppercase tracking-widest"
                  style={{ background: GOLD_TINT(16), color: 'var(--al-gold-bright)', border: '1px solid var(--al-line-strong)' }}>
                  {p.note}
                </span>
              )}
              {!p.primary && (
                <div className="mb-2 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>{p.note}</div>
              )}
              <div className="font-serif text-2xl" style={{ color: 'var(--al-ivory)' }}>{p.tier}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-serif text-4xl" style={{ color: p.primary ? 'var(--al-gold-bright)' : 'var(--al-ivory)' }}>{p.price}</span>
                {p.price !== '₹0' && <span className="text-sm" style={{ color: 'var(--al-ivory-mute)' }}>/mo</span>}
              </div>
              <a href={p.price === '₹0' ? '/onboarding' : '/auth/signup'}
                className="mt-6 cursor-pointer inline-block w-full text-center rounded-full py-3 text-sm font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  background: p.primary ? 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))' : 'transparent',
                  color: p.primary ? 'var(--al-bg)' : 'var(--al-gold)',
                  border: p.primary ? 'none' : '1px solid var(--al-line-strong)',
                }}>
                {p.cta}
              </a>
              <div className="mt-7 space-y-3">
                {p.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-3 text-sm" style={{ color: 'var(--al-ivory-dim)' }}>
                    <span style={{ color: 'var(--al-gold)' }}>✦</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= VI · VOICES ========================== */
export function DirectionATestimonials() {
  const ref = useReveal();
  const quotes = [
    { q: 'It named my Saturn return to the week. I have since deleted three other apps.', n: 'Priya S.', r: 'Product Manager · Bengaluru' },
    { q: 'The remedies felt gentle, never gimmicky. I trust it precisely because it does not try too hard.', n: 'Arjun M.', r: 'Founder · Mumbai' },
    { q: 'I am a scientist and a sceptic. The reasoning it shows beside each prediction is what won me.', n: 'Kavya R.', r: 'Doctor · Delhi' },
  ];
  return (
    <section id="testimonials" ref={ref} className="dira-reveal relative px-6 py-24 md:px-10" style={{ background: TINT(35) }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <FolioMarker numeral="VI" label="Testimonials" />
        </div>
        <h2 className="dira-display-sm mb-14 text-center" style={{ color: 'var(--al-ivory)' }}>
          Trusted by <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>thousands.</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((t) => (
            <figure key={t.n} className="flex flex-col rounded-2xl p-7"
              style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
              <div className="mb-4 font-serif text-3xl leading-none" style={{ color: 'var(--al-gold)' }}>&ldquo;</div>
              <blockquote className="flex-1 font-serif text-lg italic leading-relaxed" style={{ color: 'var(--al-ivory)' }}>
                {t.q}
              </blockquote>
              <figcaption className="mt-6">
                <div className="text-sm font-semibold" style={{ color: 'var(--al-ivory)' }}>{t.n}</div>
                <div className="text-9px uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>{t.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ CLOSING CTA =========================== */
export function DirectionAClosing({ onGetStarted }: { onGetStarted?: () => void }) {
  const ref = useReveal();
  return (
    <section ref={ref} className="dira-reveal dira-grain relative overflow-hidden px-6 py-28 text-center md:px-10"
      style={{ background: 'var(--al-bg)' }}>
      <StarField count={70} opacity={0.6} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.4 }}>
        <CelestialInstrument size={520} style={{ maxWidth: '90vw', maxHeight: '90vw' }} />
      </div>
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, transparent, var(--al-bg) 78%)' }} />
      <div className="relative z-10 mx-auto max-w-2xl">
        <OrnamentDivider />
        <h2 className="dira-display mt-6" style={{ color: 'var(--al-ivory)' }}>
          The sky has been
          <br />
          <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>waiting for you.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-md text-base" style={{ color: 'var(--al-ivory-dim)' }}>
          Cast your chart in thirty seconds. Free, forever, no card.
        </p>
        <button onClick={onGetStarted}
          className="group mt-9 cursor-pointer rounded-full px-10 py-4 text-sm font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.03]"
          style={{
            background: 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))',
            color: 'var(--al-bg)',
            boxShadow: '0 18px 44px -14px color-mix(in srgb, var(--al-gold) 70%, transparent)',
          }}>
          Generate my free kundli
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </section>
  );
}

/* ============================== FOOTER ============================== */
export function DirectionAFooter() {
  const columns: { head: string; links: Array<{label: string; href: string}> }[] = [
    { head: 'Product', links: [
      { label: 'Free Kundli', href: '/onboarding' },
      { label: 'AI Chat', href: '/dashboard/chat' },
      { label: 'Reports', href: '/dashboard/report' },
      { label: 'Pricing', href: '#pricing' },
    ]},
    { head: 'Engines', links: [
      { label: 'KP System', href: '/dashboard/kp' },
      { label: 'Lal Kitab', href: '/dashboard/lalkitab' },
      { label: 'Dasha', href: '/dashboard/dasha' },
      { label: 'All Engines', href: '/dashboard' },
    ]},
    { head: 'Company', links: [
      { label: 'Contact', href: 'mailto:hello@astrolife.ai' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Blog', href: '/blog' },
    ]},
    { head: 'Legal', links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Refunds', href: '/refund' },
    ]},
  ];
  return (
    <footer className="border-t px-6 py-16 md:px-10" style={{ borderColor: 'var(--al-line)', background: TINT(35) }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <svg width="24" height="24" viewBox="-12 -12 24 24" style={{ color: 'var(--al-gold)' }}>
                <circle r="10.5" stroke="currentColor" strokeWidth="0.7" fill="none" />
                <polygon points="0,-6 5,3 -5,3" fill="none" stroke="currentColor" strokeWidth="0.7" />
                <polygon points="0,6 5,-3 -5,-3" fill="none" stroke="currentColor" strokeWidth="0.7" />
              </svg>
              <span className="font-serif text-lg uppercase" style={{ color: 'var(--al-ivory)', letterSpacing: '0.18em' }}>
                AstroLife AI
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
              AI-powered Vedic Astrology Intelligence OS. Guidance-oriented. Precise. Yours forever.
            </p>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.head}>
              <div className="mb-4 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
                {col.head}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--al-ivory-dim)' }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-7 text-center sm:flex-row sm:text-left"
          style={{ borderColor: 'var(--al-line)' }}>
          <div className="text-9px" style={{ color: 'var(--al-ivory-mute)' }}>
            © 2026 AstroLife AI. All rights reserved.
          </div>
          <div className="text-9px italic" style={{ color: 'var(--al-ivory-mute)' }}>
            Guidance-oriented astrology, not fear-based predictions.
          </div>
        </div>
      </div>
    </footer>
  );
}
