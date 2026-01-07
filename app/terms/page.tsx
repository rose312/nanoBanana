import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-balance text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: January 7, 2026</p>

      <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
        <p>
          These Terms govern your use of {siteConfig.name}. By using the service, you agree to these Terms and our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>Service description</h2>
        <p>
          {siteConfig.name} is an independent product that provides an interface to generate and edit images using
          third-party AI models (for example, Google Gemini models) accessed via OpenRouter. We are not affiliated with
          Google or OpenRouter.
        </p>

        <h2>Subscriptions, billing, and cancellation</h2>
        <ul>
          <li>Paid plans renew automatically until canceled.</li>
          <li>
            You can cancel at any time via the Customer Portal (available on the <Link href="/pricing">Pricing</Link>{" "}
            page when signed in). Your plan stays active through the end of the current billing period.
          </li>
          <li>Pricing is shown before checkout. All prices are in USD unless stated otherwise.</li>
        </ul>

        <h2>Refunds</h2>
        <p>
          If you believe you were billed incorrectly, contact{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>. Refunds are handled on a
          case-by-case basis.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the service, including attempting to break security, scrape the site, or generate
          content that violates applicable laws or third-party rights.
        </p>

        <h2>Third-party services</h2>
        <p>
          Model outputs may be influenced by third-party providers. We do not guarantee accuracy, quality, or fitness
          for a particular purpose.
        </p>

        <h2>Support</h2>
        <p>
          For help, email <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> or visit{" "}
          <Link href="/support">Support</Link>.
        </p>

        <h2>Changes</h2>
        <p>We may update these Terms from time to time. The “Last updated” date reflects the latest revision.</p>
      </div>
    </main>
  )
}

