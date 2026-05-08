import { metrics } from "@/data/landing";

export function SocialProof() {
  return (
    <section className="landing-social" aria-label="AstroLife platform metrics">
      <div className="landing-container landing-metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="landing-metric">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
