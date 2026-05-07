import { computePlanets, getJD, type ChartData, type PlanetData } from "./calculations";

export type SpecialLagnaKey = "AL" | "UL" | "A2" | "A7" | "A10" | "HL" | "GL" | "BL" | "SL";

export interface SpecialLagnaItem {
  key: SpecialLagnaKey;
  name: string;
  shortName: string;
  category: "arudha" | "sunrise" | "sree";
  sign: string;
  signNum: number;
  house: number;
  longitude: number;
  degreeText: string;
  lord: string;
  lordHouse?: number;
  sourceHouse?: number;
  sourceSign?: string;
  meaning: string;
  interpretation: string;
  actionPlan: string[];
}

export interface SpecialLagnaResult {
  items: SpecialLagnaItem[];
  arudhaItems: SpecialLagnaItem[];
  sunriseItems: SpecialLagnaItem[];
  sreeLagna: SpecialLagnaItem;
  sunriseLocal: string;
  sunAtSunrise: number;
  minutesSinceSunrise: number;
  strongestPublicSignal: SpecialLagnaItem;
  aiContext: string;
  summary: string;
}

const RASHIS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGN_LORDS: Record<number, string> = {
  0: "Mars",
  1: "Venus",
  2: "Mercury",
  3: "Moon",
  4: "Sun",
  5: "Mercury",
  6: "Venus",
  7: "Mars",
  8: "Jupiter",
  9: "Saturn",
  10: "Saturn",
  11: "Jupiter",
};

const META: Record<SpecialLagnaKey, Omit<SpecialLagnaItem, "sign" | "signNum" | "house" | "longitude" | "degreeText" | "lord" | "lordHouse" | "sourceHouse" | "sourceSign">> = {
  AL: {
    key: "AL",
    name: "Arudha Lagna",
    shortName: "A1",
    category: "arudha",
    meaning: "Public image, visible personality and how the world perceives the native.",
    interpretation: "Arudha Lagna shows the projected self. It is less about inner identity and more about reputation, visibility, social impression and the material mirror of the chart.",
    actionPlan: ["Align public image with real strengths.", "Avoid reputation damage through impulsive speech.", "Use AL sign qualities in branding and leadership."],
  },
  UL: {
    key: "UL",
    name: "Upapada Lagna",
    shortName: "UL",
    category: "arudha",
    meaning: "Marriage karma, spouse pattern and the visible doorway into long-term partnership.",
    interpretation: "Upapada is the arudha of the 12th house. It shows the image and karmic field around marriage, spouse expectations, commitment and sacrifice in relationship.",
    actionPlan: ["Study UL with Venus, Jupiter and 7th house.", "Use patience in partnership decisions.", "Strengthen relationship karma through respectful conduct."],
  },
  A2: {
    key: "A2",
    name: "Dhana Pada",
    shortName: "A2",
    category: "arudha",
    meaning: "Perceived wealth, family status, speech image and social value.",
    interpretation: "A2 shows how wealth and family identity appear externally. It is useful for money branding, family image, savings discipline and value perception.",
    actionPlan: ["Build visible financial credibility.", "Keep speech refined.", "Avoid showing wealth in unstable or ego-driven ways."],
  },
  A7: {
    key: "A7",
    name: "Dara Pada",
    shortName: "A7",
    category: "arudha",
    meaning: "Public partnership image, business alliances and visible relationship dynamics.",
    interpretation: "A7 shows how partnerships appear to others. It is important for marriage perception, clients, public alliances and business partnership reputation.",
    actionPlan: ["Choose public alliances carefully.", "Keep partnership agreements clean.", "Repair relationship image with maturity."],
  },
  A10: {
    key: "A10",
    name: "Karma Pada",
    shortName: "A10",
    category: "arudha",
    meaning: "Career fame, authority image, public role and professional visibility.",
    interpretation: "A10 shows the career image and the way authority, status and achievement are perceived. It is a strong career branding signal.",
    actionPlan: ["Use A10 sign qualities in career positioning.", "Build proof of work publicly.", "Avoid professional inconsistency."],
  },
  HL: {
    key: "HL",
    name: "Hora Lagna",
    shortName: "HL",
    category: "sunrise",
    meaning: "Wealth, prosperity drive and material resource flow.",
    interpretation: "Hora Lagna is a prosperity lagna calculated from sunrise. It helps judge earning instinct, material initiative and wealth-building style.",
    actionPlan: ["Use HL sign qualities for wealth creation.", "Track wealth periods with dasha and transit.", "Keep money action practical and consistent."],
  },
  GL: {
    key: "GL",
    name: "Ghati Lagna",
    shortName: "GL",
    category: "sunrise",
    meaning: "Power, influence, fame, authority and public command.",
    interpretation: "Ghati Lagna moves quickly from sunrise and is used for authority, visibility and capacity to influence the world.",
    actionPlan: ["Use GL sign for leadership style.", "Choose authority roles consciously.", "Avoid power struggles when GL is afflicted."],
  },
  BL: {
    key: "BL",
    name: "Bhava Lagna",
    shortName: "BL",
    category: "sunrise",
    meaning: "Embodied life direction, practical temperament and how the body enters daily action.",
    interpretation: "Bhava Lagna is a sunrise-based lagna that reflects practical expression and the day-to-day embodiment of chart energy.",
    actionPlan: ["Use BL sign for lifestyle alignment.", "Strengthen daily routine.", "Watch body signals during stressful dashas."],
  },
  SL: {
    key: "SL",
    name: "Sree Lagna",
    shortName: "SL",
    category: "sree",
    meaning: "Prosperity grace, fortune flow, Lakshmi factor and subtle abundance.",
    interpretation: "Sree Lagna combines Lagna with Moon's nakshatra progress. It shows the subtle channel through which prosperity, beauty and fortune can arrive.",
    actionPlan: ["Respect SL lord and sign.", "Use gratitude and clean wealth practices.", "Avoid blocking prosperity through fear or disorder."],
  },
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function signFromLon(lon: number) {
  return Math.floor(mod(lon, 360) / 30);
}

function houseFromSign(lagnaNum: number, signNum: number) {
  return mod(signNum - lagnaNum, 12) + 1;
}

function degreeText(lon: number) {
  const normalized = mod(lon, 360);
  const degree = normalized % 30;
  const deg = Math.floor(degree);
  const min = Math.floor((degree - deg) * 60);
  return `${deg}° ${String(min).padStart(2, "0")}'`;
}

function decimalToTime(hours: number) {
  const h = Math.floor(mod(hours, 24));
  const m = Math.round((mod(hours, 24) - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m === 60 ? 0 : m).padStart(2, "0")}`;
}

function calcSunriseLocal(date: string, lat: number, lon: number, tz: number) {
  const jd = getJD(date, "12:00", 0);
  const d2r = Math.PI / 180;
  const n = jd - 2451545.0;
  const l = mod(280.46 + 0.9856474 * n, 360);
  const g = mod(357.528 + 0.9856003 * n, 360);
  const lam = mod(l + 1.915 * Math.sin(g * d2r) + 0.02 * Math.sin(2 * g * d2r), 360);
  const eps = 23.439 - 0.0000004 * n;
  const sinDec = Math.sin(eps * d2r) * Math.sin(lam * d2r);
  const dec = Math.asin(sinDec) / d2r;
  const cosH =
    (Math.sin(-0.8333 * d2r) - Math.sin(lat * d2r) * Math.sin(dec * d2r)) /
    (Math.cos(lat * d2r) * Math.cos(dec * d2r));
  if (Math.abs(cosH) > 1) return 6;
  const h = Math.acos(cosH) / d2r;
  const ra = Math.atan2(Math.cos(eps * d2r) * Math.sin(lam * d2r), Math.cos(lam * d2r)) / d2r;
  const gmst = mod(6.697375 + 0.0657098242 * n, 24);
  const transit = mod(ra / 15 - lon / 15 - gmst, 24);
  return mod(transit - h / 15 + tz, 24);
}

function makeItem(key: SpecialLagnaKey, lon: number, chart: ChartData, extra?: Partial<SpecialLagnaItem>): SpecialLagnaItem {
  const signNum = signFromLon(lon);
  return {
    ...META[key],
    sign: RASHIS[signNum],
    signNum,
    house: houseFromSign(chart.lagnaNum, signNum),
    longitude: Number(mod(lon, 360).toFixed(4)),
    degreeText: degreeText(lon),
    lord: SIGN_LORDS[signNum],
    ...extra,
  };
}

function arudhaLagna(sourceHouse: number, key: SpecialLagnaKey, chart: ChartData): SpecialLagnaItem {
  const houseSign = mod(chart.lagnaNum + sourceHouse - 1, 12);
  const lord = SIGN_LORDS[houseSign];
  const lordPlanet = chart.planets[lord] as PlanetData | undefined;
  const lordSign = lordPlanet?.signNum ?? houseSign;
  const distance = mod(lordSign - houseSign, 12) + 1;
  let arudhaSign = mod(lordSign + distance - 1, 12);
  const relative = mod(arudhaSign - houseSign, 12);

  if (relative === 0 || relative === 6) {
    arudhaSign = mod(arudhaSign + 9, 12);
  }

  return makeItem(key, arudhaSign * 30, chart, {
    lord,
    lordHouse: lordPlanet?.house,
    sourceHouse,
    sourceSign: RASHIS[houseSign],
  });
}

function sreeLagna(chart: ChartData) {
  const moonLon = chart.planets.Moon?.lon ?? 0;
  const nakSpan = 360 / 27;
  const nakStart = Math.floor(mod(moonLon, 360) / nakSpan) * nakSpan;
  const fraction = (mod(moonLon, 360) - nakStart) / nakSpan;
  return mod(chart.lagnaLon + fraction * 360, 360);
}

export function calculateSpecialLagnas(chart: ChartData): SpecialLagnaResult {
  const birthLocalParts = chart.tob.split(":").map(Number);
  const birthLocal = (birthLocalParts[0] || 0) + (birthLocalParts[1] || 0) / 60;
  const sunriseLocalRaw = calcSunriseLocal(chart.dob, chart.lat, chart.lon, chart.tz);
  const minutesSinceSunrise = (birthLocal - sunriseLocalRaw + (birthLocal < sunriseLocalRaw ? 24 : 0)) * 60;
  const sunriseLocal = decimalToTime(sunriseLocalRaw);
  const sunAtSunrise = computePlanets(getJD(chart.dob, sunriseLocal, chart.tz)).Sun;

  const arudhaItems = [
    arudhaLagna(1, "AL", chart),
    arudhaLagna(12, "UL", chart),
    arudhaLagna(2, "A2", chart),
    arudhaLagna(7, "A7", chart),
    arudhaLagna(10, "A10", chart),
  ];

  const sunriseItems = [
    makeItem("HL", sunAtSunrise + minutesSinceSunrise * 0.5, chart),
    makeItem("GL", sunAtSunrise + minutesSinceSunrise * 1.25, chart),
    makeItem("BL", sunAtSunrise + minutesSinceSunrise, chart),
  ];

  const sl = makeItem("SL", sreeLagna(chart), chart);
  const items = [...arudhaItems, ...sunriseItems, sl];
  const strongestPublicSignal = arudhaItems.find((item) => item.key === "A10") ?? items[0];
  const summary = `Special Lagnas show public image, wealth, authority, marriage image and prosperity channels. AL is ${items[0].sign}, UL is ${items[1].sign}, A10 is ${strongestPublicSignal.sign}, Sree Lagna is ${sl.sign}.`;

  return {
    items,
    arudhaItems,
    sunriseItems,
    sreeLagna: sl,
    sunriseLocal,
    sunAtSunrise: Number(sunAtSunrise.toFixed(4)),
    minutesSinceSunrise: Number(minutesSinceSunrise.toFixed(1)),
    strongestPublicSignal,
    summary,
    aiContext: `${summary} Hora Lagna ${sunriseItems[0].sign} supports wealth style. Ghati Lagna ${sunriseItems[1].sign} shows authority style. Bhava Lagna ${sunriseItems[2].sign} shows embodied daily expression.`,
  };
}
