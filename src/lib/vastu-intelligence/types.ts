export type DirectionCode = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" | "CENTER";

export type VastuSystem =
  | "classical_vastu"
  | "modern_practical_vastu"
  | "mahavastu_remedy"
  | "lal_kitab_makan_vastu"
  | "integrated";

export type AuthorityLevel = "primary" | "secondary" | "experimental";

export type PropertyType = "home" | "flat" | "office" | "shop" | "factory" | "hotel" | "plot" | "commercial";

export type RoomType =
  | "main_entrance"
  | "kitchen"
  | "bedroom"
  | "master_bedroom"
  | "kids_room"
  | "guest_room"
  | "toilet"
  | "bathroom"
  | "pooja_room"
  | "study_room"
  | "office_cabin"
  | "staircase"
  | "balcony"
  | "underground_water"
  | "overhead_tank"
  | "septic_tank"
  | "store_room"
  | "locker"
  | "brahmasthan"
  | "other";

export type PlanetName =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export interface RoomInput {
  type: RoomType | string;
  direction: DirectionCode | string;
  name?: string;
  notes?: string;
}

export interface PlanetPositionData {
  house: number;
  dignity?: string;
  retrograde?: boolean;
}

export interface VastuKundliInput {
  weakPlanets?: PlanetName[];
  afflictedPlanets?: PlanetName[];
  currentMahadasha?: PlanetName;
  currentAntardasha?: PlanetName;
  lalKitabHouses?: Record<string, PlanetName[]>;
  afflictions?: {
    sunSevere?: boolean;
    jupiterSevere?: boolean;
    marsSevere?: boolean;
    venusSevere?: boolean;
    saturnSevere?: boolean;
    rahuKetuSevere?: boolean;
  };
  // When full planet positions are provided (house/dignity/retrograde),
  // the 16-zone MahaVastu scoring and psych bridge will also run.
  planetPositions?: Record<string, PlanetPositionData>;
}

export interface VastuFeatureInput {
  northOpen?: boolean;
  eastOpen?: boolean;
  northEastClean?: boolean;
  southWestHeavy?: boolean;
  brahmasthanOpen?: boolean;
  constructionMaterialDirection?: DirectionCode | string;
  southWestLowerThanNorthEast?: boolean;
  northNeighborHigher?: boolean;
  southNeighborLower?: boolean;
  climate?: "hot" | "temperate" | "cold" | "mountain";
}

export interface VastuMeasurementInput {
  shape?: "square" | "rectangle" | "irregular" | "cut" | "triangular" | "many_corner" | "flat";
  lengthHasta?: number;
  widthHasta?: number;
  length?: number;
  width?: number;
}

export interface VastuAnalyzeOptions {
  includeClassical?: boolean;
  includeModern?: boolean;
  includeMahaVastuRemedies?: boolean;
  includeLalKitab?: boolean;
  includeConstruction?: boolean;
  includeAukat?: boolean;
  enableAstroAmplification?: boolean;
}

export interface VastuAnalyzeInput {
  propertyType?: PropertyType | string;
  facing?: DirectionCode | string;
  rooms?: RoomInput[];
  features?: VastuFeatureInput;
  measurements?: VastuMeasurementInput;
  kundli?: VastuKundliInput;
  options?: VastuAnalyzeOptions;
}

export interface VastuStrength {
  title: string;
  explanation: string;
  score: number;
  system: VastuSystem;
  sourceTag?: string;
}

export interface VastuDefect {
  code: string;
  title: string;
  explanation: string;
  severity: number;
  baseSeverity: number;
  direction?: DirectionCode | string;
  room?: string;
  domains: string[];
  remedies: string[];
  system: VastuSystem;
  authorityLevel: AuthorityLevel;
  requiresKundli?: boolean;
  sourceTag?: string;
}

export interface VastuRecommendation {
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  system: VastuSystem;
  steps: string[];
  requiresKundli?: boolean;
  caution?: string;
}

export interface VastuScores {
  overall: number;
  wealth: number;
  health: number;
  relationship: number;
  career: number;
  children: number;
  spiritual: number;
  business: number;
  mentalPeace: number;
  construction: number;
}

export interface MakanAukatResult {
  applicable: boolean;
  reason?: string;
  raw?: number;
  remainder?: number;
  isAuspicious?: boolean;
  planetPair?: PlanetName[];
  interpretation?: string;
  remedy?: string[];
}

export interface VastuZoneScore {
  dir: string;
  name: string;
  planet: string;
  element: string;
  deity: string;
  domain: string;
  color: string;
  house: number;
  score: number;
  status: "Strong" | "Average" | "Weak";
  statusColor: string;
  planets: string[];
  remedy: string;
  roomIdeal: string;
  hasDosha: boolean;
}

export interface VastuTransitAlert {
  planet: string;
  zone: string;
  domain: string;
  effect: string;
  remedy: string;
  positive: boolean;
}

export interface VastuZoneAnalysis {
  zones: VastuZoneScore[];
  strongZones: VastuZoneScore[];
  weakZones: VastuZoneScore[];
  overallScore: number;
  transitAlerts: VastuTransitAlert[];
  psychBridge: string[];
  roomGuide: ReadonlyArray<{ room: string; idealDir: string; reason: string }>;
  houseMap: Array<{ house: number; dir: string; planets: string[] }>;
}

export interface VastuCorrectionPlan {
  thirtyDay: string[];
  sixtyDay: string[];
  ninetyDay: string[];
}

export interface VastuMindMakan {
  physical: string[];
  behavioural: string[];
  routine: string[];
  emotional: string[];
  spiritual: string[];
}

export interface VastuPurushaHealth {
  affectedZones: string[];
  observations: string[];
}

export interface VastuAnalysisResult {
  engineVersion: string;
  summary: string;
  scores: VastuScores;
  strengths: VastuStrength[];
  defects: VastuDefect[];
  recommendations: VastuRecommendation[];
  makanAukat?: MakanAukatResult;
  // 16-zone kundli-based analysis (populated when planetPositions provided)
  zoneAnalysis?: VastuZoneAnalysis;
  // 30/60/90 day correction plan
  correctionPlan: VastuCorrectionPlan;
  // Mind + Makan energy loop guidance
  mindMakan: VastuMindMakan;
  // Vastu Purusha symbolic health observations
  vastuPurushaHealth: VastuPurushaHealth;
  sourcePolicy: {
    classical: string;
    modern: string;
    mahaVastu: string;
    lalKitab: string;
  };
  nextSteps: string[];
}
