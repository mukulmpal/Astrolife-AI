import { computePlanets, getJD } from "./calculations";
import { assertPanchangResultContract } from "./contracts";

export type PanchangQuality = "Auspicious" | "Mixed" | "Caution" | "Sensitive";

export interface PanchangGuidance {
  nature: PanchangQuality;
  goodFor: string[];
  avoid: string[];
  remedy: string;
  explanation: string;
}

export interface PanchangWindow {
  name: string;
  start: string;
  end: string;
  quality: PanchangQuality;
  guidance: string;
}

export interface PanchangResult {
  date: string;
  weekday: string;
  varaLord: string;
  tithi: string;
  paksha: "Shukla" | "Krishna";
  tithiNumber: number;
  tithiEnd: string;
  tithiGuidance: PanchangGuidance;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  nakshatraEnd: string;
  nakshatraGuidance: PanchangGuidance;
  yoga: string;
  yogaEnd: string;
  yogaGuidance: PanchangGuidance;
  karana: string;
  karanaEnd: string;
  moonSign: string;
  sunSign: string;
  moonLongitude: number;
  sunLongitude: number;
  sunrise: string;
  sunset: string;
  sunriseAssumed: string;
  rahuKaal: PanchangWindow;
  gulikaKaal: PanchangWindow;
  yamaganda: PanchangWindow;
  abhijitMuhurta: PanchangWindow;
  currentHora: string;
  currentHoraLord: string;
  nextHoraLord: string;
  shubhKarya: string[];
  avoidKarya: string[];
  aiContext: string;
  notes: string[];
}

const TITHIS = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

const VARA_LORD: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Moon",
  Tuesday: "Mars",
  Wednesday: "Mercury",
  Thursday: "Jupiter",
  Friday: "Venus",
  Saturday: "Saturn",
};

const YOGAS = [
  "Vishkumbha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
  "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana",
  "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha",
  "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];

const KARANAS = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti",
  "Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti",
  "Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti",
  "Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti",
  "Shakuni", "Chatushpada", "Naga", "Kimstughna",
];

const HORA_ORDER: Record<string, string[]> = {
  Sunday: ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"],
  Monday: ["Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury"],
  Tuesday: ["Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter"],
  Wednesday: ["Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus"],
  Thursday: ["Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn"],
  Friday: ["Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun"],
  Saturday: ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"],
};

const RAHU_SLOT: Record<string, number> = {
  Sunday: 8,
  Monday: 2,
  Tuesday: 7,
  Wednesday: 5,
  Thursday: 6,
  Friday: 4,
  Saturday: 3,
};

const GULIKA_SLOT: Record<string, number> = {
  Sunday: 6,
  Monday: 5,
  Tuesday: 4,
  Wednesday: 3,
  Thursday: 2,
  Friday: 1,
  Saturday: 7,
};

const YAMAGANDA_SLOT: Record<string, number> = {
  Sunday: 5,
  Monday: 4,
  Tuesday: 3,
  Wednesday: 2,
  Thursday: 1,
  Friday: 7,
  Saturday: 6,
};

const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function rashiFromLon(lon: number): string {
  return RASHIS[Math.floor(mod(lon, 360) / 30)];
}

function weekdayName(date: Date): string {
  return date.toLocaleDateString("en-IN", { weekday: "long" });
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function dateStringAtTimezone(date: Date, tz: number) {
  const shifted = new Date(date.getTime() + tz * 60 * 60 * 1000);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
}

function decimalHoursToTime(hours: number) {
  const normalized = mod(hours, 24);
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  const adjustedH = m === 60 ? h + 1 : h;
  const adjustedM = m === 60 ? 0 : m;
  return `${pad2(mod(adjustedH, 24))}:${pad2(adjustedM)}`;
}

function timeToDecimal(time: string) {
  const [h, m] = time.split(":").map((part) => Number.parseInt(part, 10));
  return (Number.isFinite(h) ? h : 6) + (Number.isFinite(m) ? m : 0) / 60;
}

function addMinutes(time: string, minutes: number) {
  return decimalHoursToTime(timeToDecimal(time) + minutes / 60);
}

function formatWindow(name: string, start: number, end: number, quality: PanchangQuality, guidance: string): PanchangWindow {
  return {
    name,
    start: decimalHoursToTime(start),
    end: decimalHoursToTime(end),
    quality,
    guidance,
  };
}

function calculateSunWindow(date: Date, lat?: number, lon?: number, tz = 5.5) {
  if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return { sunrise: "06:00", sunset: "18:00", assumed: true };
  }

  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const lngHour = lon / 15;
  const zenith = 90.833;
  const calc = (isRise: boolean) => {
    const t = dayOfYear + ((isRise ? 6 : 18) - lngHour) / 24;
    const meanAnomaly = 0.9856 * t - 3.289;
    let trueLon =
      meanAnomaly +
      1.916 * Math.sin((Math.PI / 180) * meanAnomaly) +
      0.02 * Math.sin((Math.PI / 180) * 2 * meanAnomaly) +
      282.634;
    trueLon = mod(trueLon, 360);

    let rightAscension = (180 / Math.PI) * Math.atan(0.91764 * Math.tan((Math.PI / 180) * trueLon));
    rightAscension = mod(rightAscension, 360);
    rightAscension += Math.floor(trueLon / 90) * 90 - Math.floor(rightAscension / 90) * 90;
    rightAscension /= 15;

    const sinDec = 0.39782 * Math.sin((Math.PI / 180) * trueLon);
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH =
      (Math.cos((Math.PI / 180) * zenith) - sinDec * Math.sin((Math.PI / 180) * lat)) /
      (cosDec * Math.cos((Math.PI / 180) * lat));

    if (cosH < -1 || cosH > 1) return isRise ? 6 : 18;
    const hourAngle = isRise ? 360 - (180 / Math.PI) * Math.acos(cosH) : (180 / Math.PI) * Math.acos(cosH);
    const localMeanTime = hourAngle / 15 + rightAscension - 0.06571 * t - 6.622;
    return mod(localMeanTime - lngHour + tz, 24);
  };

  return {
    sunrise: decimalHoursToTime(calc(true)),
    sunset: decimalHoursToTime(calc(false)),
    assumed: false,
  };
}

function daylightWindow(name: string, weekday: string, slotMap: Record<string, number>, sunrise: string, sunset: string, quality: PanchangQuality, guidance: string) {
  const start = timeToDecimal(sunrise);
  const daylight = timeToDecimal(sunset) - start;
  const slotLength = daylight > 0 ? daylight / 8 : 1.5;
  const slot = slotMap[weekday] ?? 1;
  return formatWindow(name, start + (slot - 1) * slotLength, start + slot * slotLength, quality, guidance);
}

function getEndTime(
  dateString: string,
  tz: number,
  currentIndex: number,
  size: number,
  selector: (sunLon: number, moonLon: number) => number,
  fallback = "Next day"
) {
  const startJd = getJD(dateString, "12:00", tz);
  let previousOffset = 0;
  for (let offset = 0.25; offset <= 48; offset += 0.25) {
    const jd = startJd + offset / 24;
    const planets = computePlanets(jd);
    const nextIndex = Math.floor(selector(planets.Sun, planets.Moon) / size);
    if (nextIndex !== currentIndex) {
      let lo = previousOffset;
      let hi = offset;
      for (let i = 0; i < 12; i += 1) {
        const mid = (lo + hi) / 2;
        const midPlanets = computePlanets(startJd + mid / 24);
        const midIndex = Math.floor(selector(midPlanets.Sun, midPlanets.Moon) / size);
        if (midIndex === currentIndex) lo = mid;
        else hi = mid;
      }
      return addMinutes("12:00", hi * 60);
    }
    previousOffset = offset;
  }
  return fallback;
}

function tithiGuidance(tithi: string): PanchangGuidance {
  const map: Record<string, PanchangGuidance> = {
    Pratipada: { nature: "Mixed", goodFor: ["Planning", "gentle starts", "home reset"], avoid: ["rushed travel"], remedy: "Light a simple ghee diya before starting work.", explanation: "Pratipada starts the lunar flow, so it supports initiation after clarity." },
    Dvitiya: { nature: "Auspicious", goodFor: ["partnerships", "business talks", "travel"], avoid: ["surgery unless urgent"], remedy: "Offer water and keep speech balanced.", explanation: "Dvitiya is steady and relationship-friendly." },
    Tritiya: { nature: "Auspicious", goodFor: ["learning", "communication", "creative work"], avoid: ["ego clashes"], remedy: "Donate stationery or help a student.", explanation: "Tritiya supports skill, courage and expression." },
    Chaturthi: { nature: "Caution", goodFor: ["Ganesh puja", "problem solving", "remedies"], avoid: ["major new ventures", "marriage"], remedy: "Chant Om Gam Ganapataye Namah 108 times.", explanation: "Chaturthi is obstacle-clearing, not ideal for careless launches." },
    Panchami: { nature: "Auspicious", goodFor: ["medicine", "learning", "healing"], avoid: ["unnecessary conflict"], remedy: "Offer green food or fruit in charity.", explanation: "Panchami supports recovery, wisdom and gentle correction." },
    Shashthi: { nature: "Mixed", goodFor: ["competition", "discipline", "fitness"], avoid: ["soft negotiations"], remedy: "Worship Kartikeya or Hanuman with a calm mind.", explanation: "Shashthi gives strength, but it can be combative." },
    Saptami: { nature: "Auspicious", goodFor: ["travel", "vehicles", "authority work"], avoid: ["arrogance"], remedy: "Offer water to Surya.", explanation: "Saptami carries solar vitality and forward motion." },
    Ashtami: { nature: "Sensitive", goodFor: ["Durga worship", "inner courage", "shadow work"], avoid: ["marriage", "major purchases"], remedy: "Offer red flowers to Devi or recite protective mantra.", explanation: "Ashtami is intense and better for protection than celebration." },
    Navami: { nature: "Sensitive", goodFor: ["Devi worship", "ancestral prayer", "closure"], avoid: ["new work", "casual travel"], remedy: "Keep speech soft and donate food.", explanation: "Navami can bring heat and emotional sharpness." },
    Dashami: { nature: "Auspicious", goodFor: ["career", "property", "education", "public work"], avoid: ["none major"], remedy: "Begin with gratitude to elders.", explanation: "Dashami supports visible success and social action." },
    Ekadashi: { nature: "Auspicious", goodFor: ["fasting", "Vishnu worship", "charity"], avoid: ["overindulgence", "heavy food"], remedy: "Chant Om Namo Bhagavate Vasudevaya.", explanation: "Ekadashi is excellent for purification and spiritual discipline." },
    Dwadashi: { nature: "Auspicious", goodFor: ["breaking fast", "donations", "restoration"], avoid: ["wasteful habits"], remedy: "Feed someone or offer sattvic food.", explanation: "Dwadashi restores balance after Ekadashi." },
    Trayodashi: { nature: "Auspicious", goodFor: ["beauty", "relationship repair", "arts"], avoid: ["financial excess"], remedy: "Offer white flowers or keep surroundings clean.", explanation: "Trayodashi has Venus-like refinement and softness." },
    Chaturdashi: { nature: "Sensitive", goodFor: ["Shiva worship", "remedies", "release work"], avoid: ["marriage", "auspicious launches"], remedy: "Chant Mahamrityunjaya mantra.", explanation: "Chaturdashi is powerful but sharp; use it for surrender and protection." },
    "Purnima/Amavasya": { nature: "Mixed", goodFor: ["meditation", "charity", "ancestral work"], avoid: ["impulsive emotional decisions"], remedy: "Do grounding prayer and keep food simple.", explanation: "Full and dark moon points intensify the mind and subtle body." },
  };
  return map[tithi] ?? map.Pratipada;
}

function nakshatraGuidance(nakshatra: string, lord: string): PanchangGuidance {
  const gentle = ["Rohini", "Mrigashira", "Punarvasu", "Pushya", "Hasta", "Anuradha", "Shravana", "Revati"];
  const sharp = ["Ardra", "Ashlesha", "Jyeshtha", "Mula", "Shatabhisha"];
  const nature: PanchangQuality = gentle.includes(nakshatra) ? "Auspicious" : sharp.includes(nakshatra) ? "Sensitive" : "Mixed";
  return {
    nature,
    goodFor: nature === "Auspicious" ? ["learning", "healing", "relationship repair"] : ["focused work", "inner correction", "spiritual practice"],
    avoid: nature === "Sensitive" ? ["careless speech", "risky commitments"] : ["overthinking"],
    remedy: `Respect ${lord} through mantra, charity or disciplined action today.`,
    explanation: `${nakshatra} carries ${lord} energy, so today's emotional tone is filtered through ${lord}'s themes.`,
  };
}

function yogaGuidance(yoga: string): PanchangGuidance {
  const auspicious = ["Saubhagya", "Shobhana", "Sukarma", "Dhriti", "Vriddhi", "Dhruva", "Harshana", "Siddhi", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Preeti", "Ayushman"];
  const sensitive = ["Vishkumbha", "Atiganda", "Shoola", "Ganda", "Vyaghata", "Vajra", "Vyatipata", "Parigha", "Vaidhriti"];
  const nature: PanchangQuality = auspicious.includes(yoga) ? "Auspicious" : sensitive.includes(yoga) ? "Sensitive" : "Mixed";
  return {
    nature,
    goodFor: nature === "Auspicious" ? ["important work", "learning", "constructive decisions"] : ["cleanup", "patience", "remedy work"],
    avoid: nature === "Sensitive" ? ["ego battles", "high-risk commitments"] : ["scattered effort"],
    remedy: nature === "Sensitive" ? "Begin important work after prayer and avoid acting from irritation." : "Use the day with discipline and gratitude.",
    explanation: `${yoga} Yoga colors the subtle quality of the day and modifies how smoothly actions unfold.`,
  };
}

export function calculatePanchang(date = new Date(), tz = 5.5, location?: { lat?: number; lon?: number }): PanchangResult {
  const yyyyMmDd = dateStringAtTimezone(date, tz);
  const jd = getJD(yyyyMmDd, "12:00", tz);
  const planets = computePlanets(jd);

  const sunLon = planets.Sun;
  const moonLon = planets.Moon;
  const moonSun = mod(moonLon - sunLon, 360);

  const tithiIndex = Math.floor(moonSun / 12);
  const tithiNumber = tithiIndex + 1;
  const paksha = tithiNumber <= 15 ? "Shukla" : "Krishna";
  const tithiLabel = TITHIS[tithiIndex % 15];

  const nakIdx = Math.floor(mod(moonLon, 360) / (360 / 27));
  const nakProgress = mod(moonLon, 360) % (360 / 27);
  const nakPada = Math.floor(nakProgress / (360 / 108)) + 1;
  const nakshatra = NAKSHATRAS[nakIdx];
  const nakshatraLord = NAKSHATRA_LORDS[nakIdx];

  const yogaLon = mod(sunLon + moonLon, 360);
  const yogaIdx = Math.floor(yogaLon / (360 / 27));
  const yoga = YOGAS[yogaIdx];

  const karanaIdx = Math.floor(moonSun / 6);
  const karana = KARANAS[mod(karanaIdx, KARANAS.length)];
  const weekday = weekdayName(date);
  const { sunrise, sunset, assumed } = calculateSunWindow(date, location?.lat, location?.lon, tz);
  const varaLord = VARA_LORD[weekday] ?? "Sun";
  const horaOrder = HORA_ORDER[weekday] ?? HORA_ORDER.Sunday;
  const currentHour = Math.floor(mod((date.getTime() + tz * 60 * 60 * 1000) / 3600000, 24));
  const horaIndex = currentHour % horaOrder.length;
  const currentHoraLord = horaOrder[horaIndex];
  const nextHoraLord = horaOrder[(horaIndex + 1) % horaOrder.length];
  const tithiBase = tithiLabel;
  const tithiGuide = tithiGuidance(tithiBase);
  const nakGuide = nakshatraGuidance(nakshatra, nakshatraLord);
  const yogaGuide = yogaGuidance(yoga);
  const rahuKaal = daylightWindow("Rahu Kaal", weekday, RAHU_SLOT, sunrise, sunset, "Sensitive", "Avoid major beginnings, agreements and travel starts.");
  const gulikaKaal = daylightWindow("Gulika Kaal", weekday, GULIKA_SLOT, sunrise, sunset, "Caution", "Use for routine work, not fresh auspicious starts.");
  const yamaganda = daylightWindow("Yamaganda", weekday, YAMAGANDA_SLOT, sunrise, sunset, "Sensitive", "Avoid risky or irreversible decisions.");
  const noon = (timeToDecimal(sunrise) + timeToDecimal(sunset)) / 2;
  const abhijitMuhurta = formatWindow("Abhijit Muhurta", noon - 24 / 60, noon + 24 / 60, "Auspicious", "Good fallback muhurta for many important tasks when other factors are not harsh.");
  const tithiEnd = getEndTime(yyyyMmDd, tz, tithiIndex, 12, (sun, moon) => mod(moon - sun, 360));
  const nakshatraEnd = getEndTime(yyyyMmDd, tz, nakIdx, 360 / 27, (_sun, moon) => mod(moon, 360));
  const yogaEnd = getEndTime(yyyyMmDd, tz, yogaIdx, 360 / 27, (sun, moon) => mod(sun + moon, 360));
  const karanaEnd = getEndTime(yyyyMmDd, tz, karanaIdx, 6, (sun, moon) => mod(moon - sun, 360));
  const shubhKarya = Array.from(new Set([...tithiGuide.goodFor, ...nakGuide.goodFor, ...yogaGuide.goodFor])).slice(0, 6);
  const avoidKarya = Array.from(new Set([...tithiGuide.avoid, ...nakGuide.avoid, ...yogaGuide.avoid])).slice(0, 6);

  const notes: string[] = [];
  if (tithiLabel === "Ekadashi") notes.push("Upvas, mantra aur spiritual sadhana ke liye shubh.");
  if (tithiLabel === "Chaturthi") notes.push("Ganesh upasana aur obstacle-clearing ke liye achha din.");
  if (tithiLabel === "Purnima/Amavasya") notes.push("Emotional intensity high ho sakti hai, grounding zaroor karein.");
  if (nakPada === 4) notes.push("Nakshatra pada-4 emotional closure aur completion tendency dikhata hai.");

  const report = {
    date: yyyyMmDd,
    weekday,
    varaLord,
    tithi: `${tithiLabel} (${tithiNumber}/30)`,
    paksha,
    tithiNumber,
    tithiEnd,
    tithiGuidance: tithiGuide,
    nakshatra,
    nakshatraPada: nakPada,
    nakshatraLord,
    nakshatraEnd,
    nakshatraGuidance: nakGuide,
    yoga,
    yogaEnd,
    yogaGuidance: yogaGuide,
    karana,
    karanaEnd,
    moonSign: rashiFromLon(moonLon),
    sunSign: rashiFromLon(sunLon),
    moonLongitude: Number(moonLon.toFixed(4)),
    sunLongitude: Number(sunLon.toFixed(4)),
    sunrise,
    sunset,
    sunriseAssumed: assumed ? "06:00 (local approx)" : sunrise,
    rahuKaal,
    gulikaKaal,
    yamaganda,
    abhijitMuhurta,
    currentHora: `${currentHoraLord} Hora`,
    currentHoraLord,
    nextHoraLord,
    shubhKarya,
    avoidKarya,
    aiContext: `${weekday} ruled by ${varaLord}. ${paksha} Paksha ${tithiLabel} until ${tithiEnd}. ${nakshatra} Nakshatra Pada ${nakPada}, lord ${nakshatraLord}, until ${nakshatraEnd}. ${yoga} Yoga until ${yogaEnd}. Rahu Kaal ${rahuKaal.start}-${rahuKaal.end}. Abhijit ${abhijitMuhurta.start}-${abhijitMuhurta.end}. Good for: ${shubhKarya.join(", ")}. Avoid: ${avoidKarya.join(", ")}.`,
    notes,
  };

  assertPanchangResultContract(report);
  return report;
}
