import type { NextRequest } from "next/server"

function cleanOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "")
}

export function getPublicOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env) return cleanOrigin(env)

  const forwardedProto = req.headers.get("x-forwarded-proto")
  const forwardedHost = req.headers.get("x-forwarded-host")
  const host = forwardedHost ?? req.headers.get("host") ?? req.nextUrl.host

  const proto = forwardedProto ?? req.nextUrl.protocol.replace(":", "") ?? "https"
  return cleanOrigin(`${proto}://${host}`)
}

export function safeNextPath(nextValue: string | null | undefined): string {
  const next = typeof nextValue === "string" ? nextValue.trim() : ""
  if (!next) return "/"

  // Only allow same-site relative redirects to avoid open-redirect issues.
  if (next.startsWith("/")) return next
  return "/"
}

