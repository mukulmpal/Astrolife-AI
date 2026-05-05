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
const VARNA_ORDER: Record<string,number> = { Brahmin:3, Kshatriya:2, Vaishya:1, Shudra:0 };

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

  // 1. VARNA (max 1)
  const varnaScore = (VARNA_ORDER[NK_VARNA[nak1]] ?? 0) >= (VARNA_ORDER[NK_VARNA[nak2]] ?? 0) ? 1 : 0;

  // 2. VASHYA (max 2) — rashi group compatibility
  const vashyaGroup = [1,2,1,3,1,2,1,2,2,3,3,3];
  const vashyaScore = vashyaGroup[rashi1 % 12] === vashyaGroup[rashi2 % 12] ? 2 : 1;

  // 3. TARA (max 3) — nakshatra count from 1→2, check if in friendly set
  const taraDiff = ((nak2 - nak1 + 27) % 27) % 9;
  const taraScore = [1,3,5,7].includes(taraDiff) ? 0 : 3;

  // 4. YONI (max 4) — animal instinct compatibility
  const yoniScore = NK_YONI[nak1] === NK_YONI[nak2] ? 4 : 3;

  // 5. GRAHA MAITRI (max 5) — rashi lord friendship
  const lord1 = RASHI_LORD[rashi1 % 12];
  const lord2 = RASHI_LORD[rashi2 % 12];
  const f12   = (PLANET_FRIENDS[lord1] ?? []).includes(lord2);
  const f21   = (PLANET_FRIENDS[lord2] ?? []).includes(lord1);
  const maitriScore = lord1 === lord2 ? 5 : (f12 && f21) ? 4 : (f12 || f21) ? 3 : 1;

  // 6. GANA (max 6) — temperament
  const g1 = NK_GANA[nak1], g2 = NK_GANA[nak2];
  const ganaScore = g1 === g2 ? 6 : ((g1==="Deva"&&g2==="Manushya")||(g1==="Manushya"&&g2==="Deva")) ? 5 : 0;

  // 7. BHAKUT (max 7) — rashi distance
  const rashiDiff = ((rashi2 - rashi1 + 12) % 12) + 1;
  const bhakutScore = [2,6,5,9,3,11].includes(rashiDiff) ? 0 : 7;

  // 8. NADI (max 8) — biological compatibility (same nadi = dosha)
  const nadiScore = NK_NADI[nak1] === NK_NADI[nak2] ? 0 : 8;

  const total = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakutScore + nadiScore;
  const pct   = Math.round(total / 36 * 100);

  const koots: KootScore[] = [
    {
      name:"Varna", hindiName:"वर्ण", points:varnaScore, maxPoints:1,
      percentage:varnaScore*100,
      meaning:"Value System & Spiritual Hierarchy",
      detail:`${name1}'s varna: ${NK_VARNA[nak1]} | ${name2}'s varna: ${NK_VARNA[nak2]}. Indicates value compatibility and life purpose alignment.`,
      hasDosha:false, doshaText:"",
      status:kootStatus(varnaScore*100), color:kootColor(varnaScore*100),
    },
    {
      name:"Vashya", hindiName:"वश्य", points:vashyaScore, maxPoints:2,
      percentage:Math.round(vashyaScore/2*100),
      meaning:"Mutual Attraction & Control Dynamics",
      detail:`Rashi groups: ${RASHIS_12[rashi1]} (group ${vashyaGroup[rashi1%12]}) & ${RASHIS_12[rashi2]} (group ${vashyaGroup[rashi2%12]}). Indicates natural pull and dominance balance.`,
      hasDosha:false, doshaText:"",
      status:kootStatus(Math.round(vashyaScore/2*100)), color:kootColor(Math.round(vashyaScore/2*100)),
    },
    {
      name:"Tara", hindiName:"तारा", points:taraScore, maxPoints:3,
      percentage:Math.round(taraScore/3*100),
      meaning:"Luck Harmony & Star Compatibility",
      detail:`Nakshatra distance: ${taraDiff}. ${taraScore===0 ? "Unfavorable tara — relationship may face recurring obstacles." : "Favorable tara — mutual luck and destiny are aligned."}`,
      hasDosha:taraScore===0, doshaText:taraScore===0?"Tara indicates recurring karmic friction.":"",
      status:kootStatus(Math.round(taraScore/3*100)), color:kootColor(Math.round(taraScore/3*100)),
    },
    {
      name:"Yoni", hindiName:"योनि", points:yoniScore, maxPoints:4,
      percentage:Math.round(yoniScore/4*100),
      meaning:"Instinct & Physical Compatibility",
      detail:`${name1}'s yoni: ${NK_YONI[nak1]} | ${name2}'s yoni: ${NK_YONI[nak2]}. ${yoniScore===4?"Same yoni — deep instinctual harmony and physical compatibility.":"Different yoni — compatibility requires conscious effort."}`,
      hasDosha:false, doshaText:"",
      status:kootStatus(Math.round(yoniScore/4*100)), color:kootColor(Math.round(yoniScore/4*100)),
    },
    {
      name:"Graha Maitri", hindiName:"ग्रह मैत्री", points:maitriScore, maxPoints:5,
      percentage:Math.round(maitriScore/5*100),
      meaning:"Mental Friendship & Intellectual Bond",
      detail:`Rashi lords: ${lord1} & ${lord2}. ${lord1===lord2?"Same lord — perfect mental alignment.":f12&&f21?"Mutual friendship — strong intellectual bond.":f12||f21?"One-sided friendship — mental misunderstandings possible.":"Neutral/enemy — mental disconnect, communication effort needed."}`,
      hasDosha:false, doshaText:"",
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
      detail:`Rashi distance: ${rashiDiff}. ${bhakutScore===0?"Bhakut Dosha — emotional directions are opposed. Financial and health challenges possible.":"Favorable bhakut — emotional energy flows in the same direction."}`,
      hasDosha:bhakutScore===0, doshaText:bhakutScore===0?"Bhakut Dosha — emotional opposition, financial strain possible.":"",
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
    `Their rashi lords ${lord1} & ${lord2} ${lord1===lord2?"are the same — shared mental wavelength":"show "+(f12&&f21?"mutual":(f12||f21)?"partial":"minimal")+" planetary friendship"}. `+
    `${doshas.length===0?"No major doshas — a clean compatibility profile.":doshas.length===1?"One dosha present — manageable with remedies.":"Multiple doshas — careful analysis needed before commitment."}`;

  return {
    person1Name:name1, person2Name:name2,
    person1Nak:NAKSHATRAS_27[nak1], person2Nak:NAKSHATRAS_27[nak2],
    person1Rashi:RASHIS_12[rashi1], person2Rashi:RASHIS_12[rashi2],
    koots, totalScore:total, maxScore:36, percentage:pct,
    verdict, verdictColor, verdictIcon, recommendation, doshas, psychologicalInsight,
  };
}
