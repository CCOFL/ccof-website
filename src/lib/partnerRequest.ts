/**
 * THE one source of truth for the Partner Goods Request, across its three
 * surfaces: the live Google Form behind /request, the /partner-nonprofits
 * page, and the printable PDF at /forms/partner-goods-request.pdf.
 *
 * Founder brief 2026-11-01 (Task 0): these facts must read the same
 * everywhere. The site renders from this module, and the PDF build script
 * (scripts/build-goods-request-pdf.ts) imports it, so neither can drift.
 * The Google Form is compared against docs/partner-request-parity.md,
 * which the same script generates from FORM_QUESTIONS below.
 *
 * Wordings here are the POST-Task-3 Google Form wordings (the founder's
 * approved form edits of 11/01), with her same-day parity rulings applied:
 * hygiene sentence mirrors the form verbatim; the PDF carries an
 * eligibility line; the site privacy note gains "gender"; the site gains
 * the one-business-day response promise.
 *
 * Never the bare acronym in any rendered string (canonical naming rule,
 * 2026-09-03): "The Children's Collective of Florida" or
 * "The Children's Collective".
 */

export const GOODS_REQUEST = {
  /** PDF document title + the Google Form's title (Task 3 edit #0). */
  pdfTitle: "Partner Goods Request",
  pdfSubtitle: "Printable and fillable copy for partner organizations",
  formTitle: "Children's Collective Partner Goods Request",

  /** How to submit (PDF page 1 panel; founder spec verbatim). */
  submit: {
    onlinePrefix: "Fastest: submit online at ",
    onlineDisplay: "childrenscollectivefl.org/request",
    onlineUrl: "https://childrenscollectivefl.org/request",
    emailPrefix:
      "Prefer to email? Fill in this form on screen or print it, then please email it to ",
    emailDisplay: "info@childrenscollectiveFL.org",
    emailMailto: "mailto:info@childrenscollectivefl.org",
    responseLine:
      "We contact you within one business day to confirm your request and schedule delivery. Questions: (772) 202-0554.",
    eligibilityPrefix:
      "For Children's Collective partner organizations only. Not yet a partner? Apply first at ",
    eligibilityDisplay: "childrenscollectivefl.org/partner-apply",
    applyUrl: "https://childrenscollectivefl.org/partner-apply",
  },

  /** Site line under the Request goods button (founder ruling 11/01). */
  responsePromise:
    "We contact you within one business day to confirm your request and schedule delivery.",

  /** Privacy: short site line (ruling 11/01) + the PDF's expanded panel. */
  privacyLine:
    "Describe children by age, gender and size only. Never a name or identifying detail.",
  privacyPanelHeading: "Privacy: describe children by age, gender and size only.",
  privacyPanelBody:
    "Never include a name, date of birth, address, photo, diagnosis, or any detail that could identify a child or family.",

  /** The duffel standard as the site states it (renders on /partner-nonprofits). */
  duffelStandard:
    "Every request is filled as a standard duffel bag: 4 tops, 4 bottoms, pajamas, gently used shoes, new socks, new underwear, and a special toy or book.",

  /** Item categories helper, mirroring the post-edit form verbatim
      (hygiene sentence kept form-verbatim per founder ruling 11/01). */
  categoriesHelper:
    "Every Children's Collective duffel bag includes 4 tops, 4 bottoms, pajamas, gently used shoes, new socks, new underwear, and a special toy or book. We substitute one pack of pull-ups or diapers for underwear when needed. Hygiene products vary with inventory and supply at the time of the request.",

  /** Checkbox options. The "other" parenthetical adapts per surface:
      the form points at its child-details paragraph, the paper form at
      its notes boxes (approved structural variance, 11/01). */
  categories: [
    "Standard duffel bag",
    "Pull-ups or diapers in place of underwear",
    "Hygiene products, as available",
    "Specific items only (not a full bag)",
  ],
  otherOptionForm: "Other needs (describe in the child details below)",
  otherOptionPdf: "Other needs (describe in the notes below)",

  /** Urgency tiers, form-verbatim. */
  urgency: [
    "Emergency: needed within 48 hours",
    "Needed this week",
    "Standard: within 2 weeks",
    "Bulk request: building your location's supply or another large need",
  ],

  /** Who is this request for, form-verbatim. */
  whoFor: [
    "Children in our care",
    "A caregiver or family our team supports (kinship, foster, adoptive, reunifying, or crisis), including families referred to us by another organization",
  ],

  /** Delivery options, POST-Task-3 wording (no implied public location). */
  delivery: [
    "The Children's Collective delivers to our office",
    "We will pick up (we'll arrange a time and place with you)",
  ],

  /** Confirmation checkboxes, form-verbatim. */
  confirmations: [
    "This request contains no names or identifying details about any child or family.",
    "This request is approved by my organization, and items will go to the children or caregivers we serve.",
  ],

  /** Helpers mirrored from the live form. */
  approvedByHelper:
    "The supervisor or program lead at your organization who approved this request. Enter your own name if you are the approver.",
  childCountHelper:
    "How many children will receive items from this request? This is for this request only, not your total number of children in care. For a caregiver request, count the children in the households it will serve.",
  bulkHelper:
    "Only if you chose Bulk request above. A few sentences is plenty, for example what you are stocking and roughly how many children or sizes. Our team will reach out to talk through details.",

  /** Child-details helper, POST-Task-3 (fit sentence + new examples). */
  childDetailsHelper:
    "List each child on its own line, then add any special requests or restrictions (substitutions that are OK, preferences, special needs). Please do not include names. If you know it, include fit as you'd see it on a store label: slim/petite, regular, plus/husky, or tall. Example:\nChild 1: girl, age 7, clothing size 8 (slim fit), shoe size 2. Prefers leggings.\nChild 2: boy, age 14, men's M (husky fit), shoe size 9. Substitutions OK.\n\nNeed something beyond the standard bag, such as a coat or a car seat? Tell us here.",

  /** Paper child blocks (PDF only; the form takes the paragraph above). */
  childBlock: {
    count: 5,
    fields: ["Age", "Gender", "Tops", "Bottoms", "Shoes", "Underwear / diaper size", "Pajamas"],
    fitLine: "Choose the fit you'd look for on a store label.",
    fitOptions: ["Regular", "Slim or Petite", "Plus or Husky", "Tall or Long", "Not sure"],
    notesLabel:
      "Items needed and anything that helps us pack well (shoe width, tagless or soft fabrics, favorite color, uniform colors, substitutions OK).",
    moreLine: "More than five children? Attach a second copy of this page.",
  },

  /** Footer, every PDF page (founder spec verbatim). */
  footer: {
    orgLine:
      "The Children's Collective of Florida, Inc.  |  501(c)(3) public charity  |  EIN 42-2020310  |  FL Charitable Registration #CH83131",
    custodyLine:
      "Goods are contributed to partner organizations, which deliver them to the children and caregivers they serve.",
    rev: "Rev. 11/2026",
  },

  /** The post-edit Google Form confirmation message (Task 3.6), kept here
      so the parity checklist always shows the approved target text. */
  formConfirmation:
    "Thank you. Your request has been received. The Children's Collective of Florida will contact you within one business day to confirm this request and to schedule delivery. A copy of your responses is on its way to your email. Prefer to email? Please email info@childrenscollectiveFL.org.",
} as const;

/**
 * Every question the Google Form must carry, in order, with wording and
 * required flags (the parity checklist is generated from this).
 * pdfOnly rows exist on paper but not on the form.
 */
export const FORM_QUESTIONS = [
  { q: "Your email", type: "Short answer (the form's collect-email setting)", required: true },
  { q: "Requesting organization name", type: "Short answer", required: true },
  { q: "Your name and title", type: "Short answer", required: true },
  { q: "Your phone", type: "Short answer", required: true },
  { q: "Approved by (name and title)", type: "Short answer", required: false, helper: GOODS_REQUEST.approvedByHelper },
  { q: "Date of request", type: "Short answer", required: true, pdfOnly: true },
  { q: "Who is this request for?", type: "Multiple choice", required: true, options: GOODS_REQUEST.whoFor },
  { q: "How urgent is this request?", type: "Multiple choice", required: true, options: GOODS_REQUEST.urgency },
  { q: "Number of children this request serves", type: "Short answer", required: true, helper: GOODS_REQUEST.childCountHelper },
  { q: "Item categories", type: "Checkboxes", required: true, helper: GOODS_REQUEST.categoriesHelper, options: [...GOODS_REQUEST.categories, GOODS_REQUEST.otherOptionForm] },
  { q: "Child details: gender, age, clothing size, shoe size, special requests or restrictions", type: "Paragraph", required: true, helper: GOODS_REQUEST.childDetailsHelper },
  { q: "Bulk request only: briefly describe what you need", type: "Paragraph", required: false, helper: GOODS_REQUEST.bulkHelper },
  { q: "Delivery or pickup", type: "Multiple choice", required: true, options: GOODS_REQUEST.delivery },
  { q: "Delivery address (your office, not a family's home)", type: "Paragraph", required: false },
  { q: "On-site contact and best delivery times", type: "Short answer", required: false },
  { q: "Delivery instructions (check-in, parking, visitor requirements)", type: "Paragraph", required: false },
  { q: "Please confirm", type: "Checkboxes", required: true, options: GOODS_REQUEST.confirmations },
] as const;
