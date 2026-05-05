// ============================================================
// ASTROLIFE DIVISIONAL CHARTS ENGINE v2.0
// D-1 Rasi · D-3 Drekkana · D-7 Saptamsa · D-9 Navamsha
// D-10 Dashamsha · D-12 Dwadashamsha · D-27/D-60
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
    key:     string;
    name:    string;
    purpose: string;
    lagnaNum:number;
    lagna:   string;
    planets: DivPlanet[];
    keyInsight: string;
  }
  
  interface PD {
    house:number; sign:string; signNum:number;
    retrograde:boolean; dignity:string; lon:number;
  }
  
  const PLS   = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const PEMO  = ["☉","☽","♂","☿","♃","♀","♄","☊","☋"];
  const PCOL  = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa","#a78bfa","#fb7185"];
  const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  
  const md = (x:number,m:number)=>((x%m)+m)%m;
  
  // Dignity check
  function getDignity(planet:string, signNum:number): string {
    const UCH: Record<string,number> = {Sun:0,Moon:1,Mars:9,Mercury:5,Jupiter:3,Venus:11,Saturn:6};
    const OWN: Record<string,number[]> = {Sun:[4],Moon:[3],Mars:[0,7],Mercury:[2,5],Jupiter:[8,11],Venus:[1,6],Saturn:[9,10]};
    const DEB: Record<string,number>   = {Sun:6,Moon:7,Mars:3,Mercury:11,Jupiter:9,Venus:5,Saturn:0};
    if(UCH[planet]===signNum) return "Exalted";
    if(OWN[planet]?.includes(signNum)) return "Own";
    if(DEB[planet]===signNum) return "Debilitated";
    return "—";
  }
  
  // ── D-3 Drekkana ─────────────────────────────────────────────
  function getD3(lon:number): number {
    const sign = Math.floor(md(lon,360)/30);
    const deg  = md(lon,360) % 30;
    const part = Math.floor(deg/10); // 0,1,2
    const starts = [0,4,8]; // Fire/Earth/Air starts
    const isOdd  = sign % 2 === 0; // odd signs: Aries,Gemini...
    if(isOdd) return md(sign + starts[part], 12);
    else       return md(sign + [8,4,0][part], 12);
  }
  
  // ── D-7 Saptamsa ─────────────────────────────────────────────
  function getD7(lon:number): number {
    const sign = Math.floor(md(lon,360)/30);
    const deg  = md(lon,360) % 30;
    const part = Math.floor(deg/(30/7));
    return md(sign + (sign%2===0 ? part : 6+part), 12);
  }
  
  // ── D-9 Navamsha (most important) ────────────────────────────
  function getD9(lon:number): number {
    const totalDeg = md(lon, 360);
    const navPart  = Math.floor(totalDeg / (360/108));
    return navPart % 12;
  }
  
  // ── D-10 Dashamsha ───────────────────────────────────────────
  function getD10(lon:number): number {
    const sign = Math.floor(md(lon,360)/30);
    const deg  = md(lon,360) % 30;
    const part = Math.floor(deg/3);
    return md(sign%2===0 ? sign+part : sign+9+part, 12);
  }
  
  // ── D-12 Dwadashamsha ────────────────────────────────────────
  function getD12(lon:number): number {
    const sign = Math.floor(md(lon,360)/30);
    const deg  = md(lon,360) % 30;
    const part = Math.floor(deg/2.5);
    return md(sign + part, 12);
  }
  
  // ── D-27 Saptavimshamsha ─────────────────────────────────────
  function getD27(lon:number): number {
    const totalDeg = md(lon, 360);
    return Math.floor(totalDeg / (360/27)) % 12;
  }
  
  // Build a divisional chart from a mapping function
  function buildDiv(
    key: string,
    name: string,
    purpose: string,
    keyInsight: string,
    planets: Record<string,PD>,
    lagnaLon: number,
    getSign: (lon:number)=>number
  ): DivChart {
    const lagnaNum = getSign(lagnaLon);
  
    const divPlanets: DivPlanet[] = PLS.map((planet,pi) => {
      const pd = planets[planet];
      if(!pd) return null;
      const signNum = getSign(pd.lon);
      const house   = md(signNum - lagnaNum, 12) + 1;
      return {
        planet, icon:PEMO[pi], color:PCOL[pi],
        signNum, sign:SIGNS[signNum],
        house, retrograde:pd.retrograde,
        dignity: getDignity(planet, signNum),
        inLagna: signNum === lagnaNum,
      };
    }).filter(Boolean) as DivPlanet[];
  
    return { key, name, purpose, lagnaNum, lagna:SIGNS[lagnaNum], planets:divPlanets, keyInsight };
  }
  
  // ── MAIN CALCULATOR ───────────────────────────────────────────
  export function calculateDivisional(
    planets: Record<string,PD>,
    lagnaNum: number,
    lagnaLon: number
  ): DivChart[] {
    // D-1: use actual positions
    const d1Planets: DivPlanet[] = PLS.map((planet,pi)=>{
      const pd = planets[planet]; if(!pd) return null;
      return {
        planet, icon:PEMO[pi], color:PCOL[pi],
        signNum:pd.signNum, sign:pd.sign,
        house:pd.house, retrograde:pd.retrograde,
        dignity:pd.dignity||"—", inLagna:pd.signNum===lagnaNum,
      };
    }).filter(Boolean) as DivPlanet[];
  
    const d1: DivChart = {
      key:"D1", name:"Rasi Chart", purpose:"Overall life — personality, health, all matters",
      lagnaNum, lagna:SIGNS[lagnaNum], planets:d1Planets,
      keyInsight:"The foundation chart. Lagna sign shapes personality. All other divisionals refine specific areas of life.",
    };
  
    return [
      d1,
      buildDiv("D3","Drekkana","Siblings, courage, communication",
        "Shows sibling relationships and courage. 3rd house strength critical for effort and communication.",
        planets, lagnaLon, getD3),
      buildDiv("D7","Saptamsa","Children, progeny, creative output",
        "D-7 reveals children karma and creative legacy. 5th house and Jupiter position most important.",
        planets, lagnaLon, getD7),
      buildDiv("D9","Navamsha","Marriage, dharma, spiritual path — most important after D-1",
        "The soul chart. Shows spouse nature, dharmic path, and inner spiritual strength. Planets stronger in D-9 give lasting results.",
        planets, lagnaLon, getD9),
      buildDiv("D10","Dashamsha","Career, profession, public status, authority",
        "Career chart. 10th lord and Sun placement determine professional peak. Best career timing from D-10 dashas.",
        planets, lagnaLon, getD10),
      buildDiv("D12","Dwadashamsha","Parents, ancestors, karmic inheritance",
        "Parental karma chart. Father = Sun, Mother = Moon. Ancestral blessings and challenges visible here.",
        planets, lagnaLon, getD12),
      buildDiv("D27","Saptavimshamsha","Strengths, weaknesses, inherent abilities",
        "Strength chart. Shows innate talents and karmic abilities carried from past lives. Natural skill areas highlighted.",
        planets, lagnaLon, getD27),
    ];
  }
  
  // ── D-9 specific analysis ─────────────────────────────────────
  export function getNavamshaAnalysis(d9: DivChart): string[] {
    const insights: string[] = [];
    const sun  = d9.planets.find(p=>p.planet==="Sun");
    const moon = d9.planets.find(p=>p.planet==="Moon");
    const ven  = d9.planets.find(p=>p.planet==="Venus");
    const jupit= d9.planets.find(p=>p.planet==="Jupiter");
  
    if(ven?.dignity==="Exalted"||ven?.dignity==="Own")
      insights.push("Venus strong in Navamsha — beautiful, harmonious, supportive spouse. Happy married life.");
    if(ven?.dignity==="Debilitated")
      insights.push("Venus weak in Navamsha — relationship karma needs work. Communication and compromise essential in marriage.");
    if(jupit?.dignity==="Exalted"||jupit?.dignity==="Own")
      insights.push("Jupiter strong in D-9 — wise, spiritual, educated spouse. Dharmic marriage.");
    if(moon?.dignity==="Exalted")
      insights.push("Exalted Moon in Navamsha — emotionally rich inner life. Strong dharmic foundation.");
    if(sun?.inLagna)
      insights.push("Sun in D-9 Lagna — authority, leadership in dharmic path. Father's blessings strong.");
    if(insights.length===0)
      insights.push("Navamsha shows the soul's journey. Analyze spouse house (H7) and Venus for marriage insights.");
  
    return insights;
  }
  
  // ── D-10 career analysis ──────────────────────────────────────
  export function getDashamshaAnalysis(d10: DivChart): string[] {
    const insights: string[] = [];
    const sun  = d10.planets.find(p=>p.planet==="Sun");
    const sat  = d10.planets.find(p=>p.planet==="Saturn");
    const jup  = d10.planets.find(p=>p.planet==="Jupiter");
    const merc = d10.planets.find(p=>p.planet==="Mercury");
  
    if(sun?.house===10||sun?.dignity==="Exalted")
      insights.push("Sun powerful in D-10 — government, authority, leadership roles. Career recognition assured.");
    if(sat?.dignity==="Exalted"||sat?.dignity==="Own")
      insights.push("Strong Saturn in D-10 — service-oriented career. Slow rise but lasting recognition.");
    if(jup?.dignity==="Exalted"||jup?.house===10)
      insights.push("Jupiter strong in D-10 — teaching, law, finance, or advisory career. Wisdom-based success.");
    if(merc?.dignity==="Exalted"||merc?.house===10)
      insights.push("Mercury strong in D-10 — business, writing, media, or analytical career suits perfectly.");
    if(insights.length===0)
      insights.push("D-10 reveals career dharma. Focus on 10th lord and Sun placement for professional guidance.");
  
    return insights;
  }
