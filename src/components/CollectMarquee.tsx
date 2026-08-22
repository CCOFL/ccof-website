import { marqueeGoods, storeMarqueeGoods } from "@/lib/site";

/** Looping marquee of items we collect (brief §6). Pauses on hover; static under reduced motion.
 *  Chips come from ACCEPTED_GOODS: the "donate" variant (homepage) shows
 *  labels only with sealed items marked "(sealed)", no channel distinction;
 *  the "store" variant (Collective Kids Closet page) shows the resale-
 *  appropriate subset and omits sealed consumables entirely. */
export function CollectMarquee({
  variant = "donate",
}: {
  variant?: "donate" | "store";
}) {
  const base = variant === "store" ? storeMarqueeGoods() : marqueeGoods();
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
