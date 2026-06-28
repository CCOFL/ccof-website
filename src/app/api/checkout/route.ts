import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured, normalizeAmount } from "@/lib/stripe";
import { ORG } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  amount?: number | string;
  frequency?: "one-time" | "monthly";
};

function baseUrl(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    new URL(request.url).origin
  );
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Donations aren't connected yet. Add STRIPE_SECRET_KEY to enable checkout.",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const amount = normalizeAmount(body.amount);
  if (amount === null) {
    return NextResponse.json(
      { error: "Please choose a valid donation amount." },
      { status: 400 },
    );
  }

  const monthly = body.frequency === "monthly";
  const unitAmount = Math.round(amount * 100); // cents
  const origin = baseUrl(request);
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: monthly ? "subscription" : "payment",
      // Hosted Checkout collects the email and (when enabled in the Dashboard)
      // sends an emailed receipt automatically.
      billing_address_collection: "auto",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: monthly
                ? `Monthly donation to ${ORG.name}`
                : `Donation to ${ORG.name}`,
              description:
                "Tax-deductible gift supporting kids in foster care, kinship homes, and crisis.",
            },
            ...(monthly ? { recurring: { interval: "month" as const } } : {}),
          },
        },
      ],
      // For one-time gifts, ask Stripe to email a receipt.
      ...(monthly
        ? {}
        : { payment_intent_data: { description: `Donation to ${ORG.name}` } }),
      submit_type: monthly ? undefined : "donate",
      success_url: `${origin}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?canceled=1`,
      metadata: {
        org: ORG.abbr,
        frequency: monthly ? "monthly" : "one-time",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again." },
      { status: 500 },
    );
  }
}
