"use client";

import { useEffect } from "react";

type LanguageMode = "hindi" | "english" | "hinglish";
type ThemeMode = "dark" | "light";
type LandingTheme = "indigo" | "saffron";

const LANGUAGE_KEY = "chatLanguageMode";
const THEME_KEY = "chatThemeMode";
const LANDING_THEME_KEY = "landingTheme";

function isLanguageMode(value: string | null): value is LanguageMode {
  return value === "hindi" || value === "english" || value === "hinglish";
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "light";
}

function isLandingTheme(value: string | null): value is LandingTheme {
  return value === "indigo" || value === "saffron";
}

function applyLanguageMode(mode: LanguageMode) {
  document.documentElement.dataset.languageMode = mode;
  document.documentElement.lang = mode === "hindi" ? "hi" : "en";
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.dataset.themeMode = mode;
  document.body.dataset.themeMode = mode;
}

function applyLandingTheme(mode: LandingTheme) {
  document.documentElement.dataset.landingTheme = mode;
  document.body.dataset.landingTheme = mode;
}

export function HtmlPreferencesSync() {
  useEffect(() => {
    const sync = () => {
      const language = window.localStorage.getItem(LANGUAGE_KEY);
      const theme = window.localStorage.getItem(THEME_KEY);
      const landingTheme = window.localStorage.getItem(LANDING_THEME_KEY);

      applyLanguageMode(isLanguageMode(language) ? language : "hinglish");
      applyThemeMode(isThemeMode(theme) ? theme : "dark");
      applyLandingTheme(isLandingTheme(landingTheme) ? landingTheme : "indigo");
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("astrolife-preferences-change", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("astrolife-preferences-change", sync);
    };
  }, []);

  return (
    <style>{`
      html[data-theme-mode="light"] body,
      html[data-theme-mode="light"] .page,
      html[data-theme-mode="light"] main,
      html[data-theme-mode="light"] .layout,
      html[data-theme-mode="light"] .dashboard,
      html[data-theme-mode="light"] .chat-layout,
      html[data-theme-mode="light"] .tr-wrap,
      html[data-theme-mode="light"] .er-wrap,
      html[data-theme-mode="light"] .report-shell {
        background: var(--app-bg) !important;
        color: var(--app-fg) !important;
      }

      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) body,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .page,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) main,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .layout,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .dashboard,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .chat-layout,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .tr-wrap,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .er-wrap,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .report-shell {
        background: var(--app-bg) !important;
        color: var(--app-fg) !important;
      }

      html[data-theme-mode="light"] .card,
      html[data-theme-mode="light"] .form-card,
      html[data-theme-mode="light"] .library,
      html[data-theme-mode="light"] .library-card,
      html[data-theme-mode="light"] .result-header,
      html[data-theme-mode="light"] .tabs,
      html[data-theme-mode="light"] .tab.active,
      html[data-theme-mode="light"] .dv-card,
      html[data-theme-mode="light"] .dv-header,
      html[data-theme-mode="light"] .upgrade-card,
      html[data-theme-mode="light"] .premium-card {
        background: var(--app-card) !important;
        border-color: var(--app-border) !important;
        color: var(--app-fg) !important;
      }

      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .card,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .form-card,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .library,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .library-card,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .result-header,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .tabs,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .tab.active,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .dv-card,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .dv-header,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .upgrade-card,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .premium-card {
        background: var(--app-card) !important;
        border-color: var(--app-border) !important;
        color: var(--app-fg) !important;
      }

      html[data-theme-mode="light"] .page-title,
      html[data-theme-mode="light"] .card-title,
      html[data-theme-mode="light"] .result-name,
      html[data-theme-mode="light"] .library-name,
      html[data-theme-mode="light"] .dv-title,
      html[data-theme-mode="light"] h1,
      html[data-theme-mode="light"] h2,
      html[data-theme-mode="light"] h3 {
        color: var(--app-fg) !important;
      }

      html[data-theme-mode="light"] .page-sub,
      html[data-theme-mode="light"] .label,
      html[data-theme-mode="light"] .meta-item,
      html[data-theme-mode="light"] .library-sub,
      html[data-theme-mode="light"] .card-tag,
      html[data-theme-mode="light"] .dv-sub,
      html[data-theme-mode="light"] .dv-card-title {
        color: var(--app-muted) !important;
      }

      html[data-theme-mode="light"] .input,
      html[data-theme-mode="light"] input,
      html[data-theme-mode="light"] textarea,
      html[data-theme-mode="light"] select {
        background: color-mix(in srgb, var(--app-card) 92%, white) !important;
        border-color: var(--app-border) !important;
        color: var(--app-fg) !important;
        color-scheme: light !important;
      }

      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) .input,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) input,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) textarea,
      html[data-landing-theme="saffron"]:not([data-theme-mode="light"]) select {
        background: color-mix(in srgb, var(--app-card) 92%, white 8%) !important;
        border-color: var(--app-border) !important;
        color: var(--app-fg) !important;
        color-scheme: dark !important;
      }
    `}</style>
  );
}
