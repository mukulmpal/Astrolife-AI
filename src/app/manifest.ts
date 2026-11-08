import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AstroLife AI — Sacred Vedic Astrology",
    short_name: "AstroLife",
    description: "Precision Vedic astrology, instant Kundli generation, planetary dashas, and classical remedies.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#080811",
    theme_color: "#080811",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["lifestyle", "utilities"],
    shortcuts: [
      {
        name: "My Kundli Chart",
        url: "/dashboard/kundli",
        description: "View your full Vedic birth chart",
      },
      {
        name: "Dossiers & Reports",
        url: "/reports",
        description: "Specialized mathematical life dossiers",
      },
      {
        name: "Saved History Vault",
        url: "/dashboard/history",
        description: "Access your charts and purchased reports",
      },
    ],
  };
}
