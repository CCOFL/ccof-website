"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ORG } from "@/lib/site";
import {
  Honeypot,
  Field,
  TextArea,
  CheckboxRow,
  SuccessCard,
  isValidEmail,
} from "./FormKit";

type Errors = Partial<
  Record<
    | "orgLegalName"
    | "ein"
    | "mission"
    | "counties"
    | "contactName"
    | "contactTitle"
    | "email"
    | "needs"
    | "is501c3"
    | "vettingAck",
    string
  >
>;
type Status = "idle" | "submitting" | "success" | "error";

function isEin(v: string) {
  return /^\d{2}-?\d{7}$/.test(v);
}

export function PartnerApplicationForm() {
  const [values, setValues] = useState({
    orgLegalName: "",
    ein: "",
    fdacsReg: "",
    website: "",
    mission: "",
    counties: "",
    contactName: "",
    contactTitle: "",
    email: "",
    phone: "",
    needs: "",
    volumeEstimate: "",
    message: "",
    company: "", // honeypot — kept empty by humans
  });
  const [is501c3, setIs501c3] = useState(false);
  const [vettingAck, setVettingAck] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): Errors {
    const next: Errors = {};
    if (!values.orgLegalName.trim())
      next.orgLegalName = "Your organization's legal name.";
    if (!values.ein.trim()) next.ein = "Your EIN helps us verify you.";
    else if (!isEin(values.ein.trim()))
      next.ein = "EIN format is XX-XXXXXXX (nine digits).";
    if (!values.mission.trim())
      next.mission = "A sentence or two about who you serve.";
    if (!values.counties.trim())
      next.counties = "Which Florida counties do you serve?";
    if (!values.contactName.trim()) next.contactName = "A contact name.";
    if (!values.contactTitle.trim())
      next.contactTitle = "Your role at the organization.";
    if (!values.email.trim()) next.email = "An email lets us reply.";
    else if (!isValidEmail(values.email))
      next.email = "That email doesn't look right.";
    if (!values.needs.trim())
      next.needs = "Tell us how goods would reach kids through your work.";
    if (!is501c3)
      next.is501c3 = "Partnership is for 501(c)(3) organizations.";
    if (!vettingAck)
      next.vettingAck = "Please acknowledge the verification step.";
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
      const res = await fetch("/api/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, is501c3, vettingAck }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <SuccessCard title="Application received — thank you.">
        We&apos;ll review it and reach out to begin the verification
        conversation. We&apos;re grateful for the work you do for kids, and
        we&apos;ll always be straight with you about what we can provide.
      </SuccessCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Honeypot value={values.company} onChange={(v) => update("company", v)} />

      <Field
        id="orgLegalName"
        label="Organization legal name"
        required
        error={errors.orgLegalName}
        value={values.orgLegalName}
        onChange={(v) => update("orgLegalName", v)}
        autoComplete="organization"
      />
      <Field
        id="ein"
        label="EIN (federal tax ID)"
        required
        error={errors.ein}
        value={values.ein}
        onChange={(v) => update("ein", v)}
        placeholder="XX-XXXXXXX"
      />
      <Field
        id="fdacsReg"
        label="Florida charitable registration # (FDACS)"
        optional
        error={undefined}
        value={values.fdacsReg}
        onChange={(v) => update("fdacsReg", v)}
        placeholder="CHxxxxx — if your organization solicits donations in Florida"
      />
      <Field
        id="website"
        label="Website"
        optional
        value={values.website}
        onChange={(v) => update("website", v)}
        placeholder="https://…"
      />
      <TextArea
        id="mission"
        label="Mission & who you serve"
        required
        error={errors.mission}
        rows={3}
        value={values.mission}
        onChange={(v) => update("mission", v)}
        placeholder="e.g. We support kinship families in Martin and St. Lucie counties with case management and emergency assistance."
      />
      <Field
        id="counties"
        label="Counties served"
        required
        error={errors.counties}
        value={values.counties}
        onChange={(v) => update("counties", v)}
        placeholder="e.g. Martin, St. Lucie"
      />
      <Field
        id="contactName"
        label="Contact name"
        required
        error={errors.contactName}
        value={values.contactName}
        onChange={(v) => update("contactName", v)}
        autoComplete="name"
      />
      <Field
        id="contactTitle"
        label="Contact title / role"
        required
        error={errors.contactTitle}
        value={values.contactTitle}
        onChange={(v) => update("contactTitle", v)}
        placeholder="e.g. Program Director"
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
      <TextArea
        id="needs"
        label="How would donated goods reach kids through your work?"
        required
        error={errors.needs}
        rows={4}
        value={values.needs}
        onChange={(v) => update("needs", v)}
        placeholder="Typical needs, how requests come to you, and how goods get to the child."
      />
      <Field
        id="volumeEstimate"
        label="About how many children/families per month?"
        optional
        value={values.volumeEstimate}
        onChange={(v) => update("volumeEstimate", v)}
        placeholder="A rough estimate is perfect"
      />

      <CheckboxRow
        checked={is501c3}
        onChange={(v) => {
          setIs501c3(v);
          if (errors.is501c3) setErrors((e) => ({ ...e, is501c3: undefined }));
        }}
        error={errors.is501c3}
      >
        Our organization is a registered <strong>501(c)(3)</strong> public
        charity serving children in foster care, kinship care, or crisis.
      </CheckboxRow>
      <CheckboxRow
        checked={vettingAck}
        onChange={(v) => {
          setVettingAck(v);
          if (errors.vettingAck)
            setErrors((e) => ({ ...e, vettingAck: undefined }));
        }}
        error={errors.vettingAck}
      >
        I understand CCOF verifies every partner (including IRS status) before
        fulfilling requests, and that partnership doesn&apos;t guarantee
        specific goods — CCOF matches what the community has given.
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
          Something went wrong sending your application. Please email us
          directly at{" "}
          <a href={`mailto:${ORG.email}`} className="underline">
            {ORG.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
