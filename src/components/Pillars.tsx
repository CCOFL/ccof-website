import { PILLARS } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * The model — three live pillars plus the in-development fourth, clearly
 * marked rather than left as an unfinished "coming soon" line (brief §5).
 */
export function Pillars() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {PILLARS.map((pillar, i) => {
        const dev = pillar.status === "development";
        return (
          <Reveal key={pillar.number} delay={i * 80}>
            <article
              className={`group h-full rounded-2xl border p-6 shadow-card transition-all duration-300 ${
                dev
                  ? "border-dashed border-line bg-cream/60"
                  : "border-line bg-white hover:-translate-y-1 hover:border-sage-light/60 hover:shadow-card-hover"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-semibold text-sage-light">
                  {pillar.number}
                </span>
                {dev && (
                  <span className="rounded-full bg-cream-dark px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                    In development
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {pillar.body}
              </p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
