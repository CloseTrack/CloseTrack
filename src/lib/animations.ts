// Animation utilities for CloseTrack
// Premium micro-interactions and smooth animations

import { Variants } from 'framer-motion'

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
}

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
}

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
}

// Card animations
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
  },
}

// Modal animations
export const modalOverlay: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
}

// Button animations
export const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.95,
  },
}

// Progress bar animations
export const progressVariants: Variants = {
  initial: {
    width: '0%',
  },
  animate: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
    },
  }),
}

// Notification animations
export const notificationVariants: Variants = {
  initial: {
    opacity: 0,
    x: 300,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: 300,
    scale: 0.8,
    transition: {
      duration: 0.3,
    },
  },
}

// Loading spinner animations
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Floating animation for success states
export const floatVariants: Variants = {
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Pulse animation for attention
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Slide animations
export const slideInFromLeft: Variants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
}

export const slideInFromRight: Variants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
}

export const slideInFromBottom: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
}

// Fade animations
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const fadeOut: Variants = {
  initial: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

// Scale animations
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
}

export const scaleOut: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
}

// Success animation for completed actions
export const successVariants: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
}

// Error shake animation
export const shakeVariants: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
}

// Bounce animation for attention
export const bounceVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
}

// Wobble animation for errors
export const wobbleVariants: Variants = {
  animate: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
    },
  },
}

// Glow animation for active states
export const glowVariants: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 123, 255, 0.3)',
      '0 0 30px rgba(0, 123, 255, 0.5)',
      '0 0 20px rgba(0, 123, 255, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Typing animation for text
export const typewriterVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const typewriterChar: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
}

// Parallax animation
export const parallaxVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: -50,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Morphing animation for shape changes
export const morphVariants: Variants = {
  initial: {
    borderRadius: '50%',
  },
  animate: {
    borderRadius: '8px',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
}

// Elastic animation for playful interactions
export const elasticVariants: Variants = {
  animate: {
    scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
}

// Wave animation for loading states
export const waveVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Utility function to create staggered delays
export const createStaggerDelay = (index: number, delay: number = 0.1) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: index * delay,
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
})

// Utility function for conditional animations
export const conditionalVariants = (condition: boolean, variants: Variants) =>
  condition ? variants : { initial: {}, animate: {}, exit: {} }

// Easing functions
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
}

// Spring configurations
export const springs = {
  gentle: { type: 'spring', stiffness: 200, damping: 30 },
  wobbly: { type: 'spring', stiffness: 300, damping: 20 },
  stiff: { type: 'spring', stiffness: 400, damping: 25 },
  bouncy: { type: 'spring', stiffness: 500, damping: 15 },
}
