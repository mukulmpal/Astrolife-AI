// src/lib/astro-engine/core-planet-remedies.ts
// AstroLife — Authentic Core Planet Remedies, Dignity Assessment & Elemental Vehicles
// Derived verbatim from the Classical Master Lecture Transcript & Universal Remedy Schema.
// Governs: Favorable (Power-Up / Gemstone) vs Afflicted (Mitigate / Charity / Never Gemstone),
// Moon Psychological Heart-Sharing Map, Conjunction Resolutions, and Specific Charity Dosages.

import type { ChartData, PlanetData } from "./calculations";
import { resolveHouseTrikonaRemedy, type HouseTrikonaRule } from "./house-trikona-remedies";

export type PlanetId = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

export interface PlanetGemstoneConfig {
  name: string;
  sanskritName: string;
  metal: string;
  finger: string;
  dayToWear: string;
  muhurat: string;
  strictWarning: string;
}

export interface PlanetCharityItem {
  item: string;
  quantity: string;
  day: string;
  timing: string;
  targetRecipient: string;
  place: string;
  esotericReason: string;
}

export interface PlanetMasterDefinition {
  id: PlanetId;
  sanskritName: string;
  hindiName: string;
  deity: string;
  direction: string;
  gender: string;
  nature: "Benefic" | "Malefic" | "Neutral";
  bodyParts: string[];
  karakas: string[];
  diseasesWhenAfflicted: string[];
  
  // Favorable (Power-Up)
  gemstone: PlanetGemstoneConfig;
  favorableColours: string[];
  favorableFoods: string[];
  favorableActionsHinglish: string[];
  powerUpMantra: string;

  // Afflicted (Mitigation & Charity)
  afflictedStoneWarning: string;
  afflictedCharity: PlanetCharityItem[];
  avoidColours: string[];
  avoidHabits: string[];
  afflictedMitigationHinglish: string[];
}

export const MASTER_PLANET_REGISTRY: Record<PlanetId, PlanetMasterDefinition> = {
  Sun: {
    id: "Sun",
    sanskritName: "Surya",
    hindiName: "सूर्य देव",
    deity: "Shri Ram, Surya Narayan",
    direction: "East (पूर्व)",
    gender: "Male",
    nature: "Malefic",
    bodyParts: ["Heart", "Eyes", "Bones", "Stomach Fire (Jatharagni)", "Vital Aura"],
    karakas: ["Soul (Aatman)", "Father", "Authority", "Government Status", "Character", "Fame"],
    diseasesWhenAfflicted: [
      "Heart palpitation & cardiac vulnerability",
      "Eye weakness and vision issues",
      "Bone density depletion & spine stiffness",
      "Severe acidity & bile disorders",
      "Unjust blame, character assassination & government friction"
    ],
    gemstone: {
      name: "Ruby / Manikya (माणिक्य)",
      sanskritName: "Manikya",
      metal: "Pure Gold (तांबा / सोना)",
      finger: "Right hand Index finger (तर्जनी) or Ring finger (अनामिका)",
      dayToWear: "Sunday sunrise",
      muhurat: "Shukla Paksha Sunday during Sun Hora",
      strictWarning: "ONLY if Sun is a functional benefic (1, 4, 5, 9, 10, 11) and NOT in 6, 8, 12 or debilitated in Libra!"
    },
    favorableColours: ["Deep Red", "Ruby Orange", "Golden Yellow", "Copper Saffron"],
    favorableFoods: ["Pure Desi Gud (Jaggery)", "Gehun (Whole Wheat)", "Saffron Milk"],
    favorableActionsHinglish: [
      "Subah taambe ke lote me jal lekar Gayatri Mantra bolte hue Surya Dev ko Arghya arpit karein.",
      "Raat ko taambe ke bartan me paani rakhein aur subah thoda gud khakar wahi paani piyein.",
      "Purva (East) disha me Shri Ram ji ki nitya aarti ya puja karein.",
      "Pitaji ke charan sparsh karke ashirwad lein aur unka aadar karein.",
      "Apne aacharan (character) ko hamesha nishkalank rakhein; Surya naitikta ka prateek hai."
    ],
    powerUpMantra: "Om Bhur Bhuvah Swah Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat",
    afflictedStoneWarning: "BHULKAR BHI MANIKYA (RUBY) NA PEHNE! Afflicted Surya par stone pehanna aag me ghee daalna hai.",
    afflictedCharity: [
      {
        item: "Whole Wheat (Gehun) & Gud",
        quantity: "Apne body weight ka 1/10th hissa (e.g. 70kg weight par 7kg Gehun)",
        day: "Sunday (Ravivar)",
        timing: "Dopahar se pehle (Before 12 PM)",
        targetRecipient: "Temple kitchen, poor laborers or religious annakshetra",
        place: "Mandir ya dharmik sthal",
        esotericReason: "Surya ki tapan aur peeda ko ann daan ke madhyam se shaant kiya jaata hai."
      },
      {
        item: "Free Essential Medicines",
        quantity: "Yathashakti (samarthya anusar)",
        day: "Sunday",
        timing: "Daytime",
        targetRecipient: "Hospital me admit zarooratmand mareez jo dawai lene me asamarth hain",
        place: "Government hospital or charitable clinic",
        esotericReason: "Surya swasthya aur jeevan-shakti ka swami hai; mareez ko aushadhi dena Surya dosha ko kaatta hai."
      }
    ],
    avoidColours: ["Dull dark black", "Muddy brown", "Faded grey"],
    avoidHabits: [
      "Never disrespect father or state authority",
      "Late morning sleeping (subah der se uthna Surya ko dushit karta hai)",
      "Excessive ego or false arrogance"
    ],
    afflictedMitigationHinglish: [
      "Surya ko Gayatri mantra se taambe ke patra se jal dein lekin Ruby bilkul na dalein.",
      "Government hospital me jaakar garib mareezo ko dawaiyan khareed kar dein.",
      "Sunday ke din namak (salt) ka sevan kam karein ya ek samay bina namak ka bhojan karein."
    ]
  },

  Moon: {
    id: "Moon",
    sanskritName: "Chandra",
    hindiName: "चंद्रमा",
    deity: "Mata Parvati, Lord Shiva",
    direction: "North-West (वायव्य)",
    gender: "Female",
    nature: "Benefic",
    bodyParts: ["Mind (Chitta)", "Blood Plasma & Fluids", "Lungs & Chest", "Water Retention", "Hormones"],
    karakas: ["Mind & Emotions", "Mother", "Water", "Nourishment & Food", "Travel", "Public Perception"],
    diseasesWhenAfflicted: [
      "Severe depression, chronic anxiety & restlessness",
      "Sleeplessness (insomnia) & midnight panic",
      "Sudden BP drop & extreme lethargy/paralysis of willpower",
      "Mother's chronic sickness or emotional distance",
      "Water retention, fluid imbalance, cough & phlegm"
    ],
    gemstone: {
      name: "Natural Pearl / Moti (मोती)",
      sanskritName: "Mukta",
      metal: "Pure Silver (चांदी)",
      finger: "Right hand Little finger (कनिष्ठा) or Ring finger (अनामिका)",
      dayToWear: "Monday evening or moonrise",
      muhurat: "Shukla Paksha Monday in Rohini, Hasta, or Shravana nakshatra",
      strictWarning: "ONLY if Moon is auspicious and not conjunct Rahu/Ketu/Saturn or placed in 6, 8, 12!"
    },
    favorableColours: ["Pure Milk White", "Pearl Silver", "Moonlight Cream", "Light Off-White"],
    favorableFoods: ["Desi Cow Milk", "Kheer (Rice pudding with milk)", "Pure fresh water", "Sattvik vegetarian diet"],
    favorableActionsHinglish: [
      "Chandi ke gilas me desi gay ka doodh ya shuddh paani peena shuru karein.",
      "Apni Mata ji ke nitya charan chhooein aur unka aashirwad lein; mata hi sakshat Chandra hain.",
      "Bhagwan Shiva ka doodh aur jal se Abhishek karein.",
      "Bhojan hamesha shuddh aur taaza khayein; baasi bhojan Moon ko bigad deta hai.",
      "Purnima ke din chandra-darshan karein aur sheetal dhyan karein."
    ],
    powerUpMantra: "Om Som Somaya Namah / Om Shram Shreem Shrom Sah Chandramase Namah",
    afflictedStoneWarning: "BHULKAR BHI MOTI (PEARL) NA PEHNE agar Moon 6, 8, 12 me ho ya Rahu/Ketu/Shani se peedit ho; is se depression aur badhega!",
    afflictedCharity: [
      {
        item: "Raw Cow Milk / White Rice / Sugar (Khand)",
        quantity: "2kg se 5kg",
        day: "Monday (Somvar)",
        timing: "Subah ya Sandhya kaal",
        targetRecipient: "Elderly needy women, widows, or temple kitchen",
        place: "Shiva Temple ya Vriddhashram",
        esotericReason: "Chandra ke dravya ka daan man ke vish aur dukh ko nikal phenkta hai."
      },
      {
        item: "Drinking Water cooler / Water distribution (Pyaau)",
        quantity: "Seva / Chhatra seva",
        day: "Any sunny day or Monday",
        timing: "Daytime",
        targetRecipient: "Thirsty travelers, birds, animals, public",
        place: "Public spot or roadside",
        esotericReason: "Paani pilane se Chandra ki peeda amrit me badal jaati hai."
      }
    ],
    avoidColours: ["Pitch black", "Blood dark red at night"],
    avoidHabits: [
      "Never waste drinking water (paani barbad karna seedha depression ko nyota dena hai)",
      "Avoid cold milk or heavy curds late at night",
      "Never disrespect mother or maternal figures"
    ],
    afflictedMitigationHinglish: [
      "Paani ki barbadi turant rokein; balti me nahaayein, shower ka misuse na karein.",
      "Paas me shuddh chandi ka chaukore tukda (silver square piece) pocket me rakhein.",
      "Agar Moon 4, 8, 12 me peedit hai to doodh ya chandi ka sikka saaf behte jal me pravahit karein."
    ]
  },

  Mars: {
    id: "Mars",
    sanskritName: "Mangal",
    hindiName: "मंगल देव",
    deity: "Lord Hanuman, Kartikeya",
    direction: "South (दक्षिण)",
    gender: "Male",
    nature: "Malefic",
    bodyParts: ["Blood (RBC/Hemoglobin)", "Muscles", "Bone Marrow", "Head & Cranium", "Physical Vitality"],
    karakas: ["Courage (Parakrama)", "Real Estate & Land", "Brothers & Comrades", "Husband (in Female chart)", "Police & Military", "Surgery"],
    diseasesWhenAfflicted: [
      "High blood pressure, blood infections & hemorrhage",
      "Severe accidental cuts, burns, fractures & surgeries",
      "Sudden explosive anger, violence & relationship destruction",
      "Brother disputes, property court-cases & mortgage default",
      "Chronic piles, boils, ulcers & acute inflammation"
    ],
    gemstone: {
      name: "Red Coral / Moonga (मूंगा)",
      sanskritName: "Pravala",
      metal: "Copper (तांबा) or Gold (सोना)",
      finger: "Right hand Ring finger (अनामिका)",
      dayToWear: "Tuesday morning",
      muhurat: "Shukla Paksha Tuesday during Mars Hora (Mrigashira, Chitra, Dhanishta)",
      strictWarning: "DO NOT WEAR if Mars is in 4th house (debilitated in Cancer) or 8th house, else it triggers emotional explosions!"
    },
    favorableColours: ["Vermilion Red (Sinduri)", "Bright Crimson", "Terracotta Coral"],
    favorableFoods: ["Roasted Gram with Jaggery (Gud-Chana)", "Pomegranate (Anaar)", "Beetroot", "Red Lentils (Masoor)"],
    favorableActionsHinglish: [
      "Nitya Hanuman Chalisa ya Bajrang Baan ka paath karein.",
      "Shareer ko physical workouts, running, gym ya sports me lagayein; Mars paseene se khush hota hai.",
      "Chhote bhaiyo ki aarthik aur mansik madad karein.",
      "Mitti ke bartan me paani peena shuru karein.",
      "Bhoomi par baithkar prarthana karein."
    ],
    powerUpMantra: "Om Kram Kreem Krom Sah Bhaumaya Namah / Om Angarkaya Namah",
    afflictedStoneWarning: "BHULKAR BHI MOONGA NA PEHNE agar Mangal neech ka ho ya 6/8 bhav me peedit ho, krodh aur accident bhadak jayenge!",
    afflictedCharity: [
      {
        item: "Red Lentils (Lal Masoor Dal) in Earthen Pot (Mitti ka Ghada)",
        quantity: "1.25 kg Lal Masoor Dal mitti ke patra me",
        day: "Tuesday (Mangalvar)",
        timing: "Dopahar se pehle",
        targetRecipient: "Temple, river bank, or laborers",
        place: "Hanuman Temple or flowing river",
        esotericReason: "Mitti ka patra (Prithvi) aur Masoor (Mangal) krodh aur rakt ke vikar ko shaant karte hain."
      },
      {
        item: "Meethi Roti (Sweet tandoori roti baked with gud)",
        quantity: "8 ya 12 meethi rotiyan",
        day: "Tuesday",
        timing: "Afternoon",
        targetRecipient: "Street dogs, birds, or needy people",
        place: "Roadside or animal shelter",
        esotericReason: "Meethi roti Mangal ke dushprabhav aur accident yog ko shant karti hai."
      }
    ],
    avoidColours: ["Bright neon aggressive red (when afflicted)", "Harsh fluorescent orange"],
    avoidHabits: [
      "Never quarrel with brothers or land partners",
      "Avoid sudden angry arguments on empty stomach",
      "Never consume non-vegetarian food or liquor on Tuesdays"
    ],
    afflictedMitigationHinglish: [
      "Hanuman ji ko sindoor aur chameli ka tel chadhayein.",
      "Mitti ke ghade me 1.25 kg masoor daal bhar kar behte jal me pravahit karein ya mitti me dabayein.",
      "Gusse par niyantran ke liye thande paani se chehra dhoyein aur pranayama karein."
    ]
  },

  Mercury: {
    id: "Mercury",
    sanskritName: "Budha",
    hindiName: "बुध देव",
    deity: "Lord Vishnu, Goddess Saraswati, Lord Ganesha",
    direction: "North (उत्तर)",
    gender: "Neutral / Eunuch",
    nature: "Benefic",
    bodyParts: ["Nervous System", "Brain Synapses", "Skin", "Tongue & Speech", "Vocal Cords", "Intestines"],
    karakas: ["Intelligence (Buddhi)", "Business & Commerce", "Communication & Media", "Accounts & Mathematics", "Writing & Astrology", "Maternal Uncle & Sister"],
    diseasesWhenAfflicted: [
      "Speech stammering, nervous breakdown & chronic anxiety",
      "Skin allergies, eczema, psoriasis & fungal rashes",
      "Memory loss, learning disability & mental fog",
      "Severe financial loss in trading, scams & account mismanagement",
      "Friction with maternal uncles, sisters, or daughters"
    ],
    gemstone: {
      name: "Emerald / Panna (पन्ना)",
      sanskritName: "Marakata",
      metal: "Gold (सोना) or Bronze (कांसा)",
      finger: "Right hand Little finger (कनिष्ठा)",
      dayToWear: "Wednesday morning",
      muhurat: "Shukla Paksha Wednesday in Ashlesha, Jyeshtha, or Revati",
      strictWarning: "NEVER wear Emerald if Mercury is in Pisces (12th sign debilitated) or afflicted in 6, 8, 12 without cancellations!"
    },
    favorableColours: ["Fresh Parrot Green", "Emerald Green", "Mint Green"],
    favorableFoods: ["Green leafy vegetables (Palak, Methi)", "Moong Dal (Whole green)", "Amla (Gooseberry)", "Green Cardamom (Elaichi)"],
    favorableActionsHinglish: [
      "Nitya Vishnu Sahasranama ka path karein ya Om Namo Bhagavate Vasudevaya japein.",
      "Apni behen, beti aur bua ko uphaar dein aur unka samman karein.",
      "Buddhiki dhar tez karne ke liye roz nayi pustak padhein ya calculation karein.",
      "Tulsi ji ko nitya jal arpit karein aur unke paas deepak jalayein.",
      "Danto ko hamesha saaf rakhein (Fitkari se daant saaf karna Budha ko sudharta hai)."
    ],
    powerUpMantra: "Om Bum Budhaya Namah / Om Bram Breem Brom Sah Budhaya Namah",
    afflictedStoneWarning: "PANNA (EMERALD) BHULKAR BHI NA PEHNE agar Budh peedit ho; galat decision aur trading me sarva-naash ho sakta hai!",
    afflictedCharity: [
      {
        item: "Green fodder / Spinach (Hari Ghaas ya Palak)",
        quantity: "5kg to 10kg green palak",
        day: "Wednesday (Budhvar)",
        timing: "Morning sunrise",
        targetRecipient: "Desi Cows in Gaushala",
        place: "Gaushala",
        esotericReason: "Gay ko hara chaara khilana Budha ke dosha aur skin allergy ko turant har leta hai."
      },
      {
        item: "Sabut Hari Moong Dal & Green Clothes",
        quantity: "1.25 kg green moong dal",
        day: "Wednesday",
        timing: "Before sunset",
        targetRecipient: "Kinnar (transgenders) or young unmarried girls (kanya)",
        place: "Direct donation with respect",
        esotericReason: "Kinnar sakshat Budha ke prateek hain; unka ashirwad Budha ki sari peeda nasht karta hai."
      }
    ],
    avoidColours: ["Dark murky olive green (when afflicted)"],
    avoidHabits: [
      "Never lie, cheat or manipulate accounts/contracts",
      "Avoid abusive language or sharp sarcastic speech",
      "Never keep broken electronics, torn books, or cluttered desks at home"
    ],
    afflictedMitigationHinglish: [
      "Fitkari (alum) se nitya subah daant saaf karein.",
      "Taambe ke gol sikke me chhed karke behte paani me bahayein agar Budha 8 ya 12 me ho.",
      "Gaushala me gayon ko hari palak ya hara ghaas khilayein."
    ]
  },

  Jupiter: {
    id: "Jupiter",
    sanskritName: "Guru / Brihaspati",
    hindiName: "बृहस्पति देव",
    deity: "Lord Vishnu, Dakshinamoorthy, Sadguru, Brihaspati",
    direction: "North-East (ईशान कोण)",
    gender: "Male",
    nature: "Benefic",
    bodyParts: ["Liver & Gallbladder", "Pancreas & Blood Sugar", "Brain Fatty Tissues", "Ear & Hearing", "Thighs & Fat Cells"],
    karakas: ["Wisdom (Gyana)", "Dharma & Morality", "Wealth & Fortune", "Guru & Mentors", "Children (Santana)", "Higher Education & Astrology"],
    diseasesWhenAfflicted: [
      "Diabetes, insulin resistance & fatty liver disorders",
      "Obesity, jaundice, cholesterol & lipid imbalances",
      "Children delays, child suffering or generational friction",
      "Loss of wealth through bad investments, false advice or fake gurus",
      "Loss of social honor, temple disputes & spiritual crisis"
    ],
    gemstone: {
      name: "Yellow Sapphire / Pukhraj (पुखराज)",
      sanskritName: "Pushparaga",
      metal: "Pure Gold (सोना) or Brass (पीतल)",
      finger: "Right hand Index finger (तर्जनी)",
      dayToWear: "Thursday morning",
      muhurat: "Shukla Paksha Thursday in Punarvasu, Vishakha, or Purva Bhadrapada",
      strictWarning: "NEVER wear Pukhraj if Jupiter is in Capricorn (10th sign debilitated) or functional enemy/malefic, else ego will ruin wealth!"
    },
    favorableColours: ["Bright Golden Yellow", "Saffron Yellow (Kesar)", "Turmeric Gold"],
    favorableFoods: ["Chana Dal (Bengal gram)", "Besan Ladoo", "Pure Desi Cow Ghee", "Raw Turmeric (Haldi)", "Saffron (Kesar)"],
    favorableActionsHinglish: [
      "Subah mathe aur naabhi par Kesar ya Haldi ka tilak lagayein.",
      "Sadguru, santon aur shishyaon ka aadar karein; nitya dharmik granthon ka adhyayan karein.",
      "Brihaspati stotra ya Om Gram Greem Grom Sah Gurave Namah ka jaap karein.",
      "Peepal ke ped ki parikrama karein aur jal arpit karein (bina sparsh kiye).",
      "Dharma aur naitikta par adig rahein; jhuti gawahi ya be-imaani na karein."
    ],
    powerUpMantra: "Om Gram Greem Grom Sah Gurave Namah / Om Brihaspataye Namah",
    afflictedStoneWarning: "BHULKAR BHI PUKHRAJ NA PEHNE agar Guru neech ka ho ya 6, 8, 12 me ho; sthan haani kare jeeva ka prabhav badh jayega!",
    afflictedCharity: [
      {
        item: "Chana Dal, Haldi Gaanth & Yellow Cloth",
        quantity: "1.25 kg Chana Dal + 5 raw turmeric sticks + yellow cloth",
        day: "Thursday (Guruvar)",
        timing: "Sunrise to 11 AM",
        targetRecipient: "Temple Brahmin priest, aged scholar or religious teacher",
        place: "Vishnu Mandir or Gurudwara",
        esotericReason: "Guru ka daan vidya aur santan dosha ko shant karta hai."
      },
      {
        item: "Pure Desi Cow Ghee & Religious Books (Gita / Ramayana)",
        quantity: "1 kg Cow Ghee / Shrimad Bhagavad Gita",
        day: "Thursday",
        timing: "Morning",
        targetRecipient: "Temple sanctuary / Ashram library",
        place: "Dharmik sthan",
        esotericReason: "Gyana ke mandir me prakash aur pustak daan karna durbhagya ko bhagya me badalta hai."
      }
    ],
    avoidColours: ["Dull faded dirty yellow", "Gloomy grey"],
    avoidHabits: [
      "Never disrespect teachers, Gurus, father or elderly mentors",
      "Never eat non-vegetarian food or consume alcohol in North-East direction",
      "Avoid false promises or religious hypocrisy"
    ],
    afflictedMitigationHinglish: [
      "Mathe, kanth aur naabhi par roz kesar-haldi ka tilak lagayein.",
      "Peepal ped ko jal dein aur mandir me chana dal daan karein.",
      "Guru ko shant karne ke liye Vishnu Sahasranama ka niyamit path karein."
    ]
  },

  Venus: {
    id: "Venus",
    sanskritName: "Shukra",
    hindiName: "शुक्र देव",
    deity: "Goddess Lakshmi, Shukracharya",
    direction: "South-East (आग्नेय कोण)",
    gender: "Female",
    nature: "Benefic",
    bodyParts: ["Reproductive System & Semen (Shukra Dhatu)", "Kidneys & Bladder", "Skin Glow & Facial Radiance", "Throat & Eyes"],
    karakas: ["Love & Romance", "Spouse / Wife", "Luxury, Vehicles & Mansions", "Arts, Fashion & Music", "Liquidity & Cash Flow", "Refinement"],
    diseasesWhenAfflicted: [
      "Diabetes, urinary tract infections & kidney stones",
      "Infertility, hormonal depletion & reproductive complications",
      "Marital breakdown, bitter divorce & scandal",
      "Severe financial drain on vices, luxurious bankruptcies",
      "Loss of physical glow, dull rough skin & sexual exhaustion"
    ],
    gemstone: {
      name: "Natural Diamond / White Zircon / White Opal (हीरा / ओपल)",
      sanskritName: "Vajra",
      metal: "Platinum, White Gold or Pure Silver",
      finger: "Right hand Middle finger (मध्यमा) or Little finger (कनिष्ठा)",
      dayToWear: "Friday sunrise",
      muhurat: "Shukla Paksha Friday in Bharani, Purva Phalguni, or Purva Ashadha",
      strictWarning: "NEVER wear Diamond/Opal if Venus is in Virgo (6th sign debilitated) or afflicted by Ketu/Sun/Mars, else relationships will shatter!"
    },
    favorableColours: ["Sparkling Snow White", "Silk Silver Cream", "Soft Rose Pink", "Pastel Violet"],
    favorableFoods: ["Curd (Dahi)", "Rice Kheer with rock sugar (Mishri)", "White butter (Makhan)", "Sattvik sweets"],
    favorableActionsHinglish: [
      "Hamesha saaf-suthre, press kiye hue aur sugandhit (perfumed) kapde pehnein.",
      "Apni patni (wife) aur striyon ka aadar karein; patni ke khush rehne se hi Shukra meherbani karta hai.",
      "Goddess Mahalakshmi ki puja karein aur Shri Suktam ka path karein.",
      "Ghar aur bedroom ko saf-suthra aur sugandhit rakhein (Itr / sandalwood aroma).",
      "Kala, sangeet, design ya aesthetics me samay lagayein."
    ],
    powerUpMantra: "Om Shum Shukraya Namah / Om Dram Dreem Drom Sah Shukraya Namah",
    afflictedStoneWarning: "HEERA / OPAL BHULKAR BHI NA PEHNE agar Shukra 6 bhav me ho ya neech ka ho, rishte aur dhan dono barbad ho jayenge!",
    afflictedCharity: [
      {
        item: "Raw Potatoes (Aloo) & White Curd in Religious Langar",
        quantity: "6 kg Potatoes (Aloo) + 2kg White Dahi",
        day: "Friday (Shukravar)",
        timing: "Morning to afternoon",
        targetRecipient: "Temple kitchen, Gurudwara Langar, or public community kitchen",
        place: "Langar kitchen / Dharmik bhojanalaya",
        esotericReason: "Transcript formula: Shukra ki peeda ko shaant karne ke liye 6kg aloo langar me daan karna aashcharyajanak roop se dhan aur rishto ko bachaata hai."
      },
      {
        item: "Pure Camphor (Bhimseni Kapoor) & Cow Ghee",
        quantity: "250g Bhimseni Kapoor + 500g Ghee",
        day: "Friday",
        timing: "Evening",
        targetRecipient: "Lakshmi Temple / Durga Temple for daily aarti",
        place: "Devi Mandir",
        esotericReason: "Kapoor ki sugandh Shukra ke dushit aavran ko jalakar pavitra roop pradan karti hai."
      }
    ],
    avoidColours: ["Torn, dirty, unwashed, smelly clothes", "Dull unkempt appearance"],
    avoidHabits: [
      "Never disrespect wife, women or female colleagues",
      "Avoid living in cluttered, stinking or messy bedrooms",
      "Avoid extra-marital indulgence or degrading sexual conduct"
    ],
    afflictedMitigationHinglish: [
      "Langar me 6 kg aaloo daan karein Friday ke din.",
      "Bhimseni kapoor mandir me daan karein ya ghar me subah-shaam kapoor jalayein.",
      "Safed gay ko chawal aur dahi khilayein."
    ]
  },

  Saturn: {
    id: "Saturn",
    sanskritName: "Shani",
    hindiName: "शनि देव",
    deity: "Lord Shiva, Lord Hanuman, Shani Dev, Yama",
    direction: "West (पश्चिम)",
    gender: "Neutral / Male",
    nature: "Malefic",
    bodyParts: ["Bones & Joints", "Knees & Legs", "Teeth", "Nerves & Vata Dosha", "Sciatica & Hair"],
    karakas: ["Karma & Profession", "Discipline & Hard Work", "Patience & Longevity", "Laborers, Servants & Blue-collar Workers", "Iron, Mines & Oil", "Justice"],
    diseasesWhenAfflicted: [
      "Chronic joint pain, arthritis, rheumatism & knee degradation",
      "Paralysis, stroke, sciatica & severe neurological stiffness",
      "Chronic career stagnation, sudden firing & labor unrest",
      "Vata gas build-up, severe constipation & chronic fatigue",
      "Deep melancholia, social isolation & long-drawn legal court battles"
    ],
    gemstone: {
      name: "Blue Sapphire / Neelam (नीलम)",
      sanskritName: "Neelam",
      metal: "Pure Iron (लोहा), Panchadhatu, or Silver (चांदी)",
      finger: "Right hand Middle finger (मध्यमा)",
      dayToWear: "Saturday evening",
      muhurat: "Shukla Paksha Saturday in Pushya, Anuradha, or Uttarabhadrapada",
      strictWarning: "DANGER! ONLY wear Neelam after 3-day trial and ONLY if Saturn is Yogakaraka (e.g. Taurus/Libra Lagna). NEVER if afflicted!"
    },
    favorableColours: ["Royal Navy Blue", "Charcoal Black", "Deep Slate Blue"],
    favorableFoods: ["Black Sesame (Kala Til)", "Urad Dal (Black gram)", "Mustard Greens (Sarson ka Saag)", "Almonds"],
    favorableActionsHinglish: [
      "Neeche kaam karne wale workers, sweepers, drivers aur laborers ko izzat aur samay par paisa dein.",
      "Nitya Hanuman Chalisa ya Shani Chalisa ka path karein.",
      "Apne jeevan me kada anushasan, samay ki pabandi aur kadi mehnat layein.",
      "Shanivar ko sarson ke tel ka deepak peepal ped ke niche jalayein.",
      "Kanoon aur nyay ke viruddh kabhi koi kaam na karein."
    ],
    powerUpMantra: "Om Sham Shanaischaraya Namah / Om Pram Preem Prom Sah Shanaischaraya Namah",
    afflictedStoneWarning: "NEELAM BHULKAR BHI NA PEHNE! Peedit Shani par Neelam pehanna shareer me paralysis, dhar-pakad aur barbaadi laa sakta hai!",
    afflictedCharity: [
      {
        item: "Sarson ka Tel (Mustard Oil) Chhaya Daan",
        quantity: "1 steel/iron bowl with mustard oil (chehra dekh kar daan karein)",
        day: "Saturday (Shanivar)",
        timing: "Evening sunset",
        targetRecipient: "Shani temple Dakaut or poor disabled worker",
        place: "Shani temple or roadside beggar",
        esotericReason: "Sarson ke tel me apna chehra dekh kar chhaya daan karne se Shani ki dhar shant hoti hai."
      },
      {
        item: "Iron Tawa / Chimta / Black Blanket",
        quantity: "1 iron cooking tawa or warm black blanket",
        day: "Saturday",
        timing: "Evening",
        targetRecipient: "Needy homeless person, road sweeper or leper",
        place: "Kushtha ashram or outdoor street",
        esotericReason: "Loha aur kala kambal Shani ke aakramak klesh ko shoshit karke shanti pradan karta hai."
      }
    ],
    avoidColours: ["Dirty ragged grey", "Unwashed faded black"],
    avoidHabits: [
      "Never delay payments or insult laborers, servants, or sweepers",
      "Never consume alcohol or meat on Saturdays",
      "Avoid procrastination, deceit, laziness, or breaking the law"
    ],
    afflictedMitigationHinglish: [
      "Sarson ke tel ka chhaya daan karein Saturday shaam ko.",
      "Safai karamchari (sweepers) ko thoda paisa ya khana aadar se dein.",
      "Kutte (especially black dogs) ko roti par sarson ka tel lagakar khilayein."
    ]
  },

  Rahu: {
    id: "Rahu",
    sanskritName: "Rahu",
    hindiName: "राहु देव",
    deity: "Goddess Durga, Lord Bhairava, Lord Shiva",
    direction: "South-West (नैऋत्य कोण)",
    gender: "Neutral / Male",
    nature: "Malefic",
    bodyParts: ["Central Nervous Impulses", "Breathing & Lungs", "Hidden Phobias", "Intestines", "Skin Pores"],
    karakas: ["Foreign Lands & Travel", "Technology, AI & Internet", "Mass Media & Viral Fame", "Unconventional Wealth & Speculation", "Illusion (Maya)", "Sudden Gambles"],
    diseasesWhenAfflicted: [
      "Mysterious undiagnosable diseases, phantom pains & chronic fears",
      "Hallucinations, paranoia, sleep paralysis & dark phobias",
      "Sudden catastrophic financial crash through scams, crypto & gambling",
      "Toxic addictions (smoking, drugs, alcohol, screen dopamine)",
      "Police FIR, defamation scandals, venomous bites & poison"
    ],
    gemstone: {
      name: "Hessonite Garnet / Gomed (गोमेद)",
      sanskritName: "Gomedaka",
      metal: "Silver (चांदी) or Ashtadhatu",
      finger: "Right hand Middle finger (मध्यमा)",
      dayToWear: "Saturday or Wednesday evening (midnight)",
      muhurat: "Shukla Paksha Saturday in Ardra, Swati, or Shatabhisha",
      strictWarning: "NEVER wear Gomed if Rahu is in 1, 5, 8, 9, 12 or creating severe mental delusions, else paranoia peaks!"
    },
    favorableColours: ["Electric Smoky Grey", "Midnight Navy Blue", "Charcoal Steel"],
    favorableFoods: ["Barley (Jau)", "Coconut water", "Rock salt (Sendha Namak)", "Light sattvik soups"],
    favorableActionsHinglish: [
      "Cutting-edge technology, AI, coding, research ya global export-import me focus karein.",
      "Durga Saptashati ya Argala Stotra ka niyamit path karein.",
      "Bhairav chalisa ya Om Bhram Bhreem Bhrom Sah Rahave Namah ka jaap karein.",
      "Ghar ke South-West zone ko saaf, bhari aur clutter-free rakhein.",
      "Nasha aur gambling se 100% door rahein."
    ],
    powerUpMantra: "Om Bhram Bhreem Bhrom Sah Rahave Namah / Om Rahave Namah",
    afflictedStoneWarning: "BHULKAR BHI GOMED NA PEHNE agar Rahu dushit ho; dimaag me bhram, police case aur aatm-hatya ke vichar laa sakta hai!",
    afflictedCharity: [
      {
        item: "Raw Charcoal (Koyla) / Barley (Jau) / Radish (Mooli)",
        quantity: "4 kg Raw coal or 1 kg Jau (Barley)",
        day: "Saturday or Wednesday",
        timing: "Sunset or nightfall",
        targetRecipient: "Flowing clean river (Jal Pravah) or Sweeper",
        place: "Behta jal / Safai karamchari",
        esotericReason: "Koyla aur Jau Rahu ke vish aur dhuen ko behte jal me vileen karte hain."
      },
      {
        item: "Cigarette Box appeasement formula (Transcript Master Secret)",
        quantity: "1 sealed cigarette box",
        day: "Saturday evening",
        timing: "After sunset",
        targetRecipient: "A poor manual road-sweeper / safai karamchari (who smokes)",
        place: "Direct hand to hand outside house",
        esotericReason: "Transcript secret: Safai karamchari ko cigarette box dekar usme se ek cigarette nikal kar unhe aadar se sulga kar dena Rahu ke dhuen ki aahuti banker native ke dhuen aur shrap ko turant baha deta hai."
      }
    ],
    avoidColours: ["Smoky blue or navy blue clothes (when afflicted)", "Dirty patched synthetic clothes"],
    avoidHabits: [
      "Never sleep in the South-West master bedroom if Rahu is afflicted in transit/dasha!",
      "Completely avoid smoking, weed, vaping, and excess tea/coffee",
      "Never hoard broken electronic junk, obsolete wires, or non-functional remotes"
    ],
    afflictedMitigationHinglish: [
      "Ghar ka farsh khud jhadoo lagakar saaf karein; safai karne se Rahu shant hota hai.",
      "South-West kon me sona band karein agar Rahu peeda de raha ho.",
      "Kachha koyla (raw coal) behte paani me jal-pravah karein."
    ]
  },

  Ketu: {
    id: "Ketu",
    sanskritName: "Ketu",
    hindiName: "केतु देव",
    deity: "Lord Ganesha, Lord Matsya, Lord Shiva",
    direction: "North-East / Vertical Upward (शिखर)",
    gender: "Neutral / Male",
    nature: "Malefic",
    bodyParts: ["Spine & Nervous Core", "Feet & Soles", "Hair Roots", "Anus & Rectum", "Intuitive Third Eye"],
    karakas: ["Moksha & Spiritual Detachment", "Flag of Victory & Higher Status (Jhanda)", "Occult Sciences & Astrology", "Surgery & Stitching", "Research & Deep Mathematics", "Maternal Grandfather"],
    diseasesWhenAfflicted: [
      "Chronic undiagnosable fungal infections, boils & carbuncles",
      "Spinal disc herniation, backache & foot/leg numbness",
      "Sudden detachment, apathy, career renunciation & existential crisis",
      "Surgical amputations, severe stitches & sharp instrument wounds",
      "Dog bites, animal poisoning & urinary incontinence"
    ],
    gemstone: {
      name: "Cat's Eye / Lehsunia / Vaidurya (लहसुनिया)",
      sanskritName: "Vaidurya",
      metal: "Silver (चांदी) or Ashtadhatu",
      finger: "Right hand Middle finger (मध्यमा) or Little finger (कनिष्ठा)",
      dayToWear: "Thursday or Tuesday evening",
      muhurat: "Shukla Paksha Thursday in Ashwini, Magha, or Mula",
      strictWarning: "NEVER wear Lehsunia if Ketu is causing emotional isolation, cutting off relationships, or in 7th/8th house!"
    },
    favorableColours: ["Earthy Brown", "Checkered / Variegated Multi-colour", "Golden Sand"],
    favorableFoods: ["Bananas (Pake Kela)", "Sesame seeds (Til)", "Kulthi Dal (Horsegram)"],
    favorableActionsHinglish: [
      "Bhagwan Ganesha ki nitya aarti karein aur Sankata Nashana Ganesha Stotra padhein.",
      "Ketu ke shaktishali channels ko apne jeevan me apnaayein: Stitching (silayi), Gardening (bagwani), Yoga, Meditation, ya Astrology.",
      "Mandir ke shikhar par dhwaja (flag) lagayein ya lagwayein.",
      "Street dogs (aawara kutton) ko nitya roti ya biscuit khilayein.",
      "Dharma aur vairagya ka aadar karein."
    ],
    powerUpMantra: "Om Kem Ketave Namah / Om Sram Sreem Srom Sah Ketave Namah",
    afflictedStoneWarning: "LEHSUNIA (CAT'S EYE) BHULKAR BHI NA PEHNE agar Ketu peedit ho; yah poori grihasthi aur paise ko kaat kar alag kar dega!",
    afflictedCharity: [
      {
        item: "7 Ripe Bananas to Lord Ganesha (The Transcript Miracle Formula)",
        quantity: "7 Ripe Yellow Bananas (सात पके केले)",
        day: "Tuesday or Thursday (or any day during emergency crisis)",
        timing: "Morning sunrise or before noon",
        targetRecipient: "Lord Ganesha Sanctuary in temple",
        place: "Ganesha Temple",
        esotericReason: "Transcript verbatim formula: '7 bananas lene hain aur Ganesh ji ko arpit kar do, chamatkari upay hai, 1 ghante me result aate hain!' Ketu ke klesh ko Ganesha turant har lete hain."
      },
      {
        item: "Black & White Blanket (Do-ranga Kambal)",
        quantity: "1 Black & White checkered woolen blanket",
        day: "Tuesday or Saturday",
        timing: "Sunset to evening",
        targetRecipient: "Temple priest or poor sadhu / homeless person",
        place: "Temple or outdoors",
        esotericReason: "Do-ranga kambal Ketu ke shani-mangal mishrit krodh ko shaant karta hai."
      }
    ],
    avoidColours: ["Excessive dull brown when depressed", "Dirty motley fabrics"],
    avoidHabits: [
      "VERBATIM STRICT WARNING: Never consume excessive sour foods (Khatti cheezein jaise Nimboo aur Imli) when Ketu is afflicted! 'Nimboo aur imli totally Ketu hai.'",
      "Avoid cutting ties in hasty emotional cynicism",
      "Never harm or kick street dogs"
    ],
    afflictedMitigationHinglish: [
      "7 ripe bananas Ganesha mandir me arpit karein (1 ghante me raahat milti hai).",
      "Khatti cheezein (Nimboo, Imli, Khattai) khana turant band karein.",
      "Ghar me silayi (stitching), gardening, yoga ya astrology seekhna shuru karein taaki Ketu ki energy creative route pakad le."
    ]
  }
};

/**
 * Evaluates whether a planet in a native's chart is functionally Favorable (Power-Up)
 * or Afflicted (Mitigate / Charity / Avoid Gemstone).
 */
export interface EvaluatedCorePlanetRemedy {
  planet: PlanetId;
  placementSummary: string;
  isFavorable: boolean;
  recommendationType: "PowerUp_Gemstone_Favorable" | "Mitigate_Charity_Afflicted";
  primaryHeadline: string;
  descriptiveNarrativeHinglish: string;
  gemstoneAdvice: {
    canWearStone: boolean;
    stoneDetails?: PlanetGemstoneConfig;
    strictWarning: string;
  };
  elementalDisposalRule: HouseTrikonaRule;
  charityFormulas: PlanetCharityItem[];
  coloursToWear: string[];
  coloursToAvoid: string[];
  foodsToAdopt: string[];
  habitsToAdoptHinglish: string[];
  habitsToAvoidHinglish: string[];
}

export function evaluateCorePlanetRemedy(
  planetName: string,
  chart: ChartData | null | undefined
): EvaluatedCorePlanetRemedy | null {
  if (!chart || !chart.planets) return null;
  const pName = (planetName.charAt(0).toUpperCase() + planetName.slice(1).toLowerCase()) as PlanetId;
  const def = MASTER_PLANET_REGISTRY[pName];
  if (!def) return null;

  const pData: PlanetData | undefined = chart.planets[pName];
  const house = pData?.house || 1;
  const sign = pData?.sign || "Aries";
  const dignity = pData?.dignity?.toLowerCase() || "";

  // Elemental Disposal Vehicle based on house trikona
  const elementalRule = resolveHouseTrikonaRemedy(pName, house);

  // Strength / Affliction Assessment Logic
  const isDushtana = [6, 8, 12].includes(house);
  const isDebilitated = dignity.includes("debilitat");
  const isExalted = dignity.includes("exalt");
  const isOwn = dignity.includes("own") || dignity.includes("moolatrikona");
  const isKendraTrikona = [1, 4, 5, 7, 9, 10, 11].includes(house);

  // A planet is Favorable if:
  // 1. Not in 6, 8, 12
  // 2. Not debilitated
  // 3. In Kendra/Trikona or 11th, or exalted/own
  const isFavorable = !isDushtana && !isDebilitated && (isKendraTrikona || isExalted || isOwn);

  if (isFavorable) {
    return {
      planet: pName,
      placementSummary: `${def.hindiName} aapki kundli me ${house}th bhav (${sign}) me shubh sthiti me virajman hain.`,
      isFavorable: true,
      recommendationType: "PowerUp_Gemstone_Favorable",
      primaryHeadline: `✦ ${def.hindiName} Shubh Hain: Is Grah Ki Urja Ko Power-Up Karein!`,
      descriptiveNarrativeHinglish: `Aapki kundli me ${def.hindiName} bahut achhe aur shubh bhav (${house}th bhav) me sthit hain. Inke upar dushit drishti ya 6/8/12 ka dosha nahi hai. Aise shubh grah ko hamesha 'Power-Up' kiya jaata hai taaki inki dasha aane par aapko aparaadhit safalta, status, samman aur dhan ki praapti ho sake. Aap inka ratna shubh muhurat me dharan kar sakte hain aur inke shubh rang v bhojan ko nitya aahar me shaamil karein.`,
      gemstoneAdvice: {
        canWearStone: true,
        stoneDetails: def.gemstone,
        strictWarning: `Ratna nirdharit ungli (${def.gemstone.finger}) aur dhaatu (${def.gemstone.metal}) me shukla paksha ke ${def.gemstone.dayToWear} ko hi dharan karein.`
      },
      elementalDisposalRule: elementalRule,
      charityFormulas: [],
      coloursToWear: def.favorableColours,
      coloursToAvoid: def.avoidColours,
      foodsToAdopt: def.favorableFoods,
      habitsToAdoptHinglish: def.favorableActionsHinglish,
      habitsToAvoidHinglish: def.avoidHabits
    };
  } else {
    // Afflicted logic
    const reasonAfflicted = isDebilitated
      ? "apni neech rashi me virajman hain"
      : isDushtana
      ? `trik bhav (${house}th bhav - dukh/vyaya/roga sthan) me sthit hain`
      : "kleshkarak shani/rahu/ketu ke prabhav me hain";

    return {
      planet: pName,
      placementSummary: `${def.hindiName} aapki kundli me ${house}th bhav (${sign}) me ${reasonAfflicted}.`,
      isFavorable: false,
      recommendationType: "Mitigate_Charity_Afflicted",
      primaryHeadline: `⚠️ ${def.hindiName} Peedit Hain: Bhulkar Bhi Ratna Na Pehnein (Keval Daan v Upay Karein)!`,
      descriptiveNarrativeHinglish: `Kyunki ${def.hindiName} aapki kundli me ${reasonAfflicted}, is grah ko taqat (stone) dena aag me ghee daalne jaisa hoga! Master transcript ka spashtha niyam hai: jab koi grah dushit ho to uska ratna kabhi nahi dharan karna chahiye. Iski jagah, is grah ke dushit karmic aavran ko shaant karne ke liye nirdharit daan, beej mantra, aur tattva ke anusaar upay (${elementalRule.actionTitleHinglish}) karein.`,
      gemstoneAdvice: {
        canWearStone: false,
        strictWarning: def.afflictedStoneWarning
      },
      elementalDisposalRule: elementalRule,
      charityFormulas: def.afflictedCharity,
      coloursToWear: [],
      coloursToAvoid: def.avoidColours,
      foodsToAdopt: [],
      habitsToAdoptHinglish: def.afflictedMitigationHinglish,
      habitsToAvoidHinglish: def.avoidHabits
    };
  }
}

/**
 * Moon Psychological Heart-Sharing Sanctuary Map (Houses 1 to 12)
 * Discloses where the native must share their inner vulnerabilities and deep emotions
 * to avoid depressive sinks and psychic anxiety.
 */
export interface MoonSharingGuidance {
  moonHouse: number;
  sign: string;
  confidantTitleHinglish: string;
  narrativeHinglish: string;
  safePracticesHinglish: string[];
  warningHinglish: string;
}

export const MOON_HOUSE_SHARING_MAP: Record<number, { title: string; story: string; safe: string[]; warning: string }> = {
  1: {
    title: "Swam Se Samvaad & Diary Lekhan (Self-Reflection)",
    story: "Chandra Lagna me baitha hai to aapka man seedha aapki aatma aur tan se juda hai. Har kisi ke saamne dil kholne se log aapka fayda uthate hain. Aapko apne dil ki baatein swam se karni chahiye, journal ya diary me likhna chahiye, ya dhyan me baithkar Ishwar ko batana chahiye.",
    safe: ["Nitya diary ya personal journal likhein", "Pranayama aur aatmasamvaad karein", "Kewal atyant vishwaspatra vyakti se hi bolein"],
    warning: "Bheed me ya social media par apni bhavnayein vyakt na karein; log aapko emotionally exploit karenge."
  },
  2: {
    title: "Kutumb, Parivar & Mata-Pita (Family Clan)",
    story: "Chandra doosre bhav me hai to aapki bhavnao ka aashray aapka parivar aur kutumb hai. Jab bhi man me pareshani ho, apne parivar ke buzurg ya vishwaspatra sadasyo ke saath baithkar bhojan karein aur dil halka karein.",
    safe: ["Parivar ke saath milkar shuddh bhojan karein", "Kutumb ke buzurg se salah lein", "Tijori ya dhan ke paas shanti se baithein"],
    warning: "Bahar ke anjaan logo se aarthik ya parivarik dukh baantna parivar me kalah la sakta hai."
  },
  3: {
    title: "Chhote Bhai-Behen, Sahkarmik ya Lekhan (Siblings & Writing)",
    story: "Chandra teesre bhav me hai to aapki manovrittiyan aapke parakram, lekhani aur sahpaathiyo se judi hain. Dil ki baat apne chhote bhai-behen, bachpan ke dosto ya lekhani (writing/blogging/creative work) ke madhyam se bahar nikalein.",
    safe: ["Chhote bhai-behen se dil ki baat karein", "Apne vicharon ko kavita ya lekh me utarein", "Chhoti yaatraon par niklein"],
    warning: "Padosiyo ya chugalkhor dosto se secret share na karein."
  },
  4: {
    title: "Mata Ji & Ghar Ka Antah-Karan (Mother & Home Sanctuary)",
    story: "Chandra chauthe bhav me sakshat apni digbali sthiti me hota hai. Aapki saari man ki shanti aapki Mata Ji ke aashirwad aur ghar ke aangan me basi hai. Jab bhi udasi ghere, Mata Ji ki godi me sar rakhkar baatein karein ya ghar me Shiva strotra sunein.",
    safe: ["Mata ji ke pair dabayein aur unse har baat share karein", "Ghar me saaf kamre me baithkar sheetal jal piyein", "Ghar me phool-paudhe lagayein"],
    warning: "Ghar se door jaakar anjaan logo par andhavishwas na karein."
  },
  5: {
    title: "Santan, Prem-Patra ya Ishta Devata (Children, Lover & Deity)",
    story: "Chandra paanchve bhav me hai to aapka dil rachnatmakta, santan aur prem se dharakta hai. Apne dil ka bojh ya to apni santan ke saath khelkar, apne prem-patra ke aage nishkapat hokar, ya apne Ishta Devata ke aage aarti gaakar utarein.",
    safe: ["Bacchon ke saath nishkapat baatein karein", "Creative painting, music ya mantra japa karein", "Ishta devata ko sakha maan kar prarthana karein"],
    warning: "Aise logo se prem ki umeed na karein jo aapki bhavnao ka mazaak banayein."
  },
  6: {
    title: "Chikitsak, Sevak ya Mama Ji (Doctor, Mentor & Caregiver)",
    story: "Chandra chhathe bhav me rog aur seva ke sthan me hai. Yahan dil ki baat har kisi ko batane par log aapko kamzor samjhenge. Apni chintaon ko kisi vishwaspatra Doctor, therapist, Mama ji ya sevadar se vyakt karein aur nitya roop se beemar logo ki seva karein.",
    safe: ["Professional therapist ya vaidya se salah lein", "Gaushala ya aspatal me nishkam seva karein", "Dainik dincharya ko anushasit rakhein"],
    warning: "Office ke colleagues ya shatruo ke aage ro kar kamzori na dikhayein."
  },
  7: {
    title: "Jeevan-Saathi ya Karobari Partner (Spouse & Legal Partner)",
    story: "Chandra saatve bhav me hai to aapke dil ki chaabi aapke Jeevan Saathi (Husband/Wife) ke haath me hai. Agar aap apne patni/pati se baat chhupayenge to man me klesh aur dushwapna badhenge. Saathi ke aage dil kholna hi aapka sabse bada upchar hai.",
    safe: ["Patni/Pati se bina kisi parde ke sab kuch share karein", "Shaam ko saathi ke saath shaant jagah ghumne jayein", "Business partner se transparency rakhein"],
    warning: "Saathi ko chhodkar teesre vyakti ke aage dampty life ki burai kabhi na karein."
  },
  8: {
    title: "Adhyatmik Guru, Tantra Margdarshak ya Secret Diary (Occult Confidant)",
    story: "Chandra aathve bhav me gehre rahasya aur aakasmik chintaon ka shrot banta hai. Yahan baitha Chandra aam duniya se samajh nahi aata. Apne dil ka klesh kisi Siddha Guru, adhyatmik margdarshak, ya poori tarah confidential diary me utarein.",
    safe: ["Apne Deeksha Guru se guidance lein", "Astrology aur gudh vidya ka adhyayan karein", "Maha Mrityunjaya mantra ka jaap karein"],
    warning: "Samajik circle me apni gupt baatein kabhi na batayein; aathva chandra vishwasghaat karwa sakta hai."
  },
  9: {
    title: "Guru, Pita, Mandir ke Pujari ya Teerth Yatra (Dharma Preceptor)",
    story: "Chandra navam bhav me bhagya aur dharma sthan me hai. Aapka man dharmik satsang, pita ke aashirwad aur kisi gyaani mahatma ki vani se shaant hota hai. Mandir me baithkar ya Teerth yatra karke sadhu-santo se gyan charcha karein.",
    safe: ["Pita aur Guru ke nitya ashirwad lein", "Dharmik sthano aur mandiro me samay bitayein", "Gita ya Upanishad ka path karein"],
    warning: "Pakhandi ya dharma-bhrasht logo ki sangati me na padein."
  },
  10: {
    title: "Karyakshetra ke Mentor, Pita ya Samajik Seva (Career Mentor & Father)",
    story: "Chandra dasve bhav me karm aur prathistha ke kshetra me hai. Aapka man aapke kaam aur samman se banta-bigadta hai. Dil ki baatein apne career mentor, boss (agar sahanubhuti-poorna ho), ya pita ji se share karein aur apne kaam ko poore man se karein.",
    safe: ["Career mentor se nishpaksh salah lein", "Apne karma ko poori imandari se samarpit karein", "Pita ji se career par khulkar baat karein"],
    warning: "Workplace par over-emotional hokar sabke saamne ro padna aapki authority ko chot pahunchata hai."
  },
  11: {
    title: "Bade Bhai-Behen, Sacche Mitra & Network (Elder Siblings & Loyal Friends)",
    story: "Chandra gyarahve bhav me labh aur mitrata ke sthan me hai. Aapka dukh tab halka hota hai jab aap apne bade bhai/behen ya kisi vishwaaspatra, nishkapat jigri dost ke saath baithte hain. Aise dosto se baatcheet aapka tanaav mita deti hai.",
    safe: ["Bade bhai ya didi se salah lein", "Nishkapat purane jigri dost se dil khol kar baat karein", "Samuhik kalyankari mandali me shamil hon"],
    warning: "Faayde ke liye bane 'party friends' ke aage apni vulnerability na rakhein."
  },
  12: {
    title: "Ishta Devata, Ekant Dhyan & Nadi Kinaara (Solitude & Divine Meditation)",
    story: "Chandra barahve bhav me moksha aur sannyas bhav me hai. Sansar ka koi bhi insaan aapke dil ko poori tarah nahi samajh sakta! Aapko apne dil ka haal kewal aur kewal Bhagwan Shiva / apne Ishta ke charano me ekant me baithkar kehna chahiye. Ekant dhyan hi aapka ashirwad hai.",
    safe: ["Raat ko ekant me baithkar dhyan karein", "Mandir ya behti nadi ke kinaare shaant baithein", "Videsh ya dur-daraj sthano ki yatra karein"],
    warning: "Sansari logo se empathy ki bhikh na maangein; 12th Chandra kewal Ishwar se judkar shaanti pata hai."
  }
};

export function getMoonSharingGuide(moonHouse: number, sign: string = "Cancer"): MoonSharingGuidance {
  const normHouse = ((moonHouse - 1) % 12) + 1;
  const data = MOON_HOUSE_SHARING_MAP[normHouse] || MOON_HOUSE_SHARING_MAP[1];
  return {
    moonHouse: normHouse,
    sign,
    confidantTitleHinglish: data.title,
    narrativeHinglish: data.story,
    safePracticesHinglish: data.safe,
    warningHinglish: data.warning
  };
}

/**
 * Multi-Planet Conjunction Treatment Resolver
 * Transcript principle: When two or more planets sit in the same house:
 * - If a Malefic conjuncts a Benefic (e.g. Saturn + Venus, Sun + Mercury, Rahu + Venus),
 *   treat the malefic (charity/mitigation) to liberate the benefic's fruit!
 * - Never wear the stone of the malefic in that combination.
 */
export interface ConjunctionAnalysisResult {
  houseNumber: number;
  planets: string[];
  primaryTreatmentTarget: string;
  remedyActionTitle: string;
  narrativeHinglish: string;
  strictWarning: string;
}

export function evaluateConjunctionInHouse(
  houseNumber: number,
  planetsInHouse: string[]
): ConjunctionAnalysisResult | null {
  if (planetsInHouse.length < 2) return null;

  const names = planetsInHouse.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
  const hasRahu = names.includes("Rahu");
  const hasKetu = names.includes("Ketu");
  const hasSaturn = names.includes("Saturn");
  const hasMars = names.includes("Mars");
  const hasSun = names.includes("Sun");
  const hasVenus = names.includes("Venus");
  const hasJupiter = names.includes("Jupiter");
  const hasMercury = names.includes("Mercury");
  const hasMoon = names.includes("Moon");

  // Specific Transcript Combos:
  if (hasVenus && hasRahu) {
    return {
      houseNumber,
      planets: names,
      primaryTreatmentTarget: "Rahu",
      remedyActionTitle: "Venus-Rahu Dhan & Maya Conjunction (Keval Rahu Shaant Karein)",
      narrativeHinglish: "Venus aur Rahu ka yog aparamparik dhan aur multi-millionaire banne ki taqat rakhta hai, lekin Rahu agar haavi ho gaya to rishto aur lakshmi me bhram paida karega. Yahan Shukra ka stone pehanna risky hai jab tak Rahu ko shaant na kiya jaye. Rahu ka koyla/jau daan karein taaki Venus ka shuddh aishwarya khul sake.",
      strictWarning: "Rahu ka stone Gomed na pehnein jab tak business me international scale confirm na ho."
    };
  }

  if (hasSaturn && hasKetu) {
    return {
      houseNumber,
      planets: names,
      primaryTreatmentTarget: "Ketu",
      remedyActionTitle: "Saturn-Ketu Profession Cut Yog (Ketu Ko Creative Route Dein)",
      narrativeHinglish: "Ketu jahan baithta hai vahan se detach karta hai; Shani kriya v karm hai. Shani-Ketu ka yog career me achanak virakti ya cut lagata hai. Iska sabse best upay transcript me bataya gaya hai: Ketu ko align karein (silayi, gardening, yoga, astrology, research). Ketu ko 7 kele Ganesh ji ko chadhayein taaki Shani ka profession secure rahe.",
      strictWarning: "Achanak naukri ya vyapaar bina doosra vikalp chune na chhodein."
    };
  }

  if (hasJupiter && hasKetu) {
    return {
      houseNumber,
      planets: names,
      primaryTreatmentTarget: "Both (Auspicious Synthesis)",
      remedyActionTitle: "Jupiter-Ketu Param Adhyatma Yog (Divinity & Wisdom)",
      narrativeHinglish: "Transcript verbatim: 'Jupiter aur Ketu ka combination bahut achha maana gaya hai; isme aapko adhyatma aur gudh gyan ki praapti hoti hai, aap super-religious aur gyani ban jaate hain.' Dono grah milkar teesra netra kholte hain. Is yog me sadhu-sant seva aur dharmik granthon ka adhyayan karein.",
      strictWarning: "Apne adhyatmik gyan par ahankar na karein."
    };
  }

  if (hasSun && hasSaturn) {
    return {
      houseNumber,
      planets: names,
      primaryTreatmentTarget: "Saturn",
      remedyActionTitle: "Surya-Shani Pita-Putra Sangharsh (Shani Daan Se Surya Ko Bachayein)",
      narrativeHinglish: "Surya aag aur atmasamman hai, Shani andhakar aur shram hai. Dono aamne-saamne ya saath hone par pita-putra klesh aur sarkari badha aati hai. Yahan Shani ka sarson tel chhaya daan karein aur Surya ko taambe ke lote se jal dein. Pita ji ke charan sparsh karein.",
      strictWarning: "Pita ya authorities se krodh me takraav na karein."
    };
  }

  if (hasMoon && (hasRahu || hasKetu || hasSaturn)) {
    const malefic = hasRahu ? "Rahu" : hasKetu ? "Ketu" : "Saturn";
    return {
      houseNumber,
      planets: names,
      primaryTreatmentTarget: malefic,
      remedyActionTitle: `Moon-${malefic} Grahan & Vish Yog (Keval ${malefic} Shaant Karein, Moti Na Pehnein)`,
      narrativeHinglish: `Chandra par ${malefic} ka prabhav man me vish, sleeplessness aur anjaana dar paida karta hai. Moti (Pearl) bhulkar bhi na pehnein kyunki vo is vishad ko fix kar dega! Keval ${malefic} ki samagri ka daan ya jal pravah karein aur Bhagwan Shiva ka doodh-jal se abhishek karein.`,
      strictWarning: "Moti ratna bilkul na pehnein; kewal Shiva aradhana aur chandi ka tukda pocket me rakhein."
    };
  }

  // Generic malefic-benefic conjunction
  const malefic = names.find((n) => ["Saturn", "Rahu", "Ketu", "Mars"].includes(n)) || names[0];
  return {
    houseNumber,
    planets: names,
    primaryTreatmentTarget: malefic,
    remedyActionTitle: `${names.join(" + ")} Conjunction in House ${houseNumber}`,
    narrativeHinglish: `Is bhav me ek se adhik grah virajman hain. Classical aur transcript niyam ke anusar, pehle kleshkarak grah (${malefic}) ka daan v shanti karke bhav ke prabhav ko nirmal kiya jata hai, taaki shubh grahon ki urja mukt ho sake.`,
    strictWarning: "Dono grahon ka ek saath ratna na dharan karein bina nakshtra v sub-lord check kiye."
  };
}
