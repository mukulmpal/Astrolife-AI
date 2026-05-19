import { computePlanets } from "./calculations";
import type { ChartData } from "./calculations";

const NAK27 = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

// ── Deep nakshatra knowledge base ─────────────────────────────
export const NAKSHATRA_KNOWLEDGE: Record<string, {
  lord: string; devata: string; nature: "Deva" | "Manava" | "Rakshasa";
  quality: string; body: string; domain: string; symbol: string; trait: string;
  healthNote: string;
}> = {
  Ashwini:            { lord:'Ketu',    devata:'Ashwini Kumaras', nature:'Deva',    quality:'Kshipra (Swift)',   body:'Head / knees',            domain:'Healing · speed · new beginnings',       symbol:'Horse head',         trait:'Pioneer energy — fast, healing, restless ambition',             healthNote:'Head and knee sensitivity. Swift recovery from illness.' },
  Bharani:            { lord:'Venus',   devata:'Yama',            nature:'Manava',  quality:'Ugra (Fierce)',    body:'Head / face',             domain:'Transformation · karma · extremes',      symbol:'Yoni',               trait:'Carries the weight of karma — extreme, creative, transformative', healthNote:'Intense digestive fire. Reproductive sensitivity.' },
  Krittika:           { lord:'Sun',     devata:'Agni',            nature:'Rakshasa',quality:'Tikshna (Sharp)',  body:'Eyes / face',             domain:'Will · purification · sharp action',     symbol:'Razor / flame',      trait:'Cuts through illusion with fire of purpose — sharp and precise', healthNote:'Eye sensitivity. Fever and inflammatory conditions.' },
  Rohini:             { lord:'Moon',    devata:'Brahma',          nature:'Manava',  quality:'Dhruva (Fixed)',   body:'Forehead / ankles',       domain:'Growth · beauty · fertility · desire',   symbol:'Ox cart / temple',   trait:'Most beloved — growth, beauty, deep emotional magnetic pull',    healthNote:'Throat and ankles. Fluid imbalance. Deeply nourishing constitution.' },
  Mrigashira:         { lord:'Mars',    devata:'Soma',            nature:'Deva',    quality:'Mridu (Soft)',     body:'Eyes / chin',             domain:'Seeking · travel · curiosity · love',    symbol:'Deer head',          trait:'The eternal seeker — restless, curious, always moving toward',   healthNote:'Nervous system sensitivity. Neck and shoulder.' },
  Ardra:              { lord:'Rahu',    devata:'Rudra',           nature:'Manava',  quality:'Tikshna (Sharp)', body:'Hair / back of head',     domain:'Storm · transformation · grief · renewal',symbol:'Teardrop / gem',    trait:'Fierce storm energy — emotional catharsis, breakthrough pain',   healthNote:'Respiratory sensitivity. Eye conditions. Storm-related.' },
  Punarvasu:          { lord:'Jupiter', devata:'Aditi',           nature:'Deva',    quality:'Chara (Movable)', body:'Nose / fingers',          domain:'Renewal · return · hope · restoration',  symbol:'Bow and quiver',     trait:'Return of the light — renewable energy, restored hope',          healthNote:'Ear and lung area. Generally good recovery power.' },
  Pushya:             { lord:'Saturn',  devata:'Brihaspati',      nature:'Deva',    quality:'Kshipra (Swift)', body:'Face / mouth',            domain:'Nourishment · dharma · protection · care',symbol:'Flower / circle',   trait:'Most auspicious nakshatra — divine nourishment, ultimate care',  healthNote:'Stomach and chest. Nourishment disorders if weak.' },
  Ashlesha:           { lord:'Mercury', devata:'Sarpa (Serpent)', nature:'Rakshasa',quality:'Tikshna (Sharp)', body:'Nape / joints',           domain:'Kundalini · hidden power · strategy',    symbol:'Serpent coiled',     trait:'Serpent wisdom — coiled power, deep psychological strategy',     healthNote:'Joint pain. Toxic accumulation. Nervous system.' },
  Magha:              { lord:'Ketu',    devata:'Pitru (Ancestors)',nature:'Rakshasa',quality:'Ugra (Fierce)',  body:'Lips / chin',             domain:'Ancestors · royalty · authority · pride', symbol:'Royal throne',       trait:'Royal ancestral power — dignity, pride, connection to lineage',  healthNote:'Heart. Back. Ancestral health patterns.' },
  'Purva Phalguni':   { lord:'Venus',   devata:'Bhaga',           nature:'Manava',  quality:'Ugra (Fierce)',  body:'Right hand',              domain:'Pleasure · luxury · rest · creativity',  symbol:'Front hammock',      trait:'Delight in existence — sensual creativity, rest and pleasure',   healthNote:'Reproductive and sexual health. Right arm.' },
  'Uttara Phalguni':  { lord:'Sun',     devata:'Aryama',          nature:'Manava',  quality:'Dhruva (Fixed)', body:'Left hand',               domain:'Contracts · unions · social order · duty',symbol:'Back hammock',      trait:'Sacred agreements — marriage, partnerships, social harmony',     healthNote:'Left arm. Digestive system. Steady constitution.' },
  Hasta:              { lord:'Moon',    devata:'Savitru',         nature:'Deva',    quality:'Kshipra (Swift)', body:'Hands / fingers',         domain:'Skill · craftsmanship · healing · dexterity',symbol:'Open hand',       trait:'The healing hand — skilled, precise, dexterous, practical',      healthNote:'Intestines and hands. Skin conditions. Digestive rhythm.' },
  Chitra:             { lord:'Mars',    devata:'Twashtri',        nature:'Rakshasa',quality:'Tikshna (Sharp)', body:'Forehead',                domain:'Creation · beauty · architecture · light', symbol:'Bright jewel',      trait:'Brilliant creative force — aesthetic mastery, architectural vision', healthNote:'Forehead and kidney area. Inflammatory conditions.' },
  Swati:             { lord:'Rahu',    devata:'Vayu',            nature:'Deva',    quality:'Chara (Movable)', body:'Chest / lungs',           domain:'Independence · trade · flexibility · wind',symbol:'Coral / sword',    trait:'The self-sufficient one — independent, flexible, trade-oriented', healthNote:'Chest and lungs. Vata aggravation. Wind-related.' },
  Vishakha:           { lord:'Jupiter', devata:'Indra-Agni',      nature:'Rakshasa',quality:'Sadharna (Mixed)',body:'Arms / chest',            domain:'Goal achievement · passion · determination',symbol:'Triumphal arch',   trait:'Determined achiever — single-pointed focus on success',          healthNote:'Lower abdomen. Hormonal. Adrenal intensity.' },
  Anuradha:           { lord:'Saturn',  devata:'Mitra',           nature:'Deva',    quality:'Mridu (Soft)',   body:'Stomach',                 domain:'Devotion · friendship · loyalty · occult', symbol:'Lotus flower',      trait:'Devoted friend — deep loyalty, occult wisdom, spiritual discipline', healthNote:'Stomach and heart. Longevity when disciplined.' },
  Jyeshtha:           { lord:'Mercury', devata:'Indra',           nature:'Rakshasa',quality:'Tikshna (Sharp)', body:'Tongue / right side',    domain:'Protection · seniority · power · courage', symbol:'Earring / umbrella',trait:'The eldest — protective power, seniority, guarding the sacred',  healthNote:'Reproductive right side. Throat and arms. Authority stress.' },
  Mula:               { lord:'Ketu',    devata:'Nirriti',         nature:'Rakshasa',quality:'Tikshna (Sharp)', body:'Feet',                   domain:'Root causes · endings · liberation · truth',symbol:'Bundle of roots',  trait:'Digs to the root — endings that become beginnings, liberation',  healthNote:'Feet and hips. Chronic conditions. Root-level health.' },
  'Purva Ashadha':    { lord:'Venus',   devata:'Apas (Water)',    nature:'Manava',  quality:'Ugra (Fierce)',  body:'Thighs',                  domain:'Invincibility · purification · renewal',  symbol:'Elephant tusk / fan',trait:'Invincible water energy — cleansing, declaring victory early',  healthNote:'Thighs and lungs. Water-borne risk. Renal sensitivity.' },
  'Uttara Ashadha':   { lord:'Sun',     devata:'Vishwadeva',      nature:'Manava',  quality:'Dhruva (Fixed)', body:'Thighs / waist',          domain:'Permanent victory · dharma · universal law',symbol:'Elephant tusk',   trait:'Universal victory — permanent achievements, dharmic authority',  healthNote:'Thighs and waist. Bone and spine structure.' },
  Shravana:           { lord:'Moon',    devata:'Vishnu',          nature:'Deva',    quality:'Chara (Movable)',body:'Ears / knees',            domain:'Learning · listening · Vishnu energy · travel',symbol:'Ear / footprints',trait:'The sacred listener — connected to universal wisdom, Vishnu grace', healthNote:'Ears and knees. Vata. Hearing sensitivity.' },
  Dhanishtha:         { lord:'Mars',    devata:'Ashta Vasus',     nature:'Rakshasa',quality:'Chara (Movable)',body:'Back / lower body',       domain:'Wealth · music · abundance · mars energy', symbol:'Drum / flute',     trait:'Rhythm of abundance — musical, wealth-oriented, martial energy', healthNote:'Back and ankles. Varicose. Circulatory.' },
  Shatabhisha:        { lord:'Rahu',    devata:'Varuna',          nature:'Rakshasa',quality:'Chara (Movable)',body:'Calves / ankles',         domain:'Healing · mystery · cosmic law · secrets', symbol:'100 stars / circle',trait:'100 healers — the great physician, mystery, vast cosmic law',    healthNote:'Calves and circulation. Mysterious ailments. Healing gift.' },
  'Purva Bhadrapada': { lord:'Jupiter', devata:'Aja Ekapada',     nature:'Manava',  quality:'Ugra (Fierce)',  body:'Right side / thighs',    domain:'Transformation · fiery ascent · austerity', symbol:'Sword / two-faced man',trait:'The burning ground — fierce spiritual transformation, austerity', healthNote:'Right thigh. Cardiac. Intense transformative health events.' },
  'Uttara Bhadrapada':{ lord:'Saturn',  devata:'Ahir Budhnya',    nature:'Manava',  quality:'Dhruva (Fixed)', body:'Legs / ankles',           domain:'Depth · endurance · serpent wisdom · moksha',symbol:'Twin snakes',    trait:'Deep wisdom of the depths — compassionate, enduring, liberated', healthNote:'Legs and ankles. Chronic conditions. Psychosomatic.' },
  Revati:             { lord:'Mercury', devata:'Pusha',           nature:'Deva',    quality:'Mridu (Soft)',   body:'Feet / ankles',           domain:'Completion · safe journeys · nourishment',  symbol:'Fish / drum',      trait:'The nourishing shepherd — safe completion, protecting travelers', healthNote:'Feet and lymph. Immune system. Spiritual-health link.' },
};

// ── Planet vedha interpretation ────────────────────────────────
export const VEDHA_PLANET_INTERP: Record<string, {
  nature: "malefic" | "benefic" | "neutral";
  janmaVedha: { area: string; prediction: string; caution: string; remedy: string };
  sensitiveVedha: { area: string; prediction: string; caution: string; remedy: string };
  duration: string;
  intensityNote: string;
}> = {
  Sun: {
    nature: "neutral",
    janmaVedha: {
      area: "Authority · Ego · Father · Government · Career Recognition",
      prediction: "Authority figures or institutions challenge you. Government or bureaucratic matters surface. Father's health or ego-driven disputes arise. Your identity, direction and position feel tested. Energy and vitality may dip. It is a time to be humble, not assertive.",
      caution: "Avoid confrontations with superiors. Do not initiate major career moves or ego battles. Stay low-profile in official matters.",
      remedy: "Offer water to the Sun at sunrise chanting Surya beej mantra. Recite Aditya Hridayam daily. Donate wheat, jaggery or copper on Sunday. Wear ruby or orange only after proper consultation.",
    },
    sensitiveVedha: {
      area: "Confidence · Vitality · Recognition",
      prediction: "Minor ego irritations or authority friction. Slight energy drop. Watch for overconfidence in daily dealings. Some vitality fluctuation is natural.",
      caution: "Stay grounded. Don't overextend. Rest when the body signals.",
      remedy: "Sunday Sun salutation. Small offering of water at sunrise.",
    },
    duration: "~10–13 days — Sun transits one nakshatra every 13 days.",
    intensityNote: "Sun vedha peaks on Sundays and during solar noon hours.",
  },
  Moon: {
    nature: "neutral",
    janmaVedha: {
      area: "Mind · Emotions · Mother · Home · Sleep · Mental Health",
      prediction: "Emotional turbulence reaches its peak. Mind becomes unstable, overthinking and anxiety are likely. Mother's health or home situations demand attention. Public-facing situations feel emotionally charged. Sleep disruption and psychosomatic complaints are common during this period. Be especially protective of your mental peace.",
      caution: "Avoid major decisions during this phase — the mind is not reliable. Limit social media exposure. Do not suppress feelings.",
      remedy: "Monday fast. Offer milk to Shiva linga. Chant Chandra beej mantra (OM SHRAM SHRIM SHRAUM SAH CHANDRAYA NAMAH). Wear white, eat light food, sleep before 10 PM.",
    },
    sensitiveVedha: {
      area: "Mood · Intuition · Relationships",
      prediction: "Emotional sensitivity heightened. Excellent for intuitive and creative work. Minor mood fluctuations are natural and pass quickly.",
      caution: "Don't suppress emotions. Let feelings move through you.",
      remedy: "Moon meditation. Wear silver. Drink warm milk before bed.",
    },
    duration: "~1–2 days — Moon is the fastest planet, transiting one nakshatra per day.",
    intensityNote: "Moon vedha is most powerful during full moon and new moon nights.",
  },
  Mars: {
    nature: "malefic",
    janmaVedha: {
      area: "Accidents · Conflicts · Siblings · Property · Physical Injury",
      prediction: "This is a high-risk period for accidents and aggressive confrontations. Impulsive decisions are amplified. Disputes with brothers, siblings or business partners flare up. Property and legal clashes are possible. Physical injury, especially from sharp objects or vehicles, requires caution. Fever, blood pressure or inflammatory conditions may intensify. The Mars energy is neither good nor bad — it depends entirely on how you channel it.",
      caution: "Avoid sharp tools, reckless driving, unnecessary arguments. Do not start new fights or legal battles. Channel the energy into constructive physical activity.",
      remedy: "Tuesday Hanuman Chalisa recitation daily. Fast on Tuesdays. Donate red lentils (masoor dal) on Tuesday. Chant Mars beej mantra (OM KRAM KRIM KRAUM SAH BHUMAYE NAMAH). Avoid non-vegetarian food on Tuesdays.",
    },
    sensitiveVedha: {
      area: "Drive · Energy · Minor Conflicts",
      prediction: "Increased energy and impatience. Minor conflicts possible. Ambition and drive surge — useful if directed into structured activity.",
      caution: "Channel energy constructively. Avoid impulsive physical actions.",
      remedy: "Physical exercise. Hanuman worship on Tuesday.",
    },
    duration: "~10–14 days — Mars transits one nakshatra in about 12 days.",
    intensityNote: "Mars vedha peaks on Tuesdays and during Mars hour (2nd and 9th hours from sunrise).",
  },
  Mercury: {
    nature: "neutral",
    janmaVedha: {
      area: "Communication · Business · Documents · Travel · Intelligence",
      prediction: "Communication breakdowns create confusion. Business deals face obstacles or require re-examination. Travel plans get disrupted or complicated. Mental fog and nervous anxiety increase. Documents, agreements and contracts may have errors that need correction. Do not make hasty verbal or written commitments during this period.",
      caution: "Double-check all communications and documents. Avoid signing important contracts. Verify all information before acting on it.",
      remedy: "Wednesday fast. Donate green items (moong dal, green fabric) on Wednesday. Recite Vishnu Sahasranama. Chant Mercury beej mantra (OM BRAM BRIM BRAUM SAH BUDHAYA NAMAH).",
    },
    sensitiveVedha: {
      area: "Clarity · Trade · Short Travel",
      prediction: "Minor communication mix-ups. Good for learning and short journeys. Mental agility heightened — excellent for study and analysis.",
      caution: "Listen carefully. Verify details in transactions.",
      remedy: "Wednesday prayer. Green mung dal offering.",
    },
    duration: "~7–10 days — Mercury is variable and may slow during retrograde.",
    intensityNote: "Mercury vedha intensifies during Mercury retrograde periods.",
  },
  Jupiter: {
    nature: "benefic",
    janmaVedha: {
      area: "Wisdom · Dharma · Children · Wealth · Guru · Spiritual Growth",
      prediction: "HIGHLY AUSPICIOUS PERIOD. This is one of the most powerful positive transits in Vedic astrology. Major opportunities for growth, wealth, and wisdom open. Guru or teacher connections become transformative. Children-related positive events manifest. Career expansion and knowledge gains are strongly supported. Spiritual insights are amplified. This is a window to start new ventures, seek blessings, and take bold dharmic action.",
      caution: "Use this divine grace wisely. Do not over-expand or become arrogant. Remain humble and grateful.",
      remedy: "Express deep gratitude. Thursday fast for maximum blessings. Donate to teachers, Brahmins or educational causes. Offer yellow flowers to Jupiter. Wear yellow sapphire only after proper astrological consultation.",
    },
    sensitiveVedha: {
      area: "Opportunity · Learning · Subtle Grace",
      prediction: "Divine grace flowing gently. Positive insights and small blessings. Good time for spiritual and educational pursuits. Doors open that were previously closed.",
      caution: "Stay humble. Acknowledge every blessing, however small.",
      remedy: "Thursday gratitude prayer. Yellow flower offering.",
    },
    duration: "~40–45 days — Jupiter moves very slowly through each nakshatra.",
    intensityNote: "Jupiter vedha is most potent on Thursdays and during Pushya nakshatra transits.",
  },
  Venus: {
    nature: "benefic",
    janmaVedha: {
      area: "Love · Marriage · Luxury · Art · Body · Pleasure · Harmony",
      prediction: "Relationship matters come powerfully into focus. Marriage, partnership events or romantic experiences are activated. Pleasures, luxuries and aesthetic experiences attract. Creative and artistic energies flow strongly. Body and beauty consciousness heightens. Financial gains through art, beauty or relationships are possible. This is a generally positive period for social and romantic life.",
      caution: "Do not over-indulge. Relationship clarity is needed — avoid possessiveness or attachment.",
      remedy: "Friday fast. Offer white flowers and rice to Goddess Lakshmi. Venus mantra chanting (OM DRAM DRIM DRAUM SAH SHUKRAYA NAMAH). Donate white items on Friday.",
    },
    sensitiveVedha: {
      area: "Harmony · Beauty · Comfort",
      prediction: "Aesthetic pleasures heightened. Social events likely. Minor positive relationship developments. Creative inspiration flows.",
      caution: "Balance enjoyment with responsibility.",
      remedy: "Friday Lakshmi prayer.",
    },
    duration: "~10–14 days — Venus varies depending on proximity to the Sun.",
    intensityNote: "Venus vedha is most potent on Fridays, especially at dawn (Venus hour).",
  },
  Saturn: {
    nature: "malefic",
    janmaVedha: {
      area: "Karma · Discipline · Delays · Chronic Health · Longevity · Isolation",
      prediction: "This is a serious karmic period that demands patience and discipline. Major delays manifest in all pending work — especially career, official matters and relationships. Health of chronic or old issues may surface. You may feel isolated, burdened or restricted. Responsibilities increase and patience is severely tested. However, this is also a time of deep karmic clearing — what is released now does not return. Work steadily, accept limitations, and avoid cutting corners on your duties.",
      caution: "Do not rush or try to force outcomes. Accept delays with grace. Avoid shortcuts on responsibilities. Health check-up recommended — especially chronic issues.",
      remedy: "Saturday fast. Donate mustard oil to Shani temple. Recite Shani Stotra or Shani Chalisa. Feed crows and the poor on Saturday. Wear dark blue or black. Offer water to Shami tree.",
    },
    sensitiveVedha: {
      area: "Patience · Structure · Karma",
      prediction: "Slowdowns in plans. Patience is needed. Good for structured, disciplined and sustained work. Karmic patterns become visible.",
      caution: "Work steadily. Do not take shortcuts.",
      remedy: "Saturday offering. Black sesame (til) charity.",
    },
    duration: "~40–50 days — Saturn is the slowest traditional planet.",
    intensityNote: "Saturn vedha is most intense during Sade Sati or Dhaiya periods. Its effects linger long after the transit.",
  },
  Rahu: {
    nature: "malefic",
    janmaVedha: {
      area: "Illusion · Foreign Connections · Sudden Events · Obsession · Technology",
      prediction: "Destabilizing and unpredictable energy. Unexpected upheavals, illusions and confusion arise with little warning. Foreign connections or unusual circumstances enter your life. Obsessive thoughts and addictive behavioral patterns may peak. Sudden changes in plans, relationships or circumstances are likely. This is a period to stay grounded and avoid acting on impulse or under illusion.",
      caution: "Ground yourself with daily spiritual practice. Avoid new obsessions. Do not trust everything at face value. Protect against sudden decisions made under excitement or fear.",
      remedy: "Rahu beej mantra chanting (OM BHRAAM BHREEM BHRAUM SAH RAHAVE NAMAH). Donate to people with disabilities or social outcasts. Feed fish in a river. Blue or black items charity on Saturday. Meditation to ground the mind.",
    },
    sensitiveVedha: {
      area: "Surprise · Unconventional Events",
      prediction: "Unusual circumstances arise. May feel scattered or confused at times. Foreign, unconventional or unexpected energy enters briefly.",
      caution: "Stay grounded in your values and routine.",
      remedy: "Rahu mantra. Grounding meditation.",
    },
    duration: "~45–60 days — Rahu moves very slowly (18 months per sign, ~40 days per nakshatra).",
    intensityNote: "Rahu vedha is most disorienting during solar and lunar eclipses near janma nakshatra.",
  },
  Ketu: {
    nature: "malefic",
    janmaVedha: {
      area: "Past Karma · Spirituality · Losses · Detachment · Liberation",
      prediction: "Past karmic patterns surface strongly and demand resolution. Losses, separations or endings in worldly matters are likely — these are karmic completions, not random misfortunes. Spiritual pull intensifies dramatically. Dreams, visions and intuition are heightened. Detachment from material concerns is both natural and healthy now. In rare cases this activates a Moksha yoga period — profound spiritual breakthrough through apparent worldly loss.",
      caution: "Accept endings gracefully — do not cling to what must go. Spiritual practices become extraordinarily potent during this period. Do not make purely material decisions.",
      remedy: "Ketu beej mantra (OM SHRAM SHRIM SHRAUM SAH KETAVE NAMAH). Ganesha puja for obstacle removal. Donate blankets or coarse items. Fast on Tuesday. Spiritual retreat or silent meditation is highly beneficial.",
    },
    sensitiveVedha: {
      area: "Detachment · Spiritual Insight",
      prediction: "Spiritual sensitivity elevated. Minor losses or graceful letting-go moments. Past memories surface to be processed.",
      caution: "Let go gracefully. Don't suppress the spiritual pull.",
      remedy: "Meditation. Ketu beej mantra. Ganesha worship.",
    },
    duration: "~45–60 days — Ketu co-moves with Rahu.",
    intensityNote: "Ketu vedha intensifies during eclipses and on spiritual days like Ekadashi.",
  },
};

// ── Sensitive zone Vedic names ────────────────────────────────
export const SENSITIVE_ZONE_NAMES: Record<number, { vedName: string; desc: string; intensity: "EXTREME" | "HIGH" | "MEDIUM" }> = {
  0:  { vedName: "Janma",    desc: "Your exact birth nakshatra — the most sensitive point in the entire chart. Any planet here creates the strongest possible influence on your life.",        intensity: "EXTREME" },
  1:  { vedName: "Sampat",   desc: "1 nakshatra ahead (wealth zone) — transits here activate finances, resources and material prosperity themes.",                                             intensity: "HIGH" },
  2:  { vedName: "Vipat",    desc: "2 nakshatras ahead (danger zone) — transits here can bring obstacles, danger and difficulties in ongoing work.",                                          intensity: "HIGH" },
  3:  { vedName: "Kshema",   desc: "3 nakshatras ahead (wellbeing zone) — transits here generally support health, peace and domestic wellbeing.",                                             intensity: "MEDIUM" },
  4:  { vedName: "Pratyak",  desc: "4 nakshatras ahead (obstruction zone) — transits here create blockages, reversals and frustrating delays.",                                              intensity: "HIGH" },
  5:  { vedName: "Sadhana",  desc: "5 nakshatras ahead (accomplishment zone) — transits here support effort, achievement and career advancement.",                                           intensity: "MEDIUM" },
  6:  { vedName: "Naidhana", desc: "6 nakshatras ahead (death zone) — the most inauspicious sensitive position. Malefic transits here require serious remedies and caution.",               intensity: "HIGH" },
  7:  { vedName: "Mitra",    desc: "7 nakshatras ahead (friend zone) — transits here bring helpful people, allies, social support and pleasant interactions.",                               intensity: "MEDIUM" },
  8:  { vedName: "Parama Mitra", desc: "8 nakshatras ahead (best friend zone) — highly auspicious. Benefic transits here bring excellent help, grace and profound support.",               intensity: "MEDIUM" },
};

// ── Types ─────────────────────────────────────────────────────
export interface SvbRow {
  index: number;
  name: number;
  nakName: string;
  type: "janma" | "vedha" | "normal";
  natalPlanets: string[];
  transitPlanets: string[];
  isActive: boolean;
  distanceFromJanma: number;
  vedZoneName?: string;
  vedZoneDesc?: string;
  vedZoneIntensity?: "EXTREME" | "HIGH" | "MEDIUM";
}

export interface SvbAlert {
  planet: string;
  nakshatra: string;
  type: "janma_vedha" | "sensitive_vedha";
  severity: "high" | "medium";
  description: string;
  distanceFromJanma: number;
  zoneName: string;
  zoneDesc: string;
  vedhaInterp: {
    area: string;
    prediction: string;
    caution: string;
    remedy: string;
    duration: string;
    intensityNote: string;
  };
  planetNature: "malefic" | "benefic" | "neutral";
}

export interface NatalInSensitive {
  planet: string;
  nakshatra: string;
  distanceFromJanma: number;
  zoneName: string;
  zoneDesc: string;
  meaning: string;
}

export interface SarvatobhadraResult {
  birthNakshatra: string;
  birthNakshatraIndex: number;
  birthNakshatraData: typeof NAKSHATRA_KNOWLEDGE[string] | null;
  rows: SvbRow[];
  vedhaAlerts: SvbAlert[];
  sensitiveIndices: Set<number>;
  janmaIndex: number;
  transitDate: Date;
  natalInSensitive: NatalInSensitive[];
  currentPeriodAssessment: "Auspicious" | "Mixed" | "Challenging" | "Severe";
  currentPeriodReason: string;
  beneficVedhaCount: number;
  maleficVedhaCount: number;
}

export function calculateSarvatobhadra(chart: ChartData): SarvatobhadraResult {
  const moonLon = chart.planets.Moon?.lon || 0;
  const janmaIndex = Math.floor(((moonLon % 360) + 360) % 360 * 27 / 360);
  const birthNakshatra = NAK27[janmaIndex];
  const birthNakshatraData = NAKSHATRA_KNOWLEDGE[birthNakshatra] || null;

  const sensitiveIndices = new Set<number>();
  sensitiveIndices.add(janmaIndex);
  [1, 3, 5, 7].forEach(d => {
    sensitiveIndices.add((janmaIndex + d) % 27);
    sensitiveIndices.add((janmaIndex - d + 270) % 27);
  });

  // All 9 sensitive distances forward
  const sensitiveDistances = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const sensitiveSet = new Set<number>();
  sensitiveDistances.forEach(d => sensitiveSet.add((janmaIndex + d) % 27));
  // and the ±1,3,5,7 set (bidirectional)
  [1, 3, 5, 7].forEach(d => {
    sensitiveSet.add((janmaIndex + d) % 27);
    sensitiveSet.add((janmaIndex - d + 270) % 27);
  });

  const natalPlanets: Record<number, string[]> = {};
  const PLANETS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  PLANETS.forEach(p => {
    const pd = chart.planets[p];
    if (pd) {
      const nakIdx = Math.floor(((pd.lon % 360) + 360) % 360 * 27 / 360);
      natalPlanets[nakIdx] = (natalPlanets[nakIdx] || []).concat(p);
    }
  });

  const now = new Date();
  const jd = now.getTime() / 86400000 + 2440587.5;
  const transitLons = computePlanets(jd);
  const transitPlanets: Record<number, string[]> = {};
  PLANETS.forEach(p => {
    const lon = transitLons[p];
    if (lon === undefined || lon === null) return;
    const nakIdx = Math.floor(((lon % 360) + 360) % 360 * 27 / 360);
    transitPlanets[nakIdx] = (transitPlanets[nakIdx] || []).concat(p);
  });

  function getDistanceFromJanma(idx: number): number {
    return (idx - janmaIndex + 27) % 27;
  }

  function getZoneInfo(idx: number): { zoneName: string; zoneDesc: string; zoneIntensity: "EXTREME" | "HIGH" | "MEDIUM" } {
    const fwd = getDistanceFromJanma(idx);
    const bwd = (janmaIndex - idx + 27) % 27;
    const dist = Math.min(fwd, bwd) <= 8 ? fwd : 99;
    const zone = SENSITIVE_ZONE_NAMES[dist];
    return zone
      ? { zoneName: zone.vedName, zoneDesc: zone.desc, zoneIntensity: zone.intensity }
      : { zoneName: "Sensitive", zoneDesc: "Sensitive nakshatra zone.", zoneIntensity: "MEDIUM" };
  }

  const rows: SvbRow[] = NAK27.map((nakName, i) => {
    const type = i === janmaIndex ? 'janma' : sensitiveIndices.has(i) ? 'vedha' : 'normal';
    const dist = getDistanceFromJanma(i);
    const zoneData = sensitiveIndices.has(i) || i === janmaIndex ? getZoneInfo(i) : null;
    return {
      index: i,
      name: i,
      nakName,
      type,
      natalPlanets: natalPlanets[i] || [],
      transitPlanets: transitPlanets[i] || [],
      isActive: !!(natalPlanets[i] || transitPlanets[i] || i === janmaIndex),
      distanceFromJanma: dist,
      vedZoneName: zoneData?.zoneName,
      vedZoneDesc: zoneData?.zoneDesc,
      vedZoneIntensity: zoneData?.zoneIntensity,
    };
  });

  // Vedha alerts
  const vedhaAlerts: SvbAlert[] = [];
  Object.entries(transitPlanets).forEach(([idx, planets]) => {
    const i = parseInt(idx);
    if (sensitiveIndices.has(i)) {
      planets.forEach(p => {
        const interp = VEDHA_PLANET_INTERP[p];
        const isJanma = i === janmaIndex;
        const zone = getZoneInfo(i);
        const vedhaInterp = isJanma
          ? { area: interp?.janmaVedha.area || '', prediction: interp?.janmaVedha.prediction || '', caution: interp?.janmaVedha.caution || '', remedy: interp?.janmaVedha.remedy || '', duration: interp?.duration || '', intensityNote: interp?.intensityNote || '' }
          : { area: interp?.sensitiveVedha.area || '', prediction: interp?.sensitiveVedha.prediction || '', caution: interp?.sensitiveVedha.caution || '', remedy: interp?.sensitiveVedha.remedy || '', duration: interp?.duration || '', intensityNote: interp?.intensityNote || '' };
        vedhaAlerts.push({
          planet: p,
          nakshatra: NAK27[i],
          type: isJanma ? 'janma_vedha' : 'sensitive_vedha',
          severity: isJanma ? 'high' : 'medium',
          description: interp?.janmaVedha.area || 'Cosmic influence',
          distanceFromJanma: getDistanceFromJanma(i),
          zoneName: zone.zoneName,
          zoneDesc: zone.zoneDesc,
          vedhaInterp,
          planetNature: interp?.nature || 'neutral',
        });
      });
    }
  });

  // Natal planets in sensitive zones
  const natalInSensitive: NatalInSensitive[] = [];
  PLANETS.forEach(p => {
    const pd = chart.planets[p];
    if (!pd) return;
    const nakIdx = Math.floor(((pd.lon % 360) + 360) % 360 * 27 / 360);
    if (sensitiveIndices.has(nakIdx) && nakIdx !== janmaIndex) {
      const zone = getZoneInfo(nakIdx);
      const interp = VEDHA_PLANET_INTERP[p];
      natalInSensitive.push({
        planet: p,
        nakshatra: NAK27[nakIdx],
        distanceFromJanma: getDistanceFromJanma(nakIdx),
        zoneName: zone.zoneName,
        zoneDesc: zone.zoneDesc,
        meaning: interp
          ? `${p} permanently occupies your ${zone.zoneName} zone — ${interp.sensitiveVedha.area}. ${interp.sensitiveVedha.prediction}`
          : `${p} permanently activates the ${zone.zoneName} zone in your natal chart.`,
      });
    }
  });

  // Current period assessment
  const beneficVedhaCount = vedhaAlerts.filter(a => a.planetNature === 'benefic').length;
  const maleficVedhaCount = vedhaAlerts.filter(a => a.planetNature === 'malefic').length;
  const hasJanmaVedha = vedhaAlerts.some(a => a.type === 'janma_vedha');
  const hasSaturnOrRahuJanma = vedhaAlerts.some(a => a.type === 'janma_vedha' && ['Saturn','Rahu','Mars'].includes(a.planet));

  let currentPeriodAssessment: SarvatobhadraResult["currentPeriodAssessment"];
  let currentPeriodReason: string;

  if (hasSaturnOrRahuJanma) {
    currentPeriodAssessment = "Severe";
    currentPeriodReason = `${vedhaAlerts.filter(a => a.type === 'janma_vedha' && ['Saturn','Rahu','Mars'].includes(a.planet)).map(a=>a.planet).join('+')} is directly on your janma nakshatra. This is a critical karmic period requiring remedies, patience and spiritual discipline.`;
  } else if (hasJanmaVedha && maleficVedhaCount > 0) {
    currentPeriodAssessment = "Challenging";
    currentPeriodReason = `Active vedha on janma nakshatra with ${maleficVedhaCount} malefic planet${maleficVedhaCount>1?'s':''} in sensitive zones. Proceed with caution and remedies.`;
  } else if (beneficVedhaCount > 0 && maleficVedhaCount === 0) {
    currentPeriodAssessment = "Auspicious";
    currentPeriodReason = `${beneficVedhaCount} benefic planet${beneficVedhaCount>1?'s':''} (${vedhaAlerts.filter(a=>a.planetNature==='benefic').map(a=>a.planet).join(', ')}) in sensitive zones. This period carries grace, opportunity and positive activation.`;
  } else if (vedhaAlerts.length === 0) {
    currentPeriodAssessment = "Auspicious";
    currentPeriodReason = "No active vedha today — all transit planets are in neutral positions. A stable, undisturbed period for steady progress.";
  } else {
    currentPeriodAssessment = "Mixed";
    currentPeriodReason = `${maleficVedhaCount} malefic and ${beneficVedhaCount} benefic planets in sensitive zones. Navigate carefully while taking advantage of positive influences.`;
  }

  return {
    birthNakshatra, birthNakshatraIndex: janmaIndex, birthNakshatraData,
    rows, vedhaAlerts, sensitiveIndices, janmaIndex, transitDate: now,
    natalInSensitive, currentPeriodAssessment, currentPeriodReason,
    beneficVedhaCount, maleficVedhaCount,
  };
}
