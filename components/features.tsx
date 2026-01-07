'use client'

import type React from "react"
import { motion } from "framer-motion"
import { Image as ImageIcon, Layers, MessageSquareText, Sparkles, Users, Zap } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type Feature = {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export function Features() {
  const prefersReducedMotion = useReducedMotion()

  const features: Feature[] = [
    {
      title: "Natural Language Editing",
      description: "Describe the change in text and generate a new result.",
      icon: MessageSquareText,
    },
    {
      title: "Identity-aware edits",
      description: "Designed for edits where key details matter across iterations.",
      icon: Users,
    },
    {
      title: "Scene preservation",
      description: "Keep the original scene while making targeted changes.",
      icon: Layers,
    },
    {
      title: "Fast iteration",
      description: "Upload, prompt, generate, refine.",
      icon: Zap,
    },
    {
      title: "Image + prompt input",
      description: "Bring an input image and a prompt together for guided edits.",
      icon: ImageIcon,
    },
    {
      title: "Creator workflows",
      description: "Useful for content creation, product shots, and creative exploration.",
      icon: Sparkles,
    },
  ]

  return (
    <section id="features" className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-24" aria-label="Core features">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 sm:mb-4">Core Features</h2>
          <p className="text-base sm:text-lg font-medium">A simple editor UI</p>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            We provide an interface to third-party image models via OpenRouter, with tiered access by plan.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={prefersReducedMotion ? {} : { y: -8, transition: { duration: 0.2 } }}
              className="rounded-lg border bg-card p-4 sm:p-6 transition-shadow hover:shadow-xl"
            >
              <div className="mb-3 sm:mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
