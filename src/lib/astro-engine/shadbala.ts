// ============================================================
// ASTROLIFE SHADBALA ENGINE v2.0
// Extracted from AstroLife_v20_SwissEphem_Accurac
// 6-Factor Planetary Strength System
// ============================================================

export interface ShadbalaPlanet {
  planet:       string;
  icon:         string;
  color:        string;
  sign:         string;
  house:        number;
  retrograde:   boolean;
  sthanaBala:   number;
  digBala:      number;
  kalaBala:     number;
  cheshtaBala:  number;
  naisargika:   number;
  drikBala:     number;
  total:        number;
  percentage:   number;
  grade:        "Excellent" | "Strong" | "Moderate" | "Weak" | "Very Weak";
  gradeColor:   string;
  sthanaTxt:    string;
  digTxt:       string;
  kalaTxt:      string;
  cheshtaTxt:   string;
  drikTxt:      string;
  overallTxt:   string;
  sthanaDef:    string;
  digDef:       string;
  kalaDef:      string;
  cheshtaDef:   string;
  naisargikaDef:string;
  drikDef:      string;
}

export interface ShadbalaResult {
  planets:     ShadbalaPlanet[];
  strongest:   string;
  weakest:     string;
  avgStrength: number;
  summary:     string;
}

interface PD {
  house:      number;
  sign:       string;
  signNum:    number;
  retrograde: boolean;
  dignity:    string;
  lon:        number;
}

// ── Constants ─────────────────────────────────────────────────
const PLANET_LIST = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const ICONS  = ["☉","☽","♂","☿","♃","♀","♄"];
const COLORS = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa"];
const SIGNS  = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

const UCH: Record<string,number> = {
  Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6
};
const OWN: Record<string,number[]> = {
  Sun:[4], Moon:[3], Mars:[0,7], Mercury:[2,5],
  Jupiter:[8,11], Venus:[1,6], Saturn:[9,10]
};
const DIG_HOUSE: Record<string,number> = {
  Sun:10, Mars:10, Moon:4, Venus:4,
  Mercury:1, Jupiter:1, Saturn:7
};
const NAISARGIKA: Record<string,number> = {
  Sun:7, Moon:6, Venus:6, Jupiter:7, Mercury:5, Mars:5, Saturn:4
};

const md = (x: number, m: number) => ((x % m) + m) % m;

// Classical Bala descriptions
const BALA_DESC = {
  Sthana:    "Sthana Bala — Is planet ko apni jagah kitni takat milti hai. Uchcha (exalted) mein ho to maximum strength. Own sign mein ho to ghar jaisa aaram. Neecha (debilitated) mein bahut kamzor. Yeh planet ki mool takat hai — baaki sab iske upar build hota hai.",
  Dig:       "Dig Bala — Disha ki takat. Har planet ek specific ghar mein sabse zyada powerful hota hai — jaise Sun/Mars 10th mein, Moon/Venus 4th mein, Mercury/Jupiter 1st mein, Saturn 7th mein. Jitna us ghar ke paas, utni zyada disha-shakti.",
  Kala:      "Kala Bala — Samay ki takat. Din mein Sun, Jupiter, Venus strong hote hain. Raat mein Moon, Mars, Saturn. Agar planet apne samay mein ho to results jaldi aate hain.",
  Cheshta:   "Cheshta Bala — Kriya-shakti. Planet retro (vakri) ho to extra effort dikhata hai — results intense hote hain par delay ke saath. Direct motion mein smooth delivery hoti hai.",
  Naisargika:"Naisargika Bala — Prakriti ki takat. Yeh permanent hai — Jupiter sabse zyada naturally powerful, phir Venus, Sun, Moon, Saturn, Mars, Mercury. Yeh kisi bhi situation mein nahi badlti.",
  Drik:      "Drik Bala — Drishti ki takat. Benefic (Jupiter, Venus) ka aspect mile to strength badhti hai. Malefic (Saturn, Mars, Rahu) ka aspect ho to kamzori aati hai.",
};

// ── MAIN SHADBALA CALCULATOR ──────────────────────────────────
export function calculateShadbala(
  planets: Record<string, PD>
): ShadbalaResult {
  const results: ShadbalaPlanet[] = [];

  PLANET_LIST.forEach((planet, pi) => {
    const pd = planets[planet];
    if (!pd) return;

    const rashi = pd.signNum;

    // ── 1. STHANA BALA (Positional Strength) ─────────────────
    let sthanaBala: number;
    let sthanaTxt: string;

    if (UCH[planet] === rashi) {
      sthanaBala = 10;
      sthanaTxt = `Yeh apni uchcha rashi ${SIGNS[rashi]} mein hai — positional strength poori tarah se milti hai. Planet apna absolute best deta hai. Classical maximum strength.`;
    } else if (OWN[planet]?.includes(rashi)) {
      sthanaBala = 7;
      sthanaTxt = `Yeh apni sva rashi ${SIGNS[rashi]} mein hai — ghar jaisi comfort, natural expression milti hai. Strong placement.`;
    } else if (rashi === (UCH[planet] + 6) % 12) {
      sthanaBala = 1;
      sthanaTxt = `Yeh neecha rashi ${SIGNS[rashi]} mein hai — positional strength bahut kam hai. Upay aur timing important hai. Neecha bhanga check zaroor karo.`;
    } else if (rashi === (UCH[planet] + 2) % 12 || rashi === (UCH[planet] + 10) % 12) {
      sthanaBala = 5;
      sthanaTxt = `Neutral rashi ${SIGNS[rashi]} mein hai — average strength. Mixed results, dasha timing pe zyada depend karega.`;
    } else {
      sthanaBala = 4;
      sthanaTxt = `Shatru ya neutral rashi ${SIGNS[rashi]} mein — kuch friction ho sakta hai. Planet ko apni full force express karne mein struggle hoga.`;
    }

    // ── 2. DIG BALA (Directional Strength) ───────────────────
    const peakHouse = DIG_HOUSE[planet];
    const houseDiff = Math.abs(((pd.house - peakHouse + 6) % 12) - 6);
    const digBala   = Math.max(2, Math.round(10 - houseDiff * 1.5));
    const digTxt    = pd.house === peakHouse
      ? `Dig bala poori hai (10/10) — H${pd.house} mein yeh planet peak directional strength pe hai. Sabse effective house yahi hai.`
      : `Dig bala ${digBala}/10 — Peak H${peakHouse} mein hota, yahan H${pd.house} mein hai. ${digBala >= 7 ? "Achhi strength hai." : digBala >= 5 ? "Average strength." : "Kam strength — direction se distance zyada hai."}`;

    // ── 3. KALA BALA (Temporal Strength) ─────────────────────
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    const dayPlanets   = ["Sun","Jupiter","Venus"];
    const nightPlanets = ["Moon","Mars","Saturn"];
    let kalaBala: number;
    let kalaTxt: string;

    if (dayPlanets.includes(planet)) {
      kalaBala = isDay ? 7 : 4;
      kalaTxt  = isDay
        ? `${planet} din ka planet hai aur abhi din hai — Kala bala strong (7/10). Results tez aate hain.`
        : `${planet} din ka planet hai par abhi raat hai — Kala bala thoda kam (4/10). Din mein zyada active rahega.`;
    } else if (nightPlanets.includes(planet)) {
      kalaBala = isDay ? 4 : 7;
      kalaTxt  = !isDay
        ? `${planet} raat ka planet hai aur abhi raat hai — Kala bala strong (7/10). Raat mein zyada powerful.`
        : `${planet} raat ka planet hai par abhi din hai — Kala bala thoda kam (4/10).`;
    } else {
      kalaBala = 5;
      kalaTxt  = `${planet} (Mercury) din aur raat dono mein moderate strength rakhta hai — Kala bala 5/10.`;
    }

    // ── 4. CHESHTA BALA (Motional Strength) ──────────────────
    let cheshtaBala: number;
    let cheshtaTxt: string;

    const sunLon = planets.Sun?.lon || 0;
    const angSep = Math.min(
      Math.abs(pd.lon - sunLon),
      360 - Math.abs(pd.lon - sunLon)
    );

    if (pd.dignity?.includes("Combust") || angSep < 8) {
      cheshtaBala = 1;
      cheshtaTxt  = `Ast (combust) hai — Cheshta bala minimum (1/10). Sun ke bahut paas hone se planet ki independent shakti lup jaati hai. Results mein Sun ka dominance hoga.`;
    } else if (pd.retrograde) {
      cheshtaBala = 8;
      cheshtaTxt  = `Vakri (retrograde) hai — Cheshta bala maximum (8/10). Classical rule: retrograde planets extra effort karte hain. Results intense aur lasting hote hain par delay ke saath zaroor aate hain.`;
    } else if (angSep < 15) {
      cheshtaBala = 2;
      cheshtaTxt  = `Sun ke kaafi paas hai (${angSep.toFixed(1)}°) — Cheshta bala kam (2/10). Partial combustion effect.`;
    } else if (angSep < 30) {
      cheshtaBala = 4;
      cheshtaTxt  = `Sun se moderate distance (${angSep.toFixed(1)}°) — Cheshta bala 4/10. Average motional strength.`;
    } else {
      cheshtaBala = 6;
      cheshtaTxt  = `Direct motion mein aur Sun se achhi door hai — Cheshta bala 6/10. Smooth energy delivery.`;
    }

    // ── 5. NAISARGIKA BALA (Natural Strength — fixed) ────────
    const naisargika = NAISARGIKA[planet] || 5;

    // ── 6. DRIK BALA (Aspectual Strength) ────────────────────
    let drikBala = 4;
    const benefics = ["Jupiter","Venus","Moon","Mercury"];
    const malefics = ["Saturn","Mars","Sun","Rahu","Ketu"];

    ["Jupiter","Venus","Saturn","Mars"].forEach(asp => {
      if (asp === planet || !planets[asp]) return;
      const dist     = Math.abs(planets[asp].house - pd.house);
      const normDist = Math.min(dist, 12 - dist);
      const hasAspect =
        normDist === 6 ||
        (asp === "Jupiter" && [4, 8].includes(normDist)) ||
        (asp === "Mars"    && [3, 7].includes(normDist)) ||
        (asp === "Saturn"  && [2, 9].includes(normDist));
      if (hasAspect) {
        if (benefics.includes(asp)) drikBala += 2;
        else                         drikBala -= 1;
      }
    });
    drikBala = Math.max(1, Math.min(8, drikBala));

    const drikTxt = drikBala >= 7
      ? `Benefic aspects strong hain — Drik bala ${drikBala}/8. Jupiter ya Venus ka aspect milta hai jo shakti badhata hai.`
      : drikBala >= 5
      ? `Mixed aspects — Drik bala ${drikBala}/8. Kuch support, kuch resistance.`
      : `Malefic aspects dominant — Drik bala ${drikBala}/8. Saturn ya Mars ka pressure hai.`;

    // ── TOTALS ────────────────────────────────────────────────
    const total      = sthanaBala + digBala + kalaBala + cheshtaBala + naisargika + drikBala;
    const maxTotal   = 10 + 10 + 10 + 10 + 7 + 8; // 55 max
    const percentage = Math.min(100, Math.round((total / maxTotal) * 100));

    const grade =
      percentage >= 80 ? "Excellent" :
      percentage >= 65 ? "Strong" :
      percentage >= 50 ? "Moderate" :
      percentage >= 35 ? "Weak" : "Very Weak";

    const gradeColor =
      grade === "Excellent" ? "#c8a030" :
      grade === "Strong"    ? "#1d9e75" :
      grade === "Moderate"  ? "#60a5fa" :
      grade === "Weak"      ? "#f97316" : "#ef4444";

    const overallTxt =
      percentage >= 80
        ? `${planet} ki overall shadbala bahut strong hai (${percentage}%) — yeh planet apna kaaryakshatra achhe se nibhata hai aur life mein prominent positive results deta hai. Iska dasha/antardasha bahut fruitful hoga.`
        : percentage >= 65
        ? `${planet} ki overall shadbala strong hai (${percentage}%) — yeh planet generally positive results deta hai. Iska kaaryakshatra well-supported hai.`
        : percentage >= 50
        ? `${planet} ki overall shadbala madhyam hai (${percentage}%) — yeh planet conditional results deta hai. Timing aur transit zyada matter karta hai.`
        : percentage >= 35
        ? `${planet} ki overall shadbala weak hai (${percentage}%) — upay aur dasha timing se results improve ho sakte hain. Iske ghar ke matters mein extra effort lagega.`
        : `${planet} ki overall shadbala bahut weak hai (${percentage}%) — yeh planet struggle kar raha hai. Strong upay aur favorable dasha period zaroor dekhein.`;

    results.push({
      planet,
      icon:  ICONS[pi],
      color: COLORS[pi],
      sign:  pd.sign,
      house: pd.house,
      retrograde: pd.retrograde,
      sthanaBala,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargika,
      drikBala,
      total,
      percentage,
      grade,
      gradeColor,
      sthanaTxt,
      digTxt,
      kalaTxt,
      cheshtaTxt,
      drikTxt,
      overallTxt,
      sthanaDef:     BALA_DESC.Sthana,
      digDef:        BALA_DESC.Dig,
      kalaDef:       BALA_DESC.Kala,
      cheshtaDef:    BALA_DESC.Cheshta,
      naisargikaDef: BALA_DESC.Naisargika,
      drikDef:       BALA_DESC.Drik,
    });
  });

  // Sort by percentage descending
  results.sort((a, b) => b.percentage - a.percentage);

  const strongest   = results[0]?.planet || "Jupiter";
  const weakest     = results[results.length - 1]?.planet || "Saturn";
  const avgStrength = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);

  const summary = avgStrength >= 70
    ? `Aapka chart bahut strong planetary configuration dikhata hai. Average shadbala ${avgStrength}% — planets apna best de rahe hain.`
    : avgStrength >= 55
    ? `Aapke chart mein mixed planetary strength hai. Average shadbala ${avgStrength}% — kuch planets strong, kuch ko support chahiye.`
    : `Aapke chart mein kai planets weak hain. Average shadbala ${avgStrength}% — upay aur dasha timing bahut important hai.`;

  return { planets: results, strongest, weakest, avgStrength, summary };
}

// ── Radar chart data ──────────────────────────────────────────
export function getShadbalaRadar(planet: ShadbalaPlanet) {
  return [
    { label: "Sthana",     value: planet.sthanaBala,  max: 10 },
    { label: "Dig",        value: planet.digBala,     max: 10 },
    { label: "Kala",       value: planet.kalaBala,    max: 10 },
    { label: "Cheshta",    value: planet.cheshtaBala, max: 10 },
    { label: "Naisargika", value: planet.naisargika,  max: 7  },
    { label: "Drik",       value: planet.drikBala,    max: 8  },
  ];
}