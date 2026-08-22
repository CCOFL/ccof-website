import type { MetadataRoute } from "next";
import { ORG } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /recall-check is an internal-use redirect (volunteer intake card QR).
      disallow: ["/api/", "/donate/thank-you", "/admin", "/recall-check"],
    },
    sitemap: `${ORG.url}/sitemap.xml`,
    host: ORG.url,
  };
}
