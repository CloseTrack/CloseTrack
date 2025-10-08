'use client'

import { useEffect } from 'react'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  useEffect(() => {
    // Add skip link to the beginning of the document
    const skipLink = document.createElement('a')
    skipLink.href = href
    skipLink.textContent = children as string
    skipLink.className = `sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 ${className}`
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        (target as HTMLElement).focus()
        target.scrollIntoView()
      }
    })
    
    document.body.insertBefore(skipLink, document.body.firstChild)
    
    return () => {
      if (document.body.contains(skipLink)) {
        document.body.removeChild(skipLink)
      }
    }
  }, [href, children, className])
  
  return null
}

// Skip links for common destinations
export function MainContentSkipLink() {
  return <SkipLink href="#main-content">Skip to main content</SkipLink>
}

export function NavigationSkipLink() {
  return <SkipLink href="#main-navigation">Skip to navigation</SkipLink>
}

export function SearchSkipLink() {
  return <SkipLink href="#search">Skip to search</SkipLink>
}
