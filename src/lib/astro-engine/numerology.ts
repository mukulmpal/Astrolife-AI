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

export interface NumerologyResult {
  name:          string;
  dob:           string;
  lifePath:      NumerologyNumber;
  destiny:       NumerologyNumber;
  soulUrge:      NumerologyNumber;
  personality:   NumerologyNumber;
  birthday:      NumerologyNumber;
  maturity:      NumerologyNumber;
  personalYear:  NumerologyNumber;
  nameBreakdown: NameLetter[];
  monthForecast: MonthForecast[];
  summary:       string;
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

  const nameBreakdown = buildNameBreakdown(name);
  const monthForecast = buildMonthForecast(pyVal);

  const firstName = name.split(" ")[0];
  const isMasterPresent = [lpVal, deVal, suVal].some(v => MASTERS.has(v));
  const summary = isMasterPresent
    ? `${firstName} carries master number energy — a soul with an extraordinary dharmic mission. Rare spiritual responsibility and immense creative potential define this lifetime.`
    : `Life Path ${lpVal} (${lifePath.archetype}) meets Destiny ${deVal} (${destiny.archetype}). ${lifePath.theme}`;

  return { name, dob, lifePath, destiny, soulUrge, personality, birthday, maturity, personalYear, nameBreakdown, monthForecast, summary };
}
