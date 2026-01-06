import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const url = new URL(req.url)
  const next = url.searchParams.get("next") ?? "/"

  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL(next, url.origin), { status: 303 })
}
