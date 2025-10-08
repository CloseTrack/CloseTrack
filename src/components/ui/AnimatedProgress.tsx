'use client'

import { motion } from 'framer-motion'
import { progressVariants } from '@/lib/animations'

interface AnimatedProgressProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
  showPercentage?: boolean
  animated?: boolean
  label?: string
  className?: string
}

const sizeConfig = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

const colorConfig = {
  primary: 'bg-gradient-primary',
  success: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
  warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  error: 'bg-gradient-to-r from-red-500 to-red-600',
}

export default function AnimatedProgress({
  progress,
  size = 'md',
  color = 'primary',
  showPercentage = false,
  animated = true,
  label,
  className = '',
}: AnimatedProgressProps) {
  const sizeClass = sizeConfig[size]
  const colorClass = colorConfig[color]

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClass} overflow-hidden`}>
        <motion.div
          className={`${colorClass} ${sizeClass} rounded-full relative`}
          variants={animated ? progressVariants : undefined}
          initial={animated ? 'initial' : undefined}
          animate={animated ? 'animate' : undefined}
          custom={progress}
          style={animated ? {} : { width: `${progress}%` }}
          transition={{
            duration: animated ? 1.2 : 0,
            ease: 'easeOut',
          }}
        >
          {/* Shimmer effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>
      </div>
      
      {!label && showPercentage && (
        <p className="text-sm text-gray-600 mt-1 text-right">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}

// Circular progress component
interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'success' | 'warning' | 'error'
  animated?: boolean
  showPercentage?: boolean
  className?: string
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  animated = true,
  showPercentage = true,
  className = '',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const colorClasses = {
    primary: 'stroke-blue-600',
    success: 'stroke-emerald-600',
    warning: 'stroke-yellow-600',
    error: 'stroke-red-600',
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className={colorClasses[color]}
          initial={{ strokeDashoffset: animated ? circumference : strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: animated ? 1.2 : 0,
            ease: 'easeOut',
          }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Step progress component
interface StepProgressProps {
  steps: string[]
  currentStep: number
  animated?: boolean
  className?: string
}

export function StepProgress({
  steps,
  currentStep,
  animated = true,
  className = '',
}: StepProgressProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={index} className="flex items-center">
              {/* Step circle */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
                initial={animated ? { scale: 0.8 } : undefined}
                animate={{ scale: 1 }}
                transition={{ delay: animated ? index * 0.1 : 0 }}
              >
                {isCompleted ? (
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: animated ? index * 0.1 + 0.2 : 0, duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Step label */}
              <div className="ml-2 text-sm">
                <p
                  className={`font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200 relative">
                    <motion.div
                      className="h-full bg-emerald-600"
                      initial={{ width: 0 }}
                      animate={{
                        width: isCompleted ? '100%' : '0%',
                      }}
                      transition={{
                        delay: animated ? index * 0.1 + 0.3 : 0,
                        duration: 0.5,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
