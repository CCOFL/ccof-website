import Link from "next/link";
import { IMPACT_STATS, IMPACT_SOURCES } from "@/lib/site";
import type { ImpactStat } from "@/lib/impact";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

/**
 * Impact data grid with count-up on scroll (brief §6). `stats` come from
 * Supabase (live) via the page; defaults to the hardcoded values as a fallback.
 */
export function ImpactStats({
  onDark = false,
  stats = IMPACT_STATS,
}: {
  onDark?: boolean;
  stats?: ImpactStat[];
}) {
  return (
    <div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          // Reveal renders the group <div>; each group holds one dt + dd.
          <Reveal key={stat.label} delay={i * 80}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span
                className={`block font-serif text-4xl font-semibold sm:text-5xl ${
                  onDark ? "text-cream" : "text-sage"
                }`}
              >
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </span>
              <span
                className={`mt-2 block text-sm leading-snug ${
                  onDark ? "text-cream/75" : "text-muted"
                }`}
              >
                {stat.label}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>
      <p
        className={`mt-10 text-xs ${onDark ? "text-cream/75" : "text-muted"}`}
      >
        {IMPACT_SOURCES}{" "}
        <Link
          href="/sources"
          className={`underline underline-offset-2 ${
            onDark ? "hover:text-cream" : "hover:text-sage-600"
          }`}
        >
          See sources &amp; methodology →
        </Link>
      </p>
    </div>
  );
}
