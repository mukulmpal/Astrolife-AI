import type { Language, SafetyLevel, SourceStatus } from "./nakshatra-tree-remedy-engine";

export type RemedyCategory =
  | "safe_daily"
  | "avoidance_rule"
  | "house_object"
  | "seva"
  | "animal_feeding"
  | "donation"
  | "forty_three_day"
  | "metal_gem"
  | "never_donate";

export type PracticalRemedyNarrative = {
  id: string;
  planet: string;
  category: RemedyCategory;
  safetyLevel: SafetyLevel;
  title: string;
  description: string;
  whyItHelps: string;
  howToPractice: string;
  whenToAvoid: string;
  sourceStatus: SourceStatus;
};

export const practicalRemedyNarratives: PracticalRemedyNarrative[] = [
  {
    id: "sun_safe_daily_respect",
    planet: "Sun",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Respect, discipline and clean leadership",
    description:
      "For Sun-related imbalance, the safest first remedy is not donation or gemstone use. It is correcting pride, improving discipline, respecting father-like figures, and using authority with dignity.",
    whyItHelps:
      "Sun symbolically represents confidence, father, vitality, visibility and leadership. When the person becomes more sincere and responsible, Sun-related themes become healthier.",
    howToPractice:
      "Begin the day with a clean routine, avoid arrogant speech, respect elders, and take responsibility without dominating others.",
    whenToAvoid:
      "Do not donate Sun-related items if Sun is acting as a supportive or fortune-giving planet.",
    sourceStatus: "traditional",
  },
  {
    id: "moon_safe_daily_emotion",
    planet: "Moon",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Emotional steadiness and mother respect",
    description:
      "Moon remedies should begin with emotional regulation, sleep hygiene, respect toward mother-like figures, and keeping water-related spaces clean.",
    whyItHelps:
      "Moon symbolically reflects mind, mother, memory, sleep and emotional safety. Calm routines protect the mind from unnecessary fluctuation.",
    howToPractice:
      "Keep a stable sleep schedule, avoid emotional overreaction, clean water vessels, and practice gratitude toward nurturing people.",
    whenToAvoid:
      "Do not treat Moon remedies as a replacement for mental health support if the user is struggling emotionally.",
    sourceStatus: "traditional",
  },
  {
    id: "saturn_safe_daily_service",
    planet: "Saturn",
    category: "seva",
    safetyLevel: "safe",
    title: "Service, patience and respect for labour",
    description:
      "Saturn's safest remedy is humility in daily life. Respect workers, elderly people, poor people and people who do difficult work. Remove junk and broken items from the home.",
    whyItHelps:
      "Saturn symbolically reflects karma, delay, discipline, labour, old things and responsibility. Service reduces ego and builds patience.",
    howToPractice:
      "Speak respectfully to helpers, avoid exploiting anyone, keep old machinery and iron clutter organized, and follow long-term discipline.",
    whenToAvoid:
      "Do not jump directly to oil, iron, gemstone or strong Saturn remedies without chart validation.",
    sourceStatus: "traditional",
  },
  {
    id: "rahu_safe_daily_grounding",
    planet: "Rahu",
    category: "avoidance_rule",
    safetyLevel: "safe",
    title: "Avoid shortcuts and ground the mind",
    description:
      "Rahu-related remedies should start with honesty, grounding, avoiding shortcuts, reducing intoxicating habits, and staying away from manipulative environments.",
    whyItHelps:
      "Rahu symbolically reflects obsession, illusion, sudden rise, foreign influence and image hunger. Clarity and ethical choices reduce Rahu's confusing side.",
    howToPractice:
      "Pause before major decisions, avoid false promises, keep digital habits clean, and choose long-term integrity over quick gains.",
    whenToAvoid:
      "Avoid strong Rahu gemstones or intense remedies without expert validation.",
    sourceStatus: "traditional",
  },
  {
    id: "ketu_safe_daily_grounding",
    planet: "Ketu",
    category: "safe_daily",
    safetyLevel: "safe",
    title: "Grounding, simplicity and relationship repair",
    description:
      "Ketu remedies should be gentle. The focus is on body grounding, simple seva, avoiding isolation, and repairing relationships where possible.",
    whyItHelps:
      "Ketu symbolically reflects detachment, separation, spiritual insight and past residue. Grounded daily life prevents detachment from becoming avoidance.",
    howToPractice:
      "Walk barefoot safely where appropriate, care for animals gently, reconnect with trusted people, and keep routines simple.",
    whenToAvoid:
      "Do not use Ketu remedies to escape real-life responsibilities.",
    sourceStatus: "traditional",
  },
];

export function getRemediesForPlanet(planet: string) {
  return practicalRemedyNarratives.filter(
    (remedy) => remedy.planet.toLowerCase() === planet.toLowerCase()
  );
}

export function generateRemedyNarrative(
  planet: string,
  language: Language = "hinglish"
) {
  const remedies = getRemediesForPlanet(planet);

  if (!remedies.length) {
    return language === "hindi"
      ? "इस ग्रह के लिए remedy narrative अभी उपलब्ध नहीं है।"
      : language === "english"
        ? "No remedy narrative is available for this planet yet."
        : "Is planet ke liye remedy narrative abhi available nahi hai.";
  }

  return remedies
    .map((remedy) => {
      if (language === "hindi") {
        return `${remedy.title}: ${remedy.description} इसका उद्देश्य डर पैदा करना नहीं है, बल्कि जीवन में सुरक्षित और व्यावहारिक सुधार लाना है। ${remedy.howToPractice}`;
      }

      if (language === "english") {
        return `${remedy.title}: ${remedy.description} This is not a guaranteed solution; it is a symbolic and practical support practice. ${remedy.howToPractice}`;
      }

      return `${remedy.title}: ${remedy.description} Ye guaranteed solution nahi hai; ye symbolic aur practical support practice hai. ${remedy.howToPractice}`;
    })
    .join("\n\n");
}
