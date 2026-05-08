import { ArrowRight, CircleDot } from "lucide-react";
import { steps } from "@/data/landing";

export function HowItWorks() {
  return (
    <section className="landing-section landing-section-alt" id="how-it-works">
      <div className="landing-container">
        <div className="landing-section-head">
          <span className="landing-eyebrow">How It Works</span>
          <h2>Your complete astrology intelligence flow in three steps.</h2>
        </div>

        <div className="landing-steps">
          {steps.map((step, index) => (
            <article key={step.number} className="landing-card landing-step-card">
              <div className="landing-step-number">{step.number}</div>
              <CircleDot size={26} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <ArrowRight className="landing-step-arrow" size={22} aria-hidden="true" />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
