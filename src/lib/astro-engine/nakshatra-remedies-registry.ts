// src/lib/astro-engine/nakshatra-remedies-registry.ts
// AstroLife — Authentic 27-Nakshatra Personality & Human-Tone Remedy Registry
// Based strictly on classical shastras and comprehensive oral discourse transcripts.
// Written in warm, descriptive, jargon-free narrative paragraphs for native understanding.

export interface HumanNakshatraGuide {
  id: number;                          // 1 to 27
  name: string;                        // "Ashwini", "Bharani", etc.
  alternateSpelling?: string;          // e.g. "Mula", "Dhanishtha"
  rulingPlanet: string;                // "Ketu", "Venus", "Sun", etc.
  rashiSpan: string;                   // e.g. "Aries 00°00' - 13°20'"
  tattva: "Agni" | "Prithvi" | "Vayu" | "Jala";
  archetypeTitle: string;              // Human title, e.g. "Sankat-Mochak Vaidya (The Emergency Healer)"

  // ── 1. Descriptve Personality Story (Simple & Warm Hinglish) ──
  personalityStoryHinglish: string;    // Warm paragraph on current state of mind & swabhav
  livingArchetypeStoryHinglish: string;// Living historical/mythological archetype from transcript
  
  // ── 2. Vulnerability & Karmic Trap ─────────────────────────
  karmicTrapHinglish: string;          // The exact mistake or trap that ruins their progress
  conductGuardrailHinglish: string;    // Day-to-day behavioral rules (Ghar, parivaar, boli)

  // ── 3. Actionable Remedies (Tangible & Specific) ───────────
  primaryRemedyHinglish: string;       // Fastest-acting primary remedy
  secondaryRemedyHinglish: string;     // Supportive second remedy
  naturePashuSevaHinglish: string;     // Pashu-pakshi, ped, river seva
  
  // ── 4. Timing & Materials ──────────────────────────────────
  timingAndMuhuratHinglish: string;    // Weekday, tithi (Amavasya), 4 AM, etc.
  materials: string[];                 // E.g. ["Gud", "Gehun", "Safed Mithai"]
  
  // ── 5. Golden Rule (Ek Paka Niyam) ─────────────────────────
  goldenRuleHinglish: string;          // Single golden rule to never break
}

export const NAKSHATRA_HUMAN_REGISTRY: Record<number, HumanNakshatraGuide> = {
  1: {
    id: 1,
    name: "Ashwini",
    rulingPlanet: "Ketu",
    rashiSpan: "Aries 00°00' - 13°20'",
    tattva: "Agni",
    archetypeTitle: "Sankat-Mochak Vaidya (The Emergency Healer)",
    personalityStoryHinglish:
      "Aap hamesha har kaam ko turant aur tezi se niptana chahte hain. Aapke andar ek swabhavik doctor ya sankat-mochak baitha hai jo kisi ko musibat me dekh kar khud ko rok nahi paata. Aapka dimag emergency situations me bohot tez chalta hai aur aap logo ko foran relief dena chahte hain.",
    livingArchetypeStoryHinglish:
      "Ashwini devtao ke vaidya (Ashwini Kumaras) ka nakshatra hai. Jaise pratham kiran aate hi andhera gayab ho jaata hai, waise hi Ashwini wale sankat me aayi aatmao ke liye aasha ki kiran bante hain.",
    karmicTrapHinglish:
      "Aapki sabse badi kamzori hai be-sabr hona (impatience). Jaldbazi me aakar adhoore kaam chhod dena, ya be-zuban janwaron ke dukh ko nazar-andaz kar dena aapka dasha fal bigaad deta hai.",
    conductGuardrailHinglish:
      "Kabhi kisi janwar par haath mat uthaiye. Ghar me shanti banaye rakhein aur faisle lene me do pal ka thehraav rakhein.",
    primaryRemedyHinglish:
      "Sadak par koi bhi chot khaya hua ya kasht me dooba pashu (kutta, billi, gay ya ghoda) mile, to uski dava aur ilaaj karwaiye. Ye Ashwini ka sabse bada aur turant asar dikhane wala upay hai.",
    secondaryRemedyHinglish:
      "Agar be-zuban pashu ka ilaaj karwana possible na ho, to kisi zarooratmand gareeb rogi ko dava khareed kar dein.",
    naturePashuSevaHinglish:
      "Pashuon ki chikitsa aur seva. Sunday aur Tuesday ke din thoda sa gud daan karein.",
    timingAndMuhuratHinglish: "Sunday aur Tuesday subah suryoday ke baad.",
    materials: ["Gud (Jaggery)", "Dawaiyaan (Medicines)", "Pashu aahar"],
    goldenRuleHinglish: "Kabhi kisi ahat be-zuban pashu ko bina madad kiye aage mat badhiye.",
  },

  2: {
    id: 2,
    name: "Bharani",
    rulingPlanet: "Venus",
    rashiSpan: "Aries 13°20' - 26°40'",
    tattva: "Prithvi",
    archetypeTitle: "Sahansheel Dharti (The Patient Bearer of Rebirth)",
    personalityStoryHinglish:
      "Bharani ke log jeevan ke kathin modon aur bhaari zimmedariyon ko chupchaap sehte hain. Aapke andar sansar ko naya janam dene jaisi sahansheelta hoti hai. Aap har dukh ko jhel kar bhi wapas khade hone ka jazba rakhte hain.",
    livingArchetypeStoryHinglish:
      "Yama aur Dharamraj ka aashirwad yahan kaam karta hai. Ye nakshatra sankat ko parakhta hai aur shuddh karke heere ki tarah chamkata hai.",
    karmicTrapHinglish:
      "Mahilaon ke prati mann me karva-pan lana ya ghar ki streeyon ka apman karna aapke saare bhagya ke darwaze band kar deta hai.",
    conductGuardrailHinglish:
      "Ghar me patni, maa, behen aur bahar kisi bhi stree ka kabhi apman mat kijiye. Unki aashirwad hi aapki dhal hai.",
    primaryRemedyHinglish:
      "Gareeb aur bhookhe logon ko pet bhar khana khilana Bharani ka sabse shreshtha upay hai. Bhojan me pavitrata rakhein.",
    secondaryRemedyHinglish:
      "Safed mithaai, jaise dudh ki barfi ya chhena, gareeb aur zarooratmand bachchon me baantein. Mithaai safed rang ki honi chahiye.",
    naturePashuSevaHinglish:
      "Bhookhe insaan aur janwar ko annadaan karein. Stree-shakti ka aadar karein.",
    timingAndMuhuratHinglish: "Friday dopahar ya sandhya ke samay.",
    materials: ["Safed barfi ya mithaai", "Bhojan (Annadaan)"],
    goldenRuleHinglish: "Kisi bhi stree ka apman na karein, aur bhookhe ko kabhi khaali pet na lautne dein.",
  },

  3: {
    id: 3,
    name: "Krittika",
    rulingPlanet: "Sun",
    rashiSpan: "Aries 26°40' - Taurus 10°00'",
    tattva: "Agni",
    archetypeTitle: "Pavitra Agni (The Radiant Purifier)",
    personalityStoryHinglish:
      "Krittika Surya ki pavitra agni hai. Aap sachche, seedhe aur nishpaksh hote hain. Galat cheez aapko ek pal me aag-baboola kar deti hai. Aapke chehre par ek tejasvi tej rehta hai aur aap baaton ko ghuma-phirakar bolna pasand nahi karte.",
    livingArchetypeStoryHinglish:
      "Agni Devta ka direct prabhav yahan hota hai. Agni jaise har kachre ko bhasm karke sona nikaalti hai, waise hi Krittika log jhooth ko bardasht nahi karte.",
    karmicTrapHinglish:
      "Rasoi (Kitchen) me aag bekar jalte chhod dena, phone me busy rehna, aur kitchen ko ganda ya bikhra rakhna aapke Surya ko dushit karta hai.",
    conductGuardrailHinglish:
      "Rasoi ko mandir ki tarah saaf rakhein. Kathor bhasha bolne se bachein aur bina baat aag ki tarah mat bhadkein.",
    primaryRemedyHinglish:
      "Agni ka samman karein aur ghar me pavitra havan karein ya Deepak archana karein. Rasoi hamesha saaf-suthri honi chahiye.",
    secondaryRemedyHinglish:
      "Ravivar (Sunday) ke din langar, gurudwara ya mandir me gehun (wheat/kanak) ka daan karein.",
    naturePashuSevaHinglish:
      "Agni ki aarti, kitchen me satvik aahar, aur pashuon ko gehun ki roti.",
    timingAndMuhuratHinglish: "Sunday subah suryoday ke samay.",
    materials: ["Gehun (Kanak/Wheat)", "Havan samagri", "Shuddh ghee ka deepak"],
    goldenRuleHinglish: "Rasoi gandi na rakhein aur agni ka kabhi apman na hone dein.",
  },

  4: {
    id: 4,
    name: "Rohini",
    rulingPlanet: "Moon",
    rashiSpan: "Taurus 10°00' - 23°20'",
    tattva: "Prithvi",
    archetypeTitle: "Mata Ki Godh (The Loving Nurturer)",
    personalityStoryHinglish:
      "Rohini prem, sundarta aur vridhhi ka nakshatra hai. Log aapke vyavhar aur aakarshan ki taraf khinche chale aate hain. Aapko prakriti, hariyali aur sansarik sukhon se gehra prem hota hai. Aapke haath me barkat hoti hai.",
    livingArchetypeStoryHinglish:
      "Bhagwan Chandra ki sabse priya rani Rohini hain. Shri Krishna ka janm bhi Rohini me hua tha, jo prem aur anand ke avatar hain.",
    karmicTrapHinglish:
      "Maa ki baat ko taall dena, maa se behas karna ya unka man dukhi karna aapke jeevan ki barkat ko rok deta hai.",
    conductGuardrailHinglish:
      "Maa ki hamesha aagya maaniye. Ghar ke bagiche me ped-paudhe lagayein aur unhe sookhne na dein.",
    primaryRemedyHinglish:
      "Somwar (Monday) ke din desi gay ko apne haath se hara ghaas khilayein. Gay ka aashirwad seedha Chandra ko bal deta hai.",
    secondaryRemedyHinglish:
      "Subah uthkar sabse pehle apni maa ke charan sparsh karke unka aashirwad lein aur unka man hamesha khush rakhein.",
    naturePashuSevaHinglish:
      "Apne haathon se zyada se zyada chhayadaar aur sundar ped lagayein. Desi gay ki seva karein.",
    timingAndMuhuratHinglish: "Monday subah suryoday ke baad.",
    materials: ["Hara ghaas (Green fodder)", "Ped-paudhe"],
    goldenRuleHinglish: "Maa ka dil kabhi mat dukhana aur prakriti me ped lagate rehna.",
  },

  5: {
    id: 5,
    name: "Mrigashira",
    rulingPlanet: "Mars",
    rashiSpan: "Taurus 23°20' - Gemini 06°40'",
    tattva: "Vayu",
    archetypeTitle: "Satya-Khoji Hiran (The Searching Soul of Truth)",
    personalityStoryHinglish:
      "Aapka mann gyaan aur sachchai ki khoj me hamesha ghoomta rehta hai. Aap chanchal hain aur har nayi cheez ko sikhne ke liye bechain rehte hain. Ek jagah tik kar baithna aapke liye mushkil hota hai.",
    livingArchetypeStoryHinglish:
      "Soma Devta ka amrit aur chanchal hiran ka symbol. Jaise hiran kasturi ki khoj me ghoomta hai, waise hi aap sachche gyaan ki khoj me rehte hain.",
    karmicTrapHinglish:
      "STRICT WARNING: Diya hua vachan ya promise todna, ya aalas me jhooth bolna! Agar aapne kisi ka man toda ya vaada toda, to ye nakshatra aapke bane-banaye kaam bigaad dega.",
    conductGuardrailHinglish:
      "Chahe jaan chali jaye, jo commit karein use pura karein. Jhoothi tasalli kisi ko mat dein.",
    primaryRemedyHinglish:
      "Kisi bhi pyaase insaan ya pashu-pakshi ko thanda paani ya juice pilayein. Pyaas bujhana iska sabse bada upay hai.",
    secondaryRemedyHinglish:
      "5 saal se chhote bachchon ya zarooratmand students ko padhne ki kitaabein bhent karein.",
    naturePashuSevaHinglish:
      "Pashu-pakshiyon ke liye paani ki vyavastha karein.",
    timingAndMuhuratHinglish: "Tuesday aur Wednesday subah ya dopahar.",
    materials: ["Paani ya juice", "Pustakein (Books for kids)"],
    goldenRuleHinglish: "Kabhi kisi ko diya hua promise mat todna aur jhooth se door rehna.",
  },

  6: {
    id: 6,
    name: "Ardra",
    rulingPlanet: "Rahu",
    rashiSpan: "Gemini 06°40' - 20°00'",
    tattva: "Jala",
    archetypeTitle: "Toofan Ke Baad Ka Prakash (The Storm of Shiva)",
    personalityStoryHinglish:
      "Ardra toofan ki tarah tez aur teekha hai. Aapke paas zabardast research mind hai, aap har jhooth ke parde ko cheer kar sach jaan lete hain. Lekin andar ek bhaari emotional toofan chalta rehta hai.",
    livingArchetypeStoryHinglish:
      "Rudra avatar ka prabhav. Ardra toofan laakar sab saaf karta hai taaki naya srijan ho sake.",
    karmicTrapHinglish:
      "DEADLY WARNING: Destructive Anger! Ardra ke prabhav me aadmi gusse me apna sab kuch barbaad kar leta hai aur baad me pachtata hai ki maine ye kya bol diya.",
    conductGuardrailHinglish:
      "Jab bhi gussa aaye, 10 second chup ho jayein aur ek ghoont paani piyein. Apni zubaan se shraap ya baddua mat nikaliye.",
    primaryRemedyHinglish:
      "Bhagwan Shiv Bholenath par thanda kachha doodh aur jal chadhayein, ya Rudrabhishek karwayein.",
    secondaryRemedyHinglish:
      "Kisi bhi zarooratmand ko kapde, joote, khana ya paise se madad karein.",
    naturePashuSevaHinglish:
      "Sadak ke be-sahara logon ko footwear (joote) ya sheetal jal dein.",
    timingAndMuhuratHinglish: "Monday aur Saturday sandhya ke samay.",
    materials: ["Shiva Jalabhishek", "Joote/Kapde (Footwear/Clothing)"],
    goldenRuleHinglish: "Gusse par poora control rakhein aur Shiv ji par jal chadhate rahein.",
  },

  7: {
    id: 7,
    name: "Punarvasu",
    rulingPlanet: "Jupiter",
    rashiSpan: "Gemini 20°00' - Cancer 03°20'",
    tattva: "Jala",
    archetypeTitle: "Dharmi Yoddha (The Resilient Restorer of Righteousness)",
    personalityStoryHinglish:
      "Punarvasu ka matlab hai wapas apna kho-ya hua samman paana. Aap daani, saral aur dharmik mann ke insaan hain. Kitni bhi badi haar ho, aap fir se khade ho jaate hain.",
    livingArchetypeStoryHinglish:
      "Bhagwan Shri Ram aur Bhishma Pitamah ka janm isi nakshatra me hua tha! Ram ji ko Manthara (jo vikalang thi) ki vajah se vanvaas mila, aur Bhishma Pitamah ko Shikhandi ke kaaran shareer chhodna pada.",
    karmicTrapHinglish:
      "DIVYANG WARNING: Kisi bhi sharirik kasht bhugat rahe ya divyang (vikalang/differently-abled) vyakti ka apman karna ya unka mazaak banana bhayanak durbhagya laata hai.",
    conductGuardrailHinglish:
      "Divyang logon se hamesha aashirwad lein, unki madad karein. Guru aur teachers ka poora aadar karein.",
    primaryRemedyHinglish:
      "Gareeb aur zarooratmand parivaar ko annadaan (ration/bhojan) karein. Ghar ko saaf-suthra rakhein aur bhajan-kirtan chalne dein.",
    secondaryRemedyHinglish:
      "Guru-jan, teachers aur buzurgon ke pair chhookar aashirwad lein.",
    naturePashuSevaHinglish:
      "Dharmik sthano par bhojan daan, pakshiyon ko anaj.",
    timingAndMuhuratHinglish: "Thursday subah Guru Hora me.",
    materials: ["Annadaan (Ration)", "Guru bhent"],
    goldenRuleHinglish: "Divyang vyakti ka kabhi mazaak na udayein aur unka aashirwad lete rahein.",
  },

  8: {
    id: 8,
    name: "Pushya",
    rulingPlanet: "Saturn",
    rashiSpan: "Cancer 03°20' - 16°40'",
    tattva: "Jala",
    archetypeTitle: "Nakshatron Ka Samrat (The King of Stars & Pure Seva)",
    personalityStoryHinglish:
      "Geeta me Shri Krishna ne kaha: 'Nakshatron me main Pushya hoon.' Ye nakshatron ka raja hai. Guru aur Shani ka divya mel. Aapke andar sabka bhala karne aur dharm ke raste par chalne ki swabhavik prerana hoti hai.",
    livingArchetypeStoryHinglish:
      "Devguru Brihaspati ka mukhya nakshtra. Jeevan me nishkaam seva aur gyaan ka amrit barsata hai.",
    karmicTrapHinglish:
      "Apne kaam me be-imaani lana, shortcut dhundhna ya dharmik sthano par aakar ahankar dikhana Pushya ke bal ko nasht karta hai.",
    conductGuardrailHinglish:
      "Apne kaam me 100% imaandari rakhein. Doosron ko sikhate waqt vinamra rahein.",
    primaryRemedyHinglish:
      "Mandir ya gurudwara jakar bina kisi swarth ke jhadu lagana, joota-ghar ki seva karna ya safai karna.",
    secondaryRemedyHinglish:
      "Thursday ko peeli haldi ya chana daal daan karein. Gaushala me jakar gay ko nahlayein, paani pilayein aur ghaas khilayein.",
    naturePashuSevaHinglish:
      "Gaushala me bimaar ya kamzor gay ki seva. Padne me kamzor bachche ki school fees bharna.",
    timingAndMuhuratHinglish: "Thursday subah ya Pushya Nakshatra ka din.",
    materials: ["Peeli haldi/chana daal", "Gay ki seva samagri", "School fees donation"],
    goldenRuleHinglish: "Nishkaam seva karein aur kaam me poori sachchai banaye rakhein.",
  },

  9: {
    id: 9,
    name: "Ashlesha",
    rulingPlanet: "Mercury",
    rashiSpan: "Cancer 16°40' - 30°00'",
    tattva: "Jala",
    archetypeTitle: "Naag Ki Gehari Drishti (The Mystic Guardian)",
    personalityStoryHinglish:
      "Ashlesha me saanp jaisi gehari drishti aur teekhi buddhi hoti hai. Aap khatre ko bohot pehle bhaamp lete hain aur koi aapko aasaani se murkh nahi bana sakta.",
    livingArchetypeStoryHinglish:
      "Sarpa Devta ka aashirwad. Saanp shant baitha rehta hai, lekin agar use chheda jaye to uska dank jaan le leta hai.",
    karmicTrapHinglish:
      "Kathor Vaani aur Revenge Grudge! Agar aap kisi se badla lene ki aag me zehar ugalenge, to aapka apna jeevan zaharila ho jayega.",
    conductGuardrailHinglish:
      "Zubaan par control rakhein. Kisi ke marm-sthan par chot na karein aur badle ki aag se bachein.",
    primaryRemedyHinglish:
      "Saperon ke paas bandhe saanp ko khareed kar jungle me azaad karwayein, ya Naag mandir jakar matha tekein.",
    secondaryRemedyHinglish:
      "Gareeb sadhu-santo ya be-sahara buzurg ko garam kambal daan karein.",
    naturePashuSevaHinglish:
      "Sarpa azaadi, van-jeev suraksha, aur vaani me mithaas.",
    timingAndMuhuratHinglish: "Wednesday shaam ya Nag Panchami/Amavasya.",
    materials: ["Blanket (Garam kambal)", "Sarpa mandir puja"],
    goldenRuleHinglish: "Kathor vaani se kisi ka man mat dukhana aur ghamand mat karna.",
  },

  10: {
    id: 10,
    name: "Magha",
    rulingPlanet: "Ketu",
    rashiSpan: "Leo 00°00' - 13°20'",
    tattva: "Agni",
    archetypeTitle: "Raj-Aasan Aur Pitru Kripa (The Crown of Ancestral Honor)",
    personalityStoryHinglish:
      "Magha ka matlab hai Raja! Yahan insaan ko kisi na kisi roop me samman aur raj-aasan milta hai. Log aapko aadar dete hain. Aapke liye dhan-daulat se kayi guna badi aapki izzat aur shohrat hai.",
    livingArchetypeStoryHinglish:
      "Pitru Devta (Ancestors) ka seedha aashirwad. Ye taqat aapki apni nahi, balki aapke purvajon ke dharmi hone ka fal hai.",
    karmicTrapHinglish:
      "Ahankar me aakar parivaar ke buzurgo ko bhool jana, ya purvajon ke sanskar aur paramparaon ko chhod dena.",
    conductGuardrailHinglish:
      "Subah uthkar pita, dada aur purvajon ko pranaam karein. Family traditions ko aage badhayein.",
    primaryRemedyHinglish:
      "Har Amavasya ke din apne purvajon (Pitru) ke naam par gareebon ko bhojan aur daan-punya karein.",
    secondaryRemedyHinglish:
      "Apne kul ke mandir ya purvajon ke sthan ('Jathe') par saal me kam se kam ek baar matha zaroor tekein.",
    naturePashuSevaHinglish:
      "Kavvo (crows) aur be-sahara buzurgo ko bhojan.",
    timingAndMuhuratHinglish: "Har Amavasya ko dopahar 12 baje ke aas-paas.",
    materials: ["Pitru bhojan", "Vastra daan"],
    goldenRuleHinglish: "Bade-buzurgon ki seva karein aur har Amavasya purvajon ko yaad karein.",
  },

  11: {
    id: 11,
    name: "Purva Phalguni",
    alternateSpelling: "Purva Phalguni",
    rulingPlanet: "Venus",
    rashiSpan: "Leo 13°20' - 26°40'",
    tattva: "Agni",
    archetypeTitle: "Vishnu Ka Aaram Aur Sukoon (The Effortless Abundance)",
    personalityStoryHinglish:
      "Bistar par baithe-baithe sab kuch mil jana! Shukra ka aisa aashirwad hota hai ki Bhagwan Vishnu ki tarah aaram karte hue bhi paisa, gaadi, aur sukh aapke paas aate hain. Aapko kala, shringar aur aaram pasand hai.",
    livingArchetypeStoryHinglish:
      "Bhaga Devta (Prosperity & Good Fortune). Inke jeevan me dhan bina bohot zyada bhag-daur ke bhi aasaani se prakat hota hai.",
    karmicTrapHinglish:
      "Excessive Indolence (Hadh se zyada aalas)! Din bhar bistar par pade rehna aur kaam ko taalna aapki kismat ko band kar deta hai.",
    conductGuardrailHinglish:
      "Subah jaldi bistar chhodein. Doosron ki kala aur creativity ki hamesha tareef karein.",
    primaryRemedyHinglish:
      "Chhoti kanyaon ka samman karein, unko mithi cheez khilayein. Kanyadaan me sahyog karein.",
    secondaryRemedyHinglish:
      "Agar poori shaadi nahi karwa sakte, to kanya ko suhagan ka joda, chudiyan aur shringar ka saaman bhent karein.",
    naturePashuSevaHinglish:
      "Chhoti ladkiyon ko bhojan aur sundar vastu bhent.",
    timingAndMuhuratHinglish: "Friday subah ya sandhya ke samay.",
    materials: ["Suhagan joda/chudiyan", "Shringar samagri", "Safed mithai"],
    goldenRuleHinglish: "Aalas chhodo, aur kanyaon ko samman aur shringar bhent karo.",
  },

  12: {
    id: 12,
    name: "Uttara Phalguni",
    alternateSpelling: "Uttara Phalguni",
    rulingPlanet: "Sun",
    rashiSpan: "Leo 26°40' - Virgo 10°00'",
    tattva: "Prithvi",
    archetypeTitle: "Sulah-Karvane Wala Mitra (The Noble Peacemaker)",
    personalityStoryHinglish:
      "Surya ka aashirwad. Aap samaj me sammanit aur nyay-priya vyakti hain. Aap aapas me ladne wale do parivaaron ya pakshon me samjhauta (peace) karwane ki anokhi taqat rakhte hain.",
    livingArchetypeStoryHinglish:
      "Aryaman Devta (The God of Friendship and Patronage). Dost aur samajik rishte inki taqat hote hain.",
    karmicTrapHinglish:
      "STRICT WARNING: Apne doston ke circle me kisi ke saath dhokha, vishwasghaat ya thagi mat kijiye. Dost ko dhokha dena yahan barbaad karta hai.",
    conductGuardrailHinglish:
      "Doston ke prati imaandar rahein. Do ladte hue logon me shanti karwayein.",
    primaryRemedyHinglish:
      "Do parivaar ya doston ke beech chalkar sulah (samjhauta) karwa dena — ye iska sabse bada kripa-dayak upay hai.",
    secondaryRemedyHinglish:
      "Tambe ke lote me paani aur thoda gud milakar Peepal ke ped ki jadd me chadhayein.",
    naturePashuSevaHinglish:
      "Peepal ped ki jadd me jal aur gud, pakshiyon ko gehun.",
    timingAndMuhuratHinglish: "Sunday subah suryoday ke samay.",
    materials: ["Tamba lota", "Gud aur jal", "Peepal tree seva"],
    goldenRuleHinglish: "Doston ko dhokha mat dena aur ladne walo me samjhauta karwana.",
  },

  13: {
    id: 13,
    name: "Hasta",
    rulingPlanet: "Moon",
    rashiSpan: "Virgo 10°00' - 23°20'",
    tattva: "Prithvi",
    archetypeTitle: "Kala-Kriti Ka Jaadu (The Blessed Crafting Hands)",
    personalityStoryHinglish:
      "Hasta ka symbol haath hai. Aapke haathon me jaadu hai — chahe art ho, writing ho, technical kaam ho ya koi bhi shilpkala. Aap sansar bhar ka aashirwad sametne wale kripalu insaan hain.",
    livingArchetypeStoryHinglish:
      "Savitur (Surya Devta) ki creative urja. Haathon se kiye gaye har karm me safalta milti hai.",
    karmicTrapHinglish:
      "DOUBLE WARNING: Khane ka apman karna ('ye kya banaya hai, swad nahi hai') aur skilled karigaron (carpenter, electrician) par chidna aur unka apman karna.",
    conductGuardrailHinglish:
      "Thaali me khane ki burai kabhi na karein. Karigaron ki mehnat ka poora aadar karein.",
    primaryRemedyHinglish:
      "Guru, mata-pita aur buzurgon ke pairon me haath lagakar unka aashirwad lein.",
    secondaryRemedyHinglish:
      "Apne haathon se kisi gareeb ke ghar banane me madad karein (cement, int ya khana dekar).",
    naturePashuSevaHinglish:
      "Mazdooron aur karigaron ko bhojan aur samman.",
    timingAndMuhuratHinglish: "Monday subah charan sparsh aur daan.",
    materials: ["Makaan nirmaan samagri", "Bhojan daan"],
    goldenRuleHinglish: "Khane ka apman mat karna aur karigaron ki mehnat ki kadar karna.",
  },

  14: {
    id: 14,
    name: "Chitra",
    rulingPlanet: "Mars",
    rashiSpan: "Virgo 23°20' - Libra 06°40'",
    tattva: "Vayu",
    archetypeTitle: "Vishwakarma Ki Sundarta (The Architect of Wonders)",
    personalityStoryHinglish:
      "Mangal ka nakshatra aur Vishwakarma ji ki urja. Aapko sundarta, architecture, design, painting, kavita aur chamak-damak bohot lubhati hai. Aap har jagah perfection chahte hain.",
    livingArchetypeStoryHinglish:
      "Tvashtar (The Celestial Artisan). Chamakdaar moti jaisi sundarta create karne ki kshamata.",
    karmicTrapHinglish:
      "Ghar me kooda-karkat aur gandagi jama hone dena. Karigaron ki mehnat ko kam aankna.",
    conductGuardrailHinglish:
      "Ghar ko aaine ki tarah saaf rakhein. Kala-karon ki tareef karein.",
    primaryRemedyHinglish:
      "Tuesday ke din mandir jakar Hanuman ji ke aage sarson ya chameli ke tel ka diya jalayein.",
    secondaryRemedyHinglish:
      "Kala-kar, painter, poet aur haath se kaam karne wale karigaron ki tareef aur aadar karein.",
    naturePashuSevaHinglish:
      "Ghar ki deep cleaning, Hanuman mandir me diya.",
    timingAndMuhuratHinglish: "Tuesday sandhya ke samay.",
    materials: ["Tel ka deepak", "Hanuman mandir pooja"],
    goldenRuleHinglish: "Ghar ko saaf-suthra rakho aur kalakaron ka aadar karo.",
  },

  15: {
    id: 15,
    name: "Swati",
    rulingPlanet: "Rahu",
    rashiSpan: "Libra 06°40' - 20°00'",
    tattva: "Vayu",
    archetypeTitle: "Mukta Hawa Aur Pakshi Seva (The Free Spirit & Pilgrim's Friend)",
    personalityStoryHinglish:
      "Swatantra soch, khuli hawa aur vyaparik santulan. Aap kisi ke dabav me reh kar kaam nahi kar sakte. Aapka vyavhar hawa jaisa lachila aur aage badhne wala hota hai.",
    livingArchetypeStoryHinglish:
      "Vayu Devta ka prabhav. Taazi hawa aur teerth yatraon se inka durbhagya door hota hai.",
    karmicTrapHinglish:
      "Din bhar AC ke band kamre me ghuse rehna, prakriti se kat jaana, aur sharir ko taazi hawa na dena.",
    conductGuardrailHinglish:
      "Park me ghoomein, shuddh oxygen lein. Yatriyon ka marg-darshan karein.",
    primaryRemedyHinglish:
      "Ghar ki chhat par mitti ke do patra rakhein — ek me paani aur doosre me satnaja (saat anaj) pakshiyon ke liye.",
    secondaryRemedyHinglish:
      "Teerth yatra par jaane wale kisi zarooratmand buzurg ki ticket kata dein ya khana-kharch dekar bhejein.",
    naturePashuSevaHinglish:
      "Pakshiyon ko satnaja aur paani, prakriti me shuddh hawa.",
    timingAndMuhuratHinglish: "Saturday subah chhat par patra rakhna.",
    materials: ["Mitti ke bartan", "Satnaja (7 grains)", "Shuddh paani"],
    goldenRuleHinglish: "Chhat par pakshiyon ko paani-dana do aur khuli hawa me saans lo.",
  },

  16: {
    id: 16,
    name: "Vishakha",
    rulingPlanet: "Jupiter",
    rashiSpan: "Libra 20°00' - Scorpio 03°20'",
    tattva: "Jala",
    archetypeTitle: "Lakshya Aur Dharmik Rasta (The Focused Archer at the Crossroads)",
    personalityStoryHinglish:
      "Vishakha ke jeevan me hamesha do raaste aate hain — ek aasan par galat, doosra kathin par dharmik. Jab aap sahi dharmik rasta chunte hain, to aapka lakshya nishane par lagta hai.",
    livingArchetypeStoryHinglish:
      "Indra aur Agni ki sanyukt taqat. Ye unstoppable focus aur jeet ka nakshatra hai.",
    karmicTrapHinglish:
      "Jaldi safalta paane ke chakkar me doosron ka nuksan karna ya galat raaste par nikal jaana.",
    conductGuardrailHinglish:
      "Dharma ka rasta chunein. Har hafte mandir jakar prarthana karein.",
    primaryRemedyHinglish:
      "Zyada se zyada phal wale ped lagayein — santra, amrud, kela — park ya bagiche me.",
    secondaryRemedyHinglish:
      "Mandir me niyamit seva-puja karein aur gareeb ya sadhu-santo ko kuch na kuch daan dein.",
    naturePashuSevaHinglish:
      "Phal-dar pedon ka ropan aur mandir seva.",
    timingAndMuhuratHinglish: "Thursday subah ya dopahar.",
    materials: ["Phal-dar paudhe (Fruit trees)", "Mandir daan"],
    goldenRuleHinglish: "Dharmik rasta chuno aur phal-dar ped lagate raho.",
  },

  17: {
    id: 17,
    name: "Anuradha",
    rulingPlanet: "Saturn",
    rashiSpan: "Scorpio 03°20' - 16°40'",
    tattva: "Jala",
    archetypeTitle: "Tapasya, Team-Spirit Aur Mitro (The Relentless Ascetic & Ally)",
    personalityStoryHinglish:
      "Shani ka sabse kathin aur tapasvi nakshatra. Yahan insaan aam janta ke beech se nikal kar aisi tapasya karta hai ki bade se bada raja bhi unke aage sir jhukata hai. Struggle inki taqat ban jaata hai.",
    livingArchetypeStoryHinglish:
      "Prime Minister Narendra Modi ji ka janm isi nakshatra me hua hai! Unka pehla sambodhan 'Mitro' hota hai, jo Anuradha ke Mitra Devta ka mukhya prateek hai.",
    karmicTrapHinglish:
      "Akela chalne ki koshish karna, doston ko chhod dena aur paani ko vyarth bahana (Anuradha Scorpio jal rashi me hai).",
    conductGuardrailHinglish:
      "Doston ko saath le kar chalein, team-player banein. Paani ki ek boond bhi waste na karein.",
    primaryRemedyHinglish:
      "Saturday ko sarson ke tel me apna chehra dekhkar chhaya daan karein ya use peepal ke ped ki jadd me dalein.",
    secondaryRemedyHinglish:
      "Apne doston aur team ko hamesha support karein aur unke dukh-dard me saath khade rahein.",
    naturePashuSevaHinglish:
      "Peepal ped me sarson tel, paani ki bachat.",
    timingAndMuhuratHinglish: "Saturday sandhya (sunset) ke samay.",
    materials: ["Sarson tel (Mustard oil)", "Kansya ya loha patra"],
    goldenRuleHinglish: "Doston ko saath lekar chalo aur Shanivar chhaya daan karo.",
  },

  18: {
    id: 18,
    name: "Jyeshtha",
    rulingPlanet: "Mercury",
    rashiSpan: "Scorpio 16°40' - 30°00'",
    tattva: "Jala",
    archetypeTitle: "Parivaar Ka Sanrakshak (The Elder Guardian & Shield)",
    personalityStoryHinglish:
      "Budh ka nakshatra. Parivaar me bade bhai ya sanrakshak jaisi chhavi. Aap musibat ke samay har samasya ko apni chaturai aur gyaan se hal kar lete hain.",
    livingArchetypeStoryHinglish:
      "Indra Devta (The King of Heaven). Sanrakshan dena aur leader ban kar aage chalna inka swabhav hai.",
    karmicTrapHinglish:
      "Ahankar (Ego) aur ghamand me aakar chhote bhai-behenon ko dabana ya unpar chillana.",
    conductGuardrailHinglish:
      "Chhote bhai-behenon se prem karein. Koi bhi bada kaam shuru karne se pehle buzurgon ka aashirwad lein.",
    primaryRemedyHinglish:
      "Chhote bhai-behenon ki dil se dekhbhal karein, unke zaroori kharche uthayein aur unka samman karein.",
    secondaryRemedyHinglish:
      "Ghar ke badon aur teachers ke charan sparsh karke hi koi nayi deal ya safar shuru karein.",
    naturePashuSevaHinglish:
      "Bhai-behenon ki sahayata, buzurgo ka aashirwad.",
    timingAndMuhuratHinglish: "Wednesday subah Budh Hora me.",
    materials: ["Bhai-behenon ke upahaar", "Hari samagri daan"],
    goldenRuleHinglish: "Chhoton se pyar karo, ahankar chhodkar badon ka aashirwad lo.",
  },

  19: {
    id: 19,
    name: "Moola",
    alternateSpelling: "Mula",
    rulingPlanet: "Ketu",
    rashiSpan: "Sagittarius 00°00' - 13°20'",
    tattva: "Agni",
    archetypeTitle: "Jadd Tak Pahunchne Wala Krantikari (The Root Uprooter)",
    personalityStoryHinglish:
      "Moola matlab Jadd (Roots). Aap kisi bhi samasya ko upar-upar se nahi, balki uski jadd tak jaakar ukhaadna jante hain. Aap fearless aur krantikari vicharon wale hote hain.",
    livingArchetypeStoryHinglish:
      "Nirriti (Goddess of Dissolution and Core Truth). Purani sada-gali cheezon ko khatam karke naya aadhar banana.",
    karmicTrapHinglish:
      "STRICT WARNING: Explosive Rage! Moola wale gusse me aakar bante hue kaam ki jadd hi kaat dete hain.",
    conductGuardrailHinglish:
      "Gusse par pahaad jaisa niyantran rakhein. Utawle-pan me rishte mat todiye.",
    primaryRemedyHinglish:
      "Jadon (roots) wale paudhon ki dekhbhal karein — bagwani karein, pedon ki jadd me khad dein aur keede na lagne dein.",
    secondaryRemedyHinglish:
      "Gareebon ko pet bhar annadaan karein aur gusse se koson door rahein.",
    naturePashuSevaHinglish:
      "Pedon ki jadon ki suraksha, bagwani, khet me khad dena.",
    timingAndMuhuratHinglish: "Tuesday aur Saturday subah ke samay.",
    materials: ["Paudhon ki khad/fertilizer", "Annadaan"],
    goldenRuleHinglish: "Pedon ki jadd ki dekhbhal karo aur gusse par kabu rakho.",
  },

  20: {
    id: 20,
    name: "Purva Ashadha",
    alternateSpelling: "Purva Ashadha",
    rulingPlanet: "Venus",
    rashiSpan: "Sagittarius 13°20' - 26°40'",
    tattva: "Agni",
    archetypeTitle: "Ajey Jal-Tarang (The Invincible Purifier)",
    personalityStoryHinglish:
      "Shukra ka aashirwad aur Apas (Jal Devta) ki kripa. Aapke andar kabhi na haarne ka jazba hota hai. Aap hamesha sheetal, tarotaaza aur vijayi mehsoos karte hain.",
    livingArchetypeStoryHinglish:
      "Apas (Cosmic Waters). Paani jaise har raste ko cheer kar nikal jaata hai, waise hi inki vijay tay hoti hai.",
    karmicTrapHinglish:
      "Paani ki barbadi karna, nal khula chhod dena, ya gande jal ko vyarth failana.",
    conductGuardrailHinglish:
      "Paani ko amrit samajhein. Safed kapde zyada pehnein.",
    primaryRemedyHinglish:
      "Pyaase ko shuddh sheetal paani pilayein. Paani ka pyaau lagwayein.",
    secondaryRemedyHinglish:
      "Kisi gaon me talab ya kund khudwane me daan karein, ya water-body revival project me sahyog karein.",
    naturePashuSevaHinglish:
      "Pashu-pakshiyon aur yatriyon ke liye paani ki vyavastha.",
    timingAndMuhuratHinglish: "Friday subah ya dopahar.",
    materials: ["Sheetal paani", "Pyaau seva donation", "Safed vastra"],
    goldenRuleHinglish: "Paani ki barbadi band karo aur pyaase ko paani pilao.",
  },

  21: {
    id: 21,
    name: "Uttara Ashadha",
    alternateSpelling: "Uttara Ashadha",
    rulingPlanet: "Sun",
    rashiSpan: "Sagittarius 26°40' - Capricorn 10°00'",
    tattva: "Prithvi",
    archetypeTitle: "Satya Aur Rashtra Seva Ka Stambh (The Pillar of Universal Victory)",
    personalityStoryHinglish:
      "Surya ka nakshatra aur Vishwadeva ka aashirwad. Aapke mukh par sachchai ka tej hota hai. Samaj aur desh aapke charitra aur nishtha ki vajah se aapka samman karta hai.",
    livingArchetypeStoryHinglish:
      "10 Vishwadevas (Truth, Will, Time, Ancestry, etc.). Satya aur vachan-palan inka sabse bada kavach hai.",
    karmicTrapHinglish:
      "STRICT WARNING: Jhooth bolna aur vachan todna. Is nakshatra ke log agar jhooth bolne lagein, to unka pura patan ho jaata hai.",
    conductGuardrailHinglish:
      "Jo baat kahein, use har kimat par nibhayein. Samaj aur rashtra ke prati kartavya-nishth rahein.",
    primaryRemedyHinglish:
      "Har haal me sach bole aur jo vachan kisi ko diya hai, use praan dekar bhi nibhaayein.",
    secondaryRemedyHinglish:
      "Desh, samaj aur apni biradari ke hit ke liye nishkaam samaj seva karein.",
    naturePashuSevaHinglish:
      "Samajik karya, hospital ya dharmshala me nishkaam seva.",
    timingAndMuhuratHinglish: "Sunday subah suryoday ke samay.",
    materials: ["Satya sankalp", "Samaj seva samagri"],
    goldenRuleHinglish: "Hamesha sach bolo aur diya hua vachan har kimat par nibhao.",
  },

  22: {
    id: 22,
    name: "Shravana",
    rulingPlanet: "Moon",
    rashiSpan: "Capricorn 10°00' - 23°20'",
    tattva: "Vayu",
    archetypeTitle: "Divya Shrota Aur Mandir Seva (The Sacred Listener & Scholar)",
    personalityStoryHinglish:
      "Shravana ka matlab hai Sunna! Aap ek behad shaant, gyaani aur dhyan-magna shrota hain. Log apni takleefein batane aapke paas aate hain kyunki aap dhyan se sunte hain.",
    livingArchetypeStoryHinglish:
      "Bhagwan Vishnu ka aashirwad aur Saraswati ji ka gyaan. Shravana se hi veda aur shastra aage badhe hain.",
    karmicTrapHinglish:
      "Jab buzurg baat kar rahe hon, to beech me unhe tokna, unki baat kaatna ya unsuni kar dena.",
    conductGuardrailHinglish:
      "Badon ki baat shanti se sunein. Guruon ke vachan ko aadar se dharan karein.",
    primaryRemedyHinglish:
      "Bade-buzurg jab bole to chupchap dhyan se suno aur unki baat ko bina tarke maano.",
    secondaryRemedyHinglish:
      "Dharmik aur gyaan ki kitaabein mandir, gurudwara ya public library me bhent karein.",
    naturePashuSevaHinglish:
      "Mandir/gurudwara me safai, jhadu lagana aur joota-ghar ki seva karna.",
    timingAndMuhuratHinglish: "Monday subah ya sandhya ke samay.",
    materials: ["Dharmik pustakein", "Mandir safai seva"],
    goldenRuleHinglish: "Buzurgon ki baat ke beech me mat toko, aur dhyan se suno.",
  },

  23: {
    id: 23,
    name: "Dhanishta",
    alternateSpelling: "Dhanishtha",
    rulingPlanet: "Mars",
    rashiSpan: "Capricorn 23°20' - Aquarius 06°40'",
    tattva: "Vayu",
    archetypeTitle: "Sangeet, Taal Aur Shramik Mitra (The Cosmic Symphony & Labor Champion)",
    personalityStoryHinglish:
      "Mangal ka nakshatra aur Ashta Vasu ka aashirwad. Aapke andar sangeet, taal, rhythm aur timing ki zabardast samajh hoti hai. Dhan-sampatti aapke paas aasaani se aati hai.",
    livingArchetypeStoryHinglish:
      "Ashta Vasus (The Eight Gods of Abundance). Taali, mridang aur shramik mehnat ka yahan samman hota hai.",
    karmicTrapHinglish:
      "Sharirik shram karne wale mazdooron ka haq marna, ya ghar me zang-lage lohe ke kabaad ko jama rakhna.",
    conductGuardrailHinglish:
      "Mazdooron ko unka mehnatana turant dein. Ghar se zang laga loha bahar nikaalein.",
    primaryRemedyHinglish:
      "Mazdoor class ke logon ko unke kaam aane wale auzaar (tools/equipment) khareed kar bhent karein.",
    secondaryRemedyHinglish:
      "Sangeetkar, kalakar aur gayakon ki tareef karein aur unka samman karein.",
    naturePashuSevaHinglish:
      "Shramikon ko auzaar aur bhojan, lohe ke kabaad ka nistaran.",
    timingAndMuhuratHinglish: "Tuesday aur Saturday dopahar ya sandhya.",
    materials: ["Mazdoor auzaar (Tools)", "Sangeet instruments"],
    goldenRuleHinglish: "Mazdooron ko auzaar do aur ghar se zang laga loha bahar phenko.",
  },

  24: {
    id: 24,
    name: "Shatabhisha",
    rulingPlanet: "Rahu",
    rashiSpan: "Aquarius 06°40' - 20°00'",
    tattva: "Vayu",
    archetypeTitle: "Sau Vaidya Aur Nasha-Mukti (The 100 Physicians & Pure Healer)",
    personalityStoryHinglish:
      "Shatabhisha ka matlab hai 100 Vaidya! Aapke andar aisi takat hai ki aap asambhav lagne wali bimariyon ya jhatkon se nikal aate hain. Aap bheed se alag aur futuristic sochte hain.",
    livingArchetypeStoryHinglish:
      "Varuna Devta (Cosmic Waters & Karmic Laws). Ye nakshatra rog-mukti aur gahan bhedon ko janne wala hai.",
    karmicTrapHinglish:
      "DEADLY WARNING: KISI BHI TARAH KA NASHA (Alcohol, Drugs, Smoking, Intoxicants)! Agar Shatabhisha active ho aur aadmi nasha kare, to ye uske dimag aur kismat ko pura nasht kar deta hai.",
    conductGuardrailHinglish:
      "Nashe se 100 kos door rahein. Chhal-kapat se bachein aur saaf niyat rakhein.",
    primaryRemedyHinglish:
      "Kisi bhi zarooratmand mareez ko dawa khareed kar dein ya hospital me kisi gareeb ka ilaaj karwayein.",
    secondaryRemedyHinglish:
      "Bimar logon aur rogis ki seva karein aur dawaon ka daan karein.",
    naturePashuSevaHinglish:
      "Bimar be-sahara logon ki dawa aur seva.",
    timingAndMuhuratHinglish: "Saturday sandhya ke samay.",
    materials: ["Dawaiyaan (Medicines)", "Rog nivaran seva"],
    goldenRuleHinglish: "Kisi bhi tarah ka nasha mat karna aur rogi ko dawa khareed kar dena.",
  },

  25: {
    id: 25,
    name: "Purva Bhadrapada",
    alternateSpelling: "Purva Bhadrapada",
    rulingPlanet: "Jupiter",
    rashiSpan: "Aquarius 20°00' - Pisces 03°20'",
    tattva: "Vayu",
    archetypeTitle: "Gahan Tapasvi Aur Guru Kripa (The Ascetic Sage & Blanket Giver)",
    personalityStoryHinglish:
      "Guru ka mature nakshatra. Aap sansarik dikhawe se upar uthkar gehri adhyatmik baaton ko samajhte hain. Aapka dhyan sidha logon ki aatma ko chhoo leta hai.",
    livingArchetypeStoryHinglish:
      "Aja Ekapada (The Cosmic Fire Serpent). Tapasya, parivartan aur gahan vishleshan ki shakti.",
    karmicTrapHinglish:
      "Kadwi zubaan bolkar kisi ka dil dukhana ya sant-mahapurushon aur guruon ka apman karna.",
    conductGuardrailHinglish:
      "Bhasha me mithaas rakhein. Guruon ka aadar karein aur dharmik sthalon ki safai karein.",
    primaryRemedyHinglish:
      "Gareeb, daridra aur sadhu-santo ko garam kambal (blanket) daan karein.",
    secondaryRemedyHinglish:
      "Dharmik sthano par jakar safai aur nishkaam seva karein. Bhasha kathor na hone dein.",
    naturePashuSevaHinglish:
      "Mandir/ashram me safai, sadhuon ko vastra aur kambal.",
    timingAndMuhuratHinglish: "Thursday shaam ya Shanivar sandhya.",
    materials: ["Kambal (Blankets)", "Dharmik safai samagri"],
    goldenRuleHinglish: "Sadhu-gareeb ko kambal do aur mridu bhasha bolo.",
  },

  26: {
    id: 26,
    name: "Uttara Bhadrapada",
    alternateSpelling: "Uttara Bhadrapada",
    rulingPlanet: "Saturn",
    rashiSpan: "Pisces 03°20' - 16°40'",
    tattva: "Jala",
    archetypeTitle: "Sheshanaga Ka Paataal Gyaan Aur Maun (The Silent Depths & Fish Feeder)",
    personalityStoryHinglish:
      "Shani ka Meena rashi me sagar jaisa nakshatra. Aapke andar paataal ke Sheshanaga jaisa agadh gyaan baitha hai. Aap chupchap reh kar duniya ki sabse badi baatein jaan lete hain.",
    livingArchetypeStoryHinglish:
      "Ahirbudhnya (The Serpent of the Deep Ocean). Gahan dhyan, shanti aur vishva-dharak shakti.",
    karmicTrapHinglish:
      "Faltu ki behes me shabdon ko vyarth karna aur apni shakti ko over-talking me baha dena.",
    conductGuardrailHinglish:
      "Chup rehna (Maun) seekhein. Bina zaroorat behes me mat ulajhiye.",
    primaryRemedyHinglish:
      "Machhliyon ko safed aur kaale til ko aate ke khamir me milakar goliyaan banakar khilayein.",
    secondaryRemedyHinglish:
      "Subah 4:00 baje Brahma Muhurat me uthkar shaanti se dhyan (meditation) aur mantra japa karein. Bhookhon ko khana khilayein.",
    naturePashuSevaHinglish:
      "Machhliyon ko aate-til ki goliyaan khilana.",
    timingAndMuhuratHinglish: "Subah 4:00 AM (Brahma Muhurat) aur Shanivar.",
    materials: ["Safed aur kale til", "Aate ki goliyaan (Dough balls)"],
    goldenRuleHinglish: "Subah 4 baje dhyan karo, chup rehna seekho aur machhliyon ko khana do.",
  },

  27: {
    id: 27,
    name: "Revati",
    rulingPlanet: "Mercury",
    rashiSpan: "Pisces 16°40' - 30°00'",
    tattva: "Jala",
    archetypeTitle: "Karuna Sindhu Aur Anath Seva (The Gentle Shepherd & Orphan Guardian)",
    personalityStoryHinglish:
      "27 nakshatron ka aakhri aur sabse dayalu nakshatra! Aapke andar bezuban janwaron, bachchon aur be-sahara logon ke liye aasu nikal aate hain. Aap sabka dukh door karna chahte hain.",
    livingArchetypeStoryHinglish:
      "Pushan Devta (The Divine Nurturer of Flocks and Travelers). Sabko surakshit paar karwane wala devta.",
    karmicTrapHinglish:
      "Daan karte waqt mann me ahankar ya ghamand ka aana, ya bimaar pashu ki andekhi karna.",
    conductGuardrailHinglish:
      "Daan karte waqt dil se vinamra aur kripalu rahein. Janwaron se gehra prem karein.",
    primaryRemedyHinglish:
      "Gaushala jakar bimaar gay ka ilaaj karwayein, dava-paani dein, kharra aur ghaas khilayein.",
    secondaryRemedyHinglish:
      "Amavasya ke din anath aashram jakar bachchon ko kapde, chocolate, biscuit ya joote baantein.",
    naturePashuSevaHinglish:
      "Bimaar gay ka ilaaj, anath bachchon ki sahayata, teerth yatriyon ke ticket katwana.",
    timingAndMuhuratHinglish: "Amavasya ke din aur Wednesday subah.",
    materials: ["Gay ki dawa aur chara", "Anath bachcho ke kapde/mithai/joote"],
    goldenRuleHinglish: "Bimaar gay ka ilaaj karwao aur Amavasya ko anath bachchon ko daan do.",
  },
};

/**
 * Normalizes nakshatra name to match registry keys.
 */
export function getHumanNakshatraGuideByName(name: string): HumanNakshatraGuide | null {
  if (!name) return null;
  const clean = name.trim().toLowerCase();
  
  for (const guide of Object.values(NAKSHATRA_HUMAN_REGISTRY)) {
    if (guide.name.toLowerCase() === clean) return guide;
    if (guide.alternateSpelling && guide.alternateSpelling.toLowerCase() === clean) return guide;
  }
  
  // Substring match fallback (e.g. "Purva Bhadrapada" vs "PurvaBhadra")
  for (const guide of Object.values(NAKSHATRA_HUMAN_REGISTRY)) {
    if (clean.includes(guide.name.toLowerCase()) || guide.name.toLowerCase().includes(clean)) {
      return guide;
    }
  }

  return null;
}
