// ============================================================
// ASTROLIFE DIVISIONAL CHARTS ENGINE v3.0
// Complete Shodashavarga (16) + D-30 Trimshamsha + D-60 Shastiamsha
// D1·D2·D3·D4·D5·D6·D7·D8·D9·D10·D11·D12·D16·D20·D24·D27·D30·D60
// ============================================================

export interface DivPlanet {
  planet:    string;
  icon:      string;
  color:     string;
  signNum:   number;
  sign:      string;
  house:     number;
  retrograde:boolean;
  dignity:   string;
  inLagna:   boolean;
}

export interface DivChart {
  key:        string;
  name:       string;
  purpose:    string;
  lagnaNum:   number;
  lagna:      string;
  planets:    DivPlanet[];
  keyInsight: string;
}

interface PD {
  house:number; sign:string; signNum:number;
  retrograde:boolean; dignity:string; lon:number;
}

const PLS  = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PEMO = ["☉","☽","♂","☿","♃","♀","♄","☊","☋"];
const PCOL = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa","#a78bfa","#fb7185"];
const SIGNS= ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

const md = (x:number,m:number)=>((x%m)+m)%m;

function getDignity(planet:string, signNum:number): string {
  const UCH: Record<string,number>    = {Sun:0,Moon:1,Mars:9,Mercury:5,Jupiter:3,Venus:11,Saturn:6};
  const OWN: Record<string,number[]>  = {Sun:[4],Moon:[3],Mars:[0,7],Mercury:[2,5],Jupiter:[8,11],Venus:[1,6],Saturn:[9,10]};
  const DEB: Record<string,number>    = {Sun:6,Moon:7,Mars:3,Mercury:11,Jupiter:9,Venus:5,Saturn:0};
  if(UCH[planet]===signNum) return "Exalted";
  if(OWN[planet]?.includes(signNum)) return "Own";
  if(DEB[planet]===signNum) return "Debilitated";
  return "—";
}

// ── CALCULATION FUNCTIONS ─────────────────────────────────────────────────────

function getD2(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const isOdd = sign % 2 === 0;
  // Odd signs: 0-15° = Leo(4), 15-30° = Cancer(3)
  // Even signs: 0-15° = Cancer(3), 15-30° = Leo(4)
  if(isOdd) return deg < 15 ? 4 : 3;
  else       return deg < 15 ? 3 : 4;
}

function getD3(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/10);
  const isOdd = sign % 2 === 0;
  if(isOdd) return md(sign + [0,4,8][part], 12);
  else       return md(sign + [8,4,0][part], 12);
}

function getD4(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/7.5);
  const type = sign % 3; // 0=movable,1=fixed,2=dual
  const offset = type===0 ? 0 : type===1 ? 3 : 6;
  return md(sign + offset + part*3, 12);
}

function getD5(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/6);
  return sign % 2 === 0 ? md(sign + part, 12) : md(sign + 8 + part, 12);
}

function getD6(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/5);
  return md(sign + part, 12);
}

function getD7(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/(30/7));
  return md(sign + (sign%2===0 ? part : 6+part), 12);
}

function getD8(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/3.75);
  const type = sign % 3;
  const offset = type===0 ? 0 : type===1 ? 8 : 4;
  return md(sign + offset + part, 12);
}

function getD9(lon:number): number {
  return Math.floor(md(lon,360) / (360/108)) % 12;
}

function getD10(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/3);
  return md(sign%2===0 ? sign+part : sign+9+part, 12);
}

function getD11(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/(30/11));
  return sign % 2 === 0 ? md(sign + part, 12) : md(sign + 6 + part, 12);
}

function getD12(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/2.5);
  return md(sign + part, 12);
}

function getD16(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/1.875);
  const type = sign % 3;
  const offset = type===0 ? 0 : type===1 ? 4 : 8;
  return md(offset + part, 12);
}

function getD20(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/1.5);
  return sign % 2 === 0 ? part % 12 : md(6 + part, 12);
}

function getD24(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/1.25);
  return sign % 2 === 0 ? md(4 + part, 12) : md(3 + part, 12);
}

function getD27(lon:number): number {
  return Math.floor(md(lon,360) / (360/27)) % 12;
}

function getD30(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const isOdd = sign % 2 === 0;
  if(isOdd) {
    if(deg < 5)  return 0;  // Aries (Mars)
    if(deg < 10) return 10; // Aquarius (Saturn)
    if(deg < 18) return 8;  // Sagittarius (Jupiter)
    if(deg < 25) return 2;  // Gemini (Mercury)
    return 6;               // Libra (Venus)
  } else {
    if(deg < 5)  return 1;  // Taurus (Venus)
    if(deg < 12) return 5;  // Virgo (Mercury)
    if(deg < 20) return 11; // Pisces (Jupiter)
    if(deg < 25) return 9;  // Capricorn (Saturn)
    return 7;               // Scorpio (Mars)
  }
}

function getD40(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/0.75);
  return sign % 2 === 0 ? part % 12 : md(6 + part, 12);
}

function getD45(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg / (30/45));
  const type = sign % 3;
  const offset = type===0 ? 0 : type===1 ? 4 : 8;
  return md(offset + part, 12);
}

function getD60(lon:number): number {
  const sign = Math.floor(md(lon,360)/30);
  const deg  = md(lon,360) % 30;
  const part = Math.floor(deg/0.5);
  return sign % 2 === 0 ? md(sign + part, 12) : md(sign + 8 + part, 12);
}

// ── BUILDER ───────────────────────────────────────────────────────────────────

function buildDiv(
  key: string, name: string, purpose: string, keyInsight: string,
  planets: Record<string,PD>, lagnaLon: number, getSign: (lon:number)=>number
): DivChart {
  const lagnaNum = getSign(lagnaLon);
  const divPlanets: DivPlanet[] = PLS.map((planet,pi) => {
    const pd = planets[planet]; if(!pd) return null;
    const signNum = getSign(pd.lon);
    const house   = md(signNum - lagnaNum, 12) + 1;
    return {
      planet, icon:PEMO[pi], color:PCOL[pi],
      signNum, sign:SIGNS[signNum], house,
      retrograde:pd.retrograde,
      dignity: getDignity(planet, signNum),
      inLagna: signNum === lagnaNum,
    };
  }).filter(Boolean) as DivPlanet[];
  return { key, name, purpose, lagnaNum, lagna:SIGNS[lagnaNum], planets:divPlanets, keyInsight };
}

// ── MAIN CALCULATOR ───────────────────────────────────────────────────────────

export function calculateDivisional(
  planets: Record<string,PD>,
  lagnaNum: number,
  lagnaLon: number
): DivChart[] {
  const d1Planets: DivPlanet[] = PLS.map((planet,pi)=>{
    const pd = planets[planet]; if(!pd) return null;
    return {
      planet, icon:PEMO[pi], color:PCOL[pi],
      signNum:pd.signNum, sign:pd.sign, house:pd.house,
      retrograde:pd.retrograde, dignity:pd.dignity||"—",
      inLagna:pd.signNum===lagnaNum,
    };
  }).filter(Boolean) as DivPlanet[];

  const d1: DivChart = {
    key:"D1", name:"Rasi Chart", purpose:"Overall life — personality, health, all life matters",
    lagnaNum, lagna:SIGNS[lagnaNum], planets:d1Planets,
    keyInsight:"Foundation chart. Lagna sign shapes personality. All divisionals refine specific life areas.",
  };

  const p = planets;
  const ll = lagnaLon;

  return [
    d1,
    buildDiv("D2","Hora","Wealth, financial capacity, earning power",
      "Sun hora = self-earned wealth. Moon hora = family/inherited wealth. Stronger hora shows primary income source.",
      p, ll, getD2),
    buildDiv("D3","Drekkana","Siblings, courage, self-effort, short journeys",
      "3rd house strength reveals sibling bonds and personal courage. Mars is the primary significator.",
      p, ll, getD3),
    buildDiv("D4","Chaturthamsha","Property, home, fixed assets, mother's blessings",
      "4th house reveals real estate, property, and ancestral home. Moon and Venus placement are key.",
      p, ll, getD4),
    buildDiv("D5","Panchamsha","Past life merit, divine blessings, intelligence",
      "Reveals accumulated spiritual merit from past lives. Strong planets here bring unearned grace and intelligence.",
      p, ll, getD5),
    buildDiv("D6","Shashthamsha","Health, enemies, service, debts, obstacles",
      "6th house analysis. Strong planets here give victory over enemies and disease. Shows health karma.",
      p, ll, getD6),
    buildDiv("D7","Saptamsha","Children, progeny, creative legacy",
      "5th house and Jupiter reveal children karma. Strong D-7 gives wise, successful offspring.",
      p, ll, getD7),
    buildDiv("D8","Ashtamsha","Sudden events, longevity, unexpected gain/loss",
      "8th house themes — unexpected turns, inheritance, hidden matters, and longevity indicators.",
      p, ll, getD8),
    buildDiv("D9","Navamsha","Marriage, dharma, spiritual strength — most important",
      "Soul chart. Spouse nature, dharmic path, spiritual strength. Vargottama planets here are exceptionally powerful.",
      p, ll, getD9),
    buildDiv("D10","Dashamsha","Career, profession, public status, authority",
      "Career chart. Sun and 10th lord placement determine professional peak and recognition.",
      p, ll, getD10),
    buildDiv("D11","Rudramsha","Gains, income streams, destruction of obstacles",
      "11th house themes — gains, elder siblings, income sources, and the destruction of enemies and limitations.",
      p, ll, getD11),
    buildDiv("D12","Dwadashamsha","Parents, ancestors, inherited karma",
      "Father = Sun, Mother = Moon. Ancestral blessings and parental karma clearly visible here.",
      p, ll, getD12),
    buildDiv("D16","Shodashamsha","Vehicles, comforts, happiness, conveyances",
      "4th house in D-16 reveals vehicles, luxury comforts, and happiness in domestic life.",
      p, ll, getD16),
    buildDiv("D20","Vimshamsha","Spiritual practices, worship, meditation, moksha",
      "12th house and Jupiter position reveal depth of spiritual practice and path to liberation.",
      p, ll, getD20),
    buildDiv("D24","Chaturvimshamsha","Education, learning, academic achievement",
      "5th house and Mercury show educational karma. Strong D-24 gives intellectual mastery.",
      p, ll, getD24),
    buildDiv("D27","Saptavimshamsha","Inherent strengths, talents, soul abilities",
      "Innate soul-level talents from past lives. Strong planets here are your natural gifts.",
      p, ll, getD27),
    buildDiv("D30","Trimshamsha","Evils, obstacles, suffering, misfortune areas",
      "Malefic chart. Weak/afflicted planets here show areas of suffering and required remedies.",
      p, ll, getD30),
    buildDiv("D40","Khavedamsha","Auspicious/inauspicious effects, general karma",
      "General karmic indicators. Strong planets bring consistent good results across life domains.",
      p, ll, getD40),
    buildDiv("D45","Akshavedamsha","Character, values, general life quality",
      "Shows overall quality of life and character. Planetary strengths here reflect moral and material standing.",
      p, ll, getD45),
    buildDiv("D60","Shastiamsha","Past life karma — most karmic chart after D-9",
      "The deepest karmic chart. Shows exact past-life actions and their fruit in this life. Most sensitive divisional.",
      p, ll, getD60),
  ];
}

// ── ANALYSIS FUNCTIONS ────────────────────────────────────────────────────────

export function getRasiAnalysis(d1: DivChart): string[] {
  const insights: string[] = [];
  const LAGNA_DESC: Record<number,string> = {
    0:"Aries Lagna — natural leader, energetic, pioneering. Direct action is your defining strength.",
    1:"Taurus Lagna — stable, patient, sensual. You build lasting wealth and deep comfort.",
    2:"Gemini Lagna — curious, communicative, versatile. Mental agility and adaptability are your gifts.",
    3:"Cancer Lagna — nurturing, intuitive, emotionally intelligent. Home and family are your core.",
    4:"Leo Lagna — charismatic, generous, regal. Leadership and recognition come naturally to you.",
    5:"Virgo Lagna — analytical, precise, service-minded. Mastery through detail and health awareness.",
    6:"Libra Lagna — diplomatic, aesthetic, balanced. Relationships and fairness define your path.",
    7:"Scorpio Lagna — intense, perceptive, transformative. Hidden depths and research ability shine.",
    8:"Sagittarius Lagna — philosophical, optimistic, adventurous. Truth-seeking and expansion drive you.",
    9:"Capricorn Lagna — disciplined, ambitious, persistent. Slow but completely unstoppable rise.",
    10:"Aquarius Lagna — innovative, humanitarian, unconventional. Original thinking is your greatest edge.",
    11:"Pisces Lagna — compassionate, intuitive, spiritual. Natural connection to higher realms.",
  };
  insights.push(LAGNA_DESC[d1.lagnaNum] ?? "Lagna shapes your entire personality and life direction.");
  const strong = d1.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  const deb    = d1.planets.filter(p=>p.dignity==="Debilitated");
  if(strong.length>0) insights.push(`${strong.map(p=>p.planet).join(", ")} are strong in D-1 — powerful natural assets in these planetary domains.`);
  if(deb.length>0)    insights.push(`${deb.map(p=>p.planet).join(", ")} are debilitated — these areas need remedies and conscious effort.`);
  const h10 = d1.planets.filter(p=>p.house===10);
  if(h10.length>0) insights.push(`${h10.map(p=>p.planet).join(", ")} in 10th house — strong career drive and public visibility.`);
  return insights;
}

export function getHoraAnalysis(d2: DivChart): string[] {
  const insights: string[] = [];
  const sunHora  = d2.planets.filter(p=>p.signNum===4); // Leo = Sun hora
  const moonHora = d2.planets.filter(p=>p.signNum===3); // Cancer = Moon hora
  if(sunHora.length>moonHora.length)
    insights.push(`More planets in Sun Hora (${sunHora.map(p=>p.planet).join(", ")}) — self-earned income and professional efforts are your primary wealth source.`);
  else if(moonHora.length>sunHora.length)
    insights.push(`More planets in Moon Hora (${moonHora.map(p=>p.planet).join(", ")}) — family wealth, inheritance, and passive income are primary. Business and partnerships bring prosperity.`);
  else
    insights.push("Equal Sun and Moon hora planets — balanced wealth from both self-effort and family/inheritance sources.");
  const jupHora = d2.planets.find(p=>p.planet==="Jupiter");
  if(jupHora?.signNum===4) insights.push("Jupiter in Sun Hora — excellent wealth yoga. Self-earned fortune through wisdom and teaching.");
  if(jupHora?.signNum===3) insights.push("Jupiter in Moon Hora — wealth comes through family, property, or nurturing professions.");
  const venHora = d2.planets.find(p=>p.planet==="Venus");
  if(venHora?.signNum===4) insights.push("Venus in Sun Hora — income through arts, luxury, beauty, or entertainment industries.");
  if(venHora?.signNum===3) insights.push("Venus in Moon Hora — wealth through family trade, hospitality, or female-dominated sectors.");
  const satHora = d2.planets.find(p=>p.planet==="Saturn");
  if(satHora?.signNum===4) insights.push("Saturn in Sun Hora — wealth comes through hard, disciplined labor. Slow but steady accumulation.");
  if(insights.length===1) insights.push("D-2 Hora reveals wealth distribution. Strengthen the dominant hora's planetary lord for financial growth.");
  return insights;
}

export function getDrekkanaAnalysis(d3: DivChart): string[] {
  const insights: string[] = [];
  const mars = d3.planets.find(p=>p.planet==="Mars");
  const sun  = d3.planets.find(p=>p.planet==="Sun");
  const merc = d3.planets.find(p=>p.planet==="Mercury");
  const rahu = d3.planets.find(p=>p.planet==="Rahu");
  const ketu = d3.planets.find(p=>p.planet==="Ketu");
  const sat  = d3.planets.find(p=>p.planet==="Saturn");
  if(mars?.dignity==="Exalted"||mars?.dignity==="Own")
    insights.push("Strong Mars in D-3 — exceptional courage, willpower, and sibling support. Natural warrior energy.");
  if(mars?.dignity==="Debilitated")
    insights.push("Weak Mars in D-3 — sibling conflicts or limited support. Courage needs conscious cultivation.");
  if(mars?.house===3) insights.push("Mars in 3rd D-3 — very courageous, athletic, excellent hands-on skills.");
  if(sun?.house===3||sun?.dignity==="Exalted") insights.push("Sun strong in D-3 — prominent among siblings. Leadership role in family communication.");
  if(merc?.house===3||merc?.dignity==="Exalted") insights.push("Mercury strong in D-3 — skilled writer, communicator. Sibling or neighbor brings key opportunity.");
  if(rahu?.house===3) insights.push("Rahu in 3rd D-3 — unconventional courage, foreign sibling connection, unique communication style.");
  if(ketu?.house===3) insights.push("Ketu in 3rd D-3 — past-life mastery in self-effort. Spiritual courage. May prefer solitary endeavors.");
  if(sat?.house===3) insights.push("Saturn in 3rd D-3 — efforts mature slowly but build lasting results. Discipline in writing and craft.");
  if(insights.length===0) insights.push("D-3 shows sibling karma and personal courage. 3rd lord placement reveals your effort and willpower pattern.");
  return insights;
}

export function getChaturthamshAnalysis(d4: DivChart): string[] {
  const insights: string[] = [];
  const moon = d4.planets.find(p=>p.planet==="Moon");
  const ven  = d4.planets.find(p=>p.planet==="Venus");
  const mars = d4.planets.find(p=>p.planet==="Mars");
  const sat  = d4.planets.find(p=>p.planet==="Saturn");
  const jup  = d4.planets.find(p=>p.planet==="Jupiter");
  if(moon?.dignity==="Exalted"||moon?.house===4)
    insights.push("Moon strong in D-4 — excellent domestic happiness, comfortable home, and strong maternal bond. Property is blessed.");
  if(ven?.dignity==="Exalted"||ven?.house===4)
    insights.push("Venus in 4th D-4 — luxurious home, beautiful property, vehicles and comforts are well-provided.");
  if(mars?.house===4)
    insights.push("Mars in 4th D-4 — real estate and property through active effort. Land and construction are favorable.");
  if(sat?.house===4||sat?.dignity==="Debilitated")
    insights.push("Saturn influences 4th D-4 — property gains are delayed. Ancestral land may require legal resolution.");
  if(jup?.dignity==="Exalted"||jup?.house===4)
    insights.push("Jupiter in 4th D-4 — great fortune in property and home. Educated, cultured family environment.");
  const h4 = d4.planets.filter(p=>p.house===4);
  if(h4.length===0)
    insights.push("4th house unoccupied in D-4 — analyze 4th lord sign for property and happiness indicators.");
  if(insights.length<=1)
    insights.push("D-4 reveals fixed assets and home karma. Strong 4th house gives ancestral property and domestic happiness.");
  return insights;
}

export function getPanchamshAnalysis(d5: DivChart): string[] {
  const insights: string[] = [];
  const jup  = d5.planets.find(p=>p.planet==="Jupiter");
  const sun  = d5.planets.find(p=>p.planet==="Sun");
  const moon = d5.planets.find(p=>p.planet==="Moon");
  const ketu = d5.planets.find(p=>p.planet==="Ketu");
  if(jup?.dignity==="Exalted"||jup?.dignity==="Own")
    insights.push("Jupiter strong in D-5 — exceptional past-life merit. Divine grace is active in this life. Wisdom comes naturally.");
  if(sun?.dignity==="Exalted"||sun?.inLagna)
    insights.push("Sun strong in D-5 — righteous past-life deeds bring authority and recognition in this birth.");
  if(moon?.dignity==="Exalted")
    insights.push("Exalted Moon in D-5 — pure, compassionate past-life actions. Emotional intelligence is a soul gift.");
  if(ketu?.house===9||ketu?.house===1)
    insights.push("Ketu prominent in D-5 — deeply spiritual past life. Moksha orientation and detachment from material pursuits.");
  const strong = d5.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  if(strong.length>0)
    insights.push(`${strong.map(p=>p.planet).join(", ")} carry strong D-5 merit — these domains receive unexpected grace and favorable outcomes without proportional effort.`);
  if(insights.length===0)
    insights.push("D-5 reflects accumulated spiritual merit. Strong planets here indicate areas where life flows with unusual ease and divine support.");
  return insights;
}

export function getShashthamshAnalysis(d6: DivChart): string[] {
  const insights: string[] = [];
  const mars = d6.planets.find(p=>p.planet==="Mars");
  const sat  = d6.planets.find(p=>p.planet==="Saturn");
  const sun  = d6.planets.find(p=>p.planet==="Sun");
  const rahu = d6.planets.find(p=>p.planet==="Rahu");
  const moon = d6.planets.find(p=>p.planet==="Moon");
  if(mars?.dignity==="Exalted"||mars?.dignity==="Own")
    insights.push("Strong Mars in D-6 — powerful immunity, victory over enemies and competitors. Health and stamina are excellent.");
  if(sat?.dignity==="Exalted")
    insights.push("Exalted Saturn in D-6 — chronic health issues are well-managed. Discipline in routine provides healing.");
  if(sun?.dignity==="Exalted"||sun?.house===6)
    insights.push("Sun strong in D-6 — governmental or legal matters resolve in your favor. Authority in service sector.");
  if(rahu?.house===6)
    insights.push("Rahu in 6th D-6 — foreign competition or unusual health matters. Unorthodox remedies work well for you.");
  if(moon?.dignity==="Debilitated"||moon?.house===6)
    insights.push("Moon afflicted in D-6 — emotional stress affects health. Mind-body practices and counseling are strongly advised.");
  const deb = d6.planets.filter(p=>p.dignity==="Debilitated");
  if(deb.length>0)
    insights.push(`${deb.map(p=>p.planet).join(", ")} are weak in D-6 — these planetary domains show vulnerability in health or conflict. Targeted remedies recommended.`);
  if(insights.length===0)
    insights.push("D-6 maps health and enemy patterns. Strong malefics here actually indicate victory over obstacles and disease.");
  return insights;
}

export function getSaptamsaAnalysis(d7: DivChart): string[] {
  const insights: string[] = [];
  const jup  = d7.planets.find(p=>p.planet==="Jupiter");
  const moon = d7.planets.find(p=>p.planet==="Moon");
  const sat  = d7.planets.find(p=>p.planet==="Saturn");
  const sun  = d7.planets.find(p=>p.planet==="Sun");
  const mars = d7.planets.find(p=>p.planet==="Mars");
  const ven  = d7.planets.find(p=>p.planet==="Venus");
  if(jup?.dignity==="Exalted"||jup?.dignity==="Own") insights.push("Strong Jupiter in D-7 — blessed with wise, successful children. Strong creative legacy.");
  if(jup?.dignity==="Debilitated") insights.push("Jupiter weak in D-7 — children karma needs patience and Guru-strengthening remedies.");
  if(jup?.house===5) insights.push("Jupiter in 5th D-7 — powerful progeny yoga. Natural affinity with children and teaching.");
  if(moon?.house===5||moon?.dignity==="Exalted") insights.push("Moon strong in 5th D-7 — deep emotional bond with children. Nurturing parent.");
  if(sat?.house===5) insights.push("Saturn in 5th D-7 — children arrive late but bring lasting, serious blessings.");
  if(sun?.house===5) insights.push("Sun in 5th D-7 — children inherit leadership qualities. Strong firstborn bond.");
  if(mars?.house===5) insights.push("Mars in 5th D-7 — dynamic, energetic children. Athletic or competitive offspring.");
  if(ven?.house===5||ven?.dignity==="Exalted") insights.push("Venus strong in D-7 — creative, artistic children or creative legacy.");
  if(d7.planets.filter(p=>p.house===5).length===0)
    insights.push("5th house empty in D-7 — study the 5th lord for children and creative karma.");
  return insights;
}

export function getAshtamshAnalysis(d8: DivChart): string[] {
  const insights: string[] = [];
  const sat  = d8.planets.find(p=>p.planet==="Saturn");
  const mars = d8.planets.find(p=>p.planet==="Mars");
  const rahu = d8.planets.find(p=>p.planet==="Rahu");
  const jup  = d8.planets.find(p=>p.planet==="Jupiter");
  const sun  = d8.planets.find(p=>p.planet==="Sun");
  if(jup?.dignity==="Exalted"||jup?.house===8)
    insights.push("Jupiter in 8th D-8 — unexpected windfalls, inheritance, and research ability. Hidden knowledge brings fortune.");
  if(sat?.dignity==="Exalted"||sat?.house===8)
    insights.push("Saturn strong in D-8 — longevity is well-supported. Life challenges teach profound lessons. Endurance is exceptional.");
  if(mars?.dignity==="Exalted"||mars?.house===8)
    insights.push("Mars in 8th D-8 — bold risk-taker. Sudden events are navigated with courage. Surgery or deep research abilities.");
  if(rahu?.house===8)
    insights.push("Rahu in 8th D-8 — sudden and unexpected karmic events. Foreign or occult matters may bring both challenge and gain.");
  if(sun?.dignity==="Debilitated"||sun?.house===8)
    insights.push("Sun in 8th D-8 — father's health or authority may face sudden challenges. Ego death leads to renewal.");
  const strong = d8.planets.filter(p=>p.dignity==="Exalted");
  if(strong.length>0)
    insights.push(`${strong.map(p=>p.planet).join(", ")} exalted in D-8 — these domains offer protection during sudden or unexpected life events.`);
  if(insights.length===0)
    insights.push("D-8 reveals hidden karma, longevity, and sudden life turns. Study 8th lord for inheritance and transformation patterns.");
  return insights;
}

export function getNavamshaAnalysis(d9: DivChart): string[] {
  const insights: string[] = [];
  const ven  = d9.planets.find(p=>p.planet==="Venus");
  const jup  = d9.planets.find(p=>p.planet==="Jupiter");
  const moon = d9.planets.find(p=>p.planet==="Moon");
  const sun  = d9.planets.find(p=>p.planet==="Sun");
  const mars = d9.planets.find(p=>p.planet==="Mars");
  const sat  = d9.planets.find(p=>p.planet==="Saturn");
  if(ven?.dignity==="Exalted"||ven?.dignity==="Own")
    insights.push("Venus strong in Navamsha — beautiful, harmonious, supportive spouse. Married life is deeply fulfilling.");
  if(ven?.dignity==="Debilitated")
    insights.push("Venus weak in Navamsha — relationship karma requires work. Communication and compromise are essential.");
  if(jup?.dignity==="Exalted"||jup?.dignity==="Own")
    insights.push("Jupiter strong in D-9 — wise, spiritual, well-educated spouse. Dharmic and prosperous marriage.");
  if(moon?.dignity==="Exalted") insights.push("Exalted Moon in D-9 — emotionally rich inner life. Strong dharmic foundation and intuition.");
  if(sun?.inLagna) insights.push("Sun in D-9 Lagna — authority and leadership in the dharmic path. Father's blessings actively support.");
  if(mars?.dignity==="Exalted") insights.push("Exalted Mars in D-9 — courageous soul path. Spouse is dynamic and action-oriented.");
  if(sat?.dignity==="Exalted") insights.push("Exalted Saturn in D-9 — disciplined dharmic path. Karma is repaid honorably. Slow but rich spiritual life.");
  if(insights.length===0) insights.push("D-9 Navamsha is the soul chart. Analyze Venus and 7th house for spouse and the full dharmic journey.");
  return insights;
}

export function getDashamshaAnalysis(d10: DivChart): string[] {
  const insights: string[] = [];
  const sun  = d10.planets.find(p=>p.planet==="Sun");
  const sat  = d10.planets.find(p=>p.planet==="Saturn");
  const jup  = d10.planets.find(p=>p.planet==="Jupiter");
  const merc = d10.planets.find(p=>p.planet==="Mercury");
  const mars = d10.planets.find(p=>p.planet==="Mars");
  const ven  = d10.planets.find(p=>p.planet==="Venus");
  if(sun?.house===10||sun?.dignity==="Exalted")
    insights.push("Sun powerful in D-10 — government, authority, leadership. Career recognition is assured and lasting.");
  if(sat?.dignity==="Exalted"||sat?.dignity==="Own")
    insights.push("Strong Saturn in D-10 — service-oriented career. Disciplined rise to lasting recognition.");
  if(jup?.dignity==="Exalted"||jup?.house===10)
    insights.push("Jupiter strong in D-10 — teaching, law, finance, or advisory career. Wisdom-based professional success.");
  if(merc?.dignity==="Exalted"||merc?.house===10)
    insights.push("Mercury strong in D-10 — business, writing, media, or analytics. Communication is your career superpower.");
  if(mars?.dignity==="Exalted"||mars?.house===10)
    insights.push("Mars strong in D-10 — engineering, military, surgery, sports, or executive leadership are ideal career paths.");
  if(ven?.dignity==="Exalted"||ven?.house===10)
    insights.push("Venus strong in D-10 — arts, entertainment, luxury brands, beauty, or diplomacy as career. Public appreciation.");
  if(insights.length===0) insights.push("D-10 reveals career dharma. Study the 10th lord and Sun position for professional peak and timing.");
  return insights;
}

export function getRudramshaAnalysis(d11: DivChart): string[] {
  const insights: string[] = [];
  const jup  = d11.planets.find(p=>p.planet==="Jupiter");
  const ven  = d11.planets.find(p=>p.planet==="Venus");
  const merc = d11.planets.find(p=>p.planet==="Mercury");
  const sun  = d11.planets.find(p=>p.planet==="Sun");
  const sat  = d11.planets.find(p=>p.planet==="Saturn");
  const rahu = d11.planets.find(p=>p.planet==="Rahu");
  if(jup?.dignity==="Exalted"||jup?.house===11)
    insights.push("Jupiter in 11th D-11 — extraordinary gains, large social network, and fulfilled desires. High income potential.");
  if(ven?.house===11||ven?.dignity==="Exalted")
    insights.push("Venus in 11th D-11 — gains through arts, luxury, or female associations. Pleasurable income streams.");
  if(merc?.house===11||merc?.dignity==="Exalted")
    insights.push("Mercury in 11th D-11 — gains through business, trading, communication, and multiple income streams.");
  if(sun?.house===11)
    insights.push("Sun in 11th D-11 — gains through government, authority, or elder siblings. Social status brings material gains.");
  if(sat?.dignity==="Exalted"||sat?.house===11)
    insights.push("Saturn in 11th D-11 — gains come slowly but accumulate massively. Service and technology bring rewards.");
  if(rahu?.house===11)
    insights.push("Rahu in 11th D-11 — large, unusual gains. Foreign connections and non-traditional income streams are highly profitable.");
  const deb = d11.planets.filter(p=>p.dignity==="Debilitated");
  if(deb.length>0)
    insights.push(`${deb.map(p=>p.planet).join(", ")} weak in D-11 — these domains see slower fulfillment of desires. Targeted remedies accelerate gains.`);
  if(insights.length===0) insights.push("D-11 reveals gains and income patterns. 11th lord strength is the key indicator of financial fulfillment.");
  return insights;
}

export function getDwadashamshaAnalysis(d12: DivChart): string[] {
  const insights: string[] = [];
  const sun  = d12.planets.find(p=>p.planet==="Sun");
  const moon = d12.planets.find(p=>p.planet==="Moon");
  const jup  = d12.planets.find(p=>p.planet==="Jupiter");
  const sat  = d12.planets.find(p=>p.planet==="Saturn");
  const ven  = d12.planets.find(p=>p.planet==="Venus");
  if(sun?.dignity==="Exalted"||sun?.dignity==="Own")
    insights.push("Sun strong in D-12 — father is influential, supportive, long-lived. Paternal blessings are powerfully active.");
  if(sun?.dignity==="Debilitated")
    insights.push("Sun weak in D-12 — paternal karma needs healing. Ancestral remedies and Sun strengthening are recommended.");
  if(sun?.house===9) insights.push("Sun in 9th D-12 — deeply dharmic father. Strong paternal guidance and fortune through father's lineage.");
  if(moon?.dignity==="Exalted"||moon?.dignity==="Own")
    insights.push("Moon strong in D-12 — mother is nurturing, emotionally strong, long-lived. Maternal blessings are active.");
  if(moon?.dignity==="Debilitated")
    insights.push("Moon weak in D-12 — maternal health or emotional support needs attention. Feminine ancestral karma is active.");
  if(moon?.house===4) insights.push("Moon in 4th D-12 — exceptionally close bond with mother. Home and maternal comfort are life's foundation.");
  if(jup?.house===9||jup?.dignity==="Exalted") insights.push("Jupiter in 9th D-12 — ancestors were righteous and spiritually advanced. Dharmic inheritance flows through lineage.");
  if(sat?.house===1||sat?.house===8) insights.push("Saturn prominent in D-12 — ancestral karmic debt present. Pitru Tarpan and Saturn remedies strongly recommended.");
  if(ven?.house===4||ven?.dignity==="Exalted") insights.push("Venus in D-12 — ancestral wealth in arts, land, or beauty industries. Inherited creative talents.");
  if(insights.length<=1) insights.push("D-12: Sun = father's karma, Moon = mother's karma. Strong placements confirm parental blessings and ancestral merit.");
  return insights;
}

export function getShodashamshAnalysis(d16: DivChart): string[] {
  const insights: string[] = [];
  const ven  = d16.planets.find(p=>p.planet==="Venus");
  const moon = d16.planets.find(p=>p.planet==="Moon");
  const jup  = d16.planets.find(p=>p.planet==="Jupiter");
  const sat  = d16.planets.find(p=>p.planet==="Saturn");
  const mars = d16.planets.find(p=>p.planet==="Mars");
  if(ven?.dignity==="Exalted"||ven?.house===4)
    insights.push("Venus strong in D-16 — luxury vehicles, beautiful home, and refined comforts are naturally attracted. High quality of material life.");
  if(moon?.dignity==="Exalted"||moon?.house===4)
    insights.push("Moon in 4th D-16 — great domestic happiness and emotional comfort. Peace and pleasure in private life.");
  if(jup?.house===4||jup?.dignity==="Exalted")
    insights.push("Jupiter in 4th D-16 — vehicles and comforts come through wisdom and good karma. Auspicious, high-quality possessions.");
  if(sat?.house===4||sat?.dignity==="Debilitated")
    insights.push("Saturn influences 4th D-16 — vehicle or comfort acquisition is delayed but ultimately reliable. Quality over speed.");
  if(mars?.house===4)
    insights.push("Mars in 4th D-16 — active, sporty vehicles preferred. Quick acquisitions but some accidents possible. Drive carefully.");
  const deb = d16.planets.filter(p=>p.dignity==="Debilitated");
  if(deb.length>0)
    insights.push(`${deb.map(p=>p.planet).join(", ")} weak in D-16 — comfort and vehicle matters need attention. These areas bring some dissatisfaction.`);
  if(insights.length===0) insights.push("D-16 reveals vehicles, luxury, and domestic happiness. 4th lord strength is the key indicator of material comfort.");
  return insights;
}

export function getVimshamshaAnalysis(d20: DivChart): string[] {
  const insights: string[] = [];
  const jup  = d20.planets.find(p=>p.planet==="Jupiter");
  const ketu = d20.planets.find(p=>p.planet==="Ketu");
  const sat  = d20.planets.find(p=>p.planet==="Saturn");
  const moon = d20.planets.find(p=>p.planet==="Moon");
  const sun  = d20.planets.find(p=>p.planet==="Sun");
  if(jup?.dignity==="Exalted"||jup?.house===9||jup?.house===12)
    insights.push("Jupiter strong in D-20 — deep spiritual wisdom. Teaching, philosophy, and dharmic study are your natural calling.");
  if(ketu?.house===12||ketu?.house===9)
    insights.push("Ketu in 9th/12th D-20 — past-life spiritual practice is strong. Moksha orientation and detachment are innate.");
  if(sat?.house===12||sat?.house===8)
    insights.push("Saturn in 12th/8th D-20 — disciplined spiritual practice brings liberation. Meditation and austerity are the path.");
  if(moon?.house===12||moon?.dignity==="Exalted")
    insights.push("Moon strong in D-20 — devotional, bhakti-oriented spiritual path. Emotional surrender and prayer are powerful for you.");
  if(sun?.house===9||sun?.dignity==="Exalted")
    insights.push("Sun strong in D-20 — solar spiritual path. Self-inquiry, Vedanta, and jnana yoga resonate deeply.");
  const strong = d20.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  if(strong.length>0)
    insights.push(`${strong.map(p=>p.planet).join(", ")} strong in D-20 — these planetary energies support specific spiritual practices best aligned to your soul.`);
  if(insights.length===0) insights.push("D-20 reveals the spiritual path best suited to your soul. Study 9th and 12th house lords for practice guidance.");
  return insights;
}

export function getChatuvimshamshaAnalysis(d24: DivChart): string[] {
  const insights: string[] = [];
  const merc = d24.planets.find(p=>p.planet==="Mercury");
  const jup  = d24.planets.find(p=>p.planet==="Jupiter");
  const sun  = d24.planets.find(p=>p.planet==="Sun");
  const sat  = d24.planets.find(p=>p.planet==="Saturn");
  const mars = d24.planets.find(p=>p.planet==="Mars");
  if(merc?.dignity==="Exalted"||merc?.house===5)
    insights.push("Mercury strong in D-24 — exceptional academic ability, mathematics, languages, and analytical studies come with great ease.");
  if(jup?.dignity==="Exalted"||jup?.house===5||jup?.house===9)
    insights.push("Jupiter strong in D-24 — higher education, philosophy, law, or wisdom traditions are natural fields of mastery.");
  if(sun?.dignity==="Exalted"||sun?.house===5)
    insights.push("Sun in 5th D-24 — leadership in academic or creative fields. Recognized for intellectual contributions.");
  if(sat?.house===5||sat?.dignity==="Debilitated")
    insights.push("Saturn in 5th D-24 — formal education may have delays or gaps, but self-study and experiential learning prove superior.");
  if(mars?.house===5||mars?.dignity==="Exalted")
    insights.push("Mars strong in D-24 — engineering, sports science, surgery, or competitive academics are natural domains of excellence.");
  const strong = d24.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  if(strong.length>0)
    insights.push(`${strong.map(p=>p.planet).join(", ")} strong in D-24 — these domains carry natural academic aptitude and learning mastery.`);
  if(insights.length===0) insights.push("D-24 reveals educational karma. Mercury and Jupiter placement show the fields where learning comes most naturally.");
  return insights;
}

export function getSaptavimshamshaAnalysis(d27: DivChart): string[] {
  const insights: string[] = [];
  const strong  = d27.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  const deb     = d27.planets.filter(p=>p.dignity==="Debilitated");
  const inLagna = d27.planets.filter(p=>p.inLagna);
  if(strong.length>0) insights.push(`${strong.map(p=>p.planet).join(", ")} are strong in D-27 — these are your innate karmic talents and natural gifts carried from past lifetimes.`);
  if(deb.length>0)    insights.push(`${deb.map(p=>p.planet).join(", ")} are weak in D-27 — these areas require deliberate effort this life. Remedies activate their latent potential.`);
  if(inLagna.length>0) insights.push(`${inLagna.map(p=>p.planet).join(", ")} in D-27 Lagna — these planetary energies are your most visible natural character strengths.`);
  const planets = d27.planets;
  const jup = planets.find(p=>p.planet==="Jupiter");
  const sat = planets.find(p=>p.planet==="Saturn");
  const mer = planets.find(p=>p.planet==="Mercury");
  const ven = planets.find(p=>p.planet==="Venus");
  const sun = planets.find(p=>p.planet==="Sun");
  const mars= planets.find(p=>p.planet==="Mars");
  if(sun?.dignity==="Exalted")  insights.push("Exalted Sun in D-27 — leadership and solar authority are your deepest soul strengths.");
  if(jup?.dignity==="Exalted")  insights.push("Exalted Jupiter in D-27 — wisdom and teaching are the soul's primary calling.");
  if(sat?.dignity==="Exalted")  insights.push("Exalted Saturn in D-27 — extraordinary disciplined endurance is a soul-level superpower.");
  if(mars?.dignity==="Exalted") insights.push("Exalted Mars in D-27 — warrior courage and executive drive are innate soul qualities.");
  if(mer?.dignity==="Exalted")  insights.push("Exalted Mercury in D-27 — brilliant analytical mind and communication are primary soul gifts.");
  if(ven?.dignity==="Exalted")  insights.push("Exalted Venus in D-27 — artistic beauty and harmony are deeply ingrained soul qualities.");
  if(insights.length===0) insights.push("D-27 maps soul-level strengths. Strong dignity planets here are gifts from past-life cultivation.");
  return insights;
}

export function getTrimshamshAnalysis(d30: DivChart): string[] {
  const insights: string[] = [];
  const sat  = d30.planets.find(p=>p.planet==="Saturn");
  const mars = d30.planets.find(p=>p.planet==="Mars");
  const rahu = d30.planets.find(p=>p.planet==="Rahu");
  const sun  = d30.planets.find(p=>p.planet==="Sun");
  const moon = d30.planets.find(p=>p.planet==="Moon");
  const jup  = d30.planets.find(p=>p.planet==="Jupiter");
  const ven  = d30.planets.find(p=>p.planet==="Venus");
  if(jup?.dignity==="Exalted"||jup?.house===1||jup?.house===9)
    insights.push("Jupiter strong in D-30 — spiritual merit protects against evil and misfortune. Negative karma is mitigated by dharma.");
  if(ven?.dignity==="Exalted"||ven?.house===1)
    insights.push("Venus in D-30 Lagna — comfort and pleasure-related challenges. Overindulgence and relationship matters need balance.");
  if(sat?.dignity==="Debilitated"||sat?.house===1||sat?.house===8)
    insights.push("Saturn afflicted in D-30 — karmic obstacles and delays are prominent. Saturn remedies are essential for progress.");
  if(mars?.house===1||mars?.dignity==="Debilitated")
    insights.push("Mars in D-30 Lagna — anger, accidents, and hasty actions are areas of karmic challenge. Conscious patience is key.");
  if(rahu?.house===1||rahu?.house===8)
    insights.push("Rahu prominent in D-30 — illusions, addictions, and foreign-related challenges are karmic patterns. Rahu remedies essential.");
  if(sun?.dignity==="Debilitated") insights.push("Sun weak in D-30 — ego and authority-related suffering. Humility and service reduce this karma.");
  if(moon?.dignity==="Debilitated") insights.push("Moon weak in D-30 — emotional and mental vulnerabilities need consistent healing practices.");
  const deb = d30.planets.filter(p=>p.dignity==="Debilitated");
  if(deb.length>1) insights.push(`Multiple planets weak in D-30 (${deb.map(p=>p.planet).join(", ")}) — significant karmic remediation recommended through mantra, charity, and service.`);
  if(insights.length===0) insights.push("D-30 reveals areas of karmic suffering. Benefics here protect. Analyze malefic placements for required remedies.");
  return insights;
}

export function getKhavedamshAnalysis(d40: DivChart): string[] {
  const insights: string[] = [];
  const strong = d40.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  const deb    = d40.planets.filter(p=>p.dignity==="Debilitated");
  const jup    = d40.planets.find(p=>p.planet==="Jupiter");
  if(strong.length>0)
    insights.push(`${strong.map(p=>p.planet).join(", ")} are auspicious in D-40 — these domains bring consistent positive karma and reliable good outcomes in this life.`);
  if(jup?.dignity==="Exalted"||jup?.house===1||jup?.house===9)
    insights.push("Jupiter strong in D-40 — overall life quality is high. Good fortune, righteousness, and wisdom dominate the karmic pattern.");
  if(deb.length>0)
    insights.push(`${deb.map(p=>p.planet).join(", ")} weak in D-40 — these areas carry inauspicious tendencies requiring mindful remediation.`);
  if(insights.length===0) insights.push("D-40 reveals the general karmic texture of this life. Strong planets bring auspicious results across the corresponding life domains.");
  return insights;
}

export function getAkshavedamshAnalysis(d45: DivChart): string[] {
  const insights: string[] = [];
  const strong = d45.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  const deb    = d45.planets.filter(p=>p.dignity==="Debilitated");
  const inL    = d45.planets.filter(p=>p.inLagna);
  if(inL.length>0) insights.push(`${inL.map(p=>p.planet).join(", ")} in D-45 Lagna — these energies define the core character and moral quality of this life.`);
  if(strong.length>0) insights.push(`${strong.map(p=>p.planet).join(", ")} strong in D-45 — these planetary virtues are deeply embedded in character and naturally expressed.`);
  if(deb.length>0) insights.push(`${deb.map(p=>p.planet).join(", ")} weak in D-45 — character development in these areas requires deliberate cultivation and ethical practice.`);
  if(insights.length===0) insights.push("D-45 shows the overall character and life quality indicators. Planetary dignities here reflect moral standing and general prosperity.");
  return insights;
}

export function getShastiamshaAnalysis(d60: DivChart): string[] {
  const insights: string[] = [];
  const strong  = d60.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
  const deb     = d60.planets.filter(p=>p.dignity==="Debilitated");
  const inLagna = d60.planets.filter(p=>p.inLagna);
  const jup     = d60.planets.find(p=>p.planet==="Jupiter");
  const ketu    = d60.planets.find(p=>p.planet==="Ketu");
  const sat     = d60.planets.find(p=>p.planet==="Saturn");
  if(strong.length>0)
    insights.push(`${strong.map(p=>p.planet).join(", ")} are powerful in D-60 — these planets carry exceptionally strong past-life karma. Their dashas in this life deliver profound, transformative results.`);
  if(deb.length>0)
    insights.push(`${deb.map(p=>p.planet).join(", ")} are weak in D-60 — deep past-life karmic debt in these areas. These planets' dashas bring significant challenges requiring serious remediation.`);
  if(inLagna.length>0)
    insights.push(`${inLagna.map(p=>p.planet).join(", ")} in D-60 Lagna — these are the most karmically loaded planetary energies you carry into this life.`);
  if(jup?.dignity==="Exalted"||jup?.house===9)
    insights.push("Jupiter strong in D-60 — righteous, wisdom-seeking past life. Tremendous accumulated merit flows into this birth.");
  if(ketu?.house===12||ketu?.house===9)
    insights.push("Ketu prominent in D-60 — deeply spiritual past life. Renunciation and liberation were prior-life themes.");
  if(sat?.dignity==="Debilitated"||sat?.house===8)
    insights.push("Saturn challenging in D-60 — past-life neglect of duty or service creates present karmic lessons. Dedicated service and discipline resolve this.");
  if(insights.length===0)
    insights.push("D-60 is the most karmic divisional — it shows exact past-life actions and their precise fruit in this life. Every planetary placement here is deeply significant.");
  return insights;
}

// ── MASTER: get analysis for any chart ───────────────────────────────────────

export function getChartAnalysis(chart: DivChart): string[] {
  switch(chart.key) {
    case "D1":  return getRasiAnalysis(chart);
    case "D2":  return getHoraAnalysis(chart);
    case "D3":  return getDrekkanaAnalysis(chart);
    case "D4":  return getChaturthamshAnalysis(chart);
    case "D5":  return getPanchamshAnalysis(chart);
    case "D6":  return getShashthamshAnalysis(chart);
    case "D7":  return getSaptamsaAnalysis(chart);
    case "D8":  return getAshtamshAnalysis(chart);
    case "D9":  return getNavamshaAnalysis(chart);
    case "D10": return getDashamshaAnalysis(chart);
    case "D11": return getRudramshaAnalysis(chart);
    case "D12": return getDwadashamshaAnalysis(chart);
    case "D16": return getShodashamshAnalysis(chart);
    case "D20": return getVimshamshaAnalysis(chart);
    case "D24": return getChatuvimshamshaAnalysis(chart);
    case "D27": return getSaptavimshamshaAnalysis(chart);
    case "D30": return getTrimshamshAnalysis(chart);
    case "D40": return getKhavedamshAnalysis(chart);
    case "D45": return getAkshavedamshAnalysis(chart);
    case "D60": return getShastiamshaAnalysis(chart);
    default:    return [chart.keyInsight];
  }
}

// ── SPECIAL FINDINGS ─────────────────────────────────────────────────────────

export interface SpecialFinding {
  title:  string;
  detail: string;
  type:   "positive" | "caution" | "neutral";
  charts: string[];
}

export function getSpecialFindings(allCharts: DivChart[]): SpecialFinding[] {
  const findings: SpecialFinding[] = [];
  const get = (k:string) => allCharts.find(c=>c.key===k);
  const d1=get("D1"), d9=get("D9"), d10=get("D10"), d7=get("D7"), d12=get("D12"), d60=get("D60"), d30=get("D30");

  // Vargottama: same sign in D1 and D9
  if(d1&&d9) {
    const varg = d1.planets.filter(p1=>d9.planets.some(p9=>p9.planet===p1.planet&&p9.signNum===p1.signNum));
    if(varg.length>0)
      findings.push({title:"Vargottama Planets",
        detail:`${varg.map(p=>p.planet).join(", ")} are in the same sign in both D-1 and D-9. These planets are exceptionally powerful — they give consistent, reliable results throughout life and their dashas are exceptionally significant.`,
        type:"positive",charts:["D1","D9"]});
  }

  // Royal Career Yoga
  if(d1&&d10) {
    const s1=d1.planets.find(p=>p.planet==="Sun"), s10=d10.planets.find(p=>p.planet==="Sun");
    if((s1?.dignity==="Exalted"||s1?.house===10)&&(s10?.dignity==="Exalted"||s10?.house===10))
      findings.push({title:"Royal Career Yoga",
        detail:"Sun is powerful in both D-1 and D-10. This rare yoga indicates government service, leadership authority, or high public recognition. Career peak is assured during Sun's Mahadasha.",
        type:"positive",charts:["D1","D10"]});
  }

  // Exceptional Marriage Yoga
  if(d1&&d9) {
    const v1=d1.planets.find(p=>p.planet==="Venus"), v9=d9.planets.find(p=>p.planet==="Venus");
    if((v1?.dignity==="Exalted"||v1?.dignity==="Own")&&(v9?.dignity==="Exalted"||v9?.dignity==="Own"))
      findings.push({title:"Exceptional Marriage Yoga",
        detail:"Venus is strong in both D-1 and D-9. Married life is deeply blessed with love, harmony, and beauty. Spouse is refined, supportive, and brings good fortune.",
        type:"positive",charts:["D1","D9"]});
  }

  // Strong Progeny Yoga
  if(d1&&d7) {
    const j1=d1.planets.find(p=>p.planet==="Jupiter"), j7=d7.planets.find(p=>p.planet==="Jupiter");
    if((j1?.dignity==="Exalted"||j1?.dignity==="Own")&&(j7?.dignity==="Exalted"||j7?.house===5))
      findings.push({title:"Strong Progeny Yoga",
        detail:"Jupiter is powerful in both D-1 and D-7. Children are blessed with wisdom and success. This also indicates great fortune through creative and intellectual pursuits.",
        type:"positive",charts:["D1","D7"]});
  }

  // Neecha Bhanga Raja Yoga
  if(d1&&d9) {
    d1.planets.filter(p=>p.dignity==="Debilitated").forEach(p=>{
      const inD9=d9.planets.find(pp=>pp.planet===p.planet);
      if(inD9?.dignity==="Exalted"||inD9?.dignity==="Own")
        findings.push({title:`Neecha Bhanga — ${p.planet}`,
          detail:`${p.planet} is debilitated in D-1 but gains strength in D-9 Navamsha. This Neecha Bhanga Raja Yoga cancels the weakness and converts it into strength, particularly in the soul and dharmic domain. Exceptionally powerful yoga.`,
          type:"positive",charts:["D1","D9"]});
    });
  }

  // D-60 powerful planets
  if(d60) {
    const s60=d60.planets.filter(p=>p.dignity==="Exalted"||p.dignity==="Own");
    if(s60.length>0)
      findings.push({title:"Strong Past-Life Karma",
        detail:`${s60.map(p=>p.planet).join(", ")} are powerful in D-60 Shastiamsha. These planets carry immense past-life merit — their Mahadashas in this life deliver exceptional and transformative results.`,
        type:"positive",charts:["D60"]});
    const d60deb=d60.planets.filter(p=>p.dignity==="Debilitated");
    if(d60deb.length>0)
      findings.push({title:"Past-Life Karmic Debt",
        detail:`${d60deb.map(p=>p.planet).join(", ")} are weak in D-60. These planets carry past-life karmic debt. Their dashas require targeted remedies, conscious effort, and service to transform the pattern.`,
        type:"caution",charts:["D60"]});
  }

  // Pitru Dosha from D-12
  if(d12) {
    const sat12=d12.planets.find(p=>p.planet==="Saturn");
    const sun12=d12.planets.find(p=>p.planet==="Sun");
    if((sat12?.dignity==="Debilitated"||sat12?.house===8||sat12?.house===12)&&sun12?.dignity==="Debilitated")
      findings.push({title:"Pitru Dosha — Ancestral Debt",
        detail:"Saturn and Sun are both afflicted in D-12. This strongly indicates Pitru Dosha — ancestral karmic debt. Performing Pitru Tarpan on Amavasya, Shraddha rituals, and Saturn remedies on Saturdays is strongly recommended.",
        type:"caution",charts:["D12"]});
  }

  // D-30 multi-debilitated = strong remedies needed
  if(d30) {
    const deb30=d30.planets.filter(p=>p.dignity==="Debilitated");
    if(deb30.length>=3)
      findings.push({title:"Multiple D-30 Afflictions",
        detail:`${deb30.map(p=>p.planet).join(", ")} are weak in D-30 Trimshamsha. Multiple karmic challenges are indicated. A comprehensive remedy program including mantra, charity, and fasting is strongly advised.`,
        type:"caution",charts:["D30"]});
  }

  if(findings.length===0)
    findings.push({title:"Balanced Divisional Pattern",
      detail:"No extreme yogas or doshas across divisional charts. Life unfolds through steady, consistent karma with balanced planetary support.",
      type:"neutral",charts:["D1"]});

  return findings;
}
