import { NextResponse } from "next/server";
import { savePartnerMouSignature } from "@/lib/forms";
import { isMouFlowEnabled, PARTNER_MOU_VERSION } from "@/lib/partnerMou";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  orgLegalName?: unknown;
  ein?: unknown;
  signerName?: unknown;
  signerTitle?: unknown;
  email?: unknown;
  signedDate?: unknown;
  recognizeName?: unknown;
  recognizeLogo?: unknown;
  recognizeWording?: unknown;
  website?: unknown;
  signatureIntent?: unknown;
  // Honeypot: bots fill this; humans never see it.
  company?: unknown;
};

function str(v: unknown, max = 300) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Section 8 answers must be an explicit "yes" or "no"; anything else is unanswered. */
function choice(v: unknown): boolean | null {
  return v === "yes" ? true : v === "no" ? false : null;
}

export async function POST(request: Request) {
  // Gate: no signatures are accepted until the flow is approved and live.
  if (!isMouFlowEnabled()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.company) return NextResponse.json({ ok: true });

  const orgLegalName = str(body.orgLegalName);
  const ein = str(body.ein, 20);
  const signerName = str(body.signerName);
  const signerTitle = str(body.signerTitle);
  const email = str(body.email);
  const signedDate = str(body.signedDate, 10);
  const website = str(body.website, 500);
  const recognizeName = choice(body.recognizeName);
  const recognizeLogo = choice(body.recognizeLogo);
  const recognizeWording = choice(body.recognizeWording);
  const signatureIntent = body.signatureIntent === true;

  const valid =
    orgLegalName &&
    /^\d{2}-?\d{7}$/.test(ein) &&
    signerName &&
    signerTitle &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^\d{4}-\d{2}-\d{2}$/.test(signedDate) &&
    recognizeName !== null &&
    recognizeLogo !== null &&
    recognizeWording !== null &&
    signatureIntent;
  if (!valid) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    await savePartnerMouSignature({
      mouVersion: PARTNER_MOU_VERSION,
      orgLegalName,
      ein,
      signerName,
      signerTitle,
      email,
      signedDate,
      recognizeName: recognizeName!,
      recognizeLogo: recognizeLogo!,
      recognizeWording: recognizeWording!,
      website,
      signatureIntent,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Partner MOU error:", err);
    return NextResponse.json({ error: "Could not record signature." }, { status: 500 });
  }
}
