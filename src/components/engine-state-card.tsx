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
    <section
      style={{
        background: "#0d0a22",
        border: "1px solid #1f1a42",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 34,
          lineHeight: 1.1,
          color: "#f0e8d0",
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 13, color: "#8b80bf", marginTop: 6 }}>
        {loading ? loadingText : emptyText}
      </p>
    </section>
  );
}
