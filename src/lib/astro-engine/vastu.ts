// ============================================================
// ASTROLIFE ASTRO-VASTU ENGINE v1.0
// MahaVastu 16-Zone System — extracted from AstroLife legacy HTML
// Planet-Direction Mapping · Zone Scoring · Remedies · Psych Bridge
// ============================================================

export interface VastuZone {
  dir:      string;
  deg:      number;
  name:     string;
  planet:   string;
  element:  string;
  deity:    string;
  domain:   string;
  color:    string;
  house:    number;
  score:    number;
  status:   "Strong" | "Average" | "Weak";
  statusColor: string;
  planets:  string[];
  remedy:   string;
  roomIdeal:string;
  hasDosha: boolean;
}

export interface VastuResult {
  zones:         VastuZone[];
  strongZones:   VastuZone[];
  weakZones:     VastuZone[];
  overallScore:  number;
  houseMap:      { house: number; dir: string; planets: string[] }[];
  psychBridge:   string[];
  roomGuide:     { room: string; idealDir: string; reason: string }[];
  transitAlerts: { planet: string; zone: string; domain: string; effect: string; remedy: string; positive: boolean }[];
}

interface PlanetData { house: number; dignity: string; retrograde: boolean; lon?: number; }

const PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const BENEFICS = ["Jupiter","Venus","Mercury","Moon","Sun"];
const MALEFICS = ["Saturn","Mars","Rahu","Ketu"];

export const VASTU_ZONES_DEF = [
  { dir:"N",   deg:348.75, name:"North",     planet:"Mercury", element:"Water",       deity:"Kubera",      domain:"Wealth, Opportunity, Finance",       color:"#22c55e", house:4  },
  { dir:"NNE", deg:11.25,  name:"North-NE",  planet:"Jupiter", element:"Water+Air",   deity:"Shiva",       domain:"Knowledge, Health, Immunity",        color:"#4ade80", house:9  },
  { dir:"NE",  deg:33.75,  name:"North-East",planet:"Jupiter", element:"Water",       deity:"Isha (Shiva)",domain:"Spirituality, Wisdom, Blessings",    color:"#06b6d4", house:1  },
  { dir:"ENE", deg:56.25,  name:"East-NE",   planet:"Sun",     element:"Air+Fire",    deity:"Parjanya",    domain:"Health, Growth, New Beginnings",     color:"#f59e0b", house:1  },
  { dir:"E",   deg:78.75,  name:"East",      planet:"Sun",     element:"Air",         deity:"Indra",       domain:"Growth, Prosperity, Activity",       color:"#f97316", house:1  },
  { dir:"ESE", deg:101.25, name:"East-SE",   planet:"Venus",   element:"Fire+Air",    deity:"Vitatha",     domain:"Social Success, Relationships",      color:"#ec4899", house:7  },
  { dir:"SE",  deg:123.75, name:"South-East",planet:"Venus",   element:"Fire",        deity:"Agni",        domain:"Wealth, Fire, Energy, Kitchen",      color:"#ef4444", house:2  },
  { dir:"SSE", deg:146.25, name:"South-SE",  planet:"Mars",    element:"Fire+Earth",  deity:"Grihakshat",  domain:"Confidence, Power, Boldness",        color:"#f87171", house:3  },
  { dir:"S",   deg:168.75, name:"South",     planet:"Mars",    element:"Fire",        deity:"Yama",        domain:"Fame, Discipline, Career Recognition",color:"#dc2626", house:10 },
  { dir:"SSW", deg:191.25, name:"South-SW",  planet:"Rahu",    element:"Earth+Fire",  deity:"Mrigasthana", domain:"Ancestors, Hidden Energy",           color:"#a78bfa", house:8  },
  { dir:"SW",  deg:213.75, name:"South-West",planet:"Rahu",    element:"Earth",       deity:"Nairriti",    domain:"Stability, Relationships, Longevity",color:"#7c3aed", house:7  },
  { dir:"WSW", deg:236.25, name:"West-SW",   planet:"Saturn",  element:"Space+Earth", deity:"Varuna",      domain:"Profits, Gains, Legacy",             color:"#60a5fa", house:11 },
  { dir:"W",   deg:258.75, name:"West",      planet:"Saturn",  element:"Space",       deity:"Varuna",      domain:"Networking, Profits, Results",       color:"#3b82f6", house:7  },
  { dir:"WNW", deg:281.25, name:"West-NW",   planet:"Moon",    element:"Air+Space",   deity:"Shosha",      domain:"Movement, Freshness, Guests",        color:"#c084fc", house:3  },
  { dir:"NW",  deg:303.75, name:"North-West",planet:"Moon",    element:"Air",         deity:"Vayu",        domain:"Travel, Support, Social Connections",color:"#a855f7", house:3  },
  { dir:"NNW", deg:326.25, name:"North-NW",  planet:"Mercury", element:"Water+Air",   deity:"Mukhya",      domain:"Income, Vitality, Savings",          color:"#34d399", house:11 },
] as const;

const HOUSE_DIR: Record<number, string> = {
  1:"East", 2:"South-East", 3:"South", 4:"North", 5:"North-East",
  6:"South", 7:"West", 8:"South-West", 9:"North-East", 10:"South",
  11:"North-West", 12:"West",
};

const ZONE_REMEDIES: Record<string, string> = {
  N:   "Keep North clutter-free. Green plants & water feature. Kubera yantra.",
  NNE: "Study or meditation room. Light yellow lamp on Thursday.",
  NE:  "Sacred puja spot. Temple/mandir ideal. Never toilet or kitchen here.",
  ENE: "Ventilation & sunrise light. No heavy furniture blocking morning sun.",
  E:   "Keep East open. Morning light must enter. No bathroom in East.",
  ESE: "Social area. Pink/white colors. Venus yantra. Flowers here.",
  SE:  "Kitchen ideal here. Red/orange colors. Agni yantra. Fire element.",
  SSE: "Exercise or gym area. Red/orange tones. Remove obstacles.",
  S:   "Fame wall — display awards, photos, achievements. No main door.",
  SSW: "Ancestors photo here. Purple/maroon. Keep heavy & closed.",
  SW:  "Master bedroom ideal. Heavy furniture. No toilet/kitchen. Very important zone.",
  WSW: "Savings & study. Keep organized. No clutter.",
  W:   "Living room or dining. Saturn yantra. Iron objects beneficial.",
  WNW: "Guest room. Keep moving, fresh energy.",
  NW:  "Movement zone — vehicles, social. Moon yantra. Keep active.",
  NNW: "Income corner. Mercury yantra. Keep organized & energized.",
};

const ZONE_ROOMS: Record<string, string> = {
  N:   "Home Office / Study", NNE:"Meditation / Prayer", NE:"Puja Room / Temple",
  ENE:"Children's Room",     E:  "Master Bedroom",      ESE:"Living Room",
  SE: "Kitchen",             SSE:"Gym / Exercise",      S:  "Storage / Study",
  SSW:"Ancestors Corner",    SW: "Master Bedroom",      WSW:"Savings Room",
  W:  "Dining Room",         WNW:"Guest Bedroom",       NW: "Garage / Vehicles",
  NNW:"Cash / Locker Room",
};

function scoreZone(zone: typeof VASTU_ZONES_DEF[number], planets: Record<string, PlanetData>): number {
  let score = 50;
  const h = zone.house;

  // Planets occupying this zone's house
  PLANETS.forEach(p => {
    if (planets[p]?.house === h) {
      if (BENEFICS.includes(p)) score += 8;
      if (MALEFICS.includes(p)) score -= 6;
      if (planets[p].dignity?.includes("Exalted"))    score += 6;
      if (planets[p].dignity?.includes("Debilitated")) score -= 8;
    }
  });

  // Ruling planet of this zone
  const ruler = planets[zone.planet];
  if (ruler) {
    if ([1,4,7,10].includes(ruler.house)) score += 7;
    if ([6,8,12].includes(ruler.house))  score -= 7;
    if (ruler.dignity?.includes("Exalted"))    score += 5;
    if (ruler.dignity?.includes("Debilitated")) score -= 8;
    if (ruler.retrograde) score -= 4;
  }

  return Math.min(92, Math.max(15, Math.round(score)));
}

function psychBridge(planets: Record<string, PlanetData>): string[] {
  const insights: string[] = [];
  if (planets.Saturn?.house === 7 || planets.Saturn?.house === 1)
    insights.push(`Saturn in H${planets.Saturn.house} → West/East zone pressure → Fear of relationships, control patterns, difficulty trusting.`);
  if (planets.Rahu?.house <= 6)
    insights.push(`Rahu in H${planets.Rahu.house} → SW/S zone obsession → Career/status obsession, ancestral karma, instability drive.`);
  if ([12,6,8].includes(planets.Moon?.house))
    insights.push(`Moon in H${planets.Moon.house} → Emotional zone weakness → Anxiety patterns, emotional memory loops, mother-related psychology.`);
  if ([3,6,11].includes(planets.Jupiter?.house))
    insights.push(`Jupiter in H${planets.Jupiter.house} → NE/N zone → Belief system needs rebuilding. Over-expansion tendency.`);
  if ([6,8,12].includes(planets.Venus?.house))
    insights.push(`Venus in H${planets.Venus.house} → SE/ESE weakness → Relationship & creative energy blocked. Social confidence issues.`);
  if ([8,12].includes(planets.Sun?.house))
    insights.push(`Sun in H${planets.Sun.house} → East zone dimmed → Father/authority conflicts, identity confusion, self-confidence blocks.`);
  if (insights.length === 0)
    insights.push("No major Vastu-psychology stress patterns detected. Your planetary configuration supports balanced zone energies.");
  return insights;
}

export function calculateVastu(planets: Record<string, PlanetData>): VastuResult {
  const zones: VastuZone[] = VASTU_ZONES_DEF.map(z => {
    const score = scoreZone(z, planets);
    const status = score >= 70 ? "Strong" : score >= 50 ? "Average" : "Weak";
    const statusColor = score >= 70 ? "#22c55e" : score >= 50 ? "#c8a030" : "#ef4444";
    const planetsHere = PLANETS.filter(p => planets[p]?.house === z.house);
    const hasDosha = score < 50 || planetsHere.some(p => MALEFICS.includes(p));

    return {
      dir: z.dir, deg: z.deg, name: z.name,
      planet: z.planet, element: z.element, deity: z.deity,
      domain: z.domain, color: z.color, house: z.house,
      score, status, statusColor, planets: planetsHere,
      remedy: score < 50
        ? `⚠️ Critical: ${ZONE_REMEDIES[z.dir]} + Worship ${z.deity} on ${z.planet} day.`
        : ZONE_REMEDIES[z.dir],
      roomIdeal: ZONE_ROOMS[z.dir],
      hasDosha,
    };
  });

  const strongZones = zones.filter(z => z.status === "Strong");
  const weakZones   = zones.filter(z => z.status === "Weak");
  const overallScore = Math.round(zones.reduce((s, z) => s + z.score, 0) / zones.length);

  const houseMap = Array.from({length:12}, (_,i) => ({
    house: i + 1,
    dir: HOUSE_DIR[i + 1],
    planets: PLANETS.filter(p => planets[p]?.house === i + 1),
  }));

  // Transit alerts (based on current date + chart positions — simplified)
  const transitAlerts: VastuResult["transitAlerts"] = [];
  PLANETS.slice(0, 7).forEach(p => {
    const h = planets[p]?.house;
    if (!h) return;
    const dir = HOUSE_DIR[h];
    const zone = zones.find(z => z.name === dir || z.dir === dir);
    if (!zone) return;
    const isStress = MALEFICS.includes(p);
    const isBoost  = ["Jupiter","Venus"].includes(p);
    if (isStress) {
      const effectMap: Record<string,string> = {
        Saturn:"structural issues, cold/damp, karmic delays",
        Mars:"fire hazards, disputes, accidents",
        Rahu:"leakages, hidden cracks, unusual events",
      };
      const remedyMap: Record<string,string> = {
        Saturn:"Black sesame oil lamp in that zone every Saturday",
        Mars:"Red triangular cloth in that zone every Tuesday",
        Rahu:"Coal piece in that corner, Saturday ritual",
      };
      transitAlerts.push({ planet:p, zone:zone.name, domain:zone.domain, effect:effectMap[p]||"zone imbalance", remedy:remedyMap[p]||"Cleanse & energize zone", positive:false });
    } else if (isBoost) {
      const boostMap: Record<string,string> = {
        Jupiter:"Yellow flowers, turmeric Thursday ritual",
        Venus:"White flowers, crystal bowl with water Friday",
      };
      transitAlerts.push({ planet:p, zone:zone.name, domain:zone.domain, effect:`${zone.domain} energized`, remedy:boostMap[p]||"Enhance with natural elements", positive:true });
    }
  });

  const roomGuide: VastuResult["roomGuide"] = [
    { room:"Master Bedroom",  idealDir:"South-West (SW)", reason:"SW = stability, longevity & relationships. Heaviest zone — anchors the household." },
    { room:"Puja / Prayer",   idealDir:"North-East (NE)", reason:"NE = Ishan Kona — most sacred zone. Jupiter & Shiva energy. Never put toilet here." },
    { room:"Kitchen",         idealDir:"South-East (SE)", reason:"SE = Agni (fire) zone. Venus rules. Ideal for cooking & fire-related activities." },
    { room:"Study / Office",  idealDir:"North (N)",        reason:"N = Kubera's zone. Mercury rules finance & intellect. Study here for best results." },
    { room:"Children's Room", idealDir:"North-East (NE)",  reason:"NE promotes wisdom, health & growth — perfect for children's learning." },
    { room:"Guest Room",      idealDir:"North-West (NW)",  reason:"NW = movement zone. Guests come & go. Moon energy keeps it fresh & welcoming." },
    { room:"Dining Room",     idealDir:"West (W)",          reason:"W = Saturn zone. Steady nourishment, results of hard work — ideal for family meals." },
    { room:"Garage / Store",  idealDir:"North-West (NW)", reason:"NW = movement & vehicles. Saturn's discipline maintains organized storage." },
    { room:"Cash / Locker",   idealDir:"North-NW (NNW)",  reason:"NNW = income & savings zone. Mercury governs wealth here." },
  ];

  return { zones, strongZones, weakZones, overallScore, houseMap, psychBridge: psychBridge(planets), roomGuide, transitAlerts };
}
