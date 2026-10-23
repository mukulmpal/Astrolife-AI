// ============================================================
// ASTROLIFE RELATIONSHIP INTELLIGENCE ENGINE
// Marriage Promise · Ashtakoot Integration · Children Awareness
// KP Validation · Relationship Psychology · Dasha Timing
// Soft, non-fear-based, non-deterministic tone
// ============================================================

export type Language = "hinglish" | "hindi" | "english";
export type Planet =
  | "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter"
  | "Venus" | "Saturn" | "Rahu" | "Ketu";

export type PlanetPlacement = {
  planet: Planet;
  house: number;
  sign?: string;
  nakshatra?: string;
  strength?: number;
  isAfflicted?: boolean;
  isRetrograde?: boolean;
  isCombust?: boolean;
};

export type HouseInfo = {
  house: number;
  lord?: Planet;
  sign?: string;
  strength?: number;
  hasMaleficInfluence?: boolean;
  hasBeneficInfluence?: boolean;
};

export type DashaInfo = {
  mahadasha: Planet;
  antardasha?: Planet;
  pratyantardasha?: Planet;
};

export type KPInfo = {
  significators?: {
    marriage?: number[];
    children?: number[];
    career?: number[];
    foreign?: number[];
  };
  seventhCuspSubLord?: Planet;
  fifthCuspSubLord?: Planet;
  secondCuspSubLord?: Planet;
  eleventhCuspSubLord?: Planet;
};

export type AshtakootInput = {
  totalScore: number;
  varna?: number;
  vashya?: number;
  tara?: number;
  yoni?: number;
  grahaMaitri?: number;
  gana?: number;
  bhakoot?: number;
  nadi?: number;
  hasNadiDosha?: boolean;
  hasBhakootDosha?: boolean;
  hasGanaIssue?: boolean;
  brideNakshatra?: string;
  groomNakshatra?: string;
  brideRashi?: string;
  groomRashi?: string;
};

export type RelationshipInput = {
  language?: Language;
  planets: PlanetPlacement[];
  houses: HouseInfo[];
  navamshaPlanets?: PlanetPlacement[];
  dasha?: DashaInfo;
  kp?: KPInfo;
  ashtakoot?: AshtakootInput;
  manglik?: {
    nativeManglik?: boolean;
    partnerManglik?: boolean;
    balanced?: boolean;
    severity?: "none" | "mild" | "medium" | "strong";
  };
};

export type IntelligenceScore = {
  score: number;
  label: "supportive" | "mixed_supportive" | "needs_patience" | "needs_careful_handling";
  paragraph: string;
};

export interface RelationshipResult {
  system: string;
  marriageScore: number;
  marriageLabel: IntelligenceScore["label"];
  marriageNarrative: string;
  childrenScore: number;
  childrenNarrative: string;
  layers: {
    marriagePromise: IntelligenceScore;
    ashtakootCompatibility: IntelligenceScore;
    relationshipPsychology: IntelligenceScore;
    kpMarriageValidation: IntelligenceScore;
    marriageTimingSupport: IntelligenceScore;
    manglikBalance: IntelligenceScore;
    childrenAwareness: IntelligenceScore;
    kpChildrenValidation: IntelligenceScore;
  };
  safeRelationshipRemedies: string;
  safetyBoundary: string;
}

// ── Helpers ─────────────────────────────────────────────────

function getPlanet(input: RelationshipInput, planet: Planet) {
  return input.planets.find((p) => p.planet === planet);
}

function getHouse(input: RelationshipInput, house: number) {
  return input.houses.find((h) => h.house === house);
}

function planetInHouses(input: RelationshipInput, houses: number[]) {
  return input.planets.filter((p) => houses.includes(p.house));
}

function hasPlanetInHouse(input: RelationshipInput, planet: Planet, house: number) {
  return input.planets.some((p) => p.planet === planet && p.house === house);
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function labelFromScore(score: number): IntelligenceScore["label"] {
  if (score >= 76) return "supportive";
  if (score >= 58) return "mixed_supportive";
  if (score >= 40) return "needs_patience";
  return "needs_careful_handling";
}

function scoreParagraph(score: number, area: string, language: Language) {
  const label = labelFromScore(score);

  if (language === "hindi") {
    if (label === "supportive") return `${area} कुल मिलाकर सहायक दिखता है। इसका अर्थ यह नहीं कि सब कुछ अपने-आप होगा, बल्कि सही समय, परिपक्वता और ईमानदार प्रयास से यह क्षेत्र अच्छा बन सकता है।`;
    if (label === "mixed_supportive") return `${area} मिश्रित लेकिन संभालने योग्य दिखता है। इसमें सहयोग भी है और सीख भी, इसलिए संवाद, धैर्य और सही timing महत्वपूर्ण हैं।`;
    if (label === "needs_patience") return `${area} में धैर्य और conscious effort की जरूरत हो सकती है। इसे नकारात्मक भविष्यवाणी नहीं, बल्कि growth area की तरह देखना चाहिए।`;
    return `${area} को सावधानी और परिपक्वता से संभालने की जरूरत है। इसका उद्देश्य डर पैदा करना नहीं है, बल्कि सही समझ और सुरक्षित दिशा देना है।`;
  }

  if (language === "english") {
    if (label === "supportive") return `${area} looks broadly supportive. This does not mean everything happens automatically, but the chart shows enough harmony to build this area with maturity, timing and sincere effort.`;
    if (label === "mixed_supportive") return `${area} appears mixed but workable. There may be both support and learning patterns, so practical communication, patience and correct timing become important.`;
    if (label === "needs_patience") return `${area} may require patience and conscious effort. The indication should be treated as a growth area rather than a negative prediction.`;
    return `${area} needs careful handling. The purpose is not to create fear, but to highlight where maturity, professional guidance where needed, and supportive practices can help.`;
  }

  // Hinglish default
  if (label === "supportive") return `${area} overall supportive dikh raha hai. Iska matlab automatic perfection nahi hai, but chart me harmony build karne ki capacity achchi hai agar maturity, timing aur sincere effort ho.`;
  if (label === "mixed_supportive") return `${area} mixed but workable dikh raha hai. Support bhi hai aur learning pattern bhi, isliye communication, patience aur right timing important rahenge.`;
  if (label === "needs_patience") return `${area} me patience aur conscious effort ki zarurat ho sakti hai. Isko negative prediction nahi, growth area ki tarah read karna chahiye.`;
  return `${area} ko careful handling chahiye. Purpose fear create karna nahi hai; purpose ye batana hai ki maturity, safe practices aur zarurat padne par professional guidance help kar sakti hai.`;
}

// ── Marriage Promise ────────────────────────────────────────

export function analyzeMarriagePromise(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const seventh = getHouse(input, 7);
  const venus = getPlanet(input, "Venus");
  const jupiter = getPlanet(input, "Jupiter");
  const seventhPlanets = planetInHouses(input, [7]);

  let score = 50;

  if (seventh?.hasBeneficInfluence) score += 12;
  if (seventh?.strength && seventh.strength >= 60) score += 10;
  if (venus?.strength && venus.strength >= 60) score += 10;
  if (jupiter?.strength && jupiter.strength >= 60) score += 8;
  if (seventhPlanets.some((p) => ["Venus", "Jupiter", "Moon", "Mercury"].includes(p.planet))) score += 8;

  if (seventh?.hasMaleficInfluence) score -= 10;
  if (venus?.isAfflicted) score -= 10;
  if (hasPlanetInHouse(input, "Rahu", 7) || hasPlanetInHouse(input, "Ketu", 7)) score -= 6;
  if (hasPlanetInHouse(input, "Saturn", 7)) score -= 5;
  if (hasPlanetInHouse(input, "Mars", 7)) score -= 6;

  score = clamp(score);

  const base = scoreParagraph(score, "Marriage promise", language);
  const extra = language === "english"
    ? "Marriage promise is judged through the 7th house, 7th lord, Venus, Jupiter, Navamsha and supportive timing. A lower score does not deny marriage; it simply means the relationship area needs better timing, emotional maturity and careful partner selection."
    : language === "hindi"
      ? "Marriage promise को 7th house, 7th lord, Venus, Jupiter, Navamsha और supportive timing से देखा जाता है। कम score marriage denial नहीं है; इसका अर्थ है कि संबंध क्षेत्र में सही समय, भावनात्मक परिपक्वता और partner selection पर ध्यान देना होगा।"
      : "Marriage promise ko 7th house, 7th lord, Venus, Jupiter, Navamsha aur supportive timing se judge karna chahiye. Low score marriage denial nahi hota; iska matlab relationship area me right timing, emotional maturity aur partner selection important hai.";

  return { score, label: labelFromScore(score), paragraph: `${base} ${extra}` };
}

// ── Ashtakoot Integration ───────────────────────────────────

export function analyzeAshtakootCompatibility(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const a = input.ashtakoot;

  if (!a) {
    return {
      score: 50,
      label: "mixed_supportive",
      paragraph: language === "english"
        ? "Ashtakoot data is not available, so compatibility should be judged through chart promise, Navamsha, dasha and KP validation instead of score-based matching alone."
        : language === "hindi"
          ? "Ashtakoot data उपलब्ध नहीं है, इसलिए compatibility को केवल score से नहीं बल्कि chart promise, Navamsha, dasha और KP validation से देखना चाहिए।"
          : "Ashtakoot data available nahi hai, isliye compatibility ko sirf score se nahi balki chart promise, Navamsha, dasha aur KP validation se judge karna chahiye.",
    };
  }

  const percent = clamp((a.totalScore / 36) * 100);
  let score = percent;

  if (a.hasNadiDosha) score -= 10;
  if (a.hasBhakootDosha) score -= 8;
  if (a.hasGanaIssue) score -= 4;

  score = clamp(score);

  const base = scoreParagraph(score, "Ashtakoot compatibility", language);
  const detail = language === "english"
    ? `The Ashtakoot score is ${a.totalScore}/36. Ashtakoot shows emotional, social, instinctive and traditional compatibility, but it should not be treated as the final marriage verdict. A good score supports comfort and adjustment, while a lower score asks for deeper chart validation, communication maturity and practical compatibility checks.`
    : language === "hindi"
      ? `Ashtakoot score ${a.totalScore}/36 है। Ashtakoot emotional, social, instinctive और traditional compatibility दिखाता है, लेकिन इसे final marriage verdict नहीं मानना चाहिए।`
      : `Ashtakoot score ${a.totalScore}/36 hai. Ashtakoot emotional, social, instinctive aur traditional compatibility dikhata hai, but ise final marriage verdict nahi maanna chahiye. Achcha score comfort aur adjustment support karta hai, low score deeper chart validation aur practical compatibility ki need batata hai.`;

  const dosha = (a.hasNadiDosha || a.hasBhakootDosha)
    ? language === "english"
      ? " Nadi or Bhakoot concerns should be handled carefully, but they should be cross-checked with full chart strength, dasha, and actual relationship maturity."
      : language === "hindi"
        ? " Nadi या Bhakoot concern को सावधानी से देखना चाहिए, लेकिन इसे full chart strength, dasha और actual maturity से cross-check करना चाहिए।"
        : " Nadi ya Bhakoot concern ko carefully dekhna chahiye, but full chart strength, dasha aur actual maturity se cross-check karna zaruri hai."
    : "";

  return { score, label: labelFromScore(score), paragraph: `${base} ${detail}${dosha}` };
}

// ── Relationship Psychology ─────────────────────────────────

export function analyzeRelationshipPsychology(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const venus = getPlanet(input, "Venus");
  const moon = getPlanet(input, "Moon");
  const mars = getPlanet(input, "Mars");
  const rahu = getPlanet(input, "Rahu");
  const saturn = getPlanet(input, "Saturn");

  let score = 65;

  if (venus?.isAfflicted) score -= 10;
  if (moon?.isAfflicted) score -= 8;
  if (mars && [1, 4, 7, 8, 12].includes(mars.house)) score -= 5;
  if (rahu && [1, 5, 7, 8, 12].includes(rahu.house)) score -= 5;
  if (saturn && [1, 7, 8, 12].includes(saturn.house)) score -= 5;

  if (venus?.strength && venus.strength >= 65) score += 8;
  if (moon?.strength && moon.strength >= 65) score += 6;
  if (getHouse(input, 7)?.hasBeneficInfluence) score += 6;

  score = clamp(score);

  const base = scoreParagraph(score, "Relationship psychology", language);
  const detail = language === "english"
    ? "Relationship psychology is understood through Moon for emotional rhythm, Venus for affection and values, Mars for anger and passion, Saturn for patience and fear, and Rahu-Ketu for attraction, detachment and karmic extremes. The purpose is not to blame any planet, but to understand repeated patterns and improve communication."
    : language === "hindi"
      ? "Relationship psychology में Moon emotional rhythm, Venus affection और values, Mars anger और passion, Saturn patience और fear, तथा Rahu-Ketu attraction, detachment और karmic extremes दिखाते हैं। उद्देश्य किसी ग्रह को blame करना नहीं, बल्कि repeated patterns समझकर communication सुधारना है।"
      : "Relationship psychology me Moon emotional rhythm, Venus affection aur values, Mars anger aur passion, Saturn patience aur fear, aur Rahu-Ketu attraction, detachment aur karmic extremes dikhate hain. Purpose kisi planet ko blame karna nahi, repeated patterns samajhkar communication improve karna hai.";

  return { score, label: labelFromScore(score), paragraph: `${base} ${detail}` };
}

// ── KP Validation ───────────────────────────────────────────

export function kpSupportScore(houses: number[] | undefined, required: number[], negative: number[] = []) {
  if (!houses || !houses.length) return 50;
  let score = 50;
  const unique = [...new Set(houses)];
  required.forEach((h) => { if (unique.includes(h)) score += 14; });
  negative.forEach((h) => { if (unique.includes(h)) score -= 10; });
  return clamp(score);
}

export function analyzeKPMarriage(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const houses = input.kp?.significators?.marriage;
  const score = kpSupportScore(houses, [2, 7, 11], [6, 8, 12]);

  const base = scoreParagraph(score, "KP marriage validation", language);
  const detail = language === "english"
    ? "KP validation works as an event confirmation layer. For marriage, 2nd house supports family formation, 7th house supports partnership, and 11th house supports fulfilment. If 6th, 8th or 12th dominate, the event may need more patience, clearer communication or better timing."
    : language === "hindi"
      ? "KP validation event confirmation layer की तरह काम करता है। Marriage के लिए 2nd house family formation, 7th house partnership और 11th house fulfilment को support करता है।"
      : "KP validation event confirmation layer ki tarah kaam karta hai. Marriage ke liye 2nd house family formation, 7th house partnership aur 11th house fulfilment support karta hai. Agar 6th, 8th ya 12th dominate karein, to patience, clear communication aur better timing ki zarurat ho sakti hai.";

  return { score, label: labelFromScore(score), paragraph: `${base} ${detail}` };
}

export function analyzeKPChildren(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const houses = input.kp?.significators?.children;
  const score = kpSupportScore(houses, [2, 5, 11], [1, 4, 10, 6, 8, 12]);

  const base = scoreParagraph(score, "KP children validation", language);
  const detail = language === "english"
    ? "For children-related matters, KP observes 2nd house for family expansion, 5th house for children, and 11th house for fulfilment. Challenging houses do not deny outcomes by themselves; they simply show that timing, care and practical support may be important."
    : language === "hindi"
      ? "Children-related matters में KP 2nd house को family expansion, 5th house को children और 11th house को fulfilment से जोड़ता है। Challenging houses अपने-आप denial नहीं करते; वे केवल timing, care और practical support की जरूरत दिखाते हैं।"
      : "Children-related matters me KP 2nd house ko family expansion, 5th house ko children aur 11th house ko fulfilment se connect karta hai. Challenging houses apne-aap denial nahi dete; wo sirf timing, care aur practical support ki need dikhate hain.";

  return { score, label: labelFromScore(score), paragraph: `${base} ${detail}` };
}

// ── Children Awareness ──────────────────────────────────────

export function analyzeChildrenAwareness(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const fifth = getHouse(input, 5);
  const jupiter = getPlanet(input, "Jupiter");
  const fifthPlanets = planetInHouses(input, [5]);

  let score = 50;

  if (fifth?.hasBeneficInfluence) score += 12;
  if (fifth?.strength && fifth.strength >= 60) score += 10;
  if (jupiter?.strength && jupiter.strength >= 60) score += 12;
  if (fifthPlanets.some((p) => ["Jupiter", "Venus", "Moon", "Mercury"].includes(p.planet))) score += 8;

  if (fifth?.hasMaleficInfluence) score -= 10;
  if (jupiter?.isAfflicted) score -= 10;
  if (fifthPlanets.some((p) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(p.planet))) score -= 8;

  const kp = analyzeKPChildren(input);
  score = clamp(Math.round((score + kp.score) / 2));

  const base = scoreParagraph(score, "Children awareness", language);
  const detail = language === "english"
    ? "Children awareness is read through the 5th house, 5th lord, Jupiter, Saptamsha if available, dasha and KP 2-5-11 validation. This engine does not predict medical outcomes. It only highlights whether children-related matters may need patience, supportive timing and practical care."
    : language === "hindi"
      ? "Children awareness को 5th house, 5th lord, Jupiter, Saptamsha, dasha और KP 2-5-11 validation से देखा जाता है। यह engine medical outcome की prediction नहीं करता। यह केवल बताता है कि children-related matters में patience, supportive timing और practical care की जरूरत हो सकती है।"
      : "Children awareness ko 5th house, 5th lord, Jupiter, Saptamsha, dasha aur KP 2-5-11 validation se read kiya jata hai. Ye engine medical outcome predict nahi karta. Ye sirf batata hai ki children-related matters me patience, supportive timing aur practical care ki zarurat ho sakti hai.";

  return { score, label: labelFromScore(score), paragraph: `${base} ${detail}` };
}

// ── Dasha Timing for Marriage ───────────────────────────────

export function analyzeMarriageTimingSupport(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const dasha = input.dasha;

  if (!dasha) {
    return {
      score: 50,
      label: "mixed_supportive",
      paragraph: language === "english"
        ? "Dasha data is not available, so marriage timing should be treated as open. A complete timing analysis needs Mahadasha, Antardasha and transits."
        : language === "hindi"
          ? "Dasha data उपलब्ध नहीं है, इसलिए marriage timing को open रखना चाहिए। Complete timing analysis के लिए Mahadasha, Antardasha और transits चाहिए।"
          : "Dasha data available nahi hai, isliye marriage timing ko open rakhna chahiye. Complete timing analysis ke liye Mahadasha, Antardasha aur transits chahiye.",
    };
  }

  const marriagePlanets: Planet[] = ["Venus", "Jupiter", "Moon", "Mercury"];
  const delayPlanets: Planet[] = ["Saturn", "Rahu", "Ketu", "Mars"];

  let score = 50;

  if (marriagePlanets.includes(dasha.mahadasha)) score += 12;
  if (dasha.antardasha && marriagePlanets.includes(dasha.antardasha)) score += 14;

  if (delayPlanets.includes(dasha.mahadasha)) score -= 4;
  if (dasha.antardasha && delayPlanets.includes(dasha.antardasha)) score -= 3;

  if (dasha.mahadasha === "Venus" || dasha.antardasha === "Venus") score += 8;
  if (dasha.mahadasha === "Jupiter" || dasha.antardasha === "Jupiter") score += 6;

  score = clamp(score);

  const dashaStr = `${dasha.mahadasha}${dasha.antardasha ? `-${dasha.antardasha}` : ""}`;
  const base = scoreParagraph(score, "Marriage timing support", language);
  const detail = language === "english"
    ? `Current dasha is ${dashaStr}. Marriage timing becomes stronger when the active planets connect with 2nd, 7th or 11th house, Venus, Jupiter, Navamsha or KP marriage significators. If the period is more karmic or slow, it may still support relationship learning rather than immediate formalization.`
    : language === "hindi"
      ? `Current dasha ${dashaStr} है। Marriage timing तब strong होती है जब active planets 2nd, 7th या 11th house, Venus, Jupiter, Navamsha या KP marriage significators से जुड़ें।`
      : `Current dasha ${dashaStr} hai. Marriage timing tab strong hoti hai jab active planets 2nd, 7th ya 11th house, Venus, Jupiter, Navamsha ya KP marriage significators se connect karein. Agar period karmic ya slow ho, to ye immediate formalization ke bajay relationship learning bhi de sakta hai.`;

  return { score, label: labelFromScore(score), paragraph: `${base} ${detail}` };
}

// ── Manglik Balance ─────────────────────────────────────────

export function analyzeManglikBalance(input: RelationshipInput): IntelligenceScore {
  const language = input.language || "hinglish";
  const m = input.manglik;

  if (!m) {
    return {
      score: 60,
      label: "mixed_supportive",
      paragraph: language === "english"
        ? "Manglik data is not available. Mars-related relationship patterns should be judged through Mars placement, 7th house, Navamsha, Ashtakoot and practical temperament."
        : language === "hindi"
          ? "Manglik data उपलब्ध नहीं है। Mars-related relationship patterns को Mars placement, 7th house, Navamsha, Ashtakoot और practical temperament से देखना चाहिए।"
          : "Manglik data available nahi hai. Mars-related relationship patterns ko Mars placement, 7th house, Navamsha, Ashtakoot aur practical temperament se dekhna chahiye.",
    };
  }

  let score = 70;

  if (m.nativeManglik && !m.partnerManglik && !m.balanced) score -= 12;
  if (m.nativeManglik && m.partnerManglik) score += 8;
  if (m.balanced) score += 10;
  if (m.severity === "strong") score -= 8;
  if (m.severity === "mild") score -= 2;

  score = clamp(score);

  const base = scoreParagraph(score, "Mars/Manglik balance", language);
  const detail = language === "english"
    ? "Manglik analysis should not be used to create fear. It mainly shows how anger, passion, independence, family pressure and conflict style may operate in marriage. If balanced by both charts or softened by maturity, it can become courage and loyalty rather than conflict."
    : language === "hindi"
      ? "Manglik analysis को डर पैदा करने के लिए नहीं इस्तेमाल करना चाहिए। यह मुख्य रूप से anger, passion, independence, family pressure और conflict style दिखाता है। यदि दोनों charts से balance हो या maturity से soften हो, तो यह conflict के बजाय courage और loyalty बन सकता है।"
      : "Manglik analysis ko fear create karne ke liye use nahi karna chahiye. Ye mainly anger, passion, independence, family pressure aur conflict style dikhata hai. Agar dono charts se balance ho ya maturity se soften ho, to ye conflict ke bajay courage aur loyalty ban sakta hai.";

  return { score, label: labelFromScore(score), paragraph: `${base} ${detail}` };
}

// ── Main Combined Engine ────────────────────────────────────

export function analyzeRelationshipIntelligence(input: RelationshipInput): RelationshipResult {
  const language = input.language || "hinglish";

  const marriagePromise = analyzeMarriagePromise(input);
  const ashtakoot = analyzeAshtakootCompatibility(input);
  const psychology = analyzeRelationshipPsychology(input);
  const kpMarriage = analyzeKPMarriage(input);
  const timing = analyzeMarriageTimingSupport(input);
  const manglik = analyzeManglikBalance(input);
  const children = analyzeChildrenAwareness(input);
  const kpChildren = analyzeKPChildren(input);

  const marriageScore = clamp(
    Math.round(
      marriagePromise.score * 0.24 +
      ashtakoot.score * 0.18 +
      psychology.score * 0.14 +
      kpMarriage.score * 0.2 +
      timing.score * 0.16 +
      manglik.score * 0.08
    )
  );

  const childrenScore = clamp(Math.round(children.score * 0.65 + kpChildren.score * 0.35));

  const finalMarriageLabel = labelFromScore(marriageScore);

  const finalMarriageParagraph = language === "english"
    ? `Final marriage intelligence score is ${marriageScore}/100. This score combines marriage promise, Ashtakoot compatibility, relationship psychology, KP validation, dasha timing and Mars/Manglik balance. It should not be treated as a fixed verdict. A strong score shows ease and support; a mixed score shows workability with maturity; a lower score means the relationship area needs patience, timing and conscious partner selection.`
    : language === "hindi"
      ? `Final marriage intelligence score ${marriageScore}/100 है। यह score marriage promise, Ashtakoot compatibility, relationship psychology, KP validation, dasha timing और Mars/Manglik balance को combine करता है। इसे fixed verdict नहीं मानना चाहिए।`
      : `Final marriage intelligence score ${marriageScore}/100 hai. Ye score marriage promise, Ashtakoot compatibility, relationship psychology, KP validation, dasha timing aur Mars/Manglik balance ko combine karta hai. Isko fixed verdict nahi maanna chahiye. Strong score ease aur support dikhata hai; mixed score maturity ke saath workability dikhata hai; lower score patience, timing aur conscious partner selection ki need batata hai.`;

  const finalChildrenParagraph = language === "english"
    ? `Children awareness score is ${childrenScore}/100. This is not a medical or fertility prediction. It only combines 5th house, Jupiter, supportive timing and KP 2-5-11 logic to understand whether children-related matters look easy, mixed or patience-oriented. For medical concerns, professional consultation is always necessary.`
    : language === "hindi"
      ? `Children awareness score ${childrenScore}/100 है। यह medical या fertility prediction नहीं है। यह केवल 5th house, Jupiter, supportive timing और KP 2-5-11 logic को combine करके बताता है कि children-related matters easy, mixed या patience-oriented दिखते हैं।`
      : `Children awareness score ${childrenScore}/100 hai. Ye medical ya fertility prediction nahi hai. Ye sirf 5th house, Jupiter, supportive timing aur KP 2-5-11 logic ko combine karke batata hai ki children-related matters easy, mixed ya patience-oriented dikhte hain. Medical concerns ke liye professional consultation zaruri hai.`;

  const safeRelationshipRemedies = language === "english"
    ? "Safe relationship remedies should begin with honest communication, family respect, emotional regulation, clean bedroom energy, loyalty, patience and avoiding secretive behavior. Do not use gemstones, donations or intense rituals without full validation."
    : language === "hindi"
      ? "Safe relationship remedies की शुरुआत honest communication, family respect, emotional regulation, clean bedroom energy, loyalty, patience और secretive behavior से बचने से करनी चाहिए। Gemstones, donations या intense rituals बिना full validation के न करें।"
      : "Safe relationship remedies honest communication, family respect, emotional regulation, clean bedroom energy, loyalty, patience aur secretive behavior avoid karne se start honi chahiye. Gemstones, donations ya intense rituals full validation ke bina nahi karne chahiye.";

  const safetyBoundary = language === "english"
    ? "This engine gives symbolic and timing-based guidance. It should not replace personal judgment, counseling, medical advice, legal advice or family dialogue."
    : language === "hindi"
      ? "यह engine symbolic और timing-based guidance देता है। यह personal judgment, counseling, medical advice, legal advice या family dialogue का replacement नहीं है।"
      : "Ye engine symbolic aur timing-based guidance deta hai. Ye personal judgment, counseling, medical advice, legal advice ya family dialogue ka replacement nahi hai.";

  return {
    system: "AstroLife Relationship Intelligence Engine",
    marriageScore,
    marriageLabel: finalMarriageLabel,
    marriageNarrative: finalMarriageParagraph,
    childrenScore,
    childrenNarrative: finalChildrenParagraph,
    layers: {
      marriagePromise,
      ashtakootCompatibility: ashtakoot,
      relationshipPsychology: psychology,
      kpMarriageValidation: kpMarriage,
      marriageTimingSupport: timing,
      manglikBalance: manglik,
      childrenAwareness: children,
      kpChildrenValidation: kpChildren,
    },
    safeRelationshipRemedies,
    safetyBoundary,
  };
}
