import type { MetadataRoute } from "next";
import { ORG } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/collective-kids-closet", priority: 0.8 },
    { path: "/partner", priority: 0.7 },
    { path: "/donate", priority: 0.9 },
    { path: "/where-it-goes", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/sources", priority: 0.4 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/donation-policy", priority: 0.4 },
  ];
  const lastModified = new Date("2026-06-28");
  return routes.map((r) => ({
    url: `${ORG.url}${r.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
