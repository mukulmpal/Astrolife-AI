"use client";

import type { ReactNode } from "react";

export default function TransitsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(250,204,21,0.10), transparent 30%), #070711",
        color: "white",
      }}
    >
      {children}
    </div>
  );
}
