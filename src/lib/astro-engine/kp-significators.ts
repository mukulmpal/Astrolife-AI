/**
 * ============================================================================
 * ASTROLIFE — KP 4-FOLD SIGNIFICATOR & NODE AGENT ENGINE (PHASE 2I-B)
 * ============================================================================
 * Pure, deterministic implementation of classical KP 4-Fold
 * House Significators and Rahu/Ketu Node Representation.
 * Completely free of arbitrary numeric scores.
 * ============================================================================
 */

import type { KPPlanet } from "./kp";
import type {
  KPPointEvidence,
  HouseSignificators,
  PlanetSignifications,
  SignificationDetail,
} from "./kp-evidence-types";

const ALL_KP_PLANETS: KPPlanet[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

export interface NodeRepresentation {
  node: "Rahu" | "Ketu";
  signLord: KPPlanet;
  starLord: KPPlanet;
  conjoinedPlanets: KPPlanet[];
  aspectingPlanets: KPPlanet[];
  representedPlanets: KPPlanet[];
}

/**
 * Calculates Rahu and Ketu representations per authentic KP principles:
 * 1. Sign Lord where Node is posited
 * 2. Star Lord of Node
 * 3. Planets conjoined in same bhava or close longitude (within 6°)
 * 4. Planets aspecting the Node (Vedic full aspects: 7th for all; 5th/9th for Jup; 4th/8th for Mars; 3rd/10th for Sat)
 */
export function extractNodeRepresentations(
  planets: Record<string, KPPointEvidence>
): Record<"Rahu" | "Ketu", NodeRepresentation> {
  const result: Record<"Rahu" | "Ketu", NodeRepresentation> = {
    Rahu: {
      node: "Rahu",
      signLord: "Mars",
      starLord: "Ketu",
      conjoinedPlanets: [],
      aspectingPlanets: [],
      representedPlanets: [],
    },
    Ketu: {
      node: "Ketu",
      signLord: "Mars",
      starLord: "Ketu",
      conjoinedPlanets: [],
      aspectingPlanets: [],
      representedPlanets: [],
    },
  };

  (["Rahu", "Ketu"] as const).forEach((nodeName) => {
    const nodePoint = planets[nodeName];
    if (!nodePoint) return;

    const signLord = nodePoint.signLord;
    const starLord = nodePoint.starLord;
    const conjoined: KPPlanet[] = [];
    const aspecting: KPPlanet[] = [];

    ALL_KP_PLANETS.forEach((otherName) => {
      if (otherName === "Rahu" || otherName === "Ketu") return;
      const other = planets[otherName];
      if (!other) return;

      // Conjunction: Same bhava or within 6°
      const lonDiff = Math.abs(((other.longitude - nodePoint.longitude + 540) % 360) - 180);
      if (other.occupiedHouse === nodePoint.occupiedHouse || lonDiff <= 6.0) {
        conjoined.push(otherName);
      }

      // Aspects in KP: Standard special Parashari aspects
      const houseDistance = ((other.occupiedHouse - nodePoint.occupiedHouse + 12) % 12);
      // houseDistance from other to node:
      const targetHouseDist = ((nodePoint.occupiedHouse - other.occupiedHouse + 12) % 12) + 1; // 1 to 12

      if (targetHouseDist === 7) {
        // 7th house mutual aspect (all planets)
        aspecting.push(otherName);
      } else if (otherName === "Jupiter" && (targetHouseDist === 5 || targetHouseDist === 9)) {
        aspecting.push(otherName);
      } else if (otherName === "Mars" && (targetHouseDist === 4 || targetHouseDist === 8)) {
        aspecting.push(otherName);
      } else if (otherName === "Saturn" && (targetHouseDist === 3 || targetHouseDist === 10)) {
        aspecting.push(otherName);
      }
    });

    // Deduplicate represented planets in order of KP prominence:
    // Conjunction > Aspect > Sign Lord > Star Lord
    const repSet = new Set<KPPlanet>();
    conjoined.forEach((p) => repSet.add(p));
    aspecting.forEach((p) => repSet.add(p));
    repSet.add(signLord);
    repSet.add(starLord);

    result[nodeName] = {
      node: nodeName,
      signLord,
      starLord,
      conjoinedPlanets: conjoined,
      aspectingPlanets: aspecting,
      representedPlanets: Array.from(repSet),
    };
  });

  return result;
}

/**
 * Derives the classical KP 4-Fold Significators for all 12 houses:
 * Grade 1 (Level A): Planet in the Star of an Occupant of House H
 * Grade 2 (Level B): Occupant of House H
 * Grade 3 (Level C): Planet in the Star of the Lord of House H
 * Grade 4 (Level D): Lord of House H
 * + Rahu/Ketu acting as agent
 */
export function build4FoldHouseSignificators(
  pointEvidence: Record<string, KPPointEvidence>,
  houseLords: Record<number, KPPlanet>
): {
  houseSignificators: Record<number, HouseSignificators>;
  planetSignifications: Record<KPPlanet, PlanetSignifications>;
} {
  const nodeReps = extractNodeRepresentations(pointEvidence);

  // 1. Identify Occupants of each house
  const houseOccupants: Record<number, KPPlanet[]> = {};
  for (let h = 1; h <= 12; h++) houseOccupants[h] = [];

  ALL_KP_PLANETS.forEach((planetName) => {
    const p = pointEvidence[planetName];
    if (p && p.occupiedHouse >= 1 && p.occupiedHouse <= 12) {
      houseOccupants[p.occupiedHouse].push(planetName);
    }
  });

  // 2. Initialize House Significators
  const houseSignificators: Record<number, HouseSignificators> = {};
  for (let h = 1; h <= 12; h++) {
    const lord = houseLords[h];
    const occupants = houseOccupants[h] ?? [];

    // Grade 1: Planets in star of occupants
    const grade1: KPPlanet[] = [];
    ALL_KP_PLANETS.forEach((pName) => {
      const p = pointEvidence[pName];
      if (p && occupants.includes(p.starLord)) {
        if (!grade1.includes(pName)) grade1.push(pName);
      }
    });

    // Grade 2: Occupants themselves
    const grade2 = [...occupants];

    // Grade 3: Planets in star of house lord
    const grade3: KPPlanet[] = [];
    if (lord) {
      ALL_KP_PLANETS.forEach((pName) => {
        const p = pointEvidence[pName];
        if (p && p.starLord === lord) {
          if (!grade3.includes(pName)) grade3.push(pName);
        }
      });
    }

    // Grade 4: House Lord itself
    const grade4 = lord ? [lord] : [];

    // Node representation: Check if Rahu/Ketu represents any of the above significators
    const nodeAgents: Array<{ node: "Rahu" | "Ketu"; representingPlanet: KPPlanet; reason: string }> = [];
    (["Rahu", "Ketu"] as const).forEach((nodeName) => {
      const rep = nodeReps[nodeName];
      rep.representedPlanets.forEach((repPlanet) => {
        if (grade1.includes(repPlanet) || grade2.includes(repPlanet) || grade3.includes(repPlanet) || grade4.includes(repPlanet)) {
          const reason = rep.conjoinedPlanets.includes(repPlanet)
            ? `Conjoined with ${repPlanet}`
            : rep.aspectingPlanets.includes(repPlanet)
              ? `Aspected by ${repPlanet}`
              : rep.signLord === repPlanet
                ? `In sign of ${repPlanet}`
                : `In star of ${repPlanet}`;
          nodeAgents.push({ node: nodeName, representingPlanet: repPlanet, reason });
        }
      });
    });

    // Combine in strict order of strength: Grade 1 -> Grade 2 -> Grade 3 -> Grade 4 -> Node agents
    const combined: KPPlanet[] = [];
    const add = (p: KPPlanet) => {
      if (!combined.includes(p)) combined.push(p);
    };
    grade1.forEach(add);
    grade2.forEach(add);
    grade3.forEach(add);
    grade4.forEach(add);
    nodeAgents.forEach((na) => add(na.node));

    houseSignificators[h] = {
      house: h,
      grade1Planets: grade1,
      grade2Planets: grade2,
      grade3Planets: grade3,
      grade4Planets: grade4,
      nodeAgents,
      allSignificators: combined,
    };
  }

  // 3. Construct Inverted Planet Significations
  const planetSignifications: Record<KPPlanet, PlanetSignifications> = {} as any;

  ALL_KP_PLANETS.forEach((pName) => {
    const p = pointEvidence[pName];
    const details: SignificationDetail[] = [];
    const strongHouses = new Set<number>();
    const secondaryHouses = new Set<number>();

    for (let h = 1; h <= 12; h++) {
      const hs = houseSignificators[h];
      if (hs.grade1Planets.includes(pName)) {
        strongHouses.add(h);
        details.push({
          house: h,
          grade: "Grade_1_StarOfOccupant",
          reason: `Placed in the Star of ${p.starLord}, who occupies House ${h} (Strongest Grade 1)`,
        });
      }
      if (hs.grade2Planets.includes(pName)) {
        strongHouses.add(h);
        details.push({
          house: h,
          grade: "Grade_2_Occupant",
          reason: `Direct occupant of House ${h} (Grade 2)`,
        });
      }
      if (hs.grade3Planets.includes(pName)) {
        secondaryHouses.add(h);
        details.push({
          house: h,
          grade: "Grade_3_StarOfLord",
          reason: `Placed in the Star of ${p.starLord}, who is Lord of House ${h} (Grade 3)`,
        });
      }
      if (hs.grade4Planets.includes(pName)) {
        secondaryHouses.add(h);
        details.push({
          house: h,
          grade: "Grade_4_Lord",
          reason: `Owner/Lord of House ${h} (Grade 4)`,
        });
      }
      // Node agent check
      const agentMatch = hs.nodeAgents.find((na) => na.node === pName);
      if (agentMatch) {
        strongHouses.add(h);
        details.push({
          house: h,
          grade: "Node_Representation",
          reason: `Acting as Node Agent for ${agentMatch.representingPlanet} (${agentMatch.reason}) who signifies House ${h}`,
        });
      }
    }

    // Compile deduplicated ordered list: strong first, then secondary
    const all = Array.from(strongHouses);
    secondaryHouses.forEach((h) => {
      if (!all.includes(h)) all.push(h);
    });

    planetSignifications[pName] = {
      planet: pName,
      strongSignifications: Array.from(strongHouses).sort((a, b) => a - b),
      secondarySignifications: Array.from(secondaryHouses).sort((a, b) => a - b),
      allSignifications: all,
      details,
    };
  });

  return { houseSignificators, planetSignifications };
}

