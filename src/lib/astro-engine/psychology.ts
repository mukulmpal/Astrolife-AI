// ============================================================
// ASTROLIFE PSYCHOLOGY ENGINE v2.0
// Extracted from AstroLife_v20_SwissEphem_Accurac
// 9 Psychological Functions · Pattern Analysis · Indices
// ============================================================

export interface PsychPlanet {
  planet:    string;
  icon:      string;
  color:     string;
  func:      string;
  trait:     string;
  cog:       string;
  strong:    string;
  weak:      string;
  strength:  number;
  status:    "Strong" | "Moderate" | "Weak/Blocked";
  statusColor: string;
  house:     number;
  sign:      string;
  retrograde:boolean;
  dignity:   string;
}

export interface PsychPattern {
  name:       string;
  desc:       string;
  shadow:     string;
  anxietyIdx: number;
  karmaLoop:  number;
  behavBias:  number;
  radarVals:  number[];
}

export interface PsychResult {
  planets:  PsychPlanet[];
  pattern:  PsychPattern;
  dominantFunctions: string[];
  riskFlags: { title: string; detail: string; severity: "low" | "medium" | "high" }[];
  stabilizers: string[];
  growthPlan: string[];
  summary:  string;
}

interface PD {
  house:      number;
  sign:       string;
  signNum:    number;
  retrograde: boolean;
  dignity:    string;
  lon:        number;
}

// ── Constants ─────────────────────────────────────────────────
const PLS   = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PEMO  = ["☉","☽","♂","☿","♃","♀","♄","☊","☋"];
const PCOL  = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa","#a78bfa","#fb7185"];

const md = (x: number, m: number) => ((x % m) + m) % m;

// Psychological functions for each planet
const PSYCH_DATA: Record<string,{func:string;trait:string;cog:string;strong:string;weak:string}> = {
  Sun: {
    func:   "Ego & Identity",
    trait:  "Core identity strength",
    cog:    "Self-actualization drive, authority need",
    strong: "Confident, decisive, natural leader",
    weak:   "Ego problems, daddy issues, arrogance",
  },
  Moon: {
    func:   "Emotional Memory",
    trait:  "Emotional processing style",
    cog:    "Stores emotional experiences, shapes reactions",
    strong: "Empathetic, intuitive, emotionally intelligent",
    weak:   "Anxiety, mood disorders, mother attachment issues",
  },
  Mars: {
    func:   "Reaction Impulse",
    trait:  "Stress response pattern",
    cog:    "Fight-or-flight trigger, assertion mechanism",
    strong: "Courageous, action-oriented, sexually healthy",
    weak:   "Anger issues, impulsive decisions, aggression",
  },
  Mercury: {
    func:   "Logical Processing",
    trait:  "Cognitive processing style",
    cog:    "Analytical reasoning, communication style",
    strong: "Sharp mind, excellent communicator, adaptable",
    weak:   "Overthinking, anxiety, nervous disorders",
  },
  Jupiter: {
    func:   "Belief System",
    trait:  "Values and belief architecture",
    cog:    "Framework of meaning, values, ethics, faith",
    strong: "Optimistic, wise, ethically grounded",
    weak:   "Over-expansion, unrealistic expectations, rigid beliefs",
  },
  Venus: {
    func:   "Attraction & Pleasure",
    trait:  "Bonding and pleasure patterns",
    cog:    "Reward system, aesthetic sense, bonding",
    strong: "Loving, creative, harmonious relationships",
    weak:   "Attachment issues, vanity, relationship dependency",
  },
  Saturn: {
    func:   "Fear & Discipline Loops",
    trait:  "Karmic learning mechanism",
    cog:    "Limitation perception, fear-based learning",
    strong: "Disciplined, patient, structured",
    weak:   "Depression, fear, excessive self-criticism, loneliness",
  },
  Rahu: {
    func:   "Obsession Driver",
    trait:  "Desire and craving patterns",
    cog:    "Craving, ambition, unfulfilled desires",
    strong: "Innovation, breaking old patterns, ambition",
    weak:   "Obsessive behavior, addiction tendencies, anxiety",
  },
  Ketu: {
    func:   "Detachment Mechanism",
    trait:  "Detachment and liberation pattern",
    cog:    "Dissolution, spiritual bypassing, past life memory",
    strong: "Spiritual insight, past life skills, liberation",
    weak:   "Dissociation, apathy, feeling lost or ungrounded",
  },
};

// ── MAIN CALCULATOR ───────────────────────────────────────────
export function calculatePsychology(planets: Record<string,PD>): PsychResult {

  // ── Planet profiles ───────────────────────────────────────
  const psychPlanets: PsychPlanet[] = PLS.map((planet, pi) => {
    const pd = planets[planet];
    if (!pd) return null;

    const pp = PSYCH_DATA[planet];
    const isStrong    = pd.dignity?.includes("Exalted") || pd.dignity?.includes("Own") || pd.dignity?.includes("Moolatrikona") || [1,4,7,10].includes(pd.house);
    const isAfflicted = pd.dignity?.includes("Debilitated") || [6,8,12].includes(pd.house) || pd.retrograde;

    const strength = isStrong ? 80 : isAfflicted ? 30 : 55;
    const status: "Strong"|"Moderate"|"Weak/Blocked" =
      isStrong ? "Strong" : isAfflicted ? "Weak/Blocked" : "Moderate";
    const statusColor =
      isStrong ? "#22c55e" : isAfflicted ? "#ef4444" : "#f59e0b";

    return {
      planet,
      icon:      PEMO[pi],
      color:     PCOL[pi],
      func:      pp.func,
      trait:     pp.trait,
      cog:       pp.cog,
      strong:    pp.strong,
      weak:      pp.weak,
      strength,
      status,
      statusColor,
      house:     pd.house,
      sign:      pd.sign,
      retrograde:pd.retrograde,
      dignity:   pd.dignity || "",
    };
  }).filter(Boolean) as PsychPlanet[];

  // ── Pattern analysis ──────────────────────────────────────
  const sat    = planets.Saturn;
  const moon   = planets.Moon;
  const rahu   = planets.Rahu;
  const mars   = planets.Mars;
  const jupit  = planets.Jupiter;
  const merc   = planets.Mercury;
  const venus  = planets.Venus;

  const satWeak  = sat  && (sat.dignity?.includes("Debilitated") || [6,8,12].includes(sat.house));
  const moonWeak = moon && [6,8,12].includes(moon.house);

  let patternName = "";
  let patternDesc = "";
  let shadow      = "";

  if (satWeak && moonWeak) {
    patternName = "Anxiety Architect";
    patternDesc = "Fear loops (Saturn) amplified by emotional memory wounds (Moon). Life lived in fear of abandonment and failure. Hyper-vigilant emotional system that anticipates threat.";
    shadow      = "Must consciously challenge fear-based decisions. Daily gratitude practice. Therapy for mother relationship. Saturn mantra and Moon strengthening rituals.";
  } else if (rahu && (rahu.house === 1 || rahu.house === 7)) {
    patternName = "Obsessive Achiever";
    patternDesc = "Rahu in axis of self/other creates deep craving for identity recognition or relationship validation. Driven but never fully satisfied. The hunger that cannot be fed.";
    shadow      = "Risk of addiction or relationship dependency. Practice mindfulness. Spiritual discipline needed. Ketu practices to balance Rahu obsession.";
  } else if (jupit && (jupit.dignity?.includes("Exalted") || jupit.house === 1 || jupit.house === 5)) {
    patternName = "Wisdom Seeker";
    patternDesc = "Jupiter dominant personality. Natural teacher, philosopher, guide. Life guided by dharmic principles. Seeks meaning before action. High moral standards.";
    shadow      = "Guard against over-expansion, dogmatism, or excessive optimism. Grounding practices needed. Balance idealism with practicality.";
  } else if (mars && (mars.house === 1 || mars.house === 10)) {
    patternName = "Action Warrior";
    patternDesc = "Mars dominant. Drive and aggression define personality. Results-oriented at core. Initiator, pioneer, fearless. Impatient with slow processes.";
    shadow      = "Anger management essential. Slow down and reflect before acting. Channel energy constructively. Sports, physical discipline help.";
  } else if (merc && (merc.dignity?.includes("Exalted") || merc.house === 1)) {
    patternName = "Analytical Mind";
    patternDesc = "Mercury dominant personality. Thinks before feeling. Processes world through logic and language. Excellent communicator, sharp analyst. Mind never rests.";
    shadow      = "Risk of over-analysis and paralysis. Emotional intelligence needs development. Practice being present in body.";
  } else if (venus && (venus.dignity?.includes("Exalted") || venus.house === 1 || venus.house === 7)) {
    patternName = "Pleasure Seeker";
    patternDesc = "Venus dominant. Beauty, harmony, and pleasure are core values. Natural artist, lover, diplomat. Avoids conflict instinctively. Seeks comfort and aesthetics.";
    shadow      = "Risk of avoidance behavior and comfort addiction. Needs to develop conflict tolerance. Balance pleasure with discipline.";
  } else if (moon && moon.dignity?.includes("Exalted")) {
    patternName = "Emotional Empath";
    patternDesc = "Moon dominant. Highly empathetic, psychically sensitive, deeply connected to others' feelings. Natural nurturer and counselor. Absorbs environmental energies.";
    shadow      = "Risk of emotional overwhelm and boundary issues. Regular emotional detox needed. Grounding practices essential.";
  } else {
    patternName = "Balanced Seeker";
    patternDesc = "Multiple influences create complex but adaptable psychological profile. No single dominant planet — versatile, multi-faceted, context-dependent responses.";
    shadow      = "Watch for inconsistency. Build one strong dharmic habit. Choose one psychological growth path rather than dabbling in many.";
  }

  // ── Indices ───────────────────────────────────────────────
  const anxietyIdx = Math.min(95, Math.round(
    (satWeak  ? 65 : 35) +
    (moonWeak ? 20 : 5) +
    (rahu && [1,6,7,8,12].includes(rahu.house) ? 10 : 0)
  ));

  const karmaLoop = Math.min(95, Math.round(
    (rahu && rahu.house >= 1 && rahu.house <= 6 ? 55 : 35) +
    (sat  && [8,12].includes(sat.house) ? 20 : 5) +
    (planets.Ketu && planets.Ketu.house === 1 ? 10 : 0)
  ));

  const behavBias = Math.min(95, Math.round(
    (jupit && moon && [0,3,6,9].includes(md(jupit.signNum - moon.signNum, 12)) ? 30 : 55) +
    (mars  && mars.house === 1 ? 15 : 0)
  ));

  const logicIdx  = merc  && (merc.dignity?.includes("Exalted") || [1,4,7,10].includes(merc.house)) ? 80 : 50;
  const wisdomIdx = jupit && (jupit.dignity?.includes("Exalted") || [1,4,7,10].includes(jupit.house)) ? 85 : 50;
  const loveIdx   = venus && (venus.dignity?.includes("Exalted") || [1,4,7,10].includes(venus.house)) ? 80 : 50;

  const radarVals = [anxietyIdx, karmaLoop, behavBias, logicIdx, wisdomIdx, loveIdx];

  // ── Summary ───────────────────────────────────────────────
  const strongCount = psychPlanets.filter(p=>p.status==="Strong").length;
  const weakCount   = psychPlanets.filter(p=>p.status==="Weak/Blocked").length;

  const summary = strongCount >= 5
    ? `Psychological profile shows exceptional planetary strength. ${strongCount} of 9 functions are strong — high mental resilience and emotional intelligence.`
    : weakCount >= 4
    ? `${weakCount} psychological functions are challenged. Conscious shadow work and remedies will significantly improve mental wellbeing.`
    : `Balanced psychological profile with ${strongCount} strong functions. Mixed patterns create a nuanced, adaptable personality.`;

  const dominantFunctions = psychPlanets
    .filter(p=>p.status==="Strong")
    .sort((a,b)=>b.strength-a.strength)
    .slice(0,3)
    .map(p=>`${p.planet}: ${p.func}`);

  const riskFlags: PsychResult["riskFlags"] = [];
  if (anxietyIdx >= 75) {
    riskFlags.push({
      title: "High anxiety loop",
      severity: "high",
      detail: "Saturn/Moon/Rahu stress is strong. Avoid making decisions from fear, panic, or imagined rejection.",
    });
  } else if (anxietyIdx >= 55) {
    riskFlags.push({
      title: "Moderate anxiety sensitivity",
      severity: "medium",
      detail: "Stress can distort timing. Pause before sending important messages or making reactive commitments.",
    });
  }
  if (karmaLoop >= 70) {
    riskFlags.push({
      title: "Repeating karma pattern",
      severity: "medium",
      detail: "Similar people or situations may repeat until the response pattern changes consciously.",
    });
  }
  if (behavBias >= 70) {
    riskFlags.push({
      title: "Behavioral bias active",
      severity: "medium",
      detail: "The chart shows a tendency to over-identify with one response style. Ask for feedback before big choices.",
    });
  }
  psychPlanets
    .filter(p=>p.status==="Weak/Blocked")
    .slice(0,2)
    .forEach(p=>{
      riskFlags.push({
        title: `${p.planet} function blocked`,
        severity: [6,8,12].includes(p.house) ? "high" : "medium",
        detail: `${p.func} needs conscious work: ${p.weak}`,
      });
    });

  const stabilizers = [
    moonWeak ? "Moon stabilizer: sleep rhythm, hydration, journaling, and fewer late-night emotional decisions." : "Moon stabilizer: keep emotional routines steady so intuition stays clean.",
    satWeak ? "Saturn stabilizer: fixed wake time, simple daily discipline, and one completed task before distraction." : "Saturn stabilizer: use structure as support, not self-punishment.",
    rahu && [1,6,7,8,12].includes(rahu.house) ? "Rahu stabilizer: reduce comparison, screen overload, shortcuts, and addictive loops." : "Rahu stabilizer: channel ambition into one measurable goal.",
  ];

  const weakest = psychPlanets.filter(p=>p.status==="Weak/Blocked").slice(0,3);
  const growthPlan = weakest.length
    ? weakest.map(p=>`Work ${p.planet} weekly: strengthen ${p.func.toLowerCase()} through one practical habit and one remedy.`)
    : [
      "Maintain the strong functions with routine, mentorship, and honest feedback.",
      "Pick one shadow pattern each month instead of trying to fix everything at once.",
    ];
  growthPlan.push(`Primary pattern work: ${shadow}`);

  return {
    planets: psychPlanets,
    pattern: { name:patternName, desc:patternDesc, shadow, anxietyIdx, karmaLoop, behavBias, radarVals },
    dominantFunctions,
    riskFlags,
    stabilizers,
    growthPlan,
    summary,
  };
}
