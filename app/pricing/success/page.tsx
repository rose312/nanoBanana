import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export default async function PricingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const plan = typeof params.plan === "string" ? params.plan : undefined

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-lg border bg-background p-8">
        <h1 className="text-3xl font-bold">Payment successful</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks! If your plan doesn’t update immediately, it may take a moment for the webhook to arrive.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Need help?{" "}
          <a className="underline underline-offset-2" href={`mailto:${siteConfig.supportEmail}`}>
            {siteConfig.supportEmail}
          </a>
          .
        </p>
        {plan ? (
          <p className="mt-4 text-sm">
            Plan: <span className="font-medium">{plan}</span>
          </p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium shadow-sm hover:bg-muted/40"
          >
            View pricing
          </Link>
        </div>
      </div>
    </main>
  )
}
