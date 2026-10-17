// src/lib/astro-intelligence/varga-neuro-remedies-engine.ts
// ============================================================
// ASTROLIFE SHODASHAVARGA NEURO-KARMIC & EPIGENETIC REMEDY ENGINE
// Synthesizes:
// 1. Classical Parashari Shodashavarga (BPHS) & Nadi Foundations
// 2. Exact D1 Natal-Chart Interconnection (Non-generic, mathematical)
// 3. Generational Kula-Karma (Ancestral DNA patterns & Epigenetic loops)
// 4. Modern Cognitive Behavioral Psychology (Distortion re-framing)
// 5. Somatic & Circadian Neurobiology (Concrete daily actionable habits)
// ============================================================

import type { ChartData } from "@/lib/astro-engine/calculations";
import type { DivChart, DivPlanet } from "@/lib/astro-engine/divisional";

export interface VargaNeuroKarmicProfile {
  vargaKey: string;
  vargaName: string;
  domainTitle: string;
  vargaLagna: string;
  natalLagnaRelation: string;

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
  };
}

const md = (x: number, m: number) => ((x % m) + m) % m;

// ── Varga Domain Metadata ──────────────────────────────────────
const VARGA_DOMAINS: Record<string, { title: string; karakas: string[]; focusArea: string }> = {
  D1:  { title: "Physical Body, Vitality & Core Life Direction", karakas: ["Sun"], focusArea: "Physical stamina, self-identity and stress resilience" },
  D2:  { title: "Wealth Creation, Financial Capacity & Resources", karakas: ["Jupiter", "Mercury"], focusArea: "Liquid wealth, asset building and scarcity vs abundance mindset" },
  D3:  { title: "Courage, Willpower, Siblings & Hands-on Effort", karakas: ["Mars"], focusArea: "Execution drive, physical stamina and brotherly/peer karma" },
  D4:  { title: "Fixed Assets, Real Estate & Domestic Sanctuary", karakas: ["Moon", "Venus"], focusArea: "Home peace, property acquisition and maternal blessings" },
  D7:  { title: "Children, Progeny Karma & Creative Legacy", karakas: ["Jupiter"], focusArea: "Creative fertility, generational legacy and parent-child rapport" },
  D9:  { title: "Soul Alignment, Inner Dharma & Marital Synergy", karakas: ["Venus", "Jupiter"], focusArea: "Spouse persona, sacred partnership and post-30 soul maturity" },
  D10: { title: "Career Apex, Authority, Enterprise & Public Impact", karakas: ["Sun", "Saturn", "Mercury"], focusArea: "Professional sovereign leadership, public prestige and monetization" },
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
    ancestral: "Rigid religious dogma, spiritual pride ya false orthodox gurus ke sath ancestral friction; gyan hone ke baad bhi practical application me aalsya.",
    distortion: "Intellectual Dogmatism (Har cheez me excessive intellectual debates aur action se pehle endless analysis).",
    rewrite: "Gyan ko ego-display ke bajay selfless guidance aur teaching ke liye channelize karein.",
    somatic: "Daily 5 minute silent breath observation (Vipassana/Pranayama) bina kisi phone ya text ke."
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
    distortion: "Cynical Nihilism ('Kuch bhi karne ka kya fayda, sab moh-maya hai' kehkar productive karma se retreat karna).",
    rewrite: "Ketu ki inward intuitive insight ko deeply focused specialized technology aur research me convert karein.",
    somatic: "Earthing Protocol: Daily 10 minute bare ground/earth contact ya deep solitary meditation."
  }
};

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

  // ── Natal Lagna Relation Synthesis ───────────────────────────
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

  // ── Dignity Audits in Varga ──────────────────────────────────
  const exaltedPlanets = varga.planets.filter(p => p.dignity === "Exalted");
  const ownPlanets = varga.planets.filter(p => p.dignity === "Own");
  const debPlanets = varga.planets.filter(p => p.dignity === "Debilitated");
  const dusthanaPlanets = varga.planets.filter(p => [6, 8, 12].includes(p.house));
  const lagnaPlanets = varga.planets.filter(p => p.inLagna);

  // ── CARD 1: D1-Aligned Deep Explanation Narrative ───────────
  const paragraphs: string[] = [];
  const keyHighlights: string[] = [];

  // P1: Lagna alignment
  paragraphs.push(
    `Aapke Natal Chart (D-1) me ${natalChart.lagnaRashi} Lagna udit hai, jiska lord ${natalChart.planets?.Mercury ? 'Budha' : 'Lagnesh'} hai. Jab hum ${varga.name} (${varga.key}) me pravesh karte hain, to yahan Lagna ${varga.lagna} ban jata hai, jo Natal Lagna se ${houseOffsetFromNatal}th position par hai. Yeh shastric configuration batati hai ki is varga ke vishay (${vMeta.focusArea}) aapki core personality ke sath kis tarah interact karte hain.`
  );

  // P2: Varga Karaka & Strong Planets
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

  // P3: Specialized Varga Insights
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

  // P4: Lagna Occupants & Active Focus
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
    : "Subconscious Inefficiency & Blind Spots";

  const psychologicalBottleneckDesc = hasAffliction
    ? `Jab is kshetra me pressure badhta hai, to aapka subconscious mind is distortion me chala jata hai: ${pat.distortion}`
    : `Is domain me sabhi graha balanced hone ke bawajood, proactive systemized routine na hone par results delay ho sakte hain.`;

  const ancestralLineagePattern = pat.ancestral;

  // ── CARD 3: Scientific & DNA-Based Neuro-Remedy Protocol ──────
  const ancestralLoopInterruption = pat.rewrite;
  const cognitiveRewiring = {
    techniqueName: `Neuro-Cognitive Reframing for ${primaryAfflicted}`,
    distortionLabel: pat.distortion,
    mindsetProtocol: `Subconscious habit break: ${pat.rewrite}`
  };

  const somaticBehavioralHabit = {
    habitName: `Daily Somatic Biomarker Reset (${primaryAfflicted})`,
    neuroMechanism: `Autonomic nervous system recalibration & neural pathway retraining for ${vMeta.title}`,
    dailyProtocol: pat.somatic
  };

  return {
    vargaKey: varga.key,
    vargaName: varga.name,
    domainTitle: vMeta.title,
    vargaLagna: varga.lagna,
    natalLagnaRelation: natalRelationDesc,
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
      somaticBehavioralHabit
    }
  };
}

