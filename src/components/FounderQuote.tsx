import { FOUNDER_QUOTE } from "@/lib/site";
import { Reveal } from "./Reveal";

/** Designed founder pull-quote, featured near the top of Home (brief §5). */
export function FounderQuote() {
  return (
    <Reveal>
      <figure className="relative mx-auto max-w-3xl text-center">
        <span
          aria-hidden
          className="pointer-events-none block font-serif text-7xl leading-none text-sage-light/40"
        >
          &ldquo;
        </span>
        <blockquote className="-mt-6 font-serif text-2xl italic leading-snug text-ink sm:text-[1.75rem]">
          {FOUNDER_QUOTE.text}
        </blockquote>
        <figcaption className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted">
          {FOUNDER_QUOTE.name}
          <span className="mx-2 text-line" aria-hidden>
            |
          </span>
          <span className="font-medium normal-case tracking-normal">
            {FOUNDER_QUOTE.title}
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
