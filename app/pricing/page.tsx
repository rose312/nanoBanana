import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PricingPlans } from "@/components/pricing-plans"
import { AuthButton } from "@/components/auth-button"
import { ManageSubscriptionButton } from "@/components/manage-subscription-button"

export default async function PricingPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  let currentPlanKey: string | null = null
  let customerId: string | null = null

  if (user) {
    const { data: subRows, error } = await supabase
      .from("billing_subscriptions")
      .select("plan_key,status,current_period_end_date,creem_customer_id")
      .order("updated_at", { ascending: false })

    if (!error && subRows) {
      const now = Date.now()
        const active = subRows.find((row) => {
          const status = String((row as { status?: unknown }).status ?? "")
          if (!["active", "trialing"].includes(status)) return false
          const end = (row as { current_period_end_date?: unknown }).current_period_end_date
          if (typeof end === "string" && end.length > 0) {
            const endMs = Date.parse(end)
            return Number.isFinite(endMs) ? endMs > now : true
        }
        return true
      })
      currentPlanKey = active ? String((active as { plan_key?: unknown }).plan_key ?? "") || null : null
      customerId =
        active && typeof (active as { creem_customer_id?: unknown }).creem_customer_id === "string"
          ? ((active as { creem_customer_id: string }).creem_customer_id || null)
          : null
    }
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Pricing</h1>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
              Choose a plan for fast, high-quality image editing with Nano Banana.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <AuthButton />
            {user ? (
              <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email ?? "user"}.</p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Sign in to purchase a plan.</p>
            )}
            {currentPlanKey ? (
              <p className="mt-2 text-sm">
                Current plan: <span className="font-medium">{currentPlanKey}</span>
              </p>
            ) : null}
            {customerId ? (
              <div className="mt-3">
                <ManageSubscriptionButton customerId={customerId} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10">
          <PricingPlans isAuthed={Boolean(user)} currentPlanKey={currentPlanKey} />
        </div>

        <div className="mt-16 rounded-lg border bg-muted/20 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-medium">Can I cancel anytime?</p>
              <p className="mt-1 text-sm text-muted-foreground">Yes. Your subscription remains active until renewal.</p>
            </div>
            <div>
              <p className="font-medium">Do you offer yearly billing?</p>
              <p className="mt-1 text-sm text-muted-foreground">Yes. Toggle monthly/yearly above.</p>
            </div>
            <div>
              <p className="font-medium">Is my payment info stored here?</p>
              <p className="mt-1 text-sm text-muted-foreground">No. Checkout is handled by Creem.</p>
            </div>
            <div>
              <p className="font-medium">Need help?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Email support or return to the <Link href="/" className="underline">homepage</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
