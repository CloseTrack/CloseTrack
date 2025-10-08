import { requireAuth } from '@/lib/auth'

export default async function TeamManagementPage() {
  const user = await requireAuth()

  // Only brokers should access this page
  if (user.role !== 'broker') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-800 mb-4">Access Restricted</h1>
          <p className="text-red-600">
            Team management is only available for brokers. Your current role is: {user.role}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your real estate team and agents
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Team Management Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're building comprehensive team management tools for brokers to oversee 
            their agents and track team performance.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>What's coming:</strong> Agent management, performance tracking, 
              commission structures, team analytics, and communication tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
