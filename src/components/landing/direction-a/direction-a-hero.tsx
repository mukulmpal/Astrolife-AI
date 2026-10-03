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
              Most astrology apps give you sun signs.
            </p>

            <div className="dira-reveal dira-reveal-1 in mb-5 sm:mb-7 flex">
              <span className="dira-rule-label">✦ AI Vedic Intelligence OS · 25+ Engines</span>
            </div>

            <h1 className="dira-display dira-reveal dira-reveal-2 in" style={{ color: 'var(--al-ivory)' }}>
              Your destiny,
              <br />
              <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>
                written in the sky.
              </span>
            </h1>

            <p
              className="dira-reveal dira-reveal-3 in max-w-xl text-sm sm:text-base leading-relaxed md:text-lg"
              style={{ color: 'var(--al-ivory-dim)' }}
            >
              A kundli is not a chart — it is your life&rsquo;s operating system. 90-year destiny curves,
              planetary sound therapy, medical ayurvedic blueprints, and the precise hour the universe turns in your favour.
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
                <div className="flex-shrink-0 text-xl" style={{ color: 'var(--al-gold-bright)' }}>◈</div>
                <div>
                  <div className="font-semibold text-sm md:text-base" style={{ color: '#8C6508' }}>Sub-Arcsecond Sidereal Precision & AI</div>
                  <p className="text-xs md:text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Swiss Ephemeris 0.01° accuracy • Every answer cited from classical Shastra</p>
                </div>
              </div>
            </div>

            {/* Trust Strip */}
            <div
              className="dira-reveal dira-reveal-5 in mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-lg"
              style={{ border: '1px solid rgba(184, 134, 11, 0.3)', background: 'rgba(184, 134, 11, 0.2)' }}
            >
              {[
                { k: '40,000+', v: 'charts cast' },
                { k: '4.9★', v: 'verified reviews' },
                { k: '0.01°', v: 'Swiss precision' },
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
