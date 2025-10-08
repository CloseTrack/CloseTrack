'use client'

import { motion } from 'framer-motion'
import { spinnerVariants, pulseVariants } from '@/lib/animations'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  variant?: 'spinner' | 'pulse' | 'dots' | 'bars'
  className?: string
}

const sizeConfig = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const colorConfig = {
  primary: 'text-primary-600',
  white: 'text-white',
  gray: 'text-gray-600',
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  variant = 'spinner',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClass = sizeConfig[size]
  const colorClass = colorConfig[color]

  if (variant === 'pulse') {
    return (
      <motion.div
        variants={pulseVariants}
        animate="animate"
        className={`${sizeClass} ${colorClass} ${className}`}
      >
        <div className="w-full h-full bg-current rounded-full" />
      </motion.div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${sizeClass} ${colorClass} bg-current rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'bars') {
    return (
      <div className={`flex space-x-1 items-end ${className}`}>
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className={`w-1 ${colorClass} bg-current rounded-full`}
            style={{ height: `${(index + 1) * 4}px` }}
            animate={{
              height: [
                `${(index + 1) * 4}px`,
                `${(index + 1) * 8}px`,
                `${(index + 1) * 4}px`,
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    )
  }

  // Default spinner
  return (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      className={`${sizeClass} ${colorClass} ${className}`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="60"
          opacity="0.3"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="15"
        />
      </svg>
    </motion.div>
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  variant?: LoadingSpinnerProps['variant']
  size?: LoadingSpinnerProps['size']
}

export function LoadingOverlay({ 
  isLoading, 
  message = 'Loading...', 
  variant = 'spinner',
  size = 'lg'
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size={size} variant={variant} />
        {message && (
          <p className="text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </motion.div>
  )
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4"
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
      </div>
      <div className="flex justify-between">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
      </div>
    </motion.div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Progress indicator
interface ProgressIndicatorProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  animated?: boolean
}

export function ProgressIndicator({ 
  progress, 
  size = 'md', 
  showPercentage = false,
  animated = true 
}: ProgressIndicatorProps) {
  const sizeConfig = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${sizeConfig[size]}`}>
        <motion.div
          className={`bg-gradient-primary rounded-full ${sizeConfig[size]}`}
          initial={{ width: animated ? '0%' : `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 1.2 : 0, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 mt-1 text-right">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}
