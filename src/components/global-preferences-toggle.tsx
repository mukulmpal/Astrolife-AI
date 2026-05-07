"use client";

import { useEffect } from "react";

type LanguageMode = "hindi" | "english" | "hinglish";
type ThemeMode = "dark" | "light";

const LANGUAGE_KEY = "chatLanguageMode";
const THEME_KEY = "chatThemeMode";

function isLanguageMode(value: string | null): value is LanguageMode {
  return value === "hindi" || value === "english" || value === "hinglish";
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "light";
}

function applyLanguageMode(mode: LanguageMode) {
  document.documentElement.dataset.languageMode = mode;
  document.documentElement.lang = mode === "hindi" ? "hi" : "en";
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.dataset.themeMode = mode;
  document.body.dataset.themeMode = mode;
}

export function HtmlPreferencesSync() {
  useEffect(() => {
    const sync = () => {
      const language = window.localStorage.getItem(LANGUAGE_KEY);
      const theme = window.localStorage.getItem(THEME_KEY);

      applyLanguageMode(isLanguageMode(language) ? language : "hinglish");
      applyThemeMode(isThemeMode(theme) ? theme : "dark");
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("astrolife-preferences-change", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("astrolife-preferences-change", sync);
    };
  }, []);

  return null;
}
