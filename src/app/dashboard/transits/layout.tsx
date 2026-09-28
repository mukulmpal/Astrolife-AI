"use client";

import type { ReactNode } from "react";

export default function TransitsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF7F2",
        color: "#1A1A1A",
      }}
    >
      {children}
    </div>
  );
}
