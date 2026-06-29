import { COLLECT_CHIPS } from "@/lib/site";

/** Looping marquee of items we collect (brief §6). Pauses on hover; static under reduced motion. */
export function CollectMarquee() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const chips = [...COLLECT_CHIPS, ...COLLECT_CHIPS];
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
            aria-hidden={i >= COLLECT_CHIPS.length ? true : undefined}
            className="whitespace-nowrap rounded-full border border-line bg-cream px-4 py-2 text-sm font-medium text-ink/80"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
