// ============================================================
// ASTROLIFE ASHTAKAVARGA ENGINE v2.0
// Extracted from AstroLife_v20_SwissEphem_Accurac
// Classical bindu tables · Sarvashtakavarga · House guide
// ============================================================

export interface AKVPlanet {
    planet:  string;
    icon:    string;
    color:   string;
    desc:    string;
    bindus:  number[];
    total:   number;
    max:     number;
    pct:     number;
    grade:   "Strong" | "Average" | "Weak";
    gradeColor: string;
  }
  
  export interface AKVHouse {
    house:    number;
    score:    number;
    grade:    "Strong" | "Average" | "Weak";
    color:    string;
    name:     string;
    theme:    string;
    interp:   string;
    topPlanets: string[];
  }

  export interface AKVMatrixRow {
    house: number;
    sign: string;
    planetBindus: Record<string, number>;
    total: number;
    grade: "Strong" | "Average" | "Weak";
  }

  export interface SodhyaPindaHouse {
    house: number;
    sign: string;
    name: string;
    bindus: number;
    score: number;
    grade: "Excellent" | "Good" | "Average" | "Weak";
    color: string;
    guidance: string;
  }
  
  export interface AKVResult {
    planets:  AKVPlanet[];
    sarva:    number[];
    sarvaTotal: number;
    matrix: AKVMatrixRow[];
    houses:   AKVHouse[];
    sodhyaPinda: SodhyaPindaHouse[];
    strongest: number[];  // top 3 house indices
    weakest:   number[];  // bottom 3 house indices
    bestTransitHouses: SodhyaPindaHouse[];
    sensitiveTransitHouses: SodhyaPindaHouse[];
    summary:  string;
    aiContext: string;
  }
  
  interface PD { house:number; sign:string; signNum:number; retrograde:boolean; dignity:string; lon:number; }
  
  // ── Classical AKV contribution tables ─────────────────────────
  // Each planet's row = contributions from [Sun,Moon,Mars,Mercury,Jupiter,Venus,Saturn,Lagna]
  const AKV_T: Record<string, number[][]> = {
    Sun:    [[1,2,4,7,8,9,10,11],[3,6,10,11],[1,2,4,7,8,9,10,11],[3,5,6,9,10,11,12],[5,6,9,11],[6,7,12],[1,2,4,7,8,9,10,11],[3,4,6,10,11,12]],
    Moon:   [[3,6,7,8,10,11],[1,3,6,7,10,11],[2,3,5,6,9,10,11],[1,3,4,5,7,8,10,11],[1,4,7,10,11,12],[3,4,5,7,9,10,11],[3,5,6,11],[3,6,10,11]],
    Mars:   [[3,5,6,10,11],[3,6,11],[1,2,4,7,8,10,11],[3,5,6,11],[6,10,11,12],[6,8,11,12],[1,4,7,8,9,10,11],[1,3,6,10,11]],
    Mercury:[[5,6,9,11,12],[2,4,6,8,10,11],[1,2,4,7,8,9,10,11],[1,3,5,6,9,10,11,12],[6,8,11,12],[1,2,3,4,5,8,9,11],[1,2,4,7,8,9,10,11],[1,2,4,6,8,10,11]],
    Jupiter:[[1,2,3,4,7,8,9,10,11],[2,5,7,9,11],[1,2,4,7,8,10,11],[1,2,4,5,6,9,10,11],[1,2,3,4,7,8,10,11],[2,5,6,9,10,11],[3,5,6,12],[1,2,4,5,6,7,9,10,11]],
    Venus:  [[8,11,12],[1,2,3,4,5,8,9,11,12],[3,4,6,9,11,12],[3,5,6,9,11],[5,8,9,10,11],[1,2,3,4,5,8,9,10,11],[3,4,5,8,9,10,11],[1,2,3,4,5,8,9,11]],
    Saturn: [[1,2,4,7,8,10,11],[3,6,11],[3,5,6,10,11,12],[6,8,9,10,11,12],[5,6,11,12],[6,11,12],[3,5,6,11],[1,3,4,6,10,11]],
  };
  
  const AKV_MAX: Record<string,number> = {
    Sun:48, Moon:49, Mars:39, Mercury:54, Jupiter:56, Venus:52, Saturn:39
  };
  
  const PLS7  = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  const PEMO7 = ["☉","☽","♂","☿","♃","♀","♄"];
  const PCOL7 = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa"];
  const PDESC: Record<string,string> = {
    Sun:"Soul, health, father, govt", Moon:"Mind, mother, public",
    Mars:"Energy, courage, land", Mercury:"Intelligence, business",
    Jupiter:"Wisdom, fortune, children", Venus:"Love, arts, luxury", Saturn:"Karma, service, longevity"
  };
  
  const md = (x:number,m:number)=>((x%m)+m)%m;
  
  const HOUSE_DATA: Record<number,{name:string;theme:string;high:string;mid:string;low:string}> = {
    1:{name:"Self & Body",theme:"Health, personality, physical vitality",
       high:"Strong self — good health, confident personality, initiative comes naturally.",
       mid:"Average — health manageable, personality needs conscious development.",
       low:"Weak 1H — health needs attention. Build discipline, morning routine critical."},
    2:{name:"Wealth & Family",theme:"Savings, speech, family harmony",
       high:"Good accumulation — savings stick, family support strong, voice carries authority.",
       mid:"Moderate — wealth comes and goes, family bonds average.",
       low:"Weak 2H — money does not stay. Focus on savings. Avoid harsh speech."},
    3:{name:"Efforts & Courage",theme:"Siblings, communication, bravery",
       high:"Bold, action-oriented. Siblings supportive. Communication work suits.",
       mid:"Moderate courage — results with sustained effort.",
       low:"Weak 3H — self-doubt before action. Practice courage daily."},
    4:{name:"Home & Happiness",theme:"Mother, property, emotional peace",
       high:"Strong home — property acquisition favored, emotional stability.",
       mid:"Average domestic happiness. Some property fluctuations.",
       low:"Weak 4H — home instability. Invest in creating your own peace. Meditation essential."},
    5:{name:"Intelligence & Luck",theme:"Children, creativity, past karma merit",
       high:"Sharp intellect, creative gifts. Children bring joy. Investments can work.",
       mid:"Average — education needs effort, some creative blocks.",
       low:"Weak 5H — avoid speculation. Focus on consistent study over shortcuts."},
    6:{name:"Enemies & Service",theme:"Health issues, debts, competition",
       high:"Defeats enemies, handles competition well. Medical fields suit.",
       mid:"Moderate — some recurring conflicts or health niggles.",
       low:"Weak 6H — vulnerability to enemies. Pay debts on time. Avoid conflicts."},
    7:{name:"Marriage & Business",theme:"Spouse, partnerships, foreign, trade",
       high:"Partnerships flourish, spouse brings support, business deals succeed.",
       mid:"Moderate — relationships need conscious nurturing.",
       low:"Weak 7H — relationship friction, delayed marriage. Compromise is key."},
    8:{name:"Transformation & Secrets",theme:"Longevity, hidden wealth, research",
       high:"Good longevity. Hidden assets, inheritance possible. Research abilities.",
       mid:"Average — life has some sudden changes, but manageable.",
       low:"Weak 8H — avoid risky situations. Health checkups regularly."},
    9:{name:"Fortune & Dharma",theme:"Father, guru, long travel, spirituality",
       high:"Blessed! Luck works, father/guru support. Long journeys, spiritual growth.",
       mid:"Moderate fortune — blessings come after effort.",
       low:"Weak 9H — luck does not come freely. Seva and donations activate this house."},
    10:{name:"Career & Status",theme:"Profession, authority, reputation",
       high:"Strong career trajectory. Recognition comes. Leadership roles suit.",
       mid:"Moderate career growth — steady but not spectacular without effort.",
       low:"Weak 10H — career needs extra effort. Stay consistent, avoid shortcuts."},
    11:{name:"Gains & Network",theme:"Income, social circle, wishes",
       high:"Excellent gains! Income streams multiple. Network valuable. Wishes fulfilled.",
       mid:"Moderate gains — some income fluctuations.",
       low:"Weak 11H — income gaps. Build relationships consciously."},
    12:{name:"Liberation & Losses",theme:"Foreign, expenses, spiritual liberation",
       high:"Foreign connections strong. Spiritual inclination. Moksha indicators present.",
       mid:"Average — some unnecessary expenses, sleep issues possible.",
       low:"Weak 12H — heavy expenses, hidden enemies. Budget strictly."},
  };

  const SIGN_LORDS = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
  const RASHIS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const EXALT: Record<string, number> = {Sun:0,Moon:1,Mars:9,Mercury:5,Jupiter:3,Venus:11,Saturn:6};
  const DEBIL: Record<string, number> = {Sun:6,Moon:7,Mars:3,Mercury:11,Jupiter:9,Venus:5,Saturn:0};
  const OWN: Record<string, number[]> = {Sun:[4],Moon:[3],Mars:[0,7],Mercury:[2,5],Jupiter:[8,11],Venus:[1,6],Saturn:[9,10]};
  const FRIEND: Record<string, string[]> = {
    Sun:["Moon","Mars","Jupiter"],
    Moon:["Sun","Mercury"],
    Mars:["Sun","Moon","Jupiter"],
    Mercury:["Sun","Venus"],
    Jupiter:["Sun","Moon","Mars"],
    Venus:["Mercury","Saturn"],
    Saturn:["Mercury","Venus"],
  };

  function rashiStrength(planet: string, rashiIdx: number) {
    if (rashiIdx === EXALT[planet]) return 2;
    if (OWN[planet]?.includes(rashiIdx)) return 1.75;
    if (rashiIdx === DEBIL[planet]) return 0.5;
    return FRIEND[planet]?.includes(SIGN_LORDS[rashiIdx]) ? 1.25 : 1;
  }
  
  // ── MAIN CALCULATOR ───────────────────────────────────────────
  export function calculateAshtakavarga(
    planets: Record<string,PD>,
    lagnaNum: number
  ): AKVResult {
    const contributors = [...PLS7, "Lagna"];
  
    // Calculate each planet's bindus
    const planetResults: Record<string,{bindus:number[];total:number;max:number}> = {};
  
    PLS7.forEach(target => {
      const tbl    = AKV_T[target];
      const bindus = new Array(12).fill(0);
  
      contributors.forEach((c, ci) => {
        const base = c === "Lagna" ? lagnaNum : planets[c]?.signNum ?? 0;
        tbl[ci].forEach(h => { bindus[md(base + (h-1), 12)]++; });
      });
  
      planetResults[target] = {
        bindus,
        total: bindus.reduce((a,b)=>a+b,0),
        max:   AKV_MAX[target],
      };
    });
  
    // Sarvashtakavarga
    const sarva = new Array(12).fill(0);
    PLS7.forEach(p => planetResults[p].bindus.forEach((b,i) => sarva[i] += b));
    const sarvaTotal = sarva.reduce((a,b)=>a+b,0);
  
    // Build planet objects
    const planetObjs: AKVPlanet[] = PLS7.map((planet, pi) => {
      const r    = planetResults[planet];
      const pct  = Math.round(r.total / r.max * 100);
      const grade: "Strong"|"Average"|"Weak" = pct>=70?"Strong":pct>=50?"Average":"Weak";
      return {
        planet, icon:PEMO7[pi], color:PCOL7[pi],
        desc:PDESC[planet],
        bindus:r.bindus, total:r.total, max:r.max, pct, grade,
        gradeColor: pct>=70?"#22c55e":pct>=50?"#c8a030":"#ef4444",
      };
    });
  
    // Build house objects
    const houses: AKVHouse[] = sarva.map((score, i) => {
      const h    = i+1;
      const data = HOUSE_DATA[h];
      const grade: "Strong"|"Average"|"Weak" = score>=28?"Strong":score>=25?"Average":"Weak";
      const color = score>=28?"#22c55e":score>=25?"#c8a030":"#ef4444";
      const interp = grade==="Strong"?data.high:grade==="Average"?data.mid:data.low;
  
      // Top contributing planets for this house
      const topPlanets = PLS7
        .map(p=>({p,b:planetResults[p].bindus[i]}))
        .sort((a,b)=>b.b-a.b)
        .slice(0,2)
        .filter(x=>x.b>0)
        .map(x=>`${x.p}(${x.b})`);
  
      return { house:h, score, grade, color, name:data.name, theme:data.theme, interp, topPlanets };
    });

    const matrix: AKVMatrixRow[] = sarva.map((total, i) => {
      const h = i + 1;
      const grade: "Strong"|"Average"|"Weak" = total>=28?"Strong":total>=25?"Average":"Weak";
      return {
        house: h,
        sign: RASHIS[md(lagnaNum + i, 12)],
        planetBindus: PLS7.reduce<Record<string, number>>((acc, planet) => {
          acc[planet] = planetResults[planet].bindus[i];
          return acc;
        }, {}),
        total,
        grade,
      };
    });

    const sodhyaPinda: SodhyaPindaHouse[] = sarva.map((bindus, i) => {
      const house = i + 1;
      const signIdx = md(lagnaNum + i, 12);
      let score = 0;
      PLS7.forEach((planet) => {
        score += planetResults[planet].bindus[i] * rashiStrength(planet, signIdx);
      });
      const rounded = Math.round(score * 10) / 10;
      const grade: SodhyaPindaHouse["grade"] =
        rounded >= 28 ? "Excellent" : rounded >= 22 ? "Good" : rounded >= 16 ? "Average" : "Weak";
      const color = grade === "Excellent" ? "#22c55e" : grade === "Good" ? "#c8a030" : grade === "Average" ? "#60a5fa" : "#ef4444";
      const data = HOUSE_DATA[house];

      return {
        house,
        sign: RASHIS[signIdx],
        name: data.name,
        bindus,
        score: rounded,
        grade,
        color,
        guidance:
          grade === "Excellent"
            ? `Strong transit delivery zone. Major benefic transits through H${house} can produce visible gains.`
            : grade === "Good"
              ? `Usable transit zone. Results improve when dasha and planet strength support H${house}.`
              : grade === "Average"
                ? `Moderate transit zone. Use planning and patience when this house is activated.`
                : `Sensitive transit zone. Avoid forcing results; use remedies and practical safeguards.`,
      };
    });
  
    const sorted    = [...sarva].map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v);
    const strongest = sorted.slice(0,3).map(x=>x.i);
    const weakest   = sorted.slice(-3).reverse().map(x=>x.i);
    const bestTransitHouses = [...sodhyaPinda].sort((a,b)=>b.score-a.score).slice(0,3);
    const sensitiveTransitHouses = [...sodhyaPinda].sort((a,b)=>a.score-b.score).slice(0,3);
  
    const summary = `Sarvashtakavarga total: ${sarvaTotal} bindus (standard 337). `+
      `Strongest houses: H${strongest.map(i=>i+1).join(", H")}. `+
      `Weakest houses: H${weakest.map(i=>i+1).join(", H")}.`;
    const aiContext = `${summary} Best Sodhya Pinda transit houses: ${bestTransitHouses.map(h=>`H${h.house} ${h.name} ${h.score}`).join(", ")}. Sensitive transit houses: ${sensitiveTransitHouses.map(h=>`H${h.house} ${h.name} ${h.score}`).join(", ")}.`;
  
    return { planets:planetObjs, sarva, sarvaTotal, matrix, houses, sodhyaPinda, strongest, weakest, bestTransitHouses, sensitiveTransitHouses, summary, aiContext };
  }
