import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { HtmlPreferencesSync } from "@/components/global-preferences-toggle";
import { Analytics } from "@/components/analytics";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://astrolife-ai.vercel.app"),
  title: "AstroLife — AI Vedic Astrology, Free Kundli & Personalized Remedies",
  description:
    "Generate your free AI Kundli and get personalized Vedic astrology insights, dashas, transits, remedies, marriage, career and wealth guidance.",
  openGraph: {
    title: "AstroLife — AI Vedic Astrology, Free Kundli & Personalized Remedies",
    description:
      "Generate your free AI Kundli and get personalized Vedic astrology insights, dashas, transits, remedies, marriage, career and wealth guidance.",
    url: "https://astrolife-ai.vercel.app",
    siteName: "AstroLife AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroLife — AI Vedic Astrology, Free Kundli & Personalized Remedies",
    description:
      "Generate your free AI Kundli and get personalized Vedic astrology insights, dashas, transits, remedies, marriage, career and wealth guidance.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import { ThemeScript } from "@/components/theme-script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-theme-mode="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} ${outfit.variable} min-h-full flex flex-col theme-ivory`} data-theme-mode="light" suppressHydrationWarning>
        <ThemeScript />
        <ThemeProvider>
          {children}
          <Analytics />
          <HtmlPreferencesSync />
        </ThemeProvider>
      </body>
    </html>
  );
}
