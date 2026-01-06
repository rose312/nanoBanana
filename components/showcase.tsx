'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Showcase() {
  const prefersReducedMotion = useReducedMotion()

  const showcaseItems = [
    {
      image: "/majestic-mountain-sunset.png",
      title: "Ultra-Fast Mountain Generation",
      description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
      badge: "Nano Banana Speed",
    },
    {
      image: "/beautiful-zen-garden-with-cherry-blossoms.jpg",
      title: "Instant Garden Creation",
      description: "Complex scene rendered in milliseconds using Nano Banana technology",
      badge: "Nano Banana Speed",
    },
    {
      image: "/tropical-beach-paradise-with-palm-trees.jpg",
      title: "Real-time Beach Synthesis",
      description: "Nano Banana delivers photorealistic results at lightning speed",
      badge: "Nano Banana Speed",
    },
    {
      image: "/northern-lights-aurora-borealis-over-snowy-landsca.jpg",
      title: "Rapid Aurora Generation",
      description: "Advanced effects processed instantly with Nano Banana AI",
      badge: "Nano Banana Speed",
    },
  ]

  return (
    <section 
      id="showcase" 
      className="px-4 py-16 sm:px-6 sm:py-24"
      aria-label="Showcase gallery"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 sm:mb-4">Showcase</h2>
          <p className="text-base sm:text-lg text-muted-foreground">Lightning-Fast AI Creations</p>
          <p className="text-sm sm:text-base text-muted-foreground px-4">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={prefersReducedMotion ? {} : { y: -8, transition: { duration: 0.2 } }}
              className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-2xl"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.title} - Example of AI-generated image`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg">
                  {item.badge}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="mb-2 text-lg sm:text-xl font-semibold">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:mt-12">
          <p className="mb-3 text-sm sm:text-base text-muted-foreground sm:mb-4">Experience the power of Nano Banana yourself</p>
          <Button size="lg" className="tap-target" asChild>
            <Link href="#generator">Try Nano Banana Generator</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
