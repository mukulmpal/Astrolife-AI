export type Confidence = "high" | "medium" | "low";

export type MusicReferenceType =
  | "film_bollywood"
  | "sufi_qawwali"
  | "bhajan_devotional"
  | "classical_bandish"
  | "modern_fusion"
  | "regional_devotional";

export type MusicReference = {
  title: string;
  artist?: string;
  filmOrAlbum?: string;
  composer?: string;
  year?: number;
  type: MusicReferenceType;
  confidence: Confidence;
  note: string;
  sourceQuery?: string;
};

export type RagaMusicReferenceGroup = {
  ragaId: string;
  ragaName: string;
  aliases?: string[];
  references: MusicReference[];
};

export const ragaMusicReferences: RagaMusicReferenceGroup[] = [
  {
    ragaId: "yaman",
    ragaName: "Yaman",
    aliases: ["Kalyan", "Yaman Kalyan", "Kalyani"],
    references: [
      { title: "Moh Moh Ke Dhaage", artist: "Papon, Monali Thakur", filmOrAlbum: "Dum Laga Ke Haisha", year: 2015, type: "film_bollywood", confidence: "medium", note: "Modern Yaman/Kalyani-family film reference from raga-film song lists.", sourceQuery: "Moh Moh Ke Dhaage Raag Yaman" },
      { title: "Hamesha Tumko Chaha", artist: "Kavita Krishnamurthy, Udit Narayan", filmOrAlbum: "Devdas", year: 2002, type: "film_bollywood", confidence: "medium", note: "Post-1990 classical-style film song associated with Yaman/Kalyani family in popular lists.", sourceQuery: "Hamesha Tumko Chaha Raag Yaman Kalyani" },
      { title: "Aaj Ibaadat", artist: "Javed Bashir", filmOrAlbum: "Bajirao Mastani", year: 2015, type: "film_bollywood", confidence: "medium", note: "Modern classical film reference connected with Yaman/Kalyani family.", sourceQuery: "Aaj Ibaadat Raag Yaman Kalyani" },
      { title: "Ek Dil Ek Jaan", artist: "Shivam Pathak", filmOrAlbum: "Padmaavat", year: 2018, type: "film_bollywood", confidence: "medium", note: "Modern Yaman/Kalyani-family film reference; keep medium because film treatment is cinematic.", sourceQuery: "Ek Dil Ek Jaan Raag Yaman Kalyani" },
      { title: "Aye Hairathe", artist: "Hariharan, Alka Yagnik", filmOrAlbum: "Guru", year: 2007, composer: "A.R. Rahman", type: "film_bollywood", confidence: "medium", note: "Modern classical-influenced film reference linked with Yaman/Kalyani family in raga-song lists.", sourceQuery: "Aye Hairathe Raag Yaman Kalyani" },
      { title: "Jab Deep Jale Aana", artist: "Yesudas, Hemlata", filmOrAlbum: "Chitchor", type: "film_bollywood", confidence: "high", note: "Widely listed as a Yaman/Kalyan based Hindi film song.", sourceQuery: "Jab Deep Jale Aana Raag Yaman" },
      { title: "Chandan Sa Badan", artist: "Mukesh / Lata Mangeshkar", filmOrAlbum: "Saraswatichandra", type: "film_bollywood", confidence: "high", note: "Iconic Yaman/Kalyan film-song reference.", sourceQuery: "Chandan Sa Badan Raag Yaman" },
      { title: "Kabhi Kabhi Mere Dil Mein", artist: "Mukesh, Lata Mangeshkar", filmOrAlbum: "Kabhi Kabhie", type: "film_bollywood", confidence: "medium", note: "Popular Yaman/Kalyan-ang reference; old but iconic.", sourceQuery: "Kabhi Kabhi Mere Dil Mein Raag Yaman" },
      { title: "Aayat", artist: "Arijit Singh", filmOrAlbum: "Bajirao Mastani", year: 2015, type: "film_bollywood", confidence: "medium", note: "Modern classical-influenced film song connected with Kalyan/Yaman family in popular lists.", sourceQuery: "Aayat Bajirao Mastani Raag Yaman" },
      { title: "Laal Ishq", artist: "Arijit Singh", filmOrAlbum: "Ram-Leela", year: 2013, type: "film_bollywood", confidence: "medium", note: "Modern film song with strong classical/Kalyan-ang mood.", sourceQuery: "Laal Ishq Raag Yaman" },
      { title: "Manuva Raam Naam (Raag Yaman)", artist: "Anup Jalota", filmOrAlbum: "Bhajan Bansuri", type: "bhajan_devotional", confidence: "high", note: "Title metadata directly mentions Raag Yaman.", sourceQuery: "Manuva Raam Naam Raag Yaman Anup Jalota" },
      { title: "Sur Yemen Kalyan", artist: "Abida Parveen", filmOrAlbum: "Shah Jo Raag", type: "sufi_qawwali", confidence: "medium", note: "Sindhi Sur / Kalyan-family spiritual reference.", sourceQuery: "Abida Parveen Sur Yemen Kalyan Shah Jo Raag" },
      { title: "Raag Yaman", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical Yaman reference for strict raag listening.", sourceQuery: "Pandit Jasraj Raag Yaman" },
      { title: "Raag Yaman Alap / Instrumental", artist: "Classical instrumental artists", type: "modern_fusion", confidence: "medium", note: "Use for meditative non-film listening.", sourceQuery: "Raag Yaman instrumental fusion meditation" },
    ],
  },

  {
    ragaId: "kedar",
    ragaName: "Kedar",
    references: [
      { title: "Darshan Do Ghanshyam Nath Mori", filmOrAlbum: "Narsi Bhagat", type: "film_bollywood", confidence: "high", note: "Iconic old Kedar reference; kept because it is widely recognised in classical film-song discussions.", sourceQuery: "Darshan Do Ghanshyam Nath Mori Raag Kedar" },
      { title: "Darshan Do Ghanshyam", artist: "Manna Dey / Sudha Malhotra / Chorus", filmOrAlbum: "Narsi Bhagat", type: "film_bollywood", confidence: "medium", note: "Kedar-based film/devotional candidate; verify before marking high.", sourceQuery: "Darshan Do Ghanshyam Raag Kedar" },
      { title: "Bekas Pe Karam Kijiye", artist: "Lata Mangeshkar", filmOrAlbum: "Mughal-E-Azam", type: "film_bollywood", confidence: "medium", note: "Kedar/Kedar-ang candidate in older classical film-song lists.", sourceQuery: "Bekas Pe Karam Kijiye Raag Kedar" },
      { title: "Humko Man Ki Shakti Dena", artist: "Vani Jairam", filmOrAlbum: "Guddi", type: "film_bollywood", confidence: "medium", note: "Devotional-style film song; raag mapping needs verification.", sourceQuery: "Humko Man Ki Shakti Dena Raag Kedar" },
      { title: "Raag Kedar", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical Kedar reference.", sourceQuery: "Pandit Jasraj Raag Kedar" },
      { title: "Kedar Krishna Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Use devotional Kedar references when film examples feel too old.", sourceQuery: "Raag Kedar Krishna bhajan" },
    ],
  },

  {
    ragaId: "bhimpalasi",
    ragaName: "Bhimpalasi",
    references: [
      { title: "Sampurn Sundarkand Raag Bhimpalasi", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Raag Bhimpalasi.", sourceQuery: "Sampurn Sundarkand Raag Bhimpalasi Rasraj Ji Maharaj" },
      { title: "Beena Madhur Madhur Kachhu Bol", artist: "Saraswati Rane", filmOrAlbum: "Ram Rajya", type: "film_bollywood", confidence: "high", note: "Iconic old Bhimpalasi reference from classical film-song discussions.", sourceQuery: "Beena Madhur Madhur Kachhu Bol Raag Bhimpalasi" },
      { title: "Samay O Dhire Chalo", artist: "Bhupen Hazarika", filmOrAlbum: "Rudaali", year: 1993, type: "film_bollywood", confidence: "medium", note: "Post-1990 Bhimpalasi/Abheri-family film reference from raga-film lists.", sourceQuery: "Samay O Dhire Chalo Raag Bhimpalasi Abheri" },
      { title: "Nainon Mein Badra Chhaye", artist: "Lata Mangeshkar", filmOrAlbum: "Mera Saaya", type: "film_bollywood", confidence: "high", note: "Strong Bhimpalasi film-song reference.", sourceQuery: "Nainon Mein Badra Chhaye Raag Bhimpalasi" },
      { title: "Khilte Hain Gul Yahan", artist: "Kishore Kumar", filmOrAlbum: "Sharmeelee", type: "film_bollywood", confidence: "high", note: "Commonly cited Bhimpalasi-based film song.", sourceQuery: "Khilte Hain Gul Yahan Raag Bhimpalasi" },
      { title: "Khoya Khoya Chand", artist: "Mohammed Rafi", filmOrAlbum: "Kala Bazar", type: "film_bollywood", confidence: "medium", note: "Often cited as Bhimpalasi/Bhimpalasi-ang candidate.", sourceQuery: "Khoya Khoya Chand Raag Bhimpalasi" },
      { title: "Raag Bhimpalasi", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical Bhimpalasi reference.", sourceQuery: "Pandit Jasraj Raag Bhimpalasi" },
      { title: "Bhimpalasi Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Devotional listening reference for afternoon/emotional healing mood.", sourceQuery: "Raag Bhimpalasi bhajan" },
    ],
  },

  {
    ragaId: "bageshri",
    ragaName: "Bageshri",
    references: [
      { title: "Radha Na Bole Na Bole Re", artist: "Lata Mangeshkar", filmOrAlbum: "Azad", type: "film_bollywood", confidence: "high", note: "Iconic old Bageshri film reference; useful even though it is pre-1990.", sourceQuery: "Radha Na Bole Na Bole Re Raag Bageshri" },
      { title: "Radha Na Bole Na Bole", artist: "Lata Mangeshkar", type: "film_bollywood", confidence: "medium", note: "Bageshri-ang film-song candidate.", sourceQuery: "Radha Na Bole Raag Bageshri" },
      { title: "Jaag Dard-e-Ishq Jaag", artist: "Hemant Kumar / Lata Mangeshkar", type: "film_bollywood", confidence: "medium", note: "Often cited as Bageshri-based; verify exact treatment.", sourceQuery: "Jaag Dard-e-Ishq Jaag Raag Bageshri" },
      { title: "Chah Barbad Karegi", type: "film_bollywood", confidence: "medium", note: "Bageshri film-song candidate from classical song lists.", sourceQuery: "Chah Barbad Karegi Raag Bageshri" },
      { title: "Raag Bageshri", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical Bageshri reference.", sourceQuery: "Pandit Jasraj Raag Bageshri" },
      { title: "Bageshri Instrumental Meditation", type: "modern_fusion", confidence: "medium", note: "Good night/emotional calming reference.", sourceQuery: "Raag Bageshri instrumental meditation" },
    ],
  },

  {
    ragaId: "bhairav",
    ragaName: "Bhairav",
    references: [
      { title: "Superfast Hanuman Chalisa Raag Bairagi Bhairav", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Raag Bairagi Bhairav. Stored under Bhairav family until Bairagi Bhairav is added as a separate raag.", sourceQuery: "Superfast Hanuman Chalisa Raag Bairagi Bhairav Rasraj Ji Maharaj" },
      { title: "Sundarkand Raag Ahir Bhairav", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Raag Ahir Bhairav. Stored under Bhairav family until Ahir Bhairav is added as a separate raag.", sourceQuery: "Sundarkand Raag Ahir Bhairav Rasraj Ji Maharaj" },
      { title: "Sundarkand Raag Bairagi", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Raag Bairagi. Stored under Bhairav family until Bairagi is added as a separate raag.", sourceQuery: "Sundarkand Raag Bairagi Rasraj Ji Maharaj" },
      { title: "Poochho Na Kaise Maine Rain Bitai", artist: "Manna Dey", filmOrAlbum: "Meri Surat Teri Ankhen", type: "film_bollywood", confidence: "medium", note: "Iconic Ahir Bhairav/Bhairav-family reference. Stored under Bhairav family for now.", sourceQuery: "Poochho Na Kaise Maine Rain Bitai Raag Ahir Bhairav" },
      { title: "Mohe Bhool Gaye Sanwariya", artist: "Lata Mangeshkar", filmOrAlbum: "Baiju Bawra", type: "film_bollywood", confidence: "medium", note: "Bhairav/Bhairav-ang candidate.", sourceQuery: "Mohe Bhool Gaye Sanwariya Raag Bhairav" },
      { title: "Jaago Mohan Pyare", artist: "Lata Mangeshkar", type: "film_bollywood", confidence: "medium", note: "Morning devotional feel; raag verification needed.", sourceQuery: "Jaago Mohan Pyare Raag Bhairav" },
      { title: "Albela Sajan Aayo Re", artist: "Ustad Sultan Khan / Shankar Mahadevan", filmOrAlbum: "Hum Dil De Chuke Sanam", year: 1999, type: "film_bollywood", confidence: "medium", note: "Modern classical film reference; often associated with Ahir Bhairav/Bhairav family.", sourceQuery: "Albela Sajan Aayo Re Raag Bhairav Ahir Bhairav" },
      { title: "Raag Bhairav", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical morning raga reference.", sourceQuery: "Pandit Jasraj Raag Bhairav" },
      { title: "Bhairav Shiva Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Good devotional category for morning spiritual listening.", sourceQuery: "Raag Bhairav Shiva bhajan" },
    ],
  },

  {
    ragaId: "bilawal",
    ragaName: "Bilawal",
    references: [
      { title: "Modern qawwali in raga bilawal", artist: "Nusrat Fateh Ali Khan", type: "sufi_qawwali", confidence: "high", note: "Title metadata directly mentions Raga Bilawal.", sourceQuery: "Nusrat Fateh Ali Khan Modern qawwali in raga bilawal" },
      { title: "Raag Bilawal", artist: "Nusrat Fateh Ali Khan", type: "sufi_qawwali", confidence: "high", note: "Direct raag title in streaming metadata.", sourceQuery: "Nusrat Fateh Ali Khan Raag Bilawal" },
      { title: "Sare Ke Sare Gama Ko Lekar", artist: "Asha Bhosle / Kishore Kumar", filmOrAlbum: "Parichay", type: "film_bollywood", confidence: "low", note: "Bilawal-like major scale educational song; keep low until verified.", sourceQuery: "Sare Ke Sare Gama Ko Lekar Raag Bilawal" },
      { title: "Raag Alhaiya Bilawal", artist: "Classical artists", type: "classical_bandish", confidence: "high", note: "Classical Bilawal-family reference.", sourceQuery: "Raag Alhaiya Bilawal bandish" },
      { title: "Bilawal Morning Instrumental", type: "modern_fusion", confidence: "medium", note: "Bright major-scale morning listening reference.", sourceQuery: "Raag Bilawal instrumental morning" },
    ],
  },

  {
    ragaId: "deshkar",
    ragaName: "Deshkar",
    references: [
      { title: "Raag Deshkar Classical Bandish", type: "classical_bandish", confidence: "high", note: "Reliable Bollywood mapping is limited; use classical reference first.", sourceQuery: "Raag Deshkar classical bandish" },
      { title: "Deshkar Morning Instrumental", type: "modern_fusion", confidence: "medium", note: "Good bright morning instrumental search reference.", sourceQuery: "Raag Deshkar instrumental" },
      { title: "Deshkar Bhajan Reference", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Raag Deshkar bhajan" },
      { title: "Deshkar Film Song Candidates", type: "film_bollywood", confidence: "low", note: "Research-needed bucket for future verified film examples.", sourceQuery: "film songs based on Raag Deshkar" },
    ],
  },

  {
    ragaId: "hamsadhwani",
    ragaName: "Hamsadhwani",
    references: [
      { title: "Tere Naina", filmOrAlbum: "Chandni Chowk To China", year: 2009, type: "film_bollywood", confidence: "medium", note: "Modern film candidate linked with Hamsadhwani in raga-film lists.", sourceQuery: "Tere Naina Chandni Chowk To China Raag Hamsadhwani" },
      { title: "Ja Tose Nahin Bolun Kanhaiya", type: "film_bollywood", confidence: "medium", note: "Often listed as Hamsadhwani film-song reference.", sourceQuery: "Ja Tose Nahin Bolun Kanhaiya Raag Hamsadhwani" },
      { title: "O Chand Jahan Woh Jaye", type: "film_bollywood", confidence: "medium", note: "Hamsadhwani film-song candidate from raag-song lists.", sourceQuery: "O Chand Jahan Woh Jaye Raag Hamsadhwani" },
      { title: "Vatapi Ganapatim", type: "classical_bandish", confidence: "high", note: "Canonical Carnatic Hamsadhwani reference.", sourceQuery: "Vatapi Ganapatim Hamsadhwani" },
      { title: "Hamsadhwani Ganesh Vandana", type: "bhajan_devotional", confidence: "high", note: "Good devotional usage because Hamsadhwani is commonly used for Ganapati kritis.", sourceQuery: "Hamsadhwani Ganesh Vandana" },
      { title: "Hamsadhwani Fusion Instrumental", type: "modern_fusion", confidence: "medium", note: "Bright energetic fusion reference.", sourceQuery: "Hamsadhwani fusion instrumental" },
    ],
  },

  {
    ragaId: "durga",
    ragaName: "Durga",
    references: [
      { title: "Geet Gaya Patharon Ne", type: "film_bollywood", confidence: "medium", note: "Durga-based film-song candidate.", sourceQuery: "Geet Gaya Patharon Ne Raag Durga" },
      { title: "Tu Mera Chand Main Teri Chandni", type: "film_bollywood", confidence: "low", note: "Durga candidate in some lists; verify before using as high confidence.", sourceQuery: "Tu Mera Chand Main Teri Chandni Raag Durga" },
      { title: "Raag Durga Bandish", type: "classical_bandish", confidence: "high", note: "Classical Durga reference for strict raga learning.", sourceQuery: "Raag Durga bandish" },
      { title: "Durga Devi Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Devotional bucket; not every Devi bhajan is Raag Durga, so keep medium/low unless exact raag is listed.", sourceQuery: "Raag Durga Devi bhajan" },
      { title: "Durga Instrumental Meditation", type: "modern_fusion", confidence: "medium", note: "Peaceful pentatonic mood reference.", sourceQuery: "Raag Durga instrumental meditation" },
    ],
  },

  {
    ragaId: "desh",
    ragaName: "Desh",
    references: [
      { title: "Krishna Re - Based on Raag Desh", artist: "Anup Jalota", type: "bhajan_devotional", confidence: "high", note: "Title metadata commonly lists it as based on Raag Desh.", sourceQuery: "Anup Jalota Krishna Re Based on Raag Desh" },
      { title: "Vande Mataram", type: "film_bollywood", confidence: "medium", note: "Desh/Desh-ang patriotic reference; version-specific verification needed.", sourceQuery: "Vande Mataram Raag Desh" },
      { title: "Aye Mere Watan Ke Logon", artist: "Lata Mangeshkar", type: "film_bollywood", confidence: "medium", note: "Frequently connected with Desh/Desh-ang patriotic mood.", sourceQuery: "Aye Mere Watan Ke Logon Raag Desh" },
      { title: "Raag Des", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical raag reference.", sourceQuery: "Pandit Jasraj Raag Des" },
      { title: "Desh Monsoon Instrumental", type: "modern_fusion", confidence: "medium", note: "Excellent for monsoon, longing and patriotic mood.", sourceQuery: "Raag Des instrumental monsoon" },
    ],
  },

  {
    ragaId: "khamaj",
    ragaName: "Khamaj",
    references: [
      { title: "Aayo Kahan Se Ghanshyam", type: "film_bollywood", confidence: "high", note: "Classic Khamaj-based reference.", sourceQuery: "Aayo Kahan Se Ghanshyam Raag Khamaj" },
      { title: "Mora Gora Ang Lai Le", artist: "Lata Mangeshkar", filmOrAlbum: "Bandini", type: "film_bollywood", confidence: "medium", note: "Khamaj/Khamaj-ang candidate.", sourceQuery: "Mora Gora Ang Lai Le Raag Khamaj" },
      { title: "Vaishnav Jan To", type: "bhajan_devotional", confidence: "medium", note: "Often treated in Khamaj/Khamaj-ang devotional style.", sourceQuery: "Vaishnav Jan To Raag Khamaj" },
      { title: "Raag Khamaj Thumri", type: "classical_bandish", confidence: "high", note: "Khamaj is very strong in thumri/light-classical tradition.", sourceQuery: "Raag Khamaj thumri" },
      { title: "Khamaj Fusion / Thumri Instrumental", type: "modern_fusion", confidence: "medium", note: "Good romantic/light-classical reference.", sourceQuery: "Raag Khamaj fusion thumri instrumental" },
    ],
  },

  {
    ragaId: "behag",
    ragaName: "Behag",
    aliases: ["Behaag", "Bihag"],
    references: [
      { title: "Tere Sur Aur Mere Geet", artist: "Lata Mangeshkar", type: "film_bollywood", confidence: "medium", note: "Common Bihag/Behag film-song candidate.", sourceQuery: "Tere Sur Aur Mere Geet Raag Bihag" },
      { title: "Zindagi Ke Safar Mein", artist: "Kishore Kumar", type: "film_bollywood", confidence: "low", note: "Sometimes discussed with Bihag/Behag ang; keep low until verified.", sourceQuery: "Zindagi Ke Safar Mein Raag Bihag" },
      { title: "Raag Bihag", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical reference for verified raag education.", sourceQuery: "Pandit Jasraj Raag Bihag" },
      { title: "Bihag Night Instrumental", type: "modern_fusion", confidence: "medium", note: "Good late-evening soothing reference.", sourceQuery: "Raag Bihag instrumental night" },
      { title: "Behag Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional Behag examples.", sourceQuery: "Raag Bihag bhajan" },
    ],
  },

  {
    ragaId: "brindavani_sarang",
    ragaName: "Brindavani Sarang",
    aliases: ["Vrindavani Sarang"],
    references: [
      { title: "Jadugar Saiyan", type: "film_bollywood", confidence: "medium", note: "Sarang/Brindavani Sarang candidate.", sourceQuery: "Jadugar Saiyan Brindavani Sarang" },
      { title: "Aaja Bhanwar Sooni Dagar", type: "film_bollywood", confidence: "medium", note: "Sarang-family film-song candidate.", sourceQuery: "Aaja Bhanwar Sooni Dagar Brindavani Sarang" },
      { title: "Brindavani Sarang Krishna Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Good devotional category reference.", sourceQuery: "Brindavani Sarang Krishna bhajan" },
      { title: "Raag Brindavani Sarang", artist: "Classical artists", type: "classical_bandish", confidence: "high", note: "Direct classical noon raga reference.", sourceQuery: "Raag Brindavani Sarang bandish" },
      { title: "Sarang Instrumental", type: "modern_fusion", confidence: "medium", note: "Bright devotional/noon listening reference.", sourceQuery: "Brindavani Sarang instrumental" },
    ],
  },

  {
    ragaId: "nat_bhairav",
    ragaName: "Nat Bhairav",
    references: [
      { title: "Raag Nat Bhairav Classical", type: "classical_bandish", confidence: "high", note: "Use classical reference first; film examples need verification.", sourceQuery: "Raag Nat Bhairav classical bandish" },
      { title: "Nat Bhairav Morning Instrumental", type: "modern_fusion", confidence: "medium", note: "Morning meditative reference.", sourceQuery: "Raag Nat Bhairav instrumental" },
      { title: "Nat Bhairav Shiva Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional Nat Bhairav examples.", sourceQuery: "Raag Nat Bhairav Shiva bhajan" },
      { title: "Nat Bhairav Film Song Candidates", type: "film_bollywood", confidence: "low", note: "Bollywood examples are limited; keep as future research bucket.", sourceQuery: "film songs based on Raag Nat Bhairav" },
    ],
  },

  {
    ragaId: "darbari_kanada",
    ragaName: "Darbari Kanada",
    aliases: ["Darbari"],
    references: [
      { title: "Hanuman Chalisa - Darbari Raag", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Darbari Raag.", sourceQuery: "Hanuman Chalisa Darbari Raag Rasraj Ji Maharaj" },
      { title: "Sundarkand Raag Darbari", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Raag Darbari.", sourceQuery: "Sundarkand Raag Darbari Rasraj Ji Maharaj" },
      { title: "O Duniya Ke Rakhwale", artist: "Mohammed Rafi", filmOrAlbum: "Baiju Bawra", type: "film_bollywood", confidence: "high", note: "Famous Darbari Kanada film reference.", sourceQuery: "O Duniya Ke Rakhwale Raag Darbari Kanada" },
      { title: "Tu Pyar Ka Sagar Hai", artist: "Manna Dey", filmOrAlbum: "Seema", type: "film_bollywood", confidence: "medium", note: "Widely cited Darbari/Darbari-ang devotional film song.", sourceQuery: "Tu Pyar Ka Sagar Hai Raag Darbari" },
      { title: "Jhanak Jhanak Tori Baaje Payaliya", artist: "Manna Dey", type: "film_bollywood", confidence: "medium", note: "Classical film reference often connected with Darbari Kanada.", sourceQuery: "Jhanak Jhanak Tori Baaje Payaliya Raag Darbari" },
      { title: "Raga Darbari", artist: "Jagjit Singh", type: "classical_bandish", confidence: "high", note: "Direct raag metadata reference.", sourceQuery: "Jagjit Singh Raga Darbari" },
      { title: "Jai Radha Madhav / Mahamantra - Raag Darbari Live", artist: "Jagjit Singh", type: "bhajan_devotional", confidence: "high", note: "Metadata directly mentions Raag Darbari live devotional performance.", sourceQuery: "Jagjit Singh Jai Radha Madhav Raag Darbari Live" },
      { title: "Darbari Sufi Qawwali", artist: "Nusrat / Sabri style references", type: "sufi_qawwali", confidence: "low", note: "Mood-based qawwali search bucket; verify exact raag before high confidence.", sourceQuery: "Darbari Kanada qawwali Nusrat Fateh Ali Khan" },
    ],
  },

  {
    ragaId: "jaunpuri",
    ragaName: "Jaunpuri",
    references: [
      { title: "Meri Yaad Mein Tum Na Aansoo Bahana", type: "film_bollywood", confidence: "medium", note: "Jaunpuri film-song candidate.", sourceQuery: "Meri Yaad Mein Tum Na Aansoo Bahana Raag Jaunpuri" },
      { title: "Jaag Dil-e-Diwana", type: "film_bollywood", confidence: "medium", note: "Jaunpuri film-song candidate from old lists.", sourceQuery: "Jaag Dil e Diwana Raag Jaunpuri" },
      { title: "Raag Jaunpuri Bandish", type: "classical_bandish", confidence: "high", note: "Classical reference for strict raag learning.", sourceQuery: "Raag Jaunpuri bandish" },
      { title: "Jaunpuri Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Devotional reference bucket.", sourceQuery: "Raag Jaunpuri bhajan" },
      { title: "Jaunpuri Instrumental", type: "modern_fusion", confidence: "medium", note: "Good reflective morning/late-morning listening reference.", sourceQuery: "Raag Jaunpuri instrumental" },
    ],
  },

  {
    ragaId: "kirwani",
    ragaName: "Kirwani",
    aliases: ["Keeravani"],
    references: [
      { title: "Lab Par Aaye", artist: "Javed Ali", filmOrAlbum: "Bandish Bandits", composer: "Shankar-Ehsaan-Loy", year: 2020, type: "film_bollywood", confidence: "high", note: "Modern thumri-style Bandish Bandits reference based on Mishra Kirwani / Kirwani family with additional ang. Excellent for modern classical discovery.", sourceQuery: "Lab Par Aaye Bandish Bandits Mishra Kirwani Javed Ali" },
      { title: "Mera Dil Ye Pukare Aaja", type: "film_bollywood", confidence: "medium", note: "Kirwani/Keeravani candidate.", sourceQuery: "Mera Dil Ye Pukare Aaja Raag Kirwani" },
      { title: "Bekarar Karke Humein Yun Na Jaiye", type: "film_bollywood", confidence: "medium", note: "Kirwani candidate; verify exact treatment.", sourceQuery: "Bekarar Karke Humein Raag Kirwani" },
      { title: "Geet Gaata Hoon Main", type: "film_bollywood", confidence: "medium", note: "Kirwani/Keeravani film-song candidate.", sourceQuery: "Geet Gaata Hoon Main Raag Kirwani" },
      { title: "Raag Kirwani", artist: "Classical artists", type: "classical_bandish", confidence: "high", note: "Direct Kirwani classical reference.", sourceQuery: "Raag Kirwani classical" },
      { title: "Keeravani Film/Fusion Instrumental", type: "modern_fusion", confidence: "medium", note: "Works well for intense emotional and cinematic listening.", sourceQuery: "Keeravani raga fusion instrumental" },
    ],
  },

  {
    ragaId: "madhyamavathi",
    ragaName: "Madhyamavathi",
    aliases: ["Madhyamavati"],
    references: [
      { title: "Bhagyada Lakshmi Baramma", type: "regional_devotional", confidence: "medium", note: "Popular Carnatic devotional often associated with Madhyamavati/Madhyamavathi renderings; verify artist version.", sourceQuery: "Bhagyada Lakshmi Baramma Madhyamavathi" },
      { title: "Madhyamavathi Mangalam", type: "classical_bandish", confidence: "high", note: "Carnatic devotional/classical references are stronger than Bollywood for this raag.", sourceQuery: "Madhyamavathi mangalam" },
      { title: "Madhyamavathi Devotional Song", type: "bhajan_devotional", confidence: "medium", note: "Good devotional search reference.", sourceQuery: "Madhyamavathi devotional song" },
      { title: "Madhyamavathi Instrumental Meditation", type: "modern_fusion", confidence: "medium", note: "Peaceful closure/mangalam mood.", sourceQuery: "Madhyamavathi instrumental meditation" },
      { title: "Madhyamavathi Film Song Candidates", type: "film_bollywood", confidence: "low", note: "Hindi Bollywood mapping is weak; use regional/devotional first.", sourceQuery: "Madhyamavathi raga film songs" },
    ],
  },

  {
    ragaId: "surati",
    ragaName: "Surati",
    references: [
      { title: "Surati Classical / Devotional Reference", type: "classical_bandish", confidence: "medium", note: "Bollywood mapping is weak; keep as classical/devotional reference.", sourceQuery: "Raag Surati devotional classical" },
      { title: "Surati Mangalam", type: "regional_devotional", confidence: "medium", note: "Carnatic/devotional closing-song bucket.", sourceQuery: "Surati raga mangalam" },
      { title: "Surati Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional examples.", sourceQuery: "Raag Surati bhajan" },
      { title: "Surati Instrumental", type: "modern_fusion", confidence: "medium", note: "Soft classical listening reference.", sourceQuery: "Raag Surati instrumental" },
    ],
  },

  {
    ragaId: "yadukula_kambodhi",
    ragaName: "Yadukula Kambodhi",
    aliases: ["Yadukula Kamboji"],
    references: [
      { title: "Yadukula Kambodhi Carnatic Devotional", type: "classical_bandish", confidence: "high", note: "Strong Carnatic devotional/classical category.", sourceQuery: "Yadukula Kambodhi devotional song" },
      { title: "Yadukula Kambodhi Rama/Krishna Kriti", type: "regional_devotional", confidence: "medium", note: "Use Carnatic devotional kriti references.", sourceQuery: "Yadukula Kambodhi kriti Rama Krishna" },
      { title: "Yadukula Kambodhi Instrumental", type: "modern_fusion", confidence: "medium", note: "Gentle devotional instrumental search reference.", sourceQuery: "Yadukula Kambodhi instrumental" },
      { title: "Yadukula Kambodhi Film Candidates", type: "film_bollywood", confidence: "low", note: "Bollywood mapping weak; keep as research bucket.", sourceQuery: "Yadukula Kambodhi film song" },
    ],
  },

  {
    ragaId: "athana",
    ragaName: "Athana",
    references: [
      { title: "Athana Carnatic Classical Reference", type: "classical_bandish", confidence: "high", note: "Use Carnatic classical/devotional references first.", sourceQuery: "Athana raga devotional song" },
      { title: "Athana Kriti", type: "regional_devotional", confidence: "medium", note: "Carnatic kriti bucket for regional devotional usage.", sourceQuery: "Athana raga kriti" },
      { title: "Athana Instrumental", type: "modern_fusion", confidence: "medium", note: "Energetic classical instrumental reference.", sourceQuery: "Athana raga instrumental" },
      { title: "Athana Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak; use regional/classical first.", sourceQuery: "Athana raga film songs" },
    ],
  },

  {
    ragaId: "arabhi",
    ragaName: "Arabhi",
    references: [
      { title: "Arabhi Carnatic Devotional Reference", type: "classical_bandish", confidence: "high", note: "Strong Carnatic classical/devotional category.", sourceQuery: "Arabhi raga devotional song" },
      { title: "Sadinchene O Manasa", type: "regional_devotional", confidence: "medium", note: "Popular Carnatic kriti often rendered in Arabhi; verify exact source/artist.", sourceQuery: "Sadinchene O Manasa Arabhi" },
      { title: "Arabhi Instrumental", type: "modern_fusion", confidence: "medium", note: "Bright energetic classical instrumental reference.", sourceQuery: "Arabhi raga instrumental" },
      { title: "Arabhi Film Candidates", type: "film_bollywood", confidence: "low", note: "Bollywood mapping weak; use Carnatic/regional references first.", sourceQuery: "Arabhi raga film songs" },
    ],
  },

  {
    ragaId: "sahana",
    ragaName: "Sahana",
    references: [
      { title: "Sahana Carnatic Devotional / Film Reference", type: "regional_devotional", confidence: "medium", note: "Good South Indian devotional/film research category.", sourceQuery: "Sahana raga film songs devotional" },
      { title: "Giripai Nelakonna", type: "classical_bandish", confidence: "medium", note: "Carnatic Sahana kriti candidate; verify artist/version.", sourceQuery: "Giripai Nelakonna Sahana" },
      { title: "Sahana Bhajan / Kriti", type: "bhajan_devotional", confidence: "medium", note: "Soft devotional reference bucket.", sourceQuery: "Sahana raga bhajan kriti" },
      { title: "Sahana Instrumental Meditation", type: "modern_fusion", confidence: "medium", note: "Gentle healing instrumental mood.", sourceQuery: "Sahana raga instrumental meditation" },
      { title: "Sahana Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi Bollywood mapping weak.", sourceQuery: "Sahana raga Bollywood film song" },
    ],
  },

  {
    ragaId: "mukhari",
    ragaName: "Mukhari",
    references: [
      { title: "Mukhari Carnatic Devotional Reference", type: "classical_bandish", confidence: "high", note: "Use classical/devotional references first.", sourceQuery: "Mukhari raga devotional song" },
      { title: "Mukhari Kriti", type: "regional_devotional", confidence: "medium", note: "Carnatic kriti bucket for grief/karuna mood.", sourceQuery: "Mukhari raga kriti" },
      { title: "Mukhari Instrumental", type: "modern_fusion", confidence: "medium", note: "Deep emotional/karuna instrumental listening.", sourceQuery: "Mukhari raga instrumental" },
      { title: "Mukhari Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak; keep research bucket.", sourceQuery: "Mukhari raga film songs" },
    ],
  },

  {
    ragaId: "shanmukhapriya",
    ragaName: "Shanmukhapriya",
    references: [
      { title: "Ruby Ruby", artist: "Shashwat Singh, Poorvi Koutish", filmOrAlbum: "Sanju", composer: "A.R. Rahman", year: 2018, type: "film_bollywood", confidence: "medium", note: "Listed as Shanmukhapriya & Hemavati in film-raga indexes.", sourceQuery: "Ruby Ruby Sanju Shanmukhapriya Hemavati" },
      { title: "Shanmukhapriya Murugan Devotional", type: "regional_devotional", confidence: "medium", note: "Raag is Carnatic and works well for Murugan/Shiva devotional references.", sourceQuery: "Shanmukhapriya Murugan devotional" },
      { title: "Raag Shanmukhapriya", type: "classical_bandish", confidence: "high", note: "Direct Carnatic/classical reference.", sourceQuery: "Raag Shanmukhapriya classical" },
      { title: "Shanmukhapriya Fusion Instrumental", type: "modern_fusion", confidence: "medium", note: "Intense modern/fusion reference.", sourceQuery: "Shanmukhapriya fusion instrumental" },
      { title: "Shanmukhapriya Bhajan", type: "bhajan_devotional", confidence: "low", note: "Devotional search bucket.", sourceQuery: "Shanmukhapriya bhajan" },
    ],
  },

  {
    ragaId: "kapi",
    ragaName: "Kapi",
    aliases: ["Kafi ang", "Mishra Kafi"],
    references: [
      { title: "Traditional qawwali in raga Mishra Kafi", artist: "Nusrat Fateh Ali Khan", type: "sufi_qawwali", confidence: "high", note: "Title metadata directly mentions Raga Mishra Kafi.", sourceQuery: "Nusrat Fateh Ali Khan Traditional qawwali in raga Mishra Kafi" },
      { title: "Ka Karoon Sajni Aaye Na Balam", type: "film_bollywood", confidence: "medium", note: "Kafi/Kapi/Pilu-ang candidate; version-specific verification needed.", sourceQuery: "Ka Karoon Sajni Raag Kafi Kapi" },
      { title: "Piya Tose Naina Lage Re", artist: "Lata Mangeshkar", filmOrAlbum: "Guide", type: "film_bollywood", confidence: "medium", note: "Light-classical Kafi/Kapi/Pilu-ang film reference.", sourceQuery: "Piya Tose Naina Lage Re Raag Kafi Kapi" },
      { title: "Kafi / Kapi Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Common devotional/light-classical family.", sourceQuery: "Raag Kafi Kapi bhajan" },
      { title: "Kapi Carnatic Kriti", type: "regional_devotional", confidence: "medium", note: "Carnatic Kapi devotional reference bucket.", sourceQuery: "Kapi raga Carnatic kriti" },
    ],
  },

  {
    ragaId: "neelambari",
    ragaName: "Neelambari",
    references: [
      { title: "So Ja Rajkumari", type: "film_bollywood", confidence: "medium", note: "Lullaby-style candidate connected to Neelambari mood.", sourceQuery: "So Ja Rajkumari Raag Neelambari" },
      { title: "Neelambari Lullaby", type: "regional_devotional", confidence: "high", note: "Neelambari is strongly associated with lullaby/sleep mood.", sourceQuery: "Neelambari lullaby devotional" },
      { title: "Neelambari Carnatic Kriti", type: "classical_bandish", confidence: "high", note: "Direct classical/Carnatic reference.", sourceQuery: "Neelambari raga kriti" },
      { title: "Neelambari Sleep Meditation", type: "modern_fusion", confidence: "medium", note: "Excellent sleep/healing AstroSound reference.", sourceQuery: "Neelambari sleep meditation instrumental" },
      { title: "Neelambari Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Soft devotional reference bucket.", sourceQuery: "Neelambari bhajan" },
    ],
  },

  {
    ragaId: "revathi",
    ragaName: "Revathi",
    references: [
      { title: "Revathi Meditation / Devotional", type: "modern_fusion", confidence: "medium", note: "Excellent meditative AstroSound reference.", sourceQuery: "Raag Revathi meditation devotional" },
      { title: "Bho Shambho", type: "regional_devotional", confidence: "medium", note: "Often associated with Revathi in Carnatic/devotional settings; verify version.", sourceQuery: "Bho Shambho Revathi" },
      { title: "Raag Revathi", type: "classical_bandish", confidence: "high", note: "Direct classical/Carnatic reference.", sourceQuery: "Raag Revathi classical" },
      { title: "Revathi Shiva Bhajan", type: "bhajan_devotional", confidence: "medium", note: "Spiritual/meditative devotional bucket.", sourceQuery: "Revathi Shiva bhajan" },
      { title: "Revathi Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak; use devotional/fusion first.", sourceQuery: "Revathi raga film songs" },
    ],
  },

  {
    ragaId: "dwijavanthi",
    ragaName: "Dwijavanthi",
    aliases: ["Dwijavanti", "Jaijaiwanti related mood"],
    references: [
      { title: "Manmohana Bade Jhoothe", artist: "Lata Mangeshkar", filmOrAlbum: "Seema", type: "film_bollywood", confidence: "low", note: "Jaijaiwanti-family iconic old reference. Stored carefully under Dwijavanthi/Jaijaiwanti related mood with low confidence.", sourceQuery: "Manmohana Bade Jhoothe Raag Jaijaiwanti" },
      { title: "Akhilandeshwari", type: "classical_bandish", confidence: "high", note: "Canonical devotional/classical reference in Dwijavanthi tradition.", sourceQuery: "Akhilandeshwari Dwijavanthi" },
      { title: "Chetashri Balakrishnam", type: "regional_devotional", confidence: "medium", note: "Dwijavanthi classical/devotional candidate; verify artist/version.", sourceQuery: "Chetashri Balakrishnam Dwijavanthi" },
      { title: "Dwijavanthi Instrumental", type: "modern_fusion", confidence: "medium", note: "Soft devotional instrumental reference.", sourceQuery: "Dwijavanthi instrumental" },
      { title: "Dwijavanthi Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for Hindi devotional versions.", sourceQuery: "Dwijavanthi bhajan" },
      { title: "Dwijavanthi Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak.", sourceQuery: "Dwijavanthi raga film song" },
    ],
  },

  {
    ragaId: "mohanam",
    ragaName: "Mohanam",
    aliases: ["Bhupali", "Bhoopali", "Bhopali"],
    references: [
      { title: "Neele Neele Ambar Par", artist: "Kishore Kumar", filmOrAlbum: "Kalaakaar", type: "film_bollywood", confidence: "medium", note: "Popular Bhupali/Mohanam-family candidate from film-raga discussions.", sourceQuery: "Neele Neele Ambar Par Raag Bhupali Mohanam" },
      { title: "In Aankhon Ki Masti", artist: "Asha Bhosle", filmOrAlbum: "Umrao Jaan", type: "film_bollywood", confidence: "low", note: "Often discussed with classical/light-classical ang; keep low until final verification.", sourceQuery: "In Aankhon Ki Masti Raag Bhupali" },
      { title: "Jyoti Kalash Chhalke", artist: "Lata Mangeshkar", type: "film_bollywood", confidence: "high", note: "Classic Bhupali/Mohanam film reference.", sourceQuery: "Jyoti Kalash Chhalke Raag Bhupali" },
      { title: "Pankh Hote To Ud Aati Re", type: "film_bollywood", confidence: "medium", note: "Bhupali/Mohanam candidate.", sourceQuery: "Pankh Hote To Ud Aati Re Raag Bhupali" },
      { title: "Dekha Ek Khwab", artist: "Kishore Kumar, Lata Mangeshkar", filmOrAlbum: "Silsila", type: "film_bollywood", confidence: "medium", note: "Often connected with Bhupali/Mohanam ang in popular lists.", sourceQuery: "Dekha Ek Khwab Raag Bhupali" },
      { title: "Raag Bhupali / Mohanam", type: "classical_bandish", confidence: "high", note: "Direct pentatonic classical reference.", sourceQuery: "Raag Bhupali Mohanam bandish" },
      { title: "Mohanam Carnatic Kriti", type: "regional_devotional", confidence: "medium", note: "Strong Carnatic devotional category.", sourceQuery: "Mohanam raga kriti" },
      { title: "Bhupali Meditation Instrumental", type: "modern_fusion", confidence: "medium", note: "Very good for calm, hope and clarity.", sourceQuery: "Raag Bhupali meditation instrumental" },
    ],
  },

  {
    ragaId: "bilahari",
    ragaName: "Bilahari",
    references: [
      { title: "Bilahari Carnatic Devotional Reference", type: "classical_bandish", confidence: "high", note: "Bollywood weak; Carnatic devotional/classical is stronger.", sourceQuery: "Bilahari raga devotional song" },
      { title: "Paridanamichite", type: "regional_devotional", confidence: "medium", note: "Carnatic Bilahari kriti candidate; verify artist/version.", sourceQuery: "Paridanamichite Bilahari" },
      { title: "Bilahari Instrumental", type: "modern_fusion", confidence: "medium", note: "Bright positive instrumental reference.", sourceQuery: "Bilahari instrumental" },
      { title: "Bilahari Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Bilahari bhajan" },
      { title: "Bilahari Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak.", sourceQuery: "Bilahari raga film songs" },
    ],
  },

  {
    ragaId: "anandabhairavi",
    ragaName: "Anandabhairavi",
    references: [
      { title: "Anandabhairavi Carnatic Devotional Reference", type: "classical_bandish", confidence: "high", note: "Strong Carnatic devotional/classical category.", sourceQuery: "Anandabhairavi devotional song" },
      { title: "Marivere Gati", type: "regional_devotional", confidence: "medium", note: "Popular Anandabhairavi kriti candidate; verify artist/version.", sourceQuery: "Marivere Gati Anandabhairavi" },
      { title: "Anandabhairavi Instrumental", type: "modern_fusion", confidence: "medium", note: "Gentle nurturing/karuna instrumental reference.", sourceQuery: "Anandabhairavi instrumental" },
      { title: "Anandabhairavi Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for Hindi/devotional versions.", sourceQuery: "Anandabhairavi bhajan" },
      { title: "Anandabhairavi Film Candidates", type: "film_bollywood", confidence: "low", note: "Bollywood mapping weak; regional references better.", sourceQuery: "Anandabhairavi raga film songs" },
    ],
  },

  {
    ragaId: "vasantha",
    ragaName: "Vasantha",
    references: [
      { title: "Vasantha Carnatic Devotional Reference", type: "classical_bandish", confidence: "high", note: "Use Carnatic devotional/classical references first.", sourceQuery: "Vasantha raga devotional song" },
      { title: "Seethamma Mayamma", type: "regional_devotional", confidence: "medium", note: "Vasantha kriti candidate; verify artist/version.", sourceQuery: "Seethamma Mayamma Vasantha raga" },
      { title: "Vasantha Instrumental", type: "modern_fusion", confidence: "medium", note: "Fresh/spring-like instrumental reference.", sourceQuery: "Vasantha raga instrumental" },
      { title: "Vasantha Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Vasantha raga bhajan" },
      { title: "Vasantha Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak.", sourceQuery: "Vasantha raga film songs" },
    ],
  },

  {
    ragaId: "kadanakuthoohalam",
    ragaName: "Kadanakuthoohalam",
    references: [
      { title: "Raghuvamsa Sudha", type: "regional_devotional", confidence: "high", note: "Well-known Kadanakuthoohalam composition/reference.", sourceQuery: "Raghuvamsa Sudha Kadanakuthoohalam" },
      { title: "Kadanakuthoohalam Fusion / Instrumental", type: "modern_fusion", confidence: "medium", note: "Energetic modern/fusion reference bucket.", sourceQuery: "Kadanakuthoohalam fusion instrumental" },
      { title: "Kadanakuthoohalam Classical", type: "classical_bandish", confidence: "high", note: "Direct Carnatic/classical reference.", sourceQuery: "Kadanakuthoohalam classical" },
      { title: "Kadanakuthoohalam Devotional", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Kadanakuthoohalam devotional song" },
      { title: "Kadanakuthoohalam Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak.", sourceQuery: "Kadanakuthoohalam film song" },
    ],
  },

  {
    ragaId: "navarasakanada",
    ragaName: "Navarasakanada",
    aliases: ["Navarasa Kanada"],
    references: [
      { title: "Navarasakanada Carnatic Devotional Reference", type: "classical_bandish", confidence: "medium", note: "Needs deeper Carnatic source verification.", sourceQuery: "Navarasakanada raga devotional song" },
      { title: "Ninnuvina Namadendu", type: "regional_devotional", confidence: "medium", note: "Navarasakanada kriti candidate; verify artist/version.", sourceQuery: "Ninnuvina Namadendu Navarasakanada" },
      { title: "Navarasakanada Instrumental", type: "modern_fusion", confidence: "medium", note: "Expressive classical instrumental reference.", sourceQuery: "Navarasakanada instrumental" },
      { title: "Navarasakanada Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Navarasakanada bhajan" },
      { title: "Navarasakanada Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak.", sourceQuery: "Navarasakanada film song" },
    ],
  },

  {
    ragaId: "marwa",
    ragaName: "Marwa",
    references: [
      { title: "Raag Marwa", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical raag reference.", sourceQuery: "Pandit Jasraj Raag Marwa" },
      { title: "Jo Tum Todo Piya", type: "film_bollywood", confidence: "medium", note: "Marwa-ang candidate; verify before marking high.", sourceQuery: "Jo Tum Todo Piya Raag Marwa" },
      { title: "Payaliya Bawri", type: "film_bollywood", confidence: "medium", note: "Marwa film-song candidate from classical film lists.", sourceQuery: "Payaliya Bawri Raag Marwa" },
      { title: "Marwa Sunset Instrumental", type: "modern_fusion", confidence: "medium", note: "Strong twilight/anxiety-release listening reference.", sourceQuery: "Raag Marwa instrumental sunset" },
      { title: "Marwa Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Raag Marwa bhajan" },
    ],
  },

  {
    ragaId: "puriya",
    ragaName: "Puriya",
    aliases: ["Puriya Kalyan", "Puriya Dhanashree", "Puriya Dhanashri"],
    references: [
      { title: "Sundarkand Raag Puriya Dhanashri", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Raag Puriya Dhanashri. Stored under Puriya family.", sourceQuery: "Sundarkand Raag Puriya Dhanashri Rasraj Ji Maharaj" },
      { title: "Raag Puriya Kalyan", artist: "Pandit Jasraj", type: "classical_bandish", confidence: "high", note: "Direct classical reference.", sourceQuery: "Pandit Jasraj Raag Puriya Kalyan" },
      { title: "Puriya Dhanashri", artist: "Anoushka Shankar", filmOrAlbum: "Anourag", type: "modern_fusion", confidence: "high", note: "Album track metadata directly lists Puriya Dhanashri.", sourceQuery: "Anoushka Shankar Puriya Dhanashri Anourag" },
      { title: "Puriya Dhanashree Bandish", type: "classical_bandish", confidence: "high", note: "Strong classical evening reference.", sourceQuery: "Puriya Dhanashree bandish" },
      { title: "Puriya Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Raag Puriya bhajan" },
      { title: "Puriya Film Candidates", type: "film_bollywood", confidence: "low", note: "Need verified film examples; keep as candidate bucket.", sourceQuery: "film songs based on Raag Puriya" },
    ],
  },

  {
    ragaId: "chandrakauns",
    ragaName: "Chandrakauns",
    references: [
      { title: "Sanware Sanware", artist: "Lata Mangeshkar", filmOrAlbum: "Anuradha", type: "film_bollywood", confidence: "medium", note: "Often cited as Chandrakauns candidate; verify source conflict.", sourceQuery: "Sanware Sanware Raag Chandrakauns" },
      { title: "Mai Ri Main Kaase Kahoon", type: "film_bollywood", confidence: "medium", note: "Chandrakauns film-song candidate.", sourceQuery: "Mai Ri Main Kaase Kahoon Raag Chandrakauns" },
      { title: "Raag Chandrakauns Classical", type: "classical_bandish", confidence: "high", note: "Use classical reference for strict raag education.", sourceQuery: "Raag Chandrakauns classical bandish" },
      { title: "Chandrakauns Night Instrumental", type: "modern_fusion", confidence: "medium", note: "Deep late-night meditative mood.", sourceQuery: "Raag Chandrakauns instrumental meditation" },
      { title: "Chandrakauns Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Raag Chandrakauns bhajan" },
    ],
  },

  {
    ragaId: "hamsanandi",
    ragaName: "Hamsanandi",
    references: [
      { title: "Hamsanandi Carnatic Devotional / Fusion", type: "classical_bandish", confidence: "high", note: "South Indian devotional/classical references stronger than Bollywood.", sourceQuery: "Hamsanandi devotional song" },
      { title: "Pavana Guru", type: "regional_devotional", confidence: "medium", note: "Hamsanandi devotional candidate; verify artist/version.", sourceQuery: "Pavana Guru Hamsanandi" },
      { title: "Hamsanandi Instrumental", type: "modern_fusion", confidence: "medium", note: "Intense devotional/fusion listening reference.", sourceQuery: "Hamsanandi instrumental" },
      { title: "Hamsanandi Bhajan", type: "bhajan_devotional", confidence: "low", note: "Research bucket for devotional versions.", sourceQuery: "Hamsanandi bhajan" },
      { title: "Hamsanandi Film Candidates", type: "film_bollywood", confidence: "low", note: "Hindi film mapping weak; use regional/classical first.", sourceQuery: "Hamsanandi film song" },
    ],
  },

  {
    ragaId: "bhairavi",
    ragaName: "Bhairavi",
    aliases: ["Mishra Bhairavi"],
    references: [
      { title: "Hanuman Chalisa Raag Bhairavi", artist: "Pandit Ras Raj Ji Maharaj", type: "bhajan_devotional", confidence: "high", note: "Title directly mentions Raag Bhairavi / Bhairvi.", sourceQuery: "Hanuman Chalisa Raag Bhairavi Rasraj Ji Maharaj" },
      { title: "Hame Tumse Pyar Kitna", artist: "Kishore Kumar", filmOrAlbum: "Kudrat", type: "film_bollywood", confidence: "medium", note: "Iconic old Bhairavi/Mishra Bhairavi candidate from raga-film lists.", sourceQuery: "Hame Tumse Pyar Kitna Raag Bhairavi" },
      { title: "Jeena Yahan Marna Yahan", artist: "Mukesh", filmOrAlbum: "Mera Naam Joker", type: "film_bollywood", confidence: "medium", note: "Old but very famous Bhairavi/Mishra Bhairavi film reference.", sourceQuery: "Jeena Yahan Marna Yahan Raag Bhairavi" },
      { title: "Mera Desh Ki Dharti", artist: "Mahendra Kapoor", filmOrAlbum: "Upkar", type: "film_bollywood", confidence: "medium", note: "Iconic old film song often listed under Bhairavi/Mishra Bhairavi references.", sourceQuery: "Mera Desh Ki Dharti Raag Bhairavi" },
      { title: "Laga Chunari Mein Daag", artist: "Manna Dey", filmOrAlbum: "Dil Hi To Hai", type: "film_bollywood", confidence: "high", note: "Listed in raga-film song indexes as Bhairavi.", sourceQuery: "Laga Chunari Mein Daag Raag Bhairavi" },
      { title: "Babul Mora Naihar Chhooto Jaye", type: "film_bollywood", confidence: "high", note: "Iconic Bhairavi/thumri reference; old but culturally essential.", sourceQuery: "Babul Mora Raag Bhairavi" },
      { title: "Chingari Koi Bhadke", artist: "Kishore Kumar", filmOrAlbum: "Amar Prem", type: "film_bollywood", confidence: "medium", note: "Often listed under Bhairavi/Mishra Bhairavi film references.", sourceQuery: "Chingari Koi Bhadke Raag Bhairavi" },
      { title: "Azeem-O-Shaan Shahenshah", artist: "Mohammed Aslam, Bonnie Chakravarty", filmOrAlbum: "Jodhaa Akbar", composer: "A.R. Rahman", year: 2008, type: "film_bollywood", confidence: "medium", note: "Bhairavi-ang / qawwali-style cinematic anthem; not pure classical bandish.", sourceQuery: "Azeem O Shaan Shahenshah Raag Bhairavi" },
      { title: "Preetam Hamaro Pyaro Shyam (Raag Bhairavi)", artist: "Anup Jalota", type: "bhajan_devotional", confidence: "high", note: "Title/source directly mentions Raag Bhairavi.", sourceQuery: "Preetam Hamaro Pyaro Shyam Raag Bhairavi Anup Jalota" },
      { title: "Mhare Janam Maran (Raag Bhairavi)", artist: "Anup Jalota", type: "bhajan_devotional", confidence: "high", note: "Title metadata directly mentions Raag Bhairavi.", sourceQuery: "Mhare Janam Maran Raag Bhairavi Anup Jalota" },
      { title: "Mera Piya Ghar Aaya", artist: "Nusrat Fateh Ali Khan", type: "sufi_qawwali", confidence: "medium", note: "Sufi/qawwali reference with Bhairavi/Kafi-ang style possibilities; verify exact raag before high confidence.", sourceQuery: "Mera Piya Ghar Aaya Nusrat Raag Bhairavi" },
      { title: "Raag Bhairavi", artist: "Pandit Jasraj / classical artists", type: "classical_bandish", confidence: "high", note: "Direct classical Bhairavi reference.", sourceQuery: "Pandit Jasraj Raag Bhairavi" },
      { title: "Mishra Bhairavi Instrumental", type: "modern_fusion", confidence: "medium", note: "Excellent closing/healing reference.", sourceQuery: "Mishra Bhairavi instrumental meditation" },
    ],
  },

  {
    ragaId: "ahir_bhairav",
    ragaName: "Ahir Bhairav",
    aliases: ["Ahir Bhairav", "Bhairav family"],
    references: [
      {
        title: "Sundarkand Raag Ahir Bhairav",
        artist: "Pandit Ras Raj Ji Maharaj",
        type: "bhajan_devotional",
        confidence: "high",
        note: "Title directly mentions Raag Ahir Bhairav.",
        sourceQuery: "Sundarkand Raag Ahir Bhairav Rasraj Ji Maharaj",
      },
      {
        title: "Poochho Na Kaise Maine Rain Bitai",
        artist: "Manna Dey",
        filmOrAlbum: "Meri Surat Teri Ankhen",
        type: "film_bollywood",
        confidence: "high",
        note: "Iconic Ahir Bhairav based Hindi film song reference.",
        sourceQuery: "Poochho Na Kaise Maine Rain Bitai Raag Ahir Bhairav",
      },
      {
        title: "Raag Ahir Bhairav",
        artist: "Classical artists",
        type: "classical_bandish",
        confidence: "high",
        note: "Direct classical morning raag reference.",
        sourceQuery: "Raag Ahir Bhairav classical bandish",
      },
      {
        title: "Ahir Bhairav Morning Meditation",
        type: "modern_fusion",
        confidence: "medium",
        note: "Good morning meditation and spiritual grounding reference.",
        sourceQuery: "Raag Ahir Bhairav instrumental meditation",
      },
    ],
  },

  {
    ragaId: "bairagi_bhairav",
    ragaName: "Bairagi Bhairav",
    aliases: ["Bairagi Bhairav", "Bairagi Bhairon", "Bhairav family"],
    references: [
      {
        title: "Superfast Hanuman Chalisa Raag Bairagi Bhairav",
        artist: "Pandit Ras Raj Ji Maharaj",
        type: "bhajan_devotional",
        confidence: "high",
        note: "Title directly mentions Raag Bairagi Bhairav.",
        sourceQuery: "Superfast Hanuman Chalisa Raag Bairagi Bhairav Rasraj Ji Maharaj",
      },
      {
        title: "Raag Bairagi Bhairav",
        artist: "Classical artists",
        type: "classical_bandish",
        confidence: "high",
        note: "Direct classical Bairagi Bhairav reference.",
        sourceQuery: "Raag Bairagi Bhairav classical",
      },
      {
        title: "Bairagi Bhairav Shiva / Hanuman Bhajan",
        type: "bhajan_devotional",
        confidence: "medium",
        note: "Devotional search reference for morning spiritual practice.",
        sourceQuery: "Bairagi Bhairav Hanuman bhajan",
      },
      {
        title: "Bairagi Bhairav Instrumental Meditation",
        type: "modern_fusion",
        confidence: "medium",
        note: "Minimal, meditative morning reference.",
        sourceQuery: "Bairagi Bhairav instrumental meditation",
      },
    ],
  },

  {
    ragaId: "bairagi",
    ragaName: "Bairagi",
    aliases: ["Bairagi", "Bairagi Bhairav family"],
    references: [
      {
        title: "Sundarkand Raag Bairagi",
        artist: "Pandit Ras Raj Ji Maharaj",
        type: "bhajan_devotional",
        confidence: "high",
        note: "Title directly mentions Raag Bairagi.",
        sourceQuery: "Sundarkand Raag Bairagi Rasraj Ji Maharaj",
      },
      {
        title: "Raag Bairagi",
        artist: "Classical artists",
        type: "classical_bandish",
        confidence: "high",
        note: "Direct classical Bairagi reference.",
        sourceQuery: "Raag Bairagi classical bandish",
      },
      {
        title: "Bairagi Devotional Meditation",
        type: "bhajan_devotional",
        confidence: "medium",
        note: "Spiritual morning bhajan reference.",
        sourceQuery: "Raag Bairagi devotional bhajan",
      },
      {
        title: "Bairagi Instrumental",
        type: "modern_fusion",
        confidence: "medium",
        note: "Calm devotional instrumental listening reference.",
        sourceQuery: "Raag Bairagi instrumental",
      },
    ],
  },


  {
    ragaId: "malhar",
    ragaName: "Malhar",
    aliases: ["Miyan Malhar", "Miyan Ki Malhar", "Megh Malhar", "Malhar family"],
    references: [
      { title: "Garaj Garaj", artist: "Farid Hasan, Mohammed Aman", filmOrAlbum: "Bandish Bandits", composer: "Shankar-Ehsaan-Loy", year: 2020, type: "film_bollywood", confidence: "high", note: "Bandish Bandits classical-jugalbandi reference based on Megh Malhar / Malhar family, associated with monsoon mood.", sourceQuery: "Garaj Garaj Bandish Bandits Raag Megh Malhar" },
      { title: "Miyan Ki Malhar - Tansen Reference", filmOrAlbum: "Tansen / Classical reference", type: "classical_bandish", confidence: "high", note: "Direct Miyan Ki Malhar / Malhar-family classical reference. Useful for monsoon and intense classical listening.", sourceQuery: "Miyan Ki Malhar Tansen classical" },
      {
        title: "Malhar Jam",
        artist: "Agam",
        filmOrAlbum: "Coke Studio @ MTV Season 2",
        type: "modern_fusion",
        confidence: "medium",
        note: "Coke Studio rock/fusion reference inspired by Indian classical forms; title points to Malhar family.",
        sourceQuery: "Malhar Jam Agam Coke Studio MTV Season 2",
      },
      {
        title: "Garjat Barsat Saawan Aayo Re",
        type: "film_bollywood",
        confidence: "medium",
        note: "Iconic Malhar-family film/classical reference.",
        sourceQuery: "Garjat Barsat Saawan Aayo Re Raag Malhar",
      },
      {
        title: "Raag Miyan Malhar Classical",
        type: "classical_bandish",
        confidence: "high",
        note: "Direct classical monsoon raag reference.",
        sourceQuery: "Raag Miyan Malhar classical bandish",
      },
      {
        title: "Malhar Monsoon Instrumental",
        type: "modern_fusion",
        confidence: "medium",
        note: "Good monsoon/healing instrumental search reference.",
        sourceQuery: "Raag Malhar instrumental monsoon",
      },
    ],
  },


  {
    ragaId: "megh_malhar",
    ragaName: "Megh Malhar",
    aliases: ["Megh", "Malhar family", "Megh Malhar"],
    references: [
      {
        title: "Garaj Garaj",
        artist: "Farid Hasan, Mohammed Aman",
        filmOrAlbum: "Bandish Bandits",
        composer: "Shankar-Ehsaan-Loy",
        year: 2020,
        type: "film_bollywood",
        confidence: "high",
        note: "Modern classical-jugalbandi reference based on Megh Malhar / Malhar family.",
        sourceQuery: "Garaj Garaj Bandish Bandits Raag Megh Malhar",
      },
      {
        title: "Raag Megh Malhar Classical",
        artist: "Classical artists",
        type: "classical_bandish",
        confidence: "high",
        note: "Direct classical monsoon raag reference.",
        sourceQuery: "Raag Megh Malhar classical bandish",
      },
      {
        title: "Megh Malhar Monsoon Instrumental",
        type: "modern_fusion",
        confidence: "medium",
        note: "Good monsoon, release and emotional-cleansing reference.",
        sourceQuery: "Megh Malhar instrumental monsoon meditation",
      },
    ],
  },
];

export function getRagaMusicReferences(ragaId: string) {
  return ragaMusicReferences.find((raga) => raga.ragaId === ragaId);
}

export function getReferencesByType(ragaId: string, type: MusicReferenceType) {
  return getRagaMusicReferences(ragaId)?.references.filter((item) => item.type === type) ?? [];
}
