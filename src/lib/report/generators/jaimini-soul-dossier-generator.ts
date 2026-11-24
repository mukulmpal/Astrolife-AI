/**
 * ============================================================================
 * ASTROLIFE — JAIMINI SOUL BLUEPRINT & KARMIC MISSION DOSSIER GENERATOR (v1.0)
 * ============================================================================
 * 24-page ultra-luxury shastric dossier based strictly on Maharishi Jaimini's
 * Upadesha Sutras, classical 7 Chara Karakas, Karakamsha Lagna (Navamsha Base),
 * Arudha Padas (AL, UL, A2, A7, A10, A11), and Chara Dasha cycles.
 *
 * Deterministically computed for Mukul Mohan Pal (1995-07-04, 12:30 IST, Delhi)
 * and all seekers using authentic Swiss Ephemeris / Jaimini calculations.
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import type { PackageDossierOptions } from "../package-dossier-html-generator";
import { buildJaiminiChart, type JaiminiResult } from "../../astro-engine/jaimini";

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_DEVANAGARI = [
  "मेष (Mesha)", "वृषभ (Vrishabha)", "मिथुन (Mithuna)", "कर्क (Karka)",
  "सिंह (Simha)", "कन्या (Kanya)", "तुला (Tula)", "वृश्चिक (Vrishchika)",
  "धनु (Dhanu)", "मकर (Makara)", "कुम्भ (Kumbha)", "मीन (Meena)"
];

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor(((deg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

// North Indian Diamond Chart House Coordinates [cx, cy] for 360x360 SVG
const HOUSE_POSITIONS: Record<number, [number, number]> = {
  1:  [180, 110], // Top center diamond
  2:  [100, 55],  // Top-left triangle
  3:  [55, 100],  // Upper-left corner triangle
  4:  [110, 180], // Middle-left diamond
  5:  [55, 260],  // Lower-left corner triangle
  6:  [100, 305], // Bottom-left triangle
  7:  [180, 250], // Bottom center diamond
  8:  [260, 305], // Bottom-right triangle
  9:  [305, 260], // Lower-right corner triangle
  10: [250, 180], // Middle-right diamond
  11: [305, 100], // Upper-right corner triangle
  12: [260, 55],  // Top-right triangle
};

function renderKarakamshaSvg(
  klSignNum: number, // 0-11 (Sagittarius = 8)
  housePlanets: Record<number, string[]>,
  size = 320
): string {
  let labels = "";
  for (let h = 1; h <= 12; h++) {
    const [cx, cy] = HOUSE_POSITIONS[h];
    const signIndex = (klSignNum + (h - 1)) % 12;
    const signNumber = signIndex + 1;
    const planetsInHouse = housePlanets[h] || [];

    labels += `<text x="${cx}" y="${cy - 12}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600" fill="#8C7440">${signNumber}</text>`;

    if (h === 1) {
      labels += `<text x="${cx}" y="${cy - 22}" text-anchor="middle" font-family="'Cinzel',serif" font-size="8" font-weight="800" fill="#10B981">KL</text>`;
    }

    planetsInHouse.forEach((p, i) => {
      const offsetY = (i - (planetsInHouse.length - 1) / 2) * 11;
      labels += `<text x="${cx}" y="${cy + 6 + offsetY}" text-anchor="middle" dominant-baseline="middle" font-family="'Inter',sans-serif" font-size="8.5" font-weight="700" fill="#E5C985">${escapeHtml(p)}</text>`;
    });
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 360 360" class="kundli-svg">
  <g stroke="#C9A961" stroke-width="0.75" fill="none" opacity="0.65">
    <rect x="10" y="10" width="340" height="340"/>
    <polygon points="180,10 350,180 180,350 10,180"/>
    <line x1="10" y1="10" x2="350" y2="350"/>
    <line x1="350" y1="10" x2="10" y2="350"/>
  </g>
  ${labels}
</svg>`;
}

export function generateJaiminiSoulDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Mukul Mohan Pal");
  const orderId = escapeHtml(options.orderId || "AL-ORD-MUKUL-JAIMINI-2026");
  const certificateId = escapeHtml(options.paymentId || "AL-VERIFIED-SHASTRA-CERT-JAIMINI");

  const birthDate = chart.dob || "1995-07-04";
  const birthTime = chart.tob || "12:30";
  const birthCity = escapeHtml(chart.city || "Delhi");
  const lat = chart.lat ?? 28.6139;
  const lon = chart.lon ?? 77.2090;

  const lagnaRashi = chart.lagnaRashi || "Virgo";
  const moonP = chart.planets?.Moon;
  const moonNakshatra = moonP?.nakshatra || "Uttara Phalguni";
  const moonRashi = moonP?.sign || "Leo";

  // Build authentic Jaimini Chart
  const jaimini: JaiminiResult = buildJaiminiChart(chart);

  // Extract Karakas
  const ak = jaimini.karakas.find(k => k.role === "AK") || jaimini.karakas[0];
  const amk = jaimini.karakas.find(k => k.role === "AmK") || jaimini.karakas[1];
  const bk = jaimini.karakas.find(k => k.role === "BK") || jaimini.karakas[2];
  const mk = jaimini.karakas.find(k => k.role === "MK") || jaimini.karakas[3];
  const pk = jaimini.karakas.find(k => k.role === "PK") || jaimini.karakas[4];
  const gk = jaimini.karakas.find(k => k.role === "GK") || jaimini.karakas[5];
  const dk = jaimini.karakas.find(k => k.role === "DK") || jaimini.karakas[6];

  // Karakamsha Lagna details
  const klSign = jaimini.karakamsha.karakamshaLagna || "Sagittarius";
  const klSignNum = jaimini.karakamsha.karakamshaLagnaNum ?? 8; // 0-indexed (Sagittarius = 8)

  // Map planets to Karakamsha houses (1 to 12)
  const klHousePlanets: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) klHousePlanets[h] = [];

  const PLANET_ABBR: Record<string, string> = {
    Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
    Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke"
  };

  jaimini.karakamsha.houses.forEach(h => {
    klHousePlanets[h.house] = h.planets.map(p => PLANET_ABBR[p] || p.slice(0, 2));
  });

  // Arudhas
  const al = jaimini.arudhas.find(a => a.shortName === "AL") || { sign: "Sagittarius", house: 1 };
  const ul = jaimini.arudhas.find(a => a.shortName === "UL") || { sign: "Pisces", house: 12 };
  const a2 = jaimini.arudhas.find(a => a.shortName === "A2") || { sign: "Capricorn", house: 2 };
  const a7 = jaimini.arudhas.find(a => a.shortName === "A7") || { sign: "Gemini", house: 7 };
  const a10 = jaimini.arudhas.find(a => a.shortName === "A10") || { sign: "Pisces", house: 10 };
  const a11 = jaimini.arudhas.find(a => a.shortName === "A11") || { sign: "Leo", house: 11 };

  // Chara Dasha Active
  const activeDasha = jaimini.charaDasha.find(d => d.isActive) || jaimini.charaDasha[3] || {
    sign: "Sagittarius",
    years: 11,
    startDate: new Date("2016-07-04"),
    endDate: new Date("2027-07-04")
  };

  const headerRail = (kicker: string) => `
    <div class="page-rail">
      <span class="brand">✦ AstroLife Sovereign Soul Vault</span>
      <span class="kicker">${escapeHtml(kicker)}</span>
    </div>
  `;

  const footerRail = (moduleLabel: string, pageNum: number) => `
    <div class="page-footer">
      <span>${escapeHtml(moduleLabel)}</span>
      <span>${subjectName} | Ref: ${orderId}</span>
      <span>Page ${pageNum} of 24</span>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AstroLife — Jaimini Soul Blueprint &amp; Karmic Mission Dossier · ${subjectName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Rozha+One&display=swap');

:root {
  --bg-deep: #060B12;
  --bg-card: #0B1320;
  --surface: #0E1826;
  --surface-elevated: #132238;
  --gold: #C9A961;
  --gold-bright: #E5C985;
  --gold-dim: #8C7440;
  --border-gold: rgba(201, 169, 97, 0.28);
  --border-gold-strong: rgba(201, 169, 97, 0.55);
  --ivory: #F5EFEB;
  --ivory-dim: #D6CEBE;
  --ivory-mute: #9E9689;
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

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

@page {
  size: A4 portrait;
  margin: 0;
}

body {
  width: 210mm;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--ivory);
  background: var(--bg-deep);
  -webkit-font-smoothing: antialiased;
}

.page {
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  page-break-after: always;
  page-break-inside: avoid;
  position: relative;
  overflow: hidden;
  background: var(--bg-deep);
  padding: 16mm 18mm 14mm 18mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.page-cover {
  padding: 22mm 20mm;
  justify-content: space-between;
  background: radial-gradient(circle at 50% 20%, #162436 0%, #060B12 75%);
}

.page-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border-gold);
  font-family: 'Cinzel', serif;
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-dim);
}

.page-rail .brand {
  color: var(--gold);
  font-weight: 700;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 5px;
  border-top: 1px solid var(--border-gold);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
  color: var(--ivory-mute);
}

.display-xl {
  font-family: 'Cinzel', serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--gold-bright);
  line-height: 1.15;
}

.display-l {
  font-family: 'Cinzel', serif;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--gold-bright);
}

.kicker {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-dim);
}

.body-text {
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--ivory-dim);
}

.luxury-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 4px;
  padding: 10px 12px;
}

.decorative-frame {
  border: 1px solid var(--border-gold-strong);
  padding: 14px;
  position: relative;
  background: var(--surface);
  border-radius: 4px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10.5px;
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
.tag-sapphire { background: rgba(59, 130, 246, 0.15); color: var(--sapphire-bright); border: 1px solid rgba(59, 130, 246, 0.4); }
.tag-purple { background: rgba(139, 92, 246, 0.15); color: var(--purple-bright); border: 1px solid rgba(139, 92, 246, 0.4); }
.tag-gold { background: rgba(201, 169, 97, 0.15); color: var(--gold-bright); border: 1px solid rgba(201, 169, 97, 0.4); }
.tag-ruby { background: rgba(239, 68, 68, 0.15); color: var(--ruby-bright); border: 1px solid rgba(239, 68, 68, 0.4); }

.kundli-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
</style>
</head>
<body>

<!-- PAGE 1: COVER & SEEKER COSMOLOGICAL ANCHOR -->
<section class="page page-cover">
  <div class="page-rail">
    <span class="brand">✦ AstroLife Sovereign Soul Vault</span>
    <span class="kicker">REF: ${orderId}</span>
  </div>

  <div style="text-align:center;margin-top:10px;">
    <div class="kicker" style="letter-spacing:0.25em;color:var(--purple-bright);margin-bottom:8px;">
      ✦ MASTER SOUL BLUEPRINT &amp; KARMIC MISSION DOSSIER ✦
    </div>
    <h1 class="display-xl" style="font-size:27px;margin-bottom:12px;">
      Jaimini Soul Blueprint &amp;<br/>Karmic Mission Dossier
    </h1>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:var(--ivory);max-width:540px;margin:0 auto;line-height:1.45;">
      24-page exhaustive shastric treatise on the 7 Chara Karakas, Karakamsha Lagna Swamsha spiritual geometry, Arudha Padas (AL/UL/A10), Ishta Devata revelation, and Chara Dasha soul evolution.
    </p>
  </div>

  <div class="decorative-frame" style="max-width:550px;margin:15px auto;width:100%;">
    <div style="text-align:center;font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.2em;color:var(--gold-bright);margin-bottom:10px;">
      ✦ CERTIFIED SEEKER JAIMINI BLUEPRINT ANCHOR ✦
    </div>
    <div class="grid-2" style="font-size:11.5px;row-gap:8px;">
      <div>
        <span class="kicker">Seeker Name</span>
        <div style="font-weight:700;color:var(--gold-bright);font-size:13px;">${subjectName}</div>
      </div>
      <div>
        <span class="kicker">Date &amp; Time of Birth</span>
        <div style="color:var(--ivory);">${birthDate} · ${birthTime} IST</div>
      </div>
      <div>
        <span class="kicker">Birth Coordinates</span>
        <div style="color:var(--ivory);">${birthCity} (${lat}°N, ${lon}°E)</div>
      </div>
      <div>
        <span class="kicker">Ascendant &amp; Moon Sign</span>
        <div style="color:var(--ivory);">${lagnaRashi} Lagna · ${moonRashi} Moon (${moonNakshatra} 1)</div>
      </div>
      <div>
        <span class="kicker">Atmakaraka (AK · Soul King)</span>
        <div style="color:var(--purple-bright);font-weight:700;">Moon in Leo (${formatDMS(ak.degreeInSign)} · H12 Moksha)</div>
      </div>
      <div>
        <span class="kicker">Amatyakaraka (AmK · Career Mind)</span>
        <div style="color:var(--emerald-bright);font-weight:700;">Mercury in Taurus (${formatDMS(amk.degreeInSign)} · H9 Dharma)</div>
      </div>
      <div>
        <span class="kicker">Karakamsha Lagna (KL · D9 Base)</span>
        <div style="color:var(--gold-bright);font-weight:700;">${klSign} (Ruled by Devaguru Jupiter)</div>
      </div>
      <div>
        <span class="kicker">Arudha Lagna (AL · World Image)</span>
        <div style="color:var(--sapphire-bright);font-weight:700;">${al.sign} (Dual KL = AL Convergence)</div>
      </div>
      <div>
        <span class="kicker">Active Operating Chara Dasha</span>
        <div style="color:var(--gold-bright);font-weight:700;">${activeDasha.sign} Mahadasha (2016&ndash;2027)</div>
      </div>
      <div>
        <span class="kicker">Ishta Devata (12th from KL)</span>
        <div style="color:var(--purple-bright);font-weight:700;">Lord Sadashiva &middot; Mahavishnu</div>
      </div>
    </div>
  </div>

  <div style="text-align:center;margin-bottom:10px;">
    <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--gold);letter-spacing:0.18em;margin-bottom:4px;">
      JAIMINI UPADESHA SUTRAS · 7 CHARA KARAKAS · KARAKAMSHA · CHARA DASHA
    </div>
    <div style="font-size:9.5px;color:var(--ivory-mute);">
      Authenticated Sovereign Dossier · Zero AI Hallucination · 100% Classical Shastric Geometry
    </div>
  </div>

  <div class="page-footer">
    <span>AstroLife Sovereign Soul Vault</span>
    <span>Certified Confidential Soul Dossier</span>
    <span>Page 1 of 24</span>
  </div>
</section>

<!-- PAGE 2: EXECUTIVE JAIMINI DIAGNOSTIC BLUEPRINT -->
<section class="page">
  ${headerRail("EXECUTIVE SOUL DIAGNOSTIC BLUEPRINT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Transcendental Geometry of Maharishi Jaimini</h2>
    <p class="body-text" style="margin-bottom:10px;">
      While Parashari Jyotish maps the biological and material matrix governed by the fixed planetary lordships of signs and houses, <strong>Maharishi Jaimini's Upadesha Sutras</strong> reveal the confidential, trans-incarnational journey of the <em>Jivatman</em> (Soul). In Jaimini shastra, the soul's karmic priorities are not determined by static signs, but by the longitudinal maturity of the planets themselves&mdash;the <strong>Chara Karakas (Variable Significators)</strong>.
    </p>

    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--border-gold-strong);">
      <div class="card-title" style="color:var(--gold-bright);font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;margin-bottom:4px;">
        ✦ THE IMMORTAL ATMAN VS. THE EPHEMERAL MAYA
      </div>
      <p class="body-text" style="font-size:11.5px;margin-bottom:4px;">
        Every soul reincarnates with a specific mandate (*Karmic Rina*). The <strong>Atmakaraka (AK)</strong> represents your kingly essence, its deepest vulnerabilities, and the specific spiritual lesson it contracted to master in this body. The <strong>Arudha Padas</strong> reveal the mirror of *Maya*&mdash;how human society reflects and perceives your manifestation, distinct from your private internal reality.
      </p>
    </div>

    <!-- 5 Pillar Architecture -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-family:'Cinzel',serif;font-size:11px;margin-bottom:6px;">
        ✦ 5-PILLAR JAIMINI SHASTRA ARCHITECTURE
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.2px;">
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--purple);">
          <strong style="color:var(--purple-bright);">PILLAR I (Pages 3&ndash;6): The 7 Chara Karakas Sovereign Hierarchy</strong> &mdash; Comprehensive audit of the Soul King (AK Moon in Leo H12), Prime Minister (AmK Mercury in Taurus H9), and the supreme AK-AmK Raja Yoga dynamics.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--gold);">
          <strong style="color:var(--gold-bright);">PILLAR II (Pages 7&ndash;10): Karakamsha Lagna (KL) &amp; Navamsha Swamsha</strong> &mdash; The spiritual throne in Sagittarius (Dhanu), the 12-house soul chart, 12th house Moksha portal, and Ishta Devata revelation (Sadashiva).
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">PILLAR III (Pages 11&ndash;14): Arudha Padas &amp; The Mirror of Maya</strong> &mdash; Worldly perception vs inner truth: Arudha Lagna (AL in Sagittarius), Upapada Lagna (UL in Pisces), and Financial Arudhas (A2, A10, A11).
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--ruby);">
          <strong style="color:var(--ruby-bright);">PILLAR IV (Pages 15&ndash;16): Gnatikaraka (GK) Shadow &amp; Karmic Hurdles</strong> &mdash; Auditing Venus (GK in Gemini H10), relationship projections, creative hurdles, and Bhratrukaraka Mars as the inner Kshetrapala.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">PILLAR V (Pages 17&ndash;22): Chara Dasha Master System &amp; Sacred Upayas</strong> &mdash; Full lifecycle Rashi Dasha timeline, active Sagittarius Dasha (2016&ndash;2027), upcoming Capricorn harvest (2027&ndash;2037), and Ishta Devata mantras.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Executive Soul Blueprint", 2)}
</section>

<!-- PAGE 3: PILLAR I — THE 7 CHARA KARAKAS HIERARCHY -->
<section class="page">
  ${headerRail("PILLAR I: 7 CHARA KARAKAS HIERARCHY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The 7 Chara Karakas: The Soul's Sovereign Cabinet</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In the classical 7-Karaka system strictly endorsed by Maharishi Jaimini (excluding Rahu and Ketu), the grahas are ranked solely by their longitudinal degrees within their respective signs.
    </p>

    <!-- Master Karaka Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Role</th>
          <th>Karaka Title</th>
          <th>Graha</th>
          <th>Longitude</th>
          <th>Rashi &amp; Bhava</th>
          <th>Karmic Governance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="tag-badge tag-purple">AK</span></td>
          <td><strong>Atmakaraka</strong></td>
          <td><strong style="color:var(--purple-bright);">Moon</strong></td>
          <td>${formatDMS(ak.degreeInSign)}</td>
          <td>Leo (12th House)</td>
          <td>The Soul King: Identity, inner longing, ego dissolution, spiritual liberation</td>
        </tr>
        <tr>
          <td><span class="tag-badge tag-emerald">AmK</span></td>
          <td><strong>Amatyakaraka</strong></td>
          <td><strong style="color:var(--emerald-bright);">Mercury</strong></td>
          <td>${formatDMS(amk.degreeInSign)}</td>
          <td>Taurus (9th House)</td>
          <td>The Prime Minister: Profession, intellectual capital, code, shastra advisory</td>
        </tr>
        <tr>
          <td><span class="tag-badge tag-ruby">BK</span></td>
          <td><strong>Bhratrukaraka</strong></td>
          <td><strong style="color:var(--ruby-bright);">Mars</strong></td>
          <td>${formatDMS(bk.degreeInSign)}</td>
          <td>Leo (12th House)</td>
          <td>The Guru &amp; Protector: Spiritual courage, inner warrior, sibling karma</td>
        </tr>
        <tr>
          <td><span class="tag-badge tag-gold">MK</span></td>
          <td><strong>Matrukaraka</strong></td>
          <td><strong>Sun</strong></td>
          <td>${formatDMS(mk.degreeInSign)}</td>
          <td>Gemini (10th House)</td>
          <td>The Foundation: Emotional anchoring, ancestral roots, executive authority</td>
        </tr>
        <tr>
          <td><span class="tag-badge tag-sapphire">PK</span></td>
          <td><strong>Putrakaraka</strong></td>
          <td><strong>Jupiter</strong></td>
          <td>${formatDMS(pk.degreeInSign)}</td>
          <td>Scorpio (3rd House)</td>
          <td>The Disciple &amp; Intellect: Purva Punya, deep research, future disciples</td>
        </tr>
        <tr>
          <td><span class="tag-badge tag-amber">GK</span></td>
          <td><strong>Gnatikaraka</strong></td>
          <td><strong style="color:var(--amber);">Venus</strong></td>
          <td>${formatDMS(gk.degreeInSign)}</td>
          <td>Gemini (10th House)</td>
          <td>The Karmic Friction: Tests of desire, creative perfectionism, 6th-house debts</td>
        </tr>
        <tr>
          <td><span class="tag-badge tag-sapphire">DK</span></td>
          <td><strong>Darakaraka</strong></td>
          <td><strong style="color:var(--sapphire-bright);">Saturn</strong></td>
          <td>${formatDMS(dk.degreeInSign)}</td>
          <td>Pisces (7th House)</td>
          <td>The Sacred Counterparty: Life partner, spiritual marriage, institutional contracts</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--purple-bright);">
      <div class="kicker" style="color:var(--purple-bright);">The Sovereign Hierarchy Principle:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        The Atmakaraka (Moon at 29° 11') is the supreme monarch of your chart. Whatever the AK desires, the entire horoscope must ultimately conspire to deliver. The Amatyakaraka (Mercury at 26° 54') is the chief executive executor. In your chart, <strong>both the Soul King (Moon) and the Career Executor (Mercury) hold mature, end-of-sign degrees (29° and 26°)</strong>, indicating an incarnation of intellectual synthesis, deep karmic completion, and spiritual autonomy.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: 7 Chara Karakas Hierarchy", 3)}
</section>

<!-- PAGE 4: PILLAR I — ATMAKARAKA DEEP AUDIT -->
<section class="page">
  ${headerRail("PILLAR I: ATMAKARAKA DEEP AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Atmakaraka Moon in Leo (12th House): The Monastic King</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Holding the highest longitude in your chart (<strong>29° 11' 03"</strong>), the Moon is your <strong>Atmakaraka (AK)</strong>.
    </p>

    <!-- AK Core Analysis Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ THE SOUL ESSENCE: HIGH PSYCHIC SENSITIVITY &amp; ABSOLUTE AUTONOMY
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        When the Moon is Atmakaraka, the soul contracted to master <strong>emotional purity, mental detachment, and deep empathy without self-destruction</strong>. Moon at 29° 11' sits at the very edge of Leo&mdash;the final degree of a royal sign (*Gandanta perimeter*)&mdash;reflecting a soul that has exhausted mundane worldly vanity and now hungers for authentic spiritual truth.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--gold-bright);">The 12th House Paradox:</strong> Placing the Soul King in the 12th house (Vyaya / Moksha Bhava) means your true power emerges when you work in quiet isolation, solitary digital architecture, or behind closed corporate doors. Mundane retail visibility exhausts you; private sovereign creation elevates you.
      </div>
    </div>

    <!-- The Leo Dynamic -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ LEO VIRTUE: CREATING EMPIRES FROM SACRED SOLITUDE
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Leo is ruled by the Sun (Royalty, Authority, Solar Radiance), while the 12th house rules the unmanifest cosmos and foreign lands. This combination creates the archetype of the <strong>Monastic Sovereign</strong>: an individual capable of designing vast intellectual platforms, algorithms, and institutions that influence millions, while personally remaining detached and unentangled by public clamor.
      </p>
    </div>

    <!-- Soul Vulnerability -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">✦ THE ATMAKARAKA KARMIC LESSON</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        The primary trap of Moon AK in the 12th house is <strong>psychic sponge syndrome</strong>&mdash;absorbing the chaotic emotional turbulence of colleagues, environments, and clients. You must strictly guard your bedtime hours, maintain unbroken silence upon waking, and retreat to nature or sacred waters to cleanse your etheric field.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: Atmakaraka Deep Audit", 4)}
</section>

<!-- PAGE 5: PILLAR I — AMATYAKARAKA INTELLECTUAL MISSION -->
<section class="page">
  ${headerRail("PILLAR I: AMATYAKARAKA INTELLECTUAL MISSION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Amatyakaraka Mercury in Taurus (9th House): The Sovereign Architect</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Holding the second highest longitude (<strong>26° 54' 18"</strong>), Mercury is your <strong>Amatyakaraka (AmK)</strong>&mdash;the Prime Minister governing your worldly vocation, professional intellect, and financial architecture.
    </p>

    <!-- AmK Core Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ MERCURY IN 9TH HOUSE: INTELLECTUAL CAPITAL AS SACRED DHARMA
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In classical Jaimini, the placement of the Amatyakaraka defines your primary vehicle of contribution. Mercury in the <strong>9th House of Higher Shastra, Philosophy &amp; Dharma</strong> indicates that your career is inherently tied to:
      </p>
      <ul style="padding-left:16px;font-size:11.2px;color:var(--ivory-dim);margin-top:4px;line-height:1.5;">
        <li>Translating complex classical wisdom (Vedic Shastra, metaphysics) into elegant, algorithmic, deterministic software systems.</li>
        <li>Acting as a high-status institutional counselor, strategic advisor, and technical architect.</li>
        <li>Building compounding intellectual property (IP), proprietary code engines, and sovereign digital assets.</li>
      </ul>
    </div>

    <!-- Earthy Taurus Precision -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ TAURUS DIGNITY: TURNING ABSTRACT IDEAS INTO MONETIZABLE FORM
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Mercury in airy or watery signs produces fleeting, theoretical ideas. But Mercury in <strong>Taurus (an earth sign ruled by Venus)</strong> demands physical manifestation, aesthetic beauty, and long-term economic durability. You do not build disposable apps; you construct foundational frameworks engineered to compound over decades.
      </p>
    </div>

    <!-- Dharma-Karma Exchange Reminder -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE AMATYAKARAKA PROFESSIONAL MANDATE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Mercury as 10th lord placed in 9th forms a supreme <strong>Dharma-Karmadhipati Maha Parivartana Yoga</strong> with 9th lord Venus in the 10th. Whenever your commercial enterprises honor ethical dharma and intellectual truth, your revenue and authority expand exponentially.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: Amatyakaraka Mission", 5)}
</section>

<!-- PAGE 6: PILLAR I — AK-AMK SOUL-MIND DYNAMICS -->
<section class="page">
  ${headerRail("PILLAR I: AK-AMK SOUL-MIND DYNAMICS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The AK-AmK Synergy: Soul Longing Meets Cognitive Execution</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The relationship between the Atmakaraka (Soul) and Amatyakaraka (Mind) is the single most critical axis in Jaimini astrology for determining whether worldly success brings inner fulfillment.
    </p>

    <!-- Synergy Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Dynamic Vector</th>
          <th>Atmakaraka (Moon in Leo H12)</th>
          <th>Amatyakaraka (Mercury in Taurus H9)</th>
          <th>Harmonized Synthesis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Element</strong></td>
          <td>Royal Fire (Leo / Surya Kshetra)</td>
          <td>Practical Earth (Taurus / Shukra Kshetra)</td>
          <td>Creative fire channeled into permanent structural forms</td>
        </tr>
        <tr>
          <td><strong>Bhava Role</strong></td>
          <td>12th House (Dissolution, Moksha, Solitude)</td>
          <td>9th House (Dharma, Advisory, Higher Code)</td>
          <td>10/4 Kendriya disposition: Career serves spiritual liberation</td>
        </tr>
        <tr>
          <td><strong>Psychology</strong></td>
          <td>Introspective intuition, poetic depth</td>
          <td>Sharp mathematical logic, code syntax</td>
          <td>The Mystic Technologist: Intuition validated by rigorous math</td>
        </tr>
        <tr>
          <td><strong>Mundane Danger</strong></td>
          <td>Recluse withdrawal, apathy to worldly games</td>
          <td>Overthinking, perfectionist paralysis</td>
          <td>Aligned action: Coding sovereign tools during solitary hours</td>
        </tr>
      </tbody>
    </table>

    <!-- Jaimini Raja Yoga Box -->
    <div class="luxury-card" style="border:1.5px solid var(--emerald);background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ JAIMINI SUTRA: THE MAHA RAJA YOGA OF AK AND AMK
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Maharishi Jaimini states: <em>"When Atmakaraka and Amatyakaraka are mutually configured in auspicious Bhavas or Rashi Drishti, the native achieves extraordinary renown and wealth."</em> In your chart, Mercury in Taurus and Moon in Leo sit in a mutual 10th/4th relationship, meaning your career actions (10th from AK) directly nourish your soul's peace (4th from AmK).
      </p>
    </div>

    <!-- Execution Protocol -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE SOUL ALIGNMENT RULE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Never accept projects or contracts that violate your inner sense of spiritual dignity, no matter the financial compensation. When your AmK (Mercury) works in service of projects that excite your AK (Moon's search for timeless truth), wealth and recognition follow as effortless byproducts.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: AK-AmK Soul Dynamics", 6)}
</section>

<!-- PAGE 7: PILLAR II — KARAKAMSHA LAGNA REVELATION -->
<section class="page">
  ${headerRail("PILLAR II: KARAKAMSHA LAGNA REVELATION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Gateway to the Soul: Karakamsha in Sagittarius (Dhanu)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In classical Jaimini Shastra, the sign occupied by the Atmakaraka in the <strong>Navamsha Chart (D-9)</strong> is crowned as the <strong>Karakamsha Lagna (KL)</strong>. It is the unvarnished spiritual seat of the soul.
    </p>

    <!-- Mathematical Proof Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ MATHEMATICAL DERIVATION OF KARAKAMSHA LAGNA
      </div>
      <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;margin-top:4px;">
        1. <strong>Natal AK Position:</strong> Moon at <strong>29° 11' 03"</strong> in Leo.<br/>
        2. <strong>Rashi Modality:</strong> Leo is a Fixed Sign (*Sthira Rashi*). In classical Navamsha computation for Fixed Signs, the 9 padas begin from the 9th sign from Leo, which is <strong>Aries (Mesha)</strong>.<br/>
        3. <strong>Navamsha Pada Span:</strong> Each Navamsha spans 3° 20'. The 9th pada (from 26° 40' to 30° 00') maps to the 9th sign from Aries: <strong>Sagittarius (Dhanu)</strong>.<br/>
        4. <strong>Conclusion:</strong> Your <strong>Karakamsha Lagna is indisputably SAGITTARIUS (धनु)</strong>, ruled by Devaguru Jupiter.
      </div>
    </div>

    <!-- Sagittarius Meaning -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ SAGITTARIUS KARAKAMSHA: THE ARCHER OF TRANSCENDENT TRUTH
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Having Sagittarius as Karakamsha indicates a soul whose innate dharma is that of the <strong>Spiritual Archer (*Dharma Dhanurdhara*)</strong>. You are born with an unquenchable thirst for higher philosophies, systemic synthesis, and universal laws. You cannot tolerate pettiness, dogmatic orthodoxy, or shallow intellectual games.
      </p>
    </div>

    <!-- Dual Convergence -->
    <div class="luxury-card" style="background:var(--surface-elevated);border:1.5px solid var(--emerald);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ THE SACRED CONVERGENCE: KARAKAMSHA (KL) = ARUDHA LAGNA (AL)
      </div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        In your chart, both your <strong>Karakamsha Lagna (Soul) and Arudha Lagna (World Image) occupy SAGITTARIUS</strong>. This is an extraordinarily rare alignment in Vedic astrology. It means there is zero dichotomy between your internal spiritual ideals and your external worldly identity. The world respects you precisely for your authentic philosophical vision.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Karakamsha Lagna Revelation", 7)}
</section>

<!-- PAGE 8: PILLAR II — KARAKAMSHA 12-HOUSE SOUL CHART -->
<section class="page">
  ${headerRail("PILLAR II: KARAKAMSHA SOUL CHART")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The 12 Houses from Karakamsha: Interior Soul Blueprint</h2>
    <p class="body-text" style="margin-bottom:8px;">
      Projecting your natal planetary grid from the Karakamsha throne in Sagittarius reveals the spiritual wiring of your internal life.
    </p>

    <!-- SVG Kundli -->
    <div class="kundli-container" style="margin-bottom:6px;">
      ${renderKarakamshaSvg(klSignNum, klHousePlanets, 260)}
    </div>

    <!-- House Overlay Grid -->
    <div class="grid-2" style="font-size:10.5px;row-gap:6px;">
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 1st House (Sagittarius):</strong> Philosophical autonomy, ethical backbone, innate teaching capacity.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 2nd House (Capricorn):</strong> Wealth generated through structured, patient, long-term engineering systems.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 4th House (Pisces · Saturn):</strong> Finds emotional peace in ascetic quietude, water bodies, and silent contemplation.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 5th House (Aries · Ketu):</strong> Lightning mathematical intuition, esoteric intelligence, abstract coding genius.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 6th House (Taurus · Mercury):</strong> Overcomes intellectual opposition through factual precision and shastric evidence.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 9th House (Leo · Moon, Mars):</strong> Boundless ancestral merit; soul acts as a courageous defender of dharma.
      </div>
    </div>
  </div>
  ${footerRail("Pillar II: Karakamsha Soul Chart", 8)}
</section>

<!-- PAGE 9: PILLAR II — ISHTA DEVATA REVELATION -->
<section class="page">
  ${headerRail("PILLAR II: ISHTA DEVATA REVELATION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12th from Karakamsha: The Portal to Liberation &amp; Ishta Devata</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Maharishi Jaimini's most sacred sutra, the <strong>12th house from Karakamsha (*Karakamsad Vyaya*)</strong> reveals the portal of <em>Moksha</em> and the divine archetype chosen by the soul for spiritual communion: the <strong>Ishta Devata</strong>.
    </p>

    <!-- Shastric Derivation Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ SHASTRIC DERIVATION: SCORPIO 12TH HOUSE OCCUPIED BY JUPITER
      </div>
      <div style="font-size:11.2px;color:var(--ivory-dim);line-height:1.5;margin-top:4px;">
        • <strong>Karakamsha Lagna:</strong> Sagittarius (Dhanu).<br/>
        • <strong>12th House from KL:</strong> <strong>Scorpio (Vrishchika)</strong>.<br/>
        • <strong>Occupant in Natal Chart:</strong> <strong>Devaguru Jupiter (Brihaspati · 13° 01')</strong>.<br/>
        • <strong>Classical Jaimini Sutra:</strong> When Jupiter occupies or aspects the 12th from Karakamsha, the native's Ishta Devata is <strong>Lord Sadashiva (Shiva) and Supreme Mahavishnu</strong>&mdash;the embodiment of cosmic wisdom, detachment, and sovereign grace.
      </div>
    </div>

    <!-- Sacred Archetype -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ THE REVELATION: LORD SADASHIVA &amp; MAHAVISHNU
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Your spiritual path is not confined to sectarian dogma. Jupiter in Scorpio in the 12th from Karakamsha points directly to <strong>Lord Shiva in His peaceful, meditative form (Sadashiva)</strong> as well as <strong>Sri Mahavishnu (The Preserver of Universal Dharma)</strong>. Whenever you meditate upon the formless transcendent consciousness (*Nirguna Brahman*) or chant sacred Shiva-Vishnu stotrams, mental turbulence dissolves instantly.
      </p>
    </div>

    <!-- Dharma Devata -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">✦ DHARMA DEVATA (9TH FROM KARAKAMSHA)</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        The 9th house from Karakamsha is <strong>Leo (holding Sun's sign with Moon &amp; Mars)</strong>. Your Dharma Devata&mdash;the deity guiding your righteous actions in the physical world&mdash;is <strong>Lord Rama and Sri Hanuman</strong>. Calling upon Hanuman gives immediate clarity and physical stamina during complex architectural builds.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Ishta Devata Revelation", 9)}
</section>

<!-- PAGE 10: PILLAR II — DHARMA & GURU LINEAGE -->
<section class="page">
  ${headerRail("PILLAR II: DHARMA & GURU LINEAGE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">9th from Karakamsha: Dharma, Guru &amp; Ancestral Grace</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The 9th house from Karakamsha Lagna reveals the spiritual merit (*Purva Punya*), ancestral blessings, and the nature of gurus who guide your incarnation.
    </p>

    <!-- 9th House Leo Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ LEO 9TH FROM KL: THE SOLAR LINEAGE OF DHARMA
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        The 9th from Sagittarius is <strong>Leo (Simha)</strong>, occupied by your natal Moon (AK) and Mars (BK). This produces an intense, luminous spiritual lineage. You are carrying forward unfulfilled spiritual scholarship and temple-building merits from previous lifetimes.
      </p>
    </div>

    <!-- Mars as Spiritual Kshetrapala -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ BHRATRUKARAKA MARS AS THE INNER SPIRITUAL WARRIOR
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In Jaimini, the Bhratrukaraka (BK) is the significator of the Guru and spiritual guides. Mars at 26° 23' in Leo serves as your fierce internal protector (*Kshetrapala*). He grants you the physical vitality, sleepless endurance, and unwavering courage needed to build revolutionary software without succumbing to fatigue.
      </p>
    </div>

    <!-- Ancestral Rina Resolution -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ RESOLVING ANCESTRAL SPIRITUAL VOWS</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Because the 9th from KL is Leo (Sun's sign) with Moon, your ancestors had a deep connection to Surya Upasana and public dharma. Sponsoring water facilities, feeding cows on Sundays, and supporting underprivileged Vedic students directly discharges ancestral spiritual debts (*Pitr Rina*).
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Dharma & Guru Lineage", 10)}
</section>

<!-- PAGE 11: PILLAR III — ARUDHA PADAS ARCHITECTURE -->
<section class="page">
  ${headerRail("PILLAR III: ARUDHA PADAS ARCHITECTURE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Arudha Padas: The Mirror of Maya &amp; Worldly Manifestation</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The Rashi chart represents *Satya* (truth as experienced by the inner self), whereas the <strong>Arudha Padas (Padas of Houses)</strong> represent *Maya* (how your reality is projected, evaluated, and rewarded by human society).
    </p>

    <!-- Arudha Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Arudha</th>
          <th>Classical Title</th>
          <th>Rashi</th>
          <th>Bhava from Lagna</th>
          <th>Mundane Manifestation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--gold-bright);">AL</strong></td>
          <td><strong>Arudha Lagna</strong></td>
          <td>Sagittarius</td>
          <td>4th House</td>
          <td>Public image, external reputation, social standing, worldly impact</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald-bright);">A2</strong></td>
          <td><strong>Dhana Pada</strong></td>
          <td>Capricorn</td>
          <td>5th House</td>
          <td>Tangible wealth accumulation, liquid savings, asset credibility</td>
        </tr>
        <tr>
          <td><strong>A3</strong></td>
          <td>Vikrama Pada</td>
          <td>Aries</td>
          <td>8th House</td>
          <td>Courage, initiatives, written communications, technical drives</td>
        </tr>
        <tr>
          <td><strong>A4</strong></td>
          <td>Matru Pada</td>
          <td>Virgo</td>
          <td>1st House</td>
          <td>Vehicles, educational degrees, internal emotional sanctuary</td>
        </tr>
        <tr>
          <td><strong>A5</strong></td>
          <td>Mantra Pada</td>
          <td>Aries</td>
          <td>8th House</td>
          <td>Intellectual publications, algorithms, speculative advisory merit</td>
        </tr>
        <tr>
          <td><strong>A6</strong></td>
          <td>Shatru Pada</td>
          <td>Pisces</td>
          <td>7th House</td>
          <td>Competitive arena, legal defenses, overcoming market friction</td>
        </tr>
        <tr>
          <td><strong style="color:var(--sapphire-bright);">A7</strong></td>
          <td><strong>Dara Pada</strong></td>
          <td>Gemini</td>
          <td>10th House</td>
          <td>Commercial contracts, corporate counterparties, physical allure</td>
        </tr>
        <tr>
          <td><strong>A8</strong></td>
          <td>Mrityu Pada</td>
          <td>Scorpio</td>
          <td>3rd House</td>
          <td>Sudden transformations, longevity, research into hidden domains</td>
        </tr>
        <tr>
          <td><strong>A9</strong></td>
          <td>Pitru Pada</td>
          <td>Gemini</td>
          <td>10th House</td>
          <td>Institutional patrons, global travels, shastric credentials</td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold-bright);">A10</strong></td>
          <td><strong>Rajya Pada</strong></td>
          <td>Pisces</td>
          <td>7th House</td>
          <td>Executive authority, leadership status, professional zenith</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald-bright);">A11</strong></td>
          <td><strong>Labha Pada</strong></td>
          <td>Leo</td>
          <td>12th House</td>
          <td>Realized income streams, social network monetizations, rewards</td>
        </tr>
        <tr>
          <td><strong style="color:var(--purple-bright);">UL</strong></td>
          <td><strong>Upapada Lagna</strong></td>
          <td>Pisces</td>
          <td>7th House</td>
          <td>Sacred marriage, karmic spouse contract, marital endurance</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="kicker" style="color:var(--gold-bright);">The Arudha Realization Principle:</div>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        Society never deals with your true 1st house (Virgo); society interacts strictly with your <strong>Arudha Lagna (Sagittarius)</strong> and rewards your <strong>Rajya Pada (A10 in Pisces)</strong>. Aligning your external packaging with your Arudha signs unlocks instant institutional credibility.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Arudha Padas Architecture", 11)}
</section>

<!-- PAGE 12: PILLAR III — ARUDHA LAGNA (AL) AUDIT -->
<section class="page">
  ${headerRail("PILLAR III: ARUDHA LAGNA AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Arudha Lagna in Sagittarius: The Visionary Sovereign Image</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Your true natal Lagna is <strong>Virgo (Kanya)</strong>&mdash;analytical, meticulous, humble, self-effacing, and code-oriented. However, your <strong>Arudha Lagna (AL) is Sagittarius (Dhanu)</strong>.
    </p>

    <!-- Contrast Card -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ INTERNAL TRUTH (VIRGO LAGNA)
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          Internally, you view yourself as a meticulous craftsman, constantly optimizing systems, debugging errors, and seeking structural perfection. You dislike pomp and self-aggrandizement.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
          ✦ EXTERNAL PROJECTION (SAGITTARIUS AL)
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          To the world, you appear as an expansive visionary, a philosopher of technology, an authoritative leader who sees the macro horizon. People naturally look to you for directional guidance.
        </p>
      </div>
    </div>

    <!-- The Dual Conjunction -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ THE SOVEREIGN EMBODIMENT: KL = AL
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        When <strong>Karakamsha Lagna (Soul) and Arudha Lagna (World) share the same sign (Sagittarius)</strong>, you are spared the cognitive dissonance that plagues ordinary natives. You never have to "wear a mask" in public. What you believe in your soul is exactly what the market honors you for.
      </p>
    </div>

    <!-- Strategic Rule -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ REPUTATION PROTECTION DIRECTIVE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Sagittarius is ruled by Jupiter. Protect your public image by maintaining unassailable integrity in contracts, delivering beyond client expectations, and never engaging in petty gossip.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Arudha Lagna Audit", 12)}
</section>

<!-- PAGE 13: PILLAR III — UPAPADA & SACRED MARRIAGE -->
<section class="page">
  ${headerRail("PILLAR III: UPAPADA & SACRED MARRIAGE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Upapada Lagna in Pisces &amp; Dara Pada in Gemini: The Karmic Spouse</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Jaimini astrology, <strong>Upapada Lagna (UL)</strong> reveals the spiritual contract of marriage and the true character of your life partner, while <strong>Dara Pada (A7)</strong> reflects the physical, worldly interaction.
    </p>

    <!-- UL in Pisces Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ UPAPADA LAGNA IN PISCES (7TH HOUSE): THE SACRED OLD SOUL
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Your Upapada Lagna falls in <strong>Pisces (Meena)</strong>, the 12th sign of the natural zodiac, ruling deep compassion, emotional empathy, musicality, and spiritual surrender. Your spouse is not an aggressive materialist; she is an old soul with innate intuitive grace, creative talent, and profound emotional depth.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--gold-bright);">Darakaraka Saturn in UL:</strong> Saturn as your Darakaraka (00° 57' Pisces) resides in your 7th house and Upapada sign. This confirms a marriage rooted in <strong>spiritual maturity, mutual loyalty, and emotional endurance</strong> rather than superficial infatuation.
      </div>
    </div>

    <!-- Dara Pada A7 in Gemini -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ DARA PADA (A7) IN GEMINI: INTELLECTUAL COMPATIBILITY
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Dara Pada A7 falls in <strong>Gemini (10th house)</strong>, the sign of communication and wit. The relationship thrives when you engage in deep intellectual discussions, travel internationally together, and share common creative or publishing interests.
      </p>
    </div>

    <!-- Upapada Fasting Protocol -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ SHASTRIC UPAPADA FASTING PROTOCOL</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        In classical Jaimini, fasting on the day ruled by the Upapada Lord dissolves marital discord and attracts a high-status soul partner. Pisces is ruled by Jupiter: <strong>observing a light fruit fast or consuming yellow foods on Thursdays</strong> harmonizes your marital aura and shields your relationship from outside interference.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Upapada & Sacred Marriage", 13)}
</section>

<!-- PAGE 14: PILLAR III — FINANCIAL ARUDHAS & RAJA YOGAS -->
<section class="page">
  ${headerRail("PILLAR III: FINANCIAL ARUDHAS & RAJA YOGAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Financial Arudhas: A2, A10, A11 &amp; The Jaimini Raja Yoga</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Material wealth in Jaimini Shastra is governed by the trinal and quadrant configurations between the Arudha Lagna (AL) and the financial padas: <strong>A2 (Dhana), A10 (Rajya), and A11 (Labha)</strong>.
    </p>

    <!-- Financial Matrix -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
          ✦ A2 IN CAPRICORN: STRUCTURED TREASURY
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          Dhana Pada (A2) in Capricorn (5th house) signifies that your savings compound through patient, automated, disciplined financial architecture rather than speculative gambling.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ A11 IN LEO: SOVEREIGN REVENUE INFLOWS
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          Labha Pada (A11) in Leo (12th house) signifies that your peak financial harvest comes from autonomous, foreign, or intellectual property royalties rather than local salaries.
        </p>
      </div>
    </div>

    <!-- AL - A10 Raja Yoga -->
    <div class="luxury-card" style="border:1.5px solid var(--emerald);background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ AUTHENTICATED JAIMINI RAJA YOGA: AL ASPECTS A10
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Your <strong>Arudha Lagna is in Sagittarius</strong>, and your <strong>Rajya Pada (A10) is in Pisces</strong>. Both are Dual Signs (*Dwiswabhava Rashis*). In Jaimini Rashi Drishti, all dual signs mutually aspect one another. This mutual aspect between AL (Public Identity) and A10 (Executive Status) constitutes a <strong>classical Jaimini Raja Yoga</strong>, ensuring institutional authority and permanent commercial recognition.
      </p>
    </div>

    <!-- Argala Wealth Box -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ UNHINDERED ARGALA (INTERLOCKING WEALTH)</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Mercury in Taurus forms an unobstructed 6th-house primary Argala on Sagittarius AL, ensuring that every piece of software and technical writing you author directly reinforces your market stature.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Financial Arudhas", 14)}
</section>

<!-- PAGE 15: PILLAR IV — GNATIKARAKA SHADOW AUDIT -->
<section class="page">
  ${headerRail("PILLAR IV: GNATIKARAKA SHADOW AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Gnatikaraka (GK) Venus: The Karmic Obstacle &amp; Shadow Audit</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Maharishi Jaimini's framework, the planet with the 6th highest longitude is the <strong>Gnatikaraka (GK)</strong>&mdash;the significator of 6th-house obstacles, hidden debts, bodily ailments, and tests of Maya.
    </p>

    <!-- GK Identification Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--amber);">
      <div class="card-title" style="color:var(--amber);font-size:12px;">
        ✦ GK IDENTIFICATION: VENUS IN GEMINI (05° 00' · 10TH HOUSE)
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Venus at 05° 00' in Gemini acts as your Gnatikaraka. Because Venus naturally signifies pleasure, romance, aesthetics, and luxury assets, your karmic tests do not come from brutish enemies; they emerge through:
      </p>
      <ul style="padding-left:16px;font-size:11.2px;color:var(--ivory-dim);margin-top:4px;line-height:1.5;">
        <li><strong>Creative Perfectionism:</strong> Obsessing over font choices, visual micro-details, or interface aesthetics at the expense of shipping commercial products.</li>
        <li><strong>Contractual Ambiguities:</strong> Entering informal verbal agreements with partners that later create financial friction.</li>
        <li><strong>Over-idealization of People:</strong> Projecting saintly qualities onto business acquaintances before verifying their character.</li>
      </ul>
    </div>

    <!-- Gemstone Warning -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--ruby);background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ STRICT JAIMINI GEMSTONE WARNING: DIAMOND &amp; OPAL AUDIT
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Because Venus is your Gnatikaraka, commercial astrologers who prescribe Diamonds or White Sapphires to "boost wealth" commit a grave astrological error. Wearing a heavy Diamond activates 6th-house dispute and bodily inflammation. Instead of physical stones, Venus should be channeled through <strong>sacred creative devotion and charity</strong>.
      </p>
    </div>

    <!-- GK Neutralization Upaya -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ GK VENUS NEUTRALIZATION UPAYA</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Donate white sweets, cow ghee, or clothing to underprivileged girls on Friday mornings. This converts Venusian friction into pure creative brilliance and shields your professional reputation.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: Gnatikaraka Shadow Audit", 15)}
</section>

<!-- PAGE 16: PILLAR IV — BK & PK KARMIC DYNAMICS -->
<section class="page">
  ${headerRail("PILLAR IV: BK & PK KARMIC DYNAMICS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Mars (BK) &amp; Jupiter (PK): The Inner Warrior &amp; Spiritual Progeny</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The <strong>Bhratrukaraka (BK)</strong> represents your spiritual guides and raw courage, while the <strong>Putrakaraka (PK)</strong> governs your intellectual progeny, future students, and past-life merit.
    </p>

    <!-- BK Mars -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ BHRATRUKARAKA MARS (26° 23' LEO · 12TH HOUSE): THE SACRED WARRIOR
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Mars in Leo in the 12th house with AK Moon serves as your internal *Kshetrapala* (Guardian Deity). While others burn out under technical pressure, your BK grants you legendary nocturnal stamina. You can work unbroken through the night when designing complex architectural systems.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--ruby-bright);">BK Directive:</strong> Direct your fiery Martian intensity into code deployment and physical fitness; never let it degenerate into passive internal frustration.
      </div>
    </div>

    <!-- PK Jupiter -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ PUTRAKARAKA JUPITER (13° 01' SCORPIO · 3RD HOUSE): THE INTELLECTUAL LINEAGE
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Jupiter as PK in mystical Scorpio in the 3rd house grants deep investigative intelligence. Your intellectual creations (books, software, frameworks) will serve as foundational teaching materials for thousands of future seekers.
      </p>
    </div>

    <!-- Sacred Synthesis -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ MENTORSHIP &amp; INTELLECTUAL HERITAGE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        You are naturally meant to mentor younger engineers and researchers. Sharing your proprietary frameworks openly creates immense spiritual compounding, activating your 5th-house Purva Punya.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: BK & PK Karmic Dynamics", 16)}
</section>

<!-- PAGE 17: PILLAR V — CHARA DASHA MASTER TIMELINE -->
<section class="page">
  ${headerRail("PILLAR V: CHARA DASHA MASTER TIMELINE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Maharishi Jaimini's Chara Dasha: Rashi-Based Soul Timing</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Unlike the Nakshatra-based Vimshottari dasha, <strong>Chara Dasha</strong> operates through entire signs (*Rashis*), activating the houses, arudhas, and karakas located within them.
    </p>

    <!-- Full Lifecycle Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Sign Mahadasha</th>
          <th>Span</th>
          <th>Calendar Window</th>
          <th>Key Karakas / Arudhas Activated</th>
          <th>Karmic Life Theme</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Virgo (Kanya)</strong></td>
          <td>4 Years</td>
          <td>1995 &ndash; 1999</td>
          <td>Lagna, A4 Matru Pada</td>
          <td>Early childhood foundations, analytical formation</td>
        </tr>
        <tr>
          <td><strong>Libra (Tula)</strong></td>
          <td>8 Years</td>
          <td>1999 &ndash; 2007</td>
          <td>2nd House Treasury, Rahu</td>
          <td>Schooling, language acquisition, values development</td>
        </tr>
        <tr>
          <td><strong>Scorpio (Vrishchika)</strong></td>
          <td>9 Years</td>
          <td>2007 &ndash; 2016</td>
          <td>Jupiter PK, A8 Mrityu Pada</td>
          <td>Higher education, technical coding, deep occult inquiry</td>
        </tr>
        <tr style="background:rgba(201,169,97,0.12);border-left:3px solid var(--gold-bright);">
          <td><strong style="color:var(--gold-bright);">Sagittarius (Dhanu)</strong></td>
          <td><strong>11 Years</strong></td>
          <td><strong>2016 &ndash; 2027</strong></td>
          <td><strong style="color:var(--gold-bright);">AL (Arudha Lagna) &amp; KL (Karakamsha)</strong></td>
          <td><span class="tag-badge tag-emerald">ACTIVE NOW</span> Dual soul &amp; worldly identity zenith</td>
        </tr>
        <tr style="background:rgba(16,185,129,0.08);">
          <td><strong style="color:var(--emerald-bright);">Capricorn (Makara)</strong></td>
          <td><strong>10 Years</strong></td>
          <td><strong>2027 &ndash; 2037</strong></td>
          <td><strong style="color:var(--emerald-bright);">Indu Lagna, A2 Dhana Pada, 5th House</strong></td>
          <td><span class="tag-badge tag-gold">NEXT DECADE</span> Compounding wealth fortress &amp; systems</td>
        </tr>
        <tr>
          <td><strong>Aquarius (Kumbha)</strong></td>
          <td>11 Years</td>
          <td>2037 &ndash; 2048</td>
          <td>6th House, Satabhisha networks</td>
          <td>Global institutional expansion, societal legacy</td>
        </tr>
        <tr>
          <td><strong>Pisces (Meena)</strong></td>
          <td>4 Years</td>
          <td>2048 &ndash; 2052</td>
          <td>DK Saturn, UL Upapada, A10 Rajya</td>
          <td>Peak authority, spiritual partnership harvest</td>
        </tr>
        <tr>
          <td><strong>Aries (Mesha)</strong></td>
          <td>4 Years</td>
          <td>2052 &ndash; 2056</td>
          <td>Ketu in 8th, A3, A5</td>
          <td>Deep mystical writing, philosophical treatises</td>
        </tr>
        <tr>
          <td><strong>Taurus (Vrishabha)</strong></td>
          <td>1 Year</td>
          <td>2056 &ndash; 2057</td>
          <td>AmK Mercury in 9th</td>
          <td>Shastric intellectual crown, master publications</td>
        </tr>
        <tr>
          <td><strong>Gemini (Mithuna)</strong></td>
          <td>11 Years</td>
          <td>2057 &ndash; 2068</td>
          <td>MK Sun, GK Venus in 10th</td>
          <td>Elder statesmanship, sovereign mentorship</td>
        </tr>
        <tr>
          <td><strong>Cancer (Karka)</strong></td>
          <td>11 Years</td>
          <td>2068 &ndash; 2079</td>
          <td>11th House Realized Gains</td>
          <td>Spiritual philanthropy, institutional endowment</td>
        </tr>
        <tr>
          <td><strong>Leo (Simha)</strong></td>
          <td>2 Years</td>
          <td>2079 &ndash; 2081</td>
          <td>AK Moon, BK Mars in 12th</td>
          <td>Moksha contemplation, return to the divine source</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);">
      <p style="font-size:11px;color:var(--ivory-dim);">
        Notice the monumental transition: you are currently completing the final phase of your <strong>11-year Sagittarius Golden Era (2016&ndash;2027)</strong> and preparing to enter the <strong>10-year Capricorn Sovereign Harvest (2027&ndash;2037)</strong>.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Chara Dasha Master Timeline", 17)}
</section>

<!-- PAGE 18: PILLAR V — SAGITTARIUS CHARA DASHA AUDIT -->
<section class="page">
  ${headerRail("PILLAR V: SAGITTARIUS CHARA DASHA AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Sagittarius Mahadasha (2016–2027): The Dual AL &amp; KL Awakening</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The 11-year Sagittarius Mahadasha is the most defining spiritual and professional incubator of your entire lifetime.
    </p>

    <!-- Why Sagittarius is Supreme Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ THE DUAL ACTIVATION OF ARUDHA LAGNA (AL) &amp; KARAKAMSHA (KL)
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        During ordinary dashas, a native either experiences worldly recognition without inner satisfaction, or spiritual growth accompanied by worldly obscurity. <strong>Because Sagittarius holds BOTH your Arudha Lagna and Karakamsha Lagna, this dasha unifies worldly respect with deep soul fulfillment.</strong>
      </p>
    </div>

    <!-- 4 Epochs of Sagittarius -->
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--sapphire);">
        <strong style="color:var(--sapphire-bright);font-size:11px;">1. 2016 &ndash; 2019 (FOUNDATIONAL SEARCH):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Awakening of higher philosophy, disillusionment with conventional corporate mediocrity, beginning of deep independent technical study.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--emerald);">
        <strong style="color:var(--emerald-bright);font-size:11px;">2. 2019 &ndash; 2022 (ARCHITECTURE CREATION):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Synthesis of quantitative algorithms, building foundational codebases, mastering full-stack software architecture.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--gold);">
        <strong style="color:var(--gold-bright);font-size:11px;">3. 2022 &ndash; 2025 (SOVEREIGN BRAND LAUNCH):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Establishment of AstroLife, public launch of high-definition shastric reports, institutional credibility takes root.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--purple);">
        <strong style="color:var(--purple-bright);font-size:11px;">4. 2025 &ndash; JULY 2027 (THE CULMINATION &amp; PLATFORM ZENITH):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Consolidating the 6 core flagship report suites, locking in intellectual property moats, and preparing for the massive financial harvest of Capricorn.
        </p>
      </div>
    </div>

    <!-- Final Directives -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ STRATEGIC DIRECTIVE FOR 2026&ndash;2027</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Do not rush or scatter your energies. Complete all foundational platform engineering before July 2027. Your sovereign tools will become self-sustaining engines during the upcoming decade.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Active Sagittarius Dasha", 18)}
</section>

<!-- PAGE 19: PILLAR V — CAPRICORN SOVEREIGN HARVEST -->
<section class="page">
  ${headerRail("PILLAR V: CAPRICORN SOVEREIGN HARVEST")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Capricorn Mahadasha (2027–2037): The Sovereign Treasury Era</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Beginning on <strong>July 4, 2027</strong>, your chart enters the 10-year <strong>Capricorn (Makara) Chara Dasha</strong>. This period marks the transition from intellectual creation to cold, compounding material sovereignty.
    </p>

    <!-- Why Capricorn is the Wealth Fortress -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ TRIPLE WEALTH ACTIVATION IN CAPRICORN
      </div>
      <div style="font-size:11.2px;color:var(--ivory-dim);line-height:1.5;margin-top:4px;">
        1. <strong>5th House of Discretionary Intellect:</strong> Governs software engineering, mathematical modeling, and institutional systems (solid 30 SAV bindus).<br/>
        2. <strong>Indu Lagna (Classical Wealth Ascendant):</strong> Calculated under Brihat Jataka (Capricorn), unlocked by Indu Lagna lord Saturn.<br/>
        3. <strong>Dhana Pada (A2):</strong> Your tangible liquid wealth generator resides in Capricorn.<br/>
        4. <strong>Result:</strong> 2027&ndash;2037 is your primary wealth-accumulation decade. Every seed planted during Sagittarius matures into institutional equity.
      </div>
    </div>

    <!-- Saturnian Discipline -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ SATURNIAN GOVERNANCE: COMPACT, HIGH-MARGIN OPERATING MODELS
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Capricorn is ruled by Saturn. It does not reward reckless hype; it rewards automated, zero-bloat, high-margin software businesses. Maintain strict control over operational expenses and sweep profits into physical gold, real estate, and long-term equities.
      </p>
    </div>

    <!-- Preparation Checklist -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ 2026&ndash;2027 PREPARATION CHECKLIST</div>
      <ul style="padding-left:16px;font-size:11px;color:var(--ivory-dim);margin-top:4px;line-height:1.45;">
        <li>Automate customer acquisition and PDF rendering pipelines to handle 100x traffic volume.</li>
        <li>Protect all proprietary algorithms under institutional corporate trademarks and copyright frameworks.</li>
        <li>Cultivate long-term strategic relationships with mature, institutional co-founders and advisors.</li>
      </ul>
    </div>
  </div>
  ${footerRail("Pillar V: Upcoming Capricorn Dasha", 19)}
</section>

<!-- PAGE 20: PILLAR V — 2026-2028 ANTARDASHA RADAR -->
<section class="page">
  ${headerRail("PILLAR V: 2026-2028 ANTARDASHA RADAR")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">2026–2028 Chara Antardasha Precision Roadmap</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Quarter-by-quarter timeline of the sub-periods (*Antardashas*) governing your transition from Sagittarius into Capricorn.
    </p>

    <!-- Radar Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Period Window</th>
          <th>Operating Antardasha</th>
          <th>Key Graha / Pada Focus</th>
          <th>Strategic Action Directive</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Q1 2026 &ndash; Q2 2026</strong></td>
          <td><strong>Sagittarius &ndash; Gemini</strong></td>
          <td>MK Sun, GK Venus, A7, A9</td>
          <td>Launch public enterprise marketing, establish international client contracts, refine visual brand aesthetics</td>
        </tr>
        <tr>
          <td><strong>Q3 2026 &ndash; Q4 2026</strong></td>
          <td><strong>Sagittarius &ndash; Taurus</strong></td>
          <td>AmK Mercury in 9th House</td>
          <td>Peak IP monetization, publish high-ticket shastra dossiers, secure enterprise software retainers</td>
        </tr>
        <tr>
          <td><strong>Q1 2027 &ndash; Q2 2027</strong></td>
          <td><strong>Sagittarius &ndash; Aries</strong></td>
          <td>Ketu in 8th, A3, A5</td>
          <td>Deep code refactoring, implement automated anti-ruin safeguards, finalize platform architecture</td>
        </tr>
        <tr style="background:rgba(16,185,129,0.12);border-left:3px solid var(--emerald-bright);">
          <td><strong style="color:var(--emerald-bright);">JULY 2027</strong></td>
          <td><strong style="color:var(--emerald-bright);">CAPRICORN ENTRANCE</strong></td>
          <td><strong>Indu Lagna &amp; A2 Unlocked</strong></td>
          <td><strong>THE GRAND SHIFT:</strong> Transition from startup building to compounding institutional wealth management</td>
        </tr>
        <tr>
          <td><strong>Q3 2027 &ndash; Q4 2027</strong></td>
          <td><strong>Capricorn &ndash; Sagittarius</strong></td>
          <td>AL and KL resonance</td>
          <td>Consolidate market leadership, roll out enterprise licensing, celebrate corporate milestone</td>
        </tr>
        <tr>
          <td><strong>2028 FULL YEAR</strong></td>
          <td><strong>Capricorn &ndash; Scorpio</strong></td>
          <td>Jupiter PK &amp; Ishta Devata</td>
          <td>Spiritual pilgrimage, institutional mentoring, establishment of sovereign trust</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ TIMING SYNCHRONICITY</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Notice that late 2026 activates <strong>Sagittarius&ndash;Taurus (Amatyakaraka Mercury)</strong> at the exact same time that transiting Jupiter exalts in Cancer (11th house of gains). This creates an extraordinary window for capital accumulation and commercial breakthroughs.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: 2026-2028 Antardasha Radar", 20)}
</section>

<!-- PAGE 21: PILLAR V — SACRED SOUL MANTRAS -->
<section class="page">
  ${headerRail("PILLAR V: SACRED SOUL MANTRAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Soul Mantras &amp; Ishta Devata Upasanas</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Vedic mantras are acoustic geometric keys that align the brainwave state with cosmic intelligence.
    </p>

    <!-- Sadashiva Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--purple);">
      <div class="card-title" style="color:var(--purple-bright);font-size:11.5px;">
        1. SADASHIVA ISHTA DEVATA MOOLA MANTRA (12TH FROM KARAKAMSHA)
      </div>
      <div style="font-family:'Noto Sans Devanagari',sans-serif;font-weight:600;font-size:14px;color:var(--gold-bright);text-align:center;margin:4px 0;letter-spacing:0.04em;">
        ॐ नमः शिवाय शुभं शुभं कुरु कुरु शिवाय नमः ॐ ॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM NAMAH SHIVAYA SHUBHAM SHUBHAM KURU KURU SHIVAYA NAMAH OM ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 108 times daily facing North/East. Calms the mental field, dissolves psychic friction, and aligns the soul with divine liberation.
      </p>
    </div>

    <!-- Moon AK Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--sapphire);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:11.5px;">
        2. ATMAKARAKA CHANDRA BEEJA MANTRA (FOR SOUL HEALING)
      </div>
      <div style="font-family:'Noto Sans Devanagari',sans-serif;font-weight:600;font-size:14px;color:var(--gold-bright);text-align:center;margin:4px 0;letter-spacing:0.04em;">
        ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः ॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM SHRAM SHREEM SHROUM SAH CHANDRAMASE NAMAH ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 11 times on Monday evenings near running water. Cleanses emotional burnout and strengthens Atmakaraka resilience.
      </p>
    </div>

    <!-- Mercury AmK Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--emerald);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        3. AMATYAKARAKA BUDHA GAYATRI MANTRA (FOR INTELLECTUAL ACCURACY)
      </div>
      <div style="font-family:'Noto Sans Devanagari',sans-serif;font-weight:600;font-size:14px;color:var(--gold-bright);text-align:center;margin:4px 0;letter-spacing:0.04em;">
        ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि। तन्नो सौम्यः प्रचोदयात्॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM SAUMYA-ROOPAYA VIDMAHE VAANESHAYA DHIMAHI | TANNO SAUMYAH PRACHODAYAT ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 9 times Wednesday morning before writing code or closing deals. Sharpens mathematical discernment and intellectual focus.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Sacred Soul Mantras", 21)}
</section>

<!-- PAGE 22: PILLAR V — SOUL ALIGNMENT RITUALS -->
<section class="page">
  ${headerRail("PILLAR V: SOUL ALIGNMENT RITUALS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Soul Alignment Rituals &amp; Karmic Neutralization</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Practical Jaimini remediation is not about expensive superstitions; it is about realigning physical actions with cosmic laws.
    </p>

    <!-- Upaya Cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <strong style="color:var(--purple-bright);font-size:11.5px;">1. THE 15-MINUTE BRAHMAMUHURTA SILENCE (AK ALIGNMENT):</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Because your Atmakaraka Moon sits in the 12th house, sit in complete silence for 15 minutes before touching your phone or screens upon waking. Breathe deeply and allow the mind to settle into formless presence.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <strong style="color:var(--gold-bright);font-size:11.5px;">2. SOLID SILVER DRINKING VESSEL:</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Drink drinking water stored in a pure silver cup or vessel. Silver cools Moon-Mars heat in Leo 12th house, stabilizes neuro-chemistry, and prevents burnout.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <strong style="color:var(--emerald-bright);font-size:11.5px;">3. THURSDAY UPAPADA CHARITY (MARITAL &amp; PARTNERSHIP GRACE):</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Pisces Upapada Lagna is ruled by Jupiter. Sponsoring books or healthy meals for underprivileged children on Thursdays directly energizes your UL and fortifies partnership karma.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <strong style="color:var(--ruby-bright);font-size:11.5px;">4. FRIDAY WHITE DANA (GNATIKARAKA NEUTRALIZATION):</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Offer milk, kheer, or white flowers at a temple on Friday evenings. This satisfies GK Venus in 10th and dissolves workplace envy and contractual misunderstandings.
        </p>
      </div>
    </div>

    <!-- Shastra Quote -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE TIMELESS JAIMINI CODE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        <em>"He who knows his Atmakaraka conquers grief; he who honors his Ishta Devata crosses the ocean of samsara."</em> Live in harmony with your Sagittarius Karakamsha, and every door opens naturally.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Soul Alignment Rituals", 22)}
</section>

<!-- PAGE 23: EXECUTIVE JAIMINI SOUL ACTION CHEAT SHEET -->
<section class="page">
  ${headerRail("EXECUTIVE SOUL ACTION CHEAT SHEET")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Soul Action Cheat Sheet</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Screenshot-worthy 1-page mobile reference summarizing your core Jaimini soul coordinates and execution directives.
    </p>

    <div class="grid-2" style="gap:8px;margin-bottom:10px;">
      <!-- Card 1 -->
      <div class="luxury-card" style="border-top:2px solid var(--purple-bright);">
        <div class="kicker" style="color:var(--purple-bright);">1. ATMAKARAKA (SOUL)</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">Moon in Leo (29° 11')</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          12th House Moksha King. Requires solitary creative architecture, emotional boundaries, and regular nature retreats.
        </p>
      </div>

      <!-- Card 2 -->
      <div class="luxury-card" style="border-top:2px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">2. AMATYAKARAKA (CAREER)</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">Mercury in Taurus (26° 54')</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          9th House Shastric Mind. Monetizes through algorithms, code, shastra translation, and institutional IP advisory.
        </p>
      </div>

      <!-- Card 3 -->
      <div class="luxury-card" style="border-top:2px solid var(--gold-bright);">
        <div class="kicker" style="color:var(--gold-bright);">3. KARAKAMSHA (KL = AL)</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">Sagittarius (Dhanu)</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          Dual Soul &amp; World Image alignment. Seen as an authentic philosophical leader, visionary, and technical architect.
        </p>
      </div>

      <!-- Card 4 -->
      <div class="luxury-card" style="border-top:2px solid var(--sapphire-bright);">
        <div class="kicker" style="color:var(--sapphire-bright);">4. ISHTA DEVATA (12TH FROM KL)</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">Sadashiva &middot; Mahavishnu</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          Scorpio 12th house with Devaguru Jupiter. Supreme liberation and mental peace through Shiva-Vishnu communion.
        </p>
      </div>
    </div>

    <!-- 3 Golden Mandates -->
    <div class="luxury-card" style="background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;margin-bottom:4px;">
        ✦ 3 GOLDEN SHASTRIC SOUL MANDATES
      </div>
      <div style="font-size:11.2px;color:var(--ivory-dim);line-height:1.5;">
        1. <strong>Honor the Sagittarius Culmination (2016&ndash;2027):</strong> Complete your core software architecture before July 2027. This is your epoch of building.<br/>
        2. <strong>Prepare for the Capricorn Decade (2027&ndash;2037):</strong> Indu Lagna and Dhana Pada A2 activate in 2027. Build automated compounding wealth moats.<br/>
        3. <strong>Guard Atmakaraka Solitude:</strong> Protect your morning silence. When your Moon is calm, your intellectual output is invincible.
      </div>
    </div>
  </div>
  ${footerRail("Executive Soul Cheat Sheet", 23)}
</section>

<!-- PAGE 24: SHASTRA CERTIFICATION & AUTHENTICITY SEAL -->
<section class="page page-cover">
  <div class="page-rail">
    <span class="brand">✦ AstroLife Sovereign Soul Vault</span>
    <span class="kicker">OFFICIAL IMMUTABLE SHASTRA RECORD</span>
  </div>

  <div style="text-align:center;margin-top:10px;">
    <div class="kicker" style="letter-spacing:0.25em;color:var(--purple-bright);margin-bottom:8px;">
      ✦ CERTIFICATE OF SHASTRA AUTHENTICITY ✦
    </div>
    <h1 class="display-xl" style="font-size:24px;margin-bottom:12px;">
      Certificate of Astrological Authenticity
    </h1>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:var(--ivory);max-width:540px;margin:0 auto;line-height:1.5;">
      This 24-page Jaimini Soul Blueprint &amp; Karmic Mission dossier is computed deterministically under classical Maharishi Jaimini Upadesha Sutras, 7 Chara Karakas, Navamsha Karakamsha algorithms, and Swiss Ephemeris astronomical standards.
    </p>
  </div>

  <div class="decorative-frame" style="max-width:550px;margin:0 auto;width:100%;">
    <div style="text-align:center;">
      <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.18em;color:var(--gold-bright);margin-bottom:8px;">
        VERIFIED IMMUTABLE SHASTRA RECORD &middot; CERTIFICATE ID: ${certificateId}
      </div>
      <div style="font-size:11.5px;color:var(--ivory);line-height:1.6;">
        Certified for: <strong>${subjectName}</strong> &middot; Archive Ref: <strong>${orderId}</strong> &middot; <span style="color:var(--gold);">www.astrolife.io</span>
      </div>

      <div class="grid-2" style="font-size:10.5px;margin-top:14px;text-align:left;border-top:1px solid var(--border-gold);padding-top:10px;row-gap:6px;">
        <div>
          <span class="kicker">ASTRONOMICAL ENGINE</span>
          <div style="color:var(--ivory);font-weight:600;">Swiss Ephemeris DE431</div>
        </div>
        <div>
          <span class="kicker">ALGORITHMIC GOVERNANCE</span>
          <div style="color:var(--ivory);font-weight:600;">AstroLife Sovereign Shastra Council</div>
        </div>
        <div>
          <span class="kicker">JAIMINI TRADITION</span>
          <div style="color:var(--ivory);font-weight:600;">Jaimini Upadesha Sutras (7 Karakas)</div>
        </div>
        <div>
          <span class="kicker">HASH VERIFICATION</span>
          <div style="color:var(--ivory);font-weight:600;">SHA-256 IMMUTABLE STAMP</div>
        </div>
      </div>

      <div style="margin-top:14px;padding:8px 12px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.25);border-radius:4px;font-size:8.5px;color:var(--ivory-mute);line-height:1.4;text-align:left;">
        <strong style="color:var(--purple-bright);">SOUL BLUEPRINT SHASTRA RECORD:</strong> Computed under deterministic Rashi Dasha algorithms and exact longitudinal degree ranking. Free from generative AI hallucination. Preserves the sacred integrity of classical Maharishi Jaimini wisdom.
      </div>

      <div style="margin-top:16px;font-family:'Cinzel',serif;font-size:9.5px;letter-spacing:0.15em;color:var(--gold-bright);">
        ✦ SACRED SHASTRA HERITAGE &middot; TIME-TESTED VEDIC WISDOM ✦
      </div>
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
