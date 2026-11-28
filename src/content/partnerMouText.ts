/**
 * The Partner Memorandum of Understanding, as rendered on
 * /partner-agreement/sign. Transcribed verbatim from
 * CCOF_Partner_MOU_Template_DRAFT_2026-11-19.docx (DRAFT v1).
 *
 * THIS IS THE DRAFT. It is pending Nason Yeager's review and board adoption
 * (December 11, 2026). When the approved text arrives, replace these
 * sections with it word for word and update PARTNER_MOU_VERSION in
 * src/lib/partnerMou.ts. Do not edit the legal wording to suit site copy
 * rules: scripts/check-copy.mjs exempts this file from the phrasing rules
 * that legal text legitimately trips ("free of charge", warranty language,
 * "grant applications"). Section 8's choices are collected by the form
 * below the text, and the signature block is replaced by that form.
 */
export type MouSection = {
  n: number;
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
};

export const MOU_TITLE = "Memorandum of Understanding";
export const MOU_SUBTITLE = "Partner Organization Agreement for Goods Support";

export const MOU_PREAMBLE =
  "This Memorandum of Understanding (\"MOU\") is entered into between The Children's Collective of Florida, Inc., a Florida nonprofit corporation and 501(c)(3) public charity, DBA \"The Collective Kids Closet,\" EIN 42-2020310, Florida Charitable Registration CH83131, 770 SE Indian St, Stuart, FL 34997 (\"CCOF\"), and the organization named below (\"Partner\").";

export const MOU_SECTIONS: readonly MouSection[] = [
  {
    n: 1,
    title: "Purpose",
    paragraphs: [
      "CCOF turns community generosity into clothing, essentials and dignity for local children in foster care, kinship homes and crisis. Partner serves children and families directly. This MOU sets out how CCOF provides goods to Partner at no charge, and what each organization commits to so that every item reaches a child safely, privately and as donors intended.",
    ],
  },
  {
    n: 2,
    title: "Service area",
    paragraphs: [
      "CCOF serves Martin County, extending our reach to neighboring communities. Requests for families outside this area are considered case by case and are not guaranteed. CCOF may decline any request that falls outside its service area or capacity.",
    ],
  },
  {
    n: 3,
    title: "How requests work",
    bullets: [
      "Partner submits requests through CCOF's online goods request form at childrenscollectivefl.org/request.",
      "Partner consolidates requests into one submission per week where possible.",
      "Each request lists, for each child, only age, gender, clothing size, shoe size and diaper or pull-up size where relevant, plus the city or county where the family lives.",
      "CCOF confirms what it can provide, any substitutions and a handoff date. Availability depends on donations and inventory and is never guaranteed.",
    ],
  },
  {
    n: 4,
    title: "Privacy and dignity",
    bullets: [
      "Partner will not send CCOF any child's or parent's name, address, phone number, date of birth, case number, photograph or other identifying information.",
      "Neither organization will photograph or publish images of children served, or of the other organization's facilities, without prior written permission.",
      "Goods are provided with dignity and free of charge. Neither organization will describe recipients in a way that identifies them or diminishes their dignity.",
    ],
  },
  {
    n: 5,
    title: "Handoffs and records",
    bullets: [
      "At every handoff, an authorized Partner representative signs CCOF's Goods Transfer Acknowledgment. Each organization keeps a signed copy.",
      "Partner will keep reasonable records of how goods were distributed and provide a summary on request, without identifying any family.",
      "CCOF may report transfers on its IRS Form 990 and to its donors, funders and gift-in-kind intermediaries.",
    ],
  },
  {
    n: 6,
    title: "Use of goods",
    bullets: [
      "Partner will distribute goods free of charge to the children and families it serves, consistent with its 501(c)(3) charitable purpose.",
      "Partner will not sell, trade, auction, raffle or transfer goods to another organization without CCOF's written permission.",
      "Goods marked as coming from a gift-in-kind intermediary or a designated donor drive carry the restrictions stated on the transfer form, and Partner will follow them.",
      "Partner will notify CCOF promptly if its tax-exempt status changes.",
    ],
  },
  {
    n: 7,
    title: "Safety",
    bullets: [
      "CCOF does not accept or pass along used cribs, bassinets, pack-and-plays, crib mattresses and bumpers, infant sleep products, car seats or bunk beds. Items in these categories are provided only when new and factory-sealed.",
      "Donated goods are provided as-is. Partner is responsible for checking goods against current CPSC recall notices and for deciding what is suitable to place with each family.",
    ],
  },
  {
    n: 8,
    title: "Public recognition (optional, mutual)",
    paragraphs: [
      "Each organization may tell the community about this partnership only as approved below. Approval can be withdrawn at any time by written notice, and the other organization will remove the reference within 30 days.",
      "Partner's choices are recorded in the form below.",
      "CCOF likewise approves Partner to name CCOF and use its logo, as supplied by CCOF, to describe this relationship. Neither organization will state or imply endorsement, sponsorship or a financial relationship beyond this MOU without written approval.",
    ],
  },
  {
    n: 9,
    title: "No exchange of value; independence",
    paragraphs: [
      "No payment, fee or other consideration is given or promised in either direction. Each organization is independent. Nothing in this MOU creates a joint venture, agency, employment or legal partnership, and neither may bind the other.",
    ],
  },
  {
    n: 10,
    title: "Limitation of responsibility",
    paragraphs: [
      "[ATTORNEY TO FINALIZE] CCOF makes no warranty as to the condition, safety, merchantability or fitness of donated goods. Partner accepts responsibility for distribution decisions and for its own staff, volunteers and programs. Each organization is responsible for its own acts and omissions.",
    ],
  },
  {
    n: 11,
    title: "Term and ending the MOU",
    paragraphs: [
      "This MOU begins on the effective date and runs for one year. It renews for additional one-year terms unless either organization gives written notice. Either organization may end it at any time with 30 days' written notice, or immediately if the other breaches Sections 4 or 6.",
    ],
  },
  {
    n: 12,
    title: "Contacts and notices",
    paragraphs: [
      "Notices go by email to the primary contacts above. CCOF's contact: Stephanie Haskins, Founder & President, stephanie@childrenscollectivefl.org, (772) 202-0554. General questions: info@childrenscollectivefl.org.",
    ],
  },
];

/** MOU Section 8 choices, verbatim from the agreement's table, in order. */
export const RECOGNITION_CHOICES = [
  {
    key: "recognizeName",
    label:
      "Name Partner on CCOF's website, social media, reports and grant applications as an organization CCOF supplies",
  },
  {
    key: "recognizeLogo",
    label: "Display Partner's logo (Partner to supply the file and any usage rules)",
  },
  {
    key: "recognizeWording",
    label:
      "Use this description of the relationship: \"We supply [Partner] with clothing and essentials for the children and families they serve.\"",
  },
] as const;

export type RecognitionKey = (typeof RECOGNITION_CHOICES)[number]["key"];
