import { marqueeGoods } from "@/lib/site";

/** Looping marquee of items we collect (brief §6). Pauses on hover; static under reduced motion.
 *  Chips come from ACCEPTED_GOODS via marqueeGoods(): labels only, sealed
 *  items marked "(sealed)", no channel distinction (glance surface). */
export function CollectMarquee() {
  const base = marqueeGoods();
  // Duplicate the list so the -50% translate loops seamlessly.
  const chips = [...base, ...base];
  return (
    <div
      className="marquee-wrap overflow-hidden"
      role="list"
      aria-label="What we collect"
    >
      <div className="marquee gap-3 py-1">
        {chips.map((chip, i) => (
          <span
            key={`${chip}-${i}`}
            role="listitem"
            aria-hidden={i >= base.length ? true : undefined}
            className="whitespace-nowrap rounded-full border border-line bg-cream px-4 py-2 text-sm font-medium text-ink/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-sage-light hover:text-ink"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
