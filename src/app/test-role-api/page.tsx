'use client'

import { useState } from 'react'

export default function TestRoleAPI() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testRoleUpdate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'real_estate_agent' }),
      })

      const data = await response.json()
      setResult({
        status: response.status,
        success: response.ok,
        data: data
      })
    } catch (error) {
      setResult({
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Role API</h1>
          
          <button
            onClick={testRoleUpdate}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Role Update API'}
          </button>

          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Result:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-900">Instructions:</h3>
            <ol className="list-decimal list-inside text-blue-800 mt-2 space-y-1">
              <li>Click "Test Role Update API" button</li>
              <li>Check the result above</li>
              <li>If successful, try role selection again</li>
              <li>If failed, share the error message</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
