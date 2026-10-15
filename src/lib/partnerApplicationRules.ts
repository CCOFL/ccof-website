/**
 * Pure validation rules for the partner application (/partner-apply).
 *
 * Shared by the client form AND the API route so the two can never drift,
 * and unit-tested via `npm test` (node --test, zero dependencies). Keep this
 * module free of "@/" imports and React: the node test runner resolves only
 * plain relative paths, and the API route imports it server-side.
 *
 * Error messages are user-facing: plain and kind, per the form brief.
 */

export type PartnerApplicationValues = {
  orgLegalName: string;
  ein: string;
  /** "registered" | "exempt"; empty until the applicant chooses. */
  fdacsStatus: string;
  fdacsReg: string;
  fdacsExemptionBasis: string;
  sunbizDoc: string;
  irsLetterUrl: string;
  website: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  mission: string;
  counties: string;
  referralSources: string;
  contactName: string;
  contactTitle: string;
  email: string;
  needs: string;
  volumeEstimate: string;
  goodsDirectAck: boolean;
  childPrivacyAck: boolean;
  /** "yes" | "no"; empty until the applicant answers. */
  relatedParty: string;
  relatedPartyDetail: string;
  signerName: string;
  signerTitle: string;
  signerDate: string;
  vettingAck: boolean;
  publicityPreference: string;
  mediaContactName: string;
  mediaContactEmail: string;
};

export type PartnerApplicationErrors = Partial<
  Record<keyof PartnerApplicationValues, string>
>;

export const PUBLICITY_PREFS: readonly string[] = [
  "may_name",
  "may_name_with_review",
  "do_not_name",
];

export function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** EIN: 9 digits, with or without the XX-XXXXXXX hyphen. */
export function isEin(v: string) {
  return /^\d{2}-?\d{7}$/.test(v);
}

/** US phone: 10 digits in any format (a leading 1 is tolerated). */
export function isPhone(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

export function isZip(v: string) {
  return /^\d{5}(-\d{4})?$/.test(v);
}

/**
 * A shareable link: a dotted host with no spaces; the http(s) scheme is
 * optional because people paste "drive.google.com/..." straight from the
 * address bar, which is exactly what the field's hint invites.
 */
export function isLink(v: string) {
  // An explicit scheme must be http(s); ftp:// and friends are not links
  // a reviewer can open in a browser.
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(v) && !/^https?:\/\//i.test(v)) {
    return false;
  }
  return /^(https?:\/\/)?\S+\.\S+$/i.test(v);
}

/** YYYY-MM-DD, as the native date input submits (guards the date column). */
export function isIsoDate(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
}

/**
 * Blank out fields that belong to a branch the applicant did not choose, so
 * a value typed before switching branches is never validated or stored:
 * the FDACS pair, the related-party detail, and the media contact under
 * do_not_name. Client and API both run this, keeping the two identical.
 */
export function normalizePartnerApplication(
  v: PartnerApplicationValues,
): PartnerApplicationValues {
  const mayName = mayNamePublicly(v.publicityPreference);
  return {
    ...v,
    fdacsReg: v.fdacsStatus === "registered" ? v.fdacsReg : "",
    fdacsExemptionBasis: v.fdacsStatus === "exempt" ? v.fdacsExemptionBasis : "",
    relatedPartyDetail: v.relatedParty === "yes" ? v.relatedPartyDetail : "",
    mediaContactName: mayName ? v.mediaContactName : "",
    mediaContactEmail: mayName ? v.mediaContactEmail : "",
  };
}

export function mayNamePublicly(pref: string) {
  return pref === "may_name" || pref === "may_name_with_review";
}

/**
 * Field order for the focus-first-error jump; keys whose rendered control
 * carries a different DOM id are mapped in the component.
 */
export const FIELD_ORDER: (keyof PartnerApplicationValues)[] = [
  "orgLegalName",
  "ein",
  "fdacsStatus",
  "fdacsReg",
  "fdacsExemptionBasis",
  "irsLetterUrl",
  "streetAddress",
  "city",
  "state",
  "zip",
  "phone",
  "mission",
  "counties",
  "referralSources",
  "contactName",
  "contactTitle",
  "email",
  "needs",
  "volumeEstimate",
  "publicityPreference",
  "mediaContactName",
  "mediaContactEmail",
  "goodsDirectAck",
  "childPrivacyAck",
  "vettingAck",
  "relatedParty",
  "relatedPartyDetail",
  "signerName",
  "signerTitle",
  "signerDate",
];

export function validatePartnerApplication(
  v: PartnerApplicationValues,
): PartnerApplicationErrors {
  const e: PartnerApplicationErrors = {};

  if (!v.orgLegalName.trim())
    e.orgLegalName = "The legal name from your IRS determination letter.";
  if (!v.ein.trim()) e.ein = "Your EIN helps us verify you.";
  else if (!isEin(v.ein.trim()))
    e.ein = "EIN format is XX-XXXXXXX (nine digits).";

  if (v.fdacsStatus !== "registered" && v.fdacsStatus !== "exempt")
    e.fdacsStatus =
      "Please tell us how your organization stands with Florida charitable registration.";
  else if (v.fdacsStatus === "registered" && !v.fdacsReg.trim())
    e.fdacsReg = "Your FDACS registration number.";
  else if (v.fdacsStatus === "exempt" && !v.fdacsExemptionBasis.trim())
    e.fdacsExemptionBasis = "A sentence on the basis for your exemption.";

  if (v.irsLetterUrl.trim() && !isLink(v.irsLetterUrl.trim()))
    e.irsLetterUrl =
      "That link doesn't look right. A shared drive link is fine.";

  if (!v.streetAddress.trim())
    e.streetAddress = "Your organization's street address.";
  if (!v.city.trim()) e.city = "City.";
  if (!v.state.trim()) e.state = "State.";
  if (!v.zip.trim()) e.zip = "ZIP code.";
  else if (!isZip(v.zip.trim())) e.zip = "ZIP format is 12345 or 12345-6789.";
  if (!v.phone.trim()) e.phone = "A phone number helps us verify faster.";
  else if (!isPhone(v.phone)) e.phone = "A 10-digit phone number, any format.";

  if (!v.mission.trim()) e.mission = "A sentence or two about who you serve.";
  if (!v.counties.trim()) e.counties = "Which Florida counties do you serve?";
  if (!v.referralSources.trim())
    e.referralSources = "How children are identified and referred to you.";
  if (!v.contactName.trim()) e.contactName = "A contact name.";
  if (!v.contactTitle.trim())
    e.contactTitle = "Your role at the organization.";
  if (!v.email.trim()) e.email = "An email lets us reply.";
  else if (!isValidEmail(v.email)) e.email = "That email doesn't look right.";
  if (!v.needs.trim())
    e.needs = "Tell us how goods would reach kids through your work.";

  if (!v.goodsDirectAck)
    e.goodsDirectAck = "Please confirm how donated goods will be used.";
  if (!v.childPrivacyAck)
    e.childPrivacyAck = "Please confirm the child-privacy standard.";

  if (v.relatedParty !== "yes" && v.relatedParty !== "no")
    e.relatedParty = "Please answer the related-party question.";
  else if (v.relatedParty === "yes" && !v.relatedPartyDetail.trim())
    e.relatedPartyDetail = "A short description of the relationship.";

  if (!v.signerName.trim())
    e.signerName = "The authorized signer's full name.";
  if (!v.signerTitle.trim()) e.signerTitle = "The signer's title.";
  if (!v.signerDate.trim()) e.signerDate = "Today's date.";
  else if (!isIsoDate(v.signerDate.trim()))
    e.signerDate = "Date format is YYYY-MM-DD.";
  if (!v.vettingAck) e.vettingAck = "Please acknowledge the verification step.";

  if (!PUBLICITY_PREFS.includes(v.publicityPreference)) {
    e.publicityPreference =
      "Please choose how we may recognize your organization.";
  } else if (mayNamePublicly(v.publicityPreference)) {
    if (!v.mediaContactName.trim())
      e.mediaContactName = "Who should we reach about media materials?";
    if (!v.mediaContactEmail.trim())
      e.mediaContactEmail = "An email for media questions.";
    else if (!isValidEmail(v.mediaContactEmail))
      e.mediaContactEmail = "That email doesn't look right.";
  } else if (v.mediaContactEmail.trim() && !isValidEmail(v.mediaContactEmail)) {
    e.mediaContactEmail = "That email doesn't look right.";
  }

  return e;
}
