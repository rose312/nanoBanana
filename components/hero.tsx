'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth-button"
import { animations, staggerChildren } from "@/lib/animations"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section 
      id="hero"
      className="relative overflow-hidden px-6 py-24 sm:py-32"
      aria-label="Hero section"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background animate-gradient" />
      
      {/* Floating banana decorations */}
      <motion.div
        className="absolute -right-12 top-12 h-32 w-32 rotate-12 opacity-10"
        animate={prefersReducedMotion ? {} : animations.float.animate}
      >
        <BananaIcon className="h-full w-full" />
      </motion.div>
      <motion.div
        className="absolute -left-12 bottom-12 h-24 w-24 -rotate-12 opacity-10"
        animate={prefersReducedMotion ? {} : {
          y: [10, -10, 10],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <BananaIcon className="h-full w-full" />
      </motion.div>

      <motion.div 
        className="relative mx-auto max-w-4xl text-center"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={prefersReducedMotion ? {} : { ...staggerChildren(0.1), duration: 0.6 }}
      >
        {/* Announcement banner */}
        <motion.div
          initial={prefersReducedMotion ? {} : animations.slideDown.initial}
          animate={prefersReducedMotion ? {} : animations.slideDown.animate}
          transition={prefersReducedMotion ? {} : { delay: 0.1 }}
        >
          <Link
            href="#generator"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-lg">🍌</span>
            <span>Nano Banana Pro is now live</span>
            <span>Try it now</span>
          </Link>
        </motion.div>

        <motion.div 
          className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          initial={prefersReducedMotion ? {} : animations.fadeIn.initial}
          animate={prefersReducedMotion ? {} : animations.fadeIn.animate}
          transition={prefersReducedMotion ? {} : { delay: 0.2 }}
        >
          <span className="text-2xl">🍌</span>
          <span>The AI model that outperforms Flux Kontext</span>
          <Link href="#generator" className="text-foreground underline hover:text-primary transition-colors">
            Try Now →
          </Link>
        </motion.div>

        <motion.h1 
          className="mb-6 text-balance font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text"
          initial={prefersReducedMotion ? {} : animations.slideUp.initial}
          animate={prefersReducedMotion ? {} : animations.slideUp.animate}
          transition={prefersReducedMotion ? {} : { delay: 0.3 }}
        >
          Nano Banana
        </motion.h1>

        <motion.p 
          className="mb-8 text-pretty text-muted-foreground max-w-3xl mx-auto"
          initial={prefersReducedMotion ? {} : animations.fadeIn.initial}
          animate={prefersReducedMotion ? {} : animations.fadeIn.animate}
          transition={prefersReducedMotion ? {} : { delay: 0.4 }}
        >
          Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character
          editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
        </motion.p>

        <motion.div 
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          initial={prefersReducedMotion ? {} : animations.scaleIn.initial}
          animate={prefersReducedMotion ? {} : animations.scaleIn.animate}
          transition={prefersReducedMotion ? {} : { delay: 0.5 }}
        >
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto tap-target" asChild>
            <Link href="#generator">
              Start Editing
              <BananaIcon className="h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="shadow-md hover:shadow-lg w-full sm:w-auto tap-target" asChild>
            <Link href="#showcase">View Examples</Link>
          </Button>
          <Button size="lg" variant="outline" className="shadow-md hover:shadow-lg w-full sm:w-auto tap-target" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
        </motion.div>

        <motion.div 
          className="mt-6"
          initial={prefersReducedMotion ? {} : animations.fadeIn.initial}
          animate={prefersReducedMotion ? {} : animations.fadeIn.animate}
          transition={prefersReducedMotion ? {} : { delay: 0.6 }}
        >
          <AuthButton />
        </motion.div>

        <motion.div 
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          initial={prefersReducedMotion ? {} : animations.fadeIn.initial}
          animate={prefersReducedMotion ? {} : animations.fadeIn.animate}
          transition={prefersReducedMotion ? {} : { delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>One-shot editing</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Multi-image support</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Natural language</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function BananaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.8 3.5c-.5-.2-1.1-.1-1.5.3l-1.5 1.5c-.3-.9-1-1.6-1.9-1.9-.9-.3-1.9-.1-2.6.5-1.5 1.3-2.5 3-2.9 4.9-1.8.5-3.4 1.5-4.5 3-.8 1.1-1.2 2.4-1.2 3.7 0 1.7.7 3.3 1.9 4.5 1.2 1.2 2.8 1.9 4.5 1.9 1.3 0 2.6-.4 3.7-1.2 1.5-1.1 2.5-2.7 3-4.5 1.9-.4 3.6-1.4 4.9-2.9.6-.7.8-1.7.5-2.6-.3-.9-1-1.6-1.9-1.9l1.5-1.5c.4-.4.5-1 .3-1.5-.2-.5-.7-.8-1.3-.8-.2 0-.4 0-.6.1z" />
    </svg>
  )
}
