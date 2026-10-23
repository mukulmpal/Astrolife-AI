/**
 * ============================================================================
 * ASTROLIFE — PLACIDUS HOUSE CUSP & KP ASTROLOGY ENGINE
 * ============================================================================
 * Implements classical Placidus semi-arc cusp calculations for KP Astrology.
 *
 * Directives:
 * - Mathematical semi-arc iteration for intermediate cusps (11, 12, 2, 3)
 * - Exact 180° opposition pairs (1-7, 4-10, 2-8, 3-9, 5-11, 6-12)
 * - Polar latitude (>66°) graceful fallback to Porphyry
 * - Authentic Placidus bhava occupancy: [Cusp_i, Cusp_i+1)
 * - KP sub-lord & star lord assignment for each cusp
 * ============================================================================
 */

export type KPPlanetName =
  | "Ketu"
  | "Venus"
  | "Sun"
  | "Moon"
  | "Mars"
  | "Rahu"
  | "Jupiter"
  | "Saturn"
  | "Mercury";

export type KPPlanet = KPPlanetName;

const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

// ── Math Helpers ─────────────────────────────────────────────────────────────
const _r = (d: number) => (d * Math.PI) / 180;
const _d = (r: number) => (r * 180) / Math.PI;
const _n = (x: number) => ((x % 360) + 360) % 360;

function getNak(lon: number) {
  const norm = _n(lon);
  const idx = Math.floor(norm / (360 / 27));
  const pada = Math.floor((norm % (360 / 27)) / (360 / 108)) + 1;
  return {
    name: NAKSHATRAS[idx] ?? "Ashwini",
    lord: NAKSHATRA_LORDS[idx] ?? "Ketu",
    pada,
    idx,
  };
}

export function getStarLord(lon: number): KPPlanetName {
  const nakIdx = Math.min(26, Math.floor(_n(lon) / (360 / 27)));
  return (NAKSHATRA_LORDS[nakIdx] as KPPlanetName) ?? "Ketu";
}

export function getPada(lon: number): number {
  const nakSize = 360 / 27;
  const rem = _n(lon) - Math.floor(_n(lon) / nakSize) * nakSize;
  return Math.min(4, Math.floor(rem / (nakSize / 4)) + 1);
}

const DASHA_ORDER: KPPlanetName[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

const DASHA_YEARS: Record<KPPlanetName, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export function getSubLord(lon: number): KPPlanetName {
  const nakSize = 360 / 27;
  const lonN = _n(lon);
  const nakIdx = Math.min(26, Math.floor(lonN / nakSize));
  const rem = lonN - nakIdx * nakSize;
  const starLord = (NAKSHATRA_LORDS[nakIdx] as KPPlanetName) ?? "Ketu";
  const startIdx = DASHA_ORDER.indexOf(starLord);

  let acc = 0;
  for (let i = 0; i < 9; i += 1) {
    const subPlanet = DASHA_ORDER[(startIdx + i) % 9];
    const segSize = nakSize * (DASHA_YEARS[subPlanet] / 120);
    acc += segSize;
    if (rem <= acc + 1e-9) return subPlanet;
  }
  return starLord;
}

export function getSubSubLord(lon: number): KPPlanetName {
  const nakSize = 360 / 27;
  const lonN = _n(lon);
  const nakIdx = Math.min(26, Math.floor(lonN / nakSize));
  const rem = lonN - nakIdx * nakSize;
  const starLord = (NAKSHATRA_LORDS[nakIdx] as KPPlanetName) ?? "Ketu";
  const startIdx = DASHA_ORDER.indexOf(starLord);

  let acc1 = 0;
  for (let i = 0; i < 9; i += 1) {
    const subPlanet = DASHA_ORDER[(startIdx + i) % 9];
    const segSize = nakSize * (DASHA_YEARS[subPlanet] / 120);

    if (rem <= acc1 + segSize + 1e-9) {
      const subRem = rem - acc1;
      const subStart = DASHA_ORDER.indexOf(subPlanet);
      let acc2 = 0;

      for (let j = 0; j < 9; j += 1) {
        const ssPlanet = DASHA_ORDER[(subStart + j) % 9];
        const ssSize = segSize * (DASHA_YEARS[ssPlanet] / 120);
        acc2 += ssSize;

        if (subRem <= acc2 + 1e-9) return ssPlanet;
      }
      return subPlanet;
    }
    acc1 += segSize;
  }
  return starLord;
}

export interface PlacidusCuspData {
  house: number;
  lon: number;
  sign: string;
  signNum: number;
  degree: number;
  minutes: number;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  starLord: KPPlanet;
  subLord: KPPlanet;
  subSubLord: KPPlanet;
  source: "placidus";
}

/**
 * Computes KP Krishnamurti Ayanamsha (Chitrapaksha baseline with KP correction).
 * At standard epoch 1900.0, KP ayanamsha is 22° 22' 24".
 */
export function computeKPAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  // Precession + IAU 1980 Nutation
  const precession = 23.85045 + 1.3972 * T + 0.000139 * T * T;
  // KP Krishnamurti offset is approx -0.098° (-5'53") relative to Lahiri
  const kpOffset = -0.098056;
  return precession + kpOffset;
}

/**
 * Computes true Placidus house cusps for a given Julian Day and coordinates.
 * Handles high latitudes (>66°) gracefully with Porphyry quadrant division.
 */
export function computePlacidusCusps(
  jd: number,
  lat: number,
  lonG: number,
  ayanamsha: number
): PlacidusCuspData[] {
  const T = (jd - 2451545) / 36525;
  const T2 = T * T;
  const T3 = T2 * T;

  // Greenwich Apparent Sidereal Time (GAST)
  const GMST = _n(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T2 - T3 / 38710000);
  const eps = 23.4392911 - 0.0130042 * T; // True Obliquity
  const epsR = _r(eps);
  const LST = _n(GMST + lonG);
  const ramc = LST;
  const phi = _r(lat);

  // 1. Midheaven (MC / 10th Cusp)
  const mc = _n(_d(Math.atan2(Math.sin(_r(ramc)), Math.cos(_r(ramc)) * Math.cos(epsR))));

  // 2. Ascendant (1st Cusp)
  const A = Math.cos(_r(LST));
  const B = -(Math.sin(_r(LST)) * Math.cos(epsR) + Math.tan(phi) * Math.sin(epsR));
  const asc = _n(_d(Math.atan2(A, B)));

  // Semi-arc iteration for intermediate cusps
  function getSemiArcCusp(f: number, offsetDeg: number, isAboveHorizon: boolean): number {
    const M = _r(ramc + offsetDeg);
    let alpha = M;
    for (let i = 0; i < 15; i++) {
      const tanDelta = Math.sin(alpha) * Math.tan(epsR);
      let arg = f * Math.tan(phi) * tanDelta;
      if (Math.abs(arg) >= 1.0) arg = Math.sign(arg) * 0.999999;
      alpha = isAboveHorizon ? M - Math.asin(arg) : M + Math.asin(arg);
    }
    return _n(_d(Math.atan2(Math.sin(alpha), Math.cos(alpha) * Math.cos(epsR))));
  }

  let c1: number, c2: number, c3: number, c10: number, c11: number, c12: number;

  if (Math.abs(lat) >= 66.0) {
    // Polar fallback: Porphyry quadrant division
    c10 = mc;
    c1 = asc;
    const arc1 = _n(c1 - c10);
    c11 = _n(c10 + arc1 / 3);
    c12 = _n(c10 + (2 * arc1) / 3);
    const c4 = _n(c10 + 180);
    const arc2 = _n(c4 - c1);
    c2 = _n(c1 + arc2 / 3);
    c3 = _n(c1 + (2 * arc2) / 3);
  } else {
    c10 = mc;
    c11 = getSemiArcCusp(1 / 3, 30, true);
    c12 = getSemiArcCusp(2 / 3, 60, true);
    c1 = asc;
    c2 = getSemiArcCusp(2 / 3, 120, false);
    c3 = getSemiArcCusp(1 / 3, 150, false);
  }

  // Exact 180° opposite cusps
  const c4 = _n(c10 + 180);
  const c5 = _n(c11 + 180);
  const c6 = _n(c12 + 180);
  const c7 = _n(c1 + 180);
  const c8 = _n(c2 + 180);
  const c9 = _n(c3 + 180);

  const tropicalCusps = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12];

  // Convert to sidereal by subtracting Ayanamsha
  return tropicalCusps.map((tropCusp, index) => {
    const house = index + 1;
    const lon = _n(tropCusp - ayanamsha);
    const signNum = Math.floor(lon / 30);
    const degInSign = lon % 30;
    const deg = Math.floor(degInSign);
    const minutes = Math.floor((degInSign - deg) * 60);
    const nak = getNak(lon);

    return {
      house,
      lon,
      sign: RASHIS[signNum] ?? "Unknown",
      signNum,
      degree: deg,
      minutes,
      nakshatra: nak.name,
      nakshatraLord: nak.lord,
      pada: nak.pada,
      starLord: getStarLord(lon),
      subLord: getSubLord(lon),
      subSubLord: getSubSubLord(lon),
      source: "placidus",
    };
  });
}

/**
 * Assigns a planet's bhava house based on authentic Placidus cuspal intervals [C_i, C_i+1).
 * In classical KP astrology, a planet is in House i if its longitude is between Cusp i and Cusp i+1.
 */
export function getPlacidusBhavaHouse(planetLon: number, cusps: number[]): number {
  if (!cusps || cusps.length < 12) return Math.floor(_n(planetLon) / 30) + 1;

  const normPlanet = _n(planetLon);

  for (let i = 0; i < 12; i++) {
    const cuspStart = _n(cusps[i]);
    const cuspEnd = _n(cusps[(i + 1) % 12]);

    if (cuspStart < cuspEnd) {
      if (normPlanet >= cuspStart && normPlanet < cuspEnd) {
        return i + 1;
      }
    } else {
      // Crosses 0° Aries boundary
      if (normPlanet >= cuspStart || normPlanet < cuspEnd) {
        return i + 1;
      }
    }
  }

  return 1;
}
