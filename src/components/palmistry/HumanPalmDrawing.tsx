"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PalmLineId, PalmMountId, Point } from "@/lib/astro-engine/palmistry-engine";

export interface HumanPalmDrawingProps {
  hand?: "left" | "right";
  selectedLine?: string | null;
  selectedMount?: string | null;
  onSelectLine?: (lineId: PalmLineId) => void;
  onSelectMount?: (mountId: PalmMountId) => void;
  showLabels?: boolean;
  showMounts?: boolean;
  showLines?: boolean;
  showFloatingCard?: boolean;
  showBottomBar?: boolean;
  activeMode?: "all" | "lines" | "mounts";
  customLines?: Array<{
    id: string;
    name: string;
    color: string;
    points?: Point[];
    confidence?: number;
    summary?: string;
  }>;
  customMounts?: Array<{
    id: string;
    name: string;
    score: number;
    keywords?: string;
    pos?: Point;
  }>;
  className?: string;
}

// Classical Samudrika Shastra details for tooltips
export const LINE_SHASTRA_INFO: Record<string, { sanskrit: string; english: string; governs: string; color: string }> = {
  life: {
    sanskrit: "जीवन रेखा (Jeevan Rekha)",
    english: "Life / Vitality Line",
    governs: "Prana energy, vitality, physical constitution, lifespan longevity and major life transitions.",
    color: "#22c55e",
  },
  head: {
    sanskrit: "मस्तक रेखा (Mastak Rekha)",
    english: "Head / Intellect Line",
    governs: "Mental focus, intellect, decision-making, psychological resilience and creative cognition.",
    color: "#06b6d4",
  },
  heart: {
    sanskrit: "हृदय रेखा (Hridaya Rekha)",
    english: "Heart / Emotion Line",
    governs: "Emotional temperament, empathy, romantic destiny, devotion and heart-centered relationships.",
    color: "#ec4899",
  },
  fate: {
    sanskrit: "भाग्य रेखा (Bhagya / Shani Rekha)",
    english: "Fate / Destiny Line",
    governs: "Karmic trajectory, career focus, external worldly achievements, obstacles and destiny activation.",
    color: "#a855f7",
  },
  sun: {
    sanskrit: "सूर्य रेखा (Surya / Apollo Rekha)",
    english: "Sun / Fame Line",
    governs: "Public recognition, prestige, artistic brilliance, authority and solar aura of success.",
    color: "#f59e0b",
  },
  mercury: {
    sanskrit: "बुध रेखा (Budh / Swasthya Rekha)",
    english: "Mercury / Health Line",
    governs: "Commercial acumen, communication eloquence, nervous system balance and digestive health.",
    color: "#10b981",
  },
};

export const MOUNT_SHASTRA_INFO: Record<string, { sanskrit: string; graha: string; symbol: string; color: string; governs: string }> = {
  jupiter: {
    sanskrit: "गुरु पर्वत (Guru Parvat)",
    graha: "Brihaspati / Jupiter",
    symbol: "♃",
    color: "#f0c050",
    governs: "Wisdom, leadership, morality, spiritual ambition, executive authority and dharma.",
  },
  saturn: {
    sanskrit: "शनि पर्वत (Shani Parvat)",
    graha: "Shani / Saturn",
    symbol: "♄",
    color: "#c4b5fd",
    governs: "Discipline, perseverance, philosophical depth, research, austerity and solitude.",
  },
  sun: {
    sanskrit: "सूर्य पर्वत (Surya Parvat)",
    graha: "Surya / Sun",
    symbol: "☉",
    color: "#fed7aa",
    governs: "Glory, artistic vitality, high reputation, wealth, charisma and government connections.",
  },
  mercury: {
    sanskrit: "बुध पर्वत (Budh Parvat)",
    graha: "Budha / Mercury",
    symbol: "☿",
    color: "#a7f3d0",
    governs: "Business intelligence, eloquence, negotiation, quick wit, science and trading skills.",
  },
  venus: {
    sanskrit: "शुक्र पर्वत (Shukra Parvat)",
    graha: "Shukra / Venus",
    symbol: "♀",
    color: "#fef08a",
    governs: "Sensory grace, love, charm, vitality, artistic luxury, romantic passion and physical magnetism.",
  },
  moon: {
    sanskrit: "चन्द्र पर्वत (Chandra Parvat)",
    graha: "Chandra / Moon",
    symbol: "☽",
    color: "#bfdbfe",
    governs: "Intuition, psychic sensitivity, imagination, overseas travel, water connection and emotional peace.",
  },
  upperMars: {
    sanskrit: "उच्च मंगल (Upper Mars)",
    graha: "Mangal / Mars",
    symbol: "♂",
    color: "#f87171",
    governs: "Moral courage, mental endurance, calm under intense fire, stoic defensive strength.",
  },
  lowerMars: {
    sanskrit: "निम्न मंगल (Lower Mars)",
    graha: "Mangal / Mars",
    symbol: "♂",
    color: "#f87171",
    governs: "Physical bravery, drive, combat assertiveness, dynamic physical initiative.",
  },
  rahu: {
    sanskrit: "राहु क्षेत्र (Plain of Mars)",
    graha: "Rahu / Karatala",
    symbol: "☊",
    color: "#d8b4fe",
    governs: "Hollow of the palm: subconscious desires, sudden karmic twists, unconventional intellect.",
  },
  ketu: {
    sanskrit: "केतु क्षेत्र (Mani Bandha Root)",
    graha: "Ketu",
    symbol: "☋",
    color: "#fdba74",
    governs: "Spiritual liberation, detachment, ancestral roots, esoteric mysticism.",
  },
};

export function HumanPalmDrawing({
  hand = "right",
  selectedLine = null,
  selectedMount = null,
  onSelectLine,
  onSelectMount,
  showLabels = true,
  showMounts = true,
  showLines = true,
  showFloatingCard = true,
  showBottomBar = true,
  activeMode = "all",
  customLines,
  customMounts,
  className = "",
}: HumanPalmDrawingProps) {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [hoveredMount, setHoveredMount] = useState<string | null>(null);

  const activeLine = selectedLine || hoveredLine;
  const activeMount = selectedMount || hoveredMount;

  const mirror = hand === "left";

  const activeLineInfo = activeLine ? LINE_SHASTRA_INFO[activeLine] : null;
  const activeMountInfo = activeMount ? MOUNT_SHASTRA_INFO[activeMount] : null;

  // Mount scores map if available
  const mountScoreMap = useMemo(() => {
    const map = new Map<string, number>();
    if (customMounts) {
      for (const m of customMounts) {
        map.set(m.id, m.score);
      }
    }
    return map;
  }, [customMounts]);

  return (
    <div className={`relative mx-auto w-full select-none ${className}`}>
      {/* ── Active Info Card (Floats at top or bottom) ── */}
      {showFloatingCard && (
        <AnimatePresence>
          {(activeLineInfo || activeMountInfo) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="pointer-events-none absolute left-3 right-3 top-3 z-30 rounded-2xl border border-[#c8a030]/40 bg-black/90 p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              {activeLineInfo && (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: activeLineInfo.color }} />
                      <span className="font-serif text-sm font-bold text-[#e6c869]">{activeLineInfo.sanskrit}</span>
                      <span className="text-xs text-[#a09070]">({activeLineInfo.english})</span>
                    </div>
                    <span className="rounded-full border border-[#c8a030]/30 bg-[#c8a030]/10 px-2 py-0.5 text-[10px] font-semibold text-[#e6c869]">
                      Samudrika Shastra
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#dcd0b8]">{activeLineInfo.governs}</p>
                </div>
              )}
              {activeMountInfo && !activeLineInfo && (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base" style={{ color: activeMountInfo.color }}>
                        {activeMountInfo.symbol}
                      </span>
                      <span className="font-serif text-sm font-bold text-[#e6c869]">{activeMountInfo.sanskrit}</span>
                      <span className="text-xs text-[#a09070]">({activeMountInfo.graha})</span>
                    </div>
                    {activeMount && mountScoreMap.has(activeMount) && (
                      <span className="rounded-full border border-[#c8a030]/40 bg-[#c8a030]/20 px-2 py-0.5 text-xs font-bold text-[#f5e7b8]">
                        {mountScoreMap.get(activeMount)}% Score
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#dcd0b8]">{activeMountInfo.governs}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Main SVG Illustration ── */}
      <svg
        viewBox="0 0 440 560"
        className="w-full h-auto drop-shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
        style={{
          transform: mirror ? "scaleX(-1)" : "none",
          transformOrigin: "center center",
        }}
      >
        <defs>
          {/* Natural Skin Gradient */}
          <radialGradient id="palmSkinRealistic" cx="50%" cy="58%" r="52%">
            <stop offset="0%" stopColor="#2c251e" />
            <stop offset="42%" stopColor="#1e1914" />
            <stop offset="82%" stopColor="#14110e" />
            <stop offset="100%" stopColor="#0b0908" />
          </radialGradient>

          {/* Mount Cushions */}
          <radialGradient id="mountVenus" cx="42%" cy="52%" r="48%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.28" />
            <stop offset="65%" stopColor="#d4af37" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mountMoon" cx="55%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#88b5e6" stopOpacity="0.25" />
            <stop offset="65%" stopColor="#88b5e6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#88b5e6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mountJupiter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0c050" stopOpacity="0.32" />
            <stop offset="80%" stopColor="#f0c050" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mountSaturn" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mountSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
            <stop offset="80%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mountMercury" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>

          {/* Line Glow Filters */}
          <filter id="vedicGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="activeLineGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sacred Geometry Ambient Circles */}
        <circle cx="220" cy="290" r="185" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.16" />
        <circle cx="220" cy="290" r="218" fill="none" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="3 7" opacity="0.1" />

        {/* ── ANATOMICALLY ACCURATE HUMAN HAND SILHOUETTE ── */}
        <g id="anatomical-human-hand">
          {/* Main Hand Contour */}
          <path
            d="
              M 175 520
              C 150 490, 132 445, 116 395
              C 102 355, 86 325, 62 292
              C 42 264, 25 240, 28 214
              C 30 192, 54 184, 76 204
              C 96 222, 118 256, 134 290
              C 138 274, 142 245, 144 212
              C 146 150, 148 95, 153 72
              C 157 52, 179 50, 185 70
              C 190 98, 193 162, 196 206
              C 201 214, 206 214, 209 204
              C 212 145, 215 62, 221 38
              C 226 18, 248 18, 253 38
              C 258 72, 261 148, 264 206
              C 269 216, 274 216, 277 205
              C 281 146, 285 86, 291 66
              C 296 48, 316 48, 321 66
              C 327 96, 329 164, 331 222
              C 336 235, 342 235, 345 222
              C 350 174, 355 130, 361 112
              C 366 96, 384 98, 388 114
              C 394 142, 396 205, 396 256
              C 396 308, 392 342, 386 376
              C 378 418, 390 460, 376 488
              C 352 516, 318 522, 290 520
              C 240 528, 220 528, 175 520 Z
            "
            fill="url(#palmSkinRealistic)"
            stroke="#d4af37"
            strokeWidth="1.8"
            strokeOpacity="0.75"
            style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.25))" }}
          />

          {/* Inner Highlight for Natural Fleshy Volume */}
          <path
            d="
              M 180 514
              C 156 486, 138 442, 122 393
              C 108 354, 93 325, 70 293
              C 52 266, 37 245, 40 223
              C 42 208, 58 202, 74 216
              C 92 232, 114 266, 128 298
              C 134 278, 138 248, 140 216
              C 142 155, 144 102, 149 80
              C 152 66, 168 64, 173 78
              C 178 104, 181 166, 184 208
              C 197 210, 203 152, 207 105
              C 209 72, 212 48, 217 32
              C 221 21, 239 21, 243 32
              C 248 64, 251 138, 254 196
              C 268 198, 273 148, 277 104
              C 279 78, 283 58, 287 46
              C 291 38, 305 38, 309 48
              C 314 74, 317 142, 319 202
              C 334 208, 338 172, 342 140
              C 345 118, 349 104, 353 96
              C 357 88, 369 89, 372 99
              C 377 122, 379 184, 379 240
              C 379 294, 376 332, 370 368
              C 363 408, 374 448, 362 476
              C 342 502, 312 510, 286 510
              C 240 516, 220 516, 180 514 Z
            "
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.6"
            strokeOpacity="0.22"
          />

          {/* Anatomical Finger Phalanx Creases (Interphalangeal Folds) */}
          <g stroke="#d4af37" strokeOpacity="0.38" strokeWidth="1.2" strokeLinecap="round">
            {/* Thumb joints */}
            <path d="M 52 232 C 60 228, 70 234, 78 244" />
            <path d="M 88 274 C 98 266, 110 274, 118 288" />

            {/* Index Finger (Tarjani) */}
            <path d="M 152 118 C 160 114, 172 114, 180 118" />
            <path d="M 150 162 C 160 158, 174 158, 184 162" />

            {/* Middle Finger (Madhyama) */}
            <path d="M 218 90 C 228 86, 242 86, 252 90" />
            <path d="M 216 142 C 228 138, 244 138, 256 142" />

            {/* Ring Finger (Anamika) */}
            <path d="M 288 116 C 298 112, 310 112, 320 116" />
            <path d="M 286 166 C 298 162, 312 162, 322 166" />

            {/* Pinky Finger (Kanishtha) */}
            <path d="M 358 152 C 364 148, 374 148, 380 152" />
            <path d="M 355 194 C 363 190, 375 190, 382 194" />
          </g>

          {/* Wrist Bracelets (Manibandha Lines) */}
          <g stroke="#d4af37" strokeWidth="1.4" strokeOpacity="0.45" strokeLinecap="round">
            <path d="M 180 500 C 220 514, 255 514, 288 500" />
            <path d="M 185 512 C 220 524, 255 524, 282 512" />
            <path d="M 192 524 C 220 534, 255 534, 276 524" strokeOpacity="0.25" />
          </g>
        </g>

        {/* ── PALM MOUNT CUSHIONS (Subtle Luminescence) ── */}
        {(showMounts || activeMode === "mounts" || activeMode === "all") && (
          <g id="mount-cushions" className="cursor-pointer">
            {/* Venus / Shukra */}
            <ellipse
              cx="185"
              cy="405"
              rx="55"
              ry="65"
              fill="url(#mountVenus)"
              opacity={activeMount === "venus" ? 1 : 0.75}
              onMouseEnter={() => setHoveredMount("venus")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("venus")}
            />
            {/* Moon / Chandra */}
            <ellipse
              cx="330"
              cy="415"
              rx="42"
              ry="56"
              fill="url(#mountMoon)"
              opacity={activeMount === "moon" ? 1 : 0.75}
              onMouseEnter={() => setHoveredMount("moon")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("moon")}
            />
            {/* Jupiter / Guru */}
            <circle
              cx="178"
              cy="245"
              r="28"
              fill="url(#mountJupiter)"
              opacity={activeMount === "jupiter" ? 1 : 0.75}
              onMouseEnter={() => setHoveredMount("jupiter")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("jupiter")}
            />
            {/* Saturn / Shani */}
            <circle
              cx="236"
              cy="235"
              r="26"
              fill="url(#mountSaturn)"
              opacity={activeMount === "saturn" ? 1 : 0.75}
              onMouseEnter={() => setHoveredMount("saturn")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("saturn")}
            />
            {/* Sun / Surya */}
            <circle
              cx="295"
              cy="240"
              r="26"
              fill="url(#mountSun)"
              opacity={activeMount === "sun" ? 1 : 0.75}
              onMouseEnter={() => setHoveredMount("sun")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("sun")}
            />
            {/* Mercury / Budh */}
            <circle
              cx="355"
              cy="255"
              r="24"
              fill="url(#mountMercury)"
              opacity={activeMount === "mercury" ? 1 : 0.75}
              onMouseEnter={() => setHoveredMount("mercury")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("mercury")}
            />
            {/* Upper Mars */}
            <circle
              cx="348"
              cy="325"
              r="22"
              fill="#e05535"
              fillOpacity={activeMount === "upperMars" ? 0.25 : 0.1}
              onMouseEnter={() => setHoveredMount("upperMars")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("upperMars")}
            />
            {/* Lower Mars */}
            <circle
              cx="168"
              cy="305"
              r="20"
              fill="#e05535"
              fillOpacity={activeMount === "lowerMars" ? 0.25 : 0.1}
              onMouseEnter={() => setHoveredMount("lowerMars")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("lowerMars")}
            />
            {/* Plain of Mars / Rahu */}
            <circle
              cx="245"
              cy="335"
              r="30"
              fill="#a070e0"
              fillOpacity={activeMount === "rahu" ? 0.2 : 0.07}
              onMouseEnter={() => setHoveredMount("rahu")}
              onMouseLeave={() => setHoveredMount(null)}
            />
            {/* Ketu (Base) */}
            <circle
              cx="235"
              cy="465"
              r="18"
              fill="#fb923c"
              fillOpacity={activeMount === "ketu" ? 0.2 : 0.07}
              onMouseEnter={() => setHoveredMount("ketu")}
              onMouseLeave={() => setHoveredMount(null)}
            />
          </g>
        )}

        {/* ── CLASSICAL PALM LINES (HASTA REKHA) ── */}
        {(showLines || activeMode === "lines" || activeMode === "all") && (
          <g id="classical-vedic-lines">
            {/* 1. Life Line (Jeevan Rekha) */}
            <path
              id="line-life"
              d="M 148 275
                 C 156 295, 158 322, 154 350
                 C 150 382, 155 422, 172 455
                 C 184 478, 202 492, 218 498"
              fill="none"
              stroke="#22c55e"
              strokeWidth={activeLine === "life" ? 4.2 : 2.8}
              strokeLinecap="round"
              filter={activeLine === "life" ? "url(#activeLineGlow)" : "url(#vedicGlow)"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredLine("life")}
              onMouseLeave={() => setHoveredLine(null)}
              onClick={() => onSelectLine?.("life")}
            />

            {/* 2. Head Line (Mastak Rekha) */}
            <path
              id="line-head"
              d="M 148 276
                 C 175 284, 215 304, 255 316
                 C 285 325, 315 338, 342 355"
              fill="none"
              stroke="#06b6d4"
              strokeWidth={activeLine === "head" ? 4.2 : 2.8}
              strokeLinecap="round"
              filter={activeLine === "head" ? "url(#activeLineGlow)" : "url(#vedicGlow)"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredLine("head")}
              onMouseLeave={() => setHoveredLine(null)}
              onClick={() => onSelectLine?.("head")}
            />

            {/* 3. Heart Line (Hridaya Rekha) */}
            <path
              id="line-heart"
              d="M 382 288
                 C 355 272, 320 268, 280 268
                 C 245 268, 215 264, 185 246"
              fill="none"
              stroke="#ec4899"
              strokeWidth={activeLine === "heart" ? 4.2 : 2.8}
              strokeLinecap="round"
              filter={activeLine === "heart" ? "url(#activeLineGlow)" : "url(#vedicGlow)"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredLine("heart")}
              onMouseLeave={() => setHoveredLine(null)}
              onClick={() => onSelectLine?.("heart")}
            />

            {/* 4. Fate Line (Bhagya Rekha) */}
            <path
              id="line-fate"
              d="M 240 488
                 C 238 435, 237 380, 237 330
                 C 237 290, 236 260, 236 242"
              fill="none"
              stroke="#a855f7"
              strokeWidth={activeLine === "fate" ? 4 : 2.4}
              strokeLinecap="round"
              strokeDasharray="160"
              filter={activeLine === "fate" ? "url(#activeLineGlow)" : "url(#vedicGlow)"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredLine("fate")}
              onMouseLeave={() => setHoveredLine(null)}
              onClick={() => onSelectLine?.("fate")}
            />

            {/* 5. Sun Line (Surya Rekha) */}
            <path
              id="line-sun"
              d="M 288 385
                 C 290 345, 292 300, 294 250"
              fill="none"
              stroke="#f59e0b"
              strokeWidth={activeLine === "sun" ? 3.8 : 2.2}
              strokeLinecap="round"
              filter={activeLine === "sun" ? "url(#activeLineGlow)" : "url(#vedicGlow)"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredLine("sun")}
              onMouseLeave={() => setHoveredLine(null)}
              onClick={() => onSelectLine?.("sun")}
            />

            {/* 6. Mercury Line (Budh Rekha) */}
            <path
              id="line-mercury"
              d="M 326 430
                 C 334 380, 344 325, 354 265"
              fill="none"
              stroke="#10b981"
              strokeWidth={activeLine === "mercury" ? 3.8 : 2}
              strokeLinecap="round"
              filter={activeLine === "mercury" ? "url(#activeLineGlow)" : "url(#vedicGlow)"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredLine("mercury")}
              onMouseLeave={() => setHoveredLine(null)}
              onClick={() => onSelectLine?.("mercury")}
            />

            {/* Marriage Lines (Vivah Rekha) */}
            <path d="M 386 260 L 372 260" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M 388 270 L 370 270" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          </g>
        )}

        {/* ── MOUNT LABELS & PLANETARY GLYPHS ── */}
        {showLabels && (showMounts || activeMode === "mounts" || activeMode === "all") && (
          <g
            id="mount-badges"
            fontFamily="system-ui, -apple-system, sans-serif"
            textAnchor="middle"
            className="cursor-pointer select-none"
            style={{ transform: mirror ? "scaleX(-1)" : "none", transformOrigin: "center center" }}
          >
            {/* Guru / Jupiter */}
            <g
              transform={mirror ? "translate(262, 230)" : "translate(178, 230)"}
              onMouseEnter={() => setHoveredMount("jupiter")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("jupiter")}
            >
              <circle r="12" fill="#1c1815" stroke="#f0c050" strokeWidth="1.2" />
              <text y="3.5" fill="#f0c050" fontSize="10" fontWeight="bold">♃</text>
              <text y="22" fill="#e6c869" fontSize="8" fontWeight="600" letterSpacing="0.4">GURU</text>
            </g>

            {/* Shani / Saturn */}
            <g
              transform={mirror ? "translate(204, 218)" : "translate(236, 218)"}
              onMouseEnter={() => setHoveredMount("saturn")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("saturn")}
            >
              <circle r="12" fill="#1c1815" stroke="#a78bfa" strokeWidth="1.2" />
              <text y="3.5" fill="#c4b5fd" fontSize="10" fontWeight="bold">♄</text>
              <text y="22" fill="#c4b5fd" fontSize="8" fontWeight="600" letterSpacing="0.4">SHANI</text>
            </g>

            {/* Surya / Sun */}
            <g
              transform={mirror ? "translate(145, 222)" : "translate(295, 222)"}
              onMouseEnter={() => setHoveredMount("sun")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("sun")}
            >
              <circle r="12" fill="#1c1815" stroke="#f59e0b" strokeWidth="1.2" />
              <text y="3.5" fill="#ffaa33" fontSize="10" fontWeight="bold">☉</text>
              <text y="22" fill="#fed7aa" fontSize="8" fontWeight="600" letterSpacing="0.4">SURYA</text>
            </g>

            {/* Budh / Mercury */}
            <g
              transform={mirror ? "translate(85, 236)" : "translate(355, 236)"}
              onMouseEnter={() => setHoveredMount("mercury")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("mercury")}
            >
              <circle r="12" fill="#1c1815" stroke="#34d399" strokeWidth="1.2" />
              <text y="3.5" fill="#4ae3b5" fontSize="10" fontWeight="bold">☿</text>
              <text y="22" fill="#a7f3d0" fontSize="8" fontWeight="600" letterSpacing="0.4">BUDH</text>
            </g>

            {/* Shukra / Venus */}
            <g
              transform={mirror ? "translate(255, 400)" : "translate(185, 400)"}
              onMouseEnter={() => setHoveredMount("venus")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("venus")}
            >
              <circle r="13" fill="#1c1815" stroke="#d4af37" strokeWidth="1.2" />
              <text y="4" fill="#fbbf24" fontSize="11" fontWeight="bold">♀</text>
              <text y="24" fill="#fef08a" fontSize="8" fontWeight="600" letterSpacing="0.4">SHUKRA</text>
            </g>

            {/* Chandra / Moon */}
            <g
              transform={mirror ? "translate(105, 415)" : "translate(335, 415)"}
              onMouseEnter={() => setHoveredMount("moon")}
              onMouseLeave={() => setHoveredMount(null)}
              onClick={() => onSelectMount?.("moon")}
            >
              <circle r="13" fill="#1c1815" stroke="#88b5e6" strokeWidth="1.2" />
              <text y="4" fill="#93c5fd" fontSize="11" fontWeight="bold">☽</text>
              <text y="24" fill="#bfdbfe" fontSize="8" fontWeight="600" letterSpacing="0.4">CHANDRA</text>
            </g>
          </g>
        )}
      </svg>

      {/* ── Subtle Controls Bar ── */}
      {showBottomBar && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] text-[#a09070]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <span>Life</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4] ml-1.5" />
            <span>Head</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ec4899] ml-1.5" />
            <span>Heart</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] ml-1.5" />
            <span>Fate</span>
          </div>
          <span className="font-serif tracking-wider text-[#e6c869]">
            {hand === "left" ? "LEFT HAND (स्त्री / Inner Karma)" : "RIGHT HAND (पुरुष / Manifest Destiny)"}
          </span>
        </div>
      )}
    </div>
  );
}
