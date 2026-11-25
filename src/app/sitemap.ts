import type { MetadataRoute } from "next";
import { ORG } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Every indexable page belongs here. Pages that are deliberately noindex
  // or robots-disallowed (admin, donate/thank-you, recall-check,
  // 30-days-of-giving) stay out.
  const routes = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/impact", priority: 0.7 },
    { path: "/fill-a-duffel", priority: 0.7 },
    { path: "/newsletter", priority: 0.6 },
    { path: "/collective-kids-closet", priority: 0.8 },
    { path: "/partner", priority: 0.7 },
    { path: "/partner-apply", priority: 0.6 },
    { path: "/partner-nonprofits", priority: 0.6 },
    { path: "/donate", priority: 0.9 },
    { path: "/give-goods", priority: 0.9 },
    { path: "/pickup", priority: 0.6 },
    { path: "/host-a-bin", priority: 0.6 },
    { path: "/volunteer", priority: 0.5 },
    { path: "/donated", priority: 0.4 },
    { path: "/where-it-goes", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/sources", priority: 0.4 },
    { path: "/registration", priority: 0.4 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/donation-policy", priority: 0.4 },
  ];
  // No lastModified on purpose: a hand-set date goes stale (it sat at
  // 2026-06-28 for months) and a build-time date would claim every page
  // changed on every deploy. Google only trusts lastmod when it is accurate.
  return routes.map((r) => ({
    url: `${ORG.url}${r.path}`,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
