import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { saveMoneyDonation, type MoneyDonation } from "@/lib/forms";
import { isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only: record an offline money gift (cash, check, or a card payment
 * that predates the webhook) and send the donor the branded monetary receipt.
 * Same auth pattern as the receipt-resend routes: the caller's Supabase
 * session JWT is verified server-side against the admin email. The gift is
 * numbered in the CCOF-M series, stored, receipted, and notified through the
 * exact same path a webhook payment takes.
 */
const ADMIN_EMAIL = "haskins1207@gmail.com"; // mirrors the RLS policies

const METHODS = new Set(["card", "cash", "check", "other"]);

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !isEmailConfigured()) {
    return NextResponse.json(
      { error: "Storage or email is not configured." },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);
  if (userError || userData.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  let body: {
    donorName?: unknown;
    donorEmail?: unknown;
    amount?: unknown;
    method?: unknown;
    receivedAt?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const donorName =
    typeof body.donorName === "string" ? body.donorName.trim() : "";
  const donorEmail =
    typeof body.donorEmail === "string" ? body.donorEmail.trim() : "";
  const amountDollars =
    typeof body.amount === "number" ? body.amount : Number(body.amount);
  const method = typeof body.method === "string" ? body.method : "";
  const receivedAtRaw =
    typeof body.receivedAt === "string" ? body.receivedAt : "";

  if (!donorEmail || !isEmail(donorEmail)) {
    return NextResponse.json(
      { error: "A valid donor email is required." },
      { status: 400 },
    );
  }
  if (
    !Number.isFinite(amountDollars) ||
    amountDollars <= 0 ||
    amountDollars > 1_000_000
  ) {
    return NextResponse.json(
      { error: "Enter a valid amount in dollars." },
      { status: 400 },
    );
  }
  if (!METHODS.has(method)) {
    return NextResponse.json(
      { error: "Choose a payment method." },
      { status: 400 },
    );
  }
  // Date arrives as YYYY-MM-DD from the admin form. Anchored to noon UTC so
  // the America/New_York-rendered receipt date matches the chosen calendar
  // day. Backdating is the point (recording a gift received earlier); future
  // dates are refused.
  let receivedAt: Date | undefined;
  if (receivedAtRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(receivedAtRaw)) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }
    receivedAt = new Date(`${receivedAtRaw}T12:00:00Z`);
    if (Number.isNaN(receivedAt.getTime())) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }
    if (receivedAt.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { error: "The received date cannot be in the future." },
        { status: 400 },
      );
    }
  }

  const gift: MoneyDonation = {
    donorName: donorName || undefined,
    donorEmail,
    amountCents: Math.round(amountDollars * 100),
    method: method as MoneyDonation["method"],
    frequency: "one-time",
    receivedAt,
  };

  try {
    const result = await saveMoneyDonation(gift);
    return NextResponse.json({
      recorded: result.stored,
      receiptNumber: result.receiptNumber,
      receiptSent: result.receiptSent,
    });
  } catch (err) {
    console.error("record-gift failed:", err);
    return NextResponse.json(
      { error: "Could not record the gift. Check migration 0012 and retry." },
      { status: 500 },
    );
  }
}
