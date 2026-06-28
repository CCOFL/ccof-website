import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
