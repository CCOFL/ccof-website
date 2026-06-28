import { Container, Eyebrow } from "@/components/Section";
import { LinkButton } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="bg-cream">
      <Container className="py-24 text-center sm:py-32">
        <div className="mx-auto max-w-xl">
          <Eyebrow>404</Eyebrow>
          <h1
            className="font-serif font-semibold tracking-tight text-ink"
            style={{ fontSize: "var(--text-display)", lineHeight: 1.05 }}
          >
            We couldn&apos;t find that page
          </h1>
          <p className="mt-5 text-lg text-muted">
            The page may have moved. Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/">Back to home</LinkButton>
            <LinkButton href="/donate" variant="secondary">
              Donate
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
