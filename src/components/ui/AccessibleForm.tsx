'use client'

import { useState, useRef, FormEvent, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { validateForm, announceToScreenReader } from '@/lib/accessibility'

interface AccessibleFormProps {
  children: ReactNode
  onSubmit: (formData: FormData) => void | Promise<void>
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  validateOnSubmit?: boolean
  announceErrors?: boolean
}

interface FieldError {
  field: string
  message: string
}

export default function AccessibleForm({
  children,
  onSubmit,
  className = '',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  validateOnSubmit = true,
  announceErrors = true,
}: AccessibleFormProps) {
  const [errors, setErrors] = useState<FieldError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formRef.current) return
    
    // Clear previous errors
    setErrors([])
    
    // Validate form if required
    if (validateOnSubmit && !validateForm(formRef.current)) {
      const fieldErrors: FieldError[] = []
      
      // Collect validation errors
      const inputs = formRef.current.querySelectorAll('input, select, textarea')
      inputs.forEach((input) => {
        const element = input as HTMLInputElement
        if (element.hasAttribute('required') && !element.value.trim()) {
          fieldErrors.push({
            field: element.name || element.id,
            message: `${element.getAttribute('aria-label') || element.name || 'This field'} is required`,
          })
        }
      })
      
      setErrors(fieldErrors)
      
      if (announceErrors && fieldErrors.length > 0) {
        announceToScreenReader(`Form validation failed. ${fieldErrors.length} error${fieldErrors.length > 1 ? 's' : ''} found.`)
      }
      
      // Focus first error field
      const firstErrorField = formRef.current.querySelector('[aria-invalid="true"]') as HTMLElement
      if (firstErrorField) {
        firstErrorField.focus()
      }
      
      return
    }
    
    try {
      setIsSubmitting(true)
      const formData = new FormData(formRef.current)
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
      if (announceErrors) {
        announceToScreenReader('Form submission failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-4 ${className}`}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      {/* Global error summary */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          role="alert"
          aria-live="polite"
        >
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please correct the following errors:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>
                <a
                  href={`#${error.field}`}
                  className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  onClick={(e) => {
                    e.preventDefault()
                    const field = formRef.current?.querySelector(`#${error.field}`) as HTMLElement
                    if (field) {
                      field.focus()
                    }
                  }}
                >
                  {error.message}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.form>
  )
}

// Accessible Field Component
interface AccessibleFieldProps {
  label: string
  id: string
  type?: string
  required?: boolean
  error?: string
  helpText?: string
  children: ReactNode
}

export function AccessibleField({
  label,
  id,
  type = 'text',
  required = false,
  error,
  helpText,
  children,
}: AccessibleFieldProps) {
  const fieldId = `${id}-field`
  const errorId = `${id}-error`
  const helpId = `${id}-help`
  
  const describedBy = [error && errorId, helpText && helpId].filter(Boolean).join(' ')

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <div className="relative">
        {children}
      </div>
      
      {helpText && (
        <p id={helpId} className="text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {error && (
        <motion.p
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Accessible Input Component
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
  required?: boolean
}

export function AccessibleInput({
  label,
  error,
  helpText,
  required = false,
  id,
  className = '',
  ...props
}: AccessibleInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <AccessibleField
      label={label}
      id={inputId}
      required={required}
      error={error}
      helpText={helpText}
    >
      <input
        id={inputId}
        className={`input-primary ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[error && `${inputId}-error`, helpText && `${inputId}-help`].filter(Boolean).join(' ')}
        required={required}
        {...props}
      />
    </AccessibleField>
  )
}

// Accessible Select Component
interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  helpText?: string
  required?: boolean
  options: { value: string; label: string; disabled?: boolean }[]
}

export function AccessibleSelect({
  label,
  error,
  helpText,
  required = false,
  options,
  id,
  className = '',
  ...props
}: AccessibleSelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <AccessibleField
      label={label}
      id={selectId}
      required={required}
      error={error}
      helpText={helpText}
    >
      <select
        id={selectId}
        className={`input-primary ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[error && `${selectId}-error`, helpText && `${selectId}-help`].filter(Boolean).join(' ')}
        required={required}
        {...props}
      >
        <option value="" disabled={required}>
          Select an option
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </AccessibleField>
  )
}

// Accessible Textarea Component
interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helpText?: string
  required?: boolean
}

export function AccessibleTextarea({
  label,
  error,
  helpText,
  required = false,
  id,
  className = '',
  ...props
}: AccessibleTextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <AccessibleField
      label={label}
      id={textareaId}
      required={required}
      error={error}
      helpText={helpText}
    >
      <textarea
        id={textareaId}
        className={`input-primary ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[error && `${textareaId}-error`, helpText && `${textareaId}-help`].filter(Boolean).join(' ')}
        required={required}
        rows={4}
        {...props}
      />
    </AccessibleField>
  )
}
