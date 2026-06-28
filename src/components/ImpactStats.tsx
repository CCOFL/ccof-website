import { IMPACT_STATS, IMPACT_SOURCES } from "@/lib/site";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

/** Impact data grid with count-up on scroll (brief §6). */
export function ImpactStats({ onDark = false }: { onDark?: boolean }) {
  return (
    <div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {IMPACT_STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <div>
              <dt className="sr-only">{stat.label}</dt>
              <dd
                className={`font-serif text-4xl font-semibold sm:text-5xl ${
                  onDark ? "text-cream" : "text-sage"
                }`}
              >
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
              <p
                className={`mt-2 text-sm leading-snug ${
                  onDark ? "text-cream/75" : "text-muted"
                }`}
              >
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </dl>
      <p
        className={`mt-10 text-xs ${onDark ? "text-cream/50" : "text-muted/80"}`}
      >
        {IMPACT_SOURCES}
      </p>
    </div>
  );
}
