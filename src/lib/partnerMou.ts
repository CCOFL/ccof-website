/**
 * Partner Memorandum of Understanding (MOU) flow: the switch, the version
 * label, and every string the flow renders outside the agreement itself.
 *
 * GATE (founder brief 2026-11-19): nothing MOU-related goes live until
 * (1) Nason Yeager has reviewed the MOU text and (2) the board has adopted
 * the template (meeting of December 11, 2026), and Stephanie confirms both.
 * Until then PARTNER_MOU_LIVE stays false: /partner-agreement and
 * /partner-agreement/sign return 404, the /partner-apply notice is hidden,
 * and /api/partner-mou refuses submissions.
 *
 * Netlify deploy previews (and local dev with MOU_PREVIEW=1) show the flow
 * so it can be reviewed; next.config.ts inlines NEXT_PUBLIC_MOU_PREVIEW at
 * build time from Netlify's CONTEXT. Production never sets it.
 *
 * To go live: replace src/content/partnerMouText.ts with the approved text,
 * update PARTNER_MOU_VERSION, set PARTNER_MOU_LIVE to true, one PR.
 */
export const PARTNER_MOU_LIVE = false;

/** Stored with every signature so each row records exactly what was signed. */
export const PARTNER_MOU_VERSION = "DRAFT v1, November 19, 2026";

export function isMouFlowEnabled(): boolean {
  return PARTNER_MOU_LIVE || process.env.NEXT_PUBLIC_MOU_PREVIEW === "1";
}

/** True while the text on screen is not the approved version. */
export function isMouDraft(): boolean {
  return !PARTNER_MOU_LIVE;
}

export const MOU_COPY = {
  applyNotice: {
    heading: "Before your first delivery",
    body: "Approved partners sign a short Memorandum of Understanding (MOU) before their first delivery. It covers how requests work, how we protect every family's privacy, and how goods may be used.",
    linkLabel: "Read the plain-language summary",
    href: "/partner-agreement",
  },
  summary: {
    eyebrow: "Partner With Us",
    title: "Our partner agreement, in plain language.",
    intro:
      "Every approved partner organization signs a short Memorandum of Understanding (MOU) before its first delivery. Here is what it says. Approved partners receive the full text with their welcome letter.",
    points: [
      {
        title: "Where we serve",
        body: "Serving Martin County, extending our reach to neighboring communities. Requests for families farther away are considered case by case.",
      },
      {
        title: "How requests work",
        body: "Send one combined request per week through our online goods request form. List only each child's age, gender and sizes, and the city or county where the family lives.",
      },
      {
        title: "Privacy and dignity",
        body: "Never send us a child's or parent's name, address, phone number, date of birth, case number or photo. Neither organization photographs or publishes images of the children served.",
      },
      {
        title: "Handoffs",
        body: "At each handoff, someone from your team signs our Goods Transfer Acknowledgment. Each of us keeps a copy.",
      },
      {
        title: "How goods are used",
        body: "Goods go to the children and families you serve as a gift. They are never sold, traded or raffled, or passed to another organization without our written permission.",
      },
      {
        title: "Safety",
        body: "We do not pass along used cribs, bassinets, pack-and-plays, crib mattresses and bumpers, infant sleep products, car seats or bunk beds. Your team decides what is right for each family and checks current recall notices.",
      },
      {
        title: "Recognition is your choice",
        body: "You decide whether we may name your organization, show your logo, and describe our relationship. You can change your mind anytime, and we remove it within 30 days.",
      },
      {
        title: "Independent organizations",
        body: "No payment changes hands in either direction, and each organization stays independent.",
      },
      {
        title: "One year at a time",
        body: "The agreement runs for one year and renews unless either of us says otherwise. Either organization can end it with 30 days' written notice.",
      },
    ],
    questions: "Questions about the agreement? Email info@childrenscollectivefl.org or call (772) 202-0554.",
  },
  sign: {
    eyebrow: "Partner Agreement",
    title: "Memorandum of Understanding",
    intro:
      "Please read the agreement below, then complete the form at the bottom to sign for your organization.",
    draftBanner:
      "DRAFT for review only. This text is pending attorney review and board adoption and is not for signature.",
    logoNote:
      "If you said yes to your logo, please email the file and any usage rules to info@childrenscollectivefl.org.",
    attestation:
      "I have read this Memorandum of Understanding. I am authorized to sign it for the organization named above, and I agree that typing my name on this form is my electronic signature.",
    successTitle: "Thank you. Your agreement is signed.",
    successBody:
      "We will countersign it and email you a copy for your records. Once it is on file, you can submit goods requests anytime.",
  },
} as const;
