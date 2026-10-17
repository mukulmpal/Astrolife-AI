"use client";

import { useState, useMemo } from "react";
import { EngineEmptyState } from "@/components/engine/engine-intro";
import "@/app/dashboard/shared.css";
import {
  calculateDivisional,
  getSpecialFindings,
  type DivChart,
} from "@/lib/astro-engine/divisional";
import {
  evaluateVargaNeuroKarmicProfile,
  detectKarmicLatentPoints,
} from "@/lib/astro-intelligence/varga-neuro-remedies-engine";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";
import { useLanguage } from "@/lib/language-context";

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const SIGN_ICONS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

const md = (x: number, m: number) => ((x % m) + m) % m;

const CHART_COLORS: Record<string, string> = {
  D1:  "#c8a030",
  D2:  "#eab308",
  D3:  "#22c55e",
  D4:  "#10b981",
  D5:  "#14b8a6",
  D6:  "#f43f5e",
  D7:  "#ec4899",
  D8:  "#8b5cf6",
  D9:  "#a855f7",
  D10: "#f97316",
  D11: "#0ea5e9",
  D12: "#60a5fa",
  D16: "#06b6d4",
  D20: "#8b5cf6",
  D24: "#3b82f6",
  D27: "#2dd4bf",
  D30: "#ef4444",
  D40: "#f59e0b",
  D45: "#6366f1",
  D60: "#d946ef",
};

const CHART_META: Record<string, { icon: string; name: string; domain: string; category: string }> = {
  D1:  { icon: "🔯", name: "Rasi", domain: "Physical Life", category: "Physical" },
  D2:  { icon: "💰", name: "Hora", domain: "Wealth & Finance", category: "Physical" },
  D3:  { icon: "⚡", name: "Drekkana", domain: "Courage & Siblings", category: "Physical" },
  D4:  { icon: "🏠", name: "Chaturthamsha", domain: "Property & Home", category: "Physical" },
  D5:  { icon: "🙏", name: "Panchamsha", domain: "Past Life Merit", category: "Physical" },
  D6:  { icon: "🛡️", name: "Shashthamsha", domain: "Health & Immunity", category: "Physical" },
  D7:  { icon: "👶", name: "Saptamsha", domain: "Children & Legacy", category: "Physical" },
  D8:  { icon: "🔮", name: "Ashtamsha", domain: "Transformation", category: "Physical" },
  D9:  { icon: "💍", name: "Navamsha", domain: "Marriage & Soul", category: "Physical" },
  D10: { icon: "💼", name: "Dasamsha", domain: "Career & Status", category: "Physical" },
  D11: { icon: "🎯", name: "Rudramsha", domain: "Gains & Income", category: "Physical" },
  D12: { icon: "👨‍👩‍👧", name: "Dwadashamsha", domain: "Ancestry & Parents", category: "Physical" },
  D16: { icon: "🚗", name: "Shodashamsha", domain: "Vehicles & Comfort", category: "Mental" },
  D20: { icon: "🕉️", name: "Vimshamsha", domain: "Spiritual Path", category: "Mental" },
  D24: { icon: "📚", name: "Chaturvimshamsha", domain: "Higher Learning", category: "Mental" },
  D27: { icon: "🌟", name: "Saptavimshamsha", domain: "Soul Strength", category: "Subconscious" },
  D30: { icon: "⚠️", name: "Trimshamsha", domain: "Obstacles & Karma", category: "Subconscious" },
  D40: { icon: "☯️", name: "Khavedamsha", domain: "Maternal Grace", category: "Superconscious" },
  D45: { icon: "🎭", name: "Akshavedamsha", domain: "Character & Values", category: "Superconscious" },
  D60: { icon: "🌀", name: "Shashtiamsha", domain: "Root Past Karma", category: "Supraconscious" },
};

const HARMONIC_PLANES = [
  { id: "all", label: "All Vargas (20)", keys: ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D16","D20","D24","D27","D30","D40","D45","D60"] },
  { id: "physical", label: "1. Physical Plane (D1–D12)", keys: ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12"] },
  { id: "mental", label: "2. Conscious Mental (D16–D24)", keys: ["D16","D20","D24"] },
  { id: "subconscious", label: "3. Sub-Conscious (D27–D30)", keys: ["D27","D30"] },
  { id: "superconscious", label: "4. Super-Conscious (D40–D45)", keys: ["D40","D45"] },
  { id: "supraconscious", label: "5. Supra-Conscious Sanchita (D60)", keys: ["D60"] },
];

const VARGA_KARYA_MAP: Record<string, { house: number; karaka: string; label: string }> = {
  D1:  { house: 1,  karaka: "Sun",     label: "Physical Self & Vitality" },
  D2:  { house: 2,  karaka: "Jupiter", label: "Liquid Wealth & Assets" },
  D3:  { house: 3,  karaka: "Mars",    label: "Courage, Willpower & Coborn" },
  D4:  { house: 4,  karaka: "Moon",    label: "Fixed Property & Domestic Sanctum" },
  D5:  { house: 5,  karaka: "Jupiter", label: "Purva Punya, Intellect & Fame" },
  D6:  { house: 6,  karaka: "Mars",    label: "Immunity, Litigation & Service" },
  D7:  { house: 5,  karaka: "Jupiter", label: "Children & Progeny Lineage" },
  D8:  { house: 8,  karaka: "Saturn",  label: "Longevity & Transformation" },
  D9:  { house: 7,  karaka: "Venus",   label: "Marriage, Spouse & Soul Dharma" },
  D10: { house: 10, karaka: "Sun",     label: "Career Apex, Status & Impact" },
  D11: { house: 11, karaka: "Jupiter", label: "Gains & Exponential Income" },
  D12: { house: 9,  karaka: "Sun",     label: "Ancestry, Lineage & Parents" },
  D16: { house: 4,  karaka: "Venus",   label: "Vehicles, Luxury & Inner Peace" },
  D20: { house: 9,  karaka: "Jupiter", label: "Spiritual Upasana & Consciousness" },
  D24: { house: 4,  karaka: "Mercury", label: "Higher Learning & Academic Skill" },
  D27: { house: 3,  karaka: "Moon",    label: "Subconscious Stamina & Resilience" },
  D30: { house: 6,  karaka: "Saturn",  label: "Misfortunes, Evils & Shadow Traps" },
  D40: { house: 4,  karaka: "Moon",    label: "Maternal Grace & Auspicious Luck" },
  D45: { house: 9,  karaka: "Jupiter", label: "Moral Character & Conscience" },
  D60: { house: 12, karaka: "Saturn",  label: "Root Sanchita Karma & Destiny" },
};

const VARGA_DECISION_GUIDE: Record<string, { judge: string; avoid: string; next: string }> = {
  D1: {
    judge: "Use D1 for core vitality, physical stamina, self-identity and foundational life promise.",
    avoid: "Do not neglect micro-vargas; D1 is the seed, vargas show how each branch manifests.",
    next: "Compare D1 Lagna lord strength, Shadbala index, and active Mahadasha lord.",
  },
  D2: {
    judge: "Use D2 (Hora) for liquid wealth capacity, money mindset and asset compounding stamina.",
    avoid: "Do not judge career designation from D2; it governs wealth retention, not profession.",
    next: "Synthesize with D1 2nd/11th houses, Jupiter, and Mercury.",
  },
  D3: {
    judge: "Use D3 (Drekkana) for willpower, execution drive, athletic courage and sibling synergy.",
    avoid: "Do not mistake physical assertiveness for long-term career strategy.",
    next: "Check Mars, D1 3rd lord, and active antardasha activation.",
  },
  D4: {
    judge: "Use D4 (Chaturthamsha) for fixed assets, real estate sanctuary and maternal blessings.",
    avoid: "Do not predict sudden property deals without dasha and 4th lord transit support.",
    next: "Cross-verify with D1 4th house, Moon, and Venus dignities.",
  },
  D5: {
    judge: "Use D5 (Panchamsha) for accumulated past-life spiritual merit, unearned intuition, and creative intelligence.",
    avoid: "Do not judge daily commercial earnings from D5; it governs dharmic grace and intelligence.",
    next: "Compare D1 5th house, Jupiter, and 9th house dharmic alignment.",
  },
  D6: {
    judge: "Use D6 (Shashthamsha) for disease resistance, immune resilience, competitive grit, and overcoming litigation or debts.",
    avoid: "Do not treat malefic presence as medical certainty; strong malefics in D6 grant victory over adversity.",
    next: "Inspect D1 6th house, Mars, Saturn, and Shadbala health stamina.",
  },
  D7: {
    judge: "Use D7 (Saptamsha) with D1 5th house, Jupiter, and family context for children or creative legacy.",
    avoid: "Do not convert D7 into medical or fertility certainty.",
    next: "Check Jupiter, 5th lord, dasha activation and supportive family timing.",
  },
  D8: {
    judge: "Use D8 (Ashtamsha) for crisis handling, sudden life transformations, occult depth, and longevity protection.",
    avoid: "Do not use D8 to generate sudden fear; it reveals transformation thresholds and regenerative capacity.",
    next: "Correlate with D1 8th house, Saturn, and active transformation dashas.",
  },
  D9: {
    judge: "Use D9 (Navamsha) to verify marriage delivery, soul dharma, spouse partnership and post-30 maturity.",
    avoid: "Do not overrule the birth chart from one isolated Navamsha placement.",
    next: "Compare D1 7th house, Venus, Jupiter, D9 lagna, and active dasha planets.",
  },
  D10: {
    judge: "Use D10 (Dasamsha) for executive authority, commercial impact, career apex and public prestige.",
    avoid: "Do not judge career only from D10 when D1 10th lord and active dasha suggest a transition.",
    next: "Compare D1 10th house, Sun, Saturn, D10 lagna, and current dasha period.",
  },
  D11: {
    judge: "Use D11 (Rudramsha) for secondary gain streams, monetization scalability, and overcoming obstacles to major financial desires.",
    avoid: "Do not confuse raw income (D11) with wealth preservation (D2).",
    next: "Synthesize with D1 11th lord, Jupiter, Mercury, and D10 career status.",
  },
  D12: {
    judge: "Use D12 (Dwadashamsha) for ancestral lineage, parental health, and deep generational blessings.",
    avoid: "Do not treat parental karma as personal destiny; D12 shows inherited roots, not final action.",
    next: "Compare D1 9th (father), 4th (mother), Sun, and Moon.",
  },
  D16: {
    judge: "Use D16 (Shodashamsha) for vehicles, conveyances, mental peace, and inner contentment.",
    avoid: "Do not predict luxury acquisitions without checking D1 4th lord and active dasha.",
    next: "Synthesize with D1 4th house and Venus dignities.",
  },
  D20: {
    judge: "Use D20 (Vimshamsha) for spiritual progress, mantra siddhi, and meditative consciousness.",
    avoid: "Do not judge worldly career status from D20; it is purely the soul's inner devotion.",
    next: "Check Jupiter, Ketu, and D1 9th/12th houses.",
  },
  D24: {
    judge: "Use D24 (Chaturvimshamsha) for higher learning, academic milestones, technical mastery, and research acumen.",
    avoid: "Do not confuse basic schooling (D1 4th/D4) with advanced research mastery (D24).",
    next: "Synthesize with Mercury, Jupiter, and D1 5th lord.",
  },
  D27: {
    judge: "Use D27 (Saptavimshamsha) for subconscious stamina, innate physical strength, and shock resistance.",
    avoid: "Do not ignore D27 during prolonged illness or intense psychological burnout.",
    next: "Check Moon, Mars, and D1 3rd/6th houses.",
  },
  D30: {
    judge: "Use D30 (Trimshamsha) for inherited psychological shadows, moral tests, chronic vulnerabilities, and remedial purification.",
    avoid: "Do not use D30 fatalistically; afflictions in D30 are karmic warnings that respond to disciplined somatic habits.",
    next: "Correlate D30 pressure with D1 dusthanas (6/8/12) and active remedy discipline.",
  },
  D40: {
    judge: "Use D40 (Khavedamsha) for maternal ancestral auspiciousness, inherited goodwill and subtle grace.",
    avoid: "Do not make firm claims if birth time confidence is below 85% (requires precise timing).",
    next: "Compare with D1 4th house, Moon, and D12.",
  },
  D45: {
    judge: "Use D45 (Akshavedamsha) for ethical spine, conscience alignment, integrity and moral conduct.",
    avoid: "Do not judge character without strict birth-time verification.",
    next: "Check Jupiter, Sun, and D1 9th house.",
  },
  D60: {
    judge: "Use D60 (Shashtiamsha) for deep past-life Sanchita karma, soul debts and final karmic dispensation.",
    avoid: "Do not give dogmatic D60 claims if birth time is not rectified to sub-minute accuracy.",
    next: "Treat D60 as a subtle supreme confirmation layer after D1, D9, and active Mahadasha.",
  },
};

const VARGA_DESIGNATIONS = [
  { min: 16, title: "Srivallabh (श्रीवल्लभ)", desc: "Supreme Siddhi · Full Cosmic Blessing" },
  { min: 15, title: "Golok (गोलोक)", desc: "Spiritual Transcendence & Complete Grace" },
  { min: 14, title: "Indrasan (इंद्रासन)", desc: "Supreme Sovereign Authority & Dominion" },
  { min: 13, title: "Vidrum (विद्रुम)", desc: "Deep Resilient Wisdom & Inherent Value" },
  { min: 12, title: "Suryakant (सूर्यकांत)", desc: "Solar Radiance, Apex Fame & Pure Intellect" },
  { min: 11, title: "Dhanvantri (धन्वन्तरि)", desc: "Master of Healing, Renewal & Longevity" },
  { min: 10, title: "Uccheshrava (उच्चैःश्रवा)", desc: "Royal Dignity & Incomparable Executive Power" },
  { min: 9,  title: "Poorna-Chandra (पूर्ण-चन्द्र)", desc: "Full Emotional Harmony & Public Resonance" },
  { min: 8,  title: "Chandanvan (चंदनवन)", desc: "Fragrant Reputation & Far-Reaching Goodwill" },
  { min: 7,  title: "Kalpvriksh (कल्पवृक्ष)", desc: "Wish Fulfillment & Natural Fortune" },
  { min: 6,  title: "Keral (केरल)", desc: "Social Respect & Scholarly Standing" },
  { min: 5,  title: "Kanduka (कंदुक)", desc: "Dynamic Agility & Athletic Bounce-back" },
  { min: 4,  title: "Nagpushpa (नागपुष्प)", desc: "Foundational Security & Material Stability" },
  { min: 3,  title: "Kusum (कुसुम)", desc: "Auspicious Flowering & Pleasant Demeanor" },
  { min: 2,  title: "Bhedak (भेदक)", desc: "Distinctive Individuality & Awakening" },
];

function MiniChart({ chart }: { chart: DivChart }) {
  const S = 220;
  const CELLS = [
    { hn: 1, cx: S / 2,     cy: S / 4 },
    { hn: 2, cx: S / 4,     cy: S / 8 },
    { hn: 3, cx: S / 8,     cy: S / 4 },
    { hn: 4, cx: S / 4,     cy: S / 2 },
    { hn: 5, cx: S / 8,     cy: 3 * S / 4 },
    { hn: 6, cx: S / 4,     cy: 7 * S / 8 },
    { hn: 7, cx: S / 2,     cy: 3 * S / 4 },
    { hn: 8, cx: 3 * S / 4, cy: 7 * S / 8 },
    { hn: 9, cx: 7 * S / 8, cy: 3 * S / 4 },
    { hn: 10,cx: 3 * S / 4, cy: S / 2 },
    { hn: 11,cx: 7 * S / 8, cy: S / 4 },
    { hn: 12,cx: 3 * S / 4, cy: S / 8 },
  ];
  const byHouse: Record<number, { icon: string; color: string; retro: boolean }[]> = {};
  for (let i = 1; i <= 12; i++) byHouse[i] = [];
  chart.planets.forEach((p) =>
    byHouse[p.house]?.push({ icon: p.icon, color: p.color, retro: p.retrograde })
  );

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" style={{ maxWidth: 220, display: "block", margin: "0 auto" }}>
      <rect width={S} height={S} fill="#FAF7F2" rx="10" />
      <rect x={0} y={0} width={S} height={S} fill="none" stroke="rgba(184,134,11,0.3)" strokeWidth="1" rx="10" />
      <line x1={S / 2} y1={0}     x2={S}     y2={S / 2} stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={S}     y1={S / 2} x2={S / 2} y2={S}     stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={S / 2} y1={S}     x2={0}     y2={S / 2} stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={0}     y1={S / 2} x2={S / 2} y2={0}     stroke="rgba(184,134,11,0.2)" strokeWidth="0.8" />
      <line x1={0}     y1={0}     x2={S}     y2={S}     stroke="rgba(184,134,11,0.15)" strokeWidth="0.5" />
      <line x1={S}     y1={0}     x2={0}     y2={S}     stroke="rgba(184,134,11,0.15)" strokeWidth="0.5" />
      {CELLS.map(({ hn, cx, cy }) => {
        const rIdx = md(chart.lagnaNum + hn - 1, 12);
        const isL = hn === 1;
        const here = byHouse[hn] || [];
        return (
          <g key={hn}>
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="7" fill={isL ? "#B8860B" : "#6B635B"}>
              {rIdx + 1}
            </text>
            <text x={cx} y={cy + 2} textAnchor="middle" fontSize="9" fill={isL ? "#B8860B" : "#444060"}>
              {SIGN_ICONS[rIdx]}
            </text>
            {here.map((p, pi) => (
              <text
                key={pi}
                x={cx + (here.length > 1 ? (pi - (here.length - 1) / 2) * 11 : 0)}
                y={cy + (isL ? 17 : 14)}
                textAnchor="middle"
                fontSize="10"
                fill={p.color}
              >
                {p.icon}
                {p.retro ? "ℛ" : ""}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function DivisionalPage() {
  const [activeChart, setActiveChart] = useState("D10");
  const [activeTab, setActiveTab] = useState<"shastric" | "diagnostics" | "remedies" | "matrix">("shastric");
  const [selectedHarmonic, setSelectedHarmonic] = useState("all");

  const { birth, chart, hasUserChart } = useUserChart();
  const { t } = useLanguage();

  const divs = useMemo(() => {
    if (!chart?.planets) return [];
    return calculateDivisional(chart.planets as never, chart.lagnaNum, chart.lagnaLon);
  }, [chart?.planets, chart?.lagnaNum, chart?.lagnaLon]);

  const findings = useMemo(() => (divs.length ? getSpecialFindings(divs) : []), [divs]);

  const current = useMemo(
    () => divs.find((d) => d.key === activeChart) || divs[0],
    [divs, activeChart]
  );
  const color = current ? CHART_COLORS[current.key] ?? "#a855f7" : "#a855f7";
  const meta = current ? CHART_META[current.key] : null;

  const neuroProfile = useMemo(() => {
    if (!chart || !current || !divs.length) return null;
    return evaluateVargaNeuroKarmicProfile(chart, current, divs);
  }, [chart, current, divs]);

  const latentPoints = useMemo(() => {
    if (!chart) return null;
    const d3 = divs.find((d) => d.key === "D3");
    const d9 = divs.find((d) => d.key === "D9");
    return detectKarmicLatentPoints(chart, d3, d9);
  }, [chart, divs]);

  const chartName = birth.name || chart?.name;
  if ((!hasUserChart && !chartName) || !current) {
    return (
      <EngineEmptyState
        engineName="Divisional Charts"
        engineIcon="🧩"
        whatItAnalyzes={["D9 Navamsha", "D10 Dashamsha", "16 Shodasha Vargas", "Neuro-Karmic Epigenetic Protocols"]}
      />
    );
  }

  const activeMD = chart?.dashas?.find((d) => d.active);

  // ── 5-Tier Determinant Shastric Synthesis Matrix Computation ──
  const karyaConfig = VARGA_KARYA_MAP[current.key] || { house: 1, karaka: "Sun", label: "Core Energy" };
  const d1LagnaLord = SIGN_LORDS[chart.lagnaNum];
  const d1Karyesh = SIGN_LORDS[(chart.lagnaNum + karyaConfig.house - 1) % 12];
  const d1Karaka = karyaConfig.karaka;

  const getPlanetCuspData = (plName: string) => {
    const raw = (chart.planets as Record<string, any>)?.[plName];
    if (!raw) return { house: "—", sign: "—", nakshatra: "—", subLord: "—" };
    return {
      house: `H${raw.house}`,
      sign: raw.sign,
      nakshatra: raw.nakshatra || "—",
      subLord: raw.subLord || raw.nakshatraLord || "—",
    };
  };

  const lagnaCusp = chart.houseCusps?.[0] || { sign: chart.lagnaRashi, nakshatra: "—", subLord: "—", nakshatraLord: "—" };
  const karyaCusp = chart.houseCusps?.[karyaConfig.house - 1] || { sign: "—", nakshatra: "—", subLord: "—", nakshatraLord: "—" };

  const getInVargaPlacement = (plName: string) => {
    const p = current.planets.find((item) => item.planet === plName);
    if (!p) return { house: "—", sign: "—", dignity: "—" };
    return {
      house: `H${p.house}`,
      sign: p.sign,
      dignity: p.dignity !== "—" ? p.dignity : "Neutral",
    };
  };

  const lagneshD1 = getPlanetCuspData(d1LagnaLord);
  const lagneshVarga = getInVargaPlacement(d1LagnaLord);

  const karyeshD1 = getPlanetCuspData(d1Karyesh);
  const karyeshVarga = getInVargaPlacement(d1Karyesh);

  const karakaD1 = getPlanetCuspData(d1Karaka);
  const karakaVarga = getInVargaPlacement(d1Karaka);

  // Classical Varga Title Calculation for Karyesh
  const karyeshBeneficCount = divs.filter((d) => {
    const p = d.planets.find((item) => item.planet === d1Karyesh);
    return p && (p.dignity === "Exalted" || p.dignity === "Own");
  }).length;

  const vargaTitle = VARGA_DESIGNATIONS.find((des) => karyeshBeneficCount >= des.min) || {
    title: "Prarambhik (प्रारंभिक)",
    desc: "Baseline Karmic Capacity",
  };

  // Filtered pills by harmonic level
  const activeHarmonicConfig = HARMONIC_PLANES.find((h) => h.id === selectedHarmonic) || HARMONIC_PLANES[0];
  const filteredDivs = divs.filter((d) => activeHarmonicConfig.keys.includes(d.key));

  return (
    <div className="page" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        .dv-tabs {
          display: grid;
          grid-template-columns: repeat(10, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 24px;
        }
        @media (max-width: 1280px) {
          .dv-tabs {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .dv-tabs {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .dv-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 4px;
          border-radius: 14px;
          border: 1px solid rgba(184,134,11,0.22);
          background: #FAF7F2;
          color: #4A4238;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          min-height: 72px;
          width: 100%;
          box-sizing: border-box;
        }
        .dv-tab:hover {
          border-color: #B8860B;
          background: #FAF5EB;
        }
        .dv-tab.active {
          border-color: #B8860B;
          background: rgba(184,134,11,0.16);
          color: #B8860B;
          font-weight: 700;
          box-shadow: 0 3px 10px rgba(184,134,11,0.16);
        }
        .dv-tab-icon {
          font-size: 18px;
          line-height: 1;
          margin-bottom: 3px;
        }
        .dv-tab-key {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.1;
        }
        .dv-tab-domain {
          font-size: 11px;
          opacity: 0.85;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          text-align: center;
          font-weight: 500;
        }

        /* ── IN-PAGE TABS BAR ── */
        .workspace-tabs-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 2px solid rgba(184,134,11,0.18);
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .ws-tab-btn {
          padding: 12px 20px;
          border-radius: 12px 12px 0 0;
          border: none;
          background: transparent;
          font-size: 14.5px;
          font-weight: 600;
          color: #6B635B;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .ws-tab-btn:hover {
          color: #1A1A1A;
          background: rgba(184,134,11,0.06);
        }
        .ws-tab-btn.active {
          color: #B8860B;
          font-weight: 700;
          background: #FFFFFF;
          border-bottom: 3px solid #B8860B;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.02);
        }

        /* ── SHASHTRIC TABLE ── */
        .shastric-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .shastric-table th {
          background: #FAF7F2;
          color: #8C6D1F;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-size: 12px;
          padding: 12px 14px;
          border-bottom: 2px solid rgba(184,134,11,0.2);
          text-align: left;
        }
        .shastric-table td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(184,134,11,0.12);
          color: #2D2825;
          font-weight: 500;
        }
        .shastric-table tr:hover td {
          background: #FAF5EB;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="page-tag">{t("divisional.page_tag") || "Shodashavarga Intelligence"}</div>
      <h1 className="page-title serif" style={{ fontSize: "28px", color: "#1A1A1A", marginBottom: "8px" }}>
        16 Varga Kundali Analysis (षोडशवर्ग चक्र)
      </h1>
      <p className="page-sub" style={{ fontSize: "15px", color: "#5A524C", marginBottom: "20px" }}>
        {chartName} · Natal D-1 Seed Promise Verified Across 16 Micro-Karma Lenses
      </p>

      {/* ── SCOPE & QUICK STATS BAR ── */}
      <div className="header-card" style={{ marginBottom: 24, padding: "20px 24px" }}>
        <div className="header-orb" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#a855f7", marginBottom: 6, fontWeight: 700 }}>
            ✦ Shodashavarga Scope
          </div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: "#1A1A1A" }}>
            Active Varga: {current.key} ({current.name})
          </div>
          <div style={{ fontSize: 13.5, color: "#5A524C", marginTop: 4 }}>
            Natal Lagna: <strong>{chart.lagnaRashi}</strong> · {current.key} Lagna: <strong>{current.lagna}</strong>
            {activeMD && <span> · Active Dasha: <strong>{activeMD.planet} Mahadasha</strong></span>}
          </div>
        </div>
        <div className="dv-stat-row">
          <div className="dv-stat" style={{ padding: "12px 18px" }}>
            <div className="dv-stat-n" style={{ fontSize: "22px" }}>{current.lagna}</div>
            <div className="dv-stat-l" style={{ fontSize: "11px" }}>{current.key} LAGNA</div>
          </div>
          <div className="dv-stat" style={{ padding: "12px 18px" }}>
            <div className="dv-stat-n" style={{ fontSize: "22px" }}>{divs.length}</div>
            <div className="dv-stat-l" style={{ fontSize: "11px" }}>TOTAL VARGAS</div>
          </div>
          <div className="dv-stat" style={{ padding: "12px 18px" }}>
            <div className="dv-stat-n" style={{ color: "#22c55e", fontSize: "22px" }}>
              {findings.filter((f) => f.type === "positive").length}
            </div>
            <div className="dv-stat-l" style={{ fontSize: "11px" }}>STRENGTHS</div>
          </div>
          <div className="dv-stat" style={{ padding: "12px 18px" }}>
            <div className="dv-stat-n" style={{ color: "#ef4444", fontSize: "22px" }}>
              {findings.filter((f) => f.type === "caution").length}
            </div>
            <div className="dv-stat-l" style={{ fontSize: "11px" }}>CAUTIONS</div>
          </div>
        </div>
      </div>

      <PremiumFeature feature="Divisional Charts">
        {/* ── 5 HARMONIC PLANES FILTER ── */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D1F] whitespace-nowrap">
            Harmonic Plane:
          </span>
          {HARMONIC_PLANES.map((hp) => (
            <button
              key={hp.id}
              type="button"
              onClick={() => setSelectedHarmonic(hp.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedHarmonic === hp.id
                  ? "bg-[#B8860B] text-white shadow-sm"
                  : "bg-[#FAF7F2] text-[#6B635B] hover:bg-[#FAF5EB] border border-[rgba(184,134,11,0.2)]"
              }`}
            >
              {hp.label}
            </button>
          ))}
        </div>

        {/* ── 1. 20 VARGA INTERACTIVE PILL SELECTOR ── */}
        <div className="dv-tabs">
          {filteredDivs.map((d) => {
            const m = CHART_META[d.key] || { icon: "✦", domain: d.purpose, category: "" };
            const isActive = activeChart === d.key;
            return (
              <button
                key={d.key}
                type="button"
                className={`dv-tab${isActive ? " active" : ""}`}
                onClick={() => setActiveChart(d.key)}
                title={`${d.key} (${d.name}): ${m.domain}`}
              >
                <span className="dv-tab-icon">{m.icon}</span>
                <span className="dv-tab-key">{d.key}</span>
                <span className="dv-tab-domain">{m.domain}</span>
              </button>
            );
          })}
        </div>

        {/* ── 2. ACTIVE VARGA CORE WORKSPACE: CHART + PLANET POSITIONS ── */}
        <div className="dv-grid">
          {/* Left: North Indian Mini Chart */}
          <div className="dv-card" style={{ borderColor: color + "40" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="dv-card-title" style={{ color, marginBottom: 0, fontSize: "14px" }}>
                {meta?.icon} {current.key} — {current.name} Chakra
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                {current.lagna} Lagna
              </span>
            </div>

            <MiniChart chart={current} />

            <div style={{ marginTop: 14, padding: "12px 16px", background: color + "0d", border: `1px solid ${color}22`, borderRadius: 12 }}>
              <div className="flex items-center justify-between mb-1">
                <div style={{ fontSize: 11, color, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700 }}>
                  Domain Focus &amp; Adhidevata
                </div>
                {neuroProfile?.deityArchetype && (
                  <span className="text-xs px-2.5 py-0.5 rounded bg-white text-[#8C6D1F] border border-[rgba(184,134,11,0.2)] font-bold">
                    ⚡ {neuroProfile.deityArchetype.name}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13.5, color: "#3D3834", lineHeight: 1.65 }}>
                {current.purpose}
              </div>
            </div>
          </div>

          {/* Right: Planet Positions Table in Active Varga */}
          <div className="dv-card">
            <div className="flex items-center justify-between mb-3">
              <div className="dv-card-title" style={{ marginBottom: 0, fontSize: "14px" }}>
                Planetary Coordinates in {current.key}
              </div>
              <span className="text-xs text-[#5A524C] font-semibold">
                {current.planets.filter((p) => p.dignity === "Exalted").length} Exalted · {current.planets.filter((p) => p.dignity === "Own").length} Own
              </span>
            </div>

            <div className="space-y-1.5">
              {current.planets.map((p, i) => (
                <div key={i} className="dv-planet-row" style={{ padding: "8px 0" }}>
                  <span style={{ fontSize: 17, color: p.color, width: 24 }}>{p.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, color: "#1A1A1A", fontWeight: 600 }}>{p.planet}</span>
                  <span style={{ fontSize: 13.5, color: "#4A4238" }}>{p.sign}</span>
                  <span style={{ fontSize: 13.5, color: "#5A524C", width: 34, textAlign: "right", fontWeight: 700 }}>
                    H{p.house}
                  </span>
                  {p.dignity !== "—" ? (
                    <span
                      className="dv-badge"
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        color: p.dignity === "Exalted" ? "#b45309" : p.dignity === "Own" ? "#15803d" : "#b91c1c",
                        background: p.dignity === "Exalted" ? "rgba(245,158,11,0.12)" : p.dignity === "Own" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                        border: `1px solid ${p.dignity === "Exalted" ? "rgba(245,158,11,0.3)" : p.dignity === "Own" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                      }}
                    >
                      {p.dignity}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#9ca3af", width: 45, textAlign: "center" }}>—</span>
                  )}
                  {p.retrograde && <span style={{ fontSize: 11, color: "#f97316", fontWeight: 700 }}>[R]</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. WORKSPACE 4-TAB NAVIGATION BAR ── */}
        <div className="workspace-tabs-bar mt-6">
          <button
            type="button"
            className={`ws-tab-btn ${activeTab === "shastric" ? "active" : ""}`}
            onClick={() => setActiveTab("shastric")}
          >
            <span>🏛️</span>
            <span>1. Shastric &amp; Nadi Matrix</span>
          </button>
          <button
            type="button"
            className={`ws-tab-btn ${activeTab === "diagnostics" ? "active" : ""}`}
            onClick={() => setActiveTab("diagnostics")}
          >
            <span>🔬</span>
            <span>2. Micro-Deity Diagnostics</span>
          </button>
          <button
            type="button"
            className={`ws-tab-btn ${activeTab === "remedies" ? "active" : ""}`}
            onClick={() => setActiveTab("remedies")}
          >
            <span>🧬</span>
            <span>3. Scientific DNA Remedies</span>
          </button>
          <button
            type="button"
            className={`ws-tab-btn ${activeTab === "matrix" ? "active" : ""}`}
            onClick={() => setActiveTab("matrix")}
          >
            <span>📊</span>
            <span>4. Master 20-Varga Grid &amp; Rules</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB 1: SHASTRIC & NADI SYNTHESIS MATRIX                */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "shastric" && (
          <div className="space-y-6">
            {/* The 5-Tier Determinant Table */}
            <div className="dv-card" style={{ padding: "24px" }}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1">
                    The 5-Tier Shastric &amp; Nadi Determinant Matrix
                  </h3>
                  <div className="text-xs sm:text-sm text-[#5A524C]">
                    Exact synthesis of Lagna, Lagnesh, Karya Bhava ({karyaConfig.label}), Karyesh, and Karaka with their Nadi Sub-Lords.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-right">
                  <div className="text-xs uppercase font-bold text-amber-900 tracking-wider">Classical Varga Title</div>
                  <div className="text-sm sm:text-base font-bold text-[#B8860B]">{vargaTitle.title}</div>
                  <div className="text-[11px] text-amber-800">{vargaTitle.desc}</div>
                </div>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="shastric-table">
                  <thead>
                    <tr>
                      <th>Factor</th>
                      <th>Determinant</th>
                      <th>D-1 House &amp; Sign</th>
                      <th>Nakshatra Lord</th>
                      <th>Nadi Sub-Lord</th>
                      <th>Position in {current.key}</th>
                      <th>Status / Dignity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold text-[#B8860B]">Lagna</td>
                      <td>Ascendant (Self)</td>
                      <td>House 1 ({chart.lagnaRashi})</td>
                      <td>{lagnaCusp.nakshatraLord}</td>
                      <td className="font-bold text-emerald-700">{lagnaCusp.subLord}</td>
                      <td>House 1 ({current.lagna})</td>
                      <td><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-bold text-xs">Varga Lagna</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#B8860B]">Lagnesh</td>
                      <td>{d1LagnaLord} (Execution Driver)</td>
                      <td>{lagneshD1.house} ({lagneshD1.sign})</td>
                      <td>{lagneshD1.nakshatra}</td>
                      <td className="font-bold text-emerald-700">{lagneshD1.subLord}</td>
                      <td>{lagneshVarga.house} ({lagneshVarga.sign})</td>
                      <td><span className="font-bold text-xs">{lagneshVarga.dignity}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#B8860B]">Karya Bhava</td>
                      <td>House {karyaConfig.house} ({karyaConfig.label})</td>
                      <td>H{karyaConfig.house} ({karyaCusp.sign})</td>
                      <td>{karyaCusp.nakshatraLord}</td>
                      <td className="font-bold text-emerald-700">{karyaCusp.subLord}</td>
                      <td>H{karyaConfig.house} of {current.key}</td>
                      <td><span className="text-xs text-[#5A524C]">Matter Domain</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#B8860B]">Karyesh</td>
                      <td>{d1Karyesh} (Matter Lord)</td>
                      <td>{karyeshD1.house} ({karyeshD1.sign})</td>
                      <td>{karyeshD1.nakshatra}</td>
                      <td className="font-bold text-emerald-700">{karyeshD1.subLord}</td>
                      <td>{karyeshVarga.house} ({karyeshVarga.sign})</td>
                      <td><span className="font-bold text-xs">{karyeshVarga.dignity}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#B8860B]">Karaka</td>
                      <td>{d1Karaka} (Natural Signifier)</td>
                      <td>{karakaD1.house} ({karakaD1.sign})</td>
                      <td>{karakaD1.nakshatra}</td>
                      <td className="font-bold text-emerald-700">{karakaD1.subLord}</td>
                      <td>{karakaVarga.house} ({karakaVarga.sign})</td>
                      <td><span className="font-bold text-xs">{karakaVarga.dignity}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deep Shastric Narrative Card */}
            {neuroProfile && (
              <div className="dv-card" style={{ padding: "24px" }}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.3)]">
                    ✦ Natal D1 Integrated Shastric Narrative
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] text-[#4A4238] border border-[rgba(184,134,11,0.2)] font-semibold">
                    {neuroProfile.vargaKey} Lagna: {neuroProfile.vargaLagna}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2 leading-tight">
                  {neuroProfile.deepExplanation.title}
                </h3>
                
                <div className="text-xs text-[#8C6D1F] font-semibold mb-4 tracking-wide">
                  🏛️ {neuroProfile.natalLagnaRelation}
                </div>

                <div className="space-y-3">
                  {neuroProfile.deepExplanation.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-sm sm:text-[15px] text-[#3D3834] leading-[1.8] m-0">
                      {p}
                    </p>
                  ))}
                </div>

                {neuroProfile.deepExplanation.keyHighlights.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-5 pt-3.5 border-t border-[rgba(184,134,11,0.15)]">
                    <span className="text-xs uppercase tracking-wider text-[#B8860B] font-bold">Key Signatures:</span>
                    {neuroProfile.deepExplanation.keyHighlights.map((kh, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-[#FAF5EB] text-[#1A1A1A] border border-[rgba(184,134,11,0.25)] font-semibold"
                      >
                        {kh}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB 2: MICRO-DEITY DIAGNOSTICS                         */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "diagnostics" && neuroProfile && (
          <div className="space-y-6">
            {/* Adhidevata Archetype Card */}
            <div className="dv-card" style={{ padding: "24px" }}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                  ⚡ Ruling Adhidevata Archetype
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] text-[#B8860B] font-bold border border-[rgba(184,134,11,0.25)]">
                  {neuroProfile.deityArchetype.name}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-1">
                {neuroProfile.deityArchetype.traditionalRole}
              </h3>
              <div className="text-sm text-[#4A4238] font-medium mb-4">
                Executive Leadership Mode: <strong>{neuroProfile.deityArchetype.leadershipMode}</strong>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
                  <div className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1">
                    Cognitive Distortion &amp; Shadow Trap
                  </div>
                  <div className="text-sm text-rose-800 leading-relaxed font-medium">
                    {neuroProfile.deityArchetype.distortionLabel}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                    Deity Frequency Unlocking Action
                  </div>
                  <div className="text-sm text-emerald-800 leading-relaxed font-medium">
                    {neuroProfile.deityArchetype.neuroEpigeneticRemedy}
                  </div>
                </div>
              </div>
            </div>

            {/* Specialized Varga Intelligence: D10 Service vs Business, D3 Decanate, D9 Pushkar/64th */}
            {current.key === "D10" && (
              <div className="dv-card" style={{ padding: "24px" }}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">
                  D-10 Artha-Trikona: Service (6th) vs Independent Enterprise (7th)
                </h3>
                <p className="text-sm text-[#4A4238] leading-relaxed mb-4">
                  In classical Dasamsha analysis, <strong>House 6</strong> governs job, employment, competition and corporate service, while <strong>House 7</strong> (10th from 10th - Bhavat Bhavam) governs direct marketplace transactions, partnerships and sovereign enterprise.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)]">
                    <div className="text-xs uppercase font-bold text-[#B8860B] mb-1">6th House (Service)</div>
                    <div className="text-sm font-bold text-[#1A1A1A]">
                      {current.planets.filter((p) => p.house === 6).map((p) => p.planet).join(", ") || "No Direct Planets"}
                    </div>
                    <div className="text-xs text-[#5A524C] mt-1">Daily execution &amp; competitive victory</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                    <div className="text-xs uppercase font-bold text-amber-900 mb-1">7th House (Marketplace Enterprise)</div>
                    <div className="text-sm font-bold text-[#1A1A1A]">
                      {current.planets.filter((p) => p.house === 7).map((p) => `${p.planet} (${p.dignity})`).join(", ") || "No Direct Planets"}
                    </div>
                    <div className="text-xs text-[#5A524C] mt-1">10th from 10th · High-Volume Scale</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)]">
                    <div className="text-xs uppercase font-bold text-[#B8860B] mb-1">11th House (Revenue Engines)</div>
                    <div className="text-sm font-bold text-[#1A1A1A]">
                      {current.planets.filter((p) => p.house === 11).map((p) => `${p.planet} (${p.dignity})`).join(", ") || "No Direct Planets"}
                    </div>
                    <div className="text-xs text-[#5A524C] mt-1">Multi-channel monetization speed</div>
                  </div>
                </div>
              </div>
            )}

            {current.key === "D3" && latentPoints?.kharesh22ndDrekkana && (
              <div className="dv-card" style={{ padding: "24px" }}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">
                  D-3 Drekkana Diagnostics: 22nd Drekkana (Kharesh) &amp; Somatic Anatomy
                </h3>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-3">
                  <div className="text-xs uppercase font-bold text-amber-900 mb-1">
                    🛡️ 22nd Drekkana (Kharesh) Lord: {latentPoints.kharesh22ndDrekkana.planet} in {latentPoints.kharesh22ndDrekkana.sign} (House 8)
                  </div>
                  <div className="text-sm text-[#4A4238] font-medium leading-relaxed">
                    Hereditary Cellular Stress Zone: <strong>{latentPoints.kharesh22ndDrekkana.organSystem}</strong>
                  </div>
                  <div className="text-xs text-amber-800 bg-white/80 p-2.5 rounded-lg border border-amber-200 mt-2 leading-relaxed">
                    <strong>Preventive Protocol:</strong> {latentPoints.kharesh22ndDrekkana.somaticProtocol}
                  </div>
                </div>
              </div>
            )}

            {current.key === "D9" && (
              <div className="dv-card" style={{ padding: "24px" }}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">
                  D-9 Navamsha Diagnostics: Soul Alignment &amp; Protective Shields
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {latentPoints?.pushkarNavamshas && latentPoints.pushkarNavamshas.length > 0 && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="text-xs uppercase font-bold text-emerald-900 mb-1">✨ Pushkar Navamsha Activation</div>
                      <div className="text-sm text-emerald-800 leading-relaxed">
                        {latentPoints.pushkarNavamshas.map((pk) => `${pk.planet} in ${pk.navamshaSign}`).join(", ")}
                      </div>
                      <div className="text-xs text-emerald-700 mt-1">Converts severe challenges into breakthrough neuroplastic resilience.</div>
                    </div>
                  )}

                  {latentPoints?.sixtyFourthNavamsha && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="text-xs uppercase font-bold text-rose-900 mb-1">⚡ 64th Navamsha Transit Shock Shield</div>
                      <div className="text-sm text-rose-800 font-medium">
                        Trigger Zone: {latentPoints.sixtyFourthNavamsha.triggerZone}
                      </div>
                      <div className="text-xs text-rose-700 mt-1">
                        {latentPoints.sixtyFourthNavamsha.cognitiveShield}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB 3: SCIENTIFIC DNA & NEURO-REMEDIES                 */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "remedies" && neuroProfile && (
          <div className="space-y-6">
            <div className="dv-card" style={{ padding: "24px" }}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full bg-[rgba(34,197,94,0.12)] text-[#16A34A] border border-[rgba(34,197,94,0.3)]">
                  🧬 Scientific &amp; DNA-Based Neuro-Remedy Protocol
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8C6D1F] border border-[rgba(184,134,11,0.2)] font-semibold">
                  Daily Behavioral Re-Wiring
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-4 leading-tight">
                Neuro-Somatic &amp; Generational Loop Reset for {neuroProfile.vargaKey} ({neuroProfile.vargaName})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Step 1: Ancestral Interruption */}
                <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)] border-l-4 border-l-[#B8860B] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-extrabold text-[#B8860B] mb-1">
                      Step 1 · Ancestral Interruption
                    </div>
                    <div className="text-base font-bold text-[#1A1A1A] mb-2">
                      Generational Loop Break
                    </div>
                    <div className="text-sm text-[#3D3834] leading-relaxed">
                      {neuroProfile.neuroRemedy.ancestralLoopInterruption}
                    </div>
                  </div>
                </div>

                {/* Step 2: Cognitive Re-Wiring */}
                <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)] border-l-4 border-l-[#2563EB] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-extrabold text-[#2563EB] mb-1">
                      Step 2 · Cognitive Re-Wiring
                    </div>
                    <div className="text-base font-bold text-[#1A1A1A] mb-2">
                      {neuroProfile.neuroRemedy.cognitiveRewiring.techniqueName}
                    </div>
                    <div className="text-sm text-[#3D3834] leading-relaxed">
                      {neuroProfile.neuroRemedy.cognitiveRewiring.mindsetProtocol}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-[#5A524C] bg-white/70 px-2 py-1 rounded border border-[rgba(184,134,11,0.15)]">
                    Target: {neuroProfile.neuroRemedy.cognitiveRewiring.distortionLabel}
                  </div>
                </div>

                {/* Step 3: Somatic Behavioral Habit */}
                <div className="bg-[#FAF7F2] border border-[rgba(184,134,11,0.2)] border-l-4 border-l-[#16A34A] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-extrabold text-[#16A34A] mb-1">
                      Step 3 · Somatic Protocol
                    </div>
                    <div className="text-base font-bold text-[#1A1A1A] mb-2">
                      {neuroProfile.neuroRemedy.somaticBehavioralHabit.habitName}
                    </div>
                    <div className="text-sm text-[#1A1A1A] font-medium leading-relaxed mb-2">
                      {neuroProfile.neuroRemedy.somaticBehavioralHabit.dailyProtocol}
                    </div>
                  </div>
                  <div className="text-xs text-[#5A524C] leading-tight mt-2 pt-2 border-t border-[rgba(184,134,11,0.15)]">
                    Biomarker: {neuroProfile.neuroRemedy.somaticBehavioralHabit.neuroMechanism}
                  </div>
                </div>
              </div>

              {/* Step 4: Adhidevata Archetype Priming */}
              {neuroProfile.neuroRemedy.archetypeAlignment && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.25)] border-l-4 border-l-[#a855f7] mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                    <div className="text-xs uppercase tracking-wider font-extrabold text-[#a855f7] flex items-center gap-1.5">
                      <span>⚡ Step 4 · Adhidevata Archetypal Priming</span>
                      <span>({neuroProfile.neuroRemedy.archetypeAlignment.name})</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-white text-[#a855f7] font-bold border border-[rgba(168,85,247,0.25)]">
                      Daily Executive Mode
                    </span>
                  </div>
                  <div className="text-sm text-[#1A1A1A] font-medium leading-relaxed mb-1">
                    <strong>Execution Stance:</strong> {neuroProfile.neuroRemedy.archetypeAlignment.executiveProtocol}
                  </div>
                  <div className="text-sm text-[#4A4238] leading-relaxed">
                    <strong>Behavioral Alignment:</strong> {neuroProfile.neuroRemedy.archetypeAlignment.cognitiveRefocus}
                  </div>
                </div>
              )}

              {/* Ancestral DNA Kula Karma Imprint */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[rgba(184,134,11,0.22)]">
                <div className="text-xs uppercase tracking-wider text-[#B8860B] font-bold mb-1.5 flex items-center gap-1.5">
                  <span>🧬</span>
                  <span>Ancestral DNA &amp; Kula Karma Pattern:</span>
                </div>
                <p className="text-sm text-[#4A4238] leading-relaxed m-0 font-medium">
                  {neuroProfile.karmicWeakness.ancestralLineagePattern}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB 4: MASTER 20-VARGA GRID & PARASHARI RULES         */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "matrix" && (
          <div className="space-y-6">
            {/* All 20 Vargas Grid */}
            <div className="dv-card" style={{ padding: "24px" }}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1">
                    📊 20-Varga Master Synthesis Matrix
                  </h3>
                  <div className="text-xs sm:text-sm text-[#5A524C]">
                    Click any varga card below to instantly inspect its chart coordinates, Adhidevata, and DNA remedies.
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded bg-[#FAF7F2] text-[#B8860B] border border-[rgba(184,134,11,0.25)] font-bold">
                  20 Vargas Synchronized
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
                {divs.map((d) => {
                  const m = CHART_META[d.key] || { icon: "✦", domain: d.purpose, category: "" };
                  const strong = d.planets.filter((p) => p.dignity === "Exalted" || p.dignity === "Own");
                  const deb = d.planets.filter((p) => p.dignity === "Debilitated");
                  const isActive = activeChart === d.key;

                  return (
                    <div
                      key={d.key}
                      onClick={() => {
                        setActiveChart(d.key);
                        window.scrollTo({ top: 180, behavior: "smooth" });
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? "bg-[rgba(184,134,11,0.12)] border-[#B8860B] shadow-sm ring-1 ring-[#B8860B]"
                          : "bg-[#FAF7F2] border-[rgba(184,134,11,0.18)] hover:border-[#B8860B]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs flex items-center gap-1.5 text-[#1A1A1A]">
                          <span>{m.icon}</span>
                          <span style={{ color: CHART_COLORS[d.key] ?? "#B8860B" }}>{d.key}</span>
                          <span className="text-[11px] text-[#5A524C]">({d.name})</span>
                        </span>
                        <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-white text-[#B8860B] font-bold border border-[rgba(184,134,11,0.2)]">
                          {d.lagna}
                        </span>
                      </div>

                      <div className="text-xs text-[#3D3834] font-medium leading-tight mb-2">
                        {m.domain}
                      </div>

                      <div className="text-[11px] text-[#5A524C] flex items-center gap-2 flex-wrap">
                        {strong.length > 0 && (
                          <span className="text-emerald-700 font-bold">
                            ✓ {strong.map((p) => p.planet).join(", ")}
                          </span>
                        )}
                        {deb.length > 0 && (
                          <span className="text-rose-700 font-bold">
                            ⚠ {deb.map((p) => p.planet).join(", ")}
                          </span>
                        )}
                        {strong.length === 0 && deb.length === 0 && (
                          <span className="opacity-75">Balanced Placements</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parashari Decision Guide */}
            {(() => {
              const guide = VARGA_DECISION_GUIDE[current.key] || {
                judge: "Use this varga as a focused confirmation layer after the birth chart promise is established.",
                avoid: "Do not make a final prediction from this chart alone without natal verification.",
                next: "Compare D1 promise, relevant karaka, house lord, varga lagna, and current dasha.",
              };
              return (
                <section className="dv-decision-grid">
                  <div className="dv-decision-card border-l-4 border-l-[#B8860B]">
                    <b style={{ fontSize: "12px" }}>How to Judge {current.key}</b>
                    <p style={{ fontSize: "13.5px" }}>{guide.judge}</p>
                  </div>
                  <div className="dv-decision-card border-l-4 border-l-[#DC2626]">
                    <b style={{ fontSize: "12px" }}>What to Avoid</b>
                    <p style={{ fontSize: "13.5px" }}>{guide.avoid}</p>
                  </div>
                  <div className="dv-decision-card border-l-4 border-l-[#2563EB]">
                    <b style={{ fontSize: "12px" }}>Next Validation with D-1</b>
                    <p style={{ fontSize: "13.5px" }}>{guide.next}</p>
                  </div>
                </section>
              );
            })()}

            {/* Cross-Chart Special Findings */}
            {findings.length > 0 && (
              <div className="dv-card">
                <div className="dv-card-title" style={{ fontSize: "14px" }}>⚡ Cross-Chart Special Findings</div>
                <div className="space-y-3 mt-3">
                  {findings.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border text-xs sm:text-sm"
                      style={{
                        background: f.type === "positive" ? "rgba(34,197,94,0.06)" : f.type === "caution" ? "rgba(239,68,68,0.06)" : "rgba(148,163,184,0.05)",
                        borderColor: f.type === "positive" ? "rgba(34,197,94,0.25)" : f.type === "caution" ? "rgba(239,68,68,0.25)" : "rgba(148,163,184,0.15)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span style={{ fontSize: 16 }}>{f.type === "positive" ? "✅" : f.type === "caution" ? "⚠️" : "◆"}</span>
                        <span className="font-bold text-[#1A1A1A]">{f.title}</span>
                        <span className="ml-auto flex gap-1">
                          {f.charts.map((c) => (
                            <span
                              key={c}
                              style={{
                                fontSize: 10,
                                padding: "2px 7px",
                                borderRadius: 4,
                                background: (CHART_COLORS[c] ?? "#B8860B") + "22",
                                color: CHART_COLORS[c] ?? "#B8860B",
                                border: `1px solid ${(CHART_COLORS[c] ?? "#B8860B")}44`,
                                fontWeight: 700,
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="text-[#3D3834] leading-relaxed">{f.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PremiumFeature>
    </div>
  );
}
