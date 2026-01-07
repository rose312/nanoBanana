"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreemCheckoutButton } from "@/components/creem-checkout-button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { PricingPlanKey } from "@/lib/creem"
import type { PlanTier } from "@/lib/model-access"
import { tierFromPlanKey } from "@/lib/model-access"
import { siteConfig } from "@/lib/site-config"

type Billing = "monthly" | "yearly"

type Plan = {
  name: string
  description: string
  highlight?: boolean
  tier: PlanTier
  priceMonthly: number
  priceYearly: number
  features: string[]
  planKeyByBilling: Record<Billing, PricingPlanKey>
}

export function PricingPlans({ isAuthed, currentPlanKey }: { isAuthed: boolean; currentPlanKey: string | null }) {
  const [billing, setBilling] = useState<Billing>("monthly")
  const currentTier = currentPlanKey ? tierFromPlanKey(currentPlanKey) : null
  const prefersReducedMotion = useReducedMotion()

  const plans = useMemo<Plan[]>(
    () => [
      {
        name: "Pro",
        description: "For creators and solo builders.",
        highlight: true,
        tier: "pro",
        priceMonthly: 19,
        priceYearly: 190,
        features: ["Model: Standard (Gemini 2.5 Flash Image)", "Text-guided image editing", "Commercial use", "Cancel anytime"],
        planKeyByBilling: { monthly: "pro_monthly", yearly: "pro_yearly" },
      },
      {
        name: "Team",
        description: "For teams shipping daily.",
        tier: "team",
        priceMonthly: 49,
        priceYearly: 490,
        features: ["Models: Standard + Pro", "Everything in Pro", "Higher limits", "Team billing"],
        planKeyByBilling: { monthly: "team_monthly", yearly: "team_yearly" },
      },
      {
        name: "Plus",
        description: "Highest tier with the best model.",
        tier: "plus",
        priceMonthly: 99,
        priceYearly: 990,
        features: ["Models: Standard + Pro + Plus", "Highest quality outputs", "Highest limits", "Priority support"],
        planKeyByBilling: { monthly: "plus_monthly", yearly: "plus_yearly" },
      },
    ],
    [],
  )

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-lg border bg-background p-1 transition-all duration-300">
          <Button
            size="sm"
            variant={billing === "monthly" ? "default" : "ghost"}
            onClick={() => setBilling("monthly")}
            className="tap-target transition-all duration-200"
          >
            Monthly
          </Button>
          <Button
            size="sm"
            variant={billing === "yearly" ? "default" : "ghost"}
            onClick={() => setBilling("yearly")}
            className="tap-target transition-all duration-200"
          >
            Yearly
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, index) => {
          const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly
          const unit = billing === "monthly" ? "/mo" : "/yr"
          const planKey = plan.planKeyByBilling[billing]
          const isCurrent = currentTier ? plan.tier === currentTier : false

          return (
            <motion.div
              key={plan.name}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={prefersReducedMotion ? {} : { y: -8, transition: { duration: 0.2 } }}
            >
              <Card
                className={cn(
                  "relative overflow-hidden p-6 h-full transition-all duration-300 hover:shadow-2xl",
                  plan.highlight ? "border-primary shadow-[0_0_0_2px_hsl(var(--primary))] ring-2 ring-primary/20" : "",
                )}
              >
              {plan.highlight ? (
                <motion.div 
                  className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg"
                  initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                  animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  Most popular
                </motion.div>
              ) : null}
              {isCurrent ? (
                <motion.div 
                  className="absolute left-4 top-4 rounded-full border bg-background px-3 py-1 text-xs font-medium shadow-md"
                  initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                  animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  Current plan
                </motion.div>
              ) : null}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">${price}</p>
                  <p className="text-sm text-muted-foreground">{unit}</p>
                </div>
              </div>

              <div className="mt-6">
                {isCurrent ? (
                  <div className="w-full">
                    <Button className="w-full tap-target" variant="outline" disabled>
                      Active
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    <CreemCheckoutButton
                      plan={planKey}
                      isAuthed={isAuthed}
                      label={isAuthed ? "Subscribe" : "Sign in to subscribe"}
                      variant={plan.highlight ? "default" : "outline"}
                    />
                  </div>
                )}
              </div>

              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary/80" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
          )
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Prices shown in USD. Cancel anytime. By subscribing you agree to our{" "}
        <Link className="underline underline-offset-2" href="/terms">
          Terms
        </Link>{" "}
        and{" "}
        <Link className="underline underline-offset-2" href="/privacy">
          Privacy Policy
        </Link>
        . Need help?{" "}
        <a className="underline underline-offset-2" href={`mailto:${siteConfig.supportEmail}`}>
          {siteConfig.supportEmail}
        </a>
        .
      </p>
    </div>
  )
}
