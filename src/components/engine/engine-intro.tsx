'use client';

/**
 * EngineIntro — Premium intro + description for each astrology engine.
 * Positioned at the top of every engine page, establishes the value proposition.
 */
export function EngineIntro({
  title,
  subtitle,
  description,
  safetyNote,
}: {
  title: string;
  subtitle: string;
  description: string;
  safetyNote?: string;
}) {
  return (
    <div
      className="mb-7 px-5 py-7 md:px-8 md:py-9"
      style={{
        background: 'linear-gradient(180deg, var(--app-card) 60%, transparent)',
        borderBottom: '1px solid var(--app-border)',
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-3 text-11px font-semibold uppercase tracking-widest" style={{ color: '#c8a030' }}>
          ✦ Engine
        </div>
        <h1 className="font-serif text-3xl font-600 leading-tight md:text-4xl" style={{ color: '#f0e8d0', marginBottom: '8px' }}>
          {title}
        </h1>
        <p className="mb-4 text-base leading-relaxed md:text-lg" style={{ color: '#c8c0a8' }}>
          {subtitle}
        </p>
        <p className="max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: '#a79fbd' }}>
          {description}
        </p>
        {safetyNote && (
          <div
            className="mt-4 rounded-lg border p-3 text-sm"
            style={{
              borderColor: 'var(--app-border)',
              background: 'color-mix(in srgb, var(--app-accent) 8%, transparent)',
              color: '#a79fbd',
            }}
          >
            <strong style={{ color: '#f0e8d0' }}>Note: </strong>
            {safetyNote}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * EngineEmptyState — Rich fallback when user chart is missing.
 */
export function EngineEmptyState({
  engineName,
  engineIcon = '⊙',
  whatItAnalyzes,
}: {
  engineName: string;
  engineIcon?: string;
  whatItAnalyzes?: string[];
}) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-16 md:px-8"
      style={{ background: 'var(--app-bg)' }}
    >
      <div className="text-6xl mb-4" style={{ opacity: 0.3 }}>
        {engineIcon}
      </div>
      <h2 className="mb-2 font-serif text-2xl font-600 md:text-3xl" style={{ color: '#f0e8d0' }}>
        Your chart is needed
      </h2>
      <p className="mb-6 max-w-md text-center text-sm md:text-base" style={{ color: '#a79fbd' }}>
        {engineName} uses your birth chart to calculate personalized insights. Create or select a chart to begin.
      </p>

      {whatItAnalyzes && whatItAnalyzes.length > 0 && (
        <div className="mb-8 rounded-lg border p-4 md:p-6" style={{ borderColor: 'var(--app-border)', background: 'var(--app-card)', maxWidth: '380px' }}>
          <div className="mb-3 text-11px font-semibold uppercase tracking-widest" style={{ color: '#c8a030' }}>
            What this engine analyzes:
          </div>
          <ul className="space-y-2">
            {whatItAnalyzes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#c8c0a8' }}>
                <span style={{ color: '#c8a030', marginTop: '2px' }}>✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <a
          href="/onboarding"
          className="rounded-lg border-none px-6 py-3 text-sm font-semibold"
          style={{
            background: '#c8a030',
            color: '#060410',
          }}
        >
          Create My Kundli
        </a>
        <a
          href="/dashboard/history"
          className="rounded-lg border px-6 py-3 text-sm font-semibold"
          style={{
            borderColor: 'var(--app-border)',
            color: '#c8a030',
          }}
        >
          Use Saved Chart
        </a>
      </div>
    </div>
  );
}
