// src/lib/astro-engine/plot-geometry-dual-grid.ts
/**
 * AstroLife Plot Geometry & L-Shape Dual Grid Engine
 * 
 * Provides Shastric plot geometric decomposition for:
 * 1. Mild cut / extended plots (imaginary line squaring + single center)
 * 2. Severe L-Shape / T-Shape / U-Shape irregular plots requiring Dual-Grid (Block A & Block B)
 * 3. Ground energy decoupling with vertical brass strip (खड़ी पीतल की पत्ती - 3-4mm embedded)
 * 4. Micro-zone mapping and boundary recommendations
 */

export type PlotShapeCategory =
  | "regular_rectangle"
  | "regular_square"
  | "mild_cut"
  | "l_shape_dual_block"
  | "u_shape_tri_block"
  | "triangular_sharpmukhi"
  | "irregular_polygon";

export interface PlotDimensionInput {
  lengthFeet: number;
  widthFeet: number;
  cutLengthFeet?: number;
  cutWidthFeet?: number;
  cutLocation?: "NE" | "NW" | "SE" | "SW" | "NORTH" | "SOUTH" | "EAST" | "WEST";
  shapeCategory?: PlotShapeCategory;
}

export interface GridBlockSpecification {
  blockId: "BLOCK_A" | "BLOCK_B" | "BLOCK_C";
  titleHi: string;
  titleEn: string;
  widthFeet: number;
  lengthFeet: number;
  areaSqFt: number;
  areaPercentage: number;
  brahmasthanCoordinate: { xRatio: number; yRatio: number; label: string };
  recommendedUsageHi: string;
  recommendedUsageEn: string;
  zonesDominated: string[];
}

export interface BrassStripPartitionSpec {
  material: "Brass" | "Copper" | "Stainless Steel";
  materialHi: string;
  thicknessMm: number;
  depthMm: number;
  lengthFeet: number;
  placementOrientation: "VERTICAL_CUT_BOUNDARY" | "HORIZONTAL_CUT_BOUNDARY";
  shastricRuleHi: string;
  installationProtocolHi: string;
}

export interface DualGridAuditResult {
  shapeCategory: PlotShapeCategory;
  categoryTitleHi: string;
  categoryDescriptionHi: string;
  isDualGridRequired: boolean;
  totalAreaSqFt: number;
  blocks: GridBlockSpecification[];
  demarcationStrip: BrassStripPartitionSpec | null;
  squaringGuidelinesHi: string[];
  remediesForCutExtendedZonesHi: Array<{
    zone: string;
    type: "CUT" | "EXTENDED";
    defectDescriptionHi: string;
    lowCostCureHi: string;
  }>;
}

/**
 * Calculates Plot Geometry and Dual-Grid Decomposition
 */
export function calculatePlotDualGridDecomposition(
  input: PlotDimensionInput
): DualGridAuditResult {
  const length = Math.max(1, input.lengthFeet || 40);
  const width = Math.max(1, input.widthFeet || 30);
  const cutL = input.cutLengthFeet ? Math.max(0, input.cutLengthFeet) : 0;
  const cutW = input.cutWidthFeet ? Math.max(0, input.cutWidthFeet) : 0;
  const cutLocation = input.cutLocation || "NE";

  const totalBoundingArea = length * width;
  const cutArea = cutL * cutW;
  const cutAreaPercentage = totalBoundingArea > 0 ? (cutArea / totalBoundingArea) * 100 : 0;

  // Determine shape category if not strictly provided
  let determinedCategory: PlotShapeCategory = input.shapeCategory || "regular_rectangle";
  if (!input.shapeCategory) {
    if (cutAreaPercentage === 0) {
      determinedCategory = Math.abs(length - width) < 2 ? "regular_square" : "regular_rectangle";
    } else if (cutAreaPercentage > 0 && cutAreaPercentage < 15) {
      determinedCategory = "mild_cut";
    } else {
      determinedCategory = "l_shape_dual_block";
    }
  }

  // 1. Regular Square / Rectangle
  if (determinedCategory === "regular_square" || determinedCategory === "regular_rectangle") {
    return {
      shapeCategory: determinedCategory,
      categoryTitleHi: determinedCategory === "regular_square" ? "समचतुर्भुज (Square Plot)" : "आयताकार प्लॉट (Rectangular Plot)",
      categoryDescriptionHi: "प्लॉट पूर्णतः नियमित है। दोनों विकर्ण (Diagonals) को कोने-से-कोना मिलाकर एकल केंद्र (Brahmasthan) से 16 महावास्तु ज़ोन बनाएं।",
      isDualGridRequired: false,
      totalAreaSqFt: totalBoundingArea,
      blocks: [
        {
          blockId: "BLOCK_A",
          titleHi: "मुख्य वास्तु मंडल (Primary Mandala)",
          titleEn: "Primary Vastu Mandala",
          widthFeet: width,
          lengthFeet: length,
          areaSqFt: totalBoundingArea,
          areaPercentage: 100,
          brahmasthanCoordinate: { xRatio: 0.5, yRatio: 0.5, label: "Center 50% x 50%" },
          recommendedUsageHi: "संपूर्ण 16 ज़ोन का मानक विभाजन।",
          recommendedUsageEn: "Standard 16-zone division.",
          zonesDominated: ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "Brahmasthan"],
        },
      ],
      demarcationStrip: null,
      squaringGuidelinesHi: [
        "दोनों विकर्णों (Diagonals) का केंद्र बिंदु निकालकर 0° उत्तर (True North) से 16 ज़ोनों में 22.5° के कोण से विभाजित करें।",
        "किसी भी भू-ऊर्जा विभाजन पट्टी (Brass Strip) की आवश्यकता नहीं है।",
      ],
      remediesForCutExtendedZonesHi: [],
    };
  }

  // 2. Mild Cut Plot (Cut < 15% of total area)
  if (determinedCategory === "mild_cut") {
    const netArea = totalBoundingArea - cutArea;
    return {
      shapeCategory: "mild_cut",
      categoryTitleHi: "अल्प कट प्लॉट (Slightly Cut / Tilted Plot)",
      categoryDescriptionHi: `प्लॉट में मामूली कट (${cutAreaPercentage.toFixed(1)}%) है। इसे काल्पनिक रेखा (Imaginary Line) खींचकर वर्गाकार/आयताकार कर एकल केंद्र से ग्रिड करें।`,
      isDualGridRequired: false,
      totalAreaSqFt: netArea,
      blocks: [
        {
          blockId: "BLOCK_A",
          titleHi: "काल्पनिक पूर्ण ग्रिड (Imaginary Squaring Grid)",
          titleEn: "Imaginary Squaring Grid",
          widthFeet: width,
          lengthFeet: length,
          areaSqFt: totalBoundingArea,
          areaPercentage: 100,
          brahmasthanCoordinate: { xRatio: 0.5, yRatio: 0.5, label: "Bounding Center 50% x 50%" },
          recommendedUsageHi: "काल्पनिक रेखा से वर्ग बनाकर केंद्र निकालें। कटा हुआ कोना पूरक उपायों से सक्रिय करें।",
          recommendedUsageEn: "Square using imaginary line and derive single center.",
          zonesDominated: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
        },
      ],
      demarcationStrip: null,
      squaringGuidelinesHi: [
        "जितना भी कट है, वहां बाउंड्री से सीधी इमेजिनरी (काल्पनिक) रेखा लगाकर प्लॉट को पहले आयताकार या वर्गाकार करें।",
        "काल्पनिक आयत के दोनों विकर्णों (Corners) को मिलाकर सेंटर पॉइंट (Brahmasthan) बनाएं।",
        `जो एरिया कट में छूट गया है (${cutLocation} दिशा), उसे 'कट ज़ोन' मानकर वहां ऊर्जा पूरक उपाय (मिरर, पीला बल्ब, धातु तार) लगाएं।`,
      ],
      remediesForCutExtendedZonesHi: [
        {
          zone: cutLocation,
          type: "CUT",
          defectDescriptionHi: `${cutLocation} दिशा में कट होने से इस दिशा का प्राण ऊर्जा प्रवाह न्यून हो जाता है।`,
          lowCostCureHi: `कट वाली दीवार पर बड़ा समतल दर्पण (Mirror) लगाएं अथवा छत के कोने पर 24 घंटे जलने वाला 0-वाट का पीला/लाल बल्ब लगाएं ताकि ऊर्जा विस्तार हो सके।`,
        },
      ],
    };
  }

  // 3. L-Shape Dual-Grid Plot (Cut >= 15% or Explicit L-Shape)
  const isCutValid = cutL > 0 && cutW > 0 && cutL < length && cutW < width;
  const effectiveCutL = isCutValid ? cutL : Math.round(length * 0.45);
  const effectiveCutW = isCutValid ? cutW : Math.round(width * 0.45);

  // Divide into Block A and Block B
  // Block A: Main continuous rectangle
  const blockALength = length;
  const blockAWidth = width - effectiveCutW;
  const blockAArea = blockALength * blockAWidth;

  // Block B: Wing/arm rectangle
  const blockBLength = length - effectiveCutL;
  const blockBWidth = effectiveCutW;
  const blockBArea = blockBLength * blockBWidth;

  const totalPlotArea = blockAArea + blockBArea;
  const blockAPct = Math.round((blockAArea / totalPlotArea) * 100);
  const blockBPct = 100 - blockAPct;

  const demarcationLength = blockBLength;

  const demarcationStrip: BrassStripPartitionSpec = {
    material: "Brass",
    materialHi: "खड़ी पीतल की पत्ती (3-4 mm मोटाई)",
    thicknessMm: 3.5,
    depthMm: 12,
    lengthFeet: demarcationLength,
    placementOrientation: "VERTICAL_CUT_BOUNDARY",
    shastricRuleHi: "एल-शेप (L-Shape) में एकल केंद्र बनाने से ब्रह्मस्थान खाली जगह या गलत ज़ोन में गिर जाता है। अतः पीतल की खड़ी पत्ती फर्श में 12mm गहराई में स्थापित कर दोनों ब्लॉकों की भू-ऊर्जा (Earth Prana) को पृथक किया जाता है।",
    installationProtocolHi: `ब्लॉक A और ब्लॉक B के संधि स्थल पर ${demarcationLength} फीट लंबी 3 से 4 मिमी मोटाई की पीतल की पत्ती फर्श के अंदर खड़ी (Vertical) लगाएं। इसके बाद ब्लॉक A और ब्लॉक B को दो स्वतंत्र मकान मानकर 16-16 ज़ोन का पृथक ग्रिड बनाएं।`,
  };

  const blocks: GridBlockSpecification[] = [
    {
      blockId: "BLOCK_A",
      titleHi: "ब्लॉक A (प्रमुख आयत - Master Block)",
      titleEn: "Block A (Master Rectangle)",
      widthFeet: blockAWidth,
      lengthFeet: blockALength,
      areaSqFt: blockAArea,
      areaPercentage: blockAPct,
      brahmasthanCoordinate: { xRatio: 0.5, yRatio: 0.5, label: `Center of Block A (${blockAWidth}ft x ${blockALength}ft)` },
      recommendedUsageHi: "मास्टर बेडरूम, मुख्य बैठक, किचन, पूजा कक्ष। इसका अपना स्वतंत्र ब्रह्मस्थान और 16 ज़ोन होंगे।",
      recommendedUsageEn: "Master bedroom, living, pooja, kitchen with its own independent Brahmasthan.",
      zonesDominated: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    },
    {
      blockId: "BLOCK_B",
      titleHi: "ब्लॉक B (विस्तारित विंग - Secondary Wing)",
      titleEn: "Block B (Secondary Wing)",
      widthFeet: blockBWidth,
      lengthFeet: blockBLength,
      areaSqFt: blockBArea,
      areaPercentage: blockBPct,
      brahmasthanCoordinate: { xRatio: 0.5, yRatio: 0.5, label: `Center of Block B (${blockBWidth}ft x ${blockBLength}ft)` },
      recommendedUsageHi: "गेस्ट रूम, अध्ययन कक्ष, पार्किंग, लॉबी अथवा स्टोर। इसका भी स्वतंत्र ब्रह्मस्थान होगा।",
      recommendedUsageEn: "Guest room, study, parking, utility with independent Brahmasthan.",
      zonesDominated: ["N", "E", "S", "W", "NW", "SE"],
    },
  ];

  return {
    shapeCategory: "l_shape_dual_block",
    categoryTitleHi: "एल-आकार ड्यूल ग्रिड प्लॉट (L-Shape Dual Grid Division)",
    categoryDescriptionHi: "इस प्लॉट में कट बड़ा है जिससे केंद्र विकृत हो जाता है। शास्त्रीय नियम अनुसार इसे 'ब्लॉक A' और 'ब्लॉक B' में विभाजित कर फर्श में पीतल की पत्ती से अलग किया जाता है।",
    isDualGridRequired: true,
    totalAreaSqFt: totalPlotArea,
    blocks,
    demarcationStrip,
    squaringGuidelinesHi: [
      "एल-शेप के मोड़ पर जहां दोनों आयत मिलते हैं, वहां फर्श में 'खड़ी पीतल की पत्ती' (Brass Strip) 12-15mm गहराई में गाड़ें।",
      "पीतल की पत्ती स्थापित होते ही दोनों खंडों की भू-चुंबकीय ऊर्जा एक दूसरे से विलग (Decouple) हो जाती है।",
      "अब ब्लॉक A के चारों कोनों को मिलाकर सेंटर A निकालें और 16 ज़ोन बनाएं।",
      "पुनः ब्लॉक B के चारों कोनों को मिलाकर सेंटर B निकालें और इसका पृथक 16 ज़ोन ग्रिड तैयार करें।",
      "दोनों खंडों के बीच कभी भी विकर्ण या साझा ब्रह्मस्थान की गणना न करें।",
    ],
    remediesForCutExtendedZonesHi: [
      {
        zone: cutLocation,
        type: "CUT",
        defectDescriptionHi: `एल-कट के कारण छूटी हुई बाह्य भूमि (${cutLocation}) वास्तु दोष उत्पन्न कर सकती है।`,
        lowCostCureHi: "संधि स्थल पर पीतल की पत्ती लगाने के बाद यह दोष समाप्त हो जाता है, क्योंकि दोनों ब्लॉक अपने आप में पूर्ण आयताकार हो जाते हैं।",
      },
    ],
  };
}

