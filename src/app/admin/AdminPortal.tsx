"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/Button";

type Contact = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  intent: string;
  message: string;
};
type Signup = { id: string; created_at: string; email: string };
type PartnerRequest = {
  id: string;
  created_at: string;
  org_name: string;
  contact_name: string;
  email: string;
  goods_needed: string;
  urgency: string;
  status: string;
};
type PartnerApplication = {
  id: string;
  created_at: string;
  org_legal_name: string;
  ein: string;
  counties: string;
  contact_name: string;
  contact_title: string;
  email: string;
  status: string;
  publicity_preference: string | null;
  logo_use_permitted: boolean | null;
  media_contact_name: string | null;
  media_contact_email: string | null;
};

const PUBLICITY_CHIP: Record<
  string,
  { label: string; className: string }
> = {
  may_name: {
    label: "Named OK",
    className: "bg-sage/15 text-sage-700",
  },
  may_name_with_review: {
    label: "Named, review first",
    className: "bg-coral/15 text-coral-deep",
  },
  do_not_name: {
    label: "Do not name",
    className: "bg-charcoal text-cream",
  },
};

function PublicityCell({ r }: { r: PartnerApplication }) {
  const chip = r.publicity_preference
    ? PUBLICITY_CHIP[r.publicity_preference]
    : undefined;
  return (
    <div className="space-y-1">
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          chip ? chip.className : "bg-cream-dark text-muted"
        }`}
      >
        {chip ? chip.label : "Not specified"}
      </span>
      <div className="text-xs text-muted">
        Logo:{" "}
        {r.logo_use_permitted === null || r.logo_use_permitted === undefined
          ? "not specified"
          : r.logo_use_permitted
            ? "yes"
            : "no"}
      </div>
      {(r.media_contact_name || r.media_contact_email) && (
        <div className="text-xs text-muted">
          {r.media_contact_name}
          {r.media_contact_email && (
            <>
              <br />
              {r.media_contact_email}
            </>
          )}
        </div>
      )}
    </div>
  );
}
type BinHost = {
  id: string;
  created_at: string;
  org_name: string;
  org_type: string;
  contact_name: string;
  email: string;
  location: string;
  indoor_ok: boolean;
  status: string;
};
type Pickup = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  pickup_area: string;
  items: string;
  windows: string | null;
  status: string;
};
type GoodsDonation = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string | null;
  email: string;
  categories: string[];
  quantity_band: string | null;
  bin_slug: string | null;
  receipt_number: string;
  receipt_sent_at: string | null;
};
type MoneyDonationRow = {
  id: string;
  received_at: string;
  donor_name: string | null;
  donor_email: string;
  amount_cents: number;
  currency: string;
  method: string;
  frequency: string;
  designation?: string | null; // pre-0013 rows and pre-0013 selects omit it
  receipt_number: string;
  receipt_sent_at: string | null;
};
type Volunteer = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  interests: string;
  availability: string;
  status: string;
};

/** Missing-table errors (migration 0007 not run yet) render as empty lists,
 *  not failures — matching the forms' graceful-degrade behavior. */
function isMissingTable(err: { code?: string; message?: string } | null) {
  return (
    err?.code === "42P01" ||
    err?.code === "PGRST205" ||
    /schema cache|could not find the table|does not exist/i.test(
      err?.message ?? "",
    )
  );
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    dateStyle: "medium",
    timeZone: "America/New_York",
  });
}

function fmtAmount(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return currency === "usd" ? `$${amount}` : `${amount} ${currency.toUpperCase()}`;
}

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function AdminPortal() {
  const supabase = CONFIGURED ? getSupabaseBrowser() : null;
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(CONFIGURED);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [partners, setPartners] = useState<PartnerRequest[]>([]);
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [binHosts, setBinHosts] = useState<BinHost[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [goods, setGoods] = useState<GoodsDonation[]>([]);
  const [goodsSortAsc, setGoodsSortAsc] = useState(false);
  const [money, setMoney] = useState<MoneyDonationRow[]>([]);
  // "Record an offline gift" form (cash/check, or a card payment that
  // predates the webhook). Server route re-verifies the admin JWT.
  const [giftName, setGiftName] = useState("");
  const [giftEmail, setGiftEmail] = useState("");
  const [giftAmount, setGiftAmount] = useState("");
  const [giftMethod, setGiftMethod] = useState("cash");
  const [giftDesignation, setGiftDesignation] = useState("general");
  const [giftDate, setGiftDate] = useState("");
  const [giftEmailReceipt, setGiftEmailReceipt] = useState(true);
  const [recordingGift, setRecordingGift] = useState(false);
  const [giftNote, setGiftNote] = useState<string | null>(null);
  const [moneyResendingId, setMoneyResendingId] = useState<string | null>(
    null,
  );

  async function resendMoneyReceipt(id: string) {
    if (!session) return;
    setMoneyResendingId(id);
    try {
      const res = await fetch("/api/admin/money-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id }),
      });
      const payload = (await res.json().catch(() => null)) as
        | { sent?: boolean; warning?: string; error?: string }
        | null;
      if (res.ok && payload?.sent) {
        setMoney((rows) =>
          rows.map((row) =>
            row.id === id
              ? { ...row, receipt_sent_at: new Date().toISOString() }
              : row,
          ),
        );
        if (payload.warning) alert(payload.warning);
      } else {
        alert(payload?.error ?? "Could not send the receipt. Try again.");
      }
    } finally {
      setMoneyResendingId(null);
    }
  }

  async function recordGift(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setRecordingGift(true);
    setGiftNote(null);
    try {
      const res = await fetch("/api/admin/record-gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          donorName: giftName,
          donorEmail: giftEmail,
          amount: Number(giftAmount),
          method: giftMethod,
          designation: giftDesignation,
          receivedAt: giftDate || undefined,
          emailReceipt: giftEmailReceipt,
        }),
      });
      const payload = (await res.json().catch(() => null)) as
        | {
            recorded?: boolean;
            receiptNumber?: string;
            receiptSent?: boolean;
            error?: string;
          }
        | null;
      if (res.ok && payload?.receiptNumber) {
        setGiftNote(
          `Recorded as ${payload.receiptNumber}. Receipt ${
            payload.receiptSent
              ? "emailed to the donor"
              : giftEmailReceipt
                ? "NOT emailed, use Send receipt below"
                : "not emailed (your choice); the Send receipt button stays available"
          }.`,
        );
        setGiftName("");
        setGiftEmail("");
        setGiftAmount("");
        setGiftDate("");
        void loadData();
      } else {
        setGiftNote(payload?.error ?? "Could not record the gift. Try again.");
      }
    } finally {
      setRecordingGift(false);
    }
  }
  // Backfill: resend an in-kind receipt whose original send was declined
  // (pre-cutover interim mode). Server route re-verifies the admin JWT and
  // RLS enforces it again; see /api/admin/resend-receipt + migration 0011.
  const [resendingId, setResendingId] = useState<string | null>(null);

  async function resendReceipt(id: string) {
    if (!session) return;
    setResendingId(id);
    try {
      const res = await fetch("/api/admin/resend-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id }),
      });
      const payload = (await res.json().catch(() => null)) as
        | { sent?: boolean; warning?: string; error?: string }
        | null;
      if (res.ok && payload?.sent) {
        setGoods((rows) =>
          rows.map((row) =>
            row.id === id
              ? { ...row, receipt_sent_at: new Date().toISOString() }
              : row,
          ),
        );
        if (payload.warning) alert(payload.warning);
      } else {
        alert(payload?.error ?? "Could not send the receipt. Try again.");
      }
    } finally {
      setResendingId(null);
    }
  }
  const [migrationNote, setMigrationNote] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const loadData = useCallback(async () => {
    if (!supabase) return;
    setLoadingData(true);
    setDataError(null);
    const results = await Promise.all([
      supabase
        .from("contact_submissions")
        .select("id, created_at, name, email, phone, intent, message")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("launch_signups")
        .select("id, created_at, email")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("partner_requests")
        .select(
          "id, created_at, org_name, contact_name, email, goods_needed, urgency, status"
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("partner_applications")
        .select(
          "id, created_at, org_legal_name, ein, counties, contact_name, contact_title, email, status, publicity_preference, logo_use_permitted, media_contact_name, media_contact_email"
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("bin_host_requests")
        .select(
          "id, created_at, org_name, org_type, contact_name, email, location, indoor_ok, status"
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("pickup_requests")
        .select(
          "id, created_at, name, email, pickup_area, items, windows, status"
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("volunteer_signups")
        .select(
          "id, created_at, name, email, interests, availability, status"
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("goods_donations")
        .select(
          "id, created_at, first_name, last_name, email, categories, quantity_band, bin_slug, receipt_number, receipt_sent_at"
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("money_donations")
        // select("*") on purpose: naming the designation column here would
        // fail the whole query until migration 0013 runs.
        .select("*")
        .order("received_at", { ascending: false })
        .limit(100),
    ]);
    const [c, s, p, a, b, k, v, g, m] = results;
    // Newer tables/columns degrade to empty lists until migrations run.
    const newTableMissing = [a, b, k, v, g, m].some(
      (r) => r.error && isMissingTable(r.error)
    );
    setMigrationNote(newTableMissing);
    const hardError =
      c.error ||
      s.error ||
      p.error ||
      [a, b, k, v, g, m].find((r) => r.error && !isMissingTable(r.error))?.error;
    if (hardError) {
      setDataError(
        `Could not load submissions (${hardError.message}). If this is a permissions error, confirm migrations 0006/0007 have been run and you are signed in as the admin email.`
      );
    }
    setContacts((c.data as Contact[]) ?? []);
    setSignups((s.data as Signup[]) ?? []);
    setPartners((p.data as PartnerRequest[]) ?? []);
    setApplications((a.data as PartnerApplication[]) ?? []);
    setBinHosts((b.data as BinHost[]) ?? []);
    setPickups((k.data as Pickup[]) ?? []);
    setVolunteers((v.data as Volunteer[]) ?? []);
    setGoods((g.data as GoodsDonation[]) ?? []);
    setMoney((m.data as MoneyDonationRow[]) ?? []);
    setLoadingData(false);
  }, [supabase]);

  useEffect(() => {
    if (!session) return;
    // Defer so the fetch (and its setState) runs outside the effect body,
    // per react-hooks guidance on cascading renders.
    const id = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(id);
  }, [session, loadData]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSigningIn(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError("Sign-in failed. Check your email and password.");
    setSigningIn(false);
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setContacts([]);
    setSignups([]);
    setPartners([]);
    setApplications([]);
    setBinHosts([]);
    setPickups([]);
    setVolunteers([]);
    setGoods([]);
  }

  if (!supabase) {
    return (
      <Shell>
        <p className="text-muted">
          Admin portal is unavailable: Supabase is not configured in this
          environment.
        </p>
      </Shell>
    );
  }

  if (checking) {
    return (
      <Shell>
        <p className="text-muted" role="status">
          Checking session…
        </p>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-sage-600">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Internal use only. Sign in with your administrator account.
        </p>
        <form onSubmit={handleSignIn} className="mt-6 max-w-sm space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
            />
          </div>
          {authError && (
            <p className="text-sm text-red-700" role="alert">
              {authError}
            </p>
          )}
          <Button type="submit" disabled={signingIn}>
            {signingIn ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sage-600">Submissions</h1>
          <p className="mt-1 text-sm text-muted">
            Signed in as {session.user.email}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => void loadData()}>
            {loadingData ? "Refreshing…" : "Refresh"}
          </Button>
          <Button variant="secondary" onClick={() => void handleSignOut()}>
            Sign out
          </Button>
        </div>
      </div>

      {dataError && (
        <p
          className="mt-6 rounded-xl border border-coral/40 bg-coral/10 p-4 text-sm text-ink"
          role="alert"
        >
          {dataError}
        </p>
      )}
      {migrationNote && (
        <p className="mt-6 rounded-xl border border-line bg-cream p-4 text-sm text-muted">
          Some newer tables or columns aren&apos;t set up yet. Run the latest
          migrations (0007, 0008, 0009, then 0012_money_donations.sql)
          in the Supabase SQL editor to enable every list here.
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Money donations ({money.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {money.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmtDate(r.received_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {r.donor_name || "(no name)"}
                    <br />
                    <span className="font-normal text-muted">
                      {r.donor_email}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">
                    {fmtAmount(r.amount_cents, r.currency)}
                    {r.frequency === "monthly" && (
                      <span className="ml-2 inline-block rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-semibold text-sage-700">
                        monthly
                      </span>
                    )}
                    {r.designation === "partner_need" && (
                      <span className="ml-2 inline-block rounded-full bg-coral/15 px-2.5 py-0.5 text-xs font-semibold text-coral-deep">
                        partner need · restricted
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">{r.method}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {r.receipt_number}
                    <br />
                    <span
                      className={
                        r.receipt_sent_at ? "text-sage-700" : "text-coral-deep"
                      }
                    >
                      {r.receipt_sent_at ? "receipt sent" : "receipt NOT sent"}
                    </span>
                    {!r.receipt_sent_at && (
                      <>
                        <br />
                        <button
                          type="button"
                          onClick={() => resendMoneyReceipt(r.id)}
                          disabled={moneyResendingId === r.id}
                          className="mt-1 rounded-lg border border-sage/40 px-2 py-0.5 text-xs font-semibold text-sage-700 hover:bg-sage/10 disabled:opacity-50"
                        >
                          {moneyResendingId === r.id
                            ? "Sending…"
                            : "Send receipt"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {money.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={5}>
                    No money donations recorded yet. Card payments appear here
                    automatically once the Stripe webhook is connected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <details className="mt-4 rounded-2xl border border-line bg-cream p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink">
            Record an offline gift (cash, check, or a card payment made before
            the webhook)
          </summary>
          <form
            onSubmit={recordGift}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label
                htmlFor="gift-name"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Donor name
              </label>
              <input
                id="gift-name"
                type="text"
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="gift-email"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Donor email (receives the receipt)
              </label>
              <input
                id="gift-email"
                type="email"
                required
                value={giftEmail}
                onChange={(e) => setGiftEmail(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="gift-amount"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Amount (USD)
              </label>
              <input
                id="gift-amount"
                type="number"
                required
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="gift-method"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Method
              </label>
              <select
                id="gift-method"
                value={giftMethod}
                onChange={(e) => setGiftMethod(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="gift-designation"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Designation
              </label>
              <select
                id="gift-designation"
                value={giftDesignation}
                onChange={(e) => setGiftDesignation(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
              >
                <option value="general">Wherever needed most</option>
                <option value="partner_need">
                  A partner&apos;s specific need (restricted)
                </option>
              </select>
            </div>
            <div>
              <label
                htmlFor="gift-date"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Date received
              </label>
              <input
                id="gift-date"
                type="date"
                value={giftDate}
                onChange={(e) => setGiftDate(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
              />
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={giftEmailReceipt}
                  onChange={(e) => setGiftEmailReceipt(e.target.checked)}
                  className="h-4 w-4 accent-sage"
                />
                Email the branded receipt to the donor (uncheck when you have
                already acknowledged the gift yourself)
              </label>
              <Button type="submit" disabled={recordingGift}>
                {recordingGift
                  ? "Recording…"
                  : giftEmailReceipt
                    ? "Record gift & email receipt"
                    : "Record gift (no email)"}
              </Button>
            </div>
            {giftNote && (
              <p className="sm:col-span-2 text-sm text-ink" role="status">
                {giftNote}
              </p>
            )}
          </form>
        </details>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Goods donations ({goods.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setGoodsSortAsc((s) => !s)}
                    className="uppercase tracking-wider underline-offset-4 hover:underline"
                  >
                    Received {goodsSortAsc ? "(oldest first)" : "(newest first)"}
                  </button>
                </th>
                <th className="px-4 py-3">Bin</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Categories</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {[...goods]
                .sort((x, y) =>
                  goodsSortAsc
                    ? x.created_at.localeCompare(y.created_at)
                    : y.created_at.localeCompare(x.created_at)
                )
                .map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        r.bin_slug
                          ? "bg-sage/15 text-sage-700"
                          : "bg-cream-dark text-muted"
                      }`}
                    >
                      {r.bin_slug || "no bin"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {r.first_name} {r.last_name || ""}
                    <br />
                    <span className="font-normal text-muted">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">{r.categories.join(", ")}</td>
                  <td className="px-4 py-3">{r.quantity_band || ""}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {r.receipt_number}
                    <br />
                    <span className={r.receipt_sent_at ? "text-sage-700" : "text-coral-deep"}>
                      {r.receipt_sent_at ? "receipt sent" : "receipt NOT sent"}
                    </span>
                    {!r.receipt_sent_at && (
                      <>
                        <br />
                        <button
                          type="button"
                          onClick={() => resendReceipt(r.id)}
                          disabled={resendingId === r.id}
                          className="mt-1 rounded-lg border border-sage/40 px-2 py-0.5 text-xs font-semibold text-sage-700 hover:bg-sage/10 disabled:opacity-50"
                        >
                          {resendingId === r.id ? "Sending…" : "Send receipt"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {goods.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={6}>
                    No goods donations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Partnership applications ({applications.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">EIN</th>
                <th className="px-4 py-3">Counties</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Publicity</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(r.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.org_legal_name}</td>
                  <td className="whitespace-nowrap px-4 py-3">{r.ein}</td>
                  <td className="px-4 py-3">{r.counties}</td>
                  <td className="px-4 py-3">
                    {r.contact_name} ({r.contact_title})
                    <br />
                    <span className="text-muted">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <PublicityCell r={r} />
                  </td>
                  <td className="px-4 py-3">{r.status}</td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={7}>
                    No applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Bin host requests ({binHosts.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Indoor</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {binHosts.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(r.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.org_name}</td>
                  <td className="px-4 py-3">{r.org_type}</td>
                  <td className="px-4 py-3">{r.location}</td>
                  <td className="px-4 py-3">{r.indoor_ok ? "yes" : "no"}</td>
                  <td className="px-4 py-3">
                    {r.contact_name}
                    <br />
                    <span className="text-muted">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">{r.status}</td>
                </tr>
              ))}
              {binHosts.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={7}>
                    No bin host requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Pickup requests ({pickups.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Windows</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(r.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {r.name}
                    <br />
                    <span className="text-muted">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">{r.pickup_area}</td>
                  <td className="max-w-md px-4 py-3">{r.items}</td>
                  <td className="px-4 py-3">{r.windows}</td>
                  <td className="px-4 py-3">{r.status}</td>
                </tr>
              ))}
              {pickups.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={6}>
                    No pickup requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Volunteer interest ({volunteers.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Interests</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(r.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {r.name}
                    <br />
                    <span className="text-muted">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">{r.interests}</td>
                  <td className="px-4 py-3">{r.availability}</td>
                  <td className="px-4 py-3">{r.status}</td>
                </tr>
              ))}
              {volunteers.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={5}>
                    No volunteer signups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Partner requests ({partners.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Goods needed</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(r.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.org_name}</td>
                  <td className="px-4 py-3">
                    {r.contact_name}
                    <br />
                    <span className="text-muted">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">{r.goods_needed}</td>
                  <td className="px-4 py-3">{r.urgency}</td>
                  <td className="px-4 py-3">{r.status}</td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={6}>
                    No partner requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Contact messages ({contacts.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email / phone</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(c.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    {c.email}
                    {c.phone && (
                      <>
                        <br />
                        <span className="text-muted">{c.phone}</span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">{c.intent}</td>
                  <td className="max-w-md px-4 py-3">{c.message}</td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={5}>
                    No contact messages yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Launch signups ({signups.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Signed up</th>
                <th className="px-4 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="whitespace-nowrap px-4 py-3">
                    {fmt(s.created_at)}
                  </td>
                  <td className="px-4 py-3">{s.email}</td>
                </tr>
              ))}
              {signups.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={2}>
                    No signups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 lg:py-20">
        {children}
      </div>
    </section>
  );
}
