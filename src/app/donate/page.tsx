import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/Section";
import { DonationForm } from "@/components/DonationForm";
import { ORG, FL_DISCLOSURE, TAX_NOTE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Make a tax-deductible one-time or monthly gift to The Children's Collective of Florida. Your donation funds practical support for kids in foster care, kinship homes, and crisis.",
  alternates: { canonical: "/donate" },
};

// searchParams is async in Next.js 16.
export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  return (
    <section className="bg-cream">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          {/* Left: the ask */}
          <div>
            <Eyebrow>Donate / Give Goods</Eyebrow>
            <h1
              className="font-extrabold tracking-tight text-sage-600"
              style={{ fontSize: "var(--text-display)", lineHeight: 1.05 }}
            >
              Fund the launch. Change a childhood.
            </h1>
            <p className="measure mt-5 text-lg leading-relaxed text-muted">
              {ORG.flagshipProgram} opens {ORG.flagshipLaunch} in{" "}
              {ORG.flagshipCity}. Every gift right now stocks the shelves,
              secures the space, and seeds the fund for our first partner
              programs.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl border border-line bg-cream p-6 shadow-card">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                Prefer to give goods?
              </h2>
              <p className="text-sm leading-relaxed text-ink/90">
                We welcome quality kids&apos; items — strollers, cribs, clothing,
                books, and more, inspected and cleaned before they find a second
                home. Email{" "}
                <a
                  href={`mailto:${ORG.email}`}
                  className="text-sage underline-offset-4 hover:underline"
                >
                  {ORG.email}
                </a>{" "}
                or{" "}
                <a
                  href="/contact?intent=donate"
                  className="text-sage underline-offset-4 hover:underline"
                >
                  start a goods donation
                </a>
                .
              </p>
            </div>

            {/* Trust signals */}
            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-line bg-cream p-4">
                <dt className="font-semibold text-ink">Tax-deductible</dt>
                <dd className="mt-1 text-muted">501(c)(3) · EIN {ORG.ein}</dd>
              </div>
              <div className="rounded-xl border border-line bg-cream p-4">
                <dt className="font-semibold text-ink">Secure</dt>
                <dd className="mt-1 text-muted">Processed by Stripe</dd>
              </div>
            </dl>
          </div>

          {/* Right: the working donation form */}
          <div>
            <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
              {canceled && (
                <p
                  className="mb-5 rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink"
                  role="status"
                >
                  No charge was made — your checkout was canceled. You&apos;re
                  welcome to try again whenever you&apos;re ready.
                </p>
              )}
              <h2 className="text-2xl font-bold text-sage">
                Make your gift
              </h2>
              <p className="mt-1 text-sm text-muted">
                One-time or monthly. Choose an amount to begin.
              </p>
              <div className="mt-6">
                <DonationForm />
              </div>
            </div>

            {/* Required legal disclosures (brief §1) */}
            <div className="mt-6 space-y-3 text-xs leading-relaxed text-muted">
              <p>{TAX_NOTE}</p>
              <p>{FL_DISCLOSURE}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
