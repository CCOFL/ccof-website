/**
 * Success-fired GA4 conversion events (campaign prep, 2026-10-06).
 *
 * Fires ONLY when gtag exists, which is only in production (layout renders
 * the GA scripts solely when NEXT_PUBLIC_GA_ID is set, and the founder scoped
 * that env var to the Production context). Preview/dev/local fire nothing.
 *
 * PRIVACY CONTRACT: events carry a NAME ONLY. Never pass form values, email
 * addresses, names, or any payload with personal data. The June no-tracking
 * rule (receipts, statutory URLs) is untouched: these are site UI events.
 *
 * donation_complete is deliberately NOT a code event: it is defined in the
 * GA4 UI as a key event on the /donate/thank-you page_view, which only
 * fires after Stripe redirects a completed checkout back to the site.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConversionEvent =
  | "sign_up"
  | "contact_submit"
  | "pickup_request"
  | "partner_request"
  | "partner_application"
  | "volunteer_signup"
  | "bin_host_inquiry"
  | "goods_receipt_request"
  | "donation_begin";

export function trackConversion(event: ConversionEvent) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", event);
    }
  } catch {
    // Analytics must never break a form.
  }
}
