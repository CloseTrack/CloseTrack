import { requireAuth } from '@/lib/auth'

export default async function TasksPage() {
  const user = await requireAuth()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-600 mt-2">
          Manage your tasks and deadlines
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Task Management Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're building a comprehensive task management system to help you stay organized 
            and never miss important deadlines.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-purple-800">
              <strong>What's coming:</strong> Task creation, deadline tracking, 
              automated reminders, progress monitoring, and team collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
