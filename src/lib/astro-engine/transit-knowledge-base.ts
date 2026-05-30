// AstroLife Transit Knowledge Base — Hybrid Python/TypeScript
// Extracted from astrolife_transit_ripple_v4.py + custom enhancements

export const PLANET_KNOWLEDGE: Record<string, {
  nature: string;
  role: string;
  action: string;
  weight: number;
  highExpression: string;
  shadowExpression: string;
  careerEffect: string;
  moneyEffect: string;
  relationshipEffect: string;
  healthEffect: string;
  remedies: string[];
}> = {
  Sun: {
    nature: "royal, fiery, authoritative and soul-centered",
    role: "authority, vitality, father, confidence and leadership",
    action: "act with clarity, responsibility and clean ego",
    weight: 54,
    highExpression: "clarity, courage, dignity, leadership and conscious self-expression",
    shadowExpression: "ego conflict, harshness, pride, authority clash and burnout",
    careerEffect: "Sun pushes visibility, responsibility and defined authority in work.",
    moneyEffect: "Money decisions connect with pride, status, government or father-like guidance.",
    relationshipEffect: "Relationships may face ego issues, but honest leadership improves respect.",
    healthEffect: "Vitality, heart, eyes, heat, head and blood pressure patterns need awareness.",
    remedies: ["Offer water to Surya in the morning", "Respect father, mentors and authority", "Avoid ego-based decisions", "Practice humility with leadership"],
  },
  Moon: {
    nature: "emotional, reflective, nurturing and changeable",
    role: "mind, mood, comfort, mother and daily emotional weather",
    action: "protect sleep, hydration and emotional steadiness",
    weight: 46,
    highExpression: "emotional intelligence, softness, intuition, nourishment and adaptability",
    shadowExpression: "mood swings, fear, dependency, overthinking and emotional flooding",
    careerEffect: "Career decisions influenced by mood, public response or emotional environment.",
    moneyEffect: "Spending may increase on comfort, food, home, mother, travel or emotional needs.",
    relationshipEffect: "Emotional closeness increases, but insecurity can also rise.",
    healthEffect: "Sleep, fluids, stomach, hormones and emotional digestion need care.",
    remedies: ["Keep sleep regular", "Serve mother or mother-like figures", "Avoid emotional eating", "Do calming mantra or water-based meditation"],
  },
  Mars: {
    nature: "fiery, aggressive, protective, action-driven and surgical",
    role: "action, conflict, courage, property and urgency",
    action: "channel heat into disciplined action, not reaction",
    weight: 58,
    highExpression: "courage, stamina, discipline, protection and focused action",
    shadowExpression: "anger, accidents, inflammation, haste, conflict and impulsive decisions",
    careerEffect: "Mars pushes action, competition, leadership in crisis and decisive execution.",
    moneyEffect: "Money goes into machinery, property, tools, repairs, surgery, vehicles or aggressive business.",
    relationshipEffect: "Passion rises, but anger and arguments must be controlled.",
    healthEffect: "Blood, muscles, inflammation, cuts, burns, surgery and accidents need attention.",
    remedies: ["Exercise regularly", "Avoid impulsive anger", "Donate red lentils or support soldiers/workers", "Channel energy into disciplined action"],
  },
  Mercury: {
    nature: "intellectual, youthful, commercial, analytical and communicative",
    role: "communication, commerce, documents, learning and decisions",
    action: "verify details, messages and paperwork",
    weight: 50,
    highExpression: "intelligence, communication, analysis, trade and adaptability",
    shadowExpression: "overthinking, confusion, nervousness, trickery and scattered attention",
    careerEffect: "Career improves through communication, writing, analytics, technology, sales, learning.",
    moneyEffect: "Money decisions become linked with trade, calculation, negotiation and information.",
    relationshipEffect: "Conversation becomes central. Miscommunication can create issues.",
    healthEffect: "Nerves, skin, speech, intestines, lungs and anxiety patterns need awareness.",
    remedies: ["Organize documents", "Avoid lies and gossip", "Study daily", "Donate green items or learning material"],
  },
  Jupiter: {
    nature: "wise, expansive, protective, ethical and growth-oriented",
    role: "growth, wisdom, mentors, children, grace and opportunity",
    action: "say yes to ethical expansion and learning",
    weight: 62,
    highExpression: "wisdom, faith, prosperity, ethics, teaching and grace",
    shadowExpression: "overconfidence, excess, laziness, weight gain and false optimism",
    careerEffect: "Career grows through guidance, teaching, advisory roles, education, law, finance.",
    moneyEffect: "Money can grow, but over-expansion should be controlled.",
    relationshipEffect: "Relationships become more forgiving, wise and family-oriented.",
    healthEffect: "Liver, fat, sugar, thighs, growth patterns and overindulgence need awareness.",
    remedies: ["Respect teachers and gurus", "Donate yellow food or study material", "Teach or guide someone sincerely", "Avoid overpromising"],
  },
  Venus: {
    nature: "soft, artistic, relational, luxurious and harmonizing",
    role: "relationship, comfort, art, vehicles, pleasure and agreement",
    action: "repair harmony and avoid indulgent spending",
    weight: 52,
    highExpression: "love, harmony, refinement, creativity, attraction and sweetness",
    shadowExpression: "indulgence, vanity, laziness, sensual excess and relationship confusion",
    careerEffect: "Career benefits through design, beauty, entertainment, luxury, hospitality, art, counselling.",
    moneyEffect: "Money may go into comfort, fashion, vehicle, beauty, spouse, art or luxury.",
    relationshipEffect: "Romance and attraction increase, but expectations and pleasure-seeking can also rise.",
    healthEffect: "Kidneys, reproductive system, sugar balance, skin and hormones need care.",
    remedies: ["Respect women and spouse", "Keep relationships clean and honest", "Avoid excess luxury spending", "Donate white sweets or beauty-care items to needy women"],
  },
  Saturn: {
    nature: "slow, karmic, disciplined, realistic and pressure-giving",
    role: "karma, duty, delay, structure, work and maturity",
    action: "show consistency and respect timelines",
    weight: 68,
    highExpression: "discipline, patience, responsibility, endurance, service and lasting success",
    shadowExpression: "fear, delay, loneliness, heaviness, chronic pressure and pessimism",
    careerEffect: "Career demands hard work, accountability, structure and proof.",
    moneyEffect: "Money becomes serious. Saturn asks for savings, debt control, ethical income and patience.",
    relationshipEffect: "Relationships are tested for maturity, loyalty and responsibility.",
    healthEffect: "Bones, joints, teeth, chronic fatigue, ageing, nerves and stiffness need attention.",
    remedies: ["Serve elderly, poor or workers", "Do disciplined daily work", "Avoid laziness and blame", "Donate black sesame, shoes, blankets or food"],
  },
  Rahu: {
    nature: "unconventional, obsessive, foreign, technological and illusion-creating",
    role: "ambition, foreign connections, technology, obsession, confusion and sudden hunger",
    action: "test facts before chasing shortcuts",
    weight: 64,
    highExpression: "innovation, ambition, foreign success, technology and unconventional rise",
    shadowExpression: "illusion, addiction, anxiety, scandal, obsession and shortcuts",
    careerEffect: "Career can rise through technology, foreign links, media, politics, unconventional fields.",
    moneyEffect: "Money may come suddenly but can also disappear through risky speculation or illusion.",
    relationshipEffect: "Unusual attraction, obsession or foreign connection may arise.",
    healthEffect: "Toxins, allergies, anxiety, addiction, unusual symptoms and skin issues need awareness.",
    remedies: ["Avoid shortcuts and addiction", "Do grounding practices", "Serve outcast, poor or foreign people", "Check facts before acting"],
  },
  Ketu: {
    nature: "detached, spiritual, cutting, past-life oriented and moksha-giving",
    role: "detachment, release, spiritual insight, confusion, research and past karma",
    action: "simplify, observe and avoid over-control",
    weight: 58,
    highExpression: "intuition, liberation, research, detachment and spiritual depth",
    shadowExpression: "confusion, isolation, carelessness, sudden breaks and lack of grounding",
    careerEffect: "Career may feel meaningless unless connected with research, spirituality, healing.",
    moneyEffect: "Money decisions may become detached or careless. Avoid neglecting material duties.",
    relationshipEffect: "Distance, silence or spiritualized love may appear.",
    healthEffect: "Hidden symptoms, nerve sensitivity, wounds, mysterious pain and sudden weakness.",
    remedies: ["Worship Ganesha", "Avoid careless detachment", "Feed stray dogs", "Practice grounding and humility"],
  },
};

export const HOUSE_KNOWLEDGE: Record<number, {
  name: string;
  areas: string;
  coreTheme: string;
  rules: string[];
}> = {
  1: { name: "Self", areas: "body, identity, personality, confidence, health, appearance, direction", coreTheme: "Life asks to rebuild the self, body and personal direction", rules: ["Maintain body discipline", "Wake up early", "Exercise or walk daily", "Avoid ego reactions"] },
  2: { name: "Wealth", areas: "money, savings, food, family, speech, values, teeth and stored resources", coreTheme: "Life audits money, family values, food habits and speech", rules: ["Donate food", "Control speech", "Avoid addiction", "Start disciplined saving"] },
  3: { name: "Courage", areas: "courage, siblings, writing, media, documents, short travel, skills", coreTheme: "Life asks to act, communicate and organize effort", rules: ["Organize documents", "Write daily", "Repair sibling communication", "Avoid gossip"] },
  4: { name: "Home", areas: "home, mother, property, vehicles, emotional peace, land and inner security", coreTheme: "Life rebuilds emotional foundation and domestic stability", rules: ["Serve mother", "Clean home temple", "Spend time in nature", "Do emotional journaling"] },
  5: { name: "Creativity", areas: "children, romance, creativity, intelligence, mantra, speculation and purva punya", coreTheme: "Life tests joy, creativity, romance, children and mental patterns", rules: ["Do mantra japa", "Keep a dream journal", "Avoid gambling", "Support children or students"] },
  6: { name: "Health", areas: "health, debt, enemies, disputes, employees, animals, routine, service", coreTheme: "Life asks for cleanup of health, debt, documents and routine", rules: ["Feed animals", "Donate for medical help", "Exercise regularly", "Clear debts slowly"] },
  7: { name: "Marriage", areas: "spouse, business partners, contracts, public dealing, clients and commitment", coreTheme: "Life tests commitment, partnership and public dealing", rules: ["Keep promises", "Review contracts", "Respect spouse or partner", "Avoid ego in relationship"] },
  8: { name: "Transformation", areas: "secrets, sudden events, inheritance, occult, chronic issues, intimacy", coreTheme: "Life exposes hidden truth and forces deep transformation", rules: ["Do health checkups", "Avoid secrecy", "Donate for medical treatment", "Practice meditation"] },
  9: { name: "Dharma", areas: "luck, father, guru, higher education, long-distance travel, temples", coreTheme: "Life tests faith, teachers, beliefs and higher guidance", rules: ["Serve guru, father or teachers", "Do temple seva", "Donate study material", "Study scripture or wisdom texts"] },
  10: { name: "Career", areas: "profession, authority, status, bosses, public image, karma and responsibility", coreTheme: "Life tests career direction and public responsibility", rules: ["Respect seniors", "Work daily with discipline", "Update career documents", "Avoid office politics"] },
  11: { name: "Gains", areas: "income, friends, elder siblings, audience, community, gains and large goals", coreTheme: "Life filters networks and income sources", rules: ["Help friends responsibly", "Repay old debts", "Avoid fake groups", "Serve community"] },
  12: { name: "Release", areas: "expenses, sleep, hospitals, isolation, foreign lands, retreats and moksha", coreTheme: "Life releases old baggage and audits expenses", rules: ["Meditate daily", "Donate to hospitals or ashrams", "Fix sleep routine", "Donate shoes or blankets"] },
};

export const NAKSHATRA_KNOWLEDGE: Record<string, {
  lord: string;
  essence: string;
  gift: string;
  shadow: string;
  remedyTone: string;
}> = {
  Ashwini: { lord: "Ketu", essence: "new beginning, healing impulse, speed and rescue", gift: "quick recovery, fast movement and fresh start", shadow: "impatience, unfinished work and impulsive decisions", remedyTone: "begin cleanly, heal quickly, avoid hurry" },
  Bharani: { lord: "Venus", essence: "birth, death, restraint, responsibility and consequence", gift: "endurance, capacity to carry pressure and moral strength", shadow: "excess, indulgence and karmic burden", remedyTone: "respect boundaries and choose dharma over impulse" },
  Krittika: { lord: "Sun", essence: "cutting, purification, fire and truth", gift: "clarity, courage and purification", shadow: "harsh speech, criticism and burning bridges", remedyTone: "purify without cruelty" },
  Rohini: { lord: "Moon", essence: "growth, beauty, fertility and material nourishment", gift: "prosperity, creativity and sensual harmony", shadow: "attachment, possessiveness and comfort addiction", remedyTone: "nourish without clinging" },
  Mrigashira: { lord: "Mars", essence: "searching, curiosity, movement and emotional seeking", gift: "exploration, research and gentle discovery", shadow: "restlessness and never feeling satisfied", remedyTone: "search with direction" },
  Ardra: { lord: "Rahu", essence: "storm, grief, transformation and emotional release", gift: "breakthrough after storm", shadow: "chaos, anger and destructive speech", remedyTone: "release pain consciously" },
  Punarvasu: { lord: "Jupiter", essence: "return, renewal, protection and second chance", gift: "restoration and hope", shadow: "repeating old cycles", remedyTone: "restart wisely" },
  Pushya: { lord: "Saturn", essence: "support, teaching, nourishment and tradition", gift: "growth through discipline and blessings", shadow: "rigidity and emotional withholding", remedyTone: "serve and nourish responsibly" },
  Ashlesha: { lord: "Mercury", essence: "binding, psychology, poison, strategy and hidden power", gift: "deep perception and healing through awareness", shadow: "manipulation, secrecy and mental poison", remedyTone: "speak truth and remove toxicity" },
  Magha: { lord: "Ketu", essence: "ancestors, lineage, power and inheritance", gift: "authority through roots", shadow: "pride and ancestral burden", remedyTone: "honour ancestors without ego" },
  "Purva Phalguni": { lord: "Venus", essence: "pleasure, love, rest, creativity and enjoyment", gift: "beauty, romance and celebration", shadow: "laziness, indulgence and vanity", remedyTone: "enjoy without excess" },
  "Uttara Phalguni": { lord: "Sun", essence: "contracts, support, patronage and noble commitment", gift: "stable alliance and social respect", shadow: "ego in duty and relationship pride", remedyTone: "honour commitments" },
  Hasta: { lord: "Moon", essence: "hands, craft, manifestation, healing and cleverness", gift: "skill, healing and practical intelligence", shadow: "control, trickery and nervous manipulation", remedyTone: "use skill ethically" },
  Chitra: { lord: "Mars", essence: "design, beauty, architecture and construction", gift: "creative engineering and visual excellence", shadow: "image obsession and conflict through perfectionism", remedyTone: "build beauty with humility" },
  Swati: { lord: "Rahu", essence: "independence, wind, business and scattered movement", gift: "freedom, trade and adaptability", shadow: "instability and isolation", remedyTone: "use freedom with discipline" },
  Vishakha: { lord: "Jupiter", essence: "ambition, victory, focus and dual desire", gift: "achievement and determination", shadow: "obsession and moral compromise", remedyTone: "win ethically" },
  Anuradha: { lord: "Saturn", essence: "friendship, devotion, loyalty and disciplined love", gift: "alliance, devotion and emotional maturity", shadow: "dependency and silent suffering", remedyTone: "love with boundaries" },
  Jyeshtha: { lord: "Mercury", essence: "seniority, protection, power and responsibility", gift: "command and strategic protection", shadow: "jealousy, superiority and pressure", remedyTone: "protect without domination" },
  Mula: { lord: "Ketu", essence: "root cutting, destruction, investigation and truth", gift: "deep research and liberation from false roots", shadow: "loss, shock and harsh detachment", remedyTone: "remove false roots consciously" },
  "Purva Ashadha": { lord: "Venus", essence: "water victory, persuasion, declaration and cleansing", gift: "confidence and emotional victory", shadow: "overconfidence and emotional drama", remedyTone: "cleanse ego through truth" },
  "Uttara Ashadha": { lord: "Sun", essence: "final victory, duty, ethics and lasting achievement", gift: "permanent success", shadow: "rigidity and moral pride", remedyTone: "win through integrity" },
  Shravana: { lord: "Moon", essence: "listening, learning, travel and preservation", gift: "wisdom through listening", shadow: "gossip and passive confusion", remedyTone: "listen deeply" },
  Dhanishtha: { lord: "Mars", essence: "rhythm, wealth, music, real estate and community", gift: "prosperity through rhythm and group effort", shadow: "status pressure and emotional emptiness", remedyTone: "honour rhythm and sharing" },
  Shatabhisha: { lord: "Rahu", essence: "healing, secrets, medicine, isolation and technology", gift: "diagnosis, research and hidden healing", shadow: "addiction, isolation and coldness", remedyTone: "heal without hiding" },
  "Purva Bhadrapada": { lord: "Jupiter", essence: "spiritual fire, duality, intensity and transformation", gift: "spiritual courage", shadow: "extremism and inner split", remedyTone: "use intensity for tapasya" },
  "Uttara Bhadrapada": { lord: "Saturn", essence: "deep waters, hidden wisdom, stability and endurance", gift: "depth, maturity and spiritual steadiness", shadow: "emotional heaviness and stagnation", remedyTone: "stabilize the inner ocean" },
  Revati: { lord: "Mercury", essence: "safe travel, nourishment, guidance, completion and closure", gift: "protection, creativity, guidance and peaceful transition", shadow: "wandering, confusion and inability to complete", remedyTone: "complete the old journey and move with guidance" },
};

export function getPlanetNarrative(planet: string): string {
  const kb = PLANET_KNOWLEDGE[planet];
  if (!kb) return `${planet} is an active force in your chart.`;
  return `${planet} brings ${kb.highExpression}. In its shadow, it can show ${kb.shadowExpression}. The remedy is to ${kb.action}.`;
}

export function getHouseNarrative(house: number): string {
  const kb = HOUSE_KNOWLEDGE[house];
  if (!kb) return `House ${house} is an active area.`;
  return `${kb.name} governs ${kb.areas}. ${kb.coreTheme}.`;
}

export function getNakshatraNarrative(nakshatra: string): string {
  const kb = NAKSHATRA_KNOWLEDGE[nakshatra];
  if (!kb) return `${nakshatra} is the background energy.`;
  return `${nakshatra} (ruled by ${kb.lord}) carries the essence of ${kb.essence}. Its gift is ${kb.gift}, while its shadow can show as ${kb.shadow}.`;
}

export function buildRichMeaning(planet: string, nakshatra: string, house: number, orb: number): string {
  const planetNarr = getPlanetNarrative(planet);
  const houseName = HOUSE_KNOWLEDGE[house]?.name || `House ${house}`;
  const houseNarr = getHouseNarrative(house);
  const nakshatraNarr = getNakshatraNarrative(nakshatra);

  return `${planet} ${nakshatra} conjunction within ${orb}°. ${planetNarr} This activates ${houseName}, where ${houseNarr}. ${nakshatraNarr}`;
}
