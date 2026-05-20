"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function TransitsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isRipple = pathname.startsWith("/dashboard/transits/ripple");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(250,204,21,0.10), transparent 30%), #070711",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "24px 24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <Link
            href="/dashboard/transits"
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: isRipple
                ? "1px solid rgba(255,255,255,0.14)"
                : "1px solid rgba(250,204,21,0.38)",
              background: isRipple
                ? "rgba(255,255,255,0.06)"
                : "rgba(250,204,21,0.12)",
              color: isRipple ? "rgba(255,255,255,0.78)" : "#facc15",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Transit Overview
          </Link>

          <Link
            href="/dashboard/transits/ripple"
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: isRipple
                ? "1px solid rgba(250,204,21,0.38)"
                : "1px solid rgba(255,255,255,0.14)",
              background: isRipple
                ? "rgba(250,204,21,0.12)"
                : "rgba(255,255,255,0.06)",
              color: isRipple ? "#facc15" : "rgba(255,255,255,0.78)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Transit Ripple V4
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
