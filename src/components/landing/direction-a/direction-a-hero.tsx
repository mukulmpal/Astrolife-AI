'use client';

import { Aurora, StarField } from './celestial';
import { BirthDetailsForm } from './birth-form';

export function DirectionAHero() {
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

            {/* Features */}
            <div className="dira-reveal dira-reveal-4 in mt-8 sm:mt-10 space-y-4">
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 text-xl" style={{ color: 'var(--al-gold-bright)' }}>📈</div>
                <div>
                  <div className="font-semibold text-sm md:text-base" style={{ color: '#8C6508' }}>90-Year Destiny Curve & Transit Ripple</div>
                  <p className="text-xs md:text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Visual life score trajectory, career golden windows & multi-house ripple shocks</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 text-xl" style={{ color: 'var(--al-gold-bright)' }}>🩺</div>
                <div>
                  <div className="font-semibold text-sm md:text-base" style={{ color: '#8C6508' }}>Medical Kundli & Dasha Sound Therapy</div>
                  <p className="text-xs md:text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Nakshatra organ mapping, Tridosha balance & Indian Classical Raagas for active dashas</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 text-xl" style={{ color: 'var(--al-gold-bright)' }}>🏛️</div>
                <div>
                  <div className="font-semibold text-sm md:text-base" style={{ color: '#8C6508' }}>16-Zone Astro-Vastu Radar & Hit Detection</div>
                  <p className="text-xs md:text-sm" style={{ color: 'var(--al-ivory-dim)' }}>45 Devatas, 32 Entrances, 180° Planetary Hits & zero-demolition 120° House Shifting</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 text-xl" style={{ color: 'var(--al-gold-bright)' }}>🛡️</div>
                <div>
                  <div className="font-semibold text-sm md:text-base" style={{ color: '#8C6508' }}>Bio-Wearables, Wrist Threads & Dot Therapy</div>
                  <p className="text-xs md:text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Smartwatch metal shielding, Moli Trap prevention, Somatotopic Skin Ink & 12-Rashi Bindi healing</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 text-xl" style={{ color: 'var(--al-gold-bright)' }}>◈</div>
                <div>
                  <div className="font-semibold text-sm md:text-base" style={{ color: '#8C6508' }}>Multi-System Rigor (KP + Jaimini + Palmistry)</div>
                  <p className="text-xs md:text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Swiss Ephemeris 0.01° sub-lords, 7 Chara Karakas, and authentic Samudrika Shastra hand analysis</p>
                </div>
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
