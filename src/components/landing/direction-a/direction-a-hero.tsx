'use client';

import { Aurora, StarField } from './celestial';
import { BirthDetailsForm } from './birth-form';

interface DirectionAHeroProps {
  onGetStarted?: () => void;
}

export function DirectionAHero({ onGetStarted }: DirectionAHeroProps) {
  return (
    <section
      className="dira-grain relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-28 pb-16 md:px-10"
      style={{ background: 'var(--al-bg)' }}
    >
      <StarField count={110} opacity={0.7} />
      <Aurora />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
          {/* LEFT COLUMN - Content */}
          <div className="space-y-8">
            <p
              className="dira-reveal dira-reveal-1 in mb-8 font-serif text-lg italic md:text-xl"
              style={{ color: 'var(--al-ivory-dim)' }}
            >
              Most astrology apps give you sun signs.
            </p>

            <div className="dira-reveal dira-reveal-1 in mb-7 flex">
              <span className="dira-rule-label">Vedic · Decoded by AI</span>
            </div>

            <h1 className="dira-display dira-reveal dira-reveal-2 in" style={{ color: 'var(--al-ivory)' }}>
              Your destiny,
              <br />
              <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>
                written in the sky.
              </span>
            </h1>

            <p
              className="dira-reveal dira-reveal-3 in max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: 'var(--al-ivory-dim)' }}
            >
              A kundli is not a chart — it is your life&rsquo;s operating system. Career timing, the patterns
              of love, karmic knots, and the precise hour the universe turns in your favour.
            </p>

            {/* Features */}
            <div className="dira-reveal dira-reveal-4 in mt-12 space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">✦</div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--al-gold-bright)' }}>25+ Vedic Engines</div>
                  <p className="text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Yogas, Dasha, Shadbala, KP, Lal Kitab, Vastu, and more</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">⊙</div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--al-gold-bright)' }}>Sidereal Precision</div>
                  <p className="text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Lahiri ayanamsa • Validated against Drik Panchang</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">🤖</div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--al-gold-bright)' }}>AI Astrologer</div>
                  <p className="text-sm" style={{ color: 'var(--al-ivory-dim)' }}>Every answer cited from your chart • No borrowed clichés</p>
                </div>
              </div>
            </div>

            {/* Trust Strip */}
            <div
              className="dira-reveal dira-reveal-5 in mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg sm:grid-cols-3"
              style={{ border: '1px solid var(--al-line)', background: 'var(--al-line)' }}
            >
              {[
                { k: '40,000+', v: 'charts cast' },
                { k: '4.9★', v: '2.1k reviews' },
                { k: '1°', v: 'sidereal accuracy' },
              ].map((s) => (
                <div
                  key={s.v}
                  className="px-3 py-4"
                  style={{ background: 'var(--al-bg)' }}
                >
                  <div className="font-serif text-lg" style={{ color: 'var(--al-gold-bright)' }}>
                    {s.k}
                  </div>
                  <div
                    className="mt-1 text-9px uppercase tracking-widest"
                    style={{ color: 'var(--al-ivory-mute)' }}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Form */}
          <div
            className="dira-reveal dira-reveal-4 in rounded-2xl p-8"
            style={{
              background: 'linear-gradient(135deg, #1c1840 0%, #0d0a22 100%)',
              border: '1px solid #2d2860',
              boxShadow: '0 20px 60px -14px rgba(200, 160, 48, 0.25)',
            }}
          >
            <div className="mb-6">
              <div className="mb-2 text-11px font-semibold uppercase tracking-widest" style={{ color: '#c8a030' }}>
                ✦ Get Started Free
              </div>
              <h3 className="font-serif text-2xl font-600" style={{ color: '#f0e8d0' }}>
                Your Kundli
              </h3>
              <p className="mt-2 text-sm" style={{ color: '#a79fbd' }}>
                In thirty seconds, no account needed.
              </p>
            </div>

            <BirthDetailsForm />
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2" aria-hidden>
        <div
          className="flex flex-col items-center gap-2 text-9px uppercase tracking-[0.3em]"
          style={{ color: 'var(--al-ivory-mute)' }}
        >
          Scroll
          <span
            className="block h-9 w-px dira-float"
            style={{ background: 'linear-gradient(var(--al-gold), transparent)' }}
          />
        </div>
      </div>
    </section>
  );
}
