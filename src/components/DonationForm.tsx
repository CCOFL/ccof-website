"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "./Button";
import { DONATION_PRESETS } from "@/lib/site";

type Frequency = "one-time" | "monthly";

const MIN = 5;

export function DonationForm() {
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [selected, setSelected] = useState<number | "other">(
    DONATION_PRESETS[1].amount,
  );
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const customId = useId();

  const amount = selected === "other" ? Number(custom) : selected;
  const validAmount = Number.isFinite(amount) && amount >= MIN;

  const outcome = useMemo(() => {
    const preset = DONATION_PRESETS.find((p) => p.amount === selected);
    return preset?.outcome ?? null;
  }, [selected]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validAmount) {
      setError(`Please enter an amount of at least $${MIN}.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Frequency segmented control (brief §6) */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">
          Gift frequency
        </legend>
        <div
          role="radiogroup"
          aria-label="Gift frequency"
          className="grid grid-cols-2 gap-1 rounded-full border border-line bg-cream p-1"
        >
          {(["one-time", "monthly"] as Frequency[]).map((f) => {
            const active = frequency === f;
            return (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFrequency(f)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-sage text-cream shadow-sm"
                    : "text-ink/70 hover:text-sage"
                }`}
              >
                {f === "one-time" ? "One-time" : "Monthly"}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Preset amounts segmented control */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">
          Choose an amount
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DONATION_PRESETS.map((preset) => {
            const active = selected === preset.amount;
            return (
              <button
                key={preset.amount}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(preset.amount)}
                className={`min-h-[52px] rounded-xl border text-lg font-semibold transition-all duration-200 ${
                  active
                    ? "border-sage bg-sage text-cream shadow-card"
                    : "border-line bg-cream text-ink hover:border-sage-light"
                }`}
              >
                ${preset.amount}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={selected === "other"}
            onClick={() => setSelected("other")}
            className={`min-h-[52px] rounded-xl border text-base font-semibold transition-all duration-200 ${
              selected === "other"
                ? "border-sage bg-sage text-cream shadow-card"
                : "border-line bg-cream text-ink hover:border-sage-light"
            }`}
          >
            Other
          </button>
        </div>

        {selected === "other" && (
          <div className="mt-4">
            <label htmlFor={customId} className="mb-1.5 block text-sm text-muted">
              Enter an amount (USD)
            </label>
            <div className="relative max-w-[200px]">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink">
                $
              </span>
              <input
                id={customId}
                type="number"
                inputMode="decimal"
                min={MIN}
                step="1"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="75"
                className="min-h-[48px] w-full rounded-xl border border-line bg-cream pl-8 pr-4 text-lg text-ink focus:border-sage focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}
      </fieldset>

      {/* Outcome framing (brief priority #2) */}
      <p
        className="min-h-[1.5rem] text-sm text-muted"
        aria-live="polite"
      >
        {outcome && (
          <>
            <strong className="font-semibold text-sage">
              ${selected as number}
            </strong>{" "}
            = {outcome}
            {frequency === "monthly" ? ", every month" : ""}.
          </>
        )}
      </p>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading
          ? "Redirecting to secure checkout…"
          : validAmount
            ? `Give $${amount}${frequency === "monthly" ? "/mo" : ""}`
            : "Continue to secure checkout"}
      </Button>

      <p className="text-xs text-muted">
        Payments are processed securely by Stripe. You&apos;ll receive an emailed
        receipt for your tax-deductible gift.
      </p>
    </form>
  );
}
