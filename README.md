# The Children's Collective of Florida — website

[![Deploys by Netlify](https://www.netlify.com/v3/img/components/netlify-color-accent.svg)](https://www.netlify.com)
&nbsp;[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A fast, accessible, conversion-optimized rebuild of [childrenscollectivefl.org](https://childrenscollectivefl.org), built to take the site from a 66/100 UX audit toward 100/100.

This is the open-source codebase for The Children's Collective of Florida, Inc., a registered 501(c)(3) nonprofit — released under the MIT license for transparency and community reuse.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Stripe (donations) · Resend (form email) · deployed on Netlify.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your keys (see below)
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm run start` (serve build), `npm run lint`.

## Environment variables

Copy `.env.example` → `.env.local` and fill in. **Nothing here is committed** (`.env*` is gitignored).

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (use `sk_test_…` first). Enables donation checkout. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key. |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) from `stripe listen` or the Dashboard. |
| `RESEND_API_KEY` | Resend API key — delivers contact & launch-list submissions. |
| `CONTACT_TO_EMAIL` | Inbox for form submissions (default `info@childrenscollectivefl.org`). |
| `CONTACT_FROM_EMAIL` | Verified Resend sender (e.g. `forms@childrenscollectivefl.org`). |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (used for Stripe redirect URLs). |

> **Graceful by design:** the app builds and runs without any keys. Donations show a friendly "not connected yet" message until `STRIPE_SECRET_KEY` is set; form submissions are logged server-side until `RESEND_API_KEY` is set. **Both must be configured before launch.**

## Donations (Stripe)

- Hosted **Stripe Checkout** handles one-time (`mode: payment`) and **monthly recurring** (`mode: subscription`) gifts — PCI handled by Stripe.
- Preset amounts `$25 / $50 / $100 / Other` with outcome framing ("$50 = a week of school supplies").
- Flow: `DonationForm` → `POST /api/checkout` → redirect to Stripe → `/donate/thank-you?session_id=…` (server-side confirmation with amount + email).
- Enable emailed receipts in **Stripe Dashboard → Settings → Customer emails → Successful payments**.
- Webhook receiver: `POST /api/stripe/webhook`. Test locally:
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```

## Forms (Supabase storage, optional Resend notify)

Form submissions are **stored in Supabase** (project `onvrcwpiwqhxaavgbeud`):

- `contact_submissions` — contact / volunteer / partner / host / support messages.
- `launch_signups` — "Follow our launch" email captures.

Both routes (`/api/contact`, `/api/subscribe`) have a honeypot field and write via the publishable key. **Row Level Security allows INSERT only**, so submissions can be written from the site but not read back through the public key — view them in the Supabase Table editor.

**One-time setup:**

1. In the Supabase Dashboard → **SQL Editor**, run [`supabase/migrations/0001_form_tables.sql`](supabase/migrations/0001_form_tables.sql). (Or, if the Supabase MCP/CLI is connected to this project, apply it from there.)
2. Dashboard → **Settings → API**: copy the **Project URL** and **publishable (anon) key** into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

If `RESEND_API_KEY` is also set, the org inbox is emailed on each submission **in addition** to Supabase storage. Without either configured, submissions are logged server-side (dev fallback).

## Deploy (Netlify)

1. Push to GitHub (`haskins1207`).
2. In Netlify: **Add new site → Import from GitHub** → pick this repo. `netlify.toml` + `@netlify/plugin-nextjs` handle the build.
3. Add the environment variables above in **Site settings → Environment variables** (use live Stripe keys for production).
4. Add a production Stripe webhook endpoint pointing at `https://<your-domain>/api/stripe/webhook` and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Point `childrenscollectivefl.org` DNS at Netlify when ready to cut over.

## Project structure

```
src/
  app/
    page.tsx                  Home
    about/ how-it-works/ collective-kids-closet/ partner/ contact/   pages
    donate/page.tsx           Donation page (real checkout)
    donate/thank-you/         Confirmation
    api/checkout/             Stripe Checkout session
    api/stripe/webhook/       Stripe webhook receiver
    api/contact/ api/subscribe/   Form → email
    sitemap.ts robots.ts      SEO
  components/                 Header, Footer, DonationForm, ContactForm, etc.
  lib/site.ts                 All content/config (single source of truth)
  lib/stripe.ts lib/email.ts  Server integrations
```

To edit copy, board, impact stats, donation presets, or legal text, edit **`src/lib/site.ts`**.

## What still needs real assets

Placeholders are labeled in the UI: hero photo, Collective Kids Closet storefront photo, partner-program logos, real social handles (`src/lib/site.ts` → `SOCIAL`), and the CCOF logo (`src/components/Logo.tsx`).

---

## QA checklist — the path to 100/100 (brief §7)

**The 5 urgent priorities**
- [x] #1 CTA routing fixed — "Donate / Give Goods" → `/donate`; Partner/Host/Volunteer/Request Support → intent-tagged Contact. No CTA dead-ends.
- [x] #2 Real donations — Stripe Checkout, one-time + monthly, presets + Other, outcome framing, thank-you + emailed receipt.
- [x] #3 `/copy-of-donate` removed; 301 redirects added (`/copy-of-donate`, `/donation-thank-you-page`, `/event-details/*`).
- [x] #4 Compact sticky header that condenses on scroll, with a persistent Donate button.
- [x] #5 One primary CTA sitewide (solid green Donate); everything else secondary/outline.

**Quality bar**
- [x] Brand: sage/cream palette, alternating section backgrounds (no monotone green), Newsreader + Public Sans, flat panels (no torn-paper), no emoji.
- [x] Accessibility: semantic landmarks, skip link, labeled fields + inline validation, visible focus rings, 44px targets, `prefers-reduced-motion` honored, alt text / `role="img"` on placeholders.
- [x] Micro-interactions (<400ms): count-up stats, scroll reveals, card hover-lift, sticky condense, segmented amount control, form success checkmark, marquee.
- [x] SEO: per-page titles/meta/OG, sitemap, robots, canonical URLs, NGO JSON-LD, no orphan/duplicate pages.
- [x] Content preserved verbatim; founder pull-quote promoted; giving-cycle diagram; "launch momentum" framing; Pillar 4 clearly marked "in development".
- [x] Transparency block (EIN, IRS letter, FL reg, board) + required FL Consumer Services disclosure on every donation context.
- [x] Forms deliver to `info@childrenscollectivefl.org`; phone optional.
- [x] Email-capture / "Follow our launch" module + social slots.

**Before go-live (requires your accounts/assets)**
- [ ] Add live Stripe keys + webhook; enable Stripe email receipts; test a real one-time and a monthly gift.
- [ ] Add Resend key + verified domain; submit the contact form and confirm delivery.
- [ ] Drop in real photos, partner logos, social handles, and the CCOF logo.
- [ ] Run Lighthouse on the deployed URL and confirm ≥95 across Performance / Accessibility / Best Practices / SEO.
