'use client';

export function DirectionBInsights() {
  const messages = [
    { role: 'user' as const, text: 'Should I take the job offer?' },
    {
      role: 'ai' as const,
      text: "You're in Jupiter MD · Saturn AD. Saturn rules effort and slow yield. The offer is real, but its returns will take 18–24 months. If you can hold patience, take it. If you need quick growth, wait until Mercury AD next April.",
    },
    { role: 'user' as const, text: 'When does Venus enter my 7th?' },
    { role: 'ai' as const, text: "Oct 19, 14:22 IST. You'll notice within 72 hours — someone reaches out unprompted." },
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
            A glimpse of your stars
          </div>
          <h2
            className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl"
            style={{ color: 'var(--al-ivory)' }}
          >
            What AstroLife sees today.
          </h2>
        </div>

        {/* Chat UI */}
        <div
          className="overflow-hidden rounded-xl border"
          style={{
            background: 'var(--al-bg)',
            borderColor: 'var(--al-line-strong)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2.5 border-b p-3.5"
            style={{
              borderColor: 'var(--al-line)',
            }}
          >
            <div
              className="h-7 w-7 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, var(--al-gold-bright), var(--al-gold))',
              }}
            />
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--al-ivory)' }}>
                AstroLife AI
              </div>
              <div className="text-7px uppercase tracking-wider" style={{ color: 'var(--al-accent)' }}>
                ● Online · Reading your chart
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="flex gap-3.5 px-3.5 py-2.5"
                style={{
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <div
                  className="max-w-xs rounded-2xl border px-3 py-2.5 text-sm leading-relaxed"
                  style={{
                    background: msg.role === 'user' ? `var(--al-gold) 10%` : 'var(--al-surface)',
                    borderColor: msg.role === 'user' ? 'var(--al-line-strong)' : 'var(--al-line)',
                    color: msg.role === 'user' ? 'var(--al-gold-bright)' : 'var(--al-ivory-dim)',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            className="flex items-center gap-2 border-t p-3.5"
            style={{
              borderColor: 'var(--al-line)',
            }}
          >
            <div
              className="flex-1 rounded-full border px-3 py-2.5 text-11px"
              style={{
                background: 'var(--al-bg)',
                borderColor: 'var(--al-line)',
                color: 'var(--al-ivory-mute)',
              }}
            >
              Ask anything about your chart…
            </div>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border-none text-lg font-bold"
              style={{
                background: 'var(--al-gold)',
                color: 'var(--al-bg)',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DirectionBPricing() {
  const plans = [
    {
      tier: "Free",
      price: "₹0",
      period: "forever",
      tag: "Begin here",
      bullets: ["Full Vedic birth chart (D-1, D-9)", "10 AI questions per month", "Today's Dasha & Gochar teaser", "Daily one-line forecast"],
      primary: false,
    },
    {
      tier: "Premium",
      price: "₹499",
      period: "per month",
      tag: "Most chosen",
      bullets: [
        "Everything in Free",
        "Unlimited AI conversations",
        "Full Dasha · Antardasha · Pratyantar",
        "KP, Lal Kitab, Nadi, Vastu modules",
        "Compatibility & matching",
        "PDF Cosmic Blueprint export",
      ],
      primary: true,
    },
    {
      tier: "Elite",
      price: "₹1,999",
      period: "per month",
      tag: "For the seekers",
      bullets: [
        "Everything in Premium",
        "Personal AI astrologer (named, personalized)",
        "Family-karma chart linking",
        "Annual Varshaphala forecast",
        "Priority WhatsApp assistant",
        "Quarterly human astrologer review",
      ],
      primary: false,
    },
  ];

  return (
    <section className="px-5 py-9 md:px-8 md:py-12" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-2 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
            Pricing
          </div>
          <h2
            className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl"
            style={{ color: 'var(--al-ivory)' }}
          >
            Pay for what you use.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className="flex flex-col rounded-lg border p-5 md:p-6"
              style={{
                background: plan.primary ? `var(--al-surface)` : `var(--al-surface) 50%`,
                borderColor: plan.primary ? 'var(--al-line-strong)' : 'var(--al-line)',
                boxShadow: plan.primary ? '0 14px 32px -8px var(--al-gold) 25%' : undefined,
              }}
            >
              <div className="mb-4">
                <div className="mb-2 text-11px font-semibold uppercase tracking-wider" style={{ color: 'var(--al-gold)' }}>
                  {plan.tag}
                </div>
                <div
                  className="text-2xl font-semibold md:text-3xl"
                  style={{
                    color: plan.primary ? 'var(--al-gold-bright)' : 'var(--al-ivory)',
                  }}
                >
                  {plan.price}
                </div>
                <div className="text-10px" style={{ color: 'var(--al-ivory-mute)' }}>
                  {plan.period}
                </div>
              </div>

              <button
                className="mb-6 w-full rounded-lg border-none py-2.5 text-sm font-semibold"
                style={{
                  background: plan.primary ? 'var(--al-gold)' : 'transparent',
                  color: plan.primary ? 'var(--al-bg)' : 'var(--al-gold)',
                  border: plan.primary ? 'none' : '1px solid var(--al-line-strong)',
                }}
              >
                {plan.tier === 'Free' ? 'Generate My Free Kundli' : `Start ${plan.tier}`}
              </button>

              <div className="flex flex-col gap-2.5">
                {plan.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-2">
                    <div
                      className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full"
                      style={{ background: 'var(--al-gold)' }}
                    />
                    <div className="text-11px" style={{ color: 'var(--al-ivory-dim)' }}>
                      {bullet}
                    </div>
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

export function DirectionBTestimonials() {
  const testimonials = [
    { name: 'Priya S.', role: 'Product Manager, Bengaluru', quote: "Predicted my Saturn return to the week. I've cancelled three other apps.", rating: 5 },
    {
      name: 'Arjun M.',
      role: 'Founder, Mumbai',
      quote: "The Lal Kitab remedies felt right — gentle, not gimmicky. I trust it because it doesn't try too hard.",
      rating: 5,
    },
    {
      name: 'Kavya R.',
      role: 'Doctor, Delhi',
      quote: "I'm a scientist and a sceptic. The reasoning AstroLife shows alongside each prediction is what won me over.",
      rating: 5,
    },
  ];

  return (
    <section
      className="px-5 py-9 md:px-8 md:py-12"
      style={{
        background: 'var(--al-surface) 30%',
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-2 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
            Loved by users
          </div>
          <h2
            className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl"
            style={{ color: 'var(--al-ivory)' }}
          >
            Real people, real results.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-lg border p-5 md:p-6"
              style={{
                background: 'var(--al-surface)',
                borderColor: 'var(--al-line)',
              }}
            >
              <div className="mb-3 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: 'var(--al-gold)' }}>
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-4 flex-1 text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--al-ivory)' }}>
                  {t.name}
                </div>
                <div className="text-10px" style={{ color: 'var(--al-ivory-mute)' }}>
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DirectionBFaq() {
  const faqs = [
    { q: "How accurate are AstroLife kundlis?", a: "We use sidereal (Lahiri ayanamsa) calculations validated against Drik Panchang. Birth time accurate to a minute gives a chart accurate to 1°." },
    { q: "Is my birth data private?", a: "End-to-end encrypted on our servers, never shared. You can delete your chart and conversations at any time." },
    { q: "What's in the free plan?", a: "Your full Vedic birth chart, 10 AI questions per month, and a teaser of your current Dasha — enough to know if Astrolife is for you." },
    { q: "Can I cancel anytime?", a: "Yes. Premium and Elite both cancel in one tap inside Settings. No retention emails, no calls." },
  ];

  return (
    <section className="px-5 py-9 md:px-8 md:py-12" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2
            className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl"
            style={{ color: 'var(--al-ivory)' }}
          >
            Frequently asked.
          </h2>
        </div>

        <div className="flex flex-col gap-0">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="flex flex-col border-b py-4 md:py-5"
              style={{ borderColor: 'var(--al-line)' }}
            >
              <summary className="cursor-pointer text-sm font-semibold md:text-base" style={{ color: 'var(--al-ivory)' }}>
                {faq.q}
              </summary>
              <p className="mt-2.5 text-11px leading-relaxed md:text-12px" style={{ color: 'var(--al-ivory-dim)' }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DirectionBFooter() {
  return (
    <footer
      className="border-t px-5 py-8 text-center md:px-8 md:py-12"
      style={{
        borderColor: 'var(--al-line)',
        background: 'var(--al-surface) 30%',
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 font-serif text-lg font-medium" style={{ color: 'var(--al-ivory)' }}>
          AstroLife
        </div>
        <p className="mb-6 text-11px md:text-12px" style={{ color: 'var(--al-ivory-dim)' }}>
          AI-Powered Vedic Astrology · Free Kundli · Personal Remedies
        </p>
        <div className="flex justify-center gap-6">
          {['Privacy', 'Terms', 'Twitter', 'Instagram'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-10px font-semibold uppercase tracking-wider hover:opacity-80"
              style={{ color: 'var(--al-gold)' }}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="mt-6 text-10px" style={{ color: 'var(--al-ivory-mute)' }}>
          © 2026 AstroLife. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
