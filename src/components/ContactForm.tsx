"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ORG } from "@/lib/site";

const INTENTS = [
  { value: "general", label: "General question" },
  { value: "donate", label: "Donating goods" },
  { value: "host", label: "Host a bin / drive" },
  { value: "partner", label: "Become a partner program" },
  { value: "volunteer", label: "Volunteer" },
  { value: "support", label: "Request support" },
] as const;

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({ initialIntent }: { initialIntent?: string }) {
  const validInitial = INTENTS.some((i) => i.value === initialIntent)
    ? (initialIntent as string)
    : "general";

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    intent: validInitial,
    message: "",
    company: "", // honeypot — kept empty by humans
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.email.trim()) next.email = "An email lets us reply.";
    else if (!isValidEmail(values.email))
      next.email = "That email doesn't look right.";
    if (!values.message.trim()) next.message = "Add a short message.";
    return next;
  }

  function update(field: keyof typeof values, value: string) {
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
      const res = await fetch("/api/contact", {
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
        <h3 className="mt-4 text-xl font-semibold">Message sent — thank you.</h3>
        <p className="mt-2 text-muted">
          We&apos;ve received your note and will reply to your email soon.
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
        id="name"
        label="Name"
        required
        error={errors.name}
        value={values.name}
        onChange={(v) => update("name", v)}
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
      {/* Phone is optional (brief §5) */}
      <Field
        id="phone"
        label="Phone"
        optional
        value={values.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
        type="tel"
      />

      <div>
        <label
          htmlFor="intent"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          What can we help with?
        </label>
        <select
          id="intent"
          value={values.intent}
          onChange={(e) => update("intent", e.target.value)}
          className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
        >
          {INTENTS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Message <span className="text-coral-deep">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong sending your message. Please email us directly at{" "}
          <a href={`mailto:${ORG.email}`} className="underline">
            {ORG.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
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
        {optional && (
          <span className="font-normal text-muted">(optional)</span>
        )}
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
