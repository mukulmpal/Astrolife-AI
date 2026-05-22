import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type LegalPageProps = {
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <main style={page}>
      <section style={shell}>
        <Link href="/" style={backLink}>
          AstroLife AI
        </Link>
        <p style={eyebrow}>Launch policy</p>
        <h1 style={heading}>{title}</h1>
        <p style={updatedText}>Last updated: {updated}</p>
        <p style={introText}>{intro}</p>
        <div style={content}>{children}</div>
      </section>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={section}>
      <h2 style={sectionHeading}>{title}</h2>
      <div style={sectionBody}>{children}</div>
    </section>
  );
}

const page = {
  minHeight: "100vh",
  background: "#080914",
  color: "#f8fafc",
  padding: "48px 20px",
} satisfies CSSProperties;

const shell = {
  maxWidth: 920,
  margin: "0 auto",
} satisfies CSSProperties;

const backLink = {
  color: "#facc15",
  fontWeight: 700,
  textDecoration: "none",
} satisfies CSSProperties;

const eyebrow = {
  marginTop: 32,
  marginBottom: 10,
  color: "#93c5fd",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.4,
  textTransform: "uppercase",
} satisfies CSSProperties;

const heading = {
  margin: 0,
  fontSize: "clamp(34px, 6vw, 64px)",
  lineHeight: 1,
  letterSpacing: 0,
} satisfies CSSProperties;

const updatedText = {
  marginTop: 16,
  color: "#94a3b8",
} satisfies CSSProperties;

const introText = {
  marginTop: 24,
  color: "#dbeafe",
  fontSize: 19,
  lineHeight: 1.7,
} satisfies CSSProperties;

const content = {
  marginTop: 36,
  display: "grid",
  gap: 28,
} satisfies CSSProperties;

const section = {
  borderTop: "1px solid rgba(255,255,255,0.14)",
  paddingTop: 24,
} satisfies CSSProperties;

const sectionHeading = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.2,
} satisfies CSSProperties;

const sectionBody = {
  marginTop: 12,
  color: "#cbd5e1",
  fontSize: 16,
  lineHeight: 1.75,
} satisfies CSSProperties;
