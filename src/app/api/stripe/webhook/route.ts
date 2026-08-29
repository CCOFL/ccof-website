import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { saveMoneyDonation } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook receiver. Verifies the signature and acknowledges events.
 * Extend the switch to record donations, trigger thank-you emails, etc.
 *
 * Local testing:  stripe listen --forward-to localhost:3000/api/stripe/webhook
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!isStripeConfigured() || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // One-time gift, or the FIRST payment of a monthly gift. Records the
        // donor, sends the branded monetary receipt, and notifies the org.
        // saveMoneyDonation is idempotent on the session id, so Stripe's
        // webhook retries cannot double-record or double-email.
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== "paid") break;
        const email = session.customer_details?.email;
        const amount = session.amount_total;
        if (!email || amount == null || amount <= 0) {
          console.error(
            `Webhook: session ${session.id} missing email or amount; not recorded.`,
          );
          break;
        }
        const result = await saveMoneyDonation({
          donorName: session.customer_details?.name || undefined,
          donorEmail: email,
          amountCents: amount,
          currency: session.currency || "usd",
          method: "card",
          frequency: session.mode === "subscription" ? "monthly" : "one-time",
          receivedAt: new Date(session.created * 1000),
          stripeSessionId: session.id,
          stripePaymentIntent:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : undefined,
        });
        if (result.duplicate) {
          console.log(`Webhook: session ${session.id} already recorded.`);
        }
        break;
      }
      case "invoice.paid": {
        // Monthly gift renewals. The first invoice (billing_reason
        // subscription_create) is covered by checkout.session.completed;
        // every later cycle gets its own receipt here.
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason !== "subscription_cycle") break;
        const email = invoice.customer_email;
        const amount = invoice.amount_paid;
        if (!email || amount == null || amount <= 0) {
          console.error(
            `Webhook: invoice ${invoice.id} missing email or amount; not recorded.`,
          );
          break;
        }
        await saveMoneyDonation({
          donorName: invoice.customer_name || undefined,
          donorEmail: email,
          amountCents: amount,
          currency: invoice.currency || "usd",
          method: "card",
          frequency: "monthly",
          receivedAt: new Date(invoice.created * 1000),
          stripeInvoiceId: invoice.id,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Non-2xx makes Stripe retry the delivery (for up to 72 hours), which is
    // the right behavior for transient failures; the idempotency guard keeps
    // retries from double-recording once a payment lands.
    console.error("Webhook handler failed:", err);
    return NextResponse.json({ error: "Handler failure." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
