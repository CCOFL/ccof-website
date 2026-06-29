import { PILLARS } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * The model — tall vertical "pillar columns" with arched tops (rising toward
 * the logo arc), deliberately NOT horizontal cards, so they don't echo the
 * horizontal stat cards elsewhere (CCOF Brand Standards v1.1). Three live
 * pillars plus the in-development fourth, marked with the locked coral-dashed
 * full-color treatment rather than greyed/faded.
 */
export function Pillars() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PILLARS.map((pillar, i) => {
        const dev = pillar.status === "development";
        return (
          <Reveal key={pillar.number} delay={i * 80}>
            <article
              className={`group flex h-full min-h-[19rem] flex-col rounded-t-[2.5rem] rounded-b-2xl bg-cream p-6 pt-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                dev
                  ? "border-2 border-dashed border-coral"
                  : "border border-line hover:border-sage-light/60"
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Number in a darker-sage icon circle (brand: icon circles = #5F7658) */}
                <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-600 text-base font-extrabold text-cream">
                  {pillar.number}
                </span>
                {dev && (
                  <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-coral-deep">
                    In Development
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-lg font-bold">{pillar.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {pillar.body}
              </p>

              {/* Column base accent */}
              <span
                aria-hidden
                className={`mt-6 block h-1.5 w-10 rounded-full ${
                  dev ? "bg-coral" : "bg-sage"
                }`}
              />
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
