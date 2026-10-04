/**
 * ============================================================================
 * ASTROLIFE — PLANET × HOUSE SPECIFIC SATTVIC REMEDIES MATRIX
 * ============================================================================
 * Classical lifestyle karma alignment tailored specifically to the planet
 * and the exact house it activates. Completely free of superstitious dread;
 * strictly grounded in practical karma alignment, charity, and mindfulness.
 * ============================================================================
 */

import type { TransitPlanet } from "./types";

interface HouseRemedy {
  hinglish: string[];
  english: string[];
}

export const PLANET_HOUSE_REMEDIES: Record<TransitPlanet, Record<number, HouseRemedy>> = {
  Saturn: {
    1: {
      hinglish: [
        "Subah suryoday ke aas-paas sharirik shram ya yoga karein taaki sharir me vata aur aalsya na jamne paye.",
        "Shanivar ko shramik ya vridh vyakti ko til-tel ya footwear bina kisi prachar ke bhent karein.",
        "Apne daily routine me punctuality aur discipline ko prathmikta dein.",
      ],
      english: [
        "Engage in grounded physical exercise or yoga at dawn to channel internal stiffness into endurance.",
        "Quietly support elderly laborers or blue-collar workers with warm sustenance or essentials.",
        "Anchor strict punctuality and methodical discipline into your foundational morning schedule.",
      ],
    },
    2: {
      hinglish: [
        "Vani par vishesh sanyam rakhein; ghar ya parivar me kisi par aalochanaatmak tippani na karein.",
        "Shanivar ko kisi zarooratmand ko sukha anaj ya daal ka daan karein.",
        "Koi bhi bada kharcha karne se pehle 24 ghante ka self-reflection pause lein.",
      ],
      english: [
        "Exercise disciplined silence and warm restraint in all domestic and financial conversations.",
        "Offer wholesome dry grains or pulses to a local shelter or needy individuals quietly.",
        "Enforce a mandatory 24-hour consideration window before committing to any non-essential purchase.",
      ],
    },
    3: {
      hinglish: [
        "Chhote bhai-behnon aur sahayogiyon ke sath vinamrata se pesh aayein aur unki madad karein.",
        "Apne hathon se mechanical ya likhit shram (journaling/craft) ka abhyas karein.",
        "Pakshiyon ko bajra ya anaj ke daane daalein.",
      ],
      english: [
        "Offer constructive, patient support to junior colleagues, younger siblings, and craft partners.",
        "Practice dedicated daily handwriting or tangible manual craft to ground mental restlessness.",
        "Scatter millets or mixed grains for community birds at sunrise.",
      ],
    },
    4: {
      hinglish: [
        "Apne ghar ke purane kabaad aur anupyogi lohe ke samaan ko bahar karein.",
        "Mataji ya ghar ki vriddha mahilaon ke pair chhookar din ki shuruat karein.",
        "Peepal ke ped ke paas sham ko sarson ke tel ka deepak lagayein.",
      ],
      english: [
        "Declutter outdated household storage, broken iron objects, and stagnant basement corners.",
        "Seek the gentle morning blessings and counsel of your mother or matriarchal figures.",
        "Place a simple sesame or mustard oil lamp near a sacred Peepal tree at dusk.",
      ],
    },
    5: {
      hinglish: [
        "Shanivar ko kisi zarooratmand student ki padhai ya kitabon me sahayog karein.",
        "Apne dimaag ko speculate karne ke bajay structured analysis me lagayein.",
        "Roz 10 minute Om Sham Shanaischaraya Namah ka shant man se jaap karein.",
      ],
      english: [
        "Sponsor textbooks, stationery, or tuition support for an underprivileged student.",
        "Direct intellectual energy into rigorous, long-horizon analysis rather than speculative gambles.",
        "Meditate quietly for 10 minutes cultivating deep inner patience and emotional stillness.",
      ],
    },
    6: {
      hinglish: [
        "Gali ke kutton ko doodh ya roti khilayein; kisi bhi be-sahara janwar ko dukh na pahunchayein.",
        "Office ke safai-karmiyon ko sammanit karein aur unhe chai ya phal bhent karein.",
        "Swasthya me laparwahi chhodkar spine aur joints ki stretching karein.",
      ],
      english: [
        "Provide daily nourishment or water to stray community dogs with genuine kindness.",
        "Express dignified gratitude to sanitation and maintenance workers with modest personal gifts.",
        "Incorporate daily lumbar spine mobility and joint care into your evening wind-down.",
      ],
    },
    7: {
      hinglish: [
        "Apne jeevan-saathi ya business partner ki baaton ko beech me toke bina poora sunein.",
        "Kaale kapde ya chhati par bojh banne wale purane vaadon ko clear karein.",
        "Shanivar ke din andh-vidyalaya ya divyang-ashram me sahyog karein.",
      ],
      english: [
        "Practice deep, uninterrupted listening during partner dialogues; honor commitments punctually.",
        "Clarify and formalize pending partnership expectations in writing to avoid future ambiguity.",
        "Contribute anonymously to institutions supporting visually impaired or differently-abled persons.",
      ],
    },
    8: {
      hinglish: [
        "Akelepan me overthinking ke bajay kisi shastriya ya technical pustak ka adhyayan karein.",
        "Niyamit roop se purane kapde ya aisi cheezein daan karein jinki aapko zaroorat nahi hai.",
        "Maha-Mrityunjaya mantra ka 11 baar shant man se jaap karein.",
      ],
      english: [
        "Channel nocturnal contemplation into structured investigative research or classical philosophy.",
        "Regularly purge and donate belongings that you have outgrown to foster psychological unburdening.",
        "Recite or listen to the restorative Maha-Mrityunjaya resonance to steady vital nervous energy.",
      ],
    },
    9: {
      hinglish: [
        "Apne pita ya shikshakon ke aadarshon ka aadar karein aur unke charan sparsh karein.",
        "Kisi dharamik sthal ki safai ya vyavastha me shram-daan karein.",
        "Bade aadarshon ke sath practical dharatal par kaam karne ka sankalp lein.",
      ],
      english: [
        "Demonstrate reverent loyalty and practical respect to mentors, fathers, and elders.",
        "Offer voluntary physical seva or organizational assistance at a local temple or community space.",
        "Anchor lofty philosophical ideals into small, repeatable daily ethical commitments.",
      ],
    },
    10: {
      hinglish: [
        "Apne workplace par bina shikayat kiye apne karm ko poori nishtha se samapt karein.",
        "Juniors ya sahayogiyon par anavashyak krodh na karein; unhe mentor karein.",
        "Shanivar ko shramikon ko gud aur chane ka prasad baantein.",
      ],
      english: [
        "Execute daily professional duties with uncomplaining excellence and quiet craftsmanship.",
        "Mentor and protect junior team members rather than projecting executive frustration.",
        "Distribute roasted chickpeas and jaggery to manual laborers on Saturday afternoons.",
      ],
    },
    11: {
      hinglish: [
        "Apne friend circle me unverified aur matalbi logon se doori banakar sachhe dosto ki madad karein.",
        "Apni aamdani ka ek chhota hissa kisi samajik ya shramik kalyaankari karya me lagayein.",
        "Shanivar ko kaale til aur sarson ke tel ka chhota daan karein.",
      ],
      english: [
        "Filter out transactional acquaintances and proactively invest time in loyal, long-term allies.",
        "Systematically tithe a modest portion of your liquid earnings to worker welfare funds.",
        "Offer black sesame and mustard oil to a local charity honoring Saturnian discipline.",
      ],
    },
    12: {
      hinglish: [
        "Sone se 1 ghanta pehle mobile ya screen band karke dhyan karein taaki nindra shant ho.",
        "Hospital ya kisi aspatal ke mareezon ko phal ya davaon me silent madad karein.",
        "Apne bistar aur bedroom ko bilkul saaf aur vyavasthit rakhein.",
      ],
      english: [
        "Disconnect entirely from screens 60 minutes before bedtime; practice quiet breathwork for sleep.",
        "Anonymously sponsor medical supplies, fruits, or assistance for patients in community hospitals.",
        "Maintain pristine cleanliness and sensory minimalism in your sleeping environment.",
      ],
    },
  },
  Jupiter: {
    1: {
      hinglish: [
        "Subah maathe par chandan ya haldi ka tilak lagayein aur satvik aahar lein.",
        "Apne gyan aur samajh ko bina ahankaar ke doosron ke margdarshan me lagayein.",
        "Roz subah 15 minute kisi dharmik ya adhyatmik pustak ka paath karein.",
      ],
      english: [
        "Apply a gentle sandalwood or turmeric mark on the forehead at sunrise; embrace wholesome sattvic meals.",
        "Share knowledge and mentorship generously without intellectual arrogance or superiority.",
        "Dedicate 15 minutes every morning to deep reading of classical wisdom literature.",
      ],
    },
    2: {
      hinglish: [
        "Vani me mithaas aur satyata rakhein; parivar ke bado ki salah ko aadar dein.",
        "Guruvar ke din besan ke laddu ya peeli mithai kisi buzurg ko bhent karein.",
        "Apni kamai ka ek ansh kisi gyan-shala ya vidyarthi ko daan karein.",
      ],
      english: [
        "Speak with genuine warmth and unshakeable truth; honor the financial counsel of family elders.",
        "Offer wholesome golden sweets or yellow lentils to elders or spiritual teachers on Thursdays.",
        "Contribute educational funding or study materials to deserving students quietly.",
      ],
    },
    3: {
      hinglish: [
        "Apne chote bhai-behnon ko career ya padhai me guidance dein.",
        "Lekhan, publishing ya communication me satya aur shuchita banaye rakhein.",
        "Guruvar ko chane ki daal aur kela kisi gay ko khilayein.",
      ],
      english: [
        "Provide patient educational guidance and mentorship to younger siblings or apprentices.",
        "Uphold meticulous truthfulness and clarity in all writing, publishing, and messaging.",
        "Offer soaked chickpeas and bananas to gentle cows or animal sanctuaries on Thursdays.",
      ],
    },
    4: {
      hinglish: [
        "Ghar me katha, havan ya adhyatmik sangeet ka vatavaran banayein.",
        "Apni mataji ko peele vastra ya unki pasand ki koi cheez saadar bhent karein.",
        "Ghar me tulsi ke paudhe me roz subah jal arpit karein.",
      ],
      english: [
        "Cultivate a tranquil, sanctified atmosphere at home with devotional acoustics and cleanliness.",
        "Offer respectful gifts or warm apparel to your mother in honor of maternal grace.",
        "Water the sacred Tulsi plant at dawn and maintain harmony in your domestic dwelling.",
      ],
    },
    5: {
      hinglish: [
        "Apne bacho ya shishyon ko achhe sanskar aur gyan dene me samay bitayein.",
        "Roz Gayatri Mantra ka 11 ya 21 baar dhyanpurna jaap karein.",
        "Kisi vidyalaya me kitabon ya stationery ka daan karein.",
      ],
      english: [
        "Invest dedicated time in nurturing moral clarity and intellectual curiosity in children or proteges.",
        "Recite the luminous Gayatri Mantra with focused contemplation to sharpen intuitive buddhi.",
        "Donate foundational literature or study supplies to schools or community libraries.",
      ],
    },
    6: {
      hinglish: [
        "Krodh aur bahasbazi ko gyan aur kshama se shant karein.",
        "Hospital ke mareezon ko nutritious khana ya peele phal bhent karein.",
        "Guruvar ke din kisi sadhu ya sant ki silent seva karein.",
      ],
      english: [
        "Dissolve workplace or contractual antagonism with intellectual patience and ethical restraint.",
        "Distribute nutritious fresh fruit to hospital recovery wards or convalescing patients.",
        "Support selfless spiritual seekers or renunciates with humble, dignified hospitality.",
      ],
    },
    7: {
      hinglish: [
        "Apne jeevan-saathi ke gyan aur unki advice ko poora samman dein.",
        "Business me kisi bhi anaitik (unethical) faayde se saaf inkaar karein.",
        "Mandir me chane ki daal ya peele phool arpit karein.",
      ],
      english: [
        "Value and consult your partner's counsel with deep equality and intellectual respect.",
        "Unequivocally refuse unethical commercial shortcuts; anchor business deals in total transparency.",
        "Present yellow blossoms or split Bengal gram at a sacred shrine in gratitude for partnership.",
      ],
    },
    8: {
      hinglish: [
        "Gupt vidya, astrology ya deep research me samay lagayein parantu ahankaar na karein.",
        "Guruvar ko kisi gurukul ya ashram me aashirwad lene jayein.",
        "Vishnu Sahasranama ka shravan ya path karein.",
      ],
      english: [
        "Dedicate quiet hours to profound esoteric science, philosophy, or investigative research with humility.",
        "Visit a traditional learning seat or mentor on Thursday to absorb grounding perspective.",
        "Listen to the rhythmic recitation of the Vishnu Sahasranama to harmonize inner frequency.",
      ],
    },
    9: {
      hinglish: [
        "Apne kul-guru, mata-pita aur shikshakon ke charan sparsh karein.",
        "Kisi tirth-yatra ya dharamik sthal par jakar shant baithkar dhyan karein.",
        "Dharma aur gyan ke prachar me sahyog karein.",
      ],
      english: [
        "Bow reverently before ancestral teachers, spiritual preceptors, and venerable elders.",
        "Visit an ancient heritage pilgrimage site to sit in quiet meditative stillness.",
        "Support the preservation and transmission of authentic classical wisdom and ethics.",
      ],
    },
    10: {
      hinglish: [
        "Apne profession me gyan aur ethical principles ka palan karein.",
        "Juniors ko mentor karein aur unke vikas me prerna banein.",
        "Guruvar ke din peeli daal ya khichdi ka bhandara karein.",
      ],
      english: [
        "Operate as an ethical anchor at work; let fairness and wisdom define your leadership style.",
        "Actively mentor upcoming colleagues and foster their professional growth with generosity.",
        "Sponsor or serve warm turmeric khichdi at community feeding centers on Thursdays.",
      ],
    },
    11: {
      hinglish: [
        "Apne network aur dosto me gyan aur prerna ka aadaan-pradaan karein.",
        "Kamai me se dharmik aur shaikshanik daan niyamit nikaalein.",
        "Bade bhai-behnon ke prati aadar aur sahyog ka bhav rakhein.",
      ],
      english: [
        "Enrich your network with inspiring intellectual dialogue and constructive initiatives.",
        "Regularly channel a percentage of profit toward educational upliftment and community institutions.",
        "Maintain warm, supportive relations with elder siblings and mentors.",
      ],
    },
    12: {
      hinglish: [
        "Sone se pehle dhyan karein aur man ke bojh ko Ishwar ko samarpit karein.",
        "Kisi adhyatmik ashram ya gurukul me gupt daan karein.",
        "Bina kisi prachar ke kisi be-sahara vyakti ki shiksha me madad karein.",
      ],
      english: [
        "Surrender mental anxieties in quiet evening meditation before retiring to rest.",
        "Offer anonymous, unrecorded financial support to a spiritual retreat or school of philosophy.",
        "Quietly sponsor the education of a fatherless or vulnerable youth without public announcement.",
      ],
    },
  },
  // Default remedies for other planets mapped dynamically
  Mars: {
    1: {
      hinglish: [
        "Roz subah Sheetali ya Anulom-Vilom pranayama se pitta aur gusse ko control karein.",
        "Lal anar ya gur-chane ka sevan karein aur bhaiyon se sauhard banaye rakhein.",
        "Hanuman Chalisa ka niyamit path karein.",
      ],
      english: [
        "Practice alternate-nostril breathwork at sunrise to regulate internal heat and reactive adrenaline.",
        "Nourish your physical constitution with wholesome pomegranate or jaggery; foster harmony with brothers.",
        "Recite the Hanuman Chalisa to cultivate disciplined physical courage and selfless loyalty.",
      ],
    },
    // Fallback template for any house
    4: {
      hinglish: [
        "Ghar me krodh aur tezi se bachein; kitchen me safai aur shanti rakhein.",
        "Mangalwar ko bandaron ko kele ya chane khilayein.",
        "Ghar ke male sadasyon ke sath prem-purvak batchit karein.",
      ],
      english: [
        "Guard domestic harmony against reactive anger; keep kitchen and hearth clean.",
        "Offer fresh bananas or roasted chickpeas to community animals on Tuesdays.",
        "Engage male relatives and brothers with respectful warmth and calm reassurance.",
      ],
    },
    7: {
      hinglish: [
        "Jeevan-saathi se batchit me aavesh aur aakramakata se bachein.",
        "Mangalwar ko masoor ki daal ka daan karein.",
        "Partnership ke disputes ko shaanti se discuss karein.",
      ],
      english: [
        "Consciously avoid combative tone or passive aggression in marital communication.",
        "Offer whole red lentils to charity on Tuesdays to temper planetary friction.",
        "Address commercial or partnership disagreements through structured, measured dialogue.",
      ],
    },
    10: {
      hinglish: [
        "Workplace par lead lene se pehle team ke sath coordination banaye rakhein.",
        "Apni physical stamina aur sahas ko constructive projects me lagayein.",
        "Mangalwar ko kisi police karmi ya sainik ka samman karein.",
      ],
      english: [
        "Lead corporate initiatives with collaborative teamwork rather than authoritarian impulse.",
        "Channel dynamic courage into breakthrough projects requiring high stamina and focus.",
        "Acknowledge and respect frontline defense or emergency service personnel with courtesy.",
      ],
    },
  },
  Rahu: {
    4: {
      hinglish: [
        "Ghar me se kharab electronic gadgets, uljhi hui taarein aur junk hatayein.",
        "Sone se 1 ghanta pehle digital screens band karein.",
        "Chandan ka tilak lagayein aur safai ka dhyan rakhein.",
      ],
      english: [
        "Purge defective electronic cables, dead appliances, and cluttered attic junk from your home.",
        "Power down digital monitors 60 minutes prior to sleep to quiet mental overstimulation.",
        "Apply cooling sandalwood paste and maintain uncluttered visual order in your home.",
      ],
    },
    8: {
      hinglish: [
        "Rat ko overthinking aur conspiracy theories se door rahein.",
        "Nange pair ghaas par chalkar ground rahein.",
        "Kutton ko roti khilayein aur nasha chhodkar satvik rahein.",
      ],
      english: [
        "Avoid late-night rabbit-holes of online speculation and speculative anxieties.",
        "Walk barefoot on morning dew or grass to ground volatile mental currents into the earth.",
        "Care for community dogs and avoid intoxicating substances to maintain clear perception.",
      ],
    },
    11: {
      hinglish: [
        "Social media par artificial dikhawe se door rehkar real network banayein.",
        "Kisi bhi risky crypto ya get-rich-quick scheme se door rahein.",
        "Gareeb logon me bhojan baantein.",
      ],
      english: [
        "Cultivate grounded, in-person relationships rather than chasing superficial digital metrics.",
        "Steer clear of speculative crypto gambles or overnight wealth promises.",
        "Distribute fresh, hearty food to vulnerable community members quietly.",
      ],
    },
  },
  Ketu: {
    12: {
      hinglish: [
        "Roz 15 minute shant dhyan karein aur purani chintaon ko chhod dein.",
        "Kutton ko doodh aur roti khilayein.",
        "Anupyogi samaan ko daan karke ghar halka karein.",
      ],
      english: [
        "Practice 15 minutes of silent seated meditation releasing ancestral and past burdens.",
        "Feed stray community animals with loving, attentive care.",
        "Donate possessions you no longer use to cultivate physical and spiritual lightness.",
      ],
    },
    8: {
      hinglish: [
        "Dhyan aur pranayama se antar-drishti ko sthir karein.",
        "Kaale-safed kambal kisi zarooratmand ko daan karein.",
        "Purani choton aur shikayaton ko maaf karke aage badhein.",
      ],
      english: [
        "Anchor intuitive insights through consistent breathwork and still introspection.",
        "Donate a warm dual-tone blanket to vulnerable individuals during chilly seasons.",
        "Practice intentional forgiveness, releasing legacy grievances to free vital inner prana.",
      ],
    },
  },
  Sun: {},
  Venus: {},
  Mercury: {},
  Moon: {},
};

/**
 * Fallback baseline remedies for houses where specific pair is not customized
 */
export function getPlanetHouseRemedy(
  planet: TransitPlanet,
  house: number,
  language: "hinglish" | "english" = "hinglish"
): string[] {
  // Check exact match
  const planetMap = PLANET_HOUSE_REMEDIES[planet];
  if (planetMap && planetMap[house]) {
    return language === "hinglish"
      ? planetMap[house].hinglish
      : planetMap[house].english;
  }

  // Fallback to Saturn / Jupiter corresponding house or planet baseline
  if (planet === "Saturn" || planet === "Rahu" || planet === "Ketu" || planet === "Mars") {
    const saturnFallback = PLANET_HOUSE_REMEDIES.Saturn[house];
    if (saturnFallback) {
      return language === "hinglish"
        ? saturnFallback.hinglish
        : saturnFallback.english;
    }
  }

  // Benefic baseline fallback
  const jupiterFallback = PLANET_HOUSE_REMEDIES.Jupiter[house];
  if (jupiterFallback) {
    return language === "hinglish"
      ? jupiterFallback.hinglish
      : jupiterFallback.english;
  }

  // Universal Sattvic baseline
  if (language === "hinglish") {
    return [
      `House ${house} me sthirta ke liye: Roz subah 15 minute bina kisi phone ya screen ke shant dhyan karein.`,
      "Apne aahar aur vani me shuchita banaye rakhein; kisi ke prati kathor shabd na kahein.",
      "Kisi zarooratmand vyakti ya be-sahara janwar ki silent seva karein.",
    ];
  }

  return [
    `For foundational stability in House ${house}: Practice 15 minutes of quiet, screen-free morning reflection.`,
    "Maintain disciplined truthfulness and warmth in speech; avoid abrasive critique.",
    "Engage in quiet, anonymous service to vulnerable individuals or community animals.",
  ];
}
