import { calculateLalKitab, type LKPlanet, type LKVarshphal } from "../astro-engine/lalkitab";

export type LalKitabTimeCycleMethod =
  | "35_year_chakra"
  | "varshphal"
  | "monthly_phal";

export type LalKitabTimeConfidence =
  | "ready"
  | "classical_timing"
  | "lal_kitab_varshphal"
  | "rule_based_monthly";

export interface LalKitabTimeCycleRoadmapItem {
  method: LalKitabTimeCycleMethod;
  title: string;
  status: "ready";
  note: string;
}

export interface LalKitabPlanetForTime {
  house: number;
  sign: string;
  signNum: number;
  retrograde: boolean;
  dignity: string;
  lon: number;
}

export interface LalKitabTimeEngineInput {
  dob: string;
  planets: Record<string, LalKitabPlanetForTime>;
  lagnaNum?: number;
  targetDate?: Date | string;
}

export interface LalKitabAgeState {
  birthDate: string;
  targetDate: string;
  completedAge: number;
  runningAge: number;
  cycleNumber: number;
  cycleYear: number;
}

export interface LalKitabThirtyFiveYearChakra {
  method: "35_year_chakra";
  title: string;
  cycleNumber: number;
  cycleYear: number;
  runningAge: number;
  activeHouse: number;
  activePlanets: string[];
  nearestActivation: {
    planet: string;
    activationAge: number;
    distanceInYears: number;
  } | null;
  prediction: string;
  actionLine: string;
  overview: string;
  houseExplanation: string;
  planetActivationExplanation: string;
  nimitToWatch: string[];
  practicalGuidance: string[];
  confidence: LalKitabTimeConfidence;
  sourceNote: string;
}

export interface LalKitabAnnualVarshphal extends LKVarshphal {
  method: "varshphal";
  title: string;
  activeHouse: number;
  activePlanets: string[];
  prediction: string;
  actionLine: string;
  confidence: LalKitabTimeConfidence;
}

export interface LalKitabMonthlyPhal {
  method: "monthly_phal";
  title: string;
  month: number;
  monthName: string;
  runningMonth: number;
  monthIndex: number;
  activeHouse: number;
  activePlanets: string[];
  theme: string;
  prediction: string;
  actionLine: string;
  overview: string;
  moneyCareer: string;
  familyHealth: string;
  nimitToWatch: string[];
  doThisMonth: string[];
  avoidThisMonth: string[];
  confidence: LalKitabTimeConfidence;
  sourceNote: string;
}

export interface LalKitabRemedyGuidance {
  planet: string;
  natalHouse: number;
  condition: "supportive" | "mixed" | "challenging";
  decision: "daan_allowed" | "daan_avoid" | "soft_correction";
  title: string;
  canDonate: string[];
  doNotDonate: string[];
  preferredCorrection: string[];
  nimit: string[];
  protocol: string[];
  avoidMistakes: string[];
  explanation: string;
  detailedExplanation: string;
}

export interface LalKitabTimeEngineResult {
  engine: "Pure Lal Kitab Time Engine";
  version: "0.1.0";
  generatedAt: string;
  methodSeparation: string;
  accuracyStatus: string;
  age: LalKitabAgeState;
  thirtyFiveYearChakra: LalKitabThirtyFiveYearChakra;
  varshphal: LalKitabAnnualVarshphal;
  monthlyPhal: LalKitabMonthlyPhal;
  remedyGuidance: LalKitabRemedyGuidance[];
  summary: string;
  warnings: string[];
}

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const ACTIVATION_AGES: Record<string, number> = {
  Sun: 22,
  Moon: 24,
  Mars: 28,
  Mercury: 34,
  Jupiter: 16,
  Venus: 25,
  Saturn: 36,
  Rahu: 42,
  Ketu: 48,
};

const HOUSE_THEMES: Record<number, string> = {
  1: "self, health, confidence and visible identity",
  2: "family, speech, savings and stored value",
  3: "effort, siblings, courage and skill",
  4: "home, mother, property and emotional base",
  5: "children, education, intelligence and judgement",
  6: "debt, disease, dispute, service and correction",
  7: "marriage, partnership, public dealing and trade",
  8: "sudden change, secrets, obstacles and repair",
  9: "fortune, dharma, father, guru and blessings",
  10: "career, work, authority and public karma",
  11: "income, gains, network and fulfilment",
  12: "expense, sleep, foreign matters and isolation",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PLANET_DAAN_ITEMS: Record<string, string[]> = {
  Sun: ["gehoon", "gud", "tamba", "lal kapda"],
  Moon: ["doodh", "chawal", "chaandi", "safed kapda"],
  Mars: ["lal masoor", "tamba", "lal mithai", "lal kapda"],
  Mercury: ["hara kapda", "hari sabzi", "moong", "pustak/likhne ki vastu"],
  Jupiter: ["haldi", "chana dal", "peela kapda", "dharmik pustak"],
  Venus: ["safed mithai", "chawal", "shakkar", "safed kapda"],
  Saturn: ["kaale til", "sarson ka tel", "loha", "kambal"],
  Rahu: ["koyla", "neela/kaala kapda", "nariyal", "sarson"],
  Ketu: ["kambal", "til", "kutta bhojan", "dharmik daan"],
};

const PLANET_DO_NOT_DONATE_ITEMS: Record<string, string[]> = {
  Sun: ["gehoon", "gud", "tamba", "pita se judi vastu"],
  Moon: ["doodh", "chawal", "chaandi", "safed kapda"],
  Mars: ["lal masoor", "tamba", "tools/weapons", "lal mithai"],
  Mercury: ["hara kapda", "moong", "pustak", "pen/document items"],
  Jupiter: ["haldi", "peeli vastu", "dharmik pustak", "sona/guru vastu"],
  Venus: ["safed mithai", "chawal", "shakkar", "sugandh/beauty items"],
  Saturn: ["loha", "kaale til", "tel", "joota/chamda"],
  Rahu: ["koyla", "kaali vastu", "electronics/wires", "smoky items"],
  Ketu: ["kambal", "til", "dharmik vastu", "dog-related seva items"],
};

const PLANET_SOFT_CORRECTIONS: Record<string, string[]> = {
  Sun: ["pita aur authority ka samman", "daily discipline", "ahankar kam rakhna"],
  Moon: ["maa ka samman", "paani/doodh ki safai", "sleep aur emotional routine stable rakhna"],
  Mars: ["gussa control", "tools/fire safely rakhna", "bhai-behen ya workers se conflict avoid"],
  Mercury: ["documents verify", "speech soft rakhna", "calculation aur trade clean rakhna"],
  Jupiter: ["guru/teacher ka samman", "knowledge share", "children/education support"],
  Venus: ["spouse/women ka samman", "luxury debt avoid", "relationship conduct clean rakhna"],
  Saturn: ["mazdoor/elderly seva", "discipline", "old/broken items clear karna"],
  Rahu: ["shortcut aur intoxication avoid", "truthful dealing", "fear-based decisions avoid"],
  Ketu: ["spiritual humility", "dogs ko bhojan", "silent resentment avoid"],
};

const PLANET_NIMIT: Record<string, string[]> = {
  Sun: ["father/authority se tension", "copper/brass item tootna ya gum hona", "naam, respect ya government work delay"],
  Moon: ["doodh/paani girna ya kharab hona", "maa ya ghar ki women se emotional issue", "sleep disturbance ya mood swings"],
  Mars: ["tools, fire, vehicle ya kitchen issue", "cuts, burns, anger spike", "brother/property conflict"],
  Mercury: ["documents mistake", "phone/laptop/communication issue", "speech se misunderstanding"],
  Jupiter: ["guru/teacher/fatherly advice ignore hona", "books/puja space neglect", "children/education concern"],
  Venus: ["relationship sweetness kam hona", "luxury/beauty item damage", "unnecessary comfort spending"],
  Saturn: ["shoes/iron/machinery problem", "worker/servant/labour issue", "delay, heaviness, chronic fatigue"],
  Rahu: ["sudden fear, confusion, shortcut temptation", "electronics/wires/smoke issue", "false promise ya image problem"],
  Ketu: ["dog-related nimit", "sudden detachment", "old spiritual object/hidden corner issue"],
};

const HOUSE_NIMIT: Record<number, string[]> = {
  1: ["body vitality suddenly low", "self-confidence fluctuate", "identity/image concern"],
  2: ["family speech issue", "food/grain/storage disorder", "saving leakage"],
  3: ["sibling/neighbor message", "document or small travel delay", "courage test"],
  4: ["home peace disturbed", "mother/property/vehicle signal", "water or bedroom imbalance"],
  5: ["children/education worry", "judgement confusion", "creative block"],
  6: ["debt/disease/dispute reminder", "worker/service issue", "small enemy or paperwork conflict"],
  7: ["spouse/partner/public dealing issue", "trade promise test", "agreement needs clarity"],
  8: ["sudden repair", "hidden issue opens", "inheritance/secret/fear pattern"],
  9: ["father/guru/blessing signal", "travel/dharma question", "faith tested"],
  10: ["career responsibility", "boss/authority demand", "public duty pressure"],
  11: ["income/network/friend signal", "elder sibling matter", "gain with obligation"],
  12: ["expense/sleep/foreign/hospital signal", "isolation need", "hidden loss warning"],
};

function houseThemeSentence(house: number) {
  return HOUSE_THEMES[house] ?? `House ${house}`;
}

function getNimitFor(planets: string[], house: number) {
  const planetNimit = planets.flatMap((planet) => PLANET_NIMIT[planet] ?? []);
  return Array.from(new Set([...(HOUSE_NIMIT[house] ?? []), ...planetNimit])).slice(0, 8);
}

function positiveMod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function toDate(value?: Date | string) {
  if (!value) return new Date();
  return value instanceof Date ? value : new Date(value);
}

function formatLKDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "numeric", year: "numeric" });
}

function parseLKDate(value: string) {
  const raw = String(value || "").trim();

  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    const [, y, m, d] = iso;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  const slash = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (slash) {
    const [, first, second, yearRaw] = slash;
    const a = Number(first);
    const b = Number(second);
    const y = Number(yearRaw.length === 2 ? `20${yearRaw}` : yearRaw);
    const day = b > 12 ? b : a;
    const month = b > 12 ? a : b;
    return new Date(y, month - 1, day);
  }

  return new Date(raw);
}

function getRunningVarsh(dob: string, target: Date) {
  const birth = parseLKDate(dob);
  const birthdayThisYear = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  const startYear = target >= birthdayThisYear ? target.getFullYear() : target.getFullYear() - 1;
  const startDate = new Date(startYear, birth.getMonth(), birth.getDate());
  const endDate = new Date(startYear + 1, birth.getMonth(), birth.getDate());
  const completedYears = startYear - birth.getFullYear();
  return { startYear, startDate, endDate, completedYears };
}

function completedAge(dob: string, target: Date) {
  const birth = parseLKDate(dob);
  let age = target.getFullYear() - birth.getFullYear();
  const monthDiff = target.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

function planetNamesInHouse(planets: Record<string, LalKitabPlanetForTime>, house: number) {
  return PLANETS.filter((planet) => planets[planet]?.house === house);
}

function cycleActivationPlanets(cycleYear: number) {
  return PLANETS.filter((planet) => {
    const activationAge = ACTIVATION_AGES[planet];
    return positiveMod(activationAge - 1, 35) + 1 === cycleYear;
  });
}

function nearestActivation(cycleYear: number) {
  const ranked = PLANETS.map((planet) => {
    const activationAge = ACTIVATION_AGES[planet];
    const activationCycleYear = positiveMod(activationAge - 1, 35) + 1;
    const forward = positiveMod(activationCycleYear - cycleYear, 35);
    const backward = positiveMod(cycleYear - activationCycleYear, 35);
    return {
      planet,
      activationAge,
      distanceInYears: Math.min(forward, backward),
    };
  }).sort((a, b) => a.distanceInYears - b.distanceInYears);

  return ranked[0] ?? null;
}

function houseFromShift(baseHouse: number, shift: number) {
  return positiveMod(baseHouse + shift - 1, 12) + 1;
}

function runningVarshMonthIndex(startDate: Date, targetDate: Date) {
  let monthIndex =
    (targetDate.getFullYear() - startDate.getFullYear()) * 12 +
    (targetDate.getMonth() - startDate.getMonth());

  if (targetDate.getDate() < startDate.getDate()) {
    monthIndex -= 1;
  }

  return Math.max(0, Math.min(11, monthIndex));
}

function buildAgeState(dob: string, targetDate: Date): LalKitabAgeState {
  const age = completedAge(dob, targetDate);
  const runningAge = age + 1;
  const cycleNumber = Math.floor((runningAge - 1) / 35) + 1;
  const cycleYear = positiveMod(runningAge - 1, 35) + 1;

  return {
    birthDate: dob,
    targetDate: targetDate.toISOString(),
    completedAge: age,
    runningAge,
    cycleNumber,
    cycleYear,
  };
}

function buildThirtyFiveYearChakra(
  planets: Record<string, LalKitabPlanetForTime>,
  age: LalKitabAgeState,
): LalKitabThirtyFiveYearChakra {
  const activeHouse = houseFromShift(1, age.cycleYear - 1);
  const housePlanets = planetNamesInHouse(planets, activeHouse);
  const activationPlanets = cycleActivationPlanets(age.cycleYear);
  const activePlanets = Array.from(new Set([...housePlanets, ...activationPlanets]));
  const nearest = nearestActivation(age.cycleYear);
  const theme = HOUSE_THEMES[activeHouse];
  const nimitToWatch = getNimitFor(activePlanets, activeHouse);
  const planetLine = activePlanets.length
    ? `${activePlanets.join(", ")} should be watched carefully.`
    : `No direct natal planet is placed in this house, so judge through house theme and varshphal.`;

  return {
    method: "35_year_chakra",
    title: "Lal Kitab 35-Sala Chakra",
    cycleNumber: age.cycleNumber,
    cycleYear: age.cycleYear,
    runningAge: age.runningAge,
    activeHouse,
    activePlanets,
    nearestActivation: nearest,
    prediction:
      `Running age ${age.runningAge} falls in 35-sala cycle year ${age.cycleYear}. The active field is House ${activeHouse}: ${theme}. ${planetLine}`,
    actionLine:
      activePlanets.length > 0
        ? `Do not give blind remedies for ${activePlanets.join(", ")}; first check whether the planet is nek, mandi, pakka or dushman in the natal Lal Kitab chart.`
        : `Use this year for practical correction in House ${activeHouse} matters and confirm with annual varshphal before remedy selection.`,
    overview:
      `Running age ${age.runningAge} 35-sala chakra ke cycle ${age.cycleNumber}, year ${age.cycleYear} mein aata hai. Iska matlab poore saal life ka ek base rhythm House ${activeHouse} ke topics par chalega: ${houseThemeSentence(activeHouse)}. Lal Kitab reading mein isko normal transit ki tarah nahi padhna chahiye; yeh age-based karmic activation hai jo natal chart ke promise ko jagata hai.`,
    houseExplanation:
      `House ${activeHouse} active hone se user ko is ghar ke kaam pending nahi chhodne chahiye. Agar yeh ghar family, money, health, career, relation ya expense se judta hai to wahi area repeated signals dega. Positive result tab milega jab user active house ki zimmedari practical tareeke se handle kare; negative result tab badhta hai jab wahi area ignore ho, delay ho, ya galat remedy se disturb ho.`,
    planetActivationExplanation:
      activePlanets.length > 0
        ? `${activePlanets.join(", ")} is 35-sala year mein trigger hote hain. In planets ka daan/remedy unke natal Lal Kitab condition se decide hoga. Agar grah supportive/pakka/nek hai to uski core vastu donate nahi karni; agar grah mandi, dushman, 6/8/12 ya correction zone mein hai to controlled daan, seva ya soft correction use ki ja sakti hai.`
        : `Is cycle year mein direct natal planet trigger nahi hai, isliye judgement active house, varshphal aur monthly phal se refine hoga. Aise year mein user ko large remedial action se pehle nimit observe karne chahiye.`,
    nimitToWatch,
    practicalGuidance: [
      `House ${activeHouse} se judi responsibility ko written plan mein rakhein.`,
      "Remedy ko fear-based habit na banayein; pehle nimit aur natal condition match karein.",
      "Supportive planet ki core vastu donate karne ke bajay us planet ki maryada aur conduct strengthen karein.",
      "Agar repeated damage/loss/expense same object par aaye to us planet ka correction signal maana jayega.",
    ],
    confidence: "classical_timing",
    sourceNote:
      "This is the separate Lal Kitab 35-year timing layer. It is not mixed with Gochar transit.",
  };
}

function buildRemedyGuidance(
  natalPlanets: LKPlanet[],
  activePlanets: string[],
): LalKitabRemedyGuidance[] {
  const active = activePlanets.length > 0 ? activePlanets : natalPlanets.map((planet) => planet.planet);

  return active.map((planetName) => {
    const natal = natalPlanets.find((planet) => planet.planet === planetName);
    const house = natal?.house ?? 0;
    const isDusthana = [6, 8, 12].includes(house);
    const isSupportive = natal?.state === "nek" || natal?.status === "pakka";
    const isChallenging = natal?.state === "mandi" || natal?.status === "dushman" || isDusthana;
    const condition: LalKitabRemedyGuidance["condition"] = isChallenging
      ? "challenging"
      : isSupportive
        ? "supportive"
        : "mixed";
    const decision: LalKitabRemedyGuidance["decision"] = isChallenging
      ? "daan_allowed"
      : isSupportive
        ? "daan_avoid"
        : "soft_correction";

    const canDonate = isChallenging ? (PLANET_DAAN_ITEMS[planetName] ?? []) : [];
    const doNotDonate = isSupportive
      ? (natal?.neverDonate.length ? natal.neverDonate : PLANET_DO_NOT_DONATE_ITEMS[planetName] ?? [])
      : decision === "soft_correction"
        ? (PLANET_DO_NOT_DONATE_ITEMS[planetName] ?? []).slice(0, 2)
        : [];
    const preferredCorrection = PLANET_SOFT_CORRECTIONS[planetName] ?? [];
    const nimit = PLANET_NIMIT[planetName] ?? [];
    const protocol = decision === "daan_allowed"
      ? [
        "Daan ko small, clean aur need-based rakhein; show-off ya fear se na karein.",
        "Daan se pehle ghar aur behavior correction karein, kyunki Lal Kitab mein conduct remedy se bada hota hai.",
        "Ek hi planet ke remedy ko repeat karne se pehle 43 din observation rakhein.",
        "Daan ke baad same vastu ki loss/damage frequency kam ho rahi hai ya nahi, observe karein.",
      ]
      : decision === "daan_avoid"
        ? [
          "Is planet ki core vastu ka daan avoid rakhein.",
          "Planet ko strengthen karne ke liye relation, conduct, seva aur daily discipline use karein.",
          "Agar koi vastu already donate karni pade, to usko planet-remedy ke roop mein na karein; normal charity separate rakhein.",
        ]
        : [
          "Pehle soft correction 21-43 din tak karein.",
          "Repeated nimit aaye tabhi material remedy consider karein.",
          "Mixed planet ke liye daan amount small rakhein aur ek remedy at a time follow karein.",
        ];
    const avoidMistakes = [
      "Ek saath bahut saare grahon ka daan na karein.",
      "Supportive planet ki vastu daan karke apni madad kam na karein.",
      "Remedy ko transaction na banayein; niyat, conduct aur timing clean rakhein.",
      "Agar remedy ke baad disturbance badhe to stop karke chart condition dobara dekhein.",
    ];

    return {
      planet: planetName,
      natalHouse: house,
      condition,
      decision,
      title:
        decision === "daan_allowed"
          ? `${planetName}: daan allowed with care`
          : decision === "daan_avoid"
            ? `${planetName}: core vastu ka daan avoid`
            : `${planetName}: pehle soft correction`,
      canDonate,
      doNotDonate,
      preferredCorrection,
      nimit,
      protocol,
      avoidMistakes,
      explanation:
        decision === "daan_allowed"
          ? `${planetName} natal chart mein H${house} se challenge/correction zone dikha raha hai. Lal Kitab style mein 6/8/12, mandi ya dushman condition wale grah ki vastu ka daan controlled tareeke se kiya ja sakta hai, lekin daan ko fear ya over-remedy nahi banana.`
          : decision === "daan_avoid"
            ? `${planetName} natal chart mein supportive hai. Is grah ki main vastu donate karna uski madad ko kam kar sakta hai; isliye daan ke bajay conduct, seva aur grah ki maryada ko strong rakhein.`
            : `${planetName} mixed condition mein hai. Is stage par direct vastu-daan se pehle soft correction better hai: behavior, relationship, documents, discipline aur ghar ke sanket sudharna.`,
      detailedExplanation:
        decision === "daan_allowed"
          ? `${planetName} abhi correction-worthy condition mein read ho raha hai, kyunki natal H${house} aur active timing is grah ko pressure zone mein la rahe hain. Aise case mein Lal Kitab style remedy ka matlab planet ko punish karna nahi hota; iska matlab us grah se judi blockage ko seva, daan, conduct aur object-cleaning ke through release karna hota hai. Daan tabhi useful hai jab user same planet ke nimit bhi observe kare: ${nimit.slice(0, 3).join(", ") || "repeated object/life signal"}.`
          : decision === "daan_avoid"
            ? `${planetName} user ke liye support de raha hai, isliye iski main vastu donate karna galat direction ho sakta hai. Is grah ko preserve karna hai: uske sambandhit relation ka samman, uski vastu ki safai, aur uske karaka ka positive use. Agar user is planet ki core items daan karega to kabhi-kabhi wahi support weak feel ho sakta hai.`
            : `${planetName} mixed condition mein hai, isliye direct daan se pehle observation chahiye. Mixed planet kabhi support karta hai aur kabhi pressure deta hai; isliye pehle soft correction, nimit tracking, aur ek remedy-at-a-time method best hai.`,
    };
  });
}

function buildVarshphal(
  input: LalKitabTimeEngineInput,
  targetDate: Date,
): LalKitabAnnualVarshphal {
  const base = calculateLalKitab(input.planets, input.dob, input.lagnaNum ?? 0, targetDate).varshphal;
  const runningVarsh = getRunningVarsh(input.dob, targetDate);
  const runningAge = base.runningAge || (runningVarsh.completedYears + 1);
  const cycleYear = base.cycleYear || (positiveMod(runningAge - 1, 12) + 1);
  const yearShift = cycleYear - 1;
  const activeHouse = cycleYear;
  const activePlanets = base.chartRows.filter((row) => row.varshHouse === 1).map((row) => row.planet);
  const activeLine = activePlanets.length
    ? `Varsheshwar (House 1): ${activePlanets.join(", ")} is saal sabse sakriya urja hain. In grahon ke natal house, state aur sambandh ko dekh kar hi daan, purchase, relation aur career decisions lene chahiye.`
    : `Is saal Varshphal H1 mein koi direct grah nahi hai (${base.varsheshwar}), isliye phal zyada house theme, 12-varshiya chakra aur shubh/savdhani grahon se read hoga.`;
  const shubhLine = base.shubhPlanets.length
    ? `${base.shubhPlanets.join(", ")} supportive channel khol sakte hain: planning, help, relationship support, learning, income ya public response better ho sakta hai.`
    : `Shubh grahon ka signal loud nahi hai, isliye year ko steady effort, correction aur patience ke saath chalana better rahega.`;
  const cautionLine = base.cautionPlanets.length
    ? `${base.cautionPlanets.join(", ")} savdhani dete hain. In grahon se judi vastu, aadat, rishta, health pattern ya karmic pressure ko ignore na karein.`
    : `Heavy caution marker nahi dikhta, lekin Lal Kitab mein clean conduct, ghar ki safai, parent/guru respect aur false promise avoid karna hamesha zaroori hai.`;
  const summary =
    base.year === runningVarsh.startYear
      ? base.summary
      : `Lal Kitab Varshphal ${formatLKDate(runningVarsh.startDate)} se ${formatLKDate(runningVarsh.endDate)} tak Running Age ${runningAge} (Cycle Year ${cycleYear}, Varsheshwar: ${base.varsheshwar}). Focus: House ${activeHouse} (${HOUSE_THEMES[activeHouse]}).`;

  return {
    ...base,
    method: "varshphal",
    title: "Lal Kitab Varshphal",
    year: runningVarsh.startYear,
    startDate: formatLKDate(runningVarsh.startDate),
    endDate: formatLKDate(runningVarsh.endDate),
    periodLabel: `${formatLKDate(runningVarsh.startDate)} to ${formatLKDate(runningVarsh.endDate)}`,
    yearShift,
    activeHouse,
    activePlanets,
    summary,
    prediction:
      base.annualPrediction
        ? `${base.annualPrediction.headline} ${base.annualPrediction.career} ${base.annualPrediction.money} ${base.annualPrediction.remedy}`
        : `${formatLKDate(runningVarsh.startDate)} se ${formatLKDate(runningVarsh.endDate)} tak ka Varshphal (Pt. Roop Chand Joshi 1952 Paddhati, Running Age ${runningAge}). ${activeLine} ${shubhLine} ${cautionLine}`,
    actionLine:
      base.annualPrediction?.remedy ||
      (base.cautionPlanets.length > 0
        ? `Handle ${base.cautionPlanets.join(", ")} with discipline and safe remedies; avoid fear-based daan.`
        : `Use shubh planets and active house matters for planning, but keep remedies chart-specific.`),
    confidence: base.year === runningVarsh.startYear ? "lal_kitab_varshphal" : "classical_timing",
  };
}

// ── Classical Lal Kitab 1952 Monthly House & Nimit Knowledge ──
interface LKMonthlyHouseMeta {
  hindiName: string;
  pakkaRulers: string;
  significance: string;
  defaultNimit: string[];
  defaultDo: string[];
  defaultAvoid: string[];
}

const LK_MONTHLY_HOUSE_DATA: Record<number, LKMonthlyHouseMeta> = {
  1: {
    hindiName: "Pehla Khana (Tanu · Seer · Aatmasamman)",
    pakkaRulers: "Surya & Mangal",
    significance: "Sharirik urja, aatmavishwas, seer ki shanti aur jeevan ki disha",
    defaultNimit: ["Chashma ya topi gum hona ya milna", "Maathe par dhoop se garmi ya halka dard", "Naye kapde ya naya faisla lene ki ichha", "Mukhya dwar par safai ki aavashyakta"],
    defaultDo: ["Subah taaza paani pi kar surya ko namaskar karein", "Aatmasamman banaye rakhein par ahankar se door rahein", "Mukhya pravesh dwar ko saaf aur roshan rakhein", "Bade bujurgon ke charan sparsh se din shuru karein"],
    defaultAvoid: ["Gusse mein aakar koi lamba wada na karein", "Raat ko der tak jaag kar subah late uthna", "Bina wajah kisi par chillana ya ahem dikhana", "Ghar ke main gate par kooda ya jootey bikharna"],
  },
  2: {
    hindiName: "Doosra Khana (Dhana · Tijori · Kutumb)",
    pakkaRulers: "Guru & Shukra",
    significance: "Sanchit punji, bank balance, parivaarik baatcheet aur vaani",
    defaultNimit: ["Mandir ke aas-paas ya tijori ke paas safai", "Parivar mein kisi dawat ya dharohar par charcha", "Purane sikke ya gehne dekhne ka avsar", "Meethe bhojan ki apeksha ya baatcheet"],
    defaultDo: ["Meethi aur narm vaani ka prayog karein", "Mandir ya tijori mein chandi ya kesar ka nimit rakhein", "Kutumb ke buzurgon ko aadar ke sath bhojan karwayein", "Dhan ki bachat ko likhit roop mein niyamit karein"],
    defaultAvoid: ["Parivaarik baatcheet mein kadwe shabdo ka istemal", "Tijori ya locker mein fultu kabaad jama karna", "Bina soche-samjhe anavashyak aarthik risk lena", "Dharma sthan ya mandir ke niyam todna"],
  },
  3: {
    hindiName: "Teesra Khana (Bhrata · Sahas · Sandesh)",
    pakkaRulers: "Mangal & Budh",
    significance: "Bhai-behan, short journeys, communication, haath aur dastavez",
    defaultNimit: ["Chhoti yatra ya ticket booking ka yog", "Bhai ya behan ka achanak phone/sandesh", "Haath ya kandhe (shoulders) mein halki thakan", "Writing, paperwork ya online files ka kaam"],
    defaultDo: ["Bhai-behno aur padosiyo ke sath prem banaye rakhein", "Important paperwork ko dhyan se padhkar sign karein", "Sharirik vyayam ya yoga se baahon ko sakriya rakhein", "Chhoti yatraon ke dauran samay ka palan karein"],
    defaultAvoid: ["Bhai-behno se kisi purani baat par kadvahat", "Bina verify kiye WhatsApp/email par faisla lena", "Aalas mein important dastavez ko pending chhodna", "Haath ke auzaron ya hathiyaron se laparwahi"],
  },
  4: {
    hindiName: "Chautha Khana (Maata · Sukh · Peene ka Paani)",
    pakkaRulers: "Chandra",
    significance: "Ghar ka sukh-chain, maata ka ashirwad, paani aur vahan",
    defaultNimit: ["Ghar ke nal se paani tapakna ya tanki overflow hona", "Doodh ka ubal kar girna ya safed vastu aana", "Maata ji ki tabiyat ya unka achanak ashirwad", "Ghar ke farsh par nami ya safai"],
    defaultDo: ["Maata ke charan sparsh karke unka ashirwad lein", "Ghar ke peene ke paani ke sthan ko swachh rakhein", "Chandi ke bartan mein paani peena labhkari rahega", "Ghar ke aangan aur drawing room ko shant rakhein"],
    defaultAvoid: ["Ghar mein paani ya doodh ki barbadi karna", "Maata ya maata tulya stri ke aadar mein chook", "Ghar mein raat ko chhat par ya aangan mein klesh", "Seelan aur gande paani ka thehrav ignore karna"],
  },
  5: {
    hindiName: "Paanchva Khana (Santan · Buddhi · Purva Punya)",
    pakkaRulers: "Guru",
    significance: "Padhai, vidya, bachon ka vikas, aatmik gyan aur purva punya",
    defaultNimit: ["Kitabo ya stationery par dhool safai", "Bachon ki shiksha ya unki aadat par dhyan aana", "Puja-path mein achanak dhyan lagna", "Pet (digestion) mein halki garmi ya bhookh mein badlav"],
    defaultDo: ["Roz thoda samay adhyayan aur shant dhyan mein bitayein", "Bachon ke sath dostana aur prerak vatavaran rakhein", "Guru mantra ya Gayatri mantra ka jaap karein", "Bhojan mein satvik aur taaza aahar shaamil karein"],
    defaultAvoid: ["Bina research ke stock market ya gambling mein daanv", "Bachon par anavashyak gussa ya shanka karna", "Pavitra kitabon ya adhyayan samagri ka apman", "Basi ya bhari fried khana khana"],
  },
  6: {
    hindiName: "Chhatha Khana (Rin · Rog · Shatru · Mama)",
    pakkaRulers: "Budh & Ketu",
    significance: "Karyasthal ka bojh, pratiyogita, swasthya jaanch aur maternal relatives",
    defaultNimit: ["Masi ya mama ji se sandesh ya mulaqat", "Office mein achanak checking ya files ka audit", "Paltoo janwar ya kutte ka aana", "Pet mein gas ya paachan vikar ka halka lakshan"],
    defaultDo: ["Karyasthal par imaandari aur anushasan se kaam karein", "Purane udhaar ya debt ki repayment schedule banayein", "Roz subah gunguna paani piyein aur walk karein", "Kutton ko meethi roti ya doodh-roti khilayein"],
    defaultAvoid: ["Office mein aapsi chugli ya vivad mein hissa lena", "Naya anavashyak loan ya credit card liability badhana", "Maternal relatives ke sath aarthik matbhed", "Chhoti bimari ko ignore karke dawai na lena"],
  },
  7: {
    hindiName: "Saatva Khana (Dampatya · Saajhedaari · Vyapar)",
    pakkaRulers: "Shukra & Budh",
    significance: "Jeevansathi ka sath, daily retail business, public contacts aur bedroom",
    defaultNimit: ["Jeevansathi ke kapde ya shringaar ki vastu khareedna", "Ghar ke bedroom mein safai aur sugandh", "Business partner ya retail customer ka naya contact", "Kacha doodh ya dahi ka rasoi mein aana"],
    defaultDo: ["Jeevansathi ki pasand aur ichhaon ka samman karein", "Bedroom ko swachh, sugandhit aur vyavasthit rakhein", "Vyaparik deals ko written agreement ke sath finalize karein", "Dahi ya makhan ka rasoi mein niyamit upyog karein"],
    defaultAvoid: ["Jeevansathi par bina baat ke gussa ya shanka", "Bedroom mein kabad, tute kanch ya joote rakhna", "Business partner se koi gupt jhooth bolna", "Gande ya fati hui bedsheet ka upyog karna"],
  },
  8: {
    hindiName: "Aathva Khana (Achanak Ghatna · Rahasya · Seelan)",
    pakkaRulers: "Mangal & Shani",
    significance: "Achanak badlav, purani seelan, secret matters, jodo ke dard aur machinery",
    defaultNimit: ["Ghar ki dakshin deewar par seelan ya plaster girna", "Chabi (keys) ya purani cheez ka achanak gumna", "Gas chulha, stove ya tandoor ki repairing", "Jodo (joints) ya kamar mein achanak jakdan"],
    defaultDo: ["Dakshin disha aur rasoi ki bhati/stove ko swachh rakhein", "Raat ko jaldi soyein aur vehicle hamesha dhyan se chalayein", "Purana loha ya toot-phoot ghar se turant hatayein", "Pavitra mantra jaap aur eeshwar chintan karein"],
    defaultAvoid: ["Andhere ya sunsan raste par akele tezi se chalna", "Dakshin gate par kabad ya ganda paani thehrane dena", "Bina kisi verification ke risky secret plan mein hissa lena", "Ghar mein bhatti ya tandoor zameen ke andar banana"],
  },
  9: {
    hindiName: "Nauva Khana (Bhaagya · Pita · Teerth Yatra)",
    pakkaRulers: "Guru",
    significance: "Kismat ka uday, pita ka ashirwad, dharmik karya aur dhyan",
    defaultNimit: ["Dharmik sthan ya mandir jane ka sudden plan", "Pita ji ki purani cheez ya unki salah milna", "Peeli daal, haldi ya kesar ka rasoi mein upyog", "Ghar mein kisi bujurg shant vyakti ka aagman"],
    defaultDo: ["Pita aur guru ke charan sparsh karke ashirwad lein", "Maathe aur naabhi par kesar ya chandan ka tilak lagayein", "Dharmik granth ya gyanwardhak pustak padhein", "Kisi zarooratmand vidyarthi ki madad karein"],
    defaultAvoid: ["Dharma, devta ya pita ke vachano ka mazaak udana", "Mandir mein ashuddh bhav se pravesh karna", "Bujurgon ki salah ko anadekha karke ahem dikhana", "Peepal ke ped ya devsthan ko ashuddh karna"],
  },
  10: {
    hindiName: "Dasva Khana (Ajeevika · Takht · Pratishta)",
    pakkaRulers: "Shani",
    significance: "Career ka vikas, sarkari adhikaari, pita ka rutba aur samajik pad",
    defaultNimit: ["Office se related purani files ya stamp ka kaam", "Pathar ke farsh ya cement ki safai", "Pita ke daayitva ya samajik prashansa ka sandesh", "Karyasthal par kisi senior official se meeting"],
    defaultDo: ["Apne karma kshetra mein poori imaandari aur satya rakhein", "Shramikon, mazdooron aur subordinates ka aadar karein", "Sarkari niyamo aur taxes ka samay par palan karein", "Karya-sthal ki table aur auzaron ko saaf rakhein"],
    defaultAvoid: ["Subordinates ya chhote karmiyon ke sath bhedbhav", "Sarkari karya mein rishwat ya jhooth ka sahara lena", "Office mein alcohol ya gande shabdo ka istemal", "Pita ya unke sthan ka anadar karna"],
  },
  11: {
    hindiName: "Gyarahva Khana (Aawak · Laabh · Bada Bhai)",
    pakkaRulers: "Guru",
    significance: "Monthly profit, wishes fulfillment, bade bhai/behan aur social network",
    defaultNimit: ["Purane dost ya bade bhai se achanak baatcheet", "Ruka hua paisa ya bonus aane ka sanket", "Ghar mein mehmaano ka aagman", "Naye contacts ya society meeting mein aamantran"],
    defaultDo: ["Bade bhai aur jyeshth janon ka sammaan karein", "Apni kamai ka ek hissa daan ya shubh karya mein lagayein", "Social connections ke sath sachha sambandh banaye rakhein", "Naye lakshyon ki leekhit yojana banayein"],
    defaultAvoid: ["Bade bhai se dhan ya zameen ko lekar vivad", "Lalach mein aakar dost ko dhoka dena", "Ghar aane wale mehmaan ka bina aadar bhej dena", "Galat ya anaitik sadhano se aavak badhana"],
  },
  12: {
    hindiName: "Barahva Khana (Kharch · Neend · Videsh · Moksha)",
    pakkaRulers: "Guru & Rahu",
    significance: "Shayan sukh, neend, hospital/charity, videsh ya doorasth sampark",
    defaultNimit: ["Neend mein ajeeb sapne ya raat ko neend tootna", "Chhat par padosi ya pakshi ka aagman", "Mobile charger, wiring ya bulb ka kharab hona", "Hospital, dawa ya anapekshit kharch ka bill"],
    defaultDo: ["Raat ko sone se pehle pair saaf thande paani se dhoyein", "Chhat ko bilkul saaf aur kabad-mukt rakhein", "Rasoi mein baithkar khana khayein", "Zarooratmand marij ko dawa ya khana dein"],
    defaultAvoid: ["Chhat par purana loha, lakdi ya toote bartan rakhna", "Bister par baithkar khana khana ya gandagi karna", "Raat ko late mobile screen dekh kar neend kharab karna", "Bina kisi wajah ke hospital ya davaon se darna"],
  },
};

function buildMonthlyPhal(
  input: LalKitabTimeEngineInput,
  targetDate: Date,
  varshphal: LalKitabAnnualVarshphal,
): LalKitabMonthlyPhal {
  const month = targetDate.getMonth() + 1;
  const runningVarsh = getRunningVarsh(input.dob, targetDate);
  const monthIndex = runningVarshMonthIndex(runningVarsh.startDate, targetDate);
  const runningMonth = monthIndex + 1;
  // In classical Lal Kitab Varshphal, Month 1 is House 1, Month 2 is House 2 ... Month 12 is House 12
  const activeHouse = runningMonth;
  const activePlanets = varshphal.chartRows
    ? varshphal.chartRows.filter((r) => r.varshHouse === activeHouse).map((r) => r.planet)
    : planetNamesInHouse(input.planets, activeHouse);

  const houseMeta = LK_MONTHLY_HOUSE_DATA[activeHouse] || LK_MONTHLY_HOUSE_DATA[1];
  const theme = `${houseMeta.hindiName} · ${houseMeta.significance}`;

  // Dynamic Overview Generation
  let overview = "";
  let moneyCareer = "";
  let familyHealth = "";
  const dynamicNimit: string[] = [...houseMeta.defaultNimit];
  const dynamicDo: string[] = [...houseMeta.defaultDo];
  const dynamicAvoid: string[] = [...houseMeta.defaultAvoid];

  if (activePlanets.length > 0) {
    const planetsStr = activePlanets.join(" aur ");
    overview = `Is mahine Lal Kitab 1952 Paddhati ke anusaar ${houseMeta.hindiName} sakriya hai aur isme ${planetsStr} virajman hain. Varshphal ke niyam ke anusaar, is mahine ka mukhya dhyan ${houseMeta.significance} par rahega. ${planetsStr} ki urja is 30-din ke dauran seedhi halchal paida karegi; achanak nimit aur ghar ke ghatnakram ko gaur se dekhein.`;

    if (activePlanets.includes("Sun")) {
      overview += " Surya ki upsthiti se aatmasamman, sarkari karya aur aatmanirbharta mein uchhal aayega; parantu krodh se bachein.";
      moneyCareer += "Senior officials, boss ya authority se sampark laabhdayak hoga. Sarkari ya administrative kaamon mein safalta milegi. ";
      familyHealth += "Pita ki sehat aur unki salah is mahine sabse bada aashirwad banegi. Aankhon aur sir mein garmi badhne par taaza paani piyein. ";
      dynamicNimit.unshift("Taambe ka bartan ya pita ki purani ghadi/chashma samne aana");
      dynamicDo.unshift("Subah uthkar pita ke charan sparsh karein aur surya ko namaskar karein");
      dynamicAvoid.unshift("Ahankaar mein aakar kisi adhikaari ya buzurg se vivaad na karein");
    }
    if (activePlanets.includes("Moon")) {
      overview += " Chandra ki sthiti se mansik thehrav, maata ka aashirwad aur ghar mein sukh-shanti ka pravah badhega.";
      moneyCareer += "Trading ya liquid cashflow mein achha movement milega. Lalch mein aakar jaldbaazi ka faisla na lein. ";
      familyHealth += "Maata ka ashirwad aur ghar ke peene ke paani ki shuddhata sabse shubh phal degi. Mansik chintaon ko dhyan se shaant karein. ";
      dynamicNimit.unshift("Doodh ka ubal kar girna ya ghar ke nal se paani ka rukaav theek hona");
      dynamicDo.unshift("Chandi ke gilaas mein paani piyein aur maata ji ki seva karein");
      dynamicAvoid.unshift("Raat ko kacha doodh peene se bachein aur maata ka dil na dukhayein");
    }
    if (activePlanets.includes("Mars")) {
      overview += " Mangal yahan saahas aur faisla lene ki tezi dega, lekin gusse aur sharir mein pitta/acidity par niyantran rakhna aavashyak hai.";
      moneyCareer += "Workplace par pratiyogiyon par dabdaba banega; kintu vivadon mein phasne ke bajaye apne goal par focus rakhein. ";
      familyHealth += "Rasoi ke gas burner aur teekhi cheezon se savdhaan rahein. Raktchaap (BP) aur gusse ko santulit rakhein. ";
      dynamicNimit.unshift("Kitchen mein chamach/bartan achanak girna ya gas chulha kharab hona");
      dynamicDo.unshift("Bhaiyon ke sath milkar kaam karein aur rasoi mein meethi roti banayein");
      dynamicAvoid.unshift("Jaldbaazi mein driving karna ya vehicle tezi se chalana");
    }
    if (activePlanets.includes("Mercury")) {
      overview += " Budh ki upsthiti vyaparik buddhi, paperwork, communication aur commercial deals ke liye atyant shubh hai.";
      moneyCareer += "Clients ke sath baatcheet, trading deals, aur nayi commercial partnership mein labh ke raste khulenge. ";
      familyHealth += "Behan, beti ya bua ke sath samwaad shubh sanket dega. Daanto aur gale ki swachhta par vishesh dhyan dein. ";
      dynamicNimit.unshift("Ghar ke green plant par nayi patti aana ya mobile/internet issue theek hona");
      dynamicDo.unshift("Chhoti kanyaon ko meethi cheez ya hare phal dein, written notes banayein");
      dynamicAvoid.unshift("Zabaan se jhooth bolna ya kisi ko dhoke bhara wada karna");
    }
    if (activePlanets.includes("Jupiter")) {
      overview += " Guru yahan gyan, adhyayan, dharmik vishwas aur bujurgon ke ashirwad se kismat ko gati denge.";
      moneyCareer += "Salahkari, shikshan, audit ya financial management mein safalta milegi. Dhan ka pravah sthir rahega. ";
      familyHealth += "Parivaarik aadar aur purvajon ke ashirwad se ghar mein shanti rahegi. Saattvik aahar lein. ";
      dynamicNimit.unshift("Kesar, peeli sarson ya mandir ki pustak ka samne aana");
      dynamicDo.unshift("Maathe aur naabhi par kesar/haldi ka tilak lagayein, peepal ko jal dein");
      dynamicAvoid.unshift("Pita tulya vyakti ya shikshak ka niradar kadapi na karein");
    }
    if (activePlanets.includes("Venus")) {
      overview += " Shukra dampatya jeevan, saundarya, vahan sukh aur bhog-vilas ke sadhano mein unnati pradan karega.";
      moneyCareer += "Creative, design, luxury ya female clients se jude karya mein vishesh aarthik laabh hoga. ";
      familyHealth += "Jeevansathi ke sath prem badhega. Bedroom ki safai aur shuchita banaye rakhna anivarya hai. ";
      dynamicNimit.unshift("Itra (perfume), safed kapde ya cosmetics ka aagman");
      dynamicDo.unshift("Swachh safed vastra pehnein aur jeevansathi ki pasand ka dhyan rakhein");
      dynamicAvoid.unshift("Bedroom mein tooti vastu rakhna ya gande kapde pehanna");
    }
    if (activePlanets.includes("Saturn")) {
      overview += " Shani yahan karmik parikshan aur kathor mehnat ki maang karega; imaandari se kiye kaam ka dugna parinam milega.";
      moneyCareer += "Karyasthal par zimmedari badhegi. Shramikon aur majdooron ka aadar karne se unka poora sahyog milega. ";
      familyHealth += "Jodo ke dard, ghutno aur kamar par dhyan dein. Shaniwar ko sarson ke tel ki maalish labhkari rahegi. ";
      dynamicNimit.unshift("Lohar/machinery repairer ka aana ya joote/chappal ki repairing");
      dynamicDo.unshift("Mazdooron aur shramikon ko namkeen bhojan karwayein, anushasan rakhein");
      dynamicAvoid.unshift("Kaam mein aalas karna ya apne se kamzor vyakti par rob jhaadna");
    }
    if (activePlanets.includes("Rahu")) {
      overview += " Rahu achanak unexpected badlav, digital/technical karya aur chamatkari badlav la sakta hai; illusion se bachein.";
      moneyCareer += "Online projects aur digital deals mein mauka milega; parantu bina kagazat ke koi bada payment transfer na karein. ";
      familyHealth += "Neend mein bechaini ya ajeeb sapno se bachein. Ghar ki chhat aur dakshin-pashchim konay ko kabad-mukt rakhein. ";
      dynamicNimit.unshift("Mobile charger/laptop mein sudden glitch ya sasural se unexpected call");
      dynamicDo.unshift("Rasoi mein baithkar khana khayein aur jau (barley) jal mein pravahit karein");
      dynamicAvoid.unshift("Raat ke samay lambi yatra ya kisi un-verified risky tip par invest karna");
    }
    if (activePlanets.includes("Ketu")) {
      overview += " Ketu aatmik khoj, sadhana, shodh aur purani chintaon ke visarjan ka samay darshata hai.";
      moneyCareer += "Silent research aur technical perfection par focus karein; public limelight ke bajaye backend kaam behtar rahega. ";
      familyHealth += "Kaan, jodo aur pairon ke talwon ki safai rakhein. Do-rangi kutte ki seva atyant labhdayak hogi. ";
      dynamicNimit.unshift("Ghar ke paas kisi kutte ka lagataar aana ya aatmik vichaar");
      dynamicDo.unshift("Kutton ko meethi roti khilayein aur dhyan sadhana mein samay bitayein");
      dynamicAvoid.unshift("Apne bhatije ya santan ke sath bina wajah kadvahat paida karna");
    }
  } else {
    overview = `Is mahine Lal Kitab Varshphal mein ${houseMeta.hindiName} sakriya hai. Is khana mein is varsh koi grah sthit nahi hai, isliye iska phal iske pakke swami (${houseMeta.pakkaRulers}) aur ${houseMeta.significance} se nirdharit hoga. Yeh mahina ground-level foundation aur discipline banaye rakhne ka hai.`;
    moneyCareer = `Work aur money side: Khana ${activeHouse} ke pakke niyam ka palan karein. Budget ko clean rakhein, ruka hua karya samapt karein aur lalach mein aakar koi risky commitment na karein.`;
    familyHealth = `Ghar-parivar mein shaanti banaye rakhein. ${houseMeta.significance} se judi chintaon ko samay par baat karke suljhayein. Niyamit aahar aur swachhta banaye rakhein.`;
  }

  const activeLine = activePlanets.length
    ? `${activePlanets.join(", ")} is mahine Varshphal H${activeHouse} mein hone ke karan direct trigger dete hain.`
    : `Varshphal H${activeHouse} mein koi direct grah nahi hai; pakke swami (${houseMeta.pakkaRulers}) ka aashirwad kaam karega.`;

  const cautionLine = [6, 8, 12].includes(activeHouse)
    ? "Savdhani: Yeh vishesh correction ka mahina hai — udhaar, dispute, machinery fault ya anavashyak kharch se bachein."
    : "Yeh mahina unnatikari aur sakriya hai — shubh nimiton ko pehchanein aur imandari se aage badhein.";

  const prediction = `${houseMeta.hindiName} activation (Varsh month ${runningMonth}): ${overview} ${cautionLine}`;
  const actionLine = activePlanets.length > 0
    ? `${activePlanets.join(", ")} trigger: Supportive grah ki vastu daan na karein; challenged grah ki nishani dikhne par soft seva karein.`
    : `Pakke swami (${houseMeta.pakkaRulers}) ki maryada aur Lal Kitab aacharan ka palan karein.`;

  return {
    method: "monthly_phal",
    title: "Lal Kitab Monthly Phal",
    month,
    monthName: MONTH_NAMES[month - 1],
    runningMonth,
    monthIndex,
    activeHouse,
    activePlanets,
    theme,
    prediction,
    actionLine,
    overview,
    moneyCareer: moneyCareer.trim(),
    familyHealth: familyHealth.trim(),
    nimitToWatch: Array.from(new Set(dynamicNimit)).slice(0, 6),
    doThisMonth: Array.from(new Set(dynamicDo)).slice(0, 4),
    avoidThisMonth: Array.from(new Set(dynamicAvoid)).slice(0, 4),
    confidence: "rule_based_monthly",
    sourceNote: "Monthly phal follows authentic Lal Kitab 1952 progressive house activation and planetary triggers.",
  };
}

export function calculateLalKitabTimeEngine(
  input: LalKitabTimeEngineInput,
): LalKitabTimeEngineResult {
  const targetDate = toDate(input.targetDate);
  const age = buildAgeState(input.dob, targetDate);
  const thirtyFiveYearChakra = buildThirtyFiveYearChakra(input.planets, age);
  const varshphal = buildVarshphal(input, targetDate);
  const monthlyPhal = buildMonthlyPhal(input, targetDate, varshphal);
  const natalResult = calculateLalKitab(input.planets, input.dob, input.lagnaNum ?? 0);
  const remedyGuidance = buildRemedyGuidance(
    natalResult.planets,
    Array.from(new Set([
      ...thirtyFiveYearChakra.activePlanets,
      ...varshphal.activePlanets,
      ...monthlyPhal.activePlanets,
      ...varshphal.cautionPlanets,
    ])),
  );

  return {
    engine: "Pure Lal Kitab Time Engine",
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    methodSeparation:
      "Pure Lal Kitab timing only: 35-sala chakra, Lal Kitab varshphal and monthly phal. No Gochar transit layer is mixed here.",
    accuracyStatus:
      "Pure Lal Kitab timing mode is active. The reading is separated into natal Lal Kitab condition, 35-sala chakra, varshphal and monthly phal.",
    age,
    thirtyFiveYearChakra,
    varshphal,
    monthlyPhal,
    remedyGuidance,
    summary:
      `${thirtyFiveYearChakra.prediction} ${varshphal.prediction} ${monthlyPhal.prediction}`,
    warnings: [
      "Do not mix this output with Gochar purchase guidance unless the UI clearly labels it as a separate overlay.",
      "Do not recommend daan for every planet. Favourable planets should generally be strengthened by conduct, not blindly donated away.",
      "Malefic/supportive judgement must come from natal Lal Kitab condition before remedies.",
    ],
  };
}

export function getLalKitabTimeCycleRoadmap(): LalKitabTimeCycleRoadmapItem[] {
  return [
    {
      method: "35_year_chakra",
      title: "Lal Kitab 35-Sala Chakra",
      status: "ready",
      note: "Separate Lal Kitab 35-year time-cycle method. Must not be treated as normal Gochar transit.",
    },
    {
      method: "varshphal",
      title: "Lal Kitab Varshphal",
      status: "ready",
      note: "Annual Lal Kitab layer derived from the internal Lal Kitab varshphal calculation.",
    },
    {
      method: "monthly_phal",
      title: "Lal Kitab Monthly Phal",
      status: "ready",
      note: "Monthly Lal Kitab timing layer. Kept separate from astronomical transit windows.",
    },
  ];
}
