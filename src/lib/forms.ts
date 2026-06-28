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
