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
      "Surya 7th House Aspect Rule: Surya 3rd house me baithkar 9th house ko dekhta hai to advisory/teaching me vishva-prasiddhi deta hai; 10th me baithkar 4th ko dekhta hai to swadesh aur jan-samarthan me kirti deta hai.",
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
        item: "Mars Triangle Copper Piece Potli (तांबे का तिकोना टुकड़ा Upay)",
        quantity: "1 kg Lal Masoor Dal + Sabut Lal Mirch + Pure Triangle Copper Piece (तांबे का तिकोना टुकड़ा) + Lal Sindoor + Shuddh Shehad (Honey) in Red Cloth",
        day: "Tuesday (Mangalvar)",
        timing: "Morning to afternoon",
        targetRecipient: "Disposal vehicle according to house element (Tattva Trikona)",
        place: "Fire: Mandir/Bhatti | Earth: Zameen me dabayein | Air: Peepal par taangein | Water: Behta jal",
        esotericReason: "Transcript verbatim formula: Taambe ka tikona piece, sabut lal mirch, masoor daal aur shehad ko laal kapde me baandh kar trikona ke anusaar sthapit/pravahit karne se Mangal ka bhandaar shant ho jata hai aur property v police disputes khatam hote hain."
      },
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
      "Mars Potli Upay: 1kg lal masoor dal + sabut lal mirch + taambe ka tikona tukda + sindoor + shehad lal kapde me bandhkar bhav ke tatva (Agni/Prithvi/Vayu/Jal) ke anusaar dispose karein.",
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
        item: "Parrot Seva & Forest Release (तोता सेवा v मुक्ति Upay)",
        quantity: "1 green parrot fed for 7 days then released into wild forest",
        day: "Wednesday to Wednesday",
        timing: "Wednesday morning purchase -> 7 days feed (green guava & red chilli) -> next Wednesday morning release",
        targetRecipient: "Dense green forest / open sky canopy",
        place: "Dense forest or large sanctuary canopy",
        esotericReason: "Transcript verbatim formula: 'Budhwar ko tota layein, 7 din hari mirch aur amrood khilayein, agle Budhwar jungle me azaad karein' — trading, vyapaar aur dimaag ke saare bandhan 100% khul jaate hain."
      },
      {
        item: "Kinnar Seva with Agra Petha & Green Dress",
        quantity: "1 Green dress/suit + 1 kg Green Agra Petha sweet + ₹500 dakshina",
        day: "Wednesday",
        timing: "Daytime before sunset",
        targetRecipient: "Kinnar (transgenders)",
        place: "Direct donation with humble folded hands",
        esotericReason: "Transcript secret: Kinnar Budha ke sakshat prateek hain; unko hara petha aur vastra dekar ashirwad lena Budh ke klesh ko shubh gyan aur dhan me badalta hai."
      },
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
      "Bird Feeding Test (चिड़ियों को दाना Secret): Peedit Budh me chidiya 7-10 din tak daana nahi chhooegi; nitya daana daalte rahein, 10-12 din me jaise hi khana shuru karegi, Budh ka klesh hat jayega.",
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
      "Nose Wisdom Connection: 'Jupiter is your nose' — naak ko roz subah shuddh taaze paani se saaf karein; badi naak gehre gyaan ka prateek hai.",
      "Sthan Hani Kare Jiva Rule: Jupiter shuru ke 1-2 saal klesh aur pariksha leta hai, purane galat tareeqon ko saaf karwata hai (Tehsildar case study), phir 1-2 saal baad sab kuch 100% shuddh sona bana deta hai. 100% purity, zero bribes, zero shortcuts.",
      "Jupiter + Rahu Combination: Online guru, internet se gyaan lena aur prasaar karna, ek shabd pakad kar poori pustak likh dene ki kshamta.",
      "Subah mathe aur naabhi par Kesar ya Haldi ka tilak lagayein.",
      "Sadguru, santon aur shishyaon ka aadar karein; nitya dharmik granthon ka adhyayan karein.",
      "Brihaspati stotra ya Om Gram Greem Grom Sah Gurave Namah ka jaap karein.",
      "Peepal ke ped ki parikrama karein aur jal arpit karein (bina sparsh kiye).",
      "Dharma aur naitikta par adig rahein; jhuti gawahi ya be-imaani na karein."
    ],
    powerUpMantra: "Om Gram Greem Grom Sah Gurave Namah / Om Brihaspataye Namah",
    afflictedStoneWarning: "BHULKAR BHI PUKHRAJ NA PEHNE agar Guru neech ka ho ya 6, 8, 12 me ho! SPECIAL STRICT WARNING: Jupiter dasha chalte samay HEERA (DIAMOND) BHULKAR BHI NA PEHNEIN (Dev-Guru Brihaspati vs Daitya-Guru Shukracharya shatruta se aarthik barbaadi aati hai)!",
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
      "Never wear Diamond (Heera) during Jupiter Mahadasha or Antardasha!",
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
      "Kitchen Sink Curd Totka (रसोई सिंक दही उपाय): Roz subah 2 chamach dahi aur raat ko 2 chamach dahi kitchen ke sink me daalkar paani baha dein. Kitchen Agni (Fire) hai aur sink Jal (Water) — dahi Agni-Jal ke takraav ko shaant karta hai aur South-East vastu dosha mitata hai.",
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
      "Gas-Pressure-Explosion Cycle: Shani dasha aate hi shareer me gas/vata badhta hai, ghutno aur tangon me dard hota hai. Pressure banta hai, phir fat-ta hai aur 11th house ke phal barsate hain.",
      "Kachhua Analogy: Shani kachhua hai — slow and steady wins the race. Hadhbadi me short-term faisla kabhi na karein.",
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
        item: "Black Umbrella / Canopy to Roadside Vendor (काली छतरी दान)",
        quantity: "1 large heavy black umbrella or shade canopy",
        day: "Saturday (Shanivar)",
        timing: "Afternoon during harsh sun",
        targetRecipient: "Poor roadside vegetable/fruit vendor or manual laborer working in scorching heat",
        place: "Roadside / Sabzi Mandi street",
        esotericReason: "Transcript verbatim formula: Dhoop me tap rahe mehnatkash ko kali chhatri ya chhaya dena Shani Dev ko turant prasanna karta hai aur klesh door karta hai."
      },
      {
        item: "Old Leather Shoes Donation (पुराने जूते दान)",
        quantity: "1 pair usable clean old leather shoes",
        day: "Saturday",
        timing: "Sunset to evening",
        targetRecipient: "Barefoot laborer, sweeper or homeless person",
        place: "Outdoor street / Slum",
        esotericReason: "Purane joote daan karne se Shani ke pairon ka bojh, bhatkav aur danda shaant hota hai."
      },
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
      "Barefoot Mountain Walk: Shanivar ko tangon par sarson ka tel mal kar pahad ya kachhe unche raste par nange pair chalein (leg strain Shani ki tapasya hai).",
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
      "Focus Tools: Use camera (symbol of focus), metal wind chime in West, or dart board to channel Rahu's obsessive energy into laser focus.",
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
        item: "Temple Entrance Threshold (Dehleez) Cleaning Upay",
        quantity: "1 yellow handkerchief (Peela rumaal)",
        day: "Saturday or Wednesday",
        timing: "Early morning sunrise",
        targetRecipient: "Temple / Gurudwara Entrance Threshold",
        place: "Mandir / Gurudwara main gate dehleez",
        esotericReason: "Transcript verbatim miracle: Mandir ki dehleez ko peele rumaal se saaf karein, apna matha dehleez par takein (Sar = Rahu), aur us rumaal ko jeb me rakhein — Rahu ka vish amrit me badal jata hai."
      },
      {
        item: "4 Brooms (Jhadu) to Municipal Sweeper",
        quantity: "4 new soft/bamboo brooms",
        day: "Saturday during Rahu Nakshatra (Ardra, Swati, Shatabhisha)",
        timing: "Morning",
        targetRecipient: "Road sweeper / Safai karamchari",
        place: "Local street",
        esotericReason: "Transcript formula: Char jhadu Rahu ke chaaro dishaon ke dhuen aur kachre ko baha deti hain."
      },
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
      "Temple Dehleez Seva: Mandir ki dehleez peele rumaal se saaf karke matha tekein aur rumaal pocket me rakhein.",
      "Roz raat ko haldi wala doodh (turmeric milk) piyein (Guru-Rahu balance).",
      "Intercaste Marriage Awareness: Venus+Rahu, Mars+Rahu ya 7th/8th house link intercaste vivah ki taraf aakarshit karta hai.",
      "12th House Rahu Infrastructure Wealth: Highway ya naye public project ke paas zameen se achanak multi-crore dhan-labh ka dhyan rakhein.",
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
        item: "Sunset Godhuli Vela Lemons & Imli Jal-Pravah (गोधूलि वेla जल प्रवाह)",
        quantity: "7 Lemons (Nimboo) + 1 packet dry tamarind (Imli) in brown cloth",
        day: "Tuesday or Thursday",
        timing: "Sunset (Godhuli Vela) strictly before complete dark",
        targetRecipient: "Clean flowing river or water canal",
        place: "Flowing natural river",
        esotericReason: "Transcript verbatim formula: 'Nimboo aur imli pure Ketu hain; sunset se pehle inko behte jal me pravahit karne se Ketu ka dushprabhav jal me vileen ho jata hai.'"
      },
      {
        item: "Fish Feeding with Black & White Sesame Balls (मछली सेवा)",
        quantity: "Aate ke pede with mixed black & white til",
        day: "Any morning",
        timing: "Morning sunrise",
        targetRecipient: "Fishes in natural pond or river",
        place: "Natural water reservoir",
        esotericReason: "Machhliyo ko til aur aata khilana Ketu ke bandhan ko mukt karta hai."
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
      "Sunset Godhuli Vela Upay: 7 nimboo + 1 packet imli bhoore kapde me bandhkar sunset se pehle behte jal me pravahit karein.",
      "4th House Ketu Roof Flag Rule: Agar Ketu 4th house me ho to chhat par lamba tiranga/jhanda na lagayein, sirf chhota safed dhwaja lagayein.",
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

/**
 * Contextual Life-Domain Remedy Architecture (The 3-Tier Dynamic Activation System)
 * Derived verbatim from the Classical Master Lecture Transcript:
 * "Kundli me 50 rajyog ho ya 50 dur-yog, kaam wahi karega jo planet Dasha/Antardasha me active hai ya jis House ka trigger chala hai!"
 */
export type LifeDomainContext =
  | "dasha"
  | "property"
  | "marriage"
  | "career"
  | "health"
  | "emergency";

export interface ContextualPlanetItem {
  planet: PlanetId;
  roleHinglish: string;
  isFavorable: boolean;
  placementSummary: string;
  recommendationType: "PowerUp_Gemstone_Favorable" | "Mitigate_Charity_Afflicted";
  primaryHeadline: string;
  evaluation: EvaluatedCorePlanetRemedy;
}

export interface ContextualSpecialFormula {
  title: string;
  badge: string;
  esotericSecretHinglish: string;
  itemsRequired: string[];
  exactDosage: string;
  timing: string;
  expectedResultHinglish: string;
}

export interface ContextualRemedyResponse {
  context: LifeDomainContext;
  titleHinglish: string;
  subtitleHinglish: string;
  primaryRationaleHinglish: string;
  signifiedHouses: number[];
  activatedPlanets: ContextualPlanetItem[];
  specialFormulas: ContextualSpecialFormula[];
  strictWarnings: string[];
  safePractices: string[];
}

const RASHI_LORDS: PlanetId[] = [
  "Mars",    // 1 Aries
  "Venus",   // 2 Taurus
  "Mercury", // 3 Gemini
  "Moon",    // 4 Cancer
  "Sun",     // 5 Leo
  "Mercury", // 6 Virgo
  "Venus",   // 7 Libra
  "Mars",    // 8 Scorpio
  "Jupiter", // 9 Sagittarius
  "Saturn",  // 10 Capricorn
  "Saturn",  // 11 Aquarius
  "Jupiter"  // 12 Pisces
];

export function getHouseLord(chart: ChartData | null | undefined, houseNo: number): PlanetId {
  const lagnaNum = chart?.lagnaNum || 1;
  const rashiIdx = ((lagnaNum + houseNo - 2) % 12);
  return RASHI_LORDS[rashiIdx] || "Sun";
}

export function resolveContextualRemedies(
  context: LifeDomainContext,
  chart: ChartData | null | undefined
): ContextualRemedyResponse | null {
  if (!chart || !chart.planets) return null;

  const activeMD = chart?.dashas?.find((d) => d.active) ?? chart?.dashas?.[0];
  const activeAD = chart?.antardasha?.find((a) => a.active);
  const mdPlanet = (activeMD?.planet || "Jupiter") as PlanetId;
  const adPlanet = (activeAD?.planet || "Saturn") as PlanetId;

  // 1. TIER 1: ACTIVE DASHA & ANTARDASHA (Current Life Engine)
  if (context === "dasha") {
    const planetsToEval: { planet: PlanetId; role: string }[] = [
      { planet: mdPlanet, role: "Active Mahadasha Adhipati (Pradhan Fal-Data)" }
    ];
    if (adPlanet !== mdPlanet) {
      planetsToEval.push({ planet: adPlanet, role: "Active Antardasha Adhipati (Karmic Executor)" });
    }

    const activatedPlanets: ContextualPlanetItem[] = [];
    const strictWarnings: string[] = [];
    const safePractices: string[] = [];
    const specialFormulas: ContextualSpecialFormula[] = [];

    planetsToEval.forEach(({ planet, role }) => {
      const evalResult = evaluateCorePlanetRemedy(planet, chart);
      if (evalResult) {
        activatedPlanets.push({
          planet,
          roleHinglish: role,
          isFavorable: evalResult.isFavorable,
          placementSummary: evalResult.placementSummary,
          recommendationType: evalResult.recommendationType,
          primaryHeadline: evalResult.primaryHeadline,
          evaluation: evalResult
        });
        if (!evalResult.isFavorable) {
          strictWarnings.push(evalResult.gemstoneAdvice.strictWarning);
        }
        evalResult.habitsToAdoptHinglish.forEach((h) => safePractices.push(h));
      }
    });

    // Jupiter Dasha Diamond Prohibition check
    if (mdPlanet === "Jupiter" || adPlanet === "Jupiter") {
      strictWarnings.push("Guru Dasha Vishesh Chetavani: Heera (Diamond) bhulkar bhi na pehnein; Dev-Guru aur Daitya-Guru ka takraav dhandha aur dhan barbad karta hai!");
      specialFormulas.push({
        title: "Jupiter Sthan Hani Gold Conversion Cycle",
        badge: "Guru Master Rule",
        esotericSecretHinglish: "Guru pehle 1-2 saal purane kooda-karkat aur galat tariko ko hatata hai (Tehsildar case study), phir sab kuch 100% shuddh sona bana deta hai. Zero bribes, zero shortcuts, 100% purity.",
        itemsRequired: ["Kesar/Haldi tilak", "Pure taaza paani", "Nose hygiene"],
        exactDosage: "Roz subah naak ko taaze paani se saaf karein aur mathe par kesar tilak lagayein",
        timing: "Every morning after bath",
        expectedResultHinglish: "Decision making tez hoti hai aur log aapse salah lene aane lagte hain."
      });
    }

    // Saturn Dasha Gas-Pressure check
    if (mdPlanet === "Saturn" || adPlanet === "Saturn") {
      specialFormulas.push({
        title: "Shani Gas-Pressure-Explosion Tapasya",
        badge: "Shani Cycle",
        esotericSecretHinglish: "Shani dasha aate hi gas/vata badhta hai, tangon me dard hota hai. Pressure ban kar phattega aur 11th sign ke fruits milenge. Shanivar ko nange pair pahad par chalna Shani ki tapasya hai.",
        itemsRequired: ["Sarson ka tel", "Nange pair walk", "Black umbrella"],
        exactDosage: "Shanivar ko pairon par sarson tel mal kar pahad/kachhe unche raste par chalein",
        timing: "Saturday evening",
        expectedResultHinglish: "Legs aur joint pain ghatta hai aur professional roadblocks door hote hain."
      });
    }

    return {
      context: "dasha",
      titleHinglish: "⏰ Active Dasha & Antardasha Priority Dossier",
      subtitleHinglish: `Mahadasha: ${mdPlanet} · Antardasha: ${adPlanet}`,
      primaryRationaleHinglish: "Transcript niyam: 'Chart me 50 rajyog ho ya 50 dosh, fal wahi deta hai jo Dasha aur Antardasha me active hai!' Abhi inhi do grahon ka prabhav aapke vartaman jeevan par 70% chal raha hai.",
      signifiedHouses: [
        chart.planets[mdPlanet]?.house || 1,
        chart.planets[adPlanet]?.house || 1
      ],
      activatedPlanets,
      specialFormulas,
      strictWarnings,
      safePractices
    };
  }

  // 2. TIER 2: PROPERTY & LAND DOMAIN
  if (context === "property") {
    const h4Lord = getHouseLord(chart, 4);
    const h11Lord = getHouseLord(chart, 11);
    const planetsToEval: { planet: PlanetId; role: string }[] = [
      { planet: "Mars", role: "Bhumi & Zameen Karaka (Natural Real Estate Lord)" },
      { planet: h4Lord, role: `4th House Lord (${h4Lord} - Makaan & Griha Sthan)` },
      { planet: h11Lord, role: `11th House Lord (${h11Lord} - Sampatti Labh & Possession)` }
    ];

    const uniquePlanets = Array.from(new Set(planetsToEval.map((p) => p.planet)));
    const activatedPlanets: ContextualPlanetItem[] = [];
    const strictWarnings: string[] = [];
    const safePractices: string[] = [];

    uniquePlanets.forEach((pName) => {
      const match = planetsToEval.find((x) => x.planet === pName);
      const evalResult = evaluateCorePlanetRemedy(pName, chart);
      if (evalResult && match) {
        activatedPlanets.push({
          planet: pName,
          roleHinglish: match.role,
          isFavorable: evalResult.isFavorable,
          placementSummary: evalResult.placementSummary,
          recommendationType: evalResult.recommendationType,
          primaryHeadline: evalResult.primaryHeadline,
          evaluation: evalResult
        });
        if (!evalResult.isFavorable) {
          strictWarnings.push(evalResult.gemstoneAdvice.strictWarning);
        }
      }
    });

    const specialFormulas: ContextualSpecialFormula[] = [
      {
        title: "Mars Triangle Copper Piece Potli (तांबे का तिकोना टुकड़ा Upay)",
        badge: "Property Dispute Breaker",
        esotericSecretHinglish: "Transcript verbatim formula: Taambe ka tikona tukda, 1kg lal masoor dal, sabut lal mirch, lal sindoor aur pure honey ko lal kapde me bandhkar bhav ke tattva ke anusaar sthapit ya pravahit karein. Mangal ka klesh shant hota hai aur registry safal hoti hai.",
        itemsRequired: ["Taambe ka tikona tukda", "1kg Lal Masoor Dal", "Sabut Lal Mirch", "Lal Sindoor", "Shuddh Shehad", "Lal Vastra"],
        exactDosage: "1 potli tied securely on Tuesday",
        timing: "Tuesday morning to afternoon",
        expectedResultHinglish: "Zameen, plot ya flat ke vivaad aur kagazi rukawat 40 din me door hoti hai."
      },
      {
        title: "Astro-Vastu ENE Property Activation Totka",
        badge: "Vastu Energy Anchor",
        esotericSecretHinglish: "8th sub-lord ke nakshatra lord ke item ko ghar ke 11th zone (East-North-East) me orange cloth me sthapit karein. Is se blocked property deals khul jaati hain.",
        itemsRequired: ["Orange cloth", "Wheat (Gehun) / Sub-lord item", "Copper vessel"],
        exactDosage: "Place in ENE corner of the house",
        timing: "Sunday or Thursday morning",
        expectedResultHinglish: "Khareeddar (Buyer) tezi se aate hain aur token amount lock hota hai."
      },
      {
        title: "4th House Ketu Roof Flag Rule",
        badge: "Strict Warning",
        esotericSecretHinglish: "Transcript verbatim secret: Agar Ketu 4th house me ho to chhat par tiranga ya lamba flag na lagayein (yeh ghar ki shanti kaat-ta hai), sirf chhota safed dhwaja lagayein.",
        itemsRequired: ["Small white flag"],
        exactDosage: "1 small white flag",
        timing: "Thursday morning",
        expectedResultHinglish: "Ghar me achanak hone wali ashanti aur chori/dhan haani rukti hai."
      }
    ];

    safePractices.push("Property khareedne ke liye dasha me 4-11-12 yog check karein (12th house investment outlay hai).");
    safePractices.push("Property bechne ke liye dasha me 3-7-10-5 yog check karein (3rd house 12th from 4th hokar zameen chhudata hai).");

    return {
      context: "property",
      titleHinglish: "🏠 Property, Land & Real Estate Activation Dossier",
      subtitleHinglish: `Bhumi Karaka: Mars · 4th Lord: ${h4Lord} · 11th Lord: ${h11Lord}`,
      primaryRationaleHinglish: "Makaan ya zameen lene me 4th house (makaan), 11th house (labh) aur 12th house (nivesh/investment) ka sakriya hona zaroori hai. Mangal zameen ka sakshat swami hai.",
      signifiedHouses: [4, 11, 12, 3, 7, 10],
      activatedPlanets,
      specialFormulas,
      strictWarnings,
      safePractices
    };
  }

  // 3. TIER 2: MARRIAGE & RELATIONSHIPS
  if (context === "marriage") {
    const h7Lord = getHouseLord(chart, 7);
    const planetsToEval: { planet: PlanetId; role: string }[] = [
      { planet: "Venus", role: "Dampatya, Prem & Patni Karaka (Natural Relationship Lord)" },
      { planet: "Mars", role: "Husband Karaka (in Female chart) & Manglik Energy" },
      { planet: h7Lord, role: `7th House Lord (${h7Lord} - Vivah & Saathi Sthan)` },
      { planet: "Rahu", role: "Unconventional Desire & Intercaste Indicator" }
    ];

    const uniquePlanets = Array.from(new Set(planetsToEval.map((p) => p.planet)));
    const activatedPlanets: ContextualPlanetItem[] = [];
    const strictWarnings: string[] = [];
    const safePractices: string[] = [];

    uniquePlanets.forEach((pName) => {
      const match = planetsToEval.find((x) => x.planet === pName);
      const evalResult = evaluateCorePlanetRemedy(pName, chart);
      if (evalResult && match) {
        activatedPlanets.push({
          planet: pName,
          roleHinglish: match.role,
          isFavorable: evalResult.isFavorable,
          placementSummary: evalResult.placementSummary,
          recommendationType: evalResult.recommendationType,
          primaryHeadline: evalResult.primaryHeadline,
          evaluation: evalResult
        });
        if (!evalResult.isFavorable) {
          strictWarnings.push(evalResult.gemstoneAdvice.strictWarning);
        }
      }
    });

    const specialFormulas: ContextualSpecialFormula[] = [
      {
        title: "Venus South-East Kitchen Sink Curd Totka (रसोई सिंक दही उपाय)",
        badge: "Marital Harmony Healer",
        esotericSecretHinglish: "Transcript verbatim formula: Kitchen Agni (Fire) hai aur sink Jal (Water) hai. Roz subah 2 chamach dahi aur raat ko 2 chamach dahi kitchen ke sink me daalkar paani baha dein. Dahi Agni-Jal ke takraav ko shaant karta hai aur South-East vastu dosha mitata hai.",
        itemsRequired: ["Fresh white curd (Dahi)", "Water tap"],
        exactDosage: "2 spoons morning + 2 spoons night down kitchen sink",
        timing: "Daily morning and night",
        expectedResultHinglish: "Pati-patni ke beech ka roz-roz ka klesh aur chirchiraapan shaant hota hai."
      },
      {
        title: "Moon Psychological Heart-Sharing Sanctuary Map",
        badge: "Emotional Healing",
        esotericSecretHinglish: "Chandra jis bhav me baitha hai, wahi aapke dil ki surakshit jagah hai. 7th house Chandra wale ko saathi ke aage dil kholna chahiye, 4th house wale ko mata ji ke aage, aur 12th house wale ko kewal Shiva ya ekant dhyan me.",
        itemsRequired: ["Silver glass milk", "Safe emotional confidant"],
        exactDosage: "Daily emotional journaling or discussion with authorized confidant",
        timing: "Evening moonrise",
        expectedResultHinglish: "Depression aur emotional exhaustion se mukti milti hai."
      },
      {
        title: "6 kg Potatoes in Religious Langar",
        badge: "Venus Affliction Neutralizer",
        esotericSecretHinglish: "Agar Shukra 6th house me ho ya neech ka ho, to Heera kabhi na pehnein. Shukravar ko 6 kg kachhe aaloo kisi dharmik langar me daan karein.",
        itemsRequired: ["6 kg raw potatoes (Aloo)", "2 kg curd"],
        exactDosage: "6 kg raw potatoes on Friday",
        timing: "Friday morning to noon",
        expectedResultHinglish: "Rishto me talaq aur aarthik barbaadi ke yog talte hain."
      }
    ];

    strictWarnings.push("Shukra peedit ho to Heera ya Opal bhulkar bhi na pehnein; rishte jal kar bhasm ho sakte hain!");
    safePractices.push("Jeevan saathi ka nitya samman karein; stri ke khush rehne se hi Shukra amrit barsata hai.");

    return {
      context: "marriage",
      titleHinglish: "💍 Marriage, Love & Relationship Alignment Dossier",
      subtitleHinglish: `Shukra: Venus · Mangal: Mars · 7th Lord: ${h7Lord}`,
      primaryRationaleHinglish: "Dampatya jeevan me 7th house (saathi), Shukra (prem) aur Chandra (manasik shanti) ka mahatvapoorna role hai. Peedit Shukra me ratna pehanna aag me ghee daalne jaisa hota hai.",
      signifiedHouses: [7, 2, 4, 12],
      activatedPlanets,
      specialFormulas,
      strictWarnings,
      safePractices
    };
  }

  // 4. TIER 2: CAREER & PROFESSIONAL KARMA
  if (context === "career") {
    const h10Lord = getHouseLord(chart, 10);
    const h11Lord = getHouseLord(chart, 11);
    const planetsToEval: { planet: PlanetId; role: string }[] = [
      { planet: "Saturn", role: "Karma, Hard Work & Profession Karaka" },
      { planet: "Mercury", role: "Buddhi, Business, Accounts & Communication Karaka" },
      { planet: h10Lord, role: `10th House Lord (${h10Lord} - Karma & Status Sthan)` },
      { planet: h11Lord, role: `11th House Lord (${h11Lord} - Labh & Career Ambition)` }
    ];

    const uniquePlanets = Array.from(new Set(planetsToEval.map((p) => p.planet)));
    const activatedPlanets: ContextualPlanetItem[] = [];
    const strictWarnings: string[] = [];
    const safePractices: string[] = [];

    uniquePlanets.forEach((pName) => {
      const match = planetsToEval.find((x) => x.planet === pName);
      const evalResult = evaluateCorePlanetRemedy(pName, chart);
      if (evalResult && match) {
        activatedPlanets.push({
          planet: pName,
          roleHinglish: match.role,
          isFavorable: evalResult.isFavorable,
          placementSummary: evalResult.placementSummary,
          recommendationType: evalResult.recommendationType,
          primaryHeadline: evalResult.primaryHeadline,
          evaluation: evalResult
        });
        if (!evalResult.isFavorable) {
          strictWarnings.push(evalResult.gemstoneAdvice.strictWarning);
        }
      }
    });

    const specialFormulas: ContextualSpecialFormula[] = [
      {
        title: "Saturn 7th House Growth Radar (Transcript Benchmark)",
        badge: "Career Elevation",
        esotericSecretHinglish: "Transcript verbatim formula: Transit Saturn jahan baithta hai, uske theek 7th house ka status badhata hai! 8th Shani = 2nd house dhan status; 9th Shani = 3rd house media status; 10th Shani = 4th house big mansion status.",
        itemsRequired: ["Shani discipline", "Respect for blue collar workers"],
        exactDosage: "Analyze your 2.5-year transit window",
        timing: "Current 2.5-year cycle",
        expectedResultHinglish: "Career me sthir unchiyan aur authority praapt hoti hai."
      },
      {
        title: "Black Umbrella & Shade to Poor Roadside Vendors",
        badge: "Saturn Kripa Upay",
        esotericSecretHinglish: "Dhoop me tap rahe sadak ke sabzi/phal vendor ko badi kali chhatri ya shade bhent karein. Shani Dev atyant prasanna hote hain aur career stagnation door hoti hai.",
        itemsRequired: ["1 Large Black Umbrella"],
        exactDosage: "1 black umbrella on Saturday afternoon",
        timing: "Saturday harsh afternoon sun",
        expectedResultHinglish: "Office politics aur bosses ki taraf se aane wali badhayein shant hoti hain."
      },
      {
        title: "Mercury Parrot Freedom & Kinnar Seva (तोता सेवा v किन्नर आशीर्वाद)",
        badge: "Business & Trading Breakthrough",
        esotericSecretHinglish: "Transcript verbatim formula: Budhwar ko tota layein, 7 din hari mirch aur amrood khilayein, agle Budhwar jungle me uda dein. Kinnar ko hara suit aur Agra Petha dekar ashirwad lein.",
        itemsRequired: ["Green parrot (fed 7 days)", "Green dress", "1 kg Agra petha", "₹500 dakshina"],
        exactDosage: "1 week feeding then free release in forest",
        timing: "Wednesday to Wednesday",
        expectedResultHinglish: "Trading, finance aur client negotiation me bandhe hue raaste turant khul jaate hain."
      }
    ];

    safePractices.push("Neeche kaam karne wale workers aur safai karamchariyon ko hamesha samay par paisa dein.");
    safePractices.push("Bird Feeding Test: Peedit Budh me chidiya 7-10 din tak daana nahi chhooegi; nitya daana daalte rahein, 10-12 din me jaise hi khana shuru karegi, vyapaar badhne lagega.");

    return {
      context: "career",
      titleHinglish: "💼 Career, Business & Karmic Elevation Dossier",
      subtitleHinglish: `Karma Karaka: Saturn · Trade Karaka: Mercury · 10th Lord: ${h10Lord}`,
      primaryRationaleHinglish: "Profession aur vyapaar me Shani (mehnat v nyay) aur Budh (buddhi v marketing) ka santulan anivarya hai. Neech grahon ka ratna pehanne se career me achanak firing ya suspension ka darr hota hai.",
      signifiedHouses: [10, 11, 2, 6],
      activatedPlanets,
      specialFormulas,
      strictWarnings,
      safePractices
    };
  }

  // 5. TIER 2: HEALTH & CRISIS MITIGATION
  if (context === "health") {
    const h6Lord = getHouseLord(chart, 6);
    const h8Lord = getHouseLord(chart, 8);
    const planetsToEval: { planet: PlanetId; role: string }[] = [
      { planet: h6Lord, role: `6th House Lord (${h6Lord} - Roga & Acute Disease Sthan)` },
      { planet: h8Lord, role: `8th House Lord (${h8Lord} - Chronic Ailment & Longevity Sthan)` },
      { planet: "Sun", role: "Surya Dev (Atma-Bala, Bones & Vital Life Fire)" },
      { planet: "Ketu", role: "Ketu Dev (Phantom, Undiagnosable & Nerve Issues)" }
    ];

    const uniquePlanets = Array.from(new Set(planetsToEval.map((p) => p.planet)));
    const activatedPlanets: ContextualPlanetItem[] = [];
    const strictWarnings: string[] = [];
    const safePractices: string[] = [];

    uniquePlanets.forEach((pName) => {
      const match = planetsToEval.find((x) => x.planet === pName);
      const evalResult = evaluateCorePlanetRemedy(pName, chart);
      if (evalResult && match) {
        activatedPlanets.push({
          planet: pName,
          roleHinglish: match.role,
          isFavorable: evalResult.isFavorable,
          placementSummary: evalResult.placementSummary,
          recommendationType: evalResult.recommendationType,
          primaryHeadline: evalResult.primaryHeadline,
          evaluation: evalResult
        });
        if (!evalResult.isFavorable) {
          strictWarnings.push(evalResult.gemstoneAdvice.strictWarning);
        }
      }
    });

    const specialFormulas: ContextualSpecialFormula[] = [
      {
        title: "Ketu 7 Ripe Bananas to Lord Ganesha (1 Ghante Me Raahat)",
        badge: "Emergency Relief Miracle",
        esotericSecretHinglish: "Transcript verbatim formula: '7 bananas lene hain aur Ganesh ji ko arpit kar do, chamatkari upay hai, 1 ghante me result aate hain!' Ketu ke phantom dard, klesh aur achanak sankat ko Ganesha turant har lete hain.",
        itemsRequired: ["7 Ripe Yellow Bananas (सात पके केले)"],
        exactDosage: "7 bananas offered at Ganesha Sanctuary",
        timing: "Tuesday, Thursday or any emergency moment",
        expectedResultHinglish: "1 ghante me mansik tanaav aur sharirik peeda me aashcharyajanak kami aati hai."
      },
      {
        title: "Sunset Godhuli Vela Lemons & Imli Jal-Pravah",
        badge: "Chronic Sickness Cleanser",
        esotericSecretHinglish: "Transcript verbatim formula: 7 nimboo + 1 packet imli bhoore kapde me bandhkar sunset se theek pehle behte jal me pravahit karein. Khatti cheezein Ketu hain, inka jal-pravah roga-shrap ko baha deta hai.",
        itemsRequired: ["7 Lemons", "1 packet dry tamarind (Imli)", "Brown cloth"],
        exactDosage: "Flow into clean running water",
        timing: "Sunset (Godhuli Vela) strictly before nightfall",
        expectedResultHinglish: "Purani na theek hone wali bimariyo me medical report sudharna shuru hoti hai."
      },
      {
        title: "Sun Copper Lota Water & Hospital Medicines Daan",
        badge: "Vitality Armor",
        esotericSecretHinglish: "Raat ko taambe ke lote me paani rakhein aur subah gud khakar piyein. Sunday ko sarkari hospital me beemar mareezo ko dawai daan karein.",
        itemsRequired: ["Copper lota", "Gud (Jaggery)", "Medicines for needy"],
        exactDosage: "Daily morning drink + Sunday medicine charity",
        timing: "Every morning + Sunday daytime",
        expectedResultHinglish: "Jatharagni tez hoti hai, heart-vitality badhti hai aur immunity majboot hoti hai."
      }
    ];

    strictWarnings.push("6th ya 8th house ke lords ka ratna bhulkar bhi na pehnein; roga aur operation ka darr badh jayega!");
    safePractices.push("Ketu peedit ho to nimboo aur imli khana turant band karein; sour foods Ketu ko bhadkaate hain.");

    return {
      context: "health",
      titleHinglish: "🩺 Health, Longevity & Disease Neutralization Dossier",
      subtitleHinglish: `6th Lord: ${h6Lord} · 8th Lord: ${h8Lord} · Vitality: Sun`,
      primaryRationaleHinglish: "Sharir me bimari 6th aur 8th house ke aktiv hone se aati hai. Yahan ratna pehanna ghatak hota hai; kewal daan, aushadhi daan, aur niyamit mantra se hi sharir ki raksha hoti hai.",
      signifiedHouses: [6, 8, 1, 12],
      activatedPlanets,
      specialFormulas,
      strictWarnings,
      safePractices
    };
  }

  // 6. TIER 3: CRITICAL KARMIC EMERGENCY (Debilitated & Dushtana Planets)
  if (context === "emergency") {
    const allPlanets: PlanetId[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const afflictedPlanets: ContextualPlanetItem[] = [];
    const strictWarnings: string[] = [];
    const safePractices: string[] = [];

    allPlanets.forEach((pName) => {
      const pData = chart.planets[pName];
      if (!pData) return;
      const isDushtana = [6, 8, 12].includes(pData.house);
      const isDebilitated = pData.dignity?.toLowerCase().includes("debilitat");
      if (isDushtana || isDebilitated) {
        const evalResult = evaluateCorePlanetRemedy(pName, chart);
        if (evalResult && !evalResult.isFavorable) {
          afflictedPlanets.push({
            planet: pName,
            roleHinglish: isDebilitated ? "Neech Grah (Severely Debilitated)" : `Trik Bhav Me Sthit (${pData.house}th House)`,
            isFavorable: false,
            placementSummary: evalResult.placementSummary,
            recommendationType: "Mitigate_Charity_Afflicted",
            primaryHeadline: evalResult.primaryHeadline,
            evaluation: evalResult
          });
          strictWarnings.push(evalResult.gemstoneAdvice.strictWarning);
        }
      }
    });

    const specialFormulas: ContextualSpecialFormula[] = [
      {
        title: "Golden Emergency Rule: NEVER WEAR GEMSTONE",
        badge: "Strict Shastra Law",
        esotericSecretHinglish: "Transcript verbatim principle: Jo grah dushit, neech ya 6/8/12 me fasa hai, uska stone pehanna aag me ghee daalne jaisa hai! Aise grah ko shant karne ke liye kewal daan, jal pravah aur seva karein.",
        itemsRequired: ["Strict restraint from gemstones"],
        exactDosage: "Zero gemstone usage for afflicted planets",
        timing: "Lifelong or dasha duration",
        expectedResultHinglish: "Dhar-pakad, police cases, sudden hospitalisation aur bankruptcies se bachaav hota hai."
      }
    ];

    safePractices.push("In peedit grahon ke rangon ke kapde dasha me pehanna band karein.");
    safePractices.push("In grahon ki vastuon ka behte jal me pravah karein ya mandir/langar me daan karein.");

    return {
      context: "emergency",
      titleHinglish: "⚡ Critical Karmic Repair Dossier (Peedit Grah)",
      subtitleHinglish: `${afflictedPlanets.length} grah aapki kundli me vishesh daan aur shaanti maang rahe hain`,
      primaryRationaleHinglish: "Yeh grah aapki kundli me neech ya dukh-sthan (6, 8, 12) me sthit hain. Bhale hi inki dasha abhi na chal rahi ho, background me inka dushprabhav rehta hai. Inka ratna bhulkar bhi na pehnein!",
      signifiedHouses: [6, 8, 12],
      activatedPlanets: afflictedPlanets,
      specialFormulas,
      strictWarnings,
      safePractices
    };
  }

  return null;
}
