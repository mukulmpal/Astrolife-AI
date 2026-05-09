import { computePlanets, computeLagna, RASHIS } from "./calculations";

export type PrashnaTopic = "career" | "marriage" | "health" | "finance" | "travel" | "education" | "property" | "legal" | "child" | "general";

const LAGNA_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
const TOPIC_HOUSES: Record<PrashnaTopic, {positive: number[]; negative: number[]; karaka: string; primary: number}> = {
  career: {positive:[2,6,10,11], negative:[6,8,12], karaka:'Saturn', primary:10},
  marriage: {positive:[2,7,11], negative:[6,8,12], karaka:'Venus', primary:7},
  health: {positive:[1,6,11], negative:[6,8,12], karaka:'Sun', primary:1},
  finance: {positive:[2,5,9,11], negative:[8,12], karaka:'Jupiter', primary:2},
  travel: {positive:[3,9,12], negative:[8], karaka:'Mercury', primary:9},
  education: {positive:[4,5,9], negative:[6,8], karaka:'Mercury', primary:5},
  property: {positive:[4,9,11], negative:[6,8,12], karaka:'Moon', primary:4},
  legal: {positive:[1,6,11], negative:[7,12], karaka:'Mars', primary:6},
  child: {positive:[2,5,11], negative:[6,8,12], karaka:'Jupiter', primary:5},
  general: {positive:[1,5,9,11], negative:[6,8,12], karaka:'Sun', primary:1},
};

export interface PrashnaResult {
  verdict: "yes_strong" | "yes_possible" | "mixed" | "no_delay" | "no_unlikely";
  icon: string;
  color: string;
  title: string;
  detail: string;
  score: number;
  lagnaRashi: string;
  moonHouse: number;
  positiveFactors: string[];
  negativeFactors: string[];
  question: string;
  topic: PrashnaTopic;
}

export function calculatePrashna(question: string, topic: PrashnaTopic, lat: number, lon: number, tz: number): PrashnaResult {
  void tz;
  const now = new Date();
  const jd = now.getTime() / 86400000 + 2440587.5;
  
  const lagnaLon = computeLagna(jd, lat, lon);
  const lagnaNum = Math.floor((lagnaLon % 360) / 30) % 12;
  const lagnaRashi = RASHIS[lagnaNum];
  
  const planets = computePlanets(jd);
  const moonLon = planets.Moon || 0;
  const moonHouse = Math.floor(((moonLon % 360) - (lagnaLon % 360) + 360) % 360 / 30) % 12 + 1;
  
  const th = TOPIC_HOUSES[topic];
  const lagnaLord = LAGNA_LORDS[lagnaNum];
  const lagnaLordData = planets[lagnaLord];
  const lagnaLordHouse = lagnaLordData ? Math.floor(((lagnaLordData % 360) - (lagnaLon % 360) + 360) % 360 / 30) % 12 + 1 : 1;
  
  let score = 0;
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  
  if (th.positive.includes(lagnaLordHouse)) { score += 2; positiveFactors.push(`Lagna lord ${lagnaLord} in H${lagnaLordHouse}`); }
  else if (th.negative.includes(lagnaLordHouse)) { score -= 2; negativeFactors.push(`Lagna lord ${lagnaLord} in H${lagnaLordHouse} (challenging)`); }
  
  if (th.positive.includes(moonHouse)) { score += 2; positiveFactors.push(`Moon in H${moonHouse} (favorable)`); }
  else if (th.negative.includes(moonHouse)) { score -= 1; negativeFactors.push(`Moon in H${moonHouse} (weak)`); }
  
  const jupiterData = planets.Jupiter;
  const jupiterHouse = jupiterData ? Math.floor(((jupiterData % 360) - (lagnaLon % 360) + 360) % 360 / 30) % 12 + 1 : 1;
  if (th.positive.includes(jupiterHouse)) { score += 1; positiveFactors.push(`Jupiter in favorable house`); }
  
  const verdict = score >= 4 ? 'yes_strong' : score >= 2 ? 'yes_possible' : score >= 0 ? 'mixed' : 'no_delay';
  const verdictData = {
    yes_strong: {icon: '✅', color: '#22c55e', title: 'HAAN — Bahut Shubh!', detail: 'Multiple strong positive indicators. Kaarya safal hoga.'},
    yes_possible: {icon: '🟡', color: '#fbbf24', title: 'SAMBHAV — Thodi Deri', detail: 'Mixed signals. Kuch obstacles hain. Thoda sabr rakhein.'},
    mixed: {icon: '⚠️', color: '#f97316', title: 'ACHHA NAHI', detail: 'Abhi samay anukool nahi. Wait karein.'},
    no_delay: {icon: '❌', color: '#ef4444', title: 'NAHI — Abhi Nahi', detail: 'Strong negative indicators. Upay karein.'},
    no_unlikely: {icon: '🔴', color: '#dc2626', title: 'NAHI — Unlikely', detail: 'Chart suggests delay or no.'},
  };
  
  const vdata = verdictData[verdict];
  return {
    verdict,
    icon: vdata.icon,
    color: vdata.color,
    title: vdata.title,
    detail: vdata.detail,
    score,
    lagnaRashi,
    moonHouse,
    positiveFactors,
    negativeFactors,
    question,
    topic,
  };
}
