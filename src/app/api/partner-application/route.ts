import { NextResponse } from "next/server";
import { savePartnerApplication } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  orgLegalName?: string;
  ein?: string;
  fdacsReg?: string;
  website?: string;
  mission?: string;
  counties?: string;
  contactName?: string;
  contactTitle?: string;
  email?: string;
  phone?: string;
  is501c3?: boolean;
  needs?: string;
  volumeEstimate?: string;
  vettingAck?: boolean;
  message?: string;
  publicityPreference?: string;
  logoUsePermitted?: boolean;
  mediaContactName?: string;
  mediaContactEmail?: string;
  // Honeypot — bots fill this; humans never see it.
  company?: string;
};

const PUBLICITY_PREFS = ["may_name", "may_name_with_review", "do_not_name"];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// EIN: 9 digits, with or without the XX-XXXXXXX hyphen.
function isEin(v: string) {
  return /^\d{2}-?\d{7}$/.test(v);
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: true });

  const orgLegalName = (body.orgLegalName ?? "").trim();
  const ein = (body.ein ?? "").trim();
  const mission = (body.mission ?? "").trim();
  const counties = (body.counties ?? "").trim();
  const contactName = (body.contactName ?? "").trim();
  const contactTitle = (body.contactTitle ?? "").trim();
  const email = (body.email ?? "").trim();
  const needs = (body.needs ?? "").trim();

  // Publicity/media consent. Preference is required; naming permission makes
  // the media contact required; do_not_name forces logo permission to false.
  const publicityPreference = (body.publicityPreference ?? "").trim();
  const mediaContactName = (body.mediaContactName ?? "").trim();
  const mediaContactEmail = (body.mediaContactEmail ?? "").trim();
  const mayName =
    publicityPreference === "may_name" ||
    publicityPreference === "may_name_with_review";
  const logoUsePermitted = mayName ? Boolean(body.logoUsePermitted) : false;

  if (
    !PUBLICITY_PREFS.includes(publicityPreference) ||
    (mayName &&
      (!mediaContactName || !mediaContactEmail || !isEmail(mediaContactEmail))) ||
    (!mayName && mediaContactEmail !== "" && !isEmail(mediaContactEmail))
  ) {
    return NextResponse.json(
      { error: "Please complete the recognition and media section." },
      { status: 400 },
    );
  }

  if (
    !orgLegalName ||
    !ein ||
    !mission ||
    !counties ||
    !contactName ||
    !contactTitle ||
    !email ||
    !needs ||
    !isEmail(email) ||
    !isEin(ein) ||
    !body.is501c3 ||
    !body.vettingAck
  ) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    await savePartnerApplication({
      orgLegalName,
      ein,
      fdacsReg: (body.fdacsReg ?? "").trim(),
      website: (body.website ?? "").trim(),
      mission,
      counties,
      contactName,
      contactTitle,
      email,
      phone: (body.phone ?? "").trim(),
      is501c3: true,
      needs,
      volumeEstimate: (body.volumeEstimate ?? "").trim(),
      vettingAck: true,
      message: (body.message ?? "").trim(),
      publicityPreference,
      logoUsePermitted,
      mediaContactName,
      mediaContactEmail,
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
