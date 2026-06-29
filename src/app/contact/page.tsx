import type { Metadata } from "next";
import { Container } from "@/components/Section";
import { Eyebrow } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with The Children's Collective of Florida — donate goods, host a drive, partner with us, volunteer, or request support.",
  alternates: { canonical: "/contact" },
};

const WELCOMING = [
  "Goods donations of quality kids' items",
  "Businesses, schools & congregations to host a bin or drive",
  "Local 501(c)(3) programs interested in becoming partners",
  "Volunteers (as Volunteer Service launches)",
  "Families and programs seeking support",
];

// Next.js 16: searchParams is async.
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;

  return (
    <section className="bg-cream">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: context + single welcoming-inquiries list (de-duplicated, brief §5) */}
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1
              className="font-extrabold tracking-tight text-sage-600"
              style={{ fontSize: "var(--text-display)", lineHeight: 1.05 }}
            >
              Let&apos;s talk
            </h1>
            <p className="measure mt-5 text-lg leading-relaxed text-muted">
              We read every message. Tell us how you&apos;d like to help — or how
              we can help you — and we&apos;ll be in touch.
            </p>

            <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-coral-deep">
                We are currently welcoming inquiries for
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-ink/90">
                {WELCOMING.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden className="mt-1 text-sage">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-1 text-sm text-muted">
              <p>
                Email:{" "}
                <a
                  href={`mailto:${ORG.email}`}
                  className="text-sage-600 underline-offset-4 hover:underline"
                >
                  {ORG.email}
                </a>
              </p>
              <p>Treasure Coast, FL · physical location coming soon</p>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
            <ContactForm initialIntent={intent} />
          </div>
        </div>
      </Container>
    </section>
  );
}
