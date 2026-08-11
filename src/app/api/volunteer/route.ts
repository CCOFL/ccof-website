import { NextResponse } from "next/server";
import { saveVolunteerSignup } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  interests?: string[];
  availability?: string;
  adult?: boolean;
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

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const adult = Boolean(body.adult);

  // 18+ attestation is required at launch (interest capture is adults-only).
  if (!name || !email || !isEmail(email) || !adult) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    await saveVolunteerSignup({
      name,
      email,
      phone: (body.phone ?? "").trim(),
      interests: Array.isArray(body.interests)
        ? body.interests.map((i) => String(i)).slice(0, 8)
        : [],
      availability: (body.availability ?? "either").trim(),
      adult,
      message: (body.message ?? "").trim(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Volunteer signup error:", err);
    return NextResponse.json(
      { error: "Could not send signup." },
      { status: 500 },
    );
  }
}
