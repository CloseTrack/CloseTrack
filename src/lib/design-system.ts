// CloseTrack Design System
// Premium SaaS Design System for Real Estate Professionals

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#007BFF', // Electric Blue - Main brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#0E1B2C', // Deep Navy - Dark accent
  },
  
  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1E293B', // Slate Gray - Main text
    900: '#0f172a',
    950: '#020617',
  },
  
  // Accent Colors
  accent: {
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399', // Mint Green - Success
      500: '#10B981', // Emerald Green - Accent
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#EF4444', // Soft Red - Error/Warning
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }
  },
  
  // Background Colors
  background: {
    primary: '#F9FAFB', // Soft Off-White
    secondary: '#ffffff',
    tertiary: '#f8fafc',
    dark: '#0f172a',
  },
  
  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.25)',
    medium: 'rgba(255, 255, 255, 0.18)',
    dark: 'rgba(0, 0, 0, 0.1)',
    backdrop: 'rgba(255, 255, 255, 0.8)',
  }
}

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Poppins', 'system-ui', 'sans-serif'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  }
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
}

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem', // Main radius for cards
  '3xl': '2rem',
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  glow: '0 0 20px rgba(0, 123, 255, 0.3)',
}

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
}

// Glassmorphism utility classes
export const glassmorphism = {
  light: 'backdrop-blur-lg bg-white/20 border border-white/30',
  medium: 'backdrop-blur-lg bg-white/30 border border-white/40',
  dark: 'backdrop-blur-lg bg-black/20 border border-white/20',
}

// Gradient utilities
export const gradients = {
  primary: 'bg-gradient-to-r from-blue-500 to-emerald-500',
  primaryHover: 'hover:from-blue-600 hover:to-emerald-600',
  glass: 'bg-gradient-to-br from-white/40 to-white/10',
  success: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
  warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
  danger: 'bg-gradient-to-r from-red-400 to-red-600',
}

// Component-specific styles
export const components = {
  button: {
    primary: 'px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg',
    secondary: 'px-6 py-3 rounded-full font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300',
    ghost: 'px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200',
  },
  
  card: {
    glass: 'rounded-2xl backdrop-blur-lg bg-white/20 border border-white/30 shadow-glass',
    elevated: 'rounded-2xl bg-white shadow-xl border border-gray-100',
    interactive: 'rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300',
  },
  
  input: {
    primary: 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200',
    glass: 'w-full px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200',
  }
}

// Status colors for real estate
export const statusColors = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  active: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  urgent: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
}

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
