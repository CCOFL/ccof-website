import { Resend } from "resend";

const FROM = process.env.CONTACT_FROM_EMAIL || "forms@childrenscollectivefl.org";
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
 * configuration guard as sendNotification. NOTE: until the sending domain is
 * verified in Resend (blocked on the Wix→Cloudflare DNS migration), Resend
 * rejects recipients other than the account owner; callers must treat a
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
