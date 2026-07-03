import { NextResponse } from "next/server";
import { savePartnerRequest } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  orgName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  is501c3?: boolean;
  childDetails?: string;
  goodsNeeded?: string;
  urgency?: string;
  fulfillmentPref?: string;
  message?: string;
  // Honeypot — bots fill this; humans never see it.
  company?: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots don't learn anything.
  if (body.company) return NextResponse.json({ ok: true });

  const orgName = (body.orgName ?? "").trim();
  const contactName = (body.contactName ?? "").trim();
  const email = (body.email ?? "").trim();
  const goodsNeeded = (body.goodsNeeded ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const childDetails = (body.childDetails ?? "").trim();
  const message = (body.message ?? "").trim();
  const urgency = (body.urgency ?? "flexible").trim();
  const fulfillmentPref = (body.fulfillmentPref ?? "").trim();
  const is501c3 = Boolean(body.is501c3);

  if (!orgName || !contactName || !email || !goodsNeeded || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    await savePartnerRequest({
      orgName,
      contactName,
      email,
      phone,
      is501c3,
      childDetails,
      goodsNeeded,
      urgency,
      fulfillmentPref,
      message,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Partner request error:", err);
    return NextResponse.json(
      { error: "Could not submit request." },
      { status: 500 },
    );
  }
}
