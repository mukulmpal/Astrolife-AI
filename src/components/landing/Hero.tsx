"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Coins,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ctaHref, trustBadges } from "@/data/landing";

export function Hero() {
  return (
    <section className="landing-hero" id="kundli">
      <Image
        src="/images/cosmic-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="landing-hero-bg-image"
        aria-hidden="true"
      />
      <div className="landing-stars" aria-hidden="true" />
      <div className="landing-hero-orb landing-hero-orb-one" aria-hidden="true" />
      <div className="landing-hero-orb landing-hero-orb-two" aria-hidden="true" />

      <div className="landing-container landing-hero-grid">
        <motion.div
          className="landing-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="landing-kicker">
            <Sparkles size={14} className="text-[#f4a12a]" aria-hidden="true" />
            <span>38 Specialized Engines · Zero AI Hallucination · Swiss Ephemeris</span>
          </div>

          <h1>
            Stop Guessing with Generic Horoscopes.{" "}
            <span className="bg-gradient-to-r from-[#ffd37a] via-[#f4a12a] to-[#e6a830] bg-clip-text text-transparent">
              Mathematical Destiny Intelligence.
            </span>
          </h1>

          <p className="landing-hero-subtitle">
            While generic AI chatbots hallucinate planetary degrees, AstroLife AI computes your exact birth chart across{" "}
            <strong className="text-white font-semibold">38 Specialized Vedic & Scientific Engines</strong> (Parashara, KP Placidus Sub-Lords, Jaimini Chara Dasha, 16-Zone Astro-Vastu, Bio-Wearables, and Somatotopic Remedies) — delivering verifiable, explainable life timing with zero guesswork.
          </p>

          <div className="landing-hero-actions">
            <Link href={ctaHref} className="landing-btn landing-btn-primary landing-btn-lg">
              Generate Multi-Engine Kundli
              <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold text-white bg-[#f4a12a] rounded-full">Free</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="#engines" className="landing-btn landing-btn-ghost landing-btn-lg">
              Explore 38 Specialized Engines
            </Link>
          </div>

          <div className="landing-trust-badges" aria-label="AstroLife verified engine badges">
            {trustBadges.map((badge, index) => (
              <span key={badge}>
                {index === 0 && <Compass size={14} className="text-[#f4a12a]" aria-hidden="true" />}
                {index === 1 && <Sparkles size={14} className="text-[#f4a12a]" aria-hidden="true" />}
                {index === 2 && <ShieldCheck size={14} className="text-[#f4a12a]" aria-hidden="true" />}
                {index === 3 && <Coins size={14} className="text-[#f4a12a]" aria-hidden="true" />}
                {index === 4 && <FileText size={14} className="text-[#f4a12a]" aria-hidden="true" />}
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="landing-hero-visual landing-hero-visual-image relative"
          aria-label="AstroLife multi-engine dashboard preview"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.15 },
            scale: { duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.95 },
          }}
        >
          {/* ── Live Telemetry Floating Pill 1 (Top-Left): KP Sub-Lord ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -left-4 -top-3 z-30 hidden sm:flex items-center gap-2 rounded-2xl border border-[#c8a030]/40 bg-black/85 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#e6c869]">KP Cusp 10 Sub-Lord</div>
              <div className="text-xs font-semibold text-white">Saturn (2, 10, 11) · Career Window</div>
            </div>
          </motion.div>

          {/* ── Live Telemetry Floating Pill 2 (Top-Right): Indu Lagna Wealth ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="absolute -right-4 top-10 z-30 hidden sm:flex items-center gap-2 rounded-2xl border border-[#c8a030]/40 bg-black/85 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            <Coins size={14} className="text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#e6c869]">Indu Lagna Wealth</div>
              <div className="text-xs font-semibold text-white">8 Bindus · Kuber Dhana Yoga</div>
            </div>
          </motion.div>

          {/* ── Live Telemetry Floating Pill 3 (Bottom-Left): Jaimini Chara Dasha ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute -left-4 bottom-8 z-30 hidden sm:flex items-center gap-2 rounded-2xl border border-[#c8a030]/40 bg-black/85 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            <ShieldCheck size={14} className="text-purple-400" />
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#e6c869]">Jaimini Karakas</div>
              <div className="text-xs font-semibold text-white">AK Sun · Karakamsha Navamsha</div>
            </div>
          </motion.div>

          {/* ── Live Telemetry Floating Pill 4 (Bottom-Right): 27 Nakshatra Upaya ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute -right-3 -bottom-3 z-30 hidden sm:flex items-center gap-2 rounded-2xl border border-[#c8a030]/40 bg-black/85 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#e6c869]">Nakshatra Social Upaya</div>
              <div className="text-xs font-semibold text-white">Rohini · Gau-Seva & Moon Arghya</div>
            </div>
          </motion.div>

          <div className="landing-hero-image-shell">
            <Image
              src="/images/hero-kundli.png"
              alt="AstroLife multi-engine kundli dashboard with KP Placidus, Jaimini Chara Dasha, Indu Lagna and Nakshatra remedies"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 560px"
              className="landing-hero-dashboard-image"
            />
            <div className="landing-hero-image-shine" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}