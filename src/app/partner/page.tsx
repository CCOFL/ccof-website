import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { PARTNER_ACTIONS } from "@/lib/site";

function ActionCard({ action }: { action: (typeof PARTNER_ACTIONS)[number] }) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        action.variant === "primary"
          ? "border-sage/30 bg-cream"
          : "border-line bg-cream hover:border-sage-light/60"
      }`}
    >
      <h3 className="text-xl font-semibold">{action.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {action.body}
      </p>
      <div className="mt-5">
        <LinkButton href={action.cta.href} variant={action.variant}>
          {action.cta.label}
        </LinkButton>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Donate, host a bin or drive, become a partner program, volunteer, or request support. Every path to helping kids on the Treasure Coast starts here.",
  alternates: { canonical: "/partner" },
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner with us"
        title="Find your way to help"
        intro="Whether you give goods, host a drive, fund a child's week of school supplies, or run a program that serves kids, there's a place for you here."
      >
        <LinkButton href="/donate" size="lg">
          Donate / Give Goods
        </LinkButton>
      </PageHero>

      <Section background="white">
        <SectionHeading
          eyebrow="Ways to get involved"
          title="Pick the path that fits"
          intro="Each button below goes exactly where it should. No dead ends."
        />
        {/* Grouped per the 9/3 spec: the two partner-nonprofit actions and the
            bin-host action get labeled subheadings so a visitor can tell the
            two apart at a glance. The labels name the ACTION, not who is
            eligible: an organization can be both a Community Partner (bin
            host) and a vetted partner nonprofit. Donate, Volunteer, and
            Request Support stay outside the groups in their prior positions. */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PARTNER_ACTIONS.slice(0, 1).map((action, i) => (
            <Reveal key={action.title} delay={i * 70}>
              <ActionCard action={action} />
            </Reveal>
          ))}
          <div className="sm:col-span-2 mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sage-700">
              Become a Partner Nonprofit
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              For 501(c)(3)s serving children in foster care, kinship care, or
              crisis: receive grant funding, or request goods for a child in
              your care.
            </p>
          </div>
          {PARTNER_ACTIONS.slice(1, 3).map((action, i) => (
            <Reveal key={action.title} delay={i * 70}>
              <ActionCard action={action} />
            </Reveal>
          ))}
          <div className="sm:col-span-2 mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sage-700">
              Host a Bin or Drive
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Set up a donation bin or run a goods drive as a neighborhood
              drop-off point. Any business, school, congregation, or
              organization can host, including current partner nonprofits.
            </p>
          </div>
          {PARTNER_ACTIONS.slice(3, 4).map((action, i) => (
            <Reveal key={action.title} delay={i * 70}>
              <ActionCard action={action} />
            </Reveal>
          ))}
          <div className="sm:col-span-2 mt-4" aria-hidden />
          {PARTNER_ACTIONS.slice(4).map((action, i) => (
            <Reveal key={action.title} delay={i * 70}>
              <ActionCard action={action} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section background="sage">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <SectionHeading
            onDark
            eyebrow="Local 501(c)(3) programs"
            title="Could your program receive grant funding?"
            intro="If you run a program serving children in foster care, kinship homes, or crisis on the Treasure Coast, we'd like to hear from you."
          />
          <div className="shrink-0">
            <LinkButton href="/partner-apply" size="lg" variant="inverse">
              Become a Partner
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
