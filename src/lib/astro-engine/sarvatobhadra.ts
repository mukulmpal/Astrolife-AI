import { computePlanets } from "./calculations";
import type { ChartData } from "./calculations";

const NAK27 = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

export interface SvbRow {
  index: number;
  name: string;
  type: "janma" | "vedha" | "normal";
  natalPlanets: string[];
  transitPlanets: string[];
  isActive: boolean;
}

export interface SvbAlert {
  planet: string;
  nakshatra: string;
  type: "janma_vedha" | "sensitive_vedha";
  severity: "high" | "medium";
}

export interface SarvatobhadraResult {
  birthNakshatra: string;
  birthNakshatraIndex: number;
  rows: SvbRow[];
  vedhaAlerts: SvbAlert[];
  sensitiveIndices: Set<number>;
}

export function calculateSarvatobhadra(chart: ChartData): SarvatobhadraResult {
  const moonLon = chart.planets.Moon?.lon || 0;
  const janmaIndex = Math.floor(((moonLon % 360) + 360) % 360 * 27 / 360);
  const birthNakshatra = NAK27[janmaIndex];
  
  const sensitiveIndices = new Set<number>();
  sensitiveIndices.add(janmaIndex);
  [1, 3, 5, 7].forEach((d) => {
    sensitiveIndices.add((janmaIndex + d) % 27);
    sensitiveIndices.add((janmaIndex - d + 270) % 27);
  });
  
  const natalPlanets: Record<number, string[]> = {};
  ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'].forEach((p) => {
    const pd = chart.planets[p];
    if (pd) {
      const nakIdx = Math.floor(((pd.lon % 360) + 360) % 360 * 27 / 360);
      natalPlanets[nakIdx] = (natalPlanets[nakIdx] || []).concat(p);
    }
  });
  
  const rows: SvbRow[] = NAK27.map((name, i) => ({
    index: i,
    name,
    type: i === janmaIndex ? 'janma' : sensitiveIndices.has(i) ? 'vedha' : 'normal',
    natalPlanets: natalPlanets[i] || [],
    transitPlanets: [],
    isActive: !!(natalPlanets[i] || (i === janmaIndex)),
  }));
  
  const vedhaAlerts: SvbAlert[] = [];
  Object.entries(natalPlanets).forEach(([idx, planets]) => {
    const i = parseInt(idx);
    if (sensitiveIndices.has(i)) {
      planets.forEach((p) => {
        vedhaAlerts.push({
          planet: p,
          nakshatra: NAK27[i],
          type: i === janmaIndex ? 'janma_vedha' : 'sensitive_vedha',
          severity: i === janmaIndex ? 'high' : 'medium',
        });
      });
    }
  });
  
  return { birthNakshatra, birthNakshatraIndex: janmaIndex, rows, vedhaAlerts, sensitiveIndices };
}
