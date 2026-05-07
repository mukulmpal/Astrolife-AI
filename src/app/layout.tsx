import type { Metadata } from "next";
import "./globals.css";
import { HtmlPreferencesSync } from "@/components/global-preferences-toggle";

export const metadata: Metadata = {
  title: "AstroLife",
  description: "AI-powered Vedic astrology and life intelligence platform.",
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
        {children}
        <HtmlPreferencesSync />
      </body>
    </html>
  );
}
