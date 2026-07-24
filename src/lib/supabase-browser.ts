"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client for the admin portal ONLY. Unlike the server
 * client (src/lib/supabase.ts, persistSession: false), this one persists the
 * auth session so an admin stays signed in. Reads are still governed by RLS:
 * migration 0006 grants SELECT on the form tables only to the authenticated
 * admin email, so this client is useless to anyone without those credentials.
 */
let _client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!_client) {
    _client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}
