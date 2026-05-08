import type { ChartData } from "./calculations";

const NAKSHATRA_DISEASE: Record<string, string> = {
  'Ashwini': 'Periodical fever', 'Bharani': 'Digestive infections', 'Krittika': 'Intestinal disease',
  'Rohini': 'Piles', 'Mrigashira': 'Indigestion', 'Ardra': 'Weak digestion', 'Punarvasu': 'Cholera',
  'Pushya': 'Appetite disorders', 'Ashlesha': 'Anemia', 'Magha': 'Respiratory disease',
  'Purva Phalguni': 'Cough', 'Uttara Phalguni': 'Skin disease', 'Hasta': 'Diabetes',
  'Chitra': 'Giddiness', 'Swati': 'Eye disease', 'Vishakha': 'Ear disease', 'Anuradha': 'Sinusitis',
  'Jyeshtha': 'Mouth disease', 'Mula': 'Tuberculosis', 'Purva Ashadha': 'Kidney stones',
  'Uttara Ashadha': 'Vomiting', 'Shravana': 'Weak digestion', 'Dhanishtha': 'Joint pain',
  'Shatabhisha': 'Pitta disorders', 'Purva Bhadrapada': 'Kapha disorders', 'Uttara Bhadrapada': 'Fatigue', 'Revati': 'Boils',
};

export interface HealthAlert {
  planet: string;
  house: number;
  disease: string;
  severity: "high" | "medium" | "low";
}

export interface MedicalResult {
  lagnaSign: string;
  birthNakshatra: string;
  nakshatraDisease: string;
  alerts: HealthAlert[];
  topConcerns: string[];
  accidentRisk: number;
}

export function calculateMedical(chart: ChartData): MedicalResult {
  const lagnaSign = chart.lagnaRashi;
  const birthNakshatra = chart.planets.Moon?.nakshatra || 'Unknown';
  const nakshatraDisease = NAKSHATRA_DISEASE[birthNakshatra] || 'None specific';
  
  const alerts: HealthAlert[] = [];
  const diseaseMap: Record<string, number> = {};
  
  ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].forEach((planet) => {
    const pd = chart.planets[planet];
    if (!pd) return;
    
    const severity = [6, 8, 12].includes(pd.house) ? 'high' : pd.house <= 3 ? 'medium' : 'low';
    const disease = `${planet} related concern in H${pd.house}`;
    
    alerts.push({ planet, house: pd.house, disease, severity });
    diseaseMap[disease] = (diseaseMap[disease] || 0) + (severity === 'high' ? 3 : severity === 'medium' ? 2 : 1);
  });
  
  let accidentRisk = 0;
  if (chart.planets.Mars && chart.planets.Rahu && chart.planets.Mars.house === chart.planets.Rahu.house) accidentRisk += 40;
  if (chart.planets.Mars && [8].includes(chart.planets.Mars.house)) accidentRisk += 30;
  
  const topConcerns = Object.entries(diseaseMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  
  return { lagnaSign, birthNakshatra, nakshatraDisease, alerts, topConcerns, accidentRisk: Math.min(accidentRisk, 95) };
}
