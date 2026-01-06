import OpenAI from "openai"

let cachedClient: OpenAI | null = null

export function getOpenRouterClient(): OpenAI {
  if (cachedClient) return cachedClient

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("Missing required env var: OPENROUTER_API_KEY")
  }

  const siteUrl = process.env.OPENROUTER_SITE_URL
  const siteName = process.env.OPENROUTER_SITE_NAME

  cachedClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      ...(siteUrl ? { "HTTP-Referer": siteUrl } : {}),
      ...(siteName ? { "X-Title": siteName } : {}),
    },
  })

  return cachedClient
}

