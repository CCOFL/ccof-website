import { NextResponse } from "next/server";
import {
  saveGoodsDonation,
  GOODS_CATEGORIES,
  GOODS_QUANTITY_BANDS,
} from "@/lib/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  firstName?: string;
  lastName?: string;
  email?: string;
  categories?: string[];
  otherDescription?: string;
  quantityBand?: string;
  binSlug?: string;
  zip?: string;
  emailOptIn?: boolean;
  // Honeypot — bots fill this; humans never see it.
  company?: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const CATEGORY_VALUES = GOODS_CATEGORIES.map((c) => c.value as string);
const QUANTITY_VALUES = GOODS_QUANTITY_BANDS.map((q) => q.value as string);

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: true, receiptSent: true });

  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const email = (body.email ?? "").trim();
  const categories = Array.isArray(body.categories)
    ? body.categories.map(String).filter((c) => CATEGORY_VALUES.includes(c))
    : [];
  const otherDescription = (body.otherDescription ?? "").trim();
  const quantityBand = QUANTITY_VALUES.includes(body.quantityBand ?? "")
    ? (body.quantityBand as string)
    : "";
  const zip = (body.zip ?? "").trim();
  // Slugs come from printed QR codes; sanitize hard and drop anything odd.
  const rawSlug = (body.binSlug ?? "").trim().toLowerCase();
  const binSlug = /^[a-z0-9][a-z0-9-]{0,63}$/.test(rawSlug) ? rawSlug : "";

  if (
    !firstName ||
    !email ||
    !isEmail(email) ||
    categories.length === 0 ||
    (categories.includes("other") && !otherDescription) ||
    (zip !== "" && !/^\d{5}$/.test(zip))
  ) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  try {
    const result = await saveGoodsDonation({
      firstName,
      lastName,
      email,
      categories,
      otherDescription,
      quantityBand,
      binSlug,
      zip,
      emailOptIn: body.emailOptIn !== false,
    });
    return NextResponse.json({ ok: true, receiptSent: result.receiptSent });
  } catch (err) {
    console.error("Goods donation error:", err);
    return NextResponse.json(
      { error: "Could not record donation." },
      { status: 500 },
    );
  }
}
