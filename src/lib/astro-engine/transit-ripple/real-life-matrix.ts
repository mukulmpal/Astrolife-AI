/**
 * ============================================================================
 * ASTROLIFE — REAL-LIFE HUMAN SCENARIOS & 5-DOMAIN MATRIX
 * ============================================================================
 * Translates planetary transits and houses into relatable 9-to-5 life situations.
 * Eliminates technical jargon in favor of clear human life domains.
 * ============================================================================
 */

import type { TransitPlanet } from "./types";

export type LifeDomain = "work" | "money" | "relationships" | "health" | "inner";

export interface DomainMeta {
  key: LifeDomain;
  icon: string;
  nameHinglish: string;
  nameEnglish: string;
}

export const DOMAIN_META: Record<LifeDomain, DomainMeta> = {
  work: {
    key: "work",
    icon: "💼",
    nameHinglish: "काम और आजीविका (Career & Work)",
    nameEnglish: "Career & Daily Work",
  },
  money: {
    key: "money",
    icon: "💰",
    nameHinglish: "धन और आर्थिक निर्णय (Money & Wealth)",
    nameEnglish: "Money & Financial Decisions",
  },
  relationships: {
    key: "relationships",
    icon: "🤝",
    nameHinglish: "संबंध और वाणी (Relationships & Communication)",
    nameEnglish: "Relationships & Communication",
  },
  health: {
    key: "health",
    icon: "🌿",
    nameHinglish: "स्वास्थ्य और शारीरिक ऊर्जा (Health & Energy)",
    nameEnglish: "Health & Vitality",
  },
  inner: {
    key: "inner",
    icon: "🧘",
    nameHinglish: "मानसिक शांति और आंतरिक संतुलन (Inner Peace & Mind)",
    nameEnglish: "Inner Peace & Emotional Balance",
  },
};

/**
 * Mapping of each Vedic house to its primary real-world human domains
 */
export const HOUSE_PRIMARY_DOMAINS: Record<number, LifeDomain[]> = {
  1: ["health", "inner", "work"],
  2: ["money", "relationships"],
  3: ["work", "relationships"],
  4: ["inner", "relationships"],
  5: ["work", "money", "inner"],
  6: ["health", "work", "money"],
  7: ["relationships", "work"],
  8: ["inner", "money", "health"],
  9: ["inner", "work", "money"],
  10: ["work", "money"],
  11: ["money", "work", "relationships"],
  12: ["inner", "health", "money"],
};

export interface HouseHumanContext {
  house: number;
  labelHinglish: string;
  labelEnglish: string;
  humanSummaryHinglish: string;
  humanSummaryEnglish: string;
  cautionThemeHinglish: string;
  cautionThemeEnglish: string;
  actionThemeHinglish: string;
  actionThemeEnglish: string;
}

export const HOUSE_HUMAN_DATA: Record<number, HouseHumanContext> = {
  1: {
    house: 1,
    labelHinglish: "आपका व्यक्तित्व और शारीरिक ऊर्जा का घर",
    labelEnglish: "Self, Vitality & Physical Direction",
    humanSummaryHinglish:
      "Aapka swasthya, physical stamina aur self-image is samay focus me hain. Khud ko overwork karne se bachein aur daily routine ko sthir banayein.",
    humanSummaryEnglish:
      "Your physical vitality, personal stamina, and self-image are in the spotlight. Avoid exhausting yourself and anchor daily grounding habits.",
    cautionThemeHinglish:
      "Shareer ko ignore karke continuous stress lene se bachein; neend aur aahar ka routine mat todiye.",
    cautionThemeEnglish:
      "Avoid pushing through physical fatigue without restorative recovery; protect baseline sleep rhythms.",
    actionThemeHinglish:
      "Naye health routine ya morning workout ki shuruat karein; apne posture aur stamina par dhyan dein.",
    actionThemeEnglish:
      "Commit to a sustainable morning routine or physical exercise regimen to channel high internal energy.",
  },
  2: {
    house: 2,
    labelHinglish: "आपकी वाणी और बैंक बैलेंस का घर",
    labelEnglish: "Wealth, Family Assets & Speech",
    humanSummaryHinglish:
      "Aapki bolchal ki tone aur savings is samay testing phase me hain. Parivarik baaton me shaanti aur kharche par control rakhna zaroori hai.",
    humanSummaryEnglish:
      "Your speech tone and accumulated liquid savings are highlighted. Exercise thoughtful restraint in family discussions and non-essential expenditures.",
    cautionThemeHinglish:
      "Kisi ko emotional hokar udhaar na dein, aur na hi achanak kisi speculative scheme me paisa lagayein.",
    cautionThemeEnglish:
      "Avoid impulsive capital deployments or emotionally pressured loans; verify all financial proposals thoroughly.",
    actionThemeHinglish:
      "Monthly budget ko review karein aur pending savings ya safe long-term instruments me bachat badhayein.",
    actionThemeEnglish:
      "Review your monthly expenses and systematically allocate liquidity into secure long-term vehicles.",
  },
  3: {
    house: 3,
    labelHinglish: "आपकी हिम्मत और नए प्रयासों का घर",
    labelEnglish: "Initiative, Courage & Strategic Communication",
    humanSummaryHinglish:
      "Nayi skills sikhne, networking aur proactively naye projects initiate karne ke liye yeh samay naye raste khol sakta hai.",
    humanSummaryEnglish:
      "A fertile period for learning new competencies, pitching strategic proposals, and taking calculated entrepreneurial steps.",
    cautionThemeHinglish:
      "Bina tayyari ke jhagde ya over-aggressive communication me na padein; baat ko written me clear rakhein.",
    cautionThemeEnglish:
      "Avoid entering unvetted disputes or combative messaging; document expectations in writing before execution.",
    actionThemeHinglish:
      "Ruke hue proposals par polite follow-up karein aur kisi nayi craft ya technology par focus badhayein.",
    actionThemeEnglish:
      "Follow up proactively on paused initiatives and dedicate daily hours to mastering a high-leverage skill.",
  },
  4: {
    house: 4,
    labelHinglish: "आपके घर की शांति और मानसिक सुकून का घर",
    labelEnglish: "Home, Emotional Serenity & Real Estate",
    humanSummaryHinglish:
      "Ghar ka mahol aur antarmann ki shanti is samay aapka mukhya dhyan maang rahi hai. Parivar me boundaries banaye rakhein.",
    humanSummaryEnglish:
      "Your domestic environment and inner psychological peace need mindful care. Balance emotional empathy with clear personal boundaries.",
    cautionThemeHinglish:
      "Ghar me purani baaton ko kuredkar bahas karne se bachein; property ya vehicle ke kaagzaat dhyan se check karein.",
    cautionThemeEnglish:
      "Avoid reigniting past domestic arguments; double-check property or automobile documentation before signing.",
    actionThemeHinglish:
      "Apne living space ko declutter karein aur ghar ke buzurgon ya mataji ke sath quality samay bitayein.",
    actionThemeEnglish:
      "Declutter your personal living space and carve out undistracted moments with family elders or maternal figures.",
  },
  5: {
    house: 5,
    labelHinglish: "आपकी रचनात्मक बुद्धि और दूरगामी निर्णयों का घर",
    labelEnglish: "Intellect, Creativity & Long-Term Investments",
    humanSummaryHinglish:
      "Creative ideas aur strategic problem-solving me vistar aane ke sanket hain. Parantu jaldbazi me satta ya gambling se door rahein.",
    humanSummaryEnglish:
      "A surge in creative clarity and analytical problem-solving. Ground high enthusiasm in rigorous mathematical due diligence.",
    cautionThemeHinglish:
      "Intraday stock trading ya quick-return schemes me paisa na lagayein; logic aur research par bharosa karein.",
    cautionThemeEnglish:
      "Steer clear of speculative financial bets or volatile shortcuts; trust systematic fundamental research.",
    actionThemeHinglish:
      "Kisi creative project, research paper ya nayi strategy ka blueprint finalize karein.",
    actionThemeEnglish:
      "Architect a structured blueprint for a creative initiative, strategic research, or educational pursuit.",
  },
  6: {
    house: 6,
    labelHinglish: "आपकी दिनचर्या, काम के दबाव और स्वास्थ्य का घर",
    labelEnglish: "Daily Grind, Health Rhythms & Conflict Resolution",
    humanSummaryHinglish:
      "Workplace par tasks ka bojh aur daily physical stamina par asar pad sakta hai. Discipline ke sath ek-ek karke kaam niptayein.",
    humanSummaryEnglish:
      "Operational workload and physical stamina are actively tested. Approach routine duties methodically without anxiety.",
    cautionThemeHinglish:
      "Bina zaroorat ke karz (credit debt) na badhayein aur gut-health ya digestive laparwahi se bachein.",
    cautionThemeEnglish:
      "Avoid incurring unnecessary debt or interest burdens; guard digestive wellness and regular meal times.",
    actionThemeHinglish:
      "Pichhle kuch hafton se latke hue administrative tasks aur health checkups ko complete karein.",
    actionThemeEnglish:
      "Clear outstanding administrative backlog, organize your workspace, and schedule routine preventive wellness care.",
  },
  7: {
    house: 7,
    labelHinglish: "आपकी साझेदारियों और करीबी रिश्तों का घर",
    labelEnglish: "Partnerships, Marriage & Business Contracts",
    humanSummaryHinglish:
      "Business partners aur life partner ke sath commitments aur zimmedariyan aage aayengi. Shanti aur transparency sabse badi taqat hogi.",
    humanSummaryEnglish:
      "Partnership expectations, mutual commitments, and commercial alliances are in focus. Mutual transparency is essential.",
    cautionThemeHinglish:
      "Maukhik (verbal) vaadon par deal na karein; partnership me expectations ko written contract me clear rakhein.",
    cautionThemeEnglish:
      "Do not rely solely on informal verbal promises; ensure terms and deliverables in alliances are documented.",
    actionThemeHinglish:
      "Partner ke sath baithkar open dialogue karein aur mutual roadmap ko clear karein.",
    actionThemeEnglish:
      "Initiate honest, constructive dialogue with your partner or co-founder to align on shared priorities.",
  },
  8: {
    house: 8,
    labelHinglish: "गंभीर शोध, बदलाव और आंतरिक शक्ति का घर",
    labelEnglish: "Transformation, Deep Research & Strategic Transition",
    humanSummaryHinglish:
      "Purani aadat chhodkar life ko gehrai se restructure karne ka daur hai. Chhupi hui baatein aur research saamne aa sakti hain.",
    humanSummaryEnglish:
      "A period of foundational restructuring, deep research, and unburdening outdated models to build lasting psychological strength.",
    cautionThemeHinglish:
      "Overthinking aur akelepan me negativity badhane se bachein; joint finances me clarity banaye rakhein.",
    cautionThemeEnglish:
      "Avoid spiraling into nocturnal overthinking; maintain complete clarity and audit trails on shared assets.",
    actionThemeHinglish:
      "Kisi deep study, financial audit ya self-development practice me focused samay lagayein.",
    actionThemeEnglish:
      "Dedicate quiet, deep-work hours to comprehensive financial audits, research, or restorative inner practices.",
  },
  9: {
    house: 9,
    labelHinglish: "आपके उच्च दृष्टिकोण और गुरुओं के मार्गदर्शन का घर",
    labelEnglish: "Higher Wisdom, Mentorship & Ethical Direction",
    humanSummaryHinglish:
      "Bade drishtikon, higher learning aur seniors ke aashirwad ka samay hai. Naye sheher ya nayi field ke vishay me baat aage badh sakti hai.",
    humanSummaryEnglish:
      "An expansive window for higher perspective, mentor counsel, and long-term ethical alignment in your life path.",
    cautionThemeHinglish:
      "Rigid opinion ya aadarshwaad me aakar practical reality ko nazarandaaz na karein.",
    cautionThemeEnglish:
      "Avoid dogmatic rigidity or theoretical over-confidence; verify that ideals can be executed practically.",
    actionThemeHinglish:
      "Kisi senior advisor ya mentor se salah lein; unki ek baat aapka agla roadmap clear kar sakti hai.",
    actionThemeEnglish:
      "Seek the deliberate counsel of a trusted mentor; a brief conversation can unlock months of clarity.",
  },
  10: {
    house: 10,
    labelHinglish: "आपके करियर, अधिकार और सार्वजनिक प्रतिष्ठा का घर",
    labelEnglish: "Career, Executive Authority & Professional Karma",
    humanSummaryHinglish:
      "Workplace par aapke kaam ko notice kiya ja raha hai. Extra responsibility lene aur leadership prove karne ka yeh prime window hai.",
    humanSummaryEnglish:
      "Your professional stewardship and deliverables are under scrutiny. A prime window to demonstrate calm executive capability.",
    cautionThemeHinglish:
      "Workplace politics ya ego confrontations me na uljhein; sirf apne results aur delivery par focus rakhein.",
    cautionThemeEnglish:
      "Do not get drawn into office political friction or vanity clashes; let consistent measurable results speak.",
    actionThemeHinglish:
      "Senior management ke saamne apne recent accomplishments ko politely present karein aur lead project maangein.",
    actionThemeEnglish:
      "Formally articulate your project milestones to stakeholders and step forward to lead strategic assignments.",
  },
  11: {
    house: 11,
    labelHinglish: "आपकी महत्वाकांक्षाओं, कमाई और नेटवर्क का घर",
    labelEnglish: "Ambition, Liquid Gains & Strategic Network",
    humanSummaryHinglish:
      "Pichhle samay ki mehnat ka financial reward aur bade logon se sampark ka rasta khul raha hai. Sahi logon se judna faayda dega.",
    humanSummaryEnglish:
      "A strategic window for network expansion, collective collaboration, and harvesting momentum from past diligence.",
    cautionThemeHinglish:
      "Sirf dikhawe wale ya unverified logon ke sath bada partnership commitment na karein.",
    cautionThemeEnglish:
      "Avoid committing valuable time or capital to transactional acquaintances without verified track records.",
    actionThemeHinglish:
      "Purane high-trust dosto ya influential colleagues se connect karein aur pending commercial discussions aage badhayein.",
    actionThemeEnglish:
      "Reach out to trusted past colleagues and advance pending discussions regarding contracts or partnerships.",
  },
  12: {
    house: 12,
    labelHinglish: "विश्राम, आंतरिक शांति और व्यर्थ के बोझ से मुक्ति का घर",
    labelEnglish: "Rest, Solitude, Subconscious Peace & Closure",
    humanSummaryHinglish:
      "Duniya ke shor se thoda door hokar antarmann ko recharge karne ka samay hai. Jo cheez aapke kaam ki nahi rahi, use alvida kehna seekhein.",
    humanSummaryEnglish:
      "A regenerative phase encouraging psychological withdrawal, healthy solitude, and releasing legacy commitments.",
    cautionThemeHinglish:
      "Late-night screen time aur bina soche impulsive online shopping se bachein.",
    cautionThemeEnglish:
      "Minimize late-night digital consumption and avoid impulsive expenditures on transient distractions.",
    actionThemeHinglish:
      "Ek digital detox plan karein, dhyan me samay bitayein aur kisi zarooratmand ko silent daan karein.",
    actionThemeEnglish:
      "Implement a structured digital pause, meditate quietly, and offer quiet, unheralded charitable support.",
  },
};

export interface PlanetModifierContext {
  planet: TransitPlanet;
  humanToneHinglish: string;
  humanToneEnglish: string;
  mildIntensityHinglish: string;
  strongIntensityHinglish: string;
  mildIntensityEnglish: string;
  strongIntensityEnglish: string;
}

export const PLANET_MODIFIERS: Record<TransitPlanet, PlanetModifierContext> = {
  Saturn: {
    planet: "Saturn",
    humanToneHinglish: "anushasan, sabr aur thos reality-check",
    humanToneEnglish: "structural patience, grounded duty, and reality-testing",
    mildIntensityHinglish:
      "Aapko halka sa dhyan dilaya ja raha hai ki thoda thehrav rakhein aur purani neev ko pakka karein.",
    strongIntensityHinglish:
      "Yeh samay aapse saaf-saaf anushasan aur bina kisi shortcut ke zimmedari nibhane ki mang kar raha hai.",
    mildIntensityEnglish:
      "A gentle reminder to pause, reflect, and consolidate existing foundations before leaping forward.",
    strongIntensityEnglish:
      "Demands uncompromising structural discipline, systematic follow-through, and complete avoidance of shortcuts.",
  },
  Jupiter: {
    planet: "Jupiter",
    humanToneHinglish: "vistar, gyan, ethical clarity aur aashirwad",
    humanToneEnglish: "expansion, ethical clarity, mentor counsel, and grace",
    mildIntensityHinglish:
      "Ek halki si nayi aasha aur sikhne ka vatavaran ban raha hai jahan aapko sahi marg dikh sakta hai.",
    strongIntensityHinglish:
      "Aapke aage naye vistar aur badotari ke raste khul rahe hain; bas aalsya chhodkar active step lein.",
    mildIntensityEnglish:
      "Subtle intellectual optimism and reflective clarity illuminating the right ethical direction.",
    strongIntensityEnglish:
      "Opens expansive windows for professional growth, mentor backing, and strategic opportunities.",
  },
  Mars: {
    planet: "Mars",
    humanToneHinglish: "sahas, tezi, decisiveness aur physical drive",
    humanToneEnglish: "assertive momentum, decisive execution, and physical courage",
    mildIntensityHinglish:
      "Andar ek proactive energy mehsoos hogi jo aapko ruke hue kaam shuru karne ke liye prerit karegi.",
    strongIntensityHinglish:
      "Turant faisla lene aur aage badhkar lead karne ka pressure hoga; gusse aur jaldbazi se bachein.",
    mildIntensityEnglish:
      "A clean surge of proactive vitality prompting you to tackle lingering tasks with confidence.",
    strongIntensityEnglish:
      "Intense kinetic urgency compelling rapid decisions; channel fire into constructive work rather than friction.",
  },
  Rahu: {
    planet: "Rahu",
    humanToneHinglish: "unconventional soch, ambition aur digital reach",
    humanToneEnglish: "unorthodox ambition, digital velocity, and lateral expansion",
    mildIntensityHinglish:
      "Nayi aur hatkar cheezein aazmane ka mann karega jahan thoda research faayda dega.",
    strongIntensityHinglish:
      "Achanak badi ambition aur fast-track par aage badhne ki tivrata hogi; verification zaroor rakhein.",
    mildIntensityEnglish:
      "A curious impulse toward non-traditional pathways and modernized approaches requiring preliminary validation.",
    strongIntensityEnglish:
      "High-velocity ambition and unconventional breakthrough potential; anchor speculative projections in cold facts.",
  },
  Ketu: {
    planet: "Ketu",
    humanToneHinglish: "gehra shodh, minimalism aur unnecessary bojh se mukti",
    humanToneEnglish: "deep research, intuitive minimalism, and shedding superficial noise",
    mildIntensityHinglish:
      "Aapko dikhega ki kin cheezon par bematlab energy waste ho rahi thi, jisse chhodna aasan lagega.",
    strongIntensityHinglish:
      "Faltu koshishon aur fake commitments se achanak dhyan hatt kar seedha core truth par aayega.",
    mildIntensityEnglish:
      "Gentle intuitive discernment highlighting where energy was being scattered fruitlessly.",
    strongIntensityEnglish:
      "Decisive detachment from superficial distractions, driving unsparing focus toward essential priorities.",
  },
  Sun: {
    planet: "Sun",
    humanToneHinglish: "clarity, self-respect aur executive responsibility",
    humanToneEnglish: "executive clarity, dignified leadership, and self-respect",
    mildIntensityHinglish:
      "Apne maqsad aur value ko lekar mann me sthirta aur aadar ka ehsaas hoga.",
    strongIntensityHinglish:
      "Front foot par aakar faisla lene aur apni authority ko prove karne ka aawahan hoga.",
    mildIntensityEnglish:
      "A steady inner reassurance of your authentic direction and leadership values.",
    strongIntensityEnglish:
      "Calls for front-foot leadership, public accountability, and decisive command without personal ego.",
  },
  Venus: {
    planet: "Venus",
    humanToneHinglish: "harmony, diplomacy, aesthetic grace aur suvidha",
    humanToneEnglish: "relational diplomacy, aesthetic refinement, and graceful ease",
    mildIntensityHinglish:
      "Rishton me thoda suljhao aur sukhad vatavaran create karne ke mauke milenge.",
    strongIntensityHinglish:
      "Negotiations, branding aur creative alliances me aage badhne ka behtareen samay banega.",
    mildIntensityEnglish:
      "Gentle softening of relational friction, fostering relaxed dialogue and aesthetic appreciation.",
    strongIntensityEnglish:
      "Prime window for high-stakes diplomacy, artistic initiatives, and mutually respectful contracts.",
  },
  Mercury: {
    planet: "Mercury",
    humanToneHinglish: "analytical chaturata, communication aur commercial timing",
    humanToneEnglish: "commercial intellect, communication agility, and analytical timing",
    mildIntensityHinglish:
      "Data aur communications ko vyavasthit karke clarity paane ka aasan din rahega.",
    strongIntensityHinglish:
      "Negotiations, emails aur contracts me sharp intelligence se faayda uthane ka mauka milega.",
    mildIntensityEnglish:
      "Clean mental clarity facilitating systematic organization of data and daily correspondence.",
    strongIntensityEnglish:
      "Sharp commercial discernment enabling successful negotiations, clear messaging, and rapid closure.",
  },
  Moon: {
    planet: "Moon",
    humanToneHinglish: "mansik shaanti, intuitive sensing aur emotional rhythm",
    humanToneEnglish: "emotional poise, intuitive radar, and psychological rhythm",
    mildIntensityHinglish:
      "Mann me sthirta banegi aur rojana ke karyon me sahaj prabhav mehsoos hoga.",
    strongIntensityHinglish:
      "Bhavnaon aur gut-feeling ka asar tezi se badhega; shant rehkar sach ko pehchanein.",
    mildIntensityEnglish:
      "A serene, steady emotional climate that supports smooth, uncomplicated daily interaction.",
    strongIntensityEnglish:
      "Heightened emotional sensitivity and sharp gut instincts; pause to reflect before taking major public actions.",
  },
};
