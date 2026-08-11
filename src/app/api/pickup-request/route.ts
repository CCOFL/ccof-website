import { NextResponse } from "next/server";
import { savePickupRequest } from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  pickupArea?: string;
  items?: string;
  volume?: string;
  windows?: string;
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
  const pickupArea = (body.pickupArea ?? "").trim();
  const items = (body.items ?? "").trim();

  if (!name || !email || !pickupArea || !items || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    await savePickupRequest({
      name,
      email,
      phone: (body.phone ?? "").trim(),
      pickupArea,
      items,
      volume: (body.volume ?? "").trim(),
      windows: (body.windows ?? "").trim(),
      message: (body.message ?? "").trim(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Pickup request error:", err);
    return NextResponse.json(
      { error: "Could not send request." },
      { status: 500 },
    );
  }
}
