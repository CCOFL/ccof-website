import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        `Donation complete: ${session.id} · ${
          session.amount_total != null ? session.amount_total / 100 : "?"
        } USD · ${session.mode} · ${session.customer_details?.email ?? "no email"}`,
      );
      // TODO: persist the donation record / send an internal notification.
      break;
    }
    case "invoice.paid": {
      // Recurring monthly gift succeeded.
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
