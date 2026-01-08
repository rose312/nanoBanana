import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler"
import { getPublicOrigin, safeNextPath } from "@/lib/request-origin"

export async function POST(req: NextRequest) {
  const next = safeNextPath(req.nextUrl.searchParams.get("next"))
  const origin = getPublicOrigin(req)

  const res = NextResponse.redirect(new URL(next, origin), { status: 303 })
  const supabase = createSupabaseRouteHandlerClient(req, res)
  await supabase.auth.signOut().catch(() => null)

  return res
}
