"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "english" | "hindi" | "hinglish";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "hinglish",
  setLang: () => {},
  t: (key, fallback) => fallback || key,
});

const STORAGE_KEY = "astrolife_language";

// ── Master Translation Dictionary ─────────────────────────────
// Keys are dot-notation: "page.section.label"
// Each value has { english, hindi, hinglish }
const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // ── Common ──
  "common.generate_chart": { english: "Generate Chart", hindi: "कुंडली बनाएं", hinglish: "Chart Generate Karein" },
  "common.loading": { english: "Loading...", hindi: "लोड हो रहा है...", hinglish: "Loading..." },
  "common.score": { english: "Score", hindi: "अंक", hinglish: "Score" },
  "common.total": { english: "Total", hindi: "कुल", hinglish: "Total" },
  "common.strong": { english: "Strong", hindi: "मजबूत", hinglish: "Strong" },
  "common.weak": { english: "Weak", hindi: "कमज़ोर", hinglish: "Weak" },
  "common.average": { english: "Average", hindi: "सामान्य", hinglish: "Average" },
  "common.excellent": { english: "Excellent", hindi: "उत्तम", hinglish: "Excellent" },
  "common.good": { english: "Good", hindi: "अच्छा", hinglish: "Accha" },
  "common.supportive": { english: "Supportive", hindi: "सहायक", hinglish: "Supportive" },
  "common.mixed": { english: "Mixed", hindi: "मिश्रित", hinglish: "Mixed" },
  "common.needs_patience": { english: "Needs Patience", hindi: "धैर्य चाहिए", hinglish: "Patience Chahiye" },
  "common.careful": { english: "Needs Careful Handling", hindi: "सावधानी चाहिए", hinglish: "Careful Handling Chahiye" },
  "common.remedies": { english: "Remedies", hindi: "उपाय", hinglish: "Remedies / Upaay" },
  "common.chart_required": { english: "Chart Required", hindi: "कुंडली आवश्यक है", hinglish: "Chart Required Hai" },
  "common.chart_required_desc": { english: "Complete onboarding to see this analysis.", hindi: "यह विश्लेषण देखने के लिए ऑनबोर्डिंग पूरा करें।", hinglish: "Ye analysis dekhne ke liye onboarding complete karein." },
  "common.house": { english: "House", hindi: "भाव", hinglish: "House / Bhav" },
  "common.planet": { english: "Planet", hindi: "ग्रह", hinglish: "Grah" },
  "common.sign": { english: "Sign", hindi: "राशि", hinglish: "Rashi" },
  "common.nakshatra": { english: "Nakshatra", hindi: "नक्षत्र", hinglish: "Nakshatra" },
  "common.dasha": { english: "Dasha Period", hindi: "दशा काल", hinglish: "Dasha Period" },
  "common.retrograde": { english: "Retrograde", hindi: "वक्री", hinglish: "Vakri (Retrograde)" },
  "common.exalted": { english: "Exalted", hindi: "उच्च", hinglish: "Uchcha (Exalted)" },
  "common.debilitated": { english: "Debilitated", hindi: "नीच", hinglish: "Neech (Debilitated)" },
  "common.own_sign": { english: "Own Sign", hindi: "स्वगृही", hinglish: "Swa-Grihi (Own Sign)" },

  // ── Dashboard Home ──
  "dashboard.title": { english: "Your Cosmic Dashboard", hindi: "आपका ज्योतिष डैशबोर्ड", hinglish: "Aapka Cosmic Dashboard" },

  // ── Kundali Milan ──
  "milan.page_tag": { english: "Relationship Intelligence", hindi: "💑 विवाह बुद्धिमत्ता", hinglish: "💑 Relationship Intelligence" },
  "milan.page_title": { english: "Marriage & Compatibility", hindi: "विवाह और अनुकूलता", hinglish: "Marriage & Compatibility" },
  "milan.page_sub": { english: "Marriage Promise · Ashtakoot Milan · Children Awareness · KP Validation · Psychology · Timing", hindi: "विवाह योग · अष्टकूट मिलान · संतान योग · KP सत्यापन · मनोविज्ञान · समय", hinglish: "Marriage Promise · Ashtakoot Milan · Children Awareness · KP Validation · Psychology · Timing" },
  "milan.groom_label": { english: "Groom's Birth Details", hindi: "👨 वर की जन्म पत्रिका", hinglish: "👨 Ladke ki Janam Patrika" },
  "milan.bride_label": { english: "Bride's Birth Details", hindi: "👩 कन्या की जन्म पत्रिका", hinglish: "👩 Ladki ki Janam Patrika" },
  "milan.calculate_btn": { english: "💑 Calculate Ashtakoot Compatibility", hindi: "💑 अष्टकूट मिलान गणना करें", hinglish: "💑 Milan Karein — Ashtakoot Calculate" },
  "milan.tab_marriage": { english: "💍 Marriage", hindi: "💍 विवाह", hinglish: "💍 Marriage" },
  "milan.tab_koots": { english: "8 Koots", hindi: "8 कूट", hinglish: "8 Koots" },
  "milan.tab_psychology": { english: "🧠 Psychology", hindi: "🧠 मनोविज्ञान", hinglish: "🧠 Psychology" },
  "milan.tab_children": { english: "👶 Children", hindi: "👶 संतान", hinglish: "👶 Children" },
  "milan.tab_kp": { english: "🔬 KP", hindi: "🔬 KP", hinglish: "🔬 KP" },
  "milan.tab_timing": { english: "⏱️ Timing", hindi: "⏱️ समय", hinglish: "⏱️ Timing" },
  "milan.tab_doshas": { english: "⚠️ Doshas", hindi: "⚠️ दोष", hinglish: "⚠️ Doshas" },
  "milan.marriage_score": { english: "Marriage Intelligence Score", hindi: "विवाह बुद्धिमत्ता अंक", hinglish: "Marriage Intelligence Score" },
  "milan.marriage_promise": { english: "Marriage Promise", hindi: "विवाह योग", hinglish: "Marriage Promise" },
  "milan.manglik_balance": { english: "Manglik Balance", hindi: "मांगलिक संतुलन", hinglish: "Manglik Balance" },
  "milan.ashtakoot_integration": { english: "Ashtakoot Integration", hindi: "अष्टकूट एकीकरण", hinglish: "Ashtakoot Integration" },
  "milan.children_awareness": { english: "Children Awareness", hindi: "संतान योग", hinglish: "Children Awareness" },
  "milan.kp_marriage": { english: "KP Marriage Validation (2-7-11)", hindi: "KP विवाह सत्यापन (2-7-11)", hinglish: "KP Marriage Validation (2-7-11)" },
  "milan.kp_children": { english: "KP Children Validation (2-5-11)", hindi: "KP संतान सत्यापन (2-5-11)", hinglish: "KP Children Validation (2-5-11)" },
  "milan.timing_support": { english: "Marriage Timing Support", hindi: "विवाह समय समर्थन", hinglish: "Marriage Timing Support" },
  "milan.rel_psychology": { english: "Relationship Psychology", hindi: "संबंध मनोविज्ञान", hinglish: "Relationship Psychology" },
  "milan.no_dosha": { english: "No Doshas Detected", hindi: "कोई दोष नहीं मिला", hinglish: "Koi Dosha Nahi Mila" },
  "milan.dosha_note": { english: "Doshas are compatibility stresses — not curses. Every dosha has traditional remedies.", hindi: "दोष अनुकूलता तनाव हैं — श्राप नहीं। हर दोष का पारंपरिक उपाय है।", hinglish: "Doshas compatibility stresses hain — curses nahi. Har dosha ka traditional remedy hai." },
  "milan.enter_partner": { english: "Enter Partner Details Above", hindi: "ऊपर साथी का विवरण दर्ज करें", hinglish: "Partner Details Upar Daalein" },
  "milan.janma_nak": { english: "BIRTH NAKSHATRA", hindi: "जन्म नक्षत्र", hinglish: "JANMA NAKSHATRA" },
  "milan.janma_rashi": { english: "BIRTH RASHI", hindi: "जन्म राशि", hinglish: "JANMA RASHI" },
  "milan.out_of_36": { english: "out of 36", hindi: "36 में से", hinglish: "out of 36" },

  // ── Ashtakavarga ──
  "akv.page_tag": { english: "✦ Ashtakavarga", hindi: "✦ अष्टकवर्ग", hinglish: "✦ Ashtakavarga" },
  "akv.page_title": { english: "Ashtakavarga Analysis", hindi: "अष्टकवर्ग विश्लेषण", hinglish: "Ashtakavarga Analysis" },
  "akv.page_sub": { english: "Bindu System · Planet Strength · House Guide · Sodhya Pinda", hindi: "बिन्दु प्रणाली · ग्रह बल · भाव मार्गदर्शन · शोध्य पिंड", hinglish: "Bindu System · Planet Strength · House Guide · Sodhya Pinda" },
  "akv.tab_life_map": { english: "Life Map", hindi: "जीवन मानचित्र", hinglish: "Life Map" },
  "akv.tab_sarva": { english: "Sarvashtakavarga", hindi: "सर्वाष्टकवर्ग", hinglish: "Sarvashtakavarga" },
  "akv.tab_planets": { english: "Planet Insights", hindi: "ग्रह अंतर्दृष्टि", hinglish: "Planet Insights" },
  "akv.tab_houses": { english: "House Guide", hindi: "भाव मार्गदर्शन", hinglish: "House Guide" },
  "akv.tab_pinda": { english: "Sodhya Pinda", hindi: "शोध्य पिंड", hinglish: "Sodhya Pinda" },
  "akv.tab_howto": { english: "How to Read", hindi: "कैसे पढ़ें", hinglish: "Kaise Padhein" },
  "akv.strongest": { english: "Strongest Life Areas", hindi: "सबसे मजबूत जीवन क्षेत्र", hinglish: "Sabse Strong Life Areas" },
  "akv.weakest": { english: "Growth Areas", hindi: "विकास क्षेत्र", hinglish: "Growth Areas" },

  // ── Yogas ──
  "yogas.page_tag": { english: "✦ Yoga Detection", hindi: "✦ योग पहचान", hinglish: "✦ Yoga Detection" },
  "yogas.page_title": { english: "Yoga Analysis", hindi: "योग विश्लेषण", hinglish: "Yoga Analysis" },
  "yogas.active": { english: "Active Yogas", hindi: "सक्रिय योग", hinglish: "Active Yogas" },
  "yogas.rare": { english: "Rare", hindi: "दुर्लभ", hinglish: "Rare" },

  // ── Dasha ──
  "dasha.page_tag": { english: "✦ Dasha Timeline", hindi: "✦ दशा समयरेखा", hinglish: "✦ Dasha Timeline" },
  "dasha.page_title": { english: "Vimshottari Dasha", hindi: "विंशोत्तरी दशा", hinglish: "Vimshottari Dasha" },
  "dasha.mahadasha": { english: "Mahadasha", hindi: "महादशा", hinglish: "Mahadasha" },
  "dasha.antardasha": { english: "Antardasha", hindi: "अंतर्दशा", hinglish: "Antardasha" },
  "dasha.current": { english: "Current Period", hindi: "वर्तमान काल", hinglish: "Current Period" },

  // ── Shadbala ──
  "shadbala.page_tag": { english: "✦ Shadbala", hindi: "✦ षड्बल", hinglish: "✦ Shadbala" },
  "shadbala.page_title": { english: "Six-fold Strength", hindi: "षड्बल — छह प्रकार का बल", hinglish: "Shadbala — 6 Strengths" },

  // ── Transits ──
  "transits.page_tag": { english: "✦ Transits", hindi: "✦ गोचर", hinglish: "✦ Gochar (Transits)" },
  "transits.page_title": { english: "Current Transits", hindi: "वर्तमान गोचर", hinglish: "Current Gochar" },

  // ── Event Radar ──
  "radar.page_tag": { english: "✦ Event Radar", hindi: "✦ घटना रडार", hinglish: "✦ Event Radar" },
  "radar.page_title": { english: "Upcoming Events", hindi: "आगामी घटनाएं", hinglish: "Upcoming Events" },

  // ── Lal Kitab ──
  "lalkitab.page_tag": { english: "✦ Lal Kitab", hindi: "✦ लाल किताब", hinglish: "✦ Lal Kitab" },
  "lalkitab.page_title": { english: "Lal Kitab Analysis", hindi: "लाल किताब विश्लेषण", hinglish: "Lal Kitab Analysis" },

  // ── KP ──
  "kp.page_tag": { english: "✦ KP System", hindi: "✦ KP पद्धति", hinglish: "✦ KP System" },
  "kp.page_title": { english: "Krishnamurti Paddhati", hindi: "कृष्णमूर्ति पद्धति", hinglish: "Krishnamurti Paddhati" },

  // ── Numerology ──
  "numerology.page_tag": { english: "✦ Numerology", hindi: "✦ अंक ज्योतिष", hinglish: "✦ Numerology" },
  "numerology.page_title": { english: "Numerology Analysis", hindi: "अंक ज्योतिष विश्लेषण", hinglish: "Numerology Analysis" },

  // ── Panchang ──
  "panchang.page_tag": { english: "✦ Panchang", hindi: "✦ पंचांग", hinglish: "✦ Panchang" },
  "panchang.page_title": { english: "Today's Panchang", hindi: "आज का पंचांग", hinglish: "Aaj ka Panchang" },

  // ── Gemstone ──
  "gemstone.page_tag": { english: "✦ Gemstones", hindi: "✦ रत्न", hinglish: "✦ Gemstones / Ratna" },
  "gemstone.page_title": { english: "Gemstone Recommendations", hindi: "रत्न सुझाव", hinglish: "Gemstone Recommendations" },

  // ── Remedy ──
  "remedy.page_tag": { english: "✦ Remedies", hindi: "✦ उपाय", hinglish: "✦ Upaay / Remedies" },
  "remedy.page_title": { english: "Personalized Remedies", hindi: "व्यक्तिगत उपाय", hinglish: "Personalized Upaay" },

  // ── Divisional ──
  "divisional.page_tag": { english: "✦ Divisional Charts", hindi: "✦ वर्ग कुंडली", hinglish: "✦ Divisional Charts / Varga" },
  "divisional.page_title": { english: "Divisional Charts", hindi: "वर्ग कुंडली", hinglish: "Varga Kundali" },

  // ── Psychology ──
  "psychology.page_tag": { english: "✦ Astro Psychology", hindi: "✦ ज्योतिष मनोविज्ञान", hinglish: "✦ Astro Psychology" },
  "psychology.page_title": { english: "Psychological Profile", hindi: "मनोवैज्ञानिक प्रोफ़ाइल", hinglish: "Psychological Profile" },

  // ── Prashna ──
  "prashna.page_tag": { english: "✦ Prashna Kundli", hindi: "✦ प्रश्न कुंडली", hinglish: "✦ Prashna Kundli" },
  "prashna.page_title": { english: "Horary Astrology", hindi: "प्रश्न ज्योतिष", hinglish: "Prashna Kundli" },

  // ── Vastu ──
  "vastu.page_tag": { english: "✦ Vastu", hindi: "✦ वास्तु", hinglish: "✦ Vastu" },
  "vastu.page_title": { english: "Vastu Analysis", hindi: "वास्तु विश्लेषण", hinglish: "Vastu Analysis" },

  // ── Jaimini ──
  "jaimini.page_tag": { english: "✦ Jaimini", hindi: "✦ जैमिनी", hinglish: "✦ Jaimini" },
  "jaimini.page_title": { english: "Jaimini Astrology", hindi: "जैमिनी ज्योतिष", hinglish: "Jaimini Astrology" },

  // ── Special Lagnas ──
  "lagnas.page_tag": { english: "✦ Special Lagnas", hindi: "✦ विशेष लग्न", hinglish: "✦ Special Lagnas" },
  "lagnas.page_title": { english: "Special Lagnas", hindi: "विशेष लग्न", hinglish: "Special Lagnas" },

  // ── Sarvatobhadra ──
  "sarva.page_tag": { english: "✦ Sarvatobhadra", hindi: "✦ सर्वतोभद्र", hinglish: "✦ Sarvatobhadra" },
  "sarva.page_title": { english: "Sarvatobhadra Chakra", hindi: "सर्वतोभद्र चक्र", hinglish: "Sarvatobhadra Chakra" },

  // ── Medical ──
  "medical.page_tag": { english: "✦ Health Awareness", hindi: "✦ स्वास्थ्य जागरूकता", hinglish: "✦ Health Awareness" },
  "medical.page_title": { english: "Health Awareness", hindi: "स्वास्थ्य जागरूकता", hinglish: "Health Awareness" },

  // ── Destiny ──
  "destiny.page_tag": { english: "✦ Destiny Reading", hindi: "✦ भाग्य पठन", hinglish: "✦ Destiny Reading" },
  "destiny.page_title": { english: "Destiny & Purpose", hindi: "भाग्य और उद्देश्य", hinglish: "Destiny & Purpose" },

  // ── Language Toggle ──
  "lang.english": { english: "English", hindi: "English", hinglish: "English" },
  "lang.hindi": { english: "हिन्दी", hindi: "हिन्दी", hinglish: "हिन्दी" },
  "lang.hinglish": { english: "Hinglish", hindi: "Hinglish", hinglish: "Hinglish" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "hinglish";
    const saved = (window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem("chatLanguageMode")) as Language | null;
    return saved && ["english", "hindi", "hinglish"].includes(saved) ? saved : "hinglish";
  });

  useEffect(() => {
    document.documentElement.dataset.languageMode = lang;
    document.documentElement.lang = lang === "hindi" ? "hi" : "en";
  }, [lang]);

  const setLang = (l: Language) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    window.localStorage.setItem("chatLanguageMode", l);
    document.documentElement.dataset.languageMode = l;
    document.documentElement.lang = l === "hindi" ? "hi" : "en";
  };

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return fallback || key;
    return entry[lang] || entry["english"] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  return { ...ctx, tp: (name: string) => translatePlanet(name, ctx.lang), ts: (name: string) => translateSign(name, ctx.lang), tn: (name: string) => translateNakshatra(name, ctx.lang), th: (house: number) => translateHouse(house, ctx.lang) };
}

// ── Export translations for engine usage ──
export { TRANSLATIONS };

// ══════════════════════════════════════════════════════════════
// ASTRO TERM TRANSLATIONS — Planets, Signs, Nakshatras, Houses
// ══════════════════════════════════════════════════════════════

const PLANET_NAMES: Record<string, Record<Language, string>> = {
  Sun:     { english: "Sun",     hindi: "सूर्य",  hinglish: "Surya (Sun)" },
  Moon:    { english: "Moon",    hindi: "चन्द्र", hinglish: "Chandra (Moon)" },
  Mars:    { english: "Mars",    hindi: "मंगल",   hinglish: "Mangal (Mars)" },
  Mercury: { english: "Mercury", hindi: "बुध",    hinglish: "Budh (Mercury)" },
  Jupiter: { english: "Jupiter", hindi: "बृहस्पति", hinglish: "Guru (Jupiter)" },
  Venus:   { english: "Venus",   hindi: "शुक्र",  hinglish: "Shukra (Venus)" },
  Saturn:  { english: "Saturn",  hindi: "शनि",   hinglish: "Shani (Saturn)" },
  Rahu:    { english: "Rahu",    hindi: "राहु",   hinglish: "Rahu" },
  Ketu:    { english: "Ketu",    hindi: "केतु",   hinglish: "Ketu" },
};

const SIGN_NAMES: Record<string, Record<Language, string>> = {
  Aries:       { english: "Aries",       hindi: "मेष",     hinglish: "Mesh (Aries)" },
  Taurus:      { english: "Taurus",      hindi: "वृषभ",    hinglish: "Vrishabh (Taurus)" },
  Gemini:      { english: "Gemini",      hindi: "मिथुन",   hinglish: "Mithun (Gemini)" },
  Cancer:      { english: "Cancer",      hindi: "कर्क",    hinglish: "Kark (Cancer)" },
  Leo:         { english: "Leo",         hindi: "सिंह",    hinglish: "Simha (Leo)" },
  Virgo:       { english: "Virgo",       hindi: "कन्या",   hinglish: "Kanya (Virgo)" },
  Libra:       { english: "Libra",       hindi: "तुला",    hinglish: "Tula (Libra)" },
  Scorpio:     { english: "Scorpio",     hindi: "वृश्चिक", hinglish: "Vrishchik (Scorpio)" },
  Sagittarius: { english: "Sagittarius", hindi: "धनु",     hinglish: "Dhanu (Sagittarius)" },
  Capricorn:   { english: "Capricorn",   hindi: "मकर",    hinglish: "Makar (Capricorn)" },
  Aquarius:    { english: "Aquarius",    hindi: "कुम्भ",   hinglish: "Kumbh (Aquarius)" },
  Pisces:      { english: "Pisces",      hindi: "मीन",    hinglish: "Meen (Pisces)" },
};

const NAKSHATRA_NAMES: Record<string, Record<Language, string>> = {
  Ashwini:          { english: "Ashwini",          hindi: "अश्विनी",       hinglish: "Ashwini" },
  Bharani:          { english: "Bharani",          hindi: "भरणी",         hinglish: "Bharani" },
  Krittika:         { english: "Krittika",         hindi: "कृत्तिका",      hinglish: "Krittika" },
  Rohini:           { english: "Rohini",           hindi: "रोहिणी",        hinglish: "Rohini" },
  Mrigashira:       { english: "Mrigashira",       hindi: "मृगशिरा",      hinglish: "Mrigashira" },
  Ardra:            { english: "Ardra",            hindi: "आर्द्रा",       hinglish: "Ardra" },
  Punarvasu:        { english: "Punarvasu",        hindi: "पुनर्वसु",      hinglish: "Punarvasu" },
  Pushya:           { english: "Pushya",           hindi: "पुष्य",        hinglish: "Pushya" },
  Ashlesha:         { english: "Ashlesha",         hindi: "आश्लेषा",      hinglish: "Ashlesha" },
  Magha:            { english: "Magha",            hindi: "मघा",          hinglish: "Magha" },
  "Purva Phalguni": { english: "Purva Phalguni",   hindi: "पूर्व फाल्गुनी", hinglish: "Purva Phalguni" },
  "Uttara Phalguni":{ english: "Uttara Phalguni",  hindi: "उत्तर फाल्गुनी", hinglish: "Uttara Phalguni" },
  Hasta:            { english: "Hasta",            hindi: "हस्त",         hinglish: "Hasta" },
  Chitra:           { english: "Chitra",           hindi: "चित्रा",        hinglish: "Chitra" },
  Swati:            { english: "Swati",            hindi: "स्वाति",        hinglish: "Swati" },
  Vishakha:         { english: "Vishakha",         hindi: "विशाखा",       hinglish: "Vishakha" },
  Anuradha:         { english: "Anuradha",         hindi: "अनुराधा",      hinglish: "Anuradha" },
  Jyeshtha:         { english: "Jyeshtha",         hindi: "ज्येष्ठा",      hinglish: "Jyeshtha" },
  Mula:             { english: "Mula",             hindi: "मूल",          hinglish: "Mool" },
  "Purva Ashadha":  { english: "Purva Ashadha",    hindi: "पूर्वाषाढ़ा",   hinglish: "Purva Ashadha" },
  "Uttara Ashadha": { english: "Uttara Ashadha",   hindi: "उत्तराषाढ़ा",   hinglish: "Uttara Ashadha" },
  Shravana:         { english: "Shravana",         hindi: "श्रवण",        hinglish: "Shravan" },
  Dhanishta:        { english: "Dhanishta",        hindi: "धनिष्ठा",      hinglish: "Dhanishta" },
  Shatabhisha:      { english: "Shatabhisha",      hindi: "शतभिषा",      hinglish: "Shatabhisha" },
  "Purva Bhadrapada":  { english: "Purva Bhadrapada",  hindi: "पूर्व भाद्रपद", hinglish: "Purva Bhadrapada" },
  "Uttara Bhadrapada": { english: "Uttara Bhadrapada", hindi: "उत्तर भाद्रपद", hinglish: "Uttara Bhadrapada" },
  Revati:           { english: "Revati",           hindi: "रेवती",        hinglish: "Revati" },
};

const HOUSE_NAMES: Record<number, Record<Language, string>> = {
  1:  { english: "1st House (Ascendant)", hindi: "प्रथम भाव (लग्न)",     hinglish: "1st House (Lagna)" },
  2:  { english: "2nd House (Wealth)",    hindi: "द्वितीय भाव (धन)",     hinglish: "2nd House (Dhan)" },
  3:  { english: "3rd House (Siblings)",  hindi: "तृतीय भाव (सहज)",     hinglish: "3rd House (Sahaj)" },
  4:  { english: "4th House (Home)",      hindi: "चतुर्थ भाव (सुख)",     hinglish: "4th House (Sukh)" },
  5:  { english: "5th House (Children)",  hindi: "पंचम भाव (संतान)",    hinglish: "5th House (Santan)" },
  6:  { english: "6th House (Enemies)",   hindi: "षष्ठ भाव (शत्रु)",     hinglish: "6th House (Shatru)" },
  7:  { english: "7th House (Marriage)",  hindi: "सप्तम भाव (विवाह)",   hinglish: "7th House (Vivah)" },
  8:  { english: "8th House (Mystery)",   hindi: "अष्टम भाव (आयु)",     hinglish: "8th House (Aayu)" },
  9:  { english: "9th House (Fortune)",   hindi: "नवम भाव (भाग्य)",     hinglish: "9th House (Bhagya)" },
  10: { english: "10th House (Career)",   hindi: "दशम भाव (कर्म)",      hinglish: "10th House (Karma)" },
  11: { english: "11th House (Gains)",    hindi: "एकादश भाव (लाभ)",    hinglish: "11th House (Labh)" },
  12: { english: "12th House (Loss)",     hindi: "द्वादश भाव (व्यय)",    hinglish: "12th House (Vyay)" },
};

const DIGNITY_NAMES: Record<string, Record<Language, string>> = {
  Exalted:     { english: "Exalted",     hindi: "उच्च",     hinglish: "Uchcha (Exalted)" },
  Own:         { english: "Own Sign",    hindi: "स्वगृही",   hinglish: "Swa-Grihi (Own)" },
  Friend:      { english: "Friendly",    hindi: "मित्र",    hinglish: "Mitra (Friend)" },
  Neutral:     { english: "Neutral",     hindi: "सम",      hinglish: "Sama (Neutral)" },
  Enemy:       { english: "Enemy",       hindi: "शत्रु",    hinglish: "Shatru (Enemy)" },
  Debilitated: { english: "Debilitated", hindi: "नीच",     hinglish: "Neech (Debilitated)" },
};

export function translatePlanet(name: string, lang: Language): string {
  return PLANET_NAMES[name]?.[lang] || name;
}

export function translateSign(name: string, lang: Language): string {
  return SIGN_NAMES[name]?.[lang] || name;
}

export function translateNakshatra(name: string, lang: Language): string {
  return NAKSHATRA_NAMES[name]?.[lang] || name;
}

export function translateHouse(house: number, lang: Language): string {
  return HOUSE_NAMES[house]?.[lang] || `House ${house}`;
}

export function translateDignity(dignity: string, lang: Language): string {
  return DIGNITY_NAMES[dignity]?.[lang] || dignity;
}

const UI_PHRASE_TRANSLATIONS: Record<string, string> = {
  "Generate your free AI Kundli and get personalized Vedic astrology insights, dashas, transits, remedies, marriage, career and wealth guidance.":
    "अपनी नि:शुल्क AI कुंडली बनाएं और दशा, गोचर, उपाय, विवाह, करियर और धन से जुड़ी व्यक्तिगत वैदिक ज्योतिष जानकारी पाएं।",
  "Complete onboarding to see this analysis.": "यह विश्लेषण देखने के लिए पहले ऑनबोर्डिंग पूरा करें।",
  "Chart Required": "कुंडली आवश्यक है",
  "Generate Chart": "कुंडली बनाएं",
  "Calculate Ashtakoot Compatibility": "अष्टकूट अनुकूलता गणना करें",
  "Your Cosmic Dashboard": "आपका ज्योतिष डैशबोर्ड",
  "Free Kundli": "नि:शुल्क कुंडली",
  "Ask AI Astrologer": "AI ज्योतिषी से पूछें",
  "Personalized Remedies": "व्यक्तिगत उपाय",
  "Remedy Intelligence": "उपाय बुद्धिमत्ता",
  "Never donate": "दान बिल्कुल न करें",
  "Do not donate": "दान न करें",
  "Donation candidates": "दान के योग्य ग्रह",
  "Donation candidate": "दान के योग्य ग्रह",
  "Current Period": "वर्तमान काल",
  "Dasha Period": "दशा काल",
  "Life Map": "जीवन मानचित्र",
  "Planet Insights": "ग्रह अंतर्दृष्टि",
  "House Guide": "भाव मार्गदर्शन",
  "How to Read": "कैसे पढ़ें",
  "Growth Areas": "विकास क्षेत्र",
  "Active Yogas": "सक्रिय योग",
  "Marriage Intelligence Score": "विवाह बुद्धिमत्ता अंक",
  "Marriage Promise": "विवाह योग",
  "Manglik Balance": "मांगलिक संतुलन",
  "Relationship Psychology": "संबंध मनोविज्ञान",
  "Health Awareness": "स्वास्थ्य जागरूकता",
  "Destiny & Purpose": "भाग्य और उद्देश्य",
  "Today's Panchang": "आज का पंचांग",
  "Current Transits": "वर्तमान गोचर",
  "Upcoming Events": "आगामी घटनाएं",
  "Gemstone Recommendations": "रत्न सुझाव",
  "Divisional Charts": "वर्ग कुंडली",
  "Special Lagnas": "विशेष लग्न",
  "Prashna Kundli": "प्रश्न कुंडली",
  "Horary Astrology": "प्रश्न ज्योतिष",
  "Lal Kitab Analysis": "लाल किताब विश्लेषण",
  "Vimshottari Dasha": "विंशोत्तरी दशा",
  "Ashtakavarga Analysis": "अष्टकवर्ग विश्लेषण",
  "Sarvatobhadra Chakra": "सर्वतोभद्र चक्र",
  "Krishnamurti Paddhati": "कृष्णमूर्ति पद्धति",
  "Numerology Analysis": "अंक ज्योतिष विश्लेषण",
  "Vastu Analysis": "वास्तु विश्लेषण",
  "Jaimini Astrology": "जैमिनी ज्योतिष",
  "Psychological Profile": "मनोवैज्ञानिक प्रोफ़ाइल",
  "Six-fold Strength": "छह प्रकार का बल",
};

const UI_TERM_TRANSLATIONS: Record<string, string> = {
  Dashboard: "डैशबोर्ड",
  Home: "होम",
  Kundli: "कुंडली",
  Kundali: "कुंडली",
  Chart: "कुंडली",
  Analysis: "विश्लेषण",
  Insights: "अंतर्दृष्टि",
  Intelligence: "बुद्धिमत्ता",
  Profile: "प्रोफ़ाइल",
  Report: "रिपोर्ट",
  Summary: "सारांश",
  Details: "विवरण",
  Overview: "अवलोकन",
  Calculate: "गणना करें",
  Generate: "बनाएं",
  Save: "सहेजें",
  Download: "डाउनलोड",
  Share: "साझा करें",
  Copy: "कॉपी करें",
  Loading: "लोड हो रहा है",
  Search: "खोजें",
  Name: "नाम",
  Date: "तिथि",
  Time: "समय",
  Place: "स्थान",
  City: "शहर",
  Country: "देश",
  Gender: "लिंग",
  Male: "पुरुष",
  Female: "महिला",
  Other: "अन्य",
  Current: "वर्तमान",
  Active: "सक्रिय",
  Upcoming: "आगामी",
  Past: "पूर्व",
  Start: "आरंभ",
  End: "समाप्ति",
  Score: "अंक",
  Total: "कुल",
  Strength: "बल",
  Strong: "मजबूत",
  Weak: "कमज़ोर",
  Average: "सामान्य",
  Excellent: "उत्तम",
  Good: "अच्छा",
  Poor: "कमज़ोर",
  High: "उच्च",
  Medium: "मध्यम",
  Low: "निम्न",
  Positive: "सकारात्मक",
  Negative: "नकारात्मक",
  Mixed: "मिश्रित",
  Supportive: "सहायक",
  Favourable: "अनुकूल",
  Favorable: "अनुकूल",
  Benefic: "शुभ",
  Malefic: "अशुभ",
  Challenging: "चुनौतीपूर्ण",
  Careful: "सावधान",
  Caution: "सावधानी",
  Risk: "जोखिम",
  Safe: "सुरक्षित",
  Unsafe: "असुरक्षित",
  Validation: "सत्यापन",
  Verified: "सत्यापित",
  Remedy: "उपाय",
  Remedies: "उपाय",
  Donate: "दान करें",
  Donation: "दान",
  Mantra: "मंत्र",
  Charity: "दान",
  Fast: "व्रत",
  Gemstone: "रत्न",
  Gemstones: "रत्न",
  Planet: "ग्रह",
  Planets: "ग्रह",
  House: "भाव",
  Houses: "भाव",
  Sign: "राशि",
  Signs: "राशियां",
  Nakshatra: "नक्षत्र",
  Nakshatras: "नक्षत्र",
  Dasha: "दशा",
  Mahadasha: "महादशा",
  Antardasha: "अंतर्दशा",
  Pratyantardasha: "प्रत्यंतरदशा",
  Navtara: "नवतारा",
  Transit: "गोचर",
  Transits: "गोचर",
  Yoga: "योग",
  Yogas: "योग",
  Dosha: "दोष",
  Doshas: "दोष",
  Lagna: "लग्न",
  Ascendant: "लग्न",
  Rashi: "राशि",
  Varga: "वर्ग",
  Divisional: "वर्ग",
  Panchang: "पंचांग",
  Tithi: "तिथि",
  Karana: "करण",
  Nitya: "नित्य",
  Koot: "कूट",
  Koots: "कूट",
  Ashtakoot: "अष्टकूट",
  Marriage: "विवाह",
  Relationship: "संबंध",
  Compatibility: "अनुकूलता",
  Partner: "साथी",
  Groom: "वर",
  Bride: "कन्या",
  Children: "संतान",
  Career: "करियर",
  Wealth: "धन",
  Finance: "वित्त",
  Health: "स्वास्थ्य",
  Family: "परिवार",
  Education: "शिक्षा",
  Property: "संपत्ति",
  Fortune: "भाग्य",
  Purpose: "उद्देश्य",
  Psychology: "मनोविज्ञान",
  Mental: "मानसिक",
  Emotional: "भावनात्मक",
  Spiritual: "आध्यात्मिक",
  Physical: "शारीरिक",
  Sun: "सूर्य",
  Moon: "चन्द्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "बृहस्पति",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
  Aries: "मेष",
  Taurus: "वृषभ",
  Gemini: "मिथुन",
  Cancer: "कर्क",
  Leo: "सिंह",
  Virgo: "कन्या",
  Libra: "तुला",
  Scorpio: "वृश्चिक",
  Sagittarius: "धनु",
  Capricorn: "मकर",
  Aquarius: "कुम्भ",
  Pisces: "मीन",
  Exalted: "उच्च",
  Debilitated: "नीच",
  Retrograde: "वक्री",
  Combust: "अस्त",
  Friendly: "मित्र",
  Enemy: "शत्रु",
  Neutral: "सम",
  Own: "स्वगृही",
  Lord: "स्वामी",
  Sub: "उप",
  Lordship: "स्वामित्व",
  Timing: "समय",
  Timeline: "समयरेखा",
  Period: "काल",
  Area: "क्षेत्र",
  Areas: "क्षेत्र",
  Life: "जीवन",
  Map: "मानचित्र",
  Guide: "मार्गदर्शन",
  Read: "पढ़ें",
  Birth: "जन्म",
  Free: "नि:शुल्क",
  Personalized: "व्यक्तिगत",
  Vedic: "वैदिक",
  Astrology: "ज्योतिष",
  Astro: "ज्योतिष",
  AI: "AI",
};

const TRANSLATABLE_ATTRIBUTE_NAMES = ["placeholder", "aria-label", "title", "alt"] as const;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyHindiDictionary(text: string): string {
  let translated = text;
  const phrases = Object.entries(UI_PHRASE_TRANSLATIONS).sort((a, b) => b[0].length - a[0].length);
  for (const [source, target] of phrases) {
    translated = translated.replace(new RegExp(escapeRegExp(source), "gi"), target);
  }

  const terms = Object.entries(UI_TERM_TRANSLATIONS).sort((a, b) => b[0].length - a[0].length);
  for (const [source, target] of terms) {
    const boundary = source.includes(" ") ? "" : "\\b";
    translated = translated.replace(new RegExp(`${boundary}${escapeRegExp(source)}${boundary}`, "gi"), target);
  }
  return translated;
}

export function translateUiText(text: string, lang: Language): string {
  if (lang !== "hindi") return text;
  if (!text.trim() || /^[\s\d.,:;()[\]{}'"!?+/_|·•%&@#*-]+$/.test(text)) return text;
  const exact = Object.values(TRANSLATIONS).find((entry) => entry.english === text || entry.hinglish === text);
  if (exact?.hindi) return exact.hindi;

  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const core = text.trim();
  return `${leading}${applyHindiDictionary(core)}${trailing}`;
}

export { TRANSLATABLE_ATTRIBUTE_NAMES };

// Export maps for direct use
export { PLANET_NAMES, SIGN_NAMES, NAKSHATRA_NAMES, HOUSE_NAMES, DIGNITY_NAMES };
