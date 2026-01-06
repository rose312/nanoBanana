/**
 * Animation Utilities
 * Reusable animation configurations and variants for framer-motion
 */

import type { TargetAndTransition, Transition } from 'framer-motion'
import { designTokens } from './design-tokens'

type AnimationPreset = {
  initial?: TargetAndTransition
  animate?: TargetAndTransition
  exit?: TargetAndTransition
  transition?: Transition
}

/**
 * Common animation variants
 */
export const animations: Record<string, AnimationPreset> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { 
      duration: designTokens.animation.duration.base / 1000,
      ease: designTokens.animation.easing.ease,
    },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { 
      duration: designTokens.animation.duration.slow / 1000,
      ease: designTokens.animation.easing.easeOut,
    },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { 
      duration: designTokens.animation.duration.slow / 1000,
      ease: designTokens.animation.easing.easeOut,
    },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { 
      duration: designTokens.animation.duration.base / 1000,
      ease: designTokens.animation.easing.easeOut,
    },
  },

  float: {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  rotate: {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
}

/**
 * Stagger children animation
 */
export const staggerChildren = (staggerDelay = 0.1): Transition => ({
  staggerChildren: staggerDelay,
  delayChildren: 0.1,
})

/**
 * Spring animation configuration
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

/**
 * Smooth transition configuration
 */
export const smoothTransition: Transition = {
  duration: designTokens.animation.duration.base / 1000,
  ease: designTokens.animation.easing.ease,
}
