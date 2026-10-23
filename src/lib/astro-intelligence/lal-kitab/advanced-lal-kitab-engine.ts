// ============================================================
// ASTROLIFE ADVANCED LAL KITAB ENGINE — Safe Tone v2
// Symbolic, reflective, safety-first Lal Kitab interpretation.
// No deterministic, medical, legal, or fear-based claims.
// ============================================================

export const ENGINE_DISCLAIMER =
  "This module provides symbolic reflection rooted in Lal Kitab tradition. " +
  "It is not medical, legal, financial, or psychological advice. " +
  "For any real concern in those areas, please consult a qualified professional. " +
  "No planetary position creates a fixed destiny — all indications are tendencies that respond to awareness, effort, and good choices.";

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

export type SourceStatus =
  | "confirmed"
  | "traditional"
  | "verify"
  | "modern_overlay";

export type SensitivityLevel = "low" | "medium" | "sensitive";

export type PlanetPlacement = {
  planet: Planet;
  house: number;
};

export type AdvancedLalKitabInput = {
  natalPlanets: PlanetPlacement[];
  annualPlanets?: PlanetPlacement[];
  currentAge?: number;
  language?: "hinglish" | "hindi" | "english";
};

// ── Classical Lal Kitab House Data ──────────────────────────

export const pakkaHouses: Record<Planet, number[]> = {
  Sun: [1],
  Moon: [4],
  Mars: [3, 8],
  Mercury: [6],
  Jupiter: [2, 5, 9, 11],
  Venus: [7],
  Saturn: [8, 10],
  Rahu: [12],
  Ketu: [6],
};

export const supportiveHouses: Record<Planet, number[]> = {
  Sun: [1, 5, 9, 10],
  Moon: [1, 4, 7, 10],
  Mars: [3, 6, 10, 11],
  Mercury: [2, 3, 6, 10, 11],
  Jupiter: [1, 2, 5, 9, 11],
  Venus: [1, 4, 5, 7, 10, 11],
  Saturn: [3, 6, 10, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [4, 8, 12],
};

export const challengeHouses: Record<Planet, number[]> = {
  Sun: [7, 8, 12],
  Moon: [6, 8, 12],
  Mars: [4, 7, 8, 12],
  Mercury: [6, 8, 12],
  Jupiter: [6, 8, 12],
  Venus: [6, 8, 12],
  Saturn: [1, 4, 5, 8, 12],
  Rahu: [1, 5, 8, 12],
  Ketu: [1, 2, 7, 8],
};

// ── Life Area Indicators (Symbolic Reflection Only) ─────────

export const lifeAreaIndicators = [
  {
    id: "family_nurturing_indicator",
    category: "family",
    triggerHouses: [5, 8, 12],
    planets: ["Rahu", "Ketu", "Saturn", "Mars"] as Planet[],
    interpretation:
      "Family relationships and nurturing bonds may benefit from extra patience, presence, and emotional attentiveness. This is a reflection point, not a prediction of any specific outcome.",
    sensitivity: "medium" as SensitivityLevel,
    sourceStatus: "traditional" as SourceStatus,
  },
  {
    id: "foreign_or_distance_indicator",
    category: "foreign",
    triggerHouses: [3, 9, 12],
    planets: ["Rahu", "Ketu", "Saturn", "Moon"] as Planet[],
    interpretation:
      "This pattern can reflect movement, foreign influence, distance from birthplace, or work connected with different cultures. It should be validated with dasha and practical life context.",
    sensitivity: "medium" as SensitivityLevel,
    sourceStatus: "traditional" as SourceStatus,
  },
  {
    id: "paperwork_attention_indicator",
    category: "paperwork_and_agreements",
    triggerHouses: [6, 8, 12],
    planets: ["Mars", "Saturn", "Rahu"] as Planet[],
    interpretation:
      "This may suggest the need for patience, proper documentation, and careful review before signing important agreements. A reminder to be thorough rather than rushed in administrative matters.",
    sensitivity: "medium" as SensitivityLevel,
    sourceStatus: "traditional" as SourceStatus,
  },
  {
    id: "money_mindfulness_indicator",
    category: "money_mindfulness",
    triggerHouses: [2, 8, 11, 12],
    planets: ["Rahu", "Jupiter", "Venus", "Saturn"] as Planet[],
    interpretation:
      "This can reflect changing money patterns or strong material desires. Use it as a reminder for disciplined budgeting, saving habits, and thoughtful spending — not as a prediction of financial outcome.",
    sensitivity: "low" as SensitivityLevel,
    sourceStatus: "traditional" as SourceStatus,
  },
  {
    id: "home_property_attention_indicator",
    category: "home_property",
    triggerHouses: [4, 8, 10, 12],
    planets: ["Saturn", "Mars", "Rahu", "Ketu"] as Planet[],
    interpretation:
      "Home, land, old structures, machinery, or property maintenance may need extra attention. This is best used as a practical reminder to maintain the living space carefully.",
    sensitivity: "low" as SensitivityLevel,
    sourceStatus: "traditional" as SourceStatus,
  },
  {
    id: "self_care_routine_indicator",
    category: "daily_routine",
    triggerHouses: [6, 8, 12],
    planets: ["Saturn", "Rahu", "Ketu", "Mars"] as Planet[],
    interpretation:
      "This symbolically suggests the value of maintaining a consistent daily routine — regular sleep, meals, exercise, and rest. It is a wellness reminder, not a prediction of any specific condition.",
    sensitivity: "low" as SensitivityLevel,
    sourceStatus: "traditional" as SourceStatus,
  },
];

// ── 43-Day Symbolic Practice ────────────────────────────────

export const fortyThreeDayProtocol = {
  title: "43-Day Symbolic Remedy Discipline",
  description:
    "In Lal Kitab tradition, some remedies are followed with continuity and discipline. In AstroLife, this should be presented as a symbolic practice of consistency, mindfulness, and behavioral correction. The user should not feel fear or pressure. One simple practice, done sincerely and safely, is better than many complicated remedies.",
  userGuidance:
    "Start with gentle practices first: respectful conduct, cleanliness, gratitude, seva, journaling, and avoiding harmful habits. Donation, metal, gemstone, or strong material remedies should be suggested only with high caution.",
  rules: [
    "Choose only one primary practice at a time.",
    "Avoid combining many remedies together.",
    "If continuity breaks, do not panic. Restart calmly only if the practice is still relevant.",
    "Behavioral correction should come before donation or material remedies.",
    "Do not donate items of a planet that is supporting the chart.",
    "Use this as a mindfulness discipline, not as a guaranteed solution.",
  ],
};

// ── Never Donate Guidance ───────────────────────────────────

export const neverDonateMap: Record<Planet, string[]> = {
  Sun: ["copper", "wheat", "jaggery", "red cloth", "ruby"],
  Moon: ["milk", "rice", "silver", "white cloth"],
  Mars: ["red lentils", "copper", "red sweets", "weapons"],
  Mercury: ["green moong", "green clothes", "books", "pens", "stationery"],
  Jupiter: ["turmeric", "yellow dal", "gold", "religious books"],
  Venus: ["perfume", "white sweets", "luxury items", "diamond"],
  Saturn: ["iron", "oil", "black sesame", "black blanket", "shoes"],
  Rahu: ["gomed", "smoky stone", "electrical items", "blue-black items"],
  Ketu: ["cat's eye", "multi-colour cloth", "blanket"],
};

// ── Core Functions ──────────────────────────────────────────

function getHouse(planets: PlanetPlacement[], planet: Planet): number | undefined {
  return planets.find((p) => p.planet === planet)?.house;
}

export function getPlanetSupportStatus(placement: PlanetPlacement) {
  const { planet, house } = placement;

  const isPakkaHouse = pakkaHouses[planet]?.includes(house);
  const isSupportiveHouse = supportiveHouses[planet]?.includes(house);
  const isChallengeHouse = challengeHouses[planet]?.includes(house);

  let score = 50;

  if (isPakkaHouse) score += 20;
  if (isSupportiveHouse) score += 20;
  if (isChallengeHouse) score -= 20;

  const status =
    score >= 80
      ? "supportive"
      : score >= 55
        ? "mixed_supportive"
        : "needs_careful_handling";

  const explanation =
    status === "supportive"
      ? `${planet} appears supportive in this placement. Its remedies should focus on gratitude, respect, and preserving its positive qualities rather than weakening it through unnecessary donation.`
      : status === "mixed_supportive"
        ? `${planet} gives a mixed but usable influence here. It should be interpreted with dasha, annual chart, and real-life context before suggesting remedies.`
        : `${planet} may need careful handling in this placement. Use soft behavioral correction first and avoid strong material remedies unless properly validated.`;

  return {
    planet,
    house,
    score,
    status,
    isPakkaHouse,
    isSupportiveHouse,
    isChallengeHouse,
    explanation,
  };
}

export function findKismatKaGrah(planets: PlanetPlacement[]) {
  const ranked = planets
    .map((placement) => {
      const support = getPlanetSupportStatus(placement);
      const fortuneHouseBonus = [1, 5, 9, 10, 11].includes(placement.house)
        ? 15
        : 0;

      return {
        ...support,
        finalScore: support.score + fortuneHouseBonus,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);

  return ranked[0] || null;
}

export function analyzeVarshKundali(input: AdvancedLalKitabInput) {
  if (!input.annualPlanets) return null;

  const activations = input.annualPlanets.map((annual) => {
    const natalHouse = getHouse(input.natalPlanets, annual.planet);

    return {
      planet: annual.planet,
      natalHouse,
      annualHouse: annual.house,
      isSameHouseActivation: natalHouse === annual.house,
      message:
        natalHouse === annual.house
          ? `${annual.planet} shows a stronger annual activation this year. Its themes may become more visible and should be handled with awareness.`
          : `${annual.planet} connects natal house ${natalHouse ?? "unknown"} with annual house ${annual.house}, so this year's focus may shift toward those life areas.`,
    };
  });

  const reminders: string[] = [];

  const rahuAnnualHouse = getHouse(input.annualPlanets, "Rahu");
  const ketuAnnualHouse = getHouse(input.annualPlanets, "Ketu");

  if (rahuAnnualHouse === 1) {
    reminders.push(
      "Annual Rahu in the 1st house may highlight identity, visibility, restlessness, or sudden change. Grounding, honesty, and calm decision-making are recommended."
    );
  }

  if (ketuAnnualHouse === 1) {
    reminders.push(
      "Annual Ketu in the 1st house may highlight detachment, introspection, or a need for simplicity. Body grounding and healthy connection are recommended."
    );
  }

  if (input.currentAge === 42) {
    reminders.push(
      "Age 42 is traditionally associated with Rahu-type life themes in Lal Kitab. This is a symbolic maturity checkpoint — a time for grounded ambition and honest self-assessment."
    );
  }

  if (input.currentAge === 48) {
    reminders.push(
      "Age 48 is traditionally associated with Ketu-type life themes in Lal Kitab. This can be used as a gentle reflection point for simplification and inner clarity."
    );
  }

  return {
    title: "Lal Kitab Annual Chart Awareness",
    activations,
    reminders,
  };
}

export function detectLifeAreaIndicators(planets: PlanetPlacement[]) {
  return lifeAreaIndicators.filter((rule) =>
    planets.some(
      (placement) =>
        rule.triggerHouses.includes(placement.house) &&
        rule.planets.includes(placement.planet)
    )
  );
}

export function getNeverDonateGuidance(planets: PlanetPlacement[]) {
  const kismatKaGrah = findKismatKaGrah(planets);

  if (!kismatKaGrah) return [];

  const neverDonateItems = neverDonateMap[kismatKaGrah.planet] || [];

  return [
    {
      planet: kismatKaGrah.planet,
      house: kismatKaGrah.house,
      items: neverDonateItems,
      explanation:
        `${kismatKaGrah.planet} appears to be one of the supportive planets in this chart. In a safety-first Lal Kitab approach, its symbolic items should not be donated casually, because the goal is to preserve its supportive influence. Prefer gratitude, respectful conduct, and strengthening positive habits connected with this planet.`,
    },
  ];
}

export function buildRemedySafetyProtocol(planets: PlanetPlacement[]) {
  const neverDonateGuidance = getNeverDonateGuidance(planets);

  return {
    title: "Safe Remedy Protocol",
    priority:
      "Start with safe daily practices before considering donation, metal, gemstone, or 43-day remedies.",
    safestPractices:
      "Recommended first-line practices include respectful behavior, cleaning the related home zone, helping people without expectation, journaling, meditation, gratitude, and avoiding harmful habits.",
    donationGuidance:
      "Donation should only be considered when a planet is clearly under stress and not acting as a supportive or fortune-giving planet. If unsure, avoid donation and use behavioral remedies first.",
    highCaution:
      "Gemstones, metals, strong ritual practices, and intense remedy combinations should be treated as high-caution and should not be suggested casually.",
    fortyThreeDayProtocol,
    neverDonateGuidance,
  };
}

// ── Narrative Builder ───────────────────────────────────────

function buildNarrative(
  result: {
    kismatKaGrah: ReturnType<typeof findKismatKaGrah>;
    lifeAreaIndicators: ReturnType<typeof detectLifeAreaIndicators>;
  },
  language: "hinglish" | "hindi" | "english" = "hinglish"
) {
  const planet = result.kismatKaGrah?.planet || "a supportive planet";

  if (language === "english") {
    return `This advanced Lal Kitab layer reads planetary support, challenge zones, annual activation, life-area reflection points, remedy safety, and never-donate guidance in a soft and practical way. It does not treat any indication as fixed destiny. Instead, it uses traditional symbolism to support reflection, better decisions, and mindful correction.

The current supportive planet appears to be ${planet}. Its symbolic items should not be donated casually. If any life-area indicators appear, they should be explained as areas where the user may benefit from patience, awareness, professional help where needed, and safe daily practices.`;
  }

  if (language === "hindi") {
    return `यह उन्नत लाल किताब लेयर ग्रहों की सहायता, चुनौती वाले क्षेत्र, वार्षिक सक्रियता, जीवन संकेत, उपाय-सुरक्षा और never-donate guidance को शांत और व्यावहारिक तरीके से पढ़ती है। इसे निश्चित भाग्य या डराने वाली भविष्यवाणी की तरह नहीं पढ़ना चाहिए।

इस चार्ट में ${planet} सहायक ग्रह के रूप में दिख सकता है। इसके प्रतीकात्मक वस्तुओं का दान बिना उचित विश्लेषण के नहीं करना चाहिए। यदि कोई जीवन संकेत दिखता है, तो उसे डर के रूप में नहीं बल्कि धैर्य, जागरूकता, सुरक्षित अभ्यास और जरूरत पड़ने पर पेशेवर सलाह के रूप में समझाना चाहिए।`;
  }

  // Default: Hinglish
  return `Ye advanced Lal Kitab layer planet support, challenge zones, varsh kundali activation, life-area indicators, remedy safety aur never-donate guidance ko soft aur practical tareeke se read karti hai. Iska purpose fear create karna nahi hai; iska purpose hai user ko awareness, better choices aur safe correction dena.

Is chart me ${planet} supportive planet ki tarah appear ho sakta hai. Is planet ke symbolic items casually donate nahi karne chahiye. Agar koi life-area indicator dikhe, to use dar ke form me nahi, balki patience, awareness, safe habits aur zarurat padne par professional advice ke form me explain karna chahiye.`;
}

// ── Main Export ─────────────────────────────────────────────

export function analyzeAdvancedLalKitab(input: AdvancedLalKitabInput) {
  const planetSupport = input.natalPlanets.map(getPlanetSupportStatus);
  const kismatKaGrah = findKismatKaGrah(input.natalPlanets);
  const varshKundali = analyzeVarshKundali(input);
  const indicators = detectLifeAreaIndicators(input.natalPlanets);
  const remedySafety = buildRemedySafetyProtocol(input.natalPlanets);

  const result = {
    system: "AstroLife Advanced Lal Kitab Engine — Safe Tone v2",
    disclaimer: ENGINE_DISCLAIMER,
    purpose:
      "This module provides symbolic, reflective, and safety-first Lal Kitab interpretation. It avoids deterministic, medical, legal, or fear-based claims.",
    planetSupport,
    kismatKaGrah,
    varshKundali,
    lifeAreaIndicators: indicators,
    remedySafety,
  };

  return {
    ...result,
    narrative: buildNarrative(
      {
        kismatKaGrah,
        lifeAreaIndicators: indicators,
      },
      input.language || "hinglish"
    ),
  };
}
