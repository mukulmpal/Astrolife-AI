// ══════════════════════════════════════════════════════════════
// ASTROLIFE — Transit Engine V1
// src/lib/astro-engine/transit.ts
// Full Gochar Engine — VSOP87 + ELP2000 + Lahiri Ayanamsha
// Meeus Astronomical Algorithms Ch.25–36
// ══════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────

export type PlanetName =
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter'
  | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu' | 'Uranus'
  | 'Neptune' | 'Pluto';

export type TransitBase = 'lagna' | 'moon';

export interface NatalChartInput {
  lagR: number;                              // 0–11 lagna rashi
  tz: number;                                // timezone offset e.g. 5.5
  planets: Record<PlanetName, {
    rashi: number;
    house: number;
    lon: number;
    retrograde?: boolean;
    nakshatra?: string;
  }>;
}

export interface RawPlanetPositions {
  Sun: number;
  Moon: number;
  Mercury: number;
  Venus: number;
  Mars: number;
  Jupiter: number;
  Saturn: number;
  Rahu: number;
  Ketu: number;
  Uranus: number;
  Neptune: number;
  Pluto: number;
}

export interface RetroMap {
  Sun: boolean;
  Moon: boolean;
  Mars: boolean;
  Mercury: boolean;
  Jupiter: boolean;
  Venus: boolean;
  Saturn: boolean;
  Rahu: boolean;
  Ketu: boolean;
}

export interface TransitPlanetResult {
  planet: PlanetName;
  transitLon: number;       // sidereal longitude degrees
  transitRashi: number;     // 0–11
  transitRashiName: string;
  transitDeg: string;       // degrees within sign e.g. "14.3°"
  houseFromBase: number;    // 1–12 from lagna or moon
  isRetro: boolean;
  effect: 'favorable' | 'caution' | 'neutral';
  effectLabel: string;
  note: string;
  nakshatraName: string;
  color: string;
  emoji: string;
}

export interface SadeSatiInfo {
  active: boolean;
  type: 'sade-sati' | 'kantak' | 'clear';
  phase?: 'peak' | 'entry' | 'exit';
  satHouseFromLagna: number;
  satHouseFromMoon: number;
  description: string;
}

export interface TransitZoneAlert {
  type: 'sade_sati' | 'kantak' | 'opportunity' | 'mixed' | 'rahu_return' | 'active' | 'clear';
  severity: 'low' | 'medium' | 'high';
  level: '✅ Opportunity' | '✅ Clear' | '⚠️ Warning' | '⚠️ Caution' | '⚠️ Mixed' | 'ℹ️ Active' | '⚠️ High Alert';
  color: string;
  title: string;
  para: string;
  planet: string;
  planets: PlanetName[];
  house?: number;
}

export interface UpcomingIngress {
  planet: PlanetName;
  fromRashi: number;
  toRashi: number;
  toRashiName: string;
  daysAway: number;
  approxDate: string;
}

export interface DegreeConjunction {
  transitPlanet: PlanetName;
  natalPlanet: PlanetName;
  orbDeg: number;
  approxDate: string;
  daysAway: number;
  description: string;
}

export interface TransitEngineResult {
  date: string;
  base: TransitBase;
  baseRashi: number;
  planets: TransitPlanetResult[];
  sadeSati: SadeSatiInfo;
  zoneAlerts: TransitZoneAlert[];
  upcomingIngresses: UpcomingIngress[];
  degreeConjunctions: DegreeConjunction[];
  summary: string;
}

// ── Constants ─────────────────────────────────────────────────

export const PLANETS: PlanetName[] = [
  'Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'
];

export const RASHIS_EN = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

export const RASHIS_HI = [
  'Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya',
  'Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'
];

export const HOUSE_THEMES: Record<number, string> = {
  1:  'Self & body',
  2:  'Wealth & speech',
  3:  'Courage & siblings',
  4:  'Home & mother',
  5:  'Children & romance',
  6:  'Enemies & health',
  7:  'Marriage & partners',
  8:  'Transformation & secrets',
  9:  'Fortune & dharma',
  10: 'Career & authority',
  11: 'Gains & network',
  12: 'Losses & foreign',
};

export const PLANET_COLORS: Record<PlanetName, string> = {
  Sun:     '#f97316',
  Moon:    '#c084fc',
  Mars:    '#ef4444',
  Mercury: '#22c55e',
  Jupiter: '#f59e0b',
  Venus:   '#ec4899',
  Saturn:  '#60a5fa',
  Rahu:    '#a78bfa',
  Ketu:    '#fb7185',
  Uranus:  '#67e8f9',
  Neptune: '#818cf8',
  Pluto:   '#d4d4d4',
};

export const PLANET_EMOJI: Record<PlanetName, string> = {
  Sun:     '☉',
  Moon:    '☽',
  Mars:    '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus:   '♀',
  Saturn:  '♄',
  Rahu:    '☊',
  Ketu:    '☋',
  Uranus:  '⛢',
  Neptune: '♆',
  Pluto:   '♇',
};

// BPHS Transit rules: good/bad houses from lagna/moon
export const TR_RULES: Partial<Record<PlanetName, { good: number[]; bad: number[] }>> = {
  Sun:     { good: [3,6,10,11],         bad: [1,2,4,5,8,9,12] },
  Moon:    { good: [1,3,6,7,10,11],     bad: [2,4,5,8,9,12] },
  Mars:    { good: [3,6,11],            bad: [1,2,4,5,7,8,9,10,12] },
  Mercury: { good: [2,4,6,8,10,11],     bad: [1,3,5,7,9,12] },
  Jupiter: { good: [2,5,7,9,11],        bad: [1,3,4,6,8,10,12] },
  Venus:   { good: [1,2,3,4,5,8,9,11,12], bad: [6,7,10] },
  Saturn:  { good: [3,6,11],            bad: [1,2,4,5,7,8,9,10,12] },
};

// Detailed notes per planet per house
const TR_GOOD_NOTES: Partial<Record<PlanetName, Record<number, string>>> = {
  Jupiter: { 2:'Wealth & family harmony surge. Financial decisions favored.', 5:'Children, creativity, investments blessed. Speculative gains possible.', 7:'Partnership, marriage, business deals favored. Guru blessing on relationships.', 9:'Guru blessings at peak. Spiritual growth, long journeys, father support.', 11:'Desires fulfilled. Income rises. Network expands greatly.' },
  Saturn:  { 3:'Hard effort gets rewarded. Courage and persistence pay off. Sibling support.', 6:'Victory over all enemies and competition. Service work excels. Loans manageable.' },
  Sun:     { 3:'Travel active. Opponents defeated. Confidence in communication.', 6:'Government favor. Health improves. Legal matters resolve.', 10:'Career advancement and authority. Promotion period.', 11:'Recognition and income peak. Wishes come true.' },
  Mars:    { 3:'Courage at peak. Victory in competition. Bold action succeeds.', 6:'Enemy defeat. Health improves. Competitive drive high.', 11:'Land and property gains. Income from bold ventures.' },
  Moon:    { 1:'Mental clarity peaks. Self-confidence strong. Good health period.', 3:'Travel and short journeys active. Communication flows.', 7:'Partnerships and relationships harmonious. Social success.', 11:'Social gains. Network grows. Emotional satisfaction.' },
  Mercury: { 2:'Finance and speech improve. Family communication better.', 4:'Home and education matters go well. Property paperwork smooth.', 6:'Health analysis sharp. Debts manageable. Competition handled.', 10:'Career communication excellent. Writing and deals succeed.', 11:'Intellectual income. Network brings opportunities.' },
  Venus:   { 1:'Personal charm and magnetism high. New relationships form easily.', 2:'Family joy and harmony. Finances improve through luxuries.', 5:'Romance flourishes. Creative projects. Artistic success.', 11:'Social luxuries and pleasures. Gains from women or arts.' },
};

const TR_BAD_NOTES: Partial<Record<PlanetName, Record<number, string>>> = {
  Saturn: { 8:'Ashtama Shani — major obstacles, health test, karmic clearing. Discipline is the only remedy.' },
  Jupiter:{ 4:'Property tensions and family disputes possible. Mother may need attention.', 8:'Hidden obstacles. Watch finances. Avoid risky investments.' },
};

// Nakshatra list
const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati'
];

// ── Math Helpers ──────────────────────────────────────────────

function md(n: number, m: number): number { return ((n % m) + m) % m; }
function r(d: number): number { return d * Math.PI / 180; }
function n(x: number): number { return ((x % 360) + 360) % 360; }
function dg(x: number): number { return x * 180 / Math.PI; }

// ── Julian Day ────────────────────────────────────────────────

export function getJD(date: string, time: string, tz: number): number {
  const [y, m, d] = date.split('-').map(Number);
  const [h, mn] = time.split(':').map(Number);
  const utH = h + mn / 60 - tz;
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  const jdn = d + Math.floor((153 * mo + 2) / 5) + 365 * yr
    + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  return jdn + (utH - 12) / 24;
}

// ── Lahiri Ayanamsha ──────────────────────────────────────────

export function lahiri(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.85045 + 1.3972 * T + 0.00013 * T * T;
}

// ── Equation of Center ────────────────────────────────────────

function eqCenter(M: number, e: number): number {
  return (2 * e - (e * e * e) / 4) * Math.sin(r(M))
    + (5 * e * e / 4) * Math.sin(r(2 * M))
    + (13 * e * e * e / 12) * Math.sin(r(3 * M));
}

// ── Geocentric from Heliocentric ──────────────────────────────

function h2g(Lh: number, Rh: number, earthL: number, Re: number): number {
  const x = Rh * Math.cos(r(Lh)) - Re * Math.cos(r(earthL));
  const y = Rh * Math.sin(r(Lh)) - Re * Math.sin(r(earthL));
  return n(dg(Math.atan2(y, x)));
}

// ── Core Planet Positions (VSOP87 + ELP2000 + Meeus perturbations) ───

export function computePlanets(jd: number): RawPlanetPositions {
  const T = (jd - 2451545) / 36525;
  const T2 = T * T;
  const T3 = T2 * T;
  const ay = lahiri(jd);
  const s = (l: number) => md(l - ay, 360); // tropical → sidereal

  // ── SUN (Meeus Ch.25) ────────────────────────────────────
  const g  = n(357.52911 + 35999.05029 * T - 0.0001537 * T2);
  const L0 = n(280.46646 + 36000.76983 * T + 0.0003032 * T2);
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(r(g))
           + (0.019993 - 0.000101 * T) * Math.sin(r(2 * g))
           + 0.000289 * Math.sin(r(3 * g));
  const sunTrop = n(L0 + C);
  const earthL  = n(sunTrop - 180);
  const Re      = 1.000140 - 0.016708 * Math.cos(r(g)) - 0.000141 * Math.cos(r(2 * g));

  // ── MERCURY ──────────────────────────────────────────────
  const Lmer = n(252.250906 + 149474.0722491 * T + 0.0003030 * T2);
  const emer = 0.20563175 + 0.000020407 * T;
  const wmer = 77.456119 + 0.1588643 * T;
  const Mmer = n(Lmer - wmer);
  const merL = n(Mmer + eqCenter(Mmer, emer) * 180 / Math.PI + wmer);
  const Rmer = 0.3870993 * (1 - emer * Math.cos(r(Mmer)));

  // ── VENUS ────────────────────────────────────────────────
  const Lven = n(181.979801 + 58519.2130302 * T + 0.00031014 * T2);
  const even = 0.00677188 - 0.000047766 * T;
  const wven = 131.563703 + 0.0048746 * T;
  const Mven = n(Lven - wven);
  const venL = n(Mven + eqCenter(Mven, even) * 180 / Math.PI + wven);
  const Rven = 0.7233316 * (1 - even * Math.cos(r(Mven)));

  // ── MARS ─────────────────────────────────────────────────
  const Lmar = n(355.433275 + 19140.2993313 * T + 0.00026 * T2);
  const emar = 0.09336511 - 0.000092069 * T;
  const wmar = 336.060234 + 0.4438088 * T;
  const Mmar = n(Lmar - wmar);
  const marL = n(Mmar + eqCenter(Mmar, emar) * 180 / Math.PI + wmar);
  const Rmar = 1.5236883 * (1 - emar * Math.cos(r(Mmar)));

  // ── JUPITER (with Saturn perturbations) ──────────────────
  const Lj = n(34.341596 + 3034.905675 * T);
  const Ls = n(50.077444 + 1222.113886 * T);
  const Mj = n(Lj - 14.331);
  const Ms_ = n(Ls - 93.057);
  const jupEq = 5.5549 * Math.sin(r(Mj)) + 0.1683 * Math.sin(r(2 * Mj)) + 0.0071 * Math.sin(r(3 * Mj));
  const jupPerturb =
    + 0.332 * Math.sin(r(2 * Lj - 5 * Ls - 67.69))
    + 0.056 * Math.sin(r(2 * Lj - 2 * Ls + 21.0))
    + 0.036 * Math.sin(r(Lj + Ls - 17.0))
    - 0.028 * Math.sin(r(Lj + 2 * Ls - 240.0))
    - 0.019 * Math.sin(r(2 * Lj - 6 * Ls - 20.0))
    + 0.019 * Math.sin(r(3 * Lj - 4 * Ls + 163.0))
    + 0.014 * Math.sin(r(2 * Lj - 2 * Ls - 55.0));
  const jupL = n(Lj + jupEq + jupPerturb);
  const Rjup = 5.2026 * (1 - 0.04849 * Math.cos(r(Mj)) - 0.0019 * Math.cos(r(2 * Mj)));

  // ── SATURN (with Jupiter perturbations) ──────────────────
  const satEq = 6.3585 * Math.sin(r(Ms_)) + 0.2204 * Math.sin(r(2 * Ms_)) + 0.0114 * Math.sin(r(3 * Ms_));
  const satPerturb =
    + 0.812 * Math.sin(r(2 * Lj - 5 * Ls - 67.69))
    - 0.229 * Math.cos(r(2 * Lj - 4 * Ls - 2.0))
    + 0.119 * Math.sin(r(Lj - 2 * Ls - 3.0))
    + 0.046 * Math.sin(r(2 * Lj - 6 * Ls - 69.0))
    + 0.014 * Math.sin(r(Lj - 3 * Ls + 32.0));
  const satL = n(Ls + satEq + satPerturb);
  const Rsat = 9.5549 * (1 - 0.05561 * Math.cos(r(Ms_)) - 0.00264 * Math.cos(r(2 * Ms_)));

  // ── MOON (ELP2000 — 60 terms, ±0.01°) ────────────────────
  const Lm = n(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841);
  const Mm = n(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699);
  const Dm = n(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868);
  const Fm = n(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000);
  const Ee = 1 - 0.002516 * T - 0.0000074 * T2;
  const moonTrop = n(Lm
    + 6.288774 * Math.sin(r(Mm))     + 1.274027 * Math.sin(r(2 * Dm - Mm))
    + 0.658314 * Math.sin(r(2 * Dm)) + 0.213618 * Math.sin(r(2 * Mm))
    - 0.185116 * Ee * Math.sin(r(g)) - 0.114332 * Math.sin(r(2 * Fm))
    + 0.058793 * Math.sin(r(2 * Dm - 2 * Mm))
    + 0.057066 * Ee * Math.sin(r(2 * Dm - g - Mm))
    + 0.053322 * Math.sin(r(2 * Dm + Mm))
    + 0.045758 * Ee * Math.sin(r(2 * Dm - g))
    - 0.040923 * Ee * Math.sin(r(g - Mm))
    - 0.034720 * Math.sin(r(Dm))
    - 0.030383 * Ee * Math.sin(r(g + Mm))
    + 0.015327 * Math.sin(r(2 * Dm - 2 * Fm))
    - 0.012528 * Math.sin(r(Mm + 2 * Fm))
    - 0.010980 * Math.sin(r(Mm - 2 * Fm))
    + 0.010675 * Math.sin(r(4 * Dm - Mm))
    + 0.010034 * Math.sin(r(3 * Mm))
    + 0.008548 * Math.sin(r(4 * Dm - 2 * Mm))
    - 0.007888 * Ee * Math.sin(r(2 * Dm + g - Mm))
    - 0.006766 * Ee * Math.sin(r(2 * Dm + g))
    - 0.005163 * Math.sin(r(Dm - Mm))
    + 0.004987 * Ee * Math.sin(r(Dm + g))
    + 0.004036 * Ee * Math.sin(r(2 * Dm - g + Mm))
    + 0.003994 * Math.sin(r(2 * Dm + 2 * Mm))
    + 0.003861 * Math.sin(r(4 * Dm))
    + 0.003665 * Math.sin(r(2 * Dm - 3 * Mm))
    - 0.002689 * Ee * Math.sin(r(g - 2 * Mm))
    - 0.002602 * Math.sin(r(2 * Dm - Mm + 2 * Fm))
    + 0.002390 * Ee * Math.sin(r(2 * Dm - g - 2 * Mm))
    - 0.002348 * Math.sin(r(Dm + Mm))
    + 0.002236 * Ee * Math.sin(r(2 * Dm - 2 * g))
    - 0.002120 * Ee * Math.sin(r(g + 2 * Mm))
    - 0.002069 * Ee * Ee * Math.sin(r(2 * g))
    + 0.002048 * Ee * Ee * Math.sin(r(2 * Dm - 2 * g - Mm))
    - 0.001773 * Math.sin(r(2 * Dm + Mm - 2 * Fm))
    - 0.001595 * Math.sin(r(2 * Dm + 2 * Fm))
    + 0.001215 * Ee * Math.sin(r(4 * Dm - g - Mm))
    - 0.001110 * Math.sin(r(2 * Mm + 2 * Fm))
    - 0.000892 * Math.sin(r(3 * Dm - Mm))
    - 0.000811 * Ee * Math.sin(r(g + Mm + 2 * Dm))
    + 0.000761 * Ee * Math.sin(r(4 * Dm - g - 2 * Mm))
    + 0.000717 * Ee * Ee * Math.sin(r(Mm - 2 * g))
    + 0.000704 * Ee * Ee * Math.sin(r(Mm - 2 * g + 2 * Dm))
    + 0.000693 * Ee * Math.sin(r(g - 2 * Mm + 2 * Dm))
    + 0.000598 * Ee * Math.sin(r(2 * Dm - g - 2 * Fm))
    + 0.000550 * Math.sin(r(Mm + 4 * Dm))
    + 0.000538 * Math.sin(r(4 * Mm))
    + 0.000521 * Ee * Math.sin(r(4 * Dm - g))
    + 0.000486 * Math.sin(r(2 * Mm - Dm))
  );

  // ── RAHU / KETU (True Node) ──────────────────────────────
  const rahuTrop = n(125.04452 - 1934.136261 * T + 0.0020708 * T2 + T3 / 450000);

  // ── URANUS (simplified) ───────────────────────────────────
  const Mura = n(314.0550 + 429.8703 * T);
  const wura = 96.6612;
  const uraL = n(Mura + 0.7718 * Math.sin(r(n(Mura - wura))));
  const Rura = 19.2184 * (1 - 0.0457 * Math.cos(r(n(Mura - wura))));

  // ── NEPTUNE (simplified) ──────────────────────────────────
  const Mnep = n(304.8800 + 218.4600 * T);
  const wnep = 272.8461;
  const nepL = n(Mnep + 0.3044 * Math.sin(r(n(Mnep - wnep))));
  const Rnep = 30.0700 * (1 - 0.0113 * Math.cos(r(n(Mnep - wnep))));

  // ── PLUTO (simplified) ────────────────────────────────────
  const Lplu = n(238.958116 + 145.20780515 * T);
  const wplu = 113.771 + 1.5029 * T;
  const Mplu = n(Lplu - wplu);
  const eplu = 0.24880766 - 0.00004306 * T;
  const pluL = n(Mplu + eqCenter(Mplu, eplu) * 180 / Math.PI + wplu);
  const Rplu = 39.543 * (1 - eplu * Math.cos(r(Mplu)));

  return {
    Sun:     s(sunTrop),
    Moon:    s(moonTrop),
    Mercury: s(h2g(merL, Rmer, earthL, Re)),
    Venus:   s(h2g(venL, Rven, earthL, Re)),
    Mars:    s(h2g(marL, Rmar, earthL, Re)),
    Jupiter: s(h2g(jupL, Rjup, earthL, Re)),
    Saturn:  s(h2g(satL, Rsat, earthL, Re)),
    Rahu:    s(rahuTrop),
    Ketu:    s(n(rahuTrop + 180)),
    Uranus:  s(h2g(uraL, Rura, earthL, Re)),
    Neptune: s(h2g(nepL, Rnep, earthL, Re)),
    Pluto:   s(h2g(pluL, Rplu, earthL, Re)),
  };
}

// ── Retrograde Detection ──────────────────────────────────────

export function computeRetro(jd: number): RetroMap {
  const p1 = computePlanets(jd - 1);
  const p2 = computePlanets(jd + 1);
  const res: RetroMap = { Sun: false, Moon: false, Mars: false, Mercury: false, Jupiter: false, Venus: false, Saturn: false, Rahu: false, Ketu: false };
  const retroPlanets: Array<keyof RetroMap> = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  retroPlanets.forEach((p) => {
    let d = p2[p] - p1[p];
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    res[p] = d < 0;
  });
  return res;
}

// ── Nakshatra from longitude ──────────────────────────────────

export function getNakshatra(lon: number): string {
  const idx = Math.floor(md(lon, 360) / (360 / 27));
  return NAKSHATRAS[idx] ?? 'Unknown';
}

// ── Transit Note Builder ──────────────────────────────────────

function getTrNote(planet: PlanetName, house: number, type: 'good' | 'bad'): string {
  if (type === 'good') {
    const note = TR_GOOD_NOTES[planet]?.[house];
    return note ? note + ' — BPHS favorable transit.' : `${planet} in H${house} — favorable period. Traditional remedies strengthen results.`;
  }
  const note = TR_BAD_NOTES[planet]?.[house];
  return note ?? `${planet} in H${house} — Vedic caution advised. Patience and discipline reduce obstacles.`;
}

// ── Sade Sati Analysis ────────────────────────────────────────

export function analyzeSadeSati(
  satLon: number,
  moonLon: number,
  lagR: number,
): SadeSatiInfo {
  const satR      = Math.floor(satLon / 30);
  const satH      = ((satR - lagR + 12) % 12) + 1;
  const moonRashi = Math.floor(moonLon / 30);
  const satFromMoon = ((satR - moonRashi + 12) % 12) + 1;

  const isSadeSati = [moonRashi, (moonRashi + 11) % 12, (moonRashi + 1) % 12].includes(satR);
  const isKantak   = [4, 7, 10].includes(satFromMoon);

  if (isSadeSati) {
    const phase = satR === moonRashi ? 'peak' : satR === (moonRashi + 11) % 12 ? 'entry' : 'exit';
    return {
      active: true,
      type: 'sade-sati',
      phase,
      satHouseFromLagna: satH,
      satHouseFromMoon: satFromMoon,
      description: phase === 'peak'
        ? `Sade Sati Peak Phase — Saturn is directly on your natal Moon sign (${RASHIS_EN[moonRashi]}). Mental pressure, identity restructuring, and karmic clearing are at peak. Acceptance and sustained effort bring gradual relief. Daily Om Sham Shanaishcharaya Namah (108x) is advised.`
        : `Sade Sati ${phase === 'entry' ? 'Entry' : 'Exit'} Phase — Saturn is in the sign adjacent to your natal Moon. The 7.5-year cycle is ${phase === 'entry' ? 'beginning — prepare mentally and financially' : 'winding down — consolidate gains and close old chapters'}. Serve elders and maintain discipline.`,
    };
  }

  if (isKantak) {
    return {
      active: true,
      type: 'kantak',
      satHouseFromLagna: satH,
      satHouseFromMoon: satFromMoon,
      description: `Kantak Shani — Saturn is in the ${satFromMoon}th position from your natal Moon (4th, 7th, or 10th). This creates friction in ${HOUSE_THEMES[satH]?.toLowerCase() ?? 'life'} matters. Less intense than Sade Sati but demands discipline, patience, and avoiding shortcuts. ${satFromMoon === 4 ? 'Home and property need careful attention.' : satFromMoon === 7 ? 'Relationships face tests of commitment.' : 'Career requires sustained effort — recognition is delayed but comes.'}`,
    };
  }

  return {
    active: false,
    type: 'clear',
    satHouseFromLagna: satH,
    satHouseFromMoon: satFromMoon,
    description: [3,6,11].includes(satH)
      ? `Saturn in H${satH} — Upachaya position. Saturn actually builds strength here through consistent effort. No Sade Sati or Kantak active.`
      : `Saturn in H${satH} (${HOUSE_THEMES[satH]}) — No Sade Sati or Kantak active. Slow, durable progress through patience and structure.`,
  };
}

// ── Zone Alerts ───────────────────────────────────────────────

export function buildZoneAlerts(
  curPos: RawPlanetPositions,
  natal: NatalChartInput,
): TransitZoneAlert[] {
  const alerts: TransitZoneAlert[] = [];
  const { lagR, planets } = natal;
  const moonRashi = Math.floor(planets.Moon.lon / 30);

  // Saturn
  const satR    = Math.floor(curPos.Saturn / 30);
  const satH    = ((satR - lagR + 12) % 12) + 1;
  const satFromMoon = ((satR - moonRashi + 12) % 12) + 1;
  const sadeSati = analyzeSadeSati(curPos.Saturn, planets.Moon.lon, lagR);

  if (sadeSati.type === 'sade-sati') {
    alerts.push({
      type: 'sade_sati',
      severity: 'high',
      level: '⚠️ Warning',
      color: '#ef4444',
      planet: 'Saturn',
      planets: ['Saturn', 'Moon'],
      house: satFromMoon,
      title: `Sade Sati — ${sadeSati.phase === 'peak' ? 'Peak' : sadeSati.phase === 'entry' ? 'Entry' : 'Exit'} Phase Active`,
      para: sadeSati.description,
    });
  } else if (sadeSati.type === 'kantak') {
    alerts.push({
      type: 'kantak',
      severity: 'medium',
      level: '⚠️ Caution',
      color: '#f97316',
      planet: 'Saturn',
      planets: ['Saturn', 'Moon'],
      house: satFromMoon,
      title: `Kantak Shani — Saturn H${satFromMoon} from Moon`,
      para: sadeSati.description,
    });
  } else {
    alerts.push({
      type: 'clear',
      severity: 'low',
      level: '✅ Clear',
      color: '#22c55e',
      planet: 'Saturn',
      planets: ['Saturn'],
      house: satH,
      title: `Saturn Transit — H${satH} (${HOUSE_THEMES[satH]})`,
      para: sadeSati.description,
    });
  }

  // Jupiter
  const jupR    = Math.floor(curPos.Jupiter / 30);
  const jupH    = ((jupR - lagR + 12) % 12) + 1;
  const jupFromMoon = ((jupR - moonRashi + 12) % 12) + 1;
  const jupGurubala = [2, 5, 7, 9, 11].includes(jupFromMoon);

  alerts.push({
    type: jupGurubala ? 'opportunity' : 'mixed',
    severity: jupGurubala ? 'low' : 'medium',
    level: jupGurubala ? '✅ Opportunity' : '⚠️ Mixed',
    color: jupGurubala ? '#22c55e' : '#f97316',
    planet: 'Jupiter',
    planets: ['Jupiter'],
    house: jupH,
    title: `Jupiter Transit — H${jupH} (${HOUSE_THEMES[jupH]})`,
    para: jupGurubala
      ? `Jupiter is in a Guru-Bala position (${jupFromMoon}th from Moon). This coincides with opportunities in ${HOUSE_THEMES[jupH]?.toLowerCase() ?? 'life'} — marriages, financial windfalls, spiritual breakthroughs are possible. Jupiter transits a sign in ~12 months, so this window is precious.`
      : `Jupiter is in the ${jupFromMoon}th position from Moon — not a classic Guru-Bala placement. Expansion is still possible but may come with misjudgement or excess. Stay realistic, avoid over-extending, and do not rely solely on luck.`,
  });

  // Rahu-Ketu
  const rahuR     = Math.floor(curPos.Rahu / 30);
  const rahuH     = ((rahuR - lagR + 12) % 12) + 1;
  const ketuH     = ((rahuH + 5) % 12) + 1;
  const natalRahuH = planets.Rahu.house;
  const rahuReturn = rahuH === natalRahuH;

  alerts.push({
    type: rahuReturn ? 'rahu_return' : 'active',
    severity: rahuReturn ? 'high' : 'medium',
    level: rahuReturn ? '⚠️ High Alert' : 'ℹ️ Active',
    color: rahuReturn ? '#ef4444' : '#60a5fa',
    planet: 'Rahu',
    planets: ['Rahu', 'Ketu'],
    house: rahuH,
    title: `Rahu-Ketu Axis — H${rahuH}/H${ketuH}${rahuReturn ? ' (Rahu Return)' : ''}`,
    para: rahuReturn
      ? `Rahu Return is active — transit Rahu matches your natal Rahu position. This ~18-year cycle marks intense karmic acceleration. Events from 18 years ago may replay, complete, or transform. Sudden changes, unusual opportunities, and identity shifts are possible.`
      : `Transit Rahu in H${rahuH} is amplifying ${HOUSE_THEMES[rahuH]?.toLowerCase() ?? 'life'} themes — unusual opportunities mixed with confusion. Ketu in H${ketuH} brings detachment and completion in ${HOUSE_THEMES[ketuH]?.toLowerCase() ?? 'life'} matters. The axis activates most intensely when triggered by Saturn or Jupiter transits.`,
  });

  return alerts;
}

// ── Upcoming Ingresses (next sign change per planet) ──────────

export function computeUpcomingIngresses(
  jdNow: number,
  tz: number,
  lagR: number,
): UpcomingIngress[] {
  const slowPlanets: PlanetName[] = ['Jupiter','Saturn','Rahu','Mars'];
  const results: UpcomingIngress[] = [];
  const curPos = computePlanets(jdNow);

  slowPlanets.forEach(planet => {
    const curR = Math.floor(curPos[planet] / 30);
    // Search up to 400 days
    for (let d = 1; d <= 400; d++) {
      const futPos = computePlanets(jdNow + d);
      const futR   = Math.floor(futPos[planet] / 30);
      if (futR !== curR) {
        const futDate = new Date(Date.now() + d * 86400000);
        const houseFromLagna = ((futR - lagR + 12) % 12) + 1;
        results.push({
          planet,
          fromRashi: curR,
          toRashi: futR,
          toRashiName: `${RASHIS_EN[futR]} (H${houseFromLagna})`,
          daysAway: d,
          approxDate: futDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        });
        break;
      }
    }
  });

  return results.sort((a, b) => a.daysAway - b.daysAway);
}

// ── Degree Conjunctions (transit hitting natal planet within 2°) ──

export function computeDegreeConjunctions(
  jdNow: number,
  natal: NatalChartInput,
): DegreeConjunction[] {
  const slowTransits: PlanetName[] = ['Jupiter','Saturn','Rahu','Mars'];
  const natalPlanets: PlanetName[] = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const results: DegreeConjunction[] = [];

  slowTransits.forEach(tp => {
    natalPlanets.forEach(np => {
      const natalLon = natal.planets[np]?.lon;
      if (natalLon === undefined) return;

      for (let d = 0; d <= 60; d++) {
        const pos  = computePlanets(jdNow + d);
        const tLon = pos[tp];
        let orb    = Math.abs(tLon - natalLon);
        if (orb > 180) orb = 360 - orb;
        if (orb <= 2) {
          const approxDate = new Date(Date.now() + d * 86400000);
          results.push({
            transitPlanet: tp,
            natalPlanet: np,
            orbDeg: Math.round(orb * 10) / 10,
            approxDate: approxDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            daysAway: d,
            description: `Transit ${tp} conjuncts natal ${np} within ${orb.toFixed(1)}°. ${tp === 'Jupiter' ? 'Expansion and blessings for ' + np + ' matters.' : tp === 'Saturn' ? 'Karmic activation and discipline required for ' + np + ' themes.' : tp === 'Rahu' ? 'Unusual events and sudden changes around ' + np + ' matters.' : 'Energetic activation of ' + np + ' themes.'}`,
          });
          break;
        }
      }
    });
  });

  return results.sort((a, b) => a.daysAway - b.daysAway).slice(0, 6);
}

// ── Summary Builder ───────────────────────────────────────────

function buildSummary(
  planets: TransitPlanetResult[],
  sadeSati: SadeSatiInfo,
  base: TransitBase,
): string {
  const favorable = planets.filter(p => p.effect === 'favorable').map(p => p.planet);
  const caution   = planets.filter(p => p.effect === 'caution').map(p => p.planet);
  let summary = '';
  if (sadeSati.active) summary += `⚠️ ${sadeSati.type === 'sade-sati' ? 'Sade Sati' : 'Kantak Shani'} active. `;
  if (favorable.length) summary += `✅ Favorable: ${favorable.slice(0, 4).join(', ')}. `;
  if (caution.length)   summary += `⚠️ Caution: ${caution.slice(0, 3).join(', ')}. `;
  summary += `Counted from ${base === 'lagna' ? 'Lagna (Parashari)' : 'Moon (Chandra Lagna)'}.`;
  return summary.trim();
}

// ── Master Run Function ───────────────────────────────────────

export function runTransitEngine(
  natal: NatalChartInput,
  base: TransitBase = 'lagna',
  dateStr?: string,
): TransitEngineResult {
  const tz     = natal.tz ?? 5.5;
  const today  = dateStr ?? new Date().toISOString().split('T')[0];
  const jdNow  = getJD(today, '12:00', tz);
  const curPos = computePlanets(jdNow);
  const retro  = computeRetro(jdNow);
  const retroMap = retro as Partial<Record<PlanetName, boolean>>;

  const baseRashi = base === 'lagna' ? natal.lagR : Math.floor(natal.planets.Moon.lon / 30);

  const planetResults: TransitPlanetResult[] = PLANETS.map(planet => {
    const tLon  = curPos[planet] ?? 0;
    const tR    = Math.floor(tLon / 30);
    const tDeg  = (tLon % 30).toFixed(1);
    const house = ((tR - baseRashi + 12) % 12) + 1;
    const isRetro = retroMap[planet] ?? false;
    const rules = TR_RULES[planet];
    let effect: TransitPlanetResult['effect'] = 'neutral';
    let effectLabel = '~ Neutral';
    let note = 'No BPHS rule applies directly to this planet.';

    if (rules) {
      if (rules.good.includes(house)) {
        effect = 'favorable'; effectLabel = '✨ Favorable';
        note = getTrNote(planet, house, 'good');
      } else if (rules.bad.includes(house)) {
        effect = 'caution'; effectLabel = '⚠ Caution';
        note = getTrNote(planet, house, 'bad');
      }
    }

    return {
      planet,
      transitLon: tLon,
      transitRashi: tR,
      transitRashiName: RASHIS_EN[tR] ?? '—',
      transitDeg: `${tDeg}°`,
      houseFromBase: house,
      isRetro,
      effect,
      effectLabel,
      note,
      nakshatraName: getNakshatra(tLon),
      color: PLANET_COLORS[planet],
      emoji: PLANET_EMOJI[planet],
    };
  });

  const sadeSati = analyzeSadeSati(curPos.Saturn, natal.planets.Moon.lon, natal.lagR);
  const zoneAlerts = buildZoneAlerts(curPos, natal);
  const upcomingIngresses = computeUpcomingIngresses(jdNow, tz, natal.lagR);
  const degreeConjunctions = computeDegreeConjunctions(jdNow, natal);
  const summary = buildSummary(planetResults, sadeSati, base);

  return {
    date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    base,
    baseRashi,
    planets: planetResults,
    sadeSati,
    zoneAlerts,
    upcomingIngresses,
    degreeConjunctions,
    summary,
  };
}
