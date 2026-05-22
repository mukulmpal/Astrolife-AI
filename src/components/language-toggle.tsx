"use client";

import { useSyncExternalStore } from "react";
import { useLanguage, type Language } from "@/lib/language-context";

const LANGS: Array<{ key: Language; label: string }> = [
  { key: "english" as Language, label: "EN" },
  { key: "hinglish" as Language, label: "Hi-En" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const shellStyle = {
    display: "inline-flex",
    gap: 4,
    padding: 4,
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
  } as const;

  const getButtonStyle = (active: boolean, disabled = false) =>
    ({
      border: "none",
      cursor: disabled ? "default" : "pointer",
      padding: "5px 12px",
      borderRadius: 16,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: "Outfit, sans-serif",
      letterSpacing: "0.5px",
      transition: "all 0.2s ease",
      background: active
        ? "linear-gradient(135deg, #c8a030, #a06820)"
        : "transparent",
      color: active ? "#08051a" : "#605890",
    }) as const;

  if (!mounted) {
    return (
      <div suppressHydrationWarning style={shellStyle}>
        <button type="button" disabled style={getButtonStyle(true, true)}>
          EN
        </button>
        <button type="button" disabled style={getButtonStyle(false, true)}>
          Hi-En
        </button>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning style={shellStyle}>
      {LANGS.map((l) => {
        const active = lang === l.key;

        return (
          <button
            key={String(l.key)}
            type="button"
            onClick={() => setLang(l.key)}
            style={getButtonStyle(active)}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
