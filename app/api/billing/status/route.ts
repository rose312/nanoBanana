import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { tierFromPlanKey } from "@/lib/model-access"
import { isSuperVIP } from "@/lib/super-vip"

export const runtime = "nodejs"

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    return NextResponse.json({ authed: false, entitled: false, planKey: null, tier: null })
  }

  // Super VIP users - automatically grant highest tier access
  if (isSuperVIP(user.email)) {
    return NextResponse.json({
      authed: true,
      entitled: true,
      planKey: "plus_yearly", // Highest tier
      tier: "plus",
      superVIP: true,
    })
  }

  const { data: subs, error } = await supabase
    .from("billing_subscriptions")
    .select("plan_key,status,current_period_end_date")
    .order("updated_at", { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json(
      {
        authed: true,
        entitled: false,
        planKey: null,
        tier: null,
        error: "Billing tables not found. Run the Supabase SQL migrations.",
      },
      { status: 503 },
    )
  }

  const now = Date.now()
  const active = (subs ?? []).find((row) => {
    const status = String((row as { status?: unknown }).status ?? "")
    if (!["active", "trialing"].includes(status)) return false
    const end = (row as { current_period_end_date?: unknown }).current_period_end_date
    if (typeof end === "string" && end.length > 0) {
      const endMs = Date.parse(end)
      return Number.isFinite(endMs) ? endMs > now : true
    }
    return true
  })

  const planKey = active ? String((active as { plan_key?: unknown }).plan_key ?? "") || null : null
  const tier = planKey ? tierFromPlanKey(planKey) : null

  return NextResponse.json({
    authed: true,
    entitled: Boolean(planKey),
    planKey,
    tier,
  })
}

