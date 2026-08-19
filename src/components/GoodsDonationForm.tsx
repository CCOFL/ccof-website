"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ORG } from "@/lib/site";
import { GOODS_CATEGORIES, GOODS_QUANTITY_BANDS } from "@/lib/forms";
import {
  Honeypot,
  Field,
  Select,
  SuccessCard,
  isValidEmail,
} from "./FormKit";

type Errors = Partial<
  Record<"firstName" | "email" | "categories" | "otherDescription" | "zip", string>
>;
type Status = "idle" | "submitting" | "success" | "error";

const QUANTITY_OPTIONS = [
  { value: "", label: "Choose one (optional)" },
  ...GOODS_QUANTITY_BANDS,
];

export function GoodsDonationForm({ initialBin }: { initialBin?: string }) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otherDescription: "",
    quantityBand: "",
    zip: "",
    company: "", // honeypot — kept empty by humans
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [receiptSent, setReceiptSent] = useState(true);

  const hasOther = categories.includes("other");

  function validate(): Errors {
    const next: Errors = {};
    if (!values.firstName.trim()) next.firstName = "Your first name.";
    if (!values.email.trim())
      next.email = "We need an email to send your receipt.";
    else if (!isValidEmail(values.email))
      next.email = "That email doesn't look right.";
    if (categories.length === 0)
      next.categories = "Check at least one so your receipt can describe it.";
    if (hasOther && !values.otherDescription.trim())
      next.otherDescription = "A few words about what you gave.";
    if (values.zip.trim() && !/^\d{5}$/.test(values.zip.trim()))
      next.zip = "Five digits, like 34997.";
    return next;
  }

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field as keyof Errors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  }

  function toggleCategory(value: string) {
    setCategories((list) =>
      list.includes(value) ? list.filter((c) => c !== value) : [...list, value],
    );
    if (errors.categories)
      setErrors((e) => ({ ...e, categories: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/goods-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          categories,
          emailOptIn,
          binSlug: initialBin || "",
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { receiptSent?: boolean };
      setReceiptSent(data.receiptSent !== false);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <SuccessCard title="Thank you for giving!">
        {receiptSent ? (
          <>
            Your receipt is on its way to{" "}
            <strong className="text-ink/90">{values.email}</strong>. Every item
            you gave goes toward supporting local kids.
          </>
        ) : (
          <>
            Your donation is recorded and your receipt will follow by email
            shortly. Every item you gave goes toward supporting local kids.
          </>
        )}
      </SuccessCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Honeypot value={values.company} onChange={(v) => update("company", v)} />

      {initialBin && (
        <p className="rounded-xl border border-sage/40 bg-sage/5 px-4 py-2.5 text-sm text-ink/90">
          Donation bin: <strong>{initialBin}</strong>
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          label="First name"
          required
          error={errors.firstName}
          value={values.firstName}
          onChange={(v) => update("firstName", v)}
          autoComplete="given-name"
        />
        <Field
          id="lastName"
          label="Last name"
          optional
          value={values.lastName}
          onChange={(v) => update("lastName", v)}
          autoComplete="family-name"
        />
      </div>
      <Field
        id="email"
        label="Email for your receipt"
        type="email"
        required
        error={errors.email}
        value={values.email}
        onChange={(v) => update("email", v)}
        autoComplete="email"
      />

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-ink">
          What did you donate? <span className="text-coral-deep">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {GOODS_CATEGORIES.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3"
            >
              <input
                type="checkbox"
                checked={categories.includes(opt.value)}
                onChange={() => toggleCategory(opt.value)}
                className="h-5 w-5 shrink-0 rounded border-line text-sage focus:ring-sage"
              />
              <span className="text-sm text-ink/90">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.categories}
          </p>
        )}
      </fieldset>

      <div aria-live="polite" className="space-y-5">
        {hasOther && (
          <Field
            id="otherDescription"
            label="Other, please describe"
            required
            error={errors.otherDescription}
            value={values.otherDescription}
            onChange={(v) => update("otherDescription", v)}
            placeholder="e.g. A stroller and a high chair"
          />
        )}
      </div>

      <Select
        id="quantityBand"
        label="Roughly how much?"
        value={values.quantityBand}
        onChange={(v) => update("quantityBand", v)}
        options={QUANTITY_OPTIONS}
      />

      <Field
        id="zip"
        label="ZIP code"
        optional
        error={errors.zip}
        value={values.zip}
        onChange={(v) => update("zip", v)}
        placeholder="34997"
        autoComplete="postal-code"
      />

      <label className="flex items-start gap-3 rounded-xl border border-line bg-cream p-4">
        <input
          type="checkbox"
          checked={emailOptIn}
          onChange={(e) => setEmailOptIn(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-sage focus:ring-sage"
        />
        <span className="text-sm leading-relaxed text-ink/90">
          Send me occasional updates about where donations go.
        </span>
      </label>

      <p className="text-sm leading-relaxed text-muted">
        We are grateful for your donation. You will receive a receipt by email
        in a moment. Because the IRS requires donors to determine the value of
        donated goods themselves, our receipt describes what you gave but does
        not assign it a dollar value.
      </p>

      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong recording your donation. Please email us
          directly at{" "}
          <a href={`mailto:${ORG.email}`} className="underline">
            {ORG.email}
          </a>
          .
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send my receipt"}
      </Button>
    </form>
  );
}
