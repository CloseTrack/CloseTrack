'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function TestCompleteFlow() {
  const [dbStatus, setDbStatus] = useState('checking')
  const [testResults, setTestResults] = useState<any>(null)
  const router = useRouter()
  const { isSignedIn, isLoaded, userId } = useAuth()

  useEffect(() => {
    const testFlow = async () => {
      try {
        // Test database connection
        const dbResponse = await fetch('/api/test-usernames')
        const dbData = await dbResponse.json()
        setDbStatus(dbData.success ? 'working' : 'failed')
        setTestResults(dbData)
      } catch (error) {
        setDbStatus('failed')
      }
    }
    
    if (isLoaded && isSignedIn) {
      testFlow()
    }
  }, [isLoaded, isSignedIn])

  const testRoleSelection = () => {
    router.push('/role-selection')
  }

  const testDashboard = () => {
    router.push('/dashboard')
  }

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

  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Flow Test</h1>
          
          {/* Auth Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Authentication Status:</h2>
            <p><strong>Signed In:</strong> Yes</p>
            <p><strong>User ID:</strong> {userId}</p>
          </div>

          {/* Database Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Database Status:</h2>
            <p><strong>Status:</strong> {dbStatus === 'working' ? '✅ Working' : '❌ Failed'}</p>
            {dbStatus === 'failed' && (
              <p className="text-sm text-gray-600 mt-2">
                Database is not working, but the app will use fallback mode
              </p>
            )}
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Database Test Results:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          {/* Test Buttons */}
          <div className="space-y-4">
            <button
              onClick={testRoleSelection}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Role Selection
            </button>
            
            <button
              onClick={testDashboard}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Dashboard
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 rounded">
            <h3 className="font-semibold text-yellow-900">Next Steps:</h3>
            <ol className="list-decimal list-inside text-yellow-800 mt-2 space-y-1">
              <li>Get the EXACT connection string from Supabase Dashboard</li>
              <li>Update DATABASE_URL in Vercel with the exact string</li>
              <li>Test role selection (should work with or without database)</li>
              <li>Test dashboard (will work better with database)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
