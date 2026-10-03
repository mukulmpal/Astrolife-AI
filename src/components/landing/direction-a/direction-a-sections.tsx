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
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(528, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      setPlaying(true);

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          ctx.close();
        } catch (_) {}
        setPlaying(false);
      }, 4000);
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

  return (
    <section id="features" ref={ref} className="dira-reveal relative overflow-hidden px-6 py-28 md:px-10"
      style={{ background: TINT(35) }}>
      <StarField count={50} opacity={0.4} />
      <div className="relative mx-auto max-w-6xl space-y-20">
        
        {/* SECTION HEADER */}
        <div>
          <FolioMarker numeral="II" label="The Complete Vedic Ecosystem" />
          <h2 className="dira-display-sm mb-4" style={{ color: 'var(--al-ivory)' }}>
            25+ specialized engines.
            <span className="italic" style={{ color: 'var(--al-gold-bright)' }}> One Unified OS.</span>
          </h2>
          <p className="max-w-3xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
            Beyond simple sun signs and fear-based predictions. AstroLife unifies ancient astronomical shastras,
            Ayurvedic medicine, and Indian classical sound theory with sub-arcsecond Swiss Ephemeris computing.
          </p>
        </div>

        {/* TIER 1: THE 5 HERO / VIRAL WOW ENGINES */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: GOLD_TINT(20), color: 'var(--al-gold-bright)', border: '1px solid var(--al-line-strong)' }}>
              Tier 1 · Flagship Breakthroughs
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>
              Core Predictive & Therapeutic Engines
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* 1. DESTINY CURVE */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line-strong)', boxShadow: 'var(--al-shadow-lg)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">📈</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider"
                    style={{ background: GOLD_TINT(15), color: 'var(--al-gold)' }}>
                    0–90 Yrs Life Curve
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  Interactive Destiny Curve
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
                  Never wonder when your golden phase begins. The Destiny Engine plots a continuous 90-year score curve
                  across career, wealth, and life momentum — tracking your exact peak windows, antardasha shifts, and seasons for cautious patience.
                </p>
              </div>

              {/* Mini visual mockup */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'var(--al-line)', background: TINT(40) }}>
                <div className="flex justify-between text-xs" style={{ color: 'var(--al-gold-bright)' }}>
                  <span>Age 20: Foundation (62)</span>
                  <span className="font-bold">★ Age 34: Peak Golden Era (96)</span>
                  <span>Age 52: Wealth (89)</span>
                </div>
                <div className="relative mt-3 h-10 w-full overflow-hidden rounded">
                  <svg className="h-full w-full" viewBox="0 0 400 60" preserveAspectRatio="none">
                    <path d="M 0 50 Q 80 45, 140 25 T 240 10 T 320 18 T 400 35" fill="none" stroke="var(--al-gold-bright)" strokeWidth="2.5" />
                    <circle cx="240" cy="10" r="4.5" fill="var(--al-gold-bright)" />
                  </svg>
                </div>
                <div className="mt-2 flex justify-between text-9px uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>
                  <span>Rahu MD · Career Focus</span>
                  <span>Jupiter MD · Zenith Growth</span>
                  <span>Saturn MD · Legacy Stability</span>
                </div>
              </div>
            </div>

            {/* 2. MEDICAL ASTROLOGY */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line-strong)', boxShadow: 'var(--al-shadow-lg)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🩺</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider"
                    style={{ background: GOLD_TINT(15), color: 'var(--al-gold)' }}>
                    Charaka & Parashari Shastra
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  Medical Kundli & Astro-Chikitsa
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
                  Preventive healthcare rooted in classical Ayurveda. Cross-verifies your 6th house (Roga), 8th house (Ayushya),
                  and Nakshatra organ rulers with planetary affiliations to compute your Tridosha constitution and detect transit medical vulnerabilities before symptoms arise.
                </p>
              </div>

              {/* Mini visual mockup */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'var(--al-line)', background: TINT(40) }}>
                <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  <span>Constitutional Tridosha Breakdown</span>
                  <span className="text-9px font-normal px-2 py-0.5 rounded" style={{ background: GOLD_TINT(20), color: 'var(--al-gold-bright)' }}>Vata-Pitta Dominant</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-10px" style={{ color: 'var(--al-ivory-dim)' }}>
                      <span>Vata (Air/Nerve)</span>
                      <span>46%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '46%', background: '#60a5fa' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-10px" style={{ color: 'var(--al-ivory-dim)' }}>
                      <span>Pitta (Fire/Metabolic Agni)</span>
                      <span>36%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '36%', background: '#f59e0b' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-10px" style={{ color: 'var(--al-ivory-dim)' }}>
                      <span>Kapha (Earth/Fluid)</span>
                      <span>18%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '18%', background: '#10b981' }} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-9px uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--al-gold-bright)' }}>
                  <span>✦ Early Warning:</span>
                  <span style={{ color: 'var(--al-ivory-dim)' }}>Saturn transit activating 6th lord · Guard nervous system and lower spine</span>
                </div>
              </div>
            </div>

            {/* 3. ASTROSOUND THERAPY */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line-strong)', boxShadow: 'var(--al-shadow-lg)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🎵</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider"
                    style={{ background: GOLD_TINT(15), color: 'var(--al-gold)' }}>
                    Raaga & Hz Science
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  AstroSound & Dasha Frequency Therapy
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
                  Planets are acoustic vibrations. AstroLife maps your active Mahadasha, Antardasha, and Praharas to specific
                  Indian Classical Raagas (Bhairav, Yaman, Darbari) and peer-reviewed Solfeggio frequencies (432Hz, 528Hz) to dissolve restlessness, deepen restorative sleep, and tune your bio-field.
                </p>
              </div>

              {/* Interactive Audio Button */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'var(--al-line)', background: TINT(40) }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--al-ivory)' }}>
                      Jupiter-Mahadasha Harmony Tone
                    </div>
                    <div className="text-10px" style={{ color: 'var(--al-ivory-dim)' }}>
                      432 Hz Healing Fundamental + 528 Hz Solfeggio Resonance
                    </div>
                  </div>
                  <button
                    onClick={playTone}
                    disabled={playing}
                    className="flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-75 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))',
                      color: 'var(--al-bg)',
                    }}
                  >
                    {playing ? 'Playing 4s tone...' : '▶ Listen (4s Tone)'}
                  </button>
                </div>
                {playing && (
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    {[16, 28, 20, 32, 18, 26, 14, 22].map((h, idx) => (
                      <span
                        key={idx}
                        className="w-1 rounded-full animate-pulse"
                        style={{
                          height: `${h}px`,
                          background: 'var(--al-gold-bright)',
                          animationDelay: `${idx * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. AI PALMISTRY VISION SCANNER */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line-strong)', boxShadow: 'var(--al-shadow-lg)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">✋</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider"
                    style={{ background: GOLD_TINT(15), color: 'var(--al-gold)' }}>
                    Computer Vision AI
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  AI Palmistry Vision Scanner
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
                  Snap a photo of your palm. Our computer-vision neural network automatically detects and traces
                  6 primary lines (Heart, Head, Life, Fate, Sun, Mercury) and 8 Mounts — fusing your physical hand lines with your astrological Kundli to confirm birth-time accuracy.
                </p>
              </div>

              {/* Mini visual mockup */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'var(--al-line)', background: TINT(40) }}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold" style={{ color: 'var(--al-ivory)' }}>Computer Vision Pipeline</span>
                  <span className="text-9px font-mono" style={{ color: 'var(--al-gold-bright)' }}>98.2% Line Trace Confidence</span>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-10px">
                  <div className="rounded p-2" style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                    <div className="font-semibold" style={{ color: '#ef4444' }}>Heart Line</div>
                    <div className="text-9px" style={{ color: 'var(--al-ivory-dim)' }}>Deep & Balanced</div>
                  </div>
                  <div className="rounded p-2" style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                    <div className="font-semibold" style={{ color: '#60a5fa' }}>Head Line</div>
                    <div className="text-9px" style={{ color: 'var(--al-ivory-dim)' }}>Curved Creative</div>
                  </div>
                  <div className="rounded p-2" style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                    <div className="font-semibold" style={{ color: '#c8a030' }}>Fate Line</div>
                    <div className="text-9px" style={{ color: 'var(--al-ivory-dim)' }}>Rises at Age 28</div>
                  </div>
                </div>
                <div className="mt-2.5 text-9px text-center uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>
                  Fused with 10th House Sun-Mercury Budhaditya Yoga
                </div>
              </div>
            </div>

            {/* 5. TRANSIT RIPPLE ENGINE (Full-width card) */}
            <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line-strong)', boxShadow: 'var(--al-shadow-lg)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🌊</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider"
                    style={{ background: GOLD_TINT(15), color: 'var(--al-gold)' }}>
                    Multi-House Shockwave Engine
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  Planetary Transit Ripple Engine
                </h3>
                <p className="mt-2 text-sm leading-relaxed max-w-4xl" style={{ color: 'var(--al-ivory-dim)' }}>
                  Major planetary transits never act in isolation. When slow-moving cosmic giants (Saturn, Jupiter, Rahu, Ketu) enter a new rashi,
                  their drishti (aspects) and resonance trigger 4 interconnected houses simultaneously. The Transit Ripple Engine computes these simultaneous ripples across career, wealth, partnerships, and inner mental peace.
                </p>
              </div>

              {/* Ripple Diagram */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'var(--al-line)', background: TINT(40) }}>
                <div className="text-xs font-semibold mb-3" style={{ color: 'var(--al-gold-bright)' }}>
                  Live Transit Propagation Example (Saturn in Pisces):
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div className="rounded-lg p-3" style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                    <div className="font-semibold text-sm" style={{ color: 'var(--al-ivory)' }}>Epicenter (House 1)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>Saturn in Pisces conjunct Lagna: Redefining personal identity, discipline & physical stamina.</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                    <div className="font-semibold text-sm" style={{ color: 'var(--al-gold)' }}>Ripple A (House 3)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>3rd Drishti on Taurus: Courage, business initiative, communication & contractual shifts.</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                    <div className="font-semibold text-sm" style={{ color: 'var(--al-gold)' }}>Ripple B (House 7)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>7th Drishti on Virgo: Serious marriage tests, long-term business partnerships & legal pacts.</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                    <div className="font-semibold text-sm" style={{ color: 'var(--al-gold)' }}>Ripple C (House 10)</div>
                    <div className="text-10px mt-1 leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>10th Drishti on Sagittarius: Culmination of professional karma, promotion or status change.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TIER 2: DECISION & LIFE INTELLIGENCE SUITE */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: GOLD_TINT(20), color: 'var(--al-gold-bright)', border: '1px solid var(--al-line-strong)' }}>
              Tier 2 · Practical Life Solutions
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>
              Relationship Timing, Space & Name Resonance
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '💍',
                title: 'K.N. Rao Marriage Window Scanner',
                badge: 'Double-Transit Sutra',
                desc: 'Identifies the precise 12-month marriage timing window through Jupiter and Saturn mutual aspects on the 7th house and lagna, combined with 36-point Ashtakoota & Nadi Dosha cancellation.'
              },
              {
                icon: '🔢',
                title: 'Vedic & Pythagorean Numerology',
                badge: 'Name Vibration',
                desc: 'Life Path, Soul Urge, and Destiny Number calculations with Lo-Shu Grid analysis. Optimizes personal and business name spellings for harmonic frequency alignment with your planetary chart.'
              },
              {
                icon: '⏱️',
                title: '30-Day Precision Muhurat Scanner',
                badge: 'Auspicious Timing',
                desc: 'Automated 30-day shastra scanner for Vivah, Griha Pravesh, Startup Registration, and Major Investments — pre-calculating Chaughadia, Abhijit, Hora, and eliminating Rahu Kaal pitfalls.'
              },
              {
                icon: '🏛️',
                title: '16-Zone Astro-Vastu Directional Engine',
                badge: 'Spatial Alignment',
                desc: 'Maps the 16 Vastu directions of your home or workplace to your planetary strengths. Detects directional blockages without costly architectural demolition, providing subtle element remedies.'
              },
              {
                icon: '🧠',
                title: 'Jungian Astro-Psychology & Shadow Work',
                badge: 'Subconscious Mind',
                desc: 'Bridges Swiss psychoanalyst Carl Jung with ancient Jyotish. Analyzes elemental temperament, shadow archetypes, and subconscious karmic blind spots for authentic psychological growth.'
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl p-6 transition-all duration-300 hover:border-gold"
                style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{card.icon}</span>
                  <span className="font-mono text-9px uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ background: GOLD_TINT(12), color: 'var(--al-gold)' }}>
                    {card.badge}
                  </span>
                </div>
                <h4 className="mt-4 font-serif text-lg font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  {card.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 3: THE CLASSICAL VEDIC SUPERCOMPUTER */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: GOLD_TINT(20), color: 'var(--al-gold-bright)', border: '1px solid var(--al-line-strong)' }}>
              Tier 3 · Classical Shastra Supercomputer
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>
              Deep Mathematical & Epistemological Architecture
            </span>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-3"
            style={{ border: '1px solid var(--al-line)', background: 'var(--al-line)' }}>
            {[
              {
                num: '01',
                title: 'Krishnamurti Paddhati (KP System)',
                desc: 'Placidus cusp calculations, 249 sub-lord divisions, 4-step ruling planets, and significators for precise event confirmation.'
              },
              {
                num: '02',
                title: 'Lal Kitab Farman & Household Upaya',
                desc: 'Identifies sleeping houses, blind planets, ancestral debts (Pitra Rin), and zero-cost, non-commercial household remedies.'
              },
              {
                num: '03',
                title: 'Jaimini Sutras & Chara Karakas',
                desc: 'Atmakaraka soul purpose, Arudha Lagna public illusion, Upapada relationship karma, and Karakamsha spiritual path.'
              },
              {
                num: '04',
                title: '300+ Vedic Yogas & 6-Fold Shadbala',
                desc: 'Automatic detection of Raja, Dhana, Gajakesari, and Viparita yogas with Sthana, Dik, Kaala, and Chesta mathematical bala scores.'
              },
              {
                num: '05',
                title: '81-Square Sarvatobhadra Chakra',
                desc: 'Classical Sarvatobhadra Nakshatra Vedha matrix, mapping Front, Right, Left, and Diagonal planetary aspects for critical timings.'
              },
              {
                num: '06',
                title: 'AstroBank Research Archive (4,000+ Cases)',
                desc: 'Over 4,000 verified historical charts of scientists, world leaders, and celebrities to validate every planetary rule empirically.'
              },
            ].map((sys) => (
              <div key={sys.title} className="p-6" style={{ background: 'var(--al-bg)' }}>
                <span className="font-mono text-xs" style={{ color: 'var(--al-gold)' }}>{sys.num}</span>
                <div className="mt-1 font-serif text-base font-semibold" style={{ color: 'var(--al-ivory)' }}>{sys.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>{sys.desc}</p>
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
