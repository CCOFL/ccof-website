"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ORG } from "@/lib/site";

const URGENCY = [
  { value: "immediate", label: "Immediate — within 24–48 hours" },
  { value: "week", label: "Within a week" },
  { value: "flexible", label: "Flexible / planning ahead" },
] as const;

const FULFILLMENT = [
  { value: "partner-pickup", label: "Our organization will pick up from CCOF" },
  { value: "ccof-dropoff", label: "We'd like CCOF to drop off with us" },
  { value: "either", label: "Either works" },
] as const;

type Errors = Partial<
  Record<"orgName" | "contactName" | "email" | "goodsNeeded", string>
>;
type Status = "idle" | "submitting" | "success" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function PartnerRequestForm() {
  const [values, setValues] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    is501c3: false,
    urgency: "flexible",
    fulfillmentPref: "either",
    goodsNeeded: "",
    childDetails: "",
    message: "",
    company: "", // honeypot — kept empty by humans
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): Errors {
    const next: Errors = {};
    if (!values.orgName.trim()) next.orgName = "Tell us your organization.";
    if (!values.contactName.trim()) next.contactName = "Add a contact name.";
    if (!values.email.trim()) next.email = "An email lets us reply.";
    else if (!isValidEmail(values.email))
      next.email = "That email doesn't look right.";
    if (!values.goodsNeeded.trim())
      next.goodsNeeded = "Let us know what's needed.";
    return next;
  }

  function update(field: keyof typeof values, value: string | boolean) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field as keyof Errors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/partner-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-sage/30 bg-cream p-8 text-center"
        role="status"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage text-cream">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-draw"
            />
          </svg>
        </span>
        <h3 className="mt-4 text-xl font-semibold">Request received.</h3>
        <p className="mt-2 text-muted">
          Thank you — we&apos;ll review what&apos;s needed and reply to your
          email as soon as we can.
        </p>
        <style>{`
          .check-draw {
            stroke-dasharray: 30;
            stroke-dashoffset: 30;
            animation: check-draw 0.45s var(--ease-out-soft) forwards;
          }
          @keyframes check-draw { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            .check-draw { animation: none; stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot: hidden from users & AT, attractive to bots */}
      <div aria-hidden className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <Field
        id="orgName"
        label="Organization"
        required
        error={errors.orgName}
        value={values.orgName}
        onChange={(v) => update("orgName", v)}
        autoComplete="organization"
      />
      <Field
        id="contactName"
        label="Your name"
        required
        error={errors.contactName}
        value={values.contactName}
        onChange={(v) => update("contactName", v)}
        autoComplete="name"
      />
      <Field
        id="email"
        label="Email"
        type="email"
        required
        error={errors.email}
        value={values.email}
        onChange={(v) => update("email", v)}
        autoComplete="email"
      />
      <Field
        id="phone"
        label="Phone"
        optional
        value={values.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
        type="tel"
      />

      {/* 501(c)(3) attestation */}
      <label className="flex items-start gap-3 rounded-xl border border-line bg-cream p-4">
        <input
          type="checkbox"
          checked={values.is501c3}
          onChange={(e) => update("is501c3", e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-sage focus:ring-sage"
        />
        <span className="text-sm leading-relaxed text-ink/90">
          Our organization is a registered 501(c)(3) serving children in foster
          care, kinship care, or crisis. (New partners welcome — we&apos;ll
          confirm eligibility together.)
        </span>
      </label>

      {/* Urgency */}
      <div>
        <label
          htmlFor="urgency"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          How soon is it needed?
        </label>
        <select
          id="urgency"
          value={values.urgency}
          onChange={(e) => update("urgency", e.target.value)}
          className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
        >
          {URGENCY.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Goods needed */}
      <div>
        <label
          htmlFor="goodsNeeded"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          What&apos;s needed? <span className="text-coral-deep">*</span>
        </label>
        <textarea
          id="goodsNeeded"
          rows={4}
          required
          placeholder="e.g. Boy's clothing size 8, shoes size 2, a winter coat, and basic toiletries."
          value={values.goodsNeeded}
          onChange={(e) => update("goodsNeeded", e.target.value)}
          aria-invalid={errors.goodsNeeded ? true : undefined}
          aria-describedby={
            errors.goodsNeeded ? "goodsNeeded-error" : undefined
          }
          className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
        />
        {errors.goodsNeeded && (
          <p
            id="goodsNeeded-error"
            className="mt-1.5 text-sm text-red-700"
            role="alert"
          >
            {errors.goodsNeeded}
          </p>
        )}
      </div>

      {/* Child details (no PII) */}
      <div>
        <label
          htmlFor="childDetails"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Sizes &amp; ages{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="childDetails"
          rows={3}
          placeholder="Ages and sizes help us match. Please don't include the child's name or identifying details."
          value={values.childDetails}
          onChange={(e) => update("childDetails", e.target.value)}
          className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
        />
      </div>

      {/* Fulfillment preference */}
      <div>
        <label
          htmlFor="fulfillmentPref"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Getting the goods to the child
        </label>
        <select
          id="fulfillmentPref"
          value={values.fulfillmentPref}
          onChange={(e) => update("fulfillmentPref", e.target.value)}
          className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
        >
          {FULFILLMENT.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-sm text-muted">
          CCOF drop-off or delivery is available case by case, as capacity
          allows.
        </p>
      </div>

      {/* Anything else */}
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Anything else{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong sending your request. Please email us directly at{" "}
          <a href={`mailto:${ORG.email}`} className="underline">
            {ORG.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Submit request"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  optional,
  error,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}{" "}
        {required && <span className="text-coral-deep">*</span>}
        {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
