import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern your use of The Children's Collective of Florida website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="The fine print"
        title="Terms of Use"
        intro="The basics that govern using this website. By visiting, you agree to these terms."
      />

      <Section background="white">
        <div className="prose-legal">
          <p className="text-sm text-muted">Last updated: June 2026</p>

          <h2>Using this site</h2>
          <p>
            This website is operated by {ORG.legalName}. You agree to use it only
            for lawful purposes and not to disrupt, damage, or misuse it or
            attempt to access areas you&apos;re not authorized to use.
          </p>

          <h2>Donations</h2>
          <p>
            Donations made through this site support {ORG.abbr}&apos;s charitable
            mission and are tax-deductible to the extent allowed by law. Please
            see our <a href="/donation-policy">Donation &amp; Refund Policy</a>{" "}
            for details on receipts, recurring gifts, and refunds.
          </p>

          <h2>Our content</h2>
          <p>
            The text, graphics, logos, and other materials on this site are owned
            by {ORG.abbr} or used with permission, and may not be copied or
            reused without our written consent. The CCOF name and logo are our
            marks.
          </p>

          <h2>Links to other sites</h2>
          <p>
            We may link to third-party services (such as our payment processor).
            We&apos;re not responsible for the content or practices of sites we
            don&apos;t operate; their own terms and privacy policies apply.
          </p>

          <h2>No warranties</h2>
          <p>
            This site is provided &ldquo;as is.&rdquo; While we work to keep
            information accurate and current, we make no warranties about its
            completeness or availability, and nothing here is legal, tax, or
            financial advice.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {ORG.abbr} is not liable for
            any damages arising from your use of, or inability to use, this site.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the State of Florida. We may
            update them from time to time; the &ldquo;last updated&rdquo; date
            above reflects the current version.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${ORG.email}`}>{ORG.email}</a>.
          </p>
        </div>
      </Section>
    </>
  );
}
