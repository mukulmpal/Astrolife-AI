import { ShieldCheck } from "lucide-react";
import { trustPoints } from "@/data/landing";

export function Trust() {
  return (
    <section className="landing-section" id="trust">
      <div className="landing-container landing-trust-panel">
        <div className="landing-section-head">
          <span className="landing-eyebrow">Trust Layer</span>
          <h2>Spiritual guidance should feel safe, grounded and responsible.</h2>
        </div>
        <div className="landing-trust-grid">
          {trustPoints.map((point) => (
            <div key={point} className="landing-trust-point">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
