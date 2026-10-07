import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { ImpactPeriodTiles } from "@/components/ImpactPeriodTiles";
import { impactPeriods } from "@/lib/impact";
import { newsletterEditions } from "@/lib/newsletter";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "The monthly letter from The Children's Collective of Florida: what our community gave, where it went, and what comes next. Serving Martin County, extending our reach to neighboring communities.",
  alternates: { canonical: "/newsletter" },
};

/**
 * Web editions of the monthly letter (general-only posture; see
 * lib/newsletter.ts for the governing rules). The by-the-numbers tiles
 * render from impactPeriods so the letter and /impact can never disagree.
 */
export default function NewsletterPage() {
  return (
    <>
      <PageHero
        eyebrow="Powered by Community"
        title="Our monthly letter"
        intro="Each month we write to our board, partners, hosts, and neighbors: the honest record of what our community gave, where it went, and what comes next. This is the public edition."
      />

      {newsletterEditions.map((ed) => {
        const period = impactPeriods.find((p) => p.slug === ed.slug);
        return (
          <Section key={ed.slug} background="white">
            <SectionHeading eyebrow={ed.label} title={ed.headline} />
            <p className="measure mt-6 text-lg leading-relaxed text-ink/90">
              {ed.opening}
            </p>

            <div className="mt-10 grid gap-4 rounded-3xl border border-line bg-cream p-7 sm:p-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                  Who we are
                </h3>
                <p className="measure mt-1 text-base leading-relaxed text-body">
                  {ed.whoWeAre}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                  What we do
                </h3>
                <p className="measure mt-1 text-base leading-relaxed text-body">
                  {ed.whatWeDo}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                  How we do it
                </h3>
                <p className="measure mt-1 text-base leading-relaxed text-body">
                  {ed.howWeDoIt}
                </p>
              </div>
            </div>

            <h3 className="mt-14 text-2xl font-bold text-sage-600">
              {ed.letterHeading}
            </h3>
            <div className="measure mt-4 space-y-4 text-base leading-relaxed text-body">
              {ed.letterParagraphs.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
              <p className="font-semibold text-ink">
                {ed.letterSignoffName}
                <span className="block text-sm font-normal text-muted">
                  {ed.letterSignoffTitle}
                </span>
              </p>
            </div>

            {period && (
              <>
                <h3 className="mt-14 text-2xl font-bold text-sage-600">
                  {period.heading}
                </h3>
                <div className="mt-6">
                  <ImpactPeriodTiles tiles={period.tiles} cardBg="bg-cream" />
                </div>
                <p className="mt-4">
                  <Link
                    href="/impact"
                    className="font-semibold text-sage-600 underline-offset-4 hover:underline"
                  >
                    See your impact →
                  </Link>
                </p>
              </>
            )}

            <h3 className="mt-14 text-2xl font-bold text-sage-600">
              {ed.communityHeading}
            </h3>
            <p className="measure mt-4 text-base leading-relaxed text-body">
              {ed.communityParagraph}
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {ed.photos.map((photo) => (
                <figure key={photo.src}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-card">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 420px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 text-sm italic text-muted">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-14 rounded-3xl border border-sage/30 bg-cream p-7 sm:p-8">
              <h3 className="text-xl font-bold text-sage-600">
                {ed.plainlyHeading}
              </h3>
              <ul className="mt-4 space-y-3">
                {ed.plainlyBullets.map((bullet) => (
                  <li
                    key={bullet.slice(0, 40)}
                    className="measure flex gap-3 text-base leading-relaxed text-body"
                  >
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-deep" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="mt-14 text-2xl font-bold text-sage-600">
              {ed.socialHeading}
            </h3>
            <p className="measure mt-4 text-base leading-relaxed text-body">
              {ed.socialParagraph}
            </p>

            <h3 className="mt-12 text-2xl font-bold text-sage-600">
              {ed.thankYouHeading}
            </h3>
            <p className="measure mt-4 text-base leading-relaxed text-body">
              {ed.thankYouParagraph}
            </p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-xl font-bold text-sage-600">
                  {ed.nextHeading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {ed.nextItems.map((item) => (
                    <li
                      key={item.slice(0, 40)}
                      className="flex gap-3 text-base leading-relaxed text-body"
                    >
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-sage-600">
                  {ed.partHeading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {ed.partItems.map((item) => (
                    <li
                      key={item.text.slice(0, 40)}
                      className="flex gap-3 text-base leading-relaxed text-body"
                    >
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-deep" />
                      <span>
                        {item.text}{" "}
                        {item.href && item.label && (
                          <Link
                            href={item.href}
                            className="font-semibold text-sage-600 underline-offset-4 hover:underline"
                          >
                            {item.label} →
                          </Link>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="measure mt-12 border-t border-line pt-6 text-sm italic leading-relaxed text-muted">
              {ed.scripture}
            </p>
          </Section>
        );
      })}
    </>
  );
}
