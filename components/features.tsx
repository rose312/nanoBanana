'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Features() {
  const prefersReducedMotion = useReducedMotion()

  const features = [
    {
      title: "Natural Language Editing",
      description:
        "Edit images using simple text prompts. Nano-banana AI understands complex instructions like GPT for images",
      icon: "💬",
    },
    {
      title: "Character Consistency",
      description:
        "Maintain perfect character details across edits. This model excels at preserving faces and identities",
      icon: "👤",
    },
    {
      title: "Scene Preservation",
      description: "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext",
      icon: "🎨",
    },
    {
      title: "One-Shot Editing",
      description:
        "Perfect results in a single attempt. Nano-banana solves one-shot image editing challenges effortlessly",
      icon: "⚡",
    },
    {
      title: "Multi-Image Context",
      description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
      icon: "🖼️",
    },
    {
      title: "AI UGC Creation",
      description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
      icon: "🎬",
    },
  ]

  return (
    <section 
      id="features"
      className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-24"
      aria-label="Core features"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 sm:mb-4">Core Features</h2>
          <p className="text-base sm:text-lg font-medium">Why Choose Nano Banana?</p>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Nano-banana is the most advanced AI image editor on LMArena. Revolutionize your photo editing with natural
            language understanding
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={prefersReducedMotion ? {} : { y: -8, transition: { duration: 0.2 } }}
              className="rounded-lg border bg-card p-4 sm:p-6 transition-shadow hover:shadow-xl"
            >
              <div className="mb-3 text-3xl sm:text-4xl sm:mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
