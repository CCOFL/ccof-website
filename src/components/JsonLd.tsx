import { ORG } from "@/lib/site";

/**
 * Structured data for richer search/AI results. Emits two linked nodes:
 * - Organization (NGO) — the entity, using the full legal name. Facts come
 *   from CCOF_Public_Facts_Sheet_2026-10-14 (the single source for machine-
 *   read profiles); registration identifiers let search/AI systems confirm a
 *   real, registered charity.
 * - WebSite — carries the site's display `name` (+ `alternateName`), which is
 *   Google's primary signal for the site name shown next to the favicon in
 *   search results. Using ORG.name (no ", Inc.") keeps that label clean.
 *
 * areaServed is Martin County alone, matching the identity line (never a
 * county list; "extending our reach" has no schema expression). Candid's
 * broader service area is intentional and is never reconciled to this.
 * No openingHours anywhere: donated goods move by scheduled pickup only.
 */
export function JsonLd() {
  const org = {
    "@type": "NGO",
    "@id": `${ORG.url}#organization`,
    name: ORG.legalName,
    alternateName: [ORG.abbr, ORG.dba],
    url: ORG.url,
    logo: `${ORG.url}/brand/CCOF_Logo_v4_Stacked_1000.png`,
    email: ORG.email,
    telephone: "+1-772-202-0554",
    slogan: ORG.tagline,
    // One-line description, verbatim from the facts sheet.
    description:
      "A Florida 501(c)(3) turning community generosity into clothing, essentials and dignity for local children in foster care, kinship homes and crisis.",
    nonprofitStatus: "Nonprofit501c3",
    taxID: ORG.ein,
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "FL Document No.",
        value: ORG.flDoc,
      },
      {
        "@type": "PropertyValue",
        propertyID: "FDACS Charitable Registration",
        value: ORG.flReg,
      },
    ],
    sameAs: [ORG.candidProfile],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Martin County, Florida",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.streetAddress,
      addressLocality: "Stuart",
      addressRegion: "FL",
      postalCode: "34997",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Donation pickup scheduling",
      telephone: "+1-772-202-0554",
      email: ORG.email,
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
