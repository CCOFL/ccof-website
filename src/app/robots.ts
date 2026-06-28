import type { MetadataRoute } from "next";
import { ORG } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/donate/thank-you"],
    },
    sitemap: `${ORG.url}/sitemap.xml`,
    host: ORG.url,
  };
}
