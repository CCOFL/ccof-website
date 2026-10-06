import type { ImpactTile } from "@/lib/impact";
import { Reveal } from "./Reveal";

/**
 * Stat tiles for a monthly impact period (home "by the numbers" section and
 * /impact). Real text, never images; follows the ImpactStats dl pattern and
 * the site's card style. Four across on desktop, two on tablet, one on phone.
 */
export function ImpactPeriodTiles({
  tiles,
  cardBg = "bg-white",
}: {
  tiles: ImpactTile[];
  cardBg?: "bg-white" | "bg-cream";
}) {
  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, i) => (
        <Reveal key={tile.unit} delay={i * 80}>
          <div
            className={`flex h-full flex-col rounded-2xl border border-line ${cardBg} p-6 shadow-card`}
          >
            <dt className="sr-only">
              {tile.value} {tile.unit}: {tile.caption}
            </dt>
            <dd>
              <span className="block font-serif text-4xl font-semibold text-sage sm:text-5xl">
                {tile.value}
              </span>
              <span className="mt-1 block text-sm font-semibold uppercase tracking-wider text-coral-deep">
                {tile.unit}
              </span>
              <span className="mt-2 block text-sm leading-snug text-muted">
                {tile.caption}
              </span>
            </dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}
