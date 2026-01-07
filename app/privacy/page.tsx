import { siteConfig } from "@/lib/site-config"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-balance text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: January 7, 2026</p>

      <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
        <p>
          This Privacy Policy explains how {siteConfig.name} collects, uses, and shares information when you use our
          website and services.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account information:</strong> When you sign in with Google via Supabase, we receive identifiers like
            your email address and user ID.
          </li>
          <li>
            <strong>Inputs you provide:</strong> Prompts and images you upload are sent to our generation providers to
            create outputs.
          </li>
          <li>
            <strong>Billing information:</strong> Payments are processed by Creem. We store subscription status and
            related IDs needed to enable or disable plan features.
          </li>
          <li>
            <strong>Usage and diagnostics:</strong> We may collect basic analytics and error logs to improve reliability.
          </li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>Provide and operate the service (generation, account access, subscription gating).</li>
          <li>Process payments and manage subscriptions.</li>
          <li>Respond to support requests and communicate service updates.</li>
          <li>Maintain security, prevent abuse, and debug issues.</li>
        </ul>

        <h2>Service providers</h2>
        <p>We rely on third parties to deliver the service:</p>
        <ul>
          <li>Supabase (authentication and database)</li>
          <li>OpenRouter (API gateway to third-party AI models)</li>
          <li>Creem (payments, subscriptions, customer portal)</li>
        </ul>

        <h2>Data retention</h2>
        <p>
          We do not intentionally store the images you upload for generation. We do store account and billing metadata
          required to run subscriptions. Limited logs may be retained for security and debugging.
        </p>

        <h2>Your choices</h2>
        <p>
          You can request support or delete your account data by contacting{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this policy, email{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
        </p>
      </div>
    </main>
  )
}

