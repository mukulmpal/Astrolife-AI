// src/lib/astro-engine/navtara-remedies.ts
// AstroLife — Authentic Rashi-Tattva Navtara Remedy Engine
// Based strictly on classical shastras and practical lecture transcript directives:
// Directive 1: Remedy Element is dictated by RASHI TATTVA, not House Number.
// Directive 2: Life Domain of impact is dictated by House Placement (with Vedic vs KP shift).
// Directive 3: Concrete traditional prescriptions (e.g. Rahu 400g coal, Ketu 7 lemons, etc.).

import type { ElementTattva } from "./nakshatra-data";
import type { DashaLord } from "./dasha";

export interface SpecificRemedyPrescription {
  planet: DashaLord;
  substances: string[];
  timingAndVessel: string;
  traditionalMethod: string;
  avoidanceAdvice?: string;
  transcriptSource: string;
}

export interface TattvaRemedyVector {
  element: ElementTattva;
  sanskritName: string;
  qualifyingRashis: string[];
  elementalAction: string;
  traditionalVehicle: string;
  mantraSupport: string;
  scriptDirective: string;
}

export interface NavtaraPlanetaryRemedy {
  planet: DashaLord;
  rashi: string;
  rashiNum: number; // 0 to 11
  vedicHouse: number; // 1 to 12
  kpHouse?: number; // 1 to 12
  tattva: ElementTattva;
  tattvaVector: TattvaRemedyVector;
  specificPrescription?: SpecificRemedyPrescription;
  domainSignificance: string;
  harmonizationGuidance: string;
}

// ── Classical Rashi Tattva Vectors ───────────────────────────────────────────

export const TATTVA_VECTORS: Record<ElementTattva, TattvaRemedyVector> = {
  Agni: {
    element: "Agni",
    sanskritName: "अग्नि तत्त्व (Fire)",
    qualifyingRashis: ["Aries (Mesha)", "Leo (Simha)", "Sagittarius (Dhanu)"],
    elementalAction: "Sacred Fire, Yagya, Havan, & Deepam Archana",
    traditionalVehicle: "Perform small Havan, light pure ghee or sesame lamps during sunset, offer ahuti to Agni",
    mantraSupport: "Gayatri Mantra or deity-specific Agni beej mantra during sunrise or twilight",
    scriptDirective:
      "When the afflicted planet sits in signs 1, 5, or 9 (Aries, Leo, Sagittarius), the remedial vehicle must be FIRE / HAVAN. The fire element transforms density into light.",
  },
  Prithvi: {
    element: "Prithvi",
    sanskritName: "पृथ्वी तत्त्व (Earth)",
    qualifyingRashis: ["Taurus (Vrishabha)", "Virgo (Kanya)", "Capricorn (Makara)"],
    elementalAction: "Burying in Soil (Zameen mein dabana) & Earth Rooting",
    traditionalVehicle: "Burying specific herbal or mineral items in clean unpolluted soil, barren ground, or beneath sacred trees",
    mantraSupport: "Grounded japa sitting on unstitched wool or grass asana touching the earth",
    scriptDirective:
      "When the afflicted planet sits in signs 2, 6, or 10 (Taurus, Virgo, Capricorn), the remedial vehicle is EARTH / SOIL. Placing items into soil stabilizes erratic energy.",
  },
  Vayu: {
    element: "Vayu",
    sanskritName: "वायु तत्त्व (Air)",
    qualifyingRashis: ["Gemini (Mithuna)", "Libra (Tula)", "Aquarius (Kumbha)"],
    elementalAction: "Mantra Japa, Sound Vibration & Sacred Chanting",
    traditionalVehicle: "Regular audible or mental Japa, Pranayama, chanting in open airy environments, ringing temple bells",
    mantraSupport: "Rhythmic chanting of Navagraha stotras or planetary beej mantras with clear resonant pronunciation",
    scriptDirective:
      "When the afflicted planet sits in signs 3, 7, or 11 (Gemini, Libra, Aquarius), the remedial vehicle is AIR / SOUND VIBRATION (Mantra Japa). The sound currents recalibrate the mental sheath.",
  },
  Jala: {
    element: "Jala",
    sanskritName: "जल तत्त्व (Water)",
    qualifyingRashis: ["Cancer (Karka)", "Scorpio (Vrishchika)", "Pisces (Meena)"],
    elementalAction: "Jal Pravah (Immersion in Flowing Clean Water)",
    traditionalVehicle: "Gently flowing specified organic items into clean natural rivers, canals, or moving clean waterways",
    mantraSupport: "Offering Arghya and reciting holy river mantras (Ganga, Yamuna, Godavari)",
    scriptDirective:
      "When the afflicted planet sits in signs 4, 8, or 12 (Cancer, Scorpio, Pisces), the remedial vehicle is FLOWING WATER (Jal Pravah). Moving water flushes away static karmic debris.",
  },
};

// ── Specific Classical Prescriptions from Transcript ────────────────────────

export const SPECIFIC_PRESCRIPTIONS: Record<string, SpecificRemedyPrescription> = {
  Rahu: {
    planet: "Rahu",
    substances: [
      "400g raw coal (koyla)",
      "400g whole barley grains (jau)",
      "1 dry whole coconut with water/fiber (sukha nariyal)",
      "Grey or slate-colored cloth",
    ],
    timingAndVessel: "Saturday afternoon or twilight during Shukla/Krishna Paksha",
    traditionalMethod:
      "Tie the 400g coal, 400g barley, and coconut inside the grey cloth. Flow in running river water (if in Water sign) or bury in barren land (if in Earth sign).",
    avoidanceAdvice: "Avoid wearing dark smoky grey tones or synthetic electrical clutter in personal room.",
    transcriptSource: "Transcript explicit prescription: 400g coal, 400g jau, dry coconut in grey cloth.",
  },
  Ketu: {
    planet: "Ketu",
    substances: [
      "7 fresh ripe whole lemons (bina daag ke nimbu)",
      "Brown or multi-colored unstitched cloth",
    ],
    timingAndVessel: "Wednesday night precisely at or around 7:30 PM",
    traditionalMethod:
      "Tie 7 lemons in brown cloth and immerse smoothly into clean flowing river water while silently praying for obstacle removal.",
    avoidanceAdvice: "Avoid dog cruelty; feed multi-colored or stray dogs on Tuesdays and Saturdays.",
    transcriptSource: "Transcript explicit prescription: 7 lemons in brown cloth immersed in river on Wednesday night at 7:30 PM.",
  },
  Venus: {
    planet: "Venus",
    substances: [
      "Fresh white curd (dahi)",
      "Natural chemical-free floral perfume (ittar/sandalwood)",
      "6 kg fresh boiled or raw whole potatoes (aalu)",
    ],
    timingAndVessel: "Friday morning before noon",
    traditionalMethod:
      "Feed 6 kg fresh potatoes to a white cow on Friday. Apply pure natural ittar behind the ears and on pulse points.",
    avoidanceAdvice: "Maintain utmost cleanliness of clothes; avoid torn or unwashed garments.",
    transcriptSource: "Transcript explicit prescription: Dahi, perfume, 6kg potatoes fed to a white cow on Friday.",
  },
  Mercury: {
    planet: "Mercury",
    substances: [
      "Whole green mung dal (sabut hari moong)",
      "Bronze or bell-metal vessel (kansa)",
      "Green grass or fodder for cows",
    ],
    timingAndVessel: "Wednesday morning during Mercury Hora or sunrise",
    traditionalMethod:
      "Donate whole green mung dal or bronze items to students/monasteries. If in an air sign (3, 7, 11), perform Vishnu Sahasranama or Budh Gayatri mantra chanting.",
    avoidanceAdvice: "Avoid wearing dark green clothes when Mercury is placed in 3, 5, or 7 Tara.",
    transcriptSource: "Transcript explicit prescription: Avoid green clothes during adverse Tara; donate bronze/mung; utilize mantra in air signs.",
  },
  Saturn: {
    planet: "Saturn",
    substances: [
      "Pure mustard oil (sarson tel)",
      "Black sesame seeds (kala til)",
      "Iron vessel or nails",
      "Feed for crows and street animals",
    ],
    timingAndVessel: "Saturday evening during Pradosha twilight",
    traditionalMethod:
      "Chaya Daan (view reflection in mustard oil and donate) or donate black sesame; serve laborers, elderly, and differently-abled individuals.",
    avoidanceAdvice: "Avoid arrogance towards subordinates and manual workers.",
    transcriptSource: "Classical Parashari & Lal Kitab alignment with Navtara transcript directives.",
  },
  Sun: {
    planet: "Sun",
    substances: [
      "Pure organic jaggery (gud)",
      "Whole wheat grains",
      "Pure copper coin or vessel",
      "Pure water offering (Surya Arghya)",
    ],
    timingAndVessel: "Sunday morning at exact astronomical sunrise",
    traditionalMethod:
      "Offer water with copper vessel and kumkum/red flowers facing east; donate wheat and jaggery to elders or temples.",
    avoidanceAdvice: "Never disrespect the father, teachers, or government dignitaries.",
    transcriptSource: "Classical Parashari & Surya Siddhanta harmony.",
  },
  Moon: {
    planet: "Moon",
    substances: [
      "Pure cow milk",
      "White natural rice (akshat)",
      "Silver piece or ornament",
      "White lotus / fragrant white flowers",
    ],
    timingAndVessel: "Monday evening during Moonrise",
    traditionalMethod:
      "Donate milk or rice to elder women; touch mother's feet daily; perform Shiva Jalabhisheka with pure clean water.",
    avoidanceAdvice: "Avoid wasting drinking water; never sleep with damp hair.",
    transcriptSource: "Classical Parashari & transcript emotional grounding principles.",
  },
  Mars: {
    planet: "Mars",
    substances: [
      "Red split lentils (masoor dal)",
      "Natural red coral (if indicated) or copper rod",
      "Sweet wheat flatbreads (meethi roti)",
    ],
    timingAndVessel: "Tuesday morning after sunrise",
    traditionalMethod:
      "Feed sweet roti or jaggery bread to monkeys or stray dogs; recite Hanuman Chalisa or Mangal Gayatri; practice martial self-discipline.",
    avoidanceAdvice: "Avoid reckless aggressive arguments, especially with siblings or neighbors.",
    transcriptSource: "Classical BPHS & Lal Kitab harmonization.",
  },
  Jupiter: {
    planet: "Jupiter",
    substances: [
      "Whole yellow gram dal (chana dal)",
      "Pure organic turmeric (haldi knot)",
      "Yellow flowers / bananas",
      "Service to spiritual teachers",
    ],
    timingAndVessel: "Thursday morning during Jupiter Hora",
    traditionalMethod:
      "Donate chana dal, turmeric, and yellow fruits to priests, teachers, or cows; recite Brihaspati Kavacham or Guru Gayatri.",
    avoidanceAdvice: "Never insult teachers, scriptures, or holy traditions.",
    transcriptSource: "Classical Parashari & transcript dharmic alignment principles.",
  },
};

// ── House Domain Significations ──────────────────────────────────────────────

const HOUSE_DOMAINS: Record<number, string> = {
  1: "Physical vitality, self-identity, head health and overall demeanor",
  2: "Accumulated wealth, family harmony, speech, and oral health",
  3: "Initiative, courage, sibling relations, short travels and communication",
  4: "Domestic peace, mother, vehicles, real estate, and inner contentment",
  5: "Children, creative intellect, speculation, romance and past-life merit",
  6: "Daily work, debts, disease resilience, litigation and competitive hurdles",
  7: "Spouse, marital harmony, business partnerships and public contracts",
  8: "Longevity, sudden transformations, hidden assets and chronic vulnerabilities",
  9: "Father, spiritual dharma, higher education, mentors and fortune",
  10: "Career reputation, public status, authorities, vocation and leadership",
  11: "Gains, elder siblings, network circles, wish-fulfillment and liquid profits",
  12: "Expenditure, overseas connections, sleep, isolation and spiritual release",
};

/**
 * Resolves the full elemental and domain remedy prescription for a given planet placement.
 */
export function resolvePlanetTattvaRemedy(
  planet: DashaLord,
  rashiName: string,
  rashiNum: number,
  vedicHouse: number,
  kpHouse?: number
): NavtaraPlanetaryRemedy {
  // Determine element by Rashi number (0=Aries, 1=Taurus, ..., 11=Pisces)
  let tattva: ElementTattva;
  if ([0, 4, 8].includes(rashiNum)) {
    tattva = "Agni"; // 1, 5, 9
  } else if ([1, 5, 9].includes(rashiNum)) {
    tattva = "Prithvi"; // 2, 6, 10
  } else if ([2, 6, 10].includes(rashiNum)) {
    tattva = "Vayu"; // 3, 7, 11
  } else {
    tattva = "Jala"; // 4, 8, 12
  }

  const tattvaVector = TATTVA_VECTORS[tattva];
  const specificPrescription = SPECIFIC_PRESCRIPTIONS[planet];

  const vedicDomain = HOUSE_DOMAINS[vedicHouse] ?? "Life themes";
  const kpDomain = kpHouse && kpHouse !== vedicHouse ? HOUSE_DOMAINS[kpHouse] : undefined;

  let domainSignificance = `Vedic House H${vedicHouse}: Affects ${vedicDomain}.`;
  if (kpDomain && kpHouse) {
    domainSignificance += ` (Note: Under KP Placidus cusp shift to H${kpHouse}, manifests in ${kpDomain}).`;
  }

  const harmonizationGuidance = `${tattvaVector.elementalAction}: Since ${planet} sits in ${rashiName} (${tattvaVector.sanskritName}), remedies must utilize the ${tattva} element. ${tattvaVector.traditionalVehicle}.`;

  return {
    planet,
    rashi: rashiName,
    rashiNum,
    vedicHouse,
    kpHouse,
    tattva,
    tattvaVector,
    specificPrescription,
    domainSignificance,
    harmonizationGuidance,
  };
}
