import Stripe from "stripe";

/**
 * Server-only Stripe client. Lazily instantiated so the app still builds and
 * renders when STRIPE_SECRET_KEY isn't set (e.g. before keys are added) — the
 * checkout route returns a friendly error instead of crashing at import time.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!_stripe) {
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Donation limits in whole dollars. */
export const MIN_DONATION = 5;
export const MAX_DONATION = 25000;

/** Validate & normalize a requested donation amount (dollars). */
export function normalizeAmount(input: unknown): number | null {
  const dollars = typeof input === "string" ? Number(input) : (input as number);
  if (!Number.isFinite(dollars)) return null;
  const rounded = Math.round(dollars * 100) / 100;
  if (rounded < MIN_DONATION || rounded > MAX_DONATION) return null;
  return rounded;
}
