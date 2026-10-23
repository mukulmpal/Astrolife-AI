"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Clock3, FileText, HandHeart, Sparkles } from "lucide-react";
import { chatHref, ctaHref, trustBadges } from "@/data/landing";

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
            <Sparkles size={15} aria-hidden="true" />
            Your Destiny, Decoded by AI
          </div>
          <h1>Your Kundli Is Not Just a Chart. It&apos;s Your Life Operating System.</h1>
          <p className="landing-hero-subtitle">
            Decode your destiny, career timing, marriage patterns, wealth periods, karmic blocks, remedies, and life
            purpose using India&apos;s most advanced AI-powered astrology engine.
          </p>
          <div className="landing-hero-actions">
            <Link href={ctaHref} className="landing-btn landing-btn-primary landing-btn-lg">
              Generate Free Kundli
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href={chatHref} className="landing-btn landing-btn-ghost landing-btn-lg">
              Ask AI Astrologer
            </Link>
          </div>
          <div className="landing-trust-badges" aria-label="AstroLife trust badges">
            {trustBadges.map((badge, index) => (
              <span key={badge}>
                {index === 0 && <Clock3 size={14} aria-hidden="true" />}
                {index === 1 && <Sparkles size={14} aria-hidden="true" />}
                {index === 2 && <Bot size={14} aria-hidden="true" />}
                {index === 3 && <HandHeart size={14} aria-hidden="true" />}
                {index === 4 && <FileText size={14} aria-hidden="true" />}
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="landing-hero-visual landing-hero-visual-image"
          aria-label="AstroLife dashboard preview"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.15 },
            scale: { duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.95 },
          }}
        >
          <div className="landing-hero-image-shell">
            <Image
              src="/images/hero-kundli.png"
              alt="AstroLife kundli dashboard with AI astrologer, dasha timeline, destiny score and remedies"
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
