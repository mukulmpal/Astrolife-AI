// src/lib/astro-engine/dasha-interpretations.ts
// AstroLife — Vimshottari Dasha Interpretation Engine
// Static lookup: 9 planets × 12 houses (108 MD entries) + 81 AD combinations
// Each entry: overview · health · career · family · travel · education

export interface PeriodInterpretation {
  overview:   string;
  health:     string;
  career:     string;
  family:     string;
  travel:     string;
  education:  string;
}

export interface AntardashaInterpretation {
  overview:  string;
  effect:    string;
  remedies:  string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// MAHADASHA TABLE  MD_TABLE[planet][house 1-12]
// ─────────────────────────────────────────────────────────────────────────────

export const MD_TABLE: Record<string, Record<number, PeriodInterpretation>> = {

  // ── SUN (6 years) ────────────────────────────────────────────────────────
  Sun: {
    1: {
      overview:  "Sun in the 1st house activates a period of self-assertion, vitality and personal authority. You will develop a strong personality and seek recognition in all spheres of life. Government and administrative circles become favourable.",
      health:    "Physical vitality is generally strong. There may be issues related to the head, eyes or heart. Regular exercise and avoidance of excess heat protect health during this period.",
      career:    "Excellent period for promotion, authority and recognition. Government jobs, administration, politics and leadership roles flourish. Your superiors take note of your abilities and rewards follow your efforts.",
      family:    "Your father's health and influence is a central theme. Relations with authority figures within the family are prominent. Ego clashes with elders are possible; humility smooths relationships.",
      travel:    "Travels are likely for official or governmental purposes. Short trips related to career advancement are common. Pilgrimages and visits to places of importance bring inner satisfaction.",
      education: "Ability to focus and study is heightened. Success in competitive examinations and government-sponsored courses is indicated. Leadership roles in educational institutions are possible.",
    },
    2: {
      overview:  "Sun in the 2nd house brings focus on wealth accumulation, family prestige and the power of speech. Financial matters and family honour are highlighted throughout this period.",
      health:    "Watch for issues related to the face, mouth, teeth and right eye. Diet plays a major role in maintaining wellbeing. Digestion-related ailments may need attention.",
      career:    "Income from government sources or established organisations is likely. Work requiring public speaking, persuasion or oratory yields results. Family business can gain prestige and stability.",
      family:    "Family gatherings and ancestral property matters come to the fore. Relations with the father are emotionally charged. Financial support from family is possible but ego disputes over wealth must be avoided.",
      travel:    "Travel for business or to attend family functions is indicated. Short journeys to ancestral places are auspicious and bring a sense of rootedness.",
      education: "Oratorical skills and language mastery improve significantly. Courses in finance, management or public administration are favoured.",
    },
    3: {
      overview:  "Sun in the 3rd house invigorates communication, courage, initiative and short travels. Siblings and neighbours play an important role. Your self-effort brings recognition.",
      health:    "Throat, shoulders and arms may need attention. Overall energy is good but nervous exhaustion from over-activity is possible. Moderate your pace.",
      career:    "Media, journalism, writing, marketing and communication-related careers prosper. Your initiative and boldness bring opportunities. Working independently or as a consultant is favourable.",
      family:    "Relations with younger siblings become active and sometimes competitive. Mutual support among siblings is possible. Father may travel or remain at a distance during this period.",
      travel:    "Numerous short journeys for business and communication purposes. Travels related to media, publishing or government outreach are productive.",
      education: "Learning through self-study and practical experience is highlighted. Short-term professional courses in communication, technology or administration are beneficial.",
    },
    4: {
      overview:  "Sun in the 4th house focuses energy on home, property, mother and inner happiness. There is a strong desire to secure domestic life and achieve recognition within the home environment.",
      health:    "Chest and heart-related concerns may arise. The mother's health becomes a matter of attention. Stress from domestic responsibilities affects overall wellbeing.",
      career:    "Government-linked real estate, agriculture or infrastructure work is favoured. Success comes through properties, vehicles and public assets. Working from home or in a domestic setting is productive.",
      family:    "Mother's wellbeing is central to this period. Property and real-estate dealings within the family are likely. Domestic harmony improves when ego is kept in check.",
      travel:    "Travel to one's homeland or ancestral place is indicated. Journeys for property inspection and acquisition are common.",
      education: "Formal education in engineering, architecture, agriculture or government administration is supported. Traditional knowledge and cultural studies flourish.",
    },
    5: {
      overview:  "Sun in the 5th house brings creativity, romance, children and intelligence to the forefront. Speculative ventures and stock market activities may attract attention. Past life merits create good fortune.",
      health:    "Heart and stomach are sensitive areas. Manage stress and avoid excessive speculative risk. Children's health may also require attention.",
      career:    "Creative industries, entertainment, education and finance attract success. Stock trading, advisory roles or teaching at a prestigious level are favourable.",
      family:    "Children become a source of pride and concern. Romance and love relationships are active. Relations with the father are cordial and supportive.",
      travel:    "Pleasure trips and pilgrimages to sacred sites are likely. Travel connected to children's education or creative pursuits is common.",
      education: "Exceptional intellectual output and creative learning. Success in competitive academic examinations. Interest in philosophy, arts and sciences deepens.",
    },
    6: {
      overview:  "Sun in the 6th house brings victory over enemies, success in competitive environments and service-oriented work. Health challenges arise but are overcome through willpower.",
      health:    "Digestive, intestinal and bone-related ailments are possible. Regular medical check-ups and disciplined diet are essential. There is stamina to overcome illness.",
      career:    "Legal, medical, military, police and government service sectors are favoured. You excel in competitive settings and overcome rivals. Meticulous work and service ethic bring recognition.",
      family:    "Disputes with maternal relatives or employees are possible. Relations with the father remain challenging. Maintaining boundaries in family financial matters is important.",
      travel:    "Travel for medical treatment, legal matters or competitive examinations is indicated. Short journeys to resolve disputes are likely.",
      education: "Training in medicine, law enforcement, defence or competitive studies yields results. Skill-based certifications are beneficial.",
    },
    7: {
      overview:  "Sun in the 7th house highlights partnerships, marriage, business alliances and public life. A powerful partner enters the picture. Public recognition increases but ego conflicts in relationships must be managed.",
      health:    "Kidney and lower-back areas need attention. Joint ventures and partnerships carry their own stress. Maintain work-life balance to preserve health.",
      career:    "Business partnerships with prominent individuals are highly favourable. Trade, diplomacy, law and public relations flourish. International business dealings are possible.",
      family:    "Marriage or a significant partnership is activated. Spouse may be prominent, government-connected or authoritative. Differences of opinion with the partner need tactful resolution.",
      travel:    "Foreign travel and long-distance journeys for business or diplomatic purposes are indicated. Travels in connection with marriage or partnership matters are likely.",
      education: "Law, diplomacy, international relations and business administration are favoured fields of study.",
    },
    8: {
      overview:  "Sun in the 8th house is challenging, bringing transformation, sudden events, health concerns and occult interests. Deep inner change occurs. Hidden matters surface and require resolution.",
      health:    "Chronic ailments, surgery and recuperation periods are possible. Vitality fluctuates. Regular health monitoring and avoidance of risky activities are essential.",
      career:    "Research, investigation, insurance, occult sciences and inheritance-related work are highlighted. Career transformation may involve a complete change of direction.",
      family:    "Father's health may be a concern. Family disputes over inheritance or hidden matters arise. Support from in-laws is possible but comes with conditions.",
      travel:    "Unexpected journeys and travels in connection with medical treatment or legal matters are likely. Avoid unnecessary risks during travel.",
      education: "Research, investigation, metaphysics, psychology and occult sciences attract interest and yield deep knowledge.",
    },
    9: {
      overview:  "Sun in the 9th house is an auspicious placement, bestowing fortune, father's blessings, religion, long travel and higher learning. Destiny is favoured during this Mahadasha.",
      health:    "General health is good. Thighs and hips may need attention. Spending time in nature and pursuing spiritual practices maintains vitality.",
      career:    "Teaching, law, publishing, religion, philosophy, long-distance trade and government advisory roles flourish. Recognition from authorities and elders brings advancement.",
      family:    "Father's wellbeing and his influence on your destiny are central. Relations with elder relatives and in-laws are supportive. Grandchildren bring joy in later years.",
      travel:    "Long-distance travel, pilgrimages and foreign journeys are strongly indicated. Spiritual tours and journeys for higher education are particularly auspicious.",
      education: "Advanced studies in philosophy, religion, law, international studies or management are strongly supported. Teaching or guiding others is fulfilling.",
    },
    10: {
      overview:  "Sun in the 10th house is one of the most powerful placements for a Mahadasha, bestowing public recognition, career success, status and authority. Professional life reaches its peak.",
      health:    "Overall vitality is strong. Knees and joints may need attention. Work-related stress is the main health challenge; adequate rest is important.",
      career:    "Outstanding period for career advancement. Government honours, promotions, independent authority and public recognition come in abundance. Leadership roles are natural.",
      family:    "Family life improves with increased prosperity. Father's influence on career is strong and positive. Respect and status earned during this period bring lasting pride.",
      travel:    "Travel for professional assignments, government duties and business expansion is frequent. Overseas opportunities for career growth are possible.",
      education: "Opportunities for executive education, administrative training and professional certifications that enhance career standing are available.",
    },
    11: {
      overview:  "Sun in the 11th house brings steady income, fulfilment of desires, influential friends and gains from government sources. Social networks and aspirations are activated.",
      health:    "Ankle and calf areas may be affected. Overall health is good. Avoid overindulgence, which is tempting during this prosperous period.",
      career:    "Income grows steadily, especially from government contracts, networking and organised groups. Elder sibling or influential friend may open important doors.",
      family:    "Elder sibling plays a supportive role. Family aspirations are fulfilled. Domestic prosperity improves and social standing of the family rises.",
      travel:    "Travel within influential social circles and to networking events is common. Journeys yielding financial gain are likely.",
      education: "Completing pending courses and certifications brings recognition. Joining prestigious educational or professional associations is beneficial.",
    },
    12: {
      overview:  "Sun in the 12th house brings spiritual awakening, foreign connections, expenditure and isolation. There is a turning inward, a search for liberation from material concerns.",
      health:    "Eye ailments, disturbed sleep and general fatigue are possible. Spending time in retreat or hospital settings is likely. Mental peace requires conscious effort.",
      career:    "Work in foreign organisations, hospitals, charitable institutions, research centres or behind-the-scenes roles is favoured. Overseas employment is strongly possible.",
      family:    "Father may reside away from home or travel abroad. Privacy in family matters is important. Spiritual growth distances you from mundane family concerns.",
      travel:    "Foreign travel and long-distance journeys are highly indicated. Pilgrimages and spiritual retreats bring deep inner satisfaction.",
      education: "Studies abroad, spirituality, meditation, psychology and mystical sciences attract and reward attention.",
    },
  },

  // ── MOON (10 years) ──────────────────────────────────────────────────────
  Moon: {
    1: {
      overview:  "Moon in the 1st house brings emotional sensitivity, intuition and fluctuating health to the forefront. The mind and emotions shape the entire Mahadasha. Public image and popularity increase.",
      health:    "Emotional and mental health is the main focus. Fluctuating energy, water-related ailments and hormonal imbalances are possible. Adequate rest and emotional stability are essential.",
      career:    "Careers in public service, nursing, hospitality, food, water management, real estate and psychology are favoured. Public popularity translates to professional success.",
      family:    "Mother's wellbeing is central. Domestic life is emotionally rich and sometimes turbulent. Nurturing family relationships brings deep fulfilment.",
      travel:    "Travel near water bodies, pilgrimages and journeys motivated by emotional or family reasons are indicated. Frequent short journeys are common.",
      education: "Psychology, nursing, social work, hospitality and literature are areas of keen interest and success.",
    },
    2: {
      overview:  "Moon in the 2nd house activates family wealth, speech, food and domestic security. There is a strong attachment to ancestral values and a desire to build financial stability for the family.",
      health:    "Face, throat and digestive system need care. Emotional eating can affect health. A balanced diet and emotional stability are important preventive measures.",
      career:    "Finance, banking, food industry, dairy, public speaking, hospitality and real estate bring success. Family business prospers and expands during this period.",
      family:    "Family relations are warm and emotionally charged. Financial support from the family is available. Mother's influence on financial decisions is significant.",
      travel:    "Short trips for family functions, food-related business and local trade are common. Journeys to the mother's home are emotionally nourishing.",
      education: "Finance, commerce, culinary arts, public administration and family business management are favoured subjects.",
    },
    3: {
      overview:  "Moon in the 3rd house stimulates communication, short journeys, creative writing and sibling relationships. Mental agility and curiosity define this period.",
      health:    "Lungs, shoulders and nervous system may need attention. Anxiety and restlessness are common challenges. Breathing exercises and calm routines are beneficial.",
      career:    "Writing, media, journalism, counselling, trading and short-distance commerce prosper. Emotional intelligence becomes a key professional asset.",
      family:    "Siblings, especially sisters, play an important role. Communication within the family improves. The mother may relocate or travel frequently.",
      travel:    "Very frequent short travels. Journeys for business, communication and meeting relatives are common.",
      education: "Languages, communication skills, writing, journalism and counselling are areas of significant progress.",
    },
    4: {
      overview:  "Moon in the 4th house is its own house — a highly auspicious placement giving domestic happiness, property gains, mother's blessings and emotional contentment.",
      health:    "Overall health is good. Chest-related issues and weight fluctuation may occur. Emotional security directly supports physical health.",
      career:    "Real estate, agriculture, dairy, interior design, childcare, psychology and public service careers flourish. Success comes through emotionally connecting with clients and the public.",
      family:    "This is a period of domestic bliss. Mother's health is generally good and her blessings are a source of strength. Property acquisition is strongly indicated.",
      travel:    "Short trips to comfortable, familiar places. Travels near water bodies and pilgrimages to sacred sites are particularly auspicious.",
      education: "Education in psychology, home sciences, agriculture, architecture and environmental studies is favoured.",
    },
    5: {
      overview:  "Moon in the 5th house brings romance, children, creativity and deep emotional intelligence. Intuitive perception is sharp and artistic talents come to the fore.",
      health:    "Stomach and emotional wellbeing are interlinked. Manage stress and practice mindfulness. Children's health may require parental attention.",
      career:    "Entertainment, arts, teaching, child psychology, counselling, creative writing and financial speculation carry potential. Emotional artistry becomes a professional strength.",
      family:    "Children bring joy and emotional meaning. Romantic life is rich and fulfilling. Relations with the mother are warm and supportive.",
      travel:    "Pleasurable trips, pilgrimages and family outings are indicated. Travel motivated by love and emotional connection is common.",
      education: "Arts, psychology, child development, literature and creative studies advance significantly.",
    },
    6: {
      overview:  "Moon in the 6th house brings health vigilance, service and competition. Emotional ups and downs affect work life. There is the capacity to overcome illness and adversaries.",
      health:    "Digestive disorders, water retention and emotional ailments are common. Regular exercise and a clean diet are essential. Mental stress translates into physical symptoms.",
      career:    "Medical care, nursing, social service, government administration and service industries are favoured. Meticulous attention to detail brings recognition.",
      family:    "Relations with maternal relatives may be strained. Domestic disputes are possible but resolvable through patient communication. Mother's health may require attention.",
      travel:    "Travel for health purposes, medical consultations and service activities is indicated.",
      education: "Nursing, nutrition, social work, psychology and administrative services are areas of progress.",
    },
    7: {
      overview:  "Moon in the 7th house brings emotional depth to partnerships and marriage. A caring, emotionally sensitive partner enters the picture. Public relations and trade flourish.",
      health:    "Kidney and bladder health needs monitoring. Emotional turbulence in partnerships can affect overall health. Maintain inner equilibrium in close relationships.",
      career:    "Partnership-based businesses, trade, public relations, counselling and hospitality flourish. Emotional rapport with clients and partners becomes a competitive advantage.",
      family:    "Marriage or a significant emotional partnership is activated. Spouse is nurturing, intuitive and emotionally present. Domestic life is enriched through the partnership.",
      travel:    "Travel with a spouse or partner, and journeys for trade purposes are likely. Water-related travel is particularly auspicious.",
      education: "Counselling, psychology, human relations and business partnership studies are favoured.",
    },
    8: {
      overview:  "Moon in the 8th house is an introspective and sometimes turbulent period, bringing transformation, occult interests and deep psychological change. Intuitive powers are heightened.",
      health:    "Mental health, hormonal fluctuations and chronic ailments require careful management. Avoid stress and seek professional support when needed. Psychosomatic conditions are possible.",
      career:    "Research, psychology, occult sciences, insurance, mining and investigative work bring success. Inheritance and legacy matters are activated.",
      family:    "In-laws' support or conflict is prominent. Mother's health may be a concern. Emotional secrets within the family surface and demand resolution.",
      travel:    "Sudden and unexpected journeys, often for health or legal purposes, are likely. Avoid unnecessary risks during travel.",
      education: "Psychology, metaphysics, research and occult sciences are fields of deep interest and attainment.",
    },
    9: {
      overview:  "Moon in the 9th house bestows intuitive wisdom, devotion, long travel and a deep connection with spiritual and religious life. Fortune smiles through the blessings of the mother and the guru.",
      health:    "Health is generally good. Long-distance travel may cause fatigue. Maintain spiritual and emotional practices to sustain vitality.",
      career:    "Teaching, religious leadership, counselling, long-distance trade, publishing and philosophy bring fulfilment and recognition.",
      family:    "Father's religious influence shapes the family's direction. Relationship with the mother is deeply spiritual. Grandchildren and extended family bring joy.",
      travel:    "Long-distance journeys and pilgrimages to holy places are frequent and deeply fulfilling. Foreign travel for spiritual or educational purposes is indicated.",
      education: "Philosophy, religion, spiritual sciences, law and international studies are areas of deep learning and teaching ability.",
    },
    10: {
      overview:  "Moon in the 10th house brings public recognition, emotional connection with one's career and popularity with the masses. Professional life is driven by the desire to serve and be seen.",
      health:    "Emotional fluctuations directly affect professional performance. Manage stress and ensure adequate rest. Joint and knee health may need attention.",
      career:    "Public sector, media, hospitality, politics, real estate and mass consumer industries flourish. Popularity with the public is a key professional asset.",
      family:    "Mother's pride in your professional achievements is a motivating force. Family reputation improves with career success. Work-life balance needs conscious management.",
      travel:    "Travel for professional assignments, public engagements and career opportunities is frequent. Overseas work stints are possible.",
      education: "Public administration, mass communication, hotel management and social sciences are favoured.",
    },
    11: {
      overview:  "Moon in the 11th house brings financial gains, influential friendships, social networks and fulfilment of heartfelt desires. Intuitive networking brings unexpected opportunities.",
      health:    "Ankle and circulatory health may need attention. Emotional fulfilment positively impacts physical health. Guard against overextending socially.",
      career:    "Networking, social enterprises, NGOs, mass media and income from multiple sources prosper. Influential connections open career doors.",
      family:    "Elder siblings and influential friends support family progress. Family aspirations are fulfilled one by one during this period.",
      travel:    "Travel within influential social and professional circles is common. Group tours and networking events bring valuable connections.",
      education: "Continuing education, professional associations, group study and social sciences are areas of growth.",
    },
    12: {
      overview:  "Moon in the 12th house brings spiritual seeking, foreign connections, charitable activities and periods of withdrawal. Intuition and dream life become powerful guides.",
      health:    "Feet, lymphatic system and emotional health are areas of concern. Proper sleep, meditation and retreat periods restore balance.",
      career:    "Work in foreign countries, healthcare institutions, spiritual organisations, charities and behind-the-scenes roles is favoured.",
      family:    "Mother may reside abroad or face health issues. Family life is private and somewhat secluded. Deep emotional bonds are maintained despite physical distance.",
      travel:    "Foreign travel, long-distance pilgrimages and spiritual retreats are strongly indicated and deeply transformative.",
      education: "Spirituality, psychology, dream analysis, meditation and foreign-language studies are areas of natural aptitude.",
    },
  },

  // ── MARS (7 years) ───────────────────────────────────────────────────────
  Mars: {
    1: {
      overview:  "Mars in the 1st house makes this a dynamic, energetic and sometimes aggressive Mahadasha. Physical strength, boldness and competitive drive characterise the period. Accidents require caution.",
      health:    "High energy but prone to accidents, cuts, burns and fever. Blood pressure and anger management are important health concerns.",
      career:    "Military, police, surgery, engineering, sports and entrepreneurship prosper. Decisive action and leadership bring rapid results.",
      family:    "Relations can be hot-tempered. Disputes with siblings are possible. Father's health may be a concern. Maintaining patience preserves family harmony.",
      travel:    "Frequent travel, often impulsive or driven by competitive or professional motives. Adventure travel and sports expeditions are possible.",
      education: "Engineering, medicine, military science, sports management and physical education are areas of interest and success.",
    },
    2: {
      overview:  "Mars in the 2nd house activates financial aggression, accumulation through effort and potential family disputes over money. Direct and forceful speech can create both opportunities and conflicts.",
      health:    "Face, throat and blood-related disorders need attention. Avoid sharp objects near the face. Control anger to avoid psychosomatic ailments.",
      career:    "Real estate, finance, metallurgy, construction and sales succeed through direct, forceful effort. Income through land, property or manufacturing is favourable.",
      family:    "Family financial disputes and harsh speech can strain relationships. Managing money responsibly and controlling temper preserves family bonds.",
      travel:    "Business travel and journeys related to property or financial matters are common.",
      education: "Finance, engineering, metallurgy and business administration are areas of active learning.",
    },
    3: {
      overview:  "Mars in the 3rd house is an excellent placement bringing courage, bold communication, proactive initiative and support from siblings. Self-effort is richly rewarded during this period.",
      health:    "Shoulders, arms and lungs need care. Injuries during physical activities are possible. Channel aggression into productive exercise.",
      career:    "Media, communication, sports, military communication, logistics, writing and sales are excellent career avenues. Entrepreneurial ventures launched through personal effort succeed.",
      family:    "Siblings, especially brothers, are active and supportive. Competitive dynamics within sibling relationships can be channelled constructively.",
      travel:    "Very frequent short travels for business, negotiation and competitive purposes. Adventurous trips and sports-related journeys are common.",
      education: "Military training, sports science, communication technology and engineering are areas of active development.",
    },
    4: {
      overview:  "Mars in the 4th house brings challenges related to domestic life, mother's health and property disputes, while simultaneously driving ambition for real-estate and property acquisition.",
      health:    "Chest and digestive health require monitoring. Domestic stress and restlessness affect overall wellbeing. Creating a calm home environment is essential.",
      career:    "Construction, real estate, agriculture, civil engineering and government-related land work bring professional success despite domestic turbulence.",
      family:    "Mother's health and temperament are central concerns. Property disputes within the family are possible. Renovation or relocation of the home is likely.",
      travel:    "Travels motivated by property inspection, construction supervision and homeland matters are common.",
      education: "Civil engineering, architecture, agriculture and land management are favoured fields.",
    },
    5: {
      overview:  "Mars in the 5th house energises creativity, competitive sports, speculation, romance and matters related to children. Intelligence is sharp but impulsive decisions in speculation must be controlled.",
      health:    "Stomach, liver and reproductive organs need attention. Children's health may require parental vigilance. Manage competitive stress.",
      career:    "Sports, entertainment, coaching, stock market, gaming, defence training and creative industries flourish. Competitive edge brings professional distinction.",
      family:    "Children may be spirited and require active parenting. Romantic life is passionate. Father remains supportive of competitive ambitions.",
      travel:    "Travel for sports competitions, creative pursuits and pleasure trips is common.",
      education: "Sports science, performing arts, defence studies, mathematics and competitive examination coaching are favoured.",
    },
    6: {
      overview:  "Mars in the 6th house is an exceptionally powerful placement for this Mahadasha. Enemies are defeated, legal battles are won, health issues are overcome and competitive success is virtually guaranteed.",
      health:    "General health improves despite previous ailments. Intestinal and blood-related conditions may occur but respond well to treatment. Physical training keeps Mars's energy constructive.",
      career:    "Legal profession, military, police, surgery, competitive sports and government service bring outstanding success. You outlast and outperform rivals.",
      family:    "Relations with maternal relatives stabilise. Disputes are resolved in your favour. Ability to provide financial support to the family increases.",
      travel:    "Travel for competitive events, legal matters and service duties is frequent.",
      education: "Law, medicine, physical training, military science and competitive examination preparation are strongly supported.",
    },
    7: {
      overview:  "Mars in the 7th house brings an energetic, ambitious and sometimes combative partner. Business partnerships are powerful but require clear agreements to prevent conflicts.",
      health:    "Reproductive system and kidneys need attention. Stress from relationship conflicts can affect physical health. Physical exercise channels Mars energy constructively.",
      career:    "Partnerships in real estate, construction, defence, law and competitive businesses prosper. Joint ventures with determined, action-oriented partners yield results.",
      family:    "Marriage or partnership life is passionate and occasionally contentious. Spouse is independent and career-focused. Clear communication and mutual respect are the keys to harmony.",
      travel:    "Travel with a partner or for partnership-related business is likely. Adventure travel and competitive travel events are possible.",
      education: "Law, business negotiation, conflict resolution and defence management are areas of practical learning.",
    },
    8: {
      overview:  "Mars in the 8th house is its moolatrikona house — bringing transformation, occult interests, secret matters, sudden events and deep courage. Research and investigation come naturally.",
      health:    "Surgery, accidents and chronic ailments may occur. Blood-related conditions and reproductive health require monitoring. Regular medical check-ups are essential.",
      career:    "Research, forensics, surgery, occult sciences, insurance and mining bring professional focus. Courage in crisis situations distinguishes your work.",
      family:    "In-law relations are complex and financially significant. Family secrets or hidden matters surface. Inheritance or legacy matters may be disputed.",
      travel:    "Sudden travels, often for emergency, medical or legal reasons, are likely. Adventure travel requires extra precaution.",
      education: "Medical research, forensic science, psychology, military intelligence and occult studies are areas of deep interest.",
    },
    9: {
      overview:  "Mars in the 9th house brings courage in dharmic pursuits, zealous religious convictions, long travel and a proactive, missionary spirit. Fortune comes through bold, principled action.",
      health:    "Thighs and hips may be affected. Injuries during travel or adventure are possible. Maintain physical discipline to channel Mars energy wisely.",
      career:    "Legal practice, military chaplaincy, sports coaching, religious institution management and long-distance trade prosper. Conviction and courage drive professional progress.",
      family:    "Father may be dynamic and active. Relations with the father involve respectful debate. Younger siblings support your ambitious goals.",
      travel:    "Long-distance journeys, pilgrimages and overseas ventures are strongly indicated. Adventure and mission-driven travel is common.",
      education: "Law, theology, military history, physical training and long-distance trade studies are favoured.",
    },
    10: {
      overview:  "Mars in the 10th house is one of the most career-advancing placements, bringing drive, executive authority, professional competition and tangible results in public life.",
      health:    "Overall physical vitality is strong. Back, knees and joints need care. Work-related injuries or overexertion may occur if boundaries are not maintained.",
      career:    "Military, police, surgery, engineering, entrepreneurship, politics and competitive sports bring outstanding professional recognition. You lead from the front.",
      family:    "Career achievements bring pride to the family. Father's competitive spirit inspires you. Balancing intense professional demands with family needs requires conscious effort.",
      travel:    "Frequent travel for professional duties, government assignments and competitive events. Overseas career opportunities are strongly possible.",
      education: "Military science, engineering, management, entrepreneurship and leadership training are areas of powerful development.",
    },
    11: {
      overview:  "Mars in the 11th house brings financial gains, influential friendships and fulfilment of ambitions through competitive effort. Elder sibling or a dynamic friend opens significant professional doors.",
      health:    "Ankle and blood circulatory health need attention. Physical activity and sports maintain vitality during this period.",
      career:    "Entrepreneurship, sales, military-related organisations, competitive businesses and technology ventures bring robust income. Networking with influential, driven individuals pays dividends.",
      family:    "Elder siblings play an active and sometimes competitive role. Family income and standard of living improve. Collective family goals are achieved.",
      travel:    "Travel with professional associates, competitive teams and influential groups is common.",
      education: "Technology, business strategy, competitive sports management and military sciences are areas of productive study.",
    },
    12: {
      overview:  "Mars in the 12th house brings expenditure, hidden enemies, foreign work opportunities and spiritual warrior themes. Physical energy is spent on behind-the-scenes missions.",
      health:    "Feet, immune system and chronic ailments require monitoring. Avoid risky activities in isolated environments. Sleep disturbances may occur.",
      career:    "Work in foreign countries, military intelligence, hospital administration, charitable organisations and research centres is favoured. Self-employment abroad yields results.",
      family:    "Family life may be disrupted by foreign postings or hidden conflicts. Brother may reside abroad. Maintain proactive communication to preserve relationships.",
      travel:    "Frequent foreign travel and long-distance journeys are strongly indicated. Travel for military or investigative purposes is common.",
      education: "Military intelligence, foreign studies, occult sciences and charitable work administration are areas of development.",
    },
  },

  // ── MERCURY (17 years) ───────────────────────────────────────────────────
  Mercury: {
    1: {
      overview:  "Mercury in the 1st house brings intelligence, communication ability, business acumen and youthful energy. The mind is sharp, witty and constantly seeking new information throughout this long Mahadasha.",
      health:    "Nervous system, skin and respiratory tract may be affected. Mental overstimulation and anxiety are the main health challenges. Grounding practices and adequate sleep are essential.",
      career:    "Writing, journalism, IT, consulting, trading, financial analysis and education flourish. Versatility and intellectual sharpness bring multiple career opportunities.",
      family:    "Witty and engaging communication enriches family life. Relations with siblings and cousins are lively. Intellectual discussions and debates become a family norm.",
      travel:    "Frequent short travels for business, education and communication purposes. Travel stimulates the mind and brings new knowledge.",
      education: "Exceptional period for academic achievement. Languages, mathematics, science, commerce and information technology are areas of distinction.",
    },
    2: {
      overview:  "Mercury in the 2nd house brings financial intelligence, eloquent speech and business acumen. Wealth grows through knowledge, trade and communication-related activities.",
      health:    "Throat, voice and digestive tract need attention. Speech-related ailments and allergies may occur. Maintain a clean diet.",
      career:    "Accountancy, banking, financial journalism, business communication, education and trade bring financial rewards. Oratory and written communication are career strengths.",
      family:    "Family financial decisions benefit from careful intellectual analysis. Communication within the family is articulate and analytical. Siblings support financial ventures.",
      travel:    "Business travel for trade, financial dealings and educational activities is common.",
      education: "Commerce, accounting, financial analysis, business communication and languages are areas of achievement.",
    },
    3: {
      overview:  "Mercury in the 3rd house is its own house — an exceptionally powerful placement for communication, writing, business and intellectual pursuits. The mind operates at its sharpest.",
      health:    "Respiratory system and hands need monitoring. Avoid mental fatigue through regular breaks and mindful practices.",
      career:    "Journalism, writing, publishing, IT, media, public relations, logistics and short-distance trade are powerfully supported. Multiple income streams from intellectual work are possible.",
      family:    "Siblings are intellectual companions and business associates. Communication within the family is rich and multidimensional. Short family trips are frequent.",
      travel:    "Very frequent short travels for business, education and intellectual stimulation.",
      education: "Languages, mathematics, information technology, journalism and communication sciences reach their full potential.",
    },
    4: {
      overview:  "Mercury in the 4th house activates home-based intellectual activities, education, real estate intelligence and communication within the domestic environment.",
      health:    "Chest, respiratory and nervous-system health need attention. Emotionally charged domestic situations create mental stress. A peaceful home environment is vital.",
      career:    "Real estate consultancy, home-based businesses, interior design consultancy, education management and domestic trade prosper.",
      family:    "Family discussions are intellectual and analytical. Mother is educated and communicative. Property transactions involve detailed legal analysis.",
      travel:    "Short trips for property inspection, educational visits and domestic business are common.",
      education: "Home studies, real estate management, domestic sciences and educational administration are favoured.",
    },
    5: {
      overview:  "Mercury in the 5th house brings outstanding intelligence, creative writing, financial speculation through analysis and a gift for teaching children and inspiring others.",
      health:    "Digestive system and nervous health need monitoring. Mental restlessness in speculative ventures requires careful management.",
      career:    "Teaching, writing, financial analysis, stock market, entertainment scripting, counselling and creative education flourish. Intellectual creativity is richly rewarded.",
      family:    "Children are bright and intellectually curious. Analytical communication with children is a parenting strength. Relations with a romantic partner are mentally stimulating.",
      travel:    "Travel for educational events, intellectual conferences and children's activities is common.",
      education: "Academic research, creative writing, educational psychology, mathematics and financial analysis are areas of significant achievement.",
    },
    6: {
      overview:  "Mercury in the 6th house gives success in legal disputes, medical analysis, detailed service work and competitive examinations. Analytical attention to detail overcomes rivals.",
      health:    "Digestive disorders, allergies and nervous-system issues need attention. Regular exercise and dietary discipline are important preventive measures.",
      career:    "Law, medicine, accounting, auditing, analytical services and competitive civil services flourish. Writing legal documents, medical reports and detailed analyses brings recognition.",
      family:    "Relations with maternal relatives involve intellectual debates. Disputes are resolved through careful documentation and communication.",
      travel:    "Travel for legal matters, medical consultations and competitive examinations is indicated.",
      education: "Law, medicine, auditing, analytical studies and competitive examination preparation are areas of distinction.",
    },
    7: {
      overview:  "Mercury in the 7th house brings an intellectual, communicative and analytically sharp partner. Business partnerships with clever individuals are favoured. Legal and commercial agreements are highlighted.",
      health:    "Kidney and nervous-system health require attention. Mental overstimulation from partnership negotiations can affect overall wellbeing.",
      career:    "Business partnerships, law, trade negotiations, consulting, counselling and intellectual commerce prosper. Contracts and agreements require careful review.",
      family:    "Spouse is witty, intellectually active and business-oriented. Communication in marriage is lively and mentally engaging.",
      travel:    "Travel for business negotiations, legal proceedings and partnership development is common. Overseas business is indicated.",
      education: "Business law, negotiation, diplomacy and commercial studies are strongly supported.",
    },
    8: {
      overview:  "Mercury in the 8th house deepens research abilities, analytical investigation, occult sciences and hidden knowledge. This is a period of intellectual transformation and discovery.",
      health:    "Nervous system and intestinal health require monitoring. Mental overload from research and investigation can cause fatigue.",
      career:    "Research, forensic accounting, psychological analysis, taxation, insurance and occult sciences bring professional distinction. Uncovering hidden information is a key strength.",
      family:    "Matters of inheritance, in-law relations and hidden family financial information come to the fore. Clear communication in sensitive matters prevents misunderstandings.",
      travel:    "Travel for investigative, research and transformational purposes is likely.",
      education: "Research methodology, forensic sciences, psychology, taxation, actuarial sciences and occult studies are areas of deep attainment.",
    },
    9: {
      overview:  "Mercury in the 9th house gives intellectual brilliance in higher learning, philosophy, law, publishing and long-distance communication. Fortune comes through knowledge-sharing.",
      health:    "Thighs and nervous system need attention. Long-distance travel may cause fatigue. Mindful travel practices maintain health.",
      career:    "Teaching, publishing, legal consulting, translation, long-distance trade and academic research bring recognition and income.",
      family:    "Father is educated and intellectually influential. Relations with the guru and teacher figures in the family are stimulating and enriching.",
      travel:    "Long-distance journeys for academic conferences, publishing events and educational work are frequent.",
      education: "Advanced degrees, philosophy, foreign languages, law and long-distance learning programmes are areas of outstanding achievement.",
    },
    10: {
      overview:  "Mercury in the 10th house is a powerful career placement giving intellectual authority, professional communication skills and recognition in intellectual fields.",
      health:    "Work-related stress and nervous-system demands need regular management. Adequate rest and mental breaks are essential.",
      career:    "IT, consulting, journalism, education, financial services and government communication roles bring outstanding professional recognition. Intellectual versatility is a career asset.",
      family:    "Career achievements in intellectual fields bring family pride. Communication with family members improves during periods of professional success.",
      travel:    "Professional travel for intellectual assignments, consultancy and media work is frequent.",
      education: "Executive education, professional certifications, management and advanced analytical courses are areas of growth.",
    },
    11: {
      overview:  "Mercury in the 11th house brings income through intellectual and communication activities, influential network connections and fulfilment of intellectual ambitions.",
      health:    "Circulatory and nervous-system health need monitoring. Social overcommitment can cause mental fatigue.",
      career:    "IT networking, business intelligence, social media, trading, writing and consultancy bring multiple income streams. Influential connections in intellectual fields open doors.",
      family:    "Elder siblings support intellectual ventures. Family income improves through knowledge-based work.",
      travel:    "Travel within professional intellectual communities and networking events is common.",
      education: "Advanced degrees, professional networking, business intelligence and information technology are areas of active development.",
    },
    12: {
      overview:  "Mercury in the 12th house brings intellectual engagement with spiritual subjects, foreign communication and behind-the-scenes analytical work. The mind seeks liberation through knowledge.",
      health:    "Sleep disorders, foot health and mental exhaustion require attention. Periods of retreat and reduced mental stimulation restore balance.",
      career:    "Foreign communication, translation, research for international organisations, spiritual writing and cryptography bring professional focus.",
      family:    "Siblings may reside abroad. Family communication is maintained through digital and written means. Privacy in family matters is important.",
      travel:    "Foreign travel and long-distance journeys for intellectual and spiritual purposes are strongly indicated.",
      education: "Foreign languages, spiritual sciences, cryptography, international studies and distance learning are areas of natural aptitude.",
    },
  },

  // ── JUPITER (16 years) ──────────────────────────────────────────────────
  Jupiter: {
    1: {
      overview:  "Jupiter in the 1st house bestows wisdom, physical well-being, spiritual inclination and natural authority. This is one of the most auspicious Mahadasha placements, bringing overall prosperity.",
      health:    "Generally good health. Tendency to weight gain and liver-related conditions. Regular exercise and moderation in diet are the main precautions.",
      career:    "Teaching, law, advisory roles, spiritual leadership, finance, government and management bring recognition and growth. Wisdom becomes the primary career asset.",
      family:    "Family life is harmonious, prosperous and spiritually enriched. Relations with children and grandchildren are warm and deeply fulfilling.",
      travel:    "Long-distance travel for spiritual, educational and advisory purposes is auspicious and enriching.",
      education: "Philosophy, law, finance, spirituality and management are areas of deep learning and teaching ability.",
    },
    2: {
      overview:  "Jupiter in the 2nd house brings financial prosperity, family happiness, eloquent speech and an expansive accumulation of wealth. This is one of the most financially rewarding Mahadasha placements.",
      health:    "Face, throat and liver health need monitoring. Over-eating and over-indulgence should be consciously restrained.",
      career:    "Banking, finance, teaching, publishing, family business and trade in precious commodities bring substantial income.",
      family:    "Family life is prosperous, harmonious and spiritually enriched. Children and grandchildren bring joy. Ancestral wealth may be received.",
      travel:    "Travel for financial, educational and religious purposes brings gains and expanding knowledge.",
      education: "Finance, commerce, philosophy, languages and literature are areas of natural achievement.",
    },
    3: {
      overview:  "Jupiter in the 3rd house brings wisdom to communication, philosophical writing and long-distance intellectual outreach. Siblings benefit from Jupiter's benevolent presence.",
      health:    "Respiratory system and shoulders need attention. Generally good health sustained through moderate activity and a disciplined lifestyle.",
      career:    "Publishing, writing, education, religious communication, teaching and long-distance advisory work prosper. Intellectual generosity becomes a career asset.",
      family:    "Siblings benefit from the wisdom and generosity you extend. Communication within the family is profound and philosophically enriching.",
      travel:    "Short intellectual and spiritual travels are frequent. Long-distance correspondence and advisory journeys are indicated.",
      education: "Philosophy, religious studies, writing, publishing, education administration and advisory training are areas of distinction.",
    },
    4: {
      overview:  "Jupiter in the 4th house brings domestic prosperity, a large and happy home, mother's blessings and property gains. Contentment and inner happiness are defining features of this Mahadasha.",
      health:    "Chest and lungs may need attention. Emotional contentment directly supports physical health. Weight management requires conscious effort.",
      career:    "Real estate, education management, domestic consultancy, agriculture and public service bring professional success and community respect.",
      family:    "Domestic life is genuinely prosperous and spiritually enriching. Mother is wise and deeply supportive. Home expansion or acquisition of property is likely.",
      travel:    "Journeys to educational institutions, religious centres and family gatherings bring joy and wisdom.",
      education: "Educational administration, philosophy, agricultural sciences and community development studies are favoured.",
    },
    5: {
      overview:  "Jupiter in the 5th house is its moolatrikona house — an exceptionally auspicious placement bringing intelligence, children, spiritual merit, creativity and speculative gains.",
      health:    "Generally excellent health. Stomach and liver may occasionally need attention. This is a period of vitality and physical wellbeing.",
      career:    "Education, spiritual teaching, finance, creative arts, consultancy and advisory roles bring distinction. Guiding others becomes a defining professional role.",
      family:    "Children bring joy and are academically gifted. Relations with the father are deeply spiritual and supportive. Family life is rich in cultural and spiritual tradition.",
      travel:    "Pilgrimages, educational tours and travels for cultural enrichment are particularly auspicious.",
      education: "The finest period for academic achievement. Philosophy, spirituality, creative arts, finance and teaching are areas of exceptional attainment.",
    },
    6: {
      overview:  "Jupiter in the 6th house brings compassionate service, victory in legal matters and healing power. Health challenges are overcome through faith and discipline.",
      health:    "Digestive conditions may arise but respond well to systematic treatment. Faith and positive attitude accelerate healing. Dietary discipline is important.",
      career:    "Medical, legal, charitable, administrative and healing professions prosper. Teaching and guiding the underprivileged brings both income and spiritual merit.",
      family:    "Relations with maternal relatives are warm and supportive. Disputes are resolved with wisdom and generosity.",
      travel:    "Travel for service, religious missions and legal work is productive.",
      education: "Law, medicine, social work, theology and public health are areas of practical learning.",
    },
    7: {
      overview:  "Jupiter in the 7th house brings a wise, generous and spiritually attuned partner. Business partnerships with honourable individuals prosper. Marriage is deeply fulfilling.",
      health:    "Kidneys and hips may need occasional attention. Partnership-related contentment directly supports overall health.",
      career:    "Law, counselling, teaching, spiritual counselling, trade and advisory partnerships with learned individuals flourish.",
      family:    "Marriage brings deep spiritual and emotional fulfilment. Spouse is educated, wise and supportive. Family prosperity increases through partnerships.",
      travel:    "Travel with a spouse or partner for spiritual, educational and business purposes is auspicious.",
      education: "Law, counselling, diplomacy and business ethics are areas of strong learning and teaching.",
    },
    8: {
      overview:  "Jupiter in the 8th house mitigates the challenging qualities of this house, bringing occult wisdom, longevity protection, inheritance and spiritual transformation.",
      health:    "Jupiter's protective influence guards longevity. Liver and reproductive health may need attention. Regular health checks are prudent.",
      career:    "Occult sciences, astrology, religious research, insurance, taxation and legacy management bring professional focus and income.",
      family:    "In-law relations are supportive and spiritually enriching. Inheritance and legacy matters are settled fairly. Family transformation is managed with wisdom.",
      travel:    "Spiritual journeys, long-distance travel and journeys to sacred healing sites are indicated.",
      education: "Astrology, occult sciences, metaphysics, religious research and financial planning are areas of deep attainment.",
    },
    9: {
      overview:  "Jupiter in the 9th house is its own house — a supremely auspicious placement for fortune, wisdom, spiritual leadership, long travel and divine grace.",
      health:    "Excellent health sustained by faith and a disciplined lifestyle. Liver and thighs need moderate attention.",
      career:    "Teaching, spiritual leadership, judicial work, publishing, long-distance trade and philosophical advisory roles bring the highest professional recognition.",
      family:    "Father's spiritual wisdom shapes the family's direction. Family is religiously oriented and prosperous. Relations with the guru and elder mentors are deeply rewarding.",
      travel:    "Long pilgrimages, overseas journeys for spiritual and educational purposes, and prestigious international assignments are strongly indicated.",
      education: "Advanced spiritual education, philosophy, international law, sacred texts and higher management studies are areas of outstanding achievement.",
    },
    10: {
      overview:  "Jupiter in the 10th house brings career distinction, public honour, government recognition and authority. Professional life reaches its finest expression.",
      health:    "Generally strong health. Overwork and its effects on the digestive system and knees require management.",
      career:    "Judicial work, government advisory roles, teaching at senior levels, executive management and public service bring career peaks. Honesty and wisdom are recognised and rewarded.",
      family:    "Professional achievements bring great pride and prosperity to the family. Father's guidance and wisdom shape career choices.",
      travel:    "Travel for professional assignments, international advisory roles and educational institutions is frequent.",
      education: "Senior management programmes, law, philosophy, public administration and educational leadership are areas of excellence.",
    },
    11: {
      overview:  "Jupiter in the 11th house brings abundant income, generous friendships, fulfilment of aspirations and financial gains from multiple sources including wisdom-sharing.",
      health:    "Good health overall. Moderation in diet prevents weight gain and liver strain.",
      career:    "Financial advisory, NGOs, international organisations, publishing, education and business consulting bring substantial income and social impact.",
      family:    "Elder siblings prosper and support family aspirations. Family desires are fulfilled steadily and joyfully.",
      travel:    "Travel within international professional circles, educational institutions and spiritual networks is rewarding.",
      education: "Higher education, international degrees, professional networking and spiritual learning are areas of active and productive engagement.",
    },
    12: {
      overview:  "Jupiter in the 12th house brings spiritual liberation, service to others, foreign connections and generous expenditure on worthy causes. This is a period of spiritual wealth.",
      health:    "Feet and lymphatic health need attention. Inner peace and spiritual practices sustain overall health.",
      career:    "Work in foreign institutions, charitable organisations, religious establishments, research centres and spiritual retreats brings fulfilment and steady income.",
      family:    "Family life is marked by spiritual generosity and charitable giving. Father may reside abroad or be deeply religious.",
      travel:    "Long pilgrimages, foreign educational journeys and extended spiritual retreats are among the most fulfilling activities of this period.",
      education: "Spiritual philosophy, foreign religions, charitable management, international diplomacy and metaphysics are areas of natural attainment.",
    },
  },

  // ── VENUS (20 years) ─────────────────────────────────────────────────────
  Venus: {
    1: {
      overview:  "Venus in the 1st house bestows beauty, charm, artistic sensibility and material pleasures. Personal magnetism is at its peak during this 20-year Mahadasha, attracting love, luxury and social recognition.",
      health:    "Reproductive system and kidneys need care. Over-indulgence in food, drink and pleasures is the main health risk. Moderation preserves natural beauty and health.",
      career:    "Fashion, arts, entertainment, luxury goods, hospitality, beauty, music and design flourish. Charm and aesthetic sense are powerful professional assets.",
      family:    "Love, romance and harmonious family life are defining features. Marriage or meaningful romantic partnership is activated. Relations with women in the family are warm.",
      travel:    "Travel for pleasure, arts events, cultural festivals and romance is frequent and joyful.",
      education: "Fine arts, music, fashion design, hospitality management and aesthetics are areas of natural talent and achievement.",
    },
    2: {
      overview:  "Venus in the 2nd house brings material prosperity, beautiful possessions, financial gains through luxury industries and pleasures of fine food and social enjoyment.",
      health:    "Throat, taste buds and kidneys need attention. Dietary discipline regarding rich foods, sugar and alcohol is important for sustained health.",
      career:    "Banking, jewellery, fashion, food and beverage, luxury real estate, cosmetics and finance bring material wealth and social prestige.",
      family:    "Family life is luxurious, harmonious and culturally rich. Relations with women in the family are affectionate. Family gatherings are joyful and socially refined.",
      travel:    "Pleasure trips, cultural events and travel for luxury trade or arts are enjoyable and rewarding.",
      education: "Finance, jewellery design, culinary arts, fashion management and interior design are areas of achievement.",
    },
    3: {
      overview:  "Venus in the 3rd house brings artistic communication, musical or writing talents, charming siblings and pleasurable short journeys. Creative self-expression is highly rewarded.",
      health:    "Throat and respiratory health need attention. A balanced lifestyle prevents over-indulgence in social pleasures.",
      career:    "Music, fine arts, creative writing, fashion journalism, advertising, luxury tourism and event management prosper.",
      family:    "Siblings, particularly sisters, are charming and supportive. Social gatherings with family are frequent and enjoyable.",
      travel:    "Frequent short travel for arts events, social gatherings and luxury shopping is common.",
      education: "Performing arts, music, creative writing, fashion and advertising are areas of natural talent and success.",
    },
    4: {
      overview:  "Venus in the 4th house brings a beautiful home, domestic harmony, mother's love and pleasures of comfortable living. Property acquisition and luxury vehicle purchases are likely.",
      health:    "Chest and kidneys need occasional care. Emotional contentment in the home directly supports physical health and beauty.",
      career:    "Interior design, real estate in the luxury segment, hospitality management, agriculture and domestic goods industries prosper.",
      family:    "Domestic life is one of comfort, beauty and harmony. Mother is gracious and affectionate. Home improvements and property gains are indicated.",
      travel:    "Pleasure journeys to beautiful destinations, cultural sites and resort properties are frequent.",
      education: "Interior design, architecture, hospitality management and home sciences are areas of cultivation.",
    },
    5: {
      overview:  "Venus in the 5th house brings romantic love, artistic creativity, beautiful children and financial gains through speculative pleasures. This is a period of joy and aesthetic expression.",
      health:    "Reproductive organs and digestive health need attention. Manage romantic stress and speculative losses to preserve emotional wellbeing.",
      career:    "Entertainment, creative arts, fashion, jewellery design, financial advisory and teaching aesthetics bring professional recognition.",
      family:    "Children are beautiful and artistically gifted. Romantic relationships are fulfilling and deeply pleasurable. Relations with the father are affectionate.",
      travel:    "Romantic travel, arts festivals and pleasure trips are characteristic of this period.",
      education: "Fine arts, music, fashion, aesthetics, philosophy and speculative financial studies are areas of joy and achievement.",
    },
    6: {
      overview:  "Venus in the 6th house brings victories in competitions related to beauty and arts, service through aesthetic means and recovery from health challenges through natural remedies.",
      health:    "Kidney, reproductive and lower back health need monitoring. Natural healing methods, spa therapies and dietary care are effective.",
      career:    "Beauty and wellness industry, alternative healing arts, fashion consultancy, legal advisory and artisan crafts bring professional success.",
      family:    "Relations with maternal relatives are managed with grace and diplomacy. Disputes are resolved through harmonious communication.",
      travel:    "Travel for wellness retreats, beauty industry events and legal resolution is indicated.",
      education: "Beauty therapy, naturopathy, alternative medicine, fashion law and artisan crafts are areas of attainment.",
    },
    7: {
      overview:  "Venus in the 7th house is its own house — an exceptionally auspicious placement for marriage, partnerships and public love. This is the finest period for love, marriage and business alliances.",
      health:    "Reproductive system and kidneys require gentle attention. Joy in relationships sustains vitality.",
      career:    "Fashion, luxury goods trade, arts businesses, diplomacy, legal partnerships and luxury hospitality prosper through mutual harmony.",
      family:    "Marriage is the defining event of this period. Spouse is beautiful, charming and socially accomplished. Domestic life is refined, loving and pleasurable.",
      travel:    "Travel with a partner to romantic, cultural and luxurious destinations is frequent and enriching.",
      education: "Arts, diplomacy, fashion law, luxury business management and relationship counselling are areas of natural skill.",
    },
    8: {
      overview:  "Venus in the 8th house brings hidden pleasures, deep romantic transformations, occult beauty practices and financial gains through inheritance or in-law relationships.",
      health:    "Reproductive system and kidneys need careful monitoring. Hidden indulgences and emotional complexities require management.",
      career:    "Luxury goods import-export, inheritance management, occult beauty arts, holistic healing and insurance benefit from Venus's transformative touch.",
      family:    "In-law relationships provide financial and emotional resources. Transformation in love life is profound. Hidden pleasures and financial matters from the family emerge.",
      travel:    "Travel for occult arts, deep cultural experiences and hidden romantic encounters is characteristic.",
      education: "Occult arts, beauty science research, tantra, holistic healing and transformative arts are areas of deep study.",
    },
    9: {
      overview:  "Venus in the 9th house brings a love of beauty in religion, philosophical grace, a charming father figure and auspicious long-distance travel. Fortune is gentle and pleasurable.",
      health:    "Thighs and reproductive health need attention. Balanced spiritual and pleasurable lifestyle sustains overall health.",
      career:    "Fashion and arts in international markets, luxury travel industry, spiritual arts and philosophical writing bring recognition.",
      family:    "Father is charming and culturally refined. Family interest in arts, religion and travel is a common bond.",
      travel:    "Long-distance travel to beautiful, culturally rich and spiritually significant places is frequent and deeply satisfying.",
      education: "Philosophy of aesthetics, international arts, luxury fashion business and cultural studies are areas of achievement.",
    },
    10: {
      overview:  "Venus in the 10th house brings professional distinction in arts, luxury, diplomacy and public-facing roles. Beauty and charm are recognised and rewarded in the professional sphere.",
      health:    "Generally good health. Back and kidneys need occasional attention. Professional social life requires moderation.",
      career:    "Fashion, entertainment, luxury hospitality, diplomatic services, arts administration and beauty business leadership bring professional peaks.",
      family:    "Career success in aesthetic fields brings family pride. Social connections through professional life enrich family gatherings.",
      travel:    "Travel for professional engagements, cultural events and luxury business is frequent.",
      education: "Arts administration, luxury brand management, fashion leadership and diplomatic studies are areas of cultivation.",
    },
    11: {
      overview:  "Venus in the 11th house brings abundant financial gains, beautiful friendships, social pleasures and fulfilment of desires for luxury and artistic expression.",
      health:    "Circulatory and kidney health need moderate attention. Social pleasures should be enjoyed in moderation.",
      career:    "Luxury goods trade, arts businesses, high-end hospitality, beauty industry and fashion retail bring substantial income and social prestige.",
      family:    "Elder sisters or female friends bring joy and meaningful connections. Family social life is enriched and refined.",
      travel:    "Social travel to cultural events, luxury destinations and artistic festivals is frequent and joyful.",
      education: "Fashion management, luxury business, arts curation and social science studies are areas of active development.",
    },
    12: {
      overview:  "Venus in the 12th house brings private pleasures, spiritual arts, foreign romance and beautiful spending in foreign lands. Bed pleasures and meditative arts are particularly favoured.",
      health:    "Feet, reproductive health and sleep quality need attention. Spiritual beauty practices and adequate rest restore balance.",
      career:    "Luxury tourism, foreign arts, spiritual wellness business, meditation retreats and international fashion bring professional focus.",
      family:    "Private and secluded romantic life. Spouse or partner may be from a foreign background. Family life has a spiritual and artistic quality.",
      travel:    "Foreign travel to beautiful destinations, spiritual arts retreats and romantic journeys abroad are strongly indicated.",
      education: "Foreign arts, spiritual aesthetics, luxury hospitality abroad and international fashion studies are areas of natural aptitude.",
    },
  },

  // ── SATURN (19 years) ────────────────────────────────────────────────────
  Saturn: {
    1: {
      overview:  "Saturn in the 1st house brings a period of disciplined effort, karmic lessons, health challenges and slow but steady rise. Results come through persistence, endurance and hard work over time.",
      health:    "Bones, joints, skin, teeth and the nervous system require regular care. Chronic conditions may develop but respond to disciplined treatment. Avoid cold and damp environments.",
      career:    "Slow but steady career advancement through hard work and discipline. Government service, law, mining, agriculture, engineering and social service are favoured over time.",
      family:    "Family responsibilities are heavy. Father's health may be a concern. Patience and duty sustain family relationships through challenging periods.",
      travel:    "Travel is purposeful and duty-driven rather than pleasurable. Journeys for work, service and karmic resolution are common.",
      education: "Long-term studies, professional certifications, civil service preparation and technical disciplines are areas of persistent effort and eventual success.",
    },
    2: {
      overview:  "Saturn in the 2nd house brings delayed financial progress, frugality, family responsibilities and slow speech, but eventual material security through disciplined saving and effort.",
      health:    "Dental health, voice and throat need attention. Nutritional balance and dietary discipline are important.",
      career:    "Mining, metallurgy, agriculture, real estate in the affordable segment, manufacturing and traditional family businesses yield slow but reliable returns.",
      family:    "Family financial responsibilities are significant. Relations with elders in the family require patience. Frugality and financial discipline become family values.",
      travel:    "Travel is purposeful and work-related. Short trips for financial and family duties are common.",
      education: "Financial management, accounting, mining engineering, metallurgy and traditional crafts are areas of patient learning.",
    },
    3: {
      overview:  "Saturn in the 3rd house brings disciplined communication, persistent effort, karmic lessons with siblings and slow but rewarding results from consistent self-effort.",
      health:    "Shoulders, arms, lungs and nervous system need attention. Respiratory conditions require monitoring.",
      career:    "Technical writing, engineering, logistics, mining communication, traditional crafts and disciplined entrepreneurship yield results through persistent effort.",
      family:    "Relations with siblings involve karmic responsibilities. Siblings may face challenges requiring your support. Communication is serious and measured.",
      travel:    "Purposeful, duty-driven short journeys are common. Travel for technical and service purposes yields practical results.",
      education: "Technical training, engineering, craftsmanship, traditional sciences and disciplined study programmes are areas of slow but lasting achievement.",
    },
    4: {
      overview:  "Saturn in the 4th house brings domestic responsibilities, property-related challenges, mother's health concerns and a slow development of domestic security.",
      health:    "Chest, stomach and mental health require attention. Domestic stress and emotional heaviness affect overall wellbeing.",
      career:    "Real estate in the affordable segment, agriculture, mining, civil engineering and social housing work bring slow but steady professional results.",
      family:    "Mother's health and domestic responsibilities are central themes. Property matters require careful legal documentation. Home environment is modest but increasingly secure.",
      travel:    "Purposeful travel for property inspection, ancestral duties and social service is indicated.",
      education: "Civil engineering, agriculture, public administration and social sciences are areas of methodical study.",
    },
    5: {
      overview:  "Saturn in the 5th house brings delayed blessings related to children, disciplined intellectual pursuits and slow but eventually rewarding speculative activities.",
      health:    "Digestive and joint health need attention. Mental stress from delayed life milestones requires careful management.",
      career:    "Teaching with rigour, technical training, long-term financial planning, systematic research and disciplined speculation bring rewards after sustained effort.",
      family:    "Parenthood and children require patient effort. Children may face initial obstacles but succeed through discipline. Romantic life develops slowly and seriously.",
      travel:    "Travel for educational, competitive and duty-related purposes is more common than pleasure travel.",
      education: "Advanced academic degrees, disciplined research, mathematics, civil services and long-term professional training are areas of eventual distinction.",
    },
    6: {
      overview:  "Saturn in the 6th house brings great power over enemies, victory in legal and competitive matters and exceptional service capacity. This is one of the most powerful placements for career success through hard work.",
      health:    "Intestinal, bone and joint health need regular attention. Disciplined lifestyle, exercise and preventive healthcare bring robust long-term health.",
      career:    "Law, government service, judicial administration, military, mining, civil engineering and social service sectors bring recognition and career advancement.",
      family:    "Relations with maternal relatives are managed through duty and responsibility. Family disputes are resolved through persistent, methodical effort.",
      travel:    "Travel for legal, government and service purposes is frequent.",
      education: "Law, public administration, social work, engineering and technical sciences are areas of methodical achievement.",
    },
    7: {
      overview:  "Saturn in the 7th house brings a responsible, mature and sometimes older partner. Marriage may be delayed but once established is enduring and duty-bound. Business partnerships are serious and long-term.",
      health:    "Reproductive system and joints in the lower body require attention. Partnership stress affects overall health.",
      career:    "Long-term business partnerships, legal consultancy, government contract work and structured trade prosper through discipline and mutual commitment.",
      family:    "Marriage may come later than expected but is stable and enduring. Spouse is mature, responsible and career-focused. Family life is structured and duty-oriented.",
      travel:    "Purposeful travel with a partner for business and duty-related purposes is common.",
      education: "Contract law, business administration, public sector management and structured professional education are favoured.",
    },
    8: {
      overview:  "Saturn in the 8th house is its own house — a powerful though challenging placement bringing longevity, disciplined investigation of hidden matters and karmic transformation.",
      health:    "Chronic conditions, bone and joint issues and dental health require regular monitoring. Longevity is generally protected despite health challenges.",
      career:    "Research, mining, government secret services, taxation, forensic accounting, insurance and occult sciences bring professional distinction through deep, patient work.",
      family:    "Karmic inheritance and family legacy matters require careful management. In-law relationships are structured and duty-bound.",
      travel:    "Travel for investigative, administrative and karmic resolution purposes is indicated.",
      education: "Advanced research, forensic sciences, taxation, government administration and occult disciplines are areas of deep attainment.",
    },
    9: {
      overview:  "Saturn in the 9th house brings a disciplined, sometimes austere spiritual path, karmic responsibilities related to the father and long journeys motivated by duty.",
      health:    "Thighs, hips and sciatic nerve require attention. Long-distance travel may cause physical strain. Moderation and systematic care sustain health.",
      career:    "Judicial service, religious administration, long-distance government work, disciplined philosophical teaching and social justice work bring recognition over time.",
      family:    "Father carries karmic weight and responsibilities. Relations with elders and senior figures require patience and respect. Family spiritual practices are serious and structured.",
      travel:    "Long-distance duty-driven journeys and pilgrimages to austere spiritual centres are common.",
      education: "Advanced law, government administration, social justice, history and disciplined spiritual studies are areas of methodical achievement.",
    },
    10: {
      overview:  "Saturn in the 10th house is its exaltation house — bringing ultimate career authority, government recognition, power and lasting professional legacy through disciplined effort.",
      health:    "Knees, joints and physical endurance require maintenance. Work pressure is intense but manageable with discipline.",
      career:    "Government authority, judicial power, executive leadership, engineering and social administration reach their peak. Career achievements become permanent and historically significant.",
      family:    "Professional status brings immense family pride. Father's discipline and legacy shape career choices. Family benefits substantially from career success.",
      travel:    "Frequent professional travel for government, judicial and executive purposes. International authority assignments are possible.",
      education: "Senior executive programmes, government administration, law and engineering management are areas of distinction.",
    },
    11: {
      overview:  "Saturn in the 11th house eventually brings substantial income, influential and serious friendships and realisation of long-held ambitions through disciplined effort over time.",
      health:    "Circulatory system, ankles and joints need monitoring. Patience in pursuing financial goals prevents stress-related health issues.",
      career:    "Structured organisations, government enterprises, mining and infrastructure industries, serious professional associations and long-term investment management bring income.",
      family:    "Elder siblings face responsibilities but provide meaningful support. Family financial goals are achieved through sustained and disciplined collective effort.",
      travel:    "Travel within professional organisations and government networks is purposeful and productive.",
      education: "Long-term professional certifications, advanced technical degrees and structured academic programmes are areas of eventual success.",
    },
    12: {
      overview:  "Saturn in the 12th house brings service in isolated environments, foreign postings, spiritual discipline and gradual liberation from material attachments.",
      health:    "Feet, immune system and chronic conditions require attention. Spiritual discipline and adequate rest are the most effective health management tools.",
      career:    "Government postings abroad, prison administration, hospital management, mining in remote locations and spiritual institution management bring professional role fulfilment.",
      family:    "Family life is sometimes distant or separated by geography. Duty to family is fulfilled from a distance. Spiritual growth is the primary personal focus.",
      travel:    "Long-distance foreign journeys, postings to remote locations and structured spiritual retreats are characteristic of this period.",
      education: "Spiritual disciplines, advanced research in isolation, foreign studies and structured philosophical education are areas of patient and profound attainment.",
    },
  },

  // ── RAHU (18 years) ──────────────────────────────────────────────────────
  Rahu: {
    1: {
      overview:  "Rahu in the 1st house brings dramatic personality transformation, unconventional identity and an obsessive drive for self-projection. This period is marked by rapid external changes, foreign influences and material ambitions.",
      health:    "Neurological conditions, skin issues, mysterious ailments and addictive tendencies require attention. Anxiety and identity-related stress are common. Regular grounding practices are essential.",
      career:    "Technology, foreign companies, unconventional businesses, politics and media bring rapid career transformation. Ambitions are large and sometimes achieved through non-traditional paths.",
      family:    "Family relations may be strained by unconventional choices. Father's influence is complex. A foreign spouse or partner may become part of the family narrative.",
      travel:    "Foreign travel and long-distance journeys are a defining feature. Frequent moves between locations are possible.",
      education: "Technology, foreign languages, international studies and unconventional academic paths attract strong interest and sometimes distinction.",
    },
    2: {
      overview:  "Rahu in the 2nd house brings obsession with wealth accumulation, unconventional financial methods and complex family dynamics. Financial gains come through non-traditional means.",
      health:    "Oral health, voice, throat and dietary habits require attention. Unconventional dietary practices and substances should be managed carefully.",
      career:    "International trade, foreign currency, non-traditional financial instruments, media speaking and unconventional business models bring financial results.",
      family:    "Family dynamics are complex. Unconventional speech and values may create discord. Wealth is accumulated through non-traditional family business models.",
      travel:    "Travel for international business and financial purposes. Foreign currencies and assets attract attention.",
      education: "International finance, foreign business, digital commerce and unconventional economic studies attract focus.",
    },
    3: {
      overview:  "Rahu in the 3rd house brings extraordinary communication abilities, bold self-promotion, powerful sibling dynamics and success through media and technology.",
      health:    "Shoulders, arms and nervous system need attention. Over-stimulation from communication and technology use is a health risk.",
      career:    "Digital media, technology communication, unconventional journalism, social media influencing and technology sales bring rapid success.",
      family:    "Sibling relationships are intense and transformative. A sibling may be from a different cultural background or foreign connection. Communication within the family is bold and unconventional.",
      travel:    "Frequent short travels, often driven by media and technology work. Spontaneous journeys are common.",
      education: "Digital technology, mass communication, social media strategy and unconventional communication studies are areas of natural success.",
    },
    4: {
      overview:  "Rahu in the 4th house brings disruption of domestic peace, unconventional home environment, property-related obsessions and a mother with complex influence on the native.",
      health:    "Chest, stomach and mental health require careful management. Domestic instability creates emotional health challenges.",
      career:    "Real estate in foreign countries, construction with foreign technology, property investment and unconventional domestic industries attract focus and financial results.",
      family:    "Domestic life goes through significant transformation. Mother may have foreign connections. Property matters are complex but potentially very lucrative.",
      travel:    "Relocation, sometimes internationally, is strongly indicated. Travel for property-related purposes is frequent.",
      education: "International real estate, foreign construction technologies, unconventional domestic sciences and property management studies attract interest.",
    },
    5: {
      overview:  "Rahu in the 5th house brings unconventional creativity, speculation, complex children's matters and intense romantic experiences. Artistic and intellectual output is innovative and boundary-breaking.",
      health:    "Stomach, reproductive organs and emotional wellbeing require monitoring. Speculative stress and intense romantic experiences have health implications.",
      career:    "Entertainment in digital or unconventional formats, international finance, speculative trading, technology-driven creative work and unconventional education attract recognition.",
      family:    "Children may have unconventional personalities or foreign connections. Romantic life is intense, unconventional and transformative.",
      travel:    "Travel for speculative business, entertainment industry events and romantic purposes is frequent.",
      education: "Digital arts, international finance, unconventional academic subjects and innovative research are areas of creative distinction.",
    },
    6: {
      overview:  "Rahu in the 6th house brings extraordinary power to defeat enemies, overcome diseases and win legal battles. This is a period of competitive excellence despite unconventional methods.",
      health:    "General health improves but susceptibility to unconventional or foreign ailments exists. Avoid substances and maintain regular medical check-ups.",
      career:    "Competitive industries, foreign service, unconventional medical practices, technology-driven service industries and legal work involving foreign parties prosper.",
      family:    "Disputes with maternal relatives are managed through cunning and determination. Service to foreign organisations benefits family financial stability.",
      travel:    "Travel for competitive, medical and service purposes is indicated.",
      education: "Unconventional medicine, technology services, competitive examination preparation and legal studies involving international dimensions are areas of focus.",
    },
    7: {
      overview:  "Rahu in the 7th house brings a foreign or unconventional partner, intense partnerships, international business alliances and complex relationship dynamics.",
      health:    "Reproductive system and lower back require attention. Relationship turbulence creates stress that needs active management.",
      career:    "International business partnerships, foreign trade, technology-driven commerce and cross-cultural business alliances bring significant opportunities.",
      family:    "Marriage may be to a person from a different cultural, religious or foreign background. Partnership life is intense, transformative and never dull.",
      travel:    "International travel for business partnerships and relationship matters is frequent.",
      education: "International business, cross-cultural communication, foreign law and relationship counselling are areas of interest.",
    },
    8: {
      overview:  "Rahu in the 8th house intensifies occult interests, sudden transformations, secret matters, mystical experiences and unexpected financial events. This is a period of deep and often hidden change.",
      health:    "Neurological, chronic and mysterious ailments require careful monitoring. Mental health support is important during periods of intense transformation.",
      career:    "Occult sciences, research into hidden subjects, foreign financial investigations, technology-driven insurance and unconventional healing bring professional focus.",
      family:    "Inheritance and in-law financial matters are complex. Family secrets or foreign financial connections surface. Transformation within the family is profound.",
      travel:    "Sudden foreign travel, often for investigative or transformative purposes, is characteristic.",
      education: "Occult sciences, paranormal research, foreign financial law, unconventional psychology and metaphysics attract deep interest.",
    },
    9: {
      overview:  "Rahu in the 9th house brings unconventional spiritual paths, foreign religious experiences, a complex relationship with the father and long-distance travels that transform worldview.",
      health:    "Thighs and foreign ailments require attention. Long-distance travel demands health preparation and care.",
      career:    "International religious organisations, foreign educational institutions, unconventional philosophy teaching and long-distance trade in foreign goods bring recognition.",
      family:    "Father's relationship is complex and sometimes distant. Family may be influenced by foreign religious philosophies. Long-distance family connections are important.",
      travel:    "Extensive foreign travel, often to spiritually significant but culturally unfamiliar places. Long journeys are transformative.",
      education: "Foreign religions, international law, comparative philosophy and global studies are areas of unconventional but deeply meaningful attainment.",
    },
    10: {
      overview:  "Rahu in the 10th house brings a powerful, ambitious and often sudden rise in career, unconventional paths to authority and public visibility through non-traditional means.",
      health:    "Overall physical health is good during career peaks. Stress from rapid career changes and public scrutiny requires management.",
      career:    "Technology companies, foreign organisations, media, politics, digital businesses and unconventional career paths bring remarkable professional visibility and success.",
      family:    "Career success comes through unconventional means that may surprise the family. Social status rises rapidly. Family reaps the benefits of professional achievements.",
      travel:    "Frequent international travel for professional assignments and career development.",
      education: "Technology management, media studies, international business and unconventional professional development are areas of rapid progress.",
    },
    11: {
      overview:  "Rahu in the 11th house brings rapid and often unexpected financial gains, large social networks with international connections and fulfilment of ambitious, unconventional desires.",
      health:    "Circulatory and nervous-system health need attention. The excitement of rapid gains and social expansion requires grounding.",
      career:    "Technology businesses, international networks, digital trading, social media enterprises and foreign financial instruments bring substantial and sometimes rapid income.",
      family:    "International friends and influential unconventional associates support family progress. Family desires are fulfilled through non-traditional means.",
      travel:    "Travel within international professional networks and to technology hubs and financial centres is frequent.",
      education: "International business networks, digital technology, foreign financial instruments and social media strategy are areas of rapid advancement.",
    },
    12: {
      overview:  "Rahu in the 12th house brings foreign residence, spiritual experiences in unknown territories, secret pleasures and liberation from conventional life patterns.",
      health:    "Feet, immune system and sleep disorders require attention. Unconventional healing methods abroad may provide relief.",
      career:    "Foreign-based businesses, technology work in international settings, unconventional spiritual enterprises and behind-the-scenes intelligence work prosper.",
      family:    "Residence abroad and foreign connections define family dynamics. Private life is complex and often distant from traditional family expectations.",
      travel:    "Long periods of foreign residence and frequent international travel are defining features of this period.",
      education: "Foreign studies, international intelligence, unconventional spiritual practices and global research are areas of non-traditional but meaningful development.",
    },
  },

  // ── KETU (7 years) ───────────────────────────────────────────────────────
  Ketu: {
    1: {
      overview:  "Ketu in the 1st house brings spiritual detachment, mysterious health issues, past-life abilities resurfacing and a tendency toward introversion and withdrawal from material ambitions.",
      health:    "Mysterious ailments, neurological sensitivities and immunity-related conditions require holistic care. Spiritual and alternative healing methods are particularly effective.",
      career:    "Spiritual guidance, research, occult sciences, technical work and behind-the-scenes expert roles bring fulfilment. Recognition comes unexpectedly.",
      family:    "Family relationships feel karmic and sometimes isolating. Father's influence is subtle but significant. There is a sense of not fully belonging to worldly family dynamics.",
      travel:    "Pilgrimages and journeys to spiritually significant places bring profound inner transformation.",
      education: "Spiritual sciences, occult research, alternative medicine, mathematics and technical disciplines are areas of intuitive aptitude.",
    },
    2: {
      overview:  "Ketu in the 2nd house brings detachment from material wealth and family, past-life financial wisdom and sometimes erratic speech. Spiritual values override material accumulation.",
      health:    "Throat, voice and dietary irregularities need attention. Fasting and spiritual dietary practices are beneficial.",
      career:    "Occult advisors, spiritual finance, sacred arts trade, antiquities and research-based work bring income through unconventional channels.",
      family:    "Family matters feel distant or karmic. Relations are cordial but lacking in worldly attachment. Past-life family connections influence the present.",
      travel:    "Short trips for spiritual and occult research are indicated.",
      education: "Sacred arts, spiritual finance, ancient sciences and occult traditions are areas of past-life wisdom finding expression.",
    },
    3: {
      overview:  "Ketu in the 3rd house brings psychic communication abilities, past-life sibling connections, spiritual courage and a natural affinity for esoteric writing.",
      health:    "Shoulders, nervous system and hearing may need attention. Spiritual practices restore equilibrium.",
      career:    "Esoteric writing, occult communication, technical skills in isolation, spiritual counselling and sacred music bring fulfilment.",
      family:    "Sibling relations carry a karmic quality. A past-life connection with a sibling defines the relationship dynamic.",
      travel:    "Short spiritual journeys and visits to sacred sites are transformative.",
      education: "Esoteric sciences, spiritual communication, ancient languages and sacred music are areas of intuitive development.",
    },
    4: {
      overview:  "Ketu in the 4th house brings detachment from domestic comfort, spiritual transformation in the home environment and a deep sense of past-life connection to the homeland.",
      health:    "Chest, stomach and mental peace require attention. Creating a spiritually charged home environment supports overall wellbeing.",
      career:    "Spiritual real estate, meditation retreat management, sacred architecture and rural or ancestral land management find purpose.",
      family:    "Domestic life has a spiritually detached quality. Mother may be spiritually inclined or in poor health. Home is more of a sacred space than a centre of worldly comfort.",
      travel:    "Pilgrimages from the homeland and journeys back to ancestral places are spiritually significant.",
      education: "Sacred architecture, spiritual sciences, ancestral traditions and meditative arts are areas of intuitive knowledge.",
    },
    5: {
      overview:  "Ketu in the 5th house brings past-life creative merits, intuitive intelligence, subtle spiritual experiences and sometimes complex matters related to children.",
      health:    "Digestive and reproductive health require attention. Spiritual practices and meditation resolve psychosomatic conditions.",
      career:    "Spiritual arts, occult divination, intuitive teaching, meditation guidance and sacred creative expression find their finest expression.",
      family:    "Relationship with children has a karmic quality. Past-life connections with romantic partners create both deep bonds and complex dynamics.",
      travel:    "Pilgrimages and journeys to spiritually significant creative centres are auspicious.",
      education: "Sacred arts, spiritual psychology, meditative science and esoteric philosophy are areas of profound intuitive attainment.",
    },
    6: {
      overview:  "Ketu in the 6th house brings spiritual victory over enemies, healing through spiritual means and mysterious health challenges that resolve through alternative methods.",
      health:    "Mysterious ailments, immune and intestinal conditions need holistic management. Spiritual healing and alternative medicine are highly effective.",
      career:    "Alternative medicine, spiritual healing, occult research into diseases, service to spiritual communities and behind-the-scenes healthcare bring fulfilment.",
      family:    "Disputes with maternal relatives carry a karmic quality and resolve through forgiveness. Service to family members with health challenges brings spiritual merit.",
      travel:    "Travel to healing centres and spiritual service destinations is indicated.",
      education: "Alternative medicine, spiritual healing sciences, occult diagnostics and service-oriented spiritual training are areas of development.",
    },
    7: {
      overview:  "Ketu in the 7th house brings a spiritually complex partnership, past-life connections with spouse and a tendency toward detachment in intimate relationships.",
      health:    "Reproductive and lower digestive health require attention. Relationship dynamics have a deep impact on overall emotional and physical health.",
      career:    "Spiritual counselling for couples, occult advisory in partnerships, spiritual arts businesses and behind-the-scenes creative collaboration bring fulfilment.",
      family:    "Marriage feels deeply karmic. Spouse may be spiritual, mysterious or from a different cultural background. The relationship is transformative rather than conventionally comfortable.",
      travel:    "Spiritual travel with a partner and journeys related to past-life resolution are characteristic.",
      education: "Relationship counselling, spiritual arts, past-life therapy and occult sciences related to partnerships are areas of intuitive knowledge.",
    },
    8: {
      overview:  "Ketu in the 8th house brings deep occult abilities, spiritual liberation potential, past-life hidden knowledge and profound intuitive insights into the mysteries of existence.",
      health:    "Mysterious chronic ailments and neurological conditions require spiritual and holistic management. Longevity is generally protected through spiritual merit.",
      career:    "Astrology, occult sciences, spiritual research, past-life therapy and deep investigative spiritual work bring fulfilment and recognition among spiritual communities.",
      family:    "In-law relationships carry karmic themes. Family inheritances and legacies are spiritually significant. Hidden family matters are illuminated.",
      travel:    "Pilgrimages to remote and ancient spiritual sites bring profound transformation.",
      education: "Astrology, occult sciences, past-life research, metaphysics and esoteric philosophy reach their deepest expression.",
    },
    9: {
      overview:  "Ketu in the 9th house brings past-life religious wisdom, a complex relationship with the father and a deep spiritual journey that defies conventional religious structures.",
      health:    "Thighs and sciatic nerve need attention. Long-distance spiritual travel requires health preparation.",
      career:    "Spiritual teaching from an unconventional perspective, esoteric religious writing, occult scholarly work and past-life counselling find their highest expression.",
      family:    "Father's presence is spiritually significant but sometimes physically absent. The family spiritual tradition has past-life roots that come alive during this period.",
      travel:    "Long-distance pilgrimages to ancient, historically significant spiritual centres are defining experiences.",
      education: "Ancient philosophical traditions, esoteric religious texts, past-life studies and spiritual science research are areas of profound natural wisdom.",
    },
    10: {
      overview:  "Ketu in the 10th house brings sudden career transformations, detachment from public recognition and spiritual authority that comes from an unconventional professional direction.",
      health:    "General health is variable with some mysterious fluctuations. Spiritual practice and clear purpose sustain physical energy.",
      career:    "Spiritual advisory at high levels, occult consultancy, research leadership, technical work behind public entities and spiritual institution management bring recognition.",
      family:    "Career is spiritually driven and may not match family expectations. The family eventually respects the unique professional path chosen.",
      travel:    "Travel for spiritual professional purposes and recognition at distant spiritual centres is characteristic.",
      education: "Spiritual leadership studies, occult research methodology and advanced spiritual sciences are areas of intuitive mastery.",
    },
    11: {
      overview:  "Ketu in the 11th house brings spiritual friendships, sudden unexpected gains and detachment from the desire for material fulfilment. Spiritual networks replace conventional social circles.",
      health:    "Circulatory and nervous-system health need attention. Spiritual community support maintains emotional and physical balance.",
      career:    "Spiritual networks, occult communities, research associations and behind-the-scenes advisory roles bring income through non-conventional channels.",
      family:    "Elder sibling may be spiritually inclined. Family desires are fulfilled in unexpected ways rather than through conventional planning.",
      travel:    "Travel within spiritual networks and to centres of occult learning is characteristic.",
      education: "Spiritual community studies, occult networking, advanced metaphysics and sacred sciences are areas of natural group wisdom.",
    },
    12: {
      overview:  "Ketu in the 12th house is an exceptionally powerful placement for spiritual liberation, foreign spiritual experiences and release from karmic debts. This Mahadasha carries the seed of moksha.",
      health:    "Feet, sleep and immune system require spiritual care. Periods of retreat and meditation are the most healing activities.",
      career:    "Spiritual renunciation, ashram work, foreign spiritual institutions, meditation teaching and esoteric research in isolated settings bring deep fulfilment.",
      family:    "Family life is minimal and spiritually oriented. Foreign spiritual communities become a second family. Past-life family connections are resolved and released.",
      travel:    "Extended pilgrimages, foreign ashram stays and journeys to ancient sacred sites are the defining experiences of this profoundly spiritual period.",
      education: "Liberation philosophy, advanced meditation sciences, Vedantic studies, past-life research and foreign esoteric traditions are areas of deepest natural wisdom.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ANTARDASHA TABLE  AD_TABLE[mdPlanet][adPlanet]
// ─────────────────────────────────────────────────────────────────────────────

export const AD_TABLE: Record<string, Record<string, AntardashaInterpretation>> = {
  Sun: {
    Sun:     { overview: "Sun–Sun sub-period intensifies self-assertion, government connections and personal vitality.", effect: "Good for authority and recognition. Health of bones and heart needs attention. Avoid excessive pride.", remedies: ["Offer water to the Sun at sunrise daily", "Wear Ruby (consult astrologer)", "Chant Aditya Hridayam"] },
    Moon:    { overview: "Sun–Moon brings balance between authority and emotion. Mother's health and public image are highlighted.", effect: "Success in public-facing roles. Emotional sensitivity increases. Mind and heart work in harmony.", remedies: ["Offer milk to Shiva on Mondays", "Wear Pearl if Moon is favourable", "Chant Om Namah Shivaya"] },
    Mars:    { overview: "Sun–Mars is a fiery and energetic combination bringing courage, competition and decisive action.", effect: "Excellent for military, sports and competitive success. Temper and accidents require careful management.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Wear Coral if Mars is favourable"] },
    Mercury: { overview: "Sun–Mercury brings intellectual authority, communication skill and government-related analytical work.", effect: "Good for education, writing and advisory roles. Avoid ego conflicts in intellectual debates.", remedies: ["Offer green grass to a cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green items"] },
    Jupiter: { overview: "Sun–Jupiter is one of the most auspicious combinations, bringing wisdom, prosperity, blessings and divine favour.", effect: "Outstanding period for career, spiritual growth and family prosperity. Health is generally good.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Om Namo Bhagavate Vasudevaya", "Donate saffron"] },
    Venus:   { overview: "Sun–Venus brings comforts, romance, arts and material pleasures, though some ego conflicts with the partner are possible.", effect: "Good for love, arts and financial gains. Manage relationship ego to preserve harmony.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white items"] },
    Saturn:  { overview: "Sun–Saturn is a karmic and challenging combination. Authority meets discipline; conflicts with seniors are possible.", effect: "Hard work eventually rewarded. Health challenges and delays in career are possible. Maintain patience.", remedies: ["Light sesame oil lamp to Shani on Saturdays", "Chant Shani Stotra", "Donate black sesame"] },
    Rahu:    { overview: "Sun–Rahu is a turbulent period bringing sudden career changes, ego disruptions and government complications.", effect: "Unexpected events affect career and health. Foreign connections may cause disruption. Stay grounded.", remedies: ["Offer coconut to flowing water", "Chant Durga Saptashati", "Donate dark blue items"] },
    Ketu:    { overview: "Sun–Ketu brings spiritual turning points, detachment from authority and sudden introspective phases.", effect: "Career disruption combined with spiritual growth. Health requires holistic attention. Meditation is beneficial.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate multi-coloured blankets"] },
  },
  Moon: {
    Moon:    { overview: "Moon–Moon is an emotionally intense period bringing heightened intuition, public connectivity and domestic focus.", effect: "Domestic life and mother's wellbeing are central. Emotional sensitivity is very high. Mind is powerful.", remedies: ["Offer milk and white flowers to Shiva", "Chant Shiva Panchakshara Stotra", "Wear Pearl if favourable"] },
    Mars:    { overview: "Moon–Mars brings emotional energy to competitive and courageous action. Domestic disputes and blood-related health issues need management.", effect: "Energy for action is high. Manage anger in domestic situations. Short travels and competitive events yield results.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Mangal Stotra", "Donate red lentils"] },
    Rahu:    { overview: "Moon–Rahu is emotionally turbulent, bringing unexpected events, mental disturbances and foreign connections.", effect: "Anxiety, sleep issues and domestic instability. Foreign travel or influence disrupts routine. Stay grounded.", remedies: ["Chant Om Namah Shivaya 108 times daily", "Donate milk at temple", "Fast on Mondays"] },
    Jupiter: { overview: "Moon–Jupiter is a deeply auspicious period bringing family prosperity, wisdom, emotional contentment and spiritual grace.", effect: "Exceptional for family harmony, financial growth and spiritual attainment. Children bring joy.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Guru Stotra", "Donate turmeric"] },
    Saturn:  { overview: "Moon–Saturn is emotionally difficult, bringing domestic heaviness, mother's health concerns and karmic responsibilities.", effect: "Delays in domestic matters and emotional distance in family. Disciplined emotional management is key.", remedies: ["Light sesame lamp on Saturdays", "Chant Shani Stotra", "Donate black sesame and iron"] },
    Mercury: { overview: "Moon–Mercury brings intellectual-emotional balance, good communication and success in business through emotional intelligence.", effect: "Good for trade, writing and emotional-intellectual work. Short travels and educational activities prosper.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green items"] },
    Ketu:    { overview: "Moon–Ketu brings emotional detachment, spiritual experiences and mysterious health conditions.", effect: "Intuitive abilities heighten. Domestic peace may be disturbed. Spiritual practices provide stability.", remedies: ["Worship Lord Ganesha", "Chant Ketu Stotra", "Donate multi-coloured blankets"] },
    Venus:   { overview: "Moon–Venus is one of the most pleasant combinations, bringing love, beauty, domestic harmony and pleasurable experiences.", effect: "Outstanding period for love, marriage, arts and material comforts. Health is generally good.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white cloth"] },
    Sun:     { overview: "Moon–Sun brings public recognition, support from authority figures and balancing of emotional and rational forces.", effect: "Good for career in public service. Father and mother's influence are both significant. Health is generally good.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate copper items"] },
  },
  Mars: {
    Mars:    { overview: "Mars–Mars brings maximum energy, courage and competitive drive but also significant risk of accidents, anger and health issues.", effect: "Outstanding for physical achievement, sports and competitive success. Control aggression carefully.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Donate red items"] },
    Rahu:    { overview: "Mars–Rahu is one of the most intensely turbulent combinations, bringing accidents, sudden events and aggressive foreign complications.", effect: "Maximum caution required. Health and safety risks are high. Avoid reckless actions and conflicts.", remedies: ["Chant Durga Saptashati", "Offer coconut to flowing water", "Donate dark-coloured clothing"] },
    Jupiter: { overview: "Mars–Jupiter is a powerful and protective combination bringing courage guided by wisdom and financial success through bold action.", effect: "Excellent for career, finance and legal matters. Bold and well-planned actions yield results.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Guru Stotra", "Donate yellow items"] },
    Saturn:  { overview: "Mars–Saturn is a difficult combination where energy meets resistance, creating frustration, delays and potential legal conflicts.", effect: "Hard work yields delayed results. Maintain patience and avoid confrontations with authority.", remedies: ["Light sesame oil lamp on Saturdays", "Chant Shani Stotra", "Donate iron and black sesame"] },
    Mercury: { overview: "Mars–Mercury brings sharp analytical energy to communication, technical work and competitive intelligence activities.", effect: "Good for technical skills, competitive examinations and analytical work. Manage argumentative tendencies.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green mung beans"] },
    Ketu:    { overview: "Mars–Ketu brings spiritual warrior energy, past-life fighting abilities and sudden physical challenges or mystical experiences.", effect: "Accidents and mysterious health events are possible. Spiritual courage emerges. Channel energy inward.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate multi-coloured items"] },
    Venus:   { overview: "Mars–Venus brings passionate romance, energetic creative expression and potential conflicts between desire and harmony.", effect: "Romantic relationships are passionate and transformative. Creative energy is very high.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white silk"] },
    Sun:     { overview: "Mars–Sun brings authority, competitive courage and success in government or military-related work.", effect: "Excellent for leadership and competitive career success. Manage ego and anger in authority interactions.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate wheat and copper"] },
    Moon:    { overview: "Mars–Moon brings emotional courage, competitive domestic energy and potential for blood-pressure related health issues.", effect: "Emotional strength and courage are available. Domestic disputes require careful management.", remedies: ["Offer milk and white flowers to Shiva on Mondays", "Chant Shiva Panchakshara", "Donate rice and white items"] },
  },
  Mercury: {
    Mercury: { overview: "Mercury–Mercury is outstanding for intellectual work, writing, business and communication across all media.", effect: "Exceptional intellectual productivity. Multiple business opportunities arise. Short travels are very frequent.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green mung beans"] },
    Ketu:    { overview: "Mercury–Ketu brings past-life intellectual wisdom, esoteric writing interests and sudden changes in communication patterns.", effect: "Intuitive intellectual abilities surface. Communication may become less straightforward. Spiritual study is favoured.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate colourful items"] },
    Venus:   { overview: "Mercury–Venus brings a harmonious blend of intellect and aesthetics, excellent for artistic communication and commercial success.", effect: "Outstanding for arts business, writing, design and financial advisory. Love life and communication are harmonious.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white cloth and silver"] },
    Sun:     { overview: "Mercury–Sun brings intellectual authority, government communication roles and success in advisory and analytical work.", effect: "Good for government-linked analytical roles, writing and public speaking. Avoid ego in intellectual debates.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate wheat"] },
    Moon:    { overview: "Mercury–Moon brings emotional intelligence, intuitive business decisions and success through empathic communication.", effect: "Good for counselling, trade and emotional writing. Short travels and domestic business activities are common.", remedies: ["Offer milk and white flowers to Shiva on Mondays", "Chant Om Namah Shivaya", "Donate white rice"] },
    Mars:    { overview: "Mercury–Mars brings sharp analytical drive, technical courage and success in competitive intellectual work.", effect: "Good for technical work, competitive exams and sharp business decisions. Manage argumentative tendencies.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Donate red lentils"] },
    Rahu:    { overview: "Mercury–Rahu brings innovative and unconventional intellectual approaches, foreign business connections and digital entrepreneurship.", effect: "Foreign or digital business opportunities arise. Communication may be unconventional. Stay ethical in dealings.", remedies: ["Chant Durga Saptashati", "Offer coconut to water", "Donate dark-coloured items"] },
    Jupiter: { overview: "Mercury–Jupiter is an excellent combination for academic success, wise business decisions and recognition in intellectual fields.", effect: "Outstanding for teaching, publishing, legal advisory and wise financial decisions.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Guru Stotra", "Donate yellow items"] },
    Saturn:  { overview: "Mercury–Saturn brings disciplined intellectual work, systematic analysis and slow but steady progress in career through organised effort.", effect: "Slow progress in career but reliable results from systematic work. Legal documentation and contracts require care.", remedies: ["Light sesame lamp on Saturdays", "Chant Shani Stotra", "Donate black sesame and iron"] },
  },
  Jupiter: {
    Jupiter: { overview: "Jupiter–Jupiter is the most auspicious sub-period in any Mahadasha, bringing peak spiritual growth, career recognition and family prosperity.", effect: "Outstanding in all life areas. Wisdom guides every action to its best outcome. Divine grace is tangible.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Vishnu Sahasranama", "Donate saffron and yellow cloth"] },
    Saturn:  { overview: "Jupiter–Saturn brings disciplined spiritual growth, karmic responsibilities and hard-earned but lasting professional achievements.", effect: "Career grows steadily through honest effort. Spiritual and material goals must be balanced. Patience is key.", remedies: ["Light sesame lamp on Saturdays", "Chant Shani Stotra", "Donate sesame and iron items"] },
    Mercury: { overview: "Jupiter–Mercury brings excellent intellectual output, business wisdom and success in teaching, writing and advisory roles.", effect: "Exceptional for academic work, publishing, business and legal advisory. Communication is wise and effective.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green cloth"] },
    Ketu:    { overview: "Jupiter–Ketu brings spiritual liberation potential, occult wisdom and detachment from material ambitions in favour of higher truth.", effect: "Spiritual growth is exceptional. Material results may be modest. Inner peace becomes the primary treasure.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate multi-coloured items"] },
    Venus:   { overview: "Jupiter–Venus brings prosperity, love, beauty and spiritual-material balance. This is an auspicious and pleasurable sub-period.", effect: "Excellent for marriage, prosperity, artistic work and spiritual practice. Life is joyful and abundant.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white silk and silver"] },
    Sun:     { overview: "Jupiter–Sun brings divine authority, royal favour and exceptional career recognition. Government and public institutional support is strong.", effect: "Outstanding for career advancement, government recognition and spiritual authority. Health is excellent.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate wheat and gold"] },
    Moon:    { overview: "Jupiter–Moon brings emotional wisdom, domestic prosperity and deep spiritual contentment within family life.", effect: "Family prosperity and happiness are at their peak. Mother's blessings are particularly powerful. Mind is calm.", remedies: ["Offer milk and flowers to Shiva on Mondays", "Chant Om Namah Shivaya", "Donate white items"] },
    Mars:    { overview: "Jupiter–Mars brings courageous wisdom, bold righteous action and success in competitive, legal and athletic fields.", effect: "Excellent for legal victory, sports achievement and bold business actions guided by good judgment.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Donate red items"] },
    Rahu:    { overview: "Jupiter–Rahu brings tension between wisdom and unconventional ambition. Foreign opportunities arise but require ethical navigation.", effect: "Foreign and international opportunities prosper but ethical clarity is essential. Avoid shortcuts.", remedies: ["Chant Durga Saptashati", "Offer coconut to flowing water", "Donate dark blue items"] },
  },
  Venus: {
    Venus:   { overview: "Venus–Venus brings the maximum expression of love, beauty, luxury and artistic success. This is the most pleasurable sub-period of any Mahadasha.", effect: "Outstanding for romance, marriage, arts and material prosperity. Life is beautiful and socially vibrant.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white silk and diamonds"] },
    Sun:     { overview: "Venus–Sun brings social authority, recognition in arts or luxury industries and potential ego conflicts in relationships.", effect: "Good for arts career and social recognition. Manage ego in love relationships. Father's influence is positive.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate wheat and copper"] },
    Moon:    { overview: "Venus–Moon brings emotional beauty, romantic fulfilment and domestic luxury. Sensitivity and aesthetic appreciation are heightened.", effect: "Outstanding for home comforts, romantic life and artistic expression. Mother and spouse are sources of joy.", remedies: ["Offer milk and white flowers to Shiva on Mondays", "Chant Shiva Panchakshara", "Donate white items"] },
    Mars:    { overview: "Venus–Mars brings passionate energy to love, creativity and competitive artistic expression. Romantic intensity is very high.", effect: "Passionate romance and creative energy are peak features. Manage jealousy and impulsiveness in love life.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Donate red items"] },
    Rahu:    { overview: "Venus–Rahu brings unconventional romance, foreign love affairs, digital-age luxury consumption and complex relationship dynamics.", effect: "Unexpected romantic events, foreign partners or unconventional pleasures are characteristic. Stay grounded.", remedies: ["Chant Durga Saptashati", "Offer coconut to water", "Donate dark-coloured clothing"] },
    Jupiter: { overview: "Venus–Jupiter is one of the finest sub-period combinations, bringing spiritual beauty, auspicious marriage, prosperity and divine grace.", effect: "Outstanding for marriage, family happiness, career in arts and spiritual-aesthetic pursuits.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Guru Stotra", "Donate yellow items and saffron"] },
    Saturn:  { overview: "Venus–Saturn brings disciplined aesthetic work, delayed but lasting romantic fulfilment and serious professional progress in arts industries.", effect: "Slow and steady progress in career and love. Long-term relationships begun now are enduring.", remedies: ["Light sesame lamp on Saturdays", "Chant Shani Stotra", "Donate black sesame and iron"] },
    Mercury: { overview: "Venus–Mercury brings harmonious intellectual and artistic collaboration, excellent communication in creative fields and business success through aesthetic intelligence.", effect: "Outstanding for arts business, design, writing and financial advisory combining beauty and intellect.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green cloth"] },
    Ketu:    { overview: "Venus–Ketu brings spiritual aesthetics, detachment from material pleasures and past-life romantic connections resurfacing.", effect: "Artistic and spiritual beauty are highlighted. Detachment from conventional romantic expectations brings inner peace.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate multi-coloured items"] },
  },
  Saturn: {
    Saturn:  { overview: "Saturn–Saturn is the most intensely disciplined and sometimes difficult sub-period, demanding maximum endurance, patience and karmic accountability.", effect: "Heavy karmic lessons but maximum professional endurance. Health challenges arise but are overcome through discipline.", remedies: ["Light sesame oil lamp on Saturdays", "Chant Shani Stotra 108 times", "Donate iron, black sesame and oil"] },
    Mercury: { overview: "Saturn–Mercury brings systematic analytical work, disciplined communication and slow but reliable progress through organised intellectual effort.", effect: "Methodical work yields steady results. Legal documentation and contracts require thorough review.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green items"] },
    Ketu:    { overview: "Saturn–Ketu brings deep karmic release, spiritual discipline in challenging conditions and transformation through endurance.", effect: "Profound inner transformation through hardship. Spiritual practices and meditation provide sustained strength.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate multi-coloured blankets to poor"] },
    Venus:   { overview: "Saturn–Venus brings delayed but lasting romantic fulfilment, disciplined artistic progress and material gains through sustained aesthetic effort.", effect: "Romantic and professional life in arts advances slowly but durably. Long-term investments in beauty prosper.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white cloth and silver"] },
    Sun:     { overview: "Saturn–Sun is a challenging combination where karmic lessons arise in relation to authority, father and professional recognition.", effect: "Delays in career, health of bones and authority conflicts require patient endurance. Avoid ego confrontations.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate wheat and copper"] },
    Moon:    { overview: "Saturn–Moon brings emotional heaviness, domestic karmic responsibilities and a need to maintain mental discipline through difficult family situations.", effect: "Mother's health and domestic responsibilities are burdensome. Mental discipline and emotional maturity are essential.", remedies: ["Offer milk to Shiva on Mondays", "Chant Om Namah Shivaya", "Donate white rice and milk"] },
    Mars:    { overview: "Saturn–Mars is a powerfully challenging combination bringing legal conflicts, accidents, property disputes and frustrated ambitions.", effect: "Maximum patience required. Avoid impulsive actions and aggressive confrontations. Legal matters need expert guidance.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Donate red lentils and coral"] },
    Rahu:    { overview: "Saturn–Rahu is one of the most challenging sub-period combinations, bringing unexpected obstacles, karmic disruptions and sudden setbacks.", effect: "Maximum caution in all activities. Health, legal and relationship matters all require careful management.", remedies: ["Chant Durga Saptashati daily", "Offer coconut to flowing water regularly", "Donate black sesame and iron generously"] },
    Jupiter: { overview: "Saturn–Jupiter brings disciplined spiritual growth, karmic resolution through wisdom and slow but meaningful professional elevation.", effect: "Spiritual and professional wisdom are combined effectively. Hard work guided by good judgment yields enduring results.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Vishnu Sahasranama", "Donate saffron and yellow cloth"] },
  },
  Rahu: {
    Rahu:    { overview: "Rahu–Rahu is the most intensely transformative and unpredictable sub-period, bringing sudden events, obsessive ambitions and foreign upheavals.", effect: "Maximum unpredictability. Ambitions may be realised suddenly or shattered suddenly. Stay grounded and adaptable.", remedies: ["Chant Durga Saptashati daily", "Offer coconut to flowing water", "Donate dark blue items"] },
    Jupiter: { overview: "Rahu–Jupiter brings unconventional wisdom, foreign spiritual connections and expansive ambitions guided by higher principles.", effect: "Foreign and spiritual opportunities bring unexpected growth. Ethics must guide ambitions to maximise results.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Guru Stotra", "Donate saffron and yellow cloth"] },
    Saturn:  { overview: "Rahu–Saturn is a deeply karmic and heavy combination bringing prolonged delays, social isolation and profound karmic lessons.", effect: "Extremely challenging period requiring maximum patience and spiritual endurance. Avoid all risky activities.", remedies: ["Light sesame lamp on Saturdays", "Chant Shani Stotra", "Donate iron, black sesame and oil generously"] },
    Mercury: { overview: "Rahu–Mercury brings unconventional intellectual activities, digital business success and innovative communication in foreign markets.", effect: "Digital and international business prospers. Communication is innovative and non-traditional. Stay ethically clear.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green items"] },
    Ketu:    { overview: "Rahu–Ketu is a period of maximum karmic tension and spiritual intensity, bringing sudden reversals and the surfacing of deep past-life karmas.", effect: "Sudden events shake the foundations of life. Spiritual practice provides the only reliable anchor.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate blankets and multi-coloured items"] },
    Venus:   { overview: "Rahu–Venus brings unconventional romance, foreign luxury experiences and intense material pleasures, sometimes to excess.", effect: "Love life is intense and unconventional. Financial gains through luxury or foreign arts are possible. Manage excess.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white cloth and silver"] },
    Sun:     { overview: "Rahu–Sun brings sudden career events, government disruptions and ego-related crises that demand a mature response.", effect: "Career and authority matters face sudden challenges. Father's health or influence may be disrupted.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate wheat and copper"] },
    Moon:    { overview: "Rahu–Moon brings emotional turbulence, mental anxiety, mysterious domestic events and mother's health concerns.", effect: "Mental health and domestic stability require active management. Avoid excessive stress and stimulation.", remedies: ["Offer milk to Shiva on Mondays", "Chant Om Namah Shivaya", "Donate white items and milk"] },
    Mars:    { overview: "Rahu–Mars brings explosive energy, sudden accidents and fierce competitive drive that can yield great results or great harm.", effect: "Extreme caution required for physical safety and health. Bold but not reckless action yields competitive success.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Donate red lentils"] },
  },
  Ketu: {
    Ketu:    { overview: "Ketu–Ketu brings maximum spiritual withdrawal, past-life karmic surfacing and deep inner transformation through detachment.", effect: "Material life recedes. Spiritual and intuitive powers are heightened. Inner work yields lasting transformation.", remedies: ["Worship Lord Ganesha", "Chant Om Gam Ganapataye Namah", "Donate multi-coloured blankets generously"] },
    Venus:   { overview: "Ketu–Venus brings spiritual beauty, past-life romantic connections and a complex relationship between detachment and pleasure.", effect: "Creative and romantic energies are present but coloured by a spiritual perspective. Artistic wisdom deepens.", remedies: ["Offer white flowers to Lakshmi on Fridays", "Chant Sri Sukta", "Donate white items and silver"] },
    Sun:     { overview: "Ketu–Sun brings spiritual authority, detachment from ego-driven career goals and sudden inner revelations about purpose.", effect: "Career may face unexpected turns. Spiritual insights replace conventional ambitions. Health requires holistic care.", remedies: ["Offer water to Sun at sunrise", "Chant Aditya Hridayam", "Donate wheat and copper"] },
    Moon:    { overview: "Ketu–Moon brings psychic sensitivity, emotional detachment and mysterious domestic experiences that deepen intuitive understanding.", effect: "Emotional depth and intuition are very high. Domestic peace requires conscious spiritual effort.", remedies: ["Offer milk and white flowers to Shiva on Mondays", "Chant Om Namah Shivaya", "Donate white rice"] },
    Mars:    { overview: "Ketu–Mars brings past-life warrior energy, spiritual courage and the possibility of sudden physical challenges or transformative experiences.", effect: "Physical energy is channelled inward. Accidents are possible. Spiritual warrior practices provide strength.", remedies: ["Offer red flowers to Hanuman on Tuesdays", "Chant Hanuman Chalisa", "Donate red lentils and coral"] },
    Rahu:    { overview: "Ketu–Rahu brings maximum karmic tension, sudden spiritual reversals and the resolution of deeply held past-life obsessions.", effect: "Life events feel fated and intense. Surrender to higher will and engage deeply in spiritual practice.", remedies: ["Chant Durga Saptashati", "Offer coconut to flowing water", "Donate multi-coloured and dark items"] },
    Jupiter: { overview: "Ketu–Jupiter brings spiritual wisdom, liberation philosophy and the blessings of the guru in the most inward and profound way.", effect: "Outstanding for spiritual growth and liberation-oriented study. Material matters are secondary.", remedies: ["Offer yellow flowers to Vishnu on Thursdays", "Chant Vishnu Sahasranama", "Donate saffron and yellow items"] },
    Saturn:  { overview: "Ketu–Saturn brings karmic discipline, spiritual endurance through hardship and the slow release of deeply held karmic patterns.", effect: "Challenging period requiring spiritual discipline. Karmic debts are slowly paid. Endurance yields liberation.", remedies: ["Light sesame lamp on Saturdays", "Chant Shani Stotra", "Donate iron, black sesame and oil"] },
    Mercury: { overview: "Ketu–Mercury brings intuitive-intellectual synthesis, past-life scholarly wisdom and unconventional analytical thinking.", effect: "Intellectual intuition is a powerful asset. Communication may be eccentric but deeply insightful.", remedies: ["Offer green grass to cow on Wednesdays", "Chant Vishnu Sahasranama", "Donate green items"] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the Mahadasha interpretation for a planet in a given natal house. */
export function getMahadashaInterpretation(
  planet: string,
  house: number,
  dignity?: string
): PeriodInterpretation {
  const planetTable = MD_TABLE[planet];
  if (!planetTable) return fallbackMD(planet, house);
  const base = planetTable[house] ?? planetTable[1] ?? fallbackMD(planet, house);

  // Dignity modifier — append a note to overview
  if (dignity) {
    let note = "";
    if (dignity.includes("Exalt"))   note = ` ${planet} is exalted in your chart, amplifying all positive effects of this Mahadasha significantly.`;
    if (dignity.includes("Debilit")) note = ` ${planet} is debilitated in your chart; remedial measures are strongly recommended to mitigate challenges.`;
    if (dignity.includes("Own"))     note = ` ${planet} is in its own sign, giving added strength and clarity to this Mahadasha.`;
    if (note) return { ...base, overview: base.overview + note };
  }
  return base;
}

/** Returns the Antardasha interpretation for a given MD-AD planet combination. */
export function getAntardashaInterpretation(
  mdPlanet: string,
  adPlanet: string
): AntardashaInterpretation {
  return AD_TABLE[mdPlanet]?.[adPlanet] ?? fallbackAD(mdPlanet, adPlanet);
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACKS
// ─────────────────────────────────────────────────────────────────────────────

function fallbackMD(planet: string, house: number): PeriodInterpretation {
  return {
    overview:  `${planet} Mahadasha activates the themes of the ${house}${ordinal(house)} house throughout this period. The planet's natural significations blend with house themes to shape outcomes in all life areas.`,
    health:    `Monitor health areas governed by ${planet} and the ${house}${ordinal(house)} house. Regular check-ups and lifestyle discipline are recommended.`,
    career:    `Career advances through the significations of ${planet}. Effort aligned with ${planet}'s natural domain yields the best professional results.`,
    family:    `Family relationships are shaped by ${planet}'s influence. Patience and communication maintain harmony in domestic life.`,
    travel:    `Travel during this period is influenced by ${planet}'s significations. Journeys aligned with ${planet}'s themes are particularly productive.`,
    education: `Studies in areas governed by ${planet} are favoured. Persistent learning and application of knowledge yield lasting benefits.`,
  };
}

function fallbackAD(md: string, ad: string): AntardashaInterpretation {
  return {
    overview:  `${md}–${ad} sub-period brings a blend of both planets' qualities to the forefront. The relationship between these two planets in your natal chart determines the primary tone of this sub-period.`,
    effect:    `Results in career, health and family are shaped by the combined influence of ${md} and ${ad}. Efforts aligned with both planets' significations are most productive.`,
    remedies:  [`Worship the deity of ${md} and ${ad}`, `Chant mantras of both ${md} and ${ad} as recommended by your astrologer`, "Donate items associated with both planets on their respective days"],
  };
}

function ordinal(n: number): string {
  return ["st","nd","rd"][((n % 100 - 20) % 10) - 1] ?? "th";
}
