/* AstroLife Phase 1 Complete Remedy Intelligence Engine
   Complete coverage:
   - 9 planet practical remedy narratives
   - 27 nakshatra tree remedies
   - dasha remedy timing
   - safety ranking
   - Hinglish / Hindi / English support
   - no empty fallback gaps
*/

export type Language = "hinglish" | "hindi" | "english";
export type SourceStatus = "confirmed" | "traditional" | "verify" | "modern_overlay";
export type SafetyLevel = "safe" | "gentle" | "caution" | "high_caution";

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

export type RemedyCategory =
  | "safe_daily"
  | "avoidance_rule"
  | "seva"
  | "animal_feeding"
  | "donation"
  | "house_object"
  | "forty_three_day"
  | "metal_gem"
  | "never_donate";

export type PlanetRemedyNarrative = {
  planet: Planet;
  category: RemedyCategory;
  safetyLevel: SafetyLevel;
  title: string;
  paragraph: string;
  whyItHelps: string;
  practice: string;
  avoid: string;
  neverDonate: string[];
  sourceStatus: SourceStatus;
};

export type NakshatraTreeRule = {
  nakshatra: string;
  rulingPlanet: Planet;
  deity: string;
  tree: string;
  theme: string;
  paragraph: string;
  safePractice: string;
  avoid: string;
  sourceStatus: SourceStatus;
};

export type DashaRemedyInput = {
  mahadashaPlanet: Planet;
  antardashaPlanet?: Planet;
  pratyantardashaPlanet?: Planet;
  moonNakshatra: string;
  planetNakshatras?: Partial<Record<Planet, string>>;
  stressedPlanets?: Planet[];
  activeLalKitabPlanets?: Planet[];
  language?: Language;
};

export type DashaRemedyResult = {
  activePeriod: string;
  priorityPlanets: Planet[];
  primaryPlanet: Planet;
  dashaNavtara: DashaNavtaraSafety[];
  dashaNarrative: string;
  planetRemedies: PlanetRemedyNarrative[];
  nakshatraTree: NakshatraTreeRule;
  nakshatraNarrative: string;
  safestRemedyPlan: string;
  highCautionBoundary: string;
  neverDonateWarnings: string[];
  navtaraSafety: NavtaraRemedySafety;
};

export type DashaNavtaraSafety = NavtaraPlanetSafety & {
  level: "Mahadasha" | "Antardasha" | "Pratyantardasha";
};

export type NavtaraTone = "favourable" | "challenging" | "sensitive";

export type NavtaraPlanetSafety = {
  planet: Planet;
  nakshatra: string;
  tara: string;
  tone: NavtaraTone;
  donationMode: "avoid_donation" | "cautious_remedy" | "observe";
  reason: string;
};

export type NavtaraRemedySafety = {
  planets: NavtaraPlanetSafety[];
  favourablePlanets: Planet[];
  challengingPlanets: Planet[];
  consolidatedNeverDonateLine: string;
  donationGuidanceLine: string;
};

export const PLANETS: Planet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export function isPlanet(value: string | undefined | null): value is Planet {
  return !!value && (PLANETS as string[]).includes(value);
}

export const planetRemedyNarratives: PlanetRemedyNarrative[] = [
  {
    planet: "Sun",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Sun Remedy - Respect, Discipline and Clean Leadership",
    paragraph:
      "Sun-related remedies should begin with self-respect, humility, fatherly respect, discipline and clean leadership. The Sun represents dignity, confidence, father, authority, public image and life direction. When Sun energy is disturbed, the person may become either too ego-sensitive or too unsure of their own authority. The safest correction is to build a stable morning routine, speak with dignity, respect elders and use leadership for service rather than domination.",
    whyItHelps:
      "This works symbolically because Sun becomes healthier when ego is refined into responsibility. Instead of trying to force recognition, the person learns to become worthy of recognition through consistency, truth and noble conduct.",
    practice:
      "Wake up with a clean routine, keep promises, avoid arrogant speech, respect father-like figures, take sunlight mindfully in the morning if suitable, and lead others without humiliating them.",
    avoid:
      "Avoid donating Sun items if Sun is supportive or acting as kismat-giving planet. Avoid ruby, copper, wheat or jaggery remedies without full chart validation.",
    neverDonate: ["copper", "wheat", "jaggery", "red cloth", "ruby"],
    sourceStatus: "traditional",
  },
  {
    planet: "Moon",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Moon Remedy - Emotional Stability, Sleep and Mother Respect",
    paragraph:
      "Moon remedies should focus on emotional steadiness, sleep rhythm, mother respect, clean water and a peaceful home environment. Moon represents mind, mother, memory, nourishment, sleep and emotional safety. When Moon is disturbed, the person may feel mood fluctuation, overthinking, emotional dependency or disturbed sleep. The safest remedy is to create calmness in daily rhythm rather than doing intense rituals.",
    whyItHelps:
      "Moon becomes balanced when the nervous system feels safe. Clean water, regular sleep, gratitude toward nurturing people and emotional boundaries help the mind return to steadiness.",
    practice:
      "Maintain sleep discipline, clean water vessels, avoid emotional eating, respect mother or mother-like figures, journal feelings, and keep the bedroom peaceful.",
    avoid:
      "Avoid using Moon remedies as replacement for mental health support. Avoid donating milk, rice, silver or white cloth if Moon is supportive.",
    neverDonate: ["milk", "rice", "silver", "white cloth"],
    sourceStatus: "traditional",
  },
  {
    planet: "Mars",
    category: "avoidance_rule",
    safetyLevel: "safe",
    title: "Mars Remedy - Anger Discipline and Courage with Control",
    paragraph:
      "Mars remedies should begin with anger discipline, physical activity, responsible courage and careful handling of tools, fire, vehicles and property matters. Mars represents action, blood, courage, brothers, land, competition and survival response. When Mars is disturbed, anger can become impulsive and create conflict. The safest remedy is to turn raw aggression into disciplined strength.",
    whyItHelps:
      "Mars becomes constructive when action is guided by awareness. Exercise, restraint, clean tools, safe driving and respect for siblings reduce unnecessary conflict.",
    practice:
      "Exercise regularly, avoid violent speech, drive carefully, keep kitchen/fire/tools organized, help siblings where possible and pause before reacting.",
    avoid:
      "Avoid weapon-related remedies, aggressive rituals, or donating Mars items if Mars is protecting courage, land or family strength.",
    neverDonate: ["red lentils", "copper", "red sweets", "weapons", "tools"],
    sourceStatus: "traditional",
  },
  {
    planet: "Mercury",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Mercury Remedy - Truthful Speech and Clean Decisions",
    paragraph:
      "Mercury remedies should focus on truthful communication, clean documents, study discipline and reducing mental clutter. Mercury represents speech, intellect, business, calculation, writing, learning and nervous processing. When Mercury is disturbed, the person may overthink, manipulate, speak inconsistently or make confused decisions. The safest remedy is to make speech and paperwork clean.",
    whyItHelps:
      "Mercury improves when the mind becomes organized. Honest communication, clean accounts and thoughtful decision-making reduce confusion and nervous restlessness.",
    practice:
      "Keep documents organized, avoid gossip, write important decisions before acting, study daily, respect students and young people, and maintain clean business ethics.",
    avoid:
      "Avoid donating books, pens, green moong or stationery if Mercury is supportive for education, business or communication.",
    neverDonate: ["green moong", "green clothes", "books", "pens", "stationery"],
    sourceStatus: "traditional",
  },
  {
    planet: "Jupiter",
    category: "seva",
    safetyLevel: "safe",
    title: "Jupiter Remedy - Wisdom, Guru Respect and Ethical Giving",
    paragraph:
      "Jupiter remedies should begin with respect for teachers, ethical learning, gratitude, guidance and meaningful charity. Jupiter represents wisdom, Guru, children, dharma, blessings, education and expansion. When Jupiter is disturbed, the person may receive wrong guidance, become morally confused or overpromise. The safest remedy is to return to sincere learning and humble wisdom.",
    whyItHelps:
      "Jupiter becomes supportive when knowledge is used responsibly. Helping students, respecting teachers and avoiding fake spirituality aligns the person with wisdom.",
    practice:
      "Respect Guru, teachers and elders, donate knowledge or food when suitable, guide others honestly, avoid false claims and practice gratitude.",
    avoid:
      "Avoid donating turmeric, yellow dal, gold or religious books if Jupiter is strongly protecting fortune, children or wisdom.",
    neverDonate: ["turmeric", "yellow dal", "gold", "religious books"],
    sourceStatus: "traditional",
  },
  {
    planet: "Venus",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Venus Remedy - Relationship Cleanliness and Value Alignment",
    paragraph:
      "Venus remedies should focus on loyalty, respect for women, clean relationship conduct, beauty with balance and healthy enjoyment. Venus represents marriage, love, comfort, art, beauty, sensuality and value systems. During Venus activation, relationship choices, attraction, luxury and emotional validation become important. The safest remedy is not luxury donation, but purifying how one loves, spends and relates.",
    whyItHelps:
      "Venus becomes refined when desire is guided by respect. Clean bedroom energy, honest affection and loyalty protect relationship harmony better than superficial remedies.",
    practice:
      "Respect spouse or partner, avoid secret relationships, keep bedroom clean, appreciate beauty without addiction, and use art/music/devotion to soften the heart.",
    avoid:
      "Avoid perfume, diamond, white sweets or luxury donations if Venus is supportive for marriage, wealth or comfort.",
    neverDonate: ["perfume", "white sweets", "luxury items", "diamond"],
    sourceStatus: "traditional",
  },
  {
    planet: "Saturn",
    category: "seva",
    safetyLevel: "safe",
    title: "Saturn Remedy - Patience, Labour Respect and Karmic Discipline",
    paragraph:
      "Saturn remedies should begin with humility, patience, discipline, service to workers, elderly people and those who carry heavy responsibilities. Saturn represents karma, delay, labour, old things, discipline, poverty-memory and long-term structure. When Saturn is disturbed, life may feel delayed or heavy. The safest remedy is to respect the dignity of work and remove neglect from daily life.",
    whyItHelps:
      "Saturn improves when the person stops avoiding responsibility. Service, cleanliness, patience and respect for labour create inner stability.",
    practice:
      "Respect workers, help elderly people, remove junk, repair broken machinery where practical, keep commitments and follow a long-term routine.",
    avoid:
      "Avoid iron, oil, black sesame, black blanket or shoes donation if Saturn is supportive for career, stability or longevity.",
    neverDonate: ["iron", "oil", "black sesame", "black blanket", "shoes"],
    sourceStatus: "traditional",
  },
  {
    planet: "Rahu",
    category: "avoidance_rule",
    safetyLevel: "safe",
    title: "Rahu Remedy - Grounding, Truth and Avoiding Shortcuts",
    paragraph:
      "Rahu remedies should focus on grounding, honesty, digital discipline, avoiding shortcuts and staying away from manipulative environments. Rahu represents ambition, foreign influence, technology, obsession, sudden rise, illusion and image hunger. During Rahu disturbance, the person may chase quick success or feel mentally restless. The safest remedy is to return to truth and grounded effort.",
    whyItHelps:
      "Rahu becomes less confusing when the person chooses clarity over illusion. Ethical choices reduce the shadow side of ambition.",
    practice:
      "Avoid false promises, reduce addictive digital habits, stay away from unethical shortcuts, serve marginalized people and make decisions after a pause.",
    avoid:
      "Avoid gomed, smoky stones, electrical-item remedies or intense Rahu remedies without deep validation.",
    neverDonate: ["gomed", "smoky stone", "electrical items", "blue-black items"],
    sourceStatus: "traditional",
  },
  {
    planet: "Ketu",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Ketu Remedy - Grounding, Simplicity and Relationship Repair",
    paragraph:
      "Ketu remedies should be gentle, grounding and simple. Ketu represents detachment, past residue, intuition, isolation, spiritual insight and sudden cut-offs. During Ketu activation, the person may feel withdrawn, detached or uninterested in worldly matters. The safest remedy is to stay connected to the body, routine and sincere relationships.",
    whyItHelps:
      "Ketu becomes constructive when detachment becomes wisdom rather than avoidance. Grounding and seva help spiritual insight remain balanced.",
    practice:
      "Practice simple routines, avoid unnecessary isolation, care for animals gently, walk mindfully, repair important relationships and reduce escapist habits.",
    avoid:
      "Avoid cat's eye, intense Ketu remedies or using spirituality to escape responsibilities.",
    neverDonate: ["cat's eye", "multi-colour cloth", "blanket"],
    sourceStatus: "traditional",
  },
];

export const nakshatraTreeRules: NakshatraTreeRule[] = [
  ["Ashwini", "Ketu", "Ashwini Kumaras", "Kuchla / Strychnine Tree", "healing, speed, new beginnings", "Ashwini represents the impulse to heal, restart and move quickly. Its tree association should be used symbolically through ecological care, not medicinal use.", "Care for trees, protect animals, begin healthy routines and avoid rushing important decisions.", "Do not consume or use plant parts medicinally without medical supervision."],
  ["Bharani", "Venus", "Yama", "Amla / Indian Gooseberry", "responsibility, restraint, transformation", "Bharani carries the lesson of handling desire, responsibility and emotional intensity with maturity.", "Nurture fruit-bearing plants, respect women and elders, practice restraint and avoid impulsive pleasure-seeking.", "Avoid fear-based or harsh remedies."],
  ["Krittika", "Sun", "Agni", "Fig / Cluster Fig", "purification, clarity, courage", "Krittika symbolically cuts through confusion and asks for truth, cleanliness and disciplined fire.", "Keep kitchen/fire areas clean, speak truth clearly and respect elders.", "Avoid aggressive fire rituals or harsh speech."],
  ["Rohini", "Moon", "Brahma", "Jamun / Java Plum", "growth, beauty, nourishment", "Rohini reflects emotional nourishment, growth, beauty and creative fertility of life.", "Care for plants, keep the home beautiful and peaceful, and respect mother-like figures.", "Do not make medical or fertility claims from this symbolism."],
  ["Mrigashira", "Mars", "Soma", "Khair / Acacia Catechu", "search, curiosity, movement", "Mrigashira shows a searching mind and the need to explore without becoming restless.", "Walk in nature, journal thoughts, water plants and avoid impulsive decisions.", "Avoid using plant material as treatment."],
  ["Ardra", "Rahu", "Rudra", "Krishna Kamal / or traditional Ardra tree reference", "storm, release, emotional cleansing", "Ardra represents emotional storms, deep release and transformation after intensity.", "Use breathwork, journaling, rain-water symbolism, tree care and honest emotional expression.", "Avoid destructive emotional reactions or fear-based rituals."],
  ["Punarvasu", "Jupiter", "Aditi", "Bamboo", "renewal, return, protection", "Punarvasu reflects the power to rebuild, return to balance and restore hope after difficulty.", "Care for bamboo or healthy plants, restart good habits, donate food when suitable and protect family harmony.", "Avoid overpromising remedy results."],
  ["Pushya", "Saturn", "Brihaspati", "Peepal / Sacred Fig", "nourishment, guidance, protection", "Pushya is connected with nourishment, wisdom, protection and respectful service.", "Respect sacred trees, serve teachers and elders, protect nature and practice disciplined kindness.", "Do not use any part of the tree medicinally without medical advice."],
  ["Ashlesha", "Mercury", "Nagas", "Nagakesar / Mesua Ferrea", "depth, intuition, psychological knots", "Ashlesha reflects hidden emotions, attachment patterns and the need to untangle the mind gently.", "Practice honest communication, avoid manipulation, journal emotions and care for plants mindfully.", "Avoid fear-based serpent or occult interpretations."],
  ["Magha", "Ketu", "Pitrs", "Banyan", "ancestry, dignity, lineage", "Magha connects with ancestors, family dignity and responsible use of inherited blessings.", "Respect elders, preserve family values, care for old trees and practice gratitude toward lineage.", "Avoid superiority or pride in family status."],
  ["Purva Phalguni", "Venus", "Bhaga", "Palash / Flame of the Forest", "pleasure, creativity, union", "Purva Phalguni represents beauty, romance, enjoyment and creative rest.", "Create beauty ethically, respect relationships, nurture flowering plants and balance pleasure with responsibility.", "Avoid luxury excess or secretive relationship patterns."],
  ["Uttara Phalguni", "Sun", "Aryaman", "Pakad / Indian Laurel Fig", "commitment, agreements, noble support", "Uttara Phalguni reflects long-term commitment, friendship, contracts and dignified support.", "Honor commitments, keep agreements clean, support family duties and care for stable trees.", "Avoid breaking promises casually."],
  ["Hasta", "Moon", "Savitar", "Reetha / Soapnut", "skill, hands, manifestation", "Hasta shows skillful hands, practical intelligence and the ability to shape life gently.", "Use hands for service, clean tools, practice craft and maintain emotional steadiness.", "Avoid manipulation through cleverness."],
  ["Chitra", "Mars", "Tvashtar", "Bel / Bael", "design, beauty, structure", "Chitra reflects craftsmanship, beauty, architecture and the urge to create something refined.", "Care for sacred or fruit trees, clean creative spaces and use design talent responsibly.", "Avoid vanity or perfectionism."],
  ["Swati", "Rahu", "Vayu", "Arjun", "freedom, movement, independence", "Swati represents independence, movement, trade and the need to remain flexible without becoming scattered.", "Spend time in fresh air, practice breath discipline, care for trees and make independent choices ethically.", "Avoid restlessness and unstable commitments."],
  ["Vishakha", "Jupiter", "Indra-Agni", "Nagkesar / Wood Apple traditional reference", "goal, ambition, devotion", "Vishakha reflects focused ambition, spiritual hunger and the need to direct desire toward meaningful goals.", "Set ethical goals, respect teachers, care for trees and avoid shortcuts.", "Avoid obsession with achievement."],
  ["Anuradha", "Saturn", "Mitra", "Maulsari / Spanish Cherry", "friendship, devotion, loyalty", "Anuradha symbolizes loyalty, devotion, friendship and disciplined emotional bonding.", "Honor friendships, serve elders, care for fragrant trees and practice emotional maturity.", "Avoid dependency or hidden resentment."],
  ["Jyeshtha", "Mercury", "Indra", "Neem", "seniority, protection, responsibility", "Jyeshtha reflects seniority, protection, responsibility and the challenge of using power wisely.", "Care for neem or protective trees, speak responsibly and protect without controlling.", "Avoid pride, jealousy or harsh speech."],
  ["Mula", "Ketu", "Nirriti", "Sal / or traditional Mula tree reference", "roots, truth, deep release", "Mula goes to the root of things. It can bring deep questioning, simplification and release of false attachments.", "Care for roots and soil, simplify life, journal honestly and avoid destructive detachment.", "Avoid fear-based interpretations of this nakshatra."],
  ["Purva Ashadha", "Venus", "Apas", "Ashoka", "purification, emotion, victory", "Purva Ashadha reflects emotional purification, beauty, confidence and the ability to rise with faith.", "Care for flowering trees, keep water clean, respect women and balance confidence with humility.", "Avoid emotional pride."],
  ["Uttara Ashadha", "Sun", "Vishwadevas", "Jackfruit / traditional reference", "lasting victory, ethics, responsibility", "Uttara Ashadha represents enduring success through ethics, patience and responsibility.", "Honor duties, care for large trees, support community and avoid shortcuts.", "Avoid rigid moral superiority."],
  ["Shravana", "Moon", "Vishnu", "Akada / Calotropis traditional reference", "listening, learning, preservation", "Shravana reflects listening, learning, tradition and the ability to preserve wisdom.", "Listen deeply, respect teachers, care for plants and use speech mindfully.", "Avoid gossip or passive emotional absorption."],
  ["Dhanishtha", "Mars", "Vasus", "Shami", "rhythm, wealth, community", "Dhanishtha reflects rhythm, prosperity, music, community and disciplined action.", "Care for Shami or hardy trees, support community, maintain rhythm in work and control anger.", "Avoid greed or competitive arrogance."],
  ["Shatabhisha", "Rahu", "Varuna", "Kadamba", "healing space, secrecy, research", "Shatabhisha represents healing space, hidden knowledge, solitude and careful observation.", "Create healthy solitude, care for trees, avoid intoxicants and maintain ethical research habits.", "Avoid isolation becoming escapism."],
  ["Purva Bhadrapada", "Jupiter", "Aja Ekapada", "Mango", "intensity, transformation, idealism", "Purva Bhadrapada reflects intense ideals, transformation and the need to use passion wisely.", "Care for fruit trees, guide others ethically, practice moderation and avoid extremes.", "Avoid fanaticism or emotional intensity without grounding."],
  ["Uttara Bhadrapada", "Saturn", "Ahir Budhnya", "Neem / or traditional deep-root tree reference", "depth, patience, inner stability", "Uttara Bhadrapada reflects inner depth, patience, spiritual maturity and quiet strength.", "Care for long-living trees, practice silence, serve elders and keep commitments.", "Avoid emotional withdrawal from responsibilities."],
  ["Revati", "Mercury", "Pushan", "Mahua", "protection, travel, nourishment", "Revati represents protection, safe journeys, nourishment and gentle completion.", "Care for animals and trees, support travelers or needy people, organize documents and speak gently.", "Avoid confusion, overgiving or escapism."],
].map(([nakshatra, rulingPlanet, deity, tree, theme, paragraph, safePractice, avoid]) => ({
  nakshatra,
  rulingPlanet: rulingPlanet as Planet,
  deity,
  tree,
  theme,
  paragraph,
  safePractice,
  avoid,
  sourceStatus: "traditional" as SourceStatus,
}));

const NAVTARA_SEQUENCE = [
  "Janma",
  "Sampat",
  "Vipat",
  "Kshema",
  "Pratyak",
  "Sadhana",
  "Naidhana",
  "Mitra",
  "Parama Mitra",
] as const;

const FAVOURABLE_TARAS = new Set(["Sampat", "Kshema", "Sadhana", "Mitra", "Parama Mitra"]);
const CHALLENGING_TARAS = new Set(["Vipat", "Pratyak", "Naidhana"]);
const NATURAL_MALEFICS = new Set<Planet>(["Mars", "Saturn", "Rahu", "Ketu"]);

export function normalizeNakshatraName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getNakshatraTreeRule(nakshatra: string): NakshatraTreeRule {
  const normalized = normalizeNakshatraName(nakshatra);
  return (
    nakshatraTreeRules.find(
      (rule) => normalizeNakshatraName(rule.nakshatra) === normalized
    ) || nakshatraTreeRules[0]
  );
}

export function getNakshatraIndex(nakshatra: string): number {
  const normalized = normalizeNakshatraName(nakshatra);
  return nakshatraTreeRules.findIndex(
    (rule) => normalizeNakshatraName(rule.nakshatra) === normalized
  );
}

export function getNavtaraTone(moonNakshatra: string, planetNakshatra: string) {
  const moonIndex = getNakshatraIndex(moonNakshatra);
  const planetIndex = getNakshatraIndex(planetNakshatra);
  if (moonIndex < 0 || planetIndex < 0) {
    return { tara: "Unknown", tone: "sensitive" as NavtaraTone };
  }

  const distance = (planetIndex - moonIndex + 27) % 27;
  const tara = NAVTARA_SEQUENCE[distance % 9];
  const tone: NavtaraTone = FAVOURABLE_TARAS.has(tara)
    ? "favourable"
    : CHALLENGING_TARAS.has(tara)
      ? "challenging"
      : "sensitive";

  return { tara, tone };
}

export function getPlanetRemedies(planet: Planet): PlanetRemedyNarrative[] {
  return planetRemedyNarratives.filter((remedy) => remedy.planet === planet);
}

export function uniquePlanets(planets: Planet[]): Planet[] {
  return [...new Set(planets)];
}

export function getPriorityPlanets(input: DashaRemedyInput): Planet[] {
  const planets: Planet[] = [
    input.antardashaPlanet,
    input.pratyantardashaPlanet,
    input.mahadashaPlanet,
    ...(input.activeLalKitabPlanets || []),
    ...(input.stressedPlanets || []),
  ].filter(Boolean) as Planet[];

  return uniquePlanets(planets).slice(0, 5);
}

export function buildDashaNarrative(input: DashaRemedyInput): string {
  const language = input.language || "hinglish";
  const activePeriod = input.antardashaPlanet
    ? `${input.mahadashaPlanet} Mahadasha -> ${input.antardashaPlanet} Antardasha`
    : `${input.mahadashaPlanet} Mahadasha`;

  const priority = getPriorityPlanets(input)[0];

  if (language === "english") {
    return `The active period is ${activePeriod}. During this phase, themes connected with ${priority} may feel more visible. Remedy priority should begin with safe daily practices, behavioral correction, emotional steadiness and practical discipline. Strong remedies such as gemstones, metals, donations or 43-day practices should only be considered after full chart validation.`;
  }

  if (language === "hindi") {
    return `वर्तमान अवधि ${activePeriod} है। इस समय ${priority} से जुड़े विषय अधिक सक्रिय महसूस हो सकते हैं। उपायों की शुरुआत सुरक्षित दैनिक अभ्यास, व्यवहार सुधार, भावनात्मक संतुलन और व्यावहारिक अनुशासन से करनी चाहिए। रत्न, धातु, दान या 43-दिन वाले उपाय पूरी chart validation के बाद ही करें।`;
  }

  return `Current period ${activePeriod} chal raha hai. Is phase me ${priority} se connected themes zyada active feel ho sakte hain. Remedy priority hamesha safe daily practices, behavior correction, emotional steadiness aur practical discipline se start honi chahiye. Gemstone, metal, donation ya 43-day remedies full chart validation ke bina nahi karne chahiye.`;
}

export function buildNakshatraNarrative(
  rule: NakshatraTreeRule,
  language: Language = "hinglish"
): string {
  if (language === "english") {
    return `${rule.nakshatra} is traditionally associated with ${rule.tree}. Its symbolic theme is ${rule.theme}. ${rule.paragraph} A safe way to work with this nakshatra is: ${rule.safePractice} ${rule.avoid}`;
  }

  if (language === "hindi") {
    return `${rule.nakshatra} नक्षत्र का पारंपरिक संबंध ${rule.tree} से माना जाता है। इसका मुख्य भाव ${rule.theme} है। ${rule.paragraph} सुरक्षित अभ्यास: ${rule.safePractice} ${rule.avoid}`;
  }

  return `${rule.nakshatra} nakshatra ka traditional sambandh ${rule.tree} se maana jata hai. Iska core theme hai ${rule.theme}. ${rule.paragraph} Safe practice: ${rule.safePractice} ${rule.avoid}`;
}

export function buildSafestRemedyPlan(
  remedies: PlanetRemedyNarrative[],
  language: Language = "hinglish"
): string {
  const safe = remedies.filter(
    (r) => r.safetyLevel === "safe" || r.safetyLevel === "gentle"
  );

  const selected = safe.length ? safe : remedies;

  const paragraphs = selected
    .slice(0, 3)
    .map((r) => `${r.title}: ${r.paragraph} Practice: ${r.practice}`)
    .join("\n\n");

  if (language === "english") {
    return `${paragraphs}\n\nThe safest approach is to choose one or two practices and follow them with sincerity. Do not overload yourself with many remedies.`;
  }

  if (language === "hindi") {
    return `${paragraphs}\n\nसबसे सुरक्षित तरीका है कि एक या दो सरल अभ्यास चुनें और उन्हें ईमानदारी से करें। बहुत सारे उपाय एक साथ न करें।`;
  }

  return `${paragraphs}\n\nSabse safe approach ye hai ki ek ya do simple practices choose karein aur sincerity ke saath follow karein. Bahut saare upay ek saath mat karein.`;
}

export function buildHighCautionBoundary(language: Language = "hinglish"): string {
  if (language === "english") {
    return "Donation, metals, gemstones and 43-day practices are high-caution remedies. They should not be recommended unless the planet is clearly under stress, active by dasha or annual chart, and not acting as a supportive or fortune-giving planet.";
  }

  if (language === "hindi") {
    return "दान, धातु, रत्न और 43-दिन वाले उपाय high-caution remedies हैं। इन्हें तभी सुझाना चाहिए जब ग्रह वास्तव में तनाव में हो, दशा या वार्षिक कुंडली से सक्रिय हो, और सहायक या भाग्य देने वाला ग्रह न हो।";
  }

  return "Donation, metals, gemstones aur 43-day practices high-caution remedies hain. Inhe tabhi suggest karna chahiye jab planet clearly stress me ho, dasha ya annual chart se active ho, aur supportive ya kismat-giving planet na ho.";
}

export function buildNeverDonateWarnings(remedies: PlanetRemedyNarrative[]): string[] {
  return remedies.flatMap((r) =>
    r.neverDonate.map(
      (item) =>
        `${r.planet}: Do not casually donate ${item} if ${r.planet} is supportive, benefic, or kismat-giving in the chart.`
    )
  );
}

function uniqueItems(items: string[]) {
  return [...new Set(items)].slice(0, 14);
}

export function analyzeNavtaraRemedySafety(input: DashaRemedyInput, priorityPlanets: Planet[]): NavtaraRemedySafety {
  const planets = priorityPlanets.map((planet) => {
    const nakshatra = input.planetNakshatras?.[planet] || input.moonNakshatra;
    const navtara = getNavtaraTone(input.moonNakshatra, nakshatra);
    const isNaturalMalefic = NATURAL_MALEFICS.has(planet);

    const donationMode: NavtaraPlanetSafety["donationMode"] =
      navtara.tone === "favourable"
        ? "avoid_donation"
        : navtara.tone === "challenging" || isNaturalMalefic
          ? "cautious_remedy"
          : "observe";

    const reason =
      donationMode === "avoid_donation"
        ? `${planet} is in ${navtara.tara} tara from Moon, so preserve its support; do not casually donate its items.`
        : donationMode === "cautious_remedy"
          ? `${planet} is ${navtara.tara} tara or a natural malefic, so remedies can be considered carefully after chart validation.`
          : `${planet} is in a sensitive/neutral Navtara position; use soft daily practices first.`;

    return {
      planet,
      nakshatra,
      tara: navtara.tara,
      tone: navtara.tone,
      donationMode,
      reason,
    };
  });

  const favourablePlanets = planets
    .filter((planet) => planet.donationMode === "avoid_donation")
    .map((planet) => planet.planet);
  const challengingPlanets = planets
    .filter((planet) => planet.donationMode === "cautious_remedy")
    .map((planet) => planet.planet);

  const neverDonateItems = uniqueItems(
    planetRemedyNarratives
      .filter((remedy) => favourablePlanets.includes(remedy.planet))
      .flatMap((remedy) => remedy.neverDonate)
  );

  const consolidatedNeverDonateLine = favourablePlanets.length
    ? `Navtara favourable: ${favourablePlanets.join(", ")}. Do not casually donate: ${neverDonateItems.join(", ")}.`
    : "No Navtara-favourable priority planet found for never-donate restriction.";

  const donationGuidanceLine = challengingPlanets.length
    ? `Donation/remedy candidates after validation: ${challengingPlanets.join(", ")}. Start with safe daily practice first; use donation only when the planet is clearly stressed.`
    : "No priority planet needs donation by Navtara in this pass; use safe daily practices only.";

  return {
    planets,
    favourablePlanets,
    challengingPlanets,
    consolidatedNeverDonateLine,
    donationGuidanceLine,
  };
}

export function analyzeDashaLevelNavtara(input: DashaRemedyInput): DashaNavtaraSafety[] {
  const levels: Array<{ level: DashaNavtaraSafety["level"]; planet?: Planet }> = [
    { level: "Mahadasha", planet: input.mahadashaPlanet },
    { level: "Antardasha", planet: input.antardashaPlanet },
    { level: "Pratyantardasha", planet: input.pratyantardashaPlanet },
  ];

  return levels.flatMap(({ level, planet }) => {
    if (!planet) return [];
    const nakshatra = input.planetNakshatras?.[planet] || input.moonNakshatra;
    const navtara = getNavtaraTone(input.moonNakshatra, nakshatra);
    const isNaturalMalefic = NATURAL_MALEFICS.has(planet);
    const donationMode: NavtaraPlanetSafety["donationMode"] =
      navtara.tone === "favourable"
        ? "avoid_donation"
        : navtara.tone === "challenging" || isNaturalMalefic
          ? "cautious_remedy"
          : "observe";

    const reason =
      donationMode === "avoid_donation"
        ? `${level} planet ${planet} is in ${navtara.tara} tara, so preserve it and avoid casual donation.`
        : donationMode === "cautious_remedy"
          ? `${level} planet ${planet} is ${navtara.tara} tara or naturally malefic, so use careful validated remedies.`
          : `${level} planet ${planet} is sensitive/neutral by Navtara; observe and prefer soft daily practice.`;

    return [{
      level,
      planet,
      nakshatra,
      tara: navtara.tara,
      tone: navtara.tone,
      donationMode,
      reason,
    }];
  });
}

export function analyzePhase1Remedies(input: DashaRemedyInput): DashaRemedyResult {
  const language = input.language || "hinglish";
  const priorityPlanets = getPriorityPlanets(input);
  const primaryPlanet = priorityPlanets[0] || input.mahadashaPlanet;
  const allRemedies = priorityPlanets.flatMap(getPlanetRemedies);
  const nakshatraTree = getNakshatraTreeRule(input.moonNakshatra);
  const navtaraSafety = analyzeNavtaraRemedySafety(input, priorityPlanets);
  const dashaNavtara = analyzeDashaLevelNavtara(input);

  return {
    activePeriod: input.antardashaPlanet
      ? `${input.mahadashaPlanet} Mahadasha - ${input.antardashaPlanet} Antardasha`
      : `${input.mahadashaPlanet} Mahadasha`,
    priorityPlanets,
    primaryPlanet,
    dashaNavtara,
    dashaNarrative: buildDashaNarrative(input),
    planetRemedies: allRemedies,
    nakshatraTree,
    nakshatraNarrative: buildNakshatraNarrative(nakshatraTree, language),
    safestRemedyPlan: buildSafestRemedyPlan(allRemedies, language),
    highCautionBoundary: buildHighCautionBoundary(language),
    neverDonateWarnings: navtaraSafety.favourablePlanets.length ? [navtaraSafety.consolidatedNeverDonateLine] : [],
    navtaraSafety,
  };
}

export function buildPhase1RemedyReport(input: DashaRemedyInput) {
  const result = analyzePhase1Remedies(input);

  return {
    title: "AstroLife Remedy Intelligence",
    subtitle: "Nakshatra Tree Remedy · Practical Upay · Dasha Timing · Safety Filter",
    activeDasha: result.activePeriod,
    priorityPlanets: result.priorityPlanets,
    primaryPlanet: result.primaryPlanet,
    sections: [
      {
        heading: "Dasha Remedy Timing",
        content: result.dashaNarrative,
      },
      {
        heading: "Safe Practical Remedy Plan",
        content: result.safestRemedyPlan,
      },
      {
        heading: "Nakshatra Tree Remedy",
        content: result.nakshatraNarrative,
      },
      {
        heading: "High-Caution Boundary",
        content: result.highCautionBoundary,
      },
      {
        heading: "Never Donate Warnings",
        content: result.neverDonateWarnings.join("\n"),
      },
    ],
    raw: result,
  };
}

export function buildPhase1RemedyChatContext(input: DashaRemedyInput) {
  const result = analyzePhase1Remedies(input);

  return `
You are AstroLife Remedy AI.

Use this remedy intelligence context:
${JSON.stringify(result, null, 2)}

Rules:
- Speak in ${input.language || "hinglish"}.
- Use soft, supportive, non-fear-based tone.
- Do not promise guaranteed results.
- Do not diagnose disease or prescribe medical treatment.
- Suggest only 1-3 remedies at a time.
- Prioritize safe daily practices before donation, metal, gemstone or 43-day remedies.
- Clearly mention high-caution boundaries.
- Frame nakshatra trees as symbolic ecological/spiritual support, not medical treatment.
`.trim();
}
