"use client";

import { MessageCircleQuestion } from "lucide-react";
import { useCases } from "@/data/landing";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

export function UseCases() {
  return (
    <section className="landing-section landing-section-alt">
      <div className="landing-container">
        <Reveal className="landing-section-head">
          <span className="landing-eyebrow">Questions AstroLife Can Answer</span>
          <h2>Ask the questions people actually bring to astrology.</h2>
        </Reveal>

        <Stagger className="landing-usecase-grid" stagger={0.05} delayStart={0.1}>
          {useCases.map((question) => (
            <StaggerItem key={question}>
              <article className="landing-card landing-usecase-card">
                <MessageCircleQuestion size={20} aria-hidden="true" />
                <h3>{question}</h3>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
