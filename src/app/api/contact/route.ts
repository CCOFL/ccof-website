import { NextResponse } from "next/server";
import { saveContactSubmission } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  intent?: string;
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

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const intent = (body.intent ?? "general").trim();

  if (!name || !email || !message || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    await saveContactSubmission({ name, email, phone, intent, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact submission error:", err);
    return NextResponse.json(
      { error: "Could not send message." },
      { status: 500 },
    );
  }
}
