import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium">{siteConfig.name}</p>
          <p className="text-xs text-muted-foreground">
            Support:{" "}
            <a className="underline underline-offset-2 hover:text-foreground" href={`mailto:${siteConfig.supportEmail}`}>
              {siteConfig.supportEmail}
            </a>
          </p>
          <p className="max-w-xl text-xs text-muted-foreground">
            Independent product. Not affiliated with Google, Gemini, or OpenRouter. We provide an interface that routes
            requests to third-party AI models.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link className="text-muted-foreground hover:text-foreground" href="/pricing">
            Pricing
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/support">
            Support
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/terms">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  )
}

