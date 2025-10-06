'use client'

import { useState } from 'react'

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testDatabase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-database')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: 'Failed to test database', details: error })
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
      setTestResult({ error: 'Failed to test user creation', details: error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Test Page</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
            <button
              onClick={testDatabase}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Database Connection'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Creation Test</h2>
            <button
              onClick={testUserCreation}
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test User Creation'}
            </button>
          </div>

          {testResult && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>First, test the database connection</li>
              <li>If that fails, check your DATABASE_URL in Vercel</li>
              <li>If connection works but tables are missing, run the SQL script in Supabase</li>
              <li>Then test the role update functionality</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
