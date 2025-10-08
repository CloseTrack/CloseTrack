import { requireAuth } from '@/lib/auth'

export default async function NewClientPage() {
  const user = await requireAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Add New Client</h1>
        <p className="text-gray-600 mt-2">
          Register a new client for your real estate services
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Client Registration Form Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're building a comprehensive client management system. 
            This will include contact information, preferences, and transaction history.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-purple-800">
              <strong>What's coming:</strong> Contact details, communication preferences, 
              transaction history, document sharing, and automated follow-ups.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
