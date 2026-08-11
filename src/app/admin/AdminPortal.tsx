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
};
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
          "id, created_at, org_legal_name, ein, counties, contact_name, contact_title, email, status"
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
    ]);
    const [c, s, p, a, b, k, v] = results;
    // New (0007) tables degrade to empty lists until the migration runs.
    const newTableMissing = [a, b, k, v].some(
      (r) => r.error && isMissingTable(r.error)
    );
    setMigrationNote(newTableMissing);
    const hardError =
      c.error ||
      s.error ||
      p.error ||
      [a, b, k, v].find((r) => r.error && !isMissingTable(r.error))?.error;
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
          Some newer tables aren&apos;t set up yet — run migration
          0007_growth_forms.sql in the Supabase SQL editor to enable the
          applications, bin host, pickup, and volunteer lists.
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">
          Partnership applications ({applications.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">EIN</th>
                <th className="px-4 py-3">Counties</th>
                <th className="px-4 py-3">Contact</th>
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
                  <td className="px-4 py-3">{r.status}</td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={6}>
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
