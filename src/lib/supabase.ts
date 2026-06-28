import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for server-side form writes. Uses the public URL + publishable
 * (anon) key; Row Level Security allows INSERT only, so submissions can be
 * written from the site but not read back through this key.
 *
 * Returns null when env isn't configured so the app still builds/runs and the
 * form routes can fall back to logging.
 */
let _client: SupabaseClient | null = null;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && key);
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!_client) {
    _client = createClient(url as string, key as string, {
      auth: { persistSession: false },
    });
  }
  return _client;
}
