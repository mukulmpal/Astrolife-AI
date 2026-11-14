// ============================================================
// ASTROLIFE KUNDALI MILAN ENGINE v1.0
// Ashtakoot 36-Point System — extracted from AstroLife legacy HTML
// 8 Koots: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakut, Nadi
// ============================================================

export const NAKSHATRAS_27 = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha",
  "Shatabhisha","Purva Bhadra","Uttara Bhadra","Revati"
];

export const RASHIS_12 = [
  "Mesha","Vrishabha","Mithuna","Karka",
  "Simha","Kanya","Tula","Vrishchika",
  "Dhanu","Makara","Kumbha","Meena"
];

const NK_GANA:  string[] = ["Deva","Deva","Rakshasa","Deva","Deva","Manushya","Deva","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva"];
const NK_NADI:  string[] = ["Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya"];
const NK_YONI:  string[] = ["Ashwa","Gaj","Mesh","Sarpa","Sarpa","Shwan","Marjaar","Mesh","Marjaar","Mushak","Mushak","Gau","Mahish","Vyaghra","Mahish","Vyaghra","Mrig","Mrig","Shwan","Vanar","Nakul","Vanar","Simha","Ashwa","Simha","Gau","Gaj"];
const NK_VARNA: string[] = ["Shudra","Shudra","Brahmin","Shudra","Shudra","Shudra","Brahmin","Brahmin","Shudra","Shudra","Brahmin","Brahmin","Vaishya","Shudra","Vaishya","Shudra","Brahmin","Brahmin","Brahmin","Brahmin","Brahmin","Shudra","Shudra","Shudra","Brahmin","Brahmin","Brahmin"];
const RASHI_LORD: string[] = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
const PLANET_FRIENDS: Record<string, string[]> = {
  Mars:    ["Sun","Moon","Jupiter"],
  Venus:   ["Mercury","Saturn"],
  Mercury: ["Sun","Venus"],
  Moon:    ["Sun","Mercury"],
  Sun:     ["Moon","Mars","Jupiter"],
  Jupiter: ["Sun","Moon","Mars"],
  Saturn:  ["Mercury","Venus"],
};
// Rashi Varna (Classical Standard: Water=Brahmin(3), Fire=Kshatriya(2), Earth=Vaishya(1), Air=Shudra(0))
// Mesha(0)=Kshatriya, Vrishabha(1)=Vaishya, Mithuna(2)=Shudra, Karka(3)=Brahmin,
// Simha(4)=Kshatriya, Kanya(5)=Vaishya, Tula(6)=Shudra, Vrishchika(7)=Brahmin,
// Dhanu(8)=Kshatriya, Makara(9)=Vaishya, Kumbha(10)=Shudra, Meena(11)=Brahmin
const RASHI_VARNA_ORDER: number[] = [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3];
const RASHI_VARNA_NAMES: string[] = [
  "Kshatriya", "Vaishya", "Shudra", "Brahmin",
  "Kshatriya", "Vaishya", "Shudra", "Brahmin",
  "Kshatriya", "Vaishya", "Shudra", "Brahmin"
];

// 14 Yoni Animals Matrix (Classical Parashara / Muhurta Chintamani)
// Sworn enemies (Vaira - 0 points): Horse-Buffalo, Elephant-Lion, Sheep-Monkey, Serpent-Mongoose, Dog-Deer, Cat-Rat, Cow-Tiger
const SWORN_ENEMY_YONI_PAIRS: [string, string][] = [
  ["Ashwa", "Mahish"],
  ["Gaj", "Simha"],
  ["Mesh", "Vanar"],
  ["Sarpa", "Nakul"],
  ["Shwan", "Mrig"],
  ["Marjaar", "Mushak"],
  ["Gau", "Vyaghra"],
];

const FRIENDLY_YONI_PAIRS: [string, string][] = [
  ["Ashwa", "Vanar"], ["Gaj", "Mesh"], ["Sarpa", "Marjaar"],
  ["Gau", "Mrig"], ["Vanar", "Nakul"], ["Simha", "Mrig"],
];

// Parashara Natural Relationship Matrix for Graha Maitri (5, 4, 3, 1, 0.5, 0)
const PARASHARA_RELATIONS: Record<string, { friends: string[]; neutrals: string[]; enemies: string[] }> = {
  Sun:     { friends: ["Moon", "Mars", "Jupiter"], neutrals: ["Mercury"], enemies: ["Venus", "Saturn"] },
  Moon:    { friends: ["Sun", "Mercury"], neutrals: ["Mars", "Jupiter", "Venus", "Saturn"], enemies: [] },
  Mars:    { friends: ["Sun", "Moon", "Jupiter"], neutrals: ["Venus", "Saturn"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], neutrals: ["Mars", "Jupiter", "Saturn"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], neutrals: ["Saturn"], enemies: ["Mercury", "Venus"] },
  Venus:   { friends: ["Mercury", "Saturn"], neutrals: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"] },
  Saturn:  { friends: ["Mercury", "Venus"], neutrals: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] },
};

export interface KootScore {
  name:        string;
  hindiName:   string;
  points:      number;
  maxPoints:   number;
  percentage:  number;
  status:      "Excellent" | "Good" | "Average" | "Poor";
  color:       string;
  meaning:     string;
  detail:      string;
  hasDosha:    boolean;
  doshaText:   string;
}

export interface MilanResult {
  person1Name:    string;
  person2Name:    string;
  person1Nak:     string;
  person2Nak:     string;
  person1Rashi:   string;
  person2Rashi:   string;
  koots:          KootScore[];
  totalScore:     number;
  maxScore:       36;
  percentage:     number;
  verdict:        string;
  verdictColor:   string;
  verdictIcon:    string;
  recommendation: string;
  doshas:         string[];
  psychologicalInsight: string;
}

function kootStatus(pct: number): "Excellent"|"Good"|"Average"|"Poor" {
  if (pct >= 75) return "Excellent";
  if (pct >= 50) return "Good";
  if (pct >= 25) return "Average";
  return "Poor";
}
function kootColor(pct: number): string {
  if (pct >= 75) return "#22c55e";
  if (pct >= 50) return "#c8a030";
  if (pct >= 25) return "#f97316";
  return "#ef4444";
}

export function calculateMilan(
  name1: string, nak1: number, rashi1: number,
  name2: string, nak2: number, rashi2: number
): MilanResult {

  // 1. VARNA (max 1) — Based on Moon Rashi (Parashara Standard)
  const v1 = RASHI_VARNA_ORDER[rashi1 % 12];
  const v2 = RASHI_VARNA_ORDER[rashi2 % 12];
  const varnaScore = v1 >= v2 ? 1 : 0;

  // 2. VASHYA (max 2) — Rashi groups:
  // 0: Chatushpada (Aries, Taurus, Sag 2nd half, Cap 1st half)
  // 1: Manava / Dwipada (Gemini, Virgo, Libra, Sag 1st half, Aquarius)
  // 2: Jalachara (Cancer, Pisces, Cap 2nd half)
  // 3: Keeta (Scorpio)
  // 4: Vanachara (Leo)
  const vashyaGroup = [0, 0, 1, 2, 4, 1, 1, 3, 1, 0, 1, 2];
  const vg1 = vashyaGroup[rashi1 % 12];
  const vg2 = vashyaGroup[rashi2 % 12];
  const vashyaScore = vg1 === vg2 ? 2 : (vg1 === 1 && (vg2 === 0 || vg2 === 2)) ? 1 : (vg1 === 4 && (vg2 === 0 || vg2 === 2)) ? 1 : 0.5;

  // 3. TARA (max 3) — Bidirectional classical counting (Boy->Girl + Girl->Boy)
  // 1-indexed count % 9: 3 (Vipat), 5 (Pratyak), 7 (Naidhana) are inauspicious (0 pts); others are auspicious (1.5 pts)
  const count1to2 = ((nak2 - nak1 + 27) % 27) + 1;
  const count2to1 = ((nak1 - nak2 + 27) % 27) + 1;
  const tara1 = count1to2 % 9;
  const tara2 = count2to1 % 9;
  const t1Score = [3, 5, 7].includes(tara1) ? 0 : 1.5;
  const t2Score = [3, 5, 7].includes(tara2) ? 0 : 1.5;
  const taraScore = t1Score + t2Score;

  // 4. YONI (max 4) — 14 Animal Matrix
  const y1 = NK_YONI[nak1];
  const y2 = NK_YONI[nak2];
  let yoniScore = 2; // default neutral
  if (y1 === y2) {
    yoniScore = 4;
  } else if (SWORN_ENEMY_YONI_PAIRS.some(([a, b]) => (a === y1 && b === y2) || (a === y2 && b === y1))) {
    yoniScore = 0; // Sworn enemies (Vaira)
  } else if (FRIENDLY_YONI_PAIRS.some(([a, b]) => (a === y1 && b === y2) || (a === y2 && b === y1))) {
    yoniScore = 3; // Friendly
  } else {
    // Check general enmity / mild friction
    yoniScore = (y1 === "Mrig" && y2 === "Vyaghra") || (y1 === "Vyaghra" && y2 === "Mrig") ? 1 : 2;
  }

  // 5. GRAHA MAITRI (max 5) — Parashara Natural Relationship
  const lord1 = RASHI_LORD[rashi1 % 12];
  const lord2 = RASHI_LORD[rashi2 % 12];
  let maitriScore = 1;
  if (lord1 === lord2) {
    maitriScore = 5;
  } else {
    const rel12 = PARASHARA_RELATIONS[lord1]?.friends.includes(lord2) ? "friend" : PARASHARA_RELATIONS[lord1]?.neutrals.includes(lord2) ? "neutral" : "enemy";
    const rel21 = PARASHARA_RELATIONS[lord2]?.friends.includes(lord1) ? "friend" : PARASHARA_RELATIONS[lord2]?.neutrals.includes(lord1) ? "neutral" : "enemy";
    if (rel12 === "friend" && rel21 === "friend") maitriScore = 5;
    else if ((rel12 === "friend" && rel21 === "neutral") || (rel12 === "neutral" && rel21 === "friend")) maitriScore = 4;
    else if (rel12 === "neutral" && rel21 === "neutral") maitriScore = 3;
    else if ((rel12 === "friend" && rel21 === "enemy") || (rel12 === "enemy" && rel21 === "friend")) maitriScore = 1;
    else if ((rel12 === "neutral" && rel21 === "enemy") || (rel12 === "enemy" && rel21 === "neutral")) maitriScore = 0.5;
    else maitriScore = 0;
  }

  // 6. GANA (max 6) — temperament
  const g1 = NK_GANA[nak1], g2 = NK_GANA[nak2];
  const ganaScore = g1 === g2 ? 6 : ((g1==="Deva"&&g2==="Manushya")||(g1==="Manushya"&&g2==="Deva")) ? 5 : 0;

  // 7. BHAKUT (max 7) — rashi distance
  // Classical Inauspicious pairs: 6/8 (Shadashtaka), 2/12 (Dvidvadasha), 5/9 (Navapanchama without friendship)
  // Auspicious pairs: 1/1 (Eka Rashi), 3/11 (Tritiya-Ekadasha), 4/10 (Kendra), 7/7 (Saptama)
  const rashiDiff = ((rashi2 - rashi1 + 12) % 12) + 1;
  const isDirectInauspicious = [2, 12, 6, 8].includes(rashiDiff);
  const isNavapanchama = [5, 9].includes(rashiDiff);
  
  // Parihara for 5/9 (Navapanchama): canceled if lords are mutual friends or same
  // Parihara for 6/8 (Shadashtaka): canceled if lords are same (e.g. Aries-Scorpio, Taurus-Libra)
  const isMutualFriends = lord1 === lord2 || (
    PARASHARA_RELATIONS[lord1]?.friends.includes(lord2) &&
    PARASHARA_RELATIONS[lord2]?.friends.includes(lord1)
  );

  let bhakutScore = 7;
  let bhakutHasDosha = false;
  if (isDirectInauspicious) {
    if ((rashiDiff === 6 || rashiDiff === 8) && lord1 === lord2) {
      bhakutScore = 7; // Shadashtaka parihara by same lord
      bhakutHasDosha = false;
    } else {
      bhakutScore = 0;
      bhakutHasDosha = true;
    }
  } else if (isNavapanchama) {
    if (isMutualFriends) {
      bhakutScore = 7; // Navapanchama parihara by friendly lords
      bhakutHasDosha = false;
    } else {
      bhakutScore = 0;
      bhakutHasDosha = true;
    }
  }

  // 8. NADI (max 8) — biological compatibility (same nadi = dosha)
  const nadiScore = NK_NADI[nak1] === NK_NADI[nak2] ? 0 : 8;

  const total = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakutScore + nadiScore;
  const pct   = Math.round(total / 36 * 100);

  const koots: KootScore[] = [
    {
      name:"Varna", hindiName:"वर्ण", points:varnaScore, maxPoints:1,
      percentage:varnaScore*100,
      meaning:"Value System & Spiritual Hierarchy",
      detail:`${name1}'s varna: ${RASHI_VARNA_NAMES[rashi1 % 12]} | ${name2}'s varna: ${RASHI_VARNA_NAMES[rashi2 % 12]}. ${varnaScore === 1 ? "Harmonious value compatibility." : "Requires mutual respect for different spiritual temperaments."}`,
      hasDosha:false, doshaText:"",
      status:kootStatus(varnaScore*100), color:kootColor(varnaScore*100),
    },
    {
      name:"Vashya", hindiName:"वश्य", points:vashyaScore, maxPoints:2,
      percentage:Math.round(vashyaScore/2*100),
      meaning:"Mutual Attraction & Control Dynamics",
      detail:`Rashi vashya compatibility: ${vashyaScore === 2 ? "Same group — deep natural attraction." : vashyaScore === 1 ? "Harmonious mutual pull." : "Moderate dominance balance."}`,
      hasDosha:false, doshaText:"",
      status:kootStatus(Math.round(vashyaScore/2*100)), color:kootColor(Math.round(vashyaScore/2*100)),
    },
    {
      name:"Tara", hindiName:"तारा", points:taraScore, maxPoints:3,
      percentage:Math.round(taraScore/3*100),
      meaning:"Luck Harmony & Star Compatibility",
      detail:`Bidirectional Tara: ${taraScore === 3 ? "Auspicious stars in both directions — mutual fortune aligned." : taraScore === 1.5 ? "Partially supportive star alignment — stable with mutual care." : "Inauspicious stars — recurring karmic hurdles possible."}`,
      hasDosha:taraScore===0, doshaText:taraScore===0?"Tara indicates recurring karmic friction.":"",
      status:kootStatus(Math.round(taraScore/3*100)), color:kootColor(Math.round(taraScore/3*100)),
    },
    {
      name:"Yoni", hindiName:"योनि", points:yoniScore, maxPoints:4,
      percentage:Math.round(yoniScore/4*100),
      meaning:"Instinct & Physical Compatibility",
      detail:`${name1}'s yoni: ${y1} | ${name2}'s yoni: ${y2}. ${yoniScore===4?"Same yoni — deep instinctual harmony and physical compatibility.":yoniScore===3?"Friendly yoni — strong mutual comfort.":yoniScore===2?"Neutral yoni — balanced instinctual dynamic.":yoniScore===1?"Inimical yoni — requires conscious emotional patience.":"Sworn enemy yoni — instinctive friction."}`,
      hasDosha:yoniScore<=1, doshaText:yoniScore===0?"Yoni Vaira Dosha — sworn instinctual opposition.":yoniScore===1?"Yoni Shatru — instinctual friction.":"",
      status:kootStatus(Math.round(yoniScore/4*100)), color:kootColor(Math.round(yoniScore/4*100)),
    },
    {
      name:"Graha Maitri", hindiName:"ग्रह मैत्री", points:maitriScore, maxPoints:5,
      percentage:Math.round(maitriScore/5*100),
      meaning:"Mental Friendship & Intellectual Bond",
      detail:`Rashi lords: ${lord1} & ${lord2}. ${lord1===lord2?"Same lord — perfect mental alignment.":maitriScore>=4?"Mutual planetary friendship — strong intellectual bond.":maitriScore===3?"Neutral planetary relations — practical working bond.":"Neutral/enemy relation — conscious communication needed."}`,
      hasDosha:maitriScore<=1, doshaText:maitriScore<=1?"Graha Maitri Dosha — mental wavelength gap.":"",
      status:kootStatus(Math.round(maitriScore/5*100)), color:kootColor(Math.round(maitriScore/5*100)),
    },
    {
      name:"Gana", hindiName:"गण", points:ganaScore, maxPoints:6,
      percentage:Math.round(ganaScore/6*100),
      meaning:"Temperament & Nature Compatibility",
      detail:`${name1}'s gana: ${g1} | ${name2}'s gana: ${g2}. ${g1===g2?"Same gana — identical temperament, deeply harmonious.":ganaScore===5?"Deva-Manushya — good match, minor temperament differences.":"Rakshasa involved — strong temperament clash. Requires patience."}`,
      hasDosha:ganaScore===0, doshaText:ganaScore===0?"Gana Dosha — major temperament conflict.":"",
      status:kootStatus(Math.round(ganaScore/6*100)), color:kootColor(Math.round(ganaScore/6*100)),
    },
    {
      name:"Bhakut", hindiName:"भकूट", points:bhakutScore, maxPoints:7,
      percentage:Math.round(bhakutScore/7*100),
      meaning:"Emotional Direction & Life Flow",
      detail:`Rashi distance: ${rashiDiff}. ${bhakutScore===0?"Bhakut Dosha — emotional directions are opposed. Financial and health challenges possible.":isNavapanchama && isMutualFriends?"Navapanchama (5/9) with mutual friendship of rashi lords — Bhakoot Dosha parihara applies.":"Favorable bhakut — emotional energy flows in harmony."}`,
      hasDosha:bhakutHasDosha, doshaText:bhakutHasDosha?"Bhakut Dosha — emotional opposition, financial strain possible.":"",
      status:kootStatus(Math.round(bhakutScore/7*100)), color:kootColor(Math.round(bhakutScore/7*100)),
    },
    {
      name:"Nadi", hindiName:"नाड़ी", points:nadiScore, maxPoints:8,
      percentage:Math.round(nadiScore/8*100),
      meaning:"Health, DNA & Biological Compatibility",
      detail:`${name1}'s nadi: ${NK_NADI[nak1]} | ${name2}'s nadi: ${NK_NADI[nak2]}. ${nadiScore===0?"SAME NADI — Nadi Dosha present. Potential health issues in children. Consult a jyotishi.":"Different nadi — excellent biological compatibility."}`,
      hasDosha:nadiScore===0, doshaText:nadiScore===0?"Nadi Dosha — same nadi, biological incompatibility risk.":"",
      status:kootStatus(Math.round(nadiScore/8*100)), color:kootColor(Math.round(nadiScore/8*100)),
    },
  ];

  const doshas = koots.filter(k=>k.hasDosha).map(k=>k.doshaText);

  let verdict="", verdictColor="", verdictIcon="", recommendation="";
  if (total >= 28) {
    verdict="Excellent Match"; verdictColor="#22c55e"; verdictIcon="✅";
    recommendation="This is a highly compatible match. Both partners will support each other's growth, health, and prosperity. Proceed with confidence.";
  } else if (total >= 21) {
    verdict="Good Match"; verdictColor="#84cc16"; verdictIcon="👍";
    recommendation="A good match with minor differences. With mutual understanding and respect, this relationship will flourish. Address any doshas with remedies.";
  } else if (total >= 18) {
    verdict="Average Match"; verdictColor="#f59e0b"; verdictIcon="⚡";
    recommendation="Some compatibility challenges exist. Requires conscious effort, communication, and possibly astrological remedies to make it work well.";
  } else {
    verdict="Careful Needed"; verdictColor="#ef4444"; verdictIcon="⚠️";
    recommendation="Significant incompatibilities detected. Consult an experienced jyotishi before proceeding. Remedies and deeper chart analysis recommended.";
  }

  const ganaMap: Record<string,string> = { Deva:"spiritual, gentle, idealistic", Manushya:"practical, balanced, worldly", Rakshasa:"intense, passionate, fierce" };
  const psychologicalInsight = `${name1} (${g1} gana — ${ganaMap[g1]}) meets ${name2} (${g2} gana — ${ganaMap[g2]}). `+
    `Their rashi lords ${lord1} & ${lord2} ${lord1===lord2?"are the same — shared mental wavelength":"show "+(maitriScore>=4?"mutual":maitriScore>=1?"partial":"minimal")+" planetary friendship"}. `+
    `${doshas.length===0?"No major doshas — a clean compatibility profile.":doshas.length===1?"One dosha present — manageable with remedies.":"Multiple doshas — careful analysis needed before commitment."}`;

  return {
    person1Name:name1, person2Name:name2,
    person1Nak:NAKSHATRAS_27[nak1], person2Nak:NAKSHATRAS_27[nak2],
    person1Rashi:RASHIS_12[rashi1], person2Rashi:RASHIS_12[rashi2],
    koots, totalScore:total, maxScore:36, percentage:pct,
    verdict, verdictColor, verdictIcon, recommendation, doshas, psychologicalInsight,
  };
}
