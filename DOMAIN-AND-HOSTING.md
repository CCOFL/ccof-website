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
| **Registrar** | Holds our legal ownership of the name and renews it each year | The deed / title company for the address |
| **DNS** | Points the name at whatever server should answer | The postal forwarding instructions |
| **Hosting** | The actual computer that serves the website | The building the business operates in |

**Changing where the website is hosted does NOT require moving the registrar.**
You only repoint **DNS**. This is the single most important thing to remember.

---

## Where things stand

**Today (the current live site):**
- Registrar: **Wix** (the domain was bought at GoDaddy, then transferred to Wix)
- DNS: **Wix**
- Hosting: **Wix**

Wix currently does all three jobs.

**After this rebuild goes live:**
- Registrar: **your choice** — stays at Wix, or later moves to GoDaddy / Cloudflare
- DNS: **points at Netlify**
- Hosting: **Netlify** (free hosting + free auto-renewing SSL certificate)

Only **hosting** is required to move. DNS gets repointed. The registrar is an
independent, optional decision.

---

## Do we need to transfer the domain back to GoDaddy?

**No — not to launch the new site.** To put the new site on
`childrenscollectivefl.org`, we only repoint DNS to Netlify. That works no matter
who the registrar is.

Transferring the registrar is a **separate, optional** cleanup about where we
*manage and renew* the domain long-term — not about hosting.

**Recommendation:**
- **For launch:** leave the domain at Wix and just repoint DNS to Netlify. Fastest, lowest risk.
- **Long term:** once fully off Wix, move the registration to a registrar we control independently of the website host, so we're never locked to one platform.
  - **GoDaddy** — perfectly fine and familiar.
  - **Cloudflare** — cheaper (~$10/yr at cost) with excellent DNS; slightly more technical dashboard.
- **Do not** register the domain *inside* Netlify — keep registrar and host separate so the site stays portable.

### ⚠️ The 60-day transfer lock
ICANN locks a domain from transferring for **60 days after any registrar
transfer**. Because the domain recently moved **GoDaddy → Wix**, it likely
**cannot be transferred out of Wix again until ~60 days after that move**.

This does **not** block launch — repointing DNS to Netlify is not a transfer.
The lock only affects the optional "move the registrar" step.

---

## Who owns and manages the domain?

**The Children's Collective of Florida always owns it**, at whichever registrar
holds the registration. The registrar is just the company that keeps the
registration on file and bills the annual renewal.

**Continuity tips (important for a nonprofit):**
- Keep the registrar account under the org inbox **info@childrenscollectivefl.org**, not a personal email — so the org never loses control if one person's access is lost.
- Turn on **auto-renew** and keep a card on file so the domain never lapses.
- Ideally a second trusted person has access (the same single-owner risk applies as with the GitHub org).

---

## Step-by-step: going live with no downtime

The current Wix site stays up and untouched until the very last step.

1. **Build & deploy to Netlify** on a free temporary address (e.g. `ccof-website.netlify.app`).
2. **Add keys in Netlify** — Stripe **test** keys + Supabase keys — and fully test on the temporary address: donations (test mode, no real charges), forms saving to Supabase, every page and CTA.
3. **Decide the registrar** — keep at Wix for now, or plan a later move to GoDaddy/Cloudflare once the 60-day lock clears. *Not blocking.*
4. **Cutover** when you're happy:
   - In the registrar's DNS settings, repoint the domain to Netlify (Netlify gives the exact records/nameservers to use).
   - Switch Stripe from test keys to **live** keys.
   - Netlify automatically issues the SSL certificate (the padlock).
5. **Confirm** the new site is solid for a few days, then:
   - Cancel the Wix plan.
   - If desired, transfer the registration to your preferred registrar (once the 60-day lock has cleared).

---

## Quick glossary

- **Registrar** — company that holds the domain registration (Wix / GoDaddy / Cloudflare).
- **DNS records** — settings (A, CNAME, nameservers) that point the domain at a host.
- **Nameservers** — the authoritative DNS servers for the domain; pointing these at a host lets it manage DNS for you.
- **SSL / TLS certificate** — what gives the site `https://` and the padlock; Netlify provisions and renews this for free.
- **Hosting** — the server running the website (Netlify here).
- **Cutover** — the moment DNS is switched so the real domain shows the new site.

---

*Last updated: 2026-06-28. Update this file whenever the registrar, DNS, or host changes.*
