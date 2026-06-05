'use client';

import { CelestialInstrument, FolioMarker, OrnamentDivider, StarField, useReveal } from './celestial';

const TINT = (pct: number) =>
  `color-mix(in srgb, var(--al-surface) ${pct}%, transparent)`;
const GOLD_TINT = (pct: number) =>
  `color-mix(in srgb, var(--al-gold) ${pct}%, transparent)`;

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
  const features = [
    { t: 'Sidereal precision', d: 'Lahiri ayanāṁśa, validated against Drik Panchang. Charts true to a single degree.' },
    { t: 'Vimśottarī timing', d: 'Daśā to the very day — you learn when, not merely what.' },
    { t: 'Reasoning AI', d: 'Every word is drawn from your chart and cited. No borrowed clichés.' },
    { t: 'Six systems, one lens', d: 'Parāśarī, KP, Lāl Kitāb, Nāḍī, Jaimini and Vāstu, cross-read for you.' },
    { t: 'Compatibility', d: 'Aṣṭakūṭa, Maṅglik and Nāḍī doṣa, explained in plain language.' },
    { t: 'Gentle remedies', d: 'Household-scale upāya. No fear, no expensive pūjā.' },
  ];
  return (
    <section id="features" ref={ref} className="dira-reveal relative overflow-hidden px-6 py-24 md:px-10"
      style={{ background: TINT(35) }}>
      <StarField count={50} opacity={0.4} />
      <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-1 lg:items-center">
        {/* content: the catalogue */}
        <div>
          <FolioMarker numeral="II" label="Complete System" />
          <h2 className="dira-display-sm mb-4" style={{ color: 'var(--al-ivory)' }}>
            25+ engines.
            <span className="italic" style={{ color: 'var(--al-gold-bright)' }}> One AI.</span>
          </h2>
          <p className="mb-10 text-sm" style={{ color: 'var(--al-ivory-mute)' }}>
            <span style={{ color: 'var(--al-gold)' }}>25+ astrology engines</span> &middot;{' '}
            <span style={{ color: 'var(--al-gold)' }}>30+ modules</span> &middot; one unified AI Vedic operating system.
          </p>
          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {features.map((f, i) => (
              <div key={f.t} className="border-t pt-4" style={{ borderColor: 'var(--al-line)' }}>
                <div className="mb-1 flex items-baseline gap-3">
                  <span className="font-mono text-xs" style={{ color: 'var(--al-gold)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-lg" style={{ color: 'var(--al-ivory)' }}>{f.t}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>{f.d}</p>
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
