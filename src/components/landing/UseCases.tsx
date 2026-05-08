import { MessageCircleQuestion } from "lucide-react";
import { useCases } from "@/data/landing";

export function UseCases() {
  return (
    <section className="landing-section landing-section-alt">
      <div className="landing-container">
        <div className="landing-section-head">
          <span className="landing-eyebrow">Questions AstroLife Can Answer</span>
          <h2>Ask the questions people actually bring to astrology.</h2>
        </div>

        <div className="landing-usecase-grid">
          {useCases.map((question) => (
            <article key={question} className="landing-card landing-usecase-card">
              <MessageCircleQuestion size={20} aria-hidden="true" />
              <h3>{question}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
