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
};

export function EngineHeader({ eyebrow, title, subtitle, icon, actions, metrics = [] }: EngineHeaderProps) {
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
