import { ORG } from "@/lib/site";

/** Organization (NGO) structured data for richer search/AI results. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: ORG.legalName,
    alternateName: ORG.abbr,
    url: ORG.url,
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
  return (
    <script
      type="application/ld+json"
      // Static, trusted content — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
