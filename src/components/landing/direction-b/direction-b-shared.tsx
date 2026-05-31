'use client';

import { useMemo } from 'react';

/**
 * Shared SVG components and utilities for Direction B landing
 */

export function ZodiacWheel({
  size = 320,
  color = 'var(--al-gold)',
  opacity = 0.18,
  rotate = 0,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  rotate?: number;
}) {
  const glyphs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  const r = 130;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-160 -160 320 320"
      style={{
        opacity,
        transform: `rotate(${rotate}deg)`,
        transition: 'transform 1.2s ease',
      }}
    >
      <circle r="150" fill="none" stroke={color} strokeWidth="0.6" />
      <circle r="138" fill="none" stroke={color} strokeWidth="0.3" />
      <circle r="100" fill="none" stroke={color} strokeWidth="0.4" opacity="0.5" />
      <circle r="74" fill="none" stroke={color} strokeWidth="0.4" opacity="0.4" />
      <g stroke={color} strokeWidth="0.3" opacity="0.55">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 138}
              y1={Math.sin(a) * 138}
              x2={Math.cos(a) * 150}
              y2={Math.sin(a) * 150}
            />
          );
        })}
      </g>
      <g
        fontFamily="Inter"
        fontSize="11"
        fill={color}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {glyphs.map((g, i) => {
          const a = ((i * 30 - 75) * Math.PI) / 180;
          return (
            <text key={i} x={Math.cos(a) * r} y={Math.sin(a) * r}>
              {g}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export function StarField({ density = 60, opacity = 0.5 }: { density?: number; opacity?: number }) {
  // Deterministic pseudo-random so SSR and client render identically
  // (and so the field is stable across re-renders — no impure calls).
  const stars = useMemo(() => {
    let seed = 11;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: density }).map(() => ({
      x: rnd() * 100,
      y: rnd() * 100,
      s: rnd() * 1.4 + 0.3,
      o: rnd() * 0.7 + 0.2,
    }));
  }, [density]);

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
      }}
    >
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={star.s}
          fill="#fff"
          opacity={star.o}
        />
      ))}
    </svg>
  );
}

export function GoldRule({ width = '100%', opacity = 0.6 }: { width?: string; opacity?: number }) {
  return (
    <div
      style={{
        width,
        height: 1,
        opacity,
        background: 'linear-gradient(90deg, transparent, var(--al-gold), transparent)',
      }}
    />
  );
}

export function Diamond({ size = 8, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `1px solid ${color}`,
        transform: 'rotate(45deg)',
      }}
    />
  );
}
