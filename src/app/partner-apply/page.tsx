import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { PartnerApplicationForm } from "@/components/PartnerApplicationForm";

/**
 * Review-process line (form-hardening brief, 2026-10-15): one constant so it
 * is easy to edit. Onboarding is OPEN; never describe it as paused or closed,
 * and never state a response timeframe here.
 */
const PROCESS_LINE =
  "Every application is reviewed and verified before a partnership begins. We will be in touch to request any additional information and to talk through next steps.";

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
          <p className="measure mx-auto mb-8 text-center text-base leading-relaxed text-ink/80">
            {PROCESS_LINE}
          </p>
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
              Submit a goods request
            </Link>{" "}
            and we&apos;ll verify as we go.
          </p>
        </div>
      </Section>
    </>
  );
}
