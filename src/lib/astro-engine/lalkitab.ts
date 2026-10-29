// ============================================================
// ASTROLIFE LAL KITAB ENGINE v3.0
// Pakka Ghar · Dushman Ghar · Nishaniyan · Upaya
// Takkar Analysis · Rin Siddhant · Activation Ages
// Combinations · Home Omens · Kismat Ka Grah · Varshphal
// ============================================================

import {
  PLANET_HOUSE_RULES,
  COMBINATION_RULES,
  HOME_OMEN_RULES,
  TAKKAR_RULES,
  KISMAT_HOUSE_WEIGHTS,
  KISMAT_PLANET_BASE,
  NEVER_DONATE_RULES,
  HOUSE_WISE_OMENS,
  type HouseOmenRule,
} from "./lalkitab-knowledge";

// ── Interfaces ────────────────────────────────────────────

export interface LKPlanet {
  planet:       string;
  icon:         string;
  color:        string;
  house:        number;
  sign:         string;
  retrograde:   boolean;
  // Status
  status:       "pakka" | "dushman" | "sadharan";
  statusLabel:  string;
  statusColor:  string;
  state:        "nek" | "neutral" | "mandi";
  score:        number;
  // Core readings
  nishani:      string;
  upaya:        string;
  rin:          string;
  // Rich domain readings
  career:       string;
  money:        string;
  marriage:     string;
  family:       string;
  health:       string;
  psychology:   string;
  homeEnv:      string[];
  // Timing
  actAge:       number;
  actYear:      number;
  isActNow:     boolean;
  isPast:       boolean;
  // Relations
  friends:      string[];
  enemies:      string[];
  // Triggers & pakka
  triggers:     number[];
  pakkaHouse:   number;
  // Safety
  neverDonate:  string[];
}

export interface LKTakkar {
  p1:          string;
  p2:          string;
  house:       number;
  houseLabel?: string;
  effect:      string;
  icons:       [string, string];
  kind:        "enemy" | "support" | "complex";
  upaya?:      string;
}

export interface LKRin {
  planet: string;
  icon:   string;
  house:  number;
  rin:    string;
  upaya:  string;
}

export interface LKCombination {
  id:         string;
  planets:    [string, string];
  title:      string;
  prediction: string;
  psychology: string;
  risks:      string[];
  strengths:  string[];
  remedies:   string[];
}

export interface LKHomeOmen {
  planet:     string;
  icon:       string;
  signs:      string[];
  meaning:    string;
  correction: string[];
}

export interface LKKismat {
  planet:         string;
  icon:           string;
  house:          number;
  score:          number;
  interpretation: string;
}

export interface LK12YearMatrixRow {
  cycleYear:    number;
  runningAge:   number;
  calendarYear: number;
  varsheshwar:  string;
  isCurrent:    boolean;
  planetHouses: Record<string, number>;
  theme:        string;
  focalHouse:   number;
}

export interface LKDrishti {
  fromHouse:       number;
  toHouse:         number;
  fromPlanets:     string[];
  toPlanets:       string[];
  type:            "100_buniyad" | "50_adhikar" | "25_sahayak" | "dhokha" | "achanak" | "sanstha";
  name:            string;
  hindiName:       string;
  strengthPercent: number;
  effect:          string;
  upaya?:          string;
  isAfflicted:     boolean;
}

export interface LK43DayUpay {
  planet:          string;
  house:           number;
  priority:        "high" | "medium" | "preventative";
  title:           string;
  ritual:          string;
  timeWindow:      string;
  duration:        string;
  prohibitions:    string[];
  materialsNeeded: string[];
  conductRule:     string;
}

export interface LKVarshphal {
  year:           number;
  startDate:      string;
  endDate:        string;
  periodLabel:    string;
  yearShift:      number;
  runningAge:     number;
  cycleYear:      number;
  varsheshwar:    string;
  lagnaSign:      string;
  shubhPlanets:   string[];
  cautionPlanets: string[];
  summary:        string;
  chartRows:      LKVarshphalPlanet[];
  annualPrediction: LKVarshphalPrediction;
  twelveYearMatrix: LK12YearMatrixRow[];
}

export interface LKCoreAccuracyRow {
  planet:       string;
  sign:         string;
  signShort:    string;
  house:        number;
  position:     "EXALTED" | "DEBILITATED" | "OWN_SIGN" | "FRIEND_SIGN" | "ENEMY_SIGN" | "NEUTRAL_SIGN";
  soya:         boolean;
  kismatJaganewala: boolean;
  beneficMalefic: "Benefic" | "Malefic" | "Mixed";
  reason:       string;
}

export interface LKVarshphalPlanet {
  planet:       string;
  natalHouse:   number;
  varshHouse:   number;
  sign:         string;
  signShort:    string;
  beneficMalefic: "Benefic" | "Malefic" | "Mixed";
  soya:         boolean;
  kismatJaganewala: boolean;
  reading:      string;
}

export interface LKVarshphalPrediction {
  headline: string;
  career:   string;
  money:    string;
  family:   string;
  health:   string;
  remedy:   string;
}

export interface LKHouseOmen extends HouseOmenRule {
  planets:         string[];
  planetIcons:     string[];
  planetColors:    string[];
  isSoya:          boolean;
  awakenerPlanet:  string;
  awakeningRemedy: string;
}

export interface LKResult {
  planets:       LKPlanet[];
  takkars:       LKTakkar[];
  rins:          LKRin[];
  hasPitraRin:   boolean;
  combinations:  LKCombination[];
  homeOmens:     LKHomeOmen[];
  houseOmens:    LKHouseOmen[];
  kismat:        LKKismat;
  coreAccuracy:  LKCoreAccuracyRow[];
  varshphal:     LKVarshphal;
  drishtis:      LKDrishti[];
  upayProtocols: LK43DayUpay[];
  summary:       string;
  tevaType?:     "Dharmi Teva" | "Andha Teva" | "Ratandh Teva" | "Sadharan Teva";
  tevaExplanation?: string;
}

// Planet input shape
interface PD {
  house:      number;
  sign:       string;
  signNum:    number;
  retrograde: boolean;
  dignity:    string;
  lon:        number;
}

// ── Constants ─────────────────────────────────────────────
const PLS   = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PEMO  = ["☉","☽","♂","☿","♃","♀","♄","☊","☋"];
const PCOL  = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa","#a78bfa","#fb7185"];

const RASHIS_SA = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya",
                   "Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
const SIGN_SHORT = ["Ar","Ta","Ge","Ca","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

const EXALT_SIGN: Record<string,number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7,
};

const DEBIL_SIGN: Record<string,number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 1,
};

const OWN_SIGNS: Record<string,number[]> = {
  Sun: [4], Moon: [3], Mars: [0,7], Mercury: [2,5], Jupiter: [8,11], Venus: [1,6], Saturn: [9,10],
  Rahu: [], Ketu: [],
};

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

function getRunningVarsh(dob: string, target = new Date()) {
  const birth = parseLKDate(dob);
  const birthdayThisYear = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  const startYear = target >= birthdayThisYear ? target.getFullYear() : target.getFullYear() - 1;
  const startDate = new Date(startYear, birth.getMonth(), birth.getDate());
  const endDate = new Date(startYear + 1, birth.getMonth(), birth.getDate());
  const completedYears = startYear - birth.getFullYear();
  return { startYear, startDate, endDate, completedYears };
}

function planetPosition(planet: string, signNum: number): LKCoreAccuracyRow["position"] {
  if (signNum === EXALT_SIGN[planet]) return "EXALTED";
  if (signNum === DEBIL_SIGN[planet]) return "DEBILITATED";
  if ((OWN_SIGNS[planet] || []).includes(signNum)) return "OWN_SIGN";
  const signLord = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"][signNum];
  if ((LK_FRIENDS[planet] || []).includes(signLord)) return "FRIEND_SIGN";
  if ((LK_ENEMY_PLANET[planet] || []).includes(signLord)) return "ENEMY_SIGN";
  return "NEUTRAL_SIGN";
}

function isSoyaPlanet(
  planet: string,
  house: number,
  allPlanets: Record<string, PD>,
  currentAge: number,
) {
  // 1. Classical rule: A planet awakens automatically upon reaching its activation age
  const actAge = LK_ACT_AGE[planet] || 25;
  if (currentAge >= actAge) return false;

  // 2. A companion planet in the same house awakens it (Yuti)
  const hasCompanion = Object.entries(allPlanets).some(
    ([p, pd]) => p !== planet && pd.house === house
  );
  if (hasCompanion) return false;

  // 3. A planet in the opposing 7th house (direct 100% frontal drishti) awakens it
  const oppositeHouse = ((house + 6 - 1) % 12) + 1;
  const hasOpposing = Object.entries(allPlanets).some(
    ([, pd]) => pd.house === oppositeHouse
  );
  if (hasOpposing) return false;

  return true;
}

function beneficMalefic(
  planet: string,
  house: number,
  status: LKPlanet["status"],
  state: LKPlanet["state"],
  position: LKCoreAccuracyRow["position"],
): LKCoreAccuracyRow["beneficMalefic"] {
  if (state === "nek" || status === "pakka" || position === "EXALTED" || position === "OWN_SIGN") return "Benefic";
  if (state === "mandi" || status === "dushman" || position === "DEBILITATED") return "Malefic";
  if ([6,8,12].includes(house) && ["Saturn","Mars","Rahu","Ketu"].includes(planet)) return "Malefic";
  if ([1,4,5,9,10,11].includes(house)) return "Benefic";
  return "Mixed";
}

function coreReason(row: {
  planet: string;
  house: number;
  status: LKPlanet["status"];
  state: LKPlanet["state"];
  position: LKCoreAccuracyRow["position"];
  beneficMalefic: LKCoreAccuracyRow["beneficMalefic"];
  kismatJaganewala: boolean;
}) {
  const parts = [
    `${row.planet} H${row.house} mein hai`,
    row.status === "pakka" ? "pakka ghar support deta hai" : row.status === "dushman" ? "dushman ghar challenge deta hai" : "sadharan ghar mixed phal deta hai",
    String(row.position).replace(/_/g, " ").toLowerCase(),
    row.state === "nek" ? "nek halat" : row.state === "mandi" ? "mandi halat" : "madhyam halat",
  ];
  if (row.kismatJaganewala) parts.push("kismat jagane wala grah");
  return `${parts.join("; ")}. Isliye isko ${row.beneficMalefic} maana gaya.`;
}

function houseReading(house: number) {
  const map: Record<number,string> = {
    1: "self, health aur personality ka year",
    2: "family, speech aur savings ka year",
    3: "effort, courage, siblings aur skill ka year",
    4: "home, mother, property aur emotional base ka year",
    5: "education, children, intelligence aur judgement ka year",
    6: "debt, disease, dispute aur service correction ka year",
    7: "marriage, partnership, business dealing aur public image ka year",
    8: "sudden change, hidden stress, repair aur ancestral correction ka year",
    9: "fortune, dharma, guru, father aur blessings ka year",
    10: "career, authority, karma aur public responsibility ka year",
    11: "income, gains, network aur fulfilment ka year",
    12: "expense, sleep, foreign, isolation aur spiritual correction ka year",
  };
  return map[house] || `House ${house} ka year`;
}

// Pakka Ghar (classical multi-house mapping per 1952 edition)
const LK_PAKKA: Record<string,number[]> = {
  Sun:[1], Moon:[4], Mars:[3,8], Mercury:[6,7],
  Jupiter:[2,5,9,11], Venus:[2,7], Saturn:[8,10], Rahu:[12], Ketu:[6]
};

// Primary pakka house (single — for scoring & anchor)
const LK_PAKKA_PRIMARY: Record<string,number> = {
  Sun:1, Moon:4, Mars:3, Mercury:7, Jupiter:2, Venus:7, Saturn:8, Rahu:12, Ketu:6
};

// Dushman Ghar (debilitated or classical enemy houses)
const LK_ENEMY: Record<string,number[]> = {
  Sun:[7,8], Moon:[6,8], Mars:[4,8], Mercury:[1,12],
  Jupiter:[6,8,10], Venus:[6], Saturn:[1,4,5], Rahu:[1,5,8,9], Ketu:[1,2,7,8]
};

// Activation ages
const LK_ACT_AGE: Record<string,number> = {
  Sun:22, Moon:24, Mars:28, Mercury:34,
  Jupiter:16, Venus:25, Saturn:36, Rahu:42, Ketu:48
};

// Friendly planets
const LK_FRIENDS: Record<string,string[]> = {
  Sun:["Moon","Mars","Jupiter"], Moon:["Sun","Mercury"],
  Mars:["Sun","Moon","Jupiter"], Mercury:["Sun","Venus"],
  Jupiter:["Sun","Moon","Mars"], Venus:["Mercury","Saturn"],
  Saturn:["Venus","Mercury"], Rahu:["Saturn","Venus","Mercury"], Ketu:["Mars","Jupiter","Sun"]
};

// Enemy planets
const LK_ENEMY_PLANET: Record<string,string[]> = {
  Sun:["Saturn","Venus","Rahu"], Moon:["Rahu","Ketu"],
  Mars:["Mercury","Saturn"], Mercury:["Moon","Mars"],
  Jupiter:["Venus","Rahu"], Venus:["Sun","Moon"],
  Saturn:["Sun","Moon","Mars"], Rahu:["Sun","Moon","Mars"], Ketu:["Venus","Saturn","Moon"]
};

// Trigger houses per house
const LK_TRIGGERS: Record<number,number[]> = {
  1:[1,7,4,10], 2:[2,8,5,11], 3:[3,9,6,12], 4:[4,10,1,7],
  5:[5,11,2,8], 6:[6,12,3,9], 7:[7,1,10,4], 8:[8,2,11,5],
  9:[9,3,12,6], 10:[10,4,1,7], 11:[11,5,2,8], 12:[12,6,3,9]
};

// Rin Siddhant by house
const LK_RIN: Record<number,string> = {
  1:"Pitra Rin — karmic debt to father/ancestors. Paternal karma unresolved.",
  2:"Dhan Rin — wealth accumulation blocked by past life debts. Family karma.",
  3:"Bhai Rin — sibling karma. Past life disputes with brothers/sisters.",
  4:"Mata Rin — debt to mother. Maternal lineage karma.",
  5:"Putra Rin — children karma. Past life with children or students.",
  6:"Shatru Rin — enemy karma from past life. Health debts.",
  7:"Patni/Pati Rin — spouse karma. Past life marriage obligations.",
  8:"Mrityu Rin — death karma. Ancestor spirits require propitiation.",
  9:"Guru Rin — debt to teacher/dharma. Spiritual obligations.",
  10:"Karma Rin — career karma. Past life professional debts.",
  11:"Labh Rin — gains karma. Inherited wealth blocked by ancestors.",
  12:"Moksha Rin — liberation debt. Spiritual obligations of highest order."
};

// Hindi Nishaniyan (108 readings)
const LK_NISHANI: Record<string,Record<number,string>> = {
  Sun:{
    1:"Sone jaisi chamak, chaud matha, confident chaal. Pita ka prabhav bahut zyada. Sarkar se avsar milta hai.",
    2:"Awaaz mein authority. Ghar mein pita ki baat sabse upar. Paise aate-jaate rehte hain.",
    3:"Bahut saahsi. Chhote safar zyada hote hain. Bhai-behen ke saath meetha-teeta relation.",
    4:"Zameen-jaaydad sarkar ya bade logo se milti hai. Mata ka swabhav dominant.",
    5:"Raja jaisi mentality. Bachchon mein intelligence. Sarkari lottery ya speculation mein kismet.",
    6:"Dushman der tak nahi tik sakte. Swasthya khud ki laparvahi se khraab hota hai.",
    7:"Partner kisi authority figure hoga ya khud authority chahega.",
    8:"Pita se mila hua kuch purana hoga. Sarkar se kahin na kahin takkar.",
    9:"Bhagya bahut achha. Pita dharmik hoga. Teerth yatra life mein zarur hogi.",
    10:"Career ka sabse uchha mukaam. Sarkar ya badi company ka support.",
    11:"Kamai ke kaafi sources. Bade bhai ka saath rahega.",
    12:"Videsh se rishta ya kamai. Spiritual jagah mein maan milta hai.",
  },
  Moon:{
    1:"Gol chehra, safed ya wheat rung. Emotional aur intuitive nature. Maa bahut kareeb.",
    2:"Agar Chandra strong hai to parivar mein bahut sampatti. Bolne ka tarika madhar aur mithas bhara.",
    3:"Paani ke zariye safar. Bhai-behen ke saath emotional bond.",
    4:"Chandra ka Pakka Ghar. Mata ka ghar hi swarg hai. Maa ki umar lambi.",
    5:"Creative aur gifted bachchey. Kalaa mein talent. Prem mein bhavuk.",
    6:"Swasthya sensitive hai. Emotional pain ko andar rakhne ki aadat.",
    7:"Sunder aur emotional partner milta hai. Public ke saath emotional connection strong.",
    8:"Maa ki sehat ka dhyan rakhna. Purani property ya inheritance ka kuch mudda.",
    9:"Dharmik maa. Bhagya logon ke zariye milta hai. Higher education mein safalta.",
    10:"Public facing career. Maa khud kuch karte hain professionally.",
    11:"Logon se income. Ladies ke beech popularity.",
    12:"Ek lambe safar ka sambandh — ya videsh mein kuch time. Spiritual jeevan ki taraf rujhaan.",
  },
  Mars:{
    1:"Pehlwaan jaisi body ya athletic build. Sir ya face pe koi nishan hota hai. Anger control karna padega.",
    2:"Bolne mein seedha aur kabhi teekha. Parivar mein paise ke mudde pe bhai.",
    3:"Akhada, khel, ya military energy. Bhai-behen kaafi saahsi hote hain.",
    4:"Zameen ke mudde pe jhagda. Maa ko kabhi kabhi health issues.",
    5:"Competitive bachchey ya aap khud bahut competitive.",
    6:"Dushmanon ko khatam kar sakte ho. Athletic peak period aayega.",
    7:"Jazbati aur energetic partner. Business mein dum hai.",
    8:"Accidents se bachao — but long life bhi hai agar Mars strong ho.",
    9:"Dharm aur kaarya dono ka sangam. Pilgrimage in life is certain.",
    10:"Engineering, surgery, military, ya sports career best rahega.",
    11:"Zameen se kamai. Physical mehnat se paise.",
    12:"Chhupi dushmani. Videshon mein mehnat.",
  },
  Mercury:{
    1:"Chehra jawaan dikhta hai. Dual personality — ek public aur ek private. Bahut clever.",
    2:"Business ka zehan. Haath se paise banana aata hai. Likhne ka talent.",
    3:"Lekhak, patrakar, ya teacher. Chhote safar kaafi hote hain.",
    4:"Padhia-likha parivar. Maa samajhdar aur educated.",
    5:"Bachchon mein shaandar aql. Share market mein aql se kaam lo.",
    6:"Medical ya analytical career. Health management mein excel karte ho.",
    7:"Business partnerships best hain. Life partner intelligent hoga.",
    8:"Research aur investigation mein dil lagata hai.",
    9:"Kaanoon ya foreign education. Dharmik lekhan.",
    10:"Business, media, ya teaching mein career ka shikhhar.",
    11:"Aql se kamai. Multiple income streams.",
    12:"Videsh mein business ya spiritual lekhak.",
  },
  Jupiter:{
    1:"Bhari body ya bada qaad. Peelapan skin tone mein. Bahut udaar dil. Samaj mein izzat.",
    2:"Parivar sabse dhani log hain ya honge. Gyan aur paisa saath saath.",
    3:"Dharmik bhai-behen ya aap unhe guru ki tarah guide karte ho.",
    4:"Uchchi padhai ka ghar. Maa educated ya dharmik. Ghar mein sukh.",
    5:"Bahut hoshiyaar bachchey. Teaching ya advising karoge.",
    6:"Aadatein spiritual rakho. Dushmano ko gyan se harao.",
    7:"Ek noble aur wise partner. Dharmic business.",
    8:"Aapki rakhsha hoti hai bade sankat mein. Guru ki kripa hoti hai.",
    9:"Sabse zyada bhagyashali house for Jupiter. Guru ki dua, pilgrimage, aur fortune.",
    10:"Education, dharm, ya law mein career. Leadership with wisdom.",
    11:"Lagaataar labh aur blessings. Bahut gains.",
    12:"Spiritual liberation. Videsh mein gyan ka prasaar. Charitable heart.",
  },
  Venus:{
    1:"Sunder ya attractive personality. Kalaakaar swabhav. Charm jo sab par asar karta hai.",
    2:"Sundar parivar. Luxury ghar. Kamai kalaon se.",
    3:"Kala mein talent. Sundar bhai-behen. Chhote anandaayak safar.",
    4:"Luxury ghar. Maa khush aur samridhh. Sundar property.",
    5:"Romantic aur creative bachchey. Prem mein gahraai.",
    6:"Aashiqi ka khatra. Saundarya seva mein career.",
    7:"Sabse zyada shubh house for Venus. Bahut sundar partner.",
    8:"Chhupe rahasya aur sukh. Spouse ke zariye sampatti.",
    9:"Dharmik kalaon mein kamai. Bhagya beauty se.",
    10:"Entertainment, film, ya fashion career.",
    11:"Luxury products se income. Kalaon mein kamai.",
    12:"Videsh mein anandaayak anubhav. Mukti prem se.",
  },
  Saturn:{
    1:"Kaale ya saanwle rang. Patle ya serious look. Disciplined life — late lagta hai lekin poora milta hai.",
    2:"Parivar mein early separation ya dukh. Hard work se hi dhan milta hai.",
    3:"Mehnat pasand. Late success in writing or media.",
    4:"Maa ki sehat ka dhyan rakhna. Property mein der. Purana ghar.",
    5:"Bachchon mein der. Disciplined education — practical approach.",
    6:"Sarvashrestha house for Saturn. Sab dushman toot jaate hain.",
    7:"Late marriage. Disciplined ya bade umar ka partner.",
    8:"Long life — if Saturn strong. Karma ka hisab milta hai.",
    9:"Spiritual discipline lagti hai. Pita ke saath kuch karma.",
    10:"Career mein kaafi mehnat — lekin ek din uchhai milti hai.",
    11:"Dheere lekin pakka income. Purane networks valuable.",
    12:"Videsh mein disciplined jeewan. Seva se mukti.",
  },
  Rahu:{
    1:"Alag sa dikhna — foreign-like ya unusual appearance. Unconventional soch.",
    2:"Parivar mein halkhal. Awaaz mein kuch alag. Foreign family members.",
    3:"Videsh se unique skills. Bhai-behen alag hote hain ya alag jagah jaate hain.",
    4:"Zameen foreign sources se. Maa unusual personality.",
    5:"Alag bachchey ya unusual events with children. Pitra Dosh possible.",
    6:"Sabse zyada shubh house for Rahu. Sab dushman khatam hote hain.",
    7:"Foreign ya alag type ka partner. Unconventional marriage.",
    8:"Occult mein special abilities. Achanak events.",
    9:"Pitra Dosh zarur check karo. Pita videsh se jude ho sakte hain.",
    10:"Career mein achanak changes. Foreign career possible.",
    11:"Achanak unexpected gains.",
    12:"Videsh settlement. Unusual raaste se mukti.",
  },
  Ketu:{
    1:"Rahasyamay personality. Spiritual nature. Shareer pe koi nishan.",
    2:"Bolne mein dikkat ya parivar se alag rehna. Spiritual values.",
    3:"Spiritual saahsi. Past life skills in communication.",
    4:"Ghar se aasakti nahi. Spiritual maa. Purani property.",
    5:"Spiritual bachchey. Past life creativity.",
    6:"Rogo aur dushmanon ko spiritually naash karta hai.",
    7:"Spiritual partnership. Pati/patni se detachment bhi hoga.",
    8:"Past life occult knowledge. Liberation path.",
    9:"Pita ke saath deep spiritual karma. Renunciation possible.",
    10:"Spiritual career. Sansarik shohrat se virakti.",
    11:"Achanak spiritual gains.",
    12:"Sabse shubh house for Ketu. Poori mukti. Moksha raasta.",
  },
};

// Hindi Upaya (classical authentic remedies)
const LK_UPAYA: Record<string,Record<number,string>> = {
  Sun:{
    1:"Har roz ugta hua Surya ko jal chadhaen. Tambe ka lota use karein. Tamba/gehoon ka daan na karein.",
    2:"Nadee mein tambe ka sikka bahaen. Meethi roti banakar baantein.",
    3:"Hanuman ji ki pooja karein. Bhai-behen ke saath rishta achha rakhein.",
    4:"Pita aur mata ki nitya seva karein. Ghar ke mandir ko pavitra rakhein.",
    5:"Surya Namaskar karein. Bachhon ke sath prem aur gyan sajha karein.",
    6:"Suryoday par Surya ko jal samarpit karein. Rogiyon ki nishkaam seva karein.",
    7:"Shaadi se pehle nadee mein tambe ka sikka bahaen. Ahankar par niyantran rakhein.",
    8:"Gehoon + tambe ki cheez + lal kapda daan karein. Meethi rewari jal pravah karein.",
    9:"Surya ko jal dein. Pita aur guru ke aadesh ka nishtha se palan karein.",
    10:"Pita ka aadar karein. Roz Surya ko jal dein. Karobaar mein satyanishtha rakhein.",
    11:"Andhon ko bhojan karayein. Pita ka aashirwad lein. Gehoon/tambe ka daan na karein.",
    12:"Tambe ka sikka nadee mein bahayein. Suryoday par dhyaan karein.",
  },
  Moon:{
    1:"Chaandi ki anguthi ya chain pehnein. Kamre mein paani ka saaf bartan rakhein.",
    2:"Mata aur bujurg auraton ka ashirwad lein. Chaandi ka chauras tukda paas rakhein. Doodh-chawal ka daan na karein.",
    3:"Kanya ya chaandi ka daan na karein. Doodh ya paani kabhi na bechein. Bachhon ko kheer khilayein.",
    4:"Maa ki nitya seva karein. Ghar mein chhoti si chaandi rakhein. Doodh ka daan na karein.",
    5:"Shiv ji ko jal chadhayein. Yateem bachhon ki shiksha mein sahayata karein.",
    6:"Chaandi ke glass mein paani piyein. Patal ke kuan/borewell saaf rakhein.",
    7:"Patni aur mata ka aadar karein. Parivar mein prem banaye rakhein. Doodh-chaandi ka daan na karein.",
    8:"Chandra ko nitya pranam karein. Purani property/seepage ki marammat karein.",
    9:"Saas aur mata ki seva karein. Teerth sthal par jal bhent karein. Doodh ka daan na karein.",
    10:"Kaam karne wali mahilaon ka samman karein. Routine mein dhairya rakhein.",
    11:"Ghar ke paas paani ka source saaf rakhein. Bujurg striyon ko aadar dein.",
    12:"Bujurg auraton ki seva karein. Pyase logon ko nishkaam paani pilayein.",
  },
  Mars:{
    1:"Peepal ya neem lagayen. Blood donation karein. Krodh par sayyam rakhein.",
    2:"Ped kabhi mat kaatein. Lal masoor ki daal ka niyantrit daan karein.",
    3:"Bhai-behen ki madad karein. Chaandi ka chhalla pehnein. Saahas ka sahi upyog karein.",
    4:"Bhai-behen se rishta theek rakhein. Zameen ke jhagde mat karein. Chaandi dharan karein.",
    5:"Suryoday par Surya ko jal dein. Bachhon ko khed-kood mein prerit karein.",
    6:"Public jagah pe chhayadar ped lagayein. Blood donation karein.",
    7:"Nadee mein tambe ke sikke bahayen. Jeevansathi se vivad na karein.",
    8:"Gale mein chaandi ki chain pehnein. Behti nadee mein rewari ya gud bahayein. Moonga bilkul na pehnein.",
    9:"Mandir mein lal kapda ya lal masoor bhent karein. Dharmik maryada rakhein.",
    10:"Kaam ki jagah par mazdooron ka aadar karein. Shramik discipline banaye rakhein.",
    11:"Vyapar aur income mein satya aacharan rakhein. Bhaiyon ki bhalai sochein.",
    12:"Mandir mein lal anaj bhent karein. Krodh aur hathiyaron se door rahein.",
  },
  Mercury:{
    1:"Budh-var ko hari ghaas gaay ko khilayein. Behen-beti ka aashirwad lein.",
    2:"Behen-maasi ko hare rang ki choodiyan dein. Vyapar mein sachhai rakhein.",
    3:"Maami aur behen ki seva karein. Lekhan aur communication saaf rakhein.",
    4:"Maasi-nana paksh ki seva karein. Ghar ke kagazaat vyavasthit rakhein.",
    5:"Pakshiyon ko hara moong daana dein. Vidyarthiyon ki sahayata karein.",
    6:"Haath mein chaandi ka bejodh chhalla pehnein. Maami aur behen ka samman karein.",
    7:"Business mein sachchi baat bolein hamesha. Jeevansathi se paridrishyata rakhein.",
    8:"Dhokha mat karein. Toton aur pakshiyon ko paani-dana dein.",
    9:"Guru ka aadar karein. Kitaben aur lekhak samagri vidyarthiyon ko dein.",
    10:"Kaam ki jagah par sachhai rakhein. Legal papers hamesha saaf rakhein.",
    11:"Budh-var ko behen-beti ko uphaar dein. Vyaparik samjhauta imaandari se karein.",
    12:"Gaay ko hari ghaas khilayein. Raat ko sone se pehle likhkar man halka karein.",
  },
  Jupiter:{
    1:"Kesar ka tilak lagaen. Bujurgon ke paon choein. Gyan ka vistar karein.",
    2:"Kesar ya haldi ka tilak lagayein. Guru aur pita ka ashirwad lein. Peeli vastu ka daan na karein.",
    3:"Bhai-behen ki padhai mein nishkaam madad karein. Gyan sajha karein.",
    4:"Ghar ke Guru ki pooja karein. Ghar mein dharmik vatavaran banaye rakhein.",
    5:"Bachhon ko nishkaam padhayein. Puja sthan roshan rakhein. Peeli vastu ka daan na karein.",
    6:"Guruvar ko peela kapda + haldi zarooratmand ko dein. Rogiyon ki seva karein.",
    7:"Roz kesar ka tilak lagaen. Jeevansathi ko barabar samman dein.",
    8:"Vishnu Sahasranama padhein. Gupt gyan ka durupyog na karein.",
    9:"Guru ko Dakshina dein. Dharmik tirth yatra karein aur vidya baatein.",
    10:"Kaam ki jagah par kesar ka tilak lagayein. Nyayapoorna aacharan rakhein.",
    11:"Kalaai par peela sooti dhaga ya sona pehnein. Guru aur pita ka samman karein. Peela daan na karein.",
    12:"Spiritual sansthaaon mein nishkaam seva karein. Dhyan aur sadhana karein.",
  },
  Venus:{
    1:"Ghar ko sugandhit rakhein. Jeevansathi ka samman karein. Charitra shuddh rakhein.",
    2:"Patni ka aadar karein. Ghar ko saaf aur sugandhit rakhein. Safed vastu ka daan na karein.",
    3:"Behen aur kanyaon ko aadar dein. Kalaatmak ruchi ko badhava dein.",
    4:"Safed gaay ki seva karein. Ghar mein swachhta aur shanti banaye rakhein.",
    5:"Kala aur saundarya mein maryada rakhein. Vidyarthiyon ko prerit karein.",
    6:"Sabhi auraton ka samman karein. Shukravar ko safed chawal gaay ko dein.",
    7:"Patni ka samman karein. Charitra pavitra rakhein. Safed vastu ya sugandh ka daan na karein.",
    8:"Chaandi dharan karein. Parayi stree se door rahein aur maryada banaye rakhein.",
    9:"Mandir mein safed phool bhent karein. Dharmik parampara ka aadar karein.",
    10:"Karyasthal par stree sahkariyon ka aadar karein. Kala mein nishtha rakhein.",
    11:"Shukravar ko kheer banakar kanyaon ko khilayein. Safed vastu ka bematlab daan na karein.",
    12:"Ghar ke shayan kaksh ko pavitra aur swachh rakhein. Nishkaam seva karein.",
  },
  Saturn:{
    1:"Sarson ka tel + kaale til ka daan karein. Kauon ko khaana dein.",
    2:"Shanivar ko garibon ko loha daan.",
    3:"Mazdooron ki madad karein. Kaale til ka daan.",
    4:"Darwaze ke neeche chaandi gaad dein.",
    5:"Budhape ke ghar mein daan. Kauon ko khaana.",
    6:"Excellent position! Roz kuttey ko khaana dein.",
    7:"Nadee mein lohe ki keel bahaayen.",
    8:"Gareeb aur bujurgon ki seva.",
    9:"Shani mandir mein daan.",
    10:"Shani mandir mein tel chadhaen.",
    11:"Purse mein lohe ki keel rakhein.",
    12:"Shanivar ko garib ko kambal daan.",
  },
  Rahu:{
    1:"Ghar mein seese ka tukda rakhein.",
    2:"Jhoothe vaade mat karein kabhi.",
    3:"Yateemon ko daan.",
    4:"Dahleez ke neeche chaandi ka varg gaad dein.",
    5:"Purkhon ki pooja karein. Pitra Tarpan.",
    6:"Kuttey ko khaana dein. Best position for Rahu!",
    7:"Bahte paani mein seesa bahaen.",
    8:"Ghar mein gahre neele rang ka kapda rakhein.",
    9:"Niyamit Pitra Tarpan karein.",
    10:"Shortcut mat lo. Koyla daan.",
    11:"Pocket mein seese ka tukda rakhein.",
    12:"Kaala kambal daan.",
  },
  Ketu:{
    1:"Roz kuttey ko khaana dein.",
    2:"Sasuaal ka aadar karein.",
    3:"Adhyatmik sadhna karein.",
    4:"Ghar mein kutta paalen.",
    5:"Pitra karya karein.",
    6:"Kutte aur kauo ko khaana dein.",
    7:"Partner ki adhyatmik bhavna ka aadar karein.",
    8:"Dhyan karein. Adhyatmik granth padhein.",
    9:"Santo aur sadhuon ki seva karein.",
    10:"Dharmik netaon ki seva karein.",
    11:"Kuttey ko khaana dein. Adhyatmik daan.",
    12:"Best house for Ketu. Dhyan sadhna karein.",
  },
};

// ── Home environment tag expansions ──────────────────────
const HOME_ENV_DESC: Record<string,string> = {
  "official documents":
    "Ghar mein sarkari kaagzaat, government letters ya kisi authority ke papers ki baar-baar aana-jaana hoti hai — yeh is graha ki sarkari urja ka seedha prabhav hai. Documents ko sahi jagah par rakhna chahiye, kyunki inhe bikra ya kho dena career aur status ke liye nakaratmak sanket ban sakta hai. Ghar mein ek dedicated workspace ya file area banana is urja ko theek disha deta hai.",
  "office-like setup":
    "Ghar ka ek hissa clearly workspace ya study ki tarah dikhta hai, jahan kaam aur ghar ki seema blur ho jaati hai — yeh is graha ki karma-urja ka prateek hai. Kaam ka environment ghar ke andar aana ek sign hai ki aap professionally bahut active hain, ya career ghar ke rishton ko prabhavit kar raha hai. Is space ko organized aur positive rakhna aashirwaad ko barkarar rakhta hai.",
  "awards/status symbols":
    "Ghar mein trophies, certificates, medals ya koi bhi prestige ki cheezein ka hona is graha ki authority urja ko darshata hai. Yeh cheezein ghar ki energy ko confident aur status-driven banati hain. Inhe saaf jagah pe rakhna ghar ke vaasion ki recognition aur naam ko positive disha deta hai — broken ya dust-covered awards ulta prabhav dete hain.",
  "government/status symbols":
    "Ghar mein sarkar se judi cheezein — jaise ID badges, authority letters, recognition certificates — ya koi bhi status ki symbol dikhna is graha ke prabhav ka sanket hai. Yeh ghar mein authority ka mahaul create karte hain jo family ke liye ek alag pahchan banaata hai. Inhe respect ke saath rakhna chahiye.",
  "father objects":
    "Ghar mein pita se judi cheezein — unki photos, unka di hui vastu, ya unse virasat mein mili koi cheez — ka presence is graha ke pitra karma ko darshata hai. Yeh cheezein positive hain agar pita ke saath rishta achha hai, lekin pita se tension ho to yeh cheezein kabhi kabhi ghar ke mahaul mein heaviness laati hain. Pita ke saath rishta sudharna is dasha mein zyada zaroori ho jaata hai.",
  "copper items":
    "Ghar mein taamba ya copper ki cheezein — jaise bartan, moorti, ya decor — ka hona Surya ya Mangal ki urja se juda hai. Copper ek conductor hai — jo bhi urja ghar mein hai use amplify karta hai. Agar chart mein yeh graha strong hai to copper ki cheezein bahut shubh hoti hain; dushman ghar mein ho to inhe avoid ya replace karna achha hota hai.",
  "copper/brass utensils":
    "Rasoi ya dining area mein taamba ya peetal ke bartan ka hona ek purani aur classical Vedic nishani hai. Yeh bartan ek taraf ghar ki sampannata ko darshate hain, to doosri taraf is graha ki fire energy ko ghar ke center mein rakhte hain. Inhe saaf rakhna bahut zaroori hai — maile ya tute bartan negative urja amplify karte hain.",
  "family authority space":
    "Ghar mein ek aisa area jo clearly 'family head' ya bade ka sthan hai — jaise special chair, table ya corner — is graha ka ghar ke andar authority ka sanket hai. Yeh space ghar ke decision-making aur power dynamics ko reflect karta hai. Is area ka saadar hona ghar mein peace rakhta hai.",
  "bright entrance":
    "Ghar ka main dwar chamakdar, saaf aur well-lit hona chahiye — yeh Surya ki urja ka andar aana darshata hai. Andhera ya band entrance career aur bahari opportunities ko rok sakta hai. Entrance ke paas ek diya ya bright light lagana is graha ki positivity ko amplify karta hai.",
  "bright doorway":
    "Ghar ke mukhya darwaze ya kisi bhi important entrance ko roshan aur khula rakhna is graha ki shubhata ko invite karta hai. Darwaze ke aas-paas andhera, ganda ya tuta hua kuch hona bahari duniya se aapke sambandh mein rukawat ka sanket deta hai. Entrance ke paas hara paudha ya shubh symbol positive hai.",
  "bright home":
    "Poora ghar ya kam se kam main living area chamakdar aur roshan hona chahiye — yeh is graha ki positive urja ka prateek hai. Ghar mein natural light ka aana bahut shubh hai. Andheri ya band kamre is graha ke prabhav ko daba dete hain, jis se ghar ke vaasion mein negativity aur depression aa sakta hai.",
  "study area":
    "Ghar mein ek designated study ya reading corner ka hona is graha ki budhhimatta aur education ke saath deep connection dikhata hai. Yeh sthan ghar ki intellectual energy ka center ban jaata hai. Is jagah ko saaf, organized aur roshan rakhna seekhne ki kshamata aur career mein mental performance ko enhance karta hai.",
  "children's achievement objects":
    "Ghar mein bachon ke awards, drawings, certificates ya achievements ko display karna is graha ke 5ve ghar se connection ka sanket hai. Yeh cheezein ghar ki creative aur future-oriented energy ko reflect karti hain. Bachon ki achievements ko sahi jagah dena — darwaze ke paas ya living room mein — unki tarakki ko aur boost karta hai.",
  "bright puja/study room":
    "Puja ghar ya study room jo roshan ho — ek diye ya lamp se jagmagata hua — is graha ki dharmik aur educational urja ka combination hai. Is sthan mein regularity aur cleanliness ek taraf mann ko calm karti hai, doosri taraf ghar mein positive aura create karti hai. Yahan se nikalti positivity poore ghar ko prabhavit karti hai.",
  "sacred space":
    "Ghar mein ek dedicated prayer corner, puja ghar ya meditation space ka hona is graha ki dharmik aur spiritual urja ko darshata hai. Yeh sthan sirf pooja ka nahi, balki ghar ki collective peace aur balance ka kendra hota hai. Is jagah ki saaf-safai aur roz ki upasna ghar ke har sadasya ki kismat ko anukool karti hai.",
  "father/guru objects":
    "Pita, guru ya kisi revered teacher ke photos, gifts ya yaadon se judi cheezein ghar mein rakhna is graha ke blessings ko jagae rakhta hai. Yeh cheezein ghar mein ek guiding presence create karti hain. Agar pita ya guru se rishta complicated hai to inhe ghar mein rakhne se pehle mann mein forgiveness aur gratitude laana zaruri hai.",
  "religious/status symbols":
    "Ghar mein dharmic symbols — mandir, cross, crescent ya koi bhi pooja ki cheez — ke saath social status symbols ka combo is graha ke dual nature ko darshata hai. Dharma aur status dono is ghar ke liye important hain. Dono cheezein balance mein rakhna — na keval prestige ka, na keval religion ka — sabse zyada shubh hota hai.",
  "water vessel":
    "Ghar mein ek saaf paani ka bartan, matka ya water feature ka hona Chandra ki urja ka swagat karta hai. Paani is graha ki emotional aur intuitive shakti ka prateek hai. Bartan saaf aur bhara hua hona chahiye — khaali ya ganda bartan emotional emptiness ya distress ka sanket de sakta hai.",
  "milk/white objects":
    "Ghar mein safed rang ki cheezein — white decor, chaadar, ya milk-related items — ka hona Chandra ki purity aur peace energy ko invite karta hai. Safed rang ghar mein mental clarity aur emotional calm laata hai. Roz raat ko ek gilaas doodh peena ya ghar mein fresh flowers rakhna is urja ko aur badhata hai.",
  "soft lighting":
    "Ghar mein harsh neon ya bright fluorescent lights ki jagah warm, soft lighting ka hona Chandra ki emotional aur nurturing nature ko reflect karta hai. Moonlight jaisa mahaul ghar mein sensitivity aur creativity ko badhata hai. Sone ke kamre mein especially soft light — diye ya warm bulb — manovigyaanik sukoon ke liye bahut important hai.",
  "mother-related objects":
    "Maa ki photos, unki di hui cheezein ya unse judi koi bhi vastu ghar mein rakhna Chandra ki maa-shakti ko invoke karta hai. Yeh ghar mein emotional security aur belonging ka ehsaas paida karta hai. Agar maa se rishta complicated hai to unke liye daily ek short prayer ya thank you bhavna is dasha mein bahut healing hoti hai.",
  "water source":
    "Ghar ke andar paani ka source — bore well, overhead tank, ya kitchen tap — ka theek aur clean rehna Chandra ki urja ke liye critical hai. Leaking pipes ya dirty water source emotional instability aur maa ki health ke liye warning sanket deta hai. Paani ke source ki quarterly cleaning is graha ko strong rakhti hai.",
  "weapons/tools/fire objects":
    "Ghar ke andar ya entrance ke aas-paas hathaiyaar, tools ya aag se judi cheezein ka hona Mangal ki intense urja ko ghar ke center mein rakhta hai. Yeh cheezein ek taraf courage aur protection deti hain, lekin agar uncontrolled hon to ghar mein ladai, gusse aur accidents ka mahaul bana sakti hain. Inhe ghar ke andar visible jagah rakhne se bachna chahiye — store room ya locked space better hai.",
  "red objects":
    "Ghar mein lal rang ki cheezein — walls, curtains, rugs ya decor — Mangal ki aggressive urja ko amplify karti hain. Thoda lal positive hai, lekin zyada lal ghar mein tension, anger aur restlessness badhata hai. Balance ke liye lal ko sirf accents mein rakhna — jaise ek cushion ya flower — aur baaki decor cool tones mein rakhna better hota hai.",
  "heated or conflict-heavy entrance":
    "Ghar ka main entrance agar regularly arguments, loud sounds ya tense conversations ka scene banta hai to yeh Mangal ki conflict urja ka seedha prabhav hai. Entrance ka mahaul ghar ke andar ki energy set karta hai — yahan peace aur positive interaction zaroori hai. Entrance pe ek shubh symbol ya Hanuman chalisa poster lagana is urja ko balance karta hai.",
  "tools near side wall":
    "Ghar ki side wall ke paas tools, machinery ya iron objects rakhna Mangal ke 3rd house energy ka prabhav hai. Yeh aapki self-effort aur hard work ki urja hai, jo positive hai — lekin tute ya unused tools negative energy hold karte hain. Inhe regular check karte rahna aur jo kaam na aaye use hata dena important hai.",
  "vehicles":
    "Ghar mein ya ghar ke bilkul paas koi vehicle — cycle, bike, car — ka hona Mangal ki movement urja ko darshata hai. Vehicles ka achhi condition mein hona zaroori hai — tuta hua ya band gaadi ghar mein stagnation ka sanket deti hai. Vehicle ki regular servicing is graha ke transport karma ko smooth rakhti hai.",
  "busy road/lane":
    "Ghar agar kisi busy road ya busy lane pe hai to yeh Mangal ki active, movement-heavy urja hai. Ek taraf yeh activity aur opportunity laati hai, doosri taraf noise, accidents aur sleep disturbance ka risk bhi hota hai. Speed-breaker ya boundary wall ghar ki protection aur peace ke liye important hai.",
  "wires or metal objects":
    "Ghar ke aas-paas ya andar bijli ke wire, dhatu ke tools ya iron se bani cheezein adhik dikhti hain — yeh Mangal ki loha-urja ka seedha prabhav hai. Tute hue wire, galti se rakhha gaya rusted metal ya bhangar ghar mein takkar, accidents aur bhai-behen ke saath jhagdo ka sanket ban sakta hai. Inhe jald se jald theek ya bahar kar den aur ghar mein wire management organized rakhein.",
  "kitchen fire imbalance":
    "Rasoi mein aag ki jagah — chulha, gas stove — ka irregular ya problematic hona Mangal aur ghar ki fire energy mein imbalance darshata hai. Yeh baat-cheet mein kharashpan, parivar mein khaan-paan ke baare mein jhagde aur health issues create kar sakta hai. Rasoi ki fire source ka sahi aur clean hona ghar ki health energy ke liye foundational hai.",
  "sharp tools":
    "Ghar mein chhuri, kainchi, nails ya koi bhi sharp objects ka carelessly rakha hona Mangal ki cutting urja ko uncontrolled chhod deta hai. Ye cheezein accidents aur words mein teekhaapan ka sanket deti hain. Inhe safely store karna — drawer mein ya cover ke saath — is urja ko controlled aur productive banaata hai.",
  "property dispute":
    "Ghar ya zameen ke baare mein koi ongoing legal ya family dispute Mangal ke 4th house mein hone ka classic prabhav hai. Yeh sirf ek legal matter nahi — yeh ghar ki peace aur maa ke saath rishte ko bhi prabhavit karta hai. Jitna jaldi sambhav ho dispute resolve karna — chahe compromise se hi sahi — is dasha mein sabse best upaya hai.",
  "broken wall":
    "Ghar ki koi bhi deewar mein daraad, toot-phoot ya lamba crack bahut important classical sanket hai. Yeh ghar ke vaasion ke beech rishton mein toot aur career mein rukawat ka prateek hai. Isko tarant theek karana chahiye — gach, plaster ya paint se cover kar lena ek immediate step hai jo ghar ki urja ko seal karta hai.",
  "property/land objects":
    "Ghar ke saath attached land — garden, parking, boundary — ki condition ghar ki property energy ko darshata hai. Well-maintained land positive wealth energy laati hai, jabki neglected ya disputed land career aur money mein problems ka sanket deti hai. Land ki niyamit care aur boundary maintenance important hai.",
  "soft doorway":
    "Ghar ka main entrance agar soft, welcoming aur aesthetically pleasing hai — jaise flowers, plants ya gentle decor — to yeh Chandra ki welcoming aur nurturing urja ko reflect karta hai. Entrance visitors ko emotionally comfortable feel karaata hai. Yeh public dealings aur social relationships ke liye bahut shubh sanket hai.",
  "couple objects":
    "Ghar mein do ka matalab rakhne wali cheezein — jaise pair of candles, couple photos, matching items — ka hona partnership aur marriage ki energy ko strengthen karta hai. Yeh Chandra ya Shukra ki relational urja ka ghar mein expression hai. Single broken ya solo items ko replace karna — matching pairs se — relationship harmony ke liye helpful hai.",
  "guest-friendly home":
    "Ghar ka layout aur atmosphere agar naturally visitors ko comfortable mahsoos karaata hai — jaise extra seating, welcoming colors — to yeh is graha ki public aur social nature ka prabhav hai. Log yahan aana pasand karte hain aur native ka social circle naturally strong hota hai. Yeh quality career aur business connections ke liye bhi bada asset hai.",
  "hidden storage":
    "Ghar mein kuch areas ya compartments jo closed, locked ya generally nahi kholay jaate — jaise purana store room, banda almari — Mangal ya Chandra ke 8th house energy ka prabhav dikhate hain. Yeh areas purani memories, unresolved emotions ya ancestor-related items ko hold karte hain. Saal mein ek baar in areas ki safai karna deeply healing hota hai.",
  "damp/underground space":
    "Ghar ke neeche ka area — basement, underground room ya seepage zone — agar damp ya dark hai to yeh grah ki watery ya underground energy ka sanket hai. Damp walls emotional stagnation aur health issues — especially respiratory — ka symbol hain. Waterproofing aur ventilation is area mein bahut important hai.",
  "dark water area":
    "Ghar ka koi bhi paani wala area — bathroom, kitchen drain, sump — agar dirty, dark ya neglected hai to yeh Chandra ke 8th house mein hone ka serious sanket hai. Yeh area ancestral grief aur hidden emotional issues ko hold karta hai. In areas ki niyamit safai aur paani ka saaf behna emotional health ke liye zaruri hai.",
  "music/content devices":
    "Ghar mein musical instruments, speakers, recording equipment ya creative tools ka hona Chandra ki expressive aur communicative urja ko darshata hai. Yeh cheezein ghar mein positive vibration create karti hain. In tools ka regularly use hona — chahe thoda sa roz gana ho — ghar ki emotional energy ko light aur creative banata hai.",
  "peaceful bedroom/living room":
    "Bedroom ya main living area ka peaceful, clean aur harmonious hona Chandra ki nurturing urja ke liye sabse important condition hai. Yahan ka chaos ya disarray directly maan-bhai aur neend ko prabhavit karta hai. Bedroom mein minimal clutter, soft colors aur comfortable bedding is graha ki urja ke liye ideal hai.",
  "medicine/legal documents":
    "Ghar mein dawaiyaan, doctor prescriptions ya legal papers ki adhik presence is graha ke 6th house energy ka prabhav hai — health ya legal matters ghar ke center mein hain. Yeh cheezein ghar ke kisi sadasya ki ongoing health journey ya dispute ko darshati hain. Inhe ek organized space mein rakhna aur regular update karna mentally bhi easier rehta hai.",
  "work/service clutter":
    "Ghar mein kaam se juda clutter — files, samples, work tools — jo clearly defined jagah nahi hai, ghar ki energy ko professional service stress ki taraf khenchta hai. Yeh 6th house Mangal ya Surya ki urja ka sign hai ki kaam ghar ki peace ko consume kar raha hai. Dedicated workspace banana aur rest areas ko clutter-free rakhna bahut zaruri hai.",
  "puja/mantra space":
    "Ghar mein ek jagah jo specifically mantra path, meditation ya spiritual practice ke liye reserve hai — chahe choti si bhi — bahut powerful positive energy create karti hai. Yeh space regularly use karna ghar ke vaasion ke mental clarity aur protection ko badhata hai. Yahan ka mahaul peaceful aur clutter-free hona sabse zyada zaroori hai.",
  "pilgrimage objects":
    "Ghar mein teerth yatrao se laai hui cheezein — mitti, jal, prasad ya religious items — ka hona Brihaspati ya Chandra ki dharmic urja ka prateek hai. Yeh cheezein ghar mein ancestors aur divine protection ka ehsaas deti hain. Inhe saaf aur mandir ke paas rakhna ghar ki spiritual protection ko strengthen karta hai.",
  "construction nearby":
    "Ghar ke bilkul aas-paas agar construction chal rahi hai — naya building, road khatam — to yeh Mangal ki action urja ka bahari prabhav hai. Thodi construction short-term tarakki ka sanket ho sakti hai, lekin lambi construction noise, dust aur disruption se ghar ki peace ko prabhavit karta hai. Is dauran grounding upaya aur patience important hai.",
  "workshop/office/industrial area":
    "Ghar ke pass ya ek hisse mein industrial tools, machines ya professional equipment ka hona Mangal ya Shani ki karma-urja ka prabhav hai. Yeh ghar ko ek active, work-oriented zone banaata hai. Is area ko organized rakhna productive hai, lekin isko ghar ke rest areas se clearly separate karna — doors ya dividers se — peace aur work-life balance ke liye important hai.",
  "tools/machinery":
    "Ghar mein ya ghar ke paas heavy tools, machines ya technical equipment ka hona Mangal aur Shani ki mehnat-urja hai. Yeh positive tab hai jab yeh tools active aur well-maintained hain — rusted, broken ya band machines stagnant energy ka symbol hain jo progress rok sakti hai. Kaam na aane wali machinery hata dena ya donate kar dena better hai.",
  "social/status area":
    "Ghar mein ek area — jaise living room ya baithak — jo clearly social aur status-display ke liye use hota hai, Surya ya Shani ki social urja ka prabhav hai. Yeh area visitors ko impress karta hai aur ghar ki public image set karta hai. Is area ko well-decorated, clean aur status-appropriate rakhna ghar ke vaasion ki social position ko support karta hai.",
  "social gathering space":
    "Ghar mein ek aisi jagah jo naturally logon ko saath laati hai — jaise open kitchen, big dining table, baithak — Chandra ya Shukra ki community energy ka prabhav hai. Yeh ghar logon ka dil jeetne wala hota hai. Yahan khushiyan baantna is graha ko aur strong karta hai — closed, isolated ghar is energy ke bilkul opposite hota hai.",
  "public recognition objects":
    "Ghar mein wo cheezein jo public recognition ko darshati hain — news clips, social media screenshots in frames, community awards — is graha ki public identity ki zaroorat ko darshati hain. Yeh positive hai, lekin sirf past achievements pe stuck rehna forward progress ko rok sakta hai. New goals aur aspirations ko bhi display karna energetically helpful hota hai.",
  "quiet bedroom":
    "Bedroom ka peaceful, private aur disturb-na-hone-wala hona is graha — especially Chandra ya Shukra ke 12th house — ke liye bahut important hai. Ek noisy, chaotic ya digital-device-heavy bedroom is graha ki spiritual ya emotional needs ko disturb karta hai. Bedroom ko screen-free aur serene rakhna is dasha mein healing priority hai.",
  "foreign/spiritual objects":
    "Ghar mein kisi doosre desh se laai hui cheezein, foreign currency, ya spiritual objects jo travels mein mile hain, is graha ke foreign connection ya spiritual isolation energy ko darshate hain. Yeh cheezein ek interesting story hold karti hain. Inhe ghar ke ek peaceful corner mein rakhna is urja ko grounded rakhta hai.",
  "hospital/ashram-like surroundings":
    "Ghar ke aas-paas agar hospital, ashram ya koi badi spiritual ya service institution hai to yeh is graha ki 12th house energy hai — seva, healing aur seclusion ka mahaul natural hi banta hai. Yeh neighbors aur surroundings ghar ke vaasion ki psychology ko influence karte hain. Is environment se peace leni chahiye, na ki usse resist karna chahiye.",
  "water near sleeping area":
    "Sone ki jagah ke bilkul paas paani — jaise aquarium, water bottle ya bathroom — ka hona Chandra ki deep subconscious urja ko activate karta hai. Yeh sapnon ko vivid banata hai aur neend ki quality ko prabhavit kar sakta hai. Bedroom mein paani rakhna agar neend disrupt ho rahi hai to avoid karna chahiye, warna thoda paani — jaise ek sealed bottle — manageable hai.",
  "water near temple area":
    "Mandir ya puja sthan ke paas paani ka koi source — matka, holy water, ya fountain — rakhna Brihaspati ya Chandra ki dharmik urja ko bahut amplify karta hai. Yeh arrangement ghar ki spiritual atmosphere ko elevate karti hai. Paani ko roz badalna — fresh aur saaf rakhna — is arrangement ki effectiveness ke liye critical hai.",
  "soft/dim room":
    "Ghar mein ya kisi specific room mein soft, dim ya moonlight-jaisi lighting ka hona Chandra ki dreamy aur introvert urja ko reflect karta hai. Yeh ghar mein creativity, intuition aur privacy ko support karta hai. Lekin agar yeh dimness depression ya isolation ki taraf ja rahi hai to thodi natural light introduce karna — subah ki dhoop — important hai.",
  "old family objects":
    "Ghar mein purani family heirlooms — purani photos, old furniture, ancestral gifts — ka hona ancestors aur pichli pidhi se deep karmic connection darshata hai. Yeh cheezein ghar mein history aur roots ka ehsaas deti hain. Inhe respect ke saath rakhna chahiye — tuti ya gandhi puraniyan cheezein hata kar unhe proper farewell dena healing hota hai.",
  "ancestral objects":
    "Ghar mein pita, dada ya pichli pidhi se aai koi vastu — property deed, old jewelry, purani kitab — is graha ke pitra karma ka prateek hai. Yeh cheezein ek taraf ghar ko roots deti hain, doosri taraf pichle janam ya pichli pidiyon ke unresolved karma ko bhi hold karti hain. Inhe roz ek baar namaskar karna pitra rin ko dhire-dhire kam karta hai.",
  "old official documents":
    "Ghar mein purane sarkari papers — zameen ke kaagzaat, purane court documents, legal files — ka hona is graha ke 8th house mein hone ka sanket hai. Yeh documents ek taraf ghar ki legal history hain, doosri taraf inka pending rehna unresolved ancestral matters ka sign hai. Inhe theek karna ya legally resolve karna is dasha mein priority honi chahiye.",
};

// House number to Hindi ordinal
const H_ORD = ["","pehle","doosre","teesre","chauthe","paanchve","chhathe","saatve","aathve","nauwe","dasave","gyarahve","barahve"];

// Wraps a short domain text in planet/house/status context to make it 3-4 lines
function richReading(
  planet: string, h: number,
  raw: string,
  status: "pakka"|"dushman"|"sadharan",
  state:  "nek"|"neutral"|"mandi"
): string {
  const ord = H_ORD[h] || `${h}ve`;
  const statusNote =
    status === "pakka"
      ? `Yeh ${planet} ka sabse zyada anukool sthaan hai — yahan yeh bahut mazbut hota hai aur seedhe achhe results deta hai.`
      : status === "dushman"
      ? `Yeh ${planet} ke liye ek kathin sthaan hai — yahan sangharsh aa sakta hai, lekin sahi upaya se situation mein sudhaar possible hai.`
      : `Yeh ek madhyam sthaan hai jahan ${planet} ke results mixed aate hain, dasha aur transit ke anusaar prabhav badalta rehta hai.`;
  const stateNote =
    state === "nek"
      ? `Is waqt yeh graha aapke liye ek anukool dour mein chal raha hai — results jald aur sakaratmak ho sakte hain.`
      : state === "mandi"
      ? `Abhi is grah ki energy mein thodi rukawat hai — upaya aur sabr dono zaroori hain, results delayed aayenge lekin aayenge.`
      : `Is graha ke results dasha-antardasha ke saath zyada clearly saamne aate hain — dasha period mein yeh area especially active rehta hai.`;
  return `${planet} aapke ${ord} ghar mein sthit hai. ${statusNote} ${raw} ${stateNote}`;
}

// Expand a short homeEnv tag into a descriptive paragraph
function expandHomeTag(tag: string, planet: string): string {
  if (HOME_ENV_DESC[tag]) return HOME_ENV_DESC[tag];
  const cleaned = tag.charAt(0).toUpperCase() + tag.slice(1);
  return `${cleaned} ka ghar mein hona ${planet} ki urja ka ek seedha prabhav hai. Yeh sanket batata hai ki is grah ka prabhav aapke ghar ke mahaul mein clearly dikh raha hai. Is jagah ko saadar aur organized rakhna is grah ke aashirwaad ko barkarar rakhta hai.`;
}

// ── Classical Lal Kitab 1952 Varshphal 120-Year Progression Table (Pt. Roop Chand Joshi) ──
// Maps Natal House (1-12) to Annual Progressed House for Running Age (1-120)
export const LK_1952_VARSHPHAL_TABLE: Record<number, Record<number, number>> = {
  // Cycle 1 (Ages 1 - 12)
  1: { 1: 1, 2: 9, 3: 10, 4: 3, 5: 5, 6: 2, 7: 11, 8: 7, 9: 6, 10: 12, 11: 4, 12: 8 },
  2: { 1: 4, 2: 1, 3: 12, 4: 9, 5: 3, 6: 7, 7: 5, 8: 6, 9: 2, 10: 8, 11: 10, 12: 11 },
  3: { 1: 9, 2: 4, 3: 1, 4: 2, 5: 8, 6: 3, 7: 10, 8: 5, 9: 7, 10: 11, 11: 12, 12: 6 },
  4: { 1: 3, 2: 8, 3: 4, 4: 1, 5: 10, 6: 9, 7: 6, 8: 11, 9: 5, 10: 7, 11: 2, 12: 12 },
  5: { 1: 11, 2: 3, 3: 8, 4: 4, 5: 1, 6: 5, 7: 9, 8: 2, 9: 12, 10: 6, 11: 7, 12: 10 },
  6: { 1: 5, 2: 12, 3: 3, 4: 8, 5: 4, 6: 11, 7: 2, 8: 9, 9: 1, 10: 10, 11: 6, 12: 7 },
  7: { 1: 7, 2: 6, 3: 9, 4: 5, 5: 12, 6: 4, 7: 1, 8: 10, 9: 11, 10: 2, 11: 8, 12: 3 },
  8: { 1: 2, 2: 7, 3: 6, 4: 12, 5: 9, 6: 10, 7: 3, 8: 1, 9: 8, 10: 5, 11: 11, 12: 4 },
  9: { 1: 12, 2: 2, 3: 7, 4: 6, 5: 11, 6: 1, 7: 8, 8: 4, 9: 10, 10: 3, 11: 5, 12: 9 },
  10: { 1: 10, 2: 11, 3: 2, 4: 7, 5: 6, 6: 12, 7: 4, 8: 8, 9: 3, 10: 1, 11: 9, 12: 5 },
  11: { 1: 8, 2: 5, 3: 11, 4: 10, 5: 7, 6: 6, 7: 12, 8: 3, 9: 9, 10: 4, 11: 1, 12: 2 },
  12: { 1: 6, 2: 10, 3: 5, 4: 11, 5: 2, 6: 8, 7: 7, 8: 12, 9: 4, 10: 9, 11: 3, 12: 1 },
  // Cycle 2 (Ages 13 - 24)
  13: { 1: 1, 2: 5, 3: 10, 4: 8, 5: 11, 6: 6, 7: 7, 8: 2, 9: 12, 10: 3, 11: 9, 12: 4 },
  14: { 1: 4, 2: 1, 3: 3, 4: 2, 5: 5, 6: 7, 7: 8, 8: 11, 9: 6, 10: 12, 11: 10, 12: 9 },
  15: { 1: 9, 2: 4, 3: 1, 4: 6, 5: 8, 6: 5, 7: 2, 8: 7, 9: 11, 10: 10, 11: 12, 12: 3 },
  16: { 1: 3, 2: 9, 3: 4, 4: 1, 5: 12, 6: 8, 7: 6, 8: 5, 9: 2, 10: 7, 11: 11, 12: 10 },
  17: { 1: 11, 2: 3, 3: 9, 4: 4, 5: 1, 6: 10, 7: 5, 8: 6, 9: 7, 10: 8, 11: 2, 12: 12 },
  18: { 1: 5, 2: 11, 3: 6, 4: 9, 5: 4, 6: 1, 7: 12, 8: 8, 9: 10, 10: 2, 11: 3, 12: 7 },
  19: { 1: 7, 2: 10, 3: 11, 4: 3, 5: 9, 6: 4, 7: 1, 8: 12, 9: 8, 10: 5, 11: 6, 12: 2 },
  20: { 1: 2, 2: 7, 3: 5, 4: 12, 5: 3, 6: 9, 7: 10, 8: 1, 9: 4, 10: 6, 11: 8, 12: 11 },
  21: { 1: 12, 2: 2, 3: 8, 4: 5, 5: 10, 6: 3, 7: 9, 8: 4, 9: 1, 10: 11, 11: 7, 12: 6 },
  22: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 6, 6: 11, 7: 3, 8: 9, 9: 5, 10: 1, 11: 4, 12: 8 },
  23: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 7, 6: 2, 7: 11, 8: 3, 9: 9, 10: 4, 11: 1, 12: 5 },
  24: { 1: 6, 2: 8, 3: 7, 4: 11, 5: 2, 6: 12, 7: 4, 8: 10, 9: 3, 10: 9, 11: 5, 12: 1 },
  // Cycle 3 (Ages 25 - 36)
  25: { 1: 1, 2: 6, 3: 10, 4: 3, 5: 2, 6: 8, 7: 7, 8: 4, 9: 11, 10: 5, 11: 12, 12: 9 },
  26: { 1: 4, 2: 1, 3: 3, 4: 8, 5: 6, 6: 7, 7: 2, 8: 11, 9: 12, 10: 9, 11: 5, 12: 10 },
  27: { 1: 9, 2: 4, 3: 1, 4: 5, 5: 10, 6: 11, 7: 12, 8: 7, 9: 6, 10: 8, 11: 2, 12: 3 },
  28: { 1: 3, 2: 9, 3: 4, 4: 1, 5: 11, 6: 5, 7: 6, 8: 8, 9: 7, 10: 2, 11: 10, 12: 12 },
  29: { 1: 11, 2: 3, 3: 9, 4: 4, 5: 1, 6: 6, 7: 8, 8: 2, 9: 10, 10: 12, 11: 7, 12: 5 },
  30: { 1: 5, 2: 11, 3: 8, 4: 9, 5: 4, 6: 1, 7: 3, 8: 12, 9: 2, 10: 10, 11: 6, 12: 7 },
  31: { 1: 7, 2: 5, 3: 11, 4: 12, 5: 9, 6: 4, 7: 1, 8: 10, 9: 8, 10: 6, 11: 3, 12: 2 },
  32: { 1: 2, 2: 7, 3: 5, 4: 11, 5: 3, 6: 12, 7: 10, 8: 6, 9: 4, 10: 1, 11: 9, 12: 8 },
  33: { 1: 12, 2: 2, 3: 6, 4: 10, 5: 8, 6: 3, 7: 9, 8: 1, 9: 5, 10: 7, 11: 4, 12: 11 },
  34: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 5, 6: 9, 7: 11, 8: 3, 9: 1, 10: 4, 11: 8, 12: 6 },
  35: { 1: 8, 2: 10, 3: 12, 4: 6, 5: 7, 6: 2, 7: 4, 8: 5, 9: 9, 10: 3, 11: 11, 12: 1 },
  36: { 1: 6, 2: 8, 3: 7, 4: 2, 5: 12, 6: 10, 7: 5, 8: 9, 9: 3, 10: 11, 11: 1, 12: 4 },
  // Cycle 4 (Ages 37 - 48)
  37: { 1: 1, 2: 3, 3: 10, 4: 6, 5: 9, 6: 12, 7: 7, 8: 5, 9: 11, 10: 2, 11: 4, 12: 8 },
  38: { 1: 4, 2: 1, 3: 3, 4: 8, 5: 6, 6: 5, 7: 2, 8: 7, 9: 12, 10: 10, 11: 11, 12: 9 },
  39: { 1: 9, 2: 4, 3: 1, 4: 12, 5: 8, 6: 2, 7: 10, 8: 11, 9: 6, 10: 3, 11: 5, 12: 7 },
  40: { 1: 3, 2: 9, 3: 4, 4: 1, 5: 11, 6: 8, 7: 6, 8: 12, 9: 2, 10: 5, 11: 7, 12: 10 },
  41: { 1: 11, 2: 7, 3: 9, 4: 4, 5: 1, 6: 6, 7: 8, 8: 2, 9: 10, 10: 12, 11: 3, 12: 5 },
  42: { 1: 5, 2: 11, 3: 8, 4: 9, 5: 12, 6: 1, 7: 3, 8: 4, 9: 7, 10: 6, 11: 10, 12: 2 },
  43: { 1: 7, 2: 5, 3: 11, 4: 2, 5: 3, 6: 4, 7: 1, 8: 10, 9: 8, 10: 9, 11: 12, 12: 6 },
  44: { 1: 2, 2: 10, 3: 5, 4: 3, 5: 4, 6: 9, 7: 12, 8: 8, 9: 1, 10: 7, 11: 6, 12: 11 },
  45: { 1: 12, 2: 2, 3: 6, 4: 5, 5: 10, 6: 7, 7: 9, 8: 1, 9: 3, 10: 11, 11: 8, 12: 4 },
  46: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 5, 6: 3, 7: 11, 8: 6, 9: 4, 10: 8, 11: 9, 12: 1 },
  47: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 7, 6: 11, 7: 4, 8: 9, 9: 5, 10: 1, 11: 2, 12: 3 },
  48: { 1: 6, 2: 8, 3: 7, 4: 11, 5: 2, 6: 10, 7: 5, 8: 3, 9: 9, 10: 4, 11: 1, 12: 12 },
  // Cycle 5 (Ages 49 - 60)
  49: { 1: 1, 2: 7, 3: 10, 4: 6, 5: 12, 6: 2, 7: 8, 8: 4, 9: 11, 10: 9, 11: 3, 12: 5 },
  50: { 1: 4, 2: 1, 3: 8, 4: 3, 5: 6, 6: 12, 7: 5, 8: 11, 9: 2, 10: 7, 11: 10, 12: 9 },
  51: { 1: 9, 2: 4, 3: 1, 4: 2, 5: 8, 6: 3, 7: 12, 8: 6, 9: 7, 10: 10, 11: 5, 12: 11 },
  52: { 1: 3, 2: 9, 3: 4, 4: 1, 5: 11, 6: 7, 7: 2, 8: 12, 9: 5, 10: 8, 11: 6, 12: 10 },
  53: { 1: 11, 2: 10, 3: 7, 4: 4, 5: 1, 6: 6, 7: 3, 8: 9, 9: 12, 10: 5, 11: 8, 12: 2 },
  54: { 1: 5, 2: 11, 3: 3, 4: 9, 5: 4, 6: 1, 7: 6, 8: 2, 9: 10, 10: 12, 11: 7, 12: 8 },
  55: { 1: 7, 2: 5, 3: 11, 4: 8, 5: 3, 6: 9, 7: 1, 8: 10, 9: 6, 10: 4, 11: 2, 12: 12 },
  56: { 1: 2, 2: 3, 3: 5, 4: 11, 5: 9, 6: 4, 7: 10, 8: 1, 9: 8, 10: 6, 11: 12, 12: 7 },
  57: { 1: 12, 2: 2, 3: 6, 4: 5, 5: 10, 6: 8, 7: 9, 8: 7, 9: 4, 10: 11, 11: 1, 12: 3 },
  58: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 5, 6: 11, 7: 4, 8: 8, 9: 3, 10: 1, 11: 9, 12: 6 },
  59: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 7, 6: 5, 7: 11, 8: 3, 9: 9, 10: 2, 11: 4, 12: 1 },
  60: { 1: 6, 2: 8, 3: 9, 4: 12, 5: 2, 6: 10, 7: 7, 8: 5, 9: 1, 10: 3, 11: 11, 12: 4 },
  // Cycle 6 (Ages 61 - 72)
  61: { 1: 1, 2: 11, 3: 10, 4: 6, 5: 12, 6: 2, 7: 4, 8: 7, 9: 8, 10: 9, 11: 5, 12: 3 },
  62: { 1: 4, 2: 1, 3: 6, 4: 8, 5: 3, 6: 12, 7: 2, 8: 10, 9: 9, 10: 5, 11: 7, 12: 11 },
  63: { 1: 9, 2: 4, 3: 1, 4: 2, 5: 8, 6: 6, 7: 12, 8: 11, 9: 7, 10: 3, 11: 10, 12: 5 },
  64: { 1: 3, 2: 9, 3: 4, 4: 1, 5: 6, 6: 8, 7: 7, 8: 12, 9: 5, 10: 2, 11: 11, 12: 10 },
  65: { 1: 11, 2: 2, 3: 9, 4: 4, 5: 1, 6: 5, 7: 8, 8: 3, 9: 10, 10: 12, 11: 6, 12: 7 },
  66: { 1: 5, 2: 10, 3: 3, 4: 9, 5: 2, 6: 1, 7: 6, 8: 8, 9: 11, 10: 7, 11: 12, 12: 4 },
  67: { 1: 7, 2: 5, 3: 11, 4: 3, 5: 10, 6: 4, 7: 1, 8: 9, 9: 12, 10: 6, 11: 8, 12: 2 },
  68: { 1: 2, 2: 3, 3: 5, 4: 11, 5: 9, 6: 7, 7: 10, 8: 1, 9: 6, 10: 8, 11: 4, 12: 12 },
  69: { 1: 12, 2: 8, 3: 7, 4: 5, 5: 11, 6: 3, 7: 9, 8: 4, 9: 1, 10: 10, 11: 2, 12: 6 },
  70: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 5, 6: 11, 7: 3, 8: 6, 9: 4, 10: 1, 11: 9, 12: 8 },
  71: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 7, 6: 9, 7: 11, 8: 5, 9: 2, 10: 4, 11: 3, 12: 1 },
  72: { 1: 6, 2: 7, 3: 8, 4: 12, 5: 4, 6: 10, 7: 5, 8: 2, 9: 3, 10: 11, 11: 1, 12: 9 },
  // Cycle 7 (Ages 73 - 84)
  73: { 1: 1, 2: 4, 3: 10, 4: 6, 5: 12, 6: 11, 7: 7, 8: 8, 9: 2, 10: 5, 11: 9, 12: 3 },
  74: { 1: 4, 2: 2, 3: 3, 4: 8, 5: 6, 6: 12, 7: 1, 8: 11, 9: 7, 10: 10, 11: 5, 12: 9 },
  75: { 1: 9, 2: 10, 3: 1, 4: 3, 5: 8, 6: 6, 7: 2, 8: 7, 9: 5, 10: 4, 11: 12, 12: 11 },
  76: { 1: 3, 2: 9, 3: 6, 4: 1, 5: 2, 6: 8, 7: 5, 8: 11, 9: 12, 10: 7, 11: 10, 12: 4 },
  77: { 1: 11, 2: 3, 3: 9, 4: 4, 5: 1, 6: 2, 7: 8, 8: 10, 9: 12, 10: 6, 11: 7, 12: 5 },
  78: { 1: 5, 2: 11, 3: 4, 4: 9, 5: 7, 6: 1, 7: 6, 8: 2, 9: 10, 10: 12, 11: 3, 12: 8 },
  79: { 1: 7, 2: 5, 3: 11, 4: 2, 5: 9, 6: 4, 7: 12, 8: 6, 9: 3, 10: 1, 11: 8, 12: 10 },
  80: { 1: 2, 2: 8, 3: 5, 4: 11, 5: 4, 6: 7, 7: 10, 8: 3, 9: 1, 10: 9, 11: 6, 12: 12 },
  81: { 1: 12, 2: 1, 3: 7, 4: 5, 5: 11, 6: 10, 7: 9, 8: 4, 9: 8, 10: 3, 11: 2, 12: 6 },
  82: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 5, 6: 3, 7: 4, 8: 9, 9: 6, 10: 8, 11: 11, 12: 1 },
  83: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 3, 6: 5, 7: 11, 8: 1, 9: 9, 10: 2, 11: 4, 12: 7 },
  84: { 1: 6, 2: 7, 3: 8, 4: 12, 5: 10, 6: 9, 7: 3, 8: 5, 9: 4, 10: 11, 11: 1, 12: 2 },
  // Cycle 8 (Ages 85 - 96)
  85: { 1: 1, 2: 3, 3: 10, 4: 6, 5: 12, 6: 2, 7: 8, 8: 11, 9: 5, 10: 4, 11: 9, 12: 7 },
  86: { 1: 4, 2: 1, 3: 8, 4: 3, 5: 6, 6: 12, 7: 11, 8: 2, 9: 7, 10: 9, 11: 10, 12: 5 },
  87: { 1: 9, 2: 4, 3: 1, 4: 7, 5: 3, 6: 8, 7: 12, 8: 5, 9: 2, 10: 6, 11: 11, 12: 10 },
  88: { 1: 3, 2: 9, 3: 4, 4: 1, 5: 8, 6: 10, 7: 2, 8: 7, 9: 12, 10: 5, 11: 6, 12: 11 },
  89: { 1: 11, 2: 10, 3: 9, 4: 4, 5: 1, 6: 6, 7: 7, 8: 12, 9: 3, 10: 8, 11: 5, 12: 2 },
  90: { 1: 5, 2: 11, 3: 6, 4: 9, 5: 4, 6: 1, 7: 3, 8: 8, 9: 10, 10: 2, 11: 7, 12: 12 },
  91: { 1: 7, 2: 5, 3: 11, 4: 2, 5: 10, 6: 4, 7: 6, 8: 9, 9: 8, 10: 3, 11: 12, 12: 1 },
  92: { 1: 2, 2: 7, 3: 5, 4: 11, 5: 9, 6: 3, 7: 10, 8: 4, 9: 1, 10: 12, 11: 8, 12: 6 },
  93: { 1: 12, 2: 8, 3: 7, 4: 5, 5: 2, 6: 11, 7: 9, 8: 1, 9: 6, 10: 10, 11: 3, 12: 4 },
  94: { 1: 10, 2: 12, 3: 2, 4: 8, 5: 11, 6: 5, 7: 4, 8: 6, 9: 9, 10: 7, 11: 1, 12: 3 },
  95: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 5, 6: 7, 7: 1, 8: 3, 9: 4, 10: 11, 11: 2, 12: 9 },
  96: { 1: 6, 2: 2, 3: 3, 4: 12, 5: 7, 6: 9, 7: 5, 8: 10, 9: 11, 10: 1, 11: 4, 12: 8 },
  // Cycle 9 (Ages 97 - 108)
  97: { 1: 1, 2: 9, 3: 10, 4: 6, 5: 12, 6: 2, 7: 7, 8: 5, 9: 3, 10: 4, 11: 8, 12: 11 },
  98: { 1: 4, 2: 1, 3: 6, 4: 8, 5: 10, 6: 12, 7: 11, 8: 2, 9: 9, 10: 7, 11: 3, 12: 5 },
  99: { 1: 9, 2: 4, 3: 1, 4: 2, 5: 6, 6: 8, 7: 12, 8: 11, 9: 5, 10: 3, 11: 10, 12: 7 },
  100: { 1: 3, 2: 10, 3: 8, 4: 1, 5: 5, 6: 7, 7: 6, 8: 12, 9: 2, 10: 9, 11: 11, 12: 4 },
  101: { 1: 11, 2: 3, 3: 9, 4: 4, 5: 1, 6: 6, 7: 8, 8: 10, 9: 7, 10: 5, 11: 12, 12: 2 },
  102: { 1: 5, 2: 11, 3: 3, 4: 9, 5: 4, 6: 1, 7: 2, 8: 6, 9: 8, 10: 12, 11: 7, 12: 10 },
  103: { 1: 7, 2: 5, 3: 11, 4: 3, 5: 9, 6: 4, 7: 1, 8: 8, 9: 12, 10: 10, 11: 2, 12: 6 },
  104: { 1: 2, 2: 7, 3: 5, 4: 11, 5: 3, 6: 9, 7: 10, 8: 1, 9: 6, 10: 8, 11: 4, 12: 12 },
  105: { 1: 12, 2: 2, 3: 4, 4: 5, 5: 11, 6: 3, 7: 9, 8: 7, 9: 10, 10: 6, 11: 1, 12: 8 },
  106: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 8, 6: 5, 7: 3, 8: 9, 9: 4, 10: 11, 11: 6, 12: 1 },
  107: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 7, 6: 11, 7: 4, 8: 3, 9: 1, 10: 2, 11: 5, 12: 9 },
  108: { 1: 6, 2: 8, 3: 7, 4: 12, 5: 2, 6: 10, 7: 5, 8: 4, 9: 11, 10: 1, 11: 9, 12: 3 },
  // Cycle 10 (Ages 109 - 120)
  109: { 1: 1, 2: 6, 3: 10, 4: 3, 5: 9, 6: 11, 7: 5, 8: 7, 9: 2, 10: 12, 11: 8, 12: 4 },
  110: { 1: 4, 2: 1, 3: 6, 4: 8, 5: 10, 6: 12, 7: 3, 8: 5, 9: 7, 10: 2, 11: 11, 12: 9 },
  111: { 1: 9, 2: 4, 3: 1, 4: 2, 5: 5, 6: 8, 7: 12, 8: 10, 9: 6, 10: 7, 11: 3, 12: 11 },
  112: { 1: 3, 2: 10, 3: 8, 4: 9, 5: 11, 6: 7, 7: 4, 8: 1, 9: 2, 10: 12, 11: 6, 12: 5 },
  113: { 1: 11, 2: 3, 3: 9, 4: 4, 5: 1, 6: 6, 7: 2, 8: 7, 9: 10, 10: 5, 11: 8, 12: 12 },
  114: { 1: 5, 2: 11, 3: 3, 4: 1, 5: 4, 6: 10, 7: 6, 8: 8, 9: 12, 10: 9, 11: 7, 12: 2 },
  115: { 1: 7, 2: 5, 3: 11, 4: 3, 5: 9, 6: 4, 7: 1, 8: 12, 9: 8, 10: 10, 11: 2, 12: 6 },
  116: { 1: 2, 2: 7, 3: 5, 4: 11, 5: 3, 6: 9, 7: 10, 8: 6, 9: 4, 10: 8, 11: 12, 12: 1 },
  117: { 1: 12, 2: 2, 3: 4, 4: 5, 5: 6, 6: 1, 7: 8, 8: 9, 9: 3, 10: 11, 11: 10, 12: 7 },
  118: { 1: 10, 2: 12, 3: 2, 4: 7, 5: 8, 6: 11, 7: 9, 8: 3, 9: 1, 10: 6, 11: 5, 12: 4 },
  119: { 1: 8, 2: 6, 3: 12, 4: 10, 5: 7, 6: 5, 7: 11, 8: 2, 9: 9, 10: 4, 11: 1, 12: 3 },
  120: { 1: 6, 2: 8, 3: 7, 4: 12, 5: 2, 6: 3, 7: 5, 8: 4, 9: 11, 10: 1, 11: 9, 12: 10 },
};

export function getLalKitabVarshphalHouse(natalHouse: number, runningAge: number): number {
  const effectiveAge = (((runningAge - 1) % 120) + 120) % 120 + 1;
  return LK_1952_VARSHPHAL_TABLE[effectiveAge]?.[natalHouse] ?? natalHouse;
}

// ── MAIN CALCULATOR ───────────────────────────────────────
export function calculateLalKitab(
  planets: Record<string,PD>,
  dob:     string,
  lagnaNum = 0,
  targetDate = new Date()
): LKResult {
  const birthYear  = parseLKDate(dob).getFullYear();
  const runningVarsh = getRunningVarsh(dob, targetDate);
  const currentAge = runningVarsh.completedYears;

  // ── conditionScore ────────────────────────────────────
  function conditionScore(planet: string): { score: number; state: "nek"|"neutral"|"mandi" } {
    const pd = planets[planet];
    if (!pd) return { score: 0, state: "neutral" };
    const h = pd.house;
    let score = 0;
    const pakka = LK_PAKKA_PRIMARY[planet];
    const dist  = Math.min(Math.abs(h - pakka), 12 - Math.abs(h - pakka));
    if (h === pakka)    score += 22;
    else if (dist === 1) score += 8;
    else if (dist === 2) score += 4;
    // Malefic in upachaya
    if ([6,10,11].includes(h) && ["Saturn","Mars","Rahu"].includes(planet)) score += 8;
    // Benefic in trikona
    if ([5,9].includes(h) && ["Jupiter","Sun","Moon"].includes(planet)) score += 8;
    // Afflicted houses for soft planets
    if ([6,8,12].includes(h) && ["Moon","Venus"].includes(planet)) score -= 8;
    // House mates
    PLS.forEach(m => {
      if (m === planet || !planets[m] || planets[m].house !== h) return;
      if ((LK_FRIENDS[planet]||[]).includes(m)) score += 7;
      if ((LK_ENEMY_PLANET[planet]||[]).includes(m)) score -= 9;
    });
    // Age factor
    const actAge = LK_ACT_AGE[planet] || 25;
    if (currentAge >= actAge) score += 6;
    if (Math.abs(currentAge - actAge) <= 3) score += 8;
    // Node special
    if (["Rahu"].includes(planet) && [3,6,10,11].includes(h)) score += 10;
    if (["Ketu"].includes(planet) && [3,6,9,12].includes(h)) score += 10;
    if (["Rahu","Ketu"].includes(planet) && [1,5,7,8,9,12].includes(h)) score -= 5;

    const state: "nek"|"neutral"|"mandi" =
      score >= 20 ? "nek" : score <= -10 ? "mandi" : "neutral";
    return { score, state };
  }

  function domainScore(planet: string): number {
    const pd = planets[planet];
    if (!pd) return 50;
    const h = pd.house;
    const hBonus: Record<number,number> = {1:5,2:6,3:4,4:5,5:8,6:7,7:5,8:-5,9:9,10:9,11:8,12:-4};
    const { score } = conditionScore(planet);
    return Math.max(5, Math.min(95, Math.round(50 + (hBonus[h] || 0) + score)));
  }

  // ── Planet cards ──────────────────────────────────────
  const lkPlanets: LKPlanet[] = PLS.map((planet, pi) => {
    const pd = planets[planet];
    if (!pd) return null;
    const h = pd.house;

    const inPakka   = LK_PAKKA[planet]?.includes(h);
    const inDushman = LK_ENEMY[planet]?.includes(h);
    const status    = inPakka ? "pakka" : inDushman ? "dushman" : "sadharan";
    const statusLabel = inPakka ? "✅ Pakka Ghar" : inDushman ? "❌ Dushman Ghar" : "⚡ Sadharan";
    const statusColor = inPakka ? "#22c55e" : inDushman ? "#ef4444" : "#f59e0b";

    const { state } = conditionScore(planet);
    const finalScore = domainScore(planet);

    // Hindi nishani + upaya
    const nishani = LK_NISHANI[planet]?.[h] ||
      `H${h} mein ${planet} active hai. Life ka yeh area especially highlighted hoga.`;
    const upaya = LK_UPAYA[planet]?.[h] ||
      `${planet} ke din upaya karein. 108 baar mantra jaap.`;
    const rin = LK_RIN[h] || "";

    // Rich domain readings from knowledge base
    const rule = PLANET_HOUSE_RULES[planet]?.[h];
    const career    = richReading(planet, h, rule?.career     || `Career aur professional life pe is ghar ka khaas prabhav hai.`,     status, state);
    const money     = richReading(planet, h, rule?.money      || `Dhan aur arthik stithi pe is ghar ki urja seedha asar dalti hai.`,  status, state);
    const marriage  = richReading(planet, h, rule?.marriage   || `Vivah aur rishton pe is ghar ka vishesh prabhav rehta hai.`,       status, state);
    const family    = richReading(planet, h, rule?.family     || `Parivar aur gharelu mahaul pe is ghar ka prabhav hai.`,           status, state);
    const health    = richReading(planet, h, rule?.health     || `Swasthya aur shareer ke certain areas pe dhyan rakhna hoga.`,     status, state);
    const psychology= richReading(planet, h, rule?.psychology || `Mansik swaroop aur sochne ka tarika is sthaan se prabhavit hota hai.`, status, state);
    const homeEnv   = (rule?.homeEnvironment || []).map(tag => expandHomeTag(tag, planet));

    const actAge  = LK_ACT_AGE[planet] || 25;
    const actYear = birthYear + actAge;
    const isActNow= Math.abs(currentAge - actAge) <= 3;
    const isPast  = currentAge > actAge + 3;

    const friends = (LK_FRIENDS[planet] || [])
      .filter(f => planets[f] && planets[f].house === h);
    const enemies = (LK_ENEMY_PLANET[planet] || [])
      .filter(e => planets[e] && planets[e].house === h);

    return {
      planet, icon: PEMO[pi], color: PCOL[pi],
      house: h, sign: pd.sign, retrograde: pd.retrograde,
      status, statusLabel, statusColor,
      state, score: finalScore,
      nishani, upaya, rin,
      career, money, marriage, family, health, psychology, homeEnv,
      actAge, actYear, isActNow, isPast,
      friends, enemies,
      triggers: LK_TRIGGERS[h] || [],
      pakkaHouse: LK_PAKKA_PRIMARY[planet] || h,
      neverDonate: state !== "mandi"
        ? (NEVER_DONATE_RULES.find(r => r.planet === planet)?.neverDonate ?? [])
        : [],
    };
  }).filter(Boolean) as LKPlanet[];

  // ── Takkar analysis (Both same-house Yuti and opposite 7th-axis Takkar) ──
  const takkars: LKTakkar[] = [];
  PLS.forEach((p1, i) => {
    PLS.forEach((p2, j) => {
      if (j <= i || !planets[p1] || !planets[p2]) return;
      const h1 = planets[p1].house;
      const h2 = planets[p2].house;
      const sameHouse = h1 === h2;
      const oppositeAxis = Math.abs(h1 - h2) === 6;

      if (!sameHouse && !oppositeAxis) return;

      const isEnemy  = (LK_ENEMY_PLANET[p1]||[]).includes(p2) || (LK_ENEMY_PLANET[p2]||[]).includes(p1);
      const isFriend = (LK_FRIENDS[p1]||[]).includes(p2) || (LK_FRIENDS[p2]||[]).includes(p1);

      const locationText = sameHouse ? `H${h1}` : `H${h1} vs H${h2}`;
      const locationLabel = sameHouse ? `House ${h1} (Yuti)` : `House ${h1} aamne-saamne House ${h2}`;

      // Classical authentic mediator / third-planet remedies for mutual clashes
      let takkarUpaya = "";
      if (isEnemy || !isFriend) {
        if ((p1 === "Sun" && p2 === "Saturn") || (p1 === "Saturn" && p2 === "Sun")) {
          takkarUpaya = "Brihaspati (Guru) ko beech mein layein: Kesar ka tilak lagayein ya mandir mein peela anaj dein; dono ki vastu ek sath daan na karein.";
        } else if ((p1 === "Mars" && p2 === "Saturn") || (p1 === "Saturn" && p2 === "Mars")) {
          takkarUpaya = "Chandra ya Shukra ki shanti lein: Behti nadee mein thoda doodh bahayein, krodh aur lohe se savdhani rakhein.";
        } else if ((p1 === "Moon" && p2 === "Rahu") || (p1 === "Rahu" && p2 === "Moon")) {
          takkarUpaya = "Surya aur Shiva upasana karein. Chaandi ka tukda apne paas rakhein, nasha bilkul na karein.";
        } else if ((p1 === "Venus" && p2 === "Rahu") || (p1 === "Rahu" && p2 === "Venus")) {
          takkarUpaya = "Neeli/kaali cheezein bedroom se door rakhein, jeevansathi ke prati nishtha rakhein, silver dharan karein.";
        } else if ((p1 === "Mars" && p2 === "Mercury") || (p1 === "Mercury" && p2 === "Mars")) {
          takkarUpaya = "Boli par sayyam rakhein, behen ya bhaiyon se vivad na karein, haath mein chaandi ka chhalla pehnein.";
        } else {
          takkarUpaya = "Dono grahon mein jo grah mandi/dushman halat mein ho keval uski shanti karein; nek/supportive grah ki vastu daan na karein.";
        }
      }

      // Check structured takkar rules first
      const takkarRule = TAKKAR_RULES.find(r => r.planets.includes(p1) && r.planets.includes(p2));
      if (takkarRule) {
        takkars.push({
          p1, p2, house: h1, houseLabel: locationLabel,
          effect: `${takkarRule.meaning} (${locationText} mein sakriya).`,
          icons: [PEMO[i], PEMO[j]],
          kind: "enemy",
          upaya: takkarUpaya || "Pehle behavior correction karein, dono planets ki vastu ek sath donate na karein.",
        });
      } else if (isEnemy) {
        takkars.push({
          p1, p2, house: h1, houseLabel: locationLabel,
          effect: `${p1} aur ${p2} ki shatruta hai (${locationText}) — karya mein vilamb ya aapas mein urja ka takraav.`,
          icons: [PEMO[i], PEMO[j]],
          kind: "enemy",
          upaya: takkarUpaya || "Dono mein se keval mandi grah ki shanti karein, nek grah ki vastu preserve rakhein.",
        });
      } else if (isFriend && sameHouse) {
        takkars.push({
          p1, p2, house: h1, houseLabel: locationLabel,
          effect: `${p1} aur ${p2} dono milkar ${locationText} ke phal ko boost karte hain — shubh mitra yog.`,
          icons: [PEMO[i], PEMO[j]],
          kind: "support",
        });
      } else if (sameHouse) {
        takkars.push({
          p1, p2, house: h1, houseLabel: locationLabel,
          effect: `${p1} + ${p2} in ${locationText} — mixed karmic interaction, dasha anusaar prabhav aayega.`,
          icons: [PEMO[i], PEMO[j]],
          kind: "complex",
          upaya: "Pehle dono grahon ki halat alag-alag parkhein; jaldbaazi mein koi daan na karein.",
        });
      }
    });
  });

  // ── Rin Siddhant (Classical 1952 Ancestral Debts) ─────
  const rins: LKRin[] = [];
  const jup = planets["Jupiter"];
  const sun = planets["Sun"];
  const rahu = planets["Rahu"];
  const saturn = planets["Saturn"];
  const moon = planets["Moon"];
  const mars = planets["Mars"];
  const venus = planets["Venus"];
  const merc = planets["Mercury"];
  const ketu = planets["Ketu"];

  // 1. Pitru Rin (Forefathers' Debt)
  const isPitruRin = Boolean(
    (jup && [2,5,9,12].includes(jup.house) && (
      (rahu && rahu.house === jup.house) || (saturn && saturn.house === jup.house)
    )) || (sun && sun.house === 9 && rahu && rahu.house === 9)
  );
  if (isPitruRin) {
    rins.push({
      planet: "Jupiter",
      icon: "♃",
      house: jup ? jup.house : 9,
      rin: "Pitru Rin (पूर्वजों का ऋण) — Mandir ya peepal ka anisht ya pita/guru ke aashirwad mein kami.",
      upaya: "Kutumb ke sabhi rakt sambandhiyon se barabar dhan lekar mandir ya dharmik sthal par bhent karein.",
    });
  }

  // 2. Matru Rin (Mother's Debt)
  const isMatruRin = Boolean(
    (moon && [4,8].includes(moon.house) && (
      (ketu && ketu.house === moon.house) || (rahu && rahu.house === moon.house)
    )) || (moon && moon.house === 6 && Boolean(saturn && saturn.house === 6))
  );
  if (isMatruRin && moon) {
    rins.push({
      planet: "Moon",
      icon: "☽",
      house: moon.house,
      rin: "Matru Rin (मातृ ऋण) — Mata ya stree shakti ke prati pichle janam ki laparvahi ya jal ka dushit hona.",
      upaya: "Khandan ke sabhi logon se barabar chandi ikattha karke behti nadee mein pravahit karein.",
    });
  }

  // 3. Stri Rin (Wife's / Feminine Debt)
  const isStriRin = Boolean(
    venus && [2,7].includes(venus.house) && (
      (sun && sun.house === venus.house) || (mars && mars.house === venus.house) || (rahu && rahu.house === venus.house)
    )
  );
  if (isStriRin && venus) {
    rins.push({
      planet: "Venus",
      icon: "♀",
      house: venus.house,
      rin: "Stri Rin (स्त्री ऋण) — Pichle janam mein kisi stree ya jeevansathi ke samman mein aaghat.",
      upaya: "Parivar ke sabhi sadasyon se barabar chawal ikattha karke 100 gaayon ko bhojan karayein.",
    });
  }

  // 4. Bhratri Rin (Sibling / Relatives Debt)
  const isBhratriRin = Boolean(
    (mars && [3,8].includes(mars.house) && merc && merc.house === mars.house) ||
    (merc && [1,8].includes(merc.house) && mars && [1,8].includes(mars.house))
  );
  if (isBhratriRin) {
    rins.push({
      planet: "Mars",
      icon: "♂",
      house: mars ? mars.house : (merc ? merc.house : 3),
      rin: "Bhratri Rin (भ्रातृ ऋण) — Bhaiyon ya mitron ke adhikar ya zameen se juda karmic dosha.",
      upaya: "Khandan ke sabhi sadasyon se barabar paise lekar kisi beemar ya asahay vyakti ki dawa ka prabandh karein.",
    });
  }

  // 5. Shramik / Zameeni Rin (Worker / Labourer Debt)
  const isShramikRin = Boolean(
    saturn && [8,10,11].includes(saturn.house) && (
      (sun && sun.house === saturn.house) || (mars && mars.house === saturn.house)
    )
  );
  if (isShramikRin && saturn) {
    rins.push({
      planet: "Saturn",
      icon: "♄",
      house: saturn.house,
      rin: "Shramik Rin (श्रमिक ऋण) — Mazdooron, daas ya nirdosh garibon ke haq ka hanan.",
      upaya: "Khandan ke sabhi sadasyon se thoda-thoda sarson ka tel aur kaale til lekar garib shramikon ko daan karein.",
    });
  }

  // 6. Kudarati / Sarpa Rin (Nature / Serpent Debt)
  const isKudaratiRin = Boolean(
    (rahu && [6,8,12].includes(rahu.house) && (sun?.house === rahu.house || mars?.house === rahu.house)) ||
    (ketu && [6,8,12].includes(ketu.house) && (sun?.house === ketu.house || saturn?.house === ketu.house))
  );
  if (isKudaratiRin) {
    rins.push({
      planet: rahu && [6,8,12].includes(rahu.house) ? "Rahu" : "Ketu",
      icon: rahu && [6,8,12].includes(rahu.house) ? "☊" : "☋",
      house: rahu && [6,8,12].includes(rahu.house) ? rahu.house : (ketu ? ketu.house : 6),
      rin: "Kudarati / Sarpa Rin (दैवीय / कुदरती ऋण) — Pichle janam mein kisi bejuban pashu ya kudarati vatavaran ko kshati.",
      upaya: "100 dinon tak kutton aur machhliyon ko niyamit bhojan dein; kudarat ke niyam ka samman karein.",
    });
  }

  const hasPitraRin = isPitruRin;

  // ── Teva Classification (Dharmi / Andha / Ratandh / Sadharan) ──
  let tevaType: "Dharmi Teva" | "Andha Teva" | "Ratandh Teva" | "Sadharan Teva" = "Sadharan Teva";
  let tevaExplanation = "Aapka chart sadharan niyamon ke anusaar chalta hai; grahon ke apne-apne swabhavik phal milte hain.";

  // Dharmi Teva: Jupiter in 9 or 11, OR Jupiter conjunct Saturn, OR Moon in 4
  const isDharmi = Boolean(
    (jup && [9, 11].includes(jup.house)) ||
    (jup && saturn && jup.house === saturn.house) ||
    (moon && moon.house === 4)
  );

  // Ratandh Teva: Sun in 7 and Saturn in 1
  const isRatandh = Boolean(sun && saturn && sun.house === 7 && saturn.house === 1);

  // Andha Teva: Mutual enemies in House 10 OR House 10 vacant while 4 and 7 have severe affliction
  const h10Planets = PLS.filter(p => planets[p]?.house === 10);
  const isAndha = (h10Planets.includes("Saturn") && h10Planets.includes("Sun")) ||
    (h10Planets.length === 0 && Boolean(sun && sun.house === 4 && saturn && saturn.house === 7));

  if (isDharmi) {
    tevaType = "Dharmi Teva";
    tevaExplanation = "✨ Dharmi Teva (धर्मी तेवा): Lal Kitab ke anusaar aapki kundali par Ishwariya kripa ka chhatra hai. Yahan paapi grah (Shani, Rahu, Ketu) bhi apna poora ashubh asar nahi de pate aur sankat ke samay adrishya madad mil jaati hai.";
  } else if (isRatandh) {
    tevaType = "Ratandh Teva";
    tevaExplanation = "🌙 Ratandh Teva (रतौंधी तेवा): Surya aur Shani ke aamne-saamne hone se din mein kaam tezi se bante hain, kintu raat ke faisle ya andhere mein kiye gaye samjhaute mein vishesh savdhani zaroori hai.";
  } else if (isAndha) {
    tevaType = "Andha Teva";
    tevaExplanation = "⚡ Andha Teva (अंधा तेवा): Dasham sthan (karma) par dristi ya urja ki rukawat ke karan mehnat ka pura fal dikhne mein vilamb hota hai. Upaya: 10 andhon ko bhojan karayein aur karma sthal par imaandari rakhein.";
  }

  // ── Combinations ──────────────────────────────────────
  const ruledCombinations: LKCombination[] = COMBINATION_RULES.filter(rule => {
    const p1 = planets[rule.planets[0]];
    const p2 = planets[rule.planets[1]];
    return p1 && p2 && p1.house === p2.house;
  }).map(rule => ({
    id:         rule.id,
    planets:    rule.planets,
    title:      rule.title,
    prediction: rule.prediction,
    psychology: rule.psychology,
    risks:      rule.risks,
    strengths:  rule.strengths,
    remedies:   rule.remedies,
  }));
  const ruledPairs = new Set(ruledCombinations.map(rule => [...rule.planets].sort().join("-")));
  const genericCombinations: LKCombination[] = [];
  for (let i = 0; i < PLS.length; i += 1) {
    for (let j = i + 1; j < PLS.length; j += 1) {
      const p1 = PLS[i];
      const p2 = PLS[j];
      if (!planets[p1] || !planets[p2]) continue;
      if (planets[p1].house !== planets[p2].house) continue;
      const pairKey = [p1, p2].sort().join("-");
      if (ruledPairs.has(pairKey)) continue;
      const house = planets[p1].house;
      genericCombinations.push({
        id: `generic_${p1.toLowerCase()}_${p2.toLowerCase()}_h${house}`,
        planets: [p1, p2],
        title: `${p1} + ${p2} in House ${house}`,
        prediction: `${p1} aur ${p2} ek hi classical ghar mein baithkar H${house} ke phal ko milate hain. Yeh combination strong tab maana jayega jab dono grahon ki state, pakka/dushman ghar aur takkar relation bhi same direction mein signal dein.`,
        psychology: `Native ke andar ${p1} ki pravritti aur ${p2} ki pravritti ek saath react karti hain; isliye decisions mein mixed behaviour, sudden reaction ya double strength dikh sakti hai.`,
        risks: ["mixed results if one planet is mandi", "confusion if planets are mutual enemies", "wrong remedy can disturb the better planet"],
        strengths: ["double activation of one life area", "faster results when both planets are supportive", "clear nimit from that house"],
        remedies: ["judge both planets separately first", "avoid blind daan", "use soft conduct correction before material remedy"],
      });
    }
  }
  const activeCombinations = [...ruledCombinations, ...genericCombinations];

  // ── Home Omens ────────────────────────────────────────
  const homeOmens: LKHomeOmen[] = HOME_OMEN_RULES.map((rule) => ({
    planet:     rule.planet,
    icon:       PEMO[PLS.indexOf(rule.planet)] || "★",
    signs:      rule.signs,
    meaning:    rule.meaning,
    correction: rule.correction,
  }));

  // ── Kismat Ka Grah ────────────────────────────────────
  const KISMAT_ACTIVATIONS: Record<string, string> = {
    Sun: "Surya aapka mukhya bhagya activator hai. Pita ka nitya ashirwad lein, pratidin Suryoday par jal samarpit karein, aur sarkari/adhikarik karyon mein satyanishtha banaye rakhein.",
    Moon: "Chandra aapka mukhya bhagya activator hai. Mata aur ghar ki streeyon ka ashirwad lein, chandi ka tukda apne paas rakhein, aur doodh/paani ka kabhi apvyay na karein.",
    Mars: "Mangal aapka mukhya bhagya activator hai. Chhote bhaiyon aur sahyogiyon ki madad karein, sharirik shram aur saahas ko sakaratmak disha dein, aur krodh par niyantran rakhein.",
    Mercury: "Budh aapka mukhya bhagya activator hai. Behen, beti aur bua ka samman karein, vyapar aur vartalap mein sachhai rakhein, aur pakshiyon ko hara dana dein.",
    Jupiter: "Brihaspati (Guru) aapka sarvashreshtha bhagya activator hai. Guru aur bujurgon ke charan sparsh karein, mashtak par kesar/haldi ka tilak lagayein, aur dharmik aacharan rakhein.",
    Venus: "Shukra aapka mukhya bhagya activator hai. Jeevansathi ka samman karein, ghar ko swachh aur sugandhit rakhein, aur kalaatmak va saundaryapoorna karyon mein ruchi lein.",
    Saturn: "Shani aapka mukhya bhagya activator hai. Mazdooron aur asahay logon ki seva karein, niyamit parishram karein, aur galat tarike se dhan arjan se door rahein.",
    Rahu: "Rahu aapka aakasmik bhagya activator hai. Rasoi mein baithkar bhojan karein, unconventional takneek aur digital kshetra mein naye raste khojein, aur jhooth se bachein.",
    Ketu: "Ketu aapka adhyatmik bhagya activator hai. Kutton ko bhojan dein, nishkaam seva karein, ghamand se door rahein aur antaratma ki aawaz par vishwas karein.",
  };

  const kismatRanked = PLS.map((planet, pi) => {
    const pd = planets[planet];
    if (!pd) return null;
    const h = pd.house;
    const hScore = KISMAT_HOUSE_WEIGHTS[h] || 5;
    const pScore = KISMAT_PLANET_BASE[planet] || 5;
    const { score: condScore, state } = conditionScore(planet);
    const inPakka = (LK_PAKKA[planet] || []).includes(h);
    const inDushman = (LK_ENEMY[planet] || []).includes(h);

    let bonus = 0;
    if (inPakka || state === "nek") bonus += 2;
    if (inDushman || state === "mandi") bonus -= 3;
    if (h === 9) bonus += 2; // natural Bhagya house

    const rawScore = Math.max(1, Math.min(20, hScore + pScore + bonus));
    // Scale raw fortune score to Lal Kitab's standard 95-point scale (matching domainScore and UI /95)
    const scaledScore = Math.min(95, Math.max(10, Math.round((rawScore / 20) * 95)));
    return { planet, icon: PEMO[pi], house: h, score: scaledScore, rawScore, state };
  }).filter(Boolean) as { planet:string; icon:string; house:number; score:number; rawScore:number; state:string }[];

  kismatRanked.sort((a,b) => b.score - a.score);
  const topKismat = kismatRanked[0];
  const kismat: LKKismat = {
    planet:         topKismat.planet,
    icon:           topKismat.icon,
    house:          topKismat.house,
    score:          topKismat.score,
    interpretation: `${topKismat.planet} in H${topKismat.house} acts as your major fortune activator. ${KISMAT_ACTIVATIONS[topKismat.planet] || "Strengthen its positive behaviour before using material remedies."}`,
  };

  const coreAccuracy: LKCoreAccuracyRow[] = lkPlanets.map((planet) => {
    const pd = planets[planet.planet];
    const position = planetPosition(planet.planet, pd.signNum);
    const soya = isSoyaPlanet(planet.planet, planet.house, planets, currentAge);
    const kismatJaganewala = planet.planet === kismat.planet || (planet.house === 9 && planet.state !== "mandi");
    const bm = beneficMalefic(planet.planet, planet.house, planet.status, planet.state, position);
    return {
      planet: planet.planet,
      sign: planet.sign,
      signShort: SIGN_SHORT[pd.signNum] ?? planet.sign.slice(0, 2),
      house: planet.house,
      position,
      soya,
      kismatJaganewala,
      beneficMalefic: bm,
      reason: coreReason({
        planet: planet.planet,
        house: planet.house,
        status: planet.status,
        state: planet.state,
        position,
        beneficMalefic: bm,
        kismatJaganewala,
      }),
    };
  });

  // ── Varshphal (Lal Kitab 1952 Classical Progression Table) ──
  const varshphalAge = runningVarsh.completedYears > 0 ? runningVarsh.completedYears : 1;
  const runningAge = varshphalAge;
  const cycleYear = (((runningAge - 1) % 12) + 12) % 12 + 1;
  const yearShift = cycleYear - 1;

  const varshHits = PLS.map(p => {
    if (!planets[p]) return null;
    const natalH = planets[p].house;
    const vh = getLalKitabVarshphalHouse(natalH, runningAge);
    return { planet: p, natalH, vh };
  }).filter(Boolean) as { planet:string; natalH:number; vh:number }[];

  const varshRows: LKVarshphalPlanet[] = varshHits.map((hit) => {
    const core = coreAccuracy.find(row => row.planet === hit.planet);
    const pd = planets[hit.planet];
    const shiftedCondition = beneficMalefic(
      hit.planet,
      hit.vh,
      core?.beneficMalefic === "Benefic" ? "pakka" : core?.beneficMalefic === "Malefic" ? "dushman" : "sadharan",
      core?.beneficMalefic === "Benefic" ? "nek" : core?.beneficMalefic === "Malefic" ? "mandi" : "neutral",
      core?.position ?? planetPosition(hit.planet, pd.signNum),
    );
    return {
      planet: hit.planet,
      natalHouse: hit.natalH,
      varshHouse: hit.vh,
      sign: pd.sign,
      signShort: SIGN_SHORT[pd.signNum] ?? pd.sign.slice(0, 2),
      beneficMalefic: shiftedCondition,
      soya: Boolean(core?.soya),
      kismatJaganewala: Boolean(core?.kismatJaganewala),
      reading: `${hit.planet} natal H${hit.natalH} se Varshphal H${hit.vh} mein pravesh karta hai (1952 Paddhati). ${houseReading(hit.vh)}. Iska annual condition ${shiftedCondition} read hoga, natal condition ko base maan kar.`,
    };
  });

  // Varsheshwar: Planet in Varshphal H1, or natal ruler mapping to H1
  const h1Planets = varshRows.filter(r => r.varshHouse === 1);
  const varsheshwar = h1Planets.length > 0 
    ? h1Planets.map(r => r.planet).join(", ")
    : "Mars / Sun (Khana 1 Adhishtatha)";

  const shubhPlanets  = varshRows.filter(x => x.beneficMalefic === "Benefic" && [1,4,7,10,11].includes(x.varshHouse)).map(x => x.planet);
  const cautionPlanets= varshRows.filter(x => x.beneficMalefic === "Malefic" || [6,8,12].includes(x.varshHouse)).map(x => x.planet);
  const strongAnnual = varshRows.filter(row => row.kismatJaganewala || row.beneficMalefic !== "Mixed").slice(0, 3);

  // ── Deep Lal Kitab 1952 Annual Prediction Synthesis ──
  const varsheshwarFlavors: Record<string, string> = {
    Jupiter: "Guru (Brihaspati) is varsh Varsheshwar hain — gyan, parivaarik samman, santan unnati aur shubh aashirwad ka varsh hai. Buzurgon ke charan sparsh aur peeli vastuon ke aadar se kismat ke band dwar khulenge.",
    Sun: "Surya is varsh Varsheshwar hain — aatmasamman, prashasanik daayitva, samajik pratishta aur aatmanirbharta mein tezi aayegi. Krodh, ahankar aur sarkari niyam ullanghan se door rahein.",
    Moon: "Chandra is varsh Varsheshwar hain — mansik shanti, maata ka aashirwad, bhavnatmak thehrav aur parivar mein sheetalta ka varsh hai. Doodh, chandi ya taaza paani se jude nimit shubh rahenge.",
    Mars: "Mangal is varsh Varsheshwar hain — sahas, urja, zameen-jaydad ke faisle aur kathin chunautiyon par vijay milegi. Jaldbaazi, vivad aur rakt/BP utaar-chadhaw se savdhaan rahein.",
    Mercury: "Budh is varsh Varsheshwar hain — vyaparik soojh-boojh, commercial contracts, communication aur likhit dastavez mein labh hoga. Behan, beti ya bua ka samman kalyankari rahega.",
    Venus: "Shukra is varsh Varsheshwar hain — dampatya sukh, saundarya, aakarshan, vahan aur bhog-vilas ke sadhano mein vikas hoga. Kapdo ki safai aur shuchita banaye rakhein.",
    Saturn: "Shani is varsh Varsheshwar hain — kathor anushasan, parishram aur karmik nishtha ka parikshan hoga. Mehnat se ghabrayein nahi; shramikon aur majdooron ki seva se bhaagya chamkega.",
    Rahu: "Rahu is varsh Varsheshwar hain — achanak parivartan, digital/takneeki kshetra aur videsh ya doorasth sampark sakriya rahenge. Illusion, afwah aur bina kagaz ke nivesh se bachein.",
    Ketu: "Ketu is varsh Varsheshwar hain — aatmik shanti, shodh, sadhana aur purani chintaon se mukti ka samay hai. Kutton ki seva aur dharmik dhyan vishesh phal dega.",
  };

  const primaryVarsheshwar = varsheshwar.split(",")[0].trim().split(" ")[0];
  const varsheshwarText = varsheshwarFlavors[primaryVarsheshwar] ||
    `Khana 1 Adhishtatha urja (${varsheshwar}) jeevan ko aatmanirbhar aur naye lakshyon ki ore sakriya karegi.`;

  const kismatActive = varshRows.find(r => r.kismatJaganewala);
  const kismatSentence = kismatActive
    ? ` Is varsh aapka kismat jagane wala grah ${kismatActive.planet} Khana ${kismatActive.varshHouse} mein virajman ho kar bhagya ke dvar kholne ka mukhya nimit ban raha hai.`
    : "";

  const headline = `Lal Kitab 1952 Varshphal: Running Age ${runningAge} (12-Varshiya Chakra Varsh ${cycleYear}, Lagna: ${RASHIS_SA[lagnaNum]}). Varsheshwar: ${varsheshwar}. ${varsheshwarText}${kismatSentence}`;

  // Career Synthesis (H10, H11, H6, H1)
  const vH10Planets = varshRows.filter(r => r.varshHouse === 10);
  const vH11Planets = varshRows.filter(r => r.varshHouse === 11);
  const vH6Planets  = varshRows.filter(r => r.varshHouse === 6);
  let careerText = "";
  if (vH10Planets.length > 0) {
    const p10 = vH10Planets[0];
    const r10 = PLANET_HOUSE_RULES[p10.planet]?.[10];
    careerText += `${p10.planet} Varshphal Khana 10 (Takht / Ajeevika) mein baitha hai: ${r10?.career || "Karyakshetra mein nishtha aur zimmedari badhegi"}. `;
  }
  if (vH11Planets.length > 0) {
    careerText += `${vH11Planets.map(p => p.planet).join(", ")} Khana 11 mein aawak aur net-worth ke sadhano ko tezi de rahe hain, sahyogiyon se laabh milne ke sanket hain. `;
  }
  if (vH6Planets.length > 0) {
    const isChallenged = vH6Planets.some(p => ["Malefic", "Mixed"].includes(p.beneficMalefic));
    careerText += isChallenged
      ? `${vH6Planets.map(p => p.planet).join(", ")} Khana 6 mein pratiyogita aur kaam ke daayitva mein bojh badha sakte hain; karyasthal par kisi aapsi vivad ya galti se bachein. `
      : `${vH6Planets.map(p => p.planet).join(", ")} Khana 6 mein virodhiyon par dabdaba aur daily workflow mein sthirta dilayenge. `;
  }
  if (!careerText) {
    careerText = `Is saal work houses (H10, H11, H6) shant hain, jiska arth hai ki maujuda profile ko polish karna aur routine kaam ko sthir rakhna sarvottam rahega. Khana 10 ke pakke swami Shani ke anusaar kaam mein aalas na karein, subordinates ke sath narm rahein aur lalach mein koi naya anjaana risk na lein.`;
  } else {
    careerText += `Kaam mein satyanishtha aur Lal Kitab maryada ka palan karein.`;
  }

  // Money Synthesis (H2, H11, H8, H12)
  const vH2Planets  = varshRows.filter(r => r.varshHouse === 2);
  const vH8Planets  = varshRows.filter(r => r.varshHouse === 8);
  const vH12Planets = varshRows.filter(r => r.varshHouse === 12);
  let moneyText = "";
  if (vH2Planets.length > 0) {
    const p2 = vH2Planets[0];
    const r2 = PLANET_HOUSE_RULES[p2.planet]?.[2];
    moneyText += `${p2.planet} Khana 2 (Dhana & Tijori) mein aane se: ${r2?.money || "Parivaarik sanchit dhan aur savings par seedha asar rahega"}. `;
  }
  if (vH11Planets.length > 0 && vH2Planets.length === 0) {
    moneyText += `${vH11Planets.map(p => p.planet).join(", ")} Khana 11 mein aarthik aawak aur monthly cashflow ko niyamit banaye rakhenge. `;
  }
  if (vH8Planets.length > 0) {
    moneyText += `Savdhani: ${vH8Planets.map(p => p.planet).join(", ")} Khana 8 mein anapekshit kharch, machine ya gaadi ki marammat, ya payment delay ka darr banate hain; kisi ko bina kagazi saboot ke udhaar na dein. `;
  }
  if (vH12Planets.length > 0) {
    moneyText += `${vH12Planets.map(p => p.planet).join(", ")} Khana 12 mein hone se videsh, hospital, ya online/electronic transactions par kharch badh sakta hai; budget par sakht niyantran rakhein. `;
  }
  if (!moneyText) {
    moneyText = `Dhan ke sthan (Khana 2 aur 11) par koi direct dushprabhav nahi hai. Dhan ka pravah samanya aur santulit rahega. Parivaarik sanchit punji ko surakshit rakhein aur speculative shares ya jua-type trades se poori tarah bachein.`;
  }

  // Family Synthesis (H2, H4, H7, H9)
  const vH4Planets = varshRows.filter(r => r.varshHouse === 4);
  const vH7Planets = varshRows.filter(r => r.varshHouse === 7);
  const vH9Planets = varshRows.filter(r => r.varshHouse === 9);
  let familyText = "";
  if (vH4Planets.length > 0) {
    const p4 = vH4Planets[0];
    const r4 = PLANET_HOUSE_RULES[p4.planet]?.[4];
    familyText += `${p4.planet} Khana 4 (Ghar & Maata) mein: ${r4?.family || "Ghar ke sukh-shanti aur maata ke swasthya ka sanket deta hai"}. `;
  }
  if (vH7Planets.length > 0) {
    const p7 = vH7Planets[0];
    const r7 = PLANET_HOUSE_RULES[p7.planet]?.[7];
    familyText += `${p7.planet} Khana 7 (Jeevansathi & Saajhedaari) mein hone se: ${r7?.marriage || "Dampatya jeevan mein taalmeyl aur sauhard banaye rakhna zaroori hoga"}. `;
  }
  if (vH9Planets.length > 0) {
    familyText += `${vH9Planets.map(p => p.planet).join(", ")} Khana 9 mein pita aur kul ke bujurgon ke aashirwad ka nimit ban rahe hain. `;
  }
  if (vH2Planets.length > 0 && vH4Planets.length === 0) {
    familyText += `${vH2Planets.map(p => p.planet).join(", ")} Khana 2 mein kutumb ke logon ke sath baatcheet aur parivaarik aayojano ko sakriya karenge. `;
  }
  if (!familyText) {
    familyText = `Parivaarik sthan shant aur anukool hain. Jeevansathi, mata-pita aur bhai-behno ke sath samwaad khula rakhein. Ghar ke bujurgon ka ashirwad aur rasoi mein baithkar bhojan karna parivaarik shanti ko majboot karega.`;
  }

  // Health Synthesis (H1, H6, H8, H12)
  const vH1PlanetsHealth = varshRows.filter(r => r.varshHouse === 1 && ["Malefic", "Mixed"].includes(r.beneficMalefic));
  let healthText = "";
  if (vH1PlanetsHealth.length > 0) {
    healthText += `${vH1PlanetsHealth.map(p => p.planet).join(", ")} Khana 1 mein hone se seer dard, sharirik thakan ya aatmavishwas ke utaar-chadhaw par dhyan dein. `;
  }
  if (vH6Planets.length > 0) {
    const p6 = vH6Planets[0];
    const r6 = PLANET_HOUSE_RULES[p6.planet]?.[6];
    healthText += `${p6.planet} Khana 6 mein rukh rakhne se: ${r6?.health || "Paachan, acidity ya seasonal sardi-zukham se savdhani maangta hai"}. `;
  }
  if (vH8Planets.length > 0) {
    const p8 = vH8Planets[0];
    const r8 = PLANET_HOUSE_RULES[p8.planet]?.[8];
    healthText += `${p8.planet} Khana 8 mein jodo ke dard (joints), neend ya achanak susti ke prati savdhaan rehne ka sanket deta hai. `;
  }
  if (vH12Planets.length > 0 && !healthText) {
    healthText += `${vH12Planets.map(p => p.planet).join(", ")} Khana 12 mein neend ki aniyamitta ya aakhon par screen-time ka dabav badha sakta hai; raat ko samay par sone ki aadat daalein. `;
  }
  if (!healthText) {
    healthText = `Swasthya ke sthan par koi gambhir nakaratmak grah prabhav nahi hai. Shareer mein vata-pitta ka santulan rakhein, swachh aahar lein aur niyamit dincharya banaye rakhein.`;
  }

  // Remedy Synthesis (Classical Lal Kitab 1952)
  const afflicted = varshRows.filter(r => [6, 8, 12].includes(r.varshHouse) || r.beneficMalefic === "Malefic");
  const specificRemedies: string[] = [];

  afflicted.forEach(r => {
    if (r.planet === "Rahu" && [8, 12].includes(r.varshHouse)) {
      specificRemedies.push("Rahu shanti hetu jau (barley) ya nariyal bahte jal mein pravahit karein, ghar ki chhat par kabad ya kharab electronics na rakhein");
    } else if (r.planet === "Ketu" && [6, 8].includes(r.varshHouse)) {
      specificRemedies.push("Ketu hetu do-rangi (kaale-safed) kutte ko meethi roti khilayein, kaan ya jodo ki safai rakhein");
    } else if (r.planet === "Saturn" && [6, 8].includes(r.varshHouse)) {
      specificRemedies.push("Shani shanti ke liye shramikon aur majdooron ko samman dein, shaniwar ko sarson ke tel mein chhaya dekh kar daan karein");
    } else if (r.planet === "Mars" && [8, 12].includes(r.varshHouse)) {
      specificRemedies.push("Mangal mandi ke liye mitti ke bartan mein shehad bhar kar surakshit sthan par rakhein, rasoi mein meetha banayein");
    } else if (r.planet === "Mercury" && [12, 8].includes(r.varshHouse)) {
      specificRemedies.push("Budh shanti ke liye taambe ka chhed wala sikka gale mein dharan karein ya behan-beti ko samman dein");
    } else if (r.planet === "Moon" && [6, 8].includes(r.varshHouse)) {
      specificRemedies.push("Chandra hetu chandi ka chaukore tukda hamesha apne paas rakhein, maata ke charan sparsh karein");
    } else if (r.planet === "Sun" && [6, 7, 8].includes(r.varshHouse)) {
      specificRemedies.push("Surya hetu pita ka samman karein, taambe ke bartan se surya ko jal arpit karein, gusse se bachein");
    } else if (r.planet === "Jupiter" && [6, 10].includes(r.varshHouse)) {
      specificRemedies.push("Guru shanti ke liye kesar ya haldi ka tilak maathe aur naabhi par lagayein, peepal ko jal dein");
    } else if (r.planet === "Venus" && [6, 9].includes(r.varshHouse)) {
      specificRemedies.push("Shukra hetu safed vastra aur sugandh ka prayog karein, jeevansathi ka aadar karein");
    }
  });

  const remedyText = specificRemedies.length > 0
    ? `Is varsh ke Pramukh Lal Kitab Upaya: 1) ${specificRemedies.slice(0, 2).join("; 2) ")}. Niyam: Yeh upaya keval is varsh ke liye hain. Kismat jagane wale shubh grah ki mukhya vastu ka daan kadapi na karein!`
    : `Lal Kitab Varshphal Upaya niyam: Is saal koi bhari dushprabhav nahi hai. Shubh aacharan, rasoi mein baithkar bhojan, mata-pita ki seva aur ghar ke mandir ko saaf rakhna hi sarvottam upaya hai. Supportive grah ki mukhya vastu ka daan kadapi na karein.`;

  const annualPrediction: LKVarshphalPrediction = {
    headline,
    career: careerText,
    money: moneyText,
    family: familyText,
    health: healthText,
    remedy: remedyText,
  };

  // ── 12-Year Varshphal Matrix (Classical Progression Roadmap) ──
  const twelveYearMatrix: LK12YearMatrixRow[] = [];
  const startCycleYearRunningAge = runningAge - (cycleYear - 1);
  for (let c = 1; c <= 12; c++) {
    const rowRunningAge = startCycleYearRunningAge + (c - 1);
    const calYear = birthYear + rowRunningAge;
    const pHouses: Record<string, number> = {};
    PLS.forEach(p => {
      if (planets[p]) {
        pHouses[p] = getLalKitabVarshphalHouse(planets[p].house, rowRunningAge);
      }
    });
    const h1Occupants = Object.entries(pHouses).filter(([_, h]) => h === 1).map(([p]) => p);
    const rowVarsheshwar = h1Occupants.length > 0
      ? h1Occupants.join(", ")
      : "Mars / Sun (H1)";

    twelveYearMatrix.push({
      cycleYear: c,
      runningAge: rowRunningAge,
      calendarYear: calYear,
      varsheshwar: rowVarsheshwar,
      isCurrent: c === cycleYear,
      planetHouses: pHouses,
      theme: HOUSE_WISE_OMENS.find(h => h.house === c)?.zone || `House ${c}`,
      focalHouse: c,
    });
  }

  const varshphal: LKVarshphal = {
    year:        runningVarsh.startYear,
    startDate:   formatLKDate(runningVarsh.startDate),
    endDate:     formatLKDate(runningVarsh.endDate),
    periodLabel: `${formatLKDate(runningVarsh.startDate)} to ${formatLKDate(runningVarsh.endDate)}`,
    yearShift,
    runningAge,
    cycleYear,
    varsheshwar,
    lagnaSign:   RASHIS_SA[lagnaNum],
    shubhPlanets,
    cautionPlanets,
    chartRows:   varshRows,
    annualPrediction,
    twelveYearMatrix,
    summary: shubhPlanets.length
      ? `Varshphal ${formatLKDate(runningVarsh.startDate)} se ${formatLKDate(runningVarsh.endDate)} (Running Age ${runningAge}, Varsheshwar: ${varsheshwar}). Is varsh ${shubhPlanets.join(", ")} shubh phal de sakte hain.${cautionPlanets.length ? ` ${cautionPlanets.join(", ")} se savdhaan rahein.` : ""}`
      : cautionPlanets.length
        ? `Varshphal ${formatLKDate(runningVarsh.startDate)} se ${formatLKDate(runningVarsh.endDate)} (Running Age ${runningAge}, Varsheshwar: ${varsheshwar}). Is varsh ${cautionPlanets.join(", ")} se savdhaan rahein. Upaya chart-specific rakhein.`
        : `Varshphal ${formatLKDate(runningVarsh.startDate)} se ${formatLKDate(runningVarsh.endDate)} (Running Age ${runningAge}, Varsheshwar: ${varsheshwar}) — balanced phal.`,
  };

  // ── Lal Kitab Special Drishtis (दृष्टि रडार) ───────────────
  const drishtis: LKDrishti[] = [];
  const DRISHTI_CONFIGS = [
    {
      from: 1, to: 7, type: "100_buniyad" as const,
      name: "100% Purna Drishti", hindiName: "पूर्ण बुनियादी दृष्टि (100%)",
      percent: 100,
      effect: "प्रथम भाव के ग्रह सप्तम भाव पर सीधा और पूर्ण प्रभाव डालते हैं। आमने-सामने का प्रत्यक्ष प्रभाव।",
      upaya: "दोनों भावों के ग्रहों के मित्र/शत्रु स्वभाव अनुसार संतुलन बनाए रखें।"
    },
    {
      from: 7, to: 1, type: "100_buniyad" as const,
      name: "100% Prati-Drishti", hindiName: "सप्तम से लग्न दृष्टि (100%)",
      percent: 100,
      effect: "सप्तम भाव का ग्रह लग्न और शरीर पर सीधा पलटवार या सहयोग करता है।",
      upaya: "जीवनसाथी और व्यापारिक साझेदार से संबंध मधुर रखें।"
    },
    {
      from: 4, to: 10, type: "50_adhikar" as const,
      name: "50% Adhikar Drishti", hindiName: "अधिकार दृष्टि (50%)",
      percent: 50,
      effect: "चतुर्थ भाव (सुख/माता) दशम भाव (कर्म/आजीविका) को आधी शक्ति से देखता और नियंत्रित करता है।",
      upaya: "माता का आशीर्वाद लेकर ही कोई बड़ा व्यावसायिक निर्णय लें।"
    },
    {
      from: 3, to: 9, type: "25_sahayak" as const,
      name: "25% Sahayak Drishti", hindiName: "चौथाई भाग्य दृष्टि (25%)",
      percent: 25,
      effect: "तृतीय भाव का पराक्रम नवम भाव के भाग्य को 25% गति प्रदान करता है। स्वप्रयास से भाग्य चमकता है।",
      upaya: "छोटे भाई-बहनों का सम्मान करें।"
    },
    {
      from: 3, to: 11, type: "25_sahayak" as const,
      name: "25% Labh Drishti", hindiName: "चौथाई लाभ दृष्टि (25%)",
      percent: 25,
      effect: "तृतीय भाव की शक्ति एकादश भाव की आय को 25% प्रभावित करती है।",
      upaya: "व्यापार में सत्य निष्ठा बनाए रखें।"
    },
    {
      from: 8, to: 2, type: "dhokha" as const,
      name: "Dhokha Drishti (Deceit)", hindiName: "धोखा दृष्टि (अष्टम से द्वितीय)",
      percent: 100,
      effect: "लाल किताब का अति-महत्वपूर्ण नियम: अष्टम भाव (विपदा/गुप्त बाधा) द्वितीय भाव (धन/परिवार) पर धोखे का वार करता है। अचानक धन हानि या पारिवारिक विश्वासघात की संभावना।",
      upaya: "मंदिर में नंगे पांव जाएं, केसर का तिलक लगाएं, अष्टम भाव के अशुभ ग्रह की वस्तु का दान करें।",
      isAfflicted: true
    },
    {
      from: 2, to: 8, type: "achanak" as const,
      name: "Faisla Drishti", hindiName: "फैसला / रक्षा दृष्टि (द्वितीय से अष्टम)",
      percent: 50,
      effect: "द्वितीय भाव (धर्म स्थान / गुरु) अष्टम भाव के विष को शांत करने की क्षमता रखता है।",
      upaya: "घर में चांदी का चौरस टुकड़ा रखें, कुलदेवता की उपासना करें।"
    },
    {
      from: 5, to: 9, type: "sanstha" as const,
      name: "Buniyad Drishti", hindiName: "संस्था दृष्टि (पंचम से नवम)",
      percent: 50,
      effect: "पंचम भाव का ज्ञान और संतान नवम भाव के धर्म और भाग्य की नींव बनते हैं।",
      upaya: "ज्ञान का विस्तार करें, विद्यार्थियों की मदद करें।"
    },
  ];

  DRISHTI_CONFIGS.forEach(cfg => {
    const fromP = PLS.filter(p => planets[p] && planets[p].house === cfg.from);
    const toP = PLS.filter(p => planets[p] && planets[p].house === cfg.to);
    if (fromP.length > 0 || toP.length > 0) {
      drishtis.push({
        fromHouse: cfg.from,
        toHouse: cfg.to,
        fromPlanets: fromP,
        toPlanets: toP,
        type: cfg.type,
        name: cfg.name,
        hindiName: cfg.hindiName,
        strengthPercent: cfg.percent,
        effect: cfg.effect,
        upaya: cfg.upaya,
        isAfflicted: Boolean(cfg.isAfflicted && fromP.length > 0),
      });
    }
  });

  // ── 43-Day Continuous Upay Protocols (४३-दिवसीय अनुष्ठान) ──
  const upayProtocols: LK43DayUpay[] = [];
  const UPAY_43_RULES: Record<string, {
    title: string;
    ritual: string;
    materials: string[];
    timeWindow: string;
    conduct: string;
  }> = {
    Sun: {
      title: "सूर्य शुद्धि 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन सूर्योदय से दोपहर 12 बजे के मध्य बहते जल में थोड़ा सा गुड़ या तांबे का सिक्का प्रवाहित करें, अथवा सूर्य को तांबे के लोटे से अर्घ्य दें।",
      materials: ["तांबे का सिक्का / लोटा", "गुड़", "लाल चंदन"],
      timeWindow: "प्रातः सूर्योदय से दोपहर 12 बजे तक (सूर्यास्त के बाद कदापि न करें)",
      conduct: "पिता का प्रतिदिन चरण स्पर्श करें, कटु वचन न बोलें, झूठे वादे न करें।"
    },
    Moon: {
      title: "चन्द्र शांति 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन प्रातःकाल माता का आशीर्वाद लें, दूध या जल का किसी पात्र में पक्षियों के लिए प्रबंध करें, अथवा शिवलिंग पर कच्चा दूध अर्पित करें।",
      materials: ["कच्चा दूध", "चांदी का चौकोर टुकड़ा", "चावल"],
      timeWindow: "दिन के समय (सूर्योदय से सूर्यास्त तक)",
      conduct: "माता से किसी भी प्रकार का विवाद न करें, जल की बर्बादी न करें।"
    },
    Mars: {
      title: "मंगल दोष निवारण 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन दोपहर से पूर्व लाल मसूर की दाल पक्षियों को डालें अथवा बहते जल में थोड़ा सा शहद या रेवड़ी प्रवाहित करें।",
      materials: ["लाल मसूर", "गुड़ / रेवड़ी", "चांदी का छल्ला"],
      timeWindow: "दिन के समय (विशेषकर दोपहर 12 बजे से पूर्व)",
      conduct: "क्रोध और अपशब्दों पर पूर्ण नियंत्रण रखें, भाइयों से विवाद न करें।"
    },
    Mercury: {
      title: "बुध सुधार 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन हरी दूर्वा अथवा साबुत मूंग गाय को खिलाएं, अथवा कन्याओं को मीठा खिलाकर उनका आशीर्वाद लें।",
      materials: ["साबुत हरी मूंग", "हरी चूड़ियां", "चांदी का बिना जोड़ का छल्ला"],
      timeWindow: "दिन के उजाले में",
      conduct: "वाणी में सत्यता रखें, बहन, बेटी व बुआ का आदर करें, जुआ-सट्टे से दूर रहें।"
    },
    Jupiter: {
      title: "बृहस्पति देव 43-दिवसीय प्रतिष्ठा अनुष्ठान",
      ritual: "प्रतिदिन प्रातः स्नान के बाद माथे व नाभि पर केसर अथवा हल्दी का तिलक लगाएं। विष्णु सहस्रनाम या गुरु वंदना करें।",
      materials: ["शुद्ध कश्मीरी केसर", "चने की दाल", "पीला सूती धागा"],
      timeWindow: "प्रातः काल पूजा के समय",
      conduct: "गुरु व वृद्धजनों का आदर करें, धार्मिक ग्रंथों का अनादर न करें, पीली वस्तु का दान न करें।"
    },
    Venus: {
      title: "शुक्र बलवर्धन 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन सफेद गाय को दो पेड़े या चने की दाल-रोटी खिलाएं। शरीर व वस्त्रों को सुगंधित व स्वच्छ रखें।",
      materials: ["कपूर", "सफेद चंदन", "इत्र / सुगंध"],
      timeWindow: "दिन के समय",
      conduct: "जीवनसाथी का सम्मान करें, पराई स्त्री से दूरी रखें, चरित्र की पवित्रता बनाए रखें।"
    },
    Saturn: {
      title: "शनि कृपा 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन कौओं या काले कुत्तों को सरसों के तेल से चुपड़ी रोटी डालें। शनिवार को गरीबों व मजदूरों को भोजन कराएं।",
      materials: ["सरसों का तेल", "काले तिल", "लोहे का टुकड़ा / कील"],
      timeWindow: "दिन के समय (सूर्यास्त से पहले)",
      conduct: "मजदूरों व निर्धनों का हक न मारें, शराब व मांस का सर्वथा त्याग रखें।"
    },
    Rahu: {
      title: "राहु शांति 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन बहते पानी में नारियल अथवा जौ के दाने दूध से धोकर प्रवाहित करें। चांदी का एक चौकोर टुकड़ा सदैव अपनी जेब में रखें।",
      materials: ["जौ", "कच्चा दूध", "पानी वाला नारियल", "चांदी का चौरस"],
      timeWindow: "सूर्योदय से सूर्यास्त के मध्य",
      conduct: "शौचालय व छत की सफाई रखें, ससुराल पक्ष से संबंध न बिगाड़ें, बिजली के खराब उपकरण घर से हटाएं।"
    },
    Ketu: {
      title: "केतु शुद्धि 43-दिवसीय अनुष्ठान",
      ritual: "प्रतिदिन दोरंगा (काला-सफेद) कुत्ता अथवा आवारा कुत्तों को मीठी रोटी खिलाएं। कान में सोना अथवा रेशमी पीला धागा पहनें।",
      materials: ["दोरंगा कंबल (जरूरतमंद को)", "तिल के लड्डू", "पीला रेशमी धागा"],
      timeWindow: "दिन के समय (सूर्योदय से सूर्यास्त तक)",
      conduct: "साधु-संतों का अपमान न करें, भांजे व दामाद का आदर करें, गुप्त द्वेष न रखें।"
    },
  };

  PLS.forEach(p => {
    const pl = lkPlanets.find(x => x.planet === p);
    if (!pl) return;
    const rule = UPAY_43_RULES[p];
    if (!rule) return;
    const isDusthana = [6, 8, 12].includes(pl.house);
    const isMandi = pl.state === "mandi";
    const isDushman = pl.status === "dushman";

    if (isMandi || isDushman || isDusthana) {
      upayProtocols.push({
        planet: p,
        house: pl.house,
        priority: (isDusthana && isMandi) ? "high" : (isMandi || isDushman) ? "medium" : "preventative",
        title: rule.title,
        ritual: rule.ritual,
        timeWindow: rule.timeWindow,
        duration: "43 दिन लगातार (बिना एक भी दिन छूटे)",
        prohibitions: [
          "उपाय केवल दिन के समय (सूर्योदय से सूर्यास्त तक) ही करें; रात्रि में लाल किताब उपाय वर्जित हैं।",
          "43 दिनों के मध्य यदि 1 दिन भी नागा हुआ, तो गिनती पुनः 1 से शुरू होगी।",
          "उपाय काल में तामसिक भोजन (मांसाहार, मदिरा) का पूर्ण निषेध रखें।",
          pl.neverDonate.length ? `इस ग्रह की मुख्य वस्तु (${pl.neverDonate.slice(0, 2).join(", ")}) का दान कदापि न करें।` : "अनावश्यक दान से बचें।"
        ],
        materialsNeeded: rule.materials,
        conductRule: rule.conduct,
      });
    }
  });

  if (upayProtocols.length === 0 && kismat.planet && UPAY_43_RULES[kismat.planet]) {
    const rule = UPAY_43_RULES[kismat.planet];
    upayProtocols.push({
      planet: kismat.planet,
      house: kismat.house,
      priority: "preventative",
      title: `${kismat.planet} भाग्य संवर्धन 43-दिवसीय अनुष्ठान`,
      ritual: rule.ritual,
      timeWindow: rule.timeWindow,
      duration: "43 दिन लगातार",
      prohibitions: [
        "उपाय केवल दिन के समय करें।",
        "43 दिनों तक बिना नागा नियम पालें।"
      ],
      materialsNeeded: rule.materials,
      conductRule: rule.conduct,
    });
  }

  // ── Summary ───────────────────────────────────────────
  const pakkaCount   = lkPlanets.filter(p => p.status === "pakka").length;
  const dushmanCount = lkPlanets.filter(p => p.status === "dushman").length;
  const nekCount     = lkPlanets.filter(p => p.state  === "nek").length;
  const summary =
    tevaType === "Dharmi Teva"
      ? `Aapka chart 'Dharmi Teva' hai (${pakkaCount} pakka ghar, ${nekCount} nek grah) — paapi grah bhi Ishwariya kripa se anisht nahi kar paate. Kismat Ka Grah: ${kismat.planet}.`
      : pakkaCount >= 4
        ? `Aapke chart mein ${pakkaCount} planets apne Pakka Ghar mein hain — bahut shubh! Strong material and spiritual foundation. ${nekCount} planets Nek Halat mein hain.`
        : dushmanCount >= 3
          ? `${dushmanCount} planets Dushman Ghar mein hain — focused upaya zaroori hai. Rin siddhant ka dhyan rakhein.`
          : `Balanced chart — ${pakkaCount} pakka, ${dushmanCount} dushman ghar. Mixed results with focused upay. Kismat Ka Grah: ${kismat.planet}.`;

  // ── House-wise Home Omens & Soya House Awakeners ──────
  const HOUSE_AWAKENERS: Record<number, { planet: string; remedy: string }> = {
    1:  { planet: "Mars / Sun",    remedy: "Surya ko jal samarpit karein, aatmasamman aur saahas ko sakriya rakhein." },
    2:  { planet: "Moon / Jupiter", remedy: "Mata ka ashirwad lein, chandi ka chauras tukda ghar mein rakhein, peeli vastu ka daan na karein." },
    3:  { planet: "Mercury / Mars", remedy: "Bhai-behenon se sambandh theek rakhein, vyavsayik vartalap ko satyanishtha banayein." },
    4:  { planet: "Moon",           remedy: "Mata ki nitya seva karein, ghar ke jal strot ko sadaiv saaf aur shuddh rakhein." },
    5:  { planet: "Sun / Jupiter",  remedy: "Vidya aur gyan ka daan karein, vidyarthiyon ki madad karein, puja sthal roshan rakhein." },
    6:  { planet: "Rahu / Ketu",    remedy: "Kutton ko bhojan karayein, asahay rogiyon ki seva karein, vivad se bachein." },
    7:  { planet: "Venus / Mercury",remedy: "Jeevansathi ka aadar karein, ghar mein sugandh aur shuddhata rakhein, chhal-kapat na karein." },
    8:  { planet: "Moon / Saturn",  remedy: "Purane dark corners ko saaf karein, gale mein chandi ki chain dharan karein." },
    9:  { planet: "Jupiter",        remedy: "Dharmik sthano aur mandiro mein nishkaam bhent karein, Guru ke aadesh ka palan karein." },
    10: { planet: "Saturn",         remedy: "Shramikon aur mazdooron ko samman dein, karma kshetra mein nishthawan rahein." },
    11: { planet: "Jupiter",        remedy: "Kamai ka ek chhota hissa dharmik/shaikshik karya mein lagayein, bujurgon ka aadar karein." },
    12: { planet: "Ketu / Rahu",    remedy: "Niyamit dhyan sadhana karein, rasoi mein baithkar bhojan karein, nasha door rakhein." },
  };

  const houseOmens: LKHouseOmen[] = HOUSE_WISE_OMENS.map(rule => {
    const occupants = PLS.filter(p => planets[p] && planets[p].house === rule.house);
    const isSoya = occupants.length === 0;
    const awakener = HOUSE_AWAKENERS[rule.house] || { planet: "Jupiter", remedy: "Dharma aur satya aacharan." };
    return {
      ...rule,
      planets:         occupants,
      planetIcons:     occupants.map(p => PEMO[PLS.indexOf(p)]),
      planetColors:    occupants.map(p => PCOL[PLS.indexOf(p)]),
      isSoya,
      awakenerPlanet:  awakener.planet,
      awakeningRemedy: awakener.remedy,
    };
  });

  return {
    planets: lkPlanets,
    takkars,
    rins,
    hasPitraRin,
    combinations: activeCombinations,
    homeOmens,
    houseOmens,
    kismat,
    coreAccuracy,
    varshphal,
    drishtis,
    upayProtocols,
    summary,
    tevaType,
    tevaExplanation,
  };
}
