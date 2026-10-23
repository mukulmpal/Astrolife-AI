"use client";

// Thin wrapper — re-exports AstroLoadingScreen with palm-specific defaults.
// The actual V1 Orbiting Grahas animation lives in @/components/AstroLoadingScreen.

import { AstroLoadingScreen } from "@/components/AstroLoadingScreen";

const PALM_STATUS = [
  "Tracing your heart line…",
  "Reading life line energy…",
  "Mapping your palm mounts…",
  "Analysing head line patterns…",
  "Detecting fate line signals…",
  "Reading sun & mercury lines…",
  "Computing finger proportions…",
  "Aligning with your birth chart…",
  "Generating palm intelligence…",
  "Inscribing the final manuscript…",
];

interface PalmLoadingScreenProps {
  visible: boolean;
  preview?: string | null;
}

export function PalmLoadingScreen({ visible, preview }: PalmLoadingScreenProps) {
  return (
    <AstroLoadingScreen
      visible={visible}
      title={"Scanning your\nPalm Lines"}
      subtitle="6 major lines · 8 mounts · 5 fingers"
      statusMessages={PALM_STATUS}
      statusIntervalMs={2400}
      thumbUrl={preview}
    />
  );
}
