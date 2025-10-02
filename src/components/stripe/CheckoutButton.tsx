'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutButtonProps {
  priceId: string
  children: React.ReactNode
  className?: string
  successUrl?: string
  cancelUrl?: string
}

export default function CheckoutButton({ 
  priceId, 
  children, 
  className = '',
  successUrl,
  cancelUrl 
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl,
          cancelUrl
        }),
      })

      const { sessionId } = await response.json()

      if (!sessionId) {
        throw new Error('Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        
        if (error) {
          console.error('Stripe error:', error)
          alert('Something went wrong. Please try again.')
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Processing...' : children}
    </button>
  )
}
