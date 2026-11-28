"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Field, CheckboxRow, Honeypot, SuccessCard, isValidEmail } from "./FormKit";
import { ORG } from "@/lib/site";
import { MOU_COPY } from "@/lib/partnerMou";
import { RECOGNITION_CHOICES, type RecognitionKey } from "@/content/partnerMouText";
import { trackConversion } from "@/lib/analytics";

type Choice = "" | "yes" | "no";
type TextKey = "orgLegalName" | "ein" | "signerName" | "signerTitle" | "email" | "signedDate" | "website";
type Errors = Partial<Record<TextKey | RecognitionKey | "signatureIntent", string>>;
type Status = "idle" | "submitting" | "success" | "error";

function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function PartnerMouForm() {
  const [values, setValues] = useState<Record<TextKey, string>>({
    orgLegalName: "",
    ein: "",
    signerName: "",
    signerTitle: "",
    email: "",
    signedDate: today(),
    website: "",
  });
  const [choices, setChoices] = useState<Record<RecognitionKey, Choice>>({
    recognizeName: "",
    recognizeLogo: "",
    recognizeWording: "",
  });
  const [signatureIntent, setSignatureIntent] = useState(false);
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(field: TextKey, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function choose(key: RecognitionKey, value: Choice) {
    setChoices((c) => ({ ...c, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.orgLegalName.trim()) next.orgLegalName = "Enter your organization's legal name.";
    if (!/^\d{2}-?\d{7}$/.test(values.ein.trim())) next.ein = "Enter the 9-digit EIN, for example 12-3456789.";
    if (!values.signerName.trim()) next.signerName = "Type your full name to sign.";
    if (!values.signerTitle.trim()) next.signerTitle = "Add your title.";
    if (!isValidEmail(values.email.trim())) next.email = "An email lets us send your signed copy.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.signedDate)) next.signedDate = "Add today's date.";
    for (const c of RECOGNITION_CHOICES) {
      if (!choices[c.key]) next[c.key] = "Please choose yes or no.";
    }
    if (!signatureIntent) next.signatureIntent = "Please confirm to sign.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/partner-mou", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...choices, signatureIntent, company }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      trackConversion("partner_mou_signed");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <SuccessCard title={MOU_COPY.sign.successTitle}>{MOU_COPY.sign.successBody}</SuccessCard>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Honeypot value={company} onChange={setCompany} />
      <Field id="orgLegalName" label="Organization legal name" required error={errors.orgLegalName}
        value={values.orgLegalName} onChange={(v) => update("orgLegalName", v)} autoComplete="organization" />
      <Field id="ein" label="EIN" required error={errors.ein} placeholder="12-3456789"
        value={values.ein} onChange={(v) => update("ein", v)} />

      <fieldset className="space-y-3">
        <legend className="mb-1.5 block text-sm font-medium text-ink">
          Section 8: public recognition. Our organization approves you to: <span className="text-coral-deep">*</span>
        </legend>
        {RECOGNITION_CHOICES.map((c) => (
          <div key={c.key} className="rounded-xl border border-line bg-cream p-4">
            <p id={`${c.key}-label`} className="text-sm leading-relaxed text-ink/90">{c.label}</p>
            <div role="radiogroup" aria-labelledby={`${c.key}-label`}
              aria-describedby={errors[c.key] ? `${c.key}-error` : undefined}
              className="mt-3 flex gap-6">
              {(["yes", "no"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-ink">
                  <input type="radio" name={c.key} value={opt} checked={choices[c.key] === opt}
                    onChange={() => choose(c.key, opt)} className="h-5 w-5 text-sage focus:ring-sage" />
                  {opt === "yes" ? "Yes" : "No"}
                </label>
              ))}
            </div>
            {errors[c.key] && (
              <p id={`${c.key}-error`} className="mt-1.5 text-sm text-red-700" role="alert">{errors[c.key]}</p>
            )}
          </div>
        ))}
        <p className="text-sm text-muted">{MOU_COPY.sign.logoNote}</p>
      </fieldset>

      <Field id="website" label="Your website, if you would like us to link to it" optional type="url"
        value={values.website} onChange={(v) => update("website", v)} placeholder="https://" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="signerName" label="Your full name (signature)" required error={errors.signerName}
          value={values.signerName} onChange={(v) => update("signerName", v)} autoComplete="name" />
        <Field id="signerTitle" label="Your title" required error={errors.signerTitle}
          value={values.signerTitle} onChange={(v) => update("signerTitle", v)} autoComplete="organization-title" />
        <Field id="email" label="Your email" type="email" required error={errors.email}
          value={values.email} onChange={(v) => update("email", v)} autoComplete="email" />
        <Field id="signedDate" label="Date" type="date" required error={errors.signedDate}
          value={values.signedDate} onChange={(v) => update("signedDate", v)} />
      </div>

      <CheckboxRow id="signatureIntent" checked={signatureIntent} required error={errors.signatureIntent}
        onChange={(v) => {
          setSignatureIntent(v);
          if (errors.signatureIntent) setErrors((e) => ({ ...e, signatureIntent: undefined }));
        }}>
        {MOU_COPY.sign.attestation}
      </CheckboxRow>

      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong recording your signature. Please email us at{" "}
          <a href={`mailto:${ORG.email}`} className="underline">{ORG.email}</a>.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing…" : "Sign the agreement"}
      </Button>
    </form>
  );
}
