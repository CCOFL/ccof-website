import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/Section";
import { LinkButton } from "@/components/Button";
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
            <Eyebrow>Give Funds</Eyebrow>
            <h1
              className="font-extrabold tracking-tight text-sage-600"
              style={{ fontSize: "var(--text-display)", lineHeight: 1.05 }}
            >
              Change a childhood. Fund the launch.
            </h1>
            <p className="measure mt-5 text-lg leading-relaxed text-muted">
              {ORG.flagshipProgram} is coming to {ORG.flagshipCity} in{" "}
              {ORG.flagshipLaunch}. Every gift right now helps stock the shelves,
              secure a space, and seed the fund for our first partner programs.
            </p>

            <div className="mt-8 rounded-2xl border border-sage/30 bg-sage/5 p-6 shadow-card">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                Our biggest need right now is goods
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/90">
                Donated kids&apos; goods are the heart of what we do right now.
                If your family has quality strollers, clothing, books, or gear to
                give, that&apos;s the most direct way to help a child today. We
                come to you across Martin County.
              </p>
              <div className="mt-4">
                <LinkButton href="/give-goods" variant="secondary">
                  Give goods instead →
                </LinkButton>
              </div>
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

            <p className="mt-6 text-sm text-body">
              Want to see exactly where your support lands?{" "}
              <Link
                href="/where-it-goes"
                className="font-semibold text-sage-600 underline-offset-4 hover:underline"
              >
                Read our transparency promise →
              </Link>
            </p>
          </div>

          {/* Right: the working donation form */}
          <div>
            <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
              {canceled && (
                <p
                  className="mb-5 rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink"
                  role="status"
                >
                  No charge was made. Your checkout was canceled, and
                  you&apos;re welcome to try again whenever you&apos;re ready.
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
              {/* Transparency link right beside the amount selector (brief task 5) */}
              <p className="mt-6 border-t border-line pt-5 text-center text-sm text-body">
                <Link
                  href="/where-it-goes"
                  className="font-semibold text-sage-600 underline-offset-4 hover:underline"
                >
                  See exactly where it goes →
                </Link>
              </p>
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
