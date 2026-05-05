// ============================================================
// ASTROLIFE YOGA ENGINE v3.0
// 100+ Yogas + 18 Doshas — 11 Categories
// Extracted from AstroLife_v20_SwissEphem_Accurac
// NO Tajaka / Varsha yogas — Janma Kundli only
// Free: 8 yogas + 3 doshas
// Premium: 55 yogas + 10 doshas
// Elite: All 100+ yogas + 18 doshas
// ============================================================

export type YogaCategory =
  | "Pancha Mahapurusha"
  | "Raja Yogas"
  | "Dhana Yogas"
  | "Nabhasa Patterns"
  | "Marriage Yogas"
  | "Career Yogas"
  | "Graha Combinations"
  | "Chandra Yogas"
  | "Spiritual Yogas"
  | "Structural Yogas"
  | "Doshas";

export type PlanTier = "free" | "premium" | "elite";

export interface YogaResult {
  name:        string;
  category:    YogaCategory;
  description: string;
  impact:      string;
  remedy?:     string;
  score:       number;
  present:     boolean;
  locked:      boolean;
  tier:        PlanTier;
  planets:     string[];
  rare:        boolean;
  isDosha:     boolean;
}

// ── Planet data shape (matches calculations.ts output) ────────
interface PD {
  house:      number;
  sign:       string;
  signNum:    number;
  retrograde: boolean;
  dignity:    string;
  lon:        number;
}

// ── Helpers ───────────────────────────────────────────────────
const md  = (x: number, m: number) => ((x % m) + m) % m;
const isK = (h: number) => [1,4,7,10].includes(h);
const isT = (h: number) => [1,5,9].includes(h);
const isD = (h: number) => [6,8,12].includes(h);
const isKT= (h: number) => isK(h) || isT(h);

const SIGN_LORDS: Record<string,string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
  Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
  Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter"
};

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
               "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

function conj(a: PD|null, b: PD|null) { return !!a && !!b && a.house === b.house; }
function hd(h1: number, h2: number)   { return md(h2 - h1, 12); }
function isExalted(p: string, sign: string) {
  const e: Record<string,string> = {Sun:"Aries",Moon:"Taurus",Mars:"Capricorn",Mercury:"Virgo",Jupiter:"Cancer",Venus:"Pisces",Saturn:"Libra"};
  return e[p] === sign;
}
function isOwnSign(p: string, sign: string) {
  const o: Record<string,string[]> = {Sun:["Leo"],Moon:["Cancer"],Mars:["Aries","Scorpio"],Mercury:["Gemini","Virgo"],Jupiter:["Sagittarius","Pisces"],Venus:["Taurus","Libra"],Saturn:["Capricorn","Aquarius"]};
  return (o[p]||[]).includes(sign);
}
function isDebilitated(p: string, sign: string) {
  const d: Record<string,string> = {Sun:"Libra",Moon:"Scorpio",Mars:"Cancer",Mercury:"Pisces",Jupiter:"Capricorn",Venus:"Virgo",Saturn:"Aries"};
  return d[p] === sign;
}

function getLord(house: number, lagnaNum: number, P: Record<string,PD>): PD|null {
  const sign = SIGNS[(lagnaNum + house - 1) % 12];
  const lord = SIGN_LORDS[sign];
  return P[lord] || null;
}

function conn(h1: number, h2: number, lagnaNum: number, P: Record<string,PD>): boolean {
  const a = getLord(h1, lagnaNum, P);
  const b = getLord(h2, lagnaNum, P);
  if (!a || !b) return false;
  return conj(a,b) || isK(md(a.house - b.house,12)+1) || isT(md(a.house - b.house,12)+1);
}

// ── MAIN DETECTOR ─────────────────────────────────────────────
export function detectYogas(
  planets: Record<string, PD>,
  lagnaNum: number,
  subscriptionTier: PlanTier = "free"
): YogaResult[] {
  const results: YogaResult[] = [];
  const P = planets;
  const L = (h: number) => getLord(h, lagnaNum, P);
  const tierRank: Record<PlanTier,number> = { free:0, premium:1, elite:2 };
  const userRank = tierRank[subscriptionTier];

  function add(
    name: string,
    category: YogaCategory,
    description: string,
    impact: string,
    score: number,
    condition: boolean,
    involvedPlanets: string[],
    tier: PlanTier = "premium",
    rare = false,
    isDosha = false,
    remedy?: string
  ) {
    results.push({
      name, category, description, impact, score,
      present: condition,
      locked: tierRank[tier] > userRank,
      tier, planets: involvedPlanets,
      rare, isDosha,
      remedy
    });
  }

  // ════════════════════════════════════════════════════════════
  // 1. PANCHA MAHAPURUSHA (5) — All FREE
  // ════════════════════════════════════════════════════════════
  add("Hamsa Yoga","Pancha Mahapurusha",
    "Jupiter in exaltation (Cancer) or own sign (Sagittarius/Pisces) in a Kendra house.",
    "Saintly nature, wisdom, righteousness, spiritual authority. Success in teaching, law, philosophy, religion. Beautiful eyes, sweet voice. Long, prosperous life.",
    88, !!P.Jupiter && isK(P.Jupiter.house) && ["Cancer","Sagittarius","Pisces"].includes(P.Jupiter.sign),
    ["Jupiter"],"free",true);

  add("Malavya Yoga","Pancha Mahapurusha",
    "Venus in exaltation (Pisces) or own sign (Taurus/Libra) in a Kendra house.",
    "Beauty, artistic genius, luxury, and wealth. Famous poet or artist. Happy married life. Graceful body, beautiful eyes, long prosperous life, beautiful spouse.",
    87, !!P.Venus && isK(P.Venus.house) && ["Pisces","Taurus","Libra"].includes(P.Venus.sign),
    ["Venus"],"free",true);

  add("Ruchaka Yoga","Pancha Mahapurusha",
    "Mars in exaltation (Capricorn) or own sign (Aries/Scorpio) in a Kendra house.",
    "Military prowess, courage, leadership ability. Famous commander, surgeon, athlete, police chief. Long life, conquers enemies, wealthy, bears marks of fame.",
    86, !!P.Mars && isK(P.Mars.house) && ["Capricorn","Aries","Scorpio"].includes(P.Mars.sign),
    ["Mars"],"free",true);

  add("Shasha Yoga","Pancha Mahapurusha",
    "Saturn in exaltation (Libra) or own sign (Capricorn/Aquarius) in a Kendra house.",
    "Commanding administrator, authority in service sector. Government authority, mining, forests, mountains. Fame rises in the 40s. Long-lived and disciplined leader.",
    85, !!P.Saturn && isK(P.Saturn.house) && ["Libra","Capricorn","Aquarius"].includes(P.Saturn.sign),
    ["Saturn"],"free",true);

  add("Bhadra Yoga","Pancha Mahapurusha",
    "Mercury in exaltation (Virgo) or own sign (Gemini/Virgo) in a Kendra house.",
    "Exceptional intellect, communication mastery, writing brilliance. Scholar, author, scientist, successful businessman. Melodious voice, elephant-like walk, well-built physique.",
    84, !!P.Mercury && isK(P.Mercury.house) && ["Virgo","Gemini"].includes(P.Mercury.sign),
    ["Mercury"],"free",true);

  // ════════════════════════════════════════════════════════════
  // 2. RAJA YOGAS (18)
  // ════════════════════════════════════════════════════════════
  add("Gajakesari Yoga","Raja Yogas",
    "Jupiter in Kendra from Moon — the most celebrated yoga in Vedic astrology.",
    "Exceptional wisdom, prosperity, fame, and noble character. Long-lasting positive results throughout life. Public recognition, honor, and social elevation.",
    90, !!P.Jupiter && !!P.Moon && isK(md(P.Jupiter.house - P.Moon.house,12)+1),
    ["Jupiter","Moon"],"free",true);

  add("Dharma-Karmadhipati Raja Yoga","Raja Yogas",
    "9th lord (dharma) and 10th lord (karma) are connected — one of the strongest Raja Yogas.",
    "Career through righteous deeds. Authority, fame, high government positions. The most powerful career-fortune combination in classical astrology.",
    82, conn(9,10,lagnaNum,P), [],"premium",true);

  add("Lagna-Karma Raja Yoga","Raja Yogas",
    "Lagna lord connected with 10th lord — personality linked with career.",
    "High career attainment, authority, success through own initiative and character. Rise through self-effort and personality power.",
    78, conn(1,10,lagnaNum,P), [],"premium");

  add("Lagna-Bhagya Raja Yoga","Raja Yogas",
    "Lagna lord connected with 9th lord — self linked with fortune.",
    "Rise through own efforts, good luck follows, fortune from birth. Classic raja yoga — prosperity and personality aligned.",
    76, conn(1,9,lagnaNum,P), [],"premium");

  add("Buddhi-Karma Raja Yoga","Raja Yogas",
    "5th lord connected with 10th lord — intelligence lord with career lord.",
    "Career through mental brilliance. Success in creative, artistic, educational, advisory roles. Strong career built on intellect and wisdom.",
    74, conn(5,10,lagnaNum,P), [],"premium");

  add("Dharma-Putra Raja Yoga","Raja Yogas",
    "5th and 9th lords connected — both trikonas united, double fortune.",
    "Highly auspicious combination. Children blessed, spiritual merit from past lives, wisdom and luck combined. Fortune multiplies over time.",
    72, conn(5,9,lagnaNum,P), [],"premium");

  add("Vargottama Raja Yoga","Raja Yogas",
    "Lagna lord is vargottama — same sign in both D-1 and D-9 chart.",
    "Extra strength to lagna lord. Consistent results across all divisional charts. Stable personality that achieves its goals steadily.",
    76, (() => { const l1 = L(1); return !!l1 && l1.signNum === (lagnaNum + 0) % 12; })(),
    [],"premium",true);

  add("Uttama Raja Yoga","Raja Yogas",
    "Two or more benefic planets in Kendra houses with high strength.",
    "Status, stability, and elevated social position. Multiple benefic supports create a strong, protected life path.",
    74, Object.entries(P).filter(([k,v])=>["Jupiter","Venus","Mercury","Moon"].includes(k)&&isK(v.house)).length >= 2,
    [],"premium");

  add("Chakravarti Yoga","Raja Yogas",
    "Sun and Moon both well-placed in Kendra or Trikona with benefic aspects.",
    "Universal authority, fame like an emperor. Leadership quality, public popularity, natural command over others. Royalty in modern sense.",
    80, !!P.Sun && !!P.Moon && isKT(P.Sun.house) && isKT(P.Moon.house),
    ["Sun","Moon"],"premium",true);

  add("Kesari Raja Yoga","Raja Yogas",
    "Jupiter in Kendra from Lagna (not just Moon) with good strength.",
    "Wisdom-based rise, authority through knowledge and character. Respected by society, success in academic or spiritual fields.",
    74, !!P.Jupiter && isK(P.Jupiter.house),
    ["Jupiter"],"premium");

  add("Simhasana Yoga","Raja Yogas",
    "Two or more planets with high shadbala (strength) occupy Kendra houses.",
    "Throne-like position in society. Authority, command, and respected leadership. Sits in positions of power.",
    76, Object.values(P).filter(v=>isK(v.house)).length >= 3,
    [],"premium");

  add("Chamara Yoga","Raja Yogas",
    "Two or more exalted planets in Lagna or aspecting Lagna.",
    "Royal treatment, honored like royalty, famous for virtue. Recognition, awards, and public honor throughout life.",
    72, Object.entries(P).filter(([k,v])=>isExalted(k,v.sign)&&(v.house===1||v.house===7)).length >= 1,
    [],"premium");

  add("Sukha-Bhagya Raja Yoga","Raja Yogas",
    "4th lord connected with 9th lord — comforts and fortune linked.",
    "Happy home, property, maternal blessing, and fortune. Good life quality, vehicles, real estate, mother's grace and luck.",
    70, conn(4,9,lagnaNum,P), [],"premium");

  add("Harsha Yoga","Raja Yogas",
    "6th lord placed in the 6th house itself — Viparita variation.",
    "Victory over enemies, competitive strength, resilience, and practical resistance. Strong immunity. Success in litigation and disputes.",
    72, (() => { const l=L(6); return !!l && l.house===6; })(), [],"premium");

  add("Sarala Yoga","Raja Yogas",
    "8th lord placed in the 8th house itself — powerful Viparita Raja Yoga.",
    "Protection in crisis, hidden endurance, and survival through transformation. Long life. Occult wisdom. Success in research and hidden fields.",
    71, (() => { const l=L(8); return !!l && l.house===8; })(), [],"premium");

  add("Vimal Yoga","Raja Yogas",
    "12th lord placed in the 12th house itself — third Viparita Raja Yoga.",
    "Clarity in losses, detached wisdom, and spiritual maturity. Cleaner expenditure. Success in foreign lands and spiritual work.",
    70, (() => { const l=L(12); return !!l && l.house===12; })(), [],"premium");

  add("Neecha Bhanga Raja Yoga","Raja Yogas",
    "A debilitated planet's weakness is cancelled by specific planetary conditions.",
    "Initial struggles and setbacks followed by eventual great rise. Stronger than regular placements after age 30. Remarkable comeback story.",
    76, Object.entries(P).some(([k,v])=>isDebilitated(k,v.sign)&&!!L(v.signNum+1)),
    [],"premium");

  add("Viparita Raja Yoga","Raja Yogas",
    "Dusthana lords placed in each other's dusthana houses — negatives cancel each other.",
    "Rise through adversity. Success after overcoming great obstacles. Survivor advantage. Often very late but dramatic success.",
    74, (() => {
      const l6=L(6),l8=L(8),l12=L(12);
      let count=0;
      if(l6&&isD(l6.house)&&l6.house!==6) count++;
      if(l8&&isD(l8.house)&&l8.house!==8) count++;
      if(l12&&isD(l12.house)&&l12.house!==12) count++;
      return count>=2;
    })(), [],"premium");

  // ════════════════════════════════════════════════════════════
  // 3. DHANA YOGAS (15)
  // ════════════════════════════════════════════════════════════
  add("Budhaditya Yoga","Dhana Yogas",
    "Sun and Mercury conjunct in the same house — classic wealth and intelligence yoga.",
    "Sharp analytical mind, excellent communication, government support, and success in business and intellectual fields.",
    80, conj(P.Sun,P.Mercury), ["Sun","Mercury"],"free");

  add("Dhana Yoga (2nd-11th)","Dhana Yogas",
    "2nd lord and 11th lord connected — family wealth and personal gains both active.",
    "Wealth accumulation, financial growth through family and networks. Kutumba-Labha yoga brings dual income streams.",
    72, conn(2,11,lagnaNum,P), [],"free");

  add("Kubera Yoga","Dhana Yogas",
    "2nd lord exalted and 11th lord in trikona/kendra — treasury like Kubera, god of wealth.",
    "Exceptional financial accumulation, lasting wealth, recognized as prosperous. Named after Kubera, the divine treasurer.",
    82, (() => { const l2=L(2),l11=L(11); return !!l2&&isExalted(SIGN_LORDS[P[Object.keys(P).find(k=>P[k]===l2)||""]?.sign||""]||"",l2.sign)&&!!l11&&isKT(l11.house); })(),
    [],"premium",true);

  add("Dhana Yoga (2nd-9th)","Dhana Yogas",
    "Wealth and fortune lords connected — lucky financial gains, inherited wealth.",
    "Bhagya-Dhana is one of the best wealth combinations. Fortune blesses finances. Father's wealth and ancestral blessings.",
    74, conn(2,9,lagnaNum,P), [],"premium");

  add("Dhana Yoga (9th-11th)","Dhana Yogas",
    "Fortune and gains linked — fortunate income, network gains through luck.",
    "Wealth comes effortlessly through blessed connections. Lucky social network, income from fortunate sources.",
    72, conn(9,11,lagnaNum,P), [],"premium");

  add("Dhana Parivartana Yoga","Dhana Yogas",
    "2nd and 11th lords exchange signs — mutual amplification of wealth and gains.",
    "Extraordinary financial growth. Family wealth and personal gains enhance each other. One of the best exchange yogas for wealth.",
    76, (() => { const l2=L(2),l11=L(11); if(!l2||!l11)return false; return SIGN_LORDS[l2.sign]===Object.keys(P).find(k=>P[k]===l11)&&SIGN_LORDS[l11.sign]===Object.keys(P).find(k=>P[k]===l2); })(),
    [],"premium",true);

  add("Artha Trikona Yoga","Dhana Yogas",
    "All artha-axis lords (2nd, 6th, 10th) strong and connected.",
    "Wealth through work, service, and accumulated resources all aligned. Financial success from multiple income streams simultaneously.",
    72, (() => { const l2=L(2),l6=L(6),l10=L(10); return !!l2&&!!l6&&!!l10&&(isKT(l2.house)||isKT(l6.house))&&isKT(l10.house); })(),
    [],"premium");

  add("Guru Dhana Yoga","Dhana Yogas",
    "Jupiter in 2nd or 11th house — wealth through wisdom and education.",
    "Expansive finances, generous nature, wealth increases over time. Income through teaching, consulting, and wisdom-based professions.",
    66, !!P.Jupiter && [2,11].includes(P.Jupiter.house), ["Jupiter"],"premium");

  add("Shukra Dhana Yoga","Dhana Yogas",
    "Venus in 2nd or 11th house — wealth through arts, beauty, and entertainment.",
    "Financial gains from pleasurable pursuits. Success in luxury goods, arts, entertainment. Beautiful possessions and pleasurable life.",
    64, !!P.Venus && [2,11].includes(P.Venus.house), ["Venus"],"premium");

  add("Dhana Bhandara Yoga","Dhana Yogas",
    "Multiple planets (2+) in the 2nd house — wealth treasury filled.",
    "Strong family background, multiple income sources, good speech, powerful voice. Family wealth and resources are substantial.",
    66, Object.values(P).filter(v=>v.house===2).length>=2, [],"premium");

  add("Labha Sampatti Yoga","Dhana Yogas",
    "Multiple planets in 11th house — multiple gain sources and large network.",
    "Elder siblings supportive, wishes fulfilled, abundance of income opportunities. Multiple streams of gains simultaneously active.",
    64, Object.values(P).filter(v=>v.house===11).length>=2, [],"premium");

  add("Pitru Dhana Yoga","Dhana Yogas",
    "2nd lord in 9th or 9th lord in 2nd — inherited wealth from father or ancestors.",
    "Legacy wealth, ancestral property, blessed financial inheritance. Father's earnings bless the native.",
    66, (() => { const l2=L(2),l9=L(9); return (!!l2&&l2.house===9)||(!!l9&&l9.house===2); })(), [],"premium");

  add("Surya Labha Yoga","Dhana Yogas",
    "Sun in 11th house — income from government and authority figures.",
    "Social gains, recognition brings income. Respected in social circles for earnings. Government benefits and honors.",
    64, !!P.Sun && P.Sun.house===11, ["Sun"],"premium");

  add("Shani Labha Yoga","Dhana Yogas",
    "Saturn in 11th house — slow but steady gains through service and discipline.",
    "Gains increase with age. Long-lasting financial stability after initial delay. Income from masses, service, and disciplined effort.",
    62, !!P.Saturn && P.Saturn.house===11, ["Saturn"],"premium");

  add("Nivesha Dhana Yoga","Dhana Yogas",
    "5th lord in 2nd or 11th — wealth through investments and speculation.",
    "Stock market gains, creative income, children bring financial benefits. Speculation and investments yield positive returns.",
    64, (() => { const l5=L(5); return !!l5&&[2,11].includes(l5.house); })(), [],"premium");

  // ════════════════════════════════════════════════════════════
  // 4. NABHASA PATTERNS (10)
  // ════════════════════════════════════════════════════════════
  add("Sunapha Yoga","Nabhasa Patterns",
    "Planets (except Sun/Rahu/Ketu) in 2nd from Moon, none in 12th from Moon.",
    "Self-effort, independence, and pragmatic intelligence. Success through personal ability and initiative. Earns through own merit.",
    60, (() => { if(!P.Moon)return false; const h2=P.Moon.house%12+1,h12=P.Moon.house===1?12:P.Moon.house-1; const ex=["Sun","Rahu","Ketu","Moon"]; const has2=Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h2); const has12=Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h12); return has2&&!has12; })(),
    ["Moon"],"premium");

  add("Anafa Yoga","Nabhasa Patterns",
    "Planets in 12th from Moon, none in 2nd from Moon.",
    "Inner dignity, restraint, and reflective strength. Success through preparation and inner reserves. Graceful, self-contained personality.",
    60, (() => { if(!P.Moon)return false; const h2=P.Moon.house%12+1,h12=P.Moon.house===1?12:P.Moon.house-1; const ex=["Sun","Rahu","Ketu","Moon"]; const has2=Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h2); const has12=Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h12); return has12&&!has2; })(),
    ["Moon"],"premium");

  add("Durudhara Yoga","Nabhasa Patterns",
    "Planets on both sides of Moon (2nd and 12th from Moon).",
    "Balanced support, resourcefulness, and worldly capacity. Surrounded by helpful planetary energies from all directions.",
    65, (() => { if(!P.Moon)return false; const h2=P.Moon.house%12+1,h12=P.Moon.house===1?12:P.Moon.house-1; const ex=["Sun","Rahu","Ketu","Moon"]; const has2=Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h2); const has12=Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h12); return has2&&has12; })(),
    ["Moon"],"premium");

  add("Vesi Yoga","Nabhasa Patterns",
    "Planet in 2nd from Sun, none in 12th from Sun.",
    "Practical intelligence, public composure, and functional power. Speaks with authority and purpose.",
    58, (() => { if(!P.Sun)return false; const h2=P.Sun.house%12+1,h12=P.Sun.house===1?12:P.Sun.house-1; const ex=["Sun","Moon","Rahu","Ketu"]; return Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h2)&&!Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h12); })(),
    ["Sun"],"premium");

  add("Voshi Yoga","Nabhasa Patterns",
    "Planet in 12th from Sun, none in 2nd from Sun.",
    "Preparedness, reserve energy, and inner discipline. Strength through careful preparation and reflection.",
    57, (() => { if(!P.Sun)return false; const h2=P.Sun.house%12+1,h12=P.Sun.house===1?12:P.Sun.house-1; const ex=["Sun","Moon","Rahu","Ketu"]; return !Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h2)&&Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h12); })(),
    ["Sun"],"premium");

  add("Ubhayachari Yoga","Nabhasa Patterns",
    "Planets on both sides of Sun (2nd and 12th from Sun).",
    "Versatility, leadership support, and worldly adaptability. Naturally balanced and well-resourced personality.",
    63, (() => { if(!P.Sun)return false; const h2=P.Sun.house%12+1,h12=P.Sun.house===1?12:P.Sun.house-1; const ex=["Sun","Moon","Rahu","Ketu"]; return Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h2)&&Object.entries(P).some(([k,v])=>!ex.includes(k)&&v.house===h12); })(),
    ["Sun"],"premium");

  add("Graha Malika Yoga","Nabhasa Patterns",
    "All planets occupy consecutive houses forming a garland pattern.",
    "Garland of planets — concentrated life force in a specific zodiac arc. Intense focus in particular life areas.",
    68, (() => { const houses=[...new Set(Object.values(P).map(p=>p.house))].sort((a,b)=>a-b); if(houses.length<5)return false; for(let i=0;i<houses.length-1;i++){if(houses[i+1]-houses[i]>2)return false;} return true; })(),
    [],"elite",true);

  add("Adhi Yoga","Nabhasa Patterns",
    "Two or more benefics in 6th, 7th, 8th from Moon.",
    "Protection, steady support, public poise, and natural authority. Respected leader with natural magnetism and immunity to enemies.",
    68, (() => { if(!P.Moon)return false; const houses=[md(P.Moon.house+4,12)+1,md(P.Moon.house+5,12)+1,md(P.Moon.house+6,12)+1]; return Object.entries(P).filter(([k,v])=>["Jupiter","Venus","Mercury"].includes(k)&&houses.includes(v.house)).length>=2; })(),
    ["Moon"],"premium");

  add("Shubha Kartari Yoga","Nabhasa Patterns",
    "Benefics in both 12th and 2nd houses from Lagna — Lagna hemmed by positive energy.",
    "Natural protection, smooth life path, and supportive environment. First house energized by benefic planets on both sides.",
    72, Object.entries(P).some(([k,v])=>["Jupiter","Venus","Mercury","Moon"].includes(k)&&v.house===12)&&Object.entries(P).some(([k,v])=>["Jupiter","Venus","Mercury","Moon"].includes(k)&&v.house===2),
    [],"premium");

  add("Two-Benefic Kendra Yoga","Nabhasa Patterns",
    "Two or more benefic planets in Kendra houses.",
    "Strong karmic foundation, stable life, multiple sources of support. Benefic energy anchors all four pillars of the chart.",
    65, Object.entries(P).filter(([k,v])=>["Jupiter","Venus","Mercury","Moon"].includes(k)&&isK(v.house)).length>=2,
    [],"premium");

  // ════════════════════════════════════════════════════════════
  // 5. MARRIAGE YOGAS (12)
  // ════════════════════════════════════════════════════════════
  add("Saubhagya Yoga","Marriage Yogas",
    "Venus and Jupiter connected through conjunction or mutual Kendra/Trikona.",
    "Great marital fortune and happiness. Beautiful, wealthy, or spiritually inclined partner. Marriage brings prosperity and joy.",
    76, conj(P.Venus,P.Jupiter)||(!!P.Venus&&!!P.Jupiter&&isK(md(P.Venus.house-P.Jupiter.house,12)+1)),
    ["Venus","Jupiter"],"premium",true);

  add("Romantic Attraction Yoga","Marriage Yogas",
    "Venus in 5th house or 5th lord connected with Venus — love and romance strongly indicated.",
    "Strong romantic nature, attractive personality, multiple romantic opportunities. Love life is a central theme of existence.",
    68, (!!P.Venus&&P.Venus.house===5)||(!!P.Venus&&conn(5,7,lagnaNum,P)),
    ["Venus"],"premium");

  add("Love Marriage Indicator","Marriage Yogas",
    "5th lord and 7th lord connected — love converts to marriage.",
    "Love marriage strongly indicated. Chooses partner through personal connection, not arrangement. Romance leads to committed union.",
    70, conn(5,7,lagnaNum,P), [],"premium");

  add("Marriage Promise Yoga","Marriage Yogas",
    "7th lord strong and well-placed in Kendra or Trikona.",
    "Marriage is promised and will happen. Strong 7th house lord ensures partnership in life. Good spouse relationship.",
    72, (() => { const l7=L(7); return !!l7&&isKT(l7.house); })(), [],"premium");

  add("Delayed Marriage Yoga","Marriage Yogas",
    "Saturn aspects or occupies the 7th house, or 7th lord is in Saturn's sign.",
    "Marriage happens later in life — typically after 28-30. Karmic lessons around partnerships. When it comes, it is stable and mature.",
    45, !!P.Saturn&&(P.Saturn.house===7||[7].includes(md(P.Saturn.house+6,12)+1)),
    ["Saturn"],"premium");

  add("Marriage Delay by Saturn","Marriage Yogas",
    "Saturn in 7th house or aspecting 7th lord directly.",
    "Significant delay in marriage. Partner may be older, serious, or from a different background. Discipline and maturity in relationship.",
    42, !!P.Saturn&&P.Saturn.house===7, ["Saturn"],"premium");

  add("Foreign Spouse Yoga","Marriage Yogas",
    "Rahu in 7th house or 7th lord in Rahu's sign or conjunct Rahu.",
    "Spouse from foreign land, different culture, or unconventional background. International marriage or unusual circumstances of meeting.",
    60, !!P.Rahu&&(P.Rahu.house===7||(!!L(7)&&conj(L(7),P.Rahu))),
    ["Rahu"],"premium");

  add("Kalatra-Bhagya Yoga","Marriage Yogas",
    "7th lord connected with 9th lord — partnership and fortune linked.",
    "Rise through partnerships, beneficial spouse who brings luck. Business and personal partnerships align with fortune.",
    66, conn(7,9,lagnaNum,P), [],"premium");

  add("Kalatra-Labha Yoga","Marriage Yogas",
    "7th lord connected with 11th lord — partnership brings gains.",
    "Spouse is a source of income and gains. Business partnerships profitable. Social network expands through marriage.",
    64, conn(7,11,lagnaNum,P), [],"premium");

  add("Saubhagya Kalatra Yoga","Marriage Yogas",
    "Venus exalted or in own sign with strong 7th house.",
    "Extremely fortunate marriage. Beautiful, wealthy, or spiritually gifted spouse. Marriage is a cornerstone of success.",
    74, !!P.Venus&&(isExalted("Venus",P.Venus.sign)||isOwnSign("Venus",P.Venus.sign))&&isKT(P.Venus.house),
    ["Venus"],"premium",true);

  add("Spouse Wealth Yoga","Marriage Yogas",
    "2nd lord connected with 7th lord — family wealth comes through spouse.",
    "Financial gains through marriage or business partnerships. Spouse contributes significantly to family income and stability.",
    64, conn(2,7,lagnaNum,P), [],"elite");

  add("Kalatra-Dhana Yoga","Marriage Yogas",
    "7th lord connected with 2nd lord — marriage and wealth aligned.",
    "Spouse brings wealth or marriage improves financial standing. Business through partnerships. Joint assets grow after marriage.",
    62, conn(7,2,lagnaNum,P), [],"elite");

  // ════════════════════════════════════════════════════════════
  // 6. CAREER YOGAS (10)
  // ════════════════════════════════════════════════════════════
  add("Karmabha Yoga","Career Yogas",
    "Planet(s) occupying the 10th house — career activation through direct planetary placement.",
    "Direct career activation. The planet's energy shapes career path and profession. Strong career presence.",
    70, Object.values(P).some(v=>v.house===10), [],"free");

  add("Karma Bala Yoga","Career Yogas",
    "10th lord exalted or in own sign — exceptional career strength.",
    "Peak career performance, natural authority, recognition at the highest levels. Career is a source of great strength and identity.",
    78, (() => { const l10=L(10); return !!l10&&(isExalted(Object.keys(P).find(k=>P[k]===l10)||"",l10.sign)||isOwnSign(Object.keys(P).find(k=>P[k]===l10)||"",l10.sign)); })(),
    [],"premium",true);

  add("Dharma-Karma Yoga","Career Yogas",
    "9th lord connected with 10th lord — fortune and career aligned.",
    "Career through righteous work. Fortune follows career. Dharmic profession brings prosperity and recognition.",
    76, conn(9,10,lagnaNum,P), [],"premium");

  add("Ravi Yoga (Sun Kendra)","Career Yogas",
    "Sun in a Kendra house — solar energy powers career and authority.",
    "Natural leadership, government support, career in authority positions. Sun in kendra gives digbala or directional strength.",
    68, !!P.Sun&&isK(P.Sun.house), ["Sun"],"premium");

  add("Guru Karma Yoga","Career Yogas",
    "Jupiter in 10th house — wisdom-based career and public honor.",
    "Career in teaching, law, finance, or spiritual guidance. Public respect and honor. Success through wisdom and ethical conduct.",
    74, !!P.Jupiter&&P.Jupiter.house===10, ["Jupiter"],"premium");

  add("Karma-Lagna Yoga","Career Yogas",
    "Lagna lord and 10th lord connected — personality and career unified.",
    "Career becomes central identity. Natural alignment between who you are and what you do professionally.",
    72, conn(1,10,lagnaNum,P), [],"premium");

  add("Karma-Buddhi Yoga","Career Yogas",
    "5th lord and 10th lord connected — intelligence fuels career.",
    "Career success through intellectual contribution. Creative and advisory roles. Success in competitive examinations.",
    70, conn(5,10,lagnaNum,P), [],"premium");

  add("Sun in Karma Bhava","Career Yogas",
    "Sun placed in 10th house — digbali Sun, peak career placement.",
    "Most powerful career placement for Sun. Government favor, authority, fame, and recognition. Career is paramount.",
    80, !!P.Sun&&P.Sun.house===10, ["Sun"],"premium",true);

  add("Guru Kripa Yoga","Career Yogas",
    "Jupiter aspects the 10th lord or 10th house from its position.",
    "Jupiter's blessing on career — wisdom, ethics, and dharma guide professional life. Success through righteous conduct.",
    68, !!P.Jupiter&&(md(P.Jupiter.house+8,12)+1===10||md(P.Jupiter.house+4,12)+1===10||md(P.Jupiter.house,12)+1===10),
    ["Jupiter"],"premium");

  add("Lagna-Putra Raja Yoga","Career Yogas",
    "Lagna lord connected with 5th lord — self linked with intelligence and creativity.",
    "Brilliant mind, creative success, good children, speculation gains. Career through creativity and intellectual power.",
    66, conn(1,5,lagnaNum,P), [],"elite");

  // ════════════════════════════════════════════════════════════
  // 7. GRAHA COMBINATIONS (10)
  // ════════════════════════════════════════════════════════════
  add("Chandra-Mangala Yoga","Graha Combinations",
    "Moon and Mars conjunct in the same house.",
    "Strong will power and entrepreneurial drive. Financial acumen through bold action. Earning through property and mother's line.",
    68, conj(P.Moon,P.Mars), ["Moon","Mars"],"premium");

  add("Guru-Mangala Yoga","Graha Combinations",
    "Jupiter and Mars conjunct — wisdom and courage combined.",
    "Energetic wisdom with ethical courage. Success in law, military leadership, and dharmic action. Righteous fighter.",
    70, conj(P.Jupiter,P.Mars), ["Jupiter","Mars"],"premium");

  add("Lakshmi-Narayana Yoga","Graha Combinations",
    "Jupiter and Venus conjunct or in mutual Kendra — wealth and dharma united.",
    "Wealth combined with wisdom. Luxury and dharma together. Success in finance, arts, and spirituality. Divine blessings.",
    82, conj(P.Jupiter,P.Venus)||(!!P.Jupiter&&!!P.Venus&&isK(md(P.Jupiter.house-P.Venus.house,12)+1)),
    ["Jupiter","Venus"],"premium",true);

  add("Guru-Shani Dharma Yoga","Graha Combinations",
    "Jupiter and Saturn conjunct or in strong mutual relationship.",
    "Patient wisdom leading to massive success. Philosophy, law, and established systems. Slow but foundational achievement.",
    70, conj(P.Jupiter,P.Saturn)||(!!P.Jupiter&&!!P.Saturn&&isK(md(P.Jupiter.house-P.Saturn.house,12)+1)),
    ["Jupiter","Saturn"],"premium");

  add("Guru-Budha-Shukra Blend","Graha Combinations",
    "Jupiter, Mercury, and Venus all in Kendra or Trikona houses.",
    "Triple benefic harmony — wisdom, intelligence, and beauty all aligned. Exceptional creative, intellectual, and spiritual gifts.",
    78, ["Jupiter","Mercury","Venus"].filter(p=>P[p]&&isKT(P[p].house)).length>=2,
    ["Jupiter","Mercury","Venus"],"premium",true);

  add("Surya-Guru-Mangala Blend","Graha Combinations",
    "Sun, Jupiter, and Mars connected or all well-placed.",
    "Triple masculine planet harmony — authority, wisdom, and courage united. Leadership, dharma, and action perfectly blended.",
    74, ["Sun","Jupiter","Mars"].filter(p=>P[p]&&isKT(P[p].house)).length>=2,
    ["Sun","Jupiter","Mars"],"premium");

  add("Angarak Yoga","Graha Combinations",
    "Mars and Rahu conjunct in the same house.",
    "Explosive energy and technical innovation. High accident risk. Exceptional in military, surgery, technology, and sports. Channel energy carefully.",
    52, conj(P.Mars,P.Rahu), ["Mars","Rahu"],"premium");

  add("Guru-Chandal Yoga","Graha Combinations",
    "Jupiter and Rahu conjunct — wisdom challenged by unconventional influences.",
    "Unconventional teaching and learning. Foreign guru or philosophy. Risk of mixing incompatible wisdom. Can produce revolutionary thinkers.",
    48, conj(P.Jupiter,P.Rahu), ["Jupiter","Rahu"],"premium");

  add("Parivartana Yoga","Graha Combinations",
    "Two planets exchange signs — each in the other's ruling sign.",
    "Mutual exchange amplifies both linked houses. Often produces unexpected rise in both areas simultaneously.",
    76, (() => { const keys=Object.keys(P); for(let i=0;i<keys.length;i++){for(let j=i+1;j<keys.length;j++){const a=keys[i],b=keys[j]; if(P[a]&&P[b]&&SIGN_LORDS[P[a].sign]===b&&SIGN_LORDS[P[b].sign]===a)return true;}} return false; })(),
    [],"premium");

  add("Visha Yoga","Graha Combinations",
    "Moon and Saturn conjunct — emotions meet discipline and restriction.",
    "Emotional discipline, serious mind, heavy mother karma. Depression risk but also exceptional focus. Success after struggle.",
    45, conj(P.Moon,P.Saturn), ["Moon","Saturn"],"elite");

  // ════════════════════════════════════════════════════════════
  // 8. CHANDRA YOGAS (6)
  // ════════════════════════════════════════════════════════════
  add("Chandra Lakshmi Yoga","Chandra Yogas",
    "Moon in Taurus (exaltation) or Cancer (own sign) in Kendra.",
    "Emotional prosperity, mother's blessings, public popularity, wealth through nurturing. Moon at peak strength.",
    76, !!P.Moon&&["Taurus","Cancer"].includes(P.Moon.sign)&&isKT(P.Moon.house),
    ["Moon"],"premium",true);

  add("Purnima Support Yoga","Chandra Yogas",
    "Moon is full or near full (born close to Purnima — full moon).",
    "Strong mental clarity, emotional balance, and public support. Full moon energy provides stability, intuition, and charisma.",
    68, !!P.Moon&&!!P.Sun&&md(Math.abs(P.Moon.lon-P.Sun.lon),360)>150,
    ["Moon","Sun"],"premium");

  add("Amavasya Influence Yoga","Chandra Yogas",
    "Moon is very close to Sun (new moon birth — Amavasya).",
    "Deeply introspective, private nature. Strong inner life but may struggle with public expression. Spiritual depth and sensitivity.",
    45, !!P.Moon&&!!P.Sun&&md(Math.abs(P.Moon.lon-P.Sun.lon),360)<15,
    ["Moon","Sun"],"premium");

  add("Shukla Paksha Growth Yoga","Chandra Yogas",
    "Moon is in waxing phase (Shukla Paksha) at birth.",
    "Growing strength throughout life. Prospects improve progressively. The waxing energy supports expansion and growth.",
    62, !!P.Moon&&!!P.Sun&&md(P.Moon.lon-P.Sun.lon,360)<180,
    ["Moon"],"premium");

  add("Krishna Paksha Introspection","Chandra Yogas",
    "Moon is in waning phase (Krishna Paksha) at birth.",
    "Reflective, introspective nature. Inner wisdom develops through contemplation. More power in night-time activities.",
    55, !!P.Moon&&!!P.Sun&&md(P.Moon.lon-P.Sun.lon,360)>180,
    ["Moon"],"premium");

  add("Meditative Moon Yoga","Chandra Yogas",
    "Moon in 12th house or in Pisces — deeply introspective Moon.",
    "Deep meditation ability, psychic sensitivity, spiritual inclination. Past-life wisdom accessible. Success in spiritual and foreign fields.",
    60, !!P.Moon&&(P.Moon.house===12||P.Moon.sign==="Pisces"),
    ["Moon"],"elite");

  // ════════════════════════════════════════════════════════════
  // 9. SPIRITUAL YOGAS (10)
  // ════════════════════════════════════════════════════════════
  add("Parivrajya Yoga","Spiritual Yogas",
    "Saturn, Ketu, or Jupiter in 12th house — renunciation and moksha energy.",
    "Deep spiritual inclination, potential for renunciation. Foreign travel. Moksha-oriented life path. Success in ashrams and spiritual work.",
    65, (!!P.Saturn&&P.Saturn.house===12)||(!!P.Ketu&&P.Ketu.house===12)||(!!P.Jupiter&&P.Jupiter.house===12),
    [],"premium");

  add("Dharma Yoga","Spiritual Yogas",
    "Jupiter in 9th house — most auspicious placement for Jupiter.",
    "Blessed with dharmic fortune. Father as guru figure. Higher education and spiritual wisdom. Fortune multiplies through righteous living.",
    78, !!P.Jupiter&&P.Jupiter.house===9,
    ["Jupiter"],"premium");

  add("Moksha Yoga","Spiritual Yogas",
    "Ketu in 12th house — liberation and spiritual detachment.",
    "Strong pull toward spiritual liberation. Natural detachment from material world. Meditation and past-life wisdom accessible.",
    68, !!P.Ketu&&P.Ketu.house===12,
    ["Ketu"],"premium");

  add("Tapasvi Yoga","Spiritual Yogas",
    "Saturn and Ketu connected — disciplined spiritual effort.",
    "Ascetic tendencies, strong willpower for spiritual practice. Success through tapas (austerity) and disciplined sadhana.",
    64, conj(P.Saturn,P.Ketu)||(!!P.Saturn&&!!P.Ketu&&isK(md(P.Saturn.house-P.Ketu.house,12)+1)),
    ["Saturn","Ketu"],"elite");

  add("Bhakti Yoga","Spiritual Yogas",
    "Jupiter and Moon connected with 12th house influence — devotion path.",
    "Natural devotional nature, deep faith, and spiritual love. Success in bhakti traditions, singing, and heart-centered spirituality.",
    66, conj(P.Jupiter,P.Moon)||(!!P.Jupiter&&P.Jupiter.house===12)||(!!P.Moon&&P.Moon.house===12),
    ["Jupiter","Moon"],"elite");

  add("Jnana Yoga (Mind-Wisdom)","Spiritual Yogas",
    "Mercury and Jupiter connected with 9th house — path of knowledge.",
    "Intellectual spirituality, philosophical inquiry, teaching, and writing about higher wisdom. Scholar-sage combination.",
    68, conj(P.Mercury,P.Jupiter)||(!!P.Mercury&&P.Mercury.house===9),
    ["Mercury","Jupiter"],"elite");

  add("Dharma-Moksha Yoga","Spiritual Yogas",
    "9th lord connected with 12th lord — dharma leads to liberation.",
    "Spiritual dharma culminating in moksha. Pilgrimage, spiritual travel, dharmic renunciation. Life purpose is spiritually oriented.",
    66, conn(9,12,lagnaNum,P), [],"elite");

  add("Vairagya Yoga","Spiritual Yogas",
    "Ketu with Saturn or in 1st house — deep detachment from material world.",
    "Philosophical detachment, disinterest in material pursuits. Naturally inclined toward simplicity, meditation, and renunciation.",
    58, (!!P.Ketu&&P.Ketu.house===1)||conj(P.Ketu,P.Saturn),
    ["Ketu"],"elite");

  add("Sanyasa Yoga","Spiritual Yogas",
    "4+ planets in one house or 12th lord in 12th with Saturn-Moon aspect.",
    "Monastic or renunciate tendencies. Extraordinary single-pointed focus. Possible entry into spiritual orders or deep meditation retreats.",
    72, Object.values(P).filter(v=>v.house===Object.values(P).sort((a,b)=>Object.values(P).filter(x=>x.house===a.house).length-Object.values(P).filter(x=>x.house===b.house).length)[Object.values(P).length-1].house).length>=4,
    [],"elite",true);

  add("Pilgrimage Yoga","Spiritual Yogas",
    "9th lord in 12th or 12th lord in 9th — dharma meets foreign/moksha house.",
    "Strong inclination toward pilgrimages, sacred travel, and holy sites. Spiritual journeys transform life direction.",
    60, (() => { const l9=L(9),l12=L(12); return (!!l9&&l9.house===12)||(!!l12&&l12.house===9); })(),
    [],"elite");

  // ════════════════════════════════════════════════════════════
  // 10. STRUCTURAL YOGAS (6)
  // ════════════════════════════════════════════════════════════
  add("Amala Yoga","Structural Yogas",
    "Benefic planet in 10th house — clean and virtuous career.",
    "Clean reputation, public respect, and lasting visible achievements. Career success through ethical means. Remembered fondly.",
    70, Object.entries(P).some(([k,v])=>["Jupiter","Venus","Mercury","Moon"].includes(k)&&v.house===10),
    [],"premium");

  add("Parvata Yoga","Structural Yogas",
    "Two or more benefics in Kendra houses — mountain-like stability.",
    "Status, stability, and dignified social rise. Support from powerful people. Mountain-like permanence in achievements.",
    68, Object.entries(P).filter(([k,v])=>["Jupiter","Venus","Mercury","Moon"].includes(k)&&isK(v.house)).length>=2,
    [],"premium");

  add("Kahala Yoga","Structural Yogas",
    "4th lord connects with Lagna lord through conjunction or mutual Kendra.",
    "Courage, status assertion, practical leadership, and executive force. Authority and command over others.",
    66, conn(1,4,lagnaNum,P), [],"premium");

  add("Papa Kartari Yoga","Structural Yogas",
    "Malefics hemming Lagna (in both 12th and 2nd houses).",
    "Pressure and blockage on personality. Physical challenges. Persistent effort required to overcome obstacles.",
    38, Object.entries(P).some(([k,v])=>["Saturn","Mars","Rahu","Ketu","Sun"].includes(k)&&v.house===12)&&Object.entries(P).some(([k,v])=>["Saturn","Mars","Rahu","Ketu","Sun"].includes(k)&&v.house===2),
    [],"premium");

  add("Rajju Yoga","Structural Yogas",
    "All planets in movable signs (Aries, Cancer, Libra, Capricorn).",
    "Constant movement, travel, and change of residence. Dynamic life with many relocations. Career involves travel or movement.",
    58, Object.values(P).every(v=>["Aries","Cancer","Libra","Capricorn"].includes(v.sign)),
    [],"elite");

  add("Musala Yoga","Structural Yogas",
    "All planets in fixed signs (Taurus, Leo, Scorpio, Aquarius).",
    "Stable, persistent, and determined nature. Fixed purpose in life. Builds lasting structures and institutions. Stubborn but reliable.",
    60, Object.values(P).every(v=>["Taurus","Leo","Scorpio","Aquarius"].includes(v.sign)),
    [],"elite");

  // ════════════════════════════════════════════════════════════
  // 11. DOSHAS (18)
  // ════════════════════════════════════════════════════════════

  // FREE DOSHAS (3)
  add("Mangal Dosha","Doshas",
    "Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house — classic Kuja Dosha.",
    "Challenges in marriage, delay or conflict in partnerships. Energy imbalance in relationships. Remedies: marry another Manglik, Mangal puja, coral gemstone.",
    35, !!P.Mars&&[1,2,4,7,8,12].includes(P.Mars.house)&&!isExalted("Mars",P.Mars.sign),
    ["Mars"],"free",false,true,
    "Marry another Manglik. Mangal puja on Tuesdays. Red coral gemstone. Hanuman Chalisa daily.");

  add("Kaalsarpa Yoga","Doshas",
    "All planets fall between Rahu and Ketu axis — serpent energy encircles the chart.",
    "Intense karma, obstacles and delays in life. Disciplined effort required. Can give extraordinary results after struggles. Axis location determines which life areas are affected.",
    38, (() => { if(!P.Rahu||!P.Ketu)return false; const rH=P.Rahu.house; return ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"].filter(k=>P[k]).every(k=>{ const d1=hd(P.Ketu.house,P[k].house),d2=hd(P[k].house,rH); return d1+d2<=12; }); })(),
    ["Rahu","Ketu"],"free",true,true,
    "Kaalsarpa puja at Trimbakeshwar. Rahu-Ketu mantra. Naag panchami fasting. Donate to snake temples.");

  add("Pitra Dosha","Doshas",
    "Sun afflicted by Rahu, Ketu, or Saturn in 9th, 5th, or 1st house — ancestral karmic debt.",
    "Father's karmic burden. Obstacles from ancestral karma. Pinda daan and tarpan recommended. Relationship with father may be complex.",
    38, !!P.Sun&&[1,5,9,10,12].includes(P.Sun.house)&&(conj(P.Sun,P.Rahu)||conj(P.Sun,P.Ketu)||(!!P.Saturn&&md(Math.abs(P.Saturn.house-P.Sun.house),12)===6)),
    ["Sun"],"free",false,true,
    "Tarpan and pinda daan on Amavasya. Pitra puja. Feed crows. Gaya shraddh if possible.");

  // PREMIUM DOSHAS (10)
  add("Kemadruma Dosha","Doshas",
    "Moon has no classical planets in 2nd or 12th from it, not in kendra, not strong.",
    "Emotional isolation and self-reliance themes. Poverty or struggle in early life. Inner strength builds through facing challenges alone.",
    30, (() => { if(!P.Moon)return false; const h2=P.Moon.house%12+1,h12=P.Moon.house===1?12:P.Moon.house-1; const excl=["Sun","Rahu","Ketu","Moon"]; const hasNeighbor=Object.entries(P).some(([k,v])=>!excl.includes(k)&&[h2,h12,P.Moon.house].includes(v.house)); return !hasNeighbor&&!isK(P.Moon.house); })(),
    ["Moon"],"premium",false,true,
    "Monday fasting. Moon mantra: Om Chandraya Namah. White foods donation. Wear pearl/moonstone.");

  add("Shrapit Yoga","Doshas",
    "Saturn and Rahu conjunct or in close aspect — cursed combination, severe karmic challenges.",
    "Obstacles in career, marriage, and children. Severe karmic restrictions from past lives. Requires strong remedies.",
    35, conj(P.Saturn,P.Rahu)||(!!P.Saturn&&!!P.Rahu&&md(Math.abs(P.Saturn.house-P.Rahu.house),12)===6),
    ["Saturn","Rahu"],"premium",false,true,
    "Shani puja on Saturdays. Service to poor and disabled. Black sesame oil lamp. Feed crows and dogs.");

  add("Surya Grahan Yoga","Doshas",
    "Sun conjunct Rahu — solar eclipse effect in the natal chart.",
    "Authority issues, father struggles, identity confusion. Ambitious but obstructed. Rahu amplifies solar significations to excess.",
    40, conj(P.Sun,P.Rahu), ["Sun","Rahu"],"premium",false,true,
    "Surya mantra: Om Suryaya Namah. Sunday puja. Donate wheat and copper. Respect father figures.");

  add("Chandra Grahan Yoga","Doshas",
    "Moon conjunct Rahu — lunar eclipse effect in the natal chart.",
    "Mental anxiety, mother issues, emotional turbulence. Mind works in unusual ways. Psychic sensitivity but emotional instability.",
    38, conj(P.Moon,P.Rahu), ["Moon","Rahu"],"premium",false,true,
    "Monday fasting. Moon mantra. Avoid anger. White donation. Meditate on full moon nights.");

  add("Surya-Ketu Yoga","Doshas",
    "Sun conjunct Ketu — spiritual detachment from authority.",
    "Father issues, government obstacles, past-life karma around leadership. Complex relationship with authority and ego.",
    42, conj(P.Sun,P.Ketu), ["Sun","Ketu"],"premium",false,true,
    "Ganesha puja. Ketu mantra: Om Ketave Namah. Donate multicolor items. Meditation practice.");

  add("Chandra-Ketu Yoga","Doshas",
    "Moon conjunct Ketu — emotional detachment and past-life emotional patterns.",
    "Mother issues, psychic sensitivity, intuitive but troubled emotions. Past-life emotional karma very strong.",
    40, conj(P.Moon,P.Ketu), ["Moon","Ketu"],"premium",false,true,
    "Ketu mantra. Meditation. Spiritual study. Donate to spiritual organizations on Tuesdays.");

  add("Daridra Yoga","Doshas",
    "2nd lord in dusthana (6th, 8th, or 12th house).",
    "Financial challenges, family struggles, speech issues. Wealth hard to accumulate and maintain. Requires extra financial discipline.",
    35, (() => { const l2=L(2); return !!l2&&isD(l2.house); })(),
    [],"premium",false,true,
    "Jupiter puja. Thursday fasting. Donate yellow items. Financial discipline. Avoid speculation.");

  add("Alpa Labha Yoga","Doshas",
    "11th lord in dusthana — limited gains and network challenges.",
    "Income sources have obstacles. Elder siblings may struggle. Desires take longer to fulfill. Gains come with extra effort.",
    38, (() => { const l11=L(11); return !!l11&&isD(l11.house); })(),
    [],"premium",false,true,
    "Rahu mantra. Network building effort. Service to elder siblings. Donate on Saturdays.");

  add("Vyaya Dosha","Doshas",
    "12th lord weak and misplaced — uncontrolled expenditure.",
    "Losses without gains, scattered energy, financial drain without spiritual benefit. Expenses exceed income consistently.",
    40, (() => { const l12=L(12); return !!l12&&!isD(l12.house)&&!isKT(l12.house); })(),
    [],"premium",false,true,
    "Budget discipline. Ketu mantra. 12th house puja. Donate anonymously. Spiritual practice reduces drain.");

  add("Debt Pressure Yoga","Doshas",
    "6th lord in kendra without strength — debt and enemy pressure.",
    "Debt accumulation, enemies in authority positions, service obligations become burdens. Financial and legal pressures.",
    40, (() => { const l6=L(6); return !!l6&&isK(l6.house); })(),
    [],"premium",false,true,
    "Mars mantra on Tuesdays. Donate red lentils. Physical exercise. Reduce liabilities systematically.");

  add("Papa Kartari Dosha","Doshas",
    "Malefics in both 12th and 2nd houses from Lagna — Lagna squeezed.",
    "Physical challenges, personality obstacles, blocked self-expression. Lagna hemmed by negative planetary energy.",
    38, Object.entries(P).some(([k,v])=>["Saturn","Mars","Rahu","Ketu"].includes(k)&&v.house===12)&&Object.entries(P).some(([k,v])=>["Saturn","Mars","Rahu","Ketu"].includes(k)&&v.house===2),
    [],"premium",false,true,
    "Lagna lord strengthening puja. Positive affirmations. Surya namaskar daily. Wear lagna lord gemstone.");

  // ELITE DOSHAS (5)
  add("Chandra Paap Yoga","Doshas",
    "Moon afflicted by both Mars and Saturn simultaneously.",
    "Emotional suffering, depression tendency, mental health challenges. Both malefics create double pressure on mind and emotions.",
    32, !!P.Moon&&!!P.Mars&&!!P.Saturn&&(conj(P.Moon,P.Mars)||conj(P.Moon,P.Saturn)),
    ["Moon","Mars","Saturn"],"elite",false,true,
    "Moon mantra 11x daily. Monday fasting. Pearl/moonstone. Therapy support. Meditation.");

  add("Guru Chandal Yoga","Doshas",
    "Jupiter and Rahu conjunct — wisdom contaminated by shadow planet.",
    "Ethics challenged, wisdom may be misused. Foreign influence on beliefs. Risk of following false gurus.",
    38, conj(P.Jupiter,P.Rahu), ["Jupiter","Rahu"],"elite",false,true,
    "Jupiter puja on Thursdays. Avoid false teachers. Yellow sapphire (consult astrologer). Study authentic scriptures.");

  add("Lagna-Ripu Yoga","Doshas",
    "Lagna lord and 6th lord connected — self and enemies linked.",
    "Health challenges, enemy interference in personal matters. Recurring illnesses. Competition affects personal growth.",
    38, conn(1,6,lagnaNum,P), [],"elite",false,true,
    "Health routines. Lagna lord gemstone. 6th house remedies. Daily physical exercise.");

  add("Rahu Kula Dosha","Doshas",
    "Rahu in 5th or 9th house with malefic aspects — ancestral Rahu karma.",
    "Disruption in dharma, children, or higher wisdom. Unconventional family karma. Unexpected events through Rahu's house.",
    38, !!P.Rahu&&[5,9].includes(P.Rahu.house),
    ["Rahu"],"elite",false,true,
    "Rahu mantra: Om Rahave Namah. Offer coconut in flowing water. Feed dogs. Blue/black donation on Saturdays.");

  add("Ashtamesh Lagna Yoga","Doshas",
    "8th lord in Lagna — transformation lord in self house.",
    "Intense personality, hidden depths, transformative life experiences. Possible health challenges but also occult abilities.",
    42, (() => { const l8=L(8); return !!l8&&l8.house===1; })(),
    [],"elite",false,true,
    "8th lord puja. Meditation. Avoid risky activities. Spiritual practices strengthen protection.");

  // Sort: present first, then by score
  results.sort((a,b) => {
    if(a.present && !b.present) return -1;
    if(!a.present && b.present) return 1;
    return b.score - a.score;
  });

  return results;
}

// ── Get only present yogas ────────────────────────────────────
export function getPresentYogas(
  planets: Record<string,PD>,
  lagnaNum: number,
  tier: PlanTier = "free"
): YogaResult[] {
  return detectYogas(planets, lagnaNum, tier).filter(y => y.present);
}

// ── Yoga Score gamification ───────────────────────────────────
export function calculateYogaScore(present: YogaResult[]): {
  total: number;
  breakdown: Record<string,number>;
  rating: string;
  rareCount: number;
} {
  const breakdown: Record<string,number> = {};
  let raw = 0;
  let rareCount = 0;

  present.filter(y=>!y.isDosha).forEach(y => {
    const pts = y.rare ? Math.round(y.score * 1.5) : y.score;
    raw += pts;
    breakdown[y.category] = (breakdown[y.category]||0) + pts;
    if(y.rare) rareCount++;
  });

  const total = Math.min(Math.round(raw / 12), 100);
  const rating =
    total >= 90 ? "Legendary ✦" :
    total >= 75 ? "Exceptional" :
    total >= 60 ? "Strong" :
    total >= 45 ? "Balanced" :
    total >= 30 ? "Developing" : "Nascent";

  return { total, breakdown, rating, rareCount };
}

// ── Category metadata ─────────────────────────────────────────
export const CATEGORY_META: Record<YogaCategory,{icon:string;color:string;desc:string}> = {
  "Pancha Mahapurusha": { icon:"👑", color:"#c8a030", desc:"Five great personality yogas" },
  "Raja Yogas":         { icon:"🏛️", color:"#a855f7", desc:"Authority, fame, and rise" },
  "Dhana Yogas":        { icon:"💰", color:"#22c55e", desc:"Wealth and financial prosperity" },
  "Nabhasa Patterns":   { icon:"🌙", color:"#60a5fa", desc:"Chart pattern yogas" },
  "Marriage Yogas":     { icon:"💑", color:"#ec4899", desc:"Love, partnership, and marriage" },
  "Career Yogas":       { icon:"💼", color:"#f59e0b", desc:"Profession and career success" },
  "Graha Combinations": { icon:"⚡", color:"#fb7185", desc:"Planetary conjunctions" },
  "Chandra Yogas":      { icon:"🌛", color:"#c084fc", desc:"Moon-based yogas" },
  "Spiritual Yogas":    { icon:"☯️", color:"#2dd4bf", desc:"Dharma, moksha, and spirit" },
  "Structural Yogas":   { icon:"🔄", color:"#94a3b8", desc:"Chart structure patterns" },
  "Doshas":             { icon:"⚠️", color:"#ef4444", desc:"Challenging combinations" },
};
