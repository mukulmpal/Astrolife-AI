// src/lib/astro-engine/lineage-karma/kula-ishta.ts
// ============================================================================
// KULA DEVATA (ROOTS) & ISHTA DEVATA (WINGS) DUAL SYNTHESIZER
// - Kula Devata: Bloodline protector, 2nd/9th/D12 houses, lineage firewall
// - Ishta Devata: Jaimini Atmakaraka (AK) → Karakamsa 12th house (Moksha/Soul)
// ============================================================================

import type { ChartData } from "../calculations";
import type { ConnectionStatus, DeityArchetype, IshtaDevataProfile, KulaDevataProfile } from "./types";

const PLANET_TO_KULA_ARCHETYPE: Record<
  string,
  { archetype: DeityArchetype; male: string; female: string }
> = {
  Sun: { archetype: "SHIVA", male: "Shiva / Surya Narayana / Rama", female: "Gayatri / Matangi" },
  Moon: { archetype: "DURGA_SHAKTI", male: "Krishna / Chandra Deva", female: "Maa Parvati / Gauri / Chamunda" },
  Mars: { archetype: "HANUMAN_BHAIRAV", male: "Hanuman / Kartikeya (Murugan) / Bhairava", female: "Bagalamukhi / Bhadrakali" },
  Mercury: { archetype: "VISHNU", male: "Maha Vishnu / Narayana / Vitthala", female: "Tripura Sundari / Saraswati" },
  Jupiter: { archetype: "VISHNU", male: "Dakshinamurthy / Dattatreya / Brihaspati", female: "Maa Tara / Bhuvaneshwari" },
  Venus: { archetype: "LAKSHMI_ANNAPURNA", male: "Parashurama / Srinivasa", female: "Maha Lakshmi / Annapurna / Kamakhya" },
  Saturn: { archetype: "KALI_BHAIRAVI", male: "Kala Bhairava / Rudra / Ayyappa", female: "Maa Kali / Dhumavati" },
  Rahu: { archetype: "NAGA_DEVATA", male: "Naga Raja / Bhairava", female: "Chhinnamasta / Manasa Devi" },
  Ketu: { archetype: "GANESHA", male: "Maha Ganapati / Matsya Avatara", female: "Bhairavi / Dhumra Varahi" },
};

const PLANET_TO_ISHTA_ARCHETYPE: Record<
  string,
  { archetype: DeityArchetype; deityName: string; mantra: string }
> = {
  Sun: { archetype: "SHIVA", deityName: "Lord Shiva / Rama", mantra: "Om Namah Shivaya" },
  Moon: { archetype: "DURGA_SHAKTI", deityName: "Maa Gauri / Sri Krishna", mantra: "Om Kleem Krishnaya Namah" },
  Mars: { archetype: "HANUMAN_BHAIRAV", deityName: "Lord Hanuman / Kartikeya (Murugan)", mantra: "Om Hanumate Namah" },
  Mercury: { archetype: "VISHNU", deityName: "Maha Vishnu / Narayana", mantra: "Om Namo Bhagavate Vasudevaya" },
  Jupiter: { archetype: "VISHNU", deityName: "Lord Dattatreya / Lord Shiva / Sadguru", mantra: "Om Dram Dattatreyaya Namah" },
  Venus: { archetype: "LAKSHMI_ANNAPURNA", deityName: "Maa Mahalakshmi", mantra: "Om Shreem Mahalakshmyai Namah" },
  Saturn: { archetype: "KALI_BHAIRAVI", deityName: "Maa Kali / Lord Bhairava / Shani Dev", mantra: "Om Kring Kalikaye Namah" },
  Rahu: { archetype: "DURGA_SHAKTI", deityName: "Maa Durga / Naga Devata", mantra: "Om Dum Durgaye Namah" },
  Ketu: { archetype: "GANESHA", deityName: "Lord Ganesha", mantra: "Om Gam Ganapataye Namah" },
};

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

export function calculateKulaAndIshtaDevata(chart: ChartData): {
  kulaDevata: KulaDevataProfile;
  ishtaDevata: IshtaDevataProfile;
} {
  // ── 1. KULA DEVATA IDENTIFICATION ──────────────────────────────────────────
  // Check 9th Lord, 2nd Lord, and 5th Lord.
  // 9th house is primary for Kula Parampara.
  const lagnaNum = chart.lagnaNum || 3;
  const houseToSignNum = (h: number) => (((lagnaNum - 1 + (h - 1)) % 12) + 1);
  const SIGN_NAMES_BY_NUM: Record<number, string> = {
    1: "Aries", 2: "Taurus", 3: "Gemini", 4: "Cancer", 5: "Leo", 6: "Virgo",
    7: "Libra", 8: "Scorpio", 9: "Sagittarius", 10: "Capricorn", 11: "Aquarius", 12: "Pisces"
  };

  const ninthSign = SIGN_NAMES_BY_NUM[houseToSignNum(9)] || "Aquarius";
  const ninthLord = SIGN_LORDS[ninthSign] || "Saturn";
  const secondSign = SIGN_NAMES_BY_NUM[houseToSignNum(2)] || "Cancer";
  const secondLord = SIGN_LORDS[secondSign] || "Moon";

  // Significator planet: primary is 9th lord. If 9th lord is severely combust/debilitated, blend with 2nd lord.
  const pData = chart.planets?.[ninthLord];
  const significatorPlanet = ninthLord;
  const sourceHouse: 2 | 5 | 9 = 9;

  // Determine Connection Status
  let connectionStatus: ConnectionStatus = "WEAKENED";
  const rahuH = chart.planets?.Rahu?.house;
  const ketuH = chart.planets?.Ketu?.house;
  const saturnH = chart.planets?.Saturn?.house;

  const isNinthAfflicted =
    pData?.house === 6 || pData?.house === 8 || pData?.house === 12 || pData?.dignity === "Debilitated";
  const isSecondAfflicted = rahuH === 2 || ketuH === 2 || saturnH === 2;

  if (!isNinthAfflicted && !isSecondAfflicted && (pData?.house === 1 || pData?.house === 5 || pData?.house === 9 || pData?.house === 10)) {
    connectionStatus = "VIBRANT";
  } else if (isSecondAfflicted && isNinthAfflicted) {
    connectionStatus = "DORMANT";
  } else if (pData?.house === 8 || pData?.house === 12) {
    connectionStatus = "DORMANT";
  } else {
    connectionStatus = "WEAKENED";
  }

  const deityInfo = PLANET_TO_KULA_ARCHETYPE[significatorPlanet] || PLANET_TO_KULA_ARCHETYPE.Sun;

  const kulaDevata: KulaDevataProfile = {
    significatorPlanet,
    sourceHouse,
    connectionStatus,
    suggestedDeity: {
      primaryArchetype: deityInfo.archetype,
      traditionalMaleName: deityInfo.male,
      traditionalFemaleName: deityInfo.female,
    },
    rootsGuidance:
      connectionStatus === "VIBRANT"
        ? "Your ancestral guardian energy is supportive and accessible. Continue regular family traditions."
        : connectionStatus === "DORMANT"
        ? "The protective firewall of the lineage has faded across generations. Light a quiet ghee lamp facing East or North and simply salute the ancestral guardian deity."
        : "A gentle reconnection through periodic remembrance and asking elders about ancestral roots will immediately stabilize domestic harmony.",
    simplePranamOffering:
      "A simple ghee diya facing East once a week (or during Amavasya), offering water, and mentally stating: 'I bow in gratitude to the protector of my lineage.'",
  };

  // ── 2. ISHTA DEVATA (JAIMINI ATMAKARAKA IN D9) ────────────────────────────
  // Find Atmakaraka: Planet with highest degrees in sign (0-30°) among 7 classic planets (Sun..Saturn)
  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  let akPlanet = "Sun";
  let maxDegree = -1;

  for (const cp of classicalPlanets) {
    const pl = chart.planets?.[cp];
    if (pl && typeof pl.degree === "number") {
      const totalMinutes = pl.degree + (pl.minutes || 0) / 60;
      if (totalMinutes > maxDegree) {
        maxDegree = totalMinutes;
        akPlanet = cp;
      }
    }
  }

  // Karakamsa Sign: The sign occupied by Atmakaraka in Navamsha (D9)
  const akD9Sign = chart.navamsha?.planets?.[akPlanet]?.sign || chart.planets?.[akPlanet]?.sign || "Aries";

  // 12th from Karakamsa (Jivanmuktamsa)
  const signOrder = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const akSignIndex = signOrder.indexOf(akD9Sign);
  const twelfthIndex = (akSignIndex - 1 + 12) % 12;
  const twelfthSign = signOrder[twelfthIndex] || "Pisces";
  const twelfthLord = SIGN_LORDS[twelfthSign] || "Jupiter";

  // Check if any planet sits in the 12th from Karakamsa in D9
  let ishtaPlanet = twelfthLord;
  if (chart.navamsha?.planets) {
    for (const [pName, pObj] of Object.entries(chart.navamsha.planets)) {
      if (pObj?.sign === twelfthSign && classicalPlanets.includes(pName)) {
        ishtaPlanet = pName;
        break;
      }
    }
  }

  const ishtaInfo = PLANET_TO_ISHTA_ARCHETYPE[ishtaPlanet] || PLANET_TO_ISHTA_ARCHETYPE.Jupiter;

  const ishtaDevata: IshtaDevataProfile = {
    atmakarakaPlanet: akPlanet,
    karakamsaSign: akD9Sign,
    twelfthFromKarakamsaSign: twelfthSign,
    twelfthFromKarakamsaLord: twelfthLord,
    suggestedDeity: {
      archetype: ishtaInfo.archetype,
      deityName: ishtaInfo.deityName,
    },
    wingsGuidance:
      `Your soul's guiding light is ${ishtaInfo.deityName} (indicated by ${ishtaPlanet} in the 12th from Karakamsa). This energy gives you clarity in chaos, philosophical discernment, and inner peace.`,
    soulDhyanaMantra: ishtaInfo.mantra,
  };

  return { kulaDevata, ishtaDevata };
}
