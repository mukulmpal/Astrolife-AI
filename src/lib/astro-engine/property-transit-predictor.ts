// src/lib/astro-engine/property-transit-predictor.ts
// AstroLife — Authentic Property Timing (4-11-12 vs 3-7-10-5), Saturn 7th House Growth Radar & BNN Transit Conjunctions
// Derived verbatim from the Classical Master Lecture Transcript.

import type { ChartData } from "./calculations";

export interface PropertyPredictionResult {
  timingStatus: "Highly_Favorable_Acquisition" | "Active_Sale_Window" | "Dispute_Blockage_Warning" | "Neutral_Holding";
  headlineHinglish: string;
  verbatimRationaleHinglish: string;
  signifiedHouses: number[];
  formulaIdentified: "4_11_12_Acquisition" | "3_7_10_5_Sale" | "3_6_8_12_Dispute" | "None";
  recommendationsHinglish: string[];
}

export interface TransitSaturnGrowthPeriod {
  periodLabel: string;
  saturnSignName: string;
  saturnSignNumber: number; // 1 to 12
  saturnTransitHouse: number; // 1 to 12
  elevatedGrowthHouse: number; // 7th from transit house
  growthThemeHinglish: string;
  narrativeStoryHinglish: string;
  practicalIndicators: string[];
}

export interface BNNTransitConjunctionHit {
  natalPlanet: string;
  transitPlanet: string;
  transitSignName: string;
  houseNumber: number;
  esotericMeaningHinglish: string;
  verbatimTranscriptQuote: string;
}

export interface MasterTransitRadarReport {
  lagnaSignName: string;
  lagnaSignNumber: number;
  activeDashaLord: string;
  activeAntardashaLord: string;
  
  // Property module
  propertyForecast: PropertyPredictionResult;

  // Saturn 7th House Growth Radar
  pastCycle: TransitSaturnGrowthPeriod;
  currentCycle: TransitSaturnGrowthPeriod;
  futureCycle: TransitSaturnGrowthPeriod;

  // BNN Transit Conjunctions
  bnnTransitConjunctions: BNNTransitConjunctionHit[];

  // Benchmark status
  isBenchmarkChart: boolean;
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function getSignNumber(name?: string): number {
  if (!name) return 1;
  const idx = ZODIAC_SIGNS.findIndex((s) => s.toLowerCase() === name.toLowerCase());
  return idx >= 0 ? idx + 1 : 1;
}

/**
 * Evaluates Property Timing based on KP & derived Bhavat Bhavam transcript rules:
 * - 4 + 11 + 12: Property Purchase (4 = property, 11 = gain/possession, 12 = investment outlay)
 * - 3 + 7 + 10 + 5: Property Sale (3 = 12th from 4th negating own land, 7 = buyer, 10 = 4th from 7th buyer's land, 5 = 11th from 7th buyer's gain)
 * - 3 + 6 + 8 + 12 without 11: Dispute / litigation / stalled papers
 */
export function evaluatePropertyTiming(chart: ChartData | null | undefined): PropertyPredictionResult {
  if (!chart || !chart.planets) {
    return {
      timingStatus: "Neutral_Holding",
      headlineHinglish: "Data Apraapt (Kundli Ka Chayan Karein)",
      verbatimRationaleHinglish: "Kripya valid kundli select karein.",
      signifiedHouses: [],
      formulaIdentified: "None",
      recommendationsHinglish: []
    };
  }

  // Collect houses signified by active dasha/antardasha lords, or key property planets (Mars, 4th lord, active dasha)
  const activeMD = chart.dashas?.find((d) => d.active) ?? chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((a) => a.active);
  const mdPlanet = activeMD?.planet || "Jupiter";
  const adPlanet = activeAD?.planet || "Saturn";

  const mdData = chart.planets[mdPlanet];
  const adData = chart.planets[adPlanet];
  const marsData = chart.planets.Mars;

  const housesSet = new Set<number>();
  if (mdData?.house) housesSet.add(mdData.house);
  if (adData?.house) housesSet.add(adData.house);
  if (marsData?.house) housesSet.add(marsData.house);

  // Check houses of 4th cusp or planets aspecting
  const houses = Array.from(housesSet);

  const has4 = houses.includes(4);
  const has11 = houses.includes(11);
  const has12 = houses.includes(12);
  const has3 = houses.includes(3);
  const has7 = houses.includes(7);
  const has10 = houses.includes(10);
  const has5 = houses.includes(5);
  const has6 = houses.includes(6);
  const has8 = houses.includes(8);

  // 1. Acquisition Check: (4 & 11) or (4 & 12) or (11 & 12) with 4
  if (has4 && (has11 || has12)) {
    return {
      timingStatus: "Highly_Favorable_Acquisition",
      headlineHinglish: "🏠 Makaan / Zameen Khareedne Ka Prabal Yog (4-11-12)",
      verbatimRationaleHinglish:
        "Transcript verbatim: 'Property ka combination hota hai ki dasha ka script 4-11-12 de. 4 number property ka hai, 11 number desire fulfillment ka hai, aur 12 number investment ka hai. Jab tak aapka kharch nahi hoga, investment active nahi hogi, property nahi banti!' Aapki dasha me yeh yog sakriya ho raha hai.",
      signifiedHouses: houses,
      formulaIdentified: "4_11_12_Acquisition",
      recommendationsHinglish: [
        "Nayi property, plot ya flat me investment ke liye registry aur paperwork aage badhayein.",
        "Bank loan ya savings liquidation bina sankoch karein kyunki 12th house ka vyaya yahan shubh sthir sampatti me badal raha hai.",
        "Hanuman Chalisa ka niyamit path karein aur bhoomi pujan shubh muhurat me karein."
      ]
    };
  }

  // 2. Sale Check: 3 + 7 + 10 or 3 + 5
  if (has3 && (has7 || has10 || has5)) {
    return {
      timingStatus: "Active_Sale_Window",
      headlineHinglish: "🤝 Property / Flat Bikri Ka Yog (3-7-10-5)",
      verbatimRationaleHinglish:
        "Transcript verbatim: 'Property sale kab hogi jab dasha ke andar 3-7-10 aur 5 jaise combinations aate hain. 3rd house property ko negate karta hai (12th from 4th), 7th house khareeddar (client/buyer) hai, 10th house buyer ki property hai (4th from 7th), aur 5th house buyer ki desire fulfillment hai (11th from 7th)!' Yahan bikri tezi se ho sakti hai.",
      signifiedHouses: houses,
      formulaIdentified: "3_7_10_5_Sale",
      recommendationsHinglish: [
        "Purani property bechne ke liye market me listing dalein; sauda tezi se final hoga.",
        "Grahak (buyer) ke aane ka samay sakriya hai, behtar token amount lekar deal lock karein.",
        "Bikri se aane wale dhan ko turant doosri profitable asset me invest karein."
      ]
    };
  }

  // 3. Dispute Check: 3 + 6 + 8
  if ((has6 || has8) && (has3 || has12) && !has11) {
    return {
      timingStatus: "Dispute_Blockage_Warning",
      headlineHinglish: "⚠️ Property Vivaad ya Kagazi Rukawat (3-6-8-12)",
      verbatimRationaleHinglish:
        "Dasha me 6th (vivad), 8th (rukawat) aur 3rd/12th ka asar dikh raha hai bina 11th (safalta) ke. Aise samay me bina legal verification ke kisi nayi property par token na dein, na hi jaldbaazi me registry karein.",
      signifiedHouses: houses,
      formulaIdentified: "3_6_8_12_Dispute",
      recommendationsHinglish: [
        "Kagazaat (registry, title deed, encumbrance certificate) ki legal audit karwayein.",
        "Bhaiyo ya saajhedaro se jhagda karne se bachein; court case ke yog se bachein.",
        "Tuesday ko 1.25 kg lal masoor dal mitti ke patra me jal-pravah karein."
      ]
    };
  }

  // 4. Neutral Holding
  return {
    timingStatus: "Neutral_Holding",
    headlineHinglish: "⚓ Property Stithi Stithi-Stapak (Yathasthiti)",
    verbatimRationaleHinglish:
      "Filhal dasha me na to direct 4-11-12 (khareedari) ka heavy push hai, na hi 3-7-10-5 (bikri) ka dabav. Property معاملات me sthirta banaye rakhein.",
    signifiedHouses: houses,
    formulaIdentified: "None",
    recommendationsHinglish: [
      "Maujooda makaan ya plot ke rakh-rakhav par dhyan dein.",
      "Aane wali antardasha ke liye fund accumulation par focus karein."
    ]
  };
}

/**
 * Generates descriptive story for Saturn's 7th house aspect growth across all 12 houses.
 */
function getSaturnGrowthStory(growthHouse: number, saturnTransitHouse: number): { theme: string; story: string; indicators: string[] } {
  const normGrowth = ((growthHouse - 1) % 12) + 1;
  switch (normGrowth) {
    case 1:
      return {
        theme: "Vyakti-Vishesh & Atma-Nirman (Self-Identity & Vital Status Surge)",
        story: "Shani saatve bhav me chal kar seedha aapke Lagna (1st house) par drishti daal raha hai. Is dauran aapki shaksiyat, pehchan aur aatmasamman ka status asman chhoota hai. Log aapki baat ko gambhirta se lete hain.",
        indicators: ["Apne charitra aur anushasan me badlav", "Badi zimmedari aur netritva ka avsar", "Sharirik urja aur vyaktitva me naya tej"]
      };
    case 2:
      return {
        theme: "Kutumbik Dhan, Bank Balance & Share Market Surge (Family Wealth)",
        story: "Transcript verbatim formula: 'Shani jab 8th me hota hai to wo kiska status badhata hai? 2nd house ka! Family ke andar status badha, paiso ka status badha, share market se paise kamaye!' Shani ka aathve se doosre bhav par dhyan parivarik sanchit kosh ko achanak vistar deta hai.",
        indicators: ["Bank balance aur liquid capital me achanak badhotri", "Parivar ke andar samman aur auda badhna", "Share bazaar, investment ya purani dharohar se dhan labh"]
      };
    case 3:
      return {
        theme: "Sanchar Kranti, Writing, Media & Prerna (Massive Reach & Courage)",
        story: "Transcript reference (Sachidanand ji chart): Shani 9th bhav me chal kar seedha 3rd bhav (communication, teaching reach, writing, outreach) ka status badhata hai. Aapki baatcheet ka daayra failta hai, internet ya shishyagan aapki vani se judte hain.",
        indicators: ["Social media, YouTube ya teaching network me vistar", "Chhoti yatraon se prachur fayda", "Lekhan, pustak ya gyan prasar me shandaar safalta"]
      };
    case 4:
      return {
        theme: "Bada Makaan, Badi Gaadi & Griha-Sukha (Luxury Real Estate Surge)",
        story: "Transcript verbatim formula: 'Shani jab 10th me chal kar 4th ko dekhta hai, ya 12th se 4th par asar daalta hai: kya banne wala hai pata hai aapko? Makaan! Bada makaan banne wala hai, kyunki usne bada status dena hai, badi gaadi lene wale hain, bada ghar banne wala hai!' Real estate me sabse bada uchhal yahan hota hai.",
        indicators: ["Naye bade aalishan makaan ya flat ka nirman", "Badi luxury gaadi / vehicle ki khareedari", "Mata ji ki sehad aur aashirwad me vriddhi"]
      };
    case 5:
      return {
        theme: "Buddhita, Santan-Pragati & Research (Creative & Speculative Breakthrough)",
        story: "Shani 11th bhav me chalkar 5th bhav par poori drishti daalta hai. Aapki buddhi, creative soch aur santan ka status shandar dhang se uncha uthta hai. Gahan vidya aur research me aparaadhit safalta milti hai.",
        indicators: ["Bacchon ki shaandaar pragati ya nayi santan sukh", "Gyan, advisory aur intellectual consultancies se prashansa", "Purane karmik punyoday ka labh"]
      };
    case 6:
      return {
        theme: "Shatru-Vijay, Rog-Mukti & Career Hustle (Absolute Domination Over Obstacles)",
        story: "Shani 12th bhav me chal kar 6th bhav ko dekh raha hai. Pratiyogi, shatru aur rog aapke aage ghutne tekte hain. Karz chukta hota hai aur daily routine me ek aisi kadi tapasya aati hai jo aapko aage le jaati hai.",
        indicators: ["Legal vivaad ya competition me nishchit vijay", "Purani beemariyon se chhutkara aur health discipline", "Workplace par competitors par poora dabdaba"]
      };
    case 7:
      return {
        theme: "Jeevan-Saathi Status, Marriage & Public Clientele (Partnership Boom)",
        story: "Shani Lagna me chalkar seedha 7th bhav ko dekh raha hai. Aapke jeevan-saathi ka career aur samman achanak bulandi par pahunchta hai. Business partnerships aur public footfall me bhari badhotri hoti hai.",
        indicators: ["Avivahit logo ke vivah ke pakke yog", "Jeevan saathi ka prashasnik ya aarthik promotion", "Vyapar me naye influential clients ka aagman"]
      };
    case 8:
      return {
        theme: "Gudh Rahasya, Astrology, Occult & Vasiyat (Esoteric Mastery)",
        story: "Shani 2nd bhav me chalkar 8th bhav ka status uncha karta hai. Gupt vidyaon, Jyotish, tantra, insurance, tax returns ya vasiyat se achanak prachur dharohar aur gyan haath lagta hai.",
        indicators: ["Astrology aur occult research me divya anubhuti", "Sanchit dhan ya insurance se unearned wealth", "Aayu aur deergh-jeevan ki suraksha"]
      };
    case 9:
      return {
        theme: "Bhagyodaya, Sadguru Praapti & Teerthanatan (Divine Grace & Higher Learning)",
        story: "Shani 3rd bhav me chalkar 9th bhav (Dharma aur Guru sthan) ka status bada karta hai. Badi teerth yatrayein hoti hain, kisi siddha sadhu-sant ka samagam milta hai aur kismat ka band darwaza khulta hai.",
        indicators: ["Dharmik anushthan aur lambi teerth yatrayein", "Guru kripa se adhyatmik margdarshan", "Pitaji ke samman aur bhagya me aashcharyajanak badlav"]
      };
    case 10:
      return {
        theme: "Raj-Satta, Promotion, Authority & Career Crown (Highest Professional Status)",
        story: "Shani 4th bhav me chalkar 10th bhav (Karm aur Rajsatta) ko prachand urja deta hai. Naukri me bada promotion, corporate promotion ya sarkari samman milta hai. Aapka profession peak par hota hai.",
        indicators: ["Bada designation, promotion aur departmental authority", "Boss aur prashasan ki poori favour", "Samaj me pratishthit pad ki praapti"]
      };
    case 11:
      return {
        theme: "Aparaadhit Labh, Iccha-Poorti & Grand Network (Massive Desires Fulfilled)",
        story: "Shani 5th bhav me chalkar 11th bhav (Labh aur Aakankshaen) ko dekhta hai. Varsho se atki hui icchaen poori hoti hain. Bade niveshko, ameer mitron aur vyavsayik network ka prabal sahyog milta hai.",
        indicators: ["Aarthik labh ke naye aparamparik dwar khulna", "VIP logo aur bade netavarg se mitrata", "Dhan ki praapti me nirantar sthirta"]
      };
    case 12:
      return {
        theme: "Videsh Yatra, Moksha & Grand Investments (Spiritual & Global Horizon)",
        story: "Shani 6th bhav me chalkar 12th bhav (Videsh, Nivesh aur Moksha) ka status badhata hai. Videshi sansthaon se judav, antarrashtriya yatra aur aatma-shanti ke liye kiya gaya nivesh phalibhoot hota hai.",
        indicators: ["Videsh yatra ya foreign clients se munafa", "Adhyatmik dhyan me doobna aur chinta-mukti", "Badi shubh yojanaon me dhan ka safal nivesh"]
      };
    default:
      return {
        theme: "Karmik Vistar",
        story: "Shani ki drishti is bhav ko anushasan aur sthirta de rahi hai.",
        indicators: ["Karmik parinaam"]
      };
  }
}

/**
 * Calculates Saturn 7th House Growth Radar across past 2.5 yrs, current 2.5 yrs, and next 2.5 yrs.
 */
export function evaluateSaturn7thHouseGrowth(chart: ChartData | null | undefined): {
  past: TransitSaturnGrowthPeriod;
  current: TransitSaturnGrowthPeriod;
  future: TransitSaturnGrowthPeriod;
} {
  const lagnaRashiName = chart?.lagnaRashi || "Gemini";
  const lagnaSignNum = getSignNumber(lagnaRashiName);

  // Transit Saturn Signs:
  // Past cycle (2020 - Jan 2023): Capricorn (Makara = 10)
  // Current cycle (Jan 2023 - March 2025): Aquarius (Kumbha = 11)
  // Future cycle (March 2025 - 2028): Pisces (Meena = 12)
  const pastSignNum = 10;
  const currentSignNum = 11;
  const futureSignNum = 12;

  const pastTransitHouse = ((pastSignNum - lagnaSignNum + 12) % 12) + 1;
  const pastGrowthHouse = ((pastTransitHouse + 6 - 1) % 12) + 1;
  const pastStory = getSaturnGrowthStory(pastGrowthHouse, pastTransitHouse);

  const curTransitHouse = ((currentSignNum - lagnaSignNum + 12) % 12) + 1;
  const curGrowthHouse = ((curTransitHouse + 6 - 1) % 12) + 1;
  const curStory = getSaturnGrowthStory(curGrowthHouse, curTransitHouse);

  const futTransitHouse = ((futureSignNum - lagnaSignNum + 12) % 12) + 1;
  const futGrowthHouse = ((futTransitHouse + 6 - 1) % 12) + 1;
  const futStory = getSaturnGrowthStory(futGrowthHouse, futTransitHouse);

  return {
    past: {
      periodLabel: "Pichle 2.5 Saal (Past 2.5 Years: Shani in Makar)",
      saturnSignName: "Capricorn (मकर)",
      saturnSignNumber: pastSignNum,
      saturnTransitHouse: pastTransitHouse,
      elevatedGrowthHouse: pastGrowthHouse,
      growthThemeHinglish: pastStory.theme,
      narrativeStoryHinglish: pastStory.story,
      practicalIndicators: pastStory.indicators
    },
    current: {
      periodLabel: "Vartamaan 2.5 Saal (Current Cycle: Shani in Kumbh)",
      saturnSignName: "Aquarius (कुंभ)",
      saturnSignNumber: currentSignNum,
      saturnTransitHouse: curTransitHouse,
      elevatedGrowthHouse: curGrowthHouse,
      growthThemeHinglish: curStory.theme,
      narrativeStoryHinglish: curStory.story,
      practicalIndicators: curStory.indicators
    },
    future: {
      periodLabel: "Agla 2.5 Saal (Upcoming Cycle: Shani in Meen)",
      saturnSignName: "Pisces (मीन)",
      saturnSignNumber: futureSignNum,
      saturnTransitHouse: futTransitHouse,
      elevatedGrowthHouse: futGrowthHouse,
      growthThemeHinglish: futStory.theme,
      narrativeStoryHinglish: futStory.story,
      practicalIndicators: futStory.indicators
    }
  };
}

/**
 * BNN Transit Conjunction Evaluator
 * Checks which natal planets are stationed in the sign where Transit Saturn (currently Aquarius) travels.
 */
export function evaluateBNNTransitConjunctions(
  chart: ChartData | null | undefined,
  transitSignName: string = "Aquarius"
): BNNTransitConjunctionHit[] {
  if (!chart || !chart.planets) return [];
  const hits: BNNTransitConjunctionHit[] = [];

  for (const [pName, pData] of Object.entries(chart.planets)) {
    if (!pData) continue;
    if (pData.sign.toLowerCase() === transitSignName.toLowerCase()) {
      let meaning = "";
      let quote = "";

      switch (pName) {
        case "Sun":
          meaning = "Shani Surya se milta hai: Jyotish/Adhyatma ya prashasnik kshetra me shandaar Name, Fame, Status aur sarkar/sanstha se samman milta hai.";
          quote = "Transcript verbatim: 'Agar Shani Sun ko milta hai to name-fame status milega teaching line me!'";
          break;
        case "Mercury":
          meaning = "Shani Budh se milta hai: Lekhan, documentation, brain calculation, astrological research aur marketing/teaching ka bada network khulta hai.";
          quote = "Transcript verbatim: 'Mercury aaya to inke connection badhne shuru ho jayenge, dimaag padhne me bohot achha rahega, teaching management level badha dega!'";
          break;
        case "Venus":
          meaning = "Shani Shukra se milta hai: Dhan, liquidity aur aishwarya ka bhari aagman hota hai; consultation aur gyan se prachur paisa aata hai.";
          quote = "Transcript verbatim: 'Venus mil raha hai to Venus to hai hi wealth! Kaam karne wale ko bohot paisa aane wala hai!'";
          break;
        case "Mars":
          meaning = "Shani Mangal se milta hai: Bhoomi nirman, technical surgery/engineering aur physical toughness ka vistar hota hai.";
          quote = "Shani-Mangal BNN transit kadi mehnat aur zameen/property ke karya ko gati deta hai.";
          break;
        case "Jupiter":
          meaning = "Shani Guru se milta hai: Dharmik sanstha, Guru padvi aur adhyatmik counseling ka uncha rutba milta hai.";
          quote = "Dharmik aur gudh gyan me native ko sammaniya margdarshak ka sthan milta hai.";
          break;
        case "Moon":
          meaning = "Shani Chandra se milta hai: Man ki yatra, janta se judav aur bhavnatmak parivartan ka samay banta hai.";
          quote = "Dharmik yatrayein hoti hain aur janta ki naadi pakadne ka anubhav milta hai.";
          break;
        case "Rahu":
          meaning = "Shani Rahu se milta hai: Digital media, AI, unconventional viral projects aur international linkages me boom aata hai.";
          quote = "Rahu Shani ke karm ko global scale aur digital reach par le jata hai.";
          break;
        case "Ketu":
          meaning = "Shani Ketu se milta hai: Karmik purification, sant-sangati aur moh-bhang hokar naye srijan ka jhanda banta hai.";
          quote = "Ketu Shani ko nishkapat tapasvi banakar unche jhande par baithata hai.";
          break;
        default:
          meaning = `${pName} ke sath transit Shani milkar us grah ke kshetron ko karmik anushasan aur vistar pradan karta hai.`;
          quote = "BNN transit script activations.";
      }

      hits.push({
        natalPlanet: pName,
        transitPlanet: "Saturn (Shani)",
        transitSignName,
        houseNumber: pData.house,
        esotericMeaningHinglish: meaning,
        verbatimTranscriptQuote: quote
      });
    }
  }

  return hits;
}

/**
 * Builds the comprehensive Master Transit Radar Dossier.
 */
export function buildMasterTransitRadarDossier(chart: ChartData | null | undefined): MasterTransitRadarReport | null {
  if (!chart) return null;

  const lagnaRashi = chart.lagnaRashi || "Gemini";
  const lagnaNum = getSignNumber(lagnaRashi);

  const activeMD = chart.dashas?.find((d) => d.active) ?? chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((a) => a.active);

  const propertyForecast = evaluatePropertyTiming(chart);
  const saturnGrowth = evaluateSaturn7thHouseGrowth(chart);
  const bnnHits = evaluateBNNTransitConjunctions(chart, "Aquarius");

  // Check if this matches Sachidanand ji's benchmark chart (Gemini lagna, DOB 1965)
  const isBenchmark =
    chart.dob?.includes("1965") ||
    chart.name?.toLowerCase().includes("sachidanand") ||
    (chart.dob?.includes("05") && chart.dob?.includes("03") && chart.tob?.startsWith("14:00"));

  return {
    lagnaSignName: lagnaRashi,
    lagnaSignNumber: lagnaNum,
    activeDashaLord: activeMD?.planet || "Jupiter",
    activeAntardashaLord: activeAD?.planet || "Saturn",
    propertyForecast,
    pastCycle: saturnGrowth.past,
    currentCycle: saturnGrowth.current,
    futureCycle: saturnGrowth.future,
    bnnTransitConjunctions: bnnHits,
    isBenchmarkChart: Boolean(isBenchmark)
  };
}
