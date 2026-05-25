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

// ── Continuous Psychological Strength Calculator ──────────────────────────────
// Replaces the old binary 80/30/55 — uses dignity + house on a 15-95 scale
// Optional shadbalaPct (0-100) further refines the score when Shadbala is available
function calcPsychStrength(pd: PD, shadbalaPct?: number): number {
  let s = 50;

  // Dignity modifiers (cumulative)
  if (pd.dignity?.includes("Exalted"))      s += 20;
  else if (pd.dignity?.includes("Moolatrikona")) s += 13;
  else if (pd.dignity?.includes("Own"))     s += 10;
  else if (pd.dignity?.includes("Friendly"))s += 5;
  else if (pd.dignity?.includes("Neutral")) s += 0;
  else if (pd.dignity?.includes("Enemy"))   s -= 7;
  else if (pd.dignity?.includes("Debilitated")) s -= 20;

  // House modifiers (Kendra > Trikona > Upachaya > Dusthana)
  if ([1, 4, 7, 10].includes(pd.house))     s += 15; // Kendra — cardinal strength
  else if ([5, 9].includes(pd.house))        s += 12; // Trikona — dharmic clarity
  else if ([2, 11].includes(pd.house))       s += 8;  // Wealth/gain houses
  else if ([3].includes(pd.house))           s -= 2;  // Upachaya — mild tension
  else if ([6].includes(pd.house))           s -= 5;  // 6th — conflict/service
  else if ([8].includes(pd.house))           s -= 10; // 8th — hidden, transforming
  else if ([12].includes(pd.house))          s -= 12; // 12th — loss, dissolution

  // Retrograde modifier: in good house = extra intensity (+5); in dusthana = more blocked (-5)
  if (pd.retrograde) {
    s += [6, 8, 12].includes(pd.house) ? -5 : 5;
  }

  // Optional Shadbala blend: pull toward Shadbala score with 30% weight
  if (shadbalaPct !== undefined) {
    s = Math.round(s * 0.7 + shadbalaPct * 0.3);
  }

  return Math.min(95, Math.max(15, Math.round(s)));
}

// ── MAIN CALCULATOR ───────────────────────────────────────────
// shadbalaPct: optional Record<planet, 0-100> from calculateShadbala().planets[].percentage
export function calculatePsychology(
  planets: Record<string,PD>,
  shadbalaPct?: Record<string, number>
): PsychResult {

  // ── Planet profiles ───────────────────────────────────────
  const psychPlanets: PsychPlanet[] = PLS.map((planet, pi) => {
    const pd = planets[planet];
    if (!pd) return null;

    const pp       = PSYCH_DATA[planet];
    const strength = calcPsychStrength(pd, shadbalaPct?.[planet]);
    const status: "Strong"|"Moderate"|"Weak/Blocked" =
      strength >= 68 ? "Strong" : strength >= 44 ? "Moderate" : "Weak/Blocked";
    const statusColor =
      status === "Strong" ? "#22c55e" : status === "Moderate" ? "#f59e0b" : "#ef4444";

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

  // ── Pattern analysis — 16 pattern library ────────────────
  const sat    = planets.Saturn;
  const moon   = planets.Moon;
  const rahu   = planets.Rahu;
  const ketu   = planets.Ketu;
  const mars   = planets.Mars;
  const jupit  = planets.Jupiter;
  const merc   = planets.Mercury;
  const venus  = planets.Venus;
  const sun    = planets.Sun;

  const satWeak   = sat  && (sat.dignity?.includes("Debilitated")  || [6,8,12].includes(sat.house));
  const satStrong = sat  && (sat.dignity?.includes("Exalted") || sat.dignity?.includes("Own") || [7,10].includes(sat.house));
  const moonWeak  = moon && [6,8,12].includes(moon.house);
  const moonStrong= moon && (moon.dignity?.includes("Exalted") || [1,4].includes(moon.house));
  const marsStrong= mars && (mars.dignity?.includes("Exalted") || [1,10].includes(mars.house));
  const marsWeak  = mars && (mars.dignity?.includes("Debilitated") || [6,8,12].includes(mars.house));
  const jupStrong = jupit && (jupit.dignity?.includes("Exalted") || [1,4,5,7,9].includes(jupit.house));
  const mercStrong= merc  && (merc.dignity?.includes("Exalted") || merc.dignity?.includes("Own") || [1,4].includes(merc.house));
  const venusStrong = venus && (venus.dignity?.includes("Exalted") || [1,4,7].includes(venus.house));
  const sunStrong = sun  && (sun.dignity?.includes("Exalted") || [1,9,10].includes(sun.house));
  const sunWeak   = sun  && (sun.dignity?.includes("Debilitated") || [6,8,12].includes(sun.house));
  const ketuIn12  = ketu && [1,8,12].includes(ketu.house);
  const rahuAxis  = rahu && [1,7].includes(rahu.house);
  const rahuIn369 = rahu && [3,6,9,12].includes(rahu.house);

  interface PatternDef { name: string; desc: string; shadow: string; test: boolean }

  const PATTERNS: PatternDef[] = [
    {
      name: "Anxiety Architect",
      test: !!(satWeak && moonWeak),
      desc: "Fear loops (Saturn) amplified by emotional memory wounds (Moon). Life lived in fear of abandonment and failure. Hyper-vigilant emotional system that anticipates threat before it arrives.",
      shadow: "Must consciously challenge fear-based decisions. Daily gratitude practice. Therapy for mother relationship. Saturn mantra and Moon strengthening rituals.",
    },
    {
      name: "Obsessive Achiever",
      test: !!rahuAxis,
      desc: "Rahu in axis of self/other creates deep craving for identity recognition or relationship validation. Driven but never fully satisfied — the hunger that cannot be fed by achievement alone.",
      shadow: "Risk of addiction or relationship dependency. Practice mindfulness. Spiritual discipline needed. Ketu practices to balance Rahu obsession.",
    },
    {
      name: "Restless Wanderer",
      test: !!(rahuIn369 && !rahuAxis),
      desc: "Rahu in 3rd/6th/9th/12th house creates restlessness, foreign connection, and an insatiable desire for experiences. Life feels like a perpetual journey toward something always just out of reach.",
      shadow: "Risk of never settling — geography, career, or relationships keep changing. Build one stable foundation before expanding further. Mercury + Rahu remedies help.",
    },
    {
      name: "Wisdom Seeker",
      test: !!jupStrong,
      desc: "Jupiter dominant personality. Natural teacher, philosopher, guide. Life guided by dharmic principles. Seeks meaning before action. High moral standards that others sometimes find hard to meet.",
      shadow: "Guard against over-expansion, dogmatism, or excessive optimism. Grounding practices needed. Balance idealism with practical execution.",
    },
    {
      name: "Disciplined Builder",
      test: !!(satStrong && !satWeak),
      desc: "Saturn dominant — strong, not afflicted. Patient, methodical, and deeply disciplined. Success comes through structured effort over time. Others trust and rely on this person's consistency.",
      shadow: "Risk of rigidity, workaholism, and emotional unavailability. Learn to rest without guilt. Relationships need warmth — not just reliability.",
    },
    {
      name: "Action Warrior",
      test: !!(marsStrong && !marsWeak),
      desc: "Mars dominant. Drive and aggression define personality. Results-oriented at core. Initiator, pioneer, fearless. Impatient with slow processes and people who overthink.",
      shadow: "Anger management essential. Slow down and reflect before acting. Channel energy constructively into sports, physical discipline, or leading teams.",
    },
    {
      name: "Suppressed Fire",
      test: !!(marsWeak && !marsStrong),
      desc: "Mars is weakened — blocked assertion, suppressed anger that may surface as passive aggression, chronic frustration, or immune/energy issues. Difficulty saying no or setting firm boundaries.",
      shadow: "Anger needs safe outlets — exercise, martial arts, breathwork. Practice direct communication. Mars mantra and copper remedies on Tuesdays.",
    },
    {
      name: "Analytical Mind",
      test: !!(mercStrong && !jupStrong && !marsStrong),
      desc: "Mercury dominant personality. Thinks before feeling. Processes world through logic and language. Excellent communicator, sharp analyst. Mind never rests — data and categories are home.",
      shadow: "Risk of over-analysis and paralysis. Emotional intelligence needs development. Practice being present in body. Feelings are data too.",
    },
    {
      name: "Pleasure Seeker",
      test: !!(venusStrong && !jupStrong),
      desc: "Venus dominant. Beauty, harmony, and pleasure are core values. Natural artist, lover, diplomat. Avoids conflict instinctively. Seeks comfort and aesthetics in all things.",
      shadow: "Risk of avoidance behavior and comfort addiction. Needs to develop conflict tolerance. Balance pleasure with discipline — Saturn practices help.",
    },
    {
      name: "Authority Seeker",
      test: !!(sunStrong && !jupStrong),
      desc: "Sun dominant. Identity is tied to authority, leadership, and recognition. Natural administrator and organizer. Needs to be seen and respected. Father relationship shapes life blueprint.",
      shadow: "Ego battles and pride can damage key relationships. Cultivate humility. Learn that respect is earned through service, not position.",
    },
    {
      name: "Identity Wound",
      test: !!(sunWeak && !sunStrong),
      desc: "Sun is weakened — core identity is uncertain. May lack confidence in authority roles, struggle with father/boss relationships, or oscillate between arrogance and self-doubt. Seeks external validation.",
      shadow: "Father relationship needs healing — in therapy or practice. Surya mantra daily. Build identity through competence rather than comparison. Leadership is internal first.",
    },
    {
      name: "Emotional Empath",
      test: !!(moonStrong && !moonWeak),
      desc: "Moon dominant. Highly empathetic, psychically sensitive, deeply connected to others' feelings. Natural nurturer and counselor. Absorbs environmental energies like a sponge.",
      shadow: "Risk of emotional overwhelm and boundary issues. Regular emotional detox needed. Grounding practices essential. Not everyone's emotions are yours to carry.",
    },
    {
      name: "Emotional Armoring",
      test: !!(moonWeak && !moonStrong),
      desc: "Moon in a difficult position — emotional vulnerability was unsafe early in life, leading to emotional armoring, difficulty expressing needs, and anxiety that lives under the surface.",
      shadow: "Emotional safety must be built deliberately. Journaling, therapy, creative expression. Moon remedies — pearl, silver, milk offerings on Monday. Mother relationship key.",
    },
    {
      name: "Spiritual Mystic",
      test: !!(ketuIn12 && !rahuAxis),
      desc: "Ketu in 1st/8th/12th — strong past-life spiritual inheritance. Naturally detached, intuitive, possibly psychic. Drawn to moksha, healing, or esoteric knowledge. World feels slightly surreal.",
      shadow: "Risk of spiritual bypassing, apathy, or dissociation from practical life. Needs to anchor spiritual insight to daily routine. Grounding essential — feet on earth, not just in clouds.",
    },
    {
      name: "Control Perfectionist",
      test: !!(satStrong && mercStrong && !satWeak),
      desc: "Saturn + Mercury dominant — exceptional precision, standards, and organizational ability. This person systems-izes everything. Nothing is random and everything has a right way to be done.",
      shadow: "Perfectionism blocks joy and authentic connection. People feel judged by the impossible standards applied to the self. Practice 'good enough' and genuine vulnerability.",
    },
    {
      name: "Balanced Seeker",
      test: true, // fallback — always matches last
      desc: "Multiple influences create complex but adaptable psychological profile. No single dominant planet — versatile, multi-faceted, context-dependent responses. Strength through integration.",
      shadow: "Watch for inconsistency. Build one strong dharmic habit. Choose one psychological growth path rather than dabbling in many simultaneously.",
    },
  ];

  const matched = PATTERNS.find(p => p.test) || PATTERNS[PATTERNS.length - 1];
  const patternName = matched.name;
  const patternDesc = matched.desc;
  const shadow      = matched.shadow;

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
