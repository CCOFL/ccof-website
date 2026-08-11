import { getSupabase, isSupabaseConfigured } from "./supabase";
import { sendNotification, isEmailConfigured } from "./email";

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
      subject: `Website contact — ${sub.intent} — ${sub.name}`,
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
      subject: `Partner request — ${req.orgName} — ${req.urgency}`,
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
      subject: `Bin host request — ${req.orgName} (${req.orgType})`,
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
      subject: `Pickup request — ${req.name} — ${req.pickupArea}`,
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
      subject: `Volunteer interest — ${req.name}`,
      replyTo: req.email,
      text: [
        `New volunteer interest signup`,
        `Name: ${req.name}`,
        `Email: ${req.email}`,
        `Phone: ${req.phone || "(not provided)"}`,
        `Interests: ${req.interests.join(", ") || "(none selected)"}`,
        `Availability: ${req.availability}`,
        `18 or older: ${req.adult ? "yes" : "NO — follow up required"}`,
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
    });
    if (error && !isMissingTable(error)) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    if (!error) stored = true;
  }

  if (isEmailConfigured()) {
    await sendNotification({
      subject: `Partnership APPLICATION — ${req.orgLegalName}`,
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
