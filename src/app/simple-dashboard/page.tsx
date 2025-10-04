import { auth, currentUser } from '@clerk/nextjs/server'

export default async function SimpleDashboardPage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Authenticated</h1>
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to CloseTrack Dashboard!
          </h1>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Authentication Working!</h2>
              <p className="text-green-700">You are successfully signed in with Clerk.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">User Information</h2>
              <div className="space-y-2 text-blue-700">
                <p><strong>User ID:</strong> {userId}</p>
                <p><strong>Email:</strong> {clerkUser?.emailAddresses[0]?.emailAddress}</p>
                <p><strong>Name:</strong> {clerkUser?.firstName} {clerkUser?.lastName}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Next Steps</h2>
              <div className="space-y-2 text-yellow-700">
                <p>• Authentication is working correctly</p>
                <p>• Database connection may need to be checked</p>
                <p>• Visit <a href="/debug" className="underline">/debug</a> for detailed information</p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <a 
                href="/debug" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Debug Info
              </a>
              <a 
                href="/api/auth-test" 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Test Auth API
              </a>
              <a 
                href="/api/database" 
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Test Database
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
