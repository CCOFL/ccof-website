import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ORG } from "@/lib/site";
import { buildMoneyReceipt, type MoneyDonation } from "@/lib/forms";
import { sendEmailTo, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only: resend the monetary receipt for a money donation whose original
 * send was declined (receipt_sent_at is null). Mirrors the goods
 * resend-receipt route: auth is the caller's Supabase session JWT, verified
 * server-side against the admin email AND enforced again by RLS (migration
 * 0012). The receipt is rebuilt from the stored row and dated to the original
 * received date.
 */
const ADMIN_EMAIL = "haskins1207@gmail.com"; // mirrors the RLS policies

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

  let body: { id?: unknown };
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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

  const { data: row, error: rowError } = await supabase
    .from("money_donations")
    .select(
      "id, received_at, donor_name, donor_email, amount_cents, currency, method, frequency, receipt_number, receipt_sent_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row) {
    return NextResponse.json(
      { error: "Donation not found (is migration 0012 run?)." },
      { status: 404 },
    );
  }
  if (row.receipt_sent_at) {
    return NextResponse.json(
      { error: "This receipt was already sent." },
      { status: 409 },
    );
  }

  const d: MoneyDonation = {
    donorName: row.donor_name ?? undefined,
    donorEmail: row.donor_email,
    amountCents: row.amount_cents,
    currency: row.currency ?? "usd",
    method: row.method,
    frequency: row.frequency ?? "one-time",
  };

  const receipt = await sendEmailTo({
    to: row.donor_email,
    subject: "Your donation receipt from The Children's Collective of Florida",
    replyTo: ORG.email,
    text: buildMoneyReceipt(d, row.receipt_number, new Date(row.received_at)),
  });
  if (!receipt.delivered) {
    return NextResponse.json(
      { error: "The email service declined the send. Try again shortly." },
      { status: 502 },
    );
  }

  const { error: upError } = await supabase
    .from("money_donations")
    .update({ receipt_sent_at: new Date().toISOString() })
    .eq("id", id);
  if (upError) {
    // The email went out; only the bookkeeping failed (likely migration 0012
    // not fully run). Surface that plainly instead of pretending nothing sent.
    return NextResponse.json({
      sent: true,
      warning:
        "Receipt sent, but the sent-time could not be recorded. Confirm migration 0012 and refresh.",
    });
  }
  return NextResponse.json({ sent: true });
}
