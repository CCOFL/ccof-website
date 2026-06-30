import Link from "next/link";
import { WHERE_IT_GOES } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * Homepage teaser that surfaces the "Where It Goes" transparency page in the
 * page body, not just the footer (brief task 5). Shows our three transparency
 * pledges as a mini breakdown that fades up on scroll, plus a direct link.
 */
export function WhereItGoesTeaser() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-cream/85">
          Trust, in writing
        </p>
        <h2 className="text-3xl font-bold text-cream sm:text-4xl">
          Where your gift goes
        </h2>
        <p className="measure mt-4 text-base leading-relaxed text-cream/80">
          We&apos;re a new organization, so we put our commitments in writing
          from day one — and we&apos;ll report against them starting with our
          first season.
        </p>
        <Link
          href="/where-it-goes"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-cream underline-offset-4 hover:underline"
        >
          See exactly where it goes →
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        {WHERE_IT_GOES.pledges.map((pledge, i) => (
          <Reveal as="li" key={pledge.title} delay={i * 90}>
            <div className="h-full rounded-2xl bg-cream/10 p-5 ring-1 ring-cream/15">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full bg-cream/15 text-sm font-extrabold text-cream"
              >
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-semibold leading-snug text-cream">
                {pledge.title}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
