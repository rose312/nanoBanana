'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Reviews() {
  const prefersReducedMotion = useReducedMotion()

  const reviews = [
    {
      name: "AIArtistPro",
      role: "Digital Creator",
      content:
        "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
      avatar: "👨‍🎨",
    },
    {
      name: "ContentCreator",
      role: "UGC Specialist",
      content:
        "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
      avatar: "👩‍💼",
    },
    {
      name: "PhotoEditor",
      role: "Professional Editor",
      content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
      avatar: "📸",
    },
  ]

  return (
    <section 
      className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-24"
      aria-label="User reviews"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 sm:mb-4">User Reviews</h2>
          <p className="text-sm sm:text-base text-muted-foreground">What creators are saying</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={prefersReducedMotion ? {} : { y: -8, transition: { duration: 0.2 } }}
              className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 text-xl sm:text-2xl">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">{review.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">&quot;{review.content}&quot;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
