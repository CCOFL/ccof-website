import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { PartnerMouForm } from "@/components/PartnerMouForm";
import { isMouDraft, isMouFlowEnabled, MOU_COPY, PARTNER_MOU_VERSION } from "@/lib/partnerMou";
import { MOU_PREAMBLE, MOU_SECTIONS, MOU_SUBTITLE } from "@/content/partnerMouText";

const S = MOU_COPY.sign;

/** Unlisted: sent only in acceptance emails. Never indexed, never in the
 *  sitemap or navigation. Gated: 404 until the MOU is approved. */
export function generateMetadata(): Metadata {
  return isMouFlowEnabled()
    ? { title: "Partner Agreement", robots: { index: false, follow: false } }
    : {};
}

export default function PartnerAgreementSignPage() {
  if (!isMouFlowEnabled()) notFound();
  const draft = isMouDraft();
  return (
    <>
      <PageHero eyebrow={S.eyebrow} title={S.title} intro={S.intro} />
      <Section background="white">
        <div className="mx-auto max-w-3xl">
          {draft && (
            <p role="note" className="mb-8 rounded-2xl border-2 border-coral bg-coral/5 p-5 text-sm font-semibold text-coral-deep">
              {S.draftBanner}
            </p>
          )}
          <article className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-coral-deep">{MOU_SUBTITLE}</p>
            <p className="mt-1 text-xs text-muted">{PARTNER_MOU_VERSION}</p>
            <p className="mt-5 text-base leading-relaxed text-body">{MOU_PREAMBLE}</p>
            <ol className="mt-6 space-y-6">
              {MOU_SECTIONS.map((sec) => (
                <li key={sec.n}>
                  <h2 className="text-lg font-bold text-sage-600">
                    {sec.n}. {sec.title}
                  </h2>
                  {sec.paragraphs?.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-2 text-base leading-relaxed text-body">{p}</p>
                  ))}
                  {sec.bullets && (
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-body">
                      {sec.bullets.map((b) => <li key={b.slice(0, 40)}>{b}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </article>

          <div id="sign" className="mt-10 scroll-mt-24 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-bold text-sage">Sign for your organization</h2>
            <div className="mt-6">
              <PartnerMouForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
