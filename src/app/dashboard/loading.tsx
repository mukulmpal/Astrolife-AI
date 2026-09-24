export default function DashboardLoading() {
  return (
    <div
      style={{
        padding: "32px 24px",
        maxWidth: "1120px",
        margin: "0 auto",
        minHeight: "80vh",
      }}
    >
      {/* Header skeleton */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            height: "14px",
            width: "120px",
            background: "rgba(212, 175, 55, 0.2)",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        />
        <div
          style={{
            height: "32px",
            width: "300px",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "6px",
            marginBottom: "8px",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "420px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Grid of skeleton cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: "160px",
              background: "rgba(255, 255, 255, 0.025)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "14px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  height: "18px",
                  width: "100px",
                  background: "rgba(255, 255, 255, 0.06)",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  height: "18px",
                  width: "40px",
                  background: "rgba(212, 175, 55, 0.15)",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div
              style={{
                height: "14px",
                width: "80%",
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                height: "12px",
                width: "60%",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

