import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler"
import { getPublicOrigin, safeNextPath } from "@/lib/request-origin"

export async function GET(req: NextRequest) {
  const next = safeNextPath(req.nextUrl.searchParams.get("next"))

  const origin = getPublicOrigin(req)
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`

  const res = NextResponse.next()
  const supabase = createSupabaseRouteHandlerClient(req, res)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  })

  if (error) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error.message)}`, origin))
  }

  // Important: return a redirect response that includes any cookies set during sign-in (PKCE verifier).
  const redirect = NextResponse.redirect(data.url)
  for (const cookie of res.cookies.getAll()) {
    redirect.cookies.set(cookie)
  }
  return redirect
}
