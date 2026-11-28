import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { isMouFlowEnabled, MOU_COPY } from "@/lib/partnerMou";

const S = MOU_COPY.summary;

// Metadata is gated too, so nothing about the MOU reaches a 404 page's head.
export function generateMetadata(): Metadata {
  if (!isMouFlowEnabled()) return {};
  return {
    title: "Partner Agreement Summary",
    description:
      "A plain-language summary of the Memorandum of Understanding approved partner organizations sign before their first delivery.",
    alternates: { canonical: "/partner-agreement" },
  };
}

/** Plain-language MOU summary, linked from /partner-apply. Gated: 404 until
 *  the MOU is approved (src/lib/partnerMou.ts). Not in the sitemap. */
export default function PartnerAgreementPage() {
  if (!isMouFlowEnabled()) notFound();
  return (
    <>
      <PageHero eyebrow={S.eyebrow} title={S.title} intro={S.intro} />
      <Section background="white">
        <dl className="mx-auto grid max-w-3xl gap-5">
          {S.points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-cream p-6 shadow-card">
              <dt className="text-lg font-bold text-sage-600">{p.title}</dt>
              <dd className="mt-2 text-base leading-relaxed text-body">{p.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">{S.questions}</p>
      </Section>
    </>
  );
}
