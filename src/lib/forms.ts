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
