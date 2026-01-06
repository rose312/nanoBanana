import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseEnv } from "@/lib/supabase/env"

let cached: SupabaseClient | null = null

export function createSupabaseBrowserClient(): SupabaseClient {
  if (cached) return cached
  const { url, anonKey } = getSupabaseEnv()
  cached = createBrowserClient(url, anonKey)
  return cached
}

