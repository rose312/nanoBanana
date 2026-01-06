export type PlanTier = "pro" | "team" | "plus"
export type ModelKey = "nano_banana" | "nano_banana_pro" | "nano_banana_plus"

export type ModelOption = {
  key: ModelKey
  label: string
  model: string
  minTier: PlanTier
}

function tierRank(tier: PlanTier): number {
  if (tier === "pro") return 1
  if (tier === "team") return 2
  return 3
}

export function tierFromPlanKey(planKey: string | null | undefined): PlanTier {
  if (planKey && planKey.startsWith("plus_")) return "plus"
  if (planKey && planKey.startsWith("team_")) return "team"
  return "pro"
}

function getEnv(name: string): string | undefined {
  const v = process.env[name]
  return typeof v === "string" && v.length > 0 ? v : undefined
}

export function getModelCatalog(): ModelOption[] {
  const nanoBananaModel = getEnv("NEXT_PUBLIC_OPENROUTER_MODEL_NANO_BANANA") ?? "google/gemini-2.5-flash-image"
  const nanoBananaProModel =
    getEnv("NEXT_PUBLIC_OPENROUTER_MODEL_NANO_BANANA_PRO") ?? "google/gemini-2.5-flash-image-preview"
  const nanoBananaPlusModel =
    getEnv("NEXT_PUBLIC_OPENROUTER_MODEL_NANO_BANANA_PLUS") ?? "google/gemini-3-pro-preview"

  return [
    {
      key: "nano_banana",
      label: "Nano Banana (Gemini 2.5 Flash Image)",
      model: nanoBananaModel,
      minTier: "pro",
    },
    {
      key: "nano_banana_pro",
      label: "Nano Banana Pro (higher tier)",
      model: nanoBananaProModel,
      minTier: "team",
    },
    {
      key: "nano_banana_plus",
      label: "Nano Banana Plus (highest tier)",
      model: nanoBananaPlusModel,
      minTier: "plus",
    },
  ]
}

export function canUseModel(tier: PlanTier, modelKey: ModelKey): boolean {
  const option = getModelCatalog().find((m) => m.key === modelKey)
  if (!option) return false
  return tierRank(tier) >= tierRank(option.minTier)
}

export function defaultModelKeyForTier(tier: PlanTier): ModelKey {
  if (tier === "plus") return "nano_banana_plus"
  if (tier === "team") return "nano_banana_pro"
  return "nano_banana"
}
