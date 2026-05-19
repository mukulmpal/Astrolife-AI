"use client";

import { CheckCircle2 } from "lucide-react";
import { engines } from "@/data/landing";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

export function AstrologyEngines() {
  return (
    <section className="landing-section" id="engines">
      <div className="landing-container">
        <Reveal className="landing-section-head landing-section-head-center">
          <span className="landing-eyebrow">Astrology Engines</span>
          <h2>Built as a multi-engine astrology intelligence OS.</h2>
          <p>Every system adds a different layer of signal. AstroLife synthesizes them without overwhelming the user.</p>
        </Reveal>

        <Stagger className="landing-engine-grid" stagger={0.04} delayStart={0.1}>
          {engines.map((engine) => (
            <StaggerItem key={engine}>
              <div className="landing-engine-badge">
                <CheckCircle2 size={16} aria-hidden="true" />
                {engine}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
