import { CheckCircle2 } from "lucide-react";
import { engines } from "@/data/landing";

export function AstrologyEngines() {
  return (
    <section className="landing-section" id="engines">
      <div className="landing-container">
        <div className="landing-section-head landing-section-head-center">
          <span className="landing-eyebrow">Astrology Engines</span>
          <h2>Built as a multi-engine astrology intelligence OS.</h2>
          <p>Every system adds a different layer of signal. AstroLife synthesizes them without overwhelming the user.</p>
        </div>

        <div className="landing-engine-grid">
          {engines.map((engine) => (
            <div key={engine} className="landing-engine-badge">
              <CheckCircle2 size={16} aria-hidden="true" />
              {engine}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
