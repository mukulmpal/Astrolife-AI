import Link from "next/link";
import { ArrowRight, Bot, Clock3, FileText, HandHeart, Radar, Sparkles } from "lucide-react";
import { chatHref, ctaHref, trustBadges } from "@/data/landing";

export function Hero() {
  return (
    <section className="landing-hero" id="kundli">
      <div className="landing-stars" aria-hidden="true" />
      <div className="landing-hero-orb landing-hero-orb-one" aria-hidden="true" />
      <div className="landing-hero-orb landing-hero-orb-two" aria-hidden="true" />

      <div className="landing-container landing-hero-grid">
        <div className="landing-hero-copy">
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
        </div>

        <div className="landing-hero-visual" aria-label="AstroLife dashboard preview">
          <div className="kundli-wheel">
            <div className="kundli-ring ring-a" />
            <div className="kundli-ring ring-b" />
            <div className="kundli-core">ॐ</div>
            {["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sa", "Cp", "Aq", "Pi"].map((sign, index) => (
              <span key={sign} className={`kundli-sign sign-${index + 1}`}>
                {sign}
              </span>
            ))}
          </div>

          <div className="mock-card mock-chat">
            <div className="mock-card-title">
              <Bot size={15} aria-hidden="true" />
              AI Astrologer
            </div>
            <p>Saturn dasha is asking for discipline, but Jupiter transit supports career visibility.</p>
          </div>

          <div className="mock-card mock-score">
            <div className="mock-score-value">87</div>
            <div>
              <div className="mock-card-title">Destiny Score</div>
              <p>Very promising</p>
            </div>
          </div>

          <div className="mock-card mock-radar">
            <div className="mock-card-title">
              <Radar size={15} aria-hidden="true" />
              Transit Radar
            </div>
            <div className="mock-bars">
              <span style={{ width: "88%" }} />
              <span style={{ width: "64%" }} />
              <span style={{ width: "76%" }} />
            </div>
          </div>

          <div className="mock-card mock-remedy">
            <div className="mock-card-title">
              <HandHeart size={15} aria-hidden="true" />
              Remedy
            </div>
            <p>Surya mantra, focused routine, and Sunday gratitude practice.</p>
          </div>

          <div className="mock-timeline">
            <span>Dasha</span>
            <div />
            <strong>Mercury AD</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
