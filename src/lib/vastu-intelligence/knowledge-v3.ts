// AstroLife Vastu Intelligence Knowledge Database v3
// Multi-tradition source-tagged seed.
// Important: Lal Kitab Makan Vastu is separate from Classical Vastu.

export type VastuSystem =
  | "classical_vastu"
  | "modern_practical"
  | "mahavastu_remedy"
  | "lal_kitab_makan_vastu"
  | "scientific_interpretation";

export type Domain =
  | "wealth"
  | "health"
  | "relationship"
  | "career"
  | "children"
  | "spiritual"
  | "business"
  | "mentalPeace"
  | "construction";

export type DirectionProfile = {
  code: string;
  name: string;
  element: string;
  deity: string;
  planets: string[];
  domains: Domain[];
  ideal: string[];
  avoid: string[];
  positive: string[];
  negative: string[];
  science: string;
  systems: VastuSystem[];
};

export type RoomRule = {
  room: string;
  label: string;
  ideal: string[];
  good: string[];
  caution: string[];
  avoid: string[];
  criticalAvoid?: string[];
  domains: Domain[];
  systems: VastuSystem[];
  authority: "primary" | "secondary" | "experimental";
  baseSeverity: number;
  idealMessage: string;
  cautionMessage: string;
  defectMessage: string;
  notes?: string;
};

export type Remedy = {
  code: string;
  title: string;
  systems: VastuSystem[];
  type:
    | "structural"
    | "functional"
    | "cleanliness"
    | "element_balance"
    | "colour"
    | "metal"
    | "lighting"
    | "water"
    | "symbolic_planet_activation"
    | "behavioural"
    | "construction"
    | "spiritual"
    | "modern_product";
  steps: string[];
  cost: "free" | "low" | "medium" | "high";
  ease: number;
  effectiveness: number;
  requiresKundli: boolean;
  demolitionRequired: boolean;
  confidence: "high" | "medium" | "low" | "conditional";
};

export const SOURCE_POLICY_V3 = {
  classical_vastu: {
    authority: "primary",
    useFor: ["directions", "room placement", "plot", "vastu purusha", "structural correction"],
  },
  modern_practical: {
    authority: "secondary",
    useFor: ["flat analysis", "office/shop/factory", "practical scoring", "no-demolition corrections"],
  },
  mahavastu_remedy: {
    authority: "secondary",
    useFor: ["16-zone style remedies", "metal strips", "colour tapes", "paintings", "figurines", "pyramids"],
    warning: "Modern remedy/product layer only; not classical authority.",
  },
  lal_kitab_makan_vastu: {
    authority: "experimental",
    useFor: ["khana-direction map", "kundli-safe remedies", "makan aukat", "construction-stage rules"],
    warning: "Keep separate from Classical Vastu; symbolic remedies require kundli validation.",
  },
} as const;

export const DIRECTIONS_V3: Record<string, DirectionProfile> = {
  N: {
    code: "N",
    name: "North",
    element: "Water / growth flow",
    deity: "Kubera / Soma tradition",
    planets: ["Mercury", "Moon"],
    domains: ["wealth", "career", "business"],
    ideal: ["open", "light", "clean", "active", "flowing"],
    avoid: ["blocked", "heavy", "dark", "dirty"],
    positive: ["opportunity", "cash flow", "business movement"],
    negative: ["blocked income", "stagnation", "missed opportunity"],
    science: "Open and active zones improve circulation, visibility and usability.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  NE: {
    code: "NE",
    name: "North-East",
    element: "Water + subtle clarity",
    deity: "Ishana",
    planets: ["Jupiter", "Ketu"],
    domains: ["spiritual", "mentalPeace", "health", "children"],
    ideal: ["open", "clean", "low", "light", "sacred"],
    avoid: ["toilet", "fire", "heavy load", "dustbin", "septic", "cut"],
    positive: ["wisdom", "peace", "spiritual clarity"],
    negative: ["mental heaviness", "confusion", "spiritual blockage"],
    science: "Clean, light and quiet spaces support calm attention and emotional regulation.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  E: {
    code: "E",
    name: "East",
    element: "Solar / prana",
    deity: "Indra / Surya tradition",
    planets: ["Sun"],
    domains: ["health", "career", "mentalPeace"],
    ideal: ["morning light", "windows", "entrance", "open", "clean"],
    avoid: ["blocked", "dark", "heavy wall", "dirty toilet"],
    positive: ["vitality", "positive thinking", "recognition"],
    negative: ["low vitality", "negative thinking", "low initiative"],
    science: "Morning light supports circadian rhythm, alertness and mood.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  SE: {
    code: "SE",
    name: "South-East",
    element: "Fire",
    deity: "Agni",
    planets: ["Mars", "Venus", "Rahu"],
    domains: ["wealth", "relationship", "health", "business"],
    ideal: ["controlled fire", "kitchen", "electrical", "heat management"],
    avoid: ["dirty water", "toilet overload", "uncontrolled fire", "clutter"],
    positive: ["energy", "digestion", "cash movement"],
    negative: ["expenses", "anger", "conflict", "financial leakage"],
    science: "Grouping cooking/heat/electrical load improves safety and comfort.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  S: {
    code: "S",
    name: "South",
    element: "Heat / discipline",
    deity: "Yama",
    planets: ["Sun", "Mars"],
    domains: ["career", "business", "health"],
    ideal: ["controlled", "stable", "higher than north where possible"],
    avoid: ["too open", "too low", "main water depression"],
    positive: ["discipline", "recognition", "controlled power"],
    negative: ["instability", "excess heat", "stress"],
    science: "Climate-sensitive design matters; southern sunlight can be beneficial in cold regions.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  SW: {
    code: "SW",
    name: "South-West",
    element: "Earth / stability",
    deity: "Nirriti / Pitru stability zone",
    planets: ["Saturn", "Rahu"],
    domains: ["relationship", "wealth", "business", "health"],
    ideal: ["heavy", "high", "closed", "stable", "master bedroom"],
    avoid: ["cut", "toilet", "underground water", "large opening", "low"],
    positive: ["authority", "marital stability", "asset holding"],
    negative: ["instability", "relationship conflict", "property issues"],
    science: "Stable private zones and heavy storage support privacy and grounding.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  W: {
    code: "W",
    name: "West",
    element: "Completion / Varuna",
    deity: "Varuna",
    planets: ["Saturn", "Venus"],
    domains: ["children", "career", "business"],
    ideal: ["controlled openings", "study/dining variants", "balanced storage"],
    avoid: ["chaotic opening", "dirty water", "blocked creativity"],
    positive: ["gains", "completion", "children progress"],
    negative: ["delay", "children concerns", "creative blockage"],
    science: "Western heat/glare needs control for comfort and productivity.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  NW: {
    code: "NW",
    name: "North-West",
    element: "Air / movement",
    deity: "Vayu",
    planets: ["Moon", "Rahu"],
    domains: ["business", "relationship", "career"],
    ideal: ["movement", "guest", "trade", "ventilated toilet", "finished goods"],
    avoid: ["permanent safe", "unstable master bedroom", "stuck heavy storage"],
    positive: ["support", "movement", "transactions"],
    negative: ["instability", "over-movement", "lack of support"],
    science: "Movement spaces benefit from ventilation and circulation.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
  CENTER: {
    code: "CENTER",
    name: "Brahmasthan / Markaz",
    element: "Space",
    deity: "Brahma",
    planets: ["Space"],
    domains: ["health", "mentalPeace", "spiritual"],
    ideal: ["open", "clean", "light", "unburdened", "circulation"],
    avoid: ["toilet", "septic", "heavy load", "staircase", "darkness"],
    positive: ["overall vitality", "family harmony", "clarity"],
    negative: ["energy congestion", "health pressure", "family disharmony"],
    science: "Open circulation cores reduce clutter and create spaciousness.",
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
  },
};

export const ROOM_RULES_V3: RoomRule[] = [
  {
    room: "main_entrance",
    label: "Main Entrance",
    ideal: ["NE", "E", "N"],
    good: ["NW", "W"],
    caution: ["SE", "S"],
    avoid: ["SW", "CENTER"],
    criticalAvoid: ["SW", "CENTER"],
    domains: ["career", "wealth", "business", "health"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "primary",
    baseSeverity: 7,
    idealMessage: "Entrance supports opportunity and life flow.",
    cautionMessage: "Entrance needs detailed pada/facing analysis before final judgement.",
    defectMessage: "Entrance placement may reduce stability or create pressure on household flow.",
  },
  {
    room: "kitchen",
    label: "Kitchen",
    ideal: ["SE"],
    good: ["NW", "E"],
    caution: ["S", "W"],
    avoid: ["NE", "SW", "CENTER"],
    criticalAvoid: ["NE", "CENTER"],
    domains: ["health", "wealth", "relationship"],
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
    authority: "primary",
    baseSeverity: 8,
    idealMessage: "Kitchen aligns with Agni/fire zone.",
    cautionMessage: "Kitchen here can work only with ventilation and fire-water separation.",
    defectMessage: "Kitchen is disturbing a sensitive/stability zone and may increase heat or confusion.",
  },
  {
    room: "master_bedroom",
    label: "Master Bedroom",
    ideal: ["SW"],
    good: ["S", "W"],
    caution: ["NW", "SE"],
    avoid: ["NE", "CENTER"],
    criticalAvoid: ["NE", "CENTER"],
    domains: ["relationship", "health", "wealth"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "primary",
    baseSeverity: 7,
    idealMessage: "Master bedroom in a stable zone supports rest and authority.",
    cautionMessage: "This placement needs balancing; SE bedroom is not automatically wrong in Lal Kitab module.",
    defectMessage: "Master bedroom is placed in a zone that may weaken rest, clarity or authority.",
    notes: "SE bedroom is classical caution, but Lal Kitab Makan Vastu may treat SE/khana 12 as conditional-positive after kundli validation.",
  },
  {
    room: "bedroom",
    label: "Bedroom",
    ideal: ["SW", "S", "W"],
    good: ["NW"],
    caution: ["SE", "N"],
    avoid: ["NE", "CENTER"],
    criticalAvoid: ["CENTER"],
    domains: ["relationship", "health", "mentalPeace"],
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
    authority: "secondary",
    baseSeverity: 6,
    idealMessage: "Bedroom is in a supportive rest zone.",
    cautionMessage: "Bedroom here is conditional; occupant role, sleep quality and kundli may change interpretation.",
    defectMessage: "Bedroom placement may disturb sleep, peace or relationship stability.",
  },
  {
    room: "children_room",
    label: "Children Room",
    ideal: ["W", "NW", "N", "E"],
    good: ["NE"],
    caution: ["S", "SE"],
    avoid: ["SW", "CENTER"],
    domains: ["children", "health", "career"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "secondary",
    baseSeverity: 5,
    idealMessage: "Children room supports learning, movement and growth.",
    cautionMessage: "Children room here needs light, study direction and sleep support.",
    defectMessage: "Children room may create pressure, restlessness or blocked progress.",
  },
  {
    room: "study_room",
    label: "Study Room",
    ideal: ["NE", "E", "N"],
    good: ["W"],
    caution: ["NW", "S"],
    avoid: ["SW", "SE", "CENTER"],
    domains: ["career", "children", "mentalPeace"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "secondary",
    baseSeverity: 5,
    idealMessage: "Study room supports clarity, learning and concentration.",
    cautionMessage: "Study here may work if the user faces East/North/NE and clutter is controlled.",
    defectMessage: "Study placement may reduce focus or create mental heat/heaviness.",
  },
  {
    room: "pooja_room",
    label: "Pooja Room",
    ideal: ["NE"],
    good: ["E", "N"],
    caution: ["W"],
    avoid: ["S", "SW", "SE", "CENTER"],
    criticalAvoid: ["SW", "SE"],
    domains: ["spiritual", "mentalPeace", "health"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "primary",
    baseSeverity: 6,
    idealMessage: "Pooja/meditation is in the most sattvic zone.",
    cautionMessage: "Pooja here is acceptable only if clean, quiet and not sharing toilet/staircase walls.",
    defectMessage: "Sacred activity is placed in a zone that may not support calm spiritual focus.",
  },
  {
    room: "toilet",
    label: "Toilet",
    ideal: ["NW", "W"],
    good: ["S"],
    caution: ["SE", "N"],
    avoid: ["NE", "SW", "CENTER", "E"],
    criticalAvoid: ["NE", "CENTER", "SW"],
    domains: ["health", "mentalPeace", "wealth", "relationship"],
    systems: ["classical_vastu", "modern_practical", "lal_kitab_makan_vastu"],
    authority: "primary",
    baseSeverity: 9,
    idealMessage: "Toilet is in a movement/drainage-friendly zone.",
    cautionMessage: "Toilet here requires dryness, ventilation and element isolation.",
    defectMessage: "Toilet is polluting a sensitive, central or stability zone.",
  },
  {
    room: "bathroom",
    label: "Bathroom",
    ideal: ["NW", "W", "E"],
    good: ["N"],
    caution: ["SE", "S"],
    avoid: ["NE", "SW", "CENTER"],
    criticalAvoid: ["NE", "CENTER"],
    domains: ["health", "mentalPeace", "wealth"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "secondary",
    baseSeverity: 7,
    idealMessage: "Bathroom has workable water/drainage placement.",
    cautionMessage: "Bathroom here needs dryness, slope, ventilation and fire-water separation.",
    defectMessage: "Bathroom is placed in a sensitive zone and needs correction.",
  },
  {
    room: "staircase",
    label: "Staircase",
    ideal: ["SW", "S", "W"],
    good: ["SE"],
    caution: ["NW", "N"],
    avoid: ["NE", "CENTER"],
    criticalAvoid: ["NE", "CENTER"],
    domains: ["health", "wealth", "mentalPeace"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "primary",
    baseSeverity: 8,
    idealMessage: "Staircase weight is placed in a stable/heavy zone.",
    cautionMessage: "Staircase here needs careful openness and weight balancing.",
    defectMessage: "Staircase is loading a sensitive or central zone.",
  },
  {
    room: "underground_water",
    label: "Underground Water / Borewell",
    ideal: ["NE"],
    good: ["N", "E"],
    caution: ["NW", "W"],
    avoid: ["SE", "S", "SW", "CENTER"],
    criticalAvoid: ["SW", "CENTER"],
    domains: ["wealth", "health", "mentalPeace", "spiritual"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "primary",
    baseSeverity: 8,
    idealMessage: "Underground water supports the water-spiritual/opportunity axis.",
    cautionMessage: "Water here may work with slope and drainage control.",
    defectMessage: "Underground water is weakening fire/stability/central zones.",
  },
  {
    room: "overhead_tank",
    label: "Overhead Tank",
    ideal: ["SW", "W", "S"],
    good: ["NW"],
    caution: ["SE"],
    avoid: ["NE", "CENTER", "E", "N"],
    criticalAvoid: ["NE", "CENTER"],
    domains: ["health", "wealth", "relationship"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "secondary",
    baseSeverity: 7,
    idealMessage: "Heavy overhead water is placed in a weight-friendly zone.",
    cautionMessage: "Overhead tank here needs load and leakage control.",
    defectMessage: "Heavy overhead water is burdening a light/sacred zone.",
  },
  {
    room: "septic_tank",
    label: "Septic Tank",
    ideal: ["NW", "W"],
    good: ["S"],
    caution: ["SE"],
    avoid: ["NE", "N", "E", "SW", "CENTER"],
    criticalAvoid: ["NE", "CENTER", "SW"],
    domains: ["health", "wealth", "mentalPeace"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "primary",
    baseSeverity: 9,
    idealMessage: "Septic tank is in a comparatively safer waste-isolation zone.",
    cautionMessage: "Septic placement needs isolation, cleanliness and leak prevention.",
    defectMessage: "Septic tank is placed in a highly sensitive zone.",
  },
  {
    room: "office_cabin",
    label: "Office Cabin",
    ideal: ["SW", "W", "S"],
    good: ["N", "E"],
    caution: ["NW", "SE"],
    avoid: ["NE", "CENTER"],
    domains: ["career", "business", "wealth"],
    systems: ["modern_practical", "classical_vastu"],
    authority: "secondary",
    baseSeverity: 6,
    idealMessage: "Decision-maker position supports authority and business grounding.",
    cautionMessage: "Office cabin needs seating direction and clutter control.",
    defectMessage: "Decision-maker cabin may reduce authority or clarity.",
  },
  {
    room: "locker",
    label: "Locker / Safe",
    ideal: ["SW", "S", "W"],
    good: ["N"],
    caution: ["SE", "NW"],
    avoid: ["NE", "CENTER"],
    domains: ["wealth", "business"],
    systems: ["classical_vastu", "modern_practical"],
    authority: "secondary",
    baseSeverity: 6,
    idealMessage: "Locker is placed in a stable wealth-holding zone.",
    cautionMessage: "Locker here needs direction and security balance.",
    defectMessage: "Locker placement may create instability or leakage.",
  },
];

export const REMEDIES_V3: Record<string, Remedy> = {
  keep_clean_light_open: {
    code: "keep_clean_light_open",
    title: "Keep zone clean, light and open",
    systems: ["classical_vastu", "modern_practical"],
    type: "cleanliness",
    steps: ["Declutter the zone.", "Improve light and air.", "Avoid dustbin or broken objects."],
    cost: "free",
    ease: 10,
    effectiveness: 7,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "high",
  },
  ne_sensitive_correction: {
    code: "ne_sensitive_correction",
    title: "North-East sensitive zone correction",
    systems: ["classical_vastu", "modern_practical"],
    type: "element_balance",
    steps: [
      "Keep North-East light, clean and low where possible.",
      "Avoid fire, toilet clutter and heavy storage.",
      "Prefer calm activity such as meditation, study or prayer if suitable.",
      "Use ventilation and soft light.",
    ],
    cost: "low",
    ease: 8,
    effectiveness: 8,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "high",
  },
  toilet_isolation: {
    code: "toilet_isolation",
    title: "Toilet isolation and dryness protocol",
    systems: ["modern_practical", "mahavastu_remedy"],
    type: "metal",
    steps: [
      "Keep toilet dry, ventilated and odor-free.",
      "Keep door closed when not in use.",
      "Use exhaust/ventilation.",
      "Modern no-demolition remedy layer can use metal-strip isolation.",
    ],
    cost: "low",
    ease: 8,
    effectiveness: 6,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "medium",
  },
  sw_strengthen: {
    code: "sw_strengthen",
    title: "Strengthen South-West stability",
    systems: ["classical_vastu", "modern_practical"],
    type: "functional",
    steps: [
      "Place heavy storage or stable furniture in South-West.",
      "Avoid underground water or major opening in South-West.",
      "Use this zone for master bedroom or authority functions where possible.",
    ],
    cost: "low",
    ease: 7,
    effectiveness: 8,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "high",
  },
  agni_balance: {
    code: "agni_balance",
    title: "Agni/fire balance",
    systems: ["classical_vastu", "modern_practical"],
    type: "element_balance",
    steps: [
      "Separate stove/fire from sink/water.",
      "Improve kitchen ventilation.",
      "Avoid excessive red/heat if conflicts are high.",
      "Shift active cooking toward South-East if possible.",
    ],
    cost: "low",
    ease: 7,
    effectiveness: 7,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "high",
  },
  brahmasthan_opening: {
    code: "brahmasthan_opening",
    title: "Brahmasthan opening correction",
    systems: ["classical_vastu", "modern_practical"],
    type: "functional",
    steps: [
      "Declutter the centre of the property.",
      "Avoid heavy storage, toilet or septic activity in the centre.",
      "Use light, open movement and clean flooring.",
    ],
    cost: "free",
    ease: 7,
    effectiveness: 8,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "high",
  },
  east_sun_symbol_kundli_safe: {
    code: "east_sun_symbol_kundli_safe",
    title: "East Sun/Ram symbolic activation only after kundli check",
    systems: ["lal_kitab_makan_vastu"],
    type: "symbolic_planet_activation",
    steps: [
      "Check Lal Kitab khana 1 before using Copper Sun, Surya image or Shri Ram image.",
      "Avoid symbolic Sun activation if Rahu, Ketu, Saturn or Venus occupy khana 1.",
      "Fallback: keep East clean, open and naturally bright.",
    ],
    cost: "low",
    ease: 6,
    effectiveness: 5,
    requiresKundli: true,
    demolitionRequired: false,
    confidence: "conditional",
  },
  ketu_6_makan_aukat: {
    code: "ketu_6_makan_aukat",
    title: "Lal Kitab Ketu-6 style correction for inauspicious Makan Aukat",
    systems: ["lal_kitab_makan_vastu"],
    type: "spiritual",
    steps: [
      "Use only in Lal Kitab Makan Vastu section.",
      "Transcript-based suggestion: offer 3 bananas for 43 days in a temple.",
      "Serve/feed dogs where appropriate.",
      "Do not present as guaranteed; combine with physical correction.",
    ],
    cost: "low",
    ease: 6,
    effectiveness: 4,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "low",
  },
  behaviour_correction: {
    code: "behaviour_correction",
    title: "Mind + Makan behavioural correction",
    systems: ["lal_kitab_makan_vastu", "scientific_interpretation"],
    type: "behavioural",
    steps: [
      "Improve sleep, food discipline and cleanliness.",
      "Reduce harsh speech, anger, jealousy and relationship friction.",
      "Use daily sunlight, fresh air and calm routine.",
      "Treat remedies as clarity support, not magic.",
    ],
    cost: "free",
    ease: 7,
    effectiveness: 8,
    requiresKundli: false,
    demolitionRequired: false,
    confidence: "medium",
  },
};

export const LAL_KITAB_KHANA_DIRECTION_MAP: Record<number, string[]> = {
  1: ["East"],
  2: ["North-West"],
  3: ["South"],
  4: ["North-East", "East-End"],
  6: ["North", "Basement"],
  7: ["South-West"],
  8: ["South-End", "South-Wall"],
  9: ["Brahmasthan", "Markaz"],
  10: ["West"],
  11: ["West-End"],
  12: ["South-East", "Roof"],
};

export const LAL_KITAB_ROOM_PLANET_MAP: Record<string, string> = {
  kitchen: "Mars",
  toilet: "Rahu",
  bathroom: "Rahu",
  bedroom: "Venus",
  master_bedroom: "Venus",
  water: "Moon",
  underground_water: "Moon",
  overhead_tank: "Moon",
  heavy_material: "Saturn",
  iron: "Saturn",
  sun_symbol: "Sun",
  pooja_room: "Jupiter",
  brahmasthan: "Central Energy",
};

export const LAL_KITAB_SYMBOLIC_REMEDIES = [
  {
    code: "LK_EAST_SUN_SYMBOL",
    title: "East Copper Sun / Surya / Shri Ram Symbol",
    direction: "E",
    khana: 1,
    activatesPlanet: "Sun",
    objects: ["Copper Sun", "Surya Image", "Shri Ram Image"],
    allowIf: ["khana 1 empty", "Sun supportive", "Jupiter support available"],
    avoidIfPlanetsInKhana: ["Rahu", "Ketu", "Saturn", "Venus"],
    fallback: ["Keep East clean", "Allow natural morning sunlight", "Avoid symbolic Sun activation"],
  },
];

export const MAKAN_AUKAT_RESULTS: Record<number, { planets: string[]; nature: "auspicious" | "inauspicious"; message: string }> = {
  1: { planets: ["Sun", "Jupiter"], nature: "auspicious", message: "Royal/supportive effect; can support dignity, family and authority." },
  2: { planets: ["Jupiter", "Venus"], nature: "inauspicious", message: "Can create family, money or conduct-related imbalance if unsupported." },
  3: { planets: ["Jupiter", "Mars"], nature: "auspicious", message: "Generally active and useful; may support courage and enterprise." },
  4: { planets: ["Moon", "Saturn"], nature: "inauspicious", message: "Can create emotional heaviness, delay or domestic pressure." },
  5: { planets: ["Sun", "Jupiter"], nature: "auspicious", message: "Supportive for growth, wisdom and status." },
  6: { planets: ["Sun", "Saturn"], nature: "inauspicious", message: "Can create pressure, delay and authority conflict." },
  7: { planets: ["Moon", "Venus"], nature: "auspicious", message: "Supportive for comfort, relationship and emotional harmony." },
  8: { planets: ["Mars", "Saturn"], nature: "inauspicious", message: "Harsh/high-pressure result; needs correction and careful property use." },
};

export const PLOT_SHAPE_RULES_V3 = [
  { shape: "square", status: "good", baseSeverity: 0, message: "Square plot is stable and balanced when directions are also supportive." },
  { shape: "rectangle", status: "good", baseSeverity: 0, message: "Rectangle is generally good if proportions are not extreme." },
  { shape: "gomukhi", status: "good", baseSeverity: 1, message: "Gomukhi is traditionally supportive for residential use." },
  { shape: "singhmukhi", status: "caution", baseSeverity: 3, message: "Singhmukhi is often treated as more commercial than residential." },
  { shape: "triangular", status: "avoid", baseSeverity: 8, message: "Triangular plot is high-pressure and not ideal for normal residence." },
  { shape: "irregular", status: "avoid", baseSeverity: 7, message: "Irregular plot requires zone-wise cut/extension analysis." },
  { shape: "cut", status: "avoid", baseSeverity: 7, message: "Cut plot result depends on missing zone; detailed correction is required." },
] as const;

export const CONSTRUCTION_RULES_V3 = [
  {
    code: "HEAVY_MATERIAL_EAST_NORTH",
    title: "Heavy construction material in East/North/NE",
    badZones: ["E", "N", "NE"],
    severity: 7,
    effects: ["construction delay", "money blockage", "execution mistakes"],
    steps: ["Move heavy material to South/West/SW where possible.", "Keep East/North light and open."],
  },
  {
    code: "SW_LOW_NE_HIGH",
    title: "South-West lower/weaker than North-East",
    badZones: ["SW"],
    severity: 8,
    effects: ["instability", "project delay", "financial drain"],
    steps: ["Increase mass/height/weight in South-West.", "Keep NE clean and open without making SW weak."],
  },
  {
    code: "BRAHMASTHAN_BLOCKED_CONSTRUCTION",
    title: "Lift/stair/heavy block in Brahmasthan",
    badZones: ["CENTER"],
    severity: 9,
    effects: ["energy distribution issue", "overall project pressure"],
    steps: ["Open/clear central circulation where possible.", "If impossible, seek expert structural balancing."],
  },
];

export const DIRECTION_PLANET_LINK: Partial<Record<string, string[]>> = {
  E: ["Sun"],
  NE: ["Jupiter", "Ketu"],
  SE: ["Mars", "Venus"],
  S: ["Sun", "Mars"],
  SW: ["Saturn", "Rahu"],
  W: ["Saturn", "Venus"],
  NW: ["Moon", "Rahu"],
  N: ["Mercury", "Moon"],
  CENTER: ["Space"],
};

export const SCORING_WEIGHTS_V3: Record<string, number> = {
  plot: 12,
  entrance: 14,
  ne: 14,
  sw: 12,
  brahmasthan: 12,
  kitchen: 10,
  toilet: 10,
  bedroom: 6,
  water: 5,
  axis: 5,
};
