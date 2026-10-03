'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Scroll reveal — adds `.in` when the element enters the viewport.   */
/* ------------------------------------------------------------------ */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.02) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold, rootMargin: '150px 0px 0px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/* ------------------------------------------------------------------ */
/*  CelestialInstrument — the layered orrery / star-chart centrepiece. */
/*  Concentric rings, degree ticks, zodiac rim, orbiting grahas, sun.  */
/* ------------------------------------------------------------------ */
// Trailing U+FE0E forces text (monochrome) presentation so these render as
// fine line-glyphs in the SVG gold fill, not the OS colour-emoji tiles.
const ZODIAC = [
  '♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎',
  '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎',
];

// Round trig output so SSR and client serialise byte-identical strings
// (otherwise the last float digit differs → React hydration warning).
const r2 = (n: number) => Math.round(n * 100) / 100;

export function CelestialInstrument({
  size = 560,
  className = '',
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Orbiting planet positions (fixed seed → no hydration mismatch).
  const planets = useMemo(
    () => [
      { r: 96, a: 18, d: 5.5, c: 'var(--al-gold-bright)' },
      { r: 150, a: 212, d: 4, c: 'var(--al-accent)' },
      { r: 150, a: 96, d: 3, c: 'var(--al-gold)' },
      { r: 206, a: 300, d: 4.5, c: 'var(--al-accent2, var(--al-gold-dim))' },
      { r: 206, a: 140, d: 3, c: 'var(--al-gold-bright)' },
    ],
    [],
  );

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative', ...style }}
      aria-hidden
    >
      {/* soft halo behind the instrument */}
      <div
        style={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--al-gold) 26%, transparent), transparent 62%)',
          filter: 'blur(8px)',
          animation: 'dira-pulse-glow 9s ease-in-out infinite',
        }}
      />

      {/* outer slow ring with zodiac rim */}
      <svg
        viewBox="-280 -280 560 560"
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0, animation: 'dira-spin 140s linear infinite' }}
      >
        <circle r="258" fill="none" stroke="var(--al-line-strong)" strokeWidth="0.8" />
        <circle r="246" fill="none" stroke="var(--al-line)" strokeWidth="0.6" />
        {/* degree ticks */}
        <g stroke="var(--al-gold)" opacity="0.5">
          {Array.from({ length: 72 }).map((_, i) => {
            const a = (i * 5 * Math.PI) / 180;
            const long = i % 6 === 0;
            const r1 = long ? 238 : 244;
            return (
              <line
                key={i}
                x1={r2(Math.cos(a) * r1)}
                y1={r2(Math.sin(a) * r1)}
                x2={r2(Math.cos(a) * 246)}
                y2={r2(Math.sin(a) * 246)}
                strokeWidth={long ? 1 : 0.5}
              />
            );
          })}
        </g>
        {/* zodiac glyphs on the rim */}
        <g fontFamily="var(--al-font-body)" fontSize="15" fill="var(--al-gold-bright)" textAnchor="middle" dominantBaseline="middle">
          {ZODIAC.map((g, i) => {
            const a = ((i * 30 - 75) * Math.PI) / 180;
            return (
              <text key={i} x={r2(Math.cos(a) * 224)} y={r2(Math.sin(a) * 224)}>
                {g}
              </text>
            );
          })}
        </g>
      </svg>

      {/* mid counter-rotating ring with dashed orbits */}
      <svg
        viewBox="-280 -280 560 560"
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0, animation: 'dira-spin-rev 90s linear infinite' }}
      >
        <circle r="206" fill="none" stroke="var(--al-line)" strokeWidth="0.6" strokeDasharray="2 9" />
        <circle r="150" fill="none" stroke="var(--al-line-strong)" strokeWidth="0.6" />
        <circle r="96" fill="none" stroke="var(--al-line)" strokeWidth="0.6" strokeDasharray="1 7" />
        {/* twelve house spokes */}
        <g stroke="var(--al-line)" strokeWidth="0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line key={i} x1={r2(Math.cos(a) * 96)} y1={r2(Math.sin(a) * 96)} x2={r2(Math.cos(a) * 206)} y2={r2(Math.sin(a) * 206)} />
            );
          })}
        </g>
      </svg>

      {/* orbiting grahas (each on its own slow orbit) */}
      {planets.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            animation: `dira-spin ${36 + i * 11}s linear infinite${i % 2 ? ' reverse' : ''}`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: p.d * 2,
              height: p.d * 2,
              marginLeft: -p.d,
              marginTop: -p.d,
              transform: `rotate(${p.a}deg) translateX(${(p.r / 280) * (size / 2)}px)`,
              borderRadius: '50%',
              background: p.c,
              boxShadow: `0 0 ${p.d * 3}px ${p.c}`,
            }}
          />
        </div>
      ))}

      {/* central sun */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 0.13,
          height: size * 0.13,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 36% 32%, var(--al-gold-bright), var(--al-gold) 52%, var(--al-gold-dim))',
          boxShadow: '0 0 60px color-mix(in srgb, var(--al-gold) 60%, transparent)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Aurora — gentle, pre-diffused ambient glow (zero blur overhead).   */
/* ------------------------------------------------------------------ */
export function Aurora() {
  return (
    <>
      <div
        className="pointer-events-none absolute"
        style={{
          top: '-20%',
          right: '-15%',
          width: '65vw',
          height: '65vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(184, 134, 11, 0.04) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: '-20%',
          left: '-15%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.10) 0%, rgba(217, 119, 6, 0.03) 40%, transparent 65%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  StarField — lightweight, deterministic celestial particle field.  */
/* ------------------------------------------------------------------ */
export function StarField({ count = 60, opacity = 0.6 }: { count?: number; opacity?: number }) {
  const stars = useMemo(() => {
    // deterministic pseudo-random so SSR === client
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const maxCount = Math.min(count, 45);
    return Array.from({ length: maxCount }).map(() => ({
      x: Math.round(rnd() * 1000) / 10,
      y: Math.round(rnd() * 1000) / 10,
      r: Math.round((rnd() * 1.0 + 0.3) * 10) / 10,
      o: Math.round((rnd() * 0.45 + 0.2) * 10) / 10,
    }));
  }, [count]);

  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}
      aria-hidden
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill="#B8860B"
          opacity={s.o}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Ornament divider — a fine rule with a centred diamond.             */
/* ------------------------------------------------------------------ */
export function OrnamentDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <span
        style={{
          height: 1,
          width: 'min(120px, 22vw)',
          background: 'linear-gradient(90deg, transparent, var(--al-line-strong))',
        }}
      />
      <span style={{ color: 'var(--al-gold)', fontSize: 11, letterSpacing: '0.3em' }}>
        {label ?? '✦'}
      </span>
      <span
        style={{
          height: 1,
          width: 'min(120px, 22vw)',
          background: 'linear-gradient(90deg, var(--al-line-strong), transparent)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FolioMarker — manuscript-style roman-numeral section index.        */
/* ------------------------------------------------------------------ */
export function FolioMarker({ numeral, label }: { numeral: string; label: string }) {
  return (
    <div className="mb-7 flex items-baseline gap-4">
      <span
        className="font-serif italic"
        style={{ color: 'var(--al-gold)', fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1 }}
      >
        {numeral}
      </span>
      <span
        style={{
          height: 1,
          flex: 1,
          maxWidth: 64,
          background: 'var(--al-line-strong)',
          transform: 'translateY(-6px)',
        }}
      />
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--al-ivory-mute)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* convenience: scroll progress for the parallax wheel */
export function useScrollParallax(factor = 0.15) {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY * factor));
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, [factor]);
  return y;
}
