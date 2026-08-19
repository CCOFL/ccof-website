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
    | "vettingAck"
    | "publicityPreference"
    | "mediaContactName"
    | "mediaContactEmail",
    string
  >
>;
type Status = "idle" | "submitting" | "success" | "error";

function isEin(v: string) {
  return /^\d{2}-?\d{7}$/.test(v);
}

const PUBLICITY_OPTIONS = [
  {
    value: "may_name",
    label:
      "Yes, you may name our organization in your website, social media, newsletters, and donor materials.",
  },
  {
    value: "may_name_with_review",
    label:
      "Yes, but we would like to review materials that name us before they are published.",
  },
  {
    value: "do_not_name",
    label: "We prefer not to be named publicly at this time.",
  },
] as const;

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
    mediaContactName: "",
    mediaContactEmail: "",
    company: "", // honeypot — kept empty by humans
  });
  const [is501c3, setIs501c3] = useState(false);
  const [vettingAck, setVettingAck] = useState(false);
  const [publicityPreference, setPublicityPreference] = useState("");
  const [logoUsePermitted, setLogoUsePermitted] = useState(false);
  const mayName =
    publicityPreference === "may_name" ||
    publicityPreference === "may_name_with_review";
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
    if (!publicityPreference)
      next.publicityPreference =
        "Please choose how we may recognize your organization.";
    if (mayName) {
      if (!values.mediaContactName.trim())
        next.mediaContactName = "Who should we reach about media materials?";
      if (!values.mediaContactEmail.trim())
        next.mediaContactEmail = "An email for media questions.";
      else if (!isValidEmail(values.mediaContactEmail))
        next.mediaContactEmail = "That email doesn't look right.";
    } else if (
      values.mediaContactEmail.trim() &&
      !isValidEmail(values.mediaContactEmail)
    ) {
      next.mediaContactEmail = "That email doesn't look right.";
    }
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
        body: JSON.stringify({
          ...values,
          is501c3,
          vettingAck,
          publicityPreference,
          // do_not_name always submits logo permission as false.
          logoUsePermitted: mayName ? logoUsePermitted : false,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <SuccessCard title="Application received. Thank you!">
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
        placeholder="CHxxxxx, if your organization solicits donations in Florida"
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

      {/* Recognition and media consent (migration 0008). Copy is founder-
          approved verbatim; do not reword without sign-off. */}
      <div className="border-t border-line pt-5">
        <h3 className="text-base font-bold text-ink">Recognition and media</h3>
        <p className="mt-1.5 text-sm text-muted">
          We want our community to know which organizations their generosity
          supports, and we want you in full control of how your organization is
          represented.
        </p>
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-ink">
          May we name your organization publicly?{" "}
          <span className="text-coral-deep">*</span>
        </legend>
        <div className="space-y-2">
          {PUBLICITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-start gap-3 rounded-xl border border-line bg-cream px-4 py-3"
            >
              <input
                type="radio"
                name="publicityPreference"
                value={opt.value}
                checked={publicityPreference === opt.value}
                onChange={() => {
                  setPublicityPreference(opt.value);
                  if (opt.value === "do_not_name") setLogoUsePermitted(false);
                  if (errors.publicityPreference)
                    setErrors((e) => ({ ...e, publicityPreference: undefined }));
                }}
                className="mt-0.5 h-5 w-5 shrink-0 border-line text-sage focus:ring-sage"
              />
              <span className="text-sm leading-relaxed text-ink/90">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {errors.publicityPreference && (
          <p className="mt-1.5 text-sm text-red-700" role="alert">
            {errors.publicityPreference}
          </p>
        )}
        <p className="mt-1.5 text-sm text-muted">
          You can change this at any time by contacting us.
        </p>
      </fieldset>

      <CheckboxRow
        checked={mayName ? logoUsePermitted : false}
        onChange={(v) => setLogoUsePermitted(v)}
        disabled={!mayName}
      >
        You may also use our organization&apos;s logo in those materials.
      </CheckboxRow>

      <div aria-live="polite" className="space-y-5">
        {mayName && (
          <>
            <Field
              id="mediaContactName"
              label="Media contact name"
              required
              error={errors.mediaContactName}
              value={values.mediaContactName}
              onChange={(v) => update("mediaContactName", v)}
              autoComplete="name"
            />
            <Field
              id="mediaContactEmail"
              label="Media contact email"
              type="email"
              required
              error={errors.mediaContactEmail}
              value={values.mediaContactEmail}
              onChange={(v) => update("mediaContactEmail", v)}
              autoComplete="email"
            />
          </>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-line bg-cream p-4 text-sm leading-relaxed text-muted">
        <p>
          <strong className="text-ink/90">Images of children.</strong>{" "}The
          Children&apos;s Collective of Florida does not photograph, film, or
          publish images of children served by our partner organizations, or of
          partner facility interiors, without that organization&apos;s prior
          written permission. If your organization ever wishes to share
          approved images, we will handle that separately and in writing.
        </p>
        <p>
          <strong className="text-ink/90">Using our name.</strong>{" "}You are
          welcome to name The Children&apos;s Collective of Florida as a
          partner in your own communications. Please contact us before using
          our logo so we can send you current brand files.
        </p>
      </div>

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
        specific goods; CCOF matches what the community has given.
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
