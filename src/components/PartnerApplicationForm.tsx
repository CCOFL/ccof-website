"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { ORG } from "@/lib/site";
import { trackConversion } from "@/lib/analytics";
import {
  validatePartnerApplication,
  normalizePartnerApplication,
  mayNamePublicly,
  FIELD_ORDER,
  type PartnerApplicationValues,
  type PartnerApplicationErrors,
} from "@/lib/partnerApplicationRules";
import {
  Honeypot,
  Field,
  TextArea,
  CheckboxRow,
  SuccessCard,
} from "./FormKit";

type Status = "idle" | "submitting" | "success" | "error";

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

/** Today's date in the user's own timezone (a UTC slice can be tomorrow). */
function localToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function PartnerApplicationForm() {
  const [values, setValues] = useState({
    orgLegalName: "",
    ein: "",
    fdacsStatus: "",
    fdacsReg: "",
    fdacsExemptionBasis: "",
    sunbizDoc: "",
    irsLetterUrl: "",
    website: "",
    streetAddress: "",
    city: "",
    // Most applicants are Florida organizations; editable like any field.
    state: "FL",
    zip: "",
    phone: "",
    mission: "",
    counties: "",
    referralSources: "",
    contactName: "",
    contactTitle: "",
    email: "",
    needs: "",
    volumeEstimate: "",
    relatedParty: "",
    relatedPartyDetail: "",
    signerName: "",
    signerTitle: "",
    signerDate: "",
    message: "",
    company: "", // honeypot, kept empty by humans
  });
  const [signerIsContact, setSignerIsContact] = useState(false);
  const [goodsDirectAck, setGoodsDirectAck] = useState(false);
  const [childPrivacyAck, setChildPrivacyAck] = useState(false);
  const [vettingAck, setVettingAck] = useState(false);
  const [publicityPreference, setPublicityPreference] = useState("");
  const [logoUsePermitted, setLogoUsePermitted] = useState(false);
  const mayName = mayNamePublicly(publicityPreference);
  const [errors, setErrors] = useState<PartnerApplicationErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  // Auto-fill today's date after mount: computing it during render would
  // make the server and browser disagree and break hydration, so this is
  // the legitimate client-only-initialization case the lint rule allows for.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues((v) => (v.signerDate ? v : { ...v, signerDate: localToday() }));
  }, []);

  /** The complete, branch-normalized value set the rules validate. */
  function fullValues(): PartnerApplicationValues {
    return normalizePartnerApplication({
      ...values,
      signerName: signerIsContact ? values.contactName : values.signerName,
      signerTitle: signerIsContact ? values.contactTitle : values.signerTitle,
      goodsDirectAck,
      childPrivacyAck,
      vettingAck,
      publicityPreference,
    });
  }

  /** Where the first-error focus lands; signer errors route to the contact
   *  fields while "I am the authorized signer" hides the signer inputs. */
  function focusIdFor(key: keyof PartnerApplicationValues): string {
    if (signerIsContact && key === "signerName") return "contactName";
    if (signerIsContact && key === "signerTitle") return "contactTitle";
    const fixed: Partial<Record<keyof PartnerApplicationValues, string>> = {
      fdacsStatus: "fdacs-registered",
      relatedParty: "relatedParty-yes",
      publicityPreference: "publicity-may_name",
    };
    return fixed[key] ?? key;
  }

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field as keyof PartnerApplicationErrors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
    // In signing-as-contact mode the contact fields ARE the signature.
    if (signerIsContact && field === "contactName") clearError("signerName");
    if (signerIsContact && field === "contactTitle") clearError("signerTitle");
  }

  function clearError(field: keyof PartnerApplicationErrors) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const full = fullValues();
    const found = validatePartnerApplication(full);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = FIELD_ORDER.find((k) => found[k]);
      if (first) document.getElementById(focusIdFor(first))?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...full,
          message: values.message,
          company: values.company,
          // do_not_name always submits logo permission as false.
          logoUsePermitted: mayName ? logoUsePermitted : false,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      trackConversion("partner_application");
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
        label="Legal name exactly as shown on your IRS determination letter"
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

      {/* FDACS: registration number OR a claimed exemption; one is required. */}
      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-ink">
          Florida charitable registration (FDACS){" "}
          <span className="text-coral-deep">*</span>
        </legend>
        <div className="space-y-2">
          <label className="flex items-start gap-3 rounded-xl border border-line bg-cream px-4 py-3">
            <input
              id="fdacs-registered"
              type="radio"
              name="fdacsStatus"
              value="registered"
              checked={values.fdacsStatus === "registered"}
              onChange={() => {
                update("fdacsStatus", "registered");
                clearError("fdacsExemptionBasis");
              }}
              aria-describedby={
                errors.fdacsStatus ? "fdacsStatus-error" : undefined
              }
              className="mt-0.5 h-5 w-5 shrink-0 border-line text-sage focus:ring-sage"
            />
            <span className="text-sm leading-relaxed text-ink/90">
              We are registered with FDACS.
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-line bg-cream px-4 py-3">
            <input
              id="fdacs-exempt"
              type="radio"
              name="fdacsStatus"
              value="exempt"
              checked={values.fdacsStatus === "exempt"}
              onChange={() => {
                update("fdacsStatus", "exempt");
                clearError("fdacsReg");
              }}
              aria-describedby={
                errors.fdacsStatus ? "fdacsStatus-error" : undefined
              }
              className="mt-0.5 h-5 w-5 shrink-0 border-line text-sage focus:ring-sage"
            />
            <span className="text-sm leading-relaxed text-ink/90">
              We claim an exemption from Florida charitable registration.
            </span>
          </label>
        </div>
        {errors.fdacsStatus && (
          <p
            id="fdacsStatus-error"
            className="mt-1.5 text-sm text-red-700"
            role="alert"
          >
            {errors.fdacsStatus}
          </p>
        )}
        <div aria-live="polite" className="mt-3 space-y-3">
          {values.fdacsStatus === "registered" && (
            <Field
              id="fdacsReg"
              label="FDACS registration number"
              required
              error={errors.fdacsReg}
              value={values.fdacsReg}
              onChange={(v) => update("fdacsReg", v)}
              placeholder="CHxxxxx"
            />
          )}
          {values.fdacsStatus === "exempt" && (
            <TextArea
              id="fdacsExemptionBasis"
              label="Basis for the exemption"
              required
              error={errors.fdacsExemptionBasis}
              rows={2}
              value={values.fdacsExemptionBasis}
              onChange={(v) => update("fdacsExemptionBasis", v)}
            />
          )}
        </div>
      </fieldset>

      <Field
        id="sunbizDoc"
        label="Florida Sunbiz document number"
        optional
        value={values.sunbizDoc}
        onChange={(v) => update("sunbizDoc", v)}
        hint="Helps us verify faster."
      />
      <Field
        id="irsLetterUrl"
        label="Link to your IRS determination letter"
        optional
        error={errors.irsLetterUrl}
        value={values.irsLetterUrl}
        onChange={(v) => update("irsLetterUrl", v)}
        hint="A shared link to your IRS determination letter is fine. If you skip it, we verify through your EIN."
      />
      <Field
        id="website"
        label="Website"
        optional
        value={values.website}
        onChange={(v) => update("website", v)}
        placeholder="https://…"
      />

      <Field
        id="streetAddress"
        label="Street address (physical or registered)"
        required
        error={errors.streetAddress}
        value={values.streetAddress}
        onChange={(v) => update("streetAddress", v)}
        autoComplete="street-address"
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          id="city"
          label="City"
          required
          error={errors.city}
          value={values.city}
          onChange={(v) => update("city", v)}
          autoComplete="address-level2"
        />
        <Field
          id="state"
          label="State"
          required
          error={errors.state}
          value={values.state}
          onChange={(v) => update("state", v)}
          autoComplete="address-level1"
        />
        <Field
          id="zip"
          label="ZIP"
          required
          error={errors.zip}
          value={values.zip}
          onChange={(v) => update("zip", v)}
          autoComplete="postal-code"
        />
      </div>
      <Field
        id="phone"
        label="Phone"
        required
        type="tel"
        error={errors.phone}
        value={values.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
      />

      <TextArea
        id="mission"
        label="Mission & who you serve"
        required
        error={errors.mission}
        rows={3}
        value={values.mission}
        onChange={(v) => update("mission", v)}
      />
      <Field
        id="counties"
        label="Counties served"
        required
        error={errors.counties}
        value={values.counties}
        onChange={(v) => update("counties", v)}
      />
      <TextArea
        id="referralSources"
        label="How are children identified and referred to you? Which agencies or referral sources do you work with?"
        required
        error={errors.referralSources}
        rows={3}
        value={values.referralSources}
        onChange={(v) => update("referralSources", v)}
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
                id={`publicity-${opt.value}`}
                type="radio"
                name="publicityPreference"
                value={opt.value}
                checked={publicityPreference === opt.value}
                onChange={() => {
                  setPublicityPreference(opt.value);
                  if (opt.value === "do_not_name") setLogoUsePermitted(false);
                  clearError("publicityPreference");
                }}
                aria-describedby={
                  errors.publicityPreference
                    ? "publicityPreference-error"
                    : undefined
                }
                className="mt-0.5 h-5 w-5 shrink-0 border-line text-sage focus:ring-sage"
              />
              <span className="text-sm leading-relaxed text-ink/90">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {errors.publicityPreference && (
          <p
            id="publicityPreference-error"
            className="mt-1.5 text-sm text-red-700"
            role="alert"
          >
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

      {/* Working-standard acknowledgments (form-hardening brief, 2026-10-15;
          required markers added on founder follow-up). */}
      <CheckboxRow
        id="goodsDirectAck"
        required
        checked={goodsDirectAck}
        onChange={(v) => {
          setGoodsDirectAck(v);
          clearError("goodsDirectAck");
        }}
        error={errors.goodsDirectAck}
      >
        Donated goods will be given to the children and families you serve
        and will not be sold, traded, or exchanged.
      </CheckboxRow>
      <CheckboxRow
        id="childPrivacyAck"
        required
        checked={childPrivacyAck}
        onChange={(v) => {
          setChildPrivacyAck(v);
          clearError("childPrivacyAck");
        }}
        error={errors.childPrivacyAck}
      >
        We will not share a child&apos;s name or identifying details with CCOF;
        ages and sizes are all that is needed.
      </CheckboxRow>
      <CheckboxRow
        id="vettingAck"
        checked={vettingAck}
        onChange={(v) => {
          setVettingAck(v);
          clearError("vettingAck");
        }}
        error={errors.vettingAck}
      >
        I understand CCOF verifies every partner (including IRS status) before
        fulfilling requests, and that partnership doesn&apos;t guarantee
        specific goods; CCOF matches what the community has given.
      </CheckboxRow>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-ink">
          Is any officer, director, or staff member of your organization
          related to, or financially connected with, an officer, director, or
          staff member of The Children&apos;s Collective of Florida?{" "}
          <span className="text-coral-deep">*</span>
        </legend>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3"
            >
              <input
                id={`relatedParty-${opt}`}
                type="radio"
                name="relatedParty"
                value={opt}
                checked={values.relatedParty === opt}
                onChange={() => {
                  update("relatedParty", opt);
                  if (opt === "no") clearError("relatedPartyDetail");
                }}
                aria-describedby={
                  errors.relatedParty ? "relatedParty-error" : undefined
                }
                className="h-5 w-5 shrink-0 border-line text-sage focus:ring-sage"
              />
              <span className="text-sm text-ink/90">
                {opt === "yes" ? "Yes" : "No"}
              </span>
            </label>
          ))}
        </div>
        {errors.relatedParty && (
          <p
            id="relatedParty-error"
            className="mt-1.5 text-sm text-red-700"
            role="alert"
          >
            {errors.relatedParty}
          </p>
        )}
        <div aria-live="polite" className="mt-3">
          {values.relatedParty === "yes" && (
            <TextArea
              id="relatedPartyDetail"
              label="Please describe the relationship"
              required
              error={errors.relatedPartyDetail}
              rows={2}
              value={values.relatedPartyDetail}
              onChange={(v) => update("relatedPartyDetail", v)}
            />
          )}
        </div>
      </fieldset>

      {/* Typed signature replaces the former 501(c)(3) checkbox; the
          attestation text itself is unchanged. */}
      <div className="border-t border-line pt-5">
        <h3 className="text-base font-bold text-ink">Authorized signature</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/90">
          Typing your name below acts as your signature attesting: our
          organization is a registered <strong>501(c)(3)</strong> public
          charity serving children in foster care, kinship care, or crisis.
        </p>
      </div>
      <CheckboxRow
        id="signerIsContact"
        checked={signerIsContact}
        onChange={(v) => {
          setSignerIsContact(v);
          clearError("signerName");
          clearError("signerTitle");
        }}
      >
        I am the authorized signer; use my contact name and title above as the
        signature.
      </CheckboxRow>
      <div aria-live="polite">
        {signerIsContact ? (
          <div>
            <p className="text-sm leading-relaxed text-ink/90">
              Signing as:{" "}
              <strong>
                {values.contactName.trim() || "(your contact name above)"}
              </strong>
              {values.contactTitle.trim() ? `, ${values.contactTitle}` : ""}
            </p>
            {(errors.signerName || errors.signerTitle) && (
              <p className="mt-1.5 text-sm text-red-700" role="alert">
                Add your contact name and title above; they become the
                signature.
              </p>
            )}
            <div className="mt-3 sm:max-w-[33%]">
              <Field
                id="signerDate"
                label="Date"
                required
                type="date"
                error={errors.signerDate}
                value={values.signerDate}
                onChange={(v) => update("signerDate", v)}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              id="signerName"
              label="Full name"
              required
              error={errors.signerName}
              value={values.signerName}
              onChange={(v) => update("signerName", v)}
              autoComplete="name"
            />
            <Field
              id="signerTitle"
              label="Title"
              required
              error={errors.signerTitle}
              value={values.signerTitle}
              onChange={(v) => update("signerTitle", v)}
            />
            <Field
              id="signerDate"
              label="Date"
              required
              type="date"
              error={errors.signerDate}
              value={values.signerDate}
              onChange={(v) => update("signerDate", v)}
            />
          </div>
        )}
      </div>

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
