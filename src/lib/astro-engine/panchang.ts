import { computePlanets, getJD } from "./calculations";
import { assertPanchangResultContract } from "./contracts";

export interface PanchangResult {
  date: string;
  weekday: string;
  tithi: string;
  paksha: "Shukla" | "Krishna";
  tithiNumber: number;
  nakshatra: string;
  nakshatraPada: number;
  yoga: string;
  karana: string;
  moonSign: string;
  sunSign: string;
  sunriseAssumed: string;
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

export function calculatePanchang(date = new Date(), tz = 5.5): PanchangResult {
  const yyyyMmDd = date.toISOString().split("T")[0];
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

  const yogaLon = mod(sunLon + moonLon, 360);
  const yogaIdx = Math.floor(yogaLon / (360 / 27));

  const karanaIdx = Math.floor(moonSun / 6);
  const karana = KARANAS[mod(karanaIdx, KARANAS.length)];

  const notes: string[] = [];
  if (tithiLabel === "Ekadashi") notes.push("Upvas, mantra aur spiritual sadhana ke liye shubh.");
  if (tithiLabel === "Chaturthi") notes.push("Ganesh upasana aur obstacle-clearing ke liye achha din.");
  if (tithiLabel === "Purnima/Amavasya") notes.push("Emotional intensity high ho sakti hai, grounding zaroor karein.");
  if (nakPada === 4) notes.push("Nakshatra pada-4 emotional closure aur completion tendency dikhata hai.");

  const report = {
    date: yyyyMmDd,
    weekday: weekdayName(date),
    tithi: `${tithiLabel} (${tithiNumber}/30)`,
    paksha,
    tithiNumber,
    nakshatra: NAKSHATRAS[nakIdx],
    nakshatraPada: nakPada,
    yoga: YOGAS[yogaIdx],
    karana,
    moonSign: rashiFromLon(moonLon),
    sunSign: rashiFromLon(sunLon),
    sunriseAssumed: "06:00 (local approx)",
    notes,
  };

  assertPanchangResultContract(report);
  return report;
}
