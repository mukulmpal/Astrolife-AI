// ============================================================
// ASTROLIFE DESTINY CURVE ENGINE v2.0
// Extracted from AstroLife_v20_SwissEphem_Accurac
// Life score curve · Dasha bands · Area scores · Peak/Challenge
// ============================================================

export interface DestinyPoint {
    age:   number;
    year:  number;
    score: number;
    dasha: string;
  }
  
  export interface DestinyArea {
    name:  string;
    icon:  string;
    score: number;
    status:"Strong"|"Average"|"Needs Work";
    color: string;
  }
  
  export interface DashaBand {
    planet: string;
    start:  Date;
    end:    Date;
    startAge: number;
    endAge:   number;
    score:  number;
    color:  string;
  }
  
  export interface DestinyResult {
    points:      DestinyPoint[];
    areas:       DestinyArea[];
    bands:       DashaBand[];
    peak:        DashaBand;
    challenge:   DashaBand;
    currentAge:  number;
    currentScore:number;
    currentDasha:string;
    summary:     string;
  }
  
  interface PD { house:number; sign:string; signNum:number; retrograde:boolean; dignity:string; lon:number; }
  interface DashaEntry { planet:string; start:Date; end:Date; yrs:number; active?:boolean; }
  
  const PLS  = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const PCOL = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa","#a78bfa","#fb7185"];
  const DO   = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
  const DY: Record<string,number> = {Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
  
  const md = (x:number,m:number)=>((x%m)+m)%m;
  
  function buildAD(mdPlanet:string, mdStart:Date, mdYrs:number): DashaEntry[] {
    const mi=DO.indexOf(mdPlanet); const seq:DashaEntry[]=[]; let cur=new Date(mdStart); const now=new Date();
    for(let i=0;i<9;i++){
      const pi=md(mi+i,9); const p=DO[pi]; const yrs=mdYrs*DY[p]/120;
      const end=new Date(cur.getTime()+yrs*365.25*24*3600*1000);
      seq.push({planet:p,start:new Date(cur),end,yrs,active:cur<=now&&now<end});
      cur=new Date(end);
    }
    return seq;
  }
  
  export function calculateDestiny(
    planets: Record<string,PD>,
    dashas:  DashaEntry[],
    dob:     string
  ): DestinyResult {
    const dobDate  = new Date(dob);
    const birthYear= dobDate.getFullYear();
    const now      = new Date();
    const maxAge   = 90;
  
    // Score a given year
    function scoreYear(year:number): number {
      const d = new Date(year,6,1);
      const activeMD = dashas.find(s=>s.start<=d&&s.end>d);
      if(!activeMD) return 50;
      const adSeq    = buildAD(activeMD.planet, activeMD.start, activeMD.yrs);
      const activeAD = adSeq.find(s=>s.start<=d&&s.end>d);
      let score = 50;
      const mdP = activeMD.planet;
      const pd  = planets[mdP];
      if(pd) {
        if([1,4,7,10].includes(pd.house))      score += 12;
        else if([6,8,12].includes(pd.house))   score -= 10;
        if(pd.dignity?.includes("Exalted"))    score += 8;
        else if(pd.dignity?.includes("Debilitated")) score -= 10;
        if(pd.retrograde)                      score -= 5;
        if(["Jupiter","Venus"].includes(mdP) && [1,4,5,7,9,10,11].includes(pd.house)) score += 10;
        if(["Saturn","Mars"].includes(mdP)   && [6,8,12].includes(pd.house))           score -= 8;
      }
      // AD factor
      if(activeAD && planets[activeAD.planet]) {
        const adPd = planets[activeAD.planet];
        if([1,4,7,10].includes(adPd.house))    score += 5;
        if([6,8,12].includes(adPd.house))      score -= 5;
      }
      return Math.min(95, Math.max(15, Math.round(score)));
    }
  
    // Build curve points
    const points: DestinyPoint[] = [];
    for(let a=0;a<=maxAge;a++) {
      const year = birthYear + a;
      const d    = new Date(year,6,1);
      const md2  = dashas.find(s=>s.start<=d&&s.end>d);
      points.push({ age:a, year, score:scoreYear(year), dasha:md2?.planet||"" });
    }
  
    // Build dasha bands
    const bands: DashaBand[] = dashas.map(d=>{
      const sAge = (d.start.getTime()-dobDate.getTime())/(365.25*24*3600*1000);
      const eAge = Math.min((d.end.getTime()-dobDate.getTime())/(365.25*24*3600*1000), maxAge);
      const pIdx = PLS.indexOf(d.planet);
      const score= scoreYear(d.start.getFullYear()+1);
      return {
        planet:d.planet, start:d.start, end:d.end,
        startAge:Math.max(0,sAge), endAge:eAge,
        score, color:pIdx>=0?PCOL[pIdx]:"#c8a030"
      };
    }).filter(b=>b.endAge>0&&b.startAge<maxAge);
  
    const peak      = [...bands].sort((a,b)=>b.score-a.score)[0];
    const challenge = [...bands].sort((a,b)=>a.score-b.score)[0];
  
    // Area scores
    const activeMD = dashas.find(s=>s.start<=now&&s.end>now) || dashas[0];
    function areaScore(houses:number[]): number {
      let s=50;
      houses.forEach(h=>{
        PLS.forEach(p=>{
          if(planets[p]?.house===h) {
            if(["Jupiter","Venus","Mercury"].includes(p)) s+=7;
            if(["Saturn","Mars"].includes(p))             s-=5;
            if(planets[p].dignity?.includes("Exalted"))   s+=6;
            if(planets[p].dignity?.includes("Debilitated")) s-=8;
          }
        });
      });
      if(planets[activeMD.planet] && houses.includes(planets[activeMD.planet].house)) s+=10;
      return Math.min(95,Math.max(15,Math.round(s)));
    }
  
    const areaData = [
      {name:"Career",      icon:"💼", houses:[10,6,1]},
      {name:"Finance",     icon:"💰", houses:[2,11,8]},
      {name:"Health",      icon:"🏥", houses:[1,6,8]},
      {name:"Relationship",icon:"💑", houses:[7,5,1]},
      {name:"Stability",   icon:"⚓", houses:[4,10,2]},
      {name:"Psychology",  icon:"🧠", houses:[1,4,12]},
    ];
  
    const areas: DestinyArea[] = areaData.map(a=>{
      const score=areaScore(a.houses);
      return {
        name:a.name, icon:a.icon, score,
        status: score>=70?"Strong":score>=50?"Average":"Needs Work",
        color:  score>=70?"#22c55e":score>=50?"#c8a030":"#ef4444",
      };
    });
  
    const currentAge   = Math.floor((now.getTime()-dobDate.getTime())/(365.25*24*3600*1000));
    const currentScore = scoreYear(now.getFullYear());
  
    const summary = `Peak period is ${peak?.planet} Mahadasha (${peak?.start.getFullYear()}–${peak?.end.getFullYear()}) with score ${peak?.score}%. `+
      `Challenge period is ${challenge?.planet} Mahadasha. Current score: ${currentScore}%.`;
  
    return { points, areas, bands, peak, challenge, currentAge, currentScore, currentDasha:activeMD.planet, summary };
  }