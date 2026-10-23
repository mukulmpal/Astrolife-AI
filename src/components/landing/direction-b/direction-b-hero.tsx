'use client';

import { useState } from 'react';
import { ZodiacWheel, StarField } from './direction-b-shared';

interface DirectionBHeroProps {
  onSubmit?: (data: { date: string; time: string; place: string }) => void;
}

export function DirectionBHero({ onSubmit }: DirectionBHeroProps) {
  const [date, setDate] = useState('1991-03-14');
  const [time, setTime] = useState('04:42');
  const [place, setPlace] = useState('Mumbai, India');
  const [computed, setComputed] = useState(false);

  const handleSubmit = () => {
    setComputed(true);
    onSubmit?.({ date, time, place });
  };

  return (
    <section className="relative overflow-hidden px-5 py-8 md:px-8 md:py-16" style={{ background: 'var(--al-bg)' }}>
      <StarField density={30} opacity={0.35} />

      {/* Decorative glows */}
      <div
        className="pointer-events-none absolute -right-20 -top-16 h-96 w-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--al-accent) 0%, transparent 65%)',
          opacity: 0.15,
        }}
      />
      <div
        className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--al-gold) 0%, transparent 65%)',
          opacity: 0.1,
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        {/* LEFT: Text Content */}
        <div>
          {/* Eyebrow */}
          <div
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-8px font-semibold uppercase tracking-widest"
            style={{
              borderColor: 'var(--al-line-strong)',
              background: 'var(--al-gold) 10%',
              color: 'var(--al-gold-bright)',
            }}
          >
            <span
              className="inline-block h-1 w-1 rounded-full"
              style={{
                background: 'var(--al-accent)',
                boxShadow: '0 0 8px var(--al-accent)',
              }}
            />
            AI-Powered Vedic Astrology
          </div>

          {/* Headline */}
          <h1
            className="font-serif text-3xl font-normal leading-tight tracking-tight md:text-5xl"
            style={{ color: 'var(--al-ivory)', marginBottom: '6px' }}
          >
            Your free Vedic kundli.
          </h1>
          <h1
            className="font-serif text-3xl font-normal italic leading-tight tracking-tight md:text-5xl"
            style={{ color: 'var(--al-gold-bright)', marginBottom: '18px' }}
          >
            In thirty seconds.
          </h1>

          {/* Subheading */}
          <p
            className="mb-8 text-sm leading-relaxed md:text-base"
            style={{ color: 'var(--al-ivory-dim)' }}
          >
            Personal AI astrologer for kundli, dasha, remedies, relationships, career and timing. Used by 40,000+ Indians.
          </p>

          {/* Social Proof */}
          <div className="flex items-center gap-6">
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full"
                    style={{ background: 'var(--al-gold)' }}
                  />
                ))}
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--al-ivory)' }}>
                40,000+ Indians
              </div>
              <div className="text-10px" style={{ color: 'var(--al-ivory-mute)' }}>
                charting with AstroLife
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'var(--al-line)' }} />
            <div>
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} style={{ color: 'var(--al-gold)', fontSize: '14px' }}>
                    ★
                  </span>
                ))}
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--al-ivory)' }}>
                4.9
              </div>
              <div className="text-10px" style={{ color: 'var(--al-ivory-mute)' }}>
                App Store · 2.1k reviews
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Birth Details Widget */}
        <div>
          <div
            className="relative rounded-lg border p-5 md:p-6"
            style={{
              background: 'linear-gradient(180deg, var(--al-surface), var(--al-surface-2))',
              borderColor: 'var(--al-line-strong)',
              boxShadow: '0 24px 48px -16px rgba(0,0,0,0.5), 0 0 0 1px var(--al-gold) 15%',
            }}
          >
            {/* Step Indicator */}
            <div className="mb-4 flex items-center justify-between">
              <div className="text-8px font-semibold uppercase tracking-wider" style={{ color: 'var(--al-gold)' }}>
                जन्म विवरण • Birth details
              </div>
              <div className="text-9px font-semibold" style={{ color: 'var(--al-gold-dim)' }}>
                Step 1 of 1
              </div>
            </div>
            {/* Date & Time Grid */}
            <div className="mb-2.5 grid grid-cols-2 gap-2.5">
              {/* Date Field */}
              <label className="flex flex-col gap-1">
                <span className="text-7px font-medium uppercase tracking-wider" style={{ color: 'var(--al-ivory-mute)' }}>
                  Date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded border px-2.5 py-2 text-11px font-medium outline-none"
                  style={{
                    background: 'var(--al-bg) 90%',
                    color: 'var(--al-ivory)',
                    borderColor: 'var(--al-line)',
                    colorScheme: 'dark',
                  }}
                />
              </label>

              {/* Time Field */}
              <label className="flex flex-col gap-1">
                <span className="text-7px font-medium uppercase tracking-wider" style={{ color: 'var(--al-ivory-mute)' }}>
                  Time (IST)
                </span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded border px-2.5 py-2 text-11px font-medium outline-none"
                  style={{
                    background: 'var(--al-bg) 90%',
                    color: 'var(--al-ivory)',
                    borderColor: 'var(--al-line)',
                    colorScheme: 'dark',
                  }}
                />
              </label>
            </div>

            {/* Place Field */}
            <label className="mb-3.5 flex flex-col gap-1">
              <span className="text-7px font-medium uppercase tracking-wider" style={{ color: 'var(--al-ivory-mute)' }}>
                Place
              </span>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="City, Country"
                className="w-full rounded border px-2.5 py-2 text-11px font-medium outline-none"
                style={{
                  background: 'var(--al-bg) 90%',
                  color: 'var(--al-ivory)',
                  borderColor: 'var(--al-line)',
                }}
              />
            </label>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full cursor-pointer rounded border-none py-3.5 font-semibold tracking-widest"
              style={{
                background: 'var(--al-gold)',
                color: 'var(--al-bg)',
                fontSize: '13px',
                boxShadow: '0 8px 22px var(--al-gold) 25%',
              }}
            >
              Generate My Free Kundli →
            </button>

            {/* Result Preview */}
            {computed && (
              <div
                className="mt-3.5 flex gap-3.5 rounded border p-3.5"
                style={{
                  background: 'var(--al-bg) 50%',
                  borderColor: 'var(--al-line)',
                  animation: 'fadeIn 0.5s',
                }}
              >
                <div className="flex-shrink-0">
                  <ZodiacWheel size={70} color="var(--al-gold)" opacity={0.85} />
                </div>
                <div className="flex-1">
                  <div className="text-7px font-semibold uppercase tracking-wider" style={{ color: 'var(--al-gold-dim)', marginBottom: '3px' }}>
                    Your Lagna
                  </div>
                  <div className="font-serif text-xl italic leading-tight" style={{ color: 'var(--al-gold-bright)' }}>
                    Gemini Ascendant
                  </div>
                  <div className="mt-0.5 text-10px leading-tight" style={{ color: 'var(--al-ivory-dim)' }}>
                    Sun in Pisces · Moon in Aries
                  </div>
                </div>
              </div>
            )}

            {/* Footer text */}
            <div className="mt-3 text-center text-7px uppercase tracking-wider" style={{ color: 'var(--al-ivory-mute)' }}>
              No card required · Free forever
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
