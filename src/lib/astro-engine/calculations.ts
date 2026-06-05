// ============================================================
// ASTROLIFE CALCULATION ENGINE v3.0
// Planets: Moshier ephemeris (same model Swiss Ephemeris uses as its
//   built-in fallback) — geocentric apparent longitude, arc-second accurate,
//   no data files, runs in the browser. Matches AstroSage/JHora at varga
//   boundaries (navamsha sandhi) where the old truncated VSOP87 drifted.
// Nodes (Rahu/Ketu): mean node.
// Ayanamsha: Lahiri/Chitrapaksha (precession + IAU 1980 nutation).
// ============================================================
import ephemeris from "ephemeris";

// ── Types ────────────────────────────────────────────────────
export interface PlanetData {
  lon: number;
  sign: string;
  signNum: number;
  degree: number;
  minutes: number;
  house: number;
  rashiHouse: number;
  bhavaHouse: number;
  bhavaShift: number;
  bhavaNote: string;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  retrograde: boolean;
  dignity: string;
  navamsha: string;
}

export interface HouseCuspData {
  house: number;
  lon: number;
  sign: string;
  signNum: number;
  degree: number;
  minutes: number;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  source: "degree-equal-bhava";
}

export interface ChartData {
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat: number;
  lon: number;
  tz: number;
  jd: number;
  lagnaLon: number;
  lagnaRashi: string;
  lagnaNum: number;
  planets: Record<string, PlanetData>;
  houseCusps: HouseCuspData[];
  houseSystem: "degree-equal-bhava";
  dashas: DashaEntry[];
  antardasha: DashaEntry[];
}

export interface DashaEntry {
  planet: string;
  start: Date;
  end: Date;
  yrs: number;
  active?: boolean;
}

// ── Constants ─────────────────────────────────────────────────
export const RASHIS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

export const RASHIS_SA = [
  'Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya',
  'Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'
];

export const RASHI_ICONS = [
  '♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'
];

export const NAK = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha',
  'Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'
];

export const NLRD = [
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'
];

// Dasha order + years
export const DO = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
export const DY: Record<string, number> = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17
};

// ── Math Helpers ──────────────────────────────────────────────
const _r = (d: number) => d * Math.PI / 180;
const _d = (r: number) => r * 180 / Math.PI;
const _n = (x: number) => ((x % 360) + 360) % 360;
const md  = (x: number, m: number) => ((x % m) + m) % m;
const dR  = (d: number) => Math.floor(md(d, 360) / 30);
const dIR = (d: number) => md(d, 360) % 30;

// ── Julian Day Number ─────────────────────────────────────────
function assertValidDateParts(date: string): [number, number, number] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Birth date must use YYYY-MM-DD format.");
  }

  const [y, m, d] = date.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    throw new Error("Birth date is invalid.");
  }

  return [y, m, d];
}

function assertValidTimeParts(time: string): [number, number] {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error("Birth time must use HH:mm 24-hour format.");
  }

  const [h, mn] = time.split(":").map(Number);
  return [h, mn];
}

function assertFiniteRange(value: number, label: string, min: number, max: number): number {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} must be between ${min} and ${max}.`);
  }
  return value;
}

export function getJD(date: string, time: string, tz: number): number {
  const [y, m, d] = assertValidDateParts(date);
  const [h, mn] = assertValidTimeParts(time);
  assertFiniteRange(tz, "Timezone", -12, 14);
  const utH = h + mn / 60 - tz;
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  const jdn = d + Math.floor((153 * mo + 2) / 5) + 365 * yr
    + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  return jdn + (utH - 12) / 24;
}

// ── Nutation in longitude — IAU 1980, 9 leading terms ─────────
function _nutation(T: number): number {
  const D  = _n(297.85036 + 445267.111480 * T - 0.0019142 * T * T);
  const M  = _n(357.52772 + 35999.050340  * T - 0.0001603 * T * T);
  const Mp = _n(134.96298 + 477198.867398 * T + 0.0086972 * T * T);
  const F  = _n( 93.27191 + 483202.017538 * T - 0.0036825 * T * T);
  const Om = _n(125.04452 - 1934.136261   * T + 0.0020708 * T * T);
  const terms: number[][] = [
    [-171996 - 174.2 * T, 0, 0, 0, 1],
    [ -13187 -   1.6 * T,-2, 0, 0, 2, 2],
    [  -2274 -   0.2 * T, 0, 0, 0, 2, 2],
    [   2062 +   0.2 * T, 0, 0, 0, 0, 2],
    [   1426 -   3.4 * T, 0, 1, 0, 0, 0],
    [    712 +   0.1 * T, 1, 0, 0, 0, 0],
    [   -517 +   1.2 * T,-2, 1, 0, 2, 2],
    [   -386 -   0.4 * T, 0, 0, 1, 2, 2],
    [   -301,             1, 0, 0, 2, 2],
  ];
  const args = [D, M, Mp, F, Om];
  let dpsi = 0;
  terms.forEach(([si, ...mults]) => {
    const arg = _r(mults.reduce((s, c, i) => s + c * args[i], 0));
    dpsi += si * Math.sin(arg);
  });
  return dpsi * 0.0001 / 3600;
}

// ── Lahiri Ayanamsha with nutation ────────────────────────────
function lahiri(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const precession = 23.85045 + 1.39720 * T + 0.000139 * T * T - 0.0000001 * T * T * T;
  return precession + _nutation(T);
}

// ── Nakshatra lookup ──────────────────────────────────────────
function getNak(lon: number) {
  const i    = Math.floor(md(lon, 360) / (360 / 27));
  const pada = Math.floor((md(lon, 360) % (360 / 27)) / (360 / 108)) + 1;
  return { name: NAK[i], lord: NLRD[i], pada, idx: i };
}

// ── Navamsha rashi ────────────────────────────────────────────
function getNavamsha(lon: number): string {
  const r     = Math.floor(md(lon, 360) / 30);
  const d2    = md(lon, 360) % 30;
  const part  = Math.floor(d2 / (30 / 9));
  const starts = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3];
  return RASHIS[md(starts[r] + part, 12)];
}

// ── Planet dignity ────────────────────────────────────────────
function getPStatus(p: string, lon: number): string {
  const r = dR(lon);
  const d2 = dIR(lon);
  const uch:    Record<string, number>   = { Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6 };
  const uchdeg: Record<string, number>   = { Sun:10, Moon:3, Mars:28, Mercury:15, Jupiter:5, Venus:27, Saturn:20 };
  const nee:    Record<string, number>   = { Sun:6, Moon:7, Mars:3, Mercury:11, Jupiter:9, Venus:5, Saturn:0 };
  const own:    Record<string, number[]> = { Sun:[4], Moon:[3], Mars:[0,7], Mercury:[2,5], Jupiter:[8,11], Venus:[1,6], Saturn:[9,10] };
  const mool:   Record<string, number>   = { Sun:4, Moon:1, Mars:0, Mercury:5, Jupiter:8, Venus:6, Saturn:9 };

  if (uch[p] === r) return 'Exalted' + (Math.abs(d2 - uchdeg[p]) <= 5 ? ' ★' : '');
  if (nee[p] === r) return 'Debilitated';
  if (own[p]?.includes(r)) {
    if (mool[p] === r) return 'Moolatrikona';
    return 'Own';
  }
  return '—';
}

// ── True obliquity ────────────────────────────────────────────
function _obliquity(T: number): number {
  return 23.4392911 - 0.0130042 * T - 0.00000164 * T * T + 0.000000504 * T * T * T;
}

// ── JD (UT) → JS Date ─────────────────────────────────────────
// JD 2440587.5 = 1970-01-01T00:00:00Z (Unix epoch).
function _jdToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

// Moshier body keys (geocentric apparent longitude, observer-independent).
const _MOSHIER_BODY: Record<string, string> = {
  Sun: "sun", Moon: "moon", Mercury: "mercury", Venus: "venus",
  Mars: "mars", Jupiter: "jupiter", Saturn: "saturn",
};

// ── MAIN PLANET COMPUTATION — Moshier ephemeris (arc-second) ──
// Returns sidereal (Lahiri) longitudes. The package gives apparent
// (nutation+aberration included) longitude; Lahiri "true" ayanamsha also
// includes nutation, so subtracting cancels nutation correctly.
export function computePlanets(jd: number): Record<string, number> {
  const ay = lahiri(jd);
  const sid = (lon: number) => _n(lon - ay);
  const T = (jd - 2451545) / 36525;

  const observed = ephemeris.getAllPlanets(_jdToDate(jd), 0, 0, 0).observed;
  const out: Record<string, number> = {};
  for (const [name, key] of Object.entries(_MOSHIER_BODY)) {
    out[name] = sid(observed[key].apparentLongitudeDd);
  }

  // Rahu / Ketu — mean lunar node (matches AstroSage default).
  const rahuTrop = _n(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  out.Rahu = sid(rahuTrop);
  out.Ketu = sid(_n(rahuTrop + 180));
  return out;
}

// ── Retrograde detection ──────────────────────────────────────
export function computeRetro(jd: number): Record<string, boolean> {
  const p1 = computePlanets(jd - 0.5);
  const p2 = computePlanets(jd + 0.5);
  const res: Record<string, boolean> = { Sun: false, Moon: false };
  ['Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'].forEach(p => {
    let d2 = p2[p] - p1[p];
    while (d2 >  180) d2 -= 360;
    while (d2 < -180) d2 += 360;
    res[p] = d2 < 0;
  });
  return res;
}

// ── Lagna (Ascendant) computation ────────────────────────────
export function computeLagna(jd: number, lat: number, lonG: number): number {
  const T  = (jd - 2451545) / 36525;
  const T2 = T * T, T3 = T2 * T;
  const GMST = _n(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T2 - T3 / 38710000);
  const eps  = _obliquity(T);
  const dpsi = _nutation(T);
  const eqEq = dpsi * Math.cos(_r(eps));
  const GAST = _n(GMST + eqEq);
  const LST  = _n(GAST + lonG);
  const epsR = _r(eps);
  const Lr   = _r(LST);
  const phi  = _r(lat);
  const A    = Math.cos(Lr);
  const B    = -(Math.sin(Lr) * Math.cos(epsR) + Math.tan(phi) * Math.sin(epsR));
  return _n(_d(Math.atan2(A, B)) - lahiri(jd));
}

// ── House assignment ──────────────────────────────────────────
function getHouse(planetLon: number, lagnaLon: number): number {
  const ri = dR(planetLon);
  const lagR = dR(lagnaLon);
  return md(ri - lagR, 12) + 1;
}

function getBhavaHouse(planetLon: number, lagnaLon: number): number {
  return md(Math.floor(md(planetLon - lagnaLon + 15, 360) / 30), 12) + 1;
}

function buildHouseCusps(lagnaLon: number): HouseCuspData[] {
  return Array.from({ length: 12 }).map((_, index) => {
    const house = index + 1;
    const lon = _n(lagnaLon + index * 30);
    const signNum = dR(lon);
    const deg = Math.floor(dIR(lon));
    const mins = Math.floor((dIR(lon) - deg) * 60);
    const nak = getNak(lon);

    return {
      house,
      lon,
      sign: RASHIS[signNum],
      signNum,
      degree: deg,
      minutes: mins,
      nakshatra: nak.name,
      nakshatraLord: nak.lord,
      pada: nak.pada,
      source: "degree-equal-bhava",
    };
  });
}
  
// ── Vimshottari Dasha ─────────────────────────────────────────
export function buildDashaSeq(moonLon: number, dob: string, tob: string): DashaEntry[] {
  const nak     = getNak(moonLon);
  const lIdx    = DO.indexOf(nak.lord);
  const nakStart = nak.idx * (360 / 27);
  const posInNak = md(moonLon, 360) - nakStart;
  const nakPct   = posInNak / (360 / 27);
  const remFrac  = 1 - nakPct;
  const dobDate  = new Date(`${dob}T${tob}`);
  const seq: DashaEntry[] = [];
  let cursor = new Date(dobDate);
  const now = new Date();

  for (let i = 0; i < 9; i++) {
    const pi     = md(lIdx + i, 9);
    const planet = DO[pi];
    const yrs    = i === 0 ? remFrac * DY[planet] : DY[planet];
    const end    = new Date(cursor.getTime() + yrs * 365.25 * 24 * 3600 * 1000);
    seq.push({
      planet,
      start: new Date(cursor),
      end,
      yrs,
      active: cursor <= now && now < end,
    });
    cursor = new Date(end);
  }
  return seq;
}

export function buildAntarDasha(md_planet: string, mdStart: Date, mdYrs: number): DashaEntry[] {
  const mi  = DO.indexOf(md_planet);
  const seq: DashaEntry[] = [];
  let cur   = new Date(mdStart);
  const now = new Date();

  for (let i = 0; i < 9; i++) {
    const pi  = md(mi + i, 9);
    const p   = DO[pi];
    const yrs = mdYrs * DY[p] / 120;
    const end = new Date(cur.getTime() + yrs * 365.25 * 24 * 3600 * 1000);
    seq.push({
      planet: p,
      start: new Date(cur),
      end,
      yrs,
      active: cur <= now && now < end,
    });
    cur = new Date(end);
  }
  return seq;
}

// ── City coordinates lookup ───────────────────────────────────
export const CITY_COORDS: Record<string, { lat: number; lon: number; tz: number }> = {
  "Mumbai":          { lat: 19.0760, lon: 72.8777, tz: 5.5 },
  "Delhi":           { lat: 28.6139, lon: 77.2090, tz: 5.5 },
  "New Delhi":       { lat: 28.6139, lon: 77.2090, tz: 5.5 },
  "Bangalore":       { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  "Chennai":         { lat: 13.0827, lon: 80.2707, tz: 5.5 },
  "Kolkata":         { lat: 22.5726, lon: 88.3639, tz: 5.5 },
  "Hyderabad":       { lat: 17.3850, lon: 78.4867, tz: 5.5 },
  "Pune":            { lat: 18.5204, lon: 73.8567, tz: 5.5 },
  "Ahmedabad":       { lat: 23.0225, lon: 72.5714, tz: 5.5 },
  "Jaipur":          { lat: 26.9124, lon: 75.7873, tz: 5.5 },
  "Lucknow":         { lat: 26.8467, lon: 80.9462, tz: 5.5 },
  "Chandigarh":      { lat: 30.7333, lon: 76.7794, tz: 5.5 },
  "Bhopal":          { lat: 23.2599, lon: 77.4126, tz: 5.5 },
  "Indore":          { lat: 22.7196, lon: 75.8577, tz: 5.5 },
  "Nagpur":          { lat: 21.1458, lon: 79.0882, tz: 5.5 },
  "Surat":           { lat: 21.1702, lon: 72.8311, tz: 5.5 },
  "Varanasi":        { lat: 25.3176, lon: 82.9739, tz: 5.5 },
  "Amritsar":        { lat: 31.6340, lon: 74.8723, tz: 5.5 },
  "Dehradun":        { lat: 30.3165, lon: 78.0322, tz: 5.5 },
  "Kochi":           { lat: 9.9312,  lon: 76.2673, tz: 5.5 },
  "Patna":           { lat: 25.5941, lon: 85.1376, tz: 5.5 },
  "Agra":            { lat: 27.1767, lon: 78.0081, tz: 5.5 },
  "Mysuru":          { lat: 12.2958, lon: 76.6394, tz: 5.5 },
  "Coimbatore":      { lat: 11.0168, lon: 76.9558, tz: 5.5 },
  "Visakhapatnam":   { lat: 17.6868, lon: 83.2185, tz: 5.5 },
};

function resolveChartLocation(
  city: string,
  customLat?: number,
  customLon?: number,
  customTz?: number,
): { lat: number; lon: number; tz: number } {
  const cityCoords = CITY_COORDS[city];
  if (cityCoords) return cityCoords;

  const hasCustomLocation =
    customLat !== undefined &&
    customLon !== undefined &&
    customTz !== undefined;

  if (!hasCustomLocation) {
    throw new Error(`City "${city}" is not available. Please select a supported city or provide latitude, longitude and timezone.`);
  }

  return {
    lat: assertFiniteRange(customLat, "Latitude", -90, 90),
    lon: assertFiniteRange(customLon, "Longitude", -180, 180),
    tz: assertFiniteRange(customTz, "Timezone", -12, 14),
  };
}

// ── MAIN CHART CALCULATOR ─────────────────────────────────────
export function calculateChart(
  name: string,
  dob: string,
  tob: string,
  city: string,
  customLat?: number,
  customLon?: number,
  customTz?: number
): ChartData {
  const coords = resolveChartLocation(city, customLat, customLon, customTz);
  const { lat, lon, tz } = coords;

  // Calculate Julian Day
  const jd = getJD(dob, tob, tz);

  // Calculate Lagna
  const lagnaLon = computeLagna(jd, lat, lon);
  const lagnaNum = dR(lagnaLon);

  // Calculate planets
  const rawPlanets = computePlanets(jd);
  const retrograde = computeRetro(jd);
  const houseCusps = buildHouseCusps(lagnaLon);

  // Build planet data
  const planets: Record<string, PlanetData> = {};
  const planetNames = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Ketu'];

  planetNames.forEach(p => {
    const lon2  = rawPlanets[p];
    const signN = dR(lon2);
    const deg   = Math.floor(dIR(lon2));
    const mins  = Math.floor((dIR(lon2) - deg) * 60);
    const nak   = getNak(lon2);
    const rashiHouse = getHouse(lon2, lagnaLon);
    const bhavaHouse = getBhavaHouse(lon2, lagnaLon);
    const bhavaShift = bhavaHouse - rashiHouse;

    planets[p] = {
      lon:          lon2,
      sign:         RASHIS[signN],
      signNum:      signN,
      degree:       deg,
      minutes:      mins,
      house:        rashiHouse,
      rashiHouse,
      bhavaHouse,
      bhavaShift,
      bhavaNote:    bhavaShift === 0 ? "Same as Rashi house" : `Bhava Chalit shifts from H${rashiHouse} to H${bhavaHouse}`,
      nakshatra:    nak.name,
      nakshatraLord: nak.lord,
      pada:         nak.pada,
      retrograde:   retrograde[p] || false,
      dignity:      getPStatus(p, lon2),
      navamsha:     getNavamsha(lon2),
    };
  });

  // Build Dasha sequence
  const dashas    = buildDashaSeq(rawPlanets.Moon, dob, tob);
  const activeMD  = dashas.find(d => d.active) || dashas[0];
  const antardasha = buildAntarDasha(activeMD.planet, activeMD.start, activeMD.yrs);

  return {
    name, dob, tob, city,
    lat, lon, tz, jd,
    lagnaLon,
    lagnaRashi: RASHIS[lagnaNum],
    lagnaNum,
    planets,
    houseCusps,
    houseSystem: "degree-equal-bhava",
    dashas,
    antardasha,
  };
}
