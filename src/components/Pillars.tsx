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
              className={`group h-full rounded-2xl bg-cream p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                dev
                  ? "border-2 border-dashed border-coral"
                  : "border border-line hover:border-sage-light/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-sage-600">
                  {pillar.number}
                </span>
                {dev && (
                  <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-coral-deep">
                    In Development
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-bold">{pillar.title}</h3>
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
