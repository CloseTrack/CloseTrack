'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export default function DebugPage() {
  const [dbTest, setDbTest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn, isLoaded, userId } = useAuth()

  const testDatabase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/simple-db-test')
      const data = await response.json()
      setDbTest(data)
    } catch (error) {
      setDbTest({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testUserCreation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setDbTest(data)
    } catch (error) {
      setDbTest({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      testDatabase()
    }
  }, [isLoaded])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Debug Information</h1>
          
          {/* Auth Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Authentication Status:</h2>
            <p><strong>Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
            <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {userId || 'None'}</p>
          </div>

          {/* Database Tests */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Tests:</h2>
            <div className="space-y-4">
              <button
                onClick={testDatabase}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Database Connection'}
              </button>
              
              <button
                onClick={testUserCreation}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
              >
                {isLoading ? 'Creating...' : 'Test User Creation'}
              </button>
            </div>
          </div>

          {/* Results */}
          {dbTest && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Test Results:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(dbTest, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 rounded">
            <h3 className="font-semibold text-yellow-900">Instructions:</h3>
            <ol className="list-decimal list-inside text-yellow-800 mt-2 space-y-1">
              <li>Check the authentication status above</li>
              <li>Test database connection</li>
              <li>If database works, test user creation</li>
              <li>Share all results with me</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
