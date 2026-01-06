import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const next = url.searchParams.get("next") ?? "/"

  const origin = url.origin
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  })

  if (error) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error.message)}`, origin))
  }

  return NextResponse.redirect(data.url)
}

