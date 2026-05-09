import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { HtmlPreferencesSync } from "@/components/global-preferences-toggle";

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

const preferencesScript = `
(() => {
  try {
    const language = localStorage.getItem("chatLanguageMode");
    const theme = localStorage.getItem("chatThemeMode");
    const landingTheme = localStorage.getItem("landingTheme");
    const safeLanguage = ["hindi", "english", "hinglish"].includes(language || "") ? language : "hinglish";
    const safeTheme = ["dark", "light"].includes(theme || "") ? theme : "dark";
    const safeLandingTheme = ["indigo", "saffron"].includes(landingTheme || "") ? landingTheme : "indigo";
    document.documentElement.dataset.languageMode = safeLanguage;
    document.documentElement.dataset.themeMode = safeTheme;
    document.documentElement.dataset.landingTheme = safeLandingTheme;
    document.documentElement.lang = safeLanguage === "hindi" ? "hi" : "en";
    document.body.dataset.themeMode = safeTheme;
    document.body.dataset.landingTheme = safeLandingTheme;
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} min-h-full flex flex-col`} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
        {children}
        <HtmlPreferencesSync />
      </body>
    </html>
  );
}
