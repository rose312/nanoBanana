"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    void (async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [user])

  if (user) {
    return (
      <div className="flex items-center justify-center gap-3">
        <span className="max-w-[220px] truncate text-sm text-muted-foreground">{user.email ?? "Signed in"}</span>
        <form action="/auth/signout?next=/" method="post">
          <Button variant="outline" size="sm" type="submit" disabled={isLoading}>
            Sign out
          </Button>
        </form>
      </div>
    )
  }

  return (
    <Button
      size="lg"
      variant="outline"
      asChild
      onClick={() => setIsLoading(true)}
      disabled={isLoading}
    >
      <Link href="/auth/signin/google?next=/">{isLoading ? "Redirecting..." : "Continue with Google"}</Link>
    </Button>
  )
}
