import { SUSTAINABILITY } from "@/lib/site";

/**
 * Light, sourced sustainability co-benefit callout. Secondary to the kids-first
 * mission. `variant` picks the fact that fits the page: "shop" (buying
 * secondhand → water avoided) or "give" (donating → landfill avoided).
 */
export function SustainabilityCallout({
  variant,
}: {
  variant: "shop" | "give";
}) {
  const item = SUSTAINABILITY[variant];
  return (
    <div className="mt-10 rounded-2xl border border-sage/30 bg-sage/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-coral-deep">
        {SUSTAINABILITY.eyebrow}
      </p>
      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        <span className="text-3xl font-extrabold text-sage-600">
          {item.stat}
        </span>
        <span className="text-sm leading-snug text-muted">
          {item.statCaption}
        </span>
      </div>
      <p className="measure mt-3 text-sm leading-relaxed text-ink/90">
        {item.body}
      </p>
      <p className="mt-3 text-xs text-muted">Source: {item.source}</p>
    </div>
  );
}
