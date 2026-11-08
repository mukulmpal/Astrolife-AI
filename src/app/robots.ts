import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/reports",
          "/landing-a",
          "/landing-b",
          "/checkout",
          "/blog",
          "/privacy",
          "/terms",
          "/refund",
          "/contact",
          "/disclaimer",
        ],
        disallow: ["/api/", "/dashboard/admin", "/auth/"],
      },
    ],
    sitemap: "https://astrolife-ai.vercel.app/sitemap.xml",
  };
}
