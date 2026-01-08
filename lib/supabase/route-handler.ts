import { createServerClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { NextRequest, NextResponse } from "next/server"
import { getSupabaseEnv } from "@/lib/supabase/env"

export function createSupabaseRouteHandlerClient(req: NextRequest, res: NextResponse): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          res.cookies.set(name, value, options as CookieOptions)
        }
      },
    },
  })
}

