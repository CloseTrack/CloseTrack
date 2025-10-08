// Accessibility utilities for CloseTrack
// WCAG 2.1 AA compliance helpers

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color)
    if (!rgb) return 0
    
    const { r, g, b } = rgb
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// WCAG 2.1 AA compliance checkers
export const isWcagAACompliant = (color1: string, color2: string, fontSize: 'normal' | 'large' = 'normal'): boolean => {
  const contrastRatio = getContrastRatio(color1, color2)
  const requiredRatio = fontSize === 'large' ? 3 : 4.5 // Large text is 18pt+ or 14pt+ bold
  return contrastRatio >= requiredRatio
}

// ARIA utilities
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstFocusableElement = focusableElements[0] as HTMLElement
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    }
  }
  
  element.addEventListener('keydown', handleTabKey)
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

export const focusFirstElement = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus()
  }
}

// Keyboard navigation utilities
export const handleArrowKeys = (
  elements: HTMLElement[],
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const keyMap = {
    horizontal: {
      next: 'ArrowRight',
      prev: 'ArrowLeft',
    },
    vertical: {
      next: 'ArrowDown',
      prev: 'ArrowUp',
    },
  }
  
  return (e: KeyboardEvent) => {
    const currentIndex = elements.findIndex(el => el === document.activeElement)
    if (currentIndex === -1) return
    
    const keys = keyMap[orientation]
    
    if (e.key === keys.next) {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % elements.length
      elements[nextIndex].focus()
    } else if (e.key === keys.prev) {
      e.preventDefault()
      const prevIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1
      elements[prevIndex].focus()
    }
  }
}

// Screen reader utilities
export const getScreenReaderText = (element: HTMLElement): string => {
  const ariaLabel = element.getAttribute('aria-label')
  const ariaLabelledBy = element.getAttribute('aria-labelledby')
  const ariaDescribedBy = element.getAttribute('aria-describedby')
  
  let text = ''
  
  if (ariaLabel) {
    text += ariaLabel
  }
  
  if (ariaLabelledBy) {
    const labelledByElement = document.getElementById(ariaLabelledBy)
    if (labelledByElement) {
      text += labelledByElement.textContent || ''
    }
  }
  
  if (ariaDescribedBy) {
    const describedByElement = document.getElementById(ariaDescribedBy)
    if (describedByElement) {
      text += ' ' + (describedByElement.textContent || '')
    }
  }
  
  return text.trim()
}

// High contrast mode detection
export const isHighContrastMode = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for Windows High Contrast Mode
  if (window.matchMedia) {
    return window.matchMedia('(-ms-high-contrast: active)').matches ||
           window.matchMedia('(-ms-high-contrast: white-on-black)').matches ||
           window.matchMedia('(-ms-high-contrast: black-on-white)').matches
  }
  
  return false
}

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Color scheme detection
export const prefersDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Form validation utilities
export const validateForm = (form: HTMLFormElement): boolean => {
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]')
  let isValid = true
  
  inputs.forEach((input) => {
    const element = input as HTMLInputElement
    if (!element.value.trim()) {
      isValid = false
      element.setAttribute('aria-invalid', 'true')
      element.setAttribute('aria-describedby', `${element.id}-error`)
    } else {
      element.removeAttribute('aria-invalid')
    }
  })
  
  return isValid
}

// Skip link functionality
export const createSkipLink = (targetId: string, text: string = 'Skip to main content'): HTMLElement => {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50'
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView()
    }
  })
  
  return skipLink
}

// Live region utilities for dynamic content
export const createLiveRegion = (type: 'polite' | 'assertive' = 'polite'): HTMLElement => {
  const liveRegion = document.createElement('div')
  liveRegion.setAttribute('aria-live', type)
  liveRegion.setAttribute('aria-atomic', 'true')
  liveRegion.className = 'sr-only'
  return liveRegion
}

export const updateLiveRegion = (liveRegion: HTMLElement, message: string) => {
  liveRegion.textContent = message
}

// Error handling for accessibility
export const handleAccessibilityError = (error: Error, context: string) => {
  console.error(`Accessibility error in ${context}:`, error)
  
  // Announce error to screen readers
  announceToScreenReader(`Error: ${error.message}`)
  
  // Could also send to error tracking service
}

// Keyboard shortcuts
export const createKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean
    alt?: boolean
    shift?: boolean
    meta?: boolean
  } = {}
) => {
  return (e: KeyboardEvent) => {
    const { ctrl = false, alt = false, shift = false, meta = false } = options
    
    if (
      e.key === key &&
      e.ctrlKey === ctrl &&
      e.altKey === alt &&
      e.shiftKey === shift &&
      e.metaKey === meta
    ) {
      e.preventDefault()
      callback()
    }
  }
}

// Landmark utilities
export const createLandmark = (type: string, id: string, label?: string): HTMLElement => {
  const landmark = document.createElement(type)
  landmark.id = id
  
  if (label) {
    landmark.setAttribute('aria-label', label)
  }
  
  return landmark
}

// Table accessibility utilities
export const makeTableAccessible = (table: HTMLTableElement) => {
  // Add role if not present
  if (!table.getAttribute('role')) {
    table.setAttribute('role', 'table')
  }
  
  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption')
    caption.textContent = 'Data table'
    table.insertBefore(caption, table.firstChild)
  }
  
  // Ensure proper headers
  const headers = table.querySelectorAll('th')
  headers.forEach((header, index) => {
    if (!header.getAttribute('scope')) {
      header.setAttribute('scope', 'col')
    }
  })
  
  // Add row headers
  const rows = table.querySelectorAll('tr')
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th')
    cells.forEach((cell, cellIndex) => {
      if (cell.tagName === 'TD') {
        const header = headers[cellIndex]
        if (header) {
          cell.setAttribute('headers', header.id || `header-${cellIndex}`)
        }
      }
    })
  })
}
