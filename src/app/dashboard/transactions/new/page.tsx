import { requireAuth } from '@/lib/auth'

export default async function NewTransactionPage() {
  const user = await requireAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Create New Deal</h1>
        <p className="text-gray-600 mt-2">
          Start a new real estate transaction
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Transaction Form Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're building a comprehensive form to create new real estate transactions. 
            This will include property details, client information, and transaction settings.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>What's coming:</strong> Property details, client management, 
              transaction timeline, document uploads, and automated notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
