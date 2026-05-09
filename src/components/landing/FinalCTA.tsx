import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { chatHref, ctaHref } from "@/data/landing";

export function FinalCTA() {
  return (
    <section className="landing-final-cta">
      <div className="landing-final-glow" aria-hidden="true" />
      <div className="landing-container">
        <Sparkles size={26} aria-hidden="true" />
        <h2>Your stars already know the pattern. AstroLife helps you understand it.</h2>
        <div className="landing-hero-actions">
          <Link href={ctaHref} className="landing-btn landing-btn-primary landing-btn-lg">
            Generate Free Kundli
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href={chatHref} className="landing-btn landing-btn-ghost landing-btn-lg">
            Ask AI Astrologer
          </Link>
        </div>
      </div>
    </section>
  );
}
