import { AlertTriangle, Bot, BookOpen, Sun } from "lucide-react";
import { painPoints } from "@/data/landing";

const icons = [Sun, BookOpen, Bot];

export function Problem() {
  return (
    <section className="landing-section" id="problem">
      <div className="landing-container">
        <div className="landing-section-head">
          <span className="landing-eyebrow">The Problem</span>
          <h2>Most astrology apps give generic predictions. AstroLife reads your complete cosmic blueprint.</h2>
        </div>

        <div className="landing-problem-grid">
          {painPoints.map((point, index) => {
            const Icon = icons[index] ?? AlertTriangle;
            return (
              <article key={point.title} className="landing-card landing-problem-card">
                <Icon size={24} aria-hidden="true" />
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            );
          })}
        </div>

        <div className="landing-solution">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>Your personal AI astrologer, available 24/7 with full chart context.</span>
        </div>
      </div>
    </section>
  );
}
