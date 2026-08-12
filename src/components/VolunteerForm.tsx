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

const INTERESTS = [
  { value: "sorting", label: "Sorting & closet prep" },
  { value: "drives", label: "Donation drives & events" },
  { value: "outreach", label: "Community outreach" },
  { value: "flexible", label: "Wherever I'm needed" },
] as const;

const AVAILABILITY = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "either", label: "Either" },
] as const;

type Errors = Partial<Record<"name" | "email" | "adult", string>>;
type Status = "idle" | "submitting" | "success" | "error";

export function VolunteerForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    availability: "either",
    message: "",
    company: "", // honeypot — kept empty by humans
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [adult, setAdult] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.email.trim()) next.email = "An email lets us reply.";
    else if (!isValidEmail(values.email))
      next.email = "That email doesn't look right.";
    if (!adult)
      next.adult =
        "Volunteer signups are for adults 18+ for now. Thank you for understanding.";
    return next;
  }

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field as keyof Errors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  }

  function toggleInterest(value: string) {
    setInterests((list) =>
      list.includes(value) ? list.filter((i) => i !== value) : [...list, value],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, interests, adult }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <SuccessCard title="You're on the list.">
        Thank you! We&apos;ll reach out as Volunteer Service launches and
        opportunities open up. It means a lot that you raised your hand.
      </SuccessCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Honeypot value={values.company} onChange={(v) => update("company", v)} />
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
      <Field
        id="phone"
        label="Phone"
        optional
        type="tel"
        value={values.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
      />

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-ink">
          What sounds interesting?{" "}
          <span className="font-normal text-muted">(pick any)</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {INTERESTS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3"
            >
              <input
                type="checkbox"
                checked={interests.includes(opt.value)}
                onChange={() => toggleInterest(opt.value)}
                className="h-5 w-5 shrink-0 rounded border-line text-sage focus:ring-sage"
              />
              <span className="text-sm text-ink/90">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Select
        id="availability"
        label="When are you generally available?"
        value={values.availability}
        onChange={(v) => update("availability", v)}
        options={AVAILABILITY}
      />

      <CheckboxRow
        checked={adult}
        onChange={(v) => {
          setAdult(v);
          if (errors.adult) setErrors((e) => ({ ...e, adult: undefined }));
        }}
        error={errors.adult}
      >
        I&apos;m 18 or older. <span className="text-muted">(Volunteer
        opportunities for younger helpers and families are coming later.)</span>
      </CheckboxRow>

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
          Something went wrong sending your signup. Please email us directly at{" "}
          <a href={`mailto:${ORG.email}`} className="underline">
            {ORG.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Count me in"}
      </Button>
    </form>
  );
}
