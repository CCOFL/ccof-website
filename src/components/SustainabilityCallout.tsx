import { SUSTAINABILITY } from "@/lib/site";

/**
 * Light sustainability co-benefit callout, secondary to the kids-first mission.
 * Leads with the landfill-diversion impact (bigger, universal, and positive
 * about reuse without knocking new-goods commerce); water conservation is a
 * lighter supporting note. `variant` picks the page-appropriate lead line.
 * Both sources render as clickable links for verifiable transparency.
 */
export function SustainabilityCallout({
  variant,
}: {
  variant: "shop" | "give";
}) {
  const s = SUSTAINABILITY;
  return (
    <div className="mt-10 rounded-2xl border border-sage/30 bg-sage/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-coral-deep">
        {s.eyebrow}
      </p>
      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        <span className="text-3xl font-extrabold text-sage-600">{s.stat}</span>
        <span className="text-sm leading-snug text-muted">
          {s.statCaption}
        </span>
      </div>
      <p className="measure mt-3 text-sm leading-relaxed text-ink/90">
        {s[variant]} {s.waterNote}
      </p>
      <p className="mt-3 text-xs text-muted">
        Sources:{" "}
        {s.sources.map((src, i) => (
          <span key={src.url}>
            {i > 0 && "; "}
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sage-600"
            >
              {src.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
