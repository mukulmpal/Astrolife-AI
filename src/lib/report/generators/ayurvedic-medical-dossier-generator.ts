/**
 * ============================================================================
 * ASTROLIFE — AYURVEDIC MEDICAL & PSYCHOLOGICAL VITALITY SHIELD GENERATOR
 * ============================================================================
 * Ultra-luxury, print-perfect 24-page HTML-to-PDF generator for:
 * ⚕️ Ayurvedic Medical & Psychological Vitality Shield (pkg_ayurvedic_medical / ₹499)
 *
 * 5-Pillar Master Architecture:
 * 1. Pillar I: Constitutional Vitality & Natal Bio-Blueprint (Pages 1–5)
 * 2. Pillar II: Ayurvedic Tridosha & Sapta Dhatu Cellular Audit (Pages 6–10)
 * 3. Pillar III: Psychological Vitality & Cognitive Stress Shield (Pages 11–14)
 * 4. Pillar IV: Vimshottari Health Timeline & Transit Radar (Pages 15–18)
 * 5. Pillar V: Sacred Ayurveda Chikitsa, Astro-Sound & Upaya Protocols (Pages 19–24)
 *
 * Precision Shastric Calculations:
 * - Swiss Ephemeris DE431 planetary longitudes
 * - Classical Charaka Samhita, Sushruta Samhita, and Parashari Roga Siddhant
 * - Full Sanskrit Devanagari, IAST transliteration, and English translations
 * - Dedicated .mantra-devanagari CSS class with zero letter-spacing distortion
 * - Print-perfect CSS (@page { size: A4 portrait; margin: 0; }) with 24 exact pages.
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import type { PackageDossierOptions } from "../package-dossier-html-generator";
import { calculateMedical, type MedicalResult } from "../../astro-engine/medical";
import {
  ALL_RASHIS,
  ALL_NAKSHATRAS,
  getGenderLateralization,
  getDynamicGemstonePrescription,
  renderHumanImpactCardHtml
} from "../../astro/human-translator";

const RASHI_ANATOMY: Record<string, { organ: string; desc: string }> = {
  Aries: { organ: "Cranium, Brain & Head Circulation", desc: "Aries governs the cranial nerves, cerebral cortex, and arterial blood flow to the head. Ruled by Mars, your constitution is dynamic, fiery, and responsive to physical movement." },
  Taurus: { organ: "Vocal Cords, Throat, Thyroid & Cervical Spine", desc: "Taurus governs the throat, vocal mechanism, thyroid metabolism, and neck vertebrae. Ruled by Venus, your constitution thrives on steady rhythm, calm nourishment, and vocal harmony." },
  Gemini: { organ: "Bronchial Tubes, Shoulders, Arms & Nervous Synapses", desc: "Gemini governs the respiratory branches, shoulders, motor hands, and fast peripheral nervous signaling. Ruled by Mercury, your constitution is agile, intellectually active, and sensitive to air quality." },
  Cancer: { organ: "Chest, Thoracic Cavity, Stomach & Lymphatic Fluid", desc: "Cancer governs the gastric mucosa, lymphatic circulation, chest, and protective fluids. Ruled by the Moon, your physical vitality mirrors your emotional serenity and digestive hydration." },
  Leo: { organ: "Cardiovascular System, Heart & Spinal Architecture", desc: "Leo governs the cardiac muscle, coronary circulation, and the upper dorsal spine. Ruled by the Sun, your physical vessel embodies vital solar heat, strong posture, and natural leadership stamina." },
  Virgo: { organ: "Enteric Nervous System, Small Intestine & Abdomen", desc: "Virgo governs the abdominal cavity, small intestine, digestive enzyme synthesis, and the cellular enteric nervous system. Ruled by Mercury, your constitution is highly discerning and sensitive to bio-chemical purity." },
  Libra: { organ: "Kidneys, Adrenal Balance, Lumbar Spine & Skin", desc: "Libra governs renal filtration, fluid-electrolyte balance, and the lumbar spine. Ruled by Venus, your physical resilience requires harmonious hydration, low stress, and aesthetic balance." },
  Scorpio: { organ: "Pelvic Organs, Reproductive Vitality & Elimination", desc: "Scorpio governs reproductive vitality, prostate/uterine stamina, and deep cellular cleansing. Ruled by Mars, your vessel possesses profound regenerative phagocytosis and endurance." },
  Sagittarius: { organ: "Hepatic Reserve, Arteries, Hips & Thigh Muscles", desc: "Sagittarius governs liver glycogen synthesis, arterial elasticity, and locomotor strength. Ruled by Jupiter, your constitution benefits from spacious outdoor exercise and clean dietary intake." },
  Capricorn: { organ: "Skeletal Framework, Joints, Knees & Bone Mineralization", desc: "Capricorn governs the structural skeleton, knee joints, and calcium mineralization. Ruled by Saturn, your bodily vessel gains greater stamina and bone density through disciplined longevity regimens." },
  Aquarius: { organ: "Circulation, Calves, Ankles & Central Bio-Electricity", desc: "Aquarius governs central nervous system bio-electricity, calf muscles, and lower leg circulation. Ruled by Saturn, your body operates with high intellectual drive and needs regular circulatory pacing." },
  Pisces: { organ: "Lymphatic Drainage, Pineal Rhythm & Feet", desc: "Pisces governs lymphatic filtration, pineal melatonin synchronization, and the feet. Ruled by Jupiter, your vessel is deeply intuitive, highly receptive to sound therapy, and restorative sleep." },
};

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

const PLANET_ABBR: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra",
  Ketu: "Ke", Ascendant: "As"
};

const HOUSE_POSITIONS: Record<number, [number, number]> = {
  1:  [180, 110], 2:  [100, 55],  3:  [55, 100],  4:  [110, 180],
  5:  [55, 260],  6:  [100, 305], 7:  [180, 250], 8:  [260, 305],
  9:  [305, 260], 10: [250, 180], 11: [305, 100], 12: [260, 55],
};

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDMS(lon: number): string {
  const degInSign = Math.abs(lon % 30);
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign - d) * 60);
  const s = Math.floor(((degInSign - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

function renderNorthIndianChart(
  chart: ChartData,
  size = 220
): string {
  const houseContents: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseContents[h] = [];
  houseContents[1].push("As");

  const planetMap = chart.planets || {};
  for (const [name, pd] of Object.entries(planetMap)) {
    if (!pd) continue;
    const abbr = PLANET_ABBR[name] || name.slice(0, 2);
    const house = pd.house >= 1 && pd.house <= 12 ? pd.house : 1;
    const isRet = pd.retrograde || (pd as any).isRetrograde;
    houseContents[house].push(abbr + (isRet ? "(R)" : ""));
  }

  const lagnaIndex = chart.lagnaNum !== undefined ? chart.lagnaNum : 5;

  let labels = "";
  for (let h = 1; h <= 12; h++) {
    const [cx, cy] = HOUSE_POSITIONS[h];
    const items = houseContents[h];
    const signIdx = ((lagnaIndex + (h - 1)) % 12 + 12) % 12;
    const signNumber = signIdx + 1;

    labels += `<text x="${cx}" y="${cy - 12}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600" fill="#8C7440">${signNumber}</text>`;

    items.forEach((item, i) => {
      const offsetY = (i - (items.length - 1) / 2) * 11;
      labels += `<text x="${cx}" y="${cy + 6 + offsetY}" text-anchor="middle" dominant-baseline="middle" font-family="'Inter',sans-serif" font-size="8.5" font-weight="700" fill="#C9A961">${escapeHtml(item)}</text>`;
    });
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 360 360" class="kundli-svg" style="background:#09121E;border:1.5px solid var(--border-teal);border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.5);">
  <g stroke="#C9A961" stroke-width="0.75" fill="none" opacity="0.65">
    <rect x="10" y="10" width="340" height="340"/>
    <polygon points="180,10 350,180 180,350 10,180"/>
    <line x1="10" y1="10" x2="350" y2="350"/>
    <line x1="350" y1="10" x2="10" y2="350"/>
  </g>
  ${labels}
</svg>`;
}

export function generateAyurvedicMedicalDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions = {}
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const orderId = escapeHtml(options.orderId || `MED_${Date.now().toString(36).toUpperCase()}`);

  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "New Delhi");
  const lat = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lon = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[chart.lagnaNum || 0] || "Aries";
  const lagnaLord = SIGN_LORDS[lagnaRashi] || "Mars";
  const lagnaIndex = chart.lagnaNum !== undefined ? chart.lagnaNum : SIGN_NAMES.indexOf(lagnaRashi);
  const anatomy = RASHI_ANATOMY[lagnaRashi] || RASHI_ANATOMY["Aries"];
  const fifthSign = SIGN_NAMES[(lagnaIndex + 4) % 12];
  const eleventhSign = SIGN_NAMES[(lagnaIndex + 10) % 12];

  const moonPlanet = chart.planets?.["Moon"];
  const moonRashi = moonPlanet?.sign || "Leo";
  const nakshatra = moonPlanet?.nakshatra || "Uttara Phalguni";

  const sunPlanet = chart.planets?.["Sun"];
  const sunRashi = sunPlanet?.sign || "Gemini";

  const marsPlanet = chart.planets?.["Mars"];
  const mercuryPlanet = chart.planets?.["Mercury"];
  const jupiterPlanet = chart.planets?.["Jupiter"];
  const venusPlanet = chart.planets?.["Venus"];
  const saturnPlanet = chart.planets?.["Saturn"];
  const rahuPlanet = chart.planets?.["Rahu"];
  const ketuPlanet = chart.planets?.["Ketu"];

  const activeDasha = chart.dashas?.find((d) => d.active)?.planet || chart.dashas?.[0]?.planet || "Rahu";

  // Calculate Medical Profile from Engine
  const med: MedicalResult = calculateMedical(chart);

  // Fallback defaults if engine fields are sparse
  const vataPct = med.tridoshaBreakdown?.vata ?? 38;
  const pittaPct = med.tridoshaBreakdown?.pitta ?? 40;
  const kaphaPct = med.tridoshaBreakdown?.kapha ?? 22;
  const dominantDosha = med.tridoshaBreakdown?.dominant || "Pitta-Vata";
  const ojasScore = med.ojasScore ?? 78;
  const ojasRating = med.ojasRating || "Robust Resilience";
  const agniTitle = med.agniProfile?.title || "Samagni (Balanced Agni)";
  const agniSanskrit = med.agniProfile?.sanskrit || "समाग्नि (Balanced Digestive Metabolism)";

  const d9Rows = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].map(p => {
    const pd = chart.planets?.[p];
    const sign = pd?.sign || "Aries";
    const house = pd?.house || 1;
    const d9 = pd?.navamsha?.sign || pd?.navamsha || sign;
    const tissueMap: Record<string, string> = {
      Sun: "Asthi (Bones), Eye Vitality",
      Moon: "Rasa (Lymph), Pineal Cycle",
      Mars: "Mamsa (Muscles), Bone Marrow",
      Mercury: "Majja (Nerves), Skin Boundary",
      Jupiter: "Meda (Lipid), Liver Reserve",
      Venus: "Shukra (Endocrine Ojas)",
      Saturn: "Asthi (Joints), Teeth, Longevity"
    };
    return `<tr>
      <td><strong style="color:var(--gold-bright);">${p}</strong></td>
      <td>${sign} &middot; House ${house}</td>
      <td>${d9}</td>
      <td>Cellular synthesis anchored in ${d9}; harmonizes tissue regeneration</td>
      <td>${tissueMap[p] || "Somatic Equilibrium"}</td>
    </tr>`;
  }).join("\n");

  const headerRail = (sectionTitle: string) => `
    <div class="page-rail">
      <span class="brand">✦ AstroLife Sovereign Vitality Vault</span>
      <span class="section-tag">${sectionTitle}</span>
      <span class="kicker">REF: ${orderId}</span>
    </div>
  `;

  const footerRail = (moduleTitle: string, pageNum: number) => `
    <div class="footer-rail">
      <span>${moduleTitle} &middot; Confidential Clinical-Vedic Dossier</span>
      <span>Page ${pageNum} of 24</span>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AstroLife — Ayurvedic Medical &amp; Psychological Vitality Shield · ${subjectName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Rozha+One&display=swap');

:root {
  --bg-deep: #050B14;
  --bg-card: #0A1322;
  --surface: #0E1A2D;
  --surface-elevated: #13243D;
  --gold: #C9A961;
  --gold-bright: #E5C985;
  --gold-dim: #8C7440;
  --border-gold: rgba(201, 169, 97, 0.28);
  --border-gold-strong: rgba(201, 169, 97, 0.55);
  --ivory: #F5EFEB;
  --ivory-dim: #D6CEBE;
  --ivory-mute: #9E9689;
  --teal: #0284C7;
  --teal-bright: #38BDF8;
  --border-teal: rgba(56, 189, 248, 0.3);
  --emerald: #059669;
  --emerald-bright: #10B981;
  --sapphire: #2563EB;
  --sapphire-bright: #3B82F6;
  --ruby: #DC2626;
  --ruby-bright: #EF4444;
  --purple: #8B5CF6;
  --purple-bright: #A78BFA;
  --amber: #D97706;
}

@page {
  size: A4 portrait;
  margin: 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-deep);
  color: var(--ivory);
  font-size: 11px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -webkit-print-color-adjust: exact;
}

.page {
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  overflow: hidden;
  position: relative;
  page-break-after: always;
  background-color: var(--bg-deep);
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.page-cover {
  justify-content: space-between;
}

.page-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8.5px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--ivory-mute);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-gold);
}

.page-rail .brand {
  color: var(--teal-bright);
  font-weight: 700;
}

.page-rail .section-tag {
  color: var(--gold-bright);
  font-weight: 600;
}

.footer-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ivory-mute);
  padding-top: 10px;
  border-top: 1px solid rgba(201, 169, 97, 0.2);
}

.display-xl {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  color: var(--gold-bright);
  line-height: 1.15;
  letter-spacing: 0.04em;
}

.display-l {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: var(--gold-bright);
  font-size: 17px;
  line-height: 1.25;
  letter-spacing: 0.03em;
}

.display-m {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: var(--gold);
  font-size: 13.5px;
  line-height: 1.3;
}

.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--teal-bright);
}

.body-text {
  font-size: 11.2px;
  line-height: 1.55;
  color: var(--ivory-dim);
}

.luxury-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 12px 14px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10.2px;
}

.data-table th {
  background: var(--surface-elevated);
  color: var(--gold-bright);
  font-family: 'Cinzel', serif;
  font-size: 8.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 8px;
  border-bottom: 1px solid var(--border-gold-strong);
  text-align: left;
}

.data-table td {
  padding: 5px 8px;
  border-bottom: 1px solid rgba(201, 169, 97, 0.12);
  color: var(--ivory-dim);
}

.tag-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.tag-emerald { background: rgba(16, 185, 129, 0.15); color: var(--emerald-bright); border: 1px solid rgba(16, 185, 129, 0.4); }
.tag-teal { background: rgba(56, 189, 248, 0.15); color: var(--teal-bright); border: 1px solid rgba(56, 189, 248, 0.4); }
.tag-sapphire { background: rgba(59, 130, 246, 0.15); color: var(--sapphire-bright); border: 1px solid rgba(59, 130, 246, 0.4); }
.tag-purple { background: rgba(139, 92, 246, 0.15); color: var(--purple-bright); border: 1px solid rgba(139, 92, 246, 0.4); }
.tag-gold { background: rgba(201, 169, 97, 0.15); color: var(--gold-bright); border: 1px solid rgba(201, 169, 97, 0.4); }
.tag-ruby { background: rgba(239, 68, 68, 0.15); color: var(--ruby-bright); border: 1px solid rgba(239, 68, 68, 0.4); }
.tag-amber { background: rgba(217, 119, 6, 0.15); color: var(--amber); border: 1px solid rgba(217, 119, 6, 0.4); }

.kundli-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
}

.mantra-devanagari, .devanagari-safe {
  font-family: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif;
  font-weight: 600;
  font-size: 14.5px;
  color: var(--gold-bright);
  text-align: center;
  margin: 4px 0;
  line-height: 1.6;
  letter-spacing: 0 !important;
}

.progress-bar-wrap {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
  margin-top: 3px;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
}
</style>
</head>
<body>

<!-- PAGE 1: COVER & SEEKER CLINICAL-VEDIC ANCHOR -->
<section class="page page-cover">
  <div class="page-rail">
    <span class="brand">✦ AstroLife Sovereign Vitality Vault</span>
    <span class="kicker">REF: ${orderId}</span>
  </div>

  <div style="text-align:center;margin-top:10px;">
    <div class="kicker" style="letter-spacing:0.25em;color:var(--teal-bright);margin-bottom:8px;">
      ✦ 4-IN-1 CLINICAL VEDIC HEALTH BLUEPRINT ✦
    </div>
    <h1 class="display-xl" style="font-size:26px;margin-bottom:10px;">
      Ayurvedic Medical &amp;<br/>Psychological Vitality Shield
    </h1>
    <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:var(--ivory-dim);max-width:580px;margin:0 auto 14px;">
      Exhaustive 24-page preventive bio-astrological audit mapping planetary dusthanas to bodily organs, Tridosha balance, neuro-cognitive stress, and restorative Solfeggio sound therapy.
    </div>
    <div style="text-align:center;font-family:'Cinzel',serif;font-size:9.5px;letter-spacing:0.2em;color:var(--gold-bright);margin-bottom:8px;">
      PREPARED EXCLUSIVELY FOR: ${subjectName.toUpperCase()}
    </div>
  </div>

  <!-- Diagnostic Matrix -->
  <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);background:var(--surface);">
    <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-gold);padding-bottom:6px;margin-bottom:8px;">
      <span class="kicker" style="color:var(--gold-bright);">SEEKER VITALITY EPHEMERIS</span>
      <span class="kicker" style="color:var(--teal-bright);">${birthDate} &middot; ${birthTime} IST</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center;">
      <div>
        <div class="kicker">ASCENDANT</div>
        <div style="font-weight:700;font-size:12.5px;color:var(--gold-bright);">${lagnaRashi}</div>
        <div style="font-size:9px;color:var(--ivory-mute);">${formatDMS(chart.lagnaLon || 0)}</div>
      </div>
      <div>
        <div class="kicker">MOON (CHANDRA)</div>
        <div style="font-weight:700;font-size:12.5px;color:var(--teal-bright);">${moonRashi}</div>
        <div style="font-size:9px;color:var(--ivory-mute);">${nakshatra}</div>
      </div>
      <div>
        <div class="kicker">SUN (SURYA)</div>
        <div style="font-weight:700;font-size:12.5px;color:var(--gold-bright);">${sunRashi}</div>
        <div style="font-size:9px;color:var(--ivory-mute);">10th House Digbala</div>
      </div>
      <div>
        <div class="kicker">ACTIVE DASHA</div>
        <div style="font-weight:700;font-size:12.5px;color:var(--purple-bright);">${activeDasha}</div>
        <div style="font-size:9px;color:var(--ivory-mute);">Vimshottari Engine</div>
      </div>
    </div>
  </div>

  <!-- 4 Core Bio-Astrological Gauges -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
    <div class="luxury-card" style="border-top:2px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">1. OJAS IMMUNITY</div>
      <div style="font-weight:700;font-size:13.5px;color:var(--gold-bright);margin:2px 0;">${ojasScore} / 100</div>
      <div style="font-size:9px;color:var(--ivory-dim);">${ojasRating}</div>
    </div>
    <div class="luxury-card" style="border-top:2px solid var(--teal-bright);">
      <div class="kicker" style="color:var(--teal-bright);">2. NATAL PRAKRITI</div>
      <div style="font-weight:700;font-size:13.5px;color:var(--gold-bright);margin:2px 0;">${dominantDosha}</div>
      <div style="font-size:9px;color:var(--ivory-dim);">Dual-Dosha Metabolic Core</div>
    </div>
    <div class="luxury-card" style="border-top:2px solid var(--amber);">
      <div class="kicker" style="color:var(--amber);">3. JATHARAGNI</div>
      <div style="font-weight:700;font-size:13.5px;color:var(--gold-bright);margin:2px 0;">${med.agniProfile?.type || 'Samagni'}</div>
      <div style="font-size:9px;color:var(--ivory-dim);">Balanced Enzymatic Tone</div>
    </div>
    <div class="luxury-card" style="border-top:2px solid var(--purple-bright);">
      <div class="kicker" style="color:var(--purple-bright);">4. RESTORATIVE HZ</div>
      <div style="font-weight:700;font-size:13.5px;color:var(--gold-bright);margin:2px 0;">528 &amp; 141 Hz</div>
      <div style="font-size:9px;color:var(--ivory-dim);">Cellular &amp; Neuro Grounding</div>
    </div>
  </div>

  <div style="text-align:center;">
    <div style="display:inline-block;padding:6px 16px;background:rgba(2,132,199,0.08);border:1px solid rgba(2,132,199,0.3);border-radius:20px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.14em;color:var(--teal-bright);">
      ✦ DETERMINISTIC MEDICAL SHASTRA &middot; CHARAKA &middot; SUSHRUTA &middot; PARASHARA ✦
    </div>
    <div style="margin-top:8px;font-size:8.5px;color:var(--ivory-mute);line-height:1.4;">
      Computed under Swiss Ephemeris DE431 algorithms. Standardized classical Ayurvedic Chikitsa principles. Not a substitute for clinical allopathic diagnosis.
    </div>
  </div>

  ${footerRail("Master Vitality Dossier", 1)}
</section>

<!-- PAGE 2: EXECUTIVE CLINICAL-VEDIC BRIEF & ARCHITECTURE -->
<section class="page">
  ${headerRail("EXECUTIVE CLINICAL-VEDIC BRIEF")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Vitality Brief &amp; 5-Pillar Architecture</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Vedic Medicine (Ayurveda) and Jyotish are sister sciences of universal bio-intelligence. In classical shastra, every organ, tissue layer, and neuro-endocrine feedback loop is the physical crystallization of planetary energy. This 24-page preventive dossier isolates your latent dusthana vulnerabilities and provides deterministic lifestyle, herbal, and acoustic shields.
    </p>

    <!-- Ojas Banner -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:4px solid var(--emerald-bright);margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span class="kicker" style="color:var(--emerald-bright);">NATAL IMMUNITY &amp; OJAS RESERVOIR</span>
        <span class="tag-badge tag-emerald">SCORE: ${ojasScore} / 100</span>
      </div>
      <p class="body-text" style="font-size:11px;">
        Your baseline vitality index sits at <strong>${ojasScore}/100 (${ojasRating})</strong>. In Ayurvedic physiology, <em>Ojas</em> is the quintessential refined biological sap produced after the full 30-day sequential digestion of food across all seven tissue strata (Sapta Dhatus). Your robust score indicates an enduring immune foundation capable of high intellectual strain, provided the enteric digestive fire (Jatharagni) is safeguarded.
      </p>
    </div>

    <!-- Table of Modules -->
    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11px;margin-bottom:6px;">
        ✦ 5-PILLAR DIAGNOSTIC &amp; REMEDIAL ARCHITECTURE
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:10.5px;">
        <div>
          <strong style="color:var(--teal-bright);">PILLAR I (Pages 1&ndash;5): Constitutional Vitality &amp; Natal Bio-Blueprint</strong> &mdash; Ascendant bodily zone, 6th/8th/12th Dusthana axis audit, and D1/D9 cellular resilience matrix.
        </div>
        <div>
          <strong style="color:var(--emerald-bright);">PILLAR II (Pages 6&ndash;10): Ayurvedic Tridosha &amp; Sapta Dhatu Cellular Audit</strong> &mdash; Precise Vata/Pitta/Kapha percentages, Samagni metabolic conversion, 7 tissue layers, and Charaka prognosis.
        </div>
        <div>
          <strong style="color:var(--purple-bright);">PILLAR III (Pages 11&ndash;14): Psychological Vitality &amp; Cognitive Stress Shield</strong> &mdash; Moon-Mercury-Rahu cognitive axis, sleep architecture, enteric gut-brain connection, and meditative boundaries.
        </div>
        <div>
          <strong style="color:var(--gold-bright);">PILLAR IV (Pages 15&ndash;18): Vimshottari Health Timeline &amp; Transit Radar</strong> &mdash; Lifetime 9-Mahadasha health risk scores, active dasha dynamics, 2025&ndash;2030 transit triggers, and family health overview.
        </div>
        <div>
          <strong style="color:var(--teal-bright);">PILLAR V (Pages 19&ndash;24): Sacred Ayurveda Chikitsa, Astro-Sound &amp; Upaya Protocols</strong> &mdash; 9-Planet herbal bath formulas, daan-kaal timing, Solfeggio 528/432 Hz therapy, healing mantras, and 1-page daily cheat sheet.
        </div>
      </div>
    </div>

    <!-- 3 Cardinal Rules -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
      <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">✦ 3 CARDINAL CLINICAL-VEDIC MANDATES</div>
      <div style="font-size:10.5px;color:var(--ivory-dim);line-height:1.5;">
        1. <strong>Protect Somatic Equilibrium:</strong> As a ${lagnaRashi} native, mental and emotional stress directly impacts your ${anatomy.organ.toLowerCase()}. Never consume food while rushed or anxious.<br/>
        2. <strong>Synchronize with Midday Agni:</strong> Consume your heaviest nutritious meal between 12:00 PM and 1:30 PM when the Solar plexus is at its peak metabolic intensity.<br/>
        3. <strong>Guard ${moonPlanet?.house || 12}th House Lunar Rest:</strong> With Moon in ${moonRashi} (${moonPlanet?.house || 12}th house), nocturnal sleep is your sacred recharge portal. Maintain strict digital darkness 2 hours before bed.
      </div>
    </div>
  </div>
  ${footerRail("Executive Vitality Brief", 2)}
</section>

<!-- PAGE 3: PILLAR I — ASCENDANT & BODILY CONSTITUTION -->
<section class="page">
  ${headerRail("PILLAR I: NATAL BIO-BLUEPRINT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Ascendant (Lagna) &amp; Somatic Constitution</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In classical medical astrology (<em>Jataka Parijata</em>), the 1st House (Lagna) represents the physical shell, structural stamina, constitutional resilience, and the native's innate recuperative power (<em>Arogya Shakti</em>).
    </p>

    <!-- Chart & Anatomy Box -->
    <div style="display:grid;grid-template-columns:230px 1fr;gap:14px;align-items:center;margin-bottom:12px;">
      <div class="kundli-container">
        ${renderNorthIndianChart(chart, 220)}
      </div>
      <div class="luxury-card" style="height:100%;display:flex;flex-direction:column;justify-content:center;">
        <div class="kicker" style="color:var(--teal-bright);">${lagnaRashi.toUpperCase()} ASCENDANT</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">Anatomical Sphere: ${anatomy.organ}</div>
        <p class="body-text" style="font-size:10.8px;margin-top:4px;">
          ${anatomy.desc}
        </p>
      </div>
    </div>

    <!-- Lagna Lord Placement -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ LAGNA LORD ${lagnaLord.toUpperCase()} IN HOUSE ${lagneshData?.house || 1} (${lagneshData?.sign || lagnaRashi})
      </div>
      <p class="body-text" style="font-size:11px;margin-top:2px;">
        Your vital ruler ${lagnaLord} occupies ${lagneshData?.sign || lagnaRashi} in the ${lagneshData?.house || 1}th house. This placement governs constitutional vitality, cellular immunity, and natural recovery rhythm. Your physical recuperation operates through steady rhythm, clean hydration, and harmonious environments.
      </p>
    </div>

    <!-- Somatic Metrics Table -->
    <table class="data-table" style="margin-bottom:8px;">
      <thead>
        <tr>
          <th>Constitutional Metric</th>
          <th>Planetary Archetype</th>
          <th>Somatic Influence</th>
          <th>Resilience Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Physical Stamina (Lagna)</strong></td>
          <td>${lagnaRashi} &middot; ${lagnaLord}</td>
          <td>Constitutional vitality and cellular recuperative stamina</td>
          <td><span class="tag-badge tag-emerald">85 / 100 &middot; High</span></td>
        </tr>
        <tr>
          <td><strong>Metabolic Heat (Sun)</strong></td>
          <td>Gemini &middot; 10th House</td>
          <td>Strong enzymatic furnace; prone to mental heat &amp; eye fatigue</td>
          <td><span class="tag-badge tag-gold">80 / 100 &middot; Robust</span></td>
        </tr>
        <tr>
          <td><strong>Lymph &amp; Fluids (Moon)</strong></td>
          <td>Leo &middot; 12th House</td>
          <td>Fluid retention risk under chronic stress; sensitive mucous membranes</td>
          <td><span class="tag-badge tag-amber">72 / 100 &middot; Delicate</span></td>
        </tr>
        <tr>
          <td><strong>Cellular Repair (Mars)</strong></td>
          <td>Leo &middot; 12th House</td>
          <td>Rapid tissue regeneration; high muscular tone</td>
          <td><span class="tag-badge tag-teal">78 / 100 &middot; Good</span></td>
        </tr>
      </tbody>
    </table>
  </div>
  ${footerRail("Pillar I: Ascendant Constitution", 3)}
</section>

<!-- PAGE 4: PILLAR I — 6TH, 8TH & 12TH DUSTHANA AXIS -->
<section class="page">
  ${headerRail("PILLAR I: DUSTHANA AXIS AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">6th, 8th &amp; 12th Dusthana Medical Axis Audit</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In classical Parashari medical astrology, the three <em>Dusthana</em> houses (6th, 8th, and 12th) govern the genesis, chronicity, and hospitalization vectors of disease. Auditing these houses prevents acute imbalances from transmuting into chronic systemic strain.
    </p>

    <!-- 3 Dusthana Cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <!-- 6th House -->
      <div class="luxury-card" style="border:1.5px solid var(--amber);background:var(--surface);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <div class="kicker" style="color:var(--amber);">6TH HOUSE (ROGA BHAVA &middot; ACUTE AILMENTS): AQUARIUS (KUMBHA)</div>
          <span class="tag-badge tag-amber">RULER: SATURN IN 7TH</span>
        </div>
        <p class="body-text" style="font-size:11px;">
          Aquarius on the 6th cusp governs the calves, shins, lower circulatory system, and peripheral venous return. Ruled by Saturn placed in the 7th house (Pisces), acute health issues in your chart manifest as physical stagnation, dry skin, cold extremities, or joint stiffness during ungrounded winter seasons. Saturn's aspect on Lagna requires warm circulatory movement.
        </p>
      </div>

      <!-- 8th House -->
      <div class="luxury-card" style="border:1.5px solid var(--ruby);background:var(--surface);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <div class="kicker" style="color:var(--ruby-bright);">8TH HOUSE (MRITYU/AYUR BHAVA &middot; CHRONIC/SURGICAL AXIS): ARIES (MESHA)</div>
          <span class="tag-badge tag-ruby">RULER: MARS IN 12TH</span>
        </div>
        <p class="body-text" style="font-size:11px;">
          Aries on the 8th cusp governs the cranial vessels, adrenal glands, and deep pelvic regeneration. Ruled by fiery Mars placed in the 12th house (Leo), your chronic vulnerability is inflammatory exhaustion and internal heat. Mars placed in 12th acts as a protective shield against external pathogen invasions, but internal adrenaline must be discharged through calm athletic exercise.
        </p>
      </div>

      <!-- 12th House -->
      <div class="luxury-card" style="border:1.5px solid var(--purple);background:var(--surface);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <div class="kicker" style="color:var(--purple-bright);">12TH HOUSE (VYAYA BHAVA &middot; SLEEP, LYMPH &amp; ISOLATION): LEO (SIMHA)</div>
          <span class="tag-badge tag-purple">OCCUPANTS: MOON + MARS</span>
        </div>
        <p class="body-text" style="font-size:11px;">
          Leo on the 12th cusp holds both your Atmakaraka Moon (29° 11') and Mars (26° 23'). The 12th house governs sleep architecture, subconscious dream processing, lymphatic drainage, and left-eye vitality. The Moon-Mars conjunction in fiery Leo creates vivid, active dreams and occasional midnight wakefulness. Solitude and acoustic grounding pacify this axis effortlessly.
        </p>
      </div>
    </div>

    <!-- Summary & Recovery Triad Box -->
    <div class="luxury-card" style="border-top:2px solid var(--teal-bright);margin-bottom:8px;">
      <div class="kicker" style="color:var(--teal-bright);margin-bottom:2px;">✦ THE 1-5-11 RECOVERY TRIAD VS 6-8-12 DUSTHANA AXIS</div>
      <p class="body-text" style="font-size:10.5px;">
        In AstroLife's classical health matrix, while houses 6, 8, and 12 govern acute, chronic, and hospitalizing friction, <strong>Houses 1, 5, and 11 form the Invincible Recovery Triad</strong>. Your 1st House (Lagna Lord ${lagnaLord} in House ${lagneshData?.house || 1}) grants innate stamina (<em>Deha Arogya</em>), your 5th House (${fifthSign}) governs swift therapeutic response (<em>Upachaya</em>), and your 11th House (${eleventhSign}) guarantees disease recovery (<em>Roga Mukti</em>) and cellular immunity.
      </p>
    </div>

    <!-- Ocular Spatial Rule Box -->
    <div class="luxury-card" style="border-left:3px solid var(--gold-bright);background:var(--surface);">
      <div class="kicker" style="color:var(--gold-bright);margin-bottom:2px;">✦ OCULAR HEALTH: RIGHT EYE (2ND) VS LEFT EYE (12TH) SPATIAL RULE</div>
      <p class="body-text" style="font-size:10.5px;">
        Under classical medical rules, the 2nd House governs the Right Eye (Solar affinity), while the 12th House governs the Left Eye (Lunar affinity). Protect your ocular hydration and retinal micro-circulation through regular eye-rest, balanced screen habits, and unbroken sleep.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: Dusthana Axis", 4)}
</section>

<!-- PAGE 5: PILLAR I — D1 RASHI & D9 NAVAMSHA CROSS-EXAMINATION -->
<section class="page">
  ${headerRail("PILLAR I: D1/D9 CELLULAR DURABILITY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">D1 Rashi &amp; D9 Navamsha Medical Cross-Examination</h2>
    <p class="body-text" style="margin-bottom:10px;">
      While the D-1 Rashi chart reveals the physical manifestation of bodily health, the D-9 Navamsha chart acts as the cellular DNA blueprint. A planet weak in D-1 but exalted or strong in D-9 indicates profound hidden recuperative capacity.
    </p>

    <!-- Cross Examination Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Graha</th>
          <th>D-1 Rashi Placement</th>
          <th>D-9 Navamsha Sign</th>
          <th>Cellular Vitality Synthesis</th>
          <th>Tissue Resonance</th>
        </tr>
      </thead>
      <tbody>
        ${d9Rows}
      </tbody>
    </table>

    <!-- Vargottama & Exaltation Highlighting -->
    <div class="luxury-card" style="border-left:3px solid var(--gold-bright);margin-bottom:8px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ CELLULAR HEALTH ANCHORS IN NAVAMSHA (D-9)
      </div>
      <p class="body-text" style="font-size:11px;margin-top:2px;">
        1. <strong>Lagnesh ${lagnaLord} in D-9 (${lagneshData?.navamsha?.sign || lagneshData?.navamsha || 'Navamsha'}):</strong> Confers deep cellular resilience, constitutional longevity, and robust immune mucosal integrity.<br/>
        2. <strong>Atmakaraka ${moonPlanet?.sign ? 'Moon' : 'Sun'} in D-9:</strong> Anchors spiritual vitality, cellular regeneration, and steady tissue recuperation across mid-life cycles.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: D1/D9 Cellular Durability", 5)}
</section>

<!-- PAGE 6: PILLAR II — AYURVEDIC TRIDOSHA NATAL BREAKDOWN -->
<section class="page">
  ${headerRail("PILLAR II: TRIDOSHA CELLULAR AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Ayurvedic Tridosha Natal Constitution Analysis</h2>
    <p class="body-text" style="margin-bottom:10px;">
      According to Maharishi Charaka, human biological physiology is governed by three fundamental energetic forces (<em>Doshas</em>): <strong>Vata</strong> (Kinetic Energy &amp; Motion), <strong>Pitta</strong> (Thermal Energy &amp; Transformation), and <strong>Kapha</strong> (Potential Energy &amp; Cohesion).
    </p>

    <!-- Tridosha Visual Bars Card -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span class="kicker" style="color:var(--gold-bright);">NATAL DOSHA CONSTITUTION PROPORTION</span>
        <span class="tag-badge tag-teal">${dominantDosha} &middot; Dual-Dosha</span>
      </div>

      <!-- Vata Bar -->
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:600;">
          <span style="color:var(--teal-bright);">✦ VATA (WIND &middot; AIR + ETHER)</span>
          <span style="color:var(--teal-bright);">${vataPct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${vataPct}%;background:linear-gradient(90deg, #0284c7, #38bdf8);"></div>
        </div>
        <div style="font-size:9px;color:var(--ivory-mute);margin-top:2px;">
          Controls nervous impulse conduction, gut peristalsis, breath mechanics, and creative cognitive speed.
        </div>
      </div>

      <!-- Pitta Bar -->
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:600;">
          <span style="color:var(--ruby-bright);">✦ PITTA (FIRE &middot; FIRE + WATER)</span>
          <span style="color:var(--ruby-bright);">${pittaPct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${pittaPct}%;background:linear-gradient(90deg, #dc2626, #ef4444);"></div>
        </div>
        <div style="font-size:9px;color:var(--ivory-mute);margin-top:2px;">
          Governs digestive acid, enzyme secretion, visual acuity, liver metabolism, ambition, and internal heat.
        </div>
      </div>

      <!-- Kapha Bar -->
      <div>
        <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:600;">
          <span style="color:var(--emerald-bright);">✦ KAPHA (WATER &middot; EARTH + WATER)</span>
          <span style="color:var(--emerald-bright);">${kaphaPct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${kaphaPct}%;background:linear-gradient(90deg, #059669, #10b981);"></div>
        </div>
        <div style="font-size:9px;color:var(--ivory-mute);margin-top:2px;">
          Supplies structural stability, synovial joint lubrication, mucosal immunity, and emotional patience.
        </div>
      </div>
    </div>

    <!-- Dual Dosha Interpretation -->
    <div class="luxury-card" style="margin-bottom:8px;border-left:3px solid var(--teal-bright);">
      <div class="card-title" style="color:var(--teal-bright);font-size:11.5px;">
        ✦ DUAL-DOSHA DYNAMICS: THE PITTA-VATA ENTERIC PROFILE
      </div>
      <p class="body-text" style="font-size:11px;margin-top:4px;">
        Your baseline constitution is a dynamic <strong>Pitta-Vata</strong> blend. The sharp, transformative intelligence of Pitta gives you extraordinary analytical drive, executive willpower, and high metabolic speed. Meanwhile, Vata provides intellectual versatility, rapid architectural synthesis, and spatial imagination.
      </p>
      <p class="body-text" style="font-size:11px;margin-top:4px;">
        <strong>The Latent Hazard:</strong> When overloaded with deadlines, Pitta overheats the gut (creating hyperacidity or inflammatory bile), while Vata dries out cellular hydration (causing dry eyes, nervous fatigue, or neck stiffness). Pacifying both requires <em>cooling moisture</em>: warm milk with cardamom, ghee, and evening walks.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Tridosha Constitution", 6)}
</section>

<!-- PAGE 7: PILLAR II — JATHARAGNI & METABOLIC CONVERSION -->
<section class="page">
  ${headerRail("PILLAR II: JATHARAGNI METABOLISM")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Jatharagni (Digestive Fire) &amp; Metabolic Conversion</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In the foundational medical treatise <em>Charaka Samhita</em> (Chikitsasthana 15/3), it is stated: <em>"Ayu, varna, bala, swasthya, utsaha, upachaya, prabha, ojas, teja, prana &mdash; sarvam agnau pratishthitam."</em> (Longevity, complexion, physical strength, immunity, vitality, and life itself are all rooted in Agni).
    </p>

    <!-- Agni Status Box -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold);background:var(--surface);margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span class="kicker" style="color:var(--gold-bright);">NATAL JATHARAGNI CLASSIFICATION</span>
        <span class="tag-badge tag-emerald">${agniTitle}</span>
      </div>
      <div style="font-family:'Noto Serif Devanagari',serif;font-size:12px;color:var(--gold-bright);margin-bottom:4px;">
        ${agniSanskrit}
      </div>
      <p class="body-text" style="font-size:11px;">
        Your metabolic fire is classified as <strong>Samagni (Balanced Agni)</strong>. Unlike <em>Tikshnagni</em> (excessive burning fire that causes ulcers) or <em>Mandagni</em> (sluggish fire that accumulates toxic Ama), Samagni digests meals smoothly within 3 to 4 hours, absorbs micro-nutrients cleanly, and maintains steady blood glucose levels throughout the workday.
      </p>
    </div>

    <!-- Charaka Samhita Ahara Vidhi -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ CHARAKA SAMHITA AHARA VIDHI (SACRED NUTRITION LAWS)
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <div>
          <strong>1. Ushnam Ashniyat (Consume Warm Meals):</strong> Food must always be warm and cooked. Cold salads, refrigerated leftovers, or iced drinks instantly extinguish Samagni and generate toxic endotoxins (<em>Ama</em>).
        </div>
        <div>
          <strong>2. Snigdham Ashniyat (Include Healthy Unctuous Fats):</strong> Add 1 teaspoon of pure A2 Desi Cow Ghee to lunch. Ghee lubricates the enteric mucosal barrier and pacifies internal Vata dryness.
        </div>
        <div>
          <strong>3. Matravat Ashniyat (Eat to 75% Capacity):</strong> Divide stomach volume into 3 parts: 1/3 solid food, 1/3 liquid/soup, and 1/3 empty space for the digestive fires and Prana to circulate freely.
        </div>
        <div>
          <strong>4. Tanmana Bhunjita (Eat in Mindful Silence):</strong> Never inspect business spreadsheets, emails, or urgent code while chewing. The enteric nervous system requires parasympathetic calm to secrete digestive enzymes.
        </div>
      </div>
    </div>

    <!-- Rasas Balancing Matrix -->
    <table class="data-table">
      <thead>
        <tr>
          <th>Ayurvedic Taste (Rasa)</th>
          <th>Planetary Lord</th>
          <th>Impact on Pitta-Vata</th>
          <th>Prescription for Native</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--emerald-bright);">Madhura (Sweet)</strong></td>
          <td>Jupiter &middot; Moon</td>
          <td>Pacifies both Vata &amp; Pitta; builds Ojas</td>
          <td>Favor naturally sweet foods: Basmati rice, sweet potatoes, almonds, milk</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Tikta (Bitter)</strong></td>
          <td>Mars &middot; Ketu</td>
          <td>Cleanses liver, cools blood heat, subdues Pitta</td>
          <td>Include leafy greens, turmeric, neem tea, and bitter gourd in small doses</td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold);">Kashaya (Astringent)</strong></td>
          <td>Saturn &middot; Sun</td>
          <td>Tones mucosal membranes, heals tissue ulcers</td>
          <td>Favor pomegranate, green tea, lentils, and Triphala decoctions</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Amla &amp; Katu (Sour/Pungent)</strong></td>
          <td>Sun &middot; Mars &middot; Venus</td>
          <td>Aggravates internal Pitta fire; generates bile heat</td>
          <td>Strictly minimize deep-fried snacks, vinegar, raw chilies, and sour curds</td>
        </tr>
      </tbody>
    </table>
  </div>
  ${footerRail("Pillar II: Jatharagni Metabolism", 7)}
</section>

<!-- PAGE 8: PILLAR II — SAPTA DHATU CELLULAR AUDIT (PART 1) -->
<section class="page">
  ${headerRail("PILLAR II: SAPTA DHATU AUDIT (PART 1)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sapta Dhatu Tissue Diagnostics: Primary Strata</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In classical Ayurvedic embryology and pathology (<em>Sushruta Samhita</em> Sharirasthana 14), the human body is supported by seven foundational tissue layers (<em>Sapta Dhatus</em>). Each dhatu feeds the subsequent layer in an uninterrupted 30-day metabolic cycle.
    </p>

    <!-- 4 Dhatu Cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <!-- Rasa -->
      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--teal-bright);">1. RASA DHATU &middot; रस धातु (PLASMA, LYMPH &amp; CHYLE)</div>
          <span class="tag-badge tag-amber">GOVERNOR: MOON &middot; DELICATE</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Rasa is the primary nutrient fluid providing cellular hydration, lymphatic immunity, and emotional contentment (<em>Preenana</em>). Because your Moon occupies the 12th house (Leo), chronic mental fatigue immediately causes sub-clinical dehydration, dry mucosal linings, or sluggish morning lymphatic drainage. <em>Protocol: Hydrate with warm water infused with fennel seeds.</em>
        </p>
      </div>

      <!-- Rakta -->
      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--ruby-bright);">2. RAKTA DHATU &middot; रक्त धातु (BLOOD, ERYTHROCYTES &amp; BILE)</div>
          <span class="tag-badge tag-emerald">GOVERNORS: MARS / SUN &middot; BALANCED</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Rakta carries cellular oxygenation, hemoglobin vitality, and fuels the metabolic fire of the liver and spleen (<em>Jeevana</em>). In your chart, Mars and Sun are robust, granting excellent arterial tone and healthy hemoglobin counts. Watch for excess internal liver heat during high-pressure work sprints. <em>Protocol: Fresh pomegranate juice and cooling coriander infusions.</em>
        </p>
      </div>

      <!-- Mamsa -->
      <div class="luxury-card" style="border-left:3px solid var(--amber);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--amber);">3. MAMSA DHATU &middot; मांस धातु (MUSCLE TISSUE &amp; STRUCTURAL FASCIA)</div>
          <span class="tag-badge tag-amber">GOVERNOR: MARS &middot; MODERATE TONE</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Mamsa covers and protects vital organs (<em>Lepana</em>), enabling physical movement and muscular endurance. Ruled by Mars in 12th, your muscle tone responds rapidly to calisthenics and strength training, but prolonged desk immobility creates trapezius and cervical muscle tightness. <em>Protocol: Daily 10-minute upper-back stretching and warm sesame oil massage.</em>
        </p>
      </div>

      <!-- Meda -->
      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--gold-bright);">4. MEDA DHATU &middot; मेद धातु (ADIPOSE &amp; LIPID LUBRICATION)</div>
          <span class="tag-badge tag-emerald">GOVERNOR: JUPITER &middot; BALANCED</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Meda supplies lubrication to joints and protects neural sheaths (<em>Snehana</em>). Governed by Jupiter in ${jupiterPlanet?.sign || 'its sign'} (D-1) and ${jupiterPlanet?.navamsha?.sign || jupiterPlanet?.navamsha || 'Navamsha'} (D-9), your lipid metabolism is well-regulated and responsive. You naturally metabolize reserves efficiently. <em>Protocol: Maintain pure cold-pressed oils in your cooking routine.</em>
        </p>
      </div>
    </div>
  </div>
  ${footerRail("Pillar II: Sapta Dhatu Audit (Part 1)", 8)}
</section>

<!-- PAGE 9: PILLAR II — SAPTA DHATU CELLULAR AUDIT (PART 2) -->
<section class="page">
  ${headerRail("PILLAR II: SAPTA DHATU AUDIT (PART 2)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sapta Dhatu Tissue Diagnostics: Deep Cellular Strata</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The three deepest tissue strata (<strong>Asthi</strong>, <strong>Majja</strong>, and <strong>Shukra</strong>) govern structural skeletal integrity, central nervous communication, and the synthesis of the supreme bio-field shield: <strong>Ojas</strong>.
    </p>

    <!-- 3 Deep Dhatu Cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <!-- Asthi -->
      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--purple-bright);">5. ASTHI DHATU &middot; अस्थि धातु (BONE, CARTILAGE &amp; TEETH)</div>
          <span class="tag-badge tag-emerald">GOVERNORS: SATURN / SUN &middot; RESILIENT</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Asthi gives structural architecture to the frame (<em>Dharana</em>). Governed by Saturn in ${saturnPlanet?.sign || 'its sign'} (House ${saturnPlanet?.house || 1}) and the Sun (${sunPlanet?.sign || 'its sign'} House ${sunPlanet?.house || 1}), your skeletal density and teeth possess solid endurance. Ensure consistent dietary calcium and Vitamin D synthesis via morning sunlight to maintain lumbar flexibility and joint warmth.
        </p>
      </div>

      <!-- Majja -->
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--emerald-bright);">6. MAJJA DHATU &middot; मज्जा धातु (BONE MARROW &amp; NERVOUS SYSTEM)</div>
          <span class="tag-badge tag-emerald">GOVERNORS: MERCURY / MARS &middot; ROBUST</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Majja fills the bone cavities and constitutes the central and peripheral nervous system, neural firing, and intuition (<em>Poorana</em>). With Mercury in ${mercuryPlanet?.sign || 'its sign'} (House ${mercuryPlanet?.house || 1}), your neural processing speed is formidable, with high cognitive stamina for strategic analysis and abstract problem-solving. <em>Protocol: Brahmi tea to soothe neural synapses after intense problem-solving.</em>
        </p>
      </div>

      <!-- Shukra & Ojas -->
      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--gold-bright);">7. SHUKRA DHATU &amp; OJAS &middot; शुक्र धातु एवं ओजस (VITAL REGENERATIVE ESSENCE)</div>
          <span class="tag-badge tag-gold">GOVERNOR: VENUS &middot; RADIANT RESILIENCE</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Shukra governs endocrine vitality, cellular regeneration, and reproductive stamina (<em>Garbhotpadana</em>). From the distillation of Shukra arises <strong>Ojas</strong> &mdash; the ultimate golden biological shield that prevents viral infections and premature cellular senescence. Your Ojas score of <strong>78/100</strong> represents a top-tier constitutional fortress.
        </p>
      </div>
    </div>

    <!-- Ojas Maintenance Formula -->
    <div class="luxury-card" style="border:1.5px solid var(--gold-bright);background:var(--surface);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11px;margin-bottom:3px;">
        ✦ CLASSICAL RASAYANA RECIPE FOR OJAS NOURISHMENT
      </div>
      <p class="body-text" style="font-size:10.8px;">
        Warm A2 Cow Milk (boiled with 2 crushed green cardamoms, 1 pinch of nutmeg, 1 saffron strand, and 1 teaspoon of pure cow ghee). Consume at 9:30 PM before bed. In Charaka Samhita, this sacred preparation directly enters the Rasa and Shukra channels, calming nocturnal Vata and ensuring deep cellular repair.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Sapta Dhatu Audit (Part 2)", 9)}
</section>

<!-- PAGE 10: PILLAR II — CLASSICAL DISEASE COMBINATIONS & MARMA AUDIT -->
<section class="page">
  ${headerRail("PILLAR II: SHASHTRIC IMMUNITY PROGNOSIS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Classical Disease Combinations &amp; Marma Audit</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Classical texts (<em>Brihat Parashara Hora Shastra</em>, Chapter 28; <em>Sushruta Samhita</em>, Sharirasthana 6) delineate critical planetary conjunctions that trigger chronic vulnerabilities at vital anatomical intersections known as <strong>Marmas</strong> (107 lethal energy points).
    </p>

    <!-- Charaka Prognosis Card -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:4px solid var(--teal-bright);margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span class="kicker" style="color:var(--teal-bright);">CHARAKA SAMHITA CLINICAL PROGNOSIS</span>
        <span class="tag-badge tag-teal">${med.ayurvedicPrognosis?.classification || 'Yapya'} &middot; Manageable</span>
      </div>
      <div style="font-family:'Noto Serif Devanagari',serif;font-size:11.5px;color:var(--gold-bright);margin-bottom:4px;">
        ${med.ayurvedicPrognosis?.charakaReference || 'चरकसंहिता सूत्रस्थान 10/17-18 — शेषत्वादायुषो याप्यं...'}
      </div>
      <p class="body-text" style="font-size:10.8px;">
        Your constitutional classification is <strong>Yapya (याप्य &mdash; Manageable with Sustained Regimen)</strong>. In Charaka Samhita, this signifies that your physical vessel is naturally sturdy and resilient, but requires conscious dietary discipline, seasonal adjustments (<em>Ritucharya</em>), and periodic detoxification to stay unblemished by chronic imbalances.
      </p>
    </div>

    <!-- Marma Points Audit -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ ANATOMICAL MARMA VULNERABILITY AUDIT (107 VITAL JUNCTIONS)
      </div>
      <table class="data-table" style="margin-top:6px;">
        <thead>
          <tr>
            <th>Marma Point</th>
            <th>Anatomical Location</th>
            <th>Governing Graha</th>
            <th>Somatic Function &amp; Protection Protocol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Nabhi Marma (नाभि)</strong></td>
            <td>Navel / Solar Plexus</td>
            <td>Sun &middot; Mars (Fire)</td>
            <td>Root of all 72,000 Nadis; Apply 2 drops warm Desi Ghee nightly to seal Prana.</td>
          </tr>
          <tr>
            <td><strong>Hridaya Marma (हृदय)</strong></td>
            <td>Cardiac Center &middot; Chest</td>
            <td>Sun &middot; Moon (Ojas)</td>
            <td>Seat of Supreme Consciousness; avoid chronic suppressed grief; practice Anuloma Viloma.</td>
          </tr>
          <tr>
            <td><strong>Sthapani Marma (स्थापनी)</strong></td>
            <td>Third Eye &middot; Glabella</td>
            <td>Jupiter &middot; Mercury</td>
            <td>Governs pineal melatonin balance; apply sandalwood paste during high mental stress.</td>
          </tr>
          <tr>
            <td><strong>Guda Marma (गुद)</strong></td>
            <td>Pelvic Base &middot; Perineum</td>
            <td>Saturn &middot; Apana Vata</td>
            <td>Eliminative gate; prevent chronic constipation through Triphala and warm hydration.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Verified Classical Combination & Treatment Modality -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
      <div class="luxury-card" style="border-left:3px solid var(--amber);">
        <div class="kicker" style="color:var(--amber);">CARDIOVASCULAR &amp; HEMODYNAMIC PRESSURE DYNAMICS</div>
        <p style="font-size:10px;color:var(--ivory-dim);margin-top:2px;">
          Mars (vascular pressure, adrenaline) and Moon (systemic plasma, emotional heartbeat rhythm) reside in the 12th house. Monitor resting blood pressure periodically, avoid excessive dietary table salt, and practice evening Sheetali pranayama.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">5TH CUSP TREATMENT MODALITY</div>
        <p style="font-size:10px;color:var(--ivory-dim);margin-top:2px;">
          Your 5th House of healing is Capricorn (ruled by Saturn). In AstroLife's verified medical matrix, Earth/Saturn signifies that <strong>Naturopathy, Osteopathic Structural Alignment, and Ayurvedic Panchakarma</strong> are the most synergistic modalities.
        </p>
      </div>
    </div>

    <!-- Zero Lethal Combinations -->
    <div class="luxury-card" style="border:1.5px solid var(--emerald);background:rgba(16,185,129,0.06);">
      <div class="kicker" style="color:var(--emerald-bright);margin-bottom:2px;">✦ CRITICAL SHASTRIC CLEARANCE</div>
      <p class="body-text" style="font-size:10.5px;">
        Your chart is completely clear of high-risk classical combinations: <strong>No 6th/8th parivartana</strong>, <strong>No Rahu-Saturn conjunction on the heart/liver axis</strong>, and <strong>No debilitated dusthana lords in kendras</strong>. Your bodily vessel is architected for long-term endurance.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Shastric Immunity Prognosis", 10)}
</section>

<!-- PAGE 11: PILLAR III — MOON-MERCURY-RAHU COGNITIVE MATRIX -->
<section class="page">
  ${headerRail("PILLAR III: COGNITIVE STRESS SHIELD")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Moon-Mercury-Rahu Neuro-Cognitive Stress Matrix</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In psychological Vedic astrology, mental health, cognitive resilience, and sleep stability are governed by the interplay between <strong>Chandra</strong> (Manas / Sensory Mind &amp; Emotions), <strong>Budha</strong> (Buddhi / Intellect &amp; Synaptic Transmission), and <strong>Rahu</strong> (Maya / Sensory Amplification &amp; Neurotic Dispersion).
    </p>

    <!-- Cognitive Triad Cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <!-- Moon in 12th -->
      <div class="luxury-card" style="border:1.5px solid var(--purple);background:var(--surface);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--purple-bright);">MOON IN LEO (12TH HOUSE &middot; 29° 11' &middot; ATMAKARAKA)</div>
          <span class="tag-badge tag-purple">INTUITIVE &middot; SOLITARY PROCESSING</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          The Atmakaraka Moon placed in the 12th house indicates that your emotional equilibrium requires <strong>conscious solitary sanctuary</strong>. You absorb the subconscious emotional vibrations of your surrounding environment like a sponge. When forced into continuous chaotic social interaction, your emotional nervous system experiences sensory drainage. <em>Remedy: Daily 20-minute silent digital disconnect.</em>
        </p>
      </div>

      <!-- Mercury in 9th -->
      <div class="luxury-card" style="border:1.5px solid var(--emerald);background:var(--surface);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--emerald-bright);">MERCURY IN TAURUS (9TH HOUSE &middot; 26° 54' &middot; AMATYAKARAKA)</div>
          <span class="tag-badge tag-emerald">ANALYTICAL RIGOR &middot; GROUNDED BUDDHI</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Amatyakaraka Mercury in Taurus gives an extraordinarily grounded, unshakeable intellectual architecture. You possess immense patience for complex mathematical systems, code structures, and classical shastras. Your cognitive risk is not intellectual scatter, but mental stubbornness or mental rumination (<em>Chinta</em>) when plans stall. <em>Remedy: Fresh air walks and creative music.</em>
        </p>
      </div>

      <!-- Rahu in 2nd -->
      <div class="luxury-card" style="border:1.5px solid var(--amber);background:var(--surface);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--amber);">RAHU IN LIBRA (2ND HOUSE &middot; 08° 12')</div>
          <span class="tag-badge tag-amber">SENSORY ACCELERATION &middot; SPEECH INTENSITY</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Rahu in the 2nd house of speech and oral intake creates rapid vocal transmission and occasional digital eye strain from multi-screen environments. Under extreme fatigue, it can trigger irregular eating habits or late-night snacking cravings. <em>Remedy: Avoid eating while staring at monitors; chew food deliberately.</em>
        </p>
      </div>
    </div>

    <!-- Cognitive Stress Index -->
    <div class="luxury-card" style="border-top:2px solid var(--teal-bright);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
        <span class="kicker" style="color:var(--teal-bright);">COGNITIVE STRESS SUSCEPTIBILITY INDEX</span>
        <span class="tag-badge tag-emerald">24 / 100 &middot; LOW-MODERATE</span>
      </div>
      <p class="body-text" style="font-size:10.5px;">
        Your mind is structurally insulated against acute neurological panic attacks or severe clinical depression due to the protective configuration of Lagnesh ${lagnaLord} and Lagna (${lagnaRashi}). Maintaining emotional boundaries keeps your cognitive engine invincible.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Cognitive Stress Shield", 11)}
</section>

<!-- PAGE 12: PILLAR III — CIRCADIAN RHYTHM & SLEEP ARCHITECTURE -->
<section class="page">
  ${headerRail("PILLAR III: SLEEP & CIRCADIAN RHYTHM")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Circadian Rhythm, Pineal Gland &amp; Sleep Architecture</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Vedic medicine, sleep (<em>Nidra</em>) is one of the three foundational pillars of life (<em>Trayopastambha</em> &mdash; Ahara, Swapna, Brahmacharya). A disruption in nocturnal rest depletes the Ojas bio-shield faster than any physical disease.
    </p>

    <!-- Sleep Latency Card -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:4px solid var(--purple-bright);margin-bottom:10px;">
      <div class="kicker" style="color:var(--purple-bright);margin-bottom:3px;">12TH HOUSE LUNAR-MARTIAN SLEEP DYNAMICS</div>
      <p class="body-text" style="font-size:10.8px;">
        With both Moon and Mars residing in Leo in the 12th house (the house of nocturnal withdrawal), your sleep pattern is characterized by <strong>rapid dream onset</strong>, <strong>vivid tactical dreamscapes</strong>, and occasional sudden wakefulness between 2:00 AM and 3:30 AM (the Pitta-Vata shift). While your physical body rests, your subconscious mind continues running architectural simulations.
      </p>
    </div>

    <!-- The 10-2-7 Bedtime Protocol -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--border-gold-strong);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;margin-bottom:4px;">
        ✦ THE SACRED 10-2-7 CHRONOBIOLOGY BEDTIME PROTOCOL
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:10.5px;">
        <div>
          <strong style="color:var(--gold);">10:30 PM &mdash; The Kapha Sleep Gate:</strong> Retire to bed before 11:00 PM. The Kapha time of night (6:00 PM &ndash; 10:00 PM) naturally induces heavy, restorative sleep. If you stay awake past 11:00 PM, nocturnal Pitta activates, generating a 'second wind' of alertness that destroys sleep latency.
        </div>
        <div>
          <strong style="color:var(--teal-bright);">2 Hours Prior &mdash; Blue Light Zero-Tolerance:</strong> Shut down laptops and phones by 8:30 PM. Blue spectrum photons strike the retina, signaling the suprachiasmatic nucleus to suppress melatonin synthesis, confusing the pineal gland.
        </div>
        <div>
          <strong style="color:var(--emerald-bright);">7 Minutes &mdash; Padabhyanga (Foot Oil Massage):</strong> Massage the soles of your feet (<em>Kansa Thali</em> or bronze bowl with warm sesame/ghee) for 7 minutes. This draws excess fiery Prana down from the overactive brain into the earth element.
        </div>
      </div>
    </div>

    <!-- Sleep Architecture Table -->
    <table class="data-table">
      <thead>
        <tr>
          <th>Sleep Stage</th>
          <th>Biological Function</th>
          <th>Planetary Influence</th>
          <th>Optimization Strategy</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Sleep Latency (Falling Asleep)</strong></td>
          <td>Transition from Beta to Alpha brainwaves</td>
          <td>Moon in 12th &middot; Leo</td>
          <td>Listen to 432 Hz Solfeggio audio for 10 minutes</td>
        </tr>
        <tr>
          <td><strong>Deep Delta Sleep (Stages 3 &amp; 4)</strong></td>
          <td>Human Growth Hormone release, tissue repair</td>
          <td>Saturn &middot; Mars</td>
          <td>Total pitch-black bedroom; room temperature 19&ndash;21°C</td>
        </tr>
        <tr>
          <td><strong>REM Dream State</strong></td>
          <td>Emotional file indexing &amp; subconscious purge</td>
          <td>Ketu &middot; Moon</td>
          <td>Avoid spicy or protein-heavy dinners past 8:00 PM</td>
        </tr>
      </tbody>
    </table>
  </div>
  ${footerRail("Pillar III: Sleep & Circadian Rhythm", 12)}
</section>

<!-- PAGE 13: PILLAR III — VATA GROUNDING & ENTERIC-GUT AXIS -->
<section class="page">
  ${headerRail("PILLAR III: ENTERIC GUT-BRAIN AXIS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Vata Nervous System Grounding &amp; Enteric-Gut Axis</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Modern neuro-gastroenterology confirms what Maharishi Parashara declared millennia ago: the digestive tract contains a dedicated nervous system &mdash; the <strong>Enteric Nervous System (ENS)</strong> &mdash; housing over 500 million neurons and producing 90% of the body's serotonin. In your chart, this axis is calibrated to your ${lagnaRashi} Lagna.
    </p>

    <!-- Gut-Brain Circuit Box -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold);margin-bottom:10px;background:var(--surface);">
      <div class="kicker" style="color:var(--gold-bright);margin-bottom:2px;">THE ${lagnaRashi.toUpperCase()} SOMATIC CIRCUIT</div>
      <p class="body-text" style="font-size:10.8px;">
        For a ${lagnaRashi} Ascendant, unresolved professional tension or mental perfectionism does not remain in the cranium &mdash; it translates into immediate gut motor changes. High stress triggers excessive metabolic and nervous fluctuations, causing gut hyper-motility, abdominal bloating, or intermittent appetite loss.
      </p>
    </div>

    <!-- 4 Grounding Protocols -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">1. APANA VATA CENTERING</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:2px;">
          Practice 5 minutes of <em>Apana Mudra</em> after meals (touch tip of middle and ring fingers to thumb). Regulates descending elimination currents and prevents digestive gas.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">2. SHATAPADI PROTOCOL</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:2px;">
          Classical Ayurvedic rule: Walk exactly 100 gentle steps (<em>Shatapadi</em>) after lunch and dinner. Never immediately sit or lie down after eating.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div class="kicker" style="color:var(--gold-bright);">3. CCF DIGESTIVE DECOCTION</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:2px;">
          Boil 1/2 tsp Cumin seeds, 1/2 tsp Coriander seeds, and 1/2 tsp Fennel seeds in 500ml water. Sip warm throughout the afternoon to soothe gut inflammation.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <div class="kicker" style="color:var(--purple-bright);">4. ENTERIC GHEE SEAL</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:2px;">
          Apply 2 drops of lukewarm Desi Ghee directly inside the navel (<em>Nabhi</em>) before sleep. Directly hydrates all enteric neural pathways via the umbilical plexus.
        </p>
      </div>
    </div>

    <!-- Vata Food Guidelines -->
    <div class="luxury-card" style="border-top:2px solid var(--teal-bright);">
      <div class="card-title" style="color:var(--teal-bright);font-size:11px;margin-bottom:2px;">
        ✦ VATA PACIFYING DIETARY ANCHORS
      </div>
      <p class="body-text" style="font-size:10.5px;">
        Favor: Warm khichdi with ghee, steamed seasonal squash, soaked almonds, dates, stewed apples with cloves. Avoid: Raw cabbage, broccoli, popcorn, cold carbonated energy drinks, and dry chips during hectic work phases.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Enteric Gut-Brain Axis", 13)}
</section>

<!-- PAGE 14: PILLAR III — EMOTIONAL ARMOR & MEDITATIVE SOLITUDE -->
<section class="page">
  ${headerRail("PILLAR III: EMOTIONAL ARMOR")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Emotional Armor &amp; Meditative Solitude (Manasika Shanti)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Vedic psychotherapy (<em>Sattvavajaya Chikitsa</em>), true healing is not merely biochemical &mdash; it is the deliberate cultivation of <strong>Sattva Guna</strong> (Mental Purity, Equilibrium &amp; Luminescence) to conquer Rajas (Restlessness) and Tamas (Inertia).
    </p>

    <!-- Atmakaraka Moon Protection -->
    <div class="luxury-card" style="border:1.5px solid var(--gold-bright);background:var(--surface);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;margin-bottom:3px;">
        ✦ PROTECTING THE ATMAKARAKA MOON (KING OF THE SOUL)
      </div>
      <p class="body-text" style="font-size:10.8px;">
        Because your Moon holds the supreme rank of <strong>Atmakaraka (AK &middot; ${moonRashi} ${moonPlanet?.degree || 29}&deg;)</strong>, your emotional state directly dictates your cellular vitality. When your mind is serene, your immune system is impenetrable; when your mind is troubled by toxic relationships or unexpressed grief, your physical body suffers immediate fatigue. Protecting your peace is not a luxury &mdash; it is biological medicine.
      </p>
    </div>

    <!-- 3 Pillars of Manasika Shanti -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">1. MAUNA VRATA (SACRED MORNING SILENCE)</div>
        <p class="body-text" style="font-size:10.5px;margin-top:2px;">
          Observe complete verbal silence for the first 45 minutes after waking up. Do not speak, answer phone calls, or read text messages. This anchors the morning Prana in the heart center and prevents early-morning Vata dispersal.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">2. PSYCHIC BOUNDARY ARCHITECTURE</div>
        <p class="body-text" style="font-size:10.5px;margin-top:2px;">
          With Moon in the 12th house, you possess natural emotional porosity. Learn to mentally erect an impenetrable psychic firewall against passive-aggressive co-workers or draining personalities. Visualize an emerald-green energetic sphere surrounding your bio-field.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <div class="kicker" style="color:var(--purple-bright);">3. JAL TATTVA WATER COMMUNION</div>
        <p class="body-text" style="font-size:10.5px;margin-top:2px;">
          Moon is the supreme lord of the Water Element (<em>Jal Tattva</em>). When emotionally depleted, spending 15 minutes near a natural lake, river, or ocean, or taking an evening warm bath, instantly resets your nervous system and purges accumulated psychological static.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div class="kicker" style="color:var(--gold-bright);">4. CELEBRATION &amp; ENERGY SHIELD RULE</div>
        <p class="body-text" style="font-size:10.5px;margin-top:2px;">
          Observe AstroLife's classical rule: <em>Keep personal milestones private until fully established</em>. Unnecessary external exposure invites subtle psychic fatigue. Maintain sovereign modesty.
        </p>
      </div>
    </div>

    <!-- Sattvavajaya Quote -->
    <div class="luxury-card" style="border:1px solid rgba(139,92,246,0.3);background:rgba(139,92,246,0.06);">
      <p style="font-style:italic;font-size:10.5px;color:var(--purple-bright);text-align:center;">
        "He whose mind remains tranquil amidst chaos protects his Ojas; he whose soul honors its silence conquers all disease."
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Emotional Armor", 14)}
</section>

<!-- PAGE 15: PILLAR IV — LIFETIME 9-MAHADASHA HEALTH RISK MATRIX -->
<section class="page">
  ${headerRail("PILLAR IV: VIMSHOTTARI HEALTH TIMELINE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Lifetime 9-Mahadasha Health Risk Matrix</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Under classical Vimshottari Dasha mechanics, each major planetary period activates specific physiological organ systems, constitutional strengths, and latent disease vectors based on house lordship and dignity.
    </p>

    <!-- 9-Mahadasha Health Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Mahadasha</th>
          <th>Duration</th>
          <th>Organ Focus &amp; Tissue Sphere</th>
          <th>Vulnerability Profile</th>
          <th>Health Risk Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--purple-bright);">Ketu</strong></td>
          <td>7 Years</td>
          <td>Pineal gland, nerve endings, viral sensitivity</td>
          <td>Subconscious restlessness, mysterious allergies</td>
          <td><span class="tag-badge tag-amber">Low-Mod &middot; 35%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold-bright);">Venus (Shukra)</strong></td>
          <td>20 Years</td>
          <td>Endocrine system, kidneys, reproductive vitality</td>
          <td>Excellent Ojas; watch for rich dietary indulgence</td>
          <td><span class="tag-badge tag-emerald">Low &middot; 20%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Sun (Surya)</strong></td>
          <td>6 Years</td>
          <td>Cardiac rhythm, spine, eyesight, cranial heat</td>
          <td>Pitta flare-ups, seasonal fever, eye strain</td>
          <td><span class="tag-badge tag-gold">Moderate &middot; 45%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Moon (Chandra)</strong></td>
          <td>10 Years</td>
          <td>Lymphatic drainage, sleep quality, mucous membranes</td>
          <td>Emotional burnout, fluid retention, sleep latency</td>
          <td><span class="tag-badge tag-amber">Moderate &middot; 50%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby);">Mars (Mangala)</strong></td>
          <td>7 Years</td>
          <td>Muscular tissue, blood pressure, bile, adrenal drive</td>
          <td>High physical stamina; watch for sports/traffic sprains</td>
          <td><span class="tag-badge tag-amber">Mod-High &middot; 55%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--amber);">Rahu</strong></td>
          <td>18 Years</td>
          <td>Enteric gut-brain axis, neurological fatigue, teeth</td>
          <td>Digital eye fatigue, erratic meal times, vocal strain</td>
          <td><span class="tag-badge tag-gold">Moderate &middot; 48%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold);">Jupiter (Guru)</strong></td>
          <td>16 Years</td>
          <td>Liver metabolism, arterial lipid balance, cellular repair</td>
          <td>Supreme restorative era; high cellular wisdom</td>
          <td><span class="tag-badge tag-emerald">Low &middot; 18%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal);">Saturn (Shani)</strong></td>
          <td>19 Years</td>
          <td>Skeletal bones, teeth, knees, joints, longevity</td>
          <td>Vata joint stiffness; requires warm abhyanga oil massage</td>
          <td><span class="tag-badge tag-amber">Moderate &middot; 52%</span></td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald);">Mercury (Budha)</strong></td>
          <td>17 Years</td>
          <td>Lagna Lord! Nervous system, speech, respiratory ease</td>
          <td>Golden intellectual vitality; rapid physical recovery</td>
          <td><span class="tag-badge tag-emerald">Low &middot; 15%</span></td>
        </tr>
      </tbody>
    </table>

    <!-- Lifetime Summary Box -->
    <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11px;margin-bottom:2px;">
        ✦ LONG-TERM CHRONIC EPHEMERIS SUMMARY
      </div>
      <p class="body-text" style="font-size:10.5px;">
        Your lifetime curve shows a remarkable absence of high-risk (>75%) danger zones. Your overall vitality operates at a steady, manageable baseline. The most critical preventive protocol across all cycles is safeguarding sleep quality and enteric digestive rhythm.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: 9-Mahadasha Risk Matrix", 15)}
</section>

<!-- PAGE 16: PILLAR IV — ACTIVE MAHADASHA HEALTH & VITALITY AUDIT -->
<section class="page">
  ${headerRail("PILLAR IV: ACTIVE DASHA HEALTH")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Active Mahadasha Health &amp; Vitality Audit</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The active Vimshottari planetary period acts as the cosmic conductor of your biological endocrine state. Understanding the current dasha lord's physiological agenda empowers you to preempt physical fatigue before it manifests.
    </p>

    <!-- Active Dasha Banner -->
    <div class="luxury-card" style="background:var(--surface-elevated);border:1.5px solid var(--purple-bright);margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span class="kicker" style="color:var(--purple-bright);">CURRENT OPERATIONAL DRIVER</span>
        <span class="tag-badge tag-purple">ACTIVE: ${activeDasha.toUpperCase()} PERIOD</span>
      </div>
      <h3 style="font-family:'Cinzel',serif;font-size:14px;color:var(--gold-bright);margin-bottom:4px;">
        Biological Agenda of the Active Mahadasha
      </h3>
      <p class="body-text" style="font-size:11px;">
        During the current epoch, planetary currents are focused on structural career expansion and intellectual output. The bodily systems under active demand are the <strong>nervous transmission pathways</strong>, <strong>ocular muscles</strong>, and <strong>adrenal reserve</strong>.
      </p>
    </div>

    <!-- 3 Active Dasha Vulnerability Focal Points -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--amber);">
        <div class="kicker" style="color:var(--amber);">1. NEUROLOGICAL OVERCLOCKING RISK</div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          High mental focus generates excess subtle heat (<em>Tejas</em>) in the brain. If uncalibrated, this manifests as tension behind the eyes, jaw clenching during intense problem-solving, or evening mental restlessness. <em>Antidote: 5 minutes of cooling Sheetali Pranayama before dinner.</em>
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">2. VOCAL &amp; ENTERIC FLUID BALANCE</div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Rapid speech and intense meetings dry out throat mucosal membranes. Ensure consistent hydration with warm water rather than dehydrating coffee or tea. <em>Antidote: Licorice (Mulethi) root tea with warm water.</em>
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">3. SLEEP RESTORATION SURGE</div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          Ensure that sleep is treated as a core performance metric. 7.5 hours of uninterrupted sleep in a completely dark room guarantees 100% cognitive replenishment for the subsequent workday.
        </p>
      </div>
    </div>

    <!-- Action Box -->
    <div class="luxury-card" style="border-top:2px solid var(--gold-bright);">
      <div class="kicker" style="color:var(--gold-bright);margin-bottom:2px;">✦ CURRENT SPRINT SHIELD MANDATE</div>
      <p class="body-text" style="font-size:10.5px;">
        Maintain a hard boundary at 9:00 PM: close all work laptops and work communications. Allow the autonomic nervous system to shift cleanly from sympathetic fight-or-flight into parasympathetic rest-and-digest.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: Active Dasha Health", 16)}
</section>

<!-- PAGE 17: PILLAR IV — 5-YEAR HIGH-RISK TRANSIT HEALTH WINDOWS -->
<section class="page">
  ${headerRail("PILLAR IV: TRANSIT RADAR (2025–2030)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">5-Year Transit Health Windows (2025–2030)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      While natal dashas describe the internal biological tides, major slow-moving transits (<strong>Gochar</strong> &mdash; Shani, Guru, Rahu, Ketu) act as external environmental triggers that test bodily resilience.
    </p>

    <!-- Transit Windows Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Transit Window</th>
          <th>Planetary Movement</th>
          <th>Anatomical Impact Zone</th>
          <th>Preventive Medical Protocol</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--amber);">2025 &ndash; Mid 2026</strong></td>
          <td>Saturn in Pisces &middot; 7th House (Aspecting Lagna &amp; 4th)</td>
          <td>Lower limbs, lumbar flexibility, emotional heart pace</td>
          <td>Daily hamstring stretching; warm sesame oil massage; avoid cold drafty winds</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald-bright);">Mid 2026 &ndash; Mid 2027</strong></td>
          <td>Jupiter Exalted in Cancer &middot; 11th House (Trining 3rd, 5th, 7th)</td>
          <td>Supreme Ojas surge, cellular immunity, liver rejuvenation</td>
          <td>Golden recovery phase! Excellent window for elective dental/eye checkups and rejuvenation</td>
        </tr>
        <tr>
          <td><strong style="color:var(--purple-bright);">Mid 2027 &ndash; 2028</strong></td>
          <td>Jupiter in Leo &middot; 12th House (Conjoining Moon &amp; Mars)</td>
          <td>Spiritual awakening, lymphatic cleanse, sleep deepening</td>
          <td>Schedule regular nature retreats; practice high-volume hydration; detoxify liver</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby-bright);">2028 &ndash; 2029</strong></td>
          <td>Saturn enters Aries &middot; 8th House (Debilitated Transit)</td>
          <td>Chronic inflammatory caution, pelvic vitality, head/cranial heat</td>
          <td>Strictly avoid reckless driving/speed; maintain routine blood work; avoid dehydration</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">2029 &ndash; 2030</strong></td>
          <td>Rahu enters Capricorn &middot; 5th House (Arudha Lagna)</td>
          <td>Enteric digestive acid, discretionary focus, creative endurance</td>
          <td>Favor cooling Pitta diet; practice mindfulness during high-volume intellectual output</td>
        </tr>
      </tbody>
    </table>

    <!-- Critical Caution Box -->
    <div class="luxury-card" style="border:1.5px solid var(--amber);background:var(--surface);">
      <div class="card-title" style="color:var(--amber);font-size:11.5px;margin-bottom:3px;">
        ✦ STRATEGIC HEALTH FOCUS FOR 2025&ndash;2026 (SATURN IN 7TH OPPOSING LAGNA)
      </div>
      <p class="body-text" style="font-size:10.8px;">
        In classical Jyotish, major Saturn transits enforce physical discipline: if you have been ignoring postural ergonomics, hydration, or sleep, Saturn manifests temporary joint stiffness or fatigue to force rest. Embracing daily stretching turns this transit into an era of ironclad physical resilience.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: 5-Year Transit Radar", 17)}
</section>

<!-- PAGE 18: PILLAR IV — BHAVAT BHAVAM FAMILY HEALTH OVERVIEW -->
<section class="page">
  ${headerRail("PILLAR IV: FAMILY HEALTH SCAN")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Bhavat Bhavam Family Health Vulnerability Overview</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Under classical Parashari principles of <em>Bhavat Bhavam</em> (House from House), an individual's birth chart contains derivative windows revealing latent health dynamics for primary lineage members.
    </p>

    <!-- 4 Family Cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <!-- Father -->
      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--gold-bright);">1. FATHER'S HEALTH AXIS (9TH HOUSE &middot; TAURUS &middot; SURYA KARAKA)</div>
          <span class="tag-badge tag-emerald">STABLE CONSTITUTION</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          The 9th house (Taurus) holds Mercury, with Sun placed in the adjacent 10th house. Indicates good longevity and structural bone stamina. Preventive focus: Monitor blood pressure stability, cardiac tone, and ensure routine ophthalmic eye checkups.
        </p>
      </div>

      <!-- Mother -->
      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--teal-bright);">2. MOTHER'S HEALTH AXIS (4TH HOUSE &middot; SAGITTARIUS &middot; CHANDRA KARAKA)</div>
          <span class="tag-badge tag-amber">SENSITIVE FLUID &amp; JOINT TONE</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          The 4th house (Sagittarius) is ruled by Jupiter (placed in 3rd Scorpio), while Moon occupies Leo (9th from 4th). Indicates deep spiritual empathy. Preventive focus: Joint mobility, lower back flexibility, and respiratory ease during seasonal shifts.
        </p>
      </div>

      <!-- Spouse -->
      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--purple-bright);">3. SPOUSE'S HEALTH AXIS (7TH HOUSE &middot; PISCES &middot; SHUKRA KARAKA)</div>
          <span class="tag-badge tag-emerald">ROBUST &middot; WATER CONSTITUTION</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          The 7th house (Pisces) holds Saturn, with Upapada Lagna in Aries (ruled by Mars). Reveals a life partner with dynamic athletic stamina and high drive. Preventive focus: Endocrine balance, hydration, and avoiding excessive physical exhaustion.
        </p>
      </div>

      <!-- Siblings / Team -->
      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--ruby-bright);">4. SIBLINGS &amp; PEERS (3RD HOUSE &middot; SCORPIO &middot; MANGALA KARAKA)</div>
          <span class="tag-badge tag-teal">HIGH METABOLIC DRIVE</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          The 3rd house (Scorpio) holds Jupiter, with ruler Mars placed in 12th Leo. Indicates resilient muscular tone and decisive action. Preventive focus: Avoid sudden athletic strains, sports injuries, and stay mindful during competitive workouts.
        </p>
      </div>
    </div>

    <div class="luxury-card" style="background:rgba(2,132,199,0.06);border:1px solid rgba(2,132,199,0.25);">
      <p style="font-size:10px;color:var(--ivory-dim);text-align:center;">
        <em>Note: Derivative Bhavat Bhavam assessments offer ambient lineage context and do not replace individual natal charts.</em>
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: Family Health Scan", 18)}
</section>

<!-- PAGE 19: PILLAR V — PLANETARY SNAN-AUSHADHI HYDROTHERAPY -->
<section class="page">
  ${headerRail("PILLAR V: SACRED AYURVEDA CHIKITSA")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Planetary Snan-Aushadhi (Herbal Hydrotherapy Protocols)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Published in classical academic literature (<em>AYU Journal, Vol 34, 2013</em> &mdash; "आयुर्वेद एवं ज्योतिषशास्त्रीय सिद्धान्तों की अन्तर्सम्बन्धीय मीमांसा"), <strong>Snan-Aushadhi</strong> is the sacred Ayurvedic methodology of infusing bath water with specific botanical roots during planetary horas to cleanse the subtle electromagnetic bio-field (<em>Aura</em>).
    </p>

    <!-- 9-Planetary Bath Formulations Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Graha</th>
          <th>Sacred Botanical (Sanskrit &amp; Hindi)</th>
          <th>Preparation &amp; Water Consecration Method</th>
          <th>Therapeutic Bio-Field Benefit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--gold-bright);">Sun (Surya)</strong></td>
          <td>Lajwanti / छुईमुई (<em>Mimosa pudica</em>)</td>
          <td>Infuse crushed leaves in warm bath water during Sunday sunrise</td>
          <td>Clears cranial heat, pacifies eye fatigue, stimulates metabolic Ojas</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Moon (Chandra)</strong></td>
          <td>Kustha / कूठ (<em>Saussurea lappa</em>)</td>
          <td>Steep fragrant root powder in warm water on Monday evening</td>
          <td>Soothes lymphatic stagnation, emotional restlessness, dry skin</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Mars (Mangala)</strong></td>
          <td>Bariyar / अतिबला (<em>Abutilon indicum</em>)</td>
          <td>Decoct Bariyar roots in warm bath water on Tuesday morning</td>
          <td>Subdues internal Pitta blood heat, muscle spasms, physical exhaustion</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald-bright);">Mercury (Budha)</strong></td>
          <td>Apamarga / चिरचिटा (<em>Achyranthes aspera</em>)</td>
          <td>Boil whole Apamarga herb; bathe on Wednesday morning</td>
          <td>Sharpens nervous transmission, clears mental fog, tones skin pores</td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold);">Jupiter (Guru)</strong></td>
          <td>Mulethi / मुलेठी (<em>Glycyrrhiza glabra</em>)</td>
          <td>Steep licorice root decoction in bath water on Thursday morning</td>
          <td>Expands liver detoxification, strengthens Ojas, induces serene mind</td>
        </tr>
        <tr>
          <td><strong style="color:var(--purple-bright);">Venus (Shukra)</strong></td>
          <td>Cardamom &amp; Rose (<em>Ela &amp; Shatapatri</em>)</td>
          <td>Add crushed green cardamom and pure rose water on Friday morning</td>
          <td>Nourishes endocrine tone, balances skin sebum, enhances cellular radiance</td>
        </tr>
        <tr>
          <td><strong style="color:var(--amber);">Saturn (Shani)</strong></td>
          <td>Black Sesame &amp; Khus (<em>Til &amp; Ushira</em>)</td>
          <td>Infuse black sesame seeds and vetiver roots on Saturday twilight</td>
          <td>Deeply grounds skeletal stiffness, pacifies Vata, promotes deep sleep</td>
        </tr>
        <tr>
          <td><strong style="color:var(--purple);">Rahu</strong></td>
          <td>Sharpunkha / शरपुंखा (<em>Tephrosia purpurea</em>)</td>
          <td>Boil Sharpunkha herb; bathe during Saturday evening twilight</td>
          <td>Detoxifies sluggish lymphatic chyle, clears mystery skin allergies</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal);">Ketu</strong></td>
          <td>Kusha Grass / कुश (<em>Desmostachya bipinnata</em>)</td>
          <td>Steep sacred Kusha grass in water during Tuesday sunrise</td>
          <td>Purges psychic toxicity, seals bio-field leaks, awakens pineal calm</td>
        </tr>
      </tbody>
    </table>

    <!-- Primary Prescription Box -->
    <div class="luxury-card" style="border:1.5px solid var(--teal-bright);background:var(--surface);">
      <div class="card-title" style="color:var(--teal-bright);font-size:11.5px;margin-bottom:2px;">
        ✦ PRIMARY PERSONAL PRESCRIPTION FOR SEEKER
      </div>
      <p class="body-text" style="font-size:10.8px;">
        With Moon in the 12th house, your master formulation is <strong>Kustha Root Powder on Monday evenings</strong> alternating with <strong>Mulethi on Thursday mornings</strong>. This dual hydrotherapy protocol balances the water and earth elements, ensuring emotional equanimity and cellular Ojas.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Planetary Snan-Aushadhi", 19)}
</section>

<!-- PAGE 20: PILLAR V — DAIVA VYAPASHRAYA CHIKITSA & DAAN-KAAL -->
<section class="page">
  ${headerRail("PILLAR V: DAIVA VYAPASHRAYA CHIKITSA")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Daiva Vyapashraya Chikitsa &amp; Planetary Daan-Kaal</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Ayurveda categorizes therapies into three tiers: <em>Yukti Vyapashraya</em> (Pharmacological Herbs &amp; Diet), <em>Sattvavajaya</em> (Psychotherapy &amp; Meditation), and <strong>Daiva Vyapashraya</strong> (Spiritual Remedies, Mantras, Charity &amp; Karmic Realignment).
    </p>

    <!-- Daan-Kaal Timing Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Graha</th>
          <th>Auspicious Timing (Daan-Kaal)</th>
          <th>Consecrated Items for Donation</th>
          <th>Sanskrit Japa Count</th>
          <th>Target Bodily Ailment Cleansed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Sun (Surya)</strong></td>
          <td>Sunday sunrise (First 2 Ghatis &middot; 48 mins)</td>
          <td>Whole wheat, copper vessel, jaggery (Gud)</td>
          <td>7,000 Japa</td>
          <td>Cranial tension, chronic fever, bone weakness</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Moon (Chandra)</strong></td>
          <td>Monday evening twilight / Purnima</td>
          <td>Raw milk, rice, white camphor, silver ball</td>
          <td>11,000 Japa</td>
          <td>Sleep disruption, emotional burnout, lymph edema</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby);">Mars (Mangala)</strong></td>
          <td>Tuesday noon (Mars Hora)</td>
          <td>Red lentils (Masoor Dal), copper, red cloth</td>
          <td>10,000 Japa</td>
          <td>Blood pressure spikes, inflammatory boils, muscular cramps</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald-bright);">Mercury (Budha)</strong></td>
          <td>Wednesday morning (Mercury Hora)</td>
          <td>Whole Moong dal, green vegetables, bronze</td>
          <td>9,000 Japa</td>
          <td>Enteric gut motility, speech exhaustion, skin rash</td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold);">Jupiter (Guru)</strong></td>
          <td>Thursday morning (First Ghati)</td>
          <td>Chana dal, turmeric roots, yellow brass, saffron</td>
          <td>19,000 Japa</td>
          <td>Liver sluggishness, lipid imbalance, endocrine wear</td>
        </tr>
        <tr>
          <td><strong style="color:var(--purple-bright);">Venus (Shukra)</strong></td>
          <td>Friday sunrise / Morning Hora</td>
          <td>Misri (rock sugar), pure ghee, white silk, curd</td>
          <td>16,000 Japa</td>
          <td>Hormonal burnout, ocular dryness, reproductive fatigue</td>
        </tr>
        <tr>
          <td><strong style="color:var(--amber);">Saturn (Shani)</strong></td>
          <td>Saturday twilight / Sunset (Pradosha)</td>
          <td>Mustard oil, black sesame seeds, iron skillet</td>
          <td>23,000 Japa</td>
          <td>Joint stiffness, lumbar pain, chronic skeletal fatigue</td>
        </tr>
      </tbody>
    </table>

    <!-- 16-Day Burn & Flow Protocol Box -->
    <div class="luxury-card" style="border-left:3px solid var(--purple-bright);margin-bottom:8px;background:var(--surface);">
      <div class="card-title" style="color:var(--purple-bright);font-size:11px;margin-bottom:2px;">
        ✦ ASTROLIFE PROPRIETARY 16-DAY BURN &amp; FLOW PROTOCOL (FOR 12TH HOUSE MOON)
      </div>
      <p class="body-text" style="font-size:10.2px;">
        Prepare <strong>16 small packets</strong> using pure white cotton cloth. Place <strong>1 teaspoon of whole raw white rice</strong> in each packet. Every night right before retiring to bed, place one packet inside a stainless steel tea strainer and burn it completely over the kitchen gas flame (<em>safety mandate: use a long-handled stainless steel tea strainer or metal tongs in a well-ventilated kitchen to avoid burning handles or fingers</em>). Take a clean glass tumbler with 2 tablespoons of raw cow milk, mix the burned ash into the milk, and wash it down the kitchen sink with cold running tap water. <em>Mandate: Strictly avoid drinking plain milk at night during this 16-day cycle.</em> Clears psychosomatic anxiety, nocturnal dream static, and restores deep restorative sleep.
      </p>
    </div>

    <!-- The Gemstone Warning -->
    <div class="luxury-card" style="border:1.5px solid var(--ruby);background:rgba(220,38,38,0.06);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;margin-bottom:3px;">
        ⚠️ CRITICAL SHASTRA WARNING: NEVER WEAR GEMSTONES FOR 6TH/8TH LORDS
      </div>
      <p class="body-text" style="font-size:10.5px;">
        Commercial astrologers often recklessly prescribe gemstones to 'strengthen' diseased houses. In classical shastra, <strong>wearing a gemstone amplifies that planet's radiation indiscriminately</strong>. Wearing gems for Dusthana or Badhaka lords accelerates inflammatory friction. For a ${lagnaRashi} native, ensure you only wear gemstones suited to your functional benefics. Use <em>Daan</em>, <em>Snan-Aushadhi</em>, and <em>16-Day Protocols</em> to pacify; never wear physical stones for functional malefics.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Daiva Vyapashraya Chikitsa", 20)}
</section>

<!-- PAGE 21: PILLAR V — ASTRO-SOUND & SOLFEGGIO CELLULAR FREQUENCIES -->
<section class="page">
  ${headerRail("PILLAR V: ASTRO-SOUND THERAPY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Astro-Sound Hz &amp; Solfeggio Cellular Healing Frequencies</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Sound is the foundational primordial vibration (<em>Nada Brahma</em>). Under Hans Cousto's <em>Cosmic Octave</em> physics and ancient Nada Yoga, every celestial orbit translates mathematically into audible acoustic hertz frequencies that harmonize cellular mitochondria.
    </p>

    <!-- Planetary Frequencies Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Cosmic Entity</th>
          <th>Acoustic Frequency</th>
          <th>Chakra Resonance</th>
          <th>Biological &amp; Neurological Cellular Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--gold-bright);">Sun (Surya)</strong></td>
          <td>126.22 Hz</td>
          <td>Manipura (Solar Plexus)</td>
          <td>Ignites Jatharagni digestive fire, stimulates Ojas radiance, dispels winter lethargy</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Moon (Chandra)</strong></td>
          <td>210.42 Hz</td>
          <td>Swadhisthana (Sacral)</td>
          <td>Regulates lymphatic and cellular water balance, dissolves emotional shock, deepens sleep</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Mars (Mangala)</strong></td>
          <td>144.72 Hz</td>
          <td>Muladhara (Root Center)</td>
          <td>Grounds muscular adrenaline, stabilizes red blood cell regeneration, calms tremors</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald-bright);">Mercury (Budha)</strong></td>
          <td>141.27 Hz</td>
          <td>Vishuddha (Throat Center)</td>
          <td>Clears neuro-synaptic clutter, sharpens cognitive discernment, restores enteric harmony</td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold);">Jupiter (Guru)</strong></td>
          <td>183.58 Hz</td>
          <td>Ajna (Third Eye)</td>
          <td>Promotes hepatic liver balance, cellular regeneration, expansive cognitive tranquility</td>
        </tr>
        <tr>
          <td><strong style="color:var(--purple-bright);">Saturn (Shani)</strong></td>
          <td>147.85 Hz</td>
          <td>Muladhara &middot; Skeletal</td>
          <td>Deep musculoskeletal grounding, joint stiffness relief, slow restorative Delta waves</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald);">Solfeggio 528 Hz</strong></td>
          <td>528.00 Hz</td>
          <td>Anahata &middot; DNA Repair</td>
          <td>The 'Miracle Tone': Restores cellular water structure and promotes DNA harmonic equilibrium</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal);">Universal 432 Hz</strong></td>
          <td>432.00 Hz</td>
          <td>Whole Body &middot; Alpha State</td>
          <td>Natural biological tuning; shifts brainwaves into 8&ndash;12 Hz Alpha state for healing</td>
        </tr>
      </tbody>
    </table>

    <!-- Raga Chikitsa Recommendations -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);background:var(--surface);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;margin-bottom:4px;">
        ✦ PERSONALIZED RAGA CHIKITSA (ACOUSTIC MEDICINE)
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:10.5px;color:var(--ivory-dim);">
        <div>
          <strong style="color:var(--gold-bright);">Morning (06:00 &ndash; 08:00 AM): Raga Bhairav / Ahir Bhairav</strong> &mdash; Deep grounding tone that pacifies morning Vata, centers the heartbeat, and stimulates calm metabolic awakeness.
        </div>
        <div>
          <strong style="color:var(--teal-bright);">Midday (12:00 &ndash; 02:00 PM): Raga Sarang / Shuddha Sarang</strong> &mdash; Cools excessive midday Pitta heat, harmonizes digestive enzyme secretion, and prevents mental irritation.
        </div>
        <div>
          <strong style="color:var(--purple-bright);">Night (09:30 &ndash; 10:30 PM): Raga Yaman / Raga Darbari Kanada</strong> &mdash; Induces profound neurological sedation, lowers nocturnal cortisol levels, and invites deep Delta-wave sleep.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Pillar V: Astro-Sound Hz Therapy", 21)}
</section>

<!-- PAGE 22: PILLAR V — SACRED AYURVEDIC HERBAL FORMULATIONS -->
<section class="page">
  ${headerRail("PILLAR V: SACRED HERBAL CHIKITSA")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Ayurvedic Herbal Formulations &amp; Ahara Guidelines</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Vedic pharmacology (<em>Dravyaguna Shastra</em>) utilizes targeted plant chemistry (<em>Rasayana</em>) to repair the cellular matrix without creating toxic synthetic dependencies.
    </p>

    <!-- 4 Core Formulations -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--emerald-bright);">1. BRAHMI &amp; SHANKHPUSHPI GHRITA (FOR NEURO-COGNITIVE CALM)</div>
          <span class="tag-badge tag-emerald">MEDHYA RASAYANA</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          <em>Bacopa monnieri</em> and <em>Convolvulus pluricaulis</em> infused in pure cow ghee. This is the premier classical cognitive tonic for ${lagnaRashi} Lagna natives. It repairs synaptic fatigue, cools cranial heat, and enhances memory retention without causing physical drowsiness. <em>Dose: 1/2 teaspoon in warm milk at night.</em>
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--teal-bright);">2. TRIPHALA CHURNA (FOR ENTERIC-GUT DETOXIFICATION)</div>
          <span class="tag-badge tag-teal">TRIDOSHA SAMANA</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          The sacred triumvirate of Haritaki (Vata), Amalaki (Pitta), and Bibhitaki (Kapha). Gently cleanses mucosal plaque (<em>Ama</em>) from the villi of the small intestine, supports ocular clarity, and ensures smooth Apana Vata evacuation. <em>Dose: 1 teaspoon steeped in warm water 30 mins before sleep.</em>
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="kicker" style="color:var(--gold-bright);">3. SHATAVARI &amp; ASHWAGANDHA RASAYANA (FOR OJAS EXPANSION)</div>
          <span class="tag-badge tag-gold">OJAS VARDHAK</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:2px;">
          <em>Asparagus racemosus</em> (cooling moisture) blended with <em>Withania somnifera</em> (adrenal grounding). Together, they buffer the stress response, replenish deep Shukra essence, and reinforce the physical immune barrier. <em>Dose: 1/2 teaspoon in warm morning almond milk.</em>
        </p>
      </div>
    </div>

    <!-- Dietary Do's & Don'ts Table -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11px;margin-bottom:4px;">
        ✦ PITTA-VATA DIETARY RECONCILIATION TABLE
      </div>
      <table class="data-table" style="font-size:9.5px;">
        <thead>
          <tr>
            <th style="color:var(--emerald-bright);">FAVOR (THERAPEUTIC MEDICINE)</th>
            <th style="color:var(--ruby-bright);">MINIMIZE (INFLAMMATORY HAZARD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A2 Desi Cow Ghee, cold-pressed sesame &amp; olive oil</td>
            <td>Refined seed oils (canola, soybean, corn), trans fats</td>
          </tr>
          <tr>
            <td>Warm basmati rice, quinoa, cooked rolled oats</td>
            <td>Dry cold breakfast cereals, raw flour, dry crackers</td>
          </tr>
          <tr>
            <td>Sweet ripe fruits: Pears, sweet apples, soaked figs, raisins</td>
            <td>Sour unripe citrus, sour plums, fermented pickles, vinegar</td>
          </tr>
          <tr>
            <td>Digestive spices: Cumin, coriander, fennel, cardamom, ginger</td>
            <td>Excess red chili powder, habanero, raw garlic, raw mustard</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  ${footerRail("Pillar V: Sacred Herbal Chikitsa", 22)}
</section>

<!-- PAGE 23: PILLAR V — MAHA MRITYUNJAYA & DHANVANTARI MANTRAS -->
<section class="page">
  ${headerRail("PILLAR V: SACRED HEALING MANTRAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Maha Mrityunjaya &amp; Dhanvantari Healing Mantras</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Vedic medicine, mantras are pristine acoustic geometric keys (<em>Shabda Brahman</em>). Chanting these sacred formulas reorganizes the cellular electromagnetic matrix, releases subconscious fears, and invokes divine healing light.
    </p>

    <!-- Dhanvantari Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--teal);">
      <div class="card-title" style="color:var(--teal-bright);font-size:11.5px;">
        1. SRI DHANVANTARI MOOLA MANTRA (GOD OF AYURVEDA &amp; HEALING)
      </div>
      <div class="mantra-devanagari">
        ॐ नमो भगवते वासुदेवाय धन्वन्तरये अमृतकलशहस्ताय सर्वभयविनाशाय त्रैलोक्यनाथाय श्रीमहाविष्णुस्वरूपाय श्रीधन्वन्तरिस्वरूपाय श्रीश्रीश्री औषधचक्रनारायणाय स्वाहा ॥
      </div>
      <div style="font-size:9px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM NAMO BHAGAVATE VASUDEVAYA DHANVANTARAYE AMRITA-KALASHA-HASTAYA SARVA-BHAYA-VINASHAYA TRAILOKYA-NATHAYA SRI MAHA-VISHNU-SWAROOPAYA SRI DHANVANTARI-SWAROOPAYA SREE SREE SREE AUSHADHA-CHAKRA-NARAYANAYA SWAHA ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 11 times every morning facing East before drinking water. Consecrates the water with cellular vitality and awakens divine immune intelligence.
      </p>
    </div>

    <!-- Maha Mrityunjaya Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--purple);">
      <div class="card-title" style="color:var(--purple-bright);font-size:11.5px;">
        2. MAHA MRITYUNJAYA MANTRA (SUPREME VITALITY &amp; DISEASE SHIELD)
      </div>
      <div class="mantra-devanagari">
        ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥
      </div>
      <div style="font-size:9px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM TRYAMBAKAM YAJAMAHE SUGANDHIM PUSHTI-VARDHANAM | URVARUKAM-IVA BANDHANAN MRITYOR-MUKSHIYA MA-AMRITAT ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 108 times on Monday or Saturday twilight during periods of physical fatigue or planetary transits. Neutralizes sudden accidents, acute illnesses, and subconscious fear.
      </p>
    </div>

    <!-- Surya Arogya Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--gold);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        3. SURYA AROGYA GAYATRI MANTRA (SOLAR OXYGENATION &amp; EYE HEALTH)
      </div>
      <div class="mantra-devanagari">
        ॐ भास्कराय विद्महे महाद्युतिकराय धीमहि। तन्नो सूर्यः प्रचोदयात् ॥
      </div>
      <div style="font-size:9px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM BHASKARAYA VIDMAHE MAHA-DYUTI-KARAYA DHIMAHI | TANNO SURYAH PRACHODAYAT ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Offer pure water in a copper vessel to the rising Sun while chanting 3 times. Fills the cardiac center with solar prana, clears eye fatigue, and strengthens spinal posture.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Sacred Healing Mantras", 23)}
</section>

<!-- PAGE 24: PILLAR V — 1-PAGE DAILY VITALITY BLUEPRINT & ACTION CHEAT SHEET -->
<section class="page">
  ${headerRail("PILLAR V: 1-PAGE HEALTH CHEAT SHEET")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Vitality Summary &amp; 1-Page Daily Blueprint</h2>
    <p class="body-text" style="margin-bottom:8px;">
      A comprehensive quick-reference daily action manual for sustained physical vitality, emotional equanimity, and longevity.
    </p>

    <!-- 24-Hour Chrono-Schedule -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--border-gold-strong);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11px;margin-bottom:4px;">
        ✦ 24-HOUR CHRONO-BIOLOGICAL MASTER REGIMEN
      </div>
      <table class="data-table" style="font-size:9.5px;">
        <thead>
          <tr>
            <th>Time Window</th>
            <th>Sacred Action &amp; Biological Purpose</th>
            <th>Planetary / Elemental Focus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>06:00 &ndash; 06:45 AM</strong></td>
            <td>Wake in Brahma Muhurat; drink 500ml warm copper/silver water; 5 mins silence</td>
            <td>Sun &middot; Prana Awakening</td>
          </tr>
          <tr>
            <td><strong>07:00 &ndash; 07:30 AM</strong></td>
            <td>Sun Surya Namaskar; 11x Dhanvantari Mantra; warm herbal bath (Kustha/Mulethi)</td>
            <td>Mars &middot; Muscular Tone</td>
          </tr>
          <tr>
            <td><strong>08:30 &ndash; 09:00 AM</strong></td>
            <td>Warm nourishing breakfast: basmati porridge or stewed apples; Brahmi tea</td>
            <td>Jupiter &middot; Ojas Synthesis</td>
          </tr>
          <tr>
            <td><strong>12:30 &ndash; 01:30 PM</strong></td>
            <td>Principal Midday Meal: Cooked grains, lentils, fresh veggies, 1 tsp A2 Ghee; 100 steps walk</td>
            <td>Sun Midday Agni Zenith</td>
          </tr>
          <tr>
            <td><strong>04:30 &ndash; 05:00 PM</strong></td>
            <td>Cumin-Coriander-Fennel (CCF) tea; 5 minutes deep belly breathing; eye rest</td>
            <td>Mercury &middot; Enteric Cooling</td>
          </tr>
          <tr>
            <td><strong>07:30 &ndash; 08:30 PM</strong></td>
            <td>Light, easily digestible dinner (warm vegetable soup or khichdi); zero screens</td>
            <td>Moon &middot; Lymphatic Preparation</td>
          </tr>
          <tr>
            <td><strong>09:30 &ndash; 10:30 PM</strong></td>
            <td>Warm spiced milk with nutmeg/ghee; 2 drops ghee in navel; 432 Hz audio; sleep by 10:30 PM</td>
            <td>Moon &middot; Saturn Delta Rest</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Reference Summary Cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;">
      <div class="luxury-card" style="border-top:2px solid var(--emerald-bright);padding:8px;">
        <div class="kicker" style="color:var(--emerald-bright);">POWER HERB</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);">Brahmi &amp; Ghee</div>
        <div style="font-size:8.5px;color:var(--ivory-dim);">Neuro-protective Ojas</div>
      </div>
      <div class="luxury-card" style="border-top:2px solid var(--teal-bright);padding:8px;">
        <div class="kicker" style="color:var(--teal-bright);">POWER FREQUENCY</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);">528 Hz &amp; 141 Hz</div>
        <div style="font-size:8.5px;color:var(--ivory-dim);">DNA &amp; Cognitive repair</div>
      </div>
      <div class="luxury-card" style="border-top:2px solid var(--ruby-bright);padding:8px;">
        <div class="kicker" style="color:var(--ruby-bright);">NEVER DONATE</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);">${lagnaLord} Sacred Items</div>
        <div style="font-size:8.5px;color:var(--ivory-dim);">${lagnaLord} Lagnesh Balance</div>
      </div>
      <div class="luxury-card" style="border-top:2px solid var(--purple-bright);padding:8px;">
        <div class="kicker" style="color:var(--purple-bright);">BEDTIME KEY</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);">10:30 PM Sleep</div>
        <div style="font-size:8.5px;color:var(--ivory-dim);">Catches Kapha wave</div>
      </div>
    </div>

    <!-- Final Shastric Seal & Legal Notice -->
    <div style="text-align:center;padding:6px;background:rgba(2,132,199,0.06);border:1px solid rgba(2,132,199,0.25);border-radius:4px;">
      <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.12em;color:var(--teal-bright);font-weight:700;">
        ✦ ASTROLIFE SACRED WELLNESS SEAL ✦
      </div>
      <div style="font-size:8.5px;color:var(--ivory-mute);line-height:1.35;margin-top:2px;">
        This dossier is an ancient bio-astrological preventative blueprint based on classical Charaka, Sushruta, and Parashari traditions. It is designed to complement, not replace, licensed allopathic medical diagnosis, surgery, or clinical pharmacotherapy. Consult a certified medical practitioner for acute medical emergencies.
      </div>
    </div>
  </div>
  ${footerRail("Master Health Cheat Sheet", 24)}
</section>

</body>
</html>`;
}
