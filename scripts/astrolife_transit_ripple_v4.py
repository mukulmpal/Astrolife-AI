"""
AstroLife Universal Transit + Ripple Engine V4

Self-contained Python version of:
- Universal Transit Engine V2
- 2916 planet × ascendant × nakshatra synthesis
- Transit Ripple V4: direct house + aspect houses + full 12-house ripple
- 34,992 house-level interpretation layers

Use for:
- Transit tab cards
- Premium PDF sections
- AI chat context
- 12-month prediction engine
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Dict, Generator, Iterable, List, Literal, Optional, TypedDict
import json

Sign = Literal[
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

Planet = Literal[
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
]

NakshatraName = Literal[
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
    "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
    "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

TransitSpeed = Literal["direct", "retrograde", "stationary"]
ReadingBase = Literal["lagna", "moon"]
RippleImpactType = Literal["direct", "aspect", "background"]
RippleTone = Literal["positive", "mixed", "challenging", "intense"]

SIGNS: List[Sign] = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

PLANETS: List[Planet] = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
]

NAKSHATRAS_27: List[NakshatraName] = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
    "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
    "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

UNIVERSAL_TRANSIT_MATRIX_2916_COUNT = len(PLANETS) * len(SIGNS) * len(NAKSHATRAS_27)
TRANSIT_RIPPLE_34992_COUNT = UNIVERSAL_TRANSIT_MATRIX_2916_COUNT * 12


@dataclass
class ReportSection:
    title: str
    body: str
    subtitle: Optional[str] = None
    bullets: Optional[List[str]] = None


@dataclass
class TransitLifeAreaReport:
    career: str
    money: str
    relationship: str
    family: str
    health: str
    spirituality: str
    travel: str
    property: str
    litigation: str


@dataclass
class TransitReading:
    base: ReadingBase
    sign: Sign
    activated_house: int
    headline: str
    core_theme: str
    executive_meaning: str
    life_areas: TransitLifeAreaReport
    timing: str
    remedies: List[str]
    cautions: List[str]
    final_message: str


@dataclass
class TransitTabCard:
    title: str
    score: int
    tone: RippleTone
    summary: str
    tags: List[str]


@dataclass
class TransitMasterV2Report:
    title: str
    native_name: str
    transit_name: str
    period_label: str
    event_explanation: ReportSection
    ascendant_reading: TransitReading
    moon_reading: Optional[TransitReading]
    combined_guidance: ReportSection
    remedy_section: ReportSection
    transit_tab_cards: List[TransitTabCard]
    pdf_sections: List[ReportSection]
    disclaimer: str


@dataclass
class PlanetAspectRule:
    aspect_number: int
    label: str
    strength: int
    meaning: str


@dataclass
class PlanetAspectHit(PlanetAspectRule):
    target_house: int = 0


@dataclass
class HouseRippleLayer:
    house: int
    house_name: str
    house_areas: str
    impact_type: RippleImpactType
    intensity_score: int
    tone: RippleTone
    title: str
    headline: str
    summary: str
    detailed_narrative: str
    career: str
    money: str
    relationship: str
    family: str
    health: str
    spirituality: str
    travel: str
    property: str
    litigation: str
    remedies: List[str]
    cautions: List[str]
    aspect_label: Optional[str] = None


@dataclass
class TwelveHouseRippleTableRow:
    house: int
    area: str
    impact_type: RippleImpactType
    score: int
    tone: RippleTone
    summary: str


@dataclass
class TransitRippleV4Report:
    title: str
    native_name: str
    transit_name: str
    period_label: str
    base_transit_report: TransitMasterV2Report
    direct_house: int
    aspect_hits: List[PlanetAspectHit]
    ripple_layers: List[HouseRippleLayer]
    high_impact_layers: List[HouseRippleLayer]
    twelve_house_ripple_table: List[TwelveHouseRippleTableRow]
    direct_house_section: ReportSection
    aspect_house_section: ReportSection
    twelve_house_ripple_section: ReportSection
    remedy_section: ReportSection
    final_book_style_conclusion: str
    transit_tab_cards: List[TransitTabCard]
    pdf_sections: List[ReportSection]
    disclaimer: str


# -----------------------------
# Knowledge Base
# -----------------------------

NAKSHATRA_KNOWLEDGE: Dict[NakshatraName, Dict[str, str]] = {
    "Ashwini": {"lord": "Ketu", "deity": "Ashwini Kumaras", "symbol": "Horse head", "nature": "Swift", "essence": "new beginning, healing impulse, speed and rescue", "gift": "quick recovery, fast movement and fresh start", "shadow": "impatience, unfinished work and impulsive decisions", "remedy_tone": "begin cleanly, heal quickly, avoid hurry"},
    "Bharani": {"lord": "Venus", "deity": "Yama", "symbol": "Yoni", "nature": "Fierce", "essence": "birth, death, restraint, responsibility and consequence", "gift": "endurance, capacity to carry pressure and moral strength", "shadow": "excess, indulgence and karmic burden", "remedy_tone": "respect boundaries and choose dharma over impulse"},
    "Krittika": {"lord": "Sun", "deity": "Agni", "symbol": "Razor", "nature": "Sharp", "essence": "cutting, purification, fire and truth", "gift": "clarity, courage and purification", "shadow": "harsh speech, criticism and burning bridges", "remedy_tone": "purify without cruelty"},
    "Rohini": {"lord": "Moon", "deity": "Brahma", "symbol": "Cart", "nature": "Soft", "essence": "growth, beauty, fertility and material nourishment", "gift": "prosperity, creativity and sensual harmony", "shadow": "attachment, possessiveness and comfort addiction", "remedy_tone": "nourish without clinging"},
    "Mrigashira": {"lord": "Mars", "deity": "Soma", "symbol": "Deer head", "nature": "Soft", "essence": "searching, curiosity, movement and emotional seeking", "gift": "exploration, research and gentle discovery", "shadow": "restlessness and never feeling satisfied", "remedy_tone": "search with direction"},
    "Ardra": {"lord": "Rahu", "deity": "Rudra", "symbol": "Tear drop", "nature": "Sharp", "essence": "storm, grief, transformation and emotional release", "gift": "breakthrough after storm", "shadow": "chaos, anger and destructive speech", "remedy_tone": "release pain consciously"},
    "Punarvasu": {"lord": "Jupiter", "deity": "Aditi", "symbol": "Quiver", "nature": "Moveable", "essence": "return, renewal, protection and second chance", "gift": "restoration and hope", "shadow": "repeating old cycles", "remedy_tone": "restart wisely"},
    "Pushya": {"lord": "Saturn", "deity": "Brihaspati", "symbol": "Cow udder", "nature": "Nourishing", "essence": "support, teaching, nourishment and tradition", "gift": "growth through discipline and blessings", "shadow": "rigidity and emotional withholding", "remedy_tone": "serve and nourish responsibly"},
    "Ashlesha": {"lord": "Mercury", "deity": "Nagas", "symbol": "Serpent", "nature": "Sharp", "essence": "binding, psychology, poison, strategy and hidden power", "gift": "deep perception and healing through awareness", "shadow": "manipulation, secrecy and mental poison", "remedy_tone": "speak truth and remove toxicity"},
    "Magha": {"lord": "Ketu", "deity": "Pitris", "symbol": "Throne", "nature": "Royal", "essence": "ancestors, lineage, power and inheritance", "gift": "authority through roots", "shadow": "pride and ancestral burden", "remedy_tone": "honour ancestors without ego"},
    "Purva Phalguni": {"lord": "Venus", "deity": "Bhaga", "symbol": "Bed", "nature": "Creative", "essence": "pleasure, love, rest, creativity and enjoyment", "gift": "beauty, romance and celebration", "shadow": "laziness, indulgence and vanity", "remedy_tone": "enjoy without excess"},
    "Uttara Phalguni": {"lord": "Sun", "deity": "Aryaman", "symbol": "Back legs of bed", "nature": "Fixed", "essence": "contracts, support, patronage and noble commitment", "gift": "stable alliance and social respect", "shadow": "ego in duty and relationship pride", "remedy_tone": "honour commitments"},
    "Hasta": {"lord": "Moon", "deity": "Savitar", "symbol": "Hand", "nature": "Skillful", "essence": "hands, craft, manifestation, healing and cleverness", "gift": "skill, healing and practical intelligence", "shadow": "control, trickery and nervous manipulation", "remedy_tone": "use skill ethically"},
    "Chitra": {"lord": "Mars", "deity": "Vishwakarma", "symbol": "Gem", "nature": "Bright", "essence": "design, beauty, architecture and construction", "gift": "creative engineering and visual excellence", "shadow": "image obsession and conflict through perfectionism", "remedy_tone": "build beauty with humility"},
    "Swati": {"lord": "Rahu", "deity": "Vayu", "symbol": "Coral", "nature": "Moveable", "essence": "independence, wind, business and scattered movement", "gift": "freedom, trade and adaptability", "shadow": "instability and isolation", "remedy_tone": "use freedom with discipline"},
    "Vishakha": {"lord": "Jupiter", "deity": "Indra-Agni", "symbol": "Triumphal arch", "nature": "Mixed", "essence": "ambition, victory, focus and dual desire", "gift": "achievement and determination", "shadow": "obsession and moral compromise", "remedy_tone": "win ethically"},
    "Anuradha": {"lord": "Saturn", "deity": "Mitra", "symbol": "Lotus", "nature": "Soft", "essence": "friendship, devotion, loyalty and disciplined love", "gift": "alliance, devotion and emotional maturity", "shadow": "dependency and silent suffering", "remedy_tone": "love with boundaries"},
    "Jyeshtha": {"lord": "Mercury", "deity": "Indra", "symbol": "Earring", "nature": "Sharp", "essence": "seniority, protection, power and responsibility", "gift": "command and strategic protection", "shadow": "jealousy, superiority and pressure", "remedy_tone": "protect without domination"},
    "Mula": {"lord": "Ketu", "deity": "Nirriti", "symbol": "Roots", "nature": "Fierce", "essence": "root cutting, destruction, investigation and truth", "gift": "deep research and liberation from false roots", "shadow": "loss, shock and harsh detachment", "remedy_tone": "remove false roots consciously"},
    "Purva Ashadha": {"lord": "Venus", "deity": "Apas", "symbol": "Fan", "nature": "Fierce", "essence": "water victory, persuasion, declaration and cleansing", "gift": "confidence and emotional victory", "shadow": "overconfidence and emotional drama", "remedy_tone": "cleanse ego through truth"},
    "Uttara Ashadha": {"lord": "Sun", "deity": "Vishwadevas", "symbol": "Elephant tusk", "nature": "Fixed", "essence": "final victory, duty, ethics and lasting achievement", "gift": "permanent success", "shadow": "rigidity and moral pride", "remedy_tone": "win through integrity"},
    "Shravana": {"lord": "Moon", "deity": "Vishnu", "symbol": "Ear", "nature": "Moveable", "essence": "listening, learning, travel and preservation", "gift": "wisdom through listening", "shadow": "gossip and passive confusion", "remedy_tone": "listen deeply"},
    "Dhanishtha": {"lord": "Mars", "deity": "Ashta Vasu", "symbol": "Drum", "nature": "Moveable", "essence": "rhythm, wealth, music, real estate and community", "gift": "prosperity through rhythm and group effort", "shadow": "status pressure and emotional emptiness", "remedy_tone": "honour rhythm and sharing"},
    "Shatabhisha": {"lord": "Rahu", "deity": "Varuna", "symbol": "Circle", "nature": "Moveable", "essence": "healing, secrets, medicine, isolation and technology", "gift": "diagnosis, research and hidden healing", "shadow": "addiction, isolation and coldness", "remedy_tone": "heal without hiding"},
    "Purva Bhadrapada": {"lord": "Jupiter", "deity": "Aja Ekapada", "symbol": "Sword", "nature": "Fierce", "essence": "spiritual fire, duality, intensity and transformation", "gift": "spiritual courage", "shadow": "extremism and inner split", "remedy_tone": "use intensity for tapasya"},
    "Uttara Bhadrapada": {"lord": "Saturn", "deity": "Ahirbudhnya", "symbol": "Twin serpents", "nature": "Fixed", "essence": "deep waters, hidden wisdom, stability and endurance", "gift": "depth, maturity and spiritual steadiness", "shadow": "emotional heaviness and stagnation", "remedy_tone": "stabilize the inner ocean"},
    "Revati": {"lord": "Mercury", "deity": "Pushan", "symbol": "Fish", "nature": "Soft", "essence": "safe travel, nourishment, guidance, completion and closure", "gift": "protection, creativity, guidance and peaceful transition", "shadow": "wandering, confusion and inability to complete", "remedy_tone": "complete the old journey and move with guidance"},
}

NAKSHATRA_PRIMARY_SIGN: Dict[NakshatraName, Sign] = {
    "Ashwini": "Aries", "Bharani": "Aries", "Krittika": "Taurus", "Rohini": "Taurus",
    "Mrigashira": "Taurus", "Ardra": "Gemini", "Punarvasu": "Gemini", "Pushya": "Cancer",
    "Ashlesha": "Cancer", "Magha": "Leo", "Purva Phalguni": "Leo", "Uttara Phalguni": "Leo",
    "Hasta": "Virgo", "Chitra": "Virgo", "Swati": "Libra", "Vishakha": "Libra",
    "Anuradha": "Scorpio", "Jyeshtha": "Scorpio", "Mula": "Sagittarius", "Purva Ashadha": "Sagittarius",
    "Uttara Ashadha": "Sagittarius", "Shravana": "Capricorn", "Dhanishtha": "Capricorn",
    "Shatabhisha": "Aquarius", "Purva Bhadrapada": "Aquarius", "Uttara Bhadrapada": "Pisces",
    "Revati": "Pisces",
}

PLANET_KNOWLEDGE: Dict[Planet, Dict[str, object]] = {
    "Sun": {"nature": "royal, fiery, authoritative and soul-centered", "transit_meaning": "visibility, confidence, leadership, ego tests, father themes and public identity activation", "high_expression": "clarity, courage, dignity, leadership and conscious self-expression", "shadow_expression": "ego conflict, harshness, pride, authority clash and burnout", "career_effect": "Sun pushes the native to become visible, take responsibility and define their authority.", "money_effect": "Money decisions become connected with pride, status, government, leadership or father-like guidance.", "relationship_effect": "Relationships may face ego issues, but honest leadership can improve respect.", "health_effect": "Vitality, heart, eyes, heat, head and blood pressure patterns need awareness.", "spiritual_lesson": "The lesson is to shine without burning others.", "core_remedies": ["Offer water to Surya in the morning.", "Respect father, mentors and authority figures.", "Avoid ego-based decisions.", "Practice humility with leadership."]},
    "Moon": {"nature": "emotional, reflective, nurturing and changeable", "transit_meaning": "mood, sleep, emotional reactions, mother, home comfort and daily mental rhythm", "high_expression": "emotional intelligence, softness, intuition, nourishment and adaptability", "shadow_expression": "mood swings, fear, dependency, overthinking and emotional flooding", "career_effect": "Career decisions may be influenced by mood, public response or emotional environment.", "money_effect": "Spending may increase on comfort, food, home, mother, travel or emotional needs.", "relationship_effect": "Emotional closeness increases, but insecurity can also rise.", "health_effect": "Sleep, fluids, stomach, hormones and emotional digestion need care.", "spiritual_lesson": "The lesson is to feel deeply without becoming unstable.", "core_remedies": ["Keep sleep regular.", "Serve mother or mother-like figures.", "Avoid emotional eating.", "Do calming mantra or water-based meditation."]},
    "Mars": {"nature": "fiery, aggressive, protective, action-driven and surgical", "transit_meaning": "action, courage, conflict, competition, injury risk, surgery, land and decisive movement", "high_expression": "courage, stamina, discipline, protection and focused action", "shadow_expression": "anger, accidents, inflammation, haste, conflict and impulsive decisions", "career_effect": "Mars pushes action, competition, leadership in crisis and decisive execution.", "money_effect": "Money may go into machinery, property, tools, repairs, surgery, vehicles or aggressive business moves.", "relationship_effect": "Passion rises, but anger and arguments must be controlled.", "health_effect": "Blood, muscles, inflammation, cuts, burns, surgery and accidents need attention.", "spiritual_lesson": "The lesson is to use fire as courage, not destruction.", "core_remedies": ["Exercise regularly.", "Avoid impulsive anger.", "Donate red lentils or support soldiers/workers.", "Channel energy into disciplined action."]},
    "Mercury": {"nature": "intellectual, youthful, commercial, analytical and communicative", "transit_meaning": "thinking, speech, documents, business, learning, travel, negotiation and digital systems", "high_expression": "intelligence, communication, analysis, trade and adaptability", "shadow_expression": "overthinking, confusion, nervousness, trickery and scattered attention", "career_effect": "Career improves through communication, writing, analytics, technology, sales, learning and networking.", "money_effect": "Money decisions become linked with trade, calculation, negotiation and information.", "relationship_effect": "Conversation becomes central. Miscommunication can create issues.", "health_effect": "Nerves, skin, speech, intestines, lungs and anxiety patterns need awareness.", "spiritual_lesson": "The lesson is to use intelligence as guidance, not manipulation.", "core_remedies": ["Organize documents.", "Avoid lies and gossip.", "Study daily.", "Donate green items or learning material."]},
    "Jupiter": {"nature": "wise, expansive, protective, ethical and growth-oriented", "transit_meaning": "expansion, learning, blessings, children, wealth, dharma, teachers and long-term opportunity", "high_expression": "wisdom, faith, prosperity, ethics, teaching and grace", "shadow_expression": "overconfidence, excess, laziness, weight gain and false optimism", "career_effect": "Career grows through guidance, teaching, advisory roles, education, law, finance and wisdom-based work.", "money_effect": "Money can grow, but over-expansion should be controlled.", "relationship_effect": "Relationships become more forgiving, wise and family-oriented.", "health_effect": "Liver, fat, sugar, thighs, growth patterns and overindulgence need awareness.", "spiritual_lesson": "The lesson is to expand with wisdom.", "core_remedies": ["Respect teachers and gurus.", "Donate yellow food or study material.", "Teach or guide someone sincerely.", "Avoid overpromising."]},
    "Venus": {"nature": "soft, artistic, relational, luxurious and harmonizing", "transit_meaning": "love, pleasure, beauty, marriage, art, comfort, luxury, vehicles and sensual choices", "high_expression": "love, harmony, refinement, creativity, attraction and sweetness", "shadow_expression": "indulgence, vanity, laziness, sensual excess and relationship confusion", "career_effect": "Career benefits through design, beauty, entertainment, luxury, hospitality, art, counselling and relationship work.", "money_effect": "Money may go into comfort, fashion, vehicle, beauty, spouse, art or luxury.", "relationship_effect": "Romance and attraction increase, but expectations and pleasure-seeking can also rise.", "health_effect": "Kidneys, reproductive system, sugar balance, skin and hormones need care.", "spiritual_lesson": "The lesson is to enjoy beauty without losing balance.", "core_remedies": ["Respect women and spouse.", "Keep relationships clean and honest.", "Avoid excess luxury spending.", "Donate white sweets or beauty-care items to needy women."]},
    "Saturn": {"nature": "slow, karmic, disciplined, realistic and pressure-giving", "transit_meaning": "maturity, responsibility, karma, delay, structure, work, discipline and long-term endurance", "high_expression": "discipline, patience, responsibility, endurance, service and lasting success", "shadow_expression": "fear, delay, loneliness, heaviness, chronic pressure and pessimism", "career_effect": "Career demands hard work, accountability, structure and proof.", "money_effect": "Money becomes serious. Saturn asks for savings, debt control, ethical income and patience.", "relationship_effect": "Relationships are tested for maturity, loyalty and responsibility.", "health_effect": "Bones, joints, teeth, chronic fatigue, ageing, nerves and stiffness need attention.", "spiritual_lesson": "The lesson is to accept karma and build patiently.", "core_remedies": ["Serve elderly, poor or workers.", "Do disciplined daily work.", "Avoid laziness and blame.", "Donate black sesame, shoes, blankets or food according to capacity."]},
    "Rahu": {"nature": "unconventional, obsessive, foreign, technological and illusion-creating", "transit_meaning": "ambition, foreign connections, technology, obsession, confusion, social media and sudden hunger", "high_expression": "innovation, ambition, foreign success, technology and unconventional rise", "shadow_expression": "illusion, addiction, anxiety, scandal, obsession and shortcuts", "career_effect": "Career can rise through technology, foreign links, media, politics, unconventional fields or viral growth.", "money_effect": "Money may come suddenly but can also disappear through risky speculation or illusion.", "relationship_effect": "Unusual attraction, obsession or foreign connection may arise.", "health_effect": "Toxins, allergies, anxiety, addiction, unusual symptoms and skin issues need awareness.", "spiritual_lesson": "The lesson is to master desire instead of being possessed by it.", "core_remedies": ["Avoid shortcuts and addiction.", "Do grounding practices.", "Serve outcast, poor or foreign people respectfully.", "Check facts before acting."]},
    "Ketu": {"nature": "detached, spiritual, cutting, past-life oriented and moksha-giving", "transit_meaning": "detachment, separation, spiritual insight, confusion, research, past karma and sudden disinterest", "high_expression": "intuition, liberation, research, detachment and spiritual depth", "shadow_expression": "confusion, isolation, carelessness, sudden breaks and lack of grounding", "career_effect": "Career may feel meaningless unless connected with research, spirituality, healing or technical depth.", "money_effect": "Money decisions may become detached or careless. Avoid neglecting material duties.", "relationship_effect": "Distance, silence or spiritualized love may appear.", "health_effect": "Hidden symptoms, nerve sensitivity, wounds, mysterious pain and sudden weakness need attention.", "spiritual_lesson": "The lesson is to detach without escaping responsibility.", "core_remedies": ["Worship Ganesha.", "Avoid careless detachment.", "Feed stray dogs if culturally suitable.", "Practice grounding and humility."]},
}

HOUSE_KNOWLEDGE: Dict[int, Dict[str, object]] = {
    1: {"name": "Lagna / Self", "areas": "body, identity, personality, confidence, health, appearance, direction and self-image", "core_theme": "life asks the native to rebuild the self, body and personal direction", "career": "Career becomes connected with personal identity. The native may want to redefine role, visibility and professional direction.", "money": "Money decisions become personal. The native may spend on health, appearance, skills or self-improvement.", "relationship": "Relationships reflect the native’s changing identity. Others may feel the person has become serious, distant or more self-focused.", "family": "Family expects maturity. The native may become more responsible but also less emotionally available.", "health": "Health needs direct attention because the body itself becomes the transit field.", "spirituality": "Self-reflection becomes the main spiritual path.", "travel": "Travel may happen for self-discovery, health, work or personal reset.", "property": "Property decisions should not be rushed because identity is changing.", "litigation": "Avoid ego-based conflict and personal confrontation.", "remedies": ["Maintain body discipline.", "Wake up early.", "Exercise or walk daily.", "Avoid ego reactions."], "cautions": ["Do not ignore health.", "Avoid identity crisis-based decisions.", "Do not react harshly to criticism."]},
    2: {"name": "Wealth / Family / Speech", "areas": "money, savings, food, family, speech, values, teeth and stored resources", "core_theme": "life audits money, family values, food habits and speech", "career": "Career decisions are judged by income stability and practical value.", "money": "Savings, pricing, cash flow, family wealth and investment discipline become important.", "relationship": "Speech can heal or damage relationships. Money conversations require maturity.", "family": "Family truth becomes visible. Value conflicts may arise.", "health": "Food habits, mouth, teeth, throat and digestion need attention.", "spirituality": "The spiritual lesson is clean speech and clean consumption.", "travel": "Travel may happen for family or financial reasons.", "property": "Family property and accumulated assets may become a topic.", "litigation": "Money disputes and family financial arguments should be documented.", "remedies": ["Donate food.", "Control speech.", "Avoid addiction.", "Start disciplined saving."], "cautions": ["Avoid harsh words.", "Do not lend money casually.", "Avoid overeating."]},
    3: {"name": "Effort / Communication", "areas": "courage, siblings, writing, media, documents, short travel, skills and self-effort", "core_theme": "life asks the native to act, communicate and organize effort", "career": "Career grows through writing, marketing, sales, media, skills, communication and initiative.", "money": "Money improves when skills are used practically.", "relationship": "Communication style becomes important. Silence or sharp words can create distance.", "family": "Siblings, cousins or neighbours may become active.", "health": "Shoulders, arms, lungs and nervous strain need care.", "spirituality": "The spiritual lesson is courageous action.", "travel": "Short travels, work trips and local movement can increase.", "property": "Documents related to property should be checked.", "litigation": "Documentation and written proof matter.", "remedies": ["Organize documents.", "Write daily.", "Repair sibling communication.", "Avoid gossip."], "cautions": ["Avoid illegal paperwork.", "Do not promise casually.", "Avoid scattered effort."]},
    4: {"name": "Home / Mother / Emotional Foundation", "areas": "home, mother, property, vehicles, emotional peace, land and inner security", "core_theme": "life rebuilds emotional foundation and domestic stability", "career": "Work may connect with home, property, vehicles, education or emotional security.", "money": "Money may go into home, vehicle, renovation, mother or property.", "relationship": "Emotional baggage may affect intimacy.", "family": "Mother, parents and home atmosphere need attention.", "health": "Chest, heart-space, emotional stress and sleep need care.", "spirituality": "The spiritual lesson is inner peace and forgiveness.", "travel": "Travel may happen due to home, family or emotional reset.", "property": "Property, renovation and relocation become important.", "litigation": "Property documents and family disputes require care.", "remedies": ["Serve mother.", "Clean home temple.", "Spend time in nature.", "Do emotional journaling."], "cautions": ["Avoid impulsive property decisions.", "Do not suppress emotions.", "Check vehicle and property documents."]},
    5: {"name": "Creativity / Children / Mantra", "areas": "children, romance, creativity, intelligence, mantra, speculation and purva punya", "core_theme": "life tests joy, creativity, romance, children and mental patterns", "career": "Creative, teaching, strategy, content, education and advisory work become active.", "money": "Speculation should be handled carefully. Wealth grows through skill, not gambling.", "relationship": "Romance becomes meaningful or heavy depending on maturity.", "family": "Children, pregnancy, education or lineage themes may arise.", "health": "Mental heaviness, digestion and nervous creativity patterns need care.", "spirituality": "Mantra, sadhana, dream work and deity connection become powerful.", "travel": "Travel may happen for children, learning or spiritual places.", "property": "Property is secondary unless linked with children or education.", "litigation": "Speculative disputes and romance-related complications should be avoided.", "remedies": ["Do mantra japa.", "Keep a dream journal.", "Avoid gambling.", "Support children or students."], "cautions": ["Avoid overthinking.", "Avoid risky trading.", "Do not play with romance."]},
    6: {"name": "Disease / Debt / Service", "areas": "health, debt, enemies, disputes, employees, animals, routine, service and litigation", "core_theme": "life asks for cleanup of health, debt, documents and routine", "career": "Workload rises, but service, operations, legal, medical, accounting and problem-solving improve.", "money": "Debt, bills, loans and financial discipline become important.", "relationship": "Routine stress can affect relationship peace.", "family": "Family may need practical service or medical support.", "health": "Disease patterns, digestion, muscles, bones, inflammation and daily routine need attention.", "spirituality": "Service becomes the remedy.", "travel": "Travel may happen for work, health or service.", "property": "Property documents, repairs and disputes should be handled carefully.", "litigation": "This house can give victory if discipline and documentation are strong.", "remedies": ["Feed animals.", "Donate for medical help.", "Exercise regularly.", "Clear debts slowly."], "cautions": ["Do not ignore health symptoms.", "Avoid legal negligence.", "Do not delay paperwork."]},
    7: {"name": "Marriage / Partnership", "areas": "spouse, business partners, contracts, public dealing, clients and long-term commitment", "core_theme": "life tests commitment, partnership and public dealing", "career": "Business, clients, partnership and public image become active.", "money": "Money becomes linked with contracts, spouse, clients and partnership decisions.", "relationship": "Marriage and serious relationships face maturity tests.", "family": "Family may become involved in relationship decisions.", "health": "Kidneys, reproductive balance, lower back and stress from partnership need care.", "spirituality": "Commitment becomes the spiritual lesson.", "travel": "Travel may happen with partner or for business dealing.", "property": "Joint property decisions should be documented.", "litigation": "Marriage, divorce, business contracts and legal agreements need care.", "remedies": ["Keep promises.", "Review contracts.", "Respect spouse or partner.", "Avoid ego in relationship."], "cautions": ["Do not sign blindly.", "Avoid impulsive breakup or marriage.", "Avoid public image drama."]},
    8: {"name": "Transformation / Secrets", "areas": "secrets, sudden events, inheritance, occult, chronic issues, intimacy and psychological depth", "core_theme": "life exposes hidden truth and forces deep transformation", "career": "Research, insurance, tax, occult, psychology, healing, investigation and crisis management become active.", "money": "Joint wealth, loans, tax, inheritance and risky money need caution.", "relationship": "Intimacy, trust, secrets and spouse’s family may be tested.", "family": "Inheritance, in-laws and hidden family matters can surface.", "health": "Chronic issues, hidden symptoms, anxiety and reproductive health need care.", "spirituality": "Shadow work and occult learning become powerful.", "travel": "Travel may happen due to crisis, research or spiritual transformation.", "property": "Inheritance and hidden property matters require documents.", "litigation": "Court cases, tax, insurance and hidden disputes need attention.", "remedies": ["Do health checkups.", "Avoid secrecy.", "Donate for medical treatment.", "Practice meditation."], "cautions": ["Avoid risky investments.", "Do not hide legal matters.", "Avoid intoxicants."]},
    9: {"name": "Dharma / Fortune / Guru", "areas": "luck, father, guru, higher education, long-distance travel, temples and ethics", "core_theme": "life tests faith, teachers, beliefs and higher guidance", "career": "Career grows through teaching, law, consulting, foreign links, higher learning and mentorship.", "money": "Long-term investments, banking, advisors and institutional money need review.", "relationship": "Belief systems and family advice influence relationship choices.", "family": "Father, guru, boss or elders may need respect and service.", "health": "Thighs, liver, digestion and faith-related stress need awareness.", "spirituality": "Real dharma is tested. Fake teachers may leave.", "travel": "Long-distance pilgrimage or foreign travel may occur.", "property": "Property connected with father, temple or long-distance place may arise.", "litigation": "Legal, advisor-based or institutional matters require care.", "remedies": ["Serve guru, father or teachers.", "Do temple seva.", "Donate study material.", "Study scripture or wisdom texts."], "cautions": ["Avoid fake gurus.", "Do not disrespect father or teachers.", "Review financial advice."]},
    10: {"name": "Career / Karma", "areas": "profession, authority, status, bosses, public image, karma and responsibility", "core_theme": "life tests career direction and public responsibility", "career": "Career becomes the main field of karma. Responsibility, leadership and proof are demanded.", "money": "Money improves through professional discipline and long-term work.", "relationship": "Work pressure can reduce emotional availability.", "family": "Family may expect status, stability or achievement.", "health": "Stress, knees, bones, sleep and work pressure need care.", "spirituality": "Karma yoga becomes the path.", "travel": "Travel may happen for career, authority or duty.", "property": "Property may become linked with status or work stability.", "litigation": "Professional compliance and reputation matters need attention.", "remedies": ["Respect seniors.", "Work daily with discipline.", "Update career documents.", "Avoid office politics."], "cautions": ["Do not resign impulsively.", "Avoid reputation risks.", "Do not ignore duty."]},
    11: {"name": "Gains / Network", "areas": "income, friends, elder siblings, audience, community, gains and large goals", "core_theme": "life filters networks and income sources", "career": "Career grows through networks, audience, community, social media and long-term goals.", "money": "Income models, pricing, gains and recurring revenue are tested.", "relationship": "Friendships and social circles are filtered.", "family": "Elder siblings or community-like family figures may become important.", "health": "Overwork for gains can affect digestion, sleep and stress.", "spirituality": "Public karma and ethical gains become the lesson.", "travel": "Travel may happen for community, events or networks.", "property": "Gains may support property goals later.", "litigation": "Community, client or income disputes should be documented.", "remedies": ["Help friends responsibly.", "Repay old debts.", "Avoid fake groups.", "Serve community."], "cautions": ["Do not lend casually.", "Avoid time-wasting networks.", "Do not reveal every plan."]},
    12: {"name": "Loss / Moksha / Foreign", "areas": "expenses, sleep, hospitals, isolation, foreign lands, retreats and spiritual release", "core_theme": "life releases old baggage and audits expenses", "career": "Career may involve background work, foreign links, retreat, research or hidden preparation.", "money": "Expenses rise, but conscious spiritual spending becomes purification.", "relationship": "Withdrawal, distance or old emotional closure may happen.", "family": "Family duties may create expenses or travel.", "health": "Sleep, feet, hidden stress, hospital matters and fatigue need care.", "spirituality": "This is a moksha house. Meditation, retreat and surrender become powerful.", "travel": "Foreign travel, retreat, hospital travel or isolation travel can occur.", "property": "Property-related expenses or closure may arise.", "litigation": "Legal closure or hidden settlement may require money.", "remedies": ["Meditate daily.", "Donate to hospitals or ashrams.", "Fix sleep routine.", "Donate shoes or blankets."], "cautions": ["Avoid escapism.", "Do not waste money unconsciously.", "Avoid addiction and secrecy."]},
}

PLANET_ASPECT_RULES: Dict[Planet, List[PlanetAspectRule]] = {
    "Sun": [PlanetAspectRule(7, "7th full aspect", 65, "creates visibility, confrontation, relationship mirror and public response")],
    "Moon": [PlanetAspectRule(7, "7th full aspect", 55, "creates emotional reflection, mood exchange and relationship sensitivity")],
    "Mars": [PlanetAspectRule(4, "4th special aspect", 78, "pushes action, pressure, construction, protection or conflict into this house"), PlanetAspectRule(7, "7th full aspect", 70, "creates direct confrontation, passion, competition or decisive movement"), PlanetAspectRule(8, "8th special aspect", 82, "creates sudden transformation, hidden pressure, surgery-like action or crisis-clearing")],
    "Mercury": [PlanetAspectRule(7, "7th full aspect", 55, "creates dialogue, negotiation, trade, documents and mental exchange")],
    "Jupiter": [PlanetAspectRule(5, "5th special aspect", 82, "gives wisdom, blessing, learning, children, creativity and future growth"), PlanetAspectRule(7, "7th full aspect", 70, "gives guidance, balance, counsel, partnership wisdom and expansion"), PlanetAspectRule(9, "9th special aspect", 86, "gives fortune, dharma, grace, protection, higher learning and spiritual direction")],
    "Venus": [PlanetAspectRule(7, "7th full aspect", 60, "creates attraction, harmony, desire, comfort, relationship and aesthetic exchange")],
    "Saturn": [PlanetAspectRule(3, "3rd special aspect", 78, "demands effort, courage, discipline, communication cleanup and practical action"), PlanetAspectRule(7, "7th full aspect", 72, "tests relationships, contracts, public dealing and long-term commitments"), PlanetAspectRule(10, "10th special aspect", 88, "tests karma, work, authority, duty, career and public responsibility")],
    "Rahu": [PlanetAspectRule(5, "5th karmic aspect", 78, "amplifies desire, imagination, speculation, intelligence and unusual creativity"), PlanetAspectRule(7, "7th karmic aspect", 74, "creates obsession, attraction, public projection or relational illusion"), PlanetAspectRule(9, "9th karmic aspect", 80, "disturbs or expands belief, luck, foreign links, ideology and unconventional dharma")],
    "Ketu": [PlanetAspectRule(5, "5th karmic aspect", 72, "creates detachment, past-life intelligence, mantra pull and unusual insight"), PlanetAspectRule(7, "7th karmic aspect", 70, "creates distance, silence, karmic separation or spiritualized relationship"), PlanetAspectRule(9, "9th karmic aspect", 76, "creates detachment from old beliefs and movement toward inner truth")],
}


# -----------------------------
# Utility functions
# -----------------------------

def join_paras(parts: Iterable[str]) -> str:
    return "\n\n".join([x for x in parts if x])


def clamp(n: float, lo: int = 0, hi: int = 100) -> int:
    return int(max(lo, min(hi, round(n))))


def get_transit_house_from_ascendant(ascendant: Sign, transit_sign: Sign) -> int:
    asc_index = SIGNS.index(ascendant)
    transit_index = SIGNS.index(transit_sign)
    return ((transit_index - asc_index + 12) % 12) + 1


def get_house_from_aspect(current_house: int, aspect_number: int) -> int:
    return ((current_house + aspect_number - 2) % 12) + 1


def get_planet_aspect_hits(planet: Planet, direct_house: int) -> List[PlanetAspectHit]:
    hits: List[PlanetAspectHit] = []
    for rule in PLANET_ASPECT_RULES[planet]:
        hits.append(
            PlanetAspectHit(
                aspect_number=rule.aspect_number,
                label=rule.label,
                strength=rule.strength,
                meaning=rule.meaning,
                target_house=get_house_from_aspect(direct_house, rule.aspect_number),
            )
        )
    return hits


def get_tone(planet: Planet, house: int, impact_type: Optional[RippleImpactType] = None) -> RippleTone:
    if impact_type == "background":
        return "mixed"
    malefic = planet in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
    benefic = planet in ["Moon", "Mercury", "Jupiter", "Venus"]
    dusthana = house in [6, 8, 12]
    kendra_trikona = house in [1, 4, 5, 7, 9, 10]
    if malefic and dusthana:
        return "intense"
    if malefic and kendra_trikona:
        return "challenging"
    if benefic and kendra_trikona:
        return "positive"
    return "mixed"


def score_transit(planet: Planet, house: int) -> int:
    tone = get_tone(planet, house)
    return {"positive": 78, "mixed": 58, "challenging": 46, "intense": 38}[tone]


def build_speed_modifier(speed: Optional[TransitSpeed]) -> str:
    if speed == "retrograde":
        return "Because the planet is retrograde, the result becomes more internal, repetitive and karmic. Old people, old decisions, old mistakes or unfinished work may return for review."
    if speed == "stationary":
        return "Because the planet is stationary, its effect becomes concentrated. Events may feel slow, heavy or unusually significant around this period."
    return "Because the planet is direct, the results move forward more visibly through events, decisions and external circumstances."


def build_dasha_modifier(transit_planet: Planet, md: Optional[Planet], ad: Optional[Planet]) -> str:
    if md == transit_planet and ad == transit_planet:
        return f"{transit_planet} is active both by transit and by Mahadasha/Antardasha, so this becomes a high-activation period. The transit is more likely to produce visible events."
    if md == transit_planet:
        return f"{transit_planet} is also the Mahadasha lord, so this transit has strong timing power. The life themes ruled by {transit_planet} become central."
    if ad == transit_planet:
        return f"{transit_planet} is the Antardasha lord, so this transit can trigger noticeable short-term results, decisions and emotional shifts."
    return f"The current dasha is not directly ruled by {transit_planet}, so the transit should be read as a background influence unless it strongly connects with natal planets."


# -----------------------------
# Universal Transit Engine V2
# -----------------------------

def build_event_explanation(
    transit_planet: Planet,
    transit_sign: Sign,
    transit_nakshatra: NakshatraName,
    transit_speed: Optional[TransitSpeed] = "direct",
    current_mahadasha: Optional[Planet] = None,
    current_antardasha: Optional[Planet] = None,
) -> ReportSection:
    planet = PLANET_KNOWLEDGE[transit_planet]
    nak = NAKSHATRA_KNOWLEDGE[transit_nakshatra]
    return ReportSection(
        title=f"{transit_planet} Transit in {transit_nakshatra}",
        subtitle=f"{transit_planet} in {transit_sign} through {transit_nakshatra} Nakshatra",
        body=join_paras([
            f"{transit_planet} is {planet['nature']}. In transit, it activates {planet['transit_meaning']}.",
            f"{transit_sign} becomes the field where this planetary force expresses itself. The sign gives the environment, the house gives the life-area, and the nakshatra gives the subtle story behind the events.",
            f"{transit_nakshatra} is ruled by {nak['lord']} and connected with {nak['deity']}. Its symbol is {nak['symbol']}, and its essence is {nak['essence']}. The gift of this nakshatra is {nak['gift']}, while its shadow can show as {nak['shadow']}.",
            f"Therefore, this transit should be read as {transit_planet} carrying its planetary agenda through the inner doorway of {transit_nakshatra}. The remedy tone is: {nak['remedy_tone']}.",
            build_speed_modifier(transit_speed),
            build_dasha_modifier(transit_planet, current_mahadasha, current_antardasha),
        ]),
    )


def build_reading(
    *,
    base: ReadingBase,
    sign: Sign,
    transit_planet: Planet,
    transit_sign: Sign,
    transit_nakshatra: NakshatraName,
) -> TransitReading:
    activated_house = get_transit_house_from_ascendant(sign, transit_sign)
    planet = PLANET_KNOWLEDGE[transit_planet]
    house = HOUSE_KNOWLEDGE[activated_house]
    nak = NAKSHATRA_KNOWLEDGE[transit_nakshatra]
    context = (
        "outer life, visible events, body-level circumstances and practical decisions"
        if base == "lagna"
        else "inner mind, emotional experience, mood, memory and psychological timing"
    )
    headline = f"{transit_planet} activates {house['name']} from {'Lagna' if base == 'lagna' else 'Moon'}"
    executive_meaning = join_paras([
        f"From {'Lagna' if base == 'lagna' else 'Moon sign'}, {transit_planet} is moving through the {activated_house} house, the house of {house['areas']}. This means the transit will mainly work through {context}.",
        f"{transit_planet} brings {planet['high_expression']} when handled consciously, but it can also show {planet['shadow_expression']} when expressed unconsciously. Because the nakshatra is {transit_nakshatra}, the deeper background theme is {nak['essence']}.",
        f"In simple words, life is asking the native to work on this area: {house['core_theme']}. The events may look practical on the surface, but the deeper purpose is to mature the native through the combined lesson of {transit_planet}, {transit_sign}, {transit_nakshatra} and the {activated_house} house.",
    ])
    life_areas = TransitLifeAreaReport(
        career=join_paras([f"Career and work: {house['career']}", str(planet["career_effect"]), f"Professional growth comes when the native uses the higher expression of {transit_planet}: {planet['high_expression']}."]),
        money=join_paras([f"Money and resources: {house['money']}", str(planet["money_effect"]), f"The nakshatra influence adds {nak['essence']}, so financial decisions should be useful, nourishing and karmically clean."]),
        relationship=join_paras([f"Relationship pattern: {house['relationship']}", str(planet["relationship_effect"]), "If the native is conscious, the same transit can mature the bond."]),
        family=join_paras([f"Family and home: {house['family']}", f"The transit may bring duties or emotional realizations connected with the family area represented by the {activated_house} house."]),
        health=join_paras([f"Health awareness: {house['health']}", str(planet["health_effect"]), "This is symbolic wellness guidance, not medical diagnosis."]),
        spirituality=join_paras([f"Spiritual lesson: {house['spirituality']}", str(planet["spiritual_lesson"]), f"The nakshatra remedy tone is {nak['remedy_tone']}."]),
        travel=join_paras([f"Travel and movement: {house['travel']}", "If travel happens, it may become part of the transit’s guidance through movement, meetings and symbolic experiences."]),
        property=join_paras([f"Property and assets: {house['property']}", f"If property matters arise, apply the discipline of {transit_planet} and avoid emotional pressure."]),
        litigation=join_paras([f"Litigation and conflict: {house['litigation']}", "Keep documents clean and avoid ego-based decisions."]),
    )
    remedies = list(dict.fromkeys(
        list(planet["core_remedies"]) + list(house["remedies"]) + [f"Follow the nakshatra remedy tone: {nak['remedy_tone']}."]
    ))
    cautions = list(dict.fromkeys(
        list(house["cautions"]) + [f"Avoid the shadow of {transit_planet}: {planet['shadow_expression']}.", f"Avoid the shadow of {transit_nakshatra}: {nak['shadow']}."]
    ))
    return TransitReading(
        base=base,
        sign=sign,
        activated_house=activated_house,
        headline=headline,
        core_theme=str(house["core_theme"]),
        executive_meaning=executive_meaning,
        life_areas=life_areas,
        timing=join_paras([
            f"Initial phase: pressure, attraction, discomfort or unusual focus appears in the {activated_house} house area.",
            "Middle phase: concrete events, decisions, conversations, expenses, meetings, health signals or work pressure become visible.",
            "Later phase: the lesson becomes clear. If handled consciously, the transit gives maturity and direction.",
        ]),
        remedies=remedies,
        cautions=cautions,
        final_message=f"This transit is a karmic instruction. {transit_planet} is asking the native to mature the {activated_house} house area through {planet['high_expression']}. {transit_nakshatra} adds the deeper lesson of {nak['essence']}.",
    )


def build_combined_guidance(asc_reading: TransitReading, moon_reading: Optional[TransitReading]) -> ReportSection:
    if moon_reading is None:
        return ReportSection(
            title="Combined Transit Guidance",
            subtitle="Lagna-based reading",
            body=join_paras([
                f"The main visible result of this transit comes through the {asc_reading.activated_house} house from Lagna.",
                f"The strongest outer-life theme is: {asc_reading.core_theme}.",
                "Use this reading for practical decisions, visible events, health/body response and real-world responsibilities.",
            ]),
        )
    return ReportSection(
        title="Combined Transit Guidance",
        subtitle="Lagna + Moon synthesis",
        body=join_paras([
            f"From Lagna, the transit activates the {asc_reading.activated_house} house. This shows the practical, outer-life event field.",
            f"From Moon sign, the transit activates the {moon_reading.activated_house} house. This shows the emotional and mental experience.",
            f"Outer-life theme: {asc_reading.core_theme}.",
            f"Inner-emotional theme: {moon_reading.core_theme}.",
            "If both readings point toward similar life areas, the result becomes stronger. If they are different, the native may experience one theme externally and another internally.",
        ]),
    )


def build_transit_remedy_section(transit_planet: Planet, asc_reading: TransitReading, moon_reading: Optional[TransitReading]) -> ReportSection:
    remedies = list(dict.fromkeys(asc_reading.remedies + (moon_reading.remedies if moon_reading else [])))
    cautions = list(dict.fromkeys(asc_reading.cautions + (moon_reading.cautions if moon_reading else [])))
    return ReportSection(
        title="Practical Remedies and Action Plan",
        subtitle=f"{transit_planet} transit remedies",
        body=join_paras([
            "AstroLife does not treat remedies as fear-based rituals. A remedy should match the actual transit lesson.",
            f"For this transit, the main planet is {transit_planet}, so the native should follow remedies that strengthen the higher expression of this planet and reduce its shadow expression.",
        ]),
        bullets=["Recommended actions:", *remedies, "Cautions:", *cautions],
    )


def build_transit_cards(transit_planet: Planet, transit_sign: Sign, transit_nakshatra: NakshatraName, reading: TransitReading) -> List[TransitTabCard]:
    score = score_transit(transit_planet, reading.activated_house)
    tone = get_tone(transit_planet, reading.activated_house)
    return [
        TransitTabCard("Main Transit Signal", score, tone, f"{transit_planet} in {transit_nakshatra} activates the {reading.activated_house} house. Main theme: {reading.core_theme}.", [transit_planet, transit_sign, transit_nakshatra, f"House {reading.activated_house}"]),
        TransitTabCard("Career Signal", clamp(score + (12 if reading.activated_house == 10 else 0)), tone, reading.life_areas.career.split("\n\n")[0], ["Career", "Karma", transit_planet]),
        TransitTabCard("Health Signal", clamp(score - (8 if reading.activated_house in [1, 6, 8, 12] else 0)), "intense" if reading.activated_house in [1, 6, 8, 12] else tone, reading.life_areas.health.split("\n\n")[0], ["Health", "Awareness", f"House {reading.activated_house}"]),
    ]


def build_pdf_sections(event: ReportSection, asc: TransitReading, moon: Optional[TransitReading], combined: ReportSection, remedies: ReportSection, input_title: str) -> List[ReportSection]:
    asc_section = ReportSection(
        title="Ascendant Transit Reading",
        subtitle=f"{input_title} activates House {asc.activated_house}",
        body=join_paras([
            asc.executive_meaning,
            asc.life_areas.career, asc.life_areas.money, asc.life_areas.relationship,
            asc.life_areas.family, asc.life_areas.health, asc.life_areas.spirituality,
            asc.life_areas.travel, asc.life_areas.property, asc.life_areas.litigation,
            asc.timing, asc.final_message,
        ]),
    )
    sections = [event, asc_section]
    if moon:
        sections.append(ReportSection(
            title="Moon Sign Transit Reading",
            subtitle=f"{input_title} activates House {moon.activated_house} from Moon",
            body=join_paras([moon.executive_meaning, moon.life_areas.career, moon.life_areas.money, moon.life_areas.relationship, moon.life_areas.health, moon.life_areas.spirituality, moon.timing, moon.final_message]),
        ))
    sections += [combined, remedies]
    sections.append(ReportSection(
        title="Final Transit Conclusion",
        subtitle="AstroLife premium interpretation",
        body=join_paras([
            f"This transit of {input_title} is not just a sky movement. It is a timing signal.",
            "The activated house from Lagna shows the real-world event field. The activated house from Moon shows the emotional experience. The nakshatra shows the deeper story.",
            "The best way to use this report is not fear. The best way is conscious action.",
        ]),
    ))
    return sections


def run_universal_transit_engine_v2(
    *,
    ascendant: Sign,
    transit_planet: Planet,
    transit_sign: Sign,
    transit_nakshatra: NakshatraName,
    native_name: str = "Native",
    moon_sign: Optional[Sign] = None,
    transit_speed: Optional[TransitSpeed] = "direct",
    current_mahadasha: Optional[Planet] = None,
    current_antardasha: Optional[Planet] = None,
    period_label: str = "Current transit activation period",
    include_moon_sign_reading: bool = True,
) -> TransitMasterV2Report:
    event = build_event_explanation(transit_planet, transit_sign, transit_nakshatra, transit_speed, current_mahadasha, current_antardasha)
    asc_reading = build_reading(base="lagna", sign=ascendant, transit_planet=transit_planet, transit_sign=transit_sign, transit_nakshatra=transit_nakshatra)
    moon_reading = None
    if include_moon_sign_reading and moon_sign and moon_sign != ascendant:
        moon_reading = build_reading(base="moon", sign=moon_sign, transit_planet=transit_planet, transit_sign=transit_sign, transit_nakshatra=transit_nakshatra)
    combined = build_combined_guidance(asc_reading, moon_reading)
    remedies = build_transit_remedy_section(transit_planet, asc_reading, moon_reading)
    transit_name = f"{transit_planet} in {transit_sign} / {transit_nakshatra}"
    cards = build_transit_cards(transit_planet, transit_sign, transit_nakshatra, asc_reading)
    pdf = build_pdf_sections(event, asc_reading, moon_reading, combined, remedies, transit_name)
    return TransitMasterV2Report(
        title="AstroLife Universal Transit Master Report",
        native_name=native_name,
        transit_name=transit_name,
        period_label=period_label,
        event_explanation=event,
        ascendant_reading=asc_reading,
        moon_reading=moon_reading,
        combined_guidance=combined,
        remedy_section=remedies,
        transit_tab_cards=cards,
        pdf_sections=pdf,
        disclaimer="Astrology is symbolic guidance. Combine transit results with natal chart strength, dasha, divisional charts, real-life context and practical judgment. This is not medical, legal, financial or psychological advice.",
    )


# -----------------------------
# Transit Ripple Engine V4
# -----------------------------

def get_impact_score(impact_type: RippleImpactType, aspect_hit: Optional[PlanetAspectHit] = None) -> int:
    if impact_type == "direct":
        return 100
    if impact_type == "aspect":
        return aspect_hit.strength if aspect_hit else 65
    return 22


def get_impact_phrase(impact_type: RippleImpactType, aspect_hit: Optional[PlanetAspectHit] = None) -> str:
    if impact_type == "direct":
        return "This is the main stage of the transit because the planet is physically moving through this house."
    if impact_type == "aspect":
        return f"This house receives the planet’s {aspect_hit.label if aspect_hit else 'aspect'}. It is not the main stage, but it receives a strong directional influence: {aspect_hit.meaning if aspect_hit else ''}."
    return "This house is not directly occupied or aspected, but it still receives a background ripple because every transit changes the balance of the whole chart."


def build_layer_title(transit_planet: Planet, house: int, impact_type: RippleImpactType, aspect_hit: Optional[PlanetAspectHit]) -> str:
    if impact_type == "direct":
        return f"Direct Impact: {transit_planet} in House {house}"
    if impact_type == "aspect":
        return f"Aspect Impact: House {house} receives {aspect_hit.label if aspect_hit else 'aspect'}"
    return f"Background Ripple: House {house}"


def build_ripple_summary(transit_planet: Planet, transit_nakshatra: NakshatraName, house: int, impact_type: RippleImpactType, aspect_hit: Optional[PlanetAspectHit]) -> str:
    planet = PLANET_KNOWLEDGE[transit_planet]
    house_info = HOUSE_KNOWLEDGE[house]
    nak = NAKSHATRA_KNOWLEDGE[transit_nakshatra]
    if impact_type == "direct":
        return f"{transit_planet} directly activates {house_info['name']}, bringing the main lesson of {house_info['core_theme']}. Through {transit_nakshatra}, this becomes connected with {nak['essence']}."
    if impact_type == "aspect":
        return f"{transit_planet} influences {house_info['name']} through {aspect_hit.label if aspect_hit else 'aspect'}. This creates a secondary but important effect on {house_info['areas']}, asking the native to express {planet['high_expression']} instead of {planet['shadow_expression']}."
    return f"{house_info['name']} receives a soft background ripple. This area is not the main event, but it should be observed because the transit’s central lesson may indirectly reshape {house_info['areas']}."


def build_detailed_narrative(transit_planet: Planet, transit_nakshatra: NakshatraName, house: int, impact_type: RippleImpactType, aspect_hit: Optional[PlanetAspectHit]) -> str:
    planet = PLANET_KNOWLEDGE[transit_planet]
    house_info = HOUSE_KNOWLEDGE[house]
    nak = NAKSHATRA_KNOWLEDGE[transit_nakshatra]
    return join_paras([
        f"{build_layer_title(transit_planet, house, impact_type, aspect_hit)}. {get_impact_phrase(impact_type, aspect_hit)}",
        f"The {house_info['name']} governs {house_info['areas']}. During this transit, this area is coloured by {transit_planet}, whose higher expression is {planet['high_expression']}, while its shadow can show as {planet['shadow_expression']}.",
        f"{transit_nakshatra} adds the nakshatra story. It is connected with {nak['deity']}, symbolized by {nak['symbol']}, and its essence is {nak['essence']}. Its gift is {nak['gift']}, while its shadow is {nak['shadow']}.",
        "Because of this, the house result should not be read mechanically. It should be read as a karmic story where the planet is trying to mature the native through the themes of this house.",
        f"The practical instruction is simple: live the higher expression of {transit_planet}. If the native chooses {planet['high_expression']}, this house becomes more constructive. If the native falls into {planet['shadow_expression']}, this house becomes a place of stress, delay or confusion.",
    ])


def build_house_ripple_layer(transit_planet: Planet, transit_nakshatra: NakshatraName, house: int, direct_house: int, aspect_hits: List[PlanetAspectHit]) -> HouseRippleLayer:
    aspect_hit = next((h for h in aspect_hits if h.target_house == house), None)
    impact_type: RippleImpactType = "direct" if house == direct_house else "aspect" if aspect_hit else "background"
    house_info = HOUSE_KNOWLEDGE[house]
    planet = PLANET_KNOWLEDGE[transit_planet]
    nak = NAKSHATRA_KNOWLEDGE[transit_nakshatra]
    score = clamp(get_impact_score(impact_type, aspect_hit))
    tone = get_tone(transit_planet, house, impact_type)
    if impact_type == "background":
        remedies = list(house_info["remedies"])[:2]
        cautions = list(house_info["cautions"])[:2]
    else:
        remedies = list(dict.fromkeys(list(planet["core_remedies"]) + list(house_info["remedies"]) + [f"Follow the nakshatra remedy tone: {nak['remedy_tone']}."]))
        cautions = list(dict.fromkeys(list(house_info["cautions"]) + [f"Avoid the shadow of {transit_planet}: {planet['shadow_expression']}.", f"Avoid the shadow of {transit_nakshatra}: {nak['shadow']}."]))
    return HouseRippleLayer(
        house=house,
        house_name=str(house_info["name"]),
        house_areas=str(house_info["areas"]),
        impact_type=impact_type,
        aspect_label=aspect_hit.label if aspect_hit else None,
        intensity_score=score,
        tone=tone,
        title=build_layer_title(transit_planet, house, impact_type, aspect_hit),
        headline=f"{house_info['name']}: {house_info['core_theme']}",
        summary=build_ripple_summary(transit_planet, transit_nakshatra, house, impact_type, aspect_hit),
        detailed_narrative=build_detailed_narrative(transit_planet, transit_nakshatra, house, impact_type, aspect_hit),
        career=join_paras([f"Career: {house_info['career']}", str(planet["career_effect"]) if impact_type != "background" else "This is a background career influence and should be read only as a secondary signal."]),
        money=join_paras([f"Money: {house_info['money']}", str(planet["money_effect"]) if impact_type != "background" else "This is a secondary financial ripple, not the main money event."]),
        relationship=join_paras([f"Relationship: {house_info['relationship']}", str(planet["relationship_effect"]) if impact_type != "background" else "This is a soft relational ripple and may appear only through mood or indirect behaviour."]),
        family=f"Family: {house_info['family']}",
        health=join_paras([f"Health: {house_info['health']}", str(planet["health_effect"]) if impact_type != "background" else "This is symbolic wellness awareness, not diagnosis."]),
        spirituality=join_paras([f"Spirituality: {house_info['spirituality']}", str(planet["spiritual_lesson"]) if impact_type != "background" else "This house gives a subtle spiritual background lesson."]),
        travel=f"Travel: {house_info['travel']}",
        property=f"Property: {house_info['property']}",
        litigation=f"Litigation/conflict: {house_info['litigation']}",
        remedies=remedies,
        cautions=cautions,
    )


def build_twelve_house_ripple_table(layers: List[HouseRippleLayer]) -> List[TwelveHouseRippleTableRow]:
    return [TwelveHouseRippleTableRow(layer.house, layer.house_name, layer.impact_type, layer.intensity_score, layer.tone, layer.summary) for layer in layers]


def build_direct_house_section(layer: HouseRippleLayer) -> ReportSection:
    return ReportSection(
        title="Main Activated House",
        subtitle=layer.title,
        body=join_paras([layer.detailed_narrative, layer.career, layer.money, layer.relationship, layer.health, layer.spirituality]),
        bullets=[f"Activated house: {layer.house}", f"Intensity: {layer.intensity_score}/100", f"Tone: {layer.tone}", f"Main theme: {layer.headline}"],
    )


def build_aspect_house_section(aspect_layers: List[HouseRippleLayer]) -> ReportSection:
    if not aspect_layers:
        return ReportSection("Aspect House Impacts", "This planet does not create special aspect-house layers beyond its direct house in the current configuration.")
    return ReportSection(
        title="Aspect House Impacts",
        subtitle="Secondary houses receiving planetary drishti",
        body="\n\n".join([join_paras([f"## {layer.title}", layer.detailed_narrative, layer.career, layer.money, layer.relationship, layer.health, layer.spirituality]) for layer in aspect_layers]),
        bullets=[f"House {layer.house}: {layer.aspect_label or 'Aspect'} — {layer.intensity_score}/100" for layer in aspect_layers],
    )


def build_twelve_house_ripple_section(layers: List[HouseRippleLayer]) -> ReportSection:
    return ReportSection(
        title="12-House Ripple Map",
        subtitle="How one transit touches the complete horoscope",
        body="\n\n".join([f"House {layer.house} — {layer.house_name}: {layer.summary}" for layer in layers]),
        bullets=[f"House {layer.house}: {layer.impact_type.upper()} | {layer.intensity_score}/100 | {layer.tone}" for layer in layers],
    )


def build_ripple_remedy_section(layers: List[HouseRippleLayer], transit_planet: Planet, transit_nakshatra: NakshatraName) -> ReportSection:
    high_impact = [x for x in layers if x.impact_type != "background"]
    remedies: List[str] = []
    cautions: List[str] = []
    for layer in high_impact:
        remedies += layer.remedies
        cautions += layer.cautions
    remedies = list(dict.fromkeys(remedies))
    cautions = list(dict.fromkeys(cautions))
    return ReportSection(
        title="Transit Ripple Remedies",
        subtitle=f"{transit_planet} remedies by direct and aspect houses",
        body=join_paras([
            "The strongest remedies should be chosen from the direct house and the aspect houses. Background ripple houses are useful for awareness, but remedies should focus mainly on the houses that are directly activated or aspected.",
            f"Because the main planet is {transit_planet}, the remedy must reduce its shadow and strengthen its higher expression. Because the nakshatra is {transit_nakshatra}, the remedy must also follow the nakshatra tone.",
            "A true transit remedy is not only ritual. It is a behavioural correction.",
        ]),
        bullets=["Recommended remedies:", *remedies, "Cautions:", *cautions],
    )


def build_final_book_style_conclusion(transit_planet: Planet, transit_nakshatra: NakshatraName, direct_layer: HouseRippleLayer, aspect_layers: List[HouseRippleLayer]) -> str:
    planet = PLANET_KNOWLEDGE[transit_planet]
    nak = NAKSHATRA_KNOWLEDGE[transit_nakshatra]
    aspect_text = (
        f"It also sends influence to {', '.join([f'House {l.house} ({l.house_name})' for l in aspect_layers])}. These houses become the secondary fields where the transit will echo."
        if aspect_layers
        else "There are no additional special aspect houses in this configuration, so the direct house remains the main field."
    )
    return join_paras([
        f"This transit of {transit_planet} through {transit_nakshatra} is not a single event. It is a full ripple moving through the horoscope. The direct house, House {direct_layer.house}, becomes the main stage.",
        aspect_text,
        f"The deeper meaning comes from the planet and the nakshatra together. {transit_planet} asks the native to develop {planet['high_expression']}. If handled unconsciously, it can create {planet['shadow_expression']}. {transit_nakshatra}, ruled by {nak['lord']} and connected with {nak['deity']}, adds the story of {nak['essence']}.",
        "Therefore, this transit should be lived consciously. Do not ask only, ‘What will happen?’ Ask, ‘Which house of my life is being matured, and what behaviour must I correct?’",
        "A transit becomes difficult when ignored, but it becomes a path of growth when understood.",
    ])


def build_extra_transit_tab_cards(transit_planet: Planet, transit_nakshatra: NakshatraName, layers: List[HouseRippleLayer]) -> List[TransitTabCard]:
    high = sorted([l for l in layers if l.impact_type != "background"], key=lambda x: x.intensity_score, reverse=True)
    return [TransitTabCard(layer.title, layer.intensity_score, layer.tone, layer.summary, [transit_planet, transit_nakshatra, f"House {layer.house}", layer.impact_type]) for layer in high]


def run_transit_ripple_engine_v4(
    *,
    ascendant: Sign,
    transit_planet: Planet,
    transit_sign: Sign,
    transit_nakshatra: NakshatraName,
    native_name: str = "Native",
    moon_sign: Optional[Sign] = None,
    transit_speed: Optional[TransitSpeed] = "direct",
    current_mahadasha: Optional[Planet] = None,
    current_antardasha: Optional[Planet] = None,
    period_label: str = "Current transit activation period",
    include_moon_sign_reading: bool = True,
) -> TransitRippleV4Report:
    base = run_universal_transit_engine_v2(
        ascendant=ascendant,
        moon_sign=moon_sign,
        transit_planet=transit_planet,
        transit_sign=transit_sign,
        transit_nakshatra=transit_nakshatra,
        native_name=native_name,
        transit_speed=transit_speed,
        current_mahadasha=current_mahadasha,
        current_antardasha=current_antardasha,
        period_label=period_label,
        include_moon_sign_reading=include_moon_sign_reading,
    )
    direct_house = get_transit_house_from_ascendant(ascendant, transit_sign)
    aspect_hits = get_planet_aspect_hits(transit_planet, direct_house)
    layers = [build_house_ripple_layer(transit_planet, transit_nakshatra, h, direct_house, aspect_hits) for h in range(1, 13)]
    direct_layer = next(l for l in layers if l.impact_type == "direct")
    aspect_layers = [l for l in layers if l.impact_type == "aspect"]
    high_impact_layers = sorted([l for l in layers if l.impact_type != "background"], key=lambda x: x.intensity_score, reverse=True)
    table = build_twelve_house_ripple_table(layers)
    direct_section = build_direct_house_section(direct_layer)
    aspect_section = build_aspect_house_section(aspect_layers)
    ripple_section = build_twelve_house_ripple_section(layers)
    remedy_section = build_ripple_remedy_section(layers, transit_planet, transit_nakshatra)
    final = build_final_book_style_conclusion(transit_planet, transit_nakshatra, direct_layer, aspect_layers)
    extra_cards = build_extra_transit_tab_cards(transit_planet, transit_nakshatra, layers)
    cards = base.transit_tab_cards + extra_cards
    detailed_layers_section = ReportSection(
        title="Detailed 12-House Interpretations",
        subtitle="Full house-by-house ripple reading",
        body="\n\n".join([
            join_paras([
                f"## House {layer.house}: {layer.house_name}",
                layer.detailed_narrative,
                layer.career,
                layer.money,
                layer.relationship,
                layer.family,
                layer.health,
                layer.spirituality,
                layer.travel,
                layer.property,
                layer.litigation,
            ]) for layer in layers
        ]),
    )
    pdf_sections = base.pdf_sections + [direct_section, aspect_section, ripple_section, remedy_section, detailed_layers_section, ReportSection("Final Book-Style Transit Conclusion", final)]
    return TransitRippleV4Report(
        title="AstroLife Transit Ripple Engine V4 Report",
        native_name=native_name,
        transit_name=f"{transit_planet} in {transit_sign} / {transit_nakshatra}",
        period_label=period_label,
        base_transit_report=base,
        direct_house=direct_house,
        aspect_hits=aspect_hits,
        ripple_layers=layers,
        high_impact_layers=high_impact_layers,
        twelve_house_ripple_table=table,
        direct_house_section=direct_section,
        aspect_house_section=aspect_section,
        twelve_house_ripple_section=ripple_section,
        remedy_section=remedy_section,
        final_book_style_conclusion=final,
        transit_tab_cards=cards,
        pdf_sections=pdf_sections,
        disclaimer="Astrology is symbolic guidance. Transit ripple results should be combined with natal chart strength, dasha, divisional charts, real-life context and practical judgment. This is not medical, legal, financial or psychological advice.",
    )


# -----------------------------
# 2916 + 34992 Matrix Helpers
# -----------------------------

def build_transit_matrix_key(planet: Planet, ascendant: Sign, nakshatra: NakshatraName) -> str:
    return f"{planet}__{ascendant}__{nakshatra}".replace(" ", "_")


def build_ripple_matrix_key(planet: Planet, ascendant: Sign, nakshatra: NakshatraName, house: int) -> str:
    return f"{planet}__{ascendant}__{nakshatra}__House_{house}".replace(" ", "_")


def run_transit_matrix_2916_combination(
    planet: Planet,
    ascendant: Sign,
    nakshatra: NakshatraName,
    moon_sign: Optional[Sign] = None,
    current_mahadasha: Optional[Planet] = None,
    current_antardasha: Optional[Planet] = None,
    period_label: Optional[str] = None,
) -> Dict[str, object]:
    transit_sign = NAKSHATRA_PRIMARY_SIGN[nakshatra]
    report = run_universal_transit_engine_v2(
        ascendant=ascendant,
        moon_sign=moon_sign,
        transit_planet=planet,
        transit_sign=transit_sign,
        transit_nakshatra=nakshatra,
        current_mahadasha=current_mahadasha,
        current_antardasha=current_antardasha,
        period_label=period_label or f"{planet} transit through {nakshatra}",
        include_moon_sign_reading=bool(moon_sign),
    )
    reading = report.ascendant_reading
    return {
        "key": build_transit_matrix_key(planet, ascendant, nakshatra),
        "planet": planet,
        "ascendant": ascendant,
        "nakshatra": nakshatra,
        "transit_sign": transit_sign,
        "activated_house": reading.activated_house,
        "headline": reading.headline,
        "core_theme": reading.core_theme,
        "executive_meaning": reading.executive_meaning,
        "career": reading.life_areas.career,
        "money": reading.life_areas.money,
        "relationship": reading.life_areas.relationship,
        "health": reading.life_areas.health,
        "remedies": reading.remedies,
        "cautions": reading.cautions,
        "transit_tab_cards": [asdict(c) for c in report.transit_tab_cards],
        "pdf_sections": [asdict(s) for s in report.pdf_sections],
    }


def iterate_transit_matrix_2916() -> Generator[Dict[str, object], None, None]:
    for planet in PLANETS:
        for ascendant in SIGNS:
            for nakshatra in NAKSHATRAS_27:
                yield run_transit_matrix_2916_combination(planet, ascendant, nakshatra)


def generate_compact_transit_matrix_2916() -> List[Dict[str, object]]:
    return [
        {
            "key": item["key"],
            "planet": item["planet"],
            "ascendant": item["ascendant"],
            "nakshatra": item["nakshatra"],
            "transit_sign": item["transit_sign"],
            "activated_house": item["activated_house"],
            "headline": item["headline"],
            "core_theme": item["core_theme"],
            "summary": item["executive_meaning"],
            "remedies": item["remedies"][:5],
            "cautions": item["cautions"][:5],
            "cards": item["transit_tab_cards"],
        }
        for item in iterate_transit_matrix_2916()
    ]


def run_transit_ripple_matrix_layers_for_combination_v4(
    planet: Planet,
    ascendant: Sign,
    nakshatra: NakshatraName,
    transit_sign: Optional[Sign] = None,
    moon_sign: Optional[Sign] = None,
    current_mahadasha: Optional[Planet] = None,
    current_antardasha: Optional[Planet] = None,
) -> List[Dict[str, object]]:
    resolved_sign = transit_sign or NAKSHATRA_PRIMARY_SIGN[nakshatra]
    report = run_transit_ripple_engine_v4(
        ascendant=ascendant,
        moon_sign=moon_sign,
        transit_planet=planet,
        transit_sign=resolved_sign,
        transit_nakshatra=nakshatra,
        current_mahadasha=current_mahadasha,
        current_antardasha=current_antardasha,
        period_label=f"{planet} transit through {nakshatra}",
        include_moon_sign_reading=bool(moon_sign),
    )
    layers = []
    for layer in report.ripple_layers:
        layers.append({
            "key": build_ripple_matrix_key(planet, ascendant, nakshatra, layer.house),
            "planet": planet,
            "ascendant": ascendant,
            "nakshatra": nakshatra,
            "transit_sign": resolved_sign,
            "direct_house": report.direct_house,
            "house": layer.house,
            "house_name": layer.house_name,
            "impact_type": layer.impact_type,
            "intensity_score": layer.intensity_score,
            "tone": layer.tone,
            "summary": layer.summary,
            "detailed_narrative": layer.detailed_narrative,
            "remedies": layer.remedies,
            "cautions": layer.cautions,
        })
    return layers


def iterate_transit_ripple_matrix_34992_v4() -> Generator[Dict[str, object], None, None]:
    for planet in PLANETS:
        for ascendant in SIGNS:
            for nakshatra in NAKSHATRAS_27:
                for layer in run_transit_ripple_matrix_layers_for_combination_v4(planet, ascendant, nakshatra):
                    yield layer


def generate_compact_transit_ripple_matrix_34992_v4() -> List[Dict[str, object]]:
    return [
        {
            "key": layer["key"],
            "planet": layer["planet"],
            "ascendant": layer["ascendant"],
            "nakshatra": layer["nakshatra"],
            "transit_sign": layer["transit_sign"],
            "direct_house": layer["direct_house"],
            "house": layer["house"],
            "house_name": layer["house_name"],
            "impact_type": layer["impact_type"],
            "score": layer["intensity_score"],
            "tone": layer["tone"],
            "summary": layer["summary"],
            "remedies": layer["remedies"][:4],
            "cautions": layer["cautions"][:4],
        }
        for layer in iterate_transit_ripple_matrix_34992_v4()
    ]


def save_json(path: str, data: object) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# -----------------------------
# Example usage
# -----------------------------

if __name__ == "__main__":
    report = run_transit_ripple_engine_v4(
        native_name="Sample Native",
        ascendant="Taurus",
        moon_sign="Scorpio",
        transit_planet="Saturn",
        transit_sign="Pisces",
        transit_nakshatra="Revati",
        transit_speed="direct",
        current_mahadasha="Saturn",
        current_antardasha="Mercury",
        period_label="Saturn in Revati activation window",
        include_moon_sign_reading=True,
    )

    print("DIRECT HOUSE:", report.direct_house)
    print("ASPECT HITS:", [asdict(x) for x in report.aspect_hits])
    print("\n12-HOUSE RIPPLE TABLE:")
    for row in report.twelve_house_ripple_table:
        print(asdict(row))

    print("\nDIRECT HOUSE SECTION:\n")
    print(report.direct_house_section.body[:1500], "...")

    print("\nFINAL CONCLUSION:\n")
    print(report.final_book_style_conclusion)

    one_combo_layers = run_transit_ripple_matrix_layers_for_combination_v4(
        planet="Saturn",
        ascendant="Taurus",
        nakshatra="Revati",
    )
    print("\nLayers for one combination:", len(one_combo_layers))
    assert len(one_combo_layers) == 12

    print("Expected 2916 matrix count:", UNIVERSAL_TRANSIT_MATRIX_2916_COUNT)
    print("Expected 34992 ripple count:", TRANSIT_RIPPLE_34992_COUNT)

    # Uncomment only when you want to generate full compact matrices.
    # compact_2916 = generate_compact_transit_matrix_2916()
    # assert len(compact_2916) == UNIVERSAL_TRANSIT_MATRIX_2916_COUNT
    # save_json("transit-matrix-2916.compact.json", compact_2916)

    # compact_34992 = generate_compact_transit_ripple_matrix_34992_v4()
    # assert len(compact_34992) == TRANSIT_RIPPLE_34992_COUNT
    # save_json("transit-ripple-34992.compact.json", compact_34992)
