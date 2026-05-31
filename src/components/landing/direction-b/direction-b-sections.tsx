'use client';

import { ZodiacWheel } from './direction-b-shared';

export function DirectionBSocialBar() {
  const publications = ['YourStory', 'TechCrunch', 'Inc42', 'Forbes India'];

  return (
    <section
      className="flex flex-col items-center gap-2.5 border-b border-t px-6 py-4"
      style={{
        borderColor: 'var(--al-line)',
        background: 'linear-gradient(180deg, var(--al-surface) 30%, transparent)',
      }}
    >
      <div className="text-7px uppercase tracking-wider opacity-80" style={{ color: 'var(--al-ivory-mute)' }}>
        Featured in
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {publications.map((pub) => (
          <div
            key={pub}
            className="font-serif text-sm font-medium tracking-widest opacity-60"
            style={{ color: 'var(--al-ivory-dim)' }}
          >
            {pub}
          </div>
        ))}
      </div>
    </section>
  );
}

export function DirectionBSampleBlueprint() {
  return (
    <section className="px-5 py-9 md:px-8 md:py-12" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="mb-2 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
            Premium · Sample report
          </div>
          <h2
            className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl"
            style={{ color: 'var(--al-ivory)', marginBottom: '10px' }}
          >
            A 48-page PDF, generated for you.
          </h2>
          <p className="text-sm leading-relaxed md:text-base" style={{ color: 'var(--al-ivory-dim)' }}>
            Every chart you keep is exported as a printable Cosmic Blueprint. Editorial typography, sidereal
            calculations, gentle remedies.
          </p>
        </div>

        {/* Stacked Report Screenshots */}
        <div className="relative mx-auto mt-4 h-80 max-w-xs">
          {[2, 1, 0].map((i) => (
            <div
              key={i}
              className="absolute top-0 flex w-52 flex-col justify-between rounded border p-4"
              style={{
                left: '50%',
                height: '280px',
                transform: `translateX(-50%) translateX(${(i - 1) * 22}px) rotate(${(i - 1) * 4}deg)`,
                background: 'linear-gradient(180deg, var(--al-surface), var(--al-surface-2))',
                borderColor: 'var(--al-line-strong)',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.55)',
              }}
            >
              <div className="font-mono text-7px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
                Vol. I · Page {['III', 'II', 'I'][i]}
              </div>
              <div className="flex flex-1 items-center justify-center flex-col">
                {i === 0 && (
                  <>
                    <div className="font-serif text-2xl font-light" style={{ color: 'var(--al-ivory)' }}>
                      Your
                    </div>
                    <div className="font-serif text-3xl italic" style={{ color: 'var(--al-gold-bright)', marginTop: '-4px' }}>
                      Cosmic
                    </div>
                    <div className="font-serif text-2xl font-light" style={{ color: 'var(--al-ivory)', marginTop: '-4px' }}>
                      Blueprint
                    </div>
                  </>
                )}
                {i === 1 && <ZodiacWheel size={160} color="var(--al-gold)" opacity={0.85} />}
                {i === 2 && (
                  <div className="w-full">
                    <div className="mb-2 text-7px font-semibold uppercase tracking-wider" style={{ color: 'var(--al-gold)' }}>
                      Vimshottari
                    </div>
                    {['Jupiter MD', 'Saturn AD', 'Mercury PD'].map((k, j) => (
                      <div
                        key={j}
                        className="flex justify-between border-b py-1.5 text-10px"
                        style={{
                          borderColor: 'var(--al-line)',
                          color: 'var(--al-ivory-dim)',
                        }}
                      >
                        <span>{k}</span>
                        <span style={{ color: 'var(--al-gold-bright)' }}>{['16y', '2y4m', '9m'][j]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DirectionBFeatures() {
  const features = [
    { glyph: '♈', title: 'Sidereal precision', body: 'Lahiri ayanamsa, Drik Panchang validated. Charts to 1° of accuracy.' },
    { glyph: '♉', title: 'AI conversations', body: 'Ask anything. Get answers that cite your chart, not horoscope clichés.' },
    { glyph: '♊', title: 'Dasha timing', body: 'Vimshottari to the day. Know when, not just what.' },
    { glyph: '♋', title: 'Lal Kitab remedies', body: 'Gentle, practical, household-scale. No expensive pujas.' },
    { glyph: '♌', title: 'Compatibility', body: 'Ashtakoot, Manglik, Nadi dosha — explained in plain Hindi/English.' },
    { glyph: '♍', title: 'Vastu intelligence', body: 'Upload a floor plan. Get directional fixes for sleep, study, work.' },
  ];

  return (
    <section
      className="px-5 py-9 md:px-8 md:py-12"
      style={{
        background: 'var(--al-surface) 30%',
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="mb-2 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
            What&rsquo;s inside
          </div>
          <h2
            className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl"
            style={{ color: 'var(--al-ivory)' }}
          >
            A complete Vedic toolkit.
          </h2>
        </div>

        <div className="flex flex-col">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-3.5 py-4 md:gap-4 md:py-4.5"
              style={{
                borderBottom: i < features.length - 1 ? `1px solid var(--al-line)` : 'none',
              }}
            >
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border text-xl md:h-12 md:w-12"
                style={{
                  background: 'linear-gradient(135deg, var(--al-gold) 25%, var(--al-accent) 15%)',
                  borderColor: 'var(--al-line)',
                  color: 'var(--al-gold)',
                }}
              >
                {f.glyph}
              </div>
              <div className="flex-1 pt-0.5">
                <div className="mb-0.5 text-sm font-semibold tracking-tighter md:text-base" style={{ color: 'var(--al-ivory)' }}>
                  {f.title}
                </div>
                <div className="text-11px leading-relaxed md:text-12px" style={{ color: 'var(--al-ivory-dim)' }}>
                  {f.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DirectionBHowItWorks() {
  const steps = [
    { n: '01', title: 'Birth details', body: 'Date, time and place. Thirty seconds.' },
    { n: '02', title: 'Free Vedic kundli', body: 'D-1, D-9, current Dasha. Yours forever, no card needed.' },
    { n: '03', title: 'Ask AstroLife AI', body: 'Career, marriage, money, timing. The AI reasons from your chart.' },
    { n: '04', title: 'Go deep when ready', body: 'Premium unlocks the full operating system — dasha, KP, Lal Kitab, PDF report.' },
  ];

  return (
    <section className="px-5 py-9 md:px-8 md:py-12" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="mb-2 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
            How it works
          </div>
          <h2
            className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl"
            style={{ color: 'var(--al-ivory)' }}
          >
            Four steps to your chart.
          </h2>
        </div>

        <div className="flex flex-col gap-3.5">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex gap-3.5 rounded-lg border p-3.5 md:gap-4 md:p-4"
              style={{
                background: 'linear-gradient(180deg, var(--al-surface) 80%, var(--al-surface-2) 60%)',
                borderColor: 'var(--al-line)',
              }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold md:h-9 md:w-9"
                style={{
                  color: 'var(--al-gold)',
                  borderColor: 'var(--al-line-strong)',
                }}
              >
                {s.n[1]}
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-sm font-semibold md:text-base" style={{ color: 'var(--al-ivory)' }}>
                  {s.title}
                </div>
                <div className="text-11px md:text-12px" style={{ color: 'var(--al-ivory-dim)' }}>
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
