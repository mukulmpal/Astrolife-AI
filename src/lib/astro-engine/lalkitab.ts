// ============================================================
// ASTROLIFE LAL KITAB ENGINE v2.0
// Extracted from AstroLife_v20_SwissEphem_Accurac
// Pakka Ghar · Dushman Ghar · Nishaniyan · Upaya
// Takkar Analysis · Rin Siddhant · Activation Ages
// ============================================================

export interface LKPlanet {
    planet:     string;
    icon:       string;
    color:      string;
    house:      number;
    sign:       string;
    retrograde: boolean;
    status:     "pakka" | "dushman" | "sadharan";
    statusLabel:string;
    statusColor:string;
    nishani:    string;
    upaya:      string;
    rin:        string;
    actAge:     number;
    actYear:    number;
    isActNow:   boolean;
    isPast:     boolean;
    friends:    string[];
    enemies:    string[];
  }
  
  export interface LKTakkar {
    p1:     string;
    p2:     string;
    house:  number;
    effect: string;
    icons:  [string, string];
  }
  
  export interface LKRin {
    planet: string;
    icon:   string;
    house:  number;
    rin:    string;
    upaya:  string;
  }
  
  export interface LKResult {
    planets:    LKPlanet[];
    takkars:    LKTakkar[];
    rins:       LKRin[];
    hasPitraRin:boolean;
    summary:    string;
  }
  
  // Planet data input shape
  interface PD {
    house:      number;
    sign:       string;
    signNum:    number;
    retrograde: boolean;
    dignity:    string;
    lon:        number;
  }
  
  // ── Constants ─────────────────────────────────────────────────
  const PLS   = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const PEMO  = ["☉","☽","♂","☿","♃","♀","♄","☊","☋"];
  const PCOL  = ["#f97316","#c084fc","#ef4444","#22c55e","#f59e0b","#ec4899","#60a5fa","#a78bfa","#fb7185"];
  
  // Pakka Ghar (most beneficial houses)
  const LK_PAKKA: Record<string,number[]> = {
    Sun:[1,9,10], Moon:[4], Mars:[1,8], Mercury:[7,10],
    Jupiter:[2,5,9], Venus:[2,7], Saturn:[7,8,10,11], Rahu:[6,12], Ketu:[3,12]
  };
  
  // Dushman Ghar (enemy houses)
  const LK_ENEMY: Record<string,number[]> = {
    Sun:[7], Moon:[8], Mars:[4], Mercury:[1],
    Jupiter:[3,6], Venus:[6], Saturn:[1,4,5], Rahu:[1,5,9], Ketu:[2,7]
  };
  
  // Activation ages
  const LK_ACT_AGE: Record<string,number> = {
    Sun:22, Moon:24, Mars:28, Mercury:34,
    Jupiter:16, Venus:25, Saturn:36, Rahu:42, Ketu:48
  };
  
  // LK Friendly planets
  const LK_FRIENDS: Record<string,string[]> = {
    Sun:["Moon","Mars","Jupiter"], Moon:["Sun","Mercury"],
    Mars:["Sun","Moon","Jupiter"], Mercury:["Sun","Venus"],
    Jupiter:["Sun","Moon","Mars"], Venus:["Mercury","Saturn"],
    Saturn:["Venus","Mercury"], Rahu:["Saturn","Venus"], Ketu:["Mars","Jupiter"]
  };
  
  // LK Enemy planets
  const LK_ENEMY_PLANET: Record<string,string[]> = {
    Sun:["Saturn","Venus","Rahu"], Moon:["Rahu","Ketu"],
    Mars:["Mercury","Saturn"], Mercury:["Moon","Mars"],
    Jupiter:["Venus","Rahu"], Venus:["Sun","Moon"],
    Saturn:["Sun","Moon","Mars"], Rahu:["Sun","Moon"], Ketu:["Venus","Saturn"]
  };
  
  // Rin Siddhant (karmic debts by house)
  const LK_RIN: Record<number,string> = {
    1:"Pitra Rin — karmic debt to father/ancestors. Paternal karma unresolved.",
    2:"Dhan Rin — wealth accumulation blocked by past life debts. Family karma.",
    3:"Bhai Rin — sibling karma. Past life disputes with brothers/sisters.",
    4:"Mata Rin — debt to mother. Maternal lineage karma.",
    5:"Putra Rin — children karma. Past life with children or students.",
    6:"Shatru Rin — enemy karma from past life. Health debts.",
    7:"Patni/Pati Rin — spouse karma. Past life marriage obligations.",
    8:"Mrityu Rin — death karma. Ancestor spirits require propitiation.",
    9:"Guru Rin — debt to teacher/dharma. Spiritual obligations.",
    10:"Karma Rin — career karma. Past life professional debts.",
    11:"Labh Rin — gains karma. Inherited wealth blocked by ancestors.",
    12:"Moksha Rin — liberation debt. Spiritual obligations of highest order."
  };
  
  // Nishaniyan (108 readings — 9 planets × 12 houses)
  const LK_NISHANI: Record<string,Record<number,string>> = {
    Sun:{
      1:"Sone jaisi chamak, chaud matha, confident chaal. Pita ka prabhav bahut zyada. Sarkar se avsar milta hai. Raat ko neend achi hoti hai. Lal rang se shubh.",
      2:"Awaaz mein authority. Ghar mein pita ki baat sabse upar. Paise aate-jaate rehte hain. Sunday ko daan karna zaruri. Family mein gold objects ka mahatva.",
      3:"Bahut saahsi. Chhote safar zyada hote hain. Bhai-behen ke saath meetha-teeta relation. Bhai se juda kuch karma hai.",
      4:"Zameen-jaaydad sarkar ya bade logo se milti hai. Mata ka swabhav dominant. Ghar mein tambe ke bartan rakhna shubh.",
      5:"Raja jaisi mentality. Bachchon mein intelligence. Sarkari lottery ya speculation mein kismet.",
      6:"Dushman der tak nahi tik sakte. Swasthya khud ki laparvahi se khraab hota hai. Sarkari naukri best option.",
      7:"Partner kisi authority figure hoga ya khud authority chahega. Public mein jhagde ho sakte hain. Taamba paani mein bahana helpful.",
      8:"Pita se mila hua kuch purana hoga. Sarkar se kahin na kahin takkar. Dongra ki jagah mein ghee dena.",
      9:"Bhagya bahut achha. Pita dharmik hoga. Teerth yatra life mein zarur hogi.",
      10:"Career ka sabse uchha mukaam. Sarkar ya badi company ka support. Naam aur izzat milti hai.",
      11:"Kamai ke kaafi sources. Bade bhai ka saath rahega. Aankhon ki takleef ho sakti hai.",
      12:"Videsh se rishta ya kamai. Spiritual jagah mein maan milta hai. Aankhon ka dhyan rakhein."
    },
    Moon:{
      1:"Gol chehra, safed ya wheat rung. Emotional aur intuitive nature. Maa bahut kareeb. Neend zyada chahiye. Paani se connection strong.",
      2:"Agar Chandra strong hai to parivar mein bahut sampatti. Bolne ka tarika madhar aur mithas bhara. Mata ki dua se dhan milta hai.",
      3:"Paani ke zariye safar. Bhai-behen ke saath emotional bond. Kabhi kabhi over-emotional ho jaate ho.",
      4:"Chandra ka Pakka Ghar. Mata ka ghar hi swarg hai. Ghar mein water body ya fountain rakhna bahut shubh. Maa ki umar lambi.",
      5:"Creative aur gifted bachchey. Kalaa mein talent. Prem mein bhavuk — heart se sochte ho.",
      6:"Swasthya sensitive hai. Emotional pain ko andar rakhne ki aadat. Maa ki seva karo.",
      7:"Sunder aur emotional partner milta hai. Public ke saath emotional connection strong.",
      8:"Maa ki sehat ka dhyan rakhna. Purani property ya inheritance ka kuch mudda ho sakta hai.",
      9:"Dharmik maa. Bhagya logon ke zariye milta hai. Higher education mein safalta.",
      10:"Public facing career. Maa khud kuch karte hain professionally.",
      11:"Logon se income. Ladies ke beech popularity.",
      12:"Ek lambe safar ka sambandh — ya videsh mein kuch time. Spiritual jeevan ki taraf rujhaan."
    },
    Mars:{
      1:"Pehlwaan jaisi body ya athletic build. Sir ya face pe koi nishan hota hai. Bhai bahut important hote hain. Anger control karna padega.",
      2:"Bolne mein seedha aur kabhi teekha. Parivar mein paise ke mudde pe bhai sharif hote hain. Masoor ki daal se rishta.",
      3:"Akhada, khel, ya military energy. Bhai-behen kaafi saahsi hote hain ya aap unhe lead karte ho.",
      4:"Zameen ke mudde pe jhagda. Maa ko kabhi kabhi health issues. Ghar mein accidents se bachao.",
      5:"Competitive bachchey ya aap khud bahut competitive. Sports ya speculation mein energy lagao.",
      6:"Dushmanon ko khatam kar sakte ho. Athletic peak period aayega. Blood donation karo.",
      7:"Jazbati aur energetic partner. Business mein dum hai. Tamba nadi mein bahana helpful.",
      8:"Accidents se bachao — but long life bhi hai agar Mars strong ho. Occult energy strong.",
      9:"Dharm aur kaarya dono ka sangam. Pilgrimage in life is certain.",
      10:"Engineering, surgery, military, ya sports career best rahega.",
      11:"Zameen se kamai. Physical mehnat se paise.",
      12:"Chhupi dushmani. Videshon mein mehnat."
    },
    Mercury:{
      1:"Chehra jawaan dikhta hai. Dual personality — ek public aur ek private. Bahut clever.",
      2:"Business ka zehan. Haath se paise banana aata hai. Likhne ka talent.",
      3:"Lekhak, patrakar, ya teacher. Chhote safar kaafi hote hain.",
      4:"Padhia-likha parivar. Maa samajhdar aur educated. Multiple gaadiyaan possible.",
      5:"Bachchon mein shaandar aql. Share market mein aql se kaam lo.",
      6:"Medical ya analytical career. Health management mein excel karte ho.",
      7:"Business partnerships best hain. Life partner intelligent hoga.",
      8:"Research aur investigation mein dil lagata hai. Occult mein bhi interest.",
      9:"Kaanoon ya foreign education. Dharmik lekhan.",
      10:"Business, media, ya teaching mein career ka shikhhar.",
      11:"Aql se kamai. Multiple income streams.",
      12:"Videsh mein business ya spiritual lekhak."
    },
    Jupiter:{
      1:"Bhari body ya bada qaad. Peelapan skin tone mein. Bahut udaar dil. Samaj mein izzat.",
      2:"Parivar sabse dhani log hain ya honge. Gyan aur paisa saath saath.",
      3:"Dharmik bhai-behen ya aap unhe guru ki tarah guide karte ho. Teerth yatra in life.",
      4:"Uchchi padhai ka ghar. Maa educated ya dharmik. Ghar mein sukh.",
      5:"Bahut hoshiyaar bachchey. Teaching ya advising karoge. Investments wise honge.",
      6:"Aadatein spiritual rakho. Dushmano ko gyan se harao.",
      7:"Ek noble aur wise partner. Dharmic business.",
      8:"Aapki rakhsha hoti hai bade sankat mein. Guru ki kripa hoti hai.",
      9:"Sabse zyada bhagyashali house for Jupiter. Guru ki dua, pilgrimage, aur fortune.",
      10:"Education, dharm, ya law mein career. Leadership with wisdom.",
      11:"Lagaataar labh aur blessings. Bahut gains.",
      12:"Spiritual liberation. Videsh mein gyan ka prasaar. Charitable heart."
    },
    Venus:{
      1:"Sunder ya attractive personality. Kalaakaar swabhav. Charm jo sab par asar karta hai.",
      2:"Sundar parivar. Luxury ghar. Kamai kalaon se.",
      3:"Kala mein talent. Sundar bhai-behen. Chhote anandaayak safar.",
      4:"Luxury ghar. Maa khush aur samridhh. Sundar property.",
      5:"Romantic aur creative bachchey. Prem mein gahraai.",
      6:"Aashiqi ka khatra. Saundarya seva mein career. Beauty se swasthya.",
      7:"Sabse zyada shubh house for Venus. Bahut sundar partner.",
      8:"Chhupe rahasya aur sukh. Spouse ke zariye sampatti.",
      9:"Dharmik kalaon mein kamai. Bhagya beauty se.",
      10:"Entertainment, film, ya fashion career.",
      11:"Luxury products se income. Kalaon mein kamai.",
      12:"Videsh mein anandaayak anubhav. Mukti prem se."
    },
    Saturn:{
      1:"Kaale ya saanwle rang. Patle ya serious look. Disciplined life — late lagta hai lekin poora milta hai.",
      2:"Parivar mein early separation ya dukh. Hard work se hi dhan milta hai.",
      3:"Mehnat pasand. Late success in writing or media.",
      4:"Maa ki sehat ka dhyan rakhna. Property mein der. Purana ghar.",
      5:"Bachchon mein der. Disciplined education — practical approach.",
      6:"Sarvashrestha house for Saturn. Sab dushman toot jaate hain.",
      7:"Late marriage. Disciplined ya bade umar ka partner.",
      8:"Long life — if Saturn strong. Karma ka hisab milta hai.",
      9:"Spiritual discipline lagti hai. Pita ke saath kuch karma.",
      10:"Career mein kaafi mehnat — lekin ek din uchhai milti hai.",
      11:"Dheere lekin pakka income. Purane networks valuable.",
      12:"Videsh mein disciplined jeewan. Seva se mukti."
    },
    Rahu:{
      1:"Alag sa dikhna — foreign-like ya unusual appearance. Unconventional soch.",
      2:"Parivar mein halkhal. Awaaz mein kuch alag. Foreign family members.",
      3:"Videsh se unique skills. Bhai-behen alag hote hain ya alag jagah jaate hain.",
      4:"Zameen foreign sources se. Maa unusual personality.",
      5:"Alag bachchey ya unusual events with children. Pitra Dosh possible.",
      6:"Sabse zyada shubh house for Rahu. Sab dushman khatam hote hain.",
      7:"Foreign ya alag type ka partner. Unconventional marriage.",
      8:"Occult mein special abilities. Achanak events.",
      9:"Pitra Dosh zarur check karo. Pita videsh se jude ho sakte hain.",
      10:"Career mein achanak changes. Foreign career possible.",
      11:"Achanak unexpected gains.",
      12:"Videsh settlement. Unusual raaste se mukti."
    },
    Ketu:{
      1:"Rahasyamay personality. Spiritual nature. Shareer pe koi nishan.",
      2:"Bolne mein dikkat ya parivar se alag rehna. Spiritual values.",
      3:"Spiritual saahsi. Past life skills in communication.",
      4:"Ghar se aasakti nahi. Spiritual maa. Purani property.",
      5:"Spiritual bachchey. Past life creativity.",
      6:"Rogo aur dushmanon ko spiritually naash karta hai.",
      7:"Spiritual partnership. Pati/patni se detachment bhi hoga.",
      8:"Past life occult knowledge. Liberation path.",
      9:"Pita ke saath deep spiritual karma. Renunciation possible.",
      10:"Spiritual career. Sansarik shohrat se virakti.",
      11:"Achanak spiritual gains.",
      12:"Sabse shubh house for Ketu. Poori mukti. Moksha raasta."
    }
  };
  
  // Upaya (remedies)
  const LK_UPAYA: Record<string,Record<number,string>> = {
    Sun:{
      1:"Har roz ugta hua Surya ko jal chadhaen. Tambe ka lota use karein.",
      2:"Nadee mein tambe ka sikka aur gehoon bahaen — Sunday ko.",
      3:"Hanuman ji ki pooja karein. Bhai-behen ke saath rishta achha rakhein.",
      4:"Pita ki seva karein. Mandir mein gehoon ka daan.",
      5:"Surya Namaskar 108 baar roz karein.",
      6:"Surya ko jal chadhaen — Suryoday par.",
      7:"Shaadi se pehle nadee mein tambe ka sikka bahaen.",
      8:"Gehoon + tambe ki cheez + lal kapda daan karein.",
      9:"Surya ko jal + pita ke bhaiyon ko daan.",
      10:"Pita ka aadar karein. Roz Surya ko jal.",
      11:"Andhon ki madad karein. Gehoon ka daan Sunday.",
      12:"Tambe ka sikka bahein. Suryoday pe dhyaan."
    },
    Moon:{
      1:"Chaandi ki anguthi pehnein. Kamre mein paani ka bartan rakhein.",
      2:"Aurtono ko doodh, chawal, chaandi daan karein.",
      3:"Chaandi ka daan karein. Doodh ya paani kabhi mat bechein.",
      4:"Maa ki seva karein. Ghar mein chhoti si chaandi rakhein.",
      5:"Shiv ji ko doodh chadhayein. Yateem bachcho ko daan.",
      6:"Chaandi ke glass mein paani piyein.",
      7:"Monday ko doodh + safed cheezein aurtono ko daan.",
      8:"Chandra ko jal. Moti pehnein.",
      9:"Saas ki seva karein. Monday ko doodh ka daan.",
      10:"Kaam kaarne wali aurtono ka aadar.",
      11:"Ghar ke paas paani ka source banaye rakhein.",
      12:"Bujurga aurtono ki seva. Safed daan."
    },
    Mars:{
      1:"Peepal ya neem lagayen. Blood donation karein.",
      2:"Ped kabhi mat kaatein. Lal masoor ki daal ka daan.",
      3:"Bhai-behen ki madad karein. Ped lagaen.",
      4:"Bhai-behen se rishta theek rakhein. Zameen ke jhagde mat karein.",
      5:"Mangalvar ko lal masoor ka daan.",
      6:"Public jagah pe ped lagaen. Blood donation.",
      7:"Nadee mein tambe ke sikke bahayen.",
      8:"Moonga pehnein. Ghar mein rishta theek rakhein.",
      9:"Mandir mein lal kapda daan.",
      10:"Kaam ki jagah pe ped lagaen.",
      11:"Income ke liye ped lagaen.",
      12:"Mandir mein lal daan. Ped mat kaatein."
    },
    Mercury:{
      1:"Budh-var ko haari ghaas gaay ko khilaen.",
      2:"Behen-massi ko haare rang ki choodiyan dein.",
      3:"Maami ki seva karein.",
      4:"Maasi-nana paksh ki seva karein.",
      5:"Pakshiyon ko daana dein. Haari choodiyan.",
      6:"Panna pehnein. Maami ki seva.",
      7:"Business mein sachchi baat bolein hamesha.",
      8:"Dhokha mat karein. Toton ko khaana dein.",
      9:"Guru ka aadar karein. Kitaben daan karein.",
      10:"Kaam ki jagah pe sachhai rakhein.",
      11:"Budh-var ko haara daan.",
      12:"Gaay ko haari ghaas khilaen."
    },
    Jupiter:{
      1:"Kesar ka tilak lagaen. Bujurgon ke paon choein.",
      2:"Guruvar ko Brahmin ko peeli chizein daan.",
      3:"Bhai-behen ki padhai mein daan.",
      4:"Ghar ke Guru ki pooja karein.",
      5:"Doosron ko sikhaaein. Peela daan.",
      6:"Guruvar ko peela kapda + haldi daan.",
      7:"Roz kesar ka tilak lagaen.",
      8:"Vishnu Sahasranama padhein.",
      9:"Guru ko Dakshina dein.",
      10:"Kaam ki jagah pe kesar ka tilak.",
      11:"Guruvar ko kela + peeli chiz daan.",
      12:"Spiritual sansthaaon ko daan."
    },
    Venus:{
      1:"Aurtono ko safed chawal + shakkar daan.",
      2:"Patni ka aadar karein. Safed daan.",
      3:"Bahan-behen ko Shukravar ko safed daan.",
      4:"Safed gaay rakhein. Ghar mein safed chizein.",
      5:"Shukravar ko safed mithai daan.",
      6:"Sab aurtono ka aadar karein.",
      7:"Best house — patni ka aadar karein. Safed daan regularly.",
      8:"Chaandi + safed chizein daan.",
      9:"Mandir mein safed mithai daan.",
      10:"Female colleagues ki seva.",
      11:"Shukravar ko safed chawal + shakkar daan.",
      12:"Videsh mein safed daan."
    },
    Saturn:{
      1:"Sarson ka tel + kaale til ka daan karein. Kauon ko khaana dein.",
      2:"Shanivar ko garibon ko loha daan.",
      3:"Mazdooron ki madad karein. Kaale til ka daan.",
      4:"Darwaze ke neeche chaandi gaad dein.",
      5:"Budhape ke ghar mein daan. Kauon ko khaana.",
      6:"Excellent position! Roz kuttey ko khaana dein.",
      7:"Nadee mein lohe ki keel bahaayen.",
      8:"Gareeb aur bujurgon ki seva.",
      9:"Shani mandir mein daan.",
      10:"Shani mandir mein tel chadhaen.",
      11:"Purse mein lohe ki keel rakhein.",
      12:"Shanivar ko garib ko kambal daan."
    },
    Rahu:{
      1:"Ghar mein seese ka tukda rakhein.",
      2:"Jhoothe vaade mat karein kabhi.",
      3:"Yateemon ko daan.",
      4:"Dahleez ke neeche chaandi ka varg gaad dein.",
      5:"Purkhon ki pooja karein. Pitra Tarpan.",
      6:"Kuttey ko khaana dein. Best position for Rahu!",
      7:"Bahte paani mein seesa bahaen.",
      8:"Ghar mein gahre neele rang ka kapda rakhein.",
      9:"Niyamit Pitra Tarpan karein.",
      10:"Shortcut mat lo. Koyla daan.",
      11:"Pocket mein seese ka tukda rakhein.",
      12:"Kaala kambal daan."
    },
    Ketu:{
      1:"Roz kuttey ko khaana dein.",
      2:"Sasuaal ka aadar karein.",
      3:"Adhyatmik sadhna karein.",
      4:"Ghar mein kutta paalen.",
      5:"Pitra karya karein.",
      6:"Kutte aur kauo ko khaana dein.",
      7:"Partner ki adhyatmik bhavna ka aadar karein.",
      8:"Dhyan karein. Adhyatmik granth padhein.",
      9:"Santo aur sadhuon ki seva karein.",
      10:"Dharmik netaon ki seva karein.",
      11:"Kuttey ko khaana dein. Adhyatmik daan.",
      12:"Best house for Ketu. Dhyan sadhna karein."
    }
  };
  
  // Takkar effects
  const TAKKAR_EFFECTS: Record<string,string> = {
    "Sun-Saturn": "Pitri dosha + career vs authority conflict. Father health issues possible. Sarkari kaam mein rukawatein.",
    "Sun-Rahu":   "Eclipse energy — ego problems, father health, unusual events. Surya grahan jaisa prabhav.",
    "Moon-Rahu":  "Chandra grahan — emotional turmoil, mother health, mental stress.",
    "Moon-Ketu":  "Past life emotional baggage. Detachment from home and mother.",
    "Mars-Mercury":"Aggressive communication vs logical mind — anger issues, brother-speech conflict.",
    "Mars-Saturn": "Ruk ruk ke mehnat — obstacles in every action. Accident risk high.",
    "Jupiter-Venus":"Guru-Shukra clash — money vs values, education vs relationships.",
    "Jupiter-Rahu": "Guru Chandal Yoga — ethics challenged. Foreign influence on beliefs.",
    "Venus-Saturn": "Love vs discipline conflict. Late marriage or relationship delays.",
    "Sun-Moon":    "Father-mother conflict energy. Emotional and ego tussle in family.",
    "Mars-Ketu":   "Double fire energy — impulsive, accident-prone. Channel into spiritual action.",
  };
  
  // ── MAIN CALCULATOR ───────────────────────────────────────────
  export function calculateLalKitab(
    planets: Record<string,PD>,
    dob: string
  ): LKResult {
    const birthYear = new Date(dob).getFullYear();
    const currentAge = new Date().getFullYear() - birthYear;
  
    // ── Planet cards ──────────────────────────────────────────
    const lkPlanets: LKPlanet[] = PLS.map((planet, pi) => {
      const pd = planets[planet];
      if (!pd) return null;
  
      const h = pd.house;
      const inPakka   = LK_PAKKA[planet]?.includes(h);
      const inDushman = LK_ENEMY[planet]?.includes(h);
  
      const status: "pakka"|"dushman"|"sadharan" =
        inPakka ? "pakka" : inDushman ? "dushman" : "sadharan";
  
      const statusLabel =
        inPakka ? "✅ Pakka Ghar" : inDushman ? "❌ Dushman Ghar" : "⚡ Sadharan";
  
      const statusColor =
        inPakka ? "#22c55e" : inDushman ? "#ef4444" : "#f59e0b";
  
      const nishani = LK_NISHANI[planet]?.[h] ||
        `H${h} mein ${planet} active hai. Life ka yeh area especially highlighted hoga.`;
  
      const upaya = LK_UPAYA[planet]?.[h] ||
        `${planet} ke din upaya karein. 108 baar mantra jaap.`;
  
      const rin = LK_RIN[h] || "";
  
      const actAge  = LK_ACT_AGE[planet] || 25;
      const actYear = birthYear + actAge;
      const isActNow = Math.abs(currentAge - actAge) <= 3;
      const isPast   = currentAge > actAge + 3;
  
      // Friends & enemies in same house
      const friends = (LK_FRIENDS[planet] || [])
        .filter(f => planets[f] && planets[f].house === h);
      const enemies = (LK_ENEMY_PLANET[planet] || [])
        .filter(e => planets[e] && planets[e].house === h);
  
      return {
        planet, icon: PEMO[pi], color: PCOL[pi],
        house: h, sign: pd.sign, retrograde: pd.retrograde,
        status, statusLabel, statusColor,
        nishani, upaya, rin,
        actAge, actYear, isActNow, isPast,
        friends, enemies,
      };
    }).filter(Boolean) as LKPlanet[];
  
    // ── Takkar analysis ───────────────────────────────────────
    const takkars: LKTakkar[] = [];
    PLS.forEach((p1, i) => {
      PLS.forEach((p2, j) => {
        if (j <= i) return;
        if (!planets[p1] || !planets[p2]) return;
        if (planets[p1].house !== planets[p2].house) return;
  
        const isEnemy =
          (LK_ENEMY_PLANET[p1] || []).includes(p2) ||
          (LK_ENEMY_PLANET[p2] || []).includes(p1);
  
        if (isEnemy) {
          const key = [p1, p2].sort().join("-");
          const effect = TAKKAR_EFFECTS[key] ||
            `${p1} aur ${p2} ki aapas mein nahi banti — conflict, delays, mixed results.`;
  
          takkars.push({
            p1, p2,
            house: planets[p1].house,
            effect,
            icons: [PEMO[i], PEMO[j]],
          });
        }
      });
    });
  
    // ── Rin Siddhant ──────────────────────────────────────────
    const rins: LKRin[] = [];
    PLS.forEach((planet, pi) => {
      if (!planets[planet]) return;
      const h = planets[planet].house;
      const isRinPlanet = ["Rahu","Ketu","Saturn","Mars"].includes(planet);
      const isRinHouse  = [6,8,12].includes(h);
      if (isRinPlanet || isRinHouse) {
        rins.push({
          planet,
          icon:  PEMO[pi],
          house: h,
          rin:   LK_RIN[h] || `H${h} — Karmic zone`,
          upaya: LK_UPAYA[planet]?.[h] || "Pitra Tarpan karein. Ancestral karma clear karein.",
        });
      }
    });
  
    const hasPitraRin = rins.some(r =>
      ["Rahu","Sun"].includes(r.planet) && [1,2,5,9].includes(r.house)
    );
  
    // ── Summary ───────────────────────────────────────────────
    const pakkaCount   = lkPlanets.filter(p => p.status === "pakka").length;
    const dushmanCount = lkPlanets.filter(p => p.status === "dushman").length;
    const summary =
      pakkaCount >= 4
        ? `Aapke chart mein ${pakkaCount} planets apne Pakka Ghar mein hain — bahut shubh! Strong material and spiritual foundation.`
        : dushmanCount >= 3
        ? `${dushmanCount} planets Dushman Ghar mein hain — upay bahut important hai. Rin siddhant ka dhyan rakhein.`
        : `Balanced chart — ${pakkaCount} pakka, ${dushmanCount} dushman ghar. Mixed results with focused upay.`;
  
    return { planets: lkPlanets, takkars, rins, hasPitraRin, summary };
  }