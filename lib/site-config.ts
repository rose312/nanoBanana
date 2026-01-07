export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Banana Studio",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@banana.chatgpt666.online",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://banana.chatgpt666.online",
} as const

