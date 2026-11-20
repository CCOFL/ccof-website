/**
 * "Nonprofit partners we currently serve" (founder briefs 2026-11-16 and
 * 2026-11-19). Renders on /where-it-goes ONLY when this list has at least
 * one approved entry; with an empty list the section does not exist.
 *
 * THIS REPOSITORY IS PUBLIC. Anything typed here is readable by anyone,
 * even if it never renders. So this file holds ONLY partners who have
 * given a written yes (MOU Section 8, or a written reply to the consent
 * email). The tracker of organizations awaiting a reply lives in the
 * private ccof-internal repo, never here. Never list Good360, bin hosts,
 * bin locations, or anything about children.
 *
 * Founder ruling 2026-11-19: partners who consent in writing are the one
 * exception to standing ruling 1 (no partner names in public copy). The
 * rest of ruling 1 stands, and no partner COUNT appears anywhere.
 *
 * Each approval is granular: a partner may approve its name but not its
 * logo or the relationship wording. Record only what they approved.
 *
 * Adding a partner (one entry):
 *   {
 *     name: "Organization name exactly as they wrote it",
 *     approved: true,
 *     approvedOn: "2026-12-01",            // date of their written yes
 *     approvalSource: "MOU Section 8",     // or "Consent email reply"
 *     logo: { src: "/partners/file.svg", alt: "Organization name" }, // only if logo approved
 *     url: "https://example.org",          // only if they want a link
 *     programs: ["Program A", "Program B"], // programs we supply, if any
 *     wording: true,                        // only if they approved the sentence
 *   },
 */
export type ServedPartner = {
  name: string;
  /** Written yes on file. Entries without it never render. */
  approved: boolean;
  approvedOn: string;
  approvalSource: "MOU Section 8" | "Consent email reply";
  /** For a program listed as its own card: the "A program of …" line shown
   *  under the name, so the parent organization stays explicit (founder
   *  2026-11-20). */
  parentOrg?: string;
  /** Brief program description shown on the card (founder 2026-11-20),
   *  drawn from the partner's own public wording and confirmed by the
   *  partner in the screenshot-approval round. */
  description?: string;
  logo?: { src: string; alt: string; width?: number; height?: number };
  url?: string;
  /** Programs within the organization that we supply, listed under the
   *  name so the parent organization and each program show honestly (for
   *  example a shelter and an advocacy center run by one agency). */
  programs?: readonly string[];
  /** They approved: "We supply [name] with clothing and essentials for the
   *  children and families they serve." */
  wording?: boolean;
};

export const SERVED_PARTNERS: readonly ServedPartner[] = [
  {
    name: "Family Promise of Martin County",
    approved: true,
    approvedOn: "2026-11-20",
    approvalSource: "Consent email reply",
    logo: {
      src: "/partners/family-promise-of-martin-county.png",
      alt: "Family Promise of Martin County",
    },
    url: "https://mcfamilypromise.org",
  },
  {
    name: "Hannah's Home of South Florida",
    approved: true,
    approvedOn: "2026-11-20",
    approvalSource: "Consent email reply",
    logo: {
      src: "/partners/hannahs-home-of-south-florida.png",
      alt: "Hannah's Home of South Florida",
    },
    url: "https://hannahshomesf.org",
  },
  {
    name: "Hibiscus Children's Center",
    approved: true,
    approvedOn: "2026-11-20",
    approvalSource: "Consent email reply",
    logo: {
      src: "/partners/hibiscus-childrens-center.png",
      alt: "Hibiscus Children's Center",
    },
    url: "https://hibiscuschildrenscenter.org",
  },
  {
    name: "WaveCREST Shelter",
    approved: true,
    approvedOn: "2026-11-20",
    approvalSource: "Consent email reply",
    parentOrg: "A program of Children's Home Society of Florida",
    logo: {
      src: "/partners/childrens-home-society-of-florida.svg",
      alt: "Children's Home Society of Florida",
    },
    url: "https://chsfl.org/service/wavecrest-shelter/",
    description:
      "WaveCREST provides short-term emergency shelter for youth in crisis, offering safety, assessments, counseling, and basic necessities.",
  },
  {
    name: "Child Advocacy Center",
    approved: true,
    approvedOn: "2026-11-20",
    approvalSource: "Consent email reply",
    parentOrg: "A program of Children's Home Society of Florida",
    logo: {
      src: "/partners/childrens-home-society-of-florida.svg",
      alt: "Children's Home Society of Florida",
    },
    url: "https://chsfl.org/location/greater-treasure-coast/",
    description:
      "The Child Advocacy Center provides a safe, supportive environment where children who have experienced abuse or neglect can share their stories and begin healing. The center offers counseling, medical care, and crisis intervention in a child-friendly setting.",
  },
];

/** The month shown in "As of …". Update when the list changes. */
export const SERVED_PARTNERS_AS_OF = "November 2026";

export const SERVED_PARTNERS_COPY = {
  eyebrow: "Where it goes",
  title: "Nonprofit partners we currently serve",
  intro:
    "What our community gives is contributed to vetted 501(c)(3) organizations already caring for local children in foster care, kinship care, or crisis. These are the organizations we currently supply with clothing and essentials for the children and families they serve.",
} as const;

export function approvedPartners(): readonly ServedPartner[] {
  return SERVED_PARTNERS.filter((p) => p.approved);
}

export function relationshipSentence(name: string): string {
  return `We supply ${name} with clothing and essentials for the children and families they serve.`;
}
