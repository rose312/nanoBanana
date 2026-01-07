'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Sparkles, Image, LifeBuoy, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const [activeSection, setActiveSection] = useState("hero")

  const navItems = [
    { id: "hero", icon: Home, label: "Home", href: "#" },
    { id: "generator", icon: Sparkles, label: "Editor", href: "#generator" },
    { id: "showcase", icon: Image, label: "Gallery", href: "#showcase" },
    { id: "support", icon: LifeBuoy, label: "Support", href: "/support" },
    { id: "pricing", icon: CreditCard, label: "Pricing", href: "/pricing" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "generator", "features", "showcase", "faq"]
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-bottom">
      <div className="bg-card/95 backdrop-blur-lg border-t shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors tap-target",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 relative z-10", isActive && "scale-110")} />
                <span className="text-xs font-medium relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

