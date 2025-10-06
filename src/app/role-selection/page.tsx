'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [dbStatus, setDbStatus] = useState('checking')
  const router = useRouter()
  const { isSignedIn, isLoaded, userId } = useAuth()

  // Check database status
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch('/api/test-all-connections')
        const data = await response.json()
        setDbStatus(data.success ? 'working' : 'failed')
      } catch (error) {
        setDbStatus('failed')
      }
    }
    
    if (isLoaded && isSignedIn) {
      checkDatabase()
    }
  }, [isLoaded, isSignedIn])

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  const roles = [
    {
      value: 'real_estate_agent',
      label: 'Real Estate Agent',
      description: 'Manage transactions, clients, and deals',
      icon: '🏠'
    },
    {
      value: 'buyer',
      label: 'Buyer',
      description: 'Track your home buying process',
      icon: '🔍'
    },
    {
      value: 'seller',
      label: 'Seller',
      description: 'Monitor your home selling progress',
      icon: '📈'
    },
    {
      value: 'title_insurance_agent',
      label: 'Title Insurance Agent',
      description: 'Collaborate on transaction documentation',
      icon: '📋'
    }
  ]

  const handleRoleSelection = async (role: string) => {
    setSelectedRole(role)
    setIsLoading(true)
    setError('')

    try {
      // Try to update role in database
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Role updated successfully:', data)
        // Redirect to dashboard after successful role update
        router.push('/dashboard')
      } else {
        console.error('Failed to update role:', data)
        // Even if database fails, continue with role selection
        if (dbStatus === 'failed') {
          console.log('Database is down, but continuing with role selection')
          // Store role in localStorage as fallback
          localStorage.setItem('userRole', role)
          localStorage.setItem('userId', userId || '')
          router.push('/dashboard')
        } else {
          setError(data.error || 'Failed to update role. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error updating role:', error)
      if (dbStatus === 'failed') {
        // Database is down, use fallback
        localStorage.setItem('userRole', role)
        localStorage.setItem('userId', userId || '')
        router.push('/dashboard')
      } else {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not signed in (will redirect)
  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to CloseTrack!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Please select your role to get started
          </p>
          
          {/* Database Status Indicator */}
          <div className="mt-4">
            {dbStatus === 'checking' && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-2"></div>
                Checking database connection...
              </div>
            )}
            {dbStatus === 'working' && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                ✅ Database connected
              </div>
            )}
            {dbStatus === 'failed' && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                ⚠️ Database offline - using fallback mode
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => handleRoleSelection(role.value)}
              disabled={isLoading}
              className="p-6 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-4xl mb-4">{role.icon}</div>
              <div className="font-semibold text-lg text-gray-900 mb-2">
                {role.label}
              </div>
              <div className="text-gray-600">{role.description}</div>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Setting up your account...</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-500">
            You can change your role later in settings
          </p>
        </div>
      </div>
    </div>
  )
}