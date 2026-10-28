import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { BinHostForm } from "@/components/BinHostForm";
import { LinkButton } from "@/components/Button";
import { COMMUNITY_PARTNER_DEFINITION, THIRTY_DAYS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Host a Donation Bin",
  description:
    "Host a Children's Collective of Florida donation bin at your business, school, or congregation and turn your foot traffic into support for local kids.",
  alternates: { canonical: "/host-a-bin" },
};

export default async function HostABinPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const defaultRequestType = intent === "drive" ? "drive" : "bin";
  return (
    <>
      <PageHero
        eyebrow="Host a Bin"
        title="Put your foot traffic to work for local kids."
        intro="Our indoor donation bins let your customers, students, or congregation give quality kids' goods right where they already are. We handle the bin, the pickups, and the thank-yous. You provide the spot."
      />
      {/* 30 Days of Giving doorway (founder, 2026-10-27): one attention
          element, brand coral, directly under the hero. The campaign page
          it opens is linked + unindexed. */}
      <Section background="white" className="!pb-0">
        <div className="rounded-3xl border-2 border-coral bg-coral/10 p-7 text-center sm:p-9">
          <p className="text-sm font-bold uppercase tracking-wider text-coral-deep">
            {THIRTY_DAYS.callout.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {THIRTY_DAYS.callout.title}
          </h2>
          <p className="measure mx-auto mt-3 text-base leading-relaxed text-body">
            {THIRTY_DAYS.callout.body}
          </p>
          <div className="mt-6">
            <LinkButton href={THIRTY_DAYS.callout.cta.href} size="lg">
              {THIRTY_DAYS.callout.cta.label} →
            </LinkButton>
          </div>
        </div>
      </Section>
      {/* Three doors (founder, 2026-10-06): rising commitment, all true
          today. Drives are the low-commitment on-ramp and the bin-host
          funnel; Fill a Duffel is the signature drive format. */}
      <Section background="cream">
        <SectionHeading
          center
          eyebrow="Three ways in"
          title="Pick the door that fits"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="flex h-full flex-col rounded-2xl border border-sage/30 bg-white p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              One weekend
            </span>
            <h3 className="mt-2 text-xl font-bold">Run a drive</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              A one-time goods drive for your office, school, team, or
              congregation. Our favorite: Fill a Duffel, one bag packed for one
              child. We hand you the list and collect everything when it
              wraps.
            </p>
            <div className="mt-5">
              <LinkButton href="/fill-a-duffel" variant="secondary">
                Fill a Duffel →
              </LinkButton>
            </div>
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              A standing spot
            </span>
            <h3 className="mt-2 text-xl font-bold">Host a bin</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              Two feet of indoor floor space, and we do the rest: the bin, the
              pickups, and the thank-yous. Your community gives right where
              they already are.
            </p>
            <div className="mt-5">
              <LinkButton href="#bin-form" variant="secondary">
                Start below ↓
              </LinkButton>
            </div>
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
              Fund the work
            </span>
            <h3 className="mt-2 text-xl font-bold">Sponsor a season</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              Your gift builds the supply operation: bins, storage, insurance,
              sorting equipment, and the goods we deliver to our partner
              organizations.
            </p>
            <div className="mt-5">
              <LinkButton href="/donate" variant="secondary">
                Give funds →
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>
      <Section background="white">
        <div className="mx-auto max-w-3xl">
          {/* Community Partner definition (9/3): this page had no partner
              framing at all; the definition names the role a host steps into.
              It never implies a host cannot also be a partner nonprofit. */}
          <p className="measure mx-auto text-center text-lg leading-relaxed text-body">
            {COMMUNITY_PARTNER_DEFINITION}
          </p>
          <div
            id="bin-form"
            className="mt-8 scroll-mt-24 rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8"
          >
            <BinHostForm defaultRequestType={defaultRequestType} />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Bins are indoor units (about 2&times;2 feet) so donations stay
            clean and dry. We&apos;ll schedule a quick conversation before any
            placement.
          </p>
        </div>
      </Section>
    </>
  );
}
