"use client";

import {
  Bot, Brain, BriefcaseBusiness, Compass, Flame,
  GitBranch, HandHeart, HeartHandshake, IndianRupee, Music2, Radar,
} from "lucide-react";
import { agents } from "@/data/landing";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const iconMap = {
  Brain, BriefcaseBusiness, Compass, Flame, GitBranch,
  HandHeart, HeartHandshake, IndianRupee, Music2, Radar,
};

export function AIAgents() {
  return (
    <section className="landing-section" id="ai-agents">
      <div className="landing-container">
        <Reveal className="landing-section-head landing-section-head-center">
          <span className="landing-eyebrow">AI Specialist Team</span>
          <h2>Meet Your Personal AI Astrology Team.</h2>
          <p>Each agent is trained on a specific astrology domain. This is not one generic chatbot.</p>
        </Reveal>

        <Stagger className="landing-agent-grid" stagger={0.07} delayStart={0.1}>
          {agents.map((agent) => {
            const Icon = iconMap[agent.icon as keyof typeof iconMap] ?? Bot;
            return (
              <StaggerItem key={agent.name}>
                <article className="landing-card landing-agent-card">
                  <div className="landing-agent-top">
                    <span className="landing-agent-avatar">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="landing-badge">Specialist</span>
                  </div>
                  <h3>{agent.name}</h3>
                  <p>{agent.description}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
