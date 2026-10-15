import { NextResponse } from "next/server";
import { savePartnerApplication } from "@/lib/forms";
import {
  validatePartnerApplication,
  mayNamePublicly,
  type PartnerApplicationValues,
} from "@/lib/partnerApplicationRules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = Partial<Record<keyof PartnerApplicationValues, unknown>> & {
  logoUsePermitted?: boolean;
  message?: string;
  // Honeypot — bots fill this; humans never see it.
  company?: string;
};

function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: true });

  // The same pure rules the client runs, so the two can never drift.
  const v: PartnerApplicationValues = {
    orgLegalName: str(body.orgLegalName),
    ein: str(body.ein),
    fdacsStatus: str(body.fdacsStatus),
    fdacsReg: str(body.fdacsReg),
    fdacsExemptionBasis: str(body.fdacsExemptionBasis),
    sunbizDoc: str(body.sunbizDoc),
    irsLetterUrl: str(body.irsLetterUrl),
    website: str(body.website),
    streetAddress: str(body.streetAddress),
    city: str(body.city),
    state: str(body.state),
    zip: str(body.zip),
    phone: str(body.phone),
    mission: str(body.mission),
    counties: str(body.counties),
    referralSources: str(body.referralSources),
    contactName: str(body.contactName),
    contactTitle: str(body.contactTitle),
    email: str(body.email),
    needs: str(body.needs),
    volumeEstimate: str(body.volumeEstimate),
    goodsDirectAck: Boolean(body.goodsDirectAck),
    childPrivacyAck: Boolean(body.childPrivacyAck),
    relatedParty: str(body.relatedParty),
    relatedPartyDetail: str(body.relatedPartyDetail),
    signerName: str(body.signerName),
    signerTitle: str(body.signerTitle),
    signerDate: str(body.signerDate),
    vettingAck: Boolean(body.vettingAck),
    publicityPreference: str(body.publicityPreference),
    mediaContactName: str(body.mediaContactName),
    mediaContactEmail: str(body.mediaContactEmail),
  };

  const errors = validatePartnerApplication(v);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  const mayName = mayNamePublicly(v.publicityPreference);

  try {
    await savePartnerApplication({
      ...v,
      // The completed typed signature IS the 501(c)(3) attestation.
      is501c3: true,
      message: str(body.message),
      logoUsePermitted: mayName ? Boolean(body.logoUsePermitted) : false,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Partner application error:", err);
    return NextResponse.json(
      { error: "Could not send application." },
      { status: 500 },
    );
  }
}
