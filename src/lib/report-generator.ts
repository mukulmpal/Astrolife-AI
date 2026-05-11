import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { ChartData } from "./astro-engine/calculations";
import { calculateRemedies } from "./astro-engine/remedy";
import { calculateMedical } from "./astro-engine/medical";
import { calculatePsychology } from "./astro-engine/psychology";
import { detectYogas } from "./astro-engine/yogas";
import { calculateShadbala } from "./astro-engine/shadbala";
import { calculateLalKitab } from "./astro-engine/lalkitab";
import { calculateTransitReport } from "./astro-engine/transits";

export interface ReportOptions {
  type: "full" | "kundli" | "remedy" | "medical" | "destiny";
  includeAnalysis?: boolean;
  resolution?: number;
}

export async function generatePDFReport(
  chart: ChartData,
  options: ReportOptions = { type: "full" }
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(200, 160, 48);
  pdf.text("AstroLife Birth Chart Report", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${chart.name} • ${chart.dob} • ${chart.city}`, pageWidth / 2, yPosition, { align: "center" });

  yPosition += 20;
  pdf.setDrawColor(200, 160, 48);
  pdf.line(15, yPosition, pageWidth - 15, yPosition);

  // Chart Info Section
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Birth Information", 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(10);
  const chartInfo = [
    `Birth Date: ${chart.dob}`,
    `Birth Time: ${chart.tob}`,
    `Birth City: ${chart.city}`,
    `Latitude: ${chart.lat}°N, Longitude: ${chart.lon}°E`,
    `Timezone: ${chart.tz > 0 ? "+" : ""}${chart.tz}`,
  ];

  chartInfo.forEach((info) => {
    pdf.text(info, 20, yPosition);
    yPosition += 7;
  });

  // Lagna Info
  yPosition += 5;
  pdf.setFontSize(14);
  pdf.text("Ascendant (Lagna)", 20, yPosition);
  yPosition += 8;
  pdf.setFontSize(11);
  pdf.text(`Sign: ${chart.lagnaRashi}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Degree: ${chart.lagnaLon.toFixed(2)}°`, 20, yPosition);

  // Planets Section
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.text("Planetary Positions (D-1 Chart)", 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);

  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const colWidth = pageWidth / 3 - 10;
  let col = 0;
  let row = 0;

  planets.forEach((planet, idx) => {
    const pd = chart.planets[planet];
    if (!pd) return;

    const xPos = 20 + col * colWidth;
    const yPos = yPosition + row * 15;

    pdf.setTextColor(0, 0, 0);
    pdf.text(`${planet}`, xPos, yPos);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${pd.sign} H${pd.house}`, xPos, yPos + 5);
    pdf.text(`${pd.nakshatra}`, xPos, yPos + 10);

    col++;
    if (col === 3) {
      col = 0;
      row++;
    }
  });

  yPosition += 60;

  // Yoga Section (Auspicious Combinations)
  if (options.type === "full") {
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(200, 160, 48);
    pdf.text("Yogas (Auspicious Combinations)", 20, yPosition);

    try {
      const yogas = detectYogas(chart.planets, chart.lagnaNum, "premium");
      if (yogas && yogas.length > 0) {
        yPosition += 12;
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

        yogas.slice(0, 15).forEach((yoga) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`• ${yoga.name}`, 25, yPosition);
          yPosition += 6;
        });
      } else {
        yPosition += 12;
        pdf.setFontSize(10);
        pdf.text("Analyzing yogas...", 20, yPosition);
      }
    } catch (e) {
      yPosition += 12;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Yoga analysis unavailable", 20, yPosition);
    }
  }

  // Psychology & Personality Section
  if (options.type === "full") {
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(200, 160, 48);
    pdf.text("Personality & Psychology Analysis", 20, yPosition);

    try {
      const psych = calculatePsychology(chart.planets);
      yPosition += 12;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      pdf.text(`Summary: ${psych.summary.substring(0, 70)}...`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Pattern: ${psych.pattern.name}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Description: ${psych.pattern.desc.substring(0, 60)}...`, 20, yPosition);
      yPosition += 15;

      pdf.text("Planetary Influences:", 20, yPosition);
      yPosition += 8;

      psych.planets.slice(0, 9).forEach((p) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFontSize(9);
        pdf.text(`• ${p.planet}: ${p.trait.substring(0, 50)}...`, 25, yPosition);
        yPosition += 6;
      });
    } catch (e) {
      yPosition += 12;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Psychology analysis unavailable", 20, yPosition);
    }
  }

  // Shadbala Analysis (Planetary Strengths)
  if (options.type === "full") {
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(200, 160, 48);
    pdf.text("Shadbala (Planetary Strengths)", 20, yPosition);

    try {
      const shadbala = calculateShadbala(chart.planets);
      yPosition += 12;
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);

      pdf.text(`Summary: ${shadbala.summary.substring(0, 70)}...`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Strongest: ${shadbala.strongest}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Weakest: ${shadbala.weakest}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Average Strength: ${shadbala.avgStrength.toFixed(2)}/6`, 20, yPosition);
      yPosition += 12;

      pdf.text("Individual Strengths:", 20, yPosition);
      yPosition += 8;

      shadbala.planets.slice(0, 9).forEach((p) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        const total = (p.sthanaBala + p.digBala + p.kalaBala + p.cheshtaBala) / 4;
        pdf.text(`• ${p.planet} (${p.sign}): ${total.toFixed(1)}/6`, 20, yPosition);
        yPosition += 6;
      });
    } catch (e) {
      yPosition += 12;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Shadbala analysis unavailable", 20, yPosition);
    }
  }

  // Lal Kitab Insights
  if (options.type === "full") {
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(200, 160, 48);
    pdf.text("Lal Kitab Predictions & Insights", 20, yPosition);

    try {
      const lalkitab = calculateLalKitab(chart.planets, chart.dob);
      yPosition += 12;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      pdf.text(`Summary: ${lalkitab.summary.substring(0, 70)}...`, 20, yPosition);
      yPosition += 10;

      if (lalkitab.planets && lalkitab.planets.length > 0) {
        pdf.text("Planetary Readings:", 20, yPosition);
        yPosition += 8;
        
        lalkitab.planets.slice(0, 9).forEach((p) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.setFontSize(9);
          pdf.text(`• ${p.planet} (H${p.house}): ${p.upaya.substring(0, 50)}...`, 25, yPosition);
          yPosition += 6;
        });
      } else {
        pdf.text("Lal Kitab analysis in progress...", 20, yPosition);
      }
    } catch (e) {
      yPosition += 12;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Lal Kitab analysis unavailable", 20, yPosition);
    }
  }
  if (options.type === "full" || options.type === "remedy") {
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(200, 160, 48);
    pdf.text("Remedy Engine Analysis", 20, yPosition);

    yPosition += 15;
    const remedies = calculateRemedies(chart);

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Urgent Remedies: ${remedies.urgentCount}`, 20, yPosition);

    yPosition += 12;
    remedies.cards.forEach((card, idx) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(10);
      pdf.setTextColor(200, 160, 48);
      pdf.text(`${idx + 1}. ${card.planet} (${card.priority})`, 20, yPosition);

      yPosition += 6;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gem: ${card.gem}`, 25, yPosition);
      yPosition += 5;
      pdf.text(`Mantra: ${card.mantra.substring(0, 50)}...`, 25, yPosition);
      yPosition += 5;
      pdf.text(`Donate: ${card.donate}`, 25, yPosition);
      yPosition += 10;
    });
  }

  // Medical Section (if requested)
  if (options.type === "full" || options.type === "medical") {
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(200, 160, 48);
    pdf.text("Medical Astrology Analysis", 20, yPosition);

    yPosition += 15;
    const medical = calculateMedical(chart);

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Birth Nakshatra: ${medical.birthNakshatra}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Disease Tendency: ${medical.nakshatraDisease}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Accident Risk: ${medical.accidentRisk}%`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Constitution: ${medical.lagnaSign}`, 20, yPosition);

    yPosition += 15;
    pdf.setFontSize(10);
    pdf.text("Top Health Concerns:", 20, yPosition);
    yPosition += 8;

    medical.topConcerns.forEach((concern) => {
      pdf.setFontSize(9);
      pdf.text(`• ${concern}`, 25, yPosition);
      yPosition += 6;
    });
  }

  // House Analysis Section
  if (options.type === "full") {
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(200, 160, 48);
    pdf.text("House Analysis (Bhavas)", 20, yPosition);

    yPosition += 12;
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    const houseMeanings: Record<number, string> = {
      1: "Self, Identity, Personality",
      2: "Wealth, Family, Speech",
      3: "Siblings, Communication, Short travels",
      4: "Home, Mother, Education, Property",
      5: "Children, Creativity, Romance",
      6: "Health, Service, Enemies",
      7: "Marriage, Partnership, Public image",
      8: "Longevity, Sudden gains, Inheritance",
      9: "Luck, Higher learning, Travel",
      10: "Career, Status, Father",
      11: "Gains, Friendships, Aspirations",
      12: "Losses, Spirituality, Foreign land"
    };

    Object.entries(houseMeanings).forEach(([house, meaning]) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`House ${house}: ${meaning}`, 20, yPosition);
      yPosition += 5;
    });
  }

  // Numerology Insights
  if (options.type === "full") {
    try {
      const { calculateNumerology } = await import("./astro-engine/numerology");
      pdf.addPage();
      yPosition = 20;

      pdf.setFontSize(14);
      pdf.setTextColor(200, 160, 48);
      pdf.text("Numerology Insights", 20, yPosition);

      yPosition += 12;
      const birthNumbers = calculateNumerology(chart.name, chart.dob);
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      if (birthNumbers.lifePath) {
        pdf.text(`Life Path: ${birthNumbers.lifePath.value} (${birthNumbers.lifePath.label})`, 20, yPosition);
        yPosition += 8;
      }
      if (birthNumbers.destiny) {
        pdf.text(`Destiny: ${birthNumbers.destiny.value} (${birthNumbers.destiny.label})`, 20, yPosition);
        yPosition += 8;
      }
      if (birthNumbers.soulUrge) {
        pdf.text(`Soul Urge: ${birthNumbers.soulUrge.value} (${birthNumbers.soulUrge.label})`, 20, yPosition);
        yPosition += 8;
      }
    } catch (e) {
      // Numerology optional
    }
  }

  // Transits Overview
  if (options.type === "full") {
    try {
      pdf.addPage();
      yPosition = 20;

      pdf.setFontSize(14);
      pdf.setTextColor(200, 160, 48);
      pdf.text("Current Transits Overview", 20, yPosition);

      yPosition += 12;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Transit analysis shows current planetary positions and their effects.", 20, yPosition);
      yPosition += 8;
      pdf.text("Check your dashboard for detailed transit predictions.", 20, yPosition);
      yPosition += 8;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Generated on: " + new Date().toLocaleDateString(), 20, yPosition);
    } catch (e) {
      // Optional
    }
  }

  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`AstroLife Report • Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  }

  return pdf.output("blob");
}

export async function downloadPDFReport(chart: ChartData, options: ReportOptions = { type: "full" }) {
  const blob = await generatePDFReport(chart, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${chart.name}-astrolife-report.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
