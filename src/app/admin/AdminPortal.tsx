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
    const [c, s, p] = await Promise.all([
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
    ]);
    const firstError = c.error || s.error || p.error;
    if (firstError) {
      setDataError(
        `Could not load submissions (${firstError.message}). If this is a permissions error, confirm migration 0006 has been run and you are signed in as the admin email.`
      );
    }
    setContacts((c.data as Contact[]) ?? []);
    setSignups((s.data as Signup[]) ?? []);
    setPartners((p.data as PartnerRequest[]) ?? []);
    setLoadingData(false);
  }, [supabase]);

  useEffect(() => {
    if (session) void loadData();
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
