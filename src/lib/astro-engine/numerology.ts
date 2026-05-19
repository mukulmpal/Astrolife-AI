// ============================================================
// ASTROLIFE NUMEROLOGY ENGINE v1.0
// System: Pythagorean (Western) with Vedic planet mapping
// Numbers: 1–9 + Master Numbers 11, 22, 33
// ============================================================

export interface NumerologyNumber {
  value:        number;
  isMaster:     boolean;
  label:        string;
  archetype:    string;
  planet:       string;
  planetIcon:   string;
  color:        string;
  keyword:      string;
  theme:        string;
  desc:         string;
  strengths:    string[];
  challenges:   string[];
  luckyDays:    string;
  luckyColors:  string[];
  compatibleWith: number[];
}

export interface NameLetter {
  letter:  string;
  value:   number;
  isVowel: boolean;
}

export interface MonthForecast {
  month:     number;
  monthName: string;
  energy:    number;
  isMaster:  boolean;
  theme:     string;
  icon:      string;
  isCurrent: boolean;
}

export interface PinnacleNumber {
  number:    number;
  isMaster:  boolean;
  label:     string;
  ageFrom:   number;
  ageTo:     number | null;
  isActive:  boolean;
  theme:     string;
  guidance:  string;
}

export interface ChallengeNumber {
  number:   number;
  label:    string;
  ageFrom:  number;
  ageTo:    number | null;
  isActive: boolean;
  meaning:  string;
}

export interface KarmicDebt {
  number:    number;
  reducedTo: number;
  source:    string;
  meaning:   string;
  remedy:    string;
}

export interface IntensityEntry {
  digit:    number;
  count:    number;
  missing:  boolean;
  meaning:  string;
}

export interface NumerologyResult {
  name:           string;
  dob:            string;
  currentAge:     number;
  lifePath:       NumerologyNumber;
  destiny:        NumerologyNumber;
  soulUrge:       NumerologyNumber;
  personality:    NumerologyNumber;
  birthday:       NumerologyNumber;
  maturity:       NumerologyNumber;
  personalYear:   NumerologyNumber;
  personalDay:    number;
  bridgeNumber:   number;
  hiddenPassion:  number[];
  pinnacles:      PinnacleNumber[];
  challenges:     ChallengeNumber[];
  activePinnacle: PinnacleNumber | null;
  activeChallenge: ChallengeNumber | null;
  karmicDebts:    KarmicDebt[];
  intensityMap:   IntensityEntry[];
  nameBreakdown:  NameLetter[];
  monthForecast:  MonthForecast[];
  summary:        string;
}

// ── Pythagorean Letter Values ─────────────────────────────────
const LETTER_VALUES: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};

const VOWELS  = new Set(["A","E","I","O","U"]);
const MASTERS = new Set([11, 22, 33]);

// ── Month themes keyed by reduced energy number ───────────────
const MONTH_THEMES: Record<number, { theme: string; icon: string }> = {
  1:  { theme: "New beginnings — take bold initiative",        icon: "🌱" },
  2:  { theme: "Relationships — nurture and be patient",       icon: "🤝" },
  3:  { theme: "Self-expression — create and communicate",     icon: "🎨" },
  4:  { theme: "Foundation building — work and discipline",    icon: "🏗️" },
  5:  { theme: "Change and adventure — embrace the new",       icon: "🌊" },
  6:  { theme: "Love and responsibility — family first",       icon: "💛" },
  7:  { theme: "Reflection — go inward and study deeply",      icon: "🔮" },
  8:  { theme: "Career and finances — assert your power",      icon: "⚡" },
  9:  { theme: "Release and forgive — complete your cycles",   icon: "🌙" },
  11: { theme: "Illumination — trust your intuition fully",    icon: "✨" },
  22: { theme: "Master building — create lasting impact",      icon: "🏛️" },
  33: { theme: "Sacred service — lead through pure love",      icon: "🙏" },
};

// ── Number Profile Data ───────────────────────────────────────
interface NumProfile {
  archetype:      string;
  planet:         string;
  planetIcon:     string;
  color:          string;
  keyword:        string;
  theme:          string;
  desc:           string;
  strengths:      string[];
  challenges:     string[];
  luckyDays:      string;
  luckyColors:    string[];
  compatibleWith: number[];
}

const NUM_DATA: Record<number, NumProfile> = {
  1: {
    archetype: "The Pioneer",
    planet: "Sun", planetIcon: "☉", color: "#f97316",
    keyword: "Leadership",
    theme: "Independent, original, natural leader — the soul who must carve their own path.",
    desc: "Number 1 is the source of all creation — the first spark of individuality. You are here to lead, initiate, and stand alone when necessary. Your dharma is independence: building something uniquely your own. The Sun infuses you with identity, willpower, and the drive to shine. Your greatest challenge is ego — learning that true leadership serves rather than dominates.",
    strengths: ["Natural leadership", "Courage & initiative", "Original thinking", "Self-reliance", "Ambition"],
    challenges: ["Loneliness", "Stubbornness", "Egotism", "Difficulty collaborating"],
    luckyDays: "Sunday, Monday",
    luckyColors: ["#f97316", "#fbbf24", "#ef4444"],
    compatibleWith: [1, 3, 5, 9],
  },
  2: {
    archetype: "The Diplomat",
    planet: "Moon", planetIcon: "☽", color: "#c084fc",
    keyword: "Harmony",
    theme: "Sensitive, empathetic, master of relationships — the soul who unites opposites.",
    desc: "Number 2 is the vibration of balance, duality, and union. The Moon governs your emotions, intuition, and deep sensitivity. You are the bridge-builder — most powerful in partnership, most wounded in conflict. Your dharma is cooperation: learning that strength can be soft and wisdom can be receptive. The world needs your empathy and emotional intelligence.",
    strengths: ["Deep empathy", "Diplomatic skill", "Patience", "Intuition", "Team player"],
    challenges: ["Over-sensitivity", "Codependency", "Indecisiveness", "Passive aggression"],
    luckyDays: "Monday, Friday",
    luckyColors: ["#c084fc", "#60a5fa", "#a5f3fc"],
    compatibleWith: [2, 4, 6, 8],
  },
  3: {
    archetype: "The Creator",
    planet: "Jupiter", planetIcon: "♃", color: "#f59e0b",
    keyword: "Expression",
    theme: "Joyful, creative, magnetic communicator — the soul born to inspire.",
    desc: "Number 3 carries the vibration of creation, joy, and self-expression. Jupiter expands your world with optimism, humor, and creative power. You are here to create — art, ideas, conversations, laughter. Your dharma is authentic expression: sharing your inner world with joy. The shadow work is learning emotional depth beneath the surface cheerfulness.",
    strengths: ["Creative genius", "Charisma", "Optimism", "Communication", "Wit"],
    challenges: ["Scattered focus", "Superficiality", "Emotional avoidance", "Extravagance"],
    luckyDays: "Thursday, Wednesday",
    luckyColors: ["#f59e0b", "#fbbf24", "#84cc16"],
    compatibleWith: [1, 3, 5, 9],
  },
  4: {
    archetype: "The Architect",
    planet: "Rahu", planetIcon: "☊", color: "#a78bfa",
    keyword: "Foundation",
    theme: "Disciplined, practical, reliable — the soul who builds what lasts.",
    desc: "Number 4 is the vibration of structure, order, and manifestation. Rahu's karmic energy drives you to build solid foundations through discipline and hard work. You are the architect of reality — most fulfilled when creating systems that endure. Your dharma is mastery through methodical effort. The shadow is rigidity: learning that structure serves life, not the other way around.",
    strengths: ["Reliability", "Discipline", "Practical wisdom", "Perseverance", "Loyalty"],
    challenges: ["Rigidity", "Resistance to change", "Overwork", "Limitation mindset"],
    luckyDays: "Saturday, Sunday",
    luckyColors: ["#a78bfa", "#818cf8", "#6366f1"],
    compatibleWith: [2, 4, 6, 8],
  },
  5: {
    archetype: "The Explorer",
    planet: "Mercury", planetIcon: "☿", color: "#22c55e",
    keyword: "Freedom",
    theme: "Adventurous, versatile, craving freedom — the soul who learns through experience.",
    desc: "Number 5 is the vibration of freedom, change, and sensory experience. Mercury gives you quick intelligence, adaptability, and an insatiable curiosity. You are here to experience life fully — travel, ideas, people, adventures. Your dharma is conscious freedom: choosing experiences that expand the soul, not just the senses. The shadow is using novelty as an escape from depth.",
    strengths: ["Adaptability", "Charisma", "Quick intelligence", "Curiosity", "Resilience"],
    challenges: ["Restlessness", "Commitment issues", "Impulsiveness", "Addiction risk"],
    luckyDays: "Wednesday, Friday",
    luckyColors: ["#22c55e", "#10b981", "#34d399"],
    compatibleWith: [1, 3, 5, 7],
  },
  6: {
    archetype: "The Nurturer",
    planet: "Venus", planetIcon: "♀", color: "#ec4899",
    keyword: "Responsibility",
    theme: "Loving, protective, devoted — the soul who heals through unconditional care.",
    desc: "Number 6 is the vibration of love, responsibility, and service. Venus blesses you with beauty, harmony, and deep capacity for devotion. You are the healer and nurturer — most fulfilled when serving family, community, or those in need. Your dharma is conscious love: giving from fullness, not fear. The shadow is self-sacrifice becoming self-neglect.",
    strengths: ["Unconditional love", "Responsibility", "Healing ability", "Artistic sense", "Justice"],
    challenges: ["Martyrdom", "Perfectionism", "Over-involvement", "Difficulty receiving"],
    luckyDays: "Friday, Monday",
    luckyColors: ["#ec4899", "#f472b6", "#e879f9"],
    compatibleWith: [2, 4, 6, 9],
  },
  7: {
    archetype: "The Mystic",
    planet: "Ketu", planetIcon: "☋", color: "#60a5fa",
    keyword: "Truth",
    theme: "Analytical, spiritual, introspective — the soul searching for ultimate truth.",
    desc: "Number 7 is the most spiritual vibration — the seeker of truth beyond appearances. Ketu's past-life wisdom creates a soul that intuitively knows what others must be taught. You are here to go deep: research, meditation, inner knowing. Your dharma is wisdom — not accumulated knowledge, but direct experience of truth. The shadow is isolation masquerading as enlightenment.",
    strengths: ["Deep intelligence", "Spiritual insight", "Analytical mind", "Inner wisdom", "Intuition"],
    challenges: ["Isolation", "Emotional detachment", "Overthinking", "Distrust of others"],
    luckyDays: "Monday, Sunday",
    luckyColors: ["#60a5fa", "#a5f3fc", "#818cf8"],
    compatibleWith: [2, 5, 7],
  },
  8: {
    archetype: "The Powerhouse",
    planet: "Saturn", planetIcon: "♄", color: "#94a3b8",
    keyword: "Abundance",
    theme: "Ambitious, powerful, karmic — the soul here to master the material world.",
    desc: "Number 8 is the vibration of power, karma, and material mastery. Saturn demands you earn everything through discipline, patience, and ethical power. You are here to master the material world — wealth, authority, business — while maintaining spiritual integrity. Your dharma is conscious power: abundance earned, not seized. The shadow is when fear of poverty creates the very lack you fear.",
    strengths: ["Business acumen", "Determination", "Financial intelligence", "Leadership", "Endurance"],
    challenges: ["Power hunger", "Workaholism", "Control issues", "Materialism"],
    luckyDays: "Saturday, Thursday",
    luckyColors: ["#94a3b8", "#475569", "#6b7280"],
    compatibleWith: [2, 4, 6, 8],
  },
  9: {
    archetype: "The Sage",
    planet: "Mars", planetIcon: "♂", color: "#ef4444",
    keyword: "Completion",
    theme: "Compassionate, wise, universal — the soul completing its karmic cycle.",
    desc: "Number 9 is the vibration of completion, compassion, and universal love. Mars channels its warrior energy into fighting for humanity's highest good. You are here to serve the world — not just your tribe. Your soul has accumulated wisdom across lifetimes, and your dharma is to give it back freely. The shadow is resentment when the world takes without reciprocating your generosity.",
    strengths: ["Universal compassion", "Wisdom", "Artistic depth", "Healing power", "Selfless service"],
    challenges: ["Resentment", "Over-giving", "Martyrdom", "Letting go"],
    luckyDays: "Tuesday, Thursday",
    luckyColors: ["#ef4444", "#f97316", "#dc2626"],
    compatibleWith: [1, 3, 6, 9],
  },
  11: {
    archetype: "The Illuminator",
    planet: "Moon (Master)", planetIcon: "☽", color: "#c084fc",
    keyword: "Enlightenment",
    theme: "Visionary, intuitive, spiritual messenger — the master number of illumination.",
    desc: "Master Number 11 is the channel between the earthly and divine realms. You are an intuitive antenna — receiving inspiration, insight, and visions beyond ordinary perception. Your dharma is to illuminate others: through art, teaching, healing, or spiritual leadership. The burden of 11 is extreme sensitivity; the gift is direct access to higher consciousness. You must ground your visions into practical reality.",
    strengths: ["Visionary insight", "Spiritual sensitivity", "Inspirational presence", "Psychic ability", "Healing gift"],
    challenges: ["Extreme sensitivity", "Anxiety", "Living in imagination", "Difficulty grounding"],
    luckyDays: "Monday, Sunday",
    luckyColors: ["#c084fc", "#818cf8", "#e879f9"],
    compatibleWith: [2, 4, 11, 22],
  },
  22: {
    archetype: "The Master Builder",
    planet: "Rahu (Master)", planetIcon: "☊", color: "#f59e0b",
    keyword: "Manifestation",
    theme: "Visionary architect, reality creator — the master number of unlimited potential.",
    desc: "Master Number 22 is the most powerful number in numerology — the Master Builder who can turn the grandest dreams into tangible reality. You combine the intuition of 11 with the practical discipline of 4. Your dharma is to build something that outlasts you: a system, institution, movement, or legacy that serves humanity. The shadow is the immense pressure of potential that leads to self-sabotage.",
    strengths: ["Manifestation power", "Visionary thinking", "Practical genius", "Leadership", "Legacy creation"],
    challenges: ["Overwhelming pressure", "Self-doubt", "Perfectionism", "Fear of failure"],
    luckyDays: "Saturday, Sunday",
    luckyColors: ["#f59e0b", "#fbbf24", "#a78bfa"],
    compatibleWith: [4, 8, 11, 22],
  },
  33: {
    archetype: "The Master Teacher",
    planet: "Jupiter (Master)", planetIcon: "♃", color: "#10b981",
    keyword: "Transcendence",
    theme: "Universal teacher, selfless healer — the rarest master number of unconditional love.",
    desc: "Master Number 33 is the rarest and most spiritually evolved number — the Christ Consciousness vibration. You are here to uplift humanity through unconditional love, teaching, and healing. Your dharma transcends personal ambition: you exist to serve the collective awakening. The shadow is the temptation to use spiritual power for personal gain, which immediately cuts off the channel.",
    strengths: ["Universal love", "Healing mastery", "Teaching gift", "Compassion", "Spiritual authority"],
    challenges: ["Martyrdom", "Unrealistic idealism", "Over-sacrifice", "Emotional exhaustion"],
    luckyDays: "Thursday, Monday",
    luckyColors: ["#10b981", "#34d399", "#6ee7b7"],
    compatibleWith: [3, 6, 9, 33],
  },
};

// ── Helpers ───────────────────────────────────────────────────
function digitSum(n: number): number {
  return String(Math.abs(n)).split("").reduce((s, d) => s + Number(d), 0);
}

function reduce(n: number): number {
  while (n > 9 && !MASTERS.has(n)) {
    n = digitSum(n);
  }
  return n;
}

function buildNumber(value: number, label: string): NumerologyNumber {
  const profile = NUM_DATA[value] ?? NUM_DATA[reduce(value)];
  return { value, isMaster: MASTERS.has(value), label, ...profile };
}

// ── Core Calculations ─────────────────────────────────────────
function calcLifePath(dob: string): number {
  const [y, m, d] = dob.split("-").map(Number);
  return reduce(reduce(d) + reduce(m) + reduce(digitSum(y)));
}

function calcDestiny(name: string): number {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  return reduce(letters.reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0));
}

function calcSoulUrge(name: string): number {
  const vowels = name.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(l => VOWELS.has(l));
  return reduce(vowels.reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0));
}

function calcPersonality(name: string): number {
  const cons = name.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(l => !VOWELS.has(l));
  return reduce(cons.reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0));
}

function calcBirthday(dob: string): number {
  return reduce(Number(dob.split("-")[2]));
}

function calcPersonalYear(dob: string, year = new Date().getFullYear()): number {
  const [, m, d] = dob.split("-").map(Number);
  return reduce(reduce(m) + reduce(d) + reduce(digitSum(year)));
}

function buildNameBreakdown(name: string): NameLetter[] {
  return name.toUpperCase().replace(/[^A-Z ]/g, "").split("").map(l => ({
    letter: l,
    value:  l === " " ? 0 : (LETTER_VALUES[l] ?? 0),
    isVowel: VOWELS.has(l),
  }));
}

function buildMonthForecast(personalYear: number): MonthForecast[] {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const currentMonth = new Date().getMonth() + 1;
  return MONTHS.map((name, i) => {
    const month = i + 1;
    const energy = reduce(personalYear + month);
    const mt = MONTH_THEMES[energy] ?? MONTH_THEMES[reduce(energy)];
    return {
      month,
      monthName: name,
      energy,
      isMaster: MASTERS.has(energy),
      theme: mt?.theme ?? "",
      icon:  mt?.icon ?? "✦",
      isCurrent: month === currentMonth,
    };
  });
}

// ── Pinnacle & Challenge Data ─────────────────────────────────
const PINNACLE_THEMES: Record<number, { theme: string; guidance: string }> = {
  1:  { theme: "Leadership & Self-Reliance",     guidance: "Pioneer your path, build independence, lead with courage and originality." },
  2:  { theme: "Partnership & Cooperation",      guidance: "Collaborate deeply, practice patience, serve through harmony and diplomacy." },
  3:  { theme: "Creative Expression",            guidance: "Create freely, communicate joyfully, share your authentic gifts with the world." },
  4:  { theme: "Work & Foundation Building",     guidance: "Build methodically, embrace discipline — sustained effort creates lasting value." },
  5:  { theme: "Change & Freedom",               guidance: "Embrace transformation and adventure; use freedom consciously for growth." },
  6:  { theme: "Love & Responsibility",          guidance: "Nurture home and community; give from fullness, not fear." },
  7:  { theme: "Introspection & Wisdom",         guidance: "Go inward, develop mastery through study, reflection, and spiritual practice." },
  8:  { theme: "Achievement & Authority",        guidance: "Build lasting success; claim your power ethically and lead with integrity." },
  9:  { theme: "Completion & Compassion",        guidance: "Give back, complete cycles, release the past, serve humanity generously." },
  11: { theme: "Spiritual Illumination",         guidance: "Channel inspiration and higher vision; your intuition is your greatest tool." },
  22: { theme: "Master Building",               guidance: "Turn grand visions into reality; create systems and legacies that transform the world." },
};

const CHALLENGE_MEANINGS: Record<number, string> = {
  0: "No dominant challenge — rare freedom to direct your energy fully. The test is conscious discipline without external pressure.",
  1: "Independence — overcome self-doubt and dependency. Learn to initiate and stand alone with genuine confidence.",
  2: "Sensitivity — develop emotional resilience and assertiveness. Release the need for constant external approval.",
  3: "Self-expression — conquer fear of judgment. Your authentic voice, ideas, and creativity are your gifts to the world.",
  4: "Discipline — balance structure without rigidity. Work methodically without becoming a slave to routine.",
  5: "Responsibility — harness freedom wisely. Stop escaping depth through endless novelty and stimulation.",
  6: "Perfectionism — release control in love and service. Care given from fear becomes manipulation, not love.",
  7: "Trust — open to connection and faith. Isolation protects but also imprisons the heart from true wisdom.",
  8: "Power — heal your relationship with money, authority, and ambition. Your fear of success is the real obstacle.",
};

const KARMIC_DEBT_DATA: Record<number, { meaning: string; remedy: string }> = {
  13: {
    meaning: "Karma of laziness and manipulation from a past life. This incarnation demands honest, sustained effort — there are no shortcuts. Tasks will feel heavy until you commit fully.",
    remedy:  "Embrace hard work as devotion. Finish what you start. Never claim credit you haven't earned.",
  },
  14: {
    meaning: "Karma of excess and misuse of freedom in a past life. This life demands temperance and conscious use of the senses.",
    remedy:  "Practice deliberate moderation. Use discipline as self-respect, not punishment.",
  },
  16: {
    meaning: "Karma of fallen pride and ego destruction. This life brings periodic collapse of ego structures to force genuine humility.",
    remedy:  "Practice humility before life forces it. Each ego defeat is a spiritual purification — surrender to it gracefully.",
  },
  19: {
    meaning: "Karma of self-centeredness and isolation in a past life. This life demands learning to receive help and acknowledge interdependence.",
    remedy:  "Accept help gracefully. Vulnerability and interdependence are not weakness — they are spiritual maturity.",
  },
};

const INTENSITY_MEANINGS: Record<number, { abundant: string; missing: string }> = {
  1: { abundant: "Strong drive, leadership, and initiative — watch for ego and inflexibility.", missing: "Difficulty asserting yourself — the lesson is to initiate without waiting for permission." },
  2: { abundant: "Highly empathetic and cooperative — watch for over-sensitivity and people-pleasing.", missing: "Relationship challenges — the lesson is to nurture connection and practice patience." },
  3: { abundant: "Gifted communicator and creator — watch for scattered energy and superficiality.", missing: "Self-expression blocks — the lesson is to share your inner world despite fear of judgment." },
  4: { abundant: "Disciplined and reliable — watch for rigidity and resistance to change.", missing: "Avoiding hard work — the lesson is to embrace methodical effort and build solid foundations." },
  5: { abundant: "Adventurous and versatile — watch for restlessness and commitment avoidance.", missing: "Fear of change — the lesson is to embrace uncertainty as the doorway to growth." },
  6: { abundant: "Loving and responsible — watch for martyrdom and perfectionism in relationships.", missing: "Difficulty with commitment — the lesson is to embrace responsibility as an act of love." },
  7: { abundant: "Analytical and introspective — watch for isolation and emotional detachment.", missing: "Spiritual disconnection — the lesson is to trust inner knowing beyond what can be proven." },
  8: { abundant: "Ambitious and authoritative — watch for materialism and power struggles.", missing: "Fear of success and authority — the lesson is to claim your right to abundance and leadership." },
  9: { abundant: "Deeply compassionate — watch for over-giving and unresolved resentment.", missing: "Difficulty releasing the past — the lesson is completion, forgiveness, and letting go." },
};

// ── New Calculation Functions ─────────────────────────────────

function calcCurrentAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function lpBase(lp: number): number {
  if (lp === 11) return 2;
  if (lp === 22) return 4;
  if (lp === 33) return 6;
  return lp;
}

function calcPinnacles(dob: string, lp: number, currentAge: number): PinnacleNumber[] {
  const [y, m, d] = dob.split("-").map(Number);
  const rm = reduce(m);
  const rd = reduce(d);
  const ry = reduce(digitSum(y));
  const p1v = reduce(rm + rd);
  const p2v = reduce(rd + ry);
  const p3v = reduce(p1v + p2v);
  const p4v = reduce(rm + ry);

  const base = lpBase(lp);
  const end1 = 36 - base;
  const end2 = end1 + 9;
  const end3 = end2 + 9;

  const pinnacles = [
    { number: p1v, label: "1st Pinnacle", ageFrom: 0,    ageTo: end1 },
    { number: p2v, label: "2nd Pinnacle", ageFrom: end1, ageTo: end2 },
    { number: p3v, label: "3rd Pinnacle", ageFrom: end2, ageTo: end3 },
    { number: p4v, label: "4th Pinnacle", ageFrom: end3, ageTo: null },
  ];

  return pinnacles.map(p => {
    const isActive = currentAge >= p.ageFrom && (p.ageTo === null || currentAge < p.ageTo);
    const meta = PINNACLE_THEMES[p.number] ?? PINNACLE_THEMES[reduce(p.number)] ?? PINNACLE_THEMES[1];
    return { ...p, isMaster: MASTERS.has(p.number), isActive, theme: meta.theme, guidance: meta.guidance };
  });
}

function calcChallenges(dob: string, lp: number, currentAge: number): ChallengeNumber[] {
  const [y, m, d] = dob.split("-").map(Number);
  const rm = reduce(m);
  const rd = reduce(d);
  const ry = reduce(digitSum(y));
  const c1 = Math.abs(rm - rd);
  const c2 = Math.abs(rd - ry);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(rm - ry);

  const base = lpBase(lp);
  const end1 = 36 - base;
  const end2 = end1 + 9;
  const end3 = end2 + 9;

  const challenges = [
    { number: c1, label: "1st Challenge", ageFrom: 0,    ageTo: end1 },
    { number: c2, label: "2nd Challenge", ageFrom: end1, ageTo: end2 },
    { number: c3, label: "Major Challenge (Life)", ageFrom: 0, ageTo: null },
    { number: c4, label: "4th Challenge", ageFrom: end3, ageTo: null },
  ];

  return challenges.map(c => ({
    ...c,
    isActive: currentAge >= c.ageFrom && (c.ageTo === null || currentAge < c.ageTo),
    meaning: CHALLENGE_MEANINGS[c.number] ?? CHALLENGE_MEANINGS[0],
  }));
}

function detectKarmicDebts(dob: string, name: string): KarmicDebt[] {
  const debts: KarmicDebt[] = [];
  const [y, month, day] = dob.split("-").map(Number);

  const checkRaw = (raw: number, source: string) => {
    if ([13, 14, 16, 19].includes(raw)) {
      const data = KARMIC_DEBT_DATA[raw];
      if (data) debts.push({ number: raw, reducedTo: reduce(raw), source, meaning: data.meaning, remedy: data.remedy });
    }
  };

  // Check Life Path intermediate sums
  checkRaw(reduce(day) + reduce(month) + reduce(digitSum(y)), "Life Path (full sum)");
  checkRaw(reduce(day), "Birth Day");

  // Check Destiny intermediate sums
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  const rawDestiny = letters.reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0);
  checkRaw(rawDestiny % 100, "Destiny Number");

  // Deduplicate
  const seen = new Set<number>();
  return debts.filter(d => { if (seen.has(d.number)) return false; seen.add(d.number); return true; });
}

function calcHiddenPassion(name: string): number[] {
  const counts: Record<number, number> = {};
  name.toUpperCase().replace(/[^A-Z]/g, "").split("").forEach(l => {
    const v = LETTER_VALUES[l];
    if (v) counts[v] = (counts[v] ?? 0) + 1;
  });
  if (Object.keys(counts).length === 0) return [1];
  const max = Math.max(...Object.values(counts));
  return Object.entries(counts).filter(([, c]) => c === max).map(([d]) => Number(d)).sort((a, b) => a - b);
}

function calcBridge(lp: number, destiny: number): number {
  return Math.abs(lpBase(lp) - (MASTERS.has(destiny) ? lpBase(destiny) : destiny));
}

function calcPersonalDay(dob: string): number {
  const now = new Date();
  const pyVal = calcPersonalYear(dob);
  return reduce(pyVal + reduce(now.getMonth() + 1) + reduce(now.getDate()));
}

function buildIntensityMap(name: string): IntensityEntry[] {
  const counts: Record<number, number> = {};
  name.toUpperCase().replace(/[^A-Z]/g, "").split("").forEach(l => {
    const v = LETTER_VALUES[l];
    if (v) counts[v] = (counts[v] ?? 0) + 1;
  });
  return Array.from({ length: 9 }, (_, i) => {
    const digit = i + 1;
    const count = counts[digit] ?? 0;
    const meta = INTENSITY_MEANINGS[digit];
    return {
      digit,
      count,
      missing: count === 0,
      meaning: count === 0 ? meta.missing : meta.abundant,
    };
  });
}

// ── Number Checker (Mobile / Vehicle / ATM PIN) ───────────────

const NUM_COMPAT: Record<number, number[]> = {
  1:[1,2,3,9], 2:[1,2,3,6,9], 3:[1,2,3,6,9],
  4:[1,4,5,8], 5:[1,3,5,6,9], 6:[2,3,5,6,9],
  7:[1,2,7],   8:[2,4,8],     9:[1,3,5,6,9],
  11:[2,4,11,22], 22:[4,8,11,22], 33:[3,6,9,33],
};

export type CompatScore = "excellent" | "good" | "neutral" | "challenging";

export interface DigitAnalysis {
  raw: string;
  digits: string;
  sum: number;
  root: number;
  last4: string;
  last4sum: number;
  last4root: number;
  lastDigit: number;
  compatScore: CompatScore;
  last4CompatScore: CompatScore;
  narrative: string;
  suggestedLastDigits: { digit: number; root: number; score: CompatScore }[];
  idealRoots: number[];
}

export interface ATMPin {
  pin: string;
  root: number;
  score: CompatScore;
}

function compatScore(a: number, b: number): CompatScore {
  const ca = NUM_COMPAT[a] ?? [];
  const cb = NUM_COMPAT[b] ?? [];
  if (ca.includes(b) && cb.includes(a)) return "excellent";
  if (ca.includes(b) || cb.includes(a)) return "good";
  if (Math.abs(a - b) <= 2) return "neutral";
  return "challenging";
}

function friendlyRoots(lp: number): number[] {
  if ([1,3,9].includes(lp)) return [1,3,5,9];
  if ([2,6].includes(lp)) return [2,3,6,9];
  if ([4,8].includes(lp)) return [4,5,6,8];
  if ([5].includes(lp)) return [1,3,5,6];
  if ([7].includes(lp)) return [1,2,7];
  return [1,2,3,6,9];
}

export function analyzeNumber(numStr: string, lifePath: number, destiny: number): DigitAnalysis | null {
  const digits = numStr.replace(/\D/g, "");
  if (!digits || digits.length < 1) return null;

  const sum = digits.split("").reduce((a, b) => a + Number(b), 0);
  const root = reduce(sum);
  const last4 = digits.slice(-4);
  const last4sum = last4.split("").reduce((a, b) => a + Number(b), 0);
  const last4root = reduce(last4sum);
  const lastDigit = Number(digits[digits.length - 1]);

  const cs = compatScore(lifePath, root);
  const l4cs = compatScore(lifePath, last4root);
  const ideal = friendlyRoots(lifePath);

  // Suggest last digits that shift root to friendly
  const suggestedLastDigits: { digit: number; root: number; score: CompatScore }[] = [];
  for (let last = 0; last <= 9; last++) {
    const baseSum = sum - lastDigit + last;
    const newRoot = reduce(baseSum);
    const sc = compatScore(lifePath, newRoot);
    const sc2 = compatScore(destiny, newRoot);
    if ((sc === "excellent" || sc === "good") && (sc2 === "excellent" || sc2 === "good")) {
      suggestedLastDigits.push({ digit: last, root: newRoot, score: sc === "excellent" && sc2 === "excellent" ? "excellent" : "good" });
    }
  }

  const NARRATIVES: Record<CompatScore, string> = {
    excellent: `Excellent match — total root ${root} harmonises perfectly with your Life Path ${lifePath}. This number amplifies your natural strengths. Calls connect, responses come fast, opportunities flow through it.`,
    good: `Good match — root ${root} and Life Path ${lifePath} have a friendly planetary relationship. Results are generally positive. Check last-4 root ${last4root} for finer tuning.`,
    neutral: `Neutral — root ${root} and Life Path ${lifePath} are neither friends nor enemies. Usable without major issues, but a small last-digit change can make it more compatible.`,
    challenging: `Vibrational friction — root ${root} has a tense relationship with Life Path ${lifePath}. This can manifest as missed connections, delayed responses, or subtle resistance. Changing the last digit will shift the total root to a compatible one.`,
  };

  return { raw: numStr, digits, sum, root, last4, last4sum, last4root, lastDigit, compatScore: cs, last4CompatScore: l4cs, narrative: NARRATIVES[cs], suggestedLastDigits, idealRoots: ideal };
}

export function suggestATMPins(lifePath: number, destiny: number): ATMPin[] {
  const targets = new Set([...(NUM_COMPAT[lifePath] ?? []), ...(NUM_COMPAT[destiny] ?? [])]);
  const pins: ATMPin[] = [];
  for (let pin = 1000; pin <= 9999 && pins.length < 8; pin++) {
    const d = pin.toString().split("").map(Number);
    if (d[0] === d[1] && d[1] === d[2] && d[2] === d[3]) continue; // 1111
    if (d[1]-d[0]===1 && d[2]-d[1]===1 && d[3]-d[2]===1) continue; // 1234
    const root = reduce(d.reduce((a, b) => a + b, 0));
    if (targets.has(root)) {
      const sc = compatScore(lifePath, root);
      pins.push({ pin: pin.toString(), root, score: sc });
    }
  }
  return pins;
}

// ── Master Function ───────────────────────────────────────────
export function calculateNumerology(name: string, dob: string): NumerologyResult {
  const lpVal = calcLifePath(dob);
  const deVal = calcDestiny(name);
  const suVal = calcSoulUrge(name);
  const pnVal = calcPersonality(name);
  const bdVal = calcBirthday(dob);
  const mtVal = reduce(lpVal + deVal);
  const pyVal = calcPersonalYear(dob);

  const lifePath     = buildNumber(lpVal, "Life Path");
  const destiny      = buildNumber(deVal, "Destiny");
  const soulUrge     = buildNumber(suVal, "Soul Urge");
  const personality  = buildNumber(pnVal, "Personality");
  const birthday     = buildNumber(bdVal, "Birthday");
  const maturity     = buildNumber(mtVal, "Maturity");
  const personalYear = buildNumber(pyVal, "Personal Year");

  const currentAge    = calcCurrentAge(dob);
  const pinnacles     = calcPinnacles(dob, lpVal, currentAge);
  const challenges    = calcChallenges(dob, lpVal, currentAge);
  const activePinnacle  = pinnacles.find(p => p.isActive) ?? null;
  const activeChallenge = challenges.find(c => c.isActive && c.label !== "Major Challenge (Life)") ?? null;
  const karmicDebts   = detectKarmicDebts(dob, name);
  const hiddenPassion = calcHiddenPassion(name);
  const bridgeNumber  = calcBridge(lpVal, deVal);
  const personalDay   = calcPersonalDay(dob);
  const intensityMap  = buildIntensityMap(name);
  const nameBreakdown = buildNameBreakdown(name);
  const monthForecast = buildMonthForecast(pyVal);

  const firstName = name.split(" ")[0];
  const isMasterPresent = [lpVal, deVal, suVal].some(v => MASTERS.has(v));
  const summary = isMasterPresent
    ? `${firstName} carries master number energy — a soul with an extraordinary dharmic mission. Rare spiritual responsibility and immense creative potential define this lifetime.`
    : `Life Path ${lpVal} (${lifePath.archetype}) meets Destiny ${deVal} (${destiny.archetype}). ${lifePath.theme}`;

  return {
    name, dob, currentAge, lifePath, destiny, soulUrge, personality, birthday, maturity, personalYear,
    personalDay, bridgeNumber, hiddenPassion, pinnacles, challenges, activePinnacle, activeChallenge,
    karmicDebts, intensityMap, nameBreakdown, monthForecast, summary,
  };
}
