import { z } from "zod"

export const pricingPlanKeySchema = z.enum([
  "pro_monthly",
  "pro_yearly",
  "team_monthly",
  "team_yearly",
  "plus_monthly",
  "plus_yearly",
])

export type PricingPlanKey = z.infer<typeof pricingPlanKeySchema>

export function getCreemBaseUrl(): string {
  const explicitRaw = process.env.CREEM_BASE_URL
  if (explicitRaw) {
    const explicit = explicitRaw.trim().replace(/\/+$/, "")
    if (!/^https?:\/\//.test(explicit)) {
      throw new Error("Invalid CREEM_BASE_URL (must start with http:// or https://)")
    }
    return explicit
  }
  return process.env.CREEM_TEST_MODE === "1" ? "https://test-api.creem.io" : "https://api.creem.io"
}

export function getCreemApiKey(): string {
  const key = process.env.CREEM_API_KEY
  if (!key) throw new Error("Missing required env var: CREEM_API_KEY")
  return key
}

export function getCreemProductIdForPlan(plan: PricingPlanKey): string {
  const resolvedEnvName =
    plan === "pro_monthly"
      ? "CREEM_PRODUCT_ID_PRO_MONTHLY"
      : plan === "pro_yearly"
        ? "CREEM_PRODUCT_ID_PRO_YEARLY"
        : plan === "team_monthly"
          ? "CREEM_PRODUCT_ID_TEAM_MONTHLY"
          : plan === "team_yearly"
            ? "CREEM_PRODUCT_ID_TEAM_YEARLY"
            : plan === "plus_monthly"
              ? "CREEM_PRODUCT_ID_PLUS_MONTHLY"
              : "CREEM_PRODUCT_ID_PLUS_YEARLY"

  const productId = process.env[resolvedEnvName]
  if (!productId) throw new Error(`Missing required env var: ${resolvedEnvName}`)
  return productId
}
