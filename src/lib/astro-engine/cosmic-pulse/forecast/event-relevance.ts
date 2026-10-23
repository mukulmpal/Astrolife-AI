import type { ChartData } from "../../calculations";
import type { CosmicForecastEvent, EventRelevanceTier } from "./forecast-types";

/**
 * Classifies an astrological event into an intuitive relevance tier:
 * - "primary": Exact / near-exact natal hits, major Dasha transitions, or major fused planetary triggers.
 * - "supporting": Secondary aspects, related transit hits, or Dasha modifiers.
 * - "background": Wide/non-exact transits or context-only astronomical events.
 * 
 * Strict Invariant: NO user-facing numeric scores or ratings are produced.
 * Kendra/Trikona houses serve as contextual evidence, NOT an automatic elevation rule.
 */
export function classifyEventRelevance(
  event: CosmicForecastEvent,
  chart?: ChartData
): EventRelevanceTier {
  const currentOrb = event.evidence.currentOrbDeg;
  const isExactOrNear = event.timing.exactAt !== undefined || currentOrb <= 1.0;

  // 1. Major Dasha Milestones are inherently primary life transitions
  if (event.type === "dasha_milestone") {
    return "primary";
  }

  // Check active Dasha lords if chart is provided
  const activeMahaLord = chart?.dashas?.[0]?.planet;
  const activeAntarLord = chart?.antardasha?.[0]?.planet;
  const involvesDashaLord =
    (activeMahaLord && event.planets.includes(activeMahaLord as never)) ||
    (activeAntarLord && event.planets.includes(activeAntarLord as never));

  // 2. Exact or Near-Exact Natal Hits are Primary
  if (event.type === "transit_hit" && isExactOrNear) {
    return "primary";
  }

  // 3. Major Fused Planetary Triggers (Mutual Opposition or Major Conjunction)
  const isMajorPair =
    event.planets.includes("Saturn") ||
    event.planets.includes("Mars") ||
    event.planets.includes("Sun") ||
    event.planets.includes("Jupiter");

  const isMajorAspect = event.targetAngle === 180 || event.targetAngle === 0;

  if (event.type === "planetary_aspect" && isMajorAspect && isMajorPair && isExactOrNear) {
    return "primary";
  }

  // 4. Multi-Signal Synergy: Involving the current Dasha Lord with active orb
  if (involvesDashaLord && currentOrb <= 2.0) {
    return "primary";
  }

  // 5. Supporting Tiers: Secondary aspects or related transit hits within standard orb
  if (
    event.type === "transit_hit" ||
    (event.type === "planetary_aspect" && currentOrb <= 2.5) ||
    event.aspectType.includes("Special Aspect")
  ) {
    return "supporting";
  }

  // 6. Background: Wide orbs or context-only alignments
  return "background";
}

/**
 * Annotates a list of forecast events with their non-numeric relevance tier.
 */
export function prioritizeForecastEvents(
  events: CosmicForecastEvent[],
  chart?: ChartData
): CosmicForecastEvent[] {
  return events.map((event) => ({
    ...event,
    relevanceTier: classifyEventRelevance(event, chart),
  }));
}
