import { ORG } from "@/lib/site";

/**
 * Structured data for richer search/AI results. Emits two linked nodes:
 * - Organization (NGO) — the entity, using the full legal name.
 * - WebSite — carries the site's display `name` (+ `alternateName`), which is
 *   Google's primary signal for the site name shown next to the favicon in
 *   search results. Using ORG.name (no ", Inc.") keeps that label clean.
 */
export function JsonLd() {
  const org = {
    "@type": "NGO",
    "@id": `${ORG.url}#organization`,
    name: ORG.legalName,
    alternateName: ORG.abbr,
    url: ORG.url,
    logo: `${ORG.url}/brand/CCOF_Logo_v3_Stacked_1000.png`,
    email: ORG.email,
    slogan: ORG.tagline,
    description:
      "A Florida 501(c)(3) public charity channeling community generosity into practical support for children in foster care, kinship homes, and crisis.",
    nonprofitStatus: "Nonprofit501c3",
    taxID: ORG.ein,
    areaServed: { "@type": "State", name: "Florida" },
    address: {
      "@type": "PostalAddress",
      addressRegion: "FL",
      addressCountry: "US",
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${ORG.url}#website`,
    name: ORG.name,
    alternateName: ORG.abbr,
    url: ORG.url,
    publisher: { "@id": `${ORG.url}#organization` },
  };

  const data = { "@context": "https://schema.org", "@graph": [org, website] };

  return (
    <script
      type="application/ld+json"
      // Static, trusted content — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
