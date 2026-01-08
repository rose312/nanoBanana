import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler"
import { getPublicOrigin, safeNextPath } from "@/lib/request-origin"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const next = safeNextPath(req.nextUrl.searchParams.get("next"))
  const origin = getPublicOrigin(req)

  const redirectUrl = new URL(next, origin)
  const res = NextResponse.redirect(redirectUrl)
  if (code) {
    const supabase = createSupabaseRouteHandlerClient(req, res)
    await supabase.auth.exchangeCodeForSession(code).catch(() => null)
  }

  return res
}
