'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function PostSignUpRedirect() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User just signed up, redirect to role selection
        console.log('User is signed in, redirecting to role selection')
        router.push('/role-selection')
      } else {
        // User is not signed in, redirect to sign-in
        console.log('User is not signed in, redirecting to sign-in')
        router.push('/sign-in')
      }
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Setting up your account...</p>
        <p className="mt-1 text-sm text-gray-500">Please wait while we redirect you</p>
      </div>
    </div>
  )
}
