"use client";

import { AlertTriangle, Bot, BookOpen, Sun } from "lucide-react";
import { painPoints } from "@/data/landing";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const icons = [Sun, BookOpen, Bot];

export function Problem() {
  return (
    <section className="landing-section" id="problem">
      <div className="landing-container">
        <Reveal className="landing-section-head">
          <span className="landing-eyebrow">The Problem</span>
          <h2>Most astrology apps give generic predictions. AstroLife reads your complete cosmic blueprint.</h2>
        </Reveal>

        <Stagger className="landing-problem-grid" stagger={0.1} delayStart={0.1}>
          {painPoints.map((point, index) => {
            const Icon = icons[index] ?? AlertTriangle;
            return (
              <StaggerItem key={point.title}>
                <article className="landing-card landing-problem-card">
                  <Icon size={24} aria-hidden="true" />
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.3} className="landing-solution">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>Your personal AI astrologer, available 24/7 with full chart context.</span>
        </Reveal>
      </div>
    </section>
  );
}
