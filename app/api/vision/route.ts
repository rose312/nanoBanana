import { NextResponse } from "next/server"
import { z } from "zod"
import { getOpenRouterClient } from "@/lib/openrouter"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { canUseModel, defaultModelKeyForTier, getModelCatalog, tierFromPlanKey } from "@/lib/model-access"
import { isSuperVIP } from "@/lib/super-vip"

export const runtime = "nodejs"

const requestSchema = z
  .object({
    modelKey: z.enum(["nano_banana", "nano_banana_pro", "nano_banana_plus"]).optional(),
    prompt: z.string().min(1),
    imageUrl: z.string().url().optional(),
    imageDataUrl: z.string().startsWith("data:image/").optional(),
  })
  .refine((v) => Boolean(v.imageUrl || v.imageDataUrl), {
    message: "Either imageUrl or imageDataUrl is required",
    path: ["imageUrl"],
  })

function messageContentToText(content: unknown): string {
  if (typeof content === "string") return content
  if (!Array.isArray(content)) return ""

  return content
    .map((part) => {
      if (!part || typeof part !== "object") return ""
      const type = (part as { type?: unknown }).type
      if (type !== "text") return ""
      const text = (part as { text?: unknown }).text
      return typeof text === "string" ? text : ""
    })
    .filter(Boolean)
    .join("")
}

function messageContentToImages(content: unknown): string[] {
  if (!Array.isArray(content)) return []

  const urls: string[] = []
  for (const part of content) {
    if (!part || typeof part !== "object") continue
    const type = (part as { type?: unknown }).type
    if (type !== "image_url" && type !== "image" && type !== undefined) continue

    const imageUrl = (part as { image_url?: unknown }).image_url
    if (imageUrl && typeof imageUrl === "object") {
      const url = (imageUrl as { url?: unknown }).url
      if (typeof url === "string" && url.length > 0) urls.push(url)
      continue
    }

    const url = (part as { url?: unknown }).url
    if (typeof url === "string" && url.length > 0) urls.push(url)
  }
  return urls
}

function messageImagesToUrls(images: unknown): string[] {
  if (!Array.isArray(images)) return []

  const urls: string[] = []
  for (const item of images) {
    if (!item || typeof item !== "object") continue
    const type = (item as { type?: unknown }).type
    if (type !== "image_url") continue
    const imageUrl = (item as { image_url?: unknown }).image_url
    if (!imageUrl || typeof imageUrl !== "object") continue
    const url = (imageUrl as { url?: unknown }).url
    if (typeof url === "string" && url.length > 0) urls.push(url)
  }
  return urls
}

type OpenRouterChatCompletionsResponse = {
  choices?: Array<{
    message?: {
      content?: unknown
      images?: unknown
    }
  }>
  usage?: unknown
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user
    if (!user) {
      return NextResponse.json({ error: "Please sign in to generate images." }, { status: 401 })
    }

    // Super VIP users - automatically grant highest tier access
    let tier: "pro" | "team" | "plus" = "pro"
    let planKey = ""

    if (isSuperVIP(user.email)) {
      // Super VIP gets highest tier automatically
      tier = "plus"
      planKey = "plus_yearly"
    } else {
      // Regular users - check subscription
      const { data: subs, error: subsError } = await supabase
        .from("billing_subscriptions")
        .select("plan_key,status,current_period_end_date")
        .order("updated_at", { ascending: false })
        .limit(10)

      if (subsError) {
        return NextResponse.json(
          { error: "Billing not configured (missing tables or RLS). Please finish Supabase setup." },
          { status: 503 },
        )
      }

      const now = Date.now()
      const activeSub = (subs ?? []).find((row) => {
        const status = String((row as { status?: unknown }).status ?? "")
        if (!["active", "trialing"].includes(status)) return false
        const end = (row as { current_period_end_date?: unknown }).current_period_end_date
        if (typeof end === "string" && end.length > 0) {
          const endMs = Date.parse(end)
          return Number.isFinite(endMs) ? endMs > now : true
        }
        return true
      })

      if (!activeSub) {
        return NextResponse.json({ error: "Subscription required. Please upgrade on /pricing." }, { status: 402 })
      }

      planKey = String((activeSub as { plan_key?: unknown }).plan_key ?? "")
      tier = tierFromPlanKey(planKey)
    }

    const json = await req.json()
    const parsed = requestSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { prompt, imageUrl, imageDataUrl } = parsed.data

    const requestedModelKey = parsed.data.modelKey ?? defaultModelKeyForTier(tier)
    if (!canUseModel(tier, requestedModelKey)) {
      return NextResponse.json({ error: "This model requires a higher plan. Please upgrade on /pricing." }, { status: 403 })
    }

    const modelOption = getModelCatalog().find((m) => m.key === requestedModelKey)
    if (!modelOption) {
      return NextResponse.json({ error: "Unknown model" }, { status: 400 })
    }

    const model = modelOption.model
    const image = imageUrl ?? imageDataUrl
    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 })
    }

    const openai = getOpenRouterClient()
    const completion = await openai.post<OpenRouterChatCompletionsResponse>("/chat/completions", {
      body: {
        model,
        modalities: ["image", "text"],
        stream: false,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      },
    })

    const message = completion.choices?.[0]?.message
    const messageContent = message?.content ?? ""
    const messageImages = message?.images

    const text =
      typeof messageContent === "string" ? messageContent : messageContentToText(messageContent)
    const images = [
      ...messageImagesToUrls(messageImages),
      ...messageContentToImages(messageContent),
    ]

    return NextResponse.json({
      model,
      text,
      images: Array.from(new Set(images)),
      usage: completion.usage ?? null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
