'use client'

import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export default function SignUpPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  // Redirect to role selection if user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/post-signup')
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up to get started with CloseTrack
          </p>
        </div>
        
        <div className="mt-8">
          <SignUp 
            afterSignUpUrl="/role-selection"
            redirectUrl="/role-selection"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              }
            }}
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/sign-in" className="text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}