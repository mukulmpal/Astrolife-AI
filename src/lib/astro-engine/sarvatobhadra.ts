// ============================================================
// SARVATOBHADRA CHAKRA ENGINE
// Vedic 27-Nakshatra Transit Analysis System
// Detects Vedha (obstruction) points from birth nakshatra
// ============================================================

import { computePlanets, getJD } from './calculations';
import type { ChartData } from './calculations';

// ── 27 Nakshatras in order ────────────────────────────────────
const NAK27 = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

// ── Planets in the classical order ───────────────────────────
const PLANETS_9 = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// ── Vedha sensitive distances from janma nakshatra ────────────
const VEDHA_DISTANCES = [1, 3, 5, 7];

// ── Types ─────────────────────────────────────────────────────
export interface SvbNakshatraRow {
  index: number;           // 0-26
  name: string;            // nakshatra name
  type: 'janma' | 'vedha' | 'normal';
  natalPlanets: string[];  // planets in this nak natally
  transitPlanets: string[];// planets transiting this nak today
  isActive: boolean;       // has natal or transit planets
}

export interface SvbVedhaAlert {
  planet: string;
  nakshatra: string;
  nakshatraIndex: number;
  type: 'janma_vedha' | 'sensitive_vedha';
  description: string;
  severity: 'high' | 'medium';
}

export interface SarvatobhadraResult {
  birthNakshatra: string;
  birthNakshatraIndex: number;
  rows: SvbNakshatraRow[];
  vedhaAlerts: SvbVedhaAlert[];
  transitDate: Date;
  sensitiveIndices: Set<number>;
  janmaIndex: number;
}

// ── Planet Vedha descriptions ─────────────────────────────────
function getPlanetVedhaDescription(planet: string): string {
  const map: Record<string, string> = {
    Mars:    'Conflict / accident risk',
    Saturn:  'Delay / pressure / karmic weight',
    Rahu:    'Confusion / unexpected events',
    Ketu:    'Past karma activation / spiritual crisis',
    Jupiter: 'Opportunity / expansion',
    Venus:   'Relationship / pleasure activation',
    Sun:     'Authority / health vitality activation',
    Moon:    'Emotional sensitivity heightened',
    Mercury: 'Communication / travel sensitized',
  };
  return map[planet] ?? 'Cosmic influence activated';
}

// ── Vedha severity ─────────────────────────────────────────────
function getPlanetVedhaSeverity(planet: string): 'high' | 'medium' {
  const high = ['Mars', 'Saturn', 'Rahu', 'Ketu'];
  return high.includes(planet) ? 'high' : 'medium';
}

// ── Longitude → nakshatra index ───────────────────────────────
function lonToNakIndex(lon: number): number {
  const normalized = ((lon % 360) + 360) % 360;
  return Math.floor(normalized * 27 / 360);
}

// ── Main calculation ──────────────────────────────────────────
export function calculateSarvatobhadra(chart: ChartData): SarvatobhadraResult {
  // 1. Birth nakshatra from Moon longitude
  const moonLon = chart.planets['Moon']?.lon ?? 0;
  const janmaIndex = lonToNakIndex(moonLon);
  const birthNakshatra = NAK27[janmaIndex];

  // 2. Sensitive vedha indices: distance 1,3,5,7 forward & backward from janma (mod 27)
  const sensitiveIndices = new Set<number>();
  for (const dist of VEDHA_DISTANCES) {
    sensitiveIndices.add(((janmaIndex + dist) % 27 + 27) % 27);
    sensitiveIndices.add(((janmaIndex - dist) % 27 + 27) % 27);
  }

  // 3. Natal planet nakshatra indices
  const natalNakMap: Record<number, string[]> = {};
  for (const planet of PLANETS_9) {
    const pdata = chart.planets[planet];
    if (!pdata) continue;
    const idx = lonToNakIndex(pdata.lon);
    if (!natalNakMap[idx]) natalNakMap[idx] = [];
    natalNakMap[idx].push(planet);
  }

  // 4. Today's transit positions
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  // Use IST offset (5.5) as default; getJD expects UTC-based tz
  const jdToday = getJD(todayStr, '12:00', 5.5);
  const transitLons = computePlanets(jdToday);

  // Transit planets are available as planet name → longitude in computePlanets output
  // computePlanets returns Record<string, number> with keys matching planet names
  const transitNakMap: Record<number, string[]> = {};
  for (const planet of PLANETS_9) {
    const lon = transitLons[planet];
    if (lon === undefined || lon === null) continue;
    const idx = lonToNakIndex(lon);
    if (!transitNakMap[idx]) transitNakMap[idx] = [];
    transitNakMap[idx].push(planet);
  }

  // 5. Build rows
  const rows: SvbNakshatraRow[] = NAK27.map((name, i) => {
    const isJanma = i === janmaIndex;
    const isVedha = sensitiveIndices.has(i);
    const natal = natalNakMap[i] ?? [];
    const transit = transitNakMap[i] ?? [];
    return {
      index: i,
      name,
      type: isJanma ? 'janma' : isVedha ? 'vedha' : 'normal',
      natalPlanets: natal,
      transitPlanets: transit,
      isActive: natal.length > 0 || transit.length > 0,
    };
  });

  // 6. Build vedha alerts for transit planets landing on sensitive or janma indices
  const vedhaAlerts: SvbVedhaAlert[] = [];
  for (const planet of PLANETS_9) {
    const lon = transitLons[planet];
    if (lon === undefined || lon === null) continue;
    const idx = lonToNakIndex(lon);
    const isJanma = idx === janmaIndex;
    const isVedha = sensitiveIndices.has(idx);
    if (isJanma || isVedha) {
      vedhaAlerts.push({
        planet,
        nakshatra: NAK27[idx],
        nakshatraIndex: idx,
        type: isJanma ? 'janma_vedha' : 'sensitive_vedha',
        description: getPlanetVedhaDescription(planet),
        severity: getPlanetVedhaSeverity(planet),
      });
    }
  }

  // Sort: janma_vedha first, then by severity (high first)
  vedhaAlerts.sort((a, b) => {
    if (a.type === 'janma_vedha' && b.type !== 'janma_vedha') return -1;
    if (b.type === 'janma_vedha' && a.type !== 'janma_vedha') return 1;
    if (a.severity === 'high' && b.severity !== 'high') return -1;
    if (b.severity === 'high' && a.severity !== 'high') return 1;
    return 0;
  });

  return {
    birthNakshatra,
    birthNakshatraIndex: janmaIndex,
    rows,
    vedhaAlerts,
    transitDate: now,
    sensitiveIndices,
    janmaIndex,
  };
}
