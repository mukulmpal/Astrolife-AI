"use client";

import { ArrowRight, CircleDot } from "lucide-react";
import { steps } from "@/data/landing";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

export function HowItWorks() {
  return (
    <section className="landing-section landing-section-alt" id="how-it-works">
      <div className="landing-container">
        <Reveal className="landing-section-head">
          <span className="landing-eyebrow">How It Works</span>
          <h2>Your complete astrology intelligence flow in three steps.</h2>
        </Reveal>

        <Stagger className="landing-steps" stagger={0.12} delayStart={0.1}>
          {steps.map((step, index) => (
            <StaggerItem key={step.number}>
              <article className="landing-card landing-step-card">
                <div className="landing-step-number">{step.number}</div>
                <CircleDot size={26} aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && <ArrowRight className="landing-step-arrow" size={22} aria-hidden="true" />}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
