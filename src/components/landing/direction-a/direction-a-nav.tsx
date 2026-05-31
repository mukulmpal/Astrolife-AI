'use client';

import { useEffect, useState } from 'react';

interface DirectionANavProps {
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

export function DirectionANav({ onSignIn, onGetStarted }: DirectionANavProps) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 transition-all duration-500"
      style={{
        background: solid ? 'color-mix(in srgb, var(--al-bg) 78%, transparent)' : 'transparent',
        backdropFilter: solid ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${solid ? 'var(--al-line)' : 'transparent'}`,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <svg width="26" height="26" viewBox="-12 -12 24 24" style={{ color: 'var(--al-gold)' }}>
            <circle r="10.5" stroke="currentColor" strokeWidth="0.7" fill="none" />
            <polygon points="0,-6 5,3 -5,3" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <polygon points="0,6 5,-3 -5,-3" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <circle r="1.9" fill="var(--al-accent)" />
          </svg>
          <span
            className="font-serif text-lg font-medium uppercase"
            style={{ color: 'var(--al-ivory)', letterSpacing: '0.18em' }}
          >
            AstroLife
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {[
            ['Features', '#features'],
            ['How it works', '#how'],
            ['Pricing', '#pricing'],
            ['Testimonials', '#testimonials'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative text-sm"
              style={{ color: 'var(--al-ivory-dim)' }}
            >
              {label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--al-gold)' }}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/auth/signin"
            className="hidden text-sm font-medium sm:inline"
            style={{ color: 'var(--al-ivory)' }}
          >
            Sign in
          </a>
          <button
            onClick={onGetStarted}
            className="cursor-pointer rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-transform duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))',
              color: 'var(--al-bg)',
            }}
          >
            Generate Free Kundli
          </button>
        </div>
      </div>
    </header>
  );
}
