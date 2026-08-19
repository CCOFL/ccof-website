import { getSupabase, isSupabaseConfigured } from "./supabase";
import { sendNotification, sendEmailTo, isEmailConfigured } from "./email";
import { ORG, FL_DISCLOSURE, FL_REG_LINE } from "./site";

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  intent: string;
  message: string;
};

/**
 * Persist a contact/volunteer/partner submission to Supabase (the source of
 * truth). If Resend is also configured, send an inbox notification too. Falls
 * back to a server log when nothing is configured, so the form always succeeds
 * in dev. Throws only on a real, configured-backend failure.
 */
export async function saveContactSubmission(sub: ContactSubmission) {
  let stored = false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase!.from("contact_submissions").insert({
      name: sub.name,
      email: sub.email,
      phone: sub.phone || null,
      intent: sub.intent,
      message: sub.message,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Website contact · ${sub.intent} · ${sub.name}`,
      replyTo: sub.email,
      text: [
        `New contact form submission`,
        `Intent: ${sub.intent}`,
        `Name: ${sub.name}`,
        `Email: ${sub.email}`,
        `Phone: ${sub.phone || "(not provided)"}`,
        ``,
        sub.message,
      ].join("\n"),
    });
    stored = true;
  }

  if (!stored) {
    console.warn(
      `[forms] No storage configured — contact submission logged only:\n${JSON.stringify(
        sub,
        null,
        2,
      )}`,
    );
  }
  return { stored };
}

export type PartnerRequest = {
  orgName: string;
  contactName: string;
  email: string;
  phone?: string;
  is501c3: boolean;
  childDetails?: string;
  goodsNeeded: string;
  urgency: string;
  fulfillmentPref?: string;
  message?: string;
};

/**
 * Persist a partner goods request (the direct, in-kind provision channel) to
 * Supabase, and notify the inbox if Resend is configured. Mirrors
 * saveContactSubmission, with one addition: if the `partner_requests` table
 * doesn't exist yet (migration 0004 not run — Postgres error 42P01), we degrade
 * to the log/notify path instead of throwing, so the form keeps working on a
 * fresh deploy before the table is created.
 */
export async function savePartnerRequest(req: PartnerRequest) {
  let stored = false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase!.from("partner_requests").insert({
      org_name: req.orgName,
      contact_name: req.contactName,
      email: req.email,
      phone: req.phone || null,
      is_501c3: req.is501c3,
      child_details: req.childDetails || null,
      goods_needed: req.goodsNeeded,
      urgency: req.urgency,
      fulfillment_pref: req.fulfillmentPref || null,
      message: req.message || null,
    });
    // Migration 0004 not run yet → the table is missing. Postgres reports this
    // as 42P01 (undefined_table); PostgREST reports PGRST205 ("not in the schema
    // cache"). Treat either as a soft miss and fall through to the notify/log
    // path rather than failing the submission.
    const missingTable =
      error?.code === "42P01" ||
      error?.code === "PGRST205" ||
      /schema cache|could not find the table|does not exist/i.test(
        error?.message ?? "",
      );
    if (error && !missingTable) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    if (!error) stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Partner request · ${req.orgName} · ${req.urgency}`,
      replyTo: req.email,
      text: [
        `New partner goods request`,
        `Organization: ${req.orgName}`,
        `501(c)(3) attested: ${req.is501c3 ? "yes" : "no / not confirmed"}`,
        `Contact: ${req.contactName}`,
        `Email: ${req.email}`,
        `Phone: ${req.phone || "(not provided)"}`,
        `Urgency: ${req.urgency}`,
        `Fulfillment preference: ${req.fulfillmentPref || "(not specified)"}`,
        ``,
        `Child details: ${req.childDetails || "(none provided)"}`,
        `Goods needed: ${req.goodsNeeded}`,
        ``,
        req.message || "(no additional message)",
      ].join("\n"),
    });
    stored = true;
  }

  if (!stored) {
    console.warn(
      `[forms] Partner request not persisted (table missing or no storage) — logged only:\n${JSON.stringify(
        req,
        null,
        2,
      )}`,
    );
  }
  return { stored };
}

/** True when the error means the target table hasn't been migrated yet:
 *  Postgres 42P01 (undefined_table) or PostgREST PGRST205 (schema cache). */
function isMissingTable(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "42P01" ||
    error?.code === "PGRST205" ||
    /schema cache|could not find the table|does not exist/i.test(
      error?.message ?? "",
    )
  );
}

export type BinHostRequest = {
  orgName: string;
  contactName: string;
  email: string;
  phone?: string;
  orgType: string;
  location: string;
  indoorOk: boolean;
  footTraffic?: string;
  timing?: string;
  message?: string;
};

/** Persist a host-a-bin request; degrades to notify/log pre-migration. */
export async function saveBinHostRequest(req: BinHostRequest) {
  let stored = false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase!.from("bin_host_requests").insert({
      org_name: req.orgName,
      contact_name: req.contactName,
      email: req.email,
      phone: req.phone || null,
      org_type: req.orgType,
      location: req.location,
      indoor_ok: req.indoorOk,
      foot_traffic: req.footTraffic || null,
      timing: req.timing || null,
      message: req.message || null,
    });
    if (error && !isMissingTable(error)) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    if (!error) stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Bin host request · ${req.orgName} (${req.orgType})`,
      replyTo: req.email,
      text: [
        `New host-a-bin request`,
        `Organization: ${req.orgName} (${req.orgType})`,
        `Contact: ${req.contactName}`,
        `Email: ${req.email}`,
        `Phone: ${req.phone || "(not provided)"}`,
        `Location: ${req.location}`,
        `Indoor placement available: ${req.indoorOk ? "yes" : "no"}`,
        `Foot traffic: ${req.footTraffic || "(not provided)"}`,
        `Timing: ${req.timing || "(not provided)"}`,
        ``,
        req.message || "(no additional message)",
      ].join("\n"),
    });
    stored = true;
  }

  if (!stored) {
    console.warn(
      `[forms] Bin host request not persisted — logged only:\n${JSON.stringify(req, null, 2)}`,
    );
  }
  return { stored };
}

export type PickupRequest = {
  name: string;
  email: string;
  phone?: string;
  pickupArea: string;
  items: string;
  volume?: string;
  windows?: string;
  message?: string;
};

/** Persist a donor pickup request (bin QR target); degrades pre-migration. */
export async function savePickupRequest(req: PickupRequest) {
  let stored = false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase!.from("pickup_requests").insert({
      name: req.name,
      email: req.email,
      phone: req.phone || null,
      pickup_area: req.pickupArea,
      items: req.items,
      volume: req.volume || null,
      windows: req.windows || null,
      message: req.message || null,
    });
    if (error && !isMissingTable(error)) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    if (!error) stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Pickup request · ${req.name} · ${req.pickupArea}`,
      replyTo: req.email,
      text: [
        `New goods pickup request`,
        `Name: ${req.name}`,
        `Email: ${req.email}`,
        `Phone: ${req.phone || "(not provided)"}`,
        `Pickup area: ${req.pickupArea}`,
        `Items: ${req.items}`,
        `Approximate volume: ${req.volume || "(not provided)"}`,
        `Preferred windows: ${req.windows || "(not provided)"}`,
        ``,
        req.message || "(no additional message)",
      ].join("\n"),
    });
    stored = true;
  }

  if (!stored) {
    console.warn(
      `[forms] Pickup request not persisted — logged only:\n${JSON.stringify(req, null, 2)}`,
    );
  }
  return { stored };
}

export type VolunteerSignup = {
  name: string;
  email: string;
  phone?: string;
  interests: string[];
  availability: string;
  adult: boolean;
  message?: string;
};

/** Persist a volunteer interest signup; degrades pre-migration. */
export async function saveVolunteerSignup(req: VolunteerSignup) {
  let stored = false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase!.from("volunteer_signups").insert({
      name: req.name,
      email: req.email,
      phone: req.phone || null,
      interests: req.interests.join(", "),
      availability: req.availability,
      adult: req.adult,
      message: req.message || null,
    });
    if (error && !isMissingTable(error)) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    if (!error) stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Volunteer interest · ${req.name}`,
      replyTo: req.email,
      text: [
        `New volunteer interest signup`,
        `Name: ${req.name}`,
        `Email: ${req.email}`,
        `Phone: ${req.phone || "(not provided)"}`,
        `Interests: ${req.interests.join(", ") || "(none selected)"}`,
        `Availability: ${req.availability}`,
        `18 or older: ${req.adult ? "yes" : "NO (follow up required)"}`,
        ``,
        req.message || "(no additional message)",
      ].join("\n"),
    });
    stored = true;
  }

  if (!stored) {
    console.warn(
      `[forms] Volunteer signup not persisted — logged only:\n${JSON.stringify(req, null, 2)}`,
    );
  }
  return { stored };
}

export type PartnerApplication = {
  orgLegalName: string;
  ein: string;
  fdacsReg?: string;
  website?: string;
  mission: string;
  counties: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone?: string;
  is501c3: boolean;
  needs: string;
  volumeEstimate?: string;
  vettingAck: boolean;
  message?: string;
  // Publicity/media consent (migration 0008). Preference is one of
  // may_name | may_name_with_review | do_not_name.
  publicityPreference: string;
  logoUsePermitted: boolean;
  mediaContactName?: string;
  mediaContactEmail?: string;
};

const PUBLICITY_LABELS: Record<string, string> = {
  may_name: "Yes, may name publicly",
  may_name_with_review: "Yes, with review before publishing",
  do_not_name: "Do NOT name publicly",
};

/** Persist a formal 501(c)(3) partnership application; degrades pre-migration. */
export async function savePartnerApplication(req: PartnerApplication) {
  let stored = false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase!.from("partner_applications").insert({
      org_legal_name: req.orgLegalName,
      ein: req.ein,
      fdacs_reg: req.fdacsReg || null,
      website: req.website || null,
      mission: req.mission,
      counties: req.counties,
      contact_name: req.contactName,
      contact_title: req.contactTitle,
      email: req.email,
      phone: req.phone || null,
      is_501c3: req.is501c3,
      needs: req.needs,
      volume_estimate: req.volumeEstimate || null,
      vetting_ack: req.vettingAck,
      message: req.message || null,
      publicity_preference: req.publicityPreference,
      logo_use_permitted: req.logoUsePermitted,
      media_contact_name: req.mediaContactName || null,
      media_contact_email: req.mediaContactEmail || null,
    });
    if (error && !isMissingTable(error)) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    if (!error) stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Partnership APPLICATION · ${req.orgLegalName}`,
      replyTo: req.email,
      text: [
        `New 501(c)(3) partnership application`,
        `Organization: ${req.orgLegalName}`,
        `EIN: ${req.ein}`,
        `FDACS reg: ${req.fdacsReg || "(not provided)"}`,
        `Website: ${req.website || "(not provided)"}`,
        `Counties served: ${req.counties}`,
        `Contact: ${req.contactName} (${req.contactTitle})`,
        `Email: ${req.email}`,
        `Phone: ${req.phone || "(not provided)"}`,
        `501(c)(3) attested: ${req.is501c3 ? "yes" : "no / not confirmed"}`,
        `Vetting acknowledged: ${req.vettingAck ? "yes" : "no"}`,
        `Volume estimate: ${req.volumeEstimate || "(not provided)"}`,
        ``,
        `Publicity: ${PUBLICITY_LABELS[req.publicityPreference] || req.publicityPreference}`,
        `Logo use permitted: ${req.logoUsePermitted ? "yes" : "no"}`,
        `Media contact: ${
          req.mediaContactName || req.mediaContactEmail
            ? `${req.mediaContactName || "(no name)"} <${req.mediaContactEmail || "(no email)"}>`
            : "(not provided)"
        }`,
        ``,
        `Mission & population: ${req.mission}`,
        ``,
        `Needs: ${req.needs}`,
        ``,
        req.message || "(no additional message)",
      ].join("\n"),
    });
    stored = true;
  }

  if (!stored) {
    console.warn(
      `[forms] Partner application not persisted — logged only:\n${JSON.stringify(req, null, 2)}`,
    );
  }
  return { stored };
}

/** Persist a launch-list email signup to Supabase (idempotent on email). */
export async function saveLaunchSignup(email: string) {
  let stored = false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase!.from("launch_signups").insert({ email });
    // 23505 = unique violation (already subscribed) — treat as success.
    if (error && error.code !== "23505") {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: "New launch-list signup",
      replyTo: email,
      text: `Follow-our-launch signup: ${email}`,
    });
    stored = true;
  }

  if (!stored) {
    console.warn(`[forms] No storage configured — signup logged only: ${email}`);
  }
  return { stored };
}

export const GOODS_CATEGORIES = [
  { value: "clothing", label: "Children's clothing" },
  { value: "shoes", label: "Shoes" },
  { value: "toys-games", label: "Toys and games" },
  { value: "books", label: "Books" },
  { value: "baby-gear", label: "Baby gear" },
  { value: "school-supplies", label: "School supplies" },
  { value: "other", label: "Other" },
] as const;

export const GOODS_QUANTITY_BANDS = [
  { value: "few-items", label: "A few items" },
  { value: "one-bag", label: "About one bag" },
  { value: "two-three-bags", label: "Two or three bags" },
  { value: "more", label: "More than three bags" },
] as const;

export type GoodsDonation = {
  firstName: string;
  lastName?: string;
  email: string;
  categories: string[];
  otherDescription?: string;
  quantityBand?: string;
  binSlug?: string;
  zip?: string;
  emailOptIn: boolean;
};

function goodsCategoryLabel(value: string) {
  return GOODS_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function goodsQuantityLabel(value: string) {
  return GOODS_QUANTITY_BANDS.find((q) => q.value === value)?.label ?? value;
}

/** Plain-text in-kind receipt. NEVER states or implies a dollar value: for
 *  non-cash gifts the donor determines fair market value, not the charity. */
function buildGoodsReceipt(d: GoodsDonation, receiptNumber: string) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
  const donor = [d.firstName, d.lastName].filter(Boolean).join(" ");
  const lines = [
    ORG.legalName,
    "DBA The Collective Kids Closet",
    `EIN ${ORG.ein}`,
    `${ORG.streetAddress}, ${ORG.cityStateZip}`,
    FL_REG_LINE,
    ``,
    `DONATION RECEIPT`,
    `Receipt number: ${receiptNumber}`,
    `Date received: ${date}`,
    `Donor: ${donor}`,
    ``,
    `Description of donated goods, as reported by the donor:`,
    ...d.categories.map((c) =>
      c === "other" && d.otherDescription
        ? `- Other: ${d.otherDescription}`
        : `- ${goodsCategoryLabel(c)}`,
    ),
  ];
  if (d.quantityBand) {
    lines.push(`Approximate quantity: ${goodsQuantityLabel(d.quantityBand)}`);
  }
  if (d.binSlug) {
    lines.push(`Donation bin: ${d.binSlug}`);
  }
  lines.push(
    ``,
    `No goods or services were provided in exchange for this contribution.`,
    ``,
    `The IRS requires donors to determine the value of donated goods. Please keep this receipt for your records. For donations valued over $500 you may need IRS Form 8283, and over $5,000 a qualified appraisal may be required. We are glad to answer questions about what you gave, but we cannot assign it a value.`,
    ``,
    `Thank you for giving with such generosity. Your donation supports Florida children in foster care, kinship homes, and families navigating crisis, through direct provision with our partner nonprofits and our community resale program that funds local children's causes.`,
    ``,
    FL_DISCLOSURE,
    ``,
    `The Children's Collective of Florida`,
    `ChildrensCollectiveFL.org | (772) 202-0554 | ${ORG.email}`,
  );
  return lines.join("\n");
}

/**
 * Full goods-donation intake: sequential receipt number (RPC), donor receipt
 * email, durable row (receipt_sent_at reflects the send outcome), optional
 * email-list capture, internal notification. Every step degrades softly so a
 * donor standing at a bin never sees a failure the org can absorb.
 */
export async function saveGoodsDonation(d: GoodsDonation) {
  let stored = false;
  let receiptNumber = "";

  const supabase = isSupabaseConfigured() ? getSupabase() : null;

  if (supabase) {
    const { data, error } = await supabase.rpc("next_receipt_number");
    if (!error && typeof data === "string") receiptNumber = data;
  }
  if (!receiptNumber) {
    // Provisional fallback (pre-migration or RPC failure): unique enough to
    // answer a donor question, visibly not part of the sequential series.
    receiptNumber = `CCOF-${new Date().getFullYear()}-P${Date.now()
      .toString(36)
      .slice(-5)
      .toUpperCase()}`;
  }

  const receipt = await sendEmailTo({
    to: d.email,
    subject: "Your donation receipt from The Children's Collective of Florida",
    replyTo: ORG.email,
    text: buildGoodsReceipt(d, receiptNumber),
  });

  if (supabase) {
    const { error } = await supabase.from("goods_donations").insert({
      first_name: d.firstName,
      last_name: d.lastName || null,
      email: d.email,
      categories: d.categories,
      other_description: d.otherDescription || null,
      quantity_band: d.quantityBand || null,
      bin_slug: d.binSlug || null,
      zip: d.zip || null,
      email_opt_in: d.emailOptIn,
      receipt_number: receiptNumber,
      receipt_sent_at: receipt.delivered ? new Date().toISOString() : null,
    });
    if (error && !isMissingTable(error)) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    if (!error) stored = true;

    // Email-list capture (quiet: no extra notification; duplicates are fine).
    if (d.emailOptIn) {
      const { error: signupError } = await supabase
        .from("launch_signups")
        .insert({ email: d.email });
      if (
        signupError &&
        signupError.code !== "23505" &&
        !isMissingTable(signupError)
      ) {
        console.warn(`[forms] goods donor list capture failed: ${signupError.message}`);
      }
    }
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Goods donation · ${d.firstName} ${d.lastName || ""} · ${d.binSlug || "no bin"}`.trim(),
      replyTo: d.email,
      text: [
        `New goods donation recorded`,
        `Receipt: ${receiptNumber} (receipt email ${receipt.delivered ? "sent" : "NOT sent"})`,
        `Donor: ${[d.firstName, d.lastName].filter(Boolean).join(" ")}`,
        `Email: ${d.email} (updates opt-in: ${d.emailOptIn ? "yes" : "no"})`,
        `Categories: ${d.categories.map(goodsCategoryLabel).join(", ")}`,
        d.categories.includes("other") && d.otherDescription
          ? `Other description: ${d.otherDescription}`
          : ``,
        `Quantity: ${d.quantityBand ? goodsQuantityLabel(d.quantityBand) : "(not provided)"}`,
        `Bin: ${d.binSlug || "(not provided)"}`,
        `ZIP: ${d.zip || "(not provided)"}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    stored = true;
  }

  if (!stored) {
    console.warn(
      `[forms] Goods donation not persisted — logged only:\n${JSON.stringify(
        { ...d, receiptNumber },
        null,
        2,
      )}`,
    );
  }
  return { stored, receiptNumber, receiptSent: receipt.delivered };
}
