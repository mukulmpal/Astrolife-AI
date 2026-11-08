import type { MetadataRoute } from "next";
import { SEO_LANDING_PAGES } from "@/lib/report-seo-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://astrolife-ai.vercel.app";
  const now = new Date();

  const programmaticReportPages = Object.keys(SEO_LANDING_PAGES).map((slug) => ({
    url: `${baseUrl}/reports/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    ...programmaticReportPages,
    {
      url: `${baseUrl}/landing-a`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/landing-b`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
