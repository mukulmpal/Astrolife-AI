"use client";

import { useLanguage, type Language } from "@/lib/language-context";

const LANGS: { key: Language; label: string; short: string }[] = [
  { key: "english", label: "EN", short: "EN" },
  { key: "hindi", label: "हि", short: "हि" },
  { key: "hinglish", label: "Hi-En", short: "Hi" },
];

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div data-no-translate style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0,
      background: "#0d0b24",
      border: "1px solid #1c1840",
      borderRadius: 20,
      padding: "3px 4px",
      fontSize: compact ? 10 : 11,
      fontWeight: 600,
      fontFamily: "Outfit, sans-serif",
    }}>
      {LANGS.map(l => (
        <button
          key={l.key}
          onClick={() => setLang(l.key)}
          style={{
            border: "none",
            cursor: "pointer",
            padding: compact ? "4px 8px" : "5px 12px",
            borderRadius: 16,
            fontSize: compact ? 10 : 11,
            fontWeight: 600,
            fontFamily: "Outfit, sans-serif",
            letterSpacing: "0.5px",
            transition: "all 0.2s ease",
            background: lang === l.key
              ? "linear-gradient(135deg, #c8a030, #a06820)"
              : "transparent",
            color: lang === l.key ? "#08051a" : "#605890",
          }}
        >
          {compact ? l.short : l.label}
        </button>
      ))}
    </div>
  );
}
