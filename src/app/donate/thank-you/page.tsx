import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/Section";
import { LinkButton } from "@/components/Button";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for supporting The Children's Collective of Florida.",
  robots: { index: false },
  alternates: { canonical: "/donate/thank-you" },
};

export const dynamic = "force-dynamic";

async function getReceipt(sessionId?: string) {
  if (!sessionId || !isStripeConfigured()) return null;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" && session.status !== "complete")
      return null;
    return {
      email: session.customer_details?.email ?? null,
      amount: session.amount_total != null ? session.amount_total / 100 : null,
      recurring: session.mode === "subscription",
    };
  } catch {
    return null;
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const receipt = await getReceipt(session_id);

  return (
    <section className="bg-cream">
      <Container className="py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage text-cream">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12.5l4 4 10-10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <Eyebrow>Thank you</Eyebrow>
          <h1
            className="font-extrabold tracking-tight text-sage-600"
            style={{ fontSize: "var(--text-display)", lineHeight: 1.05 }}
          >
            Your gift is on its way to a child
          </h1>

          {receipt ? (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Thank you for your{" "}
              {receipt.amount != null && (
                <strong className="font-semibold text-ink">
                  ${receipt.amount.toLocaleString("en-US")}
                </strong>
              )}{" "}
              {receipt.recurring ? "monthly " : ""}gift to {ORG.name}.
              {receipt.email
                ? ` A receipt is on its way to ${receipt.email}.`
                : " A receipt has been emailed to you."}
            </p>
          ) : (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Thank you for supporting {ORG.name}. If your gift completed,
              you&apos;ll receive an emailed receipt shortly.
            </p>
          )}

          <p className="mt-3 text-sm text-muted">
            Your contribution is tax-deductible (EIN {ORG.ein}).
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/">Back to home</LinkButton>
            <LinkButton href="/how-it-works" variant="secondary">
              See where it goes
            </LinkButton>
          </div>

          <p className="mt-8 text-sm text-muted">
            Questions about your donation?{" "}
            <Link
              href="/contact"
              className="text-sage-600 underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
