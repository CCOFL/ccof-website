"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ORG } from "@/lib/site";
import {
  Honeypot,
  Field,
  TextArea,
  Select,
  SuccessCard,
  isValidEmail,
} from "./FormKit";

const VOLUME = [
  { value: "few-bags", label: "A few bags or boxes" },
  { value: "carload", label: "A carload" },
  { value: "large", label: "Larger — furniture or many boxes" },
  { value: "unsure", label: "Not sure yet" },
] as const;

const WINDOWS = [
  { value: "weekday-day", label: "Weekdays, daytime" },
  { value: "weekday-evening", label: "Weekdays, evening" },
  { value: "weekend", label: "Weekends" },
  { value: "any", label: "Flexible — any of these" },
] as const;

type Errors = Partial<Record<"name" | "email" | "pickupArea" | "items", string>>;
type Status = "idle" | "submitting" | "success" | "error";

export function PickupRequestForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    pickupArea: "",
    items: "",
    volume: "few-bags",
    windows: "any",
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
    if (!values.pickupArea.trim())
      next.pickupArea = "City or neighborhood helps us plan the route.";
    if (!values.items.trim()) next.items = "A quick list of what you have.";
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
      const res = await fetch("/api/pickup-request", {
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
      <SuccessCard title="Pickup request received.">
        Thank you! We&apos;ll reply to your email to confirm a time that works.
        Pickups are scheduled as our volunteer capacity allows.
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
      <Field
        id="pickupArea"
        label="Pickup area"
        required
        error={errors.pickupArea}
        value={values.pickupArea}
        onChange={(v) => update("pickupArea", v)}
        placeholder="City or neighborhood — e.g. Palm City"
      />
      <TextArea
        id="items"
        label="What are you donating?"
        required
        error={errors.items}
        rows={4}
        value={values.items}
        onChange={(v) => update("items", v)}
        placeholder="e.g. Kids' clothes (sizes 4–8), a stroller, and two boxes of books."
      />
      <Select
        id="volume"
        label="About how much?"
        value={values.volume}
        onChange={(v) => update("volume", v)}
        options={VOLUME}
      />
      <Select
        id="windows"
        label="When works best?"
        value={values.windows}
        onChange={(v) => update("windows", v)}
        options={WINDOWS}
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
        {status === "submitting" ? "Sending…" : "Request a pickup"}
      </Button>
    </form>
  );
}
