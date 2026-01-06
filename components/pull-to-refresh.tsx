'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-touch-gestures'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canPull, setCanPull] = useState(false)
  const isMobile = useIsMobile()
  const startY = useRef(0)
  const threshold = 80

  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
        setCanPull(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || isRefreshing) return

      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current

      if (distance > 0 && distance < threshold * 2) {
        setPullDistance(distance)
      }
    }

    const handleTouchEnd = async () => {
      if (!canPull || isRefreshing) return

      if (pullDistance > threshold) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }

      setPullDistance(0)
      setCanPull(false)
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [canPull, isRefreshing, pullDistance, threshold, onRefresh, isMobile])

  const progress = Math.min(pullDistance / threshold, 1)
  const shouldTrigger = pullDistance > threshold

  return (
    <div className="relative">
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              animate={{
                rotate: isRefreshing ? 360 : progress * 180,
                scale: shouldTrigger ? 1.2 : 1,
              }}
              transition={{
                rotate: isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {},
                scale: { duration: 0.2 },
              }}
            >
              <RefreshCw
                className={`h-6 w-6 ${shouldTrigger ? 'text-primary' : 'text-muted-foreground'}`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
}
