import { createClient } from "@supabase/supabase-js";

// Public project URL and publishable key: safe to ship, access is limited by RLS
// (catalogue read-only, applications and license requests insert-only).
// The defaults keep deploys working before the env vars are set on Vercel.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://sxodhfzogahynzkhhajn.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_Ygq5fyP52njmwZU7c2NQeA_CCk_ecfn";

// Catalogue reads are cached by Next and refreshed at most every minute.
export const CATALOG_TAG = "catalog";

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
  global: {
    fetch: (input, init) =>
      fetch(input, init?.method && init.method !== "GET" ? init : { ...init, next: { revalidate: 60, tags: [CATALOG_TAG] } }),
  },
});
