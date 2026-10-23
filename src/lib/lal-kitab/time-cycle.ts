import { calculateLalKitab, type LKPlanet, type LKVarshphal } from "@/lib/astro-engine/lalkitab";

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
  const yearShift = positiveMod(runningVarsh.completedYears, 12);
  const activeHouse = houseFromShift(1, yearShift);
  const activePlanets = planetNamesInHouse(input.planets, activeHouse);
  const activeLine = activePlanets.length
    ? `${activePlanets.join(", ")} is saal actively front seat par aate hain. In grahon ke natal house, state aur sambandh ko dekh kar hi daan, purchase, relation aur career decisions lene chahiye.`
    : `Is saal koi direct natal grah annual active house mein nahi baitha, isliye phal zyada house theme, lagna shift aur shubh/savdhani grahon se read hoga.`;
  const shubhLine = base.shubhPlanets.length
    ? `${base.shubhPlanets.join(", ")} supportive channel khol sakte hain: planning, help, relationship support, learning, income ya public response better ho sakta hai.`
    : `Shubh grahon ka signal loud nahi hai, isliye year ko steady effort, correction aur patience ke saath chalana better rahega.`;
  const cautionLine = base.cautionPlanets.length
    ? `${base.cautionPlanets.join(", ")} savdhani dete hain. In grahon se judi vastu, aadat, rishta, health pattern ya karmic pressure ko ignore na karein.`
    : `Heavy caution marker nahi dikhta, lekin Lal Kitab mein clean conduct, ghar ki safai, parent/guru respect aur false promise avoid karna hamesha zaroori hai.`;
  const summary =
    base.year === runningVarsh.startYear
      ? base.summary
      : `Lal Kitab Varshphal ${formatLKDate(runningVarsh.startDate)} se ${formatLKDate(runningVarsh.endDate)} tak annual shift ${yearShift} use karega. Read House ${activeHouse} matters first: ${HOUSE_THEMES[activeHouse]}.`;

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
      `${formatLKDate(runningVarsh.startDate)} se ${formatLKDate(runningVarsh.endDate)} tak ka Varshphal House ${activeHouse} ko activate karta hai, jiska theme hai ${HOUSE_THEMES[activeHouse]}. ${activeLine} ${shubhLine} ${cautionLine} Is saal ka practical reading yeh hai ki bade kaam tab karein jab active house ki zimmedari clear ho: documents, family promise, health routine, money flow aur relationship duties ko pending na chhodein. Remedy ke naam par sab grahon ka daan nahi; sirf wahi vastu daan karein jiska grah natal Lal Kitab chart mein challenge zone mein ho.`,
    actionLine:
      base.cautionPlanets.length > 0
        ? `Handle ${base.cautionPlanets.join(", ")} with discipline and safe remedies; avoid fear-based daan.`
        : `Use shubh planets and active house matters for planning, but keep remedies chart-specific.`,
    confidence: base.year === runningVarsh.startYear ? "lal_kitab_varshphal" : "classical_timing",
  };
}

function buildMonthlyPhal(
  input: LalKitabTimeEngineInput,
  targetDate: Date,
  varshphal: LalKitabAnnualVarshphal,
): LalKitabMonthlyPhal {
  const month = targetDate.getMonth() + 1;
  const runningVarsh = getRunningVarsh(input.dob, targetDate);
  const monthIndex = runningVarshMonthIndex(runningVarsh.startDate, targetDate);
  const runningMonth = monthIndex + 1;
  const monthShift = monthIndex;
  const activeHouse = houseFromShift(varshphal.activeHouse, monthShift);
  const activePlanets = planetNamesInHouse(input.planets, activeHouse);
  const theme = HOUSE_THEMES[activeHouse];
  const nimitToWatch = getNimitFor(activePlanets, activeHouse);
  const activeLine = activePlanets.length
    ? `${activePlanets.join(", ")} is mahine direct trigger dete hain. In grahon se judi vastu, aadat aur family signal ko carefully observe karein.`
    : `Is mahine direct planet trigger nahi hai, isliye house theme aur annual varshphal ka promise zyada important rahega.`;
  const cautionLine = [6, 8, 12].includes(activeHouse)
    ? "Yeh correction month hai: debt, disease, dispute, hidden stress, expense, sleep, hospital ya isolation type matters ko lightly na lein. Risky purchase, fight, impulsive loan, ego-based remedy aur bina samjhe daan avoid karein."
    : [2, 4, 9, 10, 11].includes(activeHouse)
      ? "Yeh mahina useful movement de sakta hai: family, home, fortune, career, income ya support network activate ho sakte hain. Documents, budget aur family/work duty clean ho to progress better milegi."
      : "Is mahine ko simple, practical aur grounded rakhein. Chhoti galti bhi unnecessary confusion create kar sakti hai, isliye promise kam aur execution zyada rakhein.";

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
    prediction:
      `${MONTH_NAMES[month - 1]} ka monthly phal House ${activeHouse} ko activate karta hai: ${theme}. ${activeLine} ${cautionLine} Is mahine ghar ke sanket bhi important hain: jis grah ka trigger ho uski vastu tootna, gum hona, kharab hona, ya repeated expense dena ek nimit maana jayega. Remedy tabhi karein jab natal condition bhi confirm kare; supportive grah ki core vastu daan karke apni madad kam na karein.`,
    actionLine:
      activePlanets.length > 0
        ? `${activePlanets.join(", ")} ke liye daan decision natal condition se niklega: 6/8/12, mandi ya dushman ho to controlled daan; nek/pakka/supportive ho to uski main vastu ka daan avoid.`
        : `Monthly phal timing signal hai; final daan natal Lal Kitab condition se hi niklega.`,
    overview:
      `${MONTH_NAMES[month - 1]} mahine mein Lal Kitab monthly phal House ${activeHouse} ko activate karta hai. Is month ko sirf calendar month ke roop mein nahi dekhna; yeh annual varshphal ke andar ek focused sub-period hai. Jo kaam poore saal background mein chal raha tha, uska ek specific part is mahine visible ho sakta hai.`,
    moneyCareer:
      [2, 6, 10, 11].includes(activeHouse)
        ? `Money/career side active hai. Income, workload, service, documentation, client dealing, boss pressure ya gains ka signal aa sakta hai. Agar active planets supportive hain to movement milega; agar challenging hain to debt, dispute, delay ya wrong commitment se bachna hoga.`
        : `Money/career direct focus nahi hai, lekin is mahine ka house theme indirectly kaam aur dhan ko affect karega. Budget, documentation aur daily routine clean rakhna safe rahega.`,
    familyHealth:
      [1, 4, 6, 7, 8, 12].includes(activeHouse)
        ? `Family/health side sensitive hai. Home peace, spouse/partner, mother, sleep, digestion, stress, hidden fear ya chronic pattern dhyan maang sakte hain. Small symptoms ko ignore na karein; Lal Kitab mein repeated small sign bhi nimit maana jata hai.`
        : `Family/health side balanced rahe sakti hai, par user ko relation tone, food routine, sleep aur ghar ki safai maintain rakhni chahiye.`,
    nimitToWatch,
    doThisMonth: [
      `House ${activeHouse} ke kaam ko organize karein: ${theme}.`,
      "Bills, documents, promises and family duties ko delay na karein.",
      "Agar active planet ka nimit repeat ho to us planet ki soft correction shuru karein.",
      "Daan karna ho to item, day, intention aur recipient clean rakhein.",
    ],
    avoidThisMonth: [
      "Supportive planet ki core vastu donate na karein.",
      "Fear mein aakar multiple remedies ek saath na karein.",
      "Broken objects, dirty water, old iron, unused tools, spoiled food ya neglected puja/books ko ignore na karein.",
      "Risky purchase, loan, fight or legal promise ko bina verification finalize na karein.",
    ],
    confidence: "rule_based_monthly",
    sourceNote:
      "Monthly phal is intentionally separate from astronomical transit and follows the Lal Kitab time-layer reading.",
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
