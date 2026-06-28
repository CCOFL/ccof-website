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

/**
 * Sends a notification email to the org inbox. When RESEND_API_KEY is not set
 * (e.g. before launch keys are added) the submission is logged server-side and
 * treated as accepted, so the form UX works in every environment.
 * Delivery MUST be configured before launch — see README / QA checklist.
 */
export async function sendNotification({ subject, text, replyTo }: SendArgs) {
  if (!isEmailConfigured()) {
    console.warn(
      `[email] RESEND_API_KEY not set — submission logged, not delivered.\nTo: ${TO}\nSubject: ${subject}\n${text}`,
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
