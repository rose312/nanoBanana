import Link from "next/link"
import { AuthButton } from "@/components/auth-button"
import { siteConfig } from "@/lib/site-config"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 hidden border-b bg-background/80 backdrop-blur md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            {siteConfig.name}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/pricing">
              Pricing
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/support">
              Support
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/privacy">
              Privacy
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/terms">
              Terms
            </Link>
          </nav>
        </div>

        <div className="shrink-0">
          <AuthButton />
        </div>
      </div>
    </header>
  )
}

