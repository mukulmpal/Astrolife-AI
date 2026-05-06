"use client";

import { useEffect, useState } from "react";

type LanguageMode = "hindi" | "english" | "hinglish";
type ThemeMode = "dark" | "light";

const LANGUAGE_KEY = "chatLanguageMode";
const THEME_KEY = "chatThemeMode";

export function GlobalPreferencesToggle() {
  const [languageMode, setLanguageMode] = useState<LanguageMode>("hinglish");
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const lang = window.localStorage.getItem(LANGUAGE_KEY);
    const theme = window.localStorage.getItem(THEME_KEY);

    if (lang === "hindi" || lang === "english" || lang === "hinglish") {
      window.setTimeout(() => setLanguageMode(lang), 0);
    }

    if (theme === "dark" || theme === "light") {
      window.setTimeout(() => setThemeMode(theme), 0);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, languageMode);
    document.documentElement.dataset.languageMode = languageMode;
    document.documentElement.lang = languageMode === "hindi" ? "hi" : "en";
  }, [languageMode]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, themeMode);
    document.documentElement.dataset.themeMode = themeMode;
    document.body.dataset.themeMode = themeMode;
  }, [themeMode]);

  return (
    <div className="global-pref-toggle" aria-label="Language and theme preferences">
      <div className="global-pref-row">
        <button
          type="button"
          className={`global-pref-btn ${languageMode === "hindi" ? "active" : ""}`}
          onClick={() => setLanguageMode("hindi")}
        >
          Hindi
        </button>
        <button
          type="button"
          className={`global-pref-btn ${languageMode === "english" ? "active" : ""}`}
          onClick={() => setLanguageMode("english")}
        >
          English
        </button>
        <button
          type="button"
          className={`global-pref-btn ${languageMode === "hinglish" ? "active" : ""}`}
          onClick={() => setLanguageMode("hinglish")}
        >
          Hinglish
        </button>
      </div>
      <div className="global-pref-row">
        <button
          type="button"
          className={`global-pref-btn ${themeMode === "dark" ? "active" : ""}`}
          onClick={() => setThemeMode("dark")}
        >
          Dark
        </button>
        <button
          type="button"
          className={`global-pref-btn ${themeMode === "light" ? "active" : ""}`}
          onClick={() => setThemeMode("light")}
        >
          Light
        </button>
      </div>
    </div>
  );
}
