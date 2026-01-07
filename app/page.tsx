import { Hero } from "@/components/hero"
import { Generator } from "@/components/generator"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { FAQ } from "@/components/faq"
import { MobileNav } from "@/components/mobile-nav"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default function HomePage() {
  return (
    <>
      <MobileNav />
      <main className="min-h-screen pb-20 md:pb-0">
        <Hero />
        <Generator />
        <Features />
        <Showcase />
        <FAQ />
      </main>
      <MobileBottomNav />
    </>
  )
}
