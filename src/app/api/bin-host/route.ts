import { NextResponse } from "next/server";
import { saveBinHostRequest } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  orgName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  orgType?: string;
  location?: string;
  indoorOk?: boolean;
  footTraffic?: string;
  timing?: string;
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

  if (body.company) return NextResponse.json({ ok: true });

  const orgName = (body.orgName ?? "").trim();
  const contactName = (body.contactName ?? "").trim();
  const email = (body.email ?? "").trim();
  const location = (body.location ?? "").trim();

  if (!orgName || !contactName || !email || !location || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    await saveBinHostRequest({
      orgName,
      contactName,
      email,
      phone: (body.phone ?? "").trim(),
      orgType: (body.orgType ?? "business").trim(),
      location,
      indoorOk: Boolean(body.indoorOk),
      footTraffic: (body.footTraffic ?? "").trim(),
      timing: (body.timing ?? "").trim(),
      message: (body.message ?? "").trim(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Bin host request error:", err);
    return NextResponse.json(
      { error: "Could not send request." },
      { status: 500 },
    );
  }
}
