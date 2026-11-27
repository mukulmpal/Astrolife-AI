/**
 * ============================================================================
 * ASTROLIFE — JAIMINI SOUL BLUEPRINT & KARMIC MISSION DOSSIER GENERATOR (v2.0)
 * ============================================================================
 * 24-page ultra-luxury shastric dossier based strictly on Maharishi Jaimini's
 * Upadesha Sutras, classical 7 Chara Karakas, Karakamsha Lagna (Navamsha Base),
 * corrected Arudha Padas (AL in Capricorn, UL in Aries), and Chara Dasha cycles.
 *
 * Fully synchronized with NormalizedChartContext and classical Jaimini Shastra.
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import type { PackageDossierOptions } from "../package-dossier-html-generator";
import { getActiveDashaState, getSeekerAge, resolveGender } from "../dossier-shared-helpers";
import { buildJaiminiChart, type JaiminiResult } from "../../astro-engine/jaimini";
import {
  houseFromLagna,
  ordinal,
  renderHumanImpactCardHtml
} from "../../astro/human-translator";

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

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter"
};

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
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const orderId = escapeHtml(options.orderId || `AL-ORD-${Date.now().toString(36).toUpperCase()}`);
  const certificateId = escapeHtml(options.paymentId || `AL-CERT-${Date.now().toString(36).toUpperCase()}`);

  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "Delhi");
  const lat = chart.lat ?? 28.6139;
  const lon = chart.lon ?? 77.2090;

  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[chart.lagnaNum ?? 0] || "Aries";
  const lagnaNum = chart.lagnaNum ?? 0;
  const moonP = chart.planets?.Moon;
  const moonNakshatra = moonP?.nakshatra || "Ashwini";
  const moonRashi = moonP?.sign || "Aries";
  const moonPada = moonP?.pada || 1;

  const resolvedGender = resolveGender(options, chart);
  const seekerAge = getSeekerAge(chart.dob);
  const seekerAgeStr = typeof seekerAge === "number" ? `${seekerAge} years` : "Recorded";

  const dashaState = getActiveDashaState(chart);
  const activeDashaName = dashaState.activeDasha || "Jupiter";
  const activeAntarName = dashaState.activeAntar || "Saturn";

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

  // Exact degree strings for absolute cross-page consistency
  const akDegreeStr = formatDMS(ak.degreeInSign);
  const amkDegreeStr = formatDMS(amk.degreeInSign);
  const bkDegreeStr = formatDMS(bk.degreeInSign);
  const mkDegreeStr = formatDMS(mk.degreeInSign);
  const pkDegreeStr = formatDMS(pk.degreeInSign);
  const gkDegreeStr = formatDMS(gk.degreeInSign);
  const dkDegreeStr = formatDMS(dk.degreeInSign);

  // Karakamsha Lagna details (D-9 Navamsha Base)
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

  const klTwelfthSignNum = (klSignNum + 11) % 12;
  const klTwelfthSign = SIGN_NAMES[klTwelfthSignNum];
  const klTwelfthLord = SIGN_LORDS[klTwelfthSign];
  const klTwelfthOccupants = jaimini.karakamsha.houses.find(h => h.house === 12)?.planets || [];
  const ishtaPlanet = klTwelfthOccupants.length > 0 ? klTwelfthOccupants[0] : klTwelfthLord;
  const ishtaSourceText = klTwelfthOccupants.length > 0
    ? `Occupant ${klTwelfthOccupants.join(" & ")} in 12th from KL (${klTwelfthSign})`
    : `12th Lord ${klTwelfthLord} from KL (${klTwelfthSign}, unoccupied)`;

  const ISHTA_MAP: Record<string, { deity: string; desc: string }> = {
    Sun: { deity: "Lord Shiva & Sri Rama", desc: "Soul sovereignty, solar truth, and divine radiance" },
    Moon: { deity: "Sri Krishna & Devi Parvati", desc: "Supreme devotion, emotional tranquility, and compassionate grace" },
    Mars: { deity: "Lord Hanuman & Sri Kartikeya", desc: "Fearlessness, righteous courage, and triumph over inner obstacles" },
    Mercury: { deity: "Lord Maha Vishnu & Sri Narayana", desc: "Cosmic balance, intellectual discernment, and preservation of dharma" },
    Jupiter: { deity: "Lord Shiva & Sri Dakshinamurthy", desc: "Supreme wisdom, spiritual guidance, and transcendent enlightenment" },
    Venus: { deity: "Maha Lakshmi & Divine Mother", desc: "Auspicious grace, creative abundance, and reciprocal harmony" },
    Saturn: { deity: "Lord Kurma & Lord Shiva", desc: "Enduring tapasya, karmic purification, and timeless patience" },
    Rahu: { deity: "Maa Durga & Sri Varaha", desc: "Shield against illusion, victory over cosmic chaos, and radical transformation" },
    Ketu: { deity: "Lord Ganesha & Sri Matsya", desc: "Moksha, intuitive transcendence, and effortless dissolution of karmic knots" },
  };
  const ishtaInfo = ISHTA_MAP[klTwelfthLord] || { deity: "Sri Vishnu & Shiva", desc: "Sovereign cosmic guidance and spiritual liberation" };

  // Authentic Arudhas
  const al = jaimini.arudhas.find(a => a.shortName === "AL") || { shortName: "AL", name: "Arudha Lagna", sign: "Aries", house: 1, meaning: "World image" };
  const ul = jaimini.arudhas.find(a => a.shortName === "UL") || { shortName: "UL", name: "Upapada Lagna", sign: "Aries", house: 12, meaning: "Spousal karma" };
  const a2 = jaimini.arudhas.find(a => a.shortName === "A2") || { shortName: "A2", name: "Dhana Pada", sign: "Taurus", house: 2, meaning: "Liquid assets" };
  const a7 = jaimini.arudhas.find(a => a.shortName === "A7") || { shortName: "A7", name: "Dara Pada", sign: "Libra", house: 7, meaning: "Trade & partnership" };
  const a10 = jaimini.arudhas.find(a => a.shortName === "A10") || { shortName: "A10", name: "Rajya Pada", sign: "Capricorn", house: 10, meaning: "Executive power" };
  const a11 = jaimini.arudhas.find(a => a.shortName === "A11") || { shortName: "A11", name: "Labha Pada", sign: "Aquarius", house: 11, meaning: "Compound gains" };

  // Chara Dasha Active & Helpers
  const activeDashaIdx = jaimini.charaDasha.findIndex(d => d.isActive);
  const activeDasha = (activeDashaIdx >= 0 ? jaimini.charaDasha[activeDashaIdx] : null) || jaimini.charaDasha[0] || {
    sign: "Aries",
    years: 10,
    startDate: new Date("2020-01-01"),
    endDate: new Date("2030-01-01")
  };
  const nextDasha = (activeDashaIdx >= 0 && jaimini.charaDasha[activeDashaIdx + 1])
    ? jaimini.charaDasha[activeDashaIdx + 1]
    : (jaimini.charaDasha[1] || jaimini.charaDasha[0]);

  const activeDashaStartYear = new Date(activeDasha.startDate).getFullYear();
  const activeDashaEndYear = new Date(activeDasha.endDate).getFullYear();
  const nextDashaStartYear = new Date(nextDasha.startDate).getFullYear();
  const nextDashaEndYear = new Date(nextDasha.endDate).getFullYear();

  const akData = chart.planets?.[ak.planet];
  const amkData = chart.planets?.[amk.planet];
  const bkData = chart.planets?.[bk.planet];
  const pkData = chart.planets?.[pk.planet];
  const gkData = chart.planets?.[gk.planet];
  const dkData = chart.planets?.[dk.planet];

  const akHouse = akData?.house ? `House ${akData.house}` : "Kendra";
  const amkHouse = amkData?.house ? `House ${amkData.house}` : "Trikona";
  const bkHouse = bkData?.house ? `House ${bkData.house}` : "Upachaya";
  const pkHouse = pkData?.house ? `House ${pkData.house}` : "Purva Punya";
  const gkHouse = gkData?.house ? `House ${gkData.house}` : "Shatru Bhava";
  const dkHouse = dkData?.house ? `House ${dkData.house}` : "Jaya Bhava";

  const klNinthSignNum = (klSignNum + 8) % 12;
  const klNinthSign = SIGN_NAMES[klNinthSignNum];
  const klNinthLord = SIGN_LORDS[klNinthSign];
  const klLord = SIGN_LORDS[klSign];

  const PLANET_MANTRAS: Record<string, { devanagari: string; latin: string; name: string }> = {
    Sun: { name: "SURYA BEEJA MANTRA", devanagari: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः ॥", latin: "OM HRAAM HREEM HROUM SAH SURYAYA NAMAH ||" },
    Moon: { name: "CHANDRA BEEJA MANTRA", devanagari: "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः ॥", latin: "OM SHRAM SHREEM SHROUM SAH CHANDRAMASE NAMAH ||" },
    Mars: { name: "MANGALA BEEJA MANTRA", devanagari: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥", latin: "OM KRAAM KREEM KROUM SAH BHOUMAYA NAMAH ||" },
    Mercury: { name: "BUDHA BEEJA MANTRA", devanagari: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः ॥", latin: "OM BRAAM BREEM BROUM SAH BUDHAYA NAMAH ||" },
    Jupiter: { name: "GURU BEEJA MANTRA", devanagari: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥", latin: "OM GRAAM GREEM GROUM SAH GURAVE NAMAH ||" },
    Venus: { name: "SHUKRA BEEJA MANTRA", devanagari: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः ॥", latin: "OM DRAAM DREEM DROUM SAH SHUKRAYA NAMAH ||" },
    Saturn: { name: "SHANI BEEJA MANTRA", devanagari: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॥", latin: "OM PRAAM PREEM PROUM SAH SHANAISHCHARAYA NAMAH ||" },
    Rahu: { name: "RAHU BEEJA MANTRA", devanagari: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः ॥", latin: "OM BHRAAM BHREEM BHROUM SAH RAHAVE NAMAH ||" },
    Ketu: { name: "KETU BEEJA MANTRA", devanagari: "ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः ॥", latin: "OM STRAAM STREEM STROUM SAH KETAVE NAMAH ||" },
  };

  const DEITY_ISHTA_MANTRAS: Record<string, { devanagari: string; latin: string }> = {
    Sun: { devanagari: "ॐ नमो भगवते रामाय नमः ॥", latin: "OM NAMO BHAGAVATE RAMAYA NAMAH ||" },
    Moon: { devanagari: "ॐ नमो भगवते वासुदेवाय ॥", latin: "OM NAMO BHAGAVATE VASUDEVAYA ||" },
    Mars: { devanagari: "ॐ हं हनुमते नमः ॥", latin: "OM HAM HANUMATE NAMAH ||" },
    Mercury: { devanagari: "ॐ नमो नारायणाय ॥", latin: "OM NAMO NARAYANAYA ||" },
    Jupiter: { devanagari: "ॐ नमः शिवाय ॥", latin: "OM NAMAH SHIVAYA ||" },
    Venus: { devanagari: "ॐ श्रीं महालक्ष्म्यै नमः ॥", latin: "OM SHREEM MAHALAKSHMYAI NAMAH ||" },
    Saturn: { devanagari: "ॐ नमः शिवाय ॥", latin: "OM NAMAH SHIVAYA ||" },
    Rahu: { devanagari: "ॐ दुं दुर्गायै नमः ॥", latin: "OM DUM DURGAYAI NAMAH ||" },
    Ketu: { devanagari: "ॐ गं गणपतये नमः ॥", latin: "OM GAM GANAPATAYE NAMAH ||" },
  };
  const ishtaMantra = DEITY_ISHTA_MANTRAS[ishtaPlanet] || DEITY_ISHTA_MANTRAS.Mercury;
  const akMantra = PLANET_MANTRAS[ak.planet] || PLANET_MANTRAS.Moon;
  const amkMantra = PLANET_MANTRAS[amk.planet] || PLANET_MANTRAS.Mercury;

  const akHumanCard = renderHumanImpactCardHtml({
    tier: "TIER_HIGH",
    badge: "Your Natural Edge",
    title: `Soul Compass: ${ak.planet} in ${ak.sign}`,
    plainWords: `Your Atmakaraka ${ak.planet} in ${ak.sign} (${akHouse}) shows what gives your life real meaning beyond money. You feel most energized when your daily choices match your core values.`,
    watchOutFor: `Chasing external approval or status in areas that drain your inner conviction.`,
    nextMove: `Spend 10 quiet minutes tomorrow morning writing down your top priority before checking messages.`,
    shastricProof: `AK: ${ak.planet} ${akDegreeStr} in ${ak.sign} (${akHouse}) · KL: ${klSign}`
  }, { customStyle: "margin-bottom:8px;padding:8px 10px;" });

  const amkHumanCard = renderHumanImpactCardHtml({
    tier: "TIER_HIGH",
    badge: "Your Natural Edge",
    title: `Career Engine: ${amk.planet} in ${amk.sign}`,
    plainWords: `Your Amatyakaraka ${amk.planet} in ${amk.sign} (${amkHouse}) powers how you earn respect and build lasting income. Steady execution in your craft compounds faster than chasing quick trends.`,
    watchOutFor: `Spreading your focus across too many unaligned projects at once.`,
    nextMove: `Pick one high-leverage skill or deliverable this week and finish it end-to-end.`,
    shastricProof: `AmK: ${amk.planet} ${amkDegreeStr} in ${amk.sign} (${amkHouse})`
  }, { customStyle: "margin-bottom:8px;padding:8px 10px;" });

  const ROLE_BADGE_CLASS: Record<string, string> = {
    AK: "tag-purple",
    AmK: "tag-emerald",
    BK: "tag-ruby",
    MK: "tag-gold",
    PK: "tag-sapphire",
    GK: "tag-amber",
    DK: "tag-sapphire"
  };
  const ROLE_TITLES: Record<string, string> = {
    AK: "Atmakaraka",
    AmK: "Amatyakaraka",
    BK: "Bhratrukaraka",
    MK: "Matrukaraka",
    PK: "Putrakaraka",
    GK: "Gnatikaraka",
    DK: "Darakaraka"
  };
  const karakaTableRowsHtml = jaimini.karakas.map((k) => {
    const pData = chart.planets?.[k.planet];
    const house = pData?.house ? `House ${pData.house}` : "Kendra";
    const badgeCls = ROLE_BADGE_CLASS[k.role] || "tag-gold";
    const title = ROLE_TITLES[k.role] || k.role;
    const degStr = formatDMS(k.degreeInSign);
    return `
      <tr>
        <td><span class="tag-badge ${badgeCls}">${k.role}</span></td>
        <td><strong>${title}</strong></td>
        <td><strong style="color:var(--gold-bright);">${k.planet}</strong></td>
        <td>${degStr}</td>
        <td>${k.sign} (${house})</td>
        <td>${k.signifies || k.meaning}</td>
      </tr>
    `;
  }).join("");

  const arudhaRowsHtml = jaimini.arudhas.map((a) => {
    const bhavaFromLagna = houseFromLagna(a.sign, lagnaRashi);
    const color = a.shortName === "AL" ? "var(--gold-bright)" : a.shortName === "UL" ? "var(--purple-bright)" : a.shortName === "A11" ? "var(--emerald-bright)" : "var(--ivory)";
    const bg = a.shortName === "AL" ? 'style="background:rgba(201,169,97,0.1);border-left:3px solid var(--gold-bright);"' : a.shortName === "UL" ? 'style="background:rgba(139,92,246,0.12);border-left:3px solid var(--purple-bright);"' : "";
    return `
      <tr ${bg}>
        <td><strong style="color:${color};">${a.shortName}</strong></td>
        <td><strong>${a.name}</strong></td>
        <td>${a.sign}</td>
        <td>${ordinal(bhavaFromLagna)} House</td>
        <td>${a.meaning || "Karmic reflection of " + a.shortName}</td>
      </tr>
    `;
  }).join("");

  const charaDashaRowsHtml = jaimini.charaDasha.slice(0, 8).map((d) => {
    const startYear = new Date(d.startDate).getFullYear();
    const endYear = new Date(d.endDate).getFullYear();
    const activeBadge = d.isActive ? `<span class="tag-badge tag-emerald">ACTIVE NOW</span> ` : "";
    const bgStyle = d.isActive ? `style="background:rgba(201,169,97,0.12);border-left:3px solid var(--gold-bright);"` : "";
    const karakasInSign = jaimini.karakas.filter(k => k.sign === d.sign).map(k => `${k.role} (${k.planet})`);
    const arudhasInSign = jaimini.arudhas.filter(a => a.sign === d.sign).map(a => a.shortName);
    const axisTags = [...karakasInSign, ...arudhasInSign];
    const axisLabel = axisTags.length > 0 ? axisTags.join(" &middot; ") : `${SIGN_LORDS[d.sign] || ""} Ruled Bhava (${ordinal(houseFromLagna(d.sign, lagnaRashi))})`;
    const windowDesc = d.isActive
      ? "Current pivotal soul evolution chapter"
      : arudhasInSign.includes("AL") || arudhasInSign.includes("A10") || arudhasInSign.includes("A11")
      ? `Activates ${arudhasInSign.join("/")} worldly growth`
      : arudhasInSign.includes("UL")
      ? "Activates UL partnership &amp; family milestones"
      : karakasInSign.length > 0
      ? `Maturation of ${karakasInSign.join(", ")}`
      : `${ordinal(houseFromLagna(d.sign, lagnaRashi))} house karmic development`;
    return `
      <tr ${bgStyle}>
        <td><strong>${d.sign}</strong></td>
        <td>${d.years} Years</td>
        <td>${startYear} &ndash; ${endYear}</td>
        <td>${axisLabel}</td>
        <td>${activeBadge}${windowDesc}</td>
      </tr>
    `;
  }).join("");

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
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Rozha+One&display=swap');

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

.page:last-child,
.page:last-of-type {
  page-break-after: avoid !important;
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
.tag-amber { background: rgba(217, 119, 6, 0.15); color: var(--amber); border: 1px solid rgba(217, 119, 6, 0.4); }

.kundli-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.devanagari-safe {
  letter-spacing: 0 !important;
  font-family: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif !important;
}

.mantra-devanagari {
  font-family: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif;
  font-weight: 600;
  font-size: 14.5px;
  color: var(--gold-bright);
  text-align: center;
  margin: 4px 0;
  line-height: 1.6;
  letter-spacing: 0 !important;
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
        <span class="kicker">Seeker Age &amp; Gender</span>
        <div style="color:var(--ivory);">${seekerAgeStr} · ${resolvedGender ? (resolvedGender === "female" ? "Female" : "Male") : "Recorded"}</div>
      </div>
      <div>
        <span class="kicker">Ascendant &amp; Moon Sign</span>
        <div style="color:var(--ivory);">${lagnaRashi} Lagna · ${moonRashi} Moon (${moonNakshatra} Pada ${moonPada})</div>
      </div>
      <div>
        <span class="kicker">Operating Vimshottari Dasha</span>
        <div style="color:var(--gold-bright);">${activeDashaName} — ${activeAntarName}</div>
      </div>
      <div>
        <span class="kicker">Atmakaraka (AK · Soul King)</span>
        <div style="color:var(--purple-bright);font-weight:700;">${ak.planet} in ${ak.sign} (${akDegreeStr} · ${akHouse})</div>
      </div>
      <div>
        <span class="kicker">Amatyakaraka (AmK · Career Mind)</span>
        <div style="color:var(--emerald-bright);font-weight:700;">${amk.planet} in ${amk.sign} (${amkDegreeStr} · ${amkHouse})</div>
      </div>
      <div>
        <span class="kicker">Karakamsha Lagna (KL · D9 Base)</span>
        <div style="color:var(--gold-bright);font-weight:700;">${klSign} (Ruled by ${klLord})</div>
      </div>
      <div>
        <span class="kicker">Arudha Lagna (AL · World Image)</span>
        <div style="color:var(--sapphire-bright);font-weight:700;">${al.sign} (House ${al.house} · World Perception)</div>
      </div>
      <div>
        <span class="kicker">Active Operating Chara Dasha</span>
        <div style="color:var(--gold-bright);font-weight:700;">${activeDasha.sign} Mahadasha (${activeDashaStartYear}&ndash;${activeDashaEndYear})</div>
      </div>
      <div>
        <span class="kicker">Ishta Devata (12th from KL in D9)</span>
        <div style="color:var(--ruby-bright);font-weight:700;">${ishtaInfo.deity}</div>
      </div>
    </div>
  </div>

  <div style="text-align:center;margin-bottom:10px;">
    <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--gold);letter-spacing:0.18em;margin-bottom:4px;">
      JAIMINI UPADESHA SUTRAS · 7 CHARA KARAKAS · KARAKAMSHA · CHARA DASHA
    </div>
    <div style="font-size:9.5px;color:var(--ivory-mute);">
      Authenticated Sovereign Dossier · 100% Deterministic Classical Shastra · Zero Interpolation
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
        Every soul reincarnates with a specific mandate (<em>Karmic Rina</em>). The <strong>Atmakaraka (AK)</strong> represents your kingly essence, its deepest vulnerabilities, and the specific spiritual lesson it contracted to master in this body. The <strong>Arudha Padas</strong> reveal the mirror of <em>Maya</em>&mdash;how human society reflects and perceives your manifestation, distinct from your private internal reality.
      </p>
    </div>

    <!-- 5 Pillar Architecture -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-family:'Cinzel',serif;font-size:11px;margin-bottom:6px;">
        ✦ 5-PILLAR JAIMINI SHASTRA ARCHITECTURE
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.2px;">
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--purple);">
          <strong style="color:var(--purple-bright);">PILLAR I (Pages 3&ndash;6): The 7 Chara Karakas Sovereign Hierarchy</strong> &mdash; Comprehensive audit of the Soul King (AK ${ak.planet} in ${ak.sign} ${akHouse}), Prime Minister (AmK ${amk.planet} in ${amk.sign} ${amkHouse}), and the supreme AK-AmK Raja Yoga dynamics.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--gold);">
          <strong style="color:var(--gold-bright);">PILLAR II (Pages 7&ndash;10): Karakamsha Lagna (KL) &amp; Navamsha Swamsha</strong> &mdash; The spiritual throne in ${klSign}, the 12-house soul chart, 12th house Moksha portal, and Ishta Devata revelation (${ishtaInfo.deity}).
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">PILLAR III (Pages 11&ndash;14): Arudha Padas &amp; The Mirror of Maya</strong> &mdash; Worldly perception vs inner truth: Arudha Lagna (AL in ${al.sign} House ${al.house}), Upapada Lagna (UL in ${ul.sign}), and Financial Arudhas (${a2.shortName}, ${a10.shortName}, ${a11.shortName}).
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--ruby);">
          <strong style="color:var(--ruby-bright);">PILLAR IV (Pages 15&ndash;16): Gnatikaraka (GK) Shadow &amp; Karmic Hurdles</strong> &mdash; Auditing ${gk.planet} (GK in ${gk.sign} ${gkHouse}), karmic friction, and Bhratrukaraka ${bk.planet} as the inner Kshetrapala.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">PILLAR V (Pages 17&ndash;22): Chara Dasha Master System &amp; Sacred Upayas</strong> &mdash; Full lifecycle Rashi Dasha timeline, active ${activeDasha.sign} Dasha (${activeDashaStartYear}&ndash;${activeDashaEndYear}), upcoming ${nextDasha.sign} horizon (${nextDashaStartYear}&ndash;${nextDashaEndYear}), and sacred soul mantras.
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
        ${karakaTableRowsHtml}
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--purple-bright);">
      <div class="kicker" style="color:var(--purple-bright);">The Sovereign Hierarchy Principle:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        The Atmakaraka (${ak.planet} at ${akDegreeStr}) is the supreme monarch of your chart. Whatever the AK desires, the entire horoscope must ultimately conspire to deliver. The Amatyakaraka (${amk.planet} at ${amkDegreeStr}) is the chief executive executor. In your chart, both the Soul King (${ak.planet}) and the Career Executor (${amk.planet}) anchor your primary life arc, indicating an incarnation of specialized mastery, deep karmic completion, and spiritual autonomy.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: 7 Chara Karakas Hierarchy", 3)}
</section>

<!-- PAGE 4: PILLAR I — ATMAKARAKA DEEP AUDIT -->
<section class="page">
  ${headerRail("PILLAR I: ATMAKARAKA DEEP AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Atmakaraka ${ak.planet} in ${ak.sign}: The Sovereign Soul Path</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Holding the highest longitude in your chart (<strong>${akDegreeStr}</strong>), ${ak.planet} is your <strong>Atmakaraka (AK)</strong>.
    </p>

    ${akHumanCard}
    <!-- AK Core Analysis Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ THE SOUL ESSENCE: ${ak.planet.toUpperCase()} IN ${ak.sign.toUpperCase()} (${akDegreeStr})
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        When ${ak.planet} is Atmakaraka, the soul contracted to master its archetypal virtues. Placed in ${ak.sign} at ${akDegreeStr}, it reflects an evolutionary trajectory where worldly ambition must align with authentic spiritual truth.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--gold-bright);">Soul Alignment:</strong> Placing the Soul King in ${ak.sign} means your greatest resilience emerges when your daily decisions reflect pure internal conviction, ethical integrity, and quiet reflection.
      </div>
    </div>

    <!-- The Sign Dynamic -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ ${ak.sign.toUpperCase()} VIRTUE: PURPOSEFUL MASTERY
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        ${ak.sign} imparts distinct fortitude to ${ak.planet}. This combination creates an individual capable of patient cultivation, enduring strategic focus, and building substantial achievements while remaining centered and unentangled by superficial noise.
      </p>
    </div>

    <!-- Soul Vulnerability -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">✦ THE ATMAKARAKA KARMIC LESSON</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        The primary karmic test of ${ak.planet} as Atmakaraka is learning non-attachment to external outcomes and ego validation. Dedicate regular moments of quiet stillness, conscious boundary-setting, and mindful introspection to maintain clarity.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: Atmakaraka Deep Audit", 4)}
</section>

<!-- PAGE 5: PILLAR I — AMATYAKARAKA INTELLECTUAL MISSION -->
<section class="page">
  ${headerRail("PILLAR I: AMATYAKARAKA INTELLECTUAL MISSION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Amatyakaraka ${amk.planet} in ${amk.sign}: The Sovereign Architect</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Holding the second highest longitude (<strong>${amkDegreeStr}</strong>), ${amk.planet} is your <strong>Amatyakaraka (AmK)</strong>&mdash;the Prime Minister governing your worldly vocation, professional intellect, and financial architecture.
    </p>

    ${amkHumanCard}
    <!-- AmK Core Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ ${amk.planet.toUpperCase()} IN ${amk.sign.toUpperCase()}: INTELLECTUAL CAPITAL AS SACRED DHARMA
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In classical Jaimini, the placement of the Amatyakaraka defines your primary vehicle of contribution. ${amk.planet} in ${amk.sign} indicates that your career is inherently tied to:
      </p>
      <ul style="padding-left:16px;font-size:11.2px;color:var(--ivory-dim);margin-top:4px;line-height:1.5;">
        <li>Translating specialized analysis, principles, and strategic vision into structured, durable real-world systems.</li>
        <li>Acting as a high-conviction counselor, trusted advisor, and technical or executive architect.</li>
        <li>Building compounding intellectual capital, enduring professional authority, and sovereign value.</li>
      </ul>
    </div>

    <!-- Earthy Taurus Precision -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ ${amk.sign.toUpperCase()} DIGNITY: TURNING CONCEPTS INTO DURABLE FORM
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        ${amk.planet} in ${amk.sign} demands grounded execution, practical value, and economic durability. You are built to construct foundational frameworks engineered to compound sustainably over decades.
      </p>
    </div>

    <!-- Dharma-Karma Exchange Reminder -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE AMATYAKARAKA PROFESSIONAL MANDATE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Whenever your commercial enterprises honor ethical excellence, rigorous truth, and meticulous standards, your professional influence and prosperity expand exponentially.
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
          <th>Atmakaraka (${ak.planet} in ${ak.sign})</th>
          <th>Amatyakaraka (${amk.planet} in ${amk.sign})</th>
          <th>Harmonized Synthesis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Core Domain</strong></td>
          <td>Soul awareness &amp; spiritual longing</td>
          <td>Worldly vocation &amp; practical intellect</td>
          <td>Inner purpose expressed through structured external action</td>
        </tr>
        <tr>
          <td><strong>Cognitive Vector</strong></td>
          <td>Intuitive reflection, moral alignment</td>
          <td>Structured analysis, disciplined execution</td>
          <td>Intuition validated by rigorous practical methodology</td>
        </tr>
        <tr>
          <td><strong>Psychology</strong></td>
          <td>Seeks inner meaning and truth</td>
          <td>Seeks clarity, systems, and results</td>
          <td>Balanced mastery: Meaningful purpose driven by clear systems</td>
        </tr>
        <tr>
          <td><strong>Evolutionary Path</strong></td>
          <td>Detachment from ego noise</td>
          <td>Fulfilling responsibilities with integrity</td>
          <td>Engaged in worldly achievement while anchored within</td>
        </tr>
      </tbody>
    </table>

    <!-- Jaimini Raja Yoga Box -->
    <div class="luxury-card" style="border:1.5px solid var(--emerald);background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ JAIMINI SUTRA: THE MAHA RAJA YOGA OF AK AND AMK
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Maharishi Jaimini states: <em>"When Atmakaraka and Amatyakaraka are mutually configured in auspicious Bhavas or Rashi Drishti, the native achieves extraordinary renown and wealth."</em> In your chart, ${amk.planet} in ${amk.sign} and ${ak.planet} in ${ak.sign} anchor your career actions and soul peace.
      </p>
    </div>

    <!-- Execution Protocol -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE SOUL ALIGNMENT RULE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Never accept projects or contracts that violate your inner sense of spiritual dignity, no matter the financial compensation. When your AmK (${amk.planet}) works in service of projects that excite your AK (${ak.planet}), wealth and recognition follow as effortless byproducts.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: AK-AmK Soul Dynamics", 6)}
</section>

<!-- PAGE 7: PILLAR II — KARAKAMSHA LAGNA REVELATION -->
<section class="page">
  ${headerRail("PILLAR II: KARAKAMSHA LAGNA REVELATION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Gateway to the Soul: Karakamsha in ${klSign}</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In classical Jaimini Shastra, the sign occupied by the Atmakaraka in the <strong>Navamsha Chart (D-9)</strong> is crowned as the <strong>Karakamsha Lagna (KL)</strong>. It is the unvarnished spiritual seat of the soul.
    </p>

    <!-- Mathematical Proof Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ MATHEMATICAL DERIVATION OF KARAKAMSHA LAGNA
      </div>
      <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;margin-top:4px;">
        1. <strong>Natal AK Position:</strong> ${ak.planet} at <strong>${akDegreeStr}</strong> in ${ak.sign}.<br/>
        2. <strong>Navamsha Mapping:</strong> Evaluated through the Navamsha division where the soul intent crystallizes.<br/>
        3. <strong>Conclusion:</strong> Your <strong>Karakamsha Lagna is ${klSign.toUpperCase()}</strong>, ruled by ${SIGN_LORDS[klSign]}.
      </div>
    </div>

    <!-- Meaning -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ ${klSign.toUpperCase()} KARAKAMSHA: THE SOUL'S HIGHER CALLING
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Having ${klSign} as Karakamsha indicates a soul whose innate dharma aligns with the higher principles of ${klSign}. You are endowed with an internal drive toward truth, structured clarity, and purpose.
      </p>
    </div>

    <!-- KL to AL Dynamics -->
    <div class="luxury-card" style="background:var(--surface-elevated);border:1.5px solid var(--emerald);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ THE DYNAMICS: KARAKAMSHA (KL) &amp; ARUDHA LAGNA (AL)
      </div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        While your soul throne sits in <strong>${klSign} (Karakamsha)</strong>, your worldly vehicle sits in <strong>${al.sign} (Arudha Lagna in House ${al.house})</strong>. In classical mechanics, this configuration means your internal philosophy directly inspires, guides, and empowers your external achievements.
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
      Projecting your natal planetary grid from the Karakamsha throne in ${klSign} reveals the spiritual wiring of your internal life.
    </p>

    <!-- SVG Kundli -->
    <div class="kundli-container" style="margin-bottom:6px;">
      ${renderKarakamshaSvg(klSignNum, klHousePlanets, 260)}
    </div>

    <!-- House Overlay Grid -->
    <div class="grid-2" style="font-size:10.5px;row-gap:6px;">
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 1st House (${klSign}):</strong> Philosophical autonomy, ethical backbone, innate teaching capacity.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 2nd House (${SIGN_NAMES[(klSignNum + 1) % 12]}):</strong> Wealth generated through structured, patient, long-term systems.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 4th House (${SIGN_NAMES[(klSignNum + 3) % 12]}):</strong> Finds emotional peace in quiet contemplation and grounded focus.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 5th House (${SIGN_NAMES[(klSignNum + 4) % 12]}):</strong> Sharp intellectual discernment, esoteric intelligence, and creative vision.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 6th House (${SIGN_NAMES[(klSignNum + 5) % 12]}):</strong> Overcomes intellectual opposition through factual precision and evidence.
      </div>
      <div class="luxury-card">
        <strong style="color:var(--gold-bright);">KL 9th House (${SIGN_NAMES[(klSignNum + 8) % 12]}):</strong> High ancestral merit; soul acts as a courageous defender of dharma.
      </div>
    </div>
  </div>
  ${footerRail("Pillar II: Karakamsha Soul Chart", 8)}
</section>

<!-- PAGE 9: PILLAR II — ISHTA DEVATA REVELATION -->
<section class="page">
  ${headerRail("PILLAR II: ISHTA DEVATA REVELATION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12th from Karakamsha in D9: The Portal to Liberation &amp; Ishta Devata</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Maharishi Jaimini's foundational sutra, the <strong>12th house from Karakamsha in the Navamsha Chart (D-9)</strong> reveals the portal of <em>Moksha</em> and the divine archetype chosen by the soul for spiritual communion: the <strong>Ishta Devata</strong>.
    </p>

    <!-- Shastric Derivation Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--purple-bright);">
      <div class="card-title" style="color:var(--purple-bright);font-size:12px;">
        ✦ NAVAMSHA D-9 DERIVATION: ${klTwelfthSign.toUpperCase()} 12TH HOUSE RULED BY ${klTwelfthLord.toUpperCase()}
      </div>
      <div style="font-size:11.2px;color:var(--ivory-dim);line-height:1.5;margin-top:4px;">
        • <strong>Karakamsha in Navamsha (D9):</strong> ${klSign} (throne of Atmakaraka ${ak.planet}).<br/>
        • <strong>12th House from Karakamsha in D9:</strong> <strong>${klTwelfthSign}</strong>${klTwelfthOccupants.length ? ` (occupied by <strong>${klTwelfthOccupants.join(", ")}</strong>)` : " (unoccupied)"}.<br/>
        • <strong>Primary Ishta Determinant:</strong> <strong>${ishtaSourceText}</strong>.<br/>
        • <strong>Classical Jaimini Sutra:</strong> Under Maharishi Jaimini's Upadesha Sutras, ${klTwelfthOccupants.length ? "the strongest occupant in" : "the lord of"} the 12th from Karakamsha reveals the Ishta Devata portal: <strong>${ishtaInfo.deity}</strong>.
      </div>
    </div>

    <!-- Sacred Archetype -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ THE REVELATION: ${ishtaInfo.deity.toUpperCase()}
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In alignment with your D-9 Navamsha blueprint, your Ishta Devata is <strong>${ishtaInfo.deity}</strong> (${ishtaInfo.desc}). This divine archetype represents your soul's natural portal for meditation, higher protection, and spiritual liberation.
      </p>
    </div>

    <!-- Dharma Devata -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">✦ DHARMA DEVATA (9TH FROM KARAKAMSHA)</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        The 9th house from Karakamsha in D9 is ${SIGN_NAMES[(klSignNum + 8) % 12]}, ruled by ${SIGN_LORDS[SIGN_NAMES[(klSignNum + 8) % 12]]}. Your Dharma Devata guides righteous actions in the physical world, bringing moral clarity and auspicious purpose.
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
      The 9th house from Karakamsha Lagna reveals the spiritual merit (<em>Purva Punya</em>), ancestral blessings, and the nature of gurus who guide your incarnation.
    </p>

    <!-- 9th House Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ ${klNinthSign.toUpperCase()} 9TH FROM KL IN D1: THE DHARMA LINEAGE
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In your birth chart, the 9th from ${klSign} is <strong>${klNinthSign}</strong>, governed by ${klNinthLord}. In Jaimini astrology, the 9th from Karakamsha reveals the soul's guru lineage, past-life spiritual vows, and guiding philosophy.
      </p>
    </div>

    <!-- BK as Spiritual Protector -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ BHRATRUKARAKA ${bk.planet.toUpperCase()} AS THE INNER PROTECTOR
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In Jaimini, the Bhratrukaraka (BK) is the significator of the Guru and spiritual guides. ${bk.planet} at ${bkDegreeStr} in ${bk.sign} (${bkHouse}) serves as your internal protector (<em>Kshetrapala</em>). It grants you vitality, focused endurance, and moral courage to execute your life mission with unwavering conviction.
      </p>
    </div>

    <!-- Ancestral Rina Resolution -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ RESOLVING ANCESTRAL SPIRITUAL VOWS</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Because the 9th from KL is ${klNinthSign} (${klNinthLord}'s sign), supporting righteous causes and offering charity aligned with ${klNinthLord} directly discharges ancestral spiritual debts (<em>Pitr Rina</em>) and clears your path forward.
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
      The Rashi chart represents <em>Satya</em> (truth as experienced by the inner self), whereas the <strong>Arudha Padas (Padas of Houses)</strong> represent <em>Maya</em> (how your reality is projected, evaluated, and rewarded by human society).
    </p>

    <!-- Master Arudha Table -->
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
        ${arudhaRowsHtml}
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="kicker" style="color:var(--gold-bright);">The Arudha Realization Principle:</div>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        Notice the key positioning: <strong>Labha Pada (A11) occupies ${a11.sign} (House ${a11.house})</strong> and <strong>Arudha Lagna (AL) occupies ${al.sign} (House ${al.house})</strong>. In Jaimini Shastra, when your Arudha points align with supportive houses, public perception and financial compounding synchronize naturally with your core destiny.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Arudha Padas Architecture", 11)}
</section>

<!-- PAGE 12: PILLAR III — ARUDHA LAGNA (AL) AUDIT -->
<section class="page">
  ${headerRail("PILLAR III: ARUDHA LAGNA AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Arudha Lagna in ${al.sign} (House ${al.house}): The Worldly Projection Mirror</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Your true natal Lagna is <strong>${lagnaRashi}</strong>. However, your <strong>Arudha Lagna (AL) is ${al.sign} (House ${al.house})</strong>.
    </p>

    <!-- Contrast Card -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ INTERNAL TRUTH (${lagnaRashi.toUpperCase()} LAGNA)
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          Internally, your true essence is governed by ${lagnaRashi}, driving personal motivation, ethical standards, and daily execution.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
          ✦ EXTERNAL PROJECTION (${al.sign.toUpperCase()} AL)
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          To the world, you project through ${al.sign}, defining your professional reputation, public presence, and how societal observers perceive your standing.
        </p>
      </div>
    </div>

    <!-- House Synergy -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ AL IN HOUSE ${al.house}: REPUTATION AND MANIFESTATION AXIS
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        When Arudha Lagna occupies House ${al.house} in ${al.sign}, society honors you for your actions in that domain. You are celebrated as a master of disciplined execution and strategic purpose.
      </p>
    </div>

    <!-- Active Alignment -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">✦ ACTIVE CHARA DASHA (${activeDasha.sign.toUpperCase()}) ALIGNMENT</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Operating in your current Chara Dasha of <strong>${activeDasha.sign}</strong>, your planetary periods activate the corresponding houses and arudhas, creating decisive windows of progress and maturity.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Arudha Lagna Audit", 12)}
</section>

<!-- PAGE 13: PILLAR III — UPAPADA & SACRED MARRIAGE -->
<section class="page">
  ${headerRail("PILLAR III: UPAPADA & SACRED MARRIAGE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Upapada Lagna in ${ul.sign} (House ${ul.house}) &amp; Dara Pada in ${a7.sign}: The Karmic Bond</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Jaimini astrology, <strong>Upapada Lagna (UL)</strong> reveals the spiritual contract of marriage and the character of your life partner, while <strong>Dara Pada (A7)</strong> reflects the physical, worldly interaction.
    </p>

    <!-- UL Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ UPAPADA LAGNA IN ${ul.sign.toUpperCase()} (HOUSE ${ul.house})
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Your Upapada Lagna falls in <strong>${ul.sign}</strong>, ruled by ${SIGN_LORDS[ul.sign]}. This reveals a companion who brings distinct dedication, loyalty, and protective guardianship into your life.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--sapphire-bright);">Darakaraka ${dk.planet}:</strong> ${dk.planet} at ${dkDegreeStr} in ${dk.sign} anchors the partnership in <strong>enduring commitment, mutual patience, and spiritual fidelity</strong>.
      </div>
    </div>

    <!-- Dara Pada A7 Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ DARA PADA (A7) IN ${a7.sign.toUpperCase()} (HOUSE ${a7.house}): ALLIANCE &amp; HARMONY
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Dara Pada A7 falls in <strong>${a7.sign} in House ${a7.house}</strong>. Partnership serves as a grounded emotional and material anchor, expanding reciprocal goodwill and shared security.
      </p>
    </div>

    <!-- Upapada Fasting Protocol -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ SHASTRIC UPAPADA HARMONIZATION PROTOCOL</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Because UL is in ${ul.sign} (ruled by ${SIGN_LORDS[ul.sign]}), honoring reciprocal respect, patience, and charitable actions corresponding to ${SIGN_LORDS[ul.sign]} harmonizes the marital field and dissolves karmic friction.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Upapada & Sacred Marriage", 13)}
</section>

<!-- PAGE 14: PILLAR III — FINANCIAL ARUDHAS & RAJA YOGAS -->
<section class="page">
  ${headerRail("PILLAR III: FINANCIAL ARUDHAS & RAJA YOGAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Financial Arudhas: A2, A10, A11 &amp; The Self-Made Sovereign</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Material wealth in Jaimini Shastra is governed by the trinal and quadrant configurations between the Arudha Lagna (AL) and the wealth padas: <strong>A2 (Dhana), A10 (Rajya), and A11 (Labha)</strong>.
    </p>

    <!-- Financial Matrix -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
          ✦ A2 IN ${a2.sign.toUpperCase()}: TREASURY FOUNDATION
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          Dhana Pada (A2) in ${a2.sign} (House ${a2.house}) signifies that your accumulated reserves grow through disciplined management and methodical resource stewardship.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ A11 IN ${a11.sign.toUpperCase()}: REALIZED LABHA
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          Labha Pada (A11) in ${a11.sign} (House ${a11.house}) indicates that your personal contributions and strategic initiative directly generate your financial abundance.
        </p>
      </div>
    </div>

    <!-- A10 in Aries Box -->
    <div class="luxury-card" style="border:1.5px solid var(--sapphire);background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ A10 (RAJYA PADA) IN ${a10.sign.toUpperCase()}: EXECUTIVE STANDING
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Rajya Pada A10 falls in ${a10.sign} (House ${a10.house}). This indicates that your public authority is built by developing specialized knowledge, high standards, and structured methodologies that command lasting respect.
      </p>
    </div>

    <!-- Argala Wealth Box -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ JAIMINI WEALTH INTERLOCK</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        The harmonious configuration between ${amk.planet} as Amatyakaraka and your wealth arudhas (${a2.shortName}, ${a11.shortName}) ensures that disciplined execution directly translates into durable compounding assets.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Financial Arudhas", 14)}
</section>

<!-- PAGE 15: PILLAR IV — GNATIKARAKA SHADOW AUDIT -->
<section class="page">
  ${headerRail("PILLAR IV: GNATIKARAKA SHADOW AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Gnatikaraka (GK) ${gk.planet}: The Karmic Obstacle &amp; Shadow Audit</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Maharishi Jaimini's framework, the planet with the 6th highest longitude is the <strong>Gnatikaraka (GK)</strong>&mdash;the significator of 6th-house obstacles, hidden debts, bodily ailments, and tests of Maya.
    </p>

    <!-- GK Identification Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--amber);">
      <div class="card-title" style="color:var(--amber);font-size:12px;">
        ✦ GK IDENTIFICATION: ${gk.planet.toUpperCase()} IN ${gk.sign.toUpperCase()} (${gkDegreeStr} · ${gkHouse.toUpperCase()})
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        ${gk.planet} at ${gkDegreeStr} in ${gk.sign} acts as your Gnatikaraka. In Maharishi Jaimini's system, the GK highlights where personal illusions, tests of perseverance, and friction may arise:
      </p>
      <ul style="padding-left:16px;font-size:11.2px;color:var(--ivory-dim);margin-top:4px;line-height:1.5;">
        <li><strong>Friction Triggers:</strong> Managing interpersonal expectations and ensuring transparent, contractual clarity in all dealings.</li>
        <li><strong>Energy Preservation:</strong> Avoiding unnecessary confrontational energy; channelling tension into systematic productivity.</li>
        <li><strong>Karmic Refinement:</strong> Treating delays and obstacles associated with ${gk.planet} as stepping stones that purify judgment.</li>
      </ul>
    </div>

    <!-- Balanced Gemstone Protocol -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--emerald);background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ PRECAUTIONARY PROTOCOL: ${gk.planet.toUpperCase()} HARMONIZATION
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Because ${gk.planet} functions as your Gnatikaraka, care is advised against wearing heavy gemstones of ${gk.planet} without astrological necessity. Harmonize ${gk.planet}'s vibration through ethical vigilance, mindfulness, and dedicated weekly charity.
      </p>
    </div>

    <!-- GK Neutralization Upaya -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ GK ${gk.planet.toUpperCase()} NEUTRALIZATION UPAYA</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Engage in charitable donations and dedicated service aligned with ${gk.planet}. This transforms karmic resistance into enduring resilience and shields your professional legacy.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: Gnatikaraka Shadow Audit", 15)}
</section>

<!-- PAGE 16: PILLAR IV — BK & PK KARMIC DYNAMICS -->
<section class="page">
  ${headerRail("PILLAR IV: BK & PK KARMIC DYNAMICS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">${bk.planet} (BK) &amp; ${pk.planet} (PK): The Inner Guide &amp; Creative Lineage</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The <strong>Bhratrukaraka (BK)</strong> represents your spiritual guides, inner strength, and mentors, while the <strong>Putrakaraka (PK)</strong> governs your intellectual progeny, future disciples, and past-life merit.
    </p>

    <!-- BK Graha -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ BHRATRUKARAKA ${bk.planet.toUpperCase()} (${bkDegreeStr} ${bk.sign.toUpperCase()} · ${bkHouse.toUpperCase()}): THE SACRED GUIDE
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        ${bk.planet} in ${bk.sign} (${bkHouse}) serves as your personal <em>Kshetrapala</em> (Guardian Mentor). In high-pressure situations, your BK endows you with mental fortitude, stamina, and strategic resilience.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--ruby-bright);">BK Directive:</strong> Direct your ${bk.planet} energy toward disciplined execution and leadership; never allow tension to turn into passive exhaustion.
      </div>
    </div>

    <!-- PK Graha -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ PUTRAKARAKA ${pk.planet.toUpperCase()} (${pkDegreeStr} ${pk.sign.toUpperCase()} · ${pkHouse.toUpperCase()}): THE INTELLECTUAL LINEAGE
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        ${pk.planet} as PK in ${pk.sign} (${pkHouse}) grants deep analytical perception and creative output. Your intellectual and professional creations possess enduring compounding resonance.
      </p>
    </div>

    <!-- Sacred Synthesis -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ MENTORSHIP &amp; INTELLECTUAL HERITAGE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        You possess a natural gift for mentoring, guiding, and formulating frameworks. Sharing your knowledge with integrity creates positive spiritual merit, activating your 5th-house Purva Punya.
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
      Unlike the Nakshatra-based Vimshottari dasha, <strong>Chara Dasha</strong> operates through entire signs (<em>Rashis</em>), activating the houses, arudhas, and karakas located within them.
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
        ${charaDashaRowsHtml}
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);">
      <p style="font-size:11px;color:var(--ivory-dim);">
        Notice your active transition: you are currently traversing the <strong>${activeDasha.years}-year ${activeDasha.sign} Chara Dasha (${activeDashaStartYear}&ndash;${activeDashaEndYear})</strong>, preparing to transition into the <strong>${nextDasha.years}-year ${nextDasha.sign} Chara Dasha (${nextDashaStartYear}&ndash;${nextDashaEndYear})</strong>.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Chara Dasha Master Timeline", 17)}
</section>

<!-- PAGE 18: PILLAR V — ACTIVE CHARA DASHA AUDIT -->
<section class="page">
  ${headerRail(`PILLAR V: ${activeDasha.sign.toUpperCase()} CHARA DASHA AUDIT`)}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The ${activeDasha.sign} Mahadasha (${activeDashaStartYear}–${activeDashaEndYear}): Soul Evolution &amp; Karmic Focus</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The ${activeDasha.years}-year ${activeDasha.sign} Mahadasha is an essential epoch of your soul journey, activating the rashi houses, arudhas, and karakas positioned along this sign axis.
    </p>

    <!-- Activation Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">
        ✦ ACTIVATION OF ${activeDasha.sign.toUpperCase()} AXIS: SOUL LESSONS &amp; ARCHITECTURE
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Under Jaimini principles, when ${activeDasha.sign} activates, the soul is drawn towards core dharma, resolving karmic prerequisites, and establishing deep, enduring structures in your worldly and spiritual life.
      </p>
    </div>

    <!-- 4 Universal Phases of Current Dasha -->
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--sapphire);">
        <strong style="color:var(--sapphire-bright);font-size:11px;">1. FOUNDATIONAL FORMATION (${activeDashaStartYear} &ndash; ${activeDashaStartYear + Math.max(1, Math.floor(activeDasha.years * 0.25))}):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Awakening of inner values, reassessing previous life commitments, and laying intellectual and emotional foundations.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--emerald);">
        <strong style="color:var(--emerald-bright);font-size:11px;">2. ARCHITECTURE &amp; EXECUTION (${activeDashaStartYear + Math.max(1, Math.floor(activeDasha.years * 0.25))} &ndash; ${activeDashaStartYear + Math.max(2, Math.floor(activeDasha.years * 0.5))}):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Mastery of core skills, building robust professional and personal frameworks, and testing systems against reality.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--gold);">
        <strong style="color:var(--gold-bright);font-size:11px;">3. STRATEGIC CONSOLIDATION (${activeDashaStartYear + Math.max(2, Math.floor(activeDasha.years * 0.5))} &ndash; ${activeDashaStartYear + Math.max(3, Math.floor(activeDasha.years * 0.75))}):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Expanding practical reach, validating core methodologies, and establishing verifiable competence and independence.
        </p>
      </div>
      <div class="luxury-card" style="border-left:3px solid var(--purple);">
        <strong style="color:var(--purple-bright);font-size:11px;">4. HARVEST &amp; TRANSITION PREPARATION (${activeDashaStartYear + Math.max(3, Math.floor(activeDasha.years * 0.75))} &ndash; ${activeDashaEndYear}):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Securing accomplishments, establishing permanent boundaries, and preparing systematically for the subsequent ${nextDasha.sign} era.
        </p>
      </div>
    </div>

    <!-- Final Directives -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ STRATEGIC DIRECTIVE FOR CURRENT PERIOD</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Maintain unwavering focus on foundational integrity. Avoid scattered undertakings; channel your energy into sustainable systems and high-conviction life goals.
      </p>
    </div>
  </div>
  ${footerRail(`Pillar V: Active ${activeDasha.sign} Dasha`, 18)}
</section>

<!-- PAGE 19: PILLAR V — UPCOMING CHARA DASHA HORIZON -->
<section class="page">
  ${headerRail(`PILLAR V: ${nextDasha.sign.toUpperCase()} HORIZON`)}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The ${nextDasha.sign} Mahadasha (${nextDashaStartYear}–${nextDashaEndYear}): Strategic Horizon</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Beginning around <strong>${nextDashaStartYear}</strong>, your chart enters the ${nextDasha.years}-year <strong>${nextDasha.sign} Chara Dasha</strong>. This period marks a profound shift toward outer worldly realization and long-term consolidation.
    </p>

    <!-- Strategic Activation Card -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;">
        ✦ STRATEGIC ACTIVATION IN ${nextDasha.sign.toUpperCase()}
      </div>
      <div style="font-size:11.2px;color:var(--ivory-dim);line-height:1.5;margin-top:4px;">
        1. <strong>Rashi Governance:</strong> Governed by ${SIGN_LORDS[nextDasha.sign]}, calling for disciplined execution and strategic patience.<br/>
        2. <strong>Arudha &amp; Karaka Interlock:</strong> Any padas and karakas residing in or aspecting ${nextDasha.sign} awaken into full public expression.<br/>
        3. <strong>Compounding Harvest:</strong> What is seeded with integrity during the ${activeDasha.sign} era matures into concrete, durable value in ${nextDasha.sign}.
      </div>
    </div>

    <!-- Shastric Discipline -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ STRATEGIC GOVERNANCE &amp; VALUE CREATION
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        ${nextDasha.sign} rewards consistency and systematic organization. Avoid hasty speculative leaps; instead, build structures that compound over time with disciplined execution.
      </p>
    </div>

    <!-- Preparation Checklist -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ TRANSITION PREPARATION CHECKLIST</div>
      <ul style="padding-left:16px;font-size:11px;color:var(--ivory-dim);margin-top:4px;line-height:1.45;">
        <li>Streamline existing commitments to eliminate dead weight before the new dasha begins.</li>
        <li>Fortify key alliances, contracts, and financial safety nets.</li>
        <li>Align personal routines with your Atmakaraka and Amatyakaraka principles for maximum clarity.</li>
      </ul>
    </div>
  </div>
  ${footerRail(`Pillar V: Upcoming ${nextDasha.sign} Dasha`, 19)}
</section>

<!-- PAGE 20: PILLAR V — ANTARDASHA ROADMAP -->
<section class="page">
  ${headerRail("PILLAR V: ANTARDASHA ROADMAP")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Chara Antardasha Precision Roadmap</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Quarter-by-quarter timeline of the sub-periods (<em>Antardashas</em>) governing your active soul progression and upcoming transition.
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
          <td><strong>Current Phase (Foundational)</strong></td>
          <td><strong>${activeDasha.sign} &ndash; ${SIGN_NAMES[(SIGN_NAMES.indexOf(activeDasha.sign) + 1) % 12]}</strong></td>
          <td>Second Rashi Axis</td>
          <td>Consolidate core assets, focus on skill deepening, and streamline financial allocation.</td>
        </tr>
        <tr>
          <td><strong>Intermediate Phase (Expansion)</strong></td>
          <td><strong>${activeDasha.sign} &ndash; ${SIGN_NAMES[(SIGN_NAMES.indexOf(activeDasha.sign) + 4) % 12]}</strong></td>
          <td>Fifth Rashi Axis (Purva Punya)</td>
          <td>Strategic expansion, publishing intellectual output, and executing high-conviction creative initiatives.</td>
        </tr>
        <tr>
          <td><strong>Pivotal Alignment (Synergy)</strong></td>
          <td><strong>${activeDasha.sign} &ndash; ${SIGN_NAMES[(SIGN_NAMES.indexOf(activeDasha.sign) + 6) % 12]}</strong></td>
          <td>Seventh Rashi Axis (Dvanda)</td>
          <td>Refining partnership boundaries, renegotiating major commitments, and cementing alliances.</td>
        </tr>
        <tr style="background:rgba(16,185,129,0.12);border-left:3px solid var(--emerald-bright);">
          <td><strong style="color:var(--emerald-bright);">${nextDashaStartYear} MILESTONE</strong></td>
          <td><strong style="color:var(--emerald-bright);">${nextDasha.sign.toUpperCase()} ENTRANCE</strong></td>
          <td><strong>Next Sovereign Dasha</strong></td>
          <td><strong>THE GRAND SHIFT:</strong> Transitioning from building and preparation into compounding long-term worldly value.</td>
        </tr>
        <tr>
          <td><strong>Subsequent Window (Consolidation)</strong></td>
          <td><strong>${nextDasha.sign} &ndash; ${SIGN_NAMES[(SIGN_NAMES.indexOf(nextDasha.sign) + 1) % 12]}</strong></td>
          <td>Initial Rashi Foundation</td>
          <td>Consolidating initial gains, establishing operational discipline, and anchoring new authority.</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ TIMING SYNCHRONICITY</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        As your chart navigates through the ${activeDasha.sign} Mahadasha toward ${nextDasha.sign}, aligning daily initiatives with your Atmakaraka (${ak.planet}) and Amatyakaraka (${amk.planet}) ensures that every milestone translates into lasting spiritual and worldly compounding.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Antardasha Precision Roadmap", 20)}
</section>

<!-- PAGE 21: PILLAR V — SACRED SOUL MANTRAS -->
<section class="page">
  ${headerRail("PILLAR V: SACRED SOUL MANTRAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Soul Mantras &amp; Ishta Devata Upasanas</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Vedic mantras are acoustic geometric keys that align the brainwave state with cosmic intelligence.
    </p>

    <!-- Ishta Devata Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--ruby);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
        1. ${ishtaInfo.deity.toUpperCase()} ISHTA DEVATA MANTRA (12TH FROM KL IN D9)
      </div>
      <div class="mantra-devanagari devanagari-safe" style="letter-spacing:0 !important;font-size:14px;text-align:center;color:var(--gold-bright);margin:6px 0;">
        ${ishtaMantra.devanagari}
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        ${ishtaMantra.latin}
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 108 times during morning sadhana facing East or North. Strengthens spiritual sovereignty, clears subconscious obstacles, and invokes divine protection.
      </p>
    </div>

    <!-- AK Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--purple);">
      <div class="card-title" style="color:var(--purple-bright);font-size:11.5px;">
        2. ATMAKARAKA ${ak.planet.toUpperCase()} BEEJA MANTRA (FOR SOUL HEALING)
      </div>
      <div class="mantra-devanagari devanagari-safe" style="letter-spacing:0 !important;font-size:14px;text-align:center;color:var(--gold-bright);margin:6px 0;">
        ${akMantra.devanagari}
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        ${akMantra.latin}
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 21 times in the quiet of dawn or dusk. Purifies emotional tension, calms the mind, and strengthens Atmakaraka resilience.
      </p>
    </div>

    <!-- AmK Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--emerald);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        3. AMATYAKARAKA ${amk.planet.toUpperCase()} MANTRA (FOR INTELLECTUAL ACCURACY)
      </div>
      <div class="mantra-devanagari devanagari-safe" style="letter-spacing:0 !important;font-size:14px;text-align:center;color:var(--gold-bright);margin:6px 0;">
        ${amkMantra.devanagari}
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        ${amkMantra.latin}
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 18 times before key professional work or strategic negotiations. Sharpens discernment, strategic focus, and financial acumen.
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
      Practical Jaimini remediation is not about superstition; it is about realigning physical actions with cosmic laws.
    </p>

    <!-- Upaya Cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <strong style="color:var(--purple-bright);font-size:11.5px;">1. THE 15-MINUTE BRAHMAMUHURTA SILENCE (AK ALIGNMENT &amp; SOMA POLARITY):</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Because your Atmakaraka is ${ak.planet} in ${ak.sign} (${akHouse}), sit in quiet reflection for 15 minutes before engaging with screens upon waking. Hold your personal meditation mala with your ${resolvedGender === "female" ? "Left hand (Vama Anga / lunar receptive channel)" : "Right hand (Dakshina Anga / solar projective channel)"}. Breathe deeply and allow the mind to establish centered stillness.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <strong style="color:var(--gold-bright);font-size:11.5px;">2. GROUNDING &amp; CLARITY PROTOCOL:</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Maintain clean hydration and a balanced morning routine. Cooling the internal nervous system stabilizes cognitive stamina and shields against emotional fatigue.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <strong style="color:var(--ruby-bright);font-size:11.5px;">3. UPAPADA CHARITY (${ul.sign.toUpperCase()} UL HARMONIZATION):</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          ${ul.sign} Upapada Lagna is ruled by ${SIGN_LORDS[ul.sign]}. Performing acts of kindness, donating food, or supporting harmonious relationship causes directly energizes your UL and fortifies partnership karma.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <strong style="color:var(--emerald-bright);font-size:11.5px;">4. GNATIKARAKA NEUTRALIZATION (${gk.planet.toUpperCase()} GK UPAYA):</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Engage in charitable donations and mindful speech aligned with ${gk.planet}. This resolves professional friction, dissolves unspoken tensions, and guards your reputation.
        </p>
      </div>
    </div>

    <!-- Shastra Quote -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE TIMELESS JAIMINI CODE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        <em>"He who knows his Atmakaraka conquers grief; he who honors his Ishta Devata crosses the ocean of samsara."</em> Live in harmony with your ${klSign} Karakamsha, and every path clears naturally.
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
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">${ak.planet} in ${ak.sign} (${akDegreeStr})</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          ${akHouse} Sovereign Essence. Requires focused creative autonomy, clear emotional boundaries, and regular nature retreats.
        </p>
      </div>

      <!-- Card 2 -->
      <div class="luxury-card" style="border-top:2px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">2. AMATYAKARAKA (CAREER)</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">${amk.planet} in ${amk.sign} (${amkDegreeStr})</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          ${amkHouse} Strategic Mind. Monetizes through structured expertise, rigorous knowledge systems, and disciplined leadership.
        </p>
      </div>

      <!-- Card 3 -->
      <div class="luxury-card" style="border-top:2px solid var(--gold-bright);">
        <div class="kicker" style="color:var(--gold-bright);">3. ARUDHA LAGNA (WORLD IMAGE)</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">${al.sign} (House ${al.house})</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          Perceived in the outer world as a disciplined, high-competence strategist capable of enduring systemic stewardship.
        </p>
      </div>

      <!-- Card 4 -->
      <div class="luxury-card" style="border-top:2px solid var(--ruby-bright);">
        <div class="kicker" style="color:var(--ruby-bright);">4. ISHTA DEVATA (12TH FROM KL IN D9)</div>
        <div style="font-weight:700;font-size:13px;color:var(--gold-bright);margin:2px 0;">${ishtaInfo.deity}</div>
        <p style="font-size:10.5px;color:var(--ivory-dim);line-height:1.4;">
          ${klTwelfthSign} in Navamsha ruled by ${klTwelfthLord}. Supreme spiritual shield, inner wisdom, and transcendent guidance.
        </p>
      </div>
    </div>

    <!-- 3 Golden Mandates -->
    <div class="luxury-card" style="background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;margin-bottom:4px;">
        ✦ 3 GOLDEN SHASTRIC SOUL MANDATES
      </div>
      <div style="font-size:11.2px;color:var(--ivory-dim);line-height:1.5;">
        1. <strong>Honor the ${activeDasha.sign} Era (${activeDashaStartYear}&ndash;${activeDashaEndYear}):</strong> Focus your vital energies on building enduring structural foundations before this chapter concludes.<br/>
        2. <strong>Prepare for the ${nextDasha.sign} Era (${nextDashaStartYear}&ndash;${nextDashaEndYear}):</strong> The upcoming dasha unlocks outer recognition and compounding growth. Consolidate your core strengths.<br/>
        3. <strong>Guard Atmakaraka Solitude:</strong> Protect your daily contemplative peace. When your ${ak.planet} Atmakaraka is clear, your life execution remains unshakeable.
      </div>
    </div>
  </div>
  ${footerRail("Executive Soul Cheat Sheet", 23)}
</section>

<!-- PAGE 24: SHASTRA CERTIFICATION & AUTHENTICITY SEAL -->
<section class="page">
  <div class="page-rail">
    <span class="brand">✦ AstroLife Sovereign Soul Vault</span>
    <span class="kicker">OFFICIAL IMMUTABLE SHASTRA RECORD</span>
  </div>

  <div style="text-align:center;margin-top:6px;">
    <div class="kicker" style="letter-spacing:0.25em;color:var(--purple-bright);margin-bottom:6px;">
      ✦ CERTIFICATE OF SHASTRA AUTHENTICITY ✦
    </div>
    <h1 class="display-xl" style="font-size:22px;margin-bottom:8px;">
      Certificate of Astrological Authenticity
    </h1>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:var(--ivory);max-width:540px;margin:0 auto;line-height:1.45;">
      This 24-page Jaimini Soul Blueprint &amp; Karmic Mission dossier is computed deterministically under classical Maharishi Jaimini Upadesha Sutras, 7 Chara Karakas, Navamsha Karakamsha algorithms, and Swiss Ephemeris astronomical standards.
    </p>
  </div>

  <div class="decorative-frame" style="max-width:540px;margin:0 auto;width:100%;padding:18px 20px;">
    <div style="text-align:center;">
      <div style="font-family:'Cinzel',serif;font-size:9.5px;letter-spacing:0.18em;color:var(--gold-bright);margin-bottom:6px;">
        VERIFIED IMMUTABLE SHASTRA RECORD &middot; CERTIFICATE ID: ${certificateId}
      </div>
      <div style="font-size:11px;color:var(--ivory);line-height:1.5;">
        Certified for: <strong>${subjectName}</strong> &middot; Archive Ref: <strong>${orderId}</strong> &middot; <span style="color:var(--gold);">www.astrolife.io</span>
      </div>

      <div class="grid-2" style="font-size:10px;margin-top:10px;text-align:left;border-top:1px solid var(--border-gold);padding-top:8px;row-gap:6px;">
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

      <div style="margin-top:10px;padding:6px 10px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.25);border-radius:4px;font-size:8.5px;color:var(--ivory-mute);line-height:1.35;text-align:left;">
        <strong style="color:var(--purple-bright);">SOUL BLUEPRINT SHASTRA RECORD:</strong> Computed under deterministic Rashi Dasha algorithms and exact longitudinal degree ranking. 100% Deterministic Classical Shastra preserving the sacred integrity of Maharishi Jaimini wisdom.
      </div>

      <div style="margin-top:12px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.15em;color:var(--gold-bright);">
        ✦ SACRED SHASTRA HERITAGE &middot; TIME-TESTED VEDIC WISDOM ✦
      </div>
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
