// src/lib/astro-engine/gemstone-medical-master-v2.ts
// AstroLife Gemstone Medical Master Engine V2
// Full scoring: Yogakaraka, house ownership, dignity, Shadbala, dasha, affliction, aspects

/* eslint-disable no-console */

export type Planet =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type Sign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type Dignity =
  | "exalted"
  | "own"
  | "moolatrikona"
  | "friendly"
  | "neutral"
  | "enemy"
  | "debilitated"
  | "unknown";

export type GemStatus =
  | "highly_recommended"
  | "recommended"
  | "supportive"
  | "use_carefully"
  | "avoid";

export type LifeFocus =
  | "career"
  | "wealth"
  | "marriage"
  | "health"
  | "education"
  | "spirituality"
  | "emotional_balance"
  | "authority"
  | "creativity";

export interface PlanetInput {
  planet: Planet;
  sign: Sign;
  house: number;
  degree?: number;
  nakshatra?: string;
  dignity?: Dignity;
  shadbala?: number;
  isCombust?: boolean;
  isRetrograde?: boolean;
  isVargottama?: boolean;
  afflictedBy?: Planet[];
  aspectedBy?: Planet[];
  conjunctWith?: Planet[];
}

export interface DashaInput {
  mahadasha?: Planet;
  antardasha?: Planet;
  pratyantardasha?: Planet;
}

export interface GemstoneMedicalInput {
  nativeName?: string;
  ascendant: Sign;
  moonSign?: Sign;
  planets: PlanetInput[];
  dasha?: DashaInput;
  userFocus?: LifeFocus[];
  includeFamousCaseStudies?: boolean;
}

export interface ScoreComponent {
  label: string;
  points: number;
  explanation: string;
}

export interface ReportSection {
  title: string;
  subtitle?: string;
  body: string;
  bullets?: string[];
}

export interface GemstoneReportItem {
  planet: Planet;
  gemstone: string;
  sanskritName: string;
  substitute: string;
  colour: string;
  score: number;
  status: GemStatus;
  confidence: number;
  scoreComponents: ScoreComponent[];

  verdictTitle: string;
  shortVerdict: string;

  scoringExplanation: string;
  whyAstroLifeRecommendsIt: string;
  bookStyleInterpretation: string;
  expectedBenefits: string;
  healthAndPsychologyConnection: string;
  dashaTimingInterpretation: string;
  wearingGuidance: string;
  cautionOrAvoidance: string;
  alternativeRemedies: string;
  pdfReadyParagraph: string;
}

export interface MedicalFinding {
  planet: Planet;
  house: number;
  title: string;
  symbolicBodyArea: string;
  paragraph: string;
  severity: "mild" | "moderate" | "strong";
}

export interface MedicalAwarenessReport {
  title: string;
  constitutionalProfile: string;
  wellnessInterpretation: string;
  medicalMechanicsExplanation: string;
  findings: MedicalFinding[];
  preventiveGuidance: string;
  medicalDisclaimer: string;
}

export interface GemstoneMedicalMasterReport {
  title: string;
  executiveSummary: string;

  gemstoneScoringExplanation: string;
  primaryRecommendation?: GemstoneReportItem;
  secondaryRecommendations: GemstoneReportItem[];
  supportiveRecommendations: GemstoneReportItem[];
  useCarefullyList: GemstoneReportItem[];
  avoidList: GemstoneReportItem[];

  healingColourInterpretation: string;
  medicalAwareness: MedicalAwarenessReport;
  famousChartCaseStudySection: ReportSection;
  finalBookStyleConclusion: string;

  pdfSections: ReportSection[];
  disclaimer: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SIGNS: Sign[] = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORD: Record<Sign, Planet> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

const GEM_KNOWLEDGE: Record<
  Planet,
  {
    gemstone: string;
    sanskritName: string;
    substitute: string;
    colour: string;
    colourMeaning: string;
    metal: string;
    finger: string;
    day: string;
    mantra: string;
    highExpression: string;
    shadowExpression: string;
    bodySystems: string;
    psychology: string;
    benefits: Partial<Record<LifeFocus, string>>;
  }
> = {
  Sun: {
    gemstone: "Ruby",
    sanskritName: "Manikya",
    substitute: "Red Garnet",
    colour: "solar red-gold",
    colourMeaning: "the colour of vitality, authority, self-belief and inner fire",
    metal: "Gold or copper",
    finger: "Ring finger",
    day: "Sunday",
    mantra: "Om Suryaya Namah",
    highExpression: "confidence, leadership, clarity of purpose, fatherly protection, reputation and life-force",
    shadowExpression: "ego pressure, heat, pride, authority conflict, blood pressure tendency and excessive dominance",
    bodySystems: "heart, vitality, eyesight, head region, bones, circulation and constitutional fire",
    psychology: "self-worth, identity, courage, public dignity and the ability to stand in one's own light",
    benefits: {
      career: "authority, recognition and leadership confidence",
      health: "vitality, constitutional fire and life-force awareness",
      authority: "command, dignity and decision-making strength",
    },
  },
  Moon: {
    gemstone: "Pearl",
    sanskritName: "Moti",
    substitute: "Moonstone",
    colour: "lunar white",
    colourMeaning: "the colour of softness, cooling, emotional nourishment and mental peace",
    metal: "Silver",
    finger: "Little finger",
    day: "Monday",
    mantra: "Om Chandraya Namah",
    highExpression: "emotional balance, peace, motherly protection, imagination, sleep and inner comfort",
    shadowExpression: "mood swings, fear, dependency, over-sensitivity, sleep disturbance and emotional flooding",
    bodySystems: "mind, fluids, sleep, hormones, stomach, fertility rhythm and emotional regulation",
    psychology: "attachment style, emotional memory, sensitivity, comfort-seeking and inner security",
    benefits: {
      emotional_balance: "calmer emotions, better sleep rhythm and mental cooling",
      health: "fluid balance, psychosomatic calm and emotional regulation",
      marriage: "softness, empathy and emotional bonding",
    },
  },
  Mars: {
    gemstone: "Red Coral",
    sanskritName: "Moonga",
    substitute: "Carnelian",
    colour: "blood red",
    colourMeaning: "the colour of courage, blood vitality, action and protective force",
    metal: "Gold or copper",
    finger: "Ring finger",
    day: "Tuesday",
    mantra: "Om Angarakaya Namah",
    highExpression: "courage, stamina, protection, initiative, discipline in action and competitive strength",
    shadowExpression: "anger, inflammation, accidents, conflict, impatience and impulsive decisions",
    bodySystems: "blood, muscles, inflammation, surgery, wounds, marrow, accidents and heat disorders",
    psychology: "assertion, anger processing, sexual fire, protection instinct and survival response",
    benefits: {
      career: "initiative, competition and decisive action",
      health: "stamina, muscular strength and immune fire",
      authority: "courage and command in difficult situations",
    },
  },
  Mercury: {
    gemstone: "Emerald",
    sanskritName: "Panna",
    substitute: "Peridot or Green Onyx",
    colour: "healing green",
    colourMeaning: "the colour of intelligence, nervous balance, adaptability and refined speech",
    metal: "Gold, bronze or panchdhatu",
    finger: "Little finger",
    day: "Wednesday",
    mantra: "Om Budhaya Namah",
    highExpression: "intellect, communication, business skill, analysis, learning, humour and adaptability",
    shadowExpression: "overthinking, nervousness, scattered attention, speech issues and anxiety from excessive analysis",
    bodySystems: "nervous system, skin, speech, lungs, coordination, intestines and psychosomatic sensitivity",
    psychology: "thinking style, language, curiosity, problem solving and commercial intelligence",
    benefits: {
      career: "communication, strategy, technology, business and negotiation",
      wealth: "trading intelligence, financial judgment and commercial clarity",
      education: "learning, memory, analysis and articulation",
    },
  },
  Jupiter: {
    gemstone: "Yellow Sapphire",
    sanskritName: "Pukhraj",
    substitute: "Citrine or Yellow Topaz",
    colour: "golden yellow",
    colourMeaning: "the colour of wisdom, expansion, blessings, faith and higher guidance",
    metal: "Gold",
    finger: "Index finger",
    day: "Thursday",
    mantra: "Om Gurave Namah",
    highExpression: "wisdom, children, dharma, teachers, optimism, grace, protection and prosperity",
    shadowExpression: "over-expansion, weight gain, false optimism, dogma, laziness and excess",
    bodySystems: "liver, fat metabolism, pancreas, thighs, growth, fertility and nourishment",
    psychology: "belief system, hope, ethics, generosity, teaching instinct and spiritual trust",
    benefits: {
      wealth: "growth, prosperity and long-term abundance",
      education: "wisdom, higher learning and teaching",
      spirituality: "faith, dharma and guru connection",
      marriage: "family blessings and harmony through wisdom",
    },
  },
  Venus: {
    gemstone: "Diamond / White Sapphire",
    sanskritName: "Heera / Safed Pukhraj",
    substitute: "Zircon or Opal",
    colour: "brilliant white",
    colourMeaning: "the colour of harmony, beauty, refinement, relationship softness and attraction",
    metal: "Silver, platinum or white gold",
    finger: "Middle or ring finger",
    day: "Friday",
    mantra: "Om Shukraya Namah",
    highExpression: "love, beauty, relationship harmony, art, luxury, comfort, fertility and grace",
    shadowExpression: "sensual excess, attachment, vanity, pleasure addiction, reproductive imbalance and relationship confusion",
    bodySystems: "reproductive system, kidneys, skin, sugar balance, semen/ovum quality and venous circulation",
    psychology: "romance, attraction, pleasure, intimacy, aesthetics and the capacity to receive love",
    benefits: {
      marriage: "relationship softness, attraction, affection and harmony",
      creativity: "artistic refinement, beauty and aesthetic intelligence",
      wealth: "luxury, comforts and refined material prosperity",
      health: "reproductive balance, skin harmony and sweetness of temperament",
    },
  },
  Saturn: {
    gemstone: "Blue Sapphire",
    sanskritName: "Neelam",
    substitute: "Amethyst, Iolite or Blue Topaz",
    colour: "deep blue",
    colourMeaning: "the colour of discipline, karmic order, patience, endurance and deep focus",
    metal: "Silver, iron or panchdhatu",
    finger: "Middle finger",
    day: "Saturday",
    mantra: "Om Sham Shanicharaya Namah",
    highExpression: "discipline, maturity, long-term success, responsibility, endurance, structure and karmic stability",
    shadowExpression: "fear, delay, loneliness, fatigue, rigidity, chronic pressure and pessimism",
    bodySystems: "bones, joints, teeth, chronic conditions, ageing, nerves, fatigue and degenerative tendencies",
    psychology: "patience, boundaries, duty, realism, karmic lessons and capacity to build slowly",
    benefits: {
      career: "professional stability, authority, discipline and long-term success",
      wealth: "slow accumulation, structure and financial discipline",
      health: "routine, endurance and chronic-condition awareness",
      spirituality: "detachment, tapasya and karmic maturity",
    },
  },
  Rahu: {
    gemstone: "Hessonite",
    sanskritName: "Gomed",
    substitute: "Honey Zircon",
    colour: "honey brown",
    colourMeaning: "the colour of worldly ambition, shadow clarity, unconventional growth and karmic intensity",
    metal: "Silver or panchdhatu",
    finger: "Middle finger",
    day: "Saturday",
    mantra: "Om Rahave Namah",
    highExpression: "innovation, worldly rise, foreign success, unconventional intelligence and strategic ambition",
    shadowExpression: "obsession, addiction, illusion, anxiety, toxins, scandal and compulsive desire",
    bodySystems: "toxins, allergies, mysterious symptoms, addictions, skin disorders, poisons and unusual disease patterns",
    psychology: "ambition, hunger, fear of missing out, obsession, taboo-breaking and foreign attraction",
    benefits: {
      career: "unconventional rise, technology, media and foreign networks",
      wealth: "large gains through unusual channels when well supported",
      spirituality: "shadow awareness and breaking illusion when used carefully",
    },
  },
  Ketu: {
    gemstone: "Cat's Eye",
    sanskritName: "Lehsunia",
    substitute: "Quartz Cat's Eye",
    colour: "smoky grey-green",
    colourMeaning: "the colour of detachment, intuition, protection, moksha and hidden perception",
    metal: "Silver or panchdhatu",
    finger: "Middle finger",
    day: "Tuesday or Thursday",
    mantra: "Om Ketave Namah",
    highExpression: "intuition, spiritual insight, protection, detachment, research and liberation",
    shadowExpression: "confusion, isolation, sudden breaks, nerve sensitivity, fear and lack of worldly grounding",
    bodySystems: "hidden disorders, nerve sensitivity, wounds, skin eruptions, mysterious pain and sudden separations",
    psychology: "detachment, past-life residue, intuition, withdrawal and spiritual dissatisfaction",
    benefits: {
      spirituality: "intuition, detachment, moksha orientation and occult insight",
      health: "subtle protection when Ketu is genuinely supportive",
    },
  },
};

const YOGAKARAKA: Partial<Record<Sign, Planet>> = {
  Taurus: "Saturn",
  Libra: "Saturn",
  Cancer: "Mars",
  Leo: "Mars",
  Capricorn: "Venus",
  Aquarius: "Venus",
};

// ─── Utility functions ────────────────────────────────────────────────────────

function getSignAtHouse(ascendant: Sign, house: number): Sign {
  const start = SIGNS.indexOf(ascendant);
  return SIGNS[(start + house - 1) % 12];
}

function getHousesOwnedByPlanet(ascendant: Sign, planet: Planet): number[] {
  if (planet === "Rahu" || planet === "Ketu") return [];
  const houses: number[] = [];
  for (let house = 1; house <= 12; house += 1) {
    const sign = getSignAtHouse(ascendant, house);
    if (SIGN_LORD[sign] === planet) houses.push(house);
  }
  return houses;
}

function dignityScore(dignity: Dignity = "unknown"): number {
  switch (dignity) {
    case "exalted": return 22;
    case "moolatrikona": return 20;
    case "own": return 18;
    case "friendly": return 10;
    case "neutral": return 3;
    case "enemy": return -8;
    case "debilitated": return -18;
    default: return 0;
  }
}

function houseScore(house: number): number {
  if ([1, 4, 5, 7, 9, 10].includes(house)) return 10;
  if ([2, 3, 11].includes(house)) return 5;
  if (house === 6) return -8;
  if (house === 8) return -14;
  if (house === 12) return -12;
  return 0;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function statusFromScore(score: number): GemStatus {
  if (score >= 88) return "highly_recommended";
  if (score >= 75) return "recommended";
  if (score >= 62) return "supportive";
  if (score >= 45) return "use_carefully";
  return "avoid";
}

function statusLabel(status: GemStatus): string {
  switch (status) {
    case "highly_recommended": return "Highly Recommended";
    case "recommended": return "Recommended";
    case "supportive": return "Supportive";
    case "use_carefully": return "Use Carefully";
    case "avoid": return "Avoid";
  }
}

function getPlanet(input: GemstoneMedicalInput, planet: Planet): PlanetInput | undefined {
  return input.planets.find((p) => p.planet === planet);
}

function paragraphJoin(parts: string[]): string {
  return parts.filter(Boolean).join("\n\n");
}

// ─── Scoring components ───────────────────────────────────────────────────────

function roleScore(ascendant: Sign, planet: Planet): ScoreComponent {
  if (planet === "Rahu" || planet === "Ketu") {
    return {
      label: "Node Caution",
      points: -14,
      explanation: `${planet} is a karmic node, not a normal physical planet. Its gemstones are powerful and should be used only when the chart clearly supports them.`,
    };
  }

  const owned = getHousesOwnedByPlanet(ascendant, planet);
  let points = 0;
  const reasons: string[] = [];

  if (YOGAKARAKA[ascendant] === planet) {
    points += 30;
    reasons.push(`${planet} is Yogakaraka for ${ascendant} ascendant, so it can combine fortune, karma and life-rise when strong.`);
  }

  if (owned.includes(1)) {
    points += 24;
    reasons.push(`${planet} owns the ascendant, so its gemstone becomes connected with vitality, self-development and the body.`);
  }

  if (owned.includes(5)) {
    points += 12;
    reasons.push(`${planet} owns the 5th house, linking it with intelligence, purva punya, creativity and blessings.`);
  }

  if (owned.includes(9)) {
    points += 16;
    reasons.push(`${planet} owns the 9th house, linking it with fortune, dharma, grace, teachers and higher protection.`);
  }

  if (owned.includes(4) || owned.includes(10)) {
    points += 7;
    reasons.push(`${planet} has kendra ownership, connecting it with stability, home, status, career or public life.`);
  }

  if (owned.includes(6)) {
    points -= 14;
    reasons.push(`${planet} owns the 6th house, so strengthening it can also activate disease, debt, disputes or service pressure.`);
  }

  if (owned.includes(8)) {
    points -= 18;
    reasons.push(`${planet} owns the 8th house, so its gemstone may intensify sudden changes, chronic pressure, hidden fears or vulnerability.`);
  }

  if (owned.includes(12)) {
    points -= 12;
    reasons.push(`${planet} owns the 12th house, so its gemstone may increase loss, isolation, sleep disturbance, expenses or withdrawal unless spiritually required.`);
  }

  if (owned.includes(2) || owned.includes(7)) {
    points -= 5;
    reasons.push(`${planet} has maraka-house involvement, so the gemstone must be judged carefully and not recommended blindly.`);
  }

  return {
    label: "Functional Role",
    points,
    explanation: reasons.length > 0
      ? reasons.join(" ")
      : `${planet} has a mixed functional role for ${ascendant} ascendant.`,
  };
}

function getDashaRelevance(input: GemstoneMedicalInput, planet: Planet): ScoreComponent {
  const md = input.dasha?.mahadasha;
  const ad = input.dasha?.antardasha;
  const pd = input.dasha?.pratyantardasha;

  let points = 0;
  const parts: string[] = [];

  if (md === planet) {
    points += 12;
    parts.push(`${planet} is the current Mahadasha lord, so its karma is strongly active in the native's present life period.`);
  }

  if (ad === planet) {
    points += 8;
    parts.push(`${planet} is the current Antardasha lord, making its results more visible in current decisions, events and emotional experience.`);
  }

  if (pd === planet) {
    points += 4;
    parts.push(`${planet} is also active at Pratyantardasha level, giving short-term relevance.`);
  }

  return {
    label: "Dasha Activation",
    points,
    explanation: parts.length > 0
      ? parts.join(" ")
      : `${planet} is not the main current dasha lord, so the gemstone is judged more by birth-chart strength than timing activation.`,
  };
}

function getGoalComponent(input: GemstoneMedicalInput, planet: Planet): ScoreComponent {
  const goals = input.userFocus ?? [];
  const knowledge = GEM_KNOWLEDGE[planet];
  const matched = goals.filter((goal) => knowledge.benefits[goal]);

  if (matched.length === 0) {
    return {
      label: "User Goal Match",
      points: 0,
      explanation: `${planet} does not directly match the selected user focus areas strongly enough to change the gemstone score.`,
    };
  }

  return {
    label: "User Goal Match",
    points: Math.min(10, matched.length * 4),
    explanation: `${planet} supports the user's focus on ${matched.join(", ")}. In report language, this means the gemstone is not only astrologically judged but also aligned with the native's stated life intention.`,
  };
}

function scorePlanet(input: GemstoneMedicalInput, p: PlanetInput): ScoreComponent[] {
  const components: ScoreComponent[] = [];

  components.push(roleScore(input.ascendant, p.planet));

  components.push({
    label: "Sign Dignity",
    points: dignityScore(p.dignity),
    explanation: `${p.planet} is placed in ${p.sign} with dignity marked as ${p.dignity ?? "unknown"}. Dignity shows whether the planet can express its higher nature easily or whether its energy becomes strained.`,
  });

  components.push({
    label: "House Placement",
    points: houseScore(p.house),
    explanation: `${p.planet} is placed in the ${p.house} house. This house modifies how the planet gives results. Kendra and trikona placements generally support expression, while 6th, 8th and 12th placements require caution.`,
  });

  if (typeof p.shadbala === "number") {
    const points = p.shadbala >= 1.25 ? 10 : p.shadbala >= 1 ? 5 : p.shadbala < 0.75 ? -10 : -3;
    components.push({
      label: "Shadbala Strength",
      points,
      explanation: `${p.planet} has Shadbala value ${p.shadbala}. Higher strength suggests the planet has capacity to deliver results. Low strength indicates weakness or inability to carry the gemstone energy smoothly.`,
    });
  }

  components.push(getDashaRelevance(input, p.planet));

  const afflictions = p.afflictedBy ?? [];
  if (afflictions.length > 0) {
    components.push({
      label: "Affliction",
      points: -7 * afflictions.length,
      explanation: `${p.planet} is afflicted by ${afflictions.join(", ")}. Affliction does not always cancel a gemstone, but it means the planet carries stress, conflict or distortion that must be judged carefully.`,
    });
  }

  const aspects = p.aspectedBy ?? [];
  if (aspects.length > 0) {
    const beneficAspects = aspects.filter((x) => ["Jupiter", "Venus", "Mercury", "Moon"].includes(x));
    if (beneficAspects.length > 0) {
      components.push({
        label: "Benefic Support",
        points: 5 * beneficAspects.length,
        explanation: `${p.planet} receives supportive influence from ${beneficAspects.join(", ")}, improving its ability to give balanced results.`,
      });
    }
  }

  if (p.isCombust) {
    components.push({
      label: "Combustion",
      points: -8,
      explanation: `${p.planet} is combust, so its independent expression may be weakened or overshadowed by solar heat.`,
    });
  }

  if (p.isRetrograde) {
    components.push({
      label: "Retrograde Complexity",
      points: -3,
      explanation: `${p.planet} is retrograde, making its results more internal, delayed, karmic or psychologically complex.`,
    });
  }

  if (p.isVargottama) {
    components.push({
      label: "Vargottama Support",
      points: 8,
      explanation: `${p.planet} is Vargottama, which gives additional steadiness and purity of expression across divisional strength.`,
    });
  }

  components.push(getGoalComponent(input, p.planet));

  return components;
}

function totalScore(components: ScoreComponent[]): number {
  return clampScore(50 + components.reduce((sum, c) => sum + c.points, 0));
}

// ─── Narrative builders ───────────────────────────────────────────────────────

function buildScoringNarrative(p: PlanetInput, components: ScoreComponent[], score: number): string {
  const positive = components.filter((c) => c.points > 0);
  const negative = components.filter((c) => c.points < 0);

  return paragraphJoin([
    `AstroLife gives ${GEM_KNOWLEDGE[p.planet].gemstone} a score of ${score}/100. This number is not a generic zodiac recommendation. It is created by combining the planet's functional role, house ownership, sign dignity, house placement, dasha activation, afflictions, strength indicators and the native's stated life focus.`,

    positive.length > 0
      ? `The supportive factors are significant. ${positive.map((c) => `${c.label}: ${c.explanation}`).join(" ")} These factors show where ${p.planet} can act as a constructive force in the horoscope.`
      : `There are not many strong supportive factors for ${p.planet}. This does not mean the planet is useless, but it means its gemstone should not be treated as a primary remedy.`,

    negative.length > 0
      ? `The caution factors must also be respected. ${negative.map((c) => `${c.label}: ${c.explanation}`).join(" ")} In gemstone therapy, these caution factors are extremely important because a gemstone strengthens the planet; it does not automatically purify it.`
      : `There are no major warning factors strong enough to reject this gemstone. Still, all powerful gemstones should be tested gradually before permanent use.`,

    `The final score therefore represents suitability, not popularity. A famous or expensive gemstone is not necessarily good for every chart. AstroLife recommends a stone only when strengthening that planet is more likely to help than disturb the native's karmic pattern.`,
  ]);
}

function buildWhyRecommended(input: GemstoneMedicalInput, p: PlanetInput, score: number, status: GemStatus): string {
  const gem = GEM_KNOWLEDGE[p.planet];

  if (status === "avoid") {
    return paragraphJoin([
      `${gem.gemstone} is not recommended as a regular wearing gemstone in this horoscope. The reason is not that ${gem.gemstone} is weak or inferior; the reason is that the planet ${p.planet} does not receive enough clean support in the chart to justify strengthening it through a powerful stone.`,
      `When a planet has difficult ownership, dusthana involvement, affliction, weak dignity or karmic node pressure, wearing its gemstone can amplify the very patterns the native wants to reduce. For ${p.planet}, this may increase themes connected with ${gem.shadowExpression}.`,
      `AstroLife therefore places this stone in the Avoid category. A safer path is to pacify the planet through mantra, charity, discipline, lifestyle correction and spiritual remedies rather than intensifying it through a gemstone.`,
    ]);
  }

  if (status === "use_carefully") {
    return paragraphJoin([
      `${gem.gemstone} has mixed indications in this horoscope. There are some reasons to consider it, but there are also enough warning signs to avoid a direct permanent recommendation.`,
      `This usually happens when ${p.planet} has both useful and difficult roles. It may support certain life areas while simultaneously activating stress, conflict, disease sensitivity or emotional imbalance. In such cases, AstroLife does not reject the stone completely, but it recommends a careful trial and expert review.`,
      `The stone may be considered only if the native's life situation specifically requires the higher qualities of ${p.planet}: ${gem.highExpression}. Even then, the trial period must be observed carefully.`,
    ]);
  }

  return paragraphJoin([
    `${gem.gemstone} is recommended because ${p.planet} is strong enough and constructive enough to be consciously strengthened. In this horoscope, ${p.planet} is not merely a symbolic planet; it becomes an active channel through which the native can improve specific life areas.`,
    `AstroLife recommends this gemstone because the chart shows a meaningful relationship between ${p.planet}, the native's ascendant ${input.ascendant}, the current planetary period, and the life focus selected by the user. The stone is therefore not suggested as a superstition, but as a chart-based remedial amplifier.`,
    `The deeper purpose of ${gem.gemstone} is to bring the higher expression of ${p.planet} into daily life: ${gem.highExpression}. When the planet is strengthened correctly, the native may experience more order, confidence, clarity, harmony or wisdom depending on the planet involved.`,
  ]);
}

function buildBookStyleInterpretation(p: PlanetInput): string {
  const gem = GEM_KNOWLEDGE[p.planet];

  return paragraphJoin([
    `${p.planet} is the planetary principle behind ${gem.gemstone}. In Vedic remedial thought, a gemstone is not treated as a decorative object alone. It is seen as a concentrated symbolic medium for the planet's colour, rhythm and subtle influence. The stone becomes meaningful only when the planet itself is suitable for strengthening.`,
    `In this chart, ${p.planet} occupies the ${p.house} house in ${p.sign}. This placement shows where the planet wants to express itself in the native's life. Its higher nature gives ${gem.highExpression}; its disturbed nature may create ${gem.shadowExpression}. The purpose of AstroLife's gemstone engine is to decide whether the stone will awaken the higher nature or intensify the disturbed nature.`,
    `For this reason, the recommendation is not based on one factor. A planet may be naturally benefic but functionally difficult for a particular ascendant. Another planet may be naturally strict, like Saturn, but become extremely useful if it owns auspicious houses. The gemstone must follow the complete horoscope, not public belief.`,
  ]);
}

function buildExpectedBenefits(p: PlanetInput, status: GemStatus): string {
  const gem = GEM_KNOWLEDGE[p.planet];

  if (status === "avoid") {
    return paragraphJoin([
      `Because ${gem.gemstone} is placed in the Avoid category, AstroLife does not promise benefits from wearing it. The planet's energy may still be important in the horoscope, but it is better handled through pacification rather than amplification.`,
      `If worn without proper review, the stone may increase ${gem.shadowExpression}. This is why the avoid list is not a negative feature; it is a protective feature. It prevents the native from strengthening a planet that may not be safe to energize directly.`,
    ]);
  }

  if (status === "use_carefully") {
    return paragraphJoin([
      `If ${gem.gemstone} suits the native after a trial, the benefits may appear gradually through ${gem.highExpression}. However, the results can be uneven because the planet carries mixed indications.`,
      `The native should watch mood, sleep, conflicts, physical symptoms, work pressure and sudden changes during the trial. If life becomes more restless, heated, heavy or confused, the stone should be removed and replaced with gentler remedies.`,
    ]);
  }

  return paragraphJoin([
    `When ${gem.gemstone} is suitable, its effect is usually experienced first as an internal shift. The native may feel more aligned with the constructive qualities of ${p.planet}: ${gem.highExpression}. This does not mean life becomes magically perfect; it means the person begins to cooperate more naturally with the planet's best current.`,
    `In practical life, this may support the areas connected with ${p.planet}. For example, if the planet governs career, the person may become more disciplined, visible and decisive. If it governs intelligence, the mind may become sharper. If it governs relationships, emotional softness and attraction may improve. If it governs health, the person may become more aware of rhythm, prevention and lifestyle balance.`,
    `The gemstone works best when combined with right action. A stone cannot replace effort, ethics, medicine, discipline or emotional maturity. It strengthens the planetary field, but the native must still live the higher lesson of that planet.`,
  ]);
}

function buildHealthConnection(p: PlanetInput): string {
  const gem = GEM_KNOWLEDGE[p.planet];

  return paragraphJoin([
    `${p.planet} is symbolically connected with ${gem.bodySystems}. Because it is placed in the ${p.house} house, AstroLife observes how this planet may influence wellness, stress response and body awareness.`,
    `This is not a medical diagnosis. It is a traditional astrological reflection. If ${p.planet} is strong and clean, it may support the related body systems. If it is weak, afflicted or placed in sensitive houses, the native should be more attentive to lifestyle habits connected with those systems.`,
    `Psychologically, ${p.planet} also governs ${gem.psychology}. Many health patterns begin as emotional or behavioural patterns. For this reason, AstroLife interprets gemstone remedies together with mental habits, stress response and daily routine.`,
  ]);
}

function buildDashaTiming(input: GemstoneMedicalInput, p: PlanetInput, status: GemStatus): string {
  const md = input.dasha?.mahadasha;
  const ad = input.dasha?.antardasha;

  if (!md && !ad) {
    return `No active dasha data was supplied. AstroLife therefore judges ${GEM_KNOWLEDGE[p.planet].gemstone} mainly from birth-chart promise, planetary strength and house ownership. When dasha data is available, timing confidence becomes stronger.`;
  }

  const parts: string[] = [];

  if (md === p.planet) {
    parts.push(`${p.planet} is the Mahadasha lord, so its karma is central to the present life chapter. A gemstone for the Mahadasha lord can be powerful, but only if the planet is constructive. In this case, the status is ${statusLabel(status)}.`);
  }

  if (ad === p.planet) {
    parts.push(`${p.planet} is also active through Antardasha, so its results may be visible in current decisions, relationships, finances, health rhythms and emotional experience.`);
  }

  if (parts.length === 0) {
    parts.push(`${p.planet} is not the main current dasha lord. This means the gemstone may still help, but its effect will be more foundational than event-triggered.`);
  }

  return paragraphJoin(parts);
}

function buildWearingGuidance(p: PlanetInput, status: GemStatus): string {
  const gem = GEM_KNOWLEDGE[p.planet];

  if (status === "avoid") {
    return `AstroLife does not recommend wearing ${gem.gemstone} in this chart. If the native already wears it, they should observe whether it correlates with restlessness, conflict, health sensitivity, fear, financial instability or emotional disturbance. Removal or replacement with mantra-based remedies may be safer.`;
  }

  return paragraphJoin([
    `${gem.gemstone} may be worn in ${gem.metal}, generally on the ${gem.finger}, on ${gem.day}. The traditional mantra is: ${gem.mantra}. The stone should be natural, untreated as far as possible, and selected with proper quality control.`,
    `A trial period is strongly advised, especially for powerful stones such as Blue Sapphire, Gomed and Cat's Eye. During the trial, observe sleep, mood, energy, conflicts, health symptoms, financial events and sudden changes. A truly suitable gemstone should bring steadiness, clarity and inner alignment, not fear or chaos.`,
  ]);
}

function buildAlternativeRemedies(p: PlanetInput): string {
  const gem = GEM_KNOWLEDGE[p.planet];

  return paragraphJoin([
    `If the native does not want to wear ${gem.gemstone}, or if the score is not high enough for direct gemstone use, AstroLife recommends softer planetary remedies. These include mantra japa of ${gem.mantra}, charity related to ${p.planet}, respectful conduct toward the people represented by the planet, and lifestyle correction aligned with the planet's lesson.`,
    `For ${p.planet}, the deeper remedy is to live its higher expression: ${gem.highExpression}. This is the safest and most sustainable remedy. A gemstone can support the process, but character and action complete it.`,
  ]);
}

function buildCaution(p: PlanetInput, status: GemStatus): string {
  const gem = GEM_KNOWLEDGE[p.planet];

  if (status === "avoid") {
    return paragraphJoin([
      `${gem.gemstone} should be avoided because the chart does not show enough permission to strengthen ${p.planet}. Wearing it may amplify ${gem.shadowExpression}.`,
      `This is especially important because gemstones increase planetary intensity. A difficult planet should usually be pacified, not energized. AstroLife therefore protects the native by placing this stone in the avoid list.`,
    ]);
  }

  if (status === "use_carefully") {
    return paragraphJoin([
      `${gem.gemstone} is not rejected, but it is not a casual recommendation either. The stone may give benefits in one area while creating pressure in another.`,
      `Use it only after a trial. If the native experiences disturbed sleep, increased anger, anxiety, heaviness, conflict, sudden expenses or unusual health symptoms, the stone should be removed.`,
    ]);
  }

  return `Even though ${gem.gemstone} is suitable, the native should avoid over-expectation. Gemstones support the planet; they do not replace effort, medical care, right decisions or spiritual maturity.`;
}

function buildPdfParagraph(item: { p: PlanetInput; score: number; status: GemStatus; why: string; benefits: string }): string {
  const gem = GEM_KNOWLEDGE[item.p.planet];

  return paragraphJoin([
    `${gem.gemstone} (${gem.sanskritName}) receives a final AstroLife suitability score of ${item.score}/100 and is classified as ${statusLabel(item.status)}. This classification is based on the planet ${item.p.planet}, its placement in ${item.p.sign}, its house position, dignity, dasha relevance and the overall ascendant logic.`,
    item.why,
    item.benefits,
  ]);
}

function buildGemstoneReportItem(input: GemstoneMedicalInput, p: PlanetInput): GemstoneReportItem {
  const components = scorePlanet(input, p);
  const score = totalScore(components);
  const status = statusFromScore(score);
  const gem = GEM_KNOWLEDGE[p.planet];

  const why = buildWhyRecommended(input, p, score, status);
  const benefits = buildExpectedBenefits(p, status);

  return {
    planet: p.planet,
    gemstone: gem.gemstone,
    sanskritName: gem.sanskritName,
    substitute: gem.substitute,
    colour: gem.colour,
    score,
    status,
    confidence: score,
    scoreComponents: components,

    verdictTitle: `${gem.gemstone} for ${p.planet}: ${statusLabel(status)}`,
    shortVerdict: `${gem.gemstone} is classified as ${statusLabel(status)} with ${score}/100 confidence.`,

    scoringExplanation: buildScoringNarrative(p, components, score),
    whyAstroLifeRecommendsIt: why,
    bookStyleInterpretation: buildBookStyleInterpretation(p),
    expectedBenefits: benefits,
    healthAndPsychologyConnection: buildHealthConnection(p),
    dashaTimingInterpretation: buildDashaTiming(input, p, status),
    wearingGuidance: buildWearingGuidance(p, status),
    cautionOrAvoidance: buildCaution(p, status),
    alternativeRemedies: buildAlternativeRemedies(p),

    pdfReadyParagraph: buildPdfParagraph({ p, score, status, why, benefits }),
  };
}

// ─── Report-level builders ────────────────────────────────────────────────────

function buildGemstoneScoringExplanation(): string {
  return paragraphJoin([
    `AstroLife does not recommend gemstones through generic sun-sign logic. A gemstone is a planetary amplifier, so the first question is not "Which stone is famous?" but "Should this planet be strengthened in this specific horoscope?"`,
    `The engine begins with the ascendant because the ascendant decides functional benefic and malefic roles. A planet that is naturally benefic may still become difficult for a certain ascendant if it owns the 6th, 8th or 12th house. Similarly, a naturally strict planet such as Saturn may become highly beneficial if it owns auspicious houses. This is why gemstone logic must be ascendant-specific.`,
    `AstroLife then checks sign dignity, house placement, dasha activation, affliction, Shadbala, retrogression, combustion, Vargottama strength and user goals. Each factor contributes to a transparent score. Scores above 88 are Highly Recommended, 75–87 are Recommended, 62–74 are Supportive, 45–61 require careful trial, and below 45 should generally be avoided.`,
    `The avoid list is as important as the recommendation list. Wrong gemstones can intensify imbalance, ego, conflict, anxiety, disease sensitivity, obsession or sudden instability. A premium gemstone engine must therefore protect the user from unsuitable stones instead of simply suggesting popular gems.`,
  ]);
}

function getMedicalSeverity(p: PlanetInput): "mild" | "moderate" | "strong" {
  let risk = 0;
  if ([6, 8, 12].includes(p.house)) risk += 2;
  if (p.afflictedBy?.length) risk += p.afflictedBy.length;
  if (p.dignity === "debilitated") risk += 2;
  if (p.isCombust) risk += 1;

  if (risk >= 4) return "strong";
  if (risk >= 2) return "moderate";
  return "mild";
}

function buildMedicalFinding(p: PlanetInput): MedicalFinding {
  const gem = GEM_KNOWLEDGE[p.planet];
  const severity = getMedicalSeverity(p);

  const title = `${p.planet} in ${p.house} House: ${severity === "strong" ? "Strong" : severity === "moderate" ? "Moderate" : "Mild"} Wellness Sensitivity`;

  const houseMeaning =
    p.house === 1 ? "the first house represents constitution, vitality and the body itself"
    : p.house === 6 ? "the sixth house represents disease tendency, imbalance, recovery, service and daily health discipline"
    : p.house === 8 ? "the eighth house represents chronic vulnerability, hidden weakness, transformation and deep karmic pressure"
    : p.house === 12 ? "the twelfth house represents sleep, hospitalization, isolation, recovery, expenses and emotional release"
    : `the ${p.house} house modifies how the planet expresses its health symbolism`;

  const affliction = p.afflictedBy?.length
    ? ` It is also afflicted by ${p.afflictedBy.join(", ")}, which increases the need for preventive awareness.`
    : "";

  return {
    planet: p.planet,
    house: p.house,
    title,
    symbolicBodyArea: gem.bodySystems,
    severity,
    paragraph: paragraphJoin([
      `${p.planet} is connected with ${gem.bodySystems}. In this horoscope it occupies the ${p.house} house, where ${houseMeaning}.${affliction}`,
      `This does not mean the native will definitely suffer from these issues. In medical astrology, such combinations are read as symbolic sensitivity, not fixed diagnosis. They show where the body may express stress when dasha, transit, lifestyle or emotional burden activates the pattern.`,
      `The psychological side is equally important. ${p.planet} governs ${gem.psychology}. When this psychological field is disturbed, the related body systems may become more reactive. The practical remedy is prevention: proper routine, emotional regulation, timely checkups and living the higher expression of ${p.planet}.`,
    ]),
  };
}

function buildMedicalReport(input: GemstoneMedicalInput): MedicalAwarenessReport {
  const sensitivePlanets = input.planets.filter((p) => {
    return [1, 6, 8, 12].includes(p.house) || Boolean(p.afflictedBy?.length) || p.dignity === "debilitated";
  });

  const findings = sensitivePlanets.map(buildMedicalFinding);

  return {
    title: "Medical Astrology Awareness",
    constitutionalProfile: paragraphJoin([
      `The medical profile begins with the ascendant because the ascendant represents the body, vitality and the way life-force enters the horoscope. For ${input.ascendant} ascendant, the body responds best when the native lives in harmony with the ascendant lord and avoids overstimulating difficult planets.`,
      input.moonSign
        ? `The Moon sign is ${input.moonSign}, showing the emotional climate of the body. The Moon connects mind, sleep, digestion, fluids, hormones and emotional memory. If the Moon is disturbed, the body may show symptoms through mood, appetite, sleep or psychosomatic reactions.`
        : `Moon sign data was not supplied, so emotional-health interpretation is based only on planetary placements and afflictions.`,
    ]),
    wellnessInterpretation: paragraphJoin([
      `This horoscope should be read as a mind-body map. The first house shows the physical constitution, the sixth house shows disease tendency and daily imbalance, the eighth house shows chronic or hidden vulnerability, and the twelfth house shows recovery, isolation, sleep, hospitals and emotional release.`,
      `When planets connected with these houses are strong and balanced, the native develops resilience. When they are afflicted, weak or activated by difficult dasha and transit, the body may signal stress through the systems represented by those planets.`,
      `AstroLife does not use this section to create fear. The purpose is preventive awareness. If the chart shows sensitivity around nerves, digestion, heart, hormones, bones or inflammation, the right response is better routine, professional medical guidance, emotional balance and suitable spiritual remedies.`,
    ]),
    medicalMechanicsExplanation: paragraphJoin([
      `The engine studies health through five layers: houses, signs, planets, nakshatras and divisional strength. Houses show the life-area where the issue manifests. Signs show body regions through the Kaal Purush principle. Planets show the physiological and psychological system involved. Nakshatras add subtle patterning, and divisional charts refine strength.`,
      `The 6th house generally points to curable or manageable imbalances, the 8th house to chronic or deeper issues, and the 12th house to hospitalization, recovery, sleep and emotional release. Mars, Saturn, Rahu and Ketu require special attention because they often show injury, chronicity, unusual symptoms or hidden causes when connected with health houses.`,
      `This is symbolic analysis, not medical diagnosis. The final health decision must always belong to qualified doctors and real clinical testing.`,
    ]),
    findings,
    preventiveGuidance: paragraphJoin([
      `The strongest remedy is disciplined prevention. The native should maintain consistent sleep, clean food habits, moderate exercise, emotional expression, stress reduction and timely health checkups. If the chart shows strong Saturn influence, routine becomes medicine. If Mars is sensitive, inflammation and anger must be managed. If Moon is sensitive, sleep and emotional nourishment become essential.`,
      `Gemstones may support wellness only when the related planet is suitable for strengthening. If the planet is difficult, mantra, charity, fasting, counselling, breathwork, yoga, seva and lifestyle correction are usually safer than wearing the gemstone.`,
    ]),
    medicalDisclaimer: "This section is traditional astrological wellness awareness only. It is not medical diagnosis, treatment or a replacement for professional healthcare.",
  };
}

function buildHealingColourInterpretation(items: GemstoneReportItem[]): string {
  const primary = items[0];
  const secondary = items[1];

  if (!primary) {
    return `Healing colour interpretation could not be generated because no gemstone data was available.`;
  }

  const primaryGem = GEM_KNOWLEDGE[primary.planet];
  const secondaryGem = secondary ? GEM_KNOWLEDGE[secondary.planet] : undefined;

  return paragraphJoin([
    `In traditional gem therapy, colour is the visible doorway of planetary force. Every gemstone carries a colour signature that symbolically resonates with a planet. The purpose of colour is not merely beauty; it represents the quality of consciousness the horoscope is trying to strengthen.`,
    `The primary colour in this chart is ${primaryGem.colour}, connected with ${primary.gemstone}. This colour represents ${primaryGem.colourMeaning}. Because ${primary.planet} is the strongest gemstone recommendation, this colour becomes the native's main remedial vibration. It should be understood as a reminder to live the higher qualities of ${primary.planet}: ${primaryGem.highExpression}.`,
    secondaryGem
      ? `The secondary colour is ${secondaryGem.colour}, connected with ${secondary?.gemstone}. This adds another layer of support. While the primary stone works on the main life direction, the secondary colour refines a supporting area such as communication, harmony, fortune, emotional balance or career discipline.`
      : `There is no strong secondary colour in this chart, so the native should keep the remedy simple and focused rather than wearing too many stones.`,
    `A wrong colour can also disturb the field. This is why AstroLife separates recommended colours from avoid colours. The goal is not to wear all Navagraha stones, but to strengthen only those planetary currents that genuinely help the native.`,
  ]);
}

function buildFamousCaseStudySection(include: boolean): ReportSection {
  if (!include) {
    return {
      title: "Famous Chart Case Study Method",
      subtitle: "Educational comparison disabled",
      body: "Famous chart analogies were not enabled for this report. AstroLife can optionally include educational comparisons from verified historical case studies, but these should always be presented as learning references rather than fixed predictions.",
    };
  }

  return {
    title: "Famous Chart Case Study Method",
    subtitle: "How AstroLife uses prominent personalities carefully",
    body: paragraphJoin([
      `Traditional medical astrology often studies charts of prominent personalities to understand repeated symbolic patterns. This method is useful because it shows how astrologers compare planetary afflictions, house involvement, dasha activation and bodily outcomes across many lives.`,
      `For example, classical case-study style literature often discusses public personalities in connection with heart issues, stroke patterns, blindness, tuberculosis, epilepsy, nerve disorders and other health themes. AstroLife does not use such examples to frighten the native or to claim identical results. It uses them as educational mirrors.`,
      `If a user's chart shows a similar symbolic pattern, the report should say: "A related pattern has been observed in traditional case studies, but every horoscope must be judged individually." This protects the user from fatalism while still giving the report scholarly depth.`,
      `The correct use of famous charts is therefore not prediction by imitation. It is pattern education. The native learns how astrologers think, why repeated combinations matter, and why dasha, transit, strength and real-life context must always be considered together.`,
    ]),
  };
}

function buildExecutiveSummary(input: GemstoneMedicalInput, sorted: GemstoneReportItem[]): string {
  const name = input.nativeName ?? "The native";
  const primary = sorted[0];
  const avoids = sorted.filter((x) => x.status === "avoid").slice(0, 3);

  return paragraphJoin([
    `${name}'s gemstone and wellness report has been prepared by combining ascendant-based gemstone logic, planetary strength, dasha relevance, medical astrology symbolism and remedy safety. The purpose is not to give a generic lucky stone, but to identify which planetary forces may be safely strengthened and which should be pacified instead.`,
    primary
      ? `The strongest gemstone indication is ${primary.gemstone} for ${primary.planet}, with a suitability score of ${primary.score}/100. This means ${primary.planet} is the most useful planetary current to consider for direct gemstone support in this chart.`
      : `No primary gemstone could be determined because planetary data was incomplete.`,
    avoids.length > 0
      ? `The main avoid/caution stones are ${avoids.map((x) => x.gemstone).join(", ")}. These are not rejected because they are bad stones; they are avoided because their planets may not be safe to strengthen in this particular horoscope.`
      : `There are no strongly rejected gemstones in the top reading, but every stone should still be tested gradually.`,
    `The medical awareness section should be read as symbolic prevention. It highlights sensitive planetary body systems and emotional patterns, but it does not diagnose disease or replace professional healthcare.`,
  ]);
}

function buildFinalConclusion(input: GemstoneMedicalInput, sorted: GemstoneReportItem[]): string {
  const primary = sorted[0];
  const secondary = sorted[1];
  const avoids = sorted.filter((x) => x.status === "avoid").slice(0, 3);

  if (!primary) {
    return `The final conclusion cannot be generated because no planetary data was supplied.`;
  }

  return paragraphJoin([
    `This horoscope reveals that remedies must be chosen with intelligence rather than habit. The most important finding is that ${primary.gemstone} connected with ${primary.planet} stands as the strongest gemstone support in this chart. Its score of ${primary.score}/100 shows that the planet has enough constructive promise to be considered for strengthening. The deeper purpose of this stone is to help the native live the higher qualities of ${primary.planet}: ${GEM_KNOWLEDGE[primary.planet].highExpression}.`,
    secondary
      ? `${secondary.gemstone}, connected with ${secondary.planet}, appears as the next important support. It should not compete with the primary stone; it should complement it. If the primary stone represents the main architecture of destiny, the secondary stone refines a supporting channel of life such as intelligence, emotional balance, relationship harmony, wealth, fortune or spiritual direction.`
      : `There is no strong secondary gemstone in this report, which means the native should avoid unnecessary gemstone combinations. In remedial astrology, simplicity is often more powerful than excess.`,
    avoids.length > 0
      ? `The avoid list is equally meaningful. ${avoids.map((x) => x.gemstone).join(", ")} should not be worn casually because their planets may intensify difficult karmic patterns. This is one of the most important differences between AstroLife and generic gemstone advice: the system not only tells what to wear, it also explains what not to wear and why.`
      : `The chart does not show many severe gemstone rejections, but the native should still avoid wearing stones randomly. Every gemstone should be connected to a clear planetary purpose.`,
    `From a wellness perspective, the chart shows that the body and mind are not separate. Planetary stress often appears first as emotional imbalance, disturbed routine, poor sleep, inflammation, overthinking, fatigue or subtle discomfort. The best remedy is therefore not only a stone, but a lifestyle aligned with the horoscope: disciplined routine, emotional regulation, ethical action, spiritual steadiness and timely professional care.`,
    `The essence of this report is alignment. A gemstone is not magic in isolation. It becomes meaningful when the native consciously lives the higher lesson of the planet. When gemstone, mantra, lifestyle, awareness and right action work together, the remedy becomes a complete path. The native is then not merely wearing a stone; they are cooperating with the most constructive possibilities already present in the horoscope.`,
  ]);
}

function buildPdfSections(report: Omit<GemstoneMedicalMasterReport, "pdfSections">): ReportSection[] {
  const sections: ReportSection[] = [
    { title: "Gemstone Scoring Method", subtitle: "How AstroLife decides suitability", body: report.gemstoneScoringExplanation },
  ];

  if (report.primaryRecommendation) {
    sections.push({
      title: "Primary Gemstone Recommendation",
      subtitle: report.primaryRecommendation.verdictTitle,
      body: paragraphJoin([
        report.primaryRecommendation.scoringExplanation,
        report.primaryRecommendation.whyAstroLifeRecommendsIt,
        report.primaryRecommendation.bookStyleInterpretation,
        report.primaryRecommendation.expectedBenefits,
        report.primaryRecommendation.wearingGuidance,
      ]),
    });
  }

  report.secondaryRecommendations.forEach((item, index) => {
    sections.push({
      title: `Secondary Recommendation ${index + 1}`,
      subtitle: item.verdictTitle,
      body: paragraphJoin([item.scoringExplanation, item.whyAstroLifeRecommendsIt, item.expectedBenefits, item.cautionOrAvoidance]),
    });
  });

  if (report.avoidList.length > 0) {
    sections.push({
      title: "Avoid Gemstones",
      subtitle: "Wrong-gem warning",
      body: report.avoidList
        .map((item) => paragraphJoin([`${item.gemstone} for ${item.planet}: ${statusLabel(item.status)}.`, item.cautionOrAvoidance, item.alternativeRemedies]))
        .join("\n\n---\n\n"),
    });
  }

  sections.push({ title: "Healing Colour Interpretation", body: report.healingColourInterpretation });

  sections.push({
    title: report.medicalAwareness.title,
    subtitle: "Symbolic wellness awareness",
    body: paragraphJoin([
      report.medicalAwareness.constitutionalProfile,
      report.medicalAwareness.wellnessInterpretation,
      report.medicalAwareness.medicalMechanicsExplanation,
      report.medicalAwareness.findings.map((x) => `${x.title}\n${x.paragraph}`).join("\n\n"),
      report.medicalAwareness.preventiveGuidance,
      report.medicalAwareness.medicalDisclaimer,
    ]),
  });

  sections.push(report.famousChartCaseStudySection);
  sections.push({ title: "Final Book-Style Conclusion", body: report.finalBookStyleConclusion });

  return sections;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function runGemstoneMedicalMasterEngineV2(input: GemstoneMedicalInput): GemstoneMedicalMasterReport {
  const gemstoneItems = input.planets
    .map((planet) => buildGemstoneReportItem(input, planet))
    .sort((a, b) => b.score - a.score);

  const recommended = gemstoneItems.filter((x) => x.status === "highly_recommended" || x.status === "recommended");
  const supportive = gemstoneItems.filter((x) => x.status === "supportive");
  const careful = gemstoneItems.filter((x) => x.status === "use_carefully");
  const avoid = gemstoneItems.filter((x) => x.status === "avoid");

  const primaryRecommendation = recommended[0] ?? supportive[0];
  const secondaryRecommendations = gemstoneItems
    .filter((x) => x !== primaryRecommendation)
    .filter((x) => x.status === "highly_recommended" || x.status === "recommended")
    .slice(0, 2);

  const partialReport = {
    title: "AstroLife Gemstone Intelligence & Medical Awareness Report",
    executiveSummary: buildExecutiveSummary(input, gemstoneItems),
    gemstoneScoringExplanation: buildGemstoneScoringExplanation(),
    primaryRecommendation,
    secondaryRecommendations,
    supportiveRecommendations: supportive,
    useCarefullyList: careful,
    avoidList: avoid,
    healingColourInterpretation: buildHealingColourInterpretation(gemstoneItems),
    medicalAwareness: buildMedicalReport(input),
    famousChartCaseStudySection: buildFamousCaseStudySection(Boolean(input.includeFamousCaseStudies)),
    finalBookStyleConclusion: buildFinalConclusion(input, gemstoneItems),
    disclaimer:
      "Gemstone and medical astrology results are based on traditional astrological principles. They are intended for spiritual, symbolic and educational guidance only. They are not a substitute for professional medical, legal, psychological or financial advice.",
  };

  return {
    ...partialReport,
    pdfSections: buildPdfSections(partialReport),
  };
}
