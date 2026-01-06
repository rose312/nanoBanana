'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { Menu, X } from 'lucide-react'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const menuItems = [
    { href: '#generator', label: 'Try Editor' },
    { href: '#features', label: 'Features' },
    { href: '#showcase', label: 'Showcase' },
    { href: '#faq', label: 'FAQ' },
    { href: '/pricing', label: 'Pricing' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="tap-target bg-background/80 backdrop-blur-md shadow-lg"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={prefersReducedMotion ? {} : { x: '100%' }}
              animate={prefersReducedMotion ? {} : { x: 0 }}
              exit={prefersReducedMotion ? {} : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-64 bg-card border-l shadow-2xl md:hidden safe-top safe-bottom"
            >
              <nav className="flex flex-col h-full p-6 pt-20">
                <div className="flex-1 space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-accent tap-target"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <Button
                    className="w-full tap-target"
                    size="lg"
                    asChild
                  >
                    <Link href="#generator" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
