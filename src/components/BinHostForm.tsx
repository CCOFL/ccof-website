"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ORG } from "@/lib/site";
import {
  Honeypot,
  Field,
  TextArea,
  Select,
  CheckboxRow,
  SuccessCard,
  isValidEmail,
} from "./FormKit";

const ORG_TYPES = [
  { value: "business", label: "Business / retail" },
  { value: "school", label: "School" },
  { value: "congregation", label: "Church / congregation" },
  { value: "other", label: "Other" },
] as const;

const TIMING = [
  { value: "asap", label: "As soon as bins are available" },
  { value: "month", label: "Within the next month" },
  { value: "flexible", label: "Flexible / exploring" },
] as const;

type Errors = Partial<Record<"orgName" | "contactName" | "email" | "location", string>>;
type Status = "idle" | "submitting" | "success" | "error";

export function BinHostForm({
  defaultRequestType = "bin",
}: {
  defaultRequestType?: "bin" | "drive";
}) {
  const [values, setValues] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    orgType: "business",
    requestType: defaultRequestType as string,
    location: "",
    indoorOk: false,
    footTraffic: "",
    timing: "flexible",
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
    if (!values.location.trim())
      next.location = "Where would the bin live? City is fine.";
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
      const res = await fetch("/api/bin-host", {
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
      <SuccessCard title="Request received. Thank you!">
        We&apos;ll reach out to schedule a conversation about hosting. Thank you
        for opening your doors for local kids.
      </SuccessCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">
          How do you want to help?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {[
            {
              value: "bin",
              label: "Host a standing bin",
              hint: "A donation bin at your location, serviced by us.",
            },
            {
              value: "drive",
              label: "Run a one-time drive",
              hint: "Like Fill a Duffel. We hand you the list and collect when it wraps.",
            },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors ${
                values.requestType === opt.value
                  ? "border-sage bg-sage/5"
                  : "border-line bg-white hover:border-sage-light/60"
              }`}
            >
              <input
                type="radio"
                name="requestType"
                value={opt.value}
                checked={values.requestType === opt.value}
                onChange={() => update("requestType", opt.value)}
                className="mt-1 accent-[color:var(--color-sage,#748865)]"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">
                  {opt.hint}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Honeypot value={values.company} onChange={(v) => update("company", v)} />
      <Field
        id="orgName"
        label="Business / organization name"
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
        type="tel"
        value={values.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
      />
      <Select
        id="orgType"
        label="What kind of location?"
        value={values.orgType}
        onChange={(v) => update("orgType", v)}
        options={ORG_TYPES}
      />
      <Field
        id="location"
        label="Where is the location?"
        required
        error={errors.location}
        value={values.location}
        onChange={(v) => update("location", v)}
        placeholder="City or address, e.g. Stuart near US-1"
      />
      <CheckboxRow
        checked={values.indoorOk}
        onChange={(v) => update("indoorOk", v)}
      >
        We have an <strong>indoor spot</strong>{" "}available for the bin (our
        collection bins live indoors, out of the weather, roughly 2&times;2
        feet of floor space).
      </CheckboxRow>
      <Field
        id="footTraffic"
        label="About how many people come through weekly?"
        optional
        value={values.footTraffic}
        onChange={(v) => update("footTraffic", v)}
        placeholder="A rough guess is perfect"
      />
      <Select
        id="timing"
        label="When would you like to start?"
        value={values.timing}
        onChange={(v) => update("timing", v)}
        options={TIMING}
      />
      <TextArea
        id="message"
        label="Anything else"
        optional
        rows={3}
        value={values.message}
        onChange={(v) => update("message", v)}
      />

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
        {status === "submitting" ? "Sending…" : "Request to host a bin"}
      </Button>
    </form>
  );
}
