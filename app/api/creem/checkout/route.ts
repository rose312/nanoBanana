import { NextResponse } from "next/server"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getCreemApiKey, getCreemBaseUrl, getCreemProductIdForPlan, pricingPlanKeySchema } from "@/lib/creem"

export const runtime = "nodejs"

const requestSchema = z.object({
  plan: pricingPlanKeySchema,
})

type CreateCheckoutResponse = {
  checkout_url?: string
  checkoutUrl?: string
  id?: string
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = requestSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { plan } = parsed.data
    const productId = getCreemProductIdForPlan(plan)

    const origin = new URL(req.url).origin
    const successUrl = `${origin}/pricing/success?plan=${encodeURIComponent(plan)}`

    const requestId = `bananaStudio_${user.id}_${Date.now()}`

    const { error: insertError } = await supabase.from("billing_checkouts").insert({
      request_id: requestId,
      user_id: user.id,
      plan_key: plan,
      creem_product_id: productId,
      status: "created",
    })
    if (insertError) {
      return NextResponse.json(
        {
          error: "Failed to create checkout record",
          details: insertError.message,
          hint: "Run supabase/migrations/0001_billing.sql in Supabase SQL Editor and ensure RLS policies exist.",
        },
        { status: 500 },
      )
    }

    const creemUrl = `${getCreemBaseUrl()}/v1/checkouts`
    const res = await fetch(creemUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": getCreemApiKey(),
      },
      body: JSON.stringify({
        product_id: productId,
        request_id: requestId,
        success_url: successUrl,
        customer: user.email ? { email: user.email } : undefined,
        metadata: {
          referenceId: user.id,
          userId: user.id,
          plan,
        },
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      await supabase.from("billing_checkouts").update({ status: "failed" }).eq("request_id", requestId)
      return NextResponse.json(
        {
          error: "Creem checkout failed",
          creemUrl,
          status: res.status,
          contentType: res.headers.get("content-type"),
          details: text.slice(0, 1000),
        },
        { status: 502 },
      )
    }

    const raw = await res.text().catch(() => "")
    let dataJson: CreateCheckoutResponse | null = null
    try {
      dataJson = raw ? (JSON.parse(raw) as CreateCheckoutResponse) : null
    } catch {
      await supabase.from("billing_checkouts").update({ status: "failed" }).eq("request_id", requestId)
      return NextResponse.json(
        {
          error: "Creem returned non-JSON response",
          creemUrl,
          contentType: res.headers.get("content-type"),
          details: raw.slice(0, 500),
        },
        { status: 502 },
      )
    }

    const checkoutUrl = dataJson?.checkout_url ?? dataJson?.checkoutUrl
    if (!checkoutUrl) {
      await supabase.from("billing_checkouts").update({ status: "failed" }).eq("request_id", requestId)
      return NextResponse.json({ error: "Creem response missing checkout_url" }, { status: 502 })
    }

    await supabase
      .from("billing_checkouts")
      .update({ status: "redirected", creem_checkout_id: dataJson?.id ?? null })
      .eq("request_id", requestId)

    return NextResponse.json({ checkoutUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
