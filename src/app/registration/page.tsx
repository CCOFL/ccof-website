import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { ORG, FDACS_DISCLOSURE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Registration & Financial Information",
  description:
    "The Children's Collective of Florida's official Florida charitable registration (#CH83131) and financial information, as required by Florida law.",
  alternates: { canonical: "/registration" },
};

/**
 * Destination page for the one-line disclosure used in short social posts:
 * "Registered Florida nonprofit #CH83131. Registration and financial details:
 * ChildrensCollectiveFL.org/registration". The URL must remain exactly
 * /registration. Holds the full FL 496.411 statutory statement verbatim,
 * conspicuously set off. Principal place of business is intentionally listed
 * as Martin County, Florida (never the founder's home address).
 */
// The statutory statement renders from the single sitewide constant in
// lib/site.ts (FDACS_DISCLOSURE). Never define a local copy here again.
const STATUTORY_STATEMENT = FDACS_DISCLOSURE;

const DETAILS: { label: string; value: string }[] = [
  { label: "Legal name", value: ORG.legalName },
  { label: "Florida charitable registration number", value: ORG.flReg },
  {
    label: "Business address",
    value: `${ORG.streetAddress}, ${ORG.cityStateZip}`,
  },
  { label: "Serving", value: "Martin County, Florida, and neighboring communities" },
  {
    label: "Administrative contact",
    value: ORG.adminEmail,
  },
  { label: "Phone", value: ORG.phone },
  {
    label: "Contact for our most recent financial statement",
    value: ORG.email,
  },
];

export default function RegistrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="Registration & Financial Information"
        intro="The Children's Collective of Florida is a registered Florida nonprofit. Here is our official registration and financial information, as required by Florida law."
      />

      <Section background="white">
        <div className="mx-auto max-w-3xl">
          {/* Identifying details */}
          <dl className="rounded-2xl border border-line bg-cream p-6 sm:p-8">
            {DETAILS.map((item, i) => (
              <div
                key={item.label}
                className={i > 0 ? "mt-5 border-t border-line pt-5" : undefined}
              >
                <dt className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                  {item.label}
                </dt>
                <dd className="mt-1 text-base text-ink">
                  {item.value.includes("@") ? (
                    <a
                      href={`mailto:${item.value}`}
                      className="text-sage-600 underline-offset-4 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : item.value === ORG.phone ? (
                    <a
                      href={ORG.phoneHref}
                      className="text-sage-600 underline-offset-4 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {/* Required Florida statutory statement, set off conspicuously.
              Verbatim per the FDACS letter; no link or extra text inside. */}
          <div className="mt-10 rounded-2xl border-2 border-sage/50 bg-sage/5 p-6 sm:p-8">
            <p className="text-sm font-semibold leading-relaxed tracking-wide text-ink">
              {STATUTORY_STATEMENT}
            </p>
          </div>

          {/* General reference, outside the statutory statement */}
          <p className="mt-4 text-center text-sm text-muted">
            Florida Registration #{ORG.flReg} · Division of Consumer Services:{" "}
            <a
              href="https://www.fdacs.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 underline-offset-4 hover:underline"
            >
              www.fdacs.gov
            </a>
          </p>

          {/* Closing line */}
          <p className="mt-10 text-center text-lg text-body">
            We will always{" "}
            <Link
              href="/where-it-goes"
              className="font-semibold text-sage-600 underline-offset-4 hover:underline"
            >
              show you where your generosity goes
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
