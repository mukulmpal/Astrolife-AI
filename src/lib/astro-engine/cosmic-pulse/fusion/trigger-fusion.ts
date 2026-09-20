import type {
  PulseTrigger,
  TaraBalaModifier,
  ChandraBalaModifier,
  TriggerSeverity,
} from "../types";

const SEVERITY_RANK: Record<TriggerSeverity, number> = {
  critical: 4,
  caution: 3,
  opportunity: 2,
  horizon: 1,
  info: 0,
};

function getCanonicalPlanetKey(planets: string[]): string {
  return [...planets].sort().join("-");
}

export function fuseTriggers(
  rawTriggers: PulseTrigger[],
  taraBala?: TaraBalaModifier,
  chandraBala?: ChandraBalaModifier
): {
  dominantTrigger: PulseTrigger | null;
  activeTriggers: PulseTrigger[];
  upcomingTriggers: PulseTrigger[];
} {
  if (rawTriggers.length === 0) {
    return {
      dominantTrigger: null,
      activeTriggers: [],
      upcomingTriggers: [],
    };
  }

  // 1. Group triggers by planet cluster
  const clusters = new Map<string, PulseTrigger[]>();

  for (const trigger of rawTriggers) {
    const key = getCanonicalPlanetKey(trigger.primaryPlanets);
    const list = clusters.get(key) ?? [];
    list.push(trigger);
    clusters.set(key, list);
  }

  const fusedTriggers: PulseTrigger[] = [];

  for (const [, group] of clusters.entries()) {
    // Sort within group: highest severity, closest orb
    group.sort((a, b) => {
      const sDiff = (SEVERITY_RANK[b.severity] || 0) - (SEVERITY_RANK[a.severity] || 0);
      if (sDiff !== 0) return sDiff;
      return a.evidence.currentOrbDeg - b.evidence.currentOrbDeg;
    });

    const primary = { ...group[0] };
    const supportingSignals: string[] = [];

    // Add aspect/transit details from all members in the group
    for (const member of group) {
      if (member.id !== primary.id) {
        supportingSignals.push(`${member.evidence.aspectType} (${member.orbDescription})`);
      } else {
        supportingSignals.push(`${member.evidence.aspectType} (Core Alignment)`);
      }
    }

    // Contextual modifiers from Tara Bala & Chandra Bala
    if (taraBala && taraBala.quality === "caution" && (primary.severity === "critical" || primary.severity === "caution")) {
      supportingSignals.push(`Tara Bala: ${taraBala.name} Tara (Cautionary Filter)`);
    } else if (taraBala && taraBala.quality === "supportive" && primary.severity === "opportunity") {
      supportingSignals.push(`Tara Bala: ${taraBala.name} Tara (Supportive Reinforcement)`);
    }

    if (chandraBala && chandraBala.isAshtamaChandra && (primary.severity === "critical" || primary.severity === "caution")) {
      supportingSignals.push("Chandra Bala: Ashtama Chandra (8th House Transit Caution)");
    }

    primary.supportingSignals = Array.from(new Set(supportingSignals));
    fusedTriggers.push(primary);
  }

  // Sort fused triggers overall
  fusedTriggers.sort((a, b) => {
    const sDiff = (SEVERITY_RANK[b.severity] || 0) - (SEVERITY_RANK[a.severity] || 0);
    if (sDiff !== 0) return sDiff;
    if (a.lifecycle === "peak" && b.lifecycle !== "peak") return -1;
    if (b.lifecycle === "peak" && a.lifecycle !== "peak") return 1;
    return a.evidence.currentOrbDeg - b.evidence.currentOrbDeg;
  });

  const dominantTrigger = fusedTriggers[0] ?? null;
  const activeTriggers = fusedTriggers.filter(
    (t) => t.lifecycle === "peak" || t.lifecycle === "approaching"
  );
  const upcomingTriggers = fusedTriggers.filter(
    (t) => t.lifecycle === "separating"
  );

  return {
    dominantTrigger,
    activeTriggers,
    upcomingTriggers,
  };
}
