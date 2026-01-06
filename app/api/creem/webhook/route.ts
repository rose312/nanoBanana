import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { z } from "zod"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.CREEM_WEBHOOK_SECRET
  if (!secret) return false
  if (!signatureHeader) return false

  const computed = createHmac("sha256", secret).update(rawBody).digest("hex")

  const a = Buffer.from(computed)
  const b = Buffer.from(signatureHeader)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

const webhookSchema = z.object({
  eventType: z.string().optional(),
  type: z.string().optional(),
  object: z.unknown().optional(),
  data: z.unknown().optional(),
})

function getEventType(payload: z.infer<typeof webhookSchema>): string {
  return payload.eventType ?? payload.type ?? ""
}

function getEventObject(payload: z.infer<typeof webhookSchema>): unknown {
  if (payload.object !== undefined) return payload.object
  if (typeof payload.data === "object" && payload.data && "object" in payload.data) {
    return (payload.data as { object?: unknown }).object
  }
  return payload.data
}

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null
}

function getIdFromObjectOrString(v: unknown): string | null {
  if (typeof v === "string" && v.length > 0) return v
  if (v && typeof v === "object") return asString((v as { id?: unknown }).id)
  return null
}

function asNumber(v: unknown): number | null {
  return typeof v === "number" ? v : null
}

function parseTimestamptz(v: unknown): string | null {
  if (typeof v === "string" && v.length > 0) return v

  const n = asNumber(v)
  if (n === null) return null
  if (!Number.isFinite(n) || n <= 0) return null

  // Accept either seconds or milliseconds.
  const ms = n > 10_000_000_000 ? n : n * 1000
  return new Date(ms).toISOString()
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get("creem-signature")

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payloadJson: unknown
  try {
    payloadJson = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = webhookSchema.safeParse(payloadJson)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const eventType = getEventType(parsed.data)
  const eventObject = getEventObject(parsed.data)

  const supabase = createSupabaseAdminClient()

  if (eventType === "checkout.completed") {
    if (!eventObject || typeof eventObject !== "object") return NextResponse.json({ ok: true })

    const requestId = asString((eventObject as { request_id?: unknown }).request_id)
    const checkoutId = asString((eventObject as { id?: unknown }).id)

    const subscription = (eventObject as { subscription?: unknown }).subscription
    const subscriptionId = getIdFromObjectOrString(subscription)
    const subscriptionStatus =
      subscription && typeof subscription === "object" ? asString((subscription as { status?: unknown }).status) : null

    const customer = (eventObject as { customer?: unknown }).customer
    const customerId = getIdFromObjectOrString(customer)
    const customerEmail =
      customer && typeof customer === "object" ? asString((customer as { email?: unknown }).email) : null

    const product = (eventObject as { product?: unknown }).product
    const productId = getIdFromObjectOrString(product)

    if (requestId) {
      await supabase
        .from("billing_checkouts")
        .update({ status: "completed", creem_checkout_id: checkoutId ?? undefined, updated_at: new Date().toISOString() })
        .eq("request_id", requestId)

      const { data: checkoutRow } = await supabase
        .from("billing_checkouts")
        .select("user_id, plan_key, creem_product_id")
        .eq("request_id", requestId)
        .maybeSingle()

      if (checkoutRow && customerId) {
        await supabase.from("billing_customers").upsert(
          {
            creem_customer_id: customerId,
            user_id: checkoutRow.user_id,
            email: customerEmail ?? undefined,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "creem_customer_id" },
        )
      }

      if (checkoutRow && subscriptionId) {
        await supabase.from("billing_subscriptions").upsert(
          {
            creem_subscription_id: subscriptionId,
            user_id: checkoutRow.user_id,
            plan_key: checkoutRow.plan_key,
            status: subscriptionStatus ?? "active",
            creem_customer_id: customerId ?? undefined,
            creem_product_id: productId ?? checkoutRow.creem_product_id ?? undefined,
            raw: eventObject,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "creem_subscription_id" },
        )
      }
    }

    return NextResponse.json({ ok: true })
  }

  if (eventType.startsWith("subscription.")) {
    if (!eventObject || typeof eventObject !== "object") return NextResponse.json({ ok: true })

    const subscriptionId = asString((eventObject as { id?: unknown }).id)
    if (!subscriptionId) return NextResponse.json({ ok: true })

    const suffix = eventType.replace("subscription.", "")
    const statusFromObject = asString((eventObject as { status?: unknown }).status)
    const status = ["active", "trialing", "paused", "expired", "canceled"].includes(suffix)
      ? suffix
      : statusFromObject ?? suffix
    const customer = (eventObject as { customer?: unknown }).customer
    const customerId = getIdFromObjectOrString(customer)
    const product = (eventObject as { product?: unknown }).product
    const productId = getIdFromObjectOrString(product)

    const cps = parseTimestamptz((eventObject as { current_period_start_date?: unknown }).current_period_start_date)
    const cpe = parseTimestamptz((eventObject as { current_period_end_date?: unknown }).current_period_end_date)
    const canceledAt = parseTimestamptz((eventObject as { canceled_at?: unknown }).canceled_at)

    const { data: existing } = await supabase
      .from("billing_subscriptions")
      .select("user_id, plan_key")
      .eq("creem_subscription_id", subscriptionId)
      .maybeSingle()

    if (existing) {
      await supabase
        .from("billing_subscriptions")
        .update({
          status,
          creem_customer_id: customerId ?? undefined,
          creem_product_id: productId ?? undefined,
          current_period_start_date: cps ?? undefined,
          current_period_end_date: cpe ?? undefined,
          canceled_at: canceledAt ?? undefined,
          raw: eventObject,
          updated_at: new Date().toISOString(),
        })
        .eq("creem_subscription_id", subscriptionId)
    }

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
