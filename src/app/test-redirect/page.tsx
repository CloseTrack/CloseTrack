'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function TestRedirectPage() {
  const { isSignedIn, isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('TestRedirectPage - Auth state:', { isLoaded, isSignedIn, userId })
    
    if (isLoaded) {
      if (isSignedIn) {
        console.log('User is signed in, redirecting to role-selection')
        setTimeout(() => {
          router.push('/role-selection')
        }, 1000)
      } else {
        console.log('User is not signed in, redirecting to sign-in')
        setTimeout(() => {
          router.push('/sign-in')
        }, 1000)
      }
    }
  }, [isLoaded, isSignedIn, userId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Testing redirect...</p>
        <p className="mt-1 text-sm text-gray-500">
          Auth loaded: {isLoaded ? 'Yes' : 'No'} | 
          Signed in: {isSignedIn ? 'Yes' : 'No'} | 
          User ID: {userId || 'None'}
        </p>
      </div>
    </div>
  )
}
