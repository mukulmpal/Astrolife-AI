import type { ChandraBalaModifier } from "../types";

export const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const AUSPICIOUS_HOUSES = new Set([1, 3, 6, 7, 10, 11]);

export function calculateChandraBala(
  natalMoonRashiIndex: number,
  transitMoonRashiIndex: number
): ChandraBalaModifier {
  const safeNatal = ((natalMoonRashiIndex % 12) + 12) % 12;
  const safeTransit = ((transitMoonRashiIndex % 12) + 12) % 12;

  // House count from Natal Moon (1 to 12)
  const houseFromNatal = ((safeTransit - safeNatal + 12) % 12) + 1;
  const isSupportive = AUSPICIOUS_HOUSES.has(houseFromNatal);
  const isAshtamaChandra = houseFromNatal === 8;

  let guidance = "";
  if (isAshtamaChandra) {
    guidance =
      "Ashtama Chandra (Moon in 8th from Natal Moon): Man me restlessness ya sudden mood swing ho sakta hai. Major commitments aur overthinking avoid karein.";
  } else if (isSupportive) {
    guidance = `Chandra Bala Shubh (${houseFromNatal}th House): Man prasanna, focused aur decisions lene me clear rahega.`;
  } else {
    guidance = `Chandra Bala Sensitive (${houseFromNatal}th House): Emotions ko stabilize rakhein; practical logic ko emotions par prathmikta dein.`;
  }

  return {
    houseFromNatalMoon: houseFromNatal,
    natalMoonSign: RASHI_NAMES[safeNatal],
    transitMoonSign: RASHI_NAMES[safeTransit],
    isSupportive,
    isAshtamaChandra,
    guidance,
    learning: {
      title: isAshtamaChandra
        ? "Ashtama Chandra: 8th House Moon Transit"
        : `Chandra Bala: Moon in ${houseFromNatal}th House from Janma Rashi`,
      sanskritTerm: isAshtamaChandra ? "अष्टम चन्द्र (Ashtama Chandra)" : "चन्द्र बल (Chandra Bala)",
      howItWorks: `Aapki Janma Rashi (${RASHI_NAMES[safeNatal]}) se aaj ka Gochar Moon (${RASHI_NAMES[safeTransit]}) ${houseFromNatal}th sthan par sthit hai. Moon har 2.25 din me rashi badalta hai.`,
      whyItMatters:
        "Moon manas ka karak hai (Mind & Perception). Jab Moon 1, 3, 6, 7, 10, ya 11th sthan par hota hai toh man me confidence aur physical energy supportive hoti hai. 8th sthan par aane par emotional fatigue aur doubt create hota hai.",
      classicalRule:
        "Muhurta Chintamani: 1, 3, 6, 7, 10, 11 me Chandra Bala purna shubh fal deta hai. 8th me Ashtama Shuddhi bina shubh karya nahi kiye jaate.",
    },
  };
}

