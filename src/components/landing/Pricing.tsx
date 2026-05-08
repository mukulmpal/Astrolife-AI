import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { ctaHref, pricingPlans } from "@/data/landing";

export function Pricing() {
  return (
    <section className="landing-section" id="pricing">
      <div className="landing-container">
        <div className="landing-section-head landing-section-head-center">
          <span className="landing-eyebrow">Pricing</span>
          <h2>Start free. Upgrade when you want the full intelligence layer.</h2>
        </div>

        <div className="landing-pricing-grid">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={`landing-card landing-price-card ${plan.popular ? "is-popular" : ""}`}>
              {plan.popular && (
                <div className="landing-popular">
                  <Sparkles size={13} aria-hidden="true" />
                  Most Popular
                </div>
              )}
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="landing-price">
                <strong>{plan.price}</strong>
                <span>{plan.cadence}</span>
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={plan.name === "Free" ? ctaHref : "/dashboard/upgrade"} className={`landing-btn ${plan.popular ? "landing-btn-primary" : "landing-btn-ghost"}`}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
