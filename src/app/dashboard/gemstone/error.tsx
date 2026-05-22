"use client";

export default function GemstoneError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#060410",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      fontFamily: "system-ui, sans-serif",
      color: "#c8c0a8",
      padding: 32,
      textAlign: "center",
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "linear-gradient(135deg, #3c2880, #c8a030)",
        display: "grid",
        placeItems: "center",
        fontSize: 24,
      }}>✦</div>
      <h1 style={{ margin: 0, color: "#f0e8d0", fontSize: 26, fontWeight: 600 }}>
        Gemstone Engine Unavailable
      </h1>
      <p style={{ maxWidth: 480, lineHeight: 1.7, margin: 0, color: "#a09880" }}>
        The gemstone analysis engine encountered an unexpected error. Your chart data is safe.
        Try reloading the page.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "10px 22px",
          borderRadius: 10,
          border: "1px solid rgba(200,160,48,0.45)",
          background: "transparent",
          color: "#e8c060",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Retry
      </button>
    </main>
  );
}
