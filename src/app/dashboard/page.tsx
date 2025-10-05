import { requireAuth } from '@/lib/auth'

export default async function SimpleDashboardPage() {
  try {
    const user = await requireAuth()

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome, {user.firstName || 'User'} {user.lastName || 'Name'}! Your role is {user.role}.
        </p>
        {user.isTemporary && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
            <p className="font-semibold">Temporary User Mode:</p>
            <p>This user object is temporary because the database could not be reached or the user was not found. Please ensure your DATABASE_URL is correct and the database is accessible.</p>
          </div>
        )}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h2 className="text-xl font-semibold text-blue-800">Authentication Successful!</h2>
          <p className="text-blue-700">
            You have successfully authenticated with Clerk and accessed a protected route.
          </p>
          <p className="text-blue-700 mt-2">
            If you are seeing this, your Clerk setup is likely correct.
          </p>
          <p className="text-blue-700 mt-2">
            If you were expecting to see the full dashboard, there might still be an issue with your database connection or user data synchronization.
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-red-900">Error</h1>
        <p className="mt-2 text-red-600">
          There was an error loading the dashboard: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }
}