'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 * 
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
    
    // Fallback for older browsers
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [])

  return prefersReducedMotion
}

/**
 * Get animation props that respect reduced motion preference
 * Returns empty object if user prefers reduced motion
 * 
 * @param animationProps - Animation properties to apply
 * @returns Animation props or empty object
 */
export function useMotionProps<T extends Record<string, any>>(
  animationProps: T
): T | Record<string, never> {
  const prefersReducedMotion = useReducedMotion()
  return prefersReducedMotion ? {} : animationProps
}
