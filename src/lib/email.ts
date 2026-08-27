import { Resend } from "resend";
import { ORG } from "@/lib/site";

const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL || "forms@childrenscollectivefl.org";
/**
 * Netlify rejects the RFC 5322 `Name <addr>` form as an env value, so the
 * display name is attached here. An env value that already carries a display
 * name is used verbatim.
 */
const FROM = FROM_ADDRESS.includes("<")
  ? FROM_ADDRESS
  : `"${ORG.name}" <${FROM_ADDRESS}>`;
const TO = process.env.CONTACT_TO_EMAIL || "info@childrenscollectivefl.org";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

type SendArgs = {
  subject: string;
  text: string;
  replyTo?: string;
};

type SendToArgs = SendArgs & { to: string };

/**
 * Sends an email to an arbitrary recipient (e.g. a donor receipt). Same
 * configuration guard as sendNotification. The sending domain is verified in
 * Resend (2026-08-25), so any recipient is deliverable; callers still treat a
 * failed send as non-fatal.
 */
export async function sendEmailTo({ to, subject, text, replyTo }: SendToArgs) {
  if (!isEmailConfigured()) {
    console.warn(
      `[email] RESEND_API_KEY not set: outbound email logged, not delivered.\nTo: ${to}\nSubject: ${subject}\n${text}`,
    );
    return { delivered: false as const };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error(`[email] send to ${to} failed:`, error.message);
    return { delivered: false as const };
  }
  return { delivered: true as const };
}

/**
 * Sends a notification email to the org inbox. When RESEND_API_KEY is not set
 * (e.g. before launch keys are added) the submission is logged server-side and
 * treated as accepted, so the form UX works in every environment.
 * Delivery MUST be configured before launch — see README / QA checklist.
 */
export async function sendNotification({ subject, text, replyTo }: SendArgs) {
  if (!isEmailConfigured()) {
    console.warn(
      `[email] RESEND_API_KEY not set: submission logged, not delivered.\nTo: ${TO}\nSubject: ${subject}\n${text}`,
    );
    return { delivered: false as const };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(error.message);
  }
  return { delivered: true as const };
}
