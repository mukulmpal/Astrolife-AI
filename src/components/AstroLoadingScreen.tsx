"use client";

// V1 Orbiting Grahas — full-screen loading overlay.
// Ported from the design handoff: v1_orbits.jsx + shared.jsx.
// Reusable across PDF report generation, palm analysis, and any
// long-running async operation in AstroLife.
//
// Usage:
//   <AstroLoadingScreen visible={isGenerating} statusMessages={LOADING_STEPS} subtitle="28 engines · 65+ pages" />

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Default status messages (astrology report) ────────────────
const DEFAULT_STATUS = [
  "Casting your natal chart…",
  "Mapping the nine grahas…",
  "Charting Vimshottari dasha…",
  "Reading your nakshatras…",
  "Checking yogas & doshas…",
  "Computing shadbala…",
  "Drawing divisional charts…",
  "Tracing the karmic axis…",
  "Composing your remedies…",
  "Inscribing the manuscript…",
];

function useCyclingStatus(messages: string[], ms = 2400) {
  const [i, setI] = useState(0);
  // Track prev messages ref to reset index when messages array changes.
  const prevMsgs = useRef(messages);
  useEffect(() => {
    const changed = prevMsgs.current !== messages;
    prevMsgs.current = messages;
    const startIdx = changed ? 0 : undefined;
    if (startIdx !== undefined) setI(startIdx);
    const id = setInterval(() => setI((x) => (x + 1) % messages.length), ms);
    return () => clearInterval(id);
  }, [messages, ms]);
  return [messages[i] ?? messages[0], i] as const;
}

function useElapsed(running: boolean) {
  const [t, setT] = useState(0);
  const startRef = useRef<number>(0);
  useEffect(() => {
    if (!running) {
      // Schedule reset outside the synchronous effect body to satisfy the rule.
      const id = setTimeout(() => setT(0), 0);
      return () => clearTimeout(id);
    }
    startRef.current = Date.now();
    const id = setInterval(() => setT(Math.floor((Date.now() - startRef.current) / 1000)), 250);
    return () => clearInterval(id);
  }, [running]);
  return t;
}

// ── V1 Orbiting Grahas visual ─────────────────────────────────
const RINGS = [
  {
    r: 100, dur: 26, dir: 1,
    planets: [
      { g: "☽", c: "#e8dcc0", k: "Mo", size: 20 },
      { g: "☿", c: "#cdb18b", k: "Me", size: 18 },
    ],
  },
  {
    r: 156, dur: 38, dir: -1,
    planets: [
      { g: "♀", c: "#f0c976", k: "Ve", size: 22 },
      { g: "♂", c: "#c25a3a", k: "Ma", size: 21 },
      { g: "♃", c: "#d4a24c", k: "Ju", size: 24 },
    ],
  },
  {
    r: 214, dur: 56, dir: 1,
    planets: [
      { g: "♄", c: "#8a7396", k: "Sa", size: 21 },
      { g: "☊", c: "#a06a4a", k: "Ra", size: 18 },
      { g: "☋", c: "#7a5d4a", k: "Ke", size: 18 },
    ],
  },
] as const;

function OrbitingGrahas() {
  return (
    <div className="relative" style={{ width: 460, height: 460 }}>
      {/* SVG layer: zodiac ticks, ring tracks, central sun */}
      <svg width="460" height="460" className="absolute inset-0">
        <defs>
          <radialGradient id="alr-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff4d6" stopOpacity="1"/>
            <stop offset="40%"  stopColor="#f0c976" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#d4a24c" stopOpacity="0"/>
          </radialGradient>
          <filter id="alr-glow"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>

        {/* 36-tick zodiac dial */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r1 = 224, r2 = i % 3 === 0 ? 212 : 218;
          return (
            <line key={i}
              x1={230 + Math.cos(a) * r1} y1={230 + Math.sin(a) * r1}
              x2={230 + Math.cos(a) * r2} y2={230 + Math.sin(a) * r2}
              stroke="rgba(212,162,76,0.4)" strokeWidth={i % 3 === 0 ? 1.2 : 0.5}
            />
          );
        })}

        {/* dashed ring tracks */}
        {RINGS.map((ring, i) => (
          <circle key={i} cx="230" cy="230" r={ring.r}
            fill="none" stroke="rgba(212,162,76,0.10)"
            strokeWidth="1" strokeDasharray="2 6"
          />
        ))}

        {/* central sun glow */}
        <circle cx="230" cy="230" r="38" fill="url(#alr-sun)" filter="url(#alr-glow)" />
        <circle cx="230" cy="230" r="16" fill="#f0c976" opacity="0.95"/>
        <circle cx="230" cy="230" r="16" fill="none" stroke="#a87a2e" strokeWidth="0.8"/>
        {/* sun rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line key={i}
              x1={230 + Math.cos(a) * 19} y1={230 + Math.sin(a) * 19}
              x2={230 + Math.cos(a) * 30} y2={230 + Math.sin(a) * 30}
              stroke="#d4a24c" strokeWidth="1" strokeLinecap="round"
            />
          );
        })}
        <text x="230" y="235" textAnchor="middle"
          style={{ font: "italic 13px serif", fill: "#0a0613" }}>☉</text>
      </svg>

      {/* orbiting planet nodes — CSS-animated rings */}
      {RINGS.map((ring, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: "50%", left: "50%",
            width: ring.r * 2, height: ring.r * 2,
            marginLeft: -ring.r, marginTop: -ring.r,
            animation: `alr-spin ${ring.dur}s linear infinite${ring.dir < 0 ? " reverse" : ""}`,
          }}
        >
          {ring.planets.map((p, j) => {
            const angle = (j / ring.planets.length) * 360 + i * 23;
            return (
              <div
                key={j}
                className="absolute"
                style={{
                  top: "50%", left: "50%",
                  transform: `rotate(${angle}deg) translate(${ring.r}px) rotate(${-angle}deg)`,
                  transformOrigin: "0 0",
                }}
              >
                <div
                  className="absolute flex flex-col items-center justify-center rounded-full border border-white/10 bg-black/60"
                  style={{
                    width: p.size + 14, height: p.size + 14,
                    marginLeft: -(p.size + 14) / 2,
                    marginTop: -(p.size + 14) / 2,
                    animation: `alr-spin ${ring.dur}s linear infinite${ring.dir < 0 ? "" : " reverse"}, alr-breathe ${3 + j * 0.3}s ease-in-out infinite`,
                  }}
                >
                  <span style={{ color: p.c, fontSize: p.size, lineHeight: 1 }}>{p.g}</span>
                  <span style={{ fontSize: 7, color: "rgba(244,236,217,0.5)", letterSpacing: "0.05em" }}>{p.k}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* conic sweep beam */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, transparent 330deg, rgba(212,162,76,0.18) 360deg)",
          animation: "alr-spin 3s linear infinite",
        }}
      />
    </div>
  );
}

// ── Public component ──────────────────────────────────────────
interface AstroLoadingScreenProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  statusMessages?: string[];
  statusIntervalMs?: number;
  /** Small thumbnail shown top-right (optional) */
  thumbUrl?: string | null;
}

export function AstroLoadingScreen({
  visible,
  title = "Generating your\nCosmic Blueprint",
  subtitle = "28 engines · 65+ pages · premium edition",
  statusMessages = DEFAULT_STATUS,
  statusIntervalMs = 2400,
  thumbUrl,
}: AstroLoadingScreenProps) {
  const [status, idx] = useCyclingStatus(statusMessages, statusIntervalMs);
  const elapsed = useElapsed(visible);
  const progress = Math.min(97, (elapsed / 75) * 100);

  return (
    <>
      <style>{`
        @keyframes alr-spin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes alr-breathe { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(1.06);opacity:1} }
        @keyframes alr-grain   { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1px,1px)} 75%{transform:translate(1px,-1px)} }
      `}</style>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "#0a0613", fontFamily: "'Cormorant Garamond', Garamond, serif" }}
          >
            {/* film grain */}
            <div className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "3px 3px",
                mixBlendMode: "overlay",
                animation: "alr-grain 0.08s steps(1) infinite",
              }}
            />
            {/* violet nebula */}
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(107,77,143,0.30), transparent 70%)" }}
            />

            {/* eyebrow */}
            <div className="absolute top-5 left-6 flex items-center gap-2 z-10"
              style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", color: "rgba(244,236,217,0.42)" }}>
              <span
                className="inline-block h-[5px] w-[5px] rounded-full bg-[#d4a24c]"
                style={{ animation: "alr-breathe 1.6s ease-in-out infinite", boxShadow: "0 0 8px rgba(212,162,76,0.8)" }}
              />
              ASTROLIFE · VEDIC INTELLIGENCE SYSTEM
            </div>

            {/* optional thumb */}
            {thumbUrl && (
              <div className="absolute top-5 right-6 h-10 w-10 overflow-hidden rounded-full border border-[#c8a030]/40 opacity-60 z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}

            {/* art */}
            <div className="relative z-10 mb-2 flex items-center justify-center">
              <OrbitingGrahas />
            </div>

            {/* copy */}
            <div className="relative z-10 w-full max-w-sm px-8 text-center">
              <div style={{
                fontSize: 36, fontWeight: 400, lineHeight: 1.06,
                letterSpacing: "0.005em", color: "#f4ecd9", marginBottom: 12,
                whiteSpace: "pre-line",
              }}>
                {title}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-5"
                style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,236,217,0.46)" }}>
                {subtitle.split("·").map((s, i, arr) => (
                  <span key={i} className="flex items-center gap-2">
                    {s.trim()}
                    {i < arr.length - 1 && <span style={{ color: "rgba(212,162,76,0.7)" }}>·</span>}
                  </span>
                ))}
              </div>

              {/* cycling status */}
              <div className="relative mb-4" style={{ height: 32 }}>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 block h-px w-14"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(212,162,76,0.7), transparent)" }}
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ fontStyle: "italic", fontSize: 19, color: "#f0c976", letterSpacing: "0.01em" }}
                  >
                    {status}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* gold progress bar */}
              <div className="relative mb-3 mx-8 h-px overflow-hidden"
                style={{ background: "rgba(244,236,217,0.08)" }}>
                <div className="absolute inset-y-0 left-0 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, transparent, #d4a24c 25%, #f0c976 50%, #d4a24c 75%, transparent)",
                    boxShadow: "0 0 8px rgba(240,201,118,0.55)",
                  }}
                />
              </div>

              {/* footer */}
              <div className="flex items-center justify-center gap-2"
                style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", color: "rgba(244,236,217,0.36)" }}>
                <span>{String(elapsed).padStart(2, "0")}s elapsed</span>
                <span style={{ color: "rgba(212,162,76,0.6)" }}>·</span>
                <span>usually 30–90s · downloads automatically</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
