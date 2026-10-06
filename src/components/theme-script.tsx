"use client";

import { useServerInsertedHTML } from "next/navigation";

const preferencesScript = `
(() => {
  try {
    const language = localStorage.getItem("chatLanguageMode");
    const theme = localStorage.getItem("chatThemeMode");
    const landingTheme = localStorage.getItem("landingTheme");
    const safeLanguage = ["hindi", "english", "hinglish"].includes(language || "") ? language : "hinglish";
    const safeTheme = theme === "dark" ? "dark" : "light"; // default to light for JyothishAI theme
    const safeLandingTheme = ["indigo", "saffron"].includes(landingTheme || "") ? landingTheme : "indigo";
    document.documentElement.dataset.languageMode = safeLanguage;
    document.documentElement.dataset.themeMode = safeTheme;
    document.documentElement.dataset.landingTheme = safeLandingTheme;
    document.documentElement.lang = safeLanguage === "hindi" ? "hi" : "en";
    document.body.dataset.themeMode = safeTheme;
    document.body.dataset.landingTheme = safeLandingTheme;

    // ── Vedic day-based palette ──────────────────────────────
    // Each weekday maps to its ruling graha's palette.
    // User can pin a preference via localStorage("astroTheme");
    // default is set to ivory (JyothishAI warm pearl ivory & gold theme).
    const PALETTES = ["saffron","ivory","maroon","forest","midnight","ivory","twilight"];
    const VALID = new Set(PALETTES);
    const pinned = localStorage.getItem("astroTheme");
    const palette = (pinned && VALID.has(pinned) && pinned !== "midnight" && pinned !== "saffron") ? pinned : "ivory";
    try { 
      localStorage.setItem("astroTheme", palette);
      localStorage.setItem("chatThemeMode", "light");
    } catch {}
    // Remove any previous theme class and apply the new one
    document.body.classList.forEach(c => { if (c.startsWith("theme-")) document.body.classList.remove(c); });
    document.body.classList.add("theme-" + palette);
    document.documentElement.dataset.palette = palette;
  } catch {}
})();
`;

/**
 * Injects the anti-FOUC theme preferences script directly into the server HTML stream
 * using Next.js `useServerInsertedHTML`. This executes before paint to prevent theme
 * flicker, while completely avoiding React 19's client-side "Encountered a script tag
 * while rendering React component" error since the component returns null on the client.
 */
export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      id="theme-preferences"
      dangerouslySetInnerHTML={{ __html: preferencesScript }}
    />
  ));

  return null;
}
