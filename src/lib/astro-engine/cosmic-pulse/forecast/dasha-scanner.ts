import type { CosmicForecastEvent } from "./forecast-types";
import type { DashaEntry } from "../detectors/dasha-transitions";
import type { LifeArea } from "../types";

const PLANET_LIFE_AREAS: Record<string, LifeArea[]> = {
  Sun: ["career", "health", "mindset"],
  Moon: ["mindset", "home", "relationships"],
  Mars: ["career", "health", "wealth"],
  Mercury: ["education", "career", "wealth"],
  Jupiter: ["spirituality", "education", "wealth"],
  Venus: ["relationships", "wealth", "home"],
  Saturn: ["career", "health", "mindset"],
  Rahu: ["career", "mindset", "wealth"],
  Ketu: ["spirituality", "mindset", "health"],
};

export function scanDashaEvents(
  dashas: DashaEntry[],
  antardashas: DashaEntry[],
  startDate: Date,
  daysAhead: number,
  localTz = 5.5
): CosmicForecastEvent[] {
  const events: CosmicForecastEvent[] = [];
  const startMs = startDate.getTime();
  const endMs = startMs + daysAhead * 86400000;

  // 1. Scan Mahadasha Transitions
  for (let i = 0; i < dashas.length; i++) {
    const d = dashas[i];
    const transTime = new Date(d.end).getTime();

    if (transTime >= startMs && transTime <= endMs) {
      const nextDasha = dashas[i + 1];
      const nextLord = nextDasha?.planet ?? "Next Cycle";
      const exactDate = new Date(transTime);

      const lifeAreas = Array.from(
        new Set([
          ...(PLANET_LIFE_AREAS[d.planet] ?? ["mindset"]),
          ...(PLANET_LIFE_AREAS[nextLord] ?? ["career"]),
        ])
      );

      events.push({
        id: `dasha-md-${d.planet}-${nextLord}-${exactDate.toISOString().slice(0, 10)}`,
        type: "dasha_milestone",
        title: `Mahadasha Transition: ${d.planet} ➔ ${nextLord}`,
        headline: `Major planetary chapter transition from ${d.planet} to ${nextLord}, traditionally associated with evolving life focus and directional growth.`,
        planets: [d.planet as any, nextLord as any],
        aspectType: "Mahadasha Transition",
        targetAngle: 0,
        lifeAreas,
        severity: "caution",
        relevanceTier: "primary",
        timing: {
          contactAt: new Date(Math.max(startMs, transTime - 90 * 86400000)), // 90-day Sandhi entry
          exactAt: exactDate,
          peakAt: exactDate,
          separationAt: new Date(transTime + 86400000),
        },
        evidence: {
          aspectType: "Mahadasha Boundary (Chidra Dasha)",
          planetA: d.planet as any,
          planetB: nextLord as any,
          longitudeA: 0,
          longitudeB: 0,
          exactAspectDeg: 0,
          currentOrbDeg: 0,
          isApplying: true,
          shastraReference: "Classical Parashari Framework (Vimshottari Dasha Siddhanta)",
        },
        provenance: {
          calculationBasis: [
            "Vimshottari Dasha calculation",
            "Chidra Dasha 90-day Sandhi window",
            "Local chart timezone adjustment",
          ],
          searchIntervalDays: daysAhead,
          numericalRefinementMethod: "Calendar Boundary Resolution",
          localTz,
        },
        dashaContext: {
          mahadasha: d.planet,
          antardasha: nextLord,
        },
      });
    }
  }

  // 2. Scan Antardasha Transitions
  for (let j = 0; j < antardashas.length; j++) {
    const ad = antardashas[j];
    const transTime = new Date(ad.end).getTime();

    if (transTime >= startMs && transTime <= endMs) {
      const nextAd = antardashas[j + 1];
      const nextLord = nextAd?.planet ?? "Next Cycle";
      const exactDate = new Date(transTime);

      const lifeAreas = Array.from(
        new Set([
          ...(PLANET_LIFE_AREAS[ad.planet] ?? ["mindset"]),
          ...(PLANET_LIFE_AREAS[nextLord] ?? ["career"]),
        ])
      );

      events.push({
        id: `dasha-ad-${ad.planet}-${nextLord}-${exactDate.toISOString().slice(0, 10)}`,
        type: "dasha_milestone",
        title: `Antardasha Shift: ${ad.planet} ➔ ${nextLord}`,
        headline: `Sub-period transition from ${ad.planet} to ${nextLord}, traditionally associated with fine-tuning responsibilities and active life themes.`,
        planets: [ad.planet as any, nextLord as any],
        aspectType: "Antardasha Transition",
        targetAngle: 0,
        lifeAreas,
        severity: "horizon",
        relevanceTier: "primary",
        timing: {
          contactAt: new Date(Math.max(startMs, transTime - 30 * 86400000)), // 30-day shift entry
          exactAt: exactDate,
          peakAt: exactDate,
          separationAt: new Date(transTime + 86400000),
        },
        evidence: {
          aspectType: "Antardasha Boundary",
          planetA: ad.planet as any,
          planetB: nextLord as any,
          longitudeA: 0,
          longitudeB: 0,
          exactAspectDeg: 0,
          currentOrbDeg: 0,
          isApplying: true,
          shastraReference: "Classical Parashari Framework (Antardasha Siddhanta)",
        },
        provenance: {
          calculationBasis: [
            "Vimshottari Antardasha calculation",
            "30-day sub-period shift window",
            "Local chart timezone adjustment",
          ],
          searchIntervalDays: daysAhead,
          numericalRefinementMethod: "Calendar Boundary Resolution",
          localTz,
        },
        dashaContext: {
          mahadasha: "Active",
          antardasha: `${ad.planet} ➔ ${nextLord}`,
        },
      });
    }
  }

  return events;
}

