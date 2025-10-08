'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/lib/animations'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaControls?: string
  ariaPressed?: boolean
  ariaCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
}

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      disabled,
      ariaLabel,
      ariaDescribedBy,
      ariaExpanded,
      ariaControls,
      ariaPressed,
      ariaCurrent,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center
      font-medium rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      touch-manipulation
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim()

    const isDisabled = disabled || loading

    // Filter out props that conflict with Framer Motion
    const { 
      onDrag, 
      onDragStart, 
      onDragEnd, 
      onAnimationStart, 
      onAnimationEnd, 
      onAnimationIteration,
      onTransitionEnd,
      ...motionProps 
    } = props

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        variants={buttonVariants}
        whileHover={!isDisabled ? 'hover' : undefined}
        whileTap={!isDisabled ? 'tap' : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-pressed={ariaPressed}
        aria-current={ariaCurrent}
        aria-busy={loading}
        {...motionProps}
      >
        {loading && (
          <motion.div
            className="mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
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
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}
        
        <span className={loading ? 'sr-only' : ''}>
          {children}
        </span>
        
        {loading && (
          <span className="sr-only">Loading...</span>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </motion.button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton
