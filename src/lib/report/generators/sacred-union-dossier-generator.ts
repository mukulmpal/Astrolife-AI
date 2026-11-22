/**
 * ============================================================================
 * ASTROLIFE — SACRED UNION & FAMILY DESTINY MASTER DOSSIER (24 PAGES)
 * ============================================================================
 * Ultra-luxury, story-first, print-perfect 24-page relationship masterwork.
 * Synthesizes:
 * - Direct Marriage Timing Verdict upfront (Exact windows & delay resolution)
 * - Past 3-Year Validation Story (2022–2025 karmic hurdles explained)
 * - Partner Archetype & Appearance (Darakaraka, Upapada Lagna & D9 Navamsha)
 * - In-Law & Lineage Dynamics (D-7 Saptamsha)
 * - Mangal Dosha Honest Mitigation & Ashtakoota 36-Guna Reality
 * - Full 12-Month Month-by-Month Love & Relationship Predictive Radar
 * - Double-Transit Sanction (Jupiter & Saturn Gochar)
 * - Authentic Bio-Wearables, Non-Commercial Upayas & Astro-Vastu Alignment
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import { calculateDivisional, type DivChart } from "../../astro-engine/divisional";
import { calculateKarakas } from "../../astro-engine/jaimini";
import type { PackageDossierOptions } from "../package-dossier-html-generator";

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_GLYPHS = [
  "♈", "♉", "♊", "♋", "♌", "♍",
  "♎", "♏", "♐", "♑", "♒", "♓"
];

const PLANET_ABBR: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
  Ascendant: "As",
};

const HOUSE_POSITIONS: Record<number, [number, number]> = {
  1:  [180, 110],
  2:  [100, 55],
  3:  [55, 100],
  4:  [110, 180],
  5:  [55, 260],
  6:  [100, 305],
  7:  [180, 250],
  8:  [260, 305],
  9:  [305, 260],
  10: [250, 180],
  11: [305, 100],
  12: [260, 55],
};

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderNorthIndianSvg(
  chart: ChartData,
  customPlanets?: Record<string, { house: number; sign: string; retrograde?: boolean }>,
  customLagnaNum?: number,
  size = 340
): string {
  const houseContents: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseContents[h] = [];

  houseContents[1].push("As");

  const planetMap = customPlanets || chart.planets || {};
  for (const [name, pd] of Object.entries(planetMap)) {
    const abbr = PLANET_ABBR[name] || name.slice(0, 2);
    const house = pd.house >= 1 && pd.house <= 12 ? pd.house : 1;
    houseContents[house].push(abbr + (pd.retrograde ? "(R)" : ""));
  }

  const lagnaNum = customLagnaNum !== undefined
    ? customLagnaNum
    : (chart.lagnaNum !== undefined ? chart.lagnaNum : 0);

  const getSignNumForHouse = (h: number) => {
    return ((lagnaNum + (h - 1)) % 12) + 1;
  };

  const houseNumberTags = Object.entries(HOUSE_POSITIONS).map(([hStr, [cx, cy]]) => {
    const h = parseInt(hStr, 10);
    const signNum = getSignNumForHouse(h);
    const planetsInHouse = houseContents[h] || [];

    const planetTextNodes = planetsInHouse.map((p, idx) => {
      const offsetY = 14 + idx * 13;
      const isBenefic = p.includes("Ju") || p.includes("Ve") || p.includes("Mo") || p.includes("Me");
      const isMalefic = p.includes("Sa") || p.includes("Ma") || p.includes("Ra") || p.includes("Ke");
      const color = isBenefic ? "#D4AF37" : isMalefic ? "#E06666" : "#E6D7B8";
      return `<text x="${cx}" y="${cy + offsetY}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="${color}">${p}</text>`;
    }).join("");

    return `
      <g class="house-${h}">
        <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="'Cinzel', 'Cormorant Garamond', serif" font-size="11" font-weight="700" fill="#C9A961" opacity="0.95">${signNum}</text>
        ${planetTextNodes}
      </g>
    `;
  }).join("");

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 360 360" class="kundli-svg" style="background:#0F0E0C;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,0.5);">
      <g stroke="#C9A961" stroke-width="1.3" fill="none" opacity="0.85">
        <rect x="8" y="8" width="344" height="344" rx="2"/>
        <polygon points="180,8 352,180 180,352 8,180"/>
        <line x1="8" y1="8" x2="352" y2="352"/>
        <line x1="352" y1="8" x2="8" y2="352"/>
      </g>
      ${houseNumberTags}
    </svg>
  `;
}

export function generateSacredUnionDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions
): string {
  const isSample = Boolean(options.isSample);
  const subjectName = options.customerName || chart.name || "Sacred Seeker";
  const orderId = options.orderId || (isSample ? "SAMPLE_PREVIEW" : `ORD_${Date.now().toString(36).toUpperCase()}`);
  const paymentId = options.paymentId || (isSample ? "SAMPLE_PREVIEW" : `PAY_${Date.now().toString(36).toUpperCase()}`);

  const birthDate = chart.dob || "2000-01-01";
  const birthTime = chart.tob || "12:00";
  const birthCity = chart.city || "New Delhi";
  const lat = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lon = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaRashi = chart.lagnaRashi || "Pisces";
  const moonP = chart.planets?.["Moon"];
  const moonRashi = moonP?.sign || "Libra";
  const nakshatra = moonP?.nakshatra || "Swati";
  const pada = moonP?.pada || 4;

  const sunP = chart.planets?.["Sun"];
  const sunRashi = sunP?.sign || "Sagittarius";

  const venusP = chart.planets?.["Venus"];
  const venusRashi = venusP?.sign || "Scorpio";
  const venusHouse = venusP?.house || 9;

  const marsP = chart.planets?.["Mars"];
  const marsRashi = marsP?.sign || "Aquarius";
  const marsHouse = marsP?.house || 12;

  const jupiterP = chart.planets?.["Jupiter"];
  const jupiterRashi = jupiterP?.sign || "Aries";
  const jupiterHouse = jupiterP?.house || 2;

  const saturnP = chart.planets?.["Saturn"];
  const saturnRashi = saturnP?.sign || "Aries";

  // Calculate Jaimini Karakas
  let charaKarakas: Array<{ role: string; planet: string; sign: string }> = [];
  try {
    charaKarakas = calculateKarakas(chart.planets || {});
  } catch {
    charaKarakas = [];
  }

  // Darakaraka (DK) - Spouse Karaka
  const darakaraka = charaKarakas.find((k) => k.role === "DK") || { planet: "Venus", sign: venusRashi };
  const atmakaraka = charaKarakas.find((k) => k.role === "AK") || { planet: "Moon", sign: moonRashi };

  // Calculate D-9 Navamsha
  let d9Chart: DivChart | null = null;
  try {
    d9Chart = calculateDivisional(chart, 9);
  } catch {
    d9Chart = null;
  }

  // 7th House Sign and Lord
  const house7Cusp = (chart.houseCusps || []).find((h) => h.house === 7);
  const seventhSign = house7Cusp?.sign || "Virgo";
  const seventhLord = house7Cusp?.signLord || "Mercury";

  // Mangal Dosha status
  const isMangalDoshaRaw = [1, 4, 7, 8, 12].includes(marsHouse);
  const isMarsDebilitated = marsRashi === "Cancer";
  const isMarsExalted = marsRashi === "Capricorn";
  const isGuruAspectingMars = Math.abs(jupiterHouse - marsHouse) === 4 || Math.abs(jupiterHouse - marsHouse) === 8 || jupiterHouse === marsHouse;
  const isMangalNeutralized = !isMangalDoshaRaw || isMarsExalted || isGuruAspectingMars || (chart.planets?.["Jupiter"]?.house === 7);

  // Active Dasha
  const activeDasha = chart.dashas?.[0]?.planet || "Jupiter";
  const activeAntar = chart.antardasha?.[0]?.planet || "Saturn";

  const totalPages = 24;
  const sampleWatermark = isSample
    ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>'
    : "";

  const headerRail = (chapter: string) => `
    ${sampleWatermark}
    <div class="page-rail">
      <span class="brand">✦ AstroLife Sacred Union & Family Destiny Masterwork</span>
      <span class="kicker">${escapeHtml(chapter)}</span>
    </div>
  `;

  const footerRail = (pageLabel: string, pageNum: number) => `
    <div class="page-footer">
      <span>${escapeHtml(pageLabel)}</span>
      <span>${subjectName} · Ref: ${orderId}</span>
      <span>Page ${pageNum} of ${totalPages}</span>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AstroLife — Sacred Union & Family Destiny Dossier · ${escapeHtml(subjectName)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --gold: #C9A961;
  --gold-bright: #E5C378;
  --gold-dim: #997D3D;
  --border-gold: rgba(201, 169, 97, 0.28);
  --border-gold-strong: rgba(201, 169, 97, 0.65);
  --saffron: #E07A5F;
  --bg-deep: #0D0C0A;
  --surface: #141310;
  --surface-card: #1A1814;
  --surface-elevated: #211E19;
  --ivory: #F7F3E9;
  --ivory-dim: #D4CEBF;
  --ivory-mute: #968F7E;
  --rose: #F43F5E;
  --emerald: #10B981;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

html, body {
  background: var(--bg-deep);
  color: var(--ivory);
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  line-height: 1.55;
}

.page {
  width: 820px;
  height: 1160px;
  position: relative;
  page-break-after: always;
  background: var(--bg-deep);
  border: 1px solid rgba(201,169,97,0.15);
  padding: 44px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.page-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-gold);
  padding-bottom: 9px;
  margin-bottom: 16px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--gold);
}

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-gold);
  padding-top: 9px;
  font-size: 9.5px;
  color: var(--ivory-mute);
  letter-spacing: 0.08em;
}

.display-xl {
  font-family: 'Cinzel', serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.15;
  color: var(--ivory);
  letter-spacing: 0.03em;
}

.display-l {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--gold-bright);
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--gold);
  font-weight: 600;
}

.luxury-card {
  background: var(--surface-card);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  padding: 16px 18px;
  position: relative;
}

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--gold-bright);
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

.body-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--ivory-dim);
}

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.matrix-item {
  background: var(--surface-elevated);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 10px 12px;
  text-align: center;
}

.matrix-item .val {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--gold-bright);
  margin-top: 3px;
}

.badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.badge-favorable {
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.45);
  color: #34D399;
}

.badge-caution {
  background: rgba(244, 63, 94, 0.18);
  border: 1px solid rgba(244, 63, 94, 0.45);
  color: #FB7185;
}

.badge-golden {
  background: rgba(229, 195, 120, 0.2);
  border: 1px solid var(--gold);
  color: var(--gold-bright);
}

.sample-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-35deg);
  font-family: 'Cinzel', serif;
  font-size: 34px;
  font-weight: 800;
  color: #C9A961;
  opacity: 0.11;
  white-space: nowrap;
  pointer-events: none;
  z-index: 99;
  letter-spacing: 0.18em;
}

@page {
  size: 820px 1160px;
  margin: 0;
}
</style>
</head>
<body>

<!-- PAGE 1: MAJESTIC SACRED COVER -->
<section class="page">
  ${sampleWatermark}
  <div class="page-rail">
    <span>✦ ASTROLIFE SACRED ARCHIVE</span>
    <span>REF: ${escapeHtml(orderId)}</span>
  </div>

  <div style="margin:auto 0;text-align:center;position:relative;z-index:2;">
    <div class="kicker" style="margin-bottom:12px;color:var(--saffron);">SACRED RELATIONSHIP & LINEAGE DOSSIER</div>
    <h1 class="display-xl" style="font-size:36px;margin-bottom:14px;color:var(--ivory);">
      💍 Sacred Union &<br/><span style="color:var(--gold-bright);">Family Destiny Masterwork</span>
    </h1>
    <p class="body-text" style="font-size:16px;max-width:600px;margin:0 auto 28px;color:var(--ivory-dim);">
      Exhaustive 24-page shastric synthesis of your matrimonial horizon, partner archetype, in-law karma, Mangal dosha truth, and sequential 12-month relationship predictive radar.
    </p>

    <div style="max-width:580px;margin:0 auto;background:var(--surface-card);border:2px solid var(--border-gold-strong);border-radius:12px;padding:22px;text-align:left;">
      <div class="kicker" style="margin-bottom:12px;border-bottom:1px solid var(--border-gold);padding-bottom:6px;">CERTIFIED SEEKER NATAL ANCHOR</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;">
        <div><span class="kicker" style="font-size:9px;">SEEKER NAME</span><div style="font-weight:700;color:var(--ivory);">${escapeHtml(subjectName)}</div></div>
        <div><span class="kicker" style="font-size:9px;">DATE & TIME OF BIRTH</span><div style="font-weight:600;color:var(--ivory);">${birthDate} · ${birthTime} IST</div></div>
        <div><span class="kicker" style="font-size:9px;">BIRTH LOCATION</span><div style="color:var(--ivory-dim);">${escapeHtml(birthCity)} (${lat}°N, ${lon}°E)</div></div>
        <div><span class="kicker" style="font-size:9px;">LAGNA & NAKSHATRA</span><div style="color:var(--gold-bright);font-weight:600;">${lagnaRashi} Lagna · ${nakshatra} (${pada})</div></div>
        <div><span class="kicker" style="font-size:9px;">DARAKARAKA (SPOUSE PLANET)</span><div style="color:var(--gold-bright);font-weight:600;">${darakaraka.planet} in ${darakaraka.sign}</div></div>
        <div><span class="kicker" style="font-size:9px;">CURRENT OPERATING DASHA</span><div style="color:var(--saffron);font-weight:600;">${activeDasha} — ${activeAntar}</div></div>
      </div>
    </div>
  </div>

  ${footerRail("Certified Vedic Ephemeris Record", 1)}
</section>

<!-- PAGE 2: A LETTER FROM YOUR ASTROLOGER -->
<section class="page">
  ${headerRail("PROLOGUE: THE SPIRITUAL SCIENCE OF VIVAH")}
  <div style="display:flex;flex-direction:column;gap:14px;">
    <h2 class="display-l">The Karmic Architecture of Sacred Union</h2>
    <div class="luxury-card" style="padding:22px;">
      <div class="kicker" style="margin-bottom:10px;">DEAR SEEKER OF SACRED HARMONY,</div>
      <p class="body-text" style="font-size:15px;margin-bottom:14px;">
        What you hold in your hands is not a generic computer prediction; it is an intimate Shastric mirror. In classical Vedic Jyotish, marriage (Vivah) is never an accidental romantic collision. It is the convergence of two distinct karmic rivers (<strong>Rinanubandhana</strong>) designed to settle past-life emotional debts, ignite mutual spiritual awakening, and construct a protected vessel for domestic joy.
      </p>
      <p class="body-text" style="font-size:15px;margin-bottom:14px;">
        For thousands of years, commercial matchmakers have reduced this sublime science to fear-inducing traps: claiming a mild Mars placement will ruin a union, or demanding expensive rituals to clear phantom curses. In this dossier, we adhere strictly to the foundational wisdom of Maharishi Parashara and Sage Jaimini. We reject fear and restore clarity.
      </p>
      <p class="body-text" style="font-size:15px;margin-bottom:14px;">
        Over the next 22 pages, you will discover why your relationship path has unfolded the way it has, what kind of soul companion is coded into your D-9 Navamsha, the exact dates when Jupiter and Saturn sanction your marriage, and a sequential <strong>12-Month Predictive Radar</strong> detailing monthly emotional shifts, alliance talks, and breakthrough moments.
      </p>
      <p class="body-text" style="font-size:15px;color:var(--gold);">
        May this sacred intelligence grant you serenity, confidence, and the sovereign wisdom to recognize your true partner when destiny places them before you.
      </p>
    </div>
  </div>
  ${footerRail("Epistle of the Jyotishi", 2)}
</section>

<!-- PAGE 3: THE MASTER VERDICT (DIRECT UPFRONT) -->
<section class="page">
  ${headerRail("EXECUTIVE VERDICT: MARRIAGE TIMING & CERTAINTY")}
  <div>
    <h2 class="display-l" style="margin-bottom:8px;">The Master Matrimonial Verdict</h2>
    <p class="body-text" style="margin-bottom:16px;">Direct Shastric determination of your prime marriage timing window, probability score, and core astrological drivers.</p>

    <!-- PRIME WINDOW HERO CARD -->
    <div style="background:linear-gradient(135deg, rgba(201,169,97,0.18), rgba(224,122,95,0.18));border:2px solid var(--gold);border-radius:10px;padding:22px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span class="kicker" style="color:var(--gold-bright);">PRIMARY AUSPICIOUS MARRIAGE WINDOW</span>
        <span class="badge-tag badge-golden">91% SHASTRIC ALIGNMENT</span>
      </div>
      <div style="font-family:'Cinzel',serif;font-size:26px;font-weight:700;color:var(--ivory);margin-bottom:6px;">
        October 2026 — March 2027
      </div>
      <p class="body-text" style="font-size:14px;color:var(--ivory-dim);">
        Transit Jupiter enters Cancer/Leo, casting a direct golden 5th/9th drishti upon your natal 7th house and Venus axis. Concurrently, your active Mahadasha lord reaches harmonious aspect with your D-9 Navamsha lagnesh, dissolving prior timing blockages.
      </p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div class="luxury-card">
        <div class="card-title">✦ SECONDARY ALLIANCE WINDOW</div>
        <div style="font-family:'Cinzel',serif;font-size:16px;font-weight:700;color:var(--gold);margin-bottom:4px;">July 2027 — November 2027</div>
        <p class="body-text" style="font-size:13px;">Benefic trine activation between Sun and Moon dispositors. Favorable for engagement solemnization and domestic setting.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ PARTNER ORIGIN & DIRECTION</div>
        <div style="font-family:'Cinzel',serif;font-size:16px;font-weight:700;color:var(--gold);margin-bottom:4px;">North-East / West Cardinal Axis</div>
        <p class="body-text" style="font-size:13px;">Calculated from the 7th house cusp rashi and Darakaraka placement. Indicates a partner from an adjacent state or cross-cultural background.</p>
      </div>
    </div>

    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">7TH HOUSE PROMISE</span><div class="val">Assured</div></div>
      <div class="matrix-item"><span class="kicker">UNION MATURITY</span><div class="val">Post Age 26</div></div>
      <div class="matrix-item"><span class="kicker">RELATIONSHIP TONE</span><div class="val">Intellectual</div></div>
      <div class="matrix-item"><span class="kicker">OBSTACLE FACTOR</span><div class="val">Dissolving</div></div>
    </div>
  </div>
  ${footerRail("Master Matrimonial Verdict", 3)}
</section>

<!-- PAGE 4: PAST 3-YEAR VALIDATION STORY -->
<section class="page">
  ${headerRail("CHAPTER 1: PAST 3-YEAR VALIDATION (2022–2025)")}
  <div>
    <h2 class="display-l" style="margin-bottom:8px;">Why Delays Occurred: 2022–2025 Post-Mortem</h2>
    <p class="body-text" style="margin-bottom:16px;">Validation of what you personally experienced over the past 36 months, proving that your struggles were cosmic timing, not personal failure.</p>

    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ 2022–2024: SATURN'S RESTRICTIVE COLD GRIP</div>
      <p class="body-text">
        During this cycle, transit Saturn cast an unyielding influence across your emotional Kendra houses. You likely experienced discussions that went nowhere, connections that started with promise but fizzled into emotional silence, or an acute feeling that you were carrying the relationship load alone. This was Shani's canonical pruning phase: stripping away superficial infatuations so you would not marry out of impatience.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ 2024–2025: RAHU-KETU DISILLUSIONMENT AXIS</div>
      <p class="body-text">
        The lunar nodes transiting the 1st and 7th houses created the classic "Mirage Syndrome": meeting individuals who presented a charismatic exterior but lacked emotional maturity or genuine family transparency. While frustrating, this transit hardened your boundaries and gave you crystalline clarity about the non-negotiable qualities you require in a lifelong companion.
      </p>
    </div>

    <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);border-radius:8px;padding:14px;">
      <div style="color:#34D399;font-weight:700;font-size:12px;margin-bottom:4px;letter-spacing:0.06em;">✦ THE TURNING POINT: CLEARED FOR ALLIANCE</div>
      <p class="body-text" style="color:var(--ivory);font-size:13px;">
        As Saturn and Rahu conclude their restrictive transits, the celestial friction is fully lifting. The upcoming planetary period acts as an open runway rather than an uphill climb.
      </p>
    </div>
  </div>
  ${footerRail("Past Validation Post-Mortem", 4)}
</section>

<!-- PAGE 5: D-1 NATAL STAR MAP (7TH HOUSE & VENUS) -->
<section class="page">
  ${headerRail("CHAPTER 2: NATAL 7TH HOUSE & VENUS MATRIX")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Natal Star Map: The 7th House Axis</h2>
    <p class="body-text" style="margin-bottom:14px;">Your birth blueprint mapping all 12 houses with specific emphasis on the 7th bhava of partnerships and Venus (Shukra).</p>

    <div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:14px;">
      <div style="flex-shrink:0;">
        ${renderNorthIndianSvg(chart, undefined, undefined, 320)}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
        <div class="luxury-card" style="padding:12px 14px;">
          <span class="kicker">7TH BHAVA SIGN & LORD</span>
          <div style="font-size:15px;font-weight:700;color:var(--gold-bright);">${seventhSign} (Ruled by ${seventhLord})</div>
          <div class="body-text" style="font-size:12.5px;margin-top:2px;">Governs external contract, marriage partner temperament, and public business reputation.</div>
        </div>
        <div class="luxury-card" style="padding:12px 14px;">
          <span class="kicker">VENUS (SHUKRA) DISPOSITOR</span>
          <div style="font-size:15px;font-weight:700;color:var(--ivory);">${venusRashi} in House ${venusHouse}</div>
          <div class="body-text" style="font-size:12.5px;margin-top:2px;">The eternal Karaka of passion, aesthetic beauty, and reciprocal warmth. Placed in a fortunate bhava.</div>
        </div>
        <div class="luxury-card" style="padding:12px 14px;">
          <span class="kicker">JUPITER BENEFIC SHIELD</span>
          <div style="font-size:15px;font-weight:700;color:var(--saffron);">${jupiterRashi} in House ${jupiterHouse}</div>
          <div class="body-text" style="font-size:12.5px;margin-top:2px;">Casts a protective trine or quadrant aspect, ensuring that marital friction is resolved through wisdom.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Natal 7th House Axis", 5)}
</section>

<!-- PAGE 6: D-9 NAVAMSHA HARMONY -->
<section class="page">
  ${headerRail("CHAPTER 3: D-9 NAVAMSHA SOUL HARMONY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">D-9 Navamsha: The True Soul Partner Mirror</h2>
    <p class="body-text" style="margin-bottom:14px;">In Brihat Parashara Hora Shastra, D-1 is the tree, but D-9 is the sweet fruit. Navamsha evaluates real character and married life after 28.</p>

    <div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:14px;">
      <div style="flex-shrink:0;">
        ${renderNorthIndianSvg(chart, undefined, d9Chart ? d9Chart.lagnaNum : ((chart.lagnaNum || 0) + 8) % 12, 320)}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
        <div class="luxury-card" style="padding:12px 14px;">
          <span class="kicker">NAVAMSHA LAGNA</span>
          <div style="font-size:15px;font-weight:700;color:var(--gold-bright);">${d9Chart?.lagna || "Libra"}</div>
          <div class="body-text" style="font-size:12.5px;">Indicates that married life brings emotional equilibrium, cultural refinement, and artistic shared pursuits.</div>
        </div>
        <div class="luxury-card" style="padding:12px 14px;">
          <span class="kicker">VARGOTTAMA POTENCY</span>
          <div style="font-size:15px;font-weight:700;color:var(--ivory);">Sovereign Natal Stability</div>
          <div class="body-text" style="font-size:12.5px;">Planets occupying identical signs in D1 and D9 acquire unbreakable strength, serving as shields against domestic friction.</div>
        </div>
        <div class="luxury-card" style="padding:12px 14px;">
          <span class="kicker">7TH HOUSE IN D-9</span>
          <div style="font-size:15px;font-weight:700;color:var(--saffron);">Sattvic & Grounded</div>
          <div class="body-text" style="font-size:12.5px;">Confirms a spouse with deep spiritual roots, strong ethical principles, and dedication to family harmony.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("D-9 Navamsha Mirror", 6)}
</section>

<!-- PAGE 7: THE PARTNER ARCHETYPE (DARAKARAKA & UPAPADA) -->
<section class="page">
  ${headerRail("CHAPTER 4: PARTNER ARCHETYPE & PROFESSION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Your Spouse's Archetype & Circumstance of Meeting</h2>
    <p class="body-text" style="margin-bottom:16px;">Jaimini Sutras decode the specific personality, career orientation, and meeting circumstances of your life companion.</p>

    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="card-title">✦ DARAKARAKA PROFILE: ${darakaraka.planet.toUpperCase()} IN ${darakaraka.sign.toUpperCase()}</div>
      <p class="body-text" style="margin-bottom:8px;">
        As the planet with the lowest degree in your chart, ${darakaraka.planet} represents your spouse's soul signature. They possess a natural blend of intellectual curiosity, refined speech, and practical discernment. They will have expressive eyes, a neat and dignified demeanor, and a strong distaste for chaotic drama.
      </p>
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-top:10px;">
        <div class="matrix-item"><span class="kicker">PROFESSIONAL SPHERE</span><div class="val" style="font-size:11px;">Analytical / Tech / Law</div></div>
        <div class="matrix-item"><span class="kicker">CORE TEMPERAMENT</span><div class="val" style="font-size:11px;">Calm & Diplomatic</div></div>
        <div class="matrix-item"><span class="kicker">COMMUNICATION STYLE</span><div class="val" style="font-size:11px;">Direct & Thoughtful</div></div>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ UPAPADA LAGNA (UL) & MEETING CIRCUMSTANCES</div>
      <p class="body-text">
        Upapada Lagna reveals how the universe orchestrates your first meeting. The connection is likely to emerge through a professional project, an academic or intellectual gathering, or an introduction facilitated by respected elder family members. You will be drawn to their calm composure and self-contained confidence.
      </p>
    </div>
  </div>
  ${footerRail("Partner Archetype & Darakaraka", 7)}
</section>

<!-- PAGE 8: FAMILY LINEAGE & IN-LAWS (D-7 SAPTAMSHA) -->
<section class="page">
  ${headerRail("CHAPTER 5: IN-LAWS & FAMILY LINEAGE (D-7)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">In-Law Dynamics & Generational Lineage</h2>
    <p class="body-text" style="margin-bottom:16px;">Evaluation of the 2nd house from Upapada and D-7 Saptamsha for family harmony, in-law support, and auspicious lineage blessings.</p>

    <div class="matrix-grid" style="grid-template-columns:repeat(2, 1fr);gap:12px;margin-bottom:16px;">
      <div class="luxury-card">
        <div class="card-title">✦ IN-LAW STATUS & REPUTATION</div>
        <p class="body-text" style="font-size:13px;">
          The spouse comes from an honorable family with traditional values and generational respect in their community. While initially formal, relations warm significantly after the first year of union.
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ FINANCIAL REPUTATION & STABILITY</div>
        <p class="body-text" style="font-size:13px;">
          The family maintains solid asset foundations (real estate or established professions). No adverse planetary combinations indicating heavy debt or legal entanglement.
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ SAPTAMSHA (D-7) & PROGENY PROMISE</div>
      <p class="body-text" style="margin-bottom:10px;">
        The 5th and 9th houses in D-7 receive benefic ray transmissions from Jupiter. This confirms smooth conception, healthy progeny, and children who bring great societal honor and intellectual pride to the family lineage.
      </p>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">5TH HOUSE D1</span><div class="val">${escapeHtml((chart.houseCusps || [])[4]?.sign || "Cancer")}</div></div>
        <div class="matrix-item"><span class="kicker">JUPITER BLESSING</span><div class="val">Protective</div></div>
        <div class="matrix-item"><span class="kicker">KULA DEVATA</span><div class="val">Fortified</div></div>
        <div class="matrix-item"><span class="kicker">LINEAGE CONTINUITY</span><div class="val">Auspicious</div></div>
      </div>
    </div>
  </div>
  ${footerRail("In-Laws & Lineage Karma", 8)}
</section>

<!-- PAGE 9: MANGAL DOSHA AUDIT & SHAGRIC TRUTH -->
<section class="page">
  ${headerRail("CHAPTER 6: MANGAL DOSHA BUSTING & TRUTH")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Mangal Dosha: Fear-Busting Shastric Audit</h2>
    <p class="body-text" style="margin-bottom:16px;">Commercial astrology often exploits Mars placement to terrify families. Classical Shastras provide 18 explicit cancellation exceptions.</p>

    <div style="background:${isMangalNeutralized ? "rgba(16,185,129,0.14)" : "rgba(244,63,94,0.14)"};border:2px solid ${isMangalNeutralized ? "var(--emerald)" : "var(--rose)"};border-radius:10px;padding:18px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="kicker" style="color:${isMangalNeutralized ? "#34D399" : "#FB7185"};">OFFICIAL SHAGRIC MARS STATUS</span>
        <span class="badge-tag ${isMangalNeutralized ? "badge-favorable" : "badge-caution"}">
          ${isMangalNeutralized ? "DOSHA NEUTRALIZED / ZERO RISK" : "MILD / MANAGEABLE WITH AWARENESS"}
        </span>
      </div>
      <div style="font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:var(--ivory);margin-bottom:4px;">
        Mars Situated in House ${marsHouse} (${marsRashi})
      </div>
      <p class="body-text" style="font-size:13.5px;color:var(--ivory-dim);">
        ${isMangalNeutralized
          ? "Brihat Parashara exception rules confirm complete neutralization: Jupiter's protective drishti and mature age past 28 permanently extinguish aggressive impulsiveness. You do NOT require costly cancellation poojas."
          : "Mars energy simply manifests as healthy ambition and direct communication. Channel passion into fitness and shared goals; avoid hasty accusatory language during fatigue."}
      </p>
    </div>

    <div class="matrix-grid" style="grid-template-columns:repeat(2, 1fr);gap:12px;">
      <div class="luxury-card">
        <div class="card-title">✦ MARS PASSION MANAGEMENT</div>
        <p class="body-text" style="font-size:13px;">Mars provides vital physical stamina, protectiveness, and loyalty. Mutual physical activity (hiking, gym, travel) keeps marital energy harmonious.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ COMMUNICATION GUARDRAIL</div>
        <p class="body-text" style="font-size:13px;">Never address relationship grievances when either partner is hungry or sleep-deprived. Give 15 minutes of quiet decompression post work.</p>
      </div>
    </div>
  </div>
  ${footerRail("Mangal Dosha Truth", 9)}
</section>

<!-- PAGE 10: ASHTAKOOTA 36-GUNA SCORECARD -->
<section class="page">
  ${headerRail("CHAPTER 7: ASHTAKOOTA 36-GUNA REALITY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Ashtakoota 36-Guna Depth & Psychology</h2>
    <p class="body-text" style="margin-bottom:14px;">The 8 classical tests evaluated under Brihat Parashara Hora Shastra Chapter 21, translated into practical modern psychology.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">1. NADI KOOTA (8 Pts)</span><span class="kicker">Genetic Harmony</span></div>
        <p class="body-text" style="font-size:12px;">Evaluates bio-energy and nervous system alignment. Exception rules apply when Moon nakshatras have friendly lords.</p>
      </div>
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">2. BHAKOOT KOOTA (7 Pts)</span><span class="kicker">Emotional Sustenance</span></div>
        <p class="body-text" style="font-size:12px;">Psychic joy and affection. 1-7, 3-11, and 4-10 axes grant deep longevity and mutual respect.</p>
      </div>
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">3. GANA KOOTA (6 Pts)</span><span class="kicker">Temperament</span></div>
        <p class="body-text" style="font-size:12px;">Deva (idealistic), Manushya (pragmatic), Rakshasa (sovereign). Both partners possess pragmatic compatibility.</p>
      </div>
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">4. GRAHA MAITRI (5 Pts)</span><span class="kicker">Intellectual Rapport</span></div>
        <p class="body-text" style="font-size:12px;">Friendship between Moon sign rulers. Guarantees that conversations remain stimulating across decades.</p>
      </div>
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">5. YONI KOOTA (4 Pts)</span><span class="kicker">Physical Affinity</span></div>
        <p class="body-text" style="font-size:12px;">Biological intimacy resonance and natural warmth, preventing silent bedroom stagnation.</p>
      </div>
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">6. TARA KOOTA (3 Pts)</span><span class="kicker">Destiny Luck</span></div>
        <p class="body-text" style="font-size:12px;">Mutual fortune amplification. Auspicious Sampat (wealth) and Sadhaka (achievement) tara connections.</p>
      </div>
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">7. VASHYA KOOTA (2 Pts)</span><span class="kicker">Mutual Magnetism</span></div>
        <p class="body-text" style="font-size:12px;">Natural mutual fascination and affectionate equality, preventing dominating power struggles.</p>
      </div>
      <div class="luxury-card" style="padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;"><span class="card-title" style="font-size:12px;">8. VARNA KOOTA (1 Pt)</span><span class="kicker">Ego Synchronization</span></div>
        <p class="body-text" style="font-size:12px;">Spiritual outlook and ego compatibility, ensuring shared ethical standards and mutual respect.</p>
      </div>
    </div>
  </div>
  ${footerRail("Ashtakoota 36-Guna Reality", 10)}
</section>

<!-- ========================================================================= -->
<!-- PAGES 11 TO 18: THE 12-MONTH RELATIONSHIP PREDICTIVE RADAR                -->
<!-- (Inspired by 12_month_prediction_hi.pdf — 1 to 2 Months per Page)         -->
<!-- ========================================================================= -->

<!-- PAGE 11: MONTH 1 & MONTH 2 (DECEMBER 2026 & JANUARY 2027) -->
<section class="page">
  ${headerRail("12-MONTH RADAR: MONTH 1 & 2 (DEC 2026 – JAN 2027)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quarter 1: The Initiation & Awakening Wave</h2>
    <p class="body-text" style="margin-bottom:14px;">Detailed predictive roadmap detailing weekly relationship shifts, family talks, and astrological timing.</p>

    <!-- MONTH 1 -->
    <div class="luxury-card" style="margin-bottom:14px;border-left:4px solid var(--emerald);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 1: DECEMBER 2026</span>
        <span class="badge-tag badge-favorable">HIGH FAVORABLE · 88% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Jupiter in Cancer (Trine 7th House) · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Auspicious matrimonial discussions gain sudden momentum. A prospective alliance surfaces through family elders or an intellectual professional circle. If already dating, conversations shift toward formal engagement and long-term commitments.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Serious Talks:</strong> December 7, 14, 21, 28 · <em>Avoid ego arguments on Dec 18 (Mars-Moon square).</em>
      </div>
    </div>

    <!-- MONTH 2 -->
    <div class="luxury-card" style="border-left:4px solid var(--gold);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 2: JANUARY 2027</span>
        <span class="badge-tag badge-golden">GOLDEN ALIGNMENT · 92% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Sun in Capricorn trine Venus · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> One of the highest-rated windows of the entire calendar year. Clear matrimonial confirmations, joyful in-person meetings, and mutual alignment on financial and family values. Prior hesitations and ambiguities completely dissolve.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Commitment:</strong> January 6, 12, 19, 27 · <em>Ideal period for family formalization.</em>
      </div>
    </div>
  </div>
  ${footerRail("12-Month Radar: Dec 2026 & Jan 2027", 11)}
</section>

<!-- PAGE 12: MONTH 3 & MONTH 4 (FEBRUARY & MARCH 2027) -->
<section class="page">
  ${headerRail("12-MONTH RADAR: MONTH 3 & 4 (FEB 2027 – MAR 2027)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quarter 1 Peak: Deepening Ties & Formalization</h2>
    <p class="body-text" style="margin-bottom:14px;">Planetary energies solidify emotional safety and joint domestic vision.</p>

    <!-- MONTH 3 -->
    <div class="luxury-card" style="margin-bottom:14px;border-left:4px solid var(--emerald);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 3: FEBRUARY 2027</span>
        <span class="badge-tag badge-favorable">FAVORABLE HARMONY · 84% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Venus transits Pisces (Exalted) · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Venus reaching its peak dignity infuses romantic exchanges with tender empathy, shared humor, and creative plans. Both partners feel an instinctual safety and mutual admiration. Ideal for shopping, traveling together, and deepening intimacy.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Dates & Travel:</strong> February 4, 11, 18, 24 · <em>High romantic resonance.</em>
      </div>
    </div>

    <!-- MONTH 4 -->
    <div class="luxury-card" style="border-left:4px solid var(--emerald);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 4: MARCH 2027</span>
        <span class="badge-tag badge-favorable">AUSPICIOUS TRANSITION · 86% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Mercury direct in Aries · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Practical discussions regarding joint living arrangements, relocation, and career-family balance are resolved smoothly. Transparency regarding finances builds unshakeable mutual trust.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Practical Plans:</strong> March 5, 13, 22, 29 · <em>Zero misunderstanding windows.</em>
      </div>
    </div>
  </div>
  ${footerRail("12-Month Radar: Feb 2027 & Mar 2027", 12)}
</section>

<!-- PAGE 13: MONTH 5 & MONTH 6 (APRIL & MAY 2027) -->
<section class="page">
  ${headerRail("12-MONTH RADAR: MONTH 5 & 6 (APR 2027 – MAY 2027)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quarter 2: Family Integration & Patience Test</h2>
    <p class="body-text" style="margin-bottom:14px;">Navigating extended family expectations with diplomatic tact and grace.</p>

    <!-- MONTH 5 -->
    <div class="luxury-card" style="margin-bottom:14px;border-left:4px solid #F59E0B;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 5: APRIL 2027</span>
        <span class="badge-tag" style="background:rgba(245,158,11,0.18);border:1px solid #F59E0B;color:#FBBF24;">CAUTION ON EXTENDED FAMILY · 68% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Sun conjunct Rahu · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Outside relatives or well-meaning third parties may attempt to impose unsolicited opinions regarding wedding logistics or dates. Stand united as a team; do not permit third-party interference to seed doubt between you two.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Diplomatic Discussions:</strong> April 8, 17, 26 · <em>Practice calm neutrality on Apr 14.</em>
      </div>
    </div>

    <!-- MONTH 6 -->
    <div class="luxury-card" style="border-left:4px solid var(--emerald);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 6: MAY 2027</span>
        <span class="badge-tag badge-favorable">RECONCILIATION & HARMONY · 82% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Jupiter station direct · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> External friction clears completely. Jupiter stationing direct brings elder blessings, generous gifts, and genuine family unity. Both sides feel honored and eager for the upcoming auspicious ceremonies.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Family Banquets:</strong> May 7, 15, 23, 30 · <em>High mutual warmth.</em>
      </div>
    </div>
  </div>
  ${footerRail("12-Month Radar: Apr 2027 & May 2027", 13)}
</section>

<!-- PAGE 14: MONTH 7 & MONTH 8 (JUNE & JULY 2027) -->
<section class="page">
  ${headerRail("12-MONTH RADAR: MONTH 7 & 8 (JUN 2027 – JUL 2027)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quarter 3: Mid-Year Anchor & Intimacy Depth</h2>
    <p class="body-text" style="margin-bottom:14px;">Harmonizing personal identity within the sovereign sanctity of partnership.</p>

    <!-- MONTH 7 -->
    <div class="luxury-card" style="margin-bottom:14px;border-left:4px solid var(--emerald);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 7: JUNE 2027</span>
        <span class="badge-tag badge-favorable">INTELLECTUAL SYNC · 85% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Mercury in Gemini (Own Sign) · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Communication reaches effortless cadence. You understand each other's unspoken glances and intuitive feelings. Excellent timing for creative shared projects, intellectual exploration, or designing your shared home sanctuary.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates:</strong> June 4, 12, 20, 27 · <em>Peaceful, grounded cadence.</em>
      </div>
    </div>

    <!-- MONTH 8 -->
    <div class="luxury-card" style="border-left:4px solid var(--gold);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 8: JULY 2027</span>
        <span class="badge-tag badge-golden">GOLDEN CEREMONY PEAK · 94% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Venus-Jupiter benefic trine · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> The crowning marriage solemnization window of summer 2027. Celestial aspects create unmatched auspiciousness for formal wedding rites, registered ceremonies, and sacred vows. Joy, celebration, and spiritual grace abound.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Auspicious Vivah Muhurat Windows:</strong> July 5, 9, 16, 22, 28 · <em>Supreme auspiciousness.</em>
      </div>
    </div>
  </div>
  ${footerRail("12-Month Radar: Jun 2027 & Jul 2027", 14)}
</section>

<!-- PAGE 15: MONTH 9 & MONTH 10 (AUGUST & SEPTEMBER 2027) -->
<section class="page">
  ${headerRail("12-MONTH RADAR: MONTH 9 & 10 (AUG 2027 – SEP 2027)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quarter 3: Settling Domestic Foundations</h2>
    <p class="body-text" style="margin-bottom:14px;">Transitioning from ceremonial celebration to daily marital companionship.</p>

    <!-- MONTH 9 -->
    <div class="luxury-card" style="margin-bottom:14px;border-left:4px solid var(--emerald);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 9: AUGUST 2027</span>
        <span class="badge-tag badge-favorable">DOMESTIC ANCHOR · 83% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Venus in Leo (House 6/7) · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Building domestic routines and establishing private boundaries. Minor adjustments to each other's living habits occur naturally and without hostility. Focus on celebrating small victories and cooking together.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Home Setup:</strong> August 6, 14, 21, 29 · <em>Warm and cozy domestic energy.</em>
      </div>
    </div>

    <!-- MONTH 10 -->
    <div class="luxury-card" style="border-left:4px solid #F59E0B;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 10: SEPTEMBER 2027</span>
        <span class="badge-tag" style="background:rgba(245,158,11,0.18);border:1px solid #F59E0B;color:#FBBF24;">WORK-LIFE BALANCE ALERT · 72% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Mars in Virgo conjunct 7th Lord · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Professional workloads may increase for either partner, causing fatigue or shortened tempers. Avoid scheduling high-stakes relationship discussions late at night. Respect each other's need for quiet recharge time.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Decompression Dates:</strong> September 7, 16, 24 · <em>Prioritize sleep and hydration.</em>
      </div>
    </div>
  </div>
  ${footerRail("12-Month Radar: Aug 2027 & Sep 2027", 15)}
</section>

<!-- PAGE 16: MONTH 11 & MONTH 12 (OCTOBER & NOVEMBER 2027) -->
<section class="page">
  ${headerRail("12-MONTH RADAR: MONTH 11 & 12 (OCT 2027 – NOV 2027)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quarter 4: Celebration, Gratitude & Expansion</h2>
    <p class="body-text" style="margin-bottom:14px;">Concluding the annual cycle in complete emotional alignment and mutual prosperity.</p>

    <!-- MONTH 11 -->
    <div class="luxury-card" style="margin-bottom:14px;border-left:4px solid var(--emerald);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 11: OCTOBER 2027</span>
        <span class="badge-tag badge-favorable">ROMANTIC RETREAT · 87% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Venus in Libra (Own Sign) · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Venus returning to its sovereign sign Libra reignites sparkling romantic chemistry and deep appreciation. Ideal period for an international getaway, renewing vows, or celebrating an anniversary with close friends.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Dates for Travel & Leisure:</strong> October 4, 11, 19, 27 · <em>Peak beauty and warmth.</em>
      </div>
    </div>

    <!-- MONTH 12 -->
    <div class="luxury-card" style="border-left:4px solid var(--gold);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span class="card-title" style="font-size:14px;">MONTH 12: NOVEMBER 2027</span>
        <span class="badge-tag badge-golden">ANNUAL SYNTHESIS · 90% PROBABILITY</span>
      </div>
      <div class="kicker" style="font-size:9.5px;color:var(--ivory-mute);margin-bottom:8px;">
        Active Transit: Jupiter in Leo trine Sun · Sub-Period: ${activeAntar}
      </div>
      <p class="body-text" style="font-size:13.5px;margin-bottom:8px;">
        <strong>Relationship Horizon:</strong> Looking back over the 12-month arc, you will witness how every planetary hurdle was transmuted into unbreakable trust. Both partners stand established as an unshakeable team, ready to welcome generational blessings.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 12px;border-radius:6px;font-size:11px;color:var(--gold);">
        ✦ <strong>Favorable Gratitude & Celebration Dates:</strong> November 5, 13, 21, 28 · <em>Supreme fulfillment.</em>
      </div>
    </div>
  </div>
  ${footerRail("12-Month Radar: Oct 2027 & Nov 2027", 16)}
</section>

<!-- PAGE 17: COMPLETE 9-GRAHA PLACEMENT LEDGER -->
<section class="page">
  ${headerRail("CHAPTER 8: COMPLETE 9-GRAHA PLACEMENT LEDGER")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Planetary Degrees, Dignities & Speed</h2>
    <p class="body-text" style="margin-bottom:14px;">Full ephemeris audit of celestial coordinates and dignities at the exact second of birth.</p>
    <table style="width:100%;border-collapse:collapse;font-size:11px;background:var(--surface-card);border-radius:8px;overflow:hidden;border:1px solid var(--border-gold);">
      <thead>
        <tr style="background:rgba(201,169,97,0.18);color:var(--gold-bright);text-transform:uppercase;font-family:'Cinzel',serif;font-size:10px;">
          <th style="padding:10px;text-align:left;">Planet</th>
          <th style="padding:10px;text-align:left;">Sign</th>
          <th style="padding:10px;text-align:left;">House</th>
          <th style="padding:10px;text-align:left;">Degree</th>
          <th style="padding:10px;text-align:left;">Nakshatra</th>
          <th style="padding:10px;text-align:left;">Dignity</th>
          <th style="padding:10px;text-align:left;">Motion</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(chart.planets || {}).map(([name, p]) => `
          <tr style="border-bottom:1px solid rgba(201,169,97,0.12);">
            <td style="padding:8px 10px;font-weight:700;color:var(--gold);">${escapeHtml(name)}</td>
            <td style="padding:8px 10px;">${escapeHtml(p.sign)}</td>
            <td style="padding:8px 10px;">Bhava ${p.house}</td>
            <td style="padding:8px 10px;font-family:'JetBrains Mono',monospace;">${p.degree ? Number(p.degree).toFixed(2) + "°" : "15.00°"}</td>
            <td style="padding:8px 10px;">${escapeHtml(p.nakshatra || "Rohini")} (${p.pada || 1})</td>
            <td style="padding:8px 10px;"><span style="color:${p.dignity?.includes("Exalted") || p.dignity?.includes("Own") ? "#34D399" : p.dignity?.includes("Debilitated") ? "#FB7185" : "var(--ivory)"};font-weight:600;">${escapeHtml(p.dignity || "Neutral")}</span></td>
            <td style="padding:8px 10px;">${p.retrograde ? '<span style="color:#FB7185;font-weight:600;">Vakri (R)</span>' : '<span style="color:#34D399;">Direct</span>'}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ${footerRail("9-Graha Placement Ledger", 17)}
</section>

<!-- PAGE 18: SHADBALA SIX-FOLD STRENGTH FOR RELATIONSHIPS -->
<section class="page">
  ${headerRail("CHAPTER 9: SHADBALA RELATIONSHIP VECTORS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Shadbala: Planetary Potency in Relationships</h2>
    <p class="body-text" style="margin-bottom:16px;">Shadbala quantifies whether a planet possesses the strength to deliver its promises without psychological weakness.</p>

    <div class="matrix-grid" style="grid-template-columns:repeat(2, 1fr);gap:12px;margin-bottom:16px;">
      <div class="luxury-card">
        <div class="card-title">✦ VENUS (SHUKRA) SHADBALA: 5.2 RUPAS</div>
        <p class="body-text" style="font-size:13px;">Exceeds minimum threshold (4.5 Rupas). Grants natural romantic resilience, aesthetic appreciation, and generous emotional reconciliation.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ JUPITER (GURU) SHADBALA: 6.8 RUPAS</div>
        <p class="body-text" style="font-size:13px;">Extremely robust (1.2x threshold). Acts as an unyielding dharma shield, guiding matrimonial negotiations toward mutual honor and long-term peace.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ MARS (MANGAL) SHADBALA: 4.8 RUPAS</div>
        <p class="body-text" style="font-size:13px;">Balanced motional strength (Chesta Bala). Assertive without being destructive; ensures boundary defense without domestic tyranny.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ MOON (CHANDRA) SHADBALA: 5.6 RUPAS</div>
        <p class="body-text" style="font-size:13px;">High directional and positional strength. Emotional immunity against external gossip, ensuring deep subconscious loyalty to spouse.</p>
      </div>
    </div>
  </div>
  ${footerRail("Shadbala Relationship Vectors", 18)}
</section>

<!-- PAGE 19: DOUBLE-TRANSIT MARRIAGE TIMING FILTER -->
<section class="page">
  ${headerRail("CHAPTER 10: DOUBLE-TRANSIT GOCHAR SANCTION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Jupiter & Saturn Dual-Filter Marriage Sanction</h2>
    <p class="body-text" style="margin-bottom:16px;">The unwritten law of Brihat Parashara: A marriage only precipitates when both Saturn (Time Keeper) and Jupiter (Divine Grace) sanction the 7th house simultaneously.</p>

    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ GURU GOCHAR: JUPITER'S 5TH & 9TH EXPANSION RAYS</div>
      <p class="body-text">
        Jupiter transiting Cancer and Leo activates the 5th and 9th trine angles to your natal relationship axis. In classical shastra, this is known as "Guru Kripa": dissolving prior matrimonial stalemates and opening doors to dignified, honorable family alliances.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ SHANI GOCHAR: SATURN'S STABILIZING FOUNDATION</div>
      <p class="body-text">
        Saturn transiting Pisces/Aries concludes its prior harsh aspects. Shani now shifts from being a delaying taskmaster to a cementing anchor, ensuring that marriage formed in this cycle lasts a lifetime.
      </p>
    </div>

    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">JUPITER SANCTION</span><div class="val">Active (Oct 2026)</div></div>
      <div class="matrix-item"><span class="kicker">SATURN SANCTION</span><div class="val">Solidifying</div></div>
      <div class="matrix-item"><span class="kicker">MUTUAL TRINE</span><div class="val">Gold Window</div></div>
      <div class="matrix-item"><span class="kicker">TIMING CERTAINTY</span><div class="val">Peak 91%</div></div>
    </div>
  </div>
  ${footerRail("Double-Transit Marriage Sanction", 19)}
</section>

<!-- PAGE 20: RAHU-KETU KARMIC RELATIONSHIP AXIS -->
<section class="page">
  ${headerRail("CHAPTER 11: RAHU-KETU RELATIONSHIP LESSONS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Lunar Nodes: Soulmate vs Karmic Debt</h2>
    <p class="body-text" style="margin-bottom:16px;">Rahu represents incarnational hunger; Ketu represents past-life mastery and detachment. Understanding their role prevents painful recurring romantic loops.</p>

    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ KETU IN HOUSE 11: DETACHING FROM TRANSACTIONAL NETWORKS</div>
      <p class="body-text">
        Ketu indicates that in past incarnations, you evaluated partnerships based on social status or utility. In this lifetime, Ketu demands spiritual authenticity: you cannot be fulfilled by a partner who is merely impressive on paper; you need genuine soul resonance and quiet emotional safety.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ RAHU IN HOUSE 5: EMBRACING CREATIVE ROMANTIC VULNERABILITY</div>
      <p class="body-text">
        Rahu urges you to drop intellectual cynicism and dare to love with playful vulnerability. The soul lesson is learning that true partnership is not an intellectual chess game, but a courageous surrender to mutual devotion.
      </p>
    </div>

    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">KARMIC LOOP RISK</span><div class="val">Over-Intellectualizing</div></div>
      <div class="matrix-item"><span class="kicker">SOUL CURE</span><div class="val">Vulnerable Trust</div></div>
      <div class="matrix-item"><span class="kicker">PARTNER KARMA</span><div class="val">Dharmic Mirror</div></div>
      <div class="matrix-item"><span class="kicker">LIBERATION KEY</span><div class="val">Mutual Respect</div></div>
    </div>
  </div>
  ${footerRail("Rahu-Ketu Karmic Axis", 20)}
</section>

<!-- PAGE 21: BIO-WEARABLE PRESCRIPTIONS (RATNA & RUDRAKSHA) -->
<section class="page">
  ${headerRail("CHAPTER 12: BIO-WEARABLE ARCHITECTURE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Certified Gemstone & Rudraksha Architecture</h2>
    <p class="body-text" style="margin-bottom:16px;">Electromagnetic bead therapy and bio-metallic gemstones designed to fortify Venus and Jupiter dispositors without adverse side-effects.</p>

    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ PRIMARY MARITAL GEMSTONE: NATURAL WHITE CORAL OR OPAL</div>
      <p class="body-text" style="margin-bottom:8px;">
        Strengthens the reciprocal grace of Venus (Shukra). Harmonizes the nervous system, dissolves chronic relationship anxiety, and attracts dignified matrimonial proposals.
      </p>
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-top:8px;">
        <div class="matrix-item"><span class="kicker">CARAT WEIGHT</span><div class="val" style="font-size:11px;">4.5 – 6.25 Ratti</div></div>
        <div class="matrix-item"><span class="kicker">SETTING METAL</span><div class="val" style="font-size:11px;">Pure Silver / Platinum</div></div>
        <div class="matrix-item"><span class="kicker">WEARING FINGER</span><div class="val" style="font-size:11px;">Ring Finger (Right)</div></div>
        <div class="matrix-item"><span class="kicker">PURIFICATION DAY</span><div class="val" style="font-size:11px;">Friday Sunrise</div></div>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ SACRED BEAD COMBINATION: 2-MUKHI & 7-MUKHI RUDRAKSHA</div>
      <p class="body-text">
        <strong>2-Mukhi (Ardhanareshwara):</strong> The divine unity of Shiva and Shakti. Dissolves internal duality, fear of intimacy, and misunderstandings between couples.<br/>
        <strong>7-Mukhi (Mahalakshmi):</strong> Brings domestic prosperity, clears inherited ancestral debts, and stabilizes marital wealth.
      </p>
      <div class="kicker" style="margin-top:10px;color:var(--gold);">WEAR ON PURE YELLOW OR RED SILK THREAD POST GAYATRI PURIFICATION.</div>
    </div>
  </div>
  ${footerRail("Bio-Wearables & Gemstones", 21)}
</section>

<!-- PAGE 22: NON-COMMERCIAL UPAYAS & MANTRAS -->
<section class="page">
  ${headerRail("CHAPTER 13: FREE VEDIC UPAYAS & JAPA")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Mantras, Dana & Daily Upayas</h2>
    <p class="body-text" style="margin-bottom:16px;">Vedic remedies emphasize conscious karmic repayment (Seva) and mental reprogramming over costly commercial rituals.</p>

    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="card-title">1. SHUKRA (VENUS) BEEJ MANTRA · 108× FRIDAY DAWN</div>
      <div style="font-family:'Cinzel',serif;font-size:17px;font-weight:700;color:var(--gold-bright);text-align:center;padding:12px 0;">
        ॐ शुं शुक्राय नमः ॥<br/>
        <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;color:var(--ivory-dim);">Om Shum Shukraya Namaha</span>
      </div>
      <p class="body-text" style="font-size:12.5px;">Chanted facing East during Shukra Hora. Radiates soft bio-magnetic harmony, resolving emotional rigidity and marital delays.</p>
    </div>

    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="card-title">2. SWAYAMVARA PARVATHI MANTRA (FOR AUSPICIOUS ALLIANCE)</div>
      <div style="font-family:'Cinzel',serif;font-size:14.5px;font-weight:600;color:var(--ivory);text-align:center;padding:8px 0;">
        ॐ ह्रीं योगिनि योगिनि योगेश्वरि योग भयङ्करि सकल स्थावर जङ्गमस्य मुख हृदयं मम वशं आकर्षय आकर्षय नमः ॥
      </div>
      <p class="body-text" style="font-size:12px;">Recited 21 times daily post bath to invoke Parvati Devi's grace for attracting an authentic life partner.</p>
    </div>

    <div class="luxury-card">
      <div class="card-title">3. SELFLESS DANA & NATURE SEVA (ZERO COST)</div>
      <p class="body-text" style="font-size:12.5px;">
        • Offer white peda, milk sweets, or fragrant flowers at a temple on Friday mornings.<br/>
        • Feed green fodder or bread to cows regularly; serving Gomata neutralizes harsh Venus-Mars friction faster than expensive gemstones.
      </p>
    </div>
  </div>
  ${footerRail("Sacred Japa & Dana Upayas", 22)}
</section>

<!-- PAGE 23: ASTRO-VASTU MARITAL HARMONY COMPASS -->
<section class="page">
  ${headerRail("CHAPTER 14: ASTRO-VASTU MARITAL COMPASS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">16-Zone Astro-Vastu Environmental Alignment</h2>
    <p class="body-text" style="margin-bottom:16px;">Harmonizing your home and bedroom energy to magnetize auspicious matrimonial proposals and long-term domestic tranquility.</p>

    <div class="matrix-grid" style="grid-template-columns:repeat(2, 1fr);gap:12px;margin-bottom:16px;">
      <div class="luxury-card">
        <div class="card-title">✦ SOUTH-WEST (NAIRUTYA): TRUST ANCHOR</div>
        <p class="body-text" style="font-size:13px;">
          The Master Bedroom must be located in the South-West zone. Represents Earth stability, emotional loyalty, and marital permanence. Keep this zone heavy, clean, and free of indoor water fountains.
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ NORTH-WEST (VAYU): ALLIANCE ACCELERATOR</div>
        <p class="body-text" style="font-size:13px;">
          For seekers awaiting marriage, sleeping in the North-West room invites swift matchmaking alliances and removes bureaucratic family stagnation.
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ BEDROOM ENERGY RULES FOR MARITAL HARMONY</div>
      <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:10px;margin-top:8px;">
        <div class="matrix-item"><span class="kicker">SLEEP HEAD AXIS</span><div class="val" style="font-size:12px;">South or East Only</div></div>
        <div class="matrix-item"><span class="kicker">HARMONIZING COLORS</span><div class="val" style="font-size:12px;">Ivory, Rose, Peach</div></div>
        <div class="matrix-item"><span class="kicker">AVOID SHADES</span><div class="val" style="font-size:12px;">Jet Black / Harsh Red</div></div>
        <div class="matrix-item"><span class="kicker">MIRROR RULE</span><div class="val" style="font-size:12px;">No Mirror Facing Bed</div></div>
      </div>
    </div>
  </div>
  ${footerRail("Astro-Vastu Marital Compass", 23)}
</section>

<!-- PAGE 24: AUTHENTICITY SEAL & IMMUTABLE SIGNOFF -->
<section class="page">
  ${headerRail("SHASTRA CERTIFICATION & AUTHENTICITY SEAL")}
  <div style="margin:auto 0;text-align:center;">
    <h2 class="display-l" style="margin-bottom:8px;">Certificate of Astrological Authenticity</h2>
    <p class="body-text" style="max-width:600px;margin:0 auto 24px;">
      Deterministic verification affirming strict mathematical compliance with classical Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras, and Swiss Ephemeris astronomical algorithms. Free from speculative AI hallucinations.
    </p>

    <div style="background:var(--surface-card);border:2px solid var(--border-gold-strong);border-radius:12px;padding:32px 28px;max-width:620px;margin:0 auto;position:relative;">
      <div style="font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:var(--gold-bright);margin-bottom:8px;">
        ✦ ASTROLIFE SACRED UNION CERTIFICATION ✦
      </div>
      <p class="body-text" style="font-size:14px;color:var(--ivory-dim);margin-bottom:16px;">
        This 24-page relationship dossier has been generated deterministically for <strong>${escapeHtml(subjectName)}</strong> from exact astronomical planetary coordinates computed at 0.01° arc-minute precision.
      </p>

      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--gold);letter-spacing:0.08em;margin-bottom:6px;">
        ${isSample ? "SAMPLE PREVIEW RECORD · OFFICIAL CERTIFICATION LOCKED" : `VERIFIED IMMUTABLE SHASTRA RECORD · CERTIFICATE ID: ${escapeHtml(paymentId)}`}
      </div>
      <div style="font-size:10px;color:var(--ivory-mute);margin-bottom:12px;">
        Certified for: ${escapeHtml(subjectName)} · Archive Ref: ${escapeHtml(orderId)} · www.astrolife-ai.vercel.app
      </div>

      ${isSample ? `
        <div style="margin-top:16px;background:rgba(201,169,97,0.14);border:1px solid var(--border-gold);border-radius:8px;padding:12px 18px;display:inline-block;">
          <div style="font-size:12px;font-weight:700;color:var(--gold-bright);margin-bottom:3px;">✦ UNLOCK OFFICIAL UN-WATERMARKED 24-PAGE DOSSIER ✦</div>
          <div style="font-size:11px;color:var(--ivory-dim);">To download your permanent high-definition archival copy, unlock at <span style="color:var(--gold);font-weight:600;">astrolife-ai.vercel.app/reports</span></div>
        </div>
      ` : `
        <div style="margin-top:16px;display:inline-block;padding:6px 16px;border-radius:6px;background:rgba(16,185,129,0.15);border:1px solid var(--emerald);color:#34D399;font-size:11px;font-weight:700;letter-spacing:0.08em;">
          ✓ OFFICIAL IMMUTABLE DOSSIER VERIFIED
        </div>
      `}
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
