import type { DirectionCode, PlanetName, RoomType, VastuSystem } from "./types";

export const ENGINE_VERSION = "vastu-intelligence-complete-v3";

export const DIRECTION_KNOWLEDGE: Record<DirectionCode, {
  name: string;
  element: string;
  deity: string;
  planet?: PlanetName;
  domains: string[];
  ideal: string[];
  avoid: string[];
}> = {
  N: {
    name: "North",
    element: "Water / wealth flow",
    deity: "Kubera / Soma tradition",
    planet: "Mercury",
    domains: ["wealth", "opportunity", "business", "clarity"],
    ideal: ["open space", "study", "business flow", "reception"],
    avoid: ["heavy blockage", "dirty toilet pressure", "fire overload"],
  },
  NE: {
    name: "North-East",
    element: "Water + spiritual clarity",
    deity: "Ishana",
    planet: "Jupiter",
    domains: ["spiritual", "mentalPeace", "health", "children", "wisdom"],
    ideal: ["pooja", "meditation", "study", "underground water", "clean open space"],
    avoid: ["toilet", "kitchen", "septic tank", "heavy storage", "staircase", "dustbin"],
  },
  E: {
    name: "East",
    element: "Solar prana",
    deity: "Indra / Surya",
    planet: "Sun",
    domains: ["health", "positivity", "recognition", "awakening"],
    ideal: ["entrance", "windows", "morning light", "study"],
    avoid: ["darkness", "heavy blockage", "dirty utilities"],
  },
  SE: {
    name: "South-East",
    element: "Fire",
    deity: "Agni",
    planet: "Mars",
    domains: ["energy", "cashflow", "expenses", "digestion"],
    ideal: ["kitchen", "electricals", "pantry", "controlled fire"],
    avoid: ["water body", "toilet overload", "unstable couple bedroom in classical mode"],
  },
  S: {
    name: "South",
    element: "Heat / discipline",
    deity: "Yama",
    planet: "Mars",
    domains: ["discipline", "name", "fame", "recognition"],
    ideal: ["controlled storage", "stability", "small openings if required"],
    avoid: ["too low", "too open", "major underground water"],
  },
  SW: {
    name: "South-West",
    element: "Earth / stability",
    deity: "Nirriti / Pitru zone",
    planet: "Saturn",
    domains: ["relationship", "assets", "stability", "authority", "dailyEarning"],
    ideal: ["master bedroom", "heavy storage", "safe wall support"],
    avoid: ["toilet", "water body", "cut", "too open", "too low"],
  },
  W: {
    name: "West",
    element: "Varuna / settling gains",
    deity: "Varuna",
    planet: "Saturn",
    domains: ["career", "children", "creativity", "gains"],
    ideal: ["dining", "study variant", "controlled storage"],
    avoid: ["weakness", "excessive exposure without balance"],
  },
  NW: {
    name: "North-West",
    element: "Air / movement",
    deity: "Vayu",
    planet: "Moon",
    domains: ["support", "transactions", "movement", "trade", "network"],
    ideal: ["guest room", "toilet", "finished goods", "movement zone"],
    avoid: ["permanent safe", "over-stable master bedroom"],
  },
  CENTER: {
    name: "Brahmasthan / Markaz",
    element: "Space",
    deity: "Brahma",
    domains: ["health", "familyHarmony", "vitality", "mentalPeace"],
    ideal: ["open", "clean", "light", "circulation"],
    avoid: ["toilet", "staircase", "heavy load", "septic", "darkness"],
  },
};

export const CLASSICAL_ROOM_SCORES: Partial<Record<RoomType, Partial<Record<DirectionCode, number>>>> = {
  main_entrance: { NE: 10, E: 9, N: 8, NW: 7, SE: 6, W: 5, S: 4, SW: 3, CENTER: 0 },
  kitchen: { SE: 10, NW: 7, E: 6, S: 5, W: 4, N: 3, SW: 2, NE: 1, CENTER: 0 },
  master_bedroom: { SW: 10, S: 8, W: 7, NW: 5, SE: 4, N: 4, E: 3, NE: 1, CENTER: 0 },
  bedroom: { SW: 9, S: 8, W: 7, NW: 6, N: 5, E: 5, SE: 4, NE: 2, CENTER: 0 },
  kids_room: { N: 8, E: 8, NE: 7, W: 7, NW: 6, S: 4, SE: 4, SW: 3, CENTER: 0 },
  guest_room: { NW: 10, W: 7, N: 7, E: 6, S: 5, SE: 4, SW: 3, NE: 3, CENTER: 0 },
  toilet: { NW: 10, W: 8, S: 7, SE: 5, N: 4, E: 3, SW: 2, NE: 0, CENTER: 0 },
  bathroom: { E: 8, NW: 8, W: 7, N: 6, S: 5, SE: 4, SW: 3, NE: 2, CENTER: 0 },
  pooja_room: { NE: 10, E: 8, N: 8, W: 5, NW: 4, S: 2, SE: 2, SW: 1, CENTER: 4 },
  study_room: { NE: 9, E: 9, N: 8, W: 7, NW: 5, SE: 4, S: 4, SW: 3, CENTER: 0 },
  staircase: { SW: 9, S: 8, W: 8, SE: 5, NW: 5, N: 3, E: 3, NE: 1, CENTER: 0 },
  underground_water: { NE: 10, N: 8, E: 8, NW: 4, W: 3, S: 2, SE: 1, SW: 0, CENTER: 0 },
  overhead_tank: { SW: 9, W: 8, S: 7, NW: 6, SE: 5, N: 3, E: 3, NE: 0, CENTER: 0 },
  septic_tank: { NW: 8, W: 7, S: 6, SE: 4, N: 3, E: 2, SW: 1, NE: 0, CENTER: 0 },
  locker: { SW: 8, S: 7, W: 7, N: 7, NW: 5, E: 5, SE: 4, NE: 4, CENTER: 0 },
  brahmasthan: { CENTER: 10 },
};

export const DOMAIN_WEIGHTS: Record<string, string[]> = {
  wealth: ["N", "SE", "W", "SW"],
  health: ["E", "NE", "CENTER"],
  relationship: ["SW", "SE"],
  career: ["N", "W", "NW", "E"],
  children: ["W", "NE", "E"],
  spiritual: ["NE", "CENTER"],
  business: ["N", "NW", "W", "SE"],
  mentalPeace: ["NE", "CENTER", "E"],
  construction: ["NE", "SW", "CENTER", "E", "N"],
};

export const LAL_KITAB_DIRECTION_KHANA_MAP: Record<number, string[]> = {
  1: ["E"],
  2: ["NW"],
  3: ["S"],
  4: ["NE", "E_END"],
  6: ["N", "BASEMENT"],
  7: ["SW"],
  8: ["S_END", "S_WALL"],
  9: ["CENTER", "BRAHMASTHAN", "MARKAZ"],
  10: ["W"],
  11: ["W_END"],
  12: ["SE", "ROOF"],
};

export const ROOM_PLANET_MAP: Record<string, PlanetName | "Central Energy"> = {
  kitchen: "Mars",
  toilet: "Rahu",
  bathroom: "Rahu",
  bedroom: "Venus",
  master_bedroom: "Venus",
  water: "Moon",
  underground_water: "Moon",
  overhead_tank: "Moon",
  heavy_material: "Saturn",
  construction_material: "Saturn",
  sun_symbol: "Sun",
  brahmasthan: "Central Energy",
};

export const SOURCE_POLICY = {
  classical: "Primary authority for physical direction, room, mandala, bhumi and structural rules.",
  modern: "Secondary practical layer for apartments, shops, offices, hospitals, factories and user-friendly remedies.",
  mahaVastu: "Modern no-demolition remedy/product layer; do not treat as classical authority unless cross-checked.",
  lalKitab: "Separate kundli-gated Makan Vastu layer; never mix blindly with classical rules.",
};

export const SYSTEM_PRIORITY: Record<VastuSystem, number> = {
  classical_vastu: 1,
  modern_practical_vastu: 2,
  mahavastu_remedy: 3,
  lal_kitab_makan_vastu: 4,
  integrated: 5,
};
