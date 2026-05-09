import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { ChartData } from "./astro-engine/calculations";
import { calculateRemedies } from "./astro-engine/remedy";
import { calculateMedical } from "./astro-engine/medical";

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

  // Remedy Section (if requested)
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
    remedies.cards.slice(0, 5).forEach((card) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(10);
      pdf.setTextColor(200, 160, 48);
      pdf.text(`${card.planet} (${card.priority})`, 20, yPosition);

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
