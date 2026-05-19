"use client";

type EngineStateCardProps = {
  title: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
};

export function EngineStateCard({
  title,
  loading = false,
  loadingText = "Loading your chart data...",
  emptyText = "Please complete onboarding to unlock this engine.",
}: EngineStateCardProps) {
  return (
    <section className="engine-card engine-state-card">
      <div className="engine-eyebrow">AstroLife Engine</div>
      <h1>{title}</h1>
      <p>{loading ? loadingText : emptyText}</p>
    </section>
  );
}
