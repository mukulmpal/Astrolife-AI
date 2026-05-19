import type { ChartData } from "./calculations";

// ── Nakshatra disease book (Dr. S. Krishna Kumar, pg 28-30) ────────────
export const NAKSHATRA_DISEASE_BOOK: Record<string, { disease: string; body: string; note: string }> = {
  Ashwini:            { disease: 'Periodical fever',                             body: 'Head',              note: 'Speed+fire — high metabolism, fever tendency' },
  Bharani:            { disease: 'Dysentery / digestive infections',             body: 'Head/face',         note: 'Yama ruled — elimination disorders' },
  Krittika:           { disease: 'Intestinal disease — constipation & diarrhoea', body: 'Face/neck',         note: 'Agni ruled — digestive fire imbalance' },
  Rohini:             { disease: 'Piles / ano-rectal disorders',                 body: 'Face/neck',         note: 'Fertility+earth — digestive heaviness' },
  Mrigashira:         { disease: 'Indigestion',                                  body: 'Neck/shoulders',    note: 'Moon ruled — irregular digestive rhythm' },
  Ardra:              { disease: 'Mandagni — weak digestion',                    body: 'Arms/shoulders',    note: 'Rudra ruled — storm energy disrupts digestion' },
  Punarvasu:          { disease: 'Cholera',                                      body: 'Arms/chest',        note: 'Aditi ruled — water-borne illness tendency' },
  Pushya:             { disease: 'Tastelessness / Anorexia',                     body: 'Face/mouth',        note: 'Brihaspati ruled — appetite disorders' },
  Ashlesha:           { disease: 'Anemia',                                       body: 'Ears/nape',         note: 'Sarpa ruled — toxic blood, venom-like weakness' },
  Magha:              { disease: 'Respiratory disease / breathing problems',     body: 'Chin/upper back',   note: 'Pitru ruled — ancestral respiratory pattern' },
  'Purva Phalguni':   { disease: 'Cough — dry or wet',                          body: 'Right hand',        note: 'Surya ruled — pitta-driven chest issues' },
  'Uttara Phalguni':  { disease: 'Leprosy / skin disease',                       body: 'Left hand/fingers', note: 'Aryama ruled — skin boundary issues' },
  Hasta:              { disease: 'Diabetes of various types',                    body: 'Fingers/hands',     note: 'Savitru ruled — sugar processing weakness' },
  Chitra:             { disease: 'Giddiness / partial loss of consciousness',    body: 'Neck/forehead',     note: 'Twashtru ruled — neural/vestibular issues' },
  Swati:              { disease: 'Eye diseases',                                 body: 'Chest',             note: 'Vayu ruled — air imbalance affecting vision' },
  Vishakha:           { disease: 'Ear diseases',                                 body: 'Lungs/chest',       note: 'Indra ruled — hearing sensitivity' },
  Anuradha:           { disease: 'Nasal disease / sinusitis',                    body: 'Stomach',           note: 'Mitra ruled — nasal passage sensitivity' },
  Jyeshtha:           { disease: 'Mouth disease — teeth, tongue, gums, throat', body: 'Right stomach',     note: 'Moon ruled — oral cavity disorders' },
  Mula:               { disease: 'Tuberculosis of any type',                     body: 'Left stomach/thighs', note: 'Rakshasa ruled — degenerative root destruction' },
  'Purva Ashadha':    { disease: 'Urinary stones / kidney stones',              body: 'Back/hips',         note: 'Jala Devata ruled — water-mineral imbalance' },
  'Uttara Ashadha':   { disease: 'Vomiting disorders',                           body: 'Waist/back',        note: 'Vishwa Devathas — digestive reversal tendency' },
  Shravana:           { disease: 'Tastelessness disease (Agnimandya)',           body: 'Upper genitals/knees', note: 'Vishnu ruled — assimilation weakness' },
  Dhanishtha:         { disease: 'Vata disorders — sprains, rheumatism, joint pain', body: 'Genitals/ankles', note: 'Ashta Vasu — wind-dominated pain' },
  Shatabhisha:        { disease: 'Bilious diseases (Pitta disorders)',           body: 'Right thigh/calves', note: 'Varuna ruled — liver-bile imbalance' },
  'Purva Bhadrapada': { disease: 'Phlegmatic diseases (Kapha disorders)',        body: 'Right thigh/feet',  note: 'Jala ruled — mucus, congestion, fluid' },
  'Uttara Bhadrapada':{ disease: 'Diseases from fatigue / exhaustion',           body: 'Ankle/feet',        note: 'Brahma ruled — depletion from overwork' },
  Revati:             { disease: 'Diseases from boils and wounds',               body: 'Feet',              note: 'Poosha ruled — skin eruptions, festering wounds' },
};

// ── Planet × House disease mapping ────────────────────────────────────
export const PLANET_HOUSE_DISEASE: Record<string, Record<number, string>> = {
  Sun: {
    1:'Head injury risk, fever, high BP. Authoritative personality. Eye fatigue.',
    2:'Right eye sensitivity, dental issues, throat inflammation. Family stress → fever.',
    3:'Shoulder/arm trouble, upper respiratory. Short travel fatigue.',
    4:'Heart stress, chest inflammation. Mother\'s health linked.',
    5:'Stomach heat, acid reflux, abdominal pitta.',
    6:'Bilious fever, digestive fire disorders. Surgery risk in dasha.',
    7:'Right eye affliction (book rule). Relationship stress → BP.',
    8:'Chronic fever, vitality depletion. Sudden health events.',
    9:'Hip/thigh region. Liver sensitivity. Father\'s health mirror.',
    10:'Knee stress from work pressure. Authority-driven health strain.',
    11:'Left eye sensitivity, leg circulation. Income anxiety → health.',
    12:'Eye disease (12th Sun rule — book). Sleep disorder, vitality loss.',
  },
  Moon: {
    1:'Mental sensitivity, fluid imbalance, weight fluctuation. Psychosomatic tendency.',
    2:'Face/mouth issues, dental sensitivity. Emotional eating.',
    3:'Lung sensitivity, cold-cough tendency. Sibling stress.',
    4:'Chest/breast sensitivity. Heart-emotion link. Home comfort essential.',
    5:'Stomach sensitivity, nausea. Emotional digestion weak.',
    6:'Nasal disease (book rule — Moon H6 → peenasa roga). Mental stress.',
    7:'Urinary issues, reproductive sensitivity. Relationship → health.',
    8:'Menstrual irregularity, fluid disorders. Hidden emotional illness.',
    9:'Hip/thigh sensitivity. Fortune-related anxiety affects health.',
    10:'Skin issues from public exposure. Career stress → hormonal.',
    11:'Left ear sensitivity, leg fluid. Social anxiety.',
    12:'Left eye weakness (book). Sleep disorder, mental fatigue, isolation.',
  },
  Mars: {
    1:'Head injury, fever, high BP. Accident prone. Forehead marks.',
    2:'Mouth ulcers, spicy food craving, family arguments. Dental inflammation.',
    3:'Shoulder injury, nerve irritation, sibling conflict risk.',
    4:'Chest inflammation, heart stress, home accidents.',
    5:'Stomach heat, acid reflux, abdominal inflammation.',
    6:'Infection, surgery risk, accidents. Mars H6 = strongest (vijay) position.',
    7:'Emotional disease/BP (book rule). Relationship aggression. Sexual inflammation.',
    8:'Accident, surgery, blood disorder. High surgery risk.',
    9:'Hip injury, sciatica, fall risk.',
    10:'Knee injury, work stress accidents, authority conflict.',
    11:'Leg injury, blood circulation issues.',
    12:'Foot injury, sleep disturbance. Hospital-related. Hidden enemies.',
  },
  Mercury: {
    1:'Nervous sensitivity, skin issues, speech strain.',
    2:'Dental problems. Speech-related head/dental disease (book rule).',
    3:'Nerve anxiety, respiratory sensitivity, communication overload.',
    4:'Lung-nerve connection. Anxiety from home environment.',
    5:'Intestinal sensitivity, IBS tendency. Mental overwork.',
    6:'TB risk (book: Mercury+Mars H6 → tuberculosis). Digestive nerve.',
    7:'Reproductive nerve issues, partner health link.',
    8:'Hidden nerve disorders, chronic anxiety. Occult stress.',
    9:'Sciatic nerve, hip nerve pain. Travel-related.',
    10:'Nerve stress from career. Skin issues from work pressure.',
    11:'Ear-nerve connection. Left ear. Social overstimulation.',
    12:'Left ear weakness (book). Sleep-related nerve disorder. Foreign illness.',
  },
  Jupiter: {
    1:'Fat body tendency (book: Jupiter lagna + watery sign → fat). Liver size.',
    2:'Dental protection mostly. Throat health generally good.',
    3:'Lung expansion. Generally protective.',
    4:'Chest/heart protection. Home peace = health.',
    5:'Slow digestion, liver sluggishness, possible infertility issues.',
    6:'Liver disease (6th Jupiter). Diabetes risk. Service-related health.',
    7:'Kidney sensitivity, reproductive health generally positive.',
    8:'Nephritis (book: Saturn+Sun+Venus H5 or Mars H10+Saturn). Transformation health.',
    9:'Hip/liver/thigh. Fortune protection generally.',
    10:'Knee joint. Career expansion stress.',
    11:'Blood sugar, arterial health, gains-anxiety.',
    12:'Foreign illness, hospital stays possible. Liver in foreign land.',
  },
  Venus: {
    1:'Reproductive sensitivity, hormonal. Beauty consciousness affects health.',
    2:'Right eye (book: Venus+malefic H2/H12 → poor vision). Facial.',
    3:'Throat sensitivity, vocal cords.',
    4:'Chest comfort, breast health. Home harmony = health.',
    5:'Reproductive creativity. Ovarian/uterine sensitivity.',
    6:'Right eye affliction (book: Venus H6 → right eye problem).',
    7:'Venereal/reproductive disease (book). Kidney-bladder sensitivity.',
    8:'Reproductive organs (8th Venus). Sexual disease risk.',
    9:'Hip/thigh comfort. Luxury health.',
    10:'Kidney stress from career. Skin from public life.',
    11:'Blood sugar, venous circulation, left eye.',
    12:'Night blindness (book: Venus+Moon H6-8-12 → night blindness). Hidden reproductive.',
  },
  Saturn: {
    1:'Weak immunity, chronic fatigue, thin/lean body.',
    2:'Tooth decay, speech difficulty. Dental bone issues.',
    3:'Shoulder stiffness, nerve compression, chronic arm issues.',
    4:'Lung weakness (book: Saturn H4 → depression). Chronic chest.',
    5:'Slow digestion, infertility, chronic stomach. Long disease (book rule).',
    6:'Arthritis, chronic disease (book: Saturn+Mars H6 → TB risk).',
    7:'Sexual weakness, relationship coldness. Chronic kidney.',
    8:'Long-term disease, genetic inheritance. Longevity protector but chronic karma.',
    9:'Hip arthritis, chronic sciatica.',
    10:'Knee pain (book rule: Saturn H10 → knee joint disease).',
    11:'Leg cramps, varicose veins, chronic circulation.',
    12:'Foot nerve damage, chronic hospitalization risk.',
  },
  Rahu: {
    1:'Allergy, strange mysterious illness, skin unusual conditions.',
    2:'Toxin in food/drink, addiction tendency, dental unusual.',
    3:'Nerve anxiety, unusual respiratory.',
    4:'Lung toxicity, pollution sensitivity, home environmental illness.',
    5:'Eye strain (book: Rahu H5+Sun aspect → eye destruction). Screen addiction.',
    6:'Mysterious undiagnosed disease (book: Rahu H6 → TB at 26).',
    7:'Sexual disease, obsessive relationship health (book: Rahu+Venus → venereal).',
    8:'Sudden surgery, explosive accident risk.',
    9:'Hip nerve damage, unusual pain patterns.',
    10:'Stress disorder, career-related toxicity.',
    11:'Blood toxicity, unusual circulation issues.',
    12:'Sleep disorder, hidden addiction, foreign mysterious illness.',
  },
  Ketu: {
    1:'Hidden weakness, mysterious inflammation, spiritual crisis.',
    2:'Unusual dental. Toxin absorption from food.',
    3:'Nerve depletion, past-life respiratory pattern.',
    4:'Psychosomatic home illness, lung karmic pattern.',
    5:'Hidden eye issues, neural confusion (book: Rahu/Ketu H5 → vision).',
    6:'Mysterious disease hard to diagnose. Karmic illness.',
    7:'Hidden reproductive issue. Detached relationship → health.',
    8:'Karmic surgery, mysterious transformation illness.',
    9:'Karmic hip pain, past-life sciatica.',
    10:'Mysterious career illness. Sudden health drops.',
    11:'Hidden blood issue, low immunity spikes.',
    12:'Moksha-level illness. Past-life karmic disease. Feet.',
  },
};

// ── Classical disease combinations (Book Chapter 19 + RTF rules) ──────
export const DISEASE_COMBOS_BOOK = [
  { key:'eye_saturn_2', disease:'Eye disease', note:'Saturn H2 → right eye affected (book rule)', check:(p:Record<string,{house:number}>) => !!p.Saturn && p.Saturn.house===2 },
  { key:'eye_venus_6_8', disease:'Right eye problem', note:'Venus H6/H8 → right eye trouble (book rule)', check:(p:Record<string,{house:number}>) => !!p.Venus && [6,8].includes(p.Venus.house) },
  { key:'eye_rahu_5', disease:'Eye destruction risk', note:'Rahu H5 → eye damage (book pg 44, rule xxii)', check:(p:Record<string,{house:number}>) => !!p.Rahu && p.Rahu.house===5 },
  { key:'eye_sun_12', disease:'Eye lustre loss', note:'Sun H12 → eyes without brightness (book rule iii)', check:(p:Record<string,{house:number}>) => !!p.Sun && p.Sun.house===12 },
  { key:'bp_mars_7', disease:'Blood Pressure / Emotional disease', note:'Mars H7 → BP and emotional disturbance (book rule VIII-i)', check:(p:Record<string,{house:number}>) => !!p.Mars && p.Mars.house===7 },
  { key:'mental_sat_1', disease:'Mental instability risk', note:'Saturn H1+Sun H12 → instability (book rule viii-iii)', check:(p:Record<string,{house:number}>) => !!p.Saturn && p.Saturn.house===1 && !!p.Sun && p.Sun.house===12 },
  { key:'anxiety_sat_mars', disease:'Anxiety / wavering mind', note:'Saturn H1+Mars H5/H9 → pavana prakopa yoga (book rule IX)', check:(p:Record<string,{house:number}>) => !!p.Saturn && p.Saturn.house===1 && !!p.Mars && [5,9].includes(p.Mars.house) },
  { key:'depression_moon_sat', disease:'Depression / mental illness', note:'Moon+Saturn conjunction → Visha Yoga (RTF rule)', check:(p:Record<string,{house:number}>) => !!p.Moon && !!p.Saturn && p.Moon.house===p.Saturn.house },
  { key:'tb_rahu_6', disease:'TB risk (~26 years)', note:'Rahu H6 → tuberculosis (book rule Q-i)', check:(p:Record<string,{house:number}>) => !!p.Rahu && p.Rahu.house===6 },
  { key:'tb_mercury_mars_6', disease:'Tuberculosis risk', note:'Mercury+Mars H6 → TB (book rule Q-ii)', check:(p:Record<string,{house:number}>) => !!p.Mercury && !!p.Mars && p.Mercury.house===6 && p.Mars.house===6 },
  { key:'tb_saturn_mars_6', disease:'Tuberculosis risk', note:'Saturn+Mars H6 → TB (book rule Q-iii)', check:(p:Record<string,{house:number}>) => !!p.Saturn && !!p.Mars && p.Saturn.house===6 && p.Mars.house===6 },
  { key:'accident_mars_rahu', disease:'Accident / surgery / burns risk', note:'Angarak Yoga — Mars+Rahu conjunction', check:(p:Record<string,{house:number}>) => !!p.Mars && !!p.Rahu && p.Mars.house===p.Rahu.house },
  { key:'accident_mars_sat', disease:'Bone fracture / chronic accident', note:'Mars+Saturn conjunction', check:(p:Record<string,{house:number}>) => !!p.Mars && !!p.Saturn && p.Mars.house===p.Saturn.house },
  { key:'leucoderma', disease:'Leucoderma risk', note:'Saturn+Moon+Mars conjunct (book rule M)', check:(p:Record<string,{house:number}>) => !!p.Saturn && !!p.Moon && !!p.Mars && p.Saturn.house===p.Moon.house && p.Moon.house===p.Mars.house },
  { key:'sexual_venus_rahu', disease:'Sexual / reproductive disease', note:'Venus+Rahu conjunction → sexual disease (book rule Z + RTF)', check:(p:Record<string,{house:number}>) => !!p.Venus && !!p.Rahu && p.Venus.house===p.Rahu.house },
  { key:'heart_moon_dusthana', disease:'Heart disease risk', note:'Moon in dusthana + 4th lord weak → heart (book rule Y)', check:(p:Record<string,{house:number}>) => !!p.Moon && [6,8,12].includes(p.Moon.house) },
  { key:'nephritis_sun_mars', disease:'Nephritis', note:'Sun H1+Mars H6 → nephritis (book rule W-iii)', check:(p:Record<string,{house:number}>) => !!p.Sun && p.Sun.house===1 && !!p.Mars && p.Mars.house===6 },
];

// ── Sign diseases (Book pg 58-59 — Section 20) ────────────────────────
export const SIGN_DISEASE: Record<string, string> = {
  Aries:       'Bilious fever, stomach problems. Death risk from abdominal disease.',
  Taurus:      'Tridosha diseases, risk from fire and weapons.',
  Gemini:      'Body pain, excessive internal heat.',
  Cancer:      'Insanity tendency, tastelessness, digestive imbalance.',
  Leo:         'Fever, risk from animals/enemies.',
  Virgo:       'Venereal diseases, falls, gonorrhea tendency.',
  Libra:       'Fever, post-pregnancy complications.',
  Scorpio:     'Jaundice, liver issues.',
  Sagittarius: 'Death risk from falls and weapons.',
  Capricorn:   'Tremendous pain, tastelessness, mental imbalance.',
  Aquarius:    'Fever, tuberculosis, respiratory problems.',
  Pisces:      'Urinary infections, lymphatic disorders.',
};

// ── Planet body zones for boils (Book pg 49 — Section 19J) ────────────
export const PLANET_BOIL: Record<string, string> = {
  Sun:'Head region', Moon:'Face region', Mars:'Neck region',
  Mercury:'Navel region', Jupiter:'Nose region', Venus:'Eye region',
  Saturn:'Leg region', Rahu:'Navel and stomach', Ketu:'Navel and stomach',
};

// ── Tridosha per planet ────────────────────────────────────────────────
const TRIDOSHA: Record<string, string> = {
  Sun:'Pitta', Moon:'Kapha', Mars:'Pitta', Mercury:'Vata',
  Jupiter:'Kapha', Venus:'Kapha', Saturn:'Vata', Rahu:'Vata', Ketu:'Vata',
};

// ── Sign → body zone ─────────────────────────────────────────────────
export const SIGN_BODY: Record<string, string> = {
  Aries:'Head / brain / face heat', Taurus:'Face / throat / thyroid',
  Gemini:'Arms / lungs / nerves', Cancer:'Chest / stomach / fluids',
  Leo:'Heart / spine / vitality', Virgo:'Intestine / digestion / skin',
  Libra:'Kidneys / lower back / sugar', Scorpio:'Reproductive / colon / hidden',
  Sagittarius:'Hips / thighs / liver', Capricorn:'Bones / knees / joints',
  Aquarius:'Circulation / calves / nerves', Pisces:'Feet / lymph / sleep / immunity',
};

// ── Prakriti by lagna ────────────────────────────────────────────────
export const PRAKRITI_LAGNA: Record<string, string> = {
  Aries:       'Pitta dominant — sharp, hot, inflammatory. Avoid excess spicy food, sun exposure, anger.',
  Taurus:      'Kapha dominant — stable, heavy, slow metabolism. Watch weight, congestion, thyroid.',
  Gemini:      'Vata dominant — quick, nervous, changeable. Protect digestion, routine critical.',
  Cancer:      'Kapha-Vata — emotional, fluid retention, respiratory sensitivity.',
  Leo:         'Pitta dominant — strong vitality, heart sensitivity, spine focus.',
  Virgo:       'Vata-Pitta — analytical stress, intestinal sensitivity, nerve-gut axis.',
  Libra:       'Vata-Kapha — kidney sensitivity, hormonal balance key.',
  Scorpio:     'Pitta-Kapha — hidden disorders, reproductive and transformation health.',
  Sagittarius: 'Pitta-Vata — liver/hip sensitive, philosophical stress.',
  Capricorn:   'Vata dominant — bones/joints, chronic conditions after 35.',
  Aquarius:    'Vata-Pitta — circulation, neurological, unconventional ailments.',
  Pisces:      'Kapha-Vata — feet/lymph/immunity, psychosomatic, spiritual health link.',
};

// ── Nakshatra devata upay (health propitiation) ───────────────────────
export const NAKSHATRA_UPAY: Record<string, string> = {
  Ashwini:           'Ashwini Devathas worship. Sunday fast. Red flowers. Horse worship.',
  Bharani:           'Yama Puja. Saturday charity. Black sesame. Ancestors prayers.',
  Krittika:          'Agni Havan. Tuesday fire rituals. Red items charity.',
  Rohini:            'Brahma puja. Monday fast. White items charity. Cow service.',
  Mrigashira:        'Moon worship. Monday fast. White milk. Shiva abhishek.',
  Ardra:             'Rudra abhishek. Monday-Saturday. Shiva puja. Blue/black charity.',
  Punarvasu:         'Aditi Devi puja. Thursday fast. Yellow items. Guru seva.',
  Pushya:            'Brihaspati puja. Thursday. Banana, yellow flowers. Temple visit.',
  Ashlesha:          'Sarpa puja. Nag panchami. Milk to snake idol. Rahu-Ketu remedy.',
  Magha:             'Pitru tarpan. Shraddha rituals. Ancestors food. Amavasya fast.',
  'Purva Phalguni':  'Surya worship. Sunday fast. Wheat/jaggery charity. Red lotus.',
  'Uttara Phalguni': 'Aryama worship. Sunday. Father ancestors. Gold charity.',
  Hasta:             'Savitru puja. Wednesday. Green items. Mercury mantra.',
  Chitra:            'Vishwakarma puja. Saturday. Iron charity. Hanuman puja.',
  Swati:             'Vayu dev puja. Saturday. Blue items. Saraswati worship.',
  Vishakha:          'Indra puja. Thursday. Rain water remedies. Jupiter mantra.',
  Anuradha:          'Mitra worship. Friday. White flowers. Venus mantra.',
  Jyeshtha:          'Moon puja. Monday. Silver charity. Shiva puja.',
  Mula:              'Nirriti/Rakshasa remedies. Hanuman puja. Saturday fast. Black sesame.',
  'Purva Ashadha':   'Jala Devata. Water charity. Monday. Varuna puja.',
  'Uttara Ashadha':  'Vishwa Devathas. All-god worship. Thursday. Yellow items.',
  Shravana:          'Vishnu worship. Thursday/Ekadashi fast. Tulsi. Vishnu sahasranama.',
  Dhanishtha:        'Ashta Vasu puja. Saturday. Banyan tree worship.',
  Shatabhisha:       'Varuna puja. Saturday. Water donation. Blue items.',
  'Purva Bhadrapada':'Jala puja. Water remedies. Monday fast. Shiva-Parvati worship.',
  'Uttara Bhadrapada':'Brahma puja. Thursday fast. Yellow lotus. Knowledge charity.',
  Revati:            'Poosha worship. Thursday. Cow service. Green fodder.',
};

// ── Functional benefic/malefic per lagna ─────────────────────────────
const FUNC_BM: Record<string, { ben: string[]; mal: string[] }> = {
  Aries:       { ben:['Sun','Jupiter','Moon'],      mal:['Mercury','Venus','Saturn','Rahu','Ketu'] },
  Taurus:      { ben:['Mercury','Saturn','Venus'],   mal:['Jupiter','Moon','Sun','Rahu','Ketu'] },
  Gemini:      { ben:['Venus','Saturn'],              mal:['Mars','Jupiter','Sun','Moon'] },
  Cancer:      { ben:['Moon','Mars','Jupiter'],       mal:['Mercury','Venus','Saturn','Rahu','Ketu'] },
  Leo:         { ben:['Sun','Mars','Jupiter'],        mal:['Mercury','Venus','Saturn','Rahu','Ketu'] },
  Virgo:       { ben:['Mercury','Venus'],             mal:['Mars','Jupiter','Moon','Sun'] },
  Libra:       { ben:['Mercury','Venus','Saturn'],    mal:['Jupiter','Sun','Moon','Mars'] },
  Scorpio:     { ben:['Moon','Jupiter','Sun'],        mal:['Mercury','Venus','Saturn','Rahu','Ketu'] },
  Sagittarius: { ben:['Mars','Sun','Jupiter'],        mal:['Mercury','Venus','Saturn'] },
  Capricorn:   { ben:['Mercury','Saturn','Venus'],    mal:['Moon','Mars','Jupiter','Sun'] },
  Aquarius:    { ben:['Mercury','Venus','Saturn'],    mal:['Moon','Mars','Jupiter','Sun'] },
  Pisces:      { ben:['Moon','Mars','Jupiter'],       mal:['Mercury','Venus','Saturn','Sun'] },
};

// ── Types ─────────────────────────────────────────────────────────────
export interface PlanetHealthCard {
  planet: string;
  house: number;
  sign: string;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
  inDusthana: boolean;
  tridosha: string;
  funcNature: 'benefic' | 'malefic' | 'neutral';
  houseNote: string;
  nakshatraDisease: string;
  nakshatraBody: string;
  boilZone: string;
  nakUpay: string;
}

export interface DiseaseCombination {
  disease: string;
  note: string;
}

export interface MedicalResult {
  lagnaSign: string;
  prakriti: string;
  lagnaBodyZone: string;
  birthNakshatra: string;
  birthNakshatraData: { disease: string; body: string; note: string } | null;
  moonSign: string;
  moonSignDisease: string;
  birthNakshatraUpay: string;
  planetCards: PlanetHealthCard[];
  healthScores: Record<string, number>;
  accidentScore: number;
  triggeredCombos: DiseaseCombination[];
  topConcerns: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  timingAlerts: {
    planet: string;
    level: 'Mahadasha' | 'Antardasha';
    concern: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
  }[];
  preventiveRoutine: string[];
}

function concernForPlanet(planet: string, card?: PlanetHealthCard): string {
  if (!card) return 'General vitality';
  if (card.planet === 'Sun') return 'Heart, eyes, vitality and inflammation';
  if (card.planet === 'Moon') return 'Mind, fluids, sleep and digestion';
  if (card.planet === 'Mars') return 'Blood pressure, surgery, inflammation and accidents';
  if (card.planet === 'Mercury') return 'Nerves, skin, digestion and respiratory sensitivity';
  if (card.planet === 'Jupiter') return 'Liver, sugar metabolism and weight';
  if (card.planet === 'Venus') return 'Kidney, reproductive and hormonal balance';
  if (card.planet === 'Saturn') return 'Bones, joints, chronic fatigue and nerves';
  if (card.planet === 'Rahu') return 'Allergy, toxins, unexplained symptoms and addiction loops';
  if (card.planet === 'Ketu') return 'Hidden inflammation, depletion and hard-to-pinpoint symptoms';
  return card.houseNote;
}

// ── Main calculation ───────────────────────────────────────────────────
export function calculateMedical(chart: ChartData): MedicalResult {
  const planets = chart.planets;
  const lagnaSign = chart.lagnaRashi;
  const prakriti = PRAKRITI_LAGNA[lagnaSign] || 'Mixed constitution.';
  const lagnaBodyZone = SIGN_BODY[lagnaSign] || '';

  const moonPd = planets.Moon;
  const birthNakshatra = moonPd?.nakshatra || 'Unknown';
  const moonSignRaw = moonPd?.sign || '';
  const birthNakshatraData = NAKSHATRA_DISEASE_BOOK[birthNakshatra] || null;
  const moonSignDisease = SIGN_DISEASE[moonSignRaw] || '';
  const birthNakshatraUpay = NAKSHATRA_UPAY[birthNakshatra] || 'Nakshatra devata worship.';

  const bm = FUNC_BM[lagnaSign];

  // ── Planet cards ───────────────────────────────────────────────────
  const PLANETS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const planetCards: PlanetHealthCard[] = PLANETS.map(p => {
    const pd = planets[p];
    if (!pd) return null;
    const inDusthana = [6,8,12].includes(pd.house);
    const nk = NAKSHATRA_DISEASE_BOOK[pd.nakshatra] || { disease:'—', body:'—', note:'' };
    const funcNature: 'benefic'|'malefic'|'neutral' = bm
      ? bm.ben.includes(p) ? 'benefic' : bm.mal.includes(p) ? 'malefic' : 'neutral'
      : 'neutral';
    return {
      planet: p, house: pd.house, sign: pd.sign, nakshatra: pd.nakshatra,
      pada: pd.pada, retrograde: pd.retrograde, inDusthana,
      tridosha: TRIDOSHA[p] || 'Mixed',
      funcNature,
      houseNote: PLANET_HOUSE_DISEASE[p]?.[pd.house] || `${p} activates H${pd.house}`,
      nakshatraDisease: nk.disease,
      nakshatraBody: nk.body,
      boilZone: PLANET_BOIL[p] || '—',
      nakUpay: NAKSHATRA_UPAY[pd.nakshatra] || '',
    };
  }).filter(Boolean) as PlanetHealthCard[];

  // ── Triggered combinations ─────────────────────────────────────────
  const planetsForCheck: Record<string, { house: number }> = {};
  PLANETS.forEach(p => { if (planets[p]) planetsForCheck[p] = { house: planets[p].house }; });
  const triggeredCombos: DiseaseCombination[] = DISEASE_COMBOS_BOOK
    .filter(c => { try { return c.check(planetsForCheck); } catch { return false; } })
    .map(c => ({ disease: c.disease, note: c.note }));

  // ── Health scores ──────────────────────────────────────────────────
  const scores: Record<string, number> = {
    Heart:0, Digestive:0, Mental:0, Eye:0, Bone:0, Respiratory:0, Reproductive:0, Skin:0,
  };
  const p = planets;
  if (p.Sun  && [6,8,12].includes(p.Sun.house))                               scores.Heart       += 20;
  if (p.Mars && [4,8].includes(p.Mars.house))                                  scores.Heart       += 15;
  if (p.Moon && [6,8,12].includes(p.Moon.house))                              scores.Heart       += 10;
  if (p.Saturn && p.Sun && p.Saturn.house===p.Sun.house)                      scores.Heart       += 15;
  if (p.Moon && [6,8].includes(p.Moon.house))                                  scores.Digestive   += 15;
  if (p.Mercury && p.Mars && p.Mercury.house===6 && p.Mars.house===6)         scores.Digestive   += 20;
  if (p.Jupiter && [6,8,12].includes(p.Jupiter.house))                        scores.Digestive   += 10;
  if (p.Saturn && [5,6].includes(p.Saturn.house))                              scores.Digestive   += 10;
  if (p.Moon && p.Saturn && p.Moon.house===p.Saturn.house)                    scores.Mental      += 25;
  if (p.Moon && p.Rahu  && p.Moon.house===p.Rahu.house)                       scores.Mental      += 20;
  if (p.Saturn && p.Saturn.house===1)                                           scores.Mental      += 10;
  if (p.Mercury && [6,8,12].includes(p.Mercury.house))                        scores.Mental      += 10;
  if (p.Saturn && p.Saturn.house===2)                                           scores.Eye         += 20;
  if (p.Venus  && [6,8].includes(p.Venus.house))                               scores.Eye         += 15;
  if (p.Rahu   && p.Rahu.house===5)                                             scores.Eye         += 20;
  if (p.Sun    && [12,6,8].includes(p.Sun.house))                              scores.Eye         += 10;
  if (p.Saturn && [1,4,6,7,10].includes(p.Saturn.house))                      scores.Bone        += 15;
  if (p.Mars   && p.Saturn && p.Mars.house===p.Saturn.house)                  scores.Bone        += 20;
  if (p.Moon   && p.Moon.house===6)                                             scores.Respiratory += 15;
  if (p.Saturn && p.Saturn.house===4)                                           scores.Respiratory += 15;
  if (p.Rahu   && p.Rahu.house===4)                                             scores.Respiratory += 10;
  if (p.Venus  && [6,8,12].includes(p.Venus.house))                           scores.Reproductive += 15;
  if (p.Mars   && p.Venus && p.Mars.house===p.Venus.house)                    scores.Reproductive += 15;
  if (p.Rahu   && p.Venus && p.Rahu.house===p.Venus.house)                    scores.Reproductive += 20;
  if (p.Saturn && p.Mercury && p.Saturn.house===p.Mercury.house)              scores.Skin        += 15;
  if (p.Mars   && p.Rahu && p.Mars.house===p.Rahu.house)                      scores.Skin        += 15;
  Object.keys(scores).forEach(k => { scores[k] = Math.min(scores[k], 99); });

  // ── Accident score ────────────────────────────────────────────────
  let accidentScore = 0;
  if (p.Mars  && [6,8,12,1].includes(p.Mars.house))                           accidentScore += 15;
  if (p.Mars  && p.Rahu && p.Mars.house===p.Rahu.house)                       accidentScore += 20;
  if (p.Mars  && p.Saturn && p.Mars.house===p.Saturn.house)                   accidentScore += 15;
  if (p.Rahu  && [1,6,8,12].includes(p.Rahu.house))                           accidentScore += 10;
  if (p.Saturn && [1,6,8].includes(p.Saturn.house))                            accidentScore += 10;
  const h8count = PLANETS.filter(pl => planets[pl]?.house===8).length;
  accidentScore += h8count * 8;
  accidentScore = Math.min(accidentScore, 99);

  // ── Top concerns ─────────────────────────────────────────────────
  const topConcerns = Object.entries(scores)
    .sort((a,b) => b[1]-a[1])
    .filter(([,v]) => v > 10)
    .slice(0, 4)
    .map(([k]) => k);

  const maxScore = Math.max(accidentScore, ...Object.values(scores));
  const riskLevel: MedicalResult['riskLevel'] = maxScore >= 45 || triggeredCombos.length >= 3
    ? 'high'
    : maxScore >= 22 || triggeredCombos.length > 0
    ? 'moderate'
    : 'low';

  const now = new Date();
  const activeMahadasha = chart.dashas?.find(d => d.start <= now && d.end > now);
  const activeAntardasha = chart.antardasha?.find(d => d.start <= now && d.end > now);
  const timingAlerts: MedicalResult['timingAlerts'] = [activeMahadasha, activeAntardasha]
    .map((dasha, idx) => {
      if (!dasha) return null;
      const card = planetCards.find(c => c.planet === dasha.planet);
      const isSensitive = !!card && (card.inDusthana || card.funcNature === 'malefic' || card.retrograde);
      const severity: 'low' | 'medium' | 'high' = isSensitive && card?.inDusthana ? 'high' : isSensitive ? 'medium' : 'low';
      const level = idx === 0 ? 'Mahadasha' : 'Antardasha';
      return {
        planet: dasha.planet,
        level,
        concern: concernForPlanet(dasha.planet, card),
        severity,
        message: isSensitive
          ? `${level} ${dasha.planet} is active; monitor ${concernForPlanet(dasha.planet, card).toLowerCase()} and avoid ignoring recurring symptoms.`
          : `${level} ${dasha.planet} is active with manageable health sensitivity; keep routine steady.`,
      };
    })
    .filter(Boolean) as MedicalResult['timingAlerts'];

  const preventiveRoutine = [
    topConcerns.length
      ? `Track ${topConcerns.slice(0,2).join(' and ')} symptoms weekly; escalate to a doctor if they repeat or intensify.`
      : 'Maintain a simple weekly health check: sleep, digestion, energy, mood and pain markers.',
    accidentScore >= 25
      ? 'Drive, exercise and handle tools with extra care during Mars/Rahu/Saturn sensitive days.'
      : 'Keep movement regular but moderate; consistency is better than sudden intense routines.',
    riskLevel === 'high'
      ? 'Do not self-diagnose from astrology; use this as a prevention checklist and consult a qualified doctor for concerns.'
      : 'Use this as preventive awareness, not diagnosis; medical symptoms need professional evaluation.',
  ];

  return {
    lagnaSign, prakriti, lagnaBodyZone, birthNakshatra, birthNakshatraData,
    moonSign: moonSignRaw, moonSignDisease, birthNakshatraUpay,
    planetCards, healthScores: scores, accidentScore, triggeredCombos, topConcerns,
    riskLevel, timingAlerts, preventiveRoutine,
  };
}
