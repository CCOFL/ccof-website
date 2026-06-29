import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { ORG, FL_DISCLOSURE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donation & Refund Policy",
  description:
    "How donations to The Children's Collective of Florida work — tax receipts, recurring gifts, goods donations, and refunds.",
  alternates: { canonical: "/donation-policy" },
};

export default function DonationPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Giving with confidence"
        title="Donation & Refund Policy"
        intro="Clear answers about receipts, recurring gifts, goods donations, and refunds."
      />

      <Section background="white">
        <div className="prose-legal">
          <p className="text-sm text-muted">Last updated: June 2026</p>

          <h2>Tax-deductibility &amp; receipts</h2>
          <p>
            {ORG.legalName} is a 501(c)(3) public charity (EIN {ORG.ein}).
            Monetary donations are tax-deductible to the fullest extent allowed
            under IRC §170. You&apos;ll receive an emailed receipt for each gift;
            keep it for your records.
          </p>

          <h2>One-time &amp; monthly gifts</h2>
          <p>
            You can give once or set up a recurring monthly gift. Payments are
            processed securely by Stripe. To change or cancel a recurring gift,
            email <a href={`mailto:${ORG.email}`}>{ORG.email}</a> and we&apos;ll
            take care of it promptly — there is no cancellation fee.
          </p>

          <h2>Refunds</h2>
          <p>
            Because donations support our charitable mission, they are generally
            non-refundable. We understand mistakes happen — if you were charged
            in error (for example, a duplicate or incorrect amount), contact us
            at <a href={`mailto:${ORG.email}`}>{ORG.email}</a> within 30 days and
            we will review and refund any genuine error.
          </p>

          <h2>Donations of goods</h2>
          <p>
            We welcome quality children&apos;s items — inspected and cleaned
            before they reach another family. We can provide a written
            acknowledgment of your in-kind donation; the IRS leaves it to the
            donor to determine the fair-market value of donated goods. To arrange
            a goods donation, reach us at{" "}
            <a href={`mailto:${ORG.email}`}>{ORG.email}</a> or through our{" "}
            <a href="/contact?intent=donate">contact form</a>.
          </p>

          <h2>Where your support goes</h2>
          <p>
            We&apos;re committed to showing you exactly where your gift lands.
            See our <a href="/where-it-goes">Where It Goes</a> transparency
            commitment.
          </p>

          <h2>Required state disclosure</h2>
          <p className="text-sm text-muted">{FL_DISCLOSURE}</p>
        </div>
      </Section>
    </>
  );
}
