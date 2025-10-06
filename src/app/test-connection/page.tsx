'use client'

import { useState } from 'react'

export default function TestConnectionPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testDatabaseConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/debug-database')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
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
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Connection Test</h1>
          
          <div className="space-y-4">
            <button
              onClick={testDatabaseConnection}
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

          {testResult && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Test Result:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-900">Instructions:</h3>
            <ol className="list-decimal list-inside text-blue-800 mt-2 space-y-1">
              <li>Click "Test Database Connection" to check if your DATABASE_URL is working</li>
              <li>If successful, click "Test User Creation" to create a user in the database</li>
              <li>If both work, try signing up with a new account</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
