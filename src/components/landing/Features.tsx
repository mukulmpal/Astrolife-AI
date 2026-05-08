import {
  Bot,
  BriefcaseBusiness,
  Clock3,
  Compass,
  FileText,
  Gauge,
  GitBranch,
  Grid3X3,
  HandHeart,
  Heart,
  Music2,
  Radar,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { features } from "@/data/landing";

const iconMap = {
  Bot,
  BriefcaseBusiness,
  Clock3,
  Compass,
  FileText,
  Gauge,
  GitBranch,
  Grid3X3,
  HandHeart,
  Heart,
  Music2,
  Radar,
  Sparkles,
  UsersRound,
};

export function Features() {
  return (
    <section className="landing-section landing-section-alt" id="features">
      <div className="landing-container">
        <div className="landing-section-head">
          <span className="landing-eyebrow">Platform Features</span>
          <h2>Every major astrology layer, unified into one intelligent product.</h2>
          <p>AstroLife turns complex Vedic systems into practical guidance for career, marriage, wealth and purpose.</p>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Sparkles;
            return (
              <article key={feature.title} className="landing-card landing-feature-card">
                <span className="landing-icon-pill">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
