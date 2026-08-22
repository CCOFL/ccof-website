import { NextResponse } from "next/server";

/**
 * /recall-check: internal-use redirect to CPSC's recall search. It is the QR
 * target printed on the laminated volunteer intake card, so the card never
 * has to be reprinted when CPSC restructures its site: update this one URL.
 *
 * 302 on purpose, not 301. Browsers cache permanent redirects aggressively;
 * a 301 would pin every phone that ever scanned the card to a stale CPSC URL
 * after we re-point it, defeating the only reason the redirect exists.
 * Not in any nav, not in the sitemap, disallowed in robots.txt, and marked
 * noindex here as well.
 */
const CPSC_RECALLS_URL = "https://www.cpsc.gov/Recalls";

export function GET() {
  return NextResponse.redirect(CPSC_RECALLS_URL, {
    status: 302,
    headers: { "X-Robots-Tag": "noindex" },
  });
}
