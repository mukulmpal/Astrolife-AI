// src/lib/astro-engine/dasha-composer.ts
// AstroLife — Dynamic Mahadasha paragraph composer
// Builds rich 3-paragraph interpretations from planet × house × sign × knowledge bases
// No static lookup tables — all content is composed from signification data

import type { PeriodInterpretation } from "./dasha-interpretations";
import type {
  PlanetHouseRule,
  HomeOmenRule,
  HouseOmenRule,
  CombinationRule,
  RinRule,
} from "./lalkitab-knowledge";

// ─────────────────────────────────────────────────────────────────────────────
// HOUSE SIGNIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
const HOUSE_SIG: Record<number, {
  domain:      string;
  body:        string[];
  life:        string[];
  career_hint: string;
  nature:      string;
}> = {
  1:  { domain: "self, physical body, personality, health, identity and the overall direction of life",           body: ["head", "brain", "face", "skull", "complexion"],                                nature: "the house of the self and life force",        career_hint: "independent work, personal brand, leadership roles",                        life: ["identity", "vitality", "new beginnings", "first impressions", "general health"] },
  2:  { domain: "accumulated wealth, family values, speech, food habits, savings and the right eye",              body: ["face", "mouth", "teeth", "eyes", "throat", "right eye"],                       nature: "the house of wealth and family heritage",     career_hint: "finance, banking, food business, oratory, family enterprise",               life: ["wealth", "speech", "family honour", "savings", "oral expression"] },
  3:  { domain: "courage, communication, younger siblings, media, short travel and self-effort",                  body: ["shoulders", "arms", "hands", "lungs", "throat", "right ear"],                  nature: "the house of courage and self-initiative",    career_hint: "media, writing, sales, marketing, transport, defence",                      life: ["courage", "communication", "siblings", "skills", "networking"] },
  4:  { domain: "home, mother, property, vehicles, emotional happiness and academic foundations",                  body: ["chest", "lungs", "heart", "breast", "stomach upper"],                         nature: "the house of home and emotional roots",       career_hint: "real estate, education, hospitality, agriculture, psychology",              life: ["domestic peace", "property", "mother", "vehicles", "inner happiness"] },
  5:  { domain: "intelligence, children, creativity, romance, past-life merit and speculative gains",             body: ["stomach", "spine upper", "heart", "small intestine"],                         nature: "the house of creativity and past-life blessings", career_hint: "teaching, entertainment, finance, arts, coaching, counselling",           life: ["creativity", "children", "romance", "intuition", "purva punya"] },
  6:  { domain: "enemies, disease, debts, litigation, service, daily routine and competitive struggles",          body: ["intestines", "lower abdomen", "kidneys upper", "appendix"],                   nature: "the house of effort and transformation through challenge", career_hint: "medicine, law, military, administration, service industries",            life: ["overcoming enemies", "health discipline", "debt management", "service"] },
  7:  { domain: "marriage, business partnerships, public dealings, contracts and foreign connections",            body: ["lower abdomen", "kidneys", "urinary tract", "reproductive organs"],             nature: "the house of partnerships and public identity", career_hint: "business, diplomacy, law, public relations, consulting, trade",            life: ["marriage", "partnership", "public image", "contracts", "cooperation"] },
  8:  { domain: "longevity, transformation, inheritance, in-laws, hidden matters and occult knowledge",          body: ["reproductive organs", "anus", "pelvis", "bladder", "colon"],                   nature: "the house of death, rebirth and hidden power",  career_hint: "research, insurance, investigation, surgery, psychology, occult",           life: ["transformation", "inheritance", "hidden knowledge", "in-laws", "longevity"] },
  9:  { domain: "fortune, father, guru, dharma, higher learning, long travel and divine blessings",              body: ["hips", "thighs", "liver", "sciatic nerve"],                                    nature: "the house of luck, dharma and higher wisdom",  career_hint: "law, religion, teaching, publishing, travel, philosophy, diplomacy",        life: ["fortune", "father", "guru", "dharma", "higher education", "blessings"] },
  10: { domain: "career, public status, authority, karma, professional reputation and father's influence",       body: ["knees", "joints", "bones upper back", "skin"],                                nature: "the house of karma and public standing",       career_hint: "government, politics, management, engineering, medicine, authority roles",  life: ["career", "reputation", "public service", "karma", "professional growth"] },
  11: { domain: "gains, fulfillment of desires, elder siblings, social networks and large-scale income",         body: ["calves", "ankles", "left ear", "circulatory system"],                          nature: "the house of gains and social influence",      career_hint: "large organisations, social platforms, politics, investment, networks",     life: ["gains", "wish fulfillment", "networks", "elder siblings", "social influence"] },
  12: { domain: "expenses, foreign land, isolation, moksha, hospitals, hidden enemies and spiritual liberation", body: ["feet", "left eye", "lymphatic system", "sleep-related functions"],             nature: "the house of liberation and hidden losses",    career_hint: "foreign institutions, hospitals, NGOs, research, spiritual work, retreats", life: ["expenses", "foreign travel", "isolation", "spiritual growth", "liberation"] },
};

// ─────────────────────────────────────────────────────────────────────────────
// PLANET SIGNIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
const PLANET_SIG: Record<string, {
  nature:    string;
  yrs:       number;
  governs:   string[];
  body:      string[];
  career:    string[];
  element:   string;
  quality:   string;
  benefic:   boolean;
  shadow:    string;
  strength:  string;
}> = {
  Sun:     { nature: "royal, authoritative, fiery and sattvic",   yrs: 6,  governs: ["father", "government", "authority", "soul", "vitality", "self-confidence", "career recognition"],       body: ["heart", "spine", "right eye", "bones", "skin"],                         career: ["government", "administration", "politics", "medicine", "leadership", "management"],         element: "fire",  quality: "fixed",    benefic: true,  shadow: "ego, pride, domination",               strength: "authority, leadership, clarity and self-confidence" },
  Moon:    { nature: "gentle, watery, changeable and nurturing",   yrs: 10, governs: ["mother", "mind", "emotions", "public life", "liquids", "fertility", "subconscious patterns"],          body: ["mind", "chest", "left eye", "lymph", "reproductive fluids"],            career: ["public service", "hospitality", "healing", "food", "travel", "counselling"],               element: "water", quality: "cardinal",  benefic: true,  shadow: "emotional instability, dependency",    strength: "empathy, intuition, public connection and adaptability" },
  Mars:    { nature: "energetic, fiery, aggressive and rajasic",   yrs: 7,  governs: ["courage", "siblings", "property", "energy", "blood", "accidents", "ambition"],                        body: ["blood", "muscles", "marrow", "head injuries", "inflammation"],          career: ["military", "sports", "surgery", "engineering", "real estate", "startups", "police"],       element: "fire",  quality: "cardinal",  benefic: false, shadow: "aggression, impulsiveness, conflict",  strength: "courage, drive, physical energy and action" },
  Mercury: { nature: "intellectual, communicative, neutral and rajasic", yrs: 17, governs: ["intellect", "speech", "business", "skills", "memory", "logic", "communication"],               body: ["nerves", "skin", "tongue", "hands", "respiratory upper"],               career: ["business", "writing", "software", "teaching", "analytics", "accounting", "trade"],         element: "earth", quality: "mutable",   benefic: true,  shadow: "anxiety, over-analysis, deception",    strength: "intelligence, business acumen, communication and adaptability" },
  Jupiter: { nature: "wise, expansive, optimistic and sattvic",    yrs: 16, governs: ["wisdom", "children", "fortune", "dharma", "teachers", "expansion", "faith"],                          body: ["liver", "fat", "hips", "thighs", "pancreas", "gall bladder"],           career: ["teaching", "law", "consulting", "finance", "religion", "publishing", "advisory"],          element: "fire",  quality: "mutable",   benefic: true,  shadow: "over-optimism, arrogance, excess",     strength: "wisdom, dharma, expansion, guidance and fortune" },
  Venus:   { nature: "charming, artistic, comfort-seeking and rajasic", yrs: 20, governs: ["love", "marriage", "beauty", "luxury", "arts", "women", "pleasure", "comfort"],                 body: ["reproductive organs", "kidneys", "face", "eyes", "sugar", "hormones"],  career: ["arts", "fashion", "entertainment", "luxury", "hospitality", "design", "counselling"],      element: "water", quality: "fixed",    benefic: true,  shadow: "indulgence, attachment, laziness",      strength: "charm, creativity, harmony, relationships and aesthetic sense" },
  Saturn:  { nature: "disciplined, slow, serious and tamasic",     yrs: 19, governs: ["karma", "discipline", "service", "delays", "longevity", "workers", "old age", "restrictions"],       body: ["bones", "joints", "teeth", "knees", "skin diseases", "chronic illness"], career: ["government", "engineering", "administration", "law", "mining", "construction", "labour"],   element: "air",   quality: "cardinal",  benefic: false, shadow: "delay, pessimism, fear, isolation",    strength: "discipline, endurance, patience and long-term mastery" },
  Rahu:    { nature: "ambitious, shadowy, illusion-creating and tamasic", yrs: 18, governs: ["ambition", "foreign matters", "technology", "illusion", "sudden events", "mass influence"],   body: ["nervous system", "toxic conditions", "allergies", "phobias"],           career: ["technology", "media", "politics", "foreign trade", "research", "investigation"],           element: "air",   quality: "fixed",    benefic: false, shadow: "obsession, deception, compulsive desire", strength: "ambition, mass influence, foreign opportunities and innovation" },
  Ketu:    { nature: "detached, spiritual, dry and mixed sattvic-tamasic", yrs: 7, governs: ["detachment", "spirituality", "past karma", "research", "healing", "intuition"],               body: ["nervous disorders", "injuries", "skin", "mysterious illness"],          career: ["research", "healing", "astrology", "spirituality", "occult", "technology backend"],         element: "fire",  quality: "mutable",   benefic: false, shadow: "isolation, detachment, confusion",     strength: "intuition, spiritual depth, research ability and karmic completion" },
};

// ─────────────────────────────────────────────────────────────────────────────
// RASHI (SIGN) SIGNIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
const RASHI_SIG: Record<string, {
  lord:     string;
  element:  string;
  quality:  string;
  nature:   string;
  keywords: string[];
}> = {
  Aries:       { lord: "Mars",    element: "fire",  quality: "cardinal", nature: "aggressive, pioneering, energetic and self-motivated",          keywords: ["leadership", "initiative", "courage", "action", "independence"] },
  Taurus:      { lord: "Venus",   element: "earth", quality: "fixed",    nature: "stable, patient, comfort-seeking and accumulative",             keywords: ["stability", "luxury", "patience", "accumulation", "sensuality"] },
  Gemini:      { lord: "Mercury", element: "air",   quality: "mutable",  nature: "intellectual, communicative, dual and versatile",               keywords: ["communication", "intellect", "duality", "networking", "curiosity"] },
  Cancer:      { lord: "Moon",    element: "water", quality: "cardinal", nature: "nurturing, emotional, protective and home-loving",              keywords: ["nurturing", "emotions", "home", "protection", "intuition"] },
  Leo:         { lord: "Sun",     element: "fire",  quality: "fixed",    nature: "authoritative, proud, creative and charismatic",                keywords: ["authority", "pride", "creativity", "generosity", "self-expression"] },
  Virgo:       { lord: "Mercury", element: "earth", quality: "mutable",  nature: "analytical, service-oriented, detail-conscious and perfectionist", keywords: ["analysis", "service", "precision", "health-consciousness", "discernment"] },
  Libra:       { lord: "Venus",   element: "air",   quality: "cardinal", nature: "balanced, diplomatic, partnership-oriented and aesthetic",       keywords: ["balance", "diplomacy", "partnerships", "beauty", "justice"] },
  Scorpio:     { lord: "Mars",    element: "water", quality: "fixed",    nature: "intense, secretive, transformative and deeply perceptive",       keywords: ["transformation", "intensity", "secrets", "power", "depth"] },
  Sagittarius: { lord: "Jupiter", element: "fire",  quality: "mutable",  nature: "philosophical, expansive, truth-seeking and adventurous",        keywords: ["philosophy", "expansion", "truth", "adventure", "higher wisdom"] },
  Capricorn:   { lord: "Saturn",  element: "earth", quality: "cardinal", nature: "disciplined, ambitious, structured and achievement-oriented",    keywords: ["discipline", "ambition", "structure", "persistence", "authority"] },
  Aquarius:    { lord: "Saturn",  element: "air",   quality: "fixed",    nature: "innovative, humanitarian, detached and forward-thinking",        keywords: ["innovation", "humanitarian ideals", "detachment", "networks", "originality"] },
  Pisces:      { lord: "Jupiter", element: "water", quality: "mutable",  nature: "spiritual, compassionate, intuitive and dissolution-seeking",   keywords: ["spirituality", "compassion", "intuition", "dreams", "liberation"] },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function ord(n: number): string {
  return n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
}

function dignityPhrase(dignity: string | undefined, planet: string): string {
  if (!dignity) return "";
  if (dignity.toLowerCase().includes("exalt"))
    return `${planet} is in exaltation in your chart, which powerfully amplifies the positive themes of this Mahadasha and gives the native added strength to manifest results in all life areas. `;
  if (dignity.toLowerCase().includes("debil"))
    return `${planet} is in debilitation, indicating that the native must work consciously to overcome challenges in areas governed by this planet. The period still yields results but requires greater effort, patience and self-correction. `;
  if (dignity.toLowerCase().includes("own") || dignity.toLowerCase().includes("mool"))
    return `${planet} occupies its own sign, lending stability and reliability to the themes of this Mahadasha. The planet's natural qualities operate without obstruction, making this a period of consistent and sustainable progress. `;
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAGRAPH 1 — VEDIC ANALYSIS
// Merges: planet nature + house domain + sign energy + MD_TABLE interpretation
// ─────────────────────────────────────────────────────────────────────────────
export function composeVedicParagraph(
  planet:   string,
  house:    number,
  sign:     string,
  yrs:      number,
  interp:   PeriodInterpretation,
  dignity?: string
): string {
  const ps = PLANET_SIG[planet] ?? PLANET_SIG["Sun"];
  const hs = HOUSE_SIG[house]   ?? HOUSE_SIG[1];
  const rs = RASHI_SIG[sign];

  const signDesc = rs
    ? `${sign} — a ${rs.element} sign of ${rs.quality} quality, known for its ${rs.nature} energy — `
    : `${sign} — `;

  let para =
    `${planet} Mahadasha, spanning ${yrs} years, places the focus of your life on the ${ord(house)} house: the domain of ${hs.domain}. ` +
    `${planet} is a ${ps.nature} planet that governs ${ps.governs.slice(0, 5).join(", ")} in Vedic astrology. ` +
    `Placed in ${signDesc}${planet} channels the energy of ${rs ? rs.keywords.slice(0, 2).join(" and ") : "its sign"} into the themes of this house throughout the entire period. `;

  para += dignityPhrase(dignity, planet);

  para +=
    `${interp.overview} ` +
    `On the physical and health front, ${interp.health.charAt(0).toLowerCase() + interp.health.slice(1)} ` +
    `The body parts governed by the ${ord(house)} house — ${hs.body.slice(0, 4).join(", ")} — merit particular attention during this period, and timely preventive care will be rewarded. `;

  para +=
    `Professionally and financially, ${interp.career.charAt(0).toLowerCase() + interp.career.slice(1)} ` +
    `Fields particularly supported by ${planet}'s natural significations in this position include ${ps.career.slice(0, 4).join(", ")}. `;

  para +=
    `In matters of family, home and relationships, ${interp.family.charAt(0).toLowerCase() + interp.family.slice(1)} `;

  para +=
    `${interp.travel} ` +
    `${interp.education} ` +
    `The core strength of this Mahadasha, if consciously cultivated, is ${ps.strength.toLowerCase()}. ` +
    `The primary inner challenge to overcome is the shadow tendency of ${ps.shadow.toLowerCase()}.`;

  return para;
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAGRAPH 2 — LAL KITAB ANALYSIS
// Merges: LK core + money + marriage + family + remedies
// ─────────────────────────────────────────────────────────────────────────────
export function composeLKParagraph(
  planet:  string,
  house:   number,
  sign:    string,
  yrs:     number,
  lkRule?: PlanetHouseRule
): string {
  const rs = RASHI_SIG[sign];
  const signNote = rs
    ? ` The ${rs.element} nature of ${sign} adds a ${rs.keywords[0]} and ${rs.keywords[1] ?? rs.keywords[0]} quality to how Lal Kitab reads this placement.`
    : "";

  if (!lkRule) {
    return `From a Lal Kitab perspective, ${planet} in the ${ord(house)} house over ${yrs} years calls for sincere observance of ethical conduct, respect for elders and family, and consistent upay practices.${signNote} The native is advised to maintain clarity in financial dealings and honour commitments in personal relationships throughout this period.`;
  }

  return (
    `From a Lal Kitab perspective, ${planet} placed in the ${ord(house)} house carries the following karmic significance during this ${yrs}-year period: ${lkRule.core}${signNote} ` +
    `In terms of wealth, livelihood and financial karma, the period indicates: ${lkRule.money} ` +
    `The marriage and partnership themes that are likely to surface are: ${lkRule.marriage} ` +
    `Family karmas highlighted during this Mahadasha include: ${lkRule.family} ` +
    `The physical home environment indicators associated with this planetary placement are: ${lkRule.homeEnvironment.join(", ")}. ` +
    `To bring the energy of this Mahadasha into balance, Lal Kitab prescribes the following upay: ${lkRule.remedies.join("; ")}.`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAGRAPH 3 — OMENS, PSYCHOLOGY, COMBINATIONS & KARMIC DEBT
// Merges: LK psychology + home zone + omen signs + combos + rin
// ─────────────────────────────────────────────────────────────────────────────
export function composePsychOmenParagraph(
  planet:       string,
  house:        number,
  lkRule?:      PlanetHouseRule,
  homeOmen?:    HomeOmenRule,
  houseZone?:   HouseOmenRule,
  combos:       CombinationRule[] = [],
  rins:         RinRule[]        = []
): string {
  const ps = PLANET_SIG[planet] ?? PLANET_SIG["Sun"];
  let para = "";

  // Psychology
  if (lkRule?.psychology) {
    para +=
      `The dominant psychological tendency during ${planet} Mahadasha is: ${lkRule.psychology} ` +
      `Understanding this inner pattern empowers the native to make conscious decisions rather than reactive ones, especially in relationships, career and financial matters where this shadow can quietly sabotage progress. `;
  } else {
    para +=
      `The dominant inner quality activated during this period is ${ps.quality.toLowerCase()} — a ${ps.nature.toLowerCase()} energy that shapes decisions, relationships and self-perception throughout these ${ps.yrs} years. `;
  }

  // Home zone + omens
  if (houseZone) {
    para +=
      `The home zone connected to the ${ord(house)} house is the ${houseZone.zone}. ` +
      `This area acts as an environmental mirror for the Mahadasha's energy: ${houseZone.meaning} `;
  }
  if (homeOmen) {
    para +=
      `During ${planet} Mahadasha, watch for the following environmental signs around your home and daily life: ${homeOmen.signs.join(", ")}. ` +
      `Lal Kitab reads these indicators as a signal of ${homeOmen.meaning.toLowerCase()} ` +
      `Corrective actions to restore balance: ${homeOmen.correction.join("; ")}. `;
  }

  // Planetary combinations (max 2, most relevant)
  if (combos.length > 0) {
    para += `Planetary combination patterns in the natal chart that further colour the psychology and outcomes of this Mahadasha: `;
    para += combos.slice(0, 2).map(c =>
      `${c.title} creates a pattern of "${c.prediction}" — the inner psychological dynamic being "${c.psychology}". Key strength to leverage: ${c.strengths[0] ?? "focused effort"}; key risk to manage: ${c.risks[0] ?? "overextension"}.`
    ).join(" Additionally, ");
    para += " ";
  }

  // Karmic debt (rin)
  if (rins.length > 0) {
    para += `Karmic debt awareness for this period — `;
    para += rins.map(r =>
      `${r.debtType} (linked to ${r.familyLink}): ${r.karmicMeaning} ` +
      `Symptoms that may surface during this Mahadasha include: ${r.symptoms.join(", ")}. ` +
      `The correction path is: ${r.correction.join("; ")}.`
    ).join(" ");
  }

  return para.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// UPCOMING MAHADASHA — SINGLE MERGED PARAGRAPH (half page)
// ─────────────────────────────────────────────────────────────────────────────
export function composeUpcomingMDParagraph(
  planet:    string,
  house:     number,
  sign:      string,
  yrs:       number,
  startYear: number,
  endYear:   number,
  interp:    PeriodInterpretation,
  lkRule?:   PlanetHouseRule,
  dignity?:  string
): string {
  const ps = PLANET_SIG[planet] ?? PLANET_SIG["Sun"];
  const hs = HOUSE_SIG[house]   ?? HOUSE_SIG[1];
  const rs = RASHI_SIG[sign];

  let para =
    `${planet} Mahadasha (${startYear}–${endYear}), spanning ${yrs} years, will activate the themes of your ${ord(house)} house — the domain of ${hs.domain}. ` +
    `${planet}, a ${ps.nature} planet, placed in ${sign ?? "your chart"}${rs ? ` (a ${rs.element} sign known for ${rs.nature})` : ""}, brings a flavour of ${rs ? rs.keywords.slice(0, 2).join(" and ") : "its essential nature"} to the affairs of this house. `;

  para += dignityPhrase(dignity, planet);

  para +=
    `${interp.overview} ` +
    `Health areas to monitor: ${interp.health.charAt(0).toLowerCase() + interp.health.slice(1)} ` +
    `On the career and financial front: ${interp.career.charAt(0).toLowerCase() + interp.career.slice(1)} ` +
    `Family and relationship themes: ${interp.family.charAt(0).toLowerCase() + interp.family.slice(1)} `;

  if (lkRule) {
    para +=
      `From a Lal Kitab perspective, this placement indicates: ${lkRule.core} ` +
      `Financial karma: ${lkRule.money} ` +
      `To align with this period's energy, the following upay are recommended: ${lkRule.remedies.join("; ")}.`;
  }

  return para;
}
