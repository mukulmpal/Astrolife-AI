/**
 * ============================================================================
 * ASTROLIFE — KP CUSP PROMISE ENGINE (PHASE 2I-C)
 * ============================================================================
 * Deterministic evaluation of Cusp Sub-Lord as the primary predictive gatekeeper.
 * Assesses whether life matters associated with each cusp are:
 * - SUPPORTED
 * - OBSTRUCTED
 * - MIXED
 * based strictly on 4-Fold significations, free of arbitrary scores.
 * ============================================================================
 */

import type { KPPlanet } from "./kp";
import type {
  CuspPromiseEvidence,
  CuspPromiseStatus,
  PlanetSignifications,
} from "./kp-evidence-types";

/**
 * Standard classical KP favorable and detriment houses for each of the 12 cusps:
 * Detriment is primarily the 12th from that cusp (loss/negation of that house matter)
 * plus standard trik houses (6, 8, 12 relative to the matter).
 */
export const CUSP_HOUSE_PROFILES: Record<
  number,
  {
    name: string;
    matter: string;
    favorableHouses: number[];
    detrimentHouses: number[];
  }
> = {
  1: {
    name: "1st Cusp (Lagna)",
    matter: "Physical vitality, longevity, personal capability, and general health",
    favorableHouses: [1, 3, 5, 9, 11],
    detrimentHouses: [6, 8, 12],
  },
  2: {
    name: "2nd Cusp (Dhana)",
    matter: "Wealth accumulation, family stability, liquidated assets, financial inflows",
    favorableHouses: [2, 6, 10, 11],
    detrimentHouses: [1, 5, 12],
  },
  3: {
    name: "3rd Cusp (Sahaja)",
    matter: "Courage, initiative, communications, contracts, short journeys, siblings",
    favorableHouses: [3, 9, 11],
    detrimentHouses: [2, 12],
  },
  4: {
    name: "4th Cusp (Sukha)",
    matter: "Fixed assets, real estate, vehicles, basic education, domestic happiness",
    favorableHouses: [4, 9, 11, 2],
    detrimentHouses: [3, 6, 12],
  },
  5: {
    name: "5th Cusp (Putra)",
    matter: "Progeny, speculative success, creativity, romance, spiritual initiation",
    favorableHouses: [2, 5, 11],
    detrimentHouses: [4, 6, 12],
  },
  6: {
    name: "6th Cusp (Ripu / Roga)",
    matter: "Competitive victory, service/employment, overcoming debts, litigation recovery",
    favorableHouses: [6, 10, 11],
    detrimentHouses: [5, 12],
  },
  7: {
    name: "7th Cusp (Jaya / Kalatra)",
    matter: "Marriage, legal union, business partnerships, public interaction",
    favorableHouses: [2, 7, 11],
    detrimentHouses: [1, 6, 10, 12],
  },
  8: {
    name: "8th Cusp (Randhra)",
    matter: "Sudden windfalls, unearned wealth, legacy/inheritance, longevity, transformation",
    favorableHouses: [2, 8, 11],
    detrimentHouses: [7, 12],
  },
  9: {
    name: "9th Cusp (Dharma / Bhagya)",
    matter: "Higher learning, foreign travels, divine fortune, philosophical pursuits",
    favorableHouses: [9, 11, 1],
    detrimentHouses: [8, 12],
  },
  10: {
    name: "10th Cusp (Karma)",
    matter: "Career, profession, social status, authoritative appointment, public recognition",
    favorableHouses: [2, 6, 10, 11],
    detrimentHouses: [5, 9, 12],
  },
  11: {
    name: "11th Cusp (Labha)",
    matter: "Fulfillment of desires, profits, social network, realization of aspirations",
    favorableHouses: [1, 2, 6, 10, 11],
    detrimentHouses: [12],
  },
  12: {
    name: "12th Cusp (Vyaya)",
    matter: "Foreign settlement, spiritual liberation, investments, institutional stay",
    favorableHouses: [3, 9, 12],
    detrimentHouses: [2, 11],
  },
};

/**
 * Evaluates the promise of a specific cusp based on its Sub-Lord's significations:
 */
export function evaluateCuspPromise(
  cuspHouse: number,
  cuspSubLord: KPPlanet,
  cuspStarLord: KPPlanet,
  planetSignifications: Record<KPPlanet, PlanetSignifications>
): CuspPromiseEvidence {
  const profile = CUSP_HOUSE_PROFILES[cuspHouse] ?? {
    name: `Cusp ${cuspHouse}`,
    matter: `Matters of House ${cuspHouse}`,
    favorableHouses: [cuspHouse, 11],
    detrimentHouses: [((cuspHouse - 2 + 12) % 12) + 1],
  };

  const subSignifications = planetSignifications[cuspSubLord];
  const signified = subSignifications?.allSignifications ?? [];

  const favorableMatches = signified.filter((h) => profile.favorableHouses.includes(h));
  const detrimentMatches = signified.filter((h) => profile.detrimentHouses.includes(h));

  const primarySupport = favorableMatches.includes(cuspHouse) || favorableMatches.includes(11);
  const detrimentPresent = detrimentMatches.length > 0;

  let status: CuspPromiseStatus;
  let reason: string;

  if (favorableMatches.length > 0 && detrimentMatches.length === 0) {
    status = "SUPPORTED";
    reason = `Cusp ${cuspHouse} Sub-Lord (${cuspSubLord}) signifies favorable houses [${favorableMatches.join(
      ", "
    )}] with zero detriment houses present. The matter is strongly promised in the chart.`;
  } else if (favorableMatches.length > 0 && detrimentMatches.length > 0) {
    // If primary support is present, check balance
    if (primarySupport && favorableMatches.length >= detrimentMatches.length) {
      status = "MIXED";
      reason = `Cusp ${cuspHouse} Sub-Lord (${cuspSubLord}) connects to both favorable houses [${favorableMatches.join(
        ", "
      )}] and detriment houses [${detrimentMatches.join(
        ", "
      )}]. The event is promised but subject to delays, conditions, or friction.`;
    } else {
      status = "OBSTRUCTED";
      reason = `Cusp ${cuspHouse} Sub-Lord (${cuspSubLord}) has prominent detriment connections [${detrimentMatches.join(
        ", "
      )}] overcoming favorable links. The matter faces significant structural obstruction.`;
    }
  } else if (detrimentMatches.length > 0) {
    status = "OBSTRUCTED";
    reason = `Cusp ${cuspHouse} Sub-Lord (${cuspSubLord}) connects exclusively to detriment houses [${detrimentMatches.join(
      ", "
    )}] with no direct support for ${profile.matter}.`;
  } else {
    // Neutral or secondary connection
    status = "MIXED";
    reason = `Cusp ${cuspHouse} Sub-Lord (${cuspSubLord}) signifies neutral houses [${signified.join(
      ", "
    )}]. Fructification requires activation through appropriate dasha and transit alignments.`;
  }

  const evidenceChain: string[] = [
    `Cusp ${cuspHouse} (${profile.name}) governs: ${profile.matter}.`,
    `Cusp Sub-Lord: ${cuspSubLord} (Star-Lord: ${cuspStarLord}).`,
    `Sub-Lord ${cuspSubLord} signifies houses: [${signified.join(", ")}].`,
    `Favorable matches: [${favorableMatches.length > 0 ? favorableMatches.join(", ") : "None"}].`,
    `Detriment matches: [${detrimentMatches.length > 0 ? detrimentMatches.join(", ") : "None"}].`,
    `Evaluation Verdict: ${status}.`,
  ];

  return {
    cuspHouse,
    cuspSubLord,
    cuspStarLord,
    signifiedHouses: signified,
    favorableHouses: favorableMatches,
    detrimentHouses: detrimentMatches,
    status,
    primarySupport,
    detrimentPresent,
    reason,
    evidenceChain,
  };
}

/**
 * Evaluates promises across all 12 Placidus cusps:
 */
export function evaluateAllCuspPromises(
  cusps: Array<{ house: number; subLord: KPPlanet; starLord: KPPlanet }>,
  planetSignifications: Record<KPPlanet, PlanetSignifications>
): Record<number, CuspPromiseEvidence> {
  const result: Record<number, CuspPromiseEvidence> = {};

  cusps.forEach((cusp) => {
    result[cusp.house] = evaluateCuspPromise(
      cusp.house,
      cusp.subLord,
      cusp.starLord,
      planetSignifications
    );
  });

  return result;
}

