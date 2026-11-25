/**
 * Date gate for the December 2026 PayPal match note on /donate.
 *
 * True only while the America/New_York calendar date is in December 2026.
 * Year-pinned on purpose: PayPal's terms cover this one offer (12:00 a.m. PT
 * December 1 through 11:59:59 p.m. PT December 31, 2026), so the note must
 * never resurrect in a later December without a fresh founder decision.
 */
export function isDecemberMatchWindow(now: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);
  const get = (type: "year" | "month") =>
    Number(parts.find((p) => p.type === type)?.value);
  return get("year") === 2026 && get("month") === 12;
}
