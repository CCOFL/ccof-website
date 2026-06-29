# Domain & Hosting — how `childrenscollectivefl.org` works

A plain-English reference for The Children's Collective of Florida. Written so a
future board member, volunteer, or contractor can understand the setup without
prior context. Keep this current as things change.

---

## The one idea that makes all of this make sense

"The domain" is really **three separate jobs**, and they can each be handled by
a different company. Blurring them together is what makes domains confusing.

| Job | What it does | Think of it as… |
|---|---|---|
| **Registrar** | Holds our ownership of the name and bills the annual renewal | The deed / title company for the address |
| **DNS** | Points the name at whatever server should answer | The postal forwarding instructions |
| **Hosting** | The actual computer that serves the website | The building the org operates in |

**Two things to remember:**
1. **Changing where the site is hosted only requires repointing DNS — not moving the registrar.**
2. **Hosting on Netlify does NOT make Netlify our registrar.** We always *renew and manage* the domain at the **registrar**, wherever that is.

---

## Current status (2026-06-29)

| | Old Wix site | New site |
|---|---|---|
| Registrar | **Wix** (bought at GoDaddy, transferred to Wix) | *(decision below)* |
| DNS | Wix | → repoint to **Netlify** at cutover |
| Hosting | Wix | **Netlify** — live now at `ccof-website.netlify.app` |
| Donations | Wix Payments | **Stripe** |

The new site is built, deployed, and verified at `ccof-website.netlify.app`. The
real domain has **not** been cut over yet — the Wix site is still what the public
sees at `childrenscollectivefl.org`.

---

## The decided plan: end fully off Wix, registrar at GoDaddy

CCOF has no remaining use for Wix once the site is on Netlify and donations are on
Stripe. So the goal is to leave Wix entirely. The target setup:

- **Registrar: GoDaddy** — where we renew and manage the domain (familiar; ~$20/yr for `.org`).
  *(Cloudflare is a cheaper alternative ~$10/yr with great DNS, if ever preferred.)*
- **DNS + SSL: Netlify** — at GoDaddy we point the **nameservers to Netlify**, so DNS and the SSL certificate are automatic.
- **Hosting: Netlify** · **Donations: Stripe**
- **❌ Do NOT register the domain inside Netlify** — keep the registrar independent of the host so the site stays portable.

### ⚠️ The 60-day transfer lock (why we can't move the registrar yet)
ICANN blocks a domain from changing registrars for **60 days after any transfer**.
The domain recently moved **GoDaddy → Wix**, so it likely **cannot be transferred
out of Wix until ~60 days after that move** (check the transfer date in Wix →
Domains). This does **not** block launch — repointing DNS is not a transfer.

---

## Step-by-step (no downtime, ends fully off Wix)

**Phase 1 — Go live now (no registrar change needed):**
1. In **Netlify → ccof-website → Domain management → Add a domain** → `childrenscollectivefl.org` (and `www`).
2. Netlify gives a target — either **its nameservers** (recommended) or **A record `75.2.60.5` + `www` CNAME → `ccof-website.netlify.app`**.
3. In **Wix → Domains**, apply that target. (Wix may ask to "disconnect" the domain from the Wix site first — expected; the Wix site stays in the account but stops serving here.)
4. Netlify auto-issues SSL; DNS propagates (minutes to ~48h).
5. Switch Stripe to **live** keys (with the bank connected) so real donations work.

➡️ At this point the public sees the new site. Registrar is still Wix temporarily.

**Phase 2 — Move the registrar off Wix (after the 60-day lock clears):**
6. In Wix: **unlock** the domain and request the **EPP / authorization code**.
7. At **GoDaddy**: start a domain **transfer in**, enter the EPP code, pay the
   transfer fee (includes +1 year renewal). Approve the transfer email.
8. Before/after transfer, set GoDaddy's **nameservers to Netlify's** so the site
   keeps serving throughout (DNS never goes dark if records are preserved).
9. Once the transfer completes (a few days), **cancel Wix entirely.**

**Important ordering:** never cancel Wix while the domain is still registered
there — wait until it's safely at GoDaddy.

---

## Ongoing management (it's small)

- **Renew:** once a year at **GoDaddy**. Turn on **auto-renew** with a card on file so it never lapses.
- **Account owner:** keep the GoDaddy (and Netlify, GitHub, Stripe) accounts under the org inbox **info@childrenscollectivefl.org**, not a personal email — so CCOF never loses control if one person's access is lost. Ideally a second board member has access.
- **DNS / SSL:** automatic at Netlify — nothing to do.
- **Site updates:** changes are pushed to GitHub → Netlify rebuilds automatically. The domain is not involved.

---

## Quick glossary

- **Registrar** — company that holds the domain registration and renews it (GoDaddy in the target setup).
- **DNS records** — settings (A, CNAME, nameservers) that point the domain at a host.
- **Nameservers** — the authoritative DNS servers for the domain; pointing these at Netlify lets Netlify manage DNS for us.
- **EPP / auth code** — the password needed to transfer a domain between registrars.
- **SSL / TLS certificate** — gives the site `https://` and the padlock; Netlify provisions and renews it for free.
- **Cutover** — the moment DNS is switched so the real domain shows the new site.

---

*Last updated: 2026-06-29. Update this file whenever the registrar, DNS, or host changes.*
