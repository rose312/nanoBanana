"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { PricingPlanKey } from "@/lib/creem"

export function CreemCheckoutButton({
  plan,
  isAuthed,
  label,
  variant = "default",
}: {
  plan: PricingPlanKey
  isAuthed: boolean
  label: string
  variant?: "default" | "outline"
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClick = async () => {
    setError(null)
    if (!isAuthed) {
      window.location.href = `/auth/signin/google?next=${encodeURIComponent("/pricing")}`
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })

      const contentType = res.headers.get("content-type") ?? ""
      const data: unknown = contentType.includes("application/json") ? await res.json() : await res.text()
      if (!res.ok) {
        const message =
          typeof data === "object" && data && "error" in data && typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : typeof data === "string"
              ? `Checkout failed (${res.status})`
              : "Checkout failed"
        throw new Error(message)
      }

      const checkoutUrl =
        typeof data === "object" &&
        data &&
        "checkoutUrl" in data &&
        typeof (data as { checkoutUrl?: unknown }).checkoutUrl === "string"
          ? (data as { checkoutUrl: string }).checkoutUrl
          : ""

      if (!checkoutUrl) throw new Error("Missing checkoutUrl")
      window.location.href = checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Button className="w-full" variant={variant} onClick={onClick} disabled={isLoading}>
        {isLoading ? "Redirecting..." : label}
      </Button>
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
