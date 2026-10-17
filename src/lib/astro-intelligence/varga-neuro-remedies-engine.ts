// src/lib/astro-intelligence/varga-neuro-remedies-engine.ts
// ============================================================
// ASTROLIFE SHODASHAVARGA NEURO-KARMIC & EPIGENETIC REMEDY ENGINE
// Synthesizes:
// 1. Classical Shastric Foundations (Parashari Shodashavarga & Vedic Adhidevatas)
// 2. Exact D1 Natal-Chart Interconnection (Mathematical & Non-generic)
// 3. Generational Kula-Karma (Ancestral DNA patterns & Epigenetic loops)
// 4. Critical Latent Points: 22nd Drekkana (Kharesh), 64th Navamsha, & Pushkar Navamshas
// 5. Modern Cognitive Behavioral Psychology (Prefrontal cortex & distortion re-wiring)
// 6. Somatic & Circadian Neurobiology (Concrete daily actionable protocols)
// ============================================================

import type { ChartData } from "@/lib/astro-engine/calculations";
import type { DivChart, DivPlanet } from "@/lib/astro-engine/divisional";

export interface VargaDeityArchetype {
  name: string;
  traditionalRole: string;
  leadershipMode: string;
  distortionLabel: string;
  neuroEpigeneticRemedy: string;
  somaticCircadianHabit: string;
}

export interface KarmicLatentPoints {
  kharesh22ndDrekkana?: {
    planet: string;
    sign: string;
    house: number;
    organSystem: string;
    somaticProtocol: string;
  };
  sixtyFourthNavamsha?: {
    planet: string;
    sign: string;
    house: number;
    triggerZone: string;
    cognitiveShield: string;
  };
  pushkarNavamshas?: {
    planet: string;
    sign: string;
    navamshaSign: string;
    blessing: string;
  }[];
}

export interface VargaNeuroKarmicProfile {
  vargaKey: string;
  vargaName: string;
  domainTitle: string;
  vargaLagna: string;
  natalLagnaRelation: string;

  // Adhidevata Archetype
  deityArchetype: VargaDeityArchetype;

  // Critical Micro-Karma Points (22nd Drekkana, 64th Navamsha, Pushkar Navamshas)
  latentPoints?: KarmicLatentPoints;

  // Card 1: D1-Aligned Deep Explanation (Natal Integration)
  deepExplanation: {
    title: string;
    natalAlignmentSummary: string;
    paragraphs: string[];
    keyHighlights: string[];
  };

  // Card 2: Varga Karmic Weakness & Subconscious Bottleneck
  karmicWeakness: {
    hasAffliction: boolean;
    frictionSummary: string;
    afflictedPlanets: string[];
    psychologicalBottleneckTitle: string;
    psychologicalBottleneckDesc: string;
    ancestralLineagePattern: string; // Kula Karma / Generational DNA imprint
  };

  // Card 3: Scientific & DNA-Based Neuro-Remedy Protocol
  neuroRemedy: {
    ancestralLoopInterruption: string; // Breaking the multi-generational family loop
    cognitiveRewiring: {
      techniqueName: string;
      distortionLabel: string;
      mindsetProtocol: string;
    };
    somaticBehavioralHabit: {
      habitName: string;
      neuroMechanism: string;
      dailyProtocol: string;
    };
    archetypeAlignment?: {
      name: string;
      executiveProtocol: string;
      cognitiveRefocus: string;
    };
  };
}

const md = (x: number, m: number) => ((x % m) + m) % m;

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

// ── Varga Domain Metadata ──────────────────────────────────────
const VARGA_DOMAINS: Record<string, { title: string; karakas: string[]; focusArea: string }> = {
  D1:  { title: "Physical Body, Vitality & Core Life Direction", karakas: ["Sun"], focusArea: "Physical stamina, self-identity and stress resilience" },
  D2:  { title: "Wealth Creation, Financial Capacity & Resources", karakas: ["Jupiter", "Mercury"], focusArea: "Liquid wealth, asset building and scarcity vs abundance mindset" },
  D3:  { title: "Courage, Willpower, Siblings & Hands-on Effort", karakas: ["Mars"], focusArea: "Execution drive, physical stamina and brotherly/peer karma" },
  D4:  { title: "Fixed Assets, Real Estate & Domestic Sanctuary", karakas: ["Moon", "Venus"], focusArea: "Home peace, property acquisition and maternal blessings" },
  D5:  { title: "Past-Life Merit, Purva Punya & Creative Intellect", karakas: ["Jupiter"], focusArea: "Unearned divine grace, intellectual prowess and purva-punya activation" },
  D6:  { title: "Health Resilience, Disease Defense & Overcoming Obstacles", karakas: ["Mars", "Saturn"], focusArea: "Immune defense, competitive victory, debt resolution and service grit" },
  D7:  { title: "Children, Progeny Karma & Creative Legacy", karakas: ["Jupiter"], focusArea: "Creative fertility, generational legacy and parent-child rapport" },
  D8:  { title: "Sudden Transformations, Longevity & Occult Transcendence", karakas: ["Saturn", "Mars"], focusArea: "Crisis transcendence, occult depth, sudden shifts and longevity resilience" },
  D9:  { title: "Soul Alignment, Inner Dharma & Marital Synergy", karakas: ["Venus", "Jupiter"], focusArea: "Spouse persona, sacred partnership and post-30 soul maturity" },
  D10: { title: "Career Apex, Authority, Enterprise & Public Impact", karakas: ["Sun", "Saturn", "Mercury"], focusArea: "Professional sovereign leadership, public prestige and monetization" },
  D11: { title: "Exponential Income Streams, Wealth Fulfillment & Gains", karakas: ["Jupiter", "Mercury"], focusArea: "Large-scale revenue channels, high-net-worth gains and desire fulfillment" },
  D12: { title: "Ancestral Lineage, Parents & Epigenetic Inheritance", karakas: ["Sun", "Moon"], focusArea: "Paternal/maternal blessings and dissolving generational debt" },
  D16: { title: "Conveyances, Luxury Vehicles & Inner Peace of Mind", karakas: ["Venus"], focusArea: "Comforts, hedonic adaptation and nervous system tranquility" },
  D20: { title: "Spiritual Sadhana, Meditation & Higher Consciousness", karakas: ["Jupiter", "Sun", "Ketu"], focusArea: "Jnana yoga, upasana, mantra siddhi and inner awakening" },
  D24: { title: "Higher Learning, Technical Mastery & Analytical Memory", karakas: ["Mercury", "Jupiter"], focusArea: "Skill acquisition, deep learning and research architecture" },
  D27: { title: "Subconscious Stamina, Inherent Soul Talents & Resilience", karakas: ["Moon", "Mars"], focusArea: "Crisis management, internal reserves and emotional immunity" },
  D30: { title: "Karmic Obstacles, Shadow Traps & Remedial Purification", karakas: ["Saturn", "Mars"], focusArea: "Self-sabotage prevention, moral integrity and divine protection" },
  D40: { title: "General Auspiciousness, Luck & Maternal Ancestry", karakas: ["Moon", "Venus"], focusArea: "Karmic flow, subtle benevolence and maternal ancestral grace" },
  D45: { title: "Moral Character, Ethical Spine & Refined Conduct", karakas: ["Jupiter", "Sun"], focusArea: "Conscience alignment, noble actions and moral purity" },
  D60: { title: "Sanchita Root Karma, Past-Life Matrix & Soul Destiny", karakas: ["Saturn", "Jupiter"], focusArea: "Deepest past-life impressions, soul debts and ultimate life purpose" },
};

// ── Epigenetic Ancestral Loop Library (Graha-Based) ─────────────
const ANCESTRAL_PATTERNS: Record<string, { ancestral: string; distortion: string; rewrite: string; somatic: string }> = {
  Sun: {
    ancestral: "Paternal lineage me authoritative suppression ya public status ke liye extreme personal sacrifice raha hai; parivar me recognition na milne par deep ego-burn carry kiya gaya.",
    distortion: "Status Imposter Syndrome (Dar ki agar me apex position claim karunga to log criticize karenge).",
    rewrite: "Apni authority ko validation ke liye nahi, balki responsibility aur systemic order maintain karne ke liye use karein.",
    somatic: "Subah sunrise ke 30 minute ke andar 10 minute direct natural sunlight me walk (Ventral striatum Dopamine reset)."
  },
  Moon: {
    ancestral: "Maternal lineage me unspoken emotional grief, akelepan me overthinking aur parivar ke liye apni feelings ko daba kar jeene ka epigenetic pattern.",
    distortion: "Nocturnal Hyper-Vigilance & Emotional Empathy Fatigue (Doosron ki chinta me raat ko dimag over-speed par chalna).",
    rewrite: "Doosron ke emotional problems ko absorb karna band karein; compassion rakhein par boundaries ke sath.",
    somatic: "Cold water vagal hydro-reset: Sone se pehle kalaiyon aur pairon ko 60 seconds thande paani se dhona (Jal-tatva grounding)."
  },
  Mars: {
    ancestral: "Ancestral lineage me confrontation, property/land disputes ya jaldbazi me decision lekar nuksan uthane ka impulsive loop.",
    distortion: "Urgent Reactor Trap (Har problem ko abhi isi second ladkar ya confront karke solve karne ki compulsion).",
    rewrite: "Energy ko verbal aggression me kharch karne ke bajay physical athletic endurance ya complex code architecture me lagayein.",
    somatic: "10-Second Vagal Pause: Kisi bhi heated argument me reply dene se pehle 2 deep physiological sighs lein."
  },
  Mercury: {
    ancestral: "Lineage me apni intellectual abilities ya craft ki rightful commercial value na lene ka sankoch; unwritten agreements par bharosa karke cheat hona.",
    distortion: "Perfectionist Freeze (Product ya task tab tak release na karna jab tak 100% perfect na ho).",
    rewrite: "Done is better than perfect. 80% ready hone par deploy karein aur real market feedback se iterate karein.",
    somatic: "Externalization Brain-Dump: Raat ko sone se pehle agle din ke keval 3 main high-impact tasks diary me pen se likhna."
  },
  Jupiter: {
    ancestral: "Rigid religious dogma, spiritual pride ya false orthodox mentors ke sath ancestral friction; gyan hone ke baad bhi practical application me aalsya.",
    distortion: "Intellectual Dogmatism (Har cheez me excessive intellectual debates aur action se pehle endless analysis).",
    rewrite: "Gyan ko ego-display ke bajay selfless guidance aur teaching ke liye channelize karein.",
    somatic: "Daily 5 minute silent breath observation (Pranayama) bina kisi phone ya text ke."
  },
  Venus: {
    ancestral: "Relationships me over-giving, unconditional self-sacrifice aur personal self-worth ko partner ke approval se baandhna; financial luxury guilt.",
    distortion: "Romantic Idealization & Silent Resentment (Partner se unspoken expectations rakhna aur poori na hone par withdraw hona).",
    rewrite: "Relationships me 100% explicit transparent communication rakhein; boundaries ko guilt-free establish karein.",
    somatic: "Sensory Calming Ritual: Sham ke samay sandalwood/rose natural aroma ya barefoot grass grounding."
  },
  Saturn: {
    ancestral: "Heavy ancestral burden, duty-neglect ka guilt ya akele hi poore parivar ka bojh kandhe par uthane ki intergenerational conditioning.",
    distortion: "The Sole Carrier Complex (Mujhe lagta hai ki agar me din-raat thak kar kaam nahi karunga to sab bikhar jayega).",
    rewrite: "Slow compounding par bharosa karein; patience se systems banayein aur healthy delegation seekhein.",
    somatic: "Spine Alignment & Postural Reset: Har 90 minute ke desk work ke baad 2 minute deep spine decompression stretch."
  },
  Rahu: {
    ancestral: "Ancestral sudden displacement, non-traditional path chunne par parivar se outcaste hone ka bhay ya financial volatility.",
    distortion: "Obsessive FOMO & Sudden Escalation Anxiety (Raton-raat scale karne ki jaldbazi me unnecessary high risks lena).",
    rewrite: "Rahu ki viral energy ko calculated risk aur cutting-edge software me channelize karein, speculative greed me nahi.",
    somatic: "Digital Sunset: Raat 10:30 PM ke baad saari bright screens band aur zero business discussions over food."
  },
  Ketu: {
    ancestral: "Spiritual detachment, parivar ya duniya se achanak alienation me chale jaana; worldly inheritance se disconnect.",
    distortion: "Cynical Nihilism ('Kuch bhi karne ka kya fayda, sab niras hai' kehkar productive karma se retreat karna).",
    rewrite: "Ketu ki inward intuitive insight ko deeply focused specialized technology aur research me convert karein.",
    somatic: "Earthing Protocol: Daily 10 minute bare ground/earth contact ya deep solitary meditation."
  }
};

// ── 22nd Drekkana (Kharesh) Organ System Vulnerability ───────────
const KHARESH_ORGAN_MAP: Record<string, { organ: string; somaticProtocol: string }> = {
  Sun: {
    organ: "Cardiovascular system, ocular vitality, vertebral spinal column & cellular energy production",
    somaticProtocol: "Strict sunrise circadian sync, aerobic zone-2 cardio training, and CoQ10/Magnesium-rich whole foods."
  },
  Moon: {
    organ: "Fluid-electrolyte balance, lymphatic drainage, gastric mucosa & neuro-endocrine mood loops",
    somaticProtocol: "Cold-water vagal hydro-resets at night, structured meal timing for gut circadian clocks, and electrolyte balancing."
  },
  Mars: {
    organ: "Acute inflammatory cascades, muscular injury vulnerability, cranial tension & bile metabolism",
    somaticProtocol: "Anti-inflammatory diet, 10-second physiological pause during anger, and non-impact endurance cycling or swimming."
  },
  Mercury: {
    organ: "Autonomic nervous system hypersensitivity, speech center fatigue, dermatological histamine flare-ups & enteric gut-brain axis",
    somaticProtocol: "Strict sunset digital screen curfew, 4-7-8 parasympathetic breathwork, and limiting concurrent task-switching."
  },
  Jupiter: {
    organ: "Hepatic lipid metabolism, arterial compliance, pancreatic insulin response & systemic chronic inflammation",
    somaticProtocol: "Intermittent 14-hour overnight fasting for cellular autophagy, post-meal brisk 10-min walk, and refined sugar elimination."
  },
  Venus: {
    organ: "Renal kidney filtration, reproductive/hormonal balance, endocrine glands & glucose metabolism",
    somaticProtocol: "Low-glycemic dietary anchoring, deep hydration with natural Himalayan pink salt trace minerals, and pelvic mobility exercises."
  },
  Saturn: {
    organ: "Skeletal joint integrity, bone mineral density, dental health, chronic neuromuscular stiffness & colon elimination",
    somaticProtocol: "Resistance weight-bearing load training, daily warm sesame oil spine self-massage, and soluble fiber gut protocol."
  },
  Rahu: {
    organ: "Psychosomatic hypersensitivity, autoimmune allergen vulnerabilities, sleep architecture disruption & toxic overload",
    somaticProtocol: "EMF-free sleep sanctuary, bare-earth conductive grounding (15 mins/day), and avoiding artificial stimulants after 2 PM."
  },
  Ketu: {
    organ: "Neuromuscular mystery blind-spots, sacral/spine stiffness, lower extremities circulation & energy depletion",
    somaticProtocol: "Surya Namaskar mobility, fascia myofascial foam rolling, and focused breath-movement coordination."
  }
};

// ── D10 Digpalas (Ruling Deities of Dasamsha) ───────────────────
const DIGPALAS_ODD = [
  { name: "Indra", role: "East · Sovereign Governance & Vision", mode: "Executive Authority & Strategic Policy", distortion: "Prestige Imposter Trap (Fear of public fall)", remedy: "Lead through systemic delegation rather than personal validation.", somatic: "Morning saccadic eye-movement scanning towards the horizon." },
  { name: "Agni", role: "South-East · Transformation & Velocity", mode: "Rapid Execution & Disruptive Technology", distortion: "Urgent Reactor Burnout (Compulsion to fight every friction)", remedy: "Channel fire into high-leverage software execution, not interpersonal conflict.", somatic: "Physiological sigh (2 inhales, long exhale) when workplace tension spikes." },
  { name: "Yama", role: "South · Law, Order & Accountability", mode: "Institutional Rigor & Regulatory Precision", distortion: "Punitive Perfectionism (Paralysis through extreme self-judgment)", remedy: "Establish objective completion criteria; accept iterative deployment.", somatic: "Spine decompression posture resets every 90 minutes of desk work." },
  { name: "Nirriti", role: "South-West · Unconventional Breakthroughs", mode: "Deep R&D & High-Leverage Non-Traditional Paths", distortion: "Outsider Alienation (Feeling unappreciated by mainstream peers)", remedy: "Turn unconventional insights into proprietary specialized algorithms.", somatic: "Vagal nerve cold-water facial immersion for emotional grounding." },
  { name: "Varuna", role: "West · Liquid Commerce & Global Trade", mode: "Market Intuition & Global Partnerships", distortion: "Commercial Over-Porosity (Saying yes to too many scattered deals)", remedy: "Establish strict qualification rubrics before committing commercial bandwidth.", somatic: "Deliberate hydration pacing and scheduled silence intervals between meetings." },
  { name: "Vayu", role: "North-West · Speed, Networks & Distribution", mode: "Information Architecture & Scalable Dissemination", distortion: "Cognitive Dispersion (Starting 10 projects, finishing none)", remedy: "Monotask ruthlessly; close all unneeded browser tabs during creative sprints.", somatic: "Barefoot earthing and 45-minute distraction-free Pomodoro deep work blocks." },
  { name: "Kubera", role: "North · Treasury & Capital Compounding", mode: "Asset Allocation & Value Preservation", distortion: "Generational Scarcity Anxiety (Fear of depletion despite high revenue)", remedy: "Adopt compounding long-term horizon; separate operational capital from investment.", somatic: "Daily gratitude journaling for capital security and slow deep diaphragmatic breathing." },
  { name: "Ishana", role: "North-East · Wisdom & Advisory Excellence", mode: "Strategic Mentorship & Research Acumen", distortion: "Ivory-Tower Detachment (Disdain for everyday business execution)", remedy: "Ground deep wisdom into tangible, monetizable educational and advisory frameworks.", somatic: "5-minute dawn meditation in quiet space before opening digital devices." },
  { name: "Brahma", role: "Zenith · Zero-to-One Creative Architecture", mode: "Original Product Engineering & Innovation", distortion: "Prototype Abandonment Loop (Discarding working products for elusive perfection)", remedy: "Ship version 1.0; let real customer interaction drive architecture improvements.", somatic: "Draft architectural designs by hand on physical paper before coding." },
  { name: "Ananta", role: "Nadir · Deep Foundations & Stamina", mode: "Unshakeable Institutional Resilience & Infrastructure", distortion: "The Slogger Syndrome (Clinging to outdated legacy methods out of sheer duty)", remedy: "Upgrade underlying foundations regularly; automate routine repetitive workloads.", somatic: "Evening progressive muscle relaxation for restorative deep sleep." }
];

// ── Critical Karmic Latent Points Detector ──────────────────────
export function detectKarmicLatentPoints(
  natalChart: ChartData,
  d3: DivChart | undefined,
  d9: DivChart | undefined
): KarmicLatentPoints {
  const result: KarmicLatentPoints = {};

  // 1. 22nd Drekkana (Kharesh) in D3
  // In classical Shastras, 8th house from Lagna in D3 is decanate 22-24, starting with the 22nd Drekkana.
  if (d3) {
    const d3LagnaSignNum = d3.lagnaNum;
    const khareshSignNum = md(d3LagnaSignNum + 7, 12); // 8th house in D3
    const khareshLord = SIGN_LORDS[khareshSignNum];
    const organInfo = KHARESH_ORGAN_MAP[khareshLord] || KHARESH_ORGAN_MAP["Saturn"];

    result.kharesh22ndDrekkana = {
      planet: khareshLord,
      sign: SIGN_NAMES[khareshSignNum],
      house: 8,
      organSystem: organInfo.organ,
      somaticProtocol: organInfo.somaticProtocol
    };
  }

  // 2. 64th Navamsha in D9
  // In classical Shastras, the 64th Navamsha is 4th house in D9 from the Moon's Navamsha (which is 210° from Moon in D1).
  if (d9) {
    const moonInD9 = d9.planets.find(p => p.planet === "Moon");
    if (moonInD9) {
      const sixtyFourthSignNum = md(moonInD9.signNum + 3, 12); // 4th from Moon in D9
      const sixtyFourthLord = SIGN_LORDS[sixtyFourthSignNum];

      result.sixtyFourthNavamsha = {
        planet: sixtyFourthLord,
        sign: SIGN_NAMES[sixtyFourthSignNum],
        house: 4,
        triggerZone: `4th Navamsha from Moon (${SIGN_NAMES[sixtyFourthSignNum]}, ruled by ${sixtyFourthLord})`,
        cognitiveShield: `When stress transits cross ${SIGN_NAMES[sixtyFourthSignNum]}, activate the '72-Hour Decision Rule' — avoid reactive contracts, confrontations, or impulsive financial liquidations until emotional arousal subsides.`
      };
    }
  }

  // 3. Pushkar Navamshas (The 24 Regenerative Nectar Degrees)
  if (natalChart.planets) {
    const pushkars: { planet: string; sign: string; navamshaSign: string; blessing: string }[] = [];
    const planetList: { planet: string; sign: string; lon: number }[] = Array.isArray(natalChart.planets)
      ? (natalChart.planets as any[])
      : Object.entries(natalChart.planets).map(([k, v]) => ({
          planet: (v as any).planet || k,
          sign: (v as any).sign || "",
          lon: (v as any).lon ?? 0,
        }));

    planetList.forEach(p => {
      const degInSign = md(p.lon, 30);
      const signIdx = Math.floor(md(p.lon, 360) / 30);
      const signType = signIdx % 4; // 0: Fire, 1: Earth, 2: Air, 3: Water

      let isPushkar = false;
      let pNavSign = "";

      if (signType === 0) {
        // Fire signs: 7th (20°-23°20' Libra) & 9th (26°40'-30° Sag)
        if (degInSign >= 20.0 && degInSign < 23.3333) {
          isPushkar = true;
          pNavSign = "Libra (Venus)";
        } else if (degInSign >= 26.6667 && degInSign <= 30.0) {
          isPushkar = true;
          pNavSign = "Sagittarius (Jupiter)";
        }
      } else if (signType === 1) {
        // Earth signs: 3rd (6°40'-10° Pisces) & 5th (13°20'-16°40' Taurus)
        if (degInSign >= 6.6667 && degInSign < 10.0) {
          isPushkar = true;
          pNavSign = "Pisces (Jupiter)";
        } else if (degInSign >= 13.3333 && degInSign < 16.6667) {
          isPushkar = true;
          pNavSign = "Taurus (Venus)";
        }
      } else if (signType === 2) {
        // Air signs: 6th (16°40'-20° Pisces) & 8th (23°20'-26°40' Taurus)
        if (degInSign >= 16.6667 && degInSign < 20.0) {
          isPushkar = true;
          pNavSign = "Pisces (Jupiter)";
        } else if (degInSign >= 23.3333 && degInSign < 26.6667) {
          isPushkar = true;
          pNavSign = "Taurus (Venus)";
        }
      } else if (signType === 3) {
        // Water signs: 1st (0°-3°20' Cancer) & 3rd (6°40'-10° Virgo)
        if (degInSign >= 0.0 && degInSign < 3.3333) {
          isPushkar = true;
          pNavSign = "Cancer (Moon)";
        } else if (degInSign >= 6.6667 && degInSign < 10.0) {
          isPushkar = true;
          pNavSign = "Virgo (Mercury)";
        }
      }

      if (isPushkar) {
        pushkars.push({
          planet: p.planet,
          sign: p.sign,
          navamshaSign: pNavSign,
          blessing: `${p.planet} in Pushkar Navamsha (${pNavSign}) provides extraordinary cellular resilience and cognitive recovery power, granting victory even through severe trials.`
        });
      }
    });

    if (pushkars.length > 0) {
      result.pushkarNavamshas = pushkars;
    }
  }

  return result;
}

// ── Varga Adhidevata Archetype Resolver ─────────────────────────
function resolveVargaDeityArchetype(
  vargaKey: string,
  lagnaNum: number,
  lagnaDeg: number
): VargaDeityArchetype {
  if (vargaKey === "D10") {
    const isOdd = lagnaNum % 2 === 0; // 0,2,4,6,8,10 are odd signs (Aries, Gemini, etc.)
    const slice = Math.min(Math.floor(lagnaDeg / 3), 9);
    const digpala = isOdd ? DIGPALAS_ODD[slice] : [...DIGPALAS_ODD].reverse()[slice];

    return {
      name: digpala.name,
      traditionalRole: digpala.role,
      leadershipMode: digpala.mode,
      distortionLabel: digpala.distortion,
      neuroEpigeneticRemedy: digpala.remedy,
      somaticCircadianHabit: digpala.somatic
    };
  }

  if (vargaKey === "D4") {
    const kumaras = [
      { name: "Sanaka", role: "Inward Contemplation & Soul Sanctuary", mode: "Detached asset ownership & tranquil sanctuary", distortion: "Property boundary paranoia", remedy: "Treat living spaces as a calm monastery rather than a status symbol.", somatic: "Evening room decluttering and low-amber lighting." },
      { name: "Sanandana", role: "Joyful Contentment & Mental Peace", mode: "Family sanctuary harmony & domestic peace", distortion: "Over-idealizing physical comforts", remedy: "Anchor happiness in emotional presence rather than luxury upgrades.", somatic: "Post-dinner walk without smartphone; 10 slow diaphragmatic breaths." },
      { name: "Sanatkumara", role: "Unaging Vitality & Focus", mode: "Sustainable home base for deep intellectual output", distortion: "Domestic restlessness", remedy: "Designate a dedicated, sacred workspace within home.", somatic: "Morning stretching on natural jute or bare floor." },
      { name: "Sanatana", role: "Timeless Stability & Ancestral Earth", mode: "Long-term fixed real-estate compounding", distortion: "Fear of asset obsolescence", remedy: "Focus on enduring quality over rapid short-term flips.", somatic: "Walking barefoot on grass or clean earth for 10 minutes weekly." }
    ];
    const slice = Math.min(Math.floor(lagnaDeg / 7.5), 3);
    const k = kumaras[slice];
    return {
      name: k.name,
      traditionalRole: k.role,
      leadershipMode: k.mode,
      distortionLabel: k.distortion,
      neuroEpigeneticRemedy: k.remedy,
      somaticCircadianHabit: k.somatic
    };
  }

  if (vargaKey === "D12") {
    const pitraDeities = [
      { name: "Ganesha", role: "Ancestral Obstacle Dissolution", mode: "Clearing foundational lineage blocks", distortion: "Hereditary hesitation before starting", remedy: "Acknowledge family sacrifices; build new habits with sovereign autonomy.", somatic: "Cold-water face splashing before launching new projects." },
      { name: "Ashwini Kumaras", role: "Lineage Healing & Vitality Regeneration", mode: "Epigenetic cellular rejuvenation", distortion: "Carrying chronic familial health anxieties", remedy: "Implement clean nutrient density; break sedentary ancestral habits.", somatic: "Morning aerobic exercise and consistent meal timings." },
      { name: "Yama", role: "Ancestral Karmic Accounting & Duty", mode: "Completing unfinished generational responsibilities", distortion: "Guilt-driven overworking for parental approval", remedy: "Honor ancestors through ethical excellence, not self-punishing martyrdom.", somatic: "Spine alignment stretches and boundaries on unpaid emotional labor." },
      { name: "Sarpa", role: "Subconscious Lineage Wisdom & Kundalini", mode: "Transforming ancient karmic patterns into wisdom", distortion: "Hidden familial fears of betrayal", remedy: "Practice transparent, explicit communication in family affairs.", somatic: "Deep pranayama breathwork to calm autonomic fight-or-flight." }
    ];
    const slice = Math.min(Math.floor(lagnaDeg / 2.5), 3);
    const d = pitraDeities[slice];
    return {
      name: d.name,
      traditionalRole: d.role,
      leadershipMode: d.mode,
      distortionLabel: d.distortion,
      neuroEpigeneticRemedy: d.remedy,
      somaticCircadianHabit: d.somatic
    };
  }

  if (vargaKey === "D30") {
    const bhutaDeities = [
      { name: "Agni", role: "Fire Tatva · Will & Metabolism", mode: "Dynamic action without reactive rage", distortion: "Impulsive anger & sympathetic fight trigger", remedy: "Cognitive Pause: Never respond to perceived slights within 60 minutes.", somatic: "Physiological sigh and cold shower vagal stimulation." },
      { name: "Vayu", role: "Air Tatva · Movement & Cognition", mode: "Intellectual agility without restless panic", distortion: "Chronic anxious rumination & scattered focus", remedy: "Grounding protocol: Single-task focus with physical pen-and-paper tracking.", somatic: "Barefoot ground contact and weighted blanket sleep." },
      { name: "Indra", role: "Space Tatva · Authority & Governance", mode: "Sovereign humility & ethical leadership", distortion: "Entitlement bias and fragile ego reactions", remedy: "Practice radical service: Help someone who cannot return the favor.", somatic: "Morning sunlight walk with relaxed neck and shoulders." },
      { name: "Kubera", role: "Earth Tatva · Matter & Resources", mode: "Grounded abundance & resource stewardship", distortion: "Hoarding mindset & scarcity panic", remedy: "Adopt an abundance reframe: Regularly circulate value into productive tools.", somatic: "Deliberate deep belly breathing before reviewing finances." },
      { name: "Varuna", role: "Water Tatva · Emotion & Subconscious", mode: "Emotional regulation & psychic clarity", distortion: "Escapism, addictive avoidance & boundary loss", remedy: "Dopamine fasting: Zero passive social scrolling after 8 PM.", somatic: "Consistent hydration and evening chamomile or herbal grounding." }
    ];
    const slice = Math.min(Math.floor(lagnaDeg / 6), 4);
    const b = bhutaDeities[slice];
    return {
      name: b.name,
      traditionalRole: b.role,
      leadershipMode: b.mode,
      distortionLabel: b.distortion,
      neuroEpigeneticRemedy: b.remedy,
      somaticCircadianHabit: b.somatic
    };
  }

  if (vargaKey === "D5") {
    return {
      name: "Brihaspati-Saraswati",
      traditionalRole: "Purva Punya & High-Order Creative Intellect",
      leadershipMode: "Intuitive mastery & unearned divine insight",
      distortionLabel: "Intellectual Procrastination (Waiting for perfect inspiration)",
      neuroEpigeneticRemedy: "Channel intuition into daily structured creation; honor the family intellectual legacy by publishing research.",
      somaticCircadianHabit: "Dawn intellectual sprint (30 minutes of undisturbed writing or coding upon waking)."
    };
  }

  if (vargaKey === "D6") {
    return {
      name: "Kartikeya-Rudra",
      traditionalRole: "Victory over Adversaries & Disease Neutralization",
      leadershipMode: "Relentless discipline, immune defense & competitive grit",
      distortionLabel: "Conflict Avoidance or Adversarial Hyper-Vigilance",
      neuroEpigeneticRemedy: "View competitors and health challenges as training weights; resolve litigation/debts with systematic audits.",
      somaticCircadianHabit: "Cold hydro-resets, metabolic strength training, and strict inflammatory food elimination."
    };
  }

  if (vargaKey === "D8") {
    return {
      name: "Mrityunjaya-Kaal",
      traditionalRole: "Transmutation, Longevity Shield & Crisis Mastery",
      leadershipMode: "Antifragile adaptability & thriving through volatility",
      distortionLabel: "Catastrophizing & Fear of Sudden Loss",
      neuroEpigeneticRemedy: "Build redundant safety buffers; embrace volatility as a mechanism of rapid evolution.",
      somaticCircadianHabit: "Vagus nerve box-breathing (4s in, 4s hold, 4s out, 4s hold) during times of market or career flux."
    };
  }

  if (vargaKey === "D11") {
    return {
      name: "Rudra-Kubera",
      traditionalRole: "Exponential Multiplication & Desire Fulfillment",
      leadershipMode: "Non-linear revenue channels & removing scarcity ceilings",
      distortionLabel: "Linear Income Glass-Ceiling (Equating time directly to money)",
      neuroEpigeneticRemedy: "Architect scalable software, automated systems and equity investments that detach earnings from manual hours.",
      somaticCircadianHabit: "Weekly 2-hour strategic focus block dedicated exclusively to scalable leverage and distribution."
    };
  }

  if (vargaKey === "D9") {
    const amshaType = lagnaNum % 3 === 0 ? "Deva" : lagnaNum % 3 === 1 ? "Nara" : "Rakshasa";
    return {
      name: `${amshaType} Navamsha`,
      traditionalRole: "Inner Soul Dharma & Sacred Relationship Synergy",
      leadershipMode: amshaType === "Deva" ? "Benevolent high-trust partnership" : amshaType === "Nara" ? "Pragmatic balanced collaboration" : "Intense transformative drive",
      distortionLabel: "Relationship Projection & Unspoken Contract Traps",
      neuroEpigeneticRemedy: "Practice transparent, radical honesty in partnerships; release unrealistic romantic pedestals.",
      somaticCircadianHabit: "Evening joint gratitude reflection and intentional device-free conversational space."
    };
  }

  if (vargaKey === "D60") {
    return {
      name: "Sanchita Divine Amsha",
      traditionalRole: "Root Past-Life Karmic Dispensation & Final Sanction",
      leadershipMode: "Soul-purpose alignment & fulfilling deep life destiny",
      distortionLabel: "Existential Meaning Crisis",
      neuroEpigeneticRemedy: "Align career and actions with genuine dharmic service; clear past-life karmic loans through selfless value creation.",
      somaticCircadianHabit: "10 minutes of daily silent contemplation on mortality and essential soul priorities."
    };
  }

  // Default Vedic Archetype
  return {
    name: "Surya-Prajapati",
    traditionalRole: "Universal Life Force & Micro-Karma Coordination",
    leadershipMode: "Grounded responsibility, clarity of purpose and steady execution",
    distortionLabel: "Passive Drift & Micro-Distraction",
    neuroEpigeneticRemedy: "Harmonize individual efforts with cosmic natural law through daily disciplined routines.",
    somaticCircadianHabit: "Consistent morning wake-up schedule aligned with natural dawn daylight."
  };
}

// ── MAIN EVALUATION ENGINE ──────────────────────────────────────
export function evaluateVargaNeuroKarmicProfile(
  natalChart: ChartData,
  varga: DivChart,
  allVargas: DivChart[]
): VargaNeuroKarmicProfile {
  const vMeta = VARGA_DOMAINS[varga.key] || {
    title: `${varga.name} Domain Analysis`,
    karakas: ["Sun"],
    focusArea: "General life expansion"
  };

  const natalLagnaNum = natalChart.lagnaNum;
  const vargaLagnaNum = varga.lagnaNum;
  const houseOffsetFromNatal = md(vargaLagnaNum - natalLagnaNum, 12) + 1;

  // 1. Detect Critical Karmic Latent Points (Kharesh 22nd Drekkana, 64th Navamsha, Pushkar Navamshas)
  const d3 = allVargas.find(v => v.key === "D3");
  const d9 = allVargas.find(v => v.key === "D9");
  const latentPoints = detectKarmicLatentPoints(natalChart, d3, d9);

  // 2. Resolve Varga Adhidevata Archetype
  const lagnaDeg = natalChart.lagnaLon ? md(natalChart.lagnaLon, 30) : 15;
  const deityArchetype = resolveVargaDeityArchetype(varga.key, vargaLagnaNum, lagnaDeg);

  // 3. Natal Lagna Relation Synthesis
  let natalRelationDesc = "";
  if (houseOffsetFromNatal === 1) {
    natalRelationDesc = `${varga.key} Lagna exactly matches Natal Lagna (${varga.lagna}) — High harmonic resonance (Vargottama Lagna quality); natural life promise materializes with minimal internal friction.`;
  } else if ([5, 9].includes(houseOffsetFromNatal)) {
    natalRelationDesc = `${varga.key} Lagna falls in House ${houseOffsetFromNatal} (Trikona) from Natal Lagna — Inherent dharmic support, fortunate intuitive flow and past-life merit activation in this domain.`;
  } else if ([4, 7, 10].includes(houseOffsetFromNatal)) {
    natalRelationDesc = `${varga.key} Lagna falls in House ${houseOffsetFromNatal} (Kendra) from Natal Lagna — High executive action, worldly manifestation capacity and dynamic energy deployment.`;
  } else if ([6, 8, 12].includes(houseOffsetFromNatal)) {
    natalRelationDesc = `${varga.key} Lagna falls in House ${houseOffsetFromNatal} (Dusthana) from Natal Lagna — Transformational domain requiring deliberate conscious effort, discipline and karmic clearing.`;
  } else {
    natalRelationDesc = `${varga.key} Lagna falls in House ${houseOffsetFromNatal} from Natal Lagna (${natalChart.lagnaRashi}) — Shapes specific secondary house growth through deliberate life focus.`;
  }

  // 4. Planetary Audits in Varga
  const exaltedPlanets = varga.planets.filter(p => p.dignity === "Exalted");
  const ownPlanets = varga.planets.filter(p => p.dignity === "Own");
  const debPlanets = varga.planets.filter(p => p.dignity === "Debilitated");
  const dusthanaPlanets = varga.planets.filter(p => [6, 8, 12].includes(p.house));
  const lagnaPlanets = varga.planets.filter(p => p.inLagna);

  // ── CARD 1: D1-Aligned Deep Explanation Narrative ───────────
  const paragraphs: string[] = [];
  const keyHighlights: string[] = [];

  const natalLagnesh = SIGN_LORDS[natalChart.lagnaNum] ?? "Lagnesh";

  // P1: Lagna alignment
  paragraphs.push(
    `Aapke Natal Chart (D-1) me ${natalChart.lagnaRashi} Lagna udit hai, jiska swami (Lagnesh) ${natalLagnesh} hai. Jab hum ${varga.name} (${varga.key}) me pravesh karte hain, to yahan Lagna ${varga.lagna} ban jata hai, jo Natal Lagna se ${houseOffsetFromNatal}th position par hai. Yeh shastric configuration batati hai ki is varga ke vishay (${vMeta.focusArea}) aapki core personality ke sath kis tarah interact karte hain.`
  );

  // P2: Deity Archetype Integration
  paragraphs.push(
    `Is varga chart ke Lagna par ${deityArchetype.name} (${deityArchetype.traditionalRole}) ka prabhav hai. Shastric siddhanton ke anusar, yeh adhidevata is kshetra me aapke antahkaran ko "${deityArchetype.leadershipMode}" ki urja pradan karta hai. Jab aap apne daily karma ko is shastric archetype ke sath align karte hain, to subconscious resistance samapt hoti hai aur execution velocity badh jati hai.`
  );
  keyHighlights.push(`Adhidevata Archetype: ${deityArchetype.name} (${deityArchetype.leadershipMode})`);

  // P3: Varga Karaka & Strong Planets
  const karakaNames = vMeta.karakas.join(", ");
  const karakaInVarga = varga.planets.filter(p => vMeta.karakas.includes(p.planet));
  const strongInVarga = [...exaltedPlanets, ...ownPlanets];

  if (strongInVarga.length > 0) {
    const strongStr = strongInVarga.map(p => `${p.planet} in ${p.sign} (${p.dignity}, House ${p.house})`).join("; ");
    paragraphs.push(
      `Is varga chart me shastric shakti ka prabal kendra hai: ${strongStr}. Parashari siddhanton ke anusar, jab koi graha varga kundali me ucch ya swakshetra hota hai, to wo sambandhit jeevan kshetra me vyakti ko unearned karmic advantage aur extraordinary breakthrough capacity deta hai.`
    );
    keyHighlights.push(`Prabal Shakti Kendra: ${strongInVarga.map(p => `${p.planet} (${p.dignity})`).join(", ")}`);
  } else {
    paragraphs.push(
      `Is varga chart me planetary placement santulit (balanced) hai. Yahan ka mukhya karaka (${karakaNames}) House ${karakaInVarga.map(k => k.house).join(", ")} me sthit hokar is varga ki urja ko drive karta hai.`
    );
  }

  // P4: Specialized Varga Insights & Critical Latent Points
  if (varga.key === "D10") {
    const sun = varga.planets.find(p => p.planet === "Sun");
    const rahu = varga.planets.find(p => p.planet === "Rahu");
    const merc = varga.planets.find(p => p.planet === "Mercury");
    if (merc?.house === 11 && merc?.dignity === "Exalted") {
      paragraphs.push(
        `D-10 ke 11th house (Labha / Revenue / Network) me Budha (Mercury) UCHHA (Exalted in Kanya) hokar virajman hai. Yeh D-10 ka apex commercial signature hai — yeh declare karta hai ki aapka main financial expansion scalable tech products, algorithms, quantitative models aur automated systems se aayega.`
      );
      keyHighlights.push("D-10 H11: Exalted Mercury (Algorithmic / Tech Revenue)");
    }
    if (sun && rahu && sun.house === rahu.house) {
      paragraphs.push(
        `D-10 ke House ${sun.house} me Surya aur Rahu ki yuti hai. 10th lord ka Rahu ke sath aana traditional distribution ke bajay cutting-edge digital platforms, global outreach aur non-traditional high-leverage domains me authority deta hai.`
      );
      keyHighlights.push(`D-10 H${sun.house}: Sun + Rahu (Global / Digital Scaling)`);
    }
  } else if (varga.key === "D9") {
    const moon = varga.planets.find(p => p.planet === "Moon");
    const rahu = varga.planets.find(p => p.planet === "Rahu");
    const merc = varga.planets.find(p => p.planet === "Mercury");
    if (merc?.house === 4 && merc?.dignity === "Exalted") {
      paragraphs.push(
        `D-9 ke 4th house me Budha ucch sthiti me baitha hai, jo aatma ke antahkaran me high discernment, intellectual clarity aur dharmic grounding ko darshata hai.`
      );
      keyHighlights.push("D-9 H4: Exalted Mercury (Soul Discernment)");
    }
    if (moon && rahu && moon.house === 7 && rahu.house === 7) {
      paragraphs.push(
        `D-9 ke 7th house (Kalatra Bhava) me Chandra aur Rahu ki yuti sthit hai. Yeh combination darshata hai ki partner magnetic, highly ambitious, open-minded aur aisi shaksiyat hoga jo standard societal convention se bahar sochti ho.`
      );
      keyHighlights.push("D-9 H7: Moon + Rahu (Magnetic & Unconventional Partnership)");
    }
    if (latentPoints.sixtyFourthNavamsha) {
      paragraphs.push(
        `Critical Karmic Point: Chandra ke navamsha se 4th house (64th Navamsha) ${latentPoints.sixtyFourthNavamsha.sign} rashi me padta hai, jiska swami ${latentPoints.sixtyFourthNavamsha.planet} hai. Yeh transit stress me cognitive shock aur jaldbazi se decision lene ka trigger zone hai. Is transit ke samay emotional reactive commitments se bachna hi shastric kavach hai.`
      );
      keyHighlights.push(`64th Navamsha: ${latentPoints.sixtyFourthNavamsha.sign} (${latentPoints.sixtyFourthNavamsha.planet})`);
    }
  } else if (varga.key === "D3" && latentPoints.kharesh22ndDrekkana) {
    paragraphs.push(
      `Drekkana Sensitive Point: D-3 ke Lagna se 8th house (22nd Drekkana / Kharesh) ${latentPoints.kharesh22ndDrekkana.sign} me sthit hai, jiska swami ${latentPoints.kharesh22ndDrekkana.planet} hai. Yeh shastric bindu body ke us physiological system ko represent karta hai jo generational epigenetic stress ke prati sabse adhik sensitive hai: ${latentPoints.kharesh22ndDrekkana.organSystem}.`
    );
    keyHighlights.push(`22nd Drekkana (Kharesh): ${latentPoints.kharesh22ndDrekkana.planet} (${latentPoints.kharesh22ndDrekkana.sign})`);
  } else if (varga.key === "D5") {
    paragraphs.push(
      `D-5 (Panchamsha) purva-punya aur unearned intuition ka chakra hai. Isme 5th/9th bhava ka santulan batata hai ki pichhle janmon ke sanchita shastric sanskar is jeevan me creative flow aur high-fluid intelligence bankar activate ho rahe hain.`
    );
    keyHighlights.push("D-5: Purva-Punya & Unearned Intuition Active");
  } else if (varga.key === "D6") {
    paragraphs.push(
      `D-6 (Shashthamsha) biological immunity aur competitive victory ko darshata hai. Is chakra ke upachaya bhavon me grahon ki sthiti yeh nirdharit karti hai ki aap sharirik aur manasik dabav me kitni tezi se bounce-back kar sakte hain.`
    );
    keyHighlights.push("D-6: Immune Grit & Adversary Neutralization");
  } else if (varga.key === "D8") {
    paragraphs.push(
      `D-8 (Ashtamsha) akasmik jeevan parivartanon (sudden inflection points) aur longevity reserve ko mapta hai. Yeh chakra batata hai ki life ke sudden shocks aapke liye trauma banenge ya transformative breakthroughs.`
    );
    keyHighlights.push("D-8: Antifragile Transformation Threshold");
  } else if (varga.key === "D11") {
    paragraphs.push(
      `D-11 (Rudramsha) non-linear wealth multiplication aur major desire fulfillment ka micro-karma lens hai. Yeh standard salary limits ko todkar high-magnitude scale create karne ki capacity ko verify karta hai.`
    );
    keyHighlights.push("D-11: Exponential Multi-Stream Capital Scaling");
  } else if (varga.key === "D60") {
    const merc = varga.planets.find(p => p.planet === "Mercury");
    const sun = varga.planets.find(p => p.planet === "Sun");
    const moon = varga.planets.find(p => p.planet === "Moon");
    if (merc?.inLagna) {
      paragraphs.push(
        `D-60 (Shashtiamsha) ke Lagna me Budha ka baithna yeh confirm karta hai ki aapki mathematical, computational aur logical abilities is janam ki learning nahi hain; yeh pichhle kai janmon ke sanchita sanskar hain.`
      );
      keyHighlights.push("D-60 Lagna: Mercury (Past-Life Algorithmic Memory)");
    }
    if (sun?.house === 9 && moon?.house === 9) {
      paragraphs.push(
        `D-60 ke 9th house of Dharma & Pitra me Surya aur Chandra dono virajman hain. Yeh sacred shastric lineage aur purvajon ke aashirwaad ka prabal prateek hai.`
      );
      keyHighlights.push("D-60 H9: Sun + Moon (Ancestral Wisdom Lineage)");
    }
  }

  // Pushkar Navamsha Recognition
  if (latentPoints.pushkarNavamshas && latentPoints.pushkarNavamshas.length > 0) {
    const pNames = latentPoints.pushkarNavamshas.map(p => `${p.planet} in ${p.navamshaSign}`).join(", ");
    paragraphs.push(
      `Pushkar Navamsha Aashirwaad: Aapke chart me shastric Pushkar Navamsha ke shubh ansha active hain (${pNames}). Pushkar Navamsha grahon ko aisi regenerative neuroplasticity pradan karta hai jisse vyakti ghor chunautiyon ke baad bhi unexpected rebirth aur high-order growth achieve karta hai.`
    );
    keyHighlights.push(`Pushkar Navamsha Active: ${latentPoints.pushkarNavamshas.map(p => p.planet).join(", ")}`);
  }

  // Lagna Occupants
  if (lagnaPlanets.length > 0) {
    const lagnaPStr = lagnaPlanets.map(p => `${p.planet} (${p.sign})`).join(", ");
    paragraphs.push(
      `${varga.key} ke Lagna me ${lagnaPStr} virajman hain. Yeh graha aapke is varga ke antahkaran (inner psychology) ko lead karte hain aur direct approach ko shape karte hain.`
    );
    if (!keyHighlights.some(k => k.includes("Lagna Occupants"))) {
      keyHighlights.push(`Lagna Occupants: ${lagnaPStr}`);
    }
  }

  // ── CARD 2: Varga Karmic Weakness & Subconscious Bottleneck ──
  const frictionPoints: string[] = [];
  const afflictedPlanets: string[] = [];

  if (debPlanets.length > 0) {
    debPlanets.forEach(dp => {
      frictionPoints.push(`${dp.planet} debilitated in House ${dp.house} (${dp.sign})`);
      afflictedPlanets.push(dp.planet);
    });
  }

  if (dusthanaPlanets.length > 0) {
    const dStr = dusthanaPlanets.map(p => `${p.planet} in House ${p.house}`).join(", ");
    frictionPoints.push(`Dusthana Pressure: ${dStr}`);
    dusthanaPlanets.forEach(p => {
      if (!afflictedPlanets.includes(p.planet)) afflictedPlanets.push(p.planet);
    });
  }

  // Primary afflicted planet for behavioral synthesis
  const primaryAfflicted = debPlanets[0]?.planet || dusthanaPlanets[0]?.planet || vMeta.karakas[0] || "Saturn";
  const pat = ANCESTRAL_PATTERNS[primaryAfflicted] || ANCESTRAL_PATTERNS["Saturn"];

  const hasAffliction = frictionPoints.length > 0;
  const frictionSummary = hasAffliction
    ? `${varga.key} me ${frictionPoints.join(" | ")} ka prabhav hai, jo is kshetra me subconscious resistance create karta hai.`
    : `${varga.key} me koi gambhir debility nahi hai; urja smooth hai lekin targeted behavioral refinement abhi bhi beneficial hai.`;

  const psychologicalBottleneckTitle = hasAffliction
    ? `${primaryAfflicted} Trigger: ${pat.distortion.split("(")[0].trim()}`
    : `${deityArchetype.name} Shadow: ${deityArchetype.distortionLabel}`;

  const psychologicalBottleneckDesc = hasAffliction
    ? `Jab is kshetra me pressure badhta hai, to aapka subconscious mind is distortion me chala jata hai: ${pat.distortion}. Sath hi ${deityArchetype.name} ka shadow pattern (${deityArchetype.distortionLabel}) decision-making me friction laata hai.`
    : `Is domain me sabhi graha santulit hone ke bawajood, ${deityArchetype.name} archetype ka shadow trap (${deityArchetype.distortionLabel}) tab manifest hota hai jab proactive systemized routine follow na ho.`;

  const ancestralLineagePattern = pat.ancestral;

  // ── CARD 3: Scientific & DNA-Based Neuro-Remedy Protocol ──────
  const ancestralLoopInterruption = pat.rewrite;
  const cognitiveRewiring = {
    techniqueName: `Neuro-Cognitive Reframing (${primaryAfflicted} & ${deityArchetype.name})`,
    distortionLabel: `${pat.distortion} · ${deityArchetype.distortionLabel}`,
    mindsetProtocol: `Subconscious habit break: ${pat.rewrite} ${deityArchetype.neuroEpigeneticRemedy}`
  };

  const somaticBehavioralHabit = {
    habitName: `Daily Somatic Biomarker Reset (${primaryAfflicted})`,
    neuroMechanism: `Autonomic nervous system recalibration & neural pathway retraining for ${vMeta.title}`,
    dailyProtocol: `${pat.somatic} · Circadian Habit: ${deityArchetype.somaticCircadianHabit}`
  };

  const archetypeAlignment = {
    name: deityArchetype.name,
    executiveProtocol: deityArchetype.leadershipMode,
    cognitiveRefocus: deityArchetype.neuroEpigeneticRemedy
  };

  return {
    vargaKey: varga.key,
    vargaName: varga.name,
    domainTitle: vMeta.title,
    vargaLagna: varga.lagna,
    natalLagnaRelation: natalRelationDesc,
    deityArchetype,
    latentPoints,
    deepExplanation: {
      title: `${varga.key} (${varga.name}) — Natal D1 Integrated Shastric Narrative`,
      natalAlignmentSummary: natalRelationDesc,
      paragraphs,
      keyHighlights
    },
    karmicWeakness: {
      hasAffliction,
      frictionSummary,
      afflictedPlanets,
      psychologicalBottleneckTitle,
      psychologicalBottleneckDesc,
      ancestralLineagePattern
    },
    neuroRemedy: {
      ancestralLoopInterruption,
      cognitiveRewiring,
      somaticBehavioralHabit,
      archetypeAlignment
    }
  };
}
