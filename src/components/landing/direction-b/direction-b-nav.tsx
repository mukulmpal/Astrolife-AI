'use client';

interface DirectionBNavProps {
  onGetStarted?: () => void;
}

export function DirectionBNav({ onGetStarted }: DirectionBNavProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-opacity-88 px-5 py-3.5 backdrop-blur-2xl"
      style={{
        background: 'var(--al-bg)',
        borderColor: 'var(--al-line)',
      }}
    >
      <div className="flex items-center gap-2">
        {/* AstroLife Logo */}
        <div className="relative h-7 w-7 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, var(--al-gold-bright), var(--al-gold) 50%, var(--al-gold-dim))',
          }}
        >
          <div className="absolute inset-1/4 rounded-full opacity-85" style={{ background: 'var(--al-bg)' }} />
          <div className="absolute inset-[45%] rounded-full" style={{ background: 'var(--al-gold-bright)' }} />
        </div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--al-ivory)' }}>
          AstroLife
        </span>
        <span className="rounded-full border px-1.5 py-0.5 text-7px font-semibold tracking-wider uppercase"
          style={{
            color: 'var(--al-gold)',
            borderColor: 'var(--al-line)',
          }}
        >
          AI
        </span>
      </div>

      <button
        onClick={onGetStarted}
        className="cursor-pointer rounded-full border-none px-3.5 py-2 text-10px font-semibold tracking-widest"
        style={{
          background: 'var(--al-gold)',
          color: 'var(--al-bg)',
        }}
      >
        Get started
      </button>
    </header>
  );
}
