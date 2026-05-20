import { NextRequest, NextResponse } from "next/server";
import { calculateTransitReport, type NatalChartForTransit, type TransitBase } from "@/lib/astro-engine/transits";
import { generateCombinedTransitPurchaseGuidance } from "@/lib/astro-engine/transit-purchase-combined";
import type { LalKitabPurchaseInput } from "@/lib/lal-kitab";

type RequestBody = {
  chart?: NatalChartForTransit;
  base?: TransitBase;
  date?: string;
  lalKitab?: Omit<LalKitabPurchaseInput, "transitHouses">;
};

const SAMPLE_CHART: NatalChartForTransit = {
  tz: 5.5,
  lagR: 0,
  planets: {
    Sun: { rashi: 4, house: 5, longitude: 132 },
    Moon: { rashi: 11, house: 12, longitude: 345 },
    Mars: { rashi: 2, house: 3, longitude: 74 },
    Mercury: { rashi: 5, house: 6, longitude: 164 },
    Jupiter: { rashi: 1, house: 2, longitude: 51 },
    Venus: { rashi: 6, house: 7, longitude: 184 },
    Saturn: { rashi: 9, house: 10, longitude: 294 },
    Rahu: { rashi: 7, house: 8, longitude: 218 },
    Ketu: { rashi: 1, house: 2, longitude: 38 },
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as RequestBody;
    const transitReport = calculateTransitReport({
      chart: body.chart ?? SAMPLE_CHART,
      base: body.base ?? "lagna",
      date: body.date ? new Date(body.date) : new Date(),
    });
    const result = generateCombinedTransitPurchaseGuidance({
      transitReport,
      lalKitab: body.lalKitab ?? {
        currentMahadasha: "Saturn",
        currentAntardasha: "Mercury",
        currentPratyantardasha: "Saturn",
        activePlanets: ["Saturn"],
      },
    });

    return NextResponse.json({
      engine: "Transit Purchase Guidance",
      version: "0.1.0",
      safety:
        "Combines standard Gochar transit timing with derived Lal Kitab object/gift caution. This is not Lal Kitab 35-sala chakra, varshphal, or monthly phal.",
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
