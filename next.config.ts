import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: false,
  serverExternalPackages: ["pdfkit", "puppeteer-core", "@sparticuz/chromium", "@sparticuz/chromium-min"],
  outputFileTracingIncludes: {
    "/api/generate-pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "/api/reports/generate-pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "/api/reports/send-email": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "api/generate-pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "api/reports/generate-pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "api/reports/send-email": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
  outputFileTracingExcludes: {
    "api/astro/rectify/pdf": [
      "./node_modules/@sparticuz/**",
      "./node_modules/puppeteer-core/**",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/dashboard/transit-ripple",
        destination: "/dashboard/transits/ripple",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/dashboard",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/dashboard/report/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
