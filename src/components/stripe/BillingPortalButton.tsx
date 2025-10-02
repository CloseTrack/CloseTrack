'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BillingPortalButtonProps {
  children: React.ReactNode
  className?: string
}

export default function BillingPortalButton({ children, className = '' }: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePortal = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { url } = await response.json()

      if (!url) {
        throw new Error('Failed to create portal session')
      }

      // Redirect to Stripe Customer Portal
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePortal}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
