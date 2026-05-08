import { Star } from "lucide-react";
import { testimonials } from "@/data/landing";

export function Testimonials() {
  return (
    <section className="landing-section landing-section-alt">
      <div className="landing-container">
        <div className="landing-section-head">
          <span className="landing-eyebrow">Testimonials</span>
          <h2>People want astrology that feels personal, clear and useful.</h2>
        </div>

        <div className="landing-testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="landing-card landing-testimonial-card">
              <div className="landing-stars-row" aria-label="Five star rating">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={15} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.detail}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
