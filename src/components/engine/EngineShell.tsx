import type { ReactNode } from "react";

type EngineShellProps = {
  children: ReactNode;
  className?: string;
};

export function EngineShell({ children, className = "" }: EngineShellProps) {
  return <main className={`engine-shell ${className}`.trim()}>{children}</main>;
}

type EngineHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  metrics?: Array<{ label: string; value: ReactNode; tone?: "gold" | "green" | "red" | "blue" | "violet" }>;
  confidence?: {
    label?: string;
    value: string;
    detail?: string;
  };
};

export function EngineHeader({ eyebrow, title, subtitle, icon, actions, metrics = [], confidence }: EngineHeaderProps) {
  return (
    <section className="engine-hero">
      <div className="engine-hero-orb" aria-hidden="true" />
      <div className="engine-hero-copy">
        <div className="engine-eyebrow">
          {icon && <span className="engine-eyebrow-icon">{icon}</span>}
          {eyebrow}
        </div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {confidence && (
          <div className="engine-confidence">
            <strong>{confidence.label ?? "Data Confidence"}: {confidence.value}</strong>
            {confidence.detail && <span>{confidence.detail}</span>}
          </div>
        )}
      </div>
      {(metrics.length > 0 || actions) && (
        <div className="engine-hero-side">
          {metrics.length > 0 && (
            <div className="engine-metrics">
              {metrics.map((metric) => (
                <div key={metric.label} className={`engine-metric ${metric.tone ?? "gold"}`}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          )}
          {actions && <div className="engine-actions">{actions}</div>}
        </div>
      )}
    </section>
  );
}

type EngineCardProps = {
  children: ReactNode;
  className?: string;
  accent?: "gold" | "green" | "red" | "blue" | "violet";
};

export function EngineCard({ children, className = "", accent = "gold" }: EngineCardProps) {
  return <section className={`engine-card ${accent} ${className}`.trim()}>{children}</section>;
}

export function EngineSectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="engine-section-title">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

type EngineTrustPanelProps = {
  dataUsed: string[];
  confidence: "High" | "Medium" | "Limited";
  caveat?: string;
  nextAction?: ReactNode;
};

export function EngineTrustPanel({ dataUsed, confidence, caveat, nextAction }: EngineTrustPanelProps) {
  const tone = confidence === "High" ? "green" : confidence === "Medium" ? "gold" : "blue";
  return (
    <EngineCard className="engine-trust-panel" accent={tone}>
      <div>
        <div className="engine-trust-label">Calculation Clarity</div>
        <h2>What This Result Is Based On</h2>
        {caveat && <p>{caveat}</p>}
      </div>
      <div className="engine-trust-grid">
        <div className={`engine-trust-confidence ${tone}`}>
          <strong>{confidence}</strong>
          <span>Data Confidence</span>
        </div>
        <div className="engine-trust-data">
          {dataUsed.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      {nextAction && <div className="engine-trust-action">{nextAction}</div>}
    </EngineCard>
  );
}

type EngineGuidanceGridProps = {
  items: Array<{
    label: string;
    title: string;
    body: string;
    tone?: "gold" | "green" | "red" | "blue" | "violet";
  }>;
};

export function EngineGuidanceGrid({ items }: EngineGuidanceGridProps) {
  return (
    <div className="engine-guidance-grid">
      {items.map((item) => (
        <EngineCard key={item.label} className="engine-guidance-card" accent={item.tone ?? "gold"}>
          <span>{item.label}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </EngineCard>
      ))}
    </div>
  );
}
