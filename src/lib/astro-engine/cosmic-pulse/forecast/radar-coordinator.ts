import type { ChartData } from "../../calculations";
import type { PanchangResult } from "../../panchang";
import type { RadarHorizon, CosmicForecastEvent } from "./forecast-types";
import { scanPlanetaryEvents } from "./event-scanner";
import { scanDashaEvents } from "./dasha-scanner";
import { calculateCosmicPulse } from "../index";

export interface BuildRadarParams {
  chart: ChartData;
  panchang: PanchangResult;
  startDate?: Date;
  daysAhead?: number;
  localTz?: number;
}

import { prioritizeForecastEvents } from "./event-relevance";

export function buildRadarHorizons({
  chart,
  panchang,
  startDate = new Date(),
  daysAhead = 90,
  localTz = 5.5,
}: BuildRadarParams): RadarHorizon {
  // 1. Current live status (NOW)
  const currentPulse = calculateCosmicPulse({
    chart,
    panchang,
    currentDate: startDate,
  });

  // 2. Scan Planetary Aspect & Transit Hit Events across time
  const planetaryEvents = scanPlanetaryEvents(chart, startDate, daysAhead, localTz);

  // 3. Scan Dasha Milestones (Mahadasha Sandhi & Antardasha shifts) across time
  const dashaEvents = scanDashaEvents(
    (chart.dashas ?? []) as never,
    (chart.antardasha ?? []) as never,
    startDate,
    daysAhead,
    localTz
  );

  // 4. Combine into unified event stream
  const allEvents = [...planetaryEvents, ...dashaEvents];

  // 5. Deduplicate duplicate detector hits occurring at same timestamp
  // (Note: Distinct passes like Pass 1 vs Pass 2 have different timestamps/passNumbers and are preserved)
  const deduplicatedEvents = deduplicateEvents(allEvents);

  // 6. Chronological sort by culmination timestamp (exactAt || peakAt || contactAt)
  deduplicatedEvents.sort((a, b) => {
    const timeA = (a.timing.exactAt || a.timing.peakAt || a.timing.contactAt).getTime();
    const timeB = (b.timing.exactAt || b.timing.peakAt || b.timing.contactAt).getTime();
    return timeA - timeB;
  });

  // 7. Prioritize events into non-numeric relevance tiers
  const prioritizedEvents = prioritizeForecastEvents(deduplicatedEvents, chart);

  // 8. Partition into 30-day and 90-day horizons
  const startMs = startDate.getTime();
  const thirtyDaysMs = startMs + 30 * 86400000;
  const ninetyDaysMs = startMs + 90 * 86400000;

  const next30Days = prioritizedEvents.filter((ev) => {
    const evTime = (ev.timing.exactAt || ev.timing.peakAt || ev.timing.contactAt).getTime();
    return evTime >= startMs && evTime <= thirtyDaysMs;
  });

  const next90Days = prioritizedEvents.filter((ev) => {
    const evTime = (ev.timing.exactAt || ev.timing.peakAt || ev.timing.contactAt).getTime();
    return evTime > thirtyDaysMs && evTime <= ninetyDaysMs;
  });

  const allHorizonEvents = [...next30Days, ...next90Days];
  const relevanceCounts = {
    primary: allHorizonEvents.filter((e) => e.relevanceTier === "primary").length,
    supporting: allHorizonEvents.filter((e) => e.relevanceTier === "supporting").length,
    background: allHorizonEvents.filter((e) => e.relevanceTier === "background").length,
  };

  return {
    generatedAt: startDate.toISOString(),
    now: currentPulse.dominantTrigger ? [currentPulse.dominantTrigger] : [],
    next30Days,
    next90Days,
    relevanceCounts,
  };
}

/**
 * Deduplicates overlapping events for the same underlying occurrence
 * while strictly preserving distinct retrograde passes.
 */
function deduplicateEvents(events: CosmicForecastEvent[]): CosmicForecastEvent[] {
  const seen = new Set<string>();
  const result: CosmicForecastEvent[] = [];

  for (const ev of events) {
    const pKey = [...ev.planets].sort().join("-");
    const peakDay = (ev.timing.exactAt || ev.timing.peakAt).toISOString().slice(0, 10);
    const passNum = ev.retrogradeInfo?.passNumber ?? 1;

    const dedupeKey = `${ev.type}-${pKey}-${ev.targetAngle}-${peakDay}-p${passNum}`;

    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey);
      result.push(ev);
    }
  }

  return result;
}

