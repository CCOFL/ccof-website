import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ORG } from "@/lib/site";
import { buildGoodsReceipt, type GoodsDonation } from "@/lib/forms";
import { sendEmailTo, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only: resend the in-kind receipt for a goods donation whose original
 * send was declined (receipt_sent_at is null). Auth is the caller's Supabase
 * session JWT, verified server-side against the admin email AND enforced
 * again by RLS (the same email keys the table's select/update policies, see
 * migrations 0009 and 0011). The receipt is rebuilt from the stored row and
 * dated to the original donation date.
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
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || userData.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { data: row, error: rowError } = await supabase
    .from("goods_donations")
    .select(
      "id, created_at, first_name, last_name, email, categories, other_description, quantity_band, bin_slug, receipt_number, receipt_sent_at, email_opt_in",
    )
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row) {
    return NextResponse.json(
      { error: "Donation not found (is migration 0011 run?)." },
      { status: 404 },
    );
  }
  if (row.receipt_sent_at) {
    return NextResponse.json(
      { error: "This receipt was already sent." },
      { status: 409 },
    );
  }

  const d: GoodsDonation = {
    firstName: row.first_name,
    lastName: row.last_name ?? undefined,
    email: row.email,
    categories: row.categories ?? [],
    otherDescription: row.other_description ?? undefined,
    quantityBand: row.quantity_band ?? undefined,
    binSlug: row.bin_slug ?? undefined,
    emailOptIn: Boolean(row.email_opt_in),
  };

  const receipt = await sendEmailTo({
    to: row.email,
    subject: "Your donation receipt from The Children's Collective of Florida",
    replyTo: ORG.email,
    text: buildGoodsReceipt(d, row.receipt_number, new Date(row.created_at)),
  });
  if (!receipt.delivered) {
    return NextResponse.json(
      { error: "The email service declined the send. Try again shortly." },
      { status: 502 },
    );
  }

  const { error: upError } = await supabase
    .from("goods_donations")
    .update({ receipt_sent_at: new Date().toISOString() })
    .eq("id", id);
  if (upError) {
    // The email went out; only the bookkeeping failed (likely migration 0011
    // not yet run). Surface that plainly instead of pretending nothing sent.
    return NextResponse.json({
      sent: true,
      warning: "Receipt sent, but the sent-time could not be recorded. Run migration 0011 and refresh.",
    });
  }
  return NextResponse.json({ sent: true });
}
