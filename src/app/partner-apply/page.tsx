import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { PartnerApplicationForm } from "@/components/PartnerApplicationForm";

export const metadata: Metadata = {
  title: "Apply to Become a Partner Nonprofit",
  description:
    "Formal partnership application for 501(c)(3) organizations serving children in foster care, kinship care, or crisis. Receive donated goods for the families you serve.",
  alternates: { canonical: "/partner-apply" },
};

export default function PartnerApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner With Us"
        title="Apply to become a partner nonprofit."
        intro="CCOF contributes donated goods to vetted 501(c)(3) partners who serve children directly. This application starts the verification conversation. Once approved, your organization can request goods for the specific children and families you serve."
      />
      <Section background="white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <PartnerApplicationForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Have an urgent need for a specific child right now? You don&apos;t
            need to wait for approval.{" "}
            <Link
              href="/partner-nonprofits"
              className="text-sage-600 underline-offset-4 hover:underline"
            >
              submit a goods request
            </Link>{" "}
            and we&apos;ll verify as we go.
          </p>
        </div>
      </Section>
    </>
  );
}
