// AstroLife Vastu Intelligence — 16-Zone Data
// Extracted from src/lib/astro-engine/vastu.ts for unified access.
// Used by engine-v3 when kundli planet positions are available.
// Types VastuZoneScore and VastuTransitAlert are defined in types.ts.

export const VASTU_ZONES_DEF = [
  { dir: "N",   deg: 348.75, name: "North",      planet: "Mercury", element: "Water",       deity: "Kubera",       domain: "Wealth, Opportunity, Finance",         color: "#22c55e", house: 4  },
  { dir: "NNE", deg: 11.25,  name: "North-NE",   planet: "Jupiter", element: "Water+Air",   deity: "Shiva",        domain: "Knowledge, Health, Immunity",          color: "#4ade80", house: 9  },
  { dir: "NE",  deg: 33.75,  name: "North-East", planet: "Jupiter", element: "Water",       deity: "Isha (Shiva)", domain: "Spirituality, Wisdom, Blessings",      color: "#06b6d4", house: 1  },
  { dir: "ENE", deg: 56.25,  name: "East-NE",    planet: "Sun",     element: "Air+Fire",    deity: "Parjanya",     domain: "Health, Growth, New Beginnings",       color: "#f59e0b", house: 1  },
  { dir: "E",   deg: 78.75,  name: "East",       planet: "Sun",     element: "Air",         deity: "Indra",        domain: "Growth, Prosperity, Activity",         color: "#f97316", house: 1  },
  { dir: "ESE", deg: 101.25, name: "East-SE",    planet: "Venus",   element: "Fire+Air",    deity: "Vitatha",      domain: "Social Success, Relationships",        color: "#ec4899", house: 7  },
  { dir: "SE",  deg: 123.75, name: "South-East", planet: "Venus",   element: "Fire",        deity: "Agni",         domain: "Wealth, Fire, Energy, Kitchen",        color: "#ef4444", house: 2  },
  { dir: "SSE", deg: 146.25, name: "South-SE",   planet: "Mars",    element: "Fire+Earth",  deity: "Grihakshat",   domain: "Confidence, Power, Boldness",          color: "#f87171", house: 3  },
  { dir: "S",   deg: 168.75, name: "South",      planet: "Mars",    element: "Fire",        deity: "Yama",         domain: "Fame, Discipline, Career Recognition", color: "#dc2626", house: 10 },
  { dir: "SSW", deg: 191.25, name: "South-SW",   planet: "Rahu",    element: "Earth+Fire",  deity: "Mrigasthana",  domain: "Ancestors, Hidden Energy",             color: "#a78bfa", house: 8  },
  { dir: "SW",  deg: 213.75, name: "South-West", planet: "Rahu",    element: "Earth",       deity: "Nairriti",     domain: "Stability, Relationships, Longevity",  color: "#7c3aed", house: 7  },
  { dir: "WSW", deg: 236.25, name: "West-SW",    planet: "Saturn",  element: "Space+Earth", deity: "Varuna",       domain: "Profits, Gains, Legacy",               color: "#60a5fa", house: 11 },
  { dir: "W",   deg: 258.75, name: "West",       planet: "Saturn",  element: "Space",       deity: "Varuna",       domain: "Networking, Profits, Results",         color: "#3b82f6", house: 7  },
  { dir: "WNW", deg: 281.25, name: "West-NW",    planet: "Moon",    element: "Air+Space",   deity: "Shosha",       domain: "Movement, Freshness, Guests",          color: "#c084fc", house: 3  },
  { dir: "NW",  deg: 303.75, name: "North-West", planet: "Moon",    element: "Air",         deity: "Vayu",         domain: "Travel, Support, Social Connections",  color: "#a855f7", house: 3  },
  { dir: "NNW", deg: 326.25, name: "North-NW",   planet: "Mercury", element: "Water+Air",   deity: "Mukhya",       domain: "Income, Vitality, Savings",            color: "#34d399", house: 11 },
] as const;

export const ZONE_REMEDIES: Record<string, string> = {
  N:   "Keep North clutter-free. Green plants and water feature. Kubera yantra.",
  NNE: "Study or meditation room. Light yellow lamp on Thursday.",
  NE:  "Sacred puja spot. Temple/mandir ideal. Never toilet or kitchen here.",
  ENE: "Ventilation and sunrise light. No heavy furniture blocking morning sun.",
  E:   "Keep East open. Morning light must enter. No bathroom in East.",
  ESE: "Social area. Pink/white colors. Venus yantra. Flowers here.",
  SE:  "Kitchen ideal here. Red/orange colors. Agni yantra. Fire element.",
  SSE: "Exercise or gym area. Red/orange tones. Remove obstacles.",
  S:   "Fame wall — display awards, photos, achievements. No main door.",
  SSW: "Ancestors photo here. Purple/maroon. Keep heavy and closed.",
  SW:  "Master bedroom ideal. Heavy furniture. No toilet/kitchen. Very important zone.",
  WSW: "Savings and study. Keep organized. No clutter.",
  W:   "Living room or dining. Saturn yantra. Iron objects beneficial.",
  WNW: "Guest room. Keep moving, fresh energy.",
  NW:  "Movement zone — vehicles, social. Moon yantra. Keep active.",
  NNW: "Income corner. Mercury yantra. Keep organized and energized.",
};

export const ZONE_ROOMS: Record<string, string> = {
  N:   "Home Office / Study",
  NNE: "Meditation / Prayer",
  NE:  "Puja Room / Temple",
  ENE: "Children's Room",
  E:   "Master Bedroom",
  ESE: "Living Room",
  SE:  "Kitchen",
  SSE: "Gym / Exercise",
  S:   "Storage / Study",
  SSW: "Ancestors Corner",
  SW:  "Master Bedroom",
  WSW: "Savings Room",
  W:   "Dining Room",
  WNW: "Guest Bedroom",
  NW:  "Garage / Vehicles",
  NNW: "Cash / Locker Room",
};

export const ROOM_GUIDE = [
  { room: "Master Bedroom",  idealDir: "South-West (SW)", reason: "SW = stability, longevity and relationships. Heaviest zone — anchors the household." },
  { room: "Puja / Prayer",   idealDir: "North-East (NE)", reason: "NE = Ishan Kona — most sacred zone. Jupiter and Shiva energy. Never put toilet here." },
  { room: "Kitchen",         idealDir: "South-East (SE)", reason: "SE = Agni (fire) zone. Venus rules. Ideal for cooking and fire-related activities." },
  { room: "Study / Office",  idealDir: "North (N)",       reason: "N = Kubera zone. Mercury rules finance and intellect. Study here for best results." },
  { room: "Children's Room", idealDir: "North-East (NE)", reason: "NE promotes wisdom, health and growth — perfect for children's learning." },
  { room: "Guest Room",      idealDir: "North-West (NW)", reason: "NW = movement zone. Guests come and go. Moon energy keeps it fresh and welcoming." },
  { room: "Dining Room",     idealDir: "West (W)",        reason: "W = Saturn zone. Steady nourishment, results of hard work — ideal for family meals." },
  { room: "Garage / Store",  idealDir: "North-West (NW)", reason: "NW = movement and vehicles. Saturn's discipline maintains organized storage." },
  { room: "Cash / Locker",   idealDir: "North-NW (NNW)",  reason: "NNW = income and savings zone. Mercury governs wealth here." },
] as const;

export const HOUSE_DIR_MAP: Record<number, string> = {
  1:  "East",
  2:  "South-East",
  3:  "South",
  4:  "North",
  5:  "North-East",
  6:  "South",
  7:  "West",
  8:  "South-West",
  9:  "North-East",
  10: "South",
  11: "North-West",
  12: "West",
};

export const VASTU_PURUSHA_HEALTH_MAP: Record<string, { symbolic: string; caution: string }> = {
  NE:     { symbolic: "Mental clarity, spiritual focus, concentration", caution: "NE zone disturbance may symbolically reflect mental heaviness or lack of clarity." },
  CENTER: { symbolic: "Overall vitality, family harmony, central balance", caution: "Brahmasthan blockage symbolically affects overall health and family well-being." },
  SE:     { symbolic: "Digestive fire, energy metabolism, confidence", caution: "SE imbalance may symbolically reflect energy, digestive or anger-related pressure." },
  SW:     { symbolic: "Structural stability, relationship grounding", caution: "SW weakness may symbolically reflect physical instability or relationship strain." },
  N:      { symbolic: "Kidney, fluid balance, opportunity", caution: "North blockage symbolically affects wealth and fluid energy in the body." },
  E:      { symbolic: "Liver, morning vitality, initiative", caution: "East blockage symbolically reduces morning energy and proactive drive." },
  S:      { symbolic: "Heart discipline, career pressure", caution: "South imbalance symbolically reflects emotional or social pressure." },
  W:      { symbolic: "Respiratory, creative capacity, gains", caution: "West weakness symbolically affects creative output and result gathering." },
  NW:     { symbolic: "Lungs, movement, nervous system", caution: "NW imbalance symbolically affects movement, breath and social ease." },
};
