import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-balance text-4xl font-bold tracking-tight">Support</h1>
      <p className="mt-3 text-muted-foreground">
        Email us at{" "}
        <a className="underline underline-offset-2" href={`mailto:${siteConfig.supportEmail}`}>
          {siteConfig.supportEmail}
        </a>
        .
      </p>

      <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
        <h2>Billing & subscriptions</h2>
        <ul>
          <li>
            View plans on the <Link href="/pricing">Pricing</Link> page.
          </li>
          <li>
            Cancel or update billing via the Customer Portal (available on <Link href="/pricing">Pricing</Link> when
            signed in).
          </li>
          <li>If you paid but don’t see your plan update, it may take a moment for the webhook to arrive.</li>
          <li>If you still can’t access your subscription, email us and include the email you used at checkout.</li>
        </ul>

        <h2>Technical issues</h2>
        <p>
          If generation fails, include the prompt and a short description of what happened (and a screenshot if
          possible).
        </p>

        <h2>Policies</h2>
        <ul>
          <li>
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/terms">Terms of Service</Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
