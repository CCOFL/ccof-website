import { NextResponse } from "next/server";
import { saveLaunchSignup } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  let email = "";
  let website = "";
  try {
    const body = (await request.json()) as { email?: string; website?: string };
    email = (body.email ?? "").trim();
    website = (body.website ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot (see EmailCapture): the field is invisible and unreachable for
  // people, so any value means a bot filled it. Answer success and save
  // nothing — the bot learns nothing, the list stays clean.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!email || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  try {
    await saveLaunchSignup(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
