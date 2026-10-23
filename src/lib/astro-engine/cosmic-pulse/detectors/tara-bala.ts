import type { TaraBalaModifier, TaraType } from "../types";

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const TARA_CONFIG: Record<
  number,
  {
    name: TaraType;
    quality: "supportive" | "caution" | "neutral";
    guidance: string;
    whyItMatters: string;
  }
> = {
  1: {
    name: "Janma",
    quality: "neutral",
    guidance: "Janma Tara active hai. Sharir, stamina aur self-care par dhyan dein. High physical strain avoid karein.",
    whyItMatters: "Janma Tara aatma aur sharir ko directly touch karti hai, isliye energy ko conserve karna behtar hai.",
  },
  2: {
    name: "Sampat",
    quality: "supportive",
    guidance: "Sampat Tara active hai. Wealth creation, financial planning aur important transactions ke liye shubh din hai.",
    whyItMatters: "Sampat ka arth hai samriddhi. Yeh Tara resources ko badhane aur productive meeting karne me support karti hai.",
  },
  3: {
    name: "Vipat",
    quality: "caution",
    guidance: "Vipat Tara active hai. Unplanned travel, rash investment ya kisi se direct confrontation se bachein.",
    whyItMatters: "Vipat me unexpected delays ya micro-obstacles aate hain, isliye double-checking zaroori hoti hai.",
  },
  4: {
    name: "Kshema",
    quality: "supportive",
    guidance: "Kshema Tara active hai. Family harmony, health recovery aur comfort ke liye peaceful time hai.",
    whyItMatters: "Kshema ka arth kalyan aur protection hai. Yeh Tara mental peace aur suraksha ka vatavaran banati hai.",
  },
  5: {
    name: "Pratyak",
    quality: "caution",
    guidance: "Pratyak Tara active hai. Argumentative discussions avoid karein; doosron ki baaton par jaldi react na karein.",
    whyItMatters: "Pratyak me opposing views aur resistance dekhne ko mil sakti hai, isliye diplomacy best strategy hai.",
  },
  6: {
    name: "Sadhana",
    quality: "supportive",
    guidance: "Sadhana Tara active hai. Goal execution, tough pending work aur focus-driven projects ke liye best timing hai.",
    whyItMatters: "Sadhana ka arth hai siddhi/prapti. Yeh din mushkil tasks ko pura karne ki ichhashakti deta hai.",
  },
  7: {
    name: "Naidhana",
    quality: "caution",
    guidance: "Naidhana (Vadha) Tara active hai. Kisi bhi high-stakes risk ya extreme speed driving se bachein. Routine calm rakhein.",
    whyItMatters: "Yeh 9 Taras me sabse sensitive Tara hai. Is din risky commitments nahi karne chahiye.",
  },
  8: {
    name: "Mitra",
    quality: "supportive",
    guidance: "Mitra Tara active hai. Networking, social meetings aur dosto/colleagues se help lene ke liye favorable din hai.",
    whyItMatters: "Mitra Tara cooperation aur aamne-saamne ke rishto me warm coordination laati hai.",
  },
  9: {
    name: "Parama Mitra",
    quality: "supportive",
    guidance: "Parama Mitra Tara active hai. Supreme auspiciousness — high-value meetings aur shubh arambh ke liye best din.",
    whyItMatters: "Parama Mitra divine grace aur deep goodwill ko trigger karti hai.",
  },
};

export function calculateTaraBala(
  birthNakshatraName: string,
  transitNakshatraName: string
): TaraBalaModifier {
  const birthIdx = NAKSHATRAS.findIndex(
    (n) => n.toLowerCase() === birthNakshatraName.toLowerCase().trim()
  );
  const transitIdx = NAKSHATRAS.findIndex(
    (n) => n.toLowerCase() === transitNakshatraName.toLowerCase().trim()
  );

  const safeBirth = birthIdx !== -1 ? birthIdx : 0;
  const safeTransit = transitIdx !== -1 ? transitIdx : 0;

  // Navatara 9-fold formula
  const distance = (safeTransit - safeBirth + 27) % 27;
  const taraNumber = (distance % 9) + 1;

  const config = TARA_CONFIG[taraNumber] || TARA_CONFIG[1];

  return {
    number: taraNumber,
    name: config.name,
    quality: config.quality,
    birthNakshatra: NAKSHATRAS[safeBirth],
    transitNakshatra: NAKSHATRAS[safeTransit],
    guidance: config.guidance,
    learning: {
      title: `Navatara Chakra: ${config.name} Tara (${taraNumber}/9)`,
      sanskritTerm: `नवतारा चक्र — ${config.name} तारा`,
      howItWorks: `Aapke Janma Nakshatra (${NAKSHATRAS[safeBirth]}) se aaj ke Gochar Moon Nakshatra (${NAKSHATRAS[safeTransit]}) tak count karne par yeh ${taraNumber}th Tara aati hai. Vedic astrology me 27 nakshatras ko 9-9 ke 3 cycles me divide kiya jata hai.`,
      whyItMatters: config.whyItMatters,
      classicalRule:
        "Muhurta Chintamani: 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra) aur 9 (Parama Mitra) Taras shubh hoti hain; 3 (Vipat), 5 (Pratyak) aur 7 (Naidhana) me sawdhani baratni chahiye.",
    },
  };
}

