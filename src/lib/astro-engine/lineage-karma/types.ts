// src/lib/astro-engine/lineage-karma/types.ts
// ============================================================================
// ASTROLIFE LINEAGE KARMA & PITRU INTELLIGENCE ENGINE (v1.0)
// Complete 7-Layer Holistic Framework:
// 1. Classical Jyotish (BPHS, Dr. Prem Kumar Sharma)
// 2. Varga Recurrence (D1, D9, D12, D60)
// 3. Elemental Ancestral Substance (Stephen Arroyo)
// 4. Psychological & Somatic Field (Mr. A, Polarity Therapy)
// 5. Time-Based Activation (Gochar, Dasha, Eclipse 19th Nakshatra)
// 6. Positive Ancestral Assets (Pitru Anugraha, Bahuputra, Yogakaraka Nodes)
// 7. Multi-Dimensional Healing & Human Language Presentation Layer
// ============================================================================

export type ElementType = "Fire" | "Earth" | "Air" | "Water";

export type DeityArchetype =
  | "SHIVA"
  | "VISHNU"
  | "DURGA_SHAKTI"
  | "HANUMAN_BHAIRAV"
  | "GANESHA"
  | "NAGA_DEVATA"
  | "SKANDA_MURUGAN"
  | "LAKSHMI_ANNAPURNA"
  | "SARASWATI"
  | "KALI_BHAIRAVI";

export type ConnectionStatus = "VIBRANT" | "WEAKENED" | "DORMANT" | "AFFLICTED";

export type CertaintyLevel =
  | "Strong Source-Supported"
  | "Moderate / Converging"
  | "Possibility"
  | "Hypothesis / Synthesis";

// ── 1. ELEMENTAL ANCESTRAL LAYER (Stephen Arroyo) ──────────────────────────
export interface ElementalAncestralProfile {
  saturnElement: ElementType;
  saturnBlockageTheme: string;
  saturnBlockedDomain: string;
  elementalTally: Record<ElementType, number>;
  selfExpressiveCount: number; // Fire + Air
  selfRepressiveCount: number; // Earth + Water
  elementalBalanceVerdict: string;
  waterHousesTrilogy: {
    fourthHouseLearned: string; // What was absorbed from home/roots
    eighthHouseCarried: string; // What is carried as latent family debt/secrets
    twelfthHouseRelease: string; // What needs to be released/surrendered
  };
  ascendantRulerElement: ElementType;
  ascendantRulerSignificance: string;
  sunMoonElementPolarity: {
    sunElement: ElementType;
    moonElement: ElementType;
    compatibility: "Harmonious" | "Friction" | "Dynamic Complementary";
    lineageDynamicNarrative: string;
  };
}

// ── 2. CLASSICAL NODAL & LINEAGE LAYER (Dr. Prem Kumar Sharma) ──────────────
export interface GandamoolaAssessment {
  isGandamoola: boolean;
  nakshatra?: string;
  pada?: number;
  classicalTarget?: string; // "Father", "Mother", "Self", "Wealth/Uncle", etc.
  remedyGuidance?: string;
}

export interface NodalLineageProfile {
  rahuPaternalGrandfather: {
    house: number;
    sign: string;
    nakshatra: string;
    lineageTheme: string;
    isVargottama: boolean;
    isYogakaraka: boolean;
  };
  ketuMaternalGrandfather: {
    house: number;
    sign: string;
    nakshatra: string;
    lineageTheme: string;
    isVargottama: boolean;
  };
  gandamoola: GandamoolaAssessment;
  bahuputraYoga: boolean; // Rahu in 5th not in Saturn's Navamsha
  vipreetRajaYogaByNodes: boolean;
  eclipse19thNakshatraAlert: {
    birthNakshatra: string;
    nineteenthNakshatra: string;
    vulnerableTheme: string;
  };
}

// ── 3. SPECIFIC REAL-LIFE OBSTACLE DETECTORS ──────────────────────────────
export interface ObstacleDiagnosis {
  domain: "Marriage" | "Progeny" | "Career_99_Stagnation" | "Health_Wealth_Leak";
  active: boolean;
  severity: "None" | "Mild" | "Noticeable" | "Critical";
  classicalSignatures: string[];
  humanExperienceText: string;
  ancestralRootText: string;
  unblockingRemedy: string;
}

// ── 4. KULA & ISHTA DEVATA (ROOTS & WINGS) ──────────────────────────────────
export interface KulaDevataProfile {
  significatorPlanet: string;
  sourceHouse: 2 | 5 | 9;
  connectionStatus: ConnectionStatus;
  suggestedDeity: {
    primaryArchetype: DeityArchetype;
    traditionalMaleName: string;
    traditionalFemaleName: string;
  };
  rootsGuidance: string;
  simplePranamOffering: string;
}

export interface IshtaDevataProfile {
  atmakarakaPlanet: string;
  karakamsaSign: string;
  twelfthFromKarakamsaSign: string;
  twelfthFromKarakamsaLord: string;
  suggestedDeity: {
    archetype: DeityArchetype;
    deityName: string;
  };
  wingsGuidance: string;
  soulDhyanaMantra: string;
}

// ── 5. POSITIVE ANCESTRAL ASSETS (PITRU ANUGRAHA) ──────────────────────────
export interface PitruAnugrahaProfile {
  hasStrongAnugraha: boolean;
  inheritedGifts: string[];
  protectiveFactors: string[];
  counterweightBlessing: string;
}

// ── 6. SOMATIC & ENERGY FIELD (Mr. A & Polarity Therapy) ────────────────────
export interface SomaticAncestralProfile {
  vulnerableOrganSystem: string;
  elementalPathology: string;
  energyDepletionPattern: string; // The "feeding" dynamic
  restorativeSomaticPractice: string;
}

// ── 7. ANTAHKARANA & VEDIC COMPUTATIONAL CONSCIOUSNESS (PVR Rao Model) ───
export interface AntahkaranaComponent {
  layer: "Ahamkara_CPU" | "Chitta_Memory" | "Buddhi_ALU" | "Manas_IO" | "Prana_Power";
  vedicConcept: string;
  computerAnalogy: string;
  planetaryCarriers: string[];
  vargaLevel: string; // e.g. "D1 / D9 / D60"
  functionalRole: string;
  sadhanaPurificationNote: string;
}

export interface AntahkaranaProfile {
  ahamkara: {
    cpuSignificator: string; // Atmakaraka
    tripod: {
      sthoolaLagna: string;
      sookshmaMoon: string;
      kaaranaSun: string;
    };
    currentState: string;
    egoDissolutionMethod: string;
  };
  chitta: {
    memoryReservoir: string;
    subconsciousRootVargas: string[]; // D60, D45, D30, D27
    predispositionLoad: string;
  };
  buddhi: {
    aluController: string; // AmK + Jupiter
    transmitter: string; // Mercury
    discriminationQuality: string;
  };
  manas: {
    ioController: string; // Moon + Mercury
    sensoryChannelsStatus: string;
  };
  prana: {
    vitalityFlow: string;
  };
  components: AntahkaranaComponent[];
}

// ── 8. PVR TARPANA & ANCESTRAL DEBT RELEASE (Vedic Wisdom Architecture) ────
export interface PvrTarpanaProfile {
  tarpanaVsHomamDistinction: {
    homamRole: string; // Burns personal past-life karmas
    tarpanaRole: string; // Washes away ancestral karmic debt (Rina)
    synthesis: string;
  };
  internalGeneticsPrinciple: string; // Ancestor as internal karmic predisposition / DNA
  jivatPitrukPermissibility: {
    isAllowedWithLivingFather: boolean;
    rationale: string; // Grandson may carry more debt than father; spiritual duty is not blocked
  };
  mantraPotencyPrinciple: {
    swahaVsSwadha: string;
    focusOverCount: string;
  };
  recommendedTarpanaFrequency: string; // Monthly Amavasya / Pitrupaksha
}

// ── 9. MASTER RESULT OBJECT ────────────────────────────────────────────────
export interface LineageKarmaResult {
  nativeName: string;
  btrConfidence: "Provisional" | "Moderate" | "High";
  ancestralGatePassed: boolean; // Must be true to generate ancestral claims
  gateReasons: string[];

  elemental: ElementalAncestralProfile;
  nodalLineage: NodalLineageProfile;
  kulaDevata: KulaDevataProfile;
  ishtaDevata: IshtaDevataProfile;
  anugraha: PitruAnugrahaProfile;
  somatic: SomaticAncestralProfile;
  antahkarana?: AntahkaranaProfile;
  pvrTarpana?: PvrTarpanaProfile;
  obstacles: ObstacleDiagnosis[];
  remedyIntelligence?: any; // RemedyIntelligenceResult

  executiveSummary: {
    oneSentenceSummary: string;
    coreLineageTheme: string;
    burdenGiftSynthesis: string;
  };

  narrativeHtml: string;
  narrativeMarkdown: string;
  technicalDrawer: {
    certainty: CertaintyLevel;
    d12VerificationNotes: string;
    d9NavamshaConfirmation: string;
    kpBhavaVerification: string;
  };
}

