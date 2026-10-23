"use client";

import { metrics } from "@/data/landing";
import { Stagger, StaggerItem } from "./Reveal";

export function SocialProof() {
  return (
    <section className="landing-social" aria-label="AstroLife platform metrics">
      <Stagger className="landing-container landing-metrics" stagger={0.1} delayStart={0}>
        {metrics.map((metric) => (
          <StaggerItem key={metric.label}>
            <div className="landing-metric">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
