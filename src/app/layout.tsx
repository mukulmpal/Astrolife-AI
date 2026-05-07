import type { Metadata } from "next";
import "./globals.css";
import { HtmlPreferencesSync } from "@/components/global-preferences-toggle";

export const metadata: Metadata = {
  title: "AstroLife",
  description: "AI-powered Vedic astrology and life intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <HtmlPreferencesSync />
      </body>
    </html>
  );
}
