// src/lib/astro-engine/house-trikona-remedies.ts
// AstroLife — Authentic House-Trikona Physical Vehicle Remedy Engine
// Based strictly on classical tattva trikonas and the oral discourse transcript:
// 1, 5, 9   -> Dharma Trikona (Agni Tattva): Homa / Havan with planet mantra
// 2, 6, 10  -> Artha Trikona (Prithvi Tattva): Bury related substances in clean soil
// 3, 7, 11  -> Kama Trikona (Vayu Tattva): Mantra Japa / sacred sound chanting
// 4, 8, 12  -> Moksha Trikona (Jala Tattva): Flowing clean water immersion (Jal Pravah)

export interface HouseTrikonaRule {
  houses: number[];
  trikonaName: string;
  tattva: "Agni" | "Prithvi" | "Vayu" | "Jala";
  vehicleAction: "homa_havan" | "bury_in_soil" | "mantra_japa" | "jal_pravah";
  actionTitleHinglish: string;
  actionExplanationHinglish: string;
  procedureNarrativeHinglish: string;
}

export const HOUSE_TRIKONA_RULES: HouseTrikonaRule[] = [
  {
    houses: [1, 5, 9],
    trikonaName: "Dharma Trikona (Agni Tattva)",
    tattva: "Agni",
    vehicleAction: "homa_havan",
    actionTitleHinglish: "Agni Havan & Deepak Archana (Pavitra Agni)",
    actionExplanationHinglish:
      "Kyunki problem dene wala grah 1, 5 ya 9 bhav me baitha hai (Agni Trikona), iska sabse prabhavi madhyam Pavitra Agni hai. Agni har dushit urja ko jala kar shuddh kundan bana deti hai.",
    procedureNarrativeHinglish:
      "Is grah ke beej mantra ya Gayatri mantra se chhota havan karein ya shuddh ghee ka deepak jalayein. Agni me aahuti dene se us grah ki peeda turant shant hoti hai.",
  },
  {
    houses: [2, 6, 10],
    trikonaName: "Artha Trikona (Prithvi Tattva)",
    tattva: "Prithvi",
    vehicleAction: "bury_in_soil",
    actionTitleHinglish: "Zameen Me Dabana (Earth Rooting & Grounding)",
    actionExplanationHinglish:
      "Kyunki problem dene wala grah 2, 6 ya 10 bhav me baitha hai (Prithvi Trikona), iska sabse bada upay hai zameen me dabana. Prithvi tattva bhatakti hui aur aakramak urja ko sokh kar ground kar deta hai.",
    procedureNarrativeHinglish:
      "Us grah se sambandhit samagri (jaise Rahu ke liye jau/koyla, Shani ke liye loha, Mangal ke liye meethi roti/mitti ka patra) ko kisi saaf, banjar ya ped ki jadd ke paas saaf mitti me daba dein.",
  },
  {
    houses: [3, 7, 11],
    trikonaName: "Kama Trikona (Vayu Tattva)",
    tattva: "Vayu",
    vehicleAction: "mantra_japa",
    actionTitleHinglish: "Mantra Japa & Dhwani Spandan (Vayu / Sound Current)",
    actionExplanationHinglish:
      "Kyunki problem dene wala grah 3, 7 ya 11 bhav me baitha hai (Vayu Trikona), iska upay Vayu aur shabd tarango (sound vibration) se hota hai. Dhwani ka spandan mansik aavran ko re-align karta hai.",
    procedureNarrativeHinglish:
      "Us grah ke beej mantra ya stotra ka niyamit roop se spashta ucharan karke bolkar ya maanasik japa karein. Khuli hawa me baithkar pranayama ke saath japa karna aur bhi kripakari hota hai.",
  },
  {
    houses: [4, 8, 12],
    trikonaName: "Moksha Trikona (Jala Tattva)",
    tattva: "Jala",
    vehicleAction: "jal_pravah",
    actionTitleHinglish: "Jal Pravah (Behte Jal Me Pravahit Karna)",
    actionExplanationHinglish:
      "Kyunki problem dene wala grah 4, 8 ya 12 bhav me baitha hai (Jala Trikona), iska upay Behte Jal se hota hai. Saaf behta hua paani purane sanchit karmon aur dushit urja ko baha le jaata hai.",
    procedureNarrativeHinglish:
      "Us grah se sambandhit padarth ko kisi saaf behti nadi ya nahar me aadar-sahit pravahit karein. Thahare hue ya gande paani me na dalein, keval saaf behte jal me pravah karein.",
  },
];

/**
 * Resolves the physical vehicle remedy for a planet placed in a specific house.
 */
export function resolveHouseTrikonaRemedy(planetName: string, houseNumber: number): HouseTrikonaRule {
  const normHouse = ((houseNumber - 1) % 12) + 1;
  const rule = HOUSE_TRIKONA_RULES.find((r) => r.houses.includes(normHouse));
  if (rule) return rule;
  // Fallback to Agni (1, 5, 9)
  return HOUSE_TRIKONA_RULES[0];
}
