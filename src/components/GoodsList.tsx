import Link from "next/link";
import type { GoodsGroup } from "@/lib/site";

/**
 * One channel group from ACCEPTED_GOODS, rendered as plain lists: a lead-in
 * line (never a heading), pills for plain labels, and lines for entries that
 * carry a condition ("label: condition"). No rationale, no explanatory UI.
 * The optional link renders inside the lead-in so no element is added.
 */
export function GoodsList({
  leadIn,
  group,
  link,
  className,
}: {
  leadIn: string;
  group: GoodsGroup;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold text-ink">
        {leadIn}
        {link && (
          <>
            {" "}
            <Link
              href={link.href}
              className="font-semibold text-sage-600 underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          </>
        )}
      </p>
      <ul aria-label={leadIn} className="mt-3 flex flex-wrap gap-3">
        {group.pills.map((label) => (
          <li
            key={label}
            className="rounded-full border border-sage/30 bg-sage/5 px-4 py-2 text-sm font-medium text-ink"
          >
            {label}
          </li>
        ))}
      </ul>
      {group.lines.length > 0 && (
        <ul
          aria-label={`${leadIn} new and sealed items`}
          className="mt-3 space-y-1 text-sm leading-relaxed text-muted"
        >
          {group.lines.map((g) => (
            <li key={g.label}>
              <span className="font-medium text-ink">{g.label}</span>: {g.condition}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
