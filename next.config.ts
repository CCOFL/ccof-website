import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Partner MOU flow review switch (src/lib/partnerMou.ts). Inlined at build
    // time: "1" only on Netlify deploy previews (CONTEXT is set by Netlify's
    // build) or locally with MOU_PREVIEW=1. Production builds get "", so the
    // flow stays off there until PARTNER_MOU_LIVE is set to true.
    NEXT_PUBLIC_MOU_PREVIEW:
      process.env.CONTEXT === "deploy-preview" || process.env.MOU_PREVIEW === "1"
        ? "1"
        : "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // 301s for legacy Wix URLs that may have been shared (brief priority #3).
    return [
      {
        source: "/copy-of-donate",
        destination: "/donate",
        permanent: true,
      },
      {
        source: "/donation-thank-you-page",
        destination: "/donate/thank-you",
        permanent: true,
      },
      {
        // No events are being carried over — retire these orphan pages.
        source: "/event-details/:slug*",
        destination: "/",
        permanent: true,
      },
      {
        // Stable QR address for the NEED NOW list (founder, 2026-10-27):
        // printed codes point here and never go stale if the section moves.
        source: "/needs",
        destination: "/give-goods#need-now",
        permanent: false,
      },
      {
        // Stable address for the partner Goods Request Google Form (founder
        // brief 2026-10-21). 307 on purpose: the destination changes if the
        // form is ever replaced. Canonical /d/e/ respondent URL rather than
        // the editor-derived /d/<id>/viewform, skipping Google's extra hop.
        source: "/request",
        destination:
          "https://docs.google.com/forms/d/e/1FAIpQLSc_x4MjtUECrMW3T3hYxQyzHpFYXwxBzmEJDQT3l3rdPoNcSA/viewform",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
